"use strict";

function CAscSection()
{
    this.PageWidth = 0;
    this.PageHeight = 0;

    this.MarginLeft = 0;
    this.MarginRight = 0;
    this.MarginTop = 0;
    this.MarginBottom = 0;
}
CAscSection.prototype.get_PageWidth = function() { return this.PageWidth; };
CAscSection.prototype.get_PageHeight = function() { return this.PageHeight; };
CAscSection.prototype.get_MarginLeft = function() { return this.MarginLeft; };
CAscSection.prototype.get_MarginRight = function() { return this.MarginRight; };
CAscSection.prototype.get_MarginTop = function() { return this.MarginTop; };
CAscSection.prototype.get_MarginBottom = function() { return this.MarginBottom; };

function CImagePositionH(obj)
{
    if ( obj )
    {
        this.RelativeFrom = ( undefined === obj.RelativeFrom ) ? undefined : obj.RelativeFrom;
        this.UseAlign     = ( undefined === obj.UseAlign     ) ? undefined : obj.UseAlign;
        this.Align        = ( undefined === obj.Align        ) ? undefined : obj.Align;
        this.Value        = ( undefined === obj.Value        ) ? undefined : obj.Value;
    }
    else
    {
        this.RelativeFrom = undefined;
        this.UseAlign     = undefined;
        this.Align        = undefined;
        this.Value        = undefined;
    }
}

CImagePositionH.prototype.get_RelativeFrom = function()  { return this.RelativeFrom; };
CImagePositionH.prototype.put_RelativeFrom = function(v) { this.RelativeFrom = v; };
CImagePositionH.prototype.get_UseAlign = function()  { return this.UseAlign; };
CImagePositionH.prototype.put_UseAlign = function(v) { this.UseAlign = v; };
CImagePositionH.prototype.get_Align = function()  { return this.Align; };
CImagePositionH.prototype.put_Align = function(v) { this.Align = v; };
CImagePositionH.prototype.get_Value = function()  { return this.Value; };
CImagePositionH.prototype.put_Value = function(v) { this.Value = v; };

function CImagePositionV(obj)
{
    if ( obj )
    {
        this.RelativeFrom = ( undefined === obj.RelativeFrom ) ? undefined : obj.RelativeFrom;
        this.UseAlign     = ( undefined === obj.UseAlign     ) ? undefined : obj.UseAlign;
        this.Align        = ( undefined === obj.Align        ) ? undefined : obj.Align;
        this.Value        = ( undefined === obj.Value        ) ? undefined : obj.Value;
    }
    else
    {
        this.RelativeFrom = undefined;
        this.UseAlign     = undefined;
        this.Align        = undefined;
        this.Value        = undefined;
    }
}

CImagePositionV.prototype.get_RelativeFrom = function()  { return this.RelativeFrom; };
CImagePositionV.prototype.put_RelativeFrom = function(v) { this.RelativeFrom = v; };
CImagePositionV.prototype.get_UseAlign = function()  { return this.UseAlign; };
CImagePositionV.prototype.put_UseAlign = function(v) { this.UseAlign = v; };
CImagePositionV.prototype.get_Align = function()  { return this.Align; };
CImagePositionV.prototype.put_Align = function(v) { this.Align = v; };
CImagePositionV.prototype.get_Value = function()  { return this.Value; };
CImagePositionV.prototype.put_Value = function(v) { this.Value = v; };

function CPosition( obj )
{
	if (obj)
	{
		this.X = (undefined == obj.X) ? null : obj.X;
		this.Y = (undefined == obj.Y) ? null : obj.Y;
	}
	else
	{
		this.X = null;
		this.Y = null;
	}
}
CPosition.prototype.get_X = function() { return this.X; };
CPosition.prototype.put_X = function(v) { this.X = v; };
CPosition.prototype.get_Y = function() { return this.Y; };
CPosition.prototype.put_Y = function(v) { this.Y = v; };






function CHeaderProp( obj )
{
	/*{
		Type : hdrftr_Footer (hdrftr_Header),
		Position : 12.5,
		DifferentFirst : true/false,
		DifferentEvenOdd : true/false,
	}*/
	if( obj )
	{
		this.Type = (undefined != obj.Type) ? obj.Type: null;
		this.Position = (undefined != obj.Position) ? obj.Position : null;
		this.DifferentFirst = (undefined != obj.DifferentFirst) ? obj.DifferentFirst : null;
		this.DifferentEvenOdd = (undefined != obj.DifferentEvenOdd) ? obj.DifferentEvenOdd : null;
        this.LinkToPrevious   = (undefined != obj.LinkToPrevious)   ? obj.LinkToPrevious   : null;
        this.Locked = (undefined != obj.Locked) ? obj.Locked : false;
	}
	else
	{
		this.Type = hdrftr_Footer;
		this.Position = 12.5;
		this.DifferentFirst = false;
		this.DifferentEvenOdd = false;
        this.LinkToPrevious   = null;
        this.Locked = false;
	}
}

CHeaderProp.prototype.get_Type = function(){ return this.Type; };
CHeaderProp.prototype.put_Type = function(v){ this.Type = v; };
CHeaderProp.prototype.get_Position = function(){ return this.Position; };
CHeaderProp.prototype.put_Position = function(v){ this.Position = v; };
CHeaderProp.prototype.get_DifferentFirst = function(){ return this.DifferentFirst; };
CHeaderProp.prototype.put_DifferentFirst = function(v){ this.DifferentFirst = v; };
CHeaderProp.prototype.get_DifferentEvenOdd = function(){ return this.DifferentEvenOdd; };
CHeaderProp.prototype.put_DifferentEvenOdd = function(v){ this.DifferentEvenOdd = v; };
CHeaderProp.prototype.get_LinkToPrevious = function() { return this.LinkToPrevious; };
CHeaderProp.prototype.get_Locked = function() { return this.Locked; };


// [!dirty hack for minimizer - don't delete this comment!] function CStylesPainter ()
// [!dirty hack for minimizer - don't delete this comment!] function CFont ()
CStylesPainter.prototype.get_DefaultStylesImage = function() { return this.defaultStylesImage; };
CStylesPainter.prototype.get_DocStylesImage = function() { return this.docStylesImage; };
CStylesPainter.prototype.get_MergedStyles = function() { return this.mergedStyles; };
CStylesPainter.prototype.get_STYLE_THUMBNAIL_WIDTH = function() { return this.STYLE_THUMBNAIL_WIDTH; };
CStylesPainter.prototype.get_STYLE_THUMBNAIL_HEIGHT = function() { return this.STYLE_THUMBNAIL_HEIGHT; };
CStylesPainter.prototype.get_IsRetinaEnabled = function() { return this.IsRetinaEnabled; };

CFont.prototype.asc_getFontId = function() { return this.id; };
CFont.prototype.asc_getFontName = function() { return this.name; };
CFont.prototype.asc_getFontThumbnail = function() { return this.thumbnail; };
CFont.prototype.asc_getFontType = function() { return this.type; };

var DocumentPageSize = new function() {
    this.oSizes = [{name:"US Letter", w_mm: 215.9, h_mm: 279.4, w_tw: 12240, h_tw: 15840},
        {name:"US Legal", w_mm: 215.9, h_mm: 355.6, w_tw: 12240, h_tw: 20160},
        {name:"A4", w_mm: 210, h_mm: 297, w_tw: 11907, h_tw: 16839},
        {name:"A5", w_mm: 148.1, h_mm: 209.9, w_tw: 8391, h_tw: 11907},
        {name:"B5", w_mm: 176, h_mm: 250.1, w_tw: 9979, h_tw: 14175},
        {name:"Envelope #10", w_mm: 104.8, h_mm: 241.3, w_tw: 5940, h_tw: 13680},
        {name:"Envelope DL", w_mm: 110.1, h_mm: 220.1, w_tw: 6237, h_tw: 12474},
        {name:"Tabloid", w_mm: 279.4, h_mm: 431.7, w_tw: 15842, h_tw: 24477},
        {name:"A3", w_mm: 297, h_mm: 420.1, w_tw: 16840, h_tw: 23820},
        {name:"Tabloid Oversize", w_mm: 304.8, h_mm: 457.1, w_tw: 17282, h_tw: 25918},
        {name:"ROC 16K", w_mm: 196.8, h_mm: 273, w_tw: 11164, h_tw: 15485},
        {name:"Envelope Coukei 3", w_mm: 119.9, h_mm: 234.9, w_tw: 6798, h_tw: 13319},
        {name:"Super B/A3", w_mm: 330.2, h_mm: 482.5, w_tw: 18722, h_tw: 27358}
    ];
    this.sizeEpsMM = 0.5;
    this.getSize = function(widthMm, heightMm)
    {
        for( var index in this.oSizes)
        {
            var item = this.oSizes[index];
            if(Math.abs(widthMm - item.w_mm) < this.sizeEpsMM && Math.abs(heightMm - item.h_mm) < this.sizeEpsMM)
                return item;
        }
        return {w_mm: widthMm, h_mm: heightMm};
    };
};

function CMailMergeSendData (obj){
	if(obj){
		if (typeof obj.from != 'undefined'){
			this["from"] = obj.from;
		}
		if (typeof obj.to != 'undefined'){
			this["to"] = obj.to;
		}
		if (typeof obj.subject != 'undefined'){
			this["subject"] = obj.subject;
		}
		if (typeof obj.mailFormat != 'undefined'){
			this["mailFormat"] = obj.mailFormat;
		}
		if (typeof obj.fileName != 'undefined'){
			this["fileName"] = obj.fileName;
		}
		if (typeof obj.message != 'undefined'){
			this["message"] = obj.message;
		}
		if (typeof obj.recordFrom != 'undefined'){
			this["recordFrom"] = obj.recordFrom;
		}
		if (typeof obj.recordTo != 'undefined'){
			this["recordTo"] = obj.recordTo;
		}
	}
	else
    {
		this["from"] = null;
		this["to"] = null;
		this["subject"] = null;
		this["mailFormat"] = null;
		this["fileName"] = null;
		this["message"] = null;
		this["recordFrom"] = null;
		this["recordTo"] = null;
		this["recordCount"] = null;
		this["userId"] = null;
	}
}
CMailMergeSendData.prototype.get_From = function(){return this["from"]};
CMailMergeSendData.prototype.put_From = function(v){this["from"] = v;};
CMailMergeSendData.prototype.get_To = function(){return this["to"]};
CMailMergeSendData.prototype.put_To = function(v){this["to"] = v;};
CMailMergeSendData.prototype.get_Subject = function(){return this["subject"]};
CMailMergeSendData.prototype.put_Subject = function(v){this["subject"] = v;};
CMailMergeSendData.prototype.get_MailFormat = function(){return this["mailFormat"]};
CMailMergeSendData.prototype.put_MailFormat = function(v){this["mailFormat"] = v;};
CMailMergeSendData.prototype.get_FileName = function(){return this["fileName"]};
CMailMergeSendData.prototype.put_FileName = function(v){this["fileName"] = v;};
CMailMergeSendData.prototype.get_Message = function(){return this["message"]};
CMailMergeSendData.prototype.put_Message = function(v){this["message"] = v;};
CMailMergeSendData.prototype.get_RecordFrom = function(){return this["recordFrom"]};
CMailMergeSendData.prototype.put_RecordFrom = function(v){this["recordFrom"] = v;};
CMailMergeSendData.prototype.get_RecordTo = function(){return this["recordTo"]};
CMailMergeSendData.prototype.put_RecordTo = function(v){this["recordTo"] = v;};
CMailMergeSendData.prototype.get_RecordCount = function(){return this["recordCount"]};
CMailMergeSendData.prototype.put_RecordCount = function(v){this["recordCount"] = v;};
CMailMergeSendData.prototype.get_UserId = function(){return this["userId"]};
CMailMergeSendData.prototype.put_UserId = function(v){this["userId"] = v;};

// пользоваться так:
// подрубить его последним из скриптов к страничке
// и вызвать, после подгрузки (конец метода OnInit <- Drawing/HtmlPage.js)
// var _api = new asc_docs_api();
// _api.init(oWordControl);

/**
 *
 * @param name
 * @constructor
 * @extends {baseEditorsApi}
 */
function asc_docs_api(name)
{
  asc_docs_api.superclass.constructor.call(this, name);
  this.editorId = c_oEditorId.Word;

    if (window["AscDesktopEditor"])
    {
        window["AscDesktopEditor"]["CreateEditorApi"]();
    }

    var CSpellCheckApi  = window["CSpellCheckApi"];

    History    = new CHistory();
    g_oTableId = new CTableId();

	/************ private!!! **************/
    this.WordControl = new CEditorPage(this);
    this.WordControl.Name = this.HtmlElementName;

  this.documentFormatSave = c_oAscFileType.DOCX;

	//todo убрать из native, copypaste, chart, loadfont
	this.InterfaceLocale = null;
        
    this.ShowParaMarks = false;
    this.ShowSnapLines = true;
	this.isAddSpaceBetweenPrg = false;
    this.isPageBreakBefore = false;
    this.isKeepLinesTogether = false;

    this.isPaintFormat = c_oAscFormatPainterState.kOff;
    this.isMarkerFormat = false;
    this.isViewMode = false;
    this.isStartAddShape = false;
    this.addShapePreset = "";
    this.isShowTableEmptyLine = true;
    this.isShowTableEmptyLineAttack = false;

    this.isApplyChangesOnOpen = false;
    this.isApplyChangesOnOpenEnabled = true;
	
	this.IsSpellCheckCurrentWord = false;

	this.mailMergeFileData = null;

  this.isCoMarksDraw = false;

	// Spell Checking
	this.SpellCheckApi = (window["AscDesktopEditor"] === undefined) ? new CSpellCheckApi() : new CSpellCheckApi_desktop();
	this.isSpellCheckEnable = true;

    // это чтобы сразу показать ридер, без возможности вернуться в редактор/вьюер
    this.isOnlyReaderMode = false;
	
    /**************************************/

    this.bInit_word_control = false;
	this.isDocumentModify = false;

    this.isImageChangeUrl = false;
    this.isShapeImageChangeUrl = false;

    this.FontAsyncLoadType = 0;
    this.FontAsyncLoadParam = null;
	
    this.isPasteFonts_Images = false;
    this.isLoadNoCutFonts = false;

    this.pasteCallback = null;
    this.pasteImageMap = null;
    this.EndActionLoadImages = 0;

    this.isSaveFonts_Images = false;
    this.saveImageMap = null;

    this.isLoadImagesCustom = false;
    this.loadCustomImageMap = null;

    this.ServerImagesWaitComplete = false;

    this.DocumentOrientation = orientation_Portrait ? true : false;

    this.SelectedObjectsStack = [];

    this.nCurPointItemsLength = 0;
	this.isDocumentEditor = true;

    this.CurrentTranslate = translations_map["en"];

    this.CollaborativeMarksShowType = c_oAscCollaborativeMarksShowType.All;

    // объекты, нужные для отправки в тулбар (шрифты, стили)
    this._gui_control_colors = null;
    this._gui_color_schemes = null;

    //window["USE_FONTS_WIN_PARAMS"] = true;

    //выставляем тип copypaste
    g_bIsDocumentCopyPaste = true;
    this.DocumentReaderMode = null;

    this.ParcedDocument = false;
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
}
asc.extendClass(asc_docs_api, baseEditorsApi);

asc_docs_api.prototype.sendEvent = function() {
  this.asc_fireCallback.apply(this, arguments);
};

asc_docs_api.prototype.LoadFontsFromServer = function(_fonts)
{
    if (undefined === _fonts)
        _fonts = ["Arial","Symbol","Wingdings","Courier New","Times New Roman"];
    this.FontLoader.LoadFontsFromServer(_fonts);
};

asc_docs_api.prototype.SetCollaborativeMarksShowType = function(Type)
{
    if (c_oAscCollaborativeMarksShowType.None !== this.CollaborativeMarksShowType && c_oAscCollaborativeMarksShowType.None === Type && this.WordControl && this.WordControl.m_oLogicDocument)
    {
        this.CollaborativeMarksShowType = Type;
        CollaborativeEditing.Clear_CollaborativeMarks(true);
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
    CollaborativeEditing.Clear_CollaborativeMarks(true);
};

asc_docs_api.prototype.SetLanguage = function(langId)
{
    langId = langId.toLowerCase();
    if (undefined !== translations_map[langId])
        this.CurrentTranslate = translations_map[langId];
};

asc_docs_api.prototype.TranslateStyleName = function(style_name)
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

    if (true !== CollaborativeEditing.Is_Fast() || true === CollaborativeEditing.Is_SingleUser())
        this.asc_fireCallback("asc_onDocumentModifiedChanged");

    if (undefined !== window["AscDesktopEditor"])
    {
        window["AscDesktopEditor"]["onDocumentModifiedChanged"](bValue);
    }
};

