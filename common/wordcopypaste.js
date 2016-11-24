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
function(window, undefined) {

// Import
var g_fontApplication = AscFonts.g_fontApplication;
var CFont = AscFonts.CFont;
  
var AscBrowser = AscCommon.AscBrowser;
var align_Right = AscCommon.align_Right;
var align_Left = AscCommon.align_Left;
var align_Center = AscCommon.align_Center;
var align_Justify = AscCommon.align_Justify;
var g_oDocumentUrls = AscCommon.g_oDocumentUrls;
var History = AscCommon.History;
var pptx_content_loader = AscCommon.pptx_content_loader;
var pptx_content_writer = AscCommon.pptx_content_writer;
var g_dKoef_pix_to_mm = AscCommon.g_dKoef_pix_to_mm;
var g_dKoef_mm_to_pix = AscCommon.g_dKoef_mm_to_pix;

var CShape = AscFormat.CShape;
var CGraphicFrame = AscFormat.CGraphicFrame;

var c_oAscError = Asc.c_oAscError;
var c_oAscShdClear = Asc.c_oAscShdClear;
var c_oAscShdNil = Asc.c_oAscShdNil;
var c_oAscXAlign = Asc.c_oAscXAlign;

function CDocumentReaderMode()
{
    this.DefaultFontSize = 12;

    this.CorrectDefaultFontSize = function(size)
    {
        if (size < 6)
            return;

        this.DefaultFontSize = size;
    };

    this.CorrectFontSize = function(size)
    {
        var dRes = size / this.DefaultFontSize;
        dRes = (1 + dRes) / 2;
        dRes = (100 * dRes) >> 0;
        dRes /= 100;

        return "" + dRes + "em";
    };
}

function GetObjectsForImageDownload(aBuilderImages)
{
    var oMapImages = {}, aBuilderImagesByUrl = [], aUrls =[];
    for(var i = 0; i < aBuilderImages.length; ++i)
    {
        if(!g_oDocumentUrls.getImageLocal(aBuilderImages[i].Url))
        {
            if(!Array.isArray(oMapImages[aBuilderImages[i].Url]))
            {
                oMapImages[aBuilderImages[i].Url] = [];
            }
            oMapImages[aBuilderImages[i].Url].push(aBuilderImages[i]);
        }
    }
    for(var key in oMapImages)
    {
        if(oMapImages.hasOwnProperty(key))
        {
            aUrls.push(key);
            aBuilderImagesByUrl.push(oMapImages[key]);
        }
    }
    //в конце добавляем ссылки на wmf, ole
    for(var i = 0; i < aBuilderImages.length; ++i)
    {
        var oBuilderImage = aBuilderImages[i];
        if (oBuilderImage.AdditionalUrls) {
            for(var j = 0; j < oBuilderImage.AdditionalUrls.length; ++j) {
                aUrls.push(oBuilderImage.AdditionalUrls[j]);
            }
        }
    }
    return {aUrls: aUrls, aBuilderImagesByUrl: aBuilderImagesByUrl};
}

function ResetNewUrls(data, aUrls, aBuilderImagesByUrl, oImageMap)
{
    for (var i = 0, length = Math.min(data.length, aBuilderImagesByUrl.length); i < length; ++i)
    {
        var elem = data[i];
        if (null != elem.url)
        {
            var name = g_oDocumentUrls.imagePath2Local(elem.path);
            var aImageElem = aBuilderImagesByUrl[i];
            if(Array.isArray(aImageElem))
            {
                for(var j = 0; j < aImageElem.length; ++j)
                {
                    var imageElem = aImageElem[j];
                    if (null != imageElem)
                    {
                        imageElem.SetUrl(name);
                    }
                }
            }
            oImageMap[i] = name;
        }
        else
        {
            oImageMap[i] = aUrls[i];
        }
    }
}


var PasteElementsId = {
  copyPasteUseBinary : true,
  g_bIsDocumentCopyPaste : true
};
function CopyElement(sName, bText){
	this.sName = sName;
	this.oAttributes = {};
	this.aChildren = [];
	this.bText = bText;
}
CopyElement.prototype.addChild = function(child){
	if(child.bText && this.aChildren.length > 0 && this.aChildren[this.aChildren.length - 1].bText)
		this.aChildren[this.aChildren.length - 1].sName += child.sName;//обьединяем текст, потому что есть места где мы определяем количество child и будет неправильное значение, потому на getOuterHtml тест обьединится в один
	else
		this.aChildren.push(child);
};
CopyElement.prototype.wrapChild = function(child){
	for(var i = 0; i < this.aChildren.length; ++i)
		child.addChild(this.aChildren[i]);
	this.aChildren = [child];
};
CopyElement.prototype.isEmptyChild = function(){
	return 0 == this.aChildren.length;
};
CopyElement.prototype.getInnerText = function(){
	if(this.bText)
		return this.sName;
	else{
		var sRes = "";
		for(var i = 0; i < this.aChildren.length; ++i)
			sRes += this.aChildren[i].getInnerText();
		return sRes;
	}
};
CopyElement.prototype.getInnerHtml = function(){
	if(this.bText)
		return this.sName;
	else{
		var sRes = "";
		for(var i = 0; i < this.aChildren.length; ++i)
			sRes += this.aChildren[i].getOuterHtml();
		return sRes;
	}
};
CopyElement.prototype.getOuterHtml = function(){
	if(this.bText)
		return this.sName;
	else{
		var sRes = "<" + this.sName;
		for(var i in this.oAttributes)
			sRes += " " + i + "=\"" + this.oAttributes[i] + "\"";
		var sInner = this.getInnerHtml();
		if(sInner.length > 0)
			sRes += ">" + sInner + "</" + this.sName + ">";
		else
			sRes += "/>";
		return sRes;
	}
};
function CopyProcessor(api, onlyBinaryCopy)
{
	this.api = api;
    this.oDocument = api.WordControl.m_oLogicDocument;
	this.onlyBinaryCopy = onlyBinaryCopy;
	
	this.oBinaryFileWriter = new AscCommonWord.BinaryFileWriter(this.oDocument);
	this.oPresentationWriter = new AscCommon.CBinaryFileWriter();
    this.oPresentationWriter.Start_UseFullUrl();
    if (this.api.ThemeLoader) {
        this.oPresentationWriter.Start_UseDocumentOrigin(this.api.ThemeLoader.ThemesUrlAbs);
    }
	
	this.oRoot = new CopyElement("root");
}
CopyProcessor.prototype =
{
    getInnerHtml : function()
    {
        return this.oRoot.getInnerHtml();
    },
    getInnerText : function()
    {
        return this.oRoot.getInnerText();
    },
    RGBToCSS : function(rgb, unifill)
    {
        if (null == rgb && null != unifill) {
            unifill.check(this.oDocument.Get_Theme(), this.oDocument.Get_ColorMap());
            var RGBA = unifill.getRGBAColor();
            rgb = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B);
        }
        var sResult = "#";
        var sR = rgb.r.toString(16);
        if(sR.length == 1)
            sR = "0" + sR;
        var sG = rgb.g.toString(16);
        if(sG.length == 1)
            sG = "0" + sG;
        var sB = rgb.b.toString(16);
        if(sB.length == 1)
            sB = "0" + sB;
        return "#" + sR + sG + sB;
    },
    Commit_pPr : function(Item, Para)
    {
        //pPr
        var apPr = [];
        var Def_pPr = this.oDocument.Styles ? this.oDocument.Styles.Default.ParaPr : null;
        var Item_pPr = Item.CompiledPr && Item.CompiledPr.Pr && Item.CompiledPr.Pr.ParaPr ? Item.CompiledPr.Pr.ParaPr : Item.Pr;
        if(Item_pPr && Def_pPr)
        {
            //Ind
            if(Def_pPr.Ind.Left != Item_pPr.Ind.Left)
                apPr.push("margin-left:" + (Item_pPr.Ind.Left * g_dKoef_mm_to_pt) + "pt");
            if(Def_pPr.Ind.Right != Item_pPr.Ind.Right)
                apPr.push("margin-right:" + ( Item_pPr.Ind.Right * g_dKoef_mm_to_pt) + "pt");
            if(Def_pPr.Ind.FirstLine != Item_pPr.Ind.FirstLine)
                apPr.push("text-indent:" + (Item_pPr.Ind.FirstLine * g_dKoef_mm_to_pt) + "pt");
            //Jc
            if(Def_pPr.Jc != Item_pPr.Jc){
                switch(Item_pPr.Jc)
                {
                    case align_Left: apPr.push("text-align:left");break;
                    case align_Center: apPr.push("text-align:center");break;
                    case align_Right: apPr.push("text-align:right");break;
                    case align_Justify: apPr.push("text-align:justify");break;
                }
            }
            //KeepLines , WidowControl
            if(Def_pPr.KeepLines != Item_pPr.KeepLines || Def_pPr.WidowControl != Item_pPr.WidowControl)
            {
                if(Def_pPr.KeepLines != Item_pPr.KeepLines && Def_pPr.WidowControl != Item_pPr.WidowControl)
                    apPr.push("mso-pagination:none lines-together");
                else if(Def_pPr.KeepLines != Item_pPr.KeepLines)
                    apPr.push("mso-pagination:widow-orphan lines-together");
                else if(Def_pPr.WidowControl != Item_pPr.WidowControl)
                    apPr.push("mso-pagination:none");
            }
            //KeepNext
            if(Def_pPr.KeepNext != Item_pPr.KeepNext)
                apPr.push("page-break-after:avoid");
            //PageBreakBefore
            if(Def_pPr.PageBreakBefore != Item_pPr.PageBreakBefore)
                apPr.push("page-break-before:always");
            //Spacing
            if(Def_pPr.Spacing.Line != Item_pPr.Spacing.Line)
            {
                if(Asc.linerule_AtLeast == Item_pPr.Spacing.LineRule)
                    apPr.push("line-height:"+(Item_pPr.Spacing.Line * g_dKoef_mm_to_pt)+"pt");
                else if( Asc.linerule_Auto == Item_pPr.Spacing.LineRule)
                {
                    if(1 == Item_pPr.Spacing.Line)
                        apPr.push("line-height:normal");
                    else
                        apPr.push("line-height:"+parseInt(Item_pPr.Spacing.Line * 100)+"%");
                }
            }
            if(Def_pPr.Spacing.LineRule != Item_pPr.Spacing.LineRule)
            {
                if(Asc.linerule_Exact == Item_pPr.Spacing.LineRule)
                    apPr.push("mso-line-height-rule:exactly");
            }
			//TODO при вставке в EXCEL(внутрь ячейки) появляются лишние пустые строки из-за того, что в HTML пишутся отступы - BUG #14663
            //��� ������� � word ����� ����� ��� �������� ������������ ������
            //if(Def_pPr.Spacing.Before != Item_pPr.Spacing.Before)
            apPr.push("margin-top:" + (Item_pPr.Spacing.Before * g_dKoef_mm_to_pt) + "pt");
            //if(Def_pPr.Spacing.After != Item_pPr.Spacing.After)
            apPr.push("margin-bottom:" + (Item_pPr.Spacing.After * g_dKoef_mm_to_pt) + "pt");
            //Shd
            if (null != Item_pPr.Shd && c_oAscShdNil != Item_pPr.Shd.Value && (null != Item_pPr.Shd.Color || null != Item_pPr.Shd.Unifill))
                apPr.push("background-color:" + this.RGBToCSS(Item_pPr.Shd.Color, Item_pPr.Shd.Unifill));
            //Tabs
            if(Item_pPr.Tabs.Get_Count() > 0)
            {
                var sTabs = "";
                //tab-stops:1.0cm 3.0cm 5.0cm
                for(var i = 0, length = Item_pPr.Tabs.Get_Count(); i < length; i++)
                {
                    if(0 != i)
                        sTabs += " ";
                    sTabs += Item_pPr.Tabs.Get(i).Pos / 10 + "cm";
                }
                apPr.push("tab-stops:" + sTabs);
            }
            //Border
            if(null != Item_pPr.Brd)
            {
                apPr.push("border:none");
                var borderStyle = this._BordersToStyle(Item_pPr.Brd, false, true, "mso-", "-alt");
                if(null != borderStyle)
                {
                    var nborderStyleLength = borderStyle.length;
                    if(nborderStyleLength> 0)
                        borderStyle = borderStyle.substring(0, nborderStyleLength - 1);
                    apPr.push(borderStyle);
                }
            }
        }
        if(apPr.length > 0)
            Para.oAttributes["style"] = apPr.join(';');
    },
    parse_para_TextPr : function(Value, oTarget)
    {
        var aProp = [];
        if (null != Value.RFonts) {
            var sFontName = null;
            if (null != Value.RFonts.Ascii)
                sFontName = Value.RFonts.Ascii.Name;
            else if (null != Value.RFonts.HAnsi)
                sFontName = Value.RFonts.HAnsi.Name;
            else if (null != Value.RFonts.EastAsia)
                sFontName = Value.RFonts.EastAsia.Name;
            else if (null != Value.RFonts.CS)
                sFontName = Value.RFonts.CS.Name;
            if (null != sFontName)
                aProp.push("font-family:" + "'" + CopyPasteCorrectString(sFontName) + "'");
        }
        if (null != Value.FontSize) {
            if (!this.api.DocumentReaderMode)
                aProp.push("font-size:" + Value.FontSize + "pt");//font-size � pt ��� ��������� ������� � mm
            else
                aProp.push("font-size:" + this.api.DocumentReaderMode.CorrectFontSize(Value.FontSize));
        }
        if (true == Value.Bold)
			oTarget.wrapChild(new CopyElement("b"));
        if (true == Value.Italic)
			oTarget.wrapChild(new CopyElement("i"));
		if (true == Value.Underline)
			oTarget.wrapChild(new CopyElement("u"));
        if (true == Value.Strikeout)
			oTarget.wrapChild(new CopyElement("s"));
		 if (true == Value.DStrikeout)
			 oTarget.wrapChild(new CopyElement("s"));
        if (null != Value.Shd && c_oAscShdNil != Value.Shd.Value && (null != Value.Shd.Color || null != Value.Shd.Unifill))
            aProp.push("background-color:" + this.RGBToCSS(Value.Shd.Color, Value.Shd.Unifill));
        else if (null != Value.HighLight && highlight_None != Value.HighLight)
            aProp.push("background-color:" + this.RGBToCSS(Value.HighLight, null));
        if (null != Value.Color || null != Value.Unifill) {
			var color;
			//TODO правка того, что в полученной html цвет текста всегда чёрный. стоит пересмотреть.
			if(null != Value.Unifill)
				color = this.RGBToCSS(null, Value.Unifill);
			else
				color = this.RGBToCSS(Value.Color, Value.Unifill);
   
            aProp.push("color:" + color);
            aProp.push("mso-style-textfill-fill-color:" + color);
        }
        if (null != Value.VertAlign) {
            if(AscCommon.vertalign_SuperScript == Value.VertAlign)
                aProp.push("vertical-align:super");
            else if(AscCommon.vertalign_SubScript == Value.VertAlign)
                aProp.push("vertical-align:sub");
        }
		if(aProp.length > 0)
			oTarget.oAttributes["style"] = aProp.join(';');
    },
    ParseItem : function(ParaItem, oTarget, nextParaItem, lengthContent)
    {
        switch ( ParaItem.Type )
        {
            case para_Text:
                //���������� �����������
                var sValue = AscCommon.encodeSurrogateChar(ParaItem.Value);
                if(sValue)
					oTarget.addChild(new CopyElement(CopyPasteCorrectString(sValue), true));
                break;
            case para_Space:
				//TODO пересмотреть обработку пробелов - возможно стоит всегда копировать неразрывный пробел!!!!!
				//в случае нескольких пробелов друг за другом добавляю неразрывный пробел, иначе добавиться только один
				//lengthContent - если в элемент добавляется только один пробел, этот элемент не записывается в буфер, поэтому добавляем неразрывный пробел
				if((nextParaItem && nextParaItem.Type === para_Space) || lengthContent === 1)
					oTarget.addChild(new CopyElement("&nbsp;", true));
				else
					oTarget.addChild(new CopyElement(" ", true));	
				break;
			case para_Tab:
				var oSpan = new CopyElement("span");
				oSpan.oAttributes["style"] = "white-space:pre;";
				oSpan.addChild(new CopyElement(String.fromCharCode(0x09), true));
				oTarget.addChild(oSpan);
				break;
            case para_NewLine:
				var oBr = new CopyElement("br");
                if( break_Page == ParaItem.BreakType)
                {
					oBr.oAttributes["clear"] = "all";
					oBr.oAttributes["style"] = "mso-special-character:line-break;page-break-before:always;";
                }
                else
					oBr.oAttributes["style"] = "mso-special-character:line-break;";
				oTarget.addChild(oBr);
				//todo ��������� ���� �������� � ������ �����
				//добавил неразрвной пробел для того, чтобы информация попадала в буфер обмена
				var oSpan = new CopyElement("span");
				oSpan.addChild(new CopyElement("&nbsp;", true));
				oTarget.addChild(oSpan);
                break;
            case para_Drawing:
                var oGraphicObj = ParaItem.GraphicObj;
                var sSrc = oGraphicObj.getBase64Img();
                if(sSrc.length > 0)
                {
					var _h, _w;
					if(oGraphicObj.cachedPixH)
						_h = oGraphicObj.cachedPixH;
					else
						_h = ParaItem.Extent.H * g_dKoef_mm_to_pix;
					
					if(oGraphicObj.cachedPixW)
						_w = oGraphicObj.cachedPixW;
					else
						_w = ParaItem.Extent.W * g_dKoef_mm_to_pix;
						
					var oImg = new CopyElement("img");
					oImg.oAttributes["style"] = "max-width:100%;";
					oImg.oAttributes["width"] = Math.round(_w);
					oImg.oAttributes["height"] = Math.round(_h);
					oImg.oAttributes["src"] = sSrc;
					oTarget.addChild(oImg);
                    break;
                }
                // var _canvas     = document.createElement('canvas');
                // var w = img.width;
                // var h = img.height;

                // _canvas.width   = w;
                // _canvas.height  = h;

                // var _ctx        = _canvas.getContext('2d');
                // _ctx.globalCompositeOperation = "copy";
                // _ctx.drawImage(img, 0, 0);

                // var _data = _ctx.getImageData(0, 0, w, h);
                // _ctx = null;
                // delete _canvas;
                break;
			case para_PageNum:
				if(null != ParaItem.String && "string" == typeof(ParaItem.String))
					oTarget.addChild(new CopyElement(CopyPasteCorrectString(ParaItem.String), true));
				break;
        }
    },
    CopyRun: function (Item, oTarget) {
        for (var i = 0; i < Item.Content.length; i++)
            this.ParseItem(Item.Content[i], oTarget, Item.Content[i + 1], Item.Content.length);
    },
    CopyRunContent: function (Container, oTarget, bOmitHyperlink) {
        for (var i = 0; i < Container.Content.length; i++) {
            var item = Container.Content[i];
            if (para_Run == item.Type) {
				var oSpan = new CopyElement("span");
                this.CopyRun(item, oSpan);
                if(!oSpan.isEmptyChild()){
					this.parse_para_TextPr(item.Get_CompiledTextPr(), oSpan);
					oTarget.addChild(oSpan);
				}
            }
            else if (para_Hyperlink == item.Type) {
                if (!bOmitHyperlink) {
					var oHyperlink = new CopyElement("a");
                    var sValue = item.Get_Value();
                    var sToolTip = item.Get_ToolTip();
					oHyperlink.oAttributes["href"] = CopyPasteCorrectString(sValue);
					oHyperlink.oAttributes["title"] = CopyPasteCorrectString(sToolTip);
					//вложенные ссылки в html запрещены.
					this.CopyRunContent(item, oHyperlink, true);
					oTarget.addChild(oHyperlink);
                }
				else
					this.CopyRunContent(item, oTarget, true);
            }
			else if(para_Math == item.Type){
                var sSrc = item.MathToImageConverter();
				if (null != sSrc && null != sSrc.ImageUrl){
					var oImg = new CopyElement("img");
					if (sSrc.w_px > 0) {
						oImg.oAttributes["width"] = sSrc.w_px;
					}
					if (sSrc.h_px > 0) {
						oImg.oAttributes["height"] = sSrc.h_px;
					}
					oImg.oAttributes["src"] = sSrc.ImageUrl;
					oTarget.addChild(oImg);
				}
			}
			else if(para_Field == item.Type)
				this.CopyRunContent(item, oTarget);
        }
    },
    CopyParagraph : function(oDomTarget, Item, selectedAll)
    {
        var oDocument = this.oDocument;
		var Para = null;
        //��� heading ����� � h1
        var styleId = Item.Style_Get();
        if(styleId)
        {
            var styleName = oDocument.Styles.Get_Name( styleId ).toLowerCase();
            //������ "heading n" (n=1:6)
            if(0 == styleName.indexOf("heading"))
            {
                var nLevel = parseInt(styleName.substring("heading".length));
                if(1 <= nLevel && nLevel <= 6)
                    Para = new CopyElement("h" + nLevel);
            }
        }
        if(null == Para)
            Para = new CopyElement("p");

        var oNumPr;
        var bIsNullNumPr = false;
        if(PasteElementsId.g_bIsDocumentCopyPaste)
        {
            oNumPr = Item.Numbering_Get();
            bIsNullNumPr = (null == oNumPr || 0 == oNumPr.NumId);
        }
        else
        {
            oNumPr = Item.PresentationPr.Bullet;
            bIsNullNumPr = (0 == oNumPr.m_nType);
        }
		var bBullet = false;
        var sListStyle = "";
        if(!bIsNullNumPr)
        {
            if(PasteElementsId.g_bIsDocumentCopyPaste)
            {
				var aNum = this.oDocument.Numbering.Get_AbstractNum( oNumPr.NumId );
				if(null != aNum)
				{
					var LvlPr = aNum.Lvl[oNumPr.Lvl];
					if(null != LvlPr)
					{
						switch(LvlPr.Format)
						{
							case numbering_numfmt_Decimal: sListStyle = "decimal";break;
							case numbering_numfmt_LowerRoman: sListStyle = "lower-roman";break;
							case numbering_numfmt_UpperRoman: sListStyle = "upper-roman";break;
							case numbering_numfmt_LowerLetter: sListStyle = "lower-alpha";break;
							case numbering_numfmt_UpperLetter: sListStyle = "upper-alpha";break;
							default:
								sListStyle = "disc";
								bBullet = true;
								break;
						}
					}
				}
            }
            else
            {
                var _presentation_bullet = Item.PresentationPr.Bullet;
                switch(_presentation_bullet.m_nType)
                {
                    case numbering_presentationnumfrmt_ArabicPeriod:
                    case numbering_presentationnumfrmt_ArabicParenR:
                    {
                        sListStyle = "decimal";
                        break;
                    }
                    case numbering_presentationnumfrmt_RomanLcPeriod: sListStyle = "lower-roman";break;
                    case numbering_presentationnumfrmt_RomanUcPeriod: sListStyle = "upper-roman";break;

                    case numbering_presentationnumfrmt_AlphaLcParenR:
                    case numbering_presentationnumfrmt_AlphaLcPeriod:
                    {
                        sListStyle = "lower-alpha";
                        break;
                    }
                    case numbering_presentationnumfrmt_AlphaUcParenR:
                    case numbering_presentationnumfrmt_AlphaUcPeriod:
                    {
                        sListStyle = "upper-alpha";
                        break;
                    }

                    default:
                        sListStyle = "disc";
                        bBullet = true;
                        break;
                }
            }
        }
        //pPr
        this.Commit_pPr(Item, Para);

        if(false == selectedAll)
        {
			//если последний элемент в выделении неполностью выделенный параграф, то он копируется как обычный текст без настроек параграфа и списков
			this.CopyRunContent(Item, oDomTarget, false);
        }
        else
        {
			this.CopyRunContent(Item, Para, false);
			//добавляем &nbsp; потому что параграфы без содержимого не копируются
            if(Para.isEmptyChild())
                Para.addChild(new CopyElement("&nbsp;", true));
            if(bIsNullNumPr)
                oDomTarget.addChild( Para );
			else{
				var Li = new CopyElement( "li" );
				Li.oAttributes["style"] = "list-style-type: " + sListStyle;
				Li.addChild( Para );
				//пробуем добавить в предыдущий список
				var oTargetList = null;
				if(oDomTarget.aChildren.length > 0){
					var oPrevElem = oDomTarget.aChildren[oDomTarget.aChildren.length - 1];
					if((bBullet && "ul" == oPrevElem.sName) || (!bBullet && "ol" == oPrevElem.sName))
						oTargetList = oPrevElem;
				}
				if(null == oTargetList){
					if(bBullet)
						oTargetList = new CopyElement("ul");
					else
						oTargetList = new CopyElement("ol");
					oTargetList.oAttributes["style"] = "padding-left:40px";
					oDomTarget.addChild(oTargetList);
				}
				oTargetList.addChild(Li);
			}
        }
    },
    _BorderToStyle : function(border, name)
    {
        var res = "";
        if(border_None == border.Value)
            res += name + ":none;";
        else
        {
            var size = 0.5;
            var color = border.Color;
            var unifill = border.Unifill;
            if(null != border.Size)
                size = border.Size * g_dKoef_mm_to_pt;
            if (null == color)
                color = { r: 0, g: 0, b: 0 };
            res += name + ":" + size + "pt solid " + this.RGBToCSS(color, unifill) + ";";
        }
        return res;
    },
    _MarginToStyle : function(margins, styleName)
    {
        var res = "";
        var nMarginLeft = 1.9;
        var nMarginTop = 0;
        var nMarginRight = 1.9;
        var nMarginBottom = 0;
        if(null != margins.Left && tblwidth_Mm == margins.Left.Type && null != margins.Left.W)
            nMarginLeft = margins.Left.W;
        if(null != margins.Top && tblwidth_Mm == margins.Top.Type && null != margins.Top.W)
            nMarginTop = margins.Top.W;
        if(null != margins.Right && tblwidth_Mm == margins.Right.Type && null != margins.Right.W)
            nMarginRight = margins.Right.W;
        if(null != margins.Bottom && tblwidth_Mm == margins.Bottom.Type && null != margins.Bottom.W)
            nMarginBottom = margins.Bottom.W;
        res = styleName + ":"+(nMarginTop * g_dKoef_mm_to_pt)+"pt "+(nMarginRight * g_dKoef_mm_to_pt)+"pt "+(nMarginBottom * g_dKoef_mm_to_pt)+"pt "+(nMarginLeft * g_dKoef_mm_to_pt)+"pt;";
        return res;
    },
    _BordersToStyle : function(borders, bUseInner, bUseBetween, mso, alt)
    {
        var res = "";
        if(null == mso)
            mso = "";
        if(null == alt)
            alt = "";
        if(null != borders.Left)
            res += this._BorderToStyle(borders.Left, mso + "border-left" + alt);
        if(null != borders.Top)
            res += this._BorderToStyle(borders.Top, mso + "border-top" + alt);
        if(null != borders.Right)
            res += this._BorderToStyle(borders.Right, mso + "border-right" + alt);
        if(null != borders.Bottom)
            res += this._BorderToStyle(borders.Bottom, mso + "border-bottom" + alt);
		if(bUseInner)
		{
			if(null != borders.InsideV)
				res += this._BorderToStyle(borders.InsideV, "mso-border-insidev");
			if(null != borders.InsideH)
				res += this._BorderToStyle(borders.InsideH, "mso-border-insideh");
		}
		if(bUseBetween)
		{
			if(null != borders.Between)
				res += this._BorderToStyle(borders.Between, "mso-border-between");
		}
        return res;
    },
    _MergeProp : function(elem1, elem2)
    {
        if( !elem1 || !elem2 )
        {
            return;
        }

        var p, v;
        for(p in elem2)
        {
            if(elem2.hasOwnProperty(p) && false == elem1.hasOwnProperty(p))
            {
                v = elem2[p];
                if(null != v)
                    elem1[p] = v;
            }
        }
    },
    CopyCell : function(tr, cell, tablePr, width, rowspan)
    {
        var tc = new CopyElement("td");
        //Pr
        var tcStyle = "";
        if(width > 0)
        {
            tc.oAttributes["width"] = Math.round(width * g_dKoef_mm_to_pix);
            tcStyle += "width:"+(width * g_dKoef_mm_to_pt)+"pt;";
        }
        if(rowspan > 1)
            tc.oAttributes["rowspan"] = rowspan;
        var cellPr = null;
		
		var tablePr = null;
        if(!PasteElementsId.g_bIsDocumentCopyPaste && editor.WordControl.m_oLogicDocument && null != cell.CompiledPr && null != cell.CompiledPr.Pr)
		{
			var presentation = editor.WordControl.m_oLogicDocument;
			var curSlide = presentation.Slides[presentation.CurPage];
			if(presentation && curSlide && curSlide.Layout && curSlide.Layout.Master && curSlide.Layout.Master.Theme)
        AscFormat.checkTableCellPr(cell.CompiledPr.Pr, curSlide, curSlide.Layout, curSlide.Layout.Master, curSlide.Layout.Master.Theme);	
		}
		
		if(null != cell.CompiledPr && null != cell.CompiledPr.Pr)
        {
            cellPr = cell.CompiledPr.Pr;
            //��� ������ � �������� ����� ������������ margin � �� colspan
            if(null != cellPr.GridSpan && cellPr.GridSpan > 1)
				tc.oAttributes["colspan"] = cellPr.GridSpan;
        }
        if(null != cellPr && null != cellPr.Shd)
        {
            if (c_oAscShdNil != cellPr.Shd.Value && (null != cellPr.Shd.Color || null != cellPr.Shd.Unifill))
                tcStyle += "background-color:" + this.RGBToCSS(cellPr.Shd.Color, cellPr.Shd.Unifill) + ";";
        }
        else if(null != tablePr && null != tablePr.Shd)
        {
            if (c_oAscShdNil != tablePr.Shd.Value && (null != tablePr.Shd.Color || null != tablePr.Shd.Unifill))
                tcStyle += "background-color:" + this.RGBToCSS(tablePr.Shd.Color, tablePr.Shd.Unifill) + ";";
        }
        var oCellMar = {};
        if(null != cellPr && null != cellPr.TableCellMar)
            this._MergeProp(oCellMar, cellPr.TableCellMar);
        if(null != tablePr && null != tablePr.TableCellMar)
            this._MergeProp(oCellMar, tablePr.TableCellMar);
        tcStyle += this._MarginToStyle(oCellMar, "padding");

        var oCellBorder = cell.Get_Borders();
        tcStyle += this._BordersToStyle(oCellBorder, false, false);

        if("" != tcStyle)
            tc.oAttributes["style"] = tcStyle;
        //Content
        this.CopyDocument2(tc, cell.Content);

        tr.addChild(tc);
    },
    CopyRow : function(oDomTarget, table, nCurRow, elems, nMaxRow)
    {
        var row = table.Content[nCurRow];
		if(null == elems)
			elems = {gridStart: 0, gridEnd: table.TableGrid.length - 1, indexStart: null, indexEnd: null, after: null, before: null, cells: row.Content};
        var tr = new CopyElement("tr");
        //Pr
		table.Recalculate_Grid();
		var gridSum = table.TableSumGrid;
        var trStyle = "";
        var nGridBefore = 0;
		var rowPr = null;
		
		var CompiledPr = row.Get_CompiledPr();
		if(null != CompiledPr)
			rowPr = CompiledPr;
        if(null != rowPr)
        {
			if(null == elems.before && null != rowPr.GridBefore && rowPr.GridBefore > 0)
			{
                elems.before = rowPr.GridBefore;
				elems.gridStart += rowPr.GridBefore;
			}
			if(null == elems.after && null != rowPr.GridAfter && rowPr.GridAfter > 0)
			{
                elems.after = rowPr.GridAfter;
				elems.gridEnd -= rowPr.GridAfter;
			}
            //height
            if(null != rowPr.Height && Asc.linerule_Auto != rowPr.Height.HRule && null != rowPr.Height.Value)
            {
                trStyle += "height:"+(rowPr.Height.Value * g_dKoef_mm_to_pt)+"pt;";
            }
        }
		//WBefore
        if(null != elems.before)
        {
            if(elems.before > 0)
            {
                nGridBefore = elems.before;
                var nWBefore = gridSum[elems.gridStart - 1] - gridSum[elems.gridStart - nGridBefore - 1];
                //���������� margin
                trStyle += "mso-row-margin-left:"+(nWBefore * g_dKoef_mm_to_pt)+"pt;";
                //��������� td ��� ��� ��� �� �������� mso-row-margin-left
                var oNewTd = new CopyElement("td");
                oNewTd.oAttributes["style"] = "mso-cell-special:placeholder;border:none;padding:0cm 0cm 0cm 0cm";
                oNewTd.oAttributes["width"] = Math.round(nWBefore * g_dKoef_mm_to_pix);
                if(nGridBefore > 1)
                    oNewTd.oAttributes["colspan"] = nGridBefore;
                var oNewP = new CopyElement("p");
				oNewP.oAttributes["style"] = "margin:0cm";
                oNewP.addChild(new CopyElement("&nbsp;", true));
                oNewTd.addChild(oNewP);
                tr.addChild(oNewTd);
            }
        }
		
		var tablePr = null;
		var compiledTablePr = table.Get_CompiledPr();
		if(null != compiledTablePr && null != compiledTablePr.TablePr)
			tablePr = compiledTablePr.TablePr;
        //tc
        for(var i in elems.cells)
        {
            var cell = row.Content[i];
			if(vmerge_Continue != cell.Get_VMerge())
			{
				var StartGridCol = cell.Metrics.StartGridCol;
				var GridSpan = cell.Get_GridSpan();
				var width = gridSum[StartGridCol + GridSpan - 1] - gridSum[StartGridCol - 1];
				//��������� rowspan
				var nRowSpan = table.Internal_GetVertMergeCount(nCurRow, StartGridCol, GridSpan);
				if(nCurRow + nRowSpan - 1 > nMaxRow)
				{
					nRowSpan = nMaxRow - nCurRow + 1;
					if(nRowSpan <= 0)
						nRowSpan = 1;
				}
				this.CopyCell(tr, cell, tablePr, width, nRowSpan);
			}
        }
        //WAfter
        if(null != elems.after)
        {
            if(elems.after > 0)
            {
                var nGridAfter = elems.after;
                var nWAfter = gridSum[elems.gridEnd + nGridAfter] - gridSum[elems.gridEnd];
                //���������� margin
                trStyle += "mso-row-margin-right:"+(nWAfter * g_dKoef_mm_to_pt)+"pt;";
                //��������� td ��� ��� ��� �� �������� mso-row-margin-left
                var oNewTd = new CopyElement("td");
                oNewTd.oAttributes["style"] = "mso-cell-special:placeholder;border:none;padding:0cm 0cm 0cm 0cm";
				oNewTd.oAttributes["width"] = Math.round(nWAfter * g_dKoef_mm_to_pix);
                if(nGridAfter > 1)
					oNewTd.oAttributes["colspan"] = nGridAfter;
                var oNewP = new CopyElement("p");
				oNewP.oAttributes["style"] = "margin:0cm";
				oNewP.addChild(new CopyElement("&nbsp;", true));
                oNewTd.addChild(oNewP);
                tr.addChild(oNewTd);
            }
        }
        if("" != trStyle)
            tr.oAttributes["style"] = trStyle;
			
        oDomTarget.addChild(tr);
    },
    CopyTable : function(oDomTarget, table, aRowElems)
    {
        var DomTable = new CopyElement("table");
		
		var compiledPr = table.Get_CompiledPr();
		
        var Pr = null;
        if(compiledPr && null != compiledPr.TablePr)
            Pr = compiledPr.TablePr;
        var tblStyle = "";
        var bBorder = false;
        if(null != Pr)
        {
			var align = "";
            if(true != table.Inline && null != table.PositionH)
			{
				var PositionH = table.PositionH;
				if(true == PositionH.Align)
				{
					switch(PositionH.Value)
					{
						case c_oAscXAlign.Outside:
						case c_oAscXAlign.Right: align = "right";break;
						case c_oAscXAlign.Center: align = "center";break;
					}
				}
				else if(table.TableSumGrid)
				{
					var TableWidth = table.TableSumGrid[ table.TableSumGrid.length - 1 ];
					var nLeft = PositionH.Value;
					var nRight = nLeft + TableWidth;
					var nFromLeft = Math.abs(nLeft - X_Left_Margin);
					var nFromCenter = Math.abs((Page_Width - X_Right_Margin + X_Left_Margin) / 2 - (nLeft + nRight) / 2);
					var nFromRight = Math.abs(Page_Width - nRight - X_Right_Margin);
					if(nFromRight < nFromLeft || nFromCenter < nFromLeft)
					{
						if(nFromRight < nFromCenter)
							align = "right";
						else
							align = "center";
					}
				}
			}
			else if(null != Pr.Jc)
            {
                switch(Pr.Jc)
                {
                    case align_Center:align = "center";break;
                    case align_Right:align = "right";break;
                }
            }
			if("" != align)
				DomTable.oAttributes["align"] = align;
            if(null != Pr.TableInd)
                tblStyle += "margin-left:"+(Pr.TableInd * g_dKoef_mm_to_pt)+"pt;";
            if (null != Pr.Shd && c_oAscShdNil != Pr.Shd.Value && (null != Pr.Shd.Color || null != Pr.Shd.Unifill))
                tblStyle += "background:" + this.RGBToCSS(Pr.Shd.Color, Pr.Shd.Unifill) + ";";
            if(null != Pr.TableCellMar)
                tblStyle += this._MarginToStyle(Pr.TableCellMar, "mso-padding-alt");
            if(null != Pr.TableBorders)
                tblStyle += this._BordersToStyle(Pr.TableBorders, true, false);
        }
        //���� cellSpacing
        var bAddSpacing = false;
        if(table.Content.length > 0)
        {
            var firstRow = table.Content[0];
			var rowPr = firstRow.Get_CompiledPr();
            if(null != rowPr && null != rowPr.TableCellSpacing)
            {
                bAddSpacing = true;
                var cellSpacingMM = rowPr.TableCellSpacing;
                tblStyle += "mso-cellspacing:"+(cellSpacingMM * g_dKoef_mm_to_pt)+"pt;";
				DomTable.oAttributes["cellspacing"] = Math.round(cellSpacingMM * g_dKoef_mm_to_pix);
            }
        }
        if(!bAddSpacing)
            DomTable.oAttributes["cellspacing"] = 0;
        DomTable.oAttributes["border"] = false == bBorder ? 0 : 1;
        DomTable.oAttributes["cellpadding"] = 0;
        if("" != tblStyle)
            DomTable.oAttributes["style"] = tblStyle;

        //rows
		if(null == aRowElems)
		{
			for(var i = 0, length = table.Content.length; i < length; i++)
				this.CopyRow(DomTable, table, i , null, table.Content.length - 1);
		}
		else
		{
			var nMaxRow = 0;
			for(var i = 0, length = aRowElems.length; i < length; ++i)
			{
				var elem = aRowElems[i];
				if(elem.row > nMaxRow)
					nMaxRow = elem.row;
			}
			for(var i = 0, length = aRowElems.length; i < length; ++i)
			{
				var elem = aRowElems[i];
				this.CopyRow(DomTable, table, elem.row, elem, nMaxRow);
			}
		}

        oDomTarget.addChild(DomTable);
    },
	
	CopyDocument2 : function(oDomTarget, oDocument, elementsContent, bFromPresentation)
    {	
        if(PasteElementsId.g_bIsDocumentCopyPaste)
		{
			if(!elementsContent && oDocument && oDocument.Content)
				elementsContent = oDocument.Content;
			
			for ( var Index = 0; Index < elementsContent.length; Index++ )
			{
				var Item;
				if(elementsContent[Index].Element)
					Item = elementsContent[Index].Element;
				else
					Item = elementsContent[Index];
				
				if(type_Table === Item.GetType() )
				{
					this.oBinaryFileWriter.copyParams.bLockCopyElems++;
					if(!this.onlyBinaryCopy)
						this.CopyTable(oDomTarget, Item, null);
					this.oBinaryFileWriter.copyParams.bLockCopyElems--;
					
					if(!bFromPresentation)
						this.oBinaryFileWriter.CopyTable(Item, null);
				}
				else if ( type_Paragraph === Item.GetType() )
				{
					var SelectedAll = Index == elementsContent.length - 1 ? elementsContent[Index].SelectedAll : true;
					//todo ����� ������ ��� �������� ������ ���� Index == End
					if(!bFromPresentation)
						this.oBinaryFileWriter.CopyParagraph(Item, SelectedAll);
						
					if(!this.onlyBinaryCopy)
						this.CopyParagraph(oDomTarget, Item, SelectedAll);
				}
			}
		}
		else//presentation
		{
			//DocContent/ Drawings/ SlideObjects
			var presentation = this.oDocument;
			
			if(!elementsContent && oDocument && oDocument.Content)
				elementsContent = oDocument.Content;
			
			if(elementsContent.DocContent || (elementsContent.Drawings && elementsContent.Drawings.length) || (elementsContent.SlideObjects && elementsContent.SlideObjects.length))
			{
				this.oPresentationWriter.WriteString2(this.api.documentId);
				this.oPresentationWriter.WriteDouble(presentation.Width);
				this.oPresentationWriter.WriteDouble(presentation.Height);
			}
			
			if(elementsContent.DocContent)//пишем контент
			{
				var docContent = elementsContent.DocContent;
				
				if(docContent.Elements)
				{
					var elements = docContent.Elements;
					
					//пишем метку и длины
					this.oPresentationWriter.WriteString2("Content");
					this.oPresentationWriter.WriteDouble(elements.length);
					
					//пишем контент
					for ( var Index = 0; Index < elements.length; Index++ )
					{
						var Item;
						if(elements[Index].Element)
							Item = elements[Index].Element;
						else
							Item = elements[Index];
						
						if ( type_Paragraph === Item.GetType() )
						{
							this.oPresentationWriter.StartRecord(0);
							this.oPresentationWriter.WriteParagraph(Item);
							this.oPresentationWriter.EndRecord();

							this.CopyParagraph(oDomTarget, Item, true);
						}
					}
				}
			}
			else if(elementsContent.Drawings && elementsContent.Drawings.length)//пишем графические объекты
			{
				var elements = elementsContent.Drawings;

				//var selected_objects = graphicObjects.State.id === STATES_ID_GROUP ? graphicObjects.State.group.selectedObjects : graphicObjects.selectedObjects;
				
				//пишем метку и длины
				this.oPresentationWriter.WriteString2("Drawings");
				this.oPresentationWriter.WriteULong(elements.length);
				
				pptx_content_writer.Start_UseFullUrl();
				for(var i = 0; i < elements.length; ++i)
				{
					if(!(elements[i].Drawing instanceof CGraphicFrame))
					{
						this.oPresentationWriter.WriteBool(true);

						this.CopyGraphicObject(oDomTarget, elements[i].Drawing, elements[i]);
						this.oPresentationWriter.WriteDouble(elements[i].X);
						this.oPresentationWriter.WriteDouble(elements[i].Y);
						this.oPresentationWriter.WriteDouble(elements[i].ExtX);
						this.oPresentationWriter.WriteDouble(elements[i].ExtY);
						this.oPresentationWriter.WriteString2(elements[i].ImageUrl);
					}
					else
					{
						var isOnlyTable = elements.length === 1 ? true : false;
						this.CopyPresentationTableFull(oDomTarget, elements[i].Drawing, isOnlyTable);
						
						this.oPresentationWriter.WriteDouble(elements[i].X);
						this.oPresentationWriter.WriteDouble(elements[i].Y);
						this.oPresentationWriter.WriteDouble(elements[i].ExtX);
						this.oPresentationWriter.WriteDouble(elements[i].ExtY);
						this.oPresentationWriter.WriteString2(elements[i].ImageUrl);
					}
				}
				pptx_content_writer.End_UseFullUrl();
			}
			else if(elementsContent.SlideObjects && elementsContent.SlideObjects.length)//пишем слайды целиком
			{
				var selected_slides = elementsContent.SlideObjects;

				this.oPresentationWriter.WriteString2("SlideObjects");
				
				this.oPresentationWriter.WriteString2(selected_slides[0].ImageUrl);
				
				this.oPresentationWriter.WriteULong(selected_slides.length);
				var layouts_map = {};
				var layout_count = 0;
				editor.WordControl.m_oLogicDocument.CalculateComments();
				
				//пишем слайд
				var slide;
				for(var i = 0; i < selected_slides.length; ++i)
				{
					slide = selected_slides[i].Slide;
					this.CopySlide(oDomTarget, slide);
					if(!layouts_map[slide.Layout.Get_Id()])
						++layout_count;
					layouts_map[slide.Layout.Get_Id()] = slide.Layout;
				}
				
				//пишем layout
				this.oPresentationWriter.WriteULong(layout_count);
				var arr_layouts_id = [];
				var t = 0;
				for(var key in layouts_map)
				{
					this.CopyLayout(layouts_map[key]);
					arr_layouts_id[t] = layouts_map[key];
					++t;
				}

				var arr_ind = [];
				for(var i = 0; i < selected_slides.length; ++i)
				{
					for(t = 0; t < arr_layouts_id.length; ++t)
					{
						if(selected_slides[i].Slide.Layout === arr_layouts_id[t])
						{
							arr_ind[i] = t;
							break;
						}
					}
				}
				for(var i = 0; i < arr_ind.length; ++i)
				{
					this.oPresentationWriter.WriteULong(arr_ind[i]);
				}
			}
			else if(elementsContent && elementsContent.Content && elementsContent.Content.length)//пишем таблицу в html
			{
				for ( var Index = 0; Index < elementsContent.Content.length; Index++ )
				{
					var Item = elementsContent.Content[Index];
					
					if( type_Table === Item.GetType() )
					{
						this.CopyTable(oDomTarget, Item, null);
					}
					else if ( type_Paragraph === Item.GetType() )
					{
						this.CopyParagraph(oDomTarget, Item, true);
					}
				}
			}
			else if(elementsContent && elementsContent.length)
			{
				for ( var Index = 0; Index < elementsContent.length; Index++ )
				{
					var Item = elementsContent[Index];
					
					if( type_Table === Item.GetType() )
					{
						this.CopyTable(oDomTarget, Item, null);
					}
					else if ( type_Paragraph === Item.GetType() )
					{
						this.CopyParagraph(oDomTarget, Item, true);
					}
				}
			}
			
		}
    },
	
	getSelectedBinary : function()
	{
		var oDocument = this.oDocument;
		
		if(PasteElementsId.g_bIsDocumentCopyPaste)
		{
			var selectedContent = oDocument.Get_SelectedContent();
				
			var elementsContent;
			if(selectedContent && selectedContent.Elements && selectedContent.Elements[0] && selectedContent.Elements[0].Element)
				elementsContent = selectedContent.Elements;
			else 
				return false;
				
			var drawingUrls = [];
			if(selectedContent.DrawingObjects && selectedContent.DrawingObjects.length)
			{
				var url, correctUrl, graphicObj;
				for(var i = 0; i < selectedContent.DrawingObjects.length; i++)
				{
					graphicObj = selectedContent.DrawingObjects[i].GraphicObj;
					if(graphicObj.isImage())
					{
						url = graphicObj.getImageUrl();
						if(window["NativeCorrectImageUrlOnCopy"])
						{
							correctUrl = window["NativeCorrectImageUrlOnCopy"](url);
							
							drawingUrls[i] = correctUrl;
						}
					}	
				}
			}
			
			//подменяем Document для копирования(если не подменить, то commentId будет не соответствовать)
			this.oBinaryFileWriter.Document = elementsContent[0].Element.LogicDocument;
			
			this.oBinaryFileWriter.CopyStart();
			this.CopyDocument2(null, oDocument, elementsContent);
			this.oBinaryFileWriter.CopyEnd();
			
			var sBase64 = this.oBinaryFileWriter.GetResult();
			var text = "";
            if (oDocument.Get_SelectedText)
                text = oDocument.Get_SelectedText();
			
			return {sBase64: "docData;" + sBase64, text: text, drawingUrls: drawingUrls};
		}
	},
	
    Start : function()
    {
		var oDocument = this.oDocument;
		var bFromPresentation;
		
		if(PasteElementsId.g_bIsDocumentCopyPaste)
		{
			var selectedContent = oDocument.Get_SelectedContent();
			
			var elementsContent;
			if(selectedContent && selectedContent.Elements && selectedContent.Elements[0] && selectedContent.Elements[0].Element)
				elementsContent = selectedContent.Elements;
			else 
				return "";
				
			//TODO заглушка для презентационных параграфов(выделен текст внутри диаграммы) - пока не пишем в бинарник
			if(selectedContent.Elements[0].Element && selectedContent.Elements[0].Element.bFromDocument === false)
			{
				this.oBinaryFileWriter.Document = this.oDocument;
			}
			else
			{
				//подменяем Document для копирования(если не подменить, то commentId будет не соответствовать)
				this.oBinaryFileWriter.Document = elementsContent[0].Element.LogicDocument;
			}
				
			this.oBinaryFileWriter.CopyStart();	
			this.CopyDocument2(this.oRoot, oDocument, elementsContent, bFromPresentation);
			this.oBinaryFileWriter.CopyEnd();
		}
        else
        {
			var presentation = editor.WordControl.m_oLogicDocument;
			
			var selectedContent = oDocument.Get_SelectedContent();			
			
			if(!selectedContent.DocContent && (!selectedContent.Drawings || (selectedContent.Drawings && !selectedContent.Drawings.length)) && (!selectedContent.SlideObjects || (selectedContent.SlideObjects && !selectedContent.SlideObjects.length)))
				return false;
			
			//set size, if oDrawingCopyObject is placeholder
			for(var i = 0; i < selectedContent.Drawings.length; ++i)
			{
				var oDrawingCopyObject = selectedContent.Drawings[i];
				
				var sp = oDrawingCopyObject.Drawing;
                AscFormat.ExecuteNoHistory(function(){
                    if(!sp.spPr)
                    {
                        sp.setSpPr(new AscFormat.CSpPr());
                    }
                    if(!sp.spPr.xfrm)
                    {
                        sp.spPr.setXfrm(new AscFormat.CXfrm());
                    }
                    if(!sp.spPr.xfrm.isNotNull())
                    {
                        sp.spPr.xfrm.setOffX(oDrawingCopyObject.X);
                        sp.spPr.xfrm.setOffY(oDrawingCopyObject.Y);
                        sp.spPr.xfrm.setExtX(oDrawingCopyObject.ExtX);
                        sp.spPr.xfrm.setExtY(oDrawingCopyObject.ExtY);
                    }
                }, this, []);
			}
			
			this.CopyDocument2(this.oRoot, oDocument, selectedContent);

            var sBase64 = this.oPresentationWriter.GetBase64Memory();
            sBase64 = "pptData;" + this.oPresentationWriter.pos + ";" + sBase64;
			if(this.oRoot.aChildren && this.oRoot.aChildren.length == 1 && AscBrowser.isSafariMacOs)
			{
				var oElem = this.oRoot.aChildren[0];
				var sStyle = oElem.oAttributes["style"];
				if(null == sStyle)
					oElem.oAttributes["style"] = "font-weight:normal";
				else
					oElem.oAttributes["style"] = sStyle + ";font-weight:normal";//просто добавляем потому что в sStyle не могло быть font-weight, мы всегда пишем <b>
				this.oRoot.wrapChild(new CopyElement("b"));
			}
			if(this.oRoot.aChildren && this.oRoot.aChildren.length  > 0)
				this.oRoot.aChildren[0].oAttributes["class"] = sBase64;
        }
		
		if(PasteElementsId.g_bIsDocumentCopyPaste && PasteElementsId.copyPasteUseBinary && this.oBinaryFileWriter.copyParams.itemCount > 0 && !bFromPresentation)
		{
			var sBase64 = "docData;" + this.oBinaryFileWriter.GetResult();
			if(this.oRoot.aChildren && this.oRoot.aChildren.length == 1 && AscBrowser.isSafariMacOs)
			{
				var oElem = this.oRoot.aChildren[0];
				var sStyle = oElem.oAttributes["style"];
				if(null == sStyle)
					oElem.oAttributes["style"] = "font-weight:normal";
				else
					oElem.oAttributes["style"] = sStyle + ";font-weight:normal";//просто добавляем потому что в sStyle не могло быть font-weight, мы всегда пишем <b>
				this.oRoot.wrapChild(new CopyElement("b"));
			}
			if(this.oRoot.aChildren && this.oRoot.aChildren.length  > 0)
				this.oRoot.aChildren[0].oAttributes["class"] = sBase64;
		}
		
		return sBase64;
    },


    CopySlide: function(oDomTarget, slide)
    {
        var sSrc = slide.getBase64Img();
        //if(sSrc.length > 0)
        {
            var _bounds_cheker = new AscFormat.CSlideBoundsChecker();
            slide.draw(_bounds_cheker, 0);
			var oImg = new CopyElement("img");
			oImg.oAttributes["width"] = Math.round((_bounds_cheker.Bounds.max_x - _bounds_cheker.Bounds.min_x + 1) * g_dKoef_mm_to_pix);
			oImg.oAttributes["height"] = Math.round((_bounds_cheker.Bounds.max_y - _bounds_cheker.Bounds.min_y + 1) * g_dKoef_mm_to_pix);
			oImg.oAttributes["src"] = sSrc;
            oDomTarget.addChild(oImg);
            this.oPresentationWriter.WriteString2(slide.Layout.Get_Id());
            
			var table_styles_ids = [];
            var sp_tree = slide.cSld.spTree;
			

			for(var i = 0; i < sp_tree.length; i++)
			{
				if(sp_tree[i] instanceof CGraphicFrame && sp_tree[i].graphicObject)
				{
					table_styles_ids[table_styles_ids.length] = sp_tree[i].graphicObject.Get_TableStyle();
				}
			}
			
            //записываем table_styles_ids
			this.oPresentationWriter.WriteULong(table_styles_ids.length);
            for(var i = 0; i < table_styles_ids.length; ++i)
            {
                this.oPresentationWriter.WriteBool(table_styles_ids[i] !== null);
                if(table_styles_ids[i] !== null)
                {
                    this.oPresentationWriter.WriteULong(table_styles_ids[i]);
                }
            }

            //записываем slide
			this.oPresentationWriter.WriteSlide(slide);

            //записываем sp_tree параметры
			this.oPresentationWriter.WriteULong(sp_tree.length);
            for(var i = 0; i < sp_tree.length; ++i)
            {
                var sp = sp_tree[i];
                this.oPresentationWriter.WriteDouble(sp.x);
                this.oPresentationWriter.WriteDouble(sp.y);
                this.oPresentationWriter.WriteDouble(sp.extX);
                this.oPresentationWriter.WriteDouble(sp.extY);
            }
        }
    },

    CopyLayout: function(layout)
    {
        this.oPresentationWriter.WriteSlideLayout(layout);
    },


    CopyPresentationTableCells: function(oDomTarget, graphicFrame)
    {
        var aSelectedRows = [];
        var oRowElems = {};
        var Item = graphicFrame.graphicObject;
        if(Item.Selection.Data.length > 0)
        {
            for(var i = 0, length = Item.Selection.Data.length; i < length; ++i)
            {
                var elem = Item.Selection.Data[i];
                var rowElem = oRowElems[elem.Row];
                if(null == rowElem)
                {
                    rowElem = {row: elem.Row, gridStart: null, gridEnd: null, indexStart: null, indexEnd: null, after: null, before: null, cells: {}};
                    oRowElems[elem.Row] = rowElem;
                    aSelectedRows.push(rowElem);
                }
                if(null == rowElem.indexEnd || elem.Cell > rowElem.indexEnd)
                    rowElem.indexEnd = elem.Cell;
                if(null == rowElem.indexStart || elem.Cell < rowElem.indexStart)
                    rowElem.indexStart = elem.Cell;
                rowElem.cells[elem.Cell] = 1;
            }
        }
        aSelectedRows.sort(function(a,b){
            return a.row - b.row;
        });
        var nMinGrid = null;
        var nMaxGrid = null;
        var nPrevStartGrid = null;
        var nPrevEndGrid = null;
        var nPrevRowIndex = null;
        for(var i = 0, length = aSelectedRows.length; i < length; ++i)
        {
            var elem = aSelectedRows[i];
            var nRowIndex = elem.row;
            if(null != nPrevRowIndex)
            {
                if(nPrevRowIndex + 1 != nRowIndex)
                {
                    nMinGrid = null;
                    nMaxGrid = null;
                    break;
                }
            }
            nPrevRowIndex = nRowIndex;
            var row = Item.Content[nRowIndex];
            var cellFirst = row.Get_Cell(elem.indexStart);
            var cellLast = row.Get_Cell(elem.indexEnd);
            var nCurStartGrid = cellFirst.Metrics.StartGridCol;
            var nCurEndGrid = cellLast.Metrics.StartGridCol + cellLast.Get_GridSpan() - 1;
            if(null != nPrevStartGrid && null != nPrevEndGrid)
            {
                //учитываем вертикальный merge, раздвигаем границы
                if(nCurStartGrid > nPrevStartGrid)
                {
                    for(var j = elem.indexStart - 1; j >= 0; --j)
                    {
                        var cellCur = row.Get_Cell(j);
                        if(vmerge_Continue == cellCur.Get_VMerge())
                        {
                            var nCurGridCol = cellCur.Metrics.StartGridCol;
                            if(nCurGridCol >= nPrevStartGrid)
                            {
                                nCurStartGrid = nCurGridCol;
                                elem.indexStart = j;
                            }
                            else
                                break;
                        }
                        else
                            break;
                    }
                }
                if(nCurEndGrid < nPrevEndGrid)
                {
                    for(var j = elem.indexEnd + 1; j < row.Get_CellsCount(); ++j)
                    {
                        var cellCur = row.Get_Cell(j);
                        if(vmerge_Continue == cellCur.Get_VMerge())
                        {
                            var nCurGridCol = cellCur.Metrics.StartGridCol + cellCur.Get_GridSpan() - 1;
                            if(nCurGridCol <= nPrevEndGrid)
                            {
                                nCurEndGrid = nCurGridCol;
                                elem.indexEnd = j;
                            }
                            else
                                break;
                        }
                        else
                            break;
                    }
                }
            }
            elem.gridStart = nPrevStartGrid = nCurStartGrid;
            elem.gridEnd = nPrevEndGrid = nCurEndGrid;
            if(null == nMinGrid || nMinGrid > nCurStartGrid)
                nMinGrid = nCurStartGrid;
            if(null == nMaxGrid || nMaxGrid < nCurEndGrid)
                nMaxGrid = nCurEndGrid;
        }
        if(null != nMinGrid && null != nMaxGrid)
        {
            //выставляем after, before
            for(var i = 0 ,length = aSelectedRows.length; i < length; ++i)
            {
                var elem = aSelectedRows[i];
                elem.before = elem.gridStart - nMinGrid;
                elem.after = nMaxGrid - elem.gridEnd;
            }
            this.CopyTable(oDomTarget, Item, aSelectedRows);
        }
		History.TurnOff();
        var graphic_frame = new CGraphicFrame(graphicFrame.parent);
        var grid = [];

        for(var i = nMinGrid; i <= nMaxGrid; ++i)
        {
            grid.push(graphicFrame.graphicObject.TableGrid[i]);
        }
        var table = new CTable(editor.WordControl.m_oDrawingDocument, graphicFrame, false, 0, 0, 0, 0, 0, aSelectedRows.length, nMaxGrid - nMinGrid+1, grid);
        table.setStyleIndex(graphicFrame.graphicObject.styleIndex);
        graphic_frame.setGraphicObject(table);
        graphic_frame.setXfrm(0, 0, 20, 30, 0, false, false);
        var  b_style_index = false;
        if(AscFormat.isRealNumber(graphic_frame.graphicObject.styleIndex) && graphic_frame.graphicObject.styleIndex > -1)
        {
            b_style_index = true;
        }

        this.oPresentationWriter.WriteULong(1);
        this.oPresentationWriter.WriteBool(false);
        this.oPresentationWriter.WriteBool(b_style_index);
        if(b_style_index)
        {
            this.oPresentationWriter.WriteULong(graphic_frame.graphicObject.styleIndex);
        }
        var old_style_index = graphic_frame.graphicObject.styleIndex;
        graphic_frame.graphicObject.styleIndex = -1;
        this.oPresentationWriter.WriteTable(graphic_frame);
        graphic_frame.graphicObject.styleIndex = old_style_index;

		History.TurnOn();

        this.oBinaryFileWriter.copyParams.itemCount = 0;
    },

    CopyPresentationTableFull: function(oDomTarget, graphicFrame, isOnlyTable)
    {
        var aSelectedRows = [];
        var oRowElems = {};
        var Item = graphicFrame.graphicObject;
		
        var b_style_index = false;
        if(Item.TableStyle)
        {
            b_style_index = true;
        }
		
		var presentation = editor.WordControl.m_oLogicDocument;
		for(var key in presentation.TableStylesIdMap)
        {
            if(presentation.TableStylesIdMap.hasOwnProperty(key))
            {
                this.oPresentationWriter.tableStylesGuides[key] = "{" + AscCommon.GUID() + "}"
            }
        }

		
        this.oPresentationWriter.WriteBool(!b_style_index);
        if(b_style_index)
        {
            var tableStyle = presentation.globalTableStyles.Style[Item.TableStyle];
			this.oPresentationWriter.WriteBool(true);
			this.oPresentationWriter.WriteTableStyle(Item.TableStyle, tableStyle);
			this.oPresentationWriter.WriteBool(true);
			this.oPresentationWriter.WriteString2(Item.TableStyle);
        }
		
		History.TurnOff();
        this.oPresentationWriter.WriteTable(graphicFrame);
		
		//для случая, когда копируем 1 таблицу из презентаций, в бинарник заносим ещё одну такую же табличку, но со скомпиоированными стилями(для вставки в word / excel)
		if(isOnlyTable)
		{
			this.convertToCompileStylesTable(Item);
			this.oPresentationWriter.WriteTable(graphicFrame);
		}
		History.TurnOn();

		this.CopyTable(oDomTarget, Item, null);   
    },

	convertToCompileStylesTable: function(table)
	{
		var t = this;
		
		for(var i = 0; i < table.Content.length; i++)
		{
			var row = table.Content[i];
			for(var j = 0; j < row.Content.length; j++)
			{
				var cell = row.Content[j];
				var compilePr = cell.Get_CompiledPr();
				
				cell.Pr = compilePr;
				
				var shd = compilePr.Shd;
				var color = shd.Get_Color2(this.oDocument.Get_Theme(), this.oDocument.Get_ColorMap());
				cell.Pr.Shd.Unifill = AscFormat.CreteSolidFillRGB(color.r, color.g, color.b);
				
				if(compilePr.TableCellBorders.Bottom)
				{
					var color = compilePr.TableCellBorders.Bottom.Get_Color2(this.oDocument.Get_Theme(), this.oDocument.Get_ColorMap());
					cell.Pr.TableCellBorders.Bottom.Unifill = AscFormat.CreteSolidFillRGB(color.r, color.g, color.b);
				}
				
				if(compilePr.TableCellBorders.Top)
				{
					var color = compilePr.TableCellBorders.Top.Get_Color2(this.oDocument.Get_Theme(), this.oDocument.Get_ColorMap());
					cell.Pr.TableCellBorders.Top.Unifill = AscFormat.CreteSolidFillRGB(color.r, color.g, color.b);
				}
				
				if(compilePr.TableCellBorders.Left)
				{
					var color = compilePr.TableCellBorders.Left.Get_Color2(this.oDocument.Get_Theme(), this.oDocument.Get_ColorMap());
					cell.Pr.TableCellBorders.Left.Unifill = AscFormat.CreteSolidFillRGB(color.r, color.g, color.b);
				}
				
				if(compilePr.TableCellBorders.Right)
				{
					var color = compilePr.TableCellBorders.Right.Get_Color2(this.oDocument.Get_Theme(), this.oDocument.Get_ColorMap());
					cell.Pr.TableCellBorders.Right.Unifill = AscFormat.CreteSolidFillRGB(color.r, color.g, color.b);
				}
			}
		}
	},
	
    CopyGraphicObject: function(oDomTarget, oGraphicObj, drawingCopyObject)
    {
        var sSrc = oGraphicObj.getBase64Img();
        if(sSrc.length > 0)
        {
            var _bounds_cheker = new AscFormat.CSlideBoundsChecker();
            oGraphicObj.draw(_bounds_cheker, 0);
			
			var width, height;
			if(drawingCopyObject && drawingCopyObject.ExtX)
				width = Math.round(drawingCopyObject.ExtX * g_dKoef_mm_to_pix);
			else
				width = Math.round((_bounds_cheker.Bounds.max_x - _bounds_cheker.Bounds.min_x + 1) * g_dKoef_mm_to_pix);
			
			if(drawingCopyObject && drawingCopyObject.ExtY)
				height = Math.round(drawingCopyObject.ExtY * g_dKoef_mm_to_pix);
			else
				height = Math.round((_bounds_cheker.Bounds.max_y - _bounds_cheker.Bounds.min_y + 1) * g_dKoef_mm_to_pix);		
			
			var oImg = new CopyElement("img");
			oImg.oAttributes["width"] = width;
			oImg.oAttributes["height"] = height;
			oImg.oAttributes["src"] = sSrc;
            if (this.api.DocumentReaderMode)
				oImg.oAttributes["style"] = "max-width:100%;";
			oDomTarget.addChild(oImg);

            if(oGraphicObj instanceof CShape)
            {
                this.oPresentationWriter.WriteShape(oGraphicObj);
            }
            else if(oGraphicObj instanceof AscFormat.CImageShape)
            {
                this.oPresentationWriter.WriteImage(oGraphicObj);
            }
            else if(oGraphicObj instanceof AscFormat.CGroupShape)
            {
                this.oPresentationWriter.WriteGroupShape(oGraphicObj);
            }
            else if(oGraphicObj instanceof AscFormat.CChartSpace)
            {
                this.oPresentationWriter.WriteChart(oGraphicObj);
            }
            else if(oGraphicObj instanceof CGraphicFrame)
            {
                this.oPresentationWriter.WriteTable(oGraphicObj);
            }
        }
    }
};

