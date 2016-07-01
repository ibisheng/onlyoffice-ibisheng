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

(	/**
	 * @param {jQuery} $
	 * @param {Window} window
	 * @param {undefined} undefined
	 */
	function ($, window, undefined) {

		/*
		 * Import
		 * -----------------------------------------------------------------------------
		 */
		var g_fontApplication = AscFonts.g_fontApplication;
		var c_oAscBorderStyles = AscCommon.c_oAscBorderStyles;
		var c_oAscMaxCellOrCommentLength = AscCommon.c_oAscMaxCellOrCommentLength;
		var doc = window.document;
		var copyPasteUseBinary = true;
		var CopyPasteCorrectString = AscCommon.CopyPasteCorrectString;
		

		function number2color(n) {
			if( typeof(n)=="string" && n.indexOf("rgb")>-1)
				return n;
			return "rgb(" + (n >> 16 & 0xFF) + "," + (n >> 8 & 0xFF) + "," + (n & 0xFF) + ")";
		}


		/** @constructor */
		function Clipboard() 
		{	
			this.copyProcessor = new CopyProcessorExcel();
			this.pasteProcessor = new PasteProcessorExcel();

			return this;
		}

		Clipboard.prototype = {

			constructor: Clipboard,
			
			checkCopyToClipboard: function(ws, _clipboard, _formats)
			{
				var _data;
				var activeRange = ws.getSelectedRange();
				var wb = window["Asc"]["editor"].wb;
				
				if(ws.getCellEditMode() === true)//text in cell
				{
					//only TEXT
					var fragments = wb.cellEditor.copySelection();
					_data = wb.cellEditor._getFragmentsText(fragments);
					
					_clipboard.pushData(AscCommon.c_oAscClipboardDataFormat.Text, _data)
				}
				else
				{	
					//TEXT
					if (AscCommon.c_oAscClipboardDataFormat.Text & _formats)
					{
						_data = this.copyProcessor.getText(activeRange, ws);
						
						_clipboard.pushData(AscCommon.c_oAscClipboardDataFormat.Text, _data)
					}
					//HTML
					if(AscCommon.c_oAscClipboardDataFormat.Html & _formats)
					{	
						_data = this.copyProcessor.getHtml(activeRange, ws);
						
						_clipboard.pushData(AscCommon.c_oAscClipboardDataFormat.Html, _data.html)
					}
					//INTERNAL
					if(AscCommon.c_oAscClipboardDataFormat.Internal & _formats)
					{
						if(window["NATIVE_EDITOR_ENJINE"])
						{
							_data = this.copyProcessor.getBinaryForMobile();
						}
						else
						{
							if(_data && _data.base64)
							{
								_data = _data.base64;
							}
							else
							{
								_data = this.copyProcessor.getBinaryForCopy(ws);
							}
						}

						_clipboard.pushData(AscCommon.c_oAscClipboardDataFormat.Internal, _data);
					}
				}
			},

			pasteData: function(ws, _format, data1, data2)
			{
				var t = this;
				
				switch (_format)
				{
					case AscCommon.c_oAscClipboardDataFormat.HtmlElement:
					{
						if(ws.getCellEditMode() === true)
						{
							var text = data1.innerText;
							window["Asc"]["editor"].wb.cellEditor.pasteText(text);
						}
						else
						{
							t.pasteProcessor.editorPasteExec(ws, data1);
						}

						break;
					}
					case AscCommon.c_oAscClipboardDataFormat.Internal:
					{
						t.pasteProcessor.pasteFromBinary(ws, data1);
						break;
					}
					case AscCommon.c_oAscClipboardDataFormat.Text:
					{
						if(ws.getCellEditMode() === true)
						{
							window["Asc"]["editor"].wb.cellEditor.pasteText(data1);
						}
						else
						{
							t.pasteProcessor.pasteTextOnSheet(ws, data1);
						}
						
						break;
					}
				}
			}
		};

		
		function CopyProcessorExcel()
		{
			this.Api = window["Asc"]["editor"];
		}
		
		CopyProcessorExcel.prototype = {
			
			constructor: CopyProcessorExcel,
			
			getHtml: function(range, worksheet)
			{
				var t = this;
				var sBase64 = null;
				
				var objectRender = worksheet.objectRender;
				var isIntoShape = objectRender.controller.getTargetDocContent();
				
				var text = t._generateHtml(range, worksheet, isIntoShape);
				
				if(text == false)
					return null;
				
				var container = doc.createElement("DIV");
				container.appendChild(text);
				
				//TODO возможно стоит убрать отключение истории
				History.TurnOff();
				//use binary strings
				if(copyPasteUseBinary)
				{
					sBase64 = this.getBinaryForCopy(worksheet);
					$(container.children[0]).addClass(sBase64);
				}
				History.TurnOn();
				
				return {base64: sBase64, html: container.innerHTML};
			},
			
			getBinaryForCopy: function(worksheet)
			{
				var objectRender = worksheet.objectRender;
				var isIntoShape = objectRender.controller.getTargetDocContent();
				
				var sBase64 = null;
				if(isIntoShape)
				{
					//в данному случае пишем бинарник с меткой pptData - с префиксом xlsData отдельно параграфы записать не получится
					sBase64 = this._getBinaryShapeContent(worksheet, isIntoShape);
				}
				else
				{
					pptx_content_writer.Start_UseFullUrl();
				
					//TODO стоит убрать заглушку при правке бага с activeRange
					var cloneActiveRange = worksheet.activeRange.clone();
					var temp;
					if(cloneActiveRange.c1 > cloneActiveRange.c2)
					{
						temp = cloneActiveRange.c1;
						cloneActiveRange.c1 = cloneActiveRange.c2;
						cloneActiveRange.c2 = temp;
					};
					
					if(cloneActiveRange.r1 > cloneActiveRange.r2)
					{
						temp = cloneActiveRange.r1;
						cloneActiveRange.r1 = cloneActiveRange.r2;
						cloneActiveRange.r2 = temp;
					};
					
					var oBinaryFileWriter = new AscCommonExcel.BinaryFileWriter(worksheet.model.workbook, cloneActiveRange);
					var sBase64 = "xslData;" + oBinaryFileWriter.Write();
					
					pptx_content_writer.End_UseFullUrl();
				}
				
				return sBase64;
			},
			
			_getBinaryShapeContent : function(worksheet, isIntoShape)
			{	
				var sBase64;
				
				var selectedContent = new CSelectedContent();
				isIntoShape.Get_SelectedContent(selectedContent)
				
				var oPresentationWriter = new AscCommon.CBinaryFileWriter();
				
				//начало записи
				oPresentationWriter.WriteString2("");
				oPresentationWriter.WriteDouble(1);
				oPresentationWriter.WriteDouble(1);
				
				if(selectedContent)//пишем контент
				{
					var docContent = selectedContent;
					
					if(docContent.Elements)
					{
						var elements = docContent.Elements;
						
						//пишем метку и длины
						oPresentationWriter.WriteString2("Content");
						oPresentationWriter.WriteDouble(elements.length);
						
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
								oPresentationWriter.StartRecord(0);
								oPresentationWriter.WriteParagraph(Item);
								oPresentationWriter.EndRecord();
							}
						}
						
						sBase64 = oPresentationWriter.GetBase64Memory();
					}
					
					if(null !== sBase64)
					{
						sBase64 = "pptData;" + oPresentationWriter.pos + ";" + sBase64;
					}
				}
				
				return sBase64;
			},
			
			getText: function(range, worksheet)
			{
				var t = this;
				var res = null;
				
				var objectRender = worksheet.objectRender;
				var isIntoShape = objectRender.controller.getTargetDocContent();
				
				if(isIntoShape)
				{
					res = t._getTextFromShape(isIntoShape);
				}
				else
				{
					res = t._getTextFromSheet(range, worksheet);
				}
				
				return res;
			},
			
			getBinaryForMobile: function () 
			{
				var api = window["Asc"]["editor"];
				if(!api || !api.wb)
					return false;
				
				var worksheetView = api.wb.getWorksheet();
				var activeRange = worksheetView.getSelectedRange();
				
				var objectRender = worksheetView.objectRender;
				var isIntoShape = objectRender.controller.getTargetDocContent();
			
				History.TurnOff();
				var sBase64 = null;
				if(!isIntoShape)
					sBase64 = this.getBinaryForCopy(worksheetView);
				History.TurnOn();
				
				var objectRender = worksheetView.objectRender;
				var selectedImages = objectRender.getSelectedGraphicObjects();

                var drawingUrls = [];
                if(selectedImages && selectedImages.length)
                {
                    var correctUrl, graphicObj;
                    for(var i = 0; i < selectedImages.length; i++)
                    {
                        graphicObj = selectedImages[i];
                        if(graphicObj.isImage())  {
                            if(window["NativeCorrectImageUrlOnCopy"]) {
                                correctUrl = window["NativeCorrectImageUrlOnCopy"](graphicObj.getImageUrl());
                                drawingUrls[i] = correctUrl;
                            }
                            else {
                                drawingUrls[i] = graphicObj.getBase64Img();
                            }
                        }
                    }
                }
				
				return {sBase64: sBase64, drawingUrls: drawingUrls};
			},
			
			//TODO пересмотреть функцию
			_generateHtml: function (range, worksheet, isIntoShape) 
			{
				var fn = worksheet.model.workbook.getDefaultFont();
				var fs = worksheet.model.workbook.getDefaultSize();
				var bbox = range.getBBox0();
				var merged = [];
				var t = this;
				var table, tr, td, cell, j, row, col, mbbox, h, w, b;
				var objectRender = worksheet.objectRender;
				var doc = document;

				function skipMerged() {
					var m = merged.filter(function(e){return row>=e.r1 && row<=e.r2 && col>=e.c1 && col<=e.c2});
					if (m.length > 0) {
						col = m[0].c2;
						return true;
					}
					return false;
				}

				function makeBorder(border) {
					if (!border || border.s === c_oAscBorderStyles.None)
						return "";

					var style = "";
					switch(border.s) {
						case c_oAscBorderStyles.Thin:
							style = "solid";
							break;
						case c_oAscBorderStyles.Medium:
							style = "solid";
							break;
						case c_oAscBorderStyles.Thick:
							style = "solid";
							break;
						case c_oAscBorderStyles.DashDot:
						case c_oAscBorderStyles.DashDotDot:
						case c_oAscBorderStyles.Dashed:
							style = "dashed";
							break;
						case c_oAscBorderStyles.Double:
							style = "double";
							break;
						case c_oAscBorderStyles.Hair:
						case c_oAscBorderStyles.Dotted:
							style = "dotted";
							break;
						case c_oAscBorderStyles.MediumDashDot:
						case c_oAscBorderStyles.MediumDashDotDot:
						case c_oAscBorderStyles.MediumDashed:
						case c_oAscBorderStyles.SlantDashDot:
							style = "dashed";
							break;
					}
					return border.w + "px " + style + " " + number2color(border.getRgbOrNull());
				}

				
				table = doc.createElement("TABLE");
				table.cellPadding = "0";
				table.cellSpacing = "0";
				table.style.borderCollapse = "collapse";
				table.style.fontFamily = fn;
				table.style.fontSize = fs + "pt";
				table.style.color = "#000";
				table.style.backgroundColor = "transparent";
				
				var isSelectedImages = t._getSelectedDrawingIndex(worksheet);
				var isImage = false;
				var isChart = false;
				
				//копируем изображения
				//если выделены графические объекты внутри группы
				if(isIntoShape)//если курсор находится внутри шейпа
				{
					var oCopyProcessor = new CopyShapeContent();
					var divContent = document.createElement('div');
					oCopyProcessor.CopyDocument(divContent, isIntoShape, true);
					
					var htmlInShape = "";
					if(divContent)
						htmlInShape = divContent;	
					
					return htmlInShape;
				}
				else if(isSelectedImages && isSelectedImages != -1)
				{
					if(this.Api && this.Api.isChartEditor)
						return false;
					objectRender.preCopy();
					var table = document.createElement('span');
					var drawings = worksheet.model.Drawings;

					for (j = 0; j < isSelectedImages.length; ++j) {
						var image = drawings[isSelectedImages[j]];
						var cloneImg = objectRender.cloneDrawingObject(image);
						var curImage = new Image();
						var url;

						if(cloneImg.graphicObject.isChart() && cloneImg.graphicObject.brush.fill.RasterImageId)
							url = cloneImg.graphicObject.brush.fill.RasterImageId;
						else if(cloneImg.graphicObject && (cloneImg.graphicObject.isShape() || cloneImg.graphicObject.isImage() || cloneImg.graphicObject.isGroup() || cloneImg.graphicObject.isChart()))
						{
							var altAttr = null;
							var isImage = cloneImg.graphicObject.isImage();
							var imageUrl;
							if(isImage)
								imageUrl = cloneImg.graphicObject.getImageUrl();
							if(isImage && imageUrl)
								url = AscCommon.getFullImageSrc2(imageUrl);
							else
								url = cloneImg.graphicObject.getBase64Img();
							curImage.alt = altAttr;
						}
						else
							url = cloneImg.image.src;
							
						curImage.src = url;
						curImage.width = cloneImg.getWidthFromTo();
						curImage.height = cloneImg.getHeightFromTo();
						if(image.guid)
							curImage.name = image.guid;
						
						table.appendChild(curImage);
						isImage = true;
					}
				}
				else
				{	
					for (row = bbox.r1; row <= bbox.r2; ++row) 
					{
						tr = doc.createElement("TR");
						h = worksheet.model.getRowHeight(row);
						if (h > 0) {tr.style.height = h + "pt";}

						for (col = bbox.c1; col <= bbox.c2; ++col) 
						{
							if (skipMerged()) {continue;}

							cell = worksheet.model.getCell3(row, col);
							td = doc.createElement("TD");

							mbbox = cell.hasMerged();
							if (mbbox) {
								merged.push(mbbox);
								td.colSpan = mbbox.c2 - mbbox.c1 + 1;
								td.rowSpan = mbbox.r2 - mbbox.r1 + 1;
								for (w = 0, j = mbbox.c1; j <= mbbox.c2; ++j) {w += worksheet.getColumnWidth(j, 1/*pt*/);}
								td.style.width = w + "pt";
							} else {
								td.style.width = worksheet.getColumnWidth(col, 1/*pt*/) + "pt";
							}

							if (!cell.getWrap()) {td.style.whiteSpace = "nowrap";}else {td.style.whiteSpace = "normal";} 

							if(cell.getAlignHorizontal() != 'none')
								td.style.textAlign = cell.getAlignHorizontal();
							td.style.verticalAlign = cell.getAlignVertical();
							if(cell.getAlignVertical() == 'center')
								td.style.verticalAlign = 'middle';

							b = cell.getBorderFull();
							if(mbbox)
							{
								var cellMergeFinish = worksheet.model.getCell3(mbbox.r2, mbbox.c2);
								var borderMergeCell = cellMergeFinish.getBorderFull();
								td.style.borderRight = makeBorder(borderMergeCell.r);
								td.style.borderBottom = makeBorder(borderMergeCell.b);
							}
							else
							{
								td.style.borderRight = makeBorder(b.r);
								td.style.borderBottom = makeBorder(b.b);
							}	
							td.style.borderLeft = makeBorder(b.l);
							td.style.borderTop = makeBorder(b.t);
								
							
							b = cell.getFill();
							// если b==0 мы не зайдем в if, хотя b==0 это ни что иное, как черный цвет заливки.
							if (b!=null) {td.style.backgroundColor = number2color(b.getRgb());}

							this._makeNodesFromCellValue(cell.getValue2(), fn ,fs, cell).forEach(
								function(node){
									td.appendChild(node);
							});

							tr.appendChild(td);
						}
						table.appendChild(tr);
					}
				}
				
				return table;
			},
			
			_getSelectedDrawingIndex : function(worksheet) 
			{
				if(!worksheet)
					return false;
				var images = worksheet.model.Drawings;
				var n = 0;
				var arrImages = [];
				if(images)
				{
					for (var i = 0; i < images.length; i++) {
						if ((images[i].graphicObject && images[i].graphicObject.selected == true) || (images[i].flags.selected == true))
						{
							arrImages[n] = i;
							n++;
						}
					}
				}
				if(n == 0)
					return -1;
				else
					return arrImages;
			},
			
			_makeNodesFromCellValue: function (val, defFN, defFS, cell) 
			{
				var i, res, span, f;

				function getTextDecoration(format) {
					var res = [];
					if (Asc.EUnderline.underlineNone !== format.u) { res.push("underline"); }
					if (format.s) {res.push("line-through");}
					return res.length > 0 ? res.join(",") : "";
				}
				
				var hyperlink;
				if(cell)
				{
					hyperlink = cell.getHyperlink();
				}
					
				for (res = [], i = 0; i < val.length; ++i) 
				{
					if(val[i] && val[i].format && val[i].format.skip)
						continue;						
					if(cell == undefined || (cell != undefined && (hyperlink == null || (hyperlink != null && hyperlink.getLocation() != null))))
					{
						span = doc.createElement("SPAN");
					}
					else
					{
						span = doc.createElement("A");
						if(hyperlink.Hyperlink != null)
							span.href = hyperlink.Hyperlink;
						else if(hyperlink.getLocation() != null)
							span.href = "#" + hyperlink.getLocation();
						if(hyperlink.Tooltip != null)
							span.title = hyperlink.Tooltip;
					}
					
					if( val[i].sFormula )
					{
						span.textContent = val[i].text;
						$(span).addClass("cellFrom_"+val[i].sId + "textFormula_" + "=" + val[i].sFormula);
					}
					else
					{
						span.textContent = val[i].text;
					}
					
					f = val[i].format;
					if (f.c) 
					{
						if(f.c && f.c.rgb)
							span.style.color = number2color(f.c.rgb);
						else
							span.style.color = number2color(f.c);
					}
					
					if (f.fn !== defFN) {span.style.fontFamily = f.fn;}
					if (f.fs !== defFS) {span.style.fontSize = f.fs + 'pt';}
					if (f.b) {span.style.fontWeight = 'bold';}
					if (f.i) {span.style.fontStyle = 'italic';}
					span.style.textDecoration = getTextDecoration(f);
					span.style.verticalAlign = f.va === 'subscript' ? 'sub' : f.va === 'superscript' ? 'super' : 'baseline';
					span.innerHTML = span.innerHTML.replace(/\n/g,'<br>');
					res.push(span);
				}
				return res;
			},
			
			_getTextFromShape: function(documentContent)
			{
				var res = "";
				
				if(documentContent && documentContent.Content && documentContent.Content.length)
				{
					for(var i = 0; i < documentContent.Content.length; i++)
					{
						if(documentContent.Content[i])
						{
							var paraText = documentContent.Content[i].Get_SelectedText();
							if(paraText)
							{
								if(i !== 0)
								{
									res += '\n';
								}
								res += paraText;
							}
						}
					}
				}
				
				return res;
			},
			
			_getTextFromSheet: function(range, worksheet)
			{
				var res = null;
				var t = this;
				
				if(range)
				{
					var bbox = range.bbox;
					
					var res = '';	
					for (var row = bbox.r1; row <= bbox.r2; ++row) 
					{
						if(row != bbox.r1)
							res += '\n';
						
						for (var col = bbox.c1; col <= bbox.c2; ++col) 
						{
							if(col != bbox.c1)
							{
								res += '\t';
							}
							
							var currentRange = worksheet.model.getCell3(row, col);
							var textRange = currentRange.getValue();
							if(textRange == '')
							{
								res += '\t';
							}
							else
							{
								res += textRange;
							}
						}
					}
				}
				
				return res;
			}
		};
		
		function PasteProcessorExcel()
		{
			this.activeRange = null;
			this.alreadyLoadImagesOnServer = false;
			
			this.Api = window["Asc"]["editor"];
			
			this.fontsNew = {};
			this.oImages = {};
		}
		
		PasteProcessorExcel.prototype = {
			
			constructor: PasteProcessorExcel,
			
			pasteFromBinary: function(worksheet, binary)
			{
				var base64 = null, base64FromWord = null, base64FromPresentation = null, t = this;
				
				if(binary.indexOf("xslData;") > -1)
				{
					base64 = binary.split('xslData;')[1];
				}
				else if(binary.indexOf("docData;") > -1)
				{
					base64FromWord = binary.split('docData;')[1];
				}
				else if(binary.indexOf("pptData;") > -1)
				{
					base64FromPresentation = binary.split('pptData;')[1];
				}
				
				var result = false;
				var isIntoShape = worksheet.objectRender.controller.getTargetDocContent();
				if(base64 != null)//from excel
				{
					result = this._pasteFromBinaryExcel(worksheet, base64, isIntoShape);
				} 
				else if (base64FromWord)//from word
				{
					this.activeRange = worksheet.activeRange.clone(true);
					result = this._pasteFromBinaryWord(worksheet, base64FromWord, isIntoShape);
				}
				else if(base64FromPresentation)
				{
					result = this._pasteFromBinaryPresentation(worksheet, base64FromPresentation, isIntoShape);
				}
				
				return result;
			},
			
			_pasteFromBinaryExcel: function(worksheet, base64, isIntoShape)
			{
				var oBinaryFileReader = new AscCommonExcel.BinaryFileReader(true);
				var tempWorkbook = new AscCommonExcel.Workbook();
				var t = this;
				
				pptx_content_loader.Start_UseFullUrl();
				oBinaryFileReader.Read(base64, tempWorkbook);
				this.activeRange = oBinaryFileReader.copyPasteObj.activeRange;
				var aPastedImages = pptx_content_loader.End_UseFullUrl();
				
				var pasteData = null;
				if (tempWorkbook)
					pasteData = tempWorkbook.aWorksheets[0];
				if (pasteData) {
					if(pasteData.Drawings && pasteData.Drawings.length)
					{
                        if (window["NativeCorrectImageUrlOnPaste"]) {
                            var url;
                            for(var i = 0, length = aPastedImages.length; i < length; ++i)
                            {
                                url = window["NativeCorrectImageUrlOnPaste"](aPastedImages[i].Url);
                                aPastedImages[i].Url = url;

                                var imageElem = aPastedImages[i];
                                if(null != imageElem)
                                {
                                    imageElem.SetUrl(url);
                                }
                            }

                            t._insertImagesFromBinary(worksheet, pasteData, isIntoShape);
                        }
                        else if(!(window["Asc"]["editor"] && window["Asc"]["editor"].isChartEditor))
                        {
                            if(aPastedImages && aPastedImages.length)
                            {
                                t._loadImagesOnServer(aPastedImages, function() {
                                    t._insertImagesFromBinary(worksheet, pasteData, isIntoShape);
                                });
                            }
                            else
                            {
                                t._insertImagesFromBinary(worksheet, pasteData, isIntoShape);
                            }
                        }
					}
					else 
					{	
						if(this._checkPasteFromBinaryExcel(worksheet, true, pasteData))
						{
							var newFonts = {};
							pasteData.generateFontMap(newFonts);
							worksheet._loadFonts(newFonts, function() {
								worksheet.setSelectionInfo('paste', pasteData, false, "binary");
							});
						}
					}
					
					return true;
				}
				
				return false;
			},
			
			_pasteFromBinaryWord: function(worksheet, base64, isIntoShape)
			{
				var pasteData = this.ReadFromBinaryWord(base64, worksheet);
				
				//insert binary from word into SHAPE
				if(isIntoShape)
				{
					this._insertBinaryIntoShapeContent(worksheet, pasteData.content, true);
				}
				else
				{
					var oPasteFromBinaryWord = new pasteFromBinaryWord(this, worksheet);
					oPasteFromBinaryWord._paste(worksheet, pasteData);
				}
				
				return true;
			},
			
			_pasteFromBinaryPresentation: function(worksheet, base64, isIntoShape)
			{
				pptx_content_loader.Clear();

				var _stream = AscFormat.CreateBinaryReader(base64, 0, base64.length);
				var stream = new AscCommon.FileStream(_stream.data, _stream.size);
				var p_url = stream.GetString2();
				var p_width = stream.GetULong()/100000;
				var p_height = stream.GetULong()/100000;
				var fonts = [];
				var t = this;
				
				var first_string = stream.GetString2();
				
				switch(first_string)
				{
					case "Content":
					{
						var docContent = this.ReadPresentationText(stream, worksheet, isIntoShape);
						
						if(isIntoShape)
						{
							this._insertBinaryIntoShapeContent(worksheet, docContent)
							
							return true;
						}
						else
						{
							var oPasteFromBinaryWord = new pasteFromBinaryWord(this, worksheet);
							
							var oTempDrawingDocument = worksheet.model.DrawingDocument;
							var newCDocument = new CDocument(oTempDrawingDocument, false);
							newCDocument.bFromDocument = true;
							newCDocument.theme = this.Api.wbModel.theme;
							
							var newContent = [];
							for(var i = 0; i < docContent.length; i++)
							{
								if(type_Paragraph == docContent[i].GetType())//paragraph
								{
									docContent[i] = AscFormat.ConvertParagraphToWord(docContent[i], newCDocument);
									docContent[i].bFromDocument = true;
									newContent.push(docContent[i]);
								}
								else if(type_Table == docContent[i].GetType())//table
								{
									//TODO вырезать из таблицы параграфы
								}
							}
							docContent = newContent;
							
							oPasteFromBinaryWord._paste(worksheet, {content: docContent});
						}
						
						return true;
					}
					case "Drawings":
					{
						var objects = this.ReadPresentationShapes(stream, worksheet);
						
						//****если записана одна табличка, то вставляем html и поддерживаем все цвета и стили****
						if(!objects.arrImages.length && objects.arrShapes.length === 1)
						{
							var drawing = objects.arrShapes[0].graphicObject;
							if(typeof CGraphicFrame !== "undefined" && drawing instanceof CGraphicFrame)
								return false;
						}
						
						var arr_shapes = objects.arrShapes;
						if(arr_shapes && arr_shapes.length)
						{
							var aPastedImages = objects.arrImages;
							if(!(window["Asc"]["editor"] && window["Asc"]["editor"].isChartEditor))
							{
								if(aPastedImages && aPastedImages.length)
								{
									t._loadImagesOnServer(aPastedImages, function() {
										t._insertImagesFromBinary(worksheet, {Drawings: arr_shapes}, isIntoShape);
									});
								}
								else
									t._insertImagesFromBinary(worksheet, {Drawings: arr_shapes}, isIntoShape);
							}
						}
						
						return true;
					}
					case "SlideObjects":
					{
						break;
					}
				}
				
				return false;
			},
			
			_insertBinaryIntoShapeContent: function(worksheet, content, isConvertToPPTX)
			{
				History.Create_NewPoint();
				History.StartTransaction();
				
				//ещё раз вызваем getTargetDocContent с флагом true после создания точки в истории(getTargetDocContent добавляет данные в историю)
				var isIntoShape = worksheet.objectRender.controller.getTargetDocContent(true);
				
				var insertContent = new CSelectedContent();
				var target_doc_content = isIntoShape;
				
				insertContent.Elements = this._convertBeforeInsertIntoShapeContent(worksheet, content, isConvertToPPTX, target_doc_content);
				this._insertSelectedContentIntoShapeContent(worksheet, insertContent, target_doc_content);
				
				History.EndTransaction();
			},
			
			_convertBeforeInsertIntoShapeContent: function(worksheet, content, isConvertToPPTX, target_doc_content)
			{
				var elements = [], selectedElement, element;
				
				for(var i = 0; i < content.length; i++)
				{
					selectedElement = new CSelectedElement();
					element = content[i];
					
					if(type_Paragraph == element.GetType())//paragraph
					{
						if(isConvertToPPTX)
						{
							
							selectedElement.Element = AscFormat.ConvertParagraphToPPTX(element, worksheet.model.DrawingDocument, target_doc_content);
						}
						else
						{
							selectedElement.Element = element;
						}
						
						elements.push(selectedElement);
					}
					else if(type_Table == element.GetType())//table
					{
						//TODO вырезать из таблицы параграфы
					}
				}
				
				return  elements;
			},
			
			_insertSelectedContentIntoShapeContent: function(worksheet, selectedContent, target_doc_content)
			{
				var paragraph = target_doc_content.Content[target_doc_content.CurPos.ContentPos];
				if (null != paragraph && type_Paragraph == paragraph.GetType() && selectedContent.Elements && selectedContent.Elements.length)
				{
					var NearPos = {Paragraph: paragraph, ContentPos: paragraph.Get_ParaContentPos(false, false)};
					paragraph.Check_NearestPos(NearPos);
					target_doc_content.Insert_Content(selectedContent, NearPos);
					
					worksheet.objectRender.controller.cursorMoveRight(false, false)
					
					var oTargetTextObject = AscFormat.getTargetTextObject(worksheet.objectRender.controller);
					oTargetTextObject && oTargetTextObject.checkExtentsByDocContent && oTargetTextObject.checkExtentsByDocContent();
					worksheet.objectRender.controller.startRecalculate();
				}
			},
			
			_insertImagesFromBinary: function(ws, data, isIntoShape)
			{
				var activeRange = ws.activeRange;
				var curCol, drawingObject, curRow, startCol, startRow, xfrm, aImagesSync = [], activeRow, activeCol, tempArr, offX, offY, rot;

				History.Create_NewPoint();
				History.StartTransaction();
				
				//определяем стартовую позицию, если изображений несколько вставляется
				for(var i = 0; i < data.Drawings.length; i++)
				{
					drawingObject = data.Drawings[i];
					xfrm = drawingObject.graphicObject.spPr.xfrm;
					if(xfrm)
					{
						offX = 0;
						offY = 0;
						rot = AscFormat.isRealNumber(xfrm.rot) ? xfrm.rot : 0;
						rot = AscFormat.normalizeRotate(rot);
						if (AscFormat.checkNormalRotate(rot))
						{
							if(AscFormat.isRealNumber(xfrm.offX) && AscFormat.isRealNumber(xfrm.offY))
							{
								offX = xfrm.offX;
								offY = xfrm.offY;
							}
						}
						else
						{
							if(AscFormat.isRealNumber(xfrm.offX) && AscFormat.isRealNumber(xfrm.offY)
							&& AscFormat.isRealNumber(xfrm.extX) && AscFormat.isRealNumber(xfrm.extY))
							{
								offX = xfrm.offX + xfrm.extX/2 - xfrm.extY/2;
								offY = xfrm.offY + xfrm.extY/2 - xfrm.extX/2;
							}
						}

						if(i == 0)
						{
							startCol = offX;
							startRow = offY;
						}
						else 
						{
							if(startCol > offX)
							{
								startCol = offX;
							}	
							if(startRow > offY)
							{
								startRow = offY;
							}	
						}
					}
					else
					{
						if(i == 0)
						{
							startCol = drawingObject.from.col;
							startRow = drawingObject.from.row;
						}
						else 
						{
							if(startCol > drawingObject.from.col)
							{
								startCol = drawingObject.from.col;
							}	
							if(startRow > drawingObject.from.row)
							{
								startRow = drawingObject.from.row;
							}	
						}
					}
				};


				for(var i = 0; i < data.Drawings.length; i++)
				{	
					data.Drawings[i].graphicObject = data.Drawings[i].graphicObject.copy();
					drawingObject = data.Drawings[i];
					
					
					//отдельная обработка для вставки таблички из презентаций
					if(data.Drawings.length === 1 && typeof CGraphicFrame !== "undefined" && drawingObject.graphicObject instanceof CGraphicFrame)
					{
						//вставляем табличку из презентаций
						var oPasteFromBinaryWord = new pasteFromBinaryWord(this, ws);
						
						var newCDocument = new CDocument(oTempDrawingDocument, false);
						newCDocument.bFromDocument = true;
						newCDocument.theme = this.Api.wbModel.theme;
						
						drawingObject.graphicObject.setBDeleted(true);
						drawingObject.graphicObject.setWordFlag(false, newCDocument);
						
						var oTempDrawingDocument = ws.model.DrawingDocument;
						oTempDrawingDocument.m_oLogicDocument = newCDocument;
						
						drawingObject.graphicObject.graphicObject.Set_Parent(newCDocument);
						oPasteFromBinaryWord._paste(ws, {DocumentContent: [drawingObject.graphicObject.graphicObject]});
						
						return;
					}

                    if(drawingObject.graphicObject.fromSerialize && drawingObject.graphicObject.setBFromSerialize)
                    {
                        drawingObject.graphicObject.setBFromSerialize(false);
                    }
					AscFormat.CheckSpPrXfrm(drawingObject.graphicObject);
					xfrm = drawingObject.graphicObject.spPr.xfrm;
					
					activeRow = activeRange.r1;
					activeCol = activeRange.c1;
					if(isIntoShape && isIntoShape.Parent &&  isIntoShape.Parent.parent && isIntoShape.Parent.parent.drawingBase && isIntoShape.Parent.parent.drawingBase.from)
					{
						activeRow = isIntoShape.Parent.parent.drawingBase.from.row;
						activeCol = isIntoShape.Parent.parent.drawingBase.from.col;
					}
					
					curCol = xfrm.offX - startCol + ws.objectRender.convertMetric(ws.cols[activeCol].left - ws.getCellLeft(0, 1), 1, 3);
					curRow = xfrm.offY - startRow + ws.objectRender.convertMetric(ws.rows[activeRow].top  - ws.getCellTop(0, 1), 1, 3);

					drawingObject = ws.objectRender.cloneDrawingObject(drawingObject);
					drawingObject.graphicObject.setDrawingBase(drawingObject);
					
					drawingObject.graphicObject.setDrawingObjects(ws.objectRender);
					drawingObject.graphicObject.setWorksheet(ws.model);

                    xfrm.setOffX(curCol);
                    xfrm.setOffY(curRow);


                    drawingObject.graphicObject.checkRemoveCache &&  drawingObject.graphicObject.checkRemoveCache();

					drawingObject.graphicObject.addToDrawingObjects();
                    if(drawingObject.graphicObject.checkDrawingBaseCoords)
                    {
                        drawingObject.graphicObject.checkDrawingBaseCoords();
                    }
                    drawingObject.graphicObject.recalculate();
					drawingObject.graphicObject.select(ws.objectRender.controller, 0);
					
					tempArr = [];
					drawingObject.graphicObject.getAllRasterImages(tempArr);
					
					if(tempArr.length)
					{	
						for(var n = 0; n < tempArr.length; n++)
						{
							aImagesSync.push(tempArr[n]);
						}
					}
				}

                ws.objectRender.showDrawingObjects(true);
                ws.objectRender.controller.updateOverlay();
                ws.setSelectionShape(true);
                History.EndTransaction();
                if(aImagesSync.length > 0)
                {
                    window["Asc"]["editor"].ImageLoader.LoadDocumentImages(aImagesSync, null,
                        function(){
                            ws.objectRender.showDrawingObjects(true);
                            ws.objectRender.controller.getGraphicObjectProps();
                    });
                }
			},
			
			_loadImagesOnServer: function(aPastedImages, callback)
			{
				var api = Asc["editor"];
				
				var oObjectsForDownload = AscCommon.GetObjectsForImageDownload(aPastedImages);

				AscCommon.sendImgUrls(api, oObjectsForDownload.aUrls, function (data) {
					var oImageMap = {};
					AscCommon.ResetNewUrls(data, oObjectsForDownload.aUrls, oObjectsForDownload.aBuilderImagesByUrl, oImageMap);

					callback();
				}, true);
			},
			
			editorPasteExec: function (worksheet, node, isText, onlyFromLocalStorage)
            {
				if(node == undefined)
					return;
					
				var aResult, binaryResult, pasteFragment = node, t = this, localStorageResult;
				t.alreadyLoadImagesOnServer = false;
				
				//****binary****
				if(onlyFromLocalStorage)
				{
					onlyFromLocalStorage = null;
					node = this.element;
					pasteFragment = node;
				}
				
				//если находимся внутри шейпа
				var isIntoShape = worksheet.objectRender.controller.getTargetDocContent();
				if(isIntoShape)
				{
					var callback = function(isSuccess)
					{
						if(isSuccess)
							t._pasteInShape(worksheet, node, onlyFromLocalStorage, isIntoShape);
					};
					
					worksheet.objectRender.controller.checkSelectedObjectsAndCallback2(callback);
					return;
				}
				
				//****binary****
				if(copyPasteUseBinary)
				{
					this.activeRange = worksheet.activeRange.clone(true);
					binaryResult = this._pasteFromBinaryClassHtml(worksheet, node, onlyFromLocalStorage, isIntoShape);
					
					if(binaryResult === true)
						return;
					else if(binaryResult !== false && binaryResult != undefined)
					{
						pasteFragment = binaryResult;
						node = binaryResult;
					}
				}

				this.activeRange = worksheet.activeRange.clone(true);
				
				
				var callBackAfterLoadImages = function()
				{
					History.TurnOff();
				
					var oPasteProcessor;
					var oTempDrawingDocument = worksheet.model.DrawingDocument;
					var newCDocument = new CDocument(oTempDrawingDocument, false);
					newCDocument.bFromDocument = true;
					//TODo!!!!!!
					newCDocument.Content[0].bFromDocument = true;
					newCDocument.theme = t.Api.wbModel.theme;
					
					oTempDrawingDocument.m_oLogicDocument = newCDocument;
					var oOldEditor = undefined;
					if ("undefined" != typeof editor)
						oOldEditor = editor;
					editor = {WordControl: oTempDrawingDocument, isDocumentEditor: true};
					var oPasteProcessor = new AscCommon.PasteProcessor({WordControl:{m_oLogicDocument: newCDocument}, FontLoader: {}}, false, false);
					oPasteProcessor._Prepeare_recursive(node, true, true)
					oPasteProcessor._Execute(node, {}, true, true, false);
					editor = oOldEditor;
					
					History.TurnOn();
					
					var oPasteFromBinaryWord = new pasteFromBinaryWord(t, worksheet);
					oPasteFromBinaryWord._paste(worksheet, {content: oPasteProcessor.aContent});
				};
				
				var aImagesToDownload = this._getImageFromHtml(node, true);
				if(aImagesToDownload !== null)//load to server
				{
                    var api = Asc["editor"];
					AscCommon.sendImgUrls(api, aImagesToDownload, function (data) {
                       for (var i = 0, length = Math.min(data.length, aImagesToDownload.length); i < length; ++i) 
					   {
							var elem = data[i];
							var sFrom = aImagesToDownload[i];
							if (null != elem.url) 
							{
								var name = AscCommon.g_oDocumentUrls.imagePath2Local(elem.path);
								t.oImages[sFrom] = name;
							} 
							else 
							{
								t.oImages[sFrom] = sFrom;
							}
						}
						
						t.alreadyLoadImagesOnServer = true;
                        callBackAfterLoadImages();
						
                    }, true);
					
				}
				else
				{
					callBackAfterLoadImages();
				}
            },
			
			//TODO rename
			_pasteFromBinaryClassHtml: function(worksheet, node, onlyFromLocalStorage, isIntoShape)
			{
				var base64 = null, base64FromWord = null, base64FromPresentation = null, t = this;
				
				if(onlyFromLocalStorage)
				{
					/*if(typeof t.lStorage == "object")
					{
						if(t.lStorage.htmlInShape)
						{
							return t.lStorage.htmlInShape;
						}
						else
						{
							window.GlobalPasteFlag = false;
							window.GlobalPasteFlagCounter = 0;
							return true;
						}
					}
					else
						base64 = t.lStorage;*/
						
					return;
				}
				else//find class xslData or docData
				{
					var returnBinary = this._getClassBinaryFromHtml(node);
					base64 = returnBinary.base64;
					base64FromWord = returnBinary.base64FromWord;
					base64FromPresentation = returnBinary.base64FromPresentation;
				}
					
				var result = false;
				if(base64 != null)//from excel
				{
					result = this._pasteFromBinaryExcel(worksheet, base64, isIntoShape);
				} 
				else if (base64FromWord && copyPasteFromWordUseBinary)//from word
				{
					result = this._pasteFromBinaryWord(worksheet, base64FromWord, isIntoShape);
				}
				else if(base64FromPresentation)
				{
					result = this._pasteFromBinaryPresentation(worksheet, base64FromPresentation, isIntoShape);
				}
				
				return result;
			},
			
			_getClassBinaryFromHtml: function(node)
			{
				var classNode, base64 = null, base64FromWord = null, base64FromPresentation = null;
				if(node.children[0] && node.children[0].getAttribute("class") != null && (node.children[0].getAttribute("class").indexOf("xslData;") > -1 || node.children[0].getAttribute("class").indexOf("docData;") > -1 || node.children[0].getAttribute("class").indexOf("pptData;") > -1))
					classNode = node.children[0].getAttribute("class");
				else if(node.children[0] && node.children[0].children[0] && node.children[0].children[0].getAttribute("class") != null && (node.children[0].children[0].getAttribute("class").indexOf("xslData;") > -1 || node.children[0].children[0].getAttribute("class").indexOf("docData;") > -1 || node.children[0].children[0].getAttribute("class").indexOf("pptData;") > -1))
					classNode = node.children[0].children[0].getAttribute("class");
				else if(node.children[0] && node.children[0].children[0] && node.children[0].children[0].children[0] && node.children[0].children[0].children[0].getAttribute("class") != null && (node.children[0].children[0].children[0].getAttribute("class").indexOf("xslData;") > -1 || node.children[0].children[0].children[0].getAttribute("class").indexOf("docData;") > -1  || node.children[0].children[0].children[0].getAttribute("class").indexOf("pptData;") > -1))
					classNode = node.children[0].children[0].children[0].getAttribute("class");
				
				if( classNode != null ){
					var cL = classNode.split(" ");
					for (var i = 0; i < cL.length; i++){
						if(cL[i].indexOf("xslData;") > -1)
						{
							base64 = cL[i].split('xslData;')[1];
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
				
				return {base64: base64, base64FromWord: base64FromWord, base64FromPresentation: base64FromPresentation};
			},
			
			_getImageFromHtml: function(html, isGetUrlsArray)
			{
				var res = null;
				
				if(html)
				{
					var allImages = html.getElementsByTagName('img');
					
					if(allImages && allImages.length)
					{
						if(isGetUrlsArray)
						{
							var arrayImages = [];
							for(var i = 0; i < allImages.length; i++)
							{
								arrayImages[i] = allImages[i].src;
							}
							
							res = arrayImages;
						}
						else
						{
							res = allImages;
						}
					}
				}
				
				return res;
			},
			
			_getBinaryColor: function(c) 
			{
				var bin, m, x, type, r, g, b, a, s;
				var reColor = /^\s*(?:#?([0-9a-f]{6})|#?([0-9a-f]{3})|rgba?\s*\(\s*((?:\d*\.?\d+)(?:\s*,\s*(?:\d*\.?\d+)){2,3})\s*\))\s*$/i;
				if (typeof c === "number") {
					bin = c;
				} else {
				
					m = reColor.exec(c);
					if (!m) {return null;}

					if (m[1]) {
						x = [ m[1].slice(0, 2), m[1].slice(2, 4), m[1].slice(4) ];
						type = 1;
					} else if (m[2]) {
						x = [ m[2].slice(0, 1), m[2].slice(1, 2), m[2].slice(2) ];
						type = 0;
					} else {
						x = m[3].split(/\s*,\s*/i);
						type = x.length === 3 ? 2 : 3;
					}

					r = parseInt(type !== 0 ? x[0] : x[0] + x[0], type < 2 ? 16 : 10);
					g = parseInt(type !== 0 ? x[1] : x[1] + x[1], type < 2 ? 16 : 10);
					b = parseInt(type !== 0 ? x[2] : x[2] + x[2], type < 2 ? 16 : 10);
					a = type === 3 ? (Math.round(parseFloat(x[3]) * 100) * 0.01) : 1;
					bin = (r << 16) | (g << 8) | b;

				}
				return bin;
			},
			
			_checkMaxTextLength: function(aResult, r, c)
			{
				var result = false;
				var isChange = false;
				
				var currentCellData = aResult[r][c];
				if(currentCellData && currentCellData[0])
				{
					currentCellData = currentCellData[0];
					for(var i = 0; i < currentCellData.length; i++)
					{
						if(currentCellData[i] && currentCellData[i].text && currentCellData[i].text.length > c_oAscMaxCellOrCommentLength)
						{
							isChange = true;
							
							var text = currentCellData[i].text;
							var lengthOfText = text.length;
							var iterCount = Math.ceil(lengthOfText / c_oAscMaxCellOrCommentLength);
							var splitText;
							for(var j = 0; j < iterCount; j++)
							{
								splitText = text.substr(c_oAscMaxCellOrCommentLength * j, c_oAscMaxCellOrCommentLength * (j + 1));
								if(!aResult[r])
									aResult[r] = [];
								if(!aResult[r][c])
									aResult[r][c] = [];
								if(!aResult[r][c][0])
									aResult[r][c][0] = [];
								
								aResult[r][c][0] = currentCellData;
								aResult[r][c][0][0].text = splitText;
								
								if(iterCount !== j + 1)
									r++;
							}
						}
					}
					if(isChange)
						result = {aResult: aResult, r: r, c: c};
				}
				
				return result;
			},
			
			_getBorderStyleName: function (borderStyle, borderWidth) 
			{
				var res = null;
				var nBorderWidth = parseFloat(borderWidth);
				if (isNaN(nBorderWidth))
					return res;
				if (typeof borderWidth == "string" && -1 !== borderWidth.indexOf("pt"))
					nBorderWidth = nBorderWidth * 96 / 72;

				switch (borderStyle) {
					case "solid":
						if (0 < nBorderWidth && nBorderWidth <= 1)
							res = c_oAscBorderStyles.Thin;
						else if (1 < nBorderWidth && nBorderWidth <= 2)
							res = c_oAscBorderStyles.Medium;
						else if (2 < nBorderWidth && nBorderWidth <= 3)
							res = c_oAscBorderStyles.Thick;
						else
							res = c_oAscBorderStyles.None;
						break;
					case "dashed":
						if (0 < nBorderWidth && nBorderWidth <= 1)
							res = c_oAscBorderStyles.DashDot;
						else
							res = c_oAscBorderStyles.MediumDashDot;
						break;
					case "double": res = c_oAscBorderStyles.Double; break;
					case "dotted": res = c_oAscBorderStyles.Hair; break;
				}
				return res;
			},
			
			
			_insertImagesFromBinaryWord: function(ws, data, aImagesSync)
			{
				var activeRange = ws.activeRange;
				var curCol, drawingObject, curRow, startCol = 0, startRow = 0, xfrm, drawingBase, graphicObject, offX, offY, rot;

				History.Create_NewPoint();
				History.StartTransaction();
				
				var api = window["Asc"]["editor"];
				var addImagesFromWord = data.addImagesFromWord;
				//определяем стартовую позицию, если изображений несколько вставляется
				for(var i = 0; i < addImagesFromWord.length; i++)
				{
					graphicObject = addImagesFromWord[i].image.GraphicObj;
					
					//convert from word
                    if(graphicObject.setBDeleted2)
                    {
                        graphicObject.setBDeleted2(true);
                    }
                    else
                    {
                        graphicObject.bDeleted = true;
                    }
					graphicObject = graphicObject.convertToPPTX(ws.model.DrawingDocument, ws.model);
					
					//create new drawingBase
					drawingObject = ws.objectRender.createDrawingObject();
					drawingObject.graphicObject = graphicObject;

					if(drawingObject.graphicObject.spPr && drawingObject.graphicObject.spPr.xfrm)
					{
						xfrm = drawingObject.graphicObject.spPr.xfrm;
						offX = 0;
						offY = 0;
						rot = AscFormat.isRealNumber(xfrm.rot) ? xfrm.rot : 0;
						rot = AscFormat.normalizeRotate(rot);
						if (AscFormat.checkNormalRotate(rot))
						{
							if(AscFormat.isRealNumber(xfrm.offX) && AscFormat.isRealNumber(xfrm.offY))
							{
								offX = xfrm.offX;
								offY = xfrm.offY;
							}
						}
						else
						{
							if(AscFormat.isRealNumber(xfrm.offX) && AscFormat.isRealNumber(xfrm.offY)
								&& AscFormat.isRealNumber(xfrm.extX) && AscFormat.isRealNumber(xfrm.extY))
							{
								offX = xfrm.offX + xfrm.extX/2 - xfrm.extY/2;
								offY = xfrm.offY + xfrm.extY/2 - xfrm.extX/2;
							}
						}

						if(i == 0)
						{
							startCol = offX;
							startRow = offY;
						}
						else 
						{
							if(startCol > offX)
							{
								startCol = offX;
							}	
							if(startRow > offY)
							{
								startRow = offY;
							}	
						}
					}
					else
					{
						if(i == 0)
						{
							startCol = drawingObject.from.col;
							startRow = drawingObject.from.row;
						}
						else 
						{
							if(startCol > drawingObject.from.col)
							{
								startCol = drawingObject.from.col;
							}	
							if(startRow > drawingObject.from.row)
							{
								startRow = drawingObject.from.row;
							}	
						}
					}


					AscFormat.CheckSpPrXfrm(drawingObject.graphicObject);
					xfrm = drawingObject.graphicObject.spPr.xfrm;

					curCol = xfrm.offX - startCol + ws.objectRender.convertMetric(ws.cols[addImagesFromWord[i].col].left - ws.getCellLeft(0, 1), 1, 3);
					curRow = xfrm.offY - startRow + ws.objectRender.convertMetric(ws.rows[addImagesFromWord[i].row].top  - ws.getCellTop(0, 1), 1, 3);
					
					xfrm.setOffX(curCol);
					xfrm.setOffY(curRow);

					drawingObject = ws.objectRender.cloneDrawingObject(drawingObject);
					drawingObject.graphicObject.setDrawingBase(drawingObject);
					
					drawingObject.graphicObject.setDrawingObjects(ws.objectRender);
					drawingObject.graphicObject.setWorksheet(ws.model);

                    drawingObject.graphicObject.checkRemoveCache &&  drawingObject.graphicObject.checkRemoveCache();
                    //drawingObject.graphicObject.setDrawingDocument(ws.objectRender.drawingDocument);
					drawingObject.graphicObject.addToDrawingObjects();
                    if(drawingObject.graphicObject.checkDrawingBaseCoords)
                    {
                        drawingObject.graphicObject.checkDrawingBaseCoords();
                    }
					drawingObject.graphicObject.recalculate();
                    drawingObject.graphicObject.select(ws.objectRender.controller, 0);
				}

                var old_val = api.ImageLoader.bIsAsyncLoadDocumentImages;
                api.ImageLoader.bIsAsyncLoadDocumentImages = true;
                api.ImageLoader.LoadDocumentImages(aImagesSync, null, ws.objectRender.asyncImagesDocumentEndLoaded);
                api.ImageLoader.bIsAsyncLoadDocumentImages = old_val;

				ws.objectRender.showDrawingObjects(true);
                ws.setSelectionShape(true);
				ws.objectRender.controller.updateOverlay();
				History.EndTransaction();
			},
			
			ReadPresentationShapes: function(stream, worksheet)
			{
				History.TurnOff();
				
				var loader = new AscCommon.BinaryPPTYLoader();
				loader.presentation = worksheet.model;
				loader.Start_UseFullUrl();
				loader.stream = stream;
				
				var count = stream.GetULong();
				var arr_shapes = [];
				var arr_transforms = [];
				var arrBase64Img = [];
				var cStyle;
				
				for(var i = 0; i < count; ++i)
				{
					var style_index = null;
					//читаем флаг о наличии табличного стиля
					if(!loader.stream.GetBool())
					{
						if(loader.stream.GetBool())
						{
							loader.stream.Skip2(1);
							cStyle = loader.ReadTableStyle();
	
							loader.stream.GetBool();
							style_index = stream.GetString2();
						}
					}
					
					var drawing = loader.ReadGraphicObject();
					
					var x = stream.GetULong() / 100000;
					var y = stream.GetULong() / 100000;
					var extX = stream.GetULong() / 100000;
					var extY = stream.GetULong() / 100000;
					var base64 = stream.GetString2();
					
					if(count !== 1 && typeof CGraphicFrame !== "undefined" && drawing instanceof CGraphicFrame)
					{
						drawing = AscFormat.DrawingObjectsController.prototype.createImage(base64, x, y, extX, extY);
					}
					
					arr_shapes[i] = worksheet.objectRender.createDrawingObject();
					arr_shapes[i].graphicObject = drawing;
				}
				
				History.TurnOn();
				
				return {arrShapes: arr_shapes, arrImages: loader.End_UseFullUrl(), arrTransforms: arr_transforms};
			},
			
			ReadPresentationText: function(stream, worksheet, cDocumentContent)
			{
				History.TurnOff();
				
				var loader = new AscCommon.BinaryPPTYLoader();
				loader.Start_UseFullUrl();
				loader.stream = stream;
				loader.presentation = worksheet.model;

				var count = stream.GetULong() / 100000;
				
				//читаем контент, здесь только параграфы
				//var newDocContent = new CDocumentContent(shape.txBody, editor.WordControl.m_oDrawingDocument, 0 , 0, 0, 0, false, false);
				var elements = [], paragraph, selectedElement;
				for(var i = 0; i < count; ++i)
				{
					loader.stream.Skip2(1); // must be 0
					paragraph = loader.ReadParagraph(cDocumentContent);
					
					elements.push(paragraph);
				}
				
				History.TurnOn();
				
				return elements;
			},
			
			ReadFromBinaryWord : function(sBase64, worksheet)
			{
			    History.TurnOff();
				AscCommon.g_oIdCounter.m_bRead = true;
				//передавать CDrawingDocument текущего worksheet
				var oTempDrawingDocument = worksheet.model.DrawingDocument;
				
			    var newCDocument = new CDocument(oTempDrawingDocument, false);
				newCDocument.bFromDocument = true;
				newCDocument.theme = this.Api.wbModel.theme;
				
			    oTempDrawingDocument.m_oLogicDocument = newCDocument;
			    var oOldEditor = undefined;
			    if ("undefined" != typeof editor)
			        oOldEditor = editor;
			    //создается глобальная переменная
			    editor = { isDocumentEditor: true, WordControl: { m_oLogicDocument: newCDocument } };
				
				pptx_content_loader.Clear();
				pptx_content_loader.Start_UseFullUrl();
				
			    var openParams = { checkFileSize: false, charCount: 0, parCount: 0 };
			    var oBinaryFileReader = new AscCommonWord.BinaryFileReader(newCDocument, openParams);
			    var oRes = oBinaryFileReader.ReadFromString(sBase64);
				
				pptx_content_loader.End_UseFullUrl();
				History.TurnOn();
				AscCommon.g_oIdCounter.m_bRead = false;
			    editor = oOldEditor;

			    return oRes;
			},
			
			_checkPasteFromBinaryExcel: function(worksheet, isWriteError, insertWorksheet)
			{
				var activeCellsPasteFragment = AscCommonExcel.g_oRangeCache.getAscRange(this.activeRange);
				var rMax = (activeCellsPasteFragment.r2 - activeCellsPasteFragment.r1) + worksheet.activeRange.r1;
				var cMax = (activeCellsPasteFragment.c2 - activeCellsPasteFragment.c1) + worksheet.activeRange.c1;
				var res = true;
				
				//если область вставки выходит за пределы доступной области
				if(cMax > AscCommon.gc_nMaxCol0 || rMax > AscCommon.gc_nMaxRow0)
				{
					if(isWriteError)
					{
						worksheet.handlers.trigger ("onErrorEvent", Asc.c_oAscError.ID.PasteMaxRangeError, Asc.c_oAscError.Level.NoCritical);
					}
					
					res = false;
				}
				else if(!worksheet.handlers.trigger("getLockDefNameManagerStatus") && insertWorksheet && insertWorksheet.TableParts && insertWorksheet.TableParts.length)
				{
					//если пытаемся вставить вторым пользователем форматированную таблицу, когда первый уже добавил другую форматированную таблицу
					worksheet.handlers.trigger("onErrorEvent", c_oAscError.ID.LockCreateDefName, c_oAscError.Level.NoCritical);
					
					res = false;
				}
				
				return res;
			},
			
			_pasteInShape: function(worksheet, node, onlyFromLocalStorage, targetDocContent)
			{
				targetDocContent.DrawingDocument.m_oLogicDocument = null;
				
				var oPasteProcessor = new AscCommon.PasteProcessor({WordControl:{m_oLogicDocument: targetDocContent}, FontLoader: {}}, false, false, true, true);
				oPasteProcessor.map_font_index = this.Api.FontLoader.map_font_index;
				oPasteProcessor.bIsDoublePx = false;
				
				var newFonts;
				
				if(onlyFromLocalStorage)
					node = this.element;//this.lStorage.htmlInShape ? this.lStorage.htmlInShape : this.lStorage;
				
				//если находимся внутри диаграммы убираем ссылки
				if(targetDocContent && targetDocContent.Parent && targetDocContent.Parent.parent && targetDocContent.Parent.parent.chart)
				{
					var changeTag = $(node).find("a");
					this._changeHtmlTag(changeTag);
				}
				
				oPasteProcessor._Prepeare_recursive(node, true, true);
				
				oPasteProcessor.aContent = [];
                 
				newFonts = this._convertFonts(oPasteProcessor.oFonts);


				History.StartTransaction();
				oPasteProcessor._Execute(node, {}, true, true, false);
				if(!oPasteProcessor.aContent || !oPasteProcessor.aContent.length) {
					window.GlobalPasteFlag = false;
					window.GlobalPasteFlagCounter = 0;
					History.EndTransaction();
					return false;
				}

                var targetContent = worksheet.objectRender.controller.getTargetDocContent(true);//нужно для заголовков диаграмм
                targetContent.Remove(1, true, true);
					
				worksheet._loadFonts(newFonts, function () {
					oPasteProcessor.InsertInPlace(targetContent , oPasteProcessor.aContent);
                    var oTargetTextObject = AscFormat.getTargetTextObject(worksheet.objectRender.controller);
                    oTargetTextObject && oTargetTextObject.checkExtentsByDocContent && oTargetTextObject.checkExtentsByDocContent();
					worksheet.objectRender.controller.startRecalculate();
                    worksheet.objectRender.controller.cursorMoveRight(false, false);
					window.GlobalPasteFlag = false;
					window.GlobalPasteFlagCounter = 0;
					History.EndTransaction();
				});
				
 				return true;
			},
			
			_convertFonts: function(oFonts)
			{
				var newFonts = {};
				var fontName;
				for(var i in oFonts)
				{
					fontName = oFonts[i].Name;
					newFonts[fontName] = 1;
				};
				return newFonts;
			},
			
			//TODO сделать при получаении структуры. игнорировать размер шрифта и тп
			_changeHtmlTag: function(arr)
			{
				var oldElem, value, style, bold, underline, italic;
				for(var i = 0; i < arr.length; i++)
				{
					oldElem = arr[i];
					value = oldElem.innerText;
					
					underline = "none";
					if(oldElem.style.textDecoration && oldElem.style.textDecoration != "")
						underline = oldElem.style.textDecoration;
						
					italic = "normal";
					if(oldElem.style.textDecoration && oldElem.style.textDecoration != "")
						italic = oldElem.style.fontStyle;
						
					bold = "normal";
					if(oldElem.style.fontWeight && oldElem.style.fontWeight != "")
						bold = oldElem.style.fontWeight;
					
					style = ' style = "text-decoration:' + underline + ";" + "font-style:" + italic + ";" + "font-weight:" + bold + ";" + '"';
					$(oldElem).replaceWith("<span" + style +  ">" + value + "</span>");
				};
			},
			
			pasteTextOnSheet: function(worksheet, text)
			{
				//TODO сделать вставку текста всегда через эту функцию
				this.activeRange = worksheet.activeRange.clone(true);
				
				//если находимся внутри шейпа
				var isIntoShape = worksheet.objectRender.controller.getTargetDocContent();
				if(isIntoShape)
				{
					var callback = function(isSuccess)
					{
						if(isSuccess === false)
						{
							return false;
						}
						
						var Count = text.length;
						for ( var Index = 0; Index < Count; Index++ )
						{
							var _char = text.charAt(Index);
							if (" " == _char)
								isIntoShape.Paragraph_Add(new ParaSpace());
							else
								isIntoShape.Paragraph_Add(new ParaText(_char));
						}
					};
					
					worksheet.objectRender.controller.checkSelectedObjectsAndCallback2(callback);
					return;
				}
				
				var aResult = [];
				aResult[this.activeRange.r1] = [];
				
				var oNewItem = [];
				oNewItem[0] = this._getDefaultCell(worksheet);
				aResult[this.activeRange.r1][this.activeRange.c1] = oNewItem;
				oNewItem[0][0].text = text;
				
				aResult.fontsNew = [];
				aResult.rowSpanSpCount = 0;
				aResult.cellCount = 1;
				aResult._images = undefined;
				aResult._aPastedImages = undefined;
				
				if(aResult && !(aResult.onlyImages && window["Asc"]["editor"] && window["Asc"]["editor"].isChartEditor))
				{
					worksheet.setSelectionInfo('paste', aResult, this);
				}
			},
			
			_getDefaultCell: function (worksheet)
			{
				var res = [];
				
				var fn = worksheet.model.workbook.getDefaultFont();
				var fs = worksheet.model.workbook.getDefaultSize();
				
				res.push({
					format: {
						fn: fn,
						fs: fs,
						b: false,
						i: false,
						u: Asc.EUnderline.underlineNone,
						s: false,
						va: 'none'
					},
					text: ''});
				
				return res; 
			}
			
		};
		

		/** @constructor */
		function pasteFromBinaryWord(clipboard, ws) {
			this.fontsNew = {};
			this.aResult = [];
			this.clipboard = clipboard;
			this.ws = ws;
			this.isUsuallyPutImages = null;
			this.maxLengthRowCount = 0;
			
			return this;
		}

		pasteFromBinaryWord.prototype = {
			
			constructor: pasteFromBinaryWord,
			
			_paste : function(worksheet, pasteData)
			{
				var documentContent = pasteData.content;
				var activeRange = worksheet.activeRange.clone(true);
				if(pasteData.images && pasteData.images.length)
					this.isUsuallyPutImages = true;
				
				if(!documentContent || (documentContent && !documentContent.length))
					return;
				
				var documentContentBounds = new DocumentContentBounds();
				var coverDocument = documentContentBounds.getBounds(0,0, documentContent);
				this._parseChildren(coverDocument, activeRange);
				
				this.aResult.fontsNew = this.fontsNew;
				this.aResult.rowSpanSpCount = 0;
				this.aResult.cellCount = coverDocument.width;
				this.aResult._images = pasteData.images ? pasteData.images : this.aResult._images;
				this.aResult._aPastedImages = pasteData.aPastedImages ? pasteData.aPastedImages : this.aResult._aPastedImages;
				
				worksheet.setSelectionInfo('paste', this.aResult, this);
			},
			
			_parseChildren: function(children, activeRange)
			{
				var backgroundColor;
				var childrens = children.children;
				for(var i = 0; i < childrens.length; i++)
				{
					if(childrens[i].type == c_oAscBoundsElementType.Cell)
					{
						for(var row = childrens[i].top; row < childrens[i].top + childrens[i].height; row++)
						{
							if(!this.aResult[row + activeRange.r1])
								this.aResult[row + activeRange.r1] = [];
							for(var col = childrens[i].left; col < childrens[i].left + childrens[i].width; col++)
							{
								if(!this.aResult[row + activeRange.r1][col + activeRange.c1])
									this.aResult[row + activeRange.r1][col + activeRange.c1] = [];
								if(!this.aResult[row + activeRange.r1][col + activeRange.c1][0])
									this.aResult[row + activeRange.r1][col + activeRange.c1][0] = [];
									
								var isCtable = false;
								var tempChildren = childrens[i].children[0].children;
								var colSpan = null;
								var rowSpan = null;
								for(var temp = 0; temp < tempChildren.length; temp++)
								{
									if(tempChildren[temp].type == c_oAscBoundsElementType.Table)
										isCtable = true;
								}
								if(childrens[i].width > 1 && isCtable && col == childrens[i].left)
								{
									colSpan = childrens[i].width;
									rowSpan = 1;
								}	
								else if(!isCtable && tempChildren.length == 1)
								{
									rowSpan = childrens[i].height;
									colSpan = childrens[i].width;
								}	

								this.aResult[row + activeRange.r1][col + activeRange.c1][0].rowSpan = rowSpan;
								this.aResult[row + activeRange.r1][col + activeRange.c1][0].colSpan = colSpan;
								
								//backgroundColor
								backgroundColor = this.getBackgroundColorTCell(childrens[i]);
								if(backgroundColor)
									this.aResult[row + activeRange.r1][col + activeRange.c1][0].bc = backgroundColor;
								
								this.aResult[row + activeRange.r1][col + activeRange.c1][0].borders = this._getBorders(childrens[i], row, col, this.aResult[row + activeRange.r1][col + activeRange.c1][0].borders);
							}
						}
					}
					
					if(childrens[i].children.length == 0)
					{
						//if parent - cell of table
						var colSpan = null;
						var rowSpan = null;
						
						this._parseParagraph(childrens[i], activeRange, childrens[i].top + activeRange.r1, childrens[i].left + activeRange.c1);
					}
					else
						this._parseChildren(childrens[i], activeRange);
				}
			},
			
			_getBorders: function(cellTable, top, left, oldBorders)
			{
				var borders = cellTable.elem.Get_Borders();
				var widthCell = cellTable.width;
				var heigthCell = cellTable.height;
				var defaultStyle = "solid";
				var borderStyleName;
				
				var formatBorders = oldBorders ? oldBorders : new AscCommonExcel.Border();
				//top border for cell
				if(top == cellTable.top && !formatBorders.t.s && borders.Top.Value !== 0/*border_None*/)
				{
					borderStyleName = this.clipboard._getBorderStyleName(defaultStyle, this.ws.objectRender.convertMetric(borders.Top.Size,3,1));
					if (null !== borderStyleName) {
						formatBorders.t.setStyle(borderStyleName);
						formatBorders.t.c = new AscCommonExcel.RgbColor(this.clipboard._getBinaryColor("rgb(" + borders.Top.Color.r + "," + borders.Top.Color.g + "," + borders.Top.Color.b + ")"));
					}
				}
				//left border for cell
				if(left == cellTable.left && !formatBorders.l.s && borders.Left.Value !== 0/*border_None*/)
				{
					borderStyleName = this.clipboard._getBorderStyleName(defaultStyle, this.ws.objectRender.convertMetric(borders.Left.Size,3,1));
					if (null !== borderStyleName) {
						formatBorders.l.setStyle(borderStyleName);
						formatBorders.l.c = new AscCommonExcel.RgbColor(this.clipboard._getBinaryColor("rgb(" + borders.Left.Color.r + "," + borders.Left.Color.g + "," + borders.Left.Color.b + ")"));
					}
				}
				//bottom border for cell
				if(top == cellTable.top + heigthCell - 1 && !formatBorders.b.s && borders.Bottom.Value !== 0/*border_None*/)
				{
					borderStyleName = this.clipboard._getBorderStyleName(defaultStyle, this.ws.objectRender.convertMetric(borders.Bottom.Size,3,1));
					if (null !== borderStyleName) {
						formatBorders.b.setStyle(borderStyleName);
						formatBorders.b.c = new AscCommonExcel.RgbColor(this.clipboard._getBinaryColor("rgb(" + borders.Bottom.Color.r + "," + borders.Bottom.Color.g + "," + borders.Bottom.Color.b + ")"));
					}
				}
				//right border for cell
				if(left == cellTable.left + widthCell - 1 && !formatBorders.r.s && borders.Right.Value !== 0/*border_None*/)
				{
					borderStyleName = this.clipboard._getBorderStyleName(defaultStyle, this.ws.objectRender.convertMetric(borders.Right.Size,3,1));
					if (null !== borderStyleName) {
						formatBorders.r.setStyle(borderStyleName);
						formatBorders.r.c = new AscCommonExcel.RgbColor(this.clipboard._getBinaryColor("rgb(" + borders.Right.Color.r + "," + borders.Right.Color.g + "," + borders.Right.Color.b + ")"));
					}
				}
				
				return formatBorders;
			},
			
			_parseParagraph: function(paragraph, activeRange, row, col, rowSpan, colSpan)
			{
				var content = paragraph.elem.Content;
				var row, cTextPr, fontFamily = "Arial";
				var text = null;
				var oNewItem = [], cloneNewItem;
				var paraRunContent;

				var aResult = this.aResult;
				if(row === undefined)
				{
					if(aResult.length == 0)
					{
						row = activeRange.r1;
					}
					else
						row = aResult.length;
				}
				
				if(this.aResult[row + this.maxLengthRowCount] && this.aResult[row + this.maxLengthRowCount][col] && this.aResult[row + this.maxLengthRowCount][col][0] && this.aResult[row + this.maxLengthRowCount][col][0].length === 0 && (this.aResult[row + this.maxLengthRowCount][col][0].borders || this.aResult[row + this.maxLengthRowCount][col][0].rowSpan != null))
				{
					if(this.aResult[row + this.maxLengthRowCount][col][0].borders)
						oNewItem.borders = this.aResult[row + this.maxLengthRowCount][col][0].borders;
					if(this.aResult[row + this.maxLengthRowCount][col][0].rowSpan != null)
					{
						oNewItem.rowSpan = this.aResult[row + this.maxLengthRowCount][col][0].rowSpan;
						oNewItem.colSpan = this.aResult[row + this.maxLengthRowCount][col][0].colSpan;
					}
					delete this.aResult[row + this.maxLengthRowCount][col];
				};
	
				if(!aResult[row])
					aResult[row] = [];
					
				var s = 0;
				var c1 = col !== undefined ? col : activeRange.c1;
				
				//backgroundColor
				var backgroundColor = this.getBackgroundColorTCell(paragraph);
				if(backgroundColor)
					oNewItem.bc = backgroundColor;
				
				//настройки параграфа
				paragraph.elem.CompiledPr.NeedRecalc = true;
				var paraPr = paragraph.elem.Get_CompiledPr();
				var paragraphFontFamily = paraPr.TextPr.FontFamily.Name;
				
				//горизонтальное выравнивание
				var horisonalAlign = this._getAlignHorisontal(paraPr);
				if(horisonalAlign)
					oNewItem.a = this._getAlignHorisontal(paraPr);
				else if(horisonalAlign == null)
					oNewItem.wrap = true;
					
				//вертикальное выравнивание
				oNewItem.va = "center";
					
				//так же wrap выставляем у параграфа, чьим родителем является ячейка таблицы	
				if(this._getParentByTag(paragraph, c_oAscBoundsElementType.Cell) != null)
					oNewItem.wrap = false;
				
				//Numbering
				var LvlPr = null;
				var Lvl = null;
				var oNumPr = paragraph.elem.Numbering_Get();
				var numberingText = null;
				var formatText;
				if(oNumPr != null)
				{
					var aNum = paragraph.elem.Parent.Numbering.Get_AbstractNum( oNumPr.NumId );
					if(null != aNum)
					{
						LvlPr = aNum.Lvl[oNumPr.Lvl];
						Lvl = oNumPr.Lvl;
					};
					
					numberingText = this._parseNumbering(paragraph.elem);
					
					if(text == null)
						text = "";
					
					text += this._getAllNumberingText(Lvl, numberingText);
						
					formatText = this._getPrParaRun(paraPr, LvlPr.TextPr);
					fontFamily = formatText.format.fn;
					this.fontsNew[fontFamily] = 1;
					
					oNewItem.push(formatText);
					
					if(text !== null)
						oNewItem[oNewItem.length - 1].text = text;
						
					text = "";
				};

				
				//проходимся по контенту paragraph
				for(var n = 0; n < content.length; n++)
				{
					if(!aResult[row + this.maxLengthRowCount])
						aResult[row + this.maxLengthRowCount] = [];
					
					//s  - меняется в зависимости от табуляции
					if(!aResult[row + this.maxLengthRowCount][s + c1])
						aResult[row + this.maxLengthRowCount][s + c1] = [];
						
					if(text == null)
						text = "";
					
					
					switch(content[n].Type)
					{
						case para_Run://*paraRun*
						{
							s = this._parseParaRun(content[n], oNewItem, paraPr, s, row, c1, text);
							break;
						};
						case para_Hyperlink://*hyperLink*
						{	
							//если несколько ссылок в одном параграфе, то отменяем ссылки
							if(!oNewItem.doNotApplyHyperlink)
							{
								if(!oNewItem.hyperLink)
								{
									oNewItem.hyperLink = content[n].Value;
									oNewItem.toolTip = content[n].ToolTip;
								}
								else
								{
									oNewItem.hyperLink = null;
									oNewItem.toolTip = null;
									oNewItem.doNotApplyHyperlink = true;
								}
							}
							
							for(var h = 0; h < content[n].Content.length; h++)
							{
								switch(content[n].Content[h].Type)
								{
									case para_Run://*paraRun*
									{
										s = this._parseParaRun(content[n].Content[h], oNewItem, paraPr, s, row, c1, text);
										break;
									};
								};
							};
							break;
						};
					};
				};
				
			},
			
			_getAlignHorisontal: function(paraPr)
			{
				var result;
				var settings = paraPr.ParaPr;
				
				if(!settings)
					return;
				
				switch(settings.Jc)
				{
					case 0:
					{
						result = "right";
						break;
					}
					case 1:
					{
						result = "left";
						break;
					}
					case 2:
					{
						result = "center";
						break;
					}
					case 3:
					{
						result = null;
						break;
					}
				};
				
				return result;
			},
			
			getBackgroundColorTCell: function(elem)
			{
				var compiledPrCell, color;
				var backgroundColor = null;
				
				//TODO внутреннии таблицы без стиля - цвет фона белый
				var tableCell = this._getParentByTag(elem, c_oAscBoundsElementType.Cell);
				
				if(tableCell)
				{
					compiledPrCell = tableCell.elem.Get_CompiledPr();
					
					if(compiledPrCell && compiledPrCell.Shd.Value !== 1/*shd_Nil*/)
					{	
						var color = compiledPrCell.Shd.Color;
						backgroundColor = new AscCommonExcel.RgbColor(this.clipboard._getBinaryColor("rgb(" + color.r + "," + color.g + "," + color.b + ")"));
					};
				};
				
				return backgroundColor;
			},
			
			_getParentByTag: function(elem, tag)
			{
				var result;
				if(!elem)
					return null;
				
				if(elem.type == tag)
					result =  elem;
				else if(elem.parent)
					result =  this._getParentByTag(elem.parent, tag);
				else if(!elem.parent)
					result =  null;
					
				return result;
			},
			
			_parseParaRun: function(paraRun, oNewItem, paraPr, s, row, c1, text)
			{
				var paraRunContent = paraRun.Content;
				var aResult = this.aResult;
				var paragraphFontFamily = paraPr.TextPr.FontFamily.Name;
				var cloneNewItem, formatText;
			
				var cTextPr = paraRun.Get_CompiledPr();
				if(cTextPr && !(paraRunContent.length == 1 && paraRunContent[0] instanceof ParaEnd))//settings for text	
					formatText = this._getPrParaRun(paraPr, cTextPr);
				else if(!formatText)
					formatText = this._getPrParaRun(paraPr, cTextPr);
				
				//проходимся по контенту paraRun
				for(var pR = 0; pR < paraRunContent.length; pR++)
				{

					switch(paraRunContent[pR].Type)
					{
						case para_Text://*paraText*
						{
							text += String.fromCharCode(paraRunContent[pR].Value);
							break;
						};
						
						case para_Space://*paraSpace*
						{
							text += " ";
							break;
						};
						
						case para_Tab://*paraEnd / paraTab*
						{
							//if(!oNewItem.length)
							//{
								this.fontsNew[paragraphFontFamily] = 1;
								
								oNewItem.push(formatText);
							//}
							
							if(text !== null)
								oNewItem[oNewItem.length - 1].text = text;
							
							cloneNewItem  = this._getCloneNewItem(oNewItem);
							
							//переходим в следующую ячейку
							if(typeof aResult[row + this.maxLengthRowCount][s + c1] == "object")
								aResult[row + this.maxLengthRowCount][s + c1][aResult[row + this.maxLengthRowCount][s + c1].length] = cloneNewItem;
							else
							{
								aResult[row + this.maxLengthRowCount][s + c1] = [];
								aResult[row + this.maxLengthRowCount][s + c1][0] = cloneNewItem;
							}
								
							text = "";
							oNewItem = [];
							s++;
							break;
						};
						
						case para_Drawing:
						{
							if(!aResult.addImagesFromWord)
								aResult.addImagesFromWord = [];
							aResult.addImagesFromWord[aResult.addImagesFromWord.length] = {image: paraRunContent[pR], col: s + c1, row: row};
							
							if(null === this.isUsuallyPutImages)
								this._addImageToMap(paraRunContent[pR]);
						};
						
						case para_End:
						{	
							if(typeof aResult[row][s + c1] == "object")
								aResult[row][s + c1][aResult[row][s + c1].length] = oNewItem;
							else
							{
								aResult[row][s + c1] = [];
								aResult[row][s + c1][0] = oNewItem;
							}
							
							var checkMaxTextLength = this.clipboard._checkMaxTextLength(this.aResult, row + this.maxLengthRowCount, s + c1);
							if(checkMaxTextLength)
							{	
								aResult = checkMaxTextLength.aResult;
								this.maxLengthRowCount += checkMaxTextLength.r - row;
							}
						};
					}
				};
				
				if(text != "")
				{	
					this.fontsNew[paragraphFontFamily] = 1;
					
					oNewItem.push(formatText);
					
					
					if(text !== null)
						oNewItem[oNewItem.length - 1].text = text;
						
					cloneNewItem  = this._getCloneNewItem(oNewItem);
					
					text = "";
				};
				
				return s;
			},
			
			_addImageToMap: function(paraDrawing)
			{
				var aResult = this.aResult;
				if(!aResult._aPastedImages)
					aResult._aPastedImages = [];
				if(!aResult._images)
					aResult._images = [];
				
				var oGraphicObj = paraDrawing.GraphicObj;
				if(!oGraphicObj || (oGraphicObj && !oGraphicObj.blipFill) || (oGraphicObj && oGraphicObj.blipFill && !oGraphicObj.blipFill.RasterImageId))
					return;
				
				var sImageUrl = oGraphicObj.blipFill.RasterImageId;
				aResult._aPastedImages[aResult._aPastedImages.length] = new AscCommon.CBuilderImages(oGraphicObj.blipFill, sImageUrl, oGraphicObj, oGraphicObj.spPr, null);
				aResult._images[aResult._images.length] = sImageUrl;
			},
			
			_getAllNumberingText: function(Lvl, numberingText)
			{
				var preSpace, beetweenSpace, result;
				if(Lvl == 0)
					preSpace = "     ";
				else if(Lvl == 1)
					preSpace = "          ";
				else if(Lvl >= 2)
					preSpace = "               ";
				
				var beetweenSpace =  "  ";	
				
				result = preSpace + numberingText + beetweenSpace;
				
				return result;
			},
			
			_parseNumbering: function(paragraph)
			{
				var Pr = paragraph.Get_CompiledPr();
				
				if ( paragraph.Numbering )
				{
					var NumberingItem = paragraph.Numbering;
					if ( para_Numbering === NumberingItem.Type )
					{
						var NumPr = Pr.ParaPr.NumPr;
						if ( undefined === NumPr || undefined === NumPr.NumId || 0 === NumPr.NumId || "0" === NumPr.NumId )
						{
							// Ничего не делаем
						}
						else
						{
							var Numbering = paragraph.Parent.Get_Numbering();
							var NumLvl    = Numbering.Get_AbstractNum( NumPr.NumId ).Lvl[NumPr.Lvl];
							var NumSuff   = NumLvl.Suff;
							var NumJc     = NumLvl.Jc;
							var NumTextPr = paragraph.Get_CompiledPr2(false).TextPr.Copy();

							// Word не рисует подчеркивание у символа списка, если оно пришло из настроек для
							// символа параграфа.

							var TextPr_temp = paragraph.TextPr.Value.Copy();
							TextPr_temp.Underline = undefined;

							NumTextPr.Merge( TextPr_temp );
							NumTextPr.Merge( NumLvl.TextPr );

							/*var X_start = X;

							if ( align_Right === NumJc )
								X_start = X - NumberingItem.WidthNum;
							else if ( align_Center === NumJc )
								X_start = X - NumberingItem.WidthNum / 2;

							NumTextPr.Unifill.check(PDSE.Theme, PDSE.ColorMap);
							var RGBA = NumTextPr.Unifill.getRGBAColor();
							if ( true === NumTextPr.Color.Auto )
								pGraphics.b_color1( AutoColor.r, AutoColor.g, AutoColor.b, 255);
							else
								pGraphics.b_color1(RGBA.R, RGBA.G, RGBA.B, 255 );*/

							// Рисуется только сам символ нумерации
							
							var oNumPr = paragraph.Numbering_Get();
							var LvlPr, Lvl;
							if(oNumPr != null)
							{
								var aNum = paragraph.Parent.Numbering.Get_AbstractNum( oNumPr.NumId );
								if(null != aNum)
								{
									LvlPr = aNum.Lvl[oNumPr.Lvl];
									Lvl = oNumPr.Lvl;
								};
							};
							

							var NumInfo = paragraph.Parent.Internal_GetNumInfo(paragraph.Id, NumPr);
							
							return this._getNumberingText( NumPr.Lvl, NumInfo, NumTextPr, null, LvlPr );
						}
					}
				}
			},
			
			
			 _getNumberingText : function(Lvl, NumInfo, NumTextPr, Theme, LvlPr)
			{
				var Text = LvlPr.LvlText;
				
				var Char = "";
				//Context.SetTextPr( NumTextPr, Theme );
				//Context.SetFontSlot( fontslot_ASCII );
				//g_oTextMeasurer.SetTextPr( NumTextPr, Theme );
				//g_oTextMeasurer.SetFontSlot( fontslot_ASCII );

				for ( var Index = 0; Index < Text.length; Index++ )
				{
					switch( Text[Index].Type )
					{
						case numbering_lvltext_Text:
						{
							var Hint = NumTextPr.RFonts.Hint;
							var bCS  = NumTextPr.CS;
							var bRTL = NumTextPr.RTL;
							var lcid = NumTextPr.Lang.EastAsia;

							var FontSlot = g_font_detector.Get_FontClass( Text[Index].Value.charCodeAt(0), Hint, lcid, bCS, bRTL );
							
							Char += Text[Index].Value;
							//Context.SetFontSlot( FontSlot );
							//g_oTextMeasurer.SetFontSlot( FontSlot );

							//Context.FillText( X, Y, Text[Index].Value );
							//X += g_oTextMeasurer.Measure( Text[Index].Value ).Width;

							break;
						}
						case numbering_lvltext_Num:
						{
							//Context.SetFontSlot( fontslot_ASCII );
							//g_oTextMeasurer.SetFontSlot( fontslot_ASCII );

							var CurLvl = Text[Index].Value;
							switch( LvlPr.Format )
							{
								case numbering_numfmt_Bullet:
								{
									break;
								}

								case numbering_numfmt_Decimal:
								{
									if ( CurLvl < NumInfo.length )
									{
										var T = "" + ( LvlPr.Start - 1 + NumInfo[CurLvl] );
										for ( var Index2 = 0; Index2 < T.length; Index2++ )
										{
											Char += T.charAt(Index2);
											//Context.FillText( X, Y, Char );
											//X += g_oTextMeasurer.Measure( Char ).Width;
										}
									}
									break;
								}

								case numbering_numfmt_DecimalZero:
								{
									if ( CurLvl < NumInfo.length )
									{
										var T = "" + ( LvlPr.Start - 1 + NumInfo[CurLvl] );

										if ( 1 === T.length )
										{
											//Context.FillText( X, Y, '0' );
											//X += g_oTextMeasurer.Measure( '0' ).Width;

											var Char = T.charAt(0);
											//Context.FillText( X, Y, Char );
											//X += g_oTextMeasurer.Measure( Char ).Width;
										}
										else
										{
											for ( var Index2 = 0; Index2 < T.length; Index2++ )
											{
												Char += T.charAt(Index2);
												//Context.FillText( X, Y, Char );
												//X += g_oTextMeasurer.Measure( Char ).Width;
											}
										}
									}
									break;
								}

								case numbering_numfmt_LowerLetter:
								case numbering_numfmt_UpperLetter:
								{
									if ( CurLvl < NumInfo.length )
									{
										// Формат: a,..,z,aa,..,zz,aaa,...,zzz,...
										var Num = LvlPr.Start - 1 + NumInfo[CurLvl] - 1;

										var Count = (Num - Num % 26) / 26;
										var Ost   = Num % 26;

										var T = "";

										var Letter;
										if ( numbering_numfmt_LowerLetter === LvlPr.Format )
											Letter = String.fromCharCode( Ost + 97 );
										else
											Letter = String.fromCharCode( Ost + 65 );

										for ( var Index2 = 0; Index2 < Count + 1; Index2++ )
											T += Letter;

										for ( var Index2 = 0; Index2 < T.length; Index2++ )
										{
											Char += T.charAt(Index2);
											//Context.FillText( X, Y, Char );
											//X += g_oTextMeasurer.Measure( Char ).Width;
										}
									}
									break;
								}

								case numbering_numfmt_LowerRoman:
								case numbering_numfmt_UpperRoman:
								{
									if ( CurLvl < NumInfo.length )
									{
										var Num = LvlPr.Start - 1 + NumInfo[CurLvl];

										// Переводим число Num в римскую систему исчисления
										var Rims;

										if ( numbering_numfmt_LowerRoman === LvlPr.Format )
											Rims = [  'm', 'cm', 'd', 'cd', 'c', 'xc', 'l', 'xl', 'x', 'ix', 'v', 'iv', 'i', ' '];
										else
											Rims = [  'M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I', ' '];

										var Vals = [ 1000,  900, 500,  400, 100,   90,  50,   40,  10,    9,   5,    4,   1,   0];

										var T = "";
										var Index2 = 0;
										while ( Num > 0 )
										{
											while ( Vals[Index2] <= Num )
											{
												T   += Rims[Index2];
												Num -= Vals[Index2];
											}

											Index2++;

											if ( Index2 >= Rims.length )
												break;
										}

										for ( var Index2 = 0; Index2 < T.length; Index2++ )
										{
											Char += T.charAt(Index2);
											//Context.FillText( X, Y, Char );
											//X += g_oTextMeasurer.Measure( T.charAt(Index2) ).Width;
										}
									}
									break;
								}
							}

							break;
						}
					}
				}
				return Char;
			},
			
			
			_getPrParaRun: function(paraPr, cTextPr)
			{
				var formatText, fontFamily, colorText;
				
				var paragraphFontSize = paraPr.TextPr.FontSize;
				var paragraphFontFamily = paraPr.TextPr && paraPr.TextPr.FontFamily ? paraPr.TextPr.FontFamily.Name : "Arial";
				var paragraphBold = paraPr.TextPr.Bold;
				var paragraphItalic = paraPr.TextPr.Italic;
				var paragraphStrikeout = paraPr.TextPr.Strikeout;
				var paragraphUnderline = paraPr.TextPr.Underline ? Asc.EUnderline.underlineSingle : Asc.EUnderline.underlineNone;
				var paragraphVertAlign = "none";
				if(paraPr.TextPr.VertAlign == 1)
					paragraphVertAlign = "superscript";
				else if(paraPr.TextPr.VertAlign == 2)
					paragraphVertAlign = "subscript";

				var colorParagraph = new AscCommonExcel.RgbColor(this.clipboard._getBinaryColor("rgb(" + paraPr.TextPr.Color.r + "," + paraPr.TextPr.Color.g + "," + paraPr.TextPr.Color.b + ")"));
				
				if(cTextPr.Color)
					colorText = new AscCommonExcel.RgbColor(this.clipboard._getBinaryColor("rgb(" + cTextPr.Color.r + "," + cTextPr.Color.g + "," + cTextPr.Color.b + ")"));
				else
					colorText = null;
				
				fontFamily = cTextPr.fontFamily ? cTextPr.fontFamily.Name : cTextPr.RFonts.CS ? cTextPr.RFonts.CS.Name : paragraphFontFamily;
				this.fontsNew[fontFamily] = 1;
				
				var verticalAlign;
				if(cTextPr.VertAlign == 2)
					verticalAlign = "subscript";
				else if(cTextPr.VertAlign == 1)
					verticalAlign = "superscript";
					
				formatText = {
					format: {
						fn: fontFamily,
						fs: cTextPr.FontSize ? cTextPr.FontSize : paragraphFontSize,
						c: colorText ? colorText : colorParagraph,
						b: cTextPr.Bold ? cTextPr.Bold : paragraphBold,
						i: cTextPr.Italic ? cTextPr.Italic : paragraphItalic,
						u: cTextPr.Underline ? Asc.EUnderline.underlineSingle : paragraphUnderline,
						s: cTextPr.Strikeout ? cTextPr.Strikeout : cTextPr.DStrikeout ? cTextPr.DStrikeout : paragraphStrikeout,
						va: verticalAlign ? verticalAlign : paragraphVertAlign
					}
				};
				
				return formatText;
			},
			
			_getCloneNewItem: function(oNewItem)
			{
				var result = [];
				
				for(var item = 0; item < oNewItem.length; item++)
				{
					result[item] = {text: oNewItem[item].text, format: oNewItem[item].format};
				};
				
				result.borders = oNewItem.borders;
				result.rowSpan = oNewItem.rowSpan;
				result.colSpan = oNewItem.colSpan;
				result.toolTip = result.toolTip;
				result.bc = oNewItem.bc;
				result.hyperLink = oNewItem.hyperLink;
				
				return result;
			}
		};
		
		var c_oAscBoundsElementType = {
			Content		: 0,
			Paragraph	: 1,
			Table		: 2,
			Row			: 3,
			Cell		: 4
		};
		function DocumentContentBoundsElement(elem, type, parent){
			this.elem = elem;
			this.type = type;
			this.parent = parent;
			this.children = [];
			
			this.left = 0;
			this.top = 0;
			this.width = 0;
			this.height = 0;
		}
		function DocumentContentBounds(){
		};
		DocumentContentBounds.prototype = {
			
			constructor: DocumentContentBounds,
			
			getBounds: function(nLeft, nTop, aDocumentContent){
				//в первный проход заполняем размеры
				//и могут заноситься относительные сдвиги при небходимости
				var oRes = this._getMeasure(aDocumentContent, null);
				//заполняем абсолютные сдвиги
				this._getOffset(nLeft, nTop, oRes);
				return oRes;
			},
			_getOffset: function(nLeft, nTop, elem){
				elem.left += nLeft;
				elem.top += nTop;
				var nCurLeft = elem.left;
				var nCurTop = elem.top;
				var bIsRow = elem.elem instanceof CTableRow;
				for(var i = 0, length = elem.children.length; i < length; i++)
				{
					var child = elem.children[i];
					this._getOffset(nCurLeft, nCurTop, child);
					if(bIsRow)
						nCurLeft += child.width;
					else
						nCurTop += child.height;
				}
			},
			_getMeasure: function(aDocumentContent, oParent){
				var oRes = new DocumentContentBoundsElement(aDocumentContent, c_oAscBoundsElementType.Content, oParent);
				for(var i = 0, length = aDocumentContent.length; i < length; i++)
				{
					var elem = aDocumentContent[i];
					var oNewElem = null;
					if(type_Paragraph == elem.GetType())
					{
						oNewElem = new DocumentContentBoundsElement(elem, c_oAscBoundsElementType.Paragraph, oRes);
						oNewElem.width = 1;
						oNewElem.height = 1;
					}
					else if(type_Table == elem.GetType())
					{
						elem.ReIndexing(0);
						oNewElem = this._getTableMeasure(elem, oRes);
					}
					if(null != oNewElem)
					{
						oRes.children.push(oNewElem);
						if(oNewElem.width && oNewElem.width > oRes.width)
							oRes.width = oNewElem.width;
						oRes.height += oNewElem.height;
					}
				}
				return oRes;
			},
			_getTableMeasure: function(table, oParent){
				var oRes = new DocumentContentBoundsElement(table, c_oAscBoundsElementType.Table, oParent);
				//надо рассчитать сколько ячеек приходится на tableGrid, по умолчанию по одной
				//todo надо оптимизировать размер 
				var aGridWidth = [];
				for(var i = 0, length = table.TableGrid.length; i < length; i++)
					aGridWidth.push(1);
				//заполняем aGridWidth
				for(var i = 0, length = table.Content.length; i < length; i++)
				{
					var row = table.Content[i];
					var oNewElem = this._setRowGridWidth(row, oRes, aGridWidth);
					if(null != oNewElem)
						oRes.children.push(oNewElem);
				}
				var aSumGridWidth = [];
				var nTempSum = 0;
				for(var i = 0, length = aGridWidth.length; i < length + 1; i++)
				{
					aSumGridWidth[i] = nTempSum;
					var nCurValue = aGridWidth[i];
					if(nCurValue)
						nTempSum += nCurValue;
				}
				//заполняем размеры
				for(var i = 0, length = oRes.children.length; i < length; i++)
				{
					var rowWrapped = oRes.children[i];
					this._getRowMeasure(rowWrapped, aSumGridWidth);
					oRes.height += rowWrapped.height;
					//в left временно занесен относительный сдвиг
					if(rowWrapped.width + rowWrapped.left > oRes.width)
						oRes.width = rowWrapped.width + rowWrapped.left;
				}
				return oRes;
			},
			_setRowGridWidth: function(row, oParent, aGridWidth){
				var oRes = new DocumentContentBoundsElement(row, c_oAscBoundsElementType.Row, oParent);
				var nSumGrid = 0;
				var BeforeInfo = row.Get_Before();
				if(BeforeInfo && BeforeInfo.GridBefore)
					nSumGrid += BeforeInfo.GridBefore;
				for(var i = 0, length = row.Content.length; i < length; i++)
				{
					var cell = row.Content[i];
					var oNewCell = new DocumentContentBoundsElement(cell, c_oAscBoundsElementType.Cell, oRes);
					oRes.children.push(oNewCell);
					var oNewElem = this._getMeasure(cell.Content.Content, oNewCell);
					oNewCell.children.push(oNewElem);
					oNewCell.width = oNewElem.width;
					oNewCell.height = oNewElem.height;
					if(oNewCell.height > oRes.height)
						oRes.height = oNewCell.height;
					var nCellGrid = cell.Get_GridSpan();
					if(oNewElem.width > nCellGrid)
					{
						var nFirstGridWidth = oNewElem.width - nCellGrid + 1;
						var nCurValue = aGridWidth[nSumGrid];
						if(null != nCurValue && nCurValue < nFirstGridWidth)
							aGridWidth[nSumGrid] = nFirstGridWidth;
					}
					nSumGrid += nCellGrid;
				}
				return oRes;
			},
			_getRowMeasure: function(rowWrapped, aSumGridWidth){
				var nSumGrid = 0;
				var BeforeInfo = rowWrapped.elem.Get_Before();
				if(BeforeInfo && BeforeInfo.GridBefore)
				{
					//временно заносим относительный сдвиг
					rowWrapped.left = aSumGridWidth[nSumGrid + BeforeInfo.GridBefore] - aSumGridWidth[nSumGrid];
					nSumGrid += BeforeInfo.GridBefore;
				}
				for(var i = 0, length = rowWrapped.children.length; i < length; i++)
				{
					var cellWrapped = rowWrapped.children[i];
					var nCellGrid = cellWrapped.elem.Get_GridSpan();
					cellWrapped.width = aSumGridWidth[nSumGrid + nCellGrid] - aSumGridWidth[nSumGrid];
					//выравниваем высоту ячеек по-максимому
					cellWrapped.height = rowWrapped.height;
					rowWrapped.width += cellWrapped.width;
					nSumGrid += nCellGrid;
				}
			}
		};

		
		//пользуется класс из word, для копирования внутреннего контента автофигуры
		function CopyShapeContent(api, ElemToSelect)
		{
			this.Ul = document.createElement( "ul" );
			this.Ol = document.createElement( "ol" );
			this.Para = null;
			this.bOccurEndPar = null;
			this.oCurHyperlink = null;
			this.oCurHyperlinkElem = null;
			this.oBinaryFileWriter = new AscCommon.CBinaryFileWriter();
		}
		CopyShapeContent.prototype =
		{
			constructor: CopyShapeContent,
			
			RGBToCSS : function(rgb)
			{
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
			
			CommitList : function(oDomTarget)
			{
				if(this.Ul.childNodes.length > 0)
				{
					this.Ul.style.paddingLeft = "40px";
					oDomTarget.appendChild( this.Ul );
					this.Ul = document.createElement( "ul" );
				}
				if(this.Ol.childNodes.length > 0)
				{
					this.Ol.style.paddingLeft = "40px";
					oDomTarget.appendChild( this.Ol );
					this.Ol = document.createElement( "ol" );
				}
			},
			
			Commit_pPr : function(Item)
			{
				//pPr
				var apPr = [];
				var Def_pPr = this.oDocument.Styles.Default.ParaPr;
				var Item_pPr = Item.CompiledPr.Pr.ParaPr;
				if(Item_pPr)
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
							case AscCommon.align_Left: apPr.push("text-align:left");break;
							case AscCommon.align_Center: apPr.push("text-align:center");break;
							case AscCommon.align_Right: apPr.push("text-align:right");break;
							case AscCommon.align_Justify: apPr.push("text-align:justify");break;
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
					//��� ������� � word ����� ����� ��� �������� ������������ ������
					//if(Def_pPr.Spacing.Before != Item_pPr.Spacing.Before)
					apPr.push("margin-top:" + (Item_pPr.Spacing.Before * g_dKoef_mm_to_pt) + "pt");
					//if(Def_pPr.Spacing.After != Item_pPr.Spacing.After)
					apPr.push("margin-bottom:" + (Item_pPr.Spacing.After * g_dKoef_mm_to_pt) + "pt");
					//Shd
					if(Def_pPr.Shd.Value != Item_pPr.Shd.Value)
						apPr.push("background-color:" + this.RGBToCSS(Item_pPr.Shd.Color));
					//Tabs
					if(Item_pPr.Tabs.Get_Count() > 0)
					{
						var sRes = "";
						//tab-stops:1.0cm 3.0cm 5.0cm
						for(var i = 0, length = Item_pPr.Tabs.Get_Count(); i < length; i++)
						{
							if(0 != i)
								sRes += " ";
							sRes += Item_pPr.Tabs.Get(i).Pos / 10 + "cm";
						}
						apPr.push("tab-stops:" + sRes);
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
					this.Para.setAttribute("style", apPr.join(';'));
			},
			
			parse_para_TextPr : function(Value)
			{
				var aProp = [];
				var aTagStart = [];
				var aTagEnd = [];
				var sRes = "";
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
					//if (!this.api.DocumentReaderMode)
						aProp.push("font-size:" + Value.FontSize + "pt");//font-size � pt ��� ��������� ������� � mm
					/*else
						aProp.push("font-size:" + this.api.DocumentReaderMode.CorrectFontSize(Value.FontSize));*/
				}
				if (true == Value.Bold) {
					aTagStart.push("<b>");
					aTagEnd.push("</b>");
				}
				if (true == Value.Italic) {
					aTagStart.push("<i>");
					aTagEnd.push("</i>");
				}
				if (true == Value.Strikeout) {
					aTagStart.push("<strike>");
					aTagEnd.push("</strike>");
				}
				if (true == Value.Underline) {
					aTagStart.push("<u>");
					aTagEnd.push("</u>");
				}
				if (null != Value.HighLight && highlight_None != Value.HighLight)
					aProp.push("background-color:" + this.RGBToCSS(Value.HighLight));
				
				var color;
				if (null != Value.Unifill)
				{
					var Unifill = Value.Unifill.getRGBAColor();
					if(Unifill)
					{
						color = this.RGBToCSS(new CDocumentColor(Unifill.R, Unifill.G, Unifill.B));
						aProp.push("color:" + color);
						aProp.push("mso-style-textfill-fill-color:" + color);
					}
				}
				else if (null != Value.Color) 
				{
					color = this.RGBToCSS(Value.Color);
					aProp.push("color:" + color);
					aProp.push("mso-style-textfill-fill-color:" + color);
				}
				if (null != Value.VertAlign) {
					if(AscCommon.vertalign_SuperScript == Value.VertAlign)
						aProp.push("vertical-align:super");
					else if(AscCommon.vertalign_SubScript == Value.VertAlign)
						aProp.push("vertical-align:sub");
				}

				return { style: aProp.join(';'), tagstart: aTagStart.join(''), tagend: aTagEnd.join('') };
			},
			
			ParseItem : function(ParaItem)
			{
				var sRes = "";
				switch ( ParaItem.Type )
				{
					case para_Text:
						//���������� �����������
						var sValue = String.fromCharCode(ParaItem.Value);
						if(sValue)
							sRes += CopyPasteCorrectString(sValue);
						break;
					case para_Space:    sRes += " "; break;
					case para_Tab:        sRes += "<span style='mso-tab-count:1'>    </span>"; break;
					case para_NewLine:
						if( break_Page == ParaItem.BreakType)
						{
							//todo ��������� ���� �������� � ������ �����
							sRes += "<br clear=\"all\" style=\"mso-special-character:line-break;page-break-before:always;\" />";
						}
						else
							sRes += "<br style=\"mso-special-character:line-break;\" />";
						break;
					//������� ������� ����� ��������� ������ �� ���������� ��������
					case para_End:        this.bOccurEndPar = true; break;
					case para_Drawing:
						var oGraphicObj = ParaItem.GraphicObj;
						var sSrc = oGraphicObj.getBase64Img();
						if(sSrc.length > 0)
						{
							sRes += "<img style=\"max-width:100%;\" width=\""+Math.round(ParaItem.Extent.W * g_dKoef_mm_to_pix)+"\" height=\""+Math.round(ParaItem.Extent.H * g_dKoef_mm_to_pix)+"\" src=\""+sSrc+"\" />";
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
				}
				return sRes;
			},
			
			CopyRun: function (Item, bUseSelection) {
				var sRes = "";
				var ParaStart = 0;
				var ParaEnd = Item.Content.length;
				if (true == bUseSelection) {
					ParaStart = Item.Selection.StartPos;
					ParaEnd = Item.Selection.EndPos;
					if (ParaStart > ParaEnd) {
						var Temp2 = ParaEnd;
						ParaEnd = ParaStart;
						ParaStart = Temp2;
					}
				}
				for (var i = ParaStart; i < ParaEnd; i++)
					sRes += this.ParseItem(Item.Content[i]);
				return sRes;
			},
			
			CopyRunContent: function (Container, bUseSelection) {
				var sRes = "";
				var ParaStart = 0;
				var ParaEnd = Container.Content.length - 1;
				if (true == bUseSelection) {
					ParaStart = Container.Selection.StartPos;
					ParaEnd = Container.Selection.EndPos;
					if (ParaStart > ParaEnd) {
						var Temp2 = ParaEnd;
						ParaEnd = ParaStart;
						ParaStart = Temp2;
					}
				}

				for (var i = ParaStart; i <= ParaEnd; i++) {
					var item = Container.Content[i];
					if (para_Run == item.Type) {
						var sRunContent = this.CopyRun(item, bUseSelection);
						if(sRunContent)
						{
							sRes += "<span";
							var oStyle = this.parse_para_TextPr(item.CompiledPr);
							if (oStyle && oStyle.style)
								sRes += " style=\"" + oStyle.style + "\"";
							sRes += ">";
							if (oStyle.tagstart)
								sRes += oStyle.tagstart;
							sRes += sRunContent;
							if (oStyle.tagend)
								sRes += oStyle.tagend;
							sRes += "</span>";
						}
					}
					else if (para_Hyperlink == item.Type) {
						sRes += "<a";
						var sValue = item.Get_Value();
						var sToolTip = item.Get_ToolTip();
						if (null != sValue && "" != sValue)
							sRes += " href=\"" + CopyPasteCorrectString(sValue) + "\"";
						if (null != sToolTip && "" != sToolTip)
							sRes += " title=\"" + CopyPasteCorrectString(sToolTip) + "\"";
						sRes += ">";
						sRes += this.CopyRunContent(item);
						sRes += "</a>";
					}
				}
				return sRes;
			},
			
			CopyParagraph : function(oDomTarget, Item, bLast, bUseSelection, aDocumentContent, nDocumentContentIndex)
			{
				var oDocument = this.oDocument;
				this.Para = null;
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
							this.Para = document.createElement( "h" + nLevel );
					}
				}
				if(null == this.Para)
					this.Para = document.createElement( "p" );

				this.bOccurEndPar = false;
				var oNumPr;
				var bIsNullNumPr = false;
			
				oNumPr = Item.Numbering_Get();
				bIsNullNumPr = (null == oNumPr || 0 == oNumPr.NumId);
				
				
				if(bIsNullNumPr)
					this.CommitList(oDomTarget);
				else
				{
					var bBullet = false;
					var sListStyle = "";

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
					

					var Li = document.createElement( "li" );
					Li.setAttribute("style", "list-style-type: " + sListStyle);
					Li.appendChild( this.Para );
					if(bBullet)
						this.Ul.appendChild( Li );
					else
						this.Ol.appendChild( Li );
				}
				//pPr
				//this.Commit_pPr(Item);

				this.Para.innerHTML = this.CopyRunContent(Item, bUseSelection);

				if(bLast && false == this.bOccurEndPar)
				{
					if(false == bIsNullNumPr)
					{
						//������ �������� � ������. ������� ������� �� ������. ���������� ����� ��� span
						var li = this.Para.parentNode;
						var ul = li.parentNode;
						ul.removeChild(li);
						this.CommitList(oDomTarget);
					}
					for(var i = 0; i < this.Para.childNodes.length; i++)
						oDomTarget.appendChild( this.Para.childNodes[i].cloneNode(true) );
				}
				else
				{
					//����� ��������� ������ ���������
					if(this.Para.childNodes.length == 0)
						this.Para.appendChild( document.createTextNode( '\xa0' ) );
					if(bIsNullNumPr)
						oDomTarget.appendChild( this.Para );
				}
			},
			
			CopyDocument : function(oDomTarget, oDocument, bUseSelection)
			{
				var Start = 0;
				var End = 0;
				if(bUseSelection)
				{
					if ( true === oDocument.Selection.Use)
					{
						if ( selectionflag_DrawingObject === oDocument.Selection.Flag )
						{
							this.Para = document.createElement("p");
							this.Para.innerHTML = this.ParseItem(oDocument.Selection.Data.DrawingObject);

							for(var i = 0; i < this.Para.childNodes.length; i++)
								this.ElemToSelect.appendChild( this.Para.childNodes[i].cloneNode(true) );
						}
						else
						{
							Start = oDocument.Selection.StartPos;
							End = oDocument.Selection.EndPos;
							if ( Start > End )
							{
								var Temp = End;
								End = Start;
								Start = Temp;
							}
						}
					}
				}
				else
				{
					Start = 0;
					End = oDocument.Content.length - 1;
				}
				// HtmlText
				for ( var Index = Start; Index <= End; Index++ )
				{
					var Item = oDocument.Content[Index];

					if ( type_Paragraph === Item.GetType() )
					{
						//todo ����� ������ ��� �������� ������ ���� Index == End
						this.oBinaryFileWriter.WriteParagraph(Item);
						this.CopyParagraph(oDomTarget, Item, Index == End, bUseSelection, oDocument.Content, Index);
					}
				}
				this.CommitList(oDomTarget);
			}

		};

		//---------------------------------------------------------export---------------------------------------------------
		window['AscCommonExcel'] = window['AscCommonExcel'] || {};
		window["AscCommonExcel"].Clipboard = Clipboard;
	}
)(jQuery, window);