asc_docs_api.prototype.isDocumentModified = function()
{
	if (!this.canSave) {
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
asc_docs_api.prototype.sync_EndCatchSelectedElements = function()
{
    if (this.WordControl && this.WordControl.m_oDrawingDocument)
        this.WordControl.m_oDrawingDocument.EndTableStylesCheck();

    this.asc_fireCallback("asc_onFocusObject", this.SelectedObjectsStack);
};
asc_docs_api.prototype.getSelectedElements = function(bUpdate)
{
    if ( true === bUpdate )
        this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();

    return this.SelectedObjectsStack;
};
asc_docs_api.prototype.sync_ChangeLastSelectedElement = function(type, obj)
{			
	var oUnkTypeObj = null;
			
	switch( type )
	{
		case c_oAscTypeSelectElement.Paragraph: oUnkTypeObj = new asc_CParagraphProperty( obj );
			break;
		case c_oAscTypeSelectElement.Image: oUnkTypeObj = new asc_CImgProperty( obj );
			break;
		case c_oAscTypeSelectElement.Table: oUnkTypeObj = new CTableProp( obj );
			break;
		case c_oAscTypeSelectElement.Header: oUnkTypeObj = new CHeaderProp( obj );
			break;
	}
			
    var _i = this.SelectedObjectsStack.length - 1;
    var bIsFound = false;
    while (_i >= 0)
    {
        if (this.SelectedObjectsStack[_i].Type == type)
        {

            this.SelectedObjectsStack[_i].Value = oUnkTypeObj;
            bIsFound = true;
            break;
        }
        _i--;
    }

    if (!bIsFound)
    {
        this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject( type, oUnkTypeObj );
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
asc_docs_api.prototype.LoadDocument = function(isVersionHistory) {
  this.asc_LoadDocument(isVersionHistory);
};

asc_docs_api.prototype.SetTextBoxInputMode = function(bIsEA)
{
    this.WordControl.SetTextBoxMode(bIsEA);
};
asc_docs_api.prototype.GetTextBoxInputMode = function()
{
    return this.WordControl.TextBoxInputMode;
};

asc_docs_api.prototype.ChangeReaderMode = function()
{
    return this.WordControl.ChangeReaderMode();
};
asc_docs_api.prototype.SetReaderModeOnly = function()
{
    this.isOnlyReaderMode = true;
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
        GlobalSkin = GlobalSkinFlat;
    }

    var _head = document.getElementsByTagName('head')[0];

    var style0 = document.createElement('style');
    style0.type = 'text/css';
    style0.innerHTML = ".block_elem { position:absolute;padding:0;margin:0; }";
    _head.appendChild(style0);

    var style2 = document.createElement('style');
    style2.type = 'text/css';
    style2.innerHTML = ".buttonRuler {\
background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAwCAYAAAAYX/pXAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTAw9HKhAAABhElEQVRIS62Uwa6CMBBF/VQNQcOCBS5caOICApEt3+Wv+AcmfQ7pbdreqY+CJifTdjpng727aZrMFmbB+/3erYEE+/3egMPhMPP57QR/EJCgKAoTs1hQlqURjsdjAESyPp1O7pwEVVWZ1+s1VyB7DemRoK5rN+CvNaRPgqZpgqHz+UwSnEklweVyCQbivX8mlQTX65UGfG63m+vLXRLc7/ekQHoAexK0bWs0uq5TKwli8Afq+94Mw+CQPe78K5D6eDzMOI4GVcCdr4IlOMEWfiP4fJpVkEDLA38ghgR+DgB/ICYQ5OYBCez7d1mAvQZ6gcBmAK010A8ENg8c9u2rZ6iBwL51R7z3z1ADgc2DJDYPZnA3ENi3rhLlgauBAO8/JpUHJEih5QF6iwRaHqC3SPANJ9jCbwTP53MVJNDywB+IIYGfA8AfiAkEqTyQDEAO+HlAgtw8IEFuHpAgNw9IkJsHJMjNAxLk5gEJ8P5jUnlAghRaHqC3SKDlAXqLBN9wgvVM5g/dFuEU6U2wnAAAAABJRU5ErkJggg==);\
background-position: 0px 0px;\
background-repeat: no-repeat;\
}";
    _head.appendChild(style2);

    var style3 = document.createElement('style');
    style3.type = 'text/css';
    style3.innerHTML = ".buttonPrevPage {\
background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAABgBAMAAADm/++TAAAABGdBTUEAALGPC/xhBQAAABJQTFRFAAAA////UVNVu77Cenp62Nrc3x8hMQAAAAF0Uk5TAEDm2GYAAABySURBVCjPY2AgETDBGEoKUAElJcJSxANjKGAwDQWDYAKMIBhDSRXCCFJSIixF0GS4M+AMExcwcCbAcIQxBEUgDEdBQcJSBE2GO4PU6IJHASxS4NGER4p28YWIAlikwKMJjxTt4gsRBbBIgUcTHini4wsAwMmIvYZODL0AAAAASUVORK5CYII=);\
background-position: 0px 0px;\
background-repeat: no-repeat;\
}";
    _head.appendChild(style3);

    var style4 = document.createElement('style');
    style4.type = 'text/css';
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
    this.HtmlElement.innerHTML = "<div id=\"id_main\" class=\"block_elem\" style=\"-moz-user-select:none;-khtml-user-select:none;user-select:none;background-color:" + GlobalSkin.BackgroundColor + ";overflow:hidden;\" UNSELECTABLE=\"on\">\
								<div id=\"id_panel_left\" class=\"block_elem\">\
									<canvas id=\"id_buttonTabs\" class=\"block_elem\"></canvas>\
									<canvas id=\"id_vert_ruler\" class=\"block_elem\"></canvas>\
								</div>\
									<div id=\"id_panel_top\" class=\"block_elem\">\
									<canvas id=\"id_hor_ruler\" class=\"block_elem\"></canvas>\
									</div>\
                                    <div id=\"id_main_view\" class=\"block_elem\" style=\"overflow:hidden\">\
                                        <canvas id=\"id_viewer\" class=\"block_elem\" style=\"-webkit-user-select: none; background-color:" + GlobalSkin.BackgroundColor + ";z-index:1\"></canvas>\
									    <canvas id=\"id_viewer_overlay\" class=\"block_elem\" style=\"-webkit-user-select: none; z-index:2\"></canvas>\
									    <canvas id=\"id_target_cursor\" class=\"block_elem\" width=\"1\" height=\"1\" style=\"-webkit-user-select: none;width:2px;height:13px;display:none;z-index:3;\"></canvas>\
                                    </div>\
								</div>\
									<div id=\"id_panel_right\" class=\"block_elem\" style=\"margin-right:1px;background-color:" + GlobalSkin.BackgroundScroll + ";\">\
									<div id=\"id_buttonRulers\" class=\"block_elem buttonRuler\"></div>\
									<div id=\"id_vertical_scroll\" style=\"left:0;top:0px;width:14px;overflow:hidden;position:absolute;\">\
									<div id=\"panel_right_scroll\" class=\"block_elem\" style=\"left:0;top:0;width:1px;height:6000px;\"></div>\
									</div>\
									<div id=\"id_buttonPrevPage\" class=\"block_elem buttonPrevPage\"></div>\
									<div id=\"id_buttonNextPage\" class=\"block_elem buttonNextPage\"></div>\
								</div>\
									<div id=\"id_horscrollpanel\" class=\"block_elem\" style=\"margin-bottom:1px;background-color:" + GlobalSkin.BackgroundScroll + ";\">\
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
    this.DocumentReaderMode = new CDocumentReaderMode();
    var _old = copyPasteUseBinary;
    copyPasteUseBinary = false;
    this.WordControl.m_oLogicDocument.Select_All();
    Editor_Copy(this);
    this.WordControl.m_oLogicDocument.Selection_Remove();
    copyPasteUseBinary = _old;
    this.DocumentReaderMode = null;
    return document.getElementById("SelectId").innerHTML;
};

asc_docs_api.prototype.InitEditor = function()
{
    this.WordControl.m_oLogicDocument   = new CDocument(this.WordControl.m_oDrawingDocument);
    this.WordControl.m_oDrawingDocument.m_oLogicDocument = this.WordControl.m_oLogicDocument;
	if (!this.isSpellCheckEnable)
		this.WordControl.m_oLogicDocument.TurnOff_CheckSpelling();

    if (this.WordControl.MobileTouchManager)
        this.WordControl.MobileTouchManager.LogicDocument = this.WordControl.m_oLogicDocument;
};

asc_docs_api.prototype.SetInterfaceDrawImagePlaceShape = function(div_id)
{
    this.WordControl.m_oDrawingDocument.InitGuiCanvasShape(div_id);
};

asc_docs_api.prototype.InitViewer = function()
{
    this.WordControl.m_oDrawingDocument.m_oDocumentRenderer = new CDocMeta();
};

asc_docs_api.prototype.OpenDocument = function(url, gObject)
{
    this.isOnlyReaderMode = false;
    this.InitViewer();
    this.LoadedObject = null;
    this.DocumentType = 1;
    this.ServerIdWaitComplete = true;

    this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);

    this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.Load(url, gObject);
    this.FontLoader.LoadDocumentFonts(this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.Fonts, true);
};

asc_docs_api.prototype.OpenDocument2 = function(url, gObject)
{
	this.InitEditor();
	this.DocumentType = 2;
	this.LoadedObjectDS = Common_CopyObj(this.WordControl.m_oLogicDocument.Get_Styles().Style);

	g_oIdCounter.Set_Load(true);

	var openParams = {checkFileSize: this.isMobileVersion, charCount: 0, parCount: 0};
	var oBinaryFileReader = new BinaryFileReader(this.WordControl.m_oLogicDocument, openParams);
	if(oBinaryFileReader.Read(gObject))
	{
        if (History && History.Update_FileDescription)
            History.Update_FileDescription(oBinaryFileReader.stream);

        g_oIdCounter.Set_Load(false);
		this.LoadedObject = 1;

		this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);

		// проверяем какие шрифты нужны
		this.WordControl.m_oDrawingDocument.CheckFontNeeds();
		window.global_pptx_content_loader.CheckImagesNeeds(this.WordControl.m_oLogicDocument);

		//this.FontLoader.LoadEmbeddedFonts(this.DocumentUrl, this.WordControl.m_oLogicDocument.EmbeddedFonts);
		this.FontLoader.LoadDocumentFonts(this.WordControl.m_oLogicDocument.Fonts, false);
	}
	else
		editor.asc_fireCallback("asc_onError",c_oAscError.ID.MobileUnexpectedCharCount,c_oAscError.Level.Critical);
    
	//callback
	editor.DocumentOrientation = (null == editor.WordControl.m_oLogicDocument) ? true : !editor.WordControl.m_oLogicDocument.Orientation;
	var sizeMM;
	if(editor.DocumentOrientation)
		sizeMM = DocumentPageSize.getSize(Page_Width, Page_Height);
	else
		sizeMM = DocumentPageSize.getSize(Page_Height, Page_Width);
	editor.sync_DocSizeCallback(sizeMM.w_mm, sizeMM.h_mm);
	editor.sync_PageOrientCallback(editor.get_DocumentOrientation());
							
    this.ParcedDocument = true;
	if (this.isStartCoAuthoringOnEndLoad) {
		this.CoAuthoringApi.onStartCoAuthoring(true);
		this.isStartCoAuthoringOnEndLoad = false;
	}

    if (this.isMobileVersion)
    {
        window.USER_AGENT_SAFARI_MACOS = false;
        PASTE_ELEMENT_ID = "wrd_pastebin";
        ELEMENT_DISPAY_STYLE = "none";
    }

    if (window.USER_AGENT_SAFARI_MACOS)
        setInterval(SafariIntervalFocus, 10);
};
// Callbacks
/* все имена callback'оф начинаются с On. Пока сделаны:
	OnBold,
	OnItalic,
	OnUnderline,
	OnTextPrBaseline(возвращается расположение строки - supstring, superstring, baseline),
	OnPrAlign(выравнивание по ширине, правому краю, левому краю, по центру),
	OnListType( возвращается asc_CListType )

	фейк-функции ожидающие TODO:
	Print,Undo,Redo,Copy,Cut,Paste,Share,Save,Download & callbacks
	OnFontName, OnFontSize, OnLineSpacing

	OnFocusObject( возвращается массив asc_CSelectedObject )
	OnInitEditorStyles( возвращается CStylesPainter )
	OnSearchFound( возвращается CSearchResult );
	OnParaSpacingLine( возвращается asc_CParagraphSpacing )
	OnLineSpacing( не используется? )
	OnTextColor( возвращается CColor )
	OnTextHightLight( возвращается CColor )
	OnInitEditorFonts( возвращается массив объектов СFont )
	OnFontFamily( возвращается asc_CTextFontFamily )
*/
var _callbacks = {};

asc_docs_api.prototype.asc_registerCallback = function(name, callback) {
	if (!_callbacks.hasOwnProperty(name))
		_callbacks[name] = [];
	_callbacks[name].push(callback);
};

asc_docs_api.prototype.asc_unregisterCallback = function(name, callback) {
	if (_callbacks.hasOwnProperty(name)) {
		for (var i = _callbacks[name].length - 1; i >= 0 ; --i) {
			if (_callbacks[name][i] == callback)
				_callbacks[name].splice(i, 1);
		}
	}
};

asc_docs_api.prototype.asc_fireCallback = function(name) {
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

asc_docs_api.prototype.asc_checkNeedCallback = function(name) {
    if (_callbacks.hasOwnProperty(name))
    {
        return true;
    }
    return false;
};

// тут методы, замены евентов
asc_docs_api.prototype.get_PropertyEditorShapes = function()
{
    var ret = [g_oAutoShapesGroups, g_oAutoShapesTypes];
    return ret;
};
asc_docs_api.prototype.get_PropertyEditorTextArts = function()
{
    var ret = [g_oPresetTxWarpGroups, g_PresetTxWarpTypes];
    return ret;
};
asc_docs_api.prototype.get_PropertyStandartTextures = function()
{
    var _count = g_oUserTexturePresets.length;
    var arr = new Array(_count);
    for (var i = 0; i < _count; ++i)
    {
        arr[i] = new asc_CTexture();
        arr[i].Id = i;
        arr[i].Image = g_oUserTexturePresets[i];
    }
    return arr;
};
asc_docs_api.prototype.get_PropertyThemeColors = function()
{
    var _ret = [this._gui_control_colors.Colors, this._gui_control_colors.StandartColors];
    return _ret;
};
asc_docs_api.prototype.get_PropertyThemeColorSchemes = function()
{
    return this._gui_color_schemes;
};
// -------

/////////////////////////////////////////////////////////////////////////
///////////////////CoAuthoring and Chat api//////////////////////////////
/////////////////////////////////////////////////////////////////////////
// Init CoAuthoring
asc_docs_api.prototype._coAuthoringSetChange = function(change, oColor)
{
	var oChange = new CCollaborativeChanges();
	oChange.Set_Data( change );
	oChange.Set_Color( oColor );
	CollaborativeEditing.Add_Changes( oChange );
};

asc_docs_api.prototype._coAuthoringSetChanges = function(e, oColor)
{
	var Count = e.length;
	for (var Index = 0; Index < Count; ++Index)
		this._coAuthoringSetChange(e[Index], oColor);
};

asc_docs_api.prototype._coAuthoringInitEnd = function() {
  var t = this;
  this.CoAuthoringApi.onCursor = function(e) {
    if (true === CollaborativeEditing.Is_Fast()) {
      t.WordControl.m_oLogicDocument.Update_ForeignCursor(e[e.length - 1]['cursor'], e[e.length - 1]['user'], true);
    }
  };
  this.CoAuthoringApi.onConnectionStateChanged = function(e) {
    if (true === CollaborativeEditing.Is_Fast() && false === e['state']) {
      editor.WordControl.m_oLogicDocument.Remove_ForeignCursor(e['id']);
    }
    t.asc_fireCallback("asc_onConnectionStateChanged", e);
  };
  this.CoAuthoringApi.onLocksAcquired = function(e) {
    if (t.isApplyChangesOnOpenEnabled) {
      // Пока документ еще не загружен, будем сохранять функцию и аргументы
      t.arrPreOpenLocksObjects.push(function() {
        t.CoAuthoringApi.onLocksAcquired(e);
      });
      return;
    }

    if (2 != e["state"]) {
      var Id = e["block"];
      var Class = g_oTableId.Get_ById(Id);
      if (null != Class) {
        var Lock = Class.Lock;

        var OldType = Class.Lock.Get_Type();
        if (locktype_Other2 === OldType || locktype_Other3 === OldType) {
          Lock.Set_Type(locktype_Other3, true);
        } else {
          Lock.Set_Type(locktype_Other, true);
        }

        // Выставляем ID пользователя, залочившего данный элемент
        Lock.Set_UserId(e["user"]);

        if (Class instanceof CHeaderFooterController) {
          editor.sync_LockHeaderFooters();
        } else if (Class instanceof CDocument) {
          editor.sync_LockDocumentProps();
        } else if (Class instanceof CComment) {
          editor.sync_LockComment(Class.Get_Id(), e["user"]);
        } else if (Class instanceof CGraphicObjects) {
          editor.sync_LockDocumentSchema();
        }

        // Теперь обновлять состояние необходимо, чтобы обновить локи в режиме рецензирования.
        editor.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
      } else {
        CollaborativeEditing.Add_NeedLock(Id, e["user"]);
      }
    }
  };
  this.CoAuthoringApi.onLocksReleased = function(e, bChanges) {
    if (t.isApplyChangesOnOpenEnabled) {
      // Пока документ еще не загружен, будем сохранять функцию и аргументы
      t.arrPreOpenLocksObjects.push(function() {
        t.CoAuthoringApi.onLocksReleased(e, bChanges);
      });
      return;
    }

    var Id = e["block"];
    var Class = g_oTableId.Get_ById(Id);
    if (null != Class) {
      var Lock = Class.Lock;
      if ("undefined" != typeof(Lock)) {
        var CurType = Lock.Get_Type();

        var NewType = locktype_None;

        if (CurType === locktype_Other) {
          if (true != bChanges) {
            NewType = locktype_None;
          } else {
            NewType = locktype_Other2;
            CollaborativeEditing.Add_Unlock(Class);
          }
        } else if (CurType === locktype_Mine) {
          // Такого быть не должно
          NewType = locktype_Mine;
        } else if (CurType === locktype_Other2 || CurType === locktype_Other3) {
          NewType = locktype_Other2;
        }

        Lock.Set_Type(NewType, true);

        // Теперь обновлять состояние необходимо, чтобы обновить локи в режиме рецензирования.
        editor.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
      }
    } else {
      CollaborativeEditing.Remove_NeedLock(Id);
    }
  };
  this.CoAuthoringApi.onSaveChanges = function(e, userId, bFirstLoad) {
    var bUseColor;
    if (bFirstLoad) {
      bUseColor = -1 === CollaborativeEditing.m_nUseType;
    }
    if (editor.CollaborativeMarksShowType === c_oAscCollaborativeMarksShowType.None) {
      bUseColor = false;
    }

    var oUser = t.CoAuthoringApi.getUser(userId);
    var nColor = oUser ? oUser.asc_getColorValue() : null;
    var oColor = false === bUseColor ? null : (null !== nColor ? new CDocumentColor((nColor >> 16) & 0xFF, (nColor >> 8) & 0xFF, nColor & 0xFF) : new CDocumentColor(191, 255, 199));

    t._coAuthoringSetChange(e, oColor);
    // т.е. если bSendEvent не задан, то посылаем  сообщение + когда загрузился документ
    if (!bFirstLoad && t.bInit_word_control) {
      t.sync_CollaborativeChanges();
    }
  };
  this.CoAuthoringApi.onStartCoAuthoring = function(isStartEvent) {
    CollaborativeEditing.Start_CollaborationEditing();
    t.asc_setDrawCollaborationMarks(true);

    if (t.ParcedDocument) {
      t.WordControl.m_oLogicDocument.DrawingDocument.Start_CollaborationEditing();

      if (!isStartEvent) {
        if (true != History.Is_Clear()) {
          CollaborativeEditing.Apply_Changes();
          CollaborativeEditing.Send_Changes();
        } else {
          // Изменений нет, но нужно сбросить lock
          t.CoAuthoringApi.unLockDocument(true);
        }
      }
    } else {
      t.isStartCoAuthoringOnEndLoad = true;
      if (!isStartEvent) {
        // Документ еще не подгрузился, но нужно сбросить lock
        t.CoAuthoringApi.unLockDocument(false);
      }
    }
  };
  this.CoAuthoringApi.onEndCoAuthoring = function(isStartEvent) {
    CollaborativeEditing.End_CollaborationEditing();
    editor.asc_setDrawCollaborationMarks(false);
  };
};

/////////////////////////////////////////////////////////////////////////
//////////////////////////SpellChecking api//////////////////////////////
/////////////////////////////////////////////////////////////////////////
// Init SpellCheck
asc_docs_api.prototype._coSpellCheckInit = function() {
	if (!this.SpellCheckApi) {
		return; // Error
	}

    if (!window["AscDesktopEditor"]) {
        if (this.SpellCheckUrl && this.isSpellCheckEnable)
            this.SpellCheckApi.set_url(this.SpellCheckUrl);

        this.SpellCheckApi.onSpellCheck	= function (e) {
            var incomeObject = JSON.parse(e);
            SpellCheck_CallBack(incomeObject);
        };
    }

	this.SpellCheckApi.init(this.documentId);
};

asc_docs_api.prototype.asc_getSpellCheckLanguages = function() {
	return g_spellCheckLanguages;
};
asc_docs_api.prototype.asc_SpellCheckDisconnect = function() {
	if (!this.SpellCheckApi)
		return; // Error
	this.SpellCheckApi.disconnect();
	this.isSpellCheckEnable = false;
	if (this.WordControl.m_oLogicDocument)
		this.WordControl.m_oLogicDocument.TurnOff_CheckSpelling();
};
asc_docs_api.prototype._onUpdateDocumentCanSave = function ()
{
    var CollEditing = CollaborativeEditing;

    // Можно модифицировать это условие на более быстрое (менять самим состояние в аргументах, а не запрашивать каждый раз)
	var isCanSave = this.isDocumentModified() || (true !== CollEditing.Is_SingleUser() && 0 !== CollEditing.getOwnLocksLength());

    if (true === CollEditing.Is_Fast() && true !== CollEditing.Is_SingleUser())
        isCanSave = false;

	if (isCanSave !== this.isDocumentCanSave)
    {
		this.isDocumentCanSave = isCanSave;
		this.asc_fireCallback('asc_onDocumentCanSaveChanged', this.isDocumentCanSave);
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
    if ( undefined != Obj.FontFamily )
    {
        var loader   = window.g_font_loader;
        var fontinfo = g_fontApplication.GetFontInfo(Obj.FontFamily);
        var isasync  = loader.LoadFont(fontinfo, editor.asyncFontEndLoaded_DropCap, Obj);
        Obj.FontFamily = new asc_CTextFontFamily( { Name : fontinfo.Name, Index : -1 } );

        if (false === isasync)
        {
            if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
            {
                this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetFramePrWithFontFamily);
                this.WordControl.m_oLogicDocument.Set_ParagraphFramePr( Obj );
            }
        }
    }
    else
    {
        if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
        {
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetFramePr);
            this.WordControl.m_oLogicDocument.Set_ParagraphFramePr( Obj );
        }
    }
};

asc_docs_api.prototype.asyncFontEndLoaded_MathDraw = function(Obj)
{
    this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);
    Obj.Generate2();
};
asc_docs_api.prototype.sendMathTypesToMenu = function(_math)
{
    this.asc_fireCallback("asc_onMathTypes", _math);
};

asc_docs_api.prototype.asyncFontEndLoaded_DropCap = function(Obj)
{
    this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetFramePrWithFontFamilyLong);
        this.WordControl.m_oLogicDocument.Set_ParagraphFramePr( Obj );
    }
    // отжать заморозку меню
};

asc_docs_api.prototype.asc_addDropCap = function(bInText)
{
    this.WordControl.m_oLogicDocument.Add_DropCap( bInText );
};

asc_docs_api.prototype.removeDropcap = function(bDropCap)
{
    this.WordControl.m_oLogicDocument.Remove_DropCap( bDropCap );
};

function CMathProp(obj)
{
    this.Type = c_oAscMathInterfaceType.Common;
    this.Pr   = null;

    if (obj)
    {
        this.Type = (undefined !== obj.Type ? obj.Type : this.Type);
        this.Pr   = (undefined !== obj.Pr   ? obj.Pr   : this.Pr);
    }
}

CMathProp.prototype.get_Type = function() {return this.Type;};


// Paragraph properties
function CParagraphPropEx (obj)
{
	if (obj)
	{
		this.ContextualSpacing = (undefined != obj.ContextualSpacing) ? obj.ContextualSpacing : null;
		this.Ind = (undefined != obj.Ind && null != obj.Ind) ? new asc_CParagraphInd(obj.Ind) : null;
		this.Jc = (undefined != obj.Jc) ? obj.Jc : null;
		this.KeepLines = (undefined != obj.KeepLines) ? obj.KeepLines : null;
		this.KeepNext = (undefined != obj.KeepNext) ? obj.KeepNext : null;
		this.PageBreakBefore = (undefined != obj.PageBreakBefore) ? obj.PageBreakBefore : null;
		this.Spacing = (undefined != obj.Spacing && null != obj.Spacing) ? new asc_CParagraphSpacing(obj.Spacing) : null;
		this.Shd = (undefined != obj.Shd && null != obj.Shd) ? new asc_CParagraphShd(obj.Shd) : null;
		this.WidowControl = (undefined != obj.WidowControl) ? obj.WidowControl : null;                  // Запрет висячих строк
		this.Tabs = obj.Tabs;
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
		this.Ind = new asc_CParagraphInd();
		this.Jc = align_Left;
		this.KeepLines = false;
		this.KeepNext = false;
		this.PageBreakBefore = false;
		this.Spacing = new asc_CParagraphSpacing();
		this.Shd = new asc_CParagraphShd();
		this.WidowControl = true;                  // Запрет висячих строк
		this.Tabs = null;
	}
}
CParagraphPropEx.prototype.get_ContextualSpacing = function ()
{
	return this.ContextualSpacing;
};
CParagraphPropEx.prototype.get_Ind = function ()
{
	return this.Ind;
};
CParagraphPropEx.prototype.get_Jc = function ()
{
	return this.Jc;
};
CParagraphPropEx.prototype.get_KeepLines = function ()
{
	return this.KeepLines;
};
CParagraphPropEx.prototype.get_KeepNext = function ()
{
	return this.KeepNext;
};
CParagraphPropEx.prototype.get_PageBreakBefore = function ()
{
	return this.PageBreakBefore;
};
CParagraphPropEx.prototype.get_Spacing = function ()
{
	return this.Spacing;
};
CParagraphPropEx.prototype.get_Shd = function ()
{
	return this.Shd;
};
CParagraphPropEx.prototype.get_WidowControl = function ()
{
	return this.WidowControl;
};
CParagraphPropEx.prototype.get_Tabs = function ()
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
function CTextProp (obj)
{
	if (obj)
	{
		this.Bold       = (undefined != obj.Bold) ? obj.Bold : null;
		this.Italic     = (undefined != obj.Italic) ? obj.Italic : null;
		this.Underline  = (undefined != obj.Underline) ? obj.Underline : null;
		this.Strikeout  = (undefined != obj.Strikeout) ? obj.Strikeout : null;
		this.FontFamily = (undefined != obj.FontFamily && null != obj.FontFamily) ? new asc_CTextFontFamily (obj.FontFamily) : null;
		this.FontSize   = (undefined != obj.FontSize) ? obj.FontSize : null;
		this.Color      = (undefined != obj.Color && null != obj.Color) ? CreateAscColorCustom(obj.Color.r, obj.Color.g, obj.Color.b) : null;
		this.VertAlign  = (undefined != obj.VertAlign) ? obj.VertAlign : null;
		this.HighLight  = (undefined != obj.HighLight) ? obj.HighLight == highlight_None ? obj.HighLight : new CColor (obj.HighLight.r, obj.HighLight.g, obj.HighLight.b) : null;
        this.DStrikeout = (undefined != obj.DStrikeout) ? obj.DStrikeout : null;
        this.Spacing    = (undefined != obj.Spacing)    ? obj.Spacing    : null;
        this.Caps       = (undefined != obj.Caps)       ? obj.Caps       : null;
        this.SmallCaps  = (undefined != obj.SmallCaps)  ? obj.SmallCaps  : null;
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
		this.Color      = CreateAscColorCustom(0, 0, 0);
		this.VertAlign  = vertalign_Baseline;
		this.HighLight  = highlight_None;
        this.DStrikeout = false;
        this.Spacing    = 0;
        this.Caps       = false;
        this.SmallCaps  = false;
    }
}
CTextProp.prototype.get_Bold = function ()
{
	return this.Bold;
};
CTextProp.prototype.get_Italic = function ()
{
	return this.Italic;
};
CTextProp.prototype.get_Underline = function ()
{
	return this.Underline;
};
CTextProp.prototype.get_Strikeout = function ()
{
	return this.Strikeout;
};
CTextProp.prototype.get_FontFamily = function ()
{
	return this.FontFamily;
};
CTextProp.prototype.get_FontSize = function ()
{
	return this.FontSize;
};
CTextProp.prototype.get_Color = function ()
{
	return this.Color;
};
CTextProp.prototype.get_VertAlign = function ()
{
	return this.VertAlign;
};
CTextProp.prototype.get_HighLight = function ()
{
	return this.HighLight;
};

CTextProp.prototype.get_Spacing = function ()
{
    return this.Spacing;
};

CTextProp.prototype.get_DStrikeout = function ()
{
    return this.DStrikeout;
};

CTextProp.prototype.get_Caps = function ()
{
    return this.Caps;
};

CTextProp.prototype.get_SmallCaps = function ()
{
    return this.SmallCaps;
};


// paragraph and text properties objects container
function CParagraphAndTextProp (paragraphProp, textProp)
{
	this.ParaPr = (undefined != paragraphProp && null != paragraphProp) ? new CParagraphPropEx (paragraphProp) : null;
	this.TextPr = (undefined != textProp && null != textProp) ? new CTextProp (textProp) : null;
}
CParagraphAndTextProp.prototype.get_ParaPr = function ()
{
	return this.ParaPr;
};
CParagraphAndTextProp.prototype.get_TextPr = function ()
{
	return this.TextPr;
};

//
asc_docs_api.prototype.get_TextProps = function()
{
	var Doc = this.WordControl.m_oLogicDocument;
	var ParaPr = Doc.Get_Paragraph_ParaPr();
	var TextPr = Doc.Get_Paragraph_TextPr();

	// return { ParaPr: ParaPr, TextPr : TextPr };
	return new CParagraphAndTextProp (ParaPr, TextPr);	// uncomment if this method will be used externally. 20/03/2012 uncommented for testers
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

	if ( true === Document.Selection.Use )
		Document.Selection_Remove();

	Document.DrawingDocument.SelectEnabled(true);
	Document.DrawingDocument.TargetEnd();

	Document.Selection.Use      = true;
	Document.Selection.Start    = false;
	Document.Selection.Flag     = selectionflag_Common;

	Document.Selection.StartPos = Index;
	Document.Selection.EndPos   = Index;

	Document.Content[Index].Selection.Use      = true;
	Document.Content[Index].Selection.StartPos = Document.Content[Index].Internal_GetStartPos();
	Document.Content[Index].Selection.EndPos   = Document.Content[Index].Content.length - 1;

	Document.Selection_Draw();
};

asc_docs_api.prototype.UpdateTextPr = function(TextPr)
{
	if ( "undefined" != typeof(TextPr) )
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
    var TextPr = editor.WordControl.m_oLogicDocument.Get_Paragraph_TextPr();
    ParaPr.Subscript   = TextPr.VertAlign === vertalign_SubScript;
    ParaPr.Superscript = TextPr.VertAlign === vertalign_SuperScript;
    ParaPr.Strikeout   = TextPr.Strikeout;
    ParaPr.DStrikeout  = TextPr.DStrikeout;
    ParaPr.AllCaps     = TextPr.Caps;
    ParaPr.SmallCaps   = TextPr.SmallCaps;
    ParaPr.TextSpacing = TextPr.Spacing;
    ParaPr.Position    = TextPr.Position;
    //-----------------------------------------------------------------------------

    if ( true === ParaPr.Spacing.AfterAutoSpacing )
        ParaPr.Spacing.After = spacing_Auto;
    else if ( undefined === ParaPr.Spacing.AfterAutoSpacing )
        ParaPr.Spacing.After = UnknownValue;

    if ( true === ParaPr.Spacing.BeforeAutoSpacing )
        ParaPr.Spacing.Before = spacing_Auto;
    else if ( undefined === ParaPr.Spacing.BeforeAutoSpacing )
        ParaPr.Spacing.Before = UnknownValue;

    if ( -1 === ParaPr.PStyle )
        ParaPr.StyleName = "";
    else if ( undefined === ParaPr.PStyle || undefined === this.WordControl.m_oLogicDocument.Styles.Style[ParaPr.PStyle] )
        ParaPr.StyleName = this.WordControl.m_oLogicDocument.Styles.Style[this.WordControl.m_oLogicDocument.Styles.Get_Default_Paragraph()].Name;
    else
        ParaPr.StyleName = this.WordControl.m_oLogicDocument.Styles.Style[ParaPr.PStyle].Name;

    var NumType    = -1;
    var NumSubType = -1;
    if ( !(null == ParaPr.NumPr || 0 === ParaPr.NumPr.NumId || "0" === ParaPr.NumPr.NumId) )
    {
        var Numb = this.WordControl.m_oLogicDocument.Numbering.Get_AbstractNum( ParaPr.NumPr.NumId );
        
        if ( undefined !== Numb && undefined !== Numb.Lvl[ParaPr.NumPr.Lvl] )
        {
            var Lvl = Numb.Lvl[ParaPr.NumPr.Lvl];
            var NumFormat = Lvl.Format;
            var NumText   = Lvl.LvlText;
            
            if ( numbering_numfmt_Bullet === NumFormat )
            {
                NumType    = 0;
                NumSubType = 0;
                
                var TextLen = NumText.length;
                if ( 1 === TextLen && numbering_lvltext_Text === NumText[0].Type )
                {
                    var NumVal = NumText[0].Value.charCodeAt(0);

                    if ( 0x00B7 === NumVal )
                        NumSubType = 1;
                    else if ( 0x006F === NumVal )
                        NumSubType = 2;
                    else if ( 0x00A7 === NumVal )
                        NumSubType = 3;
                    else if ( 0x0076 === NumVal )
                        NumSubType = 4;
                    else if ( 0x00D8 === NumVal )
                        NumSubType = 5;
                    else if ( 0x00FC === NumVal )
                        NumSubType = 6;
                    else if ( 0x00A8 === NumVal )
                        NumSubType = 7;
                }
            }
            else
            {
                NumType    = 1;
                NumSubType = 0;
                
                var TextLen = NumText.length;
                if ( 2 === TextLen && numbering_lvltext_Num === NumText[0].Type && numbering_lvltext_Text === NumText[1].Type )
                {
                    var NumVal2 = NumText[1].Value;
                    
                    if ( numbering_numfmt_Decimal === NumFormat )
                    {
                        if ( "." === NumVal2 )
                            NumSubType = 1;
                        else if ( ")" === NumVal2 )
                            NumSubType = 2;                        
                    }
                    else if ( numbering_numfmt_UpperRoman === NumFormat )
                    {
                        if ( "." === NumVal2 )
                            NumSubType = 3;
                    }
                    else if ( numbering_numfmt_UpperLetter === NumFormat )
                    {
                        if ( "." === NumVal2 )
                            NumSubType = 4;
                    }
                    else if ( numbering_numfmt_LowerLetter === NumFormat )
                    {
                        if ( ")" === NumVal2 )
                            NumSubType = 5;
                        else if ( "." === NumVal2 )
                            NumSubType = 6;
                    }
                    else if ( numbering_numfmt_LowerRoman === NumFormat )
                    {
                        if ( "." === NumVal2 )
                            NumSubType = 7;
                    }
                }
            }
        }
    }

    ParaPr.ListType = { Type : NumType, SubType : NumSubType };
    
    if ( undefined !== ParaPr.FramePr && undefined !== ParaPr.FramePr.Wrap )
    {
        if ( wrap_NotBeside === ParaPr.FramePr.Wrap )
            ParaPr.FramePr.Wrap = false;
        else if ( wrap_Around === ParaPr.FramePr.Wrap )
            ParaPr.FramePr.Wrap = true;
        else
            ParaPr.FramePr.Wrap = undefined;
    }

	this.sync_ParaSpacingLine( ParaPr.Spacing );
	this.Update_ParaInd(ParaPr.Ind);
	this.sync_PrAlignCallBack(ParaPr.Jc);
	this.sync_ParaStyleName(ParaPr.StyleName);
	this.sync_ListType(ParaPr.ListType);
	this.sync_PrPropCallback(ParaPr);
};

