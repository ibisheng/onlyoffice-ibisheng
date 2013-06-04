$(function () {
	var  IsVisibleMenu = false, elem, contextGrad, gradient, gradSelectPosTop = 1, imgd, pix, colorSelecterClick, newColorSelected={r:255,g:0,b:0},lastColorSelected={r:255,g:0,b:0};
	var autoFilterObj;
	
	var docTitle = window.location.toString().match(/&title=([^&]+)&/);
	if (docTitle) {
		$("#titleSP").append('<span>' + window.decodeURI(docTitle[1]) + '</span>');
	}

	//--Bottom panel--

	// init tab navigation
	$("#ws-navigation .nav-buttons .btn").click(onTabNavigationBtnClicked);
	// init scaling buttons
	$("#ws-navigation .ws-zoom-button").click(onZoomBtnClicked);
	
	function renderTabs() {
		var r = $(),
				l = api.asc_getWorksheetsCount(),
				isFirst = true,
				hiddenSheets = api.asc_getHiddenWorksheets();
		var isHidden = function (index) {
			for (var i = 0; i < hiddenSheets.length; ++i) {
				if (index == hiddenSheets[i].index) {
					return true;
				}
				else if (index < hiddenSheets[i].index)
					break;
			}
			return false;
		};
		for (var i = 0; i < l; ++i) {
			if (isHidden (i))
				continue;
			var li = $(
					'<li' + (isFirst ? ' class="first"' : '') + '>' +
					'<div class="tab-prefix"/>' +
					'<div class="tab-name">' + api.asc_getWorksheetName(i) + '</div>' +
					'<div class="tab-suffix"/>' +
				'</li>')
				.data("ws-index", i)
				.on("click", function (event) {onTabClicked( $(this).data("ws-index") );});
			r = r.add(li);
			isFirst = false;
		}
		return r;
	}

	function onSheetsChanged() {
		$("#ws-navigation .tabs")
			.empty()
			.append(renderTabs());
		onTabClicked( api.asc_getActiveWorksheetIndex() );
	}

	function showZoomValue() {
		$("#ws-navigation .ws-zoom-input")
				.val(Math.round(api.asc_getZoom() * 100) + "%");
	}

	//--Event handlers--

	function onError(id,level){
		consolelog("id "+ id + " level " + level)
		switch(arguments[0]){
			case c_oAscError.ID.FrmlWrongCountParentheses:
				// alert("неверное количество скобок");
				if(console&&console.error)
					console.error("!!! "+"неверное количество скобок");
				break;
			case c_oAscError.ID.FrmlWrongOperator:
				// alert("неверный оператор");
				if(console&&console.error)
					console.error("!!! "+"неверный оператор");
				break;
			case c_oAscError.ID.FrmlWrongMaxArgument:
				// alert("превышено максимальное число аргументов");
				if(console&&console.error)
					console.error("!!! "+"превышено максимальное число аргументов");
				break;
			case c_oAscError.ID.FrmlWrongCountArgument:
				// alert("неверное количество аргументов");
				if(console&&console.error)
					console.error("!!! "+"неверное количество аргументов");
				break;
			case c_oAscError.ID.FrmlWrongFunctionName:
				// alert("неверное название функции");
				if(console&&console.error)
					console.error("!!! "+"неверное название функции");
				break;
			case c_oAscError.ID.FrmlAnotherParsingError:
				// alert("прочие ошибки анализа");
				if(console&&console.error)
					console.error("!!! "+"прочие ошибки анализа");
				break;
			case c_oAscError.ID.FrmlWrongArgumentRange:
				// alert("неверный диапазон");
				if(console&&console.error)
					console.error("!!! "+"неверный диапазон");
				break;
		}
	}

	function onStartAction() {
		consolelog("onStartAction " + arguments[0] + " " + arguments[1]);
	}
	
	function onSetAFDialog(autoFilterObject) {
		var oAutoFilterElements = $("#AutoFilterElements");
		oAutoFilterElements.empty();
		autoFilterObj = autoFilterObject;
		var top = autoFilterObject.asc_getY();
		var left = autoFilterObject.asc_getX();
		var width = autoFilterObject.asc_getWidth();
		var height = autoFilterObject.asc_getHeight();
		var cellId = autoFilterObject.asc_getCellId();
		var elements = autoFilterObject.asc_getResult();
		
		var oSelected = " SelectedAutoFilterItem";
		var unSelected = " NoSelectedAutoFilterItem";

		var element = '1'; 		
		if (0 == elements.length)
			oAutoFilterElements.append("<div class='AutoFilterItem" + unSelected + "'>" + '(Empty)' + "</div>");	
		else
		{
			var isSelect = true;
			for(i = 0; i < elements.length; i++)
			{
				var element = elements[i].val;
				if(element == '')
					element = 'empty';
				var isSelected = oSelected;
				var styleNone = '';
				if(!elements[i].visible)
					isSelected = unSelected
				if(elements[i].visible == 'hidden')
					styleNone = ' hidden'
				/*else if(elements[i].rep)
					styleNone = ' hidden2'*/
				if(elements[i].visible == false || elements[i].visible == undefined)
					isSelect = false;
				oAutoFilterElements.append("<div class='AutoFilterItem" + isSelected + styleNone + "'>" + element + "</div>");
			}
			if(!isSelect)
				$('#selectAllElements').removeClass('SelectedAutoFilterItem');
			else
				$('#selectAllElements').addClass('SelectedAutoFilterItem');
		}
		if(elements.dF)
			$('#numericalFilter').addClass('SelectedAutoFilterItem');
		else
			$('#numericalFilter').removeClass('SelectedAutoFilterItem');
		
		$('#MenuAutoFilter').css('top',top + height+ parseFloat($('#wb-widget').css('top')));
		$('#MenuAutoFilter').css('left',left + parseFloat($('#wb-widget').css('left')));
		$('#MenuAutoFilter').attr('idcolumn',cellId)
		
		$('#MenuAutoFilter').show();
		$(".AutoFilterItem").bind("click", function(){if ($(this).hasClass('SelectedAutoFilterItem'))$(this).removeClass('SelectedAutoFilterItem').addClass('NoSelectedAutoFilterItem');else $(this).addClass('SelectedAutoFilterItem').removeClass('NoSelectedAutoFilterItem')});
		$(".AutoFilterItem").bind("mouseover", function(){$(this).addClass("HideAutoFilterItem");});
		$(".AutoFilterItem").bind("mouseout", function(){$(this).removeClass("HideAutoFilterItem");});
		$(".NumericalFilterItem").bind("mouseover", function(){$(this).addClass("HideAutoFilterItem");});
		$(".NumericalFilterItem").bind("mouseout", function(){$(this).removeClass("HideAutoFilterItem");});
	}

	function onEndAction(type, id) {
		if (type === c_oAscAsyncActionType.BlockInteraction) {
			switch (id) {
				case c_oAscAsyncAction.Open:
					onSheetsChanged();
					showZoomValue();
					break;
			}
		}
		consolelog("onEndAction " + arguments[0] + " " + arguments[1]);
	}

	function onTabNavigationBtnClicked(event) {
		var btn = $(event.currentTarget),
				tablist = $("#ws-navigation .tabs"),
				items, first, last, width;

		if (btn.hasClass("first")) {
			tablist.children().removeClass("first")
					.filter(":first").addClass("first")
					.end().show();
			return true;
		}

		if (btn.hasClass("last")) {
			items = tablist.children(":visible").removeClass("first");
			last = items.last();
			width = tablist.width();
			while (last.position().left + last.outerWidth() > width) {
				first = items.first().hide();
				items = items.not(first);
			}
			items.first().addClass("first");
			return true;
		}

		if (btn.hasClass("prev")) {
			first = tablist.children(":visible:first");
			last = first.prev();
			if (last.length > 0) {
				first.removeClass("first");
				last.addClass("first").show();
			}
			return true;
		}

		if (btn.hasClass("next")) {
			items = tablist.children();
			last = items.last();
			width = tablist.width();
			if (last.position().left + last.outerWidth() > width) {
				items.filter(":visible:first").removeClass("first").hide()
						.next().addClass("first");
			}
			return true;
		}

		return true;
	}

	function onTabClicked(index) {
		$("#ws-navigation .tabs").children()
				.removeClass("active")
				.eq(index).addClass("active");
		api.asc_showWorksheet(index);
		return true;
	}

	function onZoomBtnClicked(event) {
		var btn = $(event.currentTarget),
				f   = api.asc_getZoom(),
				df  = btn.hasClass("plus") ? 0.05 : (btn.hasClass("minus") ? -0.05 : 0);

		if (f + df > 0) {
			api.asc_setZoom(f + df);
		}

		showZoomValue();

		return true;
	}

	function updateSelectionNameInfo(name) {
		$("#cc1").val(name);
	}

	function updateCellInfo(info) {
	/*
					info : {
						"name":      "A1",
						"text":      текст ячейки
						"halign":    "left / right / center",
						"valign":    "top / bottom / center",
						"flags": {
							"merge":       true / false,
							"shrinkToFit": true / false,
							"wrapText":    true / false
						},
						"font": {
							"name":        "Arial",
							"size":        10,
							"bold":        true / false,
							"italic":      true / false,
							"underline":   true / false,
							"strikeout":   false,//TODO:,
							"subscript":   false,//TODO:,
							"superscript": false,//TODO:,
							"color":       "#RRGGBB" / "#RGB"
						},
						"fill": {
							"color": "#RRGGBB" / "#RGB"
						},
						"border": {
							"left": {
								"width": 0-3 пиксела,
								"style": "none / thick / thin / medium / dashDot / dashDotDot / dashed / dotted / double / hair / mediumDashDot / mediumDashDotDot / mediumDashed / slantDashDot"
								"color": "#RRGGBB" / "#RGB"
							},
							"top": {
								"width":
								"style":
								"color":
							},
							"right": {
								"width":
								"style":
								"color":
							},
							"bottom": {
								"width":
								"style":
								"color":
							},
							"diagDown": { диагональная линия слева сверху вправо вниз
								"width":
								"style":
								"color":
							},
							"diagUp": { диагональная линия слева снизу вправо вверх
								"width":
								"style":
								"color":
							}
						},
						formula: "SUM(C1:C6)"
					}
*/
			consolelog(
				"cell: " + info.asc_getName() + ", " +

				"font: " + info.asc_getFont().asc_getName() + " " + info.asc_getFont().asc_getSize() +
				(info.asc_getFont().asc_getBold() ? " bold" : "") +
				(info.asc_getFont().asc_getItalic() ? " italic" : "") +
				(info.asc_getFont().asc_getUnderline() ? " underline" : "") + ", " +

				"color: " + (info.asc_getFont().asc_getColor() == null ? "0" : info.asc_getFont().asc_getColor().get_hex()) + ", " +

				"fill: " + (info.asc_getFill().asc_getColor() == null ? "0" : info.asc_getFill().asc_getColor().get_hex()) + ", " +

				"halign: " + info.asc_getHorAlign() + ", " +

				"valign: " + info.asc_getVertAlign() + ", " +

				"border:" +
				(info.asc_getBorders().asc_getLeft().asc_getWidth() > 0 ? " l" : "") +
				(info.asc_getBorders().asc_getTop().asc_getWidth() > 0 ? " t" : "") +
				(info.asc_getBorders().asc_getRight().asc_getWidth() > 0 ? " r" : "") +
				(info.asc_getBorders().asc_getBottom().asc_getWidth() > 0 ? " b" : "") +
				(info.asc_getBorders().asc_getDiagDown().asc_getWidth() > 0 ? " dd" : "") +
				(info.asc_getBorders().asc_getDiagUp().asc_getWidth() > 0 ? " du" : "") + ", " +

				"wrap: " + info.asc_getFlags().asc_getWrapText() + ", " +

				"merge: " + info.asc_getFlags().asc_getMerge() + ", " +

				"text: " + info.asc_getText() +

				", formula: " + info.asc_getFormula()

			)
			if(info.asc_getFormula())
				$("#cv1").val("="+info.asc_getFormula())
			else
				$("#cv1").val(info.asc_getText())

			info.asc_getFlags().asc_getWrapText() ? $("#td_text_wrap").addClass("iconPressed") : $("#td_text_wrap").removeClass("iconPressed");

			info.asc_getFlags().asc_getMerge() ? $("#td_mergeCells").addClass("iconPressed") : $("#td_mergeCells").removeClass("iconPressed");

			info.asc_getFont().asc_getBold() ? $("#td_bold").addClass("iconPressed") : $("#td_bold").removeClass("iconPressed");

			info.asc_getFont().asc_getItalic() ? $("#td_italic").addClass("iconPressed") : $("#td_italic").removeClass("iconPressed");

			info.asc_getFont().asc_getUnderline() ? $("#td_underline").addClass("iconPressed") : $("#td_underline").removeClass("iconPressed");

			$("#fontSelectVal").text(info.asc_getFont().asc_getName());
			$("#fontSizeSelectVal").text(info.asc_getFont().asc_getSize()+"pt");

			switch(info.asc_getHorAlign()){
				case "right":
					$("td[id*='td_ta']").removeClass("iconPressed");
					$("#td_ta_right").addClass("iconPressed");
					break;
				case "left":
					$("td[id*='td_ta']").removeClass("iconPressed");
					$("#td_ta_left").addClass("iconPressed");
					break;
				case "center":
					$("td[id*='td_ta']").removeClass("iconPressed");
					$("#td_ta_center").addClass("iconPressed");
					break;
				case "justify":
					$("td[id*='td_ta']").removeClass("iconPressed");
					$("#td_ta_justify").addClass("iconPressed");
					break;
			}

	}

	//------API---------

	var api = new Asc.spreadsheet_api("wb-widget", "cv1");
	//api.asc_setViewerMode(true);
	var oTmpHyperlinkObj = null;
	var aDialogNames = [];

	// Comment events	
	api.asc_registerCallback("asc_onMouseMove", eventMouseMoveComment);
	api.asc_registerCallback("asc_onAddComment", eventAddComment);
	api.asc_registerCallback("asc_onRemoveComment", eventRemoveComment);
	api.asc_registerCallback("asc_onChangeCommentData", eventChangeCommentData);
	api.asc_registerCallback("asc_onUpdateCommentPosition", eventUpdateCommentPosition);
	
	api.asc_registerCallback("asc_onShowComment", eventShowComment);
	api.asc_registerCallback("asc_onHideComment", eventHideComment);
	
	api.asc_registerCallback("asc_onShowChartDialog", showChartDialog);
	api.asc_registerCallback("asc_onStartAction", onStartAction);
	api.asc_registerCallback("asc_onEndAction", onEndAction);
	api.asc_registerCallback("asc_onError", onError);
	api.asc_registerCallback("asc_onSelectionChanged", updateCellInfo);
	api.asc_registerCallback("asc_onSelectionNameChanged", updateSelectionNameInfo);
	api.asc_registerCallback("asc_onSheetsChanged", onSheetsChanged);
	api.asc_registerCallback("asc_onZoomChanged", function(){
		console.log(arguments[0]);
		$("#ws-navigation .ws-zoom-input")
				.val(Math.round(arguments[0] * 100) + "%");
	});

	api.asc_registerCallback("asc_onHyperlinkClick", function(url){
		if (url)  {
			window.open(url);
		}
	});
	api.asc_registerCallback("asc_onAdvancedOptions", function(options){
		console.log(options);

		$("#pageCodeSelect").empty();
		$("#DelimiterList").empty();

		for(var i = 0; i < options.asc_getOptions().asc_getCodePages().length; i++){
			if ($("#pageCodeSelect option[value='" + options.asc_getOptions().asc_getCodePages()[i].asc_getCodePageName() + "']").length == 0) {
				$("#pageCodeSelect").append("<option value='" + options.asc_getOptions().asc_getCodePages()[i].asc_getCodePage() + "'>" + options.asc_getOptions().asc_getCodePages()[i].asc_getCodePageName() + "</option>");
			}
		}

		for(var id in c_oAscCsvDelimiter){
			if (0 == c_oAscCsvDelimiter[id])
				continue;
			if ($("#DelimiterList option[value='" + id + "']").length == 0) {
				$("#DelimiterList").append("<option value='" + c_oAscCsvDelimiter[id] + "'>" + id + "</option>");
			}
		}
		if ("save" != $("#dialogSaveCsv").attr("typeDialog"))
			$("#dialogSaveCsv").attr("typeDialog", "open");
		$("#dialogSaveCsv").dialog("open");

	});
	api.asc_registerCallback("asc_onSetAFDialog", onSetAFDialog);
	
	api.asc_registerCallback("asc_onConfirmAction", function(){
		var arg = arguments;
		$("#ConfirmMess")
			.dialog({ 
				buttons: [
					{
						text: "Ok",
						click: function() { arg[1](true); 
							$(this).dialog("close");}
					},
					{
						text: "Cancel",
						btCancel: "classButtonCancel",
						click: function() { 
							arg[1](false);
							$(this).dialog("close"); 
						}
					}
				]
			})
			.dialog("open");
	});

	api.asc_registerCallback("asc_onEditCell", function (state) {
		console.log("Cell Edit State - " + state);
	});

	api.asc_Init("../Fonts/");
	//api.asc_setViewerMode(true);

	function getURLParameter(name) {
		return (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1];
	}

	var sProtocol = window.location.protocol;
	var sHost = window.location.host;
	var key = !!getURLParameter("key");
	var bChartEditor = !!getURLParameter("charteditor");
	var sUserNameAndId = "user_" + Math.floor ((Math.random() * 100) + 1);

	api.asc_LoadDocument({
		"Id"     : key ? decodeURIComponent(getURLParameter("key")) : undefined,
		"Url"    : key ? decodeURIComponent(getURLParameter("url")) : undefined,
		"Title"  : key ? decodeURIComponent(getURLParameter("title")).replace(new RegExp("\\+",'g')," ") : undefined,
		"Format" : key ? decodeURIComponent(getURLParameter("filetype")) : undefined,
		"VKey"   : key ? decodeURIComponent(getURLParameter("vkey")) : undefined,
		"Origin" : (sProtocol.search(/\w+/) >= 0 ? sProtocol + "//" : "") + sHost,
		"UserId" : sUserNameAndId,
		"UserName" : sUserNameAndId,
		"ChartEditor" : bChartEditor
	});

	$("#enableKE").data("state", true).click(function(){
		var $this = $(this), s = $this.data("state");
		api.asc_enableKeyEvents(!s);
		$this.data("state", !s);
		$this.val("key events: " + (!s ? "enabled" : "disabled"));
	});
	$("#searchText").click(function(){
		if ( !api.asc_findCellText($("#pattern").val(), $("#searchRow").is(":checked"), $("#searchFwd").is(":checked")) ) {
			alert("no more such text");
		}
	})
	$("#mainmenu,#menuButton").clickMenu({onClick:function(){
		switch(this.id){
			case "mnuSaveXls":{
				api.asc_DownloadAs(c_oAscFileType.XLS);
				break;
			}
			case "mnuSaveXlsx":{
				api.asc_DownloadAs(c_oAscFileType.XLSX);
				break;
			}
			case "mnuSaveOds":{
				api.asc_DownloadAs(c_oAscFileType.ODS);
				break;
			}
			case "mnuSaveCsv":{
				$("#dialogSaveCsv").attr("typeDialog", "save");
				api.asc_getEncodings();
				break;
			}
			case "mnuSaveHtml":{
				api.asc_DownloadAs(c_oAscFileType.HTML);
				break;
			}
			case "mnuOpen":{
				break;
			}
			case "mnuAddRowBelow":{
				api.asc_insertRowsAfter(1)
				break;
			}
			case "mnuAddRowAbove":{
				api.asc_insertRowsBefore(1)
				break;
			}
			case "mnuAddColumnLeft":{
				api.asc_insertColumnsBefore(1)
				break;
			}
			case "mnuAddColumnRight":{
				api.asc_insertColumnsAfter(1)
				break;
			}
			case "mnuSheetRename":{
				$("#dialogRenameWS").dialog("open");
				break;
			}
			case "mnuDelSheet":{
				if (false == api.asc_deleteWorksheet())
					console.error ("Нельзя удалить последний sheet");

				break;
			}
			case "mnuShowColumn":{
				api.asc_showColumns();
				break;
			}
			case "mnuShowRow":{
				api.asc_showRows();
				break;
			}
			case "mnuShowMasterDep":{
				api.asc_drawDepCells(c_oAscDrawDepOptions.Master);
				break;
			}
			case "mnuShowSlaveDep":{
				api.asc_drawDepCells(c_oAscDrawDepOptions.Slave);
				break;
			}
			case "mnuClearDep":{
				api.asc_drawDepCells(c_oAscDrawDepOptions.Clear);
				break;
			}
			
		}
	}})
	$("#textMenu").clickMenu({onClick:function(){
		var bIsNeed = true;
		switch(this.id){
			case "8": case "9": case "10": case "11": case "12": case "14": case "16": case "18": case "20": case "22": case "24": case "26": case "28": case "36": case "48": case "72":
				api.asc_setCellFontSize(parseInt(this.id));
				$('#textMenu').trigger('closemenu');
				$('#fontSizeSelectVal').text(this.innerHTML);
				$('#fontSizeSelectVal').val(this.id);
				$('#fontSizeSelectVal').change();
			break;
			default:{
				$('#textMenu').trigger('closemenu');
				if ($(this).hasClass("fontListElement")){
					$('#fontSelectVal').text(this.innerHTML);
					$('#fontSelectVal').val(this.getAttribute("value"));
					$('#fontSelectVal').change();
					api.asc_setCellFontName($(this).attr("namefont"));
				}
			}
		}
		return false;
	}});
	$("#dialogRenameWS").dialog({ autoOpen: false,
			resizable: false, modal: true, closeOnEscape: false, dialogClass: 'dialogClass',
			buttons: [
				{
					text: "OK",
					click: function() { if ( api.asc_renameWorksheet( $("#dialogRenameWS input").val() ) ) $(this).dialog("close"); }
				},
				{
					text: "Cancel",
					btCancel: "classButtonCancel",
					click: function() { $(this).dialog("close"); }
				}
			]
		});
	var fontList = ["Agency FB","Aharoni","Algerian","Andalus","Angsana New","AngsanaUPC","Arabic Transparent","Arial","Arial Black","Arial Narrow","Arial Rounded MT Bold","Arial Unicode MS","Aston-F1","Baskerville Old Face","Batang","BatangChe","Bauhaus 93","Bell MT","Berlin Sans FB","Berlin Sans FB Demi","Bernard MT Condensed","Bickham Script Pro Regular","Blackadder ITC","Bodoni MT","Bodoni MT Black","Bodoni MT Condensed","Bodoni MT Poster Compressed","Book Antiqua","Bookman Old Style","Bookshelf Symbol 7","Bradley Hand ITC","Britannic Bold","Broadway","Browallia New","BrowalliaUPC","Brush Script MT","Calibri","Californian FB","Calisto MT","Cambria","Cambria Math","Candara","Castellar","Centaur","Century","Century Gothic","Century Schoolbook","Chiller","Colonna MT","Comic Sans MS","Consolas","Constantia","Cooper Black","Copperplate Gothic Bold","Copperplate Gothic Light","Corbel","Cordia New","CordiaUPC","Courier New","Curlz MT","David","David Transparent","DejaVu Sans","DejaVu Sans Condensed","DejaVu Sans Light","DejaVu Sans Mono","DejaVu Serif","DejaVu Serif Condensed","DilleniaUPC","Dingbats","Dotum","DotumChe","Droid Sans Mono","Edwardian Script ITC","Elephant","Engravers MT","Eras Bold ITC","Eras Demi ITC","Eras Light ITC","Eras Medium ITC","Estrangelo Edessa","EucrosiaUPC","Felix Titling","Fixed Miriam Transparent","FlemishScript BT","Footlight MT Light","Forte","Franklin Gothic Book","Franklin Gothic Demi","Franklin Gothic Demi Cond","Franklin Gothic Heavy","Franklin Gothic Medium","Franklin Gothic Medium Cond","FrankRuehl","FreesiaUPC","Freestyle Script","French Script MT","Gabriola","Garamond","Gautami","Gentium Basic","Gentium Book Basic","Georgia","Gigi","Gill Sans MT","Gill Sans MT Condensed","Gill Sans MT Ext Condensed Bold","Gill Sans Ultra Bold","Gill Sans Ultra Bold Condensed","Gloucester MT Extra Condensed","GOST type A","GOST type B","Goudy Old Style","Goudy Stout","Gulim","GulimChe","Gungsuh","GungsuhChe","Haettenschweiler","Harlow Solid Italic","Harrington","High Tower Text","Impact","Imprint MT Shadow","Informal Roman","IrisUPC","JasmineUPC","Jokerman","Juice ITC","Kartika","KodchiangUPC","Kristen ITC","Kunstler Script","Latha","Levenim MT","LilyUPC","Lucida Bright","Lucida Calligraphy","Lucida Console","Lucida Fax","Lucida Handwriting","Lucida Sans","Lucida Sans Typewriter","Lucida Sans Unicode","Magneto","Maiandra GD","Mangal","Matura MT Script Capitals","Meiryo","Meiryo UI","Microsoft Sans Serif","MingLiU","Miriam","Miriam Fixed","Miriam Transparent","Mistral","Modern No. 20","Monotype Corsiva","MS Gothic","MS Mincho","MS Outlook","MS PGothic","MS PMincho","MS Reference Sans Serif","MS Reference Specialty","MS UI Gothic","MT Extra","MV Boli","Narkisim","Niagara Engraved","Niagara Solid","NSimSun","OCR A Extended","Old English Text MT","Onyx","OpenSymbol","Palace Script MT","Palatino Linotype","Papyrus","Parchment","Perpetua","Perpetua Titling MT","Playbill","PMingLiU","Poor Richard","Pristina","Raavi","Rage Italic","Ravie","Rockwell","Rockwell Condensed","Rockwell Extra Bold","Rod","Rod Transparent","Script MT Bold","Segoe UI","Showcard Gothic","Shruti","SimHei","Simplified Arabic","Simplified Arabic Fixed","SimSun","SimSun-PUA","Snap ITC","Stencil","Sylfaen","Symbol","Tahoma","Tempus Sans ITC","Times New Roman","Traditional Arabic","Trebuchet MS","Tunga","Tw Cen MT","Tw Cen MT Condensed","Tw Cen MT Condensed Extra Bold","Verdana","Viner Hand ITC","Vivaldi","Vladimir Script","Vrinda","Webdings","Wide Latin","Wingdings","Wingdings 2","Wingdings 3"];
	function createFontList(){
		fontContent = "";
		for (var i = 0; i < fontList.length; i++)
			fontContent += '<li id="'+fontList[i].replace(/\s/g,"")+'"index="'+i+'" class="SubItem fontListElement" style="font-family:Arial;" nameFont="'+fontList[i]+'">'+fontList[i]+'</li>';
		$("#fontSelect ul").empty().append(fontContent);
	}
	createFontList();
	function remClassIconPress(a){
		a.removeClass("iconPressed");
	}
	$("#td_verticalAlign").addClass("iconPressed");
	function addClassIconPress(a){
		a.addClass("iconPressed");
	}
	$("#td_sort_desc,#td_sort_asc,#td_text_wrap, #td_redo, #td_undo, #td_bold, #td_italic, #td_underline, #td_print, #td_copy, #td_paste,#td_cut, #td_ta_center, #td_ta_right, #td_ta_left, #td_ta_justify, #td_mergeCells, #td_recalc, #td_insert_chart, #td_insert_image_url, #td_insert_image_file, #td_drawing_object_layer, #td_add_cell_comment, #td_add_document_comment, #td_add_hyperlink, #td_print_pdf, #td_auto_filter, #td_auto_filter_local").click(function(){
		switch (this.id){
			case "td_bold":{
				if ($(this).hasClass("iconPressed")){
					$(this).removeClass("iconPressed");
					api.asc_setCellBold(false);
					}
				else{
					$(this).addClass("iconPressed");
					api.asc_setCellBold(true);
				}
				break;
			}
			case "td_italic":{
				if ($(this).hasClass("iconPressed")){
					$(this).removeClass("iconPressed");
					api.asc_setCellItalic(false);
				}
				else{
					$(this).addClass("iconPressed");
					api.asc_setCellItalic(true);
				}
				break;
			}
			case "td_underline":{
				if ($(this).hasClass("iconPressed")){
					$(this).removeClass("iconPressed");
					api.asc_setCellUnderline(false);
				}
				else{
					$(this).addClass("iconPressed");
					api.asc_setCellUnderline(true);
				}
				break;
			}
			case "td_print":{
				// editor.Print();
				break;
			}
			case "td_copy":{
				api.asc_Copy();
				break;
			}
			case "td_paste":{
				api.asc_Paste();
				break;
			}
			case "td_cut":{
				api.asc_Cut();
				break;
			}
			case "td_ta_left":{
					$("td[id*='td_ta']").removeClass("iconPressed");
					$(this).addClass("iconPressed");
					api.asc_setCellAlign("left")
					break;
			}
			case "td_ta_center":{
				if ($(this).hasClass("iconPressed")){
					$(this).removeClass("iconPressed");
					$("#td_ta_left").addClass("iconPressed");
					api.asc_setCellAlign("left");
				}
				else{
					$("td[id*='td_ta']").removeClass("iconPressed");
					$(this).addClass("iconPressed");
					api.asc_setCellAlign("center");
				}
				break;
			}
			case "td_ta_right":{
				if ($(this).hasClass("iconPressed")){
					$(this).removeClass("iconPressed");
					$("#td_ta_left").addClass("iconPressed");
					api.asc_setCellAlign("left");
				}
				else{
					$("td[id*='td_ta']").removeClass("iconPressed");
					$(this).addClass("iconPressed");
					api.asc_setCellAlign("right");
				}
				break;
			}
			case "td_ta_justify":{
				if ($(this).hasClass("iconPressed")){
					$(this).removeClass("iconPressed");
					$("#td_ta_left").addClass("iconPressed");
					api.asc_setCellAlign("left");
				}
				else{
					$("td[id*='td_ta']").removeClass("iconPressed");
					$(this).addClass("iconPressed");
					api.asc_setCellAlign("justify");
				}
				break;
			}
			case "td_undo":{
				api.asc_Undo();
				break;
			}
			case "td_redo":{
				api.asc_Redo();
				break;
			}
			case "td_text_wrap":{
				if ($(this).hasClass("iconPressed")){
					$(this).removeClass("iconPressed");
					api.asc_setCellTextWrap(false);
				}
				else{
					$(this).addClass("iconPressed");
					api.asc_setCellTextWrap(true);
				}

				break;
			}
			case "td_mergeCells":{
				if ($(this).hasClass("iconPressed")){
					$(this).removeClass("iconPressed");
					api.asc_mergeCells(c_oAscMergeOptions.Unmerge);
				}
				else{
					$(this).addClass("iconPressed");
					api.asc_mergeCells(c_oAscMergeOptions.Merge);
				}

				break;
			}
			case "td_recalc":{
				api.asc_drawDepCells(c_oAscDrawDepOptions.Master);
				break;
			}
			case "td_sort_asc":{
				api.asc_sortCells(c_oAscSortOptions.Ascending);
				break;
			}case "td_sort_desc":{
				api.asc_sortCells(c_oAscSortOptions.Descending);
				break;
			}
			case "td_insert_chart":{
				showChartDialog();
				break;
			}
			case "td_insert_image_url":{
				showImageUrlDialog();
				break;
			}
			case "td_insert_image_file":{
				api.asc_showImageFileDialog();
				break;
			}
			case "td_drawing_object_layer":{
				showDrawingLayerDialog();
				break;
			}
			case "td_add_cell_comment":{
				showCommentDialog(false);
				break;
			}
			case "td_add_document_comment":{
				showCommentDialog(true);
				break;
			}
			case "td_add_hyperlink":
			{
				var oCellInfo = api.asc_getCellInfo();
				oTmpHyperlinkObj = oCellInfo.asc_getHyperlink();

				$("#addHyperlink_text").val(oTmpHyperlinkObj.asc_getText());

				var oSelect = $("#addHyperlink_she");
				oSelect.empty();
				for (var i = 0; i < $("#ws-navigation .tabs .tab-name").length; i++)
					oSelect.append("<option>" + $("#ws-navigation .tabs .tab-name")[i].textContent + "</option>");
				if (null == oTmpHyperlinkObj) {
					toggleHyperlinkDialog(true);
					$("#addHyperlink_url").val("");
					$("#addHyperlink_ran").val("A1");
				}
				else {
					if (c_oAscHyperlinkType.WebLink === oTmpHyperlinkObj.asc_getType()) {
						toggleHyperlinkDialog(true);
						$("#addHyperlink_url").val(oTmpHyperlinkObj.asc_getHyperlinkUrl());
					}
					else if (c_oAscHyperlinkType.RangeLink === oTmpHyperlinkObj.asc_getType()) {
						toggleHyperlinkDialog(false);
						$("#addHyperlink_she").val(oTmpHyperlinkObj.asc_getSheet());
						$("#addHyperlink_ran").val(oTmpHyperlinkObj.asc_getRange());
					}
				}
				api.asc_enableKeyEvents(false);
				$("#dialogAddHyperlink").dialog("open");
				break;
			}
			case "td_print_pdf":
				api.asc_Print();
				break;
			case "td_auto_filter":{
				api.asc_addAutoFilter()
				break;
		}
			case "td_auto_filter_local":{
				api.asc_addAutoFilter(true);
				break;
			}
		}
	});
	$(".selectable").bind("mouseover", function() {if ($(this).hasClass("noselectable")) return; $(this).addClass("iconHover"); });
	$(".selectable").bind("mouseout", function() { $(this).removeClass("iconHover"); });
	$(".clrPicker1").mousedown(function(){
		if ("none" != $("#colorBox1").css("display")){
			IsVisibleMenu = true;
			$("#td_BackgroundColor").removeClass("iconPressed");
			$("#colorBox1").css("display","none");
		}
	});
	$("#td_va_choose").mousedown(function(event) {
		if ("none" != $("#va_options").css("display")) {
			IsVisibleMenu = true;
			$("#td_verticalAlign").removeClass("iconPressed");
		}
	});
	$("#td_va_choose").click(function() {
		if (false == IsVisibleMenu) {
			var offset = $("#td_verticalAlign").offset();
			offset.top += $("#td_verticalAlign").outerHeight() - 1;
			$("#va_options").css(offset).show();
			if ($(window).width() < $("#va_options").width() + $("#va_options").offset().left)
				$("#va_options").offset({ left: $("#va_options").offset().left - $("#va_options").width() + $("#td_verticalAlign").width() });
			$("#td_verticalAlign").addClass("iconPressed");
		}
		IsVisibleMenu = false;
	});
	$("[id^=td_vo_]").click(function() {
		$("#va_options").hide();
		var val = $(this).attr("id").slice(6);
		$("#td_va").attr("al", val).click();
		$("#td_verticalAlign").removeClass("iconPressed");
	});
	$("#td_va").click(function() {
		switch( $("#td_va").attr("al") ){
			case "top":{
				api.asc_setCellVertAlign(c_oAscAlignType.TOP);
				break;
			}
			case "middle":{
				api.asc_setCellVertAlign(c_oAscAlignType.MIDDLE);
				break;
			}
			case "bottom":{
				api.asc_setCellVertAlign(c_oAscAlignType.BOTTOM);
				break;
			}
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
		api.asc_setCellBackgroundColor(a2)
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
		// changeFontColor(a2,"text");
		api.asc_setCellTextColor(a2)
		return false;
	});
	$("#td_func_choose").mousedown(function(event) {
		if ("none" != $("#formulaList2").css("display")) {
			IsVisibleMenu = true;
			$("#td_Formulas").removeClass("iconPressed");
		}
	});
	$("#td_func_choose").click(function() {
		if (false == IsVisibleMenu) {
			var offset = $("#td_Formulas").offset();
			offset.top += $("#td_Formulas").outerHeight() - 1;
			$("#formulaList2").css(offset).show();
			if ($(window).width() < $("#formulaList2").width() + $("#formulaList2").offset().left)
				$("#formulaList2").offset({ left: $("#formulaList2").offset().left - $("#formulaList2").width() + $("#td_Formulas").width() });
			$("#td_Formulas").addClass("iconPressed");
		}
		IsVisibleMenu = false;
	});
	$("#td_border_choose").mousedown(function(event) {
		if ("none" != $("#brd_options").css("display")) {
			$("#td_Border").removeClass('iconPressed');
			IsVisibleMenu = true;
		}
	});
	$("#td_border_choose").click(function() {
		if (false == IsVisibleMenu) {
			var offset = $("#td_Border").offset();
			offset.top += $("#td_Border").outerHeight() - 1;
			$("#brd_options").css(offset).show();
			if ($(window).width() < $("#brd_options").width() + $("#brd_options").offset().left)
				$("#brd_options").offset({ left: $("#brd_options").offset().left - $("#brd_options").width() + $("#td_Border").width() });
			$("#td_Border").addClass('iconPressed');
		}
		IsVisibleMenu = false;
	});
	$("#brd_options .icon, #mnubrd_options .icon").click(function() {
		$("#td_cellBorder").attr("vid", this.id.slice(6));
		$("#td_cellBorder>div").removeClass().addClass("brdImg").addClass(this.id);
		$("#brd_options").hide();
		$("#td_Border").removeClass('iconPressed');
		$("#td_cellBorder").click();
	});
	$("#td_cellBorder").click(function() {
		var sNewVid = $(this).attr("vid");
		var val;
		switch(sNewVid){
			case "0":{
				api.asc_setCellBorders([]);
				break;
			}
			case "1":{
				val = [];
				val[c_oAscBorderOptions.Left] = new window.Asc.asc_CBorder(0, "thin", "#000");
				api.asc_setCellBorders(val);
				break;
			}
			case "4":{
				val = [];
				val[c_oAscBorderOptions.Top] = new window.Asc.asc_CBorder(0, "thin", "#000");
				api.asc_setCellBorders(val);
				break;
			}
			case "16":{
				val = [];
				val[c_oAscBorderOptions.Right] = new window.Asc.asc_CBorder(0, "thin", "#000");
				api.asc_setCellBorders(val);
				break;
			}
			case "64":{
				val = [];
				val[c_oAscBorderOptions.Bottom] = new window.Asc.asc_CBorder(0, "thin", "#000");
				api.asc_setCellBorders(val);
				break;
			}
			case "85":{
				val = [];
				val[c_oAscBorderOptions.Left] = new window.Asc.asc_CBorder(0, "thin", "#000");
				val[c_oAscBorderOptions.Top] = new window.Asc.asc_CBorder(0, "thin", "#000");
				val[c_oAscBorderOptions.Right] = new window.Asc.asc_CBorder(0, "thin", "#000");
				val[c_oAscBorderOptions.Bottom] = new window.Asc.asc_CBorder(0, "thin", "#000");
				api.asc_setCellBorders(val);
				break;
			}
			case "170":{
				val = [];
				val[c_oAscBorderOptions.Left] = new window.Asc.asc_CBorder(0, "thick", "#000");
				val[c_oAscBorderOptions.Top] = new window.Asc.asc_CBorder(0, "thick", "#000");
				val[c_oAscBorderOptions.Right] = new window.Asc.asc_CBorder(0, "thick", "#000");
				val[c_oAscBorderOptions.Bottom] = new window.Asc.asc_CBorder(0, "thick", "#000");
				api.asc_setCellBorders(val);
				break;
			}
			case "324":{
				val = [];
				val[c_oAscBorderOptions.DiagD] = new window.Asc.asc_CBorder(0, "thin", "#000");
				api.asc_setCellBorders(val);
				break;
			}
			case "341":{
				val = [];
				val[c_oAscBorderOptions.DiagU] = new window.Asc.asc_CBorder(0, "thin", "#000");
				api.asc_setCellBorders(val);
				break;
			}
		}
	});
	$("[id^=td_fmt_]").click(function() {
		remClassIconPress($("#td_fmt_digit").parent());
		remClassIconPress($("#td_fmt_date").parent());
		remClassIconPress($("#td_fmt_money").parent());
		$("#DigitList").hide();
		$("#DateList").hide();
		$("#MoneyList").hide();
	});
	$("#td_fmt_digit").mousedown(function(event) {
	if ("none" != $("#DigitList").css("display")) {
			IsVisibleMenu = true;
			remClassIconPress($(this).parent());
		}
	});
	$("#td_fmt_date").mousedown(function(event) {
		if ("none" != $("#DateList").css("display")) {
			IsVisibleMenu = true;
			remClassIconPress($(this).parent());
			$("#DateList").css("display","none");
		}
	});
	$("#td_fmt_money").mousedown(function(event) {
		if ("none" != $("#MoneyList").css("display")) {
			IsVisibleMenu = true;
			remClassIconPress($(this).parent());
		}
	});
	$("#td_fmt_up").click(function(event) {
		api.asc_increaseCellDigitNumbers();
	});
	$("#td_fmt_down").click(function(event) {
		api.asc_decreaseCellDigitNumbers();
	});
	$("#td_fmt_digit").click(function() {
		if (false == IsVisibleMenu) {
			var offset = $(this).offset();
			offset.top += 24;
			offset.left -= 3;
			$("#DigitList").css(offset).show();
			if ($(window).width() < $("#DigitList").width() + $("#DigitList").offset().left)
				$("#DigitList").offset({ left: $("#DigitList").offset().left - $("#DigitList").width() + $("#td_fmt_digit").width() + 4 });
			addClassIconPress($(this).parent());
		}
		IsVisibleMenu = false;
	});
	$("#td_fmt_date").click(function() {
		if (false == IsVisibleMenu) {
			var offset = $(this).offset();
			offset.top += 24;
			offset.left -= 3;
			$("#DateList").css(offset).show();
			if ($(window).width() < $("#DateList").width() + $("#DateList").offset().left)
				$("#DateList").offset({ left: $("#DateList").offset().left - $("#DateList").width() + $("#td_fmt_date").width() + 4 });
			addClassIconPress($(this).parent());
		}
		IsVisibleMenu = false;
	});
	$("#td_fmt_money").click(function() {
		if (false == IsVisibleMenu) {
			var offset = $("#td_fmt_money").offset();
			offset.top += 24;
			offset.left -= 3;
			$("#MoneyList").css(offset).show();
			if ($(window).width() < $("#MoneyList").width() + $("#MoneyList").offset().left)
				$("#MoneyList").offset({ left: $("#MoneyList").offset().left - $("#MoneyList").width() + $("#td_fmt_money").width() + 4 });
			addClassIconPress($(this).parent());
		}
		IsVisibleMenu = false;
	});
	$("[fmt]").click(function() {
		remClassIconPress($("#td_fmt_digit").parent());
		remClassIconPress($("#td_fmt_date").parent());
		remClassIconPress($("#td_fmt_money").parent());
		$("#DigitList").hide();
		$("#DateList").hide();
		$("#MoneyList").hide();
		api.asc_setCellFormat(this.getAttribute("fmt"))
	});

	function formulaItemClick( oHandler ){
		if($(oHandler).attr("id")=="moreFunc"){
			$("#td_Formulas").removeClass("iconPressed");
			$("#formulaList1").hide();
			$("#formulaList2").hide();
				$("#formulaMore").dialog("open");
			return;
		}
		$("#formulaMore").dialog("close");
		var fn=$(oHandler).attr("name");
		$("#formulaList2").hide();
		api.asc_insertFormula(fn, true);
	}

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
	$("#colorSelectHolder").on("click",function(evnt,ui){
		if(colorSelecterClick){colorSelecterClick = false; return false;}

		if(evnt.clientX-$("#colorSelectHolder").offset().left > 0 && $("#colorSelectHolder").offset().left + $("#colorSelectHolder").width() - evnt.clientX>0 )
			if(evnt.clientY-$("#colorSelectHolder").offset().top > 0 && $("#colorSelectHolder").offset().top + $("#colorSelectHolder").height() - evnt.clientY>0 )
				getColor(evnt.clientX-$("#colorSelectHolder").offset().left,evnt.clientY-$("#colorSelectHolder").offset().top);
			else return;
		else
			return;
		$("#colorSelecter").offset({top:evnt.clientY-8,left:evnt.clientX-8});
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
			// remIconPress();
			$("#td_BackgroundColor, #td_TextColor").removeClass("iconPressed");
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

	$("#colorSelecter").draggable({ zIndex: 2700,
		containment: /*[$("#colorSelecter").offsetParent().offset().left,$("#colorSelecter").offsetParent().offset().top+1,
																$("#colorSelecter").offsetParent().offset().left+127,$("#colorSelecter").offsetParent().offset().top+127]*/"parent",
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

	$("#formulaMore").dialog(
		{ autoOpen: false, height: 355, width: 335,
			resizable: false, modal: false, closeOnEscape: false, title: "Function",
			open: function() {  }, dialogClass: 'dialogClass',
			close: function() {  }
		}
	);

	$("#dialogSaveCsv").dialog(
		{ autoOpen: false, height: 355, width: 335,
			resizable: false, modal: false, closeOnEscape: false, title: "Function",
			open: function() {  }, dialogClass: 'dialogClass',
			close: function() {  },
			buttons: [
			{
				text: "Ok",
				click: function() {
					if ("open" == $("#dialogSaveCsv").attr("typeDialog"))
						api.asc_setAdvancedOptions( c_oAscAdvancedOptionsID.CSV,new Asc.asc_CCSVAdvancedOptions( $("#pageCodeSelect").val(), $("#DelimiterList").val() ) );
					else
						api.asc_DownloadAs(c_oAscFileType.CSV, new Asc.asc_CCSVAdvancedOptions( $("#pageCodeSelect").val(), $("#DelimiterList").val() ));
					$(this).dialog("close");
				}
			},
			{
				text: "Cancel",
				btCancel: "classButtonCancel",
				click: function() { $(this).dialog("close"); }
			}
		]
		}
	);

	$("#dialogAddHyperlink").dialog({ autoOpen: false, title: "Add Link",
		resizable: false, modal: true, width: '590px', closeOnEscape: true, dialogClass: "dialogClass",
		open: function() {  },
		close: function() { api.asc_enableKeyEvents(true); },
		buttons: [
			{
				text: "Ok",
				click: function() { onDialogAddHyperlink(); }
			},
			{
				text: "Cancel",
				btCancel: "classButtonCancel",
				click: function() { $(this).dialog("close"); }
			}
		]
	});

	$("#ConfirmMess").dialog({ autoOpen: false, title: "Confirm replace cells",
		resizable: false, modal: true, width: '590px', closeOnEscape: true, dialogClass: "dialogClass",
		open: function() { api.asc_enableKeyEvents(false); },
		close: function() { api.asc_enableKeyEvents(true); }
	});

	$("#dialogRenameWS input")
		.focus(function(){api.asc_enableKeyEvents(false);})
		.blur(function(){api.asc_enableKeyEvents(true);})
		.val("")
	$("#cc1")
		.focus(function(){api.asc_enableKeyEvents(false);})
		.blur(function(){api.asc_enableKeyEvents(true);})
		.change(function(){api.asc_findCell( $(this).val() );})
		.val("");

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
	// consolelog( api.asc_getFormulasInfo() )
	var flist = api.asc_getFormulasInfo(), a;
	for(var i = 0; i < flist.length; i++){
		a = flist[i].asc_getFormulasArray();
		for(var n=0;n<a.length;n++){
			$("#fListMore").append("<div class ='formulaItem selectable' group='" + flist[i].asc_getGroupName() + "' name='" + a[n].asc_getName() + "' args='" +a[n].asc_getName()+ a[n].asc_getArguments() + "'>" + a[n].asc_getName()+ a[n].asc_getArguments() + "</div>");
			if ($("#formulaSelect option[value='" + flist[i].asc_getGroupName() + "']").length == 0) {
				$("#formulaSelect").append("<option value='" + flist[i].asc_getGroupName() + "'>" + flist[i].asc_getGroupName() + "</option>");
			}
		}
	}
	$(".formulaItem").bind("click", function() { formulaItemClick(this); });
	$("#formulaSelect").change(function() {
		if ($(this).val() == "All") $("#fListMore .formulaItem").show();
		else {
			$("#fListMore .formulaItem").hide();
			$("#fListMore .formulaItem[group='" + $(this).val() + "']").show();
		}
	});
	$("#mnuAddHyperlink").bind("click", function() {
		$("#td_add_hyperlink").click();
	});

	function onDialogAddHyperlink() {
		var sText = $("#addHyperlink_text").val();
		var sUrl = $("#addHyperlink_url").val();
		var sSheet = $("#addHyperlink_she").val();
		var sRange = $("#addHyperlink_ran").val();

		var bHyp = false;
		if(  document.getElementById('selectTypeLink').selectedIndex == 0)
			bHyp = true;
		if( 0 == sText.length ) {
			$("#addHyperlink_err").text( "Error: Empty text" );
			$("#addHyperlink_err").hide();
			$("#addHyperlink_err").show( "slow" );
		}
		else if( true == bHyp && "" == sUrl ) {
			$("#addHyperlink_err").text( "Error: Empty url" )
			;$("#addHyperlink_err").hide();
			$("#addHyperlink_err").show("slow");
		}
		else
		{
			$("#addHyperlink_err").hide();
			$("#dialogAddHyperlink").dialog("close");

			oTmpHyperlinkObj.asc_clear();
			oTmpHyperlinkObj.asc_setText (sText);
			if( true == bHyp )
			{
				oTmpHyperlinkObj.asc_setType (c_oAscHyperlinkType.WebLink);
				if( 0 != sUrl.indexOf("http://") )
					sUrl = "http://" + sUrl;
				oTmpHyperlinkObj.asc_setHyperlinkUrl(sUrl);
			}
			else {
				oTmpHyperlinkObj.asc_setType (c_oAscHyperlinkType.RangeLink);
				oTmpHyperlinkObj.asc_setSheet(sSheet);
				oTmpHyperlinkObj.asc_setRange(sRange);
			}

			api.asc_insertHyperlink(oTmpHyperlinkObj);
			api.asc_enableKeyEvents(true);
		}
	}

	function toggleHyperlinkDialog( bHyp ){
		if( true == bHyp )
		{
			document.getElementById('selectTypeLink').selectedIndex = 0;
			$("#urlLink").css("display","block");
			$("#locationLink").css("display","none");
			$("#addHyperlink_url" ).removeAttr( "disabled" );
			$("#addHyperlink_she,#addHyperlink_ran" ).attr( "disabled", "disabled" );
		}
		else
		{
			document.getElementById('selectTypeLink').selectedIndex = 1;
			$("#urlLink").css("display","none");
			$("#locationLink").css("display","block");
			$("#addHyperlink_url" ).attr( "disabled", "disabled" );
			$("#addHyperlink_she,#addHyperlink_ran" ).removeAttr( "disabled" );
		}
	};

	$("#selectTypeLink").change(function() {
		switch (this.selectedIndex) {
			case 0: toggleHyperlinkDialog(true); break;
			case 1: toggleHyperlinkDialog(false); break;
		}
	});

	// Image and chart dialogs
	function BuildDrawingObjectMenu() {
		var menu = $(
			"<div id='drawingObjectsMenu'>\
				<div id='imageSelector' style='font-size: 12px; visibility: hidden;'>\
					<input type='text' id='imageSelectorUrl' style='width: 340px; margin: 10px;'/>\
				</div>\
				<div id='chartSelector' style='font-size: 12px; visibility: hidden;'>\
					\
					 <select id='chartType' style='width: 340px; margin: 10px;'>\
						<option value='Line' selected>Line</option>\
						<option value='Bar'>Bar</option>\
						<option value='HBar'>HBar</option>\
						<option value='Area'>Area</option>\
						<option value='Pie'>Pie</option>\
						<option value='Scatter'>Scatter</option>\
						<option value='Stock'>Stock</option>\
					</select>\
					\
					<select id='chartSubType' style='width: 340px; margin: 10px;'>\
						<option value='Normal' selected>Normal</option>\
						<option value='stacked'>Stacked</option>\
						<option value='stackedPer'>100Stacked</option>\
					</select>\
					\
					<fieldset>\
						<legend>Data</legend>\
						<input type='text' style='margin-left: 10px; width: 80%;' id='chartRange' value=''><br>\
						<input type='radio' name='dataRadio' id='dataRows' style='margin-left: 10px;'>Rows<br>\
						<input type='radio' name='dataRadio' id='dataColumns' style='margin-left: 10px;'>Columns<br>\
					</fieldset>\
					\
					<fieldset>\
						<legend>Grid</legend>\
						<input type='checkbox' id='xGridShow' checked style='margin-left: 10px;'>Vertical<br>\
						<input type='checkbox' id='yGridShow' checked style='margin-left: 10px;'>Horizontal<br>\
					</fieldset>\
					\
					<fieldset>\
						<legend>Axis</legend>\
						<input type='checkbox' id='xAxisShow' checked style='margin-left: 10px;'>Show X<br>\
						<input type='checkbox' id='yAxisShow' checked style='margin-left: 10px;'>Show Y<br>\
					</fieldset>\
					\
					<fieldset>\
						<legend>Titles</legend>\
						<input type='text' style='margin-left: 10px;' id='chartTitle' value='Diagramm'><br>\
						<span style='margin-left: 10px;'>X axis title</span>\
						<input type='text' style='margin-left: 10px;' id='xAxisTitle' value='X axis'><br>\
						<span style='margin-left: 10px;'>Y axis title</span>\
						<input type='text' style='margin-left: 10px;' id='yAxisTitle' value='Y axis'><br>\
						<input type='checkbox' id='valueShow' style='margin-left: 10px;'>Show values<br>\
					</fieldset>\
					\
					<fieldset>\
						<legend>Legend</legend>\
						<input type='checkbox' id='legendShow' checked style='margin-left: 10px;'>Show<br>\
						<input type='radio' name='legendRadio' id='legendLeft' checked style='margin-left: 10px;'>Left<br>\
						<input type='radio' name='legendRadio' id='legendRight' style='margin-left: 10px;'>Right<br>\
						<input type='radio' name='legendRadio' id='legendTop' style='margin-left: 10px;'>Top<br>\
						<input type='radio' name='legendRadio' id='legendBottom' style='margin-left: 10px;'>Bottom<br>\
					</fieldset>\
				</div>\
			</div>");

		$("body").append(menu);
	}
	
	function BuildDrawingObjectLayerMenu() {
		var menu = $(
			"<div id='drawingObjectsLayerMenu'>\
					<input type='radio' name='layerRadio' id='BringToFront' checked style='margin-left: 10px;'>BringToFront<br>\
					<input type='radio' name='layerRadio' id='SendToBack' style='margin-left: 10px;'>SendToBack<br>\
					<input type='radio' name='layerRadio' id='BringForward' style='margin-left: 10px;'>BringForward<br>\
					<input type='radio' name='layerRadio' id='SendBackward' style='margin-left: 10px;'>SendBackward<br>\
			</div>");

		$("body").append(menu);
	}

	function showDrawingLayerDialog() {
		BuildDrawingObjectLayerMenu();

		$("#drawingObjectsLayerMenu").dialog({ autoOpen: false, closeOnEscape: false, height: 'auto', width: 400,
					resizable: false, modal: true, title: "Drawing layer", draggable: true,
					open: function() {
					},
					buttons: [
						{
							text: "Ok",
							click: function() {

								var layerForm = $("#drawingObjectsLayerMenu");

								if ( layerForm.find("#BringToFront").is(":checked") )
									api.asc_setSelectedDrawingObjectLayer(c_oAscDrawingLayerType.BringToFront);
								else if ( layerForm.find("#SendToBack").is(":checked") )
									api.asc_setSelectedDrawingObjectLayer(c_oAscDrawingLayerType.SendToBack);
								else if ( layerForm.find("#BringForward").is(":checked") )
									api.asc_setSelectedDrawingObjectLayer(c_oAscDrawingLayerType.BringForward);
								else if ( layerForm.find("#SendBackward").is(":checked") )
									api.asc_setSelectedDrawingObjectLayer(c_oAscDrawingLayerType.SendBackward);

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
						$("#drawingObjectsLayerMenu").remove();
					},
					create: function() {
					}
		});
		$("#drawingObjectsLayerMenu").dialog("open");
	}
	
	// Comments
	
	var g_commentsEditorId = "commentsEditor";
	var g_commentsTooltipId = "commentsTooltip";
	
	function getDate() {
		var objToday = new Date(),
        weekday = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'),
        dayOfWeek = weekday[objToday.getDay()],
        domEnder = new Array( 'th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th' ),
        dayOfMonth = today + (objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder[objToday.getDate()] : objToday.getDate() + domEnder[parseFloat(("" + objToday.getDate()).substr(("" + objToday.getDate()).length - 1))],
        months = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'),
        curMonth = months[objToday.getMonth()],
        curYear = objToday.getFullYear(),
        curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
        curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
        curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
        curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
		//var today = curHour + ":" + curMinute + "." + curSeconds + " " + curMeridiem + " " + dayOfWeek + " " + dayOfMonth + " " + curMonth + " " + curYear;
		
		var day = (objToday.getDate() < 10) ? '0' + objToday.getDate() : objToday.getDate();
		var month = (objToday.getMonth() < 10) ? '0' + objToday.getMonth() : objToday.getMonth();
		var today = day + "/" + month + "/" + curYear + " " + curHour + ":" + curMinute + " " + curMeridiem;
		return today;
	}
	
	function InsertComment(commentObject, containerId) {
		
		var container = $("#" + containerId);
		var commentBlock = document.createElement("div");
		container.append(commentBlock);

		commentBlock.id = commentObject.asc_getId();
		commentBlock.style["float"]  = "left";
		commentBlock.style["width"] = (container.width() - commentObject.asc_getLevel() * 10) + "px";
		commentBlock.style["height"] = "100%";
		commentBlock.style["padding"] = "0";
		commentBlock.style["margin"] = "0 0 4px " + commentObject.asc_getLevel() * 10 + "px";
		
		var title = document.createElement("span");
		title.textContent = commentObject.asc_getUserName() + " (" + commentObject.asc_getTime() + "):";
		commentBlock.appendChild(title);
		title.style["float"]  = "left";
		title.style["margin-top"]  = "4px";
		title.style["width"] = (container.width() - commentObject.asc_getLevel() * 10 - 10) + "px";
		title.style["fontSize"]  = "11px";
		title.style["fontStyle"]  = "Italic";		
		title.style["fontWeight"]  = "Bold";
		title.style["color"]  = "Red";
		
		var textArea = document.createElement("textarea");
		textArea.value = commentObject.asc_getText();
		commentBlock.appendChild(textArea);
		textArea.style["float"]  = "left";
		textArea.style["border"] = "1px solid Silver";
		textArea.style["width"] = (container.width() - commentObject.asc_getLevel() * 10 - 2) + "px";
		textArea.style["padding"] = "0px";
		textArea.style["height"] = "100%";
		textArea.style["margin"] = "2px 0 0 0";
		textArea.focus();
		textArea.onchange = function() {
			var t = this;
			
			var comment = api.asc_findComment(commentObject.asc_getId());
			comment = new window.Asc.asc_CCommentData(comment);
			comment.asc_putUserId(api.UserId);
			comment.asc_putUserName("You");
			comment.asc_putTime(getDate());
			comment.asc_putText(t.value);
			
			api.asc_changeComment(commentObject.asc_getId(), comment);
		}

		// Buttons
		var replyBtn = document.createElement("input"); 
		commentBlock.appendChild(replyBtn);
		replyBtn.type = "submit";
		replyBtn.value = "Reply";
		replyBtn.style["margin"] = "0 4px 0 0";
		replyBtn.onclick = function() {
			var parentComment = api.asc_findComment(commentObject.asc_getId());
			
			var reply = new window.Asc.asc_CCommentData();
			reply.asc_putUserId(api.UserId);
			reply.asc_putUserName("You");
			reply.asc_putTime(getDate());
			
			parentComment.asc_addReply(reply);
			InsertComment(reply, commentObject.asc_getId());
		}

		var deleteBtn = document.createElement("input");
		commentBlock.appendChild(deleteBtn);		
		deleteBtn.type = "submit";
		deleteBtn.value = "Delete";
		deleteBtn.style["margin"] = 0;
		deleteBtn.onclick = function() {		
			RecalcCommentEditor();		
			var result = api.asc_removeComment(commentObject.asc_getId());			
			$("#" + commentObject.asc_getId()).remove();
		}

		var count = commentObject.asc_getRepliesCount();
		for (var i = 0; i < count; i++) {
			InsertComment(commentObject.asc_getReply(i), commentObject.asc_getId());
		}
	}
	
	function showCommentDialog(bDocument) {
		
		menu = $("<div id='cellComment'>\
				<input id='showComments' type='checkbox' onchange='' checked='true'><span style='font-size: 11px;'>Show comments</span><br>\
				<input id='addComment' type='submit' onclick='' value='Add new comment'>\
				</div>");
		
		$("body").append(menu);		
		var cellComment = $("#cellComment");
		
		var workbookComments = api.asc_getWorkbookComments();

		$("#cellComment").dialog({ autoOpen: false, closeOnEscape: true, height: 'auto', width: 400, position: "right top",
					resizable: false, modal: true, title: bDocument ? "Document comments" : "Cell comments", draggable: true,
					open: function() {
										
						api.asc_enableKeyEvents(false);
						var commentList = bDocument ? api.asc_getDocumentComments() : api.asc_getComments();
						
						var addBtn = cellComment.find("#addComment");
						addBtn[0].onclick = function() {
						
							var comment = new window.Asc.asc_CCommentData();
							comment.asc_putText("");
							comment.asc_putUserId(api.UserId);
							comment.asc_putUserName("You");
							comment.asc_putTime(getDate());
							comment.asc_putDocumentFlag(bDocument);
							api.asc_addComment(comment);
							
							InsertComment(comment, "cellComment");
						}						
						
						for (var i = 0; i < commentList.length; i++) {
							InsertComment(commentList[i], "cellComment");
						}
						
						var showBtn = cellComment.find("#showComments");
						showBtn[0].onchange = function() {
							if (this.checked)
								api.asc_showComments();
							else
								api.asc_hideComments();
						}
						
					},
					close: function() {
						cellComment.remove();
						api.asc_enableKeyEvents(true);
					},
					create: function() {
					}
		});
		cellComment.dialog("open");
	}
	
	// Comment events
	function eventMouseMoveComment(mouseMoveObjects) {

		var nIndex = 0;
		var mouseMoveObject = undefined;
		var commentBlock = $("#" + g_commentsEditorId);
		if ( commentBlock.length > 0 )
			return;
			
		ClearTooltip();

		for (; nIndex < mouseMoveObjects.length; ++nIndex) {
			mouseMoveObject = mouseMoveObjects[nIndex];
			if ( mouseMoveObject.type == c_oAscMouseMoveType.Comment ) {

				var indexes = mouseMoveObject.asc_getCommentIndexes();

				var commentList = [];
				var cellCommentator = api.wb.getWorksheet().cellCommentator;
				for (var i = 0; i < indexes.length; i++) {
					commentList.push(api.asc_findComment(indexes[i]));
				}
				var commentCoords = cellCommentator.getCommentsCoords(commentList);

				if ( indexes.length > 0 ) {

					if ( commentBlock.length > 0 )
						commentBlock.remove();

					var padding = 2;
					var canvasWidget = $("#" + api.HtmlElementName);

					commentBlock = document.createElement("div");
					commentBlock.id = g_commentsTooltipId;
					//commentBlock.style["width"] = "auto";
					//commentBlock.style["height"] = "auto";

					commentBlock.style["width"] = (commentCoords.asc_getWidthPX() + 2 * padding) + "px";
					commentBlock.style["height"] = (commentCoords.asc_getHeightPX() + 2 * padding) + "px";

					commentBlock.style["zIndex"] = "3000";
					commentBlock.style["padding"] = padding + "px";
					commentBlock.style["border"] = "1px solid Grey";
					commentBlock.style["backgroundColor"] = "#FFFF99";
					commentBlock.style["position"] = "absolute";
					commentBlock.style["top"] = (/*mouseMoveObject.asc_getY()*/ commentCoords.asc_getTopPX() + cellCommentator.mmToPx(commentCoords.asc_getTopOffset()) + canvasWidget.offset().top) + "px";
					commentBlock.style["left"] = (/*mouseMoveObject.asc_getX()*/ commentCoords.asc_getLeftPX() + cellCommentator.mmToPx(commentCoords.asc_getLeftOffset()) + canvasWidget.offset().left) + "px";
					$("body").append(commentBlock);

					function drawComment(comment) {

						var commentAuthor = comment.asc_getUserName() + (comment.asc_getTime() ? " (" + comment.asc_getTime() + ")" : "") + ":";

						// Font
						var title = document.createElement("div");
						title.innerHTML = "<span>" + commentAuthor + "</span><br>";
						title.style["fontFamily"]  = "Tahoma";
						title.style["fontSize"]  = "11px";
						title.style["fontWeight"]  = "Bold";
						title.style["padding"]  = "1px 0";
						commentBlock.appendChild(title);

						var commentSpl = comment.asc_getText().split('\n');
						for (var i = 0; i < commentSpl.length; i++) {

							var text = document.createElement("div");
							text.innerHTML = "<span>" + commentSpl[i] + "</span><br>";
							text.style["fontFamily"]  = "Tahoma";
							text.style["fontSize"]  = "11px";
							text.style["padding"]  = "1px 0";
							commentBlock.appendChild(text);
						}

						var count = comment.asc_getRepliesCount();
						for (var i = 0; i < count; i++) {
							drawComment(comment.asc_getReply(i));
						}
					}

					for (var i = 0; i < indexes.length; i++) {
						var comment = api.asc_findComment(indexes[i]);
						drawComment(comment);
					}

					// min
					if ( commentBlock.clientWidth < 160 )
						commentBlock.style["width"] = "160px"
					if ( commentBlock.clientHeight < 80 )
						commentBlock.style["height"] = "80px";
				}
			}
		}
	}
		
	function eventAddComment(id, oComment) {
		var nId = id;
	}
	
	function eventRemoveComment(id) {
		var nId = id;
	}
	
	function eventChangeCommentData(id, oComment) {
		
		var count = oComment.asc_getRepliesCount();
		
	}
	
	function eventUpdateCommentPosition(indexes, x, y, x2) {
		ClearCommentEditor();
		eventShowComment(indexes, x, y);
	}
	
	function eventShowComment(indexes, x, y) {
	
		ClearTooltip();
		if (ClearCommentEditor())
			return;
			
		if ((x < 0) || (y < 0))
			return;
				
		var canvasWidget = $("#" + api.HtmlElementName);
		
		var commentBlock = document.createElement("div");
		commentBlock.id = g_commentsEditorId;
		commentBlock.style["width"] = "300px";
		commentBlock.style["height"] = "auto";
		commentBlock.style["zIndex"] = "3000";
		commentBlock.style["padding"] = "2px";
		commentBlock.style["border"] = "1px solid Grey";
		commentBlock.style["backgroundColor"] = "#FFFF99";
		commentBlock.style["position"] = "absolute";
		commentBlock.style["top"] = (y + canvasWidget.offset().top) + "px";
		commentBlock.style["left"] = (x + canvasWidget.offset().left) + "px";
		$("body").append(commentBlock);
		
		// Editor
		var editorBlock = $("<div id='cellComment'>\
								<input id='showComments' type='checkbox' onchange='' checked='true'><span style='font-size: 11px;'>Show comments</span><br>\
								<input id='addComment' type='submit' onclick='' value='Add new comment'>\
							</div>");
		
		$("#" + g_commentsEditorId).append(editorBlock);
		
		api.asc_enableKeyEvents(false);
						
		var addBtn = editorBlock.find("#addComment");
		addBtn[0].onclick = function() {
		
			var comment = new window.Asc.asc_CCommentData();
			comment.asc_putText("");
			comment.asc_putUserId(api.UserId);
			comment.asc_putUserName("You");
			comment.asc_putTime(getDate());
			comment.asc_putDocumentFlag(false);
			api.asc_addComment(comment);
							
			InsertComment(comment, "cellComment");
			if (commentBlock.clientHeight > 400) {
				commentBlock.style["height"] = "500px";
				commentBlock.style["width"] = "320px";
				commentBlock.style["overflowY"] = "scroll";
				commentBlock.style["overflowX"] = "hidden";
			}
		}
		
		if (indexes.length)
			api.asc_selectComment(indexes[0]);
						
		for (var i = 0; i < indexes.length; i++) {
			var comment = api.asc_findComment(indexes[i]);
			InsertComment(comment, "cellComment");
			if (commentBlock.clientHeight > 400) {
				commentBlock.style["height"] = "500px";
				commentBlock.style["width"] = "320px";
				commentBlock.style["overflowY"] = "scroll";
				commentBlock.style["overflowX"] = "hidden";
			}
		}

		var showBtn = editorBlock.find("#showComments");
		showBtn[0].onchange = function() {
		if (this.checked)
			api.asc_showComments();
		else
			api.asc_hideComments();
		}
	}
	
	function eventHideComment() {
		ClearCommentEditor();
	}
	
	// Misc
	function ClearTooltip() {
		var bResult = false;
		var commentBlock = $("#" + g_commentsTooltipId);
		if ( commentBlock.length > 0 ) {
			commentBlock.remove();
			bResult = true;
		}
		return bResult;
	}
	
	function ClearCommentEditor() {
		var bResult = false;
		var commentBlock = $("#" + g_commentsEditorId);
		if ( commentBlock.length > 0 ) {
			commentBlock.remove();
			api.asc_enableKeyEvents(true);
			bResult = true;
		}
		return bResult;
	}
	
	function RecalcCommentEditor() {
		
		var commentEditor = $("#" + g_commentsEditorId);
		if (commentEditor.length > 0) {
			
			commentEditor[0].style["overflow"] = "hidden";
			commentEditor[0].style["height"] = "auto";
			commentEditor[0].style["width"] = "300px";
			
			if (commentEditor[0].clientHeight > 400) {
				commentEditor[0].style["height"] = "500px";
				commentEditor[0].style["width"] = "320px";
				commentEditor[0].style["overflowY"] = "scroll";
				commentEditor[0].style["overflowX"] = "hidden";
			}
		}
	}

	// Charts
	function showChartDialog() {
		var chart = api.asc_getChartObject();
		var objectsExist = api.asc_drawingObjectsExist();
		if (!chart)		// selected image
			return;
		BuildDrawingObjectMenu();
		$("#chartSelector").css("visibility", "visible");
		$("#chartSelector").dialog({ autoOpen: false, closeOnEscape: false, height: 'auto', width: 400,
					resizable: false, modal: true, title: "Chart properties", draggable: true,
					open: function() {

						var chartForm = $("#chartSelector");
						var range = chart.asc_getRange();
						var interval = range.asc_getInterval();

						chartForm.find("#chartRange").val(interval);
						chartForm.find("#chartRange").bind("keyup", function() {
							var result = range.asc_checkInterval(chartForm.find("#chartType").val(),chartForm.find("#chartSubType").val(),chartForm.find("#chartRange").val(),chartForm.find("#dataRows").is(":checked"));
							if (result)
								chartForm.find("#chartRange").css("color", "black");
							else
								chartForm.find("#chartRange").css("color", "red");
						});

						// Check selected
						if (chart.type) {

							if (range.rows)
								chartForm.find("#dataRows").attr("checked", range.asc_getRowsFlag());
							else
								chartForm.find("#dataColumns").attr("checked", range.asc_getColumnsFlag());

							chartForm.find("#chartTitle").val(chart.asc_getTitle());
							chartForm.find("#valueShow").attr("checked", chart.asc_getShowValueFlag());

							var xAxis = chart.asc_getXAxis();
							chartForm.find("#xAxisShow").attr("checked", xAxis.asc_getShowFlag());
							chartForm.find("#xGridShow").attr("checked", xAxis.asc_getGridFlag());
							chartForm.find("#xAxisTitle").val(xAxis.asc_getTitle() ? xAxis.asc_getTitle() : "");

							var yAxis = chart.asc_getXAxis();
							chartForm.find("#yAxisShow").attr("checked", yAxis.asc_getShowFlag());
							chartForm.find("#yGridShow").attr("checked", yAxis.asc_getGridFlag());
							chartForm.find("#yAxisTitle").val(yAxis.asc_getTitle() ? yAxis.asc_getTitle() : "");
						}
						else {
							chartForm.find("#dataRows").attr("checked", true);
						}
					},
					buttons: [
						{
							text: "Ok",
							click: function() {

								var chartForm = $("#chartSelector");
								var chart = api.asc_getChartObject();
								var isSelected = (chart.type != null) && (chart.type != "");

								var range = chart.asc_getRange();
								if (!range.asc_checkInterval(chartForm.find("#chartType").val(),chartForm.find("#chartSubType").val(),chartForm.find("#chartRange").val(),chartForm.find("#dataRows").is(":checked")))
									return;
								range.asc_setRowsFlag(chartForm.find("#dataRows").is(":checked"));
								range.asc_setColumnsFlag(chartForm.find("#dataColumns").is(":checked"));
								range.asc_setInterval(chartForm.find("#chartRange").val());

								chart.asc_setType(chartForm.find("#chartType").find("option:selected").val());
								chart.asc_setSubType(chartForm.find("#chartSubType").find("option:selected").val());

								chart.asc_setTitle(chartForm.find("#chartTitle").val());
								chart.asc_setShowValueFlag(chartForm.find("#valueShow").is(":checked"));

								if(chart.type != null && chart.type == 'Stock' && !isSelected)
								{
									var cellRange = api.wb.getWorksheet().getSelectedRange()
									var rowsSel = cellRange.last.row - cellRange.first.row + 1;
									var colsSel = cellRange.last.col - cellRange.first.col + 1;
									if((chart.range.columns && rowsSel != 4) || (chart.range.rows && colsSel != 4))
									{
										$(this).dialog("close");
										alert('Four rows are necessary in the following order: opening rate, maximum rate, minimum rate, closing rate.');
										return;
									}
								}

								var xAxis = chart.asc_getXAxis();
								xAxis.asc_setShowFlag(chartForm.find("#xAxisShow").is(":checked"));
								xAxis.asc_setGridFlag(chartForm.find("#xGridShow").is(":checked"));
								xAxis.asc_setTitle(chartForm.find("#xAxisTitle").val());

								var yAxis = chart.asc_getYAxis();
								yAxis.asc_setShowFlag(chartForm.find("#yAxisShow").is(":checked"));
								yAxis.asc_setGridFlag(chartForm.find("#yGridShow").is(":checked"));
								yAxis.asc_setTitle(chartForm.find("#yAxisTitle").val());

								var legend = chart.asc_getLegend();
								legend.asc_setShowFlag(chartForm.find("#legendShow").is(":checked"));
								//legend.asc_setShowFlag(true);
								legend.asc_setPosition("");

								if (chartForm.find("#legendLeft").is(":checked"))
									legend.asc_setPosition("left");
								else if (chartForm.find("#legendRight").is(":checked"))
									legend.asc_setPosition("right");
								else if (chartForm.find("#legendTop").is(":checked"))
									legend.asc_setPosition("top");
								else if (chartForm.find("#legendBottom").is(":checked"))
									legend.asc_setPosition("bottom");

								if (isSelected)
									api.asc_editChartDrawingObject(chart);
								else
									api.asc_addChartDrawingObject(chart);

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
						$("#drawingObjectsMenu").remove();
					},
					create: function() {
					}
		});
		$("#chartSelector").dialog("open");
	}
		
	// Images
	function showImageUrlDialog() {
		BuildDrawingObjectMenu();
		$("#imageSelector").css("visibility", "visible");
		$("#imageSelector").dialog({ autoOpen: false, closeOnEscape: false, height: 160, width: 400,
					resizable: false, modal: true, title: "Add image", draggable: true,
					open: function() {
						$("#imageSelectorUrl").val("");
					},
					buttons: [
						{
							text: "Ok",
							click: function() {

								var imageUrl = $("#imageSelectorUrl").val();
								api.asc_addImageDrawingObject(imageUrl);

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
						$("#drawingObjectsMenu").remove();
					},
					create: function() {
						$("#imageSelectorUrl").val("");
					}
		});
		$("#imageSelector").dialog("open");
	}
	
	$("#autoFilterCancel").click(function() { $('#MenuAutoFilter').hide(); });
	$("#autoFilterOk").click(function() {
		var cellId = $('#MenuAutoFilter').attr('idcolumn') 
		$('#MenuAutoFilter').hide();
		var type = 'mainFilter'
		var result = [];
		//посылаем информацию о ячейках, которые нужно скрыть
		var k = 0
		for(i = 0; i < $(".AutoFilterItem").length; i++)
		{
			val = $($(".AutoFilterItem")[i]).text();
			if(val == 'empty')
				val = '';
			result[i] = {};
			if($($(".AutoFilterItem")[i]).hasClass('hidden'))
			{
				result[i].val = val;
				result[i].vis = 'hidden';
			}
			else if($($(".AutoFilterItem")[i]).hasClass('SelectedAutoFilterItem'))
			{
				result[i].val = val;
				result[i].vis = true;
			}
			else if(!$($(".AutoFilterItem")[i]).hasClass('SelectedAutoFilterItem'))
			{
				result[i].val = val;
				result[i].vis = false;
			}
		}
		
		var autoFilterObject = new Asc.AutoFiltersOptions();
		autoFilterObject.asc_setCellId(cellId);
		autoFilterObject.asc_setResult(result);
		
		api.asc_applyAutoFilter(type,autoFilterObject);
	});
	$("#dialogFilter").dialog({ autoOpen: false, closeOnEscape: false, dialogClass: 'dialogClass',
		open: function() { aDialogNames.push("dialogFilter"); },
		close: function() { aDialogNames.pop(); },
		resizable: false, modal: true, width: '350px',
		buttons: [
			{
				text: 'Ok',
				click: function() {
					var isChecked = 'or';
					var type = 'digitalFilter';
					if($('#andCheck')[0].checked)
						isChecked = true;
					var logValFilter1  = $('#valueFilterSelect1').val();
					var logValFilter2  = $('#valueFilterSelect2').val();
					var valFilter1 = $('#filterSelect1').val()
					var valFilter2 = $('#filterSelect2').val()
					var idColumn = $('#MenuAutoFilter').attr('idcolumn');

					
					var autoFilterObject = new Asc.AutoFiltersOptions();
					
					autoFilterObject.asc_setCellId(idColumn);
					autoFilterObject.asc_setFilter1(valFilter1);
					autoFilterObject.asc_setFilter2(valFilter2);
					autoFilterObject.asc_setValFilter1(logValFilter1);
					autoFilterObject.asc_setValFilter2(logValFilter2);
					autoFilterObject.asc_setIsChecked(isChecked);
					
					api.asc_applyAutoFilter(type,autoFilterObject); 
					
					$(this).dialog("close");
				}
			},
			{
				text: 'Cancel',
				btCancel: "classButtonCancel",
				click: function() { $(this).dialog("close"); }
			}
		]
	});
	$("#numericalFilter").click(function() {
		$('#MenuAutoFilter').hide();
		api.asc_enableKeyEvents(false);
		var isCheck = autoFilterObj.asc_getIsChecked();
		if(autoFilterObj)
		{
			var valFilter1 = autoFilterObj.asc_getValFilter1();
			var valFilter2 = autoFilterObj.asc_getValFilter2();
			var filter1 = autoFilterObj.asc_getFilter1();
			var filter2 = autoFilterObj.asc_getFilter2();
			
			if(valFilter1)
				$("#valueFilterSelect1").val(valFilter1);
			else
				$("#valueFilterSelect1").val('');
				
			if(valFilter2)
				$("#valueFilterSelect2").val(valFilter2);
			else
				$("#valueFilterSelect2").val('');
			
			if(filter1)
				$("#filterSelect1").val(filter1);
			if(filter2)
				$("#filterSelect2").val(filter2);
			
			if(isCheck)
			{
				$("#andCheck").attr("checked", 'checked');
			}
			else
			{
				$("#orCheck").attr("checked", 'checked');
			}
		}
		$("#dialogFilter").dialog("open");
		
	});
	$("#sortAscending").click(function() {
		$('#MenuAutoFilter').hide();
		api.asc_enableKeyEvents(false);
		var idColumn = $('#MenuAutoFilter').attr('idcolumn');
		var autoFilterObject = new Asc.AutoFiltersOptions();
		autoFilterObject.asc_setCellId(idColumn);
		api.asc_sortColFilter(true,autoFilterObject); 
	});
	$("#sortDescending").click(function() {
		$('#MenuAutoFilter').hide();
		api.asc_enableKeyEvents(false);
		var idColumn = $('#MenuAutoFilter').attr('idcolumn');
		var autoFilterObject = new Asc.AutoFiltersOptions();
		autoFilterObject.asc_setCellId(idColumn);
		api.asc_sortColFilter(false,autoFilterObject); 
	});
	$("#selectAllElements").click(function() {
		var elements = $(".AutoFilterItem ");
		for(l = 0; l < elements.length; l++)
		{
			var elem = $(elements[l])
			if(!elem.hasClass('hidden') && !elem.hasClass('hidden2'))
			{
				if(!$("#selectAllElements").hasClass('SelectedAutoFilterItem'))
					elem.addClass('SelectedAutoFilterItem')
				else
					elem.removeClass('SelectedAutoFilterItem')
			}
		}
		if($("#selectAllElements").hasClass('SelectedAutoFilterItem'))
			$("#selectAllElements").removeClass('SelectedAutoFilterItem')
		else
			$("#selectAllElements").addClass('SelectedAutoFilterItem')
			
	});
});