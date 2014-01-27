var d1,d2,d3;
var g_nHSLMaxValue = 240;
var g_nVerticalTextAngle = 255;
var gc_dDefaultColWidthCharsAttribute;//определяется в WorksheetView.js
var gc_dDefaultRowHeightAttribute;//определяется в WorksheetView.js
var g_nNextWorksheetId = 1;
var g_sNewSheetNamePattern = "Sheet";
var g_nSheetNameMaxLength = 31;
var g_nAllColIndex = -1;
var History;
var aStandartNumFormats;
var aStandartNumFormatsId;
var start, end, cCharDelimiter = String.fromCharCode(5), arrRecalc = {}, lc = 0;

var c_oRangeType =
{
    Range:0,
    Col:1,
    Row:2,
	All:3
};
function getRangeType(oBBox){
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

function consolelog(text){
	if( window.g_debug_mode && console && console.log )
		console.log(text);
}

/** @constructor */
function DependencyGraph( wb ) {
    this.wb = wb;
    this.nodesId = null;
    this.nodesCell = null;
    this.nodesArea = null;
    this.nodeslength = null;
	this.bSetRefError = false;
    this.clear();
}
DependencyGraph.prototype = {
    clear:function () {
        this.nodesId = {};
        this.nodesCell = {};
        this.nodesArea = {};
        this.nodeslength = 0;
		this.bSetRefError = false;
    },
    nodeExist:function ( node ) {
        return this.nodeExist2( node.sheetId, node.cellId );
    },
    nodeExist2:function ( sheetId, cellId ) {
        return null != this.getNode( sheetId, cellId );
    },
    nodeExistWithArea:function ( sheetId, cellId ) {
        var bRes = this.nodeExist2( sheetId, cellId );
        if ( !bRes ) {
            var nodesSheetArea = this.nodesArea[sheetId];
            if ( null != nodesSheetArea ) {
                var bbox = Asc.g_oRangeCache.getAscRange( cellId );
                bRes = nodesSheetArea.get( bbox ).all.length > 0;
            }
        }
        return bRes;
    },
    getNode2:function ( node ) {
        return this.nodesId[node.nodeId];
    },
    getNode:function ( sheetId, cellId ) {
        return this.nodesId[getVertexId( sheetId, cellId )];
    },
    addNode2:function ( node ) {
        return this.addNode( node.sheetId, node.cellId );
    },
    addNode:function ( sheetId, cellId ) {
		var _this = this;
        var nodeId = getVertexId( sheetId, cellId )
        var oRes = this.nodesId[nodeId];
        if ( null == oRes ) {
            var node = new Vertex( sheetId, cellId, this.wb )
            var oBBoxNode = node.getBBox();
            if ( node.isArea ) {
                var nodesSheetArea = this.nodesArea[node.sheetId];
                if ( null == nodesSheetArea ) {
					nodesSheetArea = new RangeDataManager(function(data, from, to){_this._changeNode(data, from, to);});
                    this.nodesArea[node.sheetId] = nodesSheetArea;
                }
                nodesSheetArea.add( oBBoxNode, node );
            }
            else {
                var nodesSheetCell = this.nodesCell[node.sheetId];
                if ( null == nodesSheetCell ) {
					nodesSheetCell = new CellArea(function(data, from, to){_this._changeNode(data, from, to);});
                    this.nodesCell[node.sheetId] = nodesSheetCell;
                }
                nodesSheetCell.add( oBBoxNode.r1, oBBoxNode.c1, node );
            }
            oRes = node;
        }
        return oRes;
    },
    addEdge2:function ( nodeFrom, nodeTo ) {
        nodeFrom.addMasterEdge( nodeTo );
        nodeTo.addSlaveEdge( nodeFrom );
    },
    addEdge:function ( sheetIdFrom, cellIdFrom, sheetIdTo, cellIdTo ) {
        var n1 = this.addNode( sheetIdFrom, cellIdFrom ),
            n2 = this.addNode( sheetIdTo, cellIdTo );
        this.addEdge2( n1, n2 );
    },
    getNodeBySheetId:function ( sheetId ) {
        var arr = [];
        var nodesSheetCell = this.nodesCell[sheetId];
        if ( nodesSheetCell ) {
            var aNodes = nodesSheetCell.getAll();
            for ( var i = 0, length = aNodes.length; i < length; i++ ) {
                var node = aNodes[i].data;
                var n = node.getSlaveEdges();
                if ( n ) {
                    arr.push( node );
                    for ( var id2 in n ) {
                        n[id2].weightNode++;
                        // arr.push(n[id2]);
                    }
                }
            }
        }
		var nodesSheetArea = this.nodesArea[sheetId];
        if ( nodesSheetArea ) {
            var aNodes = nodesSheetArea.getAll();
            for ( var i = 0, length = aNodes.length; i < length; i++ ) {
                var node = aNodes[i].data;
                var n = node.getSlaveEdges();
                if ( n ) {
                    arr.push( node );
                    for ( var id2 in n ) {
                        n[id2].weightNode++;
                        // arr.push(n[id2]);
                    }
                }
            }
        }
        return arr;
    },
    getNodeBySheetIdAll:function ( sheetId ) {
        var arr = [];
        var nodesSheetCell = this.nodesCell[sheetId];
        if ( nodesSheetCell ) {
            var aNodes = nodesSheetCell.getAll();
            for ( var i = 0, length = aNodes.length; i < length; i++ ) {
                arr.push( aNodes[i].data );
            }
        }
		var nodesSheetArea = this.nodesArea[sheetId];
        if ( nodesSheetArea ) {
            var aNodes = nodesSheetArea.getAll();
            for ( var i = 0, length = aNodes.length; i < length; i++ ) {
                arr.push( aNodes[i].data );
            }
        }
        return arr;
    },
	deleteNode : function(node){
            if ( node.isArea ) {
			var nodesSheetArea = this.nodesArea[node.sheetId];
			if(nodesSheetArea)
				nodesSheetArea.removeElement(new RangeDataManagerElem(node.getBBox(), node));
		}
            else {
			var nodesSheetCell = this.nodesCell[node.sheetId];
				if(nodesSheetCell)
					nodesSheetCell.removeElement(new RangeDataManagerElem(node.getBBox(), node));
			}
	},
	deleteNodes : function(sheetId, bbox){
		var bSetRefErrorOld = this.bSetRefError;
		this.bSetRefError = true;
		var nodesSheetArea = this.nodesArea[sheetId];
		var oGetRes;
		if(nodesSheetArea)
		{
			oGetRes = nodesSheetArea.get(bbox);
			for(var i = 0, length = oGetRes.inner.length; i < length; ++i)
				nodesSheetArea.removeElement(oGetRes.inner[i]);
        }
		var nodesSheetCell = this.nodesCell[sheetId];
		if(nodesSheetCell)
		{
			oGetRes = nodesSheetCell.get(bbox);
			for(var i = 0, length = oGetRes.length; i < length; ++i)
				nodesSheetCell.removeElement(oGetRes[i]);
		}
		this.bSetRefError = bSetRefErrorOld;
    },
    deleteMasterNodes:function ( sheetId, cellId ) {
        var node = this.getNode( sheetId, cellId );
        if ( node ) {
            var arr = node.deleteAllMasterEdges();
            for ( var i in arr ) {
                var nodeMaster = arr[i];
                if ( nodeMaster.refCount <= 0 )
                    this.deleteNode( nodeMaster );
            }
        }
		return node;
    },
	deleteMasterNodes2 : function(sheetId, cellId){
		var node = this.deleteMasterNodes(sheetId, cellId);
		if(node && node.refCount <= 0)
			this.deleteNode(node);
		return node;
	},
    getSlaveNodes:function ( sheetId, cellId ) {
        //todo
        return null;
    },
    getMasterNodes:function ( sheetId, cellId ) {
        //todo
        return null;
    },
    getNodesLength:function () {
        return this.nodeslength;
    },
    checkOffset:function ( BBox, offset, wsId, noDelete ) {
        var _this = this;
        var bHor = 0 != offset.offsetCol;
        var toDelete = offset.offsetCol < 0 || offset.offsetRow < 0;
		var bSetRefErrorOld = this.bSetRefError;
		this.bSetRefError = true;
		var oShiftGetBBox = shiftGetBBox(BBox, bHor);
		var sShiftGetBBoxName = oShiftGetBBox.getName();
		this.wb.needRecalc.nodes[getVertexId(wsId, sShiftGetBBoxName)] = [wsId, sShiftGetBBoxName];
		this.wb.needRecalc.length++;
        var nodesSheetArea = this.nodesArea[wsId];
		if(nodesSheetArea)
			nodesSheetArea.shift(BBox, !toDelete, bHor);
        var nodesSheetCell = this.nodesCell[wsId];
		if(nodesSheetCell)
            nodesSheetCell.shift( BBox, !toDelete, bHor );
		this.bSetRefError = bSetRefErrorOld;
    },
	_changeNode : function(node, from, to)
	{
        var toDelete = null == to;
		var toAdd = null == from;
		var wsId = node.sheetId;
		var sOldCellId = node.cellId;
		if(toAdd)
		{
			this.nodesId[node.nodeId] = node;
			this.nodeslength++;
		}
		else if(toDelete)
		{
			var oSlaves = node.deleteAllSlaveEdges();
			if(this.bSetRefError)
			{
				//выставляем #REF!
				for(var i in oSlaves)
				{
					var slave = oSlaves[i];
					slave.setRefError(wsId, node.cellId);
				}
			}
			this.deleteMasterNodes(node.sheetId, node.cellId);
			delete this.nodesId[node.nodeId];
			this.nodeslength--;
		}
        else {
            var sOldnodeId = node.nodeId;
			if((from.r1 == to.r1 && from.c1 == to.c1) || (from.r2 == to.r2 && from.c2 == to.c2))
				node.moveStretch(to);
            else
				node.move({offsetCol: to.c1 - from.c1, offsetRow: to.r1 - from.r1}, wsId, toDelete);

            delete this.nodesId[sOldnodeId];
            this.nodesId[node.nodeId] = node;
		}
		//важно что ячейки уже сдвинулись, поэтому до вызова returnCell нужно сделать node.move
		if(!node.isArea)
		{
            var cwf = this.wb.cwf[wsId];
			if(cwf)
			{
				if(!toAdd)
					delete cwf.cells[sOldCellId];
				if(!toDelete)
				{
					var cell = node.returnCell();
					if ( cell && cell.formulaParsed )
						cwf.cells[node.cellId] = node.cellId;
				}
            }
        }
    },
	getCellInRange : function(sheetId, bbox){
		var res = [], oGetRes, nodesSheetCell = this.nodesCell[sheetId];
        if ( nodesSheetCell ) {
			oGetRes = nodesSheetCell.get(bbox);
            for ( var i = 0, length = oGetRes.length; i < length; i++ ) {
                elem = oGetRes[i];
				res.push(elem.data);
            }
        }
		return res;
	},
	getAreaInRange : function(sheetId, bbox){
		var res = [], oGetRes, nodesSheetArea = this.nodesArea[sheetId];
		if(nodesSheetArea)
		{
			oGetRes = nodesSheetArea.get(bbox);
			for(var i = 0, length = oGetRes.all.length; i < length; i++)
			{
				elem = oGetRes.all[i];
				res.push(elem.data);
            }
		}
		return res;
    },
	getInRange : function(sheetId, bbox){
		return this.getCellInRange(sheetId, bbox).concat(this.getAreaInRange(sheetId, bbox));
	},
	helper : function(BBoxFrom, oBBoxTo, wsId){
		var oGetRes, node, nodesSheetCell = this.nodesCell[wsId], nodesSheetArea = this.nodesArea[wsId];
		var offset = {offsetCol: oBBoxTo.c1 - BBoxFrom.c1, offsetRow: oBBoxTo.r1 - BBoxFrom.r1};
		var elem, bbox;
		if(nodesSheetCell)
			oGetRes = nodesSheetCell.move(BBoxFrom, oBBoxTo);
		if(nodesSheetArea)
			oGetRes = nodesSheetArea.move(BBoxFrom, oBBoxTo);
	},
    drawDep:function ( cellId, se ) {
        // ToDo неиспользуемая функция, реализовать после выпуска
        if ( !cellId )
            return;
        var _wsV = this.wb.oApi.wb.getWorksheet(),
            _getCellMetrics = _wsV.cellCommentator.getCellMetrics,
            _cc = _wsV.cellCommentator,
            ctx = _wsV.overlayCtx,
            _wsVM = _wsV.model,
            nodeId = getVertexId( _wsVM.getId(), cellId ),
            node = this.getNode( _wsVM.getId(), cellId ),
            cell;

        function gCM( _this, col, row ) {
            var metrics = { top:0, left:0, width:0, height:0, result:false }; 	// px

            var fvr = _this.getFirstVisibleRow();
            var fvc = _this.getFirstVisibleCol();
            var mergedRange = _wsVM.getMergedByCell( row, col );

            if ( mergedRange && (fvc < mergedRange.c2) && (fvr < mergedRange.r2) ) {

                var startCol = (mergedRange.c1 > fvc) ? mergedRange.c1 : fvc;
                var startRow = (mergedRange.r1 > fvr) ? mergedRange.r1 : fvr;

                metrics.top = _this.getCellTop( startRow, 0 ) - _this.getCellTop( fvr, 0 ) + _this.getCellTop( 0, 0 );
                metrics.left = _this.getCellLeft( startCol, 0 ) - _this.getCellLeft( fvc, 0 ) + _this.getCellLeft( 0, 0 );

                for ( var i = startCol; i <= mergedRange.c2; i++ ) {
                    metrics.width += _this.getColumnWidth( i, 0 )
                }
                for ( var i = startRow; i <= mergedRange.r2; i++ ) {
                    metrics.height += _this.getRowHeight( i, 0 )
                }
                metrics.result = true;
            }
            else {

                metrics.top = _this.getCellTop( row, 0 ) - _this.getCellTop( fvr, 0 ) + _this.getCellTop( 0, 0 );
                metrics.left = _this.getCellLeft( col, 0 ) - _this.getCellLeft( fvc, 0 ) + _this.getCellLeft( 0, 0 );
                metrics.width = _this.getColumnWidth( col, 0 );
                metrics.height = _this.getRowHeight( row, 0 );
                metrics.result = true;
            }

            return metrics;
        }

        if ( !node )
            return;

        cell = node.returnCell();

        if ( !cell )
            return;

        var m = [cell.getCellAddress().getRow0(), cell.getCellAddress().getCol0()],
            rc = [], me = se ? node.getSlaveEdges() : node.getMasterEdges();

        for ( var id in me ) {
            if ( me[id].sheetId != node.sheetId )
                return;

            if ( !me[id].isArea ) {
                var _t1 = gCM( _wsV, me[id].returnCell().getCellAddress().getCol0(), me[id].returnCell().getCellAddress().getRow0() )

                rc.push( { t:_t1.top, l:_t1.left, w:_t1.width, h:_t1.height, apt:_t1.top + _t1.height / 2, apl:_t1.left + _t1.width / 4} );
            }
            else {
                var _t1 = gCM( _wsV, me[id].getBBox().c1, me[id].getBBox().r1 ),
                    _t2 = gCM( _wsV, me[id].getBBox().c2, me[id].getBBox().r2 );

                rc.push( { t:_t1.top, l:_t1.left, w:_t2.left + _t2.width - _t1.left, h:_t2.top + _t2.height - _t1.top, apt:_t1.top + _t1.height / 2, apl:_t1.left + _t1.width / 4  } );
            }
        }

        if ( rc.length == 0 )
            return;

        var color = new CColor( 0, 0, 255 );

        function draw_arrow( context, fromx, fromy, tox, toy ) {
            var headlen = 9;
            var dx = tox - fromx;
            var dy = toy - fromy;
            var angle = Math.atan2( dy, dx ), _a = Math.PI / 18;
            // ToDo посмотреть на четкость moveTo, lineTo
            context.save()
                .setLineWidth( 1 )
                .beginPath()
                .moveTo( _cc.pxToPt( fromx ), _cc.pxToPt( fromy ) )
                .lineTo( _cc.pxToPt( tox ), _cc.pxToPt( toy ) );
            // .dashLine(_cc.pxToPt(fromx-.5), _cc.pxToPt(fromy-.5), _cc.pxToPt(tox-.5), _cc.pxToPt(toy-.5), 15, 5)
            context
                .moveTo(
                _cc.pxToPt( tox - headlen * Math.cos( angle - _a ) ),
                _cc.pxToPt( toy - headlen * Math.sin( angle - _a ) ) )
                .lineTo( _cc.pxToPt( tox ), _cc.pxToPt( toy ) )
                .lineTo(
                _cc.pxToPt( tox - headlen * Math.cos( angle + _a ) ),
                _cc.pxToPt( toy - headlen * Math.sin( angle + _a ) ) )
                .lineTo(
                _cc.pxToPt( tox - headlen * Math.cos( angle - _a ) ),
                _cc.pxToPt( toy - headlen * Math.sin( angle - _a ) ) )
                .setStrokeStyle( color )
                .setFillStyle( color )
                .stroke()
                .fill()
                .closePath()
                .restore();
        }

        function h( m, rc ) {
            var m = gCM( _wsV, m[1], m[0] );
            var arrowPointTop = 10, arrowPointLeft = 10;
            for ( var i = 0; i < rc.length; i++ ) {
                var m2 = rc[i],
                    x1 = Math.floor( m2.apl ),
                    y1 = Math.floor( m2.apt ),
                    x2 = Math.floor( m.left + m.width / 4 ),
                    y2 = Math.floor( m.top + m.height / 2 );

                if ( x1 < 0 && x2 < 0 || y1 < 0 && y2 < 0 )
                    continue;

                // ToDo посмотреть на четкость rect
                if ( m2.apl > 0 && m2.apt > 0 )
                    ctx.save()
                        .setLineWidth( 1 )
                        .setStrokeStyle( color )
                        .rect( _cc.pxToPt( m2.l ), _cc.pxToPt( m2.t ), _cc.pxToPt( m2.w - 1 ), _cc.pxToPt( m2.h - 1 ) )
                        .stroke()
                        .restore();
                if ( y1 < 0 && x1 != x2 )
                    x1 = x1 - Math.floor( Math.sqrt( ((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) * y1 * y1 / ((y2 - y1) * (y2 - y1)) ) / 2 )
                if ( x1 < 0 && y1 != y2 )
                    y1 = y1 - Math.floor( Math.sqrt( ((y1 - y2) * (y1 - y2) + (x1 - x2) * (x1 - x2)) * x1 * x1 / ((x2 - x1) * (x2 - x1)) ) / 2 )

                draw_arrow( ctx, x1 < 0 ? _wsV.getCellLeft( 0, 0 ) : x1, y1 < 0 ? _wsV.getCellTop( 0, 0 ) : y1, x2, y2 );

                if ( m2.apl > 0 && m2.apt > 0 )
                    ctx.save()
                        .beginPath()
                        .arc( _cc.pxToPt( Math.floor( m2.apl ) ),
                        _cc.pxToPt( Math.floor( m2.apt ) ),
                        3, 0, 2 * Math.PI, false, -0.5, -0.5 )
                        .setFillStyle( color )
                        .fill()
                        .closePath()
                        .restore();
            }
        }

        ctx.clear();
        _wsV._drawSelection();

        if ( se ) {
            for ( var i = 0; i < rc.length; i++ )
                h( rc[i], [m] );
        }
        else
            h( m, rc );
    },
    removeNodeBySheetId:function ( sheetId ) {
		var nodesSheetArea = this.nodesArea[sheetId];
		if(nodesSheetArea)
			nodesSheetArea.removeAll();
        var nodesSheetCell = this.nodesCell[sheetId];
		if(nodesSheetCell)
            nodesSheetCell.removeAll();
    },
    getNodeDependence:function ( aElems ) {
        var oRes = {oMasterNodes:{}, oMasterAreaNodes:{}, oWeightMap:{}};
        var aWeightMapMasters = [];
        var aWeightMapMastersNodes = [];
        var node;
        var elem;
        var oSheetRanges = {};
        while ( null != aElems ) {
            for ( var i in aElems ) {
                elem = aElems[i];
				var sheetId = elem[0];
				var cellId = elem[1];
				//нужно обавлять в oSheetRanges даже несушествующие node, чтобы поддержать именении ячеек в SUM(A1:B2)
				this._getNodeDependenceNodeToRange(sheetId, Asc.g_oRangeCache.getAscRange(cellId), oSheetRanges);
				node = this.getNode(sheetId, cellId);
                if ( node && null == oRes.oWeightMap[node.nodeId] ) {
                    //все node из aElems записываем в master
                    var oWeightMapElem = {cur:0, max:0, gray:false, bad:false, master:true, area:node.isArea};
                    aWeightMapMasters.push( oWeightMapElem );
                    aWeightMapMastersNodes.push( node );
                    oRes.oWeightMap[node.nodeId] = oWeightMapElem;
                    this._getNodeDependence( oRes, oSheetRanges, node );
                }
            }
            aElems = null;
            //расширяем за счет area nodes
            for ( var i in oSheetRanges ) {
                var oSheetRange = oSheetRanges[i];
                if ( oSheetRange.changed ) {
                    oSheetRange.changed = false;
                    var nodesSheetArea = this.nodesArea[i];
                    if ( null != nodesSheetArea ) {
                        var aAllOuter = null;
                        if ( null == oSheetRange.prevRange ) {
                            var oGetRes = nodesSheetArea.get( oSheetRange.range );
                            if ( oGetRes.all.length > 0 )
                                aAllOuter = oGetRes.all;
                        }
                        else {
                            var aEdgeBBox = [];
                            if ( oSheetRange.range.c1 < oSheetRange.prevRange.c1 )
                                aEdgeBBox.push( new Asc.Range( oSheetRange.range.c1, oSheetRange.range.r1, oSheetRange.prevRange.c1 - 1, oSheetRange.range.r2 ) );
                            if ( oSheetRange.range.c2 > oSheetRange.prevRange.c2 )
                                aEdgeBBox.push( new Asc.Range( oSheetRange.range.c2, oSheetRange.range.r1, oSheetRange.prevRange.c2 + 1, oSheetRange.range.r2 ) );
                            if ( oSheetRange.range.r1 < oSheetRange.prevRange.r1 )
                                aEdgeBBox.push( new Asc.Range( oSheetRange.range.c1 + 1, oSheetRange.range.r1, oSheetRange.range.c2 - 1, oSheetRange.prevRange.r1 - 1 ) );
                            if ( oSheetRange.range.r2 > oSheetRange.prevRange.r2 )
                                aEdgeBBox.push( new Asc.Range( oSheetRange.range.c1 + 1, oSheetRange.range.r2, oSheetRange.range.c2 - 1, oSheetRange.prevRange.r2 + 1 ) );
                            aAllOuter = [];
                            for ( var j = 0, length = aEdgeBBox.length; j < length; j++ ) {
                                var bbox = aEdgeBBox[j];
                                var oGetRes = nodesSheetArea.get( bbox );
                                if ( oGetRes.all.length > 0 )
                                    aAllOuter = aAllOuter.concat( oGetRes.all );
                            }
                        }
                        if ( aAllOuter && aAllOuter.length > 0 ) {
                            if ( null == aElems )
                                aElems = [];
                            for ( var j in aAllOuter ) {
                                var node = aAllOuter[j].data;
								aElems[node.nodeId] = [node.sheetId, node.cellId];
                            }
                        }
                    }
                }
            }
        }
        for ( var i = 0, length = aWeightMapMasters.length; i < length; i++ ) {
            var oWeightMapElem = aWeightMapMasters[i];
            //возвращаем только настощие master
            if ( oWeightMapElem.master ) {
                node = aWeightMapMastersNodes[i];
                if ( oWeightMapElem.area )
                    oRes.oMasterAreaNodes[node.nodeId] = node;
                else
                    oRes.oMasterNodes[node.nodeId] = node;
            }
        }
        return oRes;
    },
    _getNodeDependence:function ( oRes, oSheetRanges, node ) {
        var bBad = false;
        var oWeightMapElem = oRes.oWeightMap[node.nodeId];
        if ( null == oWeightMapElem ) {
            oWeightMapElem = {cur:0, max:1, gray:false, bad:false, master:false, area:false};
            oRes.oWeightMap[node.nodeId] = oWeightMapElem;
        }
        else {
            oWeightMapElem.max++;
            //если пришли в gray node, то это цикл
            if ( oWeightMapElem.gray )
                bBad = oWeightMapElem.bad = true;
            else {
                if ( oWeightMapElem.master && oWeightMapElem.max > 1 )
				{
					//если повторно пришли в master node, то не считаем ее master
					oWeightMapElem.master = false;
					oWeightMapElem.max--;
				}
			}
		}
        if ( 1 == oWeightMapElem.max )
            this._getNodeDependenceNodeToRange( node.sheetId, node.getBBox(), oSheetRanges );
        if ( !bBad && oWeightMapElem.max <= 1 ) {
            oWeightMapElem.gray = true;
            var aNext = node.getSlaveEdges();
            for ( var i in aNext ) {
                if ( this._getNodeDependence( oRes, oSheetRanges, aNext[i] ) )
                    bBad = true;
            }
            oWeightMapElem.gray = false;
            oWeightMapElem.bad = bBad;
        }
        return bBad;
    },
    _getNodeDependenceNodeToRange:function ( sheetId, bbox, oSheetRanges ) {
        var oSheetRange = oSheetRanges[sheetId];
        if ( null == oSheetRange ) {
            oSheetRange = {range:null, changed:false, prevRange:null};
            oSheetRanges[sheetId] = oSheetRange;
        }
        if ( null == oSheetRange.range || !oSheetRange.range.containsRange( bbox ) ) {
            if ( null == oSheetRange.range )
                oSheetRange.range = bbox.clone();
            else {
                if ( !oSheetRange.changed )
                    oSheetRange.prevRange = oSheetRange.range.clone();
                oSheetRange.range.union2( bbox );
            }
            oSheetRange.changed = true;
        }
    },
    getAll:function () {
        return this.nodesId;
    }
};

/** @constructor */
function Vertex(sheetId, cellId, wb){
	
	this.sheetId = sheetId;
	this.cellId = cellId;
	this.bbox = Asc.g_oRangeCache.getAscRange(this.cellId);
	this.isArea = !this.bbox.isOneCell();
	this.valid = true;
	this.nodeId = getVertexId(this.sheetId, this.cellId);
		this.wb = wb;
	this.cell = null;
	
	//вершина которую мы прошли и поставили в очередь обхода
	this.isBlack = false;
	
	//вершина которую мы прошли, но не поставили в очередь обхода. нужно для определения петель в графе.
	this.isGray = false;
	
	//если вершина входит в цикличный путь, то она помечается плохой и запоминается в списке плохих вершин.
	this.isBad = false;
	
	//masterEdges содержит ячейки, от которых зависит текущая ячейка
	this.masterEdges = null;
	
	//slaveEdges содержит ячейки, которые зависят от данной ячейки
	this.slaveEdges = null;
	
	this.refCount = 0;
	
	this.weightNode = 0;
}
Vertex.prototype = {	
	
	constructor: Vertex,
	
	getBBox : function()
	{
		return this.bbox;
	},
	setRefError : function(wsId, cellId)
	{
		var cell = this.returnCell();
		if( cell && cell.formulaParsed )
		{
			this.wb.dependencyFormulas.deleteMasterNodes2( wsId, cellId );
			cell.formulaParsed.setRefError(wsId, cellId);
			cell.setFormula(cell.formulaParsed.assemble(), true);
			addToArrRecalc(wsId, cell);
		}
	},
	move : function(offset, wsId, toDelete)
	{
		var oNewBBox = new Asc.Range(this.bbox.c1 + offset.offsetCol, this.bbox.r1 + offset.offsetRow, this.bbox.c2 + offset.offsetCol, this.bbox.r2 + offset.offsetRow);
		var sNewBBoxName = oNewBBox.getName();
		var _sn = this.getSlaveEdges();
		var cell = this.returnCell();
		if( cell && cell.formulaParsed )
		{
			this.wb.dependencyFormulas.deleteMasterNodes2(wsId, this.bbox.getName());
			addToArrRecalc(wsId, cell);
		}
		for( var _id in _sn ){
			var slave = _sn[_id]
			cell = slave.returnCell();
			if( cell && cell.formulaParsed )
			{
				this.wb.dependencyFormulas.deleteMasterNodes2( slave.sheetId, slave.cellId );
				cell.formulaParsed.shiftCells( offset, null, this, slave.sheetId, toDelete);
				cell.setFormula(cell.formulaParsed.assemble(), true);
				addToArrRecalc(slave.sheetId, cell);
			}
		}
		this.bbox = oNewBBox;
		this.cellId = sNewBBoxName;
		this.nodeId = getVertexId(this.sheetId, this.cellId);
		this.wb.needRecalc.nodes[this.nodeId] = [this.sheetId, this.cellId ];
		this.wb.needRecalc.length++;
	},
	moveStretch : function(bboxTo)
	{
		var sNewName = bboxTo.getName();
		var _sn = this.getSlaveEdges();
		for( var _id in _sn ){
			var slave = _sn[_id];
			var cell = slave.returnCell();
			if( cell && cell.formulaParsed ){
				this.wb.dependencyFormulas.deleteMasterNodes2( slave.sheetId, slave.cellId );
				cell.formulaParsed.stretchArea( this, sNewName );
				cell.setFormula(cell.formulaParsed.assemble(), true);
				addToArrRecalc(slave.sheetId, cell);
			}
		}
		this.bbox = bboxTo
		this.cellId = sNewName;
		this.nodeId = getVertexId(this.sheetId, this.cellId);
		this.wb.needRecalc.nodes[this.nodeId] = [this.sheetId, this.cellId ];
		this.wb.needRecalc.length++;
	},
	//добавляем ведущую ячейку.
	addMasterEdge : function(node){
		if( !this.masterEdges )
			this.masterEdges = {};
		this.masterEdges[node.nodeId] = node;
		this.refCount ++;
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

	//удаляем ребро между конкретной зависимой(ведомой) ячейки.
	deleteSlaveEdge : function(node){
		this.slaveEdges[node.nodeId] = null;
		delete this.slaveEdges[node.nodeId];
		this.refCount--;
	},

	//очищаем все ребра по ведущим ячейкам.
	deleteAllMasterEdges : function(){
		var ret = {};
		for( var id in this.masterEdges ){
			var masterEdge = this.masterEdges[id];
			masterEdge.deleteSlaveEdge(this);
			this.masterEdges[id] = null;
			delete this.masterEdges[id];
			this.refCount--;
			ret[id] = masterEdge;
		}
		this.masterEdges = null;
		return ret;
	},
	
	//очищаем все ребра по ведомым ячейкам.
	deleteAllSlaveEdges : function(){
		var ret = {};
		for( var id in this.slaveEdges ){
			var slaveEdge = this.slaveEdges[id];
			slaveEdge.deleteMasterEdge(this);
			this.slaveEdges[id] = null;
			delete this.slaveEdges[id];
			this.refCount--;
			ret[id] = slaveEdge;
		}
		this.slaveEdges = null;
		return ret;
	},

	returnCell : function(){
		//todo
		if(null == this.cell && this.wb && !this.isArea)
		{
			var ws = this.wb.getWorksheetById(this.sheetId);
			if(ws)
				this.cell = ws._getCellNoEmpty(this.bbox.r1, this.bbox.c1);
		}
		return this.cell;
	}
	
}

function getVertexId(sheetId, cellId){
	return sheetId + cCharDelimiter + cellId;
}
function lockDraw(wb){
    lc++;
	wb.isNeedCacheClean = false;
    if( lc == 0 ){
        arrRecalc = {};
    }
}
function unLockDraw(wb){
    lc>0?lc--:true;
	if( lc == 0 ){
        wb.isNeedCacheClean = true;
        arrRecalc = {};
    }
}
function addToArrRecalc(sheetId, cell){
		var temp = arrRecalc[sheetId];
		if( !temp )
		{
			temp = [];
			arrRecalc[sheetId] = temp;
		}
		temp.push(cell);
	}
function buildRecalc(_wb,notrec){
	var ws;
    if( lc > 1 ) return;
	for( var id in arrRecalc ){
		ws = _wb.getWorksheetById(id);
		if (ws) {
			var temp = arrRecalc[id];
			var _rec = {};
			for(var i = 0, length = temp.length; i < length; ++i)
			{
				var cellId = temp[i].oId.getID();
				_rec[cellId] = cellId;
				_wb.needRecalc.nodes[getVertexId(id, cellId)] = [id, cellId ];
				_wb.needRecalc.length++;
		}
			ws._BuildDependencies(_rec);
	}
	}
    if(!notrec)
	    sortDependency(_wb)
}

function sortDependency( wb ) {
	if ( wb.isNeedCacheClean ){
		buildRecalc(wb, true);
		arrRecalc = {};
	}
    var nR = wb.needRecalc;
	if(nR && (nR.length > 0))
	{
        var oCleanCellCacheArea = {};
		var oNodeDependence = wb.dependencyFormulas.getNodeDependence(nR.nodes);
        for ( var i in oNodeDependence.oMasterNodes ) {
            var node = oNodeDependence.oMasterNodes[i];
            _sortDependency( wb, node, oNodeDependence.oWeightMap, false, oCleanCellCacheArea );
        }
        for ( var i in oNodeDependence.oMasterAreaNodes ) {
            var node = oNodeDependence.oMasterAreaNodes[i];
            _sortDependency( wb, node, oNodeDependence.oWeightMap, false, oCleanCellCacheArea );
        }
        for ( var sheetId in oCleanCellCacheArea ) {
            var sheetArea = oCleanCellCacheArea[sheetId];
            for ( var rowId in sheetArea ) {
                var nRow = rowId - 0;
                wb.handlers.trigger( "cleanCellCache", sheetId, new Asc.Range( 0, nRow, gc_nMaxCol0, nRow ), c_oAscCanChangeColWidth.numbers );
            }
        }
		g_oVLOOKUPCache.clean();
    }
	wb.needRecalc = {nodes: {}, length:0};
}
function _sortDependency( wb, node, oWeightMap, bBad, oCleanCellCacheArea ) {
    if ( node ) {
        var oWeightMapElem = oWeightMap[node.nodeId];
        if ( oWeightMapElem ) {
            oWeightMapElem.cur++;
            if ( (!oWeightMapElem.bad && oWeightMapElem.cur >= oWeightMapElem.max) || (oWeightMapElem.bad && !oWeightMapElem.gray) ) {
                bBad = oWeightMapElem.bad;
                //пересчитываем функцию
                var ws = wb.getWorksheetById( node.sheetId );
                ws._RecalculatedFunctions( node.cellId, bBad );
                //запоминаем области для удаления cache
                var sheetArea = oCleanCellCacheArea[node.sheetId];
                if ( null == sheetArea ) {
                    sheetArea = {};
                    oCleanCellCacheArea[node.sheetId] = sheetArea;
                }
                var range = Asc.g_oRangeCache.getAscRange( node.cellId );
                if ( range ) {
                    for ( var i = range.r1; i <= range.r2; i++ )
                        sheetArea[i] = 1;
                }
                //обрабатываем child
                oWeightMapElem.gray = true;
                var oSlaveNodes = node.getSlaveEdges();
                if ( oSlaveNodes ) {
                    for ( var i in oSlaveNodes )
                        _sortDependency( wb, oSlaveNodes[i], oWeightMap, bBad, oCleanCellCacheArea );
                }
                if ( oWeightMapElem.area ) {
                    for ( var i = 0, length = oWeightMapElem.area.length; i < length; i++ )
                        _sortDependency( wb, oWeightMapElem.area[i].data, oWeightMap, bBad, oCleanCellCacheArea );
                }
                oWeightMapElem.gray = false;
            }
        }
    }
}

function angleFormatToInterface(val)
{
	var nRes = 0;
	if(0 <= val && val <= 180)
		nRes = val <= 90 ? val : 90 - val;
	return nRes;
}
function angleFormatToInterface2(val)
{
	if(g_nVerticalTextAngle == val)
		return val;
	else
		return angleFormatToInterface(val);
}
function angleInterfaceToFormat(val)
{
	var nRes = val;
	if(-90 <= val && val <= 90)
	{
		if(val < 0)
			nRes = 90 - val;
	}
	else if(g_nVerticalTextAngle != val)
		nRes = 0;
	return nRes;
}
//-------------------------------------------------------------------------------------------------
$(function(){
	aStandartNumFormats = [];
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
	aStandartNumFormats[22] = "m/d/yyyy h:mm";
	aStandartNumFormats[37] = "#,##0_);(#,##0)";
	aStandartNumFormats[38] = "#,##0_);[Red](#,##0)";
	aStandartNumFormats[39] = "#,##0.00_);(#,##0.00)";
	aStandartNumFormats[40] = "#,##0.00_);[Red](#,##0.00)";
	aStandartNumFormats[45] = "mm:ss";
	aStandartNumFormats[46] = "[h]:mm:ss";
	aStandartNumFormats[47] = "mm:ss.0";
	aStandartNumFormats[48] = "##0.0E+0";
	aStandartNumFormats[49] = "@";
	aStandartNumFormatsId = {};
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
	this.needRecalc = {nodes: {}, length:0};
	this.dependencyFormulas = new DependencyGraph(this);
	this.nActive = 0;
	
	this.theme = null;
	this.clrSchemeMap = null;
	
	this.DefinedNames = {};
	this.oRealDefinedNames = {};
	this.oNameGenerator = new NameGenerator(this);
	this.CellStyles = new CCellStyles();
	this.TableStyles = new CTableStyles();
	this.oStyleManager = new StyleManager(this);
	this.calcChain = [];
	this.aWorksheets = [];
	this.aWorksheetsById = {};
	this.cwf = {};
	this.isNeedCacheClean = true;
	this.startActionOn = false;
	this.aCollaborativeActions = [];
	this.bCollaborativeChanges = false;
	this.bUndoChanges = false;
	this.bRedoChanges = false;
	this.aCollaborativeChangeElements = [];
};
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
	sortDependency(this);

	//charts
	for(var i = 0, length = this.aWorksheets.length; i < length; ++i)
	{
		var ws = this.aWorksheets[i];
		ws.initPostOpen();
	}
};
Workbook.prototype.rebuildColors=function(){
	g_oColorManager.rebuildColors();
	for(var i = 0 , length = this.aWorksheets.length; i < length; ++i)
		this.aWorksheets[i].rebuildColors();;
}
Workbook.prototype.getDefaultFont=function(){
	return g_oDefaultFont.fn;
};
Workbook.prototype.getDefaultSize=function(){
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
	oNewWorksheet.initPostOpen();
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
Workbook.prototype.copyWorksheet=function(index, insertBefore, sName, sId, bFromRedo){
	//insertBefore - optional
	if(index >= 0 && index < this.aWorksheets.length){
		History.TurnOff();
		var wsFrom = this.aWorksheets[index];
		var nameSheet = wsFrom.getName();
		var newSheet = wsFrom.clone(sId, bFromRedo);
		if(null != sName)
		{
			if(true == this.checkValidSheetName(sName))
				newSheet.sName = sName;
		}
		newSheet.init();
		newSheet.initPostOpen();
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
        if(!(bFromRedo === true))
        {
            wsFrom.copyDrawingObjects(newSheet);
        }
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
                    if( f == null || f == undefined ){
                        continue;
                    }
					if( f.indexOf(tempW.wFN+":") > 0 || f.indexOf(":"+tempW.wFN) > 0 ){
						var _c = _ws.getCell2(cID).getCells()[0];
						_c.setFormula(_c.formulaParsed.moveSheet(tempW).assemble());//Перестраиваем трехмерные ссылки в формуле.
						this.dependencyFormulas.deleteMasterNodes(_ws.Id, cID);
						addToArrRecalc(_ws.getId(), _c);
						// this.needRecalc[ getVertexId(_ws.getId(),cID) ] = [ _ws.getId(),cID ];
						// if( this.needRecalc.length < 0) this.needRecalc.length = 0;
							// this.needRecalc.length++;
					}
					else if( f.indexOf(_ws.getName()) < 0 ){
						this.dependencyFormulas.deleteMasterNodes(_ws.Id, cID);
						_ws._BuildDependencies({id:cID});
						addToArrRecalc(_ws.getId(), _c);
						// this.needRecalc[ getVertexId(_ws.getId(),cID) ] = [ _ws.getId(),cID ];
						// if( this.needRecalc.length < 0) this.needRecalc.length = 0;
							// this.needRecalc.length++;
					}
				}
			}
		}
		
		History.TurnOn();
		History.Create_NewPoint();
		History.Add(g_oUndoRedoWorkbook, historyitem_Workbook_SheetMove, null, null, new UndoRedoData_FromTo(indexFrom, indexTo), true);
		buildRecalc(this);
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
	var removedSheets = this.aWorksheets.splice(nIndex, 1);
	if(removedSheets.length > 0)
	{
		var removedSheet = removedSheets[0];
		var removedSheetId = removedSheet.getId();
		History.TurnOff();
		//по всем удаленным листам пробегаемся и удаляем из workbook.cwf (cwf - cells with forluma) элементы с названием соответствующего листа.
		var _cwf = this.cwf[removedSheet.getId()];
		delete this.cwf[removedSheet.getId()];
		delete this.aWorksheetsById[removedSheet.getId()];
		
		lockDraw(this);
		var a = this.dependencyFormulas.getNodeBySheetId(removedSheet.getId());
		for(var i=0;i<a.length;i++){
			var node = a[i];
			var se = node.getSlaveEdges();
			if(se){
				for(var id in se){
					var slave = se[id];
					if( slave.sheetId != removedSheetId )
						slave.setRefError(removedSheetId, node.cellId);
				}
			}
		}
		this.dependencyFormulas.removeNodeBySheetId(removedSheet.getId());
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
		History.Add(g_oUndoRedoWorkbook, historyitem_Workbook_SheetRemove, null, null, new UndoRedoData_SheetRemove(nIndex, removedSheetId, removedSheet, _cwf));
		if(null != outputParams)
		{
			outputParams.sheet = removedSheet;
			outputParams.cwf = _cwf;
		}
		this._updateWorksheetIndexes();
		this.nActive = nNewActive;
		buildRecalc(this);
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
};
Workbook.prototype._generateFontMap=function(){
	var oFontMap = {
		"Calibri"	: 1,
		"Arial"		: 1
	};

	if(null != g_oDefaultFont.fn)
		oFontMap[g_oDefaultFont.fn] = 1;
	
	for(var i = 0, length = this.aWorksheets.length; i < length; ++i)
		this.aWorksheets[i].generateFontMap(oFontMap);
	this.CellStyles.generateFontMap(oFontMap);
	
	return oFontMap;
};
Workbook.prototype.generateFontMap=function(){
	var oFontMap = this._generateFontMap();
	
	var aRes = [];
	for(var i in oFontMap)
		aRes.push(i);
	return aRes;
};
Workbook.prototype.generateFontMap2=function(){
	var oFontMap = this._generateFontMap();

	var aRes = [];
	for(var i in oFontMap)
		aRes.push(new CFont(i, 0, "", 0));
	return aRes;
};
Workbook.prototype.recalcWB = function(isRecalcWB){
	//todo
    if ( this.dependencyFormulas.getNodesLength() > 0 ) {
        var aNodes = isRecalcWB ? this.dependencyFormulas.getAll() : this.dependencyFormulas.getNodeBySheetIdAll(this.getWorksheet(this.getActive()).getId());
        var nR = this.needRecalc;
        for ( var i in aNodes ) {
            var node = aNodes[i];
            if ( !node.isArea ) {
                nR.nodes[node.nodeId] = [node.sheetId, node.cellId];
                nR.length++;
            }
        }
        sortDependency( this );
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
	this.dependencyFormulas.clear();
	this.dependencyFormulas = null;
	this.dependencyFormulas = new DependencyGraph(this);
	for(var i in this.cwf){
		this.getWorksheetById(i)._BuildDependencies(this.cwf[i].cells);
	}
}
Workbook.prototype.recalcDependency = function(f,bad,notRecalc){
    if(f.length > 0){

        var sr = {};

        for(var i = 0; i < f.length; i++){
            var sheetID = f[i].sheetId, cellID = f[i].cellId, selectedSheet;
            if( cellID.indexOf(":") > -1 ) continue;

            var l = new CellAddress(cellID);
            var lRow = l.getRow(), lCol = l.getCol();

            if( !(sheetID in sr) ){
                sr[sheetID] = {max:new CellAddress(cellID),min:new CellAddress(cellID)}
            }

            selectedSheet = sr[sheetID];

            if ( selectedSheet.min.getRow() > lRow )
                selectedSheet.min = new CellAddress( lRow, selectedSheet.min.getCol() );

            if ( selectedSheet.min.getCol() > lCol )
                selectedSheet.min = new CellAddress( selectedSheet.min.getRow(), lCol );

            if ( selectedSheet.max.getRow() < lRow )
                selectedSheet.max = new CellAddress( lRow, selectedSheet.max.getCol() );

            if ( selectedSheet.max.getCol() < lCol )
                selectedSheet.max = new CellAddress( selectedSheet.max.getRow(), lCol );

            if( !notRecalc )
                this.getWorksheetById( sheetID )._RecalculatedFunctions( cellID, bad );
        }

        return sr;
    }
}
Workbook.prototype.SerializeHistory = function(){
	var aRes = [];
	//соединяем изменения, которые были до приема данных с теми, что получились после.
    var wsViews = this.oApi.wb.wsViews;
    for(var i in wsViews)
    {
        if(isRealObject(wsViews[i]) && isRealObject(wsViews[i].objectRender) && isRealObject(wsViews[i].objectRender.controller))
            wsViews[i].objectRender.controller.refreshContentChanges();
    }
	var aActions = this.aCollaborativeActions.concat(History.GetSerializeArray());
	if(aActions.length > 0)
	{
		var oMemory = new CMemory();
		var oThis = this;
		//создаем еще один элемент в undo/redo - взаимное расположение Sheet, чтобы не запутываться в add, move событиях
		var oSheetPlaceData = [];
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
		this.aCollaborativeActions = [];
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
		//собираем общую длину
		var dstLen = 0;
		var aIndexes = [];
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
		var oFontMap = {};//собираем все шрифтры со всех изменений
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
		
		window["Asc"]["editor"]._loadFonts(oFontMap, function(){
				History.Clear();
				History.Create_NewPoint();
				History.SetSelection(null);
				History.SetSelectionRedo(null);
				var oHistoryPositions = null;//нужен самый последний historyitem_Workbook_SheetPositions
				var oRedoObjectParam = new Asc.RedoObjectParam();
				History.RedoPrepare(oRedoObjectParam);
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
                            {
                                if(g_oUndoRedoGraphicObjects == item.oClass && item.oData.drawingData)
                                    item.oData.drawingData.bCollaborativeChanges = true;
                                History.RedoAdd(oRedoObjectParam, item.oClass, item.nActionType, item.nSheetId, item.oRange, item.oData);
                            }
						}
					}
				}
				if(null != oHistoryPositions)
					History.RedoAdd(oRedoObjectParam, oHistoryPositions.oClass, oHistoryPositions.nActionType, oHistoryPositions.nSheetId, oHistoryPositions.oRange, oHistoryPositions.oData);
			
				History.RedoEnd(null, oRedoObjectParam);
				oThis.bCollaborativeChanges = false;
				History.Clear();
				if(null != fCallback)
					fCallback();
			});
	}
};
//-------------------------------------------------------------------------------------------------
/**
 * @constructor
 */
function Woorksheet(wb, _index, bAddUserId, sId){
	this.workbook = wb;
	this.DefinedNames = {};
	this.sName = this.workbook.getUniqueSheetNameFrom(g_sNewSheetNamePattern, false);
	this.bHidden = false;
	this.dDefaultColWidth = null;
	this.dDefaultheight = null;
	this.nBaseColWidth = null;
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
	this.aGCells = {};// 0 based
	this.aCols = [];// 0 based
	this.Drawings = [];
	this.TableParts = [];
	this.AutoFilter = null;
	this.oAllCol = null;
	this.objForRebuldFormula = {};
	this.aComments = [];
	this.aCommentsCoords = [];
	var oThis = this;
	this.mergeManager = new RangeDataManager(function(data, from, to){
		if(History.Is_On() && (null != from || null != to))
		{
			if(null != from)
				from = from.clone();
			if(null != to)
				to = to.clone();
			var oHistoryRange = from;
			if(null == oHistoryRange)
				oHistoryRange = to;
			History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ChangeMerge, oThis.getId(), oHistoryRange, new UndoRedoData_FromTo(new UndoRedoData_BBox(from), new UndoRedoData_BBox(to)));
		}
	});
	this.hyperlinkManager = new RangeDataManager(function(data, from, to){
		if(History.Is_On() && (null != from || null != to))
		{
			if(null != from)
				from = from.clone();
			if(null != to)
				to = to.clone();
			var oHistoryRange = from;
			if(null == oHistoryRange)
				oHistoryRange = to;
			var oHistoryData = null;
			if(null == from || null == to)
				oHistoryData = data.clone();
			History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ChangeHyperlink, oThis.getId(), oHistoryRange, new UndoRedoData_FromToHyperlink(from, to, oHistoryData));
		}
		if(null != to)
			data.Ref = oThis.getRange3(to.r1, to.c1, to.r2, to.c2);
	});
	this.hyperlinkManager.setDependenceManager(this.mergeManager);

	this.sheetViews = [];
	this.aConditionalFormatting = [];
	this.sheetPr = null;
	
	this.nMaxRowId = 1;
	this.nMaxColId = 1;
}
Woorksheet.prototype.rebuildColors=function(){
	this._forEachCell(function(cell){
		cell.cleanCache();
	});
};
Woorksheet.prototype.generateFontMap=function(oFontMap){
	//пробегаемся по Drawing
	for(var i = 0, length = this.Drawings.length; i < length; ++i)
	{
		var drawing = this.Drawings[i];
		if(drawing)
			drawing.getAllFonts(oFontMap);
	}
	//пробегаемся по колонкам
	for(var i in this.aCols)
	{
		var col = this.aCols[i];
		if(null != col && null != col.xfs && null != col.xfs.font && null != col.xfs.font.fn)
			oFontMap[col.xfs.font.fn] = 1;
	}
	if(null != this.oAllCol && null != this.oAllCol.xfs && null != this.oAllCol.xfs.font && null != this.oAllCol.xfs.font.fn)
		oFontMap[this.oAllCol.xfs.font.fn] = 1;
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
Woorksheet.prototype.clone=function(sNewId, bFromRedo){
	var oNewWs, i, elem, range;
	if(null != sNewId)
		oNewWs = new Woorksheet(this.workbook, this.workbook.aWorksheets.length, true, sNewId);
	else
		oNewWs = new Woorksheet(this.workbook, this.workbook.aWorksheets.length, true);
	oNewWs.sName = this.workbook.getUniqueSheetNameFrom(this.sName, true);
	oNewWs.bHidden = this.bHidden;
	oNewWs.nBaseColWidth = this.nBaseColWidth;
	oNewWs.dDefaultColWidth = this.dDefaultColWidth;
	oNewWs.dDefaultheight = this.dDefaultheight;
	oNewWs.index = this.index;
	oNewWs.nRowsCount = this.nRowsCount;
	oNewWs.nColsCount = this.nColsCount;
	for (i = 0; i < this.TableParts.length; ++i)
		oNewWs.TableParts.push(this.TableParts[i].clone(oNewWs));
	if(this.AutoFilter)
		oNewWs.AutoFilter = this.AutoFilter.clone();
	for(i in this.aCols)
		oNewWs.aCols[i] = this.aCols[i].clone();
	if(null != this.oAllCol)
		oNewWs.oAllCol = this.oAllCol.clone();
	for(i in this.aGCells)
		oNewWs.aGCells[i] = this.aGCells[i].clone();
	var aMerged = this.mergeManager.getAll();
	for(i in aMerged)
	{
		elem = aMerged[i];
		range = oNewWs.getRange3(elem.bbox.r1, elem.bbox.c1, elem.bbox.r2, elem.bbox.c2);
		range.mergeOpen();
	}
	var aHyperlinks = this.hyperlinkManager.getAll();
	for(i in aHyperlinks)
	{
		elem = aHyperlinks[i];
		range = oNewWs.getRange3(elem.bbox.r1, elem.bbox.c1, elem.bbox.r2, elem.bbox.c2);
		range.setHyperlinkOpen(elem.data);
	}
	if(null != this.aComments) {
		for (i = 0; i < this.aComments.length; i++) {
			var comment = new asc_CCommentData(this.aComments[i]);
			comment.wsId = oNewWs.getId();
			comment.setId();
			oNewWs.aComments.push(comment);
		}
	}
	for (i = 0; i < this.sheetViews.length; ++i) {
		oNewWs.sheetViews.push(this.sheetViews[i].clone());
	}
	for (i = 0; i < this.aConditionalFormatting.length; ++i) {
		oNewWs.aConditionalFormatting.push(this.aConditionalFormatting[i].clone(oNewWs));
	}
	if (this.sheetPr)
		oNewWs.sheetPr = this.sheetPr.clone();
	return oNewWs;
};
Woorksheet.prototype.copyDrawingObjects=function(oNewWs)
{
    if(null != this.Drawings && this.Drawings.length > 0)
    {
        oNewWs.Drawings = [];
        var w = new CMemory();
        for(var i = 0; i < this.Drawings.length; ++i)
        {
            this.Drawings[i].graphicObject.writeToBinaryForCopyPaste(w);
        }
        var binary = w.pos + ";" + w.GetBase64Memory();
        var stream = CreateBinaryReader(binary, 0, binary.length);
        var drawingObjects;
        if(this.Drawings[0] && this.Drawings[0].graphicObject && this.Drawings[0].graphicObject.drawingObjects)
        {
            drawingObjects = this.Drawings[0].graphicObject.drawingObjects;
        }
        else
        {
            drawingObjects = new DrawingObjects();
            drawingObjects.drawingDocument = new CDrawingDocument(drawingObjects);
        }
        for(var i = 0; i < this.Drawings.length; ++i)
        {
            var obj = null;
            var objectType = stream.GetLong();
            switch (objectType)
            {
                case CLASS_TYPE_SHAPE:
                {
                    obj = new CShape(null, null, null);
                    break;
                }
                case CLASS_TYPE_IMAGE:
                {
                    obj = new CImageShape(null, null);
                    break;
                }
                case CLASS_TYPE_GROUP:
                {
                    obj = new CGroupShape(null, null);
                    break;
                }
                case CLASS_TYPE_CHART_AS_GROUP:
                {
                    obj = new CChartAsGroup(null, null);
                    break;
                }
            }
            if(isRealObject(obj))
            {
                var drawingObject = drawingObjects.cloneDrawingObject(this.Drawings[i]);
                obj.readFromBinaryForCopyPaste2(stream, null, drawingObjects, null, null);
                drawingObject.graphicObject = obj;
                oNewWs.Drawings.push(drawingObject);
            }
        }
    }
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
					this.workbook.needRecalc.nodes[ getVertexId( this.Id, sCellId ) ] = [this.Id, sCellId];
					this.workbook.needRecalc.length++;
				}
				//в редакторе не работаем с расширенными формулами
				oCell.oFormulaExt = null;
			}
		}
	}
};
Woorksheet.prototype.initPostOpen = function(){
	//chart
	if(null != this.Drawings)
	{
		var oThis = this;
		for(var i = this.Drawings.length - 1; i >= 0; --i)
		{
			var obj = this.Drawings[i];
			if(obj.graphicObject && obj.graphicObject.chart)
			{
				var chart = obj.graphicObject.chart;
				if(chart.range.interval)
				{
					var oRefParsed = parserHelp.parse3DRef(chart.range.interval);
					if (null !== oRefParsed) {
						// Получаем sheet по имени
						var ws = oThis.workbook.getWorksheetByName (oRefParsed.sheet);
						if (ws)
							chart.range.intervalObject = ws.getRange2(oRefParsed.range);
					}
				}
				if(null == chart.range.intervalObject)
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

	// Sheet Views
	if (0 === this.sheetViews.length) {
		// Даже если не было, создадим
		this.sheetViews[0] = new asc.asc_CSheetViewSettings();
	}
};
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

		//перестраиваем формулы, если у них были ссылки на лист со старым именем.
		for(var id in this.workbook.cwf) {
			this.workbook.getWorksheetById(id)._ReBuildFormulas(this.workbook.cwf[id].cells,lastName,this.sName);
		}
			
		if ( this.Drawings ) {
			for (var i = 0; i < this.Drawings.length; i++) {
				var drawingObject = this.Drawings[i];
				if ( drawingObject.graphicObject && drawingObject.isChart() ) {
						var _lastName =  !rx_test_ws_name.test(lastName) ? "'" + lastName + "'" : lastName;
						if ( drawingObject.graphicObject.chart.range.interval.indexOf(_lastName + "!") >= 0 ) {
							drawingObject.graphicObject.chart.range.interval = drawingObject.graphicObject.chart.range.interval.replace(_lastName, !rx_test_ws_name.test(this.sName) ? "'" + this.sName + "'" : this.sName);
						drawingObject.graphicObject.chart.rebuildSeries();
					}
				}
			}
		}
	}
};
Woorksheet.prototype.renameWsToCollaborate=function(name){
	var lastname = this.getName();
	//из-за особенностей реализации формул, сначала делаем parse со старым именем, потом преименовываем, потом assemble
	var aFormulas = [];
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
		var countWorksheets = this.workbook.getWorksheetCount();
		// Покажем следующий лист или предыдущий (если больше нет)
		var i, ws;
		for (i = activeWorksheet + 1; i < countWorksheets; ++i) {
			ws = this.workbook.getWorksheet(i);
			if (false === ws.getHidden()) {
				this.workbook.handlers.trigger("undoRedoHideSheet", i);
				return;
			}
		}
		// Не нашли справа, ищем слева от текущего
		for (i = activeWorksheet - 1; i >= 0; --i) {
			ws = this.workbook.getWorksheet(i);
			if (false === ws.getHidden()) {
				this.workbook.handlers.trigger("undoRedoHideSheet", i);
				return;
			}
		}
	}
};
Woorksheet.prototype.getSheetViewSettings = function () {
	return this.sheetViews[0].clone();
};
Woorksheet.prototype.setSheetViewSettings = function (options) {
	var current = this.getSheetViewSettings();
	if (current.isEqual(options))
		return;

	History.Create_NewPoint();
	History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_SetViewSettings, this.getId(), null, new UndoRedoData_FromTo(current, options.clone()));

	this.sheetViews[0].setSettings(options);
};
Woorksheet.prototype.getRowsCount=function(){
	return this.nRowsCount;
};
Woorksheet.prototype.removeRows=function(start, stop){
	var oRange = this.getRange(new CellAddress(start, 0, 0), new CellAddress(stop, gc_nMaxCol0, 0));
	oRange.deleteCellsShiftUp();
};
Woorksheet.prototype._removeRows=function(start, stop){
	lockDraw(this.workbook);
	History.Create_NewPoint();
	//start, stop 0 based
	var nDif = -(stop - start + 1);
	var aIndexes = [];
	for(var i in this.aGCells)
	{
		var nIndex = i - 0;
		if(nIndex >= start)
			aIndexes.push(nIndex);
	}
	//По возрастанию
	aIndexes.sort(fSortAscending);
	var oDefRowPr = new UndoRedoData_RowProp();
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
			var oOldProps = row.getHeightProp();
			if(false == Asc.isEqual(oOldProps, oDefRowPr))
				History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RowProp, this.getId(), new Asc.Range(0, nIndex, gc_nMaxCol0, nIndex), new UndoRedoData_IndexSimpleProp(nIndex, true, oOldProps, oDefRowPr));
			row.setStyle(null);
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
	buildRecalc(this.workbook);
	unLockDraw(this.workbook);
		
