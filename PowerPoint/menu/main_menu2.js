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
    $("#td_shape").click(
        function()
        {
            if(!IsVisibleMenu)
            {
                var offset=$("#td_shape").offset();
                offset.top += $("#td_shape").outerHeight() - 1;
                $("#shapeBox").css("top", offset.top);
                $("#shapeBox").css("left", offset.left);
                $("#shapeBox").attr("init", "shapePrst").show();
            }
            else
            {
                $("#shapeBox").attr("init", "shapePrst").hide();
            }
            IsVisibleMenu = false;
        }
    );
    $("#shapeGroup").click(function(){
       editor.StartAddShape('group');
    });
    $("#shapeUnGroup").click(function(){
       editor.StartAddShape('ungroup');
    });
    $(".cell").mousedown(
        function()
        {
            $(this).css("border", "3px solid #000");
            editor.StartAddShape($(this).attr("title"));
        }
    );
    $(".cell").mouseover(
        function()
        {
            $(this).css("border", "1px solid #000");
        }
    );
    $(".cell").mouseup(
        function()
        {
            $(this).css("border", "1px solid #000");
        }
    );
    $(".cell").mouseout(
        function()
        {
            $(this).css("border", "0px solid #000");
        }
    );
$("#shapeOffsetX,#shapeOffsetY, #shapeRectX, #shapeRectY,#shapeColor, #shapeAlpha, #shapeRotation, #shapeShadowColor, #shapeShadowLength,#shapeShadowAngle, #shapeLineColor, #shapeLineWeight, #shapeShadowAlpha,#shapeTop,#shapeLeft,#imgW, #imgH, #imgLeft, #imgTop, #imgRight, #imgBottom, #imgX, #imgY, #hafHF, #tblW, #tblCS, #tblMarLeft, #tblMarTop, #tblMarRight, #tblMarBottom, #tblIndentLeft, #tblLeft, #tblTop, #tblRight, #tblBottom, #tblBrdSize, #tblBrdColor, #tblBrdBGColor, #imgURL, #tblCellBrdSize, #tblCellBrdColor, #tblCellBrdSize, #tblCellBrdColor, #tblCellBrdBGColor, #tblDefMarLeft, #tblDefMarTop, #tblDefMarRight, #tblDefMarBottom, #tblX, #tblY, #prFirst, #prLeft, #prRight, #prLineHeight, #prAfter, #prBefore").focus(function(){
	editor.asc_enableKeyEvents(false);
}).blur(function(){editor.asc_enableKeyEvents(true);})
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
case "td_selectAll":    break;
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
	case "h10":
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
});



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
$("#td_orient, #td_redo, #td_undo, #td_bold, #td_italic, #td_underline, #td_print, #td_copy, #td_paste, #td_justifycenter, #td_justifyright, #td_justifyleft, #td_justifyblock, #td_checkspell, #td_image, #td_image2, #td_imageInText, #td_imageInText2, #td_link, #td_indent, #td_outdent, #bulletedlist, #multilist, #numberedlist, #td_paragraphMarks,#td_tl_superscript, #td_tl_subscript, #td_instbl, #td_fontsizeOut, #td_fontsizeIn").click(function(){
	switch (this.id){
        case "td_undo":
			editor.Undo();
			break;
		case "td_redo":
			editor.Redo();
			break;
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
			var _image = editor.ImageLoader.LoadImage("./Images/Test.jpg", 0);
			if (null != _image)
				editor.WordControl.m_oLogicDocument.Add_FlowImage(50, 50, _image.src);
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
		case "td_link":

            //editor.WordControl.m_oLogicDocument.Document_CreateFontMap();
            var String = prompt("Enter text","text");
            editor.WordControl.m_oLogicDocument.Search_Start(String);
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
	editor.asc_registerCallback("asc_onVerticalAlign", function(){
		switch(arguments[0]){
			case vertalign_Baseline:{
				$("#td_tl_subscript").removeClass("iconPressed");
				$("#td_tl_superscript").removeClass("iconPressed");
				break;
			}
			case vertalign_SubScript:{
				$("#td_tl_subscript").addClass("iconPressed");
				$("#td_tl_superscript").removeClass("iconPressed");
				break;
			}
			case vertalign_SuperScript:{
				$("#td_tl_subscript").removeClass("iconPressed");
				$("#td_tl_superscript").addClass("iconPressed");
				break;
			}
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
		$("#imgProp, #tblProp, #hafProp, #prProp, #shapeProp").hide();
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

		
		document.getElementById("tblCellBrdBGColor").value = 
		document.getElementById("tblBrdBGColor").value = 
		document.getElementById("tblMarLeft").value = 
		document.getElementById("tblMarTop").value = 
		document.getElementById("tblMarRight").value = 
		document.getElementById("tblMarBottom").value = 
		document.getElementById("tblMarType").value = 		
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
		document.getElementById("tblBrdSize").value = 
		//document.getElementById("tblBrdColor").value =
		document.getElementById("tblCellBrdColor").value = 
		document.getElementById("tblCellBrdSize").value = 
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
		
		$("#hafType").html("");
		document.getElementById("hafFP").checked = false;
		document.getElementById("hafOE").checked = false;
		document.getElementById("shapeFlipV").checked = false;
		document.getElementById("shapeFlipH").checked = false;
	})
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
	$("#prLineHeight").keypress(function(evt){
		evt = evt || window.event;
		if (evt.keyCode == 13){
			editor.put_PrLineSpacing(parseFloat($("#prLineHeight").val()))
		}
	})	
	$("#prAfter").keypress(function(evt){
		evt = evt || window.event;
		if (evt.keyCode == 13){
			editor.put_LineSpacingBeforeAfter(1,parseFloat($("#prAfter").val()))
		}
	})	
	$("#prBefore").keypress(function(evt){
		evt = evt || window.event;
		if (evt.keyCode == 13){
			editor.put_LineSpacingBeforeAfter(0,parseFloat($("#prBefore").val()))
		}
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
	editor.asc_registerCallback("asc_onFocusObject", function(){
		var arg = arguments[0];
		for (var i = 0; i < arg.length;i++){
			var elemArg = arg[i];
			if ( elemArg != undefined )
			{
				var ObjectType = elemArg.get_ObjectType();
				if ( ObjectType == c_oAscTypeSelectElement.Image){
					var elemVal = elemArg.get_ObjectValue();
					$("#imgProp").show();
					$("#imgH").val(elemVal.get_Height());
					$("#imgW").val(elemVal.get_Width());
					if (elemVal.get_WrappingStyle() == c_oAscWrapStyle.Inline){
						document.getElementById("imgWrapStyleInline").checked = true;
						document.getElementById("imgWrapStyleFlow").checked = false;
					}
					else if (elemVal.get_WrappingStyle() == c_oAscWrapStyle.Flow){
						document.getElementById("imgWrapStyleInline").checked = false;
						document.getElementById("imgWrapStyleFlow").checked = true;
					}
					if (elemVal.get_Paddings()){
						$("#imgLeft").val(elemVal.get_Paddings().get_Left());
						$("#imgTop").val(elemVal.get_Paddings().get_Top());
						$("#imgBottom").val(elemVal.get_Paddings().get_Bottom());
						$("#imgRight").val(elemVal.get_Paddings().get_Right());
					}
					else {
						$("#imgLeft").val("");
						$("#imgTop").val("");
						$("#imgBottom").val("");
						$("#imgRight").val("");
					}
					var pos = elemVal.get_Position();
					if (pos){
					
						$("#imgX").val(pos.get_X());
						$("#imgY").val(pos.get_Y());
					}
					else {
						$("#imgX").val("");
						$("#imgY").val("");		
					}
					if (elemVal.get_ImageUrl())
						$("#imgURL").val(elemVal.get_ImageUrl());
				}
				else if ( ObjectType == c_oAscTypeSelectElement.Table){
					$("#tblProp").show();
					var elemVal = elemArg.get_ObjectValue();
					if (elemVal.TableWidth != null && elemVal.TableWidth != undefined){
						document.getElementById("tblWOn").checked = true;
						document.getElementById("tblW").value = elemVal.TableWidth;
					}
					else{ 
						document.getElementById("tblWOn").checked = false;
						document.getElementById("tblW").value = "null";
					}
					if (elemVal.TableSpacing != null && elemVal.TableSpacing != undefined){
						document.getElementById("tblAllowSpacing").checked = true;
						document.getElementById("tblCS").value = elemVal.TableSpacing;
					}
					else{ 
						document.getElementById("tblAllowSpacing").checked = false;
						document.getElementById("tblCS").value = "null";
					}
					if (elemVal.TableAlignment){
						switch(elemVal.TableAlignment){
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
					}
					if (elemVal.TableWrappingStyle != null && elemVal.TableWrappingStyle != undefined){
						if (elemVal.TableWrappingStyle == c_oAscWrapStyle.Inline){
						document.getElementById("tblWrapStyle1").checked = true;
						document.getElementById("tblWrapStyle2").checked = false;}
						else if ( elemVal.TableWrappingStyle == c_oAscWrapStyle.Flow){
						document.getElementById("tblWrapStyle1").checked = false;
						document.getElementById("tblWrapStyle2").checked = true;}
					}
					if (elemVal.TableDefaultMargins){
						document.getElementById("tblDefMarLeft").value = elemVal.TableDefaultMargins.Left;
						document.getElementById("tblDefMarTop").value = elemVal.TableDefaultMargins.Top;
						document.getElementById("tblDefMarRight").value = elemVal.TableDefaultMargins.Right;
						document.getElementById("tblDefMarBottom").value = elemVal.TableDefaultMargins.Bottom;
					}
					else {
						document.getElementById("tblDefMarLeft").value = document.getElementById("tblDefMarTop").value = document.getElementById("tblDefMarRight").value = 
						document.getElementById("tblDefMarBottom").value = "null";
					}
					if (elemVal.CellMargins){
						document.getElementById("tblMarLeft").value = elemVal.CellMargins.Left;
						document.getElementById("tblMarTop").value = elemVal.CellMargins.Top;
						document.getElementById("tblMarRight").value = elemVal.CellMargins.Right;
						document.getElementById("tblMarBottom").value = elemVal.CellMargins.Bottom;
						switch(elemVal.CellMargins.Flag){
							case 0:document.getElementById("tblMarType").value = "TableDef"
							break;
							case 1:document.getElementById("tblMarType").value = "TableDef & Cell"
							break;
							case 2:document.getElementById("tblMarType").value = "Only Cell"
							break;
						}
					}
					else {
						document.getElementById("tblMarLeft").value = document.getElementById("tblMarTop").value = document.getElementById("tblMarRight").value = 
						document.getElementById("tblMarBottom").value = document.getElementById("tblMarType").value = "null";
					}
					if (elemVal.TableBackground){
						document.getElementById("tblBrdBGColor").value = "rgb("+elemVal.TableBackground.Color.r+","+elemVal.TableBackground.Color.g+","+elemVal.TableBackground.Color.b+")";
						if (elemVal.TableBackground.Value == 1)
							document.getElementById("tblBrdBGColorTran").checked = true;
						else document.getElementById("tblBrdBGColorTran").checked = false;
					}
					else {
						document.getElementById("tblBrdBGColor").value =  "null";
					}
					if (elemVal.CellsBackground){
						document.getElementById("tblCellBrdBGColor").value = "rgb("+elemVal.CellsBackground.Color.r+","+elemVal.CellsBackground.Color.g+","+elemVal.CellsBackground.Color.b+")";
						if (elemVal.CellsBackground.Value == 1)
							document.getElementById("tblCellBrdBGColorTran").checked = true;
						else document.getElementById("tblCellBrdBGColorTran").checked = false;
					}
					else {
						document.getElementById("tblCellBrdBGColor").value =  "null";
					}
					if (elemVal.CellBorders){
						if (elemVal.CellBorders.Left){
							document.getElementById("tblCellBrdLeft").checked = true
						}
						else document.getElementById("tblCellBrdLeft").checked = false
						
						if (elemVal.CellBorders.Top){
							document.getElementById("tblCellBrdTop").checked = true
						}
						else document.getElementById("tblCellBrdTop").checked = false
						
						if (elemVal.CellBorders.Right){
							document.getElementById("tblCellBrdRight").checked = true
						}
						else document.getElementById("tblCellBrdRight").checked = false
						
						if (elemVal.CellBorders.Bottom){
							document.getElementById("tblCellBrdBottom").checked = true
						}
						else document.getElementById("tblCellBrdBottom").checked = false
						
						if (elemVal.CellBorders.InsideV){
							document.getElementById("tblCellBrdInsideV").checked = true
						}
						else document.getElementById("tblCellBrdInsideV").checked = false
						
						if (elemVal.CellBorders.InsideH){
							document.getElementById("tblCellBrdInsideH").checked = true
						}
						else document.getElementById("tblCellBrdInsideH").checked = false
					}
					else {
						document.getElementById("tblCellBrdLeft").checked = 
						document.getElementById("tblCellBrdTop").checked = 
						document.getElementById("tblCellBrdRight").checked = 
						document.getElementById("tblCellBrdBottom").checked = 
						document.getElementById("tblCellBrdInsideV").checked = 
						document.getElementById("tblCellBrdInsideH").checked = false
					}
					if (elemVal.TableBorders){
						if (elemVal.TableBorders.Left){
							document.getElementById("tblBrdLeft").checked = true
						}
						else document.getElementById("tblBrdLeft").checked = false
						
						if (elemVal.TableBorders.Top){
							document.getElementById("tblBrdTop").checked = true
						}
						else document.getElementById("tblBrdTop").checked = false
						
						if (elemVal.TableBorders.Right){
							document.getElementById("tblBrdRight").checked = true
						}
						else document.getElementById("tblBrdRight").checked = false
						
						if (elemVal.TableBorders.Bottom){
							document.getElementById("tblBrdBottom").checked = true
						}
						else document.getElementById("tblBrdBottom").checked = false
						
						if (elemVal.TableBorders.InsideV){
							document.getElementById("tblBrdInsideV").checked = true
						}
						else document.getElementById("tblBrdInsideV").checked = false
						
						if (elemVal.TableBorders.InsideH){
							document.getElementById("tblBrdInsideH").checked = true
						}
						else document.getElementById("tblBrdInsideH").checked = false
					}
					else {
						document.getElementById("tblBrdLeft").checked = 
						document.getElementById("tblBrdTop").checked = 
						document.getElementById("tblBrdRight").checked = 
						document.getElementById("tblBrdBottom").checked = 
						document.getElementById("tblBrdInsideV").checked = 
						document.getElementById("tblBrdInsideH").checked = false
					}
					if (elemVal.TablePaddins){
						document.getElementById("tblLeft").value = elemVal.TablePaddins.Left;
						document.getElementById("tblTop").value = elemVal.TablePaddins.Top;
						document.getElementById("tblRight").value = elemVal.TablePaddins.Right;
						document.getElementById("tblBottom").value = elemVal.TablePaddins.Bottom;
					}
					else {
						document.getElementById("tblLeft").value = 
						document.getElementById("tblTop").value = 
						document.getElementById("tblRight").value = 
						document.getElementById("tblBottom").value = "null";
					}
					
					
					
				}
				else if ( ObjectType == c_oAscTypeSelectElement.Header){
					
					$("#hafProp").show();
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
					$("#prProp").show();
					var elemVal = elemArg.get_ObjectValue();
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
					if (elemVal.Spacing != null && elemVal.Spacing != undefined){
						$("#prLineHeight").val(elemVal.Spacing.Line);
						$("#prAfter").val(elemVal.Spacing.After);
						$("#prBefore").val(elemVal.Spacing.Before);
					}
					else {
						$("#prLineHeight").val("");
						$("#prAfter").val("");
						$("#prBefore").val("");
					}

					document.getElementById("prIntervBetween").checked = elemVal.ContextualSpacing;
					document.getElementById("prKeepLines").checked = elemVal.KeepLines;
					document.getElementById("prPageBreak").checked = elemVal.PageBreakBefore;
				}
				else if( ObjectType == c_oAscTypeSelectElement.Shape){
					/*
					{
						Position:{
							Left:0,
							Top: 0
						},
						Offset: {
							X: 0,
							Y: 0
						},
						Rect: {
							Height:0,
							Width:0
						},
						Rotation: 0,
						FlipH: false,
						FlipV: false,
						Shadow:{
							Color : { r : 0, g : 0, b : 0 },
							Length: 0,
							Angle: 0,
							Alpha: 0
						},
						Alpha: 0,
						Color : { r : 0, g : 0, b : 0 },
						Line:{
							Color : { r : 0, g : 0, b : 0 },
							Width:0
						}
					}
					*/
					$("#shapeProp").show();
					var elemVal = elemArg.get_ObjectValue();
					if (elemVal.Position != null && elemVal.Position != undefined){
						$("#shapeTop").val(elemVal.Position.Top);
						$("#shapeLeft").val(elemVal.Position.Left);
					}
					else {
						$("#shapeLeft").val(0);
						$("#shapeTop").val(0);
					}
					if (elemVal.Offset != null && elemVal.Offset != undefined){
						$("#shapeOffsetX").val(elemVal.Offset.X);
						$("#shapeOffsetY").val(elemVal.Offset.Y);
					}
					else {
						$("#shapeOffsetX").val(0);
						$("#shapeOffsetY").val(0);
					}
					if (elemVal.Rect != null && elemVal.Rect != undefined){
						$("#shapeRectX").val(elemVal.Rect.Height);
						$("#shapeRectY").val(elemVal.Rect.Width);
					}
					else {
						$("#shapeRectX").val(0);
						$("#shapeRectY").val(0);
					}
					if (elemVal.Rotation != null && elemVal.Rotation != undefined){
						$("#shapeRotation").val(elemVal.Rotation);
					}
					else {
						$("#shapeRotation").val(0);
					}
					if (elemVal.FlipH != null && elemVal.FlipH != undefined){
						document.getElementById("shapeFlipH").checked = elemVal.FlipH;
					}
					else {
						document.getElementById("shapeFlipH").checked = false;
					}
					if (elemVal.FlipV != null && elemVal.FlipV != undefined){
						document.getElementById("shapeFlipV").checked = elemVal.FlipV;
					}
					else {
						document.getElementById("shapeFlipV").checked = false;
					}
					
					if (elemVal.Shadow != null && elemVal.Shadow != undefined){
						$("#shapeShadowColor").val("rgb("+elemVal.Shadow.Color.r+","+elemVal.Shadow.Color.g+","+elemVal.Shadow.Color.b+")");
						$("#shapeShadowLength").val(elemVal.Shadow.Length);
						$("#shapeShadowAngle").val(elemVal.Shadow.Angle);
						$("#shapeShadowAlpha").val(elemVal.Shadow.Alpha);
					}
					else {
						$("#shapeShadowColor").val("");
						$("#shapeShadowLength").val(0);
						$("#shapeShadowAngle").val(0);
						$("#shapeShadowAlpha").val(0);
					}
					
					if (elemVal.Alpha != null && elemVal.Alpha != undefined){
						$("#shapeAlpha").val(elemVal.Alpha);
					}
					else {
						$("#shapeAlpha").val(0);
					}
					
					if (elemVal.Color != null && elemVal.Color != undefined){
						$("#shapeColor").val("rgb("+elemVal.Color.r+","+elemVal.Color.g+","+elemVal.Color.b+")");
					}
					else {
						$("#shapeColor").val("");
					}
					if (elemVal.Line != null && elemVal.Line != undefined){
						$("#shapeLineWeight").val(elemVal.Line.Width);
						if (elemVal.Line.Color != null && elemVal.Line.Color != undefined){
							$("#shapeLineColor").val("rgb("+elemVal.Line.Color.r+","+elemVal.Line.Color.g+","+elemVal.Line.Color.b+")");
						}
						else $("#shapeLineColor").val("");
					}
					else {
						$("#shapeLineWeight").val(0);
						$("#shapeLineColor").val("");
					}
					if (elemVal.Alpha != null && elemVal.Alpha != undefined){
						$("#shapeAlpha").val(elemVal.Alpha);
					}
					else {
						$("#shapeAlpha").val(0);
					}
				}
			}
		}
	})
	editor.asc_registerCallback("asc_onSaveUrl", function(){
		 window.parent.postMessage(JSON.stringify(arguments[0]),"*");
	})
	$("#imgApply").click(function(){
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
		
		var oPos = new CPosition();
		oPos.put_X( ($("#imgX").val()!="")?parseFloat($("#imgX").val()):null );
		oPos.put_Y( ($("#imgY").val()!="")?parseFloat($("#imgY").val()):null );
		
		oImgProp.put_Position( oPos );
		
		oImgProp.put_ImageUrl( ($("#imgURL").val()!="")?$("#imgURL").val():null );
		
		editor.ImgApply( oImgProp );
	});
	$("#tblApply").click(function(){
		var tblOBJ = new Object();
		if (document.getElementById("tblWOn").checked )
			tblOBJ.TableWidth = parseFloat( document.getElementById("tblW").value );
		else tblOBJ.TableWidth = null
		
		if (document.getElementById("tblAllowSpacing").checked )
			tblOBJ.TableSpacing = parseFloat( document.getElementById("tblCS").value );
		else tblOBJ.TableSpacing = null

		
		if( document.getElementById("tblAlignLeft").checked )
			tblOBJ.TableAlignment = 0;
		else if( document.getElementById("tblAlignCenter").checked )
			tblOBJ.TableAlignment = 1;
		else if( document.getElementById("tblAlignRight").checked )
			tblOBJ.TableAlignment = 2;
		else tblOBJ.TableAlignment = 0;
		tblOBJ.TableIndent = parseFloat( document.getElementById("tblIndentLeft").value );			
				
		tblOBJ.TableDefaultMargins = {
			Left:(document.getElementById("tblDefMarLeft").value=="" || document.getElementById("tblDefMarLeft").value == "null"? null: parseFloat(document.getElementById("tblDefMarLeft").value)),
			Top :(document.getElementById("tblDefMarTop").value=="" || document.getElementById("tblDefMarTop").value == "null"? null: parseFloat( document.getElementById("tblDefMarTop").value)),
			Right:(document.getElementById("tblDefMarRight").value==""||document.getElementById("tblDefMarRight").value == "null"? null: parseFloat(document.getElementById("tblDefMarRight").value)),
			Bottom:(document.getElementById("tblDefMarBottom").value==""||document.getElementById("tblDefMarBottom").value == "null"? null: parseFloat(document.getElementById("tblDefMarBottom").value))
		}
		
		tblOBJ.CellMargins = {
			Left : ( document.getElementById("tblMarLeft").value == "" || document.getElementById("tblMarLeft").value == "null"? null: parseFloat( document.getElementById("tblMarLeft").value ) ),
			Top : ( document.getElementById("tblMarTop").value == "" || document.getElementById("tblMarTop").value == "null"? null: parseFloat( document.getElementById("tblMarTop").value ) ),
			Right : (document.getElementById("tblMarRight").value == "" || document.getElementById("tblMarRight").value == "null"? null: parseFloat( document.getElementById("tblMarRight").value ) ),
			Bottom : (document.getElementById("tblMarBottom").value == "" || document.getElementById("tblMarBottom").value == "null"? null: parseFloat(document.getElementById("tblMarBottom").value))
		}
		
		if (document.getElementById("tblWrapStyle1").checked)
			tblOBJ.TableWrappingStyle = c_oAscWrapStyle.Inline;
		else if (document.getElementById("tblWrapStyle2").checked)
			tblOBJ.TableWrappingStyle = c_oAscWrapStyle.Flow;

        var Re = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
        if ( !document.getElementById("tblBrdBGColorTran").checked )
        {
            var BColor = document.getElementById("tblBrdBGColor").value;
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
            var BColor = document.getElementById("tblCellBrdBGColor").value;
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
		tblOBJ.TablePaddins =
        {
			Left:(document.getElementById("tblLeft").value=="" || document.getElementById("tblDefMarLeft").value == "null"? null: parseFloat(document.getElementById("tblDefMarLeft").value)),
			Top :(document.getElementById("tblTop").value=="" || document.getElementById("tblDefMarTop").value == "null"? null: parseFloat( document.getElementById("tblDefMarTop").value)),
			Right:(document.getElementById("tblRight").value==""||document.getElementById("tblDefMarRight").value == "null"? null: parseFloat(document.getElementById("tblDefMarRight").value)),
			Bottom:(document.getElementById("tblBottom").value==""||document.getElementById("tblDefMarBottom").value == "null"? null: parseFloat(document.getElementById("tblDefMarBottom").value))
        }
	
	    tblOBJ.TableBorders = // границы таблицы 
        {
			 Bottom :
				(!document.getElementById("tblBrdBottom").checked?
					null:
					{
						Color : { r : 0, g : 0, b : 0 },
						Value : border_Single,
						Size  : 0.2
					}
				),

            Left :
				(!document.getElementById("tblBrdLeft").checked?
					null:
					{
						Color : { r : 0, g : 0, b : 0 },
						Value : border_Single,
						Size  : 0.2
					}
				),

            Right :
				(!document.getElementById("tblBrdRight").checked?
					null:
					{
						Color : { r : 0, g : 0, b : 0 },
						Value : border_Single,
						Size  : 0.2
					}
				),

            Top :
				(!document.getElementById("tblBrdTop").checked?
					null:
					{
						Color : { r : 0, g : 0, b : 0 },
						Value : border_Single,
						Size  : 0.2
					}
				),

            InsideH :
				(!document.getElementById("tblBrdInsideH").checked?
					null:
					{
						Color : { r : 0, g : 0, b : 0 },
						Value : border_Single,
						Size  : 0.2
					}
				),

            InsideV :
				(!document.getElementById("tblBrdInsideV").checked?
					null:
					{
						Color : { r : 0, g : 0, b : 0 },
						Value : border_Single,
						Size  : 0.2
					}
				)
        }
		var BColor = document.getElementById("tblCellBrdColor").value;
		var Bits = Re.exec(BColor);
		var brdSize = parseFloat(document.getElementById("tblCellBrdSize").value)
		if (isNaN(brdSize) || brdSize < 0) brdSize = 0.2;
		if (Bits == null){
			Bits = new Array(4);
			Bits[1] = Bits[2] = Bits[3] = 0;
		}
		tblOBJ.CellBorders = // границы таблицы 
        {
			 Bottom :
				(!document.getElementById("tblCellBrdBottom").checked?
					null:
					{
						Color : { r : Bits[1], g : Bits[2], b : Bits[3] },
						Value : border_Single,
						Size  : brdSize
					}
				),

            Left :
				(!document.getElementById("tblCellBrdLeft").checked?
					null:
					{
						Color : { r : Bits[1], g : Bits[2], b : Bits[3] },
						Value : border_Single,
						Size  : brdSize
					}
				),

            Right :
				(!document.getElementById("tblCellBrdRight").checked?
					null:
					{
						Color : { r : Bits[1], g : Bits[2], b : Bits[3] },
						Value : border_Single,
						Size  : brdSize
					}
				),

            Top :
				(!document.getElementById("tblCellBrdTop").checked?
					null:
					{
						Color : { r : Bits[1], g : Bits[2], b : Bits[3] },
						Value : border_Single,
						Size  : brdSize
					}
				),

            InsideH :
				(!document.getElementById("tblCellBrdInsideH").checked?
					null:
					{
						Color : { r : Bits[1], g : Bits[2], b : Bits[3] },
						Value : border_Single,
						Size  : brdSize
					}
				),

            InsideV :
				(!document.getElementById("tblCellBrdInsideV").checked?
					null:
					{
						Color : { r : Bits[1], g : Bits[2], b : Bits[3] },
						Value : border_Single,
						Size  : brdSize
					}
				)
        }
	
		editor.tblApply(tblOBJ);
	})


     $("#shapePrpApply").click(function(){
        var Prop = {};
         var t, r, g, b, cx, cy;

         t=parseFloat($("#shapeLeft").val());
         if(!isNaN(t))
            Prop.pH=t;
         else
            Prop.pH=0;

         t=parseFloat($("#shapeTop").val());
         if(!isNaN(t))
            Prop.pV=t;
         else
            Prop.pV=0;

         cx=parseFloat($("#shapeRectX").val());
         if(isNaN(cx)|| cx<=0)
            cx=5;

         cy=parseFloat($("#shapeRectY").val());
         if(isNaN(cy)|| cy<=0)
            cy=5;

         Prop.ext={cx: cx, cy:cy};

         t=parseFloat($("#shapeRotation").val());
         if(!isNaN(t))
            Prop.rot=t;
         else
            Prop.rot=0;

          t=parseFloat($("#shapeLineWeight").val());
         if(!isNaN(t)&&t>0)
            Prop.line_width=t;
         else
            Prop.line_width=1;


         var Re = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
         var Bits = Re.exec($("#shapeColor").val());
         if(Bits!=null)
            Prop.fill_color = new CShapeColor(Bits[1], Bits[2], Bits[3]);
         else
            Prop.fill_color=0;

         Bits = Re.exec($("#shapeLineColor").val());

         if(Bits!=null)
            Prop.line_color = new CShapeColor(Bits[1], Bits[2], Bits[3]);
         else
            Prop.line_color = 0;

         t=parseInt($("#shapeAlpha").val());
         if(!isNaN(t)&&t>0)
            Prop.alpha=t;
         else
            Prop.alpha=255;
         Prop.tailEnd={};
         switch(parseInt($("#typesTailEnd").val()))
         {
             case 1:
             {
                 Prop.tailEnd.type=ar_arrow;
                 break;
             }
             case 2:
             {
                 Prop.tailEnd.type=ar_diamond;
                 break;
             }
             case 3:
             {
                 Prop.tailEnd.type=ar_oval;
                 break;
             }
             case 4:
             {
                 Prop.tailEnd.type=ar_none;
                 break;
             }
              case 5:
             {
                 Prop.tailEnd.type=ar_stealth;
                 break;
             }
             case 6:
             {
                 Prop.tailEnd.type=ar_triangle;
                 break;
             }
         }

         switch(parseInt($("#typesTailSize").val()))
         {
             case 1:
             {
                 Prop.tailEnd.len = sm;
                 Prop.tailEnd.w = sm;
                 break;
             }
             case 2:
             {
                 Prop.tailEnd.len = sm;
                 Prop.tailEnd.w = mid;
                 break;
             }
             case 3:
             {
                 Prop.tailEnd.len = sm;
                 Prop.tailEnd.w = lg;
                 break;
             }
             case 4:
             {
                 Prop.tailEnd.len = mid;
                 Prop.tailEnd.w = sm;
                 break;
             }
             case 5:
             {
                 Prop.tailEnd.len = mid;
                 Prop.tailEnd.w = mid;
                 break;
             }
             case 6:
             {
                 Prop.tailEnd.len = mid;
                 Prop.tailEnd.w = lg;
                 break;
             }
             case 7:
             {
                 Prop.tailEnd.len = lg;
                 Prop.tailEnd.w = sm;
                 break;
             }
             case 8:
             {
                 Prop.tailEnd.len = lg;
                 Prop.tailEnd.w = mid;
                 break;
             }
             case 9:
             {
                 Prop.tailEnd.len = lg;
                 Prop.tailEnd.w = lg;
                 break;
             }
         }


         Prop.headEnd={};
         switch(parseInt($("#typesHeadEnd").val()))
         {
             case 1:
             {
                 Prop.headEnd.type=ar_arrow;
                 break;
             }
             case 2:
             {
                 Prop.headEnd.type=ar_diamond;
                 break;
             }
             case 3:
             {
                 Prop.headEnd.type=ar_oval;
                 break;
             }
             case 4:
             {
                 Prop.headEnd.type=ar_none;
                 break;
             }
              case 5:
             {
                 Prop.headEnd.type=ar_stealth;
                 break;
             }
             case 6:
             {
                 Prop.headEnd.type=ar_triangle;
                 break;
             }
         }

         switch(parseInt($("#typesHeadSize").val()))
         {
             case 1:
             {
                 Prop.headEnd.len = sm;
                 Prop.headEnd.w = sm;
                 break;
             }
             case 2:
             {
                 Prop.headEnd.len = sm;
                 Prop.headEnd.w = mid;
                 break;
             }
             case 3:
             {
                 Prop.headEnd.len = sm;
                 Prop.headEnd.w = lg;
                 break;
             }
             case 4:
             {
                 Prop.headEnd.len = mid;
                 Prop.headEnd.w = sm;
                 break;
             }
             case 5:
             {
                 Prop.headEnd.len = mid;
                 Prop.headEnd.w = mid;
                 break;
             }
             case 6:
             {
                 Prop.headEnd.len = mid;
                 Prop.headEnd.w = lg;
                 break;
             }
             case 7:
             {
                 Prop.headEnd.len = lg;
                 Prop.headEnd.w = sm;
                 break;
             }
             case 8:
             {
                 Prop.headEnd.len = lg;
                 Prop.headEnd.w = mid;
                 break;
             }
             case 9:
             {
                 Prop.headEnd.len = lg;
                 Prop.headEnd.w = lg;
                 break;
             }
         }

         Prop.shadow={};
         Bits = Re.exec($("#shapeShadowColor").val());
         Prop.shadow.color = new CShapeColor(Bits[1], Bits[2], Bits[3]);
         t=parseFloat($("#shapeShadowLength").val());
         if(!isNaN(t))
            Prop.shadow.length=t;
         else
            Prop.shadow.length=0;

          t=parseFloat($("#shapeShadowAngle").val());
         if(!isNaN(t))
            Prop.shadow.angle=t;
         else
            Prop.shadow.angle=0;


          t=parseInt($("#shapeShadowAlpha").val());
         if(!isNaN(t))
            Prop.shadow.alpha=t;
         else
            Prop.shadow.alpha=255;

         Prop.flipH=$('#shapeFlipH').prop('checked');
         Prop.flipV=$('#shapeFlipV').prop('checked');
         editor.SetShapeProperties(Prop);

     });
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
	//c_DocInfo.put_Origin(documentOrigin);
	
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