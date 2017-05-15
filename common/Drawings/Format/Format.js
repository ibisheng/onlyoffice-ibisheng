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

(
/**
* @param {Window} window
* @param {undefined} undefined
*/
function (window, undefined) {

	var recalcSlideInterval = 30;

// Import
var CreateAscColor = AscCommon.CreateAscColor;
var g_oIdCounter = AscCommon.g_oIdCounter;
var g_oTableId = AscCommon.g_oTableId;
var isRealObject = AscCommon.isRealObject;
var History = AscCommon.History;

var c_oAscColor = Asc.c_oAscColor;
var c_oAscFill = Asc.c_oAscFill;
var asc_CShapeFill = Asc.asc_CShapeFill;
var c_oAscFillGradType = Asc.c_oAscFillGradType;
var c_oAscFillBlipType = Asc.c_oAscFillBlipType;
var c_oAscStrokeType = Asc.c_oAscStrokeType;
var asc_CShapeProperty = Asc.asc_CShapeProperty;




    var CChangesDrawingsBool = AscDFH.CChangesDrawingsBool;
    var CChangesDrawingsLong = AscDFH.CChangesDrawingsLong;
    var CChangesDrawingsDouble = AscDFH.CChangesDrawingsDouble;
    var CChangesDrawingsString = AscDFH.CChangesDrawingsString;
    var CChangesDrawingsObjectNoId = AscDFH.CChangesDrawingsObjectNoId;
    var CChangesDrawingsObject = AscDFH.CChangesDrawingsObject;
    var CChangesDrawingsContentNoId = AscDFH.CChangesDrawingsContentNoId;
    var CChangesDrawingsContentLong = AscDFH.CChangesDrawingsContentLong;
    var CChangesDrawingsContentLongMap = AscDFH.CChangesDrawingsContentLongMap;


    var drawingsChangesMap = window['AscDFH'].drawingsChangesMap;
    var drawingConstructorsMap = window['AscDFH'].drawingsConstructorsMap;
    var drawingContentChanges = window['AscDFH'].drawingContentChanges;



        drawingsChangesMap[AscDFH.historyitem_DefaultShapeDefinition_SetSpPr    ] = function (oClass, value){oClass.spPr     = value;};
        drawingsChangesMap[AscDFH.historyitem_DefaultShapeDefinition_SetBodyPr  ] = function (oClass, value){oClass.bodyPr   = value;};
        drawingsChangesMap[AscDFH.historyitem_DefaultShapeDefinition_SetLstStyle] = function (oClass, value){oClass.lstStyle = value;};
        drawingsChangesMap[AscDFH.historyitem_DefaultShapeDefinition_SetStyle   ] = function (oClass, value){oClass.style    = value;};
        drawingsChangesMap[AscDFH.historyitem_CNvPr_SetId                       ] = function (oClass, value){oClass.id        = value;};
        drawingsChangesMap[AscDFH.historyitem_CNvPr_SetName                     ] = function (oClass, value){oClass.name      = value;};
        drawingsChangesMap[AscDFH.historyitem_CNvPr_SetIsHidden                 ] = function (oClass, value){oClass.isHidden  = value;};
        drawingsChangesMap[AscDFH.historyitem_CNvPr_SetDescr                    ] = function (oClass, value){oClass.descr     = value;};
        drawingsChangesMap[AscDFH.historyitem_CNvPr_SetTitle                    ] = function (oClass, value){oClass.title     = value;};
        drawingsChangesMap[AscDFH.historyitem_NvPr_SetIsPhoto                   ] = function (oClass, value){oClass.isPhoto   = value;};
        drawingsChangesMap[AscDFH.historyitem_NvPr_SetUserDrawn                 ] = function (oClass, value){oClass.userDrawn = value;};
        drawingsChangesMap[AscDFH.historyitem_NvPr_SetPh                        ] = function (oClass, value){oClass.ph        = value;};
        drawingsChangesMap[AscDFH.historyitem_Ph_SetHasCustomPrompt             ] = function (oClass, value){oClass.hasCustomPrompt = value;};
        drawingsChangesMap[AscDFH.historyitem_Ph_SetIdx                         ] = function (oClass, value){oClass.idx             = value;};
        drawingsChangesMap[AscDFH.historyitem_Ph_SetOrient                      ] = function (oClass, value){oClass.orient          = value;};
        drawingsChangesMap[AscDFH.historyitem_Ph_SetSz                          ] = function (oClass, value){oClass.sz              = value;};
        drawingsChangesMap[AscDFH.historyitem_Ph_SetType                        ] = function (oClass, value){oClass.type            = value;};
        drawingsChangesMap[AscDFH.historyitem_UniNvPr_SetCNvPr                  ] = function (oClass, value){oClass.cNvPr = value;};
        drawingsChangesMap[AscDFH.historyitem_UniNvPr_SetUniPr                  ] = function (oClass, value){oClass.uniPr = value;};
        drawingsChangesMap[AscDFH.historyitem_UniNvPr_SetNvPr                   ] = function (oClass, value){oClass.nvPr  = value;};
        drawingsChangesMap[AscDFH.historyitem_ShapeStyle_SetLnRef               ] = function (oClass, value){oClass.lnRef     = value;};
        drawingsChangesMap[AscDFH.historyitem_ShapeStyle_SetFillRef             ] = function (oClass, value){oClass.fillRef   = value;};
        drawingsChangesMap[AscDFH.historyitem_ShapeStyle_SetFontRef             ] = function (oClass, value){oClass.fontRef   = value;};
        drawingsChangesMap[AscDFH.historyitem_ShapeStyle_SetEffectRef           ] = function (oClass, value){oClass.effectRef = value;};
        drawingsChangesMap[AscDFH.historyitem_Xfrm_SetParent                    ] = function (oClass, value){oClass.parent   = value;};
        drawingsChangesMap[AscDFH.historyitem_Xfrm_SetOffX                      ] = function (oClass, value){oClass.offX     = value; oClass.handleUpdatePosition();};
        drawingsChangesMap[AscDFH.historyitem_Xfrm_SetOffY                      ] = function (oClass, value){oClass.offY     = value; oClass.handleUpdatePosition();};
        drawingsChangesMap[AscDFH.historyitem_Xfrm_SetExtX                      ] = function (oClass, value){oClass.extX     = value; oClass.handleUpdateExtents();};
        drawingsChangesMap[AscDFH.historyitem_Xfrm_SetExtY                      ] = function (oClass, value){oClass.extY     = value; oClass.handleUpdateExtents();};
        drawingsChangesMap[AscDFH.historyitem_Xfrm_SetChOffX                    ] = function (oClass, value){oClass.chOffX   = value; oClass.handleUpdateChildOffset();};
        drawingsChangesMap[AscDFH.historyitem_Xfrm_SetChOffY                    ] = function (oClass, value){oClass.chOffY   = value; oClass.handleUpdateChildOffset();};
        drawingsChangesMap[AscDFH.historyitem_Xfrm_SetChExtX                    ] = function (oClass, value){oClass.chExtX   = value; oClass.handleUpdateChildExtents();};
        drawingsChangesMap[AscDFH.historyitem_Xfrm_SetChExtY                    ] = function (oClass, value){oClass.chExtY   = value; oClass.handleUpdateChildExtents();};
        drawingsChangesMap[AscDFH.historyitem_Xfrm_SetFlipH                     ] = function (oClass, value){oClass.flipH    = value; oClass.handleUpdateFlip();};
        drawingsChangesMap[AscDFH.historyitem_Xfrm_SetFlipV                     ] = function (oClass, value){oClass.flipV    = value; oClass.handleUpdateFlip();};
        drawingsChangesMap[AscDFH.historyitem_Xfrm_SetRot                       ] = function (oClass, value){oClass.rot      = value; oClass.handleUpdateRot();};
        drawingsChangesMap[AscDFH.historyitem_SpPr_SetParent                    ] = function (oClass, value){oClass.parent   = value;};
        drawingsChangesMap[AscDFH.historyitem_SpPr_SetBwMode                    ] = function (oClass, value){oClass.bwMode   = value;};
        drawingsChangesMap[AscDFH.historyitem_SpPr_SetXfrm                      ] = function (oClass, value){oClass.xfrm     = value;};
        drawingsChangesMap[AscDFH.historyitem_SpPr_SetGeometry                  ] = function (oClass, value){oClass.geometry = value; oClass.handleUpdateGeometry();};
        drawingsChangesMap[AscDFH.historyitem_SpPr_SetFill                      ] = function (oClass, value, FromLoad){
            oClass.Fill     = value;
            oClass.handleUpdateFill();
            if(FromLoad){
                if(typeof AscCommon.CollaborativeEditing !== "undefined")
                {
                    if(oClass.Fill && oClass.Fill.fill && oClass.Fill.fill.type === c_oAscFill.FILL_TYPE_BLIP && typeof oClass.Fill.fill.RasterImageId === "string" && oClass.Fill.fill.RasterImageId.length > 0)
                    {
                        AscCommon.CollaborativeEditing.Add_NewImage(AscCommon.getFullImageSrc2(oClass.Fill.fill.RasterImageId));
                    }
                }
            }
        };
        drawingsChangesMap[AscDFH.historyitem_SpPr_SetLn                        ] = function (oClass, value){oClass.ln       = value; oClass.handleUpdateLn();};
        drawingsChangesMap[AscDFH.historyitem_ExtraClrScheme_SetClrScheme       ] = function (oClass, value){oClass.clrScheme = value;};
        drawingsChangesMap[AscDFH.historyitem_ExtraClrScheme_SetClrMap          ] = function (oClass, value){oClass.clrMap    = value;};
        drawingsChangesMap[AscDFH.historyitem_ThemeSetColorScheme               ] = function (oClass, value){
            oClass.themeElements.clrScheme = value;
            var oWordGraphicObjects = oClass.GetWordDrawingObjects();
            if(oWordGraphicObjects){
                oWordGraphicObjects.drawingDocument.CheckGuiControlColors();
                oWordGraphicObjects.document.Api.chartPreviewManager.clearPreviews();
                oWordGraphicObjects.document.Api.textArtPreviewManager.clear();
            }
        };
        drawingsChangesMap[AscDFH.historyitem_ThemeSetFontScheme                ] = function (oClass, value){oClass.themeElements.fontScheme  = value;};
        drawingsChangesMap[AscDFH.historyitem_ThemeSetFmtScheme                 ] = function (oClass, value){oClass.themeElements.fmtScheme   = value;};
        drawingsChangesMap[AscDFH.historyitem_HF_SetDt                          ] = function (oClass, value){oClass.dt     = value;};
        drawingsChangesMap[AscDFH.historyitem_HF_SetFtr                         ] = function (oClass, value){oClass.ftr    = value;};
        drawingsChangesMap[AscDFH.historyitem_HF_SetHdr                         ] = function (oClass, value){oClass.hdr    = value;};
        drawingsChangesMap[AscDFH.historyitem_HF_SetSldNum                      ] = function (oClass, value){oClass.sldNum = value;};

    drawingContentChanges[AscDFH.historyitem_ClrMap_SetClr] = function(oClass){return oClass.color_map};


    drawingConstructorsMap[AscDFH.historyitem_ClrMap_SetClr] =  CUniColor;
    drawingConstructorsMap[AscDFH.historyitem_DefaultShapeDefinition_SetBodyPr  ] = CBodyPr;
    drawingConstructorsMap[AscDFH.historyitem_DefaultShapeDefinition_SetLstStyle] = TextListStyle;
    drawingConstructorsMap[AscDFH.historyitem_ShapeStyle_SetLnRef               ] =
    drawingConstructorsMap[AscDFH.historyitem_ShapeStyle_SetFillRef             ] =
    drawingConstructorsMap[AscDFH.historyitem_ShapeStyle_SetEffectRef           ] = StyleRef;
    drawingConstructorsMap[AscDFH.historyitem_ShapeStyle_SetFontRef             ] = FontRef;
    drawingConstructorsMap[AscDFH.historyitem_SpPr_SetFill                      ] = CUniFill;
    drawingConstructorsMap[AscDFH.historyitem_SpPr_SetLn                        ] = CLn;
    drawingConstructorsMap[AscDFH.historyitem_ThemeSetColorScheme               ] = ClrScheme;
    drawingConstructorsMap[AscDFH.historyitem_ThemeSetFontScheme                ] = FontScheme;
    drawingConstructorsMap[AscDFH.historyitem_ThemeSetFmtScheme                 ] = FmtScheme;
    drawingConstructorsMap[AscDFH.historyitem_UniNvPr_SetUniSpPr                 ] = CNvUniSpPr;


    AscDFH.changesFactory[AscDFH.historyitem_DefaultShapeDefinition_SetSpPr] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_DefaultShapeDefinition_SetBodyPr] = CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_DefaultShapeDefinition_SetLstStyle] = CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_DefaultShapeDefinition_SetStyle] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_CNvPr_SetId] = CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_CNvPr_SetName] = CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_CNvPr_SetIsHidden] = CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_CNvPr_SetDescr] = CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_CNvPr_SetTitle] = CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_NvPr_SetIsPhoto] = CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_NvPr_SetUserDrawn] = CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_NvPr_SetPh] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Ph_SetHasCustomPrompt] = CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_Ph_SetIdx] = CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Ph_SetOrient] = CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_Ph_SetSz] = CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_Ph_SetType] = CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_UniNvPr_SetCNvPr] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_UniNvPr_SetUniPr] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_UniNvPr_SetNvPr] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_UniNvPr_SetUniSpPr] = CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_ShapeStyle_SetLnRef] = CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_ShapeStyle_SetFillRef] = CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_ShapeStyle_SetFontRef] = CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_ShapeStyle_SetEffectRef] = CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_Xfrm_SetParent] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_Xfrm_SetOffX] = CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_Xfrm_SetOffY] = CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_Xfrm_SetExtX] = CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_Xfrm_SetExtY] = CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_Xfrm_SetChOffX] = CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_Xfrm_SetChOffY] = CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_Xfrm_SetChExtX] = CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_Xfrm_SetChExtY] = CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_Xfrm_SetFlipH] = CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_Xfrm_SetFlipV] = CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_Xfrm_SetRot] = CChangesDrawingsDouble;
    AscDFH.changesFactory[AscDFH.historyitem_SpPr_SetParent] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_SpPr_SetBwMode] = CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_SpPr_SetXfrm] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_SpPr_SetGeometry] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_SpPr_SetFill] = CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_SpPr_SetLn] = CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_ClrMap_SetClr] = CChangesDrawingsContentLongMap;
    AscDFH.changesFactory[AscDFH.historyitem_ExtraClrScheme_SetClrScheme] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ExtraClrScheme_SetClrMap] = CChangesDrawingsObject;
    AscDFH.changesFactory[AscDFH.historyitem_ThemeSetColorScheme] = CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_ThemeSetFontScheme] = CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_ThemeSetFmtScheme] = CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_HF_SetDt] = CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_HF_SetFtr] = CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_HF_SetHdr] = CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_HF_SetSldNum] = CChangesDrawingsBool;

// COLOR -----------------------
/*
 var map_color_scheme = {};
 map_color_scheme["accent1"] = 0;
 map_color_scheme["accent2"] = 1;
 map_color_scheme["accent3"] = 2;
 map_color_scheme["accent4"] = 3;
 map_color_scheme["accent5"] = 4;
 map_color_scheme["accent6"] = 5;
 map_color_scheme["bg1"]     = 6;
 map_color_scheme["bg2"]     = 7;
 map_color_scheme["dk1"]     = 8;
 map_color_scheme["dk2"]     = 9;
 map_color_scheme["folHlink"] = 10;
 map_color_scheme["hlink"]   = 11;
 map_color_scheme["lt1"]     = 12;
 map_color_scheme["lt2"]     = 13;
 map_color_scheme["phClr"]   = 14;
 map_color_scheme["tx1"]     = 15;
 map_color_scheme["tx2"]     = 16;
 */

//Типы изменений в классе CTheme

function CreateFontRef(idx, color)
{
    var ret = new FontRef();
    ret.idx = idx;
    ret.Color = color;
    return ret;
}


function CreateStyleRef(idx, color)
{
    var ret = new StyleRef();
    ret.idx = idx;
    ret.Color = color;
    return ret;
}

function CreatePresetColor(id)
{
    var ret = new CPrstColor();
    ret.idx = id;
    return ret;
}

function sRGB_to_scRGB(value)
{
    if(value < 0)
        return 0;
    if(value <= 0.04045)
        return value / 12.92;
    if(value <= 1)
        return Math.pow(((value + 0.055) / 1.055), 2.4);
    return  1;
}

function scRGB_to_sRGB(value)
{
    if( value < 0)
        return 0;
    if(value <= 0.0031308)
        return value * 12.92;
    if(value < 1)
        return 1.055 * (Math.pow(value , (1 / 2.4))) - 0.055;
    return 1;
}

function checkRasterImageId(rasterImageId) {
  var imageLocal = AscCommon.g_oDocumentUrls.getImageLocal(rasterImageId);
  return imageLocal ? imageLocal : rasterImageId;
}


var g_oThemeFontsName = {};
g_oThemeFontsName["+mj-cs"] = true;
g_oThemeFontsName["+mj-ea"] = true;
g_oThemeFontsName["+mj-lt"] = true;
g_oThemeFontsName["+mn-cs"] = true;
g_oThemeFontsName["+mn-ea"] = true;
g_oThemeFontsName["+mn-lt"] = true;

function isRealNumber(n)
{
    return typeof n === "number" && !isNaN(n);
}

function isRealBool(b)
{
    return b === true || b === false;
}


function writeLong(w, val)
{
    w.WriteBool(isRealNumber(val));
    if(isRealNumber(val))
    {
        w.WriteLong(val);
    }
}

function readLong(r)
{
    var ret;
    if(r.GetBool())
    {
        ret = r.GetLong();
    }
    else
    {
        ret = null;
    }
    return ret;
}

function writeDouble(w, val)
{
    w.WriteBool(isRealNumber(val));
    if(isRealNumber(val))
    {
        w.WriteDouble(val);
    }
}

function readDouble(r)
{
    var ret;
    if(r.GetBool())
    {
        ret = r.GetDouble();
    }
    else
    {
        ret = null;
    }
    return ret;
}

function writeBool(w, val)
{
    w.WriteBool(isRealBool(val));
    if(isRealBool(val))
    {
        w.WriteBool(val);
    }
}

function readBool(r)
{
    var ret;
    if(r.GetBool())
    {
        ret = r.GetBool();
    }
    else
    {
        ret = null;
    }
    return ret;
}

function writeString(w, val)
{
    w.WriteBool(typeof  val === "string");
    if(typeof  val === "string")
    {
        w.WriteString2(val);
    }
}

function readString(r)
{
    var ret;
    if(r.GetBool())
    {
        ret = r.GetString2();
    }
    else
    {
        ret = null;
    }
    return ret;
}

function writeObject(w, val)
{
    w.WriteBool(isRealObject(val));
    if(isRealObject(val))
    {
        w.WriteString2(val.Get_Id());
    }
}

function readObject(r)
{
    var ret;
    if(r.GetBool())
    {
        ret = g_oTableId.Get_ById(r.GetString2());
    }
    else
    {
        ret = null;
    }
    return ret;
}


function checkThemeFonts(oFontMap, font_scheme)
{
    if(oFontMap["+mj-lt"])
    {
        if(font_scheme.majorFont && typeof font_scheme.majorFont.latin === "string" && font_scheme.majorFont.latin.length > 0)
            oFontMap[font_scheme.majorFont.latin] = 1;
        delete oFontMap["+mj-lt"];
    }
    if(oFontMap["+mj-ea"])
    {
        if(font_scheme.majorFont && typeof  font_scheme.majorFont.ea === "string" && font_scheme.majorFont.ea.length > 0)
            oFontMap[font_scheme.majorFont.ea] = 1;
        delete oFontMap["+mj-ea"];
    }
    if(oFontMap["+mj-cs"])
    {
        if(font_scheme.majorFont && typeof  font_scheme.majorFont.cs === "string" && font_scheme.majorFont.cs.length > 0)
            oFontMap[font_scheme.majorFont.cs] = 1;
        delete oFontMap["+mj-cs"];
    }

    if(oFontMap["+mn-lt"])
    {
        if(font_scheme.minorFont && typeof  font_scheme.minorFont.latin === "string" && font_scheme.minorFont.latin.length > 0)
            oFontMap[font_scheme.minorFont.latin] = 1;
        delete oFontMap["+mn-lt"];
    }
    if(oFontMap["+mn-ea"])
    {
        if(font_scheme.minorFont && typeof  font_scheme.minorFont.ea === "string" && font_scheme.minorFont.ea.length > 0)
            oFontMap[font_scheme.minorFont.ea] = 1;
        delete oFontMap["+mn-ea"];
    }
    if(oFontMap["+mn-cs"])
    {
        if(font_scheme.minorFont && typeof  font_scheme.minorFont.cs === "string" && font_scheme.minorFont.cs.length > 0)
            oFontMap[font_scheme.minorFont.cs] = 1;
        delete oFontMap["+mn-cs"];
    }
}

function ExecuteNoHistory(f, oThis, args)
{
    History.TurnOff && History.TurnOff();

    var b_table_id = false;
    if(g_oTableId && !g_oTableId.m_bTurnOff)
    {
        g_oTableId.m_bTurnOff = true;
        b_table_id = true;
    }

    var ret = f.apply(oThis, args);
    History.TurnOn && History.TurnOn();
    if(b_table_id)
    {
        g_oTableId.m_bTurnOff = false;
    }
    return ret;
}


function checkObjectUnifill(obj, theme, colorMap)
{
    if(obj && obj.Unifill)
    {
        obj.Unifill.check(theme, colorMap);
        var rgba = obj.Unifill.getRGBAColor();
        obj.Color = new CDocumentColor(rgba.R, rgba.G, rgba.B, false);
    }
}
function checkTableCellPr(cellPr, slide, layout, master, theme)
{
    cellPr.Check_PresentationPr(theme);
    var color_map, rgba;
    if( slide.clrMap)
    {
        color_map = slide.clrMap;
    }
    else if(layout.clrMap)
    {
        color_map = layout.clrMap;
    }
    else if(master.clrMap)
    {
        color_map = master.clrMap;
    }
    else
    {
        color_map = AscFormat.G_O_DEFAULT_COLOR_MAP;
    }

    checkObjectUnifill(cellPr.Shd, theme, color_map);
    if(cellPr.TableCellBorders)
    {
        checkObjectUnifill(cellPr.TableCellBorders.Left, theme, color_map);
        checkObjectUnifill(cellPr.TableCellBorders.Top, theme, color_map);
        checkObjectUnifill(cellPr.TableCellBorders.Right, theme, color_map);
        checkObjectUnifill(cellPr.TableCellBorders.Bottom, theme, color_map);
        checkObjectUnifill(cellPr.TableCellBorders.InsideH, theme, color_map);
        checkObjectUnifill(cellPr.TableCellBorders.InsideV, theme, color_map);
    }
    return cellPr;
}

var Ax_Counter = {
    GLOBAL_AX_ID_COUNTER : 1000
};
var TYPE_TRACK = {
    SHAPE : 0,
    GROUP : 0,
    GROUP_PASSIVE : 1,
    TEXT : 2,
    EMPTY_PH : 3,
    CHART_TEXT : 4
};
var TYPE_KIND = {
    SLIDE : 0,
    LAYOUT : 1,
    MASTER : 2,
    NOTES  : 3,
    NOTES_MASTER: 4
};

var TYPE_TRACK_SHAPE = 0;
var TYPE_TRACK_GROUP = TYPE_TRACK_SHAPE;
var TYPE_TRACK_GROUP_PASSIVE = 1;
var TYPE_TRACK_TEXT = 2;
var TYPE_TRACK_EMPTY_PH = 3;
var TYPE_TRACK_CHART = 4;

var SLIDE_KIND = 0;
var LAYOUT_KIND = 1;
var MASTER_KIND = 2;

var map_prst_color = {};

map_prst_color["aliceBlue"] = 		0xF0F8FF;
map_prst_color["antiqueWhite"] = 	0xFAEBD7;
map_prst_color["aqua"] = 			0x00FFFF;
map_prst_color["aquamarine"] = 		0x7FFFD4;
map_prst_color["azure"] = 			0xF0FFFF;
map_prst_color["beige"] = 			0xF5F5DC;
map_prst_color["bisque"] = 			0xFFE4C4;
map_prst_color["black"] = 			0x000000;
map_prst_color["blanchedAlmond"] = 	0xFFEBCD;
map_prst_color["blue"] = 			0x0000FF;
map_prst_color["blueViolet"] = 		0x8A2BE2;
map_prst_color["brown"] = 			0xA52A2A;
map_prst_color["burlyWood"] = 		0xDEB887;
map_prst_color["cadetBlue"] = 		0x5F9EA0;
map_prst_color["chartreuse"] = 		0x7FFF00;
map_prst_color["chocolate"] = 		0xD2691E;
map_prst_color["coral"] = 			0xFF7F50;
map_prst_color["cornflowerBlue"] = 	0x6495ED;
map_prst_color["cornsilk"] = 		0xFFF8DC;
map_prst_color["crimson"] = 		0xDC143C;
map_prst_color["cyan"] = 			0x00FFFF;
map_prst_color["darkBlue"] = 		0x00008B;
map_prst_color["darkCyan"] = 		0x008B8B;
map_prst_color["darkGoldenrod"] = 	0xB8860B;
map_prst_color["darkGray"] = 		0xA9A9A9;
map_prst_color["darkGreen"] = 		0x006400;
map_prst_color["darkGrey"] = 		0xA9A9A9;
map_prst_color["darkKhaki"] = 		0xBDB76B;
map_prst_color["darkMagenta"] = 	0x8B008B;
map_prst_color["darkOliveGreen"] = 	0x556B2F;
map_prst_color["darkOrange"] = 		0xFF8C00;
map_prst_color["darkOrchid"] = 		0x9932CC;
map_prst_color["darkRed"] = 		0x8B0000;
map_prst_color["darkSalmon"] = 		0xE9967A;
map_prst_color["darkSeaGreen"] = 	0x8FBC8F;
map_prst_color["darkSlateBlue"] = 	0x483D8B;
map_prst_color["darkSlateGray"] = 	0x2F4F4F;
map_prst_color["darkSlateGrey"] = 	0x2F4F4F;
map_prst_color["darkTurquoise"] = 	0x00CED1;
map_prst_color["darkViolet"] = 		0x9400D3;
map_prst_color["deepPink"] = 		0xFF1493;
map_prst_color["deepSkyBlue"] = 	0x00BFFF;
map_prst_color["dimGray"] = 		0x696969;
map_prst_color["dimGrey"] = 		0x696969;
map_prst_color["dkBlue"] = 			0x00008B;
map_prst_color["dkCyan"] = 			0x008B8B;
map_prst_color["dkGoldenrod"] = 	0xB8860B;
map_prst_color["dkGray"] = 			0xA9A9A9;
map_prst_color["dkGreen"] = 		0x006400;
map_prst_color["dkGrey"] = 			0xA9A9A9;
map_prst_color["dkKhaki"] = 		0xBDB76B;
map_prst_color["dkMagenta"] = 		0x8B008B;
map_prst_color["dkOliveGreen"] = 	0x556B2F;
map_prst_color["dkOrange"] = 		0xFF8C00;
map_prst_color["dkOrchid"] = 		0x9932CC;
map_prst_color["dkRed"] = 			0x8B0000;
map_prst_color["dkSalmon"] = 		0xE9967A;
map_prst_color["dkSeaGreen"] = 		0x8FBC8B;
map_prst_color["dkSlateBlue"] = 	0x483D8B;
map_prst_color["dkSlateGray"] = 	0x2F4F4F;
map_prst_color["dkSlateGrey"] = 	0x2F4F4F;
map_prst_color["dkTurquoise"] = 	0x00CED1;
map_prst_color["dkViolet"] = 		0x9400D3;
map_prst_color["dodgerBlue"] = 		0x1E90FF;
map_prst_color["firebrick"] = 		0xB22222;
map_prst_color["floralWhite"] = 	0xFFFAF0;
map_prst_color["forestGreen"] = 	0x228B22;
map_prst_color["fuchsia"] = 		0xFF00FF;
map_prst_color["gainsboro"] = 		0xDCDCDC;
map_prst_color["ghostWhite"] = 		0xF8F8FF;
map_prst_color["gold"] = 			0xFFD700;
map_prst_color["goldenrod"] = 		0xDAA520;
map_prst_color["gray"] = 			0x808080;
map_prst_color["green"] = 			0x008000;
map_prst_color["greenYellow"] = 	0xADFF2F;
map_prst_color["grey"] = 			0x808080;
map_prst_color["honeydew"] = 		0xF0FFF0;
map_prst_color["hotPink"] = 		0xFF69B4;
map_prst_color["indianRed"] = 		0xCD5C5C;
map_prst_color["indigo"] = 			0x4B0082;
map_prst_color["ivory"] = 			0xFFFFF0;
map_prst_color["khaki"] = 			0xF0E68C;
map_prst_color["lavender"] = 		0xE6E6FA;
map_prst_color["lavenderBlush"] = 	0xFFF0F5;
map_prst_color["lawnGreen"] = 		0x7CFC00;
map_prst_color["lemonChiffon"] = 	0xFFFACD;
map_prst_color["lightBlue"] = 		0xADD8E6;
map_prst_color["lightCoral"] = 		0xF08080;
map_prst_color["lightCyan"] = 		0xE0FFFF;
map_prst_color["lightGoldenrodYellow"] = 0xFAFAD2;
map_prst_color["lightGray"] = 		0xD3D3D3;
map_prst_color["lightGreen"] = 		0x90EE90;
map_prst_color["lightGrey"] = 		0xD3D3D3;
map_prst_color["lightPink"] = 		0xFFB6C1;
map_prst_color["lightSalmon"] = 	0xFFA07A;
map_prst_color["lightSeaGreen"] = 	0x20B2AA;
map_prst_color["lightSkyBlue"] = 	0x87CEFA;
map_prst_color["lightSlateGray"] = 	0x778899;
map_prst_color["lightSlateGrey"] = 	0x778899;
map_prst_color["lightSteelBlue"] = 	0xB0C4DE;
map_prst_color["lightYellow"] = 	0xFFFFE0;
map_prst_color["lime"] = 			0x00FF00;
map_prst_color["limeGreen"] = 		0x32CD32;
map_prst_color["linen"] = 			0xFAF0E6;
map_prst_color["ltBlue"] = 			0xADD8E6;
map_prst_color["ltCoral"] = 		0xF08080;
map_prst_color["ltCyan"] = 			0xE0FFFF;
map_prst_color["ltGoldenrodYellow"] = 0xFAFA78;
map_prst_color["ltGray"] = 			0xD3D3D3;
map_prst_color["ltGreen"] = 		0x90EE90;
map_prst_color["ltGrey"] = 			0xD3D3D3;
map_prst_color["ltPink"] = 			0xFFB6C1;
map_prst_color["ltSalmon"] = 		0xFFA07A;
map_prst_color["ltSeaGreen"] = 		0x20B2AA;
map_prst_color["ltSkyBlue"] = 		0x87CEFA;
map_prst_color["ltSlateGray"] = 	0x778899;
map_prst_color["ltSlateGrey"] = 	0x778899;
map_prst_color["ltSteelBlue"] = 	0xB0C4DE;
map_prst_color["ltYellow"] = 		0xFFFFE0;
map_prst_color["magenta"] = 		0xFF00FF;
map_prst_color["maroon"] = 			0x800000;
map_prst_color["medAquamarine"] = 	0x66CDAA;
map_prst_color["medBlue"] = 		0x0000CD;
map_prst_color["mediumAquamarine"] =  0x66CDAA;
map_prst_color["mediumBlue"] = 		0x0000CD;
map_prst_color["mediumOrchid"] = 	0xBA55D3;
map_prst_color["mediumPurple"] = 	0x9370DB;
map_prst_color["mediumSeaGreen"] = 	0x3CB371;
map_prst_color["mediumSlateBlue"] = 0x7B68EE;
map_prst_color["mediumSpringGreen"] = 0x00FA9A;
map_prst_color["mediumTurquoise"] = 0x48D1CC;
map_prst_color["mediumVioletRed"] = 0xC71585;
map_prst_color["medOrchid"] = 		0xBA55D3;
map_prst_color["medPurple"] = 		0x9370DB;
map_prst_color["medSeaGreen"] = 	0x3CB371;
map_prst_color["medSlateBlue"] = 	0x7B68EE;
map_prst_color["medSpringGreen"] = 	0x00FA9A;
map_prst_color["medTurquoise"] = 	0x48D1CC;
map_prst_color["medVioletRed"] = 	0xC71585;
map_prst_color["midnightBlue"] = 	0x191970;
map_prst_color["mintCream"] = 		0xF5FFFA;
map_prst_color["mistyRose"] = 		0xFFE4FF;
map_prst_color["moccasin"] = 		0xFFE4B5;
map_prst_color["navajoWhite"] = 	0xFFDEAD;
map_prst_color["navy"] = 			0x000080;
map_prst_color["oldLace"] = 		0xFDF5E6;
map_prst_color["olive"] = 			0x808000;
map_prst_color["oliveDrab"] = 		0x6B8E23;
map_prst_color["orange"] = 			0xFFA500;
map_prst_color["orangeRed"] = 		0xFF4500;
map_prst_color["orchid"] = 			0xDA70D6;
map_prst_color["paleGoldenrod"] = 	0xEEE8AA;
map_prst_color["paleGreen"] = 		0x98FB98;
map_prst_color["paleTurquoise"] = 	0xAFEEEE;
map_prst_color["paleVioletRed"] = 	0xDB7093;
map_prst_color["papayaWhip"] = 		0xFFEFD5;
map_prst_color["peachPuff"] = 		0xFFDAB9;
map_prst_color["peru"] = 			0xCD853F;
map_prst_color["pink"] = 			0xFFC0CB;
map_prst_color["plum"] = 			0xD3A0D3;
map_prst_color["powderBlue"] = 		0xB0E0E6;
map_prst_color["purple"] = 			0x800080;
map_prst_color["red"] = 			0xFF0000;
map_prst_color["rosyBrown"] = 		0xBC8F8F;
map_prst_color["royalBlue"] = 		0x4169E1;
map_prst_color["saddleBrown"] = 	0x8B4513;
map_prst_color["salmon"] = 			0xFA8072;
map_prst_color["sandyBrown"] = 		0xF4A460;
map_prst_color["seaGreen"] = 		0x2E8B57;
map_prst_color["seaShell"] = 		0xFFF5EE;
map_prst_color["sienna"] = 			0xA0522D;
map_prst_color["silver"] = 			0xC0C0C0;
map_prst_color["skyBlue"] = 		0x87CEEB;
map_prst_color["slateBlue"] = 		0x6A5AEB;
map_prst_color["slateGray"] = 		0x708090;
map_prst_color["slateGrey"] = 		0x708090;
map_prst_color["snow"] = 			0xFFFAFA;
map_prst_color["springGreen"] = 	0x00FF7F;
map_prst_color["steelBlue"] = 		0x4682B4;
map_prst_color["tan"] = 			0xD2B48C;
map_prst_color["teal"] = 			0x008080;
map_prst_color["thistle"] = 		0xD8BFD8;
map_prst_color["tomato"] = 			0xFF7347;
map_prst_color["turquoise"] = 		0x40E0D0;
map_prst_color["violet"] = 			0xEE82EE;
map_prst_color["wheat"] = 			0xF5DEB3;
map_prst_color["white"] = 			0xFFFFFF;
map_prst_color["whiteSmoke"] = 		0xF5F5F5;
map_prst_color["yellow"] = 			0xFFFF00;
map_prst_color["yellowGreen"] = 	0x9ACD32;