//	for(var id  in res)
//		History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveCell, this.getId(), new Asc.Range(0, res[id].nRow, gc_nMaxCol0, res[id].nRow), new UndoRedoData_CellSimpleData(res[id].nRow, res[id].nCol, res[id].data, null));
		
	History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveRows, this.getId(), new Asc.Range(0, start, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_FromToRowCol(true, start, stop));
	return true;
};
Woorksheet.prototype.insertRowsBefore=function(index, count){
	var oRange = this.getRange(new CellAddress(index, 0, 0), new CellAddress(index + count - 1, gc_nMaxCol0, 0));
	oRange.addCellsShiftBottom();
};
Woorksheet.prototype._insertRowsBefore=function(index, count){
	lockDraw(this.workbook);
	var oActualRange = {r1: index, c1: 0, r2: index + count - 1, c2: gc_nMaxCol0};
	History.Create_NewPoint();
	History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_AddRows, this.getId(), new Asc.Range(0, index, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_FromToRowCol(true, index, index + count - 1));
	History.TurnOff();
	//index 0 based
	var aIndexes = [];
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
			var oTargetRow = this._getRow(nIndex + count);
			oTargetRow.copyProperty(row);
		}
		for(var j in row.c)
			this._moveCellVer(nIndex, j - 0, count);
        delete this.aGCells[nIndex];
	}
    if(null != oPrevRow && false == this.workbook.bUndoChanges && false == this.workbook.bRedoChanges)
    {
        for(var i = 0; i < count; ++i)
        {
            var row = this._getRow(index + i);
            row.copyProperty(oPrevRow);
			row.hd = null;
        }
    }
	var res = this.renameDependencyNodes({offsetRow:count,offsetCol:0},oActualRange);
	buildRecalc(this.workbook);
	unLockDraw(this.workbook);
	
	this.nRowsCount += count;
	
