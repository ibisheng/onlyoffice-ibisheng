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


    /*
     * Import
     * -----------------------------------------------------------------------------
     */
    var CellValueType = AscCommon.CellValueType;
    var c_oAscBorderStyles = AscCommon.c_oAscBorderStyles;
    var c_oAscBorderType = AscCommon.c_oAscBorderType;
    var c_oAscLockTypes = AscCommon.c_oAscLockTypes;
    var c_oAscFormatPainterState = AscCommon.c_oAscFormatPainterState;
    var c_oAscPrintDefaultSettings = AscCommon.c_oAscPrintDefaultSettings;
    var AscBrowser = AscCommon.AscBrowser;
    var CColor = AscCommon.CColor;
    var fSortAscending = AscCommon.fSortAscending;
    var parserHelp = AscCommon.parserHelp;
    var gc_nMaxDigCountView = AscCommon.gc_nMaxDigCountView;
    var gc_nMaxRow0 = AscCommon.gc_nMaxRow0;
    var gc_nMaxCol0 = AscCommon.gc_nMaxCol0;
    var gc_nMaxRow = AscCommon.gc_nMaxRow;
    var gc_nMaxCol = AscCommon.gc_nMaxCol;
    var History = AscCommon.History;

    var asc = window["Asc"];
    var asc_applyFunction = AscCommonExcel.applyFunction;
    var asc_calcnpt = asc.calcNearestPt;
    var asc_getcvt = asc.getCvtRatio;
    var asc_floor = asc.floor;
    var asc_ceil = asc.ceil;
    var asc_obj2Color = asc.colorObjToAscColor;
    var asc_typeof = asc.typeOf;
    var asc_incDecFonSize = asc.incDecFonSize;
    var asc_debug = asc.outputDebugStr;
    var asc_Range = asc.Range;
    var asc_CMM = AscCommonExcel.asc_CMouseMoveData;
    var asc_VR = AscCommonExcel.VisibleRange;

    var asc_CFont = AscCommonExcel.asc_CFont;
    var asc_CFill = AscCommonExcel.asc_CFill;
    var asc_CCellInfo = AscCommonExcel.asc_CCellInfo;
    var asc_CHyperlink = asc.asc_CHyperlink;
    var asc_CPageOptions = asc.asc_CPageOptions;
    var asc_CPageSetup = asc.asc_CPageSetup;
    var asc_CPageMargins = asc.asc_CPageMargins;
    var asc_CPagePrint = AscCommonExcel.CPagePrint;
    var asc_CAutoFilterInfo = AscCommonExcel.asc_CAutoFilterInfo;

    var c_oTargetType = AscCommonExcel.c_oTargetType;
    var c_oAscCanChangeColWidth = AscCommonExcel.c_oAscCanChangeColWidth;
    var c_oAscLockTypeElemSubType = AscCommonExcel.c_oAscLockTypeElemSubType;
    var c_oAscLockTypeElem = AscCommonExcel.c_oAscLockTypeElem;
    var c_oAscGraphicOption = AscCommonExcel.c_oAscGraphicOption;
    var c_oAscError = asc.c_oAscError;
    var c_oAscMergeOptions = asc.c_oAscMergeOptions;
    var c_oAscInsertOptions = asc.c_oAscInsertOptions;
    var c_oAscDeleteOptions = asc.c_oAscDeleteOptions;
    var c_oAscBorderOptions = asc.c_oAscBorderOptions;
    var c_oAscCleanOptions = asc.c_oAscCleanOptions;
    var c_oAscSelectionType = asc.c_oAscSelectionType;
    var c_oAscSelectionDialogType = asc.c_oAscSelectionDialogType;
    var c_oAscAutoFilterTypes = asc.c_oAscAutoFilterTypes;
    var c_oAscChangeTableStyleInfo = asc.c_oAscChangeTableStyleInfo;
    var c_oAscChangeSelectionFormatTable = asc.c_oAscChangeSelectionFormatTable;
    var asc_CSelectionMathInfo = AscCommonExcel.asc_CSelectionMathInfo;
    var vector_koef = AscCommonExcel.vector_koef;

    /*
     * Constants
     * -----------------------------------------------------------------------------
     */

    /**
     * header styles
     * @const
     */
    var kHeaderDefault = 0;
    var kHeaderActive = 1;
    var kHeaderHighlighted = 2;

    /**
     * cursor styles
     * @const
     */
    var kCurDefault = "default";
    var kCurCorner = "pointer";
    var kCurColSelect = "pointer";
    var kCurColResize = "col-resize";
    var kCurRowSelect = "pointer";
    var kCurRowResize = "row-resize";
    // Курсор для автозаполнения
    var kCurFillHandle = "crosshair";
    // Курсор для гиперссылки
    var kCurHyperlink = "pointer";
    // Курсор для перемещения области выделения
    var kCurMove = "move";
    var kCurSEResize = "se-resize";
    var kCurNEResize = "ne-resize";
    var kCurAutoFilter = "pointer";
    var kCurCells = '';
    var kCurFormatPainterExcel = '';
    if (AscBrowser.isIE) {
        // Пути указаны относительно html в меню, не надо их исправлять
        // и коммитить на пути относительно тестового меню
        var cursorRetina = AscBrowser.isRetina ? '_2x' : '';
        cursorRetina = ''; // ToDo 2x cursors
        kCurCells = 'url(../../../../sdkjs/common/Images/plus' + cursorRetina + '.cur), pointer';
        kCurFormatPainterExcel = 'url(../../../../sdkjs/common/Images/plus_copy' + cursorRetina + '.cur), pointer';
    } else if (AscBrowser.isOpera) {
        kCurCells = 'cell';
        kCurFormatPainterExcel = 'pointer';
    } else {
        // ToDo 2x cursors
        /*if (AscBrowser.isRetina) {
            kCurCells =
              "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGtJREFUeNpidHFxYSAS/Ccgz0iMIUwMdAYspGrYvXs3Ct/V1ZUk/XT34aiFoxYOfgtZiChBqFUSDXBJg16CkFvy4AKwEmk0ldIuDokt9YdcbcFCbE09ZGv8UQtHLRxCJQ2xgNSSZcB9CBBgAA9FEd4uFbt8AAAAAElFTkSuQmCC') 12 12, pointer";
            kCurFormatPainterExcel =
              "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAASFJREFUeNrsmU0SgyAMhQnD0eDUcre4KU5EwMQpf0pW2kX7zePlJVpARDVD6YHZcAZQjGH1qJDW2tO9HhmSwpre3ouLwCnvfbgEPQOkUkqZjt7LVoC01kK4hkY5KoYMSoYyPSAJTPLYewQ+C5JTphUkBUx9NswIjbNRqixwDM6Jltj827Zlm6jk0Vwz1VYUOOpxxBJ79KfUUc45Dix670/HT7LyNppaehRSDcWFrAqaOM6sDegkGmVxvsBSJUtergZa+NEDlqNkM0VjLyZ8CJxMrTaZQhoAwOmepAZIvm/kh7uLov/a81DSUG96XE57NJ44TyfVnWff+AJigbbxKNdDD7an7ynKzTXRhr+aaYEu0AX6tckk3dyXorlpMssfYvsAnpmCy8p26IoAAAAASUVORK5CYII=') 12 25, pointer";
        } else {*/
            kCurCells =
              "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAFJJREFUeNpidHFxYcAC/qPxGdEVMDHgALt37wZjXACnRkKA/hpZsAQEMYHFwAAM1f+kApAeipzK4OrqijU6cMnBNDJSNQEMznjECnAFCgwABBgAcX1BU/hbd0sAAAAASUVORK5CYII=') 6 6, pointer";
            kCurFormatPainterExcel =
              "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAUCAYAAABiS3YzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAK1JREFUeNrUk+ESxBAMhG3Hm+GpeTfF0Eld0uLcj9uZTP3xdZMsxBjVRhXYsRNora2n5HSxbjLGtKPSX7uqCiHkD1adUlcfLnMdKw6zq94plXbOiVskKm1575GAF1iS6DQBSjECdUp+gFcoJ9LyBe6B09BuluCA09A8fwCK7AHsopiljCxOBLY5xVnVO2KWd779W/uKy2qLk5DjVyhGwz+qn7T/P1D9FPRVnQIMABDnBAmTp4GtAAAAAElFTkSuQmCC') 6 12, pointer";
        //}
    }

    var kNewLine = "\n";

    var kMaxAutoCompleteCellEdit = 20000;

    function calcDecades(num) {
        return Math.abs(num) < 10 ? 1 : 1 + calcDecades(asc_floor(num * 0.1));
    }

    function CacheElement() {
        if (!(this instanceof CacheElement)) {
            return new CacheElement();
        }
        this.columnsWithText = {};							// Колонки, в которых есть текст
        this.columns = {};
        this.erased = {};
        return this;
    }

    function Cache() {
        if (!(this instanceof Cache)) {
            return new Cache();
        }

        this.rows = {};
        this.sectors = [];

        this.reset = function () {
            this.rows = {};
            this.sectors = [];
        };

        // Structure of cache
        //
        // cache : {
        //
        //   rows : {
        //     0 : {
        //       columns : {
        //         0 : {
        //           text : {
        //             cellHA  : String,
        //             cellVA  : String,
        //             cellW   : Number,
        //             color   : String,
        //             metrics : TextMetrics,
        //             sideL   : Number,
        //             sideR   : Number,
        //             state   : StringRenderInternalState
        //           }
        //         }
        //       },
        //       erased : {
        //         1 : true, 2 : true
        //       }
        //     }
        //   },
        //
        //   sectors: [
        //     0 : Range
        //   ]
        //
        // }
    }

    function CellFlags() {
        this.wrapText = false;
        this.shrinkToFit = false;
        this.merged = null;
        this.textAlign = null;
    }

    CellFlags.prototype.clone = function () {
        var oRes = new CellFlags();
        oRes.wrapText = this.wrapText;
        oRes.shrinkToFit = this.shrinkToFit;
        oRes.merged = this.merged ? this.merged.clone() : null;
        oRes.textAlign = this.textAlign;
        return oRes;
    };
    CellFlags.prototype.isMerged = function () {
        return null !== this.merged;
    };

    function CellBorderObject(borders, mergeInfo, col, row) {
        this.borders = borders;
        this.mergeInfo = mergeInfo;

        this.col = col;
        this.row = row;
    }

    CellBorderObject.prototype.isMerge = function () {
        return null != this.mergeInfo;
    };
    CellBorderObject.prototype.getLeftBorder = function () {
        if (!this.borders ||
          (this.isMerge() && (this.col !== this.mergeInfo.c1 || this.col - 1 !== this.mergeInfo.c2))) {
            return null;
        }
        return this.borders.l;
    };
    CellBorderObject.prototype.getRightBorder = function () {
        if (!this.borders ||
          (this.isMerge() && (this.col - 1 !== this.mergeInfo.c1 || this.col !== this.mergeInfo.c2))) {
            return null;
        }
        return this.borders.r;
    };

    CellBorderObject.prototype.getTopBorder = function () {
        if (!this.borders ||
          (this.isMerge() && (this.row !== this.mergeInfo.r1 || this.row - 1 !== this.mergeInfo.r2))) {
            return null;
        }
        return this.borders.t;
    };
    CellBorderObject.prototype.getBottomBorder = function () {
        if (!this.borders ||
          (this.isMerge() && (this.row - 1 !== this.mergeInfo.r1 || this.row !== this.mergeInfo.r2))) {
            return null;
        }
        return this.borders.b;
    };


    /**
     * Widget for displaying and editing Worksheet object
     * -----------------------------------------------------------------------------
     * @param {AscCommonExcel.Woorksheet} model  Worksheet
     * @param {AscCommonExcel.asc_CHandlersList} handlers  Event handlers
     * @param {Object} buffers    DrawingContext + Overlay
     * @param {AscCommonExcel.StringRender} stringRender    StringRender
     * @param {Number} maxDigitWidth    Максимальный размер цифры
     * @param {CCollaborativeEditing} collaborativeEditing
     * @param {Object} settings  Settings
     *
     * @constructor
     * @memberOf Asc
     */
    function WorksheetView(model, handlers, buffers, stringRender, maxDigitWidth, collaborativeEditing, settings) {
        this.settings = settings;

        this.vspRatio = 1.275;

        this.handlers = handlers;
        this.model = model;

        this.buffers = buffers;
        this.drawingCtx = this.buffers.main;
        this.overlayCtx = this.buffers.overlay;

        this.drawingGraphicCtx = this.buffers.mainGraphic;
        this.overlayGraphicCtx = this.buffers.overlayGraphic;

        this.shapeCtx = this.buffers.shapeCtx;
        this.shapeOverlayCtx = this.buffers.shapeOverlayCtx;

        this.stringRender = stringRender;

        // Флаг, сигнализирует о том, что мы сделали resize, но это не активный лист (поэтому как только будем показывать, нужно перерисовать и пересчитать кеш)
        this.updateResize = false;
        // Флаг, сигнализирует о том, что мы сменили zoom, но это не активный лист (поэтому как только будем показывать, нужно перерисовать и пересчитать кеш)
        this.updateZoom = false;
        // ToDo Флаг-заглушка, для того, чтобы на mobile не было изменения высоты строк при zoom (по правильному высота просто не должна меняться)
        this.notUpdateRowHeight = false;

        this.cache = new Cache();

        //---member declaration---
        // Максимальная ширина числа из 0,1,2...,9, померенная в нормальном шрифте(дефалтовый для книги) в px(целое)
        // Ecma-376 Office Open XML Part 1, пункт 18.3.1.13
        this.maxDigitWidth = maxDigitWidth;

        this.nBaseColWidth = 8; // Число символов для дефалтовой ширины (по умолчинию 8)
        this.defaultColWidthChars = 0;
        this.defaultColWidth = 0;
        this.defaultRowHeight = 0;
        this.defaultRowDescender = 0;
        this.headersLeft = 0;
        this.headersTop = 0;
        this.headersWidth = 0;
        this.headersHeight = 0;
        this.headersHeightByFont = 0;	// Размер по шрифту (размер без скрытия заголовков)
        this.cellsLeft = 0;
        this.cellsTop = 0;
        this.cols = [];
        this.rows = [];
        this.width_1px = 0;
        this.width_2px = 0;
        this.width_3px = 0;
        this.width_4px = 0;
        this.width_padding = 0;
        this.height_1px = 0;
        this.height_2px = 0;
        this.height_3px = 0;
        this.height_4px = 0;
        this.highlightedCol = -1;
        this.highlightedRow = -1;
        this.topLeftFrozenCell = null;	// Верхняя ячейка для закрепления диапазона
        this.visibleRange = new asc_Range(0, 0, 0, 0);
        this.isChanged = false;
        this.isCellEditMode = false;
        this.isFormulaEditMode = false;
        this.isChartAreaEditMode = false;
        this.lockDraw = false;
        this.isSelectOnShape = false;	// Выделен shape

        this.stateFormatPainter = c_oAscFormatPainterState.kOff;

        this.selectionDialogType = c_oAscSelectionDialogType.None;
        this.isSelectionDialogMode = false;
        this.copyActiveRange = null;

        this.startCellMoveResizeRange = null;
        this.startCellMoveResizeRange2 = null;
        this.moveRangeDrawingObjectTo = null;

        // Координаты ячейки начала перемещения диапазона
        this.startCellMoveRange = null;
        // Дипазон перемещения
        this.activeMoveRange = null;
        // Range fillHandle
        this.activeFillHandle = null;
        // Горизонтальное (0) или вертикальное (1) направление автозаполнения
        this.fillHandleDirection = -1;
        // Зона автозаполнения
        this.fillHandleArea = -1;
        this.nRowsCount = 0;
        this.nColsCount = 0;
        // Массив ячеек для текущей формулы
        this.arrActiveFormulaRanges = [];
        this.arrActiveFormulaRangesPosition = -1;
        this.arrActiveChartRanges = [new AscCommonExcel.SelectionRange(this.model)];
        //------------------------

        this.collaborativeEditing = collaborativeEditing;

        this.drawingArea = new AscFormat.DrawingArea(this);
        this.cellCommentator = new AscCommonExcel.CCellCommentator(this);
        this.objectRender = null;

        this._init();

        return this;
    }

    WorksheetView.prototype.getCellVisibleRange = function (col, row) {
        var vr, offsetX = 0, offsetY = 0, cFrozen, rFrozen;
        if (this.topLeftFrozenCell) {
            cFrozen = this.topLeftFrozenCell.getCol0() - 1;
            rFrozen = this.topLeftFrozenCell.getRow0() - 1;
            if (col <= cFrozen && row <= rFrozen) {
                vr = new asc_Range(0, 0, cFrozen, rFrozen);
            } else if (col <= cFrozen) {
                vr = new asc_Range(0, this.visibleRange.r1, cFrozen, this.visibleRange.r2);
                offsetY -= this.rows[rFrozen + 1].top - this.cellsTop;
            } else if (row <= rFrozen) {
                vr = new asc_Range(this.visibleRange.c1, 0, this.visibleRange.c2, rFrozen);
                offsetX -= this.cols[cFrozen + 1].left - this.cellsLeft;
            } else {
                vr = this.visibleRange;
                offsetX -= this.cols[cFrozen + 1].left - this.cellsLeft;
                offsetY -= this.rows[rFrozen + 1].top - this.cellsTop;
            }
        } else {
            vr = this.visibleRange;
        }

        offsetX += this.cols[vr.c1].left - this.cellsLeft;
        offsetY += this.rows[vr.r1].top - this.cellsTop;

        return vr.contains(col, row) ? new asc_VR(vr, offsetX, offsetY) : null;
    };

    WorksheetView.prototype.getCellMetrics = function (col, row) {
        var vr, nColSize, nRowSize;
        if (vr = this.getCellVisibleRange(col, row)) {
            nColSize = this.getColSize(col);
            nRowSize = this.getRowSize(row);
            if (nColSize && nRowSize) {
                return {
                    left: nColSize.left - vr.offsetX,
                    top: nRowSize.top - vr.offsetY,
                    width: nColSize.width,
                    height: nRowSize.height
                };
            }
        }
        return null;
    };

    WorksheetView.prototype.getColSize = function (col) {
        return (col >= 0 && col < this.cols.length) ? this.cols[col] : null;
    };

    WorksheetView.prototype.getRowSize = function (row) {
        return (row >= 0 && row < this.rows.length) ? this.rows[row] : null;
    };

    WorksheetView.prototype.getFrozenCell = function () {
        return this.topLeftFrozenCell;
    };

    WorksheetView.prototype.getVisibleRange = function () {
        return this.visibleRange;
    };

    WorksheetView.prototype.updateVisibleRange = function () {
        return this._updateCellsRange(this.getVisibleRange());
    };

    WorksheetView.prototype.getFirstVisibleCol = function (allowPane) {
        var tmp = 0;
        if (allowPane && this.topLeftFrozenCell) {
            tmp = this.topLeftFrozenCell.getCol0();
        }
        return this.visibleRange.c1 - tmp;
    };

    WorksheetView.prototype.getLastVisibleCol = function () {
        return this.visibleRange.c2;
    };

    WorksheetView.prototype.getFirstVisibleRow = function (allowPane) {
        var tmp = 0;
        if (allowPane && this.topLeftFrozenCell) {
            tmp = this.topLeftFrozenCell.getRow0();
        }
        return this.visibleRange.r1 - tmp;
    };

    WorksheetView.prototype.getLastVisibleRow = function () {
        return this.visibleRange.r2;
    };

    WorksheetView.prototype.getHorizontalScrollRange = function () {
        var ctxW = this.drawingCtx.getWidth() - this.cellsLeft;
        for (var w = 0, i = this.cols.length - 1; i >= 0; --i) {
            w += this.cols[i].width;
            if (w > ctxW) {
                break;
            }
        }
        return i; // Диапазон скрола должен быть меньше количества столбцов, чтобы не было прибавления столбцов при перетаскивании бегунка
    };

    WorksheetView.prototype.getVerticalScrollRange = function () {
        var ctxH = this.drawingCtx.getHeight() - this.cellsTop;
        for (var h = 0, i = this.rows.length - 1; i >= 0; --i) {
            h += this.rows[i].height;
            if (h > ctxH) {
                break;
            }
        }
        return i; // Диапазон скрола должен быть меньше количества строк, чтобы не было прибавления строк при перетаскивании бегунка
    };

    WorksheetView.prototype.getCellsOffset = function (units) {
        var u = units >= 0 && units <= 3 ? units : 0;
        return {
            left: this.cellsLeft * asc_getcvt(1/*pt*/, u, this._getPPIX()),
            top: this.cellsTop * asc_getcvt(1/*pt*/, u, this._getPPIY())
        };
    };

    WorksheetView.prototype.getCellLeft = function (column, units) {
        if (column >= 0 && column < this.cols.length) {
            var u = units >= 0 && units <= 3 ? units : 0;
            return this.cols[column].left * asc_getcvt(1/*pt*/, u, this._getPPIX());
        }
        return null;
    };

    WorksheetView.prototype.getCellTop = function (row, units) {
        if (row >= 0 && row < this.rows.length) {
            var u = units >= 0 && units <= 3 ? units : 0;
            return this.rows[row].top * asc_getcvt(1/*pt*/, u, this._getPPIY());
        }
        return null;
    };

    WorksheetView.prototype.getCellLeftRelative = function (col, units) {
        if (col < 0 || col >= this.cols.length) {
            return null;
        }
        // С учетом видимой области
        var offsetX = 0;
        if (this.topLeftFrozenCell) {
            var cFrozen = this.topLeftFrozenCell.getCol0();
            offsetX = (col < cFrozen) ? 0 : this.cols[this.visibleRange.c1].left - this.cols[cFrozen].left;
        } else {
            offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft;
        }

        var u = units >= 0 && units <= 3 ? units : 0;
        return (this.cols[col].left - offsetX) * asc_getcvt(1/*pt*/, u, this._getPPIX());
    };

    WorksheetView.prototype.getCellTopRelative = function (row, units) {
        if (row < 0 || row >= this.rows.length) {
            return null;
        }
        // С учетом видимой области
        var offsetY = 0;
        if (this.topLeftFrozenCell) {
            var rFrozen = this.topLeftFrozenCell.getRow0();
            offsetY = (row < rFrozen) ? 0 : this.rows[this.visibleRange.r1].top - this.rows[rFrozen].top;
        } else {
            offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
        }

        var u = units >= 0 && units <= 3 ? units : 0;
        return (this.rows[row].top - offsetY) * asc_getcvt(1/*pt*/, u, this._getPPIY());
    };

    WorksheetView.prototype.getColumnWidth = function (index, units) {
        if (index >= 0 && index < this.cols.length) {
            var u = units >= 0 && units <= 3 ? units : 0;
            return this.cols[index].width * asc_getcvt(1/*pt*/, u, this._getPPIX());
        }
        return null;
    };

    WorksheetView.prototype.getSelectedColumnWidthInSymbols = function () {
        var c, res = null;
        var range = this.model.selectionRange.getLast();
        for (c = range.c1; c <= range.c2 && c < this.cols.length; ++c) {
            if (null === res) {
                res = this.cols[c].charCount;
            } else if (res !== this.cols[c].charCount) {
                return null;
            }
        }
        // ToDo сравнить с default для проверки выделения всего
        return res;
    };

    WorksheetView.prototype.getSelectedRowHeight = function () {
        var r, res = null;
        var range = this.model.selectionRange.getLast();
        for (r = range.r1; r <= range.r2 && r < this.rows.length; ++r) {
            if (null === res) {
                res = this.rows[r].heightReal;
            } else if (res !== this.rows[r].heightReal) {
                return null;
            }
        }
        // ToDo сравнить с default для проверки выделения всего
        return res;
    };

    WorksheetView.prototype.getRowHeight = function (index, units) {
        if (index >= 0 && index < this.rows.length) {
            var u = units >= 0 && units <= 3 ? units : 0;
            return this.rows[index].height * asc_getcvt(1/*pt*/, u, this._getPPIY());
        }
        return null;
    };

    WorksheetView.prototype.getSelectedRange = function () {
        // ToDo multiselect ?
        var lastRange = this.model.selectionRange.getLast();
        return this._getRange(lastRange.c1, lastRange.r1, lastRange.c2, lastRange.r2);
    };

    WorksheetView.prototype.resize = function (isUpdate) {
        if (isUpdate) {
            this._initCellsArea(AscCommonExcel.recalcType.newLines);
            this._normalizeViewRange();
            this._prepareCellTextMetricsCache();
            this.updateResize = false;

            this.objectRender.resizeCanvas();
        } else {
            this.updateResize = true;
        }
        return this;
    };

    WorksheetView.prototype.getZoom = function () {
        return this.drawingCtx.getZoom();
    };

    WorksheetView.prototype.changeZoom = function (isUpdate) {
        if (isUpdate) {
            this.notUpdateRowHeight = true;
            this.cleanSelection();
            this._initCellsArea(AscCommonExcel.recalcType.recalc);
            this._normalizeViewRange();
            this._cleanCellsTextMetricsCache();
            this._shiftVisibleRange();
            this._prepareCellTextMetricsCache();
            this._shiftVisibleRange();
            this.cellCommentator.updateCommentPosition();
            this.handlers.trigger("onDocumentPlaceChanged");
            this.objectRender.drawingArea.reinitRanges();
            this.updateZoom = false;
            this.notUpdateRowHeight = false;
        } else {
            this.updateZoom = true;
        }
        return this;
    };
    WorksheetView.prototype.changeZoomResize = function () {
        this.cleanSelection();
        this._initCellsArea(AscCommonExcel.recalcType.full);
        this._normalizeViewRange();
        this._cleanCellsTextMetricsCache();
        this._shiftVisibleRange();
        this._prepareCellTextMetricsCache();
        this._shiftVisibleRange();
        this.cellCommentator.updateCommentPosition();
        this.handlers.trigger("onDocumentPlaceChanged");
        this.objectRender.drawingArea.reinitRanges();

        this.updateResize = false;
        this.updateZoom = false;
    };

    WorksheetView.prototype.getSheetViewSettings = function () {
        return this.model.getSheetViewSettings();
    };

    WorksheetView.prototype.getFrozenPaneOffset = function (noX, noY) {
        var offsetX = 0, offsetY = 0, c = this.cols, r = this.rows;
        if (this.topLeftFrozenCell) {
            if (!noX) {
                var cFrozen = this.topLeftFrozenCell.getCol0();
                offsetX = c[cFrozen].left - c[0].left;
            }
            if (!noY) {
                var rFrozen = this.topLeftFrozenCell.getRow0();
                offsetY = r[rFrozen].top - r[0].top;
            }
        }
        return {offsetX: offsetX, offsetY: offsetY};
    };


    // mouseX - это разница стартовых координат от мыши при нажатии и границы
    WorksheetView.prototype.changeColumnWidth = function (col, x2, mouseX) {
        var t = this;

        x2 *= asc_getcvt(0/*px*/, 1/*pt*/, t._getPPIX());
        // Учитываем координаты точки, где мы начали изменение размера
        x2 += mouseX;

        var offsetFrozenX = 0;
        var c1 = t.visibleRange.c1;
        if (this.topLeftFrozenCell) {
            var cFrozen = this.topLeftFrozenCell.getCol0() - 1;
            if (0 <= cFrozen) {
                if (col < c1) {
                    c1 = 0;
                } else {
                    offsetFrozenX = t.cols[cFrozen].left + t.cols[cFrozen].width - t.cols[0].left;
                }
            }
        }
        var offsetX = t.cols[c1].left - t.cellsLeft;
        offsetX -= offsetFrozenX;

        var x1 = t.cols[col].left - offsetX - this.width_1px;
        var w = Math.max(x2 - x1, 0);
        if (w === t.cols[col].width) {
            return;
        }
        var cc = Math.min(t._colWidthToCharCount(w), Asc.c_oAscMaxColumnWidth);

        var onChangeWidthCallback = function (isSuccess) {
            if (false === isSuccess) {
                return;
            }

            t.model.setColWidth(cc, col, col);
            t._cleanCache(new asc_Range(0, 0, t.cols.length - 1, t.rows.length - 1));
            t.changeWorksheet("update", {reinitRanges: true});
            t._updateVisibleColsCount();
            if (t.objectRender) {
                t.objectRender.updateSizeDrawingObjects({target: c_oTargetType.ColumnResize, col: col});
            }
        };
        this._isLockedAll(onChangeWidthCallback);
    };

    // mouseY - это разница стартовых координат от мыши при нажатии и границы
    WorksheetView.prototype.changeRowHeight = function (row, y2, mouseY) {
        var t = this;

        y2 *= asc_getcvt(0/*px*/, 1/*pt*/, t._getPPIY());
        // Учитываем координаты точки, где мы начали изменение размера
        y2 += mouseY;

        var offsetFrozenY = 0;
        var r1 = t.visibleRange.r1;
        if (this.topLeftFrozenCell) {
            var rFrozen = this.topLeftFrozenCell.getRow0() - 1;
            if (0 <= rFrozen) {
                if (row < r1) {
                    r1 = 0;
                } else {
                    offsetFrozenY = t.rows[rFrozen].top + t.rows[rFrozen].height - t.rows[0].top;
                }
            }
        }
        var offsetY = t.rows[r1].top - t.cellsTop;
        offsetY -= offsetFrozenY;

        var y1 = t.rows[row].top - offsetY - this.height_1px;
        var newHeight = Math.min(t.maxRowHeight, Math.max(y2 - y1, 0));
        if (newHeight === t.rows[row].height) {
            return;
        }

        var onChangeHeightCallback = function (isSuccess) {
            if (false === isSuccess) {
                return;
            }

            t.model.setRowHeight(newHeight, row, row, true);
            t.model.autoFilters.reDrawFilter(null, row);
            t._cleanCache(new asc_Range(0, row, t.cols.length - 1, row));
            t.changeWorksheet("update", {reinitRanges: true});
            t._updateVisibleRowsCount();
            if (t.objectRender) {
                t.objectRender.updateSizeDrawingObjects({target: c_oTargetType.RowResize, row: row});
            }
        };

        this._isLockedAll(onChangeHeightCallback);
    };


    // Проверяет, есть ли числовые значения в диапазоне
    WorksheetView.prototype._hasNumberValueInActiveRange = function () {
        var cell, cellType, isNumberFormat, arrCols = [], arrRows = [];
        // ToDo multiselect
        var selectionRange = this.model.selectionRange.getLast();
        if (selectionRange.isOneCell()) {
            // Для одной ячейки не стоит ничего делать
            return null;
        }
        var mergedRange = this.model.getMergedByCell(selectionRange.r1, selectionRange.c1);
        if (mergedRange && mergedRange.isEqual(selectionRange)) {
            // Для одной ячейки не стоит ничего делать
            return null;
        }

        for (var c = selectionRange.c1; c <= selectionRange.c2; ++c) {
            for (var r = selectionRange.r1; r <= selectionRange.r2; ++r) {
                cell = this._getCellTextCache(c, r);
                if (cell) {
                    // Нашли не пустую ячейку, проверим формат
                    cellType = cell.cellType;
                    isNumberFormat = (null == cellType || CellValueType.Number === cellType);
                    if (isNumberFormat) {
                        arrCols.push(c);
                        arrRows.push(r);
                    }
                }
            }
        }
        if (0 !== arrCols.length) {
            // Делаем массивы уникальными и сортируем
            arrCols = arrCols.filter(AscCommon.fOnlyUnique);
            arrRows = arrRows.filter(AscCommon.fOnlyUnique);
            return {arrCols: arrCols.sort(fSortAscending), arrRows: arrRows.sort(fSortAscending)};
        } else {
            return null;
        }
    };

    // Автодополняет формулу диапазоном, если это возможно
    WorksheetView.prototype.autoCompleteFormula = function (functionName) {
        var t = this;
        // ToDo autoComplete with multiselect
        var activeCell = this.model.selectionRange.activeCell;
        var ar = this.model.selectionRange.getLast();
        var arCopy = null;
        var arHistorySelect = ar.clone(true);
        var vr = this.visibleRange;

        // Первая верхняя не числовая ячейка
        var topCell = null;
        // Первая левая не числовая ячейка
        var leftCell = null;

        var r = activeCell.row - 1;
        var c = activeCell.col - 1;
        var cell, cellType, isNumberFormat;
        var result = {};
        // Проверим, есть ли числовые значения в диапазоне
        var hasNumber = this._hasNumberValueInActiveRange();
        var val, text;

        if (hasNumber) {
            var i;
            // Есть ли значения в последней строке и столбце
            var hasNumberInLastColumn = (ar.c2 === hasNumber.arrCols[hasNumber.arrCols.length - 1]);
            var hasNumberInLastRow = (ar.r2 === hasNumber.arrRows[hasNumber.arrRows.length - 1]);

            // Нужно уменьшить зону выделения (если она реально уменьшилась)
            var startCol = hasNumber.arrCols[0];
            var startRow = hasNumber.arrRows[0];
            // Старые границы диапазона
            var startColOld = ar.c1;
            var startRowOld = ar.r1;
            // Нужно ли перерисовывать
            var bIsUpdate = false;
            if (startColOld !== startCol || startRowOld !== startRow) {
                bIsUpdate = true;
            }
            if (true === hasNumberInLastRow && true === hasNumberInLastColumn) {
                bIsUpdate = true;
            }
            if (bIsUpdate) {
                this.cleanSelection();
                ar.c1 = startCol;
                ar.r1 = startRow;
                if (false === ar.contains(activeCell.col, activeCell.row)) {
                    // Передвинуть первую ячейку в выделении
                    activeCell.col = startCol;
                    activeCell.row = startRow;
                }
                if (true === hasNumberInLastRow && true === hasNumberInLastColumn) {
                    // Мы расширяем диапазон
                    if (1 === hasNumber.arrRows.length) {
                        // Одна строка или только в последней строке есть значения... (увеличиваем вправо)
                        ar.c2 += 1;
                    } else {
                        // Иначе вводим в строку вниз
                        ar.r2 += 1;
                    }
                }
                this._drawSelection();
            }

            arCopy = ar.clone(true);

            var functionAction = null;
            var changedRange = null;

            if (false === hasNumberInLastColumn && false === hasNumberInLastRow) {
                // Значений нет ни в последней строке ни в последнем столбце (значит нужно сделать формулы в каждой последней ячейке)
                changedRange =
                  [new asc_Range(hasNumber.arrCols[0], arCopy.r2, hasNumber.arrCols[hasNumber.arrCols.length -
                  1], arCopy.r2),
                      new asc_Range(arCopy.c2, hasNumber.arrRows[0], arCopy.c2, hasNumber.arrRows[hasNumber.arrRows.length -
                      1])];
                functionAction = function () {
                    // Пройдемся по последней строке
                    for (i = 0; i < hasNumber.arrCols.length; ++i) {
                        c = hasNumber.arrCols[i];
                        cell = t._getVisibleCell(c, arCopy.r2);
                        text = t._getCellTitle(c, arCopy.r1) + ":" + t._getCellTitle(c, arCopy.r2 - 1);
                        val = "=" + functionName + "(" + text + ")";
                        // ToDo - при вводе формулы в заголовок автофильтра надо писать "0"
                        cell.setValue(val);
                    }
                    // Пройдемся по последнему столбцу
                    for (i = 0; i < hasNumber.arrRows.length; ++i) {
                        r = hasNumber.arrRows[i];
                        cell = t._getVisibleCell(arCopy.c2, r);
                        text = t._getCellTitle(arCopy.c1, r) + ":" + t._getCellTitle(arCopy.c2 - 1, r);
                        val = "=" + functionName + "(" + text + ")";
                        cell.setValue(val);
                    }
                    // Значение в правой нижней ячейке
                    cell = t._getVisibleCell(arCopy.c2, arCopy.r2);
                    text = t._getCellTitle(arCopy.c1, arCopy.r2) + ":" + t._getCellTitle(arCopy.c2 - 1, arCopy.r2);
                    val = "=" + functionName + "(" + text + ")";
                    cell.setValue(val);
                };
            } else if (true === hasNumberInLastRow && false === hasNumberInLastColumn) {
                // Есть значения только в последней строке (значит нужно заполнить только последнюю колонку)
                changedRange =
                  new asc_Range(arCopy.c2, hasNumber.arrRows[0], arCopy.c2, hasNumber.arrRows[hasNumber.arrRows.length -
                  1]);
                functionAction = function () {
                    // Пройдемся по последнему столбцу
                    for (i = 0; i < hasNumber.arrRows.length; ++i) {
                        r = hasNumber.arrRows[i];
                        cell = t._getVisibleCell(arCopy.c2, r);
                        text = t._getCellTitle(arCopy.c1, r) + ":" + t._getCellTitle(arCopy.c2 - 1, r);
                        val = "=" + functionName + "(" + text + ")";
                        cell.setValue(val);
                    }
                };
            } else if (false === hasNumberInLastRow && true === hasNumberInLastColumn) {
                // Есть значения только в последнем столбце (значит нужно заполнить только последнюю строчку)
                changedRange =
                  new asc_Range(hasNumber.arrCols[0], arCopy.r2, hasNumber.arrCols[hasNumber.arrCols.length -
                  1], arCopy.r2);
                functionAction = function () {
                    // Пройдемся по последней строке
                    for (i = 0; i < hasNumber.arrCols.length; ++i) {
                        c = hasNumber.arrCols[i];
                        cell = t._getVisibleCell(c, arCopy.r2);
                        text = t._getCellTitle(c, arCopy.r1) + ":" + t._getCellTitle(c, arCopy.r2 - 1);
                        val = "=" + functionName + "(" + text + ")";
                        cell.setValue(val);
                    }
                };
            } else {
                // Есть значения и в последнем столбце, и в последней строке
                if (1 === hasNumber.arrRows.length) {
                    changedRange = new asc_Range(arCopy.c2, arCopy.r2, arCopy.c2, arCopy.r2);
                    functionAction = function () {
                        // Одна строка или только в последней строке есть значения...
                        cell = t._getVisibleCell(arCopy.c2, arCopy.r2);
                        // ToDo вводить в первое свободное место, а не сразу за диапазоном
                        text = t._getCellTitle(arCopy.c1, arCopy.r2) + ":" + t._getCellTitle(arCopy.c2 - 1, arCopy.r2);
                        val = "=" + functionName + "(" + text + ")";
                        cell.setValue(val);
                    };
                } else {
                    changedRange =
                      new asc_Range(hasNumber.arrCols[0], arCopy.r2, hasNumber.arrCols[hasNumber.arrCols.length -
                      1], arCopy.r2);
                    functionAction = function () {
                        // Иначе вводим в строку вниз
                        for (i = 0; i < hasNumber.arrCols.length; ++i) {
                            c = hasNumber.arrCols[i];
                            cell = t._getVisibleCell(c, arCopy.r2);
                            // ToDo вводить в первое свободное место, а не сразу за диапазоном
                            text = t._getCellTitle(c, arCopy.r1) + ":" + t._getCellTitle(c, arCopy.r2 - 1);
                            val = "=" + functionName + "(" + text + ")";
                            cell.setValue(val);
                        }
                    };
                }
            }

            var onAutoCompleteFormula = function (isSuccess) {
                if (false === isSuccess) {
                    return;
                }

                History.Create_NewPoint();
                History.SetSelection(arHistorySelect.clone());
                History.SetSelectionRedo(arCopy.clone());
                History.StartTransaction();

                asc_applyFunction(functionAction);
                t.handlers.trigger("selectionMathInfoChanged", t.getSelectionMathInfo());

                History.EndTransaction();
            };

            // Можно ли применять автоформулу
            this._isLockedCells(changedRange, /*subType*/null, onAutoCompleteFormula);

            result.notEditCell = true;
            return result;
        }

        // Ищем первую ячейку с числом
        for (; r >= vr.r1; --r) {
            cell = this._getCellTextCache(activeCell.col, r);
            if (cell) {
                // Нашли не пустую ячейку, проверим формат
                cellType = cell.cellType;
                isNumberFormat = (null === cellType || CellValueType.Number === cellType);
                if (isNumberFormat) {
                    // Это число, мы нашли то, что искали
                    topCell = {
                        c: activeCell.col, r: r, isFormula: cell.isFormula
                    };
                    // смотрим вторую ячейку
                    if (topCell.isFormula && r - 1 >= vr.r1) {
                        cell = this._getCellTextCache(activeCell.col, r - 1);
                        if (cell && cell.isFormula) {
                            topCell.isFormulaSeq = true;
                        }
                    }
                    break;
                }
            }
        }
        // Проверим, первой все равно должна быть колонка
        if (null === topCell || topCell.r !== activeCell.row - 1 || topCell.isFormula && !topCell.isFormulaSeq) {
            for (; c >= vr.c1; --c) {
                cell = this._getCellTextCache(c, activeCell.row);
                if (cell) {
                    // Нашли не пустую ячейку, проверим формат
                    cellType = cell.cellType;
                    isNumberFormat = (null === cellType || CellValueType.Number === cellType);
                    if (isNumberFormat) {
                        // Это число, мы нашли то, что искали
                        leftCell = {
                            r: activeCell.row, c: c
                        };
                        break;
                    }
                }
                if (null !== topCell) {
                    // Если это не первая ячейка слева от текущей и мы нашли верхнюю, то дальше не стоит искать
                    break;
                }
            }
        }

        if (leftCell) {
            // Идем влево до первой не числовой ячейки
            --c;
            for (; c >= 0; --c) {
                cell = this._getCellTextCache(c, activeCell.row);
                if (!cell) {
                    // Могут быть еще не закешированные данные
                    this._addCellTextToCache(c, activeCell.row);
                    cell = this._getCellTextCache(c, activeCell.row);
                    if (!cell) {
                        break;
                    }
                }
                cellType = cell.cellType;
                isNumberFormat = (null === cellType || CellValueType.Number === cellType);
                if (!isNumberFormat) {
                    break;
                }
            }
            // Мы ушли чуть дальше
            ++c;
            // Диапазон или только 1 ячейка
            if (activeCell.col - 1 !== c) {
                // Диапазон
                result = new asc_Range(c, leftCell.r, activeCell.col - 1, leftCell.r);
            } else {
                // Одна ячейка
                result = new asc_Range(c, leftCell.r, c, leftCell.r);
            }
            result.type = c_oAscSelectionType.RangeCells;
            this._fixSelectionOfMergedCells(result);
            if (result.c1 === result.c2 && result.r1 === result.r2) {
                result.text = this._getCellTitle(result.c1, result.r1);
            } else {
                result.text = this._getCellTitle(result.c1, result.r1) + ":" + this._getCellTitle(result.c2, result.r2);
            }
            return result;
        }

        if (topCell) {
            // Идем вверх до первой не числовой ячейки
            --r;
            for (; r >= 0; --r) {
                cell = this._getCellTextCache(activeCell.col, r);
                if (!cell) {
                    // Могут быть еще не закешированные данные
                    this._addCellTextToCache(activeCell.col, r);
                    cell = this._getCellTextCache(activeCell.col, r);
                    if (!cell) {
                        break;
                    }
                }
                cellType = cell.cellType;
                isNumberFormat = (null === cellType || CellValueType.Number === cellType);
                if (!isNumberFormat) {
                    break;
                }
            }
            // Мы ушли чуть дальше
            ++r;
            // Диапазон или только 1 ячейка
            if (activeCell.row - 1 !== r) {
                // Диапазон
                result = new asc_Range(topCell.c, r, topCell.c, activeCell.row - 1);
            } else {
                // Одна ячейка
                result = new asc_Range(topCell.c, r, topCell.c, r);
            }
            result.type = c_oAscSelectionType.RangeCells;
            this._fixSelectionOfMergedCells(result);
            if (result.c1 === result.c2 && result.r1 === result.r2) {
                result.text = this._getCellTitle(result.c1, result.r1);
            } else {
                result.text = this._getCellTitle(result.c1, result.r1) + ":" + this._getCellTitle(result.c2, result.r2);
            }
            return result;
        }
    };

    // ----- Initialization -----
    WorksheetView.prototype._init = function () {
        this._initConstValues();
        this._initWorksheetDefaultWidth();
        this._initPane();
        this._initCellsArea(AscCommonExcel.recalcType.full);
        this.model.setTableStyleAfterOpen();
        this._cleanCellsTextMetricsCache();
        this._prepareCellTextMetricsCache();

        // initializing is completed
        this.handlers.trigger("initialized");
    };

    WorksheetView.prototype._prepareComments = function () {
        // ToDo возможно не нужно это делать именно тут..
        if (0 < this.model.aComments.length) {
            this.model.workbook.handlers.trigger("asc_onAddComments", this.model.aComments);
        }
    };

    WorksheetView.prototype._prepareDrawingObjects = function () {
        this.objectRender = new AscFormat.DrawingObjects();
        if (!window["NATIVE_EDITOR_ENJINE"] || window['IS_NATIVE_EDITOR'] || window['DoctRendererMode']) {
            this.objectRender.init(this);
        }
    };

    WorksheetView.prototype._initWorksheetDefaultWidth = function () {
        this.nBaseColWidth = this.model.oSheetFormatPr.nBaseColWidth || this.nBaseColWidth;
        // Теперь рассчитываем число px
        var defaultColWidthChars = this.model.charCountToModelColWidth(this.nBaseColWidth);
        this.defaultColWidthPx = this._modelColWidthToColWidth(defaultColWidthChars) * asc_getcvt(1/*pt*/, 0/*px*/, 96);
        // Делаем кратным 8 (http://support.microsoft.com/kb/214123)
        this.defaultColWidthPx = asc_ceil(this.defaultColWidthPx / 8) * 8;
        this.defaultColWidthChars =
          this._colWidthToCharCount(this.defaultColWidthPx * asc_getcvt(0/*px*/, 1/*pt*/, 96));

        AscCommonExcel.oDefaultMetrics.ColWidthChars = this.model.charCountToModelColWidth(this.defaultColWidthChars);
        this.defaultColWidth = this._modelColWidthToColWidth(AscCommonExcel.oDefaultMetrics.ColWidthChars);

        var defaultFontSize = this.model.getDefaultFontSize();
        // ToDo разобраться со значениями
        this._setFont(undefined, this.model.getDefaultFontName(), defaultFontSize);
        var tm = this._roundTextMetrics(this.stringRender.measureString("A"));
        this.headersHeightByFont = tm.height + this.height_1px;

        this.maxRowHeight = asc_calcnpt(Asc.c_oAscMaxRowHeight, this._getPPIY());
        this.defaultRowDescender = this._calcRowDescender(defaultFontSize);
        AscCommonExcel.oDefaultMetrics.RowHeight = this.defaultRowHeight =
          Math.min(this.maxRowHeight, this.model.getDefaultHeight() || this.headersHeightByFont);

        // Инициализируем число колонок и строк (при открытии). Причем нужно поставить на 1 больше,
        // чтобы могли показать последнюю строку/столбец (http://bugzilla.onlyoffice.com/show_bug.cgi?id=23513)
        this.nColsCount = Math.min(this.model.getColsCount() + 1, gc_nMaxCol);
        this.nRowsCount = Math.min(this.model.getRowsCount() + 1, gc_nMaxRow);
    };

    WorksheetView.prototype._initConstValues = function () {
        var ppiX = this._getPPIX();
        var ppiY = this._getPPIY();
        this.width_1px = asc_calcnpt(0, ppiX, 1/*px*/);
        this.width_2px = asc_calcnpt(0, ppiX, 2/*px*/);
        this.width_3px = asc_calcnpt(0, ppiX, 3/*px*/);
        this.width_4px = asc_calcnpt(0, ppiX, 4/*px*/);
        this.width_padding = asc_calcnpt(0, ppiX, this.settings.cells.padding/*px*/);

        this.height_1px = asc_calcnpt(0, ppiY, 1/*px*/);
        this.height_2px = asc_calcnpt(0, ppiY, 2/*px*/);
        this.height_3px = asc_calcnpt(0, ppiY, 3/*px*/);
        this.height_4px = asc_calcnpt(0, ppiY, 4/*px*/);
    };

    WorksheetView.prototype._initCellsArea = function (type) {
        // calculate rows heights and visible rows
        if (!(window["NATIVE_EDITOR_ENJINE"] && this.notUpdateRowHeight)) {
            this._calcHeaderRowHeight();
            this._calcHeightRows(type);
        }
        this.visibleRange.r2 = 0;
        this._calcVisibleRows();
        this._updateVisibleRowsCount(/*skipScrolReinit*/true);

        // calculate columns widths and visible columns
        if (!(window["NATIVE_EDITOR_ENJINE"] && this.notUpdateRowHeight)) {
            this._calcHeaderColumnWidth();
            this._calcWidthColumns(type);
        }
        this.visibleRange.c2 = 0;
        this._calcVisibleColumns();
        this._updateVisibleColsCount(/*skipScrolReinit*/true);
    };

    WorksheetView.prototype._initPane = function () {
        var pane = this.model.sheetViews[0].pane;
        if ( null !== pane && pane.isInit() ) {
            this.topLeftFrozenCell = pane.topLeftFrozenCell;
            this.visibleRange.r1 = this.topLeftFrozenCell.getRow0();
            this.visibleRange.c1 = this.topLeftFrozenCell.getCol0();
        }
    };

    WorksheetView.prototype._getSelection = function () {
        return (this.isFormulaEditMode) ? this.arrActiveFormulaRanges[this.arrActiveFormulaRangesPosition] :
          this.model.selectionRange;
    };

    WorksheetView.prototype._fixVisibleRange = function ( range ) {
        var tmp;
        if ( null !== this.topLeftFrozenCell ) {
            tmp = this.topLeftFrozenCell.getRow0();
            if ( range.r1 < tmp ) {
                range.r1 = tmp;
                tmp = this._findVisibleRow( range.r1, +1 );
                if ( 0 < tmp ) {
                    range.r1 = tmp;
                }
            }
            tmp = this.topLeftFrozenCell.getCol0();
            if ( range.c1 < tmp ) {
                range.c1 = tmp;
                tmp = this._findVisibleCol( range.c1, +1 );
                if ( 0 < tmp ) {
                    range.c1 = tmp;
                }
            }
        }
    };

    /**
     * Вычисляет ширину столбца в пунктах
     * @param {Number} mcw  Количество символов
     * @returns {Number}    Ширина столбца в пунктах (pt)
     */
    WorksheetView.prototype._modelColWidthToColWidth = function ( mcw ) {
        var px = asc_floor( ((256 * mcw + asc_floor( 128 / this.maxDigitWidth )) / 256) * this.maxDigitWidth );
        return px * asc_getcvt( 0/*px*/, 1/*pt*/, 96 );
    };

    /**
     * Вычисляет количество символов по ширине столбца
     * @param {Number} w  Ширина столбца в пунктах
     * @returns {Number}  Количество символов
     */
    WorksheetView.prototype._colWidthToCharCount = function ( w ) {
        var px = w * asc_getcvt( 1/*pt*/, 0/*px*/, 96 );
        var pxInOneCharacter = this.maxDigitWidth + this.settings.cells.paddingPlusBorder;
        // Когда меньше 1 символа, то просто считаем по пропорции относительно размера 1-го символа
        return px < pxInOneCharacter ? (1 - asc_floor( 100 * (pxInOneCharacter - px) / pxInOneCharacter + 0.49999 ) / 100) : asc_floor( (px - this.settings.cells.paddingPlusBorder) / this.maxDigitWidth * 100 + 0.5 ) / 100;
    };

    /**
     * Вычисляет ширину столбца для отрисовки
     * @param {Number} w  Ширина столбца в символах
     * @returns {Number}  Ширина столбца в пунктах (pt)
     */
    WorksheetView.prototype._calcColWidth = function ( w ) {
        var t = this;
        var res = {};
        var useDefault = w === undefined || w === null || w === -1;
        var width;
        res.width =
          useDefault ? t.defaultColWidth : (width = t._modelColWidthToColWidth(w), (width < t.width_1px ? 0 : width));
        res.innerWidth = Math.max( res.width - this.width_padding * 2 - this.width_1px, 0 );
        res.charCount = t._colWidthToCharCount( res.width );
        return res;
    };

    /**
     * Вычисляет Descender строки
     * @param {Number} fontSize
     * @returns {Number}
     */
    WorksheetView.prototype._calcRowDescender = function ( fontSize ) {
        return asc_calcnpt( fontSize * (this.vspRatio - 1), this._getPPIY() ); // ToDo возможно стоит тоже использовать 96
    };

    /** Вычисляет ширину колонки заголовков (в pt) */
    WorksheetView.prototype._calcHeaderColumnWidth = function () {
        if (false === this.model.sheetViews[0].asc_getShowRowColHeaders()) {
            this.headersWidth = 0;
        } else {
            // Ширина колонки заголовков считается  - max число знаков в строке - перевести в символы - перевести в пикселы
            var numDigit = Math.max(calcDecades(this.visibleRange.r2 + 1), 3);
            var nCharCount = this.model.charCountToModelColWidth(numDigit);
            this.headersWidth = this._modelColWidthToColWidth(nCharCount);
        }

        //var w = this.emSize * Math.max( calcDecades(this.visibleRange.r2 + 1), 3) * 1.25;
        //this.headersWidth = asc_calcnpt(w, this._getPPIX());

        this.cellsLeft = this.headersLeft + this.headersWidth;
    };

    /** Вычисляет высоту строки заголовков (в pt) */
    WorksheetView.prototype._calcHeaderRowHeight = function () {
        if ( false === this.model.sheetViews[0].asc_getShowRowColHeaders() ) {
            this.headersHeight = 0;
        }
        else
        //this.headersHeight = this.model.getDefaultHeight() || this.defaultRowHeight;
        {
            this.headersHeight = this.headersHeightByFont;
        }

        //this.headersHeight = asc_calcnpt( this.settings.header.fontSize * this.vspRatio, this._getPPIY() );
        this.cellsTop = this.headersTop + this.headersHeight;
    };

    /**
     * Вычисляет ширину и позицию колонок (в pt)
     * @param {AscCommonExcel.recalcType} type
     */
    WorksheetView.prototype._calcWidthColumns = function (type) {
        var x = this.cellsLeft;
        var visibleW = this.drawingCtx.getWidth();
        var maxColObjects = this.objectRender ? this.objectRender.getMaxColRow().col : -1;
        var l = Math.max(this.model.getColsCount() + 1, this.nColsCount, maxColObjects);
        var i = 0, w, column, isBestFit, hiddenW = 0;

        // Берем дефалтовую ширину документа
        var defaultWidth = this.model.getDefaultWidth();
        defaultWidth = (typeof defaultWidth === "number" && defaultWidth >= 0) ? defaultWidth : -1;

        if (AscCommonExcel.recalcType.full === type) {
            this.cols = [];
        } else if (AscCommonExcel.recalcType.newLines === type) {
            i = this.cols.length;
            x = this.cols[i - 1].left + this.cols[i - 1].width;
        }
        for (; ((AscCommonExcel.recalcType.recalc !== type) ? i < l || x + hiddenW < visibleW : i < this.cols.length) && i < gc_nMaxCol; ++i) {
            // Получаем свойства колонки
            column = this.model._getColNoEmptyWithAll(i);
            if (!column) {
                w = defaultWidth; // Используем дефолтное значение
                isBestFit = true; // Это уже оптимальная ширина
            } else if (column.hd) {
                w = 0;            // Если столбец скрытый, ширину выставляем 0
                isBestFit = false;
                hiddenW += this._calcColWidth(column.width).width;
            } else {
                w = column.width || defaultWidth;
                isBestFit = !!(column.BestFit || (null === column.BestFit && null === column.CustomWidth));
            }
            this.cols[i] = this._calcColWidth(w);
            this.cols[i].isCustomWidth = !isBestFit;
            this.cols[i].left = x;
            x += this.cols[i].width;
        }

        this.nColsCount = Math.min(Math.max(this.nColsCount, i), gc_nMaxCol);
    };

    /**
     * Вычисляет высоту и позицию строк (в pt)
     * @param {AscCommonExcel.recalcType} type
     */
    WorksheetView.prototype._calcHeightRows = function (type) {
        var y = this.cellsTop;
        var visibleH = this.drawingCtx.getHeight();
        var maxRowObjects = this.objectRender ? this.objectRender.getMaxColRow().row : -1;
        var l = Math.max(this.model.getRowsCount() + 1, this.nRowsCount, maxRowObjects);
        var defaultH = this.defaultRowHeight;
        var i = 0, h, hR, isCustomHeight, row, hiddenH = 0;

        if (AscCommonExcel.recalcType.full === type) {
            this.rows = [];
        } else if (AscCommonExcel.recalcType.newLines === type) {
            i = this.rows.length;
            y = this.rows[i - 1].top + this.rows[i - 1].height;
        }
        // ToDo calc all rows (not visible)
        for (; ((AscCommonExcel.recalcType.recalc !== type) ? i < l || y + hiddenH < visibleH : i < this.rows.length) &&
               i < gc_nMaxRow; ++i) {
            row = this.model._getRowNoEmptyWithAll(i);
            if (!row) {
                h = -1; // Будет использоваться дефолтная высота строки
                isCustomHeight = false;
            } else if (0 != (AscCommonExcel.g_nRowFlag_hd & row.flags)) {
                hR = h = 0;  // Скрытая строка, высоту выставляем 0
                isCustomHeight = true;
                hiddenH += row.h > 0 ? row.h - this.height_1px : defaultH;
            } else {
                isCustomHeight = 0 != (AscCommonExcel.g_nRowFlag_CustomHeight & row.flags);
                // Берем высоту из модели, если она custom(баг 15618), либо дефолтную
                if (row.h > 0 && (isCustomHeight || (AscCommonExcel.g_nRowFlag_CalcHeight & row.flags))) {
                    hR = row.h;
                    h = hR / 0.75;
                    h = (h | h) * 0.75;			// 0.75 - это размер 1px в pt (можно было 96/72)
                } else {
                    h = -1;
                }
            }
            h = h < 0 ? (hR = defaultH) : h;
            this.rows[i] = {
                top: y,
                height: h,												// Высота с точностью до 1 px
                heightReal: hR,											// Реальная высота из файла (может быть не кратна 1 px, в Excel можно выставить через меню строки)
                descender: this.defaultRowDescender,
                isCustomHeight: isCustomHeight
            };
            y += this.rows[i].height;
        }

        this.nRowsCount = Math.min(Math.max(this.nRowsCount, i), gc_nMaxRow);
    };

    /** Вычисляет диапазон индексов видимых колонок */
    WorksheetView.prototype._calcVisibleColumns = function () {
        var l = this.cols.length;
        var w = this.drawingCtx.getWidth();
        var sumW = this.topLeftFrozenCell ? this.cols[this.topLeftFrozenCell.getCol0()].left : this.cellsLeft;
        for (var i = this.visibleRange.c1, f = false; i < l && sumW < w; ++i) {
            sumW += this.cols[i].width;
            f = true;
        }
        this.visibleRange.c2 = i - (f ? 1 : 0);
    };

    /** Вычисляет диапазон индексов видимых строк */
    WorksheetView.prototype._calcVisibleRows = function () {
        var l = this.rows.length;
        var h = this.drawingCtx.getHeight();
        var sumH = this.topLeftFrozenCell ? this.rows[this.topLeftFrozenCell.getRow0()].top : this.cellsTop;
        for (var i = this.visibleRange.r1, f = false; i < l && sumH < h; ++i) {
            sumH += this.rows[i].height;
            f = true;
        }
        this.visibleRange.r2 = i - (f ? 1 : 0);
    };

    /** Обновляет позицию колонок (в pt) */
    WorksheetView.prototype._updateColumnPositions = function () {
        var x = this.cellsLeft;
        for (var l = this.cols.length, i = 0; i < l; ++i) {
            this.cols[i].left = x;
            x += this.cols[i].width;
        }
    };

    /** Обновляет позицию строк (в pt) */
    WorksheetView.prototype._updateRowPositions = function () {
        var y = this.cellsTop;
        for (var l = this.rows.length, i = 0; i < l; ++i) {
            this.rows[i].top = y;
            y += this.rows[i].height;
        }
    };

    /**
     * Добавляет колонки, пока общая ширина листа не превысит rightSide
     * @param {Number} rightSide Правая граница
     */
    WorksheetView.prototype._appendColumns = function (rightSide) {
        var i = this.cols.length;
        var lc = this.cols[i - 1];
        var done = false;

        for (var x = lc.left + lc.width; i < gc_nMaxCol && (x < rightSide || !done); ++i) {
            if (x >= rightSide) {
                // add +1 column at the end and exit cycle
                done = true;
            }
            this.cols[i] = this._calcColWidth(this.model.getColWidth(i));
            this.cols[i].left = x;
            x += this.cols[i].width;
            this.isChanged = true;
        }
        this.nColsCount = Math.min(Math.max(this.nColsCount, i), gc_nMaxCol);
    };

    /** Устанаваливает видимый диапазон ячеек максимально возможным */
    WorksheetView.prototype._normalizeViewRange = function () {
        var t = this;
        var vr = t.visibleRange;
        var w = t.drawingCtx.getWidth() - t.cellsLeft;
        var h = t.drawingCtx.getHeight() - t.cellsTop;
        var c = t.cols;
        var r = t.rows;
        var vw = c[vr.c2].left + c[vr.c2].width - c[vr.c1].left;
        var vh = r[vr.r2].top + r[vr.r2].height - r[vr.r1].top;
        var i;

        var offsetFrozen = t.getFrozenPaneOffset();
        vw += offsetFrozen.offsetX;
        vh += offsetFrozen.offsetY;

        if ( vw < w ) {
            for ( i = vr.c1 - 1; i >= 0; --i ) {
                vw += c[i].width;
                if ( vw > w ) {
                    break;
                }
            }
            vr.c1 = i + 1;
            if ( vr.c1 >= vr.c2 ) {
                vr.c1 = vr.c2 - 1;
            }
            if ( vr.c1 < 0 ) {
                vr.c1 = 0;
            }
        }

        if ( vh < h ) {
            for ( i = vr.r1 - 1; i >= 0; --i ) {
                vh += r[i].height;
                if ( vh > h ) {
                    break;
                }
            }
            vr.r1 = i + 1;
            if ( vr.r1 >= vr.r2 ) {
                vr.r1 = vr.r2 - 1;
            }
            if ( vr.r1 < 0 ) {
                vr.r1 = 0;
            }
        }
    };

    WorksheetView.prototype._shiftVisibleRange = function (range) {
        var t = this;
        var vr = t.visibleRange;
        var arn = range ? range : this.model.selectionRange.getLast();
        var i;

        var cFrozen = 0, rFrozen = 0;
        if (this.topLeftFrozenCell) {
            cFrozen = this.topLeftFrozenCell.getCol0();
            rFrozen = this.topLeftFrozenCell.getRow0();
        }

        do {
            if (arn.r2 > vr.r2) {
                i = arn.r2 - vr.r2;
                vr.r1 += i;
                vr.r2 += i;
                t._calcVisibleRows();
                continue;
            }
            if (t._isRowDrawnPartially(arn.r2, vr.r1)) {
                vr.r1 += 1;
                t._calcVisibleRows();
            }
            if (arn.r1 < vr.r1 && arn.r1 >= rFrozen) {
                i = arn.r1 - vr.r1;
                vr.r1 += i;
                vr.r2 += i;
                t._calcVisibleRows();
            }
            break;
        } while (1);

        do {
            if (arn.c2 > vr.c2) {
                i = arn.c2 - vr.c2;
                vr.c1 += i;
                vr.c2 += i;
                t._calcVisibleColumns();
                continue;
            }
            if (t._isColDrawnPartially(arn.c2, vr.c1)) {
                vr.c1 += 1;
                t._calcVisibleColumns();
            }
            if (arn.c1 < vr.c1 && arn.c1 >= cFrozen) {
                i = arn.c1 - vr.c1;
                vr.c1 += i;
                vr.c2 += i;
                if (vr.c1 < 0) {
                    vr.c1 = 0;
                    vr.c2 -= vr.c1;
                }
                t._calcVisibleColumns();
            }
            break;
        } while (1);
    };

    // ----- Drawing for print -----
    WorksheetView.prototype.calcPagesPrint = function(pageOptions, printOnlySelection, indexWorksheet, arrPages) {
        var range;
        var maxCols = this.model.getColsCount();
        var maxRows = this.model.getRowsCount();
        var lastC = -1, lastR = -1;
        // ToDo print each range on new page (now only last)
        var selectionRange = printOnlySelection ? this.model.selectionRange.getLast() : null;
        var bFitToWidth = false;
        var bFitToHeight = false;

        if (null === selectionRange) {
            range = new asc_Range(0, 0, maxCols, maxRows);
            this._prepareCellTextMetricsCache(range);

            var rowModel, rowCells, rowCache, rightSide, c;
            for (var r = 0; r <= maxRows; ++r) {
                if (this.height_1px > this.rows[r].height) {
                    continue;
                }
                // Теперь получаем только не пустые ячейки для строки
                rowModel = this.model._getRowNoEmpty(r);
                if (!rowModel) {
                    continue;
                }
                rowCache = this._getRowCache(r);
                rowCells = rowModel.getCells();
                for (c in rowCells) {
                    c = c - 0;
                    if (this.width_1px > this.cols[c].width) {
                        continue;
                    }

                    var style = rowCells[c].getStyle();
                    if (style && (null !== style.fill || (null !== style.border && style.border.notEmpty()))) {
                        lastC = Math.max(lastC, c);
                        lastR = Math.max(lastR, r);
                    }
                    if (rowCache && rowCache.columnsWithText[c]) {
                        rightSide = 0;
                        var ct = this._getCellTextCache(c, r);
                        if (ct !== undefined) {
                            if (!ct.flags.isMerged() && !ct.flags.wrapText) {
                                rightSide = ct.sideR;
                            }

                        lastC = Math.max(lastC, c + rightSide);
                        lastR = Math.max(lastR, r);
                    }
                }
            }
            }
            var maxCell = this.model.autoFilters.getMaxColRow();
            lastC = Math.max(lastC, maxCell.col);
            lastR = Math.max(lastR, maxCell.row);

            maxCols = lastC + 1;
            maxRows = lastR + 1;

            // Получаем максимальную колонку/строку для изображений/чатов
            maxCell = this.objectRender.getMaxColRow();
            maxCols = Math.max(maxCols, maxCell.col);
            maxRows = Math.max(maxRows, maxCell.row);

        } else {
            maxCols = selectionRange.c2 + 1;
            maxRows = selectionRange.r2 + 1;
            range = new asc_Range(0, 0, maxCols, maxRows);
            this._prepareCellTextMetricsCache(range);
        }

        var pageMargins, pageSetup, pageGridLines, pageHeadings;
        if (pageOptions instanceof asc_CPageOptions) {
            pageMargins = pageOptions.asc_getPageMargins();
            pageSetup = pageOptions.asc_getPageSetup();
            pageGridLines = pageOptions.asc_getGridLines();
            pageHeadings = pageOptions.asc_getHeadings();
        }

        var pageWidth, pageHeight, pageOrientation;
        if (pageSetup instanceof asc_CPageSetup) {
            pageWidth = pageSetup.asc_getWidth();
            pageHeight = pageSetup.asc_getHeight();
            pageOrientation = pageSetup.asc_getOrientation();
            bFitToWidth = pageSetup.asc_getFitToWidth();
            bFitToHeight = pageSetup.asc_getFitToHeight();
        }

        var pageLeftField, pageRightField, pageTopField, pageBottomField;
        if (pageMargins instanceof asc_CPageMargins) {
            pageLeftField = Math.max(pageMargins.asc_getLeft(), c_oAscPrintDefaultSettings.MinPageLeftField);
            pageRightField = Math.max(pageMargins.asc_getRight(), c_oAscPrintDefaultSettings.MinPageRightField);
            pageTopField = Math.max(pageMargins.asc_getTop(), c_oAscPrintDefaultSettings.MinPageTopField);
            pageBottomField = Math.max(pageMargins.asc_getBottom(), c_oAscPrintDefaultSettings.MinPageBottomField);
        }

        if (null == pageGridLines) {
            pageGridLines = c_oAscPrintDefaultSettings.PageGridLines;
        }
        if (null == pageHeadings) {
            pageHeadings = c_oAscPrintDefaultSettings.PageHeadings;
        }

        if (null == pageWidth) {
            pageWidth = c_oAscPrintDefaultSettings.PageWidth;
        }
        if (null == pageHeight) {
            pageHeight = c_oAscPrintDefaultSettings.PageHeight;
        }
        if (null == pageOrientation) {
            pageOrientation = c_oAscPrintDefaultSettings.PageOrientation;
        }

        if (null == pageLeftField) {
            pageLeftField = c_oAscPrintDefaultSettings.PageLeftField;
        }
        if (null == pageRightField) {
            pageRightField = c_oAscPrintDefaultSettings.PageRightField;
        }
        if (null == pageTopField) {
            pageTopField = c_oAscPrintDefaultSettings.PageTopField;
        }
        if (null == pageBottomField) {
            pageBottomField = c_oAscPrintDefaultSettings.PageBottomField;
        }

        if (Asc.c_oAscPageOrientation.PageLandscape === pageOrientation) {
            var tmp = pageWidth;
            pageWidth = pageHeight;
            pageHeight = tmp;
        }

        if (0 === maxCols || 0 === maxRows) {
            // Ничего нет, возвращаем пустой массив
            return null;
        } else {
            var pageWidthWithFields = pageWidth - pageLeftField - pageRightField;
            var pageHeightWithFields = pageHeight - pageTopField - pageBottomField;
            // 1px offset for borders
            var leftFieldInPt = pageLeftField / vector_koef + this.width_1px;
            var topFieldInPt = pageTopField / vector_koef + this.height_1px;
            var rightFieldInPt = pageRightField / vector_koef + this.width_1px;
            var bottomFieldInPt = pageBottomField / vector_koef + this.height_1px;

            if (pageHeadings) {
                // Рисуем заголовки, нужно чуть сдвинуться
                leftFieldInPt += this.cellsLeft;
                topFieldInPt += this.cellsTop;
            }

            var pageWidthWithFieldsHeadings = (pageWidth - pageRightField) / vector_koef - leftFieldInPt;
            var pageHeightWithFieldsHeadings = (pageHeight - pageBottomField) / vector_koef - topFieldInPt;

            var currentColIndex = (null !== selectionRange) ? selectionRange.c1 : 0;
            var currentWidth = 0;
            var currentRowIndex = (null !== selectionRange) ? selectionRange.r1 : 0;
            var currentHeight = 0;
            var isCalcColumnsWidth = true;

            var bIsAddOffset = false;
            var nCountOffset = 0;

            while (AscCommonExcel.c_kMaxPrintPages > arrPages.length) {
                if (currentColIndex === maxCols && currentRowIndex === maxRows) {
                    break;
                }

                var newPagePrint = new asc_CPagePrint();

                var colIndex = currentColIndex, rowIndex = currentRowIndex;

                newPagePrint.indexWorksheet = indexWorksheet;

                newPagePrint.pageWidth = pageWidth;
                newPagePrint.pageHeight = pageHeight;
                newPagePrint.pageClipRectLeft = pageLeftField / vector_koef;
                newPagePrint.pageClipRectTop = pageTopField / vector_koef;
                newPagePrint.pageClipRectWidth = pageWidthWithFields / vector_koef;
                newPagePrint.pageClipRectHeight = pageHeightWithFields / vector_koef;

                newPagePrint.leftFieldInPt = leftFieldInPt;
                newPagePrint.topFieldInPt = topFieldInPt;
                newPagePrint.rightFieldInPt = rightFieldInPt;
                newPagePrint.bottomFieldInPt = bottomFieldInPt;

                for (rowIndex = currentRowIndex; rowIndex < maxRows; ++rowIndex) {
                    var currentRowHeight = this.rows[rowIndex].height;
                    if (!bFitToHeight && currentHeight + currentRowHeight > pageHeightWithFieldsHeadings) {
                        // Закончили рисовать страницу
                        break;
                    }
                    if (isCalcColumnsWidth) {
                        for (colIndex = currentColIndex; colIndex < maxCols; ++colIndex) {
                            var currentColWidth = this.cols[colIndex].width;
                            if (bIsAddOffset) {
                                newPagePrint.startOffset = ++nCountOffset;
                                newPagePrint.startOffsetPt = (pageWidthWithFieldsHeadings * newPagePrint.startOffset);
                                currentColWidth -= newPagePrint.startOffsetPt;
                            }

                            if (!bFitToWidth && currentWidth + currentColWidth > pageWidthWithFieldsHeadings &&
                              colIndex !== currentColIndex) {
                                break;
                            }

                            currentWidth += currentColWidth;

                            if (!bFitToWidth && currentWidth > pageWidthWithFieldsHeadings &&
                              colIndex === currentColIndex) {
                                // Смещаем в селедующий раз ячейку
                                bIsAddOffset = true;
                                ++colIndex;
                                break;
                            } else {
                                bIsAddOffset = false;
                            }
                        }
                        isCalcColumnsWidth = false;
                        if (pageHeadings) {
                            currentWidth += this.cellsLeft;
                        }

                        if (bFitToWidth) {
                            newPagePrint.pageClipRectWidth = Math.max(currentWidth, newPagePrint.pageClipRectWidth);
                            newPagePrint.pageWidth =
                              newPagePrint.pageClipRectWidth * vector_koef + (pageLeftField + pageRightField);
                        } else {
                            newPagePrint.pageClipRectWidth = Math.min(currentWidth, newPagePrint.pageClipRectWidth);
                        }
                    }

                    currentHeight += currentRowHeight;
                    currentWidth = 0;
                }

                if (bFitToHeight) {
                    newPagePrint.pageClipRectHeight = Math.max(currentHeight, newPagePrint.pageClipRectHeight);
                    newPagePrint.pageHeight =
                      newPagePrint.pageClipRectHeight * vector_koef + (pageTopField + pageBottomField);
                }

                // Нужно будет пересчитывать колонки
                isCalcColumnsWidth = true;

                // Рисуем сетку
                if (pageGridLines) {
                    newPagePrint.pageGridLines = true;
                }

                if (pageHeadings) {
                    // Нужно отрисовать заголовки
                    newPagePrint.pageHeadings = true;
                }

                newPagePrint.pageRange = new asc_Range(currentColIndex, currentRowIndex, colIndex - 1, rowIndex - 1);

                if (bIsAddOffset) {
                    // Мы еще не дорисовали колонку
                    colIndex -= 1;
                } else {
                    nCountOffset = 0;
                }

                if (colIndex < maxCols) {
                    // Мы еще не все колонки отрисовали
                    currentColIndex = colIndex;
                    currentHeight = 0;
                } else {
                    // Мы дорисовали все колонки, нужна новая строка и стартовая колонка
                    currentColIndex = (null !== selectionRange) ? selectionRange.c1 : 0;
                    currentRowIndex = rowIndex;
                    currentHeight = 0;
                }

                if (rowIndex === maxRows) {
                    // Мы вышли, т.к. дошли до конца отрисовки по строкам
                    if (colIndex < maxCols) {
                        currentColIndex = colIndex;
                        currentHeight = 0;
                    } else {
                        // Мы дошли до конца отрисовки
                        currentColIndex = colIndex;
                        currentRowIndex = rowIndex;
                    }
                }

                arrPages.push(newPagePrint);
            }
        }
    };
    WorksheetView.prototype.drawForPrint = function(drawingCtx, printPagesData) {
        if (null === printPagesData) {
            // Напечатаем пустую страницу
            drawingCtx.BeginPage(c_oAscPrintDefaultSettings.PageWidth, c_oAscPrintDefaultSettings.PageHeight);
            drawingCtx.EndPage();
        } else {
            drawingCtx.BeginPage(printPagesData.pageWidth, printPagesData.pageHeight);
            drawingCtx.AddClipRect(printPagesData.pageClipRectLeft, printPagesData.pageClipRectTop,
              printPagesData.pageClipRectWidth, printPagesData.pageClipRectHeight);

            var offsetCols = printPagesData.startOffsetPt;
            var range = printPagesData.pageRange;
            var offsetX = this.cols[range.c1].left - printPagesData.leftFieldInPt + offsetCols;
            var offsetY = this.rows[range.r1].top - printPagesData.topFieldInPt;

            var tmpVisibleRange = this.visibleRange;
            // Сменим visibleRange для прохождения проверок отрисовки
            this.visibleRange = range;

            // Нужно отрисовать заголовки
            if (printPagesData.pageHeadings) {
                this._drawColumnHeaders(drawingCtx, range.c1, range.c2, /*style*/ undefined, offsetX,
                  printPagesData.topFieldInPt - this.cellsTop);
                this._drawRowHeaders(drawingCtx, range.r1, range.r2, /*style*/ undefined,
                  printPagesData.leftFieldInPt - this.cellsLeft, offsetY);
            }

            // Рисуем сетку
            if (printPagesData.pageGridLines) {
                this._drawGrid(drawingCtx, range, offsetX, offsetY, printPagesData.pageWidth / vector_koef,
                  printPagesData.pageHeight / vector_koef);
            }

            // Отрисовываем ячейки и бордеры
            this._drawCellsAndBorders(drawingCtx, range, offsetX, offsetY);

            var drawingPrintOptions = {
                ctx: drawingCtx, printPagesData: printPagesData
            };
            this.objectRender.showDrawingObjectsEx(false, null, drawingPrintOptions);
            this.visibleRange = tmpVisibleRange;

            drawingCtx.RemoveClipRect();
            drawingCtx.EndPage();
        }
    };

    // ----- Drawing -----

    WorksheetView.prototype.draw = function (lockDraw) {
        if (lockDraw || this.model.workbook.bCollaborativeChanges || window['IS_NATIVE_EDITOR']) {
            return this;
        }
        this._clean();
        this._drawCorner();
        this._drawColumnHeaders(/*drawingCtx*/ undefined);
        this._drawRowHeaders(/*drawingCtx*/ undefined);
        this._drawGrid(/*drawingCtx*/ undefined);
        this._drawCellsAndBorders(/*drawingCtx*/undefined);
        this._drawFrozenPane();
        this._drawFrozenPaneLines();
        this._fixSelectionOfMergedCells();
        this._drawElements(this.af_drawButtons);
        this.cellCommentator.drawCommentCells();
        this.objectRender.showDrawingObjectsEx(true);
        if (this.overlayCtx) {
            this._drawSelection();
        }

        return this;
    };

    WorksheetView.prototype._clean = function () {
        this.drawingCtx
            .setFillStyle( this.settings.cells.defaultState.background )
            .fillRect( 0, 0, this.drawingCtx.getWidth(), this.drawingCtx.getHeight() );
        if ( this.overlayCtx ) {
            this.overlayCtx.clear();
        }
    };

    WorksheetView.prototype.drawHighlightedHeaders = function (col, row) {
        this._activateOverlayCtx();
        if (col >= 0 && col !== this.highlightedCol) {
            this._doCleanHighlightedHeaders();
            this.highlightedCol = col;
            this._drawColumnHeaders(/*drawingCtx*/ undefined, col, col, kHeaderHighlighted);
        } else if (row >= 0 && row !== this.highlightedRow) {
            this._doCleanHighlightedHeaders();
            this.highlightedRow = row;
            this._drawRowHeaders(/*drawingCtx*/ undefined, row, row, kHeaderHighlighted);
        }
        this._deactivateOverlayCtx();
        return this;
    };

    WorksheetView.prototype.cleanHighlightedHeaders = function () {
        this._activateOverlayCtx();
        this._doCleanHighlightedHeaders();
        this._deactivateOverlayCtx();
        return this;
    };

    WorksheetView.prototype._activateOverlayCtx = function () {
        this.drawingCtx = this.buffers.overlay;
    };

    WorksheetView.prototype._deactivateOverlayCtx = function () {
        this.drawingCtx = this.buffers.main;
    };

    WorksheetView.prototype._doCleanHighlightedHeaders = function () {
        // ToDo highlighted!
        var hlc = this.highlightedCol, hlr = this.highlightedRow, arn = this.model.selectionRange.getLast();
        var hStyle = this.objectRender.selectedGraphicObjectsExists() ? kHeaderDefault : kHeaderActive;
        if (hlc >= 0) {
            if (hlc >= arn.c1 && hlc <= arn.c2) {
                this._drawColumnHeaders(/*drawingCtx*/ undefined, hlc, hlc, hStyle);
            } else {
                this._cleanColumnHeaders(hlc);
                if (hlc + 1 === arn.c1) {
                    this._drawColumnHeaders(/*drawingCtx*/ undefined, hlc + 1, hlc + 1, kHeaderActive);
                } else if (hlc - 1 === arn.c2) {
                    this._drawColumnHeaders(/*drawingCtx*/ undefined, hlc - 1, hlc - 1, hStyle);
                }
            }
            this.highlightedCol = -1;
        }
        if (hlr >= 0) {
            if (hlr >= arn.r1 && hlr <= arn.r2) {
                this._drawRowHeaders(/*drawingCtx*/ undefined, hlr, hlr, hStyle);
            } else {
                this._cleanRowHeaders(hlr);
                if (hlr + 1 === arn.r1) {
                    this._drawRowHeaders(/*drawingCtx*/ undefined, hlr + 1, hlr + 1, kHeaderActive);
                } else if (hlr - 1 === arn.r2) {
                    this._drawRowHeaders(/*drawingCtx*/ undefined, hlr - 1, hlr - 1, hStyle);
                }
            }
            this.highlightedRow = -1;
        }
    };

    WorksheetView.prototype._drawActiveHeaders = function () {
        var vr = this.visibleRange;
        var range, c1, c2, r1, r2;
        this._activateOverlayCtx();
        for (var i = 0; i < this.model.selectionRange.ranges.length; ++i) {
            range = this.model.selectionRange.ranges[i];
            c1 = Math.max(vr.c1, range.c1);
            c2 = Math.min(vr.c2, range.c2);
            r1 = Math.max(vr.r1, range.r1);
            r2 = Math.min(vr.r2, range.r2);
            this._drawColumnHeaders(/*drawingCtx*/ undefined, c1, c2, kHeaderActive);
            this._drawRowHeaders(/*drawingCtx*/ undefined, r1, r2, kHeaderActive);
            if (this.topLeftFrozenCell) {
                var cFrozen = this.topLeftFrozenCell.getCol0() - 1;
                var rFrozen = this.topLeftFrozenCell.getRow0() - 1;
                if (0 <= cFrozen) {
                    c1 = Math.max(0, range.c1);
                    c2 = Math.min(cFrozen, range.c2);
                    this._drawColumnHeaders(/*drawingCtx*/ undefined, c1, c2, kHeaderActive);
                }
                if (0 <= rFrozen) {
                    r1 = Math.max(0, range.r1);
                    r2 = Math.min(rFrozen, range.r2);
                    this._drawRowHeaders(/*drawingCtx*/ undefined, r1, r2, kHeaderActive);
                }
            }
        }
        this._deactivateOverlayCtx();
    };

    WorksheetView.prototype._drawCorner = function () {
        if (false === this.model.sheetViews[0].asc_getShowRowColHeaders()) {
            return;
        }
        var x2 = this.headersLeft + this.headersWidth;
        var x1 = x2 - this.headersHeight;
        var y2 = this.headersTop + this.headersHeight;
        var y1 = this.headersTop;

        var dx = 4 * this.width_1px;
        var dy = 4 * this.height_1px;

        this._drawHeader(/*drawingCtx*/ undefined, this.headersLeft, this.headersTop, this.headersWidth,
          this.headersHeight, kHeaderDefault, true, -1);
        this.drawingCtx.beginPath()
          .moveTo(x2 - dx, y1 + dy)
          .lineTo(x2 - dx, y2 - dy)
          .lineTo(x1 + dx, y2 - dy)
          .lineTo(x2 - dx, y1 + dy)
          .setFillStyle(this.settings.header.cornerColor)
          .fill();
    };

    /** Рисует заголовки видимых колонок */
    WorksheetView.prototype._drawColumnHeaders =
      function (drawingCtx, start, end, style, offsetXForDraw, offsetYForDraw) {
          if (undefined === drawingCtx && false === this.model.sheetViews[0].asc_getShowRowColHeaders()) {
              return;
          }
          var vr = this.visibleRange;
          var c = this.cols;
          var offsetX = (undefined !== offsetXForDraw) ? offsetXForDraw : c[vr.c1].left - this.cellsLeft;
          var offsetY = (undefined !== offsetYForDraw) ? offsetYForDraw : this.headersTop;
          if (undefined === drawingCtx && this.topLeftFrozenCell && undefined === offsetXForDraw) {
              var cFrozen = this.topLeftFrozenCell.getCol0();
              if (start < vr.c1) {
                  offsetX = c[0].left - this.cellsLeft;
              } else {
                  offsetX -= c[cFrozen].left - c[0].left;
              }
          }

          if (asc_typeof(start) !== "number") {
              start = vr.c1;
          }
          if (asc_typeof(end) !== "number") {
              end = vr.c2;
          }
          if (style === undefined) {
              style = kHeaderDefault;
          }

          this._setFont(drawingCtx, this.model.getDefaultFontName(), this.model.getDefaultFontSize());

          // draw column headers
          for (var i = start; i <= end; ++i) {
              this._drawHeader(drawingCtx, c[i].left - offsetX, offsetY, c[i].width, this.headersHeight, style, true,
                i);
          }
      };

    /** Рисует заголовки видимых строк */
    WorksheetView.prototype._drawRowHeaders = function (drawingCtx, start, end, style, offsetXForDraw, offsetYForDraw) {
        if (undefined === drawingCtx && false === this.model.sheetViews[0].asc_getShowRowColHeaders()) {
            return;
        }
        var vr = this.visibleRange;
        var r = this.rows;
        var offsetX = (undefined !== offsetXForDraw) ? offsetXForDraw : this.headersLeft;
        var offsetY = (undefined !== offsetYForDraw) ? offsetYForDraw : r[vr.r1].top - this.cellsTop;
        if (undefined === drawingCtx && this.topLeftFrozenCell && undefined === offsetYForDraw) {
            var rFrozen = this.topLeftFrozenCell.getRow0();
            if (start < vr.r1) {
                offsetY = r[0].top - this.cellsTop;
            } else {
                offsetY -= r[rFrozen].top - r[0].top;
            }
        }

        if (asc_typeof(start) !== "number") {
            start = vr.r1;
        }
        if (asc_typeof(end) !== "number") {
            end = vr.r2;
        }
        if (style === undefined) {
            style = kHeaderDefault;
        }

        this._setFont(drawingCtx, this.model.getDefaultFontName(), this.model.getDefaultFontSize());

        // draw row headers
        for (var i = start; i <= end; ++i) {
            this._drawHeader(drawingCtx, offsetX, r[i].top - offsetY, this.headersWidth, r[i].height, style, false, i);
        }
    };

    /**
     * Рисует заголовок, принимает координаты и размеры в pt
     * @param {DrawingContext} drawingCtx
     * @param {Number} x  Координата левого угла в pt
     * @param {Number} y  Координата левого угла в pt
     * @param {Number} w  Ширина в pt
     * @param {Number} h  Высота в pt
     * @param {Number} style  Стиль заголовка (kHeaderDefault, kHeaderActive, kHeaderHighlighted)
     * @param {Boolean} isColHeader  Тип заголовка: true - колонка, false - строка
     * @param {Number} index  Индекс столбца/строки или -1
     */
    WorksheetView.prototype._drawHeader = function (drawingCtx, x, y, w, h, style, isColHeader, index) {
        // Для отрисовки невидимого столбца/строки
        var isZeroHeader = false;
        if (-1 !== index) {
            if (isColHeader) {
                if (w < this.width_1px) {
                    if (style !== kHeaderDefault) {
                        return;
                    }
                    // Это невидимый столбец
                    isZeroHeader = true;
                    // Отрисуем только границу
                    w = this.width_1px;
                    // Возможно мы уже рисовали границу невидимого столбца (для последовательности невидимых)
                    if (0 < index && 0 === this.cols[index - 1].width) {
                        // Мы уже нарисовали border для невидимой границы
                        return;
                    }
                } else if (0 < index && 0 === this.cols[index - 1].width) {
                    // Мы уже нарисовали border для невидимой границы (поэтому нужно чуть меньше рисовать для соседнего столбца)
                    w -= this.width_1px;
                    x += this.width_1px;
                }
            } else {
                if (h < this.height_1px) {
                    if (style !== kHeaderDefault) {
                        return;
                    }
                    // Это невидимая строка
                    isZeroHeader = true;
                    // Отрисуем только границу
                    h = this.height_1px;
                    // Возможно мы уже рисовали границу невидимой строки (для последовательности невидимых)
                    if (0 < index && 0 === this.rows[index - 1].height) {
                        // Мы уже нарисовали border для невидимой границы
                        return;
                    }
                } else if (0 < index && 0 === this.rows[index - 1].height) {
                    // Мы уже нарисовали border для невидимой границы (поэтому нужно чуть меньше рисовать для соседней строки)
                    h -= this.height_1px;
                    y += this.height_1px;
                }
            }
        }

        var ctx = (drawingCtx) ? drawingCtx : this.drawingCtx;
        var st = this.settings.header.style[style];
        var x2 = x + w;
        var y2 = y + h;
        var x2WithoutBorder = x2 - this.width_1px;
        var y2WithoutBorder = y2 - this.height_1px;

        // background только для видимых
        if (!isZeroHeader) {
            // draw background
            ctx.setFillStyle(st.background)
              .fillRect(x, y, w, h);
        }
        // draw border
        ctx.setStrokeStyle(st.border)
          .setLineWidth(1)
          .beginPath();
        if (style !== kHeaderDefault && !isColHeader) {
            // Select row (top border)
            ctx.lineHorPrevPx(x, y, x2);
        }

        // Right border
        ctx.lineVerPrevPx(x2, y, y2);
        // Bottom border
        ctx.lineHorPrevPx(x, y2, x2);

        if (style !== kHeaderDefault && isColHeader) {
            // Select col (left border)
            ctx.lineVerPrevPx(x, y, y2);
        }
        ctx.stroke();

        // Для невидимых кроме border-а ничего не рисуем
        if (isZeroHeader || -1 === index) {
            return;
        }

        // draw text
        var text = isColHeader ? this._getColumnTitle(index) : this._getRowTitle(index);
        var sr = this.stringRender;
        var tm = this._roundTextMetrics(sr.measureString(text));
        var bl = y2WithoutBorder - (isColHeader ? this.defaultRowDescender : this.rows[index].descender);
        var textX = this._calcTextHorizPos(x, x2WithoutBorder, tm, tm.width < w ? AscCommon.align_Center : AscCommon.align_Left);
        var textY = this._calcTextVertPos(y, y2WithoutBorder, bl, tm, Asc.c_oAscVAlign.Bottom);
        if (drawingCtx) {
            ctx.AddClipRect(x, y, w, h);
            ctx.setFillStyle(st.color)
              .fillText(text, textX, textY + tm.baseline, undefined, sr.charWidths);
            ctx.RemoveClipRect();
        } else {
            ctx.save()
              .beginPath()
              .rect(x, y, w, h)
              .clip()
              .setFillStyle(st.color)
              .fillText(text, textX, textY + tm.baseline, undefined, sr.charWidths)
              .restore();
        }
    };

    WorksheetView.prototype._cleanColumnHeaders = function (colStart, colEnd) {
        var offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft;
        var i, cFrozen = 0;
        if (this.topLeftFrozenCell) {
            cFrozen = this.topLeftFrozenCell.getCol0();
            offsetX -= this.cols[cFrozen].left - this.cols[0].left;
        }

        if (colEnd === undefined) {
            colEnd = colStart;
        }
        var colStartTmp = Math.max(this.visibleRange.c1, colStart);
        var colEndTmp = Math.min(this.visibleRange.c2, colEnd);
        for (i = colStartTmp; i <= colEndTmp; ++i) {
            this.drawingCtx.clearRectByX(this.cols[i].left - offsetX, this.headersTop, this.cols[i].width,
              this.headersHeight);
        }
        if (0 !== cFrozen) {
            offsetX = this.cols[0].left - this.cellsLeft;
            // Почистим для pane
            colStart = Math.max(0, colStart);
            colEnd = Math.min(cFrozen, colEnd);
            for (i = colStart; i <= colEnd; ++i) {
                this.drawingCtx.clearRectByX(this.cols[i].left - offsetX, this.headersTop, this.cols[i].width,
                  this.headersHeight);
            }
        }
    };

    WorksheetView.prototype._cleanRowHeaders = function (rowStart, rowEnd) {
        var offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
        var i, rFrozen = 0;
        if (this.topLeftFrozenCell) {
            rFrozen = this.topLeftFrozenCell.getRow0();
            offsetY -= this.rows[rFrozen].top - this.rows[0].top;
        }

        if (rowEnd === undefined) {
            rowEnd = rowStart;
        }
        var rowStartTmp = Math.max(this.visibleRange.r1, rowStart);
        var rowEndTmp = Math.min(this.visibleRange.r2, rowEnd);
        for (i = rowStartTmp; i <= rowEndTmp; ++i) {
            if (this.height_1px > this.rows[i].height) {
                continue;
            }
            this.drawingCtx.clearRectByY(this.headersLeft, this.rows[i].top - offsetY, this.headersWidth,
              this.rows[i].height);
        }
        if (0 !== rFrozen) {
            offsetY = this.rows[0].top - this.cellsTop;
            // Почистим для pane
            rowStart = Math.max(0, rowStart);
            rowEnd = Math.min(rFrozen, rowEnd);
            for (i = rowStart; i <= rowEnd; ++i) {
                if (this.height_1px > this.rows[i].height) {
                    continue;
                }
                this.drawingCtx.clearRectByY(this.headersLeft, this.rows[i].top - offsetY, this.headersWidth,
                  this.rows[i].height);
            }
        }
    };

    WorksheetView.prototype._cleanColumnHeadersRect = function () {
        this.drawingCtx.clearRect(this.cellsLeft, this.headersTop, this.drawingCtx.getWidth() - this.cellsLeft,
          this.headersHeight);
    };

    /** Рисует сетку таблицы */
    WorksheetView.prototype._drawGrid = function ( drawingCtx, range, leftFieldInPt, topFieldInPt, width, height ) {
        // Возможно сетку не нужно рисовать (при печати свои проверки)
        if ( undefined === drawingCtx && false === this.model.sheetViews[0].asc_getShowGridLines() ) {
            return;
        }

        if ( range === undefined ) {
            range = this.visibleRange;
        }
        var ctx = (drawingCtx) ? drawingCtx : this.drawingCtx;
        var c = this.cols;
        var r = this.rows;
        var widthCtx = (width) ? width : ctx.getWidth();
        var heightCtx = (height) ? height : ctx.getHeight();
        var offsetX = (undefined !== leftFieldInPt) ? leftFieldInPt : c[this.visibleRange.c1].left - this.cellsLeft;
        var offsetY = (undefined !== topFieldInPt) ? topFieldInPt : r[this.visibleRange.r1].top - this.cellsTop;
        if ( undefined === drawingCtx && this.topLeftFrozenCell ) {
            if ( undefined === leftFieldInPt ) {
                var cFrozen = this.topLeftFrozenCell.getCol0();
                offsetX -= c[cFrozen].left - c[0].left;
            }
            if ( undefined === topFieldInPt ) {
                var rFrozen = this.topLeftFrozenCell.getRow0();
                offsetY -= r[rFrozen].top - r[0].top;
            }
        }
        var x1 = c[range.c1].left - offsetX;
        var y1 = r[range.r1].top - offsetY;
        var x2 = Math.min( c[range.c2].left - offsetX + c[range.c2].width, widthCtx );
        var y2 = Math.min( r[range.r2].top - offsetY + r[range.r2].height, heightCtx );
        ctx.setFillStyle( this.settings.cells.defaultState.background )
            .fillRect( x1, y1, x2 - x1, y2 - y1 )
            .setStrokeStyle( this.settings.cells.defaultState.border )
            .setLineWidth( 1 ).beginPath();

        var w, h;
        for ( var i = range.c1, x = x1; i <= range.c2 && x <= x2; ++i ) {
            w = c[i].width;
            x += w;
            if ( w >= this.width_1px ) {
                ctx.lineVerPrevPx( x, y1, y2 );
            }
        }
        for ( var j = range.r1, y = y1; j <= range.r2 && y <= y2; ++j ) {
            h = r[j].height;
            y += h;
            if ( h >= this.height_1px ) {
                ctx.lineHorPrevPx( x1, y, x2 );
            }
        }

        ctx.stroke();
    };

    WorksheetView.prototype._drawCellsAndBorders = function ( drawingCtx, range, offsetXForDraw, offsetYForDraw ) {
        if ( range === undefined ) {
            range = this.visibleRange;
        }

        var left, top, cFrozen, rFrozen;
        var offsetX = (undefined === offsetXForDraw) ? this.cols[this.visibleRange.c1].left - this.cellsLeft : offsetXForDraw;
        var offsetY = (undefined === offsetYForDraw) ? this.rows[this.visibleRange.r1].top - this.cellsTop : offsetYForDraw;
        if ( undefined === drawingCtx && this.topLeftFrozenCell ) {
            if ( undefined === offsetXForDraw ) {
                cFrozen = this.topLeftFrozenCell.getCol0();
                offsetX -= this.cols[cFrozen].left - this.cols[0].left;
            }
            if ( undefined === offsetYForDraw ) {
                rFrozen = this.topLeftFrozenCell.getRow0();
                offsetY -= this.rows[rFrozen].top - this.rows[0].top;
            }
        }

        if ( !drawingCtx && !window['IS_NATIVE_EDITOR'] ) {
            left = this.cols[range.c1].left;
            top = this.rows[range.r1].top;
            // set clipping rect to cells area
            this.drawingCtx.save()
                .beginPath()
                .rect( left - offsetX, top - offsetY, Math.min( this.cols[range.c2].left - left + this.cols[range.c2].width, this.drawingCtx.getWidth() - this.cellsLeft ), Math.min( this.rows[range.r2].top - top + this.rows[range.r2].height, this.drawingCtx.getHeight() - this.cellsTop ) )
                .clip();
        }

        var mergedCells = this._drawCells( drawingCtx, range, offsetX, offsetY );
        this._drawCellsBorders( drawingCtx, range, offsetX, offsetY, mergedCells );

        if ( !drawingCtx && !window['IS_NATIVE_EDITOR'] ) {
            // restore canvas' original clipping range
            this.drawingCtx.restore();
        }
    };

    /** Рисует спарклайны */
    WorksheetView.prototype._drawSparklines = function(drawingCtx, range, offsetX, offsetY) {
        var ctx = (undefined === drawingCtx) ? this.drawingCtx : drawingCtx;
        this.objectRender.drawSparkLineGroups(ctx, this.model.aSparklineGroups, range, offsetX, offsetY);
    };

    /** Рисует ячейки таблицы */
    WorksheetView.prototype._drawCells = function ( drawingCtx, range, offsetX, offsetY ) {
        this._prepareCellTextMetricsCache( range );

        var mergedCells = [], mc, i;
        for ( var row = range.r1; row <= range.r2; ++row ) {
            mergedCells =
              mergedCells.concat(this._drawRowBG(drawingCtx, row, range.c1, range.c2, offsetX, offsetY, null),
                this._drawRowText(drawingCtx, row, range.c1, range.c2, offsetX, offsetY));
        }
        // draw merged cells at last stage to fix cells background issue
        for (i = 0; i < mergedCells.length; ++i) {
            if (i === mergedCells.indexOf(mergedCells[i])) {
                mc = mergedCells[i];
                this._drawRowBG(drawingCtx, mc.r1, mc.c1, mc.c1, offsetX, offsetY, mc);
                this._drawCellText(drawingCtx, mc.c1, mc.r1, range.c1, range.c2, offsetX, offsetY, true);
            }
        }
        this._drawSparklines(drawingCtx, range, offsetX, offsetY);
        return mergedCells;
    };

    /** Рисует фон ячеек в строке */
    WorksheetView.prototype._drawRowBG = function ( drawingCtx, row, colStart, colEnd, offsetX, offsetY, oMergedCell ) {
        var mergedCells = [];
        if ( this.rows[row].height < this.height_1px && null === oMergedCell ) {
            return mergedCells;
        }

        var ctx = (undefined === drawingCtx) ? this.drawingCtx : drawingCtx;
        for ( var col = colStart; col <= colEnd; ++col ) {
            if ( this.cols[col].width < this.width_1px && null === oMergedCell ) {
                continue;
            }

            // ToDo подумать, может стоит не брать ячейку из модели (а брать из кеш-а)
            var c = this._getVisibleCell( col, row );
            var bg = c.getFill();
            var mc = null;
            var mwidth = 0, mheight = 0;

            if ( null === oMergedCell ) {
                mc = this.model.getMergedByCell( row, col );
                if ( null !== mc ) {
                    mergedCells.push(mc);
                    col = mc.c2;
                    continue;
                }
            }
            else {
                mc = oMergedCell;
            }

            if ( null !== mc ) {
                if ( col !== mc.c1 || row !== mc.r1 ) {
                    continue;
                }
                for ( var i = mc.c1 + 1; i <= mc.c2 && i < this.cols.length; ++i ) {
                    mwidth += this.cols[i].width;
                }
                for ( var j = mc.r1 + 1; j <= mc.r2 && j < this.rows.length; ++j ) {
                    mheight += this.rows[j].height;
                }
            }
            else {
                if ( bg === null ) {
                    if ( col === colEnd && col < this.cols.length - 1 && row < this.rows.length - 1 ) {
                        var c2 = this._getVisibleCell( col + 1, row );
                            var bg2 = c2.getFill();
                            if ( bg2 !== null ) {
                                ctx.setFillStyle( bg2 )
                                    .fillRect( this.cols[col + 1].left - offsetX - this.width_1px, this.rows[row].top - offsetY - this.height_1px, this.width_1px, this.rows[row].height + this.height_1px );
                            }
                        var c3 = this._getVisibleCell( col, row + 1 );
                            var bg3 = c3.getFill();
                            if ( bg3 !== null ) {
                                ctx.setFillStyle( bg3 )
                                    .fillRect( this.cols[col].left - offsetX - this.width_1px, this.rows[row + 1].top - offsetY - this.height_1px, this.cols[col].width + this.width_1px, this.height_1px );
                            }
                        }
                    continue;
                }
            }

            var x = this.cols[col].left - (bg !== null ? this.width_1px : 0);
            var y = this.rows[row].top - (bg !== null ? this.height_1px : 0);
            var w = this.cols[col].width + this.width_1px * (bg !== null ? +1 : -1) + mwidth;
            var h = this.rows[row].height + this.height_1px * (bg !== null ? +1 : -1) + mheight;
            var color = bg !== null ? bg : this.settings.cells.defaultState.background;
            ctx.setFillStyle( color ).fillRect( x - offsetX, y - offsetY, w, h );
        }
        return mergedCells;
    };

    /** Рисует текст ячеек в строке */
    WorksheetView.prototype._drawRowText = function ( drawingCtx, row, colStart, colEnd, offsetX, offsetY ) {
        var mergedCells = [];
        if ( this.rows[row].height < this.height_1px ) {
            return mergedCells;
        }

        var dependentCells = {}, i, mc, col;
        // draw cells' text
        for ( col = colStart; col <= colEnd; ++col ) {
            if ( this.cols[col].width < this.width_1px ) {
                continue;
            }
            mc = this._drawCellText( drawingCtx, col, row, colStart, colEnd, offsetX, offsetY, false );
            if ( mc !== null ) {
                mergedCells.push(mc);
            }
            // check if long text overlaps this cell
            i = this._findSourceOfCellText( col, row );
            if ( i >= 0 ) {
                dependentCells[i] = (dependentCells[i] || []);
                dependentCells[i].push( col );
            }
        }
        // draw long text that overlaps own cell's borders
        for ( i in dependentCells ) {
            var arr = dependentCells[i], j = arr.length - 1;
            col = i >> 0;
            // if source cell belongs to cells range then skip it (text has been drawn already)
            if ( col >= arr[0] && col <= arr[j] ) {
                continue;
            }
            // draw long text fragment
            this._drawCellText( drawingCtx, col, row, arr[0], arr[j], offsetX, offsetY, false );
        }
        return mergedCells;
    };

    /** Рисует текст ячейки */
    WorksheetView.prototype._drawCellText = function ( drawingCtx, col, row, colStart, colEnd, offsetX, offsetY, drawMergedCells ) {
        var ct = this._getCellTextCache( col, row );
        if ( ct === undefined ) {
            return null;
        }

        var isMerged = ct.flags.isMerged(), range = undefined, isWrapped = ct.flags.wrapText;
        var ctx = (undefined === drawingCtx) ? this.drawingCtx : drawingCtx;

        if ( isMerged ) {
            range = ct.flags.merged;
            if ( !drawMergedCells ) {
                return range;
            }
            if ( col !== range.c1 || row !== range.r1 ) {
                return null;
            }
        }

        var colL = isMerged ? range.c1 : Math.max( colStart, col - ct.sideL );
        var colR = isMerged ? Math.min( range.c2, this.nColsCount - 1 ) : Math.min( colEnd, col + ct.sideR );
        var rowT = isMerged ? range.r1 : row;
        var rowB = isMerged ? Math.min( range.r2, this.nRowsCount - 1 ) : row;
        var isTrimmedR = !isMerged && colR !== col + ct.sideR;

        if ( !(ct.angle || 0) ) {
            if ( !isMerged && !isWrapped ) {
                this._eraseCellRightBorder( drawingCtx, colL, colR + (isTrimmedR ? 1 : 0), row, offsetX, offsetY );
            }
        }

        var x1 = this.cols[colL].left - offsetX;
        var y1 = this.rows[rowT].top - offsetY;
        var w = this.cols[colR].left + this.cols[colR].width - offsetX - x1;
        var h = this.rows[rowB].top + this.rows[rowB].height - offsetY - y1;
        var x2 = x1 + w - (isTrimmedR ? 0 : this.width_1px);
        var y2 = y1 + h - this.height_1px;
        var bl = !isMerged ? (y2 - this.rows[rowB].descender) : (y2 - ct.metrics.height + ct.metrics.baseline - this.height_1px);
        var x1ct = isMerged ? x1 : this.cols[col].left - offsetX;
        var x2ct = isMerged ? x2 : x1ct + this.cols[col].width - this.width_1px;
        var textX = this._calcTextHorizPos( x1ct, x2ct, ct.metrics, ct.cellHA );
        var textY = this._calcTextVertPos( y1, y2, bl, ct.metrics, ct.cellVA );
        var textW = this._calcTextWidth( x1ct, x2ct, ct.metrics, ct.cellHA );

        var xb1, yb1, wb, hb, colLeft, colRight, i, textAlign;
        var txtRotX, txtRotW, clipUse = false;

        if ( drawingCtx ) {

            // для печати

            if ( ct.angle || 0 ) {

                xb1 = this.cols[col].left - offsetX;
                yb1 = this.rows[row].top - offsetY;
                wb = this.cols[col].width;
                hb = this.rows[row].height;

                txtRotX = xb1 - ct.textBound.offsetX;
                txtRotW = ct.textBound.width + xb1 - ct.textBound.offsetX;

                if ( isMerged ) {

                    wb = 0;

                    for ( i = colL; i <= colR && i < this.nColsCount; ++i ) {
                        wb += this.cols[i].width;
                    }

                    hb = 0;

                    for ( i = rowT; i <= rowB && i < this.nRowsCount; ++i ) {
                        hb += this.rows[i].height;
                    }

                    ctx.AddClipRect( xb1, yb1, wb, hb );
                    clipUse = true;
                }

                this.stringRender.angle = ct.angle;
                this.stringRender.fontNeedUpdate = true;

                if ( 90 === ct.angle || -90 === ct.angle ) {
                    // клип по ячейке
                    if ( !isMerged ) {
                        ctx.AddClipRect( xb1, yb1, wb, hb );
                        clipUse = true;
                    }
                }
                else {
                    // клип по строке
                    if ( !isMerged ) {
                        ctx.AddClipRect( 0, yb1, this.drawingCtx.getWidth(), h );
                        clipUse = true;
                    }

                    if ( !isMerged && !isWrapped ) {
                        colLeft = col;
                        if ( 0 !== txtRotX ) {
                            while ( true ) {
                                if ( 0 == colLeft ) {
                                    break;
                                }
                                if ( txtRotX >= this.cols[colLeft].left ) {
                                    break;
                                }
                                --colLeft;
                            }
                        }

                        colRight = Math.min( col, this.nColsCount - 1 );
                        if ( 0 !== txtRotW ) {
                            while ( true ) {
                                ++colRight;
                                if ( colRight >= this.nColsCount ) {
                                    --colRight;
                                    break;
                                }
                                if ( txtRotW <= this.cols[colRight].left ) {
                                    --colRight;
                                    break;
                                }
                            }
                        }

                        colLeft = isMerged ? range.c1 : colLeft;
                        colRight = isMerged ? Math.min( range.c2, this.nColsCount - 1 ) : colRight;

                        this._eraseCellRightBorder( drawingCtx, colLeft, colRight + (isTrimmedR ? 1 : 0), row, offsetX, offsetY );
                    }
                }

                this.stringRender.rotateAtPoint( drawingCtx, ct.angle, xb1, yb1, ct.textBound.dx, ct.textBound.dy );
                this.stringRender.restoreInternalState( ct.state ).renderForPrint( drawingCtx, 0, 0, textW, ct.color );

                textAlign = this.stringRender.flags.textAlign;
                if (isWrapped) {
                    if (ct.angle < 0) {
                        if (Asc.c_oAscVAlign.Top === ct.cellVA)
                            this.stringRender.flags.textAlign = AscCommon.align_Left;
                        else if (Asc.c_oAscVAlign.Center === ct.cellVA)
                            this.stringRender.flags.textAlign = AscCommon.align_Center;
                        else if (Asc.c_oAscVAlign.Bottom === ct.cellVA)
                            this.stringRender.flags.textAlign = AscCommon.align_Right;
                    }
                    else {
                        if (Asc.c_oAscVAlign.Top === ct.cellVA)
                            this.stringRender.flags.textAlign = AscCommon.align_Right;
                        else if (Asc.c_oAscVAlign.Center === ct.cellVA)
                            this.stringRender.flags.textAlign = AscCommon.align_Center;
                        else if (Asc.c_oAscVAlign.Bottom === ct.cellVA)
                            this.stringRender.flags.textAlign = AscCommon.align_Left;
                    }
                }

                this.stringRender.resetTransform( drawingCtx );

                if ( clipUse ) {
                    ctx.RemoveClipRect();
                }
            }
            else {
                ctx.AddClipRect( x1, y1, w, h );
                this.stringRender.restoreInternalState( ct.state ).renderForPrint( drawingCtx, textX, textY, textW, ct.color );
                ctx.RemoveClipRect();
            }
        }
        else {

            // для отрисовки

            if ( ct.angle || 0 ) {

                xb1 = this.cols[col].left - offsetX;
                yb1 = this.rows[row].top  - offsetY;
                wb  = this.cols[col].width;
                hb  = this.rows[row].height;

                txtRotX = xb1 - ct.textBound.offsetX;
                txtRotW = ct.textBound.width + xb1 - ct.textBound.offsetX;

                if ( isMerged ) {

                    wb = 0;

                    for ( i = colL; i <= colR && i < this.nColsCount; ++i ) {
                        wb += this.cols[i].width;
                    }

                    hb = 0;

                    for ( i = rowT; i <= rowB && i < this.nRowsCount; ++i ) {
                        hb += this.rows[i].height;
                    }

                    ctx.save().beginPath().rect( xb1, yb1, wb, hb ).clip();
                    clipUse = true;
                }

                this.stringRender.angle = ct.angle;
                this.stringRender.fontNeedUpdate = true;

                if ( 90 === ct.angle || -90 === ct.angle ) {
                    // клип по ячейке
                    if ( !isMerged ) {
                        ctx.save().beginPath().rect( xb1, yb1, wb, hb ).clip();
                        clipUse = true;
                    }
                }
                else {
                    // клип по строке
                    if ( !isMerged ) {
                        ctx.save().beginPath().rect( 0, y1, this.drawingCtx.getWidth(), h ).clip();
                        clipUse = true;
                    }

                    if ( !isMerged && !isWrapped ) {
                        colLeft = col;
                        if ( 0 !== txtRotX ) {
                            while ( true ) {
                                if ( 0 == colLeft ) {
                                    break;
                                }
                                if ( txtRotX >= this.cols[colLeft].left ) {
                                    break;
                                }
                                --colLeft;
                            }
                        }

                        colRight = Math.min( col, this.nColsCount - 1 );
                        if ( 0 !== txtRotW ) {
                            while ( true ) {
                                ++colRight;
                                if ( colRight >= this.nColsCount ) {
                                    --colRight;
                                    break;
                                }
                                if ( txtRotW <= this.cols[colRight].left ) {
                                    --colRight;
                                    break;
                                }
                            }
                        }

                        colLeft = isMerged ? range.c1 : colLeft;
                        colRight = isMerged ? Math.min( range.c2, this.nColsCount - 1 ) : colRight;

                        this._eraseCellRightBorder( drawingCtx, colLeft, colRight + (isTrimmedR ? 1 : 0), row, offsetX, offsetY );
                    }
                }

                this.stringRender.rotateAtPoint(null, ct.angle, xb1, yb1, ct.textBound.dx, ct.textBound.dy);
                this.stringRender.restoreInternalState(ct.state);

                textAlign = this.stringRender.flags.textAlign;
                if (isWrapped) {
                    if (ct.angle < 0) {
                        if (Asc.c_oAscVAlign.Top === ct.cellVA)
                            this.stringRender.flags.textAlign = AscCommon.align_Left;
                        else if (Asc.c_oAscVAlign.Center === ct.cellVA)
                            this.stringRender.flags.textAlign = AscCommon.align_Center;
                        else if (Asc.c_oAscVAlign.Bottom === ct.cellVA)
                            this.stringRender.flags.textAlign = AscCommon.align_Right;
                    }
                    else {
                        if (Asc.c_oAscVAlign.Top === ct.cellVA)
                            this.stringRender.flags.textAlign = AscCommon.align_Right;
                        else if (Asc.c_oAscVAlign.Center === ct.cellVA)
                            this.stringRender.flags.textAlign = AscCommon.align_Center;
                        else if (Asc.c_oAscVAlign.Bottom === ct.cellVA)
                            this.stringRender.flags.textAlign = AscCommon.align_Left;
                    }
                }

                this.stringRender.render(0, 0, textW, ct.color);

//                var color = new CColor(0, 0, 255, 0.5);
//
//                ctx.setStrokeStyle(color).
//                    moveTo(0, 0).
//                    lineTo(ct.metrics.width, 0).
//                    lineTo(ct.metrics.width, ct.metrics.height).
//                    lineTo(0, ct.metrics.height).
//                    closePath().
//                    stroke();

                this.stringRender.resetTransform( null );

                if ( clipUse ) {
                    ctx.restore();
                }

//                color = new CColor( 255, 0, 0, 0.5 );
//                ctx.save().
//                    setStrokeStyle(color).
//                    strokeRect(xb1 - ct.textBound.offsetX, yb1, ct.textBound.width,  ct.textBound.height).
//                    restore();
            }
            else {
                ctx.save().beginPath().rect( x1, y1, w, h ).clip();
                this.stringRender.restoreInternalState( ct.state ).render( textX, textY, textW, ct.color );
                ctx.restore();
            }
        }

        return null;
    };

    /** Удаляет вертикальные границы ячейки, если текст выходит за границы и соседние ячейки пусты */
    WorksheetView.prototype._eraseCellRightBorder = function ( drawingCtx, colBeg, colEnd, row, offsetX, offsetY ) {
        if ( colBeg >= colEnd ) {
            return;
        }
        var nextCell = -1;
        var ctx = (drawingCtx) ? drawingCtx : this.drawingCtx;
        ctx.setFillStyle( this.settings.cells.defaultState.background );
        for ( var col = colBeg; col < colEnd; ++col ) {
            var c = -1 !== nextCell ? nextCell : this._getCell( col, row );
            var bg = null !== c ? c.getFill() : null;
            if ( bg !== null ) {
                continue;
            }

            nextCell = this._getCell( col + 1, row );
            bg = null !== nextCell ? nextCell.getFill() : null;
            if ( bg !== null ) {
                continue;
            }

            ctx.fillRect( this.cols[col].left + this.cols[col].width - offsetX - this.width_1px, this.rows[row].top - offsetY, this.width_1px, this.rows[row].height - this.height_1px );
        }
    };

	/** Рисует рамки для ячеек */
	WorksheetView.prototype._drawCellsBorders = function (drawingCtx, range, offsetX, offsetY, mergedCells) {
		//TODO: использовать стили линий при рисовании границ
		var t = this;
		var ctx = (drawingCtx) ? drawingCtx : this.drawingCtx;
		var c = this.cols;
		var r = this.rows;

		var objectMergedCells = {}; // Двумерный map вида строка-колонка {1: {1: range, 4: range}}
		var i, mergeCellInfo, startCol, endRow, endCol, col, row;
		for (i in mergedCells) {
			mergeCellInfo = mergedCells[i];
			startCol = Math.max(range.c1, mergeCellInfo.c1);
			endRow = Math.min(mergeCellInfo.r2, range.r2, this.nRowsCount);
			endCol = Math.min(mergeCellInfo.c2, range.c2, this.nColsCount);
			for (row = Math.max(range.r1, mergeCellInfo.r1); row <= endRow; ++row) {
				if (!objectMergedCells.hasOwnProperty(row)) {
					objectMergedCells[row] = {};
				}
				for (col = startCol; col <= endCol; ++col) {
					objectMergedCells[row][col] = mergeCellInfo;
				}
			}
		}

		var bc = null, bs = c_oAscBorderStyles.None, isNotFirst = false; // cached border color

		function drawBorder(type, border, x1, y1, x2, y2) {
			var isStroke = false, isNewColor = !AscCommonExcel.g_oColorManager.isEqual(bc,
				border.c), isNewStyle = bs !== border.s;
			if (isNotFirst && (isNewColor || isNewStyle)) {
				ctx.stroke();
				isStroke = true;
			}

			if (isNewColor) {
				bc = border.c;
				ctx.setStrokeStyle(bc);
			}
			if (isNewStyle) {
				bs = border.s;
				ctx.setLineWidth(border.w);
				ctx.setLineDash(border.getDashSegments());
			}

			if (isStroke || false === isNotFirst) {
				isNotFirst = true;
				ctx.beginPath();
			}

			switch (type) {
				case c_oAscBorderType.Hor:
					ctx.lineHor(x1, y1, x2);
					break;
				case c_oAscBorderType.Ver:
					ctx.lineVer(x1, y1, y2);
					break;
				case c_oAscBorderType.Diag:
					ctx.lineDiag(x1, y1, x2, y2);
					break;
			}
		}

		function drawVerticalBorder(borderLeftObject, borderRightObject, x, y1, y2) {
			var border, borderLeft = borderLeftObject ? borderLeftObject.borders :
				null, borderRight = borderRightObject ? borderRightObject.borders : null;

			if (borderLeft && borderLeft.r.w) {
				border = borderLeft.r;
			} else if (borderRight && borderRight.l.w) {
				border = borderRight.l;
			}
			if (!border || border.w < 1) {
				return;
			}

			// ToDo переделать рассчет
			var tbw = t._calcMaxBorderWidth(borderLeftObject && borderLeftObject.getTopBorder(),
				borderRightObject && borderRightObject.getTopBorder()); // top border width
			var bbw = t._calcMaxBorderWidth(borderLeftObject && borderLeftObject.getBottomBorder(),
				borderRightObject && borderRightObject.getBottomBorder()); // bottom border width
			var dy1 = tbw > border.w ? tbw - 1 : (tbw > 1 ? -1 : 0);
			var dy2 = bbw > border.w ? -2 : (bbw > 2 ? 1 : 0);

			drawBorder(c_oAscBorderType.Ver, border, x, y1 + (-1 + dy1) * t.height_1px, x,
				y2 + (1 + dy2) * t.height_1px);
		}

		function drawHorizontalBorder(borderTopObject, borderBottomObject, x1, y, x2) {
			var border, borderTop = borderTopObject ? borderTopObject.borders :
				null, borderBottom = borderBottomObject ? borderBottomObject.borders : null;

			if (borderTop && borderTop.b.w) {
				border = borderTop.b;
			} else if (borderBottom && borderBottom.t.w) {
				border = borderBottom.t;
			}

			if (border && border.w > 0) {
				// ToDo переделать рассчет
				var lbw = t._calcMaxBorderWidth(borderTopObject && borderTopObject.getLeftBorder(),
					borderBottomObject && borderBottomObject.getLeftBorder());
				var rbw = t._calcMaxBorderWidth(borderTopObject && borderTopObject.getRightBorder(),
					borderTopObject && borderTopObject.getRightBorder());
				var dx1 = border.w > lbw ? (lbw > 1 ? -1 : 0) : (lbw > 2 ? 2 : 1);
				var dx2 = border.w > rbw ? (rbw > 2 ? 1 : 0) : (rbw > 1 ? -2 : -1);
				drawBorder(c_oAscBorderType.Hor, border, x1 + (-1 + dx1) * t.width_1px, y, x2 + (1 + dx2) * t.width_1px,
					y);
			}
		}

		var arrPrevRow = [], arrCurrRow = [], arrNextRow = [];
		var objMCPrevRow = null, objMCRow = null, objMCNextRow = null;
		var bCur, bPrev, bNext, bTopCur, bTopPrev, bTopNext, bBotCur, bBotPrev, bBotNext;
		bCur = bPrev = bNext = bTopCur = bTopNext = bBotCur = bBotNext = null;
		row = range.r1 - 1;
		var prevCol = range.c1 - 1;
		// Определим первую колонку (т.к. могут быть скрытые колонки)
		while (0 <= prevCol && c[prevCol].width < t.width_1px)
			--prevCol;

		// Сначала пройдемся по верхней строке (над отрисовываемым диапазоном)
		while (0 <= row) {
			if (r[row].height >= t.height_1px) {
				objMCPrevRow = objectMergedCells[row];
				for (col = prevCol; col <= range.c2 && col < t.nColsCount; ++col) {
					if (0 > col || c[col].width < t.width_1px) {
						continue;
					}
					arrPrevRow[col] =
						new CellBorderObject(t._getVisibleCell(col, row).getBorder(), objMCPrevRow ? objMCPrevRow[col] :
							null, col, row);
				}
				break;
			}
			--row;
		}

		var mc = null, nextRow, isFirstRow = true;
		var isPrevColExist = (0 <= prevCol);
		for (row = range.r1; row <= range.r2 && row < t.nRowsCount; row = nextRow) {
			nextRow = row + 1;
			if (r[row].height < t.height_1px) {
				continue;
			}
			// Нужно отсеять пустые снизу
			for (; nextRow <= range.r2 && nextRow < t.nRowsCount; ++nextRow) {
				if (r[nextRow].height >= t.height_1px) {
					break;
				}
			}

			var isFirstRowTmp = isFirstRow, isLastRow = nextRow > range.r2 || nextRow >= t.nRowsCount;
			isFirstRow = false; // Это уже не первая строка (определяем не по совпадению с range.r1, а по видимости)

			objMCRow = isFirstRowTmp ? objectMergedCells[row] : objMCNextRow;
			objMCNextRow = objectMergedCells[nextRow];

			var rowCache = t._fetchRowCache(row);
			var y1 = r[row].top - offsetY;
			var y2 = y1 + r[row].height - t.height_1px;

			var nextCol, isFirstCol = true;
			for (col = range.c1; col <= range.c2 && col < t.nColsCount; col = nextCol) {
				nextCol = col + 1;
				if (c[col].width < t.width_1px) {
					continue;
				}
				// Нужно отсеять пустые справа
				for (; nextCol <= range.c2 && nextCol < t.nColsCount; ++nextCol) {
					if (c[nextCol].width >= t.width_1px) {
						break;
					}
				}

				var isFirstColTmp = isFirstCol, isLastCol = nextCol > range.c2 || nextCol >= t.nColsCount;
				isFirstCol = false; // Это уже не первая колонка (определяем не по совпадению с range.c1, а по видимости)

				mc = objMCRow ? objMCRow[col] : null;

				var x1 = c[col].left - offsetX;
				var x2 = x1 + c[col].width - this.width_1px;

				if (row === t.nRowsCount) {
					bBotPrev = bBotCur = bBotNext = null;
				} else {
					if (isFirstColTmp) {
						bBotPrev = arrNextRow[prevCol] =
							new CellBorderObject(isPrevColExist ? t._getVisibleCell(prevCol, nextRow).getBorder() :
								null, objMCNextRow ? objMCNextRow[prevCol] : null, prevCol, nextRow);
						bBotCur = arrNextRow[col] =
							new CellBorderObject(t._getVisibleCell(col, nextRow).getBorder(), objMCNextRow ?
								objMCNextRow[col] : null, col, nextRow);
					} else {
						bBotPrev = bBotCur;
						bBotCur = bBotNext;
					}
				}

				if (isFirstColTmp) {
					bPrev = arrCurrRow[prevCol] =
						new CellBorderObject(isPrevColExist ? t._getVisibleCell(prevCol, row).getBorder() :
							null, objMCRow ? objMCRow[prevCol] : null, prevCol, row);
					bCur =
						arrCurrRow[col] = new CellBorderObject(t._getVisibleCell(col, row).getBorder(), mc, col, row);
					bTopPrev = arrPrevRow[prevCol];
					bTopCur = arrPrevRow[col];
				} else {
					bPrev = bCur;
					bCur = bNext;
					bTopPrev = bTopCur;
					bTopCur = bTopNext;
				}

				if (col === t.nColsCount) {
					bNext = null;
					bTopNext = null;
				} else {
					bNext = arrCurrRow[nextCol] =
						new CellBorderObject(t._getVisibleCell(nextCol, row).getBorder(), objMCRow ? objMCRow[nextCol] :
							null, nextCol, row);
					bTopNext = arrPrevRow[nextCol];

					if (row === t.nRowsCount) {
						bBotNext = null;
					} else {
						bBotNext = arrNextRow[nextCol] =
							new CellBorderObject(t._getVisibleCell(nextCol, nextRow).getBorder(), objMCNextRow ?
								objMCNextRow[nextCol] : null, nextCol, nextRow);
					}
				}

				if (mc && row !== mc.r1 && row !== mc.r2 && col !== mc.c1 && col !== mc.c2) {
					continue;
				}

				// draw diagonal borders
				if ((bCur.borders.dd || bCur.borders.du) && (!mc || (row === mc.r1 && col === mc.c1))) {
					var x2Diagonal = x2;
					var y2Diagonal = y2;
					if (mc) {
						// Merge cells
						x2Diagonal = c[mc.c2].left + c[mc.c2].width - offsetX - t.width_1px;
						y2Diagonal = r[mc.r2].top + r[mc.r2].height - offsetY - t.height_1px;
					}
					// ToDo Clip diagonal borders
                    /*ctx.save()
                     .beginPath()
                     .rect(x1 + this.width_1px * (lb.w < 1 ? -1 : (lb.w < 3 ? 0 : +1)),
                     y1 + this.width_1px * (tb.w < 1 ? -1 : (tb.w < 3 ? 0 : +1)),
                     c[col].width + this.width_1px * ( -1 + (lb.w < 1 ? +1 : (lb.w < 3 ? 0 : -1)) + (rb.w < 1 ? +1 : (rb.w < 2 ? 0 : -1)) ),
                     r[row].height + this.height_1px * ( -1 + (tb.w < 1 ? +1 : (tb.w < 3 ? 0 : -1)) + (bb.w < 1 ? +1 : (bb.w < 2 ? 0 : -1)) ))
                     .clip();
                     */
					if (bCur.borders.dd) {
						// draw diagonal line l,t - r,b
						drawBorder(c_oAscBorderType.Diag, bCur.borders.d, x1 - t.width_1px, y1 - t.height_1px,
							x2Diagonal, y2Diagonal);
					}
					if (bCur.borders.du) {
						// draw diagonal line l,b - r,t
						drawBorder(c_oAscBorderType.Diag, bCur.borders.d, x1 - t.width_1px, y2Diagonal, x2Diagonal,
							y1 - t.height_1px);
					}
					// ToDo Clip diagonal borders
					//ctx.restore();
					// canvas context has just been restored, so destroy border color cache
					//bc = undefined;
				}

				// draw left border
				if (isFirstColTmp && !t._isLeftBorderErased(col, rowCache)) {
					drawVerticalBorder(bPrev, bCur, x1 - t.width_1px, y1, y2);
					// Если мы в печати и печатаем первый столбец, то нужно напечатать бордеры
//						if (lb.w >= 1 && drawingCtx && 0 === col) {
					// Иначе они будут не такой ширины
					// ToDo посмотреть что с этим ? в печати будет обрезка
//							drawVerticalBorder(lb, tb, tbPrev, bb, bbPrev, x1, y1, y2);
//						}
				}
				// draw right border
				if ((!mc || col === mc.c2) && !t._isRightBorderErased(col, rowCache)) {
					drawVerticalBorder(bCur, bNext, x2, y1, y2);
				}
				// draw top border
				if (isFirstRowTmp) {
					drawHorizontalBorder(bTopCur, bCur, x1, y1 - t.height_1px, x2);
					// Если мы в печати и печатаем первую строку, то нужно напечатать бордеры
//						if (tb.w > 0 && drawingCtx && 0 === row) {
					// ToDo посмотреть что с этим ? в печати будет обрезка
//							drawHorizontalBorder.call(this, tb, lb, lbPrev, rb, rbPrev, x1, y1, x2);
//						}
				}
				if (!mc || row === mc.r2) {
					// draw bottom border
					drawHorizontalBorder(bCur, bBotCur, x1, y2, x2);
				}
			}

			arrPrevRow = arrCurrRow;
			arrCurrRow = arrNextRow;
			arrNextRow = [];
		}

		if (isNotFirst) {
			ctx.stroke();
		}
	};

    /** Рисует закрепленные области областей */
    WorksheetView.prototype._drawFrozenPane = function ( noCells ) {
        if ( this.topLeftFrozenCell ) {
            var row = this.topLeftFrozenCell.getRow0();
            var col = this.topLeftFrozenCell.getCol0();

            var tmpRange, offsetX, offsetY;
            if ( 0 < row && 0 < col ) {
                offsetX = this.cols[0].left - this.cellsLeft;
                offsetY = this.rows[0].top - this.cellsTop;
                tmpRange = new asc_Range( 0, 0, col - 1, row - 1 );
                if ( !noCells ) {
                    this._drawGrid( /*drawingCtx*/ undefined, tmpRange, offsetX, offsetY );
                    this._drawCellsAndBorders( /*drawingCtx*/undefined, tmpRange, offsetX, offsetY );
                }
            }
            if ( 0 < row ) {
                row -= 1;
                offsetX = undefined;
                offsetY = this.rows[0].top - this.cellsTop;
                tmpRange = new asc_Range( this.visibleRange.c1, 0, this.visibleRange.c2, row );
                this._drawRowHeaders( /*drawingCtx*/ undefined, 0, row, kHeaderDefault, offsetX, offsetY );
                if ( !noCells ) {
                    this._drawGrid( /*drawingCtx*/ undefined, tmpRange, offsetX, offsetY );
                    this._drawCellsAndBorders( /*drawingCtx*/undefined, tmpRange, offsetX, offsetY );
                }
            }
            if ( 0 < col ) {
                col -= 1;
                offsetX = this.cols[0].left - this.cellsLeft;
                offsetY = undefined;
                tmpRange = new asc_Range( 0, this.visibleRange.r1, col, this.visibleRange.r2 );
                this._drawColumnHeaders( /*drawingCtx*/ undefined, 0, col, kHeaderDefault, offsetX, offsetY );
                if ( !noCells ) {
                    this._drawGrid( /*drawingCtx*/ undefined, tmpRange, offsetX, offsetY );
                    this._drawCellsAndBorders( /*drawingCtx*/undefined, tmpRange, offsetX, offsetY );
                }
            }
        }
    };

    /** Рисует закрепление областей */
    WorksheetView.prototype._drawFrozenPaneLines = function ( drawingCtx ) {
        // Возможно стоит отрисовывать на overlay, а не на основной канве
        var ctx = drawingCtx ? drawingCtx : this.drawingCtx;
        var lockInfo = this.collaborativeEditing.getLockInfo( c_oAscLockTypeElem.Object, null, this.model.getId(), AscCommonExcel.c_oAscLockNameFrozenPane );
        var isLocked = this.collaborativeEditing.getLockIntersection( lockInfo, c_oAscLockTypes.kLockTypeOther, false );
        var color = isLocked ? AscCommonExcel.c_oAscCoAuthoringOtherBorderColor : this.settings.frozenColor;
        ctx.setLineWidth( 1 ).setStrokeStyle( color ).beginPath();
        var fHorLine, fVerLine;
        if ( isLocked ) {
            fHorLine = ctx.dashLineCleverHor;
            fVerLine = ctx.dashLineCleverVer;
        }
        else {
            fHorLine = ctx.lineHorPrevPx;
            fVerLine = ctx.lineVerPrevPx;
        }

        if ( this.topLeftFrozenCell ) {
            var row = this.topLeftFrozenCell.getRow0();
            var col = this.topLeftFrozenCell.getCol0();
            if ( 0 < row ) {
                fHorLine.apply( ctx, [0, this.rows[row].top, ctx.getWidth()] );
            }
            else {
                fHorLine.apply( ctx, [0, this.headersHeight, this.headersWidth] );
            }

            if ( 0 < col ) {
                fVerLine.apply( ctx, [this.cols[col].left, 0, ctx.getHeight()] );
            }
            else {
                fVerLine.apply( ctx, [this.headersWidth, 0, this.headersHeight] );
            }
        }
        else if ( this.model.sheetViews[0].asc_getShowRowColHeaders() ) {
            fHorLine.apply( ctx, [0, this.headersHeight, this.headersWidth] );
            fVerLine.apply( ctx, [this.headersWidth, 0, this.headersHeight] );
        }

        ctx.stroke();
    };

    WorksheetView.prototype.drawFrozenGuides = function ( x, y, target ) {
        var data, offsetFrozen;
        var ctx = this.overlayCtx;

        ctx.clear();
        this._drawSelection();

        switch ( target ) {
            case c_oTargetType.FrozenAnchorV:
                x *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIX() );
                data = this._findColUnderCursor( x, true, true );
                if ( data ) {
                    data.col += 1;
                    if ( 0 <= data.col && data.col < this.cols.length ) {
                        var h = ctx.getHeight();
                        var offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft;
                        offsetFrozen = this.getFrozenPaneOffset( false, true );
                        offsetX -= offsetFrozen.offsetX;
                        ctx.setFillPattern( this.settings.ptrnLineDotted1 )
                            .fillRect( this.cols[data.col].left - offsetX - this.width_1px, 0, this.width_1px, h );
                    }
                }
                break;
            case c_oTargetType.FrozenAnchorH:
                y *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIY() );
                data = this._findRowUnderCursor( y, true, true );
                if ( data ) {
                    data.row += 1;
                    if ( 0 <= data.row && data.row < this.rows.length ) {
                        var w = ctx.getWidth();
                        var offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
                        offsetFrozen = this.getFrozenPaneOffset( true, false );
                        offsetY -= offsetFrozen.offsetY;
                        ctx.setFillPattern( this.settings.ptrnLineDotted1 )
                            .fillRect( 0, this.rows[data.row].top - offsetY - this.height_1px, w, this.height_1px );
                    }
                }
                break;
        }
    };

    WorksheetView.prototype._isFrozenAnchor = function ( x, y ) {

        var result = {result: false, cursor: "move", name: ""};
        if ( false === this.model.sheetViews[0].asc_getShowRowColHeaders() ) {
            return result;
        }

        var _this = this;
        var frozenCell = this.topLeftFrozenCell ? this.topLeftFrozenCell : new AscCommon.CellAddress( 0, 0, 0 );

        x *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIX() );
        y *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIY() );

        function isPointInAnchor( x, y, rectX, rectY, rectW, rectH ) {
            var delta = 2 * asc_getcvt( 0/*px*/, 1/*pt*/, _this._getPPIX() );
            return (x >= rectX - delta) && (x <= rectX + rectW + delta) && (y >= rectY - delta) && (y <= rectY + rectH + delta);
        }

        // vertical
        var _x = this.getCellLeft( frozenCell.getCol0(), 1 ) - 0.5;
        var _y = _this.headersTop;
        var w = 0;
        var h = _this.headersHeight;
        if ( isPointInAnchor( x, y, _x, _y, w, h ) ) {
            result.result = true;
            result.name = c_oTargetType.FrozenAnchorV;
        }

        // horizontal
        _x = _this.headersLeft;
        _y = this.getCellTop( frozenCell.getRow0(), 1 ) - 0.5;
        w = _this.headersWidth - 0.5;
        h = 0;
        if ( isPointInAnchor( x, y, _x, _y, w, h ) ) {
            result.result = true;
            result.name = c_oTargetType.FrozenAnchorH;
        }

        return result;
    };

    WorksheetView.prototype.applyFrozenAnchor = function ( x, y, target ) {
        var t = this;
        var onChangeFrozenCallback = function ( isSuccess ) {
            if ( false === isSuccess ) {
                t.overlayCtx.clear();
                t._drawSelection();
                return;
            }
            var lastCol = 0, lastRow = 0, data;
            if ( t.topLeftFrozenCell ) {
                lastCol = t.topLeftFrozenCell.getCol0();
                lastRow = t.topLeftFrozenCell.getRow0();
            }
            switch ( target ) {
                case c_oTargetType.FrozenAnchorV:
                    x *= asc_getcvt( 0/*px*/, 1/*pt*/, t._getPPIX() );
                    data = t._findColUnderCursor( x, true, true );
                    if ( data ) {
                        data.col += 1;
                        if ( 0 <= data.col && data.col < t.cols.length ) {
                            lastCol = data.col;
                        }
                    }
                    break;
                case c_oTargetType.FrozenAnchorH:
                    y *= asc_getcvt( 0/*px*/, 1/*pt*/, t._getPPIY() );
                    data = t._findRowUnderCursor( y, true, true );
                    if ( data ) {
                        data.row += 1;
                        if ( 0 <= data.row && data.row < t.rows.length ) {
                            lastRow = data.row;
                        }
                    }
                    break;
            }
            t._updateFreezePane( lastCol, lastRow );
        };

        this._isLockedFrozenPane( onChangeFrozenCallback );
    };

    /** Для api закрепленных областей */
    WorksheetView.prototype.freezePane = function () {
        var t = this;
        var activeCell = this.model.selectionRange.activeCell.clone();
        var onChangeFreezePane = function (isSuccess) {
            if (false === isSuccess) {
                return;
            }
            var col, row, mc;
            if (null !== t.topLeftFrozenCell) {
                col = row = 0;
            } else {
                col = activeCell.col;
                row = activeCell.row;

                if (0 !== row || 0 !== col) {
                    mc = t.model.getMergedByCell(row, col);
                    if (mc) {
                        col = mc.c1;
                        row = mc.r1;
                    }
                }

                if (0 === col && 0 === row) {
                    col = ((t.visibleRange.c2 - t.visibleRange.c1) / 2) >> 0;
                    row = ((t.visibleRange.r2 - t.visibleRange.r1) / 2) >> 0;
                }
            }
            t._updateFreezePane(col, row);
        };

        return this._isLockedFrozenPane(onChangeFreezePane);
    };

    WorksheetView.prototype._updateFreezePane = function (col, row, lockDraw) {
        var lastCol = 0, lastRow = 0;
        if (this.topLeftFrozenCell) {
            lastCol = this.topLeftFrozenCell.getCol0();
            lastRow = this.topLeftFrozenCell.getRow0();
        }
        History.Create_NewPoint();
        var oData = new AscCommonExcel.UndoRedoData_FromTo(new AscCommonExcel.UndoRedoData_BBox(new asc_Range(lastCol, lastRow, lastCol, lastRow)), new AscCommonExcel.UndoRedoData_BBox(new asc_Range(col, row, col, row)), null);
        History.Add(AscCommonExcel.g_oUndoRedoWorksheet, AscCH.historyitem_Worksheet_ChangeFrozenCell,
          this.model.getId(), null, oData);

        var isUpdate = false;
        if (0 === col && 0 === row) { // Очистка
            if (null !== this.topLeftFrozenCell) {
                isUpdate = true;
            }
            this.topLeftFrozenCell = this.model.sheetViews[0].pane = null;
        } else { // Создание
            if (null === this.topLeftFrozenCell) {
                isUpdate = true;
            }
            var pane = this.model.sheetViews[0].pane = new AscCommonExcel.asc_CPane();
            this.topLeftFrozenCell = pane.topLeftFrozenCell = new AscCommon.CellAddress(row, col, 0);
        }
        this.visibleRange.c1 = col;
        this.visibleRange.r1 = row;
        if (col >= this.nColsCount) {
            this.expandColsOnScroll(false, true);
        }
        if (row >= this.nRowsCount) {
            this.expandRowsOnScroll(false, true);
        }

        this.visibleRange.r2 = 0;
        this._calcVisibleRows();
        this.visibleRange.c2 = 0;
        this._calcVisibleColumns();
        this.handlers.trigger("reinitializeScroll");

        if (this.objectRender && this.objectRender.drawingArea) {
            this.objectRender.drawingArea.init();
        }
        if (!lockDraw) {
            this.draw();
        }

        // Эвент на обновление
        if (isUpdate && !this.model.workbook.bUndoChanges && !this.model.workbook.bRedoChanges) {
            this.handlers.trigger("updateSheetViewSettings");
        }
    };

    /** */

    WorksheetView.prototype._drawSelectionElement = function (visibleRange, offsetX, offsetY, args) {
        var range = args[0];
        var selectionLineType = args[1];
        var strokeColor = args[2];
        var isAllRange = args[3];
        var colorN = this.settings.activeCellBorderColor2;
        var ctx = this.overlayCtx;
        var c = this.cols;
        var r = this.rows;
        var oIntersection = range.intersectionSimple(visibleRange);
        var ppiX = this._getPPIX(), ppiY = this._getPPIY();

        if (!oIntersection) {
            return true;
        }

        var width_1px = asc_calcnpt(0, ppiX, 1/*px*/), width_2px = asc_calcnpt(0, ppiX, 2
          /*px*/), width_3px = asc_calcnpt(0, ppiX, 3/*px*/), width_4px = asc_calcnpt(0, ppiX, 4
          /*px*/), width_5px = asc_calcnpt(0, ppiX, 5/*px*/), width_7px = asc_calcnpt(0, ppiX, 7/*px*/),

          height_1px = asc_calcnpt(0, ppiY, 1/*px*/), height_2px = asc_calcnpt(0, ppiY, 2
          /*px*/), height_3px = asc_calcnpt(0, ppiY, 3/*px*/), height_4px = asc_calcnpt(0, ppiY, 4
          /*px*/), height_5px = asc_calcnpt(0, ppiY, 5/*px*/), height_7px = asc_calcnpt(0, ppiY, 7/*px*/);


        var fHorLine, fVerLine;
        var canFill = AscCommonExcel.selectionLineType.Selection & selectionLineType;
        var isDashLine = AscCommonExcel.selectionLineType.Dash & selectionLineType;
        if (isDashLine) {
            fHorLine = ctx.dashLineCleverHor;
            fVerLine = ctx.dashLineCleverVer;
        } else {
            fHorLine = ctx.lineHorPrevPx;
            fVerLine = ctx.lineVerPrevPx;
        }

        var firstCol = oIntersection.c1 === visibleRange.c1 && !isAllRange;
        var firstRow = oIntersection.r1 === visibleRange.r1 && !isAllRange;

        var drawLeftSide = oIntersection.c1 === range.c1;
        var drawRightSide = oIntersection.c2 === range.c2;
        var drawTopSide = oIntersection.r1 === range.r1;
        var drawBottomSide = oIntersection.r2 === range.r2;

        var x1 = c[oIntersection.c1].left - offsetX;
        var x2 = c[oIntersection.c2].left + c[oIntersection.c2].width - offsetX;
        var y1 = r[oIntersection.r1].top - offsetY;
        var y2 = r[oIntersection.r2].top + r[oIntersection.r2].height - offsetY;

        if (canFill) {
            var fillColor = strokeColor.Copy();
            fillColor.a = 0.15;
            ctx.setFillStyle(fillColor).fillRect(x1, y1, x2 - x1, y2 - y1);
        }

        ctx.setLineWidth(isDashLine ? 1 : 2).setStrokeStyle(strokeColor);

        ctx.beginPath();
        if (drawTopSide && !firstRow) {
            fHorLine.apply(ctx, [x1 - !isDashLine * width_2px, y1, x2 + !isDashLine * width_1px]);
        }
        if (drawBottomSide) {
            fHorLine.apply(ctx, [x1, y2 + !isDashLine * height_1px, x2]);
        }
        if (drawLeftSide && !firstCol) {
            fVerLine.apply(ctx, [x1, y1, y2 + !isDashLine * height_1px]);
        }
        if (drawRightSide) {
            fVerLine.apply(ctx, [x2 + !isDashLine * width_1px, y1, y2 + !isDashLine * height_1px]);
        }
        ctx.closePath().stroke();

		// draw active cell in selection
		var isActive = AscCommonExcel.selectionLineType.ActiveCell & selectionLineType;
		if (isActive) {
			var cell = (this.isSelectionDialogMode ? this.copyActiveRange : this.model.selectionRange).activeCell;
			var fs = this.model.getMergedByCell(cell.row, cell.col);
			fs = range.intersectionSimple(
				fs ? fs : new asc_Range(cell.col, cell.row, cell.col, cell.row));
			if (fs) {
				var _x1 = c[fs.c1].left - offsetX + width_1px;
				var _y1 = r[fs.r1].top - offsetY + height_1px;
				var _w = c[fs.c2].left - c[fs.c1].left + c[fs.c2].width - width_2px;
				var _h = r[fs.r2].top - r[fs.r1].top + r[fs.r2].height - height_2px;
				if (0 < _w && 0 < _h) {
					ctx.clearRect(_x1, _y1, _w, _h);
				}
			}
		}

        if (canFill) {/*Отрисовка светлой полосы при выборе ячеек для формулы*/
            ctx.setLineWidth(1);
            ctx.setStrokeStyle(colorN);
            ctx.beginPath();
            if (drawTopSide) {
                fHorLine.apply(ctx, [x1, y1 + height_1px, x2 - width_1px]);
            }
            if (drawBottomSide) {
                fHorLine.apply(ctx, [x1, y2 - height_1px, x2 - width_1px]);
            }
            if (drawLeftSide) {
                fVerLine.apply(ctx, [x1 + width_1px, y1, y2 - height_2px]);
            }
            if (drawRightSide) {
                fVerLine.apply(ctx, [x2 - width_1px, y1, y2 - height_2px]);
            }
            ctx.closePath().stroke();
        }

        // Отрисовка квадратов для move/resize
        var isResize = AscCommonExcel.selectionLineType.Resize & selectionLineType;
        var isPromote = AscCommonExcel.selectionLineType.Promote & selectionLineType;
        if (isResize || isPromote) {
            ctx.setFillStyle(colorN);
            if (drawRightSide && drawBottomSide) {
                ctx.fillRect(x2 - width_4px, y2 - height_4px, width_7px, height_7px);
            }
            ctx.setFillStyle(strokeColor);
            if (drawRightSide && drawBottomSide) {
                ctx.fillRect(x2 - width_3px, y2 - height_3px, width_5px, height_5px);
            }

            if (isResize) {
                ctx.setFillStyle(colorN);
                if (drawLeftSide && drawTopSide) {
                    ctx.fillRect(x1 - width_4px, y1 - height_4px, width_7px, height_7px);
                }
                if (drawRightSide && drawTopSide) {
                    ctx.fillRect(x2 - width_4px, y1 - height_4px, width_7px, height_7px);
                }
                if (drawLeftSide && drawBottomSide) {
                    ctx.fillRect(x1 - width_4px, y2 - height_4px, width_7px, height_7px);
                }
                ctx.setFillStyle(strokeColor);
                if (drawLeftSide && drawTopSide) {
                    ctx.fillRect(x1 - width_3px, y1 - height_3px, width_5px, height_5px);
                }
                if (drawRightSide && drawTopSide) {
                    ctx.fillRect(x2 - width_3px, y1 - height_3px, width_5px, height_5px);
                }
                if (drawLeftSide && drawBottomSide) {
                    ctx.fillRect(x1 - width_3px, y2 - height_3px, width_5px, height_5px);
                }
            }
        }
        return true;
    };
    /**Отрисовывает диапазон с заданными параметрами*/
    WorksheetView.prototype._drawElements = function (drawFunction) {
        var cFrozen = 0, rFrozen = 0, args = Array.prototype.slice.call(arguments,
          1), c = this.cols, r = this.rows, offsetX = c[this.visibleRange.c1].left -
          this.cellsLeft, offsetY = r[this.visibleRange.r1].top - this.cellsTop, res;
        if (this.topLeftFrozenCell) {
            cFrozen = this.topLeftFrozenCell.getCol0();
            rFrozen = this.topLeftFrozenCell.getRow0();
            offsetX -= this.cols[cFrozen].left - this.cols[0].left;
            offsetY -= this.rows[rFrozen].top - this.rows[0].top;

            var oFrozenRange;
            cFrozen -= 1;
            rFrozen -= 1;
            if (0 <= cFrozen && 0 <= rFrozen) {
                oFrozenRange = new asc_Range(0, 0, cFrozen, rFrozen);
                res = drawFunction.call(this, oFrozenRange, c[0].left - this.cellsLeft, r[0].top - this.cellsTop, args);
                if (!res) {
                    return;
                }
            }
            if (0 <= cFrozen) {
                oFrozenRange = new asc_Range(0, this.visibleRange.r1, cFrozen, this.visibleRange.r2);
                res = drawFunction.call(this, oFrozenRange, c[0].left - this.cellsLeft, offsetY, args);
                if (!res) {
                    return;
                }
            }
            if (0 <= rFrozen) {
                oFrozenRange = new asc_Range(this.visibleRange.c1, 0, this.visibleRange.c2, rFrozen);
                res = drawFunction.call(this, oFrozenRange, offsetX, r[0].top - this.cellsTop, args);
                if (!res) {
                    return;
                }
            }
        }

        // Можно вместо call попользовать apply, но тогда нужно каждый раз соединять массив аргументов и 3 объекта
        drawFunction.call(this, this.visibleRange, offsetX, offsetY, args);
    };

    /**
     * Рисует выделение вокруг ячеек
     */
    WorksheetView.prototype._drawSelection = function () {
        var isShapeSelect = false;
        if (window['IS_NATIVE_EDITOR']) {
            return;
        }

        // set clipping rect to cells area
        var ctx = this.overlayCtx;
        ctx.save().beginPath()
          .rect(this.cellsLeft, this.cellsTop, ctx.getWidth() - this.cellsLeft, ctx.getHeight() - this.cellsTop)
          .clip();

        if (!this.isSelectionDialogMode) {
            this._drawCollaborativeElements();
        }
        var isOtherSelectionMode = this.isSelectionDialogMode || this.isFormulaEditMode;
        if (isOtherSelectionMode && !this.handlers.trigger('isActive')) {
            if (this.isSelectionDialogMode) {
                this._drawSelectRange();
            } else if (this.isFormulaEditMode) {
                this._drawFormulaRanges(this.arrActiveFormulaRanges);
            }
        } else {
            isShapeSelect = (asc["editor"].isStartAddShape || this.objectRender.selectedGraphicObjectsExists());
            if (isShapeSelect) {
                if (this.isChartAreaEditMode) {
                    this._drawFormulaRanges(this.arrActiveChartRanges);
                }
            } else {
				this._drawFormulaRanges(this.arrActiveFormulaRanges);
				if (this.isChartAreaEditMode) {
					this._drawFormulaRanges(this.arrActiveChartRanges);
				}
                this._drawSelectionRange();

                if (this.activeFillHandle) {
                    this._drawElements(this._drawSelectionElement, this.activeFillHandle.clone(true),
                      AscCommonExcel.selectionLineType.None, this.settings.activeCellBorderColor);
                }
                if (this.isSelectionDialogMode) {
                    this._drawSelectRange();
                }
                if (this.stateFormatPainter && this.handlers.trigger('isActive')) {
                    this._drawFormatPainterRange();
                }
                if (null !== this.activeMoveRange) {
                    this._drawElements(this._drawSelectionElement, this.activeMoveRange,
                      AscCommonExcel.selectionLineType.None, new CColor(0, 0, 0));
                }
            }
        }

        // restore canvas' original clipping range
        ctx.restore();

        if (!isOtherSelectionMode && !isShapeSelect) {
            this._drawActiveHeaders();
        }
    };

    WorksheetView.prototype._drawSelectionRange = function () {
        var ranges = (this.isSelectionDialogMode ? this.copyActiveRange : this.model.selectionRange).ranges;
        var range, selectionLineType;
        for (var i = 0, l = ranges.length; i < l; ++i) {
            range = ranges[i];
            if (c_oAscSelectionType.RangeMax === range.type) {
                range.c2 = this.cols.length - 1;
                range.r2 = this.rows.length - 1;
            } else if (c_oAscSelectionType.RangeCol === range.type) {
                range.r2 = this.rows.length - 1;
            } else if (c_oAscSelectionType.RangeRow === range.type) {
                range.c2 = this.cols.length - 1;
            }

            selectionLineType = AscCommonExcel.selectionLineType.Selection;
            if (1 === l) {
                selectionLineType |=
                  AscCommonExcel.selectionLineType.ActiveCell | AscCommonExcel.selectionLineType.Promote;
            } else if (i === this.model.selectionRange.activeCellId) {
                selectionLineType |= AscCommonExcel.selectionLineType.ActiveCell;
            }
            this._drawElements(this._drawSelectionElement, range, selectionLineType,
              this.settings.activeCellBorderColor);
        }
		this.handlers.trigger("drawMobileSelection", this.settings.activeCellBorderColor);
    };

    WorksheetView.prototype._drawFormatPainterRange = function () {
        var t = this, color = new CColor(0, 0, 0);
        this.copyActiveRange.ranges.forEach(function (item) {
            t._drawElements(t._drawSelectionElement, item, AscCommonExcel.selectionLineType.Dash, color);
        });
    };

    WorksheetView.prototype._drawFormulaRanges = function (arrRanges) {
        var i, ranges, length = AscCommonExcel.c_oAscFormulaRangeBorderColor.length;
        var strokeColor, colorIndex, uniqueColorIndex = 0, tmpColors = [];
        for (i = 0; i < arrRanges.length; ++i) {
            ranges = arrRanges[i].ranges;
            for (var j = 0, l = ranges.length; j < l; ++j) {
                colorIndex = asc.getUniqueRangeColor(ranges, j, tmpColors);
                if (null == colorIndex) {
                    colorIndex = uniqueColorIndex++;
                }
                tmpColors.push(colorIndex);
                if (ranges[j].noColor) {
					colorIndex = 0;
				}
                strokeColor = AscCommonExcel.c_oAscFormulaRangeBorderColor[colorIndex % length];

                this._drawElements(this._drawSelectionElement, ranges[j],
                  AscCommonExcel.selectionLineType.Selection | (ranges[j].isName ? AscCommonExcel.selectionLineType.None :
                    AscCommonExcel.selectionLineType.Resize), strokeColor);
            }
        }
    };

    WorksheetView.prototype._drawSelectRange = function () {
        var ranges = this.model.selectionRange.ranges;
        for (var i = 0, l = ranges.length; i < l; ++i) {
            this._drawElements(this._drawSelectionElement, ranges[i], AscCommonExcel.selectionLineType.Dash,
              AscCommonExcel.c_oAscCoAuthoringOtherBorderColor);
        }
    };

    WorksheetView.prototype._drawCollaborativeElements = function () {
        if ( this.collaborativeEditing.getCollaborativeEditing() ) {
            this._drawCollaborativeElementsMeOther(c_oAscLockTypes.kLockTypeMine);
            this._drawCollaborativeElementsMeOther(c_oAscLockTypes.kLockTypeOther);
            this._drawCollaborativeElementsAllLock();
        }
    };

    WorksheetView.prototype._drawCollaborativeElementsAllLock = function () {
        var currentSheetId = this.model.getId();
        var nLockAllType = this.collaborativeEditing.isLockAllOther(currentSheetId);
        if (Asc.c_oAscMouseMoveLockedObjectType.None !== nLockAllType) {
            var isAllRange = true, strokeColor = (Asc.c_oAscMouseMoveLockedObjectType.TableProperties ===
            nLockAllType) ? AscCommonExcel.c_oAscCoAuthoringLockTablePropertiesBorderColor :
              AscCommonExcel.c_oAscCoAuthoringOtherBorderColor, oAllRange = new asc_Range(0, 0, gc_nMaxCol0, gc_nMaxRow0);
            this._drawElements(this._drawSelectionElement, oAllRange, AscCommonExcel.selectionLineType.Dash,
              strokeColor, isAllRange);
        }
    };

    WorksheetView.prototype._drawCollaborativeElementsMeOther = function (type) {
        var currentSheetId = this.model.getId(), i, strokeColor, arrayCells, oCellTmp;
        if (c_oAscLockTypes.kLockTypeMine === type) {
            strokeColor = AscCommonExcel.c_oAscCoAuthoringMeBorderColor;
            arrayCells = this.collaborativeEditing.getLockCellsMe(currentSheetId);

            arrayCells = arrayCells.concat(this.collaborativeEditing.getArrayInsertColumnsBySheetId(currentSheetId));
            arrayCells = arrayCells.concat(this.collaborativeEditing.getArrayInsertRowsBySheetId(currentSheetId));
        } else {
            strokeColor = AscCommonExcel.c_oAscCoAuthoringOtherBorderColor;
            arrayCells = this.collaborativeEditing.getLockCellsOther(currentSheetId);
        }

        for (i = 0; i < arrayCells.length; ++i) {
            oCellTmp = new asc_Range(arrayCells[i].c1, arrayCells[i].r1, arrayCells[i].c2, arrayCells[i].r2);
            this._drawElements(this._drawSelectionElement, oCellTmp, AscCommonExcel.selectionLineType.Dash,
              strokeColor);
        }
    };

    WorksheetView.prototype.cleanSelection = function (range, isFrozen) {
        if (window['IS_NATIVE_EDITOR']) {
            return;
        }

        isFrozen = !!isFrozen;
        if (range === undefined) {
            range = this.visibleRange;
        }
        var ctx = this.overlayCtx;
        var width = ctx.getWidth();
        var height = ctx.getHeight();
        var offsetX, offsetY, diffWidth = 0, diffHeight = 0;
        var x1 = Number.MAX_VALUE;
        var x2 = -Number.MAX_VALUE;
        var y1 = Number.MAX_VALUE;
        var y2 = -Number.MAX_VALUE;
        var _x1, _x2, _y1, _y2;
        var i;

        if (this.topLeftFrozenCell) {
            var cFrozen = this.topLeftFrozenCell.getCol0();
            var rFrozen = this.topLeftFrozenCell.getRow0();
            diffWidth = this.cols[cFrozen].left - this.cols[0].left;
            diffHeight = this.rows[rFrozen].top - this.rows[0].top;

            if (!isFrozen) {
                var oFrozenRange;
                cFrozen -= 1;
                rFrozen -= 1;
                if (0 <= cFrozen && 0 <= rFrozen) {
                    oFrozenRange = new asc_Range(0, 0, cFrozen, rFrozen);
                    this.cleanSelection(oFrozenRange, true);
                }
                if (0 <= cFrozen) {
                    oFrozenRange = new asc_Range(0, this.visibleRange.r1, cFrozen, this.visibleRange.r2);
                    this.cleanSelection(oFrozenRange, true);
                }
                if (0 <= rFrozen) {
                    oFrozenRange = new asc_Range(this.visibleRange.c1, 0, this.visibleRange.c2, rFrozen);
                    this.cleanSelection(oFrozenRange, true);
                }
            }
        }
        if (isFrozen) {
            if (range.c1 !== this.visibleRange.c1) {
                diffWidth = 0;
            }
            if (range.r1 !== this.visibleRange.r1) {
                diffHeight = 0;
            }
            offsetX = this.cols[range.c1].left - this.cellsLeft - diffWidth;
            offsetY = this.rows[range.r1].top - this.cellsTop - diffHeight;
        } else {
            offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft - diffWidth;
            offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop - diffHeight;
        }

        this._activateOverlayCtx();
        var t = this;
        this.model.selectionRange.ranges.forEach(function (item) {
            var arnIntersection = item.intersectionSimple(range);
            if (arnIntersection) {
                _x1 = t.cols[arnIntersection.c1].left - offsetX - t.width_2px;
                _x2 = t.cols[arnIntersection.c2].left + t.cols[arnIntersection.c2].width - offsetX +
                  t.width_1px + /* Это ширина "квадрата" для автофильтра от границы ячейки */t.width_2px;
                _y1 = t.rows[arnIntersection.r1].top - offsetY - t.height_2px;
                _y2 = t.rows[arnIntersection.r2].top + t.rows[arnIntersection.r2].height - offsetY +
                  t.height_1px + /* Это высота "квадрата" для автофильтра от границы ячейки */t.height_2px;

                x1 = Math.min(x1, _x1);
                x2 = Math.max(x2, _x2);
                y1 = Math.min(y1, _y1);
                y2 = Math.max(y2, _y2);
            }

            if (!isFrozen) {
                t._cleanColumnHeaders(item.c1, item.c2);
                t._cleanRowHeaders(item.r1, item.r2);
            }
        });
        this._deactivateOverlayCtx();

        // Если есть активное автозаполнения, то нужно его тоже очистить
        if (this.activeFillHandle !== null) {
            var activeFillClone = this.activeFillHandle.clone(true);

            // Координаты для автозаполнения
            _x1 = this.cols[activeFillClone.c1].left - offsetX - this.width_2px;
            _x2 = this.cols[activeFillClone.c2].left + this.cols[activeFillClone.c2].width - offsetX + this.width_1px +
              this.width_2px;
            _y1 = this.rows[activeFillClone.r1].top - offsetY - this.height_2px;
            _y2 = this.rows[activeFillClone.r2].top + this.rows[activeFillClone.r2].height - offsetY + this.height_1px +
              this.height_2px;

            // Выбираем наибольший range для очистки
            x1 = Math.min(x1, _x1);
            x2 = Math.max(x2, _x2);
            y1 = Math.min(y1, _y1);
            y2 = Math.max(y2, _y2);
        }

        if (this.collaborativeEditing.getCollaborativeEditing()) {
            var currentSheetId = this.model.getId();

            var nLockAllType = this.collaborativeEditing.isLockAllOther(currentSheetId);
            if (Asc.c_oAscMouseMoveLockedObjectType.None !== nLockAllType) {
                this.overlayCtx.clear();
            } else {
                var arrayElementsMe = this.collaborativeEditing.getLockCellsMe(currentSheetId);
                var arrayElementsOther = this.collaborativeEditing.getLockCellsOther(currentSheetId);
                var arrayElements = arrayElementsMe.concat(arrayElementsOther);
                arrayElements =
                  arrayElements.concat(this.collaborativeEditing.getArrayInsertColumnsBySheetId(currentSheetId));
                arrayElements =
                  arrayElements.concat(this.collaborativeEditing.getArrayInsertRowsBySheetId(currentSheetId));

                for (i = 0; i < arrayElements.length; ++i) {
                    var arFormulaTmp = new asc_Range(arrayElements[i].c1, arrayElements[i].r1, arrayElements[i].c2, arrayElements[i].r2);

                    var aFormulaIntersection = arFormulaTmp.intersection(range);
                    if (aFormulaIntersection) {
                        // Координаты для автозаполнения
                        _x1 = this.cols[aFormulaIntersection.c1].left - offsetX - this.width_2px;
                        _x2 =
                          this.cols[aFormulaIntersection.c2].left + this.cols[aFormulaIntersection.c2].width - offsetX +
                          this.width_1px + this.width_2px;
                        _y1 = this.rows[aFormulaIntersection.r1].top - offsetY - this.height_2px;
                        _y2 =
                          this.rows[aFormulaIntersection.r2].top + this.rows[aFormulaIntersection.r2].height - offsetY +
                          this.height_1px + this.height_2px;

                        // Выбираем наибольший range для очистки
                        x1 = Math.min(x1, _x1);
                        x2 = Math.max(x2, _x2);
                        y1 = Math.min(y1, _y1);
                        y2 = Math.max(y2, _y2);
                    }
                }
            }
        }

        for (i = 0; i < this.arrActiveFormulaRanges.length; ++i) {
            this.arrActiveFormulaRanges[i].ranges.forEach(function (item) {
                var arnIntersection = item.intersectionSimple(range);
                if (arnIntersection) {
                    _x1 = t.cols[arnIntersection.c1].left - offsetX - t.width_3px;
                    _x2 = arnIntersection.c2 > t.cols.length ? width :
                    t.cols[arnIntersection.c2].left + t.cols[arnIntersection.c2].width - offsetX + t.width_1px +
                    t.width_2px;
                    _y1 = t.rows[arnIntersection.r1].top - offsetY - t.height_3px;
                    _y2 = arnIntersection.r2 > t.rows.length ? height : t.rows[arnIntersection.r2].top + t.rows[arnIntersection.r2].height - offsetY +
                    t.height_1px + t.height_2px;

                    x1 = Math.min(x1, _x1);
                    x2 = Math.max(x2, _x2);
                    y1 = Math.min(y1, _y1);
                    y2 = Math.max(y2, _y2);
                }
            });
        }
        for (i = 0; i < this.arrActiveChartRanges.length; ++i) {
            this.arrActiveChartRanges[i].ranges.forEach(function (item) {
                var arnIntersection = item.intersectionSimple(range);
                if (arnIntersection) {
                    _x1 = t.cols[arnIntersection.c1].left - offsetX - t.width_3px;
                    _x2 = arnIntersection.c2 > t.cols.length ? width :
                    t.cols[arnIntersection.c2].left + t.cols[arnIntersection.c2].width - offsetX + t.width_1px +
                    t.width_2px;
                    _y1 = t.rows[arnIntersection.r1].top - offsetY - t.height_3px;
                    _y2 = arnIntersection.r2 > t.rows.length ? height :
                    t.rows[arnIntersection.r2].top + t.rows[arnIntersection.r2].height - offsetY + t.height_1px +
                    t.height_2px;

                    x1 = Math.min(x1, _x1);
                    x2 = Math.max(x2, _x2);
                    y1 = Math.min(y1, _y1);
                    y2 = Math.max(y2, _y2);
                }
            });
        }

        if (null !== this.activeMoveRange) {
            var activeMoveRangeClone = this.activeMoveRange.clone(true);

            // Увеличиваем, если выходим за область видимости // Critical Bug 17413
            while (!this.cols[activeMoveRangeClone.c2]) {
                this.expandColsOnScroll(true);
                this.handlers.trigger("reinitializeScrollX");
            }
            while (!this.rows[activeMoveRangeClone.r2]) {
                this.expandRowsOnScroll(true);
                this.handlers.trigger("reinitializeScrollY");
            }

            // Координаты для перемещения диапазона
            _x1 = this.cols[activeMoveRangeClone.c1].left - offsetX - this.width_2px;
            _x2 = this.cols[activeMoveRangeClone.c2].left + this.cols[activeMoveRangeClone.c2].width - offsetX +
              this.width_1px + this.width_2px;
            _y1 = this.rows[activeMoveRangeClone.r1].top - offsetY - this.height_2px;
            _y2 = this.rows[activeMoveRangeClone.r2].top + this.rows[activeMoveRangeClone.r2].height - offsetY +
              this.height_1px + this.height_2px;

            // Выбираем наибольший range для очистки
            x1 = Math.min(x1, _x1);
            x2 = Math.max(x2, _x2);
            y1 = Math.min(y1, _y1);
            y2 = Math.max(y2, _y2);
        }

        if (null !== this.copyActiveRange) {
            this.copyActiveRange.ranges.forEach(function (item) {
                var arnIntersection = item.intersectionSimple(range);
                if (arnIntersection) {
                    _x1 = t.cols[arnIntersection.c1].left - offsetX - t.width_2px;
                    _x2 = t.cols[arnIntersection.c2].left + t.cols[arnIntersection.c2].width - offsetX +
                      t.width_1px + /* Это ширина "квадрата" для автофильтра от границы ячейки */t.width_2px;
                    _y1 = t.rows[arnIntersection.r1].top - offsetY - t.height_2px;
                    _y2 = t.rows[arnIntersection.r2].top + t.rows[arnIntersection.r2].height - offsetY +
                      t.height_1px + /* Это высота "квадрата" для автофильтра от границы ячейки */t.height_2px;

                    x1 = Math.min(x1, _x1);
                    x2 = Math.max(x2, _x2);
                    y1 = Math.min(y1, _y1);
                    y2 = Math.max(y2, _y2);
                }
            });
        }

        if (!(Number.MAX_VALUE === x1 && -Number.MAX_VALUE === x2 && Number.MAX_VALUE === y1 &&
          -Number.MAX_VALUE === y2)) {
            ctx.save()
              .beginPath()
              .rect(this.cellsLeft, this.cellsTop, ctx.getWidth() - this.cellsLeft, ctx.getHeight() - this.cellsTop)
              .clip()
              .clearRect(x1, y1, x2 - x1, y2 - y1)
              .restore();
        }
        return this;
    };

    WorksheetView.prototype.updateSelection = function () {
        this.cleanSelection();
        this._drawSelection();
    };
	WorksheetView.prototype.updateSelectionWithSparklines = function () {
		if (!this.checkSelectionSparkline()) {
			this._drawSelection();
		}
	};

    // mouseX - это разница стартовых координат от мыши при нажатии и границы
    WorksheetView.prototype.drawColumnGuides = function ( col, x, y, mouseX ) {
        x *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIX() );
        // Учитываем координаты точки, где мы начали изменение размера
        x += mouseX;

        var ctx = this.overlayCtx;
        var offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft;
        var offsetFrozen = this.getFrozenPaneOffset( false, true );
        offsetX -= offsetFrozen.offsetX;

        var x1 = this.cols[col].left - offsetX - this.width_1px;
        var h = ctx.getHeight();
        var widthPt = (x - x1);
        if ( 0 > widthPt ) {
            widthPt = 0;
        }

        ctx.clear();
        this._drawSelection();
        ctx.setFillPattern( this.settings.ptrnLineDotted1 )
            .fillRect( x1, 0, this.width_1px, h )
            .fillRect( x, 0, this.width_1px, h );

        return new asc_CMM( {
            type      : Asc.c_oAscMouseMoveType.ResizeColumn,
            sizeCCOrPt: this._colWidthToCharCount( widthPt ),
            sizePx    : widthPt * 96 / 72,
            x         : (x1 + this.cols[col].width) * asc_getcvt( 1/*pt*/, 0/*px*/, this._getPPIX() ),
            y         : this.cellsTop * asc_getcvt( 1/*pt*/, 0/*px*/, this._getPPIY() )
        } );
    };

    // mouseY - это разница стартовых координат от мыши при нажатии и границы
    WorksheetView.prototype.drawRowGuides = function ( row, x, y, mouseY ) {
        y *= asc_getcvt( 0/*px*/, 1/*pt*/, this._getPPIY() );
        // Учитываем координаты точки, где мы начали изменение размера
        y += mouseY;

        var ctx = this.overlayCtx;
        var offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
        var offsetFrozen = this.getFrozenPaneOffset( true, false );
        offsetY -= offsetFrozen.offsetY;

        var y1 = this.rows[row].top - offsetY - this.height_1px;
        var w = ctx.getWidth();
        var heightPt = (y - y1);
        if ( 0 > heightPt ) {
            heightPt = 0;
        }

        ctx.clear();
        this._drawSelection();
        ctx.setFillPattern( this.settings.ptrnLineDotted1 )
            .fillRect( 0, y1, w, this.height_1px )
            .fillRect( 0, y, w, this.height_1px );

        return new asc_CMM( {
            type      : Asc.c_oAscMouseMoveType.ResizeRow,
            sizeCCOrPt: heightPt,
            sizePx    : heightPt * 96 / 72,
            x         : this.cellsLeft * asc_getcvt( 1/*pt*/, 0/*px*/, this._getPPIX() ),
            y         : (y1 + this.rows[row].height) * asc_getcvt( 1/*pt*/, 0/*px*/, this._getPPIY() )
        } );
    };

    // --- Cache ---
    WorksheetView.prototype._cleanCache = function (range) {
        var r, c, row;

        if (range === undefined) {
            range = this.model.selectionRange.getLast();
        }

        for (r = range.r1; r <= range.r2; ++r) {
            row = this.cache.rows[r];
            if (row !== undefined) {
                // Должны еще крайнюю удалить
                c = range.c1;
                if (row.erased[c - 1]) {
                    delete row.erased[c - 1];
                }
                for (; c <= range.c2; ++c) {
                    if (row.columns[c]) {
                        delete row.columns[c];
                    }
                    if (row.columnsWithText[c]) {
                        delete row.columnsWithText[c];
                    }
                    if (row.erased[c]) {
                        delete row.erased[c];
                    }
                }
            }
        }
    };


    // ----- Cell text cache -----

    /** Очищает кэш метрик текста ячеек */
    WorksheetView.prototype._cleanCellsTextMetricsCache = function () {
        var s = this.cache.sectors = [];
        var vr = this.visibleRange;
        var h = vr.r2 + 1 - vr.r1;
        var rl = this.rows.length;
        var rc = asc_floor(rl / h) + (rl % h > 0 ? 1 : 0);
        var range = new asc_Range(0, 0, this.cols.length - 1, h - 1);
        var j;
        for (j = rc; j > 0; --j, range.r1 += h, range.r2 += h) {
            if (j === 1 && rl % h > 0) {
                range.r2 = rl - 1;
            }
            s.push(range.clone());
        }
    };

    /**
     * Обновляет общий кэш и кэширует метрики текста ячеек для указанного диапазона
     * @param {Asc.Range} [range]  Диапазон кэширования текта
     */
    WorksheetView.prototype._prepareCellTextMetricsCache = function (range) {
        var firstUpdateRow = null;
        if (!range) {
            range = this.visibleRange;
            if (this.topLeftFrozenCell) {
                var row = this.topLeftFrozenCell.getRow0();
                var col = this.topLeftFrozenCell.getCol0();
                if (0 < row && 0 < col) {
                    firstUpdateRow = asc.getMinValueOrNull(firstUpdateRow,
                      this._prepareCellTextMetricsCache2(new Asc.Range(0, 0, col - 1, row - 1)));
                }
                if (0 < row) {
                    firstUpdateRow = asc.getMinValueOrNull(firstUpdateRow, this._prepareCellTextMetricsCache2(
                      new Asc.Range(this.visibleRange.c1, 0, this.visibleRange.c2, row - 1)));
                }
                if (0 < col) {
                    firstUpdateRow = asc.getMinValueOrNull(firstUpdateRow, this._prepareCellTextMetricsCache2(
                      new Asc.Range(0, this.visibleRange.r1, col - 1, this.visibleRange.r2)));
                }
            }
        }

        firstUpdateRow = asc.getMinValueOrNull(firstUpdateRow, this._prepareCellTextMetricsCache2(range));
        if (null !== firstUpdateRow || this.isChanged) {
            // Убрал это из _calcCellsTextMetrics, т.к. вызов был для каждого сектора(добавляло тормоза: баг 20388)
            // Код нужен для бага http://bugzilla.onlyoffice.com/show_bug.cgi?id=13875
            this._updateRowPositions();
            this._calcVisibleRows();

            if (this.objectRender) {
                this.objectRender.updateSizeDrawingObjects({target: c_oTargetType.RowResize, row: firstUpdateRow},
                  true);
            }
        }
    };

    /**
     * Обновляет общий кэш и кэширует метрики текста ячеек для указанного диапазона (сама реализация, напрямую не вызывать, только из _prepareCellTextMetricsCache)
     * @param {Asc.Range} [range]  Диапазон кэширования текта
     */
    WorksheetView.prototype._prepareCellTextMetricsCache2 = function (range) {
        var firstUpdateRow = null;
        var s = this.cache.sectors;
        for (var i = 0; i < s.length;) {
            if (s[i].isIntersect(range)) {
                this._calcCellsTextMetrics(s[i]);
                s.splice(i, 1);
                firstUpdateRow = null !== firstUpdateRow ? Math.min(range.r1, firstUpdateRow) : range.r1;
                continue;
            }
            ++i;
        }
        return firstUpdateRow;
    };

    /**
     * Кэширует метрики текста для диапазона ячеек
     * @param {Asc.Range} range  description
     */
    WorksheetView.prototype._calcCellsTextMetrics = function (range) {
        var colsLength = this.cols.length;
        if (range === undefined) {
            range = new Asc.Range(0, 0, colsLength - 1, this.rows.length - 1);
        }
        var rowModel, rowCells, cellColl;
        for (var row = range.r1; row <= range.r2; ++row) {
            if (this.height_1px > this.rows[row].height) {
                continue;
            }
            // Теперь получаем только не пустые ячейки для строки
            rowModel = this.model._getRowNoEmpty(row);
            if (!rowModel) {
                continue;
            }
            rowCells = rowModel.getCells();
            for (cellColl in rowCells) {
                cellColl = cellColl - 0;
                if (colsLength <= cellColl || this.width_1px > this.cols[cellColl].width) {
                    continue;
                }

                this._addCellTextToCache(cellColl, row);
            }
        }
        this.isChanged = false;
    };

    WorksheetView.prototype._fetchRowCache = function (row) {
        return (this.cache.rows[row] = ( this.cache.rows[row] || new CacheElement() ));
    };

    WorksheetView.prototype._fetchCellCache = function (col, row) {
        var r = this._fetchRowCache(row);
        return (r.columns[col] = ( r.columns[col] || {} ));
    };

    WorksheetView.prototype._fetchCellCacheText = function (col, row) {
        var r = this._fetchRowCache(row);
        return (r.columnsWithText[col] = ( r.columnsWithText[col] || {} ));
    };

    WorksheetView.prototype._getRowCache = function (row) {
        return this.cache.rows[row];
    };

    WorksheetView.prototype._getCellCache = function (col, row) {
        var r = this.cache.rows[row];
        return r ? r.columns[col] : undefined;
    };

    WorksheetView.prototype._getCellTextCache = function (col, row, dontLookupMergedCells) {
        var r = this.cache.rows[row], c = r ? r.columns[col] : undefined;
        if (c && c.text) {
            return c.text;
        } else if (!dontLookupMergedCells) {
            // ToDo проверить это условие, возможно оно избыточно
            var range = this.model.getMergedByCell(row, col);
            return null !== range ? this._getCellTextCache(range.c1, range.r1, true) : undefined;
        }
        return undefined;
    };

    WorksheetView.prototype._changeColWidth = function (col, width, pad) {
        var cc = Math.min(this._colWidthToCharCount(width + pad), Asc.c_oAscMaxColumnWidth);
        var modelw = this.model.charCountToModelColWidth(cc);
        var colw = this._calcColWidth(modelw);

        if (colw.width > this.cols[col].width) {
            this.cols[col].width = colw.width;
            this.cols[col].innerWidth = colw.innerWidth;
            this.cols[col].charCount = colw.charCount;

            History.Create_NewPoint();
            History.StartTransaction();
            // Выставляем, что это bestFit
            this.model.setColBestFit(true, modelw, col, col);
            History.EndTransaction();

            this._updateColumnPositions();
            this.isChanged = true;
        }
    };

    WorksheetView.prototype._addCellTextToCache = function (col, row, canChangeColWidth) {
        var self = this;

        function makeFnIsGoodNumFormat(flags, width) {
            return function (str) {
                return self.stringRender.measureString(str, flags, width).width <= width;
            };
        }

        var c = this._getCell(col, row);
        if (null === c) {
            return col;
        }

        var bUpdateScrollX = false;
        var bUpdateScrollY = false;
        // Проверка на увеличение колличества столбцов
        if (col >= this.cols.length) {
            bUpdateScrollX = this.expandColsOnScroll(/*isNotActive*/ false, /*updateColsCount*/ true);
        }
        // Проверка на увеличение колличества строк
        if (row >= this.rows.length) {
            bUpdateScrollY = this.expandRowsOnScroll(/*isNotActive*/ false, /*updateRowsCount*/ true);
        }
        if (bUpdateScrollX && bUpdateScrollY) {
            this.handlers.trigger("reinitializeScroll");
        } else if (bUpdateScrollX) {
            this.handlers.trigger("reinitializeScrollX");
        } else if (bUpdateScrollY) {
            this.handlers.trigger("reinitializeScrollY");
        }

        var str, tm, isMerged = false, strCopy;

        // Range для замерженной ячейки
        var fl = this._getCellFlags(c);
        var mc = fl.merged;
        var fMergedColumns = false;	// Замержены ли колонки (если да, то автоподбор ширины не должен работать)
        var fMergedRows = false;	// Замержены ли строки (если да, то автоподбор высоты не должен работать)
        if (null !== mc) {
            if (col !== mc.c1 || row !== mc.r1) {
                // Проверим внесена ли первая ячейка в cache (иначе если была скрыта первая строка или первый столбец, то мы не внесем)
                if (undefined === this._getCellTextCache(mc.c1, mc.r1, true)) {
                    return this._addCellTextToCache(mc.c1, mc.r1, canChangeColWidth);
                }
                return mc.c2;
            } // skip other merged cell from range
            if (mc.c1 !== mc.c2) {
                fMergedColumns = true;
            }
            if (mc.r1 !== mc.r2) {
                fMergedRows = true;
            }
            isMerged = true;
        }

        var angle = c.getAngle();
        var va = c.getAlignVertical();
        if (this._isCellEmptyTextString(c)) {
            if (!angle && c.isNotDefaultFont()) {
                // Пустая ячейка с измененной гарнитурой или размером, учитвается в высоте
                str = c.getValue2();
                if (0 < str.length) {
                    strCopy = str[0];
                    if (!(tm = AscCommonExcel.g_oCacheMeasureEmpty.get(strCopy.format))) {
                        // Без текста не будет толка
                        strCopy = strCopy.clone();
                        strCopy.text = 'A';
                        tm = this._roundTextMetrics(this.stringRender.measureString([strCopy], fl));
                        AscCommonExcel.g_oCacheMeasureEmpty.add(strCopy.format, tm);
                    }
                    this._updateRowHeight(tm, col, row, fl, isMerged, fMergedRows, va);
                }
            }

            return mc ? mc.c2 : col;
        }

        var dDigitsCount = 0;
        var colWidth = 0;
        var cellType = c.getType();
        fl.isNumberFormat = (null === cellType || CellValueType.String !== cellType); // Автоподбор делается по любому типу (кроме строки)
        var numFormatStr = c.getNumFormatStr();
        var pad = this.width_padding * 2 + this.width_1px;
        var sstr, sfl, stm;

        if (!this.cols[col].isCustomWidth && fl.isNumberFormat && !fMergedColumns &&
          (c_oAscCanChangeColWidth.numbers === canChangeColWidth ||
          c_oAscCanChangeColWidth.all === canChangeColWidth)) {
            colWidth = this.cols[col].innerWidth;
            // Измеряем целую часть числа
            sstr = c.getValue2(gc_nMaxDigCountView, function () {
                return true;
            });
            if ("General" === numFormatStr && c_oAscCanChangeColWidth.all !== canChangeColWidth) {
                // asc.truncFracPart изменяет исходный массив, поэтому клонируем
                var fragmentsTmp = [];
                for (var k = 0; k < sstr.length; ++k) {
                    fragmentsTmp.push(sstr[k].clone());
                }
                sstr = asc.truncFracPart(fragmentsTmp);
            }
            sfl = fl.clone();
            sfl.wrapText = false;
            stm = this._roundTextMetrics(this.stringRender.measureString(sstr, sfl, colWidth));
            // Если целая часть числа не убирается в ячейку, то расширяем столбец
            if (stm.width > colWidth) {
                this._changeColWidth(col, stm.width, pad);
            }
            // Обновленная ячейка
            dDigitsCount = this.cols[col].charCount;
            colWidth = this.cols[col].innerWidth;
        } else if (null === mc) {
            // Обычная ячейка
            dDigitsCount = this.cols[col].charCount;
            colWidth = this.cols[col].innerWidth;
            // подбираем ширину
            if (!this.cols[col].isCustomWidth && !fMergedColumns && !fl.wrapText &&
              c_oAscCanChangeColWidth.all === canChangeColWidth) {
                sstr = c.getValue2(gc_nMaxDigCountView, function () {
                    return true;
                });
                stm = this._roundTextMetrics(this.stringRender.measureString(sstr, fl, colWidth));
                if (stm.width > colWidth) {
                    this._changeColWidth(col, stm.width, pad);
                    // Обновленная ячейка
                    dDigitsCount = this.cols[col].charCount;
                    colWidth = this.cols[col].innerWidth;
                }
            }
        } else {
            // Замерженная ячейка, нужна сумма столбцов
            for (var i = mc.c1; i <= mc.c2 && i < this.cols.length; ++i) {
                colWidth += this.cols[i].width;
                dDigitsCount += this.cols[i].charCount;
            }
            colWidth -= pad;
        }

        var rowHeight = this.rows[row].height;

        // ToDo dDigitsCount нужно рассчитывать исходя не из дефалтового шрифта и размера, а исходя из текущего шрифта и размера ячейки
        str = c.getValue2(dDigitsCount, makeFnIsGoodNumFormat(fl, colWidth));
        var ha = c.getAlignHorizontalByValue();
        var maxW = fl.wrapText || fl.shrinkToFit || isMerged || asc.isFixedWidthCell(str) ?
          this._calcMaxWidth(col, row, mc) : undefined;
        tm = this._roundTextMetrics(this.stringRender.measureString(str, fl, maxW));
        var cto = (isMerged || fl.wrapText) ? {
            maxWidth: maxW - this.cols[col].innerWidth + this.cols[col].width, leftSide: 0, rightSide: 0
        } : this._calcCellTextOffset(col, row, ha, tm.width);

        // check right side of cell text and append columns if it exceeds existing cells borders
        if (!isMerged) {
            var rside = this.cols[col - cto.leftSide].left + tm.width;
            var lc = this.cols[this.cols.length - 1];
            if (rside > lc.left + lc.width) {
                this._appendColumns(rside);
                cto = this._calcCellTextOffset(col, row, ha, tm.width);
            }
        }
        var textBound = {};

        if (angle) {
            //  повернутый текст учитывает мерж ячеек по строкам
            if (fMergedRows) {
                rowHeight = 0;

                for (var j = mc.r1; j <= mc.r2 && j < this.nRowsCount; ++j) {
                    rowHeight += this.rows[j].height;
                }
            }

            var textW = tm.width;
            if (fl.wrapText) {

                if (this.rows[row].isCustomHeight) {
                    tm = this._roundTextMetrics(this.stringRender.measureString(str, fl, rowHeight));
                    textBound =
                      this.stringRender.getTransformBound(angle, colWidth, rowHeight, tm.width, ha, va, rowHeight);
                } else {

                    if (!fMergedRows) {
                        rowHeight = tm.height;
                    }
                    tm = this._roundTextMetrics(this.stringRender.measureString(str, fl, rowHeight));
                    textBound =
                      this.stringRender.getTransformBound(angle, colWidth, rowHeight, tm.width, ha, va, tm.width);
                }
            } else {
                textBound = this.stringRender.getTransformBound(angle, colWidth, rowHeight, textW, ha, va, maxW);
            }

//  NOTE: если проекция строчки на Y больше высоты ячейки подставлять # и рисовать все по центру

//                    if (fl.isNumberFormat) {
//                        var prj = Math.abs(Math.sin(angle * Math.PI / 180.0) * tm.width);
//                        if (prj > rowHeight) {
//                            //if (maxW === undefined) {}
//                            maxW = rowHeight / Math.abs(Math.cos(angle * Math.PI / 180.0));
//                            str  =  c.getValue2(gc_nMaxDigCountView, makeFnIsGoodNumFormat(fl, maxW));
//
//                            for (i = 0; i < str.length; ++i) {
//                                var f = str[i].format;
//                                if (f) f.repeat = true;
//                            }
//
//                            tm   =  this._roundTextMetrics(this.stringRender.measureString(str, fl, maxW));
//                        }
//                    }
        }

        this._fetchCellCache(col, row).text = {
            state: this.stringRender.getInternalState(),
            flags: fl,
            color: (c.getFont().getColor() || this.settings.cells.defaultState.color),
            metrics: tm,
            cellW: cto.maxWidth,
            cellHA: ha,
            cellVA: va,
            sideL: cto.leftSide,
            sideR: cto.rightSide,
            cellType: cellType,
            isFormula: c.isFormula(),
            angle: angle,
            textBound: textBound
        };

        this._fetchCellCacheText(col, row).hasText = true;

        if (!angle && (cto.leftSide !== 0 || cto.rightSide !== 0)) {
            this._addErasedBordersToCache(col - cto.leftSide, col + cto.rightSide, row);
        }

        fMergedRows = fMergedRows || (isMerged && fl.wrapText);
        this._updateRowHeight(tm, col, row, fl, isMerged, fMergedRows, va, ha, angle, maxW,
          colWidth, textBound);

        return mc ? mc.c2 : col;
    };

    WorksheetView.prototype._updateRowHeight =
      function (tm, col, row, flags, isMerged, fMergedRows, va, ha, angle, maxW, colWidth, textBound) {
			var rowInfo = this.rows[row];
          // update row's descender
			if (va !== Asc.c_oAscVAlign.Top && va !== Asc.c_oAscVAlign.Center && !isMerged) {
              rowInfo.descender = Math.max(rowInfo.descender, tm.height - tm.baseline);
          }

          // update row's height
          // Замерженная ячейка (с 2-мя или более строками) не влияет на высоту строк!
			if (!rowInfo.isCustomHeight && !(window["NATIVE_EDITOR_ENJINE"] && this.notUpdateRowHeight) &&
				!fMergedRows) {
				var newHeight = tm.height + this.height_1px;
              if (angle && textBound) {
                  newHeight = Math.max(rowInfo.height, textBound.height);
              }

				newHeight = Math.min(this.maxRowHeight, Math.max(rowInfo.height, newHeight));
				if (newHeight !== rowInfo.height) {
					rowInfo.heightReal = rowInfo.height = newHeight;
					History.TurnOff();
                  this.model.setRowHeight(rowInfo.height, row, row, false);
					History.TurnOn();

                  if (angle) {
                      if (flags.wrapText && !rowInfo.isCustomHeight) {
                          maxW = tm.width;
                      }

                      textBound =
							this.stringRender.getTransformBound(angle, colWidth, rowInfo.height, tm.width, ha, va,
								maxW);

                      this._fetchCellCache(col, row).text.textBound = textBound;
                  }

                  this.isChanged = true;
              }
          }
      };

    WorksheetView.prototype._calcMaxWidth = function (col, row, mc) {
        if (null === mc) {
            return this.cols[col].innerWidth;
        }

        var width = this.cols[mc.c1].innerWidth;
        for (var c = mc.c1 + 1; c <= mc.c2 && c < this.cols.length; ++c) {
            width += this.cols[c].width;
        }
        return width;
    };

    WorksheetView.prototype._calcCellTextOffset = function (col, row, textAlign, textWidth) {
        var sideL = [0], sideR = [0], i;
        var maxWidth = this.cols[col].width;
        var ls = 0, rs = 0;
        var pad = this.settings.cells.padding * asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIX());
        var textW = textAlign === AscCommon.align_Center ? (textWidth + maxWidth) * 0.5 : textWidth + pad;

        if (textAlign === AscCommon.align_Right || textAlign === AscCommon.align_Center) {
            sideL = this._calcCellsWidth(col, 0, row);
            // condition (sideL.lenght >= 1) is always true
            for (i = 0; i < sideL.length && textW > sideL[i]; ++i) {/* do nothing */
            }
            ls = i !== sideL.length ? i : i - 1;
        }

        if (textAlign !== AscCommon.align_Right) {
            sideR = this._calcCellsWidth(col, this.cols.length - 1, row);
            // condition (sideR.lenght >= 1) is always true
            for (i = 0; i < sideR.length && textW > sideR[i]; ++i) {/* do nothing */
            }
            rs = i !== sideR.length ? i : i - 1;
        }

        if (textAlign === AscCommon.align_Center) {
            maxWidth = (sideL[ls] - sideL[0]) + sideR[rs];
        } else {
            maxWidth = textAlign === AscCommon.align_Right ? sideL[ls] : sideR[rs];
        }

        return {
            maxWidth: maxWidth, leftSide: ls, rightSide: rs
        };
    };

    WorksheetView.prototype._calcCellsWidth = function (colBeg, colEnd, row) {
        var inc = colBeg <= colEnd ? 1 : -1, res = [];
        for (var i = colBeg; (colEnd - i) * inc >= 0; i += inc) {
            if (i !== colBeg && !this._isCellEmptyOrMerged(i, row)) {
                break;
            }
            res.push(this.cols[i].width);
            if (res.length > 1) {
                res[res.length - 1] += res[res.length - 2];
            }
        }
        return res;
    };

    // Ищет текст в строке (columnsWithText - это колонки, в которых есть текст)
    WorksheetView.prototype._findSourceOfCellText = function (col, row) {
        var r = this._getRowCache(row);
        if (r) {
            for (var i in r.columnsWithText) {
                if (!r.columns[i] || 0 === this.cols[i].width) {
                    continue;
                }
                var ct = r.columns[i].text;
                if (!ct) {
                    continue;
                }
                i >>= 0;
                var lc = i - ct.sideL, rc = i + ct.sideR;
                if (col >= lc && col <= rc) {
                    return i;
                }
            }
        }
        return -1;
    };


    // ----- Merged cells cache -----

    WorksheetView.prototype._isMergedCells = function (range) {
        return range.isEqual(this.model.getMergedByCell(range.r1, range.c1));
    };

    // ----- Cell borders cache -----

    WorksheetView.prototype._addErasedBordersToCache = function (colBeg, colEnd, row) {
        var rc = this._fetchRowCache(row);
        for (var col = colBeg; col < colEnd; ++col) {
            rc.erased[col] = true;
        }
    };

    WorksheetView.prototype._isLeftBorderErased = function (col, rowCache) {
        return rowCache.erased[col - 1] === true;
    };
    WorksheetView.prototype._isRightBorderErased = function (col, rowCache) {
        return rowCache.erased[col] === true;
    };

    WorksheetView.prototype._calcMaxBorderWidth = function (b1, b2) {
        // ToDo пересмотреть
        return Math.max(b1 && b1.w, b2 && b2.w);
    };


    // ----- Cells utilities -----

    /**
     * Возвращает заголовок колонки по индексу
     * @param {Number} col  Индекс колонки
     * @return {String}
     */
    WorksheetView.prototype._getColumnTitle = function (col) {
        return AscCommon.g_oCellAddressUtils.colnumToColstrFromWsView(col + 1);
    };

    /**
     * Возвращает заголовок строки по индексу
     * @param {Number} row  Индекс строки
     * @return {String}
     */
    WorksheetView.prototype._getRowTitle = function (row) {
        return "" + (row + 1);
    };

    /**
     * Возвращает заголовок ячейки по индексу
     * @param {Number} col  Индекс колонки
     * @param {Number} row  Индекс строки
     * @return {String}
     */
    WorksheetView.prototype._getCellTitle = function (col, row) {
        return this._getColumnTitle(col) + this._getRowTitle(row);
    };

    /**
     * Возвращает ячейку таблицы (из Worksheet)
     * @param {Number} col  Индекс колонки
     * @param {Number} row  Индекс строки
     * @return {Range}
     */
    WorksheetView.prototype._getCell = function (col, row) {
        if (this.nRowsCount < this.model.getRowsCount() + 1) {
            this.expandRowsOnScroll(false, true, 0);
        } // Передаем 0, чтобы увеличить размеры
        if (this.nColsCount < this.model.getColsCount() + 1) {
            this.expandColsOnScroll(false, true, 0);
        } // Передаем 0, чтобы увеличить размеры

        if (col < 0 || col >= this.nColsCount || row < 0 || row >= this.nRowsCount) {
            return null;
        }

        return this.model.getCell3(row, col);
    };

    WorksheetView.prototype._getVisibleCell = function (col, row) {
        return this.model.getCell3(row, col);
    };

    WorksheetView.prototype._getCellFlags = function (col, row) {
        var c = row !== undefined ? this._getCell(col, row) : col;
        var fl = new CellFlags();
        if (null !== c) {
            fl.wrapText = c.getWrap();
            fl.shrinkToFit = c.getShrinkToFit();
            fl.merged = c.hasMerged();
            fl.textAlign = c.getAlignHorizontalByValue();
        }
        return fl;
    };

    WorksheetView.prototype._isCellEmptyText = function (col, row) {
        var c = row !== undefined ? this._getCell(col, row) : col;
        return null === c || c.isEmptyText();
    };
    WorksheetView.prototype._isCellEmptyTextString = function (col, row) {
        var c = row !== undefined ? this._getCell(col, row) : col;
        return null === c || c.isEmptyTextString();
    };

    WorksheetView.prototype._isCellEmptyOrMerged = function (col, row) {
        var c = row !== undefined ? this._getCell(col, row) : col;
        if (null === c) {
            return true;
        }
        if (!c.isEmptyText()) {
            return false;
        }
        return (null === c.hasMerged());
    };

    WorksheetView.prototype._isCellEmptyOrMergedOrBackgroundColorOrBorders = function (col, row) {
        var c = row !== undefined ? this._getCell(col, row) : col;
        if (null === c) {
            return true;
        }
        if (!c.isEmptyTextString()) {
            return false;
        }
        if (null !== c.hasMerged()) {
            return false;
        }
        var bg = c.getFill();
        if (null !== bg) {
            return false;
        }
        var cb = c.getBorder();
        return !((cb.l && c_oAscBorderStyles.None !== cb.l.s) || (cb.r && c_oAscBorderStyles.None !== cb.r.s) ||
        (cb.t && c_oAscBorderStyles.None !== cb.t.s) || (cb.b && c_oAscBorderStyles.None !== cb.b.s) ||
        (cb.dd && c_oAscBorderStyles.None !== cb.dd.s) || (cb.du && c_oAscBorderStyles.None !== cb.du.s));
    };

    WorksheetView.prototype._getRange = function (c1, r1, c2, r2) {
        return this.model.getRange3(r1, c1, r2, c2);
    };

    WorksheetView.prototype._selectColumnsByRange = function () {
        var ar = this.model.selectionRange.getLast();
        if (c_oAscSelectionType.RangeMax !== ar.type) {
            this.cleanSelection();
            if (c_oAscSelectionType.RangeRow === ar.type) {
                ar.assign(0, 0, this.cols.length - 1, this.rows.length - 1);
                ar.type = c_oAscSelectionType.RangeMax;
            } else {
                ar.type = c_oAscSelectionType.RangeCol;
                ar.assign(ar.c1, 0, ar.c2, this.rows.length - 1);
            }

            this._drawSelection();
            this._updateSelectionNameAndInfo();
        }
    };

    WorksheetView.prototype._selectRowsByRange = function () {
        var ar = this.model.selectionRange.getLast();
        if (c_oAscSelectionType.RangeMax !== ar.type) {
            this.cleanSelection();

            if (c_oAscSelectionType.RangeCol === ar.type) {
                ar.assign(0, 0, this.cols.length - 1, this.rows.length - 1);
                ar.type = c_oAscSelectionType.RangeMax;
            } else {
                ar.type = c_oAscSelectionType.RangeRow;
                ar.assign(0, ar.r1, this.cols.length - 1, ar.r2);
            }

            this._drawSelection();
            this._updateSelectionNameAndInfo();
        }
    };

    /**
     * Возвращает true, если диапазон больше видимой области, и операции над ним могут привести к задержкам
     * @param {Asc.Range} range  Диапазон для проверки
     * @returns {Boolean}
     */
    WorksheetView.prototype._isLargeRange = function (range) {
        var vr = this.visibleRange;
        return range.c2 - range.c1 + 1 > (vr.c2 - vr.c1 + 1) * 3 || range.r2 - range.r1 + 1 > (vr.r2 - vr.r1 + 1) * 3;
    };

    WorksheetView.prototype.drawDepCells = function () {
        var ctx = this.overlayCtx, _cc = this.cellCommentator, c, node, that = this;

        ctx.clear();
        this._drawSelection();

        var color = new CColor(0, 0, 255);

        function draw_arrow(context, fromx, fromy, tox, toy) {
            var headlen = 9, showArrow = tox > that.getCellLeft(0, 0) && toy > that.getCellTop(0, 0), dx = tox -
              fromx, dy = toy - fromy, tox = tox > that.getCellLeft(0, 0) ? tox : that.getCellLeft(0, 0), toy = toy >
            that.getCellTop(0, 0) ? toy : that.getCellTop(0, 0), angle = Math.atan2(dy, dx), _a = Math.PI / 18;

            // ToDo посмотреть на четкость moveTo, lineTo
            context.save()
              .setLineWidth(1)
              .beginPath()
              .lineDiag
              .moveTo(_cc.pxToPt(fromx), _cc.pxToPt(fromy))
              .lineTo(_cc.pxToPt(tox), _cc.pxToPt(toy));
            // .dashLine(_cc.pxToPt(fromx-.5), _cc.pxToPt(fromy-.5), _cc.pxToPt(tox-.5), _cc.pxToPt(toy-.5), 15, 5)
            if (showArrow) {
                context
                  .moveTo(_cc.pxToPt(tox - headlen * Math.cos(angle - _a)),
                    _cc.pxToPt(toy - headlen * Math.sin(angle - _a)))
                  .lineTo(_cc.pxToPt(tox), _cc.pxToPt(toy))
                  .lineTo(_cc.pxToPt(tox - headlen * Math.cos(angle + _a)),
                    _cc.pxToPt(toy - headlen * Math.sin(angle + _a)))
                  .lineTo(_cc.pxToPt(tox - headlen * Math.cos(angle - _a)),
                    _cc.pxToPt(toy - headlen * Math.sin(angle - _a)));
            }

            context
              .setStrokeStyle(color)
              .setFillStyle(color)
              .stroke()
              .fill()
              .closePath()
              .restore();
        }

        function gCM(_this, col, row) {
            var metrics = {top: 0, left: 0, width: 0, height: 0, result: false}; 	// px

            var fvr = _this.getFirstVisibleRow();
            var fvc = _this.getFirstVisibleCol();
            var mergedRange = _this.model.getMergedByCell(row, col);

            if (mergedRange && (fvc < mergedRange.c2) && (fvr < mergedRange.r2)) {

                var startCol = (mergedRange.c1 > fvc) ? mergedRange.c1 : fvc;
                var startRow = (mergedRange.r1 > fvr) ? mergedRange.r1 : fvr;

                metrics.top = _this.getCellTop(startRow, 0) - _this.getCellTop(fvr, 0) + _this.getCellTop(0, 0);
                metrics.left = _this.getCellLeft(startCol, 0) - _this.getCellLeft(fvc, 0) + _this.getCellLeft(0, 0);

                for (var i = startCol; i <= mergedRange.c2; i++) {
                    metrics.width += _this.getColumnWidth(i, 0)
                }
                for (var i = startRow; i <= mergedRange.r2; i++) {
                    metrics.height += _this.getRowHeight(i, 0)
                }
                metrics.result = true;
            } else {

                metrics.top = _this.getCellTop(row, 0) - _this.getCellTop(fvr, 0) + _this.getCellTop(0, 0);
                metrics.left = _this.getCellLeft(col, 0) - _this.getCellLeft(fvc, 0) + _this.getCellLeft(0, 0);
                metrics.width = _this.getColumnWidth(col, 0);
                metrics.height = _this.getRowHeight(row, 0);
                metrics.result = true;
            }

            return metrics
        }

        for (var id in this.depDrawCells) {
            c = this.depDrawCells[id].from;
            node = this.depDrawCells[id].to;
            var mainCellMetrics = gCM(this, c.nCol, c.nRow), nodeCellMetrics, _t1, _t2;
            for (var id in node) {
                if (!node[id].isArea) {
                    _t1 = gCM(this, node[id].returnCell().nCol, node[id].returnCell().nRow)
                    nodeCellMetrics = {
                        t: _t1.top,
                        l: _t1.left,
                        w: _t1.width,
                        h: _t1.height,
                        apt: _t1.top + _t1.height / 2,
                        apl: _t1.left + _t1.width / 4
                    };
                } else {
                    var _t1 = gCM(_wsV, me[id].getBBox().c1, me[id].getBBox().r1), _t2 = gCM(_wsV, me[id].getBBox().c2,
                      me[id].getBBox().r2);

                    nodeCellMetrics = {
                        t: _t1.top,
                        l: _t1.left,
                        w: _t2.left + _t2.width - _t1.left,
                        h: _t2.top + _t2.height - _t1.top,
                        apt: _t1.top + _t1.height / 2,
                        apl: _t1.left + _t1.width / 4
                    };
                }

                var x1 = Math.floor(nodeCellMetrics.apl), y1 = Math.floor(nodeCellMetrics.apt), x2 = Math.floor(
                  mainCellMetrics.left + mainCellMetrics.width / 4), y2 = Math.floor(
                  mainCellMetrics.top + mainCellMetrics.height / 2);

                if (x1 < 0 && x2 < 0 || y1 < 0 && y2 < 0) {
                    continue;
                }

                if (y1 < this.getCellTop(0, 0)) {
                    y1 -= this.getCellTop(0, 0);
                }

                if (y1 < 0 && y2 > 0) {
                    var _x1 = Math.floor(Math.sqrt((x1 - x2) * (x1 - x2) * y1 * y1 / ((y2 - y1) * (y2 - y1))));
                    // x1 -= (x1-x2>0?1:-1)*_x1;
                    if (x1 > x2) {
                        x1 -= _x1;
                    } else if (x1 < x2) {
                        x1 += _x1;
                    }
                } else if (y1 > 0 && y2 < 0) {
                    var _x2 = Math.floor(Math.sqrt((x1 - x2) * (x1 - x2) * y2 * y2 / ((y2 - y1) * (y2 - y1))));
                    // x2 -= (x2-x1>0?1:-1)*_x2;
                    if (x2 > x1) {
                        x2 -= _x2;
                    } else if (x2 < x1) {
                        x2 += _x2;
                    }
                }

                if (x1 < 0 && x2 > 0) {
                    var _y1 = Math.floor(Math.sqrt((y1 - y2) * (y1 - y2) * x1 * x1 / ((x2 - x1) * (x2 - x1))))
                    // y1 -= (y1-y2>0?1:-1)*_y1;
                    if (y1 > y2) {
                        y1 -= _y1;
                    } else if (y1 < y2) {
                        y1 += _y1;
                    }
                } else if (x1 > 0 && x2 < 0) {
                    var _y2 = Math.floor(Math.sqrt((y1 - y2) * (y1 - y2) * x2 * x2 / ((x2 - x1) * (x2 - x1))))
                    // y2 -= (y2-y1>0?1:-1)*_y2;
                    if (y2 > y1) {
                        y2 -= _y2;
                    } else if (y2 < y1) {
                        y2 += _y2;
                    }
                }

                draw_arrow(ctx, x1 < this.getCellLeft(0, 0) ? this.getCellLeft(0, 0) : x1,
                  y1 < this.getCellTop(0, 0) ? this.getCellTop(0, 0) : y1, x2, y2);
                // draw_arrow(ctx, x1, y1, x2, y2);

                // ToDo посмотреть на четкость rect
                if (nodeCellMetrics.apl > this.getCellLeft(0, 0) && nodeCellMetrics.apt > this.getCellTop(0, 0)) {
                    ctx.save()
                      .beginPath()
                      .arc(_cc.pxToPt(Math.floor(nodeCellMetrics.apl)), _cc.pxToPt(Math.floor(nodeCellMetrics.apt)), 3,
                        0, 2 * Math.PI, false, -0.5, -0.5)
                      .setFillStyle(color)
                      .fill()
                      .closePath()
                      .setLineWidth(1)
                      .setStrokeStyle(color)
                      .rect(_cc.pxToPt(nodeCellMetrics.l), _cc.pxToPt(nodeCellMetrics.t),
                        _cc.pxToPt(nodeCellMetrics.w - 1), _cc.pxToPt(nodeCellMetrics.h - 1))
                      .stroke()
                      .restore();
                }
            }
        }
    };

    WorksheetView.prototype.prepareDepCells = function (se) {
        this.drawDepCells();
    };

    WorksheetView.prototype.cleanDepCells = function () {
        this.depDrawCells = null;
        this.drawDepCells();
    };

    // ----- Text drawing -----

    WorksheetView.prototype._getPPIX = function () {
        return this.drawingCtx.getPPIX();
    };

    WorksheetView.prototype._getPPIY = function () {
        return this.drawingCtx.getPPIY();
    };

    WorksheetView.prototype._setFont = function (drawingCtx, name, size) {
        var ctx = (drawingCtx) ? drawingCtx : this.drawingCtx;
        ctx.setFont(new asc.FontProperties(name, size));
    };

    /**
     * @param {Asc.TextMetrics} tm
     * @return {Asc.TextMetrics}
     */
    WorksheetView.prototype._roundTextMetrics = function (tm) {
        tm.width = asc_calcnpt(tm.width, this._getPPIX());
        tm.height = asc_calcnpt(tm.height, 96);
        tm.baseline = asc_calcnpt(tm.baseline, 96);

        if (tm.centerline !== undefined) {
            tm.centerline = asc_calcnpt(tm.centerline, 96);
        }
        return tm;
    };

    WorksheetView.prototype._calcTextHorizPos = function (x1, x2, tm, halign) {
        switch (halign) {
            case AscCommon.align_Center:
                return asc_calcnpt(0.5 * (x1 + x2 + this.width_1px - tm.width), this._getPPIX());
            case AscCommon.align_Right:
                return x2 + this.width_1px - this.width_padding - tm.width;
            case AscCommon.align_Justify:
            default:
                return x1 + this.width_padding;
        }
    };

    WorksheetView.prototype._calcTextVertPos = function (y1, y2, baseline, tm, valign) {
        switch (valign) {
            case Asc.c_oAscVAlign.Center:
                return asc_calcnpt(0.5 * (y1 + y2 - tm.height), this._getPPIY()) - this.height_1px; // ToDo возможно стоит тоже использовать 96
            case Asc.c_oAscVAlign.Top:
                return y1 - this.height_1px;
            default:
                return baseline - tm.baseline;
        }
    };

    WorksheetView.prototype._calcTextWidth = function (x1, x2, tm, halign) {
        switch (halign) {
            case AscCommon.align_Justify:
                return x2 + this.width_1px - this.width_padding * 2 - x1;
            default:
                return tm.width;
        }
    };

    // ----- Scrolling -----

    WorksheetView.prototype._calcCellPosition = function (c, r, dc, dr) {
        var t = this;
        var vr = t.visibleRange;

        function findNextCell(col, row, dx, dy) {
            var state = t._isCellEmptyText(col, row);
            var i = col + dx;
            var j = row + dy;
            while (i >= 0 && i < t.cols.length && j >= 0 && j < t.rows.length) {
                var newState = t._isCellEmptyText(i, j);
                if (newState !== state) {
                    var ret = {};
                    ret.col = state ? i : i - dx;
                    ret.row = state ? j : j - dy;
                    if (ret.col !== col || ret.row !== row || state) {
                        return ret;
                    }
                    state = newState;
                }
                i += dx;
                j += dy;
            }
            // Проверки для перехода в самый конец (ToDo пока убрал, чтобы не добавлять тормозов)
            /*if (i === t.cols.length && state)
             i = gc_nMaxCol;
             if (j === t.rows.length && state)
             j = gc_nMaxRow;*/
            return {col: i - dx, row: j - dy};
        }

        function findEnd(col, row) {
            var nc1, nc2 = col;
            do {
                nc1 = nc2;
                nc2 = findNextCell(nc1, row, +1, 0).col;
            } while (nc1 !== nc2);
            return nc2;
        }

        function findEOT() {
            var obr = t.objectRender ? t.objectRender.getMaxColRow() : new AscCommon.CellBase(-1, -1);
            var maxCols = t.model.getColsCount();
            var maxRows = t.model.getRowsCount();
            var lastC = -1, lastR = -1;

            for (var col = 0; col < maxCols; ++col) {
                for (var row = 0; row < maxRows; ++row) {
                    if (!t._isCellEmptyText(col, row)) {
                        lastC = Math.max(lastC, col);
                        lastR = Math.max(lastR, row);
                    }
                }
            }
            return {col: Math.max(lastC, obr.col), row: Math.max(lastR, obr.row)};
        }

        var eot = dc > +2.0001 && dc < +2.9999 && dr > +2.0001 && dr < +2.9999 ? findEOT() : null;

        var newCol = (function () {
            if (dc > +0.0001 && dc < +0.9999) {
                return c + (vr.c2 - vr.c1 + 1);
            }        // PageDown
            if (dc < -0.0001 && dc > -0.9999) {
                return c - (vr.c2 - vr.c1 + 1);
            }        // PageUp
            if (dc > +1.0001 && dc < +1.9999) {
                return findNextCell(c, r, +1, 0).col;
            }  // Ctrl + ->
            if (dc < -1.0001 && dc > -1.9999) {
                return findNextCell(c, r, -1, 0).col;
            }  // Ctrl + <-
            if (dc > +2.0001 && dc < +2.9999) {
                return !eot ? findEnd(c, r) : eot.col;
            }  // End
            if (dc < -2.0001 && dc > -2.9999) {
                return 0;
            }                              // Home
            return c + dc;
        })();
        var newRow = (function () {
            if (dr > +0.0001 && dr < +0.9999) {
                return r + (vr.r2 - vr.r1 + 1);
            }
            if (dr < -0.0001 && dr > -0.9999) {
                return r - (vr.r2 - vr.r1 + 1);
            }
            if (dr > +1.0001 && dr < +1.9999) {
                return findNextCell(c, r, 0, +1).row;
            }
            if (dr < -1.0001 && dr > -1.9999) {
                return findNextCell(c, r, 0, -1).row;
            }
            if (dr > +2.0001 && dr < +2.9999) {
                return !eot ? 0 : eot.row;
            }
            if (dr < -2.0001 && dr > -2.9999) {
                return 0;
            }
            return r + dr;
        })();

        if (newCol >= t.cols.length && newCol <= gc_nMaxCol0) {
            t.nColsCount = newCol + 1;
            t._calcWidthColumns(AscCommonExcel.recalcType.newLines);
        }
        if (newRow >= t.rows.length && newRow <= gc_nMaxRow0) {
            t.nRowsCount = newRow + 1;
            t._calcHeightRows(AscCommonExcel.recalcType.newLines);
        }

        return {
            col: newCol < 0 ? 0 : Math.min(newCol, t.cols.length - 1),
            row: newRow < 0 ? 0 : Math.min(newRow, t.rows.length - 1)
        };
    };

    WorksheetView.prototype._isColDrawnPartially = function (col, leftCol, diffWidth) {
        if (col <= leftCol || col >= this.nColsCount) {
            return false;
        }
        diffWidth = diffWidth ? diffWidth : 0;
        var c = this.cols;
        return c[col].left + c[col].width - c[leftCol].left + this.cellsLeft + diffWidth > this.drawingCtx.getWidth();
    };

    WorksheetView.prototype._isRowDrawnPartially = function (row, topRow, diffHeight) {
        if (row <= topRow || row >= this.nRowsCount) {
            return false;
        }
        diffHeight = diffHeight ? diffHeight : 0;
        var r = this.rows;
        return r[row].top + r[row].height - r[topRow].top + this.cellsTop + diffHeight > this.drawingCtx.getHeight();
    };

    WorksheetView.prototype._isVisibleX = function () {
        var vr = this.visibleRange;
        var c = this.cols;
        var x = c[vr.c2].left + c[vr.c2].width;
        var offsetFrozen = this.getFrozenPaneOffset(false, true);
        x += offsetFrozen.offsetX;
        return x - c[vr.c1].left + this.cellsLeft < this.drawingCtx.getWidth();
    };

    WorksheetView.prototype._isVisibleY = function () {
        var vr = this.visibleRange;
        var r = this.rows;
        var y = r[vr.r2].top + r[vr.r2].height;
        var offsetFrozen = this.getFrozenPaneOffset(true, false);
        y += offsetFrozen.offsetY;
        return y - r[vr.r1].top + this.cellsTop < this.drawingCtx.getHeight();
    };

    WorksheetView.prototype._updateVisibleRowsCount = function (skipScrollReinit) {
        var isUpdate = false;
        this._calcVisibleRows();
        while (this._isVisibleY() && !this.isMaxRow()) {
            // Добавим еще строки, чтоб не было видно фон под таблицей
            this.expandRowsOnScroll(true);
            this._calcVisibleRows();
            isUpdate = true;
        }
        if (!skipScrollReinit && isUpdate) {
            this.handlers.trigger("reinitializeScrollY");
        }
    };

    WorksheetView.prototype._updateVisibleColsCount = function (skipScrollReinit) {
        var isUpdate = false;
        this._calcVisibleColumns();
        while (this._isVisibleX() && !this.isMaxCol()) {
            // Добавим еще столбцы, чтоб не было видно фон под таблицей
            this.expandColsOnScroll(true);
            this._calcVisibleColumns();
            isUpdate = true;
        }
        if (!skipScrollReinit && isUpdate) {
            this.handlers.trigger("reinitializeScrollX");
        }
    };

    WorksheetView.prototype.isMaxRow = function () {
        var rowsCountCurrent = this.rows.length;
        if (gc_nMaxRow === rowsCountCurrent) {
            return true;
        }

        var rowsCount = this.model.getRowsCount() + 1;
        return rowsCount <= rowsCountCurrent && this.model.isDefaultHeightHidden();
    };

    WorksheetView.prototype.isMaxCol = function () {
        var colsCountCurrent = this.cols.length;
        if (gc_nMaxCol === colsCountCurrent) {
            return true;
        }

        var colsCount = this.model.getColsCount() + 1;
        return colsCount <= colsCountCurrent && this.model.isDefaultWidthHidden();
    };

    WorksheetView.prototype.scrollVertical = function (delta, editor) {
        var vr = this.visibleRange;
        var fixStartRow = new asc_Range(vr.c1, vr.r1, vr.c2, vr.r1);
        this._fixSelectionOfHiddenCells(0, delta >= 0 ? +1 : -1, fixStartRow);
        var start = this._calcCellPosition(vr.c1, fixStartRow.r1, 0, delta).row;
        fixStartRow.assign(vr.c1, start, vr.c2, start);
        this._fixSelectionOfHiddenCells(0, delta >= 0 ? +1 : -1, fixStartRow);
        this._fixVisibleRange(fixStartRow);
        var reinitScrollY = start !== fixStartRow.r1;
        // Для скролла вверх обычный сдвиг + дорисовка
        if (reinitScrollY && 0 > delta) {
            delta += fixStartRow.r1 - start;
        }
        start = fixStartRow.r1;

        if (start === vr.r1) {
            if (reinitScrollY) {
                this.handlers.trigger("reinitializeScrollY");
            }
            return this;
        }

        this.cleanSelection();
        this.cellCommentator.cleanSelectedComment();

        var ctx = this.drawingCtx;
        var ctxW = ctx.getWidth();
        var ctxH = ctx.getHeight();
        var offsetX, offsetY, diffWidth = 0, diffHeight = 0, cFrozen = 0, rFrozen = 0;
        if (this.topLeftFrozenCell) {
            cFrozen = this.topLeftFrozenCell.getCol0();
            rFrozen = this.topLeftFrozenCell.getRow0();
            diffWidth = this.cols[cFrozen].left - this.cols[0].left;
            diffHeight = this.rows[rFrozen].top - this.rows[0].top;
        }
        var oldVRE_isPartial = this._isRowDrawnPartially(vr.r2, vr.r1, diffHeight);
        var oldVR = vr.clone();
        var oldStart = vr.r1;
        var oldEnd = vr.r2;

        // ToDo стоит тут переделать весь scroll
        vr.r1 = start;
        this._updateVisibleRowsCount();
        // Это необходимо для того, чтобы строки, у которых высота по тексту, рассчитались
        if (!oldVR.intersectionSimple(vr)) {
            // Полностью обновилась область
            this._prepareCellTextMetricsCache(vr);
        } else {
            if (0 > delta) {
                // Идем вверх
                this._prepareCellTextMetricsCache(new asc_Range(vr.c1, start, vr.c2, oldStart - 1));
            } else {
                // Идем вниз
                this._prepareCellTextMetricsCache(new asc_Range(vr.c1, oldEnd + 1, vr.c2, vr.r2));
            }
        }

        var oldDec = Math.max(calcDecades(oldEnd + 1), 3);
        var oldW, x, dx;
        var dy = this.rows[start].top - this.rows[oldStart].top;
        var oldH = ctxH - this.cellsTop - Math.abs(dy) - diffHeight;
        var scrollDown = (dy > 0 && oldH > 0);
        var y = this.cellsTop + (scrollDown ? dy : 0) + diffHeight;
        var lastRowHeight = (scrollDown && oldVRE_isPartial) ?
        ctxH - (this.rows[oldEnd].top - this.rows[oldStart].top + this.cellsTop + diffHeight) : 0;

        if (this.isCellEditMode && editor && this.model.selectionRange.activeCell.row >= rFrozen) {
            editor.move(this.cellsLeft + (this.model.selectionRange.activeCell.col >= cFrozen ? diffWidth : 0),
              this.cellsTop + diffHeight, ctxW, ctxH);
        }

        var widthChanged = Math.max(calcDecades(vr.r2 + 1), 3) !== oldDec;
        if (widthChanged) {
            x = this.cellsLeft;
            this._calcHeaderColumnWidth();
            this._updateColumnPositions();
            this._calcVisibleColumns();
            this._drawCorner();
            this._cleanColumnHeadersRect();
            this._drawColumnHeaders(/*drawingCtx*/ undefined);

            dx = this.cellsLeft - x;
            oldW = ctxW - x - Math.abs(dx);

            if (rFrozen) {
                ctx.drawImage(ctx.getCanvas(), x, this.cellsTop, oldW, diffHeight, x + dx, this.cellsTop, oldW,
                  diffHeight);
                // ToDo Посмотреть с объектами!!!
            }
            this._drawFrozenPane(true);
        } else {
            dx = 0;
            x = this.headersLeft;
            oldW = ctxW;
        }

        // Перемещаем область
        var moveHeight = oldH - lastRowHeight;
        if (moveHeight > 0) {
            ctx.drawImage(ctx.getCanvas(), x, y, oldW, moveHeight, x + dx, y - dy, oldW, moveHeight);

            // Заглушка для safari (http://bugzilla.onlyoffice.com/show_bug.cgi?id=25546). Режим 'copy' сначала затирает, а
            // потом рисует (а т.к. мы рисуем сами на себе, то уже картинка будет пустой)
            if (AscBrowser.isSafari) {
                this.drawingGraphicCtx.moveImageDataSafari(x, y, oldW, moveHeight, x + dx, y - dy);
            } else {
                this.drawingGraphicCtx.moveImageData(x, y, oldW, moveHeight, x + dx, y - dy);
            }
        }
        // Очищаем область
        var clearTop = this.cellsTop + diffHeight + (scrollDown && moveHeight > 0 ? moveHeight : 0);
        var clearHeight = (moveHeight > 0) ? Math.abs(dy) + lastRowHeight : ctxH - (this.cellsTop + diffHeight);
        ctx.setFillStyle(this.settings.cells.defaultState.background)
          .fillRect(this.headersLeft, clearTop, ctxW, clearHeight);
        this.drawingGraphicCtx.clearRect(this.headersLeft, clearTop, ctxW, clearHeight);

        if (this.objectRender && this.objectRender.drawingArea) {
            this.objectRender.drawingArea.reinitRanges();
        }

        // Дорисовываем необходимое
        if (dy < 0 || vr.r2 !== oldEnd || oldVRE_isPartial || dx !== 0) {
            var r1, r2;
            if (moveHeight > 0) {
                if (scrollDown) {
                    r1 = oldEnd + (oldVRE_isPartial ? 0 : 1);
                    r2 = vr.r2;
                } else {
                    r1 = vr.r1;
                    r2 = vr.r1 - 1 - delta;
                }
            } else {
                r1 = vr.r1;
                r2 = vr.r2;
            }
            var range = new asc_Range(vr.c1, r1, vr.c2, r2);
            if (dx === 0) {
                this._drawRowHeaders(/*drawingCtx*/ undefined, r1, r2);
            } else {
                // redraw all headres, because number of decades in row index has been changed
                this._drawRowHeaders(/*drawingCtx*/ undefined);
                if (dx < 0) {
                    // draw last column
                    var r_;
                    var r1_ = r2 + 1;
                    var r2_ = vr.r2;
                    if (r2_ >= r1_) {
                        r_ = new asc_Range(vr.c2, r1_, vr.c2, r2_);
                        this._drawGrid(/*drawingCtx*/ undefined, r_);
                        this._drawCellsAndBorders(/*drawingCtx*/undefined, r_);
                    }
                    if (0 < rFrozen) {
                        r_ = new asc_Range(vr.c2, 0, vr.c2, rFrozen - 1);
                        offsetY = this.rows[0].top - this.cellsTop;
                        this._drawGrid(/*drawingCtx*/ undefined, r_, /*offsetXForDraw*/undefined, offsetY);
                        this._drawCellsAndBorders(/*drawingCtx*/undefined, r_, /*offsetXForDraw*/undefined, offsetY);
                    }
                }
            }
            offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft - diffWidth;
            offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop - diffHeight;
            this._drawGrid(/*drawingCtx*/ undefined, range);
            this._drawCellsAndBorders(/*drawingCtx*/undefined, range);
            this.af_drawButtons(range, offsetX, offsetY);
            this.objectRender.showDrawingObjectsEx(false,
              new AscFormat.GraphicOption(this, c_oAscGraphicOption.ScrollVertical, range, {
                  offsetX: offsetX, offsetY: offsetY
              }));
            if (0 < cFrozen) {
                range.c1 = 0;
                range.c2 = cFrozen - 1;
                offsetX = this.cols[0].left - this.cellsLeft;
                this._drawGrid(/*drawingCtx*/ undefined, range, offsetX);
                this._drawCellsAndBorders(/*drawingCtx*/undefined, range, offsetX);
                this.af_drawButtons(range, offsetX, offsetY);
                this.objectRender.showDrawingObjectsEx(false,
                  new AscFormat.GraphicOption(this, c_oAscGraphicOption.ScrollVertical, range, {
                      offsetX: offsetX, offsetY: offsetY
                  }));
            }
        }
        // Отрисовывать нужно всегда, вдруг бордеры
        this._drawFrozenPaneLines();
        this._fixSelectionOfMergedCells();
        this._drawSelection();

        if (widthChanged) {
            this.handlers.trigger("reinitializeScrollX");
        }


        if (reinitScrollY) {
            this.handlers.trigger("reinitializeScrollY");
        }

        this.handlers.trigger("onDocumentPlaceChanged");
        //ToDo this.drawDepCells();
        this.cellCommentator.updateCommentPosition();
        this.cellCommentator.drawCommentCells();
        return this;
    };

    WorksheetView.prototype.scrollHorizontal = function (delta, editor) {
        var vr = this.visibleRange;
        var fixStartCol = new asc_Range(vr.c1, vr.r1, vr.c1, vr.r2);
        this._fixSelectionOfHiddenCells(delta >= 0 ? +1 : -1, 0, fixStartCol);
        var start = this._calcCellPosition(fixStartCol.c1, vr.r1, delta, 0).col;
        fixStartCol.assign(start, vr.r1, start, vr.r2);
        this._fixSelectionOfHiddenCells(delta >= 0 ? +1 : -1, 0, fixStartCol);
        this._fixVisibleRange(fixStartCol);
        var reinitScrollX = start !== fixStartCol.c1;
        // Для скролла влево обычный сдвиг + дорисовка
        if (reinitScrollX && 0 > delta) {
            delta += fixStartCol.c1 - start;
        }
        start = fixStartCol.c1;

        if (start === vr.c1) {
            if (reinitScrollX) {
                this.handlers.trigger("reinitializeScrollX");
            }
            return this;
        }

        this.cleanSelection();
        this.cellCommentator.cleanSelectedComment();

        var ctx = this.drawingCtx;
        var ctxW = ctx.getWidth();
        var ctxH = ctx.getHeight();
        var dx = this.cols[start].left - this.cols[vr.c1].left;
        var oldStart = vr.c1;
        var oldEnd = vr.c2;
        var offsetX, offsetY, diffWidth = 0, diffHeight = 0;
        var oldW = ctxW - this.cellsLeft - Math.abs(dx);
        var scrollRight = (dx > 0 && oldW > 0);
        var x = this.cellsLeft + (scrollRight ? dx : 0);
        var y = this.headersTop;
        var cFrozen = 0, rFrozen = 0;
        if (this.topLeftFrozenCell) {
            rFrozen = this.topLeftFrozenCell.getRow0();
            cFrozen = this.topLeftFrozenCell.getCol0();
            diffWidth = this.cols[cFrozen].left - this.cols[0].left;
            diffHeight = this.rows[rFrozen].top - this.rows[0].top;
            x += diffWidth;
            oldW -= diffWidth;
        }
        var oldVCE_isPartial = this._isColDrawnPartially(vr.c2, vr.c1, diffWidth);
        var oldVR = vr.clone();

        // ToDo стоит тут переделать весь scroll
        vr.c1 = start;
        this._updateVisibleColsCount();
        // Это необходимо для того, чтобы строки, у которых высота по тексту, рассчитались
        if (!oldVR.intersectionSimple(vr)) {
            // Полностью обновилась область
            this._prepareCellTextMetricsCache(vr);
        } else {
            if (0 > delta) {
                // Идем влево
                this._prepareCellTextMetricsCache(new asc_Range(start, vr.r1, oldStart - 1, vr.r2));
            } else {
                // Идем вправо
                this._prepareCellTextMetricsCache(new asc_Range(oldEnd + 1, vr.r1, vr.c2, vr.r2));
            }
        }

        var lastColWidth = (scrollRight && oldVCE_isPartial) ?
        ctxW - (this.cols[oldEnd].left - this.cols[oldStart].left + this.cellsLeft + diffWidth) : 0;

        if (this.isCellEditMode && editor && this.model.selectionRange.activeCell.col >= cFrozen) {
            editor.move(this.cellsLeft + diffWidth,
              this.cellsTop + (this.model.selectionRange.activeCell.row >= rFrozen ? diffHeight : 0), ctxW, ctxH);
        }

        // Перемещаем область
        var moveWidth = oldW - lastColWidth;
        if (moveWidth > 0) {
            ctx.drawImage(ctx.getCanvas(), x, y, moveWidth, ctxH, x - dx, y, moveWidth, ctxH);

            // Заглушка для safari (http://bugzilla.onlyoffice.com/show_bug.cgi?id=25546). Режим 'copy' сначала затирает, а
            // потом рисует (а т.к. мы рисуем сами на себе, то уже картинка будет пустой)
            if (AscBrowser.isSafari) {
                this.drawingGraphicCtx.moveImageDataSafari(x, y, moveWidth, ctxH, x - dx, y);
            } else {
                this.drawingGraphicCtx.moveImageData(x, y, moveWidth, ctxH, x - dx, y);
            }
        }
        // Очищаем область
        var clearLeft = this.cellsLeft + diffWidth + (scrollRight && moveWidth > 0 ? moveWidth : 0);
        var clearWidth = (moveWidth > 0) ? Math.abs(dx) + lastColWidth : ctxW - (this.cellsLeft + diffWidth);
        ctx.setFillStyle(this.settings.cells.defaultState.background)
          .fillRect(clearLeft, y, clearWidth, ctxH);
        this.drawingGraphicCtx.clearRect(clearLeft, y, clearWidth, ctxH);

        if (this.objectRender && this.objectRender.drawingArea) {
            this.objectRender.drawingArea.reinitRanges();
        }

        // Дорисовываем необходимое
        if (dx < 0 || vr.c2 !== oldEnd || oldVCE_isPartial) {
            var c1, c2;
            if (moveWidth > 0) {
                if (scrollRight) {
                    c1 = oldEnd + (oldVCE_isPartial ? 0 : 1);
                    c2 = vr.c2;
                } else {
                    c1 = vr.c1;
                    c2 = vr.c1 - 1 - delta;
                }
            } else {
                c1 = vr.c1;
                c2 = vr.c2;
            }
            var range = new asc_Range(c1, vr.r1, c2, vr.r2);
            offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft - diffWidth;
            offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop - diffHeight;
            this._drawColumnHeaders(/*drawingCtx*/ undefined, c1, c2);
            this._drawGrid(/*drawingCtx*/ undefined, range);
            this._drawCellsAndBorders(/*drawingCtx*/undefined, range);
            this.af_drawButtons(range, offsetX, offsetY);
            this.objectRender.showDrawingObjectsEx(false,
              new AscFormat.GraphicOption(this, c_oAscGraphicOption.ScrollHorizontal, range, {
                  offsetX: offsetX, offsetY: offsetY
              }));
            if (rFrozen) {
                range.r1 = 0;
                range.r2 = rFrozen - 1;
                offsetY = this.rows[0].top - this.cellsTop;
                this._drawGrid(/*drawingCtx*/ undefined, range, undefined, offsetY);
                this._drawCellsAndBorders(/*drawingCtx*/undefined, range, undefined, offsetY);
                this.af_drawButtons(range, offsetX, offsetY);
                this.objectRender.showDrawingObjectsEx(false,
                  new AscFormat.GraphicOption(this, c_oAscGraphicOption.ScrollHorizontal, range, {
                      offsetX: offsetX, offsetY: offsetY
                  }));
            }
        }

        // Отрисовывать нужно всегда, вдруг бордеры
        this._drawFrozenPaneLines();
        this._fixSelectionOfMergedCells();
        this._drawSelection();

        if (reinitScrollX) {
            this.handlers.trigger("reinitializeScrollX");
        }

        this.handlers.trigger("onDocumentPlaceChanged");
        //ToDo this.drawDepCells();
        this.cellCommentator.updateCommentPosition();
        this.cellCommentator.drawCommentCells();
        return this;
    };

    // ----- Selection -----

    // x,y - абсолютные координаты относительно листа (без учета заголовков)
    WorksheetView.prototype.findCellByXY = function (x, y, canReturnNull, skipCol, skipRow) {
        var r = 0, c = 0, tmpRow, tmpCol, result = new AscFormat.CCellObjectInfo();
        if (canReturnNull) {
            result.col = result.row = null;
        }

        x += this.cellsLeft;
        y += this.cellsTop;
        if (!skipCol) {
            while (c < this.cols.length) {
                tmpCol = this.cols[c];
                if (x <= tmpCol.left + tmpCol.width) {
                    result.col = c;
                    break;
                }
                ++c;
            }

            if (null !== result.col) {
                result.colOff = x - this.cols[result.col].left;
            }
        }
        if (!skipRow) {
            while (r < this.rows.length) {
                tmpRow = this.rows[r];
                if (y <= tmpRow.top + tmpRow.height) {
                    result.row = r;
                    break;
                }
                ++r;
            }

            if (null !== result.row) {
                result.rowOff = y - this.rows[result.row].top;
            }
        }

        return result;
    };

	/**
     *
	 * @param x
	 * @param canReturnNull
	 * @param half - считать с половиной следующей ячейки
	 * @returns {*}
	 * @private
	 */
	WorksheetView.prototype._findColUnderCursor = function (x, canReturnNull, half) {
		var activeCellCol = half ? this._getSelection().activeCell.col : -1;
		var dx = 0;
		var c = this.visibleRange.c1;
		var offset = this.cols[c].left - this.cellsLeft;
		var c2, x1, x2, cFrozen, widthDiff = 0;
		if (x >= this.cellsLeft) {
			if (this.topLeftFrozenCell) {
				cFrozen = this.topLeftFrozenCell.getCol0();
				widthDiff = this.cols[cFrozen].left - this.cols[0].left;
				if (x < this.cellsLeft + widthDiff && 0 !== widthDiff) {
					c = 0;
					widthDiff = 0;
				}
			}
			for (x1 = this.cellsLeft + widthDiff, c2 = this.cols.length - 1; c <= c2; ++c, x1 = x2) {
				x2 = x1 + this.cols[c].width;
				dx = half ? this.cols[c].width / 2.0 * Math.sign(c - activeCellCol) : 0;
				if (x1 + dx > x) {
					if (c !== this.visibleRange.c1) {
						if (dx) {
							c -= 1;
							x2 = x1;
							x1 -= this.cols[c].width;
						}
						return {col: c, left: x1, right: x2};
					} else {
						c = c2;
						break;
					}
				} else if (x <= x2 + dx) {
					return {col: c, left: x1, right: x2};
				}
			}
			if (!canReturnNull) {
				x1 = this.cols[c2].left - offset;
				return {col: c2, left: x1, right: x1 + this.cols[c2].width};
			}
		} else {
			if (this.topLeftFrozenCell) {
				cFrozen = this.topLeftFrozenCell.getCol0();
				if (0 !== cFrozen) {
					c = 0;
					offset = this.cols[c].left - this.cellsLeft;
				}
			}
			for (x2 = this.cellsLeft + this.cols[c].width, c2 = 0; c >= c2; --c, x2 = x1) {
				x1 = this.cols[c].left - offset;
				if (x1 <= x && x < x2) {
					return {col: c, left: x1, right: x2};
				}
			}
			if (!canReturnNull) {
				return {col: c2, left: x1, right: x1 + this.cols[c2].width};
			}
		}
		return null;
	};

	/**
     *
	 * @param y
	 * @param canReturnNull
	 * @param half - считать с половиной следующей ячейки
	 * @returns {*}
	 * @private
	 */
	WorksheetView.prototype._findRowUnderCursor = function (y, canReturnNull, half) {
		var activeCellRow = half ? this._getSelection().activeCell.row : -1;
		var dy = 0;
		var r = this.visibleRange.r1;
		var offset = this.rows[r].top - this.cellsTop;
		var r2, y1, y2, rFrozen, heightDiff = 0;
		if (y >= this.cellsTop) {
			if (this.topLeftFrozenCell) {
				rFrozen = this.topLeftFrozenCell.getRow0();
				heightDiff = this.rows[rFrozen].top - this.rows[0].top;
				if (y < this.cellsTop + heightDiff && 0 !== heightDiff) {
					r = 0;
					heightDiff = 0;
				}
			}
			for (y1 = this.cellsTop + heightDiff, r2 = this.rows.length - 1; r <= r2; ++r, y1 = y2) {
				y2 = y1 + this.rows[r].height;
				dy = half ? this.rows[r].height / 2.0 * Math.sign(r - activeCellRow) : 0;
				if (y1 + dy > y) {
					if (r !== this.visibleRange.r1) {
						if (dy) {
							r -= 1;
							y2 = y1;
							y1 -= this.rows[r].height;
						}
						return {row: r, top: y1, bottom: y2};
					} else {
						r = r2;
						break;
					}
				} else if (y <= y2 + dy) {
					return {row: r, top: y1, bottom: y2};
				}
			}
			if (!canReturnNull) {
				y1 = this.rows[r2].top - offset;
				return {row: r2, top: y1, bottom: y1 + this.rows[r2].height};
			}
		} else {
			if (this.topLeftFrozenCell) {
				rFrozen = this.topLeftFrozenCell.getRow0();
				if (0 !== rFrozen) {
					r = 0;
					offset = this.rows[r].top - this.cellsTop;
				}
			}
			for (y2 = this.cellsTop + this.rows[r].height, r2 = 0; r >= r2; --r, y2 = y1) {
				y1 = this.rows[r].top - offset;
				if (y1 <= y && y < y2) {
					return {row: r, top: y1, bottom: y2};
				}
			}
			if (!canReturnNull) {
				return {row: r2, top: y1, bottom: y1 + this.rows[r2].height};
			}
		}
		return null;
	};

    WorksheetView.prototype._hitResizeCorner = function (x1, y1, x2, y2) {
        var wEps = this.width_1px * AscCommon.global_mouseEvent.KoefPixToMM, hEps = this.height_1px * AscCommon.global_mouseEvent.KoefPixToMM;
        return Math.abs(x2 - x1) <= wEps + this.width_2px && Math.abs(y2 - y1) <= hEps + this.height_2px;
    };
    WorksheetView.prototype._hitInRange = function (range, rangeType, vr, x, y, offsetX, offsetY) {
        var wEps = this.width_2px * AscCommon.global_mouseEvent.KoefPixToMM, hEps = this.height_2px * AscCommon.global_mouseEvent.KoefPixToMM;
        var cursor, x1, x2, y1, y2, isResize;
        var col = -1, row = -1;

        var oFormulaRangeIn = range.intersectionSimple(vr);
        if (oFormulaRangeIn) {
            x1 = this.cols[oFormulaRangeIn.c1].left - offsetX;
            x2 = this.cols[oFormulaRangeIn.c2].left + this.cols[oFormulaRangeIn.c2].width - offsetX;
            y1 = this.rows[oFormulaRangeIn.r1].top - offsetY;
            y2 = this.rows[oFormulaRangeIn.r2].top + this.rows[oFormulaRangeIn.r2].height - offsetY;

            isResize = AscCommonExcel.selectionLineType.Resize & rangeType;

            if (isResize && this._hitResizeCorner(x1 - this.width_1px, y1 - this.height_1px, x, y)) {
                /*TOP-LEFT*/
                cursor = kCurSEResize;
                col = range.c2;
                row = range.r2;
            } else if (isResize && this._hitResizeCorner(x2, y1 - this.height_1px, x, y)) {
                /*TOP-RIGHT*/
                cursor = kCurNEResize;
                col = range.c1;
                row = range.r2;
            } else if (isResize && this._hitResizeCorner(x1 - this.width_1px, y2, x, y)) {
                /*BOTTOM-LEFT*/
                cursor = kCurNEResize;
                col = range.c2;
                row = range.r1;
            } else if (this._hitResizeCorner(x2, y2, x, y)) {
                /*BOTTOM-RIGHT*/
                cursor = kCurSEResize;
                col = range.c1;
                row = range.r1;
            } else if ((((range.c1 === oFormulaRangeIn.c1 && Math.abs(x - x1) <= wEps) ||
              (range.c2 === oFormulaRangeIn.c2 && Math.abs(x - x2) <= wEps)) && hEps <= y - y1 && y - y2 <= hEps) ||
              (((range.r1 === oFormulaRangeIn.r1 && Math.abs(y - y1) <= hEps) ||
              (range.r2 === oFormulaRangeIn.r2 && Math.abs(y - y2) <= hEps)) && wEps <= x - x1 && x - x2 <= wEps)) {
                cursor = kCurMove;
            }
        }

        return cursor ? {
            cursor: cursor, col: col, row: row
        } : null;
    };

    WorksheetView.prototype._hitCursorSelectionRange = function (vr, x, y, offsetX, offsetY) {
        var res = this._hitInRange(this.model.selectionRange.getLast(),
          AscCommonExcel.selectionLineType.Selection | AscCommonExcel.selectionLineType.ActiveCell |
          AscCommonExcel.selectionLineType.Promote, vr, x, y, offsetX, offsetY);
        return res ? {
            cursor: kCurMove === res.cursor ? kCurMove : kCurFillHandle,
            target: kCurMove === res.cursor ? c_oTargetType.MoveRange : c_oTargetType.FillHandle,
            col: -1,
            row: -1
        } : null;
    };

    WorksheetView.prototype._hitCursorFormulaOrChart = function (vr, x, y, offsetX, offsetY) {
        var i, l, res;
        var oFormulaRange;
        var arrRanges = this.isFormulaEditMode ? this.arrActiveFormulaRanges : this.arrActiveChartRanges;
        var targetArr = this.isFormulaEditMode ? 0 : -1;

        for (i = 0, l = arrRanges.length; i < l; ++i) {
            oFormulaRange = arrRanges[i].getLast();
            res = !oFormulaRange.isName &&
              this._hitInRange(oFormulaRange, AscCommonExcel.selectionLineType.Resize, vr, x, y, offsetX, offsetY);
            if (res) {
                break;
            }
        }
        return res ? {
            cursor: res.cursor,
            target: c_oTargetType.MoveResizeRange,
            col: res.col,
            row: res.row,
            formulaRange: oFormulaRange,
            indexFormulaRange: i,
            targetArr: targetArr
        } : null;
    };

    WorksheetView.prototype.getCursorTypeFromXY = function (x, y, isViewerMode) {
        var res, c, r, f, i, offsetX, offsetY, cellCursor;
        var sheetId = this.model.getId(), userId, lockRangePosLeft, lockRangePosTop, lockInfo, oHyperlink;
        var widthDiff = 0, heightDiff = 0, isLocked = false, target = c_oTargetType.Cells, row = -1, col = -1, isSelGraphicObject, isNotFirst;

        var frozenCursor = this._isFrozenAnchor(x, y);
        if (!isViewerMode && frozenCursor.result) {
            lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, null, sheetId,
              AscCommonExcel.c_oAscLockNameFrozenPane);
            isLocked = this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, false);
            if (false !== isLocked) {
                // Кто-то сделал lock
                var frozenCell = this.topLeftFrozenCell ? this.topLeftFrozenCell : new AscCommon.CellAddress(0, 0, 0);
                userId = isLocked.UserId;
                lockRangePosLeft = this.getCellLeft(frozenCell.getCol0(), 0);
                lockRangePosTop = this.getCellTop(frozenCell.getRow0(), 0);
            }
            return {
                cursor: frozenCursor.cursor,
                target: frozenCursor.name,
                col: -1,
                row: -1,
                userId: userId,
                lockRangePosLeft: lockRangePosLeft,
                lockRangePosTop: lockRangePosTop
            };
        }

        var drawingInfo = this.objectRender.checkCursorDrawingObject(x, y);
        if (asc["editor"].isStartAddShape &&
          AscCommonExcel.CheckIdSatetShapeAdd(this.objectRender.controller.curState)) {
            return {cursor: kCurFillHandle, target: c_oTargetType.Shape, col: -1, row: -1};
        }

        if (drawingInfo && drawingInfo.id) {
            // Возможно картинка с lock
            lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, null, sheetId, drawingInfo.id);
            isLocked = this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, false);
            if (false !== isLocked) {
                // Кто-то сделал lock
                userId = isLocked.UserId;
                lockRangePosLeft = drawingInfo.object.getVisibleLeftOffset(true);
                lockRangePosTop = drawingInfo.object.getVisibleTopOffset(true);
            }

            if (drawingInfo.hyperlink instanceof ParaHyperlink) {
                oHyperlink = new AscCommonExcel.Hyperlink();
                oHyperlink.Tooltip = drawingInfo.hyperlink.ToolTip;
                var spl = drawingInfo.hyperlink.Value.split("!");
                if (spl.length === 2) {
                    oHyperlink.setLocation(drawingInfo.hyperlink.Value);
                } else {
                    oHyperlink.Hyperlink = drawingInfo.hyperlink.Value;
                }

                cellCursor =
                {cursor: drawingInfo.cursor, target: c_oTargetType.Cells, col: -1, row: -1, userId: userId};
                return {
                    cursor: kCurHyperlink,
                    target: c_oTargetType.Hyperlink,
                    hyperlink: new asc_CHyperlink(oHyperlink),
                    cellCursor: cellCursor,
                    userId: userId
                };
            }

            return {
                cursor: drawingInfo.cursor,
                target: c_oTargetType.Shape,
                drawingId: drawingInfo.id,
                col: -1,
                row: -1,
                userId: userId,
                lockRangePosLeft: lockRangePosLeft,
                lockRangePosTop: lockRangePosTop
            };
        }

        x *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIX());
        y *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIY());

        var oResDefault = {cursor: kCurDefault, target: c_oTargetType.None, col: -1, row: -1};
        if (x < this.cellsLeft && y < this.cellsTop) {
            return {cursor: kCurCorner, target: c_oTargetType.Corner, col: -1, row: -1};
        }

        var cFrozen = -1, rFrozen = -1;
        offsetX = this.cols[this.visibleRange.c1].left - this.cellsLeft;
        offsetY = this.rows[this.visibleRange.r1].top - this.cellsTop;
        if (this.topLeftFrozenCell) {
            cFrozen = this.topLeftFrozenCell.getCol0();
            rFrozen = this.topLeftFrozenCell.getRow0();
            widthDiff = this.cols[cFrozen].left - this.cols[0].left;
            heightDiff = this.rows[rFrozen].top - this.rows[0].top;

            offsetX = (x < this.cellsLeft + widthDiff) ? 0 : offsetX - widthDiff;
            offsetY = (y < this.cellsTop + heightDiff) ? 0 : offsetY - heightDiff;
        }

        var epsChangeSize = 3 * AscCommon.global_mouseEvent.KoefPixToMM;
        if (x <= this.cellsLeft && y >= this.cellsTop) {
            r = this._findRowUnderCursor(y, true);
            if (r === null) {
                return oResDefault;
            }
            isNotFirst = (r.row !== (-1 !== rFrozen ? 0 : this.visibleRange.r1));
            f = !isViewerMode && (isNotFirst && y < r.top + epsChangeSize || y >= r.bottom - epsChangeSize);
            // ToDo В Excel зависимость epsilon от размера ячейки (у нас фиксированный 3)
            return {
                cursor: f ? kCurRowResize : kCurRowSelect,
                target: f ? c_oTargetType.RowResize : c_oTargetType.RowHeader,
                col: -1,
                row: r.row + (isNotFirst && f && y < r.top + 3 ? -1 : 0),
                mouseY: f ? ((y < r.top + 3) ? (r.top - y - this.height_1px) : (r.bottom - y - this.height_1px)) : null
            };
        }
        if (y <= this.cellsTop && x >= this.cellsLeft) {
            c = this._findColUnderCursor(x, true);
            if (c === null) {
                return oResDefault;
            }
            isNotFirst = c.col !== (-1 !== cFrozen ? 0 : this.visibleRange.c1);
            f = !isViewerMode && (isNotFirst && x < c.left + epsChangeSize || x >= c.right - epsChangeSize);
            // ToDo В Excel зависимость epsilon от размера ячейки (у нас фиксированный 3)
            return {
                cursor: f ? kCurColResize : kCurColSelect,
                target: f ? c_oTargetType.ColumnResize : c_oTargetType.ColumnHeader,
                col: c.col + (isNotFirst && f && x < c.left + 3 ? -1 : 0),
                row: -1,
                mouseX: f ? ((x < c.left + 3) ? (c.left - x - this.width_1px) : (c.right - x - this.width_1px)) : null
            };
        }

        if (this.stateFormatPainter) {
            if (x <= this.cellsLeft && y >= this.cellsTop) {
                r = this._findRowUnderCursor(y, true);
                if (r !== null) {
                    target = c_oTargetType.RowHeader;
                    row = r.row;
                }
            }
            if (y <= this.cellsTop && x >= this.cellsLeft) {
                c = this._findColUnderCursor(x, true);
                if (c !== null) {
                    target = c_oTargetType.ColumnHeader;
                    col = c.col;
                }
            }
            return {cursor: kCurFormatPainterExcel, target: target, col: col, row: row};
        }

        if (this.isFormulaEditMode || this.isChartAreaEditMode) {
            this._drawElements(function (_vr, _offsetX, _offsetY) {
                return (null === (res = this._hitCursorFormulaOrChart(_vr, x, y, _offsetX, _offsetY)));
            });
            if (res) {
                return res;
            }
        }

        isSelGraphicObject = this.objectRender.selectedGraphicObjectsExists();
        if (!isViewerMode && !isSelGraphicObject && this.model.selectionRange.isSingleRange()) {
            this._drawElements(function (_vr, _offsetX, _offsetY) {
                return (null === (res = this._hitCursorSelectionRange(_vr, x, y, _offsetX, _offsetY)));
            });
            if (res) {
                return res;
            }
        }

        if (x > this.cellsLeft && y > this.cellsTop) {
            c = this._findColUnderCursor(x, true);
            r = this._findRowUnderCursor(y, true);
            if (c === null || r === null) {
                return oResDefault;
            }

            // Проверка на совместное редактирование
            var lockRange = undefined;
            var lockAllPosLeft = undefined;
            var lockAllPosTop = undefined;
            var userIdAllProps = undefined;
            var userIdAllSheet = undefined;
            if (!isViewerMode && this.collaborativeEditing.getCollaborativeEditing()) {
                var c1Recalc = null, r1Recalc = null;
                var selectRangeRecalc = new asc_Range(c.col, r.row, c.col, r.row);
                // Пересчет для входящих ячеек в добавленные строки/столбцы
                var isIntersection = this._recalcRangeByInsertRowsAndColumns(sheetId, selectRangeRecalc);
                if (false === isIntersection) {
                    lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, /*subType*/null, sheetId,
                      new AscCommonExcel.asc_CCollaborativeRange(selectRangeRecalc.c1, selectRangeRecalc.r1, selectRangeRecalc.c2, selectRangeRecalc.r2));
                    isLocked = this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther,
                      /*bCheckOnlyLockAll*/false);
                    if (false !== isLocked) {
                        // Кто-то сделал lock
                        userId = isLocked.UserId;
                        lockRange = isLocked.Element["rangeOrObjectId"];

                        c1Recalc =
                          this.collaborativeEditing.m_oRecalcIndexColumns[sheetId].getLockOther(lockRange["c1"],
                            c_oAscLockTypes.kLockTypeOther);
                        r1Recalc = this.collaborativeEditing.m_oRecalcIndexRows[sheetId].getLockOther(lockRange["r1"],
                          c_oAscLockTypes.kLockTypeOther);
                        if (null !== c1Recalc && null !== r1Recalc) {
                            lockRangePosLeft = this.getCellLeft(c1Recalc, /*pt*/1);
                            lockRangePosTop = this.getCellTop(r1Recalc, /*pt*/1);
                            // Пересчитываем X и Y относительно видимой области
                            lockRangePosLeft -= offsetX;
                            lockRangePosTop -= offsetY;
                            // Пересчитываем в px
                            lockRangePosLeft *= asc_getcvt(1/*pt*/, 0/*px*/, this._getPPIX());
                            lockRangePosTop *= asc_getcvt(1/*pt*/, 0/*px*/, this._getPPIY());
                        }
                    }
                } else {
                    lockInfo =
                      this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, /*subType*/null, sheetId, null);
                }
                // Проверим не удален ли весь лист (именно удален, т.к. если просто залочен, то не рисуем рамку вокруг)
                lockInfo["type"] = c_oAscLockTypeElem.Sheet;
                isLocked = this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther,
                  /*bCheckOnlyLockAll*/true);
                if (false !== isLocked) {
                    // Кто-то сделал lock
                    userIdAllSheet = isLocked.UserId;
                    lockAllPosLeft = this.cellsLeft * asc_getcvt(1/*pt*/, 0/*px*/, this._getPPIX());
                    lockAllPosTop = this.cellsTop * asc_getcvt(1/*pt*/, 0/*px*/, this._getPPIY());
                }

                // Проверим не залочены ли все свойства листа (только если не удален весь лист)
                if (undefined === userIdAllSheet) {
                    lockInfo["type"] = c_oAscLockTypeElem.Range;
                    lockInfo["subType"] = c_oAscLockTypeElemSubType.InsertRows;
                    isLocked = this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther,
                      /*bCheckOnlyLockAll*/true);
                    if (false !== isLocked) {
                        // Кто-то сделал lock
                        userIdAllProps = isLocked.UserId;

                        lockAllPosLeft = this.cellsLeft * asc_getcvt(1/*pt*/, 0/*px*/, this._getPPIX());
                        lockAllPosTop = this.cellsTop * asc_getcvt(1/*pt*/, 0/*px*/, this._getPPIY());
                    }
                }
            }

            var autoFilterInfo = this.af_checkCursor(x, y, offsetX, offsetY, {
                cFrozen: cFrozen, rFrozen: rFrozen
            }, r, c);
            if (autoFilterInfo && !isViewerMode) {
                return {
                    cursor: kCurAutoFilter,
                    target: c_oTargetType.FilterObject,
                    col: -1,
                    row: -1,
                    idFilter: autoFilterInfo.id
                };
            }

            // Проверим есть ли комменты
            var comments = this.cellCommentator.getComments(c.col, r.row);
            var coords = undefined;
            var indexes = undefined;

            if (0 < comments.length) {
                indexes = [];
                for (i = 0; i < comments.length; ++i) {
                    indexes.push(comments[i].asc_getId());
                }
                coords = this.cellCommentator.getCommentsCoords(comments);
            }

            // Проверим, может мы в гиперлинке
            oHyperlink = this.model.getHyperlinkByCell(r.row, c.col);
            cellCursor = {
                cursor: kCurCells,
                target: c_oTargetType.Cells,
                col: (c ? c.col : -1),
                row: (r ? r.row : -1),
                userId: userId,
                lockRangePosLeft: lockRangePosLeft,
                lockRangePosTop: lockRangePosTop,
                userIdAllProps: userIdAllProps,
                lockAllPosLeft: lockAllPosLeft,
                lockAllPosTop: lockAllPosTop,
                userIdAllSheet: userIdAllSheet,
                commentIndexes: indexes,
                commentCoords: coords
            };
            if (null !== oHyperlink) {
                return {
                    cursor: kCurHyperlink,
                    target: c_oTargetType.Hyperlink,
                    hyperlink: new asc_CHyperlink(oHyperlink),
                    cellCursor: cellCursor,
                    userId: userId,
                    lockRangePosLeft: lockRangePosLeft,
                    lockRangePosTop: lockRangePosTop,
                    userIdAllProps: userIdAllProps,
                    userIdAllSheet: userIdAllSheet,
                    lockAllPosLeft: lockAllPosLeft,
                    lockAllPosTop: lockAllPosTop,
                    commentIndexes: indexes,
                    commentCoords: coords
                };
            }
            return cellCursor;
        }

        return oResDefault;
    };

    WorksheetView.prototype._fixSelectionOfMergedCells = function (fixedRange) {
        var tmpSelection = this._getSelection();
        var ar = fixedRange ? fixedRange : (tmpSelection ? tmpSelection.getLast() : null);
        if (!ar) {
            return;
        }

        if (ar.type && ar.type !== c_oAscSelectionType.RangeCells) {
            return;
        }

        // ToDo - переделать этот момент!!!!
        var res = this.model.expandRangeByMerged(ar.clone(true));

        if (ar.c1 !== res.c1 && ar.c1 !== res.c2) {
            ar.c1 = ar.c1 <= ar.c2 ? res.c1 : res.c2;
        }
        ar.c2 = ar.c1 === res.c1 ? res.c2 : (res.c1);
        if (ar.r1 !== res.r1 && ar.r1 !== res.r2) {
            ar.r1 = ar.r1 <= ar.r2 ? res.r1 : res.r2;
        }
        ar.r2 = ar.r1 === res.r1 ? res.r2 : res.r1;
        ar.normalize();
        if (!fixedRange) {
            tmpSelection.update();
        }
    };

    WorksheetView.prototype._findVisibleCol = function (from, dc, flag) {
        var to = dc < 0 ? -1 : this.cols.length, c;
        for (c = from; c !== to; c += dc) {
            if (this.cols[c].width > this.width_1px) {
                return c;
            }
        }
        return flag ? -1 : this._findVisibleCol(from, dc * -1, true);
    };
    WorksheetView.prototype._findVisibleRow = function (from, dr, flag) {
        var to = dr < 0 ? -1 : this.rows.length, r;
        for (r = from; r !== to; r += dr) {
            if (this.rows[r].height > this.height_1px) {
                return r;
            }
        }
        return flag ? -1 : this._findVisibleRow(from, dr * -1, true);
    };

    WorksheetView.prototype._fixSelectionOfHiddenCells = function (dc, dr, range) {
        var ar = (range) ? range : this.model.selectionRange.getLast(), c1, c2, r1, r2, mc, i, arn = ar.clone(true);

        if (dc === undefined) {
            dc = +1;
        }
        if (dr === undefined) {
            dr = +1;
        }

        if (ar.c2 === ar.c1) {
            if (this.cols[ar.c1].width < this.width_1px) {
                c1 = c2 = this._findVisibleCol(ar.c1, dc);
            }
        } else {
            if (0 !== dc && this.nColsCount > ar.c2 && this.cols[ar.c2].width < this.width_1px) {
                // Проверка для одновременно замерженных и скрытых ячеек (A1:C1 merge, B:C hidden)
                for (mc = null, i = arn.r1; i <= arn.r2; ++i) {
                    mc = this.model.getMergedByCell(i, ar.c2);
                    if (mc) {
                        break;
                    }
                }
                if (!mc) {
                    c2 = this._findVisibleCol(ar.c2, dc);
                }
            }
        }
        if (c1 < 0 || c2 < 0) {
            throw "Error: all columns are hidden";
        }

        if (ar.r2 === ar.r1) {
            if (this.rows[ar.r1].height < this.height_1px) {
                r1 = r2 = this._findVisibleRow(ar.r1, dr);
            }
        } else {
            if (0 !== dr && this.nRowsCount > ar.r2 && this.rows[ar.r2].height < this.height_1px) {
                //Проверка для одновременно замерженных и скрытых ячеек (A1:A3 merge, 2:3 hidden)
                for (mc = null, i = arn.c1; i <= arn.c2; ++i) {
                    mc = this.model.getMergedByCell(ar.r2, i);
                    if (mc) {
                        break;
                    }
                }
                if (!mc) {
                    r2 = this._findVisibleRow(ar.r2, dr);
                }
            }
        }
        if (r1 < 0 || r2 < 0) {
            throw "Error: all rows are hidden";
        }

        ar.assign(c1 !== undefined ? c1 : ar.c1, r1 !== undefined ? r1 : ar.r1, c2 !== undefined ? c2 : ar.c2,
          r2 !== undefined ? r2 : ar.r2);
    };

    WorksheetView.prototype._moveActiveCellToXY = function (x, y) {
        var c, r;
        var ar = this._getSelection().getLast();

        x *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIX());
        y *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIY());

        if (x < this.cellsLeft && y < this.cellsTop) {
            ar.assign(0, 0, this.cols.length - 1, this.rows.length - 1);
            ar.type = c_oAscSelectionType.RangeMax;
            //ar.startCol = 0;
            //ar.startRow = 0;
            this.model.selectionRange.setCell(0, 0);
            this._fixSelectionOfHiddenCells();
        } else if (x < this.cellsLeft) {
            r = this._findRowUnderCursor(y).row;
            ar.assign(0, r, this.cols.length - 1, r);
            ar.type = c_oAscSelectionType.RangeRow;
            //ar.startCol = 0;
            //ar.startRow = r;
            this.model.selectionRange.setCell(r, 0);
            this._fixSelectionOfHiddenCells();
        } else if (y < this.cellsTop) {
            c = this._findColUnderCursor(x).col;
            ar.assign(c, 0, c, this.rows.length - 1);
            ar.type = c_oAscSelectionType.RangeCol;
            //ar.startCol = c;
            //ar.startRow = 0;
            this._fixSelectionOfHiddenCells();
            this.model.selectionRange.setCell(0, c);
        } else {
            c = this._findColUnderCursor(x).col;
            r = this._findRowUnderCursor(y).row;
            ar.assign(c, r, c, r);
            //ar.startCol = c;
            //ar.startRow = r;
            ar.type = c_oAscSelectionType.RangeCells;
            this.model.selectionRange.setCell(r, c);
            this._fixSelectionOfMergedCells();
        }
    };

    WorksheetView.prototype._moveActiveCellToOffset = function (dc, dr) {
        var tmpSelection = this._getSelection();
        var ar = tmpSelection.getLast();
        var activeCell = tmpSelection.activeCell;
        var mc = this.model.getMergedByCell(activeCell.row, activeCell.col);
        var c = mc ? (dc < 0 ? mc.c1 : dc > 0 ? Math.min(mc.c2, this.nColsCount - 1 - dc) : activeCell.col) :
          activeCell.col;
        var r = mc ? (dr < 0 ? mc.r1 : dr > 0 ? Math.min(mc.r2, this.nRowsCount - 1 - dr) : activeCell.row) :
          activeCell.row;
        var p = this._calcCellPosition(c, r, dc, dr);
        ar.assign(p.col, p.row, p.col, p.row);
        ar.type = c_oAscSelectionType.RangeCells;
        this.model.selectionRange.setCell(p.row, p.col);
        this._fixSelectionOfHiddenCells(dc >= 0 ? +1 : -1, dr >= 0 ? +1 : -1);
        this._fixSelectionOfMergedCells();
    };

    // Движение активной ячейки в выделенной области
    WorksheetView.prototype._moveActivePointInSelection = function (dc, dr) {
        var t = this, cell = this.model.selectionRange.activeCell;

        // Если мы на скрытой строке или ячейке, то двигаться в выделении нельзя (так делает и Excel)
        if (this.width_1px > this.cols[cell.col].width || this.height_1px > this.rows[cell.row].height) {
            return;
        }
        return this.model.selectionRange.offsetCell(dr, dc, function (row, col) {
            return (0 <= row) ? (t.rows[row].height < t.height_1px) : (t.cols[col].width < t.width_1px);
        });
    };

	WorksheetView.prototype._calcSelectionEndPointByXY = function (x, y) {
		var tmpSelection = this._getSelection();
		var ar = tmpSelection.getLast();
		x *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIX());
		y *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIY());

		var res = new asc_Range(tmpSelection.activeCell.col, tmpSelection.activeCell.row, this._findColUnderCursor(x,
			false, this.settings.halfSelection).col, this._findRowUnderCursor(y, false,
			this.settings.halfSelection).row, true);
		if (ar.type === c_oAscSelectionType.RangeCells) {
			this._fixSelectionOfMergedCells(res);
		}
		return res;
	};

    WorksheetView.prototype._calcSelectionEndPointByOffset = function (dc, dr) {
        var tmpSelection = this._getSelection();
        var ar = tmpSelection.getLast();
        var c1, r1, c2, r2, tmp;
        tmp = asc.getEndValueRange(dc, tmpSelection.activeCell.col, ar.c1, ar.c2);
        c1 = tmp.x1;
        c2 = tmp.x2;
        tmp = asc.getEndValueRange(dr, tmpSelection.activeCell.row, ar.r1, ar.r2);
        r1 = tmp.x1;
        r2 = tmp.x2;

        var p1 = this._calcCellPosition(c2, r2, dc, dr), p2;
        var res = new asc_Range(c1, r1, c2 = p1.col, r2 = p1.row, true);
        dc = Math.sign(dc);
        dr = Math.sign(dr);
        if (c_oAscSelectionType.RangeCells === ar.type) {
            this._fixSelectionOfMergedCells(res);
            while (ar.isEqual(res)) {
                p2 = this._calcCellPosition(c2, r2, dc, dr);
                res.assign(c1, r1, c2 = p2.col, r2 = p2.row, true);
                this._fixSelectionOfMergedCells(res);
                if (p1.c2 === p2.c2 && p1.r2 === p2.r2) {
                    break;
                }
                p1 = p2;
            }
        }
        var bIsHidden = false;
        if (0 !== dc && this.cols[c2].width < this.width_1px) {
            c2 = this._findVisibleCol(c2, dc);
            bIsHidden = true;
        }
        if (0 !== dr && this.rows[r2].height < this.height_1px) {
            r2 = this._findVisibleRow(r2, dr);
            bIsHidden = true;
        }
        if (bIsHidden) {
            res.assign(c1, r1, c2, r2, true);
        }
        return res;
    };

    WorksheetView.prototype._calcActiveRangeOffsetIsCoord = function (x, y) {
        var ar = this._getSelection().getLast();
        if (this.isFormulaEditMode) {
            // Для формул нужно сделать ограничение по range (у нас хранится полный диапазон)
            if (ar.c2 >= this.nColsCount || ar.r2 >= this.nRowsCount) {
                ar = ar.clone(true);
                ar.c2 = (ar.c2 >= this.nColsCount) ? this.nColsCount - 1 : ar.c2;
                ar.r2 = (ar.r2 >= this.nRowsCount) ? this.nRowsCount - 1 : ar.r2;
            }
        }

        x *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIX());
        y *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIY());

        var d = {};

        if (y <= this.cellsTop + this.height_2px /*+ offsetFrozen.offsetY*/) {
            d.deltaY = -1;
        } else if (y >= this.drawingCtx.getHeight() - this.height_2px) {
            d.deltaY = 1;
        }

        if (x <= this.cellsLeft + this.width_2px /*+ offsetFrozen.offsetX*/) {
            d.deltaX = -1;
        } else if (x >= this.drawingCtx.getWidth() - this.width_2px) {
            d.deltaX = 1;
        }

        if (ar.type === c_oAscSelectionType.RangeRow) {
            d.deltaX = 0;
        } else if (ar.type === c_oAscSelectionType.RangeCol) {
            d.deltaY = 0;
        } else if (ar.type === c_oAscSelectionType.RangeMax) {
            d.deltaX = 0;
            d.deltaY = 0;
        }

        return d;
    };

    WorksheetView.prototype._calcActiveRangeOffset = function () {
        var vr = this.visibleRange;
        var ar = this._getSelection().getLast();
        if (this.isFormulaEditMode) {
            // Для формул нужно сделать ограничение по range (у нас хранится полный диапазон)
            if (ar.c2 >= this.nColsCount || ar.r2 >= this.nRowsCount) {
                ar = ar.clone(true);
                ar.c2 = (ar.c2 >= this.nColsCount) ? this.nColsCount - 1 : ar.c2;
                ar.r2 = (ar.r2 >= this.nRowsCount) ? this.nRowsCount - 1 : ar.r2;
            }
        }
        var arn = ar.clone(true);
        var isMC = this._isMergedCells(arn);
        var adjustRight = ar.c2 >= vr.c2 || ar.c1 >= vr.c2 && isMC;
        var adjustBottom = ar.r2 >= vr.r2 || ar.r1 >= vr.r2 && isMC;
        var incX = ar.c1 < vr.c1 && isMC ? arn.c1 - vr.c1 : ar.c2 < vr.c1 ? ar.c2 - vr.c1 : 0;
        var incY = ar.r1 < vr.r1 && isMC ? arn.r1 - vr.r1 : ar.r2 < vr.r1 ? ar.r2 - vr.r1 : 0;

        var offsetFrozen = this.getFrozenPaneOffset();

        if (adjustRight) {
            while (this._isColDrawnPartially(isMC ? arn.c2 : ar.c2, vr.c1 + incX, offsetFrozen.offsetX)) {
                ++incX;
            }
        }
        if (adjustBottom) {
            while (this._isRowDrawnPartially(isMC ? arn.r2 : ar.r2, vr.r1 + incY, offsetFrozen.offsetY)) {
                ++incY;
            }
        }
        return {
            deltaX: ar.type === c_oAscSelectionType.RangeCol || ar.type === c_oAscSelectionType.RangeCells ? incX : 0,
            deltaY: ar.type === c_oAscSelectionType.RangeRow || ar.type === c_oAscSelectionType.RangeCells ? incY : 0
        };
    };

    /**
     * @param {Range} [range]
     * @returns {{deltaX: number, deltaY: number}}
     */
    WorksheetView.prototype._calcActiveCellOffset = function (range) {
        var vr = this.visibleRange;
        var activeCell = this.model.selectionRange.activeCell;
        var ar = range ? range : this.model.selectionRange.getLast();
        var mc = this.model.getMergedByCell(activeCell.row, activeCell.col);
        var startCol = mc ? mc.c1 : activeCell.col;
        var startRow = mc ? mc.r1 : activeCell.row;
        var incX = startCol < vr.c1 ? startCol - vr.c1 : 0;
        var incY = startRow < vr.r1 ? startRow - vr.r1 : 0;

        var offsetFrozen = this.getFrozenPaneOffset();
        // adjustRight
        if (startCol >= vr.c2) {
            while (this._isColDrawnPartially(startCol, vr.c1 + incX, offsetFrozen.offsetX)) {
                ++incX;
            }
        }
        // adjustBottom
        if (startRow >= vr.r2) {
            while (this._isRowDrawnPartially(startRow, vr.r1 + incY, offsetFrozen.offsetY)) {
                ++incY;
            }
        }
        return {
            deltaX: ar.type === c_oAscSelectionType.RangeCol || ar.type === c_oAscSelectionType.RangeCells ? incX : 0,
            deltaY: ar.type === c_oAscSelectionType.RangeRow || ar.type === c_oAscSelectionType.RangeCells ? incY : 0
        };
    };

    WorksheetView.prototype._calcFillHandleOffset = function (range) {
        var vr = this.visibleRange;
        var ar = range ? range : this.activeFillHandle;
        var arn = ar.clone(true);
        var isMC = this._isMergedCells(arn);
        var adjustRight = ar.c2 >= vr.c2 || ar.c1 >= vr.c2 && isMC;
        var adjustBottom = ar.r2 >= vr.r2 || ar.r1 >= vr.r2 && isMC;
        var incX = ar.c1 < vr.c1 && isMC ? arn.c1 - vr.c1 : ar.c2 < vr.c1 ? ar.c2 - vr.c1 : 0;
        var incY = ar.r1 < vr.r1 && isMC ? arn.r1 - vr.r1 : ar.r2 < vr.r1 ? ar.r2 - vr.r1 : 0;

        var offsetFrozen = this.getFrozenPaneOffset();

        if (adjustRight) {
            try {
                while (this._isColDrawnPartially(isMC ? arn.c2 : ar.c2, vr.c1 + incX, offsetFrozen.offsetX)) {
                    ++incX;
                }
            } catch (e) {
                this.expandColsOnScroll(true);
                this.handlers.trigger("reinitializeScrollX");
            }
        }
        if (adjustBottom) {
            try {
                while (this._isRowDrawnPartially(isMC ? arn.r2 : ar.r2, vr.r1 + incY, offsetFrozen.offsetY)) {
                    ++incY;
                }
            } catch (e) {
                this.expandRowsOnScroll(true);
                this.handlers.trigger("reinitializeScrollY");
            }
        }
        return {
            deltaX: incX, deltaY: incY
        };
    };

    // Потеряем ли мы что-то при merge ячеек
    WorksheetView.prototype.getSelectionMergeInfo = function (options) {
        // ToDo now check only last selection range
        var arn = this.model.selectionRange.getLast().clone(true);
        var notEmpty = false;
        var r, c;

        if (this.cellCommentator.isMissComments(arn)) {
            return true;
        }

        switch (options) {
            case c_oAscMergeOptions.Merge:
            case c_oAscMergeOptions.MergeCenter:
                for (r = arn.r1; r <= arn.r2; ++r) {
                    for (c = arn.c1; c <= arn.c2; ++c) {
                        if (false === this._isCellEmptyText(c, r)) {
                            if (notEmpty) {
                                return true;
                            }
                            notEmpty = true;
                        }
                    }
                }
                break;
            case c_oAscMergeOptions.MergeAcross:
                for (r = arn.r1; r <= arn.r2; ++r) {
                    notEmpty = false;
                    for (c = arn.c1; c <= arn.c2; ++c) {
                        if (false === this._isCellEmptyText(c, r)) {
                            if (notEmpty) {
                                return true;
                            }
                            notEmpty = true;
                        }
                    }
                }
                break;
        }

        return false;
    };

	//нужно ли спрашивать пользователя о расширении диапазона
	WorksheetView.prototype.getSelectionSortInfo = function () {
		//в случае попытки сортировать мультиселект, необходимо выдавать ошибку
		var arn = this.model.selectionRange.getLast().clone(true);

		//null - не выдавать сообщение и не расширять, false - не выдавать сообщение и расширЯть, true - выдавать сообщение
		var bResult = false;

		//если внутри форматированной таблиц, никогда не выдаем сообщение
		if(this.model.autoFilters._isTablePartsContainsRange(arn))
		{
			bResult = null;
		}
		else if(!arn.isOneCell())//в случае одной выделенной ячейки - всегда не выдаём сообщение и автоматически расширяем
		{
			var colCount = arn.c2 - arn.c1 + 1;
			var rowCount = arn.r2 - arn.r1 + 1;
			//если выделено более одного столбца и более одной строки - не выдаем сообщение и не расширяем
			if(colCount > 1 && rowCount > 1)
			{
				bResult = null;
			}
			else
			{
				//далее проверяем есть ли смежные ячейки у startCol/startRow
				var activeCell = this.model.selectionRange.activeCell;
				var activeCellRange = new Asc.Range(activeCell.col, activeCell.row, activeCell.col, activeCell.row);
				var expandRange = this.model.autoFilters._getAdjacentCellsAF(activeCellRange);

				//если диапазон не расширяется за счет близлежащих ячеек - не выдаем сообщение и не расширяем
				if(arn.isEqual(expandRange) || activeCellRange.isEqual(expandRange))
				{
					bResult = null;
				}
				else
				{
					bResult = true;
				}
			}
		}

		return bResult;
	};

    WorksheetView.prototype.getSelectionMathInfo = function () {
        var oSelectionMathInfo = new asc_CSelectionMathInfo();
        var sum = 0;
        var oExistCells = {};

		if (window["NATIVE_EDITOR_ENJINE"]) {
		    return oSelectionMathInfo;
		}

        var t = this;
        this.model.selectionRange.ranges.forEach(function (item) {
            var tmp;
            var range = t.model.getRange3(item.r1, item.c1, item.r2, item.c2);
            range._setPropertyNoEmpty(null, null, function (cell, r) {
                var idCell = cell.nCol + '-' + cell.nRow;
                if (!oExistCells[idCell] && !cell.isEmptyTextString() && t.height_1px <= t.rows[r].height) {
                    oExistCells[idCell] = true;
                    ++oSelectionMathInfo.count;
                    if (CellValueType.Number === cell.getType()) {
                        tmp = parseFloat(cell.getValueWithoutFormat());
                        if (isNaN(tmp)) {
                            return;
                        }
                        if (0 === oSelectionMathInfo.countNumbers) {
                            oSelectionMathInfo.min = oSelectionMathInfo.max = tmp;
                        } else {
                            oSelectionMathInfo.min = Math.min(oSelectionMathInfo.min, tmp);
                            oSelectionMathInfo.max = Math.max(oSelectionMathInfo.max, tmp);
                        }
                        ++oSelectionMathInfo.countNumbers;
                        sum += tmp;
                    }
                }
            });
        });

        // Показываем только данные для 2-х или более ячеек (http://bugzilla.onlyoffice.com/show_bug.cgi?id=24115)
        if (1 < oSelectionMathInfo.countNumbers) {
            // Мы должны отдавать в формате активной ячейки
            var numFormat = this.model.getRange3(this.model.selectionRange.row, this.model.selectionRange.cell,
              this.model.selectionRange.row, this.model.selectionRange.cell).getNumFormat();
            if (Asc.c_oAscNumFormatType.Time === numFormat.getType()) {
                // Для времени нужно отдавать в формате [h]:mm:ss (http://bugzilla.onlyoffice.com/show_bug.cgi?id=26271)
                numFormat = AscCommon.oNumFormatCache.get('[h]:mm:ss');
            }

            oSelectionMathInfo.sum =
              numFormat.formatToMathInfo(sum, CellValueType.Number, this.settings.mathMaxDigCount);
            oSelectionMathInfo.average =
              numFormat.formatToMathInfo(sum / oSelectionMathInfo.countNumbers, CellValueType.Number,
                this.settings.mathMaxDigCount);

            oSelectionMathInfo.min =
              numFormat.formatToMathInfo(oSelectionMathInfo.min, CellValueType.Number, this.settings.mathMaxDigCount);
            oSelectionMathInfo.max =
              numFormat.formatToMathInfo(oSelectionMathInfo.max, CellValueType.Number, this.settings.mathMaxDigCount);
        }
        return oSelectionMathInfo;
    };

    WorksheetView.prototype.getSelectionName = function (bRangeText) {
        if (this.isSelectOnShape) {
            return " ";
        }	// Пока отправим пустое имя(с пробелом, пустое не воспринимаем в меню..) ToDo

        var ar = this.model.selectionRange.getLast();
        var cell = this.model.selectionRange.activeCell;
        var mc = this.model.getMergedByCell(cell.row, cell.col);
        var c1 = mc ? mc.c1 : cell.col, r1 = mc ? mc.r1 : cell.row, ar_norm = ar.normalize(), mc_norm = mc ?
          mc.normalize() : null, c2 = mc_norm ? mc_norm.isEqual(ar_norm) ? mc_norm.c1 : ar_norm.c2 :
          ar_norm.c2, r2 = mc_norm ? mc_norm.isEqual(ar_norm) ? mc_norm.r1 : ar_norm.r2 :
          ar_norm.r2, selectionSize = !bRangeText ? "" : (function (r) {
            var rc = Math.abs(r.r2 - r.r1) + 1;
            var cc = Math.abs(r.c2 - r.c1) + 1;
            switch (r.type) {
                case c_oAscSelectionType.RangeCells:
                    return rc + "R x " + cc + "C";
                case c_oAscSelectionType.RangeCol:
                    return cc + "C";
                case c_oAscSelectionType.RangeRow:
                    return rc + "R";
                case c_oAscSelectionType.RangeMax:
                    return gc_nMaxRow + "R x " + gc_nMaxCol + "C";
            }
            return "";
        })(ar);
        if (selectionSize) {
            return selectionSize;
        }

        var dN = new Asc.Range(ar_norm.c1, ar_norm.r1, c2, r2, true);
        var defName = parserHelp.get3DRef(this.model.getName(), dN.getAbsName());
        defName = this.model.workbook.findDefinesNames(defName, this.model.getId());
        if (defName) {
            return defName;
        }

        return this._getColumnTitle(c1) + this._getRowTitle(r1);
    };

    WorksheetView.prototype.getSelectionRangeValue = function () {
        // ToDo проблема с выбором целого столбца/строки
        var ar = this.model.selectionRange.getLast().clone(true);
        var sName = ar.getAbsName();
        return (c_oAscSelectionDialogType.FormatTable === this.selectionDialogType) ? sName :
          parserHelp.get3DRef(this.model.getName(), sName);
    };

    WorksheetView.prototype.getSelectionInfo = function () {
        return this.objectRender.selectedGraphicObjectsExists() ? this._getSelectionInfoObject() :
          this._getSelectionInfoCell();
    };

    WorksheetView.prototype._getSelectionInfoCell = function () {
        var c_opt = this.settings.cells;
        var selectionRange = this.model.selectionRange;
        var cell = selectionRange.activeCell;
        var mc = this.model.getMergedByCell(cell.row, cell.col);
        var c1 = mc ? mc.c1 : cell.col;
        var r1 = mc ? mc.r1 : cell.row;
        var c = this._getVisibleCell(c1, r1);
		var font = c.getFont();
		var fa = font.getVerticalAlign();
		var fc = font.getColor();
        var bg = c.getFill();
        var cellType = c.getType();
        var isNumberFormat = (!cellType || CellValueType.Number === cellType);

        var cell_info = new asc_CCellInfo();
        cell_info.name = this._getColumnTitle(c1) + this._getRowTitle(r1);
        cell_info.formula = c.getFormula();

        cell_info.text = c.getValueForEdit();

		cell_info.halign = AscCommonExcel.horizontalAlignToString(c.getAlignHorizontal());
		cell_info.valign = AscCommonExcel.verticalAlignToString(c.getAlignVertical());

        var tablePartsOptions = selectionRange.isSingleRange() ?
          this.model.autoFilters.searchRangeInTableParts(selectionRange.getLast()) : -2;
        var curTablePart = tablePartsOptions >= 0 ? this.model.TableParts[tablePartsOptions] : null;
        var tableStyleInfo = curTablePart && curTablePart.TableStyleInfo ? curTablePart.TableStyleInfo : null;

        cell_info.autoFilterInfo = new asc_CAutoFilterInfo();
        if (-2 === tablePartsOptions) {
            cell_info.autoFilterInfo.isAutoFilter = null;
            cell_info.autoFilterInfo.isApplyAutoFilter = false;
        } else {
            var checkApplyFilterOrSort = this.model.autoFilters.checkApplyFilterOrSort(tablePartsOptions);
            cell_info.autoFilterInfo.isAutoFilter = checkApplyFilterOrSort.isAutoFilter;
            cell_info.autoFilterInfo.isApplyAutoFilter = checkApplyFilterOrSort.isFilterColumns;
        }

        if (curTablePart !== null) {
            cell_info.formatTableInfo = new AscCommonExcel.asc_CFormatTableInfo();
            cell_info.formatTableInfo.tableName = curTablePart.DisplayName;

            if (tableStyleInfo) {
                cell_info.formatTableInfo.tableStyleName = tableStyleInfo.Name;

                cell_info.formatTableInfo.bandVer = tableStyleInfo.ShowColumnStripes;
                cell_info.formatTableInfo.firstCol = tableStyleInfo.ShowFirstColumn;
                cell_info.formatTableInfo.lastCol = tableStyleInfo.ShowLastColumn;

                cell_info.formatTableInfo.bandHor = tableStyleInfo.ShowRowStripes;
            }
            cell_info.formatTableInfo.lastRow = curTablePart.TotalsRowCount !== null;
            cell_info.formatTableInfo.firstRow = curTablePart.HeaderRowCount === null;
            cell_info.formatTableInfo.tableRange = curTablePart.Ref.getAbsName();
            cell_info.formatTableInfo.filterButton = curTablePart.isShowButton();

			cell_info.formatTableInfo.altText = curTablePart.altText;
            cell_info.formatTableInfo.altTextSummary = curTablePart.altTextSummary;

            this.af_setDisableProps(curTablePart, cell_info.formatTableInfo);
        }

        cell_info.styleName = c.getStyleName();
        cell_info.angle = c.getAngle();

        cell_info.flags = new AscCommonExcel.asc_CCellFlag();
        cell_info.flags.shrinkToFit = c.getShrinkToFit();
        cell_info.flags.wrapText = c.getWrap();

        // ToDo activeRange type
        cell_info.flags.selectionType = selectionRange.getLast().type;
        cell_info.flags.multiselect = !selectionRange.isSingleRange();

        cell_info.flags.lockText = ("" !== cell_info.text && (isNumberFormat || "" !== cell_info.formula));

        cell_info.font = new asc_CFont();
		cell_info.font.name = font.getName();
		cell_info.font.size = font.getSize();
		cell_info.font.bold = font.getBold();
		cell_info.font.italic = font.getItalic();
		// ToDo убрать, когда будет реализовано двойное подчеркивание
		cell_info.font.underline = (Asc.EUnderline.underlineNone !== font.getUnderline());
		cell_info.font.strikeout = font.getStrikeout();
		cell_info.font.subscript = fa === AscCommon.vertalign_SubScript;
		cell_info.font.superscript = fa === AscCommon.vertalign_SuperScript;
        cell_info.font.color = (fc ? asc_obj2Color(fc) : new Asc.asc_CColor(c_opt.defaultState.color));

        cell_info.fill = new asc_CFill((null != bg) ? asc_obj2Color(bg) : bg);

		cell_info.numFormat = c.getNumFormatStr();
        cell_info.numFormatInfo = c.getNumFormatTypeInfo();

        // Получаем гиперссылку (//ToDo)
        var ar = selectionRange.getLast().clone();
        var range = this.model.getRange3(ar.r1, ar.c1, ar.r2, ar.c2);
        var hyperlink = range.getHyperlink();
        var oHyperlink;
        if (null !== hyperlink) {
            // Гиперлинк
            oHyperlink = new asc_CHyperlink(hyperlink);
            oHyperlink.asc_setText(cell_info.text);
            cell_info.hyperlink = oHyperlink;
        } else {
            cell_info.hyperlink = null;
        }

        cell_info.comments = this.cellCommentator.getComments(ar.c1, ar.r1);
        cell_info.flags.merge = null !== range.hasMerged();

        var sheetId = this.model.getId();
		var lockInfo;
        // Пересчет для входящих ячеек в добавленные строки/столбцы
        var isIntersection = this._recalcRangeByInsertRowsAndColumns(sheetId, ar);
        if (false === isIntersection) {
			lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, /*subType*/null, sheetId,
              new AscCommonExcel.asc_CCollaborativeRange(ar.c1, ar.r1, ar.c2, ar.r2));

            if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther,
                /*bCheckOnlyLockAll*/false)) {
                // Уже ячейку кто-то редактирует
                cell_info.isLocked = true;
            }
        }

		if (null !== curTablePart) {
			var tableAr = curTablePart.Ref.clone();
			isIntersection = this._recalcRangeByInsertRowsAndColumns(sheetId, tableAr);
			if (false === isIntersection) {
				lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, /*subType*/null, sheetId,
					new AscCommonExcel.asc_CCollaborativeRange(tableAr.c1, tableAr.r1, tableAr.c2, tableAr.r2));

				if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther,
						/*bCheckOnlyLockAll*/false)) {
					// Уже таблицу кто-то редактирует
					cell_info.isLockedTable = true;
				}
			}
		}

        cell_info.sparklineInfo = this.model.getSparklineGroup(c1, r1);
		if (cell_info.sparklineInfo) {
			lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, /*subType*/null, sheetId,
				cell_info.sparklineInfo.Get_Id());
			if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther,
					/*bCheckOnlyLockAll*/false)) {
				cell_info.isLockedSparkline = true;
			}
		}

        return cell_info;
    };

    WorksheetView.prototype._getSelectionInfoObject = function () {
        var objectInfo = new asc_CCellInfo();

        objectInfo.flags = new AscCommonExcel.asc_CCellFlag();
        var graphicObjects = this.objectRender.getSelectedGraphicObjects();
        if (graphicObjects.length) {
            objectInfo.flags.selectionType = this.objectRender.getGraphicSelectionType(graphicObjects[0].Id);
        }

        var textPr = this.objectRender.controller.getParagraphTextPr();
        var theme = this.objectRender.controller.getTheme();
        if (textPr && theme && theme.themeElements && theme.themeElements.fontScheme) {
            if (textPr.FontFamily) {
                textPr.FontFamily.Name = theme.themeElements.fontScheme.checkFont(textPr.FontFamily.Name);
            }
            if (textPr.RFonts) {
                if (textPr.RFonts.Ascii) {
                    textPr.RFonts.Ascii.Name = theme.themeElements.fontScheme.checkFont(textPr.RFonts.Ascii.Name);
                }
                if (textPr.RFonts.EastAsia) {
                    textPr.RFonts.EastAsia.Name = theme.themeElements.fontScheme.checkFont(textPr.RFonts.EastAsia.Name);
                }
                if (textPr.RFonts.HAnsi) {
                    textPr.RFonts.HAnsi.Name = theme.themeElements.fontScheme.checkFont(textPr.RFonts.HAnsi.Name);
                }
                if (textPr.RFonts.CS) {
                    textPr.RFonts.CS.Name = theme.themeElements.fontScheme.checkFont(textPr.RFonts.CS.Name);
                }
            }
        }

        var paraPr = this.objectRender.controller.getParagraphParaPr();
        if (!paraPr && textPr) {
            paraPr = new CParaPr();
        }
        if (textPr && paraPr) {
            objectInfo.text = this.objectRender.controller.Get_SelectedText(true);

            var horAlign = paraPr.Jc;
            var vertAlign = Asc.c_oAscVAlign.Center;
            var shape_props = this.objectRender.controller.getDrawingProps().shapeProps;
            var angle = null;
            if (shape_props) {
                switch (shape_props.verticalTextAlign) {
                    case AscFormat.VERTICAL_ANCHOR_TYPE_BOTTOM:
                        vertAlign = Asc.c_oAscVAlign.Bottom;
                        break;
                    case AscFormat.VERTICAL_ANCHOR_TYPE_CENTER:
                        vertAlign = Asc.c_oAscVAlign.Center;
                        break;

                    case AscFormat.VERTICAL_ANCHOR_TYPE_TOP:
                    case AscFormat.VERTICAL_ANCHOR_TYPE_DISTRIBUTED:
                    case AscFormat.VERTICAL_ANCHOR_TYPE_JUSTIFIED:
                        vertAlign = Asc.c_oAscVAlign.Top;
                        break;
                }
                switch (shape_props.vert) {
                    case AscFormat.nVertTTvert:
                        angle = 90;
                        break;
                    case AscFormat.nVertTTvert270:
                        angle = 270;
                        break;
                    default:
                        angle = 0;
                        break;
                }

            }

            objectInfo.halign = AscCommonExcel.horizontalAlignToString(horAlign);
            objectInfo.valign = AscCommonExcel.verticalAlignToString(vertAlign);
            objectInfo.angle = angle;

            objectInfo.font = new asc_CFont();
            objectInfo.font.name = textPr.FontFamily ? textPr.FontFamily.Name : null;
            objectInfo.font.size = textPr.FontSize;
            objectInfo.font.bold = textPr.Bold;
            objectInfo.font.italic = textPr.Italic;
            objectInfo.font.underline = textPr.Underline;
            objectInfo.font.strikeout = textPr.Strikeout;
            objectInfo.font.subscript = textPr.VertAlign == AscCommon.vertalign_SubScript;
            objectInfo.font.superscript = textPr.VertAlign == AscCommon.vertalign_SuperScript;
            if (textPr.Color) {
                objectInfo.font.color = AscCommon.CreateAscColorCustom(textPr.Color.r, textPr.Color.g, textPr.Color.b);
            }

            var shapeHyperlink = this.objectRender.controller.getHyperlinkInfo();
            if (shapeHyperlink && (shapeHyperlink instanceof ParaHyperlink)) {

                var hyperlink = new AscCommonExcel.Hyperlink();
                hyperlink.Tooltip = shapeHyperlink.ToolTip;

                var spl = shapeHyperlink.Value.split("!");
                if (spl.length === 2) {
                    hyperlink.setLocation(shapeHyperlink.Value);
                } else {
                    hyperlink.Hyperlink = shapeHyperlink.Value;
                }

                objectInfo.hyperlink = new asc_CHyperlink(hyperlink);
                objectInfo.hyperlink.asc_setText(shapeHyperlink.Get_SelectedText(true, true));
            }
        } else {
            // Может быть не задано текста, поэтому выставим по умолчанию
            objectInfo.font = new asc_CFont();
            objectInfo.font.name = null;
            objectInfo.font.size = null;
        }

        // Заливка не нужна как таковая
        objectInfo.fill = new asc_CFill(null);

        // ToDo locks

        return objectInfo;
    };

    // Получаем координаты активной ячейки
    WorksheetView.prototype.getActiveCellCoord = function () {
        return this.getCellCoord(this.model.selectionRange.activeCell.col, this.model.selectionRange.activeCell.row);
    };
    WorksheetView.prototype.getCellCoord = function (col, row) {
        var offsetX = 0, offsetY = 0;
        var vrCol = this.visibleRange.c1, vrRow = this.visibleRange.r1;
        if ( this.topLeftFrozenCell ) {
            var offsetFrozen = this.getFrozenPaneOffset();
            var cFrozen = this.topLeftFrozenCell.getCol0();
            var rFrozen = this.topLeftFrozenCell.getRow0();
            if ( col >= cFrozen ) {
                offsetX = offsetFrozen.offsetX;
            }
            else {
                vrCol = 0;
            }

            if ( row >= rFrozen ) {
                offsetY = offsetFrozen.offsetY;
            }
            else {
                vrRow = 0;
            }
        }

        var xL = this.getCellLeft( col, /*pt*/1 );
        var yL = this.getCellTop( row, /*pt*/1 );
        // Пересчитываем X и Y относительно видимой области
        xL -= (this.cols[vrCol].left - this.cellsLeft);
        yL -= (this.rows[vrRow].top - this.cellsTop);
        // Пересчитываем X и Y относительно закрепленной области
        xL += offsetX;
        yL += offsetY;

        // Пересчитываем в px
        xL *= asc_getcvt( 1/*pt*/, 0/*px*/, this._getPPIX() );
        yL *= asc_getcvt( 1/*pt*/, 0/*px*/, this._getPPIY() );

        var width = this.getColumnWidth( col, /*px*/0 );
        var height = this.getRowHeight( row, /*px*/0 );

        if ( AscBrowser.isRetina ) {
            xL >>= 1;
            yL >>= 1;
            width >>= 1;
            height >>= 1;
        }

        return new AscCommon.asc_CRect( xL, yL, width, height );
    };

    WorksheetView.prototype._checkSelectionShape = function () {
        var isSelectOnShape = this.isSelectOnShape;
        if (this.isSelectOnShape) {
            this.isSelectOnShape = false;
            this.objectRender.unselectDrawingObjects();
        }
        return isSelectOnShape;
    };

    WorksheetView.prototype._updateSelectionNameAndInfo = function () {
        this.handlers.trigger("selectionNameChanged", this.getSelectionName(/*bRangeText*/false));
        this.handlers.trigger("selectionChanged");
        this.handlers.trigger("selectionMathInfoChanged", this.getSelectionMathInfo());
    };

    WorksheetView.prototype.getSelectionShape = function () {
        return this.isSelectOnShape;
    };
    WorksheetView.prototype.setSelectionShape = function ( isSelectOnShape ) {
        this.isSelectOnShape = isSelectOnShape;
        // отправляем евент для получения свойств картинки, шейпа или группы
        this.model.workbook.handlers.trigger( "asc_onHideComment" );
        this._updateSelectionNameAndInfo();
    };
    WorksheetView.prototype.setSelection = function (range, validRange) {
        // Проверка на валидность range.
        if (validRange && (range.c2 >= this.nColsCount || range.r2 >= this.nRowsCount)) {
            if (range.c2 >= this.nColsCount) {
                this.expandColsOnScroll(false, true, range.c2 + 1);
            }
            if (range.r2 >= this.nRowsCount) {
                this.expandRowsOnScroll(false, true, range.r2 + 1);
            }
        }
        var oRes = null;
        var type = range.type;
        if (type == c_oAscSelectionType.RangeCells || type == c_oAscSelectionType.RangeCol ||
          type == c_oAscSelectionType.RangeRow || type == c_oAscSelectionType.RangeMax) {
            this.cleanSelection();
            this.model.selectionRange.assign2(range);
			this._fixSelectionOfMergedCells();
			this.updateSelectionWithSparklines();

            this._updateSelectionNameAndInfo();
            oRes = this._calcActiveCellOffset();
        }
        return oRes;
    };

    WorksheetView.prototype.changeSelectionStartPoint = function (x, y, isCoord, isSelectMode, isCtrl) {
        this.cleanSelection();

        if (!this.isFormulaEditMode) {
			this.cleanFormulaRanges();
            if (isCtrl) {
                this.model.selectionRange.addRange();
            } else {
                this.model.selectionRange.clean();
            }
        }
        var ar = this._getSelection().getLast().clone();
        var ret = {};
        var isChangeSelectionShape = false;

        var commentList = this.cellCommentator.getCommentsXY(x, y);
        if (!commentList.length) {
            this.model.workbook.handlers.trigger("asc_onHideComment");
            this.cellCommentator.resetLastSelectedId();
        }

        if (isCoord) {
            // move active range to coordinates x,y
            this._moveActiveCellToXY(x, y);
            isChangeSelectionShape = this._checkSelectionShape();
        } else {
            // move active range to offset x,y
            this._moveActiveCellToOffset(x, y);
                ret = this._calcActiveRangeOffset();
            }

        if (this.isSelectionDialogMode) {
            if (!this.model.selectionRange.isEqual(ar)) {
                // Смена диапазона
                this.handlers.trigger("selectionRangeChanged", this.getSelectionRangeValue());
            }
        } else if (!this.isCellEditMode) {
            if (isChangeSelectionShape || !this.model.selectionRange.isEqual(ar)) {
                this.handlers.trigger("selectionNameChanged", this.getSelectionName(/*bRangeText*/false));
                if (!isSelectMode) {
                    this.handlers.trigger("selectionChanged");
                    this.handlers.trigger("selectionMathInfoChanged", this.getSelectionMathInfo());
                }
            }
        }

        if (!isChangeSelectionShape) {
            if (!isCoord) {
                this.updateSelectionWithSparklines();
            } else {
            this._drawSelection();
        }
        }

        //ToDo this.drawDepCells();

        return ret;
    };

    // Смена селекта по нажатию правой кнопки мыши
    WorksheetView.prototype.changeSelectionStartPointRightClick = function (x, y) {
        var isChangeSelectionShape = this._checkSelectionShape();
        this.model.workbook.handlers.trigger("asc_onHideComment");

        var _x = x * asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIX());
        var _y = y * asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIY());

        var val, c1, c2, r1, r2;
        val = this._findColUnderCursor(_x, true);
        if (val) {
            c1 = c2 = val.col;
        } else {
            c1 = 0;
            c2 = gc_nMaxCol0;
        }
        val = this._findRowUnderCursor(_y, true);
        if (val) {
            r1 = r2 = val.row;
        } else {
            r1 = 0;
            r2 = gc_nMaxRow0;
        }

        if (isChangeSelectionShape) {
            // Попали в выделение, но были в объекте
            this.cleanSelection();
            this._drawSelection();

            this._updateSelectionNameAndInfo();
        } else if (!this.model.selectionRange.containsRange(new asc_Range(c1, r1, c2, r2))) {
            // Не попали в выделение (меняем первую точку)
            this.cleanSelection();
            this.model.selectionRange.clean();
            this._moveActiveCellToXY(x, y);
            this._drawSelection();

            this._updateSelectionNameAndInfo();
            return false;
        }

        return true;
    };

    /**
     *
     * @param x - координата или прибавка к column
     * @param y - координата или прибавка к row
     * @param isCoord - выделение с помощью мышки (true) или с клавиатуры (false)
     * @param isSelectMode - при выделении с помощью мышки, не нужно отправлять эвенты о смене выделения и информации
     * @returns {*}
     */
    WorksheetView.prototype.changeSelectionEndPoint = function (x, y, isCoord, isSelectMode) {
        var isChangeSelectionShape = false;
        if (isCoord) {
            isChangeSelectionShape = this._checkSelectionShape();
        }
        var ar = this._getSelection().getLast();

        var newRange = isCoord ? this._calcSelectionEndPointByXY(x, y) : this._calcSelectionEndPointByOffset(x, y);
        var isEqual = newRange.isEqual(ar);
        if (isEqual && !isCoord) {
            // При движении стрелками можем попасть на замерженную ячейку
        }
        if (!isEqual || isChangeSelectionShape) {
            this.cleanSelection();
            ar.assign2(newRange);
            this._drawSelection();

            //ToDo this.drawDepCells();

            if (!this.isCellEditMode) {
                if (!this.isSelectionDialogMode) {
                    this.handlers.trigger("selectionNameChanged", this.getSelectionName(/*bRangeText*/true));
                    if (!isSelectMode) {
                        this.handlers.trigger("selectionChanged");
                        this.handlers.trigger("selectionMathInfoChanged", this.getSelectionMathInfo());
                    }
                } else {
                    // Смена диапазона
                    this.handlers.trigger("selectionRangeChanged", this.getSelectionRangeValue());
                }
            }
        }

        this.model.workbook.handlers.trigger("asc_onHideComment");

        return isCoord ? this._calcActiveRangeOffsetIsCoord(x, y) : this._calcActiveRangeOffset();
    };

    // Окончание выделения
    WorksheetView.prototype.changeSelectionDone = function () {
        if (this.stateFormatPainter) {
            this.applyFormatPainter();
		} else {
			this.checkSelectionSparkline();
        }
    };

    // Обработка движения в выделенной области
    WorksheetView.prototype.changeSelectionActivePoint = function (dc, dr) {
        var ret;
        if (!this._moveActivePointInSelection(dc, dr)) {
            return this.changeSelectionStartPoint(dc, dr, /*isCoord*/false, /*isSelectMode*/false, false);
        }

        // Очищаем выделение
        this.cleanSelection();
        // Перерисовываем
        this.updateSelectionWithSparklines();

        // Смотрим, ушли ли мы за границу видимой области
        ret = this._calcActiveCellOffset();

        // Эвент обновления
        this.handlers.trigger("selectionNameChanged", this.getSelectionName(/*bRangeText*/false));
        this.handlers.trigger("selectionChanged");

        return ret;
    };

	WorksheetView.prototype.checkSelectionSparkline = function () {
		if (!this.getSelectionShape() && !this.isFormulaEditMode && !this.isCellEditMode) {
			var cell = this.model.selectionRange.activeCell;
			var mc = this.model.getMergedByCell(cell.row, cell.col);
			var c1 = mc ? mc.c1 : cell.col;
			var r1 = mc ? mc.r1 : cell.row;
			var oSparklineInfo = this.model.getSparklineGroup(c1, r1);
			if (oSparklineInfo) {
				this.cleanSelection();
				this.cleanFormulaRanges();
				var range = oSparklineInfo.getLocationRanges();
				range.ranges.forEach(function (item) {
					item.isName = true;
					item.noColor = true;
				});
				this.arrActiveFormulaRanges.push(range);
				this._drawSelection();
				return true;
			}
		}
	};


    // ----- Changing cells -----

    WorksheetView.prototype.applyFormatPainter = function () {
        var t = this;
        var from = t.handlers.trigger('getRangeFormatPainter').getLast(), to = this.model.selectionRange.getLast().getAllRange();
        var onApplyFormatPainterCallback = function (isSuccess) {
            // Очищаем выделение
            t.cleanSelection();

            if (true === isSuccess) {
                AscCommonExcel.promoteFromTo(from, t.model, to, t.model);
            }

            t.expandColsOnScroll(false, true, to.c2 + 1);
            t.expandRowsOnScroll(false, true, to.r2 + 1);

            // Сбрасываем параметры
            t._updateCellsRange(to, /*canChangeColWidth*/c_oAscCanChangeColWidth.none, /*lockDraw*/true);
            if (c_oAscFormatPainterState.kMultiple !== t.stateFormatPainter) {
                t.handlers.trigger('onStopFormatPainter');
            }
            // Перерисовываем
            t._recalculateAfterUpdate([to]);
        };

        var result = AscCommonExcel.preparePromoteFromTo(from, to);
        if (!result) {
            // ToDo вывести ошибку
            onApplyFormatPainterCallback(false);
            return;
        }

        this._isLockedCells(to, null, onApplyFormatPainterCallback);
    };
    WorksheetView.prototype.formatPainter = function (stateFormatPainter) {
        // Если передали состояние, то выставляем его. Если нет - то меняем на противоположное.
        this.stateFormatPainter = (null != stateFormatPainter) ? stateFormatPainter :
          ((c_oAscFormatPainterState.kOff !== this.stateFormatPainter) ? c_oAscFormatPainterState.kOff :
            c_oAscFormatPainterState.kOn);

        if (this.stateFormatPainter) {
            this.copyActiveRange = this.model.selectionRange.clone();
            this._drawFormatPainterRange();
        } else {
            this.cleanSelection();
            this.copyActiveRange = null;
            this._drawSelection();
        }
        return this.copyActiveRange;
    };

    /* Функция для работы автозаполнения (selection). (x, y) - координаты точки мыши на области */
    WorksheetView.prototype.changeSelectionFillHandle = function (x, y) {
        // Возвращаемый результат
        var ret = null;
        // Если мы только первый раз попали сюда, то копируем выделенную область
        if (null === this.activeFillHandle) {
            this.activeFillHandle = this.model.selectionRange.getLast().clone();
            // Для первого раза нормализуем (т.е. первая точка - это левый верхний угол)
            this.activeFillHandle.normalize();
            return ret;
        }

        // Пересчитываем координаты
        x *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIX());
        y *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIY());

        // Очищаем выделение, будем рисовать заново
        this.cleanSelection();
        // Копируем выделенную область
        var ar = this.model.selectionRange.getLast().clone(true);
        // Получаем координаты левого верхнего угла выделения
        var xL = this.getCellLeft(ar.c1, /*pt*/1);
        var yL = this.getCellTop(ar.r1, /*pt*/1);
        // Получаем координаты правого нижнего угла выделения
        var xR = this.getCellLeft(ar.c2, /*pt*/1) + this.cols[ar.c2].width;
        var yR = this.getCellTop(ar.r2, /*pt*/1) + this.rows[ar.r2].height;

        // range для пересчета видимой области
        var activeFillHandleCopy;

        // Колонка по X и строка по Y
        var colByX = this._findColUnderCursor(x, /*canReturnNull*/false, true).col;
        var rowByY = this._findRowUnderCursor(y, /*canReturnNull*/false, true).row;
        // Колонка по X и строка по Y (без половинчатого счета). Для сдвига видимой области
        var colByXNoDX = this._findColUnderCursor(x, /*canReturnNull*/false, false).col;
        var rowByYNoDY = this._findRowUnderCursor(y, /*canReturnNull*/false, false).row;
        // Сдвиг в столбцах и строках от крайней точки
        var dCol;
        var dRow;

        // Пересчитываем X и Y относительно видимой области
        x += (this.cols[this.visibleRange.c1].left - this.cellsLeft);
        y += (this.rows[this.visibleRange.r1].top - this.cellsTop);

        // Вычисляем расстояние от (x, y) до (xL, yL)
        var dXL = x - xL;
        var dYL = y - yL;
        // Вычисляем расстояние от (x, y) до (xR, yR)
        var dXR = x - xR;
        var dYR = y - yR;
        var dXRMod;
        var dYRMod;

        // Определяем область попадания и точку
        /*
         (1)					(2)					(3)

         ------------|-----------------------|------------
         |						|
         (4)		|			(5)			|		(6)
         |						|
         ------------|-----------------------|------------

         (7)					(8)					(9)
         */

        // Область точки (x, y)
        var _tmpArea = 0;
        if (dXR <= 0) {
            // Области (1), (2), (4), (5), (7), (8)
            if (dXL <= 0) {
                // Области (1), (4), (7)
                if (dYR <= 0) {
                    // Области (1), (4)
                    if (dYL <= 0) {
                        // Область (1)
                        _tmpArea = 1;
                    } else {
                        // Область (4)
                        _tmpArea = 4;
                    }
                } else {
                    // Область (7)
                    _tmpArea = 7;
                }
            } else {
                // Области (2), (5), (8)
                if (dYR <= 0) {
                    // Области (2), (5)
                    if (dYL <= 0) {
                        // Область (2)
                        _tmpArea = 2;
                    } else {
                        // Область (5)
                        _tmpArea = 5;
                    }
                } else {
                    // Область (3)
                    _tmpArea = 8;
                }
            }
        } else {
            // Области (3), (6), (9)
            if (dYR <= 0) {
                // Области (3), (6)
                if (dYL <= 0) {
                    // Область (3)
                    _tmpArea = 3;
                } else {
                    // Область (6)
                    _tmpArea = 6;
                }
            } else {
                // Область (9)
                _tmpArea = 9;
            }
        }

        // Проверяем, в каком направлении движение
        switch (_tmpArea) {
            case 2:
            case 8:
                // Двигаемся по вертикали.
                this.fillHandleDirection = 1;
                break;
            case 4:
            case 6:
                // Двигаемся по горизонтали.
                this.fillHandleDirection = 0;
                break;
            case 1:
                // Сравниваем расстояния от точки до левого верхнего угла выделения
                dXRMod = Math.abs(x - xL);
                dYRMod = Math.abs(y - yL);
                // Сдвиги по столбцам и строкам
                dCol = Math.abs(colByX - ar.c1);
                dRow = Math.abs(rowByY - ar.r1);
                // Определим направление позднее
                this.fillHandleDirection = -1;
                break;
            case 3:
                // Сравниваем расстояния от точки до правого верхнего угла выделения
                dXRMod = Math.abs(x - xR);
                dYRMod = Math.abs(y - yL);
                // Сдвиги по столбцам и строкам
                dCol = Math.abs(colByX - ar.c2);
                dRow = Math.abs(rowByY - ar.r1);
                // Определим направление позднее
                this.fillHandleDirection = -1;
                break;
            case 7:
                // Сравниваем расстояния от точки до левого нижнего угла выделения
                dXRMod = Math.abs(x - xL);
                dYRMod = Math.abs(y - yR);
                // Сдвиги по столбцам и строкам
                dCol = Math.abs(colByX - ar.c1);
                dRow = Math.abs(rowByY - ar.r2);
                // Определим направление позднее
                this.fillHandleDirection = -1;
                break;
            case 5:
            case 9:
                // Сравниваем расстояния от точки до правого нижнего угла выделения
                dXRMod = Math.abs(dXR);
                dYRMod = Math.abs(dYR);
                // Сдвиги по столбцам и строкам
                dCol = Math.abs(colByX - ar.c2);
                dRow = Math.abs(rowByY - ar.r2);
                // Определим направление позднее
                this.fillHandleDirection = -1;
                break;
        }

        //console.log(_tmpArea);

        // Возможно еще не определили направление
        if (-1 === this.fillHandleDirection) {
            // Проверим сдвиги по столбцам и строкам, если не поможет, то рассчитываем по расстоянию
            if (0 === dCol && 0 !== dRow) {
                // Двигаемся по вертикали.
                this.fillHandleDirection = 1;
            } else if (0 !== dCol && 0 === dRow) {
                // Двигаемся по горизонтали.
                this.fillHandleDirection = 0;
            } else if (dXRMod >= dYRMod) {
                // Двигаемся по горизонтали.
                this.fillHandleDirection = 0;
            } else {
                // Двигаемся по вертикали.
                this.fillHandleDirection = 1;
            }
        }

        // Проверяем, в каком направлении движение
        if (0 === this.fillHandleDirection) {
            // Определяем область попадания и точку
            /*
             |						|
             |						|
             (1)		|			(2)			|		(3)
             |						|
             |						|
             */
            if (dXR <= 0) {
                // Область (1) или (2)
                if (dXL <= 0) {
                    // Область (1)
                    this.fillHandleArea = 1;
                } else {
                    // Область (2)
                    this.fillHandleArea = 2;
                }
            } else {
                // Область (3)
                this.fillHandleArea = 3;
            }

            // Находим колонку для точки
            this.activeFillHandle.c2 = colByX;

            switch (this.fillHandleArea) {
                case 1:
                    // Первая точка (xR, yR), вторая точка (x, yL)
                    this.activeFillHandle.c1 = ar.c2;
                    this.activeFillHandle.r1 = ar.r2;

                    this.activeFillHandle.r2 = ar.r1;

                    // Случай, если мы еще не вышли из внутренней области
                    if (this.activeFillHandle.c2 == ar.c1) {
                        this.fillHandleArea = 2;
                    }
                    break;
                case 2:
                    // Первая точка (xR, yR), вторая точка (x, yL)
                    this.activeFillHandle.c1 = ar.c2;
                    this.activeFillHandle.r1 = ar.r2;

                    this.activeFillHandle.r2 = ar.r1;

                    if (this.activeFillHandle.c2 > this.activeFillHandle.c1) {
                        // Ситуация половинки последнего столбца
                        this.activeFillHandle.c1 = ar.c1;
                        this.activeFillHandle.r1 = ar.r1;

                        this.activeFillHandle.c2 = ar.c1;
                        this.activeFillHandle.r2 = ar.r1;
                    }
                    break;
                case 3:
                    // Первая точка (xL, yL), вторая точка (x, yR)
                    this.activeFillHandle.c1 = ar.c1;
                    this.activeFillHandle.r1 = ar.r1;

                    this.activeFillHandle.r2 = ar.r2;
                    break;
            }

            // Копируем в range для пересчета видимой области
            activeFillHandleCopy = this.activeFillHandle.clone();
            activeFillHandleCopy.c2 = colByXNoDX;
        } else {
            // Определяем область попадания и точку
            /*
             (1)
             ____________________________


             (2)

             ____________________________

             (3)
             */
            if (dYR <= 0) {
                // Область (1) или (2)
                if (dYL <= 0) {
                    // Область (1)
                    this.fillHandleArea = 1;
                } else {
                    // Область (2)
                    this.fillHandleArea = 2;
                }
            } else {
                // Область (3)
                this.fillHandleArea = 3;
            }

            // Находим строку для точки
            this.activeFillHandle.r2 = rowByY;

            switch (this.fillHandleArea) {
                case 1:
                    // Первая точка (xR, yR), вторая точка (xL, y)
                    this.activeFillHandle.c1 = ar.c2;
                    this.activeFillHandle.r1 = ar.r2;

                    this.activeFillHandle.c2 = ar.c1;

                    // Случай, если мы еще не вышли из внутренней области
                    if (this.activeFillHandle.r2 == ar.r1) {
                        this.fillHandleArea = 2;
                    }
                    break;
                case 2:
                    // Первая точка (xR, yR), вторая точка (xL, y)
                    this.activeFillHandle.c1 = ar.c2;
                    this.activeFillHandle.r1 = ar.r2;

                    this.activeFillHandle.c2 = ar.c1;

                    if (this.activeFillHandle.r2 > this.activeFillHandle.r1) {
                        // Ситуация половинки последней строки
                        this.activeFillHandle.c1 = ar.c1;
                        this.activeFillHandle.r1 = ar.r1;

                        this.activeFillHandle.c2 = ar.c1;
                        this.activeFillHandle.r2 = ar.r1;
                    }
                    break;
                case 3:
                    // Первая точка (xL, yL), вторая точка (xR, y)
                    this.activeFillHandle.c1 = ar.c1;
                    this.activeFillHandle.r1 = ar.r1;

                    this.activeFillHandle.c2 = ar.c2;
                    break;
            }

            // Копируем в range для пересчета видимой области
            activeFillHandleCopy = this.activeFillHandle.clone();
            activeFillHandleCopy.r2 = rowByYNoDY;
        }

        //console.log ("row1: " + this.activeFillHandle.r1 + " col1: " + this.activeFillHandle.c1 + " row2: " + this.activeFillHandle.r2 + " col2: " + this.activeFillHandle.c2);
        // Перерисовываем
        this._drawSelection();

        // Смотрим, ушли ли мы за границу видимой области
        ret = this._calcFillHandleOffset(activeFillHandleCopy);
        this.model.workbook.handlers.trigger("asc_onHideComment");

        return ret;
    };

    /* Функция для применения автозаполнения */
    WorksheetView.prototype.applyFillHandle = function (x, y, ctrlPress) {
        var t = this;

        // Текущее выделение (к нему применится автозаполнение)
        var arn = t.model.selectionRange.getLast();
        var range = t.model.getRange3(arn.r1, arn.c1, arn.r2, arn.c2);

        // Были ли изменения
        var bIsHaveChanges = false;
        // Вычисляем индекс сдвига
        var nIndex = 0;
        /*nIndex*/
        if (0 === this.fillHandleDirection) {
            // Горизонтальное движение
            nIndex = this.activeFillHandle.c2 - arn.c1;
            if (2 === this.fillHandleArea) {
                // Для внутренности нужно вычесть 1 из значения
                bIsHaveChanges = arn.c2 !== (this.activeFillHandle.c2 - 1);
            } else {
                bIsHaveChanges = arn.c2 !== this.activeFillHandle.c2;
            }
        } else {
            // Вертикальное движение
            nIndex = this.activeFillHandle.r2 - arn.r1;
            if (2 === this.fillHandleArea) {
                // Для внутренности нужно вычесть 1 из значения
                bIsHaveChanges = arn.r2 !== (this.activeFillHandle.r2 - 1);
            } else {
                bIsHaveChanges = arn.r2 !== this.activeFillHandle.r2;
            }
        }

        // Меняли ли что-то
        if (bIsHaveChanges && (this.activeFillHandle.r1 !== this.activeFillHandle.r2 ||
          this.activeFillHandle.c1 !== this.activeFillHandle.c2)) {
            // Диапазон ячеек, который мы будем менять
            var changedRange = arn.clone();

            // Очищаем выделение
            this.cleanSelection();
            if (2 === this.fillHandleArea) {
                // Мы внутри, будет удаление cбрасываем первую ячейку
                // Проверяем, удалили ли мы все (если да, то область не меняется)
                if (arn.c1 !== this.activeFillHandle.c2 || arn.r1 !== this.activeFillHandle.r2) {
                    // Уменьшаем диапазон (мы удалили не все)
                    if (0 === this.fillHandleDirection) {
                        // Горизонтальное движение (для внутренности необходимо вычесть 1)
                        arn.c2 = this.activeFillHandle.c2 - 1;

                        changedRange.c1 = changedRange.c2;
                        changedRange.c2 = this.activeFillHandle.c2;
                    } else {
                        // Вертикальное движение (для внутренности необходимо вычесть 1)
                        arn.r2 = this.activeFillHandle.r2 - 1;

                        changedRange.r1 = changedRange.r2;
                        changedRange.r2 = this.activeFillHandle.r2;
                    }
                }
            } else {
                // Мы вне выделения. Увеличиваем диапазон
                if (0 === this.fillHandleDirection) {
                    // Горизонтальное движение
                    if (1 === this.fillHandleArea) {
                        arn.c1 = this.activeFillHandle.c2;

                        changedRange.c2 = changedRange.c1 - 1;
                        changedRange.c1 = this.activeFillHandle.c2;
                    } else {
                        arn.c2 = this.activeFillHandle.c2;

                        changedRange.c1 = changedRange.c2 + 1;
                        changedRange.c2 = this.activeFillHandle.c2;
                    }
                } else {
                    // Вертикальное движение
                    if (1 === this.fillHandleArea) {
                        arn.r1 = this.activeFillHandle.r2;

                        changedRange.r2 = changedRange.r1 - 1;
                        changedRange.r1 = this.activeFillHandle.r2;
                    } else {
                        arn.r2 = this.activeFillHandle.r2;

                        changedRange.r1 = changedRange.r2 + 1;
                        changedRange.r2 = this.activeFillHandle.r2;
                    }
                }
            }

            changedRange.normalize();

            var applyFillHandleCallback = function (res) {
                if (res) {
                    // Автозаполняем ячейки
                    var oCanPromote = range.canPromote(/*bCtrl*/ctrlPress, /*bVertical*/(1 === t.fillHandleDirection),
                      nIndex);
                    if (null != oCanPromote) {
                        History.Create_NewPoint();
                        History.StartTransaction();
                        range.promote(/*bCtrl*/ctrlPress, /*bVertical*/(1 === t.fillHandleDirection), nIndex,
                          oCanPromote);
                        // Вызываем функцию пересчета для заголовков форматированной таблицы
                        t.model.autoFilters.renameTableColumn(arn);

                        // Сбрасываем параметры автозаполнения
                        t.activeFillHandle = null;
                        t.fillHandleDirection = -1;

                        // Обновляем выделенные ячейки
                        t.isChanged = true;
                        t._updateCellsRange(arn);
                        History.SetSelection(range.bbox.clone());
                        History.SetSelectionRedo(oCanPromote.to.clone());
                        History.EndTransaction();
                    } else {
                        t.handlers.trigger("onErrorEvent", c_oAscError.ID.CannotFillRange,
                          c_oAscError.Level.NoCritical);
                        t.model.selectionRange.assign2(range.bbox);

                // Сбрасываем параметры автозаполнения
                t.activeFillHandle = null;
                t.fillHandleDirection = -1;

                        t.updateSelection();
                    }
                }
            };

            // Можно ли применять автозаполнение ?
            this._isLockedCells(changedRange, /*subType*/null, applyFillHandleCallback);
        } else {
            // Ничего не менялось, сбрасываем выделение
            this.cleanSelection();
            // Сбрасываем параметры автозаполнения
            this.activeFillHandle = null;
            this.fillHandleDirection = -1;
            // Перерисовываем
            this._drawSelection();
        }
    };

    /* Функция для работы перемещения диапазона (selection). (x, y) - координаты точки мыши на области
     *  ToDo нужно переделать, чтобы moveRange появлялся только после сдвига от текущей ячейки
     */
    WorksheetView.prototype.changeSelectionMoveRangeHandle = function (x, y) {
        // Возвращаемый результат
        var ret = null;
        // Пересчитываем координаты
        x *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIX());
        y *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIY());

        //если выделена ячейка заголовка ф/т, меняем выделение с ячейки на столбец ф/т
        //если выделена вся видимая часть форматированной таблицы, но не выделены последние скрытые строчки
        var selectionRange = this.model.selectionRange.getLast().clone();
        if (null === this.startCellMoveRange) {
            this.af_changeSelectionTablePart(selectionRange);
        }

        // Колонка по X и строка по Y
        var colByX = this._findColUnderCursor(x, /*canReturnNull*/false, false).col;
        var rowByY = this._findRowUnderCursor(y, /*canReturnNull*/false, false).row;

        if (selectionRange.type == c_oAscSelectionType.RangeRow) {
            colByX = 0;
        }
        if (selectionRange.type == c_oAscSelectionType.RangeCol) {
            rowByY = 0;
        }
        if (selectionRange.type == c_oAscSelectionType.RangeMax) {
            colByX = 0;
            rowByY = 0;
        }

        // Если мы только первый раз попали сюда, то копируем выделенную область
        if (null === this.startCellMoveRange) {
            // Учитываем погрешность (мы должны быть внутри диапазона при старте)
            if (colByX < selectionRange.c1) {
                colByX = selectionRange.c1;
            } else if (colByX > selectionRange.c2) {
                colByX = selectionRange.c2;
            }
            if (rowByY < selectionRange.r1) {
                rowByY = selectionRange.r1;
            } else if (rowByY > selectionRange.r2) {
                rowByY = selectionRange.r2;
            }
            this.startCellMoveRange = new asc_Range(colByX, rowByY, colByX, rowByY);
            this.startCellMoveRange.isChanged = false;	// Флаг, сдвигались ли мы от первоначального диапазона
            return ret;
        }

        // Разница, на сколько мы сдвинулись
        var colDelta = colByX - this.startCellMoveRange.c1;
        var rowDelta = rowByY - this.startCellMoveRange.r1;

        // Проверяем, нужно ли отрисовывать перемещение (сдвигались или нет)
        if (false === this.startCellMoveRange.isChanged && 0 === colDelta && 0 === rowDelta) {
            return ret;
        }
        // Выставляем флаг
        this.startCellMoveRange.isChanged = true;

        // Очищаем выделение, будем рисовать заново
        this.cleanSelection();

        this.activeMoveRange = selectionRange;
        // Для первого раза нормализуем (т.е. первая точка - это левый верхний угол)
        this.activeMoveRange.normalize();

        // Выставляем
        this.activeMoveRange.c1 += colDelta;
        if (0 > this.activeMoveRange.c1) {
            colDelta -= this.activeMoveRange.c1;
            this.activeMoveRange.c1 = 0;
        }
        this.activeMoveRange.c2 += colDelta;

        this.activeMoveRange.r1 += rowDelta;
        if (0 > this.activeMoveRange.r1) {
            rowDelta -= this.activeMoveRange.r1;
            this.activeMoveRange.r1 = 0;
        }
        this.activeMoveRange.r2 += rowDelta;

        // Увеличиваем, если выходим за область видимости // Critical Bug 17413
        while (!this.cols[this.activeMoveRange.c2]) {
            this.expandColsOnScroll(true);
            this.handlers.trigger("reinitializeScrollX");
        }
        while (!this.rows[this.activeMoveRange.r2]) {
            this.expandRowsOnScroll(true);
            this.handlers.trigger("reinitializeScrollY");
        }

        // Перерисовываем
        this._drawSelection();
        var d = {};
        /*var d = {
         deltaX : this.activeMoveRange.c1 < this.visibleRange.c1 ? this.activeMoveRange.c1-this.visibleRange.c1 :
         this.activeMoveRange.c2>this.visibleRange.c2 ? this.activeMoveRange.c2-this.visibleRange.c2 : 0,
         deltaY : this.activeMoveRange.r1 < this.visibleRange.r1 ? this.activeMoveRange.r1-this.visibleRange.r1 :
         this.activeMoveRange.r2>this.visibleRange.r2 ? this.activeMoveRange.r2-this.visibleRange.r2 : 0
         };
         while ( this._isColDrawnPartially( this.activeMoveRange.c2, this.visibleRange.c1 + d.deltaX) ) {++d.deltaX;}
         while ( this._isRowDrawnPartially( this.activeMoveRange.r2, this.visibleRange.r1 + d.deltaY) ) {++d.deltaY;}*/

        if (y <= this.cellsTop + this.height_2px) {
            d.deltaY = -1;
        } else if (y >= this.drawingCtx.getHeight() - this.height_2px) {
            d.deltaY = 1;
        }

        if (x <= this.cellsLeft + this.width_2px) {
            d.deltaX = -1;
        } else if (x >= this.drawingCtx.getWidth() - this.width_2px) {
            d.deltaX = 1;
        }

        this.model.workbook.handlers.trigger("asc_onHideComment");

        if (this.activeMoveRange.type === c_oAscSelectionType.RangeRow) {
            d.deltaX = 0;
        } else if (this.activeMoveRange.type === c_oAscSelectionType.RangeCol) {
            d.deltaY = 0;
        } else if (this.activeMoveRange.type === c_oAscSelectionType.RangeMax) {
            d.deltaX = 0;
            d.deltaY = 0;
        }

        return d;
    };

    WorksheetView.prototype.changeSelectionMoveResizeRangeHandle = function (x, y, targetInfo, editor) {
        // Возвращаемый результат
        if (!targetInfo) {
            return null;
        }
        var indexFormulaRange = targetInfo.indexFormulaRange, d = {deltaY: 0, deltaX: 0}, newFormulaRange = null;
        // Пересчитываем координаты
        x *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIX());
        y *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIY());
        var ar = (0 == targetInfo.targetArr ? this.arrActiveFormulaRanges[indexFormulaRange] :
          this.arrActiveChartRanges[indexFormulaRange]).getLast().clone();

        // Колонка по X и строка по Y
        var colByX = this._findColUnderCursor(x, /*canReturnNull*/false, false).col;
        var rowByY = this._findRowUnderCursor(y, /*canReturnNull*/false, false).row;

        // Если мы только первый раз попали сюда, то копируем выделенную область
        if (null === this.startCellMoveResizeRange) {
            if ((targetInfo.cursor == kCurNEResize || targetInfo.cursor == kCurSEResize)) {
                this.startCellMoveResizeRange = ar.clone(true);
                this.startCellMoveResizeRange2 =
                  new asc_Range(targetInfo.col, targetInfo.row, targetInfo.col, targetInfo.row, true);
            } else {
                this.startCellMoveResizeRange = ar.clone(true);
                if (colByX < ar.c1) {
                    colByX = ar.c1;
                } else if (colByX > ar.c2) {
                    colByX = ar.c2;
                }
                if (rowByY < ar.r1) {
                    rowByY = ar.r1;
                } else if (rowByY > ar.r2) {
                    rowByY = ar.r2;
                }
                this.startCellMoveResizeRange2 = new asc_Range(colByX, rowByY, colByX, rowByY);
            }
            return null;
        }

        // Очищаем выделение, будем рисовать заново
        // this.cleanSelection();
        this.overlayCtx.clear();

        if (targetInfo.cursor == kCurNEResize || targetInfo.cursor == kCurSEResize) {

            if (colByX < this.startCellMoveResizeRange2.c1) {
                ar.c2 = this.startCellMoveResizeRange2.c1;
                ar.c1 = colByX;
            } else if (colByX > this.startCellMoveResizeRange2.c1) {
                ar.c1 = this.startCellMoveResizeRange2.c1;
                ar.c2 = colByX;
            } else {
                ar.c1 = this.startCellMoveResizeRange2.c1;
                ar.c2 = this.startCellMoveResizeRange2.c1
            }

            if (rowByY < this.startCellMoveResizeRange2.r1) {
                ar.r2 = this.startCellMoveResizeRange2.r2;
                ar.r1 = rowByY;
            } else if (rowByY > this.startCellMoveResizeRange2.r1) {
                ar.r1 = this.startCellMoveResizeRange2.r1;
                ar.r2 = rowByY;
            } else {
                ar.r1 = this.startCellMoveResizeRange2.r1;
                ar.r2 = this.startCellMoveResizeRange2.r1;
            }

        } else {
            this.startCellMoveResizeRange.normalize();
            var colDelta = this.startCellMoveResizeRange.type != c_oAscSelectionType.RangeRow &&
            this.startCellMoveResizeRange.type != c_oAscSelectionType.RangeMax ?
            colByX - this.startCellMoveResizeRange2.c1 : 0;
            var rowDelta = this.startCellMoveResizeRange.type != c_oAscSelectionType.RangeCol &&
            this.startCellMoveResizeRange.type != c_oAscSelectionType.RangeMax ?
            rowByY - this.startCellMoveResizeRange2.r1 : 0;

            ar.c1 = this.startCellMoveResizeRange.c1 + colDelta;
            if (0 > ar.c1) {
                colDelta -= ar.c1;
                ar.c1 = 0;
            }
            ar.c2 = this.startCellMoveResizeRange.c2 + colDelta;

            ar.r1 = this.startCellMoveResizeRange.r1 + rowDelta;
            if (0 > ar.r1) {
                rowDelta -= ar.r1;
                ar.r1 = 0;
            }
            ar.r2 = this.startCellMoveResizeRange.r2 + rowDelta;

        }

        if (y <= this.cellsTop + this.height_2px) {
            d.deltaY = -1;
        } else if (y >= this.drawingCtx.getHeight() - this.height_2px) {
            d.deltaY = 1;
        }

        if (x <= this.cellsLeft + this.width_2px) {
            d.deltaX = -1;
        } else if (x >= this.drawingCtx.getWidth() - this.width_2px) {
            d.deltaX = 1;
        }

        if (this.startCellMoveResizeRange.type === c_oAscSelectionType.RangeRow) {
            d.deltaX = 0;
        } else if (this.startCellMoveResizeRange.type === c_oAscSelectionType.RangeCol) {
            d.deltaY = 0;
        } else if (this.startCellMoveResizeRange.type === c_oAscSelectionType.RangeMax) {
            d.deltaX = 0;
            d.deltaY = 0;
        }

        if (0 == targetInfo.targetArr) {
            var _p = this.arrActiveFormulaRanges[indexFormulaRange].cursorePos, _l = this.arrActiveFormulaRanges[indexFormulaRange].formulaRangeLength;
            this.arrActiveFormulaRanges[indexFormulaRange].getLast().assign2(ar.clone(true));
            this.arrActiveFormulaRanges[indexFormulaRange].cursorePos = _p;
            this.arrActiveFormulaRanges[indexFormulaRange].formulaRangeLength = _l;
            newFormulaRange = this.arrActiveFormulaRanges[indexFormulaRange].getLast();
        } else {
            this.arrActiveChartRanges[indexFormulaRange].getLast().assign2(ar.clone(true));
            this.moveRangeDrawingObjectTo = ar.clone();
        }
        this._drawSelection();

        if (newFormulaRange) {
            editor.changeCellRange(newFormulaRange);
        }

        return d;
    };

    WorksheetView.prototype._cleanSelectionMoveRange = function () {
        // Перерисовываем и сбрасываем параметры
        this.cleanSelection();
        this.activeMoveRange = null;
        this.startCellMoveRange = null;
        this._drawSelection();
    };

    /* Функция для применения перемещения диапазона */
    WorksheetView.prototype.applyMoveRangeHandle = function (ctrlKey) {
        if (null === this.activeMoveRange) {
            // Сбрасываем параметры
            this.startCellMoveRange = null;
            return;
        }

        var arnFrom = this.model.selectionRange.getLast();
        var arnTo = this.activeMoveRange.clone(true);
        if (arnFrom.isEqual(arnTo)) {
            this._cleanSelectionMoveRange();
            return;
        }

        var resmove = this.model._prepareMoveRange(arnFrom, arnTo);
        if (resmove === -2) {
            this.handlers.trigger("onErrorEvent", c_oAscError.ID.CannotMoveRange, c_oAscError.Level.NoCritical);
            this._cleanSelectionMoveRange();
        } else if (resmove === -1) {
            var t = this;
            this.model.workbook.handlers.trigger("asc_onConfirmAction", Asc.c_oAscConfirm.ConfirmReplaceRange,
              function (can) {
                  if (can) {
                      t.moveRangeHandle(arnFrom, arnTo, ctrlKey);
                  } else {
                      t._cleanSelectionMoveRange();
                  }
              });
        } else {
            this.moveRangeHandle(arnFrom, arnTo, ctrlKey);
        }
    };

    WorksheetView.prototype.applyMoveResizeRangeHandle = function ( target ) {
        if ( -1 == target.targetArr && !this.startCellMoveResizeRange.isEqual( this.moveRangeDrawingObjectTo ) ) {
            this.objectRender.moveRangeDrawingObject( this.startCellMoveResizeRange, this.moveRangeDrawingObjectTo );
        }

        this.startCellMoveResizeRange = null;
        this.startCellMoveResizeRange2 = null;
        this.moveRangeDrawingObjectTo = null;
    };

    WorksheetView.prototype.moveRangeHandle = function (arnFrom, arnTo, copyRange) {
        var t = this;
        var onApplyMoveRangeHandleCallback = function (isSuccess) {
            if (false === isSuccess) {
				t.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.LockedAllError, c_oAscError.Level.NoCritical);
                t._cleanSelectionMoveRange();
                return;
            }

            var onApplyMoveAutoFiltersCallback = function (isSuccess) {
                if (false === isSuccess) {
					t.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.LockedAllError, c_oAscError.Level.NoCritical);
                    t._cleanSelectionMoveRange();
                    return;
                }

                // Очищаем выделение
                t.cleanSelection();

                //ToDo t.cleanDepCells();
                History.Create_NewPoint();
                History.SetSelection(arnFrom.clone());
                History.SetSelectionRedo(arnTo.clone());
                History.StartTransaction();

                t.model.autoFilters._preMoveAutoFilters(arnFrom, arnTo, copyRange);

                t.model._moveRange(arnFrom, arnTo, copyRange);
                t.cellCommentator.moveRangeComments(arnFrom, arnTo, copyRange);
                t.objectRender.moveRangeDrawingObject(arnFrom, arnTo);

                // Вызываем функцию пересчета для заголовков форматированной таблицы
                t.model.autoFilters.renameTableColumn(arnFrom);
                t.model.autoFilters.renameTableColumn(arnTo);
                t.model.autoFilters.reDrawFilter(arnFrom);

                t.model.autoFilters.afterMoveAutoFilters(arnFrom, arnTo);

                t._updateCellsRange(arnTo, false, true);
                t.model.selectionRange.assign2(arnTo);
                // Сбрасываем параметры
                t.activeMoveRange = null;
                t.startCellMoveRange = null;
                t._updateCellsRange(arnFrom, false, true);
                // Тут будет отрисовка select-а
                t._recalculateAfterUpdate([arnFrom, arnTo]);

                // Вызовем на всякий случай, т.к. мы можем уже обновиться из-за формул ToDo возможно стоит убрать это в дальнейшем (но нужна переработка формул) - http://bugzilla.onlyoffice.com/show_bug.cgi?id=24505
                t._updateSelectionNameAndInfo();

                if (null !== t.model.getRange3(arnTo.r1, arnTo.c1, arnTo.r2, arnTo.c2).hasMerged() &&
                  false !== t.model.autoFilters._intersectionRangeWithTableParts(arnTo)) {
                    t.model.autoFilters.unmergeTablesAfterMove(arnTo);
                    t._updateCellsRange(arnTo, false, true);
                    t._recalculateAfterUpdate([arnFrom, arnTo]);
                    //не делаем действий в asc_onConfirmAction, потому что во время диалога может выполниться autosave и новые измения добавятся в точку, которую уже отправили
                    //тем более результат диалога ни на что не влияет
                    t.model.workbook.handlers.trigger("asc_onConfirmAction", Asc.c_oAscConfirm.ConfirmPutMergeRange,
                      function () {
                      });
                }

                History.EndTransaction();
            };

            if (t.model.autoFilters._searchFiltersInRange(arnFrom, true)) {
                t._isLockedAll(onApplyMoveAutoFiltersCallback);
				if(copyRange){
					t._isLockedDefNames(null, null);
				}
            } else {
                onApplyMoveAutoFiltersCallback();
            }
        };

        if (this.af_isCheckMoveRange(arnFrom, arnTo)) {
            this._isLockedCells([arnFrom, arnTo], null, onApplyMoveRangeHandleCallback);
        } else {
            this._cleanSelectionMoveRange();
        }
    };

    WorksheetView.prototype.emptySelection = function ( options ) {
        // Удаляем выделенные графичекие объекты
        if ( this.objectRender.selectedGraphicObjectsExists() ) {
            this.objectRender.controller.deleteSelectedObjects();
		} else {
            this.setSelectionInfo( "empty", options );
        }
    };

    WorksheetView.prototype.setSelectionInfo = function (prop, val, onlyActive, fromBinary, sortColor) {
        // Проверка глобального лока
        if (this.collaborativeEditing.getGlobalLock()) {
            return;
        }

        var t = this;
        var checkRange = [];
        var activeCell = this.model.selectionRange.activeCell.clone();
        var arn = this.model.selectionRange.getLast().clone(true);
        if (onlyActive) {
            checkRange.push(new asc_Range(activeCell.col, activeCell.row, activeCell.col, activeCell.row));
        } else {
            this.model.selectionRange.ranges.forEach(function (item) {
                checkRange.push(item.getAllRange());
            });
        }

        var onSelectionCallback = function (isSuccess) {
            if (false === isSuccess) {
                return;
            }
            var bIsUpdate = true;
            var oUpdateRanges = {}, hasUpdates = false;

            var callTrigger = false;
            var res;
            var mc, r, c, cell;

            function makeBorder(b) {
                var border = new AscCommonExcel.BorderProp();
                if (b === false) {
                    border.setStyle(c_oAscBorderStyles.None);
                } else if (b) {
                    if (b.style !== null && b.style !== undefined) {
                        border.setStyle(b.style);
                    }
                    if (b.color !== null && b.color !== undefined) {
                        if (b.color instanceof Asc.asc_CColor) {
                            border.c = AscCommonExcel.CorrectAscColor(b.color);
                        }
                    }
                }
                return border;
            }

            History.Create_NewPoint();
            History.StartTransaction();

            checkRange.forEach(function (item, i) {
                var range = t.model.getRange3(item.r1, item.c1, item.r2, item.c2);
                var isLargeRange = t._isLargeRange(range.bbox);
                var canChangeColWidth = c_oAscCanChangeColWidth.none;

                switch (prop) {
                    case "fn":
                        range.setFontname(val);
                        canChangeColWidth = c_oAscCanChangeColWidth.numbers;
                        break;
                    case "fs":
                        range.setFontsize(val);
                        canChangeColWidth = c_oAscCanChangeColWidth.numbers;
                        break;
                    case "b":
                        range.setBold(val);
                        break;
                    case "i":
                        range.setItalic(val);
                        break;
                    case "u":
                        range.setUnderline(val);
                        break;
                    case "s":
                        range.setStrikeout(val);
                        break;
                    case "fa":
                        range.setFontAlign(val);
                        break;
                    case "a":
                        range.setAlignHorizontal(val);
                        break;
                    case "va":
                        range.setAlignVertical(val);
                        break;
                    case "c":
                        range.setFontcolor(val);
                        break;
                    case "bc":
                        range.setFill((val) ? (val) : null);
                        break; // ToDo можно делать просто отрисовку
                    case "wrap":
                        range.setWrap(val);
                        break;
                    case "shrink":
                        range.setShrinkToFit(val);
                        break;
                    case "value":
                        range.setValue(val);
                        break;
                    case "format":
                        range.setNumFormat(val);
                        canChangeColWidth = c_oAscCanChangeColWidth.numbers;
                        break;
                    case "angle":
                        range.setAngle(val);
                        break;
                    case "rh":
                        range.removeHyperlink(null, true);
                        break;
                    case "border":
                        if (isLargeRange && !callTrigger) {
                            callTrigger = true;
                            t.handlers.trigger("slowOperation", true);
                        }
                        // None
                        if (val.length < 1) {
                            range.setBorder(null);
                            break;
                        }
                        res = new AscCommonExcel.Border();
                        // Diagonal
                        res.d = makeBorder(val[c_oAscBorderOptions.DiagD] || val[c_oAscBorderOptions.DiagU]);
                        res.dd = !!val[c_oAscBorderOptions.DiagD];
                        res.du = !!val[c_oAscBorderOptions.DiagU];
                        // Vertical
                        res.l = makeBorder(val[c_oAscBorderOptions.Left]);
                        res.iv = makeBorder(val[c_oAscBorderOptions.InnerV]);
                        res.r = makeBorder(val[c_oAscBorderOptions.Right]);
                        // Horizontal
                        res.t = makeBorder(val[c_oAscBorderOptions.Top]);
                        res.ih = makeBorder(val[c_oAscBorderOptions.InnerH]);
                        res.b = makeBorder(val[c_oAscBorderOptions.Bottom]);
                        // Change border
                        range.setBorder(res);
                        break;
                    case "merge":
                        if (isLargeRange && !callTrigger) {
                            callTrigger = true;
                            t.handlers.trigger("slowOperation", true);
                        }
                        switch (val) {
                            case c_oAscMergeOptions.MergeCenter:
                            case c_oAscMergeOptions.Merge:
                                range.merge(val);
                                t.cellCommentator.mergeComments(range.getBBox0());
                                break;
                            case c_oAscMergeOptions.Unmerge:
                                range.unmerge();
                                break;
                            case c_oAscMergeOptions.MergeAcross:
                                for (res = arn.r1; res <= arn.r2; ++res) {
                                    t.model.getRange3(res, arn.c1, res, arn.c2).merge(val);
                                    cell = new asc_Range(arn.c1, res, arn.c2, res);
                                    t.cellCommentator.mergeComments(cell);
                                }
                                break;
                        }
                        break;

                    case "sort":
                        if (isLargeRange && !callTrigger) {
                            callTrigger = true;
                            t.handlers.trigger("slowOperation", true);
                        }
                        t.cellCommentator.sortComments(range.sort(val, activeCell.col, sortColor, true));
                        break;

                    case "empty":
                        if (isLargeRange && !callTrigger) {
                            callTrigger = true;
                            t.handlers.trigger("slowOperation", true);
                        }
                        /* отключаем отрисовку на случай необходимости пересчета ячеек, заносим ячейку, при необходимости в список перерисовываемых */
                        t.model.workbook.dependencyFormulas.lockRecal();

                        // Если нужно удалить автофильтры - удаляем
                        if (val === c_oAscCleanOptions.All || val === c_oAscCleanOptions.Text) {
                            t.model.autoFilters.isEmptyAutoFilters(arn);
                        } else if (val === c_oAscCleanOptions.Format) {
                            t.model.autoFilters.cleanFormat(arn);
                        }

                        switch(val) {
							case c_oAscCleanOptions.All:
                            range.cleanAll();
								t.model.removeSparklines(arn);
                            // Удаляем комментарии
                            t.cellCommentator.deleteCommentsRange(arn);
								break;
							case c_oAscCleanOptions.Text:
							case c_oAscCleanOptions.Formula:
                            range.cleanText();
								break;
							case c_oAscCleanOptions.Format:
                            range.cleanFormat();
								break;
							case c_oAscCleanOptions.Comments:
                            t.cellCommentator.deleteCommentsRange(arn);
								break;
							case c_oAscCleanOptions.Hyperlinks:
                            range.cleanHyperlinks();
								break;
							case c_oAscCleanOptions.Sparklines:
								t.model.removeSparklines(arn);
								break;
							case c_oAscCleanOptions.SparklineGroups:
								t.model.removeSparklineGroups(arn);
								break;
                        }

                        // Вызываем функцию пересчета для заголовков форматированной таблицы
                        if (val === c_oAscCleanOptions.All || val === c_oAscCleanOptions.Text) {
                            t.model.autoFilters.renameTableColumn(arn);
                        }

                        /* возвращаем отрисовку. и перерисовываем ячейки с предварительным пересчетом */
                        t.model.workbook.dependencyFormulas.unlockRecal();
                        break;

                    case "changeDigNum":
                        res = t.cols.slice(arn.c1, arn.c2 + 1).reduce(function (r, c) {
                            r.push(c.charCount);
                            return r;
                        }, []);
                        range.shiftNumFormat(val, res);
                        canChangeColWidth = c_oAscCanChangeColWidth.numbers;
                        break;
                    case "changeFontSize":
                        mc = t.model.getMergedByCell(activeCell.row, activeCell.col);
                        c = mc ? mc.c1 : activeCell.col;
                        r = mc ? mc.r1 : activeCell.row;
                        cell = t._getVisibleCell(c, r);
						var oldFontSize = cell.getFont().getSize();
                            var newFontSize = asc_incDecFonSize(val, oldFontSize);
                            if (null !== newFontSize) {
                                range.setFontsize(newFontSize);
                                canChangeColWidth = c_oAscCanChangeColWidth.numbers;
                            }
                        break;
                    case "style":
                        range.setCellStyle(val);
                        canChangeColWidth = c_oAscCanChangeColWidth.numbers;
                        break;
                        break;
                    case "paste":
                        // Вставляем текст из локального буфера или нет
                        fromBinary ? t._pasteData(isLargeRange, fromBinary, val, bIsUpdate, canChangeColWidth) :
                          t._loadDataBeforePaste(isLargeRange, fromBinary, val, bIsUpdate, canChangeColWidth);
                        bIsUpdate = false;
                        break;
                    case "hyperlink":
                        if (val && val.hyperlinkModel) {
                            if (Asc.c_oAscHyperlinkType.RangeLink === val.asc_getType()) {
                                var hyperlinkRangeTmp = t.model.getRange2(val.asc_getRange());
                                if (null === hyperlinkRangeTmp) {
                                    bIsUpdate = false;
                                    break;
                                }
                            }
                            val.hyperlinkModel.Ref = range;
                            range.setHyperlink(val.hyperlinkModel);
                            // Вставим текст в активную ячейку (а не так, как MSExcel в первую ячейку диапазона)
                            mc = t.model.getMergedByCell(activeCell.row, activeCell.col);
                            c = mc ? mc.c1 : activeCell.col;
                            r = mc ? mc.r1 : activeCell.row;
                            if (null !== val.asc_getText()) {
                                t.model.getRange3(r, c, r, c).setValue(val.asc_getText());
                                // Вызываем функцию пересчета для заголовков форматированной таблицы
                                t.model.autoFilters.renameTableColumn(arn);
                            }
                            break;
                        } else {
                            bIsUpdate = false;
                            break;
                        }

                    default:
                        bIsUpdate = false;
                        break;
                }

                if (bIsUpdate) {
                    hasUpdates = true;
                    oUpdateRanges[i] = item;
                    oUpdateRanges[i].canChangeColWidth = canChangeColWidth;
                    bIsUpdate = false;
                }
            });

            if (hasUpdates) {
                t.updateRanges(oUpdateRanges, false, true);
            }
            if (callTrigger) {
                t.handlers.trigger("slowOperation", false);
            }

            //в случае, если вставляем из глобального буфера, транзакцию закрываем внутри функции _loadDataBeforePaste на callbacks от загрузки шрифтов и картинок
            if (prop !== "paste" || (prop === "paste" && fromBinary)) {
                History.EndTransaction();
            }
        };
        if ("paste" === prop && val.onlyImages !== true) {
            // Для past свой диапазон
            var newRange;
            if (fromBinary) {
                newRange = this._pasteFromBinary(val, true);
            } else {
                newRange = this._pasteFromHTML(val, true);
            }
            checkRange = [newRange];
        }
        if ("paste" === prop && val.onlyImages === true) {
            onSelectionCallback();
        } else {
            this._isLockedCells(checkRange, /*subType*/null, onSelectionCallback);
        }
    };

    WorksheetView.prototype._pasteData = function (isLargeRange, fromBinary, val, bIsUpdate, canChangeColWidth) {
        var t = this;
        var callTrigger = false;
        if (isLargeRange) {
            callTrigger = true;
            t.handlers.trigger("slowOperation", true);
        }

		//добавляем форматированные таблицы
        var arnToRange = t.model.selectionRange.getLast();
        var tablesMap = null;
        if (fromBinary && val.TableParts && val.TableParts.length) {
            var range, tablePartRange, tables = val.TableParts, diffRow, diffCol, curTable, bIsAddTable;
            var activeRange = window["Asc"]["editor"].wb.clipboard.pasteProcessor.activeRange;
            var refInsertBinary = AscCommonExcel.g_oRangeCache.getAscRange(activeRange);
            for (var i = 0; i < tables.length; i++) {
                curTable = tables[i];
                tablePartRange = curTable.Ref;
                diffRow = tablePartRange.r1 - refInsertBinary.r1 + arnToRange.r1;
                diffCol = tablePartRange.c1 - refInsertBinary.c1 + arnToRange.c1;
                range = t.model.getRange3(diffRow, diffCol, diffRow + (tablePartRange.r2 - tablePartRange.r1),
                    diffCol + (tablePartRange.c2 - tablePartRange.c1));

                //если область вставки содержит форматированную таблицу, которая пересекается с вставляемой форматированной таблицей
                var intersectionRangeWithTableParts = t.model.autoFilters._intersectionRangeWithTableParts(range.bbox);
                if (intersectionRangeWithTableParts) {
                    continue;
                }

                if (curTable.style) {
                    range.cleanFormat();
                }

                //TODO использовать bWithoutFilter из tablePart
                var bWithoutFilter = false;
                if (!curTable.AutoFilter) {
                    bWithoutFilter = true;
                }

                var offset = {
                    offsetCol: range.bbox.c1 - tablePartRange.c1,
                    offsetRow: range.bbox.r1 - tablePartRange.r1
                };
                var newDisplayName = this.model.workbook.dependencyFormulas.getNextTableName();
                var props = {
                    bWithoutFilter: bWithoutFilter,
                    tablePart: curTable,
                    offset: offset,
                    displayName: newDisplayName
                };
                t.model.autoFilters.addAutoFilter(curTable.TableStyleInfo.Name, range.bbox, true, true, props);
                if (null === tablesMap) {
                    tablesMap = {};
                }

                tablesMap[curTable.DisplayName] = newDisplayName;
            }

			if(bIsAddTable)
			{
				t._isLockedDefNames(null, null);
			}
        }

        //делаем unmerge ф/т
        var intersectionRangeWithTableParts = t.model.autoFilters._intersectionRangeWithTableParts(arnToRange);
        if (intersectionRangeWithTableParts && intersectionRangeWithTableParts.length) {
            var tablePart;
            for (var i = 0; i < intersectionRangeWithTableParts.length; i++) {
                tablePart = intersectionRangeWithTableParts[i];
                this.model.getRange3(tablePart.Ref.r1, tablePart.Ref.c1, tablePart.Ref.r2, tablePart.Ref.c2).unmerge();
            }
        }

        t.model.workbook.dependencyFormulas.lockRecal();
        var selectData;
        if (fromBinary) {
            selectData = t._pasteFromBinary(val, null, tablesMap);
        } else {
            selectData = t._pasteFromHTML(val);
        }

        t.model.autoFilters.renameTableColumn(t.model.selectionRange.getLast());

        if (!selectData) {
            bIsUpdate = false;
            t.model.workbook.dependencyFormulas.unlockRecal();
            if (callTrigger) {
                t.handlers.trigger("slowOperation", false);
            }
            return;
        }

        this.expandColsOnScroll(false, true);
        this.expandRowsOnScroll(false, true);

        var arrFormula = selectData[1];
        for (var i = 0; i < arrFormula.length; ++i) {
            var rangeF = arrFormula[i].range;
            var valF = arrFormula[i].val;
            if (rangeF.isOneCell()) {
                rangeF.setValue(valF, null, true);
            } else {
                var oBBox = rangeF.getBBox0();
                t.model._getCell(oBBox.r1, oBBox.c1).setValue(valF, null, true);
            }
        }

        t.model.workbook.dependencyFormulas.unlockRecal();
        var arn = selectData[0];
        var selectionRange = arn.clone(true);

        if (bIsUpdate) {
            if (callTrigger) {
                t.handlers.trigger("slowOperation", false);
            }
            t.isChanged = true;
            t._updateCellsRange(arn, canChangeColWidth);
        }

        var oSelection = History.GetSelection();
        if (null != oSelection) {
            oSelection = oSelection.clone();
            oSelection.assign(selectionRange.c1, selectionRange.r1, selectionRange.c2, selectionRange.r2);
            History.SetSelection(oSelection);
            History.SetSelectionRedo(oSelection);
        }
    };

    WorksheetView.prototype._loadDataBeforePaste = function ( isLargeRange, fromBinary, pasteContent, bIsUpdate, canChangeColWidth ) {
        var t = this;

        //загрузка шрифтов, в случае удачи на callback вставляем текст
        t._loadFonts( pasteContent.props.fontsNew, function () {

            var api = asc["editor"];
            var isEndTransaction = false;

			if ( pasteContent.props.addImagesFromWord && pasteContent.props.addImagesFromWord.length != 0 && !(window["Asc"]["editor"] && window["Asc"]["editor"].isChartEditor) )
			{
                var oObjectsForDownload = AscCommon.GetObjectsForImageDownload( pasteContent.props._aPastedImages );

                //if already load images on server
                if ( api.wb.clipboard.pasteProcessor.alreadyLoadImagesOnServer === true )
				{
                    var oImageMap = {};
                    for ( var i = 0, length = oObjectsForDownload.aBuilderImagesByUrl.length; i < length; ++i )
					{
                        var url = oObjectsForDownload.aUrls[i];

                        //get name from array already load on server urls
                        var name = api.wb.clipboard.pasteProcessor.oImages[url];
                        var aImageElem = oObjectsForDownload.aBuilderImagesByUrl[i];
                        if ( name ) {
                            if ( Array.isArray( aImageElem ) ) {
                                for ( var j = 0; j < aImageElem.length; ++j ) {
                                    var imageElem = aImageElem[j];
                                    if ( null != imageElem ) {
                                        imageElem.SetUrl( name );
                                    }
                                }
                            }
                            oImageMap[i] = name;
                        }
                        else {
                            oImageMap[i] = url;
                        }
                    }

                    if ( pasteContent.props.onlyImages !== true )
					{
                        t._pasteData( isLargeRange, fromBinary, pasteContent, bIsUpdate, canChangeColWidth );
                    }
                    api.wb.clipboard.pasteProcessor._insertImagesFromBinaryWord( t, pasteContent, oImageMap );
                    isEndTransaction = true;
                }
                else
				{
					if(window["NATIVE_EDITOR_ENJINE"])
					{
						var oImageMap = {};
						AscCommon.ResetNewUrls( data, oObjectsForDownload.aUrls, oObjectsForDownload.aBuilderImagesByUrl, oImageMap );

						if ( pasteContent.props.onlyImages !== true )
						{
							t._pasteData( isLargeRange, fromBinary, pasteContent, bIsUpdate, canChangeColWidth );
						}
						api.wb.clipboard.pasteProcessor._insertImagesFromBinaryWord( t, pasteContent, oImageMap );

						isEndTransaction = true;
					}
					else
					{
						AscCommon.sendImgUrls( api, oObjectsForDownload.aUrls, function ( data ) {
							var oImageMap = {};
							AscCommon.ResetNewUrls( data, oObjectsForDownload.aUrls, oObjectsForDownload.aBuilderImagesByUrl, oImageMap );

							if ( pasteContent.props.onlyImages !== true ) {
								t._pasteData( isLargeRange, fromBinary, pasteContent, bIsUpdate, canChangeColWidth );
							}
							api.wb.clipboard.pasteProcessor._insertImagesFromBinaryWord( t, pasteContent, oImageMap );
							//закрываем транзакцию, поскольку в setSelectionInfo она не закроется
							History.EndTransaction();
						}, true );
					}

                }
            }
            else if ( pasteContent.props.onlyImages !== true )
			{
                t._pasteData( isLargeRange, fromBinary, pasteContent, bIsUpdate, canChangeColWidth );
                isEndTransaction = true;
            }

            //закрываем транзакцию, поскольку в setSelectionInfo она не закроется
            if ( isEndTransaction )
			{
                History.EndTransaction();
            }
        } );
    };

    WorksheetView.prototype._pasteFromHTML = function (pasteContent, isCheckSelection) {
        var t = this;
        var wb = window["Asc"]["editor"].wb;
        var lastSelection = this.model.selectionRange.getLast();
        var arn = wb && wb.clipboard && wb.clipboard.pasteProcessor && wb.clipboard.pasteProcessor.activeRange ?
          wb.clipboard.pasteProcessor.activeRange : lastSelection;

        var arrFormula = [];
        var numFor = 0;
        var rMax = pasteContent.content.length + pasteContent.props.rowSpanSpCount;
        if (pasteContent.props.rowCount && pasteContent.props.rowCount !== 0 && pasteContent.props.isOneTable) {
            rMax = pasteContent.props.rowCount + arn.r1;
        }

        var cMax = pasteContent.props.cellCount + arn.c1;

        var isMultiple = false;
        var firstCell = t.model.getRange3(arn.r1, arn.c1, arn.r1, arn.c1);
        var isMergedFirstCell = firstCell.hasMerged();
        var rangeUnMerge = t.model.getRange3(arn.r1, arn.c1, rMax - 1, cMax - 1);
        var isOneMerge = false;


        //если вставляем в мерженную ячейку, диапазон которой больше или равен
        if (arn.c2 >= cMax - 1 && arn.r2 >= rMax - 1 && isMergedFirstCell && isMergedFirstCell.c1 === arn.c1 &&
          isMergedFirstCell.c2 === arn.c2 && isMergedFirstCell.r1 === arn.r1 && isMergedFirstCell.r2 === arn.r2 &&
          cMax - arn.c1 === pasteContent.content[arn.r1][arn.c1].colSpan &&
          rMax - arn.r1 === pasteContent.content[arn.r1][arn.c1].rowSpan) {
            if (!isCheckSelection) {
                pasteContent.content[arn.r1][arn.c1].colSpan = isMergedFirstCell.c2 - isMergedFirstCell.c1 + 1;
                pasteContent.content[arn.r1][arn.c1].rowSpan = isMergedFirstCell.r2 - isMergedFirstCell.r1 + 1;
            }
            isOneMerge = true;
        } else if (arn.c2 >= cMax - 1 && arn.r2 >= rMax - 1 && pasteContent.props.isOneTable) {
            //если область кратная куску вставки
            var widthArea = arn.c2 - arn.c1 + 1;
            var heightArea = arn.r2 - arn.r1 + 1;
            var widthPasteFr = cMax - arn.c1;
            var heightPasteFr = rMax - arn.r1;
            //если кратны, то обрабатываем
            if (widthArea % widthPasteFr === 0 && heightArea % heightPasteFr === 0) {
                isMultiple = true;
            } else if (firstCell.hasMerged() !== null)//в противном случае ошибка
            {
                if (isCheckSelection) {
                    return arn;
                } else {
                    this.handlers.trigger("onError", c_oAscError.ID.PastInMergeAreaError, c_oAscError.Level.NoCritical);
                    return;
                }
            }
        } else {
            //проверка на наличие части объединённой ячейки в области куда осуществляем вставку
            for (var rFirst = arn.r1; rFirst < rMax; ++rFirst) {
                for (var cFirst = arn.c1; cFirst < cMax; ++cFirst) {
                    range = t.model.getRange3(rFirst, cFirst, rFirst, cFirst);
                    var merged = range.hasMerged();
                    if (merged) {
                        if (merged.r1 < arn.r1 || merged.r2 > rMax - 1 || merged.c1 < arn.c1 || merged.c2 > cMax - 1) {
                            //ошибка в случае если вставка происходит в часть объедененной ячейки
                            if (isCheckSelection) {
                                return arn;
                            } else {
                                this.handlers.trigger("onErrorEvent", c_oAscError.ID.PastInMergeAreaError,
                                  c_oAscError.Level.NoCritical);
                                return;
                            }
                        }
                    }
                }
            }
        }

        var rMax2 = rMax;
        var cMax2 = cMax;
        var rMax = pasteContent.content.length;
        if (isCheckSelection) {
            var newArr = arn.clone(true);
            newArr.r2 = rMax2 - 1;
            newArr.c2 = cMax2 - 1;
            if (isMultiple || isOneMerge) {
                newArr.r2 = lastSelection.r2;
                newArr.c2 = lastSelection.c2;
            }
            return newArr;
        }

        //если не возникает конфликт, делаем unmerge
        rangeUnMerge.unmerge();

        if (!isOneMerge) {
            arn.r2 = (rMax2 - 1 > 0) ? (rMax2 - 1) : 0;
            arn.c2 = (cMax2 - 1 > 0) ? (cMax2 - 1) : 0;
        }

        var n = 0;
        if (isMultiple)//случай автозаполнения сложных форм
        {
            t.model.getRange3(lastSelection.r1, lastSelection.c1, lastSelection.r2, lastSelection.c2).unmerge();
            var maxARow = heightArea / heightPasteFr;
            var maxACol = widthArea / widthPasteFr;
            var plRow = (rMax2 - arn.r1);
            var plCol = (arn.c2 - arn.c1) + 1;
        } else {
            var maxARow = 1;
            var maxACol = 1;
            var plRow = 0;
            var plCol = 0;
        }

        if (isMultiple) {
            if (pasteContent.content[arn.r1] && pasteContent.content[arn.r1][arn.c1]) {
                var currentObj = pasteContent.content[arn.r1][arn.c1].content[0];
                var valFormat = '';
                if (currentObj[0] !== undefined) {
                    valFormat = currentObj[0].text;
                }
            }
        }

        var mergeArr = [];
        for (var autoR = 0; autoR < maxARow; ++autoR) {
            for (var autoC = 0; autoC < maxACol; ++autoC) {
                for (var r = arn.r1; r < rMax; ++r) {
                    for (var c = arn.c1; c < pasteContent.content[r].length; ++c) {
                        if (undefined !== pasteContent.content[r][c]) {
                            var range = t.model.getRange3(r + autoR * plRow, c + autoC * plCol, r + autoR * plRow,
                              c + autoC * plCol);

                            var currentObj = pasteContent.content[r][c];
                            var contentCurrentObj = currentObj.content;
                            if (contentCurrentObj.length === 1) {
                                var onlyChild = contentCurrentObj[0];
                                var valFormat = onlyChild.text;
                                var nameFormat = false;

                                if (onlyChild.cellFrom) {
                                    var offset = range.getCells()[0].getOffset2(
                                      onlyChild.cellFrom), assemb, _p_ = new AscCommonExcel.parserFormula(onlyChild.text.substring(
                                      1), null, range.worksheet);

                                    if (_p_.parse()) {
                                        assemb = _p_.changeOffset(offset).assemble(true);
                                        //range.setValue("="+assemb);
                                        arrFormula[numFor] = {};
                                        arrFormula[numFor].range = range;
                                        arrFormula[numFor].val = "=" + assemb;
                                        numFor++;
                                    }
                                } else {
                                    range.setValue(valFormat);
                                }

                                if (nameFormat) {
                                    range.setNumFormat(nameFormat);
                                }
                                range.setFont(onlyChild.format);
                            } else {
                                range.setValue2(contentCurrentObj);
                                range.setAlignVertical(currentObj.va);
                            }

                            if (contentCurrentObj.length === 1 && contentCurrentObj[0].format) {
                                var fs = contentCurrentObj[0].format.getSize();
                                if (fs !== '' && fs !== null && fs !== undefined) {
                                    range.setFontsize(fs);
                            }
                            }
                            if (!isOneMerge) {
                                range.setAlignHorizontal(currentObj.a);
                            }
                            var isMerged = false;
                            for (var mergeCheck = 0; mergeCheck < mergeArr.length; ++mergeCheck) {
                                if (mergeArr[mergeCheck].contains(c + autoC * plCol, r + autoR * plRow)) {
                                    isMerged = true;
                                }
                            }

                            //обработка для мерженных ячеек
                            if ((currentObj.colSpan > 1 || currentObj.rowSpan > 1) && !isMerged) {
                                range.setOffsetLast(
                                  {offsetCol: currentObj.colSpan - 1, offsetRow: currentObj.rowSpan - 1});
                                mergeArr[n] = range.getBBox0();
                                n++;
                                if (contentCurrentObj[0] == undefined) {
                                    range.setValue('');
                                }
                                range.merge(c_oAscMergeOptions.Merge);
                            }

                            if (!isOneMerge) {
                                range.setBorderSrc(currentObj.borders);
                            }
                            range.setWrap(currentObj.wrap);
                            if (currentObj.bc && currentObj.bc.rgb) {
                                range.setFill(currentObj.bc);
                            }

                            var link = pasteContent.content[r][c].hyperLink;
                            if (link) {
                                var newHyperlink = new AscCommonExcel.Hyperlink();
                                if (pasteContent.content[r][c].hyperLink.search('#') === 0) {
                                    newHyperlink.setLocation(link.replace('#', ''));
                                } else {
                                    newHyperlink.Hyperlink = link;
                                }
                                newHyperlink.Ref = range;
                                newHyperlink.Tooltip = pasteContent.content[r][c].toolTip;
                                range.setHyperlink(newHyperlink);
                            }
                        }
                    }
                }
            }
        }

        if (isMultiple) {
            arn.r2 = lastSelection.r2;
            arn.c2 = lastSelection.c2;
        }

        t.isChanged = true;
        lastSelection.c2 = arn.c2;
        lastSelection.r2 = arn.r2;
        var arnFor = [];
        arnFor[0] = arn;
        arnFor[1] = arrFormula;
        return arnFor;
    };

    WorksheetView.prototype._pasteFromBinary = function (val, isCheckSelection, tablesMap) {
        var t = this;
        var arn = t.model.selectionRange.getLast();
        var arrFormula = [];
        var numFor = 0;

        var pasteRange = window["Asc"]["editor"].wb.clipboard.pasteProcessor.activeRange;
        var activeCellsPasteFragment = AscCommonExcel.g_oRangeCache.getAscRange(pasteRange);
        var rMax = (activeCellsPasteFragment.r2 - activeCellsPasteFragment.r1) + arn.r1 + 1;
        var cMax = (activeCellsPasteFragment.c2 - activeCellsPasteFragment.c1) + arn.c1 + 1;

        if (cMax > gc_nMaxCol0) {
            cMax = gc_nMaxCol0;
        }
        if (rMax > gc_nMaxRow0) {
            rMax = gc_nMaxRow0;
        }

        var isMultiple = false;
        var firstCell = t.model.getRange3(arn.r1, arn.c1, arn.r1, arn.c1);
        var isMergedFirstCell = firstCell.hasMerged();
        var isOneMerge = false;


        var startCell = val.getCell3(activeCellsPasteFragment.r1, activeCellsPasteFragment.c1);
        var isMergedStartCell = startCell.hasMerged();

        var firstValuesCol;
        var firstValuesRow;
        if (isMergedStartCell != null) {
            firstValuesCol = isMergedStartCell.c2 - isMergedStartCell.c1;
            firstValuesRow = isMergedStartCell.r2 - isMergedStartCell.r1;
        } else {
            firstValuesCol = 0;
            firstValuesRow = 0;
        }

        var rowDiff = arn.r1 - activeCellsPasteFragment.r1;
        var colDiff = arn.c1 - activeCellsPasteFragment.c1;
        var newPasteRange = new Asc.Range(arn.c1 - colDiff, arn.r1 - rowDiff, arn.c2 - colDiff, arn.r2 - rowDiff);
        //если вставляем в мерженную ячейку, диапазон которой больше или меньше, но не равен выделенной области
        if (isMergedFirstCell && isMergedFirstCell.isEqual(arn) && cMax - arn.c1 === (firstValuesCol + 1) &&
          rMax - arn.r1 === (firstValuesRow + 1) && !newPasteRange.isEqual(activeCellsPasteFragment)) {
            isOneMerge = true;
            rMax = arn.r2 + 1;
            cMax = arn.c2 + 1;
        } else if (arn.c2 >= cMax - 1 && arn.r2 >= rMax - 1) {
            //если область кратная куску вставки
            var widthArea = arn.c2 - arn.c1 + 1;
            var heightArea = arn.r2 - arn.r1 + 1;
            var widthPasteFr = cMax - arn.c1;
            var heightPasteFr = rMax - arn.r1;
            //если кратны, то обрабатываем
            if (widthArea % widthPasteFr === 0 && heightArea % heightPasteFr === 0) {
                isMultiple = true;
            } else if (firstCell.hasMerged() !== null)//в противном случае ошибка
            {
                if (isCheckSelection) {
                    return arn;
                } else {
                    this.handlers.trigger("onError", c_oAscError.ID.PastInMergeAreaError, c_oAscError.Level.NoCritical);
                    return;
                }
            }
        } else {
            //проверка на наличие части объединённой ячейки в области куда осуществляем вставку
            for (var rFirst = arn.r1; rFirst < rMax; ++rFirst) {
                for (var cFirst = arn.c1; cFirst < cMax; ++cFirst) {
                    range = t.model.getRange3(rFirst, cFirst, rFirst, cFirst);
                    var merged = range.hasMerged();
                    if (merged) {
                        if (merged.r1 < arn.r1 || merged.r2 > rMax - 1 || merged.c1 < arn.c1 || merged.c2 > cMax - 1) {
                            //ошибка в случае если вставка происходит в часть объедененной ячейки
                            if (isCheckSelection) {
                                return arn;
                            } else {
                                this.handlers.trigger("onErrorEvent", c_oAscError.ID.PastInMergeAreaError,
                                  c_oAscError.Level.NoCritical);
                                return;
                            }
                        }
                    }
                }
            }
        }

        var rangeUnMerge = t.model.getRange3(arn.r1, arn.c1, rMax - 1, cMax - 1);

        var rMax2 = rMax;
        var cMax2 = cMax;
        //var rMax = values.length;
        if (isCheckSelection) {
            var newArr = arn.clone(true);
            newArr.r2 = rMax2 - 1;
            newArr.c2 = cMax2 - 1;
            if (isMultiple || isOneMerge) {
                newArr.r2 = arn.r2;
                newArr.c2 = arn.c2;
            }
            return newArr;
        }
        //если не возникает конфликт, делаем unmerge
        rangeUnMerge.unmerge();
        if (!isOneMerge) {
            arn.r2 = rMax2 - 1;
            arn.c2 = cMax2 - 1;
        }

        var mergeArr = [];

        var n = 0;
        if (isMultiple)//случай автозаполнения сложных форм
        {
            t.model.getRange3(arn.r1, arn.c1, arn.r2, arn.c2).unmerge();
            var maxARow = heightArea / heightPasteFr;
            var maxACol = widthArea / widthPasteFr;
            var plRow = (rMax2 - arn.r1);
            var plCol = (arn.c2 - arn.c1) + 1;
        } else {
            var maxARow = 1;
            var maxACol = 1;
            var plRow = 0;
            var plCol = 0;
        }

        var newVal;
        var curMerge;
        var nRow, nCol;
        for (var autoR = 0; autoR < maxARow; ++autoR) {
            for (var autoC = 0; autoC < maxACol; ++autoC) {
                for (var r = arn.r1; r < rMax; ++r) {
                    for (var c = arn.c1; c < cMax; ++c) {
                        var pasteRow = r - arn.r1 + activeCellsPasteFragment.r1;
                        var pasteCol = c - arn.c1 + activeCellsPasteFragment.c1;
                        newVal = val.getCell3(pasteRow, pasteCol);

                        curMerge = newVal.hasMerged();

                        if (undefined !== newVal) {
                            var isMerged = false, mergeCheck;

                            nRow = r + autoR * plRow;
                            if (nRow > gc_nMaxRow0) {
                                nRow = gc_nMaxRow0;
                            }
                            nCol = c + autoC * plCol;
                            if (nCol > gc_nMaxCol0) {
                                nCol = gc_nMaxCol0;
                            }

                            var range = t.model.getRange3(nRow, nCol, nRow, nCol);
                            //range может далее изменится в связи с наличием мерженных ячеек, firstRange  - не меняется(ему делаем setValue, как первой ячейке в диапазоне мерженных)
                            var firstRange = range.clone();

                            //****paste comments****
                            if (val.aComments && val.aComments.length) {
                                var comment;
                                for (var i = 0; i < val.aComments.length; i++) {
                                    comment = val.aComments[i];
                                    if (comment.nCol == pasteCol && comment.nRow == pasteRow) {
                                        var commentData = new Asc.asc_CCommentData(comment);
                                        //change nRow, nCol
                                        commentData.asc_putCol(c + autoC * plCol);
                                        commentData.asc_putRow(r + autoR * plRow);
                                        t.cellCommentator.addComment(commentData, true);
                                    }
                                }
                            }

                            if (!isOneMerge) {
                                for (mergeCheck = 0; mergeCheck < mergeArr.length; ++mergeCheck) {
                                    if (r + autoR * plRow <= mergeArr[mergeCheck].r2 &&
                                      r + autoR * plRow >= mergeArr[mergeCheck].r1 &&
                                      c + autoC * plCol <= mergeArr[mergeCheck].c2 &&
                                      c + autoC * plCol >= mergeArr[mergeCheck].c1) {
                                        isMerged = true;
                                    }
                                }
                                if (curMerge != null && !isMerged) {
                                    var offsetCol = curMerge.c2 - curMerge.c1;
                                    if (offsetCol + c + autoC * plCol >= gc_nMaxCol0) {
                                        offsetCol = gc_nMaxCol0 - (c + autoC * plCol);
                                    }

                                    var offsetRow = curMerge.r2 - curMerge.r1;
                                    if (offsetRow + r + autoR * plRow >= gc_nMaxRow0) {
                                        offsetRow = gc_nMaxRow0 - (r + autoR * plRow);
                                    }

                                    range.setOffsetLast({offsetCol: offsetCol, offsetRow: offsetRow});
                                    range.merge(c_oAscMergeOptions.Merge);
                                    mergeArr[n] = {
                                        r1: curMerge.r1 + arn.r1 - activeCellsPasteFragment.r1 + autoR * plRow,
                                        r2: curMerge.r2 + arn.r1 - activeCellsPasteFragment.r1 + autoR * plRow,
                                        c1: curMerge.c1 + arn.c1 - activeCellsPasteFragment.c1 + autoC * plCol,
                                        c2: curMerge.c2 + arn.c1 - activeCellsPasteFragment.c1 + autoC * plCol
                                    };
                                    n++;
                                }
                            } else {
                                for (mergeCheck = 0; mergeCheck < mergeArr.length; ++mergeCheck) {
                                    if (r + autoR * plRow <= mergeArr[mergeCheck].r2 &&
                                      r + autoR * plRow >= mergeArr[mergeCheck].r1 &&
                                      c + autoC * plCol <= mergeArr[mergeCheck].c2 &&
                                      c + autoC * plCol >= mergeArr[mergeCheck].c1) {
                                        isMerged = true;
                                    }
                                }
                                if (!isMerged) {
                                    range.setOffsetLast({
                                        offsetCol: (isMergedFirstCell.c2 - isMergedFirstCell.c1),
                                        offsetRow: (isMergedFirstCell.r2 - isMergedFirstCell.r1)
                                    });
                                    range.merge(c_oAscMergeOptions.Merge);
                                    mergeArr[n] = {
                                        r1: isMergedFirstCell.r1,
                                        r2: isMergedFirstCell.r2,
                                        c1: isMergedFirstCell.c1,
                                        c2: isMergedFirstCell.c2
                                    };
                                    n++;
                                }
                            }

                            //set style
                            var cellStyle = newVal.getStyleName();
                            if (cellStyle && !isOneMerge) {
                                range.setCellStyle(cellStyle);
                            }

                            //add formula
                            var numFormula = null;
                            var skipFormat = null;
                            var noSkipVal = null;
                            var value2 = newVal.getValue2();
                            for (var nF = 0; nF < value2.length; nF++) {
                                if (value2[nF] && value2[nF].sId) {
                                    numFormula = nF;
                                    break;
                                } else if (value2[nF] && value2[nF].format && value2[nF].format.getSkip()) {
                                    skipFormat = true;
                                } else if (value2[nF] && value2[nF].format && !value2[nF].format.getSkip()) {
                                    noSkipVal = nF;
                                }
                            }


                            if (!isOneMerge)//settings for cell(format)
                            {
                                //format
                                var numFormat = newVal.getNumFormat();
                                var nameFormat;
                                if (numFormat && numFormat.sFormat) {
                                    nameFormat = numFormat.sFormat;
                                }
                                if (nameFormat) {
                                    range.setNumFormat(nameFormat);
                                }
                            }

                            //TODO вместо range где возможно использовать cell
                            var cellFrom, cellTo;
                            if (value2.length == 1 || numFormula != null || (skipFormat != null && noSkipVal != null)) {
                                if (numFormula == null) {
                                    numFormula = 0;
                                }
                                var numStyle = 0;
                                if (skipFormat != null && noSkipVal != null) {
                                    numStyle = noSkipVal;
                                }

                                //formula
                                if (newVal.getFormula() && !isOneMerge) {
                                    var offset = range.getCells()[numFormula].getOffset2(
                                      value2[numFormula].sId), assemb, _p_ = new AscCommonExcel.parserFormula(value2[numFormula].sFormula, null, val);

                                    if (_p_.parse()) {
										if(null !== tablesMap)
										{
											var renameParams = {};
											renameParams.offset = offset;
											renameParams.tableNameMap = tablesMap;
											_p_.renameSheetCopy(renameParams);
											assemb = _p_.assemble(true)
										}
										else
										{
											assemb = _p_.changeOffset(offset).assemble(true);
										}

                                        arrFormula[numFor] = {};
                                        arrFormula[numFor].range = range;
                                        arrFormula[numFor].val = "=" + assemb;
                                        numFor++;
                                    }
                                } else {
                                    cellFrom = newVal.getCells();
                                    if (isOneMerge && range && range.bbox) {
                                        cellTo = this._getCell(range.bbox.c1, range.bbox.r1).getCells();
                                    } else {
                                        cellTo = firstRange.getCells();
                                    }

                                    if (cellFrom && cellTo && cellFrom[0] && cellTo[0]) {
                                        cellTo[0].setValueData(cellFrom[0].getValueData());
                                    }
                                }

                                if (!isOneMerge)//settings for text
                                {
                                    range.setFont(value2[numStyle].format);
                                    }
                            } else {
                                firstRange.setValue2(value2);
                            }


                            if (!isOneMerge)//settings for cell
                            {
                                //vertical align
                                range.setAlignVertical(newVal.getAlignVertical());

                                //horizontal align
                                range.setAlignHorizontal(newVal.getAlignHorizontal());

                                //borders
                                var fullBorders = newVal.getBorderFull();
                                if (range.bbox.c2 !== range.bbox.c1 && curMerge && fullBorders) {
                                    //для мерженных ячеек, правая границу
                                    var endMergeCell = val.getCell3(pasteRow, curMerge.c2);
                                    var fullBordersEndMergeCell = endMergeCell.getBorderFull();
                                    if (fullBordersEndMergeCell && fullBordersEndMergeCell.r) {
                                        fullBorders.r = fullBordersEndMergeCell.r;
                                    }
                                }
                                range.setBorder(fullBorders);


                                //fill
                                range.setFill(newVal.getFill());

                                //wrap
                                range.setWrap(newVal.getWrap());

                                //angle
                                range.setAngle(newVal.getAngle());

                                //hyperLink
                                var hyperLink = newVal.getHyperlink();
                                if (hyperLink != null) {
                                    hyperLink.Ref = range;
                                    range.setHyperlink(hyperLink, true);
                                }
                            }
                            //если замержили range
                            c = range.bbox.c2 - autoC * plCol;
                            if (c === cMax) {
                                r = range.bbox.r2 - autoC * plCol;
                            }
                        }
                    }
                }
            }
        }

        t.isChanged = true;
        var arnFor = [];
        arnFor[0] = arn;
        arnFor[1] = arrFormula;
        return arnFor;
    };

    // Залочена ли панель для закрепления
    WorksheetView.prototype._isLockedFrozenPane = function ( callback ) {
        var sheetId = this.model.getId();
        var lockInfo = this.collaborativeEditing.getLockInfo( c_oAscLockTypeElem.Object, null, sheetId, AscCommonExcel.c_oAscLockNameFrozenPane );

        if ( false === this.collaborativeEditing.getCollaborativeEditing() ) {
            // Пользователь редактирует один: не ждем ответа, а сразу продолжаем редактирование
            asc_applyFunction( callback, true );
            callback = undefined;
        }
        if ( false !== this.collaborativeEditing.getLockIntersection( lockInfo, c_oAscLockTypes.kLockTypeMine, /*bCheckOnlyLockAll*/false ) ) {
            // Редактируем сами
            asc_applyFunction( callback, true );
            return;
        }
        else if ( false !== this.collaborativeEditing.getLockIntersection( lockInfo, c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/false ) ) {
            // Уже ячейку кто-то редактирует
            asc_applyFunction( callback, false );
            return;
        }

        this.collaborativeEditing.onStartCheckLock();
        this.collaborativeEditing.addCheckLock( lockInfo );
        this.collaborativeEditing.onEndCheckLock( callback );
    };

    WorksheetView.prototype._isLockedDefNames = function ( callback, defNameId ) {
        var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Object, null
            /*c_oAscLockTypeElemSubType.DefinedNames*/, -1, defNameId);

        if ( false === this.collaborativeEditing.getCollaborativeEditing() ) {
            // Пользователь редактирует один: не ждем ответа, а сразу продолжаем редактирование
            asc_applyFunction( callback, true );
            callback = undefined;
        }
        if (false !==
            this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeMine, /*bCheckOnlyLockAll*/
                false)) {
            // Редактируем сами
            asc_applyFunction( callback, true );
            return;
        } else if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther,
                /*bCheckOnlyLockAll*/false)) {
            // Уже ячейку кто-то редактирует
            asc_applyFunction( callback, false );
            return;
        }

        this.collaborativeEditing.onStartCheckLock();
        this.collaborativeEditing.addCheckLock( lockInfo );
        this.collaborativeEditing.onEndCheckLock( callback );
    };

    // Залочен ли весь лист
    WorksheetView.prototype._isLockedAll = function (callback) {
        var sheetId = this.model.getId();
        var subType = c_oAscLockTypeElemSubType.ChangeProperties;
        var ar = this.model.selectionRange.getLast();

        var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, /*subType*/subType, sheetId,
          new AscCommonExcel.asc_CCollaborativeRange(ar.c1, ar.r1, ar.c2, ar.r2));

        if (false === this.collaborativeEditing.getCollaborativeEditing()) {
            // Пользователь редактирует один: не ждем ответа, а сразу продолжаем редактирование
            asc_applyFunction(callback, true);
            callback = undefined;
        }
        if (false !==
          this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeMine, /*bCheckOnlyLockAll*/
            true)) {
            // Редактируем сами
            asc_applyFunction(callback, true);
            return;
        } else if (false !==
          this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther, /*bCheckOnlyLockAll*/
            true)) {
            // Уже ячейку кто-то редактирует
            asc_applyFunction(callback, false);
            return;
        }

        this.collaborativeEditing.onStartCheckLock();
        this.collaborativeEditing.addCheckLock(lockInfo);
        this.collaborativeEditing.onEndCheckLock(callback);
    };
    // Пересчет для входящих ячеек в добавленные строки/столбцы
    WorksheetView.prototype._recalcRangeByInsertRowsAndColumns = function (sheetId, ar) {
        var isIntersection = false, isIntersectionC1 = true, isIntersectionC2 = true, isIntersectionR1 = true, isIntersectionR2 = true;
        do {
            if (isIntersectionC1 && this.collaborativeEditing.isIntersectionInCols(sheetId, ar.c1)) {
                ar.c1 += 1;
            } else {
                isIntersectionC1 = false;
            }

            if (isIntersectionR1 && this.collaborativeEditing.isIntersectionInRows(sheetId, ar.r1)) {
                ar.r1 += 1;
            } else {
                isIntersectionR1 = false;
            }

            if (isIntersectionC2 && this.collaborativeEditing.isIntersectionInCols(sheetId, ar.c2)) {
                ar.c2 -= 1;
            } else {
                isIntersectionC2 = false;
            }

            if (isIntersectionR2 && this.collaborativeEditing.isIntersectionInRows(sheetId, ar.r2)) {
                ar.r2 -= 1;
            } else {
                isIntersectionR2 = false;
            }


            if (ar.c1 > ar.c2 || ar.r1 > ar.r2) {
                isIntersection = true;
                break;
            }
        } while (isIntersectionC1 || isIntersectionC2 || isIntersectionR1 || isIntersectionR2)
          ;

        if (false === isIntersection) {
            ar.c1 = this.collaborativeEditing.getLockMeColumn(sheetId, ar.c1);
            ar.c2 = this.collaborativeEditing.getLockMeColumn(sheetId, ar.c2);
            ar.r1 = this.collaborativeEditing.getLockMeRow(sheetId, ar.r1);
            ar.r2 = this.collaborativeEditing.getLockMeRow(sheetId, ar.r2);
        }

        return isIntersection;
    };
    // Функция проверки lock (возвращаемый результат нельзя использовать в качестве ответа, он нужен только для редактирования ячейки)
    WorksheetView.prototype._isLockedCells = function (range, subType, callback) {
        var sheetId = this.model.getId();
        var isIntersection = false;
        var newCallback = callback;
        var t = this;

        this.collaborativeEditing.onStartCheckLock();
        var isArrayRange = Array.isArray(range);
        var nLength = isArrayRange ? range.length : 1;
        var nIndex = 0;
        var ar = null;

        for (; nIndex < nLength; ++nIndex) {
            ar = isArrayRange ? range[nIndex].clone(true) : range.clone(true);

            if (c_oAscLockTypeElemSubType.InsertColumns !== subType &&
              c_oAscLockTypeElemSubType.InsertRows !== subType) {
                // Пересчет для входящих ячеек в добавленные строки/столбцы
                isIntersection = this._recalcRangeByInsertRowsAndColumns(sheetId, ar);
            }

            if (false === isIntersection) {
                var lockInfo = this.collaborativeEditing.getLockInfo(c_oAscLockTypeElem.Range, /*subType*/subType,
                  sheetId, new AscCommonExcel.asc_CCollaborativeRange(ar.c1, ar.r1, ar.c2, ar.r2));

                if (false !== this.collaborativeEditing.getLockIntersection(lockInfo, c_oAscLockTypes.kLockTypeOther,
                    /*bCheckOnlyLockAll*/false)) {
                    // Уже ячейку кто-то редактирует
                    asc_applyFunction(callback, false);
                    return false;
                } else {
                    if (c_oAscLockTypeElemSubType.InsertColumns === subType) {
                        newCallback = function (isSuccess) {
                            if (isSuccess) {
                                t.collaborativeEditing.addColsRange(sheetId, range.clone(true));
                                t.collaborativeEditing.addCols(sheetId, range.c1, range.c2 - range.c1 + 1);
                            }
                            callback(isSuccess);
                        };
                    } else if (c_oAscLockTypeElemSubType.InsertRows === subType) {
                        newCallback = function (isSuccess) {
                            if (isSuccess) {
                                t.collaborativeEditing.addRowsRange(sheetId, range.clone(true));
                                t.collaborativeEditing.addRows(sheetId, range.r1, range.r2 - range.r1 + 1);
                            }
                            callback(isSuccess);
                        };
                    } else if (c_oAscLockTypeElemSubType.DeleteColumns === subType) {
                        newCallback = function (isSuccess) {
                            if (isSuccess) {
                                t.collaborativeEditing.removeColsRange(sheetId, range.clone(true));
                                t.collaborativeEditing.removeCols(sheetId, range.c1, range.c2 - range.c1 + 1);
                            }
                            callback(isSuccess);
                        };
                    } else if (c_oAscLockTypeElemSubType.DeleteRows === subType) {
                        newCallback = function (isSuccess) {
                            if (isSuccess) {
                                t.collaborativeEditing.removeRowsRange(sheetId, range.clone(true));
                                t.collaborativeEditing.removeRows(sheetId, range.r1, range.r2 - range.r1 + 1);
                            }
                            callback(isSuccess);
                        };
                    }
                    this.collaborativeEditing.addCheckLock(lockInfo);
                }
            } else {
                if (c_oAscLockTypeElemSubType.InsertColumns === subType) {
                    t.collaborativeEditing.addColsRange(sheetId, range.clone(true));
                    t.collaborativeEditing.addCols(sheetId, range.c1, range.c2 - range.c1 + 1);
                } else if (c_oAscLockTypeElemSubType.InsertRows === subType) {
                    t.collaborativeEditing.addRowsRange(sheetId, range.clone(true));
                    t.collaborativeEditing.addRows(sheetId, range.r1, range.r2 - range.r1 + 1);
                } else if (c_oAscLockTypeElemSubType.DeleteColumns === subType) {
                    t.collaborativeEditing.removeColsRange(sheetId, range.clone(true));
                    t.collaborativeEditing.removeCols(sheetId, range.c1, range.c2 - range.c1 + 1);
                } else if (c_oAscLockTypeElemSubType.DeleteRows === subType) {
                    t.collaborativeEditing.removeRowsRange(sheetId, range.clone(true));
                    t.collaborativeEditing.removeRows(sheetId, range.r1, range.r2 - range.r1 + 1);
                }
            }
        }

        if (false === this.collaborativeEditing.getCollaborativeEditing()) {
            // Пользователь редактирует один: не ждем ответа, а сразу продолжаем редактирование
            newCallback(true);
            newCallback = undefined;
        }
        this.collaborativeEditing.onEndCheckLock(newCallback);
        return true;
    };

    WorksheetView.prototype.changeWorksheet = function (prop, val) {
        // Проверка глобального лока
        if (this.collaborativeEditing.getGlobalLock()) {
            return;
        }

        var t = this;
        var arn = this.model.selectionRange.getLast().clone();
        var checkRange = arn.getAllRange();

        var range;
		var oRecalcType = AscCommonExcel.recalcType.recalc;
        var reinitRanges = false;
        var updateDrawingObjectsInfo = null;
        var updateDrawingObjectsInfo2 = null;//{bInsert: false, operType: c_oAscInsertOptions.InsertColumns, updateRange: arn}
        var isUpdateCols = false, isUpdateRows = false;
        var isCheckChangeAutoFilter;
        var functionModelAction = null;
        var lockDraw = false;	// Параметр, при котором не будет отрисовки (т.к. мы просто обновляем информацию на неактивном листе)
		var lockRange, arrChangedRanges = [];

        var onChangeWorksheetCallback = function (isSuccess) {
            if (false === isSuccess) {
                return;
            }

            asc_applyFunction(functionModelAction);

			t._initCellsArea(oRecalcType);
			if (oRecalcType) {
                t.cache.reset();
            }
            t._cleanCellsTextMetricsCache();
            t._prepareCellTextMetricsCache();

            if (t.objectRender) {
                if (reinitRanges && t.objectRender.drawingArea) {
                    t.objectRender.drawingArea.reinitRanges();
                }
                if (null !== updateDrawingObjectsInfo) {
                    t.objectRender.updateSizeDrawingObjects(updateDrawingObjectsInfo);
                }
                if (null !== updateDrawingObjectsInfo2) {
                    t.objectRender.updateDrawingObject(updateDrawingObjectsInfo2.bInsert,
                      updateDrawingObjectsInfo2.operType, updateDrawingObjectsInfo2.updateRange);
                }
				t.model.onUpdateRanges(arrChangedRanges);
				t.objectRender.rebuildChartGraphicObjects(arrChangedRanges);
            }
            t.draw(lockDraw);

            t.handlers.trigger("reinitializeScroll");

            if (isUpdateCols) {
                t._updateVisibleColsCount();
            }
            if (isUpdateRows) {
                t._updateVisibleRowsCount();
            }

            t.handlers.trigger("selectionChanged");
            t.handlers.trigger("selectionMathInfoChanged", t.getSelectionMathInfo());
        };

        switch (prop) {
            case "colWidth":
                functionModelAction = function () {
                    t.model.setColWidth(val, checkRange.c1, checkRange.c2);
                    isUpdateCols = true;
					oRecalcType = AscCommonExcel.recalcType.full;
                    reinitRanges = true;
                    updateDrawingObjectsInfo = {target: c_oTargetType.ColumnResize, col: checkRange.c1};
                };
                this._isLockedAll(onChangeWorksheetCallback);
                break;
            case "showCols":
                functionModelAction = function () {
                    t.model.setColHidden(/*bHidden*/false, arn.c1, arn.c2);
					oRecalcType = AscCommonExcel.recalcType.full;
                    reinitRanges = true;
                    updateDrawingObjectsInfo = {target: c_oTargetType.ColumnResize, col: arn.c1};
                };
				arrChangedRanges.push(new asc_Range(arn.c1, 0, arn.c2, gc_nMaxRow0));
                this._isLockedAll(onChangeWorksheetCallback);
                break;
            case "hideCols":
                functionModelAction = function () {
                    t.model.setColHidden(/*bHidden*/true, arn.c1, arn.c2);
					oRecalcType = AscCommonExcel.recalcType.full;
                    reinitRanges = true;
                    updateDrawingObjectsInfo = {target: c_oTargetType.ColumnResize, col: arn.c1};
                };
				arrChangedRanges.push(new asc_Range(arn.c1, 0, arn.c2, gc_nMaxRow0));
                this._isLockedAll(onChangeWorksheetCallback);
                break;
            case "rowHeight":
                functionModelAction = function () {
                    // Приводим к px (чтобы было ровно)
                    val = val / 0.75;
                    val = (val | val) * 0.75;		// 0.75 - это размер 1px в pt (можно было 96/72)
                    t.model.setRowHeight(Math.min(val, t.maxRowHeight), checkRange.r1, checkRange.r2, true);
                    isUpdateRows = true;
					oRecalcType = AscCommonExcel.recalcType.full;
                    reinitRanges = true;
                    updateDrawingObjectsInfo = {target: c_oTargetType.RowResize, row: checkRange.r1};
                };
                return this._isLockedAll(onChangeWorksheetCallback);
            case "showRows":
                functionModelAction = function () {
                    t.model.setRowHidden(/*bHidden*/false, arn.r1, arn.r2);
                    t.model.autoFilters.reDrawFilter(arn);
					oRecalcType = AscCommonExcel.recalcType.full;
                    reinitRanges = true;
                    updateDrawingObjectsInfo = {target: c_oTargetType.RowResize, row: arn.r1};
                };
				arrChangedRanges.push(new asc_Range(0, arn.r1, gc_nMaxCol0, arn.r2));
                this._isLockedAll(onChangeWorksheetCallback);
                break;
            case "hideRows":
                functionModelAction = function () {
                    t.model.setRowHidden(/*bHidden*/true, arn.r1, arn.r2);
                    t.model.autoFilters.reDrawFilter(arn);
					oRecalcType = AscCommonExcel.recalcType.full;
                    reinitRanges = true;
                    updateDrawingObjectsInfo = {target: c_oTargetType.RowResize, row: arn.r1};
                };
				arrChangedRanges.push(new asc_Range(0, arn.r1, gc_nMaxCol0, arn.r2));
                this._isLockedAll(onChangeWorksheetCallback);
                break;
            case "insCell":
                range = t.model.getRange3(arn.r1, arn.c1, arn.r2, arn.c2);
                switch (val) {
                    case c_oAscInsertOptions.InsertCellsAndShiftRight:
                        isCheckChangeAutoFilter =
                          t.af_checkInsDelCells(arn, c_oAscInsertOptions.InsertCellsAndShiftRight, prop);
                        if (isCheckChangeAutoFilter === false) {
                            return;
                        }

                        functionModelAction = function () {
                            History.Create_NewPoint();
                            History.StartTransaction();
                            if (range.addCellsShiftRight()) {
								oRecalcType = AscCommonExcel.recalcType.full;
                                reinitRanges = true;
                                t.cellCommentator.updateCommentsDependencies(true, val, arn);
                                updateDrawingObjectsInfo2 = {bInsert: true, operType: val, updateRange: arn};
                            }
                            History.EndTransaction();
                        };

						arrChangedRanges.push(lockRange = new asc_Range(arn.c1, arn.r1, gc_nMaxCol0, arn.r2));
						this._isLockedCells(lockRange, null, onChangeWorksheetCallback);
                        break;
                    case c_oAscInsertOptions.InsertCellsAndShiftDown:
                        isCheckChangeAutoFilter =
                          t.af_checkInsDelCells(arn, c_oAscInsertOptions.InsertCellsAndShiftDown, prop);
                        if (isCheckChangeAutoFilter === false) {
                            return;
                        }

                        functionModelAction = function () {
                            History.Create_NewPoint();
                            History.StartTransaction();
                            if (range.addCellsShiftBottom()) {
								oRecalcType = AscCommonExcel.recalcType.full;
                                reinitRanges = true;
                                t.cellCommentator.updateCommentsDependencies(true, val, arn);
                                updateDrawingObjectsInfo2 = {bInsert: true, operType: val, updateRange: arn};
                            }
                            History.EndTransaction();
                        };

						arrChangedRanges.push(lockRange = new asc_Range(arn.c1, arn.r1, arn.c2, gc_nMaxRow0));
						this._isLockedCells(lockRange, null, onChangeWorksheetCallback);
                        break;
                    case c_oAscInsertOptions.InsertColumns:
                        isCheckChangeAutoFilter = t.model.autoFilters.isRangeIntersectionSeveralTableParts(arn);
                        if (isCheckChangeAutoFilter === true) {
                            this.model.workbook.handlers.trigger("asc_onError",
                              c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
                            return;
                        }

                        functionModelAction = function () {
                            History.Create_NewPoint();
                            History.StartTransaction();
							oRecalcType = AscCommonExcel.recalcType.full;
                            reinitRanges = true;
                            t.model.insertColsBefore(arn.c1, arn.c2 - arn.c1 + 1);
                            updateDrawingObjectsInfo2 = {bInsert: true, operType: val, updateRange: arn};
                            t.cellCommentator.updateCommentsDependencies(true, val, arn);
                            History.EndTransaction();
                        };

						arrChangedRanges.push(lockRange = new asc_Range(arn.c1, 0, arn.c2, gc_nMaxRow0));
						this._isLockedCells(lockRange, c_oAscLockTypeElemSubType.InsertColumns,
                          onChangeWorksheetCallback);
                        break;
                    case c_oAscInsertOptions.InsertRows:
                        functionModelAction = function () {
							oRecalcType = AscCommonExcel.recalcType.full;
                            reinitRanges = true;
                            t.model.insertRowsBefore(arn.r1, arn.r2 - arn.r1 + 1);
                            updateDrawingObjectsInfo2 = {bInsert: true, operType: val, updateRange: arn};
                            t.cellCommentator.updateCommentsDependencies(true, val, arn);
                        };

						arrChangedRanges.push(lockRange = new asc_Range(0, arn.r1, gc_nMaxCol0, arn.r2));
						this._isLockedCells(lockRange, c_oAscLockTypeElemSubType.InsertRows, onChangeWorksheetCallback);
                        break;
                }
                break;
            case "delCell":
                range = t.model.getRange3(checkRange.r1, checkRange.c1, checkRange.r2, checkRange.c2);
                switch (val) {
                    case c_oAscDeleteOptions.DeleteCellsAndShiftLeft:
                        isCheckChangeAutoFilter =
                          t.af_checkInsDelCells(arn, c_oAscDeleteOptions.DeleteCellsAndShiftLeft, prop);
                        if (isCheckChangeAutoFilter === false) {
                            return;
                        }

                        functionModelAction = function () {
                            History.Create_NewPoint();
                            History.StartTransaction();
                            if (isCheckChangeAutoFilter === true) {
                                t.model.autoFilters.isEmptyAutoFilters(arn,
                                  c_oAscDeleteOptions.DeleteCellsAndShiftLeft);
                            }
                            if (range.deleteCellsShiftLeft(function () {
									t._cleanCache(lockRange);
                                  t.cellCommentator.updateCommentsDependencies(false, val, checkRange);
                              })) {
                                updateDrawingObjectsInfo2 = {bInsert: false, operType: val, updateRange: arn};
                            }
                            History.EndTransaction();
                            reinitRanges = true;
                        };

						arrChangedRanges.push(
							lockRange = new asc_Range(checkRange.c1, checkRange.r1, gc_nMaxCol0, checkRange.r2));
						this._isLockedCells(lockRange, null, onChangeWorksheetCallback);
                        break;
                    case c_oAscDeleteOptions.DeleteCellsAndShiftTop:
                        isCheckChangeAutoFilter =
                          t.af_checkInsDelCells(arn, c_oAscDeleteOptions.DeleteCellsAndShiftTop, prop);
                        if (isCheckChangeAutoFilter === false) {
                            return;
                        }

                        functionModelAction = function () {
                            History.Create_NewPoint();
                            History.StartTransaction();
                            if (isCheckChangeAutoFilter === true) {
                                t.model.autoFilters.isEmptyAutoFilters(arn, c_oAscDeleteOptions.DeleteCellsAndShiftTop);
                            }
                            if (range.deleteCellsShiftUp(function () {
									t._cleanCache(lockRange);
                                  t.cellCommentator.updateCommentsDependencies(false, val, checkRange);
                              })) {
                                updateDrawingObjectsInfo2 = {bInsert: false, operType: val, updateRange: arn};
                            }
                            History.EndTransaction();

                            reinitRanges = true;
                        };

						arrChangedRanges.push(
							lockRange = new asc_Range(checkRange.c1, checkRange.r1, checkRange.c2, gc_nMaxRow0));
						this._isLockedCells(lockRange, null, onChangeWorksheetCallback);
                        break;
                    case c_oAscDeleteOptions.DeleteColumns:
                        isCheckChangeAutoFilter = t.model.autoFilters.isActiveCellsCrossHalfFTable(checkRange,
                          c_oAscDeleteOptions.DeleteColumns, prop);
                        if (isCheckChangeAutoFilter === false) {
                            return;
                        }

                        functionModelAction = function () {
							oRecalcType = AscCommonExcel.recalcType.full;
                            reinitRanges = true;
                            History.Create_NewPoint();
                            History.StartTransaction();
                            t.cellCommentator.updateCommentsDependencies(false, val, checkRange);
                            t.model.autoFilters.isEmptyAutoFilters(arn, c_oAscDeleteOptions.DeleteColumns);
                            t.model.removeCols(checkRange.c1, checkRange.c2);
                            updateDrawingObjectsInfo2 = {bInsert: false, operType: val, updateRange: arn};
                            History.EndTransaction();
                        };

						arrChangedRanges.push(lockRange = new asc_Range(checkRange.c1, 0, checkRange.c2, gc_nMaxRow0));
						this._isLockedCells(lockRange, c_oAscLockTypeElemSubType.DeleteColumns,
                          onChangeWorksheetCallback);
                        break;
                    case c_oAscDeleteOptions.DeleteRows:
                        isCheckChangeAutoFilter =
                          t.model.autoFilters.isActiveCellsCrossHalfFTable(checkRange, c_oAscDeleteOptions.DeleteRows,
                            prop);
                        if (isCheckChangeAutoFilter === false) {
                            return;
                        }

                        functionModelAction = function () {
							oRecalcType = AscCommonExcel.recalcType.full;
                            reinitRanges = true;
                            History.Create_NewPoint();
                            History.StartTransaction();
							checkRange = t.model.autoFilters.checkDeleteAllRowsFormatTable(checkRange, true);
                            t.cellCommentator.updateCommentsDependencies(false, val, checkRange);
                            t.model.autoFilters.isEmptyAutoFilters(arn, c_oAscDeleteOptions.DeleteRows);
                            t.model.removeRows(checkRange.r1, checkRange.r2);
                            updateDrawingObjectsInfo2 = {bInsert: false, operType: val, updateRange: arn};
                            History.EndTransaction();
                        };

						arrChangedRanges.push(lockRange = new asc_Range(0, checkRange.r1, gc_nMaxCol0, checkRange.r2));
						this._isLockedCells(lockRange, c_oAscLockTypeElemSubType.DeleteRows, onChangeWorksheetCallback);
                        break;
                }
                this.handlers.trigger("selectionNameChanged", t.getSelectionName(/*bRangeText*/false));
                break;
            case "sheetViewSettings":
                functionModelAction = function () {
				    if (AscCH.historyitem_Worksheet_SetDisplayGridlines === val.type) {
						t.model.setDisplayGridlines(val.value);
                    } else {
						t.model.setDisplayHeadings(val.value);
                    }

                    isUpdateCols = true;
                    isUpdateRows = true;
					oRecalcType = AscCommonExcel.recalcType.full;
                    reinitRanges = true;
                };

                this._isLockedAll(onChangeWorksheetCallback);
                break;
            case "update":
                if (val !== undefined) {
                    lockDraw = true === val.lockDraw;
                    reinitRanges = !!val.reinitRanges;
                }
                onChangeWorksheetCallback(true);
                break;
        }
    };

    WorksheetView.prototype.expandColsOnScroll = function (isNotActive, updateColsCount, newColsCount) {
        var maxColObjects = this.objectRender ? this.objectRender.getMaxColRow().col : -1;
        var maxc = Math.max(this.model.getColsCount() + 1, this.cols.length, maxColObjects);
        if (newColsCount) {
            maxc = Math.max(maxc, newColsCount);
        }

        // Сохраняем старое значение
        var nLastCols = this.nColsCount;
        if (isNotActive) {
            this.nColsCount = maxc + 1;
        } else if (updateColsCount) {
            this.nColsCount = maxc;
            if (this.cols.length < this.nColsCount) {
                nLastCols = this.cols.length;
            }
        }
        // Проверяем ограничения по столбцам
        if (gc_nMaxCol < this.nColsCount) {
            this.nColsCount = gc_nMaxCol;
        }

        this._calcWidthColumns(AscCommonExcel.recalcType.newLines);

        if (this.objectRender && this.objectRender.drawingArea) {
            this.objectRender.drawingArea.reinitRanges();
        }

        return nLastCols !== this.nColsCount;
    };

    WorksheetView.prototype.expandRowsOnScroll = function (isNotActive, updateRowsCount, newRowsCount) {
        var maxRowObjects = this.objectRender ? this.objectRender.getMaxColRow().row : -1;
        var maxr = Math.max(this.model.getRowsCount() + 1, this.rows.length, maxRowObjects);
        if (newRowsCount) {
            maxr = Math.max(maxr, newRowsCount);
        }

        // Сохраняем старое значение
        var nLastRows = this.nRowsCount;
        if (isNotActive) {
            this.nRowsCount = maxr + 1;
        } else if (updateRowsCount) {
            this.nRowsCount = maxr;
            if (this.rows.length < this.nRowsCount) {
                nLastRows = this.rows.length;
            }
        }
        // Проверяем ограничения по строкам
        if (gc_nMaxRow < this.nRowsCount) {
            this.nRowsCount = gc_nMaxRow;
        }

        this._calcHeightRows(AscCommonExcel.recalcType.newLines);
        if (this.objectRender && this.objectRender.drawingArea) {
            this.objectRender.drawingArea.reinitRanges();
        }

        return nLastRows !== this.nRowsCount;
    };

    WorksheetView.prototype.onChangeWidthCallback = function (col, r1, r2, onlyIfMore) {
        var width = null;
        var row, ct, c, fl, str, maxW, tm, mc, isMerged, oldWidth, oldColWidth;
        var lastHeight = null;
        var filterButton = null;
        if (null == r1) {
            r1 = 0;
        }
        if (null == r2) {
            r2 = this.rows.length - 1;
        }

        oldColWidth = this.cols[col].charCount;

        this.cols[col].isCustomWidth = false;
        for (row = r1; row <= r2; ++row) {
            // пересчет метрик текста
            this._addCellTextToCache(col, row, /*canChangeColWidth*/c_oAscCanChangeColWidth.all);
            ct = this._getCellTextCache(col, row);
            if (ct === undefined) {
                continue;
            }
            fl = ct.flags;
            isMerged = fl.isMerged();
            if (isMerged) {
                mc = fl.merged;
                // Для замерженных ячеек (с 2-мя или более колонками) оптимизировать не нужно
                if (mc.c1 !== mc.c2) {
                    continue;
                }
            }

            if (ct.metrics.height > this.maxRowHeight) {
                if (isMerged) {
                    continue;
                }
                // Запоминаем старую ширину (в случае, если у нас по высоте не уберется)
                oldWidth = ct.metrics.width;
                lastHeight = null;
                // вычисление новой ширины столбца, чтобы высота текста была меньше maxRowHeight
                c = this._getCell(col, row);
                str = c.getValue2();
                maxW = ct.metrics.width + this.maxDigitWidth;
                while (1) {
                    tm = this._roundTextMetrics(this.stringRender.measureString(str, fl, maxW));
                    if (tm.height <= this.maxRowHeight) {
                        break;
                    }
                    if (lastHeight === tm.height) {
                        // Ситуация, когда у нас текст не уберется по высоте (http://bugzilla.onlyoffice.com/show_bug.cgi?id=19974)
                        tm.width = oldWidth;
                        break;
                    }
                    lastHeight = tm.height;
                    maxW += this.maxDigitWidth;
                }
                width = Math.max(width, tm.width);
            } else {
                filterButton = this.af_getSizeButton(col, row);
                if (null !== filterButton && CellValueType.String === ct.cellType) {
                    width = Math.max(width, ct.metrics.width + filterButton.width);
                } else {
                    width = Math.max(width, ct.metrics.width);
                }
            }
        }

        var pad, cc, cw;
        if (width > 0) {
            pad = this.width_padding * 2 + this.width_1px;
            cc = Math.min(this._colWidthToCharCount(width + pad), Asc.c_oAscMaxColumnWidth);
            cw = this.model.charCountToModelColWidth(cc);
        } else {
            cw = AscCommonExcel.oDefaultMetrics.ColWidthChars;
            cc = this.defaultColWidthChars;
        }

        if (cc === oldColWidth || (onlyIfMore && cc < oldColWidth)) {
            return -1;
        }

        History.Create_NewPoint();
        if (!onlyIfMore) {
            var oSelection = History.GetSelection();
            if (null != oSelection) {
                oSelection = oSelection.clone();
                oSelection.assign(col, 0, col, gc_nMaxRow0);
                oSelection.type = c_oAscSelectionType.RangeCol;
                History.SetSelection(oSelection);
                History.SetSelectionRedo(oSelection);
            }
        }
        History.StartTransaction();
        // Выставляем, что это bestFit
        this.model.setColBestFit(true, cw, col, col);
        History.EndTransaction();
        return oldColWidth !== cc ? cw : -1;
    };

    WorksheetView.prototype.autoFitColumnWidth = function (col1, col2) {
        var t = this;
        return this._isLockedAll(function (isSuccess) {
            if (false === isSuccess) {
                return;
            }
            if (null === col1) {
                var lastSelection = t.model.selectionRange.getLast();
                col1 = lastSelection.c1;
                col2 = lastSelection.c2;
            }

            var w, bUpdate = false;
            History.Create_NewPoint();
            History.StartTransaction();
            for (var c = col1; c <= col2; ++c) {
                w = t.onChangeWidthCallback(c, null, null);
                if (-1 !== w) {
                    t.cols[c] = t._calcColWidth(w);
                    t.cols[c].isCustomWidth = false;
                    bUpdate = true;

                    t._cleanCache(new asc_Range(c, 0, c, t.rows.length - 1));
                }
            }
            if (bUpdate) {
                t._updateColumnPositions();
                t._updateVisibleColsCount();
                t._calcHeightRows(AscCommonExcel.recalcType.recalc);
                t._updateVisibleRowsCount();
                t.objectRender.drawingArea.reinitRanges();
                t.changeWorksheet("update");
            }
            History.EndTransaction();
        });
    };

    WorksheetView.prototype.autoFitRowHeight = function (row1, row2) {
        var t = this;
        var onChangeHeightCallback = function (isSuccess) {
            if (false === isSuccess) {
                return;
            }
            if (null === row1) {
                var lastSelection = t.model.selectionRange.getLast();
                row1 = lastSelection.r1;
                row2 = lastSelection.r2;
            }

            History.Create_NewPoint();
            var oSelection = History.GetSelection();
            if (null != oSelection) {
                oSelection = oSelection.clone();
                oSelection.assign(0, row1, gc_nMaxCol0, row2);
                oSelection.type = c_oAscSelectionType.RangeRow;
                History.SetSelection(oSelection);
                History.SetSelectionRedo(oSelection);
            }
            History.StartTransaction();

            var height, col, ct, mc;
            for (var r = row1; r <= row2; ++r) {
                height = t.defaultRowHeight;

                for (col = 0; col < t.cols.length; ++col) {
                    ct = t._getCellTextCache(col, r);
                    if (ct === undefined) {
                        continue;
                    }
                    if (ct.flags.isMerged()) {
                        mc = ct.flags.merged;
                        // Для замерженных ячеек (с 2-мя или более строками) оптимизировать не нужно
                        if (mc.r1 !== mc.r2) {
                            continue;
                        }
                    }

                    height = Math.max(height, ct.metrics.height + t.height_1px);
                }

                t.model.setRowBestFit(true, Math.min(height, t.maxRowHeight), r, r);
            }

            t.nRowsCount = 0;
            t._calcHeightRows(AscCommonExcel.recalcType.recalc);
            t._updateVisibleRowsCount();
            t._cleanCache(new asc_Range(0, row1, t.cols.length - 1, row2));
            t.objectRender.drawingArea.reinitRanges();
            t.changeWorksheet("update");
            History.EndTransaction();
        };
        return this._isLockedAll(onChangeHeightCallback);
    };


    // ----- Search -----
    WorksheetView.prototype._isCellEqual = function (c, r, options) {
        var cell, cellText;
        // Не пользуемся RegExp, чтобы не возиться со спец.символами
        var mc = this.model.getMergedByCell(r, c);
        cell = mc ? this._getVisibleCell(mc.c1, mc.r1) : this._getVisibleCell(c, r);
        cellText = (options.lookIn === Asc.c_oAscFindLookIn.Formulas) ? cell.getValueForEdit() : cell.getValue();
        if (true !== options.isMatchCase) {
            cellText = cellText.toLowerCase();
        }
        if ((cellText.indexOf(options.findWhat) >= 0) &&
          (true !== options.isWholeCell || options.findWhat.length === cellText.length)) {
            return (mc ? new asc_Range(mc.c1, mc.r1, mc.c1, mc.r1) : new asc_Range(c, r, c, r));
        }
        return null;
    };
    WorksheetView.prototype.findCellText = function (options) {
        var self = this;
        if (true !== options.isMatchCase) {
            options.findWhat = options.findWhat.toLowerCase();
        }
        var ar = options.activeCell ? options.activeCell : this.model.selectionRange.activeCell;
        var c = ar.col;
        var r = ar.row;
        var minC = 0;
        var minR = 0;
        var maxC = this.cols.length - 1;
        var maxR = this.rows.length - 1;
        var inc = options.scanForward ? +1 : -1;
        var isEqual;

        // ToDo стоит переделать это место, т.к. для поиска не нужны измерения, а нужен только сам текст (http://bugzilla.onlyoffice.com/show_bug.cgi?id=26136)
        this._prepareCellTextMetricsCache(new Asc.Range(0, 0, this.model.getColsCount(), this.model.getRowsCount()));

        function findNextCell() {
            var ct = undefined;
            do {
                if (options.scanByRows) {
                    c += inc;
                    if (c < minC || c > maxC) {
                        c = options.scanForward ? minC : maxC;
                        r += inc;
                    }
                } else {
                    r += inc;
                    if (r < minR || r > maxR) {
                        r = options.scanForward ? minR : maxR;
                        c += inc;
                    }
                }
                if (c < minC || c > maxC || r < minR || r > maxR) {
                    return undefined;
                }
                ct = self._getCellTextCache(c, r, true);
            } while (!ct);
            return ct;
        }

        while (findNextCell()) {
            isEqual = this._isCellEqual(c, r, options);
            if (null !== isEqual) {
                return isEqual;
            }
        }

        // Продолжаем циклический поиск
        if (options.scanForward) {
            // Идем вперед с первой ячейки
            minC = 0;
            minR = 0;
            if (options.scanByRows) {
                c = -1;
                r = 0;

                maxC = this.cols.length - 1;
                maxR = ar.row;
            } else {
                c = 0;
                r = -1;

                maxC = ar.col;
                maxR = this.rows.length - 1;
            }
        } else {
            // Идем назад с последней
            c = this.cols.length - 1;
            r = this.rows.length - 1;
            if (options.scanByRows) {
                minC = 0;
                minR = ar.row;
            } else {
                minC = ar.col;
                minR = 0;
            }
            maxC = this.cols.length - 1;
            maxR = this.rows.length - 1;
        }
        while (findNextCell()) {
            isEqual = this._isCellEqual(c, r, options);
            if (null !== isEqual) {
                return isEqual;
            }
        }
        return null;
    };

    WorksheetView.prototype.replaceCellText = function (options, lockDraw, callback) {
        if (true !== options.isMatchCase) {
            options.findWhat = options.findWhat.toLowerCase();
        }

        // Очищаем результаты
        options.countFind = 0;
        options.countReplace = 0;

        var t = this;
        var activeCell = this.model.selectionRange.activeCell.clone();
        var aReplaceCells = [];
        if (options.isReplaceAll) {
            var aReplaceCellsIndex = {};
            options.activeCell = activeCell;
            var findResult, index;
            while (true) {
                findResult = t.findCellText(options);
                if (null === findResult) {
                    break;
                }
                index = findResult.c1 + '-' + findResult.r1;
                if (aReplaceCellsIndex[index]) {
                    break;
                }
                aReplaceCellsIndex[index] = true;
                aReplaceCells.push(findResult);
                activeCell.col = findResult.c1;
                activeCell.row = findResult.r1;
            }
        } else {
            // Попробуем сначала найти
            var isEqual = this._isCellEqual(activeCell.col, activeCell.row, options);
            if (null === isEqual) {
                return callback(options);
            }

            aReplaceCells.push(isEqual);
        }

        if (0 > aReplaceCells.length) {
            return callback(options);
        }

        return this._replaceCellsText(aReplaceCells, options, lockDraw, callback);
    };

    WorksheetView.prototype._replaceCellsText = function (aReplaceCells, options, lockDraw, callback) {
        var t = this;
        var findFlags = "g"; // Заменяем все вхождения
        if (true !== options.isMatchCase) {
            findFlags += "i";
        } // Не чувствителен к регистру

        var valueForSearching = options.findWhat
          .replace(/(\\)/g, "\\\\").replace(/(\^)/g, "\\^")
          .replace(/(\()/g, "\\(").replace(/(\))/g, "\\)")
          .replace(/(\+)/g, "\\+").replace(/(\[)/g, "\\[")
          .replace(/(\])/g, "\\]").replace(/(\{)/g, "\\{")
          .replace(/(\})/g, "\\}").replace(/(\$)/g, "\\$")
          .replace(/(~)?\*/g, function ($0, $1) {
              return $1 ? $0 : '(.*)';
          })
          .replace(/(~)?\?/g, function ($0, $1) {
              return $1 ? $0 : '.';
          })
          .replace(/(~\*)/g, "\\*").replace(/(~\?)/g, "\\?").replace(/(\.)/g, "\\.");
        valueForSearching = new RegExp(valueForSearching, findFlags);

        options.indexInArray = 0;
        options.countFind = aReplaceCells.length;
        options.countReplace = 0;
        if (options.isReplaceAll && false === this.collaborativeEditing.getCollaborativeEditing()) {
            this._isLockedCells(aReplaceCells, /*subType*/null, function () {
                t._replaceCellText(aReplaceCells, valueForSearching, options, lockDraw, callback, true);
            });
        } else {
            this._replaceCellText(aReplaceCells, valueForSearching, options, lockDraw, callback, false);
        }
    };

    WorksheetView.prototype._replaceCellText =
      function (aReplaceCells, valueForSearching, options, lockDraw, callback, oneUser) {
          var t = this;
          if (options.indexInArray >= aReplaceCells.length) {
              this.draw(lockDraw);
              return callback(options);
          }

          var onReplaceCallback = function (isSuccess) {
              var cell = aReplaceCells[options.indexInArray];
              ++options.indexInArray;
              if (false !== isSuccess) {
                  ++options.countReplace;

                  var c = t._getVisibleCell(cell.c1, cell.r1);
                      var cellValue = c.getValueForEdit();
                      cellValue = cellValue.replace(valueForSearching, options.replaceWith);

                      var oCellEdit = new asc_Range(cell.c1, cell.r1, cell.c1, cell.r1);
                      var v, newValue;
                      // get first fragment and change its text
                      v = c.getValueForEdit2().slice(0, 1);
                      // Создаем новый массив, т.к. getValueForEdit2 возвращает ссылку
                      newValue = [];
                      newValue[0] = new AscCommonExcel.Fragment({text: cellValue, format: v[0].format.clone()});

				  if (!t._saveCellValueAfterEdit(oCellEdit, c, newValue, /*flags*/undefined, /*skipNLCheck*/false,
                      /*isNotHistory*/true, /*lockDraw*/true)) {
					  options.error = true;
					  t.draw(lockDraw);
					  return callback(options);
                  }
              }

              window.setTimeout(function () {
                  t._replaceCellText(aReplaceCells, valueForSearching, options, lockDraw, callback, oneUser);
              }, 1);
          };

          return oneUser ? onReplaceCallback(true) :
            this._isLockedCells(aReplaceCells[options.indexInArray], /*subType*/null, onReplaceCallback);
      };

    WorksheetView.prototype.findCell = function (reference, isViewMode) {
        var mc, ranges = AscCommonExcel.getRangeByRef(reference, this.model, true);

        if (0 === ranges.length && !isViewMode) {
            /*TODO: сделать поиск по названиям автофигур, должен искать до того как вызвать поиск по именованным диапазонам*/
            if (this.collaborativeEditing.getGlobalLock() || !this.handlers.trigger("getLockDefNameManagerStatus")) {
                this.handlers.trigger("onErrorEvent", c_oAscError.ID.LockCreateDefName, c_oAscError.Level.NoCritical);
                    this._updateSelectionNameAndInfo();
                    return true;
                }

                // ToDo multiselect defined names
                var selectionLast = this.model.selectionRange.getLast();
                mc = selectionLast.isOneCell() ? this.model.getMergedByCell(selectionLast.r1, selectionLast.c1) : null;
            var defName = this.model.workbook.editDefinesNames(null,
                  new Asc.asc_CDefName(reference, parserHelp.get3DRef(this.model.getName(),
                    (mc || selectionLast).getAbsName())));

            if (defName) {
                this._isLockedDefNames(null, defName.getNodeId());
            } else {
                this.handlers.trigger("asc_onError", c_oAscError.ID.InvalidReferenceOrName,
                    c_oAscError.Level.NoCritical);
                    }
                    }
        return ranges;
    };

    /* Ищет дополнение для ячейки */
    WorksheetView.prototype.getCellAutoCompleteValues = function (cell, maxCount) {
        var arrValues = [], objValues = {};
        var range = this.findCellAutoComplete(cell, 1, maxCount);
        this.getColValues(range, cell.col, arrValues, objValues);
        range = this.findCellAutoComplete(cell, -1, maxCount);
        this.getColValues(range, cell.col, arrValues, objValues);

        arrValues.sort();
        return arrValues;
    };

    /* Ищет дополнение для ячейки (снизу или сверху) */
    WorksheetView.prototype.findCellAutoComplete = function (cellActive, step, maxCount) {
        var col = cellActive.col, row = cellActive.row;
        row += step;
        if (!maxCount) {
            maxCount = Number.MAX_VALUE;
        }
        var count = 0, cell, end = 0 < step ? this.model.getRowsCount() - 1 :
          0, isEnd = true, colsCount = this.model.getColsCount(), range = new asc_Range(col, row, col, row);
        for (; row * step <= end && count < maxCount; row += step, isEnd = true, ++count) {
            for (col = range.c1; col <= range.c2; ++col) {
                cell = this.model._getCellNoEmpty(row, col);
                if (cell && false === cell.isEmptyText()) {
                    isEnd = false;
                    break;
                }
            }
            // Идем влево по колонкам
            for (col = range.c1 - 1; col >= 0; --col) {
                cell = this.model._getCellNoEmpty(row, col);
                if (null === cell || cell.isEmptyText()) {
                    break;
                }
                isEnd = false;
            }
            range.c1 = col + 1;
            // Идем вправо по колонкам
            for (col = range.c2 + 1; col < colsCount; ++col) {
                cell = this.model._getCellNoEmpty(row, col);
                if (null === cell || cell.isEmptyText()) {
                    break;
                }
                isEnd = false;
            }
            range.c2 = col - 1;

            if (isEnd) {
                break;
            }
        }
        if (0 < step) {
            range.r2 = row - 1;
        } else {
            range.r1 = row + 1;
        }
        return range.r1 <= range.r2 ? range : null;
    };

    /* Формирует уникальный массив */
    WorksheetView.prototype.getColValues = function (range, col, arrValues, objValues) {
        if (null === range) {
            return;
        }
        var row, cell, value, valueLowCase;
        for (row = range.r1; row <= range.r2; ++row) {
            cell = this.model._getCellNoEmpty(row, col);
            if (cell) {
                value = cell.getValue();
                if (!AscCommon.isNumber(value)) {
                    valueLowCase = value.toLowerCase();
                    if (!objValues.hasOwnProperty(valueLowCase)) {
                        arrValues.push(value);
                        objValues[valueLowCase] = 1;
                    }
                }
            }
        }
    };

    // ----- Cell Editor -----

    WorksheetView.prototype.setCellEditMode = function ( isCellEditMode ) {
        this.isCellEditMode = isCellEditMode;
    };

    WorksheetView.prototype.setFormulaEditMode = function ( isFormulaEditMode ) {
        this.isFormulaEditMode = isFormulaEditMode;
    };

    WorksheetView.prototype.setSelectionDialogMode = function (selectionDialogType, selectRange) {
        if (selectionDialogType === this.selectionDialogType) {
            return;
        }
        var oldSelectionDialogType = this.selectionDialogType;
        this.selectionDialogType = selectionDialogType;
        this.isSelectionDialogMode = c_oAscSelectionDialogType.None !== this.selectionDialogType;
        this.cleanSelection();

        if (false === this.isSelectionDialogMode) {
            if (null !== this.copyActiveRange) {
                this.model.selectionRange = this.copyActiveRange.clone();
            }
            this.copyActiveRange = null;
            if (oldSelectionDialogType === c_oAscSelectionDialogType.Chart) {
                this.objectRender.controller.checkChartForProps(false);
            }
        } else {
            this.copyActiveRange = this.model.selectionRange.clone();
            if (selectRange) {
                if (typeof selectRange === 'string') {
                    selectRange = this.model.getRange2(selectRange);
                    if (selectRange) {
                        selectRange = selectRange.getBBox0();
                    }
                }

                if (null != selectRange) {
                    this.model.selectionRange.assign2(selectRange);
                }
            }
            if (selectionDialogType === c_oAscSelectionDialogType.Chart) {
                this.objectRender.controller.checkChartForProps(true);
            }
        }
        this._drawSelection();
    };

    // Получаем свойство: редактируем мы сейчас или нет
    WorksheetView.prototype.getCellEditMode = function () {
        return this.isCellEditMode;
    };

    WorksheetView.prototype._isFormula = function ( val ) {
        return (0 < val.length && 1 < val[0].text.length && '=' === val[0].text.charAt( 0 ));
    };

    WorksheetView.prototype.getActiveCell = function (x, y, isCoord) {
        var t = this;
        var col, row;
        if (isCoord) {
            x *= asc_getcvt(0/*px*/, 1/*pt*/, t._getPPIX());
            y *= asc_getcvt(0/*px*/, 1/*pt*/, t._getPPIY());
            col = t._findColUnderCursor(x, true);
            row = t._findRowUnderCursor(y, true);
            if (!col || !row) {
                return false;
            }
            col = col.col;
            row = row.row;
        } else {
            col = t.model.selectionRange.activeCell.col;
            row = t.model.selectionRange.activeCell.row;
        }

        // Проверим замерженность
        var mergedRange = this.model.getMergedByCell(row, col);
        return mergedRange ? mergedRange : new asc_Range(col, row, col, row);
    };

    WorksheetView.prototype._saveCellValueAfterEdit =
      function (oCellEdit, c, val, flags, skipNLCheck, isNotHistory, lockDraw) {
          var t = this;
          var oldMode = t.isFormulaEditMode;
          t.isFormulaEditMode = false;

          if (!isNotHistory) {
              History.Create_NewPoint();
              History.StartTransaction();
          }

          var isFormula = t._isFormula(val);

          if (isFormula) {
              var ftext = val.reduce(function (pv, cv) {
                  return pv + cv.text;
              }, "");
              var ret = true;
              // ToDo - при вводе формулы в заголовок автофильтра надо писать "0"
              c.setValue(ftext, function (r) {
                  ret = r;
              });
              if (!ret) {
                  t.isFormulaEditMode = oldMode;
                  History.EndTransaction();
                  return false;
              }
              isFormula = c.isFormula();
              t.model.autoFilters.renameTableColumn(oCellEdit);
          } else {
              c.setValue2(val);
              // Вызываем функцию пересчета для заголовков форматированной таблицы
              t.model.autoFilters.renameTableColumn(oCellEdit);
          }

          if (!isFormula) {
              // Нужно ли выставлять WrapText (ищем символ новой строки в тексте)
              if (!skipNLCheck) {
                  for (var i = 0; i < val.length; ++i) {
                      if (-1 !== val[i].text.indexOf(kNewLine)) {
                          c.setWrap(true);
                          break;
                      }
                  }
              }
          }

          t._updateCellsRange(oCellEdit, isNotHistory ? c_oAscCanChangeColWidth.none : c_oAscCanChangeColWidth.numbers,
            lockDraw);

          if (!isNotHistory) {
              History.EndTransaction();
          }

          // если вернуть false, то редактор не закроется
          return true;
      };

    WorksheetView.prototype.openCellEditor =
      function (editor, fragments, cursorPos, isFocus, isClearCell, isHideCursor, isQuickInput, selectionRange) {
          var t = this, tc = this.cols, tr = this.rows, col, row, c, fl, mc, bg, isMerged;

          if (selectionRange) {
              this.model.selectionRange = selectionRange;
          }
			if (0 < this.arrActiveFormulaRanges.length) {
				this.cleanSelection();
				this.cleanFormulaRanges();
				this._drawSelection();
			}

          var cell = this.model.selectionRange.activeCell;

          function getVisibleRangeObject() {
              var vr = t.visibleRange.clone(), offsetX = 0, offsetY = 0;
              if (t.topLeftFrozenCell) {
                  var cFrozen = t.topLeftFrozenCell.getCol0();
                  var rFrozen = t.topLeftFrozenCell.getRow0();
                  if (0 < cFrozen) {
                      if (col >= cFrozen) {
                          offsetX = tc[cFrozen].left - tc[0].left;
                      } else {
                          vr.c1 = 0;
                          vr.c2 = cFrozen - 1;
                      }
                  }
                  if (0 < rFrozen) {
                      if (row >= rFrozen) {
                          offsetY = tr[rFrozen].top - tr[0].top;
                      } else {
                          vr.r1 = 0;
                          vr.r2 = rFrozen - 1;
                      }
                  }
              }
              return {vr: vr, offsetX: offsetX, offsetY: offsetY};
          }

          col = cell.col;
          row = cell.row;

          // Возможно стоит заменить на ячейку из кеша
          c = this._getVisibleCell(col, row);
          fl = this._getCellFlags(c);
          isMerged = fl.isMerged();
          if (isMerged) {
              mc = fl.merged;
              c = this._getVisibleCell(mc.c1, mc.r1);
              fl = this._getCellFlags(c);
          }

          // Выставляем режим 'не редактируем' (иначе мы попытаемся переместить редактор, который еще не открыт)
          this.isCellEditMode = false;
          this.handlers.trigger("onScroll", this._calcActiveCellOffset());
          this.isCellEditMode = true;

          bg = c.getFill();
          this.isFormulaEditMode = false;

			var font = c.getFont();
          // Скрываем окно редактирования комментария
          this.model.workbook.handlers.trigger("asc_onHideComment");

          if (fragments === undefined) {
              var _fragmentsTmp = c.getValueForEdit2();
              fragments = [];
              for (var i = 0; i < _fragmentsTmp.length; ++i) {
                  fragments.push(_fragmentsTmp[i].clone());
              }
          }

          var arrAutoComplete = this.getCellAutoCompleteValues(cell, kMaxAutoCompleteCellEdit);
          var arrAutoCompleteLC = asc.arrayToLowerCase(arrAutoComplete);

          editor.open({
              fragments: fragments,
              flags: fl,
				font: new asc.FontProperties(font.getName(), font.getSize()),
              background: bg || this.settings.cells.defaultState.background,
				textColor: font.getColor() || this.settings.cells.defaultState.color,
              cursorPos: cursorPos,
              zoom: this.getZoom(),
              focus: isFocus,
              isClearCell: isClearCell,
              isHideCursor: isHideCursor,
              isQuickInput: isQuickInput,
              isAddPersentFormat: isQuickInput && Asc.c_oAscNumFormatType.Percent === c.getNumFormat().getType(),
              autoComplete: arrAutoComplete,
              autoCompleteLC: arrAutoCompleteLC,
              cellName: c.getName(),
              cellNumFormat: c.getNumFormatType(),
              saveValueCallback: function (val, flags, skipNLCheck) {
                  var oCellEdit = isMerged ? new asc_Range(mc.c1, mc.r1, mc.c1, mc.r1) :
                    new asc_Range(col, row, col, row);
                  return t._saveCellValueAfterEdit(oCellEdit, c, val, flags, skipNLCheck, /*isNotHistory*/false,
                    /*lockDraw*/false);
              },
              getSides: function () {
                  var _col = !isMerged ? col : mc.c1;
                  var _row = !isMerged ? row : mc.r2;
                  var vro = getVisibleRangeObject();
                  var i, w, h, arrLeftS = [], arrRightS = [], arrBottomS = [];
                  var offsX = tc[vro.vr.c1].left - tc[0].left - vro.offsetX;
                  var offsY = tr[vro.vr.r1].top - tr[0].top - vro.offsetY;
                  var cellX = tc[_col].left - offsX, cellY = tr[!isMerged ? row : mc.r1].top - offsY;
                  for (i = _col; i >= vro.vr.c1; --i) {
                      if (t.width_1px < tc[i].width) {
                          arrLeftS.push(tc[i].left - offsX);
                      }
                  }
                  arrLeftS.sort(AscCommon.fSortDescending);

                  // Для замерженных ячеек, можем уйти за границу
                  if (isMerged && _col > vro.vr.c2) {
                      _col = vro.vr.c2;
                  }
                  for (i = _col; i <= vro.vr.c2; ++i) {
                      w = tc[i].width;
                      if (t.width_1px < w) {
                          arrRightS.push(tc[i].left + w - offsX);
                      }
                  }
                  w = t.drawingCtx.getWidth();
                  if (arrRightS[arrRightS.length - 1] > w) {
                      arrRightS[arrRightS.length - 1] = w;
                  }
                  arrRightS.sort(fSortAscending);

                  // Для замерженных ячеек, можем уйти за границу
                  if (isMerged && _row > vro.vr.r2) {
                      _row = vro.vr.r2;
                  }
                  for (i = _row; i <= vro.vr.r2; ++i) {
                      h = tr[i].height;
                      if (t.height_1px < h) {
                          arrBottomS.push(tr[i].top + h - offsY);
                      }
                  }
                  h = t.drawingCtx.getHeight();
                  if (arrBottomS[arrBottomS.length - 1] > h) {
                      arrBottomS[arrBottomS.length - 1] = h;
                  }
                  arrBottomS.sort(fSortAscending);
                  return {l: arrLeftS, r: arrRightS, b: arrBottomS, cellX: cellX, cellY: cellY};
              }
          });
          return true;
      };

    WorksheetView.prototype.openCellEditorWithText = function (editor, text, cursorPos, isFocus, selectionRange) {
        var t = this;
        selectionRange = (selectionRange) ? selectionRange : this.model.selectionRange;
        var activeCell = selectionRange.activeCell;
        var c = t._getVisibleCell(activeCell.col, activeCell.row);
        var v, copyValue;
        // get first fragment and change its text
        v = c.getValueForEdit2().slice(0, 1);
        // Создаем новый массив, т.к. getValueForEdit2 возвращает ссылку
        copyValue = [];
        copyValue[0] = new AscCommonExcel.Fragment({text: text, format: v[0].format.clone()});

        var bSuccess = t.openCellEditor(editor, /*fragments*/undefined, /*cursorPos*/undefined, isFocus, /*isClearCell*/
          true, /*isHideCursor*/false, /*isQuickInput*/false, selectionRange);
        if (bSuccess) {
            editor.paste(copyValue, cursorPos);
        }
        return bSuccess;
    };

    WorksheetView.prototype.getFormulaRanges = function () {
        return this.arrActiveFormulaRanges;
    };

    /**
     *
     * @param {Object} ranges
     * @param canChangeColWidth
     * @param lockDraw
     * @param updateHeight
     */
    WorksheetView.prototype.updateRanges = function (ranges, lockDraw, updateHeight) {
        var arrRanges = [], range;
        for (var i in ranges) {
            range = ranges[i];
            this.updateRange(range, range.canChangeColWidth || c_oAscCanChangeColWidth.none, true);
            arrRanges.push(range);
        }

        if (0 < arrRanges.length) {
            if (updateHeight) {
                this.isChanged = true;
            }

            this._recalculateAfterUpdate(arrRanges, lockDraw);
        }
    };
    // ToDo избавиться от этой функции!!!!Заглушка для принятия изменений
    WorksheetView.prototype._checkUpdateRange = function (range) {
        // Для принятия изменения нужно делать расширение диапазона
        if (this.model.workbook.bCollaborativeChanges) {
            var bIsUpdateX = false, bIsUpdateY = false;
            if (range.c2 >= this.nColsCount) {
                this.expandColsOnScroll(false, true, 0); // Передаем 0, чтобы увеличить размеры
                // Проверка, вдруг пришел диапазон за пределами существующей области
                if (range.c2 >= this.nColsCount) {
                    if (range.c1 >= this.nColsCount) {
                        return;
                    }
                    range.c2 = this.nColsCount - 1;
                }
                bIsUpdateX = true;
            }
            if (range.r2 >= this.nRowsCount) {
                this.expandRowsOnScroll(false, true, 0); // Передаем 0, чтобы увеличить размеры
                // Проверка, вдруг пришел диапазон за пределами существующей области
                if (range.r2 >= this.nRowsCount) {
                    if (range.r1 >= this.nRowsCount) {
                        return;
                    }
                    range.r2 = this.nRowsCount - 1;
                }
                bIsUpdateY = true;
            }

            if (bIsUpdateX && bIsUpdateY) {
                this.handlers.trigger("reinitializeScroll");
            } else if (bIsUpdateX) {
                this.handlers.trigger("reinitializeScrollX");
            } else if (bIsUpdateY) {
                this.handlers.trigger("reinitializeScrollY");
            }
        }
    };
    WorksheetView.prototype.updateRange = function (range, canChangeColWidth, lockDraw) {
        this._checkUpdateRange(range);
        this._updateCellsRange(range, canChangeColWidth, lockDraw);
    };

    WorksheetView.prototype._updateCellsRange = function (range, canChangeColWidth, lockDraw) {
        var r, c, h, d, ct, isMerged;
        var mergedRange, bUpdateRowHeight;

        if (range === undefined) {
            range = this.model.selectionRange.getLast().clone();
        } else {
            // ToDo заглушка..пора уже переделать обновление данных
            if (range.r1 >= this.nRowsCount || range.c1 >= this.nColsCount) {
                return;
            }
            range.r2 = Math.min(range.r2, this.nRowsCount - 1);
            range.c2 = Math.min(range.c2, this.nColsCount - 1);
        }

        if (gc_nMaxCol0 === range.c2 || gc_nMaxRow0 === range.r2) {
            range = range.clone();
            if (gc_nMaxCol0 === range.c2) {
                range.c2 = this.cols.length - 1;
            }
            if (gc_nMaxRow0 === range.r2) {
                range.r2 = this.rows.length - 1;
            }
        }

        this._cleanCache(range);

        // Если размер диапазона превышает размер видимой области больше чем в 3 раза, то очищаем весь кэш
        if (this._isLargeRange(range)) {
            this.changeWorksheet("update", {lockDraw: lockDraw});

            this._updateSelectionNameAndInfo();
            return;
        }

        var cto;
        for (r = range.r1; r <= range.r2; ++r) {
            if (this.height_1px > this.rows[r].height) {
                continue;
            }
            for (c = range.c1; c <= range.c2; ++c) {
                if (this.width_1px > this.cols[c].width) {
                    continue;
                }
                c = this._addCellTextToCache(c, r, canChangeColWidth); // may change member 'this.isChanged'
            }
            for (h = this.defaultRowHeight, d = this.defaultRowDescender, c = 0; c < this.cols.length; ++c) {
                ct = this._getCellTextCache(c, r, true);
                if (!ct) {
                    continue;
                }

                /**
                 * Пробегаемся по строке и смотрим не продолжается ли ячейка на соседние.
                 * С помощью этой правки уйдем от обновления всей строки при каких-либо действиях
                 */
                if ((c < range.c1 || c > range.c2) && (0 !== ct.sideL || 0 !== ct.sideR)) {
                    cto = this._calcCellTextOffset(c, r, ct.cellHA, ct.metrics.width);
                    ct.cellW = cto.maxWidth;
                    ct.sideL = cto.leftSide;
                    ct.sideR = cto.rightSide;
                }

                // Замерженная ячейка (с 2-мя или более строками) не влияет на высоту строк!
                isMerged = ct.flags.isMerged();
                if (!isMerged) {
                    bUpdateRowHeight = true;
                } else {
                    mergedRange = ct.flags.merged;
                    // Для замерженных ячеек (с 2-мя или более строками) оптимизировать не нужно
                    bUpdateRowHeight = mergedRange.r1 === mergedRange.r2;
                }
                if (bUpdateRowHeight) {
                    h = Math.max(h, ct.metrics.height + this.height_1px);
                }

                if (ct.cellVA !== Asc.c_oAscVAlign.Top && ct.cellVA !== Asc.c_oAscVAlign.Center && !isMerged) {
                    d = Math.max(d, ct.metrics.height - ct.metrics.baseline);
                }
            }
            if (Math.abs(h - this.rows[r].height) > 0.000001 && !this.rows[r].isCustomHeight) {
                this.rows[r].heightReal = this.rows[r].height = Math.min(h, this.maxRowHeight);
				History.TurnOff();
                this.model.setRowHeight(this.rows[r].height, r, r, false);
				History.TurnOn();
                this.isChanged = true;
            }
            if (Math.abs(d - this.rows[r].descender) > 0.000001) {
                this.rows[r].descender = d;
                this.isChanged = true;
            }
        }

        if (!lockDraw) {
            this._recalculateAfterUpdate([range]);
        }
    };

    WorksheetView.prototype._recalculateAfterUpdate = function (arrChanged, lockDraw) {
        if (this.isChanged) {
            this.isChanged = false;
            this._initCellsArea(AscCommonExcel.recalcType.full);
            this.cache.reset();
            this._cleanCellsTextMetricsCache();
            this._prepareCellTextMetricsCache();
            this.handlers.trigger("reinitializeScroll");
        }
        if (!lockDraw) {
            this._updateSelectionNameAndInfo();
        }

        this.model.onUpdateRanges(arrChanged);
        this.objectRender.rebuildChartGraphicObjects(arrChanged);
        this.cellCommentator.updateCommentPosition();
        this.handlers.trigger("onDocumentPlaceChanged");
        this.draw(lockDraw);
    };

    WorksheetView.prototype.setChartRange = function (range) {
        this.isChartAreaEditMode = true;
        this.arrActiveChartRanges[0].assign2(range);
    };
    WorksheetView.prototype.endEditChart = function () {
        if (this.isChartAreaEditMode) {
            this.isChartAreaEditMode = false;
            this.arrActiveChartRanges[0].clean();
        }
    };

    WorksheetView.prototype.enterCellRange = function (editor) {
        if (!this.isFormulaEditMode) {
            return;
        }

        var currentFormula = this.arrActiveFormulaRanges[this.arrActiveFormulaRangesPosition];
        var currentRange = currentFormula.getLast().clone();
        var activeCellId = currentFormula.activeCellId;
        var activeCell = currentFormula.activeCell.clone();
        // Замерженную ячейку должны отдать только левую верхнюю.
        var mergedRange = this.model.getMergedByCell(currentRange.r1, currentRange.c1);
        if (mergedRange && currentRange.isEqual(mergedRange)) {
            currentRange.r2 = currentRange.r1;
            currentRange.c2 = currentRange.c1;
        }

        /*            var defName = this.model.workbook.findDefinesNames(this.model.getName()+"!"+currentRange.getAbsName(),this.model.getId());
         console.log("defName #2 " + defName);*/
        var sheetName = "", cFEWSO = editor.handlers.trigger("getCellFormulaEnterWSOpen");
        if (editor.formulaIsOperator() && cFEWSO && cFEWSO.model.getId() != this.model.getId()) {
            sheetName = parserHelp.getEscapeSheetName(this.model.getName()) + "!";
        }
        editor.enterCellRange(/*defName || */sheetName + currentRange.getAllRange().getName());

        for (var tmpRange, i = 0; i < this.arrActiveFormulaRanges.length; ++i) {
            tmpRange = this.arrActiveFormulaRanges[i];
            if (tmpRange.getLast().isEqual(currentRange)) {
                tmpRange.activeCellId = activeCellId;
                tmpRange.activeCell.col = activeCell.col;
                tmpRange.activeCell.row = activeCell.row;
                break;
            }
        }
    };

    WorksheetView.prototype.addFormulaRange = function (range) {
        var r = this.model.selectionRange.clone();
        if (range) {
            r.assign2(range);
            var lastSelection = r.getLast();
            lastSelection.cursorePos = range.cursorePos;
            lastSelection.formulaRangeLength = range.formulaRangeLength;
            lastSelection.colorRangePos = range.colorRangePos;
            lastSelection.colorRangeLength = range.colorRangeLength;
            lastSelection.isName = range.isName;
        }
        this.arrActiveFormulaRanges.push(r);
        this.arrActiveFormulaRangesPosition = this.arrActiveFormulaRanges.length - 1;
        this._fixSelectionOfMergedCells();
    };

    WorksheetView.prototype.activeFormulaRange = function (range) {
        this.arrActiveFormulaRangesPosition = -1;
        for (var i = 0; i < this.arrActiveFormulaRanges.length; ++i) {
            if (this.arrActiveFormulaRanges[i].getLast().isEqual(range)) {
                this.arrActiveFormulaRangesPosition = i;
                return;
            }
        }
    };
    WorksheetView.prototype.removeFormulaRange = function (range) {
        this.arrActiveFormulaRangesPosition = -1;
        for (var i = 0; i < this.arrActiveFormulaRanges.length; ++i) {
            if (this.arrActiveFormulaRanges[i].getLast().isEqual(range)) {
                this.arrActiveFormulaRanges.splice(i, 1);
                return;
            }
        }
    };

    WorksheetView.prototype.cleanFormulaRanges = function () {
        // Очищаем массив ячеек для текущей формулы
        this.arrActiveFormulaRangesPosition = -1;
        this.arrActiveFormulaRanges = [];
    };

    WorksheetView.prototype.addAutoFilter = function (styleName, addFormatTableOptionsObj) {
        // Проверка глобального лока
        if (this.collaborativeEditing.getGlobalLock()) {
            return;
        }

        if (!this.handlers.trigger("getLockDefNameManagerStatus")) {
            this.handlers.trigger("onErrorEvent", c_oAscError.ID.LockCreateDefName, c_oAscError.Level.NoCritical);
            return;
        }

        var t = this;
        var ar = this.model.selectionRange.getLast().clone();

        var isChangeAutoFilterToTablePart = function (addFormatTableOptionsObj) {
            var res = false;
            var worksheet = t.model;

            var activeRange = AscCommonExcel.g_oRangeCache.getAscRange(addFormatTableOptionsObj.asc_getRange());
            if (activeRange && worksheet.AutoFilter && activeRange.containsRange(worksheet.AutoFilter.Ref) &&
              activeRange.r1 === worksheet.AutoFilter.Ref.r1) {
                res = true;
            }

            return res;
        };

        var onChangeAutoFilterCallback = function (isSuccess) {
            if (false === isSuccess) {
                t.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.LockedAllError,
                  c_oAscError.Level.NoCritical);
                t.handlers.trigger("selectionChanged");
                return;
            }

			var addNameColumn, filterRange;
            if (addFormatTableOptionsObj && isChangeAutoFilterToTablePart(addFormatTableOptionsObj) === true)//CHANGE FILTER TO TABLEPART
            {
				filterRange = t.model.AutoFilter.Ref.clone();

                var addFilterCallBack = function () {
                    History.Create_NewPoint();
                    History.StartTransaction();

                    t.model.autoFilters.changeAutoFilterToTablePart(styleName, ar, addFormatTableOptionsObj);
                    t._onUpdateFormatTable(filterRange, !!(styleName), true);

                    History.EndTransaction();
                };

                addNameColumn = false;
                if (addFormatTableOptionsObj === false) {
                    addNameColumn = true;
                } else if (typeof addFormatTableOptionsObj == 'object') {
                    addNameColumn = !addFormatTableOptionsObj.asc_getIsTitle();
                }
                if (addNameColumn) {
                    filterRange.r2 = filterRange.r2 + 1;
                }

                t._isLockedCells(filterRange, /*subType*/null, addFilterCallBack);
            } else//ADD
            {
                var addFilterCallBack = function () {
                    History.Create_NewPoint();
                    History.StartTransaction();

                    t.model.autoFilters.addAutoFilter(styleName, ar, addFormatTableOptionsObj);

                    //updates
                    if (styleName && addNameColumn) {
                        t.setSelection(filterRange);
                    }
                    t._onUpdateFormatTable(filterRange, !!(styleName), true);

                    History.EndTransaction();
                };

                if (styleName === null) {
                    addFilterCallBack();
                } else {
                    var filterInfo = t.model.autoFilters._getFilterInfoByAddTableProps(ar, addFormatTableOptionsObj);
                    filterRange = filterInfo.filterRange
                    addNameColumn = filterInfo.addNameColumn;

                    t._isLockedCells(filterRange, null, addFilterCallBack)
                }
            }
        };

        if (t._checkAddAutoFilter(ar, styleName, addFormatTableOptionsObj) === true) {
            this._isLockedAll(onChangeAutoFilterCallback);
            this._isLockedDefNames(null, null);
        } else//для того, чтобы в случае ошибки кнопка отжималась!
        {
            t.handlers.trigger("selectionChanged");
        }
    };

    WorksheetView.prototype.changeAutoFilter = function (tableName, optionType, val) {
        // Проверка глобального лока
        if (this.collaborativeEditing.getGlobalLock()) {
            return;
        }

        var t = this;
        var ar = this.model.selectionRange.getLast().clone();

        var onChangeAutoFilterCallback = function (isSuccess) {
            if (false === isSuccess) {
                t.handlers.trigger("selectionChanged");
                return;
            }

            switch (optionType) {
                case Asc.c_oAscChangeFilterOptions.filter:
                {
                    //DELETE
                    if (!val) {
                        var filterRange = null;
                        var tablePartsContainsRange = t.model.autoFilters._isTablePartsContainsRange(ar);
											if (tablePartsContainsRange && tablePartsContainsRange.Ref) {
                          filterRange = tablePartsContainsRange.Ref.clone();
                      } else if (t.model.AutoFilter) {
                          filterRange = t.model.AutoFilter.Ref;
                      }

											if (null === filterRange) {
                          return;
                      }

                        var deleteFilterCallBack = function () {
                            t.model.autoFilters.deleteAutoFilter(ar, tableName);

                            t.af_drawButtons(filterRange);
                            t._onUpdateFormatTable(filterRange, false, true);
                        }

                        t._isLockedCells(filterRange, /*subType*/null, deleteFilterCallBack);

                    } else//ADD ONLY FILTER
                    {
                        var addFilterCallBack = function () {
                            History.Create_NewPoint();
                            History.StartTransaction();

                            t.model.autoFilters.addAutoFilter(null, ar);
                            t._onUpdateFormatTable(filterRange, false, true);

                            History.EndTransaction();
                        };

                        var filterInfo = t.model.autoFilters._getFilterInfoByAddTableProps(ar);
                        var filterRange = filterInfo.filterRange

                        t._isLockedCells(filterRange, null, addFilterCallBack)
                    }

                    break;
                }
                case Asc.c_oAscChangeFilterOptions.style://CHANGE STYLE
                {
                    var changeStyleFilterCallBack = function () {
                        History.Create_NewPoint();
                        History.StartTransaction();

                        //TODO внутри вызывается _isTablePartsContainsRange
                        t.model.autoFilters.changeTableStyleInfo(val, ar, tableName);
                        t._onUpdateFormatTable(filterRange, false, true);

                        History.EndTransaction();
                    };

                    var filterRange;
                    //calculate lock range and callback parameters
                    var isTablePartsContainsRange = t.model.autoFilters._isTablePartsContainsRange(ar);
									if (isTablePartsContainsRange !== null)//if one of the tableParts contains activeRange
                  {
                      filterRange = isTablePartsContainsRange.Ref.clone();
                  }

                    t._isLockedCells(filterRange, /*subType*/null, changeStyleFilterCallBack);

                    break;
                }
            }
        };

		if(Asc.c_oAscChangeFilterOptions.style === optionType)
		{
			onChangeAutoFilterCallback(true);
		}
		else
		{
        this._isLockedAll(onChangeAutoFilterCallback);
		}
    };

    WorksheetView.prototype.applyAutoFilter = function (autoFilterObject) {
        var t = this;
        var ar = this.model.selectionRange.getLast().clone();
        var onChangeAutoFilterCallback = function (isSuccess) {
            if (false === isSuccess) {
                return;
            }

            var applyFilterProps = t.model.autoFilters.applyAutoFilter(autoFilterObject, ar);
            var minChangeRow = applyFilterProps.minChangeRow;
            var rangeOldFilter = applyFilterProps.rangeOldFilter;

            if (null !== rangeOldFilter && !t.model.workbook.bUndoChanges && !t.model.workbook.bRedoChanges) {
                t._onUpdateFormatTable(rangeOldFilter, false, true);
				if (applyFilterProps.nOpenRowsCount !== applyFilterProps.nAllRowsCount) {
					t.handlers.trigger('onFilterInfo', applyFilterProps.nOpenRowsCount, applyFilterProps.nAllRowsCount);
				}
            }

            if (null !== minChangeRow) {
                t.objectRender.updateSizeDrawingObjects({target: c_oTargetType.RowResize, row: minChangeRow});
            }
        };
        this._isLockedAll(onChangeAutoFilterCallback);
    };

    WorksheetView.prototype.reapplyAutoFilter = function (tableName) {
        var t = this;
        var ar = this.model.selectionRange.getLast().clone();
        var onChangeAutoFilterCallback = function (isSuccess) {
            if (false === isSuccess) {
                return;
            }

            //reApply
            var applyFilterProps = t.model.autoFilters.reapplyAutoFilter(tableName, ar);

            //reSort
            var filter = applyFilterProps.filter;
            if (filter && filter.SortState && filter.SortState.SortConditions && filter.SortState.SortConditions[0]) {
                var sortState = filter.SortState;
                var rangeWithoutHeaderFooter = filter.getRangeWithoutHeaderFooter();
                var sortRange = t.model.getRange3(rangeWithoutHeaderFooter.r1, rangeWithoutHeaderFooter.c1,
                  rangeWithoutHeaderFooter.r2, rangeWithoutHeaderFooter.c2);
                var startCol = sortState.SortConditions[0].Ref.c1;
                var type;
                var rgbColor = null;
                switch (sortState.SortConditions[0].ConditionSortBy) {
                    case Asc.ESortBy.sortbyCellColor:
                    {
                        type = Asc.c_oAscSortOptions.ByColorFill;
                        rgbColor = sortState.SortConditions[0].dxf.fill.bg;
                        break;
                    }
                    case Asc.ESortBy.sortbyFontColor:
                    {
                        type = Asc.c_oAscSortOptions.ByColorFont;
                        rgbColor = sortState.SortConditions[0].dxf.font.getColor();
                        break;
                    }
                    default:
                    {
                        type = Asc.c_oAscSortOptions.ByColorFont;
                        if (sortState.SortConditions[0].ConditionDescending) {
                            type = Asc.c_oAscSortOptions.Ascending;
                        } else {
                            type = Asc.c_oAscSortOptions.Descending;
                        }
                    }
                }

                var sort = sortRange.sort(type, startCol, rgbColor);
                t.cellCommentator.sortComments(sort);
            }

            t.model.autoFilters._resetTablePartStyle();

            var minChangeRow = applyFilterProps.minChangeRow;
            var updateRange = applyFilterProps.updateRange;

            if (updateRange && !t.model.workbook.bUndoChanges && !t.model.workbook.bRedoChanges) {
                t._onUpdateFormatTable(updateRange, false, true);
            }

            if (null !== minChangeRow) {
                t.objectRender.updateSizeDrawingObjects({target: c_oTargetType.RowResize, row: minChangeRow});
            }
        };
        this._isLockedAll(onChangeAutoFilterCallback);
    };

    WorksheetView.prototype.applyAutoFilterByType = function (autoFilterObject) {
        var t = this;
        var activeCell = this.model.selectionRange.activeCell.clone();
        var ar = this.model.selectionRange.getLast().clone();

        var isStartRangeIntoFilterOrTable = t.model.autoFilters.isStartRangeContainIntoTableOrFilter(activeCell);
        var isApplyAutoFilter = null, isAddAutoFilter = null, cellId = null, isFromatTable = null;
        if (null !== isStartRangeIntoFilterOrTable)//into autofilter or format table
        {
            isFromatTable = !(-1 === isStartRangeIntoFilterOrTable);
            var filterRef = isFromatTable ? t.model.TableParts[isStartRangeIntoFilterOrTable].Ref :
              t.model.AutoFilter.Ref;
            cellId = t.model.autoFilters._rangeToId(Asc.Range(ar.c1, filterRef.r1, ar.c1, filterRef.r1));
            isApplyAutoFilter = true;

            if (isFromatTable && !t.model.TableParts[isStartRangeIntoFilterOrTable].AutoFilter)//add autofilter to tablepart
            {
                isAddAutoFilter = true;
            }
        } else//without filter
        {
            isAddAutoFilter = true;
            isApplyAutoFilter = true;
        }


        var onChangeAutoFilterCallback = function (isSuccess) {
            if (false === isSuccess) {
                return;
            }

            History.Create_NewPoint();
            History.StartTransaction();

            if (null !== isAddAutoFilter) {
                //delete old filter
                if (!isFromatTable && t.model.AutoFilter && t.model.AutoFilter.Ref) {
                    t.model.autoFilters.isEmptyAutoFilters(t.model.AutoFilter.Ref);
                }

                //add new filter
                t.model.autoFilters.addAutoFilter(null, ar, null);
                //generate cellId
                if (null === cellId) {
                    cellId = t.model.autoFilters._rangeToId(
                      Asc.Range(activeCell.col, t.model.AutoFilter.Ref.r1, activeCell.col, t.model.AutoFilter.Ref.r1));
                }
            }

            if (null !== isApplyAutoFilter) {
                autoFilterObject.asc_setCellId(cellId);

                var filter = autoFilterObject.filter;
                if (c_oAscAutoFilterTypes.CustomFilters === filter.type) {
                    var cell = t.model._getCell(activeCell.row, activeCell.col);
                    var val = cell.getValueWithoutFormat();
                    filter.filter.CustomFilters[0].Val = val;
                } else if (c_oAscAutoFilterTypes.ColorFilter === filter.type) {
                    var cell = t.model._getCell(activeCell.row, activeCell.col);
                    if (filter.filter && filter.filter.dxf && filter.filter.dxf.fill) {
                        if (false === filter.filter.CellColor) {
                            var fontColor = cell.xfs && cell.xfs.font ? cell.xfs.font.getColor() : null;
                            //TODO добавлять дефолтовый цвет шрифта в случае, если цвет шрифта не указан
                            if (null !== fontColor) {
                                filter.filter.dxf.fill.bg = fontColor;
                            }
                        } else {
                            //TODO просмотерть ситуации без заливки
                            var color = cell.getStyle();
                            var cellColor = null !== color && color.fill && color.fill.bg ? color.fill.bg : null;
                            filter.filter.dxf.fill.bg = null !== cellColor ? new AscCommonExcel.RgbColor(cellColor.rgb) : new AscCommonExcel.RgbColor(null);
                        }
                    }
                }

                var applyFilterProps = t.model.autoFilters.applyAutoFilter(autoFilterObject, ar);
                var minChangeRow = applyFilterProps.minChangeRow;
                var rangeOldFilter = applyFilterProps.rangeOldFilter;

                if (null !== rangeOldFilter && !t.model.workbook.bUndoChanges && !t.model.workbook.bRedoChanges) {
                    t._onUpdateFormatTable(rangeOldFilter, false, true);
                }

                if (null !== minChangeRow) {
                    t.objectRender.updateSizeDrawingObjects({target: c_oTargetType.RowResize, row: minChangeRow});
                }
            }

            History.EndTransaction();
        };

        if (null === isAddAutoFilter)//do not add autoFilter
        {
            this._isLockedAll(onChangeAutoFilterCallback);
        } else//add autofilter + apply
        {
            if (t._checkAddAutoFilter(ar, null, autoFilterObject, true) === true) {
                this._isLockedAll(onChangeAutoFilterCallback);
                this._isLockedDefNames(null, null);
            }
        }

    };

    WorksheetView.prototype.sortRange = function (type, cellId, displayName, color, bIsExpandRange) {
        var t = this;
        var ar = this.model.selectionRange.getLast().clone();
        var onChangeAutoFilterCallback = function (isSuccess) {
            if (false === isSuccess) {
                return;
            }
            var sortProps = t.model.autoFilters.getPropForSort(cellId, ar, displayName);

            var onSortAutoFilterCallBack = function () {
                History.Create_NewPoint();
                History.StartTransaction();

                var rgbColor = color ?
                  new AscCommonExcel.RgbColor((color.asc_getR() << 16) + (color.asc_getG() << 8) + color.asc_getB()) :
                  null;

                var sort = sortProps.sortRange.sort(type, sortProps.startCol, rgbColor);
                t.cellCommentator.sortComments(sort);
                t.model.autoFilters.sortColFilter(type, cellId, ar, sortProps, displayName, rgbColor);

                t._onUpdateFormatTable(sortProps.sortRange.bbox, false);
                History.EndTransaction();
            };

			if (null === sortProps) {
				var rgbColor = color ?  new AscCommonExcel.RgbColor((color.asc_getR() << 16) + (color.asc_getG() << 8) + color.asc_getB()) : null;

				//expand selectionRange
				if(bIsExpandRange)
				{
					var selectionRange = t.model.selectionRange;
					var activeCell = selectionRange.activeCell;
					var activeCellRange = new Asc.Range(activeCell.col, activeCell.row, activeCell.col, activeCell.row);
					var expandRange = t.model.autoFilters._getAdjacentCellsAF(activeCellRange, true);

					//change selection
					t.setSelection(expandRange);
				}

				//sort
				t.setSelectionInfo("sort", type, null, null, rgbColor);
				//TODO возможно стоит возвратить selection обратно

            } else if (false !== sortProps) {
                t._isLockedCells(sortProps.sortRange.bbox, /*subType*/null, onSortAutoFilterCallBack);
            }
        };
        this._isLockedAll(onChangeAutoFilterCallback);
    };

    WorksheetView.prototype.getAddFormatTableOptions = function (range) {
        var selectionRange = this.model.selectionRange.getLast();
        //TODO возможно стоит перенести getAddFormatTableOptions во view
        return this.model.autoFilters.getAddFormatTableOptions(selectionRange, range);
    };

    WorksheetView.prototype.clearFilter = function () {
        var t = this;
        var ar = this.model.selectionRange.getLast().clone();
        var onChangeAutoFilterCallback = function (isSuccess) {
            if (false === isSuccess) {
                return;
            }

            var updateRange = t.model.autoFilters.isApplyAutoFilterInCell(ar, true);
            if (false !== updateRange) {
                t._onUpdateFormatTable(updateRange, false, true);
            }
        };
        this._isLockedAll(onChangeAutoFilterCallback);
    };

    WorksheetView.prototype.clearFilterColumn = function (cellId, displayName) {
        var t = this;

        var onChangeAutoFilterCallback = function (isSuccess) {
            if (false === isSuccess) {
                return;
            }

            var updateRange = t.model.autoFilters.clearFilterColumn(cellId, displayName);

            if (false !== updateRange) {
                t._onUpdateFormatTable(updateRange, false, true);
            }
        };
        this._isLockedAll(onChangeAutoFilterCallback);
    };

    /**
     * Обновление при изменениях форматированной таблицы
     * @param range - обновляемый диапазон (он же диапазон для выделения)
     * @param recalc - делать ли автоподбор по названию столбца
     * @param changeRowsOrMerge - менялись ли строки (скрытие раскрытие) или был unmerge
     * @private
     */
    WorksheetView.prototype._onUpdateFormatTable = function (range, recalc, changeRowsOrMerge) {
        //ToDo заглушка, чтобы не падало. Нужно полностью переделывать этот код!!!! (Перенес выше из-за бага http://bugzilla.onlyoffice.com/show_bug.cgi?id=26705)
        this._checkUpdateRange(range);

        if (!recalc) {
            // При скрытии/открытии строк стоит делать update всему
            if (changeRowsOrMerge) {
                this.isChanged = true;
            }
            // Пока вызовем updateRange, но стоит делать просто draw
            this._updateCellsRange(range);
            // ToDo убрать совсем reinitRanges
            if (this.objectRender && this.objectRender.drawingArea) {
                this.objectRender.drawingArea.reinitRanges();
            }
            return;
        }

        if (!this.model.selectionRange.getLast().isEqual(range)) {
            this.setSelection(range);
        }

        var i, r = range.r1, bIsUpdate = false, w;
        for (i = range.c1; i <= range.c2; ++i) {
            w = this.onChangeWidthCallback(i, r, r, /*onlyIfMore*/true);
            if (-1 !== w) {
                this.cols[i] = this._calcColWidth(w);
                this._cleanCache(new asc_Range(i, 0, i, this.rows.length - 1));
                bIsUpdate = true;
            }
        }

        if (bIsUpdate) {
            this._updateColumnPositions();
            this._updateVisibleColsCount();
            this.changeWorksheet("update");
        } else if (changeRowsOrMerge) {
            // Был merge, нужно обновить (ToDo)
            this._initCellsArea(AscCommonExcel.recalcType.full);
            this.cache.reset();
            this._cleanCellsTextMetricsCache();
            this._prepareCellTextMetricsCache();
            if (this.objectRender && this.objectRender.drawingArea) {
                this.objectRender.drawingArea.reinitRanges();
            }
            var arrChanged = [new asc_Range(range.c1, 0, range.c2, gc_nMaxRow0)];
			this.model.onUpdateRanges(arrChanged);
            this.objectRender.rebuildChartGraphicObjects(arrChanged);
            this.draw();
            this.handlers.trigger("reinitializeScroll");
			this._updateSelectionNameAndInfo();
        } else {
            // Просто отрисуем
            this.draw();
			this._updateSelectionNameAndInfo();
        }
    };

    WorksheetView.prototype._loadFonts = function (fonts, callback) {
        var api = window["Asc"]["editor"];
        api._loadFonts(fonts, callback);
    };

    WorksheetView.prototype.setData = function (oData) {
        History.Clear();
        History.TurnOff();
        var oAllRange = new AscCommonExcel.Range(this.model, 0, 0, this.nRowsCount - 1, this.nColsCount - 1);
        oAllRange.cleanAll();

        var row, oCell;
        for (var r = 0; r < oData.length; ++r) {
            row = oData[r];
            for (var c = 0; c < row.length; ++c) {
                if (row[c]) {
                    oCell = this._getVisibleCell(c, r);
                    oCell.setValue(row[c]);
                }
            }
        }
        History.TurnOn();
        this._updateCellsRange(oAllRange.bbox); // ToDo Стоит обновить nRowsCount и nColsCount
    };
    WorksheetView.prototype.getData = function () {
        var arrResult, arrCells = [], cell, c, r, row, lastC = -1, lastR = -1, val;
        var maxCols = Math.min(this.model.getColsCount(), gc_nMaxCol);
        var maxRows = Math.min(this.model.getRowsCount(), gc_nMaxRow);

        for (r = 0; r < maxRows; ++r) {
            row = [];
            for (c = 0; c < maxCols; ++c) {
                cell = this.model._getCellNoEmpty(r, c);
                if (cell && '' !== (val = cell.getValue())) {
                    lastC = Math.max(lastC, c);
                    lastR = Math.max(lastR, r);
                } else {
                    val = '';
                }
                row.push(val);
            }
            arrCells.push(row);
        }

        arrResult = arrCells.slice(0, lastR + 1);
        ++lastC;
        if (lastC < maxCols) {
            for (r = 0; r < arrResult.length; ++r) {
                arrResult[r] = arrResult[r].slice(0, lastC);
            }
        }
        return arrResult;
    };

    WorksheetView.prototype.af_drawButtons = function (updatedRange, offsetX, offsetY) {
        var ws = this;
        var aWs = this.model;
        var t = this;
        var m_oColor = new CColor(120, 120, 120);

        if (aWs.workbook.bUndoChanges || aWs.workbook.bRedoChanges) {
            return false;
        }

        var drawCurrentFilterButtons = function (filter) {
			var autoFilter = filter.isAutoFilter() ? filter : filter.AutoFilter;
            var range = new Asc.Range(filter.Ref.c1, filter.Ref.r1, filter.Ref.c2, filter.Ref.r1);

            if (range.isIntersect(updatedRange)) {
                var row = range.r1;

				var sortCondition = filter.isApplySortConditions() ? filter.SortState.SortConditions[0] : null;
                for (var col = range.c1; col <= range.c2; col++) {
                    if (col >= updatedRange.c1 && col <= updatedRange.c2) {
                        var isSetFilter = false;
                        var isShowButton = true;
						var isSortState = null;//true - ascending, false - descending

						var colId = filter.isAutoFilter() ? t.model.autoFilters._getTrueColId(autoFilter, col - range.c1) : col - range.c1;
                        if (autoFilter.FilterColumns && autoFilter.FilterColumns.length) {
                            var filterColumn = null, filterColumnWithMerge = null;

                            for (var i = 0; i < autoFilter.FilterColumns.length; i++) {
                                if (autoFilter.FilterColumns[i].ColId === col - range.c1) {
                                    filterColumn = autoFilter.FilterColumns[i];
                                }

                                if (colId === col - range.c1 && filterColumn !== null) {
                                    filterColumnWithMerge = filterColumn;
                                    break;
                                } else if (autoFilter.FilterColumns[i].ColId === colId) {
                                    filterColumnWithMerge = autoFilter.FilterColumns[i];
                                }
                            }

                            if (filterColumnWithMerge && filterColumnWithMerge.isApplyAutoFilter()) {
                                isSetFilter = true;
                            }

                            if (filterColumn && filterColumn.ShowButton === false) {
                                isShowButton = false;
                            }

                        }

						if(sortCondition && sortCondition.Ref)
						{
							if(colId === sortCondition.Ref.c1 - range.c1)
							{
								isSortState = sortCondition.ConditionDescending;
							}
						}

                        if (isShowButton === false) {
                            continue;
                        }

                        var width = 13;
                        var height = 13;
                        var rowHeight = ws.rows[row].height;
                        if (rowHeight < height) {
                            width = width * (rowHeight / height);
                            height = rowHeight;
                        }

                        var x1 = ws.cols[col].left + ws.cols[col].width - width - 0.5;
                        var y1 = ws.rows[row].top + ws.rows[row].height - height - 0.5;

                        t.af_drawCurrentButton(x1 - offsetX, y1 - offsetY, {isSortState: isSortState, isSetFilter: isSetFilter, row: row, col: col});
                    }
                }
            }
        };

        if (aWs.AutoFilter) {
            drawCurrentFilterButtons(aWs.AutoFilter);
        }
        if (aWs.TableParts && aWs.TableParts.length) {
            for (var i = 0; i < aWs.TableParts.length; i++) {
                if (aWs.TableParts[i].AutoFilter && aWs.TableParts[i].HeaderRowCount !== 0) {
                    drawCurrentFilterButtons(aWs.TableParts[i], true);
                }
            }
        }

        return true;
    };

	WorksheetView.prototype.af_drawCurrentButton = function (x1, y1, props) {
		var isApplyAutoFilter = props.isSetFilter;
		var isApplySortState = props.isSortState;

		var ws = this;
        var aWs = this.model;
        var t = this;

		var width_1px = t.width_1px;
		var height_1px = t.height_1px;
		var height = 15 * width_1px;
		var width = 15 * height_1px;
        var m_oColor = new CColor(120, 120, 120);

		var rowHeight = ws.rows[props.row].height;
		var colWidth = ws.cols[props.col].width;

		var scaleIndex = 1;

		var _drawButtonBorder = function(startX, startY, width, height)
		{
			ws.drawingCtx
              .setFillStyle(ws.settings.cells.defaultState.background)
              .setLineWidth(1)
              .setStrokeStyle(ws.settings.cells.defaultState.border)
              .fillRect(startX, startY, width, height)
              .strokeRect(startX, startY, width, height);
		};

		var _drawSortArrow = function(startX, startY, isDescending, heightArrow)
		{
			heightArrow = heightArrow * height_1px * scaleIndex;
			var widthArrow = 3 * width_1px * scaleIndex;
			var widthLine = 1 * width_1px * scaleIndex;
			var heightEndArrow = 3 * height_1px * scaleIndex;

			//isDescending = true - стрелочка смотрит вниз
			//рисуем сверху вниз
			var ctx = ws.drawingCtx;
			ctx.beginPath();
			ctx.lineVer(startX, startY, startY + heightArrow);

			if(isDescending)
			{
				ctx.moveTo(startX, startY + heightArrow);
				ctx.lineTo(startX - (widthArrow - widthLine), startY + heightArrow - heightEndArrow);
				ctx.moveTo(startX + widthArrow, startY + heightArrow - heightEndArrow);
				ctx.lineTo(startX, startY + heightArrow);
				//ctx.lineHor(startX - 2 * width_1px, startY + heightArrow - 1 * height_1px, startX  + 3 * width_1px);
			}
			else
			{
				ctx.moveTo(startX, startY);
				ctx.lineTo(startX - (widthArrow - widthLine), startY + heightEndArrow);
				ctx.moveTo(startX + widthArrow, startY + heightEndArrow);
				ctx.lineTo(startX, startY);
				//ctx.lineHor(startX - widthLine, startY + 1 * height_1px * scaleIndex, startX - widthLine + widthArrow);
			}

			ctx.setLineWidth(t.width_1px);
			ctx.setStrokeStyle(m_oColor);
			ctx.stroke();
		};

        var _drawFilterMark = function (x, y, height)
		{
            var size = 5.25 * scaleIndex;
            var halfSize = Math.round((size / 2) / height_1px) * height_1px;
            var meanLine = Math.round((size * Math.sqrt(3) / 3) / height_1px) * height_1px;//длина биссектрисы равностороннего треугольника
            //округляем + смещаем
            x = Math.round((x) / width_1px) * width_1px;
            y = Math.round((y) / height_1px) * height_1px;
            var y1 = y - height;

            ws.drawingCtx
              .beginPath()
              .moveTo(x, y)
              .lineTo(x, y1)
              .setStrokeStyle(m_oColor)
              .stroke();

            ws.drawingCtx
              .beginPath()
              .moveTo(x + halfSize, y1)
              .lineTo(x + halfSize, y1)
              .lineTo(x, y1 + meanLine)
              .lineTo(x - halfSize, y1)
              .lineTo(x, y1)
              .setFillStyle(m_oColor)
              .fill();
        };

        var _drawFilterDreieck = function (x, y, index)
		{
            var size = 5.25 * index;
            //сюда приходят координаты центра кнопки
            //чтобы кнопка была в центре, необходимо сместить
            var leftDiff = size / 2;
            var upDiff = Math.round(((size * Math.sqrt(3)) / 6) / height_1px) * height_1px;//радиус вписанной окружности в треугольник
            //округляем + смещаем
            x = Math.round((x - leftDiff) / width_1px) * width_1px;
            y = Math.round((y - upDiff) / height_1px) * height_1px;
            var meanLine = Math.round((size * Math.sqrt(3) / 3) / width_1px) * width_1px;//длина биссектрисы равностороннего треугольника
            var halfSize = Math.round((size / 2) / height_1px) * height_1px;
            //рисуем
            ws.drawingCtx
              .beginPath()
              .moveTo(x, y)
              .lineTo(x + size, y)
              .lineTo(x + halfSize, y + meanLine)
              .lineTo(x, y)
              .setFillStyle(m_oColor)
              .fill();
        };

		//TODO пересмотреть отрисовку кнопок + отрисовку при масштабировании
		var _drawButton = function(upLeftXButton, upLeftYButton)
		{
			//квадрат кнопки рисуем
			_drawButtonBorder(upLeftXButton, upLeftYButton, width, height);

			//координаты центра
			var centerX = upLeftXButton + (width / 2);
			var centerY = upLeftYButton + (height / 2);

			if(null !== isApplySortState && isApplyAutoFilter)
			{
				var heigthObj = Math.ceil((height / 2) / height_1px) * height_1px + 1 * height_1px;
				var marginTop = Math.floor(((height - heigthObj) / 2) / height_1px) * height_1px;
				centerY = upLeftYButton + heigthObj + marginTop;

				_drawSortArrow(upLeftXButton + 4 * width_1px * scaleIndex, upLeftYButton + 5 * height_1px * scaleIndex, isApplySortState, 8);
				_drawFilterMark(centerX + 2 * width_1px, centerY, heigthObj);
			}
			else if(null !== isApplySortState)
			{
				_drawSortArrow(upLeftXButton + width - 5 * width_1px * scaleIndex, upLeftYButton + 3 * height_1px * scaleIndex, isApplySortState, 10);
				_drawFilterDreieck(centerX - 3 * width_1px, centerY + 2 * height_1px, scaleIndex * 0.75);
			}
			else if (isApplyAutoFilter)
			{
				var heigthObj = Math.ceil((height / 2) / height_1px) * height_1px + 1 * height_1px;
				var marginTop = Math.floor(((height - heigthObj) / 2) / height_1px) * height_1px;

				centerY = upLeftYButton + heigthObj + marginTop;
				_drawFilterMark(centerX, centerY, heigthObj);
			}
			else
			{
				_drawFilterDreieck(centerX, centerY, scaleIndex);
			}
		};

		var diffX = 0;
		var diffY = 0;
		if ((colWidth - 2) < width && rowHeight < (height + 2))
		{
			if (rowHeight < colWidth)
			{
				scaleIndex = rowHeight / height;
				width = width * scaleIndex;
				height = rowHeight;
			}
			else
			{
				scaleIndex = colWidth / width;
				diffY = width - colWidth;
				diffX = width - colWidth;
				width = colWidth;
				height = height * scaleIndex;
			}
		}
		else if ((colWidth - 2) < width)
		{
			scaleIndex = colWidth / width;
			//смещения по x и y
			diffY = width - colWidth;
			diffX = width - colWidth + 2;
			width = colWidth;
			height = height * scaleIndex;
		}
		else if (rowHeight < height)
		{
			scaleIndex = rowHeight / height;
			width = width * scaleIndex;
			height = rowHeight;
		}

		_drawButton(x1 + diffX, y1 + diffY);
	};

    WorksheetView.prototype.af_checkCursor = function (x, y, offsetX, offsetY, frozenObj, r, c) {
        var ws = this;
        var aWs = this.model;
        var result = false;
        var t = this;

        var _checkClickFrozenArea = function (x, y, offsetX, offsetY, frozenObj) {
            var frosenPosX = frozenObj && frozenObj.cFrozen != undefined && ws.cols[frozenObj.cFrozen] ?
              ws.cols[frozenObj.cFrozen].left : null;
            var frosenPosY = frozenObj && frozenObj.rFrozen != undefined && ws.rows[frozenObj.rFrozen] ?
              ws.rows[frozenObj.rFrozen].top : null;
            var result;

            if (frosenPosX != null && frosenPosY != null && x < frosenPosX && y < frosenPosY) {
                result = {x: x, y: y};
            } else if (frosenPosX != null && x < frosenPosX) {
                result = {x: x, y: y + offsetY};
            } else if (frosenPosY != null && y < frosenPosY) {
                result = {x: x + offsetX, y: y};
            } else {
                result = {x: x + offsetX, y: y + offsetY};
            }

            return result;
        };

        var _isShowButtonInFilter = function (col, filter) {
            var result = true;
            var autoFilter = filter.isAutoFilter() ? filter : filter.AutoFilter;

            if (filter.HeaderRowCount === 0) {
                result = false;
            } else if (autoFilter && autoFilter.FilterColumns)//проверяем скрытые ячейки
            {
                var colId = col - autoFilter.Ref.c1;
                for (var i = 0; i < autoFilter.FilterColumns.length; i++) {
                    if (autoFilter.FilterColumns[i].ColId === colId) {
                        if (autoFilter.FilterColumns[i].ShowButton === false) {
                            result = false;
                        }

                        break;
                    }
                }
            } else if (!filter.isAutoFilter() && autoFilter === null)//если форматированная таблица и отсутсвует а/ф
            {
                result = false;
            }

            return result;
        };

        var checkCurrentFilter = function (filter, num) {
            var range = new Asc.Range(filter.Ref.c1, filter.Ref.r1, filter.Ref.c2, filter.Ref.r1);
            if (range.contains(c.col, r.row) && _isShowButtonInFilter(c.col, filter)) {
                var row = range.r1;
                for (var col = range.c1; col <= range.c2; col++) {
                    if (col === c.col) {
                        var width = 13;
                        var height = 13;
                        var rowHeight = ws.rows[row].height;
                        if (rowHeight < height) {
                            width = width * (rowHeight / height);
                            height = rowHeight;
                        }

                        var x1 = ws.cols[col].left + ws.cols[col].width - width - 0.5;
                        var y1 = ws.rows[row].top + ws.rows[row].height - height - 0.5;
                        var x2 = ws.cols[col].left + ws.cols[col].width - 0.5;
                        var y2 = ws.rows[row].top + ws.rows[row].height - 0.5;

                        if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
                            result = {
                                id: {id: num, colId: col - range.c1},
                                target: c_oTargetType.FilterObject,
                                col: -1,
                                row: -1
                            };
                            return;
                        }
                    }
                }
            }
        };


        var checkFrozenArea = _checkClickFrozenArea(x, y, offsetX, offsetY, frozenObj);
        if (checkFrozenArea) {
            x = checkFrozenArea.x;
            y = checkFrozenArea.y;
        }

        if (aWs.AutoFilter && aWs.AutoFilter.Ref) {
            checkCurrentFilter(aWs.AutoFilter, null);
        }

        if (aWs.TableParts && aWs.TableParts.length && !result) {
            for (var i = 0; i < aWs.TableParts.length; i++) {
                if (aWs.TableParts[i].AutoFilter) {
                    checkCurrentFilter(aWs.TableParts[i], i);
                }
            }
        }

        return result;
    };

    WorksheetView.prototype._checkAddAutoFilter = function (activeRange, styleName, addFormatTableOptionsObj, filterByCellContextMenu) {
        //write error, if not add autoFilter and return false
        var result = true;
        var worksheet = this.model;
        var filter = worksheet.AutoFilter;

        if (filter && styleName && filter.Ref.isIntersect(activeRange) &&
          !(filter.Ref.containsRange(activeRange) && (activeRange.isOneCell() || (filter.Ref.isEqual(activeRange))) ||
          (filter.Ref.r1 === activeRange.r1 && activeRange.containsRange(filter.Ref)))) {
            worksheet.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterDataRangeError,
              c_oAscError.Level.NoCritical);
            result = false;
        } else if (!styleName && worksheet.autoFilters._isEmptyRange(activeRange, 1))//add filter to empty range
        {
            worksheet.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterDataRangeError,
              c_oAscError.Level.NoCritical);
            result = false;
        }
        else if (!styleName && filterByCellContextMenu && false === worksheet.autoFilters._getAdjacentCellsAF(activeRange, this).isIntersect(activeRange))//add filter to empty range
        {
            worksheet.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterDataRangeError,
                c_oAscError.Level.NoCritical);
            result = false;
        }else if (styleName && addFormatTableOptionsObj && addFormatTableOptionsObj.isTitle === false &&
          worksheet.autoFilters._isEmptyCellsUnderRange(activeRange) == false &&
          worksheet.autoFilters._isPartTablePartsUnderRange(activeRange))//add format table without title if down another format table
        {
            worksheet.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError,
              c_oAscError.Level.NoCritical);
            result = false;
        }

        return result;
    };

    WorksheetView.prototype.af_getSizeButton = function (c, r) {
        var ws = this;
        var result = null;

        var isCellContainsAutoFilterButton = function (col, row) {
            var aWs = ws.model;
            if (aWs.TableParts) {
                var tablePart;
                for (var i = 0; i < aWs.TableParts.length; i++) {
                    tablePart = aWs.TableParts[i];
                    //TODO добавить проверку на isHidden у кнопки
                    if (tablePart.Ref.contains(col, row) && tablePart.Ref.r1 === row) {
                        return true;
                    }
                }
            }

            //TODO добавить проверку на isHidden у кнопки
            if (aWs.AutoFilter && aWs.AutoFilter.Ref.contains(col, row) && aWs.AutoFilter.Ref.r1 === row) {
                return true;
            }

            return false;
        };

        if (isCellContainsAutoFilterButton(c, r)) {
            var height = 11;
            var width = 11;
            var rowHeight = ws.rows[r].height;
            var index = 1;
            if (rowHeight < height) {
                index = rowHeight / height;
                width = width * index;
                height = rowHeight;
            }

            result = {width: width, height: height};
        }

        return result;
    };

    WorksheetView.prototype.af_setDialogProp = function (filterProp, isReturnProps) {
        var ws = this.model;

        //get filter
        var filter, autoFilter, displayName = null;
        if (filterProp.id === null) {
            autoFilter = ws.AutoFilter;
            filter = ws.AutoFilter;
        } else {
            autoFilter = ws.TableParts[filterProp.id].AutoFilter;
            filter = ws.TableParts[filterProp.id];
            displayName = filter.DisplayName;
        }

        //get values
        var colId = filterProp.colId;
        var openAndClosedValues = ws.autoFilters._getOpenAndClosedValues(filter, colId);
        var values = openAndClosedValues.values;
        var automaticRowCount = openAndClosedValues.automaticRowCount;
        var filters = ws.autoFilters._getFilterColumn(autoFilter, colId);

        var rangeButton = Asc.Range(autoFilter.Ref.c1 + colId, autoFilter.Ref.r1, autoFilter.Ref.c1 + colId,
          autoFilter.Ref.r1);
        var cellId = ws.autoFilters._rangeToId(rangeButton);

        var cellCoord = this.getCellCoord(autoFilter.Ref.c1 + colId, autoFilter.Ref.r1);

        //get filter object
        var filterObj = new Asc.AutoFilterObj();
        if (filters && filters.ColorFilter) {
            filterObj.type = c_oAscAutoFilterTypes.ColorFilter;
            filterObj.filter = filters.ColorFilter.clone();
        } else if (filters && filters.CustomFiltersObj && filters.CustomFiltersObj.CustomFilters) {
            filterObj.type = c_oAscAutoFilterTypes.CustomFilters;
            filterObj.filter = filters.CustomFiltersObj;
        } else if (filters && filters.DynamicFilter) {
            filterObj.type = c_oAscAutoFilterTypes.DynamicFilter;
            filterObj.filter = filters.DynamicFilter.clone();
        } else if (filters && filters.Top10) {
            filterObj.type = c_oAscAutoFilterTypes.Top10;
            filterObj.filter = filters.Top10.clone();
        } else if (filters) {
            filterObj.type = c_oAscAutoFilterTypes.Filters;
        } else {
            filterObj.type = c_oAscAutoFilterTypes.None;
        }

        //get sort
        var sortVal = null;
        var sortColor = null;
        if (filter && filter.SortState && filter.SortState.SortConditions && filter.SortState.SortConditions[0]) {
            var SortConditions = filter.SortState.SortConditions[0];
            if (rangeButton.r1 == SortConditions.Ref.r1 && rangeButton.c1 == SortConditions.Ref.c1) {

                var conditionSortBy = SortConditions.ConditionSortBy;
                switch (conditionSortBy) {
                    case Asc.ESortBy.sortbyCellColor:
                    {
                        sortVal = Asc.c_oAscSortOptions.ByColorFill;
                        sortColor = SortConditions.dxf && SortConditions.dxf.fill ? SortConditions.dxf.fill.bg : null;
                        break;
                    }
                    case Asc.ESortBy.sortbyFontColor:
                    {
                        sortVal = Asc.c_oAscSortOptions.ByColorFont;
                        sortColor = SortConditions.dxf && SortConditions.dxf.font ? SortConditions.dxf.font.getColor() : null;
                        break;
                    }
                    default:
                    {
                        if (filter.SortState.SortConditions[0].ConditionDescending == false) {
                            sortVal = Asc.c_oAscSortOptions.Descending;
                        } else {
                            sortVal = Asc.c_oAscSortOptions.Ascending;
                        }

                        break;
                    }
                }
            }
        }

        var ascColor = null;
        if (null !== sortColor) {
            ascColor = new Asc.asc_CColor();
            ascColor.asc_putR(sortColor.getR());
            ascColor.asc_putG(sortColor.getG());
            ascColor.asc_putB(sortColor.getB());
            ascColor.asc_putA(sortColor.getA());
        }


        //set menu object
        var autoFilterObject = new Asc.AutoFiltersOptions();

        autoFilterObject.asc_setSortState(sortVal);
        autoFilterObject.asc_setCellCoord(cellCoord);
        autoFilterObject.asc_setCellId(cellId);
        autoFilterObject.asc_setValues(values);
        autoFilterObject.asc_setFilterObj(filterObj);
        autoFilterObject.asc_setAutomaticRowCount(automaticRowCount);
        autoFilterObject.asc_setDiplayName(displayName);
        autoFilterObject.asc_setSortColor(ascColor);

        var columnRange = Asc.Range(rangeButton.c1, autoFilter.Ref.r1 + 1, rangeButton.c1, autoFilter.Ref.r2);

        var filterTypes = this.af_getFilterTypes(columnRange);
        autoFilterObject.asc_setIsTextFilter(filterTypes.text);
        autoFilterObject.asc_setColorsFill(filterTypes.colors);
        autoFilterObject.asc_setColorsFont(filterTypes.fontColors);

        if (isReturnProps) {
            return autoFilterObject;
        } else {
            this.handlers.trigger("setAutoFiltersDialog", autoFilterObject);
        }
    };

    WorksheetView.prototype.af_getFilterTypes = function (columnRange) {
        var t = this;
        var ws = this.model;
        var res = {text: true, colors: [], fontColors: []};
        var alreadyAddColors = {}, alreadyAddFontColors = {};

        var getAscColor = function (color) {
            var ascColor = new Asc.asc_CColor();
            ascColor.asc_putR(color.getR());
            ascColor.asc_putG(color.getG());
            ascColor.asc_putB(color.getB());
            ascColor.asc_putA(color.getA());

            return ascColor;
        };

        var addFontColorsToArray = function (fontColor) {
            var rgb = null === fontColor || fontColor && 0 === fontColor.rgb ? null : fontColor.rgb;
            var isDefaultFontColor = !!(null === rgb);

            if (true !== alreadyAddFontColors[rgb]) {
                if (isDefaultFontColor) {
                    res.fontColors.push(null);
                    alreadyAddFontColors[null] = true;
                } else {
                    var ascFontColor = getAscColor(fontColor);
                    res.fontColors.push(ascFontColor);
                    alreadyAddFontColors[rgb] = true;
                }
            }
        };

        var addCellColorsToArray = function (color) {
            var rgb = null !== color && color.fill && color.fill.bg ? color.fill.bg.rgb : null;
            var isDefaultCellColor = !!(null === rgb);

            if (true !== alreadyAddColors[rgb]) {
                if (isDefaultCellColor) {
                    res.colors.push(null);
                    alreadyAddColors[null] = true;
                } else {
                    var ascColor = getAscColor(color.fill.bg);
                    res.colors.push(ascColor);
                    alreadyAddColors[rgb] = true;
                }
            }
        };

        var tempText = 0, tempDigit = 0;
        for (var i = columnRange.r1; i <= columnRange.r2; i++) {
            var cell = ws._getCellNoEmpty(i, columnRange.c1);

            //добавляем без цвета ячейку
            if (!cell) {
                if (true !== alreadyAddColors[null]) {
                    alreadyAddColors[null] = true;
                    res.colors.push(null);
                }
                continue;
            }

            if (false === cell.isEmptyText()) {
                var type = cell.getType();

                if (type === 0) {
                    tempDigit++;
                } else {
                    tempText++;
                }
            }

            //font colors
            if (null !== cell.oValue.multiText) {
                for (var j = 0; j < cell.oValue.multiText.length; j++) {
                    var fontColor = cell.oValue.multiText[j].format ? cell.oValue.multiText[j].format.getColor() : null;
                    addFontColorsToArray(fontColor);
                }
            } else {
                var fontColor = cell.xfs && cell.xfs.font ? cell.xfs.font.getColor() : null;
                addFontColorsToArray(fontColor);
            }

            //cell colors
            addCellColorsToArray(cell.getStyle());
        }

        //если один элемент в массиве, не отправляем его в меню
        if (res.colors.length === 1) {
            res.colors = [];
        }
        if (res.fontColors.length === 1) {
            res.fontColors = [];
        }

        res.text = tempDigit > tempText ? false : true;

        return res;
    };

    WorksheetView.prototype.af_changeSelectionTablePart = function (activeRange) {
        var t = this;
        var tableParts = t.model.TableParts;
        var _changeSelectionToAllTablePart = function () {

            var tablePart;
            for (var i = 0; i < tableParts.length; i++) {
                tablePart = tableParts[i];
                if (tablePart.Ref.intersection(activeRange)) {
                    if (t.model.autoFilters._activeRangeContainsTablePart(activeRange, tablePart.Ref)) {
                        var newActiveRange = new Asc.Range(tablePart.Ref.c1, tablePart.Ref.r1, tablePart.Ref.c2, tablePart.Ref.r2);
                        t.setSelection(newActiveRange);
                    }

                    break;
                }
            }
        };

        var _changeSelectionFromCellToColumn = function () {
            if (tableParts && tableParts.length && activeRange.isOneCell()) {
                for (var i = 0; i < tableParts.length; i++) {
                    if (tableParts[i].HeaderRowCount !== 0 && tableParts[i].Ref.containsRange(activeRange) && tableParts[i].Ref.r1 === activeRange.r1) {
                        var newActiveRange = new Asc.Range(activeRange.c1, activeRange.r1, activeRange.c1, tableParts[i].Ref.r2);
                        if (!activeRange.isEqual(newActiveRange)) {
                            t.setSelection(newActiveRange);
                        }
                        break;
                    }
                }
            }
        };

        if (activeRange.isOneCell()) {
            _changeSelectionFromCellToColumn(activeRange);
        } else {
            _changeSelectionToAllTablePart(activeRange);
        }
    };

    WorksheetView.prototype.af_isCheckMoveRange = function (arnFrom, arnTo) {
        var ws = this.model;
        var tableParts = ws.TableParts;
        var tablePart;

        var checkMoveRangeIntoApplyAutoFilter = function (arnTo) {
            if (ws.AutoFilter && ws.AutoFilter.Ref && arnTo.intersection(ws.AutoFilter.Ref)) {
                //если затрагиваем скрытые строки а/ф - выдаём ошибку
                if (ws.autoFilters._searchHiddenRowsByFilter(ws.AutoFilter, arnTo)) {
                    return false;
                }
            }
            return true;
        };

        //1) если выделена часть форматированной таблицы и ещё часть(либо полностью)
        var counterIntersection = 0;
        var counterContains = 0;
        for (var i = 0; i < tableParts.length; i++) {
            tablePart = tableParts[i];
            if (tablePart.Ref.intersection(arnFrom)) {
                if (arnFrom.containsRange(tablePart.Ref)) {
                    counterContains++;
                } else {
                    counterIntersection++;
                }
            }
        }

        if ((counterIntersection > 0 && counterContains > 0) || (counterIntersection > 1)) {
            ws.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterDataRangeError,
              c_oAscError.Level.NoCritical);
            return false;
        }


        //2)если затрагиваем перемещаемым диапазоном часть а/ф со скрытыми строчками
        if (!checkMoveRangeIntoApplyAutoFilter(arnTo)) {
            ws.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterMoveToHiddenRangeError,
              c_oAscError.Level.NoCritical);
            return false;
        }

        return true;
    };

    WorksheetView.prototype.af_changeSelectionFormatTable = function (tableName, optionType) {
        var t = this;
        var ws = this.model;

        var tablePart = ws.autoFilters._getFilterByDisplayName(tableName);

        if (!tablePart || (tablePart && !tablePart.Ref)) {
            return false;
        }

        var refTablePart = tablePart.Ref;

        var lastSelection = this.model.selectionRange.getLast();
        var startCol = lastSelection.c1;
        var endCol = lastSelection.c2;
        var startRow = lastSelection.r1;
        var endRow = lastSelection.r2;

        switch (optionType) {
            case c_oAscChangeSelectionFormatTable.all:
            {
                startCol = refTablePart.c1;
                endCol = refTablePart.c2;
                startRow = refTablePart.r1;
                endRow = refTablePart.r2;

                break;
            }
            case c_oAscChangeSelectionFormatTable.data:
            {
                //TODO проверить есть ли строка заголовков
                startCol = refTablePart.c1;
                endCol = refTablePart.c2;
                startRow = refTablePart.r1 + 1;
                endRow = refTablePart.r2;

                break;
            }
            case c_oAscChangeSelectionFormatTable.row:
            {
                startCol = refTablePart.c1;
                endCol = refTablePart.c2;
                startRow = lastSelection.r1 < refTablePart.r1 ? refTablePart.r1 : lastSelection.r1;
                endRow = lastSelection.r2 > refTablePart.r2 ? refTablePart.r2 : lastSelection.r2;

                break;
            }
            case c_oAscChangeSelectionFormatTable.column:
            {
                startCol = lastSelection.c1 < refTablePart.c1 ? refTablePart.c1 : lastSelection.c1;
                endCol = lastSelection.c2 > refTablePart.c2 ? refTablePart.c2 : lastSelection.c2;
                startRow = refTablePart.r1;
                endRow = refTablePart.r2;

                break;
            }
        }

        t.setSelection(new Asc.Range(startCol, startRow, endCol, endRow));
    };

    WorksheetView.prototype.af_changeFormatTableInfo = function (tableName, optionType, val) {
        var tablePart = this.model.autoFilters._getFilterByDisplayName(tableName);
        var t = this;
        var ar = this.model.selectionRange.getLast();

        if (!tablePart || (tablePart && !tablePart.TableStyleInfo)) {
            return false;
        }

        var isChangeTableInfo = this.af_checkChangeTableInfo(tablePart, optionType);
        if (isChangeTableInfo !== false) {
            var callback = function (isSuccess) {
                if (false === isSuccess) {
                    t.handlers.trigger("selectionChanged");
                    return;
                }

                History.Create_NewPoint();
                History.StartTransaction();

                var newTableRef = t.model.autoFilters.changeFormatTableInfo(tableName, optionType, val);
                if (newTableRef.r1 > ar.r1 || newTableRef.r2 < ar.r2) {
                    var startRow = newTableRef.r1 > ar.r1 ? newTableRef.r1 : ar.r1;
                    var endRow = newTableRef.r2 < ar.r2 ? newTableRef.r2 : ar.r2;
                    var newActiveRange = new Asc.Range(ar.c1, startRow, ar.c2, endRow);

                    t.setSelection(newActiveRange);
                    History.SetSelectionRedo(newActiveRange);
                }

                t._onUpdateFormatTable(isChangeTableInfo, false, true);
                History.EndTransaction();
            };

            var lockRange = t.af_getRangeForChangeTableInfo(tablePart, optionType, val);
            if (lockRange) {
                t._isLockedCells(lockRange, null, callback);
            } else {
                callback();
            }
        }
    };

    WorksheetView.prototype.af_checkChangeTableInfo = function (tablePart, optionType) {
        var res = tablePart.Ref;
        var ws = this.model, rangeUpTable;

        if (optionType === c_oAscChangeTableStyleInfo.rowHeader && tablePart.HeaderRowCount !== null) {
            //add header row
            rangeUpTable =
              new Asc.Range(tablePart.Ref.c1, tablePart.Ref.r1 - 1, tablePart.Ref.c2, tablePart.Ref.r1 - 1);
        } else if (optionType === c_oAscChangeTableStyleInfo.rowTotal && tablePart.TotalsRowCount === null) {
            //add total row
            rangeUpTable =
              new Asc.Range(tablePart.Ref.c1, tablePart.Ref.r2 + 1, tablePart.Ref.c2, tablePart.Ref.r2 + 1);

			//add total table if down another format table
			if(ws.autoFilters._isPartTablePartsUnderRange(tablePart.Ref)){
				ws.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError,
				  c_oAscError.Level.NoCritical);
				return false;
			}
        }

        if (rangeUpTable && this.model.autoFilters._isEmptyRange(rangeUpTable, 0) &&
          this.model.autoFilters._isPartTablePartsUnderRange(tablePart.Ref) === true) {
            ws.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterMoveToHiddenRangeError,
              c_oAscError.Level.NoCritical);
            res = false;
        }

        return res;
    };

    WorksheetView.prototype.af_getRangeForChangeTableInfo = function (tablePart, optionType, val) {
        var res = null;

        switch (optionType) {
            case c_oAscChangeTableStyleInfo.columnBanded:
            case c_oAscChangeTableStyleInfo.columnFirst:
            case c_oAscChangeTableStyleInfo.columnLast:
            case c_oAscChangeTableStyleInfo.rowBanded:
            case c_oAscChangeTableStyleInfo.filterButton:
            {
                res = tablePart.Ref;
                break;
            }
            case c_oAscChangeTableStyleInfo.rowTotal:
            {
                if (val === false) {
                    res = tablePart.Ref;
                } else {
					var rangeUpTable = new Asc.Range(tablePart.Ref.c1, tablePart.Ref.r2 + 1, tablePart.Ref.c2, tablePart.Ref.r2 + 1);
					if(this.model.autoFilters._isEmptyRange(rangeUpTable, 0) && this.model.autoFilters.searchRangeInTableParts(rangeUpTable) === -1){
                    res = new Asc.Range(tablePart.Ref.c1, tablePart.Ref.r1, tablePart.Ref.c2, tablePart.Ref.r2 + 1);
                }
					else{
						res = new Asc.Range(tablePart.Ref.c1, tablePart.Ref.r2 + 1, tablePart.Ref.c2, gc_nMaxRow0);
					}
                }
                break;
            }
            case c_oAscChangeTableStyleInfo.rowHeader:
            {
                if (val === false) {
                    res = tablePart.Ref;
                } else {
					var rangeUpTable = new Asc.Range(tablePart.Ref.c1, tablePart.Ref.r1 - 1, tablePart.Ref.c2, tablePart.Ref.r1 - 1);
					if(this.model.autoFilters._isEmptyRange(rangeUpTable, 0) && this.model.autoFilters.searchRangeInTableParts(rangeUpTable) === -1){
                    res = new Asc.Range(tablePart.Ref.c1, tablePart.Ref.r1 - 1, tablePart.Ref.c2, tablePart.Ref.r2);
                }
					else{
						res = new Asc.Range(tablePart.Ref.c1, tablePart.Ref.r1 - 1, tablePart.Ref.c2, gc_nMaxRow0);
					}
                }
                break;
            }
        }

        return res;
    };

    WorksheetView.prototype.af_insertCellsInTable = function (tableName, optionType) {
        var t = this;
        var ws = this.model;

        var tablePart = ws.autoFilters._getFilterByDisplayName(tableName);

        if (!tablePart || (tablePart && !tablePart.Ref)) {
            return false;
        }

        var insertCellsAndShiftDownRight = function (arn, displayName, type) {
            var range = t.model.getRange3(arn.r1, arn.c1, arn.r2, arn.c2);
            var isCheckChangeAutoFilter = t.af_checkInsDelCells(arn, type, "insCell", true);
            if (isCheckChangeAutoFilter === false) {
                return;
            }

            var callback = function (isSuccess) {
                if (false === isSuccess) {
                    return;
                }

                History.Create_NewPoint();
                History.StartTransaction();
                var shiftCells = type === c_oAscInsertOptions.InsertCellsAndShiftRight ?
                  range.addCellsShiftRight(displayName) : range.addCellsShiftBottom(displayName);
                if (shiftCells) {
                    t.cellCommentator.updateCommentsDependencies(true, type, arn);
                    t.objectRender.updateDrawingObject(true, type, arn);
                    t._onUpdateFormatTable(range, false, true);
                }
                History.EndTransaction();
            };

            var changedRange = new asc_Range(tablePart.Ref.c1, tablePart.Ref.r1, tablePart.Ref.c2, tablePart.Ref.r2);
            t._isLockedCells(changedRange, null, callback);
        };

        var newActiveRange = this.model.selectionRange.getLast().clone();
        var displayName = null;
        var type = null;
        switch (optionType) {
            case c_oAscInsertOptions.InsertTableRowAbove:
            {
                newActiveRange.c1 = tablePart.Ref.c1;
                newActiveRange.c2 = tablePart.Ref.c2;
                type = c_oAscInsertOptions.InsertCellsAndShiftDown;

                break;
            }
            case c_oAscInsertOptions.InsertTableRowBelow:
            {
                newActiveRange.c1 = tablePart.Ref.c1;
                newActiveRange.c2 = tablePart.Ref.c2;
                newActiveRange.r1 = tablePart.Ref.r2 + 1;
                newActiveRange.r2 = tablePart.Ref.r2 + 1;
                displayName = tableName;
                type = c_oAscInsertOptions.InsertCellsAndShiftDown;

                break;
            }
            case c_oAscInsertOptions.InsertTableColLeft:
            {
                newActiveRange.r1 = tablePart.Ref.r1;
                newActiveRange.r2 = tablePart.Ref.r2;
                type = c_oAscInsertOptions.InsertCellsAndShiftRight;

                break;
            }
            case c_oAscInsertOptions.InsertTableColRight:
            {
                newActiveRange.c1 = tablePart.Ref.c2 + 1;
                newActiveRange.c2 = tablePart.Ref.c2 + 1;
                newActiveRange.r1 = tablePart.Ref.r1;
                newActiveRange.r2 = tablePart.Ref.r2;
                displayName = tableName;
                type = c_oAscInsertOptions.InsertCellsAndShiftRight;

                break;
            }
        }

        insertCellsAndShiftDownRight(newActiveRange, displayName, type)
    };

    WorksheetView.prototype.af_deleteCellsInTable = function (tableName, optionType) {
        var t = this;
        var ws = this.model;

        var tablePart = ws.autoFilters._getFilterByDisplayName(tableName);

        if (!tablePart || (tablePart && !tablePart.Ref)) {
            return false;
        }

        var deleteCellsAndShiftLeftTop = function (arn, type) {
            var isCheckChangeAutoFilter = t.af_checkInsDelCells(arn, type, "delCell", true);
            if (isCheckChangeAutoFilter === false) {
                return;
            }

            var callback = function (isSuccess) {
                if (false === isSuccess) {
                    return;
                }

                History.Create_NewPoint();
                History.StartTransaction();

                if (isCheckChangeAutoFilter === true) {
                    t.model.autoFilters.isEmptyAutoFilters(arn, type);
                }

                var preDeleteAction = function () {
                    t.cellCommentator.updateCommentsDependencies(false, type, arn);
                };

                var res;
				var range;
                if (type === c_oAscInsertOptions.InsertCellsAndShiftRight) {
					range = t.model.getRange3(arn.r1, arn.c1, arn.r2, arn.c2);
                    res = range.deleteCellsShiftLeft(preDeleteAction);
                } else {
					arn = t.model.autoFilters.checkDeleteAllRowsFormatTable(arn, true);
					range = t.model.getRange3(arn.r1, arn.c1, arn.r2, arn.c2);
                    res = range.deleteCellsShiftUp(preDeleteAction);
                }

                if (res) {
                    t.objectRender.updateDrawingObject(true, type, arn);
                    t._onUpdateFormatTable(range, false, true);
                }

                History.EndTransaction();
            };

            var changedRange = new asc_Range(tablePart.Ref.c1, tablePart.Ref.r1, tablePart.Ref.c2, tablePart.Ref.r2);
            t._isLockedCells(changedRange, null, callback);
        };

        var deleteTableCallback = function (ref) {

            var callback = function (isSuccess) {
                if (false === isSuccess) {
                    return;
                }

                History.Create_NewPoint();
                History.StartTransaction();

                t.model.autoFilters.isEmptyAutoFilters(ref);
                var cleanRange = t.model.getRange3(ref.r1, ref.c1, ref.r2, ref.c2);
                cleanRange.cleanAll();
                t.cellCommentator.deleteCommentsRange(cleanRange.bbox);

                t._onUpdateFormatTable(ref, false, true);

                History.EndTransaction();
            };

            t._isLockedCells(ref, null, callback);
        };

        var newActiveRange = this.model.selectionRange.getLast().clone();
        var val = null;
        switch (optionType) {
            case c_oAscDeleteOptions.DeleteColumns:
            {
                newActiveRange.r1 = tablePart.Ref.r1;
                newActiveRange.r2 = tablePart.Ref.r2;

                val = c_oAscDeleteOptions.DeleteCellsAndShiftLeft;
                break;
            }
            case c_oAscDeleteOptions.DeleteRows:
            {
                newActiveRange.c1 = tablePart.Ref.c1;
                newActiveRange.c2 = tablePart.Ref.c2;

                val = c_oAscDeleteOptions.DeleteCellsAndShiftTop;
                break;
            }
            case c_oAscDeleteOptions.DeleteTable:
            {
                deleteTableCallback(tablePart.Ref.clone());
                break;
            }
        }

        if (val !== null) {
            deleteCellsAndShiftLeftTop(newActiveRange, val);
        }
    };

    WorksheetView.prototype.af_changeDisplayNameTable = function (tableName, newName) {
        this.model.autoFilters.changeDisplayNameTable(tableName, newName);
    };

    WorksheetView.prototype.af_checkInsDelCells = function (activeRange, val, prop, isFromFormatTable) {
        var ws = this.model;
        var res = true;

        var intersectionTableParts = ws.autoFilters.getTableIntersectionRange(activeRange);
        var isPartTablePartsUnderRange = ws.autoFilters._isPartTablePartsUnderRange(activeRange);
        var isPartTablePartsRightRange = ws.autoFilters.isPartTablePartsRightRange(activeRange);
        var isOneTableIntersection = intersectionTableParts && intersectionTableParts.length === 1 ?
          intersectionTableParts[0] : null;

        var checkInsCells = function () {
            switch (val) {
                case c_oAscInsertOptions.InsertCellsAndShiftDown:
                {
                    if (isFromFormatTable) {
                        //если внизу находится часть форматированной таблицы или это часть форматированной таблицы
                        if (isPartTablePartsUnderRange) {
                            res = false;
                        } else if (isOneTableIntersection !== null &&
                          !(isOneTableIntersection.Ref.c1 === activeRange.c1 &&
                          isOneTableIntersection.Ref.c2 === activeRange.c2)) {
                            res = false;
                        }
                    } else {
                        if (isPartTablePartsUnderRange) {
                            res = false;
                        } else if (intersectionTableParts && null !== isOneTableIntersection) {
                            res = false;
                        } else if (isOneTableIntersection && !isOneTableIntersection.Ref.isEqual(activeRange)) {
                            res = false;
                        }
                    }

                    break;
                }
                case c_oAscInsertOptions.InsertCellsAndShiftRight:
                {
                    //если справа находится часть форматированной таблицы или это часть форматированной таблицы
                    if (isFromFormatTable) {
                        if (isPartTablePartsRightRange) {
                            res = false;
                        }
                    } else {
                        if (isPartTablePartsRightRange) {
                            res = false;
                        } else if (intersectionTableParts && null !== isOneTableIntersection) {
                            res = false;
                        } else if (isOneTableIntersection && !isOneTableIntersection.Ref.isEqual(activeRange)) {
                            res = false;
                        }
                    }

                    break;
                }
                case c_oAscInsertOptions.InsertColumns:
                {

                    break;
                }
                case c_oAscInsertOptions.InsertRows:
                {

                    break;
                }
            }
        };

        var checkDelCells = function () {
            switch (val) {
                case c_oAscDeleteOptions.DeleteCellsAndShiftTop:
                {
                    if (isFromFormatTable) {
                        if (isPartTablePartsUnderRange) {
                            res = false;
                        }
                    } else {
                        if (isPartTablePartsUnderRange) {
                            res = false;
                        } else if (!isOneTableIntersection && null !== isOneTableIntersection) {
                            res = false;
                        } else if (isOneTableIntersection && !isOneTableIntersection.Ref.isEqual(activeRange)) {
                            res = false;
                        }
                    }

                    break;
                }
                case c_oAscDeleteOptions.DeleteCellsAndShiftLeft:
                {
                    if (isFromFormatTable) {
                        if (isPartTablePartsRightRange) {
                            res = false;
                        }
                    } else {
                        if (isPartTablePartsRightRange) {
                            res = false;
                        } else if (!isOneTableIntersection && null !== isOneTableIntersection) {
                            res = false;
                        } else if (isOneTableIntersection && !isOneTableIntersection.Ref.isEqual(activeRange)) {
                            res = false;
                        }
                    }

                    break;
                }
                case c_oAscDeleteOptions.DeleteColumns:
                {

                    break;
                }
                case c_oAscDeleteOptions.DeleteRows:
                {

                    break;
                }
            }
        };

        prop === "insCell" ? checkInsCells() : checkDelCells();

        if (res === false) {
            ws.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError,
              c_oAscError.Level.NoCritical);
        }

        return res;
    };

    WorksheetView.prototype.af_setDisableProps = function (tablePart, formatTableInfo) {
        var selectionRange = this.model.selectionRange;
        var lastRange = selectionRange.getLast();
        var activeCell = selectionRange.activeCell;

        if (!tablePart) {
            return false;
        }

        var refTable = tablePart.Ref;
        var refTableContainsActiveRange = selectionRange.isSingleRange() && refTable.containsRange(lastRange);

        //если курсор стоит в нижней строке, то разрешаем добавление нижней строки
        formatTableInfo.isInsertRowBelow = (refTableContainsActiveRange && ((tablePart.TotalsRowCount === null && activeCell.row === refTable.r2) ||
        (tablePart.TotalsRowCount !== null && activeCell.row === refTable.r2 - 1)));

        //если курсор стоит в правом столбце, то разрешаем добавление одного столбца правее
        formatTableInfo.isInsertColumnRight = (refTableContainsActiveRange && activeCell.col === refTable.c2);

        //если внутри находится вся активная область или если выходит активная область за границу справа
        formatTableInfo.isInsertColumnLeft = refTableContainsActiveRange;

        //если внутри находится вся активная область(кроме строки заголовков) или если выходит активная область за границу снизу
        formatTableInfo.isInsertRowAbove = (refTableContainsActiveRange && ((lastRange.r1 > refTable.r1 && tablePart.HeaderRowCount === null) ||
        (lastRange.r1 >= refTable.r1 && tablePart.HeaderRowCount !== null)));

        formatTableInfo.isDeleteRow = refTableContainsActiveRange && !(lastRange.r1 <= refTable.r1 && lastRange.r2 >= refTable.r1 && null === tablePart.HeaderRowCount);

        formatTableInfo.isDeleteColumn = true;
        formatTableInfo.isDeleteTable = true;
    };

	WorksheetView.prototype.af_convertTableToRange = function (tableName) {
        var t = this;

        var callback = function (isSuccess) {
            if (false === isSuccess) {
                return;
            }

            History.Create_NewPoint();
            History.StartTransaction();

			t.model.workbook.dependencyFormulas.lockRecal();

            t.model.autoFilters.convertTableToRange(tableName);
            t._onUpdateFormatTable(tableRange, false, true);

			t.model.workbook.dependencyFormulas.unlockRecal();

            History.EndTransaction();
        };

        var table = t.model.autoFilters._getFilterByDisplayName(tableName);
        var tableRange = null !== table ? table.Ref : null;

        var lockRange = tableRange;
        var callBackLockedDefNames = function (isSuccess) {
            if (false === isSuccess) {
                return;
            }

            t._isLockedCells(lockRange, null, callback);
        };

        //лочим данный именованный диапазон
        var defNameId = t.model.workbook.dependencyFormulas.getDefNameByName(tableName, t.model.getId());
        defNameId = defNameId ? defNameId.getNodeId() : null;

        t._isLockedDefNames(callBackLockedDefNames, defNameId);
    };

    WorksheetView.prototype.af_changeTableRange = function (tableName, range) {
        var t = this;
        range = AscCommonExcel.g_oRangeCache.getAscRange(range);

        var callback = function (isSuccess) {
            if (false === isSuccess) {
                return;
            }

            History.Create_NewPoint();
            History.StartTransaction();

            t.model.autoFilters.changeTableRange(tableName, range);

            t._onUpdateFormatTable(range, false, true);
            //TODO добавить перерисовку таблицы и перерисовку шаблонов
            History.EndTransaction();
        };

        //TODO возможно не стоит лочить весь диапазон. проверить: когда один ползователь меняет диапазон, другой снимает а/ф с ф/т. в этом случае в deleteAutoFilter передавать не range а имя ф/т
        var table = t.model.autoFilters._getFilterByDisplayName(tableName);
        var tableRange = null !== table ? table.Ref : null;

        var lockRange = range;
        if (null !== tableRange) {
            var r1 = tableRange.r1 < range.r1 ? tableRange.r1 : range.r1;
            var r2 = tableRange.r2 > range.r2 ? tableRange.r2 : range.r2;
            var c1 = tableRange.c1 < range.c1 ? tableRange.c1 : range.c1;
            var c2 = tableRange.c2 > range.c2 ? tableRange.c2 : range.c2;

            lockRange = new Asc.Range(c1, r1, c2, r2);
        }

        var callBackLockedDefNames = function (isSuccess) {
            if (false === isSuccess) {
                return;
            }

            t._isLockedCells(lockRange, null, callback);
        };

        //лочим данный именованный диапазон при смене размера ф/т
        var defNameId = t.model.workbook.dependencyFormulas.getDefNameByName(tableName, t.model.getId());
        defNameId = defNameId ? defNameId.getNodeId() : null;

        t._isLockedDefNames(callBackLockedDefNames, defNameId);
    };

    WorksheetView.prototype.af_checkChangeRange = function (range) {
        var res = null;
        var intersectionTables = this.model.autoFilters.getTableIntersectionRange(range);
        if (0 < intersectionTables.length) {
            var tablePart = intersectionTables[0];
            if (range.isOneCell()) {
                res = c_oAscError.ID.FTChangeTableRangeError
            } else if (range.r1 !== tablePart.Ref.r1)//первая строка таблицы не равна первой строке выделенного диапазона
            {
                res = c_oAscError.ID.FTChangeTableRangeError;
            } else if (intersectionTables.length !== 1)//выделено несколько таблиц
            {
                res = c_oAscError.ID.FTRangeIncludedOtherTables;
            } else if (this.model.AutoFilter && this.model.AutoFilter.Ref &&
              this.model.AutoFilter.Ref.isIntersect(range)) {
                res = c_oAscError.ID.FTChangeTableRangeError;
            }
        } else {
            res = c_oAscError.ID.FTChangeTableRangeError;
        }

        return res;
    };

    // Convert coordinates methods
	WorksheetView.prototype.ConvertXYToLogic = function (x, y) {
		x *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIX());
		y *= asc_getcvt(0/*px*/, 1/*pt*/, this._getPPIY());

		var c = this.visibleRange.c1, cFrozen, widthDiff;
		var r = this.visibleRange.r1, rFrozen, heightDiff;
		if (this.topLeftFrozenCell) {
			cFrozen = this.topLeftFrozenCell.getCol0();
			widthDiff = this.cols[cFrozen].left - this.cols[0].left;
			if (x < this.cellsLeft + widthDiff && 0 !== widthDiff) {
				c = 0;
			}

			rFrozen = this.topLeftFrozenCell.getRow0();
			heightDiff = this.rows[rFrozen].top - this.rows[0].top;
			if (y < this.cellsTop + heightDiff && 0 !== heightDiff) {
				r = 0;
			}
		}

		x += this.cols[c].left - this.cellsLeft - this.cellsLeft;
		y += this.rows[r].top - this.cellsTop - this.cellsTop;

		x *= asc_getcvt(1/*pt*/, 3/*mm*/, this._getPPIX());
		y *= asc_getcvt(1/*pt*/, 3/*mm*/, this._getPPIY());
		return {X: x, Y: y};
	};
	WorksheetView.prototype.ConvertLogicToXY = function (xL, yL) {
		xL *= asc_getcvt(3/*mm*/, 1/*pt*/, this._getPPIX());
		yL *= asc_getcvt(3/*mm*/, 1/*pt*/, this._getPPIY());

		var c = this.visibleRange.c1, cFrozen, widthDiff = 0;
		var r = this.visibleRange.r1, rFrozen, heightDiff = 0;
		if (this.topLeftFrozenCell) {
			cFrozen = this.topLeftFrozenCell.getCol0();
			widthDiff = this.cols[cFrozen].left - this.cols[0].left;
			if (xL < widthDiff && 0 !== widthDiff) {
				c = 0;
				widthDiff = 0;
			}

			rFrozen = this.topLeftFrozenCell.getRow0();
			heightDiff = this.rows[rFrozen].top - this.rows[0].top;
			if (yL < heightDiff && 0 !== heightDiff) {
				r = 0;
				heightDiff = 0;
			}
		}

		xL -= (this.cols[c].left - widthDiff - this.cellsLeft - this.cellsLeft);
		yL -= (this.rows[r].top - heightDiff - this.cellsTop - this.cellsTop);

		xL *= asc_getcvt(1/*pt*/, 0/*px*/, this._getPPIX());
		yL *= asc_getcvt(1/*pt*/, 0/*px*/, this._getPPIY());
		return {X: xL, Y: yL};
	};

    //------------------------------------------------------------export---------------------------------------------------
    window['AscCommonExcel'] = window['AscCommonExcel'] || {};
    window["AscCommonExcel"].WorksheetView = WorksheetView;
})(window);