function CColorMod()
{
    this.name = "";
    this.val = 0;
}

CColorMod.prototype =
{
    getObjectType: function()
    {
        return AscDFH.historyitem_type_ColorMod;
    },

    Get_Id: function()
    {
        return this.Id;
    },
    Refresh_RecalcData: function()
    {},

    setName: function(name)
    {
        this.name = name;
    },

    setVal: function(val)
    {
        this.val = val;
    },

    createDuplicate : function()
    {
        var duplicate = new CColorMod();
        duplicate.name = this.name;
        duplicate.val = this.val;
        return duplicate;
    }
};

var cd16 = 1.0/6.0;
var cd13 = 1.0/3.0;
var cd23 = 2.0/3.0;
var max_hls = 255.0;

var DEC_GAMMA          = 2.3;
var INC_GAMMA          = 1.0 / DEC_GAMMA;
var MAX_PERCENT        = 100000;

function CColorModifiers()
{
    this.Mods = [];

}

CColorModifiers.prototype =
{
    getObjectType: function()
    {
        return AscDFH.historyitem_type_ColorModifiers;
    },

    Get_Id: function()
    {
        return this.Id;
    },
    Refresh_RecalcData: function()
    {},

    getModsToWrite: function()
    {

    },



    Write_ToBinary: function(w)
    {
        w.WriteLong(this.Mods.length);
        for(var i = 0; i < this.Mods.length; ++i)
        {
            w.WriteString2(this.Mods[i].name);
            w.WriteLong(this.Mods[i].val);
        }
    },

    Read_FromBinary: function(r)
    {
        var len = r.GetLong();
        for(var i = 0; i < len; ++i)
        {
            var mod = new CColorMod();
            mod.name = r.GetString2();
            mod.val = r.GetLong();
            this.Mods.push(mod);
        }
    },

    addMod: function(mod)
    {
        this.Mods.push(mod);
    },


    removeMod: function(pos)
    {
        this.Mods.splice(pos, 1)[0];
    },


    IsIdentical : function(mods)
    {
        if(mods == null)
        {
            return false
        }
        if(mods.Mods == null || this.Mods.length!=mods.Mods.length)
        {
            return false;
        }

        for(var i = 0; i<this.Mods.length; ++i)
        {
            if(this.Mods[i].name!=mods.Mods[i].name
                || this.Mods[i].val!=mods.Mods[i].val)
            {
                return false;
            }
        }
        return true;

    },

    createDuplicate : function()
    {
        var duplicate = new CColorModifiers();
        for(var  i=0; i< this.Mods.length; ++i)
        {
            duplicate.Mods[i] = this.Mods[i].createDuplicate();
        }
        return duplicate;
    },

    RGB2HSL : function(R, G, B, HLS)
    {
        var iMin = Math.min(R, G, B);
        var iMax = Math.max(R, G, B);
        var iDelta = iMax - iMin;
        var dMax = (iMax + iMin)/255.0;
        var dDelta = iDelta/255.0;
        var H = 0;
        var S = 0;
        var L = dMax / 2.0;

        if (iDelta != 0)
        {
            if ( L < 0.5 ) S = dDelta / dMax;
            else           S = dDelta / ( 2.0 - dMax );

            dDelta = dDelta * 1530.0;
            var dR = ( iMax - R ) / dDelta;
            var dG = ( iMax - G ) / dDelta;
            var dB = ( iMax - B ) / dDelta;

            if      ( R == iMax ) H = dB - dG;
            else if ( G == iMax ) H = cd13 + dR - dB;
            else if ( B == iMax ) H = cd23 + dG - dR;

            if ( H < 0.0 ) H += 1.0;
            if ( H > 1.0 ) H -= 1.0;
        }

        H = ((H * max_hls) >> 0) & 0xFF;
        if (H < 0)
            H = 0;
        if (H > 255)
            H = 255;

        S = ((S * max_hls) >> 0) & 0xFF;
        if (S < 0)
            S = 0;
        if (S > 255)
            S = 255;

        L = ((L * max_hls) >> 0) & 0xFF;
        if (L < 0)
            L = 0;
        if (L > 255)
            L = 255;

        HLS.H = H;
        HLS.S = S;
        HLS.L = L;
    },

    HSL2RGB : function(HSL, RGB)
    {
        if (HSL.S == 0)
        {
            RGB.R = HSL.L;
            RGB.G = HSL.L;
            RGB.B = HSL.L;
        }
        else
        {
            var H = HSL.H/max_hls;
            var S = HSL.S/max_hls;
            var L = HSL.L/max_hls;
            var v2 = 0;
            if (L < 0.5)
                v2 = L * (1.0 + S);
            else
                v2 = L + S - S*L;

            var v1 = 2.0 * L - v2;

            var R = (255 * this.Hue_2_RGB(v1, v2, H + cd13)) >> 0;
            var G = (255 * this.Hue_2_RGB(v1, v2, H)) >> 0;
            var B = (255 * this.Hue_2_RGB(v1, v2, H - cd13)) >> 0;

            if (R < 0)
                R = 0;
            if (R > 255)
                R = 255;

            if (G < 0)
                G = 0;
            if (G > 255)
                G = 255;

            if (B < 0)
                B = 0;
            if (B > 255)
                B = 255;

            RGB.R = R;
            RGB.G = G;
            RGB.B = B;
        }
    },

    Hue_2_RGB : function(v1,v2,vH)
    {
        if (vH < 0.0)
            vH += 1.0;
        if (vH > 1.0)
            vH -= 1.0;
        if (vH < cd16)
            return v1 + (v2 - v1) * 6.0 * vH;
        if (vH < 0.5)
            return v2;
        if (vH < cd23)
            return v1 + (v2 - v1) * (cd23 - vH) * 6.0;
        return v1;
    },

    lclRgbCompToCrgbComp: function(value)
    {
        return (value * MAX_PERCENT / 255);
    },

    lclCrgbCompToRgbComp: function(value)
    {
        return (value * 255 / MAX_PERCENT);
    },

    lclGamma: function(nComp, fGamma)
    {
        return (Math.pow(nComp/MAX_PERCENT, fGamma)*MAX_PERCENT) >> 0;
    },

    RgbtoCrgb: function(RGBA)
    {
        RGBA.R = this.lclGamma(this.lclRgbCompToCrgbComp(RGBA.R), DEC_GAMMA);
        RGBA.G = this.lclGamma(this.lclRgbCompToCrgbComp(RGBA.G), DEC_GAMMA);
        RGBA.B = this.lclGamma(this.lclRgbCompToCrgbComp(RGBA.B), DEC_GAMMA);
    },


    CrgbtoRgb: function(RGBA)
    {
        RGBA.R = this.lclCrgbCompToRgbComp(this.lclGamma(RGBA.R, INC_GAMMA)) >> 0;
        RGBA.G = this.lclCrgbCompToRgbComp(this.lclGamma(RGBA.G, INC_GAMMA)) >> 0;
        RGBA.B = this.lclCrgbCompToRgbComp(this.lclGamma(RGBA.B, INC_GAMMA)) >> 0;
    },

    Apply : function(RGBA)
    {
        if (null == this.Mods)
            return;

        var _len = this.Mods.length;
        for (var i = 0; i < _len; i++)
        {
            var colorMod = this.Mods[i];
            var val = colorMod.val/100000.0;

            if (colorMod.name == "alpha")
            {
                RGBA.A = Math.min(255, Math.max(0, 255 * val));
            }
            else if (colorMod.name == "blue")
            {
                RGBA.B = Math.min(255, Math.max(0, 255 * val));
            }
            else if (colorMod.name == "blueMod")
            {
                RGBA.B = Math.max(0, (RGBA.B * val) >> 0);
            }
            else if (colorMod.name == "blueOff")
            {
                RGBA.B = Math.max(0, (RGBA.B + val * 255)) >> 0;
            }
            else if (colorMod.name == "green")
            {
                RGBA.G = Math.min(255, Math.max(0, 255 * val)) >> 0;
            }
            else if (colorMod.name == "greenMod")
            {
                RGBA.G = Math.max(0, (RGBA.G * val) >> 0);
            }
            else if (colorMod.name == "greenOff")
            {
                RGBA.G = Math.max(0, (RGBA.G + val * 255)) >> 0;
            }
            else if (colorMod.name == "red")
            {
                RGBA.R = Math.min(255, Math.max(0, 255 * val)) >> 0;
            }
            else if (colorMod.name == "redMod")
            {
                RGBA.R = Math.max(0, (RGBA.R * val) >> 0);
            }
            else if (colorMod.name == "redOff")
            {
                RGBA.R = Math.max(0, (RGBA.R + val * 255) >> 0);
            }
            else if (colorMod.name == "hueOff")
            {
                var HSL = {H: 0, S: 0, L: 0};
                this.RGB2HSL(RGBA.R, RGBA.G, RGBA.B, HSL);

                var res = (HSL.H + (val * 10.0) / 9.0) >> 0;
                while(res > max_hls)
                    res = res - max_hls;
                while(res < 0)
                    res += max_hls;
                HSL.H = res;

                this.HSL2RGB(HSL, RGBA);
            }
            else if (colorMod.name == "inv")
            {
                RGBA.R ^= 0xFF;
                RGBA.G ^= 0xFF;
                RGBA.B ^= 0xFF;
            }
            else if (colorMod.name == "lumMod")
            {
                var HSL = {H: 0, S: 0, L: 0};
                this.RGB2HSL(RGBA.R, RGBA.G, RGBA.B, HSL);

                if(HSL.L*val > max_hls)
                    HSL.L = max_hls;
                else
                    HSL.L = Math.max(0, (HSL.L * val) >> 0);
                this.HSL2RGB(HSL, RGBA);
            }
            else if (colorMod.name == "lumOff")
            {
                var HSL = {H: 0, S: 0, L: 0};
                this.RGB2HSL(RGBA.R, RGBA.G, RGBA.B, HSL);

                var res = (HSL.L + val * max_hls) >> 0;
                while(res > max_hls)
                    res = res - max_hls;
                while(res < 0)
                    res += max_hls;
                HSL.L = res;

                this.HSL2RGB(HSL, RGBA);
            }
            else if (colorMod.name == "satMod")
            {
                var HSL = {H: 0, S: 0, L: 0};
                this.RGB2HSL(RGBA.R, RGBA.G, RGBA.B, HSL);

                if(HSL.S*val > max_hls)
                    HSL.S = max_hls;
                else
                    HSL.S = Math.max(0, (HSL.S * val) >> 0);
                this.HSL2RGB(HSL, RGBA);
            }
            else if (colorMod.name == "satOff")
            {
                var HSL = {H: 0, S: 0, L: 0};
                this.RGB2HSL(RGBA.R, RGBA.G, RGBA.B, HSL);

                var res = (HSL.S + val * max_hls) >> 0;
                while(res > max_hls)
                    res = res - max_hls;
                while(res < 0)
                    res += max_hls;
                HSL.S = res;

                this.HSL2RGB(HSL, RGBA);
            }
            else if (colorMod.name == "wordShade")
            {
                var val_ = colorMod.val/255;
                //GBA.R = Math.max(0, (RGBA.R * (1 - val_)) >> 0);
                //GBA.G = Math.max(0, (RGBA.G * (1 - val_)) >> 0);
                //GBA.B = Math.max(0, (RGBA.B * (1 - val_)) >> 0);


                //RGBA.R = Math.max(0,  ((1 - val_)*(- RGBA.R) + RGBA.R) >> 0);
                //RGBA.G = Math.max(0,  ((1 - val_)*(- RGBA.G) + RGBA.G) >> 0);
                //RGBA.B = Math.max(0,  ((1 - val_)*(- RGBA.B) + RGBA.B) >> 0);

                var HSL = {H: 0, S: 0, L: 0};
                this.RGB2HSL(RGBA.R, RGBA.G, RGBA.B, HSL);

                if(HSL.L*val_ > max_hls)
                    HSL.L = max_hls;
                else
                    HSL.L = Math.max(0, (HSL.L * val_) >> 0);
                this.HSL2RGB(HSL, RGBA);
            }
            else if (colorMod.name == "wordTint")
            {
                var _val = colorMod.val/255;
                //RGBA.R = Math.max(0,  ((1 - _val)*(255 - RGBA.R) + RGBA.R) >> 0);
                //RGBA.G = Math.max(0,  ((1 - _val)*(255 - RGBA.G) + RGBA.G) >> 0);
                //RGBA.B = Math.max(0,  ((1 - _val)*(255 - RGBA.B) + RGBA.B) >> 0);

                var HSL = {H: 0, S: 0, L: 0};
                this.RGB2HSL(RGBA.R, RGBA.G, RGBA.B, HSL);

                var L_ = HSL.L*_val + (255 - colorMod.val);
                if(L_ > max_hls)
                    HSL.L = max_hls;
                else
                    HSL.L = Math.max(0, (L_) >> 0);
                this.HSL2RGB(HSL, RGBA);
            }
            else if (colorMod.name == "shade")
            {
                this.RgbtoCrgb(RGBA);
                if (val < 0) val = 0;
                if (val > 1) val = 1;
                RGBA.R = ((RGBA.R * val)) >> 0;
                RGBA.G = ((RGBA.G * val)) >> 0;
                RGBA.B = ((RGBA.B * val)) >> 0;
                this.CrgbtoRgb(RGBA);
            }
            else if (colorMod.name == "tint")
            {
                this.RgbtoCrgb(RGBA);
                if (val < 0) val = 0;
                if (val > 1) val = 1;
                RGBA.R = ( MAX_PERCENT - (MAX_PERCENT - RGBA.R) * val );
                RGBA.G = ( MAX_PERCENT - (MAX_PERCENT - RGBA.G) * val );
                RGBA.B = ( MAX_PERCENT - (MAX_PERCENT - RGBA.B) * val );
                this.CrgbtoRgb(RGBA);
            }
            else if (colorMod.name == "gamma")
            {
                this.RgbtoCrgb(RGBA);
                RGBA.R = this.lclGamma(RGBA.R, INC_GAMMA);
                RGBA.G = this.lclGamma(RGBA.G, INC_GAMMA);
                RGBA.B = this.lclGamma(RGBA.B, INC_GAMMA);
                this.CrgbtoRgb(RGBA);
            }
            else if (colorMod.name == "invGamma")
            {
                this.RgbtoCrgb(RGBA);
                RGBA.R = this.lclGamma(RGBA.R, DEC_GAMMA);
                RGBA.G = this.lclGamma(RGBA.G, DEC_GAMMA);
                RGBA.B = this.lclGamma(RGBA.B, DEC_GAMMA);
                this.CrgbtoRgb(RGBA);
            }
        }
    },

    applyGamma : function(c, gamma)
    {
        // LO
        var _max = 256;
        var _ret = (Math.pow(c / _max, gamma) * _max) >> 0;
        if (_ret > 255)
            _ret = 255;
        return _ret;
    }
};

function CSysColor()
{
    this.type = c_oAscColor.COLOR_TYPE_SYS;
    this.id = "";
    this.RGBA = {
        R: 0,
        G: 0,
        B: 0,
        A: 255,
        needRecalc: true
    };
}

CSysColor.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},


    setR: function(pr)
    {
        this.RGBA.R = pr;
    },
    setG: function(pr)
    {
        this.RGBA.G = pr;
    },
    setB: function(pr)
    {
        this.RGBA.B = pr;
    },

    check: function()
    {
        var ret = this.RGBA.needRecalc;
        this.RGBA.needRecalc = false;
        return ret;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_SysColor;
    },

    Write_ToBinary: function (w)
    {
        w.WriteLong(this.type);
        w.WriteString2(this.id);
        w.WriteLong(((this.RGBA.R << 16) & 0xFF0000) + ((this.RGBA.G << 8) & 0xFF00) + this.RGBA.B);
    },

    Read_FromBinary: function (r)
    {
        this.id = r.GetString2();

        var RGB = r.GetLong();
        this.RGBA.R = (RGB >> 16) & 0xFF;
        this.RGBA.G = (RGB >> 8) & 0xFF;
        this.RGBA.B = RGB & 0xFF;
    },

    setId: function(id)
    {
        this.id = id;
    },

    IsIdentical :  function(color)
    {
        return color && color.type == this.type && color.id == this.id;
    },
    Calculate : function(obj)
    {
    },

    createDuplicate : function()
    {
        var duplicate = new CSysColor();
        duplicate.id = this.id;
        duplicate.RGBA.R = this.RGBA.R;
        duplicate.RGBA.G = this.RGBA.G;
        duplicate.RGBA.B = this.RGBA.B;
        duplicate.RGBA.A = this.RGBA.A;
        return duplicate;
    }
};
function CPrstColor()
{
    this.type = c_oAscColor.COLOR_TYPE_PRST;
    this.id = "";
    this.RGBA = {
        R:0, G:0, B:0, A:255, needRecalc: true
    };
}

CPrstColor.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return AscDFH.historyitem_type_PrstColor;
    },


    Write_ToBinary: function (w)
    {
        w.WriteLong(this.type);
        w.WriteString2(this.id);
    },

    Read_FromBinary: function (r)
    {
        this.id = r.GetString2();
    },

    setId: function(id)
    {
        this.id = id;
    },

    IsIdentical : function(color)
    {
        return color && color.type == this.type && color.id == this.id;
    },

    createDuplicate : function()
    {
        var duplicate = new CPrstColor();
        duplicate.id = this.id;
        duplicate.RGBA.R = this.RGBA.R;
        duplicate.RGBA.G = this.RGBA.G;
        duplicate.RGBA.B = this.RGBA.B;
        duplicate.RGBA.A = this.RGBA.A;
        return duplicate;
    },

    Calculate : function(obj)
    {
        var RGB = map_prst_color[this.id];
        this.RGBA.R = (RGB >> 16) & 0xFF;
        this.RGBA.G = (RGB >> 8) & 0xFF;
        this.RGBA.B = RGB & 0xFF;
    },

    check: function()
    {
        var r, g, b , rgb;
        rgb = map_prst_color[this.id];
        r = (rgb >> 16) & 0xFF;
        g = (rgb >> 8) & 0xFF;
        b = rgb & 0xFF;

        var RGBA = this.RGBA;
        if(RGBA.needRecalc)
        {
            RGBA.R = r;
            RGBA.G = g;
            RGBA.B = b;
            RGBA.needRecalc = false;
            return true;
        }
        else
        {
            if(RGBA.R === r && RGBA.G === g && RGBA.B === b)
                return false;
            else
            {
                RGBA.R = r;
                RGBA.G = g;
                RGBA.B = b;
                return true;
            }
        }
    }
};
function CRGBColor()
{
    this.type = c_oAscColor.COLOR_TYPE_SRGB;
    this.RGBA = {R:0, G:0, B:0, A:255, needRecalc: true};
}

CRGBColor.prototype =
{

    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    check: function()
    {
        var ret = this.RGBA.needRecalc;
        this.RGBA.needRecalc = false;
        return ret;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_RGBColor;
    },

    writeToBinaryLong: function(w)
    {
        w.WriteLong(((this.RGBA.R << 16) & 0xFF0000) + ((this.RGBA.G << 8) & 0xFF00) + this.RGBA.B);
    },

    readFromBinaryLong: function(r)
    {
        var RGB = r.GetLong();
        this.RGBA.R = (RGB >> 16) & 0xFF;
        this.RGBA.G = (RGB >> 8) & 0xFF;
        this.RGBA.B = RGB & 0xFF;
    },

    Write_ToBinary: function(w)
    {
        w.WriteLong(this.type);
        w.WriteLong(((this.RGBA.R << 16) & 0xFF0000) + ((this.RGBA.G << 8) & 0xFF00) + this.RGBA.B);
    },

    Read_FromBinary: function(r)
    {
        var RGB = r.GetLong();
        this.RGBA.R = (RGB >> 16) & 0xFF;
        this.RGBA.G = (RGB >> 8) & 0xFF;
        this.RGBA.B = RGB & 0xFF;
    },

    setColor: function(r, g, b)
    {
        this.RGBA.R = r;
        this.RGBA.G = g;
        this.RGBA.B = b;
    },

    IsIdentical : function(color)
    {
        return color && color.type == this.type && color.RGBA.R == this.RGBA.R && color.RGBA.G == this.RGBA.G && color.RGBA.B == this.RGBA.B && color.RGBA.A == this.RGBA.A;
    },

    createDuplicate : function()
    {
        var duplicate = new CRGBColor();
        duplicate.id = this.id;
        duplicate.RGBA.R = this.RGBA.R;
        duplicate.RGBA.G = this.RGBA.G;
        duplicate.RGBA.B = this.RGBA.B;
        duplicate.RGBA.A = this.RGBA.A;
        return duplicate;
    },

    Calculate : function(obj)
    {
    }
};

function CSchemeColor()
{
    this.type = c_oAscColor.COLOR_TYPE_SCHEME;
    this.id = 0;
    this.RGBA = {
        R:0,
        G:0,
        B:0,
        A:255,
        needRecalc: true
    };
}

CSchemeColor.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    check: function(theme, colorMap)
    {
        var RGBA, colors = theme.themeElements.clrScheme.colors;
        if (colorMap[this.id]!=null && colors[colorMap[this.id]] != null)
            RGBA =  colors[colorMap[this.id]].color.RGBA;
        else if ( colors[this.id] != null)
            RGBA = colors[this.id].color.RGBA;
        if(!RGBA)
        {
            RGBA = {R: 0, G: 0, B: 0, A: 255};
        }
        var _RGBA = this.RGBA;
        if(this.RGBA.needRecalc)
        {
            _RGBA.R = RGBA.R;
            _RGBA.G = RGBA.G;
            _RGBA.B = RGBA.B;
            _RGBA.A = RGBA.A;
            this.RGBA.needRecalc = false;
            return true;
        }
        else
        {
            if(_RGBA.R === RGBA.R && _RGBA.G === RGBA.G && _RGBA.B === RGBA.B && _RGBA.A === RGBA.A)
            {
                return false;
            }
            else
            {
                _RGBA.R = RGBA.R;
                _RGBA.G = RGBA.G;
                _RGBA.B = RGBA.B;
                _RGBA.A = RGBA.A;
                return true;
            }
        }
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_SchemeColor;
    },


    Write_ToBinary: function (w)
    {
        w.WriteLong(this.type);
        w.WriteLong(this.id);
    },

    Read_FromBinary: function (r)
    {
        this.id = r.GetLong();
    },

    setId: function(id)
    {
        this.id = id;
    },


    IsIdentical : function(color)
    {
        return color && color.type == this.type && color.id == this.id;
    },
    createDuplicate : function()
    {
        var duplicate = new CSchemeColor();
        duplicate.id = this.id;
        duplicate.RGBA.R = this.RGBA.R;
        duplicate.RGBA.G = this.RGBA.G;
        duplicate.RGBA.B = this.RGBA.B;
        duplicate.RGBA.A = this.RGBA.A;
        return duplicate;
    },

    Calculate : function(theme, slide, layout, masterSlide, RGBA)
    {
        if(theme.themeElements.clrScheme)
        {
            if(this.id == phClr)
            {
                this.RGBA = RGBA;
            }
            else
            {
                var clrMap;
                if(slide!=null && slide.clrMap!=null)
                {
                    clrMap = slide.clrMap.color_map;
                }
                else if(layout!=null && layout.clrMap!=null)
                {
                    clrMap = layout.clrMap.color_map;
                }
                else if(masterSlide!=null && masterSlide.clrMap!=null)
                {
                    clrMap = masterSlide.clrMap.color_map;
                }
                else
                {
                    clrMap = AscFormat.DEFAULT_COLOR_MAP.color_map;
                }
                if (clrMap[this.id]!=null && theme.themeElements.clrScheme.colors[clrMap[this.id]] != null && theme.themeElements.clrScheme.colors[clrMap[this.id]].color != null)
                    this.RGBA = theme.themeElements.clrScheme.colors[clrMap[this.id]].color.RGBA;
                else if (theme.themeElements.clrScheme.colors[this.id] != null && theme.themeElements.clrScheme.colors[this.id].color != null)
                    this.RGBA = theme.themeElements.clrScheme.colors[this.id].color.RGBA;
            }
        }
    }
};

function CUniColor()
{
    this.color = null;
    this.Mods = null;//new CColorModifiers();
    this.RGBA = {
        R: 0,
        G: 0,
        B: 0,
        A: 255
    };
}

CUniColor.prototype =
{
    checkPhColor: function(unicolor)
    {
        if(this.color && this.color.type === c_oAscColor.COLOR_TYPE_SCHEME && this.color.id === 14)
        {
            if(unicolor)
            {
                if(unicolor.color)
                {
                    this.color = unicolor.color.createDuplicate();
                }
                if(unicolor.Mods)
                {
                    this.Mods = unicolor.Mods.createDuplicate();
                }
            }
        }
    },


    addColorMod: function(mod)
    {
        if(!this.Mods)
        {
            this.Mods = new CColorModifiers();
        }
        this.Mods.addMod(mod.createDuplicate());
    },

    check: function(theme, colorMap)
    {
        if(this.color && this.color.check(theme, colorMap.color_map)/*возвращает был ли изменен RGBA*/)
        {
            this.RGBA.R = this.color.RGBA.R;
            this.RGBA.G = this.color.RGBA.G;
            this.RGBA.B = this.color.RGBA.B;
            if(this.Mods)
                this.Mods.Apply(this.RGBA);
        }
    },

    checkWordMods: function()
    {
        return this.Mods && this.Mods.Mods.length === 1
            && (this.Mods.Mods[0].name === "wordTint" || this.Mods.Mods[0].name === "wordShade");
    },

    convertToPPTXMods: function()
    {
        if(this.checkWordMods())
        {
            var val_, mod_;
            if(this.Mods.Mods[0].name === "wordShade")
            {
                mod_ = new CColorMod();
                mod_.setName("lumMod");
                mod_.setVal(((this.Mods.Mods[0].val/255)*100000) >> 0);
                this.Mods.Mods.splice(0, this.Mods.Mods.length);
                this.Mods.Mods.push(mod_);
            }
            else
            {
                val_ = ((this.Mods.Mods[0].val/255)*100000) >> 0;
                this.Mods.Mods.splice(0, this.Mods.Mods.length);
                mod_ = new CColorMod();
                mod_.setName("lumMod");
                mod_.setVal(val_);
                this.Mods.Mods.push(mod_);
                mod_ = new CColorMod();
                mod_.setName("lumOff");
                mod_.setVal(100000 - val_);
                this.Mods.Mods.push(mod_);
            }
        }
    },

    canConvertPPTXModsToWord: function()
    {
        return this.Mods
            && ((this.Mods.Mods.length === 1 && this.Mods.Mods[0].name === "lumMod" && this.Mods.Mods[0].val > 0)
            || (this.Mods.Mods.length === 2 && this.Mods.Mods[0].name === "lumMod" && this.Mods.Mods[0].val > 0
            &&  this.Mods.Mods[1].name === "lumOff" && this.Mods.Mods[1].val > 0));
    },

    convertToWordMods: function()
    {
        if(this.canConvertPPTXModsToWord())
        {
            var mod_ = new CColorMod();
            mod_.setName( this.Mods.Mods.length === 1 ? "wordShade" : "wordTint");
            mod_.setVal(((this.Mods.Mods[0].val*255)/100000) >> 0);
            this.Mods.Mods.splice(0, this.Mods.Mods.length);
            this.Mods.Mods.push(mod_);
        }
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_UniColor;
    },


    setColor: function(color)
    {
        this.color = color;
    },

    setMods: function(mods)
    {
        this.Mods = mods;
    },

    Write_ToBinary: function(w)
    {
        if(this.color)
        {
            w.WriteBool(true);
            this.color.Write_ToBinary(w);
        }
        else
        {
            w.WriteBool(false);
        }
        if(this.Mods)
        {
            w.WriteBool(true);
            this.Mods.Write_ToBinary(w);
        }
        else
        {
            w.WriteBool(false);
        }
    },

    Read_FromBinary: function(r)
    {
        if(r.GetBool())
        {
            var type = r.GetLong();
            switch(type)
            {
                case c_oAscColor.COLOR_TYPE_NONE:
                {
                    break;
                }
                case c_oAscColor.COLOR_TYPE_SRGB:
                {
                    this.color = new CRGBColor();
                    this.color.Read_FromBinary(r);
                    break;
                }
                case c_oAscColor.COLOR_TYPE_PRST:
                {
                    this.color = new CPrstColor();
                    this.color.Read_FromBinary(r);
                    break;
                }
                case c_oAscColor.COLOR_TYPE_SCHEME:
                {
                    this.color = new CSchemeColor();
                    this.color.Read_FromBinary(r);
                    break;
                }
                case c_oAscColor.COLOR_TYPE_SYS:
                {
                    this.color = new CSysColor();
                    this.color.Read_FromBinary(r);
                    break;
                }
            }
        }
        if(r.GetBool())
        {
            this.Mods = new CColorModifiers();
            this.Mods.Read_FromBinary(r);
        }
        else
        {
            this.Mods = null;
        }
    },

    createDuplicate : function()
    {
        var duplicate = new CUniColor();
        if(this.color!=null)
        {
            duplicate.color = this.color.createDuplicate();
        }
        if(this.Mods)
            duplicate.Mods = this.Mods.createDuplicate();

        duplicate.RGBA.R = this.RGBA.R;
        duplicate.RGBA.G = this.RGBA.G;
        duplicate.RGBA.B = this.RGBA.B;
        duplicate.RGBA.A = this.RGBA.A;
        return duplicate;
    },

    IsIdentical : function(unicolor)
    {
        if(!isRealObject(unicolor))
        {
            return false;
        }
        if(!isRealObject(unicolor.color) && isRealObject(this.color)
            || !isRealObject(this.color) && isRealObject(unicolor.color)
            || isRealObject(this.color) && !this.color.IsIdentical(unicolor.color))
        {
            return false;
        }
        if(!isRealObject(unicolor.Mods) && isRealObject(this.Mods) && this.Mods.Mods.length > 0
            || !isRealObject(this.Mods) && isRealObject(unicolor.Mods) && unicolor.Mods.Mods.length > 0
            || isRealObject(this.Mods) && !this.Mods.IsIdentical(unicolor.Mods))
        {
            return false;
        }
        return true;
    },

    Calculate : function(theme, slide, layout, masterSlide, RGBA)
    {
        if (this.color == null)
            return this.RGBA;

        this.color.Calculate(theme, slide, layout, masterSlide, RGBA);

        this.RGBA = {R:this.color.RGBA.R, G:this.color.RGBA.G, B: this.color.RGBA.B, A: this.color.RGBA.A};
        if(this.Mods)
            this.Mods.Apply(this.RGBA);
    },

    compare : function(unicolor)
    {
        if(unicolor == null)
        {
            return null;
        }
        var _ret = new CUniColor();
        if(this.color == null || unicolor.color == null ||
            this.color.type !== unicolor.color.type)
        {
            return _ret;
        }

        switch(this.color.type)
        {
            case c_oAscColor.COLOR_TYPE_NONE:
            {
                break;
            }
            case c_oAscColor.COLOR_TYPE_PRST:
            {
                _ret.color = new CPrstColor();
                if(unicolor.color.id == this.color.id)
                {
                    _ret.color.id = this.color.id;
                    _ret.color.RGBA.R = this.color.RGBA.R;
                    _ret.color.RGBA.G = this.color.RGBA.G;
                    _ret.color.RGBA.B = this.color.RGBA.B;
                    _ret.color.RGBA.A = this.color.RGBA.A;
                    _ret.RGBA.R  = this.RGBA.R;
                    _ret.RGBA.G  = this.RGBA.G;
                    _ret.RGBA.B  = this.RGBA.B;
                    _ret.RGBA.A  = this.RGBA.A;
                }
                break;
            }
            case c_oAscColor.COLOR_TYPE_SCHEME:
            {
                _ret.color = new CSchemeColor();
                if(unicolor.color.id == this.color.id)
                {
                    _ret.color.id = this.color.id;
                    _ret.color.RGBA.R = this.color.RGBA.R;
                    _ret.color.RGBA.G = this.color.RGBA.G;
                    _ret.color.RGBA.B = this.color.RGBA.B;
                    _ret.color.RGBA.A = this.color.RGBA.A;
                    _ret.RGBA.R  = this.RGBA.R;
                    _ret.RGBA.G  = this.RGBA.G;
                    _ret.RGBA.B  = this.RGBA.B;
                    _ret.RGBA.A  = this.RGBA.A;
                }
                break;
            }
            case c_oAscColor.COLOR_TYPE_SRGB:
            {
                _ret.color = new CRGBColor();
                var _RGBA1 = this.color.RGBA;
                var _RGBA2 = this.color.RGBA;
                if(_RGBA1.R === _RGBA2.R
                    && _RGBA1.G === _RGBA2.G
                    && _RGBA1.B === _RGBA2.B)
                {
                    _ret.color.RGBA.R = this.color.RGBA.R;
                    _ret.color.RGBA.G = this.color.RGBA.G;
                    _ret.color.RGBA.B = this.color.RGBA.B;
                    _ret.RGBA.R  = this.RGBA.R;
                    _ret.RGBA.G  = this.RGBA.G;
                    _ret.RGBA.B  = this.RGBA.B;
                }
                if(_RGBA1.A === _RGBA2.A)
                {
                    _ret.color.RGBA.A = this.color.RGBA.A;
                }

                break;
            }
            case c_oAscColor.COLOR_TYPE_SYS:
            {
                if(unicolor.color.id == this.color.id)
                {
                    _ret.color.id = this.color.id;
                    _ret.color.RGBA.R = this.color.RGBA.R;
                    _ret.color.RGBA.G = this.color.RGBA.G;
                    _ret.color.RGBA.B = this.color.RGBA.B;
                    _ret.color.RGBA.A = this.color.RGBA.A;
                    _ret.RGBA.R  = this.RGBA.R;
                    _ret.RGBA.G  = this.RGBA.G;
                    _ret.RGBA.B  = this.RGBA.B;
                    _ret.RGBA.A  = this.RGBA.A;
                }
                break;
            }
        }
        return _ret;
    },

    getCSSColor : function(transparent)
    {
        if (transparent != null)
        {
            var _css = "rgba(" + this.RGBA.R + "," + this.RGBA.G + "," + this.RGBA.B + ",1)";
            return _css;
        }
        var _css = "rgba(" + this.RGBA.R + "," + this.RGBA.G + "," + this.RGBA.B + "," + (this.RGBA.A / 255) + ")";
        return _css;
    }
};

function CreateUniColorRGB(r, g, b)
{
    var ret = new CUniColor();
    ret.setColor(new CRGBColor());
    ret.color.setColor(r, g, b);
    return ret;
}

function CreteSolidFillRGB(r, g, b)
{
    var ret = new CUniFill();
    ret.setFill(new CSolidFill());
    ret.fill.setColor(new CUniColor());
    var _uni_color = ret.fill.color;
    _uni_color.setColor(new CRGBColor());
    _uni_color.color.setColor(r, g, b);
    return ret;
}

function CreateSolidFillRGBA(r, g, b, a)
{
    var ret = new CUniFill();
    ret.setFill(new CSolidFill());
    ret.fill.setColor(new CUniColor());
    var _uni_color = ret.fill.color;
	_uni_color.RGBA.R = r;
	_uni_color.RGBA.G = g;
	_uni_color.RGBA.B = b;
	_uni_color.RGBA.A = a;
    return ret;
}

// -----------------------------

function CSrcRect()
{
    this.l = null;
    this.t = null;
    this.r = null;
    this.b = null;
}

