var d1,d2,d3;
var g_nHSLMaxValue = 240;
var g_nVerticalTextAngle = 255;
var gc_dDefaultColWidthChars = 8;
var gc_dDefaultColWidthCharsAttribute;//определяется в WorksheetView.js
var g_nNextWorksheetId = 1;
var g_sNewSheetNamePattern = "Sheet";
var g_nSheetNameMaxLength = 31;
var g_nAllColIndex = -1;
var History;
var aStandartNumFormats;
var aStandartNumFormatsId;
var start, end, dep, cCharDelimiter = String.fromCharCode(5), arrRecalc = {};

var c_oRangeType =
{
    Range:0,
    Col:1,
    Row:2,
	All:3
};

function fSortAscending(a, b){return a - b;}
function fSortDescending(a, b){return b - a;}

function consolelog(text){
	if( window.g_debug_mode && console && console.log )
		console.log(text);
}

/** @constructor */
function DependencyGraph(wb) {
	var nodes = {}, badRes = [], result = [], nodeslength = 0, nodesfirst, __nodes = {}, areaNodes = {}, thas = this;
	
	this.wb = wb;
	
	this.clear = function(){
		nodes = {};
		__nodes = {};
		areaNodes = {};
		badRes = [];
		result = [];
		nodeslength = 0;
		nodesfirst = null;
	}
	
	this.nodeExist = function(node){
		return nodes[node.nodeId] !== undefined;
	}

	this.nodeExist2 = function(sheetId, cellId){
		var n = new Vertex(sheetId, cellId);
		var exist = nodes[n.nodeId] !== undefined;
		if ( !exist ){
			for( var id in areaNodes){
				if( areaNodes[id].containCell(n) )
					return true;
			}
		}
		return exist;
	}
	
	//добавляем вершину по id листа и по id ячейки
	this.addNode = function(sheetId, cellId){
		var node = new Vertex(sheetId, cellId,this.wb);
		if (nodes[node.nodeId] === undefined){
			if (nodeslength == 0){
				nodesfirst = node.nodeId;
			}
			nodes[node.nodeId] = node;
			nodeslength++;
			if( node.isArea && !areaNodes[node.nodeId] ){
				areaNodes[node.nodeId] = node;
			}
		}
	}

	//добавляем уже существующую вершину
	this.addNode2 = function(node){
		if (nodes[node.nodeId] === undefined) {
			if (nodeslength == 0){
				nodesfirst = node.nodeId;
			}
			nodes[node.nodeId] = node;
			nodeslength ++;
			if( node.isArea && !areaNodes[node.nodeId] ){
				areaNodes[node.nodeId] = node;
			}
		}
	}
	
	//добавление ребер между вершинами
	this.addEdge = function(sheetIdFrom, cellIdFrom, sheetIdTo, cellIdTo){
		var n1 = new Vertex(sheetIdFrom, cellIdFrom,this.wb),
			n2 = new Vertex(sheetIdTo, cellIdTo,this.wb);
			
		if( !this.nodeExist(n1) ){
			this.addNode2(n1);
		}
		
		if( !this.nodeExist(n2) ){
			this.addNode2(n2);
		}
		
		nodes[n1.nodeId].addMasterEdge(nodes[n2.nodeId]);
		nodes[n2.nodeId].addSlaveEdge(nodes[n1.nodeId]);
	}

	this.addEdge2 = function(nodeFrom, nodeTo){

		if( !this.nodeExist(nodeFrom) ){
			this.addNode2(nodeFrom);
		}
		
		if( !this.nodeExist(nodeTo) ){
			this.addNode2(nodeTo);
		}
		
		nodes[nodeFrom.nodeId].addMasterEdge(nodes[nodeTo.nodeId]);
		nodes[nodeTo.nodeId].addSlaveEdge(nodes[nodeFrom.nodeId]);
	}
	
	this.renameNode = function(sheetIdFrom, cellIdFrom, sheetIdTo, cellIdTo){
		if( sheetIdFrom == sheetIdTo && cellIdFrom == cellIdTo ){
			return;
		}
		nodes[getVertexId(sheetIdTo, cellIdTo)] = nodes[getVertexId(sheetIdFrom, cellIdFrom)];
		if( !nodes[getVertexId(sheetIdTo, cellIdTo)] )
			return;
		nodes[getVertexId(sheetIdFrom, cellIdFrom)] = undefined;
		delete nodes[getVertexId(sheetIdFrom, cellIdFrom)];
		nodes[getVertexId(sheetIdTo, cellIdTo)].changeCellId(cellIdTo);
	}
	
	this.getNode = function(sheetId, cellId){
		var n = new Vertex(sheetId, cellId)
		if( this.nodeExist(n) )
			return nodes[n.nodeId];
	}
	
	this.getNodeByNodeId = function(nodeId){
		if( nodes[nodeId] )
			return nodes[nodeId];
	}
	
	this.getNodeBySheetId = function(sheetId){
		var arr = [];
		for(var id in nodes){
			if ( nodes[id].sheetId == sheetId && nodes[id].getSlaveEdges()){
				arr.push(nodes[id]);
				var n = nodes[id].getSlaveEdges()
				for(var id2 in n){
					n[id2].weightNode++;
					// arr.push(n[id2]);
				}
			}
		}
		return arr;
	}
	
	this.deleteNode = function(n){
		if( this.nodeExist(n) ){
			var _n = nodes[n.nodeId];
			_n.deleteAllMasterEdges();
			_n.deleteAllSlaveEdges();
			nodes[_n.nodeId] = null;
			delete nodes[_n.nodeId];
			nodeslength--;
		}
	}
	
	this.deleteMasterNodes = function(sheetId, cellId){
		var n = new Vertex(sheetId, cellId);
		if( this.nodeExist(n) ){
			var arr = nodes[n.nodeId].deleteAllMasterEdges();
			for(var i = 0; i < arr.length; i++){
				if( nodes[arr[i]].refCount <= 0 ){
					nodes[arr[i]] = null;
					delete nodes[arr[i]];
					nodeslength--;
				}
			}
		}
	}
	
	this.deleteSlaveNodes = function(sheetId, cellId){
		var n = new Vertex(sheetId, cellId);
		if( this.nodeExist(n) ){
			nodes[n.nodeId].deleteAllSlaveEdges();
		}
	}
	
	this.getSlaveNodes = function(sheetId, cellId){
		var node = new Vertex(sheetId, cellId);
		if( this.nodeExist(node) ){
			return nodes[node.nodeId].getSlaveEdges();
		}
		else{
			var _t = {}, f = false;
			for( var id in areaNodes ){
				if( areaNodes[id].containCell(node) ){
					_t[id] = areaNodes[id];
					f = true;
				}
			}
			if (f)
				return _t;
		}
		return null;
	}

	this.getMasterNodes = function(sheetId, cellId){
		var n = new Vertex(sheetId, cellId);
		if( this.nodeExist(n) ){
			return nodes[n.nodeId].getMasterEdges();
		}
		return null;
	}
	
	//объект __nodes является копией объекта nodes. чтобы не бегать по всему графу в поисках очередной вершины, будем бегать по __nodes и удалять полученную новую вершину из __nodes.
	this.addN = function(sheetId,cellId){
		var n = new Vertex(sheetId,cellId,this.wb);
		if( !(n.nodeId in __nodes) ){
			__nodes[n.nodeId] = n;
		}
	}
	
	//сортировка по зависимым(ведомым) ячейкам. у объекта берем массив slaveEdges и по нему бегаем.
	this.t_sort_slave = function(sheetId,cellId){
	
		for( var id in nodes ){
			if( !nodes[id].isArea ){
				for( var id2  in areaNodes ){
					if( areaNodes[id2].containCell(nodes[id]) ){
						areaNodes[id2].addMasterEdge(nodes[id]);
						nodes[id].addSlaveEdge(areaNodes[id2]);
					}
				}
			}
		}
	
		function getFirstNode(sheetId,cellId) {
			
			var n = new Vertex(sheetId,cellId,thas.wb);
			if ( !nodes[n.nodeId] ){
				var a = [];
				for( var id in areaNodes ){
					if( areaNodes[id].containCell(n) )
						a.push(areaNodes[id])
				}
				if( a.length > 0 ){
					for( var i in a ){
						n.addSlaveEdge( a[i] );
					}
					n.valid = false;
					return n;
				}
				else{
					return undefined;
				}
			}
			else
				return nodes[n.nodeId];
		}
		
		function getNextNode(node) {
			for (var id in node.slaveEdges){
				var n = nodes[id];
				if (n !== undefined){
					if ((n.isBlack === undefined || !n.isBlack) && !n.isBad) {
						return n;
					}
				}
				else {
					delete node.slaveEdges[id];
				}
			}
			return undefined;
		}
		
		var stack = [],	n = getFirstNode(sheetId,cellId),__t = true, next, badResS = [], resultS = [];

		if( !n ){
			return {depF: resultS.reverse(), badF: badResS}
		}
		
		while (1) {
			if ( n.isGray && !n.isArea ){
				for( var i = stack.length-1; i>=0;i--){
					var bad = stack.pop();
					bad.isBad = true;
					badResS.push(bad);
					if ( stack[i] == n )
						break;
				}
				if (stack.length < 1) {
					for (var id in __nodes){
						if( nodes[id] !== undefined && ((nodes[id].isBlack === undefined || !nodes[id].isBlack) && !nodes[id].isBad) ){
							n = nodes[id];
							delete __nodes[id];
						}
					}
				}
			}
			next = getNextNode(n);
			if (next !== undefined) {
				n.isGray = true;
				stack.push(n);
				n = next;
			}
			else {
				n.isBlack = true;
				n.isGray = false;
				resultS.push(n);
				if (stack.length < 1)
					break;
				n = stack.pop();
				n.isGray = false;
			}
		}
		
		for(var i = 0; i < resultS.length; i++){
			resultS[i].isBlack = false;
			resultS[i].isBad = false;
			resultS[i].isGray = false;
		}
		for(var i = 0; i < badResS.length; i++){
			badResS[i].isBlack = false;
			badResS[i].isBad = false;
			badResS[i].isGray = false;
		}
		
		return {depF: resultS.reverse(), badF: badResS}
		
	}
	
	//сортировка по ведущим ячейкам. у объекта берем массив masterEdges и по нему бегаем.
	this.t_sort_master = function(sheetId,cellId){
		
		function getFirstNode(sheetId,cellId) {
			
			var n = new Vertex(sheetId,cellId,thas.wb);
			if ( !nodes[n.nodeId] ){
				var a = [];
				for( var id in areaNodes ){
					if( areaNodes[id].containCell(n) )
						a.push(areaNodes[id])
				}
				if( a.length > 0 ){
					for( var i in a ){
						n.addSlaveEdge( a[i] );
					}
					n.valid = false;
					return n;
				}
				else{
					return undefined;
				}
			}
			else
				return nodes[n.nodeId];
		}
		
		function getNextNode(node) {
			if(node){
				for (var id in node.masterEdges){
					var n = nodes[id];
					if (n !== undefined){
						if ((n.isBlack === undefined || !n.isBlack) && !n.isBad) {
							return n;
						}
					}
					else {
						delete node.masterEdges[id];
					}
				}
			}
			return undefined;
		}
		
		var stack = [],	n = getFirstNode(sheetId,cellId), __t = true, next, badResS = [], resultS = [];
		
		if( !n ){
			return {depF: resultS, badF: badResS}
		}
		
		while (1) {
			if( n ){
				if ( n.isGray && !n.isArea ){
					for( var i = stack.length-1; i>=0;i--){
						var bad = stack.pop();
						bad.isBad = true;
						badResS.push(bad);
					}
				}
			}
			if( n.valid && !n.isArea ){
				for( var id in areaNodes ){
					if( areaNodes[id].containCell(n) ){
						areaNodes[id].addMasterEdge(n);
						n.addSlaveEdge(areaNodes[id]);
					}
				}
				n.valid = false;
			}
			next = getNextNode(n);
			if (next !== undefined) {
				n.isGray = true;
				stack.push(n);
				n = next;
			}
			else {
				n.isBlack = true;
				n.isGray = false;
				resultS.push(n);
				if (stack.length < 1)
					break;
				n = stack.pop();
				n.isGray = false;
			}
		}
		
		for(var i = 0; i < resultS.length; i++){
			resultS[i].isBlack = false;
			resultS[i].isBad = false;
			resultS[i].isGray = false;
		}
		for(var i = 0; i < badResS.length; i++){
			badResS[i].isBlack = false;
			badResS[i].isBad = false;
			badResS[i].isGray = false;
		}
		
		return {depF: resultS, badF: badResS}
	}
	
	//сортировка всего графа по всем вершинам.
	this.t_sort = function() {
	
		for(var i in nodes){
			nodes[i].isBlack = false;
			nodes[i].isBad = false;
			nodes[i].isGray = false;
		}
	
		function getFirstNode() {
			return nodes[nodesfirst];
		}
		
		function getNextNode(node) {
			for (var id in node.masterEdges){
				var n = nodes[id];
				if (n !== undefined){
					if ((n.isBlack === undefined || !n.isBlack) && !n.isBad) {
						return n;
					}
				}
				else {
					delete node.masterEdges[id];
				}
			}
			return undefined;
		}

		var stack = [],
				n = getFirstNode(),__t = true,
				next;
		while (1) {
			if ( n.isGray ){
				for( var i = stack.length-1; i>=0;i--){
					var bad = stack.pop();
					bad.isBad = true;
					badRes.push(bad);
					if ( stack[i] == n )
						break;
				}
				if (stack.length < 1) {
					for (var id in __nodes){
						if( nodes[id] !== undefined && ((nodes[id].isBlack === undefined || !nodes[id].isBlack) && !nodes[id].isBad) ){
							n = nodes[id];
							delete __nodes[id];
						}
					}
				}
			}
			next = getNextNode(n);
			if (next !== undefined) {
				n.isGray = true;
				stack.push(n);
				n = next;
			}
			else {
				n.isBlack = true;
				n.isGray = false;
				result.push(n);
				if (stack.length < 1) {
					n = undefined;
					for (var id in __nodes){
						if( nodes[id] !== undefined && ((nodes[id].isBlack === undefined || !nodes[id].isBlack) && !nodes[id].isBad) ){
							n = nodes[id];
							delete __nodes[id];
							break;
						}
						else{
							delete __nodes[id];
						}
					}
					if (n)
						continue;
					else break;
				}
				n = stack.pop();
				n.isGray = false;
			}
		}

		return {depF: result, badF: badRes}
		
	}

	this.returnNode = function(){
		return nodes;
	}
	
	this.getNodesLength = function(){
		return nodeslength;
	}
	
	this.getResult = function(){
		return {depF:result, badF:badRes};
	}
	
	this.checkOffset = function(BBox, offset, wsId, noDelete){
		var move = {}, stretch = {}, recalc = {};
		for( var id in nodes ){
			if( nodes[id].sheetId != wsId )
				continue;
			var n = { r1:nodes[id].firstCellAddress.getRow0(), c1:nodes[id].firstCellAddress.getCol0(),
					  r2:nodes[id].lastCellAddress.getRow0(), c2:nodes[id].lastCellAddress.getCol0() }
			if( nodes[id].isArea ){
				/* 
					Есть 2 области. Первая это диапазон? что участвует в формуле, второй - то который удаляют/вставляют. Нужно определить положение двух этих областей относительно друг друга. 
					Если вторая область находится ( ( выше и левее ) или правее или ниже ) первой такая область нас не интересуею. Она не повлияет на сдвиг диапазона.
					Если же она находится выше или левее, перекрывает частично или полностью диапазон, необходимо отследить какой сдвиг будет следовать - по вертикали или по горизонтали. После чего следует выполнить соответсвтующие действия - расширить диапазон, сдвинуть диапазон, просто пересчитать.
					Для проверки на способ перекрытия переношу начало координат в левый верхний угол диапазона, меняю координаты у второй области и сравниваю возможные варианты расположения используя координаты углов обоих областей. 
					PS вариант не нравится, слишком много if. Хотелось бы поэллегантнее решение.
				*/
				var n1 = { r1: n.r1 - n.r1, c1: n.c1 - n.c1, 
						   r2: n.r2 - n.r1, c2: n.c2 - n.c1 };
					n1.height = n1.r2 - n1.r1;
					n1.width = n1.c2 - n1.c1;
						   
				var BBox1 = { r1: BBox.r1 - n.r1, c1: BBox.c1 - n.c1,
							  r2: BBox.r2 - n.r1, c2: BBox.c2 - n.c1 };
					n1.height = BBox1.r2 - BBox1.r1;
					n1.width = BBox1.c2 - BBox1.c1;
							  
				if( BBox1.r1 > n1.r2 || BBox1.c1 > n1.c2 || ( BBox.r2 < 0 && BBox1.c2 < 0 ) )//(слева и выше) или справа или снизу
					continue;
				else{
				
					if( offset.offsetRow == 0 ){
					
						if( offset.offsetCol == 0 ){
							continue;
						}
						else{
							if( BBox1.r2 < n1.r1 ) continue;
							else if( BBox1.r2 < n1.r2 || BBox1.r1 > n1.r1 ){
								recalc[id] = nodes[id];
							}
							else{
								if( offset.offsetCol > 0 ){
									if( BBox1.r1 <= n1.r1 && BBox1.r2 >= n1.r2){
										if( BBox1.c2 <= n1.c2 && BBox1.c1 <= n1.c1 || BBox1.c1 == n1.c1 && BBox1.c2 > n1.c2 )
											move[id] = { node : nodes[id], offset : offset };
										else if( BBox1.c1 > n1.c1 && BBox1.c1 <= n1.c2 ){
											stretch[id] = { node : nodes[id], offset : offset };
										}
									}
								}
								else{
									if( BBox1.r1 <= n1.r1 && BBox1.r2 >= n1.r2){
										if( BBox1.c2 < n1.c1 ){
											move[id] = { node : nodes[id], offset : offset };
										}
										else if( BBox1.c2 >= n1.c1 && BBox1.c1 <= n1.c1 ){
											if(	n1.r1 >= BBox1.r1 && n1.r2 <= BBox1.r2 && n1.c1 >= BBox1.c1 && n1.c2 <= BBox1.c2 ){
												move[id] = { node : nodes[id], offset : offset , toDelete: !noDelete };
												recalc[id] = nodes[id];
											}
											else{
												move[id] = { node : nodes[id], offset : { offsetCol : -Math.abs(n1.c1-BBox1.c1), offsetRow: offset.offsetRow } };
												stretch[id] = { node : nodes[id], offset : { offsetCol : -Math.abs(n1.c1-BBox1.c2)-1, offsetRow: offset.offsetRow } };
												recalc[id] = nodes[id];
											}
										}
										else if( BBox1.c1 > n1.c1 && BBox1.c1 <= n1.c2 || BBox1.c1 == n1.c1 && BBox1.c2 >= n1.c1 ){
											if( BBox1.c2 > n1.c2 ){
												stretch[id] = { node : nodes[id], offset : { offsetCol : -Math.abs(n1.c2-BBox1.c1)-1, offsetRow: offset.offsetRow } };
												recalc[id] = nodes[id];
											}
											else{
												stretch[id] = { node : nodes[id], offset : offset };
												recalc[id] = nodes[id];
											}
										}
									}
								}
							}
						}
						
					}
					else{
						if( BBox1.c2 < n1.c1 ) continue;
						else if( BBox1.c2 < n1.c2 || BBox1.c1 > n1.c1 ){
							recalc[id] = nodes[id];
						}
						else{
							if( offset.offsetRow > 0 ){
								if( BBox1.c1 <= n1.c1 && BBox1.c2 >= n1.c2){
									if( BBox1.r2 <= n1.r2 && BBox1.r1 <= n1.r1 || BBox1.r1 == n1.r1 && BBox1.r2 > n1.r2 )
										move[id] = { node : nodes[id], offset : offset };
									else if( BBox1.r1 > n1.r1 && BBox1.r1 <= n1.r2 ){
										stretch[id] = { node : nodes[id], offset : offset };
									}
								}
							}
							else{
								if( BBox1.c1 <= n1.c1 && BBox1.c2 >= n1.c2){
									if( BBox1.r2 < n1.r1 ){
										move[id] = { node : nodes[id], offset : offset };
									}
									else if( BBox1.r2 >= n1.r1 && BBox1.r1 <= n1.r1 ){
										if(	n1.r1 >= BBox1.r1 && n1.r2 <= BBox1.r2 && n1.c1 >= BBox1.c1 && n1.c2 <= BBox1.c2 ){
											move[id] = { node : nodes[id], offset : offset , toDelete: !noDelete };
											recalc[id] = nodes[id];
										}
										else{
											move[id] = { node : nodes[id], offset : { offsetRow : -Math.abs(n1.r1-BBox1.r1), offsetCol: offset.offsetCol } };
											stretch[id] = { node : nodes[id], offset : { offsetRow : -Math.abs(n1.r1-BBox1.r2)-1, offsetCol: offset.offsetCol } };
											recalc[id] = nodes[id];
										}
									}
									else if( BBox1.r1 > n1.r1 && BBox1.r1 <= n1.r2 || BBox1.r1 == n1.r1 && BBox1.r2 >= n1.r1 ){
										if( BBox1.r2 > n1.r2 ){
											stretch[id] = { node : nodes[id], offset : { offsetRow : -Math.abs(n1.r2-BBox1.r1)-1, offsetCol: offset.offsetCol } };
											recalc[id] = nodes[id];
										}
										else{
											stretch[id] = { node : nodes[id], offset : offset };
											recalc[id] = nodes[id];
										}
									}
								}
							}
						}
					}
				}
			}
			else{
				//сдвиг для одиночной ячейки 
				if( ( n.r1 >= BBox.r1 && n.r1 <= BBox.r2 && n.c1 >= BBox.c2 && offset.offsetCol != 0 ) ||
					( n.c1 >= BBox.c1 && n.c1 <= BBox.c2 && n.r1 >= BBox.r2 && offset.offsetRow != 0 ) ||
					( n.r1 >= BBox.r1 && n.r2 <= BBox.r2 && n.c1 >= BBox.c1 && n.c2 <= BBox.c2 ) )
				{
					move[id] = { node : nodes[id], offset : offset , toDelete: false };
					if(	n.r1 >= BBox.r1 && n.r2 <= BBox.r2 && n.c1 >= BBox.c1 && n.c2 <= BBox.c2 && !noDelete && ( offset.offsetCol < 0 || offset.offsetRow < 0 ) ){
						move[id].toDelete = true;
						recalc[id] = nodes[id];
					}
				}
			}
		}
		
		return {move:move,stretch:stretch,recalc:recalc};
	}
	
	this.helper = function(BBox,wsId){
		var move = {}, recalc = {},
			range = this.wb.getWorksheetById(wsId).getRange(new CellAddress(BBox.r1, BBox.c1, 0), new CellAddress(BBox.r2, BBox.c2, 0)),
			exist = false,
			n = new Vertex(range.getWorksheet().getId(),range.getName()),
			nID = getVertexId(range.getWorksheet().getId(),range.getName());
		
		if( n.isArea ){
			if( n.nodeId in nodes ){
				move[n.nodeId] = nodes[n.nodeId];
			}
			else{
				range = range.getCells();
				for( var id in range ){
					n = new Vertex(wsId,range[id].getName());
					if( n.nodeId in nodes ){
						move[n.nodeId] = nodes[n.nodeId];
					}
					for( var id2 in areaNodes ){
						if( areaNodes[id2].containCell(n) ){
							recalc[id2] = areaNodes[id2];
						}
					}
				}
			}
		}
		else {
			if( n.nodeId in nodes ){
				move[n.nodeId] = nodes[n.nodeId];
			}
			for( var id  in areaNodes ){
				if( areaNodes[id].containCell(n) ){
					recalc[id] = areaNodes[id];
				}
			}
		}
		
		return {move:move,recalc:recalc};
	}

	this.drawDep = function(cellId,se){
		
		if( !cellId )
			return;
		var _wsV = this.wb.oApi.wb.getWorksheet(),
			_getCellMetrics = _wsV.cellCommentator.getCellMetrics,
			_cc = _wsV.cellCommentator,
			ctx = _wsV.overlayCtx,
			_wsVM = _wsV.model,
			nodeId = getVertexId(_wsVM.getId(), cellId),
			node = this.getNode(_wsVM.getId(), cellId),
			cell;
		
			function gCM(_this,col,row){
				var metrics = { top: 0, left: 0, width: 0, height: 0, result: false }; 	// px

				var fvr = _this.getFirstVisibleRow();
				var fvc = _this.getFirstVisibleCol();
				var mergedRange = _this._getMergedCellsRange(col, row);

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
				}
				else{

					metrics.top = _this.getCellTop(row, 0) - _this.getCellTop(fvr, 0) + _this.getCellTop(0, 0);
					metrics.left = _this.getCellLeft(col, 0) - _this.getCellLeft(fvc, 0) + _this.getCellLeft(0, 0);
					metrics.width = _this.getColumnWidth(col, 0);
					metrics.height = _this.getRowHeight(row, 0);
					metrics.result = true;
				}
		
				return metrics
			}
		
		if( !node )
			return;
			
		cell = node.returnCell();
			
		if( !cell )
			return;
			
		var m = [cell.getCellAddress().getRow0(),cell.getCellAddress().getCol0()],
			rc = [], me = se?node.getSlaveEdges():node.getMasterEdges();
		
		for( var id in me ){
			if( me[id].sheetId != node.sheetId )
				return;
			
			if( !me[id].isArea ){
				var _t1 = gCM(_wsV,me[id].returnCell().getCellAddress().getCol0(),me[id].returnCell().getCellAddress().getRow0())
				
				rc.push({ t: _t1.top, l: _t1.left, w: _t1.width, h: _t1.height, apt: _t1.top+_t1.height/2, apl: _t1.left+_t1.width/4});
			}
			else{
				var _t1 = gCM(_wsV,me[id].firstCellAddress.getCol0(),me[id].firstCellAddress.getRow0()),
					_t2 = gCM(_wsV,me[id].lastCellAddress.getCol0(),me[id].lastCellAddress.getRow0());
					
				rc.push({ t: _t1.top, l: _t1.left, w: _t2.left+_t2.width-_t1.left, h: _t2.top+_t2.height-_t1.top, apt: _t1.top+_t1.height/2, apl:_t1.left+_t1.width/4  });
			}
		}
		
		if( rc.length == 0 )
			return;
		
		function draw_arrow(context, fromx, fromy, tox, toy) {
			var headlen = 9;
			var dx = tox - fromx;
			var dy = toy - fromy;
			var angle = Math.atan2(dy, dx), _a = Math.PI / 18;
			context.save()
				.setLineWidth(1)
				.beginPath()
				.moveTo(_cc.pxToPt(fromx), _cc.pxToPt(fromy),-0.5,-0.5)
				.lineTo(_cc.pxToPt(tox), _cc.pxToPt(toy),-0.5,-0.5)
				// .dashLine(_cc.pxToPt(fromx-.5), _cc.pxToPt(fromy-.5), _cc.pxToPt(tox-.5), _cc.pxToPt(toy-.5), 15, 5)
			context
				.moveTo(
					_cc.pxToPt(tox - headlen * Math.cos(angle - _a)),
					_cc.pxToPt(toy - headlen * Math.sin(angle - _a)),-0.5,-0.5)
				.lineTo(_cc.pxToPt(tox), _cc.pxToPt(toy),-0.5,-0.5)
				.lineTo(
					_cc.pxToPt(tox - headlen * Math.cos(angle + _a)),
					_cc.pxToPt(toy - headlen * Math.sin(angle + _a)),-0.5,-0.5)
				.lineTo(
					_cc.pxToPt(tox - headlen * Math.cos(angle - _a)),
					_cc.pxToPt(toy - headlen * Math.sin(angle - _a)),-0.5,-0.5)
				.setStrokeStyle("#0000FF")
				.setFillStyle("#0000FF")
				.stroke()
				.fill()
				.closePath()
				.restore();
		}
		
		function h(m,rc){
			var m = gCM(_wsV,m[1],m[0]);
			var arrowPointTop = 10, arrowPointLeft = 10;
			for(var i = 0; i<rc.length;i++){
				var m2 = rc[i],
					x1 = Math.floor(m2.apl),
					y1 = Math.floor(m2.apt),
					x2 = Math.floor(m.left+m.width/4),
					y2 = Math.floor(m.top+m.height/2);
				
				if( x1<0 && x2<0 || y1<0 && y2<0)
					continue;
				
				if( m2.apl > 0 && m2.apt >0)
					ctx.save()
						.setLineWidth(1)
						.setStrokeStyle("#0000FF")
						.rect( _cc.pxToPt(m2.l),_cc.pxToPt(m2.t),_cc.pxToPt(m2.w-1),_cc.pxToPt(m2.h-1), -.5, -.5 )
						.stroke()
						.restore();
				if(y1<0 && x1 != x2)
					x1 = x1-Math.floor(Math.sqrt(((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))*y1*y1/((y2-y1)*(y2-y1)))/2)
				if(x1<0 && y1 != y2)	
					y1 = y1-Math.floor(Math.sqrt(((y1-y2)*(y1-y2)+(x1-x2)*(x1-x2))*x1*x1/((x2-x1)*(x2-x1)))/2)
					
				draw_arrow(ctx, x1<0?_wsV.getCellLeft(0, 0):x1, y1<0?_wsV.getCellTop(0, 0):y1, x2, y2);
				
				if( m2.apl > 0 && m2.apt >0)
					ctx.save()
						.beginPath()
						.arc(_cc.pxToPt(Math.floor(m2.apl)),
							_cc.pxToPt(Math.floor(m2.apt)),
							3,0, 2 * Math.PI, false,-0.5,-0.5)
						.setFillStyle("#0000FF")
						.fill()
						.closePath()
						.restore();
			}
		}
			
		ctx.clear();
		_wsV._drawSelection();	

		if( se ){
			for( var i = 0; i < rc.length; i++ )
				h(rc[i],[m]);
		}
		else
			h(m,rc);
	}
	
	this.removeNodeBySheetId = function(sheetId){
		var arr = false;
		this.wb.needRecalc = [];
		this.wb.needRecalc.length = 0;
		for(var id in nodes){
			if(nodes[id].sheetId == sheetId){
				var se = nodes[id].getSlaveEdges();
				for(var id2 in se){
					if(se[id2].sheetId != sheetId){
						if(!arr) arr = true;
						this.wb.needRecalc[id2] = [se[id2].sheetId,se[id2].cellId];
						this.wb.needRecalc.length++;
						// arr.push(se[id2]);
					}
				}
				nodes[id].deleteAllMasterEdges();
				nodes[id].deleteAllSlaveEdges();
				nodes[id] = null;
				delete nodes[id];
				nodeslength--;
			}
		}
		return arr;
	}
}

/** @constructor */
function Vertex(sheetId,cellId,wb){
	
	this.sheetId = sheetId;
	this.cellId = cellId;
	this.valid = true;
	this.nodeId = sheetId + cCharDelimiter + cellId;
	
	var nIndex = cellId.indexOf(":");
	if( this.isArea = (nIndex > -1) ){
		var sFirstCell = cellId.substring(0, nIndex);
		var sLastCell = cellId.substring(nIndex + 1);
		
		if( !sFirstCell.match(/[^a-z]/ig) ){
			this.firstCellAddress = new CellAddress(sFirstCell+"1");
			this.lastCellAddress = new CellAddress(sLastCell+gc_nMaxRow.toString());
		}
		else if( !sFirstCell.match(/[^0-9]/ig) ){
			this.firstCellAddress = new CellAddress("A"+sFirstCell);
			this.lastCellAddress = new CellAddress(g_oCellAddressUtils.colnumToColstr(gc_nMaxCol)+sLastCell);
		}
		else{
			this.firstCellAddress = new CellAddress(sFirstCell);
			this.lastCellAddress = new CellAddress(sLastCell);
		}
		
		this.containCell = function(node){
			if( this.sheetId != node.sheetId )
				return false;
			if( node.firstCellAddress.row >= this.firstCellAddress.row &&
				node.firstCellAddress.col >= this.firstCellAddress.col &&
				node.lastCellAddress.row <= this.lastCellAddress.row &&
				node.lastCellAddress.col <= this.lastCellAddress.col
			){
				return true;
			}
			return false;
		}

	}
	else{
		this.firstCellAddress = this.lastCellAddress = new CellAddress(cellId);
	}

	if( wb && !this.isArea ){
		this.wb = wb;
		var c = new CellAddress(this.cellId);
		this.cell = this.wb.getWorksheetById(this.sheetId)._getCellNoEmpty(c.getRow0(),c.getCol0());
	}
	
	//вершина которую мы прошли и поставили в очередь обхода
	this.isBlack = false;
	
	//вершина которую мы прошли, но не поставили в очередь обхода. нужно для определения петель в графе.
	this.isGray = false;
	
	//если вершина входит в цикличный путь, то она помечается плохой и запоминается в списке плохих вершин.
	this.isBad = false;
	
	//masterEdges содержит ячейки, от которых зависит текущая ячейка
	this.masterEdges = null;
	
	this.helpMasterEdges = {};
	
	//slaveEdges содержит ячейки, которые зависят от данной ячейки
	this.slaveEdges = null;
	
	this.refCount = 0;
	
	this.weightNode = 0;
}
Vertex.prototype = {	
	
	constructor: Vertex,
	
	changeCellId : function(cellId){
		var lastId = this.nodeId;
		this.cellId = cellId;
		this.nodeId = this.sheetId + cCharDelimiter + cellId;
		for( var id in this.masterEdges ){
			if( lastId in this.masterEdges[id].slaveEdges ){
				this.masterEdges[id].slaveEdges[this.nodeId] = this.masterEdges[id].slaveEdges[lastId];
				this.masterEdges[id].slaveEdges[lastId] = null;
				delete this.masterEdges[id].slaveEdges[lastId];
			}
		}
		for( var id in this.slaveEdges ){
			if( lastId in this.slaveEdges[id].masterEdges ){
				this.slaveEdges[id].masterEdges[this.nodeId] = this.slaveEdges[id].masterEdges[lastId];
				this.slaveEdges[id].masterEdges[lastId] = null;
				delete this.slaveEdges[id].masterEdges[lastId];
			}
		}
	},
	
	//добавляем ведущую ячейку.
	addMasterEdge : function(node){
		if( !this.masterEdges )
			this.masterEdges = {};
		this.masterEdges[node.nodeId] = node;
		this.refCount ++;
	},

	addHelpMasterEdge : function(node){
		this.helpMasterEdges[node.nodeId] = node;
	},
	
	//добавляем зависимую(ведомую) ячейку.
	addSlaveEdge : function(node){
		if( !this.slaveEdges )
			this.slaveEdges = {};
		this.slaveEdges[node.nodeId] = node;
		this.refCount ++;
	},
	
	getMasterEdges : function(){
		return this.masterEdges;
	},

	getHelpMasterEdges : function(){
		return this.helpMasterEdges;
	},
	
	getSlaveEdges : function(){
		return this.slaveEdges;
	},

	getSlaveEdges2 : function(){
		var ret = {}, count = 0;
		for(var id in this.slaveEdges){
			ret[id] = this.slaveEdges[id];
			count++;
		}
		if ( count > 0 ) 
			return ret; 
		else
			return null;
	},
	
	//удаляем ребро между конкретной ведущей ячейки.
	deleteMasterEdge : function(node){
		this.masterEdges[node.nodeId] = null;
		delete this.masterEdges[node.nodeId];
		this.refCount--;
	},

	deleteHelpMasterEdge : function(node){
		delete this.helpMasterEdges[node.nodeId];
	},

	//удаляем ребро между конкретной зависимой(ведомой) ячейки.
	deleteSlaveEdge : function(node){
		this.slaveEdges[node.nodeId] = null;
		delete this.slaveEdges[node.nodeId];
		this.refCount--;
	},

	//очищаем все ребра по ведущим ячейкам.
	deleteAllMasterEdges : function(){
		var ret = [];
		for( var id in this.masterEdges ){
			this.masterEdges[id].deleteSlaveEdge(this);
			this.masterEdges[id] = null;
			delete this.masterEdges[id];
			this.refCount--;
			ret.push(id);
		}
		this.masterEdges = null;
		return ret;
	},
	
	//очищаем все ребра по ведомым ячейкам.
	deleteAllSlaveEdges : function(){
		var ret = [];
		for( var id in this.slaveEdges ){
			this.slaveEdges[id].deleteMasterEdge(this);
			this.slaveEdges[id] = null;
			delete this.slaveEdges[id];
			this.refCount--;
			ret.push(id);
		}
		this.slaveEdges = null;
		return ret;
	},

	returnCell : function(){
		return this.cell;
	}
	
}