//	for(var id  in res)
//		History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveCell, this.getId(), new Asc.Range(0, res[id].nRow, gc_nMaxCol0, res[id].nRow), new UndoRedoData_CellSimpleData(res[id].nRow, res[id].nCol, res[id].data, null));
		
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
};
Woorksheet.prototype._removeCols=function(start, stop){
	lockDraw(this.workbook);
	History.Create_NewPoint();
	//start, stop 0 based
	var nDif = -(stop - start + 1);
	for(var i in this.aGCells)
	{
		var nRowIndex = i - 0;
		var row = this.aGCells[i];
		var aIndexes = [];
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
	buildRecalc(this.workbook);
	unLockDraw(this.workbook);
	
	var oDefColPr = new UndoRedoData_ColProp();
	for(var i = start; i <= stop; ++i)
	{
		var col = this.aCols[i];
		if(null != col)
		{
			var oOldProps = col.getWidthProp();
			if(false == Asc.isEqual(oOldProps, oDefColPr))
				History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ColProp, this.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(i, false, oOldProps, oDefColPr));
			col.setStyle(null);
		}
	}
	this.aCols.splice(start, stop - start + 1);
	for(var i = start, length = this.aCols.length; i < length; ++i)
	{
		var elem = this.aCols[i];
		if(null != elem)
			elem.moveHor(nDif);
	}
	
//	for(var id  in res)
//		History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveCell, this.getId(), new Asc.Range(0, res[id].nRow, gc_nMaxCol0, res[id].nRow), new UndoRedoData_CellSimpleData(res[id].nRow, res[id].nCol, res[id].data, null));
		
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
	History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_AddCols, this.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_FromToRowCol(false, index, index + count - 1));
	History.TurnOff();
	//index 0 based
	for(var i in this.aGCells)
	{
		var nRowIndex = i - 0;
		var row = this.aGCells[i];
		var aIndexes = [];
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
	buildRecalc(this.workbook);
	unLockDraw(this.workbook);
	
    var oPrevCol = null;
    if(index > 0)
        oPrevCol = this.aCols[index - 1];
	if(null != this.oAllCol)
		oPrevCol = this.oAllCol;
	for(var i = 0; i < count; ++i)
    {
        var oNewCol = null;
        if(null != oPrevCol && false == this.workbook.bUndoChanges && false == this.workbook.bRedoChanges)
        {
           oNewCol = oPrevCol.clone();
		   oNewCol.hd = null;
           oNewCol.BestFit = null;
           oNewCol.index = index + i; 
        }
		this.aCols.splice(index, 0, oNewCol);
    }
	for(var i = index + count, length = this.aCols.length; i < length; ++i)
	{
		var elem = this.aCols[i];
		if(null != elem)
			elem.moveHor(count);
	}
	this.nColsCount += count;
	
//	for(var id  in res)
//		History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveCell, this.getId(), new Asc.Range(0, res[id].nRow, gc_nMaxCol0, res[id].nRow), new UndoRedoData_CellSimpleData(res[id].nRow, res[id].nCol, res[id].data, null));
	
	History.TurnOn();
	return true;
};
Woorksheet.prototype.insertColsAfter=function(index, count){
	//index 0 based
	return this.insertColsBefore(index + 1, count);
};
Woorksheet.prototype.getDefaultWidth=function(){
	return this.dDefaultColWidth;
};
Woorksheet.prototype.getColWidth=function(index){
	//index 0 based
	//Результат в пунктах
	var col = this._getColNoEmptyWithAll(index);
	if(null != col && null != col.width)
		return col.width;
	var dResult = this.dDefaultColWidth;
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
	var oSelection = History.GetSelection();
	if(null != oSelection)
	{
		oSelection = oSelection.clone();
		oSelection.assign(start, 0, stop, gc_nMaxRow0);
		oSelection.type = c_oAscSelectionType.RangeCol;
		History.SetSelection(oSelection);
		History.SetSelectionRedo(oSelection);
	}
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
				History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ColProp, oThis.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(col.index, false, oOldProps, oNewProps));
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
				History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ColProp, oThis.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(col.index, false, oOldProps, oNewProps));
		}
	};
	if(0 != start && gc_nMaxCol0 == stop)
	{
		var col = null;
		if(false == bHidden)
			col = this.oAllCol;
		else
			col = this.getAllCol();
		if(null != col)
			fProcessCol(col);
	}
	else
	{
		for(var i = start; i <= stop; i++){
			var col = null;
			if(false == bHidden)
				col = this._getColNoEmpty(i);
			else
				col = this._getCol(i);
			if(null != col)
				fProcessCol(col);
		}
	}
};
Woorksheet.prototype.setColBestFit=function(bBestFit, width, start, stop){
	//start, stop 0 based
	if(null == start)
		return;
	if(null == stop)
		stop = start;
	History.Create_NewPoint();
	var oThis = this;
	var fProcessCol = function(col){
		var oOldProps = col.getWidthProp();
		if(bBestFit)
		{
			col.BestFit = bBestFit;
			col.hd = null;
		}
		else
			col.BestFit = null;
		col.width = width;
		var oNewProps = col.getWidthProp();
		if(false == oOldProps.isEqual(oNewProps))
			History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ColProp, oThis.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_IndexSimpleProp(col.index, false, oOldProps, oNewProps));
	};
	if(0 != start && gc_nMaxCol0 == stop)
	{
		var col = null;
		if(bBestFit && gc_dDefaultColWidthCharsAttribute == width)
			col = this.oAllCol;
		else
			col = this.getAllCol();
		if(null != col)
			fProcessCol(col);
	}
	else
	{
		for(var i = start; i <= stop; i++){
			var col = null;
			if(bBestFit && gc_dDefaultColWidthCharsAttribute == width)
				col = this._getColNoEmpty(i);
			else
				col = this._getCol(i);
			if(null != col)
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
	var oSelection = History.GetSelection();
	if(null != oSelection)
	{
		oSelection = oSelection.clone();
		oSelection.assign(0, start, gc_nMaxCol0, stop);
		oSelection.type = c_oAscSelectionType.RangeRow;
		History.SetSelection(oSelection);
		History.SetSelectionRedo(oSelection);
	}
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
				History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RowProp, this.getId(), new Asc.Range(0, i, gc_nMaxCol0, i), new UndoRedoData_IndexSimpleProp(i, true, oOldProps, oNewProps));
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
	for(var i = start;i <= stop; i++){
		var oCurRow = null;
		if(false == bHidden)
			oCurRow = this._getRowNoEmpty(i);
		else
			oCurRow = this._getRow(i);
		if(null != oCurRow && oCurRow.hd != bHidden)
		{
			var oOldProps = oCurRow.getHeightProp();
			if(bHidden)
				oCurRow.hd = bHidden;
			else
				oCurRow.hd = null;
			var oNewProps = oCurRow.getHeightProp();
			if(false == Asc.isEqual(oOldProps, oNewProps))
				History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RowProp, this.getId(), new Asc.Range(0, i, gc_nMaxCol0, i), new UndoRedoData_IndexSimpleProp(i, true, oOldProps, oNewProps));
		}
	}
};
Woorksheet.prototype.setRowBestFit=function(bBestFit, height, start, stop){
	//start, stop 0 based
	if(null == start)
		return;
	if(null == stop)
		stop = start;
	History.Create_NewPoint();
	for(var i = start;i <= stop; i++){
		var oCurRow = null;
		if(true == bBestFit && gc_dDefaultRowHeightAttribute == height)
			oCurRow = this._getRowNoEmpty(i);
		else
			oCurRow = this._getRow(i);
		if(null != oCurRow)
		{
			var oOldProps = oCurRow.getHeightProp();
			if(true == bBestFit)
				oCurRow.CustomHeight = null;
			else
				oCurRow.CustomHeight = true;
			oCurRow.height = height;
			var oNewProps = oCurRow.getHeightProp();
			if(false == oOldProps.isEqual(oNewProps))
				History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RowProp, this.getId(), new Asc.Range(0, i, gc_nMaxCol0, i), new UndoRedoData_IndexSimpleProp(i, true, oOldProps, oNewProps));
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
	var bbox = Asc.g_oRangeCache.getAscRange(sRange);
	if(null != bbox)
	return this.getRange3(bbox.r1, bbox.c1, bbox.r2, bbox.c2);
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
			if(cell.formulaParsed)
				this.wb.dependencyFormulas.deleteMasterNodes2( this.getId(), cell.getName() );

			// addToArrRecalc(this.workbook, this.getId(), cell.getName());
            // if( this.workbook.dependencyFormulas.getNode(this.getId(),this.getName()) && !this.workbook.needRecalc[ getVertexId(this.getId(),cell.getName()) ] ){
                // this.workbook.needRecalc[ getVertexId(this.getId(),cell.getName()) ] = [ this.getId(),cell.getName() ];
                // if( this.workbook.needRecalc.length < 0) this.workbook.needRecalc.length = 0;
                // this.workbook.needRecalc.length++;
            // }
			
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
		//History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_CreateCell, this.getId(), null, new UndoRedoData_CellSimpleData(row, col, null, null));
	}
	return oCurCell;
};
Woorksheet.prototype._getCell2=function(cellId){
	var oCellAddress = g_oCellAddressUtils.getCellAddress(cellId);
	return this._getCell(oCellAddress.getRow0(), oCellAddress.getCow0());
};
Woorksheet.prototype._getCellNoEmpty=function(row, col){
	//0-based
	var oCurCell;
	var oCurRow = this.aGCells[row];
	if(oCurRow)
	{
		var cell = oCurRow.c[col];
		return cell ? cell : null;
	}
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
		//History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_CreateRow, this.getId(), null, new UndoRedoData_SingleProperty(row));
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
			//History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_CreateCol, this.getId(), null, new UndoRedoData_SingleProperty(index));
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
	}
};
Woorksheet.prototype._prepareMoveRangeGetCleanRanges=function(oBBoxFrom, oBBoxTo){
	var intersection = oBBoxFrom.intersectionSimple(oBBoxTo);
	var aRangesToCheck = [];
	if(null != intersection)
	{
		var oThis = this;
		var fAddToRangesToCheck = function(aRangesToCheck, r1, c1, r2, c2)
		{
			if(r1 <= r2 && c1 <= c2)
				aRangesToCheck.push(oThis.getRange3(r1, c1, r2, c2));
		}
		if(intersection.r1 == oBBoxTo.r1 && intersection.c1 == oBBoxTo.c1)
		{
			fAddToRangesToCheck(aRangesToCheck, oBBoxTo.r1, intersection.c2 + 1, intersection.r2, oBBoxTo.c2);
			fAddToRangesToCheck(aRangesToCheck, intersection.r2 + 1, oBBoxTo.c1, oBBoxTo.r2, oBBoxTo.c2);
		}
		else if(intersection.r2 == oBBoxTo.r2 && intersection.c1 == oBBoxTo.c1)
		{
			fAddToRangesToCheck(aRangesToCheck, oBBoxTo.r1, oBBoxTo.c1, intersection.r1 - 1, oBBoxTo.c2);
			fAddToRangesToCheck(aRangesToCheck, intersection.r1, intersection.c2 + 1, oBBoxTo.r2, oBBoxTo.c2);
		}
		else if(intersection.r1 == oBBoxTo.r1 && intersection.c2 == oBBoxTo.c2)
		{
			fAddToRangesToCheck(aRangesToCheck, oBBoxTo.r1, oBBoxTo.c1, intersection.r2, intersection.c1 - 1);
			fAddToRangesToCheck(aRangesToCheck, intersection.r2 + 1, oBBoxTo.c1, oBBoxTo.r2, oBBoxTo.c2);
		}
		else if(intersection.r2 == oBBoxTo.r2 && intersection.c2 == oBBoxTo.c2)
		{
			fAddToRangesToCheck(aRangesToCheck, oBBoxTo.r1, oBBoxTo.c1, intersection.r1 - 1, oBBoxTo.c2);
			fAddToRangesToCheck(aRangesToCheck, intersection.r1, oBBoxTo.c1, oBBoxTo.r2, intersection.c1 - 1);
		}
	}
	else
		aRangesToCheck.push(this.getRange3(oBBoxTo.r1, oBBoxTo.c1, oBBoxTo.r2, oBBoxTo.c2));
	return aRangesToCheck;
}
Woorksheet.prototype._prepareMoveRange=function(oBBoxFrom, oBBoxTo){
	var res = 0;
	if(oBBoxFrom.isEqual(oBBoxTo))
		return res;
	var aRangesToCheck = this._prepareMoveRangeGetCleanRanges(oBBoxFrom, oBBoxTo);
	for(var i = 0, length = aRangesToCheck.length; i < length; i++)
	{
		var range = aRangesToCheck[i];
		var aMerged = this.mergeManager.get(range.getBBox0());
		if(aMerged.outer.length > 0)
			return -2;
		range._foreachNoEmpty(
			function(cell){
				if(!cell.isEmptyTextString())
				{
					res = -1;
					return res;
				}
			});
		if(0 != res)
			return res;
	}
	return res;
}
Woorksheet.prototype._moveRange=function(oBBoxFrom, oBBoxTo, copyRange){
	if(oBBoxFrom.isEqual(oBBoxTo))
		return;
	var oThis = this;
	History.Create_NewPoint();
	History.StartTransaction();
	
	var offset = { offsetRow : oBBoxTo.r1 - oBBoxFrom.r1, offsetCol : oBBoxTo.c1 - oBBoxFrom.c1 };
	//запоминаем то что нужно переместить
	var aTempObj = {cells: {}, merged: null, hyperlinks: null};
	for(var i = oBBoxFrom.r1; i <= oBBoxFrom.r2; i++)
	{
		var row = this._getRowNoEmpty(i);
		if(null != row)
		{
			var oTempRow = {};
			aTempObj.cells[i + offset.offsetRow] = oTempRow;
			for(var j = oBBoxFrom.c1; j <= oBBoxFrom.c2; j++)
			{
				var cell = row.c[j];
				if(null != cell){
                    if(copyRange)
					    oTempRow[j + offset.offsetCol] = cell.clone();
                    else
					    oTempRow[j + offset.offsetCol] = cell;
                }
			}
		}
	}
	if(false == this.workbook.bUndoChanges && false == this.workbook.bRedoChanges && !copyRange)
	{
		var aMerged = this.mergeManager.get(oBBoxFrom);
		if(aMerged.inner.length > 0)
		{
			aTempObj.merged = aMerged.inner;
			for(var i = 0, length = aTempObj.merged.length; i < length; i++)
			{
				var elem = aTempObj.merged[i];
				this.mergeManager.removeElement(elem);
			}
		}
		var aHyperlinks = this.hyperlinkManager.get(oBBoxFrom);
		if(aHyperlinks.inner.length > 0)
		{
			aTempObj.hyperlinks = aHyperlinks.inner;
			for(var i = 0, length = aTempObj.hyperlinks.length; i < length; i++)
			{
				var elem = aTempObj.hyperlinks[i];
				this.hyperlinkManager.removeElement(elem);
			}
		}
	}
	//удаляем to через историю, для undo
	var aRangesToCheck = this._prepareMoveRangeGetCleanRanges(oBBoxFrom, oBBoxTo);
	for(var i = 0, length = aRangesToCheck.length; i < length; i++)
		aRangesToCheck[i].cleanAll();
	//выставляем для slave refError
	if(!copyRange)
		this.workbook.dependencyFormulas.deleteNodes(this.getId(), oBBoxTo);
	//перемещаем без истории
	History.TurnOff();
	//удаляем from без истории, потому что эти данные не терются а перемещаются
    if(!copyRange || (copyRange && this.workbook.bUndoChanges)){
		var oRangeFrom = this.getRange3(oBBoxFrom.r1, oBBoxFrom.c1, oBBoxFrom.r2, oBBoxFrom.c2 )
        oRangeFrom._setPropertyNoEmpty(null, null, function(cell, nRow0, nCol0, nRowStart, nColStart){
            var row = oThis._getRowNoEmpty(nRow0);
            if(null != row)
                delete row.c[nCol0];
        });
    }
    if(!copyRange){
        this.workbook.dependencyFormulas.helper(oBBoxFrom, oBBoxTo,this.Id);
    }

    for ( var i in aTempObj.cells ) {
        var oTempRow = aTempObj.cells[i];
        var row = this._getRow( i - 0 );
        for ( var j in oTempRow ) {
            var oTempCell = oTempRow[j];
            if ( null != oTempCell ) {
                oTempCell.moveHor( offset.offsetCol );
                oTempCell.moveVer( offset.offsetRow );
                row.c[j] = oTempCell;

                if ( oTempCell.sFormula ) {
                    if(copyRange){
                        oTempCell.formulaParsed = new parserFormula( oTempCell.sFormula, oTempCell.oId.getID(), this );
                        oTempCell.formulaParsed.parse();
                        oTempCell.formulaParsed = oTempCell.formulaParsed.changeOffset(offset);
                        oTempCell.sFormula = oTempCell.formulaParsed.assemble();
						
						addToArrRecalc(this.getId(), oTempCell);
                    }
                }
            }
        }
    }

	History.TurnOn();
	if(false == this.workbook.bUndoChanges && false == this.workbook.bRedoChanges)
	{
		if(null != aTempObj.merged)
		{
			for(var i = 0, length = aTempObj.merged.length; i < length; i++)
			{
				var elem = aTempObj.merged[i];
				elem.bbox.setOffset(offset);
				this.mergeManager.add(elem.bbox, elem.data);
			}
		}
		if(null != aTempObj.hyperlinks)
		{
			for(var i = 0, length = aTempObj.hyperlinks.length; i < length; i++)
			{
				var elem = aTempObj.hyperlinks[i];
				elem.bbox.setOffset(offset);
				this.hyperlinkManager.add(elem.bbox, elem.data);
			}
		}
	}
	//расширяем границы
	if(oBBoxFrom.r2 > this.nRowsCount)
		this.nRowsCount = oBBoxFrom.r2 + 1;
	if(oBBoxFrom.c2 > this.nColsCount)
		this.nColsCount = oBBoxFrom.c2 + 1;
	if(oBBoxTo.r2 > this.nRowsCount)
		this.nRowsCount = oBBoxTo.r2 + 1;
	if(oBBoxTo.c2 > this.nColsCount)
		this.nColsCount = oBBoxTo.c2 + 1;

	if(!copyRange){
		var sBBoxFromName = oBBoxFrom.getName();
		this.workbook.needRecalc.nodes[getVertexId(this.getId(), sBBoxFromName)] = [this.getId(), sBBoxFromName];
		this.workbook.needRecalc.length++;
	}
	var sBBoxToName = oBBoxTo.getName();
	this.workbook.needRecalc.nodes[getVertexId(this.getId(), sBBoxToName)] = [this.getId(), sBBoxToName];
	this.workbook.needRecalc.length++;
	if ( this.workbook.isNeedCacheClean ){
		/*
			Если необходим пересчет, то по списку пересчитываемых ячеек сортируем граф зависимостей и пересчиываем в получившемся порядке. Плохим ячейкам с цикличискими ссылками выставляем ошибку "#REF!".
		*/
    sortDependency(this.workbook);
	}
    History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_MoveRange,
				this.getId(), new Asc.Range(0, 0, gc_nMaxCol0, gc_nMaxRow0),
				new UndoRedoData_FromTo(new UndoRedoData_BBox(oBBoxFrom), new UndoRedoData_BBox(oBBoxTo), copyRange));
	History.EndTransaction();
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
			var aIndexes = [];
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
	buildRecalc(this.workbook);
	unLockDraw(this.workbook);
	
	//todo проверить не уменьшились ли границы таблицы
	