CSrcRect.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return AscDFH.historyitem_type_SrcRect;
    },

    setLTRB: function(l, t, r, b)
    {
        this.l = l;
        this.t = t;
        this.r = r;
        this.b = b;
    },


    Write_ToBinary: function (w)
    {
        writeDouble(w, this.l);
        writeDouble(w, this.t);
        writeDouble(w, this.r);
        writeDouble(w, this.b);
    },

    Read_FromBinary: function (r)
    {
        this.l = readDouble(r);
        this.t = readDouble(r);
        this.r = readDouble(r);
        this.b = readDouble(r);
    },
    createDublicate : function()
    {
        var _ret = new CSrcRect();
        _ret.l = this.l;
        _ret.t = this.t;
        _ret.r = this.r;
        _ret.b = this.b;
        return _ret;
    }
};

function CBlipFillTile()
{
    this.tx = null;
    this.ty = null;
    this.sx = null;
    this.sy = null;
    this.flip = null;
    this.algn = null;
}
CBlipFillTile.prototype.Write_ToBinary = function(w)
{
    writeLong(w, this.tx);
    writeLong(w, this.ty);
    writeLong(w, this.sx);
    writeLong(w, this.sy);
    writeLong(w, this.flip);
    writeLong(w, this.algn);
};
CBlipFillTile.prototype.Read_FromBinary = function(r)
{
    this.tx = readLong(r);
    this.ty = readLong(r);
    this.sx = readLong(r);
    this.sy = readLong(r);
    this.flip = readLong(r);
    this.algn = readLong(r);
};
CBlipFillTile.prototype.createDuplicate = function()
{
    var ret = new CBlipFillTile();
    ret.tx = this.tx;
    ret.ty = this.ty;
    ret.sx = this.sx;
    ret.sy = this.sy;
    ret.flip = this.flip;
    ret.algn = this.algn;
    return ret;
};
CBlipFillTile.prototype.IsIdentical = function(o)
{
    if(!o)
    {
        return false;
    }
    return (  o.tx == this.tx &&
        o.ty == this.ty &&
    o.sx == this.sx &&
    o.sy == this.sy &&
    o.flip == this.flip &&
    o.algn == this.algn)
};
function CBlipFill()
{
    this.type = c_oAscFill.FILL_TYPE_BLIP;

    this.RasterImageId = "";
    this.VectorImageBin = null;

    this.srcRect = null;

    this.stretch = null;
    this.tile = null;

    this.rotWithShape = null;
}

CBlipFill.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Write_ToBinary: function(w)
    {
        writeString(w, this.RasterImageId);
        var srcUrl = AscCommon.g_oDocumentUrls.getImageUrl(this.RasterImageId) || "";
        writeString(w, srcUrl);
        writeString(w, this.VectorImageBin);
        if(this.srcRect)
        {
            writeBool(w, true);
            writeDouble(w, this.srcRect.l);
            writeDouble(w, this.srcRect.t);
            writeDouble(w, this.srcRect.r);
            writeDouble(w, this.srcRect.b);
        }
        else
        {
            writeBool(w, false);
        }
        writeBool(w, this.stretch);
        if(isRealObject(this.tile))
        {
            w.WriteBool(true);
            this.tile.Write_ToBinary(w);
        }
        else
        {
            w.WriteBool(false);
        }
        writeBool(w, this.rotWithShape);
    },

    Read_FromBinary: function(r)
    {
        this.RasterImageId = readString(r);

        var _correct_id = AscCommon.getImageFromChanges(this.RasterImageId);
        if (null != _correct_id)
            this.RasterImageId = _correct_id;

        var srcUrl = readString(r);
        if(srcUrl) {
            AscCommon.g_oDocumentUrls.addImageUrl(this.RasterImageId, srcUrl);
        }
        this.VectorImageBin = readString(r);

        if(readBool(r))
        {

            this.srcRect = new CSrcRect();
            this.srcRect.l = readDouble(r);
            this.srcRect.t = readDouble(r);
            this.srcRect.r = readDouble(r);
            this.srcRect.b = readDouble(r);
        }
        else
        {
            this.srcRect = null;
        }
        this.stretch      = readBool(r);
        if(r.GetBool())
        {
            this.tile = new CBlipFillTile();
            this.tile.Read_FromBinary(r);
        }
        else
        {
            this.tile = null;
        }
        this.rotWithShape = readBool(r);
    },


    Refresh_RecalcData: function()
    {},


    check: function()
    {},

    checkWordMods: function()
    {
        return false;
    },

    convertToPPTXMods: function()
    {
    },

    canConvertPPTXModsToWord: function()
    {
        return false;
    },

    convertToWordMods: function()
    {
    },


    getObjectType: function()
    {
        return AscDFH.historyitem_type_BlipFill;
    },

    setRasterImageId: function(rasterImageId)
    {
        this.RasterImageId = checkRasterImageId(rasterImageId);
    },

    setVectorImageBin: function(vectorImageBin)
    {
        this.VectorImageBin = vectorImageBin;
    },

    setSrcRect: function(srcRect)
    {
        this.srcRect = srcRect;
    },

    setStretch: function(stretch)
    {
        this.stretch = stretch;
    },

    setTile: function(tile)
    {
        this.tile = tile;
    },

    setRotWithShape: function(rotWithShape)
    {
        this.rotWithShape = rotWithShape;
    },


    createDuplicate : function()
    {
        var duplicate = new CBlipFill();
        duplicate.RasterImageId = this.RasterImageId;
        duplicate.VectorImageBin = this.VectorImageBin;

        duplicate.stretch = this.stretch;
        if(isRealObject(this.tile))
        {
            duplicate.tile = this.tile.createDuplicate();
        }

        if (null != this.srcRect)
            duplicate.srcRect = this.srcRect.createDublicate();

        duplicate.rotWithShape = this.rotWithShape;
        return duplicate;
    },

    IsIdentical : function(fill)
    {
        if(fill == null)
        {
            return false;
        }
        if(fill.type !=  c_oAscFill.FILL_TYPE_BLIP)
        {
            return false;
        }

        if(fill.RasterImageId !=  this.RasterImageId)
        {
            return false;
        }

        /*if(fill.VectorImageBin !=  this.VectorImageBin)
         {
         return false;
         }    */

        if(fill.stretch !=  this.stretch)
        {
            return false;
        }

        if(isRealObject(this.tile))
        {
            if(!this.tile.IsIdentical(fill.tile))
            {
                return false;
            }
        }
        else
        {
            if(fill.tile)
            {
                return false;
            }
        }
        /*
         if(fill.rotWithShape !=  this.rotWithShape)
         {
         return false;
         }
         */
        return true;

    },

    compare : function(fill)
    {
        if(fill == null || fill.type !== c_oAscFill.FILL_TYPE_BLIP)
        {
            return null;
        }
        var _ret = new CBlipFill();
        if(this.RasterImageId == fill.RasterImageId)
        {
            _ret.RasterImageId = this.RasterImageId;
        }
        if(fill.stretch == this.stretch)
        {
            _ret.stretch = this.stretch;
        }
        if(isRealObject(fill.tile))
        {
            if(fill.tile.IsIdentical(this.tile))
            {
                _ret.tile = this.tile.createDuplicate();
            }
            else
            {
                _ret.tile = new CBlipFillTile();
            }
        }
        if(fill.rotWithShape === this.rotWithShape)
        {
            _ret.rotWithShape = this.rotWithShape;
        }
        return _ret;
    }
};

function CSolidFill()
{
    this.type = c_oAscFill.FILL_TYPE_SOLID;
    this.color = null;
}

CSolidFill.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},


    check: function(theme, colorMap)
    {
        if(this.color)
        {
            this.color.check(theme, colorMap);
        }
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_SolidFill;
    },

    setColor: function(color)
    {
        this.color = color;
    },

    Write_ToBinary: function(w)
    {
        if(this.color)
        {
            w.WriteBool(true);
            this.color.Write_ToBinary(w);
        }
        else
        {
            w.WriteBool(false);
        }
    },

    Read_FromBinary: function(r)
    {
        if(r.GetBool())
        {
            this.color = new CUniColor();
            this.color.Read_FromBinary(r);
        }
    },


    checkWordMods: function()
    {
        return this.color && this.color.checkWordMods();
    },

    convertToPPTXMods: function()
    {
        this.color && this.color.convertToPPTXMods();
    },

    canConvertPPTXModsToWord: function()
    {
        return this.color && this.color.canConvertPPTXModsToWord();
    },

    convertToWordMods: function()
    {
        this.color && this.color.convertToWordMods();
    },

    IsIdentical : function(fill)
    {
        if(fill == null)
        {
            return false;
        }
        if(fill.type !=  c_oAscFill.FILL_TYPE_SOLID)
        {
            return false;
        }

        return this.color.IsIdentical(fill.color);

    },

    createDuplicate : function()
    {
        var duplicate = new CSolidFill();
        if(this.color)
        {
            duplicate.color = this.color.createDuplicate();
        }
        return duplicate;
    },

    compare : function(fill)
    {
        if(fill == null || fill.type !== c_oAscFill.FILL_TYPE_SOLID)
        {
            return null;
        }
        var _ret = new CSolidFill();
        _ret.color = this.color.compare(fill.color);
        return _ret;
    }
};

function CGs()
{
    this.color = null;
    this.pos = 0;
}

CGs.prototype =
{

    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return AscDFH.historyitem_type_Gs;
    },

    setColor: function(color)
    {
        this.color = color;
    },

    setPos: function(pos)
    {
        this.pos = pos;
    },

    Write_ToBinary: function(w)
    {
        w.WriteBool(isRealObject(this.color));
        if(isRealObject(this.color))
        {
            this.color.Write_ToBinary(w);
        }
        writeLong(w, this.pos);
    },

    Read_FromBinary: function(r)
    {
        if(r.GetBool())
        {
            this.color = new CUniColor();
            this.color.Read_FromBinary(r);
        }
        else
        {
            this.color = null;
        }
        this.pos = readLong(r);
    },

    IsIdentical : function(fill)
    {
        if(!fill)
            return false;
        if(this.pos !== fill.pos)
            return false;

        if(!this.color && fill.color || this.color && !fill.color || (this.color && fill.color && !this.color.IsIdentical(fill.color)))
            return false;
        return true;
    },

    createDuplicate : function()
    {
        var duplicate = new CGs();
        duplicate.pos = this.pos;
        if(this.color)
        {
            duplicate.color = this.color.createDuplicate();
        }
        return duplicate;
    },

    compare: function(gs)
    {
        if( gs.pos !== this.pos){
            return null;
        }
        var compare_unicolor = this.color.compare(gs.color);
        if(!isRealObject(compare_unicolor))
        {
            return null;
        }
        var ret = new CGs();
        ret.color = compare_unicolor;
        ret.pos = gs.pos === this.pos ? this.pos : 0;
        return ret;
    }
};

function GradLin()
{
    this.angle = 5400000;
    this.scale = true;
}
GradLin.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    Refresh_RecalcData: function()
    {},
    getObjectType: function()
    {
        return AscDFH.historyitem_type_GradLin;
    },

    setAngle: function(angle)
    {
        this.angle = angle;
    },

    setScale: function(scale)
    {
        this.scale = scale;
    },

    Write_ToBinary: function(w)
    {
        writeLong(w, this.angle);
        writeBool(w, this.scale);
    },

    Read_FromBinary: function(r)
    {
        this.angle = readLong(r);
        this.scale = readBool(r);
    },

    IsIdentical : function(lin)
    {
        if (this.angle != lin.angle)
            return false;
        if (this.scale != lin.scale)
            return false;

        return true;
    },

    createDuplicate : function()
    {
        var duplicate = new GradLin();
        duplicate.angle = this.angle;
        duplicate.scale = this.scale;
        return duplicate;
    },

    compare : function(lin)
    {
        return null;
    }
};

function GradPath()
{
    this.path = 0;
    this.rect = null;
}
GradPath.prototype =
{

    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},
    getObjectType: function()
    {
        return AscDFH.historyitem_type_GradPath;
    },

    setPath: function(path)
    {
        this.path = path;
    },

    setRect: function(rect)
    {
        this.rect = rect;
    },


    Write_ToBinary: function(w)
    {
        writeLong(w, this.path);
        w.WriteBool(isRealObject(this.rect));
        if(isRealObject(this.rect))
        {
            this.rect.Write_ToBinary(w);
        }
    },

    Read_FromBinary: function(r)
    {
        this.path = readLong(r);
        if(r.GetBool())
        {
            this.rect = new CSrcRect();
            this.rect.Read_FromBinary(r);
        }
    },


    IsIdentical : function(path)
    {
        if (this.path != path.path)
            return false;
        return true;
    },

    createDuplicate : function()
    {
        var duplicate = new GradPath();
        duplicate.path = this.path;
        return duplicate;
    },

    compare : function(path)
    {
        return null;
    }
};

function CGradFill()
{
    this.type = c_oAscFill.FILL_TYPE_GRAD;
    // пока просто front color
    this.colors = [];

    this.lin = null;
    this.path = null;

    this.rotateWithShape = null;
}

CGradFill.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    Refresh_RecalcData: function()
    {},

    check: function(theme, colorMap)
    {
        for(var i = 0; i < this.colors.length; ++i)
        {
            if(this.colors[i].color)
            {
                this.colors[i].color.check(theme, colorMap);
            }
        }
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_GradFill;
    },

    checkWordMods: function()
    {
        for(var i = 0; i < this.colors.length; ++i)
        {
            if(this.colors[i] && this.colors[i].color && this.colors[i].color.checkWordMods())
            {
                return true;
            }
        }
        return false;
    },

    convertToPPTXMods: function()
    {
        for(var i = 0; i < this.colors.length; ++i)
        {
            this.colors[i] && this.colors[i].color && this.colors[i].color.convertToPPTXMods();

        }
    },

    canConvertPPTXModsToWord: function()
    {
        for(var i = 0; i < this.colors.length; ++i)
        {
            if(this.colors[i] && this.colors[i].color && this.colors[i].color.canConvertPPTXModsToWord())
            {
                return true;
            }
        }
        return false;
    },

    convertToWordMods: function()
    {
        for(var i = 0; i < this.colors.length; ++i)
        {
            this.colors[i] && this.colors[i].color && this.colors[i].color.convertToWordMods();

        }
    },


    addColor: function(color)
    {
        this.colors.push(color);
    },

    setLin: function(lin)
    {
        this.lin = lin;
    },

    setPath: function(path)
    {
        this.path = path;
    },

    Write_ToBinary: function (w)
    {
        w.WriteLong(this.colors.length);
        for(var i = 0; i < this.colors.length; ++i)
        {
            this.colors[i].Write_ToBinary(w) ;
        }
        w.WriteBool(isRealObject(this.lin));
        if(isRealObject(this.lin))
        {
            this.lin.Write_ToBinary(w);
        }
        w.WriteBool(isRealObject(this.path));
        if(isRealObject(this.path))
        {
            this.path.Write_ToBinary(w);
        }
    },

    Read_FromBinary: function (r)
    {
        var len = r.GetLong();
        for(var i = 0; i < len; ++i)
        {
            this.colors[i] = new CGs();
            this.colors[i].Read_FromBinary(r);
        }
        if(r.GetBool())
        {
            this.lin = new GradLin();
            this.lin.Read_FromBinary(r);
        }
        else
        {
            this.lin = null;
        }
        if(r.GetBool())
        {
            this.path = new GradPath();
            this.path.Read_FromBinary(r);
        }
        else
        {
            this.path = null;
        }
    },

    IsIdentical : function(fill)
    {
        if(fill == null)
        {
            return false;
        }
        if(fill.type !=  c_oAscFill.FILL_TYPE_GRAD)
        {
            return false;
        }
        if(fill.colors.length!= this.colors.length)
        {
            return false;
        }
        for(var i = 0; i < this.colors.length; ++i)
        {
            if(!this.colors[i].IsIdentical(fill.colors[i]))
            {
                return false;
            }
        }

        if(!this.path && fill.path || this.path && !fill.path || (this.path && fill.path && !this.path.IsIdentical(fill.path)))
            return false;

        if(!this.lin && fill.lin || !fill.lin && this.lin || (this.lin && fill.lin && !this.lin.IsIdentical(fill.lin)))
            return false;

        return true;
    },

    createDuplicate : function()
    {
        var duplicate = new CGradFill();
        for(var i=0; i<this.colors.length; ++i)
        {
            duplicate.colors[i] = this.colors[i].createDuplicate();
        }

        if (this.lin)
            duplicate.lin = this.lin.createDuplicate();

        if (this.path)
            duplicate.path = this.path.createDuplicate();

        if (this.rotateWithShape != null)
            duplicate.rotateWithShape = this.rotateWithShape;

        return duplicate;
    },

    compare : function(fill)
    {
        if(fill == null || fill.type !== c_oAscFill.FILL_TYPE_GRAD)
        {
            return null;
        }
        var _ret  = new CGradFill();
        if(this.lin == null || fill.lin == null)
            _ret.lin = null;
        else
        {
            _ret.lin = new GradLin();
            _ret.lin.angle = this.lin && this.lin.angle === fill.lin.angle ? fill.lin.angle : 5400000;
            _ret.lin.scale = this.lin && this.lin.scale === fill.lin.scale ? fill.lin.scale : true;
        }
        if(this.path == null || fill.path == null)
        {
            _ret.path = null;
        }
        else
        {
            _ret.path = new GradPath();
        }

        if(this.colors.length === fill.colors.length )
        {
            for(var i = 0;  i < this.colors.length; ++i )
            {
                var compare_unicolor = this.colors[i].compare(fill.colors[i]);
                if(!isRealObject(compare_unicolor))
                {
                    return null;
                }
                _ret.colors[i] = compare_unicolor;
            }
        }
        return _ret;
    }
};

function CPattFill()
{
    this.type = c_oAscFill.FILL_TYPE_PATT;
    this.ftype = 0;
    this.fgClr = null;//new CUniColor();
    this.bgClr = null;//new CUniColor();
}

CPattFill.prototype =
{
    getObjectType: function()
    {
        return AscDFH.historyitem_type_PathFill;
    },

    check: function(theme, colorMap)
    {
        if(this.fgClr)
            this.fgClr.check(theme, colorMap);
        if(this.bgClr)
            this.bgClr.check(theme, colorMap);
    },

    checkWordMods: function()
    {
        if(this.fgClr && this.fgClr.checkWordMods())
        {
            return true;
        }
        return this.bgClr && this.bgClr.checkWordMods();

    },

    convertToPPTXMods: function()
    {
        this.fgClr && this.fgClr.convertToPPTXMods();
        this.bgClr && this.bgClr.convertToPPTXMods();
    },

    canConvertPPTXModsToWord: function()
    {
        if(this.fgClr && this.fgClr.canConvertPPTXModsToWord())
        {
            return true;
        }
        return this.bgClr && this.bgClr.canConvertPPTXModsToWord();
    },

    convertToWordMods: function()
    {

        this.fgClr && this.fgClr.convertToWordMods();
        this.bgClr && this.bgClr.convertToWordMods();
    },

    setFType: function(fType)
    {
        this.ftype = fType;
    },

    setFgColor: function(fgClr)
    {
        this.fgClr = fgClr;
    },

    setBgColor: function(bgClr)
    {
        this.bgClr = bgClr;
    },


    Write_ToBinary: function(w)
    {
        writeLong(w, this.ftype);
        w.WriteBool(isRealObject(this.fgClr));
        if(isRealObject(this.fgClr))
        {
            this.fgClr.Write_ToBinary(w);
        }
        w.WriteBool(isRealObject(this.bgClr));
        if(isRealObject(this.bgClr))
        {
            this.bgClr.Write_ToBinary(w);
        }
    },

    Read_FromBinary: function(r)
    {
        this.ftype = readLong(r);
        if(r.GetBool())
        {
            this.fgClr = new CUniColor();
            this.fgClr.Read_FromBinary(r);
        }
        if(r.GetBool())
        {
            this.bgClr = new CUniColor();
            this.bgClr.Read_FromBinary(r);
        }
    },


    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    IsIdentical : function(fill)
    {
        if(fill == null)
        {
            return false;
        }
        if(fill.type !=  c_oAscFill.FILL_TYPE_PATT && this.ftype!=fill.ftype)
        {
            return false;
        }

        return this.fgClr.IsIdentical(fill.fgClr) && this.bgClr.IsIdentical(fill.bgClr) &&  this.ftype === fill.ftype;
    },

    createDuplicate : function()
    {
        var duplicate = new CPattFill();
        duplicate.ftype = this.ftype;
        if(this.fgClr)
        {
            duplicate.fgClr = this.fgClr.createDuplicate();
        }
        if(this.bgClr)
        {
            duplicate.bgClr = this.bgClr.createDuplicate();
        }
        return duplicate;
    },
    compare : function(fill)
    {
        if(fill == null)
        {
            return null;
        }
        if(fill.type !== c_oAscFill.FILL_TYPE_PATT)
        {
            return null;
        }
        var _ret = new CPattFill();
        if(fill.ftype == this.ftype)
        {
            _ret.ftype = this.ftype;
        }
        _ret.fgClr = this.fgClr.compare(fill.fgClr);
        _ret.bgClr = this.bgClr.compare(fill.bgClr);
        return _ret;
    }
};

function CNoFill()
{
    this.type = c_oAscFill.FILL_TYPE_NOFILL;
}

CNoFill.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    check: function()
    {},

    getObjectType: function()
    {
        return AscDFH.historyitem_type_NoFill;
    },



    Write_ToBinary: function(w)
    {

    },

    Read_FromBinary: function(r)
    {
    },


    checkWordMods: function()
    {
        return false;

    },

    convertToPPTXMods: function()
    {
    },

    canConvertPPTXModsToWord: function()
    {
        return false;
    },

    convertToWordMods: function()
    {
    },

    createDuplicate : function()
    {
        return new CNoFill();
    },

    IsIdentical : function(fill)
    {
        if(fill == null)
        {
            return false;
        }
        return fill.type ===  c_oAscFill.FILL_TYPE_NOFILL;
    },
    compare : function(nofill)
    {
        if(nofill == null)
        {
            return null;
        }
        if(nofill.type === this.type)
        {
            return new CNoFill();
        }
        return null;
    }
};

function CGrpFill()
{
    this.type = c_oAscFill.FILL_TYPE_GRP;
}

CGrpFill.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    check: function()
    {},

    getObjectType: function()
    {
        return AscDFH.historyitem_type_GrpFill;
    },



    Write_ToBinary: function(w)
    {
    },

    Read_FromBinary: function(r)
    {
    },


    checkWordMods: function()
    {
        return false;

    },

    convertToPPTXMods: function()
    {
    },

    canConvertPPTXModsToWord: function()
    {
        return false;
    },

    convertToWordMods: function()
    {
    },

    createDuplicate : function()
    {
        return new CGrpFill();
    },

    IsIdentical : function(fill)
    {
        if(fill == null)
        {
            return false;
        }
        return fill.type ===  c_oAscFill.FILL_TYPE_GRP;
    },
    compare : function(grpfill)
    {
        if(grpfill == null)
        {
            return null;
        }
        if(grpfill.type === this.type)
        {
            return new CGrpFill();
        }
        return null;
    }
};


function CreateBlackRGBUnifill()
{
    var ret = new CUniFill();
    ret.setFill(new CSolidFill());
    ret.fill.setColor(new CUniColor());
    ret.fill.color.setColor(new CRGBColor());
    ret.fill.color.color.setColor(0, 0, 0);
    return ret;
}

function FormatRGBAColor()
{
    this.R = 0;
    this.G = 0;
    this.B = 0;
    this.A = 255;
}

function CUniFill()
{
    this.fill = null;
    this.transparent = null;
}

CUniFill.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    Refresh_RecalcData: function()
    {},

    check: function(theme, colorMap)
    {
        if(this.fill)
        {
            this.fill.check(theme, colorMap);
        }
    },


    addColorMod: function(mod)
    {
        if(this.fill)
        {
            switch(this.fill.type)
            {
                case c_oAscFill.FILL_TYPE_NONE:
                case c_oAscFill.FILL_TYPE_BLIP:
                case c_oAscFill.FILL_TYPE_NOFILL:
                case c_oAscFill.FILL_TYPE_GRP:
                {
                    break;
                }
                case c_oAscFill.FILL_TYPE_SOLID:
                {
                    if(this.fill.color && this.fill.color)
                    {
                        this.fill.color.addColorMod(mod);
                    }
                    break;
                }
                case c_oAscFill.FILL_TYPE_GRAD:
                {
                    for(var i = 0; i < this.fill.colors.length; ++i)
                    {
                        if(this.fill.colors[i] && this.fill.colors[i].color)
                        {
                            this.fill.colors[i].color.addColorMod(mod);
                        }
                    }
                    break;
                }
                case c_oAscFill.FILL_TYPE_PATT:
                {
                    if(this.fill.bgClr)
                    {
                        this.fill.bgClr.addColorMod(mod);
                    }
                    if(this.fill.fgClr)
                    {
                        this.fill.fgClr.addColorMod(mod);
                    }
                    break;
                }
            }
        }
    },

    checkPhColor: function(unicolor)
    {
        if(this.fill)
        {
            switch(this.fill.type)
            {
                case c_oAscFill.FILL_TYPE_NONE:
                case c_oAscFill.FILL_TYPE_BLIP:
                case c_oAscFill.FILL_TYPE_NOFILL:
                case c_oAscFill.FILL_TYPE_GRP:
                {
                    break;
                }
                case c_oAscFill.FILL_TYPE_SOLID:
                {
                    if(this.fill.color && this.fill.color)
                    {
                        this.fill.color.checkPhColor(unicolor);
                    }
                    break;
                }
                case c_oAscFill.FILL_TYPE_GRAD:
                {
                    for(var i = 0; i < this.fill.colors.length; ++i)
                    {
                        if(this.fill.colors[i] && this.fill.colors[i].color)
                        {
                            this.fill.colors[i].color.checkPhColor(unicolor);
                        }
                    }
                    break;
                }
                case c_oAscFill.FILL_TYPE_PATT:
                {
                    if(this.fill.bgClr)
                    {
                        this.fill.bgClr.checkPhColor(unicolor);
                    }
                    if(this.fill.fgClr)
                    {
                        this.fill.fgClr.checkPhColor(unicolor);
                    }
                    break;
                }
            }
        }
    },

    checkWordMods: function()
    {
        return this.fill && this.fill.checkWordMods();
    },

    convertToPPTXMods: function()
    {
        this.fill && this.fill.convertToPPTXMods();
    },

    canConvertPPTXModsToWord: function()
    {
        return this.fill && this.fill.canConvertPPTXModsToWord();
    },

    convertToWordMods: function()
    {
        this.fill && this.fill.convertToWordMods();
    },


    getObjectType: function()
    {
        return AscDFH.historyitem_type_UniFill;
    },

    setFill: function(fill)
    {
        this.fill = fill;
    },

    setTransparent: function(transparent)
    {
        this.transparent = transparent;
    },

    Set_FromObject: function(o)
    {
        //TODO:
    },


    Write_ToBinary: function(w)
    {
        writeDouble(w, this.transparent);
        w.WriteBool(isRealObject(this.fill));

        if(isRealObject(this.fill)){
            w.WriteLong(this.fill.type);
            this.fill.Write_ToBinary(w);
        }

    },

    Read_FromBinary: function(r)
    {
        this.transparent = readDouble(r);
        if(r.GetBool())
        {
            var type = r.GetLong();
            switch(type)
            {
                case c_oAscFill.FILL_TYPE_NONE:
                {
                    break;
                }
                case c_oAscFill.FILL_TYPE_BLIP:
                {
                    this.fill = new CBlipFill();
                    this.fill.Read_FromBinary(r);
                    break;
                }
                case c_oAscFill.FILL_TYPE_NOFILL:
                {
                    this.fill = new CNoFill();
                    this.fill.Read_FromBinary(r);
                    break;
                }
                case c_oAscFill.FILL_TYPE_SOLID:
                {
                    this.fill = new CSolidFill();
                    this.fill.Read_FromBinary(r);
                    break;
                }
                case c_oAscFill.FILL_TYPE_GRAD:
                {
                    this.fill = new CGradFill();
                    this.fill.Read_FromBinary(r);
                    break;
                }
                case c_oAscFill.FILL_TYPE_PATT:
                {
                    this.fill = new CPattFill();
                    this.fill.Read_FromBinary(r);
                    break;
                }
                case c_oAscFill.FILL_TYPE_GRP:
                {
                    this.fill = new CGrpFill();
                    this.fill.Read_FromBinary(r);
                    break;
                }
            }
        }
    },



    calculate : function(theme, slide, layout, masterSlide, RGBA)
    {
        if(this.fill )
        {
            if(this.fill.color)
            {
                this.fill.color.Calculate(theme, slide, layout, masterSlide, RGBA);
            }
            if(this.fill.colors)
            {
                for(var i  = 0; i <this.fill.colors.length; ++i )
                {
                    this.fill.colors[i].color.Calculate(theme, slide, layout, masterSlide, RGBA);
                }
            }
            if (this.fill.fgClr)
                this.fill.fgClr.Calculate(theme, slide, layout, masterSlide, RGBA);
            if (this.fill.bgClr)
                this.fill.bgClr.Calculate(theme, slide, layout, masterSlide, RGBA);
        }
    },

    getRGBAColor : function()
    {
        if (this.fill)
        {
            if (this.fill.type == c_oAscFill.FILL_TYPE_SOLID)
            {
                return this.fill.color.RGBA;
            }
            if (this.fill.type == c_oAscFill.FILL_TYPE_GRAD)
            {
                var RGBA = new FormatRGBAColor();
                var _colors = this.fill.colors;
                var _len = _colors.length;

                if (0 == _len)
                    return RGBA;

                for (var i = 0; i < _len; i++)
                {
                    RGBA.R += _colors[i].color.RGBA.R;
                    RGBA.G += _colors[i].color.RGBA.G;
                    RGBA.B += _colors[i].color.RGBA.B;
                }

                RGBA.R = (RGBA.R / _len) >> 0;
                RGBA.G = (RGBA.G / _len) >> 0;
                RGBA.B = (RGBA.B / _len) >> 0;

                return RGBA;
            }
            if (this.fill.type == c_oAscFill.FILL_TYPE_PATT)
            {
                return this.fill.fgClr.RGBA;
            }
            if(this.fill.type == c_oAscFill.FILL_TYPE_NOFILL)
            {
                return {R: 0, G: 0, B: 0};
            }
        }
        return new FormatRGBAColor();
    },

    createDuplicate : function()
    {
        var duplicate = new CUniFill();
        if(this.fill != null)
        {
            duplicate.fill = this.fill.createDuplicate();
        }
        duplicate.transparent = this.transparent;
        return duplicate;
    },

    merge : function(unifill)
    {
        if(unifill )
        {
            if(unifill.fill!=null)
            {
                this.fill = unifill.fill.createDuplicate();
            }
            if(unifill.transparent != null)
            {
                this.transparent = unifill.transparent;
            }
        }
    },

    IsIdentical : function(unifill)
    {
        if(unifill == null)
        {
            return false;
        }
		
		if(isRealNumber(this.transparent) !== isRealNumber(unifill.transparent)
		|| isRealNumber(this.transparent) && this.transparent !== unifill.transparent)
		{
			return false;
		}
		
        if(this.fill == null && unifill.fill == null)
        {
            return true;
        }
        if(this.fill!=null)
        {
            return this.fill.IsIdentical(unifill.fill);
        }
        else
        {
            return false;
        }
    },

    Is_Equal : function(unfill)
    {
        return this.IsIdentical(unfill);
    },

    compare : function(unifill)
    {
        if(unifill == null)
        {
            return null;
        }
        var _ret = new CUniFill();
        if(!(this.fill == null || unifill.fill == null))
        {
            if(this.fill.compare)
            {
                _ret.fill = this.fill.compare(unifill.fill);
            }
        }
        return _ret.fill;
    }
};

function CompareUniFill(unifill_1, unifill_2)
{

    if(unifill_1 == null || unifill_2 == null)
    {
        return null;
    }

    var _ret = new CUniFill();

    if(!(unifill_1.transparent === null || unifill_2.transparent === null
        || unifill_1.transparent !== unifill_2.transparent))
    {
        _ret.transparent = unifill_1.transparent;
    }

    if(unifill_1.fill == null || unifill_2.fill == null
        || unifill_1.fill.type != unifill_2.fill.type)
    {
        return _ret;
    }
    _ret.fill = unifill_1.compare(unifill_2);
    return _ret;
}


function CompareBlipTiles(tile1, tile2)
{
    if(isRealObject(tile1))
    {
        return tile1.IsIdentical(tile2);
    }
    return tile1 === tile2;
}

function CompareUnifillBool(u1, u2)
{
    if(!u1 && !u2)
        return true;
    if(!u1 && u2 || u1 && !u2)
        return false;

	if(isRealNumber(u1.transparent) !== isRealNumber(u2.transparent)
		|| isRealNumber(u1.transparent) && u1.transparent !== u2.transparent)
		{
			return false;
		}
    if(!u1.fill && !u2.fill)
        return true;
    if(!u1.fill && u2.fill || u1.fill && !u2.fill)
        return false;

    if(u1.fill.type !== u2.fill.type)
        return false
    switch(u1.fill.type)
    {
        case c_oAscFill.FILL_TYPE_BLIP:
        {
            if(u1.fill.RasterImageId && !u2.fill.RasterImageId || u2.fill.RasterImageId && !u1.fill.RasterImageId)
                return false;

            if(typeof u1.fill.RasterImageId === "string" && typeof u2.fill.RasterImageId === "string"
                && AscCommon.getFullImageSrc2(u1.fill.RasterImageId) !== AscCommon.getFullImageSrc2(u2.fill.RasterImageId))
                return false;

            if(u1.fill.VectorImageBin !== u2.fill.VectorImageBin)
                return false;

            if(u1.fill.srcRect && !u2.fill.srcRect || !u1.fill.srcRect && u2.fill.srcRect)
                return false;

            if(u1.fill.srcRect && u2.fill.srcRect)
            {
                if( u1.fill.srcRect.l !== u2.fill.srcRect.l||
                    u1.fill.srcRect.t !== u2.fill.srcRect.t||
                    u1.fill.srcRect.r !== u2.fill.srcRect.r||
                    u1.fill.srcRect.b !== u2.fill.srcRect.b)
                    return false;
            }

            if(u1.fill.stretch !== u2.fill.stretch || !CompareBlipTiles(u1.fill.tile, u2.fill.tile) || u1.fill.rotWithShape !== u2.fill.rotWithShape)
                return false;
            break;
        }
        case c_oAscFill.FILL_TYPE_SOLID:
        {
            if(u1.fill.color && u2.fill.color)
            {
                return CompareUniColor(u1.fill.color, u2.fill.color)
            }
            break;
        }
        case c_oAscFill.FILL_TYPE_GRAD:
        {
            if(u1.fill.colors.length !== u2.fill.colors.length)
                return false;
            if(isRealObject(u1.fill.path) !== isRealObject(u2.fill.path))
                return false;
            if(u1.fill.path && !u1.fill.path.IsIdentical(u2.fill.path))
                return false;

            if(isRealObject(u1.fill.lin) !== isRealObject(u2.fill.lin))
                return false;

            if(u1.fill.lin && !u1.fill.lin.IsIdentical(u2.fill.lin))
                return false;

            for(var i = 0; i < u1.fill.colors.length; ++i)
            {
                if(u1.fill.colors[i].pos !== u2.fill.colors[i].pos
                    || ! CompareUniColor(u1.fill.colors[i].color, u2.fill.colors[i].color))
                    return false;
            }
            break;
        }
        case c_oAscFill.FILL_TYPE_PATT:
        {
            if(u1.fill.ftype !== u2.fill.ftype
                || !CompareUniColor(u1.fill.fgClr, u2.fill.fgClr)
                || !CompareUniColor(u1.fill.bgClr, u2.fill.bgClr))
                return false;
            break;
        }
    }
    return true;
}


