/** @define {boolean} */
var ASC_DOCS_API_DEBUG = true;

var documentId = undefined;
var documentUrl = 'null';
var documentTitle = 'null';
var documentFormat = 'null';
var documentVKey = 'null';
var documentOrigin = "";

function CDocOpenProgress()
{
    this.Type = c_oAscAsyncAction.Open;

    this.FontsCount = 0;
    this.CurrentFont = 0;

    this.ImagesCount = 0;
    this.CurrentImage = 0;
}

CDocOpenProgress.prototype.get_Type = function(){return this.Type}
CDocOpenProgress.prototype.get_FontsCount = function(){return this.FontsCount}
CDocOpenProgress.prototype.get_CurrentFont = function(){return this.CurrentFont}
CDocOpenProgress.prototype.get_ImagesCount = function(){return this.ImagesCount}
CDocOpenProgress.prototype.get_CurrentImage = function(){return this.CurrentImage}

function CDocInfo (obj){
	if(obj){
		if (typeof obj.Id != 'undefined'){
			this.Id = obj.Id;
		}
		if (typeof obj.Url != 'undefined'){
			this.Url = obj.Url;
		}
		if (typeof obj.Title != 'undefined'){
			this.Title = obj.Title;
		}
		if (typeof obj.Format != 'undefined'){
			this.Format = obj.Format;
		}
		if (typeof obj.VKey != 'undefined'){
			this.VKey = obj.VKey;
		}
	}
	else{
		this.Id = null;
		this.Url = null;
		this.Title = null;
		this.Format = null;
		this.VKey = null;
	}
}
CDocInfo.prototype.get_Id = function(){return this.Id}
CDocInfo.prototype.put_Id = function(v){this.Id = v;}
CDocInfo.prototype.get_Url = function(){return this.Url;}
CDocInfo.prototype.put_Url = function(v){this.Url = v;}
CDocInfo.prototype.get_Title = function(){return this.Title;}
CDocInfo.prototype.put_Title = function(v){this.Title = v;}
CDocInfo.prototype.get_Format = function(){return this.Format;}
CDocInfo.prototype.put_Format = function(v){this.Format = v;}
CDocInfo.prototype.get_VKey = function(){return this.VKey;}
CDocInfo.prototype.put_VKey = function(v){this.VKey = v;}
CDocInfo.prototype.get_Origin = function(){return this.Origin;}
CDocInfo.prototype.put_Origin = function(v){this.Origin = v;}
function CColor (r,g,b){
	this.r = (undefined == r) ? 0 : r;
	this.g = (undefined == g) ? 0 : g;
	this.b = (undefined == b) ? 0 : b;
}
CColor.prototype.get_r = function(){return this.r}
CColor.prototype.put_r = function(v){this.r = v;}
CColor.prototype.get_g = function(){return this.g;}
CColor.prototype.put_g = function(v){this.g = v;}
CColor.prototype.get_b = function(){return this.b;}
CColor.prototype.put_b = function(v){this.b = v;}

function CListType(obj)
{
	if (obj)
	{
		this.Type = (undefined == obj.Type) ? null : obj.Type;
		this.SubType = (undefined == obj.Type) ? null : obj.SubType;
	}
	else
	{
		this.Type = null;
		this.SubType = null;
	}
}
CListType.prototype.get_ListType = function() { return this.Type; }
CListType.prototype.get_ListSubType = function() { return this.SubType; }

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
CPosition.prototype.get_X = function() { return this.X; }
CPosition.prototype.put_X = function(v) { this.X = v; }
CPosition.prototype.get_Y = function() { return this.Y; }
CPosition.prototype.put_Y = function(v) { this.Y = v; }

function CPaddings( obj )
{
	if ( obj )
	{
		this.Left = (undefined == obj.Left) ? null : obj.Left;
		this.Top = (undefined == obj.Top) ? null : obj.Top;
		this.Bottom = (undefined == obj.Bottom) ? null : obj.Bottom;
		this.Right = (undefined == obj.Right) ? null : obj.Right;
	}
	else
	{
		this.Left = null;
		this.Top = null;
		this.Bottom = null;
		this.Right = null;
	}
}

CPaddings.prototype.get_Left = function() { return this.Left; }
CPaddings.prototype.put_Left = function(v) { this.Left = v; }
CPaddings.prototype.get_Top = function() { return this.Top; }
CPaddings.prototype.put_Top = function(v) { this.Top = v; }
CPaddings.prototype.get_Bottom = function() { return this.Bottom; }
CPaddings.prototype.put_Bottom = function(v) { this.Bottom = v; }
CPaddings.prototype.get_Right = function() { return this.Right; }
CPaddings.prototype.put_Right = function(v) { this.Right = v; }

function CImageSize( width, height )
{
	this.Width = (undefined == width) ? 0.0 : width;
	this.Height = (undefined == height) ? 0.0 : height;
}

CImageSize.prototype.get_ImageWidth = function() { return this.Width; }
CImageSize.prototype.get_ImageHeight = function() { return this.Height; }

function CImgProperty( obj )
{
	if( obj )
	{
		this.Width = (undefined != obj.Width) ? obj.Width : null;
		this.Height = (undefined != obj.Height) ? obj.Height : null;
		this.WrappingStyle = (undefined != obj.WrappingStyle) ? obj.WrappingStyle : null;
		
		this.Paddings = (undefined != obj.Paddings && null != obj.Paddings) ? new CPaddings (obj.Paddings) : null;
		this.Position = (undefined != obj.Position && null != obj.Position) ? new CPosition (obj.Position) : null;
		
		this.ImageUrl = (undefined != obj.ImageUrl) ? obj.ImageUrl : null;
	}
	else
	{
		this.Width = null;
		this.Height = null;
		this.WrappingStyle = null;
		this.Paddings = new CPaddings ();	// default values
		this.Position = new CPosition ();	// default values
		this.ImageUrl = null;
	}
}

CImgProperty.prototype.get_Width = function() { return this.Width; }
CImgProperty.prototype.put_Width = function(v) { this.Width = v; }
CImgProperty.prototype.get_Height = function() { return this.Height; }
CImgProperty.prototype.put_Height = function(v) { this.Height = v; }
CImgProperty.prototype.get_WrappingStyle = function() { return this.WrappingStyle; }
CImgProperty.prototype.put_WrappingStyle = function(v) { this.WrappingStyle = v; }
// Возвращается объект класса CPaddings
CImgProperty.prototype.get_Paddings = function() { return this.Paddings; }
// Аргумент объект класса CPaddings
CImgProperty.prototype.put_Paddings = function(v) { this.Paddings = v; }
// Возвращается объект класса CPosition
CImgProperty.prototype.get_Position = function() { return this.Position; }
// Аргумент объект класса CPosition
CImgProperty.prototype.put_Position = function(v) { this.Position = v; }
CImgProperty.prototype.get_ImageUrl = function() { return this.ImageUrl; }
CImgProperty.prototype.put_ImageUrl = function(v) { this.ImageUrl = v; }
CImgProperty.prototype.get_OriginSize = function(api)
{
    var _img = api.ImageLoader.map_image_index[this.ImageUrl];
    if (_img != undefined && _img.Image != null)
    {
        var _w = _img.Image.width;
        var _h = _img.Image.height;

        var _max = 800;
        if (_w > _max || _h > _max)
        {
            var _koef = _max / Math.max(_w, _h);

            _w = parseInt(_koef * _w);
            _h = parseInt(_koef * _h);
        }
        return new CImageSize( parseInt(_w * g_dKoef_pix_to_mm), parseInt(_h * g_dKoef_pix_to_mm) );
    }
    return new CImageSize( 50, 50 );
}

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
	}
	else
	{
		this.Type = hdrftr_Footer;
		this.Position = 12.5;
		this.DifferentFirst = false;
		this.DifferentEvenOdd = false;
	}
}

CHeaderProp.prototype.get_Type = function(){ return this.Type; }
CHeaderProp.prototype.put_Type = function(v){ this.Type = v; }
CHeaderProp.prototype.get_Position = function(){ return this.Position; }
CHeaderProp.prototype.put_Position = function(v){ this.Position = v; }
CHeaderProp.prototype.get_DifferentFirst = function(){ return this.DifferentFirst; }
CHeaderProp.prototype.put_DifferentFirst = function(v){ this.DifferentFirst = v; }
CHeaderProp.prototype.get_DifferentEvenOdd = function(){ return this.DifferentEvenOdd; }
CHeaderProp.prototype.put_DifferentEvenOdd = function(v){ this.DifferentEvenOdd = v; }

function CSelectedObject( type, val )
{
	this.Type = (undefined != type) ? type : null;
	this.Value = (undefined != val) ? val : null;
}
// Возвращает тип объекта c_oAscTypeSelectElement
CSelectedObject.prototype.get_ObjectType = function() { return this.Type; }

// Возвращает собственно сам объект класса в зависимости от типа
// c_oAscTypeSelectElement.Paragraph CParagraphProp
// c_oAscTypeSelectElement.Image CImgProperty
// c_oAscTypeSelectElement.Table CTableProp
// c_oAscTypeSelectElement.Header CHeaderProp
CSelectedObject.prototype.get_ObjectValue = function() { return this.Value; }

// [!dirty hack for minimizer - don't delete this comment!] function CStylesPainter ()
// [!dirty hack for minimizer - don't delete this comment!] function CStyleImage ()
// [!dirty hack for minimizer - don't delete this comment!] function CFont ()
CStylesPainter.prototype.get_DefaultStylesImage = function() { return this.defaultStylesImage; }
CStylesPainter.prototype.get_DocStylesImage = function() { return this.docStylesImage; }
CStylesPainter.prototype.get_MergedStyles = function() { return this.mergedStyles; }
CStylesPainter.prototype.get_STYLE_THUMBNAIL_WIDTH = function() { return this.STYLE_THUMBNAIL_WIDTH; }
CStylesPainter.prototype.get_STYLE_THUMBNAIL_HEIGHT = function() { return this.STYLE_THUMBNAIL_HEIGHT; }

CStyleImage.prototype.get_ThumbnailOffset = function() { return this.ThumbnailOffset; }
CStyleImage.prototype.get_Type = function() { return this.Type; }
CStyleImage.prototype.get_Name = function() { return this.Name; }

CFont.prototype.get_FontId = function() { return this.id; }
CFont.prototype.get_FontName = function() { return this.name; }
CFont.prototype.get_FontThumbnail = function() { return this.thumbnail; }
CFont.prototype.get_FontType = function() { return this.type; }

// пользоваться так:
// подрубить его последним из скриптов к страничке
// и вызвать, после подгрузки (конец метода OnInit <- Drawing/HtmlPage.js)
// var _api = new asc_docs_api();
// _api.init(oWordControl);
bIsIE=false;

function asc_docs_api(name)
{
	/************ private!!! **************/
    this.HtmlElementName = name;

    this.WordControl = new CEditorPage(this);
    this.WordControl.Name = this.HtmlElementName;

    this.FontLoader = window.g_font_loader;
    this.ImageLoader = window.g_image_loader;
    this.FontLoader.Api = this;
    this.ImageLoader.Api = this;

    this.FontLoader.SetStandartFonts();

    this.LoadedObject = null;
    this.DocumentType = 0; // 0 - empty, 1 - test, 2 - document (from json)

    this.DocumentUrl = "";
    this.DocumentName = "";
        
    this.ShowParaMarks = false;
	this.isAddSpaceBetweenPrg = false;
    this.isPageBreakBefore = false;
    this.isKeepLinesTogether = false;

    this.isMobileVersion = false;
    this.isPaintFormat = false;
    this.isViewMode = false;
    /**************************************/

    this.bInit_word_control = false;
	this.isDocumentModify = false;
	
    this.isPasteFonts_Images = false;
    this.pasteCallback = null;
    this.pasteImageMap = null;
    this.EndActionLoadImages = 0;

    this.DocumentOrientation = orientation_Portrait ? true : false;

    this.SelectedObjectsStack = new Array();

    this.OpenDocumentProgress = new CDocOpenProgress();
}

asc_docs_api.prototype.SetUnchangedDocument = function()
{
    this.isDocumentModify = false;
    this.WordControl.m_oDrawingDocument.m_bIsSendApiDocChanged = false;

    this.fireCallback("asc_onDocumentModifiedChanged");
}

asc_docs_api.prototype.isDocumentModified = function()
{
    return this.isDocumentModify;
}

asc_docs_api.prototype.sync_BeginCatchSelectedElements = function()
{
    if (0 != this.SelectedObjectsStack.length)
        this.SelectedObjectsStack.splice(0, this.SelectedObjectsStack.length);
}
asc_docs_api.prototype.sync_EndCatchSelectedElements = function()
{
    this.fireCallback("asc_onFocusObject", this.SelectedObjectsStack);
}
asc_docs_api.prototype.getSelectedElements = function()
{
    return this.SelectedObjectsStack;
}
asc_docs_api.prototype.sync_ChangeLastSelectedElement = function(type, obj)
{			
	var oUnkTypeObj = null;
			
	switch( type )
	{
		case c_oAscTypeSelectElement.Paragraph: oUnkTypeObj = new CParagraphProp( obj );
			break;
		case c_oAscTypeSelectElement.Image: oUnkTypeObj = new CImgProperty( obj );
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
        this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new CSelectedObject( type, oUnkTypeObj );
    }
}