function getVertexId(sheetId, cellId){
	return sheetId + cCharDelimiter + cellId;
}
function lockDraw(wb){
	wb.isNeedCacheClean = false;
	arrRecalc = {};
}
function unLockDraw(wb){
	wb.isNeedCacheClean = true;
	arrRecalc = {};
}
function helpFunction(_wb){
	var wb = _wb, dep, sr1, sr2, sr, ws, ar;

	for( var id in arrRecalc ){
		ws = wb.getWorksheetById(id);
		if (ws) {
			ar = arrRecalc[id];
			ws._BuildDependencies(ar);
		}
	}
	recalc(wb)

}
function helpMinMax(o1,o2){
	var o3 = {};
	for (var _item in o2){
		if (o1 && o1.hasOwnProperty(_item)){
			if(o1[_item].min.getRow() > o2[_item].min.getRow()) o1[_item].min = new CellAddress(o2[_item].min.getRow(),o1[_item].min.getCol());
			if(o1[_item].min.getCol() > o2[_item].min.getCol()) o1[_item].min = new CellAddress(o1[_item].min.getRow(),o2[_item].min.getCol());
				
			if(o1[_item].max.getRow() < o2[_item].max.getRow()) o1[_item].max = new CellAddress(o2[_item].max.getRow(),o1[_item].max.getCol());
			if(o1[_item].max.getCol() < o2[_item].max.getCol()) o1[_item].max = new CellAddress(o1[_item].max.getRow(),o2[_item].max.getCol());
			
			o3[_item] = o1[_item];
		}
		else{
			o3[_item] = o2[_item];
		}
	}
	for (var _item in o1){
		if (o3 && o3.hasOwnProperty(_item)){
			if(o1[_item].min.getRow() > o3[_item].min.getRow()) o1[_item].min = new CellAddress(o3[_item].min.getRow(),o1[_item].min.getCol());
			if(o1[_item].min.getCol() > o3[_item].min.getCol()) o1[_item].min = new CellAddress(o1[_item].min.getRow(),o3[_item].min.getCol());
				
			if(o1[_item].max.getRow() < o3[_item].max.getRow()) o1[_item].max = new CellAddress(o3[_item].max.getRow(),o1[_item].max.getCol());
			if(o1[_item].max.getCol() < o3[_item].max.getCol()) o1[_item].max = new CellAddress(o1[_item].max.getRow(),o3[_item].max.getCol());
			
			o3[_item] = o1[_item];
		}
		else{
			o3[_item] = o1[_item];
		}
	}
	
	return o3;
}
function helpRecalc(dep1, nR, calculatedCells, wb){
	var sr1, sr2;
	for(var i = 0; i < dep1.badF.length; i++){
		for(var j = 0; j < dep1.depF.length; j++){
			if(dep1.badF[i] == dep1.depF[j])
				dep1.depF.splice(j,1);
		}
	}
	for(var j = 0; j < dep1.depF.length; j++){
		if( dep1.depF[j].nodeId in nR){
			nR[dep1.depF[j].nodeId] = undefined;
			delete nR[dep1.depF[j].nodeId]
			nR.length--;
		}
	}
	for(var j = 0; j < dep1.badF.length; j++){
		if( dep1.badF[j].nodeId in nR){
			nR[dep1.badF[j].nodeId] = undefined;
			delete nR[dep1.badF[j].nodeId]
			nR.length--;
		}
	}
	sr1 = recalcDependency.call(wb, dep1.badF,true);
	
	for(var k = 0; k < dep1.depF.length; k++){
		if(dep1.depF[k].nodeId in calculatedCells){
			dep1.depF.splice(k,1);
			k--;
		}
	}
	sr2 = recalcDependency.call(wb, dep1.depF,false);
	
	for(var k = 0; k < dep1.depF.length; k++){
		calculatedCells[dep1.depF[k].nodeId] = dep1.depF[k].nodeId
	}
	return helpMinMax(sr1,sr2);
}
function recalcDependency(f,bad,notRecalc){
	if(f.length > 0){
	
		var max, min, sr = {}, _ws = this.getWorksheetById( f[0].sheetId );

		for(var i = 0; i < f.length; i++){
			if( f[i].cellId.indexOf(":") > -1 ) continue;
			if( !(f[i].sheetId in sr) ){
				sr[f[i].sheetId] = {max:new CellAddress(f[i].cellId),min:new CellAddress(f[i].cellId)}
			}
			
			var l = new CellAddress(f[i].cellId);
				
			if(sr[f[i].sheetId].min.getRow() > l.getRow()) sr[f[i].sheetId].min = new CellAddress(l.getRow(),sr[f[i].sheetId].min.getCol());
			if(sr[f[i].sheetId].min.getCol() > l.getCol()) sr[f[i].sheetId].min = new CellAddress(sr[f[i].sheetId].min.getRow(),l.getCol());
			
			if(sr[f[i].sheetId].max.getRow() < l.getRow()) sr[f[i].sheetId].max = new CellAddress(l.getRow(),sr[f[i].sheetId].max.getCol());
			if(sr[f[i].sheetId].max.getCol() < l.getCol()) sr[f[i].sheetId].max = new CellAddress(sr[f[i].sheetId].max.getRow(),l.getCol());

			if( !notRecalc )
				this.getWorksheetById( f[i].sheetId )._RecalculatedFunctions( f[i].cellId, bad );
		}
		
		return sr;
	}
}
function sortDependency(ws, ar){
	var wb = ws.workbook, dep, sr1, sr2, sr;
	/*
		Если необходим пересчет, то по списку пересчитываемых ячеек сортируем граф зависимостей и пересчиываем в получившемся порядке. Плохим ячейкам с цикличискими ссылками выставляем ошибку "#REF!".
	*/
	ws._BuildDependencies(ar);
	
	for(var id in ar){
		if( !wb.dependencyFormulas.nodeExist2( ws.Id, ar[id]) ) continue;
		dep = wb.dependencyFormulas.t_sort_slave( ws.Id, ar[id] );
		for(var i = 0; i < dep.badF.length; i++){
			for(var j = 0; j < dep.depF.length; j++){
				if(dep.badF[i] == dep.depF[j]){
					dep.depF.splice(j,1);
				}
			}
		}
		sr1 = recalcDependency.call(wb,dep.badF,true);
		sr2 = recalcDependency.call(wb,dep.depF,false);
		sr = helpMinMax( sr, helpMinMax( sr1, sr2 ) );
	}
	
	for(var _item in sr){
		wb.handlers.trigger("cleanCellCache",_item,new Asc.Range(0, sr[_item].min.getRow0(), wb.getWorksheetById(_item).getColsCount()-1, sr[_item].max.getRow0()), c_oAscCanChangeColWidth.numbers);
	}
}
function recalc(wb){
	
	var nR = wb.needRecalc, thas = wb, calculatedCells = {}, nRLength = nR.length, first = true, startActionOn = false, timerID, timeStart, timeEnd, timeCurrent, timeCount = 0, timeoutID1, timeoutID2, sr = {};

	function R(){
		if( nR.length > 0 ){
			timeStart = (new Date()).getTime();
			var dep1, f = false, id;
			for(var id1 in nR) {
				if( id1 == "length" ){
					continue;
				}
				id = id1;
				break;
			}
			
			if( id === undefined ) nR.length = 0;
			
			if( id in nR){
				var nRId0 = nR[id][0], nRId1 = nR[id][1], sr1,sr2,sr4;
				dep1 = thas.dependencyFormulas.t_sort_master( nRId0, nRId1 );
				sr1 = helpRecalc(dep1, nR, calculatedCells, thas);

				dep1 = thas.dependencyFormulas.t_sort_slave( nRId0, nRId1 );
				sr2 = helpRecalc(dep1, nR, calculatedCells, thas);
				
				sr = helpMinMax(sr,helpMinMax(sr1,sr2));
				if( nR[id] ){
					delete nR[id];
				nR.length--;
			}
			}
			clearTimeout(timerID);
			timeEnd = (new Date()).getTime();
			timeCount += (timeEnd - timeStart);
			if(first){
				timeoutID1 = setTimeout(
					function(){
						var pr = Math.round( (nRLength - nR.length)/nRLength*10000 )/100;
						if( pr == 0 || timeCount*100/pr > 2000 ){
							timeoutID2 = setTimeout(
								function(){
									startActionOn = true;
									thas.handlers.trigger("asc_onStartAction",c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Recalc);
								},
								0
							)
						}
					},
					500
				)
				first = false;
			}
			timerID = setTimeout(R,0);
		}
		else{
			first = false;
			thas.isNeedCacheClean = true;
			for(var _item in sr){
				thas.handlers.trigger("cleanCellCache",_item,new Asc.Range(0, sr[_item].min.getRow0(), thas.getWorksheetById(_item).getColsCount()-1, sr[_item].max.getRow0()), c_oAscCanChangeColWidth.numbers);
			}
			clearTimeout(timeoutID1);
			clearTimeout(timeoutID2);
			if( startActionOn )
				thas.handlers.trigger("asc_onEndAction",c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Recalc);
			nR.length = 0;
		}
	}
	if( nR.length > 0 ){
		R();
	}
}

//-------------------------------------------------------------------------------------------------
$(function(){
	aStandartNumFormats = new Array();
	aStandartNumFormats[0] = "General";
	aStandartNumFormats[1] = "0";
	aStandartNumFormats[2] = "0.00";
	aStandartNumFormats[3] = "#,##0";
	aStandartNumFormats[4] = "#,##0.00";
	aStandartNumFormats[9] = "0%";
	aStandartNumFormats[10] = "0.00%";
	aStandartNumFormats[11] = "0.00E+00";
	aStandartNumFormats[12] = "# ?/?";
	aStandartNumFormats[13] = "# ??/??";
	aStandartNumFormats[14] = "m/d/yyyy";
	aStandartNumFormats[15] = "d-mmm-yy";
	aStandartNumFormats[16] = "d-mmm";
	aStandartNumFormats[17] = "mmm-yy";
	aStandartNumFormats[18] = "h:mm AM/PM";
	aStandartNumFormats[19] = "h:mm:ss AM/PM";
	aStandartNumFormats[20] = "h:mm";
	aStandartNumFormats[21] = "h:mm:ss";
	aStandartNumFormats[22] = "m/d/yy h:mm";
	aStandartNumFormats[37] = "#,##0_);(#,##0)";
	aStandartNumFormats[38] = "#,##0_);[Red](#,##0)";
	aStandartNumFormats[39] = "#,##0.00_);(#,##0.00)";
	aStandartNumFormats[40] = "#,##0.00_);[Red](#,##0.00)";
	aStandartNumFormats[45] = "mm:ss";
	aStandartNumFormats[46] = "[h]:mm:ss";
	aStandartNumFormats[47] = "mm:ss.0";
	aStandartNumFormats[48] = "##0.0E+0";
	aStandartNumFormats[49] = "@";
	aStandartNumFormatsId = new Object();
	for(var i in aStandartNumFormats)
	{
		aStandartNumFormatsId[aStandartNumFormats[i]] = i - 0;
	}
});
//-------------------------------------------------------------------------------------------------
/**
 * @constructor
 */
function Workbook(sUrlPath, eventsHandlers, oApi){
	this.oApi = oApi;
	this.sUrlPath = sUrlPath;
	this.handlers = eventsHandlers;
	this.needRecalc = {length:0};
	this.dependencyFormulas = new DependencyGraph(this);
	this.nActive = 0;

	this.theme          = GenerateDefaultTheme(this);
    this.clrSchemeMap   = GenerateDefaultColorMap();
	
	this.DefinedNames = new Object();
	this.TableStyles = new CTableStyles();
	this.oStyleManager = new StyleManager(this);
	this.calcChain = new Array();
	this.aWorksheets = new Array();
	this.aWorksheetsById = new Object();
	this.cwf = {};
	this.isNeedCacheClean = true;
	this.startActionOn = false;
	this.aCollaborativeActions = new Array();
	this.bCollaborativeChanges = false;
	this.aCollaborativeChangeElements = new Array();
	
	var drawingPointer = new DrawingObjects();
	drawingPointer.initGlobalDrawingPointer();
};
Workbook.prototype.initGlobalObjects=function(){
	History = new CHistory(this);
	g_oUndoRedoCell = new UndoRedoCell(this);
	g_oUndoRedoWorksheet = new UndoRedoWoorksheet(this);
	g_oUndoRedoWorkbook = new UndoRedoWorkbook(this);
	g_oUndoRedoCol = new UndoRedoRowCol(this, false);
	g_oUndoRedoRow = new UndoRedoRowCol(this, true);
	g_oUndoRedoComment = new UndoRedoComment(this);
	g_oUndoRedoDrawingObject = new UndoRedoDrawingObject(this);
	g_oUndoRedoDrawingLayer = new UndoRedoDrawingLayer(this);
	g_oUndoRedoAutoFilters = new UndoRedoAutoFilters(this);
}
Workbook.prototype.init=function(){
	if(this.nActive < 0)
		this.nActive = 0;
	if(this.nActive >= this.aWorksheets.length)
		this.nActive = this.aWorksheets.length - 1;
	/*
		buildDependency необходимо запускать для построения графа зависимостей между ячейками.
		Сортировка графа производится при необходимости пересчета формул: 
			при открытии документа если есть ячейки помеченные как пересчитываемые или есть ячейки без значения.
	*/
	this.buildDependency();
	var nR = this.needRecalc, thas = this, timerID, calculatedCells = {}, nRLength = nR.length, timeStart, timeEnd, timeCurrent, timeCount = 0, first = true, sr, timeoutID1;

	function R(){
		while( nR.length > 0 ){
			var sr1, sr2;
			timeStart = (new Date()).getTime();
			var dep1, f = false, id;
			for(var id1 in nR) {
				if( id1 == "length" ){
					continue;
				}
				id = id1;
				break;
			}
			
			if( id in nR){
				dep1 = thas.dependencyFormulas.t_sort_master( nR[id][0], nR[id][1] );

				for(var i = 0; i < dep1.badF.length; i++){
					for(var j = 0; j < dep1.depF.length; j++){
						if(dep1.badF[i] == dep1.depF[j])
							dep1.depF.splice(j,1);
					}
				}
				for(var j = 0; j < dep1.depF.length; j++){
					if( dep1.depF[j].nodeId in nR){
						nR[dep1.depF[j].nodeId] = undefined;
						delete nR[dep1.depF[j].nodeId]
						nR.length--;
					}
				}
				for(var j = 0; j < dep1.badF.length; j++){
					if( dep1.badF[j].nodeId in nR){
						nR[dep1.badF[j].nodeId] = undefined;
						delete nR[dep1.badF[j].nodeId]
						nR.length--;
					}
				}
				sr1 = recalcDependency.call(thas, dep1.badF,true,true);
				
				for(var k = 0; k < dep1.depF.length; k++){
					if(dep1.depF[k].nodeId in calculatedCells){
						dep1.depF.splice(k,1);
						k--;
					}
				}
				sr2 = recalcDependency.call(thas, dep1.depF,false);
				
				for(var k = 0; k < dep1.depF.length; k++){
					calculatedCells[dep1.depF[k].nodeId] = dep1.depF[k].nodeId
				}
				sr = helpMinMax( sr, helpMinMax(sr1,sr2) );
			}
			
			clearTimeout(timerID);
			timeEnd = (new Date()).getTime();
			timeCount += (timeEnd - timeStart);
			if(first){
				thas.isNeedCacheClean = false;
				first = false;
				if ( thas.startActionOn ){
					thas.handlers.trigger("asc_onStartAction",c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Recalc);
					thas.startActionOn = false;
				}
				else{
					thas.startActionOn = true;
				}
			}
		}

		clearTimeout( timeoutID1 );
		first = false;
		thas.isNeedCacheClean = true;
		var ws = thas.getWorksheet(thas.getActive());
		thas.handlers.trigger("cleanCellCache", ws.getId(), new Asc.Range( 0, 0, ws.getColsCount()-1, ws.getRowsCount()-1 ), c_oAscCanChangeColWidth.numbers);
		thas.startActionOn = false;
		thas.handlers.trigger("asc_onEndAction",c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.Recalc);
	}
	
	if( nR.length > 0 ){
		R();
	}
	
	//charts
	for(var i = 0, length = this.aWorksheets.length; i < length; ++i)
	{
		var ws = this.aWorksheets[i];
		ws.initPostOpen();
	}
};
Workbook.prototype.rebuildColors=function(){
	this.TableStyles.rebuildColors(this.theme);
}
Workbook.prototype.getDefaultFont=function(){
	return g_oDefaultFont.fn;
};
Workbook.prototype.getDefaultSize=function(name){
	return g_oDefaultFont.fs;
};
Workbook.prototype.getActive=function(){
	return this.nActive;
};
Workbook.prototype.setActive=function(index){
	if(index >= 0 && index < this.aWorksheets.length){
		this.nActive = index;
		return true;
	}
	return false;
};
Workbook.prototype.getWorksheet=function(index){
	//index 0-based
	if(index >= 0 && index < this.aWorksheets.length){
		return this.aWorksheets[index];
	}
	return null;
};
Workbook.prototype.getWorksheetById=function(id){
	return this.aWorksheetsById[id];
};
Workbook.prototype.getWorksheetByName=function(name){
	for(var i = 0; i < this.aWorksheets.length; i++)
		if(this.aWorksheets[i].getName() == name){
			return this.aWorksheets[i];
		}
	return null;
};
Workbook.prototype.getWorksheetIndexByName=function(name){
	for(var i = 0; i < this.aWorksheets.length; i++)
		if(this.aWorksheets[i].getName() == name){
			return i;
		}
	return null;
};
Workbook.prototype.getWorksheetCount=function(){
	return this.aWorksheets.length;
};
Workbook.prototype.createWorksheet=function(indexBefore, sName, sId){
	History.TurnOff();
    var oNewWorksheet = new Woorksheet(this, this.aWorksheets.length, true, sId);
	if(null != sName)
	{
		if(true == this.checkValidSheetName(sName))
			oNewWorksheet.sName = sName;
	}
    oNewWorksheet.init();
	if(indexBefore >= 0 && indexBefore < this.aWorksheets.length)
		this.aWorksheets.splice(indexBefore, 0, oNewWorksheet);
	else
	{
		indexBefore = this.aWorksheets.length;
		this.aWorksheets.push(oNewWorksheet);
	}
	this.aWorksheetsById[oNewWorksheet.getId()] = oNewWorksheet;
	this._updateWorksheetIndexes();
	this.setActive(oNewWorksheet.index);
	if( indexBefore > 0 && indexBefore < this.aWorksheets.length-1 ){
		var sheetStart = this.getWorksheet(indexBefore-1).getId(),
			sheetStop  = this.getWorksheet(indexBefore+1).getId(),
			nodesSheetStart = this.dependencyFormulas.getNodeBySheetId(sheetStart),
			nodesSheetStop = this.dependencyFormulas.getNodeBySheetId(sheetStop),
			arr = {};
			
		for( var i = 0; i < nodesSheetStart.length; i++ ){
			var n = nodesSheetStart[i].getSlaveEdges();
			for( var id in n ){
				if( n[id].weightNode == 2 ){
					arr[n[id].nodeId] = n[id];
				}
				n[id].weightNode = 0;
			}
		}
		
		for( var i = 0; i < nodesSheetStop.length; i++ ){
			var n = nodesSheetStop[i].getSlaveEdges();
			for( var id in n ){
				if( n[id].weightNode == 2 ){
					arr[n[id].nodeId] = n[id];
				}
				n[id].weightNode = 0;
			}
		}
		
		for( var id in arr ){
			arr[id].cell.formulaParsed.buildDependencies();
		}
	}
	History.TurnOn();
	History.Create_NewPoint();
	History.Add(g_oUndoRedoWorkbook, historyitem_Workbook_SheetAdd, null, null, new UndoRedoData_SheetAdd(indexBefore, oNewWorksheet.getName(), null, oNewWorksheet.getId()));
	return oNewWorksheet.index;
};
Workbook.prototype.copyWorksheet=function(index, insertBefore, sName, sId){
	//insertBefore - optional
	if(index >= 0 && index < this.aWorksheets.length){
		History.TurnOff();
		var wsFrom = this.aWorksheets[index];
		var nameSheet = wsFrom.getName();
		var newSheet = wsFrom.clone(sId);
		if(null != sName)
		{
			if(true == this.checkValidSheetName(sName))
				newSheet.sName = sName;
		}
		newSheet.init();
		if(null != insertBefore && insertBefore >= 0 && insertBefore < this.aWorksheets.length){
			//помещаем новый sheet перед insertBefore
			this.aWorksheets.splice(insertBefore, 0, newSheet);
		}
		else{
			//помещаем новый sheet в конец
			this.aWorksheets.push(newSheet);
		}
		this.aWorksheetsById[newSheet.getId()] = newSheet;
		this._updateWorksheetIndexes();

		//для формул. создаем копию this.cwf[this.Id] для нового листа.
		if ( this.cwf[wsFrom.getId()] ){
			this.cwf[newSheet.getId()] = { cells:{} };
			for( var id in this.cwf[wsFrom.getId()].cells ){
				this.cwf[newSheet.getId()].cells[id] = this.cwf[wsFrom.getId()].cells[id];
			}

			//очищаем и создаем новый граф зависимостей
			this.buildDependency();
		}
		History.TurnOn();
		History.Create_NewPoint();
		History.Add(g_oUndoRedoWorkbook, historyitem_Workbook_SheetAdd, null, null, new UndoRedoData_SheetAdd(insertBefore, newSheet.getName(), wsFrom.getId(), newSheet.getId()));
	}
};
Workbook.prototype.insertWorksheet=function(index, sheet, cwf){
	if(null != index && index >= 0 && index < this.aWorksheets.length){
		//помещаем новый sheet перед insertBefore
		this.aWorksheets.splice(index, 0, sheet);
	}
	else{
		//помещаем новый sheet в конец
		this.aWorksheets.push(sheet);
	}
	this.aWorksheetsById[sheet.getId()] = sheet;
	this._updateWorksheetIndexes();
	
	//восстанавливаем список ячеек с формулами для sheet
	this.cwf[sheet.getId()] = cwf;
	//очищаем и создаем новый граф зависимостей
	this.buildDependency();
}
Workbook.prototype.replaceWorksheet=function(indexFrom, indexTo){
	if(indexFrom >= 0 && indexFrom < this.aWorksheets.length &&
		indexTo >= 0 && indexTo < this.aWorksheets.length){
		History.TurnOff();
		var oWsTo = this.aWorksheets[indexTo];
		var tempW = {
					wFN: this.aWorksheets[indexFrom].getName(),
					wFI: indexFrom,
					wFId: this.aWorksheets[indexFrom].getId(),
					wTN: oWsTo.getName(),
					wTI: indexTo,
					wTId: oWsTo.getId()
				}
				
		var movedSheet = this.aWorksheets.splice(indexFrom,1);
		this.aWorksheets.splice(indexTo,0,movedSheet[0])
		this._updateWorksheetIndexes();

		/*
			Формулы:
				перестройка графа для трехмерных формул вида Sheet1:Sheet3!A1:A3, Sheet1:Sheet3!A1.
				пересчет трехмерных формул, перестройка формул при изменении положения листа: Sheet1, Sheet2, Sheet3, Sheet4 - Sheet1:Sheet4!A1 -> Sheet4, Sheet1, Sheet2, Sheet3 - Sheet1:Sheet3!A1;
		*/
		lockDraw(this);
		var a = this.dependencyFormulas.getNodeBySheetId(movedSheet[0].getId());
		for(var i=0;i<a.length;i++){
			var se = a[i].getSlaveEdges();
			if(se){
				for(var id in se){
					var cID = se[id].cellId, _ws = this.getWorksheetById(se[id].sheetId), f = _ws.getCell2(cID).getCells()[0].sFormula;
					if( f.indexOf(tempW.wFN+":") > 0 || f.indexOf(":"+tempW.wFN) > 0 ){
						var _c = _ws.getCell2(cID).getCells()[0];
						_c.setFormula(_c.formulaParsed.moveSheet(tempW).assemble());//Перестраиваем трехмерные ссылки в формуле.
						this.dependencyFormulas.deleteMasterNodes(_ws.Id, cID);
						_ws._BuildDependencies({id:cID});
						if( !arrRecalc[_ws.getId()] ){
							arrRecalc[_ws.getId()] = {};
						}
						arrRecalc[_ws.getId()][cID] = cID;
						this.needRecalc[ getVertexId(_ws.getId(),cID) ] = [ _ws.getId(),cID ];
						if( this.needRecalc.length < 0) this.needRecalc.length = 0;
							this.needRecalc.length++;
					}
					else if( f.indexOf(_ws.getName()) < 0 ){
						this.dependencyFormulas.deleteMasterNodes(_ws.Id, cID);
						_ws._BuildDependencies({id:cID});
						if( !arrRecalc[_ws.getId()] ){
							arrRecalc[_ws.getId()] = {};
						}
						arrRecalc[_ws.getId()][cID] = cID;
						this.needRecalc[ getVertexId(_ws.getId(),cID) ] = [ _ws.getId(),cID ];
						if( this.needRecalc.length < 0) this.needRecalc.length = 0;
							this.needRecalc.length++;
					}
				}
			}
		}
		
		History.TurnOn();
		History.Create_NewPoint();
		History.Add(g_oUndoRedoWorkbook, historyitem_Workbook_SheetMove, null, null, new UndoRedoData_FromTo(indexFrom, indexTo), true);
		helpFunction(this);
		unLockDraw(this);
	}
};
Workbook.prototype.removeWorksheet=function(nIndex, outputParams){
	//проверяем останется ли хоть один нескрытый sheet
	var bEmpty = true;
	for(var i = 0, length = this.aWorksheets.length; i < length; ++i)
	{
		var worksheet = this.aWorksheets[i];
		if(false == worksheet.getHidden() && i != nIndex)
		{
			bEmpty = false;
			break;
		}
	}
	if(bEmpty)
		return -1;
	
	var nNewActive = this.nActive;
	var removedSheet = this.aWorksheets.splice(nIndex, 1);
	if(removedSheet.length > 0)
	{
		History.TurnOff();
		//по всем удаленным листам пробегаемся и удаляем из workbook.cwf (cwf - cells with forluma) элементы с названием соответствующего листа.
		var _cwf;
		for(var i=0; i<removedSheet.length;i++){
			var name = removedSheet[i];
			_cwf = this.cwf[name.getId()];
			this.cwf[name.getId()] = null;
			delete this.cwf[name.getId()];
			delete this.aWorksheetsById[name.getId()];
		}
		
		lockDraw(this);
		var a = this.dependencyFormulas.getNodeBySheetId(removedSheet[0].getId());
		for(var i=0;i<a.length;i++){
			var se = a[i].getSlaveEdges();
			if(se){
				for(var id in se){
					if( se[id].sheetId != removedSheet[0].getId() ){
						var _ws = this.getWorksheetById(se[id].sheetId), f = _ws.getCell2(se[id].cellId).getCells()[0].sFormula, cID = se[id].cellId;
						if( !arrRecalc[_ws.getId()] ){
							arrRecalc[_ws.getId()] = {};
						}
						arrRecalc[_ws.getId()][cID] = cID;
						this.needRecalc[ getVertexId(_ws.getId(),cID) ] = [ _ws.getId(),cID ];
						if( this.needRecalc.length < 0) this.needRecalc.length = 0;
							this.needRecalc.length++;
					}
				}
			}
		}
		this.dependencyFormulas.removeNodeBySheetId(name.getId());
		var bFind = false;
		if(nNewActive < this.aWorksheets.length)
		{
			for(var i = nNewActive; i < this.aWorksheets.length; ++i)
				if(false == this.aWorksheets[i].getHidden())
				{
					bFind = true;
					nNewActive = i;
					break;
				}
		}
		if(false == bFind)
		{
			for(var i = nNewActive - 1; i >= 0; --i)
				if(false == this.aWorksheets[i].getHidden())
				{
					nNewActive = i;
					break;
				}
		}
		History.TurnOn();
		History.Create_NewPoint();
		var oRemovedSheet = removedSheet[0];
		History.Add(g_oUndoRedoWorkbook, historyitem_Workbook_SheetRemove, null, null, new UndoRedoData_SheetRemove(nIndex, oRemovedSheet.getId(), oRemovedSheet, _cwf));
		if(null != outputParams)
		{
			outputParams.sheet = oRemovedSheet;
			outputParams.cwf = _cwf;
		}
		this._updateWorksheetIndexes();
		this.nActive = nNewActive;
		helpFunction(this);
		unLockDraw(this);
		return nNewActive;
	}
	return -1;
};
Workbook.prototype._updateWorksheetIndexes=function(){
	for(var i = 0, length = this.aWorksheets.length; i < length; ++i)
		this.aWorksheets[i]._setIndex(i);
};
Workbook.prototype.checkUniqueSheetName=function(name){
	var workbookSheetCount = this.getWorksheetCount();
	for (var i = 0; i < workbookSheetCount; i++){
		if (this.getWorksheet(i).getName() == name)
			return i;
	}
	return -1;
}
Workbook.prototype.checkValidSheetName=function(name){
	return name.length < g_nSheetNameMaxLength;
}
Workbook.prototype.getUniqueSheetNameFrom=function(name, bCopy){
	var nIndex = 1;
	var sNewName = "";
	var fGetPostfix = null;
	if(bCopy)
	{
		
		var result = /^(.*)\((\d)\)$/.exec(name);
		if(result)
		{
			fGetPostfix = function(nIndex){return "(" + nIndex +")";};
			name = result[1];
		}
		else
		{
			fGetPostfix = function(nIndex){return " (" + nIndex +")";};
			name = name;
		}
	}
	else
	{
		fGetPostfix = function(nIndex){return nIndex.toString();};
	}
	var workbookSheetCount = this.getWorksheetCount();
	while(nIndex < 10000)
	{
		var sPosfix = fGetPostfix(nIndex);
		sNewName = name + sPosfix;
		if(sNewName.length > g_nSheetNameMaxLength)
		{
			name = name.substring(0, g_nSheetNameMaxLength - sPosfix.length);
			sNewName = name + sPosfix;
		}
		var bUniqueName = true;
		for (var i = 0; i < workbookSheetCount; i++){
			if (this.getWorksheet(i).getName() == sNewName)
			{
				bUniqueName = false;
				break;
			}
		}
		if(bUniqueName)
			break;
		nIndex++;
	}
	return sNewName;
}
Workbook.prototype.generateFontMap=function(){
	var oFontMap = new Object();
	oFontMap["Calibri"] = 1;
	oFontMap["Arial"] = 1;

	if(null != g_oDefaultFont.fn)
		oFontMap[g_oDefaultFont.fn] = 1;
	
	for(var i = 0, length = this.aWorksheets.length; i < length; ++i)
		this.aWorksheets[i].generateFontMap(oFontMap);
	
	var aRes = new Array();
	for(var i in oFontMap)
		aRes.push(i);
	return aRes;
};
Workbook.prototype.recalc = function(is3D){
	var dep1, thas = this, sr, sr1, sr2;
	if( this.dependencyFormulas.getNodesLength() > 0){
		if(is3D){
			for(var i=0; i<this.getWorksheetCount();i++){
				__ws = this.getWorksheet(i);
				for(var id in this.cwf[__ws.Id].cells){
					var c = new CellAddress(id);
					if( __ws._getCellNoEmpty(c.getRow0(),c.getCol0()).formulaParsed.is3D ){
						dep1 = this.dependencyFormulas.t_sort_slave( __ws.Id, id );
						sr1 = recalcDependency.call(thas,dep1.badF,true);
						sr2 = recalcDependency.call(thas,dep1.depF,false);
						sr = helpMinMax( sr, helpMinMax( sr1, sr2 ) );
					}
				}
			}
		}
		else{
			dep = this.dependencyFormulas.t_sort();
			sr1 = recalcDependency.call(thas,dep.badF,true);
			sr2 = recalcDependency.call(thas,dep.depF,false);
			sr = helpMinMax( sr, helpMinMax( sr1, sr2 ) );
		}
		for(var _item in sr){
			this.handlers.trigger("cleanCellCache",_item,new Asc.Range(0, sr[_item].min.getRow0(),  this.getWorksheetById(_item).getColsCount()-1, sr[_item].max.getRow0()), c_oAscCanChangeColWidth.numbers);
		}
	}
}
Workbook.prototype.isDefinedNamesExists = function(name, sheetId){
	if(null != sheetId)
	{
		var ws = this.getWorksheetById(sheetId);
		if(null != ws)
		{
			var bExist = false;
			if( ws.DefinedNames )
				bExist = !!ws.DefinedNames[name];
			if(bExist)
				return bExist;
		}
	}
	if( this.DefinedNames ){
		return !!this.DefinedNames[name];
	}
	return false;
}
Workbook.prototype.getDefinesNames = function(name, sheetId){
	if(null != sheetId)
	{
		var ws = this.getWorksheetById(sheetId);
		if(null != ws)
		{
			if( ws.DefinedNames )
			{
				var oDefName = ws.DefinedNames[name];
				if(null != oDefName)
					return oDefName;
			}
		}
	}
	if( this.DefinedNames ){
		var oDefName = this.DefinedNames[name];
		if(null != oDefName)
			return oDefName;
	}
	return false;
}
Workbook.prototype.buildDependency = function(){
	dep = null;
	this.dependencyFormulas.clear();
	this.dependencyFormulas = null;
	this.dependencyFormulas = new DependencyGraph(this);
	for(var i in this.cwf){
		this.getWorksheetById(i)._BuildDependencies(this.cwf[i].cells);
	}
}
Workbook.prototype.SerializeHistory = function(){
	var aRes = new Array();
	//соединяем изменения, которые были до приема данных с теми, что получились после.
	var aActions = this.aCollaborativeActions.concat(History.GetSerializeArray());
	if(aActions.length > 0)
	{
		var oMemory = new CMemory();
		var oThis = this;
		//создаем еще один элемент в undo/redo - взаимное расположение Sheet, чтобы не запутываться в add, move событиях
		var oSheetPlaceData = new Array();
		for(var i = 0, length = this.aWorksheets.length; i < length; ++i)
			oSheetPlaceData.push(this.aWorksheets[i].getId());
		aActions.push(new UndoRedoItemSerializable(g_oUndoRedoWorkbook, historyitem_Workbook_SheetPositions, null, null, new UndoRedoData_SheetPositions(oSheetPlaceData)));
		for(var i = 0, length = aActions.length; i < length; ++i)
		{
			var nPosStart = oMemory.GetCurPosition();
			var item = aActions[i];
			item.Serialize(oMemory, this.oApi.collaborativeEditing);
			var nPosEnd = oMemory.GetCurPosition();
			var nLen = nPosEnd - nPosStart;
			if(nLen > 0)
				aRes.push(nLen + ";" + oMemory.GetBase64Memory2(nPosStart, nLen));
		}
		//добавляем элемент, который содержит все используемые шрифты, чтобы их можно было загрузить в начале
		aRes.push("0;fontmap" + this.generateFontMap().join(","));
		this.aCollaborativeActions = new Array();
	}
	return aRes;
}
Workbook.prototype.DeserializeHistory = function(aChanges, fCallback){
	var bRes = false;
	var oThis = this;
	//сохраняем те изменения, которые были до приема данных, потому что дальше undo/redo будет очищено
	this.aCollaborativeActions = this.aCollaborativeActions.concat(History.GetSerializeArray());
	if(aChanges.length > 0)
	{
		this.bCollaborativeChanges = true;
		History.Clear();
		History.Create_NewPoint();
		History.SetSelection(null, true);
		//собираем общую длину
		var dstLen = 0;
		var aIndexes = new Array();
		for(var i = 0, length = aChanges.length;i < length; ++i)
		{
			var sChange = aChanges[i];
			var nIndex = sChange.indexOf(";");
			if(-1 != nIndex)
			{
				dstLen += parseInt(sChange.substring(0, nIndex));
				nIndex++;
			}
			aIndexes.push(nIndex);
		}
		var pointer = g_memory.Alloc(dstLen);
		var stream = new FT_Stream2(pointer.data, dstLen);
		stream.obj = pointer.obj;
		var nCurOffset = 0;
		//пробегаемся первый раз чтобы заполнить oFontMap
		var oFontMap = new Object();//собираем все шрифтры со всех изменений
		var sFontMapString = "0;fontmap";
		for(var i = 0, length = aChanges.length; i < length; ++i)
		{
			var sChange = aChanges[i];
			if(sFontMapString == sChange.substring(0, sFontMapString.length))
			{
				var sFonts = sChange.substring(sFontMapString.length);
				var aFonts = sFonts.split(",");
				for(var j = 0, length2 = aFonts.length; j < length2; ++j)
					oFontMap[aFonts[j]] = 1;
			}
		}
		var aFontMap = new Array();
		for(var i in oFontMap)
			aFontMap.push(i);
		
		window["Asc"]["editor"]._loadFonts(aFontMap, function(){
				var oHistoryPositions = null;//нужен самый последний historyitem_Workbook_SheetPositions
				var bIsOn = History.RedoPrepare();
				var aStartTriggerAction = new Object();
				for(var i = 0, length = aChanges.length; i < length; ++i)
				{
					var sChange = aChanges[i];
					if(sFontMapString != sChange.substring(0, sFontMapString.length))
					{
						var oBinaryFileReader = new BinaryFileReader();
						nCurOffset = oBinaryFileReader.getbase64DecodedData2(sChange, aIndexes[i], stream, nCurOffset);
						var item = new UndoRedoItemSerializable();
						item.Deserialize(stream);
						if(null != item.oClass && null != item.nActionType)
						{
							if(g_oUndoRedoWorkbook == item.oClass && historyitem_Workbook_SheetPositions == item.nActionType)
								oHistoryPositions = item;
							else
								History.RedoAdd(aStartTriggerAction, item.oClass, item.nActionType, item.nSheetId, item.oRange, item.oData);
						}
					}
				}
				if(null != oHistoryPositions)
					History.RedoAdd(aStartTriggerAction, oHistoryPositions.oClass, oHistoryPositions.nActionType, oHistoryPositions.nSheetId, oHistoryPositions.oRange, oHistoryPositions.oData);
			
				History.RedoEnd(null, bIsOn, aStartTriggerAction);
				this.bCollaborativeChanges = false;
				History.Clear();
				if(null != fCallback)
					fCallback();
			});
	}
}
//-------------------------------------------------------------------------------------------------
/**
 * @constructor
 */