function CompareUniColor(u1, u2)
{
    if(!u1 && !u2)
        return true;
    if(!u1 && u2 || u1 && !u2)
        return false;
    if(!u1.color && u2.color || u1.color && !u2.color)
        return false;
    if(u1.color && u2.color)
    {
        if(u1.color.type !== u2.color.type)
            return false;
        switch (u1.color.type)
        {
            case c_oAscColor.COLOR_TYPE_NONE:
            {
                break;
            }
            case c_oAscColor.COLOR_TYPE_SRGB:
            {
                if(u1.color.RGBA.R !== u2.color.RGBA.R
                    || u1.color.RGBA.G !== u2.color.RGBA.G
                    || u1.color.RGBA.B !== u2.color.RGBA.B
                    || u1.color.RGBA.A !== u2.color.RGBA.A)
                {
                    return false;
                }
                break;
            }
            case c_oAscColor.COLOR_TYPE_PRST:
            case c_oAscColor.COLOR_TYPE_SCHEME:
            {
                if(u1.color.id !== u2.color.id)
                    return false;
                break;
            }
            case c_oAscColor.COLOR_TYPE_SYS:
            {
                if(u1.color.RGBA.R !== u2.color.RGBA.R
                    || u1.color.RGBA.G !== u2.color.RGBA.G
                    || u1.color.RGBA.B !== u2.color.RGBA.B
                    || u1.color.RGBA.A !== u2.color.RGBA.A
                    || u1.color.id !== u2.color.id)
                {
                    return false;
                }
                break;
            }
        }
    }
    if(!u1.Mods && u2.Mods || !u2.Mods && u1.Mods)
        return false;

    if(u1.Mods && u2.Mods)
    {
        if(u1.Mods.Mods.length !== u2.Mods.Mods.length)
            return false;
        for(var i = 0; i < u1.Mods.Mods.length; ++i)
        {
            if(u1.Mods.Mods[i].name !== u2.Mods.Mods[i].name
                || u1.Mods.Mods[i].val !== u2.Mods.Mods[i].val)
                return false;
        }
    }
    return true;
}
// -----------------------------

function CompareShapeProperties(shapeProp1, shapeProp2)
{
    var _result_shape_prop = {};
    if(shapeProp1.type === shapeProp2.type)
    {
        _result_shape_prop.type = shapeProp1.type;
    }
    else
    {
        _result_shape_prop.type = null;
    }

    if(shapeProp1.h === shapeProp2.h)
    {
        _result_shape_prop.h = shapeProp1.h;
    }
    else
    {
        _result_shape_prop.h = null;
    }

    if(shapeProp1.w === shapeProp2.w)
    {
        _result_shape_prop.w = shapeProp1.w;
    }
    else
    {
        _result_shape_prop.w = null;
    }

    if(shapeProp1.stroke == null || shapeProp2.stroke == null)
    {
        _result_shape_prop.stroke = null;
    }
    else
    {
        _result_shape_prop.stroke = shapeProp1.stroke.compare(shapeProp2.stroke)
    }

    /* if(shapeProp1.verticalTextAlign === shapeProp2.verticalTextAlign)
     {
     _result_shape_prop.verticalTextAlign = shapeProp1.verticalTextAlign;
     }
     else */
    {
        _result_shape_prop.verticalTextAlign = null;
        _result_shape_prop.vert = null;
    }

    if(shapeProp1.canChangeArrows !== true || shapeProp2.canChangeArrows !== true)
        _result_shape_prop.canChangeArrows = false;
    else
        _result_shape_prop.canChangeArrows = true;

    _result_shape_prop.fill = CompareUniFill(shapeProp1.fill, shapeProp2.fill);
    _result_shape_prop.IsLocked = shapeProp1.IsLocked === true || shapeProp2.IsLocked === true;
    if(isRealObject(shapeProp1.paddings) && isRealObject(shapeProp2.paddings))
    {
        _result_shape_prop.paddings = new Asc.asc_CPaddings();
        _result_shape_prop.paddings.Left = isRealNumber(shapeProp1.paddings.Left) ? (shapeProp1.paddings.Left === shapeProp2.paddings.Left ? shapeProp1.paddings.Left : undefined) : undefined;
        _result_shape_prop.paddings.Top = isRealNumber(shapeProp1.paddings.Top) ? (shapeProp1.paddings.Top === shapeProp2.paddings.Top ? shapeProp1.paddings.Top : undefined) : undefined;
        _result_shape_prop.paddings.Right = isRealNumber(shapeProp1.paddings.Right) ? (shapeProp1.paddings.Right === shapeProp2.paddings.Right ? shapeProp1.paddings.Right : undefined) : undefined;
        _result_shape_prop.paddings.Bottom = isRealNumber(shapeProp1.paddings.Bottom) ? (shapeProp1.paddings.Bottom === shapeProp2.paddings.Bottom ? shapeProp1.paddings.Bottom : undefined) : undefined;
    }
    _result_shape_prop.canFill = shapeProp1.canFill === true || shapeProp2.canFill === true;

    if(shapeProp1.bFromChart || shapeProp2.bFromChart)
    {
        _result_shape_prop.bFromChart = true;
    }
    else
    {
        _result_shape_prop.bFromChart = false;
    }

    if(shapeProp1.locked || shapeProp2.locked)
    {
        _result_shape_prop.locked = true;
    }
    _result_shape_prop.lockAspect = !!(shapeProp1.lockAspect && shapeProp2.lockAspect);
    _result_shape_prop.textArtProperties = CompareTextArtProperties(shapeProp1.textArtProperties, shapeProp2.textArtProperties);
    if(shapeProp1.title === shapeProp2.title){
        _result_shape_prop.title = shapeProp1.title;
    }
    if(shapeProp1.description === shapeProp2.description){
        _result_shape_prop.description = shapeProp1.description;
    }
    if(shapeProp1.columnNumber === shapeProp2.columnNumber){
        _result_shape_prop.columnNumber = shapeProp1.columnNumber;
    }
    if(shapeProp1.columnSpace === shapeProp2.columnSpace){
        _result_shape_prop.columnSpace = shapeProp1.columnSpace;
    }

    return _result_shape_prop;
}

function CompareTextArtProperties(oProps1, oProps2)
{
    if(!oProps1 || !oProps2)
        return null;
    var oRet = {Fill: undefined, Line: undefined, Form: undefined};
    if(oProps1.Form === oProps2.Form)
    {
        oRet.From = oProps1.Form;
    }
    if(oProps1.Fill && oProps2.Fill)
    {
        oRet.Fill = CompareUniFill(oProps1.Fill, oProps2.Fill);
    }
    if(oProps1.Line && oProps2.Line)
    {
        oRet.Line = oProps1.Line.compare(oProps2.Line);
    }
    return oRet;
}

// LN --------------------------
// размеры стрелок;
var lg=500,  mid=300, sm=200;
//типы стрелок
var ar_arrow=0, ar_diamond=1, ar_none=2, ar_oval=3, ar_stealth=4, ar_triangle=5;

var LineEndType = {
    None: 0,
    Arrow: 1,
    Diamond: 2,
    Oval: 3,
    Stealth: 4,
    Triangle: 5
};
var LineEndSize = {
    Large: 0,
    Mid: 1,
    Small: 2
};

function EndArrow()
{
    this.type = null;
    this.len = null;
    this.w = null;

}



var LineJoinType = {
    Empty : 0,
    Round : 1,
    Bevel : 2,
    Miter : 3
};


EndArrow.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    Refresh_RecalcData: function()
    {},

    compare: function(end_arrow)
    {
        if(end_arrow == null)
        {
            return null;
        }
        var _ret = new EndArrow();
        if(this.type === end_arrow.type)
        {
            _ret.type = this.type;
        }
        if(this.len === end_arrow.len)
        {
            _ret.len = this.len;
        }
        if(this.w === end_arrow)
        {
            _ret.w = this.w;
        }
        return _ret;
    },

    createDuplicate: function()
    {
        var duplicate =  new EndArrow();
        duplicate.type = this.type;
        duplicate.len = this.len;
        duplicate.w = this.w;
        return duplicate;
    },

    IsIdentical: function(arrow)
    {
        return arrow && arrow.type == this.type &&  arrow.len == this.len && arrow.w  == this.w;
    },

    GetWidth: function(size, _max)
    {
        var _ret = 3 * size;
        if (null != this.w)
        {
            switch (this.w)
            {
                case LineEndSize.Large:
                    _ret = 5 * size;
                case LineEndSize.Small:
                    _ret = 2 * size;
                default:
                    break;
            }
        }
        return Math.max(_ret, _max ? _max : 7);
    },
    GetLen: function(size, _max)
    {
        var _ret = 3 * size;
        if (null != this.w)
        {
            switch (this.w)
            {
                case LineEndSize.Large:
                    _ret = 5 * size;
                case LineEndSize.Small:
                    _ret = 2 * size;
                default:
                    break;
            }
        }
        return Math.max(_ret, _max ? _max : 7);
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_EndArrow;
    },

    setType: function(type)
    {
        this.type = type;
    },

    setLen: function(len)
    {
        this.len = len;
    },


    setW: function(w)
    {
        this.w = w;
    },


    Write_ToBinary: function (w)
    {
        writeLong(w, this.type);
        writeLong(w, this.len);
        writeLong(w, this.w);
    },

    Read_FromBinary: function (r)
    {
        this.type = readLong(r);
        this.len = readLong(r);
        this.w = readLong(r);
    }

};

function ConvertJoinAggType(_type)
{
    switch (_type)
    {
        case LineJoinType.Round:
            return 2;
        case LineJoinType.Bevel:
            return 1;
        case LineJoinType.Miter:
            return 0;
        default:
            break;
    }
    return 2;
}

function LineJoin()
{
    this.type = null;
    this.limit = null;
}

LineJoin.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    Refresh_RecalcData: function()
    {},


    IsIdentical : function(oJoin)
    {
        if(!oJoin)
            return false;
        if(this.type !== oJoin.type)
        {
            return false;
        }
        if(this.limit !== oJoin.limit)
            return false;
        return true;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_LineJoin;
    },

    createDuplicate: function()
    {
        var duplicate =  new LineJoin();
        duplicate.type = this.type;
        duplicate.limit = this.limit;
        return duplicate;
    },

    setType: function(type)
    {
        this.type = type;
    },

    setLimit: function(limit)
    {
        this.limit = limit;
    },

    Write_ToBinary: function(w)
    {
        writeLong(w, this.type);
        writeBool(w, this.limit);
    },

    Read_FromBinary: function(r)
    {
        this.type = readLong(r);
        this.limit = readBool(r);
    }

};

function CLn()
{
    this.Fill = null;//new CUniFill();
    this.prstDash = null;

    this.Join = null;
    this.headEnd = null;
    this.tailEnd = null;

    this.algn = null;
    this.cap = null;
    this.cmpd = null;
    this.w = null;
}


CLn.prototype =
{
    getObjectType: function()
    {
        return AscDFH.historyitem_type_Ln;
    },

    compare: function(line)
    {
        if(line == null)
        {
            return null;
        }
        var _ret = new CLn();
        if(this.Fill != null)
        {
            _ret.Fill = CompareUniFill(this.Fill, line.Fill);
        }
        if(this.prstDash === line.prstDash)
        {
            _ret.prstDash = this.prstDash;
        }
        else{
            _ret.prstDash = undefined;
        }
        if(this.Join === line.Join)
        {
            _ret.Join = this.Join;
        }
        if(this.tailEnd != null)
        {
            _ret.tailEnd = this.tailEnd.compare(line.tailEnd);
        }
        if(this.headEnd != null)
        {
            _ret.headEnd = this.headEnd.compare(line.headEnd);
        }

        if(this.algn === line.algn)
        {
            _ret.algn = this.algn;
        }
        if(this.cap === line.cap)
        {
            _ret.cap = this.cap;
        }
        if(this.cmpd === line.cmpd)
        {
            _ret.cmpd = this.cmpd;
        }
        if(this.w === line.w)
        {
            _ret.w = this.w;
        }
        return _ret;
    },

    merge:  function(ln)
    {
        if(ln == null)
        {
            return;
        }
        if(ln.Fill != null && ln.Fill.fill!= null)
        {
            this.Fill = ln.Fill.createDuplicate();
        }

        if(ln.prstDash != null)
        {
            this.prstDash = ln.prstDash;
        }

        if(ln.Join != null)
        {
            this.Join = ln.Join.createDuplicate();
        }

        if(ln.headEnd != null)
        {
            this.headEnd = ln.headEnd.createDuplicate();
        }

        if(ln.tailEnd != null)
        {
            this.tailEnd = ln.tailEnd.createDuplicate();
        }

        if(ln.algn != null)
        {
            this.algn = ln.algn;
        }

        if(ln.cap != null)
        {
            this.cap = ln.cap;
        }

        if(ln.cmpd != null)
        {
            this.cmpd = ln.cmpd;
        }

        if(ln.w != null)
        {
            this.w = ln.w;
        }
    },

    calculate: function(theme, slide, layout, master, RGBA)
    {
        if(isRealObject(this.Fill))
        {
            this.Fill.calculate(theme, slide, layout, master, RGBA);
        }
    },

    createDuplicate:  function()
    {
        var duplicate = new CLn();

        if (null != this.Fill)
        {
            duplicate.Fill = this.Fill.createDuplicate();
        }

        duplicate.prstDash = this.prstDash;
        duplicate.Join = this.Join;
        if(this.headEnd!=null)
        {
            duplicate.headEnd = this.headEnd.createDuplicate();
        }

        if(this.tailEnd!=null)
        {
            duplicate.tailEnd = this.tailEnd.createDuplicate();
        }

        duplicate.algn = this.algn;
        duplicate.cap = this.cap;
        duplicate.cmpd = this.cmpd;
        duplicate.w = this.w;
        return duplicate;
    },

    IsIdentical: function(ln)
    {
        return ln && (this.Fill == null ? ln.Fill == null : this.Fill.IsIdentical(ln.Fill) )&& (this.Join == null ? ln.Join == null : this.Join.IsIdentical(ln.Join) )
            && (this.headEnd == null ? ln.headEnd == null : this.headEnd.IsIdentical(ln.headEnd) )
            && (this.tailEnd == null ? ln.tailEnd == null : this.tailEnd.IsIdentical(ln.headEnd)) &&
            this.algn == ln.algn && this.cap == ln.cap && this.cmpd == ln.cmpd && this.w== ln.w && this.prstDash === ln.prstDash;
    },

    setFill: function(fill)
    {
        this.Fill = fill;
    },

    setPrstDash: function(prstDash)
    {
        this.prstDash = prstDash;
    },

    setJoin: function(join)
    {
        this.Join = join;
    },

    setHeadEnd: function(headEnd)
    {
        this.headEnd = headEnd;
    },

    setTailEnd: function(tailEnd)
    {
        this.tailEnd = tailEnd;
    },

    setAlgn: function(algn)
    {
        this.algn = algn;
    },

    setCap: function(cap)
    {
        this.cap = cap;
    },

    setCmpd: function(cmpd)
    {
        this.cmpd = cmpd;
    },
    setW: function(w)
    {
        this.w = w;
    },

    Write_ToBinary: function(w)
    {
        w.WriteBool(isRealObject(this.Fill));
        if(isRealObject(this.Fill))
        {
            this.Fill.Write_ToBinary(w);
        }
        writeLong(w, this.prstDash);

        w.WriteBool(isRealObject(this.Join));
        if(isRealObject(this.Join))
        {
            this.Join.Write_ToBinary(w);
        }

        w.WriteBool(isRealObject(this.headEnd));
        if(isRealObject(this.headEnd))
        {
            this.headEnd.Write_ToBinary(w);
        }
        w.WriteBool(isRealObject(this.tailEnd));
        if(isRealObject(this.tailEnd))
        {
            this.tailEnd.Write_ToBinary(w);
        }
        writeLong(w, this.algn);
        writeLong(w, this.cap);
        writeLong(w, this.cmpd);
        writeLong(w, this.w);
    },

    Read_FromBinary: function(r)
    {
        if(r.GetBool())
        {
            this.Fill = new CUniFill();
            this.Fill.Read_FromBinary(r);
        }
        else
        {
            this.Fill = null;
        }
        this.prstDash = readLong(r);

        if(r.GetBool())
        {
            this.Join = new LineJoin();
            this.Join.Read_FromBinary(r);
        }

        if(r.GetBool())
        {
            this.headEnd = new EndArrow();
            this.headEnd.Read_FromBinary(r);
        }
        if(r.GetBool())
        {
            this.tailEnd = new EndArrow();
            this.tailEnd.Read_FromBinary(r);
        }
        this.algn = readLong(r);
        this.cap  = readLong(r);
        this.cmpd = readLong(r);
        this.w    = readLong(r);
    }
};

// -----------------------------

// SHAPE ----------------------------

function DefaultShapeDefinition()
{
    this.spPr = new CSpPr();
    this.bodyPr = new CBodyPr();
    this.lstStyle = new TextListStyle();
    this.style = null;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

DefaultShapeDefinition.prototype=
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},
    getObjectType: function()
    {
        return AscDFH.historyitem_type_DefaultShapeDefinition;
    },

    setSpPr: function(spPr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DefaultShapeDefinition_SetSpPr, this.spPr, spPr));
        this.spPr = spPr;
    },

    setBodyPr: function(bodyPr)
    {
        History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_DefaultShapeDefinition_SetBodyPr, this.bodyPr, bodyPr));
        this.bodyPr = bodyPr;
    },

    setLstStyle: function(lstStyle)
    {
        History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_DefaultShapeDefinition_SetLstStyle, this.lstStyle, lstStyle));
        this.lstStyle = lstStyle;
    },

    setStyle: function(style)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_DefaultShapeDefinition_SetStyle, this.style, style));
        this.style = style;
    }
};

function CNvPr()
{
    this.id = 0;
    this.name = "";
    this.isHidden = false;
    this.descr = null;
    this.title = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id)
}


CNvPr.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return AscDFH.historyitem_type_CNvPr;
    },

    createDuplicate: function()
    {
        var duplicate = new CNvPr();
        duplicate.setId(this.id);
        duplicate.setName(this.name);
        duplicate.setIsHidden(this.isHidden);
        duplicate.setDescr(this.descr);
        duplicate.setTitle(this.title);
        return duplicate;
    },

    setId: function(id)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_CNvPr_SetId, this.id, id));
        this.id = id;
    },

    setName: function(name)
    {
        History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_CNvPr_SetName, this.name, name));
        this.name = name;
    },

    setIsHidden: function(isHidden)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_CNvPr_SetIsHidden, this.isHidden, isHidden));
        this.isHidden = isHidden;
    },

    setDescr: function(descr)
    {
        History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_CNvPr_SetDescr , this.descr,  descr));
        this.descr = descr;
    },

    setTitle: function(title)
    {
        History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_CNvPr_SetTitle, this.title,  title));
        this.title = title;
    },

    setFromOther: function(oOther){
        if(!oOther){
            return;
        }
        if(oOther.name){
            this.setName(oOther.name);
        }
        if(oOther.descr){
            this.setDescr(oOther.descr);
        }
        if(oOther.title){
            this.setTitle(oOther.title);
        }
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    }
};

function NvPr()
{
    this.isPhoto = false;
    this.userDrawn = false;
    this.ph = null;


    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

NvPr.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},
    getObjectType: function()
    {
        return AscDFH.historyitem_type_NvPr;
    },

    setIsPhoto: function(isPhoto)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_NvPr_SetIsPhoto, this.isPhoto, isPhoto));
        this.isPhoto = isPhoto;
    },

    setUserDrawn: function(userDrawn)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_NvPr_SetUserDrawn, this.userDrawn, userDrawn));
        this.userDrawn = userDrawn;
    },

    setPh: function(ph)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_NvPr_SetPh, this.ph, ph));
        this.ph = ph;
    },


    createDuplicate: function()
    {
        var duplicate = new NvPr();
        duplicate.setIsPhoto(this.isPhoto);
        duplicate.setUserDrawn(this.userDrawn);
        if(this.ph != null)
        {
            duplicate.setPh(this.ph.createDuplicate());
        }
        return duplicate;
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    }
};

var szPh_full    = 0,
    szPh_half    = 1,
    szPh_quarter = 2;

var orientPh_horz = 0,
    orientPh_vert = 1;

function Ph()
{
    this.hasCustomPrompt = false;
    this.idx = null;
    this.orient = null;
    this.sz = null;
    this.type = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

Ph.prototype =
{
    createDuplicate:  function()
    {
        var duplicate = new Ph();
        duplicate.setHasCustomPrompt(this.hasCustomPrompt);
        duplicate.setIdx(this.idx);
        duplicate.setOrient(this.orient);
        duplicate.setSz(this.sz);
        duplicate.setType(this.type);
        return duplicate;
    },

    Get_Id: function()
    {
        return this.Id;
    },
    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return AscDFH.historyitem_type_Ph;
    },

    setHasCustomPrompt: function(hasCustomPrompt)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_Ph_SetHasCustomPrompt, this.hasCustomPrompt, hasCustomPrompt));
        this.hasCustomPrompt = hasCustomPrompt;
    },

    setIdx: function(idx)
    {
        History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Ph_SetIdx, this.idx, idx));
        this.idx = idx;
    },

    setOrient: function(orient)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_Ph_SetOrient, this.orient, orient));
        this.orient = orient;
    },

    setSz: function(sz)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_Ph_SetSz, this.sz, sz));
        this.sz = sz;
    },

    setType: function(type)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_Ph_SetType, this.type, type));
        this.type = type;
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    }
};



function CNvUniSpPr()
{
    this.locks = null;

    this.stCnxIdx = null;
    this.stCnxId  = null;

    this.endCnxIdx = null;
    this.endCnxId  = null;
}

    CNvUniSpPr.prototype.Write_ToBinary = function(w){
        if(AscFormat.isRealNumber(this.locks)){
            w.WriteBool(true);
            w.WriteLong(this.locks);
        }
        else {
            w.WriteBool(false);
        }
        w.WriteLong(this.locks);
        if(AscFormat.isRealNumber(this.stCnxIdx) && AscFormat.isRealNumber(this.stCnxId)){
            w.WriteBool(true);
            w.WriteLong(this.stCnxIdx);
            w.WriteLong(this.stCnxId);
        }
        else {
            w.WriteBool(false);
        }
        if(AscFormat.isRealNumber(this.endCnxIdx) && AscFormat.isRealNumber(this.endCnxId)){
            w.WriteBool(true);
            w.WriteLong(this.endCnxIdx);
            w.WriteLong(this.endCnxId);
        }
        else {
            w.WriteBool(false);
        }
    };
    CNvUniSpPr.prototype.Read_FromBinary = function(r){
        var bCnx = r.GetBool();
        if(bCnx){
            this.locks = r.GetLong();
        }
        else{
            this.locks = null;
        }
        bCnx = r.GetBool();
        if(bCnx){
            this.stCnxIdx = r.GetLong();
            this.stCnxId = r.GetLong();
        }
        else{
            this.stCnxIdx = null;
            this.stCnxId =  null;
        }
        bCnx = r.GetBool();
        if(bCnx){
            this.endCnxIdx = r.GetLong();
            this.endCnxId = r.GetLong();
        }
        else{
            this.endCnxIdx = null;
            this.endCnxId =  null;
        }
    };

function UniNvPr()
{
    this.cNvPr = new CNvPr();
    this.UniPr = null;
    this.nvPr = new NvPr();
    this.nvUniSpPr = new CNvUniSpPr();
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);

}

UniNvPr.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return AscDFH.historyitem_type_UniNvPr;
    },

    setCNvPr: function(cNvPr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_UniNvPr_SetCNvPr, this.cNvPr, cNvPr));
        this.cNvPr = cNvPr;
    },

    setUniSpPr: function(pr){
        History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_UniNvPr_SetUniSpPr, this.UniPr, pr));
        this.nvUniSpPr = pr;
    },

    setUniPr: function(uniPr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_UniNvPr_SetUniPr, this.UniPr, uniPr));
        this.UniPr = uniPr;
    },

    setNvPr: function(nvPr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_UniNvPr_SetNvPr, this.nvPr, nvPr));
        this.nvPr = nvPr;
    },


    createDuplicate: function()
    {
        var duplicate = new UniNvPr();
        this.cNvPr && duplicate.setCNvPr(this.cNvPr.createDuplicate());
        duplicate.nvPr && duplicate.setNvPr(this.nvPr.createDuplicate());
        return duplicate;
    },


    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
        writeObject(w, this.cNvPr);
        writeObject(w, this.nvPr);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
        this.cNvPr = readObject(r);
        this.nvPr  = readObject(r);
    }
};

function StyleRef()
{
    this.idx = 0;
    this.Color = new CUniColor();
}

StyleRef.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    isIdentical: function(styleRef)
    {
        if(styleRef == null)
        {
            return false;
        }
        if(this.idx !== styleRef.idx)
        {
            return false;
        }

        if(this.Color.IsIdentical(styleRef.Color) == false)
        {
            return false;
        }

        return true;
    },

    getObjectType: function()
    {
        return  AscDFH.historyitem_type_StyleRef;
    },

    setIdx: function(idx)
    {
        this.idx= idx;
    },

    setColor: function(color)
    {
        this.Color = color;
    },

    createDuplicate: function()
    {
        var duplicate  = new StyleRef();
        duplicate.setIdx(this.idx);
        if(this.Color)
            duplicate.setColor(this.Color.createDuplicate());
        return duplicate;
    },

    Refresh_RecalcData: function()
    {},

    Write_ToBinary: function (w)
    {
        writeLong(w, this.idx);
        w.WriteBool(isRealObject(this.Color));
        if(isRealObject(this.Color))
        {
            this.Color.Write_ToBinary(w);
        }
    },

    Read_FromBinary: function (r)
    {
        this.idx = readLong(r);
        if(r.GetBool())
        {
            this.Color = new CUniColor();
            this.Color.Read_FromBinary(r);
        }
    }
};

function FontRef()
{
    this.idx = AscFormat.fntStyleInd_none;
    this.Color = null;
}

FontRef.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    Refresh_RecalcData: function()
    {},

    setIdx: function(idx)
    {
        this.idx = idx;
    },

    setColor: function(color)
    {
        this.Color = color;
    },

    createDuplicate: function()
    {
        var duplicate  = new FontRef();
        duplicate.setIdx(this.idx);
        if(this.Color)
            duplicate.setColor(this.Color.createDuplicate());
        return duplicate;
    },

    Write_ToBinary: function (w)
    {
        writeLong(w, this.idx);
        w.WriteBool(isRealObject(this.Color));
        if(isRealObject(this.Color))
        {
            this.Color.Write_ToBinary(w);
        }
    },

    Read_FromBinary: function (r)
    {
        this.idx = readLong(r);
        if(r.GetBool())
        {
            this.Color = new CUniColor();
            this.Color.Read_FromBinary(r);
        }
    }
};

function CShapeStyle()
{
    this.lnRef = null;
    this.fillRef = null;
    this.effectRef = null;
    this.fontRef = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CShapeStyle.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    merge: function(style)
    {
        if(style!=null)
        {
            if(style.lnRef != null)
            {
                this.lnRef = style.lnRef.createDuplicate();
            }

            if(style.fillRef != null)
            {
                this.fillRef = style.fillRef.createDuplicate();
            }

            if(style.effectRef != null)
            {
                this.effectRef = style.effectRef.createDuplicate();
            }

            if(style.fontRef != null)
            {
                this.fontRef = style.fontRef.createDuplicate();
            }
        }
    },

    createDuplicate:  function()
    {
        var duplicate = new CShapeStyle();
        if(this.lnRef!=null)
        {
            duplicate.setLnRef(this.lnRef.createDuplicate());
        }
        if(this.fillRef!=null)
        {
            duplicate.setFillRef(this.fillRef.createDuplicate());
        }
        if(this.effectRef!=null)
        {
            duplicate.setEffectRef(this.effectRef.createDuplicate());
        }
        if(this.fontRef!=null)
        {
            duplicate.setFontRef(this.fontRef.createDuplicate());
        }
        return duplicate;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_ShapeStyle;
    },

    setLnRef: function(pr)
    {
        History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_ShapeStyle_SetLnRef, this.lnRef,  pr));
        this.lnRef = pr;
    },
    setFillRef: function(pr)
    {
        History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_ShapeStyle_SetFillRef, this.fillRef,  pr));
        this.fillRef = pr;
    },
    setFontRef: function(pr)
    {
        History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_ShapeStyle_SetFontRef, this.fontRef,  pr));
        this.fontRef = pr;
    },

    setEffectRef: function(pr)
    {
        History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_ShapeStyle_SetEffectRef, this.effectRef,  pr));
        this.effectRef = pr;
    }
};

var LINE_PRESETS_MAP = {};

LINE_PRESETS_MAP["line"] = true;
LINE_PRESETS_MAP["bracePair"] = true;
LINE_PRESETS_MAP["leftBrace"] = true;
LINE_PRESETS_MAP["rightBrace"] = true;
LINE_PRESETS_MAP["bracketPair"] = true;
LINE_PRESETS_MAP["leftBracket"] = true;
LINE_PRESETS_MAP["rightBracket"] = true;
LINE_PRESETS_MAP["bentConnector2"] = true;
LINE_PRESETS_MAP["bentConnector3"] = true;
LINE_PRESETS_MAP["bentConnector4"] = true;
LINE_PRESETS_MAP["bentConnector5"] = true;
LINE_PRESETS_MAP["curvedConnector2"] = true;
LINE_PRESETS_MAP["curvedConnector3"] = true;
LINE_PRESETS_MAP["curvedConnector4"] = true;
LINE_PRESETS_MAP["curvedConnector5"] = true;
LINE_PRESETS_MAP["straightConnector1"] = true;
LINE_PRESETS_MAP["arc"] = true;

function CreateDefaultShapeStyle(preset)
{

    var b_line = typeof preset === "string" && LINE_PRESETS_MAP[preset];
    var tx_color = b_line;
    var unicolor;
    var style = new CShapeStyle();
    var lnRef = new StyleRef();
    lnRef.setIdx(b_line ? 1 : 2);

    unicolor = new CUniColor();
    unicolor.setColor(new CSchemeColor());
    unicolor.color.setId(g_clr_accent1);
    var mod = new CColorMod();
    mod.setName("shade");
    mod.setVal(50000);
    unicolor.setMods(new CColorModifiers());
    unicolor.Mods.addMod(mod);
    lnRef.setColor(unicolor);

    style.setLnRef(lnRef);


    var fillRef = new StyleRef();
    unicolor = new CUniColor();
    unicolor.setColor(new CSchemeColor());
    unicolor.color.setId(g_clr_accent1);
    fillRef.setIdx(b_line ? 0 : 1);
    fillRef.setColor(unicolor);
    style.setFillRef(fillRef);



    var effectRef = new StyleRef();
    unicolor = new CUniColor();
    unicolor.setColor(new CSchemeColor());
    unicolor.color.setId(g_clr_accent1);
    effectRef.setIdx(0);
    effectRef.setColor(unicolor);
    style.setEffectRef(effectRef);

    var fontRef = new FontRef();
    unicolor = new CUniColor();
    unicolor.setColor(new CSchemeColor());
    unicolor.color.setId(tx_color ? 15 : 12);
    fontRef.setIdx(AscFormat.fntStyleInd_minor);
    fontRef.setColor(unicolor);
    style.setFontRef(fontRef);
    return style;
}