asc_docs_api.prototype.Init = function()
{
	if (window.editor == undefined)
	{
		window.editor = this;
		window['editor'] = window.editor;
	}
	this.WordControl.Init();
}

asc_docs_api.prototype.LoadDocument = function(c_DocInfo)
{
    this.WordControl.m_oDrawingDocument.m_bIsOpeningDocument = true;
    this.WordControl.m_oDrawingDocument.m_lMaxPageCalculate_opening = -1;
	
	if(c_DocInfo){
		documentId = c_DocInfo.get_Id();
		documentUrl = c_DocInfo.get_Url();
		documentTitle = c_DocInfo.get_Title();
		documentFormat = c_DocInfo.get_Format();
		
		documentVKey = c_DocInfo.get_VKey();
		// documentOrigin  = c_DocInfo.get_Origin();
		var sProtocol = window.location.protocol;
		var sHost = window.location.host;
		documentOrigin = "";
		if(sProtocol && "" != sProtocol)
			documentOrigin = sProtocol + "//" + sHost;
		else
			documentOrigin = sHost;
	}
	
    this.DocumentName = documentTitle;
	var oThis = this;
	if(documentId){
		this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);
		var rData = {url: documentUrl, title: documentTitle};
		sendCommand( oThis, function(){}, "open", JSON.stringify(rData) );

        this.sync_zoomChangeCallback(this.WordControl.m_nZoomValue, 0);
	}
	else
    {		
        editor.OpenTestDocument();
        this.sync_zoomChangeCallback(this.WordControl.m_nZoomValue, 0);
    }
}

asc_docs_api.prototype.SetFontsPath = function(path)
{
	this.FontLoader.fontFilesPath = path;
}

asc_docs_api.prototype.CreateComponents = function()
{
	var element = document.getElementById(this.HtmlElementName);
	if (element != null)
		element.innerHTML = "<div id=\"id_main\" class=\"block_elem\" style=\"-moz-user-select:none;-khtml-user-select:none;user-select:none;background-color:#B0B0B0;overflow:hidden;\" UNSELECTABLE=\"on\">\
								<div id=\"id_panel_left\" class=\"block_elem\">\
									<div id=\"id_buttonTabs\" class=\"block_elem buttonTabs\"></div>\
									<canvas id=\"id_vert_ruler\" class=\"block_elem\"></canvas>\
								</div>\
									<div id=\"id_panel_top\" class=\"block_elem\">\
									<canvas id=\"id_hor_ruler\" class=\"block_elem\"></canvas>\
									</div>\
                                    <div id=\"id_main_view\" class=\"block_elem\" style=\"overflow:hidden\">\
									    <canvas id=\"id_viewer\" class=\"block_elem\" style=\"background-color:#B0B0B0;z-index:1\"></canvas>\
									    <canvas id=\"id_viewer_overlay\" class=\"block_elem\" style=\"z-index:2\"></canvas>\
									    <div id=\"id_target_cursor\" class=\"block_elem\" style=\"background:black;width:2;height:13;display:none;z-index:3;\"></div>\
                                    </div>\
								</div>\
									<div id=\"id_panel_right\" class=\"block_elem\" style=\"margin-right:1px;background-color:#B0B0B0;\">\
									<div id=\"id_buttonRulers\" class=\"block_elem buttonRuler\"></div>\
									<div id=\"id_vertical_scroll\" style=\"left:0;top:0;width:18px;overflow:hidden;position:absolute;\">\
									<div id=\"panel_right_scroll\" class=\"block_elem\" style=\"left:0;top:0;width:18px;height:6000px;\"></div>\
									</div>\
									<div id=\"id_buttonPrevPage\" class=\"block_elem buttonPrevPage\"></div>\
									<div id=\"id_buttonNextPage\" class=\"block_elem buttonNextPage\"></div>\
								</div>\
									<div id=\"id_horscrollpanel\" class=\"block_elem\" style=\"margin-bottom:1px;background-color:#B0B0B0;\">\
									<div id=\"id_horizontal_scroll\" style=\"left:0;top:0;height:19px;overflow:hidden;position:absolute;width:100%;\">\
										<div id=\"panel_hor_scroll\" class=\"block_elem\" style=\"left:0;top:0;width:6000px;height:19px;\"></div>\
									</div>\
									</div>";
}

asc_docs_api.prototype.InitEditor = function()
{
    this.WordControl.m_oLogicDocument   = new CDocument(this.WordControl.m_oDrawingDocument);
    this.WordControl.m_oDrawingDocument.m_oLogicDocument = this.WordControl.m_oLogicDocument;
}

asc_docs_api.prototype.InitViewer = function()
{
    this.WordControl.m_oDrawingDocument.m_oDocumentRenderer = new CDocMeta();
}

asc_docs_api.prototype.OpenEmptyDocument = function()
{
	editor.InitEditor();
	this.LoadedObject = null;
	this.DocumentType = 0;
	this.WordControl.m_oLogicDocument.Fonts = [];
	this.FontLoader.LoadDocumentFonts(new Array(), true);
}

asc_docs_api.prototype.OpenTestDocument = function()
{
	editor.InitEditor();
	this.LoadedObject = null;
	this.DocumentType = 1;
	this.WordControl.m_oLogicDocument.Fonts = [];
	this.WordControl.m_oLogicDocument.ImageMap = {};
	this.FontLoader.LoadDocumentFonts(new Array(), true);
}

asc_docs_api.prototype.OpenTestDocumentViewer = function()
{	
	this.LoadedObject = null;
	this.DocumentType = 1;

    this.InitViewer();
    this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.Load("./Document/", window["document_base64"]);
    delete window["document_base64"];
	this.FontLoader.LoadDocumentFonts(this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.Fonts, true);
}

asc_docs_api.prototype.OpenDocument = function(url, gObject)
{
    this.InitViewer();
    this.LoadedObject = null;
    this.DocumentType = 1;

    this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.Load(url, gObject);
    this.FontLoader.LoadDocumentFonts(this.WordControl.m_oDrawingDocument.m_oDocumentRenderer.Fonts, true);
}

asc_docs_api.prototype.OpenDocument2 = function(url, gObject)
{
	this.InitEditor();
	this.DocumentUrl = url;
	this.DocumentType = 2;
	this.LoadedObjectDS = Common_CopyObj(this.WordControl.m_oLogicDocument.Get_Styles().Style);
	var oBinaryFileReader = new BinaryFileReader(this.WordControl.m_oLogicDocument);
	oBinaryFileReader.Read(gObject);
	this.LoadedObject = 1;

    this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Open);

	this.FontLoader.LoadEmbeddedFonts(this.DocumentUrl, this.WordControl.m_oLogicDocument.EmbeddedFonts);
	this.FontLoader.LoadDocumentFonts(this.WordControl.m_oLogicDocument.Fonts, false);
}
asc_docs_api.prototype.get_DocumentName = function()
{
	return this.DocumentName;
}
// Callbacks
/* все имена callback'оф начинаются с On. Пока сделаны: 
	OnBold, 
	OnItalic, 
	OnUnderline, 
	OnTextPrBaseline(возвращается расположение строки - supstring, superstring, baseline), 
	OnPrAlign(выравнивание по ширине, правому краю, левому краю, по центру), 
	OnListType( возвращается CListType )

	фейк-функции ожидающие TODO:
	Print,Undo,Redo,Copy,Cut,Paste,Share,Save,Download & callbacks
	OnFontName, OnFontSize, OnLineSpacing

	OnFocusObject( возвращается массив CSelectedObject )
	OnInitEditorStyles( возвращается CStylesPainter )
	OnSearchFound( возвращается CSearchResult );
	OnParaSpacingLine( возвращается CParagraphSpacing ) 
	OnLineSpacing( не используется? )
	OnTextColor( возвращается CColor )
	OnTextHightLight( возвращается CColor )
	OnInitEditorFonts( возвращается массив объектов СFont )
	OnFontFamily( возвращается CTextFontFamily )
*/
var _callbacks = {};

asc_docs_api.prototype.registerCallback = function(name, callback) {
	if (!_callbacks.hasOwnProperty(name))
		_callbacks[name] = []
	_callbacks[name].push(callback);
}

asc_docs_api.prototype.unregisterCallback = function(name, callback) {
	if (_callbacks.hasOwnProperty(name)) {
		for (var i = _callbacks[name].length - 1; i >= 0 ; --i) {
			if (_callbacks[name][i] == callback)
				_callbacks[name].splice(i, 1);
		}
	}
		_callbacks[name] = []
	_callbacks[name].push(callback);
}

asc_docs_api.prototype.fireCallback = function(name) {
	if (_callbacks.hasOwnProperty(name)) {
		for (var i = 0; i < _callbacks[name].length; ++i) {
			_callbacks[name][i].apply(this || window, Array.prototype.slice.call(arguments, 1));
		}
	}
}

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

// Paragraph spacing properties
function CParagraphInd (obj)
{
	if (obj)
	{
		this.Left = (undefined != obj.Left) ? obj.Left : null;					// Левый отступ
		this.Right = (undefined != obj.Right) ? obj.Right : null;				// Правый отступ
		this.FirstLine = (undefined != obj.FirstLine) ? obj.FirstLine : null;	// Первая строка
	}
	else
	{
		this.Left = 0;			// Левый отступ
		this.Right = 0;			// Правый отступ
		this.FirstLine = 0;		// Первая строка
	}
}
CParagraphInd.prototype.get_Left = function () { return this.Left; }
CParagraphInd.prototype.put_Left = function (v) { this.Left = v; }
CParagraphInd.prototype.get_Right = function () { return this.Right; }
CParagraphInd.prototype.put_Right = function (v) { this.Right = v; }
CParagraphInd.prototype.get_FirstLine = function () { return this.FirstLine; }
CParagraphInd.prototype.put_FirstLine = function (v) { this.FirstLine = v; }


// Paragraph spacing properties
function CParagraphSpacing (obj)
{
	if (obj)
	{
		this.Line = (undefined != obj.Line) ? obj.Line : null;				// Расстояние между строками внутри абзаца
		this.LineRule = (undefined != obj.LineRule) ? obj.LineRule : null;	// Тип расстрояния между строками
		this.Before = (undefined != obj.Before) ? obj.Before : null;		// Дополнительное расстояние до абзаца
		this.After = (undefined != obj.After) ? obj.After : null;			// Дополнительное расстояние после абзаца
	}
	else
	{
		this.Line = 1.15;					// Расстояние между строками внутри абзаца
		this.LineRule = linerule_Auto;		// Тип расстрояния между строками
		this.Before = 0;					// Дополнительное расстояние до абзаца
		this.After = 10 * g_dKoef_pt_to_mm;	// Дополнительное расстояние после абзаца
	}
}
CParagraphSpacing.prototype.get_Line = function ()
{
	return this.Line;
}
CParagraphSpacing.prototype.get_LineRule = function ()
{
	return this.LineRule;
}
CParagraphSpacing.prototype.get_Before = function ()
{
	return this.Before;
}
CParagraphSpacing.prototype.get_After = function ()
{
	return this.After;
}

// Paragraph shd properties
function CParagraphShd (obj)
{
	if (obj)
	{
		this.Value = (undefined != obj.Value) ? obj.Value : null;
		this.Color = (undefined != obj.Color && null != obj.Color) ? new CColor ( obj.Color.r, obj.Color.g, obj.Color.b ) : null;
	}
	else
	{
		this.Value = shd_Nil;
		this.Color = new CColor (255, 255, 255);
	}
}
CParagraphShd.prototype.get_Value = function ()
{
	return this.Value;
}
CParagraphShd.prototype.get_Color = function ()
{
	return this.Color;
}

function CParagraphProp (obj)
{
	if (obj)
	{
		this.ContextualSpacing = (undefined != obj.ContextualSpacing) ? obj.ContextualSpacing : null;
		this.Ind = (undefined != obj.Ind && null != obj.Ind) ? new CParagraphInd (obj.Ind) : null;
		this.KeepLines = (undefined != obj.KeepLines) ? obj.KeepLines : null;
		this.PageBreakBefore = (undefined != obj.PageBreakBefore) ? obj.PageBreakBefore : null;
		this.Spacing = (undefined != obj.Spacing && null != obj.Spacing) ? new CParagraphSpacing (obj.Spacing) : null;
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
		this.Ind = new CParagraphInd ();
		this.KeepLines = false;
		this.PageBreakBefore = false;
		this.Spacing = new CParagraphSpacing ();
	}
}

CParagraphProp.prototype.get_ContextualSpacing = function () { return this.ContextualSpacing; }
CParagraphProp.prototype.get_Ind = function () { return this.Ind; }
CParagraphProp.prototype.get_KeepLines = function () { return this.KeepLines; }
CParagraphProp.prototype.get_PageBreakBefore = function (){ return this.PageBreakBefore; }
CParagraphProp.prototype.get_Spacing = function () { return this.Spacing; }