function Woorksheet(wb, _index, bAddUserId, sId){
	this.workbook = wb;
	this.DefinedNames = new Object();
	this.sName = this.workbook.getUniqueSheetNameFrom(g_sNewSheetNamePattern, false);
	this.bHidden = false;
	this.dDefaultwidth = null;
	this.dDefaultheight = null;
	this.index = _index;
	this.Id = null;
	if(null != sId)
		this.Id = sId;
	else
	{
		if(bAddUserId)
			this.Id = this.workbook.oApi.User.asc_getId() + "_" + g_nNextWorksheetId++;
		else
			this.Id = g_nNextWorksheetId++;
	}

	this.nRowsCount = 0;
	this.nColsCount = 0;
	this.aGCells = new Object();// 0 based
	this.aCols = new Array();// 0 based
	this.oAllCol = null;
	this.objForRebuldFormula = {};
	this.aComments = new Array();
	this.aCommentsCoords = new Array();
	
	this.nActionNested = 0;
	this.bUpdateHyperlinks = false;
	
	this.nMaxRowId = 1;
	this.nMaxColId = 1;
};
Woorksheet.prototype.generateFontMap=function(oFontMap){
	//пробегаемся по колонкам
	for(var i in this.aCols)
	{
		var col = this.aCols[i];
		if(null != col && null != col.xfs && null != col.xfs.font && null != col.xfs.font.fn)
			oFontMap[col.xfs.font.fn] = 1;
	}
	if(null != this.oAllCol && null != this.oAllCol.xfs && null != this.oAllCol.xfs.font && null != this.oAllCol.xfs.font.fn)
		oFontMap[col.xfs.font.fn] = 1;
	//пробегаемся строкам
	for(var i in this.aGCells)
	{
		var row = this.aGCells[i];
		if(null != row && null != row.xfs && null != row.xfs.font && null != row.xfs.font.fn)
			oFontMap[row.xfs.font.fn] = 1;
		//пробегаемся по ячейкам
		for(var j in row.c)
		{
			var cell = row.c[j];
			if(null != cell)
			{
				if(null != cell.xfs && null != cell.xfs.font && null != cell.xfs.font.fn)
					oFontMap[cell.xfs.font.fn] = 1;
				//смотрим в комплексных строках
				if(null != cell.oValue && null != cell.oValue.multiText)
				{
					for(var k = 0, length3 = cell.oValue.multiText.length; k < length3; ++k)
					{
						var part = cell.oValue.multiText[k];
						if(null != part.format && null != part.format.fn)
							oFontMap[part.format.fn] = 1;
					}
				}
			}
		}
	}
}
Woorksheet.prototype.clone=function(sNewId){
	var oNewWs;
	if(null != sNewId)
		oNewWs = new Woorksheet(this.workbook, this.workbook.aWorksheets.length, true, sNewId);
	else
		oNewWs = new Woorksheet(this.workbook, this.workbook.aWorksheets.length, true);
	oNewWs.sName = this.workbook.getUniqueSheetNameFrom(this.sName, true);
	oNewWs.bHidden = this.bHidden;
	oNewWs.dDefaultwidth = this.dDefaultwidth;
	oNewWs.dDefaultheight = this.dDefaultheight;
	oNewWs.index = this.index;
	oNewWs.nRowsCount = this.nRowsCount;
	oNewWs.nColsCount = this.nColsCount;
	if(this.TableParts)
		oNewWs.TableParts = Asc.clone(this.TableParts);
	if(this.AutoFilter)
		oNewWs.AutoFilter = Asc.clone(this.AutoFilter);
	for(var i in this.aCols)
		oNewWs.aCols[i] = this.aCols[i].clone();
	if(null != this.oAllCol)
		oNewWs.oAllCol = this.oAllCol.clone();
	for(var i in this.aGCells)
		oNewWs.aGCells[i] = this.aGCells[i].clone();
	if(null != this.Drawings)
		oNewWs.Drawings = this.Drawings.concat();
	if(null != this.aComments) {
		for (var i = 0; i < this.aComments.length; i++) {
			var comment = new asc_CCommentData(this.aComments[i]);
			comment.wsId = oNewWs.getId();
			comment.setId();
			oNewWs.aComments.push(comment);
		}
	}		
	return oNewWs;
};
Woorksheet.prototype.init=function(){
	this.workbook.cwf[this.Id]={ cells:{} };
	var formulaShared = {};
	for(var rowid in this.aGCells)
	{
		var row = this.aGCells[rowid];
		for(var cellid in row.c)
		{
			var oCell = row.c[cellid];
			var sCellId = oCell.oId.getID();
			/*
				Проверяем содержит ли ячейка атрибуты f.t и f.si, если содержит, то у указанного диапазона, атрибут f.ref, достраиваем формулы.
			*/
			if(null != oCell.oFormulaExt)
			{
				if( oCell.oFormulaExt.t == ECellFormulaType.cellformulatypeShared ){
					if(null != oCell.oFormulaExt.si){
						if(null != oCell.oFormulaExt.ref){
							formulaShared[oCell.oFormulaExt.si] = 	{
																		fVal:new parserFormula(oCell.oFormulaExt.v,"",this),
																		fRef:function(t){
																				var r = t.getRange2(oCell.oFormulaExt.ref);
																				return {
																							c:r,
																							first:r.first
																						};
																			}(this)
																	}
								formulaShared[oCell.oFormulaExt.si].fVal.parse();
						}
						else{
							if( formulaShared[oCell.oFormulaExt.si] ){
								var fr = formulaShared[oCell.oFormulaExt.si].fRef;
								if( fr.c.containCell(oCell.oId) ){
									if( formulaShared[oCell.oFormulaExt.si].fVal.isParsed ){
										var off = oCell.getOffset3(fr.first);
										formulaShared[oCell.oFormulaExt.si].fVal.changeOffset(off);
										oCell.oFormulaExt.v = formulaShared[oCell.oFormulaExt.si].fVal.assemble();
										off.offsetCol *=-1;
										off.offsetRow *=-1;
										formulaShared[oCell.oFormulaExt.si].fVal.changeOffset(off);
									}
									this.workbook.cwf[this.Id].cells[sCellId] = sCellId;
								}
							}
						}
					}
				}
				if(oCell.oFormulaExt.v)
					oCell.setFormula(oCell.oFormulaExt.v);
					
				if(oCell.oFormulaExt.ca)
					oCell.sFormulaCA = true;
				
				/*
					Если ячейка содержит в себе формулу, то добавляем ее в список ячеек с формулами.
				*/
				if(oCell.sFormula){
					this.workbook.cwf[this.Id].cells[sCellId] = sCellId;
				}
				/*
					Строится список ячеек, которые необходимо пересчитать при открытии. Это ячейки имеющие атрибут f.ca или значение в которых неопределено.
				*/
				if(oCell.sFormula && (oCell.oFormulaExt.ca || !oCell.oValue.getValueWithoutFormat()) ){
					this.workbook.needRecalc[ getVertexId( this.Id, sCellId ) ] = [this.Id, sCellId];
					this.workbook.needRecalc.length++;
				}
				//в редакторе не работаем с расширенными формулами
				delete oCell.oFormulaExt;
			}
		}
	}
};
Woorksheet.prototype.initPostOpen = function(){
	//chart
	if(null != this.Drawings)
	{
		var oThis = this;
		var fParseRef = function(sRef)
		{
			var result = null;
			var oRefParsed = parserHelp.parse3DRef(sRef);
			if (null !== oRefParsed) {
				// Получаем sheet по имени
				ws = oThis.workbook.getWorksheetByName (oRefParsed.sheet);
				if (ws)
				{
					var range = ws.getRange2(oRefParsed.range);
					if (null !== range)
					{
						var oBBox = range.getBBox0();
						result = {sheet: ws, range: new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2), bbox: oBBox};
					}
				}
			}
			return result;
		}
		var fAddBounds = function(oBounds, oNewBounds ,chart)
		{
			if(null == oBounds)
			{
				chart.range.rows = false;
				chart.range.columns = false;
				if(oNewBounds.bbox.c2 - oNewBounds.bbox.c1 > oNewBounds.bbox.r2 - oNewBounds.bbox.r1)
					chart.range.rows = true;
				else
					chart.range.columns = true;
				oBounds = oNewBounds.range;
			}
			else
				oBounds = oBounds.union(oNewBounds.range);
			return oBounds;
		}
		for(var i = this.Drawings.length - 1; i >= 0; --i)
		{
			var obj = this.Drawings[i];
			if(obj.isChart())
			{
				var chart = obj.chart;
				//анализируем series
				var oBounds = null;
				var ws = null;
				for(var j = 0; j < chart.seriesOpen.length; ++j)
				{
					var seria = chart.seriesOpen[j];
					if(0 == j && null != seria && null != seria.xVal && null != seria.xVal.Formula)
					{
						var sRef = seria.xVal.Formula.replace(/\$/g,"");
						var oNewBounds = fParseRef(sRef);
						if(null != oNewBounds)
						{
							if(null == oBounds)
								ws = oNewBounds.sheet;
							oBounds = fAddBounds(oBounds, oNewBounds, chart);
						}
					}
					if(null != seria && null != seria.Val && null != seria.Val.Formula)
					{
						var sRef = seria.Val.Formula.replace(/\$/g,"");
						var oNewBounds = fParseRef(sRef);
						if(null != oNewBounds)
						{
							if(null == oBounds)
								ws = oNewBounds.sheet;
							oBounds = fAddBounds(oBounds, oNewBounds, chart);
						}
					}
				}
				if(null != oBounds)
				{
					chart.range.intervalObject = ws.getRange(new CellAddress(oBounds.r1, oBounds.c1, 0), new CellAddress(oBounds.r2, oBounds.c2, 0));
					if(null != chart.range.intervalObject)
						chart.range.interval = chart.range.intervalObject.getName();
				}
				else
					this.Drawings.splice(i, 1);
			}
		}
	}
	if (!this.PagePrintOptions) {
		// Даже если не было, создадим
		this.PagePrintOptions = new Asc.asc_CPageOptions();
	}
	if(null != this.PagePrintOptions)
	{
		var oPageMargins = this.PagePrintOptions.asc_getPageMargins();
		if(null == oPageMargins)
		{
			oPageMargins = new Asc.asc_CPageMargins ();
			this.PagePrintOptions.asc_setPageMargins(oPageMargins);
		}
		if(null == oPageMargins.asc_getLeft())
			oPageMargins.asc_setLeft(c_oAscPrintDefaultSettings.PageLeftField);
		if(null == oPageMargins.asc_getTop())
			oPageMargins.asc_setTop(c_oAscPrintDefaultSettings.PageTopField);
		if(null == oPageMargins.asc_getRight())
			oPageMargins.asc_setRight(c_oAscPrintDefaultSettings.PageRightField);
		if(null == oPageMargins.asc_getBottom())
			oPageMargins.asc_setBottom(c_oAscPrintDefaultSettings.PageBottomField);
		
		var oPageSetup = this.PagePrintOptions.asc_getPageSetup();
		if(null == oPageSetup)
		{
			oPageSetup = new Asc.asc_CPageSetup ();
			this.PagePrintOptions.asc_setPageSetup(oPageSetup);
		}
		if(null == oPageSetup.asc_getOrientation())
			oPageSetup.asc_setOrientation(c_oAscPrintDefaultSettings.PageOrientation);
		if(null == oPageSetup.asc_getWidth())
			oPageSetup.asc_setWidth(c_oAscPrintDefaultSettings.PageWidth);
		if(null == oPageSetup.asc_getHeight())
			oPageSetup.asc_setHeight(c_oAscPrintDefaultSettings.PageHeight);
		
		if(null == this.PagePrintOptions.asc_getGridLines())
			this.PagePrintOptions.asc_setGridLines(c_oAscPrintDefaultSettings.PageGridLines);
		if(null == this.PagePrintOptions.asc_getHeadings())
			this.PagePrintOptions.asc_setHeadings(c_oAscPrintDefaultSettings.PageHeadings);
	}
};
Woorksheet.prototype.onStartTriggerAction=function(){
	//начало действия, в конце которого могуть быть вызваны trigger(пока только hyperlink)
	if(0 == this.nActionNested)
		this.bUpdateHyperlinks = false;
	this.nActionNested++;
};
Woorksheet.prototype.onEndTriggerAction=function(){
	if(this.nActionNested > 0)
		this.nActionNested--;
	if(0 == this.nActionNested)
	{
		if(true == this.bUpdateHyperlinks)
			this.workbook.handlers.trigger("updateHyperlinksCache", this.Id);
		this.bUpdateHyperlinks = false;
	}
};
Woorksheet.prototype.addActionHyperlink=function(bVal){
	this.bUpdateHyperlinks = bVal;
}
Woorksheet.prototype._forEachCell=function(fAction){
	for(var rowInd in this.aGCells){
		var row = this.aGCells[rowInd];
		if(row){
			for(var cellInd in row.c){
				var cell = row.c[cellInd];
				if(cell){
					fAction(cell);
				}
			}
		}
	}
};
Woorksheet.prototype.getNextRowId=function(){
	return this.nMaxRowId++;
};
Woorksheet.prototype.getNextColId=function(){
	return this.nMaxColId++;
};
Woorksheet.prototype.getId=function(){
	return this.Id;
};
Woorksheet.prototype.getIndex=function(){
	return this.index;
};
Woorksheet.prototype.getName=function(){
	return this.sName !== undefined && this.sName.length > 0 ? this.sName : "";
};
Woorksheet.prototype.setName=function(name){
	if(name.length <= g_nSheetNameMaxLength)
	{
		var lastName = this.sName;
			this.sName = name;
		History.Create_NewPoint();
		History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_Rename, this.getId(), null, new UndoRedoData_FromTo(lastName, name));

		dep = null;
		//перестраиваем формулы, если у них были ссылки на лист со старым именем.
		for(var id in this.workbook.cwf) {
			this.workbook.getWorksheetById(id)._ReBuildFormulas(this.workbook.cwf[id].cells,lastName,this.sName);
			
		if ( this.Drawings ) {
			for (var i = 0; i < this.Drawings.length; i++) {
				var obj = this.Drawings[i];
				if ( obj.isChart && obj.isChart() ) {
						var _lastName =  !rx_test_ws_name.test(lastName) ? "'" + lastName + "'" : lastName;
						if ( obj.chart.range.interval.indexOf(_lastName + "!") >= 0 ) {
							obj.chart.range.interval = obj.chart.range.interval.replace(_lastName, !rx_test_ws_name.test(this.sName) ? "'" + this.sName + "'" : this.sName);
						obj.chart.range.intervalToIntervalObject();
						obj.chart.buildSeries();
					}
				}
			}
		}
	}
	}
};
Woorksheet.prototype.renameWsToCollaborate=function(name){
	var lastname = this.getName();
	//из-за особенностей реализации формул, сначала делаем parse со старым именем, потом преименовываем, потом assemble
	var aFormulas = new Array();
	//переименование для отправки изменений
	for(var i = 0, length = this.workbook.aCollaborativeActions.length; i < length; ++i)
	{
		var action = this.workbook.aCollaborativeActions[i];
		if(g_oUndoRedoWorkbook == action.oClass)
		{
			if(historyitem_Workbook_SheetAdd == action.nActionType)
			{
				if(lastname == action.oData.name)
					action.oData.name = name;
			}
		}
		else if(g_oUndoRedoWorksheet == action.oClass)
		{
			if(historyitem_Worksheet_Rename == action.nActionType)
			{
				if(lastname == action.oData.to)
					action.oData.to = name;
			}
		}
		else if(g_oUndoRedoCell == action.oClass)
		{
			if(action.oData instanceof UndoRedoData_CellSimpleData)
			{
				if(action.oData.oNewVal instanceof UndoRedoData_CellValueData)
				{
					var oNewVal = action.oData.oNewVal;
					if(null != oNewVal.formula && -1 != oNewVal.formula.indexOf(lastname))
					{
						var oParser = new parserFormula(oNewVal.formula,"A1",this);
						oParser.parse();
						aFormulas.push({formula: oParser, value: oNewVal});
						
					}
				}
			}
		}
	}
	//переименование для локальной версии
	this.setName(name);
	for(var i = 0, length = aFormulas.length; i < length; ++i)
	{
		var item = aFormulas[i];
		item.value.formula = item.formula.assemble();
	}
};
Woorksheet.prototype.getHidden=function(){
	if(null != this.bHidden)
		return false != this.bHidden;
	return false;
};
Woorksheet.prototype.setHidden=function(hidden){
	if(this.bHidden != hidden)
	{
		History.Create_NewPoint();
		History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_Hide, this.getId(), null, new UndoRedoData_FromTo(this.bHidden, hidden));
	}
	this.bHidden = hidden;
	if(true == this.bHidden && this.getIndex() == this.workbook.getActive())
	{
		//выбираем новый активный
		var activeWorksheet = this.getIndex();
		var countWorksheets = this.workbook.getWorksheetCount()
		for (var i = activeWorksheet + 1; i < countWorksheets; ++i) {
			var ws = this.workbook.getWorksheet(i);
			if (false === ws.getHidden())
			{
				this.workbook.setActive(i);
				return;
			}
		}
		// Не нашли справа, ищем слева от текущего
		for (var i = activeWorksheet - 1; i >= 0; --i) {
			var ws = this.workbook.getWorksheet(i);
			if (false === ws.getHidden())
			{
				this.workbook.setActive(i);
				return;
			}
		}
	}
};
Woorksheet.prototype.getRowsCount=function(){
	return this.nRowsCount;
};
Woorksheet.prototype.removeRows=function(start, stop){
	var oRange = this.getRange(new CellAddress(start, 0, 0), new CellAddress(stop, gc_nMaxCol0, 0));
	oRange.deleteCellsShiftUp();
}
Woorksheet.prototype._removeRows=function(start, stop){
	lockDraw(this.workbook);
	History.Create_NewPoint();
	History.SetSelection(null, true);
	//start, stop 0 based
	var nDif = -(stop - start + 1);
	var aIndexes = new Array();
	for(var i in this.aGCells)
	{
		var nIndex = i - 0;
		if(nIndex >= start)
			aIndexes.push(nIndex);
	}
	//По возрастанию
	aIndexes.sort(fSortAscending);
	for(var i = 0, length = aIndexes.length; i < length; ++i)
	{
		var nIndex = aIndexes[i];
		var row = this.aGCells[nIndex];
		if(nIndex > stop)
		{
			if(false == row.isEmpty())
			{
				var oTargetRow = this._getRow(nIndex + nDif);
				oTargetRow.copyProperty(row);
			}
			for(var j in row.c)
				this._moveCellVer(nIndex, j - 0, nDif);	
		}
		else
		{
			for(var j in row.c)
			{
				var nColIndex = j - 0;
				//удаляем ячейку
				this._removeCell(nIndex, nColIndex);
			}
            delete this.aGCells[nIndex];
		}
	}
	var oActualRange = {r1: start, c1: 0, r2: stop, c2: gc_nMaxCol0};
	var res = this.renameDependencyNodes( {offsetRow:nDif,offsetCol:0}, oActualRange );
	helpFunction(this.workbook);
	unLockDraw(this.workbook);
		
	for(var id  in res)
		History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveCell, this.getId(), new Asc.Range(0, res[id].nRow, gc_nMaxCol0, res[id].nRow), new UndoRedoData_CellSimpleData(res[id].nRow, res[id].nCol, res[id].data, null));
		
	History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveRows, this.getId(), new Asc.Range(0, start, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_FromToRowCol(true, start, stop));
	return true;
};
Woorksheet.prototype.insertRowsBefore=function(index, count){
	var oRange = this.getRange(new CellAddress(index, 0, 0), new CellAddress(index + count - 1, gc_nMaxCol0, 0));
	oRange.addCellsShiftBottom();
}
Woorksheet.prototype._insertRowsBefore=function(index, count){
	lockDraw(this.workbook);
	var oActualRange = {r1: index, c1: 0, r2: index + count - 1, c2: gc_nMaxCol0};
	History.Create_NewPoint();
	History.SetSelection(null, true);
	History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_AddRows, this.getId(), new Asc.Range(0, index, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_FromToRowCol(true, index, index + count - 1));
	History.TurnOff();
	//index 0 based
	var aIndexes = new Array();
	for(var i in this.aGCells)
	{
		var nIndex = i - 0;
		if(nIndex >= index)
			aIndexes.push(nIndex);
	}
    var oPrevRow = null;
    if(index > 0)
        oPrevRow = this.aGCells[index - 1];
	//По убыванию
	aIndexes.sort(fSortDescending);
	for(var i = 0, length = aIndexes.length; i < length; ++i)
	{
		var nIndex = aIndexes[i];
		var row = this.aGCells[nIndex];
		if(false == row.isEmpty())
		{
			var oTargetRow = this._getRow(nIndex + count - 1);
			oTargetRow.copyProperty(row);
		}
		for(var j in row.c)
			this._moveCellVer(nIndex, j - 0, count);
        delete this.aGCells[nIndex];
	}
    if(null != oPrevRow)
    {
        for(var i = 0; i < count; ++i)
        {
            var row = this._getRow(index + i);
            row.copyProperty(oPrevRow);
        }
    }
	var res = this.renameDependencyNodes({offsetRow:count,offsetCol:0},oActualRange);
	helpFunction(this.workbook);
	unLockDraw(this.workbook);
	
	this.nRowsCount += count;
	
	for(var id  in res)
		History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveCell, this.getId(), new Asc.Range(0, res[id].nRow, gc_nMaxCol0, res[id].nRow), new UndoRedoData_CellSimpleData(res[id].nRow, res[id].nCol, res[id].data, null));
		
	History.TurnOn();
	return true;
};
Woorksheet.prototype.insertRowsAfter=function(index, count){
	//index 0 based
	return this.insertRowsBefore(index + 1, count);
};
Woorksheet.prototype.getColsCount=function(){
	return this.nColsCount;
};
Woorksheet.prototype.removeCols=function(start, stop){
	var oRange = this.getRange(new CellAddress(0, start, 0), new CellAddress(gc_nMaxRow0, stop, 0));
	oRange.deleteCellsShiftLeft();
}
Woorksheet.prototype._removeCols=function(start, stop){
	lockDraw(this.workbook);
	History.Create_NewPoint();
	History.SetSelection(null, true);
	//start, stop 0 based
	var nDif = -(stop - start + 1);
	for(var i in this.aGCells)
	{
		var nRowIndex = i - 0;
		var row = this.aGCells[i];
		var aIndexes = new Array();
		for(var j in row.c)
		{
			var nIndex = j - 0;
			if(nIndex >= start)
				aIndexes.push(nIndex);
		}
		//сортируем по возрастанию
		aIndexes.sort(fSortAscending);
		for(var j = 0, length = aIndexes.length; j < length; ++j)
		{
			var nIndex = aIndexes[j];
			if(nIndex > stop)
			{
				this._moveCellHor(nRowIndex, nIndex, nDif, {r1: 0, c1: start, r2: gc_nMaxRow0, c2: stop});
			}
			else
			{
				//удаляем ячейку
				this._removeCell(nRowIndex, nIndex);
			}
		}
	}
	var oActualRange = {r1: 0, c1: start, r2: gc_nMaxRow0, c2: stop};
	var res = this.renameDependencyNodes( {offsetRow:0,offsetCol:nDif}, oActualRange );
	helpFunction(this.workbook);
	unLockDraw(this.workbook);
	
	this.aCols.splice(start, stop - start + 1);
	
	for(var id  in res)
		History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveCell, this.getId(), new Asc.Range(0, res[id].nRow, gc_nMaxCol0, res[id].nRow), new UndoRedoData_CellSimpleData(res[id].nRow, res[id].nCol, res[id].data, null));
		
	History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveCols, this.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_FromToRowCol(false, start, stop));
	return true;
};
Woorksheet.prototype.insertColsBefore=function(index, count){
	var oRange = this.getRange(new CellAddress(0, index, 0), new CellAddress(gc_nMaxRow0, index + count - 1, 0));
	oRange.addCellsShiftRight();
};
Woorksheet.prototype._insertColsBefore=function(index, count){
	lockDraw(this.workbook);
	var oActualRange = {r1: 0, c1: index, r2: gc_nMaxRow0, c2: index + count - 1};
	History.Create_NewPoint();
	History.SetSelection(null, true);
	History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_AddCols, this.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_FromToRowCol(false, index, index + count - 1));
	History.TurnOff();
	//index 0 based
	for(var i in this.aGCells)
	{
		var nRowIndex = i - 0;
		var row = this.aGCells[i];
		var aIndexes = new Array();
		for(var j in row.c)
		{
			var nIndex = j - 0;
			if(nIndex >= index)
				aIndexes.push(nIndex);
		}
		//сортируем по убыванию
		aIndexes.sort(fSortDescending);
		for(var j = 0, length2 = aIndexes.length; j < length2; ++j)
		{
			var nIndex = aIndexes[j];
			this._moveCellHor(nRowIndex, nIndex, count, oActualRange);
		}
	}
	
	var res = this.renameDependencyNodes({offsetRow:0,offsetCol:count},oActualRange);
	helpFunction(this.workbook);
	unLockDraw(this.workbook);
	
    var oPrevCol = null;
    if(index > 0)
        oPrevCol = this.aCols[index - 1];
	if(null != this.oAllCol)
		oPrevCol = this.oAllCol;
	for(var i = 0; i < count; ++i)
    {
        var oNewCol = null;
        if(null != oPrevCol)
        {
           oNewCol = oPrevCol.clone();
           oNewCol.BestFit = null;
           oNewCol.index = index + i; 
        }
		this.aCols.splice(index, 0, oNewCol);
    }
	this.nColsCount += count;
	
	for(var id  in res)
		History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveCell, this.getId(), new Asc.Range(0, res[id].nRow, gc_nMaxCol0, res[id].nRow), new UndoRedoData_CellSimpleData(res[id].nRow, res[id].nCol, res[id].data, null));
	
	History.TurnOn();
	return true;
};
Woorksheet.prototype.insertColsAfter=function(index, count){
	//index 0 based
	return this.insertColsBefore(index + 1, count);
};
Woorksheet.prototype.getDefaultWidth=function(){
	return this.dDefaultwidth;
};
Woorksheet.prototype.getColWidth=function(index){
	//index 0 based
	//Результат в пунктах
	var col = this._getColNoEmptyWithAll(index);
	if(null != col && null != col.width)
		return col.width;
	var dResult = this.dDefaultwidth;
	if(dResult === undefined || dResult === null || dResult == 0)
		//dResult = (8) + 5;//(EMCA-376.page 1857.)defaultColWidth = baseColumnWidth + {margin padding (2 pixels on each side, totalling 4 pixels)} + {gridline (1pixel)}
		dResult = -1; // calc default width at presentation level
	return dResult;
};
Woorksheet.prototype.setColWidth=function(width, start, stop){
	if(0 == width)
		return this.setColHidden(true, start, stop);
	//start, stop 0 based
	if(null == start)
		return;
	if(null == stop)
		stop = start;
	History.Create_NewPoint();
	History.SetSelection(null, true);
	var oThis = this;
	var fProcessCol = function(col){
		if(col.width != width)
		{
			var oOldProps = col.getWidthProp();
			col.width = width;
			col.CustomWidth = true;
			col.BestFit = null;
			col.hd = null;
			var oNewProps = col.getWidthProp();
			if(false == oOldProps.isEqual(oNewProps))
			{
				History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ColProp, oThis.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(col.index, false, oOldProps, oNewProps));
				History.AddTrigger(["changeWorksheetUpdate", oThis.getId()]);
			}
		}
	};
	if(0 == start && gc_nMaxCol0 == stop)
	{
		var col = this.getAllCol();
		fProcessCol(col);
	}
	else
	{
		for(var i = start; i <= stop; i++){
			var col = this._getCol(i);
			fProcessCol(col);
		}
	}
};
Woorksheet.prototype.setColHidden=function(bHidden, start, stop){
	//start, stop 0 based
	if(null == start)
		return;
	if(null == stop)
		stop = start;
	History.Create_NewPoint();
	History.SetSelection(null, true);
	var oThis = this;
	var fProcessCol = function(col){
		if(col.hd != bHidden)
		{
			var oOldProps = col.getWidthProp();
			if(bHidden)
			{
				col.hd = bHidden;
				if(null == col.width || true != col.CustomWidth)
					col.width = 0;
				col.CustomWidth = true;
				col.BestFit = null;
			}
			else
			{
				col.hd = null;
				if(0 == col.width)
					col.width = null;
			}
			var oNewProps = col.getWidthProp();
			if(false == oOldProps.isEqual(oNewProps))
			{
				History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ColProp, oThis.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(col.index, false, oOldProps, oNewProps));
				History.AddTrigger(["changeWorksheetUpdate", oThis.getId()]);
			}
		}
	};
	if(0 != start && gc_nMaxCol0 == stop)
	{
		var col = this.getAllCol();
		fProcessCol(col);
	}
	else
	{
		for(var i = start; i <= stop; i++){
			var col = this._getCol(i);
			fProcessCol(col);
		}
	}
};
Woorksheet.prototype.setColBestFit=function(bBestFit, start, stop){
	//start, stop 0 based
	if(null == start)
		return;
	if(null == stop)
		stop = start;
	History.Create_NewPoint();
	History.SetSelection(null, true);
	var oThis = this;
	var fProcessCol = function(col){
		if(col.BestFit != bBestFit)
		{
			var oOldProps = col.getWidthProp();
			if(bBestFit)
			{
				col.BestFit = bBestFit;
				col.hd = null;
			}
			else
				col.BestFit = null;
			var oNewProps = col.getWidthProp();
			if(false == oOldProps.isEqual(oNewProps))
			{
				History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ColProp, oThis.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(col.index, false, oOldProps, oNewProps));
				History.AddTrigger(["changeWorksheetUpdate", oThis.getId()]);
			}
		}
	};
	if(0 != start && gc_nMaxCol0 == stop)
	{
		var col = this.getAllCol();
		fProcessCol(col);
	}
	else
	{
		for(var i = start; i <= stop; i++){
			var col = this._getCol(i);
			fProcessCol(col);
		}
	}
};
Woorksheet.prototype.getDefaultHeight=function(){
	return this.dDefaultheight;
};
Woorksheet.prototype.getRowHeight=function(index){
	//index 0 based
	var row = this.aGCells[index];
	if(null != row && null != row.h)
		return row.h;
	else
		return -1;
};
Woorksheet.prototype.setRowHeight=function(height, start, stop){
	if(0 == height)
		return this.setRowHidden(true, start, stop);
	//start, stop 0 based
	if(null == start)
		return;
	if(null == stop)
		stop = start;
	History.Create_NewPoint();
	History.SetSelection(null, true);
	for(var i = start;i <= stop; i++){
		var oCurRow = this._getRow(i);
		if(oCurRow.h != height)
		{
			var oOldProps = oCurRow.getHeightProp();
			oCurRow.h = height;
			oCurRow.CustomHeight = true;
			oCurRow.hd = null;
			var oNewProps = oCurRow.getHeightProp();
			if(false == Asc.isEqual(oOldProps, oNewProps))
			{
				History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RowProp, this.getId(), new Asc.Range(0, i, gc_nMaxCol0, i), new UndoRedoData_IndexSimpleProp(i, true, oOldProps, oNewProps));
				History.AddTrigger(["changeWorksheetUpdate", this.getId()]);
			}
		}
	}
};
Woorksheet.prototype.setRowHidden=function(bHidden, start, stop){
	//start, stop 0 based
	if(null == start)
		return;
	if(null == stop)
		stop = start;
	History.Create_NewPoint();
	History.SetSelection(null, true);
	for(var i = start;i <= stop; i++){
		var oCurRow = this._getRow(i);
		if(oCurRow.hd != bHidden)
		{
			var oOldProps = oCurRow.getHeightProp();
			if(bHidden)
			{
				if(true != oCurRow.CustomHeight)
					oCurRow.h = null;
				oCurRow.hd = bHidden;
				oCurRow.CustomHeight = true;
			}
			else
				oCurRow.hd = null;
			var oNewProps = oCurRow.getHeightProp();
			if(false == Asc.isEqual(oOldProps, oNewProps))
			{
				History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RowProp, this.getId(), new Asc.Range(0, i, gc_nMaxCol0, i), new UndoRedoData_IndexSimpleProp(i, true, oOldProps, oNewProps));
				History.AddTrigger(["changeWorksheetUpdate", this.getId()]);
			}
		}
	}
};
Woorksheet.prototype.setRowBestFit=function(bBestFit, start, stop){
	//start, stop 0 based
	if(null == start)
		return;
	if(null == stop)
		stop = start;
	History.Create_NewPoint();
	History.SetSelection(null, true);
	for(var i = start;i <= stop; i++){
		var oCurRow = this._getRow(i);
		if(bBestFit && oCurRow.CustomHeight)
		{
			var oOldProps = oCurRow.getHeightProp();
			if(true == bBestFit)
				oCurRow.CustomHeight = null;
			var oNewProps = oCurRow.getHeightProp();
			if(false == Asc.isEqual(oOldProps, oNewProps))
			{
				History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RowProp, this.getId(), new Asc.Range(0, i, gc_nMaxCol0, i), new UndoRedoData_IndexSimpleProp(i, true, oOldProps, oNewProps));
				History.AddTrigger(["changeWorksheetUpdate", this.getId()]);
			}
		}
	}
};
Woorksheet.prototype.getCell=function(oCellAdd){
	return this.getRange(oCellAdd, oCellAdd);
};
Woorksheet.prototype.getCell2=function(sCellAdd){
	if( sCellAdd.indexOf("$") > -1)
		sCellAdd = sCellAdd.replace(/\$/g,"");
	return this.getRange2(sCellAdd);
};
Woorksheet.prototype.getCell3=function(r1, c1){
	return this.getRange3(r1, c1, r1, c1);
};
Woorksheet.prototype.getRange=function(cellAdd1, cellAdd2){
	//Если range находится за границами ячеек расширяем их
	var nRow1 = cellAdd1.getRow0();
	var nCol1 = cellAdd1.getCol0();
	var nRow2 = cellAdd2.getRow0();
	var nCol2 = cellAdd2.getCol0();
	return this.getRange3(nRow1, nCol1, nRow2, nCol2);
};
Woorksheet.prototype.getRange2=function(sRange){
	if( sRange.indexOf("$") > -1)
		sRange = sRange.replace(/\$/g,"");
	var nIndex = sRange.indexOf(":");
	if(-1 != nIndex){
		var sFirstCell = sRange.substring(0, nIndex);
		var sLastCell = sRange.substring(nIndex + 1);
		var oFirstAddr, oLastAddr;
		
		if( sFirstCell == sLastCell ){
			if( !sFirstCell.match(/[^a-z]/ig) ){
				oFirstAddr = new CellAddress(sFirstCell+"1");
				oLastAddr = new CellAddress(sLastCell+(gc_nMaxRow+""));
			}
			else if( !sFirstCell.match(/[^0-9]/) ){
				oFirstAddr = new CellAddress("A"+sFirstCell);
				oLastAddr = new CellAddress(g_oCellAddressUtils.colnumToColstr(gc_nMaxCol)+sLastCell);
			}
			else{
				oFirstAddr = new CellAddress(sFirstCell);
				oLastAddr = new CellAddress(sLastCell);
			}
		}
		else{
			oFirstAddr = new CellAddress(sFirstCell);
			oLastAddr = new CellAddress(sLastCell);
		}
		if(oFirstAddr.isValid() && oLastAddr.isValid()){
			if( (gc_nMaxCol == oFirstAddr.getCol() || gc_nMaxRow == oFirstAddr.getRow()) && oFirstAddr.id != sRange.toUpperCase()){
				//    A:  1:2
				if(gc_nMaxRow == oFirstAddr.getRow())
					return this.getRange(new CellAddress(1, oFirstAddr.getCol()), new CellAddress(gc_nMaxRow, oLastAddr.getCol()));
				else
					return this.getRange(new CellAddress( oFirstAddr.getRow(), 1), new CellAddress(oLastAddr.getRow(), gc_nMaxCol));
			}
			else
				return this.getRange(oFirstAddr, oLastAddr);
		}
		return null;
	}
	else{
		var oCellAddr = new CellAddress(sRange);
		if(oCellAddr.isValid()){
			if( (gc_nMaxCol == oCellAddr.getCol() || gc_nMaxRow == oCellAddr.getRow()) && oCellAddr.id != sRange.toUpperCase()){
				//    A:  1:2
				if(gc_nMaxRow == oCellAddr.getRow())
					return this.getRange(new CellAddress(1, oCellAddr.getCol()), new CellAddress(gc_nMaxRow, oCellAddr.getCol()));
				else
					return this.getRange(new CellAddress( oCellAddr.getRow(), 1), new CellAddress(oCellAddr.getRow(), gc_nMaxCol));
			}
			else
				return this.getRange(oCellAddr, oCellAddr);
		}
	}
	return null;
};
Woorksheet.prototype.getRange3=function(r1, c1, r2, c2){
	var nRowMin = r1;
	var nRowMax = r2;
	var nColMin = c1;
	var nColMax = c2;
	if(r1 > r2){
		nRowMax = r1;
		nRowMin = r2;
	}
	if(c1 > c2){
		nColMax = c1;
		nColMin = c2;
	}
	return new Range(this, nRowMin, nColMin, nRowMax, nColMax);
}
Woorksheet.prototype._getRows=function(){
	return this.aGCells;
};
Woorksheet.prototype._getCols=function(){
	return this.aCols;
};
Woorksheet.prototype._removeCell=function(nRow, nCol, cell){
	if(null != cell)
	{
		nRow = cell.oId.getRow0();
		nCol = cell.oId.getCol0();
	}
	var row = this.aGCells[nRow];
	if(null != row)
	{
		var cell = row.c[nCol];
		if(null != cell)
		{
			if(false == cell.isEmpty())
			{
				var oUndoRedoData_CellData = new UndoRedoData_CellData(cell.getValueData(), null);
				if(null != cell.xfs)
					oUndoRedoData_CellData.style = cell.xfs.clone();
				History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveCell, this.getId(), new Asc.Range(0, nRow, gc_nMaxCol0, nRow), new UndoRedoData_CellSimpleData(nRow, nCol, oUndoRedoData_CellData, null));
			}
			
			this.helperRebuildFormulas(cell,cell.getName(),cell.getName());
			
			if( !arrRecalc[this.getId()] ){
				arrRecalc[this.getId()] = {};
			}
			arrRecalc[this.getId()][cell.getName()] = cell.getName();
			this.workbook.needRecalc[ getVertexId(this.getId(),cell.getName()) ] = [ this.getId(),cell.getName() ];
			if( this.workbook.needRecalc.length < 0) this.workbook.needRecalc.length = 0;
			this.workbook.needRecalc.length++;
			
			delete row.c[nCol];
			if(row.isEmpty())
				delete this.aGCells[nRow];
		}
	}
};
Woorksheet.prototype._getCell=function(row, col){
	//0-based
	var oCurRow = this._getRow(row);
	var oCurCell = oCurRow.c[col];
	if(null == oCurCell){
		oCurCell = new Cell(this);
		var oRow = this._getRowNoEmpty(row);
		var oCol = this._getColNoEmptyWithAll(col);
		var xfs = null;
		if(null != oRow && null != oRow.xfs)
			xfs = oRow.xfs.clone();
		else if(null != oCol && null != oCol.xfs)
			xfs = oCol.xfs.clone();
		oCurCell.create(xfs, new CellAddress(row, col, 0));
		oCurRow.c[col] = oCurCell;
		if(row + 1 > this.nRowsCount)
			this.nRowsCount = row + 1;
		if(col + 1 > this.nColsCount)
			this.nColsCount = col + 1;
		History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_CreateCell, this.getId(), null, new UndoRedoData_CellSimpleData(row, col, null, null));
	}
	return oCurCell;
};
Woorksheet.prototype._getCell2=function(cellId){
	var oCellAddress = new CellAddress(cellId);
	return this._getCell(oCellAddress.getRow0(), oCellAddress.getCow0());
};
Woorksheet.prototype._getCellNoEmpty=function(row, col){
	//0-based
	var oCurCell;
	var oCurRow = this.aGCells[row];
	if(oCurRow)
		return oCurRow.c[col];
	return null;
};
Woorksheet.prototype._getRowNoEmpty=function(row){
	//0-based
	var oCurRow = this.aGCells[row];
	if(oCurRow)
		return oCurRow;
	return null;
};
Woorksheet.prototype._getColNoEmpty=function(col){
	//0-based
	var oCurCol = this.aCols[col];
	if(oCurCol)
		return oCurCol;
	return null;
};
Woorksheet.prototype._getColNoEmptyWithAll=function(col){
	var oRes = this._getColNoEmpty(col);
	if(null == oRes)
		oRes = this.oAllCol;
	return oRes;
};
Woorksheet.prototype._getRow=function(row){
	//0-based
	var oCurRow = this.aGCells[row];
	if(!oCurRow){
		oCurRow = new Row(this);
		oCurRow.create(row + 1);
		this.aGCells[row] = oCurRow;
		this.nRowsCount = row > this.nRowsCount ? row : this.nRowsCount ;
		History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_CreateRow, this.getId(), null, new UndoRedoData_SingleProperty(row));
	}
	return oCurRow;
};
Woorksheet.prototype._removeRow=function(index){
	delete this.aGCells[index];
};
Woorksheet.prototype._getCol=function(index){
	//0-based
	var oCurCol;
	if(-1 == index)
		oCurCol = this.getAllCol();
	else
	{
		oCurCol = this.aCols[index];
		if(null == oCurCol)
		{
			if(null != this.oAllCol)
			{
				oCurCol = this.oAllCol.clone();
				oCurCol.index = index;
			}
			else
				oCurCol = new Col(this, index);
			this.aCols[index] = oCurCol;
			this.nColsCount = index > this.nColsCount ? index : this.nColsCount;
			History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_CreateCol, this.getId(), null, new UndoRedoData_SingleProperty(index));
		}
	}
	return oCurCol;
};
Woorksheet.prototype._removeCol=function(index){
	//0-based
	delete this.aCols[index];
};
Woorksheet.prototype._moveCellHor=function(nRow, nCol, dif){
	var cell = this._getCellNoEmpty(nRow, nCol);
	if(cell)
	{
		var lastName = cell.getName();//старое имя
		cell.moveHor(dif);
		var newName = cell.getName();
		var row = this._getRow(nRow);
		row.c[nCol + dif] = cell;
		delete row.c[nCol];
		
		this.helperRebuildFormulas(cell,lastName,cell.getName());
		
	}
};
Woorksheet.prototype._moveCellVer=function(nRow, nCol, dif){
	var cell = this._getCellNoEmpty(nRow, nCol);
	if(cell)
	{
		var lastName = cell.getName();//старое имя
		cell.moveVer(dif);
		var oCurRow = this._getRow(nRow);
		var oTargetRow = this._getRow(nRow + dif);
		delete oCurRow.c[nCol];
		oTargetRow.c[nCol] = cell;
		if(oCurRow.isEmpty())
			delete this.aGCells[nRow];

		this.helperRebuildFormulas(cell,lastName,cell.getName());
	}
};
Woorksheet.prototype._prepareMoveRange=function(oBBoxFrom, oBBoxTo){
	var range = this.getRange(new CellAddress(oBBoxTo.r1, oBBoxTo.c1, 0), new CellAddress(oBBoxTo.r2, oBBoxTo.c2, 0)),
		merged = range.hasMergedAll(),
		res = 0;
	if(merged){
		for( var id in merged ){
			var m = merged[id].getBBox0();
			if( !(m.r1 >= oBBoxTo.r1 && m.r2 <= oBBoxTo.r2 && m.c1 >= oBBoxTo.c1 && m.c2 <= oBBoxTo.c2) ){
				return -2;
			}
		}
	}
	if( oBBoxFrom.intersection(oBBoxTo) )
		return res;
	range._foreachNoEmpty(
		function(cell){
			if(cell.getValue()!=="")
				return res = -1;
		})
	return res;
}
Woorksheet.prototype._moveRange=function(oBBoxFrom, oBBoxTo, copyRange){
	History.Create_NewPoint();
	History.SetSelection(new Asc.Range(oBBoxFrom.c1, oBBoxFrom.r1, oBBoxFrom.c2, oBBoxFrom.r2));
	History.SetSelectionRedo(new Asc.Range(oBBoxTo.c1, oBBoxTo.r1, oBBoxTo.c2, oBBoxTo.r2));
	// History.StartTransaction();
	History.TurnOff();
	
	var arrUndo={from:[],to:[]};
	var merged = this.getRange(new CellAddress(oBBoxTo.r1, oBBoxTo.c1, 0), new CellAddress(oBBoxTo.r2, oBBoxTo.c2, 0)).hasMergedAll();

	var t = this, offset = { offsetRow : oBBoxTo.r1 - oBBoxFrom.r1, offsetCol : oBBoxTo.c1 - oBBoxFrom.c1 }, rec = {length:0};
		
	var move = this.workbook.dependencyFormulas.helper(oBBoxFrom,this.Id), c = {}, ret = {}, arrFrom = [], arrTo = [];

	for(var id in move.recalc){
		var n = move.recalc[id];
		var _sn = n.getSlaveEdges2();
		for( var _id in _sn ){
			rec[_sn[_id].nodeId] = [ _sn[_id].sheetId, _sn[_id].cellId ];
			rec.length++;
		}
	}
	
	for( var id in move.move ){
		var n = move.move[id];
		var _sn = n.getSlaveEdges2();
		for( var _id in _sn ){
			var cell = _sn[_id].returnCell();
			if( undefined == cell || null == cell ) { continue; }
			if( cell.formulaParsed ){
				cell.formulaParsed.shiftCells( offset, oBBoxFrom, n, this.Id, false );
				cell.setFormula(cell.formulaParsed.assemble());
				rec[cell.getName()] = [ cell.ws.getId(), cell.getName() ];
				rec.length++;
			}
		}
	}
	
	for(var nRow = oBBoxFrom.r2; nRow >= oBBoxFrom.r1; nRow-- ){
	
		arrFrom[nRow] = [];
		arrTo[nRow+offset.offsetRow] = [];
	
		for(var nCol = oBBoxFrom.c2; nCol >= oBBoxFrom.c1; nCol-- ){
		
			var cellFrom = this._getCell(nRow, nCol);
			arrTo[nRow+offset.offsetRow][nCol+offset.offsetCol] = this._getCell(nRow+offset.offsetRow,nCol+offset.offsetCol);
		
			arrFrom[nRow][nCol] = cellFrom.clone();
			var cellFromClone = cellFrom.clone();
			var cellFromName = cellFrom.getName();
			
			arrUndo.from.push(cellFromClone);
			
			if( cellFrom.sFormula ){
				this.workbook.dependencyFormulas.deleteNode(getVertexId(this.Id,cellFromName));
				this.workbook.cwf[this.Id].cells[cellFromName] = null;
				delete this.workbook.cwf[this.Id].cells[cellFromName];
			}
			
			var cellTo = this._getCell(nRow+offset.offsetRow,nCol+offset.offsetCol);
			arrTo[nRow+offset.offsetRow][nCol+offset.offsetCol] = cellTo.clone();
			var cellToName = cellTo.getName();
			var sn = this.workbook.dependencyFormulas.getSlaveNodes(this.Id,cellToName);
			
			if( sn ){
				for( var _id in sn){
					rec[_id] = [ sn[_id].sheetId, sn[_id].cellId ];
					rec.length++;
				}
			}
			
			if( cellTo.sFormula ){
				this.workbook.dependencyFormulas.deleteNode(getVertexId(this.Id,cellToName));
				this.workbook.cwf[this.Id].cells[cellToName] = null;
				delete this.workbook.cwf[this.Id].cells[cellToName];
			}
			
			arrUndo.to.push(cellTo.clone());
			
			var oCurRow = this._getRow(nRow);
			delete oCurRow.c[nCol];
			if( oCurRow.isEmpty() )
				delete this.aGCells[nRow];
			
		}
	}
	
	for(var nRow = oBBoxFrom.r2; nRow >= oBBoxFrom.r1; nRow-- ){
		for(var nCol = oBBoxFrom.c2; nCol >= oBBoxFrom.c1; nCol-- ){
			var _cell = arrFrom[nRow][nCol], savedHyperlinks = [];
			
			var idC = getVertexId(this.Id,_cell.getName());
			
			if( idC in rec ){
				rec[idC] = null;
				delete rec[idC];
			}
			
			_cell.moveVer(offset.offsetRow);
			_cell.moveHor(offset.offsetCol);
			
			if( _cell.merged )
				_cell.merged.setOffset(offset);
				
			if( _cell.sFormula ){
				this.workbook.cwf[this.Id].cells[_cell.getName()] = _cell.getName();
				rec[ idC ] = [ this.Id, _cell.getName() ];
				rec.length++;
			}
			
			if( _cell.hyperlinks.length > 0 ){
				for( var i = 0; i < _cell.hyperlinks.length; i++ ){
					if( !( oBBoxFrom.c1 <= _cell.hyperlinks[i].Ref.bbox.c1 && oBBoxFrom.r1 <= _cell.hyperlinks[i].Ref.bbox.r1 && oBBoxFrom.c2 >= _cell.hyperlinks[i].Ref.bbox.c2 && oBBoxFrom.r2 >= _cell.hyperlinks[i].Ref.bbox.r2 ) ){
						this.getCell3(nRow,nCol).setHyperlink(_cell.hyperlinks.splice(i,1)[0],true)
						i-=1;
					}
					else{
						_cell.hyperlinks[i].Ref = this.getRange2(_cell.getName());
					}
				}
			}

			var oTargetRow = this._getRow(nRow + offset.offsetRow);
			oTargetRow.c[nCol+offset.offsetCol] = _cell;

		}
	}
		
	this.workbook.buildDependency();
	this.workbook.needRecalc = rec;

	recalc(this.workbook);
	// History.EndTransaction();
	History.TurnOn();
	History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_MoveRange,
				this.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0),
				new UndoRedoData_FromToCell(oBBoxFrom, oBBoxTo, arrUndo));

	return true;
	
}
Woorksheet.prototype._shiftCellsLeft=function(oBBox){
	lockDraw(this.workbook);
	//todo удаление когда есть замерженые ячейки
	var nLeft = oBBox.c1;
	var nRight = oBBox.c2;
	var dif = nLeft - nRight - 1;
	for(var i = oBBox.r1; i <= oBBox.r2; i++){
		var row = this.aGCells[i];
		if(row){
			var aIndexes = new Array();
			for(var cellInd in row.c)
			{
				var nIndex = cellInd - 0;
				if(nIndex >= nLeft)
					aIndexes.push(nIndex);
			}
			//По возрастанию
			aIndexes.sort(fSortAscending);
			for(var j = 0, length2 = aIndexes.length; j < length2; ++j){
				var nCellInd = aIndexes[j];
				if(nCellInd <= nRight){
					//Удаляем ячейки
					this._removeCell(i, nCellInd);
				}
				else{
					//Сдвигаем ячейки
					this._moveCellHor(i, nCellInd, dif, oBBox);
				}
			}
		}
	}
	
	var res = this.renameDependencyNodes( {offsetRow:0,offsetCol:dif}, oBBox );
	helpFunction(this.workbook);
	unLockDraw(this.workbook);
	
	//todo проверить не уменьшились ли границы таблицы
	
	for(var id  in res)
		History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveCell, this.getId(), new Asc.Range(0, res[id].nRow, gc_nMaxCol0, res[id].nRow), new UndoRedoData_CellSimpleData(res[id].nRow, res[id].nCol, res[id].data, null));
	
	History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ShiftCellsLeft, this.getId(), new Asc.Range(0, oBBox.r1, gc_nMaxCol0, oBBox.r1), new UndoRedoData_BBox(oBBox));
};
Woorksheet.prototype._shiftCellsUp=function(oBBox){
	lockDraw(this.workbook);
	var nTop = oBBox.r1;
	var nBottom = oBBox.r2;
	var dif = nTop - nBottom - 1;
	var aIndexes = new Array();
	for(var i in this.aGCells)
	{
		var rowInd = i - 0;
		if(rowInd >= nTop)
			aIndexes.push(rowInd);
	}
	//по возрастанию
	aIndexes.sort(fSortAscending);
	for(var i = 0, length = aIndexes.length; i < length; ++i){
		var rowInd = aIndexes[i];
		var row = this.aGCells[rowInd];
		if(row){
			if(rowInd <= nBottom){
				//Удаляем ячейки
				for(var j = oBBox.c1; j <= oBBox.c2; j++){
					this._removeCell(rowInd, j);
				}
			}
			else{
				var nIndex = rowInd + dif;
				var rowTop = this._getRow(nIndex);
				//Сдвигаем ячейки
				for(var j = oBBox.c1; j <= oBBox.c2; j++){
					this._moveCellVer(rowInd, j, dif);
				}
			}
		}
	}
	
	var res = this.renameDependencyNodes({offsetRow:dif,offsetCol:0}, oBBox );
	helpFunction(this.workbook);
	unLockDraw(this.workbook);
	
	//todo проверить не уменьшились ли границы таблицы
	
	for(var id  in res)
		History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveCell, this.getId(), new Asc.Range(0, res[id].nRow, gc_nMaxCol0, res[id].nRow), new UndoRedoData_CellSimpleData(res[id].nRow, res[id].nCol, res[id].data, null));
		
	History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ShiftCellsTop, this.getId(), new Asc.Range(0, oBBox.r1, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_BBox(oBBox));
};
Woorksheet.prototype._shiftCellsRight=function(oBBox){
	lockDraw(this.workbook);
	History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ShiftCellsRight, this.getId(), new Asc.Range(0, oBBox.r1, gc_nMaxCol0, oBBox.r1), new UndoRedoData_BBox(oBBox));
	History.TurnOff();
	var nLeft = oBBox.c1;
	var nRight = oBBox.c2;
	var dif = nRight - nLeft + 1;
	for(var i = oBBox.r1; i <= oBBox.r2; i++){
		var row = this.aGCells[i];
		if(row){
			var aIndexes = new Array();
			for(var cellInd in row.c)
			{
				var nIndex = cellInd - 0;
				if(nIndex >= nLeft)
					aIndexes.push(nIndex);
			}
			//по убыванию
			aIndexes.sort(fSortDescending);
			for(var j = 0, length2 = aIndexes.length; j < length2; ++j){
				var nCellInd = aIndexes[j];
				//Сдвигаем ячейки
				var cell = row.c[nCellInd];
				if(cell){
					if(nCellInd + dif > this.nColsCount)
						this.nColsCount = nCellInd + dif;
					this._moveCellHor(/*row*/i, /*col*/nCellInd, dif, oBBox);
				}
			}
		}
	}
	
	var res = this.renameDependencyNodes({offsetRow:0,offsetCol:dif}, oBBox);;
	helpFunction(this.workbook);
	unLockDraw(this.workbook);
		
	for(var id  in res)
		History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveCell, this.getId(), new Asc.Range(0, res[id].nRow, gc_nMaxCol0, res[id].nRow), new UndoRedoData_CellSimpleData(res[id].nRow, res[id].nCol, res[id].data, null));
	
	History.TurnOn();
};
Woorksheet.prototype._shiftCellsBottom=function(oBBox){
	lockDraw(this.workbook);
	History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ShiftCellsBottom, this.getId(), new Asc.Range(0, oBBox.r1, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_BBox(oBBox));
	History.TurnOff();
	var nTop = oBBox.r1;
	var nBottom = oBBox.r2;
	var dif = nBottom - nTop + 1;
	var aIndexes = new Array();
	for(var i in this.aGCells){
		var rowInd = i - 0;
		if(rowInd >= nTop)
			aIndexes.push(rowInd);
	}
	//по убыванию
	aIndexes.sort(fSortDescending);
	for(var i = 0, length = aIndexes.length; i < length; ++i){
		rowInd = aIndexes[i];
		var row = this.aGCells[rowInd];
		if(row){
			var nIndex = rowInd + dif;
			if(nIndex + dif > this.nRowsCount)
				this.nRowsCount = nIndex + dif;
			var rowTop = this._getRow(nIndex);
			//Сдвигаем ячейки
			for(var j = oBBox.c1; j <= oBBox.c2; j++){
				this._moveCellVer(rowInd, j, dif);
			}
		}
	}

	var res = this.renameDependencyNodes({offsetRow:dif,offsetCol:0}, oBBox);
	helpFunction(this.workbook);
	unLockDraw(this.workbook);
		
	for(var id  in res)
		History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveCell, this.getId(), new Asc.Range(0, res[id].nRow, gc_nMaxCol0, res[id].nRow), new UndoRedoData_CellSimpleData(res[id].nRow, res[id].nCol, res[id].data, null));
	
	History.TurnOn();
};
Woorksheet.prototype._setIndex=function(ind){
	this.index = ind;
}
Woorksheet.prototype._BuildDependencies=function(cellRange){
	/*
		Построение графа зависимостей.
	*/
	var c, ca;
	for(var i in cellRange){
		ca = new CellAddress(i);
		c = this._getCellNoEmpty(ca.getRow0(),ca.getCol0());

		if( c && c.sFormula ){
			c.formulaParsed = new parserFormula( c.sFormula, c.oId.getID(), this );
			c.formulaParsed.parse();
			c.formulaParsed.buildDependencies();
		}
	}
}
Woorksheet.prototype._RecalculatedFunctions=function(cell,bad){
	var thas = this;
	function adjustCellFormat(c, ftext) {
		// ищет в формуле первый рэндж и устанавливает формат ячейки как формат первой ячейки в рэндже
		var match = (/[^a-z0-9:]([a-z]+\d+:[a-z]+\d+|[a-z]+:[a-z]+|\d+:\d+|[a-z]+\d+)/i).exec('='+ftext);
		if (!match) {return;}
		var m = match[1].split(":")[0];
		if (m.search(/^[a-z]+$/i) >= 0) {
			m = m + "1";
		} else if (m.search(/^\d+$/) >= 0) {
			m = "A" + m;
		}
		var ca = new CellAddress(m);
		if( g_oDefaultNum.f == c.getNumFormatStr() )
			c.setNumFormat(thas.getCell(ca).getNumFormatStr());
	}
	
	if( cell.indexOf(":")>-1 ) return;
	
	var celladd = this.getRange2(cell).getFirst(),
		__cell = this._getCellNoEmpty( celladd.getRow0(),celladd.getCol0() ), res;
	
	if( !__cell || !__cell.sFormula )
		return;

	/*
		bad - флаг, показывающий, что ячейка находится в списке плохих ячеек (имеются циклические ссылки на ячейку), после сортировки графа зависимостей.
	*/
	if(!bad){
		res = __cell.formulaParsed.calculate();
	}
	else {
		res = new cError( cErrorType.bad_reference )
	}
	if(res){
		if( res.type == cElementType.cell){
			var nF = res.numFormat;
			res = res.getValue();
			res.numFormat = nF;
		}
		else if( res.type == cElementType.array ){
			var nF = res.numFormat;
			res = res.getElement(0);
			res.numFormat = nF;
		}
		else if( res.type == cElementType.cellsRange ){
			var nF = res.numFormat;
			res = res.cross(new CellAddress(cell))
			res.numFormat = nF;
		}
		__cell.oValue.clean();
		switch (res.type){
			case cElementType.number:
				__cell.oValue.type = CellValueType.Number;
				__cell.oValue.number = res.getValue();
				break;
			case cElementType.bool:
				__cell.oValue.type = CellValueType.Bool;
				__cell.oValue.number = res.value ? 1 : 0;
				break;
			case cElementType.error:
				__cell.oValue.type = CellValueType.Error;
				__cell.oValue.text = res.getValue().toString();
				break;
			default:
				__cell.oValue.type = CellValueType.String;
				__cell.oValue.text = res.getValue().toString();
		}
		__cell.setFormulaCA(res.ca);
		if( res.numFormat !== undefined && res.numFormat >= 0){
			__cell.setNumFormat(aStandartNumFormats[res.numFormat])
		}
		else if( res.numFormat !== undefined && res.numFormat == -1 ){
			adjustCellFormat(__cell,__cell.sFormula);
		}
	}
}
Woorksheet.prototype._ReBuildFormulas=function(cellRange,lastSheetName,newSheetName){
	/*
		Если существуют трехмерные ссылки на ячейки, то у них необходимо поменять имя листа на новое после переименования листа.
	*/
	var c, ca;
	for(var i in cellRange){
		ca = new CellAddress(i);
		c = this._getCellNoEmpty(ca.getRow0(),ca.getCol0());
		
		if( c && c.formulaParsed && c.formulaParsed.is3D ){
			c.setFormula(c.formulaParsed.assemble());
		}
	}
}
Woorksheet.prototype.renameDependencyNodes = function(offset,oBBox,rec, noDelete){
	var objForRebuldFormula = this.workbook.dependencyFormulas.checkOffset(oBBox, offset, this.Id, noDelete);
	var c = {}, ret = {};
	for ( var id in objForRebuldFormula.move ){
		var n = objForRebuldFormula.move[id].node;
		var _sn = n.getSlaveEdges2();
		for( var _id in _sn ){
			var cell = _sn[_id].returnCell();
			if( undefined == cell ) { continue; }
			if( cell.formulaParsed ){
				var oUndoRedoData_CellData = new UndoRedoData_CellData(cell.getValueData(), null);
				if(null != cell.xfs)
					oUndoRedoData_CellData.style = cell.xfs.clone();
				ret[cell.getName()] = {};
				ret[cell.getName()].data = oUndoRedoData_CellData;
				ret[cell.getName()].id = this.getId();
				ret[cell.getName()].nRow = cell.getCellAddress().getRow0();
				ret[cell.getName()].nCol = cell.getCellAddress().getCol0();
				
				cell.formulaParsed.shiftCells( objForRebuldFormula.move[id].offset, oBBox, n, this.Id, objForRebuldFormula.move[id].toDelete );
				cell.setFormula(cell.formulaParsed.assemble());
				c[cell.getName()] = cell;
			}
		}
		if( n.cellId.indexOf(":")<0){
			var cell = n.returnCell();
			if( cell && cell.formulaParsed ){
				c[cell.getName()] = cell;
			}
		}
	}
	for ( var id in objForRebuldFormula.stretch ){
		var n = objForRebuldFormula.stretch[id].node;
		var _sn = n.getSlaveEdges2();
		if( _sn == null ){
			if ( n.newCellId ){
				n = this.workbook.dependencyFormulas.getNode(n.sheetId,n.newCellId)
				_sn = n.getSlaveEdges2();
			}
		}
		for( var _id in _sn ){
			var cell = _sn[_id].returnCell();
			if( cell && cell.formulaParsed ){
				if( !(cell.getName() in ret) ){
					var oUndoRedoData_CellData = new UndoRedoData_CellData(cell.getValueData(), null);
					if(null != cell.xfs)
						oUndoRedoData_CellData.style = cell.xfs.clone();
					ret[cell.getName()] = {};
					ret[cell.getName()].data = oUndoRedoData_CellData;
					ret[cell.getName()].id = this.getId();
					ret[cell.getName()].nRow = cell.getCellAddress().getRow0();
					ret[cell.getName()].nCol = cell.getCellAddress().getCol0();
				}
				cell.formulaParsed.stretchArea( objForRebuldFormula.stretch[id].offset, oBBox, n, this.Id );
				cell.setFormula(cell.formulaParsed.assemble());
				c[cell.getName()] = cell;
				
			}
		}
	}
	
	var id = null;
	for ( id in objForRebuldFormula ){
		if( id == "recalc" ) continue;
		for(var _id in objForRebuldFormula[id] )
			this.workbook.dependencyFormulas.deleteNode( objForRebuldFormula[id][_id].node );
	}
	
	for( var i in c ){
		var n = c[i].getName();
		c[i].formulaParsed.setCellId(n);
		this.workbook.cwf[c[i].ws.Id].cells[n] = n;
		c[i].formulaParsed.buildDependencies();
		this.workbook.needRecalc[ getVertexId(c[i].ws.Id,n) ] = [ c[i].ws.Id, n ];
		this.workbook.needRecalc.length++;
		c[i] = null;
		delete c[i];
	}

	for( var id in objForRebuldFormula.recalc ){
		var n = objForRebuldFormula.recalc[id];
		var _sn = n.getSlaveEdges();
		for( var _id in _sn ){
			if( !_sn[_id].isArea ){
				this.workbook.needRecalc[ _sn[_id].nodeId ] = [ _sn[_id].sheetId, _sn[_id].cellId ];
				this.workbook.needRecalc.length++;
			}
		}
	}
	
	if ( false !== rec )
		recalc(this.workbook);
	
	return ret;
}
Woorksheet.prototype.helperRebuildFormulas = function(cell,lastName,newName){
	if( cell.sFormula ){
		this.workbook.cwf[this.Id].cells[lastName] = null;
		delete this.workbook.cwf[this.Id].cells[lastName];
	}
}
Woorksheet.prototype.getAllCol = function(){
	if(null == this.oAllCol)
		this.oAllCol = new Col(this, g_nAllColIndex);
	return this.oAllCol;
}
//-------------------------------------------------------------------------------------------------
/**
 * @constructor
 */