/*----------------------------------------------------------------*/
/*functions for working with clipboard, document*/
/*TODO: Print,Undo,Redo,Copy,Cut,Paste,Share,Save,DownloadAs,ReturnToDocuments(вернуться на предыдущую страницу) & callbacks for these functions*/
asc_docs_api.prototype.asc_Print = function(bIsDownloadEvent)
{
    if (window["AscDesktopEditor"])
    {
        if (null != this.WordControl.m_oDrawingDocument.m_oDocumentRenderer)
        {
            if (window["AscDesktopEditor"]["IsSupportNativePrint"](this.DocumentUrl) === true)
                return;
        }
        else
        {
            window["AscDesktopEditor"]["Print"]();
            return;
        }
    }
  var command;
  var options = {isNoData: false, downloadType: bIsDownloadEvent ? 'asc_onPrintUrl' : null};
  if (null == this.WordControl.m_oLogicDocument) {
    command = 'savefromorigin';
    options.isNoData = true;
  } else {
    command = 'save';
  }
  _downloadAs(this, command, c_oAscFileType.PDF, c_oAscAsyncAction.Print, options, null);
};
asc_docs_api.prototype.Undo = function()
{
	this.WordControl.m_oLogicDocument.Document_Undo();
};
asc_docs_api.prototype.Redo = function()
{
	this.WordControl.m_oLogicDocument.Document_Redo();
};
asc_docs_api.prototype.Copy = function()
{
    if (window["AscDesktopEditor"])
    {
        window["AscDesktopEditorButtonMode"] = true;

        var _e = new CKeyboardEvent();
        _e.CtrlKey = true;
        _e.KeyCode = 67;

        this.WordControl.m_oLogicDocument.OnKeyDown(_e);

        window["AscDesktopEditorButtonMode"] = false;

        return;
    }
	return Editor_Copy_Button(this);
};
asc_docs_api.prototype.Update_ParaTab = function(Default_Tab, ParaTabs){
    this.WordControl.m_oDrawingDocument.Update_ParaTab(Default_Tab, ParaTabs);
};
asc_docs_api.prototype.Cut = function()
{
    if (window["AscDesktopEditor"])
    {
        window["AscDesktopEditorButtonMode"] = true;

        var _e = new CKeyboardEvent();
        _e.CtrlKey = true;
        _e.KeyCode = 88;

        this.WordControl.m_oLogicDocument.OnKeyDown(_e);

        window["AscDesktopEditorButtonMode"] = false;

        return;
    }
	return Editor_Copy_Button(this, true);
};
asc_docs_api.prototype.Paste = function()
{
    if (window["AscDesktopEditor"])
    {
        window["AscDesktopEditorButtonMode"] = true;

        var _e = new CKeyboardEvent();
        _e.CtrlKey = true;
        _e.KeyCode = 86;

        this.WordControl.m_oLogicDocument.OnKeyDown(_e);

        window["AscDesktopEditorButtonMode"] = false;

        return;
    }

    if (false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
    {
        if (!window.GlobalPasteFlag)
        {
            if (!window.USER_AGENT_SAFARI_MACOS)
            {
                window.GlobalPasteFlag = true;
                return Editor_Paste_Button(this);
            }
            else
            {
                if (0 === window.GlobalPasteFlagCounter)
                {
                    SafariIntervalFocus();
                    window.GlobalPasteFlag = true;
                    return Editor_Paste_Button(this);
                }
            }
        }
    }
};
asc_docs_api.prototype.Share = function(){

};

function OnSave_Callback(e) {
  if (false == e["saveLock"]) {
    if (editor.isLongAction()) {
      // Мы не можем в этот момент сохранять, т.к. попали в ситуацию, когда мы залочили сохранение и успели нажать вставку до ответа
      // Нужно снять lock с сохранения
      editor.CoAuthoringApi.onUnSaveLock = function() {
        editor.canSave = true;
        editor.IsUserSave = false;
      };
      editor.CoAuthoringApi.unSaveLock();
      return;
    }
    editor.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);

    if (c_oAscCollaborativeMarksShowType.LastChanges === editor.CollaborativeMarksShowType) {
      CollaborativeEditing.Clear_CollaborativeMarks();
    }

    // Принимаем чужие изменения
    var HaveOtherChanges = CollaborativeEditing.Have_OtherChanges();
    CollaborativeEditing.Apply_Changes();

    editor.CoAuthoringApi.onUnSaveLock = function() {
      editor.CoAuthoringApi.onUnSaveLock = null;

      // Выставляем, что документ не модифицирован
      editor.CheckChangedDocument();
      editor.canSave = true;
      editor.IsUserSave = false;
      editor.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.Save);

      // Обновляем состояние возможности сохранения документа
      editor._onUpdateDocumentCanSave();

      if (undefined !== window["AscDesktopEditor"]) {
        window["AscDesktopEditor"]["OnSave"]();
      }
    };

    var CursorInfo = null;
    if (true === CollaborativeEditing.Is_Fast()) {
      CursorInfo = History.Get_DocumentPositionBinary();
    }

    // Пересылаем свои изменения
    CollaborativeEditing.Send_Changes(editor.IsUserSave, {UserId: editor.CoAuthoringApi.getUserConnectionId(), CursorInfo: CursorInfo}, HaveOtherChanges);
  } else {
    var nState = editor.CoAuthoringApi.get_state();
    if (ConnectionState.Close === nState) {
      // Отключаемся от сохранения, соединение потеряно
      editor.canSave = true;
      editor.IsUserSave = false;
    } else {
      var TimeoutInterval = (true === CollaborativeEditing.Is_Fast() ? 1 : 1000);
      setTimeout(function() {
        editor.CoAuthoringApi.askSaveChanges(OnSave_Callback);
      }, TimeoutInterval);
    }
  }
}

asc_docs_api.prototype.asc_Save = function(isAutoSave) {
  this.IsUserSave = !isAutoSave;
  if (true === this.canSave && !this.isLongAction()) {
    this.canSave = false;
    this.CoAuthoringApi.askSaveChanges(OnSave_Callback);
  }
};

asc_docs_api.prototype.asc_DownloadAs = function(typeFile, bIsDownloadEvent) {//передаем число соответствующее своему формату.
	var actionType = this.mailMergeFileData ? c_oAscAsyncAction.MailMergeLoadFile : c_oAscAsyncAction.DownloadAs;
    var options = {downloadType: bIsDownloadEvent ? 'asc_onDownloadUrl' : null};
	_downloadAs(this, "save", typeFile, actionType, options, null);
};
asc_docs_api.prototype.Resize = function(){
	if (false === this.bInit_word_control)
		return;
	this.WordControl.OnResize(false);
};
asc_docs_api.prototype.AddURL = function(url){

};
asc_docs_api.prototype.Help = function(){

};
/*
 idOption идентификатор дополнительного параметра, c_oAscAdvancedOptionsID.TXT.
 option - какие свойства применить, пока массив. для TXT объект asc_CTXTAdvancedOptions(codepage)
 exp:	asc_setAdvancedOptions(c_oAscAdvancedOptionsID.TXT, new Asc.asc_CCSVAdvancedOptions(1200) );
 */
asc_docs_api.prototype.asc_setAdvancedOptions = function(idOption, option) {
  var t = this;
  switch (idOption) {
    case c_oAscAdvancedOptionsID.TXT:
      // Проверяем тип состояния в данный момент
      if (this.advancedOptionsAction === c_oAscAdvancedOptionsAction.Open) {
          var rData = {
            "id":this.documentId,
            "userid": this.documentUserId,
            "format": this.documentFormat,
            "vkey": this.documentVKey,
            "editorid": this.editorId,
            "c":"reopen",
            "url": this.documentUrl,
            "title": this.documentTitle,
            "codepage": option.asc_getCodePage(),
            "embeddedfonts": t.isUseEmbeddedCutFonts
          };
          sendCommand2(t, null, rData);
      } else if (this.advancedOptionsAction === c_oAscAdvancedOptionsAction.Save) {
          var options = {txtOptions: option};
          _downloadAs(t, "save", c_oAscFileType.TXT, c_oAscAsyncAction.DownloadAs, options, null);
      }
      break;
  }
};
asc_docs_api.prototype.SetFontRenderingMode = function(mode)
{
    if (c_oAscFontRenderingModeType.noHinting === mode)
        SetHintsProps(false, false);
    else if (c_oAscFontRenderingModeType.hinting === mode)
        SetHintsProps(true, false);
    else if (c_oAscFontRenderingModeType.hintingAndSubpixeling === mode)
        SetHintsProps(true, true);

    this.WordControl.m_oDrawingDocument.ClearCachePages();
    g_fontManager.ClearFontsRasterCache();

    if (window.g_fontManager2 !== undefined && window.g_fontManager2 !== null)
        window.g_fontManager2.ClearFontsRasterCache();

    if (this.bInit_word_control)
        this.WordControl.OnScroll();
};
asc_docs_api.prototype.processSavedFile = function(url, downloadType) {
	var t = this;
	if (this.mailMergeFileData) {
		this.mailMergeFileData = null;
		asc_ajax({
			url: url,
			dataType: "text",
			success: function (result) {
				try {
					t.asc_StartMailMergeByList(JSON.parse(result));
				} catch (e) {
					t.asc_fireCallback("asc_onError", c_oAscError.ID.MailMergeLoadFile, c_oAscError.Level.NoCritical);
				}
			},
			error: function () {
				t.asc_fireCallback("asc_onError", c_oAscError.ID.MailMergeLoadFile, c_oAscError.Level.NoCritical);
			}
		});
	} else {
		if (downloadType) {
			this.asc_fireCallback(downloadType, url, function (hasError) {
			});
		} else {
			getFile(url);
		}
	}
};
asc_docs_api.prototype.startGetDocInfo = function(){
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

        var obj = { PageCount: _render.PagesCount, WordsCount: _render.CountWords, ParagraphCount: _render.CountParagraphs,
                        SymbolsCount: _render.CountSymbols, SymbolsWSCount: (_render.CountSymbols + _render.CountSpaces) };

        this.asc_fireCallback( "asc_onDocInfo", new CDocInfoProp(obj));

        this.sync_GetDocInfoEndCallback();
    }
    else
    {
        this.WordControl.m_oLogicDocument.Statistics_Start();
    }
};
asc_docs_api.prototype.stopGetDocInfo = function(){
    this.sync_GetDocInfoStopCallback();

    if (null != this.WordControl.m_oLogicDocument)
        this.WordControl.m_oLogicDocument.Statistics_Stop();
};
asc_docs_api.prototype.sync_DocInfoCallback = function(obj){
	this.asc_fireCallback( "asc_onDocInfo", new CDocInfoProp(obj));
};
asc_docs_api.prototype.sync_GetDocInfoStartCallback = function(){
	this.asc_fireCallback("asc_onGetDocInfoStart");
};
asc_docs_api.prototype.sync_GetDocInfoStopCallback = function(){
	this.asc_fireCallback("asc_onGetDocInfoStop");
};
asc_docs_api.prototype.sync_GetDocInfoEndCallback = function(){
	this.asc_fireCallback("asc_onGetDocInfoEnd");
};
asc_docs_api.prototype.sync_CanUndoCallback = function(bCanUndo)
{
    if (true === CollaborativeEditing.Is_Fast() && true !== CollaborativeEditing.Is_SingleUser())
        bCanUndo = false;

    this.asc_fireCallback("asc_onCanUndo", bCanUndo);
};
asc_docs_api.prototype.sync_CanRedoCallback = function(bCanRedo)
{
    if (true === CollaborativeEditing.Is_Fast() && true !== CollaborativeEditing.Is_SingleUser())
        bCanRedo = false;

    this.asc_fireCallback("asc_onCanRedo", bCanRedo);
};

asc_docs_api.prototype.can_CopyCut = function()
{
    return this.WordControl.m_oLogicDocument.Can_CopyCut();
};

asc_docs_api.prototype.sync_CanCopyCutCallback = function(bCanCopyCut)
{
    this.asc_fireCallback("asc_onCanCopyCut", bCanCopyCut);
};

asc_docs_api.prototype.setStartPointHistory = function(){
    this.noCreatePoint = true;
    this.exucuteHistory = true;
    this.incrementCounterLongAction();
    this.WordControl.m_oLogicDocument.TurnOff_InterfaceEvents();
};
asc_docs_api.prototype.setEndPointHistory   = function(){
    this.noCreatePoint = false;
    this.exucuteHistoryEnd = true;
    this.decrementCounterLongAction();
    this.WordControl.m_oLogicDocument.TurnOn_InterfaceEvents();
};

function CDocInfoProp(obj)
{
	if(obj){
		this.PageCount = obj.PageCount;
		this.WordsCount = obj.WordsCount;
		this.ParagraphCount = obj.ParagraphCount;
		this.SymbolsCount = obj.SymbolsCount;
		this.SymbolsWSCount = obj.SymbolsWSCount;
	}
	else {
		this.PageCount = -1;
		this.WordsCount = -1;
		this.ParagraphCount = -1;
		this.SymbolsCount = -1;
		this.SymbolsWSCount = -1;
	}
}
CDocInfoProp.prototype.get_PageCount = function(){ return this.PageCount; };
CDocInfoProp.prototype.put_PageCount = function(v){ this.PageCount = v; };
CDocInfoProp.prototype.get_WordsCount = function(){ return this.WordsCount; };
CDocInfoProp.prototype.put_WordsCount = function(v){ this.WordsCount = v; };
CDocInfoProp.prototype.get_ParagraphCount = function(){ return this.ParagraphCount; };
CDocInfoProp.prototype.put_ParagraphCount = function(v){ this.ParagraphCount = v; };
CDocInfoProp.prototype.get_SymbolsCount = function(){ return this.SymbolsCount; };
CDocInfoProp.prototype.put_SymbolsCount = function(v){ this.SymbolsCount = v; };
CDocInfoProp.prototype.get_SymbolsWSCount = function(){ return this.SymbolsWSCount; };
CDocInfoProp.prototype.put_SymbolsWSCount = function(v){ this.SymbolsWSCount = v; };

/*callbacks*/
/*asc_docs_api.prototype.sync_CursorLockCallBack = function(isLock){
	this.asc_fireCallback("asc_onCursorLock",isLock);
}*/
asc_docs_api.prototype.sync_PrintCallBack = function(){
	this.asc_fireCallback("asc_onPrint");
};
asc_docs_api.prototype.sync_UndoCallBack = function(){
	this.asc_fireCallback("asc_onUndo");
};
asc_docs_api.prototype.sync_RedoCallBack = function(){
	this.asc_fireCallback("asc_onRedo");
};
asc_docs_api.prototype.sync_CopyCallBack = function(){
	this.asc_fireCallback("asc_onCopy");
};
asc_docs_api.prototype.sync_CutCallBack = function(){
	this.asc_fireCallback("asc_onCut");
};
asc_docs_api.prototype.sync_PasteCallBack = function(){
	this.asc_fireCallback("asc_onPaste");
};
asc_docs_api.prototype.sync_ShareCallBack = function(){
	this.asc_fireCallback("asc_onShare");
};
asc_docs_api.prototype.sync_SaveCallBack = function(){
	this.asc_fireCallback("asc_onSave");
};
asc_docs_api.prototype.sync_DownloadAsCallBack = function(){
	this.asc_fireCallback("asc_onDownload");
};

asc_docs_api.prototype.sync_AddURLCallback = function(){
	this.asc_fireCallback("asc_onAddURL");
};
asc_docs_api.prototype.sync_ErrorCallback = function(errorID,errorLevel){
	this.asc_fireCallback("asc_onError",errorID,errorLevel);
};
asc_docs_api.prototype.sync_HelpCallback = function(url){
	this.asc_fireCallback("asc_onHelp",url);
};
asc_docs_api.prototype.sync_UpdateZoom = function(zoom){
	this.asc_fireCallback("asc_onZoom", zoom);
};
asc_docs_api.prototype.sync_StatusMessage = function(message){
	this.asc_fireCallback("asc_onMessage", message);
};
asc_docs_api.prototype.ClearPropObjCallback = function(prop){//колбэк предшествующий приходу свойств объекта, prop а всякий случай
	this.asc_fireCallback("asc_onClearPropObj", prop);
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
function CHeader (obj)
{
	if (obj)
	{
		this.headerText = (undefined != obj.headerText) ? obj.headerText : null;	//заголовок
		this.pageNumber = (undefined != obj.pageNumber) ? obj.pageNumber : null;	//содержит номер страницы, где находится искомая последовательность
		this.X = (undefined != obj.X) ? obj.X : null;								//координаты по OX начала последовательности на данной страницы
		this.Y = (undefined != obj.Y) ? obj.Y : null;								//координаты по OY начала последовательности на данной страницы
		this.level = (undefined != obj.level) ? obj.level : null;					//позиция заголовка
	}
	else
	{
		this.headerText = null;				//заголовок
		this.pageNumber = null;				//содержит номер страницы, где находится искомая последовательность
		this.X = null;						//координаты по OX начала последовательности на данной страницы
		this.Y = null;						//координаты по OY начала последовательности на данной страницы
		this.level = null;					//позиция заголовка
	}
}
CHeader.prototype.get_headerText = function ()
{
	return this.headerText;
};
CHeader.prototype.get_pageNumber = function ()
{
	return this.pageNumber;
};
CHeader.prototype.get_X = function ()
{
	return this.X;
};
CHeader.prototype.get_Y = function ()
{
	return this.Y;
};
CHeader.prototype.get_Level = function ()
{
	return this.level;
};
var _fakeHeaders = [
	new CHeader ({headerText: "Header1", pageNumber: 0, X: 0, Y: 0, level: 1}),
	new CHeader ({headerText: "Header2", pageNumber: 0, X: 0, Y: 0, level: 1}),
	new CHeader ({headerText: "Header3", pageNumber: 0, X: 0, Y: 0, level: 2}),
	new CHeader ({headerText: "Header4", pageNumber: 0, X: 0, Y: 0, level: 1}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 1}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 1}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 2}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 3}),
	new CHeader ({headerText: "Header3", pageNumber: 0, X: 0, Y: 0, level: 4}),
	new CHeader ({headerText: "Header3", pageNumber: 0, X: 0, Y: 0, level: 5}),
	new CHeader ({headerText: "Header3", pageNumber: 0, X: 0, Y: 0, level: 6}),
	new CHeader ({headerText: "Header4", pageNumber: 0, X: 0, Y: 0, level: 7}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 8}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 1}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 1}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 2}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 3}),
	new CHeader ({headerText: "Header6", pageNumber: 0, X: 0, Y: 0, level: 1}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 0}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 1}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 0}),
	new CHeader ({headerText: "Header5", pageNumber: 0, X: 0, Y: 0, level: 0})
];

asc_docs_api.prototype.CollectHeaders = function(){
	this.sync_ReturnHeadersCallback(_fakeHeaders);
};
asc_docs_api.prototype.GetActiveHeader = function(){

};
asc_docs_api.prototype.gotoHeader = function(page, X, Y){
	this.goToPage(page);
};
asc_docs_api.prototype.sync_ChangeActiveHeaderCallback = function (position, header){
	this.asc_fireCallback("asc_onChangeActiveHeader", position, new CHeader (header));
};
asc_docs_api.prototype.sync_ReturnHeadersCallback = function (headers){
	var _headers = [];
	for (var i = 0; i < headers.length; i++)
	{
		_headers[i] = new CHeader (headers[i]);
	}

	this.asc_fireCallback("asc_onReturnHeaders", _headers);
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

    var SearchEngine = editor.WordControl.m_oLogicDocument.Search( text, { MatchCase : isMatchCase } );

    var Id = this.WordControl.m_oLogicDocument.Search_GetId( isNext );

    if ( null != Id )
        this.WordControl.m_oLogicDocument.Search_Select( Id );

    return SearchEngine.Count;
};

asc_docs_api.prototype.asc_replaceText = function(text, replaceWith, isReplaceAll, isMatchCase)
{
    if (null == this.WordControl.m_oLogicDocument)
        return;

    this.WordControl.m_oLogicDocument.Search( text, { MatchCase : isMatchCase } );

    if ( true === isReplaceAll )
        this.WordControl.m_oLogicDocument.Search_Replace(replaceWith, true, -1);
    else
    {
        var CurId = this.WordControl.m_oLogicDocument.SearchEngine.CurId;
        var bDirection = this.WordControl.m_oLogicDocument.SearchEngine.Direction;
        if ( -1 != CurId )
            this.WordControl.m_oLogicDocument.Search_Replace(replaceWith, false, CurId);

        var Id = this.WordControl.m_oLogicDocument.Search_GetId( bDirection );

        if ( null != Id )
        {
            this.WordControl.m_oLogicDocument.Search_Select( Id );
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
    this.asc_fireCallback("asc_onReplaceAll", ReplaceCount, OverallCount);
};

asc_docs_api.prototype.sync_SearchEndCallback = function()
{
	this.asc_fireCallback("asc_onSearchEnd");
};
/*----------------------------------------------------------------*/
/*functions for working with font*/
/*setters*/
asc_docs_api.prototype.put_TextPrFontName = function(name)
{
	var loader = window.g_font_loader;
	var fontinfo = g_fontApplication.GetFontInfo(name);
	var isasync = loader.LoadFont(fontinfo);
	if (false === isasync)
    {
        if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
        {
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetTextFontName);
            this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { FontFamily : { Name : name , Index : -1 } } ) );
        }
    }
};
asc_docs_api.prototype.put_TextPrFontSize = function(size)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetTextFontSize);
        this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { FontSize : Math.min(size, 100) } ) );
    }
};

asc_docs_api.prototype.put_TextPrBold = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetTextBold);
    	this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { Bold : value } ) );
    }
};
asc_docs_api.prototype.put_TextPrItalic = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetTextItalic);
	    this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { Italic : value } ) );
    }
};
asc_docs_api.prototype.put_TextPrUnderline = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetTextUnderline);
        this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { Underline : value } ) );

        if ( true === this.isMarkerFormat )
            this.sync_MarkerFormatCallback( false );
    }
};
asc_docs_api.prototype.put_TextPrStrikeout = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetTextStrikeout);
        this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { Strikeout : value, DStrikeout : false } ) );

        if ( true === this.isMarkerFormat )
            this.sync_MarkerFormatCallback( false );
    }
};
asc_docs_api.prototype.put_TextPrDStrikeout = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetTextDStrikeout);
        this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { DStrikeout : value, Strikeout : false } ) );

        if ( true === this.isMarkerFormat )
            this.sync_MarkerFormatCallback( false );
    }
};
asc_docs_api.prototype.put_TextPrSpacing = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetTextSpacing);
        this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { Spacing : value } ) );

        if ( true === this.isMarkerFormat )
            this.sync_MarkerFormatCallback( false );
    }
};

asc_docs_api.prototype.put_TextPrCaps = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetTextCaps);
        this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { Caps : value, SmallCaps : false } ) );

        if ( true === this.isMarkerFormat )
            this.sync_MarkerFormatCallback( false );
    }
};

asc_docs_api.prototype.put_TextPrSmallCaps = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetTextSmallCaps);
        this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { SmallCaps : value, Caps : false } ) );

        if ( true === this.isMarkerFormat )
            this.sync_MarkerFormatCallback( false );
    }
};


asc_docs_api.prototype.put_TextPrPosition = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetTextPosition);
        this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { Position : value } ) );

        if ( true === this.isMarkerFormat )
            this.sync_MarkerFormatCallback( false );
    }
};

asc_docs_api.prototype.put_TextPrLang = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetTextLang);
        this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { Lang : { Val : value } } ) );

        this.WordControl.m_oLogicDocument.Spelling.Check_CurParas();

        if ( true === this.isMarkerFormat )
            this.sync_MarkerFormatCallback( false );
    }
};