function CXfrm()
{
    this.offX   = null;
    this.offY   = null;
    this.extX   = null;
    this.extY   = null;
    this.chOffX = null;
    this.chOffY = null;
    this.chExtX = null;
    this.chExtY = null;

    this.flipH  = null;
    this.flipV  = null;
    this.rot    = null;

    this.parent = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CXfrm.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_Xfrm;
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },


    isNotNull: function()
    {
        return isRealNumber(this.offX) && isRealNumber(this.offY) && isRealNumber(this.extX) && isRealNumber(this.extY);
    },


    isNotNullForGroup: function()
    {
        return isRealNumber(this.offX) && isRealNumber(this.offY)
            && isRealNumber(this.chOffX) && isRealNumber(this.chOffY)
            && isRealNumber(this.extX) && isRealNumber(this.extY)
            && isRealNumber(this.chExtX) && isRealNumber(this.chExtY);
    },

    isEqual: function(xfrm)
    {

        return xfrm && this.offX == xfrm.offX && this.offY == xfrm.offY && this.extX == xfrm.extX &&
            this.extY == xfrm.extY && this.chOffX == xfrm.chOffX && this.chOffY == xfrm.chOffY && this.chExtX == xfrm.chExtX &&
            this.chExtY == xfrm.chExtY ;
    },

    merge: function(xfrm)
    {
        if(xfrm.offX != null)
        {
            this.offX = xfrm.offX;
        }
        if(xfrm.offY != null)
        {
            this.offY = xfrm.offY;
        }


        if(xfrm.extX != null)
        {
            this.extX = xfrm.extX;
        }
        if(xfrm.extY != null)
        {
            this.extY = xfrm.extY;
        }


        if(xfrm.chOffX != null)
        {
            this.chOffX = xfrm.chOffX;
        }
        if(xfrm.chOffY != null)
        {
            this.chOffY = xfrm.chOffY;
        }


        if(xfrm.chExtX != null)
        {
            this.chExtX = xfrm.chExtX;
        }
        if(xfrm.chExtY != null)
        {
            this.chExtY = xfrm.chExtY;
        }


        if(xfrm.flipH != null)
        {
            this.flipH = xfrm.flipH;
        }
        if(xfrm.flipV != null)
        {
            this.flipV = xfrm.flipV;
        }

        if(xfrm.rot != null)
        {
            this.rot = xfrm.rot;
        }
    },

    createDuplicate: function()
    {
        var duplicate = new CXfrm();
        duplicate.setOffX(this.offX);
        duplicate.setOffY(this.offY);
        duplicate.setExtX(this.extX);
        duplicate.setExtY(this.extY);
        duplicate.setChOffX(this.chOffX);
        duplicate.setChOffY(this.chOffY);
        duplicate.setChExtX(this.chExtX);
        duplicate.setChExtY(this.chExtY);

        duplicate.setFlipH(this.flipH);
        duplicate.setFlipV(this.flipV);
        duplicate.setRot(this.rot);
        return duplicate;
    },

    checkFromSerialize: function()
    {
        if(this.parent && this.parent.checkFromSerialize)
        {
            this.parent.checkFromSerialize();
        }
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_Xfrm_SetParent, this.parent,  pr));
        this.parent = pr;
    },

    setOffX: function(pr)
    {
        this.checkFromSerialize();
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_Xfrm_SetOffX, this.offX,  pr));
        this.offX = pr;
        this.handleUpdatePosition();
    },
    setOffY: function(pr)
    {
        this.checkFromSerialize();
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_Xfrm_SetOffY, this.offY,  pr));
        this.offY = pr;
        this.handleUpdatePosition();
    },
    setExtX: function(pr)
    {
        this.checkFromSerialize();
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_Xfrm_SetExtX, this.extX,  pr));
        this.extX = pr;
        this.handleUpdateExtents();
    },
    setExtY: function(pr)
    {
        this.checkFromSerialize();
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_Xfrm_SetExtY, this.extY,  pr));
        this.extY = pr;
        this.handleUpdateExtents();
    },
    setChOffX: function(pr)
    {
        this.checkFromSerialize();
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_Xfrm_SetChOffX, this.chOffX,  pr));
        this.chOffX = pr;
        this.handleUpdateChildOffset();
    },
    setChOffY: function(pr)
    {
        this.checkFromSerialize();
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_Xfrm_SetChOffY, this.chOffY,  pr));
        this.chOffY = pr;
        this.handleUpdateChildOffset();
    },
    setChExtX: function(pr)
    {
        this.checkFromSerialize();
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_Xfrm_SetChExtX, this.chExtX,  pr));
        this.chExtX = pr;
        this.handleUpdateChildExtents();
    },
    setChExtY: function(pr)
    {
        this.checkFromSerialize();
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_Xfrm_SetChExtY, this.chExtY,  pr));
        this.chExtY = pr;
        this.handleUpdateChildExtents();
    },
    setFlipH: function(pr)
    {
        this.checkFromSerialize();
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_Xfrm_SetFlipH, this.flipH,  pr));
        this.flipH = pr;
        this.handleUpdateFlip();
    },
    setFlipV: function(pr)
    {
        this.checkFromSerialize();
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_Xfrm_SetFlipV, this.flipV,  pr));
        this.flipV = pr;
        this.handleUpdateFlip();
    },
    setRot: function(pr)
    {
        this.checkFromSerialize();
        History.Add(new CChangesDrawingsDouble(this, AscDFH.historyitem_Xfrm_SetRot, this.rot,  pr));
        this.rot = pr;
        this.handleUpdateRot();
    },

    handleUpdatePosition: function()
    {
        if(this.parent && this.parent.handleUpdatePosition)
        {
            this.parent.handleUpdatePosition();
        }
    },

    handleUpdateExtents: function()
    {
        if(this.parent && this.parent.handleUpdateExtents)
        {
            this.parent.handleUpdateExtents();
        }
    },

    handleUpdateChildOffset: function()
    {
        if(this.parent && this.parent.handleUpdateChildOffset)
        {
            this.parent.handleUpdateChildOffset();
        }
    },

    handleUpdateChildExtents: function()
    {
        if(this.parent && this.parent.handleUpdateChildExtents)
        {
            this.parent.handleUpdateChildExtents();
        }
    },

    handleUpdateFlip: function()
    {
        if(this.parent && this.parent.handleUpdateFlip)
        {
            this.parent.handleUpdateFlip();
        }
    },

    handleUpdateRot: function()
    {
        if(this.parent && this.parent.handleUpdateRot)
        {
            this.parent.handleUpdateRot();
        }
    },


    Refresh_RecalcData: function(data)
    {
        switch (data.Type)
        {
            case AscDFH.historyitem_Xfrm_SetOffX:
            {
                this.handleUpdatePosition();
                break;
            }
            case AscDFH.historyitem_Xfrm_SetOffY:
            {
                this.handleUpdatePosition();
                break;
            }
            case AscDFH.historyitem_Xfrm_SetExtX:
            {
                this.handleUpdateExtents();
                break;
            }
            case AscDFH.historyitem_Xfrm_SetExtY:
            {
                this.handleUpdateExtents();
                break;
            }
            case AscDFH.historyitem_Xfrm_SetChOffX:
            {
                this.handleUpdateChildOffset();
                break;
            }
            case AscDFH.historyitem_Xfrm_SetChOffY:
            {
                this.handleUpdateChildOffset();
                break;
            }
            case AscDFH.historyitem_Xfrm_SetChExtX:
            {
                this.handleUpdateChildExtents();
                break;
            }
            case AscDFH.historyitem_Xfrm_SetChExtY:
            {
                this.handleUpdateChildExtents();
                break;
            }
            case AscDFH.historyitem_Xfrm_SetFlipH:
            {
                this.handleUpdateFlip();
                break;
            }
            case AscDFH.historyitem_Xfrm_SetFlipV:
            {
                this.handleUpdateFlip();
                break;
            }
            case AscDFH.historyitem_Xfrm_SetRot:
            {
                this.handleUpdateRot();
                break;
            }
        }
    }
};

function CSpPr()
{
    this.bwMode    = 0;

    this.xfrm       = null;
    this.geometry   = null;
    this.Fill       = null;
    this.ln         = null;
    this.parent     = null;


    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CSpPr.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function(data)
    {
        switch(data.Type)
        {
            case AscDFH.historyitem_SpPr_SetParent:
            {
                break;
            }
            case AscDFH.historyitem_SpPr_SetBwMode:
            {
                break;
            }
            case AscDFH.historyitem_SpPr_SetXfrm:
            {
                break;
            }
            case AscDFH.historyitem_SpPr_SetGeometry:
            {
                this.handleUpdateGeometry();
                break;
            }
            case AscDFH.historyitem_SpPr_SetFill:
            {
                this.handleUpdateFill();
                break;
            }
            case AscDFH.historyitem_SpPr_SetLn:
            {
                this.handleUpdateLn();
                break;
            }
        }
    },

    Refresh_RecalcData2: function(data)
    {
    },

    createDuplicate: function()
    {
        var duplicate = new CSpPr();
        duplicate.setBwMode(this.bwMode);
        if(this.xfrm)
        {
            duplicate.setXfrm(this.xfrm.createDuplicate());
            duplicate.xfrm.setParent(duplicate);
        }
        if(this.geometry!=null)
        {
            duplicate.setGeometry(this.geometry.createDuplicate());
        }
        if(this.Fill!=null)
        {
            duplicate.setFill(this.Fill.createDuplicate());
        }
        if(this.ln!=null)
        {
            duplicate.setLn(this.ln.createDuplicate());
        }
        return duplicate;
    },

    checkUniFillRasterImageId: function(unifill)
    {
        if(unifill && unifill.fill && typeof unifill.fill.RasterImageId === "string" && unifill.fill.RasterImageId.length > 0)
            return unifill.fill.RasterImageId;
        return null;
    },

    checkBlipFillRasterImage: function(images)
    {
        var fill_image_id = this.checkUniFillRasterImageId(this.Fill);
        if(fill_image_id !== null)
            images.push(fill_image_id);
        if(this.ln)
        {
            var line_image_id = this.checkUniFillRasterImageId(this.ln.Fill);
            if(line_image_id)
                images.push(line_image_id);
        }
    },

    merge: function(spPr)
    {
        /*if(spPr.xfrm != null)
         {
         this.xfrm.merge(spPr.xfrm);
         }  */
        if(spPr.geometry!=null)
        {
            this.geometry = spPr.geometry.createDuplicate();
        }

        if(spPr.Fill!=null && spPr.Fill.fill!=null)
        {
            //this.Fill = spPr.Fill.createDuplicate();
        }

        /*if(spPr.ln!=null)
         {
         if(this.ln == null)
         this.ln = new CLn();
         this.ln.merge(spPr.ln);
         }  */
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_SpPr;
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    checkFromSerialize: function()
    {
        if(this.parent && this.parent.deleteBFromSerialize)
        {
            this.parent.deleteBFromSerialize();
        }
    },

    setParent: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_SpPr_SetParent, this.parent,  pr));
        this.parent = pr;
    },

    setBwMode: function(pr)
    {
        History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_SpPr_SetBwMode, this.bwMode,  pr));
        this.bwMode = pr;
    },

    setXfrm: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_SpPr_SetXfrm, this.xfrm,  pr));
        this.xfrm = pr;
    },

    setGeometry: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_SpPr_SetGeometry, this.geometry,  pr));
        this.geometry = pr;
        if(this.geometry){
            this.geometry.setParent(this);
        }
        this.handleUpdateGeometry();
    },

    setFill: function(pr)
    {
        History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_SpPr_SetFill, this.Fill,  pr));
        this.Fill = pr;
        if(this.parent && this.parent.handleUpdateFill)
        {
            this.parent.handleUpdateFill();
        }
    },

    setLn: function(pr)
    {
        History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_SpPr_SetLn, this.ln,  pr));
        this.ln = pr;
        if(this.parent && this.parent.handleUpdateLn)
        {
            this.parent.handleUpdateLn();
        }
    },

    handleUpdatePosition: function()
    {
        if(this.parent && this.parent.handleUpdatePosition)
        {
            this.parent.handleUpdatePosition();
        }
    },

    handleUpdateExtents: function()
    {
        if(this.parent && this.parent.handleUpdateExtents)
        {
            this.parent.handleUpdateExtents();
        }
    },

    handleUpdateChildOffset: function()
    {
        if(this.parent && this.parent.handleUpdateChildOffset)
        {
            this.parent.handleUpdateChildOffset();
        }
    },

    handleUpdateChildExtents: function()
    {
        if(this.parent && this.parent.handleUpdateChildExtents)
        {
            this.parent.handleUpdateChildExtents();
        }
    },

    handleUpdateFlip: function()
    {
        if(this.parent && this.parent.handleUpdateFlip)
        {
            this.parent.handleUpdateFlip();
        }
    },

    handleUpdateRot: function()
    {
        if(this.parent && this.parent.handleUpdateRot)
        {
            this.parent.handleUpdateRot();
        }
    },


    handleUpdateGeometry: function()
    {
        if(this.parent && this.parent.handleUpdateGeometry)
        {
            this.parent.handleUpdateGeometry();
        }
    },

    handleUpdateFill: function()
    {
        if(this.parent && this.parent.handleUpdateFill)
        {
            this.parent.handleUpdateFill();
        }
    },
    handleUpdateLn: function()
    {
        if(this.parent && this.parent.handleUpdateLn)
        {
            this.parent.handleUpdateLn();
        }
    }
};
// ----------------------------------

// THEME ----------------------------

var g_clr_MIN = 0;
var g_clr_accent1 = 0;
var g_clr_accent2 = 1;
var g_clr_accent3 = 2;
var g_clr_accent4 = 3;
var g_clr_accent5 = 4;
var g_clr_accent6 = 5;
var g_clr_dk1 = 6;
var g_clr_dk2 = 7;
var g_clr_folHlink = 8;
var g_clr_hlink = 9;
var g_clr_lt1 = 10;
var g_clr_lt2 = 11;
var g_clr_MAX = 11;

var g_clr_bg1 = g_clr_lt1;
var g_clr_bg2 = g_clr_lt2;
var g_clr_tx1 = g_clr_dk1;
var g_clr_tx2 = g_clr_dk2;

var phClr   = 14;
var tx1     = 15;
var tx2     = 16;

function ClrScheme()
{
    this.name = "";
    this.colors = [];

    for (var i = g_clr_MIN; i <= g_clr_MAX; i++)
        this.colors[i] = null;

}

ClrScheme.prototype =
{
    isIdentical: function(clrScheme)
    {
        if(clrScheme == null)
        {
            return false;
        }
        if(!(clrScheme instanceof ClrScheme) )
        {
            return false;
        }
        if(clrScheme.name != this.name)
        {
            return false;
        }
        for(var _clr_index = g_clr_MIN; _clr_index <= g_clr_MAX; ++_clr_index)
        {
            if(this.colors[_clr_index] != clrScheme.colors[_clr_index])
            {
                return false;
            }
        }
        return true;
    },

    createDuplicate: function()
    {
        var _duplicate = new ClrScheme();
        _duplicate.name = this.name;
        for(var _clr_index = 0; _clr_index <= this.colors.length; ++_clr_index)
        {
            _duplicate.colors[_clr_index] = this.colors[_clr_index];
        }
        return _duplicate;
    },

    Write_ToBinary: function (w)
    {
        w.WriteLong(this.colors.length);
        w.WriteString2(this.name);
        for(var i = 0; i < this.colors.length; ++i)
        {
            w.WriteBool(isRealObject(this.colors[i]));
            if(isRealObject(this.colors[i]))
            {
                this.colors[i].Write_ToBinary(w);
            }
        }

    },

    Read_FromBinary: function (r)
    {
        var len = r.GetLong();
        this.name = r.GetString2();
        for(var i = 0; i < len; ++i)
        {
            if(r.GetBool())
            {
                this.colors[i] = new CUniColor();
                this.colors[i].Read_FromBinary(r);
            }
            else
            {
                this.colors[i] = null;
            }
        }

    },

    setName: function(name)
    {
        this.name = name;
    },

    addColor: function(index, color)
    {
        this.colors[index] = color;
    }
};

function ClrMap()
{
    this.color_map = [];

    for (var i = g_clr_MIN; i <= g_clr_MAX; i++)
        this.color_map[i] = null;


    if (g_oTableId.checkInit())
    {
        this.Id = g_oIdCounter.Get_NewId();
        g_oTableId.Add(this, this.Id);
    }

}

ClrMap.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    createDuplicate:  function()
    {
        var _copy = new ClrMap();
        for(var _color_index = g_clr_MIN; _color_index <= this.color_map.length; ++_color_index)
        {
            _copy.color_map[_color_index] = this.color_map[_color_index];
        }
        return _copy;
    },

    compare: function(other)
    {
        if(!other)
            return false;
        for(var i = g_clr_MIN; i < this.color_map.length; ++i)
        {
            if(this.color_map[i] !== other.color_map[i])
            {
                return false;
            }
        }
        return true;
    },


    getObjectType: function()
    {
        return AscDFH.historyitem_type_ClrMap;
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    },

    setClr: function(index, clr)
    {
        History.Add(new CChangesDrawingsContentLongMap(this, AscDFH.historyitem_ClrMap_SetClr, index, [clr], true));
        this.color_map[index] = clr;
    }
};
function ExtraClrScheme()
{
    this.clrScheme = null;
    this.clrMap = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

ExtraClrScheme.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return AscDFH.historyitem_type_ExtraClrScheme;
    },

    setClrScheme: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ExtraClrScheme_SetClrScheme, this.clrScheme,  pr));
        this.clrScheme = pr;
    },

    setClrMap: function(pr)
    {
        History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_ExtraClrScheme_SetClrMap, this.clrMap,  pr));
        this.clrMap = pr;
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    }
};

function FontCollection(fontScheme)
{

    this.latin = null;
    this.ea   = null;
    this.cs   = null;
    if(fontScheme)
    {
        this.setFontScheme(fontScheme);
    }
}

FontCollection.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    setFontScheme: function(fontScheme)
    {
        this.fontScheme = fontScheme;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_FontCollection;
    },


    setLatin: function(pr)
    {
        this.latin = pr;
        if(this.fontScheme)
            this.fontScheme.checkFromFontCollection(pr, this, FONT_REGION_LT);
    },

    setEA: function(pr)
    {
        this.ea = pr;
        if(this.fontScheme)
            this.fontScheme.checkFromFontCollection(pr, this, FONT_REGION_EA);
    },

    setCS: function(pr)
    {
        this.cs = pr;
        if(this.fontScheme)
            this.fontScheme.checkFromFontCollection(pr, this, FONT_REGION_CS);
    },


    Write_ToBinary: function (w)
    {
        writeString(w, this.latin);
        writeString(w, this.ea   );
        writeString(w, this.cs   );
    },

    Read_FromBinary: function (r)
    {
        this.latin = readString(r);
        this.ea = readString(r);
        this.cs = readString(r);

        if(this.fontScheme)
        {
            this.fontScheme.checkFromFontCollection(this.latin, this, FONT_REGION_LT);
            this.fontScheme.checkFromFontCollection(this.ea, this, FONT_REGION_EA);
            this.fontScheme.checkFromFontCollection(this.cs, this, FONT_REGION_CS);
        }
    }
};

function FontScheme()
{
    this.name = "";

    this.majorFont = new FontCollection(this);
    this.minorFont = new FontCollection(this);
    this.fontMap = {
        "+mj-lt": undefined,
        "+mj-ea": undefined,
        "+mj-cs": undefined,
        "+mn-lt": undefined,
        "+mn-ea": undefined,
        "+mn-cs": undefined
    };
}

var FONT_REGION_LT = 0x00;
var FONT_REGION_EA = 0x01;
var FONT_REGION_CS = 0x02;

FontScheme.prototype =
{
    createDuplicate: function()
    {
        var oCopy = new FontScheme();
        oCopy.majorFont.latin = this.majorFont.latin;
        oCopy.majorFont.ea = this.majorFont.ea;
        oCopy.majorFont.cs = this.majorFont.cs;

        oCopy.minorFont.latin = this.minorFont.latin;
        oCopy.minorFont.ea = this.minorFont.ea;
        oCopy.minorFont.cs = this.minorFont.cs;
        return oCopy;
    },

    Refresh_RecalcData: function()
    {},

    Write_ToBinary: function (w)
    {
        this.majorFont.Write_ToBinary(w);
        this.minorFont.Write_ToBinary(w);
    },

    Read_FromBinary: function (r)
    {
        this.majorFont.Read_FromBinary(r);
        this.minorFont.Read_FromBinary(r);
    },

    checkFromFontCollection: function(font, fontCollection, region)
    {
        if(fontCollection === this.majorFont)
        {
            switch (region)
            {
                case FONT_REGION_LT:
                {
                    this.fontMap["+mj-lt"] = font;
                    break;
                }
                case FONT_REGION_EA:
                {
                    this.fontMap["+mj-ea"] = font;
                    break;
                }
                case FONT_REGION_CS:
                {
                    this.fontMap["+mj-cs"] = font;
                    break;
                }
            }
        }
        else if(fontCollection === this.minorFont)
        {
            switch (region)
            {
                case FONT_REGION_LT:
                {
                    this.fontMap["+mn-lt"] = font;
                    break;
                }
                case FONT_REGION_EA:
                {
                    this.fontMap["+mn-ea"] = font;
                    break;
                }
                case FONT_REGION_CS:
                {
                    this.fontMap["+mn-cs"] = font;
                    break;
                }
            }
        }
    },

    checkFont: function(font)
    {
        if(g_oThemeFontsName[font])
        {
            if(this.fontMap[font])
            {
                return this.fontMap[font];
            }
            else if(this.fontMap["+mn-lt"])
            {
                return this.fontMap["+mn-lt"];
            }
            else
            {
                return "Arial";
            }
        }
        return font;
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_FontScheme;
    },


    setName: function(pr)
    {
        this.name = pr;
    },

    setMajorFont: function(pr)
    {
        this.majorFont = pr;
    },
    setMinorFont: function(pr)
    {
        this.minorFont = pr;
    }
};

function FmtScheme()
{
    this.name           = "";
    this.fillStyleLst   = [];
    this.lnStyleLst     = [];
    this.effectStyleLst = null;
    this.bgFillStyleLst = [];
}

FmtScheme.prototype =
{
    GetFillStyle: function(number, unicolor)
    {
        if (number >= 1 && number <= 999)
        {
            var ret = this.fillStyleLst[number - 1];
            if (!ret)
                return null;
            var ret2 = ret.createDuplicate();
            ret2.checkPhColor(unicolor);
            return ret2;
        }
        else if (number >= 1001)
        {
            var ret = this.bgFillStyleLst[number - 1001];
            if (!ret)
                return null;
            var ret2 = ret.createDuplicate();
            ret2.checkPhColor(unicolor);
            return ret2;
        }
        return null;
    },

    Write_ToBinary: function (w)
    {
        writeString(w, this.name);
        var i;
        w.WriteLong(this.fillStyleLst.length);
        for(i = 0; i < this.fillStyleLst.length; ++i)
        {
            this.fillStyleLst[i].Write_ToBinary(w);
        }

        w.WriteLong(this.lnStyleLst.length);
        for(i = 0; i < this.lnStyleLst.length; ++i)
        {
            this.lnStyleLst[i].Write_ToBinary(w);
        }

        w.WriteLong(this.bgFillStyleLst.length);
        for(i = 0; i < this.bgFillStyleLst.length; ++i)
        {
            this.bgFillStyleLst[i].Write_ToBinary(w);
        }
    },

    Read_FromBinary: function (r)
    {
        this.name = readString(r);
        var _len = r.GetLong(), i;
        for(i = 0; i < _len; ++i)
        {
            this.fillStyleLst[i] = new CUniFill();
            this.fillStyleLst[i].Read_FromBinary(r);
        }

        _len = r.GetLong();
        for(i = 0; i < _len; ++i)
        {
            this.lnStyleLst[i] = new CLn();
            this.lnStyleLst[i].Read_FromBinary(r);
        }

        _len = r.GetLong();
        for(i = 0; i < _len; ++i)
        {
            this.bgFillStyleLst[i] = new CUniFill();
            this.bgFillStyleLst[i].Read_FromBinary(r);
        }
    },

    createDuplicate: function()
    {
        var oCopy = new FmtScheme();
        oCopy.name = this.name;
        var i;
        for(i = 0; i < this.fillStyleLst.length; ++i)
        {
            oCopy.fillStyleLst[i] = this.fillStyleLst[i].createDuplicate();
        }
        for(i = 0; i < this.lnStyleLst.length; ++i)
        {
            oCopy.lnStyleLst[i] = this.lnStyleLst[i].createDuplicate();
        }

        for(i = 0; i < this.bgFillStyleLst.length; ++i)
        {
            oCopy.bgFillStyleLst[i] = this.bgFillStyleLst[i].createDuplicate();
        }
        return oCopy;
    },

    setName: function(pr)
    {
        this.name = pr;
    },
    addFillToStyleLst: function(pr)
    {
        this.fillStyleLst.push(pr);
    },
    addLnToStyleLst: function(pr)
    {
        this.lnStyleLst.push(pr);
    },
    addEffectToStyleLst: function(pr)
    {
        this.effectStyleLst.push(pr);
    },
    addBgFillToStyleLst: function(pr)
    {
        this.bgFillStyleLst.push(pr);
    }
};

function ThemeElements()
{
    this.clrScheme = new ClrScheme();
    this.fontScheme = new FontScheme();
    this.fmtScheme = new FmtScheme();
}

function CTheme()
{
    this.name = "";
    this.themeElements = new ThemeElements();
    this.spDef = null;
    this.lnDef = null;
    this.txDef = null;

    this.extraClrSchemeLst = [];

    this.isThemeOverride = false;

    // pointers
    this.presentation = null;
    this.clrMap = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}


CTheme.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    createDuplicate: function()
    {
        var oTheme = new CTheme();
        oTheme.changeColorScheme(this.themeElements.clrScheme.createDuplicate());
        oTheme.setFontScheme(this.themeElements.fontScheme.createDuplicate());
        oTheme.setFormatScheme(this.themeElements.fmtScheme.createDuplicate());
        return oTheme;
    },

    Document_Get_AllFontNames: function(AllFonts)
    {
        var font_scheme = this.themeElements.fontScheme;
        var major_font = font_scheme.majorFont;
        typeof major_font.latin === "string" && major_font.latin.length > 0 && (AllFonts[major_font.latin] = 1);
        typeof major_font.ea === "string" && major_font.ea.length > 0 && (AllFonts[major_font.ea] = 1);
        typeof major_font.cs === "string" && major_font.latin.length > 0 && (AllFonts[major_font.cs] = 1);
        var minor_font = font_scheme.minorFont;
        typeof minor_font.latin === "string" && minor_font.latin.length > 0 && (AllFonts[minor_font.latin] = 1);
        typeof minor_font.ea === "string" && minor_font.ea.length > 0 && (AllFonts[minor_font.ea] = 1);
        typeof minor_font.cs === "string" && minor_font.latin.length > 0 && (AllFonts[minor_font.cs] = 1);
    },

    getFillStyle: function(idx, unicolor)
    {
        if(idx === 0 || idx === 1000)
        {
            return AscFormat.CreateNoFillUniFill();
        }
        var ret;
        if (idx >= 1 && idx <= 999)
        {
            if (this.themeElements.fmtScheme.fillStyleLst[idx-1])
            {
                ret = this.themeElements.fmtScheme.fillStyleLst[idx-1].createDuplicate();
                if(ret)
                {
                    ret.checkPhColor(unicolor);
                    return ret;
                }
            }
        }
        else if (idx >= 1001)
        {
            if (this.themeElements.fmtScheme.bgFillStyleLst[idx-1001])
            {
                ret = this.themeElements.fmtScheme.bgFillStyleLst[idx-1001].createDuplicate();
                if(ret)
                {
                    ret.checkPhColor(unicolor);
                    return ret;
                }
            }
        }
        return CreateSolidFillRGBA(0, 0, 0, 255);
    },

    getLnStyle: function(idx, unicolor)
    {
        if (this.themeElements.fmtScheme.lnStyleLst[idx-1])
        {
            var ret = this.themeElements.fmtScheme.lnStyleLst[idx-1].createDuplicate();
            if(ret.Fill)
            {
                ret.Fill.checkPhColor(unicolor);
            }
            return ret;
        }
        return new CLn();
    },

    changeColorScheme: function(clrScheme)
    {
        History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_ThemeSetColorScheme, this.themeElements.clrScheme,  clrScheme));
        this.themeElements.clrScheme = clrScheme;
    },

    setFontScheme: function(fontScheme)
    {
        History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_ThemeSetFontScheme, this.themeElements.fontScheme,  fontScheme));
        this.themeElements.fontScheme = fontScheme;
    },

    setFormatScheme: function(fmtScheme)
    {
        History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_ThemeSetFmtScheme, this.themeElements.fmtScheme,  fmtScheme));
        this.themeElements.fmtScheme = fmtScheme;
    },

    GetWordDrawingObjects: function(){
        var oRet = typeof editor !== "undefined" &&
            editor.WordControl &&
            editor.WordControl.m_oLogicDocument &&
            editor.WordControl.m_oLogicDocument.DrawingObjects;
        return AscCommon.isRealObject(oRet) ? oRet : null;
    },

    Refresh_RecalcData: function(oData)
    {
        if(oData){
            if(oData.Type === AscDFH.historyitem_ThemeSetColorScheme){
                var oWordGraphicObject = this.GetWordDrawingObjects();
                if(oWordGraphicObject){
                    History.RecalcData_Add({All: true});
                    for(var i = 0; i < oWordGraphicObject.drawingObjects.length; ++i){
                        if(oWordGraphicObject.drawingObjects[i].GraphicObj){
                            oWordGraphicObject.drawingObjects[i].GraphicObj.handleUpdateFill();
                            oWordGraphicObject.drawingObjects[i].GraphicObj.handleUpdateLn();
                        }
                    }
                    oWordGraphicObject.document.Api.chartPreviewManager.clearPreviews();
                    oWordGraphicObject.document.Api.textArtPreviewManager.clear();
                }
            }
        }
    },

    getObjectType: function()
    {
        return AscDFH.historyitem_type_Theme;
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(AscDFH.historyitem_type_Theme);
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    }
};
// ----------------------------------

// CSLD -----------------------------

function HF()
{
    this.dt     = true;
    this.ftr    = true;
    this.hdr    = true;
    this.sldNum = true;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

HF.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },


    Refresh_RecalcData: function()
    {},
    getObjectType: function()
    {
        return AscDFH.historyitem_type_HF;
    },

    setDt: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_HF_SetDt, this.dt,  pr));
        this.dt = pr;
    },
    setFtr: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_HF_SetFtr, this.ftr,  pr));
        this.ftr = pr;
    },
    setHdr: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_HF_SetHdr, this.hdr,  pr));
        this.hdr = pr;
    },
    setSldNum: function(pr)
    {
        History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_HF_SetSldNum, this.sldNum,  pr));
        this.sldNum = pr;
    },

    Write_ToBinary2: function (w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function (r)
    {
        this.Id = r.GetString2();
    }
};

function CBgPr()
{
    this.Fill         = null;
    this.shadeToTitle = false;

}

CBgPr.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    merge: function(bgPr)
    {

        if(this.Fill == null)
        {
            this.Fill = new CUniFill();
            if(bgPr.Fill != null)
            {
                this.Fill.merge(bgPr.Fill)
            }
        }
    },

    createFullCopy: function()
    {
        var _copy = new CBgPr();
        if(this.Fill != null)
        {
            _copy.Fill = this.Fill.createDuplicate();
        }
        _copy.shadeToTitle = this.shadeToTitle;
        return _copy;
    },

    Refresh_RecalcData: function()
    {},

    getObjectType: function()
    {
        return AscDFH.historyitem_type_BgPr;
    },

    setFill: function(pr)
    {
        this.Fill = pr;
    },

    setShadeToTitle: function(pr)
    {
        this.shadeToTitle = pr;
    },

    Write_ToBinary: function (w)
    {
        w.WriteBool(isRealObject(this.Fill));
        if(isRealObject(this.Fill))
        {
            this.Fill.Write_ToBinary(w);
        }
        w.WriteBool(this.shadeToTitle);
    },

    Read_FromBinary: function (r)
    {
        if(r.GetBool())
        {
            this.Fill = new CUniFill();
            this.Fill.Read_FromBinary(r);
        }
        this.shadeToTitle = r.GetBool();
    }
};

function CBg()
{
    this.bwMode = null;
    this.bgPr   = null;
    this.bgRef  = null;
}

CBg.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    setBwMode: function(pr)
    {
        this.bwMode = pr;
    },
    setBgPr: function(pr)
    {
        this.bgPr = pr;
    },
    setBgRef: function(pr)
    {
        this.bgRef = pr;
    },

    merge:  function(bg)
    {
        if(this.bgPr == null)
        {
            this.bgPr = new CBgPr();
            if(bg.bgPr != null)
            {
                this.bgPr.merge(bg.bgPr);
            }
        }
    },

    createFullCopy: function()
    {
        var _copy = new CBg();
        _copy.bwMode = this.bwMode;
        if(this.bgPr != null)
        {
            _copy.bgPr = this.bgPr.createFullCopy();
        }
        if(this.bgRef != null)
        {
            _copy.bgRef = this.bgRef.createDuplicate();
        }
        return _copy;
    },

    Write_ToBinary: function(w)
    {
        w.WriteBool(isRealObject(this.bgPr));
        if(isRealObject(this.bgPr))
        {
            this.bgPr.Write_ToBinary(w);
        }
        w.WriteBool(isRealObject(this.bgRef));
        if(isRealObject(this.bgRef))
        {
            this.bgRef.Write_ToBinary(w);
        }
    },

    Read_FromBinary: function(r)
    {
        if(r.GetBool())
        {
            this.bgPr = new CBgPr();
            this.bgPr.Read_FromBinary(r);
        }
        if(r.GetBool())
        {
            this.bgRef = new StyleRef();
            this.bgRef.Read_FromBinary(r);
        }
    }
};

function CSld()
{
    this.name = "";
    this.Bg = null;
    this.spTree = [];//new GroupShape();
}

// ----------------------------------

// MASTERSLIDE ----------------------

function CTextStyle()
{
    this.defPPr = null;
    this.lvl1pPr = null;
    this.lvl2pPr = null;
    this.lvl3pPr = null;
    this.lvl4pPr = null;
    this.lvl5pPr = null;
    this.lvl6pPr = null;
    this.lvl7pPr = null;
    this.lvl8pPr = null;
    this.lvl9pPr = null;
}

CTextStyle.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {}
};

function CTextStyles()
{
    this.titleStyle = null;
    this.bodyStyle = null;
    this.otherStyle = null;

}


CTextStyles.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    Write_ToBinary: function(w)
    {
        w.WriteBool(isRealObject(this.titleStyle));
        if(isRealObject(this.titleStyle))
        {
            this.titleStyle.Write_ToBinary(w);
        }


        w.WriteBool(isRealObject(this.bodyStyle));
        if(isRealObject(this.bodyStyle))
        {
            this.bodyStyle.Write_ToBinary(w);
        }

        w.WriteBool(isRealObject(this.otherStyle));
        if(isRealObject(this.otherStyle))
        {
            this.otherStyle.Write_ToBinary(w);
        }
    },

    Read_FromBinary: function(r)
    {
        if(r.GetBool())
        {
            this.titleStyle = new TextListStyle();
            this.titleStyle.Read_FromBinary(r);
        }
        else
        {
            this.titleStyle = null;
        }


        if(r.GetBool())
        {
            this.bodyStyle = new TextListStyle();
            this.bodyStyle.Read_FromBinary(r);
        }
        else
        {
            this.bodyStyle = null;
        }

        if(r.GetBool())
        {
            this.otherStyle = new TextListStyle();
            this.otherStyle.Read_FromBinary(r);
        }
        else
        {
            this.otherStyle = null;
        }
    },

    Document_Get_AllFontNames: function(AllFonts){
        if(this.titleStyle){
            this.titleStyle.Document_Get_AllFontNames(AllFonts);
        }
        if(this.bodyStyle){
            this.bodyStyle.Document_Get_AllFontNames(AllFonts);
        }
        if(this.otherStyle){
            this.otherStyle.Document_Get_AllFontNames(AllFonts);
        }
    }

};

//---------------------------

// SLIDELAYOUT ----------------------

//Layout types
var nSldLtTBlank                   = 0; // Blank ))
var nSldLtTChart                   = 1; //Chart)
var nSldLtTChartAndTx              = 2; //( Chart and Text ))
var nSldLtTClipArtAndTx            = 3; //Clip Art and Text)
var nSldLtTClipArtAndVertTx        = 4; //Clip Art and Vertical Text)
var nSldLtTCust                    = 5; // Custom ))
var nSldLtTDgm                     = 6; //Diagram ))
var nSldLtTFourObj                 = 7; //Four Objects)
var nSldLtTMediaAndTx              = 8; // ( Media and Text ))
var nSldLtTObj                     = 9; //Title and Object)
var nSldLtTObjAndTwoObj            = 10; //Object and Two Object)
var nSldLtTObjAndTx                = 11; // ( Object and Text ))
var nSldLtTObjOnly                 = 12; //Object)
var nSldLtTObjOverTx               = 13; // ( Object over Text))
var nSldLtTObjTx                   = 14; //Title, Object, and Caption)
var nSldLtTPicTx                   = 15; //Picture and Caption)
var nSldLtTSecHead                 = 16; //Section Header)
var nSldLtTTbl                     = 17; // ( Table ))
var nSldLtTTitle                   = 18; // ( Title ))
var nSldLtTTitleOnly               = 19; // ( Title Only ))
var nSldLtTTwoColTx                = 20; // ( Two Column Text ))
var nSldLtTTwoObj                  = 21; //Two Objects)
var nSldLtTTwoObjAndObj            = 22; //Two Objects and Object)
var nSldLtTTwoObjAndTx             = 23; //Two Objects and Text)
var nSldLtTTwoObjOverTx            = 24; //Two Objects over Text)
var nSldLtTTwoTxTwoObj             = 25; //Two Text and Two Objects)
var nSldLtTTx                      = 26; // ( Text ))
var nSldLtTTxAndChart              = 27; // ( Text and Chart ))
var nSldLtTTxAndClipArt            = 28; //Text and Clip Art)
var nSldLtTTxAndMedia              = 29; // ( Text and Media ))
var nSldLtTTxAndObj                = 30; // ( Text and Object ))
var nSldLtTTxAndTwoObj             = 31; //Text and Two Objects)
var nSldLtTTxOverObj               = 32; // ( Text over Object))
var nSldLtTVertTitleAndTx          = 33; //Vertical Title and Text)
var nSldLtTVertTitleAndTxOverChart = 34; //Vertical Title and Text Over Chart)
var nSldLtTVertTx                  = 35; //Vertical Text)

var _ph_multiplier = 4;

var _weight_body = 9;
var _weight_chart = 5;
var _weight_clipArt = 2;
var _weight_ctrTitle = 11;
var _weight_dgm = 4;
var _weight_media = 3;
var _weight_obj = 8;
var _weight_pic = 7;
var _weight_subTitle = 10;
var _weight_tbl = 6;
var _weight_title = 11;