// Paragraph properties
function CParagraphPropEx (obj)
{
	if (obj)
	{
		this.ContextualSpacing = (undefined != obj.ContextualSpacing) ? obj.ContextualSpacing : null;
		this.Ind = (undefined != obj.Ind && null != obj.Ind) ? new CParagraphInd (obj.Ind) : null;
		this.Jc = (undefined != obj.Jc) ? obj.Jc : null;
		this.KeepLines = (undefined != obj.KeepLines) ? obj.KeepLines : null;
		this.KeepNext = (undefined != obj.KeepNext) ? obj.KeepNext : null;
		this.PageBreakBefore = (undefined != obj.PageBreakBefore) ? obj.PageBreakBefore : null;
		this.Spacing = (undefined != obj.Spacing && null != obj.Spacing) ? new CParagraphSpacing (obj.Spacing) : null;
		this.Shd = (undefined != obj.Shd && null != obj.Shd) ? new CParagraphShd (obj.Shd) : null;
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
		this.Ind = new CParagraphInd ();
		this.Jc = align_Left;
		this.KeepLines = false;
		this.KeepNext = false;
		this.PageBreakBefore = false;
		this.Spacing = new CParagraphSpacing ();
		this.Shd = new CParagraphShd ();
		this.WidowControl = true;                  // Запрет висячих строк
		this.Tabs = null;
	}
}
CParagraphPropEx.prototype.get_ContextualSpacing = function ()
{
	return this.ContextualSpacing;
}
CParagraphPropEx.prototype.get_Ind = function ()
{
	return this.Ind;
}
CParagraphPropEx.prototype.get_Jc = function ()
{
	return this.Jc;
}
CParagraphPropEx.prototype.get_KeepLines = function ()
{
	return this.KeepLines;
}
CParagraphPropEx.prototype.get_KeepNext = function ()
{
	return this.KeepNext;
}
CParagraphPropEx.prototype.get_PageBreakBefore = function ()
{
	return this.PageBreakBefore;
}
CParagraphPropEx.prototype.get_Spacing = function ()
{
	return this.Spacing;
}
CParagraphPropEx.prototype.get_Shd = function ()
{
	return this.Shd;
}
CParagraphPropEx.prototype.get_WidowControl = function ()
{
	return this.WidowControl;
}
CParagraphPropEx.prototype.get_Tabs = function ()
{
	return this.Tabs;
}

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
function CTextFontFamily (obj)
{
	if (obj)
	{
		this.Name = (undefined != obj.Name) ? obj.Name : null; 		// "Times New Roman"
		this.Index = (undefined != obj.Index) ? obj.Index : null;	// -1
	}
	else
	{
		this.Name = "Times New Roman"; 	
		this.Index = -1;
	}
}
CTextFontFamily.prototype.get_Name = function ()
{
	return this.Name;
}
CTextFontFamily.prototype.get_Index = function ()
{
	return this.Index;
}
// CTextProp
function CTextProp (obj)
{
	if (obj)
	{
		this.Bold = (undefined != obj.Bold) ? obj.Bold : null;
		this.Italic = (undefined != obj.Italic) ? obj.Italic : null;
		this.Underline = (undefined != obj.Underline) ? obj.Underline : null;
		this.Strikeout = (undefined != obj.Strikeout) ? obj.Strikeout : null;
		this.FontFamily = (undefined != obj.FontFamily && null != obj.FontFamily) ? new CTextFontFamily (obj.FontFamily) : null;
		this.FontSize = (undefined != obj.FontSize) ? obj.FontSize : null;
		this.Color = (undefined != obj.Color && null != obj.Color) ? new CColor (obj.Color.r, obj.Color.g, obj.Color.b) : null;
		this.VertAlign = (undefined != obj.VertAlign) ? obj.VertAlign : null;
		this.HighLight = (undefined != obj.HighLight) ? obj.HighLight == highlight_None ? obj.HighLight : new CColor (obj.HighLight.r, obj.HighLight.g, obj.HighLight.b) : null;
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
		this.Bold = false;
		this.Italic = false;
		this.Underline = false;
		this.Strikeout = false;
		this.FontFamily = new CFontFamily ();
		this.FontSize = 12;
		this.Color = new CColor ();
		this.VertAlign = vertalign_Baseline;
		this.HighLight =highlight_None;
	}
}
CTextProp.prototype.get_Bold = function ()
{
	return this.Bold;
}
CTextProp.prototype.get_Italic = function ()
{
	return this.Italic;
}
CTextProp.prototype.get_Underline = function ()
{
	return this.Underline;
}
CTextProp.prototype.get_Strikeout = function ()
{
	return this.Strikeout;
}
CTextProp.prototype.get_FontFamily = function ()
{
	return this.FontFamily;
}
CTextProp.prototype.get_FontSize = function ()
{
	return this.FontSize;
}
CTextProp.prototype.get_Color = function ()
{
	return this.Color;
}
CTextProp.prototype.get_VertAlign = function ()
{
	return this.VertAlign;
}
CTextProp.prototype.get_HighLight = function ()
{
	return this.HighLight;
}

// paragraph and text properties objects container
function CParagraphAndTextProp (paragraphProp, textProp)
{
	this.ParaPr = (undefined != paragraphProp && null != paragraphProp) ? new CParagraphPropEx (paragraphProp) : null;
	this.TextPr = (undefined != textProp && null != textProp) ? new CTextProp (textProp) : null;
}
CParagraphAndTextProp.prototype.get_ParaPr = function ()
{
	return this.ParaPr;
}
CParagraphAndTextProp.prototype.get_TextPr = function ()
{
	return this.TextPr;
}

// 
asc_docs_api.prototype.get_TextProps = function()
{
	var Doc = this.WordControl.m_oLogicDocument;
	var ParaPr = Doc.Get_Paragraph_ParaPr();
	var TextPr = Doc.Get_Paragraph_TextPr();

	// return { ParaPr: ParaPr, TextPr : TextPr };
	return new CParagraphAndTextProp (ParaPr, TextPr);	// uncomment if this method will be used externally. 20/03/2012 uncommented for testers
}

// -------
asc_docs_api.prototype.GetJSONLogicDocument = function()
{
	return JSON.stringify(this.WordControl.m_oLogicDocument);
}

asc_docs_api.prototype.get_ContentCount = function()
{
	return this.WordControl.m_oLogicDocument.Content.length;
}

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
}

asc_docs_api.prototype.UpdateTextPr = function(TextPr)
{
	if ( "undefined" != typeof(TextPr) )
	{
		var oTextPrMap = {
			Bold: function(oThis, v){ oThis.sync_BoldCallBack(v); },
			Italic: function(oThis, v){oThis.sync_ItalicCallBack(v); },
			Underline: function(oThis, v){ oThis.sync_UnderlineCallBack(v); },
			Strikeout: function(oThis, v){ oThis.sync_StrikeoutCallBack(v); },
			FontSize: function(oThis, v){ oThis.sync_TextPrFontSizeCallBack(v); },
			FontFamily: function(oThis, v){ oThis.sync_TextPrFontFamilyCallBack(v); },
			VertAlign: function(oThis, v){ oThis.sync_VerticalAlign(v); },
			Color: function(oThis, v){ oThis.sync_TextColor(v); },
			HighLight: function(oThis, v){ oThis.sync_TextHighLight(v); }
		}
		
		for ( var Item in TextPr )
		{
			if( "undefined" != typeof( oTextPrMap[Item] ) )
				oTextPrMap[Item]( this, TextPr[Item] );
		}
	}
}
asc_docs_api.prototype.UpdateParagraphProp = function(ParaPr){
	// var prgrhPr = this.get_TextProps();
	// var prProp = new Object();
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

    if ( -1 === ParaPr.StyleId )
        ParaPr.StyleName = "";
    else if ( null === ParaPr.StyleId )
        ParaPr.StyleName = this.WordControl.m_oLogicDocument.Styles.Style[this.WordControl.m_oLogicDocument.Styles.Get_Default_Paragraph()].Name;
    else
        ParaPr.StyleName = this.WordControl.m_oLogicDocument.Styles.Style[ParaPr.StyleId].Name;

    if ( null == ParaPr.NumPr )
        ParaPr.ListType = {Type: -1, SubType : -1};
    else
    {
        var NumFmt = this.WordControl.m_oLogicDocument.Numbering.Get_Format( ParaPr.NumPr.NumId, ParaPr.NumPr.Lvl );
        switch(NumFmt)
        {
            case numbering_numfmt_Bullet:
            {
                ParaPr.ListType = { Type : 0, SubType : 0 };
                break;
            }
            default:
            {
                ParaPr.ListType = { Type : 1, SubType : 0 };
                break;
            }
        }
    }

	this.sync_ParaSpacingLine( ParaPr.Spacing );
	this.Update_ParaInd(ParaPr.Ind);
	this.sync_PrAlignCallBack(ParaPr.Jc);
	this.sync_ParaStyleName(ParaPr.StyleName);
	this.sync_ListType(ParaPr.ListType);
	this.sync_PrPropCallback(ParaPr);
}
/*----------------------------------------------------------------*/
/*functions for working with clipboard, document*/
/*TODO: Print,Undo,Redo,Copy,Cut,Paste,Share,Save,DownloadAs,ReturnToDocuments(вернуться на предыдущую страницу) & callbacks for these functions*/
asc_docs_api.prototype.Print = function(){
	this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Print);
	var editor = this;
	_downloadAs(this, c_oAscFileType.PDF, function(){editor.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Print);}, true);
}
asc_docs_api.prototype.Undo = function(){
	this.WordControl.m_oLogicDocument.Document_Undo();
}
asc_docs_api.prototype.Redo = function(){
	this.WordControl.m_oLogicDocument.Document_Redo();
}
asc_docs_api.prototype.Copy = function(){
	var res = Editor_Copy_Button(this)
}
asc_docs_api.prototype.Update_ParaTab = function(Default_Tab, ParaTabs){
    this.WordControl.m_oDrawingDocument.Update_ParaTab(Default_Tab, ParaTabs);
}
asc_docs_api.prototype.Cut = function(){
	var res = Editor_Copy_Button(this, true)
}
asc_docs_api.prototype.Paste = function(){
	var res = Editor_Paste_Button(this);
}
asc_docs_api.prototype.Share = function(){

}
asc_docs_api.prototype.Save = function(){
	this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Save);
	var oBinaryFileWriter = new BinaryFileWriter(this.WordControl.m_oLogicDocument);
	var data = oBinaryFileWriter.Write();
	var sData = "mnuSaveAs" + cCharDelimiter + documentId+ "." + documentFormat + cCharDelimiter + c_oAscFileType.INNER + cCharDelimiter + "completeall" + cCharDelimiter + data;
	sendCommand(editor, function(){
			editor.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Save);
			//Обратно выставляем, что документ не модифицирован
			editor.SetUnchangedDocument();
		}, "", "", sData);
}
asc_docs_api.prototype.DownloadAs = function(typeFile){//передаем число соответствующее своему формату.
	this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.DownloadAs);
	var editor = this;
	_downloadAs(this, typeFile, function(){editor.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.DownloadAs);}, true);
}
asc_docs_api.prototype.Resize = function(){
	if (false === this.bInit_word_control)
		return;
	this.WordControl.OnResize(false);
}
asc_docs_api.prototype.AddURL = function(url){

}
asc_docs_api.prototype.Help = function(){

}
asc_docs_api.prototype.ClearCache = function(){
	sendCommand(editor, function(){}, "cc");
}
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

    this.WordControl.m_oLogicDocument.Statistics_Start();
}
asc_docs_api.prototype.stopGetDocInfo = function(){
    this.sync_GetDocInfoStopCallback();
    this.WordControl.m_oLogicDocument.Statistics_Stop();
}
asc_docs_api.prototype.sync_DocInfoCallback = function(obj){
	this.fireCallback( "asc_onDocInfo", new CDocInfoProp(obj));
}
asc_docs_api.prototype.sync_GetDocInfoStartCallback = function(){
	this.fireCallback("asc_onGetDocInfoStart");
}
asc_docs_api.prototype.sync_GetDocInfoStopCallback = function(){
	this.fireCallback("asc_onGetDocInfoStop");
}
asc_docs_api.prototype.sync_GetDocInfoEndCallback = function(){
	this.fireCallback("asc_onGetDocInfoEnd");
}

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
CDocInfoProp.prototype.get_PageCount = function(){ return this.PageCount; }
CDocInfoProp.prototype.put_PageCount = function(v){ this.PageCount = v; }
CDocInfoProp.prototype.get_WordsCount = function(){ return this.WordsCount; }
CDocInfoProp.prototype.put_WordsCount = function(v){ this.WordsCount = v; }
CDocInfoProp.prototype.get_ParagraphCount = function(){ return this.ParagraphCount; }
CDocInfoProp.prototype.put_ParagraphCount = function(v){ this.ParagraphCount = v; }
CDocInfoProp.prototype.get_SymbolsCount = function(){ return this.SymbolsCount; }
CDocInfoProp.prototype.put_SymbolsCount = function(v){ this.SymbolsCount = v; }
CDocInfoProp.prototype.get_SymbolsWSCount = function(){ return this.SymbolsWSCount; }
CDocInfoProp.prototype.put_SymbolsWSCount = function(v){ this.SymbolsWSCount = v; }