//	for(var id  in res)
//		History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveCell, this.getId(), new Asc.Range(0, res[id].nRow, gc_nMaxCol0, res[id].nRow), new UndoRedoData_CellSimpleData(res[id].nRow, res[id].nCol, res[id].data, null));
	
	History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ShiftCellsLeft, this.getId(), new Asc.Range(0, oBBox.r1, gc_nMaxCol0, oBBox.r1), new UndoRedoData_BBox(oBBox));
};
Woorksheet.prototype._shiftCellsUp=function(oBBox){
	lockDraw(this.workbook);
	var nTop = oBBox.r1;
	var nBottom = oBBox.r2;
	var dif = nTop - nBottom - 1;
	var aIndexes = [];
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
	buildRecalc(this.workbook);
	unLockDraw(this.workbook);
	
	//todo проверить не уменьшились ли границы таблицы
	
//	for(var id  in res)
//		History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveCell, this.getId(), new Asc.Range(0, res[id].nRow, gc_nMaxCol0, res[id].nRow), new UndoRedoData_CellSimpleData(res[id].nRow, res[id].nCol, res[id].data, null));

	History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ShiftCellsTop, this.getId(), new Asc.Range(0, oBBox.r1, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_BBox(oBBox));
};
Woorksheet.prototype._shiftCellsRight=function(oBBox){
	History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ShiftCellsRight, this.getId(), new Asc.Range(0, oBBox.r1, gc_nMaxCol0, oBBox.r1), new UndoRedoData_BBox(oBBox));
	History.TurnOff();
	var nLeft = oBBox.c1;
	var nRight = oBBox.c2;
	var dif = nRight - nLeft + 1;
	for(var i = oBBox.r1; i <= oBBox.r2; i++){
		var row = this.aGCells[i];
		if(row){
			var aIndexes = [];
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

		
//	for(var id  in res)
//		History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveCell, this.getId(), new Asc.Range(0, res[id].nRow, gc_nMaxCol0, res[id].nRow), new UndoRedoData_CellSimpleData(res[id].nRow, res[id].nCol, res[id].data, null));
	
	History.TurnOn();
};
Woorksheet.prototype._shiftCellsBottom=function(oBBox){
	lockDraw(this.workbook);
	History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_ShiftCellsBottom, this.getId(), new Asc.Range(0, oBBox.r1, gc_nMaxCol0, gc_nMaxRow0), new UndoRedoData_BBox(oBBox));
	History.TurnOff();
	var nTop = oBBox.r1;
	var nBottom = oBBox.r2;
	var dif = nBottom - nTop + 1;
	var aIndexes = [];
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
	buildRecalc(this.workbook);
	unLockDraw(this.workbook);
		
//	for(var id  in res)
//		History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveCell, this.getId(), new Asc.Range(0, res[id].nRow, gc_nMaxCol0, res[id].nRow), new UndoRedoData_CellSimpleData(res[id].nRow, res[id].nCol, res[id].data, null));
	
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
		ca = g_oCellAddressUtils.getCellAddress(i);
		c = this._getCellNoEmpty(ca.getRow0(),ca.getCol0());

		if( c && c.sFormula ){
			c.formulaParsed = new parserFormula( c.sFormula, c.oId.getID(), this );
            c.formulaParsed.parse();
			c.formulaParsed.buildDependencies();
		}
	}
}
Woorksheet.prototype._RecalculatedFunctions=function(cell,bad){
    function adjustCellFormat( c ) {
        // ищет в формуле первый рэндж и устанавливает формат ячейки как формат первой ячейки в рэндже
        var elem = null;
        if ( c.formulaParsed && c.formulaParsed.outStack ) {
            for ( var i = 0, length = c.formulaParsed.outStack.length; i < length; i++ ) {
                elem = c.formulaParsed.outStack[i];
                if ( elem instanceof cRef || elem instanceof cRef3D || elem instanceof cArea || elem instanceof cArea3D ) {
                    var r = elem.getRange();
                    if ( elem instanceof cArea3D && r.length > 0 )
                        r = r[0];
                    if ( r && r.getNumFormatStr ) {
                        var sCurFormat = c.getNumFormatStr();
                        if ( g_oDefaultNum.f == sCurFormat ) {
                            var sNewFormat = r.getNumFormatStr();
                            if ( sCurFormat != sNewFormat )
                                c.setNumFormat( sNewFormat );
                        }
                    }
                    break;
                }
            }
        }
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
            case cElementType.name:
				__cell.oValue.type = CellValueType.Error;
				__cell.oValue.text = res.getValue().toString();
				break;
			default:
				__cell.oValue.type = CellValueType.String;
				__cell.oValue.text = res.getValue().toString();
		}
		__cell.setFormulaCA(res.ca);
		if( res.numFormat !== undefined && res.numFormat >= 0){

            if( aStandartNumFormatsId[__cell.getNumFormatStr()] == 0 )
			    __cell.setNumFormat(aStandartNumFormats[res.numFormat])

		}
		else if( res.numFormat !== undefined && res.numFormat == -1 ){
			adjustCellFormat(__cell,__cell.sFormula);
		}
	}
}
Woorksheet.prototype._ReBuildFormulas=function(cellRange){
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
Woorksheet.prototype.renameDependencyNodes = function(offset, oBBox, rec, noDelete){
	this.workbook.dependencyFormulas.checkOffset(oBBox, offset, this.Id, noDelete);
			}
Woorksheet.prototype.getAllCol = function(){
	if(null == this.oAllCol)
		this.oAllCol = new Col(this, g_nAllColIndex);
	return this.oAllCol;
}
Woorksheet.prototype.getHyperlinkByCell = function(row, col){
	var oHyperlink = this.hyperlinkManager.getByCell(row, col);
	return oHyperlink ? oHyperlink.data : null;
};
Woorksheet.prototype.getMergedByCell = function(row, col){
	var oMergeInfo = this.mergeManager.getByCell(row, col);
	return oMergeInfo ? oMergeInfo.bbox : null;
};
Woorksheet.prototype._expandRangeByMergedAddToOuter = function(aOuter, range, aMerged){
	for(var i = 0, length = aMerged.all.length; i < length; i++)
	{
		var elem = aMerged.all[i];
		if(!range.containsRange(elem.bbox))
			aOuter.push(elem);
	}
}
Woorksheet.prototype._expandRangeByMergedGetOuter = function(range){
	var aOuter = [];
	//смотрим только границы
	this._expandRangeByMergedAddToOuter(aOuter, range, this.mergeManager.get({r1: range.r1, c1: range.c1, r2: range.r2, c2: range.c1}));
	if(range.c1 != range.c2)
	{
		this._expandRangeByMergedAddToOuter(aOuter, range, this.mergeManager.get({r1: range.r1, c1: range.c2, r2: range.r2, c2: range.c2}));
		if(range.c2 - range.c1 > 1)
		{
			this._expandRangeByMergedAddToOuter(aOuter, range, this.mergeManager.get({r1: range.r1, c1: range.c1 + 1, r2: range.r1, c2: range.c2 - 1}));
			if(range.r1 != range.r2)
				this._expandRangeByMergedAddToOuter(aOuter, range, this.mergeManager.get({r1: range.r2, c1: range.c1 + 1, r2: range.r2, c2: range.c2 - 1}));
		}
	}
	return aOuter;
}
Woorksheet.prototype.expandRangeByMerged = function(range){
	if(null != range)
	{
		var aOuter = this._expandRangeByMergedGetOuter(range);
		if(aOuter.length > 0)
		{
			range = range.clone();
			while(aOuter.length > 0)
			{
				for(var i = 0, length = aOuter.length; i < length; i++)
					range.union2(aOuter[i].bbox);
				aOuter = this._expandRangeByMergedGetOuter(range);
			}
		}
	}
	return range;
};
//-------------------------------------------------------------------------------------------------
/**
 * @constructor
 */
function Cell(worksheet){
	this.ws = worksheet;
	this.sm = worksheet.workbook.oStyleManager;
	this.cs = worksheet.workbook.CellStyles;
	this.oValue = new CCellValue(this);
	this.xfs = null;
	this.tableXfs = null;
	this.conditionalFormattingXfs = null;
	this.bNeedCompileXfs = true;
	this.compiledXfs = null;
	this.oId = null;
	this.oFormulaExt = null;
	this.sFormula = null;
	this.sFormulaCA = null;
	this.formulaParsed = null;
}
Cell.prototype.getStyle=function(){
	if(this.bNeedCompileXfs)
	{
		this.bNeedCompileXfs = false;
		this.compileXfs();
	}
	return this.compiledXfs;
};
Cell.prototype.compileXfs=function(){
	this.compiledXfs = null;
	if(null != this.xfs || null != this.tableXfs || null != this.conditionalFormattingXfs)
	{
		if(null != this.tableXfs)
			this.compiledXfs = this.tableXfs;
		if(null != this.xfs)
		{
			if(null != this.compiledXfs)
				this.compiledXfs = this.xfs.merge(this.compiledXfs);
			else
				this.compiledXfs = this.xfs;
		}
		if(null != this.conditionalFormattingXfs)
		{
			if(null != this.compiledXfs)
				this.compiledXfs = this.conditionalFormattingXfs.merge(this.compiledXfs);
			else
				this.compiledXfs = this.xfs;
		}
	}
};
Cell.prototype.clone=function(){
	var oNewCell = new Cell(this.ws);
	oNewCell.oId = new CellAddress(this.oId.getRow(), this.oId.getCol());
	if(null != this.xfs)
		oNewCell.xfs = this.xfs.clone();
	oNewCell.oValue = this.oValue.clone(oNewCell);
	if(null != this.sFormula)
		oNewCell.sFormula = this.sFormula;
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
Cell.prototype.cleanCache=function(){
	this.oValue.cleanCache();
}
Cell.prototype.setFormula=function(val, bAddToHistory){
	if(bAddToHistory)
	{
		History.Add( g_oUndoRedoWorksheet, historyitem_Worksheet_RemoveCellFormula, this.ws.getId(), new Asc.Range( this.oId.getCol0(), this.oId.getRow0(), this.oId.getCol0(), this.oId.getRow0() ), new UndoRedoData_CellSimpleData( this.oId.getRow0(), this.oId.getCol0(), null, null, this.sFormula ));
	}
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

            var oldFP = undefined;

            if( this.formulaParsed  )
                oldFP = this.formulaParsed;

            this.formulaParsed = new parserFormula(val.substring(1),this.oId.getID(),this.ws);
			if( !this.formulaParsed.parse() ){
				switch( this.formulaParsed.error[this.formulaParsed.error.length-1] ){
					case c_oAscError.ID.FrmlWrongFunctionName:
						break;
					default :{
						wb.handlers.trigger("asc_onError",this.formulaParsed.error[this.formulaParsed.error.length-1], c_oAscError.Level.NoCritical);
						if( callback )
							callback(false);
                        if( oldFP !== undefined ){
                            this.formulaParsed = oldFP;
                        }
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
	var sheetId = this.ws.getId();
	if (this.sFormula)
		wb.dependencyFormulas.deleteMasterNodes2( ws.Id, this.oId.getID() );
	if( !(null != val && val[0] != "=" || true == numFormat.isTextFormat()))
		addToArrRecalc(this.ws.getId(), this);
	wb.needRecalc.nodes[getVertexId(sheetId,this.oId.getID())] = [sheetId, this.oId.getID()];
        wb.needRecalc.length++;
	
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
	if ( this.ws.workbook.isNeedCacheClean ){
		/*
			Если необходим пересчет, то по списку пересчитываемых ячеек сортируем граф зависимостей и пересчиываем в получившемся порядке. Плохим ячейкам с цикличискими ссылками выставляем ошибку "#REF!".
		*/
		sortDependency(this.ws.workbook);
	}
	var DataNew = null;
	if(History.Is_On())
		DataNew = this.getValueData();
	if(History.Is_On() && false == DataOld.isEqual(DataNew))
		History.Add(g_oUndoRedoCell, historyitem_Cell_ChangeValue, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), DataOld, DataNew));
	//todo не должны удаляться ссылки, если сделать merge ее части.
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
	var sheetId = this.ws.getId();
	if (this.sFormula)
		wb.dependencyFormulas.deleteMasterNodes2( ws.Id, this.oId.getID(), true );
	this.sFormula = null;
	this.oValue.clean();
	this.setFormulaCA(false);
	this.oValue.setValue2(array);
	
	wb.needRecalc.nodes[getVertexId(sheetId,this.oId.getID())] = [sheetId, this.oId.getID()];
		wb.needRecalc.length++;
		sortDependency(this.ws.workbook);
	var DataNew = null;
	if(History.Is_On())
		DataNew = this.getValueData();
	if(History.Is_On() && false == DataOld.isEqual(DataNew))
		History.Add(g_oUndoRedoCell, historyitem_Cell_ChangeValue, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), DataOld, DataNew));
	//todo не должны удаляться ссылки, если сделать merge ее части.
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
Cell.prototype.setCellStyle=function(val){
	var newVal = this.cs._prepareCellStyle(val);
	var oRes = this.sm.setCellStyle(this, newVal);
	if(History.Is_On()) {
		var oldStyleName = this.cs.getStyleNameByXfId(oRes.oldVal);
		History.Add(g_oUndoRedoCell, historyitem_Cell_Style, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oldStyleName, val));

		// Выставляем стиль
		var oStyle = this.cs.getStyleByXfId(oRes.newVal);
		if (oStyle.ApplyFont)
			this.setFont(oStyle.getFont());
		if (oStyle.ApplyFill)
			this.setFill(oStyle.getFill());
		if (oStyle.ApplyBorder)
			this.setBorder(oStyle.getBorder());
		if (oStyle.ApplyNumberFormat)
			this.setNumFormat(oStyle.getNumFormatStr());
	}
	this.bNeedCompileXfs = true;
	this.oValue.cleanCache();
};
Cell.prototype.setNumFormat=function(val){
	var oRes;
    if( val == aStandartNumFormats[0] &&
        this.formulaParsed && this.formulaParsed.value && this.formulaParsed.value.numFormat !== null &&
        this.formulaParsed.value.numFormat !== undefined && aStandartNumFormats[this.formulaParsed.value.numFormat] )
        oRes = this.sm.setNumFormat(this, aStandartNumFormats[this.formulaParsed.value.numFormat]);
    else
        oRes = this.sm.setNumFormat(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_Numformat, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.bNeedCompileXfs = true;
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
			var output = {};
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
				var output = {};
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
	this.bNeedCompileXfs = true;
	this.oValue.cleanCache();
};
Cell.prototype.setFontname=function(val){
	this.oValue.setFontname(val);
	var oRes = this.sm.setFontname(this, val);
	if(History.Is_On() && oRes.oldVal != oRes.newVal)
		History.Add(g_oUndoRedoCell, historyitem_Cell_Fontname, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.bNeedCompileXfs = true;
	this.oValue.cleanCache();
};
Cell.prototype.setFontsize=function(val){
	this.oValue.setFontsize(val);
	var oRes = this.sm.setFontsize(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_Fontsize, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.bNeedCompileXfs = true;
	this.oValue.cleanCache();
};
Cell.prototype.setFontcolor=function(val){
	this.oValue.setFontcolor(val);
	var oRes = this.sm.setFontcolor(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_Fontcolor, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.bNeedCompileXfs = true;
	this.oValue.cleanCache();
};
Cell.prototype.setBold=function(val){
	this.oValue.setBold(val);
	var oRes = this.sm.setBold(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_Bold, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.bNeedCompileXfs = true;
	this.oValue.cleanCache();
};
Cell.prototype.setItalic=function(val){
	this.oValue.setItalic(val);
	var oRes = this.sm.setItalic(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_Italic, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.bNeedCompileXfs = true;
	this.oValue.cleanCache();
};
Cell.prototype.setUnderline=function(val){
	this.oValue.setUnderline(val);
	var oRes = this.sm.setUnderline(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_Underline, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.bNeedCompileXfs = true;
	this.oValue.cleanCache();
};
Cell.prototype.setStrikeout=function(val){
	this.oValue.setStrikeout(val);
	var oRes = this.sm.setStrikeout(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_Strikeout, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.bNeedCompileXfs = true;
	this.oValue.cleanCache();
};
Cell.prototype.setFontAlign=function(val){
	this.oValue.setFontAlign(val);
	var oRes = this.sm.setFontAlign(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_FontAlign, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.bNeedCompileXfs = true;
	this.oValue.cleanCache();
}
Cell.prototype.setAlignVertical=function(val){
	var oRes = this.sm.setAlignVertical(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_AlignVertical, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.bNeedCompileXfs = true;
};
Cell.prototype.setAlignHorizontal=function(val){
	var oRes = this.sm.setAlignHorizontal(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_AlignHorizontal, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.bNeedCompileXfs = true;
};
Cell.prototype.setFill=function(val){
	var oRes = this.sm.setFill(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_Fill, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.bNeedCompileXfs = true;
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
	this.bNeedCompileXfs = true;
};
Cell.prototype.setShrinkToFit=function(val){
	var oRes = this.sm.setShrinkToFit(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_ShrinkToFit, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.bNeedCompileXfs = true;
};
Cell.prototype.setWrap=function(val){
	var oRes = this.sm.setWrap(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_Wrap, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.bNeedCompileXfs = true;
};
Cell.prototype.setAngle=function(val){
    var oRes = this.sm.setAngle(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_Angle, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
    this.bNeedCompileXfs = true;
};
Cell.prototype.setVerticalText=function(val){
    var oRes = this.sm.setVerticalText(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_Angle, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
    this.bNeedCompileXfs = true;
};
Cell.prototype.setQuotePrefix=function(val){
	var oRes = this.sm.setQuotePrefix(this, val);
    if(History.Is_On() && oRes.oldVal != oRes.newVal)
        History.Add(g_oUndoRedoCell, historyitem_Cell_SetQuotePrefix, this.ws.getId(), new Asc.Range(0, this.oId.getRow0(), gc_nMaxCol0, this.oId.getRow0()), new UndoRedoData_CellSimpleData(this.oId.getRow0(), this.oId.getCol0(), oRes.oldVal, oRes.newVal));
	this.oValue.cleanCache();
};
Cell.prototype.setConditionalFormattingStyle=function(xfs){
	this.conditionalFormattingXfs = xfs;
	this.bNeedCompileXfs = true;
	this.oValue.cleanCache();
}
Cell.prototype.setTableStyle=function(xfs){
	this.tableXfs = xfs;
	this.bNeedCompileXfs = true;
	this.oValue.cleanCache();
}
Cell.prototype.setStyle=function(xfs){
	var oldVal = this.xfs;
	var newVal = null;
    this.xfs = null;
	if(null != xfs)
	{
        this.xfs = xfs.clone();
        newVal = this.xfs;
	}
	this.bNeedCompileXfs = true;
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
Cell.prototype.getNumFormatStr=function(){
	if(null != this.xfs && null != this.xfs.num)
            return this.xfs.num.f;
	return g_oDefaultNum.f;
}
Cell.prototype.moveHor=function(val){
	//копируем потому что изначально обьект ыбл получен из g_oCellAddressUtils
	this.oId = new CellAddress(this.oId.getRow0(), this.oId.getCol0(), 0);
	this.oId.moveCol(val);
};
Cell.prototype.moveVer=function(val){
	//копируем потому что изначально обьект ыбл получен из g_oCellAddressUtils
	this.oId = new CellAddress(this.oId.getRow0(), this.oId.getCol0(), 0);
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
	else if( this.sFormulaCA ) this.sFormulaCA = null;
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
}
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
Range.prototype._foreach2=function(action){
	if(null != action)
	{
		var oBBox = this.bbox, minC = Math.min( this.worksheet.getColsCount(), oBBox.c2 ), minR = Math.min( this.worksheet.getRowsCount(), oBBox.r2 );
		for(var i = oBBox.r1; i <= minR; i++){
			for(var j = oBBox.c1; j <= minC; j++){
				var oCurCell = this.worksheet._getCellNoEmpty(i, j);
				var oRes = action(oCurCell, i, j, oBBox.r1, oBBox.c1);
				if(null != oRes)
					return oRes;
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
	return getRangeType(oBBox);
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
	var aResult = [];
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
	History.StartTransaction();
	var wb = this.worksheet.workbook, ws = this.worksheet, ar =[];
	//[{"text":"qwe","format":{"b":true, "i":false, "u":EUnderline.underlineNone, "s":false, "fn":"Arial", "fs": 12, "c": 0xff00ff, "va": "subscript"  }},{}...]
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
Range.prototype.setCellStyle=function(val){
	History.Create_NewPoint();
	var oBBox = this.bbox;
	this.createCellOnRowColCross();
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		this.worksheet.getAllCol().setCellStyle(val);
		fSetProperty = this._setPropertyNoEmpty;
	}
	fSetProperty.call(this, function(row){
			if(c_oRangeType.All == nRangeType && null == row.xfs)
				return;
			row.setCellStyle(val);
		},
		function(col){
			col.setCellStyle(val);
		},
		function(cell){
			cell.setCellStyle(val);
		});
};
Range.prototype.setTableStyle=function(val){
	this.createCellOnRowColCross();
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		//this.worksheet.getAllCol().setCellStyle(val);
		fSetProperty = this._setPropertyNoEmpty;
	}
	fSetProperty.call(this, function(row){
			if(c_oRangeType.All == nRangeType && null == row.xfs)
				return;
			//row.setCellStyle(val);
		},
		function(col){
			//col.setCellStyle(val);
		},
		function(cell){
			cell.setTableStyle(val);
		});
};
Range.prototype.setNumFormat=function(val){
	History.Create_NewPoint();
	var oBBox = this.bbox;
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
	var bRes = false;
	var oThis = this;
	this._setPropertyNoEmpty(null, null, function(cell, nRow0, nCol0, nRowStart, nColStart){
		bRes |= cell.shiftNumFormat(nShift, aDigitsCount[nCol0 - nColStart] || 8);
	});
	return bRes;
}
Range.prototype.setFont=function(val){
	History.Create_NewPoint();
	this.createCellOnRowColCross();
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		this.worksheet.getAllCol().setFont(val);
		fSetProperty = this._setPropertyNoEmpty;
	}
	fSetProperty.call(this, function(row){
		if(c_oRangeType.All == nRangeType && null == row.xfs)
			return;
		row.setFont(val);
	},
	function(col){
		col.setFont(val);
	},
	function(cell){
		cell.setFont(val);
	});
};
Range.prototype.setFontname=function(val){
	History.Create_NewPoint();
	var oBBox = this.bbox;
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
Range.prototype.setBorderSrc=function(border){
	History.Create_NewPoint();
	var oBBox = this.bbox;
	History.StartTransaction();
	if (null == border)
		border = new Border();
	this.createCellOnRowColCross();
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		this.worksheet.getAllCol().setBorder(border.clone());
		fSetProperty = this._setPropertyNoEmpty;
	}
	fSetProperty.call(this, function(row){
		if(c_oRangeType.All == nRangeType && null == row.xfs)
			return;
		row.setBorder(border.clone());
	},
	function(col){
		col.setBorder(border.clone());
	},
	function(cell){
		cell.setBorder(border.clone());
	});
	History.EndTransaction();
};
Range.prototype._setBorderMerge=function(bLeft, bTop, bRight, bBottom, oNewBorder, oCurBorder){
	var oTargetBorder = new Border();
	//не делаем clone для свойств потому у нас нельзя поменять свойство отдельное свойство border можно только применить border целиком
	if(bLeft)
		oTargetBorder.l = oNewBorder.l;
	else
		oTargetBorder.l = oNewBorder.iv;
	if(bTop)
		oTargetBorder.t = oNewBorder.t;
	else
		oTargetBorder.t = oNewBorder.ih;
	if(bRight)
		oTargetBorder.r = oNewBorder.r;
	else
		oTargetBorder.r = oNewBorder.iv;
	if(bBottom)
		oTargetBorder.b = oNewBorder.b;
	else
		oTargetBorder.b = oNewBorder.ih;
	oTargetBorder.dd = oNewBorder.dd;
	oTargetBorder.du = oNewBorder.du;
	var oRes = null;
	if(null != oCurBorder)
	{
		oCurBorder.mergeInner(oTargetBorder);
		oRes = oCurBorder;
	}
	else
		oRes = oTargetBorder;
	return oRes;
}
Range.prototype._setCellBorder=function(bbox, cell, oNewBorder){
	if(null == oNewBorder)
		cell.setBorder(oNewBorder);
	else
	{
		var oCurBorder = null;
        if(null != cell.xfs && null != cell.xfs.border)
			oCurBorder = cell.xfs.border.clone();
		else
			oCurBorder = g_oDefaultBorder.clone();
		var nRow = cell.oId.getRow0();
		var nCol = cell.oId.getCol0();
		cell.setBorder(this._setBorderMerge(nCol == bbox.c1, nRow == bbox.r1, nCol == bbox.c2, nRow == bbox.r2, oNewBorder, oCurBorder));
	}
}
Range.prototype._setRowColBorder=function(bbox, rowcol, bRow, oNewBorder){
	if(null == oNewBorder)
		rowcol.setBorder(oNewBorder);
	else
	{
		var oCurBorder = null;
		if(null != rowcol.xfs && null != rowcol.xfs.border)
			oCurBorder = rowcol.xfs.border.clone();
		var bLeft, bTop, bRight, bBottom = false;
		if(bRow)
		{
			bTop = rowcol.index == bbox.r1;
			bBottom = rowcol.index == bbox.r2;
		}
		else
		{
			bLeft = rowcol.index == bbox.c1;
			bRight = rowcol.index == bbox.c2;
		}
		rowcol.setBorder(this._setBorderMerge(bLeft, bTop, bRight, bBottom, oNewBorder, oCurBorder));
	}
}
Range.prototype._setBorderEdge=function(bbox, oItemWithXfs, nRow, nCol, oNewBorder){
	var oCurBorder = null;
    if(null != oItemWithXfs.xfs && null != oItemWithXfs.xfs.border)
		oCurBorder = oItemWithXfs.xfs.border;
	if(null != oCurBorder)
	{
		var oCurBorderProp = null;
		if(nCol == bbox.c1 - 1)
			oCurBorderProp = oCurBorder.r;
		else if(nRow == bbox.r1 - 1)
			oCurBorderProp = oCurBorder.b;
		else if(nCol == bbox.c2 + 1)
			oCurBorderProp = oCurBorder.l;
		else if(nRow == bbox.r2 + 1)
			oCurBorderProp = oCurBorder.t;
		var oNewBorderProp = null;
		if(null == oNewBorder)
			oNewBorderProp = new BorderProp();
		else
		{
			if(nCol == bbox.c1 - 1)
				oNewBorderProp = oNewBorder.l;
			else if(nRow == bbox.r1 - 1)
				oNewBorderProp = oNewBorder.t;
			else if(nCol == bbox.c2 + 1)
				oNewBorderProp = oNewBorder.r;
			else if(nRow == bbox.r2 + 1)
				oNewBorderProp = oNewBorder.b;
		}
		
		if(null != oNewBorderProp && null != oCurBorderProp && c_oAscBorderStyles.None != oCurBorderProp.s && (null == oNewBorder || c_oAscBorderStyles.None != oNewBorderProp.s) &&
			(oNewBorderProp.s != oCurBorderProp.s || oNewBorderProp.getRgbOrNull() != oCurBorderProp.getRgbOrNull())){
				var oTargetBorder = oCurBorder.clone();
				if(nCol == bbox.c1 - 1)
					oTargetBorder.r = new BorderProp();
				else if(nRow == bbox.r1 - 1)
					oTargetBorder.b = new BorderProp();
				else if(nCol == bbox.c2 + 1)
					oTargetBorder.l = new BorderProp();
				else if(nRow == bbox.r2 + 1)
					oTargetBorder.t = new BorderProp();
				oItemWithXfs.setBorder(oTargetBorder);
			}
	}
}
Range.prototype.setBorder=function(border){
	//border = null очисть border
	//"ih" - внутренние горизонтальные, "iv" - внутренние вертикальные
	History.Create_NewPoint();
	var _this = this;
	var oBBox = this.bbox;
	this.createCellOnRowColCross();
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		var oAllCol = this.worksheet.getAllCol();
		_this._setRowColBorder(oBBox, oAllCol, false, border);
		fSetProperty = this._setPropertyNoEmpty;
	}
	fSetProperty.call(this, function(row){
		if(c_oRangeType.All == nRangeType && null == row.xfs)
			return;
		_this._setRowColBorder(oBBox, row, true, border);
	},
	function(col){
		_this._setRowColBorder(oBBox, col, false, border);
	},
	function(cell){
		_this._setCellBorder(oBBox, cell, border);
	});
	//убираем граничные border
	var aEdgeBorders = [];
	if(oBBox.c1 > 0 && (null == border || !border.l.isEmpty()))
		aEdgeBorders.push(this.worksheet.getRange3(oBBox.r1, oBBox.c1 - 1, oBBox.r2, oBBox.c1 - 1));
	if(oBBox.r1 > 0 && (null == border || !border.t.isEmpty()))
		aEdgeBorders.push(this.worksheet.getRange3(oBBox.r1 - 1, oBBox.c1, oBBox.r1 - 1, oBBox.c2));
	if(oBBox.c2 < gc_nMaxCol0 && (null == border || !border.r.isEmpty()))
		aEdgeBorders.push(this.worksheet.getRange3(oBBox.r1, oBBox.c2 + 1, oBBox.r2, oBBox.c2 + 1));
	if(oBBox.r2 < gc_nMaxRow0 && (null == border || !border.b.isEmpty()))
		aEdgeBorders.push(this.worksheet.getRange3(oBBox.r2 + 1, oBBox.c1, oBBox.r2 + 1, oBBox.c2));
	for(var i = 0, length = aEdgeBorders.length; i < length; i++)
	{
		var range = aEdgeBorders[i];
		range._setPropertyNoEmpty(function(row){
			if(c_oRangeType.All == nRangeType && null == row.xfs)
				return;
			_this._setBorderEdge(oBBox, row, row.index, 0, border);
		},
		function(col){
			_this._setBorderEdge(oBBox, col, 0, col.index, border);
		},
		function(cell){
			_this._setBorderEdge(oBBox, cell, cell.oId.getRow0(), cell.oId.getCol0(), border);
		});
	}
};
Range.prototype.setShrinkToFit=function(val){
	History.Create_NewPoint();
	var oBBox = this.bbox;
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
	//[{"text":"qwe","format":{"b":true, "i":false, "u":EUnderline.underlineNone, "s":false, "fn":"Arial", "fs": 12, "c": 0xff00ff, "va": "subscript"  }},{}...]
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
Range.prototype.getXfId=function(){
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	if(null != cell) {
		var xfs = cell.getStyle();
		if(null != xfs && null != xfs.XfId)
			return xfs.XfId;
	} else {
		//стили столбов и колонок
		var row = this.worksheet._getRowNoEmpty(nRow);
		if(null != row && null != row.xfs && null != row.xfs.XfId)
			return row.xfs.XfId;
		var col = this.worksheet._getColNoEmptyWithAll(nCol);
		if(null != col && null != col.xfs && null != col.xfs.XfId)
			return col.xfs.XfId;
	}
	return g_oDefaultXfId;
};
Range.prototype.getStyleName=function(){
	var res = this.worksheet.workbook.CellStyles.getStyleNameByXfId(this.getXfId());

	// ToDo убрать эту заглушку (нужно делать на открытии) в InitStyleManager
	return res || this.worksheet.workbook.CellStyles.getStyleNameByXfId(g_oDefaultXfId);
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
		var xfs = cell.getStyle();
        if(null != xfs && null != xfs.num)
            return xfs.num.f;
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
Range.prototype.getNumFormatType=function(){
	return this.getNumFormat().getType();
}
Range.prototype.getFont = function(){
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	if(null != cell)
    {
		var xfs = cell.getStyle();
        if(null != xfs && null != xfs.font)
            return xfs.font;
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
		var xfs = cell.getStyle();
        if(null != xfs && null != xfs.font)
            return xfs.font.fn;
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
		var xfs = cell.getStyle();
        if(null != xfs && null != xfs.font)
            return xfs.font.fs;
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
		var xfs = cell.getStyle();
        if(null != xfs && null != xfs.font)
            return xfs.font.c;
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
		var xfs = cell.getStyle();
        if(null != xfs && null != xfs.font)
            return xfs.font.b;
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
		var xfs = cell.getStyle();
        if(null != xfs && null != xfs.font)
            return xfs.font.i;
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
		var xfs = cell.getStyle();
        if(null != xfs && null != xfs.font)
            return xfs.font.u;
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
Range.prototype.getStrikeout=function(){
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	if(null != cell)
    {
		var xfs = cell.getStyle();
        if(null != xfs && null != xfs.font)
            return xfs.font.s;
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
		var xfs = cell.getStyle();
        if(null != xfs && null != xfs.font)
            return xfs.font.va;
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
	if(null != cell)
	{
		var xfs = cell.getStyle();
		if(null != xfs && null != xfs.QuotePrefix)
			return xfs.QuotePrefix;
	}
	return false;
};
Range.prototype.getAlignVertical=function(){
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	if(null != cell)
    {
		var xfs = cell.getStyle();
        if(null != xfs)
		{
			if(null != xfs.align)
				return xfs.align.ver;
			else
				return g_oDefaultAlignAbs.ver;
		}
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
		var xfs = cell.getStyle();
        if(null != xfs)
		{
			if(null != xfs.align)
				return xfs.align.hor;
			else
				return g_oDefaultAlignAbs.hor;
		}
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
		var xfs = cell.getStyle();
        if(null != xfs && null != xfs.fill)
            return xfs.fill.bg;
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
		var xfs = cell.getStyle();
        if(null != xfs && null != xfs.border)
            return xfs.border;
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
	if(c_oAscBorderStyles.None === borders.l.s){
		if(nCol > 1){
			var left = this.getBorder(new CellAddress(nRow, nCol - 1, 0));
			if(c_oAscBorderStyles.None !== left.r.s)
				borders.l = left.r;
		}
	}
	if(c_oAscBorderStyles.None === borders.t.s){
		if(nRow > 1){
			var top = this.getBorder(new CellAddress(nRow - 1, nCol, 0));
			if(c_oAscBorderStyles.None !== top.b.s)
				borders.t = top.b;
		}
	}
	if(c_oAscBorderStyles.None === borders.r.s){
		var right = this.getBorder(new CellAddress(nRow, nCol + 1, 0));
		if(c_oAscBorderStyles.None !== right.l.s)
			borders.r = right.l;
	}
	if(c_oAscBorderStyles.None === borders.b.s){
		var bottom = this.getBorder(new CellAddress(nRow + 1, nCol, 0));
		if(c_oAscBorderStyles.None !== bottom.t.s)
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
		var xfs = cell.getStyle();
        if(null != xfs)
		{
			if(null != xfs.align)
				return xfs.align.shrink;
			else
				return g_oDefaultAlignAbs.shrink;
		}
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
Range.prototype.getWrapByAlign = function (align) {
	// Для justify wrap всегда true
	return "justify" === align.hor ? true : align.wrap;
};
Range.prototype.getWrap=function(){
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	if(null != cell) {
		var xfs = cell.getStyle();
        if(null != xfs) {
			if(null != xfs.align)
				return this.getWrapByAlign(xfs.align);
			else
				return this.getWrapByAlign(g_oDefaultAlignAbs);
		}
    } else {
		//стили столбов и колонок
		var row = this.worksheet._getRowNoEmpty(nRow);
		if(null != row && null != row.xfs && null != row.xfs.align)
			return this.getWrapByAlign(row.xfs.align);
		var col = this.worksheet._getColNoEmptyWithAll(nCol);
		if(null != col && null != col.xfs && null != col.xfs.align)
			return this.getWrapByAlign(col.xfs.align);
	}
    return this.getWrapByAlign(g_oDefaultAlign);
};
Range.prototype.getAngle=function(){
	//угол от -90 до 90 против часовой стрелки от оси OX
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	if(null != cell)
    {
		var xfs = cell.getStyle();
        if(null != xfs)
		{
			if(null != xfs.align)
				return angleFormatToInterface(xfs.align.angle);
			else
				return angleFormatToInterface(g_oDefaultAlignAbs.angle);
		}
    }
	else
	{
		//стили столбов и колонок
		var row = this.worksheet._getRowNoEmpty(nRow);
		if(null != row && null != row.xfs && null != row.xfs.align)
			return angleFormatToInterface(row.xfs.align.angle);
		var col = this.worksheet._getColNoEmptyWithAll(nCol);
		if(null != col && null != col.xfs && null != col.xfs.align)
			return angleFormatToInterface(col.xfs.align.angle);
	}
    return angleFormatToInterface(g_oDefaultAlign.angle);
};
Range.prototype.getVerticalText=function(){
	var nRow = this.bbox.r1;
	var nCol = this.bbox.c1;
	var cell = this.worksheet._getCellNoEmpty(nRow, nCol);
	if(null != cell)
    {
		var xfs = cell.getStyle();
        if(null != xfs)
		{
			if(null != xfs.align)
				return g_nVerticalTextAngle == xfs.align.angle;
			else
				return g_nVerticalTextAngle == g_oDefaultAlignAbs.angle;
		}
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
	var aMerged = this.worksheet.mergeManager.get(this.bbox);
	if(aMerged.all.length > 0)
		return aMerged.all[0].bbox;
	return null;
};
Range.prototype.mergeOpen=function(){
	this.worksheet.mergeManager.add(this.bbox, 1);
}
Range.prototype.merge=function(type){
	if(null == type)
		type = c_oAscMergeOptions.Merge;
	var oBBox = this.bbox;
	if(oBBox.r1 == oBBox.r2 && oBBox.c1 == oBBox.c2)
		return;
	History.Create_NewPoint();
	History.StartTransaction();
	if(this.hasMerged())
	{
		this.unmerge();
		if(type == c_oAscMergeOptions.MergeCenter)
		{
			//сбрасываем AlignHorizontal
			this.setAlignHorizontal("none");
			History.EndTransaction();
			return;
		}
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
		if(bFirst && false == cell.isEmptyText())
		{
			bFirst = false;
			oFirstCellStyle = cell.getStyle();
			oFirstCellValue = cell.getValueData();
			oFirstCellRow = cell.oId.getRow0();
			oFirstCellCol = cell.oId.getCol0();

		}
		if(nRow0 == nRowStart && nCol0 == nColStart)
			oLeftTopCellStyle = cell.getStyle();
	});
	//правила работы с гиперссылками во время merge(отличются от Excel в случаем областей, например hyperlink: C3:D3 мержим C2:C3)
	// 1)оставляем все ссылки, которые не полностью лежат в merge области
	// 2)оставляем многоклеточные ссылки, top граница которых совпадает с top границей merge области, а высота merge > 1 или совпадает с высотой области merge
	// 3)оставляем и переносим в первую ячейку одну одноклеточную ссылку, если она находится в первой ячейке с данными
	var aHyperlinks = this.worksheet.hyperlinkManager.get(oBBox);
	var aHyperlinksToRestore = [];
	for(var i = 0, length = aHyperlinks.inner.length; i < length; i++)
	{
		var elem = aHyperlinks.inner[i];
		if(oFirstCellRow == elem.bbox.r1 && oFirstCellCol == elem.bbox.c1 && elem.bbox.r1 == elem.bbox.r2 && elem.bbox.c1 == elem.bbox.c2)
		{
			var oNewHyperlink = elem.data.clone();
			oNewHyperlink.Ref.setOffset({offsetCol:oBBox.c1 - oFirstCellCol, offsetRow:oBBox.r1 - oFirstCellRow});
			aHyperlinksToRestore.push(oNewHyperlink);
		}
		else if( oBBox.r1 == elem.bbox.r1 && (elem.bbox.r1 != elem.bbox.r2 || (elem.bbox.c1 != elem.bbox.c2 && oBBox.r1 == oBBox.r2)))
			aHyperlinksToRestore.push(elem.data);
	}
	this.cleanAll();
	//восстанавливаем hyperlink
	for(var i = 0, length = aHyperlinksToRestore.length; i < length; i++)
	{
		var elem = aHyperlinksToRestore[i];
		this.worksheet.hyperlinkManager.add(elem.Ref.getBBox0(), elem);
	}
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
	var fSetProperty = this._setProperty;
	var nRangeType = this._getRangeType();
	if(c_oRangeType.All == nRangeType)
	{
		fSetProperty = this._setPropertyNoEmpty;
		oTargetStyle = null
	}
	fSetProperty.call(this, function(row){
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
	if(false == this.worksheet.workbook.bUndoChanges && false == this.worksheet.workbook.bRedoChanges)
		this.worksheet.mergeManager.add(this.bbox, 1);
	History.EndTransaction();
};
Range.prototype.unmerge=function(bOnlyInRange){
	History.Create_NewPoint();
	History.StartTransaction();
	if(false == this.worksheet.workbook.bUndoChanges && false == this.worksheet.workbook.bRedoChanges)
		this.worksheet.mergeManager.remove(this.bbox);
	History.EndTransaction();
};
Range.prototype._getHyperlinks=function(){
	var nRangeType = this._getRangeType();
	var result = [];
	var oThis = this;
	if(c_oRangeType.Range == nRangeType)
	{
		var oTempRows = {};
		var fAddToTempRows = function(oTempRows, bbox, data){
			if(null != bbox)
			{
				for(var i = bbox.r1; i <= bbox.r2; i++)
				{
					var row = oTempRows[i];
					if(null == row)
					{
						row = {};
						oTempRows[i] = row;
					}
					for(var j = bbox.c1; j <= bbox.c2; j++)
					{
						var cell = row[j];
						if(null == cell)
							row[j] = data;
					}
				}
			}
		};
		//todo возможно надо сделать оптимизацию для скрытых строк
		var aHyperlinks = this.worksheet.hyperlinkManager.get(this.bbox);
		for(var i = 0, length = aHyperlinks.all.length; i < length; i++)
		{
			var hyp = aHyperlinks.all[i];
			var hypBBox = hyp.bbox.intersectionSimple(this.bbox);
			fAddToTempRows(oTempRows, hypBBox, hyp.data);
			//расширяем гиперссылки на merge ячейках
			var aMerged = this.worksheet.mergeManager.get(hyp.bbox);
			for(var j = 0, length2 = aMerged.all.length; j < length2; j++)
			{
				var merge = aMerged.all[j];
				var mergeBBox = merge.bbox.intersectionSimple(this.bbox);
				fAddToTempRows(oTempRows, mergeBBox, hyp.data);
			}
		}
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
};
Range.prototype.getHyperlink=function(){
	var aHyperlinks = this._getHyperlinks();
	if(null != aHyperlinks && aHyperlinks.length > 0)
		return aHyperlinks[0].hyperlink;
	return null;
};
Range.prototype.getHyperlinks=function(){
	return this._getHyperlinks();
};
Range.prototype.setHyperlinkOpen=function(val){
	if(null != val && false == val.isValid())
		return;
	this.worksheet.hyperlinkManager.add(val.Ref.getBBox0(), val);
};
Range.prototype.setHyperlink=function(val, bWithoutStyle){
	if(null != val && false == val.isValid())
		return;
	//проверяем, может эта ссылка уже существует
    var i, length, hyp;
	var bExist = false;
	var aHyperlinks = this.worksheet.hyperlinkManager.get(this.bbox);
	for(i = 0, length = aHyperlinks.all.length; i < length; i++)
	{
		hyp = aHyperlinks.all[i];
		if(hyp.data.isEqual(val))
		{
			bExist = true;
			break;
		}
	}
	if(false == bExist)
	{
		History.Create_NewPoint();
		History.StartTransaction();
		if(false == this.worksheet.workbook.bUndoChanges && false == this.worksheet.workbook.bRedoChanges)
		{
			//удаляем ссылки с тем же адресом
			for(i = 0, length = aHyperlinks.all.length; i < length; i++)
			{
				hyp = aHyperlinks.all[i];
				if(hyp.bbox.isEqual(this.bbox))
					this.worksheet.hyperlinkManager.removeElement(hyp);
			}
		}
		//todo перейти на CellStyle
		if(true != bWithoutStyle)
		{
			var oHyperlinkFont = new Font();
			oHyperlinkFont.fn = this.worksheet.workbook.getDefaultFont();
			oHyperlinkFont.fs = this.worksheet.workbook.getDefaultSize();
			oHyperlinkFont.u = EUnderline.underlineSingle;
			oHyperlinkFont.c = g_oColorManager.getThemeColor(g_nColorHyperlink);
			this.setFont(oHyperlinkFont);
		}
		if(false == this.worksheet.workbook.bUndoChanges && false == this.worksheet.workbook.bRedoChanges)
			this.worksheet.hyperlinkManager.add(val.Ref.getBBox0(), val);
		History.EndTransaction();
	}
};
Range.prototype.removeHyperlink=function(val){
	var bbox = this.bbox;
	var elem = null;
	if(null != val)
	{
		bbox = val.Ref.getBBox0();
		elem = new RangeDataManagerElem(bbox, val);
	}
	History.Create_NewPoint();
	History.StartTransaction();
	if(false == this.worksheet.workbook.bUndoChanges && false == this.worksheet.workbook.bRedoChanges)
	{
		if(null != elem)
			this.worksheet.hyperlinkManager.removeElement(elem);
		else
			this.worksheet.hyperlinkManager.remove(bbox);
	}
	History.EndTransaction();
};
Range.prototype.deleteCellsShiftUp=function(){
	return this._shiftUpDown(true);
};
Range.prototype.addCellsShiftBottom=function(){
	return this._shiftUpDown(false);
};
Range.prototype.addCellsShiftRight=function(){
	return this._shiftLeftRight(false);
};
Range.prototype.deleteCellsShiftLeft=function(){
	return this._shiftLeftRight(true);
};
Range.prototype._shiftLeftRight=function(bLeft){
    lockDraw(this.worksheet.workbook);
	var oBBox = this.bbox;
	var nWidth = oBBox.c2 - oBBox.c1 + 1;
	var nRangeType = this._getRangeType(oBBox);
	if(c_oRangeType.Range != nRangeType && c_oRangeType.Col != nRangeType)
		return false;
	var mergeManager = this.worksheet.mergeManager;
	//todo вставить предупреждение, что будет unmerge
	History.Create_NewPoint();
	History.StartTransaction();
	if(false == this.worksheet.workbook.bUndoChanges && false == this.worksheet.workbook.bRedoChanges)
	{
		var oShiftGet = mergeManager.shiftGet(this.bbox, true);
		var aMerged = oShiftGet.elems;
		if(null != aMerged.outer && aMerged.outer.length > 0)
		{
			var bChanged = false;
			for(var i = 0, length = aMerged.outer.length; i < length; i++)
			{
				var elem = aMerged.outer[i];
				if(!(elem.bbox.c1 < oShiftGet.bbox.c1 && oShiftGet.bbox.r1 <= elem.bbox.r1 && elem.bbox.r2 <= oShiftGet.bbox.r2))
				{
					mergeManager.removeElement(elem);
					bChanged = true;
				}
			}
			if(bChanged)
				oShiftGet = null;
		}
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
	if(false == this.worksheet.workbook.bUndoChanges && false == this.worksheet.workbook.bRedoChanges)
	{
		mergeManager.shift(this.bbox, !bLeft, true, oShiftGet);
		this.worksheet.hyperlinkManager.shift(this.bbox, !bLeft, true);
	}
	History.EndTransaction();
    buildRecalc(this.worksheet.workbook);
    unLockDraw(this.worksheet.workbook);
	return true;
};
Range.prototype._shiftUpDown=function(bUp){
	var oBBox = this.bbox;
	var nHeight = oBBox.r2 - oBBox.r1 + 1;
	var nRangeType = this._getRangeType(oBBox);
	if(c_oRangeType.Range != nRangeType && c_oRangeType.Row != nRangeType)
		return false;
	var mergeManager = this.worksheet.mergeManager;
	//todo вставить предупреждение, что будет unmerge
	History.Create_NewPoint();
	History.StartTransaction();
	if(false == this.worksheet.workbook.bUndoChanges && false == this.worksheet.workbook.bRedoChanges)
	{
		var oShiftGet = mergeManager.shiftGet(this.bbox, false);
		var aMerged = oShiftGet.elems;
		if(null != aMerged.outer && aMerged.outer.length > 0)
		{	
			var bChanged = false;
			for(var i = 0, length = aMerged.outer.length; i < length; i++)
			{
				var elem = aMerged.outer[i];
				if(!(elem.bbox.r1 < oShiftGet.bbox.r1 && oShiftGet.bbox.c1 <= elem.bbox.c1 && elem.bbox.c2 <= oShiftGet.bbox.c2))
				{
					mergeManager.removeElement(elem);
					bChanged = true;
				}
			}
			if(bChanged)
				oShiftGet = null;
		}
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
	if(false == this.worksheet.workbook.bUndoChanges && false == this.worksheet.workbook.bRedoChanges)
	{
		mergeManager.shift(this.bbox, !bUp, false, oShiftGet);
		this.worksheet.hyperlinkManager.shift(this.bbox, !bUp, false);
	}
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
};
Range.prototype.setOffsetFirst=function(offset){//offset = {offsetCol:intNumber, offsetRow:intNumber}
	this.bbox.c1 += offset.offsetCol;
	if( this.bbox.c1 < 0 )
		this.bbox.c1 = 0;
	this.bbox.r1 += offset.offsetRow;
	if( this.bbox.r1 < 0 )
		this.bbox.r1 = 0;
	this.first = new CellAddress(this.bbox.r1, this.bbox.c1, 0);
};
Range.prototype.setOffsetLast=function(offset){//offset = {offsetCol:intNumber, offsetRow:intNumber}
	this.bbox.c2 += offset.offsetCol;
	if( this.bbox.c2 < 0 )
		this.bbox.c2 = 0;
	this.bbox.r2 += offset.offsetRow;
	if( this.bbox.r2 < 0 )
		this.bbox.r2 = 0;
	this.last = new CellAddress(this.bbox.r2, this.bbox.c2, 0);
};
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
};
Range.prototype.cleanCache=function(){
	this._setPropertyNoEmpty(null,null,function(cell, nRow0, nCol0, nRowStart, nColStart){
		cell.cleanCache();
	});
};
Range.prototype.cleanFormat=function(){
	History.Create_NewPoint();
	History.StartTransaction();
	this.unmerge();
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
};
Range.prototype.cleanText=function(){
	History.Create_NewPoint();
	History.StartTransaction();
	this._setPropertyNoEmpty(null, null,
		function(cell, nRow0, nCol0, nRowStart, nColStart){
			cell.setValue("");
			// if(cell.isEmpty())
				// cell.Remove();
	});
	History.EndTransaction();
};
Range.prototype.cleanAll=function(){
	History.Create_NewPoint();
	History.StartTransaction();
	this.unmerge();
	//удаляем только гиперссылки, которые полностью лежат в области
	var aHyperlinks = this.worksheet.hyperlinkManager.get(this.bbox);
	for(var i = 0, length = aHyperlinks.inner.length; i < length; ++i)
		this.removeHyperlink(aHyperlinks.inner[i].data);
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
	buildRecalc(this.worksheet.workbook);
	History.EndTransaction();
};
Range.prototype.sort=function(nOption, nStartCol){
	//todo горизонтальная сортировка
	var aMerged = this.worksheet.mergeManager.get(this.bbox);
	if(aMerged.outer.length > 0 || (aMerged.inner.length > 0 && null == this._isSameSizeMerged(this.bbox, aMerged.inner)))
		return null;
	var nMergedHeight = 1;
	if(aMerged.inner.length > 0)
	{
		var merged = aMerged.inner[0];
		nMergedHeight = merged.bbox.r2 - merged.bbox.r1 + 1;
		//меняем nStartCol, потому что приходит колонка той ячейки, на которой начали выделение
		nStartCol = merged.bbox.c1;
	}
	lockDraw(this.worksheet.workbook);
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
	var aSortElems = [];
	var aHiddenRow = {};
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
		var res = 0;
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
		if(0 == res)
			res = a.row - b.row;
		else if(!bAscent)
			res = -res;
		return res;
	});
	//проверяем что это не пустая операция
	var aSortData = [];
	var nHiddenCount = 0;
	var oFromArray = {};
	var nRowMax = 0;
	var nRowMin = gc_nMaxRow0;
	var nToMax = 0;
	for(var i = 0, length = aSortElems.length; i < length; ++i)
	{
		var item = aSortElems[i];
		var nNewIndex = i * nMergedHeight + nRowFirst0 + nHiddenCount;
		while(null != aHiddenRow[nNewIndex])
		{
			nHiddenCount++;
			nNewIndex = i * nMergedHeight + nRowFirst0 + nHiddenCount;
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
		var oSelection = History.GetSelection();
		if(null != oSelection)
		{
			oSelection = oSelection.clone();
			oSelection.assign(nColFirst0, nRowFirst0, nLastCol0, nLastRow0);
			History.SetSelection(oSelection);
			History.SetSelectionRedo(oSelection);
		}
		var oUndoRedoBBox = new UndoRedoData_BBox({r1:nRowFirst0, c1:nColFirst0, r2:nLastRow0, c2:nLastCol0});
		oRes = new UndoRedoData_SortData(oUndoRedoBBox, aSortData);
		History.Add(g_oUndoRedoWorksheet, historyitem_Worksheet_Sort, this.worksheet.getId(), new Asc.Range(0, nRowFirst0, gc_nMaxCol0, nLastRow0), oRes);
		this._sortByArray(oUndoRedoBBox, aSortData);
	}
    buildRecalc(this.worksheet.workbook);
    unLockDraw(this.worksheet.workbook);
	return oRes;
}
Range.prototype._sortByArray=function(oBBox, aSortData, bUndo){
    var rec = {length:0};
	var oSortedIndexes = {};
	for(var i = 0, length = aSortData.length; i < length; ++i)
	{
		var item = aSortData[i];
		var nFrom = item.from;
		var nTo = item.to;
		if(true == this.worksheet.workbook.bUndoChanges)
		{
			nFrom = item.to;
			nTo = item.from;
		}
		oSortedIndexes[nFrom] = nTo;
	}
	//сортируются только одинарные гиперссылки, все неодинарные оставляем
	var aSortedHyperlinks = [];
	if(false == this.worksheet.workbook.bUndoChanges && false == this.worksheet.workbook.bRedoChanges)
	{
		var aHyperlinks = this.worksheet.hyperlinkManager.get(this.bbox);
		for(var i = 0, length = aHyperlinks.inner.length; i < length; i++)
		{
			var elem = aHyperlinks.inner[i];
			var hyp = elem.data;
			if(hyp.Ref.isOneCell())
			{
				var nFrom = elem.bbox.r1;
				var nTo = oSortedIndexes[nFrom];
				if(null != nTo)
				{
					//удаляем ссылки, а не перемеаем, чтобы не было конфликтов(например в случае если все ячейки имеют ссылки и их надо передвинуть)
					var oTempBBox = hyp.Ref.getBBox0();
					this.worksheet.hyperlinkManager.removeElement(new RangeDataManagerElem(oTempBBox, hyp));
					var oNewHyp = hyp.clone();
					oNewHyp.Ref.setOffset({offsetCol: 0, offsetRow: nTo - nFrom});
					aSortedHyperlinks.push(oNewHyp);
				}
			}
		}
	}
	//окончательно устанавливаем ячейки
	var nColFirst0 = oBBox.c1;
	var nLastCol0 = oBBox.c2;
	for(var i = nColFirst0; i <= nLastCol0; ++i)
	{
		//запоминаем ячейки в которые уже что-то передвинули, чтобы не потерять их
		var oTempCellsTo = {};
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
				if(oCurCell.sFormula)
				{
					var sNewName = oCurCell.getName();
					oCurCell.setFormula(oCurCell.formulaParsed.changeOffset({offsetCol:0, offsetRow:shift}).assemble());//получаем новую формулу, путем сдвига входящих в нее ссылок на ячейки на offsetCol и offsetRow. не путать с shiftCells - меняет одну конкретную ячейку в формуле, changeOffset - меняет оффсет для всех входящих в формулу ячеек.
					this.worksheet.workbook.dependencyFormulas.deleteMasterNodes2( this.worksheet.Id, lastName );//разрываем ссылки между старой ячейкой и ведущими ячейками для нее.
					addToArrRecalc(this.worksheet.getId(), oCurCell);
				}
				}
			else
			{
				if(null != rowTo.c[i])
				{
					//здесь достаточно простого delete, потому что на самом деле в функции ячейки только меняются местами, удаления не происходит
					delete rowTo.c[i];
				}
			}
		}
	}
	var aNodes = this.worksheet.workbook.dependencyFormulas.getInRange( this.worksheet.Id, new Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2) );
	if(aNodes && aNodes.length > 0)
	{
		for(var i = 0, length = aNodes.length; i < length; ++i)
		{
			var node = aNodes[i];
			this.worksheet.workbook.needRecalc.nodes[ node.nodeId ] = [ node.sheetId, node.cellId ];
			this.worksheet.workbook.needRecalc.length++;
		}
	}

	if (this.worksheet.workbook.isNeedCacheClean)
		sortDependency(this.worksheet.workbook);
	if(false == this.worksheet.workbook.bUndoChanges && false == this.worksheet.workbook.bRedoChanges)
	{
		//восстанавливаем удаленые гиперссылки
		if(aSortedHyperlinks.length > 0)
		{
			for(var i = 0, length = aSortedHyperlinks.length; i < length; i++)
			{
				var hyp = aSortedHyperlinks[i];
				this.worksheet.hyperlinkManager.add(hyp.Ref.getBBox0(), hyp);
			}
		}
	}
};
Range.prototype._isSameSizeMerged=function(bbox, aMerged){
	var oRes = null;
	var nWidth = null;
	var nHeight = null;
	for(var i = 0, length = aMerged.length; i < length; i++)
	{
		var mergedBBox = aMerged[i].bbox;
		var nCurWidth = mergedBBox.c2 - mergedBBox.c1 + 1;
		var nCurHeight = mergedBBox.r2 - mergedBBox.r1 + 1;
		if(null == nWidth || null == nHeight)
		{
			nWidth = nCurWidth;
			nHeight = nCurHeight;
		}
		else if(nCurWidth != nWidth || nCurHeight != nHeight)
		{
			nWidth = null;
			nHeight = null;
			break;
		}
	}
	if(null != nWidth && null != nHeight)
	{
		//проверяем что merge ячеки полностью заполняют область
		var nBBoxWidth = bbox.c2 - bbox.c1 + 1;
		var nBBoxHeight = bbox.r2 - bbox.r1 + 1;
		if(nBBoxWidth == nWidth || nBBoxHeight == nHeight)
		{
			var bRes = false;
			var aRowColTest = null;
			if(nBBoxWidth == nWidth && nBBoxHeight == nHeight)
				bRes = true;
			else if(nBBoxWidth == nWidth)
			{
				aRowColTest = new Array(nBBoxHeight);
				for(var i = 0, length = aMerged.length; i < length; i++)
				{
					var merged = aMerged[i];
					for(var j = merged.bbox.r1; j <= merged.bbox.r2; j++)
						aRowColTest[j - bbox.r1] = 1;
				}
			}
			else if(nBBoxHeight == nHeight)
			{
				aRowColTest = new Array(nBBoxWidth);
				for(var i = 0, length = aMerged.length; i < length; i++)
				{
					var merged = aMerged[i];
					for(var j = merged.bbox.c1; j <= merged.bbox.c2; j++)
						aRowColTest[j - bbox.c1] = 1;
				}
			}
			if(null != aRowColTest)
			{
				var bExistNull = false;
				for(var i = 0, length = aRowColTest.length; i < length; i++)
				{
					if(null == aRowColTest[i])
					{
						bExistNull = true;
						break;
					}
				}
				if(!bExistNull)
					bRes = true;
			}
			if(bRes)
				oRes = {width: nWidth, height: nHeight};
		}
	}
	return oRes;
}
Range.prototype._canPromote=function(oPromoteRange, nWidth, nHeight, bVertical, nIndex){
	var oRes = {oMergedFrom: null, oMergedTo: null};
	//если надо только удалить внутреннее содержимое не смотрим на замерженость
	if(!((true == bVertical && nIndex >= 0 && nIndex < nHeight) || (false == bVertical && nIndex >= 0 && nIndex < nWidth)))
	{
		if(null != oPromoteRange){
			var oMergedTo = this.worksheet.mergeManager.get(oPromoteRange.getBBox0());
			if(oMergedTo.outer.length > 0)
				oRes = null;
			else
			{
				var oMergedFrom = this.worksheet.mergeManager.get(this.getBBox0());
				oRes.oMergedFrom = oMergedFrom;				
				if(oMergedTo.inner.length > 0)
				{
					oRes.oMergedTo = oMergedTo;
					if(oMergedFrom.inner.length > 0)
					{
						//merge области должны иметь одинаковый размер
						var oSizeFrom = this._isSameSizeMerged(this.getBBox0(), oMergedFrom.inner);
						var oSizeTo = this._isSameSizeMerged(oPromoteRange.getBBox0(), oMergedTo.inner);
						if(!(null != oSizeFrom && null != oSizeTo && oSizeTo.width == oSizeFrom.width && oSizeTo.height == oSizeFrom.height))
							oRes = null;
					}
					else
						oRes = null;
				}
			}
		}
	}
	return oRes;
}
Range.prototype.promote=function(bCtrl, bVertical, nIndex){
	//todo отдельный метод для promote в таблицах и merge в таблицах
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
	var oPromoteAscRange = null;
	var oPromoteRange = null;
	if(0 == nIndex)
		oPromoteAscRange = Asc.Range(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2);
	else
	{
		if(bVertical)
		{
			if(nIndex > 0)
			{
				if(nIndex >= nHeight)
					oPromoteAscRange = Asc.Range(oBBox.c1, oBBox.r2 + 1, oBBox.c2, oBBox.r1 + nIndex);
				else
					oPromoteAscRange = Asc.Range(oBBox.c1, oBBox.r1 + nIndex, oBBox.c2, oBBox.r2);
			}
			else
				oPromoteAscRange = Asc.Range(oBBox.c1, oBBox.r1 + nIndex, oBBox.c2, oBBox.r1 - 1);
		}
		else
		{
			if(nIndex > 0)
			{
				if(nIndex >= nWidth)
					oPromoteAscRange = Asc.Range(oBBox.c2 + 1, oBBox.r1, oBBox.c1 + nIndex, oBBox.r2);
				else
					oPromoteAscRange = Asc.Range(oBBox.c1 + nIndex, oBBox.r1, oBBox.c2, oBBox.r2);
			}
			else
				oPromoteAscRange = Asc.Range(oBBox.c1 + nIndex, oBBox.r1, oBBox.c1 - 1, oBBox.r2);
		}
	}
	//проверяем можно ли осуществить promote
	oPromoteRange = this.worksheet.getRange3(oPromoteAscRange.r1, oPromoteAscRange.c1, oPromoteAscRange.r2, oPromoteAscRange.c2);
	var oCanPromote = this._canPromote(oPromoteRange, nWidth, nHeight, bVertical, nIndex);
	if(null == oCanPromote)
		return;

	lockDraw(this.worksheet.workbook);
	var recalcArr = [];
	History.Create_NewPoint();
	var oSelection = History.GetSelection();
	if(null != oSelection)
	{
		oSelection = oSelection.clone();
		oSelection.assign(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2);
		History.SetSelection(oSelection);
	}
	var oSelectionRedo = History.GetSelectionRedo();
	if(null != oSelectionRedo)
	{
		oSelectionRedo = oSelectionRedo.clone();
		if(0 == nIndex)
			oSelectionRedo.assign(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r2);
		else
		{
			if(bVertical)
			{
				if(nIndex > 0)
				{
					if(nIndex >= nHeight)
						oSelectionRedo.assign(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r1 + nIndex);
					else
						oSelectionRedo.assign(oBBox.c1, oBBox.r1, oBBox.c2, oBBox.r1 + nIndex - 1);
				}
				else
					oSelectionRedo.assign(oBBox.c1, oBBox.r1 + nIndex, oBBox.c2, oBBox.r2);
			}
			else
			{
				if(nIndex > 0)
				{
					if(nIndex >= nWidth)
						oSelectionRedo.assign(oBBox.c1, oBBox.r1, oBBox.c1 + nIndex, oBBox.r2);
					else
						oSelectionRedo.assign(oBBox.c1, oBBox.r1, oBBox.c1 + nIndex - 1, oBBox.r2);
				}
				else
					oSelectionRedo.assign(oBBox.c1 + nIndex, oBBox.r1, oBBox.c2, oBBox.r2);
			}
		}
		History.SetSelectionRedo(oSelectionRedo);
	}
    History.StartTransaction();
	var nLastCol = oPromoteAscRange.c2;
	if(bWholeRow)
	{
		nLastCol = 0;
		this._foreachRowNoEmpty(function(){}, function(cell){
			var nCurCol0 = cell.oId.getCol0();
			if(nCurCol0 > nLastCol0)
				nLastCol0 = nCurCol0;
		});
	}
	var nLastRow = oPromoteAscRange.r2;
	if(bWholeCol)
	{
		nLastRow = 0;
		this._foreachColNoEmpty(function(){}, function(cell){
			var nCurRow0 = cell.oId.getRow0();
			if(nCurRow0 > nLastRow)
				nLastRow = nCurRow0;
		});
	}
	if(nLastCol != oPromoteAscRange.c2 || nLastRow != oPromoteAscRange.r2)
	{
		oPromoteRange.setOffsetLast({offsetCol:nLastCol - oPromoteAscRange.c2, offsetRow:nLastRow - oPromoteAscRange.r2});
		oPromoteAscRange = oPromoteRange.getBBox0();
	}
	//удаляем текст или все в области для заполнения
	if(nIndex >= 0 && ((true == bVertical && nHeight > nIndex) || (false == bVertical && nWidth > nIndex)))
	{
		//удаляем только текст в области для заполнения
		oPromoteRange.cleanText();
	}
	else
	{
		//удаляем все в области для заполнения
		oPromoteRange.cleanAll();
		//собираем все данные
		var bReverse = false;
		if(nIndex < 0)
			bReverse = true;
		var oPromoteHelper = new PromoteHelper(bVertical, bReverse, oBBox);
		this._foreachNoEmpty(function(oCell, nRow0, nCol0,nRowStart0, nColStart0){
			 if(null != oCell)
			 {
				var nVal = null;
				var bDelimiter = false;
				var sPrefix = null;
				var bDate = false;
				if (!oCell.sFormula)
				{
					var sValue = oCell.getValueWithoutFormat();
					if("" != sValue)
					{
						bDelimiter = true;
						var nType = oCell.getType();
						if(CellValueType.Number == nType || CellValueType.String == nType)
						{
							if(CellValueType.Number == nType)
								nVal = sValue - 0;
							else
							{
								//если текст заканчивается на цифру тоже используем ее
								var nEndIndex = sValue.length;
								for(var k = sValue.length - 1; k >= 0; --k)
								{
									var sCurChart = sValue[k];
									if('0' <= sCurChart && sCurChart <= '9')
										nEndIndex--;
									else
										break;
								}
								if(sValue.length != nEndIndex)
								{
									sPrefix = sValue.substring(0, nEndIndex);
									nVal = sValue.substring(nEndIndex) - 0;
								}
							}
						}
						if(null != oCell.xfs && null != oCell.xfs.num && null != oCell.xfs.num.f){
							var numFormat = oNumFormatCache.get(oCell.xfs.num.f);
							if(numFormat.isDateTimeFormat())
								bDate = true;
						}
						if(null != nVal)
							bDelimiter = false;
					}
				}
				else
					bDelimiter = true;
				oPromoteHelper.add(nRow0 - nRowStart0, nCol0 - nColStart0, nVal, bDelimiter, sPrefix, bDate, oCell);
             }
		});
		var bCopy = false;
		if(bCtrl)
			bCopy = true;
		//в случае одной ячейки с числом меняется смысл bCtrl
		if(1 == nWidth && 1 == nHeight && oPromoteHelper.isOnlyIntegerSequence())
			bCopy = !bCopy;
		oPromoteHelper.finishAdd(bCopy);
		//заполняем ячейки данными
		var nStartRow, nEndRow, nStartCol, nEndCol, nColDx, bRowFirst;
		if(bVertical)
		{
			nStartRow = oPromoteAscRange.c1;
			nEndRow = oPromoteAscRange.c2;
			bRowFirst = false;
			if(bReverse)
			{
				nStartCol = oPromoteAscRange.r2;
				nEndCol = oPromoteAscRange.r1;
				nColDx = -1;
			}
			else
			{
				nStartCol = oPromoteAscRange.r1;
				nEndCol = oPromoteAscRange.r2;
				nColDx = 1;
			}
		}
		else
		{
			nStartRow = oPromoteAscRange.r1;
			nEndRow = oPromoteAscRange.r2;
			bRowFirst = true;
			if(bReverse)
			{
				nStartCol = oPromoteAscRange.c2;
				nEndCol = oPromoteAscRange.c1;
				nColDx = -1;
			}
			else
			{
				nStartCol = oPromoteAscRange.c1;
				nEndCol = oPromoteAscRange.c2;
				nColDx = 1;
			}
		}
		for(var i = nStartRow; i <= nEndRow; i ++)
        {
			oPromoteHelper.setIndex(i - nStartRow);
            for(var j = nStartCol; (nStartCol - j) * (nEndCol - j) <= 0; j += nColDx)
            {
                var data = oPromoteHelper.getNext();
				if(null != data && (data.oAdditional || (false == bCopy && null != data.nCurValue)))
				{
					var oFromCell = data.oAdditional;
					var oCopyCell = null;
					if(bRowFirst)
						oCopyCell = this.worksheet._getCell(i, j);
					else
						oCopyCell = this.worksheet._getCell(j, i);
					if(null != oFromCell)
					{
						oCopyCell.setStyle(oFromCell.getStyle());
						oCopyCell.setType(oFromCell.getType());
					}
					if(false == bCopy && null != data.nCurValue)
					{
						var sVal = "";
						if(null != data.sPrefix)
							sVal += data.sPrefix;
						sVal += data.nCurValue;
						oCopyCell.setValue(sVal);
					}
					else if(null != oFromCell)
					{
						//копируем полностью
						if(!oFromCell.formulaParsed){
							var DataOld = oCopyCell.getValueData();
							oCopyCell.oValue = oFromCell.oValue.clone(oCopyCell);
							var DataNew = oCopyCell.getValueData();
							if(false == DataOld.isEqual(DataNew))
								History.Add(g_oUndoRedoCell, historyitem_Cell_ChangeValue, this.worksheet.getId(), new Asc.Range(0, oCopyCell.oId.getRow0(), gc_nMaxCol0, oCopyCell.oId.getRow0()), new UndoRedoData_CellSimpleData(oCopyCell.oId.getRow0(), oCopyCell.oId.getCol0(), DataOld, DataNew));
							//todo
							// if(oCopyCell.isEmptyTextString())
								// this.worksheet._getHyperlink().remove({r1: oCopyCell.oId.getRow0(), c1: oCopyCell.oId.getCol0(), r2: oCopyCell.oId.getRow0(), c2: oCopyCell.oId.getCol0()});
						}
						else{
							var assemb;
							var _p_ = new parserFormula(oFromCell.sFormula,oCopyCell.getName(),this.worksheet);
							if( _p_.parse() ){
								assemb = _p_.changeOffset(oCopyCell.getOffset2(oFromCell.getName())).assemble();
								oCopyCell.setValue("="+assemb);
						}
					}
				}
            }
		}
		}
		var aNodes = this.worksheet.workbook.dependencyFormulas.getInRange( this.worksheet.Id, oPromoteAscRange );
		if(aNodes && aNodes.length > 0)
		{
			for(var i = 0, length = aNodes.length; i < length; ++i)
			{
				var node = aNodes[i];
				this.worksheet.workbook.needRecalc.nodes[ node.nodeId ] = [ node.sheetId, node.cellId ];
				this.worksheet.workbook.needRecalc.length++;
			}
		}
		//добавляем замерженые области
		var nShiftHorizontal = 0;
		var nShiftVertical = 0;
		if(bVertical)
		{
			if(nIndex < 0)
				nShiftVertical = -nHeight;
			else
				nShiftVertical = nHeight;
		}
		else
		{
			if(nIndex < 0)
				nShiftHorizontal = -nWidth;
			else
				nShiftHorizontal = nWidth;
		}
		var oMergedFrom = oCanPromote.oMergedFrom;
		if(null != oMergedFrom && oMergedFrom.all.length > 0)
		{
			var bInserted = true;
			var nCount = 0;
			while(bInserted)
			{
				bInserted = false;
				nCount++;
				for(var i = 0, length = oMergedFrom.all.length; i < length; i++)
				{
					var oMergedBBox = oMergedFrom.all[i].bbox;
					var oNewMerged = Asc.Range(oMergedBBox.c1 + nCount * nShiftHorizontal, oMergedBBox.r1 + nCount * nShiftVertical, oMergedBBox.c2 + nCount * nShiftHorizontal, oMergedBBox.r2 + nCount * nShiftVertical);
					if(oPromoteAscRange.containsRange(oNewMerged))
					{
						this.worksheet.mergeManager.add(oNewMerged, 1);
						bInserted = true;
					}
				}
			}
		}
		//добавляем ссылки
		//не как в Excel поддерживаются ссылки на диапазоны
		var oHyperlinks = this.worksheet.hyperlinkManager.get(oBBox);
		if(oHyperlinks.inner.length > 0)
		{
			var bInserted = true;
			var nCount = 0;
			while(bInserted)
			{
				bInserted = false;
				nCount++;
				for(var i = 0, length = oHyperlinks.inner.length; i < length; i++)
				{
					var oHyperlink = oHyperlinks.inner[i];
					var oHyperlinkBBox = oHyperlink.bbox;
					var oNewHyperlink = Asc.Range(oHyperlinkBBox.c1 + nCount * nShiftHorizontal, oHyperlinkBBox.r1 + nCount * nShiftVertical, oHyperlinkBBox.c2 + nCount * nShiftHorizontal, oHyperlinkBBox.r2 + nCount * nShiftVertical);
					if(oPromoteAscRange.containsRange(oNewHyperlink))
					{
						this.worksheet.hyperlinkManager.add(oNewHyperlink, oHyperlink.data.clone());
						bInserted = true;
					}
				}
			}
		}
	}
	History.EndTransaction();
	buildRecalc(this.worksheet.workbook);
	unLockDraw(this.worksheet.workbook);
}
Range.prototype.createCellOnRowColCross=function(){
	var oThis = this;
	var bbox = this.bbox;
	var nRangeType = this._getRangeType(bbox);
	if(c_oRangeType.Row == nRangeType)
	{
		this._foreachColNoEmpty(function(col){
			if(null != col.xfs)
			{
				for(var i = bbox.r1; i <= bbox.r2; ++i)
					oThis.worksheet._getCell(i, col.index);
			}
		}, null);
	}
	else if(c_oRangeType.Col == nRangeType)
	{
		this._foreachRowNoEmpty(function(row){
			if(null != row.xfs)
			{
				for(var i = bbox.c1; i <= bbox.c2; ++i)
					oThis.worksheet._getCell(row.index, i);
			}
		}, null);
	}
}
//-------------------------------------------------------------------------------------------------
/**
 * @constructor
 */
function PromoteHelper(bVerical, bReverse, bbox){
	//автозаполнение происходит всегда в правую сторону, поэтому менются индексы в методе add, и это надо учитывать при вызове getNext
	this.bVerical = bVerical;
	this.bReverse = bReverse;
	this.bbox = bbox;
	this.oDataRow = {};
	//для get
	this.oCurRow = null;
	this.nCurColIndex = null;
	this.nColLength = 0;
	if(this.bVerical)
		this.nColLength = this.bbox.r2 - this.bbox.r1 + 1;
	else
		this.nColLength = this.bbox.c2 - this.bbox.c1 + 1;
};
PromoteHelper.prototype = {
	add: function(nRow, nCol, nVal, bDelimiter, sPrefix, bDate, oAdditional){
		if(this.bVerical)
		{
			//транспонируем для удобства
			var temp = nRow;
			nRow = nCol;
			nCol = temp;
		}
		if(this.bReverse)
			nCol = this.nColLength - nCol - 1;
		var row = this.oDataRow[nRow];
		if(null == row)
		{
			row = {};
			this.oDataRow[nRow] = row;
		}
		row[nCol] = {nCol: nCol, nVal: nVal, bDelimiter: bDelimiter, sPrefix: sPrefix, bDate: bDate, oAdditional: oAdditional, oSequence: null, nCurValue: null};
	},
	isOnlyIntegerSequence: function(){
		var bRes = true;
		var bEmpty = true;
		for(var i in this.oDataRow)
		{
			var row = this.oDataRow[i];
			for(var j in row)
			{
				var data = row[j];
				bEmpty = false;
				if(!(null != data.nVal && true != data.bDate && null == data.sPrefix))
				{
					bRes = false;
					break;
				}
			}
			if(!bRes)
				break;
		}
		if(bEmpty)
			bRes = false;
		return bRes;
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
			a0 = aDigits[0].y;
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
			for (var i = 0, length = aDigits.length; i < length; ++i)
			{
				var data = aDigits[i];
				nX = data.x;
				var dValue = data.y;

				// Вычисляем значения
				nXi += nX;
				nXiXi += nX * nX;
				dYi += dValue;
				dYiXi += dValue * nX;
			}
			nX++;

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
	},
	_addSequenceToRow : function(nRowIndex, aSortRowIndex, row, aCurSequence){
		if(aCurSequence.length > 0)
		{
			var oFirstData = aCurSequence[0];
			var bCanPromote = true;
			//если последовательность состоит из одного числа и той же колонке есть еще последовательности, то надо копировать, а не автозаполнять
			if(1 == aCurSequence.length)
			{
				var bVisitRowIndex = false;
				var oVisitData = null;
				for(var i = 0, length = aSortRowIndex.length; i < length; i++)
				{
					var nCurRowIndex = aSortRowIndex[i];
					if(nRowIndex == nCurRowIndex)
					{
						bVisitRowIndex = true;
						if(oVisitData && oFirstData.sPrefix == oVisitData.sPrefix && oFirstData.bDate == oVisitData.bDate)
						{
							bCanPromote = false;
							break;
						}
					}
					else
					{
						var oCurRow = this.oDataRow[nCurRowIndex];
						if(oCurRow)
						{
							var data = oCurRow[oFirstData.nCol];
							if(null != data)
							{
								if(null != data.nVal)
								{
									oVisitData = data;
									if(bVisitRowIndex)
									{
										if(oFirstData.sPrefix == oVisitData.sPrefix && oFirstData.bDate == oVisitData.bDate)
											bCanPromote = false;
										break;
									}
								}
								else if(data.bDelimiter)
								{
									oVisitData = null;
									if(bVisitRowIndex)
										break;
								}
							}
						}
					}
				}
			}
			if(bCanPromote)
			{
				var nMinIndex = null;
				var nMaxIndex = null;
				var bValidIndexDif = true;
				var nPrevX = null;
				var nPrevVal = null;
				var nIndexDif = null;
				var nValueDif = null;
				//анализируем последовательность, если числа расположены не на одинаковом расстоянии, то считаем их сплошной последовательностью
				//последовательность с промежутками может быть только целочисленной
				for(var i = 0, length = aCurSequence.length; i < length; i++)
				{
					var data = aCurSequence[i];
					var nCurX = data.nCol;
					if(null == nMinIndex || null == nMaxIndex)
						nMinIndex = nMaxIndex = nCurX;
					else
					{
						if(nCurX < nMinIndex)
							nMinIndex = nCurX;
						if(nCurX > nMaxIndex)
							nMaxIndex = nCurX;
					}
					if(bValidIndexDif)
					{
						if(null != nPrevX && null != nPrevVal)
						{
							var nCurDif = nCurX - nPrevX;
							var nCurValDif = data.nVal - nPrevVal;
							if(null == nIndexDif || null == nCurValDif)
							{
								nIndexDif = nCurDif;
								nValueDif = nCurValDif;
							}
							else if(nIndexDif != nCurDif || nValueDif != nCurValDif)
							{
								nIndexDif = null;
								bValidIndexDif = false;
							}
						}
					}
					nPrevX = nCurX;
					nPrevVal = data.nVal;
				}
				var bWithSpace = false;
				if(null != nIndexDif)
				{
					nIndexDif = Math.abs(nIndexDif);
					if(nIndexDif > 1)
						bWithSpace = true;
				}
				//заполняем массив с координатами
				var bExistSpace = false;
				nPrevX = null;
				var aDigits = [];
				for(var i = 0, length = aCurSequence.length; i < length; i++)
				{
					var data = aCurSequence[i];
					var nCurX = data.nCol;
					var x = nCurX - nMinIndex;
					if(null != nIndexDif && nIndexDif > 0)
						x /= nIndexDif;
					if(null != nPrevX && nCurX - nPrevX > 1)
						bExistSpace = true;
					var y = data.nVal;
					//даты автозаполняем только по целой части
					if(data.bDate)
						y = parseInt(y);
					aDigits.push({x: x, y: y});
					nPrevX = nCurX;
				}
				if(aDigits.length > 0)
				{
					var oSequence = this._promoteSequence(aDigits);
					if(1 == aDigits.length && this.bReverse)
					{
						//меняем коэффициенты для случая одного числа в последовательности, иначе она в любую сторону будет возрастающей
						oSequence.a1 *= -1;
					}
					var bIsIntegerSequence = oSequence.a1 != parseInt(oSequence.a1);
					//для дат и чисел с префиксом автозаполняются только целочисленные последовательности
					if(!((null != oFirstData.sPrefix || true == oFirstData.bDate) && bIsIntegerSequence))
					{
						if(false == bWithSpace && bExistSpace)
						{
							for(var i = nMinIndex; i <= nMaxIndex; i++)
							{
								var data = row[i];
								if(null == data)
								{
									data = {nCol: i, nVal: null, bDelimiter: oFirstData.bDelimiter, sPrefix: oFirstData.sPrefix, bDate: oFirstData.bDate, oAdditional: null, oSequence: null, nCurValue: null};
									row[i] = data;
								}
								data.oSequence = oSequence;
							}
						}
						else
						{
							for(var i = 0, length = aCurSequence.length; i < length; i++)
							{
								var nCurX = aCurSequence[i].nCol;
								if(null != nCurX)
									row[nCurX].oSequence = oSequence;
							}
						}
					}
				}
			}
		}
	},
	finishAdd : function(bCopy){
		if(true != bCopy)
		{
			var aSortRowIndex = [];
			for(var i in this.oDataRow)
				aSortRowIndex.push(i - 0);
			aSortRowIndex.sort(fSortAscending);
			for(var i = 0, length = aSortRowIndex.length; i < length; i++)
			{
				var nRowIndex = aSortRowIndex[i];
				var row = this.oDataRow[nRowIndex];
				//собираем информация о последовательностях в row
				var aSortIndex = [];
				for(var j in row)
					aSortIndex.push(j - 0);
				aSortIndex.sort(fSortAscending);
				var aCurSequence = [];
				var oPrevData = null;
				for(var j = 0, length2 = aSortIndex.length; j < length2; j++)
				{
					var nColIndex = aSortIndex[j];
					var data = row[nColIndex];
					var bAddToSequence = false;
					if(null != data.nVal)
					{
						bAddToSequence = true;
						if(null != oPrevData && (oPrevData.bDelimiter != data.bDelimiter || oPrevData.sPrefix != data.sPrefix || oPrevData.bDate != data.bDate))
						{
							this._addSequenceToRow(nRowIndex, aSortRowIndex, row, aCurSequence);
							aCurSequence = [];
							oPrevData = null;
						}
						oPrevData = data;
					}
					else if(data.bDelimiter)
					{
						this._addSequenceToRow(nRowIndex, aSortRowIndex, row, aCurSequence);
						aCurSequence = [];
						oPrevData = null;
					}
					if(bAddToSequence)
						aCurSequence.push(data);
				}
				this._addSequenceToRow(nRowIndex, aSortRowIndex, row, aCurSequence);
			}
		}
	},
	setIndex: function(index){
		this.oCurRow = this.oDataRow[index];
		this.nCurColIndex = 0;
	},
	getNext: function(){
		var oRes = null;
		if(this.oCurRow)
		{
			var oRes = this.oCurRow[this.nCurColIndex];
			if(null != oRes)
			{
				oRes.nCurValue = null;
				if(null != oRes.oSequence)
				{
					var sequence = oRes.oSequence;
					if(oRes.bDate || null != oRes.sPrefix)
						oRes.nCurValue = Math.abs(sequence.a1 * sequence.nX + sequence.a0);
					else
						oRes.nCurValue = sequence.a1 * sequence.nX + sequence.a0;
					sequence.nX ++;
				}
			}
			this.nCurColIndex++;
			if(this.nCurColIndex >= this.nColLength)
				this.nCurColIndex = 0;
		}
		return oRes;
	}
};
function DefinedName(){
	this.Name = null;
	this.Ref = null;
	this.LocalSheetId = null;
	this.bTable = false;
}
function NameGenerator(wb){
	this.wb = wb;
	this.aExistNames = {};
	this.sTableNamePattern = "Table";
	this.nTableNameMaxIndex = 0;
};
NameGenerator.prototype = {
	addName : function(sName){
		this.aExistNames[sName] = 1;
	},
	addLocalDefinedName : function(oDefinedName){
		this.addName(oDefinedName.Name);
	},
	addDefinedName : function(oDefinedName){
		this.wb.DefinedNames[oDefinedName.Name] = oDefinedName;
		this.addName(oDefinedName.Name);
	},
	addTableName : function(sName, ws, Ref){
		var sDefinedNameRef = ws.getName();
		if(false == rx_test_ws_name.test(sDefinedNameRef))
			sDefinedNameRef = "'" + sDefinedNameRef + "'";
		sDefinedNameRef += "!" + Ref;
		var oNewDefinedName = new DefinedName();
		oNewDefinedName.Name = sName;
		oNewDefinedName.Ref = sDefinedNameRef;
		oNewDefinedName.bTable = true;
		this.addDefinedName(oNewDefinedName);
	},
	isExist : function(sName)
	{
		return null != this.aExistNames[sName];
	},
	getNextTableName : function(ws, Ref){
		this.nTableNameMaxIndex++;
		var sNewName = this.sTableNamePattern + this.nTableNameMaxIndex;
		while(null != this.aExistNames[sNewName])
		{
			this.nTableNameMaxIndex++;
			sNewName = this.sTableNamePattern + this.nTableNameMaxIndex;
		}
		this.addTableName(sNewName, ws, Ref);
		return sNewName;
	}
};