var _ph_summ_blank = 0;
var _ph_summ_chart = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_chart);
var _ph_summ_chart_and_tx = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_chart) + Math.pow(_ph_multiplier, _weight_body);
var _ph_summ_dgm = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_dgm);
var _ph_summ_four_obj = Math.pow(_ph_multiplier, _weight_title) + 4*Math.pow(_ph_multiplier, _weight_obj);
var _ph_summ__media_and_tx = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_media) + Math.pow(_ph_multiplier, _weight_body);
var _ph_summ__obj = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_obj);
var _ph_summ__obj_and_two_obj = Math.pow(_ph_multiplier, _weight_title) + 3*Math.pow(_ph_multiplier, _weight_obj);
var _ph_summ__obj_and_tx = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_obj) + Math.pow(_ph_multiplier, _weight_body);
var _ph_summ__obj_only = Math.pow(_ph_multiplier, _weight_obj);
var _ph_summ__pic_tx = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_pic) + Math.pow(_ph_multiplier, _weight_body);
var _ph_summ__sec_head = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_subTitle);
var _ph_summ__tbl = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_tbl);
var _ph_summ__title_only = Math.pow(_ph_multiplier, _weight_title);
var _ph_summ__two_col_tx = Math.pow(_ph_multiplier, _weight_title) + 2*Math.pow(_ph_multiplier, _weight_body);
var _ph_summ__two_obj_and_tx = Math.pow(_ph_multiplier, _weight_title) + 2*Math.pow(_ph_multiplier, _weight_obj) + Math.pow(_ph_multiplier, _weight_body);
var _ph_summ__two_obj_and_two_tx = Math.pow(_ph_multiplier, _weight_title) + 2*Math.pow(_ph_multiplier, _weight_obj) +2* Math.pow(_ph_multiplier, _weight_body);
var _ph_summ__tx = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_body);
var _ph_summ__tx_and_clip_art = Math.pow(_ph_multiplier, _weight_title) + Math.pow(_ph_multiplier, _weight_body) + + Math.pow(_ph_multiplier, _weight_clipArt);

var _arr_lt_types_weight = [];
_arr_lt_types_weight[0] =   _ph_summ_blank;
_arr_lt_types_weight[1] =   _ph_summ_chart;
_arr_lt_types_weight[2] =   _ph_summ_chart_and_tx;
_arr_lt_types_weight[3] =   _ph_summ_dgm;
_arr_lt_types_weight[4] =   _ph_summ_four_obj;
_arr_lt_types_weight[5] =   _ph_summ__media_and_tx;
_arr_lt_types_weight[6] =   _ph_summ__obj;
_arr_lt_types_weight[7] =   _ph_summ__obj_and_two_obj;
_arr_lt_types_weight[8] =   _ph_summ__obj_and_tx;
_arr_lt_types_weight[9] =   _ph_summ__obj_only;
_arr_lt_types_weight[10] =  _ph_summ__pic_tx;
_arr_lt_types_weight[11] =  _ph_summ__sec_head;
_arr_lt_types_weight[12] =  _ph_summ__tbl;
_arr_lt_types_weight[13] =  _ph_summ__title_only;
_arr_lt_types_weight[14] =  _ph_summ__two_col_tx;
_arr_lt_types_weight[15] =  _ph_summ__two_obj_and_tx;
_arr_lt_types_weight[16] =  _ph_summ__two_obj_and_two_tx;
_arr_lt_types_weight[17] =  _ph_summ__tx;
_arr_lt_types_weight[18] =  _ph_summ__tx_and_clip_art;

_arr_lt_types_weight.sort(AscCommon.fSortAscending);


var _global_layout_summs_array = {};
_global_layout_summs_array["_" + _ph_summ_blank] = nSldLtTBlank;
_global_layout_summs_array["_" + _ph_summ_chart] = nSldLtTChart;
_global_layout_summs_array["_" + _ph_summ_chart_and_tx] = nSldLtTChartAndTx;
_global_layout_summs_array["_" + _ph_summ_dgm] = nSldLtTDgm;
_global_layout_summs_array["_" + _ph_summ_four_obj] = nSldLtTFourObj;
_global_layout_summs_array["_" + _ph_summ__media_and_tx] = nSldLtTMediaAndTx;
_global_layout_summs_array["_" + _ph_summ__obj] = nSldLtTObj;
_global_layout_summs_array["_" + _ph_summ__obj_and_two_obj] = nSldLtTObjAndTwoObj;
_global_layout_summs_array["_" + _ph_summ__obj_and_tx] = nSldLtTObjAndTx;
_global_layout_summs_array["_" + _ph_summ__obj_only] = nSldLtTObjOnly;
_global_layout_summs_array["_" + _ph_summ__pic_tx] = nSldLtTPicTx;
_global_layout_summs_array["_" + _ph_summ__sec_head] = nSldLtTSecHead;
_global_layout_summs_array["_" + _ph_summ__tbl] = nSldLtTTbl;
_global_layout_summs_array["_" + _ph_summ__title_only] = nSldLtTTitleOnly;
_global_layout_summs_array["_" + _ph_summ__two_col_tx] = nSldLtTTwoColTx;
_global_layout_summs_array["_" + _ph_summ__two_obj_and_tx] = nSldLtTTwoObjAndTx;
_global_layout_summs_array["_" + _ph_summ__two_obj_and_two_tx] = nSldLtTTwoTxTwoObj;
_global_layout_summs_array["_" + _ph_summ__tx] = nSldLtTTx;
_global_layout_summs_array["_" + _ph_summ__tx_and_clip_art] = nSldLtTTxAndClipArt;


// ----------------------------------

// NOTEMASTER -----------------------

function NoteMaster()
{
    this.cSld = new CSld();
    this.clrMap = new ClrMap();

    this.hf = new HF();
    this.notesStyle = null;

    // pointers
    this.Theme = null;
    this.TableStyles = null;

}

NoteMaster.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    } ,

    Refresh_RecalcData: function()
    {},

    Calculate: function()
    {
        // нужно пробежаться по всем шейпам:
        // учесть тему во всех заливках
        // учесть тему во всех текстовых настройках,
    }
};

// ----------------------------------

// NOTE -----------------------------

function NoteSlide()
{
    this.cSld = new CSld();
    this.clrMap = null; // override ClrMap

    this.showMasterPhAnim = false;
    this.showMasterSp = false;
}

NoteSlide.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    // pointers
    Calculate: function()
    {
        // нужно пробежаться по всем шейпам:
        // учесть тему во всех заливках
        // учесть тему во всех текстовых настройках,
    }
};

// ----------------------------------

// SLIDE ----------------------------
function redrawSlide(slide, presentation, arrInd, pos,  direction, arr_slides)
{
    if(slide)
    {
        slide.recalculate();
        presentation.DrawingDocument.OnRecalculatePage(slide.num, slide);
    }
    if(direction == 0)
    {
        if(pos > 0)
        {
            presentation.backChangeThemeTimeOutId = setTimeout(function(){redrawSlide(arr_slides[arrInd[pos - 1]], presentation, arrInd,pos - 1,  -1, arr_slides)}, recalcSlideInterval);
        }
        else
        {
            presentation.backChangeThemeTimeOutId = null;
        }
        if(pos < arrInd.length-1)
        {
            presentation.forwardChangeThemeTimeOutId = setTimeout(function(){redrawSlide(arr_slides[arrInd[pos + 1]], presentation, arrInd, pos + 1,  +1, arr_slides)}, recalcSlideInterval);
        }
        else
        {
            presentation.forwardChangeThemeTimeOutId = null;
        }
        presentation.startChangeThemeTimeOutId = null;
    }
    if(direction > 0)
    {
        if(pos < arrInd.length-1)
        {
            presentation.forwardChangeThemeTimeOutId =setTimeout(function(){redrawSlide(arr_slides[arrInd[pos + 1]], presentation, arrInd, pos + 1,  +1, arr_slides)}, recalcSlideInterval);
        }
        else
        {
            presentation.forwardChangeThemeTimeOutId = null;
        }
    }
    if(direction < 0)
    {
        if(pos > 0)
        {
            presentation.backChangeThemeTimeOutId = setTimeout(function(){redrawSlide(arr_slides[arrInd[pos - 1]], presentation, arrInd, pos - 1,  -1, arr_slides)}, recalcSlideInterval);
        }
        else
        {
            presentation.backChangeThemeTimeOutId = null;
        }
    }
}


function CTextFit()
{
    this.type           = 0;
    this.fontScale      = null;
    this.lnSpcReduction = null;
}

CTextFit.prototype =
{
    CreateDublicate : function()
    {
        var d = new CTextFit();
        d.type = this.type;
        d.fontScale = this.fontScale;
        d.lnSpcReduction = this.lnSpcReduction;
        return d;
    },


    Write_ToBinary: function(w)
    {
        writeLong(w, this.type);
        writeDouble(w, this.fontScale);
        writeDouble(w, this.lnSpcReduction);
    },

    Read_FromBinary: function(r)
    {
        this.type = readLong(r);
        this.fontScale = readDouble(r);
        this.lnSpcReduction = readDouble(r);
    },

    Get_Id: function()
    {
        return this.Id;
    }  ,
    Refresh_RecalcData: function()
    {}
};

//Overflow Types
var nOTClip     = 0;
var nOTEllipsis = 1;
var nOTOwerflow = 2;
//-----------------------------

//Text Anchoring Types
var nTextATB = 0;// (Text Anchor Enum ( Bottom ))
var nTextATCtr = 1;// (Text Anchor Enum ( Center ))
var nTextATDist = 2;// (Text Anchor Enum ( Distributed ))
var nTextATJust = 3;// (Text Anchor Enum ( Justified ))
var nTextATT = 4;// Top

function CBodyPr()
{
    this.flatTx           = null;
    this.anchor           = null;
    this.anchorCtr        = null;
    this.bIns             = null;
    this.compatLnSpc      = null;
    this.forceAA          = null;
    this.fromWordArt      = null;
    this.horzOverflow     = null;
    this.lIns             = null;
    this.numCol           = null;
    this.rIns             = null;
    this.rot              = null;
    this.rtlCol           = null;
    this.spcCol           = null;
    this.spcFirstLastPara = null;
    this.tIns             = null;
    this.upright          = null;
    this.vert             = null;
    this.vertOverflow     = null;
    this.wrap             = null;
    this.textFit          = null;
    this.prstTxWarp       = null;


    this.parent = null;
  // this.Id = g_oIdCounter.Get_NewId();
  // g_oTableId.Add(this, this.Id);
}

CBodyPr.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    isNotNull: function()
    {
        return this.flatTx          !== null ||
        this.anchor           !== null ||
        this.anchorCtr        !== null ||
        this.bIns             !== null ||
        this.compatLnSpc      !== null ||
        this.forceAA          !== null ||
        this.fromWordArt      !== null ||
        this.horzOverflow     !== null ||
        this.lIns             !== null ||
        this.numCol           !== null ||
        this.rIns             !== null ||
        this.rot              !== null ||
        this.rtlCol           !== null ||
        this.spcCol           !== null ||
        this.spcFirstLastPara !== null ||
        this.tIns             !== null ||
        this.upright          !== null ||
        this.vert             !== null ||
        this.vertOverflow     !== null ||
        this.wrap             !== null ||
        this.textFit          !== null ||
        this.prstTxWarp       !== null;
    },

    setAnchor: function(val)
    {
        this.anchor = val;
    },

    setVert: function(val)
    {
        this.vert = val;
    },

    setRot: function(val)
    {
        this.rot = val;
    },

    reset: function()
    {
        this.flatTx           = null;
        this.anchor           = null;
        this.anchorCtr        = null;
        this.bIns             = null;
        this.compatLnSpc      = null;
        this.forceAA          = null;
        this.fromWordArt      = null;
        this.horzOverflow     = null;
        this.lIns             = null;
        this.numCol           = null;
        this.rIns             = null;
        this.rot              = null;
        this.rtlCol           = null;
        this.spcCol           = null;
        this.spcFirstLastPara = null;
        this.tIns             = null;
        this.upright          = null;
        this.vert             = null;
        this.vertOverflow     = null;
        this.wrap             = null;
        this.textFit          = null;
        this.prstTxWarp       = null;
    },


    WritePrstTxWarp: function(w)
    {
        w.WriteBool(isRealObject(this.prstTxWarp));
        if(isRealObject(this.prstTxWarp))
        {
            writeString(w, this.prstTxWarp.preset);
            var startPos = w.GetCurPosition(), countAv = 0;
            w.Skip(4);
            for(var key in this.prstTxWarp.avLst)
            {
                if(this.prstTxWarp.avLst.hasOwnProperty(key))
                {
                    ++countAv;
                    w.WriteString2(key);
                    w.WriteLong(this.prstTxWarp.gdLst[key]);
                }
            }
            var endPos = w.GetCurPosition();
            w.Seek(startPos);
            w.WriteLong(countAv);
            w.Seek(endPos);
        }
    },

    ReadPrstTxWarp: function(r)
    {
        ExecuteNoHistory(function(){
            if(r.GetBool())
            {
                this.prstTxWarp = AscFormat.CreatePrstTxWarpGeometry(readString(r));
                var count = r.GetLong();
                for(var i = 0; i < count; ++i)
                {
                    var sAdj = r.GetString2();
                    var nVal = r.GetLong();
                    this.prstTxWarp.AddAdj(sAdj, 15, nVal + "", undefined, undefined);
                }
            }
        }, this, []);
    },

    Write_ToBinary2: function(w)
    {
        var flag = this.flatTx != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteLong(this.flatTx);
        }

        flag = this.anchor != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteLong(this.anchor);
        }

        flag = this.anchorCtr != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteBool(this.anchorCtr);
        }

        flag = this.bIns != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteDouble(this.bIns);
        }

        flag = this.compatLnSpc != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteBool(this.compatLnSpc);
        }

        flag = this.forceAA != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteBool(this.forceAA);
        }

        flag = this.fromWordArt != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteBool(this.fromWordArt);
        }

        flag = this.horzOverflow != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteLong(this.horzOverflow);
        }

        flag = this.lIns != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteDouble(this.lIns);
        }

        flag = this.numCol != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteLong(this.numCol);
        }

        flag = this.rIns != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteDouble(this.rIns);
        }


        flag = this.rot != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteLong(this.rot);
        }

        flag = this.rtlCol != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteBool(this.rtlCol);
        }

        flag = this.spcCol != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteBool(this.spcCol);
        }

        flag = this.spcFirstLastPara != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteBool(this.spcFirstLastPara);
        }

        flag = this.tIns != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteDouble(this.tIns);
        }

        flag = this.upright != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteBool(this.upright);
        }

        flag = this.vert != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteLong(this.vert);
        }


        flag = this.vertOverflow != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteLong(this.vertOverflow);
        }

        flag = this.wrap != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteLong(this.wrap);
        }

        this.WritePrstTxWarp(w);

        w.WriteBool(isRealObject(this.textFit));
        if(this.textFit)
        {
            this.textFit.Write_ToBinary(w);
        }
    },

    Read_FromBinary2: function(r)
    {
        var flag = r.GetBool();
        if(flag)
        {
            this.flatTx = r.GetLong();
        }

        flag = r.GetBool();
        if(flag)
        {
            this.anchor = r.GetLong();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.anchorCtr = r.GetBool();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.bIns = r.GetDouble();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.compatLnSpc = r.GetBool();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.forceAA = r.GetBool();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.fromWordArt = r.GetBool();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.horzOverflow = r.GetLong();
        }



        flag = r.GetBool();
        if(flag)
        {
            this.lIns = r.GetDouble();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.numCol = r.GetLong();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.rIns = r.GetDouble();
        }



        flag = r.GetBool();
        if(flag)
        {
            this.rot = r.GetLong();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.rtlCol = r.GetBool();
        }

        flag = r.GetBool();
        if(flag)
        {
            this.spcCol = r.GetBool();
        }

        flag = r.GetBool();
        if(flag)
        {
            this.spcFirstLastPara = r.GetBool();
        }



        flag = r.GetBool();
        if(flag)
        {
            this.tIns = r.GetDouble();
        }



        flag = r.GetBool();
        if(flag)
        {
            this.upright = r.GetBool();
        }



        flag = r.GetBool();
        if(flag)
        {
            this.vert = r.GetLong();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.vertOverflow = r.GetLong();
        }



        flag = r.GetBool();
        if(flag)
        {
            this.wrap = r.GetLong();
        }
        this.ReadPrstTxWarp(r);

        if(r.GetBool())
        {
            this.textFit = new CTextFit();
            this.textFit.Read_FromBinary(r);
        }
    },

    setDefault:  function()
    {
        this.flatTx         = null;
        this.anchor         = 4;
        this.anchorCtr      = false;
        this.bIns           = 45720/36000;
        this.compatLnSpc    = false;
        this.forceAA        = false;
        this.fromWordArt    = false;
        this.horzOverflow   = nOTOwerflow;
        this.lIns           = 91440/36000;
        this.numCol         = 1;
        this.rIns           = 91440/36000;
        this.rot            = null;
        this.rtlCol         = false;
        this.spcCol         = false ;
        this.spcFirstLastPara = null;
        this.tIns           = 45720/36000;
        this.upright        = false;
        this.vert           = AscFormat.nVertTThorz;
        this.vertOverflow   = nOTOwerflow;
        this.wrap           = AscFormat.nTWTSquare;
        this.prstTxWarp     = null;
    },

    createDuplicate: function()
    {
        var duplicate = new CBodyPr();
        duplicate.flatTx         = this.flatTx;
        duplicate.anchor         = this.anchor;
        duplicate.anchorCtr      = this.anchorCtr;
        duplicate.bIns           = this.bIns;
        duplicate.compatLnSpc    = this.compatLnSpc;
        duplicate.forceAA        = this.forceAA;
        duplicate.fromWordArt    = this.fromWordArt;
        duplicate.horzOverflow   = this.horzOverflow;
        duplicate.lIns           = this.lIns;
        duplicate.numCol         = this.numCol;
        duplicate.rIns           = this.rIns;
        duplicate.rot            = this.rot;
        duplicate.rtlCol         = this.rtlCol;
        duplicate.spcCol         = this.spcCol;
        duplicate.spcFirstLastPara = this.spcFirstLastPara;
        duplicate.tIns           = this.tIns;
        duplicate.upright        = this.upright;
        duplicate.vert           = this.vert;
        duplicate.vertOverflow   = this.vertOverflow;
        duplicate.wrap           = this.wrap;
        if(this.prstTxWarp)
        {
            duplicate.prstTxWarp = ExecuteNoHistory(function(){return this.prstTxWarp.createDuplicate();}, this, []);
        }
        if(this.textFit)
        {
            duplicate.textFit = this.textFit.CreateDublicate();
        }
        return duplicate;
    },

    merge: function(bodyPr)
    {
        if(!bodyPr)
            return;
        if(bodyPr.flatTx!=null)
        {
            this.flatTx = bodyPr.flatTx;
        }
        if(bodyPr.anchor!=null)
        {
            this.anchor = bodyPr.anchor;
        }
        if(bodyPr.anchorCtr!=null)
        {
            this.anchorCtr = bodyPr.anchorCtr;
        }
        if(bodyPr.bIns!=null)
        {
            this.bIns = bodyPr.bIns;
        }
        if(bodyPr.compatLnSpc!=null)
        {
            this.compatLnSpc = bodyPr.compatLnSpc;
        }
        if(bodyPr.forceAA!=null)
        {
            this.forceAA = bodyPr.forceAA;
        }
        if(bodyPr.fromWordArt!=null)
        {
            this.fromWordArt = bodyPr.fromWordArt;
        }

        if(bodyPr.horzOverflow!=null)
        {
            this.horzOverflow = bodyPr.horzOverflow;
        }

        if(bodyPr.lIns!=null)
        {
            this.lIns = bodyPr.lIns;
        }

        if(bodyPr.numCol != null){
            this.numCol = bodyPr.numCol;
        }
        if(bodyPr.rIns!=null)
        {
            this.rIns = bodyPr.rIns;
        }

        if(bodyPr.rot!=null)
        {
            this.rot = bodyPr.rot;
        }

        if(bodyPr.rtlCol!=null)
        {
            this.rtlCol = bodyPr.rtlCol;
        }

        if(bodyPr.spcCol!=null)
        {
            this.spcCol = bodyPr.spcCol;
        }
        if(bodyPr.spcFirstLastPara!=null)
        {
            this.spcFirstLastPara = bodyPr.spcFirstLastPara;
        }

        if(bodyPr.tIns!=null)
        {
            this.tIns = bodyPr.tIns;
        }
        if(bodyPr.upright!=null)
        {
            this.upright = bodyPr.upright;
        }

        if(bodyPr.vert!=null)
        {
            this.vert = bodyPr.vert;
        }
        if(bodyPr.vertOverflow!=null)
        {
            this.vertOverflow = bodyPr.vertOverflow;
        }
        if(bodyPr.wrap!=null)
        {
            this.wrap = bodyPr.wrap;
        }
        if(bodyPr.prstTxWarp)
        {
            this.prstTxWarp = ExecuteNoHistory(function(){return bodyPr.prstTxWarp.createDuplicate();}, this, []);
        }
        if(bodyPr.textFit)
        {
            this.textFit = bodyPr.textFit.CreateDublicate();
        }
        if(bodyPr.numCol != null){
            this.numCol = bodyPr.numCol;
        }
        return this;
    },

    Write_ToBinary: function(w)
    {
        var flag = this.flatTx != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteLong(this.flatTx);
        }

        flag = this.anchor != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteLong(this.anchor);
        }

        flag = this.anchorCtr != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteBool(this.anchorCtr);
        }

        flag = this.bIns != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteDouble(this.bIns);
        }

        flag = this.compatLnSpc != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteBool(this.compatLnSpc);
        }

        flag = this.forceAA != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteBool(this.forceAA);
        }

        flag = this.fromWordArt != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteBool(this.fromWordArt);
        }

        flag = this.horzOverflow != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteLong(this.horzOverflow);
        }

        flag = this.lIns != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteDouble(this.lIns);
        }

        flag = this.numCol != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteLong(this.numCol);
        }

        flag = this.rIns != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteDouble(this.rIns);
        }


        flag = this.rot != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteLong(this.rot);
        }

        flag = this.rtlCol != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteBool(this.rtlCol);
        }

        flag = this.spcCol != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteBool(this.spcCol);
        }

        flag = this.spcFirstLastPara != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteBool(this.spcFirstLastPara);
        }

        flag = this.tIns != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteDouble(this.tIns);
        }

        flag = this.upright != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteBool(this.upright);
        }

        flag = this.vert != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteLong(this.vert);
        }


        flag = this.vertOverflow != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteLong(this.vertOverflow);
        }

        flag = this.wrap != null;
        w.WriteBool(flag);
        if(flag)
        {
            w.WriteLong(this.wrap);
        }
        this.WritePrstTxWarp(w);
        w.WriteBool(isRealObject(this.textFit));
        if(this.textFit)
        {
            this.textFit.Write_ToBinary(w);
        }
    },

    Read_FromBinary: function(r)
    {
        var flag = r.GetBool();
        if(flag)
        {
            this.flatTx = r.GetLong();
        }

        flag = r.GetBool();
        if(flag)
        {
            this.anchor = r.GetLong();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.anchorCtr = r.GetBool();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.bIns = r.GetDouble();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.compatLnSpc = r.GetBool();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.forceAA = r.GetBool();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.fromWordArt = r.GetBool();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.horzOverflow = r.GetLong();
        }



        flag = r.GetBool();
        if(flag)
        {
            this.lIns = r.GetDouble();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.numCol = r.GetLong();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.rIns = r.GetDouble();
        }



        flag = r.GetBool();
        if(flag)
        {
            this.rot = r.GetLong();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.rtlCol = r.GetBool();
        }

        flag = r.GetBool();
        if(flag)
        {
            this.spcCol = r.GetBool();
        }

        flag = r.GetBool();
        if(flag)
        {
            this.spcFirstLastPara = r.GetBool();
        }



        flag = r.GetBool();
        if(flag)
        {
            this.tIns = r.GetDouble();
        }



        flag = r.GetBool();
        if(flag)
        {
            this.upright = r.GetBool();
        }



        flag = r.GetBool();
        if(flag)
        {
            this.vert = r.GetLong();
        }


        flag = r.GetBool();
        if(flag)
        {
            this.vertOverflow = r.GetLong();
        }



        flag = r.GetBool();
        if(flag)
        {
            this.wrap = r.GetLong();
        }
        this.ReadPrstTxWarp(r);

        if(r.GetBool())
        {
            this.textFit = new CTextFit();
            this.textFit.Read_FromBinary(r)
        }
    }
};


function CHyperlink()
{
    this.url = "";
    this.action = "";
    this.tooltip = null;
}

CHyperlink.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {}
};

function CTextParagraphPr()
{
    this.bullet = new CBullet();
    this.lvl = null;
    this.pPr = new CParaPr();
    this.rPr = new CTextPr();
}


function CompareBullets(bullet1, bullet2)
{

    //TODO: пока будем сравнивать только bulletType, т. к. эта функция используется для мержа свойств при отдаче в интерфейс, а для интерфейса bulletTyp'a достаточно. Если понадобится нужно сделать полное сравнение.
    //
    if(bullet1.bulletType && bullet2.bulletType
        && bullet1.bulletType.type === bullet2.bulletType.type
        && bullet1.bulletType.type !== BULLET_TYPE_BULLET_NONE)
    {
        var ret = new CBullet();
        ret.bulletType = new CBulletType();
        switch(bullet1.bulletType.type)
        {
            case BULLET_TYPE_BULLET_CHAR:
            {
                ret.bulletType.type = BULLET_TYPE_BULLET_CHAR;
                if(bullet1.bulletType.Char === bullet2.bulletType.Char)
                {
                    ret.bulletType.Char = bullet1.bulletType.Char;
                }
                break;
            }
            case BULLET_TYPE_BULLET_BLIP:
            {
                ret.bulletType.type = BULLET_TYPE_BULLET_CHAR; //TODO: в меню отдаем, что символьный.
                break;
            }
            case BULLET_TYPE_BULLET_AUTONUM:
            {
                if(bullet1.bulletType.AutoNumType === bullet2.bulletType.AutoNumType)
                {
                    ret.bulletType.AutoNumType = bullet1.bulletType.AutoNumType;
                }
                if(bullet1.bulletType.startAt === bullet2.bulletType.startAt)
                {
                    ret.bulletType.startAt = bullet1.bulletType.startAt;
                }
                if(bullet1.bulletType.type === bullet2.bulletType.type)
                {
                    ret.bulletType.type = bullet1.bulletType.type;
                }
                break;
            }
        }
        return ret;
    }
    else
    {
        return undefined;
    }
}

function CBullet()
{
    this.bulletColor = null;
    this.bulletSize = null;
    this.bulletTypeface = null;
    this.bulletType = null;
    this.Bullet = null;
}

CBullet.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },
    Refresh_RecalcData: function()
    {},

    Set_FromObject: function(obj)
    {
        if(obj)
        {
            if(obj.bulletColor)
            {
                this.bulletColor = new CBulletColor();
                this.bulletColor.Set_FromObject(obj.bulletColor);
            }
            else
                this.bulletColor = null;

            if(obj.bulletSize)
            {
                this.bulletSize = new CBulletSize();
                this.bulletSize.Set_FromObject(obj.bulletSize);
            }
            else
                this.bulletSize = null;

            if(obj.bulletTypeface)
            {
                this.bulletTypeface = new CBulletTypeface();
                this.bulletTypeface.Set_FromObject(obj.bulletTypeface);
            }
            else
                this.bulletTypeface = null;
        }
    },

    createDuplicate: function()
    {
        var duplicate = new CBullet();
        if(this.bulletColor)
        {
            duplicate.bulletColor = this.bulletColor.createDuplicate();
        }
        if(this.bulletSize)
        {
            duplicate.bulletSize = this.bulletSize.createDuplicate();
        }
        if(this.bulletTypeface)
        {
            duplicate.bulletTypeface = this.bulletTypeface.createDuplicate();
        }

        if(this.bulletType)
        {
            duplicate.bulletType = this.bulletType.createDuplicate();
        }

        duplicate.Bullet = this.Bullet;
        return duplicate;
    },

    isBullet: function()
    {
        return this.bulletType != null && this.bulletType.type != null;
    },

    getPresentationBullet: function()
    {
        var para_pr = new CParaPr();
        para_pr.Bullet = this;
        return para_pr.Get_PresentationBullet();
    },

    getBulletType: function()
    {
        return this.getPresentationBullet().m_nType;
    },

    Write_ToBinary: function(w)
    {
        w.WriteBool(isRealObject(this.bulletColor));
        if(isRealObject(this.bulletColor))
        {
            this.bulletColor.Write_ToBinary(w);
        }

        w.WriteBool(isRealObject(this.bulletSize));
        if(isRealObject(this.bulletSize))
        {
            this.bulletSize.Write_ToBinary(w);
        }


        w.WriteBool(isRealObject(this.bulletTypeface));
        if(isRealObject(this.bulletTypeface))
        {
            this.bulletTypeface.Write_ToBinary(w);
        }


        w.WriteBool(isRealObject(this.bulletType));
        if(isRealObject(this.bulletType))
        {
            this.bulletType.Write_ToBinary(w);
        }

    },

    Read_FromBinary: function(r)
    {
        if(r.GetBool())
        {
            this.bulletColor = new CBulletColor();
            this.bulletColor.Read_FromBinary(r);
        }

        if(r.GetBool())
        {
            this.bulletSize = new CBulletSize();
            this.bulletSize.Read_FromBinary(r);
        }

        if(r.GetBool())
        {
            this.bulletTypeface = new CBulletTypeface();
            this.bulletTypeface.Read_FromBinary(r);
        }

        if(r.GetBool())
        {
            this.bulletType = new CBulletType();
            this.bulletType.Read_FromBinary(r);
        }
    }

};

function CBulletColor()
{
    this.type = AscFormat.BULLET_TYPE_COLOR_NONE;
    this.UniColor = null;

}

CBulletColor.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},
    Set_FromObject: function(o)
    {
        this.type = o.type;
        if(o.UniColor)
        {

        }
    },

    createDuplicate: function()
    {
        var duplicate = new CBulletColor();
        duplicate.type = this.type;
        if(this.UniColor != null)
        {
            duplicate.UniColor = this.UniColor.createDuplicate();
        }
        return duplicate;
    },

    Write_ToBinary: function(w)
    {
        w.WriteBool(isRealNumber(this.type));
        if(isRealNumber(this.type))
        {
            w.WriteLong(this.type);
        }
        w.WriteBool(isRealObject(this.UniColor));
        if(isRealObject(this.UniColor))
        {
            this.UniColor.Write_ToBinary(w);
        }

    },

    Read_FromBinary: function(r)
    {
        if(r.GetBool())
        {
            (this.type) = r.GetLong();
        }

        if(r.GetBool())
        {
            this.UniColor = new CUniColor();
            this.UniColor.Read_FromBinary(r);
        }
    }
};

function CBulletSize()
{
    this.type = AscFormat.BULLET_TYPE_SIZE_NONE;
    this.val = 0;

}

CBulletSize.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    createDuplicate: function()
    {
        var d = new CBulletSize();
        d.type = this.type;
        d.val = this.val;
        return d;
    },

    Write_ToBinary: function(w)
    {
        w.WriteBool(isRealNumber(this.type));
        if(isRealNumber(this.type))
        {
            w.WriteLong(this.type);
        }

        w.WriteBool(isRealNumber(this.val));
        if(isRealNumber(this.val))
        {
            w.WriteLong(this.val);
        }

    },

    Read_FromBinary: function(r)
    {
        if(r.GetBool())
        {
            (this.type) = r.GetLong();
        }
        if(r.GetBool())
        {
            (this.val) = r.GetLong();
        }
    }
};

function CBulletTypeface()
{
    this.type = AscFormat.BULLET_TYPE_TYPEFACE_NONE;
    this.typeface = "";
}

CBulletTypeface.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    createDuplicate: function()
    {
        var d = new CBulletTypeface();
        d.type = this.type;
        d.typeface = this.typeface;
        return d;
    },

    Write_ToBinary: function(w)
    {
        w.WriteBool(isRealNumber(this.type));
        if(isRealNumber(this.type))
        {
            w.WriteLong(this.type);
        }

        w.WriteBool(typeof this.typeface === "string");
        if(typeof this.typeface === "string")
        {
            w.WriteString2(this.typeface);
        }

    },

    Read_FromBinary: function(r)
    {
        if(r.GetBool())
        {
            (this.type) = r.GetLong();
        }
        if(r.GetBool())
        {
            (this.typeface) = r.GetString2();
        }
    }
};

var BULLET_TYPE_BULLET_NONE		= 0;
var BULLET_TYPE_BULLET_CHAR		= 1;
var BULLET_TYPE_BULLET_AUTONUM	= 2;
var BULLET_TYPE_BULLET_BLIP		= 3;

function CBulletType()
{
    this.type = null;//BULLET_TYPE_BULLET_NONE;
    this.Char = "*";
    this.AutoNumType = 0;
    this.startAt = 1;
}

CBulletType.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    } ,

    Refresh_RecalcData: function()
    {},

    createDuplicate: function()
    {
        var d = new CBulletType();
        d.type = this.type;
        d.Char = this.Char;
        d.AutoNumType = this.AutoNumType;
        d.startAt = this.startAt;
        return d;
    },

    Write_ToBinary: function(w)
    {
        w.WriteBool(isRealNumber(this.type));
        if(isRealNumber(this.type))
        {
            w.WriteLong(this.type);
        }

        w.WriteBool(typeof this.Char === "string");
        if(typeof this.Char === "string")
        {
            w.WriteString2(this.Char);
        }

        w.WriteBool(isRealNumber(this.AutoNumType));
        if(isRealNumber(this.AutoNumType))
        {
            w.WriteLong(this.AutoNumType);
        }

        w.WriteBool(isRealNumber(this.startAt));
        if(isRealNumber(this.startAt))
        {
            w.WriteLong(this.startAt);
        }
    },

    Read_FromBinary: function(r)
    {
        if(r.GetBool())
        {
            (this.type) = r.GetLong();
        }
        if(r.GetBool())
        {
            (this.Char) = r.GetString2();
        }

        if(r.GetBool())
        {
            (this.AutoNumType) = r.GetLong();
        }

        if(r.GetBool())
        {
            (this.startAt) = r.GetLong();
        }
    }
};

function TextListStyle()
{
    this.levels = new Array(10);

    for (var i = 0; i < 10; i++)
        this.levels[i] = null;


}

TextListStyle.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    Refresh_RecalcData: function()
    {},

    createDuplicate: function()
    {
        var duplicate = new TextListStyle();
        for(var i=0; i<10; ++i)
        {
            if(this.levels[i]!=null)
            {
                duplicate.levels[i] = this.levels[i].Copy();
            }
        }
        return duplicate;
    },

    Write_ToBinary: function(w)
    {
        for(var i = 0; i < 10; ++i)
        {
            w.WriteBool(isRealObject(this.levels[i]));
            if(isRealObject(this.levels[i]))
            {
                this.levels[i].Write_ToBinary(w);
            }
        }
    },

    Read_FromBinary: function(r)
    {
        for(var i = 0; i < 10; ++i)
        {
            if(r.GetBool())
            {
                this.levels[i] = new CParaPr();
                this.levels[i].Read_FromBinary(r);
            }
            else
            {
                this.levels[i] = null;
            }
        }
    },


    Document_Get_AllFontNames: function(AllFonts){
        for(var i = 0; i < 10; ++i){
            if(this.levels[i] && this.levels[i].DefaultRunPr){
                this.levels[i].DefaultRunPr.Document_Get_AllFontNames(AllFonts);
            }
        }
    }
};

