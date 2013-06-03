var colorStorage =[["black","000000"],["dimgray","696969"],["gray","808080"],["darkgray","A9A9A9"],["silver","C0C0C0"],["lightgrey","D3D3D3"],["gainsboro","DCDCDC"],["whitesmoke","F5F5F5"],["white","FFFFFF"],["snow","FFFAFA"],["rosybrown","BC8F8F"],["lightcoral","F08080"],["indianred","CD5C5C"],["brown","A52A2A"],["firebrick","B22222"],["maroon","800000"],["darkred","8B0000"],["red","FF0000"],["salmon","FA8072"],["mistyrose","FFE4E1"],["tomato","FF6347"],["darksalmon","E9967A"],["coral","FF7F50"],["orangered","FF4500"],["lightsalmon","FFA07A"],["sienna","A0522D"],["seashell","FFF5EE"],["saddlebrown","8B4513"],["chocolate","D2691E"],["peachpuff","FFDAB9"],["sandybrown","F4A460"],["linen","FAF0E6"],["peru","CD853F"],["bisque","FFE4C4"],["darkorange","FF8C00"],["antiquewhite","FAEBD7"],["tan","D2B48C"],["burlywood","DEB887"],["blanchedalmond","FFEBCD"],["navajowhite","FFDEAD"],["papayawhip","FFEFD5"],["moccasin","FFE4B5"],["oldlace","FDF5E6"],["wheat","F5DEB3"],["orange","FFA500"],["floralwhite","FFFAF0"],["goldenrod","DAA520"],["darkgoldenrod","B8860B"],["cornsilk","FFF8DC"],["gold","FFD700"],["lemonchiffon","FFFACD"],["khaki","F0E68C"],["palegoldenrod","EEE8AA"],["darkkhaki","BDB76B"],["ivory","FFFFF0"],["beige","F5F5DC"],["lightyellow","FFFFE0"],["olive","808000"],["yellow","FFFF00"],["olivedrab","6B8E23"],["yellowgreen","9ACD32"],["darkolivegreen","556B2F"],["greenyellow","ADFF2F"],["lawngreen","7CFC00"],["chartreuse","7FFF00"],["honeydew","F0FFF0"],["darkseagreen","8FBC8F"],["lightgreen","90EE90"],["palegreen","98FB98"],["forestgreen","228B22"],["limegreen","32CD32"],["darkgreen","006400"],["green","008000"],["lime","00FF00"],["seagreen","2E8B57"],["mediumseagreen","3CB371"],["mintcream","F5FFFA"],["springgreen","00FF7F"],["mediumspringgreen","00FA9A"],["mediumaquamarine","66CDAA"],["aquamarine","7FFFD4"],["turquoise","40E0D0"],["lightseagreen","20B2AA"],["mediumturquoise","48D1CC"],["azure","F0FFFF"],["paleturquoise","AFEEEE"],["darkslategray","2F4F4F"],["teal","008080"],["darkcyan","008B8B"],["aqua","00FFFF"],["cyan","00FFFF"],["lightcyan","E0FFFF"],["darkturquoise","00CED1"],["cadetblue","5F9EA0"],["powderblue","B0E0E6"],["lightblue","ADD8E6"],["deepskyblue","00BFFF"],["skyblue","87CEEB"],["lightskyblue","87CEFA"],["steelblue","4682B4"],["aliceblue","F0F8FF"],["slategray","708090"],["lightslategray","778899"],["dodgerblue","1E90FF"],["lightsteelblue","B0C4DE"],["cornflowerblue","6495ED"],["royalblue","4169E0"],["ghostwhite","F8F8FF"],["lavender","E6E6FA"],["midnightblue","191970"],["navy","000080"],["darkblue","00008B"],["mediumblue","0000CD"],["blue","0000FF"],["darkslateblue","483D8B"],["slateblue","6A5ACD"],["mediumslateblue","7B68EE"],["mediumpurple","9370DB"],["blueviolet","8A2BE2"],["indigo","4B0082"],["darkorchid","9932CC"],["darkviolet","9400D3"],["mediumorchid","BA55D3"],["thistle","D8BFD8"],["plum","DDA0DD"],["violet","EE82EE"],["purple","800080"],["darkmagenta","8B008B"],["fuchsia","FF00FF"],["magenta","FF00FF"],["orchid","DA70D6"],["mediumvioletred","C71585"],["deeppink","FF1493"],["hotpink","FF69B4"],["lavenderblush","FFF0F5"],["palevioletred","DB7093"],["crimson","DC143C"],["pink","FFC0CB"],["lightpink","FFB6C1"]]

var focusEditor = undefined;
var fontList = ["Agency FB","Aharoni","Algerian","Andalus","Angsana New","AngsanaUPC","Arabic Transparent","Arial","Arial Black","Arial Narrow","Arial Rounded MT Bold","Arial Unicode MS","Aston-F1","Baskerville Old Face","Batang","BatangChe","Bauhaus 93","Bell MT","Berlin Sans FB","Berlin Sans FB Demi","Bernard MT Condensed","Bickham Script Pro Regular","Blackadder ITC","Bodoni MT","Bodoni MT Black","Bodoni MT Condensed","Bodoni MT Poster Compressed","Book Antiqua","Bookman Old Style","Bookshelf Symbol 7","Bradley Hand ITC","Britannic Bold","Broadway","Browallia New","BrowalliaUPC","Brush Script MT","Calibri","Californian FB","Calisto MT","Cambria","Cambria Math","Candara","Castellar","Centaur","Century","Century Gothic","Century Schoolbook","Chiller","Colonna MT","Comic Sans MS","Consolas","Constantia","Cooper Black","Copperplate Gothic Bold","Copperplate Gothic Light","Corbel","Cordia New","CordiaUPC","Courier New","Curlz MT","David","David Transparent","DejaVu Sans","DejaVu Sans Condensed","DejaVu Sans Light","DejaVu Sans Mono","DejaVu Serif","DejaVu Serif Condensed","DilleniaUPC","Dingbats","Dotum","DotumChe","Droid Sans Mono","Edwardian Script ITC","Elephant","Engravers MT","Eras Bold ITC","Eras Demi ITC","Eras Light ITC","Eras Medium ITC","Estrangelo Edessa","EucrosiaUPC","Felix Titling","Fixed Miriam Transparent","FlemishScript BT","Footlight MT Light","Forte","Franklin Gothic Book","Franklin Gothic Demi","Franklin Gothic Demi Cond","Franklin Gothic Heavy","Franklin Gothic Medium","Franklin Gothic Medium Cond","FrankRuehl","FreesiaUPC","Freestyle Script","French Script MT","Gabriola","Garamond","Gautami","Gentium Basic","Gentium Book Basic","Georgia","Gigi","Gill Sans MT","Gill Sans MT Condensed","Gill Sans MT Ext Condensed Bold","Gill Sans Ultra Bold","Gill Sans Ultra Bold Condensed","Gloucester MT Extra Condensed","GOST type A","GOST type B","Goudy Old Style","Goudy Stout","Gulim","GulimChe","Gungsuh","GungsuhChe","Haettenschweiler","Harlow Solid Italic","Harrington","High Tower Text","Impact","Imprint MT Shadow","Informal Roman","IrisUPC","JasmineUPC","Jokerman","Juice ITC","Kartika","KodchiangUPC","Kristen ITC","Kunstler Script","Latha","Levenim MT","LilyUPC","Lucida Bright","Lucida Calligraphy","Lucida Console","Lucida Fax","Lucida Handwriting","Lucida Sans","Lucida Sans Typewriter","Lucida Sans Unicode","Magneto","Maiandra GD","Mangal","Matura MT Script Capitals","Meiryo","Meiryo UI","Microsoft Sans Serif","MingLiU","Miriam","Miriam Fixed","Miriam Transparent","Mistral","Modern No. 20","Monotype Corsiva","MS Gothic","MS Mincho","MS Outlook","MS PGothic","MS PMincho","MS Reference Sans Serif","MS Reference Specialty","MS UI Gothic","MT Extra","MV Boli","Narkisim","Niagara Engraved","Niagara Solid","NSimSun","OCR A Extended","Old English Text MT","Onyx","OpenSymbol","Palace Script MT","Palatino Linotype","Papyrus","Parchment","Perpetua","Perpetua Titling MT","Playbill","PMingLiU","Poor Richard","Pristina","Raavi","Rage Italic","Ravie","Rockwell","Rockwell Condensed","Rockwell Extra Bold","Rod","Rod Transparent","Script MT Bold","Segoe UI","Showcard Gothic","Shruti","SimHei","Simplified Arabic","Simplified Arabic Fixed","SimSun","SimSun-PUA","Snap ITC","Stencil","Sylfaen","Symbol","Tahoma","Tempus Sans ITC","Times New Roman","Traditional Arabic","Trebuchet MS","Tunga","Tw Cen MT","Tw Cen MT Condensed","Tw Cen MT Condensed Extra Bold","Verdana","Viner Hand ITC","Vivaldi","Vladimir Script","Vrinda","Webdings","Wide Latin","Wingdings","Wingdings 2","Wingdings 3"];
var globalTextIndex = 0;
var globalTextName = "";
var globalFontNameApi = false;
var elem, contextGrad, gradient, gradSelectPosTop = 1, imgd, pix, colorSelecterClick, newColorSelected={r:255,g:0,b:0},lastColorSelected={r:255,g:0,b:0};
var IsVisibleMenu = false, specialHeaderForFirstPage = false,differentHeaderForOddAndEvenPages = false;
var focusEditor = undefined, color123,bulletlistpressed=false,numberedlistpressed=false,cellsForTable={columns:0,rows:0},insttblpressed = false;
var clearPropObj = false;
var ColorChart_timer = null;

var globalCurentUser = "";
var g_arrLockedInfo = new Array();

var g_oTextPr = new Object(); // CTextPr
var g_oImagePr = new Object();//
var g_oTablePr = new Object();


var Drag = {

    obj : null,

    init : function(o, oRoot, minX, maxX, minY, maxY, bSwapHorzRef, bSwapVertRef, fXMapper, fYMapper)
    {
        o.onmousedown   = Drag.start;

        o.hmode         = bSwapHorzRef ? false : true ;
        o.vmode         = bSwapVertRef ? false : true ;

        o.root = oRoot && oRoot != null ? oRoot : o ;

        if (o.hmode  && isNaN(parseInt(o.root.style.left  ))) o.root.style.left   = "0px";
        if (o.vmode  && isNaN(parseInt(o.root.style.top   ))) o.root.style.top    = "350px";
        if (!o.hmode && isNaN(parseInt(o.root.style.right ))) o.root.style.right  = "0px";
        if (!o.vmode && isNaN(parseInt(o.root.style.bottom))) o.root.style.bottom = "0px";

        o.minX  = typeof minX != 'undefined' ? minX : null;
        o.minY  = typeof minY != 'undefined' ? minY : null;
        o.maxX  = typeof maxX != 'undefined' ? maxX : null;
        o.maxY  = typeof maxY != 'undefined' ? maxY : null;

        o.xMapper = fXMapper ? fXMapper : null;
        o.yMapper = fYMapper ? fYMapper : null;

        o.root.onDragStart  = new Function();
        o.root.onDragEnd    = new Function();
        o.root.onDrag       = new Function();
    },

    start : function(e)
    {
        var o = Drag.obj = this;
        e = Drag.fixE(e);
        var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
        var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
        o.root.onDragStart(x, y);

        o.lastMouseX    = e.clientX;
        o.lastMouseY    = e.clientY;

        if (o.hmode) {
            if (o.minX != null) o.minMouseX = e.clientX - x + o.minX;
            if (o.maxX != null) o.maxMouseX = o.minMouseX + o.maxX - o.minX;
        } else {
            if (o.minX != null) o.maxMouseX = -o.minX + e.clientX + x;
            if (o.maxX != null) o.minMouseX = -o.maxX + e.clientX + x;
        }

        if (o.vmode) {
            if (o.minY != null) o.minMouseY = e.clientY - y + o.minY;
            if (o.maxY != null) o.maxMouseY = o.minMouseY + o.maxY - o.minY;
        } else {
            if (o.minY != null) o.maxMouseY = -o.minY + e.clientY + y;
            if (o.maxY != null) o.minMouseY = -o.maxY + e.clientY + y;
        }

        document.onmousemove    = Drag.drag;
        document.onmouseup      = Drag.end;

        return false;
    },

    drag : function(e)
    {
        e = Drag.fixE(e);
        var o = Drag.obj;

        var ey  = e.clientY;
        var ex  = e.clientX;
        var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
        var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
        var nx, ny;

        if (o.minX != null) ex = o.hmode ? Math.max(ex, o.minMouseX) : Math.min(ex, o.maxMouseX);
        if (o.maxX != null) ex = o.hmode ? Math.min(ex, o.maxMouseX) : Math.max(ex, o.minMouseX);
        if (o.minY != null) ey = o.vmode ? Math.max(ey, o.minMouseY) : Math.min(ey, o.maxMouseY);
        if (o.maxY != null) ey = o.vmode ? Math.min(ey, o.maxMouseY) : Math.max(ey, o.minMouseY);

        nx = x + ((ex - o.lastMouseX) * (o.hmode ? 1 : -1));
        ny = y + ((ey - o.lastMouseY) * (o.vmode ? 1 : -1));

        if (o.xMapper)      nx = o.xMapper(y)
        else if (o.yMapper) ny = o.yMapper(x)

        if(o.hmode)
        {
            Drag.obj.root.style.left = nx + "px";
        }
        else
        {
            Drag.obj.root.style.right = nx + "px";
        }

        if(o.vmode)
        {
            Drag.obj.root.style.top = ny + "px";
        }
        else
        {
            Drag.obj.root.style.bottom = ny + "px";
        }

        Drag.obj.lastMouseX = ex;
        Drag.obj.lastMouseY = ey;
        Drag.obj.root.onDrag(nx, ny);

        return false;
    },

    end : function()
    {
        document.onmousemove = null;
        document.onmouseup   = null;
        var x_pos = parseInt( Drag.obj.hmode ? Drag.obj.root.style.left : Drag.obj.root.style.right );
        var y_pos = parseInt( Drag.obj.vmode ? Drag.obj.root.style.top : Drag.obj.root.style.bottom );
        Drag.obj.root.onDragEnd( x_pos, y_pos );
        Drag.obj = null;
    },

    fixE : function(e)
    {
        if (typeof e == 'undefined') e = window.event;
        if (typeof e.layerX == 'undefined') e.layerX = e.offsetX;
        if (typeof e.layerY == 'undefined') e.layerY = e.offsetY;
        return e;
    }
};


function remIconPress(){
	$("#td_BackgroundColor, #td_TextColor,#td_paragraph,#td_headertitle").removeClass("iconPressed");
	if(insttblpressed==false && $("#td_instbl").hasClass("iconPressed")){
		$("#td_instbl").removeClass("iconPressed")
	}
	if(numberedlistpressed==false && $("#td_numberedlist").hasClass("iconPressed")){
		$("#td_numberedlist").removeClass("iconPressed")
	}
	if(bulletlistpressed==false && $("#td_bulletedlist").hasClass("iconPressed")){
		$("#td_bulletedlist").removeClass("iconPressed")
	}
}
function changeFontColor(color,bg_text){
	var r, g, b;
	var transparent = false;
	if (color != 'transparent'){// "transparent" means "none" color;
		arrColor = color.match(/(\d)+/g)
		_r_ = arrColor[0];
		_g_ = arrColor[1];
		_b_ = arrColor[2];
		r = parseInt(_r_);
		g = parseInt(_g_);
		b = parseInt(_b_);

        if (arrColor.length == 4 && 0 == parseInt(arrColor[3]))
            transparent = true;
	}
	else{//do something if color =="transparent"
		r = 0;
		g = 0;
		b = 0;
		transparent = true;
	}

    if (bg_text == "back"){//do something for change text background color
		editor.put_LineHighLight(!transparent, r, g, b);
		return false;
	}
	if (bg_text == "text"){//do something for change text color
		editor.put_TextColor(r, g, b);
		return false;
	}
	if (bg_text == "paragraph"){//do something fill paragraph in selected color
		editor.put_ParagraphShade(!transparent, r, g, b)
		return false;
	}
}
function changeListType(type)
{
	var Type = 0, SubType = -1;
 
    switch ( type )
    {
        case "markerType1": Type = 0; SubType = -1; break;
        case "markerType2": Type = 0; SubType = 1; break;
        case "markerType3": Type = 0; SubType = 2; break;
        case "markerType4": Type = 0; SubType = 3; break;
        case "markerType5": Type = 0; SubType = -1; break;
        case "markerType6": Type = 0; SubType = 4; break;
        case "markerType7": Type = 0; SubType = 5; break;
        case "markerType8": Type = 0; SubType = 6; break;

        case "listType1": Type = 1; SubType = -1; break;
        case "listType2": Type = 1; SubType = 1; break;
        case "listType3": Type = 1; SubType = 2; break;
        case "listType4": Type = 1; SubType = 3; break;
        case "listType5": Type = 1; SubType = 4; break;
        case "listType6": Type = 1; SubType = 5; break;
        case "listType7": Type = 1; SubType = 6; break;
        case "listType8": Type = 1; SubType = 7; break;

        case "multiType1": Type = 2; SubType = -1; break;
        case "multiType2": Type = 2; SubType = 1; break;
        case "multiType3": Type = 2; SubType = 2; break;
        case "multiType4": Type = 2; SubType = 3; break;
    }
	editor.put_ListType(Type,SubType);
}
function changeTypeNumberPage(type){
	var typeAlign, typeHeaderFooter;
    /* var oWordControl = editor.WordControl; */
	switch (type){//do something for change type page number 
		case "htType1":
        {
            editor.put_PageNum( hdrftr_Header, align_Left );
            break;
        }
		case "htType2":
        {
            editor.put_PageNum( hdrftr_Header, align_Center );
            break;
        }
		case "htType3":
        {
            editor.put_PageNum( hdrftr_Header, align_Right );
            break;
        }
		case "htType4":
        {
            editor.put_PageNum( hdrftr_Footer, align_Left );
            break;
        }
		case "htType5":
        {
            editor.put_PageNum( hdrftr_Footer, align_Center );
            break;
        }
		case "htType6":
        {
            editor.put_PageNum( hdrftr_Footer, align_Right );
            break;
        }
		case "htType7":
        {
            editor.put_PageNum( -1 );
            break;
        }
	}
	
}
function createFontList(){
	fontContent = "";
	for (var i = 0; i < fontList.length; i++)
		fontContent += '<li id="'+fontList[i].replace(/\s/g,"")+'"index="'+i+'" class="SubItem fontListElement" style="font-family:Arial;" nameFont="'+fontList[i]+'">'+fontList[i]+'</li>';
	$("#fontSelect ul").empty().append(fontContent);
}