asc_docs_api.prototype.put_PrLineSpacing = function(Type, Value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetParagraphLineSpacing);
        this.WordControl.m_oLogicDocument.Set_ParagraphSpacing( { LineRule : Type,  Line : Value } );

        var ParaPr = this.get_TextProps().ParaPr;
        if ( null != ParaPr )
            this.sync_ParaSpacingLine( ParaPr.Spacing );
    }
};
asc_docs_api.prototype.put_LineSpacingBeforeAfter = function(type,value)//"type == 0" means "Before", "type == 1" means "After"
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetParagraphLineSpacingBeforeAfter);
        switch (type)
        {
            case 0:
            {
                if ( spacing_Auto === value )
                    this.WordControl.m_oLogicDocument.Set_ParagraphSpacing( { BeforeAutoSpacing : true } );
                else
                    this.WordControl.m_oLogicDocument.Set_ParagraphSpacing( { Before : value, BeforeAutoSpacing : false } );

                break;
            }
            case 1:
            {
                if ( spacing_Auto === value )
                    this.WordControl.m_oLogicDocument.Set_ParagraphSpacing( { AfterAutoSpacing : true } );
                else
                    this.WordControl.m_oLogicDocument.Set_ParagraphSpacing( { After : value, AfterAutoSpacing : false });

                break;
            }
        }
    }
};
asc_docs_api.prototype.FontSizeIn = function()
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_IncFontSize);
        this.WordControl.m_oLogicDocument.Paragraph_IncDecFontSize(true);
    }
};
asc_docs_api.prototype.FontSizeOut = function()
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_DecFontSize);
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
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetParagraphBorders);
        this.WordControl.m_oLogicDocument.Set_ParagraphBorders( Obj );
    }
};
/*callbacks*/
asc_docs_api.prototype.sync_BoldCallBack = function(isBold){
	this.asc_fireCallback("asc_onBold",isBold);
};
asc_docs_api.prototype.sync_ItalicCallBack = function(isItalic){
	this.asc_fireCallback("asc_onItalic",isItalic);
};
asc_docs_api.prototype.sync_UnderlineCallBack = function(isUnderline){
	this.asc_fireCallback("asc_onUnderline",isUnderline);
};
asc_docs_api.prototype.sync_StrikeoutCallBack = function(isStrikeout){
	this.asc_fireCallback("asc_onStrikeout",isStrikeout);
};
asc_docs_api.prototype.sync_TextPrFontFamilyCallBack = function(FontFamily)
{
    if ( undefined != FontFamily )
	    this.asc_fireCallback("asc_onFontFamily", new asc_CTextFontFamily( FontFamily ));
    else
        this.asc_fireCallback("asc_onFontFamily", new asc_CTextFontFamily( { Name : "", Index : -1 } ));
};
asc_docs_api.prototype.sync_TextPrFontSizeCallBack = function(FontSize){
	this.asc_fireCallback("asc_onFontSize",FontSize);
};
asc_docs_api.prototype.sync_PrLineSpacingCallBack = function(LineSpacing){
    this.asc_fireCallback("asc_onLineSpacing", new asc_CParagraphInd( LineSpacing ) );
};
asc_docs_api.prototype.sync_InitEditorStyles = function(styles_painter){
    this.asc_fireCallback("asc_onInitEditorStyles", styles_painter);
};
asc_docs_api.prototype.sync_InitEditorTableStyles = function(styles, is_retina_enabled){
    this.asc_fireCallback("asc_onInitTableTemplates",styles, is_retina_enabled);
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
    if ( undefined != Props.DefaultTab )
        Additional = { Type : changestype_2_Element_and_Type, Element : this.WordControl.m_oLogicDocument, CheckType : changestype_Document_SectPr };

    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties, Additional) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetParagraphPr);

        // TODO: Сделать так, чтобы пересчет был всего 1 здесь
        if ( "undefined" != typeof(Props.ContextualSpacing) && null != Props.ContextualSpacing )
            this.WordControl.m_oLogicDocument.Set_ParagraphContextualSpacing( Props.ContextualSpacing );

        if ( "undefined" != typeof(Props.Ind) && null != Props.Ind )
            this.WordControl.m_oLogicDocument.Set_ParagraphIndent( Props.Ind );

        if ( "undefined" != typeof(Props.Jc) && null != Props.Jc )
            this.WordControl.m_oLogicDocument.Set_ParagraphAlign( Props.Jc );

        if ( "undefined" != typeof(Props.KeepLines) && null != Props.KeepLines )
            this.WordControl.m_oLogicDocument.Set_ParagraphKeepLines( Props.KeepLines );

        if ( undefined != Props.KeepNext && null != Props.KeepNext )
            this.WordControl.m_oLogicDocument.Set_ParagraphKeepNext( Props.KeepNext );

        if ( undefined != Props.WidowControl && null != Props.WidowControl )
            this.WordControl.m_oLogicDocument.Set_ParagraphWidowControl( Props.WidowControl );

        if ( "undefined" != typeof(Props.PageBreakBefore) && null != Props.PageBreakBefore )
            this.WordControl.m_oLogicDocument.Set_ParagraphPageBreakBefore( Props.PageBreakBefore );

        if ( "undefined" != typeof(Props.Spacing) && null != Props.Spacing )
            this.WordControl.m_oLogicDocument.Set_ParagraphSpacing( Props.Spacing );

        if ( "undefined" != typeof(Props.Shd) && null != Props.Shd )
        {
            var Unifill = new CUniFill();
            Unifill.fill = new CSolidFill();
            Unifill.fill.color = CorrectUniColor(Props.Shd.Color, Unifill.fill.color, 1);
            this.WordControl.m_oLogicDocument.Set_ParagraphShd(
                {
                    Value : Props.Shd.Value,
                    Color: {
                        r : Props.Shd.Color.asc_getR(),
                        g : Props.Shd.Color.asc_getG(),
                        b : Props.Shd.Color.asc_getB()
                    },
                    Unifill: Unifill
                } );
        }

        if ( "undefined" != typeof(Props.Brd) && null != Props.Brd )
        {
            if(Props.Brd.Left && Props.Brd.Left.Color)
            {
                Props.Brd.Left.Unifill = CreateUnifillFromAscColor(Props.Brd.Left.Color);
            }
            if(Props.Brd.Top && Props.Brd.Top.Color)
            {
                Props.Brd.Top.Unifill = CreateUnifillFromAscColor(Props.Brd.Top.Color);
            }
            if(Props.Brd.Right && Props.Brd.Right.Color)
            {
                Props.Brd.Right.Unifill = CreateUnifillFromAscColor(Props.Brd.Right.Color);
            }
            if(Props.Brd.Bottom && Props.Brd.Bottom.Color)
            {
                Props.Brd.Bottom.Unifill = CreateUnifillFromAscColor(Props.Brd.Bottom.Color);
            }
            if(Props.Brd.InsideH && Props.Brd.InsideH.Color)
            {
                Props.Brd.InsideH.Unifill = CreateUnifillFromAscColor(Props.Brd.InsideH.Color);
            }
            if(Props.Brd.InsideV && Props.Brd.InsideV.Color)
            {
                Props.Brd.InsideV.Unifill = CreateUnifillFromAscColor(Props.Brd.InsideV.Color);
            }

            this.WordControl.m_oLogicDocument.Set_ParagraphBorders( Props.Brd );
        }

        if ( undefined != Props.Tabs )
        {
            var Tabs = new CParaTabs();
            Tabs.Set_FromObject( Props.Tabs.Tabs );
            this.WordControl.m_oLogicDocument.Set_ParagraphTabs( Tabs );
        }

        if ( undefined != Props.DefaultTab )
        {
            this.WordControl.m_oLogicDocument.Set_DocumentDefaultTab( Props.DefaultTab );
        }


        // TODO: как только разъединят настройки параграфа и текста переделать тут
        var TextPr = new CTextPr();

        if ( true === Props.Subscript )
            TextPr.VertAlign = vertalign_SubScript;
        else if ( true === Props.Superscript )
            TextPr.VertAlign = vertalign_SuperScript;
        else if ( false === Props.Superscript || false === Props.Subscript )
            TextPr.VertAlign = vertalign_Baseline;

        if ( undefined != Props.Strikeout )
        {
            TextPr.Strikeout  = Props.Strikeout;
            TextPr.DStrikeout = false;
        }

        if ( undefined != Props.DStrikeout )
        {
            TextPr.DStrikeout = Props.DStrikeout;
            if ( true === TextPr.DStrikeout )
                TextPr.Strikeout = false;
        }

        if ( undefined != Props.SmallCaps )
        {
            TextPr.SmallCaps = Props.SmallCaps;
            TextPr.AllCaps   = false;
        }

        if ( undefined != Props.AllCaps )
        {
            TextPr.Caps = Props.AllCaps;
            if ( true === TextPr.AllCaps )
                TextPr.SmallCaps = false;
        }

        if ( undefined != Props.TextSpacing )
            TextPr.Spacing = Props.TextSpacing;

        if ( undefined != Props.Position )
            TextPr.Position = Props.Position;

        this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr(TextPr) );
        this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
    }
};

asc_docs_api.prototype.put_PrAlign = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetParagraphAlign);
        this.WordControl.m_oLogicDocument.Set_ParagraphAlign(value);
    }
};
// 0- baseline, 2-subscript, 1-superscript
asc_docs_api.prototype.put_TextPrBaseline = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetTextVertAlign);
    	this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { VertAlign : value } ) );
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
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        var NumberInfo =
        {
            Type    : 0,
            SubType : -1
        };

        NumberInfo.Type = type;
        NumberInfo.SubType = subtype;
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetParagraphNumbering);
        this.WordControl.m_oLogicDocument.Set_ParagraphNumbering( NumberInfo );
    }
};
asc_docs_api.prototype.put_Style = function(name)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetParagraphStyle);
        this.WordControl.m_oLogicDocument.Set_ParagraphStyle(name);
    }
};

asc_docs_api.prototype.SetDeviceInputHelperId = function(idKeyboard)
{
    if (window.ID_KEYBOARD_AREA === undefined && this.WordControl.m_oMainView != null)
    {
        window.ID_KEYBOARD_AREA = document.getElementById(idKeyboard);

        window.ID_KEYBOARD_AREA.onkeypress = function(e){
            if (false === editor.WordControl.IsFocus)
            {
                editor.WordControl.IsFocus = true;
                var ret = editor.WordControl.onKeyPress(e);
                editor.WordControl.IsFocus = false;
                return ret;
            }
        }
        window.ID_KEYBOARD_AREA.onkeydown = function(e){
            if (false === editor.WordControl.IsFocus)
            {
                editor.WordControl.IsFocus = true;
                var ret = editor.WordControl.onKeyDown(e);
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

asc_docs_api.prototype.put_ShowParaMarks = function(isShow)
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

    if ( true === this.isMarkerFormat )
        this.sync_MarkerFormatCallback( false );

    return this.ShowParaMarks;
};
asc_docs_api.prototype.get_ShowParaMarks = function(){
    return this.ShowParaMarks;
};
asc_docs_api.prototype.put_ShowTableEmptyLine = function(isShow)
{
    this.isShowTableEmptyLine = isShow;
    this.WordControl.OnRePaintAttack();

    if ( true === this.isMarkerFormat )
        this.sync_MarkerFormatCallback( false );

    return this.isShowTableEmptyLine;
};
asc_docs_api.prototype.get_ShowTableEmptyLine = function(){
    return this.isShowTableEmptyLine;
};
asc_docs_api.prototype.put_PageBreak = function(isBreak)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.isPageBreakBefore = isBreak;
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetParagraphPageBreakBefore);
        this.WordControl.m_oLogicDocument.Set_ParagraphPageBreakBefore(isBreak);
        this.sync_PageBreakCallback(isBreak);
    }
};

asc_docs_api.prototype.put_WidowControl = function(bValue)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetParagraphWidowControl);
        this.WordControl.m_oLogicDocument.Set_ParagraphWidowControl(bValue);
        this.sync_WidowControlCallback(bValue);
    }
};

asc_docs_api.prototype.put_KeepLines = function(isKeepLines)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.isKeepLinesTogether = isKeepLines;
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetParagraphKeepLines);
        this.WordControl.m_oLogicDocument.Set_ParagraphKeepLines(isKeepLines);
        this.sync_KeepLinesCallback(isKeepLines);
    }
};

asc_docs_api.prototype.put_KeepNext = function(isKeepNext)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetParagraphKeepNext);
        this.WordControl.m_oLogicDocument.Set_ParagraphKeepNext(isKeepNext);
        this.sync_KeepNextCallback(isKeepNext);
    }
};

asc_docs_api.prototype.put_AddSpaceBetweenPrg = function(isSpacePrg)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.isAddSpaceBetweenPrg = isSpacePrg;
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetParagraphContextualSpacing);
        this.WordControl.m_oLogicDocument.Set_ParagraphContextualSpacing(isSpacePrg);
    }
};
asc_docs_api.prototype.put_LineHighLight = function(is_flag, r, g, b)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        if (false === is_flag)
        {
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetTextHighlightNone);
            this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { HighLight : highlight_None  } ) );
        }
        else
        {
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetTextHighlightColor);
            this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { HighLight :  { r : r, g : g, b: b}  } ) );
        }
    }
};
asc_docs_api.prototype.put_TextColor = function(color)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetTextColor);
        
        if ( true === color.Auto )
        {
            this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { Color : { Auto : true, r : 0, g : 0, b : 0 }, Unifill : undefined } ) );   
        }
        else
        {
            var Unifill = new CUniFill();
            Unifill.fill = new CSolidFill();
            Unifill.fill.color = CorrectUniColor(color, Unifill.fill.color, 1);
            this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { Unifill : Unifill} ) );
        }

        if ( true === this.isMarkerFormat )
            this.sync_MarkerFormatCallback( false );
    }
};
asc_docs_api.prototype.put_ParagraphShade = function(is_flag, color, isOnlyPara)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetParagraphShd);

        if (true === isOnlyPara)
            this.WordControl.m_oLogicDocument.Set_UseTextShd(false);

        if (false === is_flag)
            this.WordControl.m_oLogicDocument.Set_ParagraphShd( { Value : shd_Nil  }  );
        else
        {
            var Unifill = new CUniFill();
            Unifill.fill = new CSolidFill();
            Unifill.fill.color = CorrectUniColor(color, Unifill.fill.color, 1);
            this.WordControl.m_oLogicDocument.Set_ParagraphShd( { Value : shd_Clear, Color : { r : color.asc_getR(), g : color.asc_getG(), b : color.asc_getB() }, Unifill: Unifill } );
        }

        this.WordControl.m_oLogicDocument.Set_UseTextShd(true);
    }
};
asc_docs_api.prototype.put_PrIndent = function(value,levelValue)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetParagraphIndent);
        this.WordControl.m_oLogicDocument.Set_ParagraphIndent( { Left : value, ChangeLevel: levelValue } );
    }
};
asc_docs_api.prototype.IncreaseIndent = function()
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_IncParagraphIndent);
        this.WordControl.m_oLogicDocument.Paragraph_IncDecIndent( true );
    }
};
asc_docs_api.prototype.DecreaseIndent = function()
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_DecParagraphIndent);
        this.WordControl.m_oLogicDocument.Paragraph_IncDecIndent( false );
    }
};
asc_docs_api.prototype.put_PrIndentRight = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetParagraphIndentRight);
        this.WordControl.m_oLogicDocument.Set_ParagraphIndent( { Right : value } );
    }
};
asc_docs_api.prototype.put_PrFirstLineIndent = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetParagraphIndentFirstLine);
	    this.WordControl.m_oLogicDocument.Set_ParagraphIndent( { FirstLine : value } );
    }
};
asc_docs_api.prototype.put_Margins = function(left, top, right, bottom)
{
	this.WordControl.m_oLogicDocument.Set_DocumentMargin( { Left : left, Top : top, Right : right, Bottom : bottom });
};
asc_docs_api.prototype.getFocusObject = function(){//возвратит тип элемента - параграф c_oAscTypeSelectElement.Paragraph, изображение c_oAscTypeSelectElement.Image, таблица c_oAscTypeSelectElement.Table, колонтитул c_oAscTypeSelectElement.Header.

};

/*callbacks*/
asc_docs_api.prototype.sync_VerticalAlign = function(typeBaseline){
	this.asc_fireCallback("asc_onVerticalAlign",typeBaseline);
};
asc_docs_api.prototype.sync_PrAlignCallBack = function(value){
	this.asc_fireCallback("asc_onPrAlign",value);
};
asc_docs_api.prototype.sync_ListType = function(NumPr){
    this.asc_fireCallback("asc_onListType", new asc_CListType( NumPr ) );
};
asc_docs_api.prototype.sync_TextColor = function(TextPr)
{
    if(TextPr.Unifill && TextPr.Unifill.fill && TextPr.Unifill.fill.type === FILL_TYPE_SOLID && TextPr.Unifill.fill.color)
    {
        this.asc_fireCallback("asc_onTextColor", CreateAscColor(TextPr.Unifill.fill.color));
    }
    else if( undefined != TextPr.Color )
    {
        this.asc_fireCallback("asc_onTextColor", CreateAscColorCustom( TextPr.Color.r, TextPr.Color.g, TextPr.Color.b, TextPr.Color.Auto ));
    }
};
asc_docs_api.prototype.sync_TextHighLight = function(HighLight)
{
    if ( undefined != HighLight )
	    this.asc_fireCallback("asc_onTextHighLight", new CColor( HighLight.r, HighLight.g, HighLight.b ) );
};
asc_docs_api.prototype.sync_TextSpacing = function(Spacing)
{
    this.asc_fireCallback("asc_onTextSpacing", Spacing );
};
asc_docs_api.prototype.sync_TextDStrikeout = function(Value)
{
    this.asc_fireCallback("asc_onTextDStrikeout", Value );
};
asc_docs_api.prototype.sync_TextCaps = function(Value)
{
    this.asc_fireCallback("asc_onTextCaps", Value );
};
asc_docs_api.prototype.sync_TextSmallCaps = function(Value)
{
    this.asc_fireCallback("asc_onTextSmallCaps", Value );
};
asc_docs_api.prototype.sync_TextPosition = function(Value)
{
    this.asc_fireCallback("asc_onTextPosition", Value );
};
asc_docs_api.prototype.sync_TextLangCallBack = function(Lang)
{
    this.asc_fireCallback("asc_onTextLanguage", Lang.Val );
};
asc_docs_api.prototype.sync_ParaStyleName = function(Name){
	this.asc_fireCallback("asc_onParaStyleName",Name);
};
asc_docs_api.prototype.sync_ParaSpacingLine = function(SpacingLine)
{
    if ( true === SpacingLine.AfterAutoSpacing )
        SpacingLine.After = spacing_Auto;
    else if ( undefined === SpacingLine.AfterAutoSpacing )
        SpacingLine.After = UnknownValue;

    if ( true === SpacingLine.BeforeAutoSpacing )
        SpacingLine.Before = spacing_Auto;
    else if ( undefined === SpacingLine.BeforeAutoSpacing )
        SpacingLine.Before = UnknownValue;

	this.asc_fireCallback("asc_onParaSpacingLine", new asc_CParagraphSpacing( SpacingLine ));
};
asc_docs_api.prototype.sync_PageBreakCallback = function(isBreak){
	this.asc_fireCallback("asc_onPageBreak",isBreak);
};

asc_docs_api.prototype.sync_WidowControlCallback = function(bValue)
{
    this.asc_fireCallback("asc_onWidowControl",bValue);
};

asc_docs_api.prototype.sync_KeepNextCallback = function(bValue)
{
    this.asc_fireCallback("asc_onKeepNext",bValue);
};

asc_docs_api.prototype.sync_KeepLinesCallback = function(isKeepLines){
	this.asc_fireCallback("asc_onKeepLines",isKeepLines);
};
asc_docs_api.prototype.sync_ShowParaMarksCallback = function(){
	this.asc_fireCallback("asc_onShowParaMarks");
};
asc_docs_api.prototype.sync_SpaceBetweenPrgCallback = function(){
	this.asc_fireCallback("asc_onSpaceBetweenPrg");
};
asc_docs_api.prototype.sync_PrPropCallback = function(prProp){
    var _len = this.SelectedObjectsStack.length;
    if (_len > 0)
    {
        if (this.SelectedObjectsStack[_len - 1].Type == c_oAscTypeSelectElement.Paragraph)
        {
            this.SelectedObjectsStack[_len - 1].Value = new asc_CParagraphProperty( prProp );
            return;
        }
    }

    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject( c_oAscTypeSelectElement.Paragraph, new asc_CParagraphProperty( prProp ) );
};

asc_docs_api.prototype.sync_MathPropCallback = function(MathProp)
{
    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject(c_oAscTypeSelectElement.Math, new CMathProp(MathProp));
};

asc_docs_api.prototype.sync_EndAddShape = function()
{
    editor.asc_fireCallback("asc_onEndAddShape");
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

/*----------------------------------------------------------------*/
/*functions for working with page*/
asc_docs_api.prototype.change_PageOrient = function(isPortrait)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Document_SectPr) )
    {
        this.WordControl.m_oDrawingDocument.m_bIsUpdateDocSize = true;
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetPageOrientation);
        if (isPortrait)
        {
            this.WordControl.m_oLogicDocument.Set_DocumentOrientation(orientation_Portrait);
            this.DocumentOrientation = isPortrait;
        }
        else
        {
            this.WordControl.m_oLogicDocument.Set_DocumentOrientation(orientation_Landscape);
            this.DocumentOrientation = isPortrait;
        }
        this.sync_PageOrientCallback(editor.get_DocumentOrientation());
    }
};
asc_docs_api.prototype.get_DocumentOrientation = function()
{
	return this.DocumentOrientation;
};
asc_docs_api.prototype.change_DocSize = function(width,height)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Document_SectPr) )
    {
        this.WordControl.m_oDrawingDocument.m_bIsUpdateDocSize = true;
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetPageSize);
        if (this.DocumentOrientation)
            this.WordControl.m_oLogicDocument.Set_DocumentPageSize(width, height);
        else
            this.WordControl.m_oLogicDocument.Set_DocumentPageSize(height, width);
    }
};

asc_docs_api.prototype.get_DocumentWidth = function()
{
    return Page_Width;
};

asc_docs_api.prototype.get_DocumentHeight = function()
{
    return Page_Height;
};

asc_docs_api.prototype.put_AddPageBreak = function()
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        var Document = this.WordControl.m_oLogicDocument;

        if ( null === Document.Hyperlink_Check(false) )
        {
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_AddPageBreak);
            this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaNewLine( break_Page ) );
        }
    }
};
asc_docs_api.prototype.Update_ParaInd = function( Ind ){
	var FirstLine = 0,
		Left = 0,
		Right = 0;
	if ( "undefined" != typeof(Ind) )
	{
		if("undefined" != typeof(Ind.FirstLine))
		{
			FirstLine = Ind.FirstLine;
		}
		if("undefined" != typeof(Ind.Left))
		{
			Left = Ind.Left;
		}
		if("undefined" != typeof(Ind.Right))
		{
			Right = Ind.Right;
		}
	}

    var bIsUpdate = false;
    var _ruler = this.WordControl.m_oHorRuler;
    if (_ruler.m_dIndentLeft != Left)
    {
        _ruler.m_dIndentLeft = Left;
        bIsUpdate = true;
    }
    if (_ruler != (FirstLine + Left))
    {
        _ruler.m_dIndentLeftFirst = (FirstLine + Left);
        bIsUpdate = true;
    }
    if (_ruler.m_dIndentRight != Right)
    {
        _ruler.m_dIndentRight = Right;
        bIsUpdate = true;
    }
    if (bIsUpdate)
        this.WordControl.UpdateHorRuler();
};
asc_docs_api.prototype.Internal_Update_Ind_FirstLine = function(FirstLine,Left){
	if (this.WordControl.m_oHorRuler.m_dIndentLeftFirst != (FirstLine + Left))
    {
        this.WordControl.m_oHorRuler.m_dIndentLeftFirst = (FirstLine + Left);
	    this.WordControl.UpdateHorRuler();
    }
};
asc_docs_api.prototype.Internal_Update_Ind_Left = function(Left){
    if (this.WordControl.m_oHorRuler.m_dIndentLeft != Left)
    {
        this.WordControl.m_oHorRuler.m_dIndentLeft = Left;
        this.WordControl.UpdateHorRuler();
    }
};
asc_docs_api.prototype.Internal_Update_Ind_Right = function(Right){
    if (this.WordControl.m_oHorRuler.m_dIndentRight != Right)
    {
        this.WordControl.m_oHorRuler.m_dIndentRight = Right;
        this.WordControl.UpdateHorRuler();
    }
};

// "where" где нижний или верхний, align выравнивание
asc_docs_api.prototype.put_PageNum = function(where,align)
{
    if ( where >= 0 )
    {
        if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_None, { Type : changestype_2_HdrFtr }) )
        {
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_AddPageNumToHdrFtr);
            this.WordControl.m_oLogicDocument.Document_AddPageNum( where, align );
        }
    }
    else
    {
        if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
        {
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_AddPageNumToCurrentPos);
            this.WordControl.m_oLogicDocument.Document_AddPageNum( where, align );
        }
    }
};

asc_docs_api.prototype.put_HeadersAndFootersDistance = function(value)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_HdrFtr) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetHdrFtrDistance);
        this.WordControl.m_oLogicDocument.Document_SetHdrFtrDistance(value);
    }
};

asc_docs_api.prototype.HeadersAndFooters_DifferentFirstPage = function(isOn)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_HdrFtr) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetHdrFtrFirstPage);
        this.WordControl.m_oLogicDocument.Document_SetHdrFtrFirstPage( isOn );
    }
};

asc_docs_api.prototype.HeadersAndFooters_DifferentOddandEvenPage = function(isOn)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_HdrFtr) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetHdrFtrEvenAndOdd);
        this.WordControl.m_oLogicDocument.Document_SetHdrFtrEvenAndOddHeaders( isOn );
    }
};