/*callbacks*/
/*asc_docs_api.prototype.sync_CursorLockCallBack = function(isLock){
	this.fireCallback("asc_onCursorLock",isLock);
}*/
asc_docs_api.prototype.sync_PrintCallBack = function(){
	this.fireCallback("asc_onPrint");
}
asc_docs_api.prototype.sync_UndoCallBack = function(){
	this.fireCallback("asc_onUndo");
}
asc_docs_api.prototype.sync_RedoCallBack = function(){
	this.fireCallback("asc_onRedo");
}
asc_docs_api.prototype.sync_CopyCallBack = function(){
	this.fireCallback("asc_onCopy");
}
asc_docs_api.prototype.sync_CutCallBack = function(){
	this.fireCallback("asc_onCut");
}
asc_docs_api.prototype.sync_PasteCallBack = function(){
	this.fireCallback("asc_onPaste");
}
asc_docs_api.prototype.sync_ShareCallBack = function(){
	this.fireCallback("asc_onShare");
}
asc_docs_api.prototype.sync_SaveCallBack = function(){
	this.fireCallback("asc_onSave");
}
asc_docs_api.prototype.sync_DownloadAsCallBack = function(){
	this.fireCallback("asc_onDownload");
}
asc_docs_api.prototype.sync_StartAction = function(type, id){
	//this.AsyncAction
	this.fireCallback("asc_onStartAction", type, id);
}
asc_docs_api.prototype.sync_EndAction = function(type, id){
	//this.AsyncAction
	this.fireCallback("asc_onEndAction", type, id);
}
asc_docs_api.prototype.sync_AddURLCallback = function(){
	this.fireCallback("asc_onAddURL");
}
asc_docs_api.prototype.sync_ErrorCallback = function(errorID,errorLevel){
	this.fireCallback("asc_onError",errorID,errorLevel);
}
asc_docs_api.prototype.sync_HelpCallback = function(url){
	this.fireCallback("asc_onHelp",url);
}
asc_docs_api.prototype.sync_UpdateZoom = function(zoom){
	this.fireCallback("asc_onZoom", zoom);
}
asc_docs_api.prototype.sync_StatusMessage = function(message){
	this.fireCallback("asc_onMessage", message);
}
asc_docs_api.prototype.ClearPropObjCallback = function(prop){//колбэк предшествующий приходу свойств объекта, prop а всякий случай
	this.fireCallback("asc_onClearPropObj", prop);
}

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
}
CHeader.prototype.get_pageNumber = function ()
{
	return this.pageNumber;
}
CHeader.prototype.get_X = function ()
{
	return this.X;
}
CHeader.prototype.get_Y = function ()
{
	return this.Y;
}
CHeader.prototype.get_Level = function ()
{
	return this.level;
}
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
]

asc_docs_api.prototype.CollectHeaders = function(){
	this.sync_ReturnHeadersCallback(_fakeHeaders);
}
asc_docs_api.prototype.GetActiveHeader = function(){
	
}
asc_docs_api.prototype.gotoHeader = function(page, X, Y){
	this.goToPage(page);
}
asc_docs_api.prototype.sync_ChangeActiveHeaderCallback = function (position, header){
	this.fireCallback("asc_onChangeActiveHeader", position, new CHeader (header));
}
asc_docs_api.prototype.sync_ReturnHeadersCallback = function (headers){
	var _headers = Array ();
	for (var i = 0; i < headers.length; i++)
	{	
		_headers[i] = new CHeader (headers[i]);
	}
	
	this.fireCallback("asc_onReturnHeaders", _headers);
}
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
asc_docs_api.prototype.startSearchText = function(what){// "what" means word(s) what we search
	this._searchCur = 0;
	this.sync_SearchStartCallback();
    this.WordControl.m_oLogicDocument.Search_Start(what);
}
asc_docs_api.prototype.gotoSearchResultText = function(navigator){//переход к результату.

    var nav = this.WordControl.m_oDrawingDocument.CurrentSearchNavi;
    nav.page = navigator.Page;
    nav.X = navigator.X;
    nav.Y = navigator.Y;
    nav.W = navigator.W;
    nav.H = navigator.H;
    this.WordControl.ToSearchResult();
}
asc_docs_api.prototype.stopSearchText = function(){
	this.sync_SearchStopCallback();
	this.WordControl.m_oLogicDocument.Search_Stop();
}

// CNavigator
function CNavigator (obj)
{
	if (obj)
	{
		this.H = (undefined != obj.H) ? obj.H : null;
		this.Page = (undefined != obj.Page) ? obj.Page : null;
		this.W = (undefined != obj.W) ? obj.W : null;
		this.X = (undefined != obj.X) ? obj.X : null;
		this.Y = (undefined != obj.Y) ? obj.Y : null;
	}
	else
	{
		this.H = null;
		this.Page = null;
		this.W = null;
		this.X = null;
		this.Y = null;	
	}
}
CNavigator.prototype.get_H = function ()
{
	return this.H;
}
CNavigator.prototype.get_Page = function ()
{
	return this.Page;
}
CNavigator.prototype.get_X = function ()
{
	return this.X;
}
CNavigator.prototype.get_Y = function ()
{
	return this.Y;
}
// CSearchResult - returns result of searching
function CSearchResult (obj)
{
	if (obj)
	{
		this.navigator = (undefined != obj.navigator && null != obj.navigator) ? new CNavigator (obj.navigator) : null;
		this.text = (undefined != obj.text) ? obj.text : null;
	}
	else
	{
		this.navigator = new CNavigator ();
		this.text = null;
	}
}

CSearchResult.prototype.get_Text = function ()
{
	return this.text;
}

CSearchResult.prototype.get_Navigator = function ()
{
	return this.navigator;
}

CSearchResult.prototype.put_Navigator = function (obj)
{
	this.navigator = obj;
}
CSearchResult.prototype.put_Text = function (obj)
{
	this.text = obj;
}
// returns: CSearchResult
asc_docs_api.prototype.sync_SearchFoundCallback = function(obj){
	this.fireCallback("asc_onSearchFound", new CSearchResult(obj));
}
asc_docs_api.prototype.sync_SearchStartCallback = function(){
	this.fireCallback("asc_onSearchStart");
}
asc_docs_api.prototype.sync_SearchStopCallback = function(){
	this.fireCallback("asc_onSearchStop");
}
asc_docs_api.prototype.sync_SearchEndCallback = function(){
	this.fireCallback("asc_onSearchEnd");
}
/*----------------------------------------------------------------*/
/*functions for working with font*/
/*setters*/
asc_docs_api.prototype.put_TextPrFontName = function(name)
{
	var loader = window.g_font_loader;
	var nIndex = loader.map_font_index[name];
	var fontinfo = loader.fontInfos[nIndex];
	var isasync = loader.LoadFont(fontinfo);
	if (false === isasync)
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
		this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { FontFamily : { Name : fontinfo.Name , Index : nIndex } } ) );
    }
}
asc_docs_api.prototype.put_TextPrFontSize = function(size)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { FontSize : Math.min(size, 100) } ) );
}
asc_docs_api.prototype.put_TextPrBold = function(value)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { Bold : value } ) );
}
asc_docs_api.prototype.put_TextPrItalic = function(value)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { Italic : value } ) );
}
asc_docs_api.prototype.put_TextPrUnderline = function(value)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { Underline : value } ) );
}
asc_docs_api.prototype.put_TextPrStrikeout = function(value)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { Strikeout : value } ) );
}
asc_docs_api.prototype.put_PrLineSpacing = function(value)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	this.WordControl.m_oLogicDocument.Set_ParagraphSpacing( {Line : value} );

    var ParaPr = this.get_TextProps().ParaPr;
    if ( null != ParaPr )
	    this.sync_ParaSpacingLine( ParaPr.Spacing );
}
asc_docs_api.prototype.put_LineSpacingBeforeAfter = function(type,value)//"type == 0" means "Before", "type == 1" means "After"
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	switch (type)
    {
		case 0:
			this.WordControl.m_oLogicDocument.Set_ParagraphSpacing( {Before : value}); break;
		case 1:
			this.WordControl.m_oLogicDocument.Set_ParagraphSpacing( {After : value}); break;
	}
}
asc_docs_api.prototype.FontSizeIn = function(){//return new size
    var TextPr = this.get_TextProps().TextPr;
    if ( null === TextPr )
        return;

    var FontSize = TextPr.FontSize;
    if ( undefined == FontSize || null == FontSize || "" == FontSize )
        return;

	var _size = parseInt( parseFloat(FontSize) * 2) / 2;
	if (_size < 100)
		this.put_TextPrFontSize(++_size);
	return _size;
}
asc_docs_api.prototype.FontSizeOut = function(){//return new size
    var TextPr = this.get_TextProps().TextPr;
    if ( null === TextPr )
        return;

    var FontSize = TextPr.FontSize;
    if ( undefined == FontSize || null == FontSize || "" == FontSize )
        return;

	var _size = parseInt( parseFloat(FontSize) * 2) / 2;
	if (_size > 2) 
		this.put_TextPrFontSize(--_size);
	return _size;
}
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
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Set_ParagraphBorders( Obj );
}
/*callbacks*/
asc_docs_api.prototype.sync_BoldCallBack = function(isBold){
	this.fireCallback("asc_onBold",isBold);
}
asc_docs_api.prototype.sync_ItalicCallBack = function(isItalic){
	this.fireCallback("asc_onItalic",isItalic);
}
asc_docs_api.prototype.sync_UnderlineCallBack = function(isUnderline){
	this.fireCallback("asc_onUnderline",isUnderline);
}
asc_docs_api.prototype.sync_StrikeoutCallBack = function(isStrikeout){
	this.fireCallback("asc_onStrikeout",isStrikeout);
}
asc_docs_api.prototype.sync_TextPrFontFamilyCallBack = function(FontFamily){
	this.fireCallback("asc_onFontFamily", new CTextFontFamily( FontFamily ));
}	
asc_docs_api.prototype.sync_TextPrFontSizeCallBack = function(FontSize){
	this.fireCallback("asc_onFontSize",FontSize);
}	
asc_docs_api.prototype.sync_PrLineSpacingCallBack = function(LineSpacing){
	this.fireCallback("asc_onLineSpacing", new CParagraphInd( LineSpacing ) );
}
asc_docs_api.prototype.sync_InitEditorFonts = function(gui_fonts){
	this.fireCallback("asc_onInitEditorFonts",gui_fonts);
}
asc_docs_api.prototype.sync_InitEditorStyles = function(styles_painter){
    this.fireCallback("asc_onInitEditorStyles",styles_painter);
}

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
asc_docs_api.prototype.put_PrAlign = function(value)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	this.WordControl.m_oLogicDocument.Set_ParagraphAlign(value);
}
// 0- baseline, 2-subscript, 1-superscript
asc_docs_api.prototype.put_TextPrBaseline = function(value)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { VertAlign : value } ) );
}
/* 	Маркированный список Type = 0
		нет         - SubType = -1
		черная точка - SubType = 1
		круг         - SubType = 2
		квадрат      - SubType = 3
		картинка     - SubType = -1
		4 ромба      - SubType = 4
		ч/б стрелка  - SubType = 5
		галка        - SubType = 6
	
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
		нет            - SubType = -1
		1)a)i)        - SubType = 1
		1.1.1         - SubType = 2
		маркированный - SubType = 3 
*/
asc_docs_api.prototype.put_ListType = function(type, subtype)
{
	var NumberInfo =
	{
		Type    : 0,
		SubType : -1
	};

	NumberInfo.Type = type;
	NumberInfo.SubType = subtype;
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	this.WordControl.m_oLogicDocument.Set_ParagraphNumbering( NumberInfo );
}
asc_docs_api.prototype.put_Style = function(name)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	this.WordControl.m_oLogicDocument.Set_ParagraphStyle(name);
}
asc_docs_api.prototype.put_ShowParaMarks = function(isShow){
	this.ShowParaMarks = isShow;
	this.WordControl.OnRePaintAttack();
	return this.ShowParaMarks;
}
asc_docs_api.prototype.get_ShowParaMarks = function(){
    return this.ShowParaMarks;
}
asc_docs_api.prototype.put_PageBreak = function(isBreak){
	this.isPageBreakBefore = isBreak;
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Set_ParagraphPageBreakBefore(isBreak);
	this.sync_PageBreakCallback(isBreak);
}
asc_docs_api.prototype.put_KeepLines = function(isKeepLines){
	this.isKeepLinesTogether = isKeepLines;
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Set_ParagraphKeepLines(isKeepLines);
	this.sync_KeepLinesCallback(isKeepLines);
}
asc_docs_api.prototype.put_AddSpaceBetweenPrg = function(isSpacePrg){
	this.isAddSpaceBetweenPrg = isSpacePrg;
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Set_ParagraphContextualSpacing(isSpacePrg);
}
asc_docs_api.prototype.put_LineHighLight = function(is_flag, r, g, b)
{
	if (false === is_flag)
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
		this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { HighLight : highlight_None  } ) );
    }
	else
	{
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
		this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { HighLight : { r : r, g : g, b: b}  } ) );
	}
}
asc_docs_api.prototype.put_TextColor = function(r, g, b)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { Color : { r : r, g : g, b: b}  } ) );
}
asc_docs_api.prototype.put_ParagraphShade = function(is_flag, r, g, b)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	if (false === is_flag)
		this.WordControl.m_oLogicDocument.Set_ParagraphShd( { Value : shd_Nil  }  );
	else
	{
		this.WordControl.m_oLogicDocument.Set_ParagraphShd( { Value : shd_Clear, Color : { r : r, g : g, b: b} } );
	}
}
asc_docs_api.prototype.put_PrIndent = function(value,levelValue)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	this.WordControl.m_oLogicDocument.Set_ParagraphIndent( { Left : value, ChangeLevel: levelValue } );
}
asc_docs_api.prototype.IncreaseIndent = function()
{
    var ParaPr = editor.get_TextProps().ParaPr;
    if ( null === ParaPr )
        return;

	var LeftMargin = ParaPr.Ind.Left;
    if ( UnknownValue === LeftMargin )
        LeftMargin = 0;

    var Temp = 0;
    if (LeftMargin >= 0)
    {
        LeftMargin = 12.5 * parseInt(10 * LeftMargin / 125);
        Temp = ( (LeftMargin - (10 * LeftMargin) % 125) / 12.5 + 1) * 12.5;
    }
    if (Temp < 0)
        Temp = 12.5;
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	this.WordControl.m_oLogicDocument.Set_ParagraphIndent( { Left : Temp, ChangeLevel: 1 } );
    this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
}
asc_docs_api.prototype.DecreaseIndent = function()
{
    var ParaPr = editor.get_TextProps().ParaPr;
    if ( null === ParaPr )
        return;

	var LeftMargin = ParaPr.Ind.Left;
    if ( UnknownValue === LeftMargin )
        LeftMargin = 0;
    
	var Temp = ( (LeftMargin - (10 * LeftMargin) % 125) / 12.5 - 1) * 12.5;

    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	if (Temp > 0)
		this.WordControl.m_oLogicDocument.Set_ParagraphIndent( { Left : Temp, ChangeLevel: -1 } );
	else
		this.WordControl.m_oLogicDocument.Set_ParagraphIndent( { Left : 0, ChangeLevel: -1 } );
    this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
}
asc_docs_api.prototype.put_PrIndentRight = function(value)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	this.WordControl.m_oLogicDocument.Set_ParagraphIndent( { Right : value } );
}
asc_docs_api.prototype.put_PrFirstLineIndent = function(value)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	this.WordControl.m_oLogicDocument.Set_ParagraphIndent( { FirstLine : value } );
}
asc_docs_api.prototype.put_Margins = function(left, top, right, bottom)
{
	this.WordControl.m_oLogicDocument.Set_DocumentMargin( { Left : left, Top : top, Right : right, Bottom : bottom });
}
asc_docs_api.prototype.getFocusObject = function(){//возвратит тип элемента - параграф c_oAscTypeSelectElement.Paragraph, изображение c_oAscTypeSelectElement.Image, таблица c_oAscTypeSelectElement.Table, колонтитул c_oAscTypeSelectElement.Header.

}