function CopyPasteCorrectString(str)
{
    /*
    // эта реализация на порядок быстрее. Перед выпуском не меняю ничего
    var _ret = "";
    var _len = str.length;

    for (var i = 0; i < _len; i++)
    {
        var _symbol = str[i];
        if (_symbol == "&")
            _ret += "&amp;";
        else if (_symbol == "<")
            _ret += "&lt;";
        else if (_symbol == ">")
            _ret += "&gt;";
        else if (_symbol == "'")
            _ret += "&apos;";
        else if (_symbol == "\"")
            _ret += "&quot;";
        else
            _ret += _symbol;
    }

    return _ret;
    */

    var res = str;
    res = res.replace(/&/g,'&amp;');
    res = res.replace(/</g,'&lt;');
    res = res.replace(/>/g,'&gt;');
    res = res.replace(/'/g,'&apos;');
    res = res.replace(/"/g,'&quot;');
    return res;
}

function Editor_Paste_Exec(api, pastebin, nodeDisplay, onlyBinary)
{
    var oPasteProcessor = new PasteProcessor(api, true, true, false);
    oPasteProcessor.Start(pastebin, nodeDisplay, null, onlyBinary);
}
function trimString( str ){
    return str.replace(/^\s+|\s+$/g, '') ;
}
function sendImgUrls(api, images, callback, bExcel) {

  if (window["AscDesktopEditor"])
  {
    // correct local images
    for (var nIndex = images.length - 1; nIndex >= 0; nIndex--)
    {
      if (0 == images[nIndex].indexOf("file:/"))
        images[nIndex] = window["AscDesktopEditor"]["GetImageBase64"](images[nIndex]);
    }
  }

  var rData = {"id": api.documentId, "c": "imgurls", "userid":  api.documentUserId, "saveindex": g_oDocumentUrls.getMaxIndex(), "data": images};
  api.sync_StartAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.LoadImage);

  api.fCurCallback = function (input) {
    api.sync_EndAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.LoadImage);
    var nError = c_oAscError.ID.No;
    var data;
    if (null != input && "imgurls" == input["type"]) {
      if ("ok" == input["status"]) {
        data = input["data"];
        var urls = {};
        for (var i = 0, length = data.length; i < length; ++i) {
          var elem = data[i];
          if (null != elem.url) {
            urls[elem.path] = elem.url;
          }
        }
        g_oDocumentUrls.addUrls(urls);
      } else {
        nError = AscCommon.mapAscServerErrorToAscError(parseInt(input["data"]));
      }
    } else {
      nError = c_oAscError.ID.Unknown;
    }
    if ( c_oAscError.ID.No !== nError ) {
      if(!bExcel)
        api.sendEvent("asc_onError", nError, c_oAscError.Level.NoCritical);
      else
        api.handlers.trigger("asc_onError", nError, c_oAscError.Level.NoCritical);
    }
    if (!data) {
      //todo сделать функцию очистки, чтобы можно было оборвать paste и показать error
      data = [];
      for ( var i = 0; i < images.length; ++i) {
        data.push({'url': 'error', 'path': 'error'});
      }
    }
    callback(data);
  };
  AscCommon.sendCommand(api, null, rData);
}
function PasteProcessor(api, bUploadImage, bUploadFonts, bNested, pasteInExcel)
{
    this.oRootNode = null;
    this.api = api;
    this.bIsDoublePx  = api.WordControl.bIsDoublePx;
    this.oDocument = api.WordControl.m_oLogicDocument;
    this.oLogicDocument = this.oDocument;
    this.oRecalcDocument = this.oDocument;
    this.map_font_index = api.FontLoader.map_font_index;
    this.bUploadImage = bUploadImage;
    this.bUploadFonts = bUploadFonts;
    this.bNested = bNested;//��� ���������� � ��������
    this.oFonts = {};
    this.oImages = {};
	this.aContent = [];
	
	this.pasteInExcel = pasteInExcel;
	this.pasteInPresentationShape = null;
	
	this.maxTableCell = null;
	
    //��� ������� ������ � ������, ��� ����������� �� word � chrome ���������� ������ ������� ��� <p>
    this.bIgnoreNoBlockText = false;

    this.oCurRun = null;
    this.oCurRunContentPos = 0;
    this.oCurPar = null;
    this.oCurParContentPos = 0;
    this.oCurHyperlink = null;
    this.oCurHyperlinkContentPos = 0;
    this.oCur_rPr = new CTextPr();

    //Br ������� ������ ��� ���� ������ ����� �� ���� �������� br, ���� �� � ������������.
    this.nBrCount = 0;
    //bInBlock ��������� ������� �� �������(��������������� ������ �������� �������� �� child)
    //���� ����� ��������� ������� true != this.bInBlock ������ ��������� ������� �� �������� � �� ���� ��������� ����� ��������
    this.bInBlock = null;

    //������ �������� � ������� ��������� �������� ��� ������
    this.dMaxWidth = Page_Width - X_Left_Margin - X_Right_Margin;
    //���������� ������(�������� ��� ������� ������� �������, ������ ��� ������� ����������� ������ � ��������� � ������� ����� �������� ���� �����������)
    this.dScaleKoef = 1;
    this.bUseScaleKoef = false;
	this.bIsPlainText = false;
	
	this.defaultImgWidth = 50;
	this.defaultImgHeight = 50;

    this.MsoStyles = {"mso-style-type": 1, "mso-pagination": 1, "mso-line-height-rule": 1, "mso-style-textfill-fill-color": 1, "mso-tab-count": 1,
        "tab-stops": 1, "list-style-type": 1, "mso-special-character": 1, "mso-column-break-before": 1, "mso-break-type": 1, "mso-padding-alt": 1, "mso-border-insidev": 1,
        "mso-border-insideh": 1, "mso-row-margin-left": 1, "mso-row-margin-right": 1, "mso-cellspacing": 1, "mso-border-alt": 1,
        "mso-border-left-alt": 1, "mso-border-top-alt": 1, "mso-border-right-alt": 1, "mso-border-bottom-alt": 1, "mso-border-between": 1};
    this.oBorderCache = {};
}
PasteProcessor.prototype =
{
    _GetTargetDocument : function(oDocument)
    {
        if(PasteElementsId.g_bIsDocumentCopyPaste)
        {
			var nDocPosType = oDocument.Get_DocPosType();
            if(docpostype_HdrFtr === nDocPosType)
            {
                if(null != oDocument.HdrFtr && null != oDocument.HdrFtr.CurHdrFtr && null != oDocument.HdrFtr.CurHdrFtr.Content)
                {
                    oDocument = oDocument.HdrFtr.CurHdrFtr.Content;
                    this.oRecalcDocument = oDocument;
                }
            }

            if(nDocPosType === docpostype_DrawingObjects)
            {
                var content = oDocument.DrawingObjects.getTargetDocContent(true);
                if(content)
                {
                    oDocument = content;
                }
            }

            //��� ��������� ������
            var Item = oDocument.Content[oDocument.CurPos.ContentPos];
            if( type_Table == Item.GetType() && null != Item.CurCell)
            {
                this.dMaxWidth = this._CalcMaxWidthByCell(Item.CurCell);
                oDocument = this._GetTargetDocument(Item.CurCell.Content);
            }
        }
        else
        {

        }
        return oDocument;
    },
    _CalcMaxWidthByCell : function(cell)
    {
        var row = cell.Row;
        var table = row.Table;
        var grid = table.TableGrid;
        var nGridBefore = 0;
        if(null != row.Pr && null != row.Pr.GridBefore)
            nGridBefore = row.Pr.GridBefore;
        var nCellIndex = cell.Index;
        var nCellGrid = 1;
        if(null != cell.Pr && null != cell.Pr.GridSpan)
            nCellGrid = cell.Pr.GridSpan;
        var nMarginLeft = 0;
        if(null != cell.Pr && null != cell.Pr.TableCellMar && null != cell.Pr.TableCellMar.Left && tblwidth_Mm == cell.Pr.TableCellMar.Left.Type && null != cell.Pr.TableCellMar.Left.W)
            nMarginLeft = cell.Pr.TableCellMar.Left.W;
        else if(null != table.Pr && null != table.Pr.TableCellMar && null != table.Pr.TableCellMar.Left && tblwidth_Mm == table.Pr.TableCellMar.Left.Type && null != table.Pr.TableCellMar.Left.W)
            nMarginLeft = table.Pr.TableCellMar.Left.W;
        var nMarginRight = 0;
        if(null != cell.Pr && null != cell.Pr.TableCellMar && null != cell.Pr.TableCellMar.Right && tblwidth_Mm == cell.Pr.TableCellMar.Right.Type && null != cell.Pr.TableCellMar.Right.W)
            nMarginRight = cell.Pr.TableCellMar.Right.W;
        else if(null != table.Pr && null != table.Pr.TableCellMar && null != table.Pr.TableCellMar.Right && tblwidth_Mm == table.Pr.TableCellMar.Right.Type && null != table.Pr.TableCellMar.Right.W)
            nMarginRight = table.Pr.TableCellMar.Right.W;
        var nPrevSumGrid = nGridBefore;
        for(var i = 0; i < nCellIndex; ++i)
        {
            var oTmpCell = row.Content[i];
            var nGridSpan = 1;
            if(null != cell.Pr && null != cell.Pr.GridSpan)
                nGridSpan = cell.Pr.GridSpan;
            nPrevSumGrid += nGridSpan;
        }
        var dCellWidth = 0;
        for(var i = nPrevSumGrid, length = grid.length; i < nPrevSumGrid + nCellGrid && i < length; ++i)
            dCellWidth += grid[i];

        if(dCellWidth - nMarginLeft - nMarginRight <= 0)
            dCellWidth = 4;
        else
            dCellWidth -= nMarginLeft + nMarginRight;
        return dCellWidth;
    },
    InsertInDocument : function()
    {
        var oDocument = this.oDocument;

        var nInsertLength = this.aContent.length;
        if(nInsertLength > 0)
        {
            this.InsertInPlace(oDocument, this.aContent);
            if(false == PasteElementsId.g_bIsDocumentCopyPaste)
            {
                oDocument.Recalculate();
                if(oDocument.Parent != null && oDocument.Parent.txBody != null)
                {
                    oDocument.Parent.txBody.recalculate();
                }
            }
        }

        if(false == this.bNested && nInsertLength > 0)
        {
            var bNeedMoveCursor = History.Is_LastPointNeedRecalc();
            this.oRecalcDocument.Recalculate();
            
            if ((oDocument.Get_DocPosType() !== docpostype_DrawingObjects || true === this.oLogicDocument.DrawingObjects.isSelectedText()) && true === bNeedMoveCursor)
            {
                this.oLogicDocument.Cursor_MoveRight(false, false, true);
            }
            
            this.oLogicDocument.Document_UpdateInterfaceState();
            this.oLogicDocument.Document_UpdateSelectionState();
        }
    },
    InsertInPlace : function(oDoc, aNewContent)
    {
        if(!PasteElementsId.g_bIsDocumentCopyPaste)
            return;
        var paragraph = oDoc.Content[oDoc.CurPos.ContentPos];
        if (null != paragraph && type_Paragraph == paragraph.GetType()) {
            var NearPos = { Paragraph: paragraph, ContentPos: paragraph.Get_ParaContentPos(false, false) };
            paragraph.Check_NearestPos(NearPos);
            //делаем небольшой сдвиг по y, потому что сама точка TargetPos для двухстрочного параграфа определяется как верхняя
            //var NearPos = oDoc.Get_NearestPos(this.oLogicDocument.TargetPos.PageNum, this.oLogicDocument.TargetPos.X, this.oLogicDocument.TargetPos.Y + 0.05);//0.05 == 2pix
            var oSelectedContent = new CSelectedContent();
            for (var i = 0, length = aNewContent.length; i < length; ++i) {
                var oSelectedElement = new CSelectedElement();
                oSelectedElement.Element = aNewContent[i];
                if (i == length - 1 && true != this.bInBlock && type_Paragraph == oSelectedElement.Element.GetType())
                    oSelectedElement.SelectedAll = false;
                else
                    oSelectedElement.SelectedAll = true;
                oSelectedContent.Add(oSelectedElement);
            }
			
			//проверка на возможность втавки в формулу
			//TODO проверку на excel пеерсмотреть!!!!
			oSelectedContent.On_EndCollectElements(this.oLogicDocument, true);
			if(!this.pasteInExcel && !this.oLogicDocument.Can_InsertContent(oSelectedContent, NearPos))
            {
                if(!this.pasteInExcel)
                {
                    this.oLogicDocument.Document_Undo();
                    History.Clear_Redo();
                }
                return;
            }

            oDoc.Insert_Content(oSelectedContent, NearPos);
            if(this.oLogicDocument && this.oLogicDocument.DrawingObjects)
            {
                var oTargetTextObject = AscFormat.getTargetTextObject(this.oLogicDocument.DrawingObjects);
                oTargetTextObject && oTargetTextObject.checkExtentsByDocContent && oTargetTextObject.checkExtentsByDocContent();
            }

			this._selectShapesBeforeInsert(aNewContent, oDoc);
			
            paragraph.Clear_NearestPosArray(aNewContent);
        }
    },
	
	InsertInPlacePresentation: function(aNewContent)
	{
		var presentation = editor.WordControl.m_oLogicDocument;
		
		var presentationSelectedContent = new PresentationSelectedContent();
		presentationSelectedContent.DocContent = new CSelectedContent();
		for (var i = 0, length = aNewContent.length; i < length; ++i) {
			var oSelectedElement = new CSelectedElement();
			oSelectedElement.Element = aNewContent[i];
			presentationSelectedContent.DocContent.Elements[i] = oSelectedElement;
		}
		
		presentation.Insert_Content(presentationSelectedContent);
		presentation.Recalculate();
        presentation.Check_CursorMoveRight();
		presentation.Document_UpdateInterfaceState();
	},


    insertInPlace2: function(oDoc, aNewContent)
    {
        var nNewContentLength = aNewContent.length;
        //����� ���� �� Document.Add_NewParagraph

        for(var i = 0; i < aNewContent.length; ++i)
        {
            aNewContent[i].Clear_TextFormatting();
            aNewContent[i].Clear_Formatting(true);
        }
        oDoc.Remove(1, true, true);
        var Item = oDoc.Content[oDoc.CurPos.ContentPos];
        if( type_Paragraph == Item.GetType() )
        {
            if(/*true != this.bInBlock &&*/ 1 == nNewContentLength && type_Paragraph == aNewContent[0].GetType() && Item.CurPos.ContentPos != 1)
            {
                //������� ������ � ��������
                var oInsertPar = aNewContent[0];
                var nContentLength = oInsertPar.Content.length;
                if(nContentLength > 2)
                {
                    var oFindObj = Item.Internal_FindBackward(Item.CurPos.ContentPos, [para_TextPr]);
                    var TextPr = null;
					if ( true === oFindObj.Found && para_TextPr === oFindObj.Type )
						TextPr = Item.Content[oFindObj.LetterPos].Copy();
					else
						TextPr = new ParaTextPr();
                    var nContentPos = Item.CurPos.ContentPos;
                    for(var i = 0; i < nContentLength - 2; ++i)// -2 �� ����������� ����� ���������
                    {
                        var oCurInsItem = oInsertPar.Content[i];
                        if(para_Numbering != oCurInsItem.Type)
                        {
                            Item.Internal_Content_Add(nContentPos, oCurInsItem);
                            nContentPos++;
                        }
                    }
                    Item.Internal_Content_Add(nContentPos, TextPr);
                }
                Item.RecalcInfo.Set_Type_0(pararecalc_0_All);
                Item.RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_All);
                this.oRecalcDocument.ContentLastChangePos = this.oRecalcDocument.CurPos.ContentPos;
            }
            else
            {
                var LastPos = this.oRecalcDocument.CurPos.ContentPos;
                var LastPosCurDoc = oDoc.CurPos.ContentPos;
                //����� ��������� ��������
                var oSourceFirstPar = Item;
                var oSourceLastPar = new Paragraph(oDoc.DrawingDocument, oDoc, 0, 50, 50, X_Right_Field, Y_Bottom_Field );
                if(true !== oSourceFirstPar.Cursor_IsEnd() || oSourceFirstPar.IsEmpty())
                    oSourceFirstPar.Split(oSourceLastPar);
                var oInsFirstPar = aNewContent[0];
                var oInsLastPar = null;
                if(nNewContentLength > 1)
                    oInsLastPar = aNewContent[nNewContentLength - 1];

                var nStartIndex = 0;
                var nEndIndex = nNewContentLength - 1;

                if(type_Paragraph == oInsFirstPar.GetType())
                {
                    //�������� �������� ������� ������������ ��������� � ������ �������� ��������
                    //CopyPr_Open - ������� � �������, �.�. ���� �������� ��� � ���������
                    oInsFirstPar.CopyPr_Open( oSourceFirstPar );
                    //�������� ���������� ������������ ���������
                    oSourceFirstPar.Concat(oInsFirstPar);
                    if(AscCommon.isRealObject(oInsFirstPar.bullet))
                    {
                        oSourceFirstPar.setPresentationBullet(oInsFirstPar.bullet.createDuplicate());
                    }
                    //�������� ��������� ������ ����� ������ �� ��������� ���� ��������
                    nStartIndex++;
                }
                else if(type_Table == oInsFirstPar.GetType())
                {
                    //���� ��������� ������� � ������ ��������, �� �� ��������� ���
                    if(oSourceFirstPar.IsEmpty())
                    {
                        oSourceFirstPar = null;
                    }
                }
                //���� �� ���������� ������ ����� ���������, �� ��������� ���������� ���������� ��������� � ������ ������ �������� ��������� ���������
                if(null != oInsLastPar && type_Paragraph == oInsLastPar.GetType() && true != this.bInBlock)
                {
                    var nNewContentPos = oInsLastPar.Content.length - 2;
                    //�������� �������� ���������� ��������� ��������� � ���������  ����������� ��������
                    //CopyPr - �� ������� � �������, �.�. � ������� ��������� ������� ����� ��������� � ��������
                    var ind = oInsLastPar.Pr.Ind;
                    if(null != oInsLastPar)
                        oSourceLastPar.CopyPr( oInsLastPar );
                    if(oInsLastPar.bullet)
                    {
                        oInsLastPar.Set_Ind(ind);
                    }
                    oInsLastPar.Concat(oSourceLastPar);
                    oInsLastPar.CurPos.ContentPos = nNewContentPos;
                    oSourceLastPar = oInsLastPar;
                    nEndIndex--;
                }
                //���������
                for(var i = nStartIndex; i <= nEndIndex; ++i )
                {
                    var oElemToAdd = aNewContent[i];
                    LastPosCurDoc++;
                    oDoc.Internal_Content_Add(LastPosCurDoc, oElemToAdd);
                }
                if(null != oSourceLastPar)
                {
                    //��������� ��������� ��������
                    LastPosCurDoc++;
                    oDoc.Internal_Content_Add(LastPosCurDoc, oSourceLastPar);
                }
                if(null == oSourceFirstPar)
                {
                    //������� ������ ��������, ������ ��� ����� ������ ���� � ��������� �� ����� �� ������ ���������
                    oDoc.Internal_Content_Remove(LastPosCurDoc, 1);
                    LastPosCurDoc--;
                }
                this.oRecalcDocument.ContentLastChangePos = LastPos;
                Item.RecalcInfo.Set_Type_0(pararecalc_0_All);
                Item.RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_All);
                oDoc.CurPos.ContentPos = LastPosCurDoc;
            }
        }
		
		var content = oDoc.Content;
		for(var  i = 0;  i < content.length; ++i)
		{
            content[i].Recalc_CompiledPr();
			content[i].RecalcInfo.Set_Type_0(pararecalc_0_All);
		}
	},
    ReadFromBinary : function(sBase64, oDocument)
	{
        var openParams = { checkFileSize: false, charCount: 0, parCount: 0 };
		var doc = oDocument ? oDocument : this.oLogicDocument;
        var oBinaryFileReader = new AscCommonWord.BinaryFileReader(doc, openParams);
        var oRes = oBinaryFileReader.ReadFromString(sBase64, true);
        this.bInBlock = oRes.bInBlock;
        return oRes;
	},

    SetShortImageId: function(aPastedImages)
    {
        if(!aPastedImages)
			return;
		
		for(var i = 0, length = aPastedImages.length; i < length; ++i)
        {
            var imageElem = aPastedImages[i];
            if(null != imageElem)
            {
                imageElem.SetUrl(imageElem.Url);
            }
        }
    },

	Start : function(node, nodeDisplay, bDuplicate, fromBinary)
    {
		//PASTE
		var bInsertFromBinary = false;
		
		if(!node && "" === fromBinary)
		{
			return;
		}
		
		if(PasteElementsId.copyPasteUseBinary)
		{
			//get binary
			var base64FromWord = null, base64FromExcel = null, base64FromPresentation;
			var binaryObj = this._getClassBinaryFromHtml(node, fromBinary);
			base64FromExcel = binaryObj.base64FromExcel;
			base64FromWord = binaryObj.base64FromWord;
			base64FromPresentation = binaryObj.base64FromPresentation;
			
			var bTurnOffTrackRevisions = false;
			if(PasteElementsId.g_bIsDocumentCopyPaste)//document
			{
				var oThis = this;
				//удаляем в начале, иначе может получиться что будем вставлять в элементы, которое потом удалим.
				//todo с удалением в начале есть проблема, что удаляем элементы даже при пустом буфере
				this.oLogicDocument.Remove(1, true, true, true);
				this.oDocument = this._GetTargetDocument(this.oDocument);
				
				if(this.oDocument && this.oDocument.bPresentation){
					if(oThis.api.WordControl.m_oLogicDocument.TrackRevisions){
						oThis.api.WordControl.m_oLogicDocument.TrackRevisions = false;
						bTurnOffTrackRevisions = true;
					}
				}
			}
			
			//insert from binary
			if(base64FromExcel)//вставка из редактора таблиц
			{
				this._pasteBinaryFromExcel(base64FromExcel);
				bInsertFromBinary = true;
			}
			else if(base64FromWord)//вставка из редактора документов
			{
				this._pasteBinaryFromWord(base64FromWord, !!(fromBinary));
				bInsertFromBinary = true;
			}
			else if(base64FromPresentation)//вставка из редактора презентаций
			{
				this._pasteBinaryFromPresentation(base64FromPresentation, bDuplicate);
				bInsertFromBinary = true;
			}
			
			if(fromBinary)
			{
				bInsertFromBinary = true;
			}
		}
		
		if(true === bInsertFromBinary)
		{
			if(bTurnOffTrackRevisions){
				oThis.api.WordControl.m_oLogicDocument.TrackRevisions = true;
			}
		}
		else
		{
			this._pasteFromHtml(node, bTurnOffTrackRevisions);
		}
    },
	
	_pasteBinaryFromExcel: function(base64FromExcel)
	{
		var oThis = this;
		
		if(PasteElementsId.g_bIsDocumentCopyPaste)
		{
			var fPrepasteCallback = function(){
				if(false == oThis.bNested)
				{
					oThis.InsertInDocument();
					if(oThis.aContent.bAddNewStyles)
						oThis.api.GenerateStyles();
				}
			};
			
			History.TurnOff();
			var aContentExcel = this._readFromBinaryExcel(base64FromExcel);
			History.TurnOn();
			
			
			if(aContentExcel.arrImages && aContentExcel.arrImages.length)
			{
				var oObjectsForDownload = GetObjectsForImageDownload(aContentExcel.arrImages);
				AscCommon.sendImgUrls(oThis.api, oObjectsForDownload.aUrls, function (data) {
					var oImageMap = {};
					ResetNewUrls(data, oObjectsForDownload.aUrls, oObjectsForDownload.aBuilderImagesByUrl, oImageMap);
					var aContent = oThis._convertExcelBinary(aContentExcel);
					oThis.aContent = aContent.content;
					oThis.api.pre_Paste(aContent.fonts, oImageMap, fPrepasteCallback);
				});
			}
			else
			{
				var aContent = oThis._convertExcelBinary(aContentExcel);
				oThis.aContent = aContent.content;
				oThis.api.pre_Paste(aContent.fonts, aContent.images, fPrepasteCallback);
			}
		}
		else
		{
			var presentation = editor.WordControl.m_oLogicDocument;
			
			var excelContent = AscFormat.ExecuteNoHistory(this._readFromBinaryExcel, this, [base64FromExcel]);
			var aContentExcel = excelContent.workbook;
			var aPastedImages = excelContent.arrImages;
			
			//если есть шейпы, то вставляем их из excel
			if(aContentExcel && aContentExcel.aWorksheets && aContentExcel.aWorksheets[0] && aContentExcel.aWorksheets[0].Drawings && aContentExcel.aWorksheets[0].Drawings.length)
			{
				var paste_callback = function()
				{
					if(false == oThis.bNested)
					{
						for(var i = 0; i < arr_shapes.length; ++i)
						{
							shape = arr_shapes[i].graphicObject.copy();
							
							shape.worksheet = null;
							shape.drawingBase = null;
							
							arr_shapes[i] = new DrawingCopyObject(shape, 0, 0, 0, 0);
						}
						
						var presentationSelectedContent = new PresentationSelectedContent();
						presentationSelectedContent.Drawings = arr_shapes;
				
						presentation.Insert_Content(presentationSelectedContent);
						presentation.Recalculate();

						presentation.Check_CursorMoveRight();
						presentation.Document_UpdateInterfaceState();
					}
				};
				
				
				var arr_shapes = aContentExcel.aWorksheets[0].Drawings;
				
				var aImagesToDownload = [];
				for(var i = 0; i < aPastedImages.length; i++)
				{
					aImagesToDownload.push(aPastedImages[i].Url);
				}
				
				var aContent = {aPastedImages: aPastedImages, images: aImagesToDownload};
				
				//fonts
				var font_map = {};
				for(var i = 0; i < arr_shapes.length; ++i)
				{
					var shape = arr_shapes[i].graphicObject;
					shape.getAllFonts(font_map);
				}
				
				var fonts = [];
				//грузим картинки и фонты
				for(var i in font_map)
					fonts.push(new CFont(i, 0, "", 0));

				//images
				var images = aContent.images;
				var arrImages = aContent.aPastedImages;
				var oObjectsForDownload = GetObjectsForImageDownload(arrImages);
				if(oObjectsForDownload.aUrls.length > 0)
				{
					AscCommon.sendImgUrls(oThis.api, oObjectsForDownload.aUrls, function (data) {
						var oImageMap = {};
						
						History.TurnOff();
						ResetNewUrls(data, oObjectsForDownload.aUrls, oObjectsForDownload.aBuilderImagesByUrl, oImageMap);
						oThis.api.pre_Paste(fonts, oImageMap, paste_callback);
						History.TurnOn();
					});
				}
				else
				{
					var im_arr = [];
					for(var key  in images)
						im_arr.push(key);

					this.SetShortImageId(arrImages);
					this.api.pre_Paste(fonts, im_arr, paste_callback);
				}
				
				return;
			}
			else
			{
				var presentationSelectedContent = new PresentationSelectedContent();
				presentationSelectedContent.DocContent = new CSelectedContent();
				
				var aContent = AscFormat.ExecuteNoHistory(this._convertExcelBinary, this, [excelContent]);
				
				var elements = [], selectedElement, element, drawings = [], pDrawings = [], drawingCopyObject;
				var defaultTableStyleId = presentation.DefaultTableStyleId;
				for(var i = 0; i < aContent.content.length; ++i)
				{
					selectedElement = new CSelectedElement();
					element = aContent.content[i];
					
					if(type_Table == element.GetType())//table
					{
						//TODO переделать количество строк и ширину
						var W = 100;
						var Rows = 3;
						var graphic_frame = new CGraphicFrame();
						graphic_frame.setSpPr(new AscFormat.CSpPr());
						graphic_frame.spPr.setParent(graphic_frame);
						graphic_frame.spPr.setXfrm(new AscFormat.CXfrm());
						graphic_frame.spPr.xfrm.setParent(graphic_frame.spPr);
						graphic_frame.spPr.xfrm.setOffX((this.oDocument.Width - W)/2);
						graphic_frame.spPr.xfrm.setOffY(this.oDocument.Height/5);
						graphic_frame.spPr.xfrm.setExtX(W);
						graphic_frame.spPr.xfrm.setExtY(7.478268771701388 * Rows);
						graphic_frame.setNvSpPr(new AscFormat.UniNvPr());
						
						element = this._convertTableToPPTX(element);
						graphic_frame.setGraphicObject(element.Copy(graphic_frame));
						graphic_frame.graphicObject.Set_TableStyle(defaultTableStyleId);

						drawingCopyObject = new DrawingCopyObject();
						drawingCopyObject.Drawing = graphic_frame;
						pDrawings.push(drawingCopyObject);	
					}
				}
				presentationSelectedContent.Drawings = pDrawings;
				
				var presentation = editor.WordControl.m_oLogicDocument;
				
				//вставка
				var paste_callback = function()
				{
					if(false == oThis.bNested)
					{
						presentation.Insert_Content(presentationSelectedContent);
						presentation.Recalculate();
						presentation.Check_CursorMoveRight();
						presentation.Document_UpdateInterfaceState();
					}
				}
				
				oThis.api.pre_Paste(aContent.fonts, null, paste_callback);
			}
		}
	},
	
	_pasteBinaryFromWord: function(base64FromWord, bIsOnlyFromBinary)
	{
		var oThis = this;
		
		if(PasteElementsId.g_bIsDocumentCopyPaste)
		{
			var aContent = this.ReadFromBinary(base64FromWord);
			
			//вставляем в заголовок диаграммы, предварительно конвертируем все параграфы в презентационный формат
			if(aContent && aContent.content && this.oDocument.bPresentation && oThis.oDocument && oThis.oDocument.Parent && oThis.oDocument.Parent.parent && oThis.oDocument.Parent.parent.parent && oThis.oDocument.Parent.parent.parent.getObjectType && oThis.oDocument.Parent.parent.parent.getObjectType() == AscDFH.historyitem_type_Chart)
			{
				var newContent = [];
				for(var i = 0; i < aContent.content.length; i++)
				{
					if(type_Paragraph === aContent.content[i].Get_Type())
					{
						newContent.push(AscFormat.ConvertParagraphToPPTX(aContent.content[i], this.oDocument.DrawingDocument, this.oDocument));
					}
				}
				
				aContent.content = newContent;
			}
			
			var fPrepasteCallback = function(){
				if(false == oThis.bNested)
				{
					oThis.InsertInDocument();
					if(aContent.bAddNewStyles)
						oThis.api.GenerateStyles();
				}
			}
			
			this.aContent = aContent.content;
			//проверяем список фонтов
			aContent.fonts = oThis._checkFontsOnLoad(aContent.fonts);

			var oObjectsForDownload = GetObjectsForImageDownload(aContent.aPastedImages);
			if(oObjectsForDownload.aUrls.length > 0)
			{
				if(bIsOnlyFromBinary && window["NativeCorrectImageUrlOnPaste"])
				{
					var url;
					for(var i = 0, length = aContent.aPastedImages.length; i < length; ++i)
					{
						url = window["NativeCorrectImageUrlOnPaste"](aContent.aPastedImages[i].Url);
						aContent.images[i] = url;
						
						var imageElem = aContent.aPastedImages[i];
						if(null != imageElem)
						{
							imageElem.SetUrl(url);
						}
					}
					oThis.api.pre_Paste(aContent.fonts, aContent.images, fPrepasteCallback);
				}
				else
				{
					AscCommon.sendImgUrls(oThis.api, oObjectsForDownload.aUrls, function (data)
					{
						ResetNewUrls(data, oObjectsForDownload.aUrls, oObjectsForDownload.aBuilderImagesByUrl, aContent.images);
						oThis.api.pre_Paste(aContent.fonts, aContent.images, fPrepasteCallback);
					});
				}
			}
			else
			{
				oThis.SetShortImageId(aContent.aPastedImages);
				oThis.api.pre_Paste(aContent.fonts, aContent.images, fPrepasteCallback);
			}
		}
		else
		{
			var presentation = editor.WordControl.m_oLogicDocument;
			var trueDocument = this.oDocument;
					
			var tempCDocument = function()
			{
				return new CDocument( this.oDocument.DrawingDocument, false);
			}
			//создаём темповый CDocument
			this.oDocument = AscFormat.ExecuteNoHistory(tempCDocument , this, []);

			AscCommon.g_oIdCounter.m_bRead = true;
			var aContent = AscFormat.ExecuteNoHistory(this.ReadFromBinary, this, [base64FromWord, this.oDocument]);
			AscCommon.g_oIdCounter.m_bRead = false;
			//возврщаем обратно переменные и историю, документ которой заменяется при создании CDocument
			this.oDocument = trueDocument;
			History.Document = trueDocument;
			
			var presentationSelectedContent = new PresentationSelectedContent();
			presentationSelectedContent.DocContent = new CSelectedContent();
			
			var elements = [], selectedElement, element, drawings = [], pDrawings = [], drawingCopyObject;
			var defaultTableStyleId = presentation.DefaultTableStyleId;
			for(var i = 0; i < aContent.content.length; ++i)
			{
				selectedElement = new CSelectedElement();
				element = aContent.content[i];
				//drawings
				element.Get_AllDrawingObjects(drawings);
				if(type_Paragraph == element.GetType())//paragraph
				{
					selectedElement.Element = AscFormat.ConvertParagraphToPPTX(element, null, null, true);
					elements.push(selectedElement);
				}
				else if(type_Table == element.GetType())//table
				{
					//TODO переделать количество строк и ширину
					var W = 100;
					var Rows = 3;
					var graphic_frame = new CGraphicFrame();
					graphic_frame.setSpPr(new AscFormat.CSpPr());
					graphic_frame.spPr.setParent(graphic_frame);
					graphic_frame.spPr.setXfrm(new AscFormat.CXfrm());
					graphic_frame.spPr.xfrm.setParent(graphic_frame.spPr);
					graphic_frame.spPr.xfrm.setOffX((this.oDocument.Width - W)/2);
					graphic_frame.spPr.xfrm.setOffY(this.oDocument.Height/5);
					graphic_frame.spPr.xfrm.setExtX(W);
					graphic_frame.spPr.xfrm.setExtY(7.478268771701388 * Rows);
					graphic_frame.setNvSpPr(new AscFormat.UniNvPr());
					
					element = this._convertTableToPPTX(element, true);
					graphic_frame.setGraphicObject(element.Copy(graphic_frame));
					graphic_frame.graphicObject.Set_TableStyle(defaultTableStyleId);

					drawingCopyObject = new DrawingCopyObject();
					drawingCopyObject.Drawing = graphic_frame;
					pDrawings.push(drawingCopyObject);
					
				}							
			}

			if(drawings && drawings.length)
			{
				//если массив содержит только изображения
				if(elements && 1 === elements.length && elements[0].Element && type_Paragraph == elements[0].Element.Get_Type())
				{
					if(true === this._isParagraphContainsOnlyDrawing(elements[0].Element))
					{
						elements = [];
					}
				}
				
				for(var j = 0; j < drawings.length; j++)
				{
					drawingCopyObject = new DrawingCopyObject();
					drawingCopyObject.Drawing = drawings[j].GraphicObj;
					pDrawings.push(drawingCopyObject);
				}
			}
			presentationSelectedContent.DocContent.Elements = elements;
			presentationSelectedContent.Drawings = pDrawings;

			//вставка
			var paste_callback = function()
			{
				if(false == oThis.bNested)
				{
					presentation.Insert_Content(presentationSelectedContent);
					presentation.Recalculate();
					presentation.Check_CursorMoveRight();
					presentation.Document_UpdateInterfaceState();
				}
			}
			
			
			var font_map = {};
			var images = [];
			//shape.getAllFonts(font_map);
			
			//перебираем шрифты
			var fonts = []; 
			for(var i in font_map)
				fonts.push(new CFont(i, 0, "", 0));
			
			var oObjectsForDownload = GetObjectsForImageDownload(aContent.aPastedImages);
			if(oObjectsForDownload.aUrls.length > 0)
			{
				AscCommon.sendImgUrls(oThis.api, oObjectsForDownload.aUrls, function (data){
					var oImageMap = {};
					ResetNewUrls(data, oObjectsForDownload.aUrls, oObjectsForDownload.aBuilderImagesByUrl, oImageMap);
					//ковертим изображения в презентационный формат
					for (var i = 0; i < presentationSelectedContent.Drawings.length; i++)
					{
						if (!(presentationSelectedContent.Drawings[i].Drawing instanceof CGraphicFrame))
						{
							AscFormat.ExecuteNoHistory(function(){
								if (presentationSelectedContent.Drawings[i].Drawing.setBDeleted2)
								{
									presentationSelectedContent.Drawings[i].Drawing.setBDeleted2(true);
								}
								else
								{
									presentationSelectedContent.Drawings[i].Drawing.setBDeleted(true);
								}
							}, this, []);
							presentationSelectedContent.Drawings[i].Drawing = presentationSelectedContent.Drawings[i].Drawing.convertToPPTX(oThis.oDocument.DrawingDocument, undefined, true);
						  AscFormat.checkBlipFillRasterImages(presentationSelectedContent.Drawings[i].Drawing);
						}
					}
					oThis.api.pre_Paste(fonts, oImageMap, paste_callback);
				});
			}
			else
			{
				//ковертим изображения в презентационный формат
				for(var i = 0; i < presentationSelectedContent.Drawings.length; i++)
				{
					if(!(presentationSelectedContent.Drawings[i].Drawing instanceof CGraphicFrame))
					{
						presentationSelectedContent.Drawings[i].Drawing = presentationSelectedContent.Drawings[i].Drawing.convertToPPTX(oThis.oDocument.DrawingDocument, undefined, true);
						AscFormat.checkBlipFillRasterImages(presentationSelectedContent.Drawings[i].Drawing);
					}
				}
				
				oThis.api.pre_Paste(aContent.fonts, aContent.images, paste_callback);
			}
		}
	
	},
	
	_pasteBinaryFromPresentation: function(base64, bDuplicate)
	{
		var oThis = this;
		
		if(PasteElementsId.g_bIsDocumentCopyPaste)
		{
			var fPrepasteCallback = function(){
				if(false == oThis.bNested)
				{
					oThis.InsertInDocument();
					if(aContent.bAddNewStyles)
						oThis.api.GenerateStyles();
				}
			}
			
			
			pptx_content_loader.Clear();

			var _stream = AscFormat.CreateBinaryReader(base64, 0, base64.length);
			var stream = new AscCommon.FileStream(_stream.data, _stream.size);
			var p_url = stream.GetString2();
			var p_width = stream.GetULong()/100000;
			var p_height = stream.GetULong()/100000;
			//var kw = presentation.Width/p_width;
			//var kh = presentation.Height/p_height;
			var fonts = [];
			
			var first_string = stream.GetString2();
			
			switch(first_string)
			{
				case "Content":
				{
					var docContent = this.ReadPresentationText(stream);
					for(var i in this.oFonts)
					{
						fonts.push(new CFont(i, 0, "", 0));
					}
					
					var aContent = [];
					for(var i = 0; i < docContent.length; i++)
					{
						aContent[i] = AscFormat.ConvertParagraphToWord(docContent[i].Element, this.oDocument);
					}						
					this.aContent = aContent;

					oThis.api.pre_Paste(fonts, aContent.images, fPrepasteCallback);
					return;
				}
				case "Drawings":
				{
					//TODO пересмотреть отключение истории!!!
					History.TurnOff();
					var objects = this.ReadPresentationShapes(stream);
					History.TurnOn();
					
					var font_map = {};
					
					var arr_shapes = objects.arrShapes;
					//****если записана одна табличка, то вставляем html и поддерживаем все цвета и стили****
					if(!objects.arrImages.length && objects.arrShapes.length === 1 && objects.arrShapes[0] && objects.arrShapes[0].Drawing && objects.arrShapes[0].Drawing.graphicObject)
					{
						var drawing = objects.arrShapes[0].Drawing;
						
						if(typeof CGraphicFrame !== "undefined" && drawing instanceof CGraphicFrame)
						{
							var aContent = [];
							var table = AscFormat.ConvertGraphicFrameToWordTable(drawing, this.oLogicDocument);
							table.Document_Get_AllFontNames(font_map);
							
							//перебираем шрифты
							for(var i in font_map)
							{
								fonts.push(new CFont(i, 0, "", 0));
							}
							
							//TODO стиль не прокидывается. в будущем нужно реализовать
							table.TableStyle = null;
							aContent.push(table);
							
							this.aContent = aContent;
							oThis.api.pre_Paste(fonts, aContent.images, fPrepasteCallback);
							
							return;
						}
					}
					
						
					var aImagesToDownload = [];
					for(var i = 0; i < objects.arrImages.length; i++)
					{
						aImagesToDownload.push(objects.arrImages[i].Url);
					}
					
					//если несколько графических объектов, то собираем base64 у таблиц(graphicFrame)
					if(objects.arrShapes.length > 1)
					{
						for(var i = 0; i < objects.arrShapes.length; i++)
						{
							if(typeof CGraphicFrame !== "undefined" && objects.arrShapes[i].Drawing instanceof CGraphicFrame)
							{
								aImagesToDownload.push(objects.arrShapes[i].base64);
								objects.arrImages.push(objects.arrShapes[i]);
							}
						}
					}
					
					//get fonts from shapes
					var images = [];
					for(var i = 0; i < objects.arrShapes.length; ++i)
					{
						if(objects.arrShapes[i].Drawing.getAllFonts)
						{
							objects.arrShapes[i].Drawing.getAllFonts(font_map);
						}	
						/*if(objects.arrShapes[i].Drawing.getAllImages)
							objects.arrShapes[i].Drawing.getAllImages(images);*/
					}
					//перебираем шрифты
					for(var i in font_map)
					{
						fonts.push(new CFont(i, 0, "", 0));
					}
					
					//в конце добавляем ссылки на wmf, ole
					for(var i = 0; i < objects.arrImages.length; ++i)
					{
						var oBuilderImage = objects.arrImages[i];
						if (oBuilderImage.AdditionalUrls) 
						{
							for(var j = 0; j < oBuilderImage.AdditionalUrls.length; ++j) 
							{
								aImagesToDownload.push(oBuilderImage.AdditionalUrls[j]);
							}
						}
					}
					
					AscCommon.sendImgUrls(oThis.api, aImagesToDownload, function (data) {
						var image_map = {};
						for (var i = 0, length = Math.min(data.length, objects.arrImages.length); i < length; ++i) 
						{
							var elem = data[i];
							if (null != elem.url) 
							{
								var name = g_oDocumentUrls.imagePath2Local(elem.path);
								var imageElem = objects.arrImages[i];
								if (null != imageElem) 
								{
									//для вставки graphicFrame в виде картинки(если было при копировании выделено несколько графических объектов)
									if (imageElem.base64) 
									{
										imageElem.base64 = name;
									} 
									else 
									{
										imageElem.SetUrl(name);
									}
								}
								image_map[i] = name;
							} 
							else 
							{
								image_map[i] = aImagesToDownload[i];
							}
						}
						
						aContent = oThis._convertExcelBinary(null, arr_shapes);
						oThis.aContent = aContent.content;
						oThis.api.pre_Paste(fonts, image_map, fPrepasteCallback);
					});
					
					return;
				}
				case "SlideObjects":
				{
					History.TurnOff();
					
					var loader = new AscCommon.BinaryPPTYLoader();
					loader.Start_UseFullUrl();
					
					pptx_content_loader.Reader.Start_UseFullUrl();
					
					loader.stream = stream;
					loader.presentation = editor.WordControl.m_oLogicDocument;
					var imageUrl = stream.GetString2();
					
					History.TurnOn();
					
					var aImagesToDownload = [];
					aImagesToDownload.push(imageUrl);
					
					//load image(slide base64)
					AscCommon.sendImgUrls(oThis.api, aImagesToDownload, function (data) {
						var image_map = {};
						var elem = data[0];
						if (null != elem.url) 
						{
							imageUrl = g_oDocumentUrls.imagePath2Local(elem.path);
							image_map[0] = imageUrl;
						} 
						
						//create paragraph, pararun and paradrawing
						var tempParagraph = new Paragraph(oThis.oDocument.DrawingDocument, oThis.oDocument, 0, 0, 0, 0, 0);
						var graphicObj = AscFormat.DrawingObjectsController.prototype.createImage(imageUrl, 0, 0, p_width, p_height);	
						
						var tempParaRun = new ParaRun();
						tempParaRun.Paragraph = null;
						tempParaRun.Add_ToContent( 0, new ParaDrawing(), false );

						tempParaRun.Content[0].Set_GraphicObject(graphicObj);
						tempParaRun.Content[0].GraphicObj.setParent(tempParaRun.Content[0]);
						tempParaRun.Content[0].CheckWH();
						
						tempParagraph.Content.splice(tempParagraph.Content.length - 1, 0, tempParaRun);
						
						aContent = [];
						aContent.push(tempParagraph);
						oThis.aContent = aContent;
						
						oThis.api.pre_Paste(null, image_map, fPrepasteCallback);
					});
					
					return;
				}
			}
		}
		else
		{
			var presentation = editor.WordControl.m_oLogicDocument;
			pptx_content_loader.Clear();

			var _stream = AscFormat.CreateBinaryReader(base64, 0, base64.length);
			var stream = new AscCommon.FileStream(_stream.data, _stream.size);
			var p_url = stream.GetString2();
			var p_width = stream.GetULong()/100000;
			var p_height = stream.GetULong()/100000;
			var kw = presentation.Width/p_width;
			var kh = presentation.Height/p_height;
			var fonts = [];
			
			var first_string = stream.GetString2();
			
			switch(first_string)
			{
				case "Content":
				{
					var docContent = this.ReadPresentationText(stream);
					if(docContent.length === 0){
						return;
					}
					var presentationSelectedContent = new PresentationSelectedContent();
					presentationSelectedContent.DocContent = new CSelectedContent();
					presentationSelectedContent.DocContent.Elements = docContent;

					
					var font_map = {};
					var images = [];
					//shape.getAllFonts(font_map);
					
					//перебираем шрифты
					for(var i in this.oFonts)
					{
						fonts.push(new CFont(i, 0, "", 0));
					}
					
					//вставка
					var paste_callback = function()
					{
						if(false == oThis.bNested)
						{
							presentation.Insert_Content(presentationSelectedContent);
							presentation.Recalculate();
							presentation.Check_CursorMoveRight();
							presentation.Document_UpdateInterfaceState();
						}
					};

					var oPrepeareImages = {};
					this.api.pre_Paste(fonts, oPrepeareImages, paste_callback);
					return;
				}
				case "Drawings":
				{
					var objects = this.ReadPresentationShapes(stream);
					
					var arr_shapes = objects.arrShapes;
					
					var font_map = {};
					var images = [];
					for(var i = 0; i < arr_shapes.length; ++i)
					{
						if(arr_shapes[i].Drawing.getAllFonts)
							arr_shapes[i].Drawing.getAllFonts(font_map);
						if(arr_shapes[i].Drawing.getAllImages)
							arr_shapes[i].Drawing.getAllImages(images);
					}
				   
					var paste_callback = function()
					{
						if(false == oThis.bNested)
						{
							var presentationSelectedContent = new PresentationSelectedContent();
							presentationSelectedContent.Drawings = arr_shapes;
					
							presentation.Insert_Content(presentationSelectedContent);
							
							
							presentation.Recalculate();
							presentation.Document_UpdateInterfaceState();
						}
					};

					//грузим картинки и фонты
					for(var i in font_map)
						fonts.push(new CFont(i, 0, "", 0));

					var oObjectsForDownload = GetObjectsForImageDownload(objects.arrImages);
					if(oObjectsForDownload.aUrls.length > 0)
					{
					  AscCommon.sendImgUrls(oThis.api, oObjectsForDownload.aUrls, function (data) {
						var oImageMap = {};
						ResetNewUrls(data, oObjectsForDownload.aUrls, oObjectsForDownload.aBuilderImagesByUrl, oImageMap);
						oThis.api.pre_Paste(fonts, oImageMap, paste_callback);
					  });
					}
					else
					{
						var im_arr = [];
						for(var key  in images)
							im_arr.push(key);

						this.SetShortImageId(objects.arrImages);
						this.api.pre_Paste(fonts, im_arr, paste_callback);
					}
					return;
				}
				case "SlideObjects":
				{
					var arr_layouts_id = [];
					var arr_slides = [];
					var loader = new AscCommon.BinaryPPTYLoader();
					if(!(bDuplicate === true))
						loader.Start_UseFullUrl();
					loader.stream = stream;
					loader.presentation = editor.WordControl.m_oLogicDocument;
					
					//read slides
					var imageUrl = stream.GetString2();
					var slide_count = stream.GetULong();
					var arr_arrTransforms = [];
					for(var i = 0; i < slide_count; ++i)
					{
						arr_layouts_id[i] = stream.GetString2();
						var table_style_ids_len = stream.GetULong();
						var table_style_ids = [];
						for(var j = 0; j < table_style_ids_len; ++j)
						{
							if(stream.GetBool())
								table_style_ids.push(stream.GetULong());
							else
								table_style_ids.push(-1);
						}
						arr_slides[i] = loader.ReadSlide(0);
						var sp_tree = arr_slides[i].cSld.spTree;
						var t = 0;
						for(var s = 0; s < sp_tree.length; ++s)
						{
							if(sp_tree[s] instanceof CGraphicFrame)
							{
								sp_tree[s].graphicObject.Set_TableStyle(table_style_ids[t], true);
								++t;
							}
						}
						var arrTransforms = [];
						var sp_tree_length = stream.GetULong();
						for(s = 0; s < sp_tree_length; ++s)
						{
							var transform_object = {};
							transform_object.x = stream.GetULong()/100000;
							transform_object.y = stream.GetULong()/100000;
							transform_object.extX = stream.GetULong()/100000;
							transform_object.extY = stream.GetULong()/100000;
							arrTransforms.push(transform_object);
						}
						arr_arrTransforms.push(arrTransforms);
					}

					//read layout
					var arr_layouts = [];
					var master;
					if(presentation.Slides[presentation.CurPage])
						master = presentation.Slides[presentation.CurPage].Layout.Master;
					else
						master = presentation.slideMasters[0];
						
					if(this.api.documentId !== p_url)
					{
						var layouts_count = stream.GetULong();
						for(var i = 0; i < layouts_count; ++i)
						{
							arr_layouts[i] = loader.ReadSlideLayout();
							arr_layouts[i].Width = p_width;
							arr_layouts[i].Height = p_height;
						}
						var arr_indexes = [];
						for(var i = 0; i < slide_count; ++i)
						{
							arr_indexes.push(stream.GetULong());
						}

						for(var i = 0; i < layouts_count; ++i)
						{
							arr_layouts[i].setMaster(master);
							arr_layouts[i].changeSize(presentation.Width, presentation.Height);
							master.addLayout(arr_layouts[i]);
						}
						for(var i =0; i < slide_count; ++i)
						{
							arr_slides[i].changeSize(presentation.Width, presentation.Height);
							arr_slides[i].setLayout(arr_layouts[arr_indexes[i]]);
							arr_slides[i].setSlideSize(presentation.Width, presentation.Height);
						}
					}
					else
					{
						var arr_matched_layout = [];
						var b_read_layouts = false;
						for(var i = 0; i < arr_layouts_id.length; ++i)
						{
							var tempLayout = AscCommon.g_oTableId.Get_ById(arr_layouts_id[i]);
							if(!tempLayout || !tempLayout.Master)
							{
								b_read_layouts = true;
								break;
							}
							else
							{
								for(var j = 0; j < presentation.slideMasters.length; ++j)
								{
									if(presentation.slideMasters[j] === tempLayout.Master)
									{
										break;
									}
								}
								if(j === presentation.slideMasters.length)
								{
									b_read_layouts = true;
									break;
								}
							}
						}
						if(b_read_layouts)
						{
							var layouts_count = stream.GetULong();
							
							AscFormat.ExecuteNoHistory(function(){
								for(var i = 0; i < layouts_count; ++i)
								{
									arr_layouts[i] = loader.ReadSlideLayout();
									arr_layouts[i].Width = p_width;
									arr_layouts[i].Height = p_height;
								}
							}, this, []);
							
							var arr_indexes = [];
							for(var i = 0; i < slide_count; ++i)
							{
								arr_indexes.push(stream.GetULong());
							}

							var addedLayouts = [];
							for(var i = 0; i < slide_count; ++i)
							{
								var tempLayout = AscCommon.g_oTableId.Get_ById(arr_layouts_id[i]);
								if(tempLayout && tempLayout.Master)
								{
									arr_slides[i].changeSize(presentation.Width, presentation.Height);
									arr_slides[i].setSlideSize(presentation.Width, presentation.Height);
									arr_slides[i].setLayout(AscCommon.g_oTableId.Get_ById(arr_layouts_id[i]));
								}
								else
								{
									arr_slides[i].changeSize(presentation.Width, presentation.Height);
									arr_slides[i].setSlideSize(presentation.Width, presentation.Height);
									
									//в данном случае применяем дефолтоый layout(как это делает MS)
									var tempLayout = master.getMatchingLayout(arr_layouts[arr_indexes[i]].type, arr_layouts[arr_indexes[i]].matchingName, arr_layouts[arr_indexes[i]].cSld.name, true);
									arr_slides[i].setLayout(tempLayout);
								}
							}
						}
						else
						{
							for(var i =0; i < slide_count; ++i)
							{
								arr_slides[i].changeSize(presentation.Width, presentation.Height);
								arr_slides[i].setSlideSize(presentation.Width, presentation.Height);
								arr_slides[i].setLayout(AscCommon.g_oTableId.Get_ById(arr_layouts_id[i]));
								//arr_slides[i].Layout.setMaster(master);
								arr_slides[i].Width = presentation.Width;
								arr_slides[i].Height = presentation.Height;
							}
						}
					}


					//images and fonts
					oThis = this;
					var font_map = {};
					var images = [];
					var slideCopyObjects = [];
					for(var i = 0; i < arr_slides.length; ++i)
					{
						if(arr_slides[i].getAllFonts)
							arr_slides[i].getAllFonts(font_map);
						if(arr_slides[i].getAllImages)
							arr_slides[i].getAllImages(images);
							
						slideCopyObjects[i] = new SlideCopyObject();
						slideCopyObjects[i].Slide = arr_slides[i];
					}

					for(var i = 0; i < arr_layouts.length; ++i)
					{
						if(arr_layouts[i].getAllFonts)
							arr_layouts[i].getAllFonts(font_map);
						if(arr_layouts[i].getAllImages)
							arr_layouts[i].getAllImages(images);
					}
					for(var i in font_map)
						fonts.push(new CFont(i, 0, "", 0));
						
						
					//вставка	
					var paste_callback = function()
					{
						
						var presentationSelectedContent = new PresentationSelectedContent();
						presentationSelectedContent.SlideObjects = slideCopyObjects;
						presentation.Insert_Content(presentationSelectedContent);
						presentation.Recalculate();
						presentation.Document_UpdateInterfaceState();
					};

					var image_objects = loader.End_UseFullUrl();
					var objects = {arrImages:image_objects};
					//load images

					var oObjectsForDownload = GetObjectsForImageDownload(objects.arrImages);
					if(oObjectsForDownload.aUrls.length > 0)
					{
						AscCommon.sendImgUrls(oThis.api, oObjectsForDownload.aUrls, function (data) {
							var oImageMap = {};
							ResetNewUrls(data, oObjectsForDownload.aUrls, oObjectsForDownload.aBuilderImagesByUrl, oImageMap);
							oThis.api.pre_Paste(fonts, oImageMap, paste_callback);
						});
					}
					else
					{
						var im_arr = [];
						for(var key  in images)
							im_arr.push(key);

						this.SetShortImageId(objects.arrImages);
						this.api.pre_Paste(fonts, im_arr, paste_callback);
					}
					return;
				}
			}
		}
		
	},
	
	_pasteFromHtml: function(node, bTurnOffTrackRevisions)
	{
		var oThis = this;
		
		var fPasteHtmlPresentationCallback = function()
		{
			oThis.aContent = [];
			 //�� ����� ���������� �������� ��� ������� ��������� �������
			 var arrShapes = [], arrImages = [], arrTables = [];
			var presentation = editor.WordControl.m_oLogicDocument;
			if(presentation.Slides.length === 0)
			{
				presentation.addNextSlide();
			}
			var shape = new CShape();
			shape.setParent(presentation.Slides[presentation.CurPage]);
			shape.setTxBody(AscFormat.CreateTextBodyFromString("", presentation.DrawingDocument, shape));
			arrShapes.push(shape);
			
			oThis._ExecutePresentation(node, {}, true, true, false, arrShapes, arrImages, arrTables);
			
			//если не добавили даные внутрь arrShapes - удаляем пустой CShape
			if(arrShapes.length === 1 && arrShapes[0].txBody && arrShapes[0].txBody.content && arrShapes[0].txBody.content.Content && arrShapes[0].txBody.content.Content.length === 1)
			{
				var txBodyContent = arrShapes[0].txBody.content.Content[0].Content;
				if(txBodyContent && txBodyContent.length === 2 && txBodyContent[0].Content && txBodyContent[0].Content.length === 0)
				{
					arrShapes = [];
				}
			}	
			
			for(var i = 0; i < arrShapes.length; ++i)
			{
				shape = arrShapes[i];
				
				var txBobyContent = shape.txBody.content.Content;
				if(txBobyContent.length > 1 && txBobyContent[0].Content)
				{
					if(txBobyContent[0].Content.length === 1 || (txBobyContent[0].Content.length === 2 && txBobyContent[0].Content[0].Content && txBobyContent[0].Content[0].Content.length === 0))
					{
						shape.txBody.content.Internal_Content_Remove(0, 1);
					}
				}
				
				var w =  shape.txBody.getRectWidth(presentation.Width*2/3);
				var h = shape.txBody.content.Get_SummaryHeight();
				AscFormat.CheckSpPrXfrm(shape);
				shape.spPr.xfrm.setExtX(w);
				shape.spPr.xfrm.setExtY(h);
				shape.spPr.xfrm.setOffX(0);
				shape.spPr.xfrm.setOffY(0);
				shape.txBody.content.Cursor_MoveToEndPos();
				arrShapes[i] = new DrawingCopyObject(shape, 0, 0, w, h);
			}
			
			for(var i = 0; i < arrTables.length; ++i)
			{
				shape = arrTables[i];
			   
				//TODO передалать высоту/ширину!
				//var w =  shape.txBody.getRectWidth(presentation.Width*2/3);
				//var h = shape.txBody.content.Get_SummaryHeight();
				var w = 100;
				var h = 100;
				AscFormat.CheckSpPrXfrm(shape);
				shape.spPr.xfrm.setExtX(w);
				shape.spPr.xfrm.setExtY(h);
				shape.spPr.xfrm.setOffX(0);
				shape.spPr.xfrm.setOffY(0);
				
				arrShapes[arrShapes.length] = new DrawingCopyObject(shape, 0, 0, w, h);
			}
			
			for(var i = 0; i < arrImages.length; ++i)
			{
				shape = arrImages[i];

				AscFormat.CheckSpPrXfrm(shape);
				//shape.spPr.xfrm.setExtX(w);
				//shape.spPr.xfrm.setExtY(h);
				shape.spPr.xfrm.setOffX(0);
				shape.spPr.xfrm.setOffY(0);
				
				arrShapes[arrShapes.length] = new DrawingCopyObject(shape, 0, 0, w, h);
			}
			var presentation = editor.WordControl.m_oLogicDocument;
			var slide = presentation.Slides[presentation.CurPage];
			var targetDocContent = slide.graphicObjects.getTargetDocContent();
			if(targetDocContent && arrShapes.length === 1 && arrImages.length === 0 && arrTables.length === 0)
			{
				if(presentation.Document_Is_SelectionLocked(AscCommon.changestype_Drawing_Props) === false)
				{
					var aNewContent = arrShapes[0].Drawing.txBody.content.Content;
					oThis.InsertInPlacePresentation(aNewContent);
				}
			}
			else
			{
				var presentationSelectedContent = new PresentationSelectedContent();
				presentationSelectedContent.Drawings = arrShapes;

				presentation.Insert_Content(presentationSelectedContent);
				presentation.Recalculate();
				presentation.Check_CursorMoveRight();
				presentation.Document_UpdateInterfaceState();
			}
		};
		
		var fPasteHtmlWordCallback = function()
		{
			oThis.aContent = [];
			
			//если находимся внутри текстовой области диаграммы, то не вставляем ссылки
			if(oThis.oDocument && oThis.oDocument.Parent && oThis.oDocument.Parent.parent && oThis.oDocument.Parent.parent.parent && oThis.oDocument.Parent.parent.parent.getObjectType && oThis.oDocument.Parent.parent.parent.getObjectType() == AscDFH.historyitem_type_Chart)
			{
				var hyperlinks = node.getElementsByTagName("a");
				if(hyperlinks && hyperlinks.length)
				{
					var newElement;
					for(var i = 0; i < hyperlinks.length; i++)
					{
						newElement = document.createElement("span");

						var cssText = hyperlinks[i].getAttribute('style');
						if(cssText)
							newElement.getAttribute('style', cssText);
						
						$(newElement).append(hyperlinks[i].children);
						
						hyperlinks[i].parentNode.replaceChild(newElement, hyperlinks[i]);
					}
				}
				
				//Todo пока сделал так, чтобы не вставлялись графические объекты в название диаграммы, потом нужно будет сделать так же запутанно, как в MS
				var images = node.getElementsByTagName("img");
				if(images && images.length)
				{
					for(var i = 0; i < images.length; i++)
					{	
						images[i].parentNode.removeChild(images[i]);
					}
				}
			}
			if(bTurnOffTrackRevisions){
				oThis.api.WordControl.m_oLogicDocument.TrackRevisions = false;
			}
			//�� ����� ���������� �������� ��� ������� ��������� �������
			oThis._Execute(node, {}, true, true, false);
				
			oThis._AddNextPrevToContent(oThis.oDocument);
			if(false == oThis.bNested)
			{
				oThis.InsertInDocument();
			}
			if(bTurnOffTrackRevisions){
				oThis.api.WordControl.m_oLogicDocument.TrackRevisions = true;
			}
		};
		
		this.oRootNode = node;
		if(PasteElementsId.g_bIsDocumentCopyPaste)
		{
			this.bIsPlainText = this._CheckIsPlainText(node);
            this._Prepeare(node, fPasteHtmlWordCallback);
			
            if(bTurnOffTrackRevisions){
                oThis.api.WordControl.m_oLogicDocument.TrackRevisions = true;
            }
		}
		else
		{
			this.oRootNode = node;
            this._Prepeare(node, fPasteHtmlPresentationCallback);
		}
	},
	
	_getClassBinaryFromHtml: function(node, onlyBinary)
	{
		var classNode, base64FromExcel = null, base64FromWord = null, base64FromPresentation = null;
		
		if(onlyBinary)
		{
			if(onlyBinary.indexOf("pptData;") > -1)
			{
				base64FromPresentation = onlyBinary.split('pptData;')[1];
			}
			else if(onlyBinary.indexOf("docData;") > -1)
			{
				base64FromWord = onlyBinary.split('docData;')[1];
			}
			else if(onlyBinary.indexOf("xslData;") > -1)
			{
				base64FromExcel = onlyBinary.split('xslData;')[1];
			}
		}
		else
		{
			//todo переделать получения класса
			if(node.children[0] && node.children[0].getAttribute("class") != null && (node.children[0].getAttribute("class").indexOf("xslData;") > -1 || node.children[0].getAttribute("class").indexOf("docData;") > -1 || node.children[0].getAttribute("class").indexOf("pptData;") > -1))
			{
				classNode = node.children[0].getAttribute("class");
			}
			else if(node.children[0] && node.children[0].children[0] && node.children[0].children[0].getAttribute("class") != null && (node.children[0].children[0].getAttribute("class").indexOf("xslData;") > -1 || node.children[0].children[0].getAttribute("class").indexOf("docData;") > -1 || node.children[0].children[0].getAttribute("class").indexOf("pptData;") > -1))
			{
				classNode = node.children[0].children[0].getAttribute("class");
			}
			else if(node.children[0] && node.children[0].children[0] && node.children[0].children[0].children[0] && node.children[0].children[0].children[0].getAttribute("class") != null && (node.children[0].children[0].children[0].getAttribute("class").indexOf("xslData;") > -1 || node.children[0].children[0].children[0].getAttribute("class").indexOf("docData;") > -1  || node.children[0].children[0].children[0].getAttribute("class").indexOf("pptData;") > -1))
			{
				classNode = node.children[0].children[0].children[0].getAttribute("class");
			}	
			
			if( classNode != null ){
				var cL = classNode.split(" ");
				for (var i = 0; i < cL.length; i++){
					if(cL[i].indexOf("xslData;") > -1)
					{
						base64FromExcel = cL[i].split('xslData;')[1];
					}
					else if(cL[i].indexOf("docData;") > -1)
					{
						base64FromWord = cL[i].split('docData;')[1];
					}
					else if(cL[i].indexOf("pptData;") > -1)
					{
						base64FromPresentation = cL[i].split('pptData;')[1];
					}
				}
			}
		}
			
		return {base64FromExcel: base64FromExcel, base64FromWord: base64FromWord, base64FromPresentation: base64FromPresentation};
	},
	
	_isParagraphContainsOnlyDrawing: function(par)
	{
		var res = true;
		
		if(par.Content)
		{
			for(var i = 0; i < par.Content.length; i++)
			{	
				if(par.Content[i] && par.Content[i].Content && par.Content[i].Content.length)
				{
					for(var j = 0; j < par.Content[i].Content.length; j++)
					{
						var elem = par.Content[i].Content[j]; 
						if(!(para_Drawing === elem.Get_Type() || para_End === elem.Get_Type()))
						{
							res = false;
						}
					}
				}
			}
		}
		
		return res;
	},
	
	_convertExcelBinary: function(aContentExcel, pDrawings)
	{
		//пока только распознаём только графические объекты
		var aContent = null, tempParagraph = null;
		var imageUrl, isGraphicFrame, extX, extY;
		var fonts = null;
		
		var drawings = pDrawings ? pDrawings : aContentExcel.workbook.aWorksheets[0].Drawings;
		if(drawings && drawings.length)
		{
			var drawing, graphicObj, paraRun, tempParaRun;
			
			aContent = [];
			
			var font_map = {};
			//из excel в word они вставляются в один параграф
			for(var i = 0; i < drawings.length; i++)
			{
				drawing = drawings[i] && drawings[i].Drawing ? drawings[i].Drawing : drawings[i];
				
				//TODO нужна отдельная обработка для таблиц из презентаций
				isGraphicFrame = typeof CTable !== "undefined" && drawing.graphicObject instanceof CTable;
				if(isGraphicFrame && drawings.length > 1 && drawings[i].base64)//если кроме таблички(при вставке из презентаций) содержатся ещё данные, вставляем в виде base64
				{
					if(!tempParagraph)
						tempParagraph = new Paragraph(this.oDocument.DrawingDocument, this.oDocument, 0, 0, 0, 0, 0);
					
					extX = drawings[i].ExtX;
					extY = drawings[i].ExtY;
					imageUrl = drawings[i].base64;
					
					graphicObj = AscFormat.DrawingObjectsController.prototype.createImage(imageUrl, 0, 0, extX, extY);	
					
					tempParaRun = new ParaRun();
					tempParaRun.Paragraph = null;
					tempParaRun.Add_ToContent( 0, new ParaDrawing(), false );

					tempParaRun.Content[0].Set_GraphicObject(graphicObj);
					tempParaRun.Content[0].GraphicObj.setParent(tempParaRun.Content[0]);
					tempParaRun.Content[0].CheckWH();
					
					tempParagraph.Content.splice(tempParagraph.Content.length - 1, 0, tempParaRun);
				}
				else if(isGraphicFrame)
				{
                    drawing.setBDeleted(true);
                    drawing.setWordFlag(false);
					var copyObj = drawing.graphicObject.Copy();
					copyObj.Set_Parent(this.oDocument);
					aContent[aContent.length] = copyObj;
                    drawing.setWordFlag(true);
					
					drawing.getAllFonts(font_map);
				}
				else
				{
					if(!tempParagraph)
						tempParagraph = new Paragraph(this.oDocument.DrawingDocument, this.oDocument, 0, 0, 0, 0, 0);
					
					extX = drawings[i].ExtX;
					extY = drawings[i].ExtY;
					
					drawing.getAllFonts(font_map);
					graphicObj = drawing.graphicObject ? drawing.graphicObject.convertToWord(this.oLogicDocument) : drawing.convertToWord(this.oLogicDocument);
					
					tempParaRun = new ParaRun();
					tempParaRun.Paragraph = null;
					tempParaRun.Add_ToContent( 0, new ParaDrawing(), false );
					
					tempParaRun.Content[0].Set_GraphicObject(graphicObj);
					tempParaRun.Content[0].GraphicObj.setParent(tempParaRun.Content[0]);
                    var oGraphicObj = tempParaRun.Content[0].GraphicObj;
                    if(oGraphicObj.spPr && oGraphicObj.spPr.xfrm)
                    {
                        oGraphicObj.spPr.xfrm.setOffX(0);
                        oGraphicObj.spPr.xfrm.setOffY(0);
                    }
					tempParaRun.Content[0].CheckWH();
					
					tempParagraph.Content.splice(tempParagraph.Content.length - 1, 0, tempParaRun);
				}		
			}
			
			fonts = [];
			for(var i in font_map)
			{
				fonts.push(new CFont(i, 0, "", 0));
			}
			
			if(tempParagraph)
				aContent[aContent.length] = tempParagraph;
		}
		else
		{
			fonts = this._convertTableFromExcel(aContentExcel);
			aContent = this.aContent;
		}
		
		return {content: aContent, fonts: fonts};
	},
	
	_convertTableFromExcel: function(aContentExcel)
	{
		var worksheet = aContentExcel.workbook.aWorksheets[0];
		var pasteRange = AscCommonExcel.g_oRangeCache.getAscRange(aContentExcel.activeRange);
		var rows = worksheet._getRows(), range;
		var tempActiveRef = aContentExcel.activeRange;
		var activeRange = AscCommonExcel.g_oRangeCache.getAscRange(tempActiveRef);
		var t = this;
		var fonts = [];
		
		var convertBorder = function(border)
		{
			var res = new CDocumentBorder();
			if(border.w)
			{
				res.Value = border_Single;
				res.Size = border.w * g_dKoef_pix_to_mm;
			}
			res.Color = new CDocumentColor(border.c.getR(), border.c.getG(), border.c.getB());
			
			return res;
		}
		
		var addFont = function(fontFamily)
		{
			if(!t.aContent.fonts)
				t.aContent.fonts = [];
			
			if(!t.oFonts)
				t.oFonts = [];

			t.oFonts[fontFamily] = {Name: fontFamily, Index: -1};
			fonts.push(new CFont(fontFamily, 0, "", 0));
		}
		
		//grid
		var grid = [];
		var standartWidth = 17;
		for(var i = activeRange.c1; i <= activeRange.c2; i++)
		{
			if(worksheet.aCols[i])
				grid[i - activeRange.c1] = worksheet.aCols[i].width;
			else
				grid[i - activeRange.c1] = standartWidth;
		}
		var table = new CTable(this.oDocument.DrawingDocument, this.oDocument, true, 0, 0, 0, X_Right_Field, Y_Bottom_Field, 0, 0, grid);
		this.aContent.push(table);
		
		var diffRow = activeRange.r2 - activeRange.r1;
		var diffCol = activeRange.c2 - activeRange.c1;
		for(var i = 0; i <= diffRow; i++)
		{
			var row = table.Internal_Add_Row(table.Content.length, 0);
			for(var j = 0; j <= diffCol; j++)
			{
				if(!table.Selection.Data)
					table.Selection.Data = [];
					
				table.Selection.Data[table.Selection.Data.length] = {Cell: j, Row: i};
				
				range = worksheet.getCell3(i + activeRange.r1, j + activeRange.c1);
				var oCurCell = row.Add_Cell(row.Get_CellsCount(), row, null, false);
				
				table.CurCell = oCurCell;
				
				var isMergedCell = range.hasMerged();
				var gridSpan = 1;
				var vMerge = 1;
				if(isMergedCell)
				{
					gridSpan = isMergedCell.c2 - isMergedCell.c1 + 1;
					vMerge = isMergedCell.r2 - isMergedCell.r1 + 1;
				}
				
				//***cell property***
				//set grid
				var sumWidthGrid = 0;
				for(var l = 0; l < gridSpan; l++)
				{
					sumWidthGrid += grid[j + l];
				}
				oCurCell.Set_W(new CTableMeasurement(tblwidth_Mm, sumWidthGrid));
				
				//background color
				var background_color = range.getFill();
				if(null != background_color)
				{
					var Shd = new CDocumentShd();
					Shd.Value = c_oAscShdClear;
					Shd.Color = new CDocumentColor(background_color.getR(), background_color.getG(), background_color.getB());
					oCurCell.Set_Shd(Shd);
				}
				
				//borders
				var borders = range.getBorderFull();
				//left
				var border = convertBorder(borders.l);
				if(null != border)
					oCurCell.Set_Border(border, 3);
				//top
				var border = convertBorder(borders.t);
				if(null != border)
					oCurCell.Set_Border(border, 0);
				//right
				var border = convertBorder(borders.r);
				if(null != border)
					oCurCell.Set_Border(border, 1);
				//bottom
				var border = convertBorder(borders.b);
				if(null != border)
					oCurCell.Set_Border(border, 2);
				
				//merge				
				oCurCell.Set_GridSpan(gridSpan);
				if(vMerge != 1)
				{
					if(isMergedCell.r1 === i + activeRange.r1)
					{
						oCurCell.Set_VMerge(vmerge_Restart);
					}
					else
					{
						oCurCell.Set_VMerge(vmerge_Continue);
					}
				}
				
				var oCurPar = oCurCell.Content.Content[0];
				
				var hyperLink = range.getHyperlink();
				var oCurHyperlink = null;
				if(hyperLink)
				{
					var oCurHyperlink = new ParaHyperlink();
					oCurHyperlink.Set_Paragraph(this.oCurPar);
					oCurHyperlink.Set_Value( hyperLink.Hyperlink );
					if(hyperLink.Tooltip)
						oCurHyperlink.Set_ToolTip(hyperLink.Tooltip);
				}
				
				var value2 = range.getValue2();
				for(var n = 0; n < value2.length; n++)
				{
					var oCurRun = new ParaRun(oCurPar);
					
					//***text property***
					oCurRun.Pr.Bold = value2[n].format.b;
					if(value2[n].format.c)
						oCurRun.Pr.Color = new CDocumentColor(value2[n].format.c.getR(), value2[n].format.c.getG(), value2[n].format.c.getB());
					
					//font					
					var font_family = value2[n].format.fn;
					addFont(font_family);
					oCurRun.Pr.FontFamily = font_family;
					var oFontItem = this.oFonts[font_family];
					if(null != oFontItem && null != oFontItem.Name)
					{
						oCurRun.Pr.RFonts.Ascii = {Name: oFontItem.Name, Index: oFontItem.Index};
						oCurRun.Pr.RFonts.HAnsi = {Name: oFontItem.Name, Index: oFontItem.Index};
						oCurRun.Pr.RFonts.CS = {Name: oFontItem.Name, Index: oFontItem.Index};
						oCurRun.Pr.RFonts.EastAsia = {Name: oFontItem.Name, Index: oFontItem.Index};
					}
					
					oCurRun.Pr.FontSize = value2[n].format.fs;
					oCurRun.Pr.Italic = value2[n].format.i;
					oCurRun.Pr.Strikeout = value2[n].format.s;
					oCurRun.Pr.Underline = value2[n].format.u === 3 ? true : false;
					
					//text
					var value = value2[n].text;
					for(var k = 0, length = value.length; k < length; k++)
					{
						var nUnicode = null;
						var nCharCode = value.charCodeAt(k);
						if (AscCommon.isLeadingSurrogateChar(nCharCode)) {
							if (k + 1 < length) {
								k++;
								var nTrailingChar = value.charCodeAt(k);
								nUnicode = AscCommon.decodeSurrogateChar(nCharCode, nTrailingChar);
							}
						}
						else
							nUnicode = nCharCode;
						if (null != nUnicode) {
							var Item;
							if (0x20 != nUnicode && 0xA0 != nUnicode && 0x2009 != nUnicode) {
								Item = new ParaText();
								Item.Set_CharCode(nUnicode);
							}
							else
								Item = new ParaSpace();
							
							//add text
							oCurRun.Add_ToContent(k, Item, false);
						}
					}
					
					//add run
					if(oCurHyperlink)
						oCurHyperlink.Add_ToContent(n, oCurRun, false);
					else
						oCurPar.Internal_Content_Add(n, oCurRun, false);
				}
				
				if(oCurHyperlink)
					oCurPar.Internal_Content_Add(n, oCurHyperlink, false);
				
				j = j + gridSpan - 1;
			}
			//if((i + vMerge - 1) == diffRow)
				//i = i + vMerge - 1;	
		}
		
		return fonts;
	},
	
	_convertTableToPPTX: function(table, isFromWord)
	{
		//TODO пересмотреть обработку для вложенных таблиц(можно сделать так, как при копировании из документов в таблицы)
        var oTable = AscFormat.ExecuteNoHistory(function(){
            var allRows = [];
            this.maxTableCell = 0;
			
			if(isFromWord)
			{
				table = this._replaceInnerTables(table, allRows, true);
			}
            
            //ковертим внутренние параграфы
            table.bPresentation = true;
            for(var i = 0; i < table.Content.length; i++)
            {
                for(var j = 0; j < table.Content[i].Content.length; j++)
                {
                    var cDocumentContent = table.Content[i].Content[j].Content;
                    cDocumentContent.bPresentation = true;
                    var nIndex = 0;
                    for(var n = 0; n < cDocumentContent.Content.length; n++)
                    {
                        if(cDocumentContent.Content[n] instanceof Paragraph)
                        {
                            cDocumentContent.Content[nIndex] = AscFormat.ConvertParagraphToPPTX(cDocumentContent.Content[nIndex]);
                            ++nIndex;
                        }

                    }
                }
            }
            table.Set_TableLayout(tbllayout_Fixed);
            return table;
        }, this, []);
        return oTable;
	},
	
	_replaceInnerTables: function(table, allRows, isRoot)
	{
		//заменяем внутренние таблички
		for(var i = 0; i < table.Content.length; i++)
		{
			allRows[allRows.length] = table.Content[i];
			
			if(this.maxTableCell < table.Content[i].Content.length)
				this.maxTableCell = table.Content[i].Content.length;
			
			for(var j = 0; j < table.Content[i].Content.length; j++)
			{
				var cDocumentContent = table.Content[i].Content[j].Content;
				cDocumentContent.bPresentation = true;
				
				var k = 0;
				for(var n = 0; n < cDocumentContent.Content.length; n++)
				{
					//если нашли внутреннюю табличку
					if(cDocumentContent.Content[n] instanceof CTable)
					{
						this._replaceInnerTables(cDocumentContent.Content[n], allRows);
						cDocumentContent.Content.splice(n, 1);
					}
				}
			}
		}
		
		//дополняем пустыми ячейками, строки, где ячеек меньше
		if(isRoot === true)
		{
			for(var row = 0; row < allRows.length; row++)
			{
				var cells = allRows[row].Content;
				if(cells.length < this.maxTableCell)
				{
					for(var cell = cells.length; cell < this.maxTableCell; cell++)
					{
						allRows[row].Add_Cell(allRows[row].Get_CellsCount(), allRows[row], null, false);
					}
				}
			}
			
			table.Content = allRows;
			table.Rows = allRows.length;
		}
		
		return table;
	},
	
	_getImagesFromExcelShapes: function(aDrawings, aSpTree, aPastedImages, aUrls)
	{
		//пока только распознаём только графические объекты
		var sImageUrl, nDrawingsCount, oGraphicObj, bDrawings;
        if(Array.isArray(aDrawings))
        {
            nDrawingsCount = aDrawings.length;
            bDrawings = true;
        }
        else if(Array.isArray(aSpTree))
        {
            nDrawingsCount = aSpTree.length;
            bDrawings = false;
        }
        else
        {
            return;
        }
        for(var i = 0; i < nDrawingsCount; i++)
        {
            if(bDrawings)
            {
                oGraphicObj = aDrawings[i].graphicObject;
            }
            else
            {
                oGraphicObj = aSpTree[i];
            }
            if(oGraphicObj)
            {
                if(oGraphicObj.spPr)
                {
                    if(oGraphicObj.spPr.Fill && oGraphicObj.spPr.Fill.fill && typeof oGraphicObj.spPr.Fill.fill.RasterImageId === "string" && oGraphicObj.spPr.Fill.fill.RasterImageId.length > 0)
                    {
                        sImageUrl = oGraphicObj.spPr.Fill.fill.RasterImageId;
                        aPastedImages[aPastedImages.length] = new AscCommon.CBuilderImages(oGraphicObj.spPr.Fill.fill, sImageUrl, null, oGraphicObj.spPr, null);
                        aUrls[aUrls.length] = sImageUrl;
                    }
                    if(oGraphicObj.spPr.ln && oGraphicObj.spPr.ln.Fill && oGraphicObj.spPr.ln.Fill.fill && typeof oGraphicObj.spPr.ln.Fill.fill.RasterImageId === "string" && oGraphicObj.spPr.ln.Fill.fill.RasterImageId.length > 0)
                    {
                        sImageUrl = oGraphicObj.spPr.ln.Fill.fill.RasterImageId;
                        aPastedImages[aPastedImages.length] = new AscCommon.CBuilderImages(oGraphicObj.spPr.ln.Fill.fill, sImageUrl, null, oGraphicObj.spPr, oGraphicObj.spPr.ln.Fill.fill.RasterImageId);
                        aUrls[aUrls.length] = sImageUrl;
                    }
                }
                switch(oGraphicObj.getObjectType())
                {
                    case AscDFH.historyitem_type_ImageShape:
                    {
                        sImageUrl = oGraphicObj.getImageUrl();
                        if(typeof sImageUrl === "string" && sImageUrl.length > 0)
                        {
                            aPastedImages[aPastedImages.length] = new AscCommon.CBuilderImages(oGraphicObj.blipFill, sImageUrl, oGraphicObj, null, null);
                            aUrls[aUrls.length] = sImageUrl;
                        }
                        break;
                    }
                    case AscDFH.historyitem_type_Shape:
                    {
                        break;
                    }
                    case AscDFH.historyitem_type_ChartSpace:
                    {
                        break;
                    }
                    case AscDFH.historyitem_type_GroupShape:
                    {
                        this._getImagesFromExcelShapes(null, oGraphicObj.spTree, aPastedImages, aUrls);
                        break;
                    }
                }
            }
        }
	},

	_selectShapesBeforeInsert: function(aNewContent, oDoc)
	{
		var content, drawingObj, allDrawingObj = [];
		for(var i = 0; i < aNewContent.length; i++)
		{
			content = aNewContent[i];
			drawingObj = content.Get_AllDrawingObjects();
			
			if(!drawingObj || (drawingObj && !drawingObj.length) || content.GetType() == type_Table)
			{
				allDrawingObj = null;
				break;
			}
			
			for(var n = 0; n < drawingObj.length; n++)
			{
				allDrawingObj[allDrawingObj.length] = drawingObj[n];
			};
		};
		
		if(allDrawingObj && allDrawingObj.length)
            this.oLogicDocument.Select_Drawings(allDrawingObj, oDoc);
	},
	
	_readFromBinaryExcel: function(base64)
	{
		var oBinaryFileReader = new AscCommonExcel.BinaryFileReader(true);
		var tempWorkbook = new AscCommonExcel.Workbook();
        tempWorkbook.theme = this.oDocument.theme ? this.oDocument.theme : this.oLogicDocument.theme;
		if(!tempWorkbook.theme && this.oLogicDocument.themes && this.oLogicDocument.themes[0])
			tempWorkbook.theme = this.oLogicDocument.themes[0];
		
		Asc.getBinaryOtherTableGVar(tempWorkbook);
		
		pptx_content_loader.Start_UseFullUrl();
		oBinaryFileReader.Read(base64, tempWorkbook);
		
		return {workbook: tempWorkbook, activeRange: oBinaryFileReader.copyPasteObj.activeRange, arrImages: pptx_content_loader.End_UseFullUrl()};
	},
	
    ReadPresentationText: function(stream)
    {
        var loader = new AscCommon.BinaryPPTYLoader();
        loader.Start_UseFullUrl();
        loader.stream = stream;
        loader.presentation = editor.WordControl.m_oLogicDocument;
        var presentation = editor.WordControl.m_oLogicDocument;
		
		var shape;
		if(presentation.Slides)
			shape = new CShape(presentation.Slides[presentation.CurPage]);
		else	
			shape = new CShape(presentation);
		
        shape.setTxBody(new AscFormat.CTextBody(shape));
		
        var count = stream.GetULong() / 100000;
		
		//читаем контент, здесь только параграфы
		var newDocContent = new AscFormat.CDrawingDocContent(shape.txBody, editor.WordControl.m_oDrawingDocument, 0 , 0, 0, 0, false, false);
		var elements = [], paragraph, selectedElement;
        for(var i = 0; i < count; ++i)
        {
            loader.stream.Skip2(1); // must be 0
			paragraph = loader.ReadParagraph(newDocContent);
			
			//FONTS
			paragraph.Document_Get_AllFontNames(this.oFonts)
			
			selectedElement = new CSelectedElement();
			selectedElement.Element = paragraph;
			elements.push(selectedElement);
        }
        return elements;
    },

    ReadPresentationShapes: function(stream)
    {
        var loader = new AscCommon.BinaryPPTYLoader();
        loader.Start_UseFullUrl();
		
		pptx_content_loader.Reader.Start_UseFullUrl();
		
        loader.stream = stream;
        loader.presentation = editor.WordControl.m_oLogicDocument;
        var presentation = editor.WordControl.m_oLogicDocument;
        var count = stream.GetULong();
        var arr_shapes = [];
        var arr_transforms = [];
		var cStyle;
		
        for(var i = 0; i < count; ++i)
        {
            loader.TempMainObject = presentation && presentation.Slides ? presentation.Slides[presentation.CurPage] : presentation;
            var style_index = null;
			
			//читаем флаг о наличии табличного стиля
            if(!loader.stream.GetBool())
            {
                if(loader.stream.GetBool())
                {
					//в случае если вставляем в презентации, пропускаем
					if(!PasteElementsId.g_bIsDocumentCopyPaste)
					{
						loader.stream.Skip2(1);
						loader.stream.SkipRecord();
					}
					else
					{
						loader.stream.Skip2(1);
						cStyle = loader.ReadTableStyle();
					}
					loader.stream.GetBool();
					style_index = stream.GetString2();
                }
            }
            
			var drawing = loader.ReadGraphicObject();
			
			//для случая, когда копируем 1 таблицу из презентаций, в бинарник заносим ещё одну такую же табличку, но со скомпилированными стилями(для вставки в word/excel)
			if(count === 1 && typeof AscFormat.CGraphicFrame !== "undefined" && drawing instanceof AscFormat.CGraphicFrame)
			{
				//в презентациях пропускаю чтение ещё раз графического объекта
				if(presentation.Slides)
				{
					loader.stream.Skip2(1);
					loader.stream.SkipRecord();
				}
				else
				{
					drawing = loader.ReadGraphicObject();
				}
			}
			
            var x = stream.GetULong()/100000;
            var y = stream.GetULong()/100000;
            var extX = stream.GetULong()/100000;
            var extY = stream.GetULong()/100000;
			var base64 = stream.GetString2();
			
			if(presentation.Slides)
				arr_shapes[i] = new DrawingCopyObject();
			else
				arr_shapes[i] = {};

			arr_shapes[i].Drawing = drawing;
			arr_shapes[i].X = x;
			arr_shapes[i].Y = y;
			arr_shapes[i].ExtX = extX;
			arr_shapes[i].ExtY = extY;
			if(!presentation.Slides)
				arr_shapes[i].base64 = base64;
			
			if(style_index != null && arr_shapes[i].Drawing.graphicObject && arr_shapes[i].Drawing.graphicObject.Set_TableStyle)
			{
				if(!PasteElementsId.g_bIsDocumentCopyPaste)
					arr_shapes[i].Drawing.graphicObject.Set_TableStyle(style_index, true);
				else if(cStyle)
				{
					//пока не применяем стили, посольку они отличаются
					//this._applyStylesToTable(arr_shapes[i].Drawing.graphicObject, cStyle);
				}
			}
        }
		
		var chartImages = pptx_content_loader.Reader.End_UseFullUrl();
		var images = loader.End_UseFullUrl();
		var allImages = chartImages.concat(images);
		
        return {arrShapes: arr_shapes, arrImages: allImages, arrTransforms: arr_transforms};
    },

    ReadPresentationSlides: function(stream)
    {
        var loader = new AscCommon.BinaryPPTYLoader();
        loader.Start_UseFullUrl();
        loader.stream = stream;
        loader.presentation = editor.WordControl.m_oLogicDocument;
        var presentation = editor.WordControl.m_oLogicDocument;
        var count = stream.GetULong();
        var arr_slides = [];
		var slide;
        for(var i = 0; i < count; ++i)
        {
            slide = new SlideCopyObject();
			slide.Slide = loader.ReadSlide(0);
			arr_slides.push(slide);
        }
        return arr_slides;
    },


    ReadSlide: function(stream)
    {
        var loader = new AscCommon.BinaryPPTYLoader();
        loader.Start_UseFullUrl();
        loader.stream = stream;
        loader.presentation = editor.WordControl.m_oLogicDocument;
        var presentation = editor.WordControl.m_oLogicDocument;
        return loader.ReadSlide(0);
    },

    _Prepeare : function(node, fCallback)
    {
		var oThis = this;
        if(true == this.bUploadImage || true == this.bUploadFonts)
        {
            //����������� �� ��������� �������� ������ ������� � ��������.
            var aPrepeareFonts = this._Prepeare_recursive(node, true, true);
     
			var aImagesToDownload = [];
			var _mapLocal = {};
			for(var image in this.oImages)
            {
				var src = this.oImages[image];
				if (undefined !== window["Native"] && undefined !== window["Native"]["GetImageUrl"])
				{
					this.oImages[image] = window["Native"]["GetImageUrl"](this.oImages[image]);
				}
				else if(0 == src.indexOf("file:"))
				{
					if (window["AscDesktopEditor"] !== undefined)
					{
						if (window["AscDesktopEditor"]["LocalFileGetImageUrl"] !== undefined)
						{
							aImagesToDownload.push(src);
						}
						else
						{
							var _base64 = window["AscDesktopEditor"]["GetImageBase64"](src);
							if (_base64 != "")
							{
								aImagesToDownload.push(_base64);
								_mapLocal[_base64] = src;
							}
							else
							{
								this.oImages[image] = "local";
							}
						}						
					}
					else
						this.oImages[image] = "local";
				}
				else if(!g_oDocumentUrls.getImageLocal(src))
					aImagesToDownload.push(src);
			}
			if(aImagesToDownload.length > 0)
			{
        AscCommon.sendImgUrls(oThis.api, aImagesToDownload, function (data) {
          var image_map = {};
          for (var i = 0, length = Math.min(data.length, aImagesToDownload.length); i < length; ++i) {
            var elem = data[i];
            var sFrom = aImagesToDownload[i];
            if (null != elem.url) {
              var name = g_oDocumentUrls.imagePath2Local(elem.path);
              oThis.oImages[sFrom] = name;
              image_map[i] = name;
            } else {
              image_map[i] = sFrom;
            }
          }
          oThis.api.pre_Paste(aPrepeareFonts, image_map, fCallback);
        });
			}
			else
				this.api.pre_Paste(aPrepeareFonts, this.oImages, fCallback);
        }
        else
            fCallback();
    },
    _Prepeare_recursive : function(node, bIgnoreStyle, isCheckFonts)
    {
        //����������� �� ����� ������, �������� ��� ������ � ��������
        var nodeName = node.nodeName.toLowerCase();
        var nodeType = node.nodeType;
        if(!bIgnoreStyle)
        {
            if(Node.TEXT_NODE == nodeType)
            {
                var computedStyle = this._getComputedStyle(node.parentNode);
                if ( computedStyle )
                {
                    var fontFamily = computedStyle.getPropertyValue( "font-family" );
                    this.oFonts[fontFamily] = {Name: g_fontApplication.GetFontNameDictionary(fontFamily, true), Index: -1};
                }
            }
            else
            {
                var src = node.getAttribute("src");
                if(src)
                    this.oImages[src] = src;
            }
        }
        for(var i = 0, length = node.childNodes.length; i < length; i++)
        {
            var child = node.childNodes[i];
            var child_nodeType = child.nodeType;
            if(!(Node.ELEMENT_NODE == child_nodeType || Node.TEXT_NODE == child_nodeType))
                continue;
            //�������� ������� ��������� ������ �� \t,\n,\r
            if( Node.TEXT_NODE == child.nodeType)
            {
                var value = child.nodeValue;
                if(!value)
                    continue;
                value = value.replace(/(\r|\t|\n)/g, '');
                if("" == value)
                    continue;
            }
            this._Prepeare_recursive(child, false);
        }
		
		if(isCheckFonts)
		{
			var aPrepeareFonts = [];
            for(var font_family in this.oFonts)
            {
                //todo ��������� �����, ������ �� ��������
                var oFontItem = this.oFonts[font_family];
                //���� ����� ����� �������
                this.oFonts[font_family].Index = -1;
                aPrepeareFonts.push(new CFont(oFontItem.Name, 0, "", 0));
            };
			
			return aPrepeareFonts;
		};
    },
	_checkFontsOnLoad: function(fonts)
	{
		if(!fonts)
			return;
		return fonts;
	},
    _IsBlockElem : function(name)
    {
        if( "p" == name || "div" == name || "ul" == name || "ol" == name || "li" == name || "table" == name || "tbody" == name || "tr" == name || "td" == name || "th" == name ||
            "h1" == name || "h2" == name || "h3" == name || "h4" == name || "h5" == name || "h6" == name || "center" == name)
            return true;
        return false;
    },
	_getComputedStyle : function(node){
		var computedStyle = null;
		if(null != node && Node.ELEMENT_NODE == node.nodeType)
		{
			var defaultView = node.ownerDocument.defaultView;
            computedStyle = defaultView.getComputedStyle( node, null );
		}
		return computedStyle;
	},
    _ValueToMm : function(value)
    {
        var obj = this._ValueToMmType(value);
        if(obj && "%" != obj.type && "none" != obj.type)
            return obj.val;
        return null;
    },
    _ValueToMmType : function(value)
    {
        var oVal = parseFloat(value);
        var oType;
        if(!isNaN(oVal))
        {
            if(-1 != value.indexOf("%"))
            {
                oType = "%";
                oVal /= 100;
            }
            else if(-1 != value.indexOf("px"))
            {
                oType = "px";
                oVal *= g_dKoef_pix_to_mm;
            }
            else if(-1 != value.indexOf("in"))
            {
                oType = "in";
                oVal *= g_dKoef_in_to_mm;
            }
            else if(-1 != value.indexOf("cm"))
            {
                oType = "cm";
                oVal *= 10;
            }
            else if(-1 != value.indexOf("mm"))
            {
                oType = "mm";
            }
            else if(-1 != value.indexOf("pt"))
            {
                oType = "pt";
                oVal *= g_dKoef_pt_to_mm;
            }
            else if(-1 != value.indexOf("pc"))
            {
                oType = "pc";
                oVal *= g_dKoef_pc_to_mm;
            }
            else
                oType = "none";
            return {val: oVal, type: oType};
        }
        return null;
    },
    _ParseColor : function(color)
    {
        if(!color || color.length == 0)
            return null;
        if("transparent" == color)
            return null;
        if("aqua" == color)
            return new CDocumentColor(0, 255, 255);
        else if("black" == color)
            return new CDocumentColor(0, 0, 0);
        else if("blue" == color)
            return new CDocumentColor(0, 0, 255);
        else if("fuchsia" == color)
            return new CDocumentColor(255, 0, 255);
        else if("gray" == color)
            return new CDocumentColor(128, 128, 128);
        else if("green" == color)
            return new CDocumentColor(0, 128, 0);
        else if("lime" == color)
            return new CDocumentColor(0, 255, 0);
        else if("maroon" == color)
            return new CDocumentColor(128, 0, 0);
        else if("navy" == color)
            return new CDocumentColor(0, 0, 128);
        else if("olive" == color)
            return new CDocumentColor(128, 128, 0);
        else if("purple" == color)
            return new CDocumentColor(128, 0, 128);
        else if("red" == color)
            return new CDocumentColor(255, 0, 0);
        else if("silver" == color)
            return new CDocumentColor(192, 192, 192);
        else if("teal" == color)
            return new CDocumentColor(0, 128, 128);
        else if("white" == color)
            return new CDocumentColor(255, 255, 255);
        else if("yellow" == color)
            return new CDocumentColor(255, 255, 0);
        else
        {
            if(0 == color.indexOf("#"))
            {
                var hex = color.substring(1);
                if(hex.length == 3)
                    hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
                if(hex.length == 6)
                {
                    var r = parseInt("0x" + hex.substring(0,2));
                    var g = parseInt("0x" + hex.substring(2,4));
                    var b = parseInt("0x" + hex.substring(4,6));
                    return new CDocumentColor(r, g, b);
                }
            }
            if(0 == color.indexOf("rgb"))
            {
                var nStart = color.indexOf('(');
                var nEnd = color.indexOf(')');
                if(-1 != nStart && -1 != nEnd && nStart < nEnd)
                {
                    var temp = color.substring(nStart + 1, nEnd);
                    var aParems = temp.split(',');
                    if(aParems.length >= 3)
                    {
                        if(aParems.length >= 4)
                        {
                            var oA = this._ValueToMmType(aParems[3]);
                            if(0 == oA .val)//��������� ����������
                                return null;
                        }
                        var oR = this._ValueToMmType(aParems[0]);
                        var oG = this._ValueToMmType(aParems[1]);
                        var oB = this._ValueToMmType(aParems[2]);
                        var r,g,b;
                        if(oR && "%" == oR.type)
                            r = parseInt(255 * oR.val / 100);
                        else
                            r = oR.val;
                        if(oG && "%" == oG.type)
                            g = parseInt(255 * oG.val / 100);
                        else
                            g = oG.val;
                        if(oB && "%" == oB.type)
                            b = parseInt(255 * oB.val / 100);
                        else
                            b = oB.val;
                        return new CDocumentColor(r, g, b);
                    }
                }
            }
        }
        return null;
    },
    _isEmptyProperty : function(prop)
    {
        var bIsEmpty = true;
        for(var i in prop)
        {
            if(null != prop[i])
            {
                bIsEmpty = false;
                break;
            }
        }
        return bIsEmpty;
    },
    _set_pPr : function(node, Para,  pNoHtmlPr)
    {
        //����������� ����� �� ������ � ������� �������� ��������
		var sNodeName = node.nodeName.toLowerCase();
        if(node != this.oRootNode)
        {
            while(false == this._IsBlockElem(sNodeName))
            {
                if(this.oRootNode != node.parentNode)
				{
                    node = node.parentNode;
					sNodeName = node.nodeName.toLowerCase();
				}
                else
                    break;
            }
        }
		if("td" == sNodeName || "th" == sNodeName)
		{
			//для случая <td>br<span></span></td> без текста в ячейке
			var oNewSpacing = new CParaSpacing();
			oNewSpacing.Set_FromObject({After: 0, Before: 0, Line: Asc.linerule_Auto});
            Para.Set_Spacing(oNewSpacing);
			return;
		}
        var oDocument = this.oDocument;
        //Heading
        if(null != pNoHtmlPr.hLevel && oDocument.Styles)
            Para.Style_Add(oDocument.Styles.Get_Default_Heading(pNoHtmlPr.hLevel));

        var pPr = Para.Pr;

        //Borders
        var oNewBorder = {Left: null, Top: null, Right: null, Bottom: null, Between: null};
        var sBorder = pNoHtmlPr["mso-border-alt"];
        if(null != sBorder)
        {
            var oNewBrd = this._ExecuteParagraphBorder(sBorder);
            oNewBorder.Left = oNewBrd;
            oNewBorder.Top = oNewBrd.Copy();
            oNewBorder.Right = oNewBrd.Copy();
            oNewBorder.Bottom = oNewBrd.Copy();
        }
        else
        {
            sBorder = pNoHtmlPr["mso-border-left-alt"];
            if(null != sBorder)
            {
                var oNewBrd = this._ExecuteParagraphBorder(sBorder);
                oNewBorder.Left = oNewBrd;
            }
            sBorder = pNoHtmlPr["mso-border-top-alt"];
            if(null != sBorder)
            {
                var oNewBrd = this._ExecuteParagraphBorder(sBorder);
                oNewBorder.Top = oNewBrd;
            }
            sBorder = pNoHtmlPr["mso-border-right-alt"];
            if(null != sBorder)
            {
                var oNewBrd = this._ExecuteParagraphBorder(sBorder);
                oNewBorder.Right = oNewBrd;
            }
            sBorder = pNoHtmlPr["mso-border-bottom-alt"];
            if(null != sBorder)
            {
                var oNewBrd = this._ExecuteParagraphBorder(sBorder);
                oNewBorder.Bottom = oNewBrd;
            }
        }
        sBorder = pNoHtmlPr["mso-border-between"];
        if(null != sBorder)
        {
            var oNewBrd = this._ExecuteParagraphBorder(sBorder);
            oNewBorder.Between = oNewBrd;
        }

        var computedStyle = this._getComputedStyle(node);
        if (computedStyle)
        {
            //Ind
            var Ind = new CParaInd();
            var margin_left = computedStyle.getPropertyValue( "margin-left" );
			
			//TODO перепроверить правку с pageColumn
			var curIndexColumn = this.oLogicDocument.Content[this.oLogicDocument.CurPos.ContentPos].Get_CurrentColumn(this.oLogicDocument.CurPage);
			var curPage = this.oLogicDocument.Pages[this.oLogicDocument.CurPage];
			var pageColumn = curPage && curPage.Sections && curPage.Sections[0] && curPage.Sections[0].Columns ? curPage.Sections[0].Columns[curIndexColumn] : null;
            if(margin_left && null != (margin_left = this._ValueToMm(margin_left)))
			{
				if(!pageColumn || (pageColumn && pageColumn.X + margin_left < pageColumn.XLimit))
				{
					Ind.Left = margin_left;
				}
			}
            var margin_right = computedStyle.getPropertyValue( "margin-right" );
            if(margin_right && null != (margin_right = this._ValueToMm(margin_right)))
			{
				if(!pageColumn || (pageColumn && pageColumn.XLimit - margin_right > pageColumn.X))
				{
					Ind.Right = margin_right;
				}
			}
               
            //scale
            // if(null != pPr.Ind.Left && true == this.bUseScaleKoef)
            // pPr.Ind.Left = pPr.Ind.Left * this.dScaleKoef;
            // if(null != pPr.Ind.Right && true == this.bUseScaleKoef)
            // pPr.Ind.Right = pPr.Ind.Right * this.dScaleKoef;
            //�������� ����� ������ margin �� ������� �� ����� ��� �� ����������� ����� ��� �� �������
            if(null != Ind.Left && null != Ind.Right)
            {
                //30 ����������� ��� � �� �������
                var dif = Page_Width - X_Left_Margin - X_Right_Margin - Ind.Left - Ind.Right;
                if(dif < 30)
                    Ind.Right = Page_Width - X_Left_Margin - X_Right_Margin - Ind.Left - 30;
            }
            var text_indent = computedStyle.getPropertyValue( "text-indent" );
            if(text_indent && null != (text_indent = this._ValueToMm(text_indent)))
                Ind.FirstLine = text_indent;
            // if(null != pPr.Ind.FirstLine && true == this.bUseScaleKoef)
            // pPr.Ind.FirstLine = pPr.Ind.FirstLine * this.dScaleKoef;
            if(false == this._isEmptyProperty(Ind))
                Para.Set_Ind(Ind);
            //Jc
            var text_align = computedStyle.getPropertyValue( "text-align" );
            if(text_align)
            {
                //����� ��������� -webkit-right
                var Jc = null;
                if(-1 != text_align.indexOf('center'))
                    Jc = align_Center;
                else if(-1 != text_align.indexOf('right'))
                    Jc = align_Right;
                else if(-1 != text_align.indexOf('justify'))
                    Jc = align_Justify;
                if(null != Jc)
                    Para.Set_Align(Jc, false);
            }
            //Spacing
			var Spacing = new CParaSpacing();
            var margin_top = computedStyle.getPropertyValue( "margin-top" );
            if(margin_top && null != (margin_top = this._ValueToMm(margin_top)))
                Spacing.Before = margin_top;
            var margin_bottom = computedStyle.getPropertyValue( "margin-bottom" );
            if(margin_bottom && null != (margin_bottom = this._ValueToMm(margin_bottom)))
                Spacing.After = margin_bottom;
			var line_height = computedStyle.getPropertyValue( "line-height" );
			if(line_height && null != (line_height = this._ValueToMm(line_height)))
                Spacing.After = line_height;
            if(false == this._isEmptyProperty(Spacing))
                Para.Set_Spacing(Spacing);
            //Shd
            //background-color �� ����������� ��������� ��������, ���� �������� ������������ ��������
            var background_color = null;
            var oTempNode = node;
            while(true)
            {
                var tempComputedStyle = this._getComputedStyle(oTempNode);
                if(null == tempComputedStyle)
                    break;
                background_color = tempComputedStyle.getPropertyValue( "background-color" );
                if(null != background_color && (background_color = this._ParseColor(background_color)))
                    break;
                oTempNode = oTempNode.parentNode;
                if(this.oRootNode == oTempNode || "body" == oTempNode.nodeName.toLowerCase() || true == this._IsBlockElem(oTempNode.nodeName.toLowerCase()))
                    break;
            }
            if(PasteElementsId.g_bIsDocumentCopyPaste)
            {
                if(background_color)
                {
                    var Shd = new CDocumentShd();
                    Shd.Value = c_oAscShdClear;
                    Shd.Color = background_color;
                    Para.Set_Shd(Shd);
                }
            }

            if(null == oNewBorder.Left)
                oNewBorder.Left = this._ExecuteBorder(computedStyle, node, "left", "Left", false);
            if(null == oNewBorder.Top)
                oNewBorder.Top = this._ExecuteBorder(computedStyle, node, "top", "Top", false);
            if(null == oNewBorder.Right)
                oNewBorder.Right = this._ExecuteBorder(computedStyle, node, "left", "Left", false);
            if(null == oNewBorder.Bottom)
                oNewBorder.Bottom = this._ExecuteBorder(computedStyle, node, "bottom", "Bottom", false);
        }
        if(false == this._isEmptyProperty(oNewBorder))
            Para.Set_Borders(oNewBorder);

        //KeepLines , WidowControl
        var pagination = pNoHtmlPr["mso-pagination"];
        if(pagination)
        {
            //todo WidowControl
            if("none" == pagination)
                ;//pPr.WidowControl = !Def_pPr.WidowControl;
            else if(-1 != pagination.indexOf("widow-orphan") && -1 != pagination.indexOf("lines-together"))
                Para.Set_KeepLines(true);
            else if(-1 != pagination.indexOf("none") && -1 != pagination.indexOf("lines-together"))
            {
                ;//pPr.WidowControl = !Def_pPr.WidowControl;
                Para.Set_KeepLines(true);
            }
        }
        //todo KeepNext
        if("avoid" == pNoHtmlPr["page-break-after"])
            ;//pPr.KeepNext = !Def_pPr.KeepNext;
        //PageBreakBefore
        if("always" == pNoHtmlPr["page-break-before"])
            Para.Set_PageBreakBefore(true);
        //Tabs
        var tab_stops = pNoHtmlPr["tab-stops"]
        if(tab_stops && "" != pNoHtmlPr["tab-stops"])
        {
            var aTabs = tab_stops.split(' ');
            var nTabLen = aTabs.length;
            if(nTabLen > 0)
            {
                var Tabs = new CParaTabs();
                for(var i = 0; i < nTabLen; i++)
                {
                    var val = this._ValueToMm(aTabs[i]);
                    if(val)
                        Tabs.Add(new CParaTab(tab_Left, val));
                }
                Para.Set_Tabs(Tabs);
            }
        }

        //num
        if(PasteElementsId.g_bIsDocumentCopyPaste)
        {
            if(true == pNoHtmlPr.bNum)
            {
                var num = numbering_numfmt_Bullet;
                if(null != pNoHtmlPr.numType)
                    num = pNoHtmlPr.numType;
                var type = pNoHtmlPr["list-style-type"];
                if(type)
                {
                    switch(type)
                    {
                        case "disc"       : num = numbering_numfmt_Bullet;break;
                        case "decimal"    : num = numbering_numfmt_Decimal;break;
                        case "lower-roman": num = numbering_numfmt_LowerRoman;break;
                        case "upper-roman": num = numbering_numfmt_UpperRoman;break;
                        case "lower-alpha": num = numbering_numfmt_LowerLetter;break;
                        case "upper-alpha": num = numbering_numfmt_UpperLetter;break;
                    }
                }
                //����� ���� ����������� �� Document.Set_ParagraphNumbering
                
                //������� ����������� ��������, ���� ��� ������ ���������, �� ����� ��� ������ �� ����������� ���������
                var NumId = null;
                if(this.aContent.length > 1)
                {
                    var prevElem = this.aContent[this.aContent.length - 2];
                    if(null != prevElem && type_Paragraph === prevElem.GetType())
                    {
                        var PrevNumPr = prevElem.Numbering_Get();
                        if ( null != PrevNumPr && true === this.oLogicDocument.Numbering.Check_Format( PrevNumPr.NumId, PrevNumPr.Lvl, num ) )
                            NumId  = PrevNumPr.NumId;
                    }
                }
                if(null == NumId && this.pasteInExcel !== true)
                {
                    // Создаем нумерацию
                    NumId  = this.oLogicDocument.Numbering.Create_AbstractNum();
                    var AbstractNum = this.oLogicDocument.Numbering.Get_AbstractNum(NumId);
                    if (numbering_numfmt_Bullet === num)
                    {
                        AbstractNum.Create_Default_Bullet();
                        var LvlText = String.fromCharCode(0x00B7);
                        var NumTextPr = new CTextPr();
                        NumTextPr.RFonts.Set_All("Symbol", -1);

                        switch(type)
                        {
                            case "disc":
                            {
                                NumTextPr.RFonts.Set_All("Symbol", -1);
                                LvlText = String.fromCharCode(0x00B7);
                                break;
                            }
                            case "circle":
                            {
                                NumTextPr.RFonts.Set_All("Courier New", -1);
                                LvlText = "o";
                                break;
                            }
                            case "square":
                            {
                                NumTextPr.RFonts.Set_All("Wingdings", -1);
                                LvlText = String.fromCharCode(0x00A7);
                                break;
                            }
                        }
                    }
                    else
                    {
                        AbstractNum.Create_Default_Numbered();
                    }

                    for (var iLvl = 0; iLvl <= 8; iLvl++)
                    {
                        switch(num)
                        {
                            case numbering_numfmt_Bullet     : AbstractNum.Set_Lvl_Bullet(iLvl, LvlText, NumTextPr); break;
                            case numbering_numfmt_Decimal    : AbstractNum.Set_Lvl_Numbered_2(iLvl);break;
                            case numbering_numfmt_LowerRoman : AbstractNum.Set_Lvl_Numbered_5(iLvl);break;
                            case numbering_numfmt_UpperRoman : AbstractNum.Set_Lvl_Numbered_9(iLvl);break;
                            case numbering_numfmt_LowerLetter: AbstractNum.Set_Lvl_Numbered_8(iLvl);break;
                            case numbering_numfmt_UpperLetter: AbstractNum.Set_Lvl_Numbered_6(iLvl);break;
                        }
                    }
                    //��������� ��������� ������ ����� �� ���������� ������� ���������� ��������
                    var oFirstTextChild = node;
                    while(true)
                    {
                        var bContinue = false;
                        for(var i = 0, length = oFirstTextChild.childNodes.length; i < length; i++)
                        {
                            var child = oFirstTextChild.childNodes[i];
                            var nodeType = child.nodeType;

                            if(!(Node.ELEMENT_NODE == nodeType || Node.TEXT_NODE == nodeType))
                                continue;
                            //�������� ������� ��������� ������ �� \t,\n,\r
                            if( Node.TEXT_NODE == child.nodeType)
                            {
                                var value = child.nodeValue;
                                if(!value)
                                    continue;
                                value = value.replace(/(\r|\t|\n)/g, '');
                                if("" == value)
                                    continue;
                            }
                            if(Node.ELEMENT_NODE == nodeType)
                            {
                                oFirstTextChild = child;
                                bContinue = true;
                                break;
                            }
                        }
                        if(false == bContinue)
                            break;
                    }
                    if(node != oFirstTextChild)
                    {
						if(!this.bIsPlainText)
						{
							var oLvl = AbstractNum.Lvl[0];
							var oTextPr = this._read_rPr(oFirstTextChild);
							if(numbering_numfmt_Bullet == num)
								oTextPr.RFonts = oLvl.TextPr.RFonts.Copy();
								
							//TODO убираю пока при всатвке извне underline/bold/italic у стиля маркера
							oTextPr.Bold = oTextPr.Underline = oTextPr.Italic = undefined;
							if(oFirstTextChild.nodeName.toLowerCase() == "a" && oTextPr.Color)
								oTextPr.Color.Set(0, 0, 0);
							
							//�������� ��������� �� node
							AbstractNum.Apply_TextPr(0, oTextPr);
						}
                    }
                }
				if(this.pasteInExcel !== true && Para.bFromDocument === true)
					Para.Numbering_Add( NumId, 0 );
            }
            else
            {
                var numPr = Para.Numbering_Get();
                if(numPr)
                    Para.Numbering_Remove();
            }
        }
        else
        {
            if(true == pNoHtmlPr.bNum)
            {
                var num = numbering_presentationnumfrmt_Char;
                if(null != pNoHtmlPr.numType)
                    num = pNoHtmlPr.numType;
                var type = pNoHtmlPr["list-style-type"];
                if(type)
                {
                    switch(type)
                    {
                        case "disc": num = numbering_presentationnumfrmt_Char;break;
                        case "decimal": num = numbering_presentationnumfrmt_ArabicPeriod;break;
                        case "lower-roman": num = numbering_presentationnumfrmt_RomanLcPeriod;break;
                        case "upper-roman": num = numbering_presentationnumfrmt_RomanUcPeriod;break;
                        case "lower-alpha": num = numbering_presentationnumfrmt_AlphaLcPeriod;break;
                        case "upper-alpha": num = numbering_presentationnumfrmt_AlphaUcPeriod;break;
                        default:
                        {
                            num = numbering_presentationnumfrmt_Char;
                        }
                    }
                }
                var _bullet = new CPresentationBullet();
                _bullet.m_nType = num;
                if(num == numbering_presentationnumfrmt_Char)
                {
                    _bullet.m_sChar = "�";
                }
                _bullet.m_nStartAt = 1;
                Para.Add_PresentationNumbering2(_bullet );
            }
            else
            {
               Para.Remove_PresentationNumbering();
            }
        }
        Para.CompiledPr.NeedRecalc = true;
    },
    _commit_rPr: function (node, bUseOnlyInherit)
    {
		if(!this.bIsPlainText)
		{
		    var rPr = this._read_rPr(node, bUseOnlyInherit);
			
			//заглушка для вставки в excel внутрь шейпа
			var tempRpr;
			if(this.pasteInExcel === true && this.oDocument && this.oDocument.Parent && this.oDocument.Parent.parent && this.oDocument.Parent.parent.getObjectType() == AscDFH.historyitem_type_Shape)
			{
				tempRpr = new CTextPr();
				tempRpr.Underline = rPr.Underline;
				tempRpr.Bold = rPr.Bold;
				tempRpr.Italic = rPr.Italic;
				
				rPr = tempRpr;
			}
			
			//���� ��������� ��������� ���������� ��������� �������
			if(!this.oCur_rPr.Is_Equal(rPr))
			{
			    this._Set_Run_Pr(rPr);
				this.oCur_rPr = rPr;
			}
		}
    },
    _read_rPr : function(node, bUseOnlyInherit)
    {
        var oDocument = this.oDocument;
        var rPr = new CTextPr();
        if(false == PasteElementsId.g_bIsDocumentCopyPaste)
        {
            rPr.Set_FromObject({
                Bold       : false,
                Italic     : false,
                Underline  : false,
                Strikeout  : false,
				RFonts :
				{
					Ascii: {
						Name  : "Arial",
						Index : -1
					},
					EastAsia: {
						Name  : "Arial",
						Index : -1
					},
					HAnsi: {
						Name  : "Arial",
						Index : -1
					},
					CS: {
						Name  : "Arial",
						Index : -1
					}
				},
                FontSize   : 11,
                Color      :
                {
                    r : 0,
                    g : 0,
                    b : 0
                },
                VertAlign : AscCommon.vertalign_Baseline,
                HighLight : highlight_None
            });
        }
        var computedStyle = this._getComputedStyle(node);
        if ( computedStyle )
        {
            var font_family = computedStyle.getPropertyValue( "font-family" );
            if(font_family && "" != font_family)
            {
                var oFontItem = this.oFonts[font_family];
                if(null != oFontItem && null != oFontItem.Name)
				{
					rPr.RFonts.Ascii = {Name: oFontItem.Name, Index: oFontItem.Index};
					rPr.RFonts.HAnsi = {Name: oFontItem.Name, Index: oFontItem.Index};
					rPr.RFonts.CS = {Name: oFontItem.Name, Index: oFontItem.Index};
					rPr.RFonts.EastAsia = {Name: oFontItem.Name, Index: oFontItem.Index};
				}
            }
            var font_size = node.style.fontSize;
            if(!font_size)
                font_size = computedStyle.getPropertyValue( "font-size" );
            if(font_size)
            {
                var obj = this._ValueToMmType(font_size);
                if(obj && "%" != obj.type && "none" != obj.type)
                {
                    font_size = obj.val;
                    //���� ������� �� ������������ ������� ������� �������� ���������� ������, ��� ���������� ��� ������� 8, 11, 14, 20, 26pt
                    if("px" == obj.type && false == this.bIsDoublePx)
                        font_size = Math.round(font_size * g_dKoef_mm_to_pt);
                    else
                        font_size = Math.round(2 * font_size * g_dKoef_mm_to_pt) / 2;//���������� �������� ���������.
					
					//TODO use constant
					if(font_size > 300)
						font_size = 300;
					else if(font_size === 0)
						font_size = 1;
						
                    rPr.FontSize = font_size;
                }
            }
            var font_weight = computedStyle.getPropertyValue( "font-weight" );
            if(font_weight)
            {
                if("bold" == font_weight || "bolder" == font_weight || 400 < font_weight)
                    rPr.Bold = true;
            }
            var font_style = computedStyle.getPropertyValue( "font-style" );
            if("italic" == font_style)
                rPr.Italic = true;
            var color = computedStyle.getPropertyValue( "color" );
            if(color && (color = this._ParseColor(color)))
            {
                rPr.Color = color;
            }
			
			var spacing = computedStyle.getPropertyValue( "letter-spacing" );
            if(spacing && null != (spacing = this._ValueToMm(spacing)))
                rPr.Spacing = spacing;
			
            //������� �� ��������, ������� �� �����������, ���� �������� ������������ ��������
            var background_color = null;
            var underline = null;
            var Strikeout = null;
            var vertical_align = null;
            var oTempNode = node;
            while (true != bUseOnlyInherit && true)
            {
                var tempComputedStyle = this._getComputedStyle(oTempNode);
                if(null == tempComputedStyle)
                    break;
                if(null == underline || null == Strikeout)
                {
                    var text_decoration = tempComputedStyle.getPropertyValue( "text-decoration" );
                    if(text_decoration)
                    {
                        if(-1 != text_decoration.indexOf("underline"))
                            underline = true;
						else if(-1 != text_decoration.indexOf("none") && node.parentElement && node.parentElement.nodeName.toLowerCase() == "a")
							underline = false;	
							
                        if(-1 != text_decoration.indexOf("line-through"))
                            Strikeout = true;
                    }
                }
                if(null == background_color)
                {
                    background_color = tempComputedStyle.getPropertyValue( "background-color" );
                    if(background_color)
                        background_color = this._ParseColor(background_color);
                    else
                        background_color = null;
                }
                if(null == vertical_align || "baseline" == vertical_align)
                {
                    vertical_align = tempComputedStyle.getPropertyValue( "vertical-align" );
                    if(!vertical_align)
                        vertical_align = null;
                }
                if(vertical_align && background_color && Strikeout && underline)
                    break;
                oTempNode = oTempNode.parentNode;
                if(this.oRootNode == oTempNode || "body" == oTempNode.nodeName.toLowerCase()  || true == this._IsBlockElem(oTempNode.nodeName.toLowerCase()))
                    break;
            }
            if(PasteElementsId.g_bIsDocumentCopyPaste)
            {
                if(background_color)
                    rPr.HighLight = background_color;
            }
            else
                delete rPr.HighLight;
            if(null != underline)
                rPr.Underline = underline;
            if(null != Strikeout)
                rPr.Strikeout = Strikeout;
            switch(vertical_align)
            {
                case "sub": rPr.VertAlign = AscCommon.vertalign_SubScript;break;
                case "super": rPr.VertAlign = AscCommon.vertalign_SuperScript;break;
            }
        }
        return rPr;
    },
    _parseCss : function(sStyles, pPr)
    {
        var aStyles = sStyles.split(';');
        if(aStyles)
        {
            for(var i = 0, length = aStyles.length; i < length; i++)
            {
                var style = aStyles[i];
                var aPair = style.split(':');
                if(aPair && aPair.length > 1)
                {
                    var prop_name = trimString(aPair[0]);
                    var prop_value = trimString(aPair[1]);
                    if(null != this.MsoStyles[prop_name])
                        pPr[prop_name] = prop_value;
                }
            }
        }
    },
    _PrepareContent : function()
    {
        //�� �������� ����� ������� ������������ �� �������, ����� ������ �������� �������� �����
        if(this.aContent.length > 0)
        {
            var last = this.aContent[this.aContent.length - 1];
            if(type_Table == last.GetType())
            {
                this._Add_NewParagraph();
            }
        }
    },
    _AddNextPrevToContent : function(oDoc)
    {
        var prev = null;
        for(var i = 0, length = this.aContent.length; i < length; ++i)
        {
            var cur = this.aContent[i];
            cur.Set_DocumentPrev( prev );
            cur.Parent = oDoc;
            if(prev)
                prev.Set_DocumentNext( cur );
            prev = cur;
        }
    },
    _Set_Run_Pr: function (oPr) {
        this._CommitRunToParagraph(false);
        if (null != this.oCurRun) {
            this.oCurRun.Set_Pr(oPr);
        }
    },
    _CommitRunToParagraph: function (bCreateNew) {
        if (bCreateNew || this.oCurRun.Content.length > 0) {
            this.oCurRun = new ParaRun(this.oCurPar);
            this.oCurRunContentPos = 0;
        }
    },
    _CommitElemToParagraph: function (elem) {
        if (null != this.oCurHyperlink) {
            this.oCurHyperlink.Add_ToContent(this.oCurHyperlinkContentPos, elem, false);
            this.oCurHyperlinkContentPos++;
        }
        else {
            this.oCurPar.Internal_Content_Add(this.oCurParContentPos, elem, false);
            this.oCurParContentPos++;
        }
    },
    _Paragraph_Add: function (elem)
    {
        if (null != this.oCurRun) {
            if (para_Hyperlink == elem.Type) {
                this._CommitRunToParagraph(true);
                this._CommitElemToParagraph(elem);
            }
            else {
                this.oCurRun.Add_ToContent(this.oCurRunContentPos, elem, false);
                this.oCurRunContentPos++;
                if (1 == this.oCurRun.Content.length)
                    this._CommitElemToParagraph(this.oCurRun);
            }
		}
    },
    _Add_NewParagraph : function()
    {
        var bFromPresentation = false;
		if(this.pasteInPresentationShape)
			bFromPresentation = true;
			
		this.oCurPar = new Paragraph(this.oDocument.DrawingDocument, this.oDocument, 0, 50, 50, X_Right_Field, Y_Bottom_Field, this.oDocument.bPresentation === true );
        this.oCurParContentPos = this.oCurPar.CurPos.ContentPos;
        this.oCurRun = new ParaRun(this.oCurPar);
        this.oCurRunContentPos = 0;
        this.aContent.push(this.oCurPar);
        //���������� ��������� �����
        this.oCur_rPr = new CTextPr();
    },
    _Execute_AddParagraph : function(node, pPr)
    {
        this._Add_NewParagraph();
        //������������� ����� ���������
        this._set_pPr(node, this.oCurPar, pPr);
    },
    _Decide_AddParagraph : function(node, pPr, bParagraphAdded, bCommitBr)
    {
        //���������� ������ ���������(��� ��������, ��� MS), ��������� �������� ������ ����� ������ �����
        if(true == bParagraphAdded)
        {
            if(false != bCommitBr)
                this._Commit_Br(2, node, pPr);//word ���������� 2 ��������� br
            this._Execute_AddParagraph(node, pPr);
        }
        else if(false != bCommitBr)
            this._Commit_Br(0, node, pPr);
        return false;
    },
    _Commit_Br : function(nIgnore, node, pPr)
    {
        for(var i = 0, length = this.nBrCount - nIgnore; i < length; i++)
        {
            if ("always" == pPr["mso-column-break-before"])
                this._Paragraph_Add(new ParaNewLine(break_Page));
            else{
                if (this.bInBlock)
                    this._Paragraph_Add(new ParaNewLine(break_Line));
                else
                    this._Execute_AddParagraph(node, pPr);
            }
        }
        this.nBrCount = 0;
    },
    _StartExecuteTable : function(node, pPr)
    {
        var oDocument = this.oDocument;
        var tableNode = node;
		var newNode;
        //���� ���� ���� tbody
        for(var i = 0, length = node.childNodes.length; i < length; ++i)
        {
            if("tbody" == node.childNodes[i].nodeName.toLowerCase())
            {
                if(!newNode)
					newNode = node.childNodes[i];
				else
				{
					var lengthChild = node.childNodes[i].childNodes.length;
					for(var j = 0; j < lengthChild; j++)
					{
						newNode.appendChild(node.childNodes[i].childNodes[0]);
					}
				}

            }
        }
		if(newNode)
		{
			node = newNode;
			tableNode = newNode;
		}
		
        //��������� �����. � ������� �� ����� ���� ����� ��������� �� ����������� ���������� �����.
        var nRowCount = 0;
        var nMinColCount = 0;
        var nMaxColCount = 0;
        var aColsCountByRow = [];
        var oRowSums = {};
        oRowSums[0] = 0;
        var dMaxSum = 0;
        var nCurColWidth = 0;
        var nCurSum = 0;
		var nAllSum = 0;
        var oRowSpans = {};
		var columnSize = ((!window["Asc"] || (window["Asc"] && window["Asc"]["editor"] === undefined))) && this.oLogicDocument ? this.oLogicDocument.GetColumnSize() : null;
        var fParseSpans = function()
        {
            var spans = oRowSpans[nCurColWidth];
            while(null != spans && spans.row > 0)
            {
                spans.row--;
                nCurColWidth += spans.col;
                nCurSum += spans.width;
                spans = oRowSpans[nCurColWidth];
            }
        };
        for(var i = 0, length = node.childNodes.length; i < length; ++i)
        {
            var tr = node.childNodes[i];
            if("tr" == tr.nodeName.toLowerCase())
            {
                nCurSum = 0;
                nCurColWidth = 0;
                var nMinRowSpanCount = null;//����������� rowspan ����� ������
                for(var j = 0, length2 = tr.childNodes.length; j < length2; ++j)
                {
                    var tc = tr.childNodes[j];
                    var tcName = tc.nodeName.toLowerCase();
                    if("td" == tcName || "th" == tcName)
                    {
                        fParseSpans();

                        var dWidth = null;
                        var computedStyle = this._getComputedStyle(tc);
                        if ( computedStyle )
                        {
                            var computedWidth = computedStyle.getPropertyValue( "width" );
                            if(null != computedWidth && null != (computedWidth = this._ValueToMm(computedWidth)))
                                dWidth = computedWidth;
                        }
                        if(null == dWidth)
                            dWidth = tc.clientWidth * g_dKoef_pix_to_mm;

                        var nColSpan = tc.getAttribute("colspan");
                        if(null != nColSpan)
                            nColSpan = nColSpan - 0;
                        else
                            nColSpan = 1;
                        var nCurRowSpan = tc.getAttribute("rowspan");
                        if(null != nCurRowSpan)
                        {
                            nCurRowSpan = nCurRowSpan - 0;
                            if(null == nMinRowSpanCount)
                                nMinRowSpanCount = nCurRowSpan;
                            else if(nMinRowSpanCount > nCurRowSpan)
                                nMinRowSpanCount = nCurRowSpan;
                            if(nCurRowSpan > 1)
                                oRowSpans[nCurColWidth] = {row: nCurRowSpan - 1, col: nColSpan, width: dWidth};
                        }
                        else
                            nMinRowSpanCount = 0;

                        nCurSum += dWidth;
                        if(null == oRowSums[nCurColWidth + nColSpan])
                            oRowSums[nCurColWidth + nColSpan] = nCurSum;
                        nCurColWidth += nColSpan;
                    }
                }
				nAllSum += nCurSum;
                fParseSpans();
                //������� ������ rowspan
                if(nMinRowSpanCount > 1)
                {
                    for(var j = 0, length2 = tr.childNodes.length; j < length2; ++j)
                    {
                        var tc = tr.childNodes[j];
                        var tcName = tc.nodeName.toLowerCase();
                        if("td" == tcName || "th" == tcName)
                        {
                            var nCurRowSpan = tc.getAttribute("rowspan");
                            if(null != nCurRowSpan)
                                tc.setAttribute("rowspan", nCurRowSpan - nMinRowSpanCount);
                        }
                    }
                }
                if(dMaxSum < nCurSum)
                    dMaxSum = nCurSum;
                //������� ������ tr
                if(0 == nCurColWidth)
				{
                    node.removeChild(tr);
					length--;
					i--;
				}
                else
                {
                    if(0 == nMinColCount || nMinColCount > nCurColWidth)
                        nMinColCount = nCurColWidth;
                    if(nMaxColCount < nCurColWidth)
                        nMaxColCount = nCurColWidth;
                    nRowCount++;
                    aColsCountByRow.push(nCurColWidth);
                }
            }
        }
        if(nMaxColCount != nMinColCount)
        {
            for(var i = 0, length = aColsCountByRow.length; i < length; ++i)
                aColsCountByRow[i] = nMaxColCount - aColsCountByRow[i];
        }
        if(nRowCount > 0 && nMaxColCount > 0)
        {
            var bUseScaleKoef = this.bUseScaleKoef;
            var dScaleKoef = this.dScaleKoef;
            if(dMaxSum * dScaleKoef > this.dMaxWidth)
            {
                dScaleKoef = dScaleKoef * this.dMaxWidth / dMaxSum;
                bUseScaleKoef = true;
            }
            //������ Grid
            var aGrid = [];
            var nPrevIndex = null;
            var nPrevVal = 0;
            for(var i in oRowSums)
            {
                var nCurIndex = i - 0;
                var nCurVal = oRowSums[i];
                var nCurWidth = nCurVal - nPrevVal;
                if(bUseScaleKoef)
                    nCurWidth *= dScaleKoef;
                if(null != nPrevIndex)
                {
                    var nDif = nCurIndex - nPrevIndex;
                    if(1 == nDif)
					{
						if(!nCurWidth && !nAllSum && columnSize)
						{
							aGrid.push(columnSize.W / nMaxColCount);
						}
						else
						{
							aGrid.push(nCurWidth);
						}
					} 
                    else
                    {
                        var nPartVal = nCurWidth / nDif;
                        for(var i = 0; i < nDif; ++i)
                            aGrid.push(nPartVal);
                    }
                }
                nPrevVal = nCurVal;
                nPrevIndex = nCurIndex;
            }
			var CurPage = 0;
            var table = new CTable(oDocument.DrawingDocument, oDocument, true, 0, 0, 0, X_Right_Field, Y_Bottom_Field, 0, 0, aGrid);
			//считаем aSumGrid
			var aSumGrid = [];
			aSumGrid[-1] = 0;
			var nSum = 0;
			for(var i = 0, length = aGrid.length; i < length; ++i)
			{
				nSum += aGrid[i];
				aSumGrid[i] = nSum;
			}
            //�������� content
            this._ExecuteTable(tableNode, node, table, aSumGrid, nMaxColCount != nMinColCount ? aColsCountByRow : null, pPr, bUseScaleKoef, dScaleKoef);
            table.Cursor_MoveToStartPos();
            this.aContent.push(table);
        }
    },
    _ExecuteBorder : function(computedStyle, node, type, type2, bAddIfNull, setUnifill)
    {
        var res = null;
        var style = computedStyle.getPropertyValue( "border-"+type+"-style" );
        if(null != style)
        {
            res = new CDocumentBorder();
            if("none" == style)
                res.Value = border_None;
            else
            {
                res.Value = border_Single;
                var width = node.style["border"+type2+"Width"];
                if(!width)
                    computedStyle.getPropertyValue( "border-"+type+"-width" );
                if(null != width && null != (width = this._ValueToMm(width)))
                    res.Size = width;
                var color = computedStyle.getPropertyValue( "border-"+type+"-color" );
                if(null != color && (color = this._ParseColor(color)))
                {
                    if(setUnifill && color)
                    {
                        res.Unifill = AscFormat.CreteSolidFillRGB(color.r, color.g, color.b);
                    }
                    else
                    {
                        res.Color = color;
                    }
                }
            }
        }
        if(bAddIfNull && null == res)
            res = new CDocumentBorder();
        return res;
    },
    _ExecuteParagraphBorder : function(border)
    {
        var res = this.oBorderCache[border];
        if(null != res)
            return res.Copy();
        else
        {
            //������� ����� dom ����� �� ������ ������� ������� ������� ������
            //todo ������� ��� dom, ���������� �����.
            res = new CDocumentBorder();;
            var oTestDiv = document.createElement("div");
            oTestDiv.setAttribute("style", "border-left:"+border);
            document.body.appendChild( oTestDiv );
            var computedStyle = this._getComputedStyle(oTestDiv);
            if(null != computedStyle)
            {
                res = this._ExecuteBorder(computedStyle, oTestDiv, "left", "Left", true);
            }
            document.body.removeChild( oTestDiv );
            this.oBorderCache[border] = res;
            return res;
        }
    },
    _ExecuteTable : function(tableNode, node, table, aSumGrid, aColsCountByRow, pPr, bUseScaleKoef, dScaleKoef)
    {
		//из-за проблем со вставкой больших таблиц, не вставляем tbllayout_AutoFit
		table.Set_TableLayout(tbllayout_Fixed);
        //Pr
        var Pr = table.Pr;
        //align ������� � parent tableNode
		var sTableAlign = null;
		if(null != tableNode.align)
			sTableAlign = tableNode.align
        else if(null != tableNode.parentNode && this.oRootNode != tableNode.parentNode)
        {
            var computedStyleParent = this._getComputedStyle(tableNode.parentNode);
            if(null != computedStyleParent)
            {
                //����� ��������� -webkit-right
                sTableAlign = computedStyleParent.getPropertyValue( "text-align" );
            }
        }
		if(null != sTableAlign)
		{
			if(-1 != sTableAlign.indexOf('center'))
				table.Set_TableAlign(align_Center);
			else if(-1 != sTableAlign.indexOf('right'))
				table.Set_TableAlign(align_Right);
		}
        var spacing = null;
        table.Set_TableBorder_InsideH(new CDocumentBorder());
        table.Set_TableBorder_InsideV(new CDocumentBorder());

        var style = tableNode.getAttribute("style");
        if(style)
        {
            var tblPrMso = {};
            this._parseCss(style, tblPrMso);
            var spacing = tblPrMso["mso-cellspacing"];
            if(null != spacing && null != (spacing = this._ValueToMm(spacing)))
                ;
            var padding = tblPrMso["mso-padding-alt"];
            if(null != padding)
            {
                padding = trimString(padding);
                var aMargins = padding.split(" ");
                if(4 == aMargins.length)
                {
                    var top = aMargins[0];
                    if(null != top && null != (top = this._ValueToMm(top)))
                        ;
                    else
                        top = Pr.TableCellMar.Top.W;
                    var right = aMargins[1];
                    if(null != right && null != (right = this._ValueToMm(right)))
                        ;
                    else
                        right = Pr.TableCellMar.Right.W;
                    var bottom = aMargins[2];
                    if(null != bottom && null != (bottom = this._ValueToMm(bottom)))
                        ;
                    else
                        bottom = Pr.TableCellMar.Bottom.W;
                    var left = aMargins[3];
                    if(null != left && null != (left = this._ValueToMm(left)))
                        ;
                    else
                        left = Pr.TableCellMar.Left.W;
                    table.Set_TableCellMar(left, top, right, bottom);
                }
            }
            var insideh = tblPrMso["mso-border-insideh"];
            if(null != insideh)
                table.Set_TableBorder_InsideH(this._ExecuteParagraphBorder(insideh));
            var insidev = tblPrMso["mso-border-insidev"];
            if(null != insidev)
                table.Set_TableBorder_InsideV(this._ExecuteParagraphBorder(insidev));
        }
		var computedStyle = this._getComputedStyle(tableNode);
        if(computedStyle)
        {
			if(align_Left == table.Get_TableAlign())
			{
				var margin_left = computedStyle.getPropertyValue( "margin-left" );
				//todo возможно надо еще учесть ширину таблицы
				if(margin_left && null != (margin_left = this._ValueToMm(margin_left)) && margin_left < Page_Width - X_Left_Margin)
					table.Set_TableInd(margin_left);
			}
            var background_color = computedStyle.getPropertyValue( "background-color" );
            if(null != background_color && (background_color = this._ParseColor(background_color)))
                table.Set_TableShd(c_oAscShdClear, background_color.r, background_color.g, background_color.b);
            var oLeftBorder = this._ExecuteBorder(computedStyle, tableNode, "left", "Left", false);
            if(null != oLeftBorder)
                table.Set_TableBorder_Left(oLeftBorder);
            var oTopBorder = this._ExecuteBorder(computedStyle, tableNode, "top", "Top", false);
            if(null != oTopBorder)
                table.Set_TableBorder_Top(oTopBorder);
            var oRightBorder = this._ExecuteBorder(computedStyle, tableNode, "right", "Right", false);
            if(null != oRightBorder)
                table.Set_TableBorder_Right(oRightBorder);
            var oBottomBorder = this._ExecuteBorder(computedStyle, tableNode, "bottom", "Bottom", false);
            if(null != oBottomBorder)
                table.Set_TableBorder_Bottom(oBottomBorder);

            if(null == spacing)
            {
                spacing = computedStyle.getPropertyValue( "padding" );
                if(!spacing)
                    spacing = tableNode.style.padding;
                if(!spacing)
                    spacing = null;
                if(spacing && null != (spacing = this._ValueToMm(spacing)))
                    ;
            }
        }

        //content
        var oRowSpans = {};
        for(var i = 0, length = node.childNodes.length; i < length; ++i)
        {
            var tr = node.childNodes[i];
			//TODO временная правка в условии для того, чтобы избежать ошибки при копировании из excel мерженной ячейки
            if("tr" == tr.nodeName.toLowerCase() && tr.childNodes && tr.childNodes.length)
            {
				var row = table.Internal_Add_Row(table.Content.length, 0);
                this._ExecuteTableRow(tr, row, aSumGrid, spacing, oRowSpans, bUseScaleKoef, dScaleKoef);
            }
        }
    },
    _ExecuteTableRow : function(node, row, aSumGrid, spacing, oRowSpans, bUseScaleKoef, dScaleKoef)
    {
        var oThis = this;
        var table = row.Table;
		var oTableSpacingMinValue = ("undefined" != typeof tableSpacingMinValue) ? tableSpacingMinValue : 0.02;
        if(null != spacing && spacing >= oTableSpacingMinValue)
            row.Set_CellSpacing(spacing);
        if(node.style.height)
        {
            var height = node.style.height;
            if(!("auto" == height || "inherit" == height || -1 != height.indexOf("%")) && null != (height = this._ValueToMm(height)))
                row.Set_Height(height, Asc.linerule_AtLeast);
        }
		var bBefore = false;
		var bAfter = false;
        var style = node.getAttribute("style");
        if(null != style)
        {
            var tcPr = {};
            this._parseCss(style, tcPr);
            var margin_left = tcPr["mso-row-margin-left"];
            if(margin_left && null != (margin_left = this._ValueToMm(margin_left)))
                bBefore = true;
            var margin_right = tcPr["mso-row-margin-right"];
            if(margin_right && null != (margin_right = this._ValueToMm(margin_right)))
                bAfter = true;
        }

        //content
        var nCellIndex = 0;
        var nCellIndexSpan = 0;
        var fParseSpans = function()
        {
            var spans = oRowSpans[nCellIndexSpan];
            while(null != spans)
            {
				var oCurCell = row.Add_Cell(row.Get_CellsCount(), row, null, false);
				oCurCell.Set_VMerge(vmerge_Continue);
                if(spans.col > 1)
                    oCurCell.Set_GridSpan(spans.col);
                spans.row--;
				if(spans.row <= 0)
					delete oRowSpans[nCellIndexSpan];
                nCellIndexSpan += spans.col;
                spans = oRowSpans[nCellIndexSpan];
            }
        };
		var oBeforeCell = null;
		var oAfterCell = null;
		if(bBefore || bAfter)
		{
			for(var i = 0, length = node.childNodes.length; i < length; ++i)
			{
				var tc = node.childNodes[i];
				var tcName = tc.nodeName.toLowerCase();
				if("td" == tcName || "th" == tcName)
				{
					if(bBefore && null != oBeforeCell)
						oBeforeCell = tc;
					else if(bAfter)
						oAfterCell = tc;
				}
			}
		}
        for(var i = 0, length = node.childNodes.length; i < length; ++i)
        {
            //����� ����� ���� ��� ��� ����� ����������� td, ������ ��� ����������� ���������� ������ ����������� � dom
            fParseSpans();

            var tc = node.childNodes[i];
            var tcName = tc.nodeName.toLowerCase();
            if("td" == tcName || "th" == tcName)
            {
                var nColSpan = tc.getAttribute("colspan");
                if(null != nColSpan)
                    nColSpan = nColSpan - 0;
                else
                    nColSpan = 1;
				if(tc == oBeforeCell)
					row.Set_Before(nColSpan);
				else if(tc == oAfterCell)
					row.Set_After(nColSpan);
				else
				{
					var oCurCell = row.Add_Cell(row.Get_CellsCount(), row, null, false);
					if(nColSpan > 1)
						oCurCell.Set_GridSpan(nColSpan);
					var width = aSumGrid[nCellIndexSpan + nColSpan - 1] - aSumGrid[nCellIndexSpan - 1];
					oCurCell.Set_W(new CTableMeasurement(tblwidth_Mm, width));
					var nRowSpan = tc.getAttribute("rowspan");
					if(null != nRowSpan)
						nRowSpan = nRowSpan - 0;
					else
						nRowSpan = 1;
					if(nRowSpan > 1)
						oRowSpans[nCellIndexSpan] = {row: nRowSpan - 1, col: nColSpan};
					this._ExecuteTableCell(tc, oCurCell, bUseScaleKoef, dScaleKoef, spacing);
				}
                nCellIndexSpan+=nColSpan;
            }
        }
        fParseSpans();
    },
    _ExecuteTableCell : function(node, cell, bUseScaleKoef, dScaleKoef, spacing)
    {
        //Pr
        var Pr = cell.Pr;
        var bAddIfNull = false;
        if(null != spacing)
            bAddIfNull = true;
		var computedStyle = this._getComputedStyle(node);
        if(null != computedStyle)
        {
            var background_color = computedStyle.getPropertyValue( "background-color" );
            if(null != background_color && (background_color = this._ParseColor(background_color)))
            {
                var Shd = new CDocumentShd();
                Shd.Value = c_oAscShdClear;
                Shd.Color = background_color;
                cell.Set_Shd(Shd);
            }
            var border = this._ExecuteBorder(computedStyle, node, "left", "Left", bAddIfNull);
            if(null != border)
                cell.Set_Border(border, 3);
            var border = this._ExecuteBorder(computedStyle, node, "top", "Top", bAddIfNull);
            if(null != border)
                cell.Set_Border(border, 0);
            var border = this._ExecuteBorder(computedStyle, node, "right", "Right", bAddIfNull);
            if(null != border)
                cell.Set_Border(border, 1);
            var border = this._ExecuteBorder(computedStyle, node, "bottom", "Bottom", bAddIfNull);
            if(null != border)
                cell.Set_Border(border, 2);

            var top = computedStyle.getPropertyValue( "padding-top" );
            if(null != top && null != (top = this._ValueToMm(top)))
                cell.Set_Margins({ W : top, Type : tblwidth_Mm }, 0);
            var right = computedStyle.getPropertyValue( "padding-right" );
            if(null != right && null != (right = this._ValueToMm(right)))
                cell.Set_Margins({ W : right, Type : tblwidth_Mm }, 1);
            var bottom = computedStyle.getPropertyValue( "padding-bottom" );
            if(null != bottom && null != (bottom = this._ValueToMm(bottom)))
                cell.Set_Margins({ W : bottom, Type : tblwidth_Mm }, 2);
            var left = computedStyle.getPropertyValue( "padding-left" );
            if(null != left && null != (left = this._ValueToMm(left)))
                cell.Set_Margins({ W : left, Type : tblwidth_Mm }, 3);
        }

        //content
        var oPasteProcessor = new PasteProcessor(this.api, false, false, true);
        oPasteProcessor.oFonts = this.oFonts;
        oPasteProcessor.oImages = this.oImages;
        oPasteProcessor.oDocument = cell.Content;
        oPasteProcessor.bIgnoreNoBlockText = true;
        oPasteProcessor.dMaxWidth = this._CalcMaxWidthByCell(cell);
        if(true == bUseScaleKoef)
        {
            oPasteProcessor.bUseScaleKoef = bUseScaleKoef;
            oPasteProcessor.dScaleKoef = dScaleKoef;
        }
		oPasteProcessor._Execute(node, {}, true, true, false);
        oPasteProcessor._PrepareContent();
        oPasteProcessor._AddNextPrevToContent(cell.Content);
        if(0 == oPasteProcessor.aContent.length)
        {
            var oDocContent = cell.Content;
            var oNewPar = new Paragraph(oDocContent.DrawingDocument, oDocContent, 0, 50, 50, X_Right_Field, Y_Bottom_Field );
            //���������� ��������� ��������� - ����� ��� ����������� �� ������ � ������ ���� ��� ����������� ������ ������
			var oNewSpacing = new CParaSpacing();
			oNewSpacing.Set_FromObject({After: 0, Before: 0, Line: Asc.linerule_Auto});
            oNewPar.Set_Spacing(oNewSpacing);
            oPasteProcessor.aContent.push(oNewPar);
        }
        //��������� ����� ���������
        for(var i = 0, length = oPasteProcessor.aContent.length; i < length; ++i)
		{
			if(i == length - 1)
				cell.Content.Internal_Content_Add(i + 1, oPasteProcessor.aContent[i], true);
			else
				cell.Content.Internal_Content_Add(i + 1, oPasteProcessor.aContent[i], false);
		}
        //������� ��������, ������� ��������� � ������� �� ���������
        cell.Content.Internal_Content_Remove(0, 1);
    },
	_CheckIsPlainText : function(node)
	{
		var bIsPlainText = true;
		for(var i = 0, length = node.childNodes.length; i < length; i++)
		{
			var child = node.childNodes[i];
			if(Node.ELEMENT_NODE == child.nodeType)
			{
				var sClass = child.getAttribute("class");
				var sStyle = child.getAttribute("style");
				var sHref = child.getAttribute("href");
				
				if(sClass || sStyle || sHref)
				{
					bIsPlainText = false;
					break;
				}
				else if(!this._CheckIsPlainText(child))
				{
					bIsPlainText = false;
					break;
				}
					
			}
		}
		return bIsPlainText;
	},
    _Execute : function(node, pPr, bRoot, bAddParagraph, bInBlock)
    {
        //bAddParagraph ���� �������� �� ������� _Decide_AddParagraph, ��������� �������� ��� ���.
        //bAddParagraph ������������ � true, ����� ���������� ������� ������� � �� ��������� �������� ��������
        var oDocument = this.oDocument;
        var bRootHasBlock = false;//���� root ���� ������� �������, �� ���� ��� child ������� �����������
        //��� Root node �� ������� ����� � �� ��������� �����
        if(true == bRoot)
        {
            //���� ������� ��������� ���, �� �������� ����
            var bExist = false;
            for(var i = 0, length = node.childNodes.length; i < length; i++)
            {
                var child = node.childNodes[i];
                var bIsBlockChild = this._IsBlockElem(child.nodeName.toLowerCase());
                if(true == bIsBlockChild)
                {
                    bRootHasBlock = true;
                    bExist = true;
                    break;
                }
            }
            if(false == bExist && true == this.bIgnoreNoBlockText)
                this.bIgnoreNoBlockText = false;
        }
        else
        {
            if(Node.TEXT_NODE == node.nodeType)
            {
                if(false == this.bIgnoreNoBlockText || true == bInBlock)
                {
                    var value = node.nodeValue;
                    if(!value)
                        value = "";
                    //������� � ����� �������� \r|\t|\n, � �������� ������ �������� �� �� �������
                    //������ ���(�������� ������ chrome ��� ������� ��������� ������ � ������� \n)
                    value = value.replace(/^(\r|\t|\n)+|(\r|\t|\n)+$/g, '') ;
                    value = value.replace(/(\r|\t|\n)/g, ' ');
                    if(value.length > 0)
                    {
                        var oTargetNode = node.parentNode;
                        var bUseOnlyInherit = false;
                        if (this._IsBlockElem(oTargetNode.nodeName.toLowerCase()))
                            bUseOnlyInherit = true;
                        bAddParagraph = this._Decide_AddParagraph(oTargetNode, pPr, bAddParagraph);

                        //��������� ������� ����� ���� �� ���������
                        this._commit_rPr(oTargetNode, bUseOnlyInherit);
                        for(var i = 0, length = value.length; i < length; i++)
                        {
                            var nUnicode = null;
                            var nCharCode = value.charCodeAt(i);
                            if (AscCommon.isLeadingSurrogateChar(nCharCode)) {
                                if (i + 1 < length) {
                                    i++;
                                    var nTrailingChar = value.charCodeAt(i);
                                    nUnicode = AscCommon.decodeSurrogateChar(nCharCode, nTrailingChar);
                                }
                            }
                            else
                                nUnicode = nCharCode;
                            if (null != nUnicode) {
                                var Item;
                                if (0x20 != nUnicode && 0xA0 != nUnicode && 0x2009 != nUnicode) {
                                    Item = new ParaText();
                                    Item.Set_CharCode(nUnicode);
                                }
                                else
                                    Item = new ParaSpace();
                                this._Paragraph_Add(Item);
                            }
                        }
                    }
                }
                return bAddParagraph;
            }
            var sNodeName = node.nodeName.toLowerCase();
            if("table" == sNodeName && this.pasteInExcel !== true && this.pasteInPresentationShape !== true)
            {
                if(PasteElementsId.g_bIsDocumentCopyPaste)
                {
                    this._StartExecuteTable(node, pPr);
                    return bAddParagraph;
                }
                else
                    return false;
            }

            //�������� �� html �������� ���������(�� ��� ������ �������� �� getComputedStyle)
            var style = node.getAttribute("style");
            if(style)
                this._parseCss(style, pPr);

            if("h1" == sNodeName)
                pPr.hLevel = 0;
            else if("h2" == sNodeName)
                pPr.hLevel = 1;
            else if("h3" == sNodeName)
                pPr.hLevel = 2;
            else if("h4" == sNodeName)
                pPr.hLevel = 3;
            else if("h5" == sNodeName)
                pPr.hLevel = 4;
            else if("h6" == sNodeName)
                pPr.hLevel = 5;

            if("ul" == sNodeName || "ol" == sNodeName || "li" == sNodeName)
            {
                pPr.bNum = true;
                if(PasteElementsId.g_bIsDocumentCopyPaste)
                {
                    if("ul" == sNodeName)
                        pPr.numType = numbering_numfmt_Bullet;
                    else if("ol" == sNodeName)
                        pPr.numType = numbering_numfmt_Decimal;
                }
                else
                {
                    if("ul" == sNodeName)
                        pPr.numType = numbering_presentationnumfrmt_Char;
                    else if("ol" == sNodeName)
                        pPr.numType = numbering_presentationnumfrmt_ArabicPeriod;
                }
            }

            if("img" == sNodeName && this.pasteInExcel !== true)
            {
                if(PasteElementsId.g_bIsDocumentCopyPaste)
                {
                    bAddParagraph = this._Decide_AddParagraph(node, pPr, bAddParagraph);
                    
                    var nWidth = parseInt(node.getAttribute("width"));
                    var nHeight = parseInt(node.getAttribute("height"));
                    if(!nWidth || !nHeight)
                    {
						var computedStyle = this._getComputedStyle(node);
                        if ( computedStyle )
                        {
                            nWidth = parseInt(computedStyle.getPropertyValue("width"));
                            nHeight = parseInt(computedStyle.getPropertyValue("height"));
                        }
                    }
					
					//TODO пересмотреть! node.getAttribute("width") в FF возврашает "auto" -> изображения в FF не всталяются
					if((!nWidth || !nHeight))
					{
						if(AscBrowser.isMozilla)
						{
							nWidth = parseInt(node.width);
							nHeight = parseInt(node.height);
						}
						else if(AscBrowser.isChrome)
						{
							if(nWidth && !nHeight)
							{
								nHeight = nWidth;
							}
							else if(!nWidth && nHeight)
							{
								nWidth = nHeight;
							}
						}
					}
					
                    var sSrc = node.getAttribute("src");
                    if((!window["Asc"] || (window["Asc"] && window["Asc"]["editor"] === undefined)) && (isNaN(nWidth) || isNaN(nHeight) || !(typeof nWidth === "number") || !(typeof nHeight === "number")//первое условие - мы не в редакторе таблиц, тогда выполняем
                        ||  nWidth === 0 ||  nHeight === 0))
                    {
                        var img_prop = new Asc.asc_CImgProperty();
                        img_prop.asc_putImageUrl(sSrc);
                        var or_sz = img_prop.asc_getOriginSize(editor);
                        nWidth = or_sz.Width / g_dKoef_pix_to_mm;
                        nHeight = or_sz.Height / g_dKoef_pix_to_mm;
                    }
					
					if(!nWidth)
					{
						nWidth = this.defaultImgWidth / g_dKoef_pix_to_mm;
					}
					if(!nHeight)
					{
						nHeight = this.defaultImgHeight / g_dKoef_pix_to_mm;
					}
					
                    if(nWidth && nHeight && sSrc)
                    {
                        var sSrc = this.oImages[sSrc];
                        if(sSrc)
                        {
                            nWidth = nWidth * g_dKoef_pix_to_mm;
                            nHeight = nHeight * g_dKoef_pix_to_mm;
                            //��������� � this.dMaxWidth
                            var bUseScaleKoef = this.bUseScaleKoef;
                            var dScaleKoef = this.dScaleKoef;
                            if(nWidth * dScaleKoef > this.dMaxWidth)
                            {
                                dScaleKoef = dScaleKoef * this.dMaxWidth / nWidth;
                                bUseScaleKoef = true;
                            }
                            //закомментировал, потому что при вставке получаем изображения измененного размера
							/*if(bUseScaleKoef)
                            {
                                var dTemp = nWidth;
                                nWidth *= dScaleKoef;
                                nHeight *= dScaleKoef;
                            }*/
                            var oTargetDocument = this.oDocument;
                            var oDrawingDocument = this.oDocument.DrawingDocument;
                            if(oTargetDocument && oDrawingDocument)
                            {
								//если добавляем изображение в гиперссылку, то кладём его в отдельный ран и делаем не подчёркнутым
								if(this.oCurHyperlink)
								{
									this._CommitElemToParagraph(this.oCurRun);
									this.oCurRun = new ParaRun(this.oCurPar);
									this.oCurRun.Pr.Underline = false;
								}
										
								var Drawing = CreateImageFromBinary(sSrc, nWidth, nHeight);
								// oTargetDocument.DrawingObjects.Add( Drawing );

                                this._Paragraph_Add( Drawing );
								
								if(this.oCurHyperlink)
									this.oCurRun = new ParaRun(this.oCurPar);

                                    //oDocument.Add_InlineImage(nWidth, nHeight, img);
                            }
                        }
                    }

                    return bAddParagraph;
                }
                else
                    return false;
            }

            //��������� linebreak, ���� �� �� ��������� ������� �������� � �� ����� ��� ������� �������
            var bPageBreakBefore = "always" == node.style.pageBreakBefore || "left" == node.style.pageBreakBefore || "right" == node.style.pageBreakBefore;
            if ("br" == sNodeName || bPageBreakBefore)
            {
                if (bPageBreakBefore)
                {
                    bAddParagraph = this._Decide_AddParagraph(node.parentNode, pPr, bAddParagraph);
                    bAddParagraph = true;
                    this._Commit_Br(0, node, pPr);
                    this._Paragraph_Add( new ParaNewLine( break_Page ) );
                }
                else
                {
                    bAddParagraph = this._Decide_AddParagraph(node.parentNode, pPr, bAddParagraph, false);
                    this.nBrCount++;//this._Paragraph_Add( new ParaNewLine( break_Line ) );
                    if("line-break" == pPr["mso-special-character"] || "always" == pPr["mso-column-break-before"])
                        this._Commit_Br(0, node, pPr);
					return bAddParagraph;
                }
            }

            //�������� �� tab
            if("span" == sNodeName)
            {
                var nTabCount = parseInt(pPr["mso-tab-count"] || 0);
                if(nTabCount > 0)
                {
                    bAddParagraph = this._Decide_AddParagraph(node, pPr, bAddParagraph);
                    this._commit_rPr(node);
                    for(var i = 0; i < nTabCount; i++)
                        this._Paragraph_Add( new ParaTab() );
                    return bAddParagraph;
                }
            }
        }
        //���������� �������� ��� childNodes
        for(var i = 0, length = node.childNodes.length; i < length; i++)
        {
            var child = node.childNodes[i];
            var nodeType = child.nodeType;
            //��� ����������� �� word ����� ����������� ����������� �� �������
            //����������� ����������, ������ ������ ������
            if(Node.COMMENT_NODE == nodeType)
            {
                var value = child.nodeValue;
                var bSkip = false;
                if(value)
                {
                    if(-1 != value.indexOf("supportLists"))
                    {
                        //todo ���������� ��� ������
                        pPr.bNum = true;
                        bSkip = true;
                    }
                    if(-1 != value.indexOf("supportLineBreakNewLine"))
                        bSkip = true;
                }
                if(true == bSkip)
                {
                    //���������� ��� �� �������������� �����������
                    var j = i + 1;
                    for(; j < length; j++)
                    {
                        var tempNode = node.childNodes[j];
                        var tempNodeType = tempNode.nodeType;
                        if(Node.COMMENT_NODE == tempNodeType)
                        {
                            var tempvalue = tempNode.nodeValue;
                            if(tempvalue && -1 != tempvalue.indexOf("endif"))
                                break;
                        }
                    }
                    i = j;
                    continue;
                }
            }

			var sChildNodeName = child.nodeName.toLowerCase();
            if(!(Node.ELEMENT_NODE == nodeType || Node.TEXT_NODE == nodeType) || sChildNodeName === "style" || sChildNodeName === "#comment" || sChildNodeName === "script")
                continue;
            //�������� ������� ��������� ������ �� \t,\n,\r
            if( Node.TEXT_NODE == child.nodeType)
            {
                var value = child.nodeValue;
                if(!value)
                    continue;
                value = value.replace(/(\r|\t|\n)/g, '');
                if("" == value)
                    continue;
            }
            var bIsBlockChild = this._IsBlockElem(sChildNodeName);
            if(bRoot)
                this.bInBlock = false;
            if(bIsBlockChild)
            {
                bAddParagraph = true;
                this.bInBlock = true;
            }
            var oOldHyperlink = null;
            var oOldHyperlinkContentPos = null;
            var oHyperlink = null;
            if("a" == sChildNodeName)
            {
                var href = child.href;
                if(null != href)
                {
                    var sDecoded;
                    //decodeURI ����� �������� malformed exception, ������ ��� ��� ���� � utf8, � ��������� ����� ����� ���������� url � ����� ���������(�������� windows-1251)
                    try
                    {
                        sDecoded = decodeURI(href);
                    }
                    catch(e) { sDecoded = href; }
                    href = sDecoded;
					if(href && href.length > 0){
						var title = child.getAttribute("title");

						bAddParagraph = this._Decide_AddParagraph(child, pPr, bAddParagraph);
						oHyperlink = new ParaHyperlink();
						oHyperlink.Set_Paragraph(this.oCurPar);
						oHyperlink.Set_Value( href );
						if(null != title)
							oHyperlink.Set_ToolTip(title);
						oOldHyperlink = this.oCurHyperlink;
						oOldHyperlinkContentPos = this.oCurHyperlinkContentPos;
						this.oCurHyperlink = oHyperlink;
						this.oCurHyperlinkContentPos = 0;
					}
                }
            }
			
			//TODO временная правка. пересмотреть обработку тега math
			if(!child.style && Node.TEXT_NODE !== child.nodeType)
			{
				child.style = {};
			}
			
            bAddParagraph = this._Execute(child, Common_CopyObj(pPr), false, bAddParagraph, bIsBlockChild || bInBlock);
            if(bIsBlockChild)
                bAddParagraph = true;
            if ("a" == sChildNodeName && null != oHyperlink) {
                this.oCurHyperlink = oOldHyperlink;
                this.oCurHyperlinkContentPos = oOldHyperlinkContentPos;
                if(oHyperlink.Content.length > 0)
                {
                    if(this.pasteInExcel)
                    {
                        var TextPr = new CTextPr();
                        TextPr.Unifill = AscFormat.CreateUniFillSchemeColorWidthTint(11, 0);
                        TextPr.Underline = true;
                        oHyperlink.Apply_TextPr( TextPr, undefined, true );
                    }
					
					//проставляем rStyle
					if(oHyperlink.Content && oHyperlink.Content.length && oHyperlink.Paragraph.bFromDocument)
					{
						if(this.oLogicDocument && this.oLogicDocument.Styles && this.oLogicDocument.Styles.Default && this.oLogicDocument.Styles.Default.Hyperlink && this.oLogicDocument.Styles.Style)
						{
							var hyperLinkStyle = this.oLogicDocument.Styles.Default.Hyperlink;
							
							for(var k = 0; k < oHyperlink.Content.length; k++)
							{
								if(oHyperlink.Content[k].Type == para_Run)
									oHyperlink.Content[k].Set_RStyle(hyperLinkStyle);
							}
						}
					}
					
                    this._Paragraph_Add(oHyperlink);
                }
            }
        }
        if(bRoot)
        {
            this._Commit_Br(2, node, pPr);//word ���������� 2 ��������� br
        }
        return bAddParagraph;
    },

    _ExecutePresentation : function(node, pPr, bRoot, bAddParagraph, bInBlock, arrShapes, arrImages, arrTables)
    {
        //bAddParagraph ���� �������� �� ������� _Decide_AddParagraph, ��������� �������� ��� ���.
        //bAddParagraph ������������ � true, ����� ���������� ������� ������� � �� ��������� �������� ��������
        var arr_shapes = [];
        var arr_images = [];
        var arr_tables = [];
        var oDocument = this.oDocument;
        var bRootHasBlock = false;//���� root ���� ������� �������, �� ���� ��� child ������� �����������
        //��� Root node �� ������� ����� � �� ��������� �����
        var presentation = editor.WordControl.m_oLogicDocument;

        var shape = arrShapes[arrShapes.length - 1];

        this.aContent = shape.txBody.content.Content;
        if(true == bRoot)
        {
            //���� ������� ��������� ���, �� �������� ����
            var bExist = false;
            for(var i = 0, length = node.childNodes.length; i < length; i++)
            {
                var child = node.childNodes[i];
                var bIsBlockChild = this._IsBlockElem(child.nodeName.toLowerCase());
                if(true == bIsBlockChild)
                {
                    bRootHasBlock = true;
                    bExist = true;
                    break;
                }
            }
            if(false == bExist && true == this.bIgnoreNoBlockText)
                this.bIgnoreNoBlockText = false;
        }
        else
        {
            if(Node.TEXT_NODE == node.nodeType)
            {
                if(false == this.bIgnoreNoBlockText || true == bInBlock)
                {
                    var value = node.nodeValue;
                    if(!value)
                        value = "";
                    //������� � ����� �������� \r|\t|\n, � �������� ������ �������� �� �� �������
                    //������ ���(�������� ������ chrome ��� ������� ��������� ������ � ������� \n)
                    value = value.replace(/^(\r|\t|\n)+|(\r|\t|\n)+$/g, '') ;
                    value = value.replace(/(\r|\t|\n)/g, ' ');
                    if(value.length > 0)
                    {
                        this.oDocument = shape.txBody.content;
						if(bAddParagraph)
							shape.txBody.content.Add_NewParagraph();
                       // bAddParagraph = this._Decide_AddParagraph(node.parentNode, pPr, bAddParagraph);

                        //��������� ������� ����� ���� �� ���������
                        //this._commit_rPr(node.parentNode);

						if(!this.bIsPlainText)
						{
							var rPr = this._read_rPr(node.parentNode);
							var Item = new ParaTextPr( rPr);
							shape.paragraphAdd(Item);
						}
                        for(var i = 0, length = value.length; i < length; i++)
                        {
                            var nUnicode = null;
                            var nCharCode = value.charCodeAt(i);
                            if (AscCommon.isLeadingSurrogateChar(nCharCode)) {
                                if (i + 1 < length) {
                                    i++;
                                    var nTrailingChar = value.charCodeAt(i);
                                    nUnicode = AscCommon.decodeSurrogateChar(nCharCode, nTrailingChar);
                                }
                            }
                            else
                                nUnicode = nCharCode;
                            if (null != nUnicode) {
                                var Item;
                                if (0x20 != nUnicode && 0xA0 != nUnicode && 0x2009 != nUnicode) {
                                    Item = new ParaText();
                                    Item.Value = nUnicode;
                                }
                                else
                                    Item = new ParaSpace();
                                shape.paragraphAdd(Item);
                            }
                        }

                    }
                }
                return;
            }
            var sNodeName = node.nodeName.toLowerCase();
            if("table" == sNodeName)
            {
                this._StartExecuteTablePresentation(node, pPr, arrShapes, arrImages, arrTables);
                return;
            }

            //�������� �� html �������� ���������(�� ��� ������ �������� �� getComputedStyle)
            var style = node.getAttribute("style");
            if(style)
                this._parseCss(style, pPr);

            if("h1" == sNodeName)
                pPr.hLevel = 0;
            else if("h2" == sNodeName)
                pPr.hLevel = 1;
            else if("h3" == sNodeName)
                pPr.hLevel = 2;
            else if("h4" == sNodeName)
                pPr.hLevel = 3;
            else if("h5" == sNodeName)
                pPr.hLevel = 4;
            else if("h6" == sNodeName)
                pPr.hLevel = 5;

            if("ul" == sNodeName || "ol" == sNodeName || "li" == sNodeName)
            {
                pPr.bNum = true;
                if(PasteElementsId.g_bIsDocumentCopyPaste)
                {
                    if("ul" == sNodeName)
                        pPr.numType = numbering_numfmt_Bullet;
                    else if("ol" == sNodeName)
                        pPr.numType = numbering_numfmt_Decimal;
                }
                else
                {
                    if("ul" == sNodeName)
                        pPr.numType = numbering_presentationnumfrmt_Char;
                    else if("ol" == sNodeName)
                        pPr.numType = numbering_presentationnumfrmt_ArabicPeriod;
                }
            }

            if("img" == sNodeName)
            {

                //bAddParagraph = this._Decide_AddParagraph(node, pPr, bAddParagraph);

                var nWidth = parseInt(node.getAttribute("width"));
                var nHeight = parseInt(node.getAttribute("height"));
                if(!nWidth || !nHeight)
                {
					var computedStyle = this._getComputedStyle(node);
                    if ( computedStyle )
                    {
                        nWidth = parseInt(computedStyle.getPropertyValue("width"));
                        nHeight = parseInt(computedStyle.getPropertyValue("height"));
                    }
                }
                var sSrc = node.getAttribute("src");
                if(isNaN(nWidth) || isNaN(nHeight) || !(typeof nWidth === "number") || !(typeof nHeight === "number")
                    ||  nWidth === 0 ||  nHeight === 0)
                {
                    var img_prop = new Asc.asc_CImgProperty();
                    img_prop.asc_putImageUrl(sSrc);
                    var or_sz = img_prop.asc_getOriginSize(editor);
                    nWidth = or_sz.Width / g_dKoef_pix_to_mm;
                    nHeight = or_sz.Height / g_dKoef_pix_to_mm;
                }
                else
                {
                    nWidth *= g_dKoef_pix_to_mm;
                    nHeight *= g_dKoef_pix_to_mm;
                }
                if(nWidth && nHeight && sSrc)
                {
                    var sSrc = this.oImages[sSrc];
                    if(sSrc)
                    {
						var image = AscFormat.DrawingObjectsController.prototype.createImage(sSrc, 0, 0, nWidth, nHeight);	
                        arrImages.push(image);
                    }
                }
                return bAddParagraph;

            }

            //��������� linebreak, ���� �� �� ��������� ������� �������� � �� ����� ��� ������� �������
            if("br" == sNodeName || "always" == node.style.pageBreakBefore)
            {
                if("always" == node.style.pageBreakBefore)
                {
                    shape.paragraphAdd(new ParaNewLine( break_Line ));
                }
                else
                {
                    shape.paragraphAdd(new ParaNewLine( break_Line ));
                }
            }

            //�������� �� tab
            if("span" == sNodeName)
            {
                var nTabCount = parseInt(pPr["mso-tab-count"] || 0);
                if(nTabCount > 0)
                {
					if(!this.bIsPlainText)
					{
						var rPr = this._read_rPr(node);
						var Item = new ParaTextPr( rPr);
						shape.paragraphAdd(Item);
					}
                    for(var i = 0; i < nTabCount; i++)
                        shape.paragraphAdd( new ParaTab() );
                    return;
                }
            }
        }
        //���������� �������� ��� childNodes
        for(var i = 0, length = node.childNodes.length; i < length; i++)
        {
            var child = node.childNodes[i];
            var nodeType = child.nodeType;
            //��� ����������� �� word ����� ����������� ����������� �� �������
            //����������� ����������, ������ ������ ������
            if(Node.COMMENT_NODE == nodeType)
            {
                var value = child.nodeValue;
                var bSkip = false;
                if(value)
                {
                    if(-1 != value.indexOf("supportLists"))
                    {
                        //todo ���������� ��� ������
                        pPr.bNum = true;
                        bSkip = true;
                    }
                    if(-1 != value.indexOf("supportLineBreakNewLine"))
                        bSkip = true;
                }
                if(true == bSkip)
                {
                    //���������� ��� �� �������������� �����������
                    var j = i + 1;
                    for(; j < length; j++)
                    {
                        var tempNode = node.childNodes[j];
                        var tempNodeType = tempNode.nodeType;
                        if(Node.COMMENT_NODE == tempNodeType)
                        {
                            var tempvalue = tempNode.nodeValue;
                            if(tempvalue && -1 != tempvalue.indexOf("endif"))
                                break;
                        }
                    }
                    i = j;
                    continue;
                }
            }

            if(!(Node.ELEMENT_NODE == nodeType || Node.TEXT_NODE == nodeType))
                continue;
            //�������� ������� ��������� ������ �� \t,\n,\r
            if( Node.TEXT_NODE == child.nodeType)
            {
                var value = child.nodeValue;
                if(!value)
                    continue;
                value = value.replace(/(\r|\t|\n)/g, '');
                if("" == value)
                    continue;
            }
            var sChildNodeName = child.nodeName.toLowerCase();
            var bIsBlockChild = this._IsBlockElem(sChildNodeName);
            if(bRoot)
                this.bInBlock = false;
            if(bIsBlockChild)
            {
                bAddParagraph = true;
                this.bInBlock = true;
            }

            var bHyperlink = false;
			var isPasteHyperlink = null;
            if("a" == sChildNodeName)
            {
                var href = child.href;
                if(null != href)
                {
                    var sDecoded;
                    //decodeURI ����� �������� malformed exception, ������ ��� ��� ���� � utf8, � ��������� ����� ����� ���������� url � ����� ���������(�������� windows-1251)
                    try
                    {
                        sDecoded = decodeURI(href);
                    }
                    catch(e) { sDecoded = href; }
                    href = sDecoded;
                    bHyperlink = true;
                    var title = child.getAttribute("title");

                    this.oDocument = shape.txBody.content;

					var Pos = ( true == this.oDocument.Selection.Use ? this.oDocument.Selection.StartPos : this.oDocument.CurPos.ContentPos );
					isPasteHyperlink = node.getElementsByTagName('img');
					
					var text = null;
					if(isPasteHyperlink && isPasteHyperlink.length)
						isPasteHyperlink = null;
					else
					{
						text = child.innerText ? child.innerText : child.textContent;
					}
					
					if(isPasteHyperlink)
					{
						var HyperProps = new Asc.CHyperlinkProperty({ Text: text, Value: href, ToolTip: title});
						this.oDocument.Content[Pos].Hyperlink_Add( HyperProps );
					}
                }
            }
			
			if(!isPasteHyperlink)
				bAddParagraph = this._ExecutePresentation(child, Common_CopyObj(pPr), false, bAddParagraph, bIsBlockChild || bInBlock, arrShapes, arrImages, arrTables);
			
            if(bIsBlockChild)
                bAddParagraph = true;
        }
        if(bRoot)
        {
            //this._Commit_Br(2, node, pPr);//word ���������� 2 ��������� br
        }
        return bAddParagraph;
    },

    _StartExecuteTablePresentation : function(node, pPr, arrShapes, arrImages, arrTables)
    {
        var oDocument = this.oDocument;
        var tableNode = node;
        //���� ���� ���� tbody
        for(var i = 0, length = node.childNodes.length; i < length; ++i)
        {
            if("tbody" == node.childNodes[i].nodeName.toLowerCase())
            {
                node = node.childNodes[i];
                break;
            }
        }
        //��������� �����. � ������� �� ����� ���� ����� ��������� �� ����������� ���������� �����.
        var nRowCount = 0;
        var nMinColCount = 0;
        var nMaxColCount = 0;
        var aColsCountByRow = [];
        var oRowSums = {};
        oRowSums[0] = 0;
        var dMaxSum = 0;
        var nCurColWidth = 0;
        var nCurSum = 0;
        var oRowSpans = {};
        var fParseSpans = function()
        {
            var spans = oRowSpans[nCurColWidth];
            while(null != spans && spans.row > 0)
            {
                spans.row--;
                nCurColWidth += spans.col;
                nCurSum += spans.width;
                spans = oRowSpans[nCurColWidth];
            }
        };
        for(var i = 0, length = node.childNodes.length; i < length; ++i)
        {
            var tr = node.childNodes[i];
            if("tr" == tr.nodeName.toLowerCase())
            {
                nCurSum = 0;
                nCurColWidth = 0;
                var nMinRowSpanCount = null;//����������� rowspan ����� ������
                for(var j = 0, length2 = tr.childNodes.length; j < length2; ++j)
                {
                    var tc = tr.childNodes[j];
                    var tcName = tc.nodeName.toLowerCase();
                    if("td" == tcName || "th" == tcName)
                    {
                        fParseSpans();

                        var dWidth = null;
						var computedStyle = this._getComputedStyle(tc);
                        if ( computedStyle )
                        {
                            var computedWidth = computedStyle.getPropertyValue( "width" );
                            if(null != computedWidth && null != (computedWidth = this._ValueToMm(computedWidth)))
                                dWidth = computedWidth;
                        }
                        if(null == dWidth)
                            dWidth = tc.clientWidth * g_dKoef_pix_to_mm;

                        var nColSpan = tc.getAttribute("colspan");
                        if(null != nColSpan)
                            nColSpan = nColSpan - 0;
                        else
                            nColSpan = 1;
                        var nCurRowSpan = tc.getAttribute("rowspan");
                        if(null != nCurRowSpan)
                        {
                            nCurRowSpan = nCurRowSpan - 0;
                            if(null == nMinRowSpanCount)
                                nMinRowSpanCount = nCurRowSpan;
                            else if(nMinRowSpanCount > nCurRowSpan)
                                nMinRowSpanCount = nCurRowSpan;
                            if(nCurRowSpan > 1)
                                oRowSpans[nCurColWidth] = {row: nCurRowSpan - 1, col: nColSpan, width: dWidth};
                        }
                        else
                            nMinRowSpanCount = 0;

                        nCurSum += dWidth;
                        if(null == oRowSums[nCurColWidth + nColSpan])
                            oRowSums[nCurColWidth + nColSpan] = nCurSum;
                        nCurColWidth += nColSpan;
                    }
                }
                fParseSpans();
                //������� ������ rowspan
                if(nMinRowSpanCount > 1)
                {
                    for(var j = 0, length2 = tr.childNodes.length; j < length2; ++j)
                    {
                        var tc = tr.childNodes[j];
                        var tcName = tc.nodeName.toLowerCase();
                        if("td" == tcName || "th" == tcName)
                        {
                            var nCurRowSpan = tc.getAttribute("rowspan");
                            if(null != nCurRowSpan)
                                tc.setAttribute("rowspan", nCurRowSpan - nMinRowSpanCount);
                        }
                    }
                }
                if(dMaxSum < nCurSum)
                    dMaxSum = nCurSum;
                //������� ������ tr
                if(0 == nCurColWidth)
                {
                    node.removeChild(tr);
                    length--;
                    i--;
                }
                else
                {
                    if(0 == nMinColCount || nMinColCount > nCurColWidth)
                        nMinColCount = nCurColWidth;
                    if(nMaxColCount < nCurColWidth)
                        nMaxColCount = nCurColWidth;
                    nRowCount++;
                    aColsCountByRow.push(nCurColWidth);
                }
            }
        }
        if(nMaxColCount != nMinColCount)
        {
            for(var i = 0, length = aColsCountByRow.length; i < length; ++i)
                aColsCountByRow[i] = nMaxColCount - aColsCountByRow[i];
        }
        if(nRowCount > 0 && nMaxColCount > 0)
        {
            var bUseScaleKoef = this.bUseScaleKoef;
            var dScaleKoef = this.dScaleKoef;
            if(dMaxSum * dScaleKoef > this.dMaxWidth)
            {
                dScaleKoef = dScaleKoef * this.dMaxWidth / dMaxSum;
                bUseScaleKoef = true;
            }
            //������ Grid
            var aGrid = [];
            var nPrevIndex = null;
            var nPrevVal = 0;
            for(var i in oRowSums)
            {
                var nCurIndex = i - 0;
                var nCurVal = oRowSums[i];
                var nCurWidth = nCurVal - nPrevVal;
                if(bUseScaleKoef)
                    nCurWidth *= dScaleKoef;
                if(null != nPrevIndex)
                {
                    var nDif = nCurIndex - nPrevIndex;
                    if(1 == nDif)
                        aGrid.push(nCurWidth);
                    else
                    {
                        var nPartVal = nCurWidth / nDif;
                        for(var i = 0; i < nDif; ++i)
                            aGrid.push(nPartVal);
                    }
                }
                nPrevVal = nCurVal;
                nPrevIndex = nCurIndex;
            }
            var CurPage = 0;
            var presentation = editor.WordControl.m_oLogicDocument;
            var graphicFrame = new CGraphicFrame(presentation.Slides[presentation.CurPage]);

            var table = new CTable(presentation.DrawingDocument, graphicFrame, true, 0, 0, 0, X_Right_Field, Y_Bottom_Field, 0, 0, aGrid, true);
            table.Set_TableStyle(0);
            var dd = editor.WordControl.m_oDrawingDocument;
            graphicFrame.setGraphicObject(table);
            graphicFrame.setNvSpPr(new AscFormat.UniNvPr());
            arrTables.push(graphicFrame);
			
			//TODO пересмотреть!!!
            //graphicFrame.setXfrm(dd.GetMMPerDot(node["offsetLeft"]), dd.GetMMPerDot(node["offsetTop"]), dd.GetMMPerDot(node["offsetWidth"]), dd.GetMMPerDot(node["offsetHeight"]), null, null, null);

            //считаем aSumGrid
            var aSumGrid = [];
            aSumGrid[-1] = 0;
            var nSum = 0;
            for(var i = 0, length = aGrid.length; i < length; ++i)
            {
                nSum += aGrid[i];
                aSumGrid[i] = nSum;
            }
            //�������� content
             this._ExecuteTablePresentation(tableNode, node, table, aSumGrid, nMaxColCount != nMinColCount ? aColsCountByRow : null, pPr, bUseScaleKoef, dScaleKoef, arrShapes, arrImages, arrTables);
            table.Cursor_MoveToStartPos();
            return;
        }
    },

    _ExecuteTablePresentation : function(tableNode, node, table, aSumGrid, aColsCountByRow, pPr, bUseScaleKoef, dScaleKoef, arrShapes, arrImages, arrTables)
    {
        //из-за проблем со вставкой больших таблиц, не вставляем tbllayout_AutoFit
        table.Set_TableLayout(tbllayout_Fixed);
        //Pr
        var Pr = table.Pr;
        //align ������� � parent tableNode
        var sTableAlign = null;
        if(null != tableNode.align)
            sTableAlign = tableNode.align
        else if(null != tableNode.parentNode && this.oRootNode != tableNode.parentNode)
        {
			var computedStyleParent = this._getComputedStyle(tableNode.parentNode);
            if(null != computedStyleParent)
            {
                //����� ��������� -webkit-right
                sTableAlign = computedStyleParent.getPropertyValue( "text-align" );
            }
        }
        if(null != sTableAlign)
        {
            if(-1 != sTableAlign.indexOf('center'))
                table.Set_TableAlign(align_Center);
            else if(-1 != sTableAlign.indexOf('right'))
                table.Set_TableAlign(align_Right);
        }
        var spacing = null;
        table.Set_TableBorder_InsideH(new CDocumentBorder());
        table.Set_TableBorder_InsideV(new CDocumentBorder());

        var style = tableNode.getAttribute("style");
        if(style)
        {
            var tblPrMso = {};
            this._parseCss(style, tblPrMso);
            var spacing = tblPrMso["mso-cellspacing"];
            if(null != spacing && null != (spacing = this._ValueToMm(spacing)))
                ;
            var padding = tblPrMso["mso-padding-alt"];
            if(null != padding)
            {
                padding = trimString(padding);
                var aMargins = padding.split(" ");
                if(4 == aMargins.length)
                {
                    var top = aMargins[0];
                    if(null != top && null != (top = this._ValueToMm(top)))
                        ;
                    else
                        top = Pr.TableCellMar.Top.W;
                    var right = aMargins[1];
                    if(null != right && null != (right = this._ValueToMm(right)))
                        ;
                    else
                        right = Pr.TableCellMar.Right.W;
                    var bottom = aMargins[2];
                    if(null != bottom && null != (bottom = this._ValueToMm(bottom)))
                        ;
                    else
                        bottom = Pr.TableCellMar.Bottom.W;
                    var left = aMargins[3];
                    if(null != left && null != (left = this._ValueToMm(left)))
                        ;
                    else
                        left = Pr.TableCellMar.Left.W;
                    table.Set_TableCellMar(left, top, right, bottom);
                }
            }
            var insideh = tblPrMso["mso-border-insideh"];
            if(null != insideh)
                table.Set_TableBorder_InsideH(this._ExecuteParagraphBorder(insideh));
            var insidev = tblPrMso["mso-border-insidev"];
            if(null != insidev)
                table.Set_TableBorder_InsideV(this._ExecuteParagraphBorder(insidev));
        }
		var computedStyle = this._getComputedStyle(tableNode);
        if(computedStyle)
        {
            if(align_Left == table.Get_TableAlign())
            {
                var margin_left = computedStyle.getPropertyValue( "margin-left" );
                //todo возможно надо еще учесть ширину таблицы
                if(margin_left && null != (margin_left = this._ValueToMm(margin_left)) && margin_left < Page_Width - X_Left_Margin)
                    table.Set_TableInd(margin_left);
            }
            var background_color = computedStyle.getPropertyValue( "background-color" );
            if(null != background_color && (background_color = this._ParseColor(background_color)))
                table.Set_TableShd(c_oAscShdClear, background_color.r, background_color.g, background_color.b);
            var oLeftBorder = this._ExecuteBorder(computedStyle, tableNode, "left", "Left", false, true);
            if(null != oLeftBorder)
                table.Set_TableBorder_Left(oLeftBorder);
            var oTopBorder = this._ExecuteBorder(computedStyle, tableNode, "top", "Top", false, true);
            if(null != oTopBorder)
                table.Set_TableBorder_Top(oTopBorder);
            var oRightBorder = this._ExecuteBorder(computedStyle, tableNode, "right", "Right", false, true);
            if(null != oRightBorder)
                table.Set_TableBorder_Right(oRightBorder);
            var oBottomBorder = this._ExecuteBorder(computedStyle, tableNode, "bottom", "Bottom", false, true);
            if(null != oBottomBorder)
                table.Set_TableBorder_Bottom(oBottomBorder);

            if(null == spacing)
            {
                spacing = computedStyle.getPropertyValue( "padding" );
                if(!spacing)
                    spacing = tableNode.style.padding;
                if(!spacing)
                    spacing = null;
                if(spacing && null != (spacing = this._ValueToMm(spacing)))
                    ;
            }
        }

        //content
        var oRowSpans = {};
        for(var i = 0, length = node.childNodes.length; i < length; ++i)
        {
            var tr = node.childNodes[i];
            if("tr" == tr.nodeName.toLowerCase() && tr.children.length !== 0)//в случае, если внутри строки нет ни одной ячейки, не добавляем данную строку
            {
                var row = table.Internal_Add_Row(table.Content.length, 0);
                this._ExecuteTableRowPresentation(tr, row, aSumGrid, spacing, oRowSpans, bUseScaleKoef, dScaleKoef, arrShapes, arrImages, arrTables);
            }
        }
    },
    _ExecuteTableRowPresentation : function(node, row, aSumGrid, spacing, oRowSpans, bUseScaleKoef, dScaleKoef, arrShapes, arrImages, arrTables)
    {
        var oThis = this;
        var table = row.Table;
        if(null != spacing /*&& spacing >= tableSpacingMinValue*/)
            row.Set_CellSpacing(spacing);
        if(node.style.height)
        {
            var height = node.style.height;
            if(!("auto" == height || "inherit" == height || -1 != height.indexOf("%")) && null != (height = this._ValueToMm(height)))
                row.Set_Height(height, Asc.linerule_AtLeast);
        }
        var bBefore = false;
        var bAfter = false;
        var style = node.getAttribute("style");
        if(null != style)
        {
            var tcPr = {};
            this._parseCss(style, tcPr);
            var margin_left = tcPr["mso-row-margin-left"];
            if(margin_left && null != (margin_left = this._ValueToMm(margin_left)))
                bBefore = true;
            var margin_right = tcPr["mso-row-margin-right"];
            if(margin_right && null != (margin_right = this._ValueToMm(margin_right)))
                bAfter = true;
        }

        //content
        var nCellIndex = 0;
        var nCellIndexSpan = 0;
        var fParseSpans = function()
        {
            var spans = oRowSpans[nCellIndexSpan];
            while(null != spans)
            {
                var oCurCell = row.Add_Cell(row.Get_CellsCount(), row, null, false);
                oCurCell.Set_VMerge(vmerge_Continue);
                if(spans.col > 1)
                    oCurCell.Set_GridSpan(spans.col);
                spans.row--;
                if(spans.row <= 0)
                    delete oRowSpans[nCellIndexSpan];
                nCellIndexSpan += spans.col;
                spans = oRowSpans[nCellIndexSpan];
            }
        };
        var oBeforeCell = null;
        var oAfterCell = null;
        if(bBefore || bAfter)
        {
            for(var i = 0, length = node.childNodes.length; i < length; ++i)
            {
                var tc = node.childNodes[i];
                var tcName = tc.nodeName.toLowerCase();
                if("td" == tcName || "th" == tcName)
                {
                    if(bBefore && null != oBeforeCell)
                        oBeforeCell = tc;
                    else if(bAfter)
                        oAfterCell = tc;
                }
            }
        }
        for(var i = 0, length = node.childNodes.length; i < length; ++i)
        {
            //����� ����� ���� ��� ��� ����� ����������� td, ������ ��� ����������� ���������� ������ ����������� � dom
            fParseSpans();

            var tc = node.childNodes[i];
            var tcName = tc.nodeName.toLowerCase();
            if("td" == tcName || "th" == tcName)
            {
                var nColSpan = tc.getAttribute("colspan");
                if(null != nColSpan)
                    nColSpan = nColSpan - 0;
                else
                    nColSpan = 1;
                if(tc == oBeforeCell)
                    row.Set_Before(nColSpan);
                else if(tc == oAfterCell)
                    row.Set_After(nColSpan);
                else
                {
                    var oCurCell = row.Add_Cell(row.Get_CellsCount(), row, null, false);
                    if(nColSpan > 1)
                        oCurCell.Set_GridSpan(nColSpan);
                    var width = aSumGrid[nCellIndexSpan + nColSpan - 1] - aSumGrid[nCellIndexSpan - 1];
                    oCurCell.Set_W(new CTableMeasurement(tblwidth_Mm, width));
                    var nRowSpan = tc.getAttribute("rowspan");
                    if(null != nRowSpan)
                        nRowSpan = nRowSpan - 0;
                    else
                        nRowSpan = 1;
                    if(nRowSpan > 1)
                        oRowSpans[nCellIndexSpan] = {row: nRowSpan - 1, col: nColSpan};
                    this._ExecuteTableCellPresentation(tc, oCurCell, bUseScaleKoef, dScaleKoef, spacing, arrShapes, arrImages, arrTables);
                }
                nCellIndexSpan+=nColSpan;
            }
        }
        fParseSpans();
    },
    _ExecuteTableCellPresentation : function(node, cell, bUseScaleKoef, dScaleKoef, spacing, arrShapes, arrImages, arrTables)
    {
        //Pr
        var Pr = cell.Pr;
        var bAddIfNull = false;
        if(null != spacing)
            bAddIfNull = true;
		var computedStyle = this._getComputedStyle(node);
        if(null != computedStyle)
        {
            var background_color = computedStyle.getPropertyValue( "background-color" );
            if(null != background_color && (background_color = this._ParseColor(background_color)))
            {
                var Shd = new CDocumentShd();
                Shd.Value = c_oAscShdClear;
                Shd.Unifill = AscFormat.CreteSolidFillRGB(background_color.r,background_color.g, background_color.b);
                cell.Set_Shd(Shd);
            }
            var border = this._ExecuteBorder(computedStyle, node, "left", "Left", bAddIfNull, true);
            if(null != border)
                cell.Set_Border(border, 3);
            var border = this._ExecuteBorder(computedStyle, node, "top", "Top", bAddIfNull, true);
            if(null != border)
                cell.Set_Border(border, 0);
            var border = this._ExecuteBorder(computedStyle, node, "right", "Right", bAddIfNull, true);
            if(null != border)
                cell.Set_Border(border, 1);
            var border = this._ExecuteBorder(computedStyle, node, "bottom", "Bottom", bAddIfNull, true);
            if(null != border)
                cell.Set_Border(border, 2);

            var top = computedStyle.getPropertyValue( "padding-top" );
            if(null != top && null != (top = this._ValueToMm(top)))
                cell.Set_Margins({ W : top, Type : tblwidth_Mm }, 0);
            var right = computedStyle.getPropertyValue( "padding-right" );
            if(null != right && null != (right = this._ValueToMm(right)))
                cell.Set_Margins({ W : right, Type : tblwidth_Mm }, 1);
            var bottom = computedStyle.getPropertyValue( "padding-bottom" );
            if(null != bottom && null != (bottom = this._ValueToMm(bottom)))
                cell.Set_Margins({ W : bottom, Type : tblwidth_Mm }, 2);
            var left = computedStyle.getPropertyValue( "padding-left" );
            if(null != left && null != (left = this._ValueToMm(left)))
                cell.Set_Margins({ W : left, Type : tblwidth_Mm }, 3);
        }

        var arrShapes2 = [], arrImages2 = [], arrTables2 = [];
        var presentation = editor.WordControl.m_oLogicDocument;
        var shape = new CShape();
        shape.setParent(presentation.Slides[presentation.CurPage]);
        shape.setTxBody(AscFormat.CreateTextBodyFromString("", presentation.DrawingDocument, shape));
        arrShapes2.push(shape);
        this._ExecutePresentation(node, {}, true, true, false, arrShapes2, arrImages2, arrTables);
        if(arrShapes2.length > 0)
        {
            var first_shape = arrShapes2[0];
            var content = first_shape.txBody.content;

            //��������� ����� ���������
            for(var i = 0, length = content.Content.length; i < length; ++i)
			{
				if(i == length - 1)
					cell.Content.Internal_Content_Add(i + 1, content.Content[i], true);
				else
					cell.Content.Internal_Content_Add(i + 1, content.Content[i], false);
			}
            //������� ��������, ������� ��������� � ������� �� ���������
            cell.Content.Internal_Content_Remove(0, 1);
            arrShapes2.splice(0, 1);
        }
        for(var i = 0;  i< arrShapes2.length; ++i)
        {
            arrShapes.push(arrShapes2[i]);
        }
        for(var i = 0;  i< arrImages2.length; ++i)
        {
            arrImages.push(arrImages2[i]);
        }
        for(var i = 0;  i< arrTables2.length; ++i)
        {
            arrTables.push(arrTables2[i]);
        }
    },
	
	_applyStylesToTable: function(cTable, cStyle)
	{
		if(!cTable || !cStyle || (cTable && !cTable.Content))
			return;
		
		
		var row, tableCell;
		for(var i = 0; i < cTable.Content.length; i++)
		{	
			row = cTable.Content[i];
			
			for(var j = 0; j < row.Content.length; j++)
			{
				tableCell = row.Content[j];
				//пока не заливаю функцию Internal_Compile_Pr(находится в table.js + правки)
				var test = this.Internal_Compile_Pr(cTable, cStyle, tableCell);
				tableCell.Set_Pr(test.CellPr);
				
				//проверка цвета
				/*cStyle.TableFirstRow.TableCellPr.Shd.Unifill.check(cTable.Get_Theme(), cTable.Get_ColorMap());
				var RGBA = cStyle.TableFirstRow.TableCellPr.Shd.Unifill.getRGBAColor();
				var theme = cTable.Get_Theme();*/
			}
		}
	}
};
	