asc_docs_api.prototype.HeadersAndFooters_LinkToPrevious = function(isOn)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_HdrFtr) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetHdrFtrLink);
        this.WordControl.m_oLogicDocument.Document_SetHdrFtrLink( isOn );
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
asc_docs_api.prototype.sync_DocSizeCallback = function(width,height){
	this.asc_fireCallback("asc_onDocSize",width,height);
};
asc_docs_api.prototype.sync_PageOrientCallback = function(isPortrait){
    this.asc_fireCallback("asc_onPageOrient",isPortrait);
};
asc_docs_api.prototype.sync_HeadersAndFootersPropCallback = function(hafProp)
{
    if ( true === hafProp )
        hafProp.Locked = true;

    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject( c_oAscTypeSelectElement.Header, new CHeaderProp( hafProp ) );
};

/*----------------------------------------------------------------*/
/*functions for working with table*/
asc_docs_api.prototype.put_Table = function(col,row)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Document_Content_Add) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_AddTable);
        this.WordControl.m_oLogicDocument.Add_InlineTable(col,row);
    }
};
asc_docs_api.prototype.addRowAbove = function(count)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_TableAddRowAbove);
        this.WordControl.m_oLogicDocument.Table_AddRow(true);
    }
};
asc_docs_api.prototype.addRowBelow = function(count)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_TableAddRowBelow);
        this.WordControl.m_oLogicDocument.Table_AddRow(false);
    }
};
asc_docs_api.prototype.addColumnLeft = function(count)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_TableAddColumnLeft);
        this.WordControl.m_oLogicDocument.Table_AddCol(true);
    }
};
asc_docs_api.prototype.addColumnRight = function(count)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_TableAddColumnRight);
        this.WordControl.m_oLogicDocument.Table_AddCol(false);
    }
};
asc_docs_api.prototype.remRow = function()
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_RemoveCells) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_TableRemoveRow);
        this.WordControl.m_oLogicDocument.Table_RemoveRow();
    }
};
asc_docs_api.prototype.remColumn = function()
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_RemoveCells) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_TableRemoveColumn);
        this.WordControl.m_oLogicDocument.Table_RemoveCol();
    }
};
asc_docs_api.prototype.remTable = function()
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_RemoveCells) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_RemoveTable);
        this.WordControl.m_oLogicDocument.Table_RemoveTable();
    }
};
asc_docs_api.prototype.selectRow = function()
{
    this.WordControl.m_oLogicDocument.Table_Select( c_oAscTableSelectionType.Row );
};
asc_docs_api.prototype.selectColumn = function()
{
    this.WordControl.m_oLogicDocument.Table_Select( c_oAscTableSelectionType.Column );
};
asc_docs_api.prototype.selectCell = function()
{
    this.WordControl.m_oLogicDocument.Table_Select( c_oAscTableSelectionType.Cell );
};
asc_docs_api.prototype.selectTable = function()
{
    this.WordControl.m_oLogicDocument.Table_Select( c_oAscTableSelectionType.Table );
};
asc_docs_api.prototype.setColumnWidth = function(width){

};
asc_docs_api.prototype.setRowHeight = function(height){

};
asc_docs_api.prototype.set_TblDistanceFromText = function(left,top,right,bottom){

};
asc_docs_api.prototype.CheckBeforeMergeCells = function()
{
    return this.WordControl.m_oLogicDocument.Table_CheckMerge();
};
asc_docs_api.prototype.CheckBeforeSplitCells = function()
{
    return this.WordControl.m_oLogicDocument.Table_CheckSplit();
};
asc_docs_api.prototype.MergeCells = function()
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_MergeTableCells);
        this.WordControl.m_oLogicDocument.Table_MergeCells();
    }
};
asc_docs_api.prototype.SplitCell = function(Cols, Rows)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_Properties) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SplitTableCells);
        this.WordControl.m_oLogicDocument.Table_SplitCell(Cols, Rows);
    }
};
asc_docs_api.prototype.widthTable = function(width){

};
asc_docs_api.prototype.put_CellsMargin = function(left,top,right,bottom){

};
asc_docs_api.prototype.set_TblWrap = function(type){

};
asc_docs_api.prototype.set_TblIndentLeft = function(spacing){

};
asc_docs_api.prototype.set_Borders = function(typeBorders,size,Color){//если size == 0 то границы нет.

};
asc_docs_api.prototype.set_TableBackground = function(Color){

};
asc_docs_api.prototype.set_AlignCell = function(align){// c_oAscAlignType.RIGHT, c_oAscAlignType.LEFT, c_oAscAlignType.CENTER
	switch(align)
	{
		case c_oAscAlignType.LEFT : break;
		case c_oAscAlignType.CENTER : break;
		case c_oAscAlignType.RIGHT : break;
	}
};
asc_docs_api.prototype.set_TblAlign = function(align){// c_oAscAlignType.RIGHT, c_oAscAlignType.LEFT, c_oAscAlignType.CENTER
	switch(align)
	{
		case c_oAscAlignType.LEFT : break;
		case c_oAscAlignType.CENTER : break;
		case c_oAscAlignType.RIGHT : break;
	}
};
asc_docs_api.prototype.set_SpacingBetweenCells = function(isOn,spacing){// c_oAscAlignType.RIGHT, c_oAscAlignType.LEFT, c_oAscAlignType.CENTER
	if(isOn){

	}
};

// CBackground
// Value : тип заливки(прозрачная или нет),
// Color : { r : 0, g : 0, b : 0 }
function CBackground (obj)
{
	if (obj)
	{
		this.Color = (undefined != obj.Color && null != obj.Color) ? CreateAscColorCustom(obj.Color.r, obj.Color.g, obj.Color.b) : null;
		this.Value = (undefined != obj.Value) ? obj.Value : null;
	}
	else
	{
		this.Color = CreateAscColorCustom(0, 0, 0);
		this.Value = 1;
	}
}
CBackground.prototype.get_Color = function (){return this.Color;};
CBackground.prototype.put_Color = function (v){this.Color = (v) ? v: null;};
CBackground.prototype.get_Value = function (){return this.Value;};
CBackground.prototype.put_Value = function (v){this.Value = v;};

function CTablePositionH(obj)
{
    if ( obj )
    {
        this.RelativeFrom = ( undefined === obj.RelativeFrom ) ? c_oAscHAnchor.Margin : obj.RelativeFrom;
        this.UseAlign     = ( undefined === obj.UseAlign     ) ? false                : obj.UseAlign;
        this.Align        = ( undefined === obj.Align        ) ? undefined            : obj.Align;
        this.Value        = ( undefined === obj.Value        ) ? 0                    : obj.Value;
    }
    else
    {
        this.RelativeFrom = c_oAscHAnchor.Column;
        this.UseAlign     = false;
        this.Align        = undefined;
        this.Value        = 0;
    }
}

CTablePositionH.prototype.get_RelativeFrom = function()  { return this.RelativeFrom; };
CTablePositionH.prototype.put_RelativeFrom = function(v) { this.RelativeFrom = v; };
CTablePositionH.prototype.get_UseAlign = function()  { return this.UseAlign; };
CTablePositionH.prototype.put_UseAlign = function(v) { this.UseAlign = v; };
CTablePositionH.prototype.get_Align = function()  { return this.Align; };
CTablePositionH.prototype.put_Align = function(v) { this.Align = v; };
CTablePositionH.prototype.get_Value = function()  { return this.Value; };
CTablePositionH.prototype.put_Value = function(v) { this.Value = v; };

function CTablePositionV(obj)
{
    if ( obj )
    {
        this.RelativeFrom = ( undefined === obj.RelativeFrom ) ? c_oAscVAnchor.Text : obj.RelativeFrom;
        this.UseAlign     = ( undefined === obj.UseAlign     ) ? false              : obj.UseAlign;
        this.Align        = ( undefined === obj.Align        ) ? undefined          : obj.Align;
        this.Value        = ( undefined === obj.Value        ) ? 0                  : obj.Value;
    }
    else
    {
        this.RelativeFrom = c_oAscVAnchor.Text;
        this.UseAlign     = false;
        this.Align        = undefined;
        this.Value        = 0;
    }
}

CTablePositionV.prototype.get_RelativeFrom = function()  { return this.RelativeFrom; };
CTablePositionV.prototype.put_RelativeFrom = function(v) { this.RelativeFrom = v; };
CTablePositionV.prototype.get_UseAlign = function()  { return this.UseAlign; };
CTablePositionV.prototype.put_UseAlign = function(v) { this.UseAlign = v; };
CTablePositionV.prototype.get_Align = function()  { return this.Align; };
CTablePositionV.prototype.put_Align = function(v) { this.Align = v; };
CTablePositionV.prototype.get_Value = function()  { return this.Value; };
CTablePositionV.prototype.put_Value = function(v) { this.Value = v; };

function CTablePropLook(obj)
{
    this.FirstCol = false;
    this.FirstRow = false;
    this.LastCol  = false;
    this.LastRow  = false;
    this.BandHor  = false;
    this.BandVer  = false;

    if ( obj )
    {
        this.FirstCol = ( undefined === obj.m_bFirst_Col ? false : obj.m_bFirst_Col );
        this.FirstRow = ( undefined === obj.m_bFirst_Row ? false : obj.m_bFirst_Row );
        this.LastCol  = ( undefined === obj.m_bLast_Col  ? false : obj.m_bLast_Col );
        this.LastRow  = ( undefined === obj.m_bLast_Row  ? false : obj.m_bLast_Row );
        this.BandHor  = ( undefined === obj.m_bBand_Hor  ? false : obj.m_bBand_Hor );
        this.BandVer  = ( undefined === obj.m_bBand_Ver  ? false : obj.m_bBand_Ver );
    }
}

CTablePropLook.prototype.get_FirstCol = function() {return this.FirstCol;};
CTablePropLook.prototype.put_FirstCol = function(v) {this.FirstCol = v;};
CTablePropLook.prototype.get_FirstRow = function() {return this.FirstRow;};
CTablePropLook.prototype.put_FirstRow = function(v) {this.FirstRow = v;};
CTablePropLook.prototype.get_LastCol = function() {return this.LastCol;};
CTablePropLook.prototype.put_LastCol = function(v) {this.LastCol = v;};
CTablePropLook.prototype.get_LastRow = function() {return this.LastRow;};
CTablePropLook.prototype.put_LastRow = function(v) {this.LastRow = v;};
CTablePropLook.prototype.get_BandHor = function() {return this.BandHor;};
CTablePropLook.prototype.put_BandHor = function(v) {this.BandHor = v;};
CTablePropLook.prototype.get_BandVer = function() {return this.BandVer;};
CTablePropLook.prototype.put_BandVer = function(v) {this.BandVer = v;};

function CTableProp (tblProp)
{
	if (tblProp)
	{
        this.CanBeFlow = (undefined != tblProp.CanBeFlow ? tblProp.CanBeFlow : false );
        this.CellSelect = (undefined != tblProp.CellSelect ? tblProp.CellSelect : false );
        this.CellSelect = (undefined != tblProp.CellSelect) ? tblProp.CellSelect : false;
		this.TableWidth = (undefined != tblProp.TableWidth) ? tblProp.TableWidth : null;
		this.TableSpacing = (undefined != tblProp.TableSpacing) ? tblProp.TableSpacing : null;
		this.TableDefaultMargins = (undefined != tblProp.TableDefaultMargins && null != tblProp.TableDefaultMargins) ? new asc_CPaddings (tblProp.TableDefaultMargins) : null;

		this.CellMargins = (undefined != tblProp.CellMargins && null != tblProp.CellMargins) ? new CMargins (tblProp.CellMargins) : null;

		this.TableAlignment = (undefined != tblProp.TableAlignment) ? tblProp.TableAlignment : null;
		this.TableIndent = (undefined != tblProp.TableIndent) ? tblProp.TableIndent : null;
		this.TableWrappingStyle = (undefined != tblProp.TableWrappingStyle) ? tblProp.TableWrappingStyle : null;

		this.TablePaddings = (undefined != tblProp.TablePaddings && null != tblProp.TablePaddings) ? new asc_CPaddings (tblProp.TablePaddings) : null;

		this.TableBorders = (undefined != tblProp.TableBorders && null != tblProp.TableBorders) ? new CBorders (tblProp.TableBorders) : null;
		this.CellBorders = (undefined != tblProp.CellBorders && null != tblProp.CellBorders) ? new CBorders (tblProp.CellBorders) : null;
		this.TableBackground = (undefined != tblProp.TableBackground && null != tblProp.TableBackground) ? new CBackground (tblProp.TableBackground) : null;
		this.CellsBackground = (undefined != tblProp.CellsBackground && null != tblProp.CellsBackground) ? new CBackground (tblProp.CellsBackground) : null;
		this.Position = (undefined != tblProp.Position && null != tblProp.Position) ? new CPosition (tblProp.Position) : null;
        this.PositionH = ( undefined != tblProp.PositionH && null != tblProp.PositionH ) ? new CTablePositionH(tblProp.PositionH) : undefined;
        this.PositionV = ( undefined != tblProp.PositionV && null != tblProp.PositionV ) ? new CTablePositionV(tblProp.PositionV) : undefined;
        this.Internal_Position = ( undefined != tblProp.Internal_Position ) ? tblProp.Internal_Position : undefined;

        this.ForSelectedCells = (undefined != tblProp.ForSelectedCells) ? tblProp.ForSelectedCells : true;
        this.TableStyle = (undefined != tblProp.TableStyle) ? tblProp.TableStyle : null;
        this.TableLook = (undefined != tblProp.TableLook) ? new CTablePropLook(tblProp.TableLook) : null;
        this.RowsInHeader = (undefined != tblProp.RowsInHeader) ? tblProp.RowsInHeader : 0;
        this.CellsVAlign = (undefined != tblProp.CellsVAlign) ? tblProp.CellsVAlign :c_oAscVertAlignJc.Top;
        this.AllowOverlap = (undefined != tblProp.AllowOverlap) ? tblProp.AllowOverlap : undefined;
        this.TableLayout  = tblProp.TableLayout;
        this.Locked = (undefined != tblProp.Locked) ? tblProp.Locked : false;
	}
	else
	{
		//Все свойства класса CTableProp должны быть undefined если они не изменялись
        //this.CanBeFlow = false;
        this.CellSelect = false; //обязательное свойство
		/*this.TableWidth = null;
		this.TableSpacing = null;
		this.TableDefaultMargins = new asc_CPaddings ();

		this.CellMargins = new CMargins ();

		this.TableAlignment = 0;
		this.TableIndent = 0;
		this.TableWrappingStyle = c_oAscWrapStyle.Inline;

		this.TablePaddings = new asc_CPaddings ();

		this.TableBorders = new CBorders ();
		this.CellBorders = new CBorders ();
		this.TableBackground = new CBackground ();
		this.CellsBackground = new CBackground ();;
		this.Position = new CPosition ();
		this.ForSelectedCells = true;*/

        this.Locked = false;
	}
}

CTableProp.prototype.get_Width = function (){return this.TableWidth;};
CTableProp.prototype.put_Width = function (v){this.TableWidth = v;};
CTableProp.prototype.get_Spacing = function (){return this.TableSpacing;};
CTableProp.prototype.put_Spacing = function (v){this.TableSpacing = v;};
CTableProp.prototype.get_DefaultMargins = function (){return this.TableDefaultMargins;};
CTableProp.prototype.put_DefaultMargins = function (v){this.TableDefaultMargins = v;};
CTableProp.prototype.get_CellMargins = function (){return this.CellMargins;};
CTableProp.prototype.put_CellMargins = function (v){ this.CellMargins = v;};
CTableProp.prototype.get_TableAlignment = function (){return this.TableAlignment;};
CTableProp.prototype.put_TableAlignment = function (v){this.TableAlignment = v;};
CTableProp.prototype.get_TableIndent = function (){return this.TableIndent;};
CTableProp.prototype.put_TableIndent = function (v){this.TableIndent = v;};
CTableProp.prototype.get_TableWrap = function (){return this.TableWrappingStyle;};
CTableProp.prototype.put_TableWrap = function (v){this.TableWrappingStyle = v;};
CTableProp.prototype.get_TablePaddings = function (){return this.TablePaddings;};
CTableProp.prototype.put_TablePaddings = function (v){this.TablePaddings = v;};
CTableProp.prototype.get_TableBorders = function (){return this.TableBorders;};
CTableProp.prototype.put_TableBorders = function (v){this.TableBorders = v;};
CTableProp.prototype.get_CellBorders = function (){return this.CellBorders;};
CTableProp.prototype.put_CellBorders = function (v){this.CellBorders = v;};
CTableProp.prototype.get_TableBackground = function (){return this.TableBackground;};
CTableProp.prototype.put_TableBackground = function (v){this.TableBackground = v;};
CTableProp.prototype.get_CellsBackground = function (){return this.CellsBackground;};
CTableProp.prototype.put_CellsBackground = function (v){this.CellsBackground = v;};
CTableProp.prototype.get_Position = function (){return this.Position;};
CTableProp.prototype.put_Position = function (v){this.Position = v;};
CTableProp.prototype.get_PositionH = function(){return this.PositionH;};
CTableProp.prototype.put_PositionH = function(v){this.PositionH = v;};
CTableProp.prototype.get_PositionV = function(){return this.PositionV;};
CTableProp.prototype.put_PositionV = function(v){this.PositionV = v;};
CTableProp.prototype.get_Value_X = function(RelativeFrom) { if ( undefined != this.Internal_Position ) return this.Internal_Position.Calculate_X_Value(RelativeFrom);  return 0; };
CTableProp.prototype.get_Value_Y = function(RelativeFrom) { if ( undefined != this.Internal_Position ) return this.Internal_Position.Calculate_Y_Value(RelativeFrom);  return 0; };
CTableProp.prototype.get_ForSelectedCells = function (){return this.ForSelectedCells;};
CTableProp.prototype.put_ForSelectedCells = function (v){this.ForSelectedCells = v;};
CTableProp.prototype.put_CellSelect = function(v){this.CellSelect = v;};
CTableProp.prototype.get_CellSelect = function(){return this.CellSelect};
CTableProp.prototype.get_CanBeFlow = function(){return this.CanBeFlow;};
CTableProp.prototype.get_RowsInHeader = function(){return this.RowsInHeader;};
CTableProp.prototype.put_RowsInHeader = function(v){this.RowsInHeader = v;};
CTableProp.prototype.get_Locked = function() { return this.Locked; };
CTableProp.prototype.get_CellsVAlign = function() { return this.CellsVAlign; };
CTableProp.prototype.put_CellsVAlign = function(v){ this.CellsVAlign = v; };
CTableProp.prototype.get_TableLook = function() {return this.TableLook;};
CTableProp.prototype.put_TableLook = function(v){this.TableLook = v;};
CTableProp.prototype.get_TableStyle = function() {return this.TableStyle;};
CTableProp.prototype.put_TableStyle = function(v){this.TableStyle = v;};
CTableProp.prototype.get_AllowOverlap = function() {return this.AllowOverlap;};
CTableProp.prototype.put_AllowOverlap = function(v){this.AllowOverlap = v;};
CTableProp.prototype.get_TableLayout = function() {return this.TableLayout;};
CTableProp.prototype.put_TableLayout = function(v){this.TableLayout = v;};

function CBorders (obj)
{
	if (obj)
	{
		this.Left = (undefined != obj.Left && null != obj.Left) ? new asc_CTextBorder (obj.Left) : null;
		this.Top = (undefined != obj.Top && null != obj.Top) ? new asc_CTextBorder (obj.Top) : null;
		this.Right = (undefined != obj.Right && null != obj.Right) ? new asc_CTextBorder (obj.Right) : null;
		this.Bottom = (undefined != obj.Bottom && null != obj.Bottom) ? new asc_CTextBorder (obj.Bottom) : null;
		this.InsideH = (undefined != obj.InsideH && null != obj.InsideH) ? new asc_CTextBorder (obj.InsideH) : null;
		this.InsideV = (undefined != obj.InsideV && null != obj.InsideV) ? new asc_CTextBorder (obj.InsideV) : null;
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
CBorders.prototype.get_Left = function(){return this.Left; };
CBorders.prototype.put_Left = function(v){this.Left = (v) ? new asc_CTextBorder (v) : null;};
CBorders.prototype.get_Top = function(){return this.Top; };
CBorders.prototype.put_Top = function(v){this.Top = (v) ? new asc_CTextBorder (v) : null;};
CBorders.prototype.get_Right = function(){return this.Right; };
CBorders.prototype.put_Right = function(v){this.Right = (v) ? new asc_CTextBorder (v) : null;};
CBorders.prototype.get_Bottom = function(){return this.Bottom; };
CBorders.prototype.put_Bottom = function(v){this.Bottom = (v) ? new asc_CTextBorder (v) : null;};
CBorders.prototype.get_InsideH = function(){return this.InsideH; };
CBorders.prototype.put_InsideH = function(v){this.InsideH = (v) ? new asc_CTextBorder (v) : null;};
CBorders.prototype.get_InsideV = function(){return this.InsideV; };
CBorders.prototype.put_InsideV = function(v){this.InsideV = (v) ? new asc_CTextBorder (v) : null;};


// CMargins
function CMargins (obj)
{
	if (obj)
	{
		this.Left = (undefined != obj.Left) ? obj.Left : null;
		this.Right = (undefined != obj.Right) ? obj.Right : null;
		this.Top = (undefined != obj.Top) ? obj.Top : null;
		this.Bottom = (undefined != obj.Bottom) ? obj.Bottom : null;
		this.Flag = (undefined != obj.Flag) ? obj.Flag : null;
	}
	else
	{
		this.Left = null;
		this.Right = null;
		this.Top = null;
		this.Bottom = null;
		this.Flag = null;
	}
}
CMargins.prototype.get_Left = function(){return this.Left; };
CMargins.prototype.put_Left = function(v){this.Left = v;};
CMargins.prototype.get_Right = function(){return this.Right; };
CMargins.prototype.put_Right = function(v){this.Right = v;};
CMargins.prototype.get_Top = function(){return this.Top; };
CMargins.prototype.put_Top = function(v){this.Top = v;};
CMargins.prototype.get_Bottom = function(){return this.Bottom; };
CMargins.prototype.put_Bottom = function(v){this.Bottom = v;};
CMargins.prototype.get_Flag = function(){return this.Flag; };
CMargins.prototype.put_Flag = function(v){this.Flag = v;};

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
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Table_Properties) )
    {
        if(obj.CellBorders)
        {
            if(obj.CellBorders.Left && obj.CellBorders.Left.Color)
            {
                obj.CellBorders.Left.Unifill = CreateUnifillFromAscColor(obj.CellBorders.Left.Color);
            }
            if(obj.CellBorders.Top && obj.CellBorders.Top.Color)
            {
                obj.CellBorders.Top.Unifill = CreateUnifillFromAscColor(obj.CellBorders.Top.Color);
            }
            if(obj.CellBorders.Right && obj.CellBorders.Right.Color)
            {
                obj.CellBorders.Right.Unifill = CreateUnifillFromAscColor(obj.CellBorders.Right.Color);
            }
            if(obj.CellBorders.Bottom && obj.CellBorders.Bottom.Color)
            {
                obj.CellBorders.Bottom.Unifill = CreateUnifillFromAscColor(obj.CellBorders.Bottom.Color);
            }
            if(obj.CellBorders.InsideH && obj.CellBorders.InsideH.Color)
            {
                obj.CellBorders.InsideH.Unifill = CreateUnifillFromAscColor(obj.CellBorders.InsideH.Color);
            }
            if(obj.CellBorders.InsideV && obj.CellBorders.InsideV.Color)
            {
                obj.CellBorders.InsideV.Unifill = CreateUnifillFromAscColor(obj.CellBorders.InsideV.Color);
            }
        }
        if(obj.CellsBackground && obj.CellsBackground.Color)
        {
            obj.CellsBackground.Unifill = CreateUnifillFromAscColor(obj.CellsBackground.Color);
        }

        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_ApplyTablePr);
        this.WordControl.m_oLogicDocument.Set_TableProps(obj);
    }
};
/*callbacks*/
asc_docs_api.prototype.sync_AddTableCallback = function(){
	this.asc_fireCallback("asc_onAddTable");
};
asc_docs_api.prototype.sync_AlignCellCallback = function(align){
	this.asc_fireCallback("asc_onAlignCell",align);
};
asc_docs_api.prototype.sync_TblPropCallback = function(tblProp)
{
    //if ( true === CollaborativeEditing.Get_GlobalLock() )
    //    tblProp.Locked = true;

    // TODO: вызвать функцию asc_onInitTableTemplatesв зависимости от TableLook
    if(tblProp.CellsBackground && tblProp.CellsBackground.Unifill)
    {
        var LogicDocument = this.WordControl.m_oLogicDocument;
        tblProp.CellsBackground.Unifill.check(LogicDocument.Get_Theme(), LogicDocument.Get_ColorMap());
        var RGBA = tblProp.CellsBackground.Unifill.getRGBAColor();
        tblProp.CellsBackground.Color = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B, false);
    }
    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject( c_oAscTypeSelectElement.Table, new CTableProp( tblProp ));
};
asc_docs_api.prototype.sync_TblWrapStyleChangedCallback = function(style){
	this.asc_fireCallback("asc_onTblWrapStyleChanged",style);
};
asc_docs_api.prototype.sync_TblAlignChangedCallback = function(style){
	this.asc_fireCallback("asc_onTblAlignChanged",style);
};

/*----------------------------------------------------------------*/
/*functions for working with images*/
asc_docs_api.prototype.ChangeImageFromFile = function()
{
    this.isImageChangeUrl = true;
    this.asc_addImage();
};
asc_docs_api.prototype.ChangeShapeImageFromFile = function()
{
    this.isShapeImageChangeUrl = true;
    this.asc_addImage();
};

asc_docs_api.prototype.AddImage = function(){
	this.asc_addImage();
};
asc_docs_api.prototype.AddImageUrl2 = function(url)
{
    this.AddImageUrl(getFullImageSrc2(url));
};