function Cell(worksheet){
	this.ws = worksheet;
	this.sm = worksheet.workbook.oStyleManager;
	this.oValue = new CCellValue(this);
	this.xfs = null;
	this.oId = null;
	this.oFormulaExt = null;
	this.sFormula = null;
	this.formulaParsed = null;
	this.merged = null;
	this.hyperlinks = new Array();
};
Cell.prototype.clone=function(){
	var oNewCell = new Cell(this.ws);
	oNewCell.oId = new CellAddress(this.oId.getRow(), this.oId.getCol());
	if(null != this.xfs)
		oNewCell.xfs = this.xfs.clone();
	oNewCell.oValue = this.oValue.clone(oNewCell);
	if(null != this.sFormula)
		oNewCell.sFormula = this.sFormula;
	//todo подумать
	if(null != this.merged)
		oNewCell.merged = this.merged.clone();
	for(var  i = 0, length = this.hyperlinks.length; i < length; ++i)
		oNewCell.hyperlinks.push(this.hyperlinks[i].clone());
	return oNewCell;
};
Cell.prototype.create=function(xfs, oId){
	this.xfs = xfs;
	this.oId = oId;
};
Cell.prototype.isEmptyText=function(){
	if(false == this.oValue.isEmpty())
		return false;
	if(null != this.sFormula)
		return false;
	return true;
};
Cell.prototype.isEmptyTextString=function(){
	return this.oValue.isEmpty();
};
Cell.prototype.isEmpty=function(){
	if(false == this.isEmptyText())
		return false;
	if(null != this.xfs)
		return false;
	if(null != this.merged)
		return false;
	if(this.hyperlinks.length > 0)
		return false;
	return true;
};
Cell.prototype.isFormula=function(){
	return this.sFormula ? true : false;
}
Cell.prototype.Remove=function(){
	this.ws._removeCell(null, null, this);
};
Cell.prototype.getName=function(){
	return this.oId.getID();
};
Cell.prototype.setFormula=function(val){
	this.sFormula = val;
	this.oValue.cleanCache();
}
Cell.prototype.setValue=function(val,callback){
	var ret = true;
	var DataOld = null;
	if(History.Is_On())
		DataOld = this.getValueData();
    var sNumFormat;
    if(null != this.xfs && null != this.xfs.num)
        sNumFormat = this.xfs.num.f;
    else
        sNumFormat = g_oDefaultNum.f;
	var numFormat = oNumFormatCache.get(sNumFormat);
	var wb = this.ws.workbook;
	var ws = this.ws;
	if(false == numFormat.isTextFormat())
	{
		/*
			Устанавливаем значение в Range ячеек. При этом происходит проверка значения на формулу.
			Если значение является формулой, то проверяем содержиться ли в ячейке формула или нет, если "да" - то очищаем в графе зависимостей список, от которых зависит формула(masterNodes), позже будет построен новый. Затем выставляем флаг о необходимости дальнейшего пересчета, и заносим ячейку в список пересчитываемых ячеек.
		*/
		if( null != val && val[0] == "=" && val.length > 1){
			this.formulaParsed = new parserFormula(val.substring(1),this.oId.getID(),this.ws);
			if( !this.formulaParsed.parse() ){
				switch( this.formulaParsed.error[this.formulaParsed.error.length-1] ){
					case c_oAscError.ID.FrmlWrongFunctionName:
						break;
					default :{
						wb.handlers.trigger("asc_onError",this.formulaParsed.error[this.formulaParsed.error.length-1], c_oAscError.Level.NoCritical);
						if( callback )
							callback(false);
						return;
					}
				}

			}
			else{
				val = "="+this.formulaParsed.assemble();
			}
		}
	}
	//удаляем старые значения
	this.oValue.clean();
	var needRecalc = false;
	var ar = {};
	if( null != val && val[0] != "=" || true == numFormat.isTextFormat()){
		if (this.sFormula){
			if ( this.oId.getID() in wb.cwf[ws.Id].cells){
				wb.dependencyFormulas.deleteMasterNodes( ws.Id, this.oId.getID() );
				delete wb.cwf[ws.Id].cells[this.oId.getID()];
			}
			needRecalc = true;
			ar[this.oId.getID()] = this.oId.getID();
		}
		else{
			if( wb.dependencyFormulas.nodeExist2( ws.Id, this.oId.getID() ) ){
				needRecalc = true;
				ar[this.oId.getID()] = this.oId.getID();
			}
		}
	}
	else{
		wb.dependencyFormulas.deleteMasterNodes( ws.Id, this.oId.getID() );
		needRecalc = true;
		wb.cwf[ws.Id].cells[this.oId.getID()] = this.oId.getID();
		ar[this.oId.getID()] = this.oId.getID();
	}
	this.sFormula = null;
	this.setFormulaCA(false);
	if(val){
		if(false == numFormat.isTextFormat() && val[0] == "=" && val.length > 1){
			this.setFormula( val.substring(1) );
		}
		else {
			this.oValue.setValue(val);
		}
	}
	if ( needRecalc && this.ws.workbook.isNeedCacheClean ){
		/*
			Если необходим пересчет, то по списку пересчитываемых ячеек сортируем граф зависимостей и пересчиываем в получившемся порядке. Плохим ячейкам с цикличискими ссылками выставляем ошибку "#REF!".
		*/
		sortDependency(this.ws, ar);
	}
	else if( this.ws.workbook.isNeedCacheClean == false ){
		if( !arrRecalc[this.ws.getId()] ){
			arrRecalc[this.ws.getId()] = {};
		}
		arrRecalc[this.ws.getId()][this.oId.getID()] = this.oId.getID();
		wb.needRecalc[ getVertexId(this.ws.getId(),this.oId.getID()) ] = [ this.ws.getId(),this.oId.getID() ];
		wb.needRecalc.length++;
	}
	var DataNew = null;
	if(History.Is_On())
		DataNew = this.getValueData();
	if(History.Is_On() && false == DataOld.isEqual(DataNew))
		History.Add(g_oUndoRedoCell, historyitem_Cell_ChangeValue, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), DataOld, DataNew));
	if(this.isEmptyTextString())
	{
		var cell = this.ws.getCell(this.oId);
		cell.removeHyperlink();
	}
	return ret;
};
Cell.prototype.setValue2=function(array){
	var DataOld = null;
	if(History.Is_On())
		DataOld = this.getValueData();
	//[{text:"",format:TextFormat},{}...]
	
	//удаляем сторое значение
	var ws = this.ws;
	var wb = this.ws.workbook;
	var needRecalc = false;
	var ar = new Array();
	if (this.sFormula){
		if ( this.oId.getID() in wb.cwf[ws.Id].cells){
			wb.dependencyFormulas.deleteMasterNodes( ws.Id, this.oId.getID() );
			delete wb.cwf[ws.Id].cells[this.oId.getID()];
		}
		needRecalc = true;
		ar.push(this.oId.getID());
	}
	else{
		if( wb.dependencyFormulas.nodeExist2( ws.Id, this.oId.getID() ) ){
			needRecalc = true;
			ar.push(this.oId.getID());
		}
	}
	this.sFormula = null;
	this.oValue.clean();
	this.setFormulaCA(false);
	this.oValue.setValue2(array);
	if (needRecalc){
		/*
			Если необходим пересчет, то по списку пересчитываемых ячеек сортируем граф зависимостей и пересчиываем в получившемся порядке. Плохим ячейкам с цикличискими ссылками выставляем ошибку "#REF!".
		*/
		sortDependency(this.ws, ar);
	}
	var DataNew = null;
	if(History.Is_On())
		DataNew = this.getValueData();
	if(History.Is_On() && false == DataOld.isEqual(DataNew))
		History.Add(g_oUndoRedoCell, historyitem_Cell_ChangeValue, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), DataOld, DataNew));
	if(this.isEmptyTextString())
	{
		var cell = this.ws.getCell(this.oId);
		cell.removeHyperlink();
	}
};
Cell.prototype.setType=function(type){
	return this.oValue.type = type;
};
Cell.prototype.getType=function(){
	return this.oValue.type;
};
Cell.prototype.getDefaultFormat=function(oDefault){
	var nRow = this.oId.getRow0();
	var nCol = this.oId.getCol0();
	var row = this.ws._getRowNoEmpty(nRow);
	if(null != row && null != row.xfs)
		return row.xfs;
	var col = this.ws._getColNoEmptyWithAll(nCol);
	if(null != col && null != col.xfs)
		return col.xfs;
	return oDefault;
};
Cell.prototype.setNumFormat=function(val){
	var oRes = this.sm.setNumFormat(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_Numformat, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.oValue.cleanCache();
};
Cell.prototype.shiftNumFormat=function(nShift, dDigitsCount){
	var bRes = false;
	var bGeneral = true;
    var sNumFormat;
    if(null != this.xfs && null != this.xfs.num)
        sNumFormat = this.xfs.num.f;
    else
        sNumFormat = g_oDefaultNum.f;
	if("General" != sNumFormat)
	{
		var oCurNumFormat = oNumFormatCache.get(sNumFormat);
		if(null != oCurNumFormat && false == oCurNumFormat.isGeneralFormat())
		{
			bGeneral = false;
			var output = new Object();
			bRes = oCurNumFormat.shiftFormat(output, nShift);
			if(true == bRes)
				this.setNumFormat(output.format);
		}
	}
	if(bGeneral)
	{
		if(CellValueType.Number == this.oValue.type)
		{
			var sGeneral = DecodeGeneralFormat(this.oValue.number, this.oValue.type, dDigitsCount);
			var oGeneral = oNumFormatCache.get(sGeneral);
			if(null != oGeneral && false == oGeneral.isGeneralFormat())
			{
				var output = new Object();
				bRes = oGeneral.shiftFormat(output, nShift);
				if(true == bRes)
					this.setNumFormat(output.format);
			}
		}
	}
	this.oValue.cleanCache();
	return bRes;
};
Cell.prototype.setFont=function(val, bModifyValue){
	if(false != bModifyValue)
	{
		//убираем комплексные строки
		if(null != this.oValue.multiText)
		{
			var oldVal = null;
			if(History.Is_On())
				oldVal = this.getValueData();
			this.oValue.makeSimpleText();
			if(History.Is_On())
			{
				var newVal = this.getValueData();
				History.Add(g_oUndoRedoCell, historyitem_Cell_ChangeValue, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oldVal, newVal));
			}
		}
	}
	var oRes = this.sm.setFont(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
	{
		var oldVal = null;
		if(null != oRes.oldVal)
			oldVal = oRes.oldVal.clone();
		var newVal = null;
		if(null != oRes.newVal)
			newVal = oRes.newVal.clone();
        History.Add(g_oUndoRedoCell, historyitem_Cell_SetFont, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oldVal, newVal));
	}
	this.oValue.cleanCache();
};
Cell.prototype.setFontname=function(val){
	this.oValue.setFontname(val);
	var oRes = this.sm.setFontname(this, val);
	if(History.Is_On() && oRes.oldVal != oRes.newVal)
		History.Add(g_oUndoRedoCell, historyitem_Cell_Fontname, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.oValue.cleanCache();
};
Cell.prototype.setFontsize=function(val){
	this.oValue.setFontsize(val);
	var oRes = this.sm.setFontsize(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_Fontsize, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.oValue.cleanCache();
};
Cell.prototype.setFontcolor=function(val){
	this.oValue.setFontcolor(val);
	var oRes = this.sm.setFontcolor(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_Fontcolor, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.oValue.cleanCache();
};
Cell.prototype.setBold=function(val){
	this.oValue.setBold(val);
	var oRes = this.sm.setBold(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_Bold, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.oValue.cleanCache();
};
Cell.prototype.setItalic=function(val){
	this.oValue.setItalic(val);
	var oRes = this.sm.setItalic(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_Italic, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.oValue.cleanCache();
};
Cell.prototype.setUnderline=function(val){
	this.oValue.setUnderline(val);
	var oRes = this.sm.setUnderline(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_Underline, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.oValue.cleanCache();
};
Cell.prototype.setStrikeout=function(val){
	this.oValue.setStrikeout(val);
	var oRes = this.sm.setStrikeout(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_Strikeout, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.oValue.cleanCache();
};
Cell.prototype.setFontAlign=function(val){
	this.oValue.setFontAlign(val);
	var oRes = this.sm.setFontAlign(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_FontAlign, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.oValue.cleanCache();
}
Cell.prototype.setAlignVertical=function(val){
	var oRes = this.sm.setAlignVertical(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_AlignVertical, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.oValue.cleanCache();
};
Cell.prototype.setAlignHorizontal=function(val){
	var oRes = this.sm.setAlignHorizontal(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_AlignHorizontal, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.oValue.cleanCache();
};
Cell.prototype.setFill=function(val){
	var oRes = this.sm.setFill(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_Fill, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.oValue.cleanCache();
};
Cell.prototype.setBorder=function(val){
	var oRes = this.sm.setBorder(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal){
		var oldVal = null;
		if(null != oRes.oldVal)
			oldVal = oRes.oldVal.clone();
		var newVal = null;
		if(null != oRes.newVal)
			newVal = oRes.newVal.clone();
        History.Add(g_oUndoRedoCell, historyitem_Cell_Border, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oldVal, newVal));
	}
	this.oValue.cleanCache();
};
Cell.prototype.setShrinkToFit=function(val){
	var oRes = this.sm.setShrinkToFit(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_ShrinkToFit, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.oValue.cleanCache();
};
Cell.prototype.setWrap=function(val){
	var oRes = this.sm.setWrap(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_Wrap, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.oValue.cleanCache();
};
Cell.prototype.setAngle=function(val){
    var oRes = this.sm.setAngle(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_Angle, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
    this.oValue.cleanCache();
};
Cell.prototype.setVerticalText=function(val){
    var oRes = this.sm.setVerticalText(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_Angle, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
    this.oValue.cleanCache();
};
Cell.prototype.setQuotePrefix=function(val){
	var oRes = this.sm.setQuotePrefix(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_SetQuotePrefix, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.oValue.cleanCache();
};
Cell.prototype.setStyle=function(xfs){
	var oldVal = this.xfs;
	var newVal = null;
    this.xfs = null;
	if(null != xfs)
	{
        this.xfs = xfs.clone();
        newVal = this.xfs;
	}
	this.oValue.cleanCache();
	if(History.Is_On() && false == ((null == oldVal && null == newVal) || (null != oldVal && null != newVal && true == oldVal.isEqual(newVal))))
	{
		if(null != oldVal)
			oldVal = oldVal.clone();
		if(null != newVal)
			newVal = newVal.clone();
		History.Add(g_oUndoRedoCell, historyitem_Cell_SetStyle, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oldVal, newVal));
	}
	// if(this.isEmpty())
		// this.Remove();
};
Cell.prototype.getFormula=function(){
	if(null != this.sFormula)
		return this.sFormula;
	else
		return "";
};
Cell.prototype.getValueForEdit=function(numFormat){
	return this.oValue.getValueForEdit();
};
Cell.prototype.getValueForEdit2=function(numFormat){
	return this.oValue.getValueForEdit2();
};
Cell.prototype.getValueWithoutFormat=function(){
	return this.oValue.getValueWithoutFormat();
};
Cell.prototype.getValue=function(numFormat, dDigitsCount){
	return this.oValue.getValue();
};
Cell.prototype.getValue2=function(dDigitsCount, fIsFitMeasurer){
	if(null == fIsFitMeasurer)
		fIsFitMeasurer = function(aText){return true;}
	if(null == dDigitsCount)
		dDigitsCount = gc_nMaxDigCountView;
	return this.oValue.getValue2(dDigitsCount, fIsFitMeasurer);
};
Cell.prototype.getStyle=function(){
	return this.xfs;
};
Cell.prototype.getNumFormatStr=function(){
	if(null != this.xfs && null != this.xfs.num)
            return this.xfs.num.f;
	return g_oDefaultNum.f;
}
Cell.prototype.moveHor=function(val){
	this.oId.moveCol(val);
};
Cell.prototype.moveVer=function(val){
	this.oId.moveRow(val);
};
Cell.prototype.getOffset=function(cell){
	var cAddr1 = this.oId, cAddr2 = cell.oId;
	return {offsetCol:(cAddr1.col - cAddr2.col), offsetRow:(cAddr1.row - cAddr2.row)};
}
Cell.prototype.getOffset2=function(cellId){
	var cAddr1 = this.oId, cAddr2 = new CellAddress(cellId);
	return {offsetCol:(cAddr1.col - cAddr2.col), offsetRow:(cAddr1.row - cAddr2.row)};
}
Cell.prototype.getOffset3=function(cellAddr){
	var cAddr1 = this.oId, cAddr2 = cellAddr;
	return {offsetCol:(cAddr1.col - cAddr2.col), offsetRow:(cAddr1.row - cAddr2.row)};
}
Cell.prototype.getCellAddress = function(){
	return this.oId;
}
Cell.prototype.getValueData = function(){
	return new UndoRedoData_CellValueData(this.sFormula, this.oValue.clone(null));
}
Cell.prototype.setValueData = function(Val){
	//значения устанавляваются через setValue, чтобы пересчитались формулы
	if(null != Val.formula)
		this.setValue("=" + Val.formula);
	else if(null != Val.value)
	{
		if(null != Val.value.number)
			this.setValue(Val.value.number.toString());
		else if(null != Val.value.text)
			this.setValue(Val.value.text);
		else if(null != Val.value.multiText)
			this.setValue2(Val.value._cloneMultiText());
		else
			this.setValue("");
	}
	else
		this.setValue("");
}
Cell.prototype.setFormulaCA = function(ca){
	if(ca) this.sFormulaCA = true;
	else if( this.sFormulaCA ) delete this.sFormulaCA;
}
Cell.prototype.getHyperlinks = function(){
	return this.hyperlinks;
}
Cell.prototype.getMerged = function(){
	return this.merged;
}
//-------------------------------------------------------------------------------------------------

/**
 * @constructor
 */
function Range(worksheet, r1, c1, r2, c2){
	this.worksheet = worksheet;
	this.bbox = new Asc.Range(c1, r1, c2, r2);
	//first last устарели, не убраны только для совместимости
	this.first = new CellAddress(this.bbox.r1, this.bbox.c1, 0);
	this.last = new CellAddress(this.bbox.r2, this.bbox.c2, 0);
};
Range.prototype.clone=function(){
	return new Range(this.worksheet, this.bbox.r1, this.bbox.c1, this.bbox.r2, this.bbox.c2);
}
Range.prototype.getFirst=function(){
	return this.first;
}
Range.prototype.getLast=function(){
	return this.last;
}
Range.prototype._foreach=function(action){
	if(null != action)
	{
		var oBBox = this.bbox;
		for(var i = oBBox.r1; i <= oBBox.r2; i++){
			for(var j = oBBox.c1; j <= oBBox.c2; j++){
				var oCurCell = this.worksheet._getCell(i, j);
				action(oCurCell, i, j, oBBox.r1, oBBox.c1);
			}
		}
	}
};
Range.prototype._foreachNoEmpty=function(action){
	if(null != action)
	{
		var oBBox = this.bbox, minC = Math.min( this.worksheet.getColsCount(), oBBox.c2 ), minR = Math.min( this.worksheet.getRowsCount(), oBBox.r2 );
		for(var i = oBBox.r1; i <= minR; i++){
			for(var j = oBBox.c1; j <= minC; j++){
				var oCurCell = this.worksheet._getCellNoEmpty(i, j);
				if(null != oCurCell)
				{
					var oRes = action(oCurCell, i, j, oBBox.r1, oBBox.c1);
					if(null != oRes)
						return oRes;
				}
			}
		}
	}
};
Range.prototype._foreachRow=function(actionRow, actionCell){
	var oBBox = this.bbox;
	for(var i = oBBox.r1; i <= oBBox.r2; i++){
		var row = this.worksheet._getRow(i);
		if(row)
		{
			if(null != actionRow)
				actionRow(row);
			if(null != actionCell)
			{
				for(var j in row.c){
					var oCurCell = row.c[j];
					if(null != oCurCell)
						actionCell(oCurCell, i, j - 0, oBBox.r1, oBBox.c1);
				}
			}
		}
	}
};
Range.prototype._foreachRowNoEmpty=function(actionRow, actionCell){
	var oBBox = this.bbox;
	if(0 == oBBox.r1 && gc_nMaxRow0 == oBBox.r2)
	{
		var aRows = this.worksheet._getRows();
		for(var i in aRows)
		{
			var row = aRows[i];
			if( null != actionRow )
			{
				var oRes = actionRow(row);
				if(null != oRes)
					return oRes;
			}
			if( null != actionCell )
				for(var j in row.c){
					var oCurCell = row.c[j];
					if(null != oCurCell)
					{
						var oRes = actionCell(oCurCell, i, j - 0, oBBox.r1, oBBox.c1);
						if(null != oRes)
							return oRes;
					}
				}
		}
	}
	else
	{
		var minR = Math.min(oBBox.r2,this.worksheet.getRowsCount());
		for(var i = oBBox.r1; i <= minR; i++){
			var row = this.worksheet._getRowNoEmpty(i);
			if(row)
			{
				if( null != actionRow )
				{
					var oRes = actionRow(row);
					if(null != oRes)
						return oRes;
				}
				if( null != actionCell )
					for(var j in row.c){
						var oCurCell = row.c[j];
						if(null != oCurCell)
						{
							var oRes = actionCell(oCurCell, i, j - 0, oBBox.r1, oBBox.c1);
							if(null != oRes)
								return oRes;
						}
					}
			}
		}
	}
};
Range.prototype._foreachCol=function(actionCol, actionCell){
	var oBBox = this.bbox;
	if(null != actionCol)
	{
		for(var i = oBBox.c1; i <= oBBox.c2; ++i)
		{
			var col = this.worksheet._getCol(i);
			if(null != col)
				actionCol(col);
		}
	}
	if(null != actionCell)
	{
		var nRangeType = this._getRangeType();
		var aRows = this.worksheet._getRows();
		for(var i in aRows)
		{
			var row = aRows[i];
			if(row)
			{
				if(0 == oBBox.c1 && gc_nMaxCol0 == oBBox.c2)
				{
					for(var j in row.c)
					{
						var oCurCell = row.c[j];
						if(null != oCurCell)
							actionCell(oCurCell, i - 0, j, oBBox.r1, oBBox.c1);
					}
				}
				else
				{
					for(var j = oBBox.c1; j <= oBBox.c2; ++j)
					{
						var oCurCell = row.c[j];
						if(null != oCurCell)
							actionCell(oCurCell, i - 0, j, oBBox.r1, oBBox.c1);
					}
				}
			}
		}
	}
};
Range.prototype._foreachColNoEmpty=function(actionCol, actionCell){
	var oBBox = this.bbox;
	var minC = Math.min( oBBox.c2,this.worksheet.getColsCount() );
	if(0 == oBBox.c1 && gc_nMaxCol0 == oBBox.c2)
	{
		if(null != actionCol)
		{
			var aCols = this.worksheet._getCols();
			for(var i in aCols)
			{
				var nIndex = i - 0;
				if(nIndex >= oBBox.c1 && nIndex <= minC )
				{
					var col = this.worksheet._getColNoEmpty(nIndex);
					if(null != col)
					{
						var oRes = actionCol(col);
						if(null != oRes)
							return oRes;
					}
				}
			}
		}
		if(null != actionCell)
		{
			var aRows = this.worksheet._getRows();
			for(var i in aRows)
			{
				var row = aRows[i];
				if(row)
				{
					for(var j in row.c)
					{
						var nIndex = j - 0;
						if(nIndex >= oBBox.c1 && nIndex <= minC)
						{
							var oCurCell = row.c[j];
							if(null != oCurCell)
							{
								var oRes = actionCell(oCurCell, i - 0, j, oBBox.r1, oBBox.c1);
								if(null != oRes)
									return oRes;
							}
						}
					}
				}
			}
		}
	}
	else
	{
		if(null != actionCol)
		{
			for(var i = oBBox.c1; i <= minC; ++i)
			{
				var col = this.worksheet._getColNoEmpty(i);
				if(null != col)
				{
					var oRes = actionCol(col);
					if(null != oRes)
						return oRes;
				}
			}
		}
		if(null != actionCell)
		{
			var aRows = this.worksheet._getRows();
			for(var i in aRows)
			{
				var row = aRows[i];
				if(row)
				{
					for(var j = oBBox.c1; j <= minC; ++j)
					{
						var oCurCell = row.c[j];
						if(null != oCurCell)
						{
							var oRes = actionCell(oCurCell, i - 0, j, oBBox.r1, oBBox.c1);
							if(null != oRes)
								return oRes;
						}
					}
				}
			}
		}
	}
};
Range.prototype._foreachIndex=function(action){
	var oBBox = this.bbox;
	for(var i = oBBox.r1; i <= oBBox.r2; i++){
		for(var j = oBBox.c1; j <= oBBox.c2; j++){
			var res = action(i, j);
			if(null != res)
				return res;
		}
	}
	return null;
};
Range.prototype._getRangeType=function(oBBox){
	if(null == oBBox)
		oBBox = this.bbox;
	if(oBBox.c1 == 0 && gc_nMaxCol0 == oBBox.c2 && oBBox.r1 == 0 && gc_nMaxRow0 == oBBox.r2)
		return c_oRangeType.All;
	if(oBBox.c1 == 0 && gc_nMaxCol0 == oBBox.c2)
		return c_oRangeType.Row;
	else if(oBBox.r1 == 0 && gc_nMaxRow0 == oBBox.r2)
		return c_oRangeType.Col;
	else
		return c_oRangeType.Range;
}
Range.prototype._setProperty=function(actionRow, actionCol, actionCell){
	var nRangeType = this._getRangeType();
	if(c_oRangeType.Range == nRangeType)
		this._foreach(actionCell);
	else if(c_oRangeType.Row == nRangeType)
		this._foreachRow(actionRow, actionCell);
	else if(c_oRangeType.Col == nRangeType)
		this._foreachCol(actionCol, actionCell);
	else
	{
		//сюда не должны заходить вообще
		// this._foreachRow(actionRow, actionCell);
		// if(null != actionCol)
			// this._foreachCol(actionCol, null);
	}
}
Range.prototype._setPropertyNoEmpty=function(actionRow, actionCol, actionCell){
	var nRangeType = this._getRangeType();
	if(c_oRangeType.Range == nRangeType)
		this._foreachNoEmpty(actionCell);
	else if(c_oRangeType.Row == nRangeType)
		this._foreachRowNoEmpty(actionRow, actionCell);
	else if(c_oRangeType.Col == nRangeType)
		this._foreachColNoEmpty(actionCol, actionCell);
	else
	{
		this._foreachRowNoEmpty(actionRow, actionCell);
		if(null != actionCol)
			this._foreachColNoEmpty(actionCol, null);
	}
}
Range.prototype.containCell=function(cellId){
	var cellAddress = cellId;
	return 	cellAddress.getRow0() >= this.bbox.r1 && cellAddress.getCol0() >= this.bbox.c1 &&
			cellAddress.getRow0() <= this.bbox.r2 && cellAddress.getCol0() <= this.bbox.c2;
}
Range.prototype.cross = function(cellAddress){

	if( cellAddress.getRow0() >= this.bbox.r1 && cellAddress.getRow0() <= this.bbox.r2 && this.bbox.c1 == this.bbox.c2)
		return {r:cellAddress.getRow()};
	if( cellAddress.getCol0() >= this.bbox.c1 && cellAddress.getCol0() <= this.bbox.c2 && this.bbox.r1 == this.bbox.r2)
		return {c:cellAddress.getCol()};

	return undefined;
}
Range.prototype.getWorksheet=function(){
	return this.worksheet;
};
Range.prototype.isFormula = function(){
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	return cell.isFormula();
}
Range.prototype.isOneCell=function(){
	var oBBox = this.bbox;
	return oBBox.r1 == oBBox.r2 && oBBox.c1 == oBBox.c2;
}
Range.prototype.isColumn = function(){
	if(this.first.getRow() == 1 && this.last.getRow() == gc_nMaxRow)
		return true;
	else
		return false;
}
Range.prototype.isRow = function(){
	if(this.first.getCol() == 1 && this.last.getCol() == gc_nMaxCol)
		return true;
	else
		return false;
}
Range.prototype.getBBox=function(){
	//1 - based
	return {r1: this.bbox.r1 + 1, r2: this.bbox.r2 + 1, c1: this.bbox.c1 + 1, c2: this.bbox.c2 + 1};
};
Range.prototype.getBBox0=function(){
	//0 - based
	return this.bbox;
};
Range.prototype.getName=function(){
	var first = this.getFirst();
	var sRes = first.getID();
	if(false == this.isOneCell())
	{
		var last = this.getLast();
		sRes = sRes + ":" + last.getID();
	}
	return sRes;
};
Range.prototype.getCells=function(){
	var aResult = new Array();
	var oBBox = this.bbox;
	if(!((0 == oBBox.c1 && gc_nMaxCol0 == oBBox.c2) || (0 == oBBox.r1 && gc_nMaxRow0 == oBBox.r2)))
	{
		for(var i = oBBox.r1; i <= oBBox.r2; i++){
			for(var j = oBBox.c1; j <= oBBox.c2; j++){
				aResult.push(this.worksheet._getCell(i, j));
			}
		}
	}
	return aResult;
};
Range.prototype.setValue=function(val,callback){
	History.Create_NewPoint();
	var oBBox = this.bbox;
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	History.StartTransaction();
	var oThis = this;
	this._foreach(function(cell){
		cell.setValue(val,callback);
		// if(cell.isEmpty())
			// cell.Remove();
	});
	History.EndTransaction();
};
Range.prototype.setValue2=function(array){
	History.Create_NewPoint();
	var oBBox = this.bbox;
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	History.StartTransaction();
	var wb = this.worksheet.workbook, ws = this.worksheet, needRecalc = false, ar =[];
	//[{"text":"qwe","format":{"b":true, "i":false, "u":"none", "s":false, "fn":"Arial", "fs": 12, "c": 0xff00ff, "va": "subscript"  }},{}...]
	var oThis = this;
	/*
		Устанавливаем значение в Range ячеек. В отличае от setValue, сюда мы попадаем только в случае ввода значения отличного от формулы. Таким образом, если в ячейке была формула, то для нее в графе очищается список ячеек от которых зависела. После чего выставляем флаг о необходимости пересчета.
	*/
	this._foreach(function(cell){
		cell.setValue2(array);
		// if(cell.isEmpty())
			// cell.Remove();
	});
	History.EndTransaction();
};
Range.prototype.setNumFormat=function(val){
	History.Create_NewPoint();
	var oBBox = this.bbox;
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	this.createCellOnRowColCross();
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		this.worksheet.getAllCol().setNumFormat(val);
		fSetProperty = this._setPropertyNoEmpty;
	}
	fSetProperty.call(this, function(row){
		if(c_oRangeType.All == nRangeType && null == row.xfs)
			return;
		row.setNumFormat(val);
	},
	function(col){
		col.setNumFormat(val);
	},
	function(cell){
		cell.setNumFormat(val);
	});
};
Range.prototype.shiftNumFormat=function(nShift, aDigitsCount){
	History.Create_NewPoint();
	var oBBox = this.bbox;
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	var bRes = false;
	var oThis = this;
	this._setPropertyNoEmpty(null, null, function(cell, nRow0, nCol0, nRowStart, nColStart){
		bRes |= cell.shiftNumFormat(nShift, aDigitsCount[nCol0 - nColStart] || 8);
	});
	return bRes;
}
Range.prototype.setFontname=function(val){
	History.Create_NewPoint();
	var oBBox = this.bbox;
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	this.createCellOnRowColCross();
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		this.worksheet.getAllCol().setFontname(val);
		fSetProperty = this._setPropertyNoEmpty;
	}
	fSetProperty.call(this, function(row){
		if(c_oRangeType.All == nRangeType && null == row.xfs)
			return;
		row.setFontname(val);
	},
	function(col){
		col.setFontname(val);
	},
	function(cell){
		cell.setFontname(val);
	});
};
Range.prototype.setFontsize=function(val){
	History.Create_NewPoint();
	var oBBox = this.bbox;
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	this.createCellOnRowColCross();
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		this.worksheet.getAllCol().setFontsize(val);
		fSetProperty = this._setPropertyNoEmpty;
	}
	fSetProperty.call(this, function(row){
		if(c_oRangeType.All == nRangeType && null == row.xfs)
			return;
		row.setFontsize(val);
	},
	function(col){
		col.setFontsize(val);
	},
	function(cell){
		cell.setFontsize(val);
	});
};
Range.prototype.setFontcolor=function(val){
	History.Create_NewPoint();
	var oBBox = this.bbox;
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	this.createCellOnRowColCross();
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		this.worksheet.getAllCol().setFontcolor(val);
		fSetProperty = this._setPropertyNoEmpty;
	}
	fSetProperty.call(this, function(row){
		if(c_oRangeType.All == nRangeType && null == row.xfs)
			return;
		row.setFontcolor(val);
	},
	function(col){
		col.setFontcolor(val);
	},
	function(cell){
		cell.setFontcolor(val);
	});
};
Range.prototype.setBold=function(val){
	History.Create_NewPoint();
	var oBBox = this.bbox;
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	this.createCellOnRowColCross();
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		this.worksheet.getAllCol().setBold(val);
		fSetProperty = this._setPropertyNoEmpty;
	}
	fSetProperty.call(this, function(row){
		if(c_oRangeType.All == nRangeType && null == row.xfs)
			return;
		row.setBold(val);
	},
	function(col){
		col.setBold(val);
	},
	function(cell){
		cell.setBold(val);
	});
};
Range.prototype.setItalic=function(val){
	History.Create_NewPoint();
	var oBBox = this.bbox;
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	this.createCellOnRowColCross();
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		this.worksheet.getAllCol().setItalic(val);
		fSetProperty = this._setPropertyNoEmpty;
	}
	fSetProperty.call(this, function(row){
		if(c_oRangeType.All == nRangeType && null == row.xfs)
			return;
		row.setItalic(val);
	},
	function(col){
		col.setItalic(val);
	},
	function(cell){
		cell.setItalic(val);
	});
};
Range.prototype.setUnderline=function(val){
	History.Create_NewPoint();
	var oBBox = this.bbox;
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	this.createCellOnRowColCross();
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		this.worksheet.getAllCol().setUnderline(val);
		fSetProperty = this._setPropertyNoEmpty;
	}
	fSetProperty.call(this, function(row){
		if(c_oRangeType.All == nRangeType && null == row.xfs)
			return;
		row.setUnderline(val);
	},
	function(col){
		col.setUnderline(val);
	},
	function(cell){
		cell.setUnderline(val);
	});
};
Range.prototype.setStrikeout=function(val){
	History.Create_NewPoint();
	var oBBox = this.bbox;
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	this.createCellOnRowColCross();
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		this.worksheet.getAllCol().setStrikeout(val);
		fSetProperty = this._setPropertyNoEmpty;
	}
	fSetProperty.call(this, function(row){
		if(c_oRangeType.All == nRangeType && null == row.xfs)
			return;
		row.setStrikeout(val);
	},
	function(col){
		col.setStrikeout(val);
	},
	function(cell){
		cell.setStrikeout(val);
	});
};
Range.prototype.setFontAlign=function(val){
	History.Create_NewPoint();
	var oBBox = this.bbox;
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	this.createCellOnRowColCross();
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		this.worksheet.getAllCol().setFontAlign(val);
		fSetProperty = this._setPropertyNoEmpty;
	}
	fSetProperty.call(this, function(row){
		if(c_oRangeType.All == nRangeType && null == row.xfs)
			return;
		row.setFontAlign(val);
	},
	function(col){
		col.setFontAlign(val);
	},
	function(cell){
		cell.setFontAlign(val);
	});
};
Range.prototype.setAlignVertical=function(val){
	History.Create_NewPoint();
	var oBBox = this.bbox;
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	if("none" == val)
		val = null;
	this.createCellOnRowColCross();
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		this.worksheet.getAllCol().setAlignVertical(val);
		fSetProperty = this._setPropertyNoEmpty;
	}
	fSetProperty.call(this, function(row){
		if(c_oRangeType.All == nRangeType && null == row.xfs)
			return;
		row.setAlignVertical(val);
	},
	function(col){
		col.setAlignVertical(val);
	},
	function(cell){
		cell.setAlignVertical(val);
	});
};
Range.prototype.setAlignHorizontal=function(val){
	History.Create_NewPoint();
	var oBBox = this.bbox;
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	this.createCellOnRowColCross();
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		this.worksheet.getAllCol().setAlignHorizontal(val);
		fSetProperty = this._setPropertyNoEmpty;
	}
	fSetProperty.call(this, function(row){
		if(c_oRangeType.All == nRangeType && null == row.xfs)
			return;
		row.setAlignHorizontal(val);
	},
	function(col){
		col.setAlignHorizontal(val);
	},
	function(cell){
		cell.setAlignHorizontal(val);
	});
};
Range.prototype.setFill=function(val){
	History.Create_NewPoint();
	var oBBox = this.bbox;
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	this.createCellOnRowColCross();
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		this.worksheet.getAllCol().setFill(val);
		fSetProperty = this._setPropertyNoEmpty;
	}
	fSetProperty.call(this, function(row){
		if(c_oRangeType.All == nRangeType && null == row.xfs)
			return;
		row.setFill(val);
	},
	function(col){
		col.setFill(val);
	},
	function(cell){
		cell.setFill(val);
	});
};
Range.prototype.setBorderSrc=function(val){
	History.Create_NewPoint();
	var oBBox = this.bbox;
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	History.StartTransaction();
	var oNewBorder = new Border();
	oNewBorder.set(val);
	this.createCellOnRowColCross();
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		this.worksheet.getAllCol().setBorder(oNewBorder.clone());
		fSetProperty = this._setPropertyNoEmpty;
	}
	fSetProperty.call(this, function(row){
		if(c_oRangeType.All == nRangeType && null == row.xfs)
			return;
		row.setBorder(oNewBorder.clone());
	},
	function(col){
		col.setBorder(oNewBorder.clone());
	},
	function(cell){
		cell.setBorder(oNewBorder.clone());
	});
	History.EndTransaction();
}
Range.prototype.setBorder=function(border){
	History.Create_NewPoint();
	//border = null очисть border
	//border: {"l": {"s": "solid", "c": 0xff0000}, "t": {} ,"r": {} ,"b": {} ,"ih": {},"iv": {}"d": {},"dd": false ,"du": false }
	//"ih" - внутренние горизонтальные, "iv" - внутренние вертикальные
	var oBBox = this.bbox;
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	var nRangeType = this._getRangeType();
	var oThis = this;
	var fSetBorder = function(nRow, nCol, oNewBorder)
	{
		if(null == oNewBorder)
		{
			var cell = oThis.worksheet._getCellNoEmpty(nRow, nCol);
			if(null != cell)
				cell.setBorder(oNewBorder);
		}
		else
		{
			if(oNewBorder.isEqual(g_oDefaultBorderAbs))
				return;
			var _cell = oThis.worksheet.getCell(new CellAddress(nRow, nCol, 0));
			var oCurBorder = _cell.getBorderSrc().clone();
			oCurBorder.merge(oNewBorder);
			var cell = oThis.worksheet._getCell(nRow, nCol);
			cell.setBorder(oCurBorder);
		}
	};
	var fSetBorderRowCol = function(rowcol, oNewBorder)
	{
		if(null == oNewBorder)
			rowcol.setBorder(null);
		else
		{
			if(oNewBorder.isEqual(g_oDefaultBorderAbs))
				return;
			var oCurBorder;
			if(null != rowcol.xfs && null != rowcol.xfs.border)
				oCurBorder = rowcol.xfs.border.clone();
			else
				oCurBorder = new Border();
			oCurBorder.merge(oNewBorder);
            rowcol.setBorder(oNewBorder);
		}
	};
	var nEdgeTypeLeft = 1;
	var nEdgeTypeTop = 2;
	var nEdgeTypeRight = 3;
	var nEdgeTypeBottom = 4;
	var fSetBorderEdge = function(nRow, nCol, oNewBorder, type)
	{
		var _cell = oThis.worksheet.getCell(new CellAddress(nRow, nCol, 0));
		var oCurBorder = _cell.getBorderSrc().clone();
		var oCurBorderProp;
		var oNewBorderProp = null;
		if(null == oNewBorder)
			oNewBorderProp = new BorderProp();
		switch(type)
		{
			case nEdgeTypeLeft:
				oCurBorderProp = oCurBorder.r;
				if(null != oNewBorder)
					oNewBorderProp = oNewBorder.l;
				break;
			case nEdgeTypeTop:
				oCurBorderProp = oCurBorder.b;
				if(null != oNewBorder)
					oNewBorderProp = oNewBorder.t;
				break;
			case nEdgeTypeRight:
				oCurBorderProp = oCurBorder.l;
				if(null != oNewBorder)
					oNewBorderProp = oNewBorder.r;
				break;
			case nEdgeTypeBottom:
				oCurBorderProp = oCurBorder.t;
				if(null != oNewBorder)
					oNewBorderProp = oNewBorder.b;
				break;
		}
		if(null != oNewBorderProp && null != oCurBorderProp && null != oCurBorderProp.s && (oNewBorderProp.s != oCurBorderProp.s || oNewBorderProp.c != oCurBorderProp.c)){
			switch(type)
			{
				case nEdgeTypeLeft: oCurBorder.r = new BorderProp(); break;
				case nEdgeTypeTop: oCurBorder.b = new BorderProp(); break;
				case nEdgeTypeRight: oCurBorder.l = new BorderProp(); break;
				case nEdgeTypeBottom: oCurBorder.t = new BorderProp(); break;
			}
			var cell = oThis.worksheet._getCell(nRow, nCol);
			cell.setBorder(oCurBorder);
		}
	};
	var fSetBorderRowColEdge = function(rowcol, oNewBorder, type)
	{
		if(null != rowcol.xfs && null != rowcol.xfs.border)
		{
			var oCurBorder = rowcol.xfs.border.clone();
			var oCurBorderProp;
			var oNewBorderProp;
			if(null == oNewBorder)
				oNewBorderProp = new BorderProp();
			switch(type)
			{
				case nEdgeTypeLeft:
					oCurBorderProp = oCurBorder.r;
					if(null != oNewBorder)
						oNewBorderProp = oNewBorder.l;
					break;
				case nEdgeTypeTop:
					oCurBorderProp = oCurBorder.b;
					if(null != oNewBorder)
						oNewBorderProp = oNewBorder.t;
					break;
				case nEdgeTypeRight:
					oCurBorderProp = oCurBorder.l;
					if(null != oNewBorder)
						oNewBorderProp = oNewBorder.r;
					break;
				case nEdgeTypeBottom:
					oCurBorderProp = oCurBorder.t;
					if(null != oNewBorder)
						oNewBorderProp = oNewBorder.b;
					break;
			}
			if(null != oNewBorderProp && null != oCurBorderProp && (oNewBorderProp.s != oCurBorderProp.s || oNewBorderProp.c != oCurBorderProp.c)){
				switch(type)
				{
					case nEdgeTypeLeft: oCurBorder.r = new BorderProp(); break;
					case nEdgeTypeTop: oCurBorder.b = new BorderProp(); break;
					case nEdgeTypeRight: oCurBorder.l = new BorderProp(); break;
					case nEdgeTypeBottom: oCurBorder.t = new BorderProp(); break;
				}
				rowcol.setBorder(oCurBorder);
			}
		}
	};
	var oAddBorder = new Border();
	oAddBorder.set(border);
	if(oAddBorder.isEqual(g_oDefaultBorderAbs))
		oAddBorder = null;
	if(nRangeType == c_oRangeType.Col)
	{
		var oLeftOuter = null;
		var oLeftInner = null;
		var oInner = null;
		var oRightInner = null;
		var oRightOuter = null;
		var nWidth = oBBox.c2 - oBBox.c1 + 1;
		if(null != oAddBorder)
		{
			if(oBBox.c1 > 0 && null != oAddBorder.l)
			{
				oLeftOuter = new Border();
				oLeftOuter.l = oAddBorder.l;
			}
			if(oBBox.c2 < gc_nMaxCol0 && null != oAddBorder.r)
			{
				oRightOuter = new Border();
				oRightOuter.r = oAddBorder.r;
			}
			oLeftInner = new Border();
			oLeftInner.l = oAddBorder.l;
			oLeftInner.t = oAddBorder.ih;
			if(nWidth > 1)
				oLeftInner.r = oAddBorder.iv;
			else
				oLeftInner.r = oAddBorder.r;
			oLeftInner.b = oAddBorder.ih;
			oLeftInner.d = oAddBorder.d;
			oLeftInner.dd = oAddBorder.dd;
			oLeftInner.du = oAddBorder.du;
			if(oLeftInner.isEqual(g_oDefaultBorderAbs))
				oLeftInner = null;
			if(nWidth > 1)
			{
				oRightInner = new Border();
				oRightInner.l = oAddBorder.iv;
				oRightInner.t = oAddBorder.ih;
				oRightInner.r = oAddBorder.r;
				oRightInner.b = oAddBorder.ih;
				oRightInner.d = oAddBorder.d;
				oRightInner.dd = oAddBorder.dd;
				oRightInner.du = oAddBorder.du;
				if(oRightInner.isEqual(g_oDefaultBorderAbs))
					oRightInner = null;
			}
			if(nWidth > 2)
			{
				oInner = new Border();
				oInner.l = oAddBorder.iv;
				oInner.t = oAddBorder.ih;
				oInner.r = oAddBorder.iv;
				oInner.b = oAddBorder.ih;
				oInner.d = oAddBorder.d;
				oInner.dd = oAddBorder.dd;
				oInner.du = oAddBorder.du;
				if(oInner.isEqual(g_oDefaultBorderAbs))
					oInner = null;
			}
		}
		//oLeftOuter
		if(oBBox.c1 > 0)
		{
			var oTempRange = this.worksheet.getRange(new CellAddress(0, oBBox.c1 - 1, 0), new CellAddress(gc_nMaxRow0, oBBox.c1 - 1, 0));
			oTempRange._foreachColNoEmpty(function(col){
				if(null != col.xfs)
					fSetBorderRowColEdge(col, oLeftOuter, nEdgeTypeLeft);
			},
			function(cell, nRow, nCol, nRowStart, nColStart){
				fSetBorderEdge(nRow, nCol ,oLeftOuter, nEdgeTypeLeft);
			});
		}
		//oLeftInner
		var oTempRange = this.worksheet.getRange(new CellAddress(0, oBBox.c1, 0), new CellAddress(gc_nMaxRow0, oBBox.c1, 0));
		oTempRange._foreachCol(function(col){
			fSetBorderRowCol(col, oLeftInner);
		},
		function(cell, nRow, nCol, nRowStart, nColStart){
			fSetBorder(nRow, nCol ,oLeftInner);
		});
		//oInner
		if(nWidth > 2)
		{
			var oTempRange = this.worksheet.getRange(new CellAddress(0, oBBox.c1 + 1, 0), new CellAddress(gc_nMaxRow0, oBBox.c2 - 1, 0));
			oTempRange._foreachCol(function(col){
				fSetBorderRowCol(col, oInner);
			},
			function(cell, nRow, nCol, nRowStart, nColStart){
				fSetBorder(nRow, nCol ,oInner);
			});
		}
		//oRightInner
		if(nWidth > 1)
		{
			var oTempRange = this.worksheet.getRange(new CellAddress(0, oBBox.c2, 0), new CellAddress(gc_nMaxRow0, oBBox.c2, 0));
			oTempRange._foreachCol(function(col){
				fSetBorderRowCol(col, oRightInner);
			},
			function(cell, nRow, nCol, nRowStart, nColStart){
				fSetBorder(nRow, nCol ,oRightInner);
			});
		}
		//oRightOuter
		if(oBBox.c2 < gc_nMaxCol0)
		{
			var oTempRange = this.worksheet.getRange(new CellAddress(0, oBBox.c2 + 1, 0), new CellAddress(gc_nMaxRow0, oBBox.c2 + 1, 0));
			oTempRange._foreachColNoEmpty(function(col){
				if(null != col.xfs)
					fSetBorderRowColEdge(col, oRightOuter, nEdgeTypeRight);
			},
			function(cell, nRow, nCol, nRowStart, nColStart){
				fSetBorderEdge(nRow, nCol ,oRightOuter, nEdgeTypeRight);
			});
		}
	}
	else if(nRangeType == c_oRangeType.Row)
	{
		var oTopOuter = null;
		var oTopInner = null;
		var oInner = null;
		var oBottomInner = null;
		var oBottomOuter = null;
		var nHeight = oBBox.r2 - oBBox.r1 + 1;
		if(null != oAddBorder)
		{
			if(oBBox.r1 > 0 && null != oAddBorder.t)
			{
				oTopOuter = new Border();
				oTopOuter.t = oAddBorder.t;
			}
			if(oBBox.r2 < gc_nMaxRow0 && null != oAddBorder.b)
			{
				oBottomOuter = new Border();
				oBottomOuter.b = oAddBorder.b;
			}
			oTopInner = new Border();
			oTopInner.l = oAddBorder.iv;
			oTopInner.t = oAddBorder.t;
			oTopInner.r = oAddBorder.iv;
			if(nHeight > 1)
				oTopInner.b = oAddBorder.ih;
			else
				oTopInner.b = oAddBorder.b;
			oTopInner.d = oAddBorder.d;
			oTopInner.dd = oAddBorder.dd;
			oTopInner.du = oAddBorder.du;
			if(oTopInner.isEqual(g_oDefaultBorderAbs))
				oTopInner = null;
			if(nHeight > 1)
			{
				oBottomInner = new Border();
				oBottomInner.l = oAddBorder.iv;
				oBottomInner.t = oAddBorder.ih;
				oBottomInner.r = oAddBorder.iv;
				oBottomInner.b = oAddBorder.b;
				oBottomInner.d = oAddBorder.d;
				oBottomInner.dd = oAddBorder.dd;
				oBottomInner.du = oAddBorder.du;
				if(oBottomInner.isEqual(g_oDefaultBorderAbs))
					oBottomInner = null;
			}
			if(nHeight > 2)
			{
				oInner = new Border();
				oInner.l = oAddBorder.iv;
				oInner.t = oAddBorder.ih;
				oInner.r = oAddBorder.iv;
				oInner.b = oAddBorder.ih;
				oInner.d = oAddBorder.d;
				oInner.dd = oAddBorder.dd;
				oInner.du = oAddBorder.du;
				if(oInner.isEqual(g_oDefaultBorderAbs))
					oInner = null;
			}
		}
		//oTopOuter
		if(oBBox.r1 > 0)
		{
			var oTempRange = this.worksheet.getRange(new CellAddress(oBBox.r1 - 1, 0, 0), new CellAddress(oBBox.r1 - 1, gc_nMaxCol0, 0));
			oTempRange._foreachRowNoEmpty(function(row){
				if(null != row.xfs)
					fSetBorderRowColEdge(row, oTopOuter, nEdgeTypeTop);
			},
			function(cell, nRow, nCol, nRowStart, nColStart){
				fSetBorderEdge(nRow, nCol ,oTopOuter, nEdgeTypeTop);
			});
		}
		//oTopInner
		var oTempRange = this.worksheet.getRange(new CellAddress(oBBox.r1, 0, 0), new CellAddress(oBBox.r1, gc_nMaxCol0, 0));
		oTempRange._foreachRow(function(row){
			fSetBorderRowCol(row, oTopInner);
		},
		function(cell, nRow, nCol, nRowStart, nColStart){
			fSetBorder(nRow, nCol ,oTopInner);
		});
		//oInner
		if(nHeight > 2)
		{
			var oTempRange = this.worksheet.getRange(new CellAddress(oBBox.r1 + 1, 0, 0), new CellAddress(oBBox.r2 - 1, gc_nMaxCol0, 0));
			oTempRange._foreachRow(function(row){
				fSetBorderRowCol(row, oInner);
			},
			function(cell, nRow, nCol, nRowStart, nColStart){
				fSetBorder(nRow, nCol ,oInner);
			});
		}
		//oBottomInner
		if(nHeight > 1)
		{
			var oTempRange = this.worksheet.getRange(new CellAddress(oBBox.r2, 0, 0), new CellAddress(oBBox.r2, gc_nMaxCol0, 0));
			oTempRange._foreachRow(function(row){
				fSetBorderRowCol(row, oBottomInner);
			},
			function(cell, nRow, nCol, nRowStart, nColStart){
				fSetBorder(nRow, nCol ,oBottomInner);
			});
		}
		//oBottomOuter
		if(oBBox.r2 < gc_nMaxRow0)
		{
			var oTempRange = this.worksheet.getRange(new CellAddress(oBBox.r2 + 1, 0, 0), new CellAddress(oBBox.r2 + 1, gc_nMaxCol0, 0));
			oTempRange._foreachRowNoEmpty(function(row){
				if(null != row.xfs)
					fSetBorderRowColEdge(row, oBottomOuter, nEdgeTypeBottom);
			},
			function(cell, nRow, nCol, nRowStart, nColStart){
				fSetBorderEdge(nRow, nCol ,oBottomOuter, nEdgeTypeBottom);
			});
		}
	}
	else if(nRangeType == c_oRangeType.Range)
	{
		var bLeftBorder = false;
		var bTopBorder = false;
		var bRightBorder = false;
		var bBottomBorder = false;
		if(null == oAddBorder){
			this._foreachNoEmpty(function(cell){
				cell.setBorder(oAddBorder);
			});
			bLeftBorder = true;
			bTopBorder = true;
			bRightBorder = true;
			bBottomBorder = true;
		}
		else{
			bLeftBorder = null != oAddBorder.l;
			bTopBorder = null != oAddBorder.t;
			bRightBorder = null != oAddBorder.r;
			bBottomBorder = null != oAddBorder.b;
			var bInnerHBorder = null != oAddBorder.ih;
			var bInnerVBorder = null != oAddBorder.iv;
			var bDiagonal = null != oAddBorder.d;
			if(oBBox.c1 == oBBox.c2 && oBBox.r1 == oBBox.r2){
				//Если ячейка одна
				fSetBorder(oBBox.r1, oBBox.c1, oAddBorder);
			}
			else{
				//бордеры угловых ячеек
				if(oBBox.c1 == oBBox.c2){
					if(bLeftBorder || bTopBorder || bRightBorder || bInnerHBorder || bDiagonal){
						var oLTBorder = new Border();
						oLTBorder.l = oAddBorder.l;
						oLTBorder.t = oAddBorder.t;
						oLTBorder.r = oAddBorder.r;
						oLTBorder.b = oAddBorder.ih;
						oLTBorder.d = oAddBorder.d;
						oLTBorder.dd = oAddBorder.dd;
						oLTBorder.du = oAddBorder.du;
						fSetBorder(oBBox.r1, oBBox.c1, oLTBorder);
					}
					if(bLeftBorder || bBottomBorder || bRightBorder || bInnerHBorder || bDiagonal){
						var oLBBorder = new Border();
						oLBBorder.l = oAddBorder.l;
						oLBBorder.t = oAddBorder.ih;
						oLBBorder.r = oAddBorder.r;
						oLBBorder.b = oAddBorder.b;
						oLBBorder.d = oAddBorder.d;
						oLBBorder.dd = oAddBorder.dd;
						oLBBorder.du = oAddBorder.du;
						fSetBorder(oBBox.r2, oBBox.c1, oLBBorder);
					}
				}
				else{
					if(bLeftBorder || bTopBorder || bInnerVBorder || (oBBox.r1 == oBBox.r2 ? bBottomBorder : bInnerHBorder) || bDiagonal){
						var oLTBorder = new Border();
						oLTBorder.l = oAddBorder.l;
						oLTBorder.t = oAddBorder.t;
						oLTBorder.r = oAddBorder.iv;
						if(oBBox.r1 == oBBox.r2)
							oLTBorder.b = oAddBorder.b;
						else
							oLTBorder.b = oAddBorder.ih;
						oLTBorder.d = oAddBorder.d;
						oLTBorder.dd = oAddBorder.dd;
						oLTBorder.du = oAddBorder.du;
						fSetBorder(oBBox.r1, oBBox.c1, oLTBorder);
					}
					if(oBBox.r1 != oBBox.r2 && (bLeftBorder || bInnerVBorder || bInnerHBorder || bBottomBorder || bDiagonal)){
						var oLBBorder = new Border();
						oLBBorder.l = oAddBorder.l;
						oLBBorder.t = oAddBorder.ih;
						oLBBorder.r = oAddBorder.iv;
						oLBBorder.b = oAddBorder.b;
						oLBBorder.d = oAddBorder.d;
						oLBBorder.dd = oAddBorder.dd;
						oLBBorder.du = oAddBorder.du;
						fSetBorder(oBBox.r2, oBBox.c1, oLBBorder);
					}
					if(bRightBorder || bTopBorder || bInnerVBorder || (oBBox.r1 == oBBox.r2 ? bBottomBorder : bInnerHBorder) || bDiagonal){
						var oRTBorder = new Border();
						oRTBorder.l = oAddBorder.iv;
						oRTBorder.t = oAddBorder.t;
						oRTBorder.r = oAddBorder.r;
						if(oBBox.r1 == oBBox.r2)
							oRTBorder.b = oAddBorder.b;
						else
							oRTBorder.b = oAddBorder.ih;
						oRTBorder.d = oAddBorder.d;
						oRTBorder.dd = oAddBorder.dd;
						oRTBorder.du = oAddBorder.du;
						fSetBorder(oBBox.r1, oBBox.c2, oRTBorder);
					}
					if(oBBox.r1 != oBBox.r2 && (bRightBorder || bInnerHBorder || bInnerVBorder || bBottomBorder || bDiagonal) ){
						var oRBBorder = new Border();
						oRBBorder.l = oAddBorder.iv;
						oRBBorder.t = oAddBorder.ih;
						oRBBorder.r = oAddBorder.r;
						oRBBorder.b = oAddBorder.b;
						oRBBorder.d = oAddBorder.d;
						oRBBorder.dd = oAddBorder.dd;
						oRBBorder.du = oAddBorder.du;
						fSetBorder(oBBox.r2, oBBox.c2, oRBBorder);
					}
				}
				//граничные бордеры
				if(bTopBorder || bInnerVBorder || (oBBox.r1 == oBBox.r2 ? bBottomBorder : bInnerHBorder) || bDiagonal){
					for(var  i = oBBox.c1 + 1 ; i < oBBox.c2; i++){
						var oTopBorder = new Border();
						oTopBorder.l = oAddBorder.iv;
						oTopBorder.t = oAddBorder.t;
						oTopBorder.r = oAddBorder.iv;
						if(oBBox.r1 == oBBox.r2)
							oTopBorder.b = oAddBorder.b;
						else
							oTopBorder.b = oAddBorder.ih;
						oTopBorder.d = oAddBorder.d;
						oTopBorder.dd = oAddBorder.dd;
						oTopBorder.du = oAddBorder.du;
						fSetBorder(oBBox.r1, i, oTopBorder);
					}
				}
				if(oBBox.r1 != oBBox.r2 && (bBottomBorder || bInnerVBorder || bInnerHBorder || bDiagonal)){
					for(var  i = oBBox.c1 + 1 ; i < oBBox.c2; i++){
						var oBottomBorder = new Border();
						oBottomBorder.l = oAddBorder.iv;
						oBottomBorder.t = oAddBorder.ih;
						oBottomBorder.r = oAddBorder.iv;
						oBottomBorder.b = oAddBorder.b;
						oBottomBorder.d = oAddBorder.d;
						oBottomBorder.dd = oAddBorder.dd;
						oBottomBorder.du = oAddBorder.du;
						fSetBorder(oBBox.r2, i, oBottomBorder);
					}
				}
				if(bLeftBorder || bInnerHBorder || (oBBox.c1 == oBBox.c2 ? bRightBorder : bInnerVBorder) || bDiagonal){
					for(var  i = oBBox.r1 + 1 ; i < oBBox.r2; i++){
						var oLeftBorder = new Border();
						oLeftBorder.l = oAddBorder.l;
						oLeftBorder.t = oAddBorder.ih;
						if(oBBox.c1 == oBBox.c2)
							oLeftBorder.r = oAddBorder.r;
						else
							oLeftBorder.r = oAddBorder.iv;
						oLeftBorder.b = oAddBorder.ih;
						oLeftBorder.d = oAddBorder.d;
						oLeftBorder.dd = oAddBorder.dd;
						oLeftBorder.du = oAddBorder.du;
						fSetBorder(i, oBBox.c1, oLeftBorder);
					}
				}
				if(oBBox.c1 != oBBox.c2 && (bRightBorder || bInnerVBorder || bInnerHBorder || bDiagonal)){
					for(var  i = oBBox.r1 + 1 ; i < oBBox.r2; i++){
						var oRightBorder = new Border();
						oRightBorder.l = oAddBorder.iv;
						oRightBorder.t = oAddBorder.ih;
						oRightBorder.r = oAddBorder.r;
						oRightBorder.b = oAddBorder.ih;
						oRightBorder.d = oAddBorder.d;
						oRightBorder.dd = oAddBorder.dd;
						oRightBorder.du = oAddBorder.du;
						fSetBorder(i, oBBox.c2, oRightBorder);
					}
				}
				//Внутренние границы
				if(bInnerHBorder || bInnerVBorder || bDiagonal){
					for(var  i = oBBox.r1 + 1 ; i < oBBox.r2; i++){
						for(var  j = oBBox.c1 + 1 ; j < oBBox.c2; j++){
							var oInnerBorder = new Border();
							oInnerBorder.l = oAddBorder.iv;
							oInnerBorder.t = oAddBorder.ih;
							oInnerBorder.r = oAddBorder.iv;
							oInnerBorder.b = oAddBorder.ih;
							oInnerBorder.d = oAddBorder.d;
							oInnerBorder.dd = oAddBorder.dd;
							oInnerBorder.du = oAddBorder.du;
							fSetBorder(i, j, oInnerBorder);
						}
					}
				}
			}
		}
		//для граничных ячеек стираем border
		if(bLeftBorder && oBBox.c1 > 0){
			var nCol = oBBox.c1 - 1;
			for(var  i = oBBox.r1 ; i <= oBBox.r2; i++)
				fSetBorderEdge(i, nCol, oAddBorder, nEdgeTypeLeft);
		}
		if(bTopBorder && oBBox.r1 > 0){
			var nRow = oBBox.r1 - 1;
			for(var  i = oBBox.c1 ; i <= oBBox.c2; i++)
				fSetBorderEdge(nRow, i, oAddBorder, nEdgeTypeTop);
		}
		if(bRightBorder && oBBox.c2 + 1 < this.worksheet.getColsCount()){
			var nCol = oBBox.c2 + 1;
			for(var  i = oBBox.r1 ; i <= oBBox.r2; i++)
				fSetBorderEdge(i, nCol, oAddBorder, nEdgeTypeRight);
		}
		if(bBottomBorder && oBBox.r2 + 1 < this.worksheet.getRowsCount()){
			var nRow = oBBox.r2 + 1;
			for(var  i = oBBox.c1 ; i <= oBBox.c2; i++)
				fSetBorderEdge(nRow, i, oAddBorder, nEdgeTypeBottom);
		}
	}
	else
	{
		this.worksheet.getAllCol().setBorder(oAddBorder);
		this._setPropertyNoEmpty(function(row){
			row.setBorder(oAddBorder);
		},
		function(col){
			col.setBorder(oAddBorder);
		},
		function(cell){
			cell.setBorder(oAddBorder);
		});
	}
};
Range.prototype.setShrinkToFit=function(val){
	History.Create_NewPoint();
	var oBBox = this.bbox;
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	this.createCellOnRowColCross();
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		this.worksheet.getAllCol().setShrinkToFit(val);
		fSetProperty = this._setPropertyNoEmpty;
	}
	fSetProperty.call(this, function(row){
		if(c_oRangeType.All == nRangeType && null == row.xfs)
			return;
		row.setShrinkToFit(val);
	},
	function(col){
		col.setShrinkToFit(val);
	},
	function(cell){
		cell.setShrinkToFit(val);
	});
};
Range.prototype.setWrap=function(val){
	History.Create_NewPoint();
	var oBBox = this.bbox;
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	this.createCellOnRowColCross();
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		this.worksheet.getAllCol().setWrap(val);
		fSetProperty = this._setPropertyNoEmpty;
	}
	fSetProperty.call(this, function(row){
		if(c_oRangeType.All == nRangeType && null == row.xfs)
			return;
		row.setWrap(val);
	},
	function(col){
		col.setWrap(val);
	},
	function(cell){
		cell.setWrap(val);
	});
};
Range.prototype.setAngle=function(val){
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	this.createCellOnRowColCross();
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		this.worksheet.getAllCol().setAngle(val);
		fSetProperty = this._setPropertyNoEmpty;
	}
	fSetProperty.call(this, function(row){
		if(c_oRangeType.All == nRangeType && null == row.xfs)
			return;
		row.setAngle(val);
	},
	function(col){
		col.setAngle(val);
	},
	function(cell){
		cell.setAngle(val);
	});
};
Range.prototype.setVerticalText=function(val){
    History.Create_NewPoint();
    var oBBox = this.bbox;
    History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	this.createCellOnRowColCross();
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		this.worksheet.getAllCol().setVerticalText(val);
		fSetProperty = this._setPropertyNoEmpty;
	}
	fSetProperty.call(this, function(row){
		if(c_oRangeType.All == nRangeType && null == row.xfs)
			return;
		row.setVerticalText(val);
	},
	function(col){
		col.setVerticalText(val);
	},
	function(cell){
		cell.setVerticalText(val);
	});
};
Range.prototype.getType=function(){
	var cell = this.worksheet._getCellNoEmpty(this.bbox.r1,this.bbox.c1);
	if(null != cell)
		return cell.getType();
	else
		return null;
};
Range.prototype.getFormula=function(){
	var cell = this.worksheet._getCellNoEmpty(this.bbox.r1,this.bbox.c1);
	if(null != cell)
		return cell.getFormula();
	else
		return "";
};
Range.prototype.getValueForEdit=function(){
	var cell = this.worksheet._getCellNoEmpty(this.bbox.r1,this.bbox.c1);
	if(null != cell)
	{
		var numFormat = this.getNumFormat();
		return cell.getValueForEdit(numFormat);
	}
	else
		return "";
};
Range.prototype.getValueForEdit2=function(){
	var cell = this.worksheet._getCellNoEmpty(this.bbox.r1,this.bbox.c1);
	if(null != cell)
	{
		var numFormat = this.getNumFormat();
		return cell.getValueForEdit2(numFormat);
	}
	else
	{
		var oRow = this.worksheet._getRowNoEmpty(this.bbox.r1);
		var oCol = this.worksheet._getColNoEmptyWithAll(this.bbox.c1);
		var xfs = null;
		if(null != oRow && null != oRow.xfs)
			xfs = oRow.xfs.clone();
		else if(null != oCol && null != oCol.xfs)
			xfs = oCol.xfs.clone();
		var oTempCell = new Cell(this.worksheet);
		oTempCell.create(xfs, this.getFirst());
		return oTempCell.getValueForEdit2();
	}
};
Range.prototype.getValueWithoutFormat=function(){
	var cell = this.worksheet._getCellNoEmpty(this.bbox.r1, this.bbox.c1);
	if(null != cell)
		return cell.getValueWithoutFormat();
	else
		return "";
};
Range.prototype.getValue=function(){
	return this.getValueWithoutFormat();
};
Range.prototype.getValueWithFormat=function(){
	var cell = this.worksheet._getCellNoEmpty(this.bbox.r1, this.bbox.c1);
	if(null != cell)
		return cell.getValue();
	else
		return "";
};
Range.prototype.getValue2=function(dDigitsCount, fIsFitMeasurer){
	//[{"text":"qwe","format":{"b":true, "i":false, "u":"none", "s":false, "fn":"Arial", "fs": 12, "c": 0xff00ff, "va": "subscript"  }},{}...]
	var nRow0 = this.bbox.r1;
	var nCol0 = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(this.bbox.r1, this.bbox.c1);
	if(null != cell)
		return cell.getValue2(dDigitsCount, fIsFitMeasurer);
	else
	{
		var oRow = this.worksheet._getRowNoEmpty(this.bbox.r1);
		var oCol = this.worksheet._getColNoEmptyWithAll(this.bbox.c1);
		var xfs = null;
		if(null != oRow && null != oRow.xfs)
			xfs = oRow.xfs.clone();
		else if(null != oCol && null != oCol.xfs)
			xfs = oCol.xfs.clone();
		var oTempCell = new Cell(this.worksheet);
		oTempCell.create(xfs, this.getFirst());
		return oTempCell.getValue2(dDigitsCount, fIsFitMeasurer);
	}
};
Range.prototype.getNumFormat=function(){
	return oNumFormatCache.get(this.getNumFormatStr());
};
Range.prototype.getNumFormatStr=function(){
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	if(null != cell)
    {
        if(null != cell.xfs && null != cell.xfs.num)
            return cell.xfs.num.f;
    }
	else
	{
		//стили столбов и колонок
		var row = this.worksheet._getRowNoEmpty(nRow);
		if(null != row && null != row.xfs && null != row.xfs.num)
			return row.xfs.num.f;
		var col = this.worksheet._getColNoEmptyWithAll(nCol);
		if(null != col && null != col.xfs && null != col.xfs.num)
			return col.xfs.num.f;
	}
    return g_oDefaultNum.f;
};
Range.prototype.getFont = function(){
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	if(null != cell)
    {
        if(null != cell.xfs && null != cell.xfs.font)
            return cell.xfs.font;
    }
	else
	{
		//стили столбов и колонок
		var row = this.worksheet._getRowNoEmpty(nRow);
		if(null != row && null != row.xfs && null != row.xfs.font)
			return row.xfs.font;
		var col = this.worksheet._getColNoEmptyWithAll(nCol);
		if(null != col && null != col.xfs && null != col.xfs.font)
			return col.xfs.font;
	}
    return g_oDefaultFont;
}
Range.prototype.getFontname=function(){
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	if(null != cell)
    {
        if(null != cell.xfs && null != cell.xfs.font)
            return cell.xfs.font.fn;
    }
	else
	{
		//стили столбов и колонок
		var row = this.worksheet._getRowNoEmpty(nRow);
		if(null != row && null != row.xfs && null != row.xfs.font)
			return row.xfs.font.fn;
		var col = this.worksheet._getColNoEmptyWithAll(nCol);
		if(null != col && null != col.xfs && null != col.xfs.font)
			return col.xfs.font.fn;
	}
    return g_oDefaultFont.fn;
};
Range.prototype.getFontsize=function(){
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	if(null != cell)
    {
        if(null != cell.xfs && null != cell.xfs.font)
            return cell.xfs.font.fs;
    }
	else
	{
		//стили столбов и колонок
		var row = this.worksheet._getRowNoEmpty(nRow);
		if(null != row && null != row.xfs && null != row.xfs.font)
			return row.xfs.font.fs;
		var col = this.worksheet._getColNoEmptyWithAll(nCol);
		if(null != col && null != col.xfs && null != col.xfs.font)
			return col.xfs.font.fs;
	}
    return g_oDefaultFont.fs;
};
Range.prototype.getFontcolor=function(){
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	if(null != cell)
    {
        if(null != cell.xfs && null != cell.xfs.font)
            return cell.xfs.font.c;
    }
	else
	{
		//стили столбов и колонок
		var row = this.worksheet._getRowNoEmpty(nRow);
		if(null != row && null != row.xfs && null != row.xfs.font)
			return row.xfs.font.c;
		var col = this.worksheet._getColNoEmptyWithAll(nCol);
		if(null != col && null != col.xfs && null != col.xfs.font)
			return col.xfs.font.c;
	}
    return g_oDefaultFont.c;
};
Range.prototype.getBold=function(){
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	if(null != cell)
    {
        if(null != cell.xfs && null != cell.xfs.font)
            return cell.xfs.font.b;
    }
	else
	{
		//стили столбов и колонок
		var row = this.worksheet._getRowNoEmpty(nRow);
		if(null != row && null != row.xfs && null != row.xfs.font)
			return row.xfs.font.b;
		var col = this.worksheet._getColNoEmptyWithAll(nCol);
		if(null != col && null != col.xfs && null != col.xfs.font)
			return col.xfs.font.b;
	}
    return g_oDefaultFont.b;
};
Range.prototype.getItalic=function(){
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	if(null != cell)
    {
        if(null != cell.xfs && null != cell.xfs.font)
            return cell.xfs.font.i;
    }
	else
	{
		//стили столбов и колонок
		var row = this.worksheet._getRowNoEmpty(nRow);
		if(null != row && null != row.xfs && null != row.xfs.font)
			return row.xfs.font.i;
		var col = this.worksheet._getColNoEmptyWithAll(nCol);
		if(null != col && null != col.xfs && null != col.xfs.font)
			return col.xfs.font.i;
	}
    return g_oDefaultFont.i;
};
Range.prototype.getUnderline=function(){
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	if(null != cell)
    {
        if(null != cell.xfs && null != cell.xfs.font)
            return cell.xfs.font.u;
    }
	else
	{
		//стили столбов и колонок
		var row = this.worksheet._getRowNoEmpty(nRow);
		if(null != row && null != row.xfs && null != row.xfs.font)
			return row.xfs.font.u;
		var col = this.worksheet._getColNoEmptyWithAll(nCol);
		if(null != col && null != col.xfs && null != col.xfs.font)
			return col.xfs.font.u;
	}
    return g_oDefaultFont.u;
};
Range.prototype.getStrikeout=function(val){
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	if(null != cell)
    {
        if(null != cell.xfs && null != cell.xfs.font)
            return cell.xfs.font.s;
    }
	else
	{
		//стили столбов и колонок
		var row = this.worksheet._getRowNoEmpty(nRow);
		if(null != row && null != row.xfs && null != row.xfs.font)
			return row.xfs.font.s;
		var col = this.worksheet._getColNoEmptyWithAll(nCol);
		if(null != col && null != col.xfs && null != col.xfs.font)
			return col.xfs.font.s;
	}
    return g_oDefaultFont.s;
};
Range.prototype.getFontAlign=function(){
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	if(null != cell)
    {
        if(null != cell.xfs && null != cell.xfs.font)
            return cell.xfs.font.va;
    }
	else
	{
		//стили столбов и колонок
		var row = this.worksheet._getRowNoEmpty(nRow);
		if(null != row && null != row.xfs && null != row.xfs.font)
			return row.xfs.font.va;
		var col = this.worksheet._getColNoEmptyWithAll(nCol);
		if(null != col && null != col.xfs && null != col.xfs.font)
			return col.xfs.font.va;
	}
    return g_oDefaultFont.va;
};
Range.prototype.getQuotePrefix=function(){
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	if(null != cell  && null != cell.xfs && null != cell.xfs.QuotePrefix)
		return cell.xfs.QuotePrefix;
	return false;
};
Range.prototype.getAlignVertical=function(){
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	if(null != cell)
    {
        if(null != cell.xfs && null != cell.xfs.align)
            return cell.xfs.align.ver;
    }
	else
	{
		//стили столбов и колонок
		var row = this.worksheet._getRowNoEmpty(nRow);
		if(null != row && null != row.xfs && null != row.xfs.align)
			return row.xfs.align.ver;
		var col = this.worksheet._getColNoEmptyWithAll(nCol);
		if(null != col && null != col.xfs && null != col.xfs.align)
			return col.xfs.align.ver;
	}
    return g_oDefaultAlign.ver;
};
Range.prototype.getAlignHorizontal=function(){
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	if(null != cell)
    {
        if(null != cell.xfs && null != cell.xfs.align)
            return cell.xfs.align.hor;
    }
	else
	{
		//стили столбов и колонок
		var row = this.worksheet._getRowNoEmpty(nRow);
		if(null != row && null != row.xfs && null != row.xfs.align)
			return row.xfs.align.hor;
		var col = this.worksheet._getColNoEmptyWithAll(nCol);
		if(null != col && null != col.xfs && null != col.xfs.align)
			return col.xfs.align.hor;
	}
    return g_oDefaultAlign.hor;
};
Range.prototype.getAlignHorizontalByValue=function(){
	//возвращает Align в зависимости от значния в ячейке
	//values:  none, center, justify, left , right, null
	var align = this.getAlignHorizontal();
	if("none" == align){
		//пытаемся определить по значению
		var nRow = this.bbox.r1;
		var nCol = this.bbox.c1;
		var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
		if(cell){
			switch(cell.getType()){
				case CellValueType.String:align = "left";break;
				case CellValueType.Bool:
				case CellValueType.Error:align = "center";break;
				default:
				//Если есть value и не проставлен тип значит это число, у всех остальных типов значение не null
				if(this.getValueWithoutFormat())
				{
					//смотрим 
					var oNumFmt = this.getNumFormat();
					if(true == oNumFmt.isTextFormat())
						align = "left";
					else
						align = "right";
				}
				else
					align = "left";
				break;
			}
		}
		if("none" == align)
			align = "left";
	}
	return align;
};
Range.prototype.getFill=function(){
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	if(null != cell)
    {
        if(null != cell.xfs && null != cell.xfs.fill)
            return cell.xfs.fill.bg;
    }
	else
	{
		//стили столбов и колонок
		var row = this.worksheet._getRowNoEmpty(nRow);
		if(null != row && null != row.xfs && null != row.xfs.fill)
			return row.xfs.fill.bg;
		var col = this.worksheet._getColNoEmptyWithAll(nCol);
		if(null != col && null != col.xfs && null != col.xfs.fill)
			return col.xfs.fill.bg;
	}
    return g_oDefaultFill.bg;
};
Range.prototype.getBorderSrc=function(_cell){
	//Возвращает как записано в файле, не проверяя бордеры соседних ячеек
	//формат
	//\{"l": {"s": "solid", "c": 0xff0000}, "t": {} ,"r": {} ,"b": {} ,"d": {},"dd": false ,"du": false }
	//"s" values: none, thick, thin, medium, dashDot, dashDotDot, dashed, dotted, double, hair, mediumDashDot, mediumDashDotDot, mediumDashed, slantDashDot
	//"dd" diagonal line, starting at the top left corner of the cell and moving down to the bottom right corner of the cell
	//"du" diagonal line, starting at the bottom left corner of the cell and moving up to the top right corner of the cell
    if(null == _cell)
        _cell = this.getFirst();
 	var nRow = _cell.getRow0();
	var nCol = _cell.getCol0();
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	if(null != cell)
    {
        if(null != cell.xfs && null != cell.xfs.border)
            return cell.xfs.border;
    }
	else
	{
		//стили столбов и колонок
		var row = this.worksheet._getRowNoEmpty(nRow);
		if(null != row && null != row.xfs && null != row.xfs.border)
			return row.xfs.border;
		var col = this.worksheet._getColNoEmptyWithAll(nCol);
		if(null != col && null != col.xfs && null != col.xfs.border)
			return col.xfs.border;
	}
    return g_oDefaultBorder;
};
Range.prototype.getBorder=function(_cell){
	//_cell - optional
	//Возвращает как записано в файле, не проверяя бордеры соседних ячеек
	//формат
	//\{"l": {"s": "solid", "c": 0xff0000}, "t": {} ,"r": {} ,"b": {} ,"d": {},"dd": false ,"du": false }
	//"s" values: none, thick, thin, medium, dashDot, dashDotDot, dashed, dotted, double, hair, mediumDashDot, mediumDashDotDot, mediumDashed, slantDashDot
	//"dd" diagonal line, starting at the top left corner of the cell and moving down to the bottom right corner of the cell
	//"du" diagonal line, starting at the bottom left corner of the cell and moving up to the top right corner of the cell
    var oRes = this.getBorderSrc(_cell);
    if(null != oRes)
        return oRes;
    else
        return g_oDefaultBorder;
};
Range.prototype.getBorderFull=function(){
	//Возвращает как excel, т.е. проверяет бордеры соседних ячеек
	//
	//\{"l": {"s": "solid", "c": 0xff0000}, "t": {} ,"r": {} ,"b": {} ,"d": {},"dd": false ,"du": false }
	//"s" values: none, thick, thin, medium, dashDot, dashDotDot, dashed, dotted, double, hair, mediumDashDot, mediumDashDotDot, mediumDashed, slantDashDot
	//
	//"dd" diagonal line, starting at the top left corner of the cell and moving down to the bottom right corner of the cell
	//"du" diagonal line, starting at the bottom left corner of the cell and moving up to the top right corner of the cell
	var borders = this.getBorder(this.getFirst()).clone();
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;    
	if("none" == borders.l.s){
		if(nCol > 1){
			var left = this.getBorder(new CellAddress(nRow, nCol - 1));
			if("none" != left.r.s)
				borders.l = left.r;
		}
	}
	if("none" == borders.t.s){
		if(nRow > 1){
			var top = this.getBorder(new CellAddress(nRow - 1, nCol));
			if("none" != top.b.s)
				borders.t = top.b;
		}
	}
	if("none" == borders.r.s){
		var right = this.getBorder(new CellAddress(nRow, nCol + 1));
		if("none" != right.l.s)
			borders.r = right.l;
	}
	if("none" == borders.b.s){
		var bottom = this.getBorder(new CellAddress(nRow + 1, nCol));
		if("none" != bottom.t.s)
			borders.b = bottom.t;
	}
	return borders;
};
Range.prototype.getShrinkToFit=function(){
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	if(null != cell)
    {
        if(null != cell.xfs && null != cell.xfs.align)
            return cell.xfs.align.shrink;
    }
	else
	{
		//стили столбов и колонок
		var row = this.worksheet._getRowNoEmpty(nRow);
		if(null != row && null != row.xfs && null != row.xfs.align)
			return row.xfs.align.shrink;
		var col = this.worksheet._getColNoEmptyWithAll(nCol);
		if(null != col && null != col.xfs && null != col.xfs.align)
			return col.xfs.align.shrink;
	}
    return g_oDefaultAlign.shrink;
};
Range.prototype.getWrap=function(){
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	if(null != cell)
    {
        if(null != cell.xfs && null != cell.xfs.align)
            return cell.xfs.align.wrap;
    }
	else
	{
		//стили столбов и колонок
		var row = this.worksheet._getRowNoEmpty(nRow);
		if(null != row && null != row.xfs && null != row.xfs.align)
			return row.xfs.align.wrap;
		var col = this.worksheet._getColNoEmptyWithAll(nCol);
		if(null != col && null != col.xfs && null != col.xfs.align)
			return col.xfs.align.wrap;
	}
    return g_oDefaultAlign.wrap;
};
Range.prototype.getAngle=function(){
	//угол от -90 до 90 против часовой стрелки от оси OX
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	var fProcAngle = function(val){
		if(0 <= val && val <= 180)
			return val <= 90 ? val : 90 - val;
		return 0;
	};
	if(null != cell)
    {
        if(null != cell.xfs && null != cell.xfs.align)
            return fProcAngle(cell.xfs.align.angle);
    }
	else
	{
		//стили столбов и колонок
		var row = this.worksheet._getRowNoEmpty(nRow);
		if(null != row && null != row.xfs && null != row.xfs.align)
			return fProcAngle(row.xfs.align.angle);
		var col = this.worksheet._getColNoEmptyWithAll(nCol);
		if(null != col && null != col.xfs && null != col.xfs.align)
			return fProcAngle(col.xfs.align.angle);
	}
    return fProcAngle(g_oDefaultAlign.angle);
};
Range.prototype.getVerticalText=function(){
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	if(null != cell)
    {
        if(null != cell.xfs && null != cell.xfs.align)
            return g_nVerticalTextAngle == cell.xfs.align.angle;
    }
	else
	{
		//стили столбов и колонок
		var row = this.worksheet._getRowNoEmpty(nRow);
		if(null != row && null != row.xfs && null != row.xfs.align)
			return g_nVerticalTextAngle == row.xfs.align.angle;
		var col = this.worksheet._getColNoEmptyWithAll(nCol);
		if(null != col && null != col.xfs && null != col.xfs.align)
			return g_nVerticalTextAngle == col.xfs.align.angle;
	}
    return g_nVerticalTextAngle == g_oDefaultAlign.angle;
}
Range.prototype.hasMerged=function(){
	var oThis = this;
	var oRes = null;
	if(null != this.worksheet.oAllCol)
	{
		var m = this.worksheet.oAllCol.getMerged();
		if (m)
			return m.getBBox0();
	}
	if(this.isOneCell())
	{
		
		var cell = this.worksheet._getCellNoEmpty(this.bbox.r1, this.bbox.c1);
		if(null != cell)
			oRes = cell.getMerged();
		if(null == oRes)
		{
			var row = this.worksheet._getRowNoEmpty(this.bbox.r1);
			if(null != row)
				oRes = row.getMerged();
		}
		if(null == oRes)
		{
			var col = this.worksheet._getColNoEmptyWithAll(this.bbox.c1);
			if(null != col)
				oRes = col.getMerged();
		}
		if(null != oRes)
			return oRes.getBBox0();
	}
	else
	{
		oRes = this._foreachNoEmpty(function(cell){return cell.getMerged();});
		if(null == oRes)
			oRes = this._foreachRowNoEmpty(function(row){return row.getMerged();}, null);
		if(null == oRes)
			oRes = this._foreachColNoEmpty(function(col){return col.getMerged();}, null);
		if(null != oRes)
			return oRes.getBBox0();
	}
	return null;
};
Range.prototype.hasMergedAll=function(){
	var oThis = this;
	var oRes = [];
	if(null != this.worksheet.oAllCol)
	{
		var m = this.worksheet.oAllCol.getMerged();
		if (m)
			oRes.push(m);
	}
	this._foreachNoEmpty(function(cell){
		var m = cell.getMerged();
		if (m)
			oRes.push(m);
	});
	this._foreachRowNoEmpty(function(row){
		var m = row.getMerged();
		if (m)
			oRes.push(m);
	}, null);
	this._foreachColNoEmpty(function(col){
		var m = col.getMerged();
		if (m)
			oRes.push(m); 
	}, null);
	
	if(0 != oRes.length)
		return oRes;
	
	return null;
};
Range.prototype.mergeOpen=function(){
	var val = this.clone();
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		this.worksheet.getAllCol().merged = val;
		fSetProperty = this._setPropertyNoEmpty;
		val = null;
	}
	fSetProperty.call(this, function(row){
		row.merged = val;
	},function(col){
		col.merged = val;
	},
	function(cell, nRow, nCol, nRowStart, nColStart){
		cell.merged = val;
	});
}
Range.prototype.merge=function(type){
	if(null == type)
		type = c_oAscMergeOptions.Merge;
	var oBBox = this.bbox;
	if(oBBox.r1 == oBBox.r2 && oBBox.c1 == oBBox.c2)
		return;
	History.Create_NewPoint();
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	History.StartTransaction();
	var bHasMerged = false;
	if(this.hasMerged())
	{
		bHasMerged = true;
		this.unmerge();
	}
	if(type == c_oAscMergeOptions.MergeCenter && bHasMerged)
	{
		History.EndTransaction();
		return;
	}
	//пробегаемся по границе диапазона, чтобы посмотреть какие границы нужно оставлять
	var oLeftBorder = null;
	var oTopBorder = null;
	var oRightBorder = null;
	var oBottomBorder = null;
	var nRangeType = this._getRangeType(oBBox);
	if(c_oRangeType.Range == nRangeType)
	{
		var oThis = this;
		var fGetBorder = function(bRow, v1, v2, v3, type)
		{
			var oRes = null;
			for(var i = v1; i <= v2; ++i)
			{
				var bNeedDelete = true;
				var oCurCell;
				if(bRow)
					oCurCell = oThis.worksheet._getCellNoEmpty(v3, i);
				else
					oCurCell = oThis.worksheet._getCellNoEmpty(i, v3);
				if(null != oCurCell && null != oCurCell.xfs && null != oCurCell.xfs.border)
				{
					var border = oCurCell.xfs.border;
					var oBorderProp;
					switch(type)
					{
						case 1: oBorderProp = border.l;break;
						case 2: oBorderProp = border.t;break;
						case 3: oBorderProp = border.r;break;
						case 4: oBorderProp = border.b;break;
					}
					if(false == oBorderProp.isEmpty())
					{
						if(null == oRes)
						{
							oRes = oBorderProp;
							bNeedDelete = false;
						}
						else if(true == oRes.isEqual(oBorderProp))
							bNeedDelete = false;
					}
				}
				if(bNeedDelete)
				{
					oRes = null;
					break;
				}
			}
			return oRes;
		}
		oLeftBorder = fGetBorder(false, oBBox.r1, oBBox.r2, oBBox.c1, 1);
		oTopBorder = fGetBorder(true, oBBox.c1, oBBox.c2, oBBox.r1, 2);
		oRightBorder = fGetBorder(false, oBBox.r1, oBBox.r2, oBBox.c2, 3);
		oBottomBorder = fGetBorder(true, oBBox.c1, oBBox.c2, oBBox.r2, 4);
	}
	else if(c_oRangeType.Row == nRangeType)
	{
		var oTopRow = this.worksheet._getRowNoEmpty(oBBox.r1);
		if(null != oTopRow && null != oTopRow.xfs && null != oTopRow.xfs.border && false == oTopRow.xfs.border.t.isEmpty())
			oTopBorder = oTopRow.xfs.border.t;
		if(oBBox.r1 != oBBox.r2)
		{
			var oBottomRow = this.worksheet._getRowNoEmpty(oBBox.r2);
			if(null != oBottomRow && null != oBottomRow.xfs && null != oBottomRow.xfs.border && false == oBottomRow.xfs.border.b.isEmpty())
				oBottomBorder = oBottomRow.xfs.border.b;
		}
	}
	else
	{
		var oLeftCol = this.worksheet._getColNoEmptyWithAll(oBBox.c1);
		if(null != oLeftCol && null != oLeftCol.xfs && null != oLeftCol.xfs.border && false == oLeftCol.xfs.border.l.isEmpty())
			oLeftBorder = oLeftCol.xfs.border.l;
		if(oBBox.c1 != oBBox.c2)
		{
			var oRightCol = this.worksheet._getColNoEmptyWithAll(oBBox.c2);
			if(null != oRightCol && null != oRightCol.xfs && null != oRightCol.xfs.border && false == oRightCol.xfs.border.r.isEmpty())
				oRightBorder = oRightCol.xfs.border.r;
		}
	}
	//правила работы с гиперссылками во время merge(отличются от Excel в случаем областей, например hyperlink: C3:D3 мержим C2:C3)
	//1) Если первой встретилась ссылка в одной ячейке, то эта ссылка переходит в первую ячейку мерженой области, останые одноклеточные ссылки внутри мерженой области стираются
	//2) Если встретилась многоклеточная ссылка, которая полностью лежит в замерженой области(но не совпадает с ней), она удаляется
	//3) Если встретилась многоклеточная ссылка, которая не полностью лежит в замерженой области(или совпадает с ней), то такие ссылки оставляем без изменений.
	//4) Ссылки в строках, столбцах всегда остаются без изменений
	
	var bFirst = true;
	var oThis = this;
	var oLeftTopCellStyle = null;
	var oFirstCellStyle = null;
	var oFirstCellValue = null;
	var oFirstCellRow = null;
	var oFirstCellCol = null;
	var oFirstCellHyperlink = null;
	this._setPropertyNoEmpty(null,null,
	function(cell, nRow0, nCol0, nRowStart, nColStart){
		var aHyperlinks = cell.getHyperlinks();
		if(bFirst && false == cell.isEmptyText())
		{
			bFirst = false;
			oFirstCellStyle = cell.getStyle();
			oFirstCellValue = cell.getValueData();
			oFirstCellRow = cell.oId.getRow0();
			oFirstCellCol = cell.oId.getCol0();
			for(var i = 0, length = aHyperlinks.length; i < length; ++i)
			{
				var oCurHyp = aHyperlinks[i];
				if(oCurHyp.Ref.isOneCell())
				{
					oFirstCellHyperlink = oCurHyp;
					break;
				}
			}
		}
		if(nRow0 == nRowStart || nCol0 == nColStart)
			oLeftTopCellStyle = cell.getStyle();
		
		cell.setValue("");
	});
	var oTargetStyle = null;
	if(null != oFirstCellValue && null != oFirstCellRow && null != oFirstCellCol)
	{
		if(null != oFirstCellStyle)
			oTargetStyle = oFirstCellStyle.clone();
		var oLeftTopCell = this.worksheet._getCell(oBBox.r1, oBBox.c1);
		oLeftTopCell.setValueData(oFirstCellValue);
		if(null != oFirstCellHyperlink)
		{
			var oLeftTopRange = this.worksheet.getCell(new CellAddress(oBBox.r1, oBBox.c1, 0));
			oLeftTopRange.setHyperlink(oFirstCellHyperlink, true);
		}
	}
	else if(null != oLeftTopCellStyle)
		oTargetStyle = oLeftTopCellStyle.clone();

	//убираем бордеры
	if(null != oTargetStyle)
	{
		if(null != oTargetStyle.border)
			oTargetStyle.border = null;
	}
	else if(null != oLeftBorder || null != oTopBorder || null != oRightBorder || null != oBottomBorder)
		oTargetStyle = new CellXfs();
	var bEmptyStyle = true;
	var bEmptyBorder = true;
	var oNewMerged = this.clone();
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		this.worksheet.getAllCol().merged = oNewMerged;
		fSetProperty = this._setPropertyNoEmpty;
		oNewMerged = null;
		oTargetStyle = null
	}
	fSetProperty.call(this, function(row){
		row.merged = oNewMerged;
		if(null == oTargetStyle)
			row.setStyle(null);
		else
		{
			var oNewStyle = oTargetStyle.clone();
			if(row.index == oBBox.r1 && null != oTopBorder)
			{
				oNewStyle.border = new Border();
				oNewStyle.border.t = oTopBorder.clone();
			}
			else if(row.index == oBBox.r2 && null != oBottomBorder)
			{
				oNewStyle.border = new Border();
				oNewStyle.border.b = oBottomBorder.clone();
			}
			row.setStyle(oNewStyle);
		}
	},function(col){
		col.merged = oNewMerged;
		if(null == oTargetStyle)
			col.setStyle(null);
		else
		{
			var oNewStyle = oTargetStyle.clone();
			if(col.index == oBBox.c1 && null != oLeftBorder)
			{
				oNewStyle.border = new Border();
				oNewStyle.border.l = oLeftBorder.clone();
			}
			else if(col.index == oBBox.c2 && null != oRightBorder)
			{
				oNewStyle.border = new Border();
				oNewStyle.border.r = oRightBorder.clone();
			}
			col.setStyle(oNewStyle);
		}
	},
	function(cell, nRow, nCol, nRowStart, nColStart){
		//важно установить именно здесь, чтобы ячейка не удалилась после применения стилей.
		cell.merged = oNewMerged;
		if(null == oTargetStyle)
			cell.setStyle(null);
		else
		{
			var oNewStyle = oTargetStyle.clone();
			if(oBBox.r1 == nRow && oBBox.c1 == nCol)
			{
				if(null != oLeftBorder || null != oTopBorder || (oBBox.r1 == oBBox.r2 && null != oBottomBorder) || (oBBox.c1 == oBBox.c2 && null != oRightBorder))
				{
					oNewStyle.border = new Border();
					if(null != oLeftBorder)
						oNewStyle.border.l = oLeftBorder.clone();
					if(null != oTopBorder)
						oNewStyle.border.t = oTopBorder.clone();
					if(oBBox.r1 == oBBox.r2 && null != oBottomBorder)
						oNewStyle.border.b = oBottomBorder.clone();
					if(oBBox.c1 == oBBox.c2 && null != oRightBorder)
						oNewStyle.border.r = oRightBorder.clone();
				}
			}
			else if(oBBox.r1 == nRow && oBBox.c2 == nCol)
			{
				if(null != oRightBorder || null != oTopBorder || (oBBox.r1 == oBBox.r2 && null != oBottomBorder))
				{
					oNewStyle.border = new Border();
					if(null != oRightBorder)
						oNewStyle.border.r = oRightBorder.clone();
					if(null != oTopBorder)
						oNewStyle.border.t = oTopBorder.clone();
					if(oBBox.r1 == oBBox.r2 && null != oBottomBorder)
						oNewStyle.border.b = oBottomBorder.clone();
				}
			}
			else if(oBBox.r2 == nRow && oBBox.c1 == nCol)
			{
				if(null != oLeftBorder || null != oBottomBorder || (oBBox.c1 == oBBox.c2 && null != oRightBorder))
				{
					oNewStyle.border = new Border();
					if(null != oLeftBorder)
						oNewStyle.border.l = oLeftBorder.clone();
					if(null != oBottomBorder)
						oNewStyle.border.b = oBottomBorder.clone();
					if(oBBox.c1 == oBBox.c2 && null != oRightBorder)
						oNewStyle.border.r = oRightBorder.clone();
				}
			}
			else if(oBBox.r2 == nRow && oBBox.c2 == nCol)
			{
				if(null != oRightBorder || null != oBottomBorder)
				{
					oNewStyle.border = new Border();
					if(null != oRightBorder)
						oNewStyle.border.r = oRightBorder.clone();
					if(null != oBottomBorder)
						oNewStyle.border.b = oBottomBorder.clone();
				}
			}
			else if(oBBox.r1 == nRow)
			{
				if(null != oTopBorder || (oBBox.r1 == oBBox.r2 && null != oBottomBorder))
				{
					oNewStyle.border = new Border();
					if(null != oTopBorder)
						oNewStyle.border.t = oTopBorder.clone();
					if(oBBox.r1 == oBBox.r2 && null != oBottomBorder)
						oNewStyle.border.b = oBottomBorder.clone();
				}
			}
			else if(oBBox.r2 == nRow)
			{
				if(null != oBottomBorder)
				{
					oNewStyle.border = new Border();
					oNewStyle.border.b = oBottomBorder.clone();
				}
			}
			else if(oBBox.c1 == nCol)
			{
				if(null != oLeftBorder || (oBBox.c1 == oBBox.c2 && null != oRightBorder))
				{
					oNewStyle.border = new Border();
					if(null != oLeftBorder)
						oNewStyle.border.l = oLeftBorder.clone();
					if(oBBox.c1 == oBBox.c2 && null != oRightBorder)
						oNewStyle.border.r = oRightBorder.clone();
				}
			}
			else if(oBBox.c2 == nCol)
			{
				if(null != oRightBorder)
				{
					oNewStyle.border = new Border();
					oNewStyle.border.r = oRightBorder.clone();
				}
			}
			cell.setStyle(oNewStyle);
		}
	});
	if(type == c_oAscMergeOptions.MergeCenter)
		this.setAlignHorizontal("center");
	History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_Merge, this.worksheet.getId(), new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2), new UndoRedoData_BBox(oBBox));
	History.EndTransaction();
};
Range.prototype.unmerge=function(bOnlyInRange){
	var oBBox = this.bbox;
	if(true == bOnlyInRange)
	{
		History.Create_NewPoint();
		History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
		History.StartTransaction();
		var oAllMerge = null;
		if(null != this.worksheet.oAllCol)
		{
			oAllMerge = this.worksheet.oAllCol.getMerged();
			if (null != oAllMerge)
				this.worksheet.oAllCol.merged = null;
		}
		if(null == oAllMerge)
		{
			this._setPropertyNoEmpty(function(row){
				row.merged = null;
			},function(col){
				col.merged = null;
			},function(cell, nRow, nCol, nRowStart, nColStart){
				cell.merged = null;
				cell.merged = null;
			});
		}
		History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_Unmerge, this.worksheet.getId(), new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2), new UndoRedoData_BBox(oBBox));
		History.EndTransaction();
	}
	else
	{
		var oAllMerge = null;
		if(null != this.worksheet.oAllCol)
		{
			oAllMerge = this.worksheet.oAllCol.getMerged();
			if (oAllMerge)
				oAllMerge.unmerge(true);
		}
		if(null == oAllMerge)
		{
			var oMerged = new Object();
			//собираем замерженые ячейки
			this._setPropertyNoEmpty(function(row){
				if(null != row.merged)
					oMerged[row.merged.getName()] = row.merged;
			},function(col){
				if(null != col.merged)
					oMerged[col.merged.getName()] = col.merged;
			},function(cell, nRow, nCol, nRowStart, nColStart){
				if(null != cell.merged)
					oMerged[cell.merged.getName()] = cell.merged;
			});
			for(var i in oMerged)
			{
				var merged = oMerged[i]
				merged.unmerge(true);
			}
		}
	}
};
Range.prototype._getHyperlinks=function(bStopOnFirst){
	var nRangeType = this._getRangeType();
	var result = [];
	var oAllCol = this.worksheet.oAllCol;
	if(bStopOnFirst && null != oAllCol && oAllCol.hyperlinks.length > 0)
	{
		result.push({hyperlink: oAllCol.hyperlinks[oAllCol.hyperlinks.length - 1], col: this.bbox.c1, row: this.bbox.r1});
		return;
	}
	var oThis = this;
	if(c_oRangeType.Range == nRangeType)
	{
		var aRows = this.worksheet._getRows();
		var aCols = this.worksheet._getCols();
		var oTempRows = new Object();
		var fAddToTemp = function(oTempRows, hyperlink, nRow, nCol){
			var oRow = oTempRows[nRow];
			if(null == oRow)
			{
				oRow = new Object();
				oTempRows[nRow] = oRow;
			}
			oRow[nCol] = hyperlink;
		};
		var oProcessedMerged = new Object();
		this._foreachIndex(function(nRow, nCol){
			var cell = oThis.worksheet._getCellNoEmpty(nRow, nCol);
			if(null != cell && cell.hyperlinks.length > 0)
			{
				var oCurHyperlink = cell.hyperlinks[cell.hyperlinks.length - 1];
				if(bStopOnFirst)
				{
					result.push({hyperlink: oCurHyperlink, col: nCol, row: nRow});
					return;
				}
				else
				{
					fAddToTemp(oTempRows, oCurHyperlink, nRow, nCol);
					//расширяем гиперссылки в замерженых ячейках
					if(null != cell.merged)
					{
						var sId = cell.merged.getName();
						if(null == oProcessedMerged[sId])
						{
							var intersect = oThis.intersect(cell.merged);
							if(null != intersect)
							{
								intersect._foreach(function(cell, nRow, nCol, nRowStart, nColStart){
									fAddToTemp(oTempRows, oCurHyperlink, nRow, nCol);
								});
							}
							oProcessedMerged[sId] = cell.merged;
						}
					}
				}
			}
			else
			{
				var row = aRows[nRow];
				var col = aCols[nCol];
				if(null != row && row.hyperlinks.lengh > 0)
					fAddToTemp(oTempRows, row.hyperlinks[row.hyperlinks.length - 1], nRow, nCol);
				if(null != col && col.hyperlinks.length > 0)
					fAddToTemp(oTempRows, col.hyperlinks[col.hyperlinks.length - 1], nRow, nCol);
				else if(null != oAllCol && oAllCol.hyperlinks.length > 0)
					fAddToTemp(oTempRows, oAllCol.hyperlinks[oAllCol.hyperlinks.length - 1], nRow, nCol);
			}
		});
		//формируем результат
		for(var i in oTempRows)
		{
			var nRowIndex = i - 0;
			var row = oTempRows[i];
			for(var j in row)
			{
				var nColIndex = j - 0;
				var oCurHyp = row[j];
				result.push({hyperlink: oCurHyp, col: nColIndex, row: nRowIndex});
			}
		}
	}
	return result;
}
Range.prototype.getHyperlink=function(){
	var aHyperlinks = this._getHyperlinks(true);
	if(null != aHyperlinks && aHyperlinks.length > 0)
		return aHyperlinks[0].hyperlink;
	return null;
};
Range.prototype.getHyperlinks=function(){
	return this._getHyperlinks(false);
};
Range.prototype.setHyperlink=function(val, bWithoutStyle){
	if(null != val && false == val.isValid())
		return;
	History.Create_NewPoint();
	var oBBox = this.bbox;
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	History.StartTransaction();
	var oThis = this;
	var oHyperlinkFont = new Font();
	oHyperlinkFont.fn = this.worksheet.workbook.getDefaultFont();
	oHyperlinkFont.fs = this.worksheet.workbook.getDefaultSize();
	oHyperlinkFont.u = "single";
	oHyperlinkFont.c = g_nColorHyperlink;
	var bNeedCheckHyperlink = true;
	var fCheckHyperlink = function(aHyperlinks)
	{
		if(bNeedCheckHyperlink)
		{
			bNeedCheckHyperlink = false;
			for(var i = 0, length = aHyperlinks.length; i < length; ++i)
			{
				var hyperlink = aHyperlinks[i];
				var oHyperlinkBBox = hyperlink.Ref.getBBox0();
				//удаляем ссылку, если диапазоны совпадают
				if(oBBox.r1 == oHyperlinkBBox.r1 && oBBox.c1 == oHyperlinkBBox.c1 && oBBox.r2 == oHyperlinkBBox.r2 && oBBox.c2 == oHyperlinkBBox.c2)
					hyperlink.Ref.removeHyperlink(hyperlink);
			}
		}
	}
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		var oAllCol = this.worksheet.getAllCol();
		fCheckHyperlink(oAllCol.hyperlinks);
		if(true != bWithoutStyle)
			oAllCol.setFont(oHyperlinkFont);
		oAllCol.hyperlinks.push(val);
		fSetProperty = this._setPropertyNoEmpty;
	}
	fSetProperty.call(this, function(row){
		fCheckHyperlink(row.hyperlinks);
		if(true != bWithoutStyle)
			row.setFont(oHyperlinkFont);
		row.hyperlinks.push(val);
	},
	function(col){
		fCheckHyperlink(col.hyperlinks);
		if(true != bWithoutStyle)
			col.setFont(oHyperlinkFont);
		col.hyperlinks.push(val);
	},
	function(cell){
		fCheckHyperlink(cell.hyperlinks);
		if(true != bWithoutStyle)
			cell.setFont(oHyperlinkFont);
		cell.hyperlinks.push(val);
	});
	History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_SetHyperlink, this.worksheet.getId(), new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2), val.clone());
	History.EndTransaction();
	this.worksheet.addActionHyperlink(true);
};
Range.prototype.removeHyperlink=function(val){
	History.Create_NewPoint();
	var oBBox = this.bbox;
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	History.StartTransaction();
	var oThis = this;
	if(null != val)
	{
		var fProcessHyperlink = function(aHyperlinks){
			for(var i = 0, length = aHyperlinks.length;i < length; ++i)
			{
				//isEqual нужен, чтобы функцию можно було вызывать при Undo/redo
				if(val.isEqual(aHyperlinks[i]))
				{
					aHyperlinks.splice(i, 1);
					break;
				}	
			}
		}
		if(null != this.worksheet.oAllCol)
			fProcessHyperlink(this.worksheet.oAllCol.hyperlinks);
		//val не нулевой, когда вызывается remove для конктерной ссылки
		this._setPropertyNoEmpty(function(row){
			fProcessHyperlink(row.hyperlinks);
		}, function(col){
			fProcessHyperlink(col.hyperlinks);
		}, function(cell){
			fProcessHyperlink(cell.hyperlinks);
		});
		History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveHyperlink, this.worksheet.getId(), new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2), val.clone());
		this.worksheet.addActionHyperlink(true);
	}
	else
	{
		//собираем гиперссылки, которые надо удалить
		var oHyperlinksToDelete = new Object();
		var fProcessHyperlink = function(aHyperlinks)
		{
			for(var i = 0, length = aHyperlinks.length; i < length; ++i)
			{
				var hyperlink = aHyperlinks[i];
				var sName = hyperlink.Ref.getName();
				oHyperlinksToDelete[sName] = hyperlink;
			}
		}
		if(null != this.worksheet.oAllCol)
			fProcessHyperlink(this.worksheet.oAllCol.hyperlinks);
		this._foreachRowNoEmpty(function(row){
			return fProcessHyperlink(row.hyperlinks);
		}, null);
		this._foreachColNoEmpty(function(col){
			return fProcessHyperlink(col.hyperlinks);
		}, null);
		this._foreachNoEmpty(function(cell){
			return fProcessHyperlink(cell.hyperlinks);
		});
		for(var i in oHyperlinksToDelete)
		{
			var hyperlink = oHyperlinksToDelete[i];
			hyperlink.Ref.removeHyperlink(hyperlink);
		}
	}
	History.EndTransaction();
}
Range.prototype.deleteCellsShiftUp=function(){
	return this._shiftUpDown(true);
};
Range.prototype.addCellsShiftBottom=function(){
	return this._shiftUpDown(false);
};
Range.prototype.addCellsShiftRight=function(){
	return this._shiftLeftRight(false);
}
Range.prototype.deleteCellsShiftLeft=function(){
	return this._shiftLeftRight(true);
};
Range.prototype._shiftLeftRight=function(bLeft){
	var oBBox = this.bbox;
	var nWidth = oBBox.c2 - oBBox.c1 + 1;
	var nRangeType = this._getRangeType(oBBox);
	if(c_oRangeType.Range != nRangeType && c_oRangeType.Col != nRangeType)
		return false;
	if(null != this.worksheet.oAllCol && null != this.worksheet.oAllCol.merged)
		return false;
	History.Create_NewPoint();
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	History.StartTransaction();
	var bChangeHyperlink = false;
	var oExpandedHyperlinkRange = new Object();//hyperlink области которые надо раздвинуть или они выходят за границы и их надо оставить
	var fAddHyperlinkToExpanded = function(oExpanded, aHyperlinks)
	{
		for(var i = 0, length = aHyperlinks.length; i < length ;++i)
		{
			var hyperlink = aHyperlinks[i];
			var oHyperlinkBBox = hyperlink.Ref.getBBox0();
			if(false == (oHyperlinkBBox.r1 >= oBBox.r1 && oHyperlinkBBox.c1 >= oBBox.c1 && oHyperlinkBBox.r2 <= oBBox.r2))
			{
				bChangeHyperlink = true;
				var sId = hyperlink.Ref.getName();
				oExpanded[sId] = hyperlink;
				hyperlink.Ref.removeHyperlink(hyperlink);
			}
		}
	}
	var oExpandedRange = new Object();//merge области которые надо раздвинуть
	//todo проверка не выходят ли данные за границу
	if(c_oRangeType.Range == nRangeType){
		//делаем unmerge, если нельзя сдвинуть из-за этого
		//временно убираем hyperlink, которые выходят за диапазон, возвращаем после сдвига ячеек 
		var fProcessEdge = function(range){
			range._setPropertyNoEmpty(null, null, function(cell, nRow0, nCol0, nRowStart, nColStart){
				if(nCol0 > oBBox.c2)
				{
					if(null != cell.merged)
					{
						var oMergedBBox = cell.merged.getBBox0();
						if(oMergedBBox.r1 < oBBox.r1 || oMergedBBox.r2 > oBBox.r2)
							cell.merged.unmerge(true);
					}
					fAddHyperlinkToExpanded(oExpandedHyperlinkRange, cell.hyperlinks);
				}
			});
		};
		fProcessEdge(this.worksheet.getRange(new CellAddress(oBBox.r1, 0, 0), new CellAddress(oBBox.r1, gc_nMaxCol0, 0)));
		if(oBBox.r1 != oBBox.r2)
		{
			fProcessEdge(this.worksheet.getRange(new CellAddress(oBBox.r2, 0, 0), new CellAddress(oBBox.r2, gc_nMaxCol0, 0)));
			//проходим эту область специально для hyperlink
			fProcessEdge(this.worksheet.getRange(new CellAddress(oBBox.r1, oBBox.c1, 0), new CellAddress(oBBox.r2, oBBox.c1, 0)));
		}
		
		var aCols = this.worksheet._getCols();
		for(var i in aCols)
		{
			var nIndex = i - 0;
			if(nIndex > oBBox.c2)
			{
				var col = aCols[i];
				if(null != col.merged)
					col.merged.unmerge(true);
			}
		}
	}
	else
	{
		//если выделение попало в середину мерженой области, надо раздвинуть мерженую область
		var oTopRow = this.worksheet.getRange(new CellAddress(0, oBBox.c1, 0), new CellAddress(gc_nMaxRow0, oBBox.c2, 0));
		oTopRow._setPropertyNoEmpty(null, function(col){
			fAddHyperlinkToExpanded(oExpandedHyperlinkRange, col.hyperlinks);
		}, function(cell, nRow0, nCol0, nRowStart, nColStart){
			if(nCol0 >= oBBox.c1)
			{
				if(null != cell.merged)
				{
					var oMergedBBox = cell.merged.getBBox0();
					if(oMergedBBox.c1 < oBBox.c1 || (bLeft && oMergedBBox.c1 == oBBox.c1 && oMergedBBox.c2 > oBBox.c2))
					{
						var sId = cell.merged.getName();
						if(null == oExpandedRange[sId])
							oExpandedRange[sId] = cell.merged;
					}
				}
				fAddHyperlinkToExpanded(oExpandedHyperlinkRange, cell.hyperlinks);
			}
		});
	}
	//сдвигаем merge и hyperlink области
	var oProcessedMerged = new Object();
	var oProcessedHyperlinks = new Object();
	var fAddToProcess = function(index, merged, hyperlinks){
		if(oBBox.c1 <= index)
		{
			if(null != merged)
			{
				if(bLeft && index <= oBBox.c2)
					merged.unmerge(true);
				else
				{
					var sId = merged.getName();
					if(null == oProcessedMerged[sId] && null == oExpandedRange[sId])
						oProcessedMerged[sId] = merged;
				}
			}
			if(null != hyperlinks)
			{
				for(var i = 0,length = hyperlinks.length; i < length; ++i)
				{
					var hyperlink = hyperlinks[i];
					if(bLeft && index <= oBBox.c2)
					{
						hyperlink.Ref.removeHyperlink(hyperlink);
					}
					else
					{
						var sId = hyperlink.Ref.getName();
						if(null == oProcessedHyperlinks[sId])
							oProcessedHyperlinks[sId] = hyperlink;
					}
				}
			}
		}
	};
	var oBodyRange = this.worksheet.getRange(new CellAddress(oBBox.r1, 0, 0), new CellAddress(oBBox.r2, gc_nMaxCol0, 0))
	oBodyRange._setPropertyNoEmpty(null, function(col){
		fAddToProcess(col.index, col.merged, col.hyperlinks);
	}, function(cell, nRow0, nCol0, nRowStart, nColStart){
		fAddToProcess(nCol0, cell.merged, cell.hyperlinks);
	});
	for(var i in oProcessedMerged)
	{
		if(bLeft)
			oProcessedMerged[i].setOffset({offsetCol:-nWidth, offsetRow:0});
		else
			oProcessedMerged[i].setOffset({offsetCol:nWidth, offsetRow:0});
	}
	for(var i in oProcessedHyperlinks)
	{
		bChangeHyperlink = true;
		if(bLeft)
			oProcessedHyperlinks[i].Ref.setOffset({offsetCol:-nWidth, offsetRow:0});
		else
			oProcessedHyperlinks[i].Ref.setOffset({offsetCol:nWidth, offsetRow:0});
	}
	//сдвигаем ячейки
	if(bLeft)
	{
		if(c_oRangeType.Range == nRangeType)
			this.worksheet._shiftCellsLeft(oBBox);
		else
			this.worksheet._removeCols(oBBox.c1, oBBox.c2);
	}
	else
	{
		if(c_oRangeType.Range == nRangeType)
			this.worksheet._shiftCellsRight(oBBox);
		else
			this.worksheet._insertColsBefore(oBBox.c1, nWidth);
	}
	//возвращаем oExpandedRange
	for(var i in oExpandedRange)
	{
		var oExpanded = oExpandedRange[i];
		if(bLeft)
			oExpanded.setOffsetLast({offsetCol:-nWidth, offsetRow:0});
		else
			oExpanded.setOffsetLast({offsetCol:nWidth, offsetRow:0});
		oExpanded.merge();
	}
	//возвращаем oExpandedRange
	for(var i in oExpandedHyperlinkRange)
	{
		var oExpanded = oExpandedHyperlinkRange[i];
		var oHyperlinkBBox = oExpanded.Ref.getBBox0();
		if(oHyperlinkBBox.r1 >= oBBox.r1 && oHyperlinkBBox.r2 <= oBBox.r2)
		{
			if(bLeft)
				oExpanded.Ref.setOffsetLast({offsetCol:-nWidth, offsetRow:0});
			else
				oExpanded.Ref.setOffsetLast({offsetCol:nWidth, offsetRow:0});
		}
		oExpanded.Ref.setHyperlink(oExpanded, true);
	}
	if(bChangeHyperlink)
		this.worksheet.addActionHyperlink(true);
	History.EndTransaction();
	return true;
};
Range.prototype._shiftUpDown=function(bUp){
	var oBBox = this.bbox;
	var nHeight = oBBox.r2 - oBBox.r1 + 1;
	var nRangeType = this._getRangeType(oBBox);
	if(c_oRangeType.Range != nRangeType && c_oRangeType.Row != nRangeType)
		return false;
	History.Create_NewPoint();
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	History.StartTransaction();
	var bChangeHyperlink = false;
	var oExpandedHyperlinkRange = new Object();//hyperlink области которые надо раздвинуть или они выходят за границы и их надо оставить
	var fAddHyperlinkToExpanded = function(oExpanded, aHyperlinks)
	{
		for(var i = 0, length = aHyperlinks.length; i < length ;++i)
		{
			var hyperlink = aHyperlinks[i];
			var oHyperlinkBBox = hyperlink.Ref.getBBox0();
			if(false == (oHyperlinkBBox.c1 >= oBBox.c1 && oHyperlinkBBox.r1 >= oBBox.r1 && oHyperlinkBBox.c2 <= oBBox.c2))
			{
				bChangeHyperlink = true;
				var sId = hyperlink.Ref.getName();
				oExpanded[sId] = hyperlink;
				hyperlink.Ref.removeHyperlink(hyperlink);
			}
		}
	}
	var oExpandedRange = new Object();//merge области которые надо раздвинуть
	//todo проверка не выходят ли данные за границу
	if(c_oRangeType.Range == nRangeType){
		//делаем unmerge, если нельзя сдвинуть из-за этого
		//временно убираем hyperlink, которые выходят за диапазон, возвращаем после сдвига ячеек 
		var fProcessEdge = function(range){
			range._setPropertyNoEmpty(null, null, function(cell, nRow0, nCol0, nRowStart, nColStart){
				if(nRow0 > oBBox.r2)
				{
					if(null != cell.merged)
					{
						var oMergedBBox = cell.merged.getBBox0();
						if(oMergedBBox.c1 < oBBox.c1 || oMergedBBox.c2 > oBBox.c2)
							cell.merged.unmerge(true);
					}
					fAddHyperlinkToExpanded(oExpandedHyperlinkRange, cell.hyperlinks);
				}
			});
		};
		fProcessEdge(this.worksheet.getRange(new CellAddress(0, oBBox.c1, 0), new CellAddress(gc_nMaxRow0, oBBox.c1, 0)));
		if(oBBox.r1 != oBBox.r2)
		{
			fProcessEdge(this.worksheet.getRange(new CellAddress(0, oBBox.c2, 0), new CellAddress(gc_nMaxRow0, oBBox.c2, 0)));
			//проходим эту область специально для hyperlink
			fProcessEdge(this.worksheet.getRange(new CellAddress(oBBox.r1, oBBox.c1, 0), new CellAddress(oBBox.r1, oBBox.c2, 0)));
		}
		
		var aRows = this.worksheet._getRows();
		for(var i in aRows)
		{
			var nIndex = i - 0;
			if(nIndex > oBBox.r2)
			{
				var col = aRows[i];
				if(null != col.merged)
					col.merged.unmerge(true);
			}
		}
	}
	else
	{
		//если выделение попало в середину мерженой области, надо раздвинуть мерженую область
		var oLeftCol = this.worksheet.getRange(new CellAddress(oBBox.r1, 0, 0), new CellAddress(oBBox.r2, gc_nMaxCol0, 0));
		oLeftCol._setPropertyNoEmpty(function(row){
			fAddHyperlinkToExpanded(oExpandedHyperlinkRange, row.hyperlinks);
		}, null, function(cell, nRow0, nCol0, nRowStart, nColStart){
			if(nRow0 >= oBBox.r1)
			{
				if(null != cell.merged)
				{
					var oMergedBBox = cell.merged.getBBox0();
					if(oMergedBBox.r1 < oBBox.r1 || (bUp && oMergedBBox.r1 == oBBox.r1 && oMergedBBox.r2 > oBBox.r2))
					{
						var sId = cell.merged.getName();
						if(null == oExpandedRange[sId])
							oExpandedRange[sId] = cell.merged;
					}
				}
				fAddHyperlinkToExpanded(oExpandedHyperlinkRange, cell.hyperlinks);
			}
		});
	}
	//сдвигаем merge и hyperlink области
	var oProcessedMerged = new Object();
	var oProcessedHyperlinks = new Object();
	var fAddToProcess = function(index, merged, hyperlinks){
		if(oBBox.r1 <= index)
		{
			if(null != merged)
			{
				if(bUp && index <= oBBox.r2)
					merged.unmerge(true);
				else
				{
					var sId = merged.getName();
					if(null == oProcessedMerged[sId] && null == oExpandedRange[sId])
						oProcessedMerged[sId] = merged;
				}
			}
			if(null != hyperlinks)
			{
				for(var i = 0,length = hyperlinks.length; i < length; ++i)
				{
					var hyperlink = hyperlinks[i];
					if(bUp && index <= oBBox.r2)
					{
						hyperlink.Ref.removeHyperlink(hyperlink);
					}
					else
					{
						var sId = hyperlink.Ref.getName();
						if(null == oProcessedHyperlinks[sId])
							oProcessedHyperlinks[sId] = hyperlink;
					}
				}
			}
		}
	};
	var oBodyRange = this.worksheet.getRange(new CellAddress(0, oBBox.c1, 0), new CellAddress(gc_nMaxRow0, oBBox.c2, 0))
	oBodyRange._setPropertyNoEmpty(function(row){
		fAddToProcess(row.index, row.merged, row.hyperlinks);
	}, null,function(cell, nRow0, nCol0, nRowStart, nColStart){
		fAddToProcess(nRow0, cell.merged, cell.hyperlinks);
	});
	for(var i in oProcessedMerged)
	{
		if(bUp)
			oProcessedMerged[i].setOffset({offsetCol:0, offsetRow:-nHeight});
		else
			oProcessedMerged[i].setOffset({offsetCol:0, offsetRow:nHeight});
	}
	for(var i in oProcessedHyperlinks)
	{
		bChangeHyperlink = true;
		if(bUp)
			oProcessedHyperlinks[i].Ref.setOffset({offsetCol:0, offsetRow:-nHeight});
		else
			oProcessedHyperlinks[i].Ref.setOffset({offsetCol:0, offsetRow:nHeight});
	}
	//сдвигаем ячейки
	if(bUp)
	{
		if(c_oRangeType.Range == nRangeType)
			this.worksheet._shiftCellsUp(oBBox);
		else
			this.worksheet._removeRows(oBBox.r1, oBBox.r2);
	}
	else
	{
		if(c_oRangeType.Range == nRangeType)
			this.worksheet._shiftCellsBottom(oBBox);
		else
			this.worksheet._insertRowsBefore(oBBox.r1, nHeight);
	}
	//возвращаем oExpandedRange
	for(var i in oExpandedRange)
	{
		var oExpanded = oExpandedRange[i];
		if(bUp)
			oExpanded.setOffsetLast({offsetCol:0, offsetRow:-nHeight});
		else
			oExpanded.setOffsetLast({offsetCol:0, offsetRow:nHeight});
		oExpanded.merge();
	}
	//возвращаем oExpandedRange
	for(var i in oExpandedHyperlinkRange)
	{
		var oExpanded = oExpandedHyperlinkRange[i];
		var oHyperlinkBBox = oExpanded.Ref.getBBox0();
		if(oHyperlinkBBox.c1 >= oBBox.c1 && oHyperlinkBBox.c2 <= oBBox.c2)
		{
			if(bUp)
				oExpanded.Ref.setOffsetLast({offsetCol:0, offsetRow:-nHeight});
			else
				oExpanded.Ref.setOffsetLast({offsetCol:0, offsetRow:nHeight});
		}
		oExpanded.Ref.setHyperlink(oExpanded, true);
	}
	if(bChangeHyperlink)
		this.worksheet.addActionHyperlink(true);
	History.EndTransaction();
	return true;
};
Range.prototype.setOffset=function(offset){//offset = {offsetCol:intNumber, offsetRow:intNumber}
	this.bbox.c1 += offset.offsetCol;
	if( this.bbox.c1 < 0 )
		this.bbox.c1 = 0;
	this.bbox.r1 += offset.offsetRow;
	if( this.bbox.r1 < 0 )
		this.bbox.r1 = 0;
	this.bbox.c2 += offset.offsetCol;
	if( this.bbox.c2 < 0 )
		this.bbox.c2 = 0;
	this.bbox.r2 += offset.offsetRow;
	if( this.bbox.r2 < 0 )
		this.bbox.r2 = 0;
	this.first = new CellAddress(this.bbox.r1, this.bbox.c1, 0);
	this.last = new CellAddress(this.bbox.r2, this.bbox.c2, 0);
}
Range.prototype.setOffsetFirst=function(offset){//offset = {offsetCol:intNumber, offsetRow:intNumber}
	this.bbox.c1 += offset.offsetCol;
	if( this.bbox.c1 < 0 )
		this.bbox.c1 = 0;
	this.bbox.r1 += offset.offsetRow;
	if( this.bbox.r1 < 0 )
		this.bbox.r1 = 0;
	this.first = new CellAddress(this.bbox.r1, this.bbox.c1, 0);
}
Range.prototype.setOffsetLast=function(offset){//offset = {offsetCol:intNumber, offsetRow:intNumber}
	this.bbox.c2 += offset.offsetCol;
	if( this.bbox.c2 < 0 )
		this.bbox.c2 = 0;
	this.bbox.r2 += offset.offsetRow;
	if( this.bbox.r2 < 0 )
		this.bbox.r2 = 0;
	this.last = new CellAddress(this.bbox.r2, this.bbox.c2, 0);
}
Range.prototype.intersect=function(range){
	var oBBox1 = this.bbox;
	var oBBox2 = range.bbox;
	var r1 = Math.max(oBBox1.r1, oBBox2.r1);
	var c1 = Math.max(oBBox1.c1, oBBox2.c1);
	var r2 = Math.min(oBBox1.r2, oBBox2.r2);
	var c2 = Math.min(oBBox1.c2, oBBox2.c2);
	if(r1 <= r2 && c1 <= c2)
		return this.worksheet.getRange3(r1, c1, r2, c2);
	return null;
}
Range.prototype.cleanFormat=function(){
	History.Create_NewPoint();
	var oBBox = this.bbox;
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	History.StartTransaction();
	this.unmerge();
	var oThis = this;
	this._setPropertyNoEmpty(function(row){
		row.setStyle(null);
		// if(row.isEmpty())
			// row.Remove();
	},function(col){
		col.setStyle(null);
		// if(col.isEmpty())
			// col.Remove();
	},function(cell, nRow0, nCol0, nRowStart, nColStart){
		cell.setStyle(null);
		// if(cell.isEmpty())
			// cell.Remove();
	});
	History.EndTransaction();
}
Range.prototype.cleanText=function(){
	History.Create_NewPoint();
	var oBBox = this.bbox;
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	History.StartTransaction();
	var oThis = this;
	this._setPropertyNoEmpty(null, null,
		function(cell, nRow0, nCol0, nRowStart, nColStart){
			cell.setValue("");
			// if(cell.isEmpty())
				// cell.Remove();
	});
	History.EndTransaction();
}
Range.prototype.cleanAll=function(){
	History.Create_NewPoint();
	var oBBox = this.bbox;
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	History.StartTransaction();
	this.unmerge();
	this.removeHyperlink();
	var oThis = this;
	this._setPropertyNoEmpty(function(row){
		row.setStyle(null);
		// if(row.isEmpty())
			// row.Remove();
	},function(col){
		col.setStyle(null);
		// if(col.isEmpty())
			// col.Remove();
	},function(cell, nRow0, nCol0, nRowStart, nColStart){
		oThis.worksheet._removeCell(nRow0, nCol0);
	});
	helpFunction(this.worksheet.workbook);
	History.EndTransaction();
}
Range.prototype.sort=function(nOption, nStartCol){
	//todo sort с замержеными ячейками.
	//todo горизонтальная сортировка
	if(null != this.hasMerged())
		return null;
	var oRes = null;
	var oThis = this;
	var bAscent = false;
	if(nOption == c_oAscSortOptions.Ascending)
		bAscent = true;
	var nRowFirst0 = this.bbox.r1;
	var nRowLast0 = this.bbox.r2;
	var nColFirst0 = this.bbox.c1;
	var nColLast0 = this.bbox.c2;
	var bWholeCol = false;
	var bWholeRow = false;
	if(0 == nRowFirst0 && gc_nMaxRow0 == nRowLast0)
		bWholeCol = true;
 	if(0 == nColFirst0 && gc_nMaxCol0 == nColLast0)
		bWholeRow = true;
	var oRangeCol = this.worksheet.getRange(new CellAddress(nRowFirst0, nStartCol, 0), new CellAddress(nRowLast0, nStartCol, 0));
	var nLastRow0 = 0;
	var nLastCol0 = nColLast0;
	if(true == bWholeRow)
	{
		nLastCol0 = 0;
		this._foreachRowNoEmpty(function(){}, function(cell){
			var nCurCol0 = cell.oId.getCol0();
			if(nCurCol0 > nLastCol0)
				nLastCol0 = nCurCol0;
		});
	}
	//собираем массив обьектов для сортировки
	var aSortElems = new Array();
	var aHiddenRow = new Object();
	var fAddSortElems = function(oCell, nRow0, nCol0,nRowStart0, nColStart0){
		//не сортируем сткрытие строки
		var row = oThis.worksheet._getRowNoEmpty(nRow0);
		if(null != row)
		{
			if(true == row.hd)
				aHiddenRow[nRow0] = 1;
			else
			{
				if(nLastRow0 < nRow0)
					nLastRow0 = nRow0;
				var val = oCell.getValueWithoutFormat();
				var nNumber = null;
				var sText = null;
				if("" != val)
				{
					var nVal = val - 0;
					if(nVal == val)
						nNumber = nVal;
					else
						sText = val;
					aSortElems.push({row: nRow0, num: nNumber, text: sText});
				}
			}
		}
	};
	if(nColFirst0 == nStartCol)
	{
		while(0 == aSortElems.length && nStartCol <= nLastCol0)
		{
			if(false == bWholeCol)
				oRangeCol._foreachNoEmpty(fAddSortElems);
			else
				oRangeCol._foreachColNoEmpty(null, fAddSortElems);
			if(0 == aSortElems.length)
			{
				nStartCol++;
				oRangeCol = this.worksheet.getRange(new CellAddress(nRowFirst0, nStartCol, 0), new CellAddress(nRowLast0, nStartCol, 0));
			}
		}
	}
	else
	{
		if(false == bWholeCol)
			oRangeCol._foreachNoEmpty(fAddSortElems);
		else
			oRangeCol._foreachColNoEmpty(null, fAddSortElems);
	}
	function strcmp ( str1, str2 ) {
			return ( ( str1 == str2 ) ? 0 : ( ( str1 > str2 ) ? 1 : -1 ) );
		}
	aSortElems.sort(function(a, b){
		var res;
		if(null != a.text)
		{
			if(null != b.text)
				res = strcmp(a.text, b.text);
			else
				res = 1;
		}
		else if(null != a.num)
		{
			if(null != b.num)
				res = a.num - b.num;
			else
				res = -1;
		}
		if(bAscent)
			return res;
		else
			return -res;
	});
	//проверяем что это не пустая операция
	var aSortData = new Array();
	var nHiddenCount = 0;
	var oFromArray = new Object();
	var nRowMax = 0;
	var nRowMin = gc_nMaxRow0;
	var nToMax = 0;
	for(var i = 0, length = aSortElems.length; i < length; ++i)
	{
		var item = aSortElems[i];
		var nNewIndex = i + nRowFirst0 + nHiddenCount;
		while(null != aHiddenRow[nNewIndex])
		{
			nHiddenCount++;
			nNewIndex = i + nRowFirst0 + nHiddenCount;
		}
		var oNewElem = new UndoRedoData_FromToRowCol(true, item.row, nNewIndex);
		oFromArray[item.row] = 1;
		if(nRowMax < item.row)
			nRowMax = item.row;
		if(nRowMax < nNewIndex)
			nRowMax = nNewIndex;
		if(nRowMin > item.row)
			nRowMin = item.row;
		if(nRowMin > nNewIndex)
			nRowMin = nNewIndex;
		if(nToMax < nNewIndex)
			nToMax = nNewIndex;
		if(oNewElem.from != oNewElem.to)
			aSortData.push(oNewElem);
	}
	if(aSortData.length > 0)
	{
		//добавляем индексы перехода пустых ячеек(нужно для сортировки комментариев)
		for(var i = nRowMin; i <= nRowMax; ++i)
		{
			if(null == oFromArray[i] && null == aHiddenRow[i])
			{
				var nFrom = i;
				var nTo = ++nToMax;
				while(null != aHiddenRow[nTo])
					nTo = ++nToMax;
				if(nFrom != nTo)
				{
					var oNewElem = new UndoRedoData_FromToRowCol(true, nFrom, nTo);
					aSortData.push(oNewElem);
				}
			}
		}
		History.Create_NewPoint();
		History.SetSelection(new Asc.Range(nColFirst0, nRowFirst0, nLastCol0, nLastRow0));
		var oUndoRedoBBox = new UndoRedoData_BBox({r1:nRowFirst0, c1:nColFirst0, r2:nLastRow0, c2:nLastCol0});
		oRes = new UndoRedoData_SortData(oUndoRedoBBox, aSortData);
		History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_Sort, this.worksheet.getId(), new Asc.Range(0, nRowFirst0, gc_nMaxCol0, nLastRow0), oRes);
		this._sortByArray(oUndoRedoBBox, aSortData, false);
	}
	return oRes;
}
Range.prototype._sortByArray=function(oBBox, aSortData, bUndo){
	//сортируются только одинарные гиперссылки, все неодинарные убираем и восстанавливаем после сортировки
	var oExpandedHyperlinkRange = new Object();
	var oSortRange = this.worksheet.getRange3(oBBox.r1, oBBox.c1, oBBox.r2, oBBox.c2);
	oSortRange._setPropertyNoEmpty(null, null, function(cell, nRow0, nCol0, nRowStart, nColStart){
		for(var i = 0, length = cell.hyperlinks.length; i < length ;++i)
		{
			var hyperlink = cell.hyperlinks[i];
			if(false == hyperlink.Ref.isOneCell())
			{
				var sId = hyperlink.Ref.getName();
				oExpandedHyperlinkRange[sId] = hyperlink;
				hyperlink.Ref.removeHyperlink(hyperlink);
			}
		}
	});
	var oSortedIndexes = new Object();
	for(var i = 0, length = aSortData.length; i < length; ++i)
	{
		var item = aSortData[i];
		var nFrom = item.from;
		var nTo = item.to;
		if(bUndo)
		{
			nFrom = item.to;
			nTo = item.from;
		}
		oSortedIndexes[nFrom] = nTo;
	}
	//окончательно устанавливаем ячейки
	var nColFirst0 = oBBox.c1;
	var nLastCol0 = oBBox.c2;
	for(var i = nColFirst0; i <= nLastCol0; ++i)
	{
		//запоминаем ячейки в которые уже что-то передвинули, чтобы не потерять их
		var oTempCellsTo = new Object();
		for(var j in oSortedIndexes)
		{
			var nIndexFrom = j - 0;
			var nIndexTo = oSortedIndexes[j];
			var shift = nIndexTo - nIndexFrom;
			var rowFrom = this.worksheet._getRow(nIndexFrom);
			var rowTo = this.worksheet._getRow(nIndexTo);
			
			var oCurCell;
			var oTempCell = oTempCellsTo[nIndexFrom];
			if(oTempCellsTo.hasOwnProperty(nIndexFrom))
				oCurCell = oTempCell;
			else
				oCurCell = rowFrom.c[i];
			oTempCellsTo[nIndexTo] = rowTo.c[i];
			if(null != oCurCell)
			{
				var lastName = oCurCell.getName();
				oCurCell.moveVer(shift);
				rowTo.c[i] = oCurCell;
				var sNewName = oCurCell.getName();
				if(oCurCell.sFormula)
				{
					oCurCell.setFormula(oCurCell.formulaParsed.changeOffset({offsetCol:0, offsetRow:shift}).assemble());//получаем новую формулу, путем сдвига входящих в нее ссылок на ячейки на offsetCol и offsetRow. не путать с shiftCells - меняет одну конкретную ячейку в формуле, changeOffset - меняет оффсет для всех входящих в формулу ячеек.
					this.worksheet.workbook.dependencyFormulas.deleteMasterNodes( this.worksheet.Id, lastName );//разрываем ссылки между старой ячейкой и ведущими ячейками для нее.
					delete this.worksheet.workbook.cwf[this.worksheet.Id].cells[lastName];
					this.worksheet._BuildDependencies({sNewName:sNewName})// строим новые зависимости для новой ячейки.
					this.worksheet._RecalculatedFunctions(sNewName);// пересчитываем новую ячейку.
				}
				else{
					sortDependency(this.worksheet, {sNewName:sNewName});
				}
			}
			else
			{
				if(null != rowTo.c[i])
				{
					//здесь достаточно простого delete, потому что на самом деле в функции ячейки только меняются местами, удаления не происходит
					delete rowTo.c[i];
					var sNewName = (new CellAddress(nIndexTo, i, 0)).getID();
					sortDependency(this.worksheet, {sNewName:sNewName});
				}
			}
		}
	}
	for(var i in oExpandedHyperlinkRange)
	{
		var hyperlink = oExpandedHyperlinkRange[i];
		hyperlink.Ref.setHyperlink(hyperlink);
	}
};
Range.prototype.promote=function(bCtrl, bVertical, nIndex){
	var oBBox = this.bbox;
	var nWidth = oBBox.c2 - oBBox.c1 + 1;
    var nHeight = oBBox.r2 - oBBox.r1 + 1;
	var bWholeCol = false;	var bWholeRow = false;
	if(0 == oBBox.r1 && gc_nMaxRow0 == oBBox.r2)
		bWholeCol = true;
 	if(0 == oBBox.c1 && gc_nMaxCol0 == oBBox.c2)
		bWholeRow = true;
	if((bWholeCol && bWholeRow) || (true == bVertical && bWholeCol) || (false == bVertical && bWholeRow))
		return;
	var oPromoteRange = null;
	if(bVertical)
	{
		if(nHeight < nIndex)
			oPromoteRange = this.worksheet.getRange3(oBBox.r2 + 1, oBBox.c1, oBBox.r2 + nIndex - nHeight, oBBox.c2);
		else if(nIndex < 0)
			oPromoteRange = this.worksheet.getRange3(oBBox.r1 - 1, oBBox.c1, oBBox.r1 + nIndex, oBBox.c2);
	}
	else
	{
		if(nWidth < nIndex)
			oPromoteRange = this.worksheet.getRange3(oBBox.r1, oBBox.c2 + 1, oBBox.r2, oBBox.c2 + nIndex - nWidth);
		else if(nIndex < 0)
			oPromoteRange = this.worksheet.getRange3(oBBox.r1, oBBox.c1 - 1, oBBox.r2, oBBox.c1 + nIndex);
	}
	if(null != oPromoteRange && oPromoteRange.hasMerged())
		return;
	lockDraw(this.worksheet.workbook);
	History.Create_NewPoint();
	var recalcArr = [];
	History.SetSelection(new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2));
	History.StartTransaction();
    
	if((true == bVertical && 1 == nHeight) || (false == bVertical && 1 == nWidth))
		bCtrl = !bCtrl;
    if(true == bVertical)
    {
		//todo слишком простое решение, возможно в случае строки надо создавать массив колонок
		var nLastCol = oBBox.c2;
		if(bWholeRow)
		{
			nLastCol = 0;
			this._foreachRowNoEmpty(function(){}, function(cell){
				var nCurCol0 = cell.oId.getCol0();
				if(nCurCol0 > nLastCol0)
					nLastCol0 = nCurCol0;
			});
		}
        if(nIndex >= 0 && nHeight > nIndex)
        {
			//удаляем содержимое
            for(var i = oBBox.c1; i <= nLastCol; ++i)
            {
                for(var j = oBBox.r1 + nIndex; j <= oBBox.r2; ++j)
                {
                    var oCurCell = this.worksheet._getCellNoEmpty(j, i);
                    if(null != oCurCell)
                        oCurCell.setValue("");
                }
            }
        }
        else
        {
            //копируем содержимое
            for(var i = oBBox.c1; i <= nLastCol; ++i)
            {
                //пробегаемся по диапазону запоминаем ячеек смотрим какие из них числа
                var aCells = new Array();
				var oPromoteHelper = new PromoteHelper();
                for(var j = oBBox.r1; j <= oBBox.r2; ++j)
                {
                    var oCurCell = this.worksheet._getCellNoEmpty(j, i);
                    var nVal = null, nF = null;
                    if(null != oCurCell)
                    {
						if (!oCurCell.sFormula)
                        {
							var nType = oCurCell.getType();
							if(CellValueType.Number == nType)
							{
                                var sValue = oCurCell.getValueWithoutFormat();
                                if("" != sValue)
                                {
                                    nVal = sValue - 0;
									oPromoteHelper.add(nVal);
                                }
                            }
							else
								oPromoteHelper.finishSection();
						}
						else{
							nF = true;
						}
                    }
                    aCells.push({digit: nVal, cell: oCurCell, formula:nF});
                }
				oPromoteHelper.finishAdd();
                var bExistDigit = false;
                if(false == bCtrl && false == oPromoteHelper.isEmpty())
                {
                    bExistDigit = true;
					oPromoteHelper.calc();
                }
                var nCellsLength = aCells.length;
                var nCellsIndex;
                var nStart;
                var nEnd;
                var nDj;
                var nDCellsIndex;
                var fCondition;
                if(nIndex > 0)
                {
                    nStart = oBBox.r2 + 1;
                    nEnd = oBBox.r2 + (nIndex - nHeight + 1);
                    nCellsIndex = 0;
                    nDj = 1;
                    nDCellsIndex = 1;
                    fCondition = function(j , nEnd){return j <= nEnd;}
                }
                else
                {
					oPromoteHelper.reverse();
                    nStart = oBBox.r1 - 1;
                    nEnd = oBBox.r1 + nIndex;
                    if(nEnd < 0)
                        nEnd = 0;
                    nCellsIndex = nCellsLength - 1;
                    nDj = -1;
                    nDCellsIndex = -1;
                    fCondition = function(j , nEnd){return j >= nEnd;}
                }
                for(var j = nStart; fCondition(j, nEnd); j += nDj)
                {
                    var oCurItem = aCells[nCellsIndex];
                    //удаляем текущее содержимое ячейки
                    var oCurCell = this.worksheet._getCellNoEmpty(j, i);
                    if(null != oCurCell){
						this.worksheet._removeCell(j, i);
					}
                    if(null != oCurItem.cell)
                    {
                        var oCopyCell = this.worksheet._getCell(j, i);
                        oCopyCell.setStyle(oCurItem.cell.getStyle());
                        oCopyCell.setType(oCurItem.cell.getType());
                        if(bExistDigit && null != oCurItem.digit)
                        {
							var dNewValue = oPromoteHelper.getNext();
                            oCopyCell.setValue(dNewValue + "");
                        }
                        else
                        {
                            //копируем полностью
							if(!oCurItem.formula){
								var DataOld = oCopyCell.getValueData();
								oCopyCell.oValue = oCurItem.cell.oValue.clone(oCopyCell);
								var DataNew = oCopyCell.getValueData();
								if(false == DataOld.isEqual(DataNew))
									History.Add(g_oUndoRedoCell, historyitem_Cell_ChangeValue, this.worksheet.getId(), new Asc.Range(0, oCopyCell.oId.getRow0(), gc_nMaxCol0, oCopyCell.oId.getRow0()), new UndoRedoData_CellSimpleData(oCopyCell.oId.getRow0(), oCopyCell.oId.getCol0(), DataOld, DataNew));
								//todo
								// if(oCopyCell.isEmptyTextString())
									// this.worksheet._getHyperlink().remove({r1: oCopyCell.oId.getRow0(), c1: oCopyCell.oId.getCol0(), r2: oCopyCell.oId.getRow0(), c2: oCopyCell.oId.getCol0()});
								
								if( !arrRecalc[this.worksheet.getId()] ){
									arrRecalc[this.worksheet.getId()] = {};
								}
								arrRecalc[this.worksheet.getId()][oCopyCell.getName()] = oCopyCell.getName();
								this.worksheet.workbook.needRecalc[ getVertexId(this.worksheet.getId(),oCopyCell.getName()) ] = [ this.worksheet.getId(),oCopyCell.getName() ];
								if( this.worksheet.workbook.needRecalc.length < 0) this.worksheet.workbook.needRecalc.length = 0;
								this.worksheet.workbook.needRecalc.length++;
							}
							else{
								var assemb;
								var _p_ = new parserFormula(oCurItem.cell.sFormula,oCopyCell.getName(),this.worksheet);
								if( _p_.parse() ){
									assemb = _p_.changeOffset(oCopyCell.getOffset2(oCurItem.cell.getName())).assemble();
									oCopyCell.setValue("="+assemb);
									
								}
								this.worksheet.workbook.needRecalc[ getVertexId(this.worksheet.getId(),oCopyCell.getName()) ] = [ this.worksheet.getId(),oCopyCell.getName() ];
								if( this.worksheet.workbook.needRecalc.length < 0) this.worksheet.workbook.needRecalc.length = 0;
								this.worksheet.workbook.needRecalc.length++;
							}
                        }
                    }
                    
                    nCellsIndex += nDCellsIndex;
                    if(nDCellsIndex > 0 && nCellsIndex >= nCellsLength)
                        nCellsIndex = 0;
                    else if(nCellsIndex < 0)
                        nCellsIndex = nCellsLength - 1;
                        
                }
            }
		}
    }
	else
	{
		var nLastRow = oBBox.r2;
		if(bWholeCol)
		{
			nLastRow = 0;
			this._foreachColNoEmpty(function(){}, function(cell){
				var nCurRow0 = cell.oId.getRow0();
				if(nCurRow0 > nLastRow)
					nLastRow = nCurRow0;
			});
		}
		if(nIndex >= 0 && nWidth > nIndex)
        {
			//удаляем содержимое
            for(var i = oBBox.r1; i <= nLastRow; ++i)
            {
                for(var j = oBBox.c1 + nIndex; j <= oBBox.c2; ++j)
                {
                    var oCurCell = this.worksheet._getCellNoEmpty(i, j);
                    if(null != oCurCell)
                        oCurCell.setValue("");
                }
            }
        }
		else
        {
            //копируем содержимое
            for(var i = oBBox.r1; i <= nLastRow; ++i)
            {
                //пробегаемся по диапазону запоминаем ячеек смотрим какие из них числа
                var aCells = new Array();
				var oPromoteHelper = new PromoteHelper();
                for(var j = oBBox.c1; j <= oBBox.c2; ++j)
                {
                    var oCurCell = this.worksheet._getCellNoEmpty(i, j);
                    var nVal = null, nF = null;
                    if(null != oCurCell)
                    {
                        if (!oCurCell.sFormula)
						{
							var nType = oCurCell.getType();
							if(CellValueType.Number == nType)
							{
								var sValue = oCurCell.getValueWithoutFormat();
                                if("" != sValue)
                                {
                                    nVal = sValue - 0;
									oPromoteHelper.add(nVal);
                                }
                            }
							else
								oPromoteHelper.finishSection();
                        }
						else{
							nF = true;
						}
                    }
                    aCells.push({digit: nVal, cell: oCurCell, formula:nF});
                }
				oPromoteHelper.finishAdd();
                var bExistDigit = false;
                if(false == bCtrl && false == oPromoteHelper.isEmpty())
                {
                    bExistDigit = true;
					oPromoteHelper.calc();
                }
                var nCellsLength = aCells.length;
                var nCellsIndex;
                var nStart;
                var nEnd;
                var nDj;
                var nDCellsIndex;
                var fCondition;
                if(nIndex > 0)
                {
                    nStart = oBBox.c2 + 1;
                    nEnd = oBBox.c2 + (nIndex - nWidth + 1);
                    nCellsIndex = 0;
                    nDj = 1;
                    nDCellsIndex = 1;
                    fCondition = function(j , nEnd){return j <= nEnd;}
                }
                else
                {
					oPromoteHelper.reverse();
                    nStart = oBBox.c1 - 1;
                    nEnd = oBBox.c1 + nIndex;
                    if(nEnd < 0)
                        nEnd = 0;
                    nCellsIndex = nCellsLength - 1;
                    nDj = -1;
                    nDCellsIndex = -1;
                    fCondition = function(j , nEnd){return j >= nEnd;}
                }
                for(var j = nStart; fCondition(j, nEnd); j += nDj)
                {
                    var oCurItem = aCells[nCellsIndex];
                    //удаляем текущее содержимое ячейки
                    var oCurCell = this.worksheet._getCellNoEmpty(i, j);
                    if(null != oCurCell)
						this.worksheet._removeCell(i, j);
                    if(null != oCurItem.cell)
                    {
                        var oCopyCell = this.worksheet._getCell(i, j);
                        oCopyCell.setStyle(oCurItem.cell.getStyle());
                        oCopyCell.setType(oCurItem.cell.getType());
                        if(bExistDigit && null != oCurItem.digit)
                        {
							var dNewValue = oPromoteHelper.getNext();
                            oCopyCell.setValue(dNewValue + "");
                        }
                        else
                        {
                            //копируем полностью
							if(!oCurItem.formula){
								var DataOld = oCopyCell.getValueData();
								oCopyCell.oValue = oCurItem.cell.oValue.clone(oCopyCell);
								var DataNew = oCopyCell.getValueData();
								if(false == DataOld.isEqual(DataNew))
									History.Add(g_oUndoRedoCell, historyitem_Cell_ChangeValue, this.worksheet.getId(), new Asc.Range(0, oCopyCell.oId.getRow0(), gc_nMaxCol0, oCopyCell.oId.getRow0()), new UndoRedoData_CellSimpleData(oCopyCell.oId.getRow0(), oCopyCell.oId.getCol0(), DataOld, DataNew));
								//todo
								// if(oCopyCell.isEmptyTextString())
									// this.worksheet._getHyperlink().remove({r1: oCopyCell.oId.getRow0(), c1: oCopyCell.oId.getCol0(), r2: oCopyCell.oId.getRow0(), c2: oCopyCell.oId.getCol0()});
								
								if( !arrRecalc[this.worksheet.getId()] ){
									arrRecalc[this.worksheet.getId()] = {};
								}
								arrRecalc[this.worksheet.getId()][oCopyCell.getName()] = oCopyCell.getName();
								this.worksheet.workbook.needRecalc[ getVertexId(this.worksheet.getId(),oCopyCell.getName()) ] = [ this.worksheet.getId(),oCopyCell.getName() ];
								if( this.worksheet.workbook.needRecalc.length < 0) this.worksheet.workbook.needRecalc.length = 0;
								this.worksheet.workbook.needRecalc.length++;
							}
							else{
								var assemb;
								var _p_ = new parserFormula(oCurItem.cell.sFormula,oCopyCell.getName(),this.worksheet);
								if( _p_.parse() ){
									assemb = _p_.changeOffset(oCopyCell.getOffset2(oCurItem.cell.getName())).assemble();
									oCopyCell.setValue("="+assemb);
								}
								this.worksheet.workbook.needRecalc[ getVertexId(this.worksheet.getId(),oCopyCell.getName()) ] = [ this.worksheet.getId(),oCopyCell.getName() ];
								if( this.worksheet.workbook.needRecalc.length < 0) this.worksheet.workbook.needRecalc.length = 0;
								this.worksheet.workbook.needRecalc.length++;
							}
                        }
                    }
                    
                    nCellsIndex += nDCellsIndex;
                    if(nDCellsIndex > 0 && nCellsIndex >= nCellsLength)
                        nCellsIndex = 0;
                    else if(nCellsIndex < 0)
                        nCellsIndex = nCellsLength - 1;
                }
            }
		}
	}
	History.EndTransaction();
	helpFunction(this.worksheet.workbook);
	unLockDraw(this.worksheet.workbook);
}
Range.prototype.createCellOnRowColCross=function(){
	var oThis = this;
	var bbox = this.bbox;
	var nRangeType = this._getRangeType(bbox);
	if(c_oRangeType.Row == nRangeType)
	{
		this._foreachColNoEmpty(function(col){
			for(var i = bbox.r1; i <= bbox.r2; ++i)
				oThis.worksheet._getCell(i, col.index);
		}, null);
	}
	else if(c_oRangeType.Col == nRangeType)
	{
		this._foreachRowNoEmpty(function(row){
			for(var i = bbox.c1; i <= bbox.c2; ++i)
				oThis.worksheet._getCell(row.index, i);
		}, null);
	}
}
//-------------------------------------------------------------------------------------------------
/**
 * @constructor
 */