// DEFAULT OBJECTS
function GenerateDefaultTheme(presentation, opt_fontName)
{
    return ExecuteNoHistory(function()
    {
		if (!opt_fontName) {
			opt_fontName = "Arial";
		}
        var theme = new CTheme();
        theme.presentation = presentation;
        theme.setFontScheme(new FontScheme());
        theme.themeElements.fontScheme.setMajorFont(new FontCollection(theme.themeElements.fontScheme));
        theme.themeElements.fontScheme.setMinorFont(new FontCollection(theme.themeElements.fontScheme));
        theme.themeElements.fontScheme.majorFont.setLatin(opt_fontName);
        theme.themeElements.fontScheme.minorFont.setLatin(opt_fontName);


        var scheme = theme.themeElements.clrScheme;

        scheme.colors[8] = CreateUniColorRGB(0,0,0);
        scheme.colors[12] = CreateUniColorRGB(255,255,255);
        scheme.colors[9] = CreateUniColorRGB(0x1F,0x49, 0x7D);
        scheme.colors[13] = CreateUniColorRGB(0xEE,0xEC,0xE1);
        scheme.colors[0] = CreateUniColorRGB(0x4F, 0x81, 0xBD); //CreateUniColorRGB(0xFF, 0x81, 0xBD);//
        scheme.colors[1] = CreateUniColorRGB(0xC0,0x50,0x4D);
        scheme.colors[2] = CreateUniColorRGB(0x9B,0xBB,0x59);
        scheme.colors[3] = CreateUniColorRGB(0x80,0x64,0xA2);
        scheme.colors[4] = CreateUniColorRGB(0x4B,0xAC,0xC6);
        scheme.colors[5] = CreateUniColorRGB(0xF7,0x96,0x46);
        scheme.colors[11] = CreateUniColorRGB(0x00,0x00,0xFF);
        scheme.colors[10] = CreateUniColorRGB(0x80, 0x00, 0x80);

        // -------------- fill styles -------------------------
        var brush = new CUniFill();
        brush.setFill(new CSolidFill());
        brush.fill.setColor(new CUniColor());
        brush.fill.color.setColor(new CSchemeColor());
        brush.fill.color.color.setId(phClr);
        theme.themeElements.fmtScheme.fillStyleLst.push(brush);

        brush = new CUniFill();
        brush.setFill(new CSolidFill());
        brush.fill.setColor(new CUniColor());
        brush.fill.color.setColor(CreateUniColorRGB(0,0,0));
        theme.themeElements.fmtScheme.fillStyleLst.push(brush);

        brush = new CUniFill();
        brush.setFill(new CSolidFill());
        brush.fill.setColor(new CUniColor());
        brush.fill.color.setColor(CreateUniColorRGB(0,0,0));
        theme.themeElements.fmtScheme.fillStyleLst.push(brush);
        // ----------------------------------------------------

        // -------------- back styles -------------------------
        brush = new CUniFill();
        brush.setFill(new CSolidFill());
        brush.fill.setColor(new CUniColor());
        brush.fill.color.setColor(new CSchemeColor());
        brush.fill.color.color.setId(phClr);
        theme.themeElements.fmtScheme.bgFillStyleLst.push(brush);

        brush = new CUniFill();
        brush.setFill(new CSolidFill());
        brush.fill.setColor(new CUniColor());
        brush.fill.color.setColor(CreateUniColorRGB(0,0,0));
        theme.themeElements.fmtScheme.bgFillStyleLst.push(brush);

        brush = new CUniFill();
        brush.setFill(new CSolidFill());
        brush.fill.setColor(new CUniColor());
        brush.fill.color.setColor(CreateUniColorRGB(0,0,0));
        theme.themeElements.fmtScheme.bgFillStyleLst.push(brush);
        // ----------------------------------------------------

        var pen = new CLn();
        pen.setW(9525);
        pen.setFill(new CUniFill());
        pen.Fill.setFill(new CSolidFill());
        pen.Fill.fill.setColor(new CUniColor());
        pen.Fill.fill.color.setColor(new CSchemeColor());
        pen.Fill.fill.color.color.setId(phClr);
        pen.Fill.fill.color.setMods(new CColorModifiers());

        var mod = new CColorMod();
        mod.setName("shade");
        mod.setVal(95000);
        pen.Fill.fill.color.Mods.addMod(mod);
        mod = new CColorMod();
        mod.setName("satMod");
        mod.setVal(105000);
        pen.Fill.fill.color.Mods.addMod(mod);
        theme.themeElements.fmtScheme.lnStyleLst.push(pen);

        pen = new CLn();
        pen.setW(25400);
        pen.setFill(new CUniFill());
        pen.Fill.setFill(new CSolidFill());

        pen.Fill.fill.setColor(new CUniColor());
        pen.Fill.fill.color.setColor(new CSchemeColor());
        pen.Fill.fill.color.color.setId(phClr);
        theme.themeElements.fmtScheme.lnStyleLst.push(pen);

        pen = new CLn();
        pen.setW(38100);
        pen.setFill(new CUniFill());
        pen.Fill.setFill(new CSolidFill());
        pen.Fill.fill.setColor(new CUniColor());
        pen.Fill.fill.color.setColor(new CSchemeColor());
        pen.Fill.fill.color.color.setId(phClr);
        theme.themeElements.fmtScheme.lnStyleLst.push(pen);
        theme.extraClrSchemeLst = [];
        return theme;
    }, this, []);
}

function GenerateDefaultMasterSlide(theme)
{
    var master = new MasterSlide(theme.presentation, theme);
    master.Theme = theme;

    master.sldLayoutLst[0] = GenerateDefaultSlideLayout(master);

    return master;
}

function GenerateDefaultSlideLayout(master)
{
    var layout = new SlideLayout();
    layout.Theme = master.Theme;
    layout.Master = master;
    return layout;
}

function GenerateDefaultSlide(layout)
{
    var slide = new Slide(layout.Master.presentation, layout, 0);
    slide.Master = layout.Master;
    slide.Theme = layout.Master.Theme;
    return slide;
}

function CreateDefaultTextRectStyle()
{
    var style = new CShapeStyle();
    var lnRef = new StyleRef();
    lnRef.setIdx(0);
    var unicolor = new CUniColor();

    unicolor.setColor(new CSchemeColor());
    unicolor.color.setId(g_clr_accent1);
    var mod = new CColorMod();
    mod.setName("shade");
    mod.setVal(50000);
    unicolor.setMods(new CColorModifiers());
    unicolor.Mods.addMod(mod);
    lnRef.setColor(unicolor);
    style.setLnRef(lnRef);


    var fillRef = new StyleRef();
    fillRef.setIdx(0);
    unicolor = new CUniColor();
    unicolor.setColor(new CSchemeColor());
    unicolor.color.setId(g_clr_accent1);
    fillRef.setColor(unicolor);
    style.setFillRef(fillRef);


    var effectRef = new StyleRef();
    effectRef.setIdx(0);
    unicolor = new  CUniColor();
    unicolor.setColor(new CSchemeColor());
    unicolor.color.setId(g_clr_accent1);
    effectRef.setColor(unicolor);
    style.setEffectRef(effectRef);

    var fontRef = new FontRef();
    fontRef.setIdx(AscFormat.fntStyleInd_minor);
    unicolor = new CUniColor();
    unicolor.setColor(new CSchemeColor());
    unicolor.color.setId(8);
    fontRef.setColor(unicolor);
    style.setFontRef(fontRef);

    return style;
}

function GenerateDefaultColorMap()
{
    var clrMap = new ClrMap();

    clrMap.color_map[0] = 0;
    clrMap.color_map[1] = 1;
    clrMap.color_map[2] = 2;
    clrMap.color_map[3] = 3;
    clrMap.color_map[4] = 4;
    clrMap.color_map[5] = 5;
    clrMap.color_map[10] = 10;
    clrMap.color_map[11] = 11;
    clrMap.color_map[6] = 12;
    clrMap.color_map[7] = 13;
    clrMap.color_map[15] = 8;
    clrMap.color_map[16] = 9;

    return clrMap;

}

function CreateAscFill(unifill)
{
    if (null == unifill || null == unifill.fill)
        return new asc_CShapeFill();

    var ret = new asc_CShapeFill();

    var _fill = unifill.fill;
    switch (_fill.type)
    {
        case c_oAscFill.FILL_TYPE_SOLID:
        {
            ret.type = c_oAscFill.FILL_TYPE_SOLID;
            ret.fill = new Asc.asc_CFillSolid();
            ret.fill.color = CreateAscColor(_fill.color);
            break;
        }
        case c_oAscFill.FILL_TYPE_PATT:
        {
            ret.type = c_oAscFill.FILL_TYPE_PATT;
            ret.fill = new Asc.asc_CFillHatch();
            ret.fill.PatternType = _fill.ftype;
            ret.fill.fgClr = CreateAscColor(_fill.fgClr);
            ret.fill.bgClr = CreateAscColor(_fill.bgClr);
            break;
        }
        case c_oAscFill.FILL_TYPE_GRAD:
        {
            ret.type = c_oAscFill.FILL_TYPE_GRAD;
            ret.fill = new Asc.asc_CFillGrad();
            var bCheckTransparent = true, nLastTransparent = null, nLastTempTransparent, j, aMods;
            for (var i = 0; i < _fill.colors.length; i++)
            {
                if (0 == i)
                {
                    ret.fill.Colors = [];
                    ret.fill.Positions = [];
                }
                if(bCheckTransparent)
                {
                    if(_fill.colors[i].color.Mods)
                    {
                        aMods = _fill.colors[i].color.Mods.Mods;
                        nLastTempTransparent = null;
                        for(j = 0; j < aMods.length; ++j)
                        {
                            if(aMods[j].name === "alpha")
                            {
                                if(nLastTempTransparent === null)
                                {
                                    nLastTempTransparent = aMods[j].val;
                                    if(nLastTransparent === null)
                                    {
                                        nLastTransparent = nLastTempTransparent;
                                    }
                                    else
                                    {
                                        if(nLastTransparent !== nLastTempTransparent)
                                        {
                                            bCheckTransparent = false;
                                            break;
                                        }
                                    }
                                }
                                else
                                {
                                    bCheckTransparent = false;
                                    break;
                                }
                            }
                        }
                    }
                    else
                    {
                        bCheckTransparent = false;
                    }
                }
                ret.fill.Colors.push(CreateAscColor(_fill.colors[i].color));
                ret.fill.Positions.push(_fill.colors[i].pos);
            }
            if(bCheckTransparent && nLastTransparent !== null)
            {
                ret.transparent = (nLastTransparent/100000)*255;
            }

            if (_fill.lin)
            {
                ret.fill.GradType = c_oAscFillGradType.GRAD_LINEAR;
                ret.fill.LinearAngle = _fill.lin.angle;
                ret.fill.LinearScale = _fill.lin.scale;
            }
            else if(_fill.path)
            {
                ret.fill.GradType = c_oAscFillGradType.GRAD_PATH;
                ret.fill.PathType = 0;
            }

            break;
        }
        case c_oAscFill.FILL_TYPE_BLIP:
        {
            ret.type = c_oAscFill.FILL_TYPE_BLIP;
            ret.fill = new Asc.asc_CFillBlip();

            ret.fill.url = _fill.RasterImageId;
            ret.fill.type = (_fill.tile == null) ? c_oAscFillBlipType.STRETCH : c_oAscFillBlipType.TILE;
            break;
        }
        case c_oAscFill.FILL_TYPE_NOFILL:
        case c_oAscFill.FILL_TYPE_NONE:
        {
            ret.type = c_oAscFill.FILL_TYPE_NOFILL;
            break;
        }
        default:
            break;
    }

    if(isRealNumber(unifill.transparent))
    {
        ret.transparent = unifill.transparent;
    }
    return ret;
}
function CorrectUniFill(asc_fill, unifill, editorId)
{
    if (null == asc_fill)
        return unifill;

    var ret = unifill;
    if (null == ret)
        ret = new CUniFill();

    var _fill = asc_fill.fill;
    var _type = asc_fill.type;

    if (null != _type)
    {
        switch (_type)
        {
            case c_oAscFill.FILL_TYPE_NOFILL:
            {
                ret.fill = new CNoFill();
                break;
            }
            case c_oAscFill.FILL_TYPE_GRP:
            {
                ret.fill = new CGrpFill();
                break;
            }
            case c_oAscFill.FILL_TYPE_BLIP:
            {

                var _url = _fill.url;
                var _tx_id = _fill.texture_id;
                if (null != _tx_id && (0 <= _tx_id) && (_tx_id < AscCommon.g_oUserTexturePresets.length))
                {
                    _url = AscCommon.g_oUserTexturePresets[_tx_id];
                }


                if (ret.fill == null)
                {
                    ret.fill = new CBlipFill();
                }

                if(ret.fill.type != c_oAscFill.FILL_TYPE_BLIP)
                {
                    if(!(typeof (_url) === "string" && _url.length > 0) || !isRealNumber(_fill.type))
                    {
                        break;
                    }
                    ret.fill = new CBlipFill();
                }

                if (_url != null && _url !== undefined && _url != "")
                    ret.fill.setRasterImageId(_url);

                if (ret.fill.RasterImageId == null)
                    ret.fill.RasterImageId = "";

                var tile = _fill.type;
                if (tile == c_oAscFillBlipType.STRETCH)
                    ret.fill.tile = null;
                else if (tile == c_oAscFillBlipType.TILE)
                    ret.fill.tile = new CBlipFillTile();
                break;
            }
            case c_oAscFill.FILL_TYPE_PATT:
            {
                if (ret.fill == null)
                {
                    ret.fill = new CPattFill();
                }

                if(ret.fill.type != c_oAscFill.FILL_TYPE_PATT)
                {
                    if(undefined != _fill.PatternType && undefined != _fill.fgClr && undefined != _fill.bgClr)
                    {
                        ret.fill = new CPattFill();
                    }
                    else
                    {
                        break;
                    }
                }

                if (undefined != _fill.PatternType)
                {
                    ret.fill.ftype = _fill.PatternType;
                }
                if (undefined != _fill.fgClr)
                {
                    ret.fill.fgClr = CorrectUniColor(_fill.fgClr, ret.fill.fgClr, editorId);
                }
                if(!ret.fill.fgClr)
                {
                    ret.fill.fgClr = CreateUniColorRGB(0, 0, 0);
                }
                if (undefined != _fill.bgClr)
                {
                    ret.fill.bgClr = CorrectUniColor(_fill.bgClr, ret.fill.bgClr, editorId);
                }
                if(!ret.fill.bgClr)
                {
                    ret.fill.bgClr = CreateUniColorRGB(0, 0, 0);
                }

                break;
            }
            case c_oAscFill.FILL_TYPE_GRAD:
            {
                if (ret.fill == null)
                {
                    ret.fill = new CGradFill();
                }

                var _colors     = _fill.Colors;
                var _positions  = _fill.Positions;

                if(ret.fill.type != c_oAscFill.FILL_TYPE_GRAD )
                {
                    if(undefined != _colors && undefined != _positions)
                    {
                        ret.fill = new CGradFill();
                    }
                    else
                    {
                        break;
                    }
                }

                if (undefined != _colors && undefined != _positions)
                {
                    if (_colors.length == _positions.length)
                    {
                        if(ret.fill.colors.length === _colors.length){
                            for (var i = 0; i < _colors.length; i++){
                                var _gs = ret.fill.colors[i] ? ret.fill.colors[i] : new CGs();
                                _gs.color = CorrectUniColor(_colors[i], _gs.color, editorId);
                                _gs.pos = _positions[i];
                                ret.fill.colors[i] = _gs;
                            }
                        }
                        else{
                            for (var i = 0; i < _colors.length; i++){
                                var _gs = new CGs();
                                _gs.color = CorrectUniColor(_colors[i], _gs.color, editorId);
                                _gs.pos = _positions[i];

                                ret.fill.colors.push(_gs);
                            }
                        }
                    }
                }
                else if (undefined != _colors)
                {
                    if (_colors.length == ret.fill.colors.length)
                    {
                        for (var i = 0; i < _colors.length; i++)
                        {
                            ret.fill.colors[i].color = CorrectUniColor(_colors[i], ret.fill.colors[i].color, editorId);
                        }
                    }
                }
                else if (undefined != _positions)
                {
                    if (_positions.length <= ret.fill.colors.length)
                    {
                        if(_positions.length < ret.fill.colors.length)
                        {
                            ret.fill.colors.splice(_positions.length, ret.fill.colors.length - _positions.length);
                        }
                        for (var i = 0; i < _positions.length; i++)
                        {
                            ret.fill.colors[i].pos = _positions[i];
                        }
                    }
                }

                var _grad_type = _fill.GradType;

                if (c_oAscFillGradType.GRAD_LINEAR == _grad_type)
                {
                    var _angle = _fill.LinearAngle;
                    var _scale = _fill.LinearScale;

                    if (!ret.fill.lin)
                        ret.fill.lin = new GradLin();

                    if (undefined != _angle)
                        ret.fill.lin.angle = _angle;
                    if (undefined != _scale)
                        ret.fill.lin.scale = _scale;
                    ret.fill.path = null;
                }
                else if (c_oAscFillGradType.GRAD_PATH == _grad_type)
                {
                    ret.fill.lin = null;
                    ret.fill.path = new GradPath();
                }
                break;
            }
            default:
            {
                if (ret.fill == null || ret.fill.type != c_oAscFill.FILL_TYPE_SOLID)
                {
                    ret.fill = new CSolidFill();
                }
                ret.fill.color = CorrectUniColor(_fill.color, ret.fill.color, editorId);
            }
        }
    }

    var _alpha = asc_fill.transparent;
    if (null != _alpha)
        ret.transparent = _alpha;

    return ret;
}
// эта функция ДОЛЖНА минимизироваться
function CreateAscStroke(ln, _canChangeArrows)
{
    if (null == ln || null == ln.Fill || ln.Fill.fill == null)
        return new Asc.asc_CStroke();

    var ret = new Asc.asc_CStroke();

    var _fill = ln.Fill.fill;
    if(_fill != null)
    {
        switch (_fill.type)
        {
            case c_oAscFill.FILL_TYPE_BLIP:
            {
                break;
            }
            case c_oAscFill.FILL_TYPE_SOLID:
            {
                ret.color = CreateAscColor(_fill.color);
                ret.type = c_oAscStrokeType.STROKE_COLOR;
                break;
            }
            case c_oAscFill.FILL_TYPE_GRAD:
            {
                var _c = _fill.colors;
                if (_c != 0)
                {
                    ret.color = CreateAscColor(_fill.colors[0].color);
                    ret.type = c_oAscStrokeType.STROKE_COLOR;
                }

                break;
            }
            case c_oAscFill.FILL_TYPE_PATT:
            {
                ret.color = CreateAscColor(_fill.fgClr);
                ret.type = c_oAscStrokeType.STROKE_COLOR;
                break;
            }
            case c_oAscFill.FILL_TYPE_NOFILL:
            {
                ret.color = null;
                ret.type = c_oAscStrokeType.STROKE_NONE;
                break;
            }
            default:
            {
                break;
            }
        }

    }


    ret.width = (ln.w == null) ? 12700 : (ln.w >> 0);
    ret.width /= 36000.0;

    if (ln.cap != null)
        ret.asc_putLinecap(ln.cap);

    if (ln.Join != null)
        ret.asc_putLinejoin(ln.Join.type);

    if (ln.headEnd != null)
    {
        ret.asc_putLinebeginstyle((ln.headEnd.type == null) ? LineEndType.None : ln.headEnd.type);

        var _len = (null == ln.headEnd.len) ? 1 : (2 - ln.headEnd.len);
        var _w = (null == ln.headEnd.w) ? 1 : (2 - ln.headEnd.w);

        ret.asc_putLinebeginsize(_w * 3 + _len);
    }
    else
    {
        ret.asc_putLinebeginstyle(LineEndType.None);
    }

    if (ln.tailEnd != null)
    {
        ret.asc_putLineendstyle((ln.tailEnd.type == null) ? LineEndType.None : ln.tailEnd.type);

        var _len = (null == ln.tailEnd.len) ? 1 : (2 - ln.tailEnd.len);
        var _w = (null == ln.tailEnd.w) ? 1 : (2 - ln.tailEnd.w);

        ret.asc_putLineendsize(_w * 3 + _len);
    }
    else
    {
        ret.asc_putLineendstyle(LineEndType.None);
    }
    if(AscFormat.isRealNumber(ln.prstDash)){
        ret.prstDash = ln.prstDash;
    }
    else if(ln.prstDash === null){
        ret.prstDash = Asc.c_oDashType.solid;
    }
    if (true === _canChangeArrows)
        ret.canChangeArrows = true;

    return ret;
}

function CorrectUniStroke(asc_stroke, unistroke, flag)
{
    if (null == asc_stroke)
        return unistroke;

    var ret = unistroke;
    if (null == ret)
        ret = new CLn();

    var _type = asc_stroke.type;
    var _w = asc_stroke.width;

    if (_w != null && _w !== undefined)
        ret.w = _w * 36000.0;

    var _color = asc_stroke.color;
    if (_type == c_oAscStrokeType.STROKE_NONE)
    {
        ret.Fill = new CUniFill();
        ret.Fill.fill = new CNoFill();
    }
    else if (_type != null)
    {
        if (null != _color && undefined !== _color)
        {
            ret.Fill = new CUniFill();
            ret.Fill.type = c_oAscFill.FILL_TYPE_SOLID;
            ret.Fill.fill = new CSolidFill();
            ret.Fill.fill.color = CorrectUniColor(_color, ret.Fill.fill.color, flag);
        }
    }

    var _join = asc_stroke.LineJoin;
    if (null != _join)
    {
        ret.Join = new LineJoin();
        ret.Join.type = _join;
    }

    var _cap = asc_stroke.LineCap;
    if (null != _cap)
    {
        ret.cap = _cap;
    }

    var _begin_style = asc_stroke.LineBeginStyle;
    if (null != _begin_style)
    {
        if (ret.headEnd == null)
            ret.headEnd = new EndArrow();

        ret.headEnd.type = _begin_style;
    }

    var _end_style = asc_stroke.LineEndStyle;
    if (null != _end_style)
    {
        if (ret.tailEnd == null)
            ret.tailEnd = new EndArrow();

        ret.tailEnd.type = _end_style;
    }

    var _begin_size = asc_stroke.LineBeginSize;
    if (null != _begin_size)
    {
        if (ret.headEnd == null)
            ret.headEnd = new EndArrow();

        ret.headEnd.w = 2 - ((_begin_size/3) >> 0);
        ret.headEnd.len = 2 - (_begin_size % 3);
    }

    var _end_size = asc_stroke.LineEndSize;
    if (null != _end_size)
    {
        if (ret.tailEnd == null)
            ret.tailEnd = new EndArrow();

        ret.tailEnd.w = 2 - ((_end_size/3) >> 0);
        ret.tailEnd.len = 2 - (_end_size % 3);
    }
    if(AscFormat.isRealNumber(asc_stroke.prstDash)){
        ret.prstDash = asc_stroke.prstDash;
    }
    return ret;
}

// эта функция ДОЛЖНА минимизироваться
function CreateAscShapeProp(shape)
{
    if (null == shape)
        return new asc_CShapeProperty();

    var ret = new asc_CShapeProperty();
    ret.fill = CreateAscFill(shape.brush);
    ret.stroke = CreateAscStroke(shape.pen);
    ret.lockAspect = shape.getNoChangeAspect();
    var paddings = null;
    if(shape.textBoxContent)
    {
        var body_pr = shape.bodyPr;
        paddings = new asc_CPaddings();
        if(typeof body_pr.lIns === "number")
            paddings.Left = body_pr.lIns;
        else
            paddings.Left = 2.54;

        if(typeof body_pr.tIns === "number")
            paddings.Top = body_pr.tIns;
        else
            paddings.Top = 1.27;

        if(typeof body_pr.rIns === "number")
            paddings.Right = body_pr.rIns;
        else
            paddings.Right = 2.54;

        if(typeof body_pr.bIns === "number")
            paddings.Bottom = body_pr.bIns;
        else
            paddings.Bottom = 1.27;
    }
    return ret;
}

function CreateAscShapePropFromProp(shapeProp)
{
    var obj = new asc_CShapeProperty();
    if(!isRealObject(shapeProp))
        return obj;
    if(isRealBool(shapeProp.locked))
    {
        obj.Locked = shapeProp.locked;
    }
    obj.lockAspect = shapeProp.lockAspect;
    if(typeof shapeProp.type === "string")
        obj.type = shapeProp.type;
    if(isRealObject(shapeProp.fill))
        obj.fill = CreateAscFill(shapeProp.fill);
    if(isRealObject(shapeProp.stroke))
        obj.stroke = CreateAscStroke(shapeProp.stroke, shapeProp.canChangeArrows);
    if(isRealObject(shapeProp.paddings))
        obj.paddings = shapeProp.paddings;
    if(shapeProp.canFill === true || shapeProp.canFill === false)
    {
        obj.canFill = shapeProp.canFill;
    }
    obj.bFromChart = shapeProp.bFromChart;
    obj.w = shapeProp.w;
    obj.h = shapeProp.h;
    obj.vert = shapeProp.vert;
    obj.verticalTextAlign = shapeProp.verticalTextAlign;
    if(shapeProp.textArtProperties)
    {
        obj.textArtProperties = CreateAscTextArtProps(shapeProp.textArtProperties);
    }
    obj.title = shapeProp.title;
    obj.description = shapeProp.description;
    obj.columnNumber = shapeProp.columnNumber;
    obj.columnSpace = shapeProp.columnSpace;
    return obj;
}

function CorrectShapeProp(asc_shape_prop, shape)
{
    if (null == shape || null == asc_shape_prop)
        return;

    shape.spPr.Fill = CorrectUniFill(asc_shape_prop.asc_getFill(), shape.spPr.Fill);
    shape.spPr.ln = CorrectUniFill(asc_shape_prop.asc_getStroke(), shape.spPr.ln);
}


function CreateAscTextArtProps(oTextArtProps)
{
    if(!oTextArtProps)
    {
        return undefined;
    }
    var oRet = new Asc.asc_TextArtProperties();
    if(oTextArtProps.Fill)
    {
        oRet.asc_putFill(CreateAscFill(oTextArtProps.Fill));
    }
    if(oTextArtProps.Line)
    {
        oRet.asc_putLine(CreateAscStroke(oTextArtProps.Line, false));
    }
    oRet.asc_putForm(oTextArtProps.Form);
    return oRet;
}

function CreateUnifillFromAscColor(asc_color, editorId)
{
    var Unifill = new CUniFill();
    Unifill.fill = new CSolidFill();
    Unifill.fill.color = CorrectUniColor(asc_color, Unifill.fill.color, editorId);
    return Unifill;
}