/*callbacks*/
asc_docs_api.prototype.sync_VerticalAlign = function(typeBaseline){
	this.fireCallback("asc_onVerticalAlign",typeBaseline);
}
asc_docs_api.prototype.sync_PrAlignCallBack = function(value){
	this.fireCallback("asc_onPrAlign",value);
}
asc_docs_api.prototype.sync_ListType = function(NumPr){
	this.fireCallback("asc_onListType", new CListType( NumPr ) );
}
asc_docs_api.prototype.sync_TextColor = function(Color){
	this.fireCallback("asc_onTextColor", new CColor( Color.r, Color.g, Color.b ));
}
asc_docs_api.prototype.sync_TextHighLight = function(HighLight){
	this.fireCallback("asc_onTextHighLight", new CColor( HighLight.r, HighLight.g, HighLight.b ) );
}
asc_docs_api.prototype.sync_ParaStyleName = function(Name){
	this.fireCallback("asc_onParaStyleName",Name);
}
asc_docs_api.prototype.sync_ParaSpacingLine = function(SpacingLine){
	this.fireCallback("asc_onParaSpacingLine", new CParagraphSpacing( SpacingLine ));
}
asc_docs_api.prototype.sync_PageBreakCallback = function(isBreak){
	this.fireCallback("asc_onPageBreak",isBreak);
}
asc_docs_api.prototype.sync_KeepLinesCallback = function(isKeepLines){
	this.fireCallback("asc_onKeepLines",isKeepLines);
}
asc_docs_api.prototype.sync_ShowParaMarksCallback = function(){
	this.fireCallback("asc_onShowParaMarks");
}
asc_docs_api.prototype.sync_SpaceBetweenPrgCallback = function(){
	this.fireCallback("asc_onSpaceBetweenPrg");
}
asc_docs_api.prototype.sync_PrPropCallback = function(prProp){
    var _len = this.SelectedObjectsStack.length;
    if (_len > 0)
    {
        if (this.SelectedObjectsStack[_len - 1].Type == c_oAscTypeSelectElement.Paragraph)
        {
            this.SelectedObjectsStack[_len - 1].Value = new CParagraphProp( prProp );
            return;
        }
    }

    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new CSelectedObject( c_oAscTypeSelectElement.Paragraph, new CParagraphProp( prProp ) );
}

/*----------------------------------------------------------------*/
/*functions for working with page*/
asc_docs_api.prototype.change_PageOrient = function(isPortrait)
{
    this.WordControl.m_bIsClearAllCanvas = true;
    this.WordControl.m_oDrawingDocument.m_bIsUpdateDocSize = true;

    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    if (isPortrait)
    {
        this.WordControl.m_oLogicDocument.Set_DocumentOrientation(orientation_Portrait);
        this.DocumentOrientation = orientation_Portrait ? true : false ;
    }
    else
    {
        this.WordControl.m_oLogicDocument.Set_DocumentOrientation(orientation_Landscape);
        this.DocumentOrientation = orientation_Landscape ? true : false;
    }
	this.sync_PageOrientCallback(!editor.get_DocumentOrientation());
}
asc_docs_api.prototype.get_DocumentOrientation = function()
{
	return this.DocumentOrientation;
}
asc_docs_api.prototype.change_DocSize = function(width,height)
{
    this.WordControl.m_bIsClearAllCanvas = true;
    this.WordControl.m_oDrawingDocument.m_bIsUpdateDocSize = true;

    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    if (this.DocumentOrientation == orientation_Portrait)
        this.WordControl.m_oLogicDocument.Set_DocumentPageSize(width, height);
    else
        this.WordControl.m_oLogicDocument.Set_DocumentPageSize(height, width);
}
asc_docs_api.prototype.put_AddPageBreak = function()
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaNewLine( break_Page ) );
}
asc_docs_api.prototype.Update_ParaInd = function( Ind ){
	FirstLine = 0;
	Left = 0;
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

	this.Internal_Update_Ind_Left(Left);
	this.Internal_Update_Ind_FirstLine(FirstLine,Left);
	this.Internal_Update_Ind_Right(Right);
}
asc_docs_api.prototype.Internal_Update_Ind_FirstLine = function(FirstLine,Left){
	if (this.WordControl.m_oHorRuler.m_dIndentLeftFirst != (FirstLine + Left))
    {
        this.WordControl.m_oHorRuler.m_dIndentLeftFirst = (FirstLine + Left);
	    this.WordControl.UpdateHorRuler();
    }
}
asc_docs_api.prototype.Internal_Update_Ind_Left = function(Left){
    if (this.WordControl.m_oHorRuler.m_dIndentLeft != Left)
    {
        this.WordControl.m_oHorRuler.m_dIndentLeft = Left;
        this.WordControl.UpdateHorRuler();
    }
}
asc_docs_api.prototype.Internal_Update_Ind_Right = function(Right){
    if (this.WordControl.m_oHorRuler.m_dIndentRight != Right)
    {
        this.WordControl.m_oHorRuler.m_dIndentRight = Right;
        this.WordControl.UpdateHorRuler();
    }
}

// "where" где нижний или верхний, align выравнивание
asc_docs_api.prototype.put_PageNum = function(where,align)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	this.WordControl.m_oLogicDocument.Document_AddPageNum( where, align );
}

// "where" где нижний или верхний, "options" опции колонтитула
asc_docs_api.prototype.put_HeadersAndFooters = function(where,options)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	this.WordControl.m_oLogicDocument.Document_AddHdrFtr( where, options );
}

// "where" где нижний или верхний, "options" опции колонтитула
asc_docs_api.prototype.rem_HeadersAndFooters = function(where,options)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	this.WordControl.m_oLogicDocument.Document_RemoveHdrFtr( where, options );
}

// "where" где нижний или верхний, "options" опции колонтитула
asc_docs_api.prototype.put_HeadersAndFootersDistance = function(value)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	this.WordControl.m_oLogicDocument.Document_SetHdrFtrDistance(value);
}

asc_docs_api.prototype.HeadersAndFooters_DifferentFirstPage = function(isOn){
	if ( isOn )
	{
		this.put_HeadersAndFooters( hdrftr_Footer, hdrftr_First );
		this.put_HeadersAndFooters( hdrftr_Header, hdrftr_First );
	}
	else
	{
		this.rem_HeadersAndFooters( hdrftr_Footer, hdrftr_First );
		this.rem_HeadersAndFooters( hdrftr_Header, hdrftr_First );
	}
}
asc_docs_api.prototype.HeadersAndFooters_DifferentOddandEvenPage = function(isOn){
	if ( isOn )
	{
		this.put_HeadersAndFooters( hdrftr_Footer, hdrftr_Even );
		this.put_HeadersAndFooters( hdrftr_Header, hdrftr_Even );
	}
	else
	{
		this.rem_HeadersAndFooters( hdrftr_Footer, hdrftr_Even );
		this.rem_HeadersAndFooters( hdrftr_Header, hdrftr_Even );
	}
}

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
	this.fireCallback("asc_onDocSize",width,height);
}
asc_docs_api.prototype.sync_PageOrientCallback = function(isPortrait){
	this.fireCallback("asc_onPageOrient",isPortrait);
}
asc_docs_api.prototype.sync_HeadersAndFootersPropCallback = function(hafProp){
    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new CSelectedObject( c_oAscTypeSelectElement.Header, new CHeaderProp( hafProp ) );
}

/*----------------------------------------------------------------*/
/*functions for working with table*/
asc_docs_api.prototype.put_Table = function(col,row,isFlow)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	if( isFlow )
		this.WordControl.m_oLogicDocument.Add_FlowTable(col,row);
	else 
		this.WordControl.m_oLogicDocument.Add_InlineTable(col,row);
}
asc_docs_api.prototype.addRowAbove = function(count)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Table_AddRow(true);
}
asc_docs_api.prototype.addRowBelow = function(count)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Table_AddRow(false);
}
asc_docs_api.prototype.addColumnLeft = function(count)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Table_AddCol(true);
}
asc_docs_api.prototype.addColumnRight = function(count)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Table_AddCol(false);
}
asc_docs_api.prototype.remRow = function()
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Table_RemoveRow();
}
asc_docs_api.prototype.remColumn = function()
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Table_RemoveCol();
}
asc_docs_api.prototype.remTable = function()
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Table_RemoveTable();
}
asc_docs_api.prototype.selectRow = function(){

}
asc_docs_api.prototype.selectColumn = function(){

}
asc_docs_api.prototype.selectCell = function(){

}
asc_docs_api.prototype.selectTable = function(){

}
asc_docs_api.prototype.setColumnWidth = function(width){

}
asc_docs_api.prototype.setRowHeight = function(height){

}
asc_docs_api.prototype.set_TblDistanceFromText = function(left,top,right,bottom){
	
}
asc_docs_api.prototype.CheckBeforeMergeCells = function(){

}
asc_docs_api.prototype.CheckBeforeSplitCells = function(){

}
asc_docs_api.prototype.MergeCells = function()
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Table_MergeCells();
}
asc_docs_api.prototype.SplitCell = function(Cols, Rows)
{
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Table_SplitCell(Cols, Rows);
}
asc_docs_api.prototype.widthTable = function(width){

}
asc_docs_api.prototype.put_CellsMargin = function(left,top,right,bottom){
	
}
asc_docs_api.prototype.set_TblWrap = function(type){

}
asc_docs_api.prototype.set_TblIndentLeft = function(spacing){

}
asc_docs_api.prototype.set_Borders = function(typeBorders,size,Color){//если size == 0 то границы нет.

}
asc_docs_api.prototype.set_TableBackground = function(Color){

}
asc_docs_api.prototype.set_AlignCell = function(align){// c_oAscAlignType.RIGHT, c_oAscAlignType.LEFT, c_oAscAlignType.CENTER
	switch(align)
	{
		case c_oAscAlignType.LEFT : break;
		case c_oAscAlignType.CENTER : break;
		case c_oAscAlignType.RIGHT : break;
	}
}
asc_docs_api.prototype.set_TblAlign = function(align){// c_oAscAlignType.RIGHT, c_oAscAlignType.LEFT, c_oAscAlignType.CENTER
	switch(align)
	{
		case c_oAscAlignType.LEFT : break;
		case c_oAscAlignType.CENTER : break;
		case c_oAscAlignType.RIGHT : break;
	}
}
asc_docs_api.prototype.set_SpacingBetweenCells = function(isOn,spacing){// c_oAscAlignType.RIGHT, c_oAscAlignType.LEFT, c_oAscAlignType.CENTER
	if(isOn){
	
	}
}