asc_docs_api.prototype._addImageUrl = function(url) {
  // ToDo пока временная функция для стыковки.
  this.AddImageUrl(url);
};
asc_docs_api.prototype.AddImageUrl = function(url, imgProp)
{
    if(g_oDocumentUrls.getLocal(url))
    {
        this.AddImageUrlAction(url, imgProp);
    }
    else
    {
        var rData = {
            "id": this.documentId,
            "userid": this.documentUserId,
            "vkey": this.documentVKey,
            "c": "imgurl",
            "saveindex": g_oDocumentUrls.getMaxIndex(),
            "data": url};

        var t = this;
        this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
        this.fCurCallback = function(input) {
            if(null != input && "imgurl" == input["type"]){
                if("ok" ==input["status"]) {
                    var data = input["data"];
                    var urls = {};
                    var firstUrl;
                    for(var i = 0; i < data.length; ++i){
                        var elem = data[i];
                        if(elem.url){
                            if(!firstUrl){
                                firstUrl = elem.url;
                            }
                            urls[elem.path] = elem.url;
                        }
                    }
                    g_oDocumentUrls.addUrls(urls);
                    if(firstUrl) {
                        t.AddImageUrlAction(firstUrl, imgProp);
                    } else {
                        t.asc_fireCallback("asc_onError",c_oAscError.ID.Unknown,c_oAscError.Level.NoCritical);
                    }
                } else {
                    t.asc_fireCallback("asc_onError", g_fMapAscServerErrorToAscError(parseInt(input["data"])), c_oAscError.Level.NoCritical);
                }
            } else {
                t.asc_fireCallback("asc_onError",c_oAscError.ID.Unknown,c_oAscError.Level.NoCritical);
            }
            t.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
        };
        sendCommand2(this, null, rData );
    }
};
asc_docs_api.prototype.AddImageUrlAction = function(url, imgProp)
{
    var _image = this.ImageLoader.LoadImage(url, 1);
    if (null != _image)
    {
        if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
        {
            var _w = Math.max(1, Page_Width - (X_Left_Margin + X_Right_Margin));
            var _h = Math.max(1, Page_Height - (Y_Top_Margin + Y_Bottom_Margin));
            if (_image.Image != null)
            {
                var __w = Math.max(parseInt(_image.Image.width * g_dKoef_pix_to_mm), 1);
                var __h = Math.max(parseInt(_image.Image.height * g_dKoef_pix_to_mm), 1);
                _w = Math.max(5, Math.min(_w, __w));
                _h = Math.max(5, Math.min(parseInt(_w * __h / __w)));
            }
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_AddImageUrl);

            var src = _image.src;
            if (this.isShapeImageChangeUrl)
            {
                var AscShapeProp = new asc_CShapeProperty();
                AscShapeProp.fill = new asc_CShapeFill();
                AscShapeProp.fill.type = c_oAscFill.FILL_TYPE_BLIP;
                AscShapeProp.fill.fill = new asc_CFillBlip();
                AscShapeProp.fill.fill.asc_putUrl(src);
                this.ImgApply(new asc_CImgProperty({ShapeProperties:AscShapeProp}));
                this.isShapeImageChangeUrl = false;
            }
            else if (this.isImageChangeUrl)
            {
                var AscImageProp = new asc_CImgProperty();
                AscImageProp.ImageUrl = src;
                this.ImgApply(AscImageProp);
                this.isImageChangeUrl = false;
            }
            else
            {
                var imageLocal = g_oDocumentUrls.getImageLocal(src);
                if(imageLocal){
                    src = imageLocal;
                }

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
            if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
            {
                var _w = Math.max(1, Page_Width - (X_Left_Margin + X_Right_Margin));
                var _h = Math.max(1, Page_Height - (Y_Top_Margin + Y_Bottom_Margin));
                if (_image.Image != null)
                {
                    var __w = Math.max(parseInt(_image.Image.width * g_dKoef_pix_to_mm), 1);
                    var __h = Math.max(parseInt(_image.Image.height * g_dKoef_pix_to_mm), 1);
                    _w = Math.max(5, Math.min(_w, __w));
                    _h = Math.max(5, Math.min(parseInt(_w * __h / __w)));
                }
                this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_AddImageUrlLong);
                var src = _image.src;

                if (this.isShapeImageChangeUrl)
                {
                    var AscShapeProp = new asc_CShapeProperty();
                    AscShapeProp.fill = new asc_CShapeFill();
                    AscShapeProp.fill.type = c_oAscFill.FILL_TYPE_BLIP;
                    AscShapeProp.fill.fill = new asc_CFillBlip();
                    AscShapeProp.fill.fill.asc_putUrl(src);
                    this.ImgApply(new asc_CImgProperty({ShapeProperties:AscShapeProp}));
                    this.isShapeImageChangeUrl = false;
                }
                else if (this.isImageChangeUrl)
                {
                    var AscImageProp = new asc_CImgProperty();
                    AscImageProp.ImageUrl = src;
                    this.ImgApply(AscImageProp);
                    this.isImageChangeUrl = false;
                }
                else
                {
                    var imageLocal = g_oDocumentUrls.getImageLocal(src);
                    if(imageLocal){
                        src = imageLocal;
                    }

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

    var oldClickCount = global_mouseEvent.ClickCount;
    global_mouseEvent.Button = 0;
    global_mouseEvent.ClickCount = 1;
    LogicDocument.OnMouseDown(global_mouseEvent, dX, dY, nPageIndex);
    LogicDocument.OnMouseUp  (global_mouseEvent, dX, dY, nPageIndex);
    LogicDocument.OnMouseMove(global_mouseEvent, dX, dY, nPageIndex);
    global_mouseEvent.ClickCount = oldClickCount;

    if (false === LogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
    {
        var oPosH = new CImagePositionH();
        oPosH.put_RelativeFrom(c_oAscRelativeFromH.Page);
        oPosH.put_Align(false);
        oPosH.put_Value(dX);
        var oPosV = new CImagePositionV();
        oPosV.put_RelativeFrom(c_oAscRelativeFromV.Page);
        oPosV.put_Align(false);
        oPosV.put_Value(dY);
        var oImageProps = new asc_CImgProperty();
        oImageProps.asc_putWrappingStyle(c_oAscWrapStyle2.Square);
        oImageProps.asc_putPositionH(oPosH);
        oImageProps.asc_putPositionV(oPosV);

        LogicDocument.Create_NewHistoryPoint(historydescription_Document_AddImageToPage);
        LogicDocument.Start_SilentMode();
        LogicDocument.Add_InlineImage(dW, dH, sUrl);
        LogicDocument.Set_ImageProps(oImageProps);
        LogicDocument.End_SilentMode(true);
    }
};
/* В качестве параметра  передается объект класса asc_CImgProperty, он же приходит на OnImgProp
 asc_CImgProperty заменяет пережнюю структуру:
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
asc_docs_api.prototype.ImgApply = function(obj)
{

    if(!isRealObject(obj))
        return;
    var ImagePr = obj, AdditionalData, LogicDocument = this.WordControl.m_oLogicDocument;

    /*проверка корректности данных для биржевой диаграммы*/
    if(obj.ChartProperties && obj.ChartProperties.type === c_oAscChartTypeSettings.stock)
    {
        if(!CheckStockChart(this.WordControl.m_oLogicDocument.DrawingObjects, this))
        {
            return;
        }
    }

    /*изменение z-индекса*/
    if(isRealNumber(ImagePr.ChangeLevel))
    {
        switch(ImagePr.ChangeLevel)
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
    for(i = 0; i < aSelectedObjects.length; ++i)
    {
        oParentParagraph = aSelectedObjects[i].parent.Get_ParentParagraph();
        checkObjectInArray(aParagraphs, oParentParagraph);
    }


    AdditionalData = {Type : changestype_2_ElementsArray_and_Type , Elements : aParagraphs, CheckType : changestype_Paragraph_Content};
    /*группировка и разгруппировка*/
    if(ImagePr.Group === 1 || ImagePr.Group === -1)
    {
        if(false == this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props, AdditionalData))
        {
            History.Create_NewPoint(historydescription_Document_GroupUnGroup);
            if(ImagePr.Group === 1)
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


    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Image_Properties) )
    {
        if (ImagePr.ShapeProperties)
            ImagePr.ImageUrl = "";


        var sImageUrl = null, fReplaceCallback = null, bImageUrl = false, sImageToDownLoad = "";
        if(!isNullOrEmptyString(ImagePr.ImageUrl)){
            if(!g_oDocumentUrls.getImageLocal(ImagePr.ImageUrl)){
                sImageUrl = ImagePr.ImageUrl;
                fReplaceCallback = function(sUrl){
                    ImagePr.ImageUrl = sUrl;
                    sImageToDownLoad = sUrl;
                }
            }
            sImageToDownLoad = ImagePr.ImageUrl;
        }
        else if(ImagePr.ShapeProperties && ImagePr.ShapeProperties.fill &&
            ImagePr.ShapeProperties.fill.fill && !isNullOrEmptyString(ImagePr.ShapeProperties.fill.fill.url)){
            if(!g_oDocumentUrls.getImageLocal(ImagePr.ShapeProperties.fill.fill.url)){
                sImageUrl = ImagePr.ShapeProperties.fill.fill.url;
                fReplaceCallback = function(sUrl){
                    ImagePr.ShapeProperties.fill.fill.url = sUrl;
                    sImageToDownLoad = sUrl;
                }
            }
            sImageToDownLoad = ImagePr.ShapeProperties.fill.fill.url;
        }

        var oApi = this;

        if(!isNullOrEmptyString(sImageToDownLoad)){

            var fApplyCallback = function(){
                var _img = oApi.ImageLoader.LoadImage(sImageToDownLoad, 1);
                if (null != _img)
                {
                    oApi.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_ApplyImagePrWithUrl);
                    oApi.WordControl.m_oLogicDocument.Set_ImageProps( ImagePr );
                }
                else
                {
                    oApi.asyncImageEndLoaded2 = function(_image)
                    {
                        oApi.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_ApplyImagePrWithUrlLong);
                        oApi.WordControl.m_oLogicDocument.Set_ImageProps( ImagePr );
                    }
                }
            };

            if(sImageUrl){
                var rData = {
                    "id": this.documentId,
                    "userid": this.documentUserId,
                    "vkey": this.documentVKey,
                    "c": "imgurl",
                    "saveindex": g_oDocumentUrls.getMaxIndex(),
                    "data": sImageToDownLoad};

                this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
                this.fCurCallback = function(input) {
                    if(null != input && "imgurl" == input["type"]){
                        if("ok" ==input["status"]) {
                            var data = input["data"];
                            var urls = {};
                            var firstUrl;
                            for(var i = 0; i < data.length; ++i){
                                var elem = data[i];
                                if(elem.url){
                                    if(!firstUrl){
                                        firstUrl = elem.url;
                                    }
                                    urls[elem.path] = elem.url;
                                }
                            }
                            g_oDocumentUrls.addUrls(urls);
                            if(firstUrl) {
                                fReplaceCallback(firstUrl);
                                fApplyCallback();
                            } else {
                                oApi.asc_fireCallback("asc_onError",c_oAscError.ID.Unknown,c_oAscError.Level.NoCritical);
                            }
                        } else {
                            oApi.asc_fireCallback("asc_onError", g_fMapAscServerErrorToAscError(parseInt(input["data"])), c_oAscError.Level.NoCritical);
                        }
                    } else {
                        oApi.asc_fireCallback("asc_onError",c_oAscError.ID.Unknown,c_oAscError.Level.NoCritical);
                    }
                    oApi.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
                };
                sendCommand2(this, null, rData );
            }
            else{
                fApplyCallback();
            }
        }
        else
        {
            ImagePr.ImageUrl = null;
            if(!this.noCreatePoint || this.exucuteHistory)
            {
                if( !this.noCreatePoint && !this.exucuteHistory && this.exucuteHistoryEnd)
                {
                    History.UndoLastPoint(this.nCurPointItemsLength);
                    this.WordControl.m_oLogicDocument.Set_ImageProps( ImagePr );
                    this.exucuteHistoryEnd = false;
                    this.nCurPointItemsLength = 0;
                }
                else
                {
                    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_ApplyImagePr);
                    this.WordControl.m_oLogicDocument.Set_ImageProps( ImagePr );
                }
                if(this.exucuteHistory)
                {
                    this.exucuteHistory = false;
                    var oPoint = History.Points[History.Index];
                    if(oPoint)
                    {
                        this.nCurPointItemsLength = oPoint.Items.length;
                    }
                }
            }
            else
            {
                //ExecuteNoHistory(function(){
                    History.UndoLastPoint(this.nCurPointItemsLength);
                    this.WordControl.m_oLogicDocument.Set_ImageProps( ImagePr );
                //}, this, []);
            }
        }
    }
};
asc_docs_api.prototype.set_Size = function(width, height){

};
asc_docs_api.prototype.set_ConstProportions = function(isOn){
	if (isOn){

	}
	else{

	}
};
asc_docs_api.prototype.set_WrapStyle = function(type){

};
asc_docs_api.prototype.deleteImage = function(){

};
asc_docs_api.prototype.set_ImgDistanceFromText = function(left,top,right,bottom){

};
asc_docs_api.prototype.set_PositionOnPage = function(X,Y){//расположение от начала страницы

};
asc_docs_api.prototype.get_OriginalSizeImage = function(){
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
            if (null != _tx_id && 0 <= _tx_id && _tx_id < g_oUserTexturePresets.length)
            {
                image_url = g_oUserTexturePresets[_tx_id];
            }
        }
    }
    if (image_url != "")
    {
        var _image = this.ImageLoader.LoadImage(image_url, 1);

		var imageLocal = g_oDocumentUrls.getImageLocal(image_url);
		if(imageLocal){
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

            var oProp = shapeProps;
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
asc_docs_api.prototype.sync_AddImageCallback = function(){
	this.asc_fireCallback("asc_onAddImage");
};
asc_docs_api.prototype.sync_ImgPropCallback = function(imgProp)
{
    //if ( true === CollaborativeEditing.Get_GlobalLock() )
    //    imgProp.Locked = true;

    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject( c_oAscTypeSelectElement.Image, new asc_CImgProperty( imgProp ) );
};
asc_docs_api.prototype.sync_ImgWrapStyleChangedCallback = function(style){
	this.asc_fireCallback("asc_onImgWrapStyleChanged",style);
};

//-----------------------------------------------------------------
// События контекстного меню
//-----------------------------------------------------------------

function CContextMenuData( obj )
{
    if( obj )
    {
        this.Type  = ( undefined != obj.Type ) ? obj.Type : c_oAscContextMenuTypes.Common;
        this.X_abs = ( undefined != obj.X_abs ) ? obj.X_abs : 0;
        this.Y_abs = ( undefined != obj.Y_abs ) ? obj.Y_abs : 0;

        switch ( this.Type )
        {
            case c_oAscContextMenuTypes.ChangeHdrFtr :
            {
                this.PageNum = ( undefined != obj.PageNum ) ? obj.PageNum : 0;
                this.Header  = ( undefined != obj.Header  ) ? obj.Header  : true;

                break;
            }
        }
    }
    else
    {
        this.Type  = c_oAscContextMenuTypes.Common;
        this.X_abs = 0;
        this.Y_abs = 0;
    }
}

CContextMenuData.prototype.get_Type  = function()  { return this.Type; };
CContextMenuData.prototype.get_X = function()  { return this.X_abs; };
CContextMenuData.prototype.get_Y = function()  { return this.Y_abs; };
CContextMenuData.prototype.get_PageNum = function()  { return this.PageNum; };
CContextMenuData.prototype.is_Header = function()  { return this.Header; };

asc_docs_api.prototype.sync_ContextMenuCallback = function(Data)
{
    this.asc_fireCallback("asc_onContextMenu", new CContextMenuData( Data ) );
};


asc_docs_api.prototype.sync_MouseMoveStartCallback = function()
{
    this.asc_fireCallback("asc_onMouseMoveStart");
};

asc_docs_api.prototype.sync_MouseMoveEndCallback = function()
{
    this.asc_fireCallback("asc_onMouseMoveEnd");
};

asc_docs_api.prototype.sync_MouseMoveCallback = function(Data)
{
    this.asc_fireCallback("asc_onMouseMove", Data );
};

asc_docs_api.prototype.sync_ShowForeignCursorLabel = function(UserId, X, Y, Color)
{
    this.asc_fireCallback("asc_onShowForeignCursorLabel", UserId, X, Y, new CColor(Color.r, Color.g, Color.b, 255));
};
asc_docs_api.prototype.sync_HideForeignCursorLabel = function(UserId)
{
    this.asc_fireCallback("asc_onHideForeignCursorLabel", UserId);
};

//-----------------------------------------------------------------
// Функции для работы с гиперссылками
//-----------------------------------------------------------------
asc_docs_api.prototype.can_AddHyperlink = function()
{
    //if ( true === CollaborativeEditing.Get_GlobalLock() )
    //    return false;

    var bCanAdd = this.WordControl.m_oLogicDocument.Hyperlink_CanAdd(true);
    if ( true === bCanAdd )
        return this.WordControl.m_oLogicDocument.Get_SelectedText(true);

    return false;
};

// HyperProps - объект CHyperlinkProperty
asc_docs_api.prototype.add_Hyperlink = function(HyperProps)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_AddHyperlink);
        this.WordControl.m_oLogicDocument.Hyperlink_Add( HyperProps );
    }
};

// HyperProps - объект CHyperlinkProperty
asc_docs_api.prototype.change_Hyperlink = function(HyperProps)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_ChangeHyperlink);
        this.WordControl.m_oLogicDocument.Hyperlink_Modify( HyperProps );
    }
};

asc_docs_api.prototype.remove_Hyperlink = function()
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_RemoveHyperlink);
        this.WordControl.m_oLogicDocument.Hyperlink_Remove();
    }
};

function CHyperlinkProperty( obj )
{
    if( obj )
    {
        this.Text    = (undefined != obj.Text   ) ? obj.Text    : null;
        this.Value   = (undefined != obj.Value  ) ? obj.Value   : "";
        this.ToolTip = (undefined != obj.ToolTip) ? obj.ToolTip : "";
    }
    else
    {
        this.Text    = null;
        this.Value   = "";
        this.ToolTip = "";
    }
}

CHyperlinkProperty.prototype.get_Value   = function()  { return this.Value; };
CHyperlinkProperty.prototype.put_Value   = function(v) { this.Value = v; };
CHyperlinkProperty.prototype.get_ToolTip = function()  { return this.ToolTip; };
CHyperlinkProperty.prototype.put_ToolTip = function(v) { this.ToolTip = v ? v.slice(0, c_oAscMaxTooltipLength) : v; };
CHyperlinkProperty.prototype.get_Text    = function()  { return this.Text; };
CHyperlinkProperty.prototype.put_Text    = function(v) { this.Text = v; };

asc_docs_api.prototype.sync_HyperlinkPropCallback = function(hyperProp)
{
    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject( c_oAscTypeSelectElement.Hyperlink, new CHyperlinkProperty( hyperProp ) );
};

asc_docs_api.prototype.sync_HyperlinkClickCallback = function(Url)
{
    this.asc_fireCallback("asc_onHyperlinkClick", Url);
};

asc_docs_api.prototype.sync_CanAddHyperlinkCallback = function(bCanAdd)
{
    //if ( true === CollaborativeEditing.Get_GlobalLock() )
    //    this.asc_fireCallback("asc_onCanAddHyperlink", false);
    //else
        this.asc_fireCallback("asc_onCanAddHyperlink", bCanAdd);
};

asc_docs_api.prototype.sync_DialogAddHyperlink = function()
{
    this.asc_fireCallback("asc_onDialogAddHyperlink");
};

asc_docs_api.prototype.sync_DialogAddHyperlink = function()
{
    this.asc_fireCallback("asc_onDialogAddHyperlink");
};

//-----------------------------------------------------------------
// Функции для работы с орфографией
//-----------------------------------------------------------------
function asc_CSpellCheckProperty( Word, Checked, Variants, ParaId, ElemId )
{
    this.Word     = Word;
    this.Checked  = Checked;
    this.Variants = Variants;

    this.ParaId   = ParaId;
    this.ElemId   = ElemId;
}

asc_CSpellCheckProperty.prototype.get_Word     = function()  { return this.Word; };
asc_CSpellCheckProperty.prototype.get_Checked  = function()  { return this.Checked; };
asc_CSpellCheckProperty.prototype.get_Variants = function()  { return this.Variants; };

asc_docs_api.prototype.sync_SpellCheckCallback = function(Word, Checked, Variants, ParaId, ElemId)
{
    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new asc_CSelectedObject( c_oAscTypeSelectElement.SpellCheck, new asc_CSpellCheckProperty( Word, Checked, Variants, ParaId, ElemId ) );
};

asc_docs_api.prototype.sync_SpellCheckVariantsFound = function()
{
    this.asc_fireCallback("asc_onSpellCheckVariantsFound");
};

asc_docs_api.prototype.asc_replaceMisspelledWord = function(Word, SpellCheckProperty)
{
    var ParaId = SpellCheckProperty.ParaId;
    var ElemId = SpellCheckProperty.ElemId;

    var Paragraph = g_oTableId.Get_ById(ParaId);
    if ( null != Paragraph && false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_None, { Type : changestype_2_Element_and_Type, Element : Paragraph, CheckType : changestype_Paragraph_Content } ) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_ReplaceMisspelledWord);
        Paragraph.Replace_MisspelledWord( Word, ElemId );
        this.WordControl.m_oLogicDocument.Recalculate();
        Paragraph.Document_SetThisElementCurrent(true);
    }
};

asc_docs_api.prototype.asc_ignoreMisspelledWord = function(SpellCheckProperty, bAll)
{
    if ( false === bAll )
    {
        var ParaId = SpellCheckProperty.ParaId;
        var ElemId = SpellCheckProperty.ElemId;

        var Paragraph = g_oTableId.Get_ById(ParaId);
        if ( null != Paragraph )
        {
            Paragraph.Ignore_MisspelledWord( ElemId );
        }
    }
    else
    {
        var LogicDocument = editor.WordControl.m_oLogicDocument;
        LogicDocument.Spelling.Add_Word( SpellCheckProperty.Word );
        LogicDocument.DrawingDocument.ClearCachePages();
        LogicDocument.DrawingDocument.FirePaint();
    }
};

asc_docs_api.prototype.asc_setDefaultLanguage = function(Lang)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Document_SectPr) )
    {
        History.Create_NewPoint(historydescription_Document_SetDefaultLanguage);
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
function asc_CCommentDataWord( obj )
{
    if( obj )
    {
        this.m_sText      = (undefined != obj.m_sText     ) ? obj.m_sText      : "";
        this.m_sTime      = (undefined != obj.m_sTime     ) ? obj.m_sTime      : "";
        this.m_sUserId    = (undefined != obj.m_sUserId   ) ? obj.m_sUserId    : "";
        this.m_sQuoteText = (undefined != obj.m_sQuoteText) ? obj.m_sQuoteText : null;
        this.m_bSolved    = (undefined != obj.m_bSolved   ) ? obj.m_bSolved    : false;
        this.m_sUserName  = (undefined != obj.m_sUserName ) ? obj.m_sUserName  : "";
        this.m_aReplies   = [];
        if ( undefined != obj.m_aReplies )
        {
            var Count = obj.m_aReplies.length;
            for ( var Index = 0; Index < Count; Index++ )
            {
                var Reply = new asc_CCommentDataWord( obj.m_aReplies[Index] );
                this.m_aReplies.push( Reply );
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

asc_CCommentDataWord.prototype.asc_getText         = function()  { return this.m_sText; };
asc_CCommentDataWord.prototype.asc_putText         = function(v) { this.m_sText = v ? v.slice(0, c_oAscMaxCellOrCommentLength) : v; };
asc_CCommentDataWord.prototype.asc_getTime         = function()  { return this.m_sTime; };
asc_CCommentDataWord.prototype.asc_putTime         = function(v) { this.m_sTime = v; };
asc_CCommentDataWord.prototype.asc_getUserId       = function()  { return this.m_sUserId; };
asc_CCommentDataWord.prototype.asc_putUserId       = function(v) { this.m_sUserId = v; };
asc_CCommentDataWord.prototype.asc_getUserName     = function()  { return this.m_sUserName; };
asc_CCommentDataWord.prototype.asc_putUserName     = function(v) { this.m_sUserName = v; };
asc_CCommentDataWord.prototype.asc_getQuoteText    = function()  { return this.m_sQuoteText; };
asc_CCommentDataWord.prototype.asc_putQuoteText    = function(v) { this.m_sQuoteText = v; };
asc_CCommentDataWord.prototype.asc_getSolved       = function()  { return this.m_bSolved; };
asc_CCommentDataWord.prototype.asc_putSolved       = function(v) { this.m_bSolved = v; };
asc_CCommentDataWord.prototype.asc_getReply        = function(i) { return this.m_aReplies[i]; };
asc_CCommentDataWord.prototype.asc_addReply        = function(v) { this.m_aReplies.push( v ); };
asc_CCommentDataWord.prototype.asc_getRepliesCount = function(v) { return this.m_aReplies.length; };


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

    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_None, { Type : changestype_2_Comment, Id : Id } ) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_RemoveComment);
        this.WordControl.m_oLogicDocument.Remove_Comment( Id, true, true );
    }
};

asc_docs_api.prototype.asc_changeComment = function(Id, AscCommentData)
{
    if (null == this.WordControl.m_oLogicDocument)
        return;

    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_None, { Type : changestype_2_Comment, Id : Id } ) )
    {
        var CommentData = new CCommentData();
        CommentData.Read_FromAscCommentData(AscCommentData);

        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_ChangeComment);
        this.WordControl.m_oLogicDocument.Change_Comment( Id, CommentData );

        this.sync_ChangeCommentData( Id, CommentData );
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
    this.asc_fireCallback("asc_onRemoveComment", Id);
};