function CreateImageFromBinary(bin, nW, nH)
{
    var w, h;

    if (nW === undefined || nH === undefined)
    {
        var _image = editor.ImageLoader.map_image_index[bin];
        if (_image != undefined && _image.Image != null && _image.Status == AscFonts.ImageLoadStatus.Complete)
        {
            var _w = Math.max(1, Page_Width - (X_Left_Margin + X_Right_Margin));
            var _h = Math.max(1, Page_Height - (Y_Top_Margin + Y_Bottom_Margin));

            var bIsCorrect = false;
            if (_image.Image != null)
            {
                var __w = Math.max(parseInt(_image.Image.width * g_dKoef_pix_to_mm), 1);
                var __h = Math.max(parseInt(_image.Image.height * g_dKoef_pix_to_mm), 1);

                var dKoef = Math.max(__w / _w, __h / _h);
                if (dKoef > 1)
                {
                    _w = Math.max(5, __w / dKoef);
                    _h = Math.max(5, __h / dKoef);

                    bIsCorrect = true;
                }
                else
                {
                    _w = __w;
                    _h = __h;
                }
            }

            w = __w;
            h = __h;
        }
        else
        {
            w = 50;
            h = 50;
        }
    }
    else
    {
        w = nW;
        h = nH;
    }
    var para_drawing = new ParaDrawing(w, h, null, editor.WordControl.m_oLogicDocument.DrawingDocument, editor.WordControl.m_oLogicDocument, null);
    var word_image = AscFormat.DrawingObjectsController.prototype.createImage(bin, 0, 0, w, h);
    para_drawing.Set_GraphicObject(word_image);
    word_image.setParent(para_drawing);
    para_drawing.Set_GraphicObject(word_image);
    return para_drawing;
}