// CBackground
// Value : тип заливки(прозрачная или нет),
// Color : { r : 0, g : 0, b : 0 }
function CBackground (obj)
{
	if (obj)
	{
		this.Color = (undefined != obj.Color && null != obj.Color) ? new CColor (obj.Color.r, obj.Color.g, obj.Color.b) : null;
		this.Value = (undefined != obj.Value) ? obj.Value : null;
	}
	else
	{
		this.Color = new CColor(0, 0, 0);
		this.Value = 1;
	}
}
CBackground.prototype.get_Color = function (){return this.Color;}
CBackground.prototype.put_Color = function (v){this.Color = (v) ? new CColor (v.r, v.g, v.b): null;}
CBackground.prototype.get_Value = function (){return this.Value;}
CBackground.prototype.put_Value = function (v){this.Value = v;}

function CTableProp (tblProp)
{
	
	if (tblProp)
	{
		this.TableWidth = (undefined != tblProp.TableWidth) ? tblProp.TableWidth : null;
		this.TableSpacing = (undefined != tblProp.TableSpacing) ? tblProp.TableSpacing : null;
		this.TableDefaultMargins = (undefined != tblProp.TableDefaultMargins && null != tblProp.TableDefaultMargins) ? new CPaddings (tblProp.TableDefaultMargins) : null;

		this.CellMargins = (undefined != tblProp.CellMargins && null != tblProp.CellMargins) ? new CMargins (tblProp.CellMargins) : null;
		
		this.TableAlignment = (undefined != tblProp.TableAlignment) ? tblProp.TableAlignment : null;
		this.TableIndent = (undefined != tblProp.TableIndent) ? tblProp.TableIndent : null;
		this.TableWrappingStyle = (undefined != tblProp.TableWrappingStyle) ? tblProp.TableWrappingStyle : null;
		
		this.TablePaddins = (undefined != tblProp.TablePaddins && null != tblProp.TablePaddins) ? new CPaddings (tblProp.TablePaddins) : null;
		
		this.TableBorders = (undefined != tblProp.TableBorders && null != tblProp.TableBorders) ? new CBorders (tblProp.TableBorders) : null;
		this.CellBorders = (undefined != tblProp.CellBorders && null != tblProp.CellBorders) ? new CBorders (tblProp.CellBorders) : null;
		this.TableBackground = (undefined != tblProp.TableBackground && null != tblProp.TableBackground) ? new CBackground (tblProp.TableBackground) : null;
		this.CellsBackground = (undefined != tblProp.CellsBackground && null != tblProp.CellsBackground) ? new CBackground (tblProp.CellsBackground) : null;
		this.Position = (undefined != tblProp.Position && null != tblProp.Position) ? new CPosition (tblProp.Position) : null;
		this.ForSelectedCells = (undefined != tblProp.ForSelectedCells) ? tblProp.ForSelectedCells : true;
	}
	else
	{
		this.TableWidth = null;
		this.TableSpacing = null;
		this.TableDefaultMargins = new CPaddings ();

		this.CellMargins = new CMargins ();
		
		this.TableAlignment = 0;
		this.TableIndent = 0;
		this.TableWrappingStyle = c_oAscWrapStyle.Inline;
		
		this.TablePaddins = new CPaddings ();
		
		this.TableBorders = new CBorders ();
		this.CellBorders = new CBorders ();
		this.TableBackground = new CBackground ();
		this.CellsBackground = new CBackground ();;
		this.Position = new CPosition ();
		this.ForSelectedCells = true;
	}
}

CTableProp.prototype.get_Width = function (){return this.TableWidth;}
CTableProp.prototype.put_Width = function (v){this.TableWidth = v;}
CTableProp.prototype.get_Spacing = function (){return this.TableSpacing;}
CTableProp.prototype.put_Spacing = function (v){this.TableSpacing = v;}
CTableProp.prototype.get_DefaultMargins = function (){return this.TableDefaultMargins;}
CTableProp.prototype.put_DefaultMargins = function (v){this.TableDefaultMargins = v;}
CTableProp.prototype.get_CellMargins = function (){return this.CellMargins;}
CTableProp.prototype.put_CellMargins = function (v){ this.CellMargins = v;}
CTableProp.prototype.get_TableAlignment = function (){return this.TableAlignment;}
CTableProp.prototype.put_TableAlignment = function (v){this.TableAlignment = v;}
CTableProp.prototype.get_TableIndent = function (){return this.TableIndent;}
CTableProp.prototype.put_TableIndent = function (v){this.TableIndent = v;}
CTableProp.prototype.get_TableWrap = function (){return this.TableWrappingStyle;}
CTableProp.prototype.put_TableWrap = function (v){this.TableWrappingStyle = v;}
CTableProp.prototype.get_TablePaddins = function (){return this.TablePaddins;}
CTableProp.prototype.put_TablePaddins = function (v){this.TablePaddins = v;}
CTableProp.prototype.get_TableBorders = function (){return this.TableBorders;}
CTableProp.prototype.put_TableBorders = function (v){this.TableBorders = v;}
CTableProp.prototype.get_CellBorders = function (){return this.CellBorders;}
CTableProp.prototype.put_CellBorders = function (v){this.CellBorders = v;}
CTableProp.prototype.get_TableBackground = function (){return this.TableBackground;}
CTableProp.prototype.put_TableBackground = function (v){this.TableBackground = v;}
CTableProp.prototype.get_CellsBackground = function (){return this.CellsBackground;}
CTableProp.prototype.put_CellsBackground = function (v){this.CellsBackground = v;}
CTableProp.prototype.get_Position = function (){return this.Position;}
CTableProp.prototype.put_Position = function (v){this.Position = v;}
CTableProp.prototype.get_ForSelectedCells = function (){return this.ForSelectedCells;}
CTableProp.prototype.put_ForSelectedCells = function (v){this.ForSelectedCells = v;}

function CBorders (obj)
{
	if (obj)
	{
		this.Left = (undefined != obj.Left && null != obj.Left) ? new CBorder (obj.Left) : null;
		this.Top = (undefined != obj.Top && null != obj.Top) ? new CBorder (obj.Top) : null;
		this.Right = (undefined != obj.Right && null != obj.Right) ? new CBorder (obj.Right) : null;
		this.Bottom = (undefined != obj.Bottom && null != obj.Bottom) ? new CBorder (obj.Bottom) : null;
		this.InsideH = (undefined != obj.InsideH && null != obj.InsideH) ? new CBorder (obj.InsideH) : null;
		this.InsideV = (undefined != obj.InsideV && null != obj.InsideV) ? new CBorder (obj.InsideV) : null;
	}
	else
	{
		this.Left = null;
		this.Top = null;
		this.Right = null;
		this.Bottom = null;
		this.InsideH = null;
		this.InsideV = null;
	}
}
CBorders.prototype.get_Left = function(){return this.Left; }
CBorders.prototype.put_Left = function(v){this.Left = (v) ? new CBorder (v) : null;}
CBorders.prototype.get_Top = function(){return this.Top; }
CBorders.prototype.put_Top = function(v){this.Top = (v) ? new CBorder (v) : null;}
CBorders.prototype.get_Right = function(){return this.Right; }
CBorders.prototype.put_Right = function(v){this.Right = (v) ? new CBorder (v) : null;}
CBorders.prototype.get_Bottom = function(){return this.Bottom; }
CBorders.prototype.put_Bottom = function(v){this.Bottom = (v) ? new CBorder (v) : null;}
CBorders.prototype.get_InsideH = function(){return this.InsideH; }
CBorders.prototype.put_InsideH = function(v){this.InsideH = (v) ? new CBorder (v) : null;}
CBorders.prototype.get_InsideV = function(){return this.InsideV; }
CBorders.prototype.put_InsideV = function(v){this.InsideV = (v) ? new CBorder (v) : null;}

function CBorder (obj)
{
	if (obj)
	{
		this.Color = (undefined != obj.Color && null != obj.Color) ? new CColor (obj.Color.r, obj.Color.g, obj.Color.b) : null;
		this.Size = (undefined != obj.Size) ? obj.Size : null;
		this.Value = (undefined != obj.Value) ? obj.Value : null;
		this.Space = (undefined != obj.Space) ? obj.Space : null;
	}
	else
	{
		this.Color = new CColor (0,0,0);
		this.Size  = 0.5 * g_dKoef_pt_to_mm;
		this.Value = border_Single;
		this.Space = 0;
	}
}
CBorder.prototype.get_Color = function(){return this.Color; }
CBorder.prototype.put_Color = function(v){this.Color = new CColor (v.r, v.g, v.b);}
CBorder.prototype.get_Size = function(){return this.Size; }
CBorder.prototype.put_Size = function(v){this.Size = v;}
CBorder.prototype.get_Value = function(){return this.Value; }
CBorder.prototype.put_Value = function(v){this.Value = v;}
CBorder.prototype.get_Space = function(){return this.Space; }
CBorder.prototype.put_Space = function(v){this.Space = v;}
CBorder.prototype.get_ForSelectedCells = function(){return this.ForSelectedCells; }
CBorder.prototype.put_ForSelectedCells = function(v){this.ForSelectedCells = v;}

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
CMargins.prototype.get_Left = function(){return this.Left; }
CMargins.prototype.put_Left = function(v){this.Left = v;}
CMargins.prototype.get_Right = function(){return this.Right; }
CMargins.prototype.put_Right = function(v){this.Right = v;}
CMargins.prototype.get_Top = function(){return this.Top; }
CMargins.prototype.put_Top = function(v){this.Top = v;}
CMargins.prototype.get_Bottom = function(){return this.Bottom; }
CMargins.prototype.put_Bottom = function(v){this.Bottom = v;}
CMargins.prototype.get_Flag = function(){return this.Flag; }
CMargins.prototype.put_Flag = function(v){this.Flag = v;}

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
        TablePaddins:
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
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
    this.WordControl.m_oLogicDocument.Set_TableProps(obj);
}
/*callbacks*/
asc_docs_api.prototype.sync_AddTableCallback = function(){
	this.fireCallback("asc_onAddTable");
}
asc_docs_api.prototype.sync_AlignCellCallback = function(align){
	this.fireCallback("asc_onAlignCell",align);
}	
asc_docs_api.prototype.sync_TblPropCallback = function(tblProp){
    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new CSelectedObject( c_oAscTypeSelectElement.Table, new CTableProp( tblProp ));
}
asc_docs_api.prototype.sync_TblWrapStyleChangedCallback = function(style){
	this.fireCallback("asc_onTblWrapStyleChanged",style);
}
asc_docs_api.prototype.sync_TblAlignChangedCallback = function(style){
	this.fireCallback("asc_onTblAlignChanged",style);
}