function PromoteHelper(){
	//для открытия 
	this.aCurDigits = new Array();
	//для get
	this.nCurSequence = 0;
	this.nCurSequenceIndex = 0;
	this.nDx = 1;
	//общее
	this.aSequence = new Array();
	this.nSequenceLength = 0;
};
PromoteHelper.prototype = {
	add: function(dVal){
		this.aCurDigits.push(dVal);
	},
	finishSection: function()
	{
		if(this.aCurDigits.length > 0)
		{
			this.aSequence.push({digits: this.aCurDigits, a0: 0, a1: 0, nX: 0, length: this.aCurDigits.length});
			this.aCurDigits = new Array();
		}
	},
	finishAdd: function(){
		if(this.aCurDigits.length > 0)
			this.aSequence.push({digits: this.aCurDigits, a0: 0, a1: 0, nX: 0, length: this.aCurDigits.length});
		this.nSequenceLength = this.aSequence.length;
	},
	isEmpty : function()
	{
		return 0 == this.nSequenceLength;
	},
	calc: function(){
		for(var i = 0, length = this.aSequence.length; i < length; ++i)
		{
			var sequence = this.aSequence[i];
			var sequenceParams = this._promoteSequence(sequence.digits);
			sequence.a0 = sequenceParams.a0;
			sequence.a1 = sequenceParams.a1;
			sequence.nX = sequenceParams.nX;
		}
	},
	reverse: function(){
		if(this.isEmpty())
			return;
		this.nCurSequence = this.nSequenceLength - 1;
		this.nCurSequenceIndex = this.aSequence[this.nCurSequence].length - 1;
		this.nDx = -1;
		for(var i = 0, length = this.aSequence.length; i < length; ++i)
			this.aSequence[i].nX = -1;
	},
	getNext: function(){
		var sequence = this.aSequence[this.nCurSequence];
		var dNewVal = sequence.a1 * sequence.nX + sequence.a0;
		sequence.nX += this.nDx;
		this.nCurSequenceIndex += this.nDx;
        if(this.nDx > 0)
		{
			if(this.nCurSequenceIndex >= sequence.length)
			{
				this.nCurSequenceIndex = 0;
				this.nCurSequence++;
				if(this.nCurSequence >= this.nSequenceLength)
					this.nCurSequence = 0;
			}
		}
        else
		{
			if(this.nCurSequenceIndex < 0)
			{
				this.nCurSequence--;
				if(this.nCurSequence < 0)
					this.nCurSequence = this.nSequenceLength - 1;
				this.nCurSequenceIndex = this.aSequence[this.nCurSequence].length - 1;
			}
		}
		return dNewVal
	},
	_promoteSequence: function(aDigits){
		// Это коэффициенты линейного приближения (http://office.microsoft.com/ru-ru/excel-help/HP010072685.aspx)
		// y=a1*x+a0 (где: x=0,1....; y=значения в ячейках; a0 и a1 - это решения приближения функции методом наименьших квадратов
		// (n+1)*a0        + (x0+x1+....)      *a1=(y0+y1+...)
		// (x0+x1+....)*a0 + (x0*x0+x1*x1+....)*a1=(y0*x0+y1*x1+...)
		// http://www.exponenta.ru/educat/class/courses/vvm/theme_7/theory.asp
		var a0 = 0.0;
		var a1 = 0.0;
		// Индекс X
		var nX = 0;
		if(1 == aDigits.length)
		{
			nX = 1;
			a1 = 1;
			a0 = aDigits[0];
		}
		else
		{
			// (n+1)
			var nN = aDigits.length;
			// (x0+x1+....)
			var nXi = 0;
			// (x0*x0+x1*x1+....)
			var nXiXi = 0;
			// (y0+y1+...)
			var dYi = 0.0;
			// (y0*x0+y1*x1+...)
			var dYiXi = 0.0;

			// Цикл по всем строкам
			for (var i = 0, length = aDigits.length; i < length; ++i, ++nX)
			{
				var dValue = aDigits[i];

				// Вычисляем значения
				nXi += nX;
				nXiXi += nX * nX;
				dYi += dValue;
				dYiXi += dValue * nX;
			}

			// Теперь решаем систему уравнений
			// Общий детерминант
			var dD = nN * nXiXi - nXi * nXi;
			// Детерминант первого корня
			var dD1 = dYi * nXiXi - nXi * dYiXi;
			// Детерминант второго корня
			var dD2 = nN * dYiXi - dYi * nXi;

			a0 = dD1 / dD;
			a1 = dD2 / dD;
		}
		return {a0: a0, a1: a1, nX: nX};
	}
};