asc_docs_api.prototype.sync_AddComment = function(Id, CommentData)
{
    var AscCommentData = new asc_CCommentDataWord(CommentData);
    this.asc_fireCallback("asc_onAddComment", Id, AscCommentData);
};

asc_docs_api.prototype.sync_ShowComment = function(Id, X, Y)
{
    // TODO: Переделать на нормальный массив
    this.asc_fireCallback("asc_onShowComment", [ Id ], X, Y);
};

asc_docs_api.prototype.sync_HideComment = function()
{
    this.asc_fireCallback("asc_onHideComment");
};

asc_docs_api.prototype.sync_UpdateCommentPosition = function(Id, X, Y)
{
    // TODO: Переделать на нормальный массив
    this.asc_fireCallback("asc_onUpdateCommentPosition", [ Id ], X, Y);
};

asc_docs_api.prototype.sync_ChangeCommentData = function(Id, CommentData)
{
    var AscCommentData = new asc_CCommentDataWord(CommentData);
    this.asc_fireCallback("asc_onChangeCommentData", Id, AscCommentData);
};

asc_docs_api.prototype.sync_LockComment = function(Id, UserId)
{
    this.asc_fireCallback("asc_onLockComment", Id, UserId);
};

asc_docs_api.prototype.sync_UnLockComment = function(Id)
{
    this.asc_fireCallback("asc_onUnLockComment", Id);
};

asc_docs_api.prototype.asc_getComments = function()
{
    var ResComments = [];
    var LogicDocument = this.WordControl.m_oLogicDocument;
    if ( undefined != LogicDocument )
    {
        var DocComments = LogicDocument.Comments;
        for ( var Id in DocComments.m_aComments )
        {
            var AscCommentData = new asc_CCommentDataWord(DocComments.m_aComments[Id].Data);
            ResComments.push( { "Id" : Id, "Comment" : AscCommentData } );
        }
    }

    return ResComments;
};
//-----------------------------------------------------------------
asc_docs_api.prototype.sync_LockHeaderFooters = function()
{
    this.asc_fireCallback("asc_onLockHeaderFooters");
};

asc_docs_api.prototype.sync_LockDocumentProps = function()
{
    this.asc_fireCallback("asc_onLockDocumentProps");
};

asc_docs_api.prototype.sync_UnLockHeaderFooters = function()
{
    this.asc_fireCallback("asc_onUnLockHeaderFooters");
};

asc_docs_api.prototype.sync_UnLockDocumentProps = function()
{
    this.asc_fireCallback("asc_onUnLockDocumentProps");
};

asc_docs_api.prototype.sync_CollaborativeChanges = function()
{
    if (true !== CollaborativeEditing.Is_Fast())
        this.asc_fireCallback("asc_onCollaborativeChanges");
};

asc_docs_api.prototype.sync_LockDocumentSchema = function()
{
    this.asc_fireCallback("asc_onLockDocumentSchema");
};

asc_docs_api.prototype.sync_UnLockDocumentSchema = function()
{
    this.asc_fireCallback("asc_onUnLockDocumentSchema");
};


/*----------------------------------------------------------------*/
/*functions for working with zoom & navigation*/
asc_docs_api.prototype.zoomIn = function(){
    this.WordControl.zoom_In();
};
asc_docs_api.prototype.zoomOut = function(){
    this.WordControl.zoom_Out();
};
asc_docs_api.prototype.zoomFitToPage = function(){
    this.WordControl.zoom_FitToPage();
};
asc_docs_api.prototype.zoomFitToWidth = function(){
    this.WordControl.zoom_FitToWidth();
};
asc_docs_api.prototype.zoomCustomMode = function(){
    this.WordControl.m_nZoomType = 0;
    this.WordControl.zoom_Fire(0, this.WordControl.m_nZoomValue);
};
asc_docs_api.prototype.zoom100 = function(){
	this.zoom(100);
};
asc_docs_api.prototype.zoom = function(percent){
    var _old_val = this.WordControl.m_nZoomValue;
    this.WordControl.m_nZoomValue = percent;
    this.WordControl.m_nZoomType = 0;
    this.WordControl.zoom_Fire(0, _old_val);
};
asc_docs_api.prototype.goToPage = function(number){
	this.WordControl.GoToPage(number);
};
asc_docs_api.prototype.getCountPages = function(){
	return this.WordControl.m_oDrawingDocument.m_lPagesCount;
};
asc_docs_api.prototype.getCurrentPage = function(){
	return this.WordControl.m_oDrawingDocument.m_lCurrentPage;
};
/*callbacks*/
asc_docs_api.prototype.sync_zoomChangeCallback = function(percent,type){	//c_oAscZoomType.Current, c_oAscZoomType.FitWidth, c_oAscZoomType.FitPage
	this.asc_fireCallback("asc_onZoomChange",percent,type);
};
asc_docs_api.prototype.sync_countPagesCallback = function(count){
	this.asc_fireCallback("asc_onCountPages",count);
};
asc_docs_api.prototype.sync_currentPageCallback = function(number){
	this.asc_fireCallback("asc_onCurrentPage",number);
};

/*----------------------------------------------------------------*/
asc_docs_api.prototype.asc_enableKeyEvents = function(value){
	if (this.WordControl.IsFocus != value) {
		this.WordControl.IsFocus = value;

        if (this.WordControl.IsFocus && null != this.WordControl.TextBoxInput)
            this.WordControl.TextBoxInput.focus();

		this.asc_fireCallback("asc_onEnableKeyEventsChanged", value);
	}
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
        var _progress = this.OpenDocumentProgress;
        _progress.Type = c_oAscAsyncAction.LoadDocumentFonts;
        _progress.FontsCount = this.FontLoader.fonts_loading.length;
        _progress.CurrentFont = 0;

        var _loader_object = this.WordControl.m_oLogicDocument;
        var _count = 0;
        if (_loader_object !== undefined && _loader_object != null)
        {
            for (var i in _loader_object.ImageMap) {
				if(this.DocInfo.get_OfflineApp()) {
					var localUrl = _loader_object.ImageMap[i];
					g_oDocumentUrls.addImageUrl(localUrl, this.documentUrl + 'media/' + localUrl);
				}
                ++_count;
			}
        }

        _progress.ImagesCount = _count;
        _progress.CurrentImage = 0;
    }
};
asc_docs_api.prototype.GenerateStyles = function()
{
    if (window["NATIVE_EDITOR_ENJINE"] === true)
    {
        if (!this.asc_checkNeedCallback("asc_onInitEditorStyles"))
            return;
    }

    var StylesPainter = new CStylesPainter();
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
asc_docs_api.prototype.asyncFontsDocumentEndLoaded = function()
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

        var _oldAsyncLoadImages = this.ImageLoader.bIsAsyncLoadDocumentImages;
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
        this.WordControl.m_oDrawingDocument.SendThemeColorScheme();
		this.asc_fireCallback("asc_onUpdateChartStyles");
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
        var _st_count = g_oUserTexturePresets.length;
        for (var i = 0; i < _st_count; i++)
            _loader_object.ImageMap[_count + i] = g_oUserTexturePresets[i];

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

asc_docs_api.prototype.sync_SendThemeColors = function(colors,standart_colors)
{
    this._gui_control_colors = { Colors : colors, StandartColors : standart_colors };
    this.asc_fireCallback("asc_onSendThemeColors",colors,standart_colors);
};
asc_docs_api.prototype.sync_SendThemeColorSchemes = function(param)
{
    this._gui_color_schemes = param;
};

asc_docs_api.prototype.ChangeColorScheme = function(index_scheme)
{
    if (null == this.WordControl.m_oLogicDocument)
        return;

    var _changer = this.WordControl.m_oLogicDocument.DrawingObjects;
    if (null == _changer)
        return;

    var theme = this.WordControl.m_oLogicDocument.theme;

    var _count_defaults = g_oUserColorScheme.length;

    if(this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_ColorScheme) === false)
    {
        History.Create_NewPoint(historydescription_Document_ChangeColorScheme);
        var data = {Type: historyitem_ChangeColorScheme, oldScheme:theme.themeElements.clrScheme};

        if (index_scheme < _count_defaults)
        {
            var _obj = g_oUserColorScheme[index_scheme];
            var scheme = new ClrScheme();
			scheme.name = _obj["name"];
            var _c = null;

            _c = _obj["dk1"];
            scheme.colors[8] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

            _c = _obj["lt1"];
            scheme.colors[12] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

            _c = _obj["dk2"];
            scheme.colors[9] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

            _c = _obj["lt2"];
            scheme.colors[13] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

            _c = _obj["accent1"];
            scheme.colors[0] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

            _c = _obj["accent2"];
            scheme.colors[1] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

            _c = _obj["accent3"];
            scheme.colors[2] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

            _c = _obj["accent4"];
            scheme.colors[3] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

            _c = _obj["accent5"];
            scheme.colors[4] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

            _c = _obj["accent6"];
            scheme.colors[5] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

            _c = _obj["hlink"];
            scheme.colors[11] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

            _c = _obj["folHlink"];
            scheme.colors[10] = CreateUniColorRGB(_c["R"], _c["G"], _c["B"]);

            theme.themeElements.clrScheme = scheme;
            /*_changer.calculateAfterChangeTheme();

             // TODO:
             this.WordControl.m_oDrawingDocument.ClearCachePages();
             this.WordControl.OnScroll();*/
        }
        else
        {
            index_scheme -= _count_defaults;

            if (index_scheme < 0 || index_scheme >= theme.extraClrSchemeLst.length)
                return;

            theme.themeElements.clrScheme = theme.extraClrSchemeLst[index_scheme].clrScheme.createDuplicate();
            /*_changer.calculateAfterChangeTheme();

             // TODO:
             this.WordControl.m_oDrawingDocument.ClearCachePages();
             this.WordControl.OnScroll();*/
        }

        data.newScheme = theme.themeElements.clrScheme;
        History.Add(this.WordControl.m_oLogicDocument.DrawingObjects, data);
        this.WordControl.m_oDrawingDocument.CheckGuiControlColors();
        this.chartPreviewManager.clearPreviews();
        this.textArtPreviewManager.clear();
        this.asc_fireCallback("asc_onUpdateChartStyles");
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
    var _bIsOldPaste = this.isPasteFonts_Images;

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
            this.asc_fireCallback("asc_onDocumentContentReady");

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
            this.pasteImageMap = null;
            this.decrementCounterLongAction();
            this.pasteCallback();
            window.GlobalPasteFlag = false;
            window.GlobalPasteFlagCounter = 0;
            this.pasteCallback = null;
        }
        else if (this.isSaveFonts_Images)
        {
            this.isSaveFonts_Images = false;
            this.saveImageMap = null;
            this.pre_SaveCallback();

            if (this.bInit_word_control === false)
            {
                this.bInit_word_control = true;
                this.asc_fireCallback("asc_onDocumentContentReady");
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
        if(this.LoadedObject)
        {
            if(1 != this.LoadedObject)
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
                    this.isApplyChangesOnOpen = true;
                    CollaborativeEditing.Apply_Changes();
                    CollaborativeEditing.Release_Locks();

                  // Применяем все lock-и (ToDo возможно стоит пересмотреть вообще Lock-и)
                  for (var i = 0; i < this.arrPreOpenLocksObjects.length; ++i) {
                    this.arrPreOpenLocksObjects[i]();
                  }
                  this.arrPreOpenLocksObjects = [];
                }

//                History.RecalcData_Add( { Type : historyrecalctype_Inline, Data : { Pos : 0, PageNum : 0 } } );

                //Recalculate для Document
                Document.CurPos.ContentPos = 0;
//                History.RecalcData_Add({Type: historyrecalctype_Drawing, All: true});

                var RecalculateData =
                {
                    Inline : { Pos : 0, PageNum : 0 },
                    Flow   : [],
                    HdrFtr : [],
                    Drawings: {
                        All: true,
                        Map:{}
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
                    var data = {All:true};
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

    this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
    //this.WordControl.m_oLogicDocument.Document_UpdateRulersState();
    this.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
    this.LoadedObject = null;

    if (false === this.isSaveFonts_Images)
    {
        this.bInit_word_control = true;
        this.asc_fireCallback("asc_onDocumentContentReady");
    }

    this.WordControl.InitControl();

    if (!this.isViewMode)
        this.WordControl.m_oDrawingDocument.SendMathToMenu();

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

    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_SetTextFontNameLong);
        this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { FontFamily : { Name : fontinfo.Name , Index : -1 } } ) );
        this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
    }
	// отжать заморозку меню
};

asc_docs_api.prototype.asyncImageEndLoaded = function(_image)
{
    // отжать заморозку меню
	if (this.asyncImageEndLoaded2)
		this.asyncImageEndLoaded2(_image);
	else
    {
        if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
        {
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_AddImage);
            this.WordControl.m_oLogicDocument.Add_InlineImage(50, 50, _image.src);
        }
	}
};

asc_docs_api.prototype.asyncImageEndLoadedBackground = function(_image)
{
    this.WordControl.m_oDrawingDocument.CheckRasterImageOnScreen(_image.src);
};
asc_docs_api.prototype.IsAsyncOpenDocumentImages = function()
{
    return true;
};

asc_docs_api.prototype.pre_Paste = function(_fonts, _images, callback)
{
	if (undefined !== window["Native"] && undefined !== window["Native"]["GetImageUrl"])
	{
		callback();
		window.GlobalPasteFlag = false;
		window.GlobalPasteFlagCounter = 0;
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
        window.GlobalPasteFlag = false;
        window.GlobalPasteFlagCounter = 0;
        this.pasteCallback = null;
        
		if (-1 != window.PasteEndTimerId)
        {
            clearTimeout(window.PasteEndTimerId);
            window.PasteEndTimerId = -1;

            document.body.style.MozUserSelect = "none";
            document.body.style["-khtml-user-select"] = "none";
            document.body.style["-o-user-select"] = "none";
            document.body.style["user-select"] = "none";
            document.body.style["-webkit-user-select"] = "none";

            var pastebin = Editor_Paste_GetElem(this, true);

            if (!window.USER_AGENT_SAFARI_MACOS)
                pastebin.onpaste = null;

            pastebin.style.display  = ELEMENT_DISPAY_STYLE;
        }
		
		return;
    }

    this.isPasteFonts_Images = true;
    this.FontLoader.LoadDocumentFonts2(_fonts);
};

asc_docs_api.prototype.pre_Save = function(_images)
{
    this.isSaveFonts_Images = true;
    this.saveImageMap = _images;
    this.WordControl.m_oDrawingDocument.CheckFontNeeds();
    this.FontLoader.LoadDocumentFonts2(this.WordControl.m_oLogicDocument.Fonts);
};

asc_docs_api.prototype.SyncLoadImages = function(_images)
{
    this.isLoadImagesCustom = true;
    this.loadCustomImageMap = _images;

    var _count = 0;
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
    CollaborativeEditing.OnEnd_Load_Objects();

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
asc_docs_api.prototype.ViewScrollToX = function(x)
{
    this.WordControl.m_oScrollHorApi.scrollToX(x);
};
asc_docs_api.prototype.ViewScrollToY = function(y)
{
    this.WordControl.m_oScrollVerApi.scrollToY(y);
};
asc_docs_api.prototype.GetDocWidthPx = function()
{
    return this.WordControl.m_dDocumentWidth;
};
asc_docs_api.prototype.GetDocHeightPx = function()
{
    return this.WordControl.m_dDocumentHeight;
};
asc_docs_api.prototype.ClearSearch = function()
{
    return this.WordControl.m_oDrawingDocument.EndSearch(true);
};
asc_docs_api.prototype.GetCurrentVisiblePage = function()
{
    var lPage1 = this.WordControl.m_oDrawingDocument.m_lDrawingFirst;
    var lPage2 = lPage1 + 1;

    if (lPage2 > this.WordControl.m_oDrawingDocument.m_lDrawingEnd)
        return lPage1;

    var lWindHeight = this.WordControl.m_oEditor.HtmlElement.height;
    var arPages = this.WordControl.m_oDrawingDocument.m_arrPages;

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

asc_docs_api.prototype.asc_SetViewRulers = function(bRulers)
{
    //if (false === this.bInit_word_control || true === this.isViewMode)
    //    return;

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
asc_docs_api.prototype.asc_GetViewRulers = function()
{
    return this.WordControl.m_bIsRuler;
};

asc_docs_api.prototype.SetMobileVersion = function(val)
{
    this.isMobileVersion = val;
    if (this.isMobileVersion)
    {
        this.WordControl.bIsRetinaSupport = false; // ipad имеет проблемы с большими картинками
        this.WordControl.bIsRetinaNoSupportAttack = true;
        this.WordControl.m_bIsRuler = false;
		this.ShowParaMarks = false;

        this.SetFontRenderingMode(1);
    }
};

asc_docs_api.prototype.GoToHeader = function(pageNumber)
{
    if (this.WordControl.m_oDrawingDocument.IsFreezePage(pageNumber))
        return;

    var bForceRedraw = false;
    var LogicDocument = this.WordControl.m_oLogicDocument;
    if (docpostype_HdrFtr !== LogicDocument.CurPos.Type)
    {
        LogicDocument.CurPos.Type = docpostype_HdrFtr;
        bForceRedraw = true;
    }

    var oldClickCount = global_mouseEvent.ClickCount;
    global_mouseEvent.Button = 0;
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

    var bForceRedraw = false;
    var LogicDocument = this.WordControl.m_oLogicDocument;
    if (docpostype_HdrFtr !== LogicDocument.CurPos.Type)
    {
        LogicDocument.CurPos.Type = docpostype_HdrFtr;
        bForceRedraw = true;
    }

    var oldClickCount = global_mouseEvent.ClickCount;
    global_mouseEvent.Button = 0;
    global_mouseEvent.ClickCount = 1;

    LogicDocument.OnMouseDown(global_mouseEvent, 0, Page_Height, pageNumber);
    LogicDocument.OnMouseUp(global_mouseEvent, 0, Page_Height, pageNumber);
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

    var oldClickCount = global_mouseEvent.ClickCount;
    global_mouseEvent.ClickCount = 2;
    this.WordControl.m_oLogicDocument.OnMouseDown(global_mouseEvent, 0, Page_Height / 2, pageNumber);
    this.WordControl.m_oLogicDocument.OnMouseUp(global_mouseEvent, 0, Page_Height / 2, pageNumber);

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
    this.ImgApply(new asc_CImgProperty({ShapeProperties:{type:value}}));
};

asc_docs_api.prototype.sync_PaintFormatCallback = function(_value)
{
    var value = ( true === _value ? c_oAscFormatPainterState.kOn : ( false === _value ? c_oAscFormatPainterState.kOff : _value ) );
    
    this.isPaintFormat = value;
    return this.asc_fireCallback("asc_onPaintFormatChanged", value);
};
asc_docs_api.prototype.SetMarkerFormat = function(value, is_flag, r, g, b)
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
    return this.asc_fireCallback("asc_onMarkerFormatChanged", value);
};

asc_docs_api.prototype.StartAddShape = function(sPreset, is_apply)
{
    this.isStartAddShape = true;
    this.addShapePreset = sPreset;
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

asc_docs_api.prototype.AddTextArt = function(nStyle)
{
    if(false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content))
    {
        History.Create_NewPoint(historydescription_Document_AddTextArt);
        this.WordControl.m_oLogicDocument.Add_TextArt(nStyle);
    }
};


asc_docs_api.prototype.sync_StartAddShapeCallback = function(value)
{
    this.isStartAddShape = value;
    return this.asc_fireCallback("asc_onStartAddShapeChanged", value);
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
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_ClearFormatting);
        this.WordControl.m_oLogicDocument.Paragraph_ClearFormatting();
    }
};

asc_docs_api.prototype.GetSectionInfo = function()
{
    var obj = new CAscSection();
        
    // TODO: Переделать данную функцию, если она вообще нужна
    obj.PageWidth    = 297;
    obj.PageHeight   = 210;

    obj.MarginLeft   = 30;
    obj.MarginRight  = 15;
    obj.MarginTop    = 20;
    obj.MarginBottom = 20;

    return obj;
};

asc_docs_api.prototype.add_SectionBreak = function(_Type)
{
    var Type = section_type_Continuous;
    switch(_Type)
    {
        case c_oAscSectionBreakType.NextPage   : Type = section_type_NextPage; break;
        case c_oAscSectionBreakType.OddPage    : Type = section_type_OddPage; break;
        case c_oAscSectionBreakType.EvenPage   : Type = section_type_EvenPage; break;
        case c_oAscSectionBreakType.Continuous : Type = section_type_Continuous; break;
        case c_oAscSectionBreakType.Column     : Type = section_type_Column; break;
    }

    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_AddSectionBreak);
        this.WordControl.m_oLogicDocument.Add_SectionBreak(Type);
    }
};

asc_docs_api.prototype.getViewMode = function() {
  return this.isViewMode;
};
asc_docs_api.prototype.asc_setViewMode = function(isViewMode) {
  if (isViewMode) {
    this.asc_SpellCheckDisconnect();

    this.isViewMode = true;
    this.ShowParaMarks = false;
    CollaborativeEditing.m_bGlobalLock = true;
    //this.isShowTableEmptyLine = false;
    //this.WordControl.m_bIsRuler = true;

    if (null == this.WordControl.m_oDrawingDocument.m_oDocumentRenderer) {
      this.WordControl.m_oDrawingDocument.ClearCachePages();
      this.WordControl.HideRulers();
    } else {
      this.WordControl.HideRulers();
      this.WordControl.OnScroll();
    }
  } else {
    if (this.bInit_word_control === true && this.FontLoader.embedded_cut_manager.bIsCutFontsUse) {
      this.isLoadNoCutFonts = true;
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

    this.isViewMode = false;
    //this.WordControl.m_bIsRuler = true;
    this.WordControl.checkNeedRules();
    this.WordControl.m_oDrawingDocument.ClearCachePages();
    this.WordControl.OnResize(true);
  }
};
asc_docs_api.prototype.SetViewMode = function(isViewMode) {
  this.asc_setViewMode(isViewMode);
};

asc_docs_api.prototype.SetUseEmbeddedCutFonts = function(bUse)
{
    this.isUseEmbeddedCutFonts = bUse;
};

asc_docs_api.prototype.IsNeedDefaultFonts = function()
{
    if (this.WordControl.m_oLogicDocument != null)
        return true;
    return false;
};

asc_docs_api.prototype.OnMouseUp = function(x, y)
{
    this.WordControl.onMouseUpExternal(x, y);
};

asc_docs_api.prototype.asyncImageEndLoaded2 = null;
asc_docs_api.prototype._OfflineAppDocumentEndLoad = function() {
  var bIsViewer = false;
  var sData = window["editor_bin"];
  if (undefined == sData)
    return;
  if (c_oSerFormat.Signature !== sData.substring(0, c_oSerFormat.Signature.length)) {
    bIsViewer = true;
  }

  if (bIsViewer) {
    this.OpenDocument(this.documentUrl, sData);
  } else {
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
    return new asc_CRect(AnchorPos.X0, AnchorPos.Y, AnchorPos.X1 - AnchorPos.X0, 0);
};

function spellCheck (editor, rdata) {
  //console.log("start - " + rdata);
  // ToDo проверка на подключение
  switch (rdata.type) {
    case "spell":
    case "suggest":
      editor.SpellCheckApi.spellCheck(JSON.stringify(rdata));
      break;
  }
}

window["asc_nativeOnSpellCheck"] = function (response)
{
    if (editor.SpellCheckApi)
        editor.SpellCheckApi.onSpellCheck(response);
};

asc_docs_api.prototype._onNeedParams = function(data) {
  var cp = {'codepage': c_oAscCodePageUtf8, 'encodings': getEncodingParams()};
  this.asc_fireCallback("asc_onAdvancedOptions", new asc.asc_CAdvancedOptions(c_oAscAdvancedOptionsID.TXT, cp), this.advancedOptionsAction);
};
asc_docs_api.prototype._onOpenCommand = function(data) {
  var t = this;
	g_fOpenFileCommand(data, this.documentUrlChanges, c_oSerFormat.Signature, function (error, result) {
		if (error) {
			t.asc_fireCallback("asc_onError",c_oAscError.ID.Unknown,c_oAscError.Level.Critical);
			return;
		}

		if (result.changes && t.VersionHistory) {
			t.VersionHistory.changes = result.changes;
			t.VersionHistory.applyChanges(t);
		}

		if (result.bSerFormat)
			t.OpenDocument2(result.url, result.data);
		else
			t.OpenDocument(result.url, result.data);
	});
};
function _downloadAs(editor, command, filetype, actionType, options, fCallbackRequest) {
    if (!options) {
      options = {};
    }
    if (actionType) {
        editor.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, actionType);
    }
    // Меняем тип состояния (на сохранение)
    editor.advancedOptionsAction = c_oAscAdvancedOptionsAction.Save;
    
	var dataContainer = {data: null, part: null, index: 0, count: 0};
	var oAdditionalData = {};
    oAdditionalData["c"] = command;
    oAdditionalData["id"] = editor.documentId;
    oAdditionalData["userid"] = editor.documentUserId;
    oAdditionalData["vkey"] = editor.documentVKey;
    oAdditionalData["outputformat"] = filetype;
    oAdditionalData["title"] = changeFileExtention(editor.documentTitle, getExtentionByFormat(filetype));
	oAdditionalData["savetype"] = c_oAscSaveTypes.CompleteAll;
	if (options.isNoData) {
		;//nothing
	} else if (null == options.oDocumentMailMerge &&  c_oAscFileType.PDF === filetype) {
		var dd = editor.WordControl.m_oDrawingDocument;
		dataContainer.data = dd.ToRendererPart();
        //console.log(oAdditionalData["data"]);
	} else if (c_oAscFileType.JSON === filetype) {
		oAdditionalData['url'] = editor.mailMergeFileData['url'];
		oAdditionalData['format'] = editor.mailMergeFileData['fileType'];
		// ToDo select csv params
		oAdditionalData['codepage'] = c_oAscCodePageUtf8;
		oAdditionalData['delimiter'] = c_oAscCsvDelimiter.Comma
	} else if (c_oAscFileType.TXT === filetype && !options.txtOptions && null == options.oDocumentMailMerge && null == options.oMailMergeSendData) {
		// Мы открывали команду, надо ее закрыть.
		if (actionType) {
			editor.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, actionType);
		}
		var cp = {'codepage': c_oAscCodePageUtf8, 'encodings': getEncodingParams()};
		editor.asc_fireCallback("asc_onAdvancedOptions", new asc.asc_CAdvancedOptions(c_oAscAdvancedOptionsID.TXT, cp), editor.advancedOptionsAction);
		return;
	} else if (c_oAscFileType.HTML === filetype && null == options.oDocumentMailMerge && null == options.oMailMergeSendData) {
		//в asc_nativeGetHtml будет вызван select all, чтобы выделился документ должны выйти из колонтитулов и автофигур
		var _e = new CKeyboardEvent();
		_e.CtrlKey = false;
		_e.KeyCode = 27;
		editor.WordControl.m_oLogicDocument.OnKeyDown(_e);
		//сделано через сервер, потому что нет простого механизма сохранения на клиенте
		dataContainer.data = '\ufeff' + window["asc_docs_api"].prototype["asc_nativeGetHtml"].call(editor);
	} else {
		if (options.txtOptions instanceof asc.asc_CTXTAdvancedOptions) {
			oAdditionalData["codepage"] = options.txtOptions.asc_getCodePage();
		}
		var oLogicDocument;
		if(null != options.oDocumentMailMerge)
			oLogicDocument = options.oDocumentMailMerge;
		else
			oLogicDocument = editor.WordControl.m_oLogicDocument;
		var oBinaryFileWriter;
		if(null != options.oMailMergeSendData && c_oAscFileType.HTML == options.oMailMergeSendData.get_MailFormat())
			oBinaryFileWriter = new BinaryFileWriter(oLogicDocument, false, true);
		else
			oBinaryFileWriter = new BinaryFileWriter(oLogicDocument);
		dataContainer.data = oBinaryFileWriter.Write();
	}
	if(null != options.oMailMergeSendData){
		oAdditionalData["mailmergesend"] = options.oMailMergeSendData;
		var MailMergeMap = editor.WordControl.m_oLogicDocument.MailMergeMap;
		var aJsonOut = [];
		if(MailMergeMap.length > 0){
			var oFirstRow = MailMergeMap[0];
			var aRowOut = [];
			for(var i in oFirstRow)
				aRowOut.push(i);
			aJsonOut.push(aRowOut);
		}
		//todo может надо запоминать порядок for in в первом столбце, если for in будет по-разному обходить строки
		for(var i = 0; i < MailMergeMap.length; ++i){
			var oRow = MailMergeMap[i];
			var aRowOut = [];
			for(var j in oRow)
				aRowOut.push(oRow[j]);
			aJsonOut.push(aRowOut);
		}
		dataContainer.data = dataContainer.data.length + ';' + dataContainer.data + JSON.stringify(aJsonOut);
	}
    var fCallback = null;
    if (!options.isNoCallback) {
        fCallback = function (input) {
          var error = c_oAscError.ID.Unknown;
          //input = {'type': command, 'status': 'err', 'data': -80};
          if (null != input && command == input['type']) {
            if ('ok' == input['status']){
              if (options.isNoUrl) {
                error = c_oAscError.ID.No;
              } else {
                var url = input['data'];
                if (url) {
                  error = c_oAscError.ID.No;
                  editor.processSavedFile(url, options.downloadType);
                }
              }
            } else {
              error = g_fMapAscServerErrorToAscError(parseInt(input["data"]));
            }
          }
          if (c_oAscError.ID.No != error) {
            editor.asc_fireCallback('asc_onError', options.errorDirect || error, c_oAscError.Level.NoCritical);
          }
          // Меняем тип состояния (на никакое)
          editor.advancedOptionsAction = c_oAscAdvancedOptionsAction.None;
          if (actionType) {
            editor.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, actionType);
          }
        };
    }
	editor.fCurCallback = fCallback;
	g_fSaveWithParts(function(fCallback1, oAdditionalData1, dataContainer1){sendCommand2(editor, fCallback1, oAdditionalData1, dataContainer1);}, fCallback, fCallbackRequest, oAdditionalData, dataContainer);
}