/*----------------------------------------------------------------*/
/*functions for working with images*/
asc_docs_api.prototype.AddImage = function(){
    var oImageUploader = document.getElementById("apiImageUpload");
    if(!oImageUploader)
    {
        var frame = document.createElement("iframe");
        frame.name = "apiImageUpload";
        frame.id = "apiImageUpload";
        frame.setAttribute("style", "position:absolute;left:-2px;top:-2px;width:1px;height:1px;z-index:-1000;");
        document.body.appendChild(frame);
    }
    var frameWindow = window.frames["apiImageUpload"];
    var content = '<html><head></head><body><form action="/cwFileUploader.ashx?key='+documentId+'.'+documentFormat+'" method="POST" enctype="multipart/form-data"><input id="apiiuFile" name="apiiuFile" type="file" size="1"><input id="apiiuSubmit" name="apiiuSubmit" type="submit" style="display:none;"></form></body></html>';
    frameWindow.document.open();
    frameWindow.document.write(content);
    frameWindow.document.close();

    var fileName = frameWindow.document.getElementById("apiiuFile");
    var fileSubmit = frameWindow.document.getElementById("apiiuSubmit");
    var oThis = this;
    fileName.onchange = function(e)
    {
        if(e && e.target && e.target.files)
        {
            var files = e.target.files;
            if(files.length > 0)
            {
                var file = files[0];
                //проверяем расширение файла
                var sName = file.fileName || file.name;
                if(sName)
                {
                    var bSupported = false;
                    var nIndex = sName.lastIndexOf(".");
                    if(-1 != nIndex)
                    {
                        var ext = sName.substring(nIndex + 1).toLowerCase();
                        for(var i = 0, length = c_oAscImageUploadProp.SupportedFormats.length; i < length; i++)
                        {
                            if(c_oAscImageUploadProp.SupportedFormats[i] == ext)
                            {
                                bSupported = true;
                                break;
                            }
                        }
                    }
                    if(false == bSupported)
                    {
                        oThis.fireCallback("asc_onError",c_oAscError.ID.UplImageExt,c_oAscError.Level.NoCritical);
                        return;
                    }
                }
                var nSize = file.fileSize || file.size;
                if(nSize && c_oAscImageUploadProp.MaxFileSize < nSize)
                {
                    oThis.fireCallback("asc_onError",c_oAscError.ID.UplImageSize,c_oAscError.Level.NoCritical);
                    return;
                }
            }
        }
		oThis.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
        fileSubmit.click();
    };
    //todo пересмотреть opera
    if (window.opera != undefined)
        setTimeout( function(){fileName.click();}, 0);
    else
        fileName.click();
}
asc_docs_api.prototype.AddImageUrl = function(url){
    var _image = this.ImageLoader.LoadImage(url, 1);
    if (null != _image)
    {
        var _w = Page_Width - (X_Left_Margin + X_Right_Margin);
        var _h = Page_Height - (Y_Top_Margin + Y_Bottom_Margin);
        if (_image.Image != null)
        {
            var __w = Math.max(parseInt(_image.Image.width * g_dKoef_pix_to_mm), 1);
            var __h = Math.max(parseInt(_image.Image.height * g_dKoef_pix_to_mm), 1);
            _w = Math.max(5, Math.min(_w, __w));
            _h = Math.max(5, Math.min(parseInt(_w * __h / __w)));
        }
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
        this.WordControl.m_oLogicDocument.Add_InlineImage(_w, _h, _image.src);
    }
	else
    {
        this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
		this.asyncImageEndLoaded2 = function(_image)
        {
            var _w = Page_Width - (X_Left_Margin + X_Right_Margin);
            var _h = Page_Height - (Y_Top_Margin + Y_Bottom_Margin);
            if (_image.Image != null)
            {
                var __w = Math.max(parseInt(_image.Image.width * g_dKoef_pix_to_mm), 1);
                var __h = Math.max(parseInt(_image.Image.height * g_dKoef_pix_to_mm), 1);
                _w = Math.max(5, Math.min(_w, __w));
                _h = Math.max(5, Math.min(parseInt(_w * __h / __w)));
            }
            this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
			this.WordControl.m_oLogicDocument.Add_InlineImage(_w, _h, _image.src);
            this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
		}
	}
}
/* В качестве параметра  передается объект класса CImgProperty, он же приходит на OnImgProp
CImgProperty заменяет пережнюю структуру:
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
asc_docs_api.prototype.ImgApply = function(obj){
    var ImagePr = new Object();
	
    ImagePr.Width  = null === obj.Width ? null : parseFloat(obj.Width);
    ImagePr.Height = null === obj.Height ? null : parseFloat(obj.Height);
    ImagePr.WrappingStyle = obj.WrappingStyle;

    ImagePr.Paddings =
    {
        Left   : null === obj.Paddings.Left   ? null : parseFloat(obj.Paddings.Left),
        Right  : null === obj.Paddings.Right  ? null : parseFloat(obj.Paddings.Right),
        Bottom : null === obj.Paddings.Bottom ? null : parseFloat(obj.Paddings.Bottom),
        Top    : null === obj.Paddings.Top    ? null : parseFloat(obj.Paddings.Top)
    };

    ImagePr.Position =
    {
        X : null === obj.Position.X ? null : parseFloat(obj.Position.X),
        Y : null === obj.Position.Y ? null : parseFloat(obj.Position.Y)
    };
	ImagePr.ImageUrl = obj.ImageUrl;

    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	if(ImagePr.ImageUrl != undefined && ImagePr.ImageUrl != null && ImagePr.ImageUrl != "")
    {
		var _img = this.ImageLoader.LoadImage(ImagePr.ImageUrl, 1)
		if (null != _img)
        {
			ImagePr.ImageUrl = _img.src;
			this.WordControl.m_oLogicDocument.Set_ImageProps( ImagePr );
		}
		else
        {
			this.asyncImageEndLoaded2 = function(_image)
            {
				ImagePr.ImageUrl = _image.src;
				this.WordControl.m_oLogicDocument.Set_ImageProps( ImagePr );
			}
		}
	}
	else
    {
		ImagePr.ImageUrl = null;
		this.WordControl.m_oLogicDocument.Set_ImageProps( ImagePr );
	}
}
asc_docs_api.prototype.set_Size = function(width, height){

}
asc_docs_api.prototype.set_ConstProportions = function(isOn){
	if (isOn){
	
	}
	else{
	
	}
}
asc_docs_api.prototype.set_WrapStyle = function(type){

}
asc_docs_api.prototype.deleteImage = function(){

}
asc_docs_api.prototype.set_ImgDistanceFromText = function(left,top,right,bottom){
	
}	
asc_docs_api.prototype.set_PositionOnPage = function(X,Y){//расположение от начала страницы
	
}
asc_docs_api.prototype.get_OriginalSizeImage = function(){
	if (0 == this.SelectedObjectsStack.length)
        return null;
    var obj = this.SelectedObjectsStack[this.SelectedObjectsStack.length - 1];
    if (obj == null)
        return null;
    if (obj.Type == c_oAscTypeSelectElement.Image)
        return obj.Value.get_OriginSize(this);
}
/*callbacks*/
asc_docs_api.prototype.sync_AddImageCallback = function(){
	this.fireCallback("asc_onAddImage");
}
asc_docs_api.prototype.sync_ImgPropCallback = function(imgProp){
    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new CSelectedObject( c_oAscTypeSelectElement.Image, new CImgProperty( imgProp ) );
}
asc_docs_api.prototype.sync_ImgWrapStyleChangedCallback = function(style){
	this.fireCallback("asc_onImgWrapStyleChanged",style);
}


asc_docs_api.prototype.IsNeedDefaultFonts = function()
{
    if (this.WordControl.m_oLogicDocument != null)
        return true;
    return false;
}
/*----------------------------------------------------------------*/
/*functions for working with zoom & navigation*/
asc_docs_api.prototype.zoomIn = function(){
    this.WordControl.zoom_In();
}
asc_docs_api.prototype.zoomOut = function(){
    this.WordControl.zoom_Out();
}
asc_docs_api.prototype.zoomFitToPage = function(){
    this.WordControl.zoom_FitToPage();
}
asc_docs_api.prototype.zoomFitToWidth = function(){
    this.WordControl.zoom_FitToWidth();
}
asc_docs_api.prototype.zoom100 = function(){
    this.WordControl.m_nZoomValue = 100;
    this.WordControl.zoom_Fire();
}
asc_docs_api.prototype.zoom = function(percent){
    this.WordControl.m_nZoomValue = percent;
    this.WordControl.zoom_Fire();
}	
asc_docs_api.prototype.goToPage = function(number){
	this.WordControl.GoToPage(number);
}
asc_docs_api.prototype.getCountPages = function(){
	return this.WordControl.m_oDrawingDocument.m_lPagesCount;
}
asc_docs_api.prototype.getCurrentPage = function(){
	return this.WordControl.m_oDrawingDocument.m_lCurrentPage;
}
/*callbacks*/
asc_docs_api.prototype.sync_zoomChangeCallback = function(percent,type){	//c_oAscZoomType.Current, c_oAscZoomType.FitWidth, c_oAscZoomType.FitPage
	this.fireCallback("asc_onZoomChange",percent,type);
}
asc_docs_api.prototype.sync_countPagesCallback = function(count){
	this.fireCallback("asc_onCountPages",count);
}
asc_docs_api.prototype.sync_currentPageCallback = function(number){
	this.fireCallback("asc_onCurrentPage",number);
}

/*----------------------------------------------------------------*/
asc_docs_api.prototype.enableKeyEvents = function(value){
	if (this.WordControl.IsFocus != value) {
		this.WordControl.IsFocus = value;
		this.fireCallback("asc_onEnableKeyEventsChanged", value);
	}
}

// работа с шрифтами
asc_docs_api.prototype.asyncFontsDocumentStartLoaded = function()
{
	// здесь прокинуть евент о заморозке меню
	// и нужно вывести информацию в статус бар
    if (this.isPasteFonts_Images)
        this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);
    else
    {
        this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentFonts);

        // заполним прогресс
        var _progress = this.OpenDocumentProgress;
        _progress.Type = c_oAscAsyncAction.LoadDocumentFonts;
        _progress.FontsCount = this.FontLoader.fonts_loading.length;
        _progress.CurrentFont = 0;

        var _count = 0;
        for (var i in this.pasteImageMap)
            ++_count;

        _progress.ImagesCount = _count;
        _progress.CurrentImage = 0;
    }
}
asc_docs_api.prototype.GenerateStyles = function()
{
    var StylesPainter = new CStylesPainter();
    if (null == this.LoadedObject)
    {
        StylesPainter.GenerateStyles(this, null);
    }
    else
    {
        StylesPainter.GenerateStyles(this, this.LoadedObjectDS);
    }
}
asc_docs_api.prototype.asyncFontsDocumentEndLoaded = function()
{
    // все, шрифты загружены. Теперь нужно подгрузить картинки
    if (this.isPasteFonts_Images)
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
            this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
        }

        this.ImageLoader.LoadDocumentImages(this.pasteImageMap, false);
        return;
    }

    this.GenerateStyles();
    // открытие после загрузки документа

	var _loader_object = this.WordControl.m_oLogicDocument;
	if (null == _loader_object)
		_loader_object = this.WordControl.m_oDrawingDocument.m_oDocumentRenderer;

    var _count = 0;
	for (var i in _loader_object.ImageMap)
        ++_count;

    if (_count > 0)
    {
        this.EndActionLoadImages = 1;
        this.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentImages);
    }

    this.ImageLoader.bIsLoadDocumentFirst = true;
	this.ImageLoader.LoadDocumentImages(_loader_object.ImageMap, true);
}

asc_docs_api.prototype.asyncImagesDocumentStartLoaded = function()
{
	// евент о заморозке не нужен... оно и так заморожено
	// просто нужно вывести информацию в статус бар (что началась загрузка картинок)
}
asc_docs_api.prototype.asyncImagesDocumentEndLoaded = function()
{
    if (this.EndActionLoadImages == 1)
    {
        this.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.LoadDocumentImages);
    }
    else if (this.EndActionLoadImages == 2)
    {
        this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadImage);
    }

    this.EndActionLoadImages = 0;
    this.ImageLoader.bIsLoadDocumentFirst = false;

    this.fireCallback("asc_onDocumentContentReady");

    if (null != this.WordControl.m_oDrawingDocument.m_oDocumentRenderer)
    {
        this.WordControl.m_oDrawingDocument.OpenDocument();

        this.LoadedObject = null;

        this.bInit_word_control = true;
        this.WordControl.InitControl();

        if (this.isViewMode)
            this.SetViewMode(true);

        return;
    }

	// размораживаем меню... и начинаем считать документ
    if (false === this.isPasteFonts_Images)
    {
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
					//Recalculate HdrFtr
					if(Document.HdrFtr && Document.HdrFtr.Content && Document.HdrFtr.Content.length > 0 && Document.HdrFtr.Content[0].Header)
					{
						var Header = Document.HdrFtr.Content[0].Header;
						if(null != Header.First)
							Header.First.Recalculate();
						if(null != Header.Even)
							Header.Even.Recalculate();
						if(null != Header.Odd)
							Header.Odd.Recalculate();
					}
					if(Document.HdrFtr && Document.HdrFtr.Content && Document.HdrFtr.Content.length > 0 && Document.HdrFtr.Content[0].Footer)
					{
						var Footer = Document.HdrFtr.Content[0].Footer;
						if(null != Footer.First)
							Footer.First.Recalculate();
						if(null != Footer.Even)
							Footer.Even.Recalculate();
						if(null != Footer.Odd)
							Footer.Odd.Recalculate();
					}
					//Recalculate для FlowTables
					for(var i = 0, length = Document.Pages.length; i < length; ++i)
					{
						var page = Document.Pages[i];
						for(var j = 0, length2 = page.FlowObjects.Objects.length; j < length2; j++)
						{
							var object = page.FlowObjects.Objects[j];
							if(flowobject_Table == object.Get_Type() && 0 == object.PageController)
							{
								object.Table.Recalculate();
								object.Internal_UpdatePages( 0 );
							}
						}
					}
					//Recalculate для Document
					Document.CurPos.ContentPos = 0;
					Document.Recalculate();
                    this.WordControl.m_oDrawingDocument.TargetStart();
				}
			}
		}

        this.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
        this.WordControl.m_oLogicDocument.Document_UpdateRulersState();
        this.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
        this.LoadedObject = null;

        this.bInit_word_control = true;
        this.WordControl.InitControl();

        if (this.isViewMode)
            this.SetViewMode(true);
    }
    else
    {
        this.isPasteFonts_Images = false;
        this.pasteImageMap = null;
        this.pasteCallback();
        this.pasteCallback = null;
    }
}

asc_docs_api.prototype.asyncFontStartLoaded = function()
{
	// здесь прокинуть евент о заморозке меню
    this.sync_StartAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);
}
asc_docs_api.prototype.asyncFontEndLoaded = function(fontinfo)
{
    this.sync_EndAction(c_oAscAsyncActionType.Information, c_oAscAsyncAction.LoadFont);
    this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
	this.WordControl.m_oLogicDocument.Paragraph_Add( new ParaTextPr( { FontFamily : { Name : fontinfo.Name , Index : -1 } } ) );
	// отжать заморозку меню
}

asc_docs_api.prototype.asyncImageStartLoaded = function()
{
    // здесь прокинуть евент о заморозке меню
}
asc_docs_api.prototype.asyncImageEndLoaded = function(_image)
{
    // отжать заморозку меню
	if (this.asyncImageEndLoaded2)
		this.asyncImageEndLoaded2(_image);
	else
    {
        this.WordControl.m_oLogicDocument.Create_NewHistoryPoint();

		if (_image.Type == 0)
			this.WordControl.m_oLogicDocument.Add_FlowImage(50, 50, _image.src);
		else
			this.WordControl.m_oLogicDocument.Add_InlineImage(50, 50, _image.src);
	}
}

asc_docs_api.prototype.SendOpenProgress = function()
{
    this.fireCallback("asc_onOpenDocumentProgress", this.OpenDocumentProgress);
    //console.log("" + this.OpenDocumentProgress.CurrentFont);
}