function CorrectUniColor(asc_color, unicolor, flag)
{
    if (null == asc_color)
        return unicolor;

    var ret = unicolor;
    if (null == ret)
        ret = new CUniColor();

    var _type = asc_color.asc_getType();
    switch (_type)
    {
        case c_oAscColor.COLOR_TYPE_PRST:
        {
            if (ret.color == null || ret.color.type != c_oAscColor.COLOR_TYPE_PRST)
            {
                ret.color = new CPrstColor();
            }
            ret.color.id = asc_color.value;

            if (ret.Mods.Mods.length != 0)
                ret.Mods.Mods.splice(0, ret.Mods.Mods.length);
            break;
        }
        case c_oAscColor.COLOR_TYPE_SCHEME:
        {
            if (ret.color == null || ret.color.type != c_oAscColor.COLOR_TYPE_SCHEME)
            {
                ret.color = new CSchemeColor();
            }

            // тут выставляется ТОЛЬКО из меню. поэтому:
            var _index = parseInt(asc_color.value);
            if(isNaN(_index))
                break;
            var _id = (_index / 6) >> 0;
            var _pos = _index - _id * 6;

            var array_colors_types = [6, 15, 7, 16, 0, 1, 2, 3, 4, 5];
            ret.color.id = array_colors_types[_id];
            if(!ret.Mods)
            {
                ret.setMods(new CColorModifiers());
            }

            if (ret.Mods.Mods.length != 0)
                ret.Mods.Mods.splice(0, ret.Mods.Mods.length);

            var __mods = null;

            var _flag;
            if (editor && editor.WordControl && editor.WordControl.m_oDrawingDocument && editor.WordControl.m_oDrawingDocument.GuiControlColorsMap)
            {
                var _map = editor.WordControl.m_oDrawingDocument.GuiControlColorsMap;
                _flag = isRealNumber(flag) ? flag : 1;
                __mods = AscCommon.GetDefaultMods(_map[_id].r, _map[_id].g, _map[_id].b, _pos, _flag);
            }
            else
            {
                var _editor = window["Asc"] && window["Asc"]["editor"];
                if (_editor && _editor.wbModel)
                {
                    var _theme = _editor.wbModel.theme;
                    var _clrMap = _editor.wbModel.clrSchemeMap;

                    if (_theme && _clrMap)
                    {
                        var _schemeClr = new CSchemeColor();
                        _schemeClr.id = array_colors_types[_id];

                        var _rgba = {R:0, G:0, B:0, A:255};
                        _schemeClr.Calculate(_theme, _clrMap.color_map, _rgba);
                        _flag = isRealNumber(flag) ? flag : 0;
                        __mods = AscCommon.GetDefaultMods(_schemeClr.RGBA.R, _schemeClr.RGBA.G, _schemeClr.RGBA.B, _pos, _flag);
                    }
                }
            }

            if (null != __mods)
            {
                ret.Mods.Mods = __mods;
            }

            break;
        }
        default:
        {
            if (ret.color == null || ret.color.type != c_oAscColor.COLOR_TYPE_SRGB)
            {
                ret.color = new CRGBColor();
            }
            ret.color.RGBA.R = asc_color.r;
            ret.color.RGBA.G = asc_color.g;
            ret.color.RGBA.B = asc_color.b;
            ret.color.RGBA.A = asc_color.a;

            if (ret.Mods && ret.Mods.Mods.length != 0)
                ret.Mods.Mods.splice(0, ret.Mods.Mods.length);
        }
    }
    return ret;
}

    function deleteDrawingBase(aObjects, graphicId)
    {
        var position = null;
        for (var i = 0; i < aObjects.length; i++) {
            if ( aObjects[i].graphicObject.Get_Id() == graphicId ) {
                aObjects.splice(i, 1);
                position = i;
                break;
            }
        }
        return position;
    }


    /* Common Functions For Builder*/
    function builder_CreateShape(sType, nWidth, nHeight, oFill, oStroke, oParent, oTheme, oDrawingDocument, bWord){
        var oShapeTrack = new AscFormat.NewShapeTrack(sType, 0, 0, oTheme, null, null, null, 0);
        oShapeTrack.track({}, nWidth, nHeight);
        var oShape = oShapeTrack.getShape(bWord === true, oDrawingDocument, null);
        oShape.setParent(oParent);
        if(bWord){
            oShape.createTextBoxContent();
        }
        else{
            oShape.createTextBody();
        }
        oShape.spPr.setFill(oFill);
        oShape.spPr.setLn(oStroke);
        return oShape;
    }

    function builder_CreateChart(nW, nH, sType, aCatNames, aSeriesNames, aSeries, nStyleIndex){
        var settings = new AscCommon.asc_ChartSettings();
        switch (sType)
        {
            case "bar" :
            {
                settings.type = Asc.c_oAscChartTypeSettings.barNormal;
                break;
            }
            case "barStacked":
            {
                settings.type = Asc.c_oAscChartTypeSettings.barStacked;
                break;
            }
            case "barStackedPercent":
            {
                settings.type = Asc.c_oAscChartTypeSettings.barStackedPer;
                break;
            }
            case "bar3D":
            {
                settings.type = Asc.c_oAscChartTypeSettings.barNormal3d;
                break;
            }
            case "barStacked3D":
            {
                settings.type = Asc.c_oAscChartTypeSettings.barStacked3d;
                break;
            }
            case "barStackedPercent3D":
            {
                settings.type = Asc.c_oAscChartTypeSettings.barStackedPer3d;
                break;
            }
            case "barStackedPercent3DPerspective":
            {
                settings.type = Asc.c_oAscChartTypeSettings.barNormal3dPerspective;
                break;
            }
            case "horizontalBar":
            {
                settings.type = Asc.c_oAscChartTypeSettings.hBarNormal;
                break;
            }
            case "horizontalBarStacked":
            {
                settings.type = Asc.c_oAscChartTypeSettings.hBarStacked;
                break;
            }
            case "horizontalBarStackedPercent":
            {
                settings.type = Asc.c_oAscChartTypeSettings.hBarStackedPer;
                break;
            }
            case "horizontalBar3D":
            {
                settings.type = Asc.c_oAscChartTypeSettings.hBarNormal3d;
                break;
            }
            case "horizontalBarStacked3D":
            {
                settings.type = Asc.c_oAscChartTypeSettings.hBarStacked3d;
                break;
            }
            case "horizontalBarStackedPercent3D":
            {
                settings.type = Asc.c_oAscChartTypeSettings.hBarStackedPer3d;
                break;
            }
            case "lineNormal":
            {
                settings.type = Asc.c_oAscChartTypeSettings.lineNormal;
                break;
            }
            case "lineStacked":
            {
                settings.type = Asc.c_oAscChartTypeSettings.lineStacked;
                break;
            }
            case "lineStackedPercent":
            {
                settings.type = Asc.c_oAscChartTypeSettings.lineStackedPer;
                break;
            }
            case "line3D":
            {
                settings.type = Asc.c_oAscChartTypeSettings.line3d;
                break;
            }
            case "pie":
            {
                settings.type = Asc.c_oAscChartTypeSettings.pie;
                break;
            }
            case "pie3D":
            {
                settings.type = Asc.c_oAscChartTypeSettings.pie3d;
                break;
            }
            case "doughnut":
            {
                settings.type = Asc.c_oAscChartTypeSettings.doughnut;
                break;
            }
            case "scatter":
            {
                settings.type = Asc.c_oAscChartTypeSettings.scatter;
                break;
            }
            case "stock":
            {
                settings.type = Asc.c_oAscChartTypeSettings.stock;
                break;
            }
            case "area":
            {
                settings.type = Asc.c_oAscChartTypeSettings.areaNormal;
                break;
            }
            case "areaStacked":
            {
                settings.type = Asc.c_oAscChartTypeSettings.areaStacked;
                break;
            }
            case "areaStackedPercent":
            {
                settings.type = Asc.c_oAscChartTypeSettings.areaStackedPer;
                break;
            }
        }
        var aAscSeries = [];
        var aAlphaBet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var oCat, i;
        if(aCatNames.length > 0)
        {
            var aNumCache = [];
            for(i = 0; i < aCatNames.length; ++i)
            {
                aNumCache.push({val: aCatNames[i] + ""});
            }
            oCat = { Formula: "Sheet1!$B$1:$" + AscFormat.CalcLiterByLength(aAlphaBet, aCatNames.length) + "$1", NumCache: aNumCache };
        }
        for(i = 0; i < aSeries.length; ++i)
        {
            var oAscSeries = new AscFormat.asc_CChartSeria();
            oAscSeries.Val.NumCache = [];
            var aData = aSeries[i];
            var sEndLiter = AscFormat.CalcLiterByLength(aAlphaBet, aData.length);
            oAscSeries.Val.Formula = 'Sheet1!' + '$B$' + (i + 2) + ':$' + sEndLiter + '$' + (i + 2);
            if(aSeriesNames[i])
            {
                oAscSeries.TxCache.Formula =  'Sheet1!' + '$A$' + (i + 2);
                oAscSeries.TxCache.Tx = aSeriesNames[i];
            }
            if(oCat)
            {
                oAscSeries.Cat = oCat;
            }
            for(var j = 0; j < aData.length; ++j)
            {

                oAscSeries.Val.NumCache.push({ numFormatStr: "General", isDateTimeFormat: false, val: aData[j], isHidden: false });
            }
            aAscSeries.push(oAscSeries);
        }
        var chartSeries = {series: aAscSeries, parsedHeaders: {bLeft: true, bTop: true}};

        var oChartSpace = AscFormat.DrawingObjectsController.prototype._getChartSpace(chartSeries, settings, true);
        if(!oChartSpace)
        {
            return null;
        }
        oChartSpace.setBDeleted(false);
        oChartSpace.extX = nW;
        oChartSpace.extY = nH;
        if(AscFormat.isRealNumber(nStyleIndex)){
            oChartSpace.setStyle(nStyleIndex);
        }
        AscFormat.CheckSpPrXfrm(oChartSpace);
        return oChartSpace;
    }

    function builder_CreateGroup(aDrawings, oController){
        if(!oController){
            return null;
        }
        var aForGroup = [];
        for(var i = 0; i < aDrawings.length; ++i){
            if(!aDrawings[i].Drawing || !aDrawings[i].Drawing.canGroup()){
                return null;
            }
            aForGroup.push(aDrawings[i].Drawing);
        }
        return oController.getGroup(aForGroup);
    }

    function builder_CreateSchemeColor(sColorId){
        var oUniColor = new AscFormat.CUniColor();
        oUniColor.setColor(new AscFormat.CSchemeColor());
        switch(sColorId)
        {
            case "accent1": {  oUniColor.color.id  = 0; break;}
            case "accent2": {  oUniColor.color.id  = 1; break;}
            case "accent3": {  oUniColor.color.id  = 2; break;}
            case "accent4": {  oUniColor.color.id  = 3; break;}
            case "accent5": {  oUniColor.color.id  = 4; break;}
            case "accent6": {  oUniColor.color.id  = 5; break;}
            case "bg1": {  oUniColor.color.id      = 6; break;}
            case "bg2": {  oUniColor.color.id      = 7; break;}
            case "dk1": {  oUniColor.color.id      = 8; break;}
            case "dk2": {  oUniColor.color.id      = 9; break;}
            case "lt1": {  oUniColor.color.id      = 12; break;}
            case "lt2": {  oUniColor.color.id      = 13; break;}
            case "tx1": {  oUniColor.color.id      = 15; break;}
            case "tx2": {  oUniColor.color.id      = 16; break;}
            default: {  oUniColor.color.id      = 16; break;}
        }
        return oUniColor;
    }

    function builder_CreatePresetColor(sPresetColor){
        var oUniColor = new AscFormat.CUniColor();
        oUniColor.setColor(new AscFormat.CPrstColor());
        oUniColor.color.id = sPresetColor;
        return oUniColor;
    }

    function builder_CreateGradientStop(oUniColor, nPos){
        var Gs = new AscFormat.CGs();
        Gs.pos = nPos;
        Gs.color = oUniColor;
        return Gs;
    }

    function builder_CreateGradient(aGradientStop){
        var oUniFill = new AscFormat.CUniFill();
        oUniFill.fill = new AscFormat.CGradFill();
        for(var i = 0; i < aGradientStop.length; ++i)
        {
            oUniFill.fill.colors.push(aGradientStop[i].Gs);
        }
        return oUniFill;
    }

    function builder_CreateLinearGradient(aGradientStop, Angle){
        var oUniFill = builder_CreateGradient(aGradientStop);
        oUniFill.fill.lin = new AscFormat.GradLin();
        if(!AscFormat.isRealNumber(Angle)){
            oUniFill.fill.lin.angle = 0;
        }
        else{
            oUniFill.fill.lin.angle = Angle;
        }
        return oUniFill;
    }

    function builder_CreateRadialGradient(aGradientStop){
        var oUniFill = builder_CreateGradient(aGradientStop);
        oUniFill.fill.path = new AscFormat.GradPath();
        return oUniFill;
    }

    function builder_CreatePatternFill(sPatternType, BgColor, FgColor){
        var oUniFill = new AscFormat.CUniFill();
        oUniFill.fill = new AscFormat.CPattFill();
        oUniFill.fill.ftype = AscCommon.global_hatch_offsets[sPatternType];
        oUniFill.fill.fgClr = FgColor.Unicolor;
        oUniFill.fill.bgClr = BgColor.Unicolor;
        return oUniFill;
    }

    function builder_CreateBlipFill(sImageUrl, sBlipFillType){
        var oUniFill = new AscFormat.CUniFill();
        oUniFill.fill = new AscFormat.CBlipFill();
        oUniFill.fill.RasterImageId = sImageUrl;
        if(sBlipFillType === "tile")
        {
            oUniFill.fill.tile = new AscFormat.CBlipFillTile();
        }
        else if(sBlipFillType === "stretch")
        {
            oUniFill.fill.stretch = true;
        }
        return oUniFill;
    }

    function builder_CreateLine(nWidth, oFill) {
        if(nWidth === 0)
        {
            return new AscFormat.CreateNoFillLine();
        }
        var oLn = new AscFormat.CLn();
        oLn.w = nWidth;
        oLn.Fill = oFill.UniFill;
        return oLn;
    }

    function builder_CreateChartTitle(sTitle, nFontSize, bIsBold, oDrawingDocument){
        if(typeof sTitle === "string" && sTitle.length > 0){
            var oTitle = new AscFormat.CTitle();
            oTitle.setOverlay(false);
            oTitle.setTx(new AscFormat.CChartText());
            var oTextBody = AscFormat.CreateTextBodyFromString(sTitle, oDrawingDocument, oTitle.tx);
            if(AscFormat.isRealNumber(nFontSize)){
                oTextBody.content.Set_ApplyToAll(true);
                oTextBody.content.AddToParagraph(new ParaTextPr({ FontSize : nFontSize, Bold: bIsBold}));
                oTextBody.content.Set_ApplyToAll(false);
            }
            oTitle.tx.setRich(oTextBody);
            return oTitle;
        }
        return null;
    }


    function builder_CreateTitle(sTitle, nFontSize, bIsBold, oChartSpace)
    {
        if(typeof sTitle === "string" && sTitle.length > 0){
            var oTitle = new AscFormat.CTitle();
            oTitle.setOverlay(false);
            oTitle.setTx(new AscFormat.CChartText());
            var oTextBody = AscFormat.CreateTextBodyFromString(sTitle, oChartSpace.getDrawingDocument(), oTitle.tx);
            if(AscFormat.isRealNumber(nFontSize)){
                oTextBody.content.Set_ApplyToAll(true);
                oTextBody.content.AddToParagraph(new ParaTextPr({ FontSize : nFontSize, Bold: bIsBold}));
                oTextBody.content.Set_ApplyToAll(false);
            }
            oTitle.tx.setRich(oTextBody);
            return oTitle;
        }
        return null;
    }

    function builder_SetChartTitle(oChartSpace, sTitle, nFontSize, bIsBold){
        if(oChartSpace){
            oChartSpace.chart.setTitle(builder_CreateChartTitle(sTitle, nFontSize, bIsBold, oChartSpace.getDrawingDocument()));
        }
    }

    function builder_SetChartHorAxisTitle(oChartSpace, sTitle, nFontSize, bIsBold){
        if(oChartSpace){
            var horAxis = oChartSpace.chart.plotArea.getHorizontalAxis();
            if(horAxis){
                horAxis.setTitle(builder_CreateTitle(sTitle, nFontSize, bIsBold, oChartSpace));
            }
        }
    }

    function builder_SetChartVertAxisTitle(oChartSpace, sTitle, nFontSize, bIsBold){
        if(oChartSpace){
            var verAxis = oChartSpace.chart.plotArea.getVerticalAxis();
            if(verAxis)
            {
                if(typeof sTitle === "string" && sTitle.length > 0)
                {
                    verAxis.setTitle(builder_CreateTitle(sTitle, nFontSize, bIsBold, oChartSpace));
                    if(verAxis.title){
                        var _body_pr = new AscFormat.CBodyPr();
                        _body_pr.reset();
                        if(!verAxis.title.txPr)
                        {
                            verAxis.title.setTxPr(AscFormat.CreateTextBodyFromString("", oChartSpace.getDrawingDocument(), verAxis.title));
                        }
                        var _text_body =  verAxis.title.txPr;
                        _text_body.setBodyPr(_body_pr);
                        verAxis.title.setOverlay(false);
                    }
                }
                else
                {
                    verAxis.setTitle(null);
                }
            }
        }
    }

    function builder_SetChartVertAxisOrientation(oChartSpace, bIsMinMax) {
        if(oChartSpace){
            var verAxis = oChartSpace.chart.plotArea.getVerticalAxis();
            if(verAxis)
            {
                if(!verAxis.scaling)
                    verAxis.setScaling(new CScaling());
                var scaling = verAxis.scaling;
                if(bIsMinMax){
                    scaling.setOrientation(AscFormat.ORIENTATION_MIN_MAX);
                }
                else{
                    scaling.setOrientation(AscFormat.ORIENTATION_MAX_MIN);
                }
            }
        }
    }

    function builder_SetChartHorAxisOrientation(oChartSpace, bIsMinMax){
        if(oChartSpace){
            var horAxis = oChartSpace.chart.plotArea.getHorizontalAxis();
            if(horAxis){
                if(!horAxis.scaling)
                    horAxis.setScaling(new CScaling());
                var scaling = horAxis.scaling;
                if(bIsMinMax){
                    scaling.setOrientation(AscFormat.ORIENTATION_MIN_MAX);
                }
                else{
                    scaling.setOrientation(AscFormat.ORIENTATION_MAX_MIN);
                }
            }
        }
    }

    function builder_SetChartLegendPos(oChartSpace, sLegendPos){

        if(oChartSpace && oChartSpace.chart)
        {
            if(sLegendPos === "none")
            {
                if(oChartSpace.chart.legend)
                {
                    oChartSpace.chart.setLegend(null);
                }
            }
            else
            {
                var nLegendPos = null;
                switch(sLegendPos)
                {
                    case "left":
                    {
                        nLegendPos = Asc.c_oAscChartLegendShowSettings.left;
                        break;
                    }
                    case "top":
                    {
                        nLegendPos = Asc.c_oAscChartLegendShowSettings.top;
                        break;
                    }
                    case "right":
                    {
                        nLegendPos = Asc.c_oAscChartLegendShowSettings.right;
                        break;
                    }
                    case "bottom":
                    {
                        nLegendPos = Asc.c_oAscChartLegendShowSettings.bottom;
                        break;
                    }
                }
                if(null !== nLegendPos)
                {
                    if(!oChartSpace.chart.legend)
                    {
                        oChartSpace.chart.setLegend(new AscFormat.CLegend());
                    }
                    if(oChartSpace.chart.legend.legendPos !== nLegendPos)
                        oChartSpace.chart.legend.setLegendPos(nLegendPos);
                    if(oChartSpace.chart.legend.overlay !== false)
                    {
                        oChartSpace.chart.legend.setOverlay(false);
                    }
                }
            }
        }
    }

    function builder_SetObjectFontSize(oObject, nFontSize, oDrawingDocument){
        if(!oObject){
            return;
        }
        if(!oObject.txPr)
        {
            oObject.setTxPr(new AscFormat.CTextBody());
        }
        if(!oObject.txPr.bodyPr)
        {
            oObject.txPr.setBodyPr(new AscFormat.CBodyPr());
        }
        if(!oObject.txPr.content)
        {
            oObject.txPr.setContent(new AscFormat.CDrawingDocContent(oObject.txPr, oDrawingDocument, 0, 0, 100, 500, false, false, true));
        }
        var oPr = oObject.txPr.content.Content[0].Pr.Copy();
        if(!oPr.DefaultRunPr){
            oPr.DefaultRunPr = new AscCommonWord.CTextPr();
        }
        oPr.DefaultRunPr.FontSize = nFontSize;
        oObject.txPr.content.Content[0].Set_Pr(oPr);
    }

    function builder_SetLegendFontSize(oChartSpace, nFontSize){
        builder_SetObjectFontSize(oChartSpace.chart.legend, nFontSize, oChartSpace.getDrawingDocument());
    }

    function builder_SetHorAxisFontSize(oChartSpace, nFontSize){
        builder_SetObjectFontSize(oChartSpace.chart.plotArea.getHorizontalAxis(), nFontSize, oChartSpace.getDrawingDocument());
    }

    function builder_SetVerAxisFontSize(oChartSpace, nFontSize){
        builder_SetObjectFontSize(oChartSpace.chart.plotArea.getVerticalAxis(), nFontSize, oChartSpace.getDrawingDocument());
    }

    function builder_SetShowDataLabels(oChartSpace, bShowSerName, bShowCatName, bShowVal, bShowPerecent){
        if(oChartSpace && oChartSpace.chart && oChartSpace.chart.plotArea && oChartSpace.chart.plotArea.charts[0]){
            var oChart = oChartSpace.chart.plotArea.charts[0];
            var bPieChart = oChart.getObjectType() === AscDFH.historyitem_type_PieChart || oChart.getObjectType() === AscDFH.historyitem_type_DoughnutChart;
            if(false == bShowSerName && false == bShowCatName && false == bShowVal && (bPieChart && bShowPerecent === false))
            {
                if(oChart.dLbls)
                {
                    oChart.setDLbls(null);
                }
            }
            if(!oChart.dLbls)
            {
                oChart.setDLbls(new AscFormat.CDLbls());
            }
            oChart.dLbls.setSeparator(",");
            oChart.dLbls.setShowSerName(true == bShowSerName);
            oChart.dLbls.setShowCatName(true == bShowCatName);
            oChart.dLbls.setShowVal(true == bShowVal);
            oChart.dLbls.setShowLegendKey(false);
            if(bPieChart){
                oChart.dLbls.setShowPercent(true === bShowPerecent);
            }

            oChart.dLbls.setShowBubbleSize(false);
        }
    }

    function builder_SetChartAxisLabelsPos(oAxis, sPosition){
        if(!oAxis || !oAxis.setTickLblPos){
            return;
        }
        var nPositionType = null;
        var c_oAscTickLabelsPos = window['Asc'].c_oAscTickLabelsPos;
        switch(sPosition){
            case "high":{
                nPositionType = c_oAscTickLabelsPos.TICK_LABEL_POSITION_HIGH;
                break;
            }
            case "low":{
                nPositionType = c_oAscTickLabelsPos.TICK_LABEL_POSITION_LOW;
                break;
            }
            case "nextTo":{
                nPositionType = c_oAscTickLabelsPos.TICK_LABEL_POSITION_NEXT_TO;
                break;
            }
            case "none":{
                nPositionType = c_oAscTickLabelsPos.TICK_LABEL_POSITION_NONE;
                break;
            }
        }
        if(nPositionType !== null){
            oAxis.setTickLblPos(nPositionType);
        }
    }

    function builder_SetChartVertAxisTickLablePosition(oChartSpace, sPosition){
        if(oChartSpace){
            builder_SetChartAxisLabelsPos(oChartSpace.chart.plotArea.getVerticalAxis(), sPosition);
        }
    }

    function builder_SetChartHorAxisTickLablePosition(oChartSpace, sPosition){
        if(oChartSpace){
            builder_SetChartAxisLabelsPos(oChartSpace.chart.plotArea.getHorizontalAxis(), sPosition);
        }
    }

    function builder_GetTickMark(sTickMark){
        var nNewTickMark = null;
        switch(sTickMark){
            case 'cross':
            {
                nNewTickMark = Asc.c_oAscTickMark.TICK_MARK_CROSS;
                break;
            }
            case 'in':
            {
                nNewTickMark = Asc.c_oAscTickMark.TICK_MARK_IN;
                break;
            }
            case 'none':
            {
                nNewTickMark = Asc.c_oAscTickMark.TICK_MARK_NONE;
                break;
            }
            case 'out':
            {
                nNewTickMark = Asc.c_oAscTickMark.TICK_MARK_OUT;
                break;
            }
        }
        return nNewTickMark;
    }

    function builder_SetChartAxisMajorTickMark(oAxis, sTickMark){
        if(!oAxis){
            return;
        }
        var nNewTickMark = builder_GetTickMark(sTickMark);
        if(nNewTickMark !== null){
            oAxis.setMajorTickMark(nNewTickMark);
        }
    }

    function builder_SetChartAxisMinorTickMark(oAxis, sTickMark){
        if(!oAxis){
            return;
        }
        var nNewTickMark = builder_GetTickMark(sTickMark);
        if(nNewTickMark !== null){
            oAxis.setMinorTickMark(nNewTickMark);
        }
    }

    function builder_SetChartHorAxisMajorTickMark(oChartSpace, sTickMark){
        if(oChartSpace){
            builder_SetChartAxisMajorTickMark(oChartSpace.chart.plotArea.getHorizontalAxis(), sTickMark);
        }
    }

    function builder_SetChartHorAxisMinorTickMark(oChartSpace, sTickMark){
        if(oChartSpace){
            builder_SetChartAxisMinorTickMark(oChartSpace.chart.plotArea.getHorizontalAxis(), sTickMark);
        }
    }

    function builder_SetChartVerAxisMajorTickMark(oChartSpace, sTickMark){
        if(oChartSpace){
            builder_SetChartAxisMajorTickMark(oChartSpace.chart.plotArea.getVerticalAxis(), sTickMark);
        }
    }

    function builder_SetChartVerAxisMinorTickMark(oChartSpace, sTickMark){
        if(oChartSpace){
            builder_SetChartAxisMinorTickMark(oChartSpace.chart.plotArea.getVerticalAxis(), sTickMark);
        }
    }

    function builder_SetAxisMajorGridlines(oAxis, oLn){
        if(oAxis){
            if(!oAxis.majorGridlines){
                oAxis.setMajorGridlines(new AscFormat.CSpPr());
            }
            oAxis.majorGridlines.setLn(oLn);
            if(!oAxis.majorGridlines.Fill && !oAxis.majorGridlines.ln){
                oAxis.setMajorGridlines(null);
            }
        }
    }
    function builder_SetAxisMinorGridlines(oAxis, oLn){
        if(oAxis){
            if(!oAxis.minorGridlines){
                oAxis.setMinorGridlines(new AscFormat.CSpPr());
            }
            oAxis.minorGridlines.setLn(oLn);
            if(!oAxis.minorGridlines.Fill && !oAxis.minorGridlines.ln){
                oAxis.setMinorGridlines(null);
            }
        }
    }

    function builder_SetHorAxisMajorGridlines(oChartSpace, oLn){
        builder_SetAxisMajorGridlines(oChartSpace.chart.plotArea.getVerticalAxis(), oLn);
    }
    function builder_SetHorAxisMinorGridlines(oChartSpace, oLn){
        builder_SetAxisMinorGridlines(oChartSpace.chart.plotArea.getVerticalAxis(), oLn);
    }
    function builder_SetVerAxisMajorGridlines(oChartSpace, oLn){
        builder_SetAxisMajorGridlines(oChartSpace.chart.plotArea.getHorizontalAxis(), oLn);
    }
    function builder_SetVerAxisMinorGridlines(oChartSpace, oLn){
        builder_SetAxisMinorGridlines(oChartSpace.chart.plotArea.getHorizontalAxis(), oLn);
    }

    //----------------------------------------------------------export----------------------------------------------------
    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].CreateFontRef = CreateFontRef;
    window['AscFormat'].CreatePresetColor = CreatePresetColor;
    window['AscFormat'].isRealNumber = isRealNumber;
    window['AscFormat'].isRealBool = isRealBool;
    window['AscFormat'].writeLong = writeLong;
    window['AscFormat'].readLong = readLong;
    window['AscFormat'].writeDouble = writeDouble;
    window['AscFormat'].readDouble = readDouble;
    window['AscFormat'].writeBool = writeBool;
    window['AscFormat'].readBool = readBool;
    window['AscFormat'].writeString = writeString;
    window['AscFormat'].readString = readString;
    window['AscFormat'].writeObject = writeObject;
    window['AscFormat'].readObject = readObject;
    window['AscFormat'].checkThemeFonts = checkThemeFonts;
    window['AscFormat'].ExecuteNoHistory = ExecuteNoHistory;
    window['AscFormat'].checkTableCellPr = checkTableCellPr;
    window['AscFormat'].CColorMod = CColorMod;
    window['AscFormat'].CColorModifiers = CColorModifiers;
    window['AscFormat'].CSysColor = CSysColor;
    window['AscFormat'].CPrstColor = CPrstColor;
    window['AscFormat'].CRGBColor = CRGBColor;
    window['AscFormat'].CSchemeColor = CSchemeColor;
    window['AscFormat'].CUniColor = CUniColor;
    window['AscFormat'].CreateUniColorRGB = CreateUniColorRGB;
    window['AscFormat'].CreteSolidFillRGB = CreteSolidFillRGB;
    window['AscFormat'].CreateSolidFillRGBA = CreateSolidFillRGBA;
    window['AscFormat'].CSrcRect = CSrcRect;
    window['AscFormat'].CBlipFillTile = CBlipFillTile;
    window['AscFormat'].CBlipFill = CBlipFill;
    window['AscFormat'].CSolidFill = CSolidFill;
    window['AscFormat'].CGs = CGs;
    window['AscFormat'].GradLin = GradLin;
    window['AscFormat'].GradPath = GradPath;
    window['AscFormat'].CGradFill = CGradFill;
    window['AscFormat'].CPattFill = CPattFill;
    window['AscFormat'].CNoFill = CNoFill;
	window['AscFormat'].CGrpFill = CGrpFill;
    window['AscFormat'].CUniFill = CUniFill;
    window['AscFormat'].CompareUniFill = CompareUniFill;
    window['AscFormat'].CompareUnifillBool = CompareUnifillBool;
    window['AscFormat'].CompareShapeProperties = CompareShapeProperties;
    window['AscFormat'].EndArrow = EndArrow;
    window['AscFormat'].ConvertJoinAggType = ConvertJoinAggType;
    window['AscFormat'].LineJoin = LineJoin;
    window['AscFormat'].CLn = CLn;
    window['AscFormat'].DefaultShapeDefinition = DefaultShapeDefinition;
    window['AscFormat'].CNvPr = CNvPr;
    window['AscFormat'].NvPr = NvPr;
    window['AscFormat'].Ph = Ph;
    window['AscFormat'].UniNvPr = UniNvPr;
    window['AscFormat'].StyleRef = StyleRef;
    window['AscFormat'].FontRef = FontRef;
    window['AscFormat'].CShapeStyle = CShapeStyle;
    window['AscFormat'].CreateDefaultShapeStyle = CreateDefaultShapeStyle;
    window['AscFormat'].CXfrm = CXfrm;
    window['AscFormat'].CSpPr = CSpPr;
    window['AscFormat'].ClrScheme = ClrScheme;
    window['AscFormat'].ClrMap = ClrMap;
    window['AscFormat'].ExtraClrScheme = ExtraClrScheme;
    window['AscFormat'].FontCollection = FontCollection;
    window['AscFormat'].FontScheme = FontScheme;
    window['AscFormat'].FmtScheme = FmtScheme;
    window['AscFormat'].ThemeElements = ThemeElements;
    window['AscFormat'].CTheme = CTheme;
    window['AscFormat'].HF = HF;
    window['AscFormat'].CBgPr = CBgPr;
    window['AscFormat'].CBg = CBg;
    window['AscFormat'].CSld = CSld;
    window['AscFormat'].CTextStyles = CTextStyles;
    window['AscFormat'].redrawSlide = redrawSlide;
    window['AscFormat'].CTextFit = CTextFit;
    window['AscFormat'].CBodyPr = CBodyPr;
    window['AscFormat'].CHyperlink = CHyperlink;
    window['AscFormat'].CTextParagraphPr = CTextParagraphPr;
    window['AscFormat'].CompareBullets = CompareBullets;
    window['AscFormat'].CBullet = CBullet;
    window['AscFormat'].CBulletColor = CBulletColor;
    window['AscFormat'].CBulletSize = CBulletSize;
    window['AscFormat'].CBulletTypeface = CBulletTypeface;
    window['AscFormat'].CBulletType = CBulletType;
    window['AscFormat'].TextListStyle = TextListStyle;
    window['AscFormat'].GenerateDefaultTheme = GenerateDefaultTheme;
    window['AscFormat'].GenerateDefaultMasterSlide = GenerateDefaultMasterSlide;
    window['AscFormat'].GenerateDefaultSlideLayout = GenerateDefaultSlideLayout;
    window['AscFormat'].GenerateDefaultSlide = GenerateDefaultSlide;
    window['AscFormat'].CreateDefaultTextRectStyle = CreateDefaultTextRectStyle;
    window['AscFormat'].GenerateDefaultColorMap = GenerateDefaultColorMap;
    window['AscFormat'].CreateAscFill = CreateAscFill;
    window['AscFormat'].CorrectUniFill = CorrectUniFill;
    window['AscFormat'].CreateAscStroke = CreateAscStroke;
    window['AscFormat'].CorrectUniStroke = CorrectUniStroke;
    window['AscFormat'].CreateAscShapePropFromProp = CreateAscShapePropFromProp;
    window['AscFormat'].CreateAscTextArtProps = CreateAscTextArtProps;
    window['AscFormat'].CreateUnifillFromAscColor = CreateUnifillFromAscColor;
    window['AscFormat'].CorrectUniColor = CorrectUniColor;
    window['AscFormat'].deleteDrawingBase = deleteDrawingBase;
    window['AscFormat'].CNvUniSpPr = CNvUniSpPr;


    window['AscFormat'].builder_CreateShape = builder_CreateShape;
    window['AscFormat'].builder_CreateChart = builder_CreateChart;
    window['AscFormat'].builder_CreateGroup = builder_CreateGroup;
    window['AscFormat'].builder_CreateSchemeColor = builder_CreateSchemeColor;
    window['AscFormat'].builder_CreatePresetColor = builder_CreatePresetColor;
    window['AscFormat'].builder_CreateGradientStop = builder_CreateGradientStop;
    window['AscFormat'].builder_CreateLinearGradient = builder_CreateLinearGradient;
    window['AscFormat'].builder_CreateRadialGradient = builder_CreateRadialGradient;
    window['AscFormat'].builder_CreatePatternFill = builder_CreatePatternFill;
    window['AscFormat'].builder_CreateBlipFill = builder_CreateBlipFill;
    window['AscFormat'].builder_CreateLine    = builder_CreateLine;
    window['AscFormat'].builder_SetChartTitle = builder_SetChartTitle;
    window['AscFormat'].builder_SetChartHorAxisTitle = builder_SetChartHorAxisTitle;
    window['AscFormat'].builder_SetChartVertAxisTitle = builder_SetChartVertAxisTitle;
    window['AscFormat'].builder_SetChartLegendPos = builder_SetChartLegendPos;
    window['AscFormat'].builder_SetShowDataLabels = builder_SetShowDataLabels;

    window['AscFormat'].builder_SetChartVertAxisOrientation = builder_SetChartVertAxisOrientation;
    window['AscFormat'].builder_SetChartHorAxisOrientation = builder_SetChartHorAxisOrientation;
    window['AscFormat'].builder_SetChartVertAxisTickLablePosition = builder_SetChartVertAxisTickLablePosition;
    window['AscFormat'].builder_SetChartHorAxisTickLablePosition = builder_SetChartHorAxisTickLablePosition;

    window['AscFormat'].builder_SetChartHorAxisMajorTickMark = builder_SetChartHorAxisMajorTickMark;
    window['AscFormat'].builder_SetChartHorAxisMinorTickMark = builder_SetChartHorAxisMinorTickMark;
    window['AscFormat'].builder_SetChartVerAxisMajorTickMark = builder_SetChartVerAxisMajorTickMark;
    window['AscFormat'].builder_SetChartVerAxisMinorTickMark = builder_SetChartVerAxisMinorTickMark;
    window['AscFormat'].builder_SetLegendFontSize = builder_SetLegendFontSize;
    window['AscFormat'].builder_SetHorAxisMajorGridlines = builder_SetHorAxisMajorGridlines;
    window['AscFormat'].builder_SetHorAxisMinorGridlines = builder_SetHorAxisMinorGridlines;
    window['AscFormat'].builder_SetVerAxisMajorGridlines = builder_SetVerAxisMajorGridlines;
    window['AscFormat'].builder_SetVerAxisMinorGridlines = builder_SetVerAxisMinorGridlines;
    window['AscFormat'].builder_SetHorAxisFontSize = builder_SetHorAxisFontSize;
    window['AscFormat'].builder_SetVerAxisFontSize = builder_SetVerAxisFontSize;



    window['AscFormat'].Ax_Counter = Ax_Counter;
    window['AscFormat'].TYPE_TRACK = TYPE_TRACK;
    window['AscFormat'].TYPE_KIND = TYPE_KIND;
	window['AscFormat'].mapPrstColor = map_prst_color;
    window['AscFormat'].ar_arrow = ar_arrow;
    window['AscFormat'].ar_diamond = ar_diamond;
    window['AscFormat'].ar_none = ar_none;
    window['AscFormat'].ar_oval = ar_oval;
    window['AscFormat'].ar_stealth = ar_stealth;
    window['AscFormat'].ar_triangle = ar_triangle;
    window['AscFormat'].LineEndType = LineEndType;
    window['AscFormat'].LineEndSize = LineEndSize;
    window['AscFormat'].LineJoinType = LineJoinType;

    //типы плейсхолдеров
    window['AscFormat'].phType_body     = 0;
    window['AscFormat'].phType_chart    = 1;
    window['AscFormat'].phType_clipArt  = 2; //(Clip Art)
    window['AscFormat'].phType_ctrTitle = 3; //(Centered Title)
    window['AscFormat'].phType_dgm      = 4; //(Diagram)
    window['AscFormat'].phType_dt       = 5; //(Date and Time)
    window['AscFormat'].phType_ftr      = 6; //(Footer)
    window['AscFormat'].phType_hdr      = 7; //(Header)
    window['AscFormat'].phType_media    = 8; //(Media)
    window['AscFormat'].phType_obj      = 9; //(Object)
    window['AscFormat'].phType_pic      = 10; //(Picture)
    window['AscFormat'].phType_sldImg   = 11; //(Slide Image)
    window['AscFormat'].phType_sldNum   = 12; //(Slide Number)
    window['AscFormat'].phType_subTitle = 13; //(Subtitle)
    window['AscFormat'].phType_tbl      = 14; //(Table)
    window['AscFormat'].phType_title    = 15; //(Title)

    window['AscFormat'].fntStyleInd_none = 2;
    window['AscFormat'].fntStyleInd_major = 0;
    window['AscFormat'].fntStyleInd_minor = 1;

    window['AscFormat'].VERTICAL_ANCHOR_TYPE_BOTTOM = 0;
    window['AscFormat'].VERTICAL_ANCHOR_TYPE_CENTER = 1;
    window['AscFormat'].VERTICAL_ANCHOR_TYPE_DISTRIBUTED = 2;
    window['AscFormat'].VERTICAL_ANCHOR_TYPE_JUSTIFIED = 3;
    window['AscFormat'].VERTICAL_ANCHOR_TYPE_TOP = 4;

    //Vertical Text Types
    window['AscFormat'].nVertTTeaVert          = 0; //( ( East Asian Vertical ))
    window['AscFormat'].nVertTThorz            = 1; //( ( Horizontal ))
    window['AscFormat'].nVertTTmongolianVert   = 2; //( ( Mongolian Vertical ))
    window['AscFormat'].nVertTTvert            = 3; //( ( Vertical ))
    window['AscFormat'].nVertTTvert270         = 4;//( ( Vertical 270 ))
    window['AscFormat'].nVertTTwordArtVert     = 5;//( ( WordArt Vertical ))
    window['AscFormat'].nVertTTwordArtVertRtl  = 6;//(Vertical WordArt Right to Left)

    //Text Wrapping Types
    window['AscFormat'].nTWTNone   = 0;
    window['AscFormat'].nTWTSquare = 1;

    window['AscFormat'].text_fit_No         = 0;
    window['AscFormat'].text_fit_Auto       = 1;
    window['AscFormat'].text_fit_NormAuto   = 2;

    window['AscFormat'].BULLET_TYPE_COLOR_NONE	= 0;
    window['AscFormat'].BULLET_TYPE_COLOR_CLRTX	= 1;
    window['AscFormat'].BULLET_TYPE_COLOR_CLR	= 2;

    window['AscFormat'].BULLET_TYPE_SIZE_NONE	= 0;
    window['AscFormat'].BULLET_TYPE_SIZE_TX		= 1;
    window['AscFormat'].BULLET_TYPE_SIZE_PCT	= 2;
    window['AscFormat'].BULLET_TYPE_SIZE_PTS	= 3;

    window['AscFormat'].BULLET_TYPE_TYPEFACE_NONE	= 0;
    window['AscFormat'].BULLET_TYPE_TYPEFACE_TX		= 1;
    window['AscFormat'].BULLET_TYPE_TYPEFACE_BUFONT	= 2;

    window['AscFormat'].PARRUN_TYPE_NONE      = 0;
    window['AscFormat'].PARRUN_TYPE_RUN		  = 1;
    window['AscFormat'].PARRUN_TYPE_FLD		  = 2;
    window['AscFormat'].PARRUN_TYPE_BR		  = 3;
	window['AscFormat'].PARRUN_TYPE_MATH	  = 4;
	window['AscFormat'].PARRUN_TYPE_MATHPARA  = 5;

    window['AscFormat']._weight_body = _weight_body;
    window['AscFormat']._weight_chart = _weight_chart;
    window['AscFormat']._weight_clipArt = _weight_clipArt;
    window['AscFormat']._weight_ctrTitle = _weight_ctrTitle;
    window['AscFormat']._weight_dgm = _weight_dgm;
    window['AscFormat']._weight_media = _weight_media;
    window['AscFormat']._weight_obj = _weight_obj;
    window['AscFormat']._weight_pic = _weight_pic;
    window['AscFormat']._weight_subTitle = _weight_subTitle;
    window['AscFormat']._weight_tbl = _weight_tbl;
    window['AscFormat']._weight_title = _weight_title;

    window['AscFormat']._ph_multiplier = _ph_multiplier;

    window['AscFormat'].nSldLtTTitle = nSldLtTTitle;
    window['AscFormat'].nSldLtTObj = nSldLtTObj;
    window['AscFormat'].nSldLtTTx = nSldLtTTx;

    window['AscFormat']._arr_lt_types_weight = _arr_lt_types_weight;
    window['AscFormat']._global_layout_summs_array = _global_layout_summs_array;

    window['AscFormat'].nOTOwerflow = nOTOwerflow;
    window['AscFormat'].nOTClip = nOTClip;
    window['AscFormat'].nOTEllipsis = nOTEllipsis;

    window['AscFormat'].BULLET_TYPE_BULLET_NONE = BULLET_TYPE_BULLET_NONE;
    window['AscFormat'].BULLET_TYPE_BULLET_CHAR = BULLET_TYPE_BULLET_CHAR;
    window['AscFormat'].BULLET_TYPE_BULLET_AUTONUM = BULLET_TYPE_BULLET_AUTONUM;
    window['AscFormat'].BULLET_TYPE_BULLET_BLIP = BULLET_TYPE_BULLET_BLIP;

    window['AscFormat'].DEFAULT_COLOR_MAP = GenerateDefaultColorMap();
})(window);