function Check_LoadingDataBeforePrepaste(_api, _fonts, _images, _callback)
{
    var aPrepeareFonts = [];
    for (var font_family in _fonts)
    {
        aPrepeareFonts.push(new CFont(font_family, 0, "", 0));
    };

    var aImagesToDownload = [];
    var _mapLocal = {};
    for (var image in _images)
    {
        var src = _images[image];
        if (undefined !== window["Native"] && undefined !== window["Native"]["GetImageUrl"])
        {
            _images[image] = window["Native"]["GetImageUrl"](_images[image]);
        }
        else if (0 == src.indexOf("file:"))
        {
            if (window["AscDesktopEditor"] !== undefined)
            {
                if (window["AscDesktopEditor"]["LocalFileGetImageUrl"] !== undefined)
                {
                    aImagesToDownload.push(src);
                }
                else
                {
                    var _base64 = window["AscDesktopEditor"]["GetImageBase64"](src);
                    if (_base64 != "")
                    {
                        aImagesToDownload.push(_base64);
                        _mapLocal[_base64] = src;
                    }
                    else
                    {
                        _images[image] = "local";
                    }
                }
            }
            else
                _images[image] = "local";
        }
        else if (window["AscDesktopEditor"] !== undefined)
		{
			if (!g_oDocumentUrls.getImageLocal(src))
				aImagesToDownload.push(src);
		}
        else if (!g_oDocumentUrls.getImageUrl(src) && !g_oDocumentUrls.getImageLocal(src))
            aImagesToDownload.push(src);
    }
    if (aImagesToDownload.length > 0)
    {
        AscCommon.sendImgUrls(_api, aImagesToDownload, function (data) {
            var image_map = {};
            for (var i = 0, length = Math.min(data.length, aImagesToDownload.length); i < length; ++i)
            {
                var elem = data[i];
                var sFrom = aImagesToDownload[i];
                if (null != elem.url)
                {
                    var name = g_oDocumentUrls.imagePath2Local(elem.path);
                    _images[sFrom] = name;
                    image_map[i] = name;
                }
                else
                {
                    image_map[i] = sFrom;
                }
            }
            _api.pre_Paste(aPrepeareFonts, image_map, _callback);
        });
    }
    else
        _api.pre_Paste(aPrepeareFonts, _images, _callback);
}


  //---------------------------------------------------------export---------------------------------------------------
  window['AscCommon'] = window['AscCommon'] || {};
  window["AscCommon"].Check_LoadingDataBeforePrepaste = Check_LoadingDataBeforePrepaste;
  window["AscCommon"].CDocumentReaderMode = CDocumentReaderMode;
  window["AscCommon"].GetObjectsForImageDownload = GetObjectsForImageDownload;
  window["AscCommon"].ResetNewUrls = ResetNewUrls;
  window["AscCommon"].CopyProcessor = CopyProcessor;
  window["AscCommon"].CopyPasteCorrectString = CopyPasteCorrectString;
  window["AscCommon"].Editor_Paste_Exec = Editor_Paste_Exec;
  window["AscCommon"].sendImgUrls = sendImgUrls;
  window["AscCommon"].PasteProcessor = PasteProcessor;

  window["AscCommon"].PasteElementsId = PasteElementsId;
})(window);