asc_docs_api.prototype.pre_Paste = function(_fonts, _images, callback)
{
    this.isPasteFonts_Images = true;
    this.pasteCallback = callback;
    this.pasteImageMap = _images;
    this.FontLoader.LoadDocumentFonts2(_fonts);
}

asc_docs_api.prototype.initEvents2MobileAdvances = function()
{
    this.WordControl.initEvents2MobileAdvances();
}
asc_docs_api.prototype.ViewScrollToX = function(x)
{
    this.WordControl.m_oScrollHorApi.scrollToX(x);
}
asc_docs_api.prototype.ViewScrollToY = function(y)
{
    this.WordControl.m_oScrollVerApi.scrollToY(y);
}
asc_docs_api.prototype.GetDocWidthPx = function()
{
    return this.WordControl.m_dDocumentWidth;
}
asc_docs_api.prototype.GetDocHeightPx = function()
{
    return this.WordControl.m_dDocumentHeight;
}
asc_docs_api.prototype.ClearSearch = function()
{
    return this.WordControl.m_oDrawingDocument.EndSearch(true);
}
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
}

asc_docs_api.prototype.SetMobileVersion = function(val)
{
    this.isMobileVersion = val;
    if (this.isMobileVersion)
    {
        this.WordControl.m_bIsRuler = false;
    }
}

asc_docs_api.prototype.GoToHeader = function(pageNumber)
{
    if (this.WordControl.m_oDrawingDocument.IsFreezePage(pageNumber))
        return;

    var oldClickCount = global_mouseEvent.ClickCount;
    global_mouseEvent.ClickCount = 2;
    this.WordControl.m_oLogicDocument.OnMouseDown(global_mouseEvent, 0, 0, pageNumber);
    this.WordControl.m_oLogicDocument.OnMouseUp(global_mouseEvent, 0, 0, pageNumber);
    global_mouseEvent.ClickCount = oldClickCount;
}

asc_docs_api.prototype.GoToFooter = function(pageNumber)
{
    if (this.WordControl.m_oDrawingDocument.IsFreezePage(pageNumber))
        return;

    var oldClickCount = global_mouseEvent.ClickCount;
    global_mouseEvent.ClickCount = 2;
    this.WordControl.m_oLogicDocument.OnMouseDown(global_mouseEvent, 0, Page_Height, pageNumber);
    this.WordControl.m_oLogicDocument.OnMouseUp(global_mouseEvent, 0, Page_Height, pageNumber);
    global_mouseEvent.ClickCount = oldClickCount;
}

asc_docs_api.prototype.ExitHeader_Footer = function(pageNumber)
{
    if (this.WordControl.m_oDrawingDocument.IsFreezePage(pageNumber))
        return;

    var oldClickCount = global_mouseEvent.ClickCount;
    global_mouseEvent.ClickCount = 2;
    this.WordControl.m_oLogicDocument.OnMouseDown(global_mouseEvent, 0, Page_Height / 2, pageNumber);
    this.WordControl.m_oLogicDocument.OnMouseUp(global_mouseEvent, 0, Page_Height / 2, pageNumber);
    global_mouseEvent.ClickCount = oldClickCount;
}

asc_docs_api.prototype.GetCurrentPixOffsetY = function()
{
    return this.WordControl.m_dScrollY;
}

asc_docs_api.prototype.SetPaintFormat = function(value)
{
    this.isPaintFormat = value;
    this.WordControl.m_oLogicDocument.Document_Format_Copy();
}

asc_docs_api.prototype.sync_PaintFormatCallback = function(value)
{
    this.isPaintFormat = value;
    return this.fireCallback("asc_onPaintFormatChanged", value);
}
asc_docs_api.prototype.ClearFormating = function()
{
}
asc_docs_api.prototype.SetViewMode = function( isViewMode )
{
    if (isViewMode)
    {
        this.isViewMode = true;
        this.ShowParaMarks = false;
        this.WordControl.m_bIsRuler = true;
        this.WordControl.m_oDrawingDocument.ClearCachePages();
        this.WordControl.HideRulers();
    }
    else
    {
        this.isViewMode = false;
        this.WordControl.m_bIsRuler = true;
        this.WordControl.checkNeedRules();
        this.WordControl.m_oDrawingDocument.ClearCachePages();
        this.WordControl.OnResize(true);
    }
}

asc_docs_api.prototype.asyncImageEndLoaded2 = null;

asc_docs_api.prototype.StartAddShape= function(prst)
{
    this.WordControl.m_oLogicDocument.StartAddShape(prst);
}

asc_docs_api.prototype.sync_shapePropCallback = function(shapeProp){
    this.SelectedObjectsStack[this.SelectedObjectsStack.length] = new CSelectedObject ( c_oAscTypeSelectElement.Shape, shapeProp);
}

asc_docs_api.prototype.SetShapeProperties = function(Prop)
{
    return this.WordControl.m_oLogicDocument.SetShapeProperties(Prop);
}

var cCharDelimiter = String.fromCharCode(5);

function getURLParameter(name) {
    return (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1];
};
function sendCommand(editor, fCallback, command, data, rawData){
    var rdata;
    if(rawData)
        rdata = rawData;
    else
        rdata = JSON.stringify({"docid":documentId+ "." + documentFormat, "c":command, "d":data}); //указываем свойства используя кавычки, иначе после минимизации, данные не дойдут до сервера
	
	ajax({
        type: 'POST',
        url: "/CanvasWordService.ashx",
        data: rdata,
        error: function(jqXHR, textStatus, errorThrown){
				editor.fireCallback("asc_onError",c_oAscError.ID.Unknown,c_oAscError.Level.Critical);
				if(fCallback)
					fCallback();
            },
        success: function(msg){
			var incomeObject = JSON.parse(msg);
			switch(incomeObject.type){
                case "open":
                    var sJsonUrl = incomeObject.data + "?rand=" + Math.floor(Math.random() * (1000 - 0 + 1)) + 0;
					ajax({
						url: sJsonUrl,
						dataType: "text",
						success: function(result, textStatus) {
							//получаем url к папке с файлом
							var url;
							var nIndex = sJsonUrl.lastIndexOf("/");
							if(-1 != nIndex)
								url = sJsonUrl.substring(0, nIndex + 1);
							else
								url = sJsonUrl;
							var bIsViewer = false;
							if(result.length > 0)
							{
								if(c_oSerFormat.Signature_base64 != result.substring(0, c_oSerFormat.Signature_base64.length))
									bIsViewer = true;
							}
							if(true == bIsViewer)
								editor.OpenDocument(url, result);
							else
								editor.OpenDocument2(url, result);
							editor.sync_PageOrientCallback(!editor.get_DocumentOrientation());
							if(fCallback)
								fCallback(incomeObject);
						},
						error:function(){
							editor.fireCallback("asc_onError",c_oAscError.ID.Unknown,c_oAscError.Level.Critical);
							if(fCallback)
								fCallback();
						}
					});
                break;
                case "waitopen":
					var rData = {"url": documentUrl, "title": documentTitle};
                    setTimeout( function(){sendCommand(editor, fCallback,  "open", JSON.stringify(rData))}, 3000);
                break;
                case "save":
                    getFile(incomeObject.data);
					if(fCallback)
						fCallback(incomeObject);
                break;
                case "waitsave":
                    setTimeout( function(){sendCommand(editor, fCallback, "chsave", incomeObject.data)}, 3000);
                break;
                case "innersave":
					var sUrl = documentOrigin + incomeObject.data;
					editor.fireCallback("asc_onSaveUrl", sUrl, function(hasError){
						if (hasError){
							sendCommand(editor, function(){}, "cc");
						}
					});
					if(fCallback)
						fCallback(incomeObject);
                break;
                case "waitinnersave":
                    setTimeout( function(){sendCommand(editor, fCallback, "chinnersave")}, 3000);
                break;
				case "savepart":
					var filetype = incomeObject.data - 0;
                    _downloadAs(editor, filetype, fCallback, false);
                break;
                case "copyimg":
                    if(fCallback)
                        fCallback(incomeObject);
                break;
                case "err":
					editor.fireCallback("asc_onError",c_oAscError.ID.Unknown,c_oAscError.Level.Critical);
					if(fCallback)
						fCallback(incomeObject);
                break;
            }
		}
	})

	};
function _downloadAs(editor, filetype, fCallback, bStart)
{
	var sData;
	if(c_oAscFileType.PDF == filetype)
	{
		var dd = editor.WordControl.m_oDrawingDocument;
		if(dd.isComleteRenderer2())
		{
			if(false == bStart)
				sData = "mnuSaveAs" + cCharDelimiter + documentId+ "." + documentFormat + cCharDelimiter + filetype + cCharDelimiter + "complete" + cCharDelimiter + dd.ToRendererPart();
			else
				sData = "mnuSaveAs" + cCharDelimiter + documentId+ "." + documentFormat + cCharDelimiter + filetype + cCharDelimiter + "completeall" + cCharDelimiter + dd.ToRendererPart();
		}
		else
		{
			if(false == bStart)
				sData = "mnuSaveAs" + cCharDelimiter + documentId+ "." + documentFormat + cCharDelimiter + filetype + cCharDelimiter + "part" + cCharDelimiter + dd.ToRendererPart();
			else
				sData = "mnuSaveAs" + cCharDelimiter + documentId+ "." + documentFormat + cCharDelimiter + filetype + cCharDelimiter + "partstart" + cCharDelimiter + dd.ToRendererPart();
		}
		sendCommand(editor, fCallback, "", "", sData);
	}
	else
	{
		var oBinaryFileWriter = new BinaryFileWriter(editor.WordControl.m_oLogicDocument);
		sData = "mnuSaveAs" + cCharDelimiter + documentId+ "." + documentFormat + cCharDelimiter + filetype + cCharDelimiter + "completeall" + cCharDelimiter + oBinaryFileWriter.Write();
		sendCommand(editor, fCallback, "", "", sData);
	}
};
function _uploadResponse(url, error)
{
    editor.sync_EndAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
    if(0 == error)
    {
        editor.AddImageUrl(url);
    }
    else
    {
        switch(error)
        {
            case -1:editor.fireCallback("asc_onError",c_oAscError.ID.UplImageExt,c_oAscError.Level.NoCritical);break;
            case -2:editor.fireCallback("asc_onError",c_oAscError.ID.UplImageSize,c_oAscError.Level.NoCritical);break;
            case -3:editor.fireCallback("asc_onError",c_oAscError.ID.UnexpectedGuid,c_oAscError.Level.Critical);break;
            case -4:editor.fireCallback("asc_onError",c_oAscError.ID.UplImageFileCount,c_oAscError.Level.NoCritical);break;
			case -5:editor.fireCallback("asc_onError",c_oAscError.ID.Database,c_oAscError.Level.Critical);break;
			case -10:editor.fireCallback("asc_onError",c_oAscError.ID.Unknown,c_oAscError.Level.Critical);break;
        }
    }
};

function _getFullImageSrc(src)
{
	var start = src.substring(0, 6);
    if(0 != src.indexOf("http:") && 0 != src.indexOf("data:") && 0 != src.indexOf("https:") && 0 != src.indexOf("ftp:") && 0 != src.indexOf("file:"))
		return editor.DocumentUrl + "media/" + src;
	else
		return src;
};

function ajax(obj){
	var url = "", type = "GET", 
		async = true, data = null, dataType = "text/xml", 
		error = null, success = null, httpRequest = null,

	init = function (obj){
	
		if ( typeof (obj.url) != 'undefined' ){
			url = obj.url;
		}
		if ( typeof (obj.type) != 'undefined' ){
			type = obj.type;
		}
		if ( typeof (obj.async) != 'undefined' ){
			async = obj.async;
		}		
		if ( typeof (obj.data) != 'undefined' ){
			data = obj.data;
		}		
		if ( typeof (obj.dataType) != 'undefined' ){
			dataType = obj.dataType;
		}		
		if ( typeof (obj.error) != 'undefined' ){
			error = obj.error;
		}		
		if ( typeof (obj.success) != 'undefined' ){
			success = obj.success;
		}

		if (window.XMLHttpRequest) { // Mozilla, Safari, ...
			httpRequest = new XMLHttpRequest();
			if (httpRequest.overrideMimeType) {
				httpRequest.overrideMimeType(dataType);
			}
		} 
		else if (window.ActiveXObject) { // IE
			try {
				httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
			} 
			catch (e) {
				try {
					httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
				} 
				catch (e) {}
			}
		}
			
		httpRequest.onreadystatechange = function(){
			respons(this); 
		};
		send();
	},
	
	send = function(){
		httpRequest.open(type, url, async);
		if (type === "POST")
			httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		httpRequest.send(data);
	},
	
	respons = function(httpRequest){
		switch (httpRequest.readyState)
		{
			case 0:
				// The object has been created, but not initialized (the open method has not been called).
				break;
			case 1:
				// A request has been opened, but the send method has not been called.
				break;
			case 2:
				// The send method has been called. No data is available yet.
				break;
			case 3:
				// Some data has been received; however, neither responseText nor responseBody is available.
				break;
			case 4:
				if (httpRequest.status == 200 || httpRequest.status == 1223) {
					if (typeof success === "function")
						success(httpRequest.responseText);
				} else {
					if (typeof error === "function")
						error(httpRequest,httpRequest.statusText,httpRequest.status);
				}
				break;
		}
	};
	
	init(obj);
}
//test