function _addImageUrl2 (url)
{
	editor.AddImageUrl2 (url);
}
function _isDocumentModified2 ()
{
	return editor.isDocumentModified();
}
function  _asc_scrollTo (x,y)
{
	editor.WordControl.m_oScrollHorApi.scrollToX(x);
	editor.WordControl.m_oScrollVerApi.scrollToY(y);
}

function CErrorData()
{
    this.Value = 0;
}

CErrorData.prototype.put_Value = function(v){ this.Value = v; };
CErrorData.prototype.get_Value = function() { return this.Value; };
//test

// Вставка диаграмм
asc_docs_api.prototype.asc_getChartObject = function(type)
{	
	this.isChartEditor = true;		// Для совместного редактирования

    if(!isRealNumber(type))
    {
        this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props);
    }

    return this.WordControl.m_oLogicDocument.Get_ChartObject(type);
};

asc_docs_api.prototype.asc_addChartDrawingObject = function(options)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        History.Create_NewPoint(historydescription_Document_AddChart);
        this.WordControl.m_oLogicDocument.Add_InlineImage( null, null, null, options );
    }
};
asc_docs_api.prototype.asc_doubleClickOnChart = function(obj)
{
	this.WordControl.onMouseUpMainSimple();
    this.asc_fireCallback("asc_doubleClickOnChart", obj);
};

asc_docs_api.prototype.asc_editChartDrawingObject = function(chartBinary)
{
    /**/
	
	// Находим выделенную диаграмму и накатываем бинарник
	if ( isObject(chartBinary) )
	{
		var binary = chartBinary["binary"];
        if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
        {
            History.Create_NewPoint(historydescription_Document_EditChart);
            this.WordControl.m_oLogicDocument.Edit_Chart(binary);
        }
	}
};

asc_docs_api.prototype.sync_closeChartEditor = function()
{
    this.asc_fireCallback("asc_onCloseChartEditor");
};

asc_docs_api.prototype.asc_setDrawCollaborationMarks = function (bDraw)
{
    if ( bDraw !== this.isCoMarksDraw )
    {
        this.isCoMarksDraw = bDraw;
        this.WordControl.m_oDrawingDocument.ClearCachePages();
        this.WordControl.m_oDrawingDocument.FirePaint();
    }
};

asc_docs_api.prototype.asc_AddMath = function(Type)
{
    var loader = window.g_font_loader;
    var fontinfo = g_fontApplication.GetFontInfo("Cambria Math");
    var isasync = loader.LoadFont(fontinfo);
    if (false === isasync)
    {
        return this.asc_AddMath2(Type);
    }
    else
    {
        this.FontAsyncLoadType = 1;
        this.FontAsyncLoadParam = Type;
    }
};

asc_docs_api.prototype.asc_AddMath2 = function(Type)
{
    if ( false === this.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Paragraph_Content) )
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint(historydescription_Document_AddMath);
		var MathElement = new MathMenu (Type);
        this.WordControl.m_oLogicDocument.Paragraph_Add( MathElement );
    }
};

//----------------------------------------------------------------------------------------------------------------------
// Функции для работы с MailMerge
//----------------------------------------------------------------------------------------------------------------------
asc_docs_api.prototype.asc_StartMailMerge = function(oData){};
asc_docs_api.prototype.asc_StartMailMergeByList = function(aList){};
asc_docs_api.prototype.asc_GetReceptionsCount = function(){};
asc_docs_api.prototype.asc_GetMailMergeFieldsNameList = function(){};
asc_docs_api.prototype.asc_AddMailMergeField = function(Name){};
asc_docs_api.prototype.asc_SetHighlightMailMergeFields = function(Value){};
asc_docs_api.prototype.asc_PreviewMailMergeResult = function(Index){};
asc_docs_api.prototype.asc_EndPreviewMailMergeResult = function(){};
asc_docs_api.prototype.sync_StartMailMerge = function(){};
asc_docs_api.prototype.sync_PreviewMailMergeResult = function(Index){};
asc_docs_api.prototype.sync_EndPreviewMailMergeResult = function(){};
asc_docs_api.prototype.sync_HighlightMailMergeFields = function(Value){};
asc_docs_api.prototype.asc_getMailMergeData = function(){};
asc_docs_api.prototype.asc_setMailMergeData = function(aList){};
asc_docs_api.prototype.asc_sendMailMergeData = function(oData){};
asc_docs_api.prototype.asc_GetMailMergeFiledValue = function(nIndex, sName){};
//----------------------------------------------------------------------------------------------------------------------
// Работаем со стилями
//----------------------------------------------------------------------------------------------------------------------
asc_docs_api.prototype.asc_GetStyleFromFormatting = function(){return null;};
asc_docs_api.prototype.asc_AddNewStyle = function(oStyle){};
asc_docs_api.prototype.asc_RemoveStyle = function(sName){};
asc_docs_api.prototype.asc_RemoveAllCustomStyles = function(){};
asc_docs_api.prototype.asc_IsStyleDefault = function(sName){return true;};
asc_docs_api.prototype.asc_IsDefaultStyleChanged = function(sName){return false;};
asc_docs_api.prototype.asc_GetStyleNameById = function(StyleId){return this.WordControl.m_oLogicDocument.Get_StyleNameById(StyleId);};
//----------------------------------------------------------------------------------------------------------------------
// Работаем с рецензированием
//----------------------------------------------------------------------------------------------------------------------
asc_docs_api.prototype.asc_SetTrackRevisions = function(bTrack){};
asc_docs_api.prototype.asc_IsTrackRevisions = function(){return false;};
asc_docs_api.prototype.sync_BeginCatchRevisionsChanges = function(){};
asc_docs_api.prototype.sync_EndCatchRevisionsChanges = function(){};
asc_docs_api.prototype.sync_AddRevisionsChange = function(Change){};
asc_docs_api.prototype.asc_AcceptChanges = function(Change){};
asc_docs_api.prototype.asc_RejectChanges = function(Change){};
asc_docs_api.prototype.asc_HaveRevisionsChanges = function(){return false};
asc_docs_api.prototype.asc_HaveNewRevisionsChanges = function(){return false};
asc_docs_api.prototype.asc_GetNextRevisionsChange = function(){};
asc_docs_api.prototype.asc_GetPrevRevisionsChange = function(){};
asc_docs_api.prototype.sync_UpdateRevisionsChangesPosition = function(X, Y){};
asc_docs_api.prototype.asc_AcceptAllChanges = function(){};
asc_docs_api.prototype.asc_RejectAllChanges = function(){};

function CRevisionsChange()
{
    this.Type      = c_oAscRevisionsChangeType.Unknown;
    this.X         = 0;
    this.Y         = 0;
    this.Value     = "";

    this.UserName  = "";
    this.UserId    = "";
    this.DateTime  = "";

    this.Paragraph = null;
    this.StartPos  = null;
    this.EndPos    = null;

    this._X       = 0;
    this._Y       = 0;
    this._PageNum = 0;
    this._PosChanged = false;
}
CRevisionsChange.prototype.get_UserId = function(){return this.UserId;};
CRevisionsChange.prototype.put_UserId = function(UserId){this.UserId = UserId;};
CRevisionsChange.prototype.get_UserName = function(){return this.UserName;};
CRevisionsChange.prototype.put_UserName = function(UserName){this.UserName = UserName;};
CRevisionsChange.prototype.get_DateTime = function(){return this.DateTime};
CRevisionsChange.prototype.put_DateTime = function(DateTime){this.DateTime = DateTime};
CRevisionsChange.prototype.get_StartPos = function(){return this.StartPos};
CRevisionsChange.prototype.put_StartPos = function(StartPos){this.StartPos = StartPos;};
CRevisionsChange.prototype.get_EndPos = function(){return this.EndPos};
CRevisionsChange.prototype.put_EndPos = function(EndPos){this.EndPos = EndPos;};
CRevisionsChange.prototype.get_Type  = function(){return this.Type;};
CRevisionsChange.prototype.get_X     = function(){return this.X;};
CRevisionsChange.prototype.get_Y     = function(){return this.Y;};
CRevisionsChange.prototype.get_Value = function(){return this.Value;};
CRevisionsChange.prototype.put_Type  = function(Type){this.Type = Type;};
CRevisionsChange.prototype.put_XY    = function(X, Y){this.X = X; this.Y = Y;};
CRevisionsChange.prototype.put_Value = function(Value){this.Value = Value;};
CRevisionsChange.prototype.put_Paragraph = function(Para)
{
    this.Paragraph = Para;
};
CRevisionsChange.prototype.get_Paragraph = function(){return this.Paragraph;};
CRevisionsChange.prototype.get_LockUserId = function()
{
    if (this.Paragraph)
    {
        var Lock = this.Paragraph.Get_Lock();
        var LockType = Lock.Get_Type();

        if (locktype_Mine !== LockType && locktype_None !== LockType)
            return Lock.Get_UserId();
    }

    return null;
};
CRevisionsChange.prototype.put_InternalPos = function(x, y, pageNum)
{
    if (this._PageNum !== pageNum
        || Math.abs(this._X - x) > 0.001
        || Math.abs(this._Y - y) > 0.001)
    {
        this._X = x;
        this._Y = y;
        this._PageNum = pageNum;
        this._PosChanged = true;
    }
    else
    {
        this._PosChanged = false;
    }
};
CRevisionsChange.prototype.get_InternalPosX = function()
{
    return this._X;
};
CRevisionsChange.prototype.get_InternalPosY = function()
{
    return this._Y;
};
CRevisionsChange.prototype.get_InternalPosPageNum = function()
{
    return this._PageNum;
};
CRevisionsChange.prototype.ComparePrevPosition = function()
{
    if (true === this._PosChanged)
        return false;

    return true;
};

asc_docs_api.prototype.asc_undoAllChanges = function ()
{
    this.WordControl.m_oLogicDocument.Document_Undo({All : true});
};
asc_docs_api.prototype.asc_CloseFile = function()
{
    History.Clear();
	g_oIdCounter.Clear();
    g_oTableId.Clear();
    CollaborativeEditing.Clear();
	this.isApplyChangesOnOpenEnabled = true;

	var oLogicDocument = this.WordControl.m_oLogicDocument;
	oLogicDocument.Stop_Recalculate();
	oLogicDocument.Stop_CheckSpelling();
	window.global_pptx_content_loader.ImageMapChecker = {};

    this.WordControl.m_oDrawingDocument.CloseFile();
};
asc_docs_api.prototype.asc_SetFastCollaborative = function(isOn)
{
    if (CollaborativeEditing)
        CollaborativeEditing.Set_Fast(isOn);
};

window["asc_docs_api"] = asc_docs_api;
window["asc_docs_api"].prototype["asc_nativeOpenFile"] = function(base64File, version)
{
	this.SpellCheckUrl = '';

	this.User = new Asc.asc_CUser();
	this.User.asc_setId("TM");
	this.User.asc_setUserName("native");
	
	this.WordControl.m_bIsRuler = false;
	this.WordControl.Init();
	
	this.InitEditor();
	this.DocumentType = 2;
	this.LoadedObjectDS = Common_CopyObj(this.WordControl.m_oLogicDocument.Get_Styles().Style);
	
	g_oIdCounter.Set_Load(true);

	var openParams = {checkFileSize: this.isMobileVersion, charCount: 0, parCount: 0};
	var oBinaryFileReader = new BinaryFileReader(this.WordControl.m_oLogicDocument, openParams);

    if (undefined === version)
    {
        if (oBinaryFileReader.Read(base64File))
        {
            g_oIdCounter.Set_Load(false);
            this.LoadedObject = 1;

            this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);
        }
        else
            this.asc_fireCallback("asc_onError", c_oAscError.ID.MobileUnexpectedCharCount, c_oAscError.Level.Critical);
    }
    else
    {
        g_nCurFileVersion = version;		
        if(oBinaryFileReader.ReadData(base64File))
        {
            g_oIdCounter.Set_Load(false);
            this.LoadedObject = 1;

            this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);
        }
        else
            this.asc_fireCallback("asc_onError",c_oAscError.ID.MobileUnexpectedCharCount,c_oAscError.Level.Critical);
    }

    if (undefined != window["Native"])
        return;
		
	//callback
	this.DocumentOrientation = (null == editor.WordControl.m_oLogicDocument) ? true : !editor.WordControl.m_oLogicDocument.Orientation;
	var sizeMM;
	if(this.DocumentOrientation)
		sizeMM = DocumentPageSize.getSize(Page_Width, Page_Height);
	else
		sizeMM = DocumentPageSize.getSize(Page_Height, Page_Width);
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
        if (1 === CollaborativeEditing.m_nUseType)
        {
            this.isApplyChangesOnOpen = true;
            CollaborativeEditing.Apply_Changes();
            CollaborativeEditing.Release_Locks();
            return;
        }
    }

    Document.CurPos.ContentPos = 0;

    var RecalculateData =
    {
        Inline : { Pos : 0, PageNum : 0 },
        Flow   : [],
        HdrFtr : [],
        Drawings: {
            All: true,
            Map:{}
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
    this._coAuthoringSetChanges(changes, new CDocumentColor( 191, 255, 199 ));
	CollaborativeEditing.Apply_OtherChanges();
};

window["asc_docs_api"].prototype["asc_nativeApplyChanges2"] = function(data, isFull)
{
    // Чтобы заново созданные параграфы не отображались залоченными
    g_oIdCounter.Set_Load( true );
	
    var stream = new FT_Stream2(data, data.length);
    stream.obj = null;
    var Loader = { Reader : stream, Reader2 : null };
    var _color = new CDocumentColor( 191, 255, 199 );

    // Применяем изменения, пока они есть
    var _count = Loader.Reader.GetLong();

    var _pos = 4;
    for (var i = 0; i < _count; i++)
    {
        if (window["NATIVE_EDITOR_ENJINE"] === true && window["native"]["CheckNextChange"])
        {
            if (!window["native"]["CheckNextChange"]())
                break;
        }

        var _len = Loader.Reader.GetLong();
        _pos += 4;
        stream.size = _pos + _len;

        var _id  = Loader.Reader.GetString2();
        var _read_pos = Loader.Reader.GetCurPos();

        var Type = Loader.Reader.GetLong();
        var Class = null;

        if ( historyitem_type_HdrFtr === Type )
        {
            Class = editor.WordControl.m_oLogicDocument.HdrFtr;
        }
        else
            Class = g_oTableId.Get_ById( _id );

        stream.Seek(_read_pos);
        stream.Seek2(_read_pos);

        if ( null != Class )
            Class.Load_Changes( Loader.Reader, Loader.Reader2, _color );

        _pos += _len;
		stream.Seek2(_pos);
		stream.size = data.length;
    }

    if (isFull)
    {
        CollaborativeEditing.m_aChanges = [];

        // У новых элементов выставляем указатели на другие классы
        CollaborativeEditing.Apply_LinkData();

        // Делаем проверки корректности новых изменений
        CollaborativeEditing.Check_MergeData();

        CollaborativeEditing.OnEnd_ReadForeignChanges();

        if (window["NATIVE_EDITOR_ENJINE"] === true && window["native"]["AddImageInChanges"])
        {
            var _new_images = CollaborativeEditing.m_aNewImages;
            var _new_images_len = _new_images.length;

            for (var nImage = 0; nImage < _new_images_len; nImage++)
                window["native"]["AddImageInChanges"](_new_images[nImage]);
        }
    }

    g_oIdCounter.Set_Load( false );
};

window["asc_docs_api"].prototype["asc_nativeGetFile"] = function()
{
	var oBinaryFileWriter = new BinaryFileWriter(this.WordControl.m_oLogicDocument);
    return oBinaryFileWriter.Write();
};

window["asc_docs_api"].prototype["asc_nativeGetFileData"] = function()
{
    var oBinaryFileWriter = new BinaryFileWriter(this.WordControl.m_oLogicDocument);
    var _memory = oBinaryFileWriter.memory;

    oBinaryFileWriter.Write2();

	var _header = c_oSerFormat.Signature + ";v" + c_oSerFormat.Version + ";" + _memory.GetCurPosition() + ";";
	window["native"]["Save_End"](_header, _memory.GetCurPosition());
	
	return _memory.ImData.data;
};

window["asc_docs_api"].prototype["asc_nativeGetHtml"] = function()
{
    var _old = copyPasteUseBinary;
    copyPasteUseBinary = false;
    this.WordControl.m_oLogicDocument.Select_All();
    var oCopyProcessor = new CopyProcessor(this);
    oCopyProcessor.Start();
    var _ret = "<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" /></head><body>" + oCopyProcessor.getInnerHtml() + "</body></html>";
    this.WordControl.m_oLogicDocument.Selection_Remove();
    copyPasteUseBinary = _old;
    return _ret;
};

window["asc_docs_api"].prototype["asc_AddHtml"] = function(_iframeId)
{
    var ifr = document.getElementById(_iframeId);

    var frameWindow = window.frames[_iframeId];
    if (frameWindow)
    {
        if(null != frameWindow.document && null != frameWindow.document.body)
        {
            ifr.style.display  = "block";
            this.WordControl.m_oLogicDocument.TurnOffHistory();
            Editor_Paste_Exec(this, frameWindow.document.body, ifr);
            this.WordControl.m_oLogicDocument.TurnOnHistory();
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

		_memory1.Copy           = _memory1["Copy"];
		_memory1.ClearNoAttack  = _memory1["ClearNoAttack"];
		_memory1.WriteByte      = _memory1["WriteByte"];
		_memory1.WriteBool      = _memory1["WriteBool"];
		_memory1.WriteLong      = _memory1["WriteLong"];
		_memory1.WriteDouble    = _memory1["WriteDouble"];
		_memory1.WriteString    = _memory1["WriteString"];
		_memory1.WriteString2   = _memory1["WriteString2"];
		
		_memory2.Copy           = _memory1["Copy"];
		_memory2.ClearNoAttack  = _memory1["ClearNoAttack"];
		_memory2.WriteByte      = _memory1["WriteByte"];
		_memory2.WriteBool      = _memory1["WriteBool"];
		_memory2.WriteLong      = _memory1["WriteLong"];
		_memory2.WriteDouble    = _memory1["WriteDouble"];
		_memory2.WriteString    = _memory1["WriteString"];
		_memory2.WriteString2   = _memory1["WriteString2"];
	}
	
	var _printer = new CDocumentRenderer();
	_printer.Memory				    = _memory1;
	_printer.VectorMemoryForPrint	= _memory2;
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
            var pagescount = Math.min(_drawing_document.m_lPagesCount, _drawing_document.m_lCountCalculatePages);

            window["AscDesktopEditor"]["Print_Start"](this.DocumentUrl, pagescount, "", this.getCurrentPage());

            var oDocRenderer = new CDocumentRenderer();
            oDocRenderer.VectorMemoryForPrint = new CMemory();
            var bOldShowMarks = this.ShowParaMarks;
            this.ShowParaMarks = false;

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

window["asc_docs_api"].prototype["asc_nativeGetPDF"] = function()
{
    var pagescount = this["asc_nativePrintPagesCount"]();

    var _renderer = new CDocumentRenderer();
    _renderer.VectorMemoryForPrint = new CMemory();
    var _bOldShowMarks = this.ShowParaMarks;
    this.ShowParaMarks = false;

    for (var i = 0; i < pagescount; i++)
    {
        this["asc_nativePrint"](_renderer, i);
    }

    this.ShowParaMarks = _bOldShowMarks;

    window["native"]["Save_End"]("", _renderer.Memory.GetCurPosition());

    return _renderer.Memory.data;
};

// cool api (autotests)
window["asc_docs_api"].prototype["Add_Text"] = function(_text)
{
    this.WordControl.m_oLogicDocument.TextBox_Put(_text);
};
window["asc_docs_api"].prototype["Add_NewParagraph"] = function()
{
    var LogicDocument = this.WordControl.m_oLogicDocument;
    if (false === LogicDocument.Document_Is_SelectionLocked(changestype_Document_Content_Add))
    {
        LogicDocument.Create_NewHistoryPoint(historydescription_Document_EnterButton);
        LogicDocument.Add_NewParagraph(true);
    }
};
window["asc_docs_api"].prototype["Cursor_MoveLeft"] = function()
{
    this.WordControl.m_oLogicDocument.Cursor_MoveLeft();
};
window["asc_docs_api"].prototype["Cursor_MoveRight"] = function()
{
    this.WordControl.m_oLogicDocument.Cursor_MoveRight();
};
window["asc_docs_api"].prototype["Cursor_MoveUp"] = function()
{
    this.WordControl.m_oLogicDocument.Cursor_MoveUp();
};
window["asc_docs_api"].prototype["Cursor_MoveDown"] = function()
{
    this.WordControl.m_oLogicDocument.Cursor_MoveDown();
};
window["asc_docs_api"].prototype["Get_DocumentRecalcId"] = function()
{
    return this.WordControl.m_oLogicDocument.RecalcId;
};
window["asc_docs_api"].prototype["asc_IsSpellCheckCurrentWord"] = function()
{
	return this.IsSpellCheckCurrentWord;
};
window["asc_docs_api"].prototype["asc_putSpellCheckCurrentWord"] = function(value)
{
	this.IsSpellCheckCurrentWord = value;
};

// desktop editor spellcheck
function CSpellCheckApi_desktop()
{
    this.docId  = undefined;

    this.init = function(docid)
    {
        this.docId = docid;
    };

    this.set_url = function(url) {};

    this.spellCheck = function(spellData)
    {
        window["AscDesktopEditor"]["SpellCheck"](spellData);
    };

    this.onSpellCheck = function(spellData)
    {
        SpellCheck_CallBack(spellData);
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