$(document).ready(function(){
$("#imgW, #imgH, #imgLeft, #imgTop, #imgRight, #imgBottom, #imgX, #imgY, #hafHF, #tblW, #tblCS, #tblMarLeft, #tblMarTop, #tblMarRight, #tblMarBottom, #tblIndentLeft, #tblLeft, #tblTop, #tblRight, #tblBottom, #tblBrdBGColor, #imgURL, #tblDefMarLeft, #tblDefMarTop, #tblDefMarRight, #tblDefMarBottom, #tblX, #tblY, #prFirst, #prLeft, #prRight, #prLineHeight, #prAfter, #prBefore, #hyperToolTip, #hyperUrl, #hyperText, #prTextSpacing, #prTextPosition, #prTextPosition, #imgPositionVPosValueCombo, #imgPositionHPosValueCombo, #tblHeaderRowsCount, #tblPositionVPosValueCombo, #tblPositionHPosValueCombo,")
.focus(function(){editor.asc_enableKeyEvents(false);})
.blur(function(){editor.asc_enableKeyEvents(true);})

$("#id_viewer").mousedown(function(){ this.focus(); editor.asc_enableKeyEvents(true);});

document.getElementById ("specialHeaderForFirstPage").checked = false;
document.getElementById ("differentHeaderForOddAndEvenPages").checked = false;
if (editor.ShowParaMarks) $("#td_paragraphMarks").addClass("iconPressed");
$("#mainmenu,#menuButton").clickMenu({onClick:function(){
    /* var oWordControl = editor.WordControl; */
switch(this.id){
case "mnuOpen":
	$('#mainmenu').trigger('closemenu');
	$("#dialogFileOpen").dialog("open");
	break;
case "mnuSave":
	$('#mainmenu').trigger('closemenu');
	editor.asc_Save();
	break;
case "mnuSaveAs":
	return false;
case "mnuSaveAsDocx":
	$('#mainmenu').trigger('closemenu');
	editor.asc_DownloadAs(c_oAscFileType.DOCX);
	break;
case "mnuSaveAsDoc":
	$('#mainmenu').trigger('closemenu');
	editor.asc_DownloadAs(c_oAscFileType.DOC);
	break;
case "mnuSaveAsRtf":
	$('#mainmenu').trigger('closemenu');
	editor.asc_DownloadAs(c_oAscFileType.RTF);
	break;
case "mnuSaveAsPdf":
	$('#mainmenu').trigger('closemenu');
	editor.asc_DownloadAs(c_oAscFileType.PDF);
	break;
case "mnuAbout":
	$('#mainmenu').trigger('closemenu');
	$("#dialogAbout").dialog("open");
	break;
case "td_menu_bold":
	$('#mainmenu').trigger('closemenu');
	$("#td_bold").click();
	break;
case "td_menu_italic":
	$('#mainmenu').trigger('closemenu');
	$("#td_italic").click();
	break;
case "mnuCenter":
	$('#mainmenu').trigger('closemenu');
	$("#td_justifycenter").click();
	break;
case "mnuRight":
	$('#mainmenu').trigger('closemenu');
	$("#td_justifyright").click();
	break;
case "mnuLeft":
	$('#mainmenu').trigger('closemenu');
	$("#td_justifyleft").click();
	break;
case "mnuPrint":
	$('#mainmenu').trigger('closemenu');
	$("#td_print").click();
	break;
case "mnuJustified":
	$('#mainmenu').trigger('closemenu');
	$("#td_justifyblock").click();
	break;
case "td_menu_underline":
	$('#mainmenu').trigger('closemenu');
	$("#td_underline").click();
	break;
case "td_menu_undo":
	$('#mainmenu').trigger('closemenu');
	$("#td_undo").click();
	break;
case "td_menu_redo":
	$('#mainmenu').trigger('closemenu');
	$("#td_redo").click();
	break;
case "td_menu_copy":
	$('#mainmenu').trigger('closemenu');
    $("#td_copy").click();
    /* oWordControl.m_oDrawingDocument.ToRenderer(); */
	break;
case "td_menu_paste":
	$('#mainmenu').trigger('closemenu');
	$("#td_paste").click();
	break;
case "td_superscript":
	$('#mainmenu').trigger('closemenu');
	break;
case "td_subscript":
	$('#mainmenu').trigger('closemenu');
	break;
case "saveAsFile":
	$('#mainmenu').trigger('closemenu');

	break;
case "mnuOpenFile":
	$('#mainmenu').trigger('closemenu');

	break;
case "td_image_menu":
	$('#mainmenu').trigger('closemenu');
	$("#td_image").click();
	break;
case "td_link_menu":
	$('#mainmenu').trigger('closemenu');
	$("#td_link").click();
	break;
case "td_drawing_menu":
	$('#mainmenu').trigger('closemenu');

	break;
case "td_specialchar":    break;
case "mnupreview":    break;
case "td_selectAll":
    global_is_ea_input_mode = !global_is_ea_input_mode;
    editor.SetTextBoxInputMode(global_is_ea_input_mode);
    break;
case "td_horizontalrule":    break;
case "td_table":    break;
case "td_find":    break;
case "td_pagebreak":
	editor.put_AddPageBreak();
    break;
case "td_cut":
case "td_strike":
	$('#mainmenu').trigger('closemenu');
	editor.put_TextPrStrikeout(true);
	break;
case "td_removeFormat":
	$('#mainmenu').trigger('closemenu');

	// Change to normal
	$('#fontFormatVal').text("Normal");
	$('#fontFormatVal').val("p");
	$('#fontFormatVal').change();
	break;
case "mnuDecrease":
	$('#mainmenu').trigger('closemenu');
	$("#td_outdent").click();
	break;
case "mnuIncrease":
	$('#mainmenu').trigger('closemenu');
	$("#td_indent").click();
	break;
case "p":
case "h1":
case "h2":
case "h3":
case "h4":
case "h5":
case "h6":
	$('#mainmenu').trigger('closemenu');
	$('#fontFormatVal').text(this.innerHTML);
	$('#fontFormatVal').val(this.id);
	$('#fontFormatVal').change();
	break;
case "Arial":
case "ComicSansMS":
case "CourierNew":
case "Georgia":
case "LucidaSansUnicode":
case "Tahoma":
case "TimesNewRoman":
case "TrebuchetMS":
case "Verdana":
case "Calibri":
	$('#mainmenu').trigger('closemenu');
	$('#fontSelectVal').text(this.innerHTML);
	$('#fontSelectVal').val(this.getAttribute("value"));
	$('#fontSelectVal').change();
	break;
case "8":
case "9":
case "10":
case "11":
case "12":
case "14":
case "16":
case "18":
case "20":
case "22":
case "24":
case "26":
case "28":
case "36":
case "48":
case "72":
	$('#mainmenu').trigger('closemenu');
	$('#fontSizeSelectVal').text(this.innerHTML);
	$('#fontSizeSelectVal').val(this.id);
	$('#fontSizeSelectVal').change();
	break;
case "mnuShortcuts":
	$('#mainmenu').trigger('closemenu');

	break;
case "mnuBulletedList":
	$('#mainmenu').trigger('closemenu');
	$("#td_bulletedlist").click();
	break;
case "mnuNumberedList":
	$('#mainmenu').trigger('closemenu');
	$("#td_numberedlist").click();
	break;
case "colorBox3":
case "colorBox4":
	$('#mainmenu').trigger('closemenu');
	break;
}
return false;
}});
createFontList();
$("#textMenu").clickMenu({onClick:function(){
    var bIsNeed = true;
	switch(this.id){
	case "p":
	case "h1":
	case "h2":
	case "h3":
	case "h4":
	case "h5":
	case "h6":
	case "h7":
	case "h8":
	case "h9":
	case "id_style_NoSpacing":
    case "id_style_Title":
    case "id_style_Subtitle":
    case "id_style_Quote":
    case "id_style_IntenseQuote":
    case "id_style_ParagraphList":
		$('#textMenu').trigger('closemenu');
		$('#fontFormatVal').text(this.innerHTML);
		$('#fontFormatVal').val(this.id);
		editor.put_Style(this.innerHTML);
		break; 
	case "8": case "9": case "10": case "11": case "12": case "14": case "16": case "18": case "20": case "22": case "24": case "26": case "28": case "36": case "48": case "72":
		editor.put_TextPrFontSize(parseInt(this.id));
		$('#textMenu').trigger('closemenu');
		$('#fontSizeSelectVal').text(this.innerHTML);
		$('#fontSizeSelectVal').val(this.id);
		$('#fontSizeSelectVal').change();
		break;
	case "lineSpacing05"	: if (bIsNeed) {editor.put_PrLineSpacing(0.5);} bIsNeed = false;
	case "lineSpacing1" 	: if (bIsNeed) {editor.put_PrLineSpacing(1.0);} bIsNeed = false;
	case "lineSpacing15" 	: if (bIsNeed) {editor.put_PrLineSpacing(1.5);} bIsNeed = false;
	case "lineSpacing2" 	: if (bIsNeed) {editor.put_PrLineSpacing(2.0);} bIsNeed = false;
	case "lineSpacing25" 	: if (bIsNeed) {editor.put_PrLineSpacing(2.5);} bIsNeed = false;
	case "lineSpacingAfter" : if (bIsNeed) {editor.put_LineSpacingBeforeAfter(1,0);} bIsNeed = false;
	case "lineSpacingBefore": if (bIsNeed) {editor.put_LineSpacingBeforeAfter(0,0);} bIsNeed = false;
		$('#textMenu').trigger('closemenu');
		$('#lineSpacingVal').text(this.innerHTML);
		$('#lineSpacingVal').val(this.id);
		//$('#lineSpacingVal').change(this.id);

		break;
	default:{
		$('#textMenu').trigger('closemenu');
		if ($(this).hasClass("fontListElement")){
			$('#fontSelectVal').text(this.innerHTML);
			$('#fontSelectVal').val(this.getAttribute("value"));
			// $('#fontSelectVal').change($("#"+this.id).attr("index"),$("#"+this.id).attr("value"));
			$('#fontSelectVal').change();
			editor.put_TextPrFontName($(this).attr("namefont"));
		}
	}
	}
	return false;
}});

$("#lineSpacingVal").change (function(){
});

$(".clrPicker1").mousedown(function(){
	if ("none" != $("#colorBox1").css("display")){
		IsVisibleMenu = true;
		$("#td_BackgroundColor").removeClass("iconPressed");
		$("#colorBox1").css("display","none");
	}
});

$(".clrPicker1").click(function(){
	if (false == IsVisibleMenu){
		var ofset=$("#td_BackgroundColor").offset();
		ofset.top += $("#td_BackgroundColor").outerHeight() - 1;
		$("#colorBox1").css(ofset);
		$("#colorBox1").attr("init", "background-color").show();
		$("#td_BackgroundColor").addClass("iconPressed");
	}
	IsVisibleMenu = false;
});
$(".colorSelect1").click(function(){
	$(".clrSelector1").children().css('border-bottom-color', $(this).children().css('backgroundColor'));
	$("#colorBox1").hide();
	$(".clrSelector1").click();
});
$(".clrSelector1").click(function(){
	var a1="background-color";
	var a2=$(this).children().css("border-bottom-color");
	var otd_color_fon = $("#td_color_fon");
	otd_color_fon.blur();
	$("#td_BackgroundColor").removeClass("iconPressed");
	//focusEditor();
	changeFontColor(a2,"back");
//	setColor('back', a2);
	return false;
});
$(".clrPicker2, .clrPicker3").mousedown(function(event){
	if ("none" != $("#colorBox2").css("display") && $("#td_TextColor").hasClass("iconPressed")){
		IsVisibleMenu = true;
		$("#td_TextColor").removeClass("iconPressed");
		$("#colorBox2").css("display","none");
		return false;
	}
	if ("none" != $("#colorBox2").css("display") && $("#td_paragraph").hasClass("iconPressed")){
		IsVisibleMenu = true;
		$("#td_paragraph").removeClass("iconPressed");
		$("#colorBox2").css("display","none");
		return false;
	}
});
$(".clrPicker2").click(function(){
	if (false == IsVisibleMenu){
		var ofset=$("#td_TextColor").offset();
		ofset.top += $("#td_TextColor").outerHeight() - 1;
		$("#colorBox2").css(ofset);
		$("#colorBox2").attr("init", "colorFont").show();
		$("#td_TextColor").addClass("iconPressed");
	}
	IsVisibleMenu = false;
});
$(".colorSelect2").click(function(){
	if($("#colorBox2").attr("init") == "colorFont"){
		$(".clrSelector2").children().css('border-bottom-color', $(this).children().css('backgroundColor'));
		$("#colorBox2").hide();
		$(".clrSelector2").click();
	}
	if($("#colorBox2").attr("init") == "colorParagraph"){
		$(".clrSelector3").children().css('border-bottom-color', $(this).children().css('backgroundColor'));
		$("#colorBox2").hide();
		$(".clrSelector3").click();
	}
});
$(".clrSelector2").click(function(){
	var a1="background-color";
	var a2=$(this).children().css("border-bottom-color");
	var otd_color = $("#td_color");
	otd_color.blur();
	$("#td_TextColor").removeClass("iconPressed");
	changeFontColor(a2,"text");
	return false;
});
$(".clrPicker3").click(function(){
	if (false == IsVisibleMenu){
		var ofset=$("#td_paragraph").offset();
		ofset.top += $("#td_paragraph").outerHeight() - 1;
		$("#colorBox2").css(ofset);
		$("#colorBox2").attr("init", "colorParagraph").show();
		$("#td_paragraph").addClass("iconPressed");
	}
	IsVisibleMenu = false;
});
$(".colorSelect3").click(function(){
	$(".clrSelector3").children().css('border-bottom-color', $(this).children().css('backgroundColor'));
	$("#colorBox3fp").hide();
	$(".clrSelector3").click();
});
$(".clrSelector3").click(function(){
	var a1="background-color";
	var a2=$(this).children().css("border-bottom-color");
	var otd_color = $("#td_prg");
	otd_color.blur();
	$("#td_paragraph").removeClass("iconPressed");
	changeFontColor(a2,"paragraph");
	return false;
});
$(".lstPicker1").mousedown(function(event){
	if ("none" != $("#listSelect").css("display")){
		IsVisibleMenu = true;
		$("#td_numberedlist").removeClass("iconPressed");
		$("#listSelect").css("display","none");
	}
});
$(".lstPicker1").click(function(){
	if (false == IsVisibleMenu){
		var offset=$("#td_numberedlist").offset();
		offset.top += $("#td_numberedlist").outerHeight() - 2;
		$("#listSelect").css(offset);
		$("#listSelect").attr("init", "list").show();
		$("#td_numberedlist").addClass("iconPressed");
	}
	IsVisibleMenu = false;
});
$(".listSelected").click(function(){
	$("#td_numberedlist").removeClass("iconPressed");
	$("#td_bulletedlist").removeClass("iconPressed");
	$("#listSelect").hide();
	$("#numberedlist").attr("selectType",$(this).attr("type"));
    changeListType($(this).attr("type"))

})
$(".lstPicker2").mousedown(function(event){
	if ("none" != $("#markerSelect").css("display")){
		IsVisibleMenu = true;
		$("#td_bulletedlist").removeClass("iconPressed");
		$("#markerSelect").css("display","none");
	}
});
$(".lstPicker2").click(function(){
	if (false == IsVisibleMenu){
		var offset=$("#td_bulletedlist").offset();
		offset.top += $("#td_bulletedlist").outerHeight() - 2;
		$("#markerSelect").css(offset);
		$("#markerSelect").attr("init", "mrklist").show();
		$("#td_bulletedlist").addClass("iconPressed");
	}
	IsVisibleMenu = false;
});
$(".markerSelected").click(function(){
	$("#td_bulletedlist").removeClass("iconPressed");
	$("#td_numberedlist").removeClass("iconPressed");
	$("#markerSelect").hide();
	$("#bulletedlist").attr("selectType",$(this).attr("type"));
    changeListType($(this).attr("type"))
})

$(".lstPicker3").mousedown(function(event){
	if ("none" != $("#multiSelect").css("display")){
		IsVisibleMenu = true;
		$("#td_multilist").removeClass("iconPressed");
		$("#multiSelect").css("display","none");
	}
});
$(".lstPicker3").click(function(){
	if (false == IsVisibleMenu){
		var offset=$("#td_multilist").offset();
		offset.top += $("#td_multilist").outerHeight() - 2;
		$("#multiSelect").css(offset);
		$("#multiSelect").attr("init", "mltlist").show();
		$("#td_multilist").addClass("iconPressed");
	}
	IsVisibleMenu = false;
});
$(".multiSelected").click(function(){
	$("#td_multilist").removeClass("iconPressed");
	$("#multiSelect").hide();
	$("#multilist").attr("selectType",$(this).attr("type"));
    changeListType($(this).attr("type"))
})


$(".htPicker1").mousedown(function(event){
	if ("none" != $("#hdSelect").css("display")){
		IsVisibleMenu = true;
		$("#td_headertitle").removeClass("iconPressed");
		$("#hdSelect").css("display","none");
	}
});
$(".htPicker1").click(function(){
	if (false == IsVisibleMenu){
		var offset=$("#td_headertitle").offset();
		offset.top += $("#td_headertitle").outerHeight() - 2;
		$("#hdSelect").css(offset);
		$("#hdSelect").attr("init", "ht").show();
		$("#td_headertitle").addClass("iconPressed");
	}
	IsVisibleMenu = false;
});
$(".htSelected").click(function(){
	$(".htSelected").removeClass("selectedHT");
	$(this).addClass("selectedHT");
	$("#td_headertitle").removeClass("iconPressed")
	$("#hdSelect").hide();
	changeTypeNumberPage($(this).attr("type"));
})

$("#specialHeaderForFirstPage,#differentHeaderForOddAndEvenPages").click(function(){
	if(this.id == "specialHeaderForFirstPage" ){
		editor.HeadersAndFooters_DifferentFirstPage(document.getElementById ("specialHeaderForFirstPage").checked);
	}
	if(this.id == "differentHeaderForOddAndEvenPages" ){
		editor.HeadersAndFooters_DifferentFirstPage(document.getElementById ("differentHeaderForOddAndEvenPages").checked);
	}
})

$("#menu,#id_main").mousedown(function(){$(".PopUpMenuStyle, .PopUpMenuStyle2, .options, .icon_options").hide();remIconPress();});
$(".selectableIcon").bind("mouseenter", function(){$(this).addClass("ToolbarIconOutSelect");});
$(".selectableIcon").bind("mouseleave", function(){$(this).removeClass("ToolbarIconOutSelect");});
var _gdi = true;
$("#td_formatmodel,#td_info, #td_redo, #td_undo, #td_orient, #td_bold, #td_italic, #td_underline, #td_print, #td_copy, #td_paste, #td_justifycenter, #td_justifyright, #td_justifyleft, #td_justifyblock, #td_checkspell, #td_image, #td_image2, #td_imageInText, #td_imageInText2, #td_chart_add, #td_chart_edit_data, #td_link, #td_indent, #td_outdent, #bulletedlist, #multilist, #numberedlist, #td_paragraphMarks,#td_tl_superscript, #td_tl_subscript, #td_instbl, #td_fontsizeOut, #td_fontsizeIn").click(function(){
	switch (this.id){
		case "td_orient"://do something if clicked book orientation
			if ($(this).hasClass("iconPressed")){
				$(this).removeClass("iconPressed");
				editor.change_PageOrient(true);
			}
			else{
				$(this).addClass("iconPressed");
				editor.change_PageOrient(false);
			}
		break;
		case "td_fontsizeIn":
			editor.FontSizeIn();
			break;
		case "td_fontsizeOut":
			editor.FontSizeOut();
			break;
		case "td_bold":
			if ($(this).hasClass("iconPressed")){
				$(this).removeClass("iconPressed");
				editor.put_TextPrBold(false);
			}
			else{
				$(this).addClass("iconPressed");
				editor.put_TextPrBold(true);
			}
			break;
		case "td_italic":
			if ($(this).hasClass("iconPressed")){
				$(this).removeClass("iconPressed");
				editor.put_TextPrItalic(false);
			}
			else{
				$(this).addClass("iconPressed");
				editor.put_TextPrItalic(true);
			}
			break;
		case "td_underline":
			if ($(this).hasClass("iconPressed")){
				$(this).removeClass("iconPressed");
				editor.put_TextPrUnderline(false);
			}
			else{
				$(this).addClass("iconPressed");
				editor.put_TextPrUnderline(true);
			}
			break;
		case "td_print":
			/* editor.goToPage(2); */
			break;
		case "td_copy":
			/* console.log(editor.FontSizeIn()); */
			break;
		case "td_paste":
			/* console.log(editor.FontSizeOut()); */
			break;
		case "td_justifyleft":
			// if ($(this).hasClass("iconPressed")){
				// $(this).removeClass("iconPressed");
			// }
			// else
			{
				$("td[id*='td_justify']").removeClass("iconPressed");
				$(this).addClass("iconPressed");
				editor.put_PrAlign(1)
			}
			break;
		case "td_justifycenter":
			if ($(this).hasClass("iconPressed")){
				$(this).removeClass("iconPressed");
                $("#td_justifyleft").addClass("iconPressed");
				editor.put_PrAlign(1)
			}
			else{
				$("td[id*='td_justify']").removeClass("iconPressed");
				$(this).addClass("iconPressed");
				editor.put_PrAlign(2)
			}
			break;
		case "td_justifyright":
			if ($(this).hasClass("iconPressed")){
				$(this).removeClass("iconPressed");
                $("#td_justifyleft").addClass("iconPressed");
				editor.put_PrAlign(1)
			}
			else{
				$("td[id*='td_justify']").removeClass("iconPressed");
				$(this).addClass("iconPressed");
				editor.put_PrAlign(0)
			}
			break;
		case "td_justifyblock":
			if ($(this).hasClass("iconPressed")){
				$(this).removeClass("iconPressed");
                $("#td_justifyleft").addClass("iconPressed");
				editor.put_PrAlign(1)
			}
			else{
				$("td[id*='td_justify']").removeClass("iconPressed");
				$(this).addClass("iconPressed");
				editor.put_PrAlign(3)
			}
			break;
		case "td_image":
            /*
            var _img = new Image();
            _img.onload = function(){
                editor.WordControl.m_oLogicDocument.Add_FlowImage( 50, 50, this );
            };
			//_img.innerHtml = "./Images/Test.jpg";
            _img.src = "./Images/Test.jpg";
            */
            editor.AddImageUrl("http://www.nat-geo.ru/pic/photos/10/1110_l2.jpg");
			break;
		case "td_image2":
			editor.AddImageUrl("Test.jpg", 0);
			break;
		case "td_imageInText":
			/*
			var _img = new Image();
            _img.onload = function(){
                editor.WordControl.m_oLogicDocument.Add_InlineImage( 50, 50, this );
            };
			//_img.innerHtml = "./Images/Test.jpg";
            _img.src = "./Images/Test.jpg";
            */
            editor.AddImage(true);
            break;
		case "td_imageInText2":
            editor.AddImageUrl("./Images/Test.jpg");
            break;
			
		case "td_chart_add":
			//g_oToolBox.showWordChartDialog();
			g_oToolBox.showChartSelectorDialog();
            break;
			
		case "td_chart_edit_data":			
			g_oToolBox.showChartEditData();
            break;
			
        case "td_link":

            //editor.WordControl.m_oLogicDocument.Document_CreateFontMap();

            Menu_Hyperlink_Add();

            //editor.WordControl.m_oLogicDocument.Search_Start(String);
			break;
		case "td_indent":
			editor.IncreaseIndent()
			break;
		case "td_outdent":
			editor.DecreaseIndent();
			break;
		case "bulletedlist":
            if ($("#td_bulletedlist").hasClass("iconPressed")){
				bulletlistpressed = false;
                $("#td_bulletedlist").removeClass("iconPressed");
				editor.put_ListType(0, -1);
            }
            else{
                $("#td_bulletedlist").addClass("iconPressed");
				bulletlistpressed = true;
				editor.put_ListType(0, 0);
            }
 			break;
		case "multilist":
            if ($("#td_multilist").hasClass("iconPressed")){
                $("#td_multilist").removeClass("iconPressed");
            }
            else{
                $("#td_multilist").addClass("iconPressed");
            }
 			break;
		case "numberedlist":
            if ($("#td_numberedlist").hasClass("iconPressed")){
				numberedlistpressed = false;
                $("#td_numberedlist").removeClass("iconPressed");
				editor.put_ListType(1, -1);
            }
            else{
                $("#td_numberedlist").addClass("iconPressed");
				numberedlistpressed = true;
				if ($(this).attr("selecttype") != null && $(this).attr("selecttype") != undefined)
					changeListType($(this).attr("selecttype"))
				else 
					editor.put_ListType(1, 0);
            }
			break;
		case "td_paragraphMarks":
			if (editor.ShowParaMarks = (!editor.ShowParaMarks)) $(this).addClass("iconPressed"); else $(this).removeClass("iconPressed");
				editor.WordControl.OnRePaintAttack();
			break;
		case "td_tl_superscript":
			if ($(this).hasClass("iconPressed")){
				$(this).removeClass("iconPressed");
				editor.put_TextPrBaseline(0);
			}
			else{
				$(this).addClass("iconPressed");
                $("#td_tl_subscript").removeClass("iconPressed");
				editor.put_TextPrBaseline(1);
			}
			break;
		case "td_tl_subscript":
			if ($(this).hasClass("iconPressed")){
				$(this).removeClass("iconPressed");
				editor.put_TextPrBaseline(0);
			}
			else{
				$(this).addClass("iconPressed");
                $("#td_tl_superscript").removeClass("iconPressed");
				editor.put_TextPrBaseline(2);
			}
			break;	
		case "td_instbl":
			if ($(this).hasClass("iconPressed")){
				insttblpressed = true;
				$("#tblSelect").hide();
				$(this).removeClass("iconPressed")
			}
			else{
				insttblpressed = false;
				var offset=$("#td_instbl").offset();
				offset.top += $("#td_instbl").outerHeight() - 2;
				$("#tblSelect").css("top",offset.top);
				$("#tblSelect").show();
				$(this).addClass("iconPressed")
			}
			break;
		case "td_undo":
			editor.Undo();
			break;
		case "td_redo":
			editor.Redo();
			break;
        case "td_undo_ext":
        {
            document.getElementById("td_undo_actions").style.display = "block";
            break;
        }
		case "td_info":
			if (_gdi){
				editor.startGetDocInfo();
				_gdi = false;
			}
			else{
				editor.stopGetDocInfo();
				_gdi = true;
			}
			break;
		case "td_formatmodel":
			//console.log("td_formatmodel");
            editor.SetPaintFormat(true);
            //editor.SetViewMode(false);
			break;
	}
	
});

$(".cover-position").mouseleave(function(e){
	cellsForTable.columns = 0;
	cellsForTable.rows = 0;
	$(".hoverhighlight").hide();
	$("#countCells").text(cellsForTable.columns+"x"+cellsForTable.rows)
}).mousemove(function(e){
	evnt = e || window.event;

	x = evnt.offsetX || evnt.layerX;
	y = evnt.offsetY || evnt.layerY
	x = Math.ceil(x/18);
	y = Math.ceil(y/18);
	if (x<=0||y<=0)
		$(".hoverhighlight").hide();
	else{
		if(x<=Math.ceil($(".unhoverhighlight").width()/18) && y<=Math.ceil($(".unhoverhighlight").height()/18)){
			$(".hoverhighlight").show();
			$(".hoverhighlight").css({"width":x+"em","height":y+"em"});
			cellsForTable.columns = x;
			cellsForTable.rows = y;
			$("#countCells").text(x+"x"+y)
		}
	}
}).click(function(){
	$(".hoverhighlight").hide();
	$("#countCells").text(0+"x"+0)
	$("#td_instbl").removeClass("iconPressed")
	$("#tblSelect").hide();
		editor.put_Table(cellsForTable.columns, cellsForTable.rows,document.getElementById("inline_flow").checked);
});
elem = document.getElementById('myCanvas');
contextGrad = elem.getContext('2d');

// Get the canvas element.
if (!elem || !elem.getContext) {return;}
// Get the canvas 2d context.

if (!contextGrad) {return;}
contextGrad.fillStyle = "#EEF0F2";
contextGrad.fillRect(0, 0, elem.width, elem.height);
gradient = contextGrad.createLinearGradient(160, 0, 150, 128);
gradient.addColorStop(0, "rgb(255,255,255)");
gradient.addColorStop(1, "rgb(0,0,0)");
contextGrad.fillStyle = gradient;
contextGrad.fillRect(160, 0, 9, 128);
colorSelecterClick = false;

$("#colorSelectHolder").click(function(evnt,ui){
	if(colorSelecterClick){colorSelecterClick = false; return false;}
	$("#colorSelecter").offset({top:evnt.clientY-8,left:evnt.clientX-8});
	getColor(evnt.layerX,evnt.layerY);
	setCurrentColor(newColorSelected.r,newColorSelected.g,newColorSelected.b);
});

$("#dialogColorSelector").dialog({autoOpen: false, width :'350px', title: "Color Selector",
	create:function(){setCurrentColor(newColorSelected.r,newColorSelected.g,newColorSelected.b);
	var rgb;
			for(var i=0;  i<=128; i++){
				for(var j=0;  j<=128; j++){
					rgb = hslTorgb(340*j/128, 100, 50+50*i/128);
					contextGrad.fillStyle = "rgb("+rgb.r+","+rgb.g+","+rgb.b+")";
					contextGrad.fillRect(j, i, 1, 1);
				}
			}
	},
	resizable: false, modal: true, closeOnEscape:true,
	dragStop: function(event, ui) {
		$("#colorSelecter").draggable( "option", "containment", [$("#colorSelecter").offsetParent().offset().left,$("#colorSelecter").offsetParent().offset().top,
															$("#colorSelecter").offsetParent().offset().left+127,$("#colorSelecter").offsetParent().offset().top+127] );
		$("#gradSelecter").draggable( "option", "containment", [$("#gradSelecter").offsetParent().offset().left,$("#gradSelecter").offsetParent().offset().top+1,
															$("#gradSelecter").offsetParent().offset().left+127,$("#gradSelecter").offsetParent().offset().top+128] );},
	open: function() { 
		$("#redChannel").spinner({ min: 0, max: 255 }).change(function(){
			setColorFromRGB($("#redChannel").val(),$("#greenChannel").val(),$("#blueChannel").val());
			setCurrentColor(newColorSelected.r,newColorSelected.g,newColorSelected.b);
		});
		$("#greenChannel").spinner({ min: 0, max: 255 }).change(function(){
			setColorFromRGB($("#redChannel").val(),$("#greenChannel").val(),$("#blueChannel").val());
			setCurrentColor(newColorSelected.r,newColorSelected.g,newColorSelected.b);
		});
		$("#blueChannel").spinner({ min: 0, max: 255 }).change(function(){
			setColorFromRGB($("#redChannel").val(),$("#greenChannel").val(),$("#blueChannel").val());
			setCurrentColor(newColorSelected.r,newColorSelected.g,newColorSelected.b);
		});
		setLastColor(lastColorSelected.r,lastColorSelected.g,lastColorSelected.b); 
		$("#colorSelecter").draggable( "option", "containment", [$("#colorSelecter").offsetParent().offset().left,$("#colorSelecter").offsetParent().offset().top+1,
															$("#colorSelecter").offsetParent().offset().left+127,$("#colorSelecter").offsetParent().offset().top+127] );
		$("#gradSelecter").draggable( "option", "containment", [$("#gradSelecter").offsetParent().offset().left,$("#gradSelecter").offsetParent().offset().top+1,
															$("#gradSelecter").offsetParent().offset().left+127,$("#gradSelecter").offsetParent().offset().top+128] );
	},
	close: function() {
		$(".PopUpMenuStyle, .PopUpMenuStyle2, .options, .icon_options").hide();
		remIconPress();
	},
	buttons: [
	{
		text:"#ButtonOK",
		click: function(){
			lastColorSelected.r = newColorSelected.r;
			lastColorSelected.g = newColorSelected.g;
			lastColorSelected.b = newColorSelected.b;
			countCustomColor = $("#customColorFont").children()
			for (var i = countCustomColor.length-1; i >0; i--)
				$("#customColorFont").children()[i].children[0].style.backgroundColor = $("#customColorFont").children()[i-1].children[0].style.backgroundColor;
			$("#customColorFont").children()[0].children[0].style.backgroundColor = "rgb("+lastColorSelected.r+","+lastColorSelected.g+","+lastColorSelected.b+")";
			
			$(this).dialog("close");
			$("#customColorFont").children()[0].click();
		}
	},
	{
		text:"#ButtonCancel",
		click: function(){
			
			$(this).dialog("close");
		}
	}
	]
});

$("#gradSelecter").draggable({ zIndex: 2700,containment: [$("#gradSelecter").offsetParent().offset().left,$("#gradSelecter").offsetParent().offset().top+1,
															$("#gradSelecter").offsetParent().offset().left+127,$("#gradSelecter").offsetParent().offset().top+128],axis: 'y',
	drag:	function(event, ui) {
		gradSelectPosTop = ui.position.top
		getGradColor(gradSelectPosTop);
		setCurrentColor(newColorSelected.r,newColorSelected.g,newColorSelected.b);
	}
});

$("#colorSelecter").draggable({ zIndex: 2700,containment: [$("#colorSelecter").offsetParent().offset().left,$("#colorSelecter").offsetParent().offset().top+1,
															$("#colorSelecter").offsetParent().offset().left+127,$("#colorSelecter").offsetParent().offset().top+127],
	stop: 	function(event, ui) {
		getColor(ui.position.left,ui.position.top);
		colorSelecterClick = false;
		setCurrentColor(newColorSelected.r,newColorSelected.g,newColorSelected.b);
	},
	drag:	function(event, ui) {
		getColor(ui.position.left,ui.position.top);
		setCurrentColor(newColorSelected.r,newColorSelected.g,newColorSelected.b);
	}
});
$("#dialogNewColorOpen").click(function(){$("#dialogColorSelector").dialog("open")})
$("#dialogNewColorOpen, .none").mouseenter(function(){$(this).css({"background-color":"#4D81A5","color":"#fff"})}).mouseleave(function(){$(this).css({"background-color":"#fff","color":"#000"})})
color123 = new Color();
$(".colorWatch").mouseover(function(){
	color123.setHex(rgbCSS2hex($(this).css("background-color")));
	color123.setNamed(color123.calcNamedLAB())
	$(this).attr("title",color123.named.name);
})
//to init api callbacks in test menu
 setTimeout(function(){
	var __i;
	/*editor.asc_registerCallback("asc_onCursorLock", function(){
		console.log( "11111 "+arguments[0])
	})*/

	editor.asc_registerCallback("asc_onDocInfo", function(){
		var obj = arguments[0];
		$("#id_info").text(
			"PageCount: "+obj.get_PageCount()+", WordsCount: "+obj.get_WordsCount()+", ParagraphCount: "+obj.get_ParagraphCount()+", SymbolsCount: "+obj.get_SymbolsCount()+", SymbolsWSCount: "+obj.get_SymbolsWSCount()
		)
	});
	editor.asc_registerCallback("asc_onGetDocInfoStart", function(){
		var _s = ["-","\\","|","/"], _si = 0;
		__i = setInterval(function(){
			$("#id_doc_info_spinner").html(_s[_si]);
			_si++;
			_si = _si % 4;
		},200)
	});

    // searching
    window.SearchResult = new Array();
    editor.asc_registerCallback("asc_onSearchFound", function(){
        window.SearchResult[window.SearchResult.length] = arguments[0];
    });
    editor.asc_registerCallback("asc_onSearchStart", function(){
        if (0 != window.SearchResult.length)
            window.SearchResult.splice(0, window.SearchResult.length);
    });


	editor.asc_registerCallback("asc_onGetDocInfoStop", function(){
		clearInterval(__i);
		__i = null;
	});
	editor.asc_registerCallback("asc_onGetDocInfoEnd", function(){
		clearInterval(__i);
		__i = null;
	});
	editor.asc_registerCallback("asc_onError", function(){
		alert("Error.ID " + arguments[0] + " Error.Level " + arguments[1])
	});
	editor.asc_registerCallback("asc_onFontSize", function(){
		if (arguments[0] == undefined || arguments[0] == null || arguments[0]=="")
			$("#fontSizeSelectVal").text("");
		else $("#fontSizeSelectVal").text(arguments[0]+"pt");
	});
	editor.asc_registerCallback("asc_onParaStyleName", function(){
		if (arguments[0] == undefined || arguments[0] == null || arguments[0]=="")
			$("#fontFormatVal").text("");
		else $("#fontFormatVal").text(arguments[0]);
	});
	editor.asc_registerCallback("asc_onFontFamily", function(){
		var name = arguments[0].get_Name()
		if (name == undefined || name == null || name=="")
			$("#fontSelectVal").text("");
		else $("#fontSelectVal").text(name);
	});
	editor.asc_registerCallback("asc_onBold", function(){
		if(arguments[0])
			$(document.getElementById("td_bold")).addClass("iconPressed");
		else
			$(document.getElementById("td_bold")).removeClass("iconPressed");
	});
	editor.asc_registerCallback("asc_onItalic", function(){
		if(arguments[0])
			$(document.getElementById("td_italic")).addClass("iconPressed");
		else
			$(document.getElementById("td_italic")).removeClass("iconPressed");
	});
	editor.asc_registerCallback("asc_onUnderline", function(){
		if(arguments[0])
			$(document.getElementById("td_underline")).addClass("iconPressed");
		else
			$(document.getElementById("td_underline")).removeClass("iconPressed");
	});

     editor.asc_registerCallback("asc_onVerticalAlign", function()
     {
         switch(arguments[0])
         {
             case vertalign_Baseline:
             {
				$("#td_tl_subscript").removeClass("iconPressed");
				$("#td_tl_superscript").removeClass("iconPressed");
                 $("#prTextSubScript").checked   = false;
                 $("#prTextSuperScript").checked = false;
				break;
			}
             case vertalign_SubScript:
             {
				$("#td_tl_subscript").addClass("iconPressed");
				$("#td_tl_superscript").removeClass("iconPressed");
                 $("#prTextSubScript").checked   = true;
                 $("#prTextSuperScript").checked = false;
				break;
			}
             case vertalign_SuperScript:
             {
				$("#td_tl_subscript").removeClass("iconPressed");
				$("#td_tl_superscript").addClass("iconPressed");
                 $("#prTextSubScript").checked   = false;
                 $("#prTextSuperScript").checked = true;
				break;
			}
		}
	});

     editor.asc_registerCallback("asc_onTextSpacing", function()
     {
         var Value = arguments[0];
         if ( undefined === g_oTextPr.Spacing || Math.abs(g_oTextPr.Spacing - Value) > 0.001 )
         {
            $("#prTextSpacing").attr("value", Value);
             g_oTextPr.Spacing = Value;
         }
     });

     editor.asc_registerCallback("asc_onTextDStrikeout", function()
     {
         var Value = arguments[0];

         if ( g_oTextPr.DStrikeout != Value )
         {
             if ( true === Value )
             {
                 $("#prTextDStrikeout").attr("checked", true);
                 $("#prTextStrikeout").attr("checked", false);
             }
             else
                 $("#prTextDStrikeout").attr("checked", false);

             g_oTextPr.DStrikeout = Value;
         }
     });

     editor.asc_registerCallback("asc_onStrikeout", function()
     {
         var Value = arguments[0];

         if ( g_oTextPr.Strikeout != Value )
         {
             if ( true === Value )
             {
                 $("#prTextDStrikeout").attr("checked", false);
                 $("#prTextStrikeout").attr("checked", true);
             }
             else
                 $("#prTextStrikeout").attr("checked", false);

             g_oTextPr.Strikeout = Value;
         }
     });


     editor.asc_registerCallback("asc_onTextCaps", function()
     {
         var Value = arguments[0];

         if ( g_oTextPr.Caps != Value )
         {
             if ( true === Value )
             {
                 $("#prTextSmallCaps").attr("checked", false);
                 $("#prTextCaps").attr("checked", true);
             }
             else
                 $("#prTextCaps").attr("checked", false);

             g_oTextPr.Caps = Value;
         }
     });

     editor.asc_registerCallback("asc_onTextSmallCaps", function()
     {
         var Value = arguments[0];

         if ( g_oTextPr.SmallCaps != Value )
         {
             if ( true === Value )
             {
                 $("#prTextSmallCaps").attr("checked", true);
                 $("#prTextCaps").attr("checked", false);
             }
             else
                 $("#prTextSmallCaps").attr("checked", false);

             g_oTextPr.SmallCaps = Value;
         }
     });

     editor.asc_registerCallback("asc_onTextPosition", function()
     {
         var Value = arguments[0];

         if ( undefined === g_oTextPr.Position || Math.abs( g_oTextPr.Position - Value ) > 0.001 )
         {
            $("#prTextPosition").attr("value", Value);
             g_oTextPr.Position = Value;
         }
     });

	editor.asc_registerCallback("asc_onPrAlign", function(){
		$(document.getElementById("td_justifyleft")).removeClass("iconPressed");
		$(document.getElementById("td_justifycenter")).removeClass("iconPressed");
		$(document.getElementById("td_justifyright")).removeClass("iconPressed");
		$(document.getElementById("td_justifyblock")).removeClass("iconPressed");

		switch(arguments[0])
		{
			case align_Left:
				$(document.getElementById("td_justifyleft")).addClass("iconPressed");
				break;
			case align_Right:
				$(document.getElementById("td_justifyright")).addClass("iconPressed");
				break;
			case align_Center:
				$(document.getElementById("td_justifycenter")).addClass("iconPressed");
				break;
			case align_Justify:
				$(document.getElementById("td_justifyblock")).addClass("iconPressed");
				break;
		}
	});
	editor.asc_registerCallback("asc_onListType", function(){
		$(document.getElementById("td_numberedlist")).removeClass("iconPressed");
		$(document.getElementById("td_bulletedlist")).removeClass("iconPressed");

		if ( arguments[0].Type == 0 )
		{
			$(document.getElementById("td_bulletedlist")).addClass("iconPressed");
		}

		if ( arguments[0].Type == 1 )
		{
			$(document.getElementById("td_numberedlist")).addClass("iconPressed");
		}
	});
	editor.asc_registerCallback("asc_onClearPropObj", function(){
		$("#imgPropDrag, #imgProp, #tblPropDrag, #tblProp, #hafPropDrag, #hafProp, #prPropDrag, #prProp, #hyperPropDrag, #hyperProp").hide();
		clearPropObj = true;
		$("#imgH").val(0);
		$("#imgW").val(0);
		document.getElementById("imgWrapStyleInline").checked = false;
		document.getElementById("imgWrapStyleFlow").checked = false;
		$("#imgLeft").val(0);
		$("#imgTop").val(0);
		$("#imgBottom").val(0);
		$("#imgRight").val(0);
		$("#imgX").val(0);
		$("#imgY").val(0);
		

		document.getElementById("tblCellBrdTop").checked = 
		document.getElementById("tblCellBrdLeft").checked = 
		document.getElementById("tblCellBrdRight").checked =
		document.getElementById("tblCellBrdBottom").checked =
		document.getElementById("tblCellBrdInsideV").checked =
		document.getElementById("tblCellBrdInsideH").checked = 
		document.getElementById("tblBrdLeft").checked = 
		document.getElementById("tblBrdTop").checked = 
		document.getElementById("tblBrdRight").checked = 
		document.getElementById("tblBrdBottom").checked = 
		document.getElementById("tblBrdInsideV").checked = 
		document.getElementById("tblBrdInsideH").checked = 
		document.getElementById("tblWOn").checked = 
		document.getElementById("tblAllowSpacing").checked = 
		document.getElementById("tblAlignLeft").checked = 
		document.getElementById("tblAlignCenter").checked = 
		document.getElementById("tblAlignRight").checked = 
		document.getElementById("tblCellBrdBGColorTran").checked = 
		document.getElementById("tblBrdBGColorTran").checked = 
		document.getElementById("tblWrapStyle1").checked = 
		document.getElementById("tblWrapStyle2").checked = false;
        document.getElementById("imgPositionHAlignRadio").checked = true;
        document.getElementById("imgPositionHPosRadio").checked = false;


		document.getElementById("tblMarLeft").value =
		document.getElementById("tblMarTop").value = 
		document.getElementById("tblMarRight").value = 
		document.getElementById("tblMarBottom").value =
		document.getElementById("tblDefMarLeft").value = 
		document.getElementById("tblDefMarTop").value = 
		document.getElementById("tblDefMarRight").value = 
		document.getElementById("tblDefMarBottom").value =
		document.getElementById("tblLeft").value = 
		document.getElementById("tblTop").value = 
		document.getElementById("tblRight").value = 
		document.getElementById("tblBottom").value = 
		document.getElementById("tblIndentLeft").value = 
		document.getElementById("tblLeft").value = 
		document.getElementById("tblTop").value = 
		document.getElementById("tblRight").value = 
		document.getElementById("tblBottom").value = 
        document.getElementById("tblX").value =
        document.getElementById("tblY").value =
		document.getElementById("tblCS").value = 
		document.getElementById("tblW").value = "null";
		
		document.getElementById("hafHF").value = 
		document.getElementById("prLineHeight").value = 
		document.getElementById("prAfter").value = 
		document.getElementById("prBefore").value = 
		document.getElementById("prFirst").value = 
		document.getElementById("prLeft").value = 
		document.getElementById("prRight").value = ""
		
		$("#hafType").html("")
		document.getElementById("hafFP").checked = false;
		document.getElementById("hafOE").checked = false;
	})
     editor.asc_registerCallback("asc_onPageOrient", function()
     {
         var bPortrait = arguments[0];
         if ( false === bPortrait )
         {
             $("#td_orient").addClass("iconPressed");
         }
         else
         {
             $("#td_orient").removeClass("iconPressed");
         }
     });
     editor.asc_registerCallback("asc_onCanUndo", function()
     {
         var bCanUndo = arguments[0];

         if ( false === bCanUndo )
         {
             $("#td_undo_td").removeClass("ToolbarIconOut");
             $("#td_undo_td").addClass("ToolbarIconOut2");
             $("#td_undo_img").addClass("ToolbarUndoD");
             $("#td_undo_img").removeClass("ToolbarUndo");
         }
         else
         {
             $("#td_undo_td").removeClass("ToolbarIconOut2");
             $("#td_undo_td").addClass("ToolbarIconOut");
             $("#td_undo_img").addClass("ToolbarUndo");
             $("#td_undo_img").removeClass("ToolbarUndoD");
         }
     });
     editor.asc_registerCallback("asc_onCanRedo", function()
     {
         var bCanRedo = arguments[0];

         if ( false === bCanRedo )
         {
             $("#td_redo_td").removeClass("ToolbarIconOut");
             $("#td_redo_td").addClass("ToolbarIconOut2");
             $("#td_redo_img").addClass("ToolbarRedoD");
             $("#td_redo_img").removeClass("ToolbarRedo");
         }
         else
         {
             $("#td_redo_td").removeClass("ToolbarIconOut2");
             $("#td_redo_td").addClass("ToolbarIconOut");
             $("#td_redo_img").addClass("ToolbarRedo");
             $("#td_redo_img").removeClass("ToolbarRedoD");
         }
     });

     editor.asc_registerCallback("asc_onCanAddHyperlink", function()
     {
         var bCanAdd = arguments[0];
         if ( false === bCanAdd )
         {
             $("#td_link_td").removeClass("ToolbarIconOut");
             $("#td_link_td").addClass("ToolbarIconOut2");
             $("#td_link_img").addClass("ToolbarLinkD");
             $("#td_link_img").removeClass("ToolbarLink");
         }
         else
         {
             $("#td_link_td").removeClass("ToolbarIconOut2");
             $("#td_link_td").addClass("ToolbarIconOut");
             $("#td_link_img").addClass("ToolbarLink");
             $("#td_link_img").removeClass("ToolbarLinkD");
         }
     });

     editor.asc_registerCallback("asc_onChangeCommentData", function()
     {
         var Id = arguments[0];
         var CommentData = arguments[1];

         Comment_OnChange_CommentData( Id, CommentData );
     });

     editor.asc_registerCallback("asc_onAddComment", function()
     {
         var Id = arguments[0];
         var CommentData = arguments[1];

         Comment_OnChange_CommentData( Id, CommentData );

         editor.asc_selectComment( Id );
         editor.asc_showComment( Id );
     });

     editor.asc_registerCallback("asc_onRemoveComment", function()
     {
         var Id = arguments[0];
         var Comments = document.getElementById("comments");
         var Comment = document.getElementById( "comment_" + Id );

         if ( null != Comment )
             Comments.removeChild( Comment );
     });

     editor.asc_registerCallback("asc_onShowComment", function()
     {
         var Id = arguments[0];
         var X  = arguments[1];
         var Y  = arguments[2];

         Comment_ShowCurrentComment( Id, X, Y );
     });

     editor.asc_registerCallback("asc_onHideComment", function()
     {
         Comment_HideCurrentComment();
     });

     editor.asc_registerCallback("asc_onUpdateCommentPosition", function()
     {
         var Id = arguments[0];
         var X  = arguments[1];
         var Y  = arguments[2];

         Comment_UpdateCurrentComment( X, Y );
     });

     editor.asc_registerCallback("asc_onLockComment", function()
     {
         var Id = arguments[0];
         Comment_LockComment( Id );
     });

     editor.asc_registerCallback("asc_onUnLockComment", function()
     {
         var Id = arguments[0];
         Comment_UnLockComment( Id );
     });

     editor.asc_registerCallback("asc_onMouseMoveStart", function()
     {
         for ( var Index = 0; Index < g_arrLockedInfo.length; Index++ )
         {
             document.getElementById("id_main").removeChild( g_arrLockedInfo[Index] );
         }

         g_arrLockedInfo.length = 0;
     });

     editor.asc_registerCallback("asc_onMouseMove", function()
     {
         var Data = arguments[0];
         Hyperlink_Hide();

         switch(Data.Type)
         {
             case c_oAscMouseMoveDataTypes.Hyperlink:
             {
                 var Hyperlink = Data.Hyperlink;
                 var ToolTip = (Hyperlink.get_ToolTip() === null ? Hyperlink.get_Value() : Hyperlink.get_ToolTip() );
                 var X = Data.X_abs, Y = Data.Y_abs;
                 Hyperlink_Show( X, Y, ToolTip );
                 sendStatus(Data.Hyperlink.get_Value());
                 break;
             }
             case c_oAscMouseMoveDataTypes.LockedObject:
             {
                 var X = Data.X_abs, Y = Data.Y_abs;
                 var sTop = Y + "px", sLeft = X - 50 + "px", sSize = "50px";

                 var NewElement = document.createElement("div");

                 NewElement.style.color = "white";
                 NewElement.innerText = "" + Data.UserId;
                 NewElement.style.position = "absolute";
                 NewElement.style.backgroundColor = "red";
                 NewElement.style.zIndex = 100;

                 if ( Data.LockedObjectType === c_oAscMouseMoveLockedObjectType.Footer )
                     sTop = (Y - 20) + "px";

                 NewElement.style.top  = sTop;
                 NewElement.style.left = sLeft;
                 NewElement.style.width  = sSize;
                 NewElement.style.height = "20px";

                 document.getElementById("id_main").appendChild( NewElement );
                 g_arrLockedInfo.push( NewElement );

                 if ( true === Data.HaveChanges )
                 {
                     sLeft = X - 50 - 20 + "px", sSize = "50px";
                     var NewElement1 = document.createElement("img");

                     NewElement1.style.position = "absolute";
                     NewElement1.style.zIndex = 100;
                     NewElement1.style.top  = sTop;
                     NewElement1.style.left = sLeft;
                     NewElement1.src = "menu//img//refresh.png";

                     document.getElementById("id_main").appendChild( NewElement1 );
                     g_arrLockedInfo.push( NewElement1 );
                 }

                 break;
             }
         }

     });

     editor.asc_registerCallback("asc_onDialogAddHyperlink", function()
     {
         Menu_Hyperlink_Add();
     });

     editor.asc_registerCallback("asc_onContextMenu", function()
     {
         var Data = arguments[0];
         var X = Data.X_abs, Y = Data.Y_abs;

         Menu_ContextMenu_Show( X, Y );
     });

     editor.asc_registerCallback("asc_onCollaborativeChanges", function()
     {
         sendStatus( "There're some changed to be updated" );
     });

     $("#hafFP").click(function(){
		editor.HeadersAndFooters_DifferentFirstPage(document.getElementById ("hafFP").checked);
	})
	$("#prIntervBetween").click(function(){
		editor.put_AddSpaceBetweenPrg(document.getElementById("prIntervBetween").checked);
	})	
	$("#prKeepLines").click(function(){
		editor.put_KeepLines(document.getElementById("prKeepLines").checked);
	})	
	$("#prPageBreak").click(function(){
		editor.put_PageBreak(document.getElementById("prPageBreak").checked);
	})
	
	$("#hafOE").click(function(){
		editor.HeadersAndFooters_DifferentOddandEvenPage(document.getElementById ("hafOE").checked);
	})
	$("#hafHF").keypress(function(evt){
		evt = evt || window.event;
		if (evt.keyCode == 13){
			editor.put_HeadersAndFootersDistance(parseFloat($("#hafHF").val()))
		}
	})
	$("#prFirst").keypress(function(evt){
		evt = evt || window.event;
		if (evt.keyCode == 13){
			editor.put_PrFirstLineIndent(parseFloat($("#prFirst").val()))
		}
	})	
	$("#prLeft").keypress(function(evt){
		evt = evt || window.event;
		if (evt.keyCode == 13){
			editor.put_PrIndent(parseFloat($("#prLeft").val()))
		}
	})	
	$("#prRight").keypress(function(evt){
		evt = evt || window.event;
		if (evt.keyCode == 13){
			editor.put_PrIndentRight(parseFloat($("#prRight").val()))
		}
	})
	$("#prLineHeight").keypress(function(evt)
    {
		evt = evt || window.event;
		if (evt.keyCode == 13)
        {
            var Type = linerule_Auto;
            switch ( document.getElementById("prLineRule").selectedIndex )
            {
                case 1:
                    Type = linerule_AtLeast;
                    break;
                case 2:
                    Type = linerule_Exact;
                    break;
            }

            editor.put_PrLineSpacing(Type, parseFloat($("#prLineHeight").val()))
		}
	})
     $("#prLineRule").change(function()
     {
         var Type = linerule_Auto;
         switch ( document.getElementById("prLineRule").selectedIndex )
         {
             case 0:
                 document.getElementById("prLineHeight").value = "1.15";
                 break;
             case 1:
                 Type = linerule_AtLeast;
                 document.getElementById("prLineHeight").value = "0.5";
                 break;
             case 2:
                 Type = linerule_Exact;
                 document.getElementById("prLineHeight").value = "0.5";
                 break;
         }

         editor.put_PrLineSpacing( Type, parseFloat(document.getElementById("prLineHeight").value) );
     })
	$("#prAfter").keypress(function(evt)
    {
		evt = evt || window.event;
		if (evt.keyCode == 13)
        {
            var Value = $("#prAfter").val();
            var nValue = parseFloat(Value);

            if ( "auto" === Value || "Auto" === Value )
                editor.put_LineSpacingBeforeAfter( 1, spacing_Auto );
            else
			    editor.put_LineSpacingBeforeAfter( 1, nValue );
		}
	})	
	$("#prBefore").keypress(function(evt)
    {
		evt = evt || window.event;
		if (evt.keyCode == 13)
        {
            var Value = $("#prBefore").val();
            var nValue = parseFloat(Value);

            if ( "auto" === Value || "Auto" === Value )
                editor.put_LineSpacingBeforeAfter( 0, spacing_Auto );
            else
                editor.put_LineSpacingBeforeAfter( 0, nValue );
		}
	})

     $("#prTextStrikeout").change(function(evt)
     {
         if ( true === this.checked  )
            editor.put_TextPrStrikeout( true );
         else
            editor.put_TextPrStrikeout( false );
     })

     $("#prTextDStrikeout").change(function(evt)
     {
         if ( true === this.checked  )
             editor.put_TextPrDStrikeout( true );
         else
             editor.put_TextPrDStrikeout( false );
     })

     $("#prTextSubScript").change(function(evt)
     {
         if ( true === this.checked  )
             editor.put_TextPrBaseline(2);
         else
             editor.put_TextPrBaseline(0);
     })

     $("#prTextSuperScript").change(function(evt)
     {
         if ( true === this.checked  )
             editor.put_TextPrBaseline(1);
         else
             editor.put_TextPrBaseline(0);
     })

     $("#prTextSmallCaps").change(function(evt)
     {
         if ( true === this.checked  )
             editor.put_TextPrSmallCaps( true );
         else
             editor.put_TextPrSmallCaps( false );
     })

     $("#prTextCaps").change(function(evt)
     {
         if ( true === this.checked  )
             editor.put_TextPrCaps( true );
         else
             editor.put_TextPrCaps( false );
     })

     $("#prTextSpacing").keypress(function(evt)
     {
         evt = evt || window.event;
         if (evt.keyCode == 13)
         {
             editor.put_TextPrSpacing(parseFloat($("#prTextSpacing").val()));
         }
     })

     $("#prTextPosition").keypress(function(evt)
     {
         evt = evt || window.event;
         if (evt.keyCode == 13)
         {
             editor.put_TextPrPosition(parseFloat($("#prTextPosition").val()));
         }
     })

     $("#prTextPosition").keypress(function(evt)
     {
         evt = evt || window.event;
         if (evt.keyCode == 13)
         {
             editor.put_TextPrPosition(parseFloat($("#prTextPosition").val()));
         }
     })

     $("#tblStyle").change(function(evt)
     {
         var Styles = editor.WordControl.m_oLogicDocument.Styles;
         var TableStyleId = null;
         switch ( this.selectedIndex )
         {
             case 0: TableStyleId = Styles.Get_StyleIdByName( "Table Grid" ); break;
             case 1: TableStyleId = Styles.Get_StyleIdByName( "LightShading" ); break;
             case 2: TableStyleId = Styles.Get_StyleIdByName( "ColorfulListAccent6" ); break;
         }

         editor.tblApply( { TableStyle : TableStyleId } );
     })

     $("#tblLookFirstRow, #tblLookLastRow, #tblLookFirstCol, #tblLookLastCol, #tblLookHorBand, #tblLookVerBand,").change(function(evt)
     {
         var TableLook =
         {
             FirstRow : document.getElementById("tblLookFirstRow").checked,
             FirstCol : document.getElementById("tblLookFirstCol").checked,
             LastRow : document.getElementById("tblLookLastRow").checked,
             LastCol : document.getElementById("tblLookLastCol").checked,
             HorBand : document.getElementById("tblLookHorBand").checked,
             VerBand : document.getElementById("tblLookVerBand").checked
         };

         editor.tblApply( { TableLook : TableLook } );
     })

	editor.asc_registerCallback("asc_onHeadersAndFootersProp", function(){
		$("#hafProp").show();
		$("#hafHF").val(arguments[0].Position);
		document.getElementById("hafFP").checked = arguments[0].DifferentFirst;
		document.getElementById("hafOE").checked = arguments[0].DifferentEvenOdd;
		if (arguments[0].get_ObjectType() == hdrftr_Footer)
			$("#hafType").html("We in Footer")
		else if (arguments[0].get_ObjectType() == hdrftr_Header)	
			$("#hafType").html("We in header")
	})
    editor.asc_registerCallback("asc_onPaintFormatChanged", function(value){
         // отжать/нажать кнопку
    })
	editor.asc_registerCallback("asc_onFocusObject", function(){

        g_oToolBox.Disable_Props();

		var arg = arguments[0];
		for (var i = 0; i < arg.length;i++){
			var elemArg = arg[i];
			if ( elemArg != undefined )
			{
				var ObjectType = elemArg.get_ObjectType();
				if ( ObjectType == c_oAscTypeSelectElement.Image)
                {
                    g_oToolBox.Enable_Image();

                    Drag.init( document.getElementById("imgPropDrag") );
                    document.getElementById("imgPropDrag").onDrag = function(X, Y)
                    {
                        var sTop = Y + 30 + "px", sLeft = X + "px";
                        document.getElementById("imgProp").style.top  = sTop;
                        document.getElementById("imgProp").style.left = sLeft;
                    };

                    var elemVal = elemArg.get_ObjectValue();

                    g_oImagePr = elemVal;

                    var Caption = "";
                    if ( elemVal.Locked )
                        Caption = "\<b\>IMAGE\</b\>\<span style=\"color:red;\"\>(locked)\</span\>";
                    else
                        Caption = "\<b\>IMAGE\</b\>";

                    if (document.getElementById("imgPropDragCaption").innerHTML)
                        document.getElementById("imgPropDragCaption").innerHTML = Caption;
                    else
                        document.getElementById("imgPropDragCaption").innerText = Caption;

                    if ( false === elemVal.CanBeFlow )
                        document.getElementById("imgWrapStyleFlow").disabled = "disabled";
                    else
                        document.getElementById("imgWrapStyleFlow").disabled = 0;

                    if ( true === g_oToolBox.Image.Active )
                    {
                        $("#imgPropDrag").show();
                        $("#imgProp").show();
                    }

					$("#imgH").val(elemVal.get_Height());
					$("#imgW").val(elemVal.get_Width());

					if (elemVal.get_WrappingStyle() == c_oAscWrapStyle.Inline)
                    {
						document.getElementById("imgWrapStyleInline").checked = true;
						document.getElementById("imgWrapStyleFlow").checked = false;
                        Image_UpdateImageInlineOrFlow(false);
					}
					else if (elemVal.get_WrappingStyle() == c_oAscWrapStyle.Flow)
                    {
						document.getElementById("imgWrapStyleInline").checked = false;
						document.getElementById("imgWrapStyleFlow").checked = true;
                        Image_UpdateImageInlineOrFlow(false);

                        if (elemVal.get_Paddings())
                        {
						$("#imgLeft").val(elemVal.get_Paddings().get_Left());
						$("#imgTop").val(elemVal.get_Paddings().get_Top());
						$("#imgBottom").val(elemVal.get_Paddings().get_Bottom());
						$("#imgRight").val(elemVal.get_Paddings().get_Right());
					}
                        else
                        {
						$("#imgLeft").val("");
						$("#imgTop").val("");
						$("#imgBottom").val("");
						$("#imgRight").val("");
					}


					var pos = elemVal.get_Position();
                        if (pos)
                        {
						$("#imgX").val(pos.get_X());
						$("#imgY").val(pos.get_Y());
					}
                        else
                        {
						$("#imgX").val("");
                            $("#imgY").val("");
					}

                        var oPosH = elemVal.get_PositionH();
                        if ( oPosH.UseAlign )
                        {
                            document.getElementById("imgPositionHAlignRadio").checked = true;
                            document.getElementById("imgPositionHPosRadio").checked   = false;
                            Image_UpdateImagePositionH();

                            var AlignH = oPosH.get_Align();
                            switch ( AlignH )
                            {
                                case c_oAscAlignH.Center  : document.getElementById("imgPositionHAlignValueCombo").selectedIndex = 1; break;
                                case c_oAscAlignH.Inside  : document.getElementById("imgPositionHAlignValueCombo").selectedIndex = 0; break;
                                case c_oAscAlignH.Left    : document.getElementById("imgPositionHAlignValueCombo").selectedIndex = 0; break;
                                case c_oAscAlignH.Outside : document.getElementById("imgPositionHAlignValueCombo").selectedIndex = 2; break;
                                case c_oAscAlignH.Right   : document.getElementById("imgPositionHAlignValueCombo").selectedIndex = 2; break;
                            }

                            var RelFrom = oPosH.get_RelativeFrom();
                            switch( RelFrom )
                            {
                                case c_oAscRelativeFromH.Character     : document.getElementById("imgPositionHAlignTypeCombo").selectedIndex = 3; break;
                                case c_oAscRelativeFromH.Column        : document.getElementById("imgPositionHAlignTypeCombo").selectedIndex = 2; break;
                                case c_oAscRelativeFromH.InsideMargin  : document.getElementById("imgPositionHAlignTypeCombo").selectedIndex = 4; break;
                                case c_oAscRelativeFromH.LeftMargin    : document.getElementById("imgPositionHAlignTypeCombo").selectedIndex = 4; break;
                                case c_oAscRelativeFromH.Margin        : document.getElementById("imgPositionHAlignTypeCombo").selectedIndex = 0; break;
                                case c_oAscRelativeFromH.OutsideMargin : document.getElementById("imgPositionHAlignTypeCombo").selectedIndex = 5; break;
                                case c_oAscRelativeFromH.Page          : document.getElementById("imgPositionHAlignTypeCombo").selectedIndex = 1; break;
                                case c_oAscRelativeFromH.RightMargin   : document.getElementById("imgPositionHAlignTypeCombo").selectedIndex = 5; break;
                            }
                        }
                        else
                        {
                            document.getElementById("imgPositionHAlignRadio").checked = false;
                            document.getElementById("imgPositionHPosRadio").checked   = true;
                            Image_UpdateImagePositionH();

                            document.getElementById("imgPositionHPosValueCombo").value = oPosH.get_Value();

                            var RelFrom = oPosH.get_RelativeFrom();
                            switch( RelFrom )
                            {
                                case c_oAscRelativeFromH.Character     : document.getElementById("imgPositionHPosTypeCombo").selectedIndex = 3; break;
                                case c_oAscRelativeFromH.Column        : document.getElementById("imgPositionHPosTypeCombo").selectedIndex = 2; break;
                                case c_oAscRelativeFromH.InsideMargin  : document.getElementById("imgPositionHPosTypeCombo").selectedIndex = 4; break;
                                case c_oAscRelativeFromH.LeftMargin    : document.getElementById("imgPositionHPosTypeCombo").selectedIndex = 4; break;
                                case c_oAscRelativeFromH.Margin        : document.getElementById("imgPositionHPosTypeCombo").selectedIndex = 0; break;
                                case c_oAscRelativeFromH.OutsideMargin : document.getElementById("imgPositionHPosTypeCombo").selectedIndex = 5; break;
                                case c_oAscRelativeFromH.Page          : document.getElementById("imgPositionHPosTypeCombo").selectedIndex = 1; break;
                                case c_oAscRelativeFromH.RightMargin   : document.getElementById("imgPositionHPosTypeCombo").selectedIndex = 5; break;
                            }
                        }

                        var oPosV = elemVal.get_PositionV();
                        if ( oPosV.UseAlign )
                        {
                            document.getElementById("imgPositionVAlignRadio").checked = true;
                            document.getElementById("imgPositionVPosRadio").checked   = false;
                            Image_UpdateImagePositionV();

                            var AlignV = oPosV.get_Align();
                            switch( AlignV )
                            {
                                case c_oAscAlignV.Bottom  : document.getElementById("imgPositionVAlignValueCombo").selectedIndex = 2; break;
                                case c_oAscAlignV.Center  : document.getElementById("imgPositionVAlignValueCombo").selectedIndex = 1; break;
                                case c_oAscAlignV.Inside  : document.getElementById("imgPositionVAlignValueCombo").selectedIndex = 0; break;
                                case c_oAscAlignV.Outside : document.getElementById("imgPositionVAlignValueCombo").selectedIndex = 2; break;
                                case c_oAscAlignV.Top     : document.getElementById("imgPositionVAlignValueCombo").selectedIndex = 0; break;
                            }

                            var RelFrom = oPosV.get_RelativeFrom();
                            switch( RelFrom )
                            {
                                case c_oAscRelativeFromV.BottomMargin  : document.getElementById("imgPositionVAlignTypeCombo").selectedIndex = 4; break;
                                case c_oAscRelativeFromV.InsideMargin  : document.getElementById("imgPositionVAlignTypeCombo").selectedIndex = 3; break;
                                case c_oAscRelativeFromV.Line          : document.getElementById("imgPositionVAlignTypeCombo").selectedIndex = 2; break;
                                case c_oAscRelativeFromV.Margin        : document.getElementById("imgPositionVAlignTypeCombo").selectedIndex = 0; break;
                                case c_oAscRelativeFromV.OutsideMargin : document.getElementById("imgPositionVAlignTypeCombo").selectedIndex = 4; break;
                                case c_oAscRelativeFromV.Page          : document.getElementById("imgPositionVAlignTypeCombo").selectedIndex = 1; break;
                                case c_oAscRelativeFromV.TopMargin     : document.getElementById("imgPositionVAlignTypeCombo").selectedIndex = 3; break;
                            }
                        }
                        else
                        {
                            document.getElementById("imgPositionVAlignRadio").checked = false;
                            document.getElementById("imgPositionVPosRadio").checked   = true;
                            Image_UpdateImagePositionV();

                            document.getElementById("imgPositionVPosValueCombo").value = oPosV.get_Value();

                            var RelFrom = oPosV.get_RelativeFrom();
                            switch( RelFrom )
                            {
                                case c_oAscRelativeFromV.BottomMargin  : document.getElementById("imgPositionVPosTypeCombo").selectedIndex = 5; break;
                                case c_oAscRelativeFromV.InsideMargin  : document.getElementById("imgPositionVPosTypeCombo").selectedIndex = 4; break;
                                case c_oAscRelativeFromV.Line          : document.getElementById("imgPositionVPosTypeCombo").selectedIndex = 3; break;
                                case c_oAscRelativeFromV.Margin        : document.getElementById("imgPositionVPosTypeCombo").selectedIndex = 0; break;
                                case c_oAscRelativeFromV.OutsideMargin : document.getElementById("imgPositionVPosTypeCombo").selectedIndex = 5; break;
                                case c_oAscRelativeFromV.Page          : document.getElementById("imgPositionVPosTypeCombo").selectedIndex = 1; break;
                                case c_oAscRelativeFromV.Paragraph     : document.getElementById("imgPositionVPosTypeCombo").selectedIndex = 2; break;
                                case c_oAscRelativeFromV.TopMargin     : document.getElementById("imgPositionVPosTypeCombo").selectedIndex = 4; break;
                            }
                        }
					}

					if (elemVal.get_ImageUrl())
						$("#imgURL").val(elemVal.get_ImageUrl());
				}
				else if ( ObjectType == c_oAscTypeSelectElement.Table)
                {
                    g_oToolBox.Enable_Table();

                    Drag.init( document.getElementById("tblPropDrag"), null, null, null, null, null, true );
                    document.getElementById("tblPropDrag").onDrag = function(X, Y)
                    {
                        var sTop = Y + 30 + "px", sRight = X + "px";
                        document.getElementById("tblProp").style.top   = sTop;
                        document.getElementById("tblProp").style.right = sRight;
                    };

                    if ( true === g_oToolBox.Table.Active )
                    {
                        $("#tblPropDrag").show();
                        $("#tblProp").show();
                    }

                    var elemVal = elemArg.get_ObjectValue();
                    g_oTablePr = elemVal;

                    var Caption = "";
                    if ( elemVal.Locked )
                        Caption = "\<b\>Table\</b\>\<span style=\"color:red;\"\>(locked)\</span\>";
                    else
                        Caption = "\<b\>Table\</b\>";

                    if (document.getElementById("tblPropDragCaption").innerHTML)
                        document.getElementById("tblPropDragCaption").innerHTML = Caption;
                    else
                        document.getElementById("tblPropDragCaption").innerText = Caption;

                    var oPosH = elemVal.get_PositionH();
                    if ( undefined != oPosH )
                    {
                        if ( oPosH.UseAlign )
                        {
                            document.getElementById("tblPositionHAlignRadio").checked = true;
                            document.getElementById("tblPositionHPosRadio").checked   = false;
                            Table_UpdateTablePositionH();

                            var AlignH = oPosH.get_Align();
                            switch ( AlignH )
                            {
                                case c_oAscXAlign.Center  : document.getElementById("tblPositionHAlignValueCombo").selectedIndex = 1; break;
                                case c_oAscXAlign.Inside  : document.getElementById("tblPositionHAlignValueCombo").selectedIndex = 0; break;
                                case c_oAscXAlign.Left    : document.getElementById("tblPositionHAlignValueCombo").selectedIndex = 0; break;
                                case c_oAscXAlign.Outside : document.getElementById("tblPositionHAlignValueCombo").selectedIndex = 2; break;
                                case c_oAscXAlign.Right   : document.getElementById("tblPositionHAlignValueCombo").selectedIndex = 2; break;
                            }

                            var RelFrom = oPosH.get_RelativeFrom();
                            switch( RelFrom )
                            {
                                case c_oAscHAnchor.Margin : document.getElementById("tblPositionHAlignTypeCombo").selectedIndex = 0; break;
                                case c_oAscHAnchor.Page   : document.getElementById("tblPositionHAlignTypeCombo").selectedIndex = 1; break;
                                case c_oAscHAnchor.Text   : document.getElementById("tblPositionHAlignTypeCombo").selectedIndex = 2; break;
                            }
                        }
                        else
                        {
                            document.getElementById("tblPositionHAlignRadio").checked = false;
                            document.getElementById("tblPositionHPosRadio").checked   = true;
                            Table_UpdateTablePositionH();

                            document.getElementById("tblPositionHPosValueCombo").value = oPosH.get_Value();

                            var RelFrom = oPosH.get_RelativeFrom();
                            switch( RelFrom )
                            {
                                case c_oAscHAnchor.Margin : document.getElementById("tblPositionHPosTypeCombo").selectedIndex = 0; break;
                                case c_oAscHAnchor.Page   : document.getElementById("tblPositionHPosTypeCombo").selectedIndex = 1; break;
                                case c_oAscHAnchor.Text   : document.getElementById("tblPositionHPosTypeCombo").selectedIndex = 2; break;
                            }
                        }
                    }

                    var oPosV = elemVal.get_PositionV();
                    if ( undefined != oPosV )
                    {
                        if ( oPosV.UseAlign )
                        {
                            document.getElementById("tblPositionVAlignRadio").checked = true;
                            document.getElementById("tblPositionVPosRadio").checked   = false;
                            Table_UpdateTablePositionV();

                            var AlignV = oPosV.get_Align();
                            switch( AlignV )
                            {
                                case c_oAscYAlign.Bottom  : document.getElementById("tblPositionVAlignValueCombo").selectedIndex = 2; break;
                                case c_oAscYAlign.Center  : document.getElementById("tblPositionVAlignValueCombo").selectedIndex = 1; break;
                                case c_oAscYAlign.Inline  : document.getElementById("tblPositionVAlignValueCombo").selectedIndex = 0; break;
                                case c_oAscYAlign.Inside  : document.getElementById("tblPositionVAlignValueCombo").selectedIndex = 0; break;
                                case c_oAscYAlign.Outside : document.getElementById("tblPositionVAlignValueCombo").selectedIndex = 2; break;
                                case c_oAscYAlign.Top     : document.getElementById("tblPositionVAlignValueCombo").selectedIndex = 0; break;
                            }

                            var RelFrom = oPosV.get_RelativeFrom();
                            switch( RelFrom )
                            {
                                case c_oAscVAnchor.Margin : document.getElementById("tblPositionVAlignTypeCombo").selectedIndex = 0; break;
                                case c_oAscVAnchor.Page   : document.getElementById("tblPositionVAlignTypeCombo").selectedIndex = 1; break;
                                case c_oAscVAnchor.Text   : document.getElementById("tblPositionVAlignTypeCombo").selectedIndex = 2; break;
                            }
                        }
                        else
                        {
                            document.getElementById("tblPositionVAlignRadio").checked = false;
                            document.getElementById("tblPositionVPosRadio").checked   = true;
                            Table_UpdateTablePositionV();

                            document.getElementById("tblPositionVPosValueCombo").value = oPosV.get_Value();

                            var RelFrom = oPosV.get_RelativeFrom();
                            switch( RelFrom )
                            {
                                case c_oAscVAnchor.Margin : document.getElementById("tblPositionVPosTypeCombo").selectedIndex = 0; break;
                                case c_oAscVAnchor.Page   : document.getElementById("tblPositionVPosTypeCombo").selectedIndex = 1; break;
                                case c_oAscVAnchor.Text   : document.getElementById("tblPositionVPosTypeCombo").selectedIndex = 2; break;
                            }
                        }
                    }

                    if ( undefined != elemVal.TableStyle )
                    {
                        var Styles = editor.WordControl.m_oLogicDocument.Styles;
                        var StyleName = Styles.Get_Name( elemVal.TableStyle );

                        if ( "Table Grid" === StyleName )
                        {
                            document.getElementById("tblStyle").selectedIndex = 0;
                        }
                        else if ( "LightShading" === StyleName )
                        {
                            document.getElementById("tblStyle").selectedIndex = 1;
                        }
                        else if ( "ColorfulListAccent6" === StyleName )
                        {
                            document.getElementById("tblStyle").selectedIndex = 2;
                        }
                    }

                    if ( undefined != elemVal.RowsInHeader )
                        document.getElementById("tblHeaderRowsCount").value = elemVal.RowsInHeader;
                    else
                        document.getElementById("tblHeaderRowsCount").value = elemVal.RowsInHeader;

                    if ( undefined != elemVal.TableLook )
                    {
                        document.getElementById("tblLookFirstRow").checked = elemVal.TableLook.FirstRow;
                        document.getElementById("tblLookFirstCol").checked = elemVal.TableLook.FirstCol;
                        document.getElementById("tblLookLastRow").checked  = elemVal.TableLook.LastRow;
                        document.getElementById("tblLookLastCol").checked  = elemVal.TableLook.LastCol;
                        document.getElementById("tblLookHorBand").checked  = elemVal.TableLook.HorBand;
                        document.getElementById("tblLookVerBand").checked  = elemVal.TableLook.VerBand;
                    }

					if ( elemVal.TableWidth != null && elemVal.TableWidth != undefined )
                    {
						document.getElementById("tblWOn").checked = true;
						document.getElementById("tblW").value = elemVal.TableWidth;
					}
					else
                    {
						document.getElementById("tblWOn").checked = false;
						document.getElementById("tblW").value = 0;
					}
                    Table_AllowWidth_OnChange();

					if (elemVal.TableSpacing != null && elemVal.TableSpacing != undefined)
                    {
						document.getElementById("tblAllowSpacing").checked = true;
						document.getElementById("tblCS").value = elemVal.TableSpacing;
					}
					else
                    {
						document.getElementById("tblAllowSpacing").checked = false;
						document.getElementById("tblCS").value = "0.4";
					}
                    Table_AllowSpacing_OnChange();

					if ( elemVal.TableAlignment != null && elemVal.TableAlignment != undefined )
                    {
						switch(elemVal.TableAlignment)
                        {
							case 0:
								document.getElementById("tblAlignLeft").checked = true;
								document.getElementById("tblAlignCenter").checked = false;
								document.getElementById("tblAlignRight").checked = false;
								break;
							case 1:
								document.getElementById("tblAlignLeft").checked = false;
								document.getElementById("tblAlignCenter").checked = true;
								document.getElementById("tblAlignRight").checked = false;
								break;
							case 2:
								document.getElementById("tblAlignLeft").checked = false;
								document.getElementById("tblAlignCenter").checked = false;
								document.getElementById("tblAlignRight").checked = true;
								break;
						}
						document.getElementById("tblIndentLeft").value = elemVal.TableIndent;
                        Table_AlignLeft_OnChange();
					}

					if ( elemVal.TableWrappingStyle != null && elemVal.TableWrappingStyle != undefined )
                    {
                        if ( elemVal.TableWrappingStyle == c_oAscWrapStyle.Inline )
                        {
                            document.getElementById("tblWrapStyle1").checked = true;
                            document.getElementById("tblWrapStyle2").checked = false;
                            Table_UpdateTableInlineOrFlowProps(false);
                        }
                        else if ( elemVal.TableWrappingStyle == c_oAscWrapStyle.Flow )
                        {
                            document.getElementById("tblWrapStyle1").checked = false;
                            document.getElementById("tblWrapStyle2").checked = true;
                            Table_UpdateTableInlineOrFlowProps(false);
                        }

                        if ( false === elemVal.CanBeFlow )
                            document.getElementById("tblWrapStyle2").disabled = "disabled";
                        else
                            document.getElementById("tblWrapStyle2").disabled = 0;
                    }

					if ( elemVal.TableDefaultMargins)
                    {
						document.getElementById("tblDefMarLeft").value   = elemVal.TableDefaultMargins.Left;
						document.getElementById("tblDefMarTop").value    = elemVal.TableDefaultMargins.Top;
						document.getElementById("tblDefMarRight").value  = elemVal.TableDefaultMargins.Right;
						document.getElementById("tblDefMarBottom").value = elemVal.TableDefaultMargins.Bottom;
					}
					else
                    {
                        document.getElementById("tblDefMarLeft").value   = "0";
                        document.getElementById("tblDefMarTop").value    = "0";
                        document.getElementById("tblDefMarRight").value  = "0";
                        document.getElementById("tblDefMarBottom").value = "0";
                    }

					if ( elemVal.CellMargins )
                    {
						document.getElementById("tblMarLeft").value   = elemVal.CellMargins.Left;
						document.getElementById("tblMarTop").value    = elemVal.CellMargins.Top;
						document.getElementById("tblMarRight").value  = elemVal.CellMargins.Right;
						document.getElementById("tblMarBottom").value = elemVal.CellMargins.Bottom;

                        document.getElementById("tblMarType").selectedIndex = elemVal.CellMargins.Flag;
					}
					else
                    {
                        document.getElementById("tblMarLeft").value   = "";
                        document.getElementById("tblMarTop").value    = "";
                        document.getElementById("tblMarRight").value  = "";
                        document.getElementById("tblMarBottom").value = "";

                        document.getElementById("tblMarType").selectedIndex = 0;
                    }
                    Table_TableMarType_OnChange();

					if ( elemVal.TableBackground )
                    {
						document.getElementById("tblTableBGColor").style.backgroundColor = "rgb("+elemVal.TableBackground.Color.r+","+elemVal.TableBackground.Color.g+","+elemVal.TableBackground.Color.b+")";
						if ( elemVal.TableBackground.Value == 1 )
							document.getElementById("tblBrdBGColorTran").checked = true;
						else
                            document.getElementById("tblBrdBGColorTran").checked = false;
					}
					else
                    {
                        document.getElementById("tblTableBGColor").style.backgroundColor = "white";
					}
                    Table_TableBGTransparent_OnChange();

					if ( elemVal.CellsBackground )
                    {
						document.getElementById("tblCellBGColor").style.backgroundColor = "rgb("+elemVal.CellsBackground.Color.r+","+elemVal.CellsBackground.Color.g+","+elemVal.CellsBackground.Color.b+")";
						if ( elemVal.CellsBackground.Value == 1 )
							document.getElementById("tblCellBrdBGColorTran").checked = true;
						else
                            document.getElementById("tblCellBrdBGColorTran").checked = false;
					}
					else
                    {
                        document.getElementById("tblCellBGColor").style.backgroundColor = "white";
					}
                    Table_CellBGTransparent_OnChange();

					if ( elemVal.CellBorders )
                    {
                        document.getElementById("tblCellBrdLeft").checked    = false;
    					document.getElementById("tblCellBrdTop").checked     = false;
    					document.getElementById("tblCellBrdRight").checked   = false;
						document.getElementById("tblCellBrdBottom").checked  = false;
                        document.getElementById("tblCellBrdInsideV").checked = false;
                        document.getElementById("tblCellBrdInsideH").checked = false;

                        if (elemVal.CellBorders.InsideV)
                            document.getElementById("tblCellBrdInsideV_div").style.display = "block";
						else
                            document.getElementById("tblCellBrdInsideV_div").style.display = "none";

						if ( elemVal.CellBorders.InsideH )
                            document.getElementById("tblCellBrdInsideH_div").style.display = "block";
						else
                            document.getElementById("tblCellBrdInsideH_div").style.display = "none";
					}
					else
                    {
						document.getElementById("tblCellBrdLeft").checked   = false;
						document.getElementById("tblCellBrdTop").checked    = false;
						document.getElementById("tblCellBrdRight").checked  = false;
						document.getElementById("tblCellBrdBottom").checked = false;

                        document.getElementById("tblCellBrdInsideV_div").style.display = "none";
                        document.getElementById("tblCellBrdInsideH_div").style.display = "none";
					}

                    document.getElementById("tblBrdLeft").checked    = false;
                    document.getElementById("tblBrdTop").checked     = false;
                    document.getElementById("tblBrdRight").checked   = false;
                    document.getElementById("tblBrdBottom").checked  = false;
                    document.getElementById("tblBrdInsideV").checked = false;
                    document.getElementById("tblBrdInsideH").checked = false;

                    if ( elemVal.TablePaddings )
                    {
						document.getElementById("tblLeft").value   = elemVal.TablePaddings.Left;
						document.getElementById("tblTop").value    = elemVal.TablePaddings.Top;
						document.getElementById("tblRight").value  = elemVal.TablePaddings.Right;
						document.getElementById("tblBottom").value = elemVal.TablePaddings.Bottom;
					}
					else
                    {
						document.getElementById("tblLeft").value   = 0;
						document.getElementById("tblTop").value    = 0;
						document.getElementById("tblRight").value  = 0;
						document.getElementById("tblBottom").value = 0;
					}

                    if ( elemVal.Position )
                    {
                        document.getElementById("tblX").value = elemVal.Position.X;
                        document.getElementById("tblY").value = elemVal.Position.Y;
                    }
                    else
                    {
                        document.getElementById("tblX").value = "";
                        document.getElementById("tblY").value = "";
                    }

                    var bMerge = editor.CheckBeforeMergeCells();
                    var bSplit = editor.CheckBeforeSplitCells();

                    if ( true === bMerge )
                    {
                        document.getElementById("tblMerge").src   = "menu/img/Table_Merge.png";
                        document.getElementById("tblMerge").title = "Merge";
                        document.getElementById("tblMerge_div").onmousemove = function(){document.getElementById("tblMerge_div").style.backgroundColor = "RGB(249, 201, 16)";};
                    }
                    else
                    {
                        document.getElementById("tblMerge").src   = "menu/img/Table_MergeDisable.png";
                        document.getElementById("tblMerge").title = "";
                        document.getElementById("tblMerge_div").onmousemove = null;
                    }

                    if ( true === bSplit )
                    {
                        document.getElementById("tblSplit").src   = "menu/img/Table_Split.png";
                        document.getElementById("tblSplit").title = "Split";
                        document.getElementById("tblSplit").onclick = new Function("Table_Split()");
                        document.getElementById("tblSplit_div").onmousemove = function(){document.getElementById("tblSplit_div").style.backgroundColor = "RGB(249, 201, 16)";};
                    }
                    else
                    {
                        document.getElementById("tblSplit").src   = "menu/img/Table_SplitDisable.png";
                        document.getElementById("tblSplit").title = "";
                        document.getElementById("tblSplit").onclick = null;
                        document.getElementById("tblSplit_div").onmousemove = null;
                    }
                }
				else if ( ObjectType == c_oAscTypeSelectElement.Header)
                {
                    g_oToolBox.Enable_HdrFtr();

                    Drag.init( document.getElementById("hafPropDrag") );
                    document.getElementById("hafPropDrag").onDrag = function(X, Y)
                    {
                        var sTop = Y + 30 + "px", sLeft = X + "px";
                        document.getElementById("hafProp").style.top  = sTop;
                        document.getElementById("hafProp").style.left = sLeft;
                    };

                    if ( true === g_oToolBox.HdrFtr.Active )
                    {
                        $("#hafPropDrag").show();
                        $("#hafProp").show();
                    }
                    var elemVal = elemArg.get_ObjectValue();
					$("#hafHF").val(elemVal.Position);
					document.getElementById("hafFP").checked = elemVal.DifferentFirst;
					document.getElementById("hafOE").checked = elemVal.DifferentEvenOdd;
					if (elemVal.get_Type() == hdrftr_Footer)
						$("#hafType").html("We in Footer")
					else if (elemVal.get_Type() == hdrftr_Header)	
						$("#hafType").html("We in header")
				}
				else if ( ObjectType == c_oAscTypeSelectElement.Paragraph)
				{
                    g_oToolBox.Enable_Paragraph();

                    Drag.init( document.getElementById("prPropDrag") );
                    document.getElementById("prPropDrag").onDrag = function(X, Y)
                    {
                        var sTop = Y + 30 + "px", sLeft = X + "px";
                        document.getElementById("prProp").style.top  = sTop;
                        document.getElementById("prProp").style.left = sLeft;
                    };

                    if ( true === g_oToolBox.Paragraph.Active )
                    {
                        $("#prPropDrag").show();
                        $("#prProp").show();
                    }
					
					var elemVal = elemArg.get_ObjectValue();

                    var Caption = "";
                    if ( elemVal.Locked )
                        Caption = "\<b\>Paragraph\</b\>\<span style=\"color:red;\"\>(locked)\</span\>";
                    else
                        Caption = "\<b\>Paragraph\</b\>";

                    if (document.getElementById("prPropDragCaption").innerHTML)
                        document.getElementById("prPropDragCaption").innerHTML = Caption;
                    else
                        document.getElementById("prPropDragCaption").innerText = Caption;

                    if (elemVal.Ind != null && elemVal.Ind != undefined){
                        $("#prFirst").val(elemVal.Ind.FirstLine);
                        $("#prLeft").val(elemVal.Ind.Left);
                        $("#prRight").val(elemVal.Ind.Right);
                    }
					else{
						$("#prFirst").val("");
						$("#prLeft").val("");
						$("#prRight").val("");
					}

					if ( elemVal.Spacing != null && elemVal.Spacing != undefined )
                    {
                        document.getElementById("prLineRule").selectedIndex = ( linerule_Auto === elemVal.Spacing.LineRule ? 0 : ( linerule_AtLeast === elemVal.Spacing.LineRule ? 1 : 2 ) );
						$("#prLineHeight").val(elemVal.Spacing.Line);


                        if ( spacing_Auto === elemVal.Spacing.After )
                            $("#prAfter").val( "auto" );
                        else
						    $("#prAfter").val(elemVal.Spacing.After);

                        if ( spacing_Auto === elemVal.Spacing.Before )
                            $("#prBefore").val( "auto" );
                        else
						    $("#prBefore").val(elemVal.Spacing.Before);
					}
					else
                    {
						$("#prLineHeight").val("");
						$("#prAfter").val("");
						$("#prBefore").val("");
					}

					document.getElementById("prIntervBetween").checked = elemVal.ContextualSpacing;
					document.getElementById("prKeepLines").checked = elemVal.KeepLines;
					document.getElementById("prPageBreak").checked = elemVal.PageBreakBefore;
				}
                else if ( ObjectType == c_oAscTypeSelectElement.Hyperlink )
                {
                    Drag.init( document.getElementById("hyperPropDrag") );
                    document.getElementById("hyperPropDrag").onDrag = function(X, Y)
                    {
                        var sTop = Y + 30 + "px", sLeft = X + "px";
                        document.getElementById("hyperProp").style.top  = sTop;
                        document.getElementById("hyperProp").style.left = sLeft;
                    };

                    $("#hyperPropDrag").show();
                    $("#hyperProp").show();
                    var elemVal = elemArg.get_ObjectValue();

                    if ( null === elemVal.Text )
                    {
                        document.getElementById("hyperText").disabled = "disabled";
                        $("#hyperText").val( "\<\<Selected Text region\>\>" );

                    }
                    else
                    {
                        document.getElementById("hyperText").disabled = 0;
                        $("#hyperText").val( elemVal.Text );
                    }

                    if ( elemVal.Value != null && elemVal.Value != undefined )
                        $("#hyperUrl").val( elemVal.Value );
                    else
                        $("#hyperUrl").val("");

                    if ( elemVal.ToolTip != null && elemVal.ToolTip != undefined )
                        $("#hyperToolTip").val( elemVal.ToolTip );
                    else
                        $("#hyperToolTip").val("");
                }
			}
		}
	})
	editor.asc_registerCallback("asc_onSaveUrl", function(){
		 window.parent.postMessage(JSON.stringify(arguments[0]),"*");
	});
    editor.asc_registerCallback("asc_onParticipantsChanged", function(participants){
         var usersElement = $('#usersView');
         usersElement.empty();
         usersElement.append("<div>" + globalCurentUser + "</div>");
         for (var user in participants)
             usersElement.append("<div>" + participants[user].asc_getId() + "</div>");

        g_oToolBox.Activate_Users();
    });
	editor.asc_registerCallback("asc_onAuthParticipantsChanged", function(participants){
        var usersElement = $('#usersView');
        usersElement.empty();
        usersElement.append("<div>" + globalCurentUser + "</div>");

        var Count = 0;

        for (var user in participants)
        {
            usersElement.append("<div>" + participants[user].asc_getId() + "</div>");
            Count++;
        }

        if ( Count > 0 )
            g_oToolBox.Activate_Users();
    });
    editor.asc_registerCallback("asc_onCoAuthoringChatReceiveMessage", function(messages){
         var messagesElement = $('#messagesView');
         for (var message in messages)
             messagesElement.append("<div>" + messages[message].user + ": " + messages[message].message + "</div>");
    });
	$("#imgApply").click(function()
    {
		var oImgProp = new CImgProperty();
		oImgProp.put_Width( parseFloat($("#imgW").val()) );
		oImgProp.put_Height( parseFloat($("#imgH").val()) );
		oImgProp.put_WrappingStyle( document.getElementById("imgWrapStyleInline").checked? c_oAscWrapStyle.Inline: (document.getElementById("imgWrapStyleFlow").checked? c_oAscWrapStyle.Flow: null) );
		
		var oPaddings = new CPaddings();
		oPaddings.put_Left( ($("#imgLeft").val()!="")?parseFloat($("#imgLeft").val()):null );
		oPaddings.put_Top( ($("#imgTop").val()!="")?parseFloat($("#imgTop").val()):null );
		oPaddings.put_Right( ($("#imgRight").val()!="")?parseFloat($("#imgRight").val()):null );
		oPaddings.put_Bottom( ($("#imgBottom").val()!="")?parseFloat($("#imgBottom").val()):null );
		
		oImgProp.put_Paddings( oPaddings );

        if ( document.getElementById("imgWrapStyleFlow").checked === true )
        {
            var oPosH = new CImagePositionH();
            if ( document.getElementById("imgPositionHAlignRadio").checked === true )
            {
                oPosH.put_UseAlign( true );

                switch ( document.getElementById("imgPositionHAlignValueCombo").selectedIndex )
                {
                    case 0: oPosH.put_Align( c_oAscAlignH.Left ); break;
                    case 1: oPosH.put_Align( c_oAscAlignH.Center ); break;
                    case 2: oPosH.put_Align( c_oAscAlignH.Right ); break;
                }

                switch ( document.getElementById("imgPositionHAlignTypeCombo").selectedIndex )
                {
                    case 0: oPosH.put_RelativeFrom( c_oAscRelativeFromH.Margin );      break;
                    case 1: oPosH.put_RelativeFrom( c_oAscRelativeFromH.Page );        break;
                    case 2: oPosH.put_RelativeFrom( c_oAscRelativeFromH.Column );      break;
                    case 3: oPosH.put_RelativeFrom( c_oAscRelativeFromH.Character );   break;
                    case 4: oPosH.put_RelativeFrom( c_oAscRelativeFromH.LeftMargin );  break;
                    case 5: oPosH.put_RelativeFrom( c_oAscRelativeFromH.RightMargin ); break;
                }
            }
            else
            {
                var Value = parseFloat($("#imgPositionHPosValueCombo").val());
                oPosH.put_UseAlign( false );
                oPosH.put_Value( Value === NaN ? 0 : Value );

                switch ( document.getElementById("imgPositionHPosTypeCombo").selectedIndex )
                {
                    case 0: oPosH.put_RelativeFrom( c_oAscRelativeFromH.Margin );      break;
                    case 1: oPosH.put_RelativeFrom( c_oAscRelativeFromH.Page );        break;
                    case 2: oPosH.put_RelativeFrom( c_oAscRelativeFromH.Column );      break;
                    case 3: oPosH.put_RelativeFrom( c_oAscRelativeFromH.Character );   break;
                    case 4: oPosH.put_RelativeFrom( c_oAscRelativeFromH.LeftMargin );  break;
                    case 5: oPosH.put_RelativeFrom( c_oAscRelativeFromH.RightMargin ); break;
                }
            }

            var oPosV = new CImagePositionV();
            if ( document.getElementById("imgPositionVAlignRadio").checked === true )
            {
                oPosV.put_UseAlign( true );

                switch ( document.getElementById("imgPositionVAlignValueCombo").selectedIndex )
                {
                    case 0: oPosV.put_Align( c_oAscAlignV.Top ); break;
                    case 1: oPosV.put_Align( c_oAscAlignV.Center ); break;
                    case 2: oPosV.put_Align( c_oAscAlignV.Bottom ); break;
                }

                switch ( document.getElementById("imgPositionVAlignTypeCombo").selectedIndex )
                {
                    case 0: oPosV.put_RelativeFrom( c_oAscRelativeFromV.Margin );       break;
                    case 1: oPosV.put_RelativeFrom( c_oAscRelativeFromV.Page );         break;
                    case 2: oPosV.put_RelativeFrom( c_oAscRelativeFromV.Line );         break;
                    case 3: oPosV.put_RelativeFrom( c_oAscRelativeFromV.TopMargin );    break;
                    case 4: oPosV.put_RelativeFrom( c_oAscRelativeFromV.BottomMargin ); break;
                }
            }
            else
            {
                var Value = parseFloat($("#imgPositionVPosValueCombo").val());
                oPosV.put_UseAlign( false );
                oPosV.put_Value( Value === NaN ? 0 : Value );

                switch ( document.getElementById("imgPositionVPosTypeCombo").selectedIndex )
                {
                    case 0: oPosV.put_RelativeFrom( c_oAscRelativeFromV.Margin );       break;
                    case 1: oPosV.put_RelativeFrom( c_oAscRelativeFromV.Page );         break;
                    case 2: oPosV.put_RelativeFrom( c_oAscRelativeFromV.Paragraph );    break;
                    case 3: oPosV.put_RelativeFrom( c_oAscRelativeFromV.Line );         break;
                    case 4: oPosV.put_RelativeFrom( c_oAscRelativeFromV.TopMargin );    break;
                    case 5: oPosV.put_RelativeFrom( c_oAscRelativeFromV.BottomMargin ); break;
                }
            }

            oImgProp.put_PositionH( oPosH );
            oImgProp.put_PositionV( oPosV );
        }
		
		var oPos = new CPosition();
		oPos.put_X( ($("#imgX").val()!="")?parseFloat($("#imgX").val()):null );
		oPos.put_Y( ($("#imgY").val()!="")?parseFloat($("#imgY").val()):null );
		
		oImgProp.put_Position( oPos );
		
		oImgProp.put_ImageUrl( ($("#imgURL").val()!="")?$("#imgURL").val():null );
		
		editor.ImgApply( oImgProp );
	});

     $("#hyperApply").click(function()
     {
         var oHyperlinkProp = new CHyperlinkProperty();

         if ( !document.getElementById("hyperText").disabled )
         {
             oHyperlinkProp.put_Text( $("#hyperText").val() == "" ? null : $("#hyperText").val() );
         }

         oHyperlinkProp.put_ToolTip( $("#hyperToolTip").val() == "" ? null : $("#hyperToolTip").val() );
         oHyperlinkProp.put_Value( $("#hyperUrl").val() );

         editor.change_Hyperlink( oHyperlinkProp );
     });

     $("#commentAdd").click(function()
     {
         // Добавляем новый комментарий
         var CommentData = new asc_CCommentData();
         editor.asc_addComment( CommentData );
     });

     $("#hyperDelete").click(function()
     {
         editor.remove_Hyperlink();
     });

     $("#prBrdApply").click(function()
         {
             var Re = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
             var BColor = document.getElementById("prBrdColor").style.backgroundColor;
             var Bits = Re.exec(BColor);

             var BrdSize = 0.5 * g_dKoef_pt_to_mm;
             switch ( document.getElementById("prBrdSizeVals").selectedIndex )
             {
                 case 0 : BrdSize = 0.25 * g_dKoef_pt_to_mm; break;
                 case 1 : BrdSize = 0.5  * g_dKoef_pt_to_mm; break;
                 case 2 : BrdSize = 0.75 * g_dKoef_pt_to_mm; break;
                 case 3 : BrdSize = 1    * g_dKoef_pt_to_mm; break;
                 case 4 : BrdSize = 1.5  * g_dKoef_pt_to_mm; break;
                 case 5 : BrdSize = 2.25 * g_dKoef_pt_to_mm; break;
                 case 6 : BrdSize = 3    * g_dKoef_pt_to_mm; break;
                 case 7 : BrdSize = 4.5  * g_dKoef_pt_to_mm; break;
                 case 8 : BrdSize = 6    * g_dKoef_pt_to_mm; break;
             }

             if ( Bits == null )
             {
                 Bits = new Array(4);
                 Bits[1] = Bits[2] = Bits[3] = 0;
             }

             var BrdType = document.getElementById("prBrdType").checked ? border_Single : border_None;

             var BrdObj =
             {
                 Bottom :
                     (!document.getElementById("prBrdBottom").checked?
                     {
                         Color : null,
                         Value : null,
                         Size  : null
                     }
                         :
                     {
                         Color : { r : Bits[1], g : Bits[2], b : Bits[3] },
                         Value : BrdType,
                         Size  : BrdSize
                     }
                         ),

                 Left :
                     (!document.getElementById("prBrdLeft").checked?
                     {
                         Color : null,
                         Value : null,
                         Size  : null
                     }
                         :
                     {
                         Color : { r : Bits[1], g : Bits[2], b : Bits[3] },
                         Value : BrdType,
                         Size  : BrdSize
                     }
                         ),

                 Right :
                     (!document.getElementById("prBrdRight").checked?
                     {
                         Color : null,
                         Value : null,
                         Size  : null
                     }
                         :
                     {
                         Color : { r : Bits[1], g : Bits[2], b : Bits[3] },
                         Value : BrdType,
                         Size  : BrdSize
                     }
                         ),

                 Top :
                     (!document.getElementById("prBrdTop").checked?
                     {
                         Color : null,
                         Value : null,
                         Size  : null
                     }
                         :
                     {
                         Color : { r : Bits[1], g : Bits[2], b : Bits[3] },
                         Value : BrdType,
                         Size  : BrdSize
                     }
                         ),

                 Between :
                     (!document.getElementById("prBrdBetween").checked?
                     {
                         Color : null,
                         Value : null,
                         Size  : null
                     }
                         :
                     {
                         Color : { r : Bits[1], g : Bits[2], b : Bits[3] },
                         Value : BrdType,
                         Size  : BrdSize
                     }
                         )
             }

             editor.put_Borders( BrdObj );
         }
     );

     $("#prAddMessage").click(function()
         {
             editor.asc_coAuthoringChatSendMessage("test message");
         }
     );

	$("#tblApply").click(function()
    {
		var tblOBJ = new Object();
		if ( document.getElementById("tblWOn").checked )
        {
			tblOBJ.TableWidth = parseFloat( document.getElementById("tblW").value );
            if ( isNaN( tblOBJ.TableWidth ) )
                tblOBJ.TableWidth = 0;
        }
		else
            tblOBJ.TableWidth = null;
		
		if ( document.getElementById("tblAllowSpacing").checked )
        {
			tblOBJ.TableSpacing = parseFloat( document.getElementById("tblCS").value );
            if ( isNaN(tblOBJ.TableSpacing) )
                tblOBJ.TableSpacing = 0;
        }
		else
            tblOBJ.TableSpacing = null;

		if( document.getElementById("tblAlignLeft").checked )
			tblOBJ.TableAlignment = 0;
		else if( document.getElementById("tblAlignCenter").checked )
			tblOBJ.TableAlignment = 1;
		else if( document.getElementById("tblAlignRight").checked )
			tblOBJ.TableAlignment = 2;
		else
            tblOBJ.TableAlignment = 0;

        tblOBJ.RowsInHeader = parseInt(document.getElementById("tblHeaderRowsCount").value);

		tblOBJ.TableIndent = parseFloat( document.getElementById("tblIndentLeft").value );
        if ( isNaN(tblOBJ.TableIndent) )
            tblOBJ.TableIndent = 0;
				
		tblOBJ.TableDefaultMargins =
        {
			Left   : ( isNaN(parseFloat(document.getElementById("tblDefMarLeft").value))   ? null: parseFloat(document.getElementById("tblDefMarLeft").value)),
			Top    : ( isNaN(parseFloat(document.getElementById("tblDefMarTop").value))    ? null: parseFloat(document.getElementById("tblDefMarTop").value)),
			Right  : ( isNaN(parseFloat(document.getElementById("tblDefMarRight").value))  ? null: parseFloat(document.getElementById("tblDefMarRight").value)),
			Bottom : ( isNaN(parseFloat(document.getElementById("tblDefMarBottom").value)) ? null: parseFloat(document.getElementById("tblDefMarBottom").value))
		};

		tblOBJ.CellMargins =
        {
			Left   : ( isNaN(parseFloat(document.getElementById("tblMarLeft").value))   ? null : parseFloat(document.getElementById("tblMarLeft").value)),
			Top    : ( isNaN(parseFloat(document.getElementById("tblMarTop").value))    ? null : parseFloat(document.getElementById("tblMarTop").value)),
			Right  : ( isNaN(parseFloat(document.getElementById("tblMarRight").value))  ? null : parseFloat(document.getElementById("tblMarRight").value)),
			Bottom : ( isNaN(parseFloat(document.getElementById("tblMarBottom").value)) ? null : parseFloat(document.getElementById("tblMarBottom").value)),
            Flag   : document.getElementById("tblMarType").selectedIndex
		};

		if ( document.getElementById("tblWrapStyle1").checked )
			tblOBJ.TableWrappingStyle = c_oAscWrapStyle.Inline;
		else if ( document.getElementById("tblWrapStyle2").checked )
			tblOBJ.TableWrappingStyle = c_oAscWrapStyle.Flow;

        if ( document.getElementById("tblWrapStyle2").checked === true )
        {
            var oPosH = new CTablePositionH();
            if ( document.getElementById("tblPositionHAlignRadio").checked === true )
            {
                oPosH.put_UseAlign( true );

                switch ( document.getElementById("tblPositionHAlignValueCombo").selectedIndex )
                {
                    case 0: oPosH.put_Align( c_oAscXAlign.Left );   break;
                    case 1: oPosH.put_Align( c_oAscXAlign.Center ); break;
                    case 2: oPosH.put_Align( c_oAscXAlign.Right );  break;
                }

                switch ( document.getElementById("tblPositionHAlignTypeCombo").selectedIndex )
                {
                    case 0: oPosH.put_RelativeFrom( c_oAscHAnchor.Margin ); break;
                    case 1: oPosH.put_RelativeFrom( c_oAscHAnchor.Page );   break;
                    case 2: oPosH.put_RelativeFrom( c_oAscHAnchor.Text );   break;
                }
            }
            else
            {
                var Value = parseFloat($("#tblPositionHPosValueCombo").val());
                oPosH.put_UseAlign( false );
                oPosH.put_Value( Value === NaN ? 0 : Value );

                switch ( document.getElementById("tblPositionHPosTypeCombo").selectedIndex )
                {
                    case 0: oPosH.put_RelativeFrom( c_oAscHAnchor.Margin ); break;
                    case 1: oPosH.put_RelativeFrom( c_oAscHAnchor.Page );   break;
                    case 2: oPosH.put_RelativeFrom( c_oAscHAnchor.Text );   break;
                }
            }

            var oPosV = new CTablePositionV();
            if ( document.getElementById("tblPositionVAlignRadio").checked === true )
            {
                oPosV.put_UseAlign( true );

                switch ( document.getElementById("tblPositionVAlignValueCombo").selectedIndex )
                {
                    case 0: oPosV.put_Align( c_oAscYAlign.Top );    break;
                    case 1: oPosV.put_Align( c_oAscYAlign.Center ); break;
                    case 2: oPosV.put_Align( c_oAscYAlign.Bottom ); break;
                }

                switch ( document.getElementById("tblPositionVAlignTypeCombo").selectedIndex )
                {
                    case 0: oPosV.put_RelativeFrom( c_oAscVAnchor.Margin ); break;
                    case 1: oPosV.put_RelativeFrom( c_oAscVAnchor.Page );   break;
                    case 2: oPosV.put_RelativeFrom( c_oAscVAnchor.Text );   break;
                }
            }
            else
            {
                var Value = parseFloat($("#tblPositionVPosValueCombo").val());
                oPosV.put_UseAlign( false );
                oPosV.put_Value( Value === NaN ? 0 : Value );

                switch ( document.getElementById("tblPositionVPosTypeCombo").selectedIndex )
                {
                    case 0: oPosV.put_RelativeFrom( c_oAscVAnchor.Margin ); break;
                    case 1: oPosV.put_RelativeFrom( c_oAscVAnchor.Page );   break;
                    case 2: oPosV.put_RelativeFrom( c_oAscVAnchor.Text );   break;
                }
            }

            tblOBJ.PositionH = oPosH;
            tblOBJ.PositionV = oPosV;
        }


        var Re = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
        if ( !document.getElementById("tblBrdBGColorTran").checked )
        {
            var BColor = document.getElementById("tblTableBGColor").style.backgroundColor;
            var Bits = Re.exec(BColor);

            tblOBJ.TableBackground =
            {
                Color :
                {
                    r:	Bits[1],
                    g:  Bits[2],
                    b:	Bits[3]
                },
                Value : 0
            }
        }
        else
        {
            tblOBJ.TableBackground =
            {
                Color :
                {
                    r:	0,
                    g:  0,
                    b:	0
                },
                Value : 1
            }
        }

        if ( !document.getElementById("tblCellBrdBGColorTran").checked )
        {
            var BColor = document.getElementById("tblCellBGColor").style.backgroundColor;
            var Bits = Re.exec(BColor);

            tblOBJ.CellsBackground =
            {
                Color :
                {
                    r:	Bits[1],
                    g:  Bits[2],
                    b:	Bits[3]
                },
                Value : 0
            }
        }
        else
        {
            tblOBJ.CellsBackground =
            {
                Color :
                {
                    r:	0,
                    g:  0,
                    b:	0
                },
                Value : 1
            }
        }

		tblOBJ.TablePaddings =
        {
			Left   : ( isNaN(parseFloat(document.getElementById("tblLeft").value))   ? null : parseFloat(document.getElementById("tblLeft").value)),
			Top    : ( isNaN(parseFloat(document.getElementById("tblTop").value))    ? null : parseFloat(document.getElementById("tblTop").value)),
			Right  : ( isNaN(parseFloat(document.getElementById("tblRight").value))  ? null : parseFloat(document.getElementById("tblRight").value)),
			Bottom : ( isNaN(parseFloat(document.getElementById("tblBottom").value)) ? null : parseFloat(document.getElementById("tblBottom").value))
        };

        tblOBJ.Position =
        {
            X : ( isNaN(parseFloat(document.getElementById("tblX").value))   ? null : parseFloat(document.getElementById("tblX").value)),
            Y : ( isNaN(parseFloat(document.getElementById("tblY").value))   ? null : parseFloat(document.getElementById("tblY").value))
        };

        var BColor = document.getElementById("tblTableBrdColor").style.backgroundColor;
        var Bits = Re.exec(BColor);

        var BrdSize = 0.5 * g_dKoef_pt_to_mm;
        switch ( document.getElementById("tblTableBrdSizeVals").selectedIndex )
        {
            case 0 : BrdSize = 0.25 * g_dKoef_pt_to_mm; break;
            case 1 : BrdSize = 0.5  * g_dKoef_pt_to_mm; break;
            case 2 : BrdSize = 0.75 * g_dKoef_pt_to_mm; break;
            case 3 : BrdSize = 1    * g_dKoef_pt_to_mm; break;
            case 4 : BrdSize = 1.5  * g_dKoef_pt_to_mm; break;
            case 5 : BrdSize = 2.25 * g_dKoef_pt_to_mm; break;
            case 6 : BrdSize = 3    * g_dKoef_pt_to_mm; break;
            case 7 : BrdSize = 4.5  * g_dKoef_pt_to_mm; break;
            case 8 : BrdSize = 6    * g_dKoef_pt_to_mm; break;
        }

        if ( Bits == null )
        {
            Bits = new Array(4);
            Bits[1] = Bits[2] = Bits[3] = 0;
        }

        var BrdType = document.getElementById("tblTableBrdType").checked ? border_Single : border_None;
	
	    tblOBJ.TableBorders = // границы таблицы 
        {
			 Bottom :
				(!document.getElementById("tblBrdBottom").checked?
                {
                    Color : null,
                    Value : null,
                    Size  : null
                }
                    :
                {
                    Color : { r : Bits[1], g : Bits[2], b : Bits[3] },
                    Value : BrdType,
                    Size  : BrdSize
                }
				),

            Left :
				(!document.getElementById("tblBrdLeft").checked?
                {
                    Color : null,
                    Value : null,
                    Size  : null
                }
                    :
                {
                    Color : { r : Bits[1], g : Bits[2], b : Bits[3] },
                    Value : BrdType,
                    Size  : BrdSize
                }
                ),

            Right :
				(!document.getElementById("tblBrdRight").checked?
                {
                    Color : null,
                    Value : null,
                    Size  : null
                }
                    :
                {
                    Color : { r : Bits[1], g : Bits[2], b : Bits[3] },
                    Value : BrdType,
                    Size  : BrdSize
                }
                ),

            Top :
				(!document.getElementById("tblBrdTop").checked?
                {
                    Color : null,
                    Value : null,
                    Size  : null
                }
                    :
                {
                    Color : { r : Bits[1], g : Bits[2], b : Bits[3] },
                    Value : BrdType,
                    Size  : BrdSize
                }
                ),

            InsideH :
				(!document.getElementById("tblBrdInsideH").checked?
                {
                    Color : null,
                    Value : null,
                    Size  : null
                }
                    :
                {
                    Color : { r : Bits[1], g : Bits[2], b : Bits[3] },
                    Value : BrdType,
                    Size  : BrdSize
                }
                ),

            InsideV :
				(!document.getElementById("tblBrdInsideV").checked?
                {
                    Color : null,
                    Value : null,
                    Size  : null
                }
                    :
                {
                    Color : { r : Bits[1], g : Bits[2], b : Bits[3] },
                    Value : BrdType,
                    Size  : BrdSize
                }
                )
        }

        BColor = document.getElementById("tblCellBrdColor").style.backgroundColor;
		Bits = Re.exec(BColor);

        BrdSize = 0.5 * g_dKoef_pt_to_mm;
        switch ( document.getElementById("tblCellBrdSizeVals").selectedIndex )
        {
            case 0 : BrdSize = 0.25 * g_dKoef_pt_to_mm; break;
            case 1 : BrdSize = 0.5  * g_dKoef_pt_to_mm; break;
            case 2 : BrdSize = 0.75 * g_dKoef_pt_to_mm; break;
            case 3 : BrdSize = 1    * g_dKoef_pt_to_mm; break;
            case 4 : BrdSize = 1.5  * g_dKoef_pt_to_mm; break;
            case 5 : BrdSize = 2.25 * g_dKoef_pt_to_mm; break;
            case 6 : BrdSize = 3    * g_dKoef_pt_to_mm; break;
            case 7 : BrdSize = 4.5  * g_dKoef_pt_to_mm; break;
            case 8 : BrdSize = 6    * g_dKoef_pt_to_mm; break;
        }

		if ( Bits == null )
        {
			Bits = new Array(4);
			Bits[1] = Bits[2] = Bits[3] = 0;
		}

        BrdType = document.getElementById("tblCellBrdType").checked ? border_Single : border_None;

		tblOBJ.CellBorders = // границы таблицы 
        {
			 Bottom :
				(!document.getElementById("tblCellBrdBottom").checked?
                {
                    Color : null,
                    Value : null,
                    Size  : null
                }
                    :
					{
                        Color : { r : Bits[1], g : Bits[2], b : Bits[3] },
                        Value : BrdType,
                        Size  : BrdSize
                    }
				),

            Left :
				(!document.getElementById("tblCellBrdLeft").checked?
                {
                    Color : null,
                    Value : null,
                    Size  : null
                }
                    :
                {
                    Color : { r : Bits[1], g : Bits[2], b : Bits[3] },
                    Value : BrdType,
                    Size  : BrdSize
                }
                ),

            Right :
				(!document.getElementById("tblCellBrdRight").checked?
                {
                    Color : null,
                    Value : null,
                    Size  : null
                }
                    :
                {
                    Color : { r : Bits[1], g : Bits[2], b : Bits[3] },
                    Value : BrdType,
                    Size  : BrdSize
                }
                ),

            Top :
				(!document.getElementById("tblCellBrdTop").checked?
                {
                    Color : null,
                    Value : null,
                    Size  : null
                }
                    :
					{
                        Color : { r : Bits[1], g : Bits[2], b : Bits[3] },
                        Value : BrdType,
                        Size  : BrdSize
                    }
				),

            InsideH :
				(!document.getElementById("tblCellBrdInsideH").checked?
                {
                    Color : null,
                    Value : null,
                    Size  : null
                }
                    :
					{
                        Color : { r : Bits[1], g : Bits[2], b : Bits[3] },
                        Value : BrdType,
                        Size  : BrdSize
                    }
				),

            InsideV :
				(!document.getElementById("tblCellBrdInsideV").checked?
                {
                    Color : null,
                    Value : null,
                    Size  : null
                }
                    :
					{
                        Color : { r : Bits[1], g : Bits[2], b : Bits[3] },
                        Value : BrdType,
                        Size  : BrdSize
                    }
				)
        }
	
		editor.tblApply(tblOBJ);
	});

     $("#tblVertAlignJc_Top").click(function()
     {
         editor.tblApply({CellsVAlign : c_oAscVertAlignJc.Top});
     });

     $("#tblVertAlignJc_Center").click(function()
     {
         editor.tblApply({CellsVAlign : c_oAscVertAlignJc.Center});
     });

     $("#tblVertAlignJc_Bottom").click(function()
     {
         editor.tblApply({CellsVAlign : c_oAscVertAlignJc.Bottom});
     });

     $("#tblMerge").click(function(){
         editor.MergeCells();
     });

     $("#tblRowDelete").click(function(){
         editor.remRow();
     });

     $("#tblColDelete").click(function(){
         editor.remColumn();
     });

     $("#tblRowAdd_B").click(function(){
         editor.addRowAbove();
     });

     $("#tblRowAdd_A").click(function(){
         editor.addRowBelow();
     });

     $("#tblColAdd_B").click(function(){
         editor.addColumnLeft();
     });

     $("#tblColAdd_A").click(function(){
         editor.addColumnRight();
     });

     $("#tblRemove").click(function(){
         editor.remTable();
     });

     $("#tblCellBrdColorChart td").click(function()
         {
             document.getElementById("tblCellBrdColor").style.backgroundColor = this.bgColor;
             document.getElementById("tblCellBrdColorChart").style.visibility = 'hidden';
         }
     );

     $("#tblCellBrdColorChart").mouseout(function()
         {
             ColorChart_timer = window.setTimeout(function(){document.getElementById("tblCellBrdColorChart").style.visibility = 'hidden';}, 100);
         }
     );

     $("#tblCellBrdColorChart").mouseover(function()
         {
             ColorChart_timer = window.clearTimeout(ColorChart_timer);
         }
     );

     $("#tblTableBrdColorChart td").click(function()
         {
             document.getElementById("tblTableBrdColor").style.backgroundColor = this.bgColor;
             document.getElementById("tblTableBrdColorChart").style.visibility = 'hidden';
         }
     );

     $("#tblTableBrdColorChart").mouseout(function()
         {
             ColorChart_timer = window.setTimeout(function(){document.getElementById("tblTableBrdColorChart").style.visibility = 'hidden';}, 100);
         }
     );

     $("#tblTableBrdColorChart").mouseover(function()
         {
             ColorChart_timer = window.clearTimeout(ColorChart_timer);
         }
     );

     $("#tblTableBGColorChart td").click(function()
         {
             document.getElementById("tblTableBGColor").style.backgroundColor = this.bgColor;
             document.getElementById("tblTableBGColorChart").style.visibility = 'hidden';
         }
     );

     $("#tblTableBGColorChart").mouseout(function()
         {
             ColorChart_timer = window.setTimeout(function(){document.getElementById("tblTableBGColorChart").style.visibility = 'hidden';}, 100);
         }
     );

     $("#tblTableBGColorChart").mouseover(function()
         {
             ColorChart_timer = window.clearTimeout(ColorChart_timer);
         }
     );

     $("#tblCellBGColorChart td").click(function()
         {
             document.getElementById("tblCellBGColor").style.backgroundColor = this.bgColor;
             document.getElementById("tblCellBGColorChart").style.visibility = 'hidden';
         }
     );

     $("#tblCellBGColorChart").mouseout(function()
         {
             ColorChart_timer = window.setTimeout(function(){document.getElementById("tblCellBGColorChart").style.visibility = 'hidden';}, 100);
         }
     );

     $("#tblCellBGColorChart").mouseover(function()
         {
             ColorChart_timer = window.clearTimeout(ColorChart_timer);
         }
     );

     $("#prBrdColorChart td").click(function()
         {
             document.getElementById("prBrdColor").style.backgroundColor = this.bgColor;
             document.getElementById("prBrdColorChart").style.visibility = 'hidden';
         }
     );

     $("#prBrdColorChart").mouseout(function()
         {
             ColorChart_timer = window.setTimeout(function(){document.getElementById("prBrdColorChart").style.visibility = 'hidden';}, 100);
         }
     );

     $("#prBrdColorChart").mouseover(function()
         {
             ColorChart_timer = window.clearTimeout(ColorChart_timer);
         }
     );

     $("#tblSelectTable").click(function()
         {
             editor.selectTable();
         }
     );

     $("#tblSelectCell").click(function()
         {
             editor.selectCell();
         }
     );

     $("#tblSelectColumn").click(function()
         {
             editor.selectColumn();
         }
     );

     $("#tblSelectRow").click(function()
         {
             editor.selectRow();
         }
     );

     var sProtocol = window.location.protocol;
	var sHost = window.location.host;
	var documentOrigin = "";
	if(sProtocol && "" != sProtocol)
		documentOrigin = sProtocol + "//" + sHost;
	else
		documentOrigin = sHost;	
	var c_DocInfo = new CDocInfo ();
	c_DocInfo.put_Id( getURLParameter("key") ?
							decodeURIComponent(getURLParameter("key")) :
							undefined );
	c_DocInfo.put_Url( getURLParameter("key") ?
							decodeURIComponent(getURLParameter("url")) :
							undefined );
	c_DocInfo.put_Title( getURLParameter("key") ?
							decodeURIComponent(getURLParameter("title")).replace(new RegExp("\\+",'g')," ") :
							undefined );
	c_DocInfo.put_Format( getURLParameter("key") ?
							decodeURIComponent(getURLParameter("filetype")) :
							undefined );
	c_DocInfo.put_VKey( getURLParameter("key") ?
							decodeURIComponent(getURLParameter("vkey")) :
							undefined );
    globalCurentUser = "user_" + Math.floor((Math.random()*100)+1);
    c_DocInfo.put_UserId( globalCurentUser );
	
	var isViewMode = "true" == getURLParameter("isViewMode");
	editor.SetViewMode(isViewMode);
	
	editor.LoadDocument(c_DocInfo);
	
	
	
	
 },500)

 
})

function setLastColor(red,green,blue){
	$("#lastColor").css("background-color","rgb("+red+","+green+","+blue+")");
};
function setCurrentColor(red,green,blue){
	$("#currentColor").css("background-color","rgb("+red+","+green+","+blue+")");
};
function setColorFromRGB(red,green,blue){
	newColorSelected.r = red;
	newColorSelected.g = green;
	newColorSelected.b = blue;
};
function getColor(posLeft,posTop){
	var data = contextGrad.getImageData(posLeft, posTop, 1, 1).data;
	document.getElementById("redChannel").value = data[0];
	document.getElementById("greenChannel").value = data[1];
	document.getElementById("blueChannel").value = data[2];
	gradient.addColorStop(0, "rgb("+data[0]+","+data[1]+","+data[2]+")");
	gradient.addColorStop(1, "rgb(0,0,0)");
	contextGrad.fillStyle = gradient;
	contextGrad.fillRect(160, 0, 9, 128);
	getGradColor(gradSelectPosTop);
}
function getGradColor(posTop){
	var data = contextGrad.getImageData(165, posTop, 1, 1).data;
	document.getElementById("redChannel").value = data[0];
	document.getElementById("greenChannel").value = data[1];
	document.getElementById("blueChannel").value = data[2];
	setColorFromRGB(data[0],data[1],data[2])
}
function getMousePos(canvas, evt){
	obj = canvas;
	var top = canvas.offsetTop;
	var left = canvas.offsetLeft;
	mouseX = evt.clientX - left + window.pageXOffset;
	mouseY = evt.clientY - top + window.pageYOffset;
	return {
		x: mouseX,
		y: mouseY
	};
};
function hslTorgb(h,s,l) {
	/*h=[0..360] s=[0..100] l=[0..100]*/
	  h = h/360;
	  s = s/100;
	  l = l/100;
	
	  var R, G, B, Q;
	 
	  if(s == 0.0) {
		R = G = B = l;
	  }
	  else {
		  if (l<=0.5) {
			Q = l*(s+1);
		  }
		  else {
			Q = l+s-l*s;
		  }
		  var P = l*2 - Q;
		  R = hue(P, Q, (h+1/3));
		  G = hue(P, Q, h);
		  B = hue(P, Q, (h-1/3));
	  }
	 
	  R=Math.round(R*255);
	  G=Math.round(G*255);
	  B=Math.round(B*255);
	 
	  return {r:R,g:G,b:B};
}
	 
function hue(P, Q, h) {
	if (h<0) { h = h+1; }
	if (h>1) { h = h-1; }
	if (h*6<1) { return P+(Q-P)*h*6; }
	if (h*2<1) { return Q; }
	if (h*3<2) { return P+(Q-P)*(2/3-h)*6; }
	return P;
}

function rgbCSS2hex(rgbString){
	//var rgbString = "rgb(0, 70, 255)"; // get this in whatever way.

	var parts = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	// parts now should be ["rgb(0, 70, 255", "0", "70", "255"]

	delete (parts[0]);
	for (var i = 1; i <= 3; ++i) {
		parts[i] = parseInt(parts[i]).toString(16);
		if (parts[i].length == 1) parts[i] = '0' + parts[i];
	}
	return parts.join('');
}

function Color(a){
	this.hexchar="0123456789abcdef";
	this.init();
	this.user={};
	this.user.rgb=[],this.user.xyz=[],this.user.lab=[],this.user.hsv=[];
	this.setHex(a);
	this.named={};
	this.setNamed(this.calcNamedLAB())
}
Color.prototype={
	init:function(){
		var d,c,a,f;
		for(var e=0;e<colorStorage.length;e++){
			colorStorage[e][1] = colorStorage[e][1].toLowerCase();
			d=this.hex2rgb(colorStorage[e][1]);
			colorStorage[e]=colorStorage[e].concat(d);
			c=this.rgb2hsv(d);
			colorStorage[e]=colorStorage[e].concat(c);
			a=this.rgb2xyz(d);
			f=this.xyz2lab(a);
			colorStorage[e]=colorStorage[e].concat(f)
		}
	},
	setHex:function(c){
		var a=this.user;
		c=c||"000000";
		if(c.length==3){
			c=c.charAt(0)+c.charAt(0)+c.charAt(1)+c.charAt(1)+c.charAt(2)+c.charAt(2)
		}
		a.hex=c;
		a.rgb[0]=this.dec(a.hex.substr(0,2));
		a.rgb[1]=this.dec(a.hex.substr(2,2));
		a.rgb[2]=this.dec(a.hex.substr(4,2));
		a.xyz=this.rgb2xyz(a.rgb);
		a.lab=this.xyz2lab(a.xyz);
		a.hsv=this.rgb2hsv(a.rgb);
		a.hex0=this.rgb2hex(this.hsv2rgb([a.hsv[0],100,100]))
	},
	setNamed:function(c){
		this.named.index=c;
		var a=colorStorage[this.named.index];
		this.named.name=a[0];
		this.named.hex=a[1],this.named.rgb=a.slice(2,5),this.named.hsv=a.slice(6,8);
		return this.named.index
	},
	labDistance:function(c,a){
		return Math.pow(c[0]-a[0],2)+Math.pow(c[1]-a[1],2)+Math.pow(c[2]-a[2],2)
	},
	calcNamedLAB:function(){
		var j=-1,e=0,f,a;
		for(var c=0;c<colorStorage.length;c++){
			a=colorStorage[c].slice(8,11);
			f=this.labDistance(this.user.lab,a);
			if(f<j||j<0){
				j=f;
				e=c
			}
		}
		return e
	},
	hex:function(a){
		a=parseInt(a).toString(16);
		return a.length<2?"0"+a:a
	},
	dec:function(a){return parseInt(a,16)},
	hex2rgb:function(a){return[(this.hexchar.indexOf(a.substr(0,1))*16)+this.hexchar.indexOf(a.substr(1,1)),(this.hexchar.indexOf(a.substr(2,1))*16)+this.hexchar.indexOf(a.substr(3,1)),(this.hexchar.indexOf(a.substr(4,1))*16)+this.hexchar.indexOf(a.substr(5,1))]},
	rgb2hex:function(a){return this.hex(a[0])+this.hex(a[1])+this.hex(a[2])},
	rgb2hsv:function(i){
		var e,q,m;
		var a=i[0]/255;
		var f=i[1]/255;
		var l=i[2]/255;
		var d=Math.min(a,f,l);
		var k=Math.max(a,f,l);
		var n=k-d;
		m=k;
		if(n==0){
			e=q=0
		}
		else{
			q=n/k;
			var c=((k-a)/6+n/2)/n;
			var j=((k-f)/6+n/2)/n;
			var p=((k-l)/6+n/2)/n;
			if(a==k){
				e=p-j
			}
			else{
				if(f==k){
					e=(1/3)+c-p
				}
				else{
					if(l==k){
						e=(2/3)+j-c
					}
				}
			}
			if(e<0){
				e+=1
			}
			if(e>1){
				e-=1
			}
		}
	return[e*360,q*100,m*100]
	},
	rgb2xyz:function(d){
		var f=d[0]/255;
		var e=d[1]/255;
		var c=d[2]/255;
		f=(f>0.04045)?Math.pow((f+0.055)/1.055,2.4):f/12.92;
		e=(e>0.04045)?Math.pow((e+0.055)/1.055,2.4):e/12.92;
		c=(c>0.04045)?Math.pow((c+0.055)/1.055,2.4):c/12.92;
		f*=100;
		e*=100;
		c*=100;
		var a=f*0.4124+e*0.3576+c*0.1805;
		var j=f*0.2126+e*0.7152+c*0.0722;
		var i=f*0.0193+e*0.1192+c*0.9505;
		return[a,j,i]
	},
	xyz2lab:function(i){
		var d=i[0]/95.047;
		var k=i[1]/100;
		var j=i[2]/108.883;
		d=(d>0.008856)?Math.pow(d,1/3):(7.787*d)+(16/116);
		k=(k>0.008856)?Math.pow(k,1/3):(7.787*k)+(16/116);
		j=(j>0.008856)?Math.pow(j,1/3):(7.787*j)+(16/116);
		var f=116*k-16;
		var e=500*(d-k);
		var c=200*(k-j);
		return[f,e,c]
	},
	hsv2rgb:function(l){
		var k=l[0],y=l[1]/100,w=l[2]/100;
		var e=k/60;
		if(e==6){e=0}var j=Math.floor(e);
		var n=e-j;
		var d=w*(1-y);
		var c=w*(1-n*y);
		var x=w*(1-(1-n)*y);
		var a,m,u;
		switch(j){
			case 0:a=w,m=x,u=d;
				break;
			case 1:a=c,m=w,u=d;
				break;
			case 2:a=d,m=w,u=x;
				break;
			case 3:a=d,m=c,u=w;
				break;
			case 4:a=x,m=d,u=w;
				break;
			case 5:a=w,m=d,u=c;
				break
		}
		return[a*255,m*255,u*255]
	}
};

function Image_UpdateImagePositionH()
{
    if ( document.getElementById('imgPositionHAlignRadio').checked )
    {
        document.getElementById('imgPositionHAlignValueCombo').disabled = 0;
        document.getElementById('imgPositionHAlignTypeCombo').disabled  = 0;

        document.getElementById('imgPositionHPosValueCombo').disabled = "disabled";
        document.getElementById('imgPositionHPosTypeCombo').disabled  = "disabled";
    }
    else
    {
        document.getElementById('imgPositionHPosValueCombo').disabled = 0;
        document.getElementById('imgPositionHPosTypeCombo').disabled  = 0;

        document.getElementById('imgPositionHAlignValueCombo').disabled = "disabled";
        document.getElementById('imgPositionHAlignTypeCombo').disabled  = "disabled";
    }
}

function Image_UpdateImagePositionV()
{
    if ( document.getElementById('imgPositionVAlignRadio').checked )
    {
        document.getElementById('imgPositionVAlignValueCombo').disabled = 0;
        document.getElementById('imgPositionVAlignTypeCombo').disabled  = 0;

        document.getElementById('imgPositionVPosValueCombo').disabled = "disabled";
        document.getElementById('imgPositionVPosTypeCombo').disabled  = "disabled";
    }
    else
    {
        document.getElementById('imgPositionVPosValueCombo').disabled = 0;
        document.getElementById('imgPositionVPosTypeCombo').disabled  = 0;

        document.getElementById('imgPositionVAlignValueCombo').disabled = "disabled";
        document.getElementById('imgPositionVAlignTypeCombo').disabled  = "disabled";
    }
}

function Image_UpdateImageInlineOrFlow(bFromMenu)
{
    if ( document.getElementById('imgWrapStyleInline').checked )
    {
        document.getElementById('imgPosition').style.display = "none";
        document.getElementById('imgDistance').style.display = "none";
    }
    else
    {
        document.getElementById('imgPosition').style.display = "block";
        document.getElementById('imgDistance').style.display = "block";

        if ( true === bFromMenu )
        {
            // По Х
            document.getElementById('imgPositionHAlignRadio').checked = false;
            document.getElementById('imgPositionHPosRadio').checked   = true;
            Image_UpdateImagePositionH();

            document.getElementById('imgPositionHPosTypeCombo').selectedIndex = 2;
            document.getElementById('imgPositionHPosValueCombo').value = g_oImagePr.get_Value_X(c_oAscRelativeFromH.Column);

            // По Y
            document.getElementById('imgPositionVAlignRadio').checked = false;
            document.getElementById('imgPositionVPosRadio').checked   = true;
            Image_UpdateImagePositionV();

            document.getElementById('imgPositionVPosTypeCombo').selectedIndex = 2;
            document.getElementById('imgPositionVPosValueCombo').value = g_oImagePr.get_Value_Y(c_oAscRelativeFromV.Paragraph);
        }
    }
}

function Image_OnPositionHPosComboChange()
{
    var RelativeFrom = c_oAscRelativeFromH.Column;
    switch ( document.getElementById("imgPositionHPosTypeCombo").selectedIndex )
    {
        case 0: RelativeFrom = c_oAscRelativeFromH.Margin;      break;
        case 1: RelativeFrom = c_oAscRelativeFromH.Page;        break;
        case 2: RelativeFrom = c_oAscRelativeFromH.Column;      break;
        case 3: RelativeFrom = c_oAscRelativeFromH.Character;   break;
        case 4: RelativeFrom = c_oAscRelativeFromH.LeftMargin;  break;
        case 5: RelativeFrom = c_oAscRelativeFromH.RightMargin; break;
    }

    document.getElementById('imgPositionHPosValueCombo').value = g_oImagePr.get_Value_X(RelativeFrom);
}

function Image_OnPositionVPosComboChange()
{
    var RelativeFrom = c_oAscRelativeFromV.Paragraph;
    switch ( document.getElementById("imgPositionVPosTypeCombo").selectedIndex )
    {
        case 0: RelativeFrom = c_oAscRelativeFromV.Margin;       break;
        case 1: RelativeFrom = c_oAscRelativeFromV.Page;         break;
        case 2: RelativeFrom = c_oAscRelativeFromV.Paragraph;    break;
        case 3: RelativeFrom = c_oAscRelativeFromV.Line;         break;
        case 4: RelativeFrom = c_oAscRelativeFromV.TopMargin;    break;
        case 5: RelativeFrom = c_oAscRelativeFromV.BottomMargin; break;
    }

    document.getElementById('imgPositionVPosValueCombo').value = g_oImagePr.get_Value_Y(RelativeFrom);
}

function Table_UpdateTablePositionH()
{
    if ( document.getElementById('tblPositionHAlignRadio').checked )
    {
        document.getElementById('tblPositionHAlignValueCombo').disabled = 0;
        document.getElementById('tblPositionHAlignTypeCombo').disabled  = 0;

        document.getElementById('tblPositionHPosValueCombo').disabled = "disabled";
        document.getElementById('tblPositionHPosTypeCombo').disabled  = "disabled";
    }
    else
    {
        document.getElementById('tblPositionHPosValueCombo').disabled = 0;
        document.getElementById('tblPositionHPosTypeCombo').disabled  = 0;

        document.getElementById('tblPositionHAlignValueCombo').disabled = "disabled";
        document.getElementById('tblPositionHAlignTypeCombo').disabled  = "disabled";
    }
}

function Table_UpdateTablePositionV()
{
    if ( document.getElementById('tblPositionVAlignRadio').checked )
    {
        document.getElementById('tblPositionVAlignValueCombo').disabled = 0;
        document.getElementById('tblPositionVAlignTypeCombo').disabled  = 0;

        document.getElementById('tblPositionVPosValueCombo').disabled = "disabled";
        document.getElementById('tblPositionVPosTypeCombo').disabled  = "disabled";
    }
    else
    {
        document.getElementById('tblPositionVPosValueCombo').disabled = 0;
        document.getElementById('tblPositionVPosTypeCombo').disabled  = 0;

        document.getElementById('tblPositionVAlignValueCombo').disabled = "disabled";
        document.getElementById('tblPositionVAlignTypeCombo').disabled  = "disabled";
    }
}

function Table_OnPositionHPosComboChange()
{
    var RelativeFrom = c_oAscHAnchor.Column;
    switch ( document.getElementById("tblPositionHPosTypeCombo").selectedIndex )
    {
        case 0: RelativeFrom = c_oAscHAnchor.Margin; break;
        case 1: RelativeFrom = c_oAscHAnchor.Page;   break;
        case 2: RelativeFrom = c_oAscHAnchor.Text;   break;
    }

    document.getElementById('tblPositionHPosValueCombo').value = g_oTablePr.get_Value_X(RelativeFrom);

}

function Table_OnPositionVPosComboChange()
{
    var RelativeFrom = c_oAscVAnchor.Paragraph;
    switch ( document.getElementById("tblPositionVPosTypeCombo").selectedIndex )
    {
        case 0: RelativeFrom = c_oAscVAnchor.Margin; break;
        case 1: RelativeFrom = c_oAscVAnchor.Page;   break;
        case 2: RelativeFrom = c_oAscVAnchor.Text;   break;
    }

    document.getElementById('tblPositionVPosValueCombo').value = g_oTablePr.get_Value_Y(RelativeFrom);
}

function Table_UpdateTableInlineOrFlowProps(bFromMenu)
{
    if ( document.getElementById('tblWrapStyle1').checked )
    {
        document.getElementById('tblInlineTableProps_div').style.display='block';
        document.getElementById('tblFlowTableProps_div').style.display='none';
    }
    else
    {
        document.getElementById('tblInlineTableProps_div').style.display='none';
        document.getElementById('tblFlowTableProps_div').style.display='block';

        if ( true === bFromMenu )
        {
            // По Х
            document.getElementById('tblPositionHAlignRadio').checked = false;
            document.getElementById('tblPositionHPosRadio').checked   = true;
            Table_UpdateTablePositionH();

            document.getElementById('tblPositionHPosTypeCombo').selectedIndex = 1;
            document.getElementById('tblPositionHPosValueCombo').value = g_oTablePr.get_Value_X(c_oAscHAnchor.Page);

            // По Y
            document.getElementById('tblPositionVAlignRadio').checked = false;
            document.getElementById('tblPositionVPosRadio').checked   = true;
            Table_UpdateTablePositionV();

            document.getElementById('tblPositionVPosTypeCombo').selectedIndex = 1;
            document.getElementById('tblPositionVPosValueCombo').value = g_oTablePr.get_Value_Y(c_oAscVAnchor.Page);
        }
    }
}

function Table_TableBGTransparent_OnChange()
{
    if ( document.getElementById('tblBrdBGColorTran').checked )
        document.getElementById('tblTableBGColor_div').style.display = "none";
    else
        document.getElementById('tblTableBGColor_div').style.display = "block";
}

function Table_CellBGTransparent_OnChange()
{
    if ( document.getElementById('tblCellBrdBGColorTran').checked )
        document.getElementById('tblCellBGColor_div').style.display = "none";
    else
        document.getElementById('tblCellBGColor_div').style.display = "block";
}

function Table_AllowWidth_OnChange()
{
    if ( document.getElementById("tblWOn").checked )
        document.getElementById("tblW").disabled = 0;
    else
        document.getElementById("tblW").disabled = "disabled";
}

function Table_AllowSpacing_OnChange()
{
    if ( document.getElementById("tblAllowSpacing").checked )
        document.getElementById("tblCS").disabled = 0;
    else
        document.getElementById("tblCS").disabled = "disabled";
}

function Table_AlignLeft_OnChange()
{
    if ( document.getElementById("tblAlignLeft").checked )
        document.getElementById("tblIndentLeft").disabled = 0;
    else
        document.getElementById("tblIndentLeft").disabled = "disabled";
}

function Table_TableMarType_OnChange()
{
    if ( 0 === document.getElementById("tblMarType").selectedIndex )
    {
        document.getElementById("tblMarLeft").disabled   = "disabled";
        document.getElementById("tblMarRight").disabled  = "disabled";
        document.getElementById("tblMarTop").disabled    = "disabled";
        document.getElementById("tblMarBottom").disabled = "disabled";
    }
    else
    {
        document.getElementById("tblMarLeft").disabled   = 0;
        document.getElementById("tblMarRight").disabled  = 0;
        document.getElementById("tblMarTop").disabled    = 0;
        document.getElementById("tblMarBottom").disabled = 0;
    }
}

function Table_Split()
{
    var Cols = parseInt( prompt( "Enter Cols count", "2" ) );
    var Rows = parseInt( prompt( "Enter Rows count", "2" ) );
    editor.SplitCell( Cols, Rows );
}

function Menu_Hyperlink_Add()
{
    var Val = editor.can_AddHyperlink();
    if ( false !== Val )
    {
        var String = prompt("Enter text","text");
        var oHyperlinkProp = new CHyperlinkProperty();

        if ( "" === Val )
            oHyperlinkProp.put_Text( "www.rbc.com" );
        oHyperlinkProp.put_Value( String )
        editor.add_Hyperlink( oHyperlinkProp );
    }
}

var g_ContextMenuId = null;
function Menu_ContextMenu_Show(X, Y)
{
    if ( null != g_ContextMenuId )
        Menu_ContextMenu_Hide();

    var sTop = Y + "px", sLeft = X + "px", sSize = "0px";
    g_ContextMenuId = document.createElement("div");
    g_ContextMenuId.id = "id_testsss";
    g_ContextMenuId.style.position = "absolute";
    g_ContextMenuId.style.outline = "50px solid";
    g_ContextMenuId.style.outlineColor = "invert";
    g_ContextMenuId.style.color = "black";
    g_ContextMenuId.style.zIndex = 100;
    g_ContextMenuId.style.top  = sTop;
    g_ContextMenuId.style.left = sLeft;
    g_ContextMenuId.style.width  = sSize;
    g_ContextMenuId.style.height = sSize;

    document.getElementById("id_main").appendChild( g_ContextMenuId );

    setTimeout( Menu_ContextMenu_Hide, 100 );
}

function Menu_ContextMenu_Hide()
{
    if ( null != g_ContextMenuId )
    {
        document.getElementById("id_main").removeChild( g_ContextMenuId );
        g_ContextMenuId = null;
    }
}

var g_HyperlinkToolTip = null;

function Hyperlink_Show(X,Y, ToolTip)
{
    Hyperlink_Hide();

    var sTop = Y + "px", sLeft = X + "px", sSize = "0px";
    g_HyperlinkToolTip = document.createElement("div");
    g_HyperlinkToolTip.style.position = "absolute";
    g_HyperlinkToolTip.style.color = "black";
    g_HyperlinkToolTip.style.backgroundColor = "silver";
    g_HyperlinkToolTip.style.zIndex = 100;
    g_HyperlinkToolTip.style.top  = sTop;
    g_HyperlinkToolTip.style.left = sLeft;

    if (g_HyperlinkToolTip.innerHTML)
        g_HyperlinkToolTip.innerHTML = ToolTip;
    else
        g_HyperlinkToolTip.innerText = ToolTip;

    document.getElementById("id_main").appendChild( g_HyperlinkToolTip );
}

function Hyperlink_Hide()
{
    if ( null != g_HyperlinkToolTip )
    {
        document.getElementById("id_main").removeChild( g_HyperlinkToolTip );
        g_HyperlinkToolTip = null;
    }
}

function Comment_OnClick_Reply()
{
    var ParentNode  = this.parentNode.parentNode;
    var ParentWidth = parseInt(ParentNode.style.width);
    var Shift = 20;

    var ParentTextArea = ParentNode.getElementsByTagName('textarea')[0];
    var ChildDivs = ParentNode.getElementsByTagName('div');
    var RepliesCounts = ChildDivs.length - 1; // первый див с кнопками
    var ButtonsDiv = ChildDivs[0];
    var ParentButtons = ButtonsDiv.getElementsByTagName('input');

    var Div = document.createElement("div");
    Div.style["float"]     = "left";
    Div.style.width        = (ParentWidth - Shift) + "px";
    Div.style.padding      = "0px";
    Div.style.paddingLeft  = Shift + "px";
    ParentNode.appendChild( Div );

    var TextArea = document.createElement("textarea");
    TextArea.id              = "Reply" + (RepliesCounts + 1) + ParentTextArea.id;
    TextArea.style["float"]  = "left";
    TextArea.style.width     = (ParentWidth - 2 - Shift) + "px";
    TextArea.style.maxWidth  = (ParentWidth - 2 - Shift) + "px";
    TextArea.style.minWidth  = (ParentWidth - 2 - Shift) + "px";
    TextArea.style.padding   = "0px";
    TextArea.style.height    = "100%";
    TextArea.onmousedown     = Comment_OnMouseDown_TextArea;

    Div.appendChild( TextArea );

    var ButtonArea = document.createElement("div");
    ButtonArea.style["float"]  = "left";
    ButtonArea.style.padding   = "0px";
    ButtonArea.style.height    = "100%";
    Div.appendChild( ButtonArea );

    var ReplyButton     = document.createElement("input");
    ReplyButton.id      = "Reply" + (RepliesCounts + 1) + ParentButtons[0].id;
    ReplyButton.type    = "button";
    ReplyButton.value   = "Reply";
    ReplyButton.onclick = Comment_OnClick_Reply;
    ButtonArea.appendChild( ReplyButton );

    var DeleteButton     = document.createElement("input");
    DeleteButton.id      = "Reply" + (RepliesCounts + 1) + ParentButtons[1].id;
    DeleteButton.type    = "button";
    DeleteButton.value   = "Delete";
    DeleteButton.onclick = Comment_OnClick_Delete;
    ButtonArea.appendChild( DeleteButton );

    var Id = DeleteButton.id.substring( DeleteButton.id.indexOf("comment_deletebutton_") + 21 );
    Comment_OnChange_Internal( Id );
};

function Comment_OnMouseDown_TextArea()
{
    var Pos = -1;
    if ( -1 != ( Pos = this.id.indexOf("comment_textarea_") ) )
    {
        editor.asc_enableKeyEvents(false);
        var Id = this.id.substring( Pos + 17 );
        editor.asc_selectComment( Id );
        editor.asc_showComment( Id );
    }
};

function Comment_OnClick_Delete()
{
    var ButtonId = this.id;

    var CurComment = this.parentNode.parentNode;
    CurComment.parentNode.removeChild( CurComment );

    if ( -1 != this.id.indexOf("Reply") )
    {
        // Значит это не верхний комментарий, а ответ
        var Id = this.id.substring( this.id.indexOf("comment_deletebutton_") + 21 );
        Comment_OnChange_Internal( Id );
    }
    else
    {
        // Это верхний комментарий
        var Id = this.id.substring( 21 );
        editor.asc_removeComment( Id );
    }
};

function Comment_OnChange()
{
    var Pos = -1;
    if ( -1 != ( Pos = this.id.indexOf("comment_textarea_") ) )
    {
        var Id = this.id.substring( Pos + 17 );
        Comment_OnChange_Internal( Id );
    }
}

function Comment_OnChange_Internal(Id)
{
    var CommentData = new asc_CCommentData();
    var CommentDiv = document.getElementById("comment_" + Id);
    Comment_FillCommentData( CommentDiv, CommentData );

    editor.asc_changeComment( Id, CommentData );
}

function Comment_FillCommentData(Div, CommentData)
{
    CommentData.asc_putText( Div.getElementsByTagName("textarea")[0].value );

    var Replies = Div.children;
    var Count = Replies.length - 2;

    for ( var Index = 0; Index < Count; Index++ )
    {
        var ReplyDiv = Replies[Index + 2];
        var ReplyCommentData = new asc_CCommentData();

        Comment_FillCommentData( ReplyDiv, ReplyCommentData );
        CommentData.asc_addReply( ReplyCommentData );
    }
}

var g_CurrentCommentDiv = null;

function Comment_ShowCurrentComment(Id, X, Y)
{
    /*
    if ( null === g_CurrentCommentDiv )
    {
        g_CurrentCommentDiv = document.createElement("div");
        document.getElementById("id_main").appendChild( g_CurrentCommentDiv );
    }

    var Div = g_CurrentCommentDiv;
    var sTop = Y + "px", sLeft = X + 5 + "px", sSize = "0px";
    Div.style.position = "absolute";
    Div.style.zIndex  = 100;
    Div.style.top     = sTop;
    Div.style.left    = sLeft;
    Div.style.width   = 400;
    Div.style.display = "block";

    while ( null != Div.firstChild )
        Div.removeChild( Div.firstChild );

    Div.appendChild( document.getElementById("comment_" + Id).cloneNode(true) );
    return;
    */

    if ( null === g_CurrentCommentDiv )
    {
        g_CurrentCommentDiv = document.createElement("div");
        document.getElementById("id_main").appendChild( g_CurrentCommentDiv );

        var TextArea = document.createElement("textarea");
        TextArea.style["float"]  = "left";
        TextArea.style.width     = "388px";
        TextArea.style.maxWidth  = "388px";
        TextArea.style.minWidth  = "388px";
        TextArea.style.padding   = "0px";
        TextArea.style.height    = "100%";
        g_CurrentCommentDiv.appendChild( TextArea );
    }

    var Div = g_CurrentCommentDiv;
    var TextArea = Div.getElementsByTagName("textarea")[0];
    TextArea.value = document.getElementById("comment_textarea_" + Id).value;

    var sTop = Y + "px", sLeft = X + 5 + "px", sSize = "0px";
    Div.style.position = "absolute";
    Div.style.zIndex  = 100;
    Div.style.top     = sTop;
    Div.style.left    = sLeft;
    Div.style.width   = 400;
    Div.style.display = "block";

};

function Comment_HideCurrentComment()
{
    if ( null != g_CurrentCommentDiv )
    {
        var Div = g_CurrentCommentDiv;
        Div.style.display = "none";
    }
}

function Comment_UpdateCurrentComment(X, Y)
{
    if ( null != g_CurrentCommentDiv )
    {
        var Div = g_CurrentCommentDiv;

        var sTop = Y + "px", sLeft = X + 5 + "px", sSize = "0px";
        Div.style.top     = sTop;
        Div.style.left    = sLeft;
    }
}

function Comment_UpdateCommentData(ParentDiv, CommentData)
{
    var ParentNode  = ParentDiv;
    var ParentWidth = parseInt(ParentNode.style.width);
    var Shift = 20;

    var ParentTextArea = ParentNode.getElementsByTagName('textarea')[0];
    var ChildDivs = ParentNode.getElementsByTagName('div');
    var RepliesCounts = ChildDivs.length - 1; // первый див с кнопками
    var ButtonsDiv = ChildDivs[0];
    var ParentButtons = ButtonsDiv.getElementsByTagName('input');

    var Div = document.createElement("div");
    Div.style["float"]     = "left";
    Div.style.width        = (ParentWidth - Shift) + "px";
    Div.style.padding      = "0px";
    Div.style.paddingLeft  = Shift + "px";
    ParentNode.appendChild( Div );

    var TextArea = document.createElement("textarea");
    TextArea.id              = "Reply" + (RepliesCounts + 1) + ParentTextArea.id;
    TextArea.style["float"]  = "left";
    TextArea.style.width     = (ParentWidth - 2 - Shift) + "px";
    TextArea.style.maxWidth  = (ParentWidth - 2 - Shift) + "px";
    TextArea.style.minWidth  = (ParentWidth - 2 - Shift) + "px";
    TextArea.style.padding   = "0px";
    TextArea.style.height    = "100%";
    TextArea.value           = CommentData.asc_getText();
    TextArea.onmousedown     = Comment_OnMouseDown_TextArea;

    Div.appendChild( TextArea );

    var ButtonArea = document.createElement("div");
    ButtonArea.style["float"]  = "left";
    ButtonArea.style.padding   = "0px";
    ButtonArea.style.height    = "100%";
    Div.appendChild( ButtonArea );

    var ReplyButton     = document.createElement("input");
    ReplyButton.id      = "Reply" + (RepliesCounts + 1) + ParentButtons[0].id;
    ReplyButton.type    = "button";
    ReplyButton.value   = "Reply";
    ReplyButton.onclick = Comment_OnClick_Reply;
    ButtonArea.appendChild( ReplyButton );

    var DeleteButton     = document.createElement("input");
    DeleteButton.id      = "Reply" + (RepliesCounts + 1) + ParentButtons[1].id;
    DeleteButton.type    = "button";
    DeleteButton.value   = "Delete";
    DeleteButton.onclick = Comment_OnClick_Delete;
    ButtonArea.appendChild( DeleteButton );

    var RepliesCount = CommentData.asc_getRepliesCount();
    for ( var Index = 0; Index < RepliesCount; Index++ )
        Comment_UpdateCommentData( Div, CommentData.asc_getReply(Index) );
}

function Comment_OnChange_CommentData(Id, CommentData)
{
    var Div;
    if ( null != document.getElementById("comment_" + Id) )
    {
        Div = document.getElementById("comment_" + Id);

        while ( null != Div.firstChild )
            Div.removeChild( Div.firstChild );
    }
    else
    {
        Div = document.createElement("div");
        Div.id                = "comment_" + Id;
        Div.style["float"]    = "left";
        Div.style.width       = "390px";
        Div.style.padding     = "5px";
        Div.style.paddingLeft = "5px";
        document.getElementById("comments").appendChild( Div );
    }

    var TextArea = document.createElement("textarea");
    TextArea.id              = "comment_textarea_" + Id;
    TextArea.style["float"]  = "left";
    TextArea.style.width     = "388px";
    TextArea.style.maxWidth  = "388px";
    TextArea.style.minWidth  = "388px";
    TextArea.style.padding   = "0px";
    TextArea.style.height    = "100%";
    TextArea.onmousedown     = Comment_OnMouseDown_TextArea;
    TextArea.onchange        = Comment_OnChange;
    TextArea.value           = CommentData.asc_getText();
    Div.appendChild( TextArea );

    var ButtonArea = document.createElement("div");
    ButtonArea.id              = "comment_buttonarea_" + Id;
    ButtonArea.style["float"]  = "left";
    ButtonArea.style.padding   = "0px";
    ButtonArea.style.height    = "100%";
    Div.appendChild( ButtonArea );

    var ReplyButton     = document.createElement("input");
    ReplyButton.id      = "comment_replybutton_" + Id;
    ReplyButton.type    = "button";
    ReplyButton.value   = "Reply";
    ReplyButton.onclick = Comment_OnClick_Reply;
    ButtonArea.appendChild( ReplyButton );

    var DeleteButton     = document.createElement("input");
    DeleteButton.id      = "comment_deletebutton_" + Id;
    DeleteButton.type    = "button";
    DeleteButton.value   = "Delete";
    DeleteButton.onclick = Comment_OnClick_Delete;
    ButtonArea.appendChild( DeleteButton );

    var RepliesCount = CommentData.asc_getRepliesCount();
    for ( var Index = 0; Index < RepliesCount; Index++ )
        Comment_UpdateCommentData( Div, CommentData.asc_getReply(Index) );
}

function Comment_LockComment(Id)
{
    var Div = document.getElementById("comment_buttonarea_" + Id);

    var LockedDiv = document.createElement("div");
    LockedDiv.id              = "comment_buttonarea_locked_" + Id;
    LockedDiv.style["float"]  = "left";
    LockedDiv.style.padding   = "0px";
    LockedDiv.style.height    = "100%";
    LockedDiv.style.color     = "red";

    var Caption = "LOCKED";

    if (LockedDiv.innerHTML)
        LockedDiv.innerHTML = Caption;
    else
        LockedDiv.innerText = Caption;

    Div.appendChild( LockedDiv );
}

function Comment_UnLockComment(Id)
{
    try
    {
        var Div = document.getElementById("comment_buttonarea_" + Id);
        var LockedDiv = document.getElementById("comment_buttonarea_" + Id);
        Div.removeChild(LockedDiv);
    }
    catch(e)
    {

    }
}

var global_is_ea_input_mode = false;

function CToolBox()
{
    this.Paragraph = { Active : false, Enabled : true, Over : false };
    this.Table     = { Active : false, Enabled : true, Over : false };
    this.Image     = { Active : true, Enabled : true, Over : false };
    this.HdrFtr    = { Active : false, Enabled : true, Over : false };
    this.Users     = { Active : false, Enabled : true, Over : false };
    this.Comments  = { Active : false, Enabled : true, Over : false };

    var oThis = this;

    this.Init = function()
    {
        var MainDiv = document.getElementById("id_main_view");

        var ToolBoxDiv = document.createElement("div");
        ToolBoxDiv.style.position        = "absolute";
        ToolBoxDiv.style.left            = 0;
        ToolBoxDiv.style.top             = 0;
        ToolBoxDiv.style.width           = "34px";
        ToolBoxDiv.style.backgroundColor = "#fff";
        ToolBoxDiv.style.zIndex          = 1000;
        ToolBoxDiv.style.border          = "4px ridge silver";
        MainDiv.appendChild( ToolBoxDiv );

        var ButtonParaProps = document.createElement("div");
        ButtonParaProps.id                       = "id_toolbox_buttonParaProps";
        ButtonParaProps.style["float"]           = "left";
        ButtonParaProps.style.backgroundImage    = "url('menu/img/Props.png')";
        ButtonParaProps.style.width              = "34px";
        ButtonParaProps.style.height             = "27px";
        ToolBoxDiv.appendChild( ButtonParaProps );

        ButtonParaProps.onmouseover = function()
        {
            if ( true === oThis.Paragraph.Enabled )
            {
                oThis.Paragraph.Over = true;
                oThis.Internal_OnChange_Paragraph();
            }
        };

        ButtonParaProps.onmouseout = function()
        {
            if ( true === oThis.Paragraph.Enabled )
            {
                oThis.Paragraph.Over = false;
                oThis.Internal_OnChange_Paragraph();
            }
        };

        ButtonParaProps.onmousedown = function()
        {
            if ( true === oThis.Paragraph.Enabled )
            {
                oThis.Paragraph.Active = oThis.Paragraph.Active === true ? false : true;
                oThis.Internal_OnChange_Paragraph();

                if ( true === oThis.Paragraph.Active )
                {
                    $("#prPropDrag").show();
                    $("#prProp").show();
                }
                else
                {
                    $("#prPropDrag").hide();
                    $("#prProp").hide();
                }
            }
        };

        var ButtonTableProps = document.createElement("div");
        ButtonTableProps.id                       = "id_toolbox_buttonTableProps";
        ButtonTableProps.style["float"]           = "left";
        ButtonTableProps.style.backgroundImage    = "url('menu/img/Props.png')";
        ButtonTableProps.style.width              = "34px";
        ButtonTableProps.style.height             = "27px";
        ToolBoxDiv.appendChild( ButtonTableProps );

        ButtonTableProps.onmouseover = function()
        {
            if ( true === oThis.Table.Enabled )
            {
                oThis.Table.Over = true;
                oThis.Internal_OnChange_Table();
            }
        };

        ButtonTableProps.onmouseout = function()
        {
            if ( true === oThis.Table.Enabled )
            {
                oThis.Table.Over = false;
                oThis.Internal_OnChange_Table();
            }
        };

        ButtonTableProps.onmousedown = function()
        {
            if ( true === oThis.Table.Enabled )
            {
                oThis.Table.Active = oThis.Table.Active === true ? false : true;
                oThis.Internal_OnChange_Table();

                if ( true === g_oToolBox.Table.Active )
                {
                    $("#tblPropDrag").show();
                    $("#tblProp").show();
                }
                else
                {
                    $("#tblPropDrag").hide();
                    $("#tblProp").hide();
                }
            }
        };


        var ButtonImageProps = document.createElement("div");
        ButtonImageProps.id                       = "id_toolbox_buttonImageProps";
        ButtonImageProps.style["float"]           = "left";
        ButtonImageProps.style.backgroundImage    = "url('menu/img/Props.png')";
        ButtonImageProps.style.width              = "34px";
        ButtonImageProps.style.height             = "32px";
        ToolBoxDiv.appendChild( ButtonImageProps );

        ButtonImageProps.onmouseover = function()
        {
            if ( true === oThis.Image.Enabled )
            {
                oThis.Image.Over = true;
                oThis.Internal_OnChange_Image();
            }
        };

        ButtonImageProps.onmouseout = function()
        {
            if ( true === oThis.Image.Enabled )
            {
                oThis.Image.Over = false;
                oThis.Internal_OnChange_Image();
            }
        };

        ButtonImageProps.onmousedown = function()
        {
            if ( true === oThis.Image.Enabled )
            {
                oThis.Image.Active = oThis.Image.Active === true ? false : true;
                oThis.Internal_OnChange_Image();

                if ( true === g_oToolBox.Image.Active )
                {
                    $("#imgPropDrag").show();
                    $("#imgProp").show();
                }
                else
                {
                    $("#imgPropDrag").hide();
                    $("#imgProp").hide();
                }
            }
        };


        var ButtonHdrFtrProps = document.createElement("div");
        ButtonHdrFtrProps.id                       = "id_toolbox_buttonHdrFtrProps";
        ButtonHdrFtrProps.style["float"]           = "left";
        ButtonHdrFtrProps.style.backgroundImage    = "url('menu/img/Props.png')";
        ButtonHdrFtrProps.style.width              = "34px";
        ButtonHdrFtrProps.style.height             = "28px";
        ToolBoxDiv.appendChild( ButtonHdrFtrProps );

        ButtonHdrFtrProps.onmouseover = function()
        {
            if ( true === oThis.HdrFtr.Enabled )
            {
                oThis.HdrFtr.Over = true;
                oThis.Internal_OnChange_HdrFtr();
            }
        };

        ButtonHdrFtrProps.onmouseout = function()
        {
            if ( true === oThis.HdrFtr.Enabled )
            {
                oThis.HdrFtr.Over = false;
                oThis.Internal_OnChange_HdrFtr();
            }
        };

        ButtonHdrFtrProps.onmousedown = function()
        {
            if ( true === oThis.HdrFtr.Enabled )
            {
                oThis.HdrFtr.Active = oThis.HdrFtr.Active === true ? false : true;
                oThis.Internal_OnChange_HdrFtr();

                if ( true === g_oToolBox.HdrFtr.Active )
                {
                    $("#hafPropDrag").show();
                    $("#hafProp").show();
                }
                else
                {
                    $("#hafPropDrag").hide();
                    $("#hafProp").hide();
                }
            }
        };

        var ButtonComments = document.createElement("div");
        ButtonComments.id                       = "id_toolbox_buttonCommentsProps";
        ButtonComments.style["float"]           = "left";
        ButtonComments.style.backgroundImage    = "url('menu/img/Props.png')";
        ButtonComments.style.width              = "34px";
        ButtonComments.style.height             = "26px";
        ToolBoxDiv.appendChild( ButtonComments );

        ButtonComments.onmouseover = function()
        {
            if ( true === oThis.Comments.Enabled )
            {
                oThis.Comments.Over = true;
                oThis.Internal_OnChange_Comments();
            }
        };

        ButtonComments.onmouseout = function()
        {
            if ( true === oThis.Comments.Enabled )
            {
                oThis.Comments.Over = false;
                oThis.Internal_OnChange_Comments();
            }
        };

        ButtonComments.onmousedown = function()
        {
            if ( true === oThis.Comments.Enabled )
            {
                oThis.Comments.Active = oThis.Comments.Active === true ? false : true;
                oThis.Internal_OnChange_Comments();

                if ( true === g_oToolBox.Comments.Active )
                {
                    $("#commentsDrag").show();
                    $("#comments").show();

                    editor.asc_showComments();
                }
                else
                {
                    $("#commentsDrag").hide();
                    $("#comments").hide();

                    Comment_HideCurrentComment();

                    editor.asc_hideComments();
                }
            }
        };

        var ButtonUsers = document.createElement("div");
        ButtonUsers.id                       = "id_toolbox_buttonUsersProps";
        ButtonUsers.style["float"]           = "left";
        ButtonUsers.style.backgroundImage    = "url('menu/img/Props.png')";
        ButtonUsers.style.width              = "34px";
        ButtonUsers.style.height             = "30px";
        ToolBoxDiv.appendChild( ButtonUsers );

        ButtonUsers.onmouseover = function()
        {
            if ( true === oThis.Users.Enabled )
            {
                oThis.Users.Over = true;
                oThis.Internal_OnChange_Users();
            }
        };

        ButtonUsers.onmouseout = function()
        {
            if ( true === oThis.Comments.Enabled )
            {
                oThis.Users.Over = false;
                oThis.Internal_OnChange_Users();
            }
        };

        ButtonUsers.onmousedown = function()
        {
            if ( true === oThis.Users.Enabled )
            {
                oThis.Users.Active = oThis.Users.Active === true ? false : true;
                oThis.Internal_OnChange_Users();

                if ( true === g_oToolBox.Users.Active )
                {
                    $("#prUsersDrag").show();
                    $("#prUsers").show();
                    $("#prChatDrag").show();
                    $("#prChat").show();
                }
                else
                {
                    $("#prUsersDrag").hide();
                    $("#prUsers").hide();
                    $("#prChatDrag").hide();
                    $("#prChat").hide();
                }
            }
        };

        this.Internal_OnChange_Paragraph();
        this.Internal_OnChange_Table();
        this.Internal_OnChange_Image();
        this.Internal_OnChange_HdrFtr();
        this.Internal_OnChange_Comments();
        this.Internal_OnChange_Users();
    };

    this.Disable_Props = function()
    {
        this.Paragraph.Enabled = false;
        this.Table.Enabled     = false;
        this.Image.Enabled     = false;
        this.HdrFtr.Enabled    = false;

        this.Internal_OnChange_Paragraph();
        this.Internal_OnChange_Table();
        this.Internal_OnChange_Image();
        this.Internal_OnChange_HdrFtr();
    };

    this.Enable_Paragraph = function()
    {
        this.Paragraph.Enabled = true;
        this.Internal_OnChange_Paragraph();
    };

    this.Enable_Table = function()
    {
        this.Table.Enabled = true;
        this.Internal_OnChange_Table();
    };

    this.Enable_Image = function()
    {
        this.Image.Enabled = true;
        this.Internal_OnChange_Image();
    };

    this.Enable_HdrFtr = function()
    {
        this.HdrFtr.Enabled = true;
        this.Internal_OnChange_HdrFtr();
    };

    this.Activate_Users = function()
    {
        this.Users.Active = true;
        this.Internal_OnChange_Users();

        $("#prUsersDrag").show();
        $("#prUsers").show();
        $("#prChatDrag").show();
        $("#prChat").show();
    };

    this.Internal_OnChange_Paragraph = function()
    {
        var Button = document.getElementById("id_toolbox_buttonParaProps");
        var BackGroundPosition = "";

        if ( true != this.Paragraph.Enabled )
        {
            BackGroundPosition = "0px -393px";
        }
        else
        {
            if ( true === this.Paragraph.Over )
                BackGroundPosition = "0px -533px";
            else if ( true === this.Paragraph.Active )
                BackGroundPosition = "0px -253px";
            else
                BackGroundPosition = "0px -113px";
        }

        Button.style.backgroundPosition = BackGroundPosition;
    };

    this.Internal_OnChange_Table = function()
    {
        var Button = document.getElementById("id_toolbox_buttonTableProps");
        var BackGroundPosition = "";

        if ( true != this.Table.Enabled )
        {
            BackGroundPosition = "0px -306px";
        }
        else
        {
            if ( true === this.Table.Over )
                BackGroundPosition = "0px -446px";
            else if ( true === this.Table.Active )
                BackGroundPosition = "0px -166px";
            else
                BackGroundPosition = "0px -26px";
        }

        Button.style.backgroundPosition = BackGroundPosition;
    };

    this.Internal_OnChange_Image = function()
    {
        var Button = document.getElementById("id_toolbox_buttonImageProps");
        var BackGroundPosition = "";

        if ( true != this.Image.Enabled )
        {
            BackGroundPosition = "0px -361px";
        }
        else
        {
            if ( true === this.Image.Over )
                BackGroundPosition = "0px -501px";
            else if ( true === this.Image.Active )
                BackGroundPosition = "0px -221px";
            else
                BackGroundPosition = "0px -81px";
        }

        Button.style.backgroundPosition = BackGroundPosition;
    };

    this.Internal_OnChange_HdrFtr = function()
    {
        var Button = document.getElementById("id_toolbox_buttonHdrFtrProps");
        var BackGroundPosition = "";

        if ( true != this.HdrFtr.Enabled )
        {
            BackGroundPosition = "0px -333px";
        }
        else
        {
            if ( true === this.HdrFtr.Over )
                BackGroundPosition = "0px -473px";
            else if ( true === this.HdrFtr.Active )
                BackGroundPosition = "0px -193px";
            else
                BackGroundPosition = "0px -53px";
        }

        Button.style.backgroundPosition = BackGroundPosition;
    };

    this.Internal_OnChange_Comments = function()
    {
        var Button = document.getElementById("id_toolbox_buttonCommentsProps");
        var BackGroundPosition = "";

        if ( true != this.Comments.Enabled )
        {
            BackGroundPosition = "0px -280px";
        }
        else
        {
            if ( true === this.Comments.Over )
                BackGroundPosition = "0px -420px";
            else if ( true === this.Comments.Active )
                BackGroundPosition = "0px -140px";
            else
                BackGroundPosition = "0px 0px";
        }

        Button.style.backgroundPosition = BackGroundPosition;
    };

    this.Internal_OnChange_Users = function()
    {
        var Button = document.getElementById("id_toolbox_buttonUsersProps");
        var BackGroundPosition = "";

        if ( true != this.Users.Enabled )
        {
            BackGroundPosition = "0px -620px";
        }
        else
        {
            if ( true === this.Users.Over )
                BackGroundPosition = "0px -650px";
            else if ( true === this.Users.Active )
                BackGroundPosition = "0px -590px";
            else
                BackGroundPosition = "0px -560px";
        }

        Button.style.backgroundPosition = BackGroundPosition;
    };
	
	// Chart Editor functions
	this.showChartSelectorDialog = function() {
		var t = this;
		var menu = $(
				"<div id='chartSelector' style='font-size: 12px;'>\
					\
					<span style='margin-left: 10px;'>Chart type</span>\
					 <select id='chartType' style='width: 340px; margin: 0 0 10px 10px;'>\
						<option value=" + c_oAscChartType.line + " selected>" + c_oAscChartType.line + "</option>\
						<option value=" + c_oAscChartType.bar + ">" + c_oAscChartType.bar + "</option>\
						<option value=" + c_oAscChartType.hbar + ">" + c_oAscChartType.hbar + "</option>\
						<option value=" + c_oAscChartType.area + ">" + c_oAscChartType.area + "</option>\
						<option value=" + c_oAscChartType.pie + ">" + c_oAscChartType.pie + "</option>\
						<option value=" + c_oAscChartType.scatter + ">" + c_oAscChartType.scatter + "</option>\
						<option value=" + c_oAscChartType.stock + ">" + c_oAscChartType.stock + "</option>\
					</select>\
					\
					<span style='margin-left: 10px;'>Chart subtype</span>\
					<select id='chartSubType' style='width: 340px; margin-left: 10px;'>\
						<option value=" + c_oAscChartSubType.normal + " selected>" + c_oAscChartSubType.normal + "</option>\
						<option value=" + c_oAscChartSubType.stacked + ">" + c_oAscChartSubType.stacked + "</option>\
						<option value=" + c_oAscChartSubType.stackedPer + ">" + c_oAscChartSubType.stackedPer + "</option>\
					</select>\
				</div>"
				);
				
		$("body").append(menu);
		var chartForm = $("#chartSelector");
		
		$("#chartSelector").dialog({ autoOpen: false, closeOnEscape: true, width: 400, height: 180,
					resizable: false, modal: true, title: "Chart selector", draggable: true,
					open: function() {						
					},
					buttons: [
						{
							text: "Ok",
							click: function() {
								
								var type = chartForm.find("#chartType").find("option:selected").val();
								var subType = chartForm.find("#chartSubType").find("option:selected").val();								
								oChartEditor.setChartOptions(type, subType);
								
								t.showWordChartDialog();
								$(this).dialog("close");
							}
						},
						{
							text: "Cancel",
							click: function() {
								$(this).dialog("close");
							}
						}
					],
					close: function() {
						chartForm.remove();
					},
					create: function() {
					}
		});
		chartForm.dialog("open");
	}
	
	this.showWordChartDialog = function(chartIndex) {
	
		menu = $(
			"<div id='chartEditor'>\
			</div>");

		$("body").append(menu);		
		var chartForm = $("#chartEditor");
		
		chartForm.dialog({ autoOpen: false, closeOnEscape: true, width: 1000, height: 600,
					resizable: true, modal: true, title: "Chart editor", draggable: true,
					open: function() {
						var frameHtml = oChartEditor.getFrame(chartIndex);
						chartForm.append(frameHtml);
					},
					buttons: [
						{
							text: "Save & Exit",
							click: function() {
								var chartInfo = oChartEditor.getChartEditorInfo();
								if ( chartInfo && chartInfo.imageBase64 )
									editor.AddImageUrl(chartInfo.imageBase64);
								
								$(this).dialog("close");
							}
						},
						{
							text: "Cancel",
							click: function() {
								$(this).dialog("close");
							}
						}
					],
					close: function() {
						chartForm.remove();						
						oChartEditor.removeFrame();
					},
					create: function() {
					}
		});
		chartForm.dialog("open");
	}
	
	this.showChartEditData = function() {
		menu = $(
			"<div id='chartEditData'>\
				<span style='font-size: 12px; margin-left: 10px;'>Chart index</span><br>\
				<select id='chartSelector' style='width: 80px; margin-left: 10px;'></select>\
			</div>");

		$("body").append(menu);		
		
		var t = this;
		var chartListForm = $("#chartEditData");
		var comboBox = $("#chartSelector");
		
		chartListForm.dialog({ autoOpen: false, closeOnEscape: true, width: 300, height: 160,
					resizable: false, modal: true, title: "Select chart for editing data", draggable: true,
					open: function() {
						var chartCount = oChartEditor.getChartCount();
						var options = "";
						for (var i = 0; i < chartCount; i++) {
							options += "<option value='" + i + "'>" + (i + 1) + "</option>";
						}
						comboBox.html(options);
					},
					buttons: [
						{
							text: "Ok",
							click: function() {		
								
								t.showWordChartDialog(parseInt(comboBox.find('option:selected').val()));
								$(this).dialog("close");
							}
						},
						{
							text: "Cancel",
							click: function() {
								$(this).dialog("close");
							}
						}
					],
					close: function() {
						chartListForm.remove();
					},
					create: function() {
					}
		});
		chartListForm.dialog("open");
	}
}

var g_oToolBox = new CToolBox();
