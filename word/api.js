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

(function(window, document)
{

	// Import
	var g_fontApplication = null;

	var c_oAscAdvancedOptionsAction      = AscCommon.c_oAscAdvancedOptionsAction;
	var DownloadType                     = AscCommon.DownloadType;
	var c_oAscFormatPainterState         = AscCommon.c_oAscFormatPainterState;
	var locktype_None                    = AscCommon.locktype_None;
	var locktype_Mine                    = AscCommon.locktype_Mine;
	var locktype_Other                   = AscCommon.locktype_Other;
	var locktype_Other2                  = AscCommon.locktype_Other2;
	var locktype_Other3                  = AscCommon.locktype_Other3;
	var changestype_None                 = AscCommon.changestype_None;
	var changestype_Paragraph_Content    = AscCommon.changestype_Paragraph_Content;
	var changestype_Paragraph_Properties = AscCommon.changestype_Paragraph_Properties;
	var changestype_Table_Properties     = AscCommon.changestype_Table_Properties;
	var changestype_Table_RemoveCells    = AscCommon.changestype_Table_RemoveCells;
	var changestype_HdrFtr               = AscCommon.changestype_HdrFtr;
	var asc_CTextFontFamily              = AscCommon.asc_CTextFontFamily;
	var asc_CSelectedObject              = AscCommon.asc_CSelectedObject;
	var g_oDocumentUrls                  = AscCommon.g_oDocumentUrls;
	var sendCommand                      = AscCommon.sendCommand;
	var mapAscServerErrorToAscError      = AscCommon.mapAscServerErrorToAscError;
	var g_oIdCounter                     = AscCommon.g_oIdCounter;
	var g_oTableId                       = AscCommon.g_oTableId;
	var PasteElementsId                  = null;
	var global_mouseEvent                = null;
	var History                          = null;

	var c_oAscError                 = Asc.c_oAscError;
	var c_oAscFileType              = Asc.c_oAscFileType;
	var c_oAscAsyncAction           = Asc.c_oAscAsyncAction;
	var c_oAscAdvancedOptionsID     = Asc.c_oAscAdvancedOptionsID;
	var c_oAscFontRenderingModeType = Asc.c_oAscFontRenderingModeType;
	var c_oAscAsyncActionType       = Asc.c_oAscAsyncActionType;
	var c_oAscTypeSelectElement     = Asc.c_oAscTypeSelectElement;
	var c_oAscFill                  = Asc.c_oAscFill;
	var asc_CImgProperty            = Asc.asc_CImgProperty;
	var asc_CShapeFill              = Asc.asc_CShapeFill;
	var asc_CFillBlip               = Asc.asc_CFillBlip;

	function CAscSection()
	{
		this.PageWidth  = 0;
		this.PageHeight = 0;

		this.MarginLeft   = 0;
		this.MarginRight  = 0;
		this.MarginTop    = 0;
		this.MarginBottom = 0;
	}

	CAscSection.prototype.get_PageWidth    = function()
	{
		return this.PageWidth;
	};
	CAscSection.prototype.get_PageHeight   = function()
	{
		return this.PageHeight;
	};
	CAscSection.prototype.get_MarginLeft   = function()
	{
		return this.MarginLeft;
	};
	CAscSection.prototype.get_MarginRight  = function()
	{
		return this.MarginRight;
	};
	CAscSection.prototype.get_MarginTop    = function()
	{
		return this.MarginTop;
	};
	CAscSection.prototype.get_MarginBottom = function()
	{
		return this.MarginBottom;
	};

	function CHeaderProp(obj)
	{
		/*{
		 Type : hdrftr_Footer (hdrftr_Header),
		 Position : 12.5,
		 DifferentFirst : true/false,
		 DifferentEvenOdd : true/false,
		 }*/
		if (obj)
		{
			this.Type             = (undefined != obj.Type) ? obj.Type : null;
			this.Position         = (undefined != obj.Position) ? obj.Position : null;
			this.DifferentFirst   = (undefined != obj.DifferentFirst) ? obj.DifferentFirst : null;
			this.DifferentEvenOdd = (undefined != obj.DifferentEvenOdd) ? obj.DifferentEvenOdd : null;
			this.LinkToPrevious   = (undefined != obj.LinkToPrevious) ? obj.LinkToPrevious : null;
			this.Locked           = (undefined != obj.Locked) ? obj.Locked : false;
		}
		else
		{
			this.Type             = AscCommon.hdrftr_Footer;
			this.Position         = 12.5;
			this.DifferentFirst   = false;
			this.DifferentEvenOdd = false;
			this.LinkToPrevious   = null;
			this.Locked           = false;
		}
	}

	CHeaderProp.prototype.get_Type             = function()
	{
		return this.Type;
	};
	CHeaderProp.prototype.put_Type             = function(v)
	{
		this.Type = v;
	};
	CHeaderProp.prototype.get_Position         = function()
	{
		return this.Position;
	};
	CHeaderProp.prototype.put_Position         = function(v)
	{
		this.Position = v;
	};
	CHeaderProp.prototype.get_DifferentFirst   = function()
	{
		return this.DifferentFirst;
	};
	CHeaderProp.prototype.put_DifferentFirst   = function(v)
	{
		this.DifferentFirst = v;
	};
	CHeaderProp.prototype.get_DifferentEvenOdd = function()
	{
		return this.DifferentEvenOdd;
	};
	CHeaderProp.prototype.put_DifferentEvenOdd = function(v)
	{
		this.DifferentEvenOdd = v;
	};
	CHeaderProp.prototype.get_LinkToPrevious   = function()
	{
		return this.LinkToPrevious;
	};
	CHeaderProp.prototype.get_Locked           = function()
	{
		return this.Locked;
	};

	var DocumentPageSize = new function()
	{
		this.oSizes    = [{name : "US Letter", w_mm : 215.9, h_mm : 279.4, w_tw : 12240, h_tw : 15840},
			{name : "US Legal", w_mm : 215.9, h_mm : 355.6, w_tw : 12240, h_tw : 20160},
			{name : "A4", w_mm : 210, h_mm : 297, w_tw : 11907, h_tw : 16839},
			{name : "A5", w_mm : 148.1, h_mm : 209.9, w_tw : 8391, h_tw : 11907},
			{name : "B5", w_mm : 176, h_mm : 250.1, w_tw : 9979, h_tw : 14175},
			{name : "Envelope #10", w_mm : 104.8, h_mm : 241.3, w_tw : 5940, h_tw : 13680},
			{name : "Envelope DL", w_mm : 110.1, h_mm : 220.1, w_tw : 6237, h_tw : 12474},
			{name : "Tabloid", w_mm : 279.4, h_mm : 431.7, w_tw : 15842, h_tw : 24477},
			{name : "A3", w_mm : 297, h_mm : 420.1, w_tw : 16840, h_tw : 23820},
			{name : "Tabloid Oversize", w_mm : 304.8, h_mm : 457.1, w_tw : 17282, h_tw : 25918},
			{name : "ROC 16K", w_mm : 196.8, h_mm : 273, w_tw : 11164, h_tw : 15485},
			{name : "Envelope Coukei 3", w_mm : 119.9, h_mm : 234.9, w_tw : 6798, h_tw : 13319},
			{name : "Super B/A3", w_mm : 330.2, h_mm : 482.5, w_tw : 18722, h_tw : 27358}
		];
		this.sizeEpsMM = 0.5;
		this.getSize   = function(widthMm, heightMm)
		{
			for (var index in this.oSizes)
			{
				var item = this.oSizes[index];
				if (Math.abs(widthMm - item.w_mm) < this.sizeEpsMM && Math.abs(heightMm - item.h_mm) < this.sizeEpsMM)
					return item;
			}
			return {w_mm : widthMm, h_mm : heightMm};
		};
	};

	function CMailMergeSendData(obj)
	{
		if (obj)
		{
			if (typeof obj.from != 'undefined')
			{
				this["from"] = obj.from;
			}
			if (typeof obj.to != 'undefined')
			{
				this["to"] = obj.to;
			}
			if (typeof obj.subject != 'undefined')
			{
				this["subject"] = obj.subject;
			}
			if (typeof obj.mailFormat != 'undefined')
			{
				this["mailFormat"] = obj.mailFormat;
			}
			if (typeof obj.fileName != 'undefined')
			{
				this["fileName"] = obj.fileName;
			}
			if (typeof obj.message != 'undefined')
			{
				this["message"] = obj.message;
			}
			if (typeof obj.recordFrom != 'undefined')
			{
				this["recordFrom"] = obj.recordFrom;
			}
			if (typeof obj.recordTo != 'undefined')
			{
				this["recordTo"] = obj.recordTo;
			}
		}
		else
		{
			this["from"]        = null;
			this["to"]          = null;
			this["subject"]     = null;
			this["mailFormat"]  = null;
			this["fileName"]    = null;
			this["message"]     = null;
			this["recordFrom"]  = null;
			this["recordTo"]    = null;
			this["recordCount"] = null;
			this["userId"]      = null;
		}
	}

	CMailMergeSendData.prototype.get_From        = function()
	{
		return this["from"]
	};
	CMailMergeSendData.prototype.put_From        = function(v)
	{
		this["from"] = v;
	};
	CMailMergeSendData.prototype.get_To          = function()
	{
		return this["to"]
	};
	CMailMergeSendData.prototype.put_To          = function(v)
	{
		this["to"] = v;
	};
	CMailMergeSendData.prototype.get_Subject     = function()
	{
		return this["subject"]
	};
	CMailMergeSendData.prototype.put_Subject     = function(v)
	{
		this["subject"] = v;
	};
	CMailMergeSendData.prototype.get_MailFormat  = function()
	{
		return this["mailFormat"]
	};
	CMailMergeSendData.prototype.put_MailFormat  = function(v)
	{
		this["mailFormat"] = v;
	};
	CMailMergeSendData.prototype.get_FileName    = function()
	{
		return this["fileName"]
	};
	CMailMergeSendData.prototype.put_FileName    = function(v)
	{
		this["fileName"] = v;
	};
	CMailMergeSendData.prototype.get_Message     = function()
	{
		return this["message"]
	};
	CMailMergeSendData.prototype.put_Message     = function(v)
	{
		this["message"] = v;
	};
	CMailMergeSendData.prototype.get_RecordFrom  = function()
	{
		return this["recordFrom"]
	};
	CMailMergeSendData.prototype.put_RecordFrom  = function(v)
	{
		this["recordFrom"] = v;
	};
	CMailMergeSendData.prototype.get_RecordTo    = function()
	{
		return this["recordTo"]
	};
	CMailMergeSendData.prototype.put_RecordTo    = function(v)
	{
		this["recordTo"] = v;
	};
	CMailMergeSendData.prototype.get_RecordCount = function()
	{
		return this["recordCount"]
	};
	CMailMergeSendData.prototype.put_RecordCount = function(v)
	{
		this["recordCount"] = v;
	};
	CMailMergeSendData.prototype.get_UserId      = function()
	{
		return this["userId"]
	};
	CMailMergeSendData.prototype.put_UserId      = function(v)
	{
		this["userId"] = v;
	};

	function CAscFootnotePr(obj)
	{
		this.NumRestart = undefined;
		this.NumFormat  = undefined;
		this.NumStart   = undefined;
		this.Pos        = undefined;

		if (obj)
		{
			this.NumRestart = obj.NumRestart;
			this.NumFormat  = obj.NumFormat;
			this.NumStart   = obj.NumStart;
			this.Pos        = obj.Pos;
		}
	}
	CAscFootnotePr.prototype.get_Pos = function()
	{
		return this.Pos;
	};
	CAscFootnotePr.prototype.put_Pos = function(v)
	{
		this.Pos = v;
	};
	CAscFootnotePr.prototype.get_NumStart = function()
	{
		return this.NumStart;
	};
	CAscFootnotePr.prototype.put_NumStart = function(v)
	{
		this.NumStart = v;
	};
	CAscFootnotePr.prototype.get_NumFormat = function()
	{
		return this.NumFormat;
	};
	CAscFootnotePr.prototype.put_NumFormat = function(v)
	{
		this.NumFormat = v;
	};
	CAscFootnotePr.prototype.get_NumRestart = function()
	{
		return this.NumRestart;
	};
	CAscFootnotePr.prototype.put_NumRestart = function(v)
	{
		this.NumRestart = v;
	};

	// пользоваться так:
	// подрубить его последним из скриптов к страничке
	// и вызвать, после подгрузки (конец метода OnInit <- Drawing/HtmlPage.js)
	// var _api = new asc_docs_api();
	// _api.init(oWordControl);

	/**
	 *
	 * @param config
	 * @constructor
	 * @extends {AscCommon.baseEditorsApi}
	 */
	function asc_docs_api(config)
	{
		asc_docs_api.superclass.constructor.call(this, config, AscCommon.c_oEditorId.Word);

		if (window["AscDesktopEditor"])
		{
			window["AscDesktopEditor"]["CreateEditorApi"]();
		}

		/************ private!!! **************/
		this.WordControl = null;

		this.documentFormatSave = c_oAscFileType.DOCX;

		//todo убрать из native, copypaste, chart, loadfont
		this.InterfaceLocale = null;

		this.ShowParaMarks        = false;
		this.ShowSnapLines        = true;
		this.isAddSpaceBetweenPrg = false;
		this.isPageBreakBefore    = false;
		this.isKeepLinesTogether  = false;

		this.isPaintFormat              = c_oAscFormatPainterState.kOff;
		this.isMarkerFormat             = false;
		this.isStartAddShape            = false;
		this.addShapePreset             = "";
		this.isShowTableEmptyLine       = true;
		this.isShowTableEmptyLineAttack = false;

		this.isApplyChangesOnOpen        = false;
		this.isApplyChangesOnOpenEnabled = true;

		this.IsSpellCheckCurrentWord = false;

		this.mailMergeFileData = null;

		this.isCoMarksDraw  = false;
		this.tmpCoMarksDraw = false;
		this.tmpViewRulers  = null;
		this.tmpZoomType    = null;

		// Spell Checking
		this.SpellCheckApi      = (window["AscDesktopEditor"] === undefined) ? new AscCommon.CSpellCheckApi() : new CSpellCheckApi_desktop();
		this.isSpellCheckEnable = true;

		// это чтобы сразу показать ридер, без возможности вернуться в редактор/вьюер
		this.isOnlyReaderMode = false;

		/**************************************/

		this.bInit_word_control = false;
		this.isDocumentModify   = false;

		this.isImageChangeUrl      = false;
		this.isShapeImageChangeUrl = false;

		this.tmpFontRenderingMode = null;
		this.FontAsyncLoadType    = 0;
		this.FontAsyncLoadParam   = null;

		this.isPasteFonts_Images = false;
		this.isLoadNoCutFonts    = false;

		this.pasteCallback       = null;
		this.pasteImageMap       = null;
		this.EndActionLoadImages = 0;

		this.isSaveFonts_Images = false;
		this.saveImageMap       = null;

		this.isLoadImagesCustom = false;
		this.loadCustomImageMap = null;

		this.ServerImagesWaitComplete = false;

		this.DocumentOrientation = false;

		this.SelectedObjectsStack = [];

		this.nCurPointItemsLength = -1;
		this.isDocumentEditor     = true;

		this.CurrentTranslate = null;

		this.CollaborativeMarksShowType = c_oAscCollaborativeMarksShowType.All;

		// объекты, нужные для отправки в тулбар (шрифты, стили)
		this._gui_control_colors = null;

		this.DocumentReaderMode = null;

		this.ParcedDocument              = false;
		this.isStartCoAuthoringOnEndLoad = false;	// Подсоединились раньше, чем документ загрузился

		if (window.editor == undefined)
		{
			window.editor = this;
			window.editor;
			window['editor'] = window.editor;

			if (window["NATIVE_EDITOR_ENJINE"])
				editor = window.editor;
		}

		this.RevisionChangesStack = [];

		//g_clipboardBase.Init(this);

		this._init();
	}

	AscCommon.extendClass(asc_docs_api, AscCommon.baseEditorsApi);

	asc_docs_api.prototype.sendEvent           = function()
	{
		var name = arguments[0];
		if (_callbacks.hasOwnProperty(name))
		{
			for (var i = 0; i < _callbacks[name].length; ++i)
			{
				_callbacks[name][i].apply(this || window, Array.prototype.slice.call(arguments, 1));
			}
			return true;
		}
		return false;
	};
	// Просмотр PDF
	asc_docs_api.prototype.isPdfViewer         = function()
	{
		return (null === this.WordControl.m_oLogicDocument);
	};
	asc_docs_api.prototype.LoadFontsFromServer = function(_fonts)
	{
		if (undefined === _fonts)
			_fonts = ["Arial", "Symbol", "Wingdings", "Courier New", "Times New Roman"];
		this.FontLoader.LoadFontsFromServer(_fonts);
	};

	asc_docs_api.prototype.SetCollaborativeMarksShowType = function(Type)
	{
		if (c_oAscCollaborativeMarksShowType.None !== this.CollaborativeMarksShowType && c_oAscCollaborativeMarksShowType.None === Type && this.WordControl && this.WordControl.m_oLogicDocument)
		{
			this.CollaborativeMarksShowType = Type;
			AscCommon.CollaborativeEditing.Clear_CollaborativeMarks(true);
		}
		else
		{
			this.CollaborativeMarksShowType = Type;
		}
	};

	asc_docs_api.prototype.GetCollaborativeMarksShowType = function(Type)
	{
		return this.CollaborativeMarksShowType;
	};

	asc_docs_api.prototype.Clear_CollaborativeMarks = function()
	{
		AscCommon.CollaborativeEditing.Clear_CollaborativeMarks(true);
	};

	asc_docs_api.prototype.SetLanguage = function(langId)
	{
		langId = langId.toLowerCase();
		if (undefined !== AscCommonWord.translations_map[langId])
			this.CurrentTranslate = AscCommonWord.translations_map[langId];
	};

	asc_docs_api.prototype.TranslateStyleName   = function(style_name)
	{
		var ret = this.CurrentTranslate.DefaultStyles[style_name];

		if (ret !== undefined)
			return ret;

		return style_name;
	};
	asc_docs_api.prototype.CheckChangedDocument = function()
	{
		if (true === History.Have_Changes())
		{
			// дублирование евента. когда будет undo-redo - тогда
			// эти евенты начнут отличаться
			this.SetDocumentModified(true);
		}
		else
		{
			this.SetDocumentModified(false);
		}

		this._onUpdateDocumentCanSave();
	};
	asc_docs_api.prototype.SetUnchangedDocument = function()
	{
		this.SetDocumentModified(false);
		this._onUpdateDocumentCanSave();
	};

	asc_docs_api.prototype.SetDocumentModified = function(bValue)
	{
		this.isDocumentModify = bValue;
		this.sendEvent("asc_onDocumentModifiedChanged");

		if (undefined !== window["AscDesktopEditor"])
		{
			window["AscDesktopEditor"]["onDocumentModifiedChanged"](bValue);
		}
	};

	asc_docs_api.prototype.isDocumentModified = function()
	{
		if (!this.canSave)
		{
			// Пока идет сохранение, мы не закрываем документ
			return true;
		}
		return this.isDocumentModify;
	};

	asc_docs_api.prototype.sync_BeginCatchSelectedElements = function()
	{
		if (0 != this.SelectedObjectsStack.length)
			this.SelectedObjectsStack.splice(0, this.SelectedObjectsStack.length);

		if (this.WordControl && this.WordControl.m_oDrawingDocument)
			this.WordControl.m_oDrawingDocument.StartTableStylesCheck();
	};
	asc_docs_api.prototype.sync_EndCatchSelectedElements   = function()
	{
		if (this.WordControl && this.WordControl.m_oDrawingDocument)
			this.WordControl.m_oDrawingDocument.EndTableStylesCheck();

		this.sendEvent("asc_onFocusObject", this.SelectedObjectsStack);
	};
	asc_docs_api.prototype.getSelectedElements             = function(bUpdate)
	{
		if (true === bUpdate)
			this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();

		return this.SelectedObjectsStack;
	};
	asc_docs_api.prototype.sync_ChangeLastSelectedElement  = function(type, obj)
	{
		var oUnkTypeObj = null;

		switch (type)
		{
			case c_oAscTypeSelectElement.Paragraph:
				oUnkTypeObj = new Asc.asc_CParagraphProperty(obj);
				break;
			case c_oAscTypeSelectElement.Image:
				oUnkTypeObj = new asc_CImgProperty(obj);
				break;
			case c_oAscTypeSelectElement.Table:
				oUnkTypeObj = new CTableProp(obj);
				break;
			case c_oAscTypeSelectElement.Header:
				oUnkTypeObj = new CHeaderProp(obj);
				break;
		}

		var _i       = this.SelectedObjectsStack.length - 1;
		var bIsFound = false;
		while (_i >= 0)
		{
			if (this.SelectedObjectsStack[_i].Type == type)
			{

				this.SelectedObjectsStack[_i].Value = oUnkTypeObj;
				bIsFound                            = true;
				break;
			}
			_i--;
		}

		if (!bIsFound)
		{
			this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject(type, oUnkTypeObj);
		}
	};

	asc_docs_api.prototype.Init = function()
	{
		this.WordControl.Init();
	};

	asc_docs_api.prototype.asc_setLocale = function(val)
	{
		this.InterfaceLocale = val;
	};

	asc_docs_api.prototype.ChangeReaderMode  = function()
	{
		return this.WordControl.ChangeReaderMode();
	};
	asc_docs_api.prototype.SetReaderModeOnly = function()
	{
		this.isOnlyReaderMode                       = true;
		if (this.ImageLoader)
			this.ImageLoader.bIsAsyncLoadDocumentImages = false;
	};

	asc_docs_api.prototype.IncreaseReaderFontSize = function()
	{
		return this.WordControl.IncreaseReaderFontSize();
	};
	asc_docs_api.prototype.DecreaseReaderFontSize = function()
	{
		return this.WordControl.DecreaseReaderFontSize();
	};

	asc_docs_api.prototype.CreateCSS = function()
	{
		if (window["flat_desine"] === true)
		{
			AscCommonWord.updateGlobalSkin(AscCommonWord.GlobalSkinFlat);
		}

		var _head = document.getElementsByTagName('head')[0];

		var style0       = document.createElement('style');
		style0.type      = 'text/css';
		style0.innerHTML = ".block_elem { position:absolute;padding:0;margin:0; }";
		_head.appendChild(style0);

		var style2       = document.createElement('style');
		style2.type      = 'text/css';
		style2.innerHTML = ".buttonRuler {\
background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAwCAYAAAAYX/pXAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAAABhElEQVRIS62Uwa6CMBBF/VQNQcOCBS5caOICApEt3+Wv+AcmfQ7pbdreqY+CJifTdjpng727aZrMFmbB+/3erYEE+/3egMPhMPP57QR/EJCgKAoTs1hQlqURjsdjAESyPp1O7pwEVVWZ1+s1VyB7DemRoK5rN+CvNaRPgqZpgqHz+UwSnEklweVyCQbivX8mlQTX65UGfG63m+vLXRLc7/ekQHoAexK0bWs0uq5TKwli8Afq+94Mw+CQPe78K5D6eDzMOI4GVcCdr4IlOMEWfiP4fJpVkEDLA38ghgR+DgB/ICYQ5OYBCez7d1mAvQZ6gcBmAK010A8ENg8c9u2rZ6iBwL51R7z3z1ADgc2DJDYPZnA3ENi3rhLlgauBAO8/JpUHJEih5QF6iwRaHqC3SPANJ9jCbwTP53MVJNDywB+IIYGfA8AfiAkEqTyQDEAO+HlAgtw8IEFuHpAgNw9IkJsHJMjNAxLk5gEJ8P5jUnlAghRaHqC3SKDlAXqLBN9wgvVM5g/dFuEU6U2wnAAAAABJRU5ErkJggg==);\
background-position: 0px 0px;\
background-repeat: no-repeat;\
}";
		_head.appendChild(style2);

		var style3       = document.createElement('style');
		style3.type      = 'text/css';
		style3.innerHTML = ".buttonPrevPage {\
background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAABgBAMAAADm/++TAAAABGdBTUEAALGPC/xhBQAAABJQTFRFAAAA////UVNVu77Cenp62Nrc3x8hMQAAAAF0Uk5TAEDm2GYAAABySURBVCjPY2AgETDBGEoKUAElJcJSxANjKGAwDQWDYAKMIBhDSRXCCFJSIixF0GS4M+AMExcwcCbAcIQxBEUgDEdBQcJSBE2GO4PU6IJHASxS4NGER4p28YWIAlikwKMJjxTt4gsRBbBIgUcTHini4wsAwMmIvYZODL0AAAAASUVORK5CYII=);\
background-position: 0px 0px;\
background-repeat: no-repeat;\
}";
		_head.appendChild(style3);

		var style4       = document.createElement('style');
		style4.type      = 'text/css';
		style4.innerHTML = ".buttonNextPage {\
background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAABgBAMAAADm/++TAAAABGdBTUEAALGPC/xhBQAAABJQTFRFAAAA////UVNVu77Cenp62Nrc3x8hMQAAAAF0Uk5TAEDm2GYAAABySURBVCjPY2AgETDBGEoKUAElJcJSxANjKGAwDQWDYAKMIBhDSRXCCFJSIixF0GS4M+AMExcwcCbAcIQxBEUgDEdBQcJSBE2GO4PU6IJHASxS4NGER4p28YWIAlikwKMJjxTt4gsRBbBIgUcTHini4wsAwMmIvYZODL0AAAAASUVORK5CYII=);\
background-position: 0px -48px;\
background-repeat: no-repeat;\
}";
		_head.appendChild(style4);
	};

	asc_docs_api.prototype.CreateComponents = function()
	{
		this.CreateCSS();

		if (this.HtmlElement != null)
			this.HtmlElement.innerHTML = "<div id=\"id_main\" class=\"block_elem\" style=\"-ms-touch-action: none;-moz-user-select:none;-khtml-user-select:none;user-select:none;background-color:" + AscCommonWord.GlobalSkin.BackgroundColor + ";overflow:hidden;\" UNSELECTABLE=\"on\">\
								<div id=\"id_panel_left\" class=\"block_elem\">\
									<canvas id=\"id_buttonTabs\" class=\"block_elem\"></canvas>\
									<canvas id=\"id_vert_ruler\" class=\"block_elem\"></canvas>\
								</div>\
									<div id=\"id_panel_top\" class=\"block_elem\">\
									<canvas id=\"id_hor_ruler\" class=\"block_elem\"></canvas>\
									</div>\
                                    <div id=\"id_main_view\" class=\"block_elem\" style=\"overflow:hidden\">\
                                        <canvas id=\"id_viewer\" class=\"block_elem\" style=\"-ms-touch-action: none;-webkit-user-select: none; background-color:" + AscCommonWord.GlobalSkin.BackgroundColor + ";z-index:1\"></canvas>\
									    <canvas id=\"id_viewer_overlay\" class=\"block_elem\" style=\"-ms-touch-action: none;-webkit-user-select: none; z-index:2\"></canvas>\
									    <canvas id=\"id_target_cursor\" class=\"block_elem\" width=\"1\" height=\"1\" style=\"-ms-touch-action: none;-webkit-user-select: none;width:2px;height:13px;z-index:4;\"></canvas>\
                                    </div>\
								</div>\
									<div id=\"id_panel_right\" class=\"block_elem\" style=\"margin-right:1px;background-color:" + AscCommonWord.GlobalSkin.BackgroundScroll + ";\">\
									<div id=\"id_buttonRulers\" class=\"block_elem buttonRuler\"></div>\
									<div id=\"id_vertical_scroll\" style=\"left:0;top:0px;width:14px;overflow:hidden;position:absolute;\">\
									<div id=\"panel_right_scroll\" class=\"block_elem\" style=\"left:0;top:0;width:1px;height:6000px;\"></div>\
									</div>\
									<div id=\"id_buttonPrevPage\" class=\"block_elem buttonPrevPage\"></div>\
									<div id=\"id_buttonNextPage\" class=\"block_elem buttonNextPage\"></div>\
								</div>\
									<div id=\"id_horscrollpanel\" class=\"block_elem\" style=\"margin-bottom:1px;background-color:" + AscCommonWord.GlobalSkin.BackgroundScroll + ";\">\
									<div id=\"id_horizontal_scroll\" style=\"left:0px;top:0;height:14px;overflow:hidden;position:absolute;width:100%;\">\
										<div id=\"panel_hor_scroll\" class=\"block_elem\" style=\"left:0;top:0;width:6000px;height:1px;\"></div>\
									</div>\
									</div>";
	};

	asc_docs_api.prototype.GetCopyPasteDivId = function()
	{
		if (this.isMobileVersion)
			return this.WordControl.Name;
		return "";
	};

	asc_docs_api.prototype.ContentToHTML = function(bIsRet)
	{
		this.DocumentReaderMode            = new AscCommon.CDocumentReaderMode();

		this.WordControl.m_oLogicDocument.Select_All();
		var text_data = {
			data : "",
			pushData : function(format, value) { this.data = value; }
		};

		this.asc_CheckCopy(text_data, 2);
		this.WordControl.m_oLogicDocument.Selection_Remove();

		return text_data.data;
	};

	asc_docs_api.prototype.InitEditor = function()
	{
		this.WordControl.m_oLogicDocument                    = new AscCommonWord.CDocument(this.WordControl.m_oDrawingDocument);
		this.WordControl.m_oDrawingDocument.m_oLogicDocument = this.WordControl.m_oLogicDocument;
		if (!this.isSpellCheckEnable)
			this.WordControl.m_oLogicDocument.TurnOff_CheckSpelling();

		if (this.WordControl.MobileTouchManager)
			this.WordControl.MobileTouchManager.delegate.LogicDocument = this.WordControl.m_oLogicDocument;
	};

	asc_docs_api.prototype.InitViewer = function()
	{
		this.WordControl.m_oDrawingDocument.m_oDocumentRenderer = new AscCommonWord.CDocMeta();
		this.WordControl.m_oDrawingDocument.showTarget(false);
	};

	asc_docs_api.prototype.OpenDocument = function(url, gObject)
	{
		this.isOnlyReaderMode = false;
		this.InitViewer();
		this.LoadedObject         = null;
		this.DocumentType         = 1;
		this.ServerIdWaitComplete = true;

		this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);

		this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.Load(url, gObject);
		this.FontLoader.LoadDocumentFonts(this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.Fonts, true);
	};

	asc_docs_api.prototype.OpenDocument2 = function(url, gObject)
	{
		this.InitEditor();
		this.DocumentType   = 2;
		this.LoadedObjectDS = this.WordControl.m_oLogicDocument.CopyStyle();

		g_oIdCounter.Set_Load(true);

		var openParams        = {checkFileSize : this.isMobileVersion, charCount : 0, parCount : 0};
		var oBinaryFileReader = new AscCommonWord.BinaryFileReader(this.WordControl.m_oLogicDocument, openParams);
		if (oBinaryFileReader.Read(gObject))
		{
			if (History && History.Update_FileDescription)
				History.Update_FileDescription(oBinaryFileReader.stream);

			g_oIdCounter.Set_Load(false);
			this.LoadedObject = 1;

			this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);

			// проверяем какие шрифты нужны
			this.WordControl.m_oDrawingDocument.CheckFontNeeds();
			AscCommon.pptx_content_loader.CheckImagesNeeds(this.WordControl.m_oLogicDocument);

			//this.FontLoader.LoadEmbeddedFonts(this.DocumentUrl, this.WordControl.m_oLogicDocument.EmbeddedFonts);
			this.FontLoader.LoadDocumentFonts(this.WordControl.m_oLogicDocument.Fonts, false);
		}
		else
			editor.sendEvent("asc_onError", c_oAscError.ID.MobileUnexpectedCharCount, c_oAscError.Level.Critical);

		//callback
		editor.DocumentOrientation = (null == editor.WordControl.m_oLogicDocument) ? true : !editor.WordControl.m_oLogicDocument.Orientation;
		var sizeMM;
		if (editor.DocumentOrientation)
			sizeMM = DocumentPageSize.getSize(AscCommon.Page_Width, AscCommon.Page_Height);
		else
			sizeMM = DocumentPageSize.getSize(AscCommon.Page_Height, AscCommon.Page_Width);
		editor.sync_DocSizeCallback(sizeMM.w_mm, sizeMM.h_mm);
		editor.sync_PageOrientCallback(editor.get_DocumentOrientation());

		this.ParcedDocument = true;
		if (this.isStartCoAuthoringOnEndLoad)
		{
			this.CoAuthoringApi.onStartCoAuthoring(true);
			this.isStartCoAuthoringOnEndLoad = false;
		}

		if (this.isMobileVersion)
		{
			AscCommon.AscBrowser.isSafariMacOs   = false;
			PasteElementsId.PASTE_ELEMENT_ID     = "wrd_pastebin";
			PasteElementsId.ELEMENT_DISPAY_STYLE = "none";
		}
	};
	// Callbacks
	/* все имена callback'оф начинаются с On. Пока сделаны:
	 OnBold,
	 OnItalic,
	 OnUnderline,
	 OnTextPrBaseline(возвращается расположение строки - supstring, superstring, baseline),
	 OnPrAlign(выравнивание по ширине, правому краю, левому краю, по центру),
	 OnListType( возвращается AscCommon.asc_CListType )

	 фейк-функции ожидающие TODO:
	 Print,Undo,Redo,Copy,Cut,Paste,Share,Save,Download & callbacks
	 OnFontName, OnFontSize, OnLineSpacing

	 OnFocusObject( возвращается массив asc_CSelectedObject )
	 OnInitEditorStyles( возвращается CStylesPainter )
	 OnSearchFound( возвращается CSearchResult );
	 OnParaSpacingLine( возвращается AscCommon.asc_CParagraphSpacing )
	 OnLineSpacing( не используется? )
	 OnTextColor( возвращается AscCommon.CColor )
	 OnTextHightLight( возвращается AscCommon.CColor )
	 OnInitEditorFonts( возвращается массив объектов СFont )
	 OnFontFamily( возвращается asc_CTextFontFamily )
	 */
	var _callbacks = {};

	asc_docs_api.prototype.asc_registerCallback = function(name, callback)
	{
		if (!_callbacks.hasOwnProperty(name))
			_callbacks[name] = [];
		_callbacks[name].push(callback);
	};

	asc_docs_api.prototype.asc_unregisterCallback = function(name, callback)
	{
		if (_callbacks.hasOwnProperty(name))
		{
			for (var i = _callbacks[name].length - 1; i >= 0; --i)
			{
				if (_callbacks[name][i] == callback)
					_callbacks[name].splice(i, 1);
			}
		}
	};

	asc_docs_api.prototype.asc_checkNeedCallback = function(name)
	{
		return _callbacks.hasOwnProperty(name);
	};

	// тут методы, замены евентов
	asc_docs_api.prototype.get_PropertyThemeColors       = function()
	{
		return [this._gui_control_colors.Colors, this._gui_control_colors.StandartColors];
	};
	// -------

	/////////////////////////////////////////////////////////////////////////
	///////////////////CoAuthoring and Chat api//////////////////////////////
	/////////////////////////////////////////////////////////////////////////
	// Init CoAuthoring
	asc_docs_api.prototype._coAuthoringSetChange = function(change, oColor)
	{
		var oChange = new AscCommon.CCollaborativeChanges();
		oChange.Set_Data(change);
		oChange.Set_Color(oColor);
		AscCommon.CollaborativeEditing.Add_Changes(oChange);
	};

	asc_docs_api.prototype._coAuthoringSetChanges = function(e, oColor)
	{
		var Count = e.length;
		for (var Index = 0; Index < Count; ++Index)
			this._coAuthoringSetChange(e[Index], oColor);
	};

	asc_docs_api.prototype._coAuthoringInitEnd = function()
	{
		var t                                        = this;
		this.CoAuthoringApi.onCursor                 = function(e)
		{
			if (true === AscCommon.CollaborativeEditing.Is_Fast())
			{
				t.WordControl.m_oLogicDocument.Update_ForeignCursor(e[e.length - 1]['cursor'], e[e.length - 1]['user'], true, e[e.length - 1]['useridoriginal']);
			}
		};
		this.CoAuthoringApi.onConnectionStateChanged = function(e)
		{
			if (true === AscCommon.CollaborativeEditing.Is_Fast() && false === e['state'])
			{
				t.WordControl.m_oLogicDocument.Remove_ForeignCursor(e['id']);
			}
			t.sendEvent("asc_onConnectionStateChanged", e);
		};
		this.CoAuthoringApi.onLocksAcquired          = function(e)
		{
			if (t.isApplyChangesOnOpenEnabled)
			{
				// Пока документ еще не загружен, будем сохранять функцию и аргументы
				t.arrPreOpenLocksObjects.push(function()
				{
					t.CoAuthoringApi.onLocksAcquired(e);
				});
				return;
			}

			if (2 != e["state"])
			{
				var Id    = e["block"];
				var Class = g_oTableId.Get_ById(Id);
				if (null != Class)
				{
					var Lock = Class.Lock;

					var OldType = Class.Lock.Get_Type();
					if (locktype_Other2 === OldType || locktype_Other3 === OldType)
					{
						Lock.Set_Type(locktype_Other3, true);
					}
					else
					{
						Lock.Set_Type(locktype_Other, true);
					}

					// Выставляем ID пользователя, залочившего данный элемент
					Lock.Set_UserId(e["user"]);

					if (Class instanceof AscCommonWord.CHeaderFooterController)
					{
						t.sync_LockHeaderFooters();
					}
					else if (Class instanceof AscCommonWord.CDocument)
					{
						t.sync_LockDocumentProps();
					}
					else if (Class instanceof AscCommon.CComment)
					{
						t.sync_LockComment(Class.Get_Id(), e["user"]);
					}
					else if (Class instanceof AscCommonWord.CGraphicObjects)
					{
						t.sync_LockDocumentSchema();
					}

					// Теперь обновлять состояние необходимо, чтобы обновить локи в режиме рецензирования.
					t.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
				}
				else
				{
					AscCommon.CollaborativeEditing.Add_NeedLock(Id, e["user"]);
				}
			}
		};
		this.CoAuthoringApi.onLocksReleased          = function(e, bChanges)
		{
			if (t.isApplyChangesOnOpenEnabled)
			{
				// Пока документ еще не загружен, будем сохранять функцию и аргументы
				t.arrPreOpenLocksObjects.push(function()
				{
					t.CoAuthoringApi.onLocksReleased(e, bChanges);
				});
				return;
			}

			var Id    = e["block"];
			var Class = g_oTableId.Get_ById(Id);
			if (null != Class)
			{
				var Lock = Class.Lock;
				if ("undefined" != typeof(Lock))
				{
					var CurType = Lock.Get_Type();

					var NewType = locktype_None;

					if (CurType === locktype_Other)
					{
						if (true != bChanges)
						{
							NewType = locktype_None;
						}
						else
						{
							NewType = locktype_Other2;
							AscCommon.CollaborativeEditing.Add_Unlock(Class);
						}
					}
					else if (CurType === locktype_Mine)
					{
						// Такого быть не должно
						NewType = locktype_Mine;
					}
					else if (CurType === locktype_Other2 || CurType === locktype_Other3)
					{
						NewType = locktype_Other2;
					}

					Lock.Set_Type(NewType, true);

					// Теперь обновлять состояние необходимо, чтобы обновить локи в режиме рецензирования.
					t.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();

					if (Class instanceof AscCommonWord.CHeaderFooterController)
					{
						if (NewType !== locktype_Mine && NewType !== locktype_None)
						{
							t.sync_LockHeaderFooters();
						}
						else
						{
							t.sync_UnLockHeaderFooters();
						}
					}
					else if (Class instanceof AscCommonWord.CDocument)
					{
						if (NewType !== locktype_Mine && NewType !== locktype_None)
						{
							t.sync_LockDocumentProps();
						}
						else
						{
							t.sync_UnLockDocumentProps();
						}
					}
					else if (Class instanceof AscCommon.CComment)
					{
						if (NewType !== locktype_Mine && NewType !== locktype_None)
						{
							t.sync_LockComment(Class.Get_Id(), e["user"]);
						}
						else
						{
							t.sync_UnLockComment(Class.Get_Id());
						}
					}
					else if (Class instanceof AscCommonWord.CGraphicObjects)
					{
						if (NewType !== locktype_Mine && NewType !== locktype_None)
						{
							t.sync_LockDocumentSchema();
						}
						else
						{
							t.sync_UnLockDocumentSchema();
						}
					}
				}
			}
			else
			{
				AscCommon.CollaborativeEditing.Remove_NeedLock(Id);
			}
		};
		this.CoAuthoringApi.onSaveChanges            = function(e, userId, bFirstLoad)
		{
			var bUseColor;
			if (bFirstLoad)
			{
				bUseColor = -1 === AscCommon.CollaborativeEditing.m_nUseType;
			}
			if (t.CollaborativeMarksShowType === c_oAscCollaborativeMarksShowType.None)
			{
				bUseColor = false;
			}

			var oCommonColor = AscCommon.getUserColorById(userId, null, false, false);
			var oColor       = false === bUseColor ? null : oCommonColor;
			t._coAuthoringSetChange(e, oColor);
			// т.е. если bSendEvent не задан, то посылаем  сообщение + когда загрузился документ
			if (!bFirstLoad && t.bInit_word_control)
			{
				t.sync_CollaborativeChanges();
			}
		};
		this.CoAuthoringApi.onRecalcLocks            = function(e)
		{
			if (e && true === AscCommon.CollaborativeEditing.Is_Fast())
			{
				var CursorInfo = JSON.parse(e);
				AscCommon.CollaborativeEditing.Add_ForeignCursorToUpdate(CursorInfo.UserId, CursorInfo.CursorInfo, CursorInfo.UserShortId);
			}
		};
		this.CoAuthoringApi.onStartCoAuthoring       = function(isStartEvent)
		{
			AscCommon.CollaborativeEditing.Start_CollaborationEditing();
			t.asc_setDrawCollaborationMarks(true);

			if (t.ParcedDocument)
			{
				t.WordControl.m_oLogicDocument.DrawingDocument.Start_CollaborationEditing();

				if (!isStartEvent)
				{
					if (true != History.Is_Clear())
					{
						AscCommon.CollaborativeEditing.Apply_Changes();
						AscCommon.CollaborativeEditing.Send_Changes();
					}
					else
					{
						// Изменений нет, но нужно сбросить lock
						t.CoAuthoringApi.unLockDocument(true);
					}
				}
			}
			else
			{
				t.isStartCoAuthoringOnEndLoad = true;
				if (!isStartEvent)
				{
					// Документ еще не подгрузился, но нужно сбросить lock
					t.CoAuthoringApi.unLockDocument(false);
				}
			}
		};
		this.CoAuthoringApi.onEndCoAuthoring         = function(isStartEvent)
		{
			AscCommon.CollaborativeEditing.End_CollaborationEditing();
			t.asc_setDrawCollaborationMarks(false);
		};
	};

	/////////////////////////////////////////////////////////////////////////
	//////////////////////////SpellChecking api//////////////////////////////
	/////////////////////////////////////////////////////////////////////////
	// Init SpellCheck
	asc_docs_api.prototype._coSpellCheckInit = function()
	{
		if (!this.SpellCheckApi)
		{
			return; // Error
		}

		var t = this;
		if (!window["AscDesktopEditor"])
		{
			if (this.SpellCheckUrl && this.isSpellCheckEnable)
				this.SpellCheckApi.set_url(this.SpellCheckUrl);

			this.SpellCheckApi.onSpellCheck = function(e)
			{
				var incomeObject = JSON.parse(e);
				t.SpellCheck_CallBack(incomeObject);
			};
		}

		this.SpellCheckApi.init(this.documentId);
	};
	//----------------------------------------------------------------------------------------------------------------------
	// SpellCheck_CallBack
	//          Функция ответа от сервера.
	//----------------------------------------------------------------------------------------------------------------------
	asc_docs_api.prototype.SpellCheck_CallBack = function(Obj)
	{
		if (undefined != Obj && undefined != Obj["ParagraphId"])
		{
			var ParaId    = Obj["ParagraphId"];
			var Paragraph = g_oTableId.Get_ById(ParaId);
			var Type      = Obj["type"];
			if (null != Paragraph)
			{
				if ("spell" === Type)
				{
					Paragraph.SpellChecker.Check_CallBack(Obj["RecalcId"], Obj["usrCorrect"]);
					Paragraph.ReDraw();
				}
				else if ("suggest" === Type)
				{
					Paragraph.SpellChecker.Check_CallBack2(Obj["RecalcId"], Obj["ElementId"], Obj["usrSuggest"]);
					this.sync_SpellCheckVariantsFound();
				}
			}
		}
	};

	asc_docs_api.prototype.asc_getSpellCheckLanguages = function()
	{
		return AscCommon.g_spellCheckLanguages;
	};
	asc_docs_api.prototype.asc_SpellCheckDisconnect   = function()
	{
		if (!this.SpellCheckApi)
			return; // Error
		this.SpellCheckApi.disconnect();
		this.isSpellCheckEnable = false;
		if (this.WordControl.m_oLogicDocument)
			this.WordControl.m_oLogicDocument.TurnOff_CheckSpelling();
	};
	asc_docs_api.prototype._onUpdateDocumentCanSave   = function()
	{
		var CollEditing = AscCommon.CollaborativeEditing;

		// Можно модифицировать это условие на более быстрое (менять самим состояние в аргументах, а не запрашивать каждый раз)
		var isCanSave = this.isDocumentModified() || (true !== CollEditing.Is_SingleUser() && 0 !== CollEditing.getOwnLocksLength());

		if (true === CollEditing.Is_Fast() && true !== CollEditing.Is_SingleUser())
			isCanSave = false;

		if (isCanSave !== this.isDocumentCanSave)
		{
			this.isDocumentCanSave = isCanSave;
			this.sendEvent('asc_onDocumentCanSaveChanged', this.isDocumentCanSave);
		}
	};

	// get functions
	// Возвращает
	//{
	// ParaPr :
	// {
	//    ContextualSpacing : false,            // Удалять ли интервал между параграфами одинакового стиля
	//
	//    Ind :
	//    {
	//        Left      : 0,                    // Левый отступ
	//        Right     : 0,                    // Правый отступ
	//        FirstLine : 0                     // Первая строка
	//    },
	//
	//    Jc : align_Left,                      // Прилегание параграфа
	//
	//    KeepLines : false,                    // переносить параграф на новую страницу,
	//                                          // если на текущей он целиком не убирается
	//    KeepNext  : false,                    // переносить параграф вместе со следующим параграфом
	//
	//    PageBreakBefore : false,              // начинать параграф с новой страницы
	//
	//    Spacing :
	//    {
	//        Line     : 1.15,                  // Расстояние между строками внутри абзаца
	//        LineRule : linerule_Auto,         // Тип расстрояния между строками
	//        Before   : 0,                     // Дополнительное расстояние до абзаца
	//        After    : 10 * g_dKoef_pt_to_mm  // Дополнительное расстояние после абзаца
	//    },
	//
	//    Shd :
	//    {
	//        Value : shd_Nil,
	//        Color :
	//        {
	//            r : 255,
	//            g : 255,
	//            b : 255
	//        }
	//    },
	//
	//    WidowControl : true,                  // Запрет висячих строк
	//
	//    Tabs : []
	// },
	//
	// TextPr :
	// {
	//    Bold       : false,
	//    Italic     : false,
	//    Underline  : false,
	//    Strikeout  : false,
	//    FontFamily :
	//    {
	//        Name  : "Times New Roman",
	//        Index : -1
	//    },
	//    FontSize   : 12,
	//    Color      :
	//    {
	//        r : 0,
	//        g : 0,
	//        b : 0
	//    },
	//    VertAlign : vertalign_Baseline,
	//    HighLight : highlight_None
	// }
	//}


	asc_docs_api.prototype.put_FramePr = function(Obj)
	{
		if (undefined != Obj.FontFamily)
		{
			var loader     = AscCommon.g_font_loader;
			var fontinfo   = g_fontApplication.GetFontInfo(Obj.FontFamily);
			var isasync    = loader.LoadFont(fontinfo, editor.asyncFontEndLoaded_DropCap, Obj);
			Obj.FontFamily = new asc_CTextFontFamily({Name : fontinfo.Name, Index : -1});

			if (false === isasync)
			{
				if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties))
				{
					this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetFramePrWithFontFamily);
					this.WordControl.m_oLogicDocument.Set_ParagraphFramePr(Obj);
				}
			}
		}
		else
		{
			if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties))
			{
				this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetFramePr);
				this.WordControl.m_oLogicDocument.Set_ParagraphFramePr(Obj);
			}
		}
	};



	asc_docs_api.prototype.asyncFontEndLoaded_DropCap = function(Obj)
	{
		this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetFramePrWithFontFamilyLong);
			this.WordControl.m_oLogicDocument.Set_ParagraphFramePr(Obj);
		}
		// отжать заморозку меню
	};

	asc_docs_api.prototype.asc_addDropCap = function(bInText)
	{
		this.WordControl.m_oLogicDocument.Add_DropCap(bInText);
	};

	asc_docs_api.prototype.removeDropcap = function(bDropCap)
	{
		this.WordControl.m_oLogicDocument.Remove_DropCap(bDropCap);
	};

	// Paragraph properties
	function CParagraphPropEx(obj)
	{
		if (obj)
		{
			this.ContextualSpacing = (undefined != obj.ContextualSpacing) ? obj.ContextualSpacing : null;
			this.Ind               = (undefined != obj.Ind && null != obj.Ind) ? new Asc.asc_CParagraphInd(obj.Ind) : null;
			this.Jc                = (undefined != obj.Jc) ? obj.Jc : null;
			this.KeepLines         = (undefined != obj.KeepLines) ? obj.KeepLines : null;
			this.KeepNext          = (undefined != obj.KeepNext) ? obj.KeepNext : null;
			this.PageBreakBefore   = (undefined != obj.PageBreakBefore) ? obj.PageBreakBefore : null;
			this.Spacing           = (undefined != obj.Spacing && null != obj.Spacing) ? new AscCommon.asc_CParagraphSpacing(obj.Spacing) : null;
			this.Shd               = (undefined != obj.Shd && null != obj.Shd) ? new Asc.asc_CParagraphShd(obj.Shd) : null;
			this.WidowControl      = (undefined != obj.WidowControl) ? obj.WidowControl : null;                  // Запрет висячих строк
			this.Tabs              = obj.Tabs;
		}
		else
		{
			//ContextualSpacing : false,            // Удалять ли интервал между параграфами одинакового стиля
			//
			//    Ind :
			//    {
			//        Left      : 0,                    // Левый отступ
			//        Right     : 0,                    // Правый отступ
			//        FirstLine : 0                     // Первая строка
			//    },
			//
			//    Jc : align_Left,                      // Прилегание параграфа
			//
			//    KeepLines : false,                    // переносить параграф на новую страницу,
			//                                          // если на текущей он целиком не убирается
			//    KeepNext  : false,                    // переносить параграф вместе со следующим параграфом
			//
			//    PageBreakBefore : false,              // начинать параграф с новой страницы
			this.ContextualSpacing = false;
			this.Ind               = new Asc.asc_CParagraphInd();
			this.Jc                = AscCommon.align_Left;
			this.KeepLines         = false;
			this.KeepNext          = false;
			this.PageBreakBefore   = false;
			this.Spacing           = new AscCommon.asc_CParagraphSpacing();
			this.Shd               = new Asc.asc_CParagraphShd();
			this.WidowControl      = true;                  // Запрет висячих строк
			this.Tabs              = null;
		}
	}

	CParagraphPropEx.prototype.get_ContextualSpacing = function()
	{
		return this.ContextualSpacing;
	};
	CParagraphPropEx.prototype.get_Ind               = function()
	{
		return this.Ind;
	};
	CParagraphPropEx.prototype.get_Jc                = function()
	{
		return this.Jc;
	};
	CParagraphPropEx.prototype.get_KeepLines         = function()
	{
		return this.KeepLines;
	};
	CParagraphPropEx.prototype.get_KeepNext          = function()
	{
		return this.KeepNext;
	};
	CParagraphPropEx.prototype.get_PageBreakBefore   = function()
	{
		return this.PageBreakBefore;
	};
	CParagraphPropEx.prototype.get_Spacing           = function()
	{
		return this.Spacing;
	};
	CParagraphPropEx.prototype.get_Shd               = function()
	{
		return this.Shd;
	};
	CParagraphPropEx.prototype.get_WidowControl      = function()
	{
		return this.WidowControl;
	};
	CParagraphPropEx.prototype.get_Tabs              = function()
	{
		return this.Tabs;
	};

	// Text properties
	// TextPr :
	// {
	//    Bold       : false,
	//    Italic     : false,
	//    Underline  : false,
	//    Strikeout  : false,
	//    FontFamily :
	//    {
	//        Name  : "Times New Roman",
	//        Index : -1
	//    },
	//    FontSize   : 12,
	//    Color      :
	//    {
	//        r : 0,
	//        g : 0,
	//        b : 0
	//    },
	//    VertAlign : vertalign_Baseline,
	//    HighLight : highlight_None
	// }

	// CTextProp
	function CTextProp(obj)
	{
		if (obj)
		{
			this.Bold       = (undefined != obj.Bold) ? obj.Bold : null;
			this.Italic     = (undefined != obj.Italic) ? obj.Italic : null;
			this.Underline  = (undefined != obj.Underline) ? obj.Underline : null;
			this.Strikeout  = (undefined != obj.Strikeout) ? obj.Strikeout : null;
			this.FontFamily = (undefined != obj.FontFamily && null != obj.FontFamily) ? new asc_CTextFontFamily(obj.FontFamily) : null;
			this.FontSize   = (undefined != obj.FontSize) ? obj.FontSize : null;
			this.Color      = (undefined != obj.Color && null != obj.Color) ? AscCommon.CreateAscColorCustom(obj.Color.r, obj.Color.g, obj.Color.b) : null;
			this.VertAlign  = (undefined != obj.VertAlign) ? obj.VertAlign : null;
			this.HighLight  = (undefined != obj.HighLight) ? obj.HighLight == AscCommonWord.highlight_None ? obj.HighLight : new AscCommon.CColor(obj.HighLight.r, obj.HighLight.g, obj.HighLight.b) : null;
			this.DStrikeout = (undefined != obj.DStrikeout) ? obj.DStrikeout : null;
			this.Spacing    = (undefined != obj.Spacing) ? obj.Spacing : null;
			this.Caps       = (undefined != obj.Caps) ? obj.Caps : null;
			this.SmallCaps  = (undefined != obj.SmallCaps) ? obj.SmallCaps : null;
		}
		else
		{
			//    Bold       : false,
			//    Italic     : false,
			//    Underline  : false,
			//    Strikeout  : false,
			//    FontFamily :
			//    {
			//        Name  : "Times New Roman",
			//        Index : -1
			//    },
			//    FontSize   : 12,
			//    Color      :
			//    {
			//        r : 0,
			//        g : 0,
			//        b : 0
			//    },
			//    VertAlign : vertalign_Baseline,
			//    HighLight : highlight_None
			this.Bold       = false;
			this.Italic     = false;
			this.Underline  = false;
			this.Strikeout  = false;
			this.FontFamily = new asc_CTextFontFamily();
			this.FontSize   = 12;
			this.Color      = AscCommon.CreateAscColorCustom(0, 0, 0);
			this.VertAlign  = AscCommon.vertalign_Baseline;
			this.HighLight  = AscCommonWord.highlight_None;
			this.DStrikeout = false;
			this.Spacing    = 0;
			this.Caps       = false;
			this.SmallCaps  = false;
		}
	}

	CTextProp.prototype.get_Bold       = function()
	{
		return this.Bold;
	};
	CTextProp.prototype.get_Italic     = function()
	{
		return this.Italic;
	};
	CTextProp.prototype.get_Underline  = function()
	{
		return this.Underline;
	};
	CTextProp.prototype.get_Strikeout  = function()
	{
		return this.Strikeout;
	};
	CTextProp.prototype.get_FontFamily = function()
	{
		return this.FontFamily;
	};
	CTextProp.prototype.get_FontSize   = function()
	{
		return this.FontSize;
	};
	CTextProp.prototype.get_Color      = function()
	{
		return this.Color;
	};
	CTextProp.prototype.get_VertAlign  = function()
	{
		return this.VertAlign;
	};
	CTextProp.prototype.get_HighLight  = function()
	{
		return this.HighLight;
	};

	CTextProp.prototype.get_Spacing = function()
	{
		return this.Spacing;
	};

	CTextProp.prototype.get_DStrikeout = function()
	{
		return this.DStrikeout;
	};

	CTextProp.prototype.get_Caps = function()
	{
		return this.Caps;
	};

	CTextProp.prototype.get_SmallCaps = function()
	{
		return this.SmallCaps;
	};


	// paragraph and text properties objects container
	function CParagraphAndTextProp(paragraphProp, textProp)
	{
		this.ParaPr = (undefined != paragraphProp && null != paragraphProp) ? new CParagraphPropEx(paragraphProp) : null;
		this.TextPr = (undefined != textProp && null != textProp) ? new CTextProp(textProp) : null;
	}

	CParagraphAndTextProp.prototype.get_ParaPr = function()
	{
		return this.ParaPr;
	};
	CParagraphAndTextProp.prototype.get_TextPr = function()
	{
		return this.TextPr;
	};

	//
	asc_docs_api.prototype.get_TextProps = function()
	{
		var Doc    = this.WordControl.m_oLogicDocument;
		var ParaPr = Doc.Get_Paragraph_ParaPr();
		var TextPr = Doc.Get_Paragraph_TextPr();

		// return { ParaPr: ParaPr, TextPr : TextPr };
		return new CParagraphAndTextProp(ParaPr, TextPr);	// uncomment if this method will be used externally. 20/03/2012 uncommented for testers
	};

	// -------
	asc_docs_api.prototype.GetJSONLogicDocument = function()
	{
		return JSON.stringify(this.WordControl.m_oLogicDocument);
	};

	asc_docs_api.prototype.get_ContentCount = function()
	{
		return this.WordControl.m_oLogicDocument.Content.length;
	};

	asc_docs_api.prototype.select_Element = function(Index)
	{
		var Document = this.WordControl.m_oLogicDocument;

		if (true === Document.Selection.Use)
			Document.Selection_Remove();

		Document.DrawingDocument.SelectEnabled(true);
		Document.DrawingDocument.TargetEnd();

		Document.Selection.Use   = true;
		Document.Selection.Start = false;
		Document.Selection.Flag  = AscCommon.selectionflag_Common;

		Document.Selection.StartPos = Index;
		Document.Selection.EndPos   = Index;

		Document.Content[Index].Selection.Use      = true;
		Document.Content[Index].Selection.StartPos = Document.Content[Index].Internal_GetStartPos();
		Document.Content[Index].Selection.EndPos   = Document.Content[Index].Content.length - 1;

		Document.Selection_Draw();
	};

	asc_docs_api.prototype.UpdateTextPr        = function(TextPr)
	{
		if ("undefined" != typeof(TextPr))
		{
			this.sync_BoldCallBack(TextPr.Bold);
			this.sync_ItalicCallBack(TextPr.Italic);
			this.sync_UnderlineCallBack(TextPr.Underline);
			this.sync_StrikeoutCallBack(TextPr.Strikeout);
			this.sync_TextPrFontSizeCallBack(TextPr.FontSize);
			this.sync_TextPrFontFamilyCallBack(TextPr.FontFamily);
			this.sync_VerticalAlign(TextPr.VertAlign);
			this.sync_TextHighLight(TextPr.HighLight);
			this.sync_TextSpacing(TextPr.Spacing);
			this.sync_TextDStrikeout(TextPr.DStrikeout);
			this.sync_TextCaps(TextPr.Caps);
			this.sync_TextSmallCaps(TextPr.SmallCaps);
			this.sync_TextPosition(TextPr.Position);
			this.sync_TextLangCallBack(TextPr.Lang);
			this.sync_TextColor(TextPr);

			if (this.isMobileVersion)
				this.sendEvent("asc_onTextShd", new Asc.asc_CParagraphShd(TextPr.Shd));
		}
	};
	asc_docs_api.prototype.UpdateParagraphProp = function(ParaPr)
	{
		//if ( true === CollaborativeEditing.Get_GlobalLock() )
		//{
		//    ParaPr.Locked      = true;
		//    ParaPr.CanAddTable = false;
		//}

		// var prgrhPr = this.get_TextProps();
		// var prProp = {};
		// prProp.Ind = prgrhPr.ParaPr.Ind;
		// prProp.ContextualSpacing = prgrhPr.ParaPr.ContextualSpacing;
		// prProp.Spacing = prgrhPr.ParaPr.Spacing;
		// prProp.PageBreakBefore = prgrhPr.ParaPr.PageBreakBefore;
		// prProp.KeepLines = prgrhPr.ParaPr.KeepLines;

		// {
		//    ContextualSpacing : false,            // Удалять ли интервал между параграфами одинакового стиля
		//
		//    Ind :
		//    {
		//        Left      : 0,                    // Левый отступ
		//        Right     : 0,                    // Правый отступ
		//        FirstLine : 0                     // Первая строка
		//    },
		//    Jc : align_Left,                      // Прилегание параграфа
		//    KeepLines : false,                    // переносить параграф на новую страницу,
		//                                          // если на текущей он целиком не убирается
		//    PageBreakBefore : false,              // начинать параграф с новой страницы
		//
		//    Spacing :
		//    {
		//        Line     : 1.15,                  // Расстояние между строками внутри абзаца
		//        LineRule : linerule_Auto,         // Тип расстрояния между строками
		//        Before   : 0,                     // Дополнительное расстояние до абзаца
		//        After    : 10 * g_dKoef_pt_to_mm  // Дополнительное расстояние после абзаца
		//    }
		//	}

		// TODO: как только разъединят настройки параграфа и текста переделать тут
		var TextPr         = editor.WordControl.m_oLogicDocument.Get_Paragraph_TextPr();
		ParaPr.Subscript   = TextPr.VertAlign === AscCommon.vertalign_SubScript;
		ParaPr.Superscript = TextPr.VertAlign === AscCommon.vertalign_SuperScript;
		ParaPr.Strikeout   = TextPr.Strikeout;
		ParaPr.DStrikeout  = TextPr.DStrikeout;
		ParaPr.AllCaps     = TextPr.Caps;
		ParaPr.SmallCaps   = TextPr.SmallCaps;
		ParaPr.TextSpacing = TextPr.Spacing;
		ParaPr.Position    = TextPr.Position;
		//-----------------------------------------------------------------------------

		if (true === ParaPr.Spacing.AfterAutoSpacing)
			ParaPr.Spacing.After = AscCommonWord.spacing_Auto;
		else if (undefined === ParaPr.Spacing.AfterAutoSpacing)
			ParaPr.Spacing.After = AscCommonWord.UnknownValue;

		if (true === ParaPr.Spacing.BeforeAutoSpacing)
			ParaPr.Spacing.Before = AscCommonWord.spacing_Auto;
		else if (undefined === ParaPr.Spacing.BeforeAutoSpacing)
			ParaPr.Spacing.Before = AscCommonWord.UnknownValue;

		if (-1 === ParaPr.PStyle)
			ParaPr.StyleName = "";
		else if (undefined === ParaPr.PStyle || undefined === this.WordControl.m_oLogicDocument.Styles.Style[ParaPr.PStyle])
			ParaPr.StyleName = this.WordControl.m_oLogicDocument.Styles.Style[this.WordControl.m_oLogicDocument.Styles.Get_Default_Paragraph()].Name;
		else
			ParaPr.StyleName = this.WordControl.m_oLogicDocument.Styles.Style[ParaPr.PStyle].Name;

		var NumType    = -1;
		var NumSubType = -1;
		if (!(null == ParaPr.NumPr || 0 === ParaPr.NumPr.NumId || "0" === ParaPr.NumPr.NumId))
		{
			var Numb = this.WordControl.m_oLogicDocument.Numbering.Get_AbstractNum(ParaPr.NumPr.NumId);

			if (undefined !== Numb && undefined !== Numb.Lvl[ParaPr.NumPr.Lvl])
			{
				var res    = AscCommonWord.getNumInfoLvl(Numb.Lvl[ParaPr.NumPr.Lvl]);
				NumType    = res.NumType;
				NumSubType = res.NumSubType;
			}
		}

		ParaPr.ListType = {Type : NumType, SubType : NumSubType};

		if (undefined !== ParaPr.FramePr && undefined !== ParaPr.FramePr.Wrap)
		{
			if (AscCommonWord.wrap_NotBeside === ParaPr.FramePr.Wrap)
				ParaPr.FramePr.Wrap = false;
			else if (AscCommonWord.wrap_Around === ParaPr.FramePr.Wrap)
				ParaPr.FramePr.Wrap = true;
			else
				ParaPr.FramePr.Wrap = undefined;
		}

		this.sync_ParaSpacingLine(ParaPr.Spacing);
		this.Update_ParaInd(ParaPr.Ind);
		this.sync_PrAlignCallBack(ParaPr.Jc);
		this.sync_ParaStyleName(ParaPr.StyleName);
		this.sync_ListType(ParaPr.ListType);
		this.sync_PrPropCallback(ParaPr);
	};

	/*----------------------------------------------------------------*/
	/*functions for working with clipboard, document*/
	/*TODO: Print,Undo,Redo,Copy,Cut,Paste,Share,Save,DownloadAs,ReturnToDocuments(вернуться на предыдущую страницу) & callbacks for these functions*/
	asc_docs_api.prototype.asc_Print      = function(bIsDownloadEvent)
	{
		if (window["AscDesktopEditor"])
		{
			if (null != this.WordControl.m_oDrawingDocument.m_oDocumentRenderer)
			{
				if (window["AscDesktopEditor"]["IsSupportNativePrint"](this.DocumentUrl) === true)
				{
					window["AscDesktopEditor"]["Print"]();
					return;
				}
			}
			else
			{
				window["AscDesktopEditor"]["Print"]();
				return;
			}
		}
		this._print(c_oAscAsyncAction.Print, bIsDownloadEvent ? DownloadType.Print : DownloadType.None);
	};
	asc_docs_api.prototype._print         = function(actionType, downloadType)
	{
		var command;
		var options = {isNoData : false, downloadType : downloadType};
		if (null == this.WordControl.m_oLogicDocument)
		{
			command          = 'savefromorigin';
			options.isNoData = true;
		}
		else
		{
			command = 'save';
		}
		this._downloadAs(command, c_oAscFileType.PDF, actionType, options, null);
	};
	asc_docs_api.prototype.Undo           = function()
	{
		this.WordControl.m_oLogicDocument.Document_Undo();
	};
	asc_docs_api.prototype.Redo           = function()
	{
		this.WordControl.m_oLogicDocument.Document_Redo();
	};
	asc_docs_api.prototype.Copy           = function()
	{
		if (window["AscDesktopEditor"])
		{
		    window["asc_desktop_copypaste"](this, "Copy");
			return true;
		}
		return AscCommon.g_clipboardBase.Button_Copy();
	};
	asc_docs_api.prototype.Update_ParaTab = function(Default_Tab, ParaTabs)
	{
		this.WordControl.m_oDrawingDocument.Update_ParaTab(Default_Tab, ParaTabs);
	};
	asc_docs_api.prototype.Cut            = function()
	{
		if (window["AscDesktopEditor"])
		{
		    window["asc_desktop_copypaste"](this, "Cut");
			return true;
		}
		return AscCommon.g_clipboardBase.Button_Cut();
	};
	asc_docs_api.prototype.Paste          = function()
	{
		if (window["AscDesktopEditor"])
		{
		    window["asc_desktop_copypaste"](this, "Paste");
			return true;
		}
		if (!this.WordControl.m_oLogicDocument)
			return false;

		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			if (AscCommon.g_clipboardBase.IsWorking())
				return false;

			return AscCommon.g_clipboardBase.Button_Paste();
		}
	};

	asc_docs_api.prototype.Share = function()
	{

	};

	asc_docs_api.prototype.asc_CheckCopy = function(_clipboard /* CClipboardData */, _formats)
	{
		if (!this.WordControl.m_oLogicDocument)
		{
			var _text_object = (AscCommon.c_oAscClipboardDataFormat.Text & _formats) ? {Text : ""} : null;
			var _html_data   = this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.Copy(_text_object);

			//TEXT
			if (AscCommon.c_oAscClipboardDataFormat.Text & _formats)
			{
				_clipboard.pushData(AscCommon.c_oAscClipboardDataFormat.Text, _text_object.Text);
			}
			//HTML
			if (AscCommon.c_oAscClipboardDataFormat.Html & _formats)
			{
				_clipboard.pushData(AscCommon.c_oAscClipboardDataFormat.Html, _html_data);
			}
			return;
		}

		var sBase64 = null, _data;

		//TEXT
		if (AscCommon.c_oAscClipboardDataFormat.Text & _formats)
		{
			_data = this.WordControl.m_oLogicDocument.Get_SelectedText(false, {NewLineParagraph : true});
			_clipboard.pushData(AscCommon.c_oAscClipboardDataFormat.Text, _data)
		}
		//HTML
		if (AscCommon.c_oAscClipboardDataFormat.Html & _formats)
		{
			var oCopyProcessor = new AscCommon.CopyProcessor(this);
			sBase64            = oCopyProcessor.Start();
			_data              = oCopyProcessor.getInnerHtml();

			_clipboard.pushData(AscCommon.c_oAscClipboardDataFormat.Html, _data)
		}
		//INTERNAL
		if (AscCommon.c_oAscClipboardDataFormat.Internal & _formats)
		{
			if (sBase64 === null)
			{
				if(window["NATIVE_EDITOR_ENJINE"])
				{
					var oCopyProcessor = new AscCommon.CopyProcessor(this, true);
					sBase64 = oCopyProcessor.getSelectedBinary();
				}
				else
				{
					var oCopyProcessor = new AscCommon.CopyProcessor(this);
					sBase64 = oCopyProcessor.Start();
				}
			}

			_data = sBase64;
			_clipboard.pushData(AscCommon.c_oAscClipboardDataFormat.Internal, _data)
		}
	};

	asc_docs_api.prototype.asc_SelectionCut = function()
	{
	    if (AscCommon.CollaborativeEditing.Get_GlobalLock())
    	    return;

		var _logicDoc = this.WordControl.m_oLogicDocument;
		if (!_logicDoc)
			return;

		if (false === _logicDoc.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			History.Create_NewPoint(AscDFH.historydescription_Cut);
			_logicDoc.Remove(1, true, true);
			_logicDoc.Document_UpdateSelectionState();
		}
	};

	asc_docs_api.prototype.asc_PasteData = function(_format, data1, data2)
	{
	    if (AscCommon.CollaborativeEditing.Get_GlobalLock())
	        return;

		this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_PasteHotKey);
		switch (_format)
		{
			case AscCommon.c_oAscClipboardDataFormat.HtmlElement:
				AscCommon.Editor_Paste_Exec(this, data1, data2);
				break;
			case AscCommon.c_oAscClipboardDataFormat.Internal:
				AscCommon.Editor_Paste_Exec(this, null, null, data1);
				break;
			default:
				break;
		}
	};

	asc_docs_api.prototype.onSaveCallback = function(e, isUndoRequest)
	{
		var t = this;
		if (false == e["saveLock"])
		{
			if (this.isLongAction())
			{
				// Мы не можем в этот момент сохранять, т.к. попали в ситуацию, когда мы залочили сохранение и успели нажать вставку до ответа
				// Нужно снять lock с сохранения
				this.CoAuthoringApi.onUnSaveLock = function()
				{
					t.canSave    = true;
					t.IsUserSave = false;
				};
				this.CoAuthoringApi.unSaveLock();
				return;
			}
			this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);

			if (c_oAscCollaborativeMarksShowType.LastChanges === this.CollaborativeMarksShowType)
			{
				AscCommon.CollaborativeEditing.Clear_CollaborativeMarks();
			}

			// Принимаем чужие изменения
			var HaveOtherChanges = AscCommon.CollaborativeEditing.Have_OtherChanges();
			AscCommon.CollaborativeEditing.Apply_Changes();

			this.CoAuthoringApi.onUnSaveLock = function()
			{
				t.CoAuthoringApi.onUnSaveLock = null;

				// Выставляем, что документ не модифицирован
				t.CheckChangedDocument();
				t.canSave    = true;
				t.IsUserSave = false;
				t.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);

				// Обновляем состояние возможности сохранения документа
				t._onUpdateDocumentCanSave();

				if (undefined !== window["AscDesktopEditor"])
				{
					window["AscDesktopEditor"]["OnSave"]();
				}
			};

			var CursorInfo = null;
			if (true === AscCommon.CollaborativeEditing.Is_Fast())
			{
				CursorInfo = History.Get_DocumentPositionBinary();
			}

			if (isUndoRequest)
			{
				AscCommon.CollaborativeEditing.Set_GlobalLock(false);
				AscCommon.CollaborativeEditing.Undo();
			}
			else
			{
				// Пересылаем свои изменения
				AscCommon.CollaborativeEditing.Send_Changes(this.IsUserSave, {
					UserId      : this.CoAuthoringApi.getUserConnectionId(),
					UserShortId : this.DocInfo.get_UserId(),
					CursorInfo  : CursorInfo
				}, HaveOtherChanges);
			}
		}
		else
		{
			var nState = this.CoAuthoringApi.get_state();
			if (AscCommon.ConnectionState.ClosedCoAuth === nState || AscCommon.ConnectionState.ClosedAll === nState)
			{
				// Отключаемся от сохранения, соединение потеряно
				this.canSave    = true;
				this.IsUserSave = false;
			}
			else
			{
				var TimeoutInterval = (true === AscCommon.CollaborativeEditing.Is_Fast() ? 1 : 1000);
				setTimeout(function()
				{
					t.CoAuthoringApi.askSaveChanges(function(event)
					{
						t.onSaveCallback(event, isUndoRequest);
					});
				}, TimeoutInterval);
			}
		}
	};

	asc_docs_api.prototype.asc_Save           = function(isAutoSave, isUndoRequest)
	{
		this.IsUserSave = !isAutoSave;
		if (true === this.canSave && !this.isLongAction())
		{
			this.canSave = false;

			var t = this;
			this.CoAuthoringApi.askSaveChanges(function(e)
			{
				t.onSaveCallback(e, isUndoRequest);
			});
		}
	};
	asc_docs_api.prototype.asc_DownloadOrigin = function(bIsDownloadEvent)
	{
		//скачивание оригинального pdf, djvu, xps
		var downloadType = bIsDownloadEvent ? DownloadType.Download : DownloadType.None;
		var rData        = {
			"id"    : this.documentId,
			"c"     : 'pathurl',
			"title" : this.documentTitle,
			"data"  : 'origin.' + this.documentFormat
		};
		var t            = this;
		t.fCurCallback   = function(input)
		{
			if (null != input && "pathurl" == input["type"])
			{
				if ('ok' == input["status"])
				{
					var url = input["data"];
					if (url)
					{
						t.processSavedFile(url, downloadType);
					}
					else
					{
						t.handlers.trigger("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.NoCritical);
					}
				}
				else
				{
					t.handlers.trigger("asc_onError", mapAscServerErrorToAscError(parseInt(input["data"])),
						c_oAscError.Level.NoCritical);
				}
			}
			else
			{
				t.handlers.trigger("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.NoCritical);
			}
		};
		sendCommand(this, null, rData);
	};
	asc_docs_api.prototype.asc_DownloadAs     = function(typeFile, bIsDownloadEvent)
	{//передаем число соответствующее своему формату.
		var actionType = this.mailMergeFileData ? c_oAscAsyncAction.MailMergeLoadFile : c_oAscAsyncAction.DownloadAs;
		var options    = {downloadType : bIsDownloadEvent ? DownloadType.Download : DownloadType.None};
		this._downloadAs("save", typeFile, actionType, options, null);
	};
	asc_docs_api.prototype.Resize             = function()
	{
		if (false === this.bInit_word_control)
			return;
		this.WordControl.OnResize(false);
	};
	asc_docs_api.prototype.AddURL             = function(url)
	{

	};
	asc_docs_api.prototype.Help               = function()
	{

	};
	/*
	 idOption идентификатор дополнительного параметра, c_oAscAdvancedOptionsID.TXT.
	 option - какие свойства применить, пока массив. для TXT объект asc_CTXTAdvancedOptions(codepage)
	 exp:	asc_setAdvancedOptions(c_oAscAdvancedOptionsID.TXT, new Asc.asc_CCSVAdvancedOptions(1200) );
	 */
	asc_docs_api.prototype.asc_setAdvancedOptions       = function(idOption, option)
	{
		switch (idOption)
		{
			case c_oAscAdvancedOptionsID.TXT:
				// Проверяем тип состояния в данный момент
				if (this.advancedOptionsAction === c_oAscAdvancedOptionsAction.Open)
				{
					var rData = {
						"id"            : this.documentId,
						"userid"        : this.documentUserId,
						"format"        : this.documentFormat,
						"c"             : "reopen",
						"url"           : this.documentUrl,
						"title"         : this.documentTitle,
						"codepage"      : option.asc_getCodePage(),
						"embeddedfonts" : this.isUseEmbeddedCutFonts
					};
					sendCommand(this, null, rData);
				}
				else if (this.advancedOptionsAction === c_oAscAdvancedOptionsAction.Save)
				{
					var options       = {txtOptions : option, downloadType : this.downloadType};
					this.downloadType = DownloadType.None;
					this._downloadAs("save", c_oAscFileType.TXT, c_oAscAsyncAction.DownloadAs, options, null);
				}
				break;
			case c_oAscAdvancedOptionsID.DRM:
				if (this.advancedOptionsAction === c_oAscAdvancedOptionsAction.Open) {
					var v = {
						"id": this.documentId,
						"userid": this.documentUserId,
						"format": this.documentFormat,
						"c": "reopen",
						"url": this.documentUrl,
						"title": this.documentTitle,
						"embeddedfonts": this.isUseEmbeddedCutFonts,
						"password": option.asc_getPassword()
					};

					sendCommand(this, null, v);
				}
				break;
		}
	};
	asc_docs_api.prototype.SetFontRenderingMode         = function(mode)
	{
		if (!this.isLoadFullApi)
		{
			this.tmpFontRenderingMode = mode;
			return;
		}

		if (c_oAscFontRenderingModeType.noHinting === mode)
			AscCommon.SetHintsProps(false, false);
		else if (c_oAscFontRenderingModeType.hinting === mode)
			AscCommon.SetHintsProps(true, false);
		else if (c_oAscFontRenderingModeType.hintingAndSubpixeling === mode)
			AscCommon.SetHintsProps(true, true);

		this.WordControl.m_oDrawingDocument.ClearCachePages();
		AscCommon.g_fontManager.ClearFontsRasterCache();

		if (window.g_fontManager2 !== undefined && window.g_fontManager2 !== null)
			window.g_fontManager2.ClearFontsRasterCache();

		if (this.bInit_word_control)
			this.WordControl.OnScroll();
	};
	asc_docs_api.prototype.processSavedFile             = function(url, downloadType)
	{
		var t = this;
		if (this.mailMergeFileData)
		{
			this.mailMergeFileData = null;
			AscCommon.loadFileContent(url, function(result)
			{
				if (null === result)
				{
					t.sendEvent("asc_onError", c_oAscError.ID.MailMergeLoadFile, c_oAscError.Level.NoCritical);
					return;
				}
				try
				{
					t.asc_StartMailMergeByList(JSON.parse(result));
				} catch (e)
				{
					t.sendEvent("asc_onError", c_oAscError.ID.MailMergeLoadFile, c_oAscError.Level.NoCritical);
				}
			});
		}
		else
		{
			asc_docs_api.superclass.processSavedFile.call(this, url, downloadType);
		}
	};
	asc_docs_api.prototype.startGetDocInfo              = function()
	{
		/*
		 Возвращаем объект следующего вида:
		 {
		 PageCount: 12,
		 WordsCount: 2321,
		 ParagraphCount: 45,
		 SymbolsCount: 232345,
		 SymbolsWSCount: 34356
		 }
		 */
		this.sync_GetDocInfoStartCallback();

		if (null != this.WordControl.m_oDrawingDocument.m_oDocumentRenderer)
		{
			var _render = this.WordControl.m_oDrawingDocument.m_oDocumentRenderer;

			var obj = {
				PageCount      : _render.PagesCount,
				WordsCount     : _render.CountWords,
				ParagraphCount : _render.CountParagraphs,
				SymbolsCount   : _render.CountSymbols,
				SymbolsWSCount : (_render.CountSymbols + _render.CountSpaces)
			};

			this.sendEvent("asc_onDocInfo", new CDocInfoProp(obj));

			this.sync_GetDocInfoEndCallback();
		}
		else
		{
			this.WordControl.m_oLogicDocument.Statistics_Start();
		}
	};
	asc_docs_api.prototype.stopGetDocInfo               = function()
	{
		this.sync_GetDocInfoStopCallback();

		if (null != this.WordControl.m_oLogicDocument)
			this.WordControl.m_oLogicDocument.Statistics_Stop();
	};
	asc_docs_api.prototype.sync_DocInfoCallback         = function(obj)
	{
		this.sendEvent("asc_onDocInfo", new CDocInfoProp(obj));
	};
	asc_docs_api.prototype.sync_GetDocInfoStartCallback = function()
	{
		this.sendEvent("asc_onGetDocInfoStart");
	};
	asc_docs_api.prototype.sync_GetDocInfoStopCallback  = function()
	{
		this.sendEvent("asc_onGetDocInfoStop");
	};
	asc_docs_api.prototype.sync_GetDocInfoEndCallback   = function()
	{
		this.sendEvent("asc_onGetDocInfoEnd");
	};
	asc_docs_api.prototype.sync_CanUndoCallback         = function(bCanUndo)
	{
		this.sendEvent("asc_onCanUndo", bCanUndo);
	};
	asc_docs_api.prototype.sync_CanRedoCallback         = function(bCanRedo)
	{
		if (true === AscCommon.CollaborativeEditing.Is_Fast() && true !== AscCommon.CollaborativeEditing.Is_SingleUser())
			bCanRedo = false;

		this.sendEvent("asc_onCanRedo", bCanRedo);
	};

	asc_docs_api.prototype.can_CopyCut = function()
	{
		return this.WordControl.m_oLogicDocument.Can_CopyCut();
	};

	asc_docs_api.prototype.sync_CanCopyCutCallback = function(bCanCopyCut)
	{
		this.sendEvent("asc_onCanCopyCut", bCanCopyCut);
	};

	asc_docs_api.prototype.setStartPointHistory = function()
	{
		this.noCreatePoint  = true;
		this.exucuteHistory = true;
		this.incrementCounterLongAction();
		this.WordControl.m_oLogicDocument.TurnOff_InterfaceEvents();
	};
	asc_docs_api.prototype.setEndPointHistory   = function()
	{
		this.noCreatePoint     = false;
		this.exucuteHistoryEnd = true;
		this.decrementCounterLongAction();
		this.WordControl.m_oLogicDocument.TurnOn_InterfaceEvents();
	};

	function CDocInfoProp(obj)
	{
		if (obj)
		{
			this.PageCount      = obj.PageCount;
			this.WordsCount     = obj.WordsCount;
			this.ParagraphCount = obj.ParagraphCount;
			this.SymbolsCount   = obj.SymbolsCount;
			this.SymbolsWSCount = obj.SymbolsWSCount;
		}
		else
		{
			this.PageCount      = -1;
			this.WordsCount     = -1;
			this.ParagraphCount = -1;
			this.SymbolsCount   = -1;
			this.SymbolsWSCount = -1;
		}
	}

	CDocInfoProp.prototype.get_PageCount      = function()
	{
		return this.PageCount;
	};
	CDocInfoProp.prototype.put_PageCount      = function(v)
	{
		this.PageCount = v;
	};
	CDocInfoProp.prototype.get_WordsCount     = function()
	{
		return this.WordsCount;
	};
	CDocInfoProp.prototype.put_WordsCount     = function(v)
	{
		this.WordsCount = v;
	};
	CDocInfoProp.prototype.get_ParagraphCount = function()
	{
		return this.ParagraphCount;
	};
	CDocInfoProp.prototype.put_ParagraphCount = function(v)
	{
		this.ParagraphCount = v;
	};
	CDocInfoProp.prototype.get_SymbolsCount   = function()
	{
		return this.SymbolsCount;
	};
	CDocInfoProp.prototype.put_SymbolsCount   = function(v)
	{
		this.SymbolsCount = v;
	};
	CDocInfoProp.prototype.get_SymbolsWSCount = function()
	{
		return this.SymbolsWSCount;
	};
	CDocInfoProp.prototype.put_SymbolsWSCount = function(v)
	{
		this.SymbolsWSCount = v;
	};

	/*callbacks*/
	/*asc_docs_api.prototype.sync_CursorLockCallBack = function(isLock){
	 this.sendEvent("asc_onCursorLock",isLock);
	 }*/
	asc_docs_api.prototype.sync_UndoCallBack       = function()
	{
		this.sendEvent("asc_onUndo");
	};
	asc_docs_api.prototype.sync_RedoCallBack       = function()
	{
		this.sendEvent("asc_onRedo");
	};
	asc_docs_api.prototype.sync_CopyCallBack       = function()
	{
		this.sendEvent("asc_onCopy");
	};
	asc_docs_api.prototype.sync_CutCallBack        = function()
	{
		this.sendEvent("asc_onCut");
	};
	asc_docs_api.prototype.sync_PasteCallBack      = function()
	{
		this.sendEvent("asc_onPaste");
	};
	asc_docs_api.prototype.sync_ShareCallBack      = function()
	{
		this.sendEvent("asc_onShare");
	};
	asc_docs_api.prototype.sync_SaveCallBack       = function()
	{
		this.sendEvent("asc_onSave");
	};
	asc_docs_api.prototype.sync_DownloadAsCallBack = function()
	{
		this.sendEvent("asc_onDownload");
	};

	asc_docs_api.prototype.sync_AddURLCallback  = function()
	{
		this.sendEvent("asc_onAddURL");
	};
	asc_docs_api.prototype.sync_ErrorCallback   = function(errorID, errorLevel)
	{
		this.sendEvent("asc_onError", errorID, errorLevel);
	};
	asc_docs_api.prototype.sync_HelpCallback    = function(url)
	{
		this.sendEvent("asc_onHelp", url);
	};
	asc_docs_api.prototype.sync_UpdateZoom      = function(zoom)
	{
		this.sendEvent("asc_onZoom", zoom);
	};
	asc_docs_api.prototype.ClearPropObjCallback = function(prop)
	{//колбэк предшествующий приходу свойств объекта, prop а всякий случай
		this.sendEvent("asc_onClearPropObj", prop);
	};

	// mobile version methods:
	asc_docs_api.prototype.asc_GetDefaultTableStyles = function()
	{
		if (!this.WordControl.m_oLogicDocument)
			return;




		this.WordControl.m_oDrawingDocument.StartTableStylesCheck();
		this.WordControl.m_oDrawingDocument.TableStylesСheckLook = new Asc.CTablePropLook();
		this.WordControl.m_oDrawingDocument.TableStylesСheckLook.FirstCol = true;
		this.WordControl.m_oDrawingDocument.TableStylesСheckLook.FirstRow = true;
		this.WordControl.m_oDrawingDocument.TableStylesСheckLook.BandHor  = true;
		this.WordControl.m_oDrawingDocument.EndTableStylesCheck();
	};

	/*----------------------------------------------------------------*/
	/*functions for working with headers*/
	/*
	 структура заголовков, предварительно, выглядит так
	 {
	 headerText: "Header1",//заголовок
	 pageNumber: 0, //содержит номер страницы, где находится искомая последовательность
	 X: 0,//координаты по OX начала последовательности на данной страницы
	 Y: 0,//координаты по OY начала последовательности на данной страницы
	 level: 0//уровень заголовка
	 }
	 заголовки приходят либо в списке, либо последовательно.
	 */
	// CHeader
	function CHeader(obj)
	{
		if (obj)
		{
			this.headerText = (undefined != obj.headerText) ? obj.headerText : null;	//заголовок
			this.pageNumber = (undefined != obj.pageNumber) ? obj.pageNumber : null;	//содержит номер страницы, где находится искомая последовательность
			this.X          = (undefined != obj.X) ? obj.X : null;								//координаты по OX начала последовательности на данной страницы
			this.Y          = (undefined != obj.Y) ? obj.Y : null;								//координаты по OY начала последовательности на данной страницы
			this.level      = (undefined != obj.level) ? obj.level : null;					//позиция заголовка
		}
		else
		{
			this.headerText = null;				//заголовок
			this.pageNumber = null;				//содержит номер страницы, где находится искомая последовательность
			this.X          = null;						//координаты по OX начала последовательности на данной страницы
			this.Y          = null;						//координаты по OY начала последовательности на данной страницы
			this.level      = null;					//позиция заголовка
		}
	}

	CHeader.prototype.get_headerText = function()
	{
		return this.headerText;
	};
	CHeader.prototype.get_pageNumber = function()
	{
		return this.pageNumber;
	};
	CHeader.prototype.get_X          = function()
	{
		return this.X;
	};
	CHeader.prototype.get_Y          = function()
	{
		return this.Y;
	};
	CHeader.prototype.get_Level      = function()
	{
		return this.level;
	};
	var _fakeHeaders                 = [
		new CHeader({headerText : "Header1", pageNumber : 0, X : 0, Y : 0, level : 1}),
		new CHeader({headerText : "Header2", pageNumber : 0, X : 0, Y : 0, level : 1}),
		new CHeader({headerText : "Header3", pageNumber : 0, X : 0, Y : 0, level : 2}),
		new CHeader({headerText : "Header4", pageNumber : 0, X : 0, Y : 0, level : 1}),
		new CHeader({headerText : "Header5", pageNumber : 0, X : 0, Y : 0, level : 1}),
		new CHeader({headerText : "Header5", pageNumber : 0, X : 0, Y : 0, level : 1}),
		new CHeader({headerText : "Header5", pageNumber : 0, X : 0, Y : 0, level : 2}),
		new CHeader({headerText : "Header5", pageNumber : 0, X : 0, Y : 0, level : 3}),
		new CHeader({headerText : "Header3", pageNumber : 0, X : 0, Y : 0, level : 4}),
		new CHeader({headerText : "Header3", pageNumber : 0, X : 0, Y : 0, level : 5}),
		new CHeader({headerText : "Header3", pageNumber : 0, X : 0, Y : 0, level : 6}),
		new CHeader({headerText : "Header4", pageNumber : 0, X : 0, Y : 0, level : 7}),
		new CHeader({headerText : "Header5", pageNumber : 0, X : 0, Y : 0, level : 8}),
		new CHeader({headerText : "Header5", pageNumber : 0, X : 0, Y : 0, level : 1}),
		new CHeader({headerText : "Header5", pageNumber : 0, X : 0, Y : 0, level : 1}),
		new CHeader({headerText : "Header5", pageNumber : 0, X : 0, Y : 0, level : 2}),
		new CHeader({headerText : "Header5", pageNumber : 0, X : 0, Y : 0, level : 3}),
		new CHeader({headerText : "Header6", pageNumber : 0, X : 0, Y : 0, level : 1}),
		new CHeader({headerText : "Header5", pageNumber : 0, X : 0, Y : 0, level : 0}),
		new CHeader({headerText : "Header5", pageNumber : 0, X : 0, Y : 0, level : 1}),
		new CHeader({headerText : "Header5", pageNumber : 0, X : 0, Y : 0, level : 0}),
		new CHeader({headerText : "Header5", pageNumber : 0, X : 0, Y : 0, level : 0})
	];

	asc_docs_api.prototype.CollectHeaders                  = function()
	{
		this.sync_ReturnHeadersCallback(_fakeHeaders);
	};
	asc_docs_api.prototype.GetActiveHeader                 = function()
	{

	};
	asc_docs_api.prototype.gotoHeader                      = function(page, X, Y)
	{
		this.goToPage(page);
	};
	asc_docs_api.prototype.sync_ChangeActiveHeaderCallback = function(position, header)
	{
		this.sendEvent("asc_onChangeActiveHeader", position, new CHeader(header));
	};
	asc_docs_api.prototype.sync_ReturnHeadersCallback      = function(headers)
	{
		var _headers = [];
		for (var i = 0; i < headers.length; i++)
		{
			_headers[i] = new CHeader(headers[i]);
		}

		this.sendEvent("asc_onReturnHeaders", _headers);
	};
	/*----------------------------------------------------------------*/
	/*functions for working with search*/
	/*
	 структура поиска, предварительно, выглядит так
	 {
	 text: "...<b>слово поиска</b>...",
	 pageNumber: 0, //содержит номер страницы, где находится искомая последовательность
	 X: 0,//координаты по OX начала последовательности на данной страницы
	 Y: 0//координаты по OY начала последовательности на данной страницы
	 }
	 */

	asc_docs_api.prototype.asc_searchEnabled = function(bIsEnabled)
	{
		if (null != this.WordControl.m_oDrawingDocument.m_oDocumentRenderer)
		{
			this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.SearchResults.IsSearch = false;
			this.WordControl.OnUpdateOverlay();
		}
	};

	asc_docs_api.prototype.asc_findText = function(text, isNext, isMatchCase)
	{
		if (null != this.WordControl.m_oDrawingDocument.m_oDocumentRenderer)
		{
			this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.findText(text, isMatchCase, isNext);
			return this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.SearchResults.Count;
		}

		var SearchEngine = editor.WordControl.m_oLogicDocument.Search(text, {MatchCase : isMatchCase});

		var Id = this.WordControl.m_oLogicDocument.Search_GetId(isNext);

		if (null != Id)
			this.WordControl.m_oLogicDocument.Search_Select(Id);

		return SearchEngine.Count;
	};

	asc_docs_api.prototype.asc_replaceText = function(text, replaceWith, isReplaceAll, isMatchCase)
	{
		if (null == this.WordControl.m_oLogicDocument)
			return;

		this.WordControl.m_oLogicDocument.Search(text, {MatchCase : isMatchCase});

		if (true === isReplaceAll)
			this.WordControl.m_oLogicDocument.Search_Replace(replaceWith, true, -1);
		else
		{
			var CurId      = this.WordControl.m_oLogicDocument.SearchEngine.CurId;
			var bDirection = this.WordControl.m_oLogicDocument.SearchEngine.Direction;
			if (-1 != CurId)
				this.WordControl.m_oLogicDocument.Search_Replace(replaceWith, false, CurId);

			var Id = this.WordControl.m_oLogicDocument.Search_GetId(bDirection);

			if (null != Id)
			{
				this.WordControl.m_oLogicDocument.Search_Select(Id);
				return true;
			}

			return false;
		}
	};

	asc_docs_api.prototype.asc_selectSearchingResults = function(bShow)
	{
		if (null != this.WordControl.m_oDrawingDocument.m_oDocumentRenderer)
		{
			this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.SearchResults.Show = bShow;
			this.WordControl.OnUpdateOverlay();
			return;
		}
		this.WordControl.m_oLogicDocument.Search_Set_Selection(bShow);
	};

	asc_docs_api.prototype.asc_isSelectSearchingResults = function()
	{
		if (null != this.WordControl.m_oDrawingDocument.m_oDocumentRenderer)
		{
			return this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.SearchResults.Show;
		}
		return this.WordControl.m_oLogicDocument.Search_Get_Selection();
	};

	asc_docs_api.prototype.sync_ReplaceAllCallback = function(ReplaceCount, OverallCount)
	{
		this.sendEvent("asc_onReplaceAll", ReplaceCount, OverallCount);
	};

	asc_docs_api.prototype.sync_SearchEndCallback = function()
	{
		this.sendEvent("asc_onSearchEnd");
	};
	/*----------------------------------------------------------------*/
	/*functions for working with font*/
	/*setters*/
	asc_docs_api.prototype.put_TextPrFontName = function(name)
	{
		var loader   = AscCommon.g_font_loader;
		var fontinfo = g_fontApplication.GetFontInfo(name);
		var isasync  = loader.LoadFont(fontinfo);
		if (false === isasync)
		{
			if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
			{
				this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetTextFontName);
				this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({
					FontFamily : {
						Name  : name,
						Index : -1
					}
				}));
			}
		}
	};
	asc_docs_api.prototype.put_TextPrFontSize = function(size)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetTextFontSize);
			this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({FontSize : Math.min(size, 100)}));
		}
	};

	asc_docs_api.prototype.put_TextPrBold       = function(value)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetTextBold);
			this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({Bold : value}));
		}
	};
	asc_docs_api.prototype.put_TextPrItalic     = function(value)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetTextItalic);
			this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({Italic : value}));
		}
	};
	asc_docs_api.prototype.put_TextPrUnderline  = function(value)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetTextUnderline);
			this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({Underline : value}));

			if (true === this.isMarkerFormat)
				this.sync_MarkerFormatCallback(false);
		}
	};
	asc_docs_api.prototype.put_TextPrStrikeout  = function(value)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetTextStrikeout);
			this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({
				Strikeout  : value,
				DStrikeout : false
			}));

			if (true === this.isMarkerFormat)
				this.sync_MarkerFormatCallback(false);
		}
	};
	asc_docs_api.prototype.put_TextPrDStrikeout = function(value)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetTextDStrikeout);
			this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({
				DStrikeout : value,
				Strikeout  : false
			}));

			if (true === this.isMarkerFormat)
				this.sync_MarkerFormatCallback(false);
		}
	};
	asc_docs_api.prototype.put_TextPrSpacing    = function(value)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetTextSpacing);
			this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({Spacing : value}));

			if (true === this.isMarkerFormat)
				this.sync_MarkerFormatCallback(false);
		}
	};

	asc_docs_api.prototype.put_TextPrCaps = function(value)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetTextCaps);
			this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({
				Caps      : value,
				SmallCaps : false
			}));

			if (true === this.isMarkerFormat)
				this.sync_MarkerFormatCallback(false);
		}
	};

	asc_docs_api.prototype.put_TextPrSmallCaps = function(value)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetTextSmallCaps);
			this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({
				SmallCaps : value,
				Caps      : false
			}));

			if (true === this.isMarkerFormat)
				this.sync_MarkerFormatCallback(false);
		}
	};


	asc_docs_api.prototype.put_TextPrPosition = function(value)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetTextPosition);
			this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({Position : value}));

			if (true === this.isMarkerFormat)
				this.sync_MarkerFormatCallback(false);
		}
	};

	asc_docs_api.prototype.put_TextPrLang = function(value)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetTextLang);
			this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({Lang : {Val : value}}));

			this.WordControl.m_oLogicDocument.Spelling.Check_CurParas();

			if (true === this.isMarkerFormat)
				this.sync_MarkerFormatCallback(false);
		}
	};


	asc_docs_api.prototype.put_PrLineSpacing          = function(Type, Value)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetParagraphLineSpacing);
			this.WordControl.m_oLogicDocument.Set_ParagraphSpacing({LineRule : Type, Line : Value});

			var ParaPr = this.get_TextProps().ParaPr;
			if (null != ParaPr)
				this.sync_ParaSpacingLine(ParaPr.Spacing);
		}
	};
	asc_docs_api.prototype.put_LineSpacingBeforeAfter = function(type, value)//"type == 0" means "Before", "type == 1" means "After"
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetParagraphLineSpacingBeforeAfter);
			switch (type)
			{
				case 0:
				{
					if (AscCommonWord.spacing_Auto === value)
						this.WordControl.m_oLogicDocument.Set_ParagraphSpacing({BeforeAutoSpacing : true});
					else
						this.WordControl.m_oLogicDocument.Set_ParagraphSpacing({
							Before            : value,
							BeforeAutoSpacing : false
						});

					break;
				}
				case 1:
				{
					if (AscCommonWord.spacing_Auto === value)
						this.WordControl.m_oLogicDocument.Set_ParagraphSpacing({AfterAutoSpacing : true});
					else
						this.WordControl.m_oLogicDocument.Set_ParagraphSpacing({
							After            : value,
							AfterAutoSpacing : false
						});

					break;
				}
			}
		}
	};
	asc_docs_api.prototype.FontSizeIn                 = function()
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_IncFontSize);
			this.WordControl.m_oLogicDocument.Paragraph_IncDecFontSize(true);
		}
	};
	asc_docs_api.prototype.FontSizeOut                = function()
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_DecFontSize);
			this.WordControl.m_oLogicDocument.Paragraph_IncDecFontSize(false);
		}
	};
	// Object:
	// {
	//    Bottom :
	//    {
	//        Color : { r : 0, g : 0, b : 0 },
	//        Value : border_Single,
	//        Size  : 0.5 * g_dKoef_pt_to_mm
	//        Space : 0
	//    },
	//    Left :
	//    {
	//        ....
	//    }
	//    Right :
	//    {
	//        ....
	//    }
	//    Top :
	//    {
	//        ....
	//    }
	//    },
	//    Between :
	//    {
	//        ....
	//    }
	// }


	asc_docs_api.prototype.put_Borders = function(Obj)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetParagraphBorders);
			this.WordControl.m_oLogicDocument.Set_ParagraphBorders(Obj);
		}
	};
	/*callbacks*/
	asc_docs_api.prototype.sync_BoldCallBack             = function(isBold)
	{
		this.sendEvent("asc_onBold", isBold);
	};
	asc_docs_api.prototype.sync_ItalicCallBack           = function(isItalic)
	{
		this.sendEvent("asc_onItalic", isItalic);
	};
	asc_docs_api.prototype.sync_UnderlineCallBack        = function(isUnderline)
	{
		this.sendEvent("asc_onUnderline", isUnderline);
	};
	asc_docs_api.prototype.sync_StrikeoutCallBack        = function(isStrikeout)
	{
		this.sendEvent("asc_onStrikeout", isStrikeout);
	};
	asc_docs_api.prototype.sync_TextPrFontFamilyCallBack = function(FontFamily)
	{
		if (undefined != FontFamily)
			this.sendEvent("asc_onFontFamily", new asc_CTextFontFamily(FontFamily));
		else
			this.sendEvent("asc_onFontFamily", new asc_CTextFontFamily({Name : "", Index : -1}));
	};
	asc_docs_api.prototype.sync_TextPrFontSizeCallBack   = function(FontSize)
	{
		this.sendEvent("asc_onFontSize", FontSize);
	};
	asc_docs_api.prototype.sync_PrLineSpacingCallBack    = function(LineSpacing)
	{
		this.sendEvent("asc_onLineSpacing", new Asc.asc_CParagraphInd(LineSpacing));
	};
	asc_docs_api.prototype.sync_InitEditorStyles         = function(styles_painter)
	{
		if (!this.isViewMode) {
			this.sendEvent("asc_onInitEditorStyles", styles_painter);
		}
	};
	asc_docs_api.prototype.sync_InitEditorTableStyles    = function(styles, is_retina_enabled)
	{
		if (!this.isViewMode) {
			this.sendEvent("asc_onInitTableTemplates", styles, is_retina_enabled);
		}
	};


	/*----------------------------------------------------------------*/
	/*functions for working with paragraph*/
	/*setters*/
	// Right = 0; Left = 1; Center = 2; Justify = 3; or using enum that written above

	/* структура для параграфа
	 Ind :
	 {
	 Left      : 0,                    // Левый отступ
	 Right     : 0,                    // Правый отступ
	 FirstLine : 0                     // Первая строка
	 }
	 Spacing :
	 {
	 Line     : 1.15,                  // Расстояние между строками внутри абзаца
	 LineRule : linerule_Auto,         // Тип расстрояния между строками
	 Before   : 0,                     // Дополнительное расстояние до абзаца
	 After    : 10 * g_dKoef_pt_to_mm  // Дополнительное расстояние после абзаца
	 },
	 KeepLines : false,                    // переносить параграф на новую страницу,
	 // если на текущей он целиком не убирается
	 PageBreakBefore : false
	 */

	asc_docs_api.prototype.paraApply = function(Props)
	{
		var Additional = undefined;
		if (undefined != Props.DefaultTab)
			Additional = {
				Type      : AscCommon.changestype_2_Element_and_Type,
				Element   : this.WordControl.m_oLogicDocument,
				CheckType : AscCommon.changestype_Document_SectPr
			};

		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties, Additional))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetParagraphPr);

			// TODO: Сделать так, чтобы пересчет был всего 1 здесь
			if ("undefined" != typeof(Props.ContextualSpacing) && null != Props.ContextualSpacing)
				this.WordControl.m_oLogicDocument.Set_ParagraphContextualSpacing(Props.ContextualSpacing);

			if ("undefined" != typeof(Props.Ind) && null != Props.Ind)
				this.WordControl.m_oLogicDocument.Set_ParagraphIndent(Props.Ind);

			if ("undefined" != typeof(Props.Jc) && null != Props.Jc)
				this.WordControl.m_oLogicDocument.Set_ParagraphAlign(Props.Jc);

			if ("undefined" != typeof(Props.KeepLines) && null != Props.KeepLines)
				this.WordControl.m_oLogicDocument.Set_ParagraphKeepLines(Props.KeepLines);

			if (undefined != Props.KeepNext && null != Props.KeepNext)
				this.WordControl.m_oLogicDocument.Set_ParagraphKeepNext(Props.KeepNext);

			if (undefined != Props.WidowControl && null != Props.WidowControl)
				this.WordControl.m_oLogicDocument.Set_ParagraphWidowControl(Props.WidowControl);

			if ("undefined" != typeof(Props.PageBreakBefore) && null != Props.PageBreakBefore)
				this.WordControl.m_oLogicDocument.Set_ParagraphPageBreakBefore(Props.PageBreakBefore);

			if ("undefined" != typeof(Props.Spacing) && null != Props.Spacing)
				this.WordControl.m_oLogicDocument.Set_ParagraphSpacing(Props.Spacing);

			if ("undefined" != typeof(Props.Shd) && null != Props.Shd)
			{
				var Unifill        = new AscFormat.CUniFill();
				Unifill.fill       = new AscFormat.CSolidFill();
				Unifill.fill.color = AscFormat.CorrectUniColor(Props.Shd.Color, Unifill.fill.color, 1);
				this.WordControl.m_oLogicDocument.Set_ParagraphShd(
					{
						Value   : Props.Shd.Value,
						Color   : {
							r : Props.Shd.Color.asc_getR(),
							g : Props.Shd.Color.asc_getG(),
							b : Props.Shd.Color.asc_getB()
						},
						Unifill : Unifill
					});
			}

			if ("undefined" != typeof(Props.Brd) && null != Props.Brd)
			{
				if (Props.Brd.Left && Props.Brd.Left.Color)
				{
					Props.Brd.Left.Unifill = AscFormat.CreateUnifillFromAscColor(Props.Brd.Left.Color);
				}
				if (Props.Brd.Top && Props.Brd.Top.Color)
				{
					Props.Brd.Top.Unifill = AscFormat.CreateUnifillFromAscColor(Props.Brd.Top.Color);
				}
				if (Props.Brd.Right && Props.Brd.Right.Color)
				{
					Props.Brd.Right.Unifill = AscFormat.CreateUnifillFromAscColor(Props.Brd.Right.Color);
				}
				if (Props.Brd.Bottom && Props.Brd.Bottom.Color)
				{
					Props.Brd.Bottom.Unifill = AscFormat.CreateUnifillFromAscColor(Props.Brd.Bottom.Color);
				}
				if (Props.Brd.InsideH && Props.Brd.InsideH.Color)
				{
					Props.Brd.InsideH.Unifill = AscFormat.CreateUnifillFromAscColor(Props.Brd.InsideH.Color);
				}
				if (Props.Brd.InsideV && Props.Brd.InsideV.Color)
				{
					Props.Brd.InsideV.Unifill = AscFormat.CreateUnifillFromAscColor(Props.Brd.InsideV.Color);
				}

				this.WordControl.m_oLogicDocument.Set_ParagraphBorders(Props.Brd);
			}

			if (undefined != Props.Tabs)
			{
				var Tabs = new AscCommonWord.CParaTabs();
				Tabs.Set_FromObject(Props.Tabs.Tabs);
				this.WordControl.m_oLogicDocument.Set_ParagraphTabs(Tabs);
			}

			if (undefined != Props.DefaultTab)
			{
				this.WordControl.m_oLogicDocument.Set_DocumentDefaultTab(Props.DefaultTab);
			}


			// TODO: как только разъединят настройки параграфа и текста переделать тут
			var TextPr = new AscCommonWord.CTextPr();

			if (true === Props.Subscript)
				TextPr.VertAlign = AscCommon.vertalign_SubScript;
			else if (true === Props.Superscript)
				TextPr.VertAlign = AscCommon.vertalign_SuperScript;
			else if (false === Props.Superscript || false === Props.Subscript)
				TextPr.VertAlign = AscCommon.vertalign_Baseline;

			if (undefined != Props.Strikeout)
			{
				TextPr.Strikeout  = Props.Strikeout;
				TextPr.DStrikeout = false;
			}

			if (undefined != Props.DStrikeout)
			{
				TextPr.DStrikeout = Props.DStrikeout;
				if (true === TextPr.DStrikeout)
					TextPr.Strikeout = false;
			}

			if (undefined != Props.SmallCaps)
			{
				TextPr.SmallCaps = Props.SmallCaps;
				TextPr.AllCaps   = false;
			}

			if (undefined != Props.AllCaps)
			{
				TextPr.Caps = Props.AllCaps;
				if (true === TextPr.AllCaps)
					TextPr.SmallCaps = false;
			}

			if (undefined != Props.TextSpacing)
				TextPr.Spacing = Props.TextSpacing;

			if (undefined != Props.Position)
				TextPr.Position = Props.Position;

			this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr(TextPr));
			this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
		}
	};

	asc_docs_api.prototype.put_PrAlign        = function(value)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetParagraphAlign);
			this.WordControl.m_oLogicDocument.Set_ParagraphAlign(value);
		}
	};
	// 0- baseline, 2-subscript, 1-superscript
	asc_docs_api.prototype.put_TextPrBaseline = function(value)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetTextVertAlign);
			this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({VertAlign : value}));
		}
	};
	/*
	 Во всех случаях SubType = 0 означает, что нажали просто на кнопку
	 c выбором типа списка, без выбора подтипа.

	 Маркированный список Type = 0
	 нет          - SubType = -1
	 черная точка - SubType = 1
	 круг         - SubType = 2
	 квадрат      - SubType = 3
	 картинка     - SubType = -1
	 4 ромба      - SubType = 4
	 ч/б стрелка  - SubType = 5
	 галка        - SubType = 6
	 ромб         - SubType = 7

	 Нумерованный список Type = 1
	 нет - SubType = -1
	 1.  - SubType = 1
	 1)  - SubType = 2
	 I.  - SubType = 3
	 A.  - SubType = 4
	 a)  - SubType = 5
	 a.  - SubType = 6
	 i.  - SubType = 7

	 Многоуровневый список Type = 2
	 нет           - SubType = -1
	 1)a)i)        - SubType = 1
	 1.1.1         - SubType = 2
	 маркированный - SubType = 3
	 */
	asc_docs_api.prototype.put_ListType = function(type, subtype)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties))
		{
			var NumberInfo =
				{
					Type    : 0,
					SubType : -1
				};

			NumberInfo.Type    = type;
			NumberInfo.SubType = subtype;
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetParagraphNumbering);
			this.WordControl.m_oLogicDocument.Set_ParagraphNumbering(NumberInfo);
		}
	};
	asc_docs_api.prototype.put_Style    = function(name)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetParagraphStyle);
			this.WordControl.m_oLogicDocument.Set_ParagraphStyle(name);
		}
	};

	asc_docs_api.prototype.SetDeviceInputHelperId = function(idKeyboard)
	{
		if (window.ID_KEYBOARD_AREA === undefined && this.WordControl.m_oMainView != null)
		{
			window.ID_KEYBOARD_AREA = document.getElementById(idKeyboard);

			window.ID_KEYBOARD_AREA.onkeypress = function(e)
			{
				if (false === editor.WordControl.IsFocus)
				{
					editor.WordControl.IsFocus = true;
					var ret                    = editor.WordControl.onKeyPress(e);
					editor.WordControl.IsFocus = false;
					return ret;
				}
			}
			window.ID_KEYBOARD_AREA.onkeydown  = function(e)
			{
				if (false === editor.WordControl.IsFocus)
				{
					editor.WordControl.IsFocus = true;
					var ret                    = editor.WordControl.onKeyDown(e);
					editor.WordControl.IsFocus = false;
					return ret;
				}
			}
		}
	};

	asc_docs_api.prototype.put_ShowSnapLines = function(isShow)
	{
		this.ShowSnapLines = isShow;
	};
	asc_docs_api.prototype.get_ShowSnapLines = function()
	{
		return this.ShowSnapLines;
	};

	asc_docs_api.prototype.put_ShowParaMarks      = function(isShow)
	{
		/*
		 if (window.IsAddDiv === undefined && this.WordControl.m_oMainView != null)
		 {
		 window.IsAddDiv = true;

		 var _div = this.WordControl.m_oMainView.HtmlElement;

		 var test = document.createElement('textarea');
		 test.id = "area_id";

		 test.setAttribute("style", "font-family:arial;font-size:12pt;position:absolute;resize:none;padding:2px;margin:0px;font-weight:normal;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;z-index:1000");
		 test.style.border = "2px solid #4363A4";

		 test.style.width = "100px";
		 //this.TextBoxInput.style.height = "40px";
		 test.rows = 1;

		 _div.appendChild(test);

		 test.onkeypress = function(e){
		 return editor.WordControl.onKeyPress(e);
		 }
		 test.onkeydown = function(e){
		 return editor.WordControl.onKeyDown(e);
		 }
		 }
		 */

		this.ShowParaMarks = isShow;
		this.WordControl.OnRePaintAttack();

		if (true === this.isMarkerFormat)
			this.sync_MarkerFormatCallback(false);

		return this.ShowParaMarks;
	};
	asc_docs_api.prototype.get_ShowParaMarks      = function()
	{
		return this.ShowParaMarks;
	};
	asc_docs_api.prototype.put_ShowTableEmptyLine = function(isShow)
	{
		this.isShowTableEmptyLine = isShow;
		this.WordControl.OnRePaintAttack();

		if (true === this.isMarkerFormat)
			this.sync_MarkerFormatCallback(false);

		return this.isShowTableEmptyLine;
	};
	asc_docs_api.prototype.get_ShowTableEmptyLine = function()
	{
		return this.isShowTableEmptyLine;
	};
	asc_docs_api.prototype.put_PageBreak          = function(isBreak)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties))
		{
			this.isPageBreakBefore = isBreak;
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetParagraphPageBreakBefore);
			this.WordControl.m_oLogicDocument.Set_ParagraphPageBreakBefore(isBreak);
			this.sync_PageBreakCallback(isBreak);
		}
	};

	asc_docs_api.prototype.put_WidowControl = function(bValue)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetParagraphWidowControl);
			this.WordControl.m_oLogicDocument.Set_ParagraphWidowControl(bValue);
			this.sync_WidowControlCallback(bValue);
		}
	};

	asc_docs_api.prototype.put_KeepLines = function(isKeepLines)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties))
		{
			this.isKeepLinesTogether = isKeepLines;
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetParagraphKeepLines);
			this.WordControl.m_oLogicDocument.Set_ParagraphKeepLines(isKeepLines);
			this.sync_KeepLinesCallback(isKeepLines);
		}
	};

	asc_docs_api.prototype.put_KeepNext = function(isKeepNext)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetParagraphKeepNext);
			this.WordControl.m_oLogicDocument.Set_ParagraphKeepNext(isKeepNext);
			this.sync_KeepNextCallback(isKeepNext);
		}
	};

	asc_docs_api.prototype.put_AddSpaceBetweenPrg = function(isSpacePrg)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties))
		{
			this.isAddSpaceBetweenPrg = isSpacePrg;
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetParagraphContextualSpacing);
			this.WordControl.m_oLogicDocument.Set_ParagraphContextualSpacing(isSpacePrg);
		}
	};
	asc_docs_api.prototype.put_LineHighLight      = function(is_flag, r, g, b)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			if (false === is_flag)
			{
				this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetTextHighlightNone);
				this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({HighLight : AscCommonWord.highlight_None}));
			}
			else
			{
				this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetTextHighlightColor);
				this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({
					HighLight : {
						r : r,
						g : g,
						b : b
					}
				}));
			}
		}
	};
	asc_docs_api.prototype.put_TextColor          = function(color)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetTextColor);

			if (true === color.Auto)
			{
				this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({
					Color      : {
						Auto : true,
						r    : 0,
						g    : 0,
						b    : 0
					}, Unifill : undefined
				}));
			}
			else
			{
				var Unifill        = new AscFormat.CUniFill();
				Unifill.fill       = new AscFormat.CSolidFill();
				Unifill.fill.color = AscFormat.CorrectUniColor(color, Unifill.fill.color, 1);
				this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({Unifill : Unifill}));
			}

			if (true === this.isMarkerFormat)
				this.sync_MarkerFormatCallback(false);
		}
	};
	asc_docs_api.prototype.put_ParagraphShade     = function(is_flag, color, isOnlyPara)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetParagraphShd);

			if (true === isOnlyPara)
				this.WordControl.m_oLogicDocument.Set_UseTextShd(false);

			if (false === is_flag)
				this.WordControl.m_oLogicDocument.Set_ParagraphShd({Value : Asc.c_oAscShdNil});
			else
			{
				var Unifill        = new AscFormat.CUniFill();
				Unifill.fill       = new AscFormat.CSolidFill();
				Unifill.fill.color = AscFormat.CorrectUniColor(color, Unifill.fill.color, 1);
				this.WordControl.m_oLogicDocument.Set_ParagraphShd({
					Value   : Asc.c_oAscShdClear,
					Color   : {
						r : color.asc_getR(),
						g : color.asc_getG(),
						b : color.asc_getB()
					},
					Unifill : Unifill
				});
			}

			this.WordControl.m_oLogicDocument.Set_UseTextShd(true);
		}
	};
	asc_docs_api.prototype.put_PrIndent           = function(value, levelValue)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetParagraphIndent);
			this.WordControl.m_oLogicDocument.Set_ParagraphIndent({Left : value, ChangeLevel : levelValue});
		}
	};
	asc_docs_api.prototype.IncreaseIndent         = function()
	{
		this.WordControl.m_oLogicDocument.IncreaseIndent();
	};
	asc_docs_api.prototype.DecreaseIndent         = function()
	{
		this.WordControl.m_oLogicDocument.DecreaseIndent();
	};
	asc_docs_api.prototype.put_PrIndentRight      = function(value)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetParagraphIndentRight);
			this.WordControl.m_oLogicDocument.Set_ParagraphIndent({Right : value});
		}
	};
	asc_docs_api.prototype.put_PrFirstLineIndent  = function(value)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetParagraphIndentFirstLine);
			this.WordControl.m_oLogicDocument.Set_ParagraphIndent({FirstLine : value});
		}
	};
	asc_docs_api.prototype.put_Margins            = function(left, top, right, bottom)
	{
		this.WordControl.m_oLogicDocument.Set_DocumentMargin({Left : left, Top : top, Right : right, Bottom : bottom});
	};
	asc_docs_api.prototype.getFocusObject         = function()
	{//возвратит тип элемента - параграф c_oAscTypeSelectElement.Paragraph, изображение c_oAscTypeSelectElement.Image, таблица c_oAscTypeSelectElement.Table, колонтитул c_oAscTypeSelectElement.Header.

	};

	/*callbacks*/
	asc_docs_api.prototype.sync_VerticalAlign     = function(typeBaseline)
	{
		this.sendEvent("asc_onVerticalAlign", typeBaseline);
	};
	asc_docs_api.prototype.sync_PrAlignCallBack   = function(value)
	{
		this.sendEvent("asc_onPrAlign", value);
	};
	asc_docs_api.prototype.sync_ListType          = function(NumPr)
	{
		this.sendEvent("asc_onListType", new AscCommon.asc_CListType(NumPr));
	};
	asc_docs_api.prototype.sync_TextColor         = function(TextPr)
	{
		if (TextPr.Unifill && TextPr.Unifill.fill && TextPr.Unifill.fill.type === c_oAscFill.FILL_TYPE_SOLID && TextPr.Unifill.fill.color)
		{
			this.sendEvent("asc_onTextColor", AscCommon.CreateAscColor(TextPr.Unifill.fill.color));
		}
		else if (undefined != TextPr.Color)
		{
			this.sendEvent("asc_onTextColor", AscCommon.CreateAscColorCustom(TextPr.Color.r, TextPr.Color.g, TextPr.Color.b, TextPr.Color.Auto));
		}
	};
	asc_docs_api.prototype.sync_TextHighLight     = function(HighLight)
	{
		if (undefined != HighLight)
			this.sendEvent("asc_onTextHighLight", new AscCommon.CColor(HighLight.r, HighLight.g, HighLight.b));
	};
	asc_docs_api.prototype.sync_TextSpacing       = function(Spacing)
	{
		this.sendEvent("asc_onTextSpacing", Spacing);
	};
	asc_docs_api.prototype.sync_TextDStrikeout    = function(Value)
	{
		this.sendEvent("asc_onTextDStrikeout", Value);
	};
	asc_docs_api.prototype.sync_TextCaps          = function(Value)
	{
		this.sendEvent("asc_onTextCaps", Value);
	};
	asc_docs_api.prototype.sync_TextSmallCaps     = function(Value)
	{
		this.sendEvent("asc_onTextSmallCaps", Value);
	};
	asc_docs_api.prototype.sync_TextPosition      = function(Value)
	{
		this.sendEvent("asc_onTextPosition", Value);
	};
	asc_docs_api.prototype.sync_TextLangCallBack  = function(Lang)
	{
		this.sendEvent("asc_onTextLanguage", Lang.Val);
	};
	asc_docs_api.prototype.sync_ParaStyleName     = function(Name)
	{
		this.sendEvent("asc_onParaStyleName", Name);
	};
	asc_docs_api.prototype.sync_ParaSpacingLine   = function(SpacingLine)
	{
		if (true === SpacingLine.AfterAutoSpacing)
			SpacingLine.After = AscCommonWord.spacing_Auto;
		else if (undefined === SpacingLine.AfterAutoSpacing)
			SpacingLine.After = AscCommonWord.UnknownValue;

		if (true === SpacingLine.BeforeAutoSpacing)
			SpacingLine.Before = AscCommonWord.spacing_Auto;
		else if (undefined === SpacingLine.BeforeAutoSpacing)
			SpacingLine.Before = AscCommonWord.UnknownValue;

		this.sendEvent("asc_onParaSpacingLine", new AscCommon.asc_CParagraphSpacing(SpacingLine));
	};
	asc_docs_api.prototype.sync_PageBreakCallback = function(isBreak)
	{
		this.sendEvent("asc_onPageBreak", isBreak);
	};

	asc_docs_api.prototype.sync_WidowControlCallback = function(bValue)
	{
		this.sendEvent("asc_onWidowControl", bValue);
	};

	asc_docs_api.prototype.sync_KeepNextCallback = function(bValue)
	{
		this.sendEvent("asc_onKeepNext", bValue);
	};

	asc_docs_api.prototype.sync_KeepLinesCallback       = function(isKeepLines)
	{
		this.sendEvent("asc_onKeepLines", isKeepLines);
	};
	asc_docs_api.prototype.sync_ShowParaMarksCallback   = function()
	{
		this.sendEvent("asc_onShowParaMarks");
	};
	asc_docs_api.prototype.sync_SpaceBetweenPrgCallback = function()
	{
		this.sendEvent("asc_onSpaceBetweenPrg");
	};
	asc_docs_api.prototype.sync_PrPropCallback          = function(prProp)
	{
		var _len = this.SelectedObjectsStack.length;
		if (_len > 0)
		{
			if (this.SelectedObjectsStack[_len - 1].Type == c_oAscTypeSelectElement.Paragraph)
			{
				this.SelectedObjectsStack[_len - 1].Value = new Asc.asc_CParagraphProperty(prProp);
				return;
			}
		}

		this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject(c_oAscTypeSelectElement.Paragraph, new Asc.asc_CParagraphProperty(prProp));
	};

	asc_docs_api.prototype.sync_MathPropCallback = function(MathProp)
	{
		this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject(c_oAscTypeSelectElement.Math, MathProp);
	};

	asc_docs_api.prototype.sync_EndAddShape = function()
	{
		editor.sendEvent("asc_onEndAddShape");
		if (this.WordControl.m_oDrawingDocument.m_sLockedCursorType == "crosshair")
		{
			this.WordControl.m_oDrawingDocument.UnlockCursorType();
		}
	};

	asc_docs_api.prototype.SetDrawingFreeze = function(bIsFreeze)
	{
		this.WordControl.DrawingFreeze = bIsFreeze;

		var _elem1 = document.getElementById("id_main");
		if (_elem1)
		{
			var _elem2 = document.getElementById("id_horscrollpanel");
			var _elem3 = document.getElementById("id_panel_right");
			if (bIsFreeze)
			{
				_elem1.style.display = "none";
				_elem2.style.display = "none";
				_elem3.style.display = "none";
			}
			else
			{
				_elem1.style.display = "block";
				_elem2.style.display = "block";
				_elem3.style.display = "block";
			}
		}

		if (!bIsFreeze)
			this.WordControl.OnScroll();
	};

	//----------------------------------------------------------------------------------------------------------------------
	// Работаем с формулами
	//----------------------------------------------------------------------------------------------------------------------
	asc_docs_api.prototype.asc_SetMathProps = function(MathProps)
	{
		this.WordControl.m_oLogicDocument.Set_MathProps(MathProps);
	};

	asc_docs_api.prototype["asc_SetMathProps"] = asc_docs_api.prototype.asc_SetMathProps;
	//----------------------------------------------------------------------------------------------------------------------
	// Работаем с настройками секции
	//----------------------------------------------------------------------------------------------------------------------
	asc_docs_api.prototype.change_PageOrient       = function(isPortrait)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Document_SectPr))
		{
			this.WordControl.m_oDrawingDocument.m_bIsUpdateDocSize = true;
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetPageOrientation);
			if (isPortrait)
			{
				this.WordControl.m_oLogicDocument.Set_DocumentOrientation(Asc.c_oAscPageOrientation.PagePortrait);
				this.DocumentOrientation = isPortrait;
			}
			else
			{
				this.WordControl.m_oLogicDocument.Set_DocumentOrientation(Asc.c_oAscPageOrientation.PageLandscape);
				this.DocumentOrientation = isPortrait;
			}
			this.sync_PageOrientCallback(editor.get_DocumentOrientation());
		}
	};
	asc_docs_api.prototype.get_DocumentOrientation = function()
	{
		return this.DocumentOrientation;
	};
	asc_docs_api.prototype.change_DocSize          = function(width, height)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Document_SectPr))
		{
			this.WordControl.m_oDrawingDocument.m_bIsUpdateDocSize = true;
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetPageSize);
			if (this.DocumentOrientation)
				this.WordControl.m_oLogicDocument.Set_DocumentPageSize(width, height);
			else
				this.WordControl.m_oLogicDocument.Set_DocumentPageSize(height, width);
		}
	};

	asc_docs_api.prototype.get_DocumentWidth = function()
	{
		return AscCommon.Page_Width;
	};

	asc_docs_api.prototype.get_DocumentHeight = function()
	{
		return AscCommon.Page_Height;
	};

	asc_docs_api.prototype.asc_SetSectionProps       = function(Props)
	{
		this.WordControl.m_oLogicDocument.Set_SectionProps(Props);
	};
	asc_docs_api.prototype.asc_GetSectionProps       = function()
	{
		return this.WordControl.m_oLogicDocument.Get_SectionProps();
	};
	asc_docs_api.prototype.sync_SectionPropsCallback = function(Props)
	{
		this.sendEvent("asc_onSectionProps", Props);
	};
	asc_docs_api.prototype["asc_SetSectionProps"]    = asc_docs_api.prototype.asc_SetSectionProps;
	asc_docs_api.prototype["asc_GetSectionProps"]    = asc_docs_api.prototype.asc_GetSectionProps;

	asc_docs_api.prototype.asc_SetColumnsProps       = function(ColumnsProps)
	{
		this.WordControl.m_oLogicDocument.Set_ColumnsProps(ColumnsProps);
	};
	asc_docs_api.prototype.asc_GetColumnsProps       = function()
	{
		return this.WordControl.m_oLogicDocument.Get_ColumnsProps();
	};
	asc_docs_api.prototype["asc_SetColumnsProps"]    = asc_docs_api.prototype.asc_SetColumnsProps;
	asc_docs_api.prototype["asc_GetColumnsProps"]    = asc_docs_api.prototype.asc_GetColumnsProps;
	asc_docs_api.prototype.sync_ColumnsPropsCallback = function(ColumnsProps)
	{
		this.sendEvent("asc_onColumnsProps", ColumnsProps);
	};
	asc_docs_api.prototype.asc_SetFootnoteProps = function(oFootnotePr, bApplyToAll)
	{
		this.WordControl.m_oLogicDocument.SetFootnotePr(oFootnotePr, bApplyToAll);
	};
	asc_docs_api.prototype.asc_GetFootnoteProps = function()
	{
		return this.WordControl.m_oLogicDocument.GetFootnotePr();
	};
	asc_docs_api.prototype.asc_AddFootnote = function(sText)
	{
		return this.WordControl.m_oLogicDocument.AddFootnote(sText);
	};
	asc_docs_api.prototype.asc_RemoveAllFootnotes = function()
	{
		this.WordControl.m_oLogicDocument.RemoveAllFootnotes();
	};
	asc_docs_api.prototype.asc_GotoFootnote = function(isNext)
	{
		this.WordControl.m_oLogicDocument.GotoFootnote(isNext);
	};
	asc_docs_api.prototype["asc_AddFootnote"]        = asc_docs_api.prototype.asc_AddFootnote;
	asc_docs_api.prototype["asc_RemoveAllFootnotes"] = asc_docs_api.prototype.asc_RemoveAllFootnotes;
	asc_docs_api.prototype["asc_GetFootnoteProps"]   = asc_docs_api.prototype.asc_GetFootnoteProps;
	asc_docs_api.prototype["asc_SetFootnoteProps"]   = asc_docs_api.prototype.asc_SetFootnoteProps;
	asc_docs_api.prototype["asc_GotoFootnote"]       = asc_docs_api.prototype.asc_GotoFootnote;

	asc_docs_api.prototype.put_AddPageBreak              = function()
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			var Document = this.WordControl.m_oLogicDocument;

			if (null === Document.Hyperlink_Check(false))
			{
				this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_AddPageBreak);
				this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaNewLine(AscCommonWord.break_Page));
			}
		}
	};
	asc_docs_api.prototype.put_AddColumnBreak            = function()
	{
		var Document = this.WordControl.m_oLogicDocument;
		if (false === Document.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			if (null === Document.Hyperlink_Check(false))
			{
				this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_AddPageBreak);
				this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaNewLine(AscCommonWord.break_Column));
			}
		}
	};
	asc_docs_api.prototype.Update_ParaInd                = function(Ind)
	{
		var FirstLine = 0,
			Left      = 0,
			Right     = 0;
		if ("undefined" != typeof(Ind))
		{
			if ("undefined" != typeof(Ind.FirstLine))
			{
				FirstLine = Ind.FirstLine;
			}
			if ("undefined" != typeof(Ind.Left))
			{
				Left = Ind.Left;
			}
			if ("undefined" != typeof(Ind.Right))
			{
				Right = Ind.Right;
			}
		}

		var bIsUpdate = false;
		var _ruler    = this.WordControl.m_oHorRuler;
		if (_ruler.m_dIndentLeft != Left)
		{
			_ruler.m_dIndentLeft = Left;
			bIsUpdate            = true;
		}
		if (_ruler != (FirstLine + Left))
		{
			_ruler.m_dIndentLeftFirst = (FirstLine + Left);
			bIsUpdate                 = true;
		}
		if (_ruler.m_dIndentRight != Right)
		{
			_ruler.m_dIndentRight = Right;
			bIsUpdate             = true;
		}
		if (bIsUpdate)
			this.WordControl.UpdateHorRuler();
	};
	asc_docs_api.prototype.Internal_Update_Ind_FirstLine = function(FirstLine, Left)
	{
		if (this.WordControl.m_oHorRuler.m_dIndentLeftFirst != (FirstLine + Left))
		{
			this.WordControl.m_oHorRuler.m_dIndentLeftFirst = (FirstLine + Left);
			this.WordControl.UpdateHorRuler();
		}
	};
	asc_docs_api.prototype.Internal_Update_Ind_Left      = function(Left)
	{
		if (this.WordControl.m_oHorRuler.m_dIndentLeft != Left)
		{
			this.WordControl.m_oHorRuler.m_dIndentLeft = Left;
			this.WordControl.UpdateHorRuler();
		}
	};
	asc_docs_api.prototype.Internal_Update_Ind_Right     = function(Right)
	{
		if (this.WordControl.m_oHorRuler.m_dIndentRight != Right)
		{
			this.WordControl.m_oHorRuler.m_dIndentRight = Right;
			this.WordControl.UpdateHorRuler();
		}
	};

	// "where" где нижний или верхний, align выравнивание
	asc_docs_api.prototype.put_PageNum = function(where, align)
	{
		if (where >= 0)
		{
			if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_None, {Type : AscCommon.changestype_2_HdrFtr}))
			{
				this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_AddPageNumToHdrFtr);
				this.WordControl.m_oLogicDocument.Document_AddPageNum(where, align);
			}
		}
		else
		{
			if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
			{
				this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_AddPageNumToCurrentPos);
				this.WordControl.m_oLogicDocument.Document_AddPageNum(where, align);
			}
		}
	};

	asc_docs_api.prototype.put_HeadersAndFootersDistance = function(value)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_HdrFtr))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetHdrFtrDistance);
			this.WordControl.m_oLogicDocument.Document_SetHdrFtrDistance(value);
		}
	};

	asc_docs_api.prototype.HeadersAndFooters_DifferentFirstPage = function(isOn)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_HdrFtr))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetHdrFtrFirstPage);
			this.WordControl.m_oLogicDocument.Document_SetHdrFtrFirstPage(isOn);
		}
	};

	asc_docs_api.prototype.HeadersAndFooters_DifferentOddandEvenPage = function(isOn)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_HdrFtr))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetHdrFtrEvenAndOdd);
			this.WordControl.m_oLogicDocument.Document_SetHdrFtrEvenAndOddHeaders(isOn);
		}
	};

	asc_docs_api.prototype.HeadersAndFooters_LinkToPrevious = function(isOn)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_HdrFtr))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetHdrFtrLink);
			this.WordControl.m_oLogicDocument.Document_SetHdrFtrLink(isOn);
		}
	};

	/*структура для передачи настроек колонтитулов
	 {
	 Type : hdrftr_Footer (hdrftr_Header),
	 Position : 12.5,
	 DifferentFirst : true/false,
	 DifferentEvenOdd : true/false,
	 }
	 */
	/*callback*/
	asc_docs_api.prototype.sync_DocSizeCallback               = function(width, height)
	{
		this.sendEvent("asc_onDocSize", width, height);
	};
	asc_docs_api.prototype.sync_PageOrientCallback            = function(isPortrait)
	{
		this.sendEvent("asc_onPageOrient", isPortrait);
	};
	asc_docs_api.prototype.sync_HeadersAndFootersPropCallback = function(hafProp)
	{
		if (true === hafProp)
			hafProp.Locked = true;

		this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject(c_oAscTypeSelectElement.Header, new CHeaderProp(hafProp));
	};

	/*----------------------------------------------------------------*/
	/*functions for working with table*/
	asc_docs_api.prototype.put_Table               = function(col, row)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Document_Content_Add))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_AddTable);
			this.WordControl.m_oLogicDocument.Add_InlineTable(col, row);
		}
	};
	asc_docs_api.prototype.addRowAbove             = function(count)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_Properties))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_TableAddRowAbove);
			this.WordControl.m_oLogicDocument.Table_AddRow(true);
		}
	};
	asc_docs_api.prototype.addRowBelow             = function(count)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_Properties))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_TableAddRowBelow);
			this.WordControl.m_oLogicDocument.Table_AddRow(false);
		}
	};
	asc_docs_api.prototype.addColumnLeft           = function(count)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_Properties))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_TableAddColumnLeft);
			this.WordControl.m_oLogicDocument.Table_AddCol(true);
		}
	};
	asc_docs_api.prototype.addColumnRight          = function(count)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_Properties))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_TableAddColumnRight);
			this.WordControl.m_oLogicDocument.Table_AddCol(false);
		}
	};
	asc_docs_api.prototype.remRow                  = function()
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_RemoveCells))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_TableRemoveRow);
			this.WordControl.m_oLogicDocument.Table_RemoveRow();
		}
	};
	asc_docs_api.prototype.remColumn               = function()
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_RemoveCells))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_TableRemoveColumn);
			this.WordControl.m_oLogicDocument.Table_RemoveCol();
		}
	};
	asc_docs_api.prototype.remTable                = function()
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_RemoveCells))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_RemoveTable);
			this.WordControl.m_oLogicDocument.Table_RemoveTable();
		}
	};
	asc_docs_api.prototype.selectRow               = function()
	{
		this.WordControl.m_oLogicDocument.Table_Select(c_oAscTableSelectionType.Row);
	};
	asc_docs_api.prototype.selectColumn            = function()
	{
		this.WordControl.m_oLogicDocument.Table_Select(c_oAscTableSelectionType.Column);
	};
	asc_docs_api.prototype.selectCell              = function()
	{
		this.WordControl.m_oLogicDocument.Table_Select(c_oAscTableSelectionType.Cell);
	};
	asc_docs_api.prototype.selectTable             = function()
	{
		this.WordControl.m_oLogicDocument.Table_Select(c_oAscTableSelectionType.Table);
	};
	asc_docs_api.prototype.setColumnWidth          = function(width)
	{

	};
	asc_docs_api.prototype.setRowHeight            = function(height)
	{

	};
	asc_docs_api.prototype.set_TblDistanceFromText = function(left, top, right, bottom)
	{

	};
	asc_docs_api.prototype.CheckBeforeMergeCells   = function()
	{
		return this.WordControl.m_oLogicDocument.Table_CheckMerge();
	};
	asc_docs_api.prototype.CheckBeforeSplitCells   = function()
	{
		return this.WordControl.m_oLogicDocument.Table_CheckSplit();
	};
	asc_docs_api.prototype.MergeCells              = function()
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_Properties))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_MergeTableCells);
			this.WordControl.m_oLogicDocument.Table_MergeCells();
		}
	};
	asc_docs_api.prototype.SplitCell               = function(Cols, Rows)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_Properties))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SplitTableCells);
			this.WordControl.m_oLogicDocument.Table_SplitCell(Cols, Rows);
		}
	};
	asc_docs_api.prototype.widthTable              = function(width)
	{

	};
	asc_docs_api.prototype.put_CellsMargin         = function(left, top, right, bottom)
	{

	};
	asc_docs_api.prototype.set_TblWrap             = function(type)
	{

	};
	asc_docs_api.prototype.set_TblIndentLeft       = function(spacing)
	{

	};
	asc_docs_api.prototype.set_Borders             = function(typeBorders, size, Color)
	{//если size == 0 то границы нет.

	};
	asc_docs_api.prototype.set_TableBackground     = function(Color)
	{

	};
	asc_docs_api.prototype.set_AlignCell           = function(align)
	{// c_oAscAlignType.RIGHT, c_oAscAlignType.LEFT, c_oAscAlignType.CENTER
		switch (align)
		{
			case c_oAscAlignType.LEFT :
				break;
			case c_oAscAlignType.CENTER :
				break;
			case c_oAscAlignType.RIGHT :
				break;
		}
	};
	asc_docs_api.prototype.set_TblAlign            = function(align)
	{// c_oAscAlignType.RIGHT, c_oAscAlignType.LEFT, c_oAscAlignType.CENTER
		switch (align)
		{
			case c_oAscAlignType.LEFT :
				break;
			case c_oAscAlignType.CENTER :
				break;
			case c_oAscAlignType.RIGHT :
				break;
		}
	};
	asc_docs_api.prototype.set_SpacingBetweenCells = function(isOn, spacing)
	{// c_oAscAlignType.RIGHT, c_oAscAlignType.LEFT, c_oAscAlignType.CENTER
		if (isOn)
		{

		}
	};

	// CBackground
	// Value : тип заливки(прозрачная или нет),
	// Color : { r : 0, g : 0, b : 0 }
	function CBackground(obj)
	{
		if (obj)
		{
            if (obj.Unifill && obj.Unifill.fill && obj.Unifill.fill.type ===  window['Asc'].c_oAscFill.FILL_TYPE_SOLID && obj.Unifill.fill.color)
            {
                this.Color = AscCommon.CreateAscColor(obj.Unifill.fill.color);
            }
            else
            {
                this.Color = (undefined != obj.Color && null != obj.Color) ? AscCommon.CreateAscColorCustom(obj.Color.r, obj.Color.g, obj.Color.b) : null;
            }
			this.Value = (undefined != obj.Value) ? obj.Value : null;
		}
		else
		{
			this.Color = AscCommon.CreateAscColorCustom(0, 0, 0);
			this.Value = 1;
		}
	}

	CBackground.prototype.get_Color = function()
	{
		return this.Color;
	};
	CBackground.prototype.put_Color = function(v)
	{
		this.Color = (v) ? v : null;
	};
	CBackground.prototype.get_Value = function()
	{
		return this.Value;
	};
	CBackground.prototype.put_Value = function(v)
	{
		this.Value = v;
	};

	function CTablePositionH(obj)
	{
		if (obj)
		{
			this.RelativeFrom = ( undefined === obj.RelativeFrom ) ? Asc.c_oAscHAnchor.Margin : obj.RelativeFrom;
			this.UseAlign     = ( undefined === obj.UseAlign     ) ? false : obj.UseAlign;
			this.Align        = ( undefined === obj.Align        ) ? undefined : obj.Align;
			this.Value        = ( undefined === obj.Value        ) ? 0 : obj.Value;
		}
		else
		{
			this.RelativeFrom = Asc.c_oAscHAnchor.Column;
			this.UseAlign     = false;
			this.Align        = undefined;
			this.Value        = 0;
		}
	}

	CTablePositionH.prototype.get_RelativeFrom = function()
	{
		return this.RelativeFrom;
	};
	CTablePositionH.prototype.put_RelativeFrom = function(v)
	{
		this.RelativeFrom = v;
	};
	CTablePositionH.prototype.get_UseAlign     = function()
	{
		return this.UseAlign;
	};
	CTablePositionH.prototype.put_UseAlign     = function(v)
	{
		this.UseAlign = v;
	};
	CTablePositionH.prototype.get_Align        = function()
	{
		return this.Align;
	};
	CTablePositionH.prototype.put_Align        = function(v)
	{
		this.Align = v;
	};
	CTablePositionH.prototype.get_Value        = function()
	{
		return this.Value;
	};
	CTablePositionH.prototype.put_Value        = function(v)
	{
		this.Value = v;
	};

	function CTablePositionV(obj)
	{
		if (obj)
		{
			this.RelativeFrom = ( undefined === obj.RelativeFrom ) ? Asc.c_oAscVAnchor.Text : obj.RelativeFrom;
			this.UseAlign     = ( undefined === obj.UseAlign     ) ? false : obj.UseAlign;
			this.Align        = ( undefined === obj.Align        ) ? undefined : obj.Align;
			this.Value        = ( undefined === obj.Value        ) ? 0 : obj.Value;
		}
		else
		{
			this.RelativeFrom = Asc.c_oAscVAnchor.Text;
			this.UseAlign     = false;
			this.Align        = undefined;
			this.Value        = 0;
		}
	}

	CTablePositionV.prototype.get_RelativeFrom = function()
	{
		return this.RelativeFrom;
	};
	CTablePositionV.prototype.put_RelativeFrom = function(v)
	{
		this.RelativeFrom = v;
	};
	CTablePositionV.prototype.get_UseAlign     = function()
	{
		return this.UseAlign;
	};
	CTablePositionV.prototype.put_UseAlign     = function(v)
	{
		this.UseAlign = v;
	};
	CTablePositionV.prototype.get_Align        = function()
	{
		return this.Align;
	};
	CTablePositionV.prototype.put_Align        = function(v)
	{
		this.Align = v;
	};
	CTablePositionV.prototype.get_Value        = function()
	{
		return this.Value;
	};
	CTablePositionV.prototype.put_Value        = function(v)
	{
		this.Value = v;
	};

	function CTablePropLook(obj)
	{
		this.FirstCol = false;
		this.FirstRow = false;
		this.LastCol  = false;
		this.LastRow  = false;
		this.BandHor  = false;
		this.BandVer  = false;

		if (obj)
		{
			this.FirstCol = ( undefined === obj.m_bFirst_Col ? false : obj.m_bFirst_Col );
			this.FirstRow = ( undefined === obj.m_bFirst_Row ? false : obj.m_bFirst_Row );
			this.LastCol  = ( undefined === obj.m_bLast_Col ? false : obj.m_bLast_Col );
			this.LastRow  = ( undefined === obj.m_bLast_Row ? false : obj.m_bLast_Row );
			this.BandHor  = ( undefined === obj.m_bBand_Hor ? false : obj.m_bBand_Hor );
			this.BandVer  = ( undefined === obj.m_bBand_Ver ? false : obj.m_bBand_Ver );
		}
	}

	CTablePropLook.prototype.get_FirstCol = function()
	{
		return this.FirstCol;
	};
	CTablePropLook.prototype.put_FirstCol = function(v)
	{
		this.FirstCol = v;
	};
	CTablePropLook.prototype.get_FirstRow = function()
	{
		return this.FirstRow;
	};
	CTablePropLook.prototype.put_FirstRow = function(v)
	{
		this.FirstRow = v;
	};
	CTablePropLook.prototype.get_LastCol  = function()
	{
		return this.LastCol;
	};
	CTablePropLook.prototype.put_LastCol  = function(v)
	{
		this.LastCol = v;
	};
	CTablePropLook.prototype.get_LastRow  = function()
	{
		return this.LastRow;
	};
	CTablePropLook.prototype.put_LastRow  = function(v)
	{
		this.LastRow = v;
	};
	CTablePropLook.prototype.get_BandHor  = function()
	{
		return this.BandHor;
	};
	CTablePropLook.prototype.put_BandHor  = function(v)
	{
		this.BandHor = v;
	};
	CTablePropLook.prototype.get_BandVer  = function()
	{
		return this.BandVer;
	};
	CTablePropLook.prototype.put_BandVer  = function(v)
	{
		this.BandVer = v;
	};

	function CTableProp(tblProp)
	{
		if (tblProp)
		{
			this.CanBeFlow           = (undefined != tblProp.CanBeFlow ? tblProp.CanBeFlow : false );
			this.CellSelect          = (undefined != tblProp.CellSelect ? tblProp.CellSelect : false );
			this.CellSelect          = (undefined != tblProp.CellSelect) ? tblProp.CellSelect : false;
			this.TableWidth          = (undefined != tblProp.TableWidth) ? tblProp.TableWidth : null;
			this.TableSpacing        = (undefined != tblProp.TableSpacing) ? tblProp.TableSpacing : null;
			this.TableDefaultMargins = (undefined != tblProp.TableDefaultMargins && null != tblProp.TableDefaultMargins) ? new Asc.asc_CPaddings(tblProp.TableDefaultMargins) : null;

			this.CellMargins = (undefined != tblProp.CellMargins && null != tblProp.CellMargins) ? new CMargins(tblProp.CellMargins) : null;

			this.TableAlignment     = (undefined != tblProp.TableAlignment) ? tblProp.TableAlignment : null;
			this.TableIndent        = (undefined != tblProp.TableIndent) ? tblProp.TableIndent : null;
			this.TableWrappingStyle = (undefined != tblProp.TableWrappingStyle) ? tblProp.TableWrappingStyle : null;

			this.TablePaddings = (undefined != tblProp.TablePaddings && null != tblProp.TablePaddings) ? new Asc.asc_CPaddings(tblProp.TablePaddings) : null;

			this.TableBorders      = (undefined != tblProp.TableBorders && null != tblProp.TableBorders) ? new CBorders(tblProp.TableBorders) : null;
			this.CellBorders       = (undefined != tblProp.CellBorders && null != tblProp.CellBorders) ? new CBorders(tblProp.CellBorders) : null;
			this.TableBackground   = (undefined != tblProp.TableBackground && null != tblProp.TableBackground) ? new CBackground(tblProp.TableBackground) : null;
			this.CellsBackground   = (undefined != tblProp.CellsBackground && null != tblProp.CellsBackground) ? new CBackground(tblProp.CellsBackground) : null;
			this.Position          = (undefined != tblProp.Position && null != tblProp.Position) ? new Asc.CPosition(tblProp.Position) : null;
			this.PositionH         = ( undefined != tblProp.PositionH && null != tblProp.PositionH ) ? new CTablePositionH(tblProp.PositionH) : undefined;
			this.PositionV         = ( undefined != tblProp.PositionV && null != tblProp.PositionV ) ? new CTablePositionV(tblProp.PositionV) : undefined;
			this.Internal_Position = ( undefined != tblProp.Internal_Position ) ? tblProp.Internal_Position : undefined;

			this.ForSelectedCells   = (undefined != tblProp.ForSelectedCells) ? tblProp.ForSelectedCells : true;
			this.TableStyle         = (undefined != tblProp.TableStyle) ? tblProp.TableStyle : null;
			this.TableLook          = (undefined != tblProp.TableLook) ? new CTablePropLook(tblProp.TableLook) : null;
			this.RowsInHeader       = (undefined != tblProp.RowsInHeader) ? tblProp.RowsInHeader : 0;
			this.CellsVAlign        = (undefined != tblProp.CellsVAlign) ? tblProp.CellsVAlign : c_oAscVertAlignJc.Top;
			this.AllowOverlap       = (undefined != tblProp.AllowOverlap) ? tblProp.AllowOverlap : undefined;
			this.TableLayout        = tblProp.TableLayout;
			this.CellsTextDirection = tblProp.CellsTextDirection;
			this.CellsNoWrap        = tblProp.CellsNoWrap;
			this.CellsWidth         = tblProp.CellsWidth;
			this.CellsWidthNotEqual = tblProp.CellsWidthNotEqual;
			this.Locked             = (undefined != tblProp.Locked) ? tblProp.Locked : false;
			this.PercentFullWidth   = tblProp.PercentFullWidth;
		}
		else
		{
			//Все свойства класса CTableProp должны быть undefined если они не изменялись
			//this.CanBeFlow = false;
			this.CellSelect = false; //обязательное свойство
			/*this.TableWidth = null;
			 this.TableSpacing = null;
			 this.TableDefaultMargins = new Asc.asc_CPaddings ();

			 this.CellMargins = new CMargins ();

			 this.TableAlignment = 0;
			 this.TableIndent = 0;
			 this.TableWrappingStyle = c_oAscWrapStyle.Inline;

			 this.TablePaddings = new Asc.asc_CPaddings ();

			 this.TableBorders = new CBorders ();
			 this.CellBorders = new CBorders ();
			 this.TableBackground = new CBackground ();
			 this.CellsBackground = new CBackground ();;
			 this.Position = new CPosition ();
			 this.ForSelectedCells = true;*/

			this.Locked = false;
		}
	}

	CTableProp.prototype.get_Width              = function()
	{
		return this.TableWidth;
	};
	CTableProp.prototype.put_Width              = function(v)
	{
		this.TableWidth = v;
	};
	CTableProp.prototype.get_Spacing            = function()
	{
		return this.TableSpacing;
	};
	CTableProp.prototype.put_Spacing            = function(v)
	{
		this.TableSpacing = v;
	};
	CTableProp.prototype.get_DefaultMargins     = function()
	{
		return this.TableDefaultMargins;
	};
	CTableProp.prototype.put_DefaultMargins     = function(v)
	{
		this.TableDefaultMargins = v;
	};
	CTableProp.prototype.get_CellMargins        = function()
	{
		return this.CellMargins;
	};
	CTableProp.prototype.put_CellMargins        = function(v)
	{
		this.CellMargins = v;
	};
	CTableProp.prototype.get_TableAlignment     = function()
	{
		return this.TableAlignment;
	};
	CTableProp.prototype.put_TableAlignment     = function(v)
	{
		this.TableAlignment = v;
	};
	CTableProp.prototype.get_TableIndent        = function()
	{
		return this.TableIndent;
	};
	CTableProp.prototype.put_TableIndent        = function(v)
	{
		this.TableIndent = v;
	};
	CTableProp.prototype.get_TableWrap          = function()
	{
		return this.TableWrappingStyle;
	};
	CTableProp.prototype.put_TableWrap          = function(v)
	{
		this.TableWrappingStyle = v;
	};
	CTableProp.prototype.get_TablePaddings      = function()
	{
		return this.TablePaddings;
	};
	CTableProp.prototype.put_TablePaddings      = function(v)
	{
		this.TablePaddings = v;
	};
	CTableProp.prototype.get_TableBorders       = function()
	{
		return this.TableBorders;
	};
	CTableProp.prototype.put_TableBorders       = function(v)
	{
		this.TableBorders = v;
	};
	CTableProp.prototype.get_CellBorders        = function()
	{
		return this.CellBorders;
	};
	CTableProp.prototype.put_CellBorders        = function(v)
	{
		this.CellBorders = v;
	};
	CTableProp.prototype.get_TableBackground    = function()
	{
		return this.TableBackground;
	};
	CTableProp.prototype.put_TableBackground    = function(v)
	{
		this.TableBackground = v;
	};
	CTableProp.prototype.get_CellsBackground    = function()
	{
		return this.CellsBackground;
	};
	CTableProp.prototype.put_CellsBackground    = function(v)
	{
		this.CellsBackground = v;
	};
	CTableProp.prototype.get_Position           = function()
	{
		return this.Position;
	};
	CTableProp.prototype.put_Position           = function(v)
	{
		this.Position = v;
	};
	CTableProp.prototype.get_PositionH          = function()
	{
		return this.PositionH;
	};
	CTableProp.prototype.put_PositionH          = function(v)
	{
		this.PositionH = v;
	};
	CTableProp.prototype.get_PositionV          = function()
	{
		return this.PositionV;
	};
	CTableProp.prototype.put_PositionV          = function(v)
	{
		this.PositionV = v;
	};
	CTableProp.prototype.get_Value_X            = function(RelativeFrom)
	{
		if (undefined != this.Internal_Position) return this.Internal_Position.Calculate_X_Value(RelativeFrom);
		return 0;
	};
	CTableProp.prototype.get_Value_Y            = function(RelativeFrom)
	{
		if (undefined != this.Internal_Position) return this.Internal_Position.Calculate_Y_Value(RelativeFrom);
		return 0;
	};
	CTableProp.prototype.get_ForSelectedCells   = function()
	{
		return this.ForSelectedCells;
	};
	CTableProp.prototype.put_ForSelectedCells   = function(v)
	{
		this.ForSelectedCells = v;
	};
	CTableProp.prototype.put_CellSelect         = function(v)
	{
		this.CellSelect = v;
	};
	CTableProp.prototype.get_CellSelect         = function()
	{
		return this.CellSelect
	};
	CTableProp.prototype.get_CanBeFlow          = function()
	{
		return this.CanBeFlow;
	};
	CTableProp.prototype.get_RowsInHeader       = function()
	{
		return this.RowsInHeader;
	};
	CTableProp.prototype.put_RowsInHeader       = function(v)
	{
		this.RowsInHeader = v;
	};
	CTableProp.prototype.get_Locked             = function()
	{
		return this.Locked;
	};
	CTableProp.prototype.get_CellsVAlign        = function()
	{
		return this.CellsVAlign;
	};
	CTableProp.prototype.put_CellsVAlign        = function(v)
	{
		this.CellsVAlign = v;
	};
	CTableProp.prototype.get_TableLook          = function()
	{
		return this.TableLook;
	};
	CTableProp.prototype.put_TableLook          = function(v)
	{
		this.TableLook = v;
	};
	CTableProp.prototype.get_TableStyle         = function()
	{
		return this.TableStyle;
	};
	CTableProp.prototype.put_TableStyle         = function(v)
	{
		this.TableStyle = v;
	};
	CTableProp.prototype.get_AllowOverlap       = function()
	{
		return this.AllowOverlap;
	};
	CTableProp.prototype.put_AllowOverlap       = function(v)
	{
		this.AllowOverlap = v;
	};
	CTableProp.prototype.get_TableLayout        = function()
	{
		return this.TableLayout;
	};
	CTableProp.prototype.put_TableLayout        = function(v)
	{
		this.TableLayout = v;
	};
	CTableProp.prototype.get_CellsTextDirection = function()
	{
		return this.CellsTextDirection;
	};
	CTableProp.prototype.put_CellsTextDirection = function(v)
	{
		this.CellsTextDirection = v;
	};
	CTableProp.prototype.get_CellsNoWrap        = function()
	{
		return this.CellsNoWrap;
	};
	CTableProp.prototype.put_CellsNoWrap        = function(v)
	{
		this.CellsNoWrap = v;
	};
	CTableProp.prototype.get_CellsWidth         = function()
	{
		return this.CellsWidth;
	};
	CTableProp.prototype.put_CellsWidth         = function(v)
	{
		this.CellsWidth = v;
	};
	CTableProp.prototype.get_PercentFullWidth   = function()
	{
		return this.PercentFullWidth;
	};
	CTableProp.prototype.get_CellsWidthNotEqual = function()
	{
		return this.CellsWidthNotEqual;
	};


	function CBorders(obj)
	{
		if (obj)
		{
			this.Left    = (undefined != obj.Left && null != obj.Left) ? new Asc.asc_CTextBorder(obj.Left) : null;
			this.Top     = (undefined != obj.Top && null != obj.Top) ? new Asc.asc_CTextBorder(obj.Top) : null;
			this.Right   = (undefined != obj.Right && null != obj.Right) ? new Asc.asc_CTextBorder(obj.Right) : null;
			this.Bottom  = (undefined != obj.Bottom && null != obj.Bottom) ? new Asc.asc_CTextBorder(obj.Bottom) : null;
			this.InsideH = (undefined != obj.InsideH && null != obj.InsideH) ? new Asc.asc_CTextBorder(obj.InsideH) : null;
			this.InsideV = (undefined != obj.InsideV && null != obj.InsideV) ? new Asc.asc_CTextBorder(obj.InsideV) : null;
		}
		//Все свойства класса CBorders должны быть undefined если они не изменялись
		/*else
		 {
		 this.Left = null;
		 this.Top = null;
		 this.Right = null;
		 this.Bottom = null;
		 this.InsideH = null;
		 this.InsideV = null;
		 }*/
	}

	CBorders.prototype.get_Left    = function()
	{
		return this.Left;
	};
	CBorders.prototype.put_Left    = function(v)
	{
		this.Left = (v) ? new Asc.asc_CTextBorder(v) : null;
	};
	CBorders.prototype.get_Top     = function()
	{
		return this.Top;
	};
	CBorders.prototype.put_Top     = function(v)
	{
		this.Top = (v) ? new Asc.asc_CTextBorder(v) : null;
	};
	CBorders.prototype.get_Right   = function()
	{
		return this.Right;
	};
	CBorders.prototype.put_Right   = function(v)
	{
		this.Right = (v) ? new Asc.asc_CTextBorder(v) : null;
	};
	CBorders.prototype.get_Bottom  = function()
	{
		return this.Bottom;
	};
	CBorders.prototype.put_Bottom  = function(v)
	{
		this.Bottom = (v) ? new Asc.asc_CTextBorder(v) : null;
	};
	CBorders.prototype.get_InsideH = function()
	{
		return this.InsideH;
	};
	CBorders.prototype.put_InsideH = function(v)
	{
		this.InsideH = (v) ? new Asc.asc_CTextBorder(v) : null;
	};
	CBorders.prototype.get_InsideV = function()
	{
		return this.InsideV;
	};
	CBorders.prototype.put_InsideV = function(v)
	{
		this.InsideV = (v) ? new Asc.asc_CTextBorder(v) : null;
	};


	// CMargins
	function CMargins(obj)
	{
		if (obj)
		{
			this.Left   = (undefined != obj.Left) ? obj.Left : null;
			this.Right  = (undefined != obj.Right) ? obj.Right : null;
			this.Top    = (undefined != obj.Top) ? obj.Top : null;
			this.Bottom = (undefined != obj.Bottom) ? obj.Bottom : null;
			this.Flag   = (undefined != obj.Flag) ? obj.Flag : null;
		}
		else
		{
			this.Left   = null;
			this.Right  = null;
			this.Top    = null;
			this.Bottom = null;
			this.Flag   = null;
		}
	}

	CMargins.prototype.get_Left   = function()
	{
		return this.Left;
	};
	CMargins.prototype.put_Left   = function(v)
	{
		this.Left = v;
	};
	CMargins.prototype.get_Right  = function()
	{
		return this.Right;
	};
	CMargins.prototype.put_Right  = function(v)
	{
		this.Right = v;
	};
	CMargins.prototype.get_Top    = function()
	{
		return this.Top;
	};
	CMargins.prototype.put_Top    = function(v)
	{
		this.Top = v;
	};
	CMargins.prototype.get_Bottom = function()
	{
		return this.Bottom;
	};
	CMargins.prototype.put_Bottom = function(v)
	{
		this.Bottom = v;
	};
	CMargins.prototype.get_Flag   = function()
	{
		return this.Flag;
	};
	CMargins.prototype.put_Flag   = function(v)
	{
		this.Flag = v;
	};

	/*
	 {
	 TableWidth   : null - галочка убрана, либо заданное значение в мм
	 TableSpacing : null - галочка убрана, либо заданное значение в мм

	 TableDefaultMargins :  // маргины для всей таблицы(значение по умолчанию)
	 {
	 Left   : 1.9,
	 Right  : 1.9,
	 Top    : 0,
	 Bottom : 0
	 }

	 CellMargins :
	 {
	 Left   : 1.9, (null - неопределенное значение)
	 Right  : 1.9, (null - неопределенное значение)
	 Top    : 0,   (null - неопределенное значение)
	 Bottom : 0,   (null - неопределенное значение)
	 Flag   : 0 - У всех выделенных ячеек значение берется из TableDefaultMargins
	 1 - У выделенных ячеек есть ячейки с дефолтовыми значениями, и есть со своими собственными
	 2 - У всех ячеек свои собственные значения
	 }

	 TableAlignment : 0, 1, 2 (слева, по центру, справа)
	 TableIndent : значение в мм,
	 TableWrappingStyle : 0, 1 (inline, flow)
	 TablePaddings:
	 {
	 Left   : 3.2,
	 Right  : 3.2,
	 Top    : 0,
	 Bottom : 0
	 }

	 TableBorders : // границы таблицы
	 {
	 Bottom :
	 {
	 Color : { r : 0, g : 0, b : 0 },
	 Value : border_Single,
	 Size  : 0.5 * g_dKoef_pt_to_mm
	 Space :
	 },

	 Left :
	 {
	 Color : { r : 0, g : 0, b : 0 },
	 Value : border_Single,
	 Size  : 0.5 * g_dKoef_pt_to_mm
	 Space :
	 },

	 Right :
	 {
	 Color : { r : 0, g : 0, b : 0 },
	 Value : border_Single,
	 Size  : 0.5 * g_dKoef_pt_to_mm
	 Space :
	 },

	 Top :
	 {
	 Color : { r : 0, g : 0, b : 0 },
	 Value : border_Single,
	 Size  : 0.5 * g_dKoef_pt_to_mm
	 Space :
	 },

	 InsideH :
	 {
	 Color : { r : 0, g : 0, b : 0 },
	 Value : border_Single,
	 Size  : 0.5 * g_dKoef_pt_to_mm
	 Space :
	 },

	 InsideV :
	 {
	 Color : { r : 0, g : 0, b : 0 },
	 Value : border_Single,
	 Size  : 0.5 * g_dKoef_pt_to_mm
	 Space :
	 }
	 }

	 CellBorders : // границы выделенных ячеек
	 {
	 ForSelectedCells : true,

	 Bottom :
	 {
	 Color : { r : 0, g : 0, b : 0 },
	 Value : border_Single,
	 Size  : 0.5 * g_dKoef_pt_to_mm
	 Space :
	 },

	 Left :
	 {
	 Color : { r : 0, g : 0, b : 0 },
	 Value : border_Single,
	 Size  : 0.5 * g_dKoef_pt_to_mm
	 Space :
	 },

	 Right :
	 {
	 Color : { r : 0, g : 0, b : 0 },
	 Value : border_Single,
	 Size  : 0.5 * g_dKoef_pt_to_mm
	 Space :
	 },

	 Top :
	 {
	 Color : { r : 0, g : 0, b : 0 },
	 Value : border_Single,
	 Size  : 0.5 * g_dKoef_pt_to_mm
	 Space :
	 },

	 InsideH : // данного элемента может не быть, если у выделенных ячеек
	 // нет горизонтальных внутренних границ
	 {
	 Color : { r : 0, g : 0, b : 0 },
	 Value : border_Single,
	 Size  : 0.5 * g_dKoef_pt_to_mm
	 Space :
	 },

	 InsideV : // данного элемента может не быть, если у выделенных ячеек
	 // нет вертикальных внутренних границ
	 {
	 Color : { r : 0, g : 0, b : 0 },
	 Value : border_Single,
	 Size  : 0.5 * g_dKoef_pt_to_mm
	 Space :
	 }
	 }

	 TableBackground :
	 {
	 Value : тип заливки(прозрачная или нет),
	 Color : { r : 0, g : 0, b : 0 }
	 }
	 CellsBackground : null если заливка не определена для выделенных ячеек
	 {
	 Value : тип заливки(прозрачная или нет),
	 Color : { r : 0, g : 0, b : 0 }
	 }

	 Position:
	 {
	 X:0,
	 Y:0
	 }
	 }
	 */
	asc_docs_api.prototype.tblApply = function(obj)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_Properties))
		{
			if (obj.CellBorders)
			{
				if (obj.CellBorders.Left && obj.CellBorders.Left.Color)
				{
					obj.CellBorders.Left.Unifill = AscFormat.CreateUnifillFromAscColor(obj.CellBorders.Left.Color);
				}
				if (obj.CellBorders.Top && obj.CellBorders.Top.Color)
				{
					obj.CellBorders.Top.Unifill = AscFormat.CreateUnifillFromAscColor(obj.CellBorders.Top.Color);
				}
				if (obj.CellBorders.Right && obj.CellBorders.Right.Color)
				{
					obj.CellBorders.Right.Unifill = AscFormat.CreateUnifillFromAscColor(obj.CellBorders.Right.Color);
				}
				if (obj.CellBorders.Bottom && obj.CellBorders.Bottom.Color)
				{
					obj.CellBorders.Bottom.Unifill = AscFormat.CreateUnifillFromAscColor(obj.CellBorders.Bottom.Color);
				}
				if (obj.CellBorders.InsideH && obj.CellBorders.InsideH.Color)
				{
					obj.CellBorders.InsideH.Unifill = AscFormat.CreateUnifillFromAscColor(obj.CellBorders.InsideH.Color);
				}
				if (obj.CellBorders.InsideV && obj.CellBorders.InsideV.Color)
				{
					obj.CellBorders.InsideV.Unifill = AscFormat.CreateUnifillFromAscColor(obj.CellBorders.InsideV.Color);
				}
			}
			if (obj.CellsBackground && obj.CellsBackground.Color)
			{
				obj.CellsBackground.Unifill = AscFormat.CreateUnifillFromAscColor(obj.CellsBackground.Color);
			}

			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_ApplyTablePr);
			this.WordControl.m_oLogicDocument.Set_TableProps(obj);
		}
	};
	/*callbacks*/
	asc_docs_api.prototype.sync_AddTableCallback            = function()
	{
		this.sendEvent("asc_onAddTable");
	};
	asc_docs_api.prototype.sync_AlignCellCallback           = function(align)
	{
		this.sendEvent("asc_onAlignCell", align);
	};
	asc_docs_api.prototype.sync_TblPropCallback             = function(tblProp)
	{
		//if ( true === CollaborativeEditing.Get_GlobalLock() )
		//    tblProp.Locked = true;

		// TODO: вызвать функцию asc_onInitTableTemplatesв зависимости от TableLook
		if (tblProp.CellsBackground && tblProp.CellsBackground.Unifill)
		{
			var LogicDocument = this.WordControl.m_oLogicDocument;
			tblProp.CellsBackground.Unifill.check(LogicDocument.Get_Theme(), LogicDocument.Get_ColorMap());
			var RGBA                      = tblProp.CellsBackground.Unifill.getRGBAColor();
			tblProp.CellsBackground.Color = new AscCommonWord.CDocumentColor(RGBA.R, RGBA.G, RGBA.B, false);
		}
		this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject(c_oAscTypeSelectElement.Table, new CTableProp(tblProp));
	};
	asc_docs_api.prototype.sync_TblWrapStyleChangedCallback = function(style)
	{
		this.sendEvent("asc_onTblWrapStyleChanged", style);
	};
	asc_docs_api.prototype.sync_TblAlignChangedCallback     = function(style)
	{
		this.sendEvent("asc_onTblAlignChanged", style);
	};

	/*----------------------------------------------------------------*/
	/*functions for working with images*/
	asc_docs_api.prototype.ChangeImageFromFile      = function()
	{
		this.isImageChangeUrl = true;
		this.asc_addImage();
	};
	asc_docs_api.prototype.ChangeShapeImageFromFile = function()
	{
		this.isShapeImageChangeUrl = true;
		this.asc_addImage();
	};

	asc_docs_api.prototype.AddImage     = function()
	{
		this.asc_addImage();
	};
	asc_docs_api.prototype.AddImageUrl2 = function(url)
	{
		this.AddImageUrl(AscCommon.getFullImageSrc2(url));
	};

	asc_docs_api.prototype._addImageUrl      = function(url)
	{
		// ToDo пока временная функция для стыковки.
		this.AddImageUrl(url);
	};
	asc_docs_api.prototype.AddImageUrl       = function(url, imgProp)
	{
		if (g_oDocumentUrls.getLocal(url))
		{
			this.AddImageUrlAction(url, imgProp);
		}
		else
		{
			var rData = {
				"id"        : this.documentId,
				"userid"    : this.documentUserId,
				"c"         : "imgurl",
				"saveindex" : g_oDocumentUrls.getMaxIndex(),
				"data"      : url
			};

			var t = this;
			this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
			this.fCurCallback = function(input)
			{
				if (null != input && "imgurl" == input["type"])
				{
					if ("ok" == input["status"])
					{
						var data = input["data"];
						var urls = {};
						var firstUrl;
						for (var i = 0; i < data.length; ++i)
						{
							var elem = data[i];
							if (elem.url)
							{
								if (!firstUrl)
								{
									firstUrl = elem.url;
								}
								urls[elem.path] = elem.url;
							}
						}
						g_oDocumentUrls.addUrls(urls);
						if (firstUrl)
						{
							t.AddImageUrlAction(firstUrl, imgProp);
						}
						else
						{
							t.sendEvent("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.NoCritical);
						}
					}
					else
					{
						t.sendEvent("asc_onError", mapAscServerErrorToAscError(parseInt(input["data"])), c_oAscError.Level.NoCritical);
					}
				}
				else
				{
					t.sendEvent("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.NoCritical);
				}
				t.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
			};
			sendCommand(this, null, rData);
		}
	};
	asc_docs_api.prototype.AddImageUrlAction = function(url, imgProp)
	{
		var _image = this.ImageLoader.LoadImage(url, 1);
		if (null != _image)
		{
			var ColumnSize = this.WordControl.m_oLogicDocument.GetColumnSize();

			var _w = Math.max(1, ColumnSize.W);
			var _h = Math.max(1, ColumnSize.H);
			if (_image.Image != null)
			{
				var __w = Math.max((_image.Image.width * AscCommon.g_dKoef_pix_to_mm), 1);
				var __h = Math.max((_image.Image.height * AscCommon.g_dKoef_pix_to_mm), 1);
				_w      = Math.max(5, Math.min(_w, __w));
				_h      = Math.max(5, Math.min((_w * __h / __w)));
			}

			var src = _image.src;
			if (this.isShapeImageChangeUrl)
			{
				var AscShapeProp       = new Asc.asc_CShapeProperty();
				AscShapeProp.fill      = new asc_CShapeFill();
				AscShapeProp.fill.type = c_oAscFill.FILL_TYPE_BLIP;
				AscShapeProp.fill.fill = new asc_CFillBlip();
				AscShapeProp.fill.fill.asc_putUrl(src);
				this.ImgApply(new asc_CImgProperty({ShapeProperties : AscShapeProp}));
				this.isShapeImageChangeUrl = false;
			}
			else if (this.isImageChangeUrl)
			{
				var AscImageProp      = new asc_CImgProperty();
				AscImageProp.ImageUrl = src;
				this.ImgApply(AscImageProp);
				this.isImageChangeUrl = false;
			}
			else
			{
				if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
				{
					var imageLocal = g_oDocumentUrls.getImageLocal(src);
					if (imageLocal)
					{
						src = imageLocal;
					}

					this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_AddImageUrl);
					if (undefined === imgProp || undefined === imgProp.WrappingStyle || 0 == imgProp.WrappingStyle)
						this.WordControl.m_oLogicDocument.Add_InlineImage(_w, _h, src);
					else
						this.WordControl.m_oLogicDocument.Add_InlineImage(_w, _h, src, null, true);
				}
			}
		}
		else
		{
			this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
			this.asyncImageEndLoaded2 = function(_image)
			{
				var ColumnSize = this.WordControl.m_oLogicDocument.GetColumnSize();

				var _w = Math.max(1, ColumnSize.W);
				var _h = Math.max(1, ColumnSize.H);
				if (_image.Image != null)
				{
					var __w = Math.max((_image.Image.width * AscCommon.g_dKoef_pix_to_mm), 1);
					var __h = Math.max((_image.Image.height * AscCommon.g_dKoef_pix_to_mm), 1);
					_w      = Math.max(5, Math.min(_w, __w));
					_h      = Math.max(5, Math.min((_w * __h / __w)));
				}
				var src = _image.src;

				if (this.isShapeImageChangeUrl)
				{
					var AscShapeProp       = new Asc.asc_CShapeProperty();
					AscShapeProp.fill      = new asc_CShapeFill();
					AscShapeProp.fill.type = c_oAscFill.FILL_TYPE_BLIP;
					AscShapeProp.fill.fill = new asc_CFillBlip();
					AscShapeProp.fill.fill.asc_putUrl(src);
					this.ImgApply(new asc_CImgProperty({ShapeProperties : AscShapeProp}));
					this.isShapeImageChangeUrl = false;
				}
				else if (this.isImageChangeUrl)
				{
					var AscImageProp      = new asc_CImgProperty();
					AscImageProp.ImageUrl = src;
					this.ImgApply(AscImageProp);
					this.isImageChangeUrl = false;
				}
				else
				{

					if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
					{
						var imageLocal = g_oDocumentUrls.getImageLocal(src);
						if (imageLocal)
						{
							src = imageLocal;
						}
						this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_AddImageUrlLong);
						if (undefined === imgProp || undefined === imgProp.WrappingStyle || 0 == imgProp.WrappingStyle)
							this.WordControl.m_oLogicDocument.Add_InlineImage(_w, _h, src);
						else
							this.WordControl.m_oLogicDocument.Add_InlineImage(_w, _h, src, null, true);
					}
				}
				this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);

				this.asyncImageEndLoaded2 = null;
			}
		}
	};
	/*
	 Добавляем картинку на заданную страницу. Преполагаем, что картинка уже доступна по ссылке.
	 */
	asc_docs_api.prototype.AddImageToPage = function(sUrl, nPageIndex, dX, dY, dW, dH)
	{
		var LogicDocument = this.WordControl.m_oLogicDocument;

		var oldClickCount            = global_mouseEvent.ClickCount;
		global_mouseEvent.Button     = 0;
		global_mouseEvent.ClickCount = 1;
		LogicDocument.OnMouseDown(global_mouseEvent, dX, dY, nPageIndex);
		LogicDocument.OnMouseUp(global_mouseEvent, dX, dY, nPageIndex);
		LogicDocument.OnMouseMove(global_mouseEvent, dX, dY, nPageIndex);
		global_mouseEvent.ClickCount = oldClickCount;

		if (false === LogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			var oPosH = new Asc.CImagePositionH();
			oPosH.put_RelativeFrom(Asc.c_oAscRelativeFromH.Page);
			oPosH.put_Align(false);
			oPosH.put_Value(dX);
			var oPosV = new Asc.CImagePositionV();
			oPosV.put_RelativeFrom(Asc.c_oAscRelativeFromV.Page);
			oPosV.put_Align(false);
			oPosV.put_Value(dY);
			var oImageProps = new asc_CImgProperty();
			oImageProps.asc_putWrappingStyle(c_oAscWrapStyle2.Square);
			oImageProps.asc_putPositionH(oPosH);
			oImageProps.asc_putPositionV(oPosV);

			LogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_AddImageToPage);
			LogicDocument.Start_SilentMode();
			LogicDocument.Add_InlineImage(dW, dH, sUrl);
			LogicDocument.Set_ImageProps(oImageProps);
			LogicDocument.End_SilentMode(true);
		}
	};
	/* В качестве параметра  передается объект класса Asc.asc_CImgProperty, он же приходит на OnImgProp
	 Asc.asc_CImgProperty заменяет пережнюю структуру:
	 если параметр не имеет значения то передвать следует null, напримере inline-картинок: в качестве left,top,bottom,right,X,Y,ImageUrl необходимо передавать null.
	 {
	 Width: 0,
	 Height: 0,
	 WrappingStyle: 0,
	 Paddings: { Left : 0, Top : 0, Bottom: 0, Right: 0 },
	 Position : {X : 0, Y : 0},
	 ImageUrl : ""
	 }
	 */
	asc_docs_api.prototype.ImgApply                = function(obj)
	{

		if (!AscCommon.isRealObject(obj))
			return;
		var ImagePr = obj, AdditionalData, LogicDocument = this.WordControl.m_oLogicDocument;

		/*проверка корректности данных для биржевой диаграммы*/
		if (obj.ChartProperties && obj.ChartProperties.type === Asc.c_oAscChartTypeSettings.stock)
		{
			if (!AscFormat.CheckStockChart(this.WordControl.m_oLogicDocument.DrawingObjects, this))
			{
				return;
			}
		}

		/*изменение z-индекса*/
		if (AscFormat.isRealNumber(ImagePr.ChangeLevel))
		{
			switch (ImagePr.ChangeLevel)
			{
				case 0:
				{
					this.WordControl.m_oLogicDocument.DrawingObjects.bringToFront();
					break;
				}
				case 1:
				{
					this.WordControl.m_oLogicDocument.DrawingObjects.bringForward();
					break;
				}
				case 2:
				{
					this.WordControl.m_oLogicDocument.DrawingObjects.sendToBack();
					break;
				}
				case 3:
				{
					this.WordControl.m_oLogicDocument.DrawingObjects.bringBackward();
				}
			}
			return;
		}

		/*параграфы в которых лежат выделенные ParaDrawing*/
		var aParagraphs = [], aSelectedObjects = this.WordControl.m_oLogicDocument.DrawingObjects.selectedObjects, i, j, oParentParagraph;
		for (i = 0; i < aSelectedObjects.length; ++i)
		{
			oParentParagraph = aSelectedObjects[i].parent.Get_ParentParagraph();
			AscFormat.checkObjectInArray(aParagraphs, oParentParagraph);
		}


		AdditionalData = {
			Type      : AscCommon.changestype_2_ElementsArray_and_Type,
			Elements  : aParagraphs,
			CheckType : changestype_Paragraph_Content
		};
		/*группировка и разгруппировка*/
		if (ImagePr.Group === 1 || ImagePr.Group === -1)
		{
			if (false == this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Drawing_Props, AdditionalData))
			{
				History.Create_NewPoint(AscDFH.historydescription_Document_GroupUnGroup);
				if (ImagePr.Group === 1)
				{
					this.WordControl.m_oLogicDocument.DrawingObjects.groupSelectedObjects();
				}
				else
				{
					this.WordControl.m_oLogicDocument.DrawingObjects.unGroupSelectedObjects();
				}
			}
			return;
		}


		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Image_Properties))
		{
			if (ImagePr.ShapeProperties)
				ImagePr.ImageUrl = "";


			var sImageUrl = null, fReplaceCallback = null, bImageUrl = false, sImageToDownLoad = "";
			if (!AscCommon.isNullOrEmptyString(ImagePr.ImageUrl))
			{
				if (!g_oDocumentUrls.getImageLocal(ImagePr.ImageUrl))
				{
					sImageUrl        = ImagePr.ImageUrl;
					fReplaceCallback = function(sUrl)
					{
						ImagePr.ImageUrl = sUrl;
						sImageToDownLoad = sUrl;
					}
				}
				sImageToDownLoad = ImagePr.ImageUrl;
			}
			else if (ImagePr.ShapeProperties && ImagePr.ShapeProperties.fill &&
				ImagePr.ShapeProperties.fill.fill && !AscCommon.isNullOrEmptyString(ImagePr.ShapeProperties.fill.fill.url))
			{
				if (!g_oDocumentUrls.getImageLocal(ImagePr.ShapeProperties.fill.fill.url))
				{
					sImageUrl        = ImagePr.ShapeProperties.fill.fill.url;
					fReplaceCallback = function(sUrl)
					{
						ImagePr.ShapeProperties.fill.fill.url = sUrl;
						sImageToDownLoad                      = sUrl;
					}
				}
				sImageToDownLoad = ImagePr.ShapeProperties.fill.fill.url;
			}

			var oApi = this;

			if (!AscCommon.isNullOrEmptyString(sImageToDownLoad))
			{

				var fApplyCallback = function()
				{
					var _img = oApi.ImageLoader.LoadImage(sImageToDownLoad, 1);
					if (null != _img)
					{
						oApi.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_ApplyImagePrWithUrl);
						oApi.WordControl.m_oLogicDocument.Set_ImageProps(ImagePr);
					}
					else
					{
						oApi.asyncImageEndLoaded2 = function(_image)
						{
							oApi.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_ApplyImagePrWithUrlLong);
							oApi.WordControl.m_oLogicDocument.Set_ImageProps(ImagePr);
						}
					}
				};

				if (sImageUrl)
				{

					if (window["AscDesktopEditor"])
					{
						var _url = window["AscDesktopEditor"]["LocalFileGetImageUrl"](sImageToDownLoad);
						_url     = g_oDocumentUrls.getImageUrl(_url);
						fReplaceCallback(_url);
						fApplyCallback();
						return;
					}

					var rData = {
						"id"        : this.documentId,
						"userid"    : this.documentUserId,
						"c"         : "imgurl",
						"saveindex" : g_oDocumentUrls.getMaxIndex(),
						"data"      : sImageToDownLoad
					};

					this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
					this.fCurCallback = function(input)
					{
						if (null != input && "imgurl" == input["type"])
						{
							if ("ok" == input["status"])
							{
								var data = input["data"];
								var urls = {};
								var firstUrl;
								for (var i = 0; i < data.length; ++i)
								{
									var elem = data[i];
									if (elem.url)
									{
										if (!firstUrl)
										{
											firstUrl = elem.url;
										}
										urls[elem.path] = elem.url;
									}
								}
								g_oDocumentUrls.addUrls(urls);
								if (firstUrl)
								{
									fReplaceCallback(firstUrl);
									fApplyCallback();
								}
								else
								{
									oApi.sendEvent("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.NoCritical);
								}
							}
							else
							{
								oApi.sendEvent("asc_onError", mapAscServerErrorToAscError(parseInt(input["data"])), c_oAscError.Level.NoCritical);
							}
						}
						else
						{
							oApi.sendEvent("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.NoCritical);
						}
						oApi.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
					};
					sendCommand(this, null, rData);
				}
				else
				{
					fApplyCallback();
				}
			}
			else
			{
				ImagePr.ImageUrl = null;
				if (!this.noCreatePoint || this.exucuteHistory)
				{
					if (!this.noCreatePoint && !this.exucuteHistory && this.exucuteHistoryEnd)
					{
						if (-1 !== this.nCurPointItemsLength)
						{
							History.UndoLastPoint();
						}
						else
						{
							History.Create_NewPoint(AscDFH.historydescription_Document_ApplyImagePr);
						}
						this.WordControl.m_oLogicDocument.Set_ImageProps(ImagePr);
						this.exucuteHistoryEnd    = false;
						this.nCurPointItemsLength = -1;
					}
					else
					{
						this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_ApplyImagePr);
						this.WordControl.m_oLogicDocument.Set_ImageProps(ImagePr);
					}
					if (this.exucuteHistory)
					{
						this.exucuteHistory = false;
						var oPoint          = History.Points[History.Index];
						if (oPoint)
						{
							this.nCurPointItemsLength = oPoint.Items.length;
						}
					}
				}
				else
				{
					var bNeedCheckChangesCount = false;
					if (-1 !== this.nCurPointItemsLength)
					{
						History.UndoLastPoint();
					}
					else
					{
						bNeedCheckChangesCount = true;
						History.Create_NewPoint(AscDFH.historydescription_Document_ApplyImagePr);
					}
					this.WordControl.m_oLogicDocument.Set_ImageProps(ImagePr);
					if (bNeedCheckChangesCount)
					{
						var oPoint = History.Points[History.Index];
						if (oPoint)
						{
							this.nCurPointItemsLength = oPoint.Items.length;
						}
					}
				}
			}
		}
	};
	asc_docs_api.prototype.set_Size                = function(width, height)
	{

	};
	asc_docs_api.prototype.set_ConstProportions    = function(isOn)
	{
		if (isOn)
		{

		}
		else
		{

		}
	};
	asc_docs_api.prototype.set_WrapStyle           = function(type)
	{

	};
	asc_docs_api.prototype.deleteImage             = function()
	{

	};
	asc_docs_api.prototype.set_ImgDistanceFromText = function(left, top, right, bottom)
	{

	};
	asc_docs_api.prototype.set_PositionOnPage      = function(X, Y)
	{//расположение от начала страницы

	};
	asc_docs_api.prototype.get_OriginalSizeImage   = function()
	{
		if (0 == this.SelectedObjectsStack.length)
			return null;
		var obj = this.SelectedObjectsStack[this.SelectedObjectsStack.length - 1];
		if (obj == null)
			return null;
		if (obj.Type == c_oAscTypeSelectElement.Image)
			return obj.Value.asc_getOriginSize(this);
	};

	asc_docs_api.prototype.ShapeApply = function(shapeProps)
	{
		// нужно определить, картинка это или нет
		var image_url = "";
		if (shapeProps.fill != null)
		{
			if (shapeProps.fill.fill != null && shapeProps.fill.type == c_oAscFill.FILL_TYPE_BLIP)
			{
				image_url = shapeProps.fill.fill.asc_getUrl();

				var _tx_id = shapeProps.fill.fill.asc_getTextureId();
				if (null != _tx_id && 0 <= _tx_id && _tx_id < AscCommon.g_oUserTexturePresets.length)
				{
					image_url = AscCommon.g_oUserTexturePresets[_tx_id];
				}
			}
		}
		if (image_url != "")
		{
			var _image = this.ImageLoader.LoadImage(image_url, 1);

			var imageLocal = g_oDocumentUrls.getImageLocal(image_url);
			if (imageLocal)
			{
				shapeProps.fill.fill.asc_putUrl(imageLocal); // erase documentUrl
			}

			if (null != _image)
			{
				this.WordControl.m_oLogicDocument.ShapeApply(shapeProps);
				this.WordControl.m_oDrawingDocument.DrawImageTextureFillShape(image_url);
			}
			else
			{
				this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);

				var oProp                 = shapeProps;
				this.asyncImageEndLoaded2 = function(_image)
				{
					this.WordControl.m_oLogicDocument.ShapeApply(oProp);
					this.WordControl.m_oDrawingDocument.DrawImageTextureFillShape(image_url);

					this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
					this.asyncImageEndLoaded2 = null;
				}
			}
		}
		else
		{
			this.WordControl.m_oLogicDocument.ShapeApply(shapeProps);
		}
	};
	/*callbacks*/
	asc_docs_api.prototype.sync_AddImageCallback            = function()
	{
		this.sendEvent("asc_onAddImage");
	};
	asc_docs_api.prototype.sync_ImgPropCallback             = function(imgProp)
	{
		//if ( true === CollaborativeEditing.Get_GlobalLock() )
		//    imgProp.Locked = true;

		this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject(c_oAscTypeSelectElement.Image, new asc_CImgProperty(imgProp));
	};
	asc_docs_api.prototype.sync_ImgWrapStyleChangedCallback = function(style)
	{
		this.sendEvent("asc_onImgWrapStyleChanged", style);
	};


	asc_docs_api.prototype.asc_addOleObjectAction = function(sLocalUrl, sData, sApplicationId, fWidth, fHeight, nWidthPix, nHeightPix)
	{
		var _image = this.ImageLoader.LoadImage(AscCommon.getFullImageSrc2(sLocalUrl), 1);
		if (null != _image)//картинка уже должна быть загружена
		{
			this.WordControl.m_oLogicDocument.Add_OleObject(fWidth, fHeight, nWidthPix, nHeightPix, sLocalUrl, sData, sApplicationId);
		}
	};

	asc_docs_api.prototype.asc_editOleObjectAction = function(bResize, oOleObject, sImageUrl, sData, nPixWidth, nPixHeight)
	{
		if (oOleObject)
		{
			this.WordControl.m_oLogicDocument.Edit_OleObject(oOleObject, sData, sImageUrl, nPixWidth, nPixHeight);
			this.WordControl.m_oLogicDocument.Recalculate();
			this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
		}
	};

    asc_docs_api.prototype.asc_startEditCurrentOleObject = function(){
		this.WordControl.m_oLogicDocument.DrawingObjects.startEditCurrentOleObject();
    };
	//-----------------------------------------------------------------
	// События контекстного меню
	//-----------------------------------------------------------------

	function CContextMenuData(obj)
	{
		if (obj)
		{
			this.Type  = ( undefined != obj.Type ) ? obj.Type : Asc.c_oAscContextMenuTypes.Common;
			this.X_abs = ( undefined != obj.X_abs ) ? obj.X_abs : 0;
			this.Y_abs = ( undefined != obj.Y_abs ) ? obj.Y_abs : 0;

			switch (this.Type)
			{
				case Asc.c_oAscContextMenuTypes.ChangeHdrFtr :
				{
					this.PageNum = ( undefined != obj.PageNum ) ? obj.PageNum : 0;
					this.Header  = ( undefined != obj.Header  ) ? obj.Header : true;

					break;
				}
			}
		}
		else
		{
			this.Type  = Asc.c_oAscContextMenuTypes.Common;
			this.X_abs = 0;
			this.Y_abs = 0;
		}
	}

	CContextMenuData.prototype.get_Type    = function()
	{
		return this.Type;
	};
	CContextMenuData.prototype.get_X       = function()
	{
		return this.X_abs;
	};
	CContextMenuData.prototype.get_Y       = function()
	{
		return this.Y_abs;
	};
	CContextMenuData.prototype.get_PageNum = function()
	{
		return this.PageNum;
	};
	CContextMenuData.prototype.is_Header   = function()
	{
		return this.Header;
	};

	asc_docs_api.prototype.sync_ContextMenuCallback = function(Data)
	{
		this.sendEvent("asc_onContextMenu", new CContextMenuData(Data));
	};


	asc_docs_api.prototype.sync_MouseMoveStartCallback = function()
	{
		this.sendEvent("asc_onMouseMoveStart");
	};

	asc_docs_api.prototype.sync_MouseMoveEndCallback = function()
	{
		this.sendEvent("asc_onMouseMoveEnd");
	};

	asc_docs_api.prototype.sync_MouseMoveCallback = function(Data)
	{
		this.sendEvent("asc_onMouseMove", Data);
	};

	asc_docs_api.prototype.sync_ShowForeignCursorLabel = function(UserId, X, Y, Color)
	{
		this.sendEvent("asc_onShowForeignCursorLabel", UserId, X, Y, new AscCommon.CColor(Color.r, Color.g, Color.b, 255));
	};
	asc_docs_api.prototype.sync_HideForeignCursorLabel = function(UserId)
	{
		this.sendEvent("asc_onHideForeignCursorLabel", UserId);
	};

	//-----------------------------------------------------------------
	// Функции для работы с гиперссылками
	//-----------------------------------------------------------------
	asc_docs_api.prototype.can_AddHyperlink = function()
	{
		//if ( true === CollaborativeEditing.Get_GlobalLock() )
		//    return false;

		var bCanAdd = this.WordControl.m_oLogicDocument.Hyperlink_CanAdd(true);
		if (true === bCanAdd)
			return this.WordControl.m_oLogicDocument.Get_SelectedText(true);

		return false;
	};

	// HyperProps - объект CHyperlinkProperty
	asc_docs_api.prototype.add_Hyperlink = function(HyperProps)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_AddHyperlink);
			this.WordControl.m_oLogicDocument.Hyperlink_Add(HyperProps);
		}
	};

	// HyperProps - объект CHyperlinkProperty
	asc_docs_api.prototype.change_Hyperlink = function(HyperProps)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_ChangeHyperlink);
			this.WordControl.m_oLogicDocument.Hyperlink_Modify(HyperProps);
		}
	};

	asc_docs_api.prototype.remove_Hyperlink = function()
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_RemoveHyperlink);
			this.WordControl.m_oLogicDocument.Hyperlink_Remove();
		}
	};

	function CHyperlinkProperty(obj)
	{
		if (obj)
		{
			this.Text    = (undefined != obj.Text   ) ? obj.Text : null;
			this.Value   = (undefined != obj.Value  ) ? obj.Value : "";
			this.ToolTip = (undefined != obj.ToolTip) ? obj.ToolTip : "";
		}
		else
		{
			this.Text    = null;
			this.Value   = "";
			this.ToolTip = "";
		}
	}

	CHyperlinkProperty.prototype.get_Value   = function()
	{
		return this.Value;
	};
	CHyperlinkProperty.prototype.put_Value   = function(v)
	{
		this.Value = v;
	};
	CHyperlinkProperty.prototype.get_ToolTip = function()
	{
		return this.ToolTip;
	};
	CHyperlinkProperty.prototype.put_ToolTip = function(v)
	{
		this.ToolTip = v ? v.slice(0, Asc.c_oAscMaxTooltipLength) : v;
	};
	CHyperlinkProperty.prototype.get_Text    = function()
	{
		return this.Text;
	};
	CHyperlinkProperty.prototype.put_Text    = function(v)
	{
		this.Text = v;
	};

	asc_docs_api.prototype.sync_HyperlinkPropCallback = function(hyperProp)
	{
		this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject(c_oAscTypeSelectElement.Hyperlink, new CHyperlinkProperty(hyperProp));
	};

	asc_docs_api.prototype.sync_HyperlinkClickCallback = function(Url)
	{
		this.sendEvent("asc_onHyperlinkClick", Url);
	};

	asc_docs_api.prototype.sync_CanAddHyperlinkCallback = function(bCanAdd)
	{
		//if ( true === CollaborativeEditing.Get_GlobalLock() )
		//    this.sendEvent("asc_onCanAddHyperlink", false);
		//else
		this.sendEvent("asc_onCanAddHyperlink", bCanAdd);
	};

	asc_docs_api.prototype.sync_DialogAddHyperlink = function()
	{
		this.sendEvent("asc_onDialogAddHyperlink");
	};

	asc_docs_api.prototype.sync_DialogAddHyperlink = function()
	{
		this.sendEvent("asc_onDialogAddHyperlink");
	};

	//-----------------------------------------------------------------
	// Функции для работы с орфографией
	//-----------------------------------------------------------------
	function asc_CSpellCheckProperty(Word, Checked, Variants, ParaId, ElemId)
	{
		this.Word     = Word;
		this.Checked  = Checked;
		this.Variants = Variants;

		this.ParaId = ParaId;
		this.ElemId = ElemId;
	}

	asc_CSpellCheckProperty.prototype.get_Word     = function()
	{
		return this.Word;
	};
	asc_CSpellCheckProperty.prototype.get_Checked  = function()
	{
		return this.Checked;
	};
	asc_CSpellCheckProperty.prototype.get_Variants = function()
	{
		return this.Variants;
	};

	asc_docs_api.prototype.sync_SpellCheckCallback = function(Word, Checked, Variants, ParaId, ElemId)
	{
		this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject(c_oAscTypeSelectElement.SpellCheck, new asc_CSpellCheckProperty(Word, Checked, Variants, ParaId, ElemId));
	};

	asc_docs_api.prototype.sync_SpellCheckVariantsFound = function()
	{
		this.sendEvent("asc_onSpellCheckVariantsFound");
	};

	asc_docs_api.prototype.asc_replaceMisspelledWord = function(Word, SpellCheckProperty)
	{
		var ParaId = SpellCheckProperty.ParaId;
		var ElemId = SpellCheckProperty.ElemId;

		var Paragraph = g_oTableId.Get_ById(ParaId);
		if (null != Paragraph && false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_None, {
				Type      : AscCommon.changestype_2_Element_and_Type,
				Element   : Paragraph,
				CheckType : changestype_Paragraph_Content
			}))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_ReplaceMisspelledWord);
			Paragraph.Replace_MisspelledWord(Word, ElemId);
			this.WordControl.m_oLogicDocument.Recalculate();
			Paragraph.Document_SetThisElementCurrent(true);
		}
	};

	asc_docs_api.prototype.asc_ignoreMisspelledWord = function(SpellCheckProperty, bAll)
	{
		if (false === bAll)
		{
			var ParaId = SpellCheckProperty.ParaId;
			var ElemId = SpellCheckProperty.ElemId;

			var Paragraph = g_oTableId.Get_ById(ParaId);
			if (null != Paragraph)
			{
				Paragraph.Ignore_MisspelledWord(ElemId);
			}
		}
		else
		{
			var LogicDocument = editor.WordControl.m_oLogicDocument;
			LogicDocument.Spelling.Add_Word(SpellCheckProperty.Word);
			LogicDocument.DrawingDocument.ClearCachePages();
			LogicDocument.DrawingDocument.FirePaint();
		}
	};

	asc_docs_api.prototype.asc_setDefaultLanguage = function(Lang)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Document_SectPr))
		{
			History.Create_NewPoint(AscDFH.historydescription_Document_SetDefaultLanguage);
			editor.WordControl.m_oLogicDocument.Set_DefaultLanguage(Lang);
		}
	};

	asc_docs_api.prototype.asc_getDefaultLanguage = function()
	{
		return editor.WordControl.m_oLogicDocument.Get_DefaultLanguage();
	};

	asc_docs_api.prototype.asc_getKeyboardLanguage = function()
	{
		if (undefined !== window["asc_current_keyboard_layout"])
			return window["asc_current_keyboard_layout"];
		return -1;
	};

	asc_docs_api.prototype.asc_setSpellCheck = function(isOn)
	{
		if (editor.WordControl.m_oLogicDocument)
		{
			editor.WordControl.m_oLogicDocument.Spelling.Use = isOn;
			editor.WordControl.m_oDrawingDocument.ClearCachePages();
			editor.WordControl.m_oDrawingDocument.FirePaint();
		}
	};
	//-----------------------------------------------------------------
	// Функции для работы с комментариями
	//-----------------------------------------------------------------
	function asc_CCommentDataWord(obj)
	{
		if (obj)
		{
			this.m_sText      = (undefined != obj.m_sText     ) ? obj.m_sText : "";
			this.m_sTime      = (undefined != obj.m_sTime     ) ? obj.m_sTime : "";
			this.m_sUserId    = (undefined != obj.m_sUserId   ) ? obj.m_sUserId : "";
			this.m_sQuoteText = (undefined != obj.m_sQuoteText) ? obj.m_sQuoteText : null;
			this.m_bSolved    = (undefined != obj.m_bSolved   ) ? obj.m_bSolved : false;
			this.m_sUserName  = (undefined != obj.m_sUserName ) ? obj.m_sUserName : "";
			this.m_aReplies   = [];
			if (undefined != obj.m_aReplies)
			{
				var Count = obj.m_aReplies.length;
				for (var Index = 0; Index < Count; Index++)
				{
					var Reply = new asc_CCommentDataWord(obj.m_aReplies[Index]);
					this.m_aReplies.push(Reply);
				}
			}
		}
		else
		{
			this.m_sText      = "";
			this.m_sTime      = "";
			this.m_sUserId    = "";
			this.m_sQuoteText = null;
			this.m_bSolved    = false;
			this.m_sUserName  = "";
			this.m_aReplies   = [];
		}
	}

	asc_CCommentDataWord.prototype.asc_getText         = function()
	{
		return this.m_sText;
	};
	asc_CCommentDataWord.prototype.asc_putText         = function(v)
	{
		this.m_sText = v ? v.slice(0, Asc.c_oAscMaxCellOrCommentLength) : v;
	};
	asc_CCommentDataWord.prototype.asc_getTime         = function()
	{
		return this.m_sTime;
	};
	asc_CCommentDataWord.prototype.asc_putTime         = function(v)
	{
		this.m_sTime = v;
	};
	asc_CCommentDataWord.prototype.asc_getUserId       = function()
	{
		return this.m_sUserId;
	};
	asc_CCommentDataWord.prototype.asc_putUserId       = function(v)
	{
		this.m_sUserId = v;
	};
	asc_CCommentDataWord.prototype.asc_getUserName     = function()
	{
		return this.m_sUserName;
	};
	asc_CCommentDataWord.prototype.asc_putUserName     = function(v)
	{
		this.m_sUserName = v;
	};
	asc_CCommentDataWord.prototype.asc_getQuoteText    = function()
	{
		return this.m_sQuoteText;
	};
	asc_CCommentDataWord.prototype.asc_putQuoteText    = function(v)
	{
		this.m_sQuoteText = v;
	};
	asc_CCommentDataWord.prototype.asc_getSolved       = function()
	{
		return this.m_bSolved;
	};
	asc_CCommentDataWord.prototype.asc_putSolved       = function(v)
	{
		this.m_bSolved = v;
	};
	asc_CCommentDataWord.prototype.asc_getReply        = function(i)
	{
		return this.m_aReplies[i];
	};
	asc_CCommentDataWord.prototype.asc_addReply        = function(v)
	{
		this.m_aReplies.push(v);
	};
	asc_CCommentDataWord.prototype.asc_getRepliesCount = function(v)
	{
		return this.m_aReplies.length;
	};


	asc_docs_api.prototype.asc_showComments = function()
	{
		if (null == this.WordControl.m_oLogicDocument)
			return;

		this.WordControl.m_oLogicDocument.Show_Comments();
	};

	asc_docs_api.prototype.asc_hideComments = function()
	{
		if (null == this.WordControl.m_oLogicDocument)
			return;

		this.WordControl.m_oLogicDocument.Hide_Comments();
		editor.sync_HideComment();
	};

	asc_docs_api.prototype.asc_addComment = function(AscCommentData)
	{
	};

	asc_docs_api.prototype.asc_removeComment = function(Id)
	{
		if (null == this.WordControl.m_oLogicDocument)
			return;

		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_None, {
				Type : AscCommon.changestype_2_Comment,
				Id   : Id
			}))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_RemoveComment);
			this.WordControl.m_oLogicDocument.Remove_Comment(Id, true, true);
		}
	};

	asc_docs_api.prototype.asc_changeComment = function(Id, AscCommentData)
	{
		if (null == this.WordControl.m_oLogicDocument)
			return;

		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_None, {
				Type : AscCommon.changestype_2_Comment,
				Id   : Id
			}))
		{
			var CommentData = new AscCommon.CCommentData();
			CommentData.Read_FromAscCommentData(AscCommentData);

			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_ChangeComment);
			this.WordControl.m_oLogicDocument.Change_Comment(Id, CommentData);

			this.sync_ChangeCommentData(Id, CommentData);
		}
	};

	asc_docs_api.prototype.asc_selectComment = function(Id)
	{
		if (null == this.WordControl.m_oLogicDocument)
			return;

		this.WordControl.m_oLogicDocument.Select_Comment(Id, true);
	};

	asc_docs_api.prototype.asc_showComment = function(Id)
	{
		this.WordControl.m_oLogicDocument.Show_Comment(Id);
	};

	asc_docs_api.prototype.can_AddQuotedComment = function()
	{
		//if ( true === CollaborativeEditing.Get_GlobalLock() )
		//    return false;

		return this.WordControl.m_oLogicDocument.CanAdd_Comment();
	};

	asc_docs_api.prototype.sync_RemoveComment = function(Id)
	{
		this.sendEvent("asc_onRemoveComment", Id);
	};

	asc_docs_api.prototype.sync_AddComment = function(Id, CommentData)
	{
		var AscCommentData = new asc_CCommentDataWord(CommentData);
		this.sendEvent("asc_onAddComment", Id, AscCommentData);
	};

	asc_docs_api.prototype.sync_ShowComment = function(Id, X, Y)
	{
		// TODO: Переделать на нормальный массив
		this.sendEvent("asc_onShowComment", [Id], X, Y);
	};

	asc_docs_api.prototype.sync_HideComment = function()
	{
		this.sendEvent("asc_onHideComment");
	};

	asc_docs_api.prototype.sync_UpdateCommentPosition = function(Id, X, Y)
	{
		// TODO: Переделать на нормальный массив
		this.sendEvent("asc_onUpdateCommentPosition", [Id], X, Y);
	};

	asc_docs_api.prototype.sync_ChangeCommentData = function(Id, CommentData)
	{
		var AscCommentData = new asc_CCommentDataWord(CommentData);
		this.sendEvent("asc_onChangeCommentData", Id, AscCommentData);
	};

	asc_docs_api.prototype.sync_LockComment = function(Id, UserId)
	{
		this.sendEvent("asc_onLockComment", Id, UserId);
	};

	asc_docs_api.prototype.sync_UnLockComment = function(Id)
	{
		this.sendEvent("asc_onUnLockComment", Id);
	};

	asc_docs_api.prototype.asc_getComments        = function()
	{
		var ResComments   = [];
		var LogicDocument = this.WordControl.m_oLogicDocument;
		if (undefined != LogicDocument)
		{
			var DocComments = LogicDocument.Comments;
			for (var Id in DocComments.m_aComments)
			{
				var AscCommentData = new asc_CCommentDataWord(DocComments.m_aComments[Id].Data);
				ResComments.push({"Id" : Id, "Comment" : AscCommentData});
			}
		}

		return ResComments;
	};
	//-----------------------------------------------------------------
	asc_docs_api.prototype.sync_LockHeaderFooters = function()
	{
		this.sendEvent("asc_onLockHeaderFooters");
	};

	asc_docs_api.prototype.sync_LockDocumentProps = function()
	{
		this.sendEvent("asc_onLockDocumentProps");
	};

	asc_docs_api.prototype.sync_UnLockHeaderFooters = function()
	{
		this.sendEvent("asc_onUnLockHeaderFooters");
	};

	asc_docs_api.prototype.sync_UnLockDocumentProps = function()
	{
		this.sendEvent("asc_onUnLockDocumentProps");
	};

	asc_docs_api.prototype.sync_CollaborativeChanges = function()
	{
		if (true !== AscCommon.CollaborativeEditing.Is_Fast())
			this.sendEvent("asc_onCollaborativeChanges");
	};

	asc_docs_api.prototype.sync_LockDocumentSchema = function()
	{
		this.sendEvent("asc_onLockDocumentSchema");
	};

	asc_docs_api.prototype.sync_UnLockDocumentSchema = function()
	{
		this.sendEvent("asc_onUnLockDocumentSchema");
	};


	/*----------------------------------------------------------------*/
	/*functions for working with zoom & navigation*/
	asc_docs_api.prototype.zoomIn         = function()
	{
		this.WordControl.zoom_In();
	};
	asc_docs_api.prototype.zoomOut        = function()
	{
		this.WordControl.zoom_Out();
	};
	asc_docs_api.prototype.zoomFitToPage  = function()
	{
		if (!this.isLoadFullApi)
		{
			this.tmpZoomType = AscCommon.c_oZoomType.FitToPage;
			return;
		}
		this.WordControl.zoom_FitToPage();
	};
	asc_docs_api.prototype.zoomFitToWidth = function()
	{
		if (!this.isLoadFullApi)
		{
			this.tmpZoomType = AscCommon.c_oZoomType.FitToWidth;
			return;
		}
		this.WordControl.zoom_FitToWidth();
	};
	asc_docs_api.prototype.zoomCustomMode = function()
	{
		if (!this.isLoadFullApi)
		{
			this.tmpZoomType = AscCommon.c_oZoomType.CustomMode;
			return;
		}
		this.WordControl.m_nZoomType = 0;
		this.WordControl.zoom_Fire(0, this.WordControl.m_nZoomValue);
	};
	asc_docs_api.prototype.zoom100        = function()
	{
		this.zoom(100);
	};
	asc_docs_api.prototype.zoom           = function(percent)
	{
		var _old_val                  = this.WordControl.m_nZoomValue;
		this.WordControl.m_nZoomValue = percent;
		this.WordControl.m_nZoomType  = 0;
		this.WordControl.zoom_Fire(0, _old_val);
	};
	asc_docs_api.prototype.goToPage       = function(number)
	{
		this.WordControl.GoToPage(number);
	};
	asc_docs_api.prototype.getCountPages  = function()
	{
		return this.WordControl.m_oDrawingDocument.m_lPagesCount;
	};
	asc_docs_api.prototype.getCurrentPage = function()
	{
		return this.WordControl.m_oDrawingDocument.m_lCurrentPage;
	};
	/*callbacks*/
	asc_docs_api.prototype.sync_zoomChangeCallback  = function(percent, type)
	{	//c_oAscZoomType.Current, c_oAscZoomType.FitWidth, c_oAscZoomType.FitPage
		this.sendEvent("asc_onZoomChange", percent, type);
	};
	asc_docs_api.prototype.sync_countPagesCallback  = function(count)
	{
		this.sendEvent("asc_onCountPages", count);
	};
	asc_docs_api.prototype.sync_currentPageCallback = function(number)
	{
		this.sendEvent("asc_onCurrentPage", number);
	};

	/*----------------------------------------------------------------*/
	asc_docs_api.prototype.asc_enableKeyEvents = function(value, isFromInput)
	{
		if (!this.isLoadFullApi)
		{
			this.tmpFocus = value;
			return;
		}

		if (this.WordControl.IsFocus != value)
		{
			this.WordControl.IsFocus = value;

			if (this.WordControl.IsFocus && null != this.WordControl.TextBoxInput)
				this.WordControl.TextBoxInput.focus();

			this.sendEvent("asc_onEnableKeyEventsChanged", value);
		}

		if (isFromInput !== true && AscCommon.g_inputContext)
			AscCommon.g_inputContext.setInterfaceEnableKeyEvents(value);
	};
	asc_docs_api.prototype.asc_IsFocus         = function(bIsNaturalFocus)
	{
		var _ret = false;
		if (this.WordControl.IsFocus)
			_ret = true;
		if (_ret && bIsNaturalFocus && this.WordControl.TextBoxInputFocus)
			_ret = false;
		return _ret;
	};

	asc_docs_api.prototype.asyncServerIdEndLoaded = function()
	{
		this.ServerIdWaitComplete = true;
		if (true == this.ServerImagesWaitComplete)
			this.OpenDocumentEndCallback();
	};

	// работа с шрифтами
	asc_docs_api.prototype.asyncFontsDocumentStartLoaded = function()
	{
		// здесь прокинуть евент о заморозке меню
		// и нужно вывести информацию в статус бар
		if (this.isPasteFonts_Images)
			this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadFont);
		else if (this.isSaveFonts_Images)
			this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);
		else
		{
			this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentFonts);

			// заполним прогресс
			var _progress         = this.OpenDocumentProgress;
			_progress.Type        = c_oAscAsyncAction.LoadDocumentFonts;
			_progress.FontsCount  = this.FontLoader.fonts_loading.length;
			_progress.CurrentFont = 0;

			var _loader_object = this.WordControl.m_oLogicDocument;
			var _count         = 0;
			if (_loader_object !== undefined && _loader_object != null)
			{
				for (var i in _loader_object.ImageMap)
				{
					if (this.DocInfo.get_OfflineApp())
					{
						var localUrl = _loader_object.ImageMap[i];
						g_oDocumentUrls.addImageUrl(localUrl, this.documentUrl + 'media/' + localUrl);
					}
					++_count;
				}
			}

			_progress.ImagesCount  = _count;
			_progress.CurrentImage = 0;
		}
	};
	asc_docs_api.prototype.GenerateStyles                = function()
	{
		if (window["NATIVE_EDITOR_ENJINE"] === true)
		{
			if (!this.asc_checkNeedCallback("asc_onInitEditorStyles"))
				return;
		}

		var StylesPainter = new AscCommonWord.CStylesPainter();
		var LogicDocument = this.WordControl.m_oLogicDocument;
		if (LogicDocument)
		{
			var isTrackRevision = LogicDocument.Is_TrackRevisions();
			var isShowParaMarks = LogicDocument.Is_ShowParagraphMarks();

			if (true === isTrackRevision)
				LogicDocument.Set_TrackRevisions(false);

			if (true === isShowParaMarks)
				LogicDocument.Set_ShowParagraphMarks(false, false);

			StylesPainter.GenerateStyles(this, (null == this.LoadedObject) ? this.WordControl.m_oLogicDocument.Get_Styles().Style : this.LoadedObjectDS);

			if (true === isTrackRevision)
				LogicDocument.Set_TrackRevisions(true);

			if (true === isShowParaMarks)
				LogicDocument.Set_ShowParagraphMarks(true, false);
		}
	};
	asc_docs_api.prototype.asyncFontsDocumentEndLoaded   = function()
	{
		// все, шрифты загружены. Теперь нужно подгрузить картинки
		if (this.isPasteFonts_Images)
			this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadFont);
		else if (this.isSaveFonts_Images)
			this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);
		else
			this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentFonts);

		this.EndActionLoadImages = 0;
		if (this.isPasteFonts_Images)
		{
			var _count = 0;
			for (var i in this.pasteImageMap)
				++_count;

			if (_count > 0)
			{
				this.EndActionLoadImages = 2;
				this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
			}

			var _oldAsyncLoadImages                     = this.ImageLoader.bIsAsyncLoadDocumentImages;
			this.ImageLoader.bIsAsyncLoadDocumentImages = false;
			this.ImageLoader.LoadDocumentImages(this.pasteImageMap, false);
			this.ImageLoader.bIsAsyncLoadDocumentImages = true;
			return;
		}
		else if (this.isSaveFonts_Images)
		{
			var _count = 0;
			for (var i in this.saveImageMap)
				++_count;

			if (_count > 0)
			{
				this.EndActionLoadImages = 2;
				this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
			}

			this.ImageLoader.LoadDocumentImages(this.saveImageMap, false);
			return;
		}

		if (!this.FontLoader.embedded_cut_manager.bIsCutFontsUse)
			this.GenerateStyles();

		if (null != this.WordControl.m_oLogicDocument)
		{
			this.WordControl.m_oDrawingDocument.CheckGuiControlColors();
			this.sendColorThemes(this.WordControl.m_oLogicDocument.theme);
			this.sendEvent("asc_onUpdateChartStyles");
		}

		if (this.isLoadNoCutFonts)
		{
			this.isLoadNoCutFonts = false;
			this.asc_setViewMode(false);
			return;
		}

		// открытие после загрузки документа

		var _loader_object = this.WordControl.m_oLogicDocument;
		if (null == _loader_object)
			_loader_object = this.WordControl.m_oDrawingDocument.m_oDocumentRenderer;

		var _count = 0;
		for (var i in _loader_object.ImageMap)
			++_count;

		if (!this.isOnlyReaderMode)
		{
			// add const textures
			var _st_count = AscCommon.g_oUserTexturePresets.length;
			for (var i = 0; i < _st_count; i++)
				_loader_object.ImageMap[_count + i] = AscCommon.g_oUserTexturePresets[i];

			if (this.OpenDocumentProgress && !this.ImageLoader.bIsAsyncLoadDocumentImages)
			{
				this.OpenDocumentProgress.ImagesCount += _st_count;
			}
		}

		if (_count > 0)
		{
			this.EndActionLoadImages = 1;
			this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentImages);
		}

		this.ImageLoader.bIsLoadDocumentFirst = true;
		this.ImageLoader.LoadDocumentImages(_loader_object.ImageMap, true);
	};

	asc_docs_api.prototype.CreateFontsCharMap = function()
	{
		var _info = new CFontsCharMap();
		_info.StartWork();

		this.WordControl.m_oLogicDocument.Document_CreateFontCharMap(_info);

		return _info.EndWork();
	};

	asc_docs_api.prototype.sync_SendThemeColors       = function(colors, standart_colors)
	{
		this._gui_control_colors = {Colors : colors, StandartColors : standart_colors};
		this.sendEvent("asc_onSendThemeColors", colors, standart_colors);
	};

	asc_docs_api.prototype.ChangeColorScheme            = function(index_scheme)
	{
		if (null == this.WordControl.m_oLogicDocument)
			return;

		var _changer = this.WordControl.m_oLogicDocument.DrawingObjects;
		if (null == _changer)
			return;

		var theme = this.WordControl.m_oLogicDocument.theme;

		if (this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_ColorScheme) === false)
		{
			var scheme = AscCommon.getColorThemeByIndex(index_scheme);
			if (!scheme)
			{
				index_scheme -= AscCommon.g_oUserColorScheme.length;

				if (index_scheme < 0 || index_scheme >= theme.extraClrSchemeLst.length)
					return;

				scheme = theme.extraClrSchemeLst[index_scheme].clrScheme.createDuplicate();
				/*_changer.calculateAfterChangeTheme();

				 // TODO:
				 this.WordControl.m_oDrawingDocument.ClearCachePages();
				 this.WordControl.OnScroll();*/
			}

			History.Create_NewPoint(AscDFH.historydescription_Document_ChangeColorScheme);
			var data = {
				Type: AscDFH.historyitem_ChangeColorScheme,
				oldScheme: theme.themeElements.clrScheme,
				newScheme: scheme
			};
			theme.themeElements.clrScheme = scheme;
			History.Add(this.WordControl.m_oLogicDocument.DrawingObjects, data);
			this.WordControl.m_oDrawingDocument.CheckGuiControlColors();
			this.chartPreviewManager.clearPreviews();
			this.textArtPreviewManager.clear();
			this.sendEvent("asc_onUpdateChartStyles");
			this.WordControl.m_oLogicDocument.Recalculate();


			// TODO:
			this.WordControl.m_oDrawingDocument.ClearCachePages();
			this.WordControl.OnScroll();

			this.WordControl.m_oDrawingDocument.CheckGuiControlColors();
			this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
		}

	};
	asc_docs_api.prototype.asyncImagesDocumentEndLoaded = function()
	{
		this.ImageLoader.bIsLoadDocumentFirst = false;
		var _bIsOldPaste                      = this.isPasteFonts_Images;

		if (null != this.WordControl.m_oDrawingDocument.m_oDocumentRenderer)
		{
			if (this.EndActionLoadImages == 1)
			{
				this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentImages);
			}
			else if (this.EndActionLoadImages == 2)
			{
				if (this.isPasteFonts_Images)
					this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
				else
					this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
			}
			this.EndActionLoadImages = 0;

			this.WordControl.m_oDrawingDocument.OpenDocument();

			this.LoadedObject = null;

			this.bInit_word_control = true;

			if (false === this.isPasteFonts_Images)
				this.sendEvent("asc_onDocumentContentReady");

			this.WordControl.InitControl();

			if (this.isViewMode)
				this.asc_setViewMode(true);
			return;
		}

		// на методе OpenDocumentEndCallback может поменяться this.EndActionLoadImages
		if (this.EndActionLoadImages == 1)
		{
			this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentImages);
		}
		else if (this.EndActionLoadImages == 2)
		{
			if (_bIsOldPaste)
				this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadImage);
			else
				this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
		}
		this.EndActionLoadImages = 0;

		// размораживаем меню... и начинаем считать документ
		if (false === this.isPasteFonts_Images && false === this.isSaveFonts_Images && false === this.isLoadImagesCustom)
		{
			this.ServerImagesWaitComplete = true;
			if (true == this.ServerIdWaitComplete)
				this.OpenDocumentEndCallback();
		}
		else
		{
			if (this.isPasteFonts_Images)
			{
				this.isPasteFonts_Images = false;
				this.pasteImageMap       = null;
				this.decrementCounterLongAction();
				this.pasteCallback();
				this.pasteCallback            = null;
			}
			else if (this.isSaveFonts_Images)
			{
				this.isSaveFonts_Images = false;
				this.saveImageMap       = null;
				this.pre_SaveCallback();

				if (this.bInit_word_control === false)
				{
					this.bInit_word_control = true;
					this.sendEvent("asc_onDocumentContentReady");
				}
			}
			else if (this.isLoadImagesCustom)
			{
				this.isLoadImagesCustom = false;
				this.loadCustomImageMap = null;

				if (!this.ImageLoader.bIsAsyncLoadDocumentImages)
					this.SyncLoadImages_callback();
			}
		}
	};

	asc_docs_api.prototype.OpenDocumentEndCallback = function()
	{
		if (null == this.WordControl.m_oLogicDocument)
			return;

		if (0 == this.DocumentType)
			this.WordControl.m_oLogicDocument.LoadEmptyDocument();
		else if (1 == this.DocumentType)
		{
			this.WordControl.m_oLogicDocument.LoadTestDocument();
		}
		else
		{
			if (this.LoadedObject)
			{
				if (1 != this.LoadedObject)
				{
					this.WordControl.m_oLogicDocument.fromJfdoc(this.LoadedObject);
					this.WordControl.m_oDrawingDocument.TargetStart();
					this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
				}
				else
				{
					var Document = this.WordControl.m_oLogicDocument;

					if (this.isApplyChangesOnOpenEnabled)
					{
						this.isApplyChangesOnOpenEnabled = false;
						AscCommon.CollaborativeEditing.Apply_Changes();
						AscCommon.CollaborativeEditing.Release_Locks();

						this.isApplyChangesOnOpen = true;

						// Применяем все lock-и (ToDo возможно стоит пересмотреть вообще Lock-и)
						for (var i = 0; i < this.arrPreOpenLocksObjects.length; ++i)
						{
							this.arrPreOpenLocksObjects[i]();
						}
						this.arrPreOpenLocksObjects = [];
					}

					//                History.RecalcData_Add( { Type : AscDFH.historyitem_recalctype_Inline, Data : { Pos : 0, PageNum : 0 } } );

					//Recalculate для Document
					Document.CurPos.ContentPos = 0;
					//                History.RecalcData_Add({Type: AscDFH.historyitem_recalctype_Drawing, All: true});

					var RecalculateData =
						{
							Inline   : {Pos : 0, PageNum : 0},
							Flow     : [],
							HdrFtr   : [],
							Drawings : {
								All : true,
								Map : {}
							}
						};

					if (!this.isOnlyReaderMode)
					{
						if (false === this.isSaveFonts_Images)
							Document.Recalculate(false, false, RecalculateData);

						this.WordControl.m_oDrawingDocument.TargetStart();
					}
					else
					{
						Document.Recalculate_AllTables();
						var data = {All : true};
						Document.DrawingObjects.recalculate_(data);
						Document.DrawingObjects.recalculateText_(data);

						if (!this.WordControl.IsReaderMode())
							this.ChangeReaderMode();
						else
							this.WordControl.UpdateReaderContent();
					}
				}
			}
		}

		if (false === this.isSaveFonts_Images)
		{
			this.bInit_word_control = true;
			this.sendEvent("asc_onDocumentContentReady");
		}

		this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
		//this.WordControl.m_oLogicDocument.Document_UpdateRulersState();
		this.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
		this.LoadedObject = null;

		this.WordControl.InitControl();

		if (!this.isViewMode)
		{
			this.sendStandartTextures();
			this.sendMathToMenu();

			if (this.shapeElementId)
			{
				this.WordControl.m_oDrawingDocument.InitGuiCanvasShape(this.shapeElementId);
			}
		}

		if (this.isViewMode)
			this.asc_setViewMode(true);

		// Меняем тип состояния (на никакое)
		this.advancedOptionsAction = c_oAscAdvancedOptionsAction.None;
	};

	asc_docs_api.prototype.UpdateInterfaceState = function()
	{
		if (this.WordControl.m_oLogicDocument != null)
		{
			this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
		}
	};

	asc_docs_api.prototype.asyncFontEndLoaded = function(fontinfo)
	{
		this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);

		if (undefined !== this.asyncMethodCallback)
		{
			this.asyncMethodCallback();
			this.asyncMethodCallback = undefined;
			return;
		}

		var _fontSelections = g_fontApplication.g_fontSelections;
		if (_fontSelections.CurrentLoadedObj != null)
		{
			var _rfonts = _fontSelections.getSetupRFonts(_fontSelections.CurrentLoadedObj);
			this.WordControl.m_oLogicDocument.TextBox_Put(_fontSelections.CurrentLoadedObj.text, _rfonts);
			this.WordControl.ReinitTB();

			_fontSelections.CurrentLoadedObj = null;
			this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadFont);
			return;
		}

		if (this.FontAsyncLoadType == 1)
		{
			this.FontAsyncLoadType = 0;
			this.asc_AddMath2(this.FontAsyncLoadParam);
			this.FontAsyncLoadParam = null;
			return;
		}

		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_SetTextFontNameLong);
			this.WordControl.m_oLogicDocument.Paragraph_Add(new AscCommonWord.ParaTextPr({
				FontFamily : {
					Name  : fontinfo.Name,
					Index : -1
				}
			}));
			this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
		}
		// отжать заморозку меню
	};

	asc_docs_api.prototype.asc_replaceLoadImageCallback = function(fCallback)
	{
		this.asyncImageEndLoaded2 = fCallback;
	};

	asc_docs_api.prototype.asyncImageEndLoaded = function(_image)
	{
		// отжать заморозку меню
		if (this.asyncImageEndLoaded2)
			this.asyncImageEndLoaded2(_image);
		else
		{
			if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
			{
				this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_AddImage);
				this.WordControl.m_oLogicDocument.Add_InlineImage(50, 50, _image.src);
			}
		}
	};

	asc_docs_api.prototype.openDocument = function(sData)
	{
		if (sData.changes && this.VersionHistory)
		{
			this.VersionHistory.changes = sData.changes;
			this.VersionHistory.applyChanges(this);
		}

		if (sData.bSerFormat)
			this.OpenDocument2(sData.url, sData.data);
		else
			this.OpenDocument(sData.url, sData.data);
	};

	asc_docs_api.prototype.asyncImageEndLoadedBackground = function(_image)
	{
		this.WordControl.m_oDrawingDocument.CheckRasterImageOnScreen(_image.src);
	};
	asc_docs_api.prototype.IsAsyncOpenDocumentImages     = function()
	{
		return true;
	};

	asc_docs_api.prototype.pre_Paste = function(_fonts, _images, callback)
	{
		if (undefined !== window["Native"] && undefined !== window["Native"]["GetImageUrl"])
		{
			callback();
			return;
		}

		this.pasteCallback = callback;
		this.pasteImageMap = _images;

		var _count = 0;
		for (var i in this.pasteImageMap)
			++_count;
		if (0 == _count && false === this.FontLoader.CheckFontsNeedLoading(_fonts))
		{
			// никаких евентов. ничего грузить не нужно. сделано для сафари под макОс.
			// там при LongActions теряется фокус и вставляются пробелы
			this.decrementCounterLongAction();
			this.pasteCallback();
			this.pasteCallback            = null;

			return;
		}

		this.isPasteFonts_Images = true;
		this.FontLoader.LoadDocumentFonts2(_fonts);
	};

	asc_docs_api.prototype.pre_Save = function(_images)
	{
		this.isSaveFonts_Images = true;
		this.saveImageMap       = _images;
		this.WordControl.m_oDrawingDocument.CheckFontNeeds();
		this.FontLoader.LoadDocumentFonts2(this.WordControl.m_oLogicDocument.Fonts);
	};

	asc_docs_api.prototype.SyncLoadImages          = function(_images)
	{
		this.isLoadImagesCustom = true;
		this.loadCustomImageMap = _images;

		var _count  = 0;
		var _loaded = this.ImageLoader.map_image_index;

		var _new_len = this.loadCustomImageMap.length;
		for (var i = 0; i < _new_len; i++)
		{
			if (undefined !== _loaded[this.loadCustomImageMap[i]])
			{
				this.loadCustomImageMap.splice(i, 1);
				i--;
				_new_len--;
				continue;
			}
			++_count;
		}

		if (_count > 0)
		{
			this.EndActionLoadImages = 2;
			this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
		}

		this.ImageLoader.LoadDocumentImages(this.loadCustomImageMap, false);
	};
	asc_docs_api.prototype.SyncLoadImages_callback = function()
	{
		this.WordControl.OnRePaintAttack();
	};

	asc_docs_api.prototype.pre_SaveCallback = function()
	{
		AscCommon.CollaborativeEditing.OnEnd_Load_Objects();

		if (this.isApplyChangesOnOpen)
		{
			this.isApplyChangesOnOpen = false;
			this.OpenDocumentEndCallback();
		}
	};

	asc_docs_api.prototype.initEvents2MobileAdvances = function()
	{
		//this.WordControl.initEvents2MobileAdvances();
	};
	asc_docs_api.prototype.ViewScrollToX             = function(x)
	{
		this.WordControl.m_oScrollHorApi.scrollToX(x);
	};
	asc_docs_api.prototype.ViewScrollToY             = function(y)
	{
		this.WordControl.m_oScrollVerApi.scrollToY(y);
	};
	asc_docs_api.prototype.GetDocWidthPx             = function()
	{
		return this.WordControl.m_dDocumentWidth;
	};
	asc_docs_api.prototype.GetDocHeightPx            = function()
	{
		return this.WordControl.m_dDocumentHeight;
	};
	asc_docs_api.prototype.ClearSearch               = function()
	{
		return this.WordControl.m_oDrawingDocument.EndSearch(true);
	};
	asc_docs_api.prototype.GetCurrentVisiblePage     = function()
	{
		var lPage1 = this.WordControl.m_oDrawingDocument.m_lDrawingFirst;
		var lPage2 = lPage1 + 1;

		if (lPage2 > this.WordControl.m_oDrawingDocument.m_lDrawingEnd)
			return lPage1;

		var lWindHeight = this.WordControl.m_oEditor.HtmlElement.height;
		var arPages     = this.WordControl.m_oDrawingDocument.m_arrPages;

		var dist1 = arPages[lPage1].drawingPage.bottom;
		var dist2 = lWindHeight - arPages[lPage2].drawingPage.top;

		if (dist1 > dist2)
			return lPage1;

		return lPage2;
	};

	asc_docs_api.prototype.asc_SetDocumentPlaceChangedEnabled = function(bEnabled)
	{
		if (this.WordControl)
			this.WordControl.m_bDocumentPlaceChangedEnabled = bEnabled;
	};

	asc_docs_api.prototype.asc_SetViewRulers       = function(bRulers)
	{
		//if (false === this.bInit_word_control || true === this.isViewMode)
		//    return;

		if (!this.isLoadFullApi)
		{
			this.tmpViewRulers = bRulers;
			return;
		}

		if (this.WordControl.m_bIsRuler != bRulers)
		{
			this.WordControl.m_bIsRuler = bRulers;
			this.WordControl.checkNeedRules();
			this.WordControl.OnResize(true);
		}
	};
	asc_docs_api.prototype.asc_SetViewRulersChange = function()
	{
		//if (false === this.bInit_word_control || true === this.isViewMode)
		//    return;

		this.WordControl.m_bIsRuler = !this.WordControl.m_bIsRuler;
		this.WordControl.checkNeedRules();
		this.WordControl.OnResize(true);
		return this.WordControl.m_bIsRuler;
	};
	asc_docs_api.prototype.asc_GetViewRulers       = function()
	{
		return this.WordControl.m_bIsRuler;
	};

	asc_docs_api.prototype.asc_SetDocumentUnits = function(_units)
	{
		if (this.WordControl && this.WordControl.m_oHorRuler && this.WordControl.m_oVerRuler)
		{
			this.WordControl.m_oHorRuler.Units = _units;
			this.WordControl.m_oVerRuler.Units = _units;
			this.WordControl.UpdateHorRulerBack(true);
			this.WordControl.UpdateVerRulerBack(true);
		}
	};

	asc_docs_api.prototype.SetMobileVersion = function(val)
	{
		this.isMobileVersion = val;
		if (/*this.isMobileVersion*/false)
		{
			this.WordControl.bIsRetinaSupport         = false; // ipad имеет проблемы с большими картинками
			this.WordControl.bIsRetinaNoSupportAttack = true;
			this.WordControl.m_bIsRuler               = false;
			this.ShowParaMarks                        = false;

			this.SetFontRenderingMode(1);
		}
	};

	asc_docs_api.prototype.GoToHeader = function(pageNumber)
	{
		if (this.WordControl.m_oDrawingDocument.IsFreezePage(pageNumber))
			return;

		var bForceRedraw  = false;
		var LogicDocument = this.WordControl.m_oLogicDocument;
		if (AscCommonWord.docpostype_HdrFtr !== LogicDocument.Get_DocPosType())
		{
			LogicDocument.Set_DocPosType(AscCommonWord.docpostype_HdrFtr);
			bForceRedraw = true;
		}

		var oldClickCount            = global_mouseEvent.ClickCount;
		global_mouseEvent.Button     = 0;
		global_mouseEvent.ClickCount = 1;

		LogicDocument.OnMouseDown(global_mouseEvent, 0, 0, pageNumber);
		LogicDocument.OnMouseUp(global_mouseEvent, 0, 0, pageNumber);
		LogicDocument.OnMouseMove(global_mouseEvent, 0, 0, pageNumber);
		LogicDocument.Cursor_MoveLeft();
		LogicDocument.Document_UpdateInterfaceState();

		global_mouseEvent.ClickCount = oldClickCount;

		if (true === bForceRedraw)
		{
			this.WordControl.m_oDrawingDocument.ClearCachePages();
			this.WordControl.m_oDrawingDocument.FirePaint();
		}
	};

	asc_docs_api.prototype.GoToFooter = function(pageNumber)
	{
		if (this.WordControl.m_oDrawingDocument.IsFreezePage(pageNumber))
			return;

		var bForceRedraw  = false;
		var LogicDocument = this.WordControl.m_oLogicDocument;
		if (AscCommonWord.docpostype_HdrFtr !== LogicDocument.Get_DocPosType())
		{
			LogicDocument.Set_DocPosType(AscCommonWord.docpostype_HdrFtr);
			bForceRedraw = true;
		}

		var oldClickCount            = global_mouseEvent.ClickCount;
		global_mouseEvent.Button     = 0;
		global_mouseEvent.ClickCount = 1;

		LogicDocument.OnMouseDown(global_mouseEvent, 0, AscCommon.Page_Height, pageNumber);
		LogicDocument.OnMouseUp(global_mouseEvent, 0, AscCommon.Page_Height, pageNumber);
		LogicDocument.OnMouseMove(global_mouseEvent, 0, 0, pageNumber);
		LogicDocument.Cursor_MoveLeft();
		LogicDocument.Document_UpdateInterfaceState();

		global_mouseEvent.ClickCount = oldClickCount;

		if (true === bForceRedraw)
		{
			this.WordControl.m_oDrawingDocument.ClearCachePages();
			this.WordControl.m_oDrawingDocument.FirePaint();
		}
	};

	asc_docs_api.prototype.ExitHeader_Footer = function(pageNumber)
	{
		if (this.WordControl.m_oDrawingDocument.IsFreezePage(pageNumber))
			return;

		var oldClickCount            = global_mouseEvent.ClickCount;
		global_mouseEvent.ClickCount = 2;
		this.WordControl.m_oLogicDocument.OnMouseDown(global_mouseEvent, 0, AscCommon.Page_Height / 2, pageNumber);
		this.WordControl.m_oLogicDocument.OnMouseUp(global_mouseEvent, 0, AscCommon.Page_Height / 2, pageNumber);

		this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();

		global_mouseEvent.ClickCount = oldClickCount;
	};

	asc_docs_api.prototype.GetCurrentPixOffsetY = function()
	{
		return this.WordControl.m_dScrollY;
	};

	asc_docs_api.prototype.SetPaintFormat = function(_value)
	{
		var value = ( true === _value ? c_oAscFormatPainterState.kOn : ( false === _value ? c_oAscFormatPainterState.kOff : _value ) );

		this.isPaintFormat = value;

		if (c_oAscFormatPainterState.kOff !== value)
			this.WordControl.m_oLogicDocument.Document_Format_Copy();
	};

	asc_docs_api.prototype.ChangeShapeType = function(value)
	{
		this.ImgApply(new asc_CImgProperty({ShapeProperties : {type : value}}));
	};

	asc_docs_api.prototype.sync_PaintFormatCallback = function(_value)
	{
		var value = ( true === _value ? c_oAscFormatPainterState.kOn : ( false === _value ? c_oAscFormatPainterState.kOff : _value ) );

		this.isPaintFormat = value;
		return this.sendEvent("asc_onPaintFormatChanged", value);
	};
	asc_docs_api.prototype.SetMarkerFormat          = function(value, is_flag, r, g, b)
	{
		this.isMarkerFormat = value;

		if (this.isMarkerFormat)
		{
			this.WordControl.m_oLogicDocument.Paragraph_SetHighlight(is_flag, r, g, b);
			this.WordControl.m_oLogicDocument.Document_Format_Copy();
		}
	};

	asc_docs_api.prototype.sync_MarkerFormatCallback = function(value)
	{
		this.isMarkerFormat = value;
		return this.sendEvent("asc_onMarkerFormatChanged", value);
	};

	asc_docs_api.prototype.StartAddShape = function(sPreset, is_apply)
	{
		this.isStartAddShape = true;
		this.addShapePreset  = sPreset;
		if (is_apply)
		{
			this.WordControl.m_oDrawingDocument.LockCursorType("crosshair");
		}
		else
		{
			editor.sync_EndAddShape();
			editor.sync_StartAddShapeCallback(false);
		}
	};

	asc_docs_api.prototype.AddShapeOnCurrentPage = function(_type)
	{
		if (!this.WordControl.m_oLogicDocument)
			return;

		var _pageNum = this.GetCurrentVisiblePage();
		// получаем размеры страницы
		var _sectionPr = this.WordControl.m_oLogicDocument.Get_PageLimits(_pageNum);

		var _min = Math.min(_sectionPr.XLimit / 2, _sectionPr.YLimit / 2);

		this.WordControl.m_oLogicDocument.DrawingObjects.addShapeOnPage(_type, _pageNum,
			_sectionPr.X + _sectionPr.XLimit / 4,
			_sectionPr.Y + _sectionPr.YLimit / 4,
			_min,
			_min);
	};

	asc_docs_api.prototype.AddTextArt = function(nStyle)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			History.Create_NewPoint(AscDFH.historydescription_Document_AddTextArt);
			this.WordControl.m_oLogicDocument.Add_TextArt(nStyle);
		}
	};


	asc_docs_api.prototype.sync_StartAddShapeCallback = function(value)
	{
		this.isStartAddShape = value;
		return this.sendEvent("asc_onStartAddShapeChanged", value);
	};

	asc_docs_api.prototype.CanGroup = function()
	{
		return this.WordControl.m_oLogicDocument.CanGroup();
	};

	asc_docs_api.prototype.CanUnGroup = function()
	{
		return this.WordControl.m_oLogicDocument.CanUnGroup();
	};

	asc_docs_api.prototype.CanChangeWrapPolygon = function()
	{
		return this.WordControl.m_oLogicDocument.CanChangeWrapPolygon();
	};

	asc_docs_api.prototype.StartChangeWrapPolygon = function()
	{
		return this.WordControl.m_oLogicDocument.StartChangeWrapPolygon();
	};


	asc_docs_api.prototype.ClearFormating = function()
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_ClearFormatting);
			this.WordControl.m_oLogicDocument.Paragraph_ClearFormatting();
		}
	};

	asc_docs_api.prototype.GetSectionInfo = function()
	{
		var obj = new CAscSection();

		// TODO: Переделать данную функцию, если она вообще нужна
		obj.PageWidth  = 297;
		obj.PageHeight = 210;

		obj.MarginLeft   = 30;
		obj.MarginRight  = 15;
		obj.MarginTop    = 20;
		obj.MarginBottom = 20;

		return obj;
	};

	asc_docs_api.prototype.add_SectionBreak = function(_Type)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_AddSectionBreak);
			this.WordControl.m_oLogicDocument.Add_SectionBreak(_Type);
		}
	};

	asc_docs_api.prototype.getViewMode     = function()
	{
		return this.isViewMode;
	};
	asc_docs_api.prototype.asc_setViewMode = function(isViewMode)
	{
		this.isViewMode = !!isViewMode;
		if (!this.isLoadFullApi)
		{
			return;
		}

		if (isViewMode)
		{
			this.asc_SpellCheckDisconnect();
			
			this.ShowParaMarks                           = false;
			AscCommon.CollaborativeEditing.Set_GlobalLock(true);
			//this.isShowTableEmptyLine = false;
			//this.WordControl.m_bIsRuler = true;

			if (null == this.WordControl.m_oDrawingDocument.m_oDocumentRenderer)
			{
				this.WordControl.m_oDrawingDocument.ClearCachePages();
				this.WordControl.HideRulers();
			}
			else
			{
				this.WordControl.HideRulers();
				this.WordControl.OnScroll();
			}
		}
		else
		{
			if (this.bInit_word_control === true && this.FontLoader.embedded_cut_manager.bIsCutFontsUse)
			{
				this.isLoadNoCutFonts                               = true;
				this.FontLoader.embedded_cut_manager.bIsCutFontsUse = false;
				this.FontLoader.LoadDocumentFonts(this.WordControl.m_oLogicDocument.Fonts, true);
				return;
			}

			// быстрого перехода больше нет
			/*
			 if ( this.bInit_word_control === true )
			 {
			 CollaborativeEditing.Apply_Changes();
			 CollaborativeEditing.Release_Locks();
			 }
			 */

			this.isUseEmbeddedCutFonts = false;
			
			//this.WordControl.m_bIsRuler = true;
			this.WordControl.checkNeedRules();
			this.WordControl.m_oDrawingDocument.ClearCachePages();
			this.WordControl.OnResize(true);
		}
	};

	asc_docs_api.prototype.SetUseEmbeddedCutFonts = function(bUse)
	{
		this.isUseEmbeddedCutFonts = bUse;
	};

	asc_docs_api.prototype.OnMouseUp = function(x, y)
	{
		this.WordControl.onMouseUpExternal(x, y);
	};

	asc_docs_api.prototype.asyncImageEndLoaded2       = null;
	asc_docs_api.prototype._OfflineAppDocumentEndLoad = function()
	{
		var bIsViewer = false;
		var sData     = window["editor_bin"];
		if (undefined == sData)
			return;
		if (AscCommon.c_oSerFormat.Signature !== sData.substring(0, AscCommon.c_oSerFormat.Signature.length))
		{
			bIsViewer = true;
		}

		if (bIsViewer)
		{
			this.OpenDocument(this.documentUrl, sData);
		}
		else
		{
			this.OpenDocument2(this.documentUrl, sData);
		}
	};

	asc_docs_api.prototype.SetDrawImagePlaceParagraph = function(element_id, props)
	{
		this.WordControl.m_oDrawingDocument.InitGuiCanvasTextProps(element_id);
		this.WordControl.m_oDrawingDocument.DrawGuiCanvasTextProps(props);
	};

	asc_docs_api.prototype.asc_getMasterCommentId = function()
	{
		return -1;
	};

	asc_docs_api.prototype.asc_getAnchorPosition = function()
	{
		var AnchorPos = this.WordControl.m_oLogicDocument.Get_SelectionAnchorPos();
		return new AscCommon.asc_CRect(AnchorPos.X0, AnchorPos.Y, AnchorPos.X1 - AnchorPos.X0, 0);
	};

	asc_docs_api.prototype.spellCheck = function(rdata)
	{
		//console.log("start - " + rdata);
		// ToDo проверка на подключение
		switch (rdata.type)
		{
			case "spell":
			case "suggest":
				this.SpellCheckApi.spellCheck(JSON.stringify(rdata));
				break;
		}
	};

	window["asc_nativeOnSpellCheck"] = function(response)
	{
		if (editor.SpellCheckApi)
			editor.SpellCheckApi.onSpellCheck(response);
	};

	asc_docs_api.prototype._onNeedParams  = function(data, opt_isPassword)
	{
		var options;
		if (opt_isPassword) {
			options = new AscCommon.asc_CAdvancedOptions(c_oAscAdvancedOptionsID.DRM);
		} else {
			var cp = {'codepage': AscCommon.c_oAscCodePageUtf8, 'encodings': AscCommon.getEncodingParams()};
			options = new AscCommon.asc_CAdvancedOptions(c_oAscAdvancedOptionsID.TXT, cp);
		}
		this.sendEvent("asc_onAdvancedOptions", options, this.advancedOptionsAction);
	};
	asc_docs_api.prototype._onOpenCommand = function(data)
	{
		var t = this;
		AscCommon.openFileCommand(data, this.documentUrlChanges, AscCommon.c_oSerFormat.Signature, function(error, result)
		{
			if (error)
			{
				t.sendEvent("asc_onError", c_oAscError.ID.Unknown, c_oAscError.Level.Critical);
				return;
			}
			t.onEndLoadFile(result);
		});
	};
	asc_docs_api.prototype._downloadAs    = function(command, filetype, actionType, options, fCallbackRequest)
	{
		var t = this;
		if (!options)
		{
			options = {};
		}
		if (actionType)
		{
			this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, actionType);
		}
		// Меняем тип состояния (на сохранение)
		this.advancedOptionsAction = c_oAscAdvancedOptionsAction.Save;

		var dataContainer               = {data : null, part : null, index : 0, count : 0};
		var oAdditionalData             = {};
		oAdditionalData["c"]            = command;
		oAdditionalData["id"]           = this.documentId;
		oAdditionalData["userid"]       = this.documentUserId;
		oAdditionalData["jwt"]         = this.CoAuthoringApi.get_jwt();
		oAdditionalData["outputformat"] = filetype;
		oAdditionalData["title"]        = AscCommon.changeFileExtention(this.documentTitle, AscCommon.getExtentionByFormat(filetype));
		oAdditionalData["savetype"]     = AscCommon.c_oAscSaveTypes.CompleteAll;
		if ('savefromorigin' === command)
		{
			oAdditionalData["format"] = this.documentFormat;
		}
		if (DownloadType.Print === options.downloadType)
		{
			oAdditionalData["inline"] = 1;
		}
		if (options.isNoData)
		{
			;//nothing
		}
		else if (null == options.oDocumentMailMerge && c_oAscFileType.PDF === filetype)
		{
			var dd             = this.WordControl.m_oDrawingDocument;
			dataContainer.data = dd.ToRendererPart();
			//console.log(oAdditionalData["data"]);
		}
		else if (c_oAscFileType.JSON === filetype)
		{
			oAdditionalData['url']       = this.mailMergeFileData['url'];
			oAdditionalData['format']    = this.mailMergeFileData['fileType'];
			// ToDo select csv params
			oAdditionalData['codepage']  = AscCommon.c_oAscCodePageUtf8;
			oAdditionalData['delimiter'] = AscCommon.c_oAscCsvDelimiter.Comma
		}
		else if (c_oAscFileType.TXT === filetype && !options.txtOptions && null == options.oDocumentMailMerge && null == options.oMailMergeSendData)
		{
			// Мы открывали команду, надо ее закрыть.
			if (actionType)
			{
				this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, actionType);
			}
			var cp            = {
				'codepage'  : AscCommon.c_oAscCodePageUtf8,
				'encodings' : AscCommon.getEncodingParams()
			};
			this.downloadType = options.downloadType;
			this.sendEvent("asc_onAdvancedOptions", new AscCommon.asc_CAdvancedOptions(c_oAscAdvancedOptionsID.TXT, cp), this.advancedOptionsAction);
			return;
		}
		else if (c_oAscFileType.HTML === filetype && null == options.oDocumentMailMerge && null == options.oMailMergeSendData)
		{
			//в asc_nativeGetHtml будет вызван select all, чтобы выделился документ должны выйти из колонтитулов и автофигур
			var _e     = new AscCommon.CKeyboardEvent();
			_e.CtrlKey = false;
			_e.KeyCode = 27;
			this.WordControl.m_oLogicDocument.OnKeyDown(_e);
			//сделано через сервер, потому что нет простого механизма сохранения на клиенте
			dataContainer.data = '\ufeff' + window["asc_docs_api"].prototype["asc_nativeGetHtml"].call(this);
		}
		else
		{
			if (options.txtOptions instanceof Asc.asc_CTXTAdvancedOptions)
			{
				oAdditionalData["codepage"] = options.txtOptions.asc_getCodePage();
			}
			var oLogicDocument;
			if (null != options.oDocumentMailMerge)
				oLogicDocument = options.oDocumentMailMerge;
			else
				oLogicDocument = this.WordControl.m_oLogicDocument;
			var oBinaryFileWriter;
			if (null != options.oMailMergeSendData && c_oAscFileType.HTML == options.oMailMergeSendData.get_MailFormat())
				oBinaryFileWriter = new AscCommonWord.BinaryFileWriter(oLogicDocument, false, true);
			else
				oBinaryFileWriter = new AscCommonWord.BinaryFileWriter(oLogicDocument);
			dataContainer.data = oBinaryFileWriter.Write();
		}
		if (null != options.oMailMergeSendData)
		{
			oAdditionalData["mailmergesend"] = options.oMailMergeSendData;
			var MailMergeMap                 = this.WordControl.m_oLogicDocument.MailMergeMap;
			var aJsonOut                     = [];
			if (MailMergeMap.length > 0)
			{
				var oFirstRow = MailMergeMap[0];
				var aRowOut   = [];
				for (var i in oFirstRow)
					aRowOut.push(i);
				aJsonOut.push(aRowOut);
			}
			//todo может надо запоминать порядок for in в первом столбце, если for in будет по-разному обходить строки
			for (var i = 0; i < MailMergeMap.length; ++i)
			{
				var oRow    = MailMergeMap[i];
				var aRowOut = [];
				for (var j in oRow)
					aRowOut.push(oRow[j]);
				aJsonOut.push(aRowOut);
			}
			dataContainer.data = dataContainer.data.length + ';' + dataContainer.data + JSON.stringify(aJsonOut);
		}
		var fCallback = null;
		if (!options.isNoCallback)
		{
			fCallback = function(input)
			{
				var error = c_oAscError.ID.Unknown;
				//input = {'type': command, 'status': 'err', 'data': -80};
				if (null != input && command == input['type'])
				{
					if ('ok' == input['status'])
					{
						if (options.isNoUrl)
						{
							error = c_oAscError.ID.No;
						}
						else
						{
							var url = input['data'];
							if (url)
							{
								error = c_oAscError.ID.No;
								t.processSavedFile(url, options.downloadType);
							}
						}
					}
					else
					{
						error = mapAscServerErrorToAscError(parseInt(input["data"]),
							AscCommon.c_oAscAdvancedOptionsAction.Save);
					}
				}
				if (c_oAscError.ID.No != error)
				{
					t.sendEvent('asc_onError', options.errorDirect || error, c_oAscError.Level.NoCritical);
				}
				// Меняем тип состояния (на никакое)
				t.advancedOptionsAction = c_oAscAdvancedOptionsAction.None;
				if (actionType)
				{
					t.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, actionType);
				}
			};
		}
		this.fCurCallback = fCallback;
		AscCommon.saveWithParts(function(fCallback1, oAdditionalData1, dataContainer1)
		{
			sendCommand(t, fCallback1, oAdditionalData1, dataContainer1);
		}, fCallback, fCallbackRequest, oAdditionalData, dataContainer);
	}

	// Вставка диаграмм
	asc_docs_api.prototype.asc_getChartObject = function(type)
	{
		this.isChartEditor = true;		// Для совместного редактирования
		if (!AscFormat.isRealNumber(type))
		{
			this.asc_onOpenChartFrame();
			this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Drawing_Props);
		}

		return this.WordControl.m_oLogicDocument.Get_ChartObject(type);
	};

	asc_docs_api.prototype.asc_addChartDrawingObject = function(options)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			History.Create_NewPoint(AscDFH.historydescription_Document_AddChart);
			this.WordControl.m_oLogicDocument.Add_InlineImage(null, null, null, options);
		}
	};
	asc_docs_api.prototype.asc_doubleClickOnChart    = function(obj)
	{
		this.isChartEditor = true;	// Для совместного редактирования
		this.asc_onOpenChartFrame();
		this.WordControl.onMouseUpMainSimple();
		this.sendEvent("asc_doubleClickOnChart", obj);
	};

	asc_docs_api.prototype.asc_editChartDrawingObject = function(chartBinary)
	{
		/**/

		// Находим выделенную диаграмму и накатываем бинарник
		if (AscFormat.isObject(chartBinary))
		{
			var binary = chartBinary["binary"];
			if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
			{
				History.Create_NewPoint(AscDFH.historydescription_Document_EditChart);
				this.WordControl.m_oLogicDocument.Edit_Chart(binary);
			}
		}
	};

	asc_docs_api.prototype.sync_closeChartEditor = function()
	{
		this.sendEvent("asc_onCloseChartEditor");
	};

	asc_docs_api.prototype.asc_setDrawCollaborationMarks = function(bDraw)
	{
		if (!this.isLoadFullApi)
		{
			this.tmpCoMarksDraw = bDraw;
			return;
		}

		if (bDraw !== this.isCoMarksDraw)
		{
			this.isCoMarksDraw = bDraw;
			this.WordControl.m_oDrawingDocument.ClearCachePages();
			this.WordControl.m_oDrawingDocument.FirePaint();
		}
	};

	asc_docs_api.prototype.asc_AddMath = function(Type)
	{
		var loader   = AscCommon.g_font_loader;
		var fontinfo = g_fontApplication.GetFontInfo("Cambria Math");
		var isasync  = loader.LoadFont(fontinfo);
		if (false === isasync)
		{
			return this.asc_AddMath2(Type);
		}
		else
		{
			this.FontAsyncLoadType  = 1;
			this.FontAsyncLoadParam = Type;
		}
	};

	asc_docs_api.prototype.asc_AddMath2 = function(Type)
	{
		if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
		{
			this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_AddMath);
			var MathElement = new AscCommonWord.MathMenu(Type);
			this.WordControl.m_oLogicDocument.Paragraph_Add(MathElement);
		}
	};
	asc_docs_api.prototype.asc_AddPageCount = function()
	{
		this.WordControl.m_oLogicDocument.AddPageCount();
	};
	//----------------------------------------------------------------------------------------------------------------------
	// Функции для работы с MailMerge
	//----------------------------------------------------------------------------------------------------------------------
	asc_docs_api.prototype.asc_StartMailMerge              = function(oData)
	{
	};
	asc_docs_api.prototype.asc_StartMailMergeByList        = function(aList)
	{
	};
	asc_docs_api.prototype.asc_GetReceptionsCount          = function()
	{
	};
	asc_docs_api.prototype.asc_GetMailMergeFieldsNameList  = function()
	{
	};
	asc_docs_api.prototype.asc_AddMailMergeField           = function(Name)
	{
	};
	asc_docs_api.prototype.asc_SetHighlightMailMergeFields = function(Value)
	{
	};
	asc_docs_api.prototype.asc_PreviewMailMergeResult      = function(Index)
	{
	};
	asc_docs_api.prototype.asc_EndPreviewMailMergeResult   = function()
	{
	};
	asc_docs_api.prototype.sync_StartMailMerge             = function()
	{
	};
	asc_docs_api.prototype.sync_PreviewMailMergeResult     = function(Index)
	{
	};
	asc_docs_api.prototype.sync_EndPreviewMailMergeResult  = function()
	{
	};
	asc_docs_api.prototype.sync_HighlightMailMergeFields   = function(Value)
	{
	};
	asc_docs_api.prototype.asc_getMailMergeData            = function()
	{
	};
	asc_docs_api.prototype.asc_setMailMergeData            = function(aList)
	{
	};
	asc_docs_api.prototype.asc_sendMailMergeData           = function(oData)
	{
	};
	asc_docs_api.prototype.asc_GetMailMergeFiledValue      = function(nIndex, sName)
	{
	};
	//----------------------------------------------------------------------------------------------------------------------
	// Работаем со стилями
	//----------------------------------------------------------------------------------------------------------------------
	asc_docs_api.prototype.asc_GetStyleFromFormatting = function()
	{
		return null;
	};
	asc_docs_api.prototype.asc_AddNewStyle            = function(oStyle)
	{
	};
	asc_docs_api.prototype.asc_RemoveStyle            = function(sName)
	{
	};
	asc_docs_api.prototype.asc_RemoveAllCustomStyles  = function()
	{
	};
	asc_docs_api.prototype.asc_IsStyleDefault         = function(sName)
	{
		return true;
	};
	asc_docs_api.prototype.asc_IsDefaultStyleChanged  = function(sName)
	{
		return false;
	};
	asc_docs_api.prototype.asc_GetStyleNameById       = function(StyleId)
	{
		return this.WordControl.m_oLogicDocument.Get_StyleNameById(StyleId);
	};
	//----------------------------------------------------------------------------------------------------------------------
	// Работаем с рецензированием
	//----------------------------------------------------------------------------------------------------------------------
	asc_docs_api.prototype.asc_SetTrackRevisions               = function(bTrack)
	{
	};
	asc_docs_api.prototype.asc_IsTrackRevisions                = function()
	{
		return false;
	};
	asc_docs_api.prototype.sync_BeginCatchRevisionsChanges     = function()
	{
	};
	asc_docs_api.prototype.sync_EndCatchRevisionsChanges       = function()
	{
	};
	asc_docs_api.prototype.sync_AddRevisionsChange             = function(Change)
	{
	};
	asc_docs_api.prototype.asc_AcceptChanges                   = function(Change)
	{
	};
	asc_docs_api.prototype.asc_RejectChanges                   = function(Change)
	{
	};
	asc_docs_api.prototype.asc_HaveRevisionsChanges            = function()
	{
		return false
	};
	asc_docs_api.prototype.asc_HaveNewRevisionsChanges         = function()
	{
		return false
	};
	asc_docs_api.prototype.asc_GetNextRevisionsChange          = function()
	{
	};
	asc_docs_api.prototype.asc_GetPrevRevisionsChange          = function()
	{
	};
	asc_docs_api.prototype.sync_UpdateRevisionsChangesPosition = function(X, Y)
	{
	};
	asc_docs_api.prototype.asc_AcceptAllChanges                = function()
	{
	};
	asc_docs_api.prototype.asc_RejectAllChanges                = function()
	{
	};

	asc_docs_api.prototype.asc_undoAllChanges       = function()
	{
		this.WordControl.m_oLogicDocument.Document_Undo({All : true});
	};
	asc_docs_api.prototype.asc_CloseFile            = function()
	{
		History.Clear();
		g_oIdCounter.Clear();
		g_oTableId.Clear();
		AscCommon.CollaborativeEditing.Clear();
		this.isApplyChangesOnOpenEnabled = true;

		var oLogicDocument = this.WordControl.m_oLogicDocument;
		oLogicDocument.Stop_Recalculate();
		oLogicDocument.Stop_CheckSpelling();
		AscCommon.pptx_content_loader.ImageMapChecker = {};

		this.WordControl.m_oDrawingDocument.CloseFile();
	};
	asc_docs_api.prototype.asc_SetFastCollaborative = function(isOn)
	{
		if (AscCommon.CollaborativeEditing)
			AscCommon.CollaborativeEditing.Set_Fast(isOn);
	};

	asc_docs_api.prototype._onEndLoadSdk = function()
	{
		History           = AscCommon.History;
		g_fontApplication = AscFonts.g_fontApplication;
		PasteElementsId   = AscCommon.PasteElementsId;
		global_mouseEvent = AscCommon.global_mouseEvent;

		g_oTableId.init();
		this.WordControl      = new AscCommonWord.CEditorPage(this);
		this.WordControl.Name = this.HtmlElementName;

		this.CurrentTranslate = AscCommonWord.translations_map["en"];

		//выставляем тип copypaste
		PasteElementsId.g_bIsDocumentCopyPaste = true;

		this.CreateComponents();
		this.WordControl.Init();

		if (this.tmpFontRenderingMode)
		{
			this.SetFontRenderingMode(this.tmpFontRenderingMode);
		}
		if (null !== this.tmpViewRulers)
		{
			this.asc_SetViewRulers(this.tmpViewRulers);
		}
		if (null !== this.tmpZoomType)
		{
			switch (this.tmpZoomType)
			{
				case AscCommon.c_oZoomType.FitToPage:
					this.zoomFitToPage();
					break;
				case AscCommon.c_oZoomType.FitToWidth:
					this.zoomFitToWidth();
					break;
				case AscCommon.c_oZoomType.CustomMode:
					this.zoomCustomMode();
					break;
			}
		}

		if (this.isMobileVersion)
			this.SetMobileVersion(true);

		this.asc_setViewMode(this.isViewMode);
		this.asc_setDrawCollaborationMarks(this.tmpCoMarksDraw);

		asc_docs_api.superclass._onEndLoadSdk.call(this);

		if (this.isOnlyReaderMode)
			this.ImageLoader.bIsAsyncLoadDocumentImages = false;
	};

	asc_docs_api.prototype.asc_Recalculate = function(bIsUpdateInterface)
	{
		if (!this.WordControl.m_oLogicDocument)
			return;

		return this.WordControl.m_oLogicDocument.Recalculate_FromStart(bIsUpdateInterface);
	};

	asc_docs_api.prototype.asc_canPaste = function()
	{
		if (!this.WordControl ||
			!this.WordControl.m_oLogicDocument ||
			this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
			return false;

		this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_AddSectionBreak);
		return true;
	};

	// input
	asc_docs_api.prototype.Begin_CompositeInput = function()
	{
		if (this.WordControl.m_oLogicDocument)
			return this.WordControl.m_oLogicDocument.Begin_CompositeInput();
		return null;
	};
	asc_docs_api.prototype.Add_CompositeText = function(nCharCode)
	{
		if (this.WordControl.m_oLogicDocument)
			return this.WordControl.m_oLogicDocument.Add_CompositeText(nCharCode);
		return null;
	};
	asc_docs_api.prototype.Remove_CompositeText = function(nCount)
	{
		if (this.WordControl.m_oLogicDocument)
			return this.WordControl.m_oLogicDocument.Remove_CompositeText(nCount);
		return null;
	};
	asc_docs_api.prototype.Replace_CompositeText = function(arrCharCodes)
	{
		if (this.WordControl.m_oLogicDocument)
			return this.WordControl.m_oLogicDocument.Replace_CompositeText(arrCharCodes);
		return null;
	};
	asc_docs_api.prototype.Set_CursorPosInCompositeText = function(nPos)
	{
		if (this.WordControl.m_oLogicDocument)
			return this.WordControl.m_oLogicDocument.Set_CursorPosInCompositeText(nPos);
		return null;
	};
	asc_docs_api.prototype.Get_CursorPosInCompositeText = function()
	{
		if (this.WordControl.m_oLogicDocument)
			return this.WordControl.m_oLogicDocument.Get_CursorPosInCompositeText();
		return 0;
	};
	asc_docs_api.prototype.End_CompositeInput = function()
	{
		if (this.WordControl.m_oLogicDocument)
			return this.WordControl.m_oLogicDocument.End_CompositeInput();
		return null;
	};
	asc_docs_api.prototype.Get_MaxCursorPosInCompositeText = function()
	{
		if (this.WordControl.m_oLogicDocument)
			return this.WordControl.m_oLogicDocument.Get_MaxCursorPosInCompositeText();
		return 0;
	};
	asc_docs_api.prototype.Input_UpdatePos = function()
	{
		if (this.WordControl.m_oLogicDocument)
			this.WordControl.m_oDrawingDocument.MoveTargetInInputContext();
	};

	asc_docs_api.prototype.onKeyDown = function(e)
	{
		return this.WordControl.onKeyDown(e);
	};
	asc_docs_api.prototype.onKeyPress = function(e)
	{
		return this.WordControl.onKeyPress(e);
	};
	asc_docs_api.prototype.onKeyUp = function(e)
	{
		return this.WordControl.onKeyUp(e);
	};

	window["asc_docs_api"]                                      = asc_docs_api;
	window["asc_docs_api"].prototype["asc_nativeOpenFile"]      = function(base64File, version)
	{
		this.SpellCheckUrl = '';

		this.User = new AscCommon.asc_CUser();
		this.User.setId("TM");
		this.User.setUserName("native");

		this.WordControl.m_bIsRuler = false;
		this.WordControl.Init();

		this.InitEditor();
		this.DocumentType   = 2;
		this.LoadedObjectDS = this.WordControl.m_oLogicDocument.CopyStyle();

		g_oIdCounter.Set_Load(true);

		var openParams        = {checkFileSize : this.isMobileVersion, charCount : 0, parCount : 0};
		var oBinaryFileReader = new AscCommonWord.BinaryFileReader(this.WordControl.m_oLogicDocument, openParams);

		if (undefined === version)
		{
			if (oBinaryFileReader.Read(base64File))
			{
				g_oIdCounter.Set_Load(false);
				this.LoadedObject = 1;

				this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);
			}
			else
				this.sendEvent("asc_onError", c_oAscError.ID.MobileUnexpectedCharCount, c_oAscError.Level.Critical);
		}
		else
		{
			AscCommon.CurFileVersion = version;
			if (oBinaryFileReader.ReadData(base64File))
			{
				g_oIdCounter.Set_Load(false);
				this.LoadedObject = 1;

				this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);
			}
			else
				this.sendEvent("asc_onError", c_oAscError.ID.MobileUnexpectedCharCount, c_oAscError.Level.Critical);
		}

		if (window["NATIVE_EDITOR_ENJINE"] === true && undefined != window["native"])
		{
			AscCommon.CDocsCoApi.prototype.askSaveChanges = function(callback)
			{
				callback({"saveLock" : false});
			};
			AscCommon.CDocsCoApi.prototype.saveChanges    = function(arrayChanges, deleteIndex, excelAdditionalInfo)
			{
				if (window["native"]["SaveChanges"])
					window["native"]["SaveChanges"](arrayChanges.join("\",\""), deleteIndex, arrayChanges.length);
			};
		}

		if (undefined != window["Native"])
			return;

		//callback
		this.DocumentOrientation = (null == editor.WordControl.m_oLogicDocument) ? true : !editor.WordControl.m_oLogicDocument.Orientation;
		var sizeMM;
		if (this.DocumentOrientation)
			sizeMM = DocumentPageSize.getSize(AscCommon.Page_Width, AscCommon.Page_Height);
		else
			sizeMM = DocumentPageSize.getSize(AscCommon.Page_Height, AscCommon.Page_Width);
		this.sync_DocSizeCallback(sizeMM.w_mm, sizeMM.h_mm);
		this.sync_PageOrientCallback(editor.get_DocumentOrientation());

		if (this.GenerateNativeStyles !== undefined)
		{
			this.GenerateNativeStyles();

			if (this.WordControl.m_oDrawingDocument.CheckTableStylesOne !== undefined)
				this.WordControl.m_oDrawingDocument.CheckTableStylesOne();
		}
	};
	window["asc_docs_api"].prototype["asc_nativeCalculateFile"] = function()
	{
		if (null == this.WordControl.m_oLogicDocument)
			return;

		var Document = this.WordControl.m_oLogicDocument;

		if ((window["NATIVE_EDITOR_ENJINE"] === undefined) && this.isApplyChangesOnOpenEnabled)
		{
			this.isApplyChangesOnOpenEnabled = false;
			if (1 === AscCommon.CollaborativeEditing.m_nUseType)
			{
				this.isApplyChangesOnOpen = true;
				AscCommon.CollaborativeEditing.Apply_Changes();
				AscCommon.CollaborativeEditing.Release_Locks();
				return;
			}
		}

		Document.CurPos.ContentPos = 0;

		var RecalculateData =
			{
				Inline   : {Pos : 0, PageNum : 0},
				Flow     : [],
				HdrFtr   : [],
				Drawings : {
					All : true,
					Map : {}
				}
			};

		Document.Recalculate(false, false, RecalculateData);

		Document.Document_UpdateInterfaceState();
		//Document.Document_UpdateRulersState();
		Document.Document_UpdateSelectionState();

		this.ShowParaMarks = false;
	};

	window["asc_docs_api"].prototype["asc_nativeApplyChanges"] = function(changes)
	{
		this._coAuthoringSetChanges(changes, new AscCommonWord.CDocumentColor(191, 255, 199));
		AscCommon.CollaborativeEditing.Apply_OtherChanges();
	};

	window["asc_docs_api"].prototype.asc_SetSilentMode = function(bEnabled)
	{
		if (!this.WordControl.m_oLogicDocument)
			return;
		if (bEnabled)
			this.WordControl.m_oLogicDocument.Start_SilentMode();
		else
			this.WordControl.m_oLogicDocument.End_SilentMode();
	};

	window["asc_docs_api"].prototype["asc_nativeApplyChanges2"] = function(data, isFull)
	{
		// Чтобы заново созданные параграфы не отображались залоченными
		g_oIdCounter.Set_Load(true);

		var stream = new AscCommon.FT_Stream2(data, data.length);
		stream.obj = null;
		var _color = new AscCommonWord.CDocumentColor(191, 255, 199);

		// Применяем изменения, пока они есть
		var _count = stream.GetLong();

		var _pos = 4;
		for (var i = 0; i < _count; i++)
		{
			if (window["NATIVE_EDITOR_ENJINE"] === true && window["native"]["CheckNextChange"])
			{
				if (!window["native"]["CheckNextChange"]())
					break;
			}

			var nChangeLen = stream.GetLong();
			_pos += 4;
			stream.size = _pos + nChangeLen;

			var ClassId = stream.GetString2();
			var Class   = AscCommon.g_oTableId.Get_ById(ClassId);

			var nReaderPos  = stream.GetCurPos();
			var nChangeType = stream.GetLong();

			if (Class)
			{
				var fChangesClass = AscDFH.changesFactory[nChangeType];
				if (fChangesClass)
				{
					var oChange = new fChangesClass(Class);
					oChange.ReadFromBinary(stream);

					if (true === AscCommon.CollaborativeEditing.private_AddOverallChange(oChange))
						oChange.Load(_color);
				}
				else
				{
					AscCommon.CollaborativeEditing.private_AddOverallChange(data);

					stream.Seek(nReaderPos);
					stream.Seek2(nReaderPos);

					Class.Load_Changes(stream, null, _color);
				}
			}

			_pos += nChangeLen;
			stream.Seek2(_pos);
			stream.size = data.length;
		}

		if (isFull)
		{
			AscCommon.CollaborativeEditing.m_aChanges = [];

			// У новых элементов выставляем указатели на другие классы
			AscCommon.CollaborativeEditing.Apply_LinkData();

			// Делаем проверки корректности новых изменений
			AscCommon.CollaborativeEditing.Check_MergeData();

			AscCommon.CollaborativeEditing.OnEnd_ReadForeignChanges();

			if (window["NATIVE_EDITOR_ENJINE"] === true && window["native"]["AddImageInChanges"])
			{
				var _new_images     = AscCommon.CollaborativeEditing.m_aNewImages;
				var _new_images_len = _new_images.length;

				for (var nImage = 0; nImage < _new_images_len; nImage++)
					window["native"]["AddImageInChanges"](_new_images[nImage]);
			}
		}

		g_oIdCounter.Set_Load(false);
	};

	window["asc_docs_api"].prototype["asc_nativeGetFile"] = function()
	{
		var oBinaryFileWriter = new AscCommonWord.BinaryFileWriter(this.WordControl.m_oLogicDocument);
		return oBinaryFileWriter.Write();
	};

	window["asc_docs_api"].prototype["asc_nativeGetFileData"] = function()
	{
		var oBinaryFileWriter = new AscCommonWord.BinaryFileWriter(this.WordControl.m_oLogicDocument);
		var _memory           = oBinaryFileWriter.memory;

		oBinaryFileWriter.Write2();

		var _header = AscCommon.c_oSerFormat.Signature + ";v" + AscCommon.c_oSerFormat.Version + ";" + _memory.GetCurPosition() + ";";
		window["native"]["Save_End"](_header, _memory.GetCurPosition());

		return _memory.ImData.data;
	};

	window["asc_docs_api"].prototype["asc_nativeGetHtml"] = function()
	{
		var _old                           = PasteElementsId.copyPasteUseBinary;
		PasteElementsId.copyPasteUseBinary = false;
		this.WordControl.m_oLogicDocument.Select_All();
		var oCopyProcessor = new AscCommon.CopyProcessor(this);
		oCopyProcessor.Start();
		var _ret = "<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" /></head><body>" + oCopyProcessor.getInnerHtml() + "</body></html>";
		this.WordControl.m_oLogicDocument.Selection_Remove();
		PasteElementsId.copyPasteUseBinary = _old;
		return _ret;
	};

	window["asc_docs_api"].prototype["asc_AddHtml"] = function(_iframeId)
	{
		var ifr = document.getElementById(_iframeId);

		var frameWindow = window.frames[_iframeId];
		if (frameWindow)
		{
			if (null != frameWindow.document && null != frameWindow.document.body)
			{
				ifr.style.display = "block";
				this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
				this.asc_SetSilentMode(true);
				AscCommon.Editor_Paste_Exec(this, frameWindow.document.body, ifr);
				this.asc_SetSilentMode(false);
			}
		}

		if (ifr)
			document.body.removeChild(ifr);
	};

	window["asc_docs_api"].prototype["asc_nativeCheckPdfRenderer"] = function(_memory1, _memory2)
	{
		if (true)
		{
			// pos не должен минимизироваться!!!

			_memory1.Copy          = _memory1["Copy"];
			_memory1.ClearNoAttack = _memory1["ClearNoAttack"];
			_memory1.WriteByte     = _memory1["WriteByte"];
			_memory1.WriteBool     = _memory1["WriteBool"];
			_memory1.WriteLong     = _memory1["WriteLong"];
			_memory1.WriteDouble   = _memory1["WriteDouble"];
			_memory1.WriteString   = _memory1["WriteString"];
			_memory1.WriteString2  = _memory1["WriteString2"];

			_memory2.Copy          = _memory1["Copy"];
			_memory2.ClearNoAttack = _memory1["ClearNoAttack"];
			_memory2.WriteByte     = _memory1["WriteByte"];
			_memory2.WriteBool     = _memory1["WriteBool"];
			_memory2.WriteLong     = _memory1["WriteLong"];
			_memory2.WriteDouble   = _memory1["WriteDouble"];
			_memory2.WriteString   = _memory1["WriteString"];
			_memory2.WriteString2  = _memory1["WriteString2"];
		}

		var _printer                  = new AscCommon.CDocumentRenderer();
		_printer.Memory               = _memory1;
		_printer.VectorMemoryForPrint = _memory2;
		return _printer;
	};

	window["asc_docs_api"].prototype["asc_nativeCalculate"] = function()
	{
	};

	window["asc_docs_api"].prototype["asc_nativePrint"] = function(_printer, _page)
	{
		if (undefined === _printer && _page === undefined)
		{
			if (undefined !== window["AscDesktopEditor"])
			{
				var _drawing_document = this.WordControl.m_oDrawingDocument;
				var pagescount        = Math.min(_drawing_document.m_lPagesCount, _drawing_document.m_lCountCalculatePages);

				window["AscDesktopEditor"]["Print_Start"](this.DocumentUrl, pagescount, "", this.getCurrentPage());

				var oDocRenderer                  = new AscCommon.CDocumentRenderer();
				oDocRenderer.VectorMemoryForPrint = new AscCommon.CMemory();
				var bOldShowMarks                 = this.ShowParaMarks;
				this.ShowParaMarks                = false;

				for (var i = 0; i < pagescount; i++)
				{
					oDocRenderer.Memory.Seek(0);
					oDocRenderer.VectorMemoryForPrint.ClearNoAttack();

					var page = _drawing_document.m_arrPages[i];
					oDocRenderer.BeginPage(page.width_mm, page.height_mm);
					this.WordControl.m_oLogicDocument.DrawPage(i, oDocRenderer);
					oDocRenderer.EndPage();

					window["AscDesktopEditor"]["Print_Page"](oDocRenderer.Memory.GetBase64Memory(), page.width_mm, page.height_mm);
				}

				this.ShowParaMarks = bOldShowMarks;

				window["AscDesktopEditor"]["Print_End"]();
			}
			return;
		}

		var page = this.WordControl.m_oDrawingDocument.m_arrPages[_page];
		_printer.BeginPage(page.width_mm, page.height_mm);
		this.WordControl.m_oLogicDocument.DrawPage(_page, _printer);
		_printer.EndPage();
	};

	window["asc_docs_api"].prototype["asc_nativePrintPagesCount"] = function()
	{
		return this.WordControl.m_oDrawingDocument.m_lPagesCount;
	};

	window["asc_docs_api"].prototype["asc_nativeGetPDF"] = function(_param)
	{
		var pagescount = this["asc_nativePrintPagesCount"]();
		if (0x0100 & _param)
            pagescount = 1;

		var _renderer                  = new AscCommon.CDocumentRenderer();
		_renderer.VectorMemoryForPrint = new AscCommon.CMemory();
		var _bOldShowMarks             = this.ShowParaMarks;
		this.ShowParaMarks             = false;

		for (var i = 0; i < pagescount; i++)
		{
			this["asc_nativePrint"](_renderer, i);
		}

		this.ShowParaMarks = _bOldShowMarks;

		window["native"]["Save_End"]("", _renderer.Memory.GetCurPosition());

		return _renderer.Memory.data;
	};

	// cool api (autotests)
	window["asc_docs_api"].prototype["Add_Text"]                     = function(_text)
	{
		this.WordControl.m_oLogicDocument.TextBox_Put(_text);
	};
	window["asc_docs_api"].prototype["Add_NewParagraph"]             = function()
	{
		var LogicDocument = this.WordControl.m_oLogicDocument;
		if (false === LogicDocument.Document_Is_SelectionLocked(AscCommon.changestype_Document_Content_Add))
		{
			LogicDocument.Create_NewHistoryPoint(AscDFH.historydescription_Document_EnterButton);
			LogicDocument.Add_NewParagraph(true);
		}
	};
	window["asc_docs_api"].prototype["Cursor_MoveLeft"]              = function()
	{
		this.WordControl.m_oLogicDocument.Cursor_MoveLeft();
	};
	window["asc_docs_api"].prototype["Cursor_MoveRight"]             = function()
	{
		this.WordControl.m_oLogicDocument.Cursor_MoveRight();
	};
	window["asc_docs_api"].prototype["Cursor_MoveUp"]                = function()
	{
		this.WordControl.m_oLogicDocument.Cursor_MoveUp();
	};
	window["asc_docs_api"].prototype["Cursor_MoveDown"]              = function()
	{
		this.WordControl.m_oLogicDocument.Cursor_MoveDown();
	};
	window["asc_docs_api"].prototype["Get_DocumentRecalcId"]         = function()
	{
		return this.WordControl.m_oLogicDocument.RecalcId;
	};
	window["asc_docs_api"].prototype["asc_IsSpellCheckCurrentWord"]  = function()
	{
		return this.IsSpellCheckCurrentWord;
	};
	window["asc_docs_api"].prototype["asc_putSpellCheckCurrentWord"] = function(value)
	{
		this.IsSpellCheckCurrentWord = value;
	};
	window["asc_docs_api"].prototype["asc_setParagraphStylesSizes"] = function(width, height)
	{
		GlobalSkin.STYLE_THUMBNAIL_WIDTH = width;
		GlobalSkin.STYLE_THUMBNAIL_HEIGHT = height;
	};

	// desktop editor spellcheck
	function CSpellCheckApi_desktop()
	{
		this.docId = undefined;

		this.init = function(docid)
		{
			this.docId = docid;
		};

		this.set_url = function(url)
		{
		};

		this.spellCheck = function(spellData)
		{
			window["AscDesktopEditor"]["SpellCheck"](spellData);
		};

		this.onSpellCheck = function(spellData)
		{
			editor.SpellCheck_CallBack(spellData);
		};

		this.disconnect = function()
		{
			// none
		};
	}

	window["AscDesktopEditor_Save"] = function()
	{
		return editor.asc_Save(false);
	};

	//-------------------------------------------------------------export---------------------------------------------------
	window['Asc']                                                       = window['Asc'] || {};
	CAscSection.prototype['get_PageWidth']                              = CAscSection.prototype.get_PageWidth;
	CAscSection.prototype['get_PageHeight']                             = CAscSection.prototype.get_PageHeight;
	CAscSection.prototype['get_MarginLeft']                             = CAscSection.prototype.get_MarginLeft;
	CAscSection.prototype['get_MarginRight']                            = CAscSection.prototype.get_MarginRight;
	CAscSection.prototype['get_MarginTop']                              = CAscSection.prototype.get_MarginTop;
	CAscSection.prototype['get_MarginBottom']                           = CAscSection.prototype.get_MarginBottom;
	CHeaderProp.prototype['get_Type']                                   = CHeaderProp.prototype.get_Type;
	CHeaderProp.prototype['put_Type']                                   = CHeaderProp.prototype.put_Type;
	CHeaderProp.prototype['get_Position']                               = CHeaderProp.prototype.get_Position;
	CHeaderProp.prototype['put_Position']                               = CHeaderProp.prototype.put_Position;
	CHeaderProp.prototype['get_DifferentFirst']                         = CHeaderProp.prototype.get_DifferentFirst;
	CHeaderProp.prototype['put_DifferentFirst']                         = CHeaderProp.prototype.put_DifferentFirst;
	CHeaderProp.prototype['get_DifferentEvenOdd']                       = CHeaderProp.prototype.get_DifferentEvenOdd;
	CHeaderProp.prototype['put_DifferentEvenOdd']                       = CHeaderProp.prototype.put_DifferentEvenOdd;
	CHeaderProp.prototype['get_LinkToPrevious']                         = CHeaderProp.prototype.get_LinkToPrevious;
	CHeaderProp.prototype['get_Locked']                                 = CHeaderProp.prototype.get_Locked;
	window['Asc']['CMailMergeSendData'] = window['Asc'].CMailMergeSendData = CMailMergeSendData;
	CMailMergeSendData.prototype['get_From']                            = CMailMergeSendData.prototype.get_From;
	CMailMergeSendData.prototype['put_From']                            = CMailMergeSendData.prototype.put_From;
	CMailMergeSendData.prototype['get_To']                              = CMailMergeSendData.prototype.get_To;
	CMailMergeSendData.prototype['put_To']                              = CMailMergeSendData.prototype.put_To;
	CMailMergeSendData.prototype['get_Subject']                         = CMailMergeSendData.prototype.get_Subject;
	CMailMergeSendData.prototype['put_Subject']                         = CMailMergeSendData.prototype.put_Subject;
	CMailMergeSendData.prototype['get_MailFormat']                      = CMailMergeSendData.prototype.get_MailFormat;
	CMailMergeSendData.prototype['put_MailFormat']                      = CMailMergeSendData.prototype.put_MailFormat;
	CMailMergeSendData.prototype['get_FileName']                        = CMailMergeSendData.prototype.get_FileName;
	CMailMergeSendData.prototype['put_FileName']                        = CMailMergeSendData.prototype.put_FileName;
	CMailMergeSendData.prototype['get_Message']                         = CMailMergeSendData.prototype.get_Message;
	CMailMergeSendData.prototype['put_Message']                         = CMailMergeSendData.prototype.put_Message;
	CMailMergeSendData.prototype['get_RecordFrom']                      = CMailMergeSendData.prototype.get_RecordFrom;
	CMailMergeSendData.prototype['put_RecordFrom']                      = CMailMergeSendData.prototype.put_RecordFrom;
	CMailMergeSendData.prototype['get_RecordTo']                        = CMailMergeSendData.prototype.get_RecordTo;
	CMailMergeSendData.prototype['put_RecordTo']                        = CMailMergeSendData.prototype.put_RecordTo;
	CMailMergeSendData.prototype['get_RecordCount']                     = CMailMergeSendData.prototype.get_RecordCount;
	CMailMergeSendData.prototype['put_RecordCount']                     = CMailMergeSendData.prototype.put_RecordCount;
	CMailMergeSendData.prototype['get_UserId']                          = CMailMergeSendData.prototype.get_UserId;
	CMailMergeSendData.prototype['put_UserId']                          = CMailMergeSendData.prototype.put_UserId;
	window['Asc']['CAscFootnotePr'] = window['Asc'].CAscFootnotePr = CAscFootnotePr;
	CAscFootnotePr.prototype['get_Pos']                                 = CAscFootnotePr.prototype.get_Pos;
	CAscFootnotePr.prototype['put_Pos']                                 = CAscFootnotePr.prototype.put_Pos;
	CAscFootnotePr.prototype['get_NumStart']                            = CAscFootnotePr.prototype.get_NumStart;
	CAscFootnotePr.prototype['put_NumStart']                            = CAscFootnotePr.prototype.put_NumStart;
	CAscFootnotePr.prototype['get_NumFormat']                           = CAscFootnotePr.prototype.get_NumFormat;
	CAscFootnotePr.prototype['put_NumFormat']                           = CAscFootnotePr.prototype.put_NumFormat;
	CAscFootnotePr.prototype['get_NumRestart']                          = CAscFootnotePr.prototype.get_NumRestart;
	CAscFootnotePr.prototype['put_NumRestart']                          = CAscFootnotePr.prototype.put_NumRestart;
	window['Asc']['asc_docs_api']                                       = asc_docs_api;
	asc_docs_api.prototype['LoadFontsFromServer']                       = asc_docs_api.prototype.LoadFontsFromServer;
	asc_docs_api.prototype['SetCollaborativeMarksShowType']             = asc_docs_api.prototype.SetCollaborativeMarksShowType;
	asc_docs_api.prototype['GetCollaborativeMarksShowType']             = asc_docs_api.prototype.GetCollaborativeMarksShowType;
	asc_docs_api.prototype['Clear_CollaborativeMarks']                  = asc_docs_api.prototype.Clear_CollaborativeMarks;
	asc_docs_api.prototype['SetLanguage']                               = asc_docs_api.prototype.SetLanguage;
	asc_docs_api.prototype['asc_GetFontThumbnailsPath']                 = asc_docs_api.prototype.asc_GetFontThumbnailsPath;
	asc_docs_api.prototype['TranslateStyleName']                        = asc_docs_api.prototype.TranslateStyleName;
	asc_docs_api.prototype['CheckChangedDocument']                      = asc_docs_api.prototype.CheckChangedDocument;
	asc_docs_api.prototype['SetUnchangedDocument']                      = asc_docs_api.prototype.SetUnchangedDocument;
	asc_docs_api.prototype['SetDocumentModified']                       = asc_docs_api.prototype.SetDocumentModified;
	asc_docs_api.prototype['isDocumentModified']                        = asc_docs_api.prototype.isDocumentModified;
	asc_docs_api.prototype['asc_isDocumentCanSave']                     = asc_docs_api.prototype.asc_isDocumentCanSave;
	asc_docs_api.prototype['sync_BeginCatchSelectedElements']           = asc_docs_api.prototype.sync_BeginCatchSelectedElements;
	asc_docs_api.prototype['sync_EndCatchSelectedElements']             = asc_docs_api.prototype.sync_EndCatchSelectedElements;
	asc_docs_api.prototype['getSelectedElements']                       = asc_docs_api.prototype.getSelectedElements;
	asc_docs_api.prototype['sync_ChangeLastSelectedElement']            = asc_docs_api.prototype.sync_ChangeLastSelectedElement;
	asc_docs_api.prototype['asc_getEditorPermissions']                  = asc_docs_api.prototype.asc_getEditorPermissions;
	asc_docs_api.prototype['asc_setDocInfo']                            = asc_docs_api.prototype.asc_setDocInfo;
	asc_docs_api.prototype['asc_setLocale']                             = asc_docs_api.prototype.asc_setLocale;
	asc_docs_api.prototype['asc_LoadDocument']                          = asc_docs_api.prototype.asc_LoadDocument;
	asc_docs_api.prototype['SetTextBoxInputMode']                       = asc_docs_api.prototype.SetTextBoxInputMode;
	asc_docs_api.prototype['GetTextBoxInputMode']                       = asc_docs_api.prototype.GetTextBoxInputMode;
	asc_docs_api.prototype['ChangeReaderMode']                          = asc_docs_api.prototype.ChangeReaderMode;
	asc_docs_api.prototype['SetReaderModeOnly']                         = asc_docs_api.prototype.SetReaderModeOnly;
	asc_docs_api.prototype['IncreaseReaderFontSize']                    = asc_docs_api.prototype.IncreaseReaderFontSize;
	asc_docs_api.prototype['DecreaseReaderFontSize']                    = asc_docs_api.prototype.DecreaseReaderFontSize;
	asc_docs_api.prototype['CreateCSS']                                 = asc_docs_api.prototype.CreateCSS;
	asc_docs_api.prototype['GetCopyPasteDivId']                         = asc_docs_api.prototype.GetCopyPasteDivId;
	asc_docs_api.prototype['ContentToHTML']                             = asc_docs_api.prototype.ContentToHTML;
	asc_docs_api.prototype['InitEditor']                                = asc_docs_api.prototype.InitEditor;
	asc_docs_api.prototype['InitViewer']                                = asc_docs_api.prototype.InitViewer;
	asc_docs_api.prototype['OpenDocument']                              = asc_docs_api.prototype.OpenDocument;
	asc_docs_api.prototype['OpenDocument2']                             = asc_docs_api.prototype.OpenDocument2;
	asc_docs_api.prototype['asc_getDocumentName']                       = asc_docs_api.prototype.asc_getDocumentName;
	asc_docs_api.prototype['asc_registerCallback']                      = asc_docs_api.prototype.asc_registerCallback;
	asc_docs_api.prototype['asc_unregisterCallback']                    = asc_docs_api.prototype.asc_unregisterCallback;
	asc_docs_api.prototype['asc_checkNeedCallback']                     = asc_docs_api.prototype.asc_checkNeedCallback;
	asc_docs_api.prototype['asc_getPropertyEditorShapes']               = asc_docs_api.prototype.asc_getPropertyEditorShapes;
	asc_docs_api.prototype['asc_getPropertyEditorTextArts']             = asc_docs_api.prototype.asc_getPropertyEditorTextArts;
	asc_docs_api.prototype['get_PropertyThemeColors']                   = asc_docs_api.prototype.get_PropertyThemeColors;
	asc_docs_api.prototype['_coAuthoringSetChange']                     = asc_docs_api.prototype._coAuthoringSetChange;
	asc_docs_api.prototype['_coAuthoringSetChanges']                    = asc_docs_api.prototype._coAuthoringSetChanges;
	asc_docs_api.prototype['asc_coAuthoringChatSendMessage']            = asc_docs_api.prototype.asc_coAuthoringChatSendMessage;
	asc_docs_api.prototype['asc_coAuthoringChatGetMessages']            = asc_docs_api.prototype.asc_coAuthoringChatGetMessages;
	asc_docs_api.prototype['asc_coAuthoringGetUsers']                   = asc_docs_api.prototype.asc_coAuthoringGetUsers;
	asc_docs_api.prototype['asc_coAuthoringDisconnect']                 = asc_docs_api.prototype.asc_coAuthoringDisconnect;
	asc_docs_api.prototype['asc_getSpellCheckLanguages']                = asc_docs_api.prototype.asc_getSpellCheckLanguages;
	asc_docs_api.prototype['asc_SpellCheckDisconnect']                  = asc_docs_api.prototype.asc_SpellCheckDisconnect;
	asc_docs_api.prototype['_onUpdateDocumentCanSave']                  = asc_docs_api.prototype._onUpdateDocumentCanSave;
	asc_docs_api.prototype['put_FramePr']                               = asc_docs_api.prototype.put_FramePr;
	asc_docs_api.prototype['asyncFontEndLoaded_MathDraw']               = asc_docs_api.prototype.asyncFontEndLoaded_MathDraw;
	asc_docs_api.prototype['sendMathTypesToMenu']                       = asc_docs_api.prototype.sendMathTypesToMenu;
	asc_docs_api.prototype['asyncFontEndLoaded_DropCap']                = asc_docs_api.prototype.asyncFontEndLoaded_DropCap;
	asc_docs_api.prototype['asc_addDropCap']                            = asc_docs_api.prototype.asc_addDropCap;
	asc_docs_api.prototype['removeDropcap']                             = asc_docs_api.prototype.removeDropcap;
	asc_docs_api.prototype['get_TextProps']                             = asc_docs_api.prototype.get_TextProps;
	asc_docs_api.prototype['GetJSONLogicDocument']                      = asc_docs_api.prototype.GetJSONLogicDocument;
	asc_docs_api.prototype['get_ContentCount']                          = asc_docs_api.prototype.get_ContentCount;
	asc_docs_api.prototype['select_Element']                            = asc_docs_api.prototype.select_Element;
	asc_docs_api.prototype['UpdateTextPr']                              = asc_docs_api.prototype.UpdateTextPr;
	asc_docs_api.prototype['UpdateParagraphProp']                       = asc_docs_api.prototype.UpdateParagraphProp;
	asc_docs_api.prototype['asc_Print']                                 = asc_docs_api.prototype.asc_Print;
	asc_docs_api.prototype['Undo']                                      = asc_docs_api.prototype.Undo;
	asc_docs_api.prototype['Redo']                                      = asc_docs_api.prototype.Redo;
	asc_docs_api.prototype['Copy']                                      = asc_docs_api.prototype.Copy;
	asc_docs_api.prototype['Update_ParaTab']                            = asc_docs_api.prototype.Update_ParaTab;
	asc_docs_api.prototype['Cut']                                       = asc_docs_api.prototype.Cut;
	asc_docs_api.prototype['Paste']                                     = asc_docs_api.prototype.Paste;
	asc_docs_api.prototype['Share']                                     = asc_docs_api.prototype.Share;
	asc_docs_api.prototype['asc_Save']                                  = asc_docs_api.prototype.asc_Save;
	asc_docs_api.prototype['asc_DownloadAs']                            = asc_docs_api.prototype.asc_DownloadAs;
	asc_docs_api.prototype['asc_DownloadAsMailMerge']                   = asc_docs_api.prototype.asc_DownloadAsMailMerge;
	asc_docs_api.prototype['asc_DownloadOrigin']                        = asc_docs_api.prototype.asc_DownloadOrigin;
	asc_docs_api.prototype['Resize']                                    = asc_docs_api.prototype.Resize;
	asc_docs_api.prototype['AddURL']                                    = asc_docs_api.prototype.AddURL;
	asc_docs_api.prototype['Help']                                      = asc_docs_api.prototype.Help;
	asc_docs_api.prototype['asc_setAdvancedOptions']                    = asc_docs_api.prototype.asc_setAdvancedOptions;
	asc_docs_api.prototype['SetFontRenderingMode']                      = asc_docs_api.prototype.SetFontRenderingMode;
	asc_docs_api.prototype['startGetDocInfo']                           = asc_docs_api.prototype.startGetDocInfo;
	asc_docs_api.prototype['stopGetDocInfo']                            = asc_docs_api.prototype.stopGetDocInfo;
	asc_docs_api.prototype['sync_DocInfoCallback']                      = asc_docs_api.prototype.sync_DocInfoCallback;
	asc_docs_api.prototype['sync_GetDocInfoStartCallback']              = asc_docs_api.prototype.sync_GetDocInfoStartCallback;
	asc_docs_api.prototype['sync_GetDocInfoStopCallback']               = asc_docs_api.prototype.sync_GetDocInfoStopCallback;
	asc_docs_api.prototype['sync_GetDocInfoEndCallback']                = asc_docs_api.prototype.sync_GetDocInfoEndCallback;
	asc_docs_api.prototype['sync_CanUndoCallback']                      = asc_docs_api.prototype.sync_CanUndoCallback;
	asc_docs_api.prototype['sync_CanRedoCallback']                      = asc_docs_api.prototype.sync_CanRedoCallback;
	asc_docs_api.prototype['can_CopyCut']                               = asc_docs_api.prototype.can_CopyCut;
	asc_docs_api.prototype['sync_CanCopyCutCallback']                   = asc_docs_api.prototype.sync_CanCopyCutCallback;
	asc_docs_api.prototype['setStartPointHistory']                      = asc_docs_api.prototype.setStartPointHistory;
	asc_docs_api.prototype['setEndPointHistory']                        = asc_docs_api.prototype.setEndPointHistory;
	asc_docs_api.prototype['sync_CursorLockCallBack']                   = asc_docs_api.prototype.sync_CursorLockCallBack;
	asc_docs_api.prototype['sync_UndoCallBack']                         = asc_docs_api.prototype.sync_UndoCallBack;
	asc_docs_api.prototype['sync_RedoCallBack']                         = asc_docs_api.prototype.sync_RedoCallBack;
	asc_docs_api.prototype['sync_CopyCallBack']                         = asc_docs_api.prototype.sync_CopyCallBack;
	asc_docs_api.prototype['sync_CutCallBack']                          = asc_docs_api.prototype.sync_CutCallBack;
	asc_docs_api.prototype['sync_PasteCallBack']                        = asc_docs_api.prototype.sync_PasteCallBack;
	asc_docs_api.prototype['sync_ShareCallBack']                        = asc_docs_api.prototype.sync_ShareCallBack;
	asc_docs_api.prototype['sync_SaveCallBack']                         = asc_docs_api.prototype.sync_SaveCallBack;
	asc_docs_api.prototype['sync_DownloadAsCallBack']                   = asc_docs_api.prototype.sync_DownloadAsCallBack;
	asc_docs_api.prototype['sync_StartAction']                          = asc_docs_api.prototype.sync_StartAction;
	asc_docs_api.prototype['sync_EndAction']                            = asc_docs_api.prototype.sync_EndAction;
	asc_docs_api.prototype['sync_AddURLCallback']                       = asc_docs_api.prototype.sync_AddURLCallback;
	asc_docs_api.prototype['sync_ErrorCallback']                        = asc_docs_api.prototype.sync_ErrorCallback;
	asc_docs_api.prototype['sync_HelpCallback']                         = asc_docs_api.prototype.sync_HelpCallback;
	asc_docs_api.prototype['sync_UpdateZoom']                           = asc_docs_api.prototype.sync_UpdateZoom;
	asc_docs_api.prototype['ClearPropObjCallback']                      = asc_docs_api.prototype.ClearPropObjCallback;
	asc_docs_api.prototype['CollectHeaders']                            = asc_docs_api.prototype.CollectHeaders;
	asc_docs_api.prototype['GetActiveHeader']                           = asc_docs_api.prototype.GetActiveHeader;
	asc_docs_api.prototype['gotoHeader']                                = asc_docs_api.prototype.gotoHeader;
	asc_docs_api.prototype['sync_ChangeActiveHeaderCallback']           = asc_docs_api.prototype.sync_ChangeActiveHeaderCallback;
	asc_docs_api.prototype['sync_ReturnHeadersCallback']                = asc_docs_api.prototype.sync_ReturnHeadersCallback;
	asc_docs_api.prototype['asc_searchEnabled']                         = asc_docs_api.prototype.asc_searchEnabled;
	asc_docs_api.prototype['asc_findText']                              = asc_docs_api.prototype.asc_findText;
	asc_docs_api.prototype['asc_replaceText']                           = asc_docs_api.prototype.asc_replaceText;
	asc_docs_api.prototype['asc_selectSearchingResults']                = asc_docs_api.prototype.asc_selectSearchingResults;
	asc_docs_api.prototype['asc_isSelectSearchingResults']              = asc_docs_api.prototype.asc_isSelectSearchingResults;
	asc_docs_api.prototype['sync_ReplaceAllCallback']                   = asc_docs_api.prototype.sync_ReplaceAllCallback;
	asc_docs_api.prototype['sync_SearchEndCallback']                    = asc_docs_api.prototype.sync_SearchEndCallback;
	asc_docs_api.prototype['put_TextPrFontName']                        = asc_docs_api.prototype.put_TextPrFontName;
	asc_docs_api.prototype['put_TextPrFontSize']                        = asc_docs_api.prototype.put_TextPrFontSize;
	asc_docs_api.prototype['put_TextPrBold']                            = asc_docs_api.prototype.put_TextPrBold;
	asc_docs_api.prototype['put_TextPrItalic']                          = asc_docs_api.prototype.put_TextPrItalic;
	asc_docs_api.prototype['put_TextPrUnderline']                       = asc_docs_api.prototype.put_TextPrUnderline;
	asc_docs_api.prototype['put_TextPrStrikeout']                       = asc_docs_api.prototype.put_TextPrStrikeout;
	asc_docs_api.prototype['put_TextPrDStrikeout']                      = asc_docs_api.prototype.put_TextPrDStrikeout;
	asc_docs_api.prototype['put_TextPrSpacing']                         = asc_docs_api.prototype.put_TextPrSpacing;
	asc_docs_api.prototype['put_TextPrCaps']                            = asc_docs_api.prototype.put_TextPrCaps;
	asc_docs_api.prototype['put_TextPrSmallCaps']                       = asc_docs_api.prototype.put_TextPrSmallCaps;
	asc_docs_api.prototype['put_TextPrPosition']                        = asc_docs_api.prototype.put_TextPrPosition;
	asc_docs_api.prototype['put_TextPrLang']                            = asc_docs_api.prototype.put_TextPrLang;
	asc_docs_api.prototype['put_PrLineSpacing']                         = asc_docs_api.prototype.put_PrLineSpacing;
	asc_docs_api.prototype['put_LineSpacingBeforeAfter']                = asc_docs_api.prototype.put_LineSpacingBeforeAfter;
	asc_docs_api.prototype['FontSizeIn']                                = asc_docs_api.prototype.FontSizeIn;
	asc_docs_api.prototype['FontSizeOut']                               = asc_docs_api.prototype.FontSizeOut;
	asc_docs_api.prototype['put_Borders']                               = asc_docs_api.prototype.put_Borders;
	asc_docs_api.prototype['sync_BoldCallBack']                         = asc_docs_api.prototype.sync_BoldCallBack;
	asc_docs_api.prototype['sync_ItalicCallBack']                       = asc_docs_api.prototype.sync_ItalicCallBack;
	asc_docs_api.prototype['sync_UnderlineCallBack']                    = asc_docs_api.prototype.sync_UnderlineCallBack;
	asc_docs_api.prototype['sync_StrikeoutCallBack']                    = asc_docs_api.prototype.sync_StrikeoutCallBack;
	asc_docs_api.prototype['sync_TextPrFontFamilyCallBack']             = asc_docs_api.prototype.sync_TextPrFontFamilyCallBack;
	asc_docs_api.prototype['sync_TextPrFontSizeCallBack']               = asc_docs_api.prototype.sync_TextPrFontSizeCallBack;
	asc_docs_api.prototype['sync_PrLineSpacingCallBack']                = asc_docs_api.prototype.sync_PrLineSpacingCallBack;
	asc_docs_api.prototype['sync_InitEditorTableStyles']                = asc_docs_api.prototype.sync_InitEditorTableStyles;
	asc_docs_api.prototype['paraApply']                                 = asc_docs_api.prototype.paraApply;
	asc_docs_api.prototype['put_PrAlign']                               = asc_docs_api.prototype.put_PrAlign;
	asc_docs_api.prototype['put_TextPrBaseline']                        = asc_docs_api.prototype.put_TextPrBaseline;
	asc_docs_api.prototype['put_ListType']                              = asc_docs_api.prototype.put_ListType;
	asc_docs_api.prototype['put_Style']                                 = asc_docs_api.prototype.put_Style;
	asc_docs_api.prototype['SetDeviceInputHelperId']                    = asc_docs_api.prototype.SetDeviceInputHelperId;
	asc_docs_api.prototype['put_ShowSnapLines']                         = asc_docs_api.prototype.put_ShowSnapLines;
	asc_docs_api.prototype['get_ShowSnapLines']                         = asc_docs_api.prototype.get_ShowSnapLines;
	asc_docs_api.prototype['put_ShowParaMarks']                         = asc_docs_api.prototype.put_ShowParaMarks;
	asc_docs_api.prototype['get_ShowParaMarks']                         = asc_docs_api.prototype.get_ShowParaMarks;
	asc_docs_api.prototype['put_ShowTableEmptyLine']                    = asc_docs_api.prototype.put_ShowTableEmptyLine;
	asc_docs_api.prototype['get_ShowTableEmptyLine']                    = asc_docs_api.prototype.get_ShowTableEmptyLine;
	asc_docs_api.prototype['put_PageBreak']                             = asc_docs_api.prototype.put_PageBreak;
	asc_docs_api.prototype['put_WidowControl']                          = asc_docs_api.prototype.put_WidowControl;
	asc_docs_api.prototype['put_KeepLines']                             = asc_docs_api.prototype.put_KeepLines;
	asc_docs_api.prototype['put_KeepNext']                              = asc_docs_api.prototype.put_KeepNext;
	asc_docs_api.prototype['put_AddSpaceBetweenPrg']                    = asc_docs_api.prototype.put_AddSpaceBetweenPrg;
	asc_docs_api.prototype['put_LineHighLight']                         = asc_docs_api.prototype.put_LineHighLight;
	asc_docs_api.prototype['put_TextColor']                             = asc_docs_api.prototype.put_TextColor;
	asc_docs_api.prototype['put_ParagraphShade']                        = asc_docs_api.prototype.put_ParagraphShade;
	asc_docs_api.prototype['put_PrIndent']                              = asc_docs_api.prototype.put_PrIndent;
	asc_docs_api.prototype['IncreaseIndent']                            = asc_docs_api.prototype.IncreaseIndent;
	asc_docs_api.prototype['DecreaseIndent']                            = asc_docs_api.prototype.DecreaseIndent;
	asc_docs_api.prototype['put_PrIndentRight']                         = asc_docs_api.prototype.put_PrIndentRight;
	asc_docs_api.prototype['put_PrFirstLineIndent']                     = asc_docs_api.prototype.put_PrFirstLineIndent;
	asc_docs_api.prototype['put_Margins']                               = asc_docs_api.prototype.put_Margins;
	asc_docs_api.prototype['getFocusObject']                            = asc_docs_api.prototype.getFocusObject;
	asc_docs_api.prototype['sync_VerticalAlign']                        = asc_docs_api.prototype.sync_VerticalAlign;
	asc_docs_api.prototype['sync_PrAlignCallBack']                      = asc_docs_api.prototype.sync_PrAlignCallBack;
	asc_docs_api.prototype['sync_ListType']                             = asc_docs_api.prototype.sync_ListType;
	asc_docs_api.prototype['sync_TextColor']                            = asc_docs_api.prototype.sync_TextColor;
	asc_docs_api.prototype['sync_TextHighLight']                        = asc_docs_api.prototype.sync_TextHighLight;
	asc_docs_api.prototype['sync_TextSpacing']                          = asc_docs_api.prototype.sync_TextSpacing;
	asc_docs_api.prototype['sync_TextDStrikeout']                       = asc_docs_api.prototype.sync_TextDStrikeout;
	asc_docs_api.prototype['sync_TextCaps']                             = asc_docs_api.prototype.sync_TextCaps;
	asc_docs_api.prototype['sync_TextSmallCaps']                        = asc_docs_api.prototype.sync_TextSmallCaps;
	asc_docs_api.prototype['sync_TextPosition']                         = asc_docs_api.prototype.sync_TextPosition;
	asc_docs_api.prototype['sync_TextLangCallBack']                     = asc_docs_api.prototype.sync_TextLangCallBack;
	asc_docs_api.prototype['sync_ParaStyleName']                        = asc_docs_api.prototype.sync_ParaStyleName;
	asc_docs_api.prototype['sync_ParaSpacingLine']                      = asc_docs_api.prototype.sync_ParaSpacingLine;
	asc_docs_api.prototype['sync_PageBreakCallback']                    = asc_docs_api.prototype.sync_PageBreakCallback;
	asc_docs_api.prototype['sync_WidowControlCallback']                 = asc_docs_api.prototype.sync_WidowControlCallback;
	asc_docs_api.prototype['sync_KeepNextCallback']                     = asc_docs_api.prototype.sync_KeepNextCallback;
	asc_docs_api.prototype['sync_KeepLinesCallback']                    = asc_docs_api.prototype.sync_KeepLinesCallback;
	asc_docs_api.prototype['sync_ShowParaMarksCallback']                = asc_docs_api.prototype.sync_ShowParaMarksCallback;
	asc_docs_api.prototype['sync_SpaceBetweenPrgCallback']              = asc_docs_api.prototype.sync_SpaceBetweenPrgCallback;
	asc_docs_api.prototype['sync_PrPropCallback']                       = asc_docs_api.prototype.sync_PrPropCallback;
	asc_docs_api.prototype['sync_MathPropCallback']                     = asc_docs_api.prototype.sync_MathPropCallback;
	asc_docs_api.prototype['sync_EndAddShape']                          = asc_docs_api.prototype.sync_EndAddShape;
	asc_docs_api.prototype['SetDrawingFreeze']                          = asc_docs_api.prototype.SetDrawingFreeze;
	asc_docs_api.prototype['change_PageOrient']                         = asc_docs_api.prototype.change_PageOrient;
	asc_docs_api.prototype['get_DocumentOrientation']                   = asc_docs_api.prototype.get_DocumentOrientation;
	asc_docs_api.prototype['change_DocSize']                            = asc_docs_api.prototype.change_DocSize;
	asc_docs_api.prototype['get_DocumentWidth']                         = asc_docs_api.prototype.get_DocumentWidth;
	asc_docs_api.prototype['get_DocumentHeight']                        = asc_docs_api.prototype.get_DocumentHeight;
	asc_docs_api.prototype['put_AddPageBreak']                          = asc_docs_api.prototype.put_AddPageBreak;
	asc_docs_api.prototype['put_AddColumnBreak']                        = asc_docs_api.prototype.put_AddColumnBreak;
	asc_docs_api.prototype['Update_ParaInd']                            = asc_docs_api.prototype.Update_ParaInd;
	asc_docs_api.prototype['Internal_Update_Ind_FirstLine']             = asc_docs_api.prototype.Internal_Update_Ind_FirstLine;
	asc_docs_api.prototype['Internal_Update_Ind_Left']                  = asc_docs_api.prototype.Internal_Update_Ind_Left;
	asc_docs_api.prototype['Internal_Update_Ind_Right']                 = asc_docs_api.prototype.Internal_Update_Ind_Right;
	asc_docs_api.prototype['put_PageNum']                               = asc_docs_api.prototype.put_PageNum;
	asc_docs_api.prototype['put_HeadersAndFootersDistance']             = asc_docs_api.prototype.put_HeadersAndFootersDistance;
	asc_docs_api.prototype['HeadersAndFooters_DifferentFirstPage']      = asc_docs_api.prototype.HeadersAndFooters_DifferentFirstPage;
	asc_docs_api.prototype['HeadersAndFooters_DifferentOddandEvenPage'] = asc_docs_api.prototype.HeadersAndFooters_DifferentOddandEvenPage;
	asc_docs_api.prototype['HeadersAndFooters_LinkToPrevious']          = asc_docs_api.prototype.HeadersAndFooters_LinkToPrevious;
	asc_docs_api.prototype['sync_DocSizeCallback']                      = asc_docs_api.prototype.sync_DocSizeCallback;
	asc_docs_api.prototype['sync_PageOrientCallback']                   = asc_docs_api.prototype.sync_PageOrientCallback;
	asc_docs_api.prototype['sync_HeadersAndFootersPropCallback']        = asc_docs_api.prototype.sync_HeadersAndFootersPropCallback;
	asc_docs_api.prototype['put_Table']                                 = asc_docs_api.prototype.put_Table;
	asc_docs_api.prototype['addRowAbove']                               = asc_docs_api.prototype.addRowAbove;
	asc_docs_api.prototype['addRowBelow']                               = asc_docs_api.prototype.addRowBelow;
	asc_docs_api.prototype['addColumnLeft']                             = asc_docs_api.prototype.addColumnLeft;
	asc_docs_api.prototype['addColumnRight']                            = asc_docs_api.prototype.addColumnRight;
	asc_docs_api.prototype['remRow']                                    = asc_docs_api.prototype.remRow;
	asc_docs_api.prototype['remColumn']                                 = asc_docs_api.prototype.remColumn;
	asc_docs_api.prototype['remTable']                                  = asc_docs_api.prototype.remTable;
	asc_docs_api.prototype['selectRow']                                 = asc_docs_api.prototype.selectRow;
	asc_docs_api.prototype['selectColumn']                              = asc_docs_api.prototype.selectColumn;
	asc_docs_api.prototype['selectCell']                                = asc_docs_api.prototype.selectCell;
	asc_docs_api.prototype['selectTable']                               = asc_docs_api.prototype.selectTable;
	asc_docs_api.prototype['setColumnWidth']                            = asc_docs_api.prototype.setColumnWidth;
	asc_docs_api.prototype['setRowHeight']                              = asc_docs_api.prototype.setRowHeight;
	asc_docs_api.prototype['set_TblDistanceFromText']                   = asc_docs_api.prototype.set_TblDistanceFromText;
	asc_docs_api.prototype['CheckBeforeMergeCells']                     = asc_docs_api.prototype.CheckBeforeMergeCells;
	asc_docs_api.prototype['CheckBeforeSplitCells']                     = asc_docs_api.prototype.CheckBeforeSplitCells;
	asc_docs_api.prototype['MergeCells']                                = asc_docs_api.prototype.MergeCells;
	asc_docs_api.prototype['SplitCell']                                 = asc_docs_api.prototype.SplitCell;
	asc_docs_api.prototype['widthTable']                                = asc_docs_api.prototype.widthTable;
	asc_docs_api.prototype['put_CellsMargin']                           = asc_docs_api.prototype.put_CellsMargin;
	asc_docs_api.prototype['set_TblWrap']                               = asc_docs_api.prototype.set_TblWrap;
	asc_docs_api.prototype['set_TblIndentLeft']                         = asc_docs_api.prototype.set_TblIndentLeft;
	asc_docs_api.prototype['set_Borders']                               = asc_docs_api.prototype.set_Borders;
	asc_docs_api.prototype['set_TableBackground']                       = asc_docs_api.prototype.set_TableBackground;
	asc_docs_api.prototype['set_AlignCell']                             = asc_docs_api.prototype.set_AlignCell;
	asc_docs_api.prototype['set_TblAlign']                              = asc_docs_api.prototype.set_TblAlign;
	asc_docs_api.prototype['set_SpacingBetweenCells']                   = asc_docs_api.prototype.set_SpacingBetweenCells;
	asc_docs_api.prototype['tblApply']                                  = asc_docs_api.prototype.tblApply;
	asc_docs_api.prototype['sync_AddTableCallback']                     = asc_docs_api.prototype.sync_AddTableCallback;
	asc_docs_api.prototype['sync_AlignCellCallback']                    = asc_docs_api.prototype.sync_AlignCellCallback;
	asc_docs_api.prototype['sync_TblPropCallback']                      = asc_docs_api.prototype.sync_TblPropCallback;
	asc_docs_api.prototype['sync_TblWrapStyleChangedCallback']          = asc_docs_api.prototype.sync_TblWrapStyleChangedCallback;
	asc_docs_api.prototype['sync_TblAlignChangedCallback']              = asc_docs_api.prototype.sync_TblAlignChangedCallback;
	asc_docs_api.prototype['ChangeImageFromFile']                       = asc_docs_api.prototype.ChangeImageFromFile;
	asc_docs_api.prototype['ChangeShapeImageFromFile']                  = asc_docs_api.prototype.ChangeShapeImageFromFile;
	asc_docs_api.prototype['AddImage']                                  = asc_docs_api.prototype.AddImage;
	asc_docs_api.prototype['asc_addImage']                              = asc_docs_api.prototype.asc_addImage;
	asc_docs_api.prototype['AddImageUrl2']                              = asc_docs_api.prototype.AddImageUrl2;
	asc_docs_api.prototype['AddImageUrl']                               = asc_docs_api.prototype.AddImageUrl;
	asc_docs_api.prototype['AddImageUrlAction']                         = asc_docs_api.prototype.AddImageUrlAction;
	asc_docs_api.prototype['AddImageToPage']                            = asc_docs_api.prototype.AddImageToPage;
	asc_docs_api.prototype['ImgApply']                                  = asc_docs_api.prototype.ImgApply;
	asc_docs_api.prototype['set_Size']                                  = asc_docs_api.prototype.set_Size;
	asc_docs_api.prototype['set_ConstProportions']                      = asc_docs_api.prototype.set_ConstProportions;
	asc_docs_api.prototype['set_WrapStyle']                             = asc_docs_api.prototype.set_WrapStyle;
	asc_docs_api.prototype['deleteImage']                               = asc_docs_api.prototype.deleteImage;
	asc_docs_api.prototype['set_ImgDistanceFromText']                   = asc_docs_api.prototype.set_ImgDistanceFromText;
	asc_docs_api.prototype['set_PositionOnPage']                        = asc_docs_api.prototype.set_PositionOnPage;
	asc_docs_api.prototype['get_OriginalSizeImage']                     = asc_docs_api.prototype.get_OriginalSizeImage;
	asc_docs_api.prototype['ShapeApply']                                = asc_docs_api.prototype.ShapeApply;
	asc_docs_api.prototype['sync_AddImageCallback']                     = asc_docs_api.prototype.sync_AddImageCallback;
	asc_docs_api.prototype['sync_ImgPropCallback']                      = asc_docs_api.prototype.sync_ImgPropCallback;
	asc_docs_api.prototype['sync_ImgWrapStyleChangedCallback']          = asc_docs_api.prototype.sync_ImgWrapStyleChangedCallback;
	asc_docs_api.prototype['sync_ContextMenuCallback']                  = asc_docs_api.prototype.sync_ContextMenuCallback;
	asc_docs_api.prototype['sync_MouseMoveStartCallback']               = asc_docs_api.prototype.sync_MouseMoveStartCallback;
	asc_docs_api.prototype['sync_MouseMoveEndCallback']                 = asc_docs_api.prototype.sync_MouseMoveEndCallback;
	asc_docs_api.prototype['sync_MouseMoveCallback']                    = asc_docs_api.prototype.sync_MouseMoveCallback;
	asc_docs_api.prototype['asc_setChartTranslate']                     = asc_docs_api.prototype.asc_setChartTranslate;
	asc_docs_api.prototype['asc_setTextArtTranslate']                   = asc_docs_api.prototype.asc_setTextArtTranslate;
	asc_docs_api.prototype['can_AddHyperlink']                          = asc_docs_api.prototype.can_AddHyperlink;
	asc_docs_api.prototype['add_Hyperlink']                             = asc_docs_api.prototype.add_Hyperlink;
	asc_docs_api.prototype['change_Hyperlink']                          = asc_docs_api.prototype.change_Hyperlink;
	asc_docs_api.prototype['remove_Hyperlink']                          = asc_docs_api.prototype.remove_Hyperlink;
	asc_docs_api.prototype['sync_HyperlinkPropCallback']                = asc_docs_api.prototype.sync_HyperlinkPropCallback;
	asc_docs_api.prototype['sync_HyperlinkClickCallback']               = asc_docs_api.prototype.sync_HyperlinkClickCallback;
	asc_docs_api.prototype['sync_CanAddHyperlinkCallback']              = asc_docs_api.prototype.sync_CanAddHyperlinkCallback;
	asc_docs_api.prototype['sync_DialogAddHyperlink']                   = asc_docs_api.prototype.sync_DialogAddHyperlink;
	asc_docs_api.prototype['sync_DialogAddHyperlink']                   = asc_docs_api.prototype.sync_DialogAddHyperlink;
	asc_docs_api.prototype['sync_SpellCheckCallback']                   = asc_docs_api.prototype.sync_SpellCheckCallback;
	asc_docs_api.prototype['sync_SpellCheckVariantsFound']              = asc_docs_api.prototype.sync_SpellCheckVariantsFound;
	asc_docs_api.prototype['asc_replaceMisspelledWord']                 = asc_docs_api.prototype.asc_replaceMisspelledWord;
	asc_docs_api.prototype['asc_ignoreMisspelledWord']                  = asc_docs_api.prototype.asc_ignoreMisspelledWord;
	asc_docs_api.prototype['asc_setDefaultLanguage']                    = asc_docs_api.prototype.asc_setDefaultLanguage;
	asc_docs_api.prototype['asc_getDefaultLanguage']                    = asc_docs_api.prototype.asc_getDefaultLanguage;
	asc_docs_api.prototype['asc_getKeyboardLanguage']                   = asc_docs_api.prototype.asc_getKeyboardLanguage;
	asc_docs_api.prototype['asc_setSpellCheck']                         = asc_docs_api.prototype.asc_setSpellCheck;
	asc_docs_api.prototype['asc_showComments']                          = asc_docs_api.prototype.asc_showComments;
	asc_docs_api.prototype['asc_hideComments']                          = asc_docs_api.prototype.asc_hideComments;
	asc_docs_api.prototype['asc_addComment']                            = asc_docs_api.prototype.asc_addComment;
	asc_docs_api.prototype['asc_removeComment']                         = asc_docs_api.prototype.asc_removeComment;
	asc_docs_api.prototype['asc_changeComment']                         = asc_docs_api.prototype.asc_changeComment;
	asc_docs_api.prototype['asc_selectComment']                         = asc_docs_api.prototype.asc_selectComment;
	asc_docs_api.prototype['asc_showComment']                           = asc_docs_api.prototype.asc_showComment;
	asc_docs_api.prototype['can_AddQuotedComment']                      = asc_docs_api.prototype.can_AddQuotedComment;
	asc_docs_api.prototype['sync_RemoveComment']                        = asc_docs_api.prototype.sync_RemoveComment;
	asc_docs_api.prototype['sync_AddComment']                           = asc_docs_api.prototype.sync_AddComment;
	asc_docs_api.prototype['sync_ShowComment']                          = asc_docs_api.prototype.sync_ShowComment;
	asc_docs_api.prototype['sync_HideComment']                          = asc_docs_api.prototype.sync_HideComment;
	asc_docs_api.prototype['sync_UpdateCommentPosition']                = asc_docs_api.prototype.sync_UpdateCommentPosition;
	asc_docs_api.prototype['sync_ChangeCommentData']                    = asc_docs_api.prototype.sync_ChangeCommentData;
	asc_docs_api.prototype['sync_LockComment']                          = asc_docs_api.prototype.sync_LockComment;
	asc_docs_api.prototype['sync_UnLockComment']                        = asc_docs_api.prototype.sync_UnLockComment;
	asc_docs_api.prototype['asc_getComments']                           = asc_docs_api.prototype.asc_getComments;
	asc_docs_api.prototype['sync_LockHeaderFooters']                    = asc_docs_api.prototype.sync_LockHeaderFooters;
	asc_docs_api.prototype['sync_LockDocumentProps']                    = asc_docs_api.prototype.sync_LockDocumentProps;
	asc_docs_api.prototype['sync_UnLockHeaderFooters']                  = asc_docs_api.prototype.sync_UnLockHeaderFooters;
	asc_docs_api.prototype['sync_UnLockDocumentProps']                  = asc_docs_api.prototype.sync_UnLockDocumentProps;
	asc_docs_api.prototype['sync_CollaborativeChanges']                 = asc_docs_api.prototype.sync_CollaborativeChanges;
	asc_docs_api.prototype['sync_LockDocumentSchema']                   = asc_docs_api.prototype.sync_LockDocumentSchema;
	asc_docs_api.prototype['sync_UnLockDocumentSchema']                 = asc_docs_api.prototype.sync_UnLockDocumentSchema;
	asc_docs_api.prototype['zoomIn']                                    = asc_docs_api.prototype.zoomIn;
	asc_docs_api.prototype['zoomOut']                                   = asc_docs_api.prototype.zoomOut;
	asc_docs_api.prototype['zoomFitToPage']                             = asc_docs_api.prototype.zoomFitToPage;
	asc_docs_api.prototype['zoomFitToWidth']                            = asc_docs_api.prototype.zoomFitToWidth;
	asc_docs_api.prototype['zoomCustomMode']                            = asc_docs_api.prototype.zoomCustomMode;
	asc_docs_api.prototype['zoom100']                                   = asc_docs_api.prototype.zoom100;
	asc_docs_api.prototype['zoom']                                      = asc_docs_api.prototype.zoom;
	asc_docs_api.prototype['goToPage']                                  = asc_docs_api.prototype.goToPage;
	asc_docs_api.prototype['getCountPages']                             = asc_docs_api.prototype.getCountPages;
	asc_docs_api.prototype['getCurrentPage']                            = asc_docs_api.prototype.getCurrentPage;
	asc_docs_api.prototype['sync_countPagesCallback']                   = asc_docs_api.prototype.sync_countPagesCallback;
	asc_docs_api.prototype['sync_currentPageCallback']                  = asc_docs_api.prototype.sync_currentPageCallback;
	asc_docs_api.prototype['asc_enableKeyEvents']                       = asc_docs_api.prototype.asc_enableKeyEvents;
	asc_docs_api.prototype['GenerateStyles']                            = asc_docs_api.prototype.GenerateStyles;
	asc_docs_api.prototype['asyncFontsDocumentEndLoaded']               = asc_docs_api.prototype.asyncFontsDocumentEndLoaded;
	asc_docs_api.prototype['CreateFontsCharMap']                        = asc_docs_api.prototype.CreateFontsCharMap;
	asc_docs_api.prototype['sync_SendThemeColors']                      = asc_docs_api.prototype.sync_SendThemeColors;
	asc_docs_api.prototype['ChangeColorScheme']                         = asc_docs_api.prototype.ChangeColorScheme;
	asc_docs_api.prototype['asyncImagesDocumentEndLoaded']              = asc_docs_api.prototype.asyncImagesDocumentEndLoaded;
	asc_docs_api.prototype['OpenDocumentEndCallback']                   = asc_docs_api.prototype.OpenDocumentEndCallback;
	asc_docs_api.prototype['UpdateInterfaceState']                      = asc_docs_api.prototype.UpdateInterfaceState;
	asc_docs_api.prototype['asyncFontEndLoaded']                        = asc_docs_api.prototype.asyncFontEndLoaded;
	asc_docs_api.prototype['asyncImageEndLoaded']                       = asc_docs_api.prototype.asyncImageEndLoaded;
	asc_docs_api.prototype['asyncImageEndLoadedBackground']             = asc_docs_api.prototype.asyncImageEndLoadedBackground;
	asc_docs_api.prototype['IsAsyncOpenDocumentImages']                 = asc_docs_api.prototype.IsAsyncOpenDocumentImages;
	asc_docs_api.prototype['pre_Paste']                                 = asc_docs_api.prototype.pre_Paste;
	asc_docs_api.prototype['pre_Save']                                  = asc_docs_api.prototype.pre_Save;
	asc_docs_api.prototype['SyncLoadImages']                            = asc_docs_api.prototype.SyncLoadImages;
	asc_docs_api.prototype['SyncLoadImages_callback']                   = asc_docs_api.prototype.SyncLoadImages_callback;
	asc_docs_api.prototype['pre_SaveCallback']                          = asc_docs_api.prototype.pre_SaveCallback;
	asc_docs_api.prototype['initEvents2MobileAdvances']                 = asc_docs_api.prototype.initEvents2MobileAdvances;
	asc_docs_api.prototype['ViewScrollToX']                             = asc_docs_api.prototype.ViewScrollToX;
	asc_docs_api.prototype['ViewScrollToY']                             = asc_docs_api.prototype.ViewScrollToY;
	asc_docs_api.prototype['GetDocWidthPx']                             = asc_docs_api.prototype.GetDocWidthPx;
	asc_docs_api.prototype['GetDocHeightPx']                            = asc_docs_api.prototype.GetDocHeightPx;
	asc_docs_api.prototype['ClearSearch']                               = asc_docs_api.prototype.ClearSearch;
	asc_docs_api.prototype['GetCurrentVisiblePage']                     = asc_docs_api.prototype.GetCurrentVisiblePage;
	asc_docs_api.prototype['asc_setAutoSaveGap']                        = asc_docs_api.prototype.asc_setAutoSaveGap;
	asc_docs_api.prototype['asc_SetDocumentPlaceChangedEnabled']        = asc_docs_api.prototype.asc_SetDocumentPlaceChangedEnabled;
	asc_docs_api.prototype['asc_SetViewRulers']                         = asc_docs_api.prototype.asc_SetViewRulers;
	asc_docs_api.prototype['asc_SetViewRulersChange']                   = asc_docs_api.prototype.asc_SetViewRulersChange;
	asc_docs_api.prototype['asc_GetViewRulers']                         = asc_docs_api.prototype.asc_GetViewRulers;
	asc_docs_api.prototype['asc_SetDocumentUnits']                      = asc_docs_api.prototype.asc_SetDocumentUnits;
	asc_docs_api.prototype['SetMobileVersion']                          = asc_docs_api.prototype.SetMobileVersion;
	asc_docs_api.prototype['GoToHeader']                                = asc_docs_api.prototype.GoToHeader;
	asc_docs_api.prototype['GoToFooter']                                = asc_docs_api.prototype.GoToFooter;
	asc_docs_api.prototype['ExitHeader_Footer']                         = asc_docs_api.prototype.ExitHeader_Footer;
	asc_docs_api.prototype['GetCurrentPixOffsetY']                      = asc_docs_api.prototype.GetCurrentPixOffsetY;
	asc_docs_api.prototype['SetPaintFormat']                            = asc_docs_api.prototype.SetPaintFormat;
	asc_docs_api.prototype['ChangeShapeType']                           = asc_docs_api.prototype.ChangeShapeType;
	asc_docs_api.prototype['sync_PaintFormatCallback']                  = asc_docs_api.prototype.sync_PaintFormatCallback;
	asc_docs_api.prototype['SetMarkerFormat']                           = asc_docs_api.prototype.SetMarkerFormat;
	asc_docs_api.prototype['sync_MarkerFormatCallback']                 = asc_docs_api.prototype.sync_MarkerFormatCallback;
	asc_docs_api.prototype['StartAddShape']                             = asc_docs_api.prototype.StartAddShape;
	asc_docs_api.prototype['AddShapeOnCurrentPage']                     = asc_docs_api.prototype.AddShapeOnCurrentPage;
	asc_docs_api.prototype['AddTextArt']                                = asc_docs_api.prototype.AddTextArt;
	asc_docs_api.prototype['sync_StartAddShapeCallback']                = asc_docs_api.prototype.sync_StartAddShapeCallback;
	asc_docs_api.prototype['CanGroup']                                  = asc_docs_api.prototype.CanGroup;
	asc_docs_api.prototype['CanUnGroup']                                = asc_docs_api.prototype.CanUnGroup;
	asc_docs_api.prototype['CanChangeWrapPolygon']                      = asc_docs_api.prototype.CanChangeWrapPolygon;
	asc_docs_api.prototype['StartChangeWrapPolygon']                    = asc_docs_api.prototype.StartChangeWrapPolygon;
	asc_docs_api.prototype['ClearFormating']                            = asc_docs_api.prototype.ClearFormating;
	asc_docs_api.prototype['GetSectionInfo']                            = asc_docs_api.prototype.GetSectionInfo;
	asc_docs_api.prototype['add_SectionBreak']                          = asc_docs_api.prototype.add_SectionBreak;
	asc_docs_api.prototype['asc_setViewMode']                           = asc_docs_api.prototype.asc_setViewMode;
	asc_docs_api.prototype['SetUseEmbeddedCutFonts']                    = asc_docs_api.prototype.SetUseEmbeddedCutFonts;
	asc_docs_api.prototype['OnMouseUp']                                 = asc_docs_api.prototype.OnMouseUp;
	asc_docs_api.prototype['asyncImageEndLoaded2']                      = asc_docs_api.prototype.asyncImageEndLoaded2;
	asc_docs_api.prototype['SetDrawImagePlaceParagraph']                = asc_docs_api.prototype.SetDrawImagePlaceParagraph;
	asc_docs_api.prototype['asc_getMasterCommentId']                    = asc_docs_api.prototype.asc_getMasterCommentId;
	asc_docs_api.prototype['asc_getAnchorPosition']                     = asc_docs_api.prototype.asc_getAnchorPosition;
	asc_docs_api.prototype['asc_getChartObject']                        = asc_docs_api.prototype.asc_getChartObject;
	asc_docs_api.prototype['asc_addChartDrawingObject']                 = asc_docs_api.prototype.asc_addChartDrawingObject;
	asc_docs_api.prototype['asc_doubleClickOnChart']                    = asc_docs_api.prototype.asc_doubleClickOnChart;
	asc_docs_api.prototype['asc_onCloseChartFrame']                     = asc_docs_api.prototype.asc_onCloseChartFrame;
	asc_docs_api.prototype['asc_editChartDrawingObject']                = asc_docs_api.prototype.asc_editChartDrawingObject;
	asc_docs_api.prototype['asc_getChartPreviews']                      = asc_docs_api.prototype.asc_getChartPreviews;
	asc_docs_api.prototype['asc_getTextArtPreviews']                    = asc_docs_api.prototype.asc_getTextArtPreviews;
	asc_docs_api.prototype['sync_closeChartEditor']                     = asc_docs_api.prototype.sync_closeChartEditor;
	asc_docs_api.prototype['asc_setDrawCollaborationMarks']             = asc_docs_api.prototype.asc_setDrawCollaborationMarks;
	asc_docs_api.prototype['asc_AddMath']                               = asc_docs_api.prototype.asc_AddMath;
	asc_docs_api.prototype['asc_AddMath2']                              = asc_docs_api.prototype.asc_AddMath2;
	asc_docs_api.prototype['asc_AddPageCount']                          = asc_docs_api.prototype.asc_AddPageCount;
	asc_docs_api.prototype['asc_StartMailMerge']                        = asc_docs_api.prototype.asc_StartMailMerge;
	asc_docs_api.prototype['asc_StartMailMergeByList']                  = asc_docs_api.prototype.asc_StartMailMergeByList;
	asc_docs_api.prototype['asc_GetReceptionsCount']                    = asc_docs_api.prototype.asc_GetReceptionsCount;
	asc_docs_api.prototype['asc_GetMailMergeFieldsNameList']            = asc_docs_api.prototype.asc_GetMailMergeFieldsNameList;
	asc_docs_api.prototype['asc_AddMailMergeField']                     = asc_docs_api.prototype.asc_AddMailMergeField;
	asc_docs_api.prototype['asc_SetHighlightMailMergeFields']           = asc_docs_api.prototype.asc_SetHighlightMailMergeFields;
	asc_docs_api.prototype['asc_PreviewMailMergeResult']                = asc_docs_api.prototype.asc_PreviewMailMergeResult;
	asc_docs_api.prototype['asc_EndPreviewMailMergeResult']             = asc_docs_api.prototype.asc_EndPreviewMailMergeResult;
	asc_docs_api.prototype['sync_StartMailMerge']                       = asc_docs_api.prototype.sync_StartMailMerge;
	asc_docs_api.prototype['sync_PreviewMailMergeResult']               = asc_docs_api.prototype.sync_PreviewMailMergeResult;
	asc_docs_api.prototype['sync_EndPreviewMailMergeResult']            = asc_docs_api.prototype.sync_EndPreviewMailMergeResult;
	asc_docs_api.prototype['sync_HighlightMailMergeFields']             = asc_docs_api.prototype.sync_HighlightMailMergeFields;
	asc_docs_api.prototype['asc_getMailMergeData']                      = asc_docs_api.prototype.asc_getMailMergeData;
	asc_docs_api.prototype['asc_setMailMergeData']                      = asc_docs_api.prototype.asc_setMailMergeData;
	asc_docs_api.prototype['asc_sendMailMergeData']                     = asc_docs_api.prototype.asc_sendMailMergeData;
	asc_docs_api.prototype['asc_GetMailMergeFiledValue']                = asc_docs_api.prototype.asc_GetMailMergeFiledValue;
	asc_docs_api.prototype['asc_GetStyleFromFormatting']                = asc_docs_api.prototype.asc_GetStyleFromFormatting;
	asc_docs_api.prototype['asc_AddNewStyle']                           = asc_docs_api.prototype.asc_AddNewStyle;
	asc_docs_api.prototype['asc_RemoveStyle']                           = asc_docs_api.prototype.asc_RemoveStyle;
	asc_docs_api.prototype['asc_RemoveAllCustomStyles']                 = asc_docs_api.prototype.asc_RemoveAllCustomStyles;
	asc_docs_api.prototype['asc_IsStyleDefault']                        = asc_docs_api.prototype.asc_IsStyleDefault;
	asc_docs_api.prototype['asc_IsDefaultStyleChanged']                 = asc_docs_api.prototype.asc_IsDefaultStyleChanged;
	asc_docs_api.prototype['asc_GetStyleNameById']                      = asc_docs_api.prototype.asc_GetStyleNameById;
	asc_docs_api.prototype['asc_SetTrackRevisions']                     = asc_docs_api.prototype.asc_SetTrackRevisions;
	asc_docs_api.prototype['asc_IsTrackRevisions']                      = asc_docs_api.prototype.asc_IsTrackRevisions;
	asc_docs_api.prototype['sync_BeginCatchRevisionsChanges']           = asc_docs_api.prototype.sync_BeginCatchRevisionsChanges;
	asc_docs_api.prototype['sync_EndCatchRevisionsChanges']             = asc_docs_api.prototype.sync_EndCatchRevisionsChanges;
	asc_docs_api.prototype['sync_AddRevisionsChange']                   = asc_docs_api.prototype.sync_AddRevisionsChange;
	asc_docs_api.prototype['asc_AcceptChanges']                         = asc_docs_api.prototype.asc_AcceptChanges;
	asc_docs_api.prototype['asc_RejectChanges']                         = asc_docs_api.prototype.asc_RejectChanges;
	asc_docs_api.prototype['asc_HaveRevisionsChanges']                  = asc_docs_api.prototype.asc_HaveRevisionsChanges;
	asc_docs_api.prototype['asc_HaveNewRevisionsChanges']               = asc_docs_api.prototype.asc_HaveNewRevisionsChanges;
	asc_docs_api.prototype['asc_GetNextRevisionsChange']                = asc_docs_api.prototype.asc_GetNextRevisionsChange;
	asc_docs_api.prototype['asc_GetPrevRevisionsChange']                = asc_docs_api.prototype.asc_GetPrevRevisionsChange;
	asc_docs_api.prototype['sync_UpdateRevisionsChangesPosition']       = asc_docs_api.prototype.sync_UpdateRevisionsChangesPosition;
	asc_docs_api.prototype['asc_AcceptAllChanges']                      = asc_docs_api.prototype.asc_AcceptAllChanges;
	asc_docs_api.prototype['asc_RejectAllChanges']                      = asc_docs_api.prototype.asc_RejectAllChanges;
	asc_docs_api.prototype['asc_stopSaving']                            = asc_docs_api.prototype.asc_stopSaving;
	asc_docs_api.prototype['asc_continueSaving']                        = asc_docs_api.prototype.asc_continueSaving;
	asc_docs_api.prototype['asc_undoAllChanges']                        = asc_docs_api.prototype.asc_undoAllChanges;
	asc_docs_api.prototype['asc_CloseFile']                             = asc_docs_api.prototype.asc_CloseFile;
	asc_docs_api.prototype['asc_addComment']                            = asc_docs_api.prototype.asc_addComment;
	asc_docs_api.prototype['asc_SetFastCollaborative']                  = asc_docs_api.prototype.asc_SetFastCollaborative;
	asc_docs_api.prototype['asc_isOffline']                             = asc_docs_api.prototype.asc_isOffline;
	asc_docs_api.prototype['asc_getUrlType']                            = asc_docs_api.prototype.asc_getUrlType;
	asc_docs_api.prototype["asc_setInterfaceDrawImagePlaceShape"]       = asc_docs_api.prototype.asc_setInterfaceDrawImagePlaceShape;
	asc_docs_api.prototype["asc_pluginsRegister"]                       = asc_docs_api.prototype.asc_pluginsRegister;
	asc_docs_api.prototype["asc_pluginRun"]                             = asc_docs_api.prototype.asc_pluginRun;
	asc_docs_api.prototype["asc_pluginResize"]                          = asc_docs_api.prototype.asc_pluginResize;
	asc_docs_api.prototype["asc_pluginButtonClick"]                     = asc_docs_api.prototype.asc_pluginButtonClick;
	asc_docs_api.prototype["asc_pluginEnableMouseEvents"]         		= asc_docs_api.prototype.asc_pluginEnableMouseEvents;

	asc_docs_api.prototype["asc_nativeInitBuilder"]                     = asc_docs_api.prototype.asc_nativeInitBuilder;
	asc_docs_api.prototype["asc_SetSilentMode"]                         = asc_docs_api.prototype.asc_SetSilentMode;
	asc_docs_api.prototype["asc_addOleObject"]                          = asc_docs_api.prototype.asc_addOleObject;
	asc_docs_api.prototype["asc_editOleObject"]                         = asc_docs_api.prototype.asc_editOleObject;
	asc_docs_api.prototype["asc_startEditCurrentOleObject"]             = asc_docs_api.prototype.asc_startEditCurrentOleObject;
	asc_docs_api.prototype["asc_InputClearKeyboardElement"]             = asc_docs_api.prototype.asc_InputClearKeyboardElement;

	// mobile
	asc_docs_api.prototype["asc_GetDefaultTableStyles"]             	= asc_docs_api.prototype.asc_GetDefaultTableStyles;
	asc_docs_api.prototype["asc_Remove"]             					= asc_docs_api.prototype.asc_Remove;

	CParagraphPropEx.prototype['get_ContextualSpacing'] = CParagraphPropEx.prototype.get_ContextualSpacing;
	CParagraphPropEx.prototype['get_Ind']               = CParagraphPropEx.prototype.get_Ind;
	CParagraphPropEx.prototype['get_Jc']                = CParagraphPropEx.prototype.get_Jc;
	CParagraphPropEx.prototype['get_KeepLines']         = CParagraphPropEx.prototype.get_KeepLines;
	CParagraphPropEx.prototype['get_KeepNext']          = CParagraphPropEx.prototype.get_KeepNext;
	CParagraphPropEx.prototype['get_PageBreakBefore']   = CParagraphPropEx.prototype.get_PageBreakBefore;
	CParagraphPropEx.prototype['get_Spacing']           = CParagraphPropEx.prototype.get_Spacing;
	CParagraphPropEx.prototype['get_Shd']               = CParagraphPropEx.prototype.get_Shd;
	CParagraphPropEx.prototype['get_WidowControl']      = CParagraphPropEx.prototype.get_WidowControl;
	CParagraphPropEx.prototype['get_Tabs']              = CParagraphPropEx.prototype.get_Tabs;
	CTextProp.prototype['get_Bold']                     = CTextProp.prototype.get_Bold;
	CTextProp.prototype['get_Italic']                   = CTextProp.prototype.get_Italic;
	CTextProp.prototype['get_Underline']                = CTextProp.prototype.get_Underline;
	CTextProp.prototype['get_Strikeout']                = CTextProp.prototype.get_Strikeout;
	CTextProp.prototype['get_FontFamily']               = CTextProp.prototype.get_FontFamily;
	CTextProp.prototype['get_FontSize']                 = CTextProp.prototype.get_FontSize;
	CTextProp.prototype['get_Color']                    = CTextProp.prototype.get_Color;
	CTextProp.prototype['get_VertAlign']                = CTextProp.prototype.get_VertAlign;
	CTextProp.prototype['get_HighLight']                = CTextProp.prototype.get_HighLight;
	CTextProp.prototype['get_Spacing']                  = CTextProp.prototype.get_Spacing;
	CTextProp.prototype['get_DStrikeout']               = CTextProp.prototype.get_DStrikeout;
	CTextProp.prototype['get_Caps']                     = CTextProp.prototype.get_Caps;
	CTextProp.prototype['get_SmallCaps']                = CTextProp.prototype.get_SmallCaps;
	CParagraphAndTextProp.prototype['get_ParaPr']       = CParagraphAndTextProp.prototype.get_ParaPr;
	CParagraphAndTextProp.prototype['get_TextPr']       = CParagraphAndTextProp.prototype.get_TextPr;
	CDocInfoProp.prototype['get_PageCount']             = CDocInfoProp.prototype.get_PageCount;
	CDocInfoProp.prototype['put_PageCount']             = CDocInfoProp.prototype.put_PageCount;
	CDocInfoProp.prototype['get_WordsCount']            = CDocInfoProp.prototype.get_WordsCount;
	CDocInfoProp.prototype['put_WordsCount']            = CDocInfoProp.prototype.put_WordsCount;
	CDocInfoProp.prototype['get_ParagraphCount']        = CDocInfoProp.prototype.get_ParagraphCount;
	CDocInfoProp.prototype['put_ParagraphCount']        = CDocInfoProp.prototype.put_ParagraphCount;
	CDocInfoProp.prototype['get_SymbolsCount']          = CDocInfoProp.prototype.get_SymbolsCount;
	CDocInfoProp.prototype['put_SymbolsCount']          = CDocInfoProp.prototype.put_SymbolsCount;
	CDocInfoProp.prototype['get_SymbolsWSCount']        = CDocInfoProp.prototype.get_SymbolsWSCount;
	CDocInfoProp.prototype['put_SymbolsWSCount']        = CDocInfoProp.prototype.put_SymbolsWSCount;
	CHeader.prototype['get_headerText']                 = CHeader.prototype.get_headerText;
	CHeader.prototype['get_pageNumber']                 = CHeader.prototype.get_pageNumber;
	CHeader.prototype['get_X']                          = CHeader.prototype.get_X;
	CHeader.prototype['get_Y']                          = CHeader.prototype.get_Y;
	CHeader.prototype['get_Level']                      = CHeader.prototype.get_Level;
	window['Asc']['CBackground']                        = window['Asc'].CBackground = CBackground;
	CBackground.prototype['get_Color']            = CBackground.prototype.get_Color;
	CBackground.prototype['put_Color']            = CBackground.prototype.put_Color;
	CBackground.prototype['get_Value']            = CBackground.prototype.get_Value;
	CBackground.prototype['put_Value']            = CBackground.prototype.put_Value;
	window['Asc']['CTablePositionH']              = CTablePositionH;
	CTablePositionH.prototype['get_RelativeFrom'] = CTablePositionH.prototype.get_RelativeFrom;
	CTablePositionH.prototype['put_RelativeFrom'] = CTablePositionH.prototype.put_RelativeFrom;
	CTablePositionH.prototype['get_UseAlign']     = CTablePositionH.prototype.get_UseAlign;
	CTablePositionH.prototype['put_UseAlign']     = CTablePositionH.prototype.put_UseAlign;
	CTablePositionH.prototype['get_Align']        = CTablePositionH.prototype.get_Align;
	CTablePositionH.prototype['put_Align']        = CTablePositionH.prototype.put_Align;
	CTablePositionH.prototype['get_Value']        = CTablePositionH.prototype.get_Value;
	CTablePositionH.prototype['put_Value']        = CTablePositionH.prototype.put_Value;
	window['Asc']['CTablePositionV']              = CTablePositionV;
	CTablePositionV.prototype['get_RelativeFrom'] = CTablePositionV.prototype.get_RelativeFrom;
	CTablePositionV.prototype['put_RelativeFrom'] = CTablePositionV.prototype.put_RelativeFrom;
	CTablePositionV.prototype['get_UseAlign']     = CTablePositionV.prototype.get_UseAlign;
	CTablePositionV.prototype['put_UseAlign']     = CTablePositionV.prototype.put_UseAlign;
	CTablePositionV.prototype['get_Align']        = CTablePositionV.prototype.get_Align;
	CTablePositionV.prototype['put_Align']        = CTablePositionV.prototype.put_Align;
	CTablePositionV.prototype['get_Value']        = CTablePositionV.prototype.get_Value;
	CTablePositionV.prototype['put_Value']        = CTablePositionV.prototype.put_Value;
	window['Asc']['CTablePropLook']               = window['Asc'].CTablePropLook = CTablePropLook;
	CTablePropLook.prototype['get_FirstCol'] = CTablePropLook.prototype.get_FirstCol;
	CTablePropLook.prototype['put_FirstCol'] = CTablePropLook.prototype.put_FirstCol;
	CTablePropLook.prototype['get_FirstRow'] = CTablePropLook.prototype.get_FirstRow;
	CTablePropLook.prototype['put_FirstRow'] = CTablePropLook.prototype.put_FirstRow;
	CTablePropLook.prototype['get_LastCol']  = CTablePropLook.prototype.get_LastCol;
	CTablePropLook.prototype['put_LastCol']  = CTablePropLook.prototype.put_LastCol;
	CTablePropLook.prototype['get_LastRow']  = CTablePropLook.prototype.get_LastRow;
	CTablePropLook.prototype['put_LastRow']  = CTablePropLook.prototype.put_LastRow;
	CTablePropLook.prototype['get_BandHor']  = CTablePropLook.prototype.get_BandHor;
	CTablePropLook.prototype['put_BandHor']  = CTablePropLook.prototype.put_BandHor;
	CTablePropLook.prototype['get_BandVer']  = CTablePropLook.prototype.get_BandVer;
	CTablePropLook.prototype['put_BandVer']  = CTablePropLook.prototype.put_BandVer;
	window['Asc']['CTableProp']              = window['Asc'].CTableProp = CTableProp;
	CTableProp.prototype['get_Width']              = CTableProp.prototype.get_Width;
	CTableProp.prototype['put_Width']              = CTableProp.prototype.put_Width;
	CTableProp.prototype['get_Spacing']            = CTableProp.prototype.get_Spacing;
	CTableProp.prototype['put_Spacing']            = CTableProp.prototype.put_Spacing;
	CTableProp.prototype['get_DefaultMargins']     = CTableProp.prototype.get_DefaultMargins;
	CTableProp.prototype['put_DefaultMargins']     = CTableProp.prototype.put_DefaultMargins;
	CTableProp.prototype['get_CellMargins']        = CTableProp.prototype.get_CellMargins;
	CTableProp.prototype['put_CellMargins']        = CTableProp.prototype.put_CellMargins;
	CTableProp.prototype['get_TableAlignment']     = CTableProp.prototype.get_TableAlignment;
	CTableProp.prototype['put_TableAlignment']     = CTableProp.prototype.put_TableAlignment;
	CTableProp.prototype['get_TableIndent']        = CTableProp.prototype.get_TableIndent;
	CTableProp.prototype['put_TableIndent']        = CTableProp.prototype.put_TableIndent;
	CTableProp.prototype['get_TableWrap']          = CTableProp.prototype.get_TableWrap;
	CTableProp.prototype['put_TableWrap']          = CTableProp.prototype.put_TableWrap;
	CTableProp.prototype['get_TablePaddings']      = CTableProp.prototype.get_TablePaddings;
	CTableProp.prototype['put_TablePaddings']      = CTableProp.prototype.put_TablePaddings;
	CTableProp.prototype['get_TableBorders']       = CTableProp.prototype.get_TableBorders;
	CTableProp.prototype['put_TableBorders']       = CTableProp.prototype.put_TableBorders;
	CTableProp.prototype['get_CellBorders']        = CTableProp.prototype.get_CellBorders;
	CTableProp.prototype['put_CellBorders']        = CTableProp.prototype.put_CellBorders;
	CTableProp.prototype['get_TableBackground']    = CTableProp.prototype.get_TableBackground;
	CTableProp.prototype['put_TableBackground']    = CTableProp.prototype.put_TableBackground;
	CTableProp.prototype['get_CellsBackground']    = CTableProp.prototype.get_CellsBackground;
	CTableProp.prototype['put_CellsBackground']    = CTableProp.prototype.put_CellsBackground;
	CTableProp.prototype['get_Position']           = CTableProp.prototype.get_Position;
	CTableProp.prototype['put_Position']           = CTableProp.prototype.put_Position;
	CTableProp.prototype['get_PositionH']          = CTableProp.prototype.get_PositionH;
	CTableProp.prototype['put_PositionH']          = CTableProp.prototype.put_PositionH;
	CTableProp.prototype['get_PositionV']          = CTableProp.prototype.get_PositionV;
	CTableProp.prototype['put_PositionV']          = CTableProp.prototype.put_PositionV;
	CTableProp.prototype['get_Value_X']            = CTableProp.prototype.get_Value_X;
	CTableProp.prototype['get_Value_Y']            = CTableProp.prototype.get_Value_Y;
	CTableProp.prototype['get_ForSelectedCells']   = CTableProp.prototype.get_ForSelectedCells;
	CTableProp.prototype['put_ForSelectedCells']   = CTableProp.prototype.put_ForSelectedCells;
	CTableProp.prototype['put_CellSelect']         = CTableProp.prototype.put_CellSelect;
	CTableProp.prototype['get_CellSelect']         = CTableProp.prototype.get_CellSelect;
	CTableProp.prototype['get_CanBeFlow']          = CTableProp.prototype.get_CanBeFlow;
	CTableProp.prototype['get_RowsInHeader']       = CTableProp.prototype.get_RowsInHeader;
	CTableProp.prototype['put_RowsInHeader']       = CTableProp.prototype.put_RowsInHeader;
	CTableProp.prototype['get_Locked']             = CTableProp.prototype.get_Locked;
	CTableProp.prototype['get_CellsVAlign']        = CTableProp.prototype.get_CellsVAlign;
	CTableProp.prototype['put_CellsVAlign']        = CTableProp.prototype.put_CellsVAlign;
	CTableProp.prototype['get_TableLook']          = CTableProp.prototype.get_TableLook;
	CTableProp.prototype['put_TableLook']          = CTableProp.prototype.put_TableLook;
	CTableProp.prototype['get_TableStyle']         = CTableProp.prototype.get_TableStyle;
	CTableProp.prototype['put_TableStyle']         = CTableProp.prototype.put_TableStyle;
	CTableProp.prototype['get_AllowOverlap']       = CTableProp.prototype.get_AllowOverlap;
	CTableProp.prototype['put_AllowOverlap']       = CTableProp.prototype.put_AllowOverlap;
	CTableProp.prototype['get_TableLayout']        = CTableProp.prototype.get_TableLayout;
	CTableProp.prototype['put_TableLayout']        = CTableProp.prototype.put_TableLayout;
	CTableProp.prototype['get_CellsTextDirection'] = CTableProp.prototype.get_CellsTextDirection;
	CTableProp.prototype['put_CellsTextDirection'] = CTableProp.prototype.put_CellsTextDirection;
	CTableProp.prototype['get_CellsNoWrap']        = CTableProp.prototype.get_CellsNoWrap;
	CTableProp.prototype['put_CellsNoWrap']        = CTableProp.prototype.put_CellsNoWrap;
	CTableProp.prototype['get_CellsWidth']         = CTableProp.prototype.get_CellsWidth;
	CTableProp.prototype['put_CellsWidth']         = CTableProp.prototype.put_CellsWidth;
	CTableProp.prototype['get_PercentFullWidth']   = CTableProp.prototype.get_PercentFullWidth;
	CTableProp.prototype['get_CellsWidthNotEqual'] = CTableProp.prototype.get_CellsWidthNotEqual;
	
	window['Asc']['CBorders']                      = window['Asc'].CBorders = CBorders;
	CBorders.prototype['get_Left']    = CBorders.prototype.get_Left;
	CBorders.prototype['put_Left']    = CBorders.prototype.put_Left;
	CBorders.prototype['get_Top']     = CBorders.prototype.get_Top;
	CBorders.prototype['put_Top']     = CBorders.prototype.put_Top;
	CBorders.prototype['get_Right']   = CBorders.prototype.get_Right;
	CBorders.prototype['put_Right']   = CBorders.prototype.put_Right;
	CBorders.prototype['get_Bottom']  = CBorders.prototype.get_Bottom;
	CBorders.prototype['put_Bottom']  = CBorders.prototype.put_Bottom;
	CBorders.prototype['get_InsideH'] = CBorders.prototype.get_InsideH;
	CBorders.prototype['put_InsideH'] = CBorders.prototype.put_InsideH;
	CBorders.prototype['get_InsideV'] = CBorders.prototype.get_InsideV;
	CBorders.prototype['put_InsideV'] = CBorders.prototype.put_InsideV;
	window['Asc']['CMargins']         = window['Asc'].CMargins = CMargins;
	CMargins.prototype['get_Left']            = CMargins.prototype.get_Left;
	CMargins.prototype['put_Left']            = CMargins.prototype.put_Left;
	CMargins.prototype['get_Right']           = CMargins.prototype.get_Right;
	CMargins.prototype['put_Right']           = CMargins.prototype.put_Right;
	CMargins.prototype['get_Top']             = CMargins.prototype.get_Top;
	CMargins.prototype['put_Top']             = CMargins.prototype.put_Top;
	CMargins.prototype['get_Bottom']          = CMargins.prototype.get_Bottom;
	CMargins.prototype['put_Bottom']          = CMargins.prototype.put_Bottom;
	CMargins.prototype['get_Flag']            = CMargins.prototype.get_Flag;
	CMargins.prototype['put_Flag']            = CMargins.prototype.put_Flag;
	CContextMenuData.prototype['get_Type']    = CContextMenuData.prototype.get_Type;
	CContextMenuData.prototype['get_X']       = CContextMenuData.prototype.get_X;
	CContextMenuData.prototype['get_Y']       = CContextMenuData.prototype.get_Y;
	CContextMenuData.prototype['get_PageNum'] = CContextMenuData.prototype.get_PageNum;
	CContextMenuData.prototype['is_Header']   = CContextMenuData.prototype.is_Header;
	window['Asc']['CHyperlinkProperty']       = window['Asc'].CHyperlinkProperty = CHyperlinkProperty;
	CHyperlinkProperty.prototype['get_Value']             = CHyperlinkProperty.prototype.get_Value;
	CHyperlinkProperty.prototype['put_Value']             = CHyperlinkProperty.prototype.put_Value;
	CHyperlinkProperty.prototype['get_ToolTip']           = CHyperlinkProperty.prototype.get_ToolTip;
	CHyperlinkProperty.prototype['put_ToolTip']           = CHyperlinkProperty.prototype.put_ToolTip;
	CHyperlinkProperty.prototype['get_Text']              = CHyperlinkProperty.prototype.get_Text;
	CHyperlinkProperty.prototype['put_Text']              = CHyperlinkProperty.prototype.put_Text;
	asc_CSpellCheckProperty.prototype['get_Word']         = asc_CSpellCheckProperty.prototype.get_Word;
	asc_CSpellCheckProperty.prototype['get_Checked']      = asc_CSpellCheckProperty.prototype.get_Checked;
	asc_CSpellCheckProperty.prototype['get_Variants']     = asc_CSpellCheckProperty.prototype.get_Variants;
	window['Asc']['asc_CCommentDataWord']                 = asc_CCommentDataWord;
	asc_CCommentDataWord.prototype['asc_getText']         = asc_CCommentDataWord.prototype.asc_getText;
	asc_CCommentDataWord.prototype['asc_putText']         = asc_CCommentDataWord.prototype.asc_putText;
	asc_CCommentDataWord.prototype['asc_getTime']         = asc_CCommentDataWord.prototype.asc_getTime;
	asc_CCommentDataWord.prototype['asc_putTime']         = asc_CCommentDataWord.prototype.asc_putTime;
	asc_CCommentDataWord.prototype['asc_getUserId']       = asc_CCommentDataWord.prototype.asc_getUserId;
	asc_CCommentDataWord.prototype['asc_putUserId']       = asc_CCommentDataWord.prototype.asc_putUserId;
	asc_CCommentDataWord.prototype['asc_getUserName']     = asc_CCommentDataWord.prototype.asc_getUserName;
	asc_CCommentDataWord.prototype['asc_putUserName']     = asc_CCommentDataWord.prototype.asc_putUserName;
	asc_CCommentDataWord.prototype['asc_getQuoteText']    = asc_CCommentDataWord.prototype.asc_getQuoteText;
	asc_CCommentDataWord.prototype['asc_putQuoteText']    = asc_CCommentDataWord.prototype.asc_putQuoteText;
	asc_CCommentDataWord.prototype['asc_getSolved']       = asc_CCommentDataWord.prototype.asc_getSolved;
	asc_CCommentDataWord.prototype['asc_putSolved']       = asc_CCommentDataWord.prototype.asc_putSolved;
	asc_CCommentDataWord.prototype['asc_getReply']        = asc_CCommentDataWord.prototype.asc_getReply;
	asc_CCommentDataWord.prototype['asc_addReply']        = asc_CCommentDataWord.prototype.asc_addReply;
	asc_CCommentDataWord.prototype['asc_getRepliesCount'] = asc_CCommentDataWord.prototype.asc_getRepliesCount;
})(window, window.document);
