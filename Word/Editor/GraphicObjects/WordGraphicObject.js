

function CWrapContour()
{
    this.edited = null;
    this.arrPoints = [];
}

function WordGraphicObject(document, drawingDocument, mainGraphicObjects, parentGraphicObjects, pageIndex)//возможно, что parentGraphicObjects == mainGraphicObjects
{
    this.document = document;
    this.drawingDocument =  drawingDocument;
    this.mainGraphicObjects = mainGraphicObjects;
    this.parentGraphicObject = parentGraphicObjects;
    this.pageIndex = typeof  pageIndex === "number" ? pageIndex : -1;

    this.isInline = false;
    this.id = null;
    this.graphicObject = null;
    this.allowOverlap = true;
    this.behindDoc = false;
    this.relativeHeight = null; //z - индекс
    this.selected = false;

    this.distL = 0;
    this.distT = 0;
    this.distR = 0;
    this.distB = 0;

    this.hidden = false;
    this.locked = false;//Lock anchor

    this.bSimplePos = false;
    this.simplePos = {x: 0, y: 0 };

    this.layoutInCell = false;

    this.wrappingType = WRAPPING_TYPE_THROUGH;
    this.wrappingPolygon = new CWrapPolygon(this);

    this.positionH =
    {
        positioningType: HOR_REL_POS_TYPE_COLUMN,
        posType: POSITIONING_TYPE_OFF,
        pos: 0
    };

    this.positionV =
    {
        positioningType: VER_REL_POS_TYPE_PARAGRAPH,
        posType: POSITIONING_TYPE_OFF,
        pos: 0
    };


    this.absOffsetX = null;
    this.absOffsetY = null;

    this.absExtX = null;
    this.absExtY = null;

    this.absRot = null;

    this.absFlipH = null;
    this.absFlipV = null;

    this.selectionObject = null;

    this.drawingObject = null;
}

WordGraphicObject.prototype =
{
    draw: function(graphics)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.draw === "function")
        {
            this.graphicObject.draw(graphics);

         /*   var wP =this.wrappingPolygon;
            var arrP =wP.arrPoints;
            graphics._m(arrP[0].x, arrP[0].y);
            for(var  i = 0; i < arrP.length; ++i)
            {
                graphics._l(arrP[i].x, arrP[i].y);
            }
            graphics._z();
            graphics.ds(); */
        }
    },

    drawAdjustments: function()
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.drawAdjustments === "function")
        {
            this.graphicObject.drawAdjustments();
        }
    },


    getTransformMatrix: function()
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.getTransformMatrix === "function")
        {
            return this.graphicObject.getTransformMatrix();
        }
        return null;
    },

    getExtensions: function()
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.getExtensions === "function")
        {
            return this.graphicObject.getExtensions();
        }
        return null;
    },

    isGroup: function()
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.isGroup === "function")
            return this.graphicObject.isGroup();
        return false;
    },

    getSpTree: function()
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.getSpTree === "function")
            return this.graphicObject.getSpTree();
        return [];
    },

    setZIndex: function()
    {
        this.relativeHeight = ++this.mainGraphicObjects.maximalGraphicObjectZIndex;
    },

    hitToAdj: function(x, y)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.hitToAdj === "function")
        {
            return this.graphicObject.hitToAdj(x, y);
        }
        return {hit: false, adjPolarFlag: null, adjNum: null};
    },

    hitToHandle: function(x, y)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.hitToHandle === "function")
        {
            return this.graphicObject.hitToHandle(x, y);
        }
        return {hit: false, handleRotate: false, handleNum: null};
    },

    hit: function(x, y)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.hit === "function")
        {
            return this.graphicObject.hit(x, y);
        }
        return false;
    },

    hitToTextRect: function(x, y)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.hitToTextRect === "function")
        {
            return this.graphicObject.hitToTextRect(x, y);
        }
        return false;
    },

    hitToPath: function(x, y)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.hitToPath === "function")
        {
            return this.graphicObject.hitToPath(x, y);
        }
        return false;
    },

    numberToCardDirection: function(handleNumber)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.numberToCardDirection === "function")
        {
            return this.graphicObject.numberToCardDirection(handleNumber);
        }
        return null;
    },

    cardDirectionToNumber: function(cardDirection)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.cardDirectionToNumber === "function")
        {
            return this.graphicObject.cardDirectionToNumber(cardDirection);
        }
        return null;
    },

    getAbsolutePosition: function()
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.getAbsolutePosition === "function")
        {
            return this.graphicObject.getAbsolutePosition();
        }
        return null;
    },

    getResizeCoefficients: function(handleNum, x, y)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.getResizeCoefficients === "function")
        {
            return this.graphicObject.getResizeCoefficients(handleNum, x, y);
        }
        return {kd1: 1, kd2: 1};
    },

    getAngle: function(x, y)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.getAngle === "function")
            return this.graphicObject.getAngle(x, y);
        return 0;
    },

    calculateAdjPolarRange: function(adjIndex)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.calculateAdjPolarRange === "function")
        {
            this.graphicObject.calculateAdjPolarRange(adjIndex);
        }
    },

    calculateAdjXYRange: function(adjIndex)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.calculateAdjXYRange === "function")
        {
            this.graphicObject.calculateAdjXYRange(adjIndex);
        }
    },

    checkAdjModify: function(adjPolarFlag, adjNum, compareShape)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.checkAdjModify === "function")
        {
            return this.graphicObject.checkAdjModify(adjPolarFlag, adjNum, compareShape);
        }
        return false;
    },

    createTrackObjectForMove: function(majorOffsetX, majorOffsetY)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.createTrackObjectForMove === "function")
        {
            return this.graphicObject.createTrackObjectForMove(majorOffsetX, majorOffsetY);
        }
        return null;
    },

    createTrackObjectForResize: function(handleNumber, pageIndex)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.createTrackObjectForResize === "function")
        {
            return this.graphicObject.createTrackObjectForResize(handleNumber, pageIndex);
        }
        return null;
    },

    createTrackObjectForRotate: function(pageIndex)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.createTrackObjectForRotate === "function")
        {
            return this.graphicObject.createTrackObjectForRotate(pageIndex);
        }
        return null;
    },

    setPageIndex: function(newPageIndex)
    {
        this.pageIndex = newPageIndex;
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.setPageIndex === "function")
            this.graphicObject.setPageIndex(newPageIndex);
    },

    setAbsoluteTransform: function(offsetX, offsetY, extX, extY, rot, flipH, flipV, bFromChild)
    {
        if(offsetX !== null)
            this.absOffsetX = offsetX;

        if(offsetY !== null)
            this.absOffsetY = offsetY;


        if(extX !== null)
            this.absExtX = extX;

        if(extY !== null)
            this.absExtY = extY;

        if(rot !== null)
            this.absRot = rot;

        if(flipH !== null)
            this.absFlipH = flipH;

        if(flipV !== null)
            this.absFlipV = flipV;

        if(!bFromChild && this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.setAbsoluteTransform === "function")
            this.graphicObject.setAbsoluteTransform(offsetX, offsetY, extX, extY, rot, flipH, flipV);
    },

    canGroup: function()   //TODO
    {
        return true;
    },

    select: function()
    {
        this.selected = true;
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof  this.graphicObject.select === "function")
            this.graphicObject.select();

    },

    deselect: function()
    {
        this.selected = false;
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof  this.graphicObject.deselect === "function")
            this.graphicObject.deselect();
        this.selectionObject = null;
    },

    paragraphAdd: function(paraItem, bRecalculate)
    {
        if(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof  this.graphicObject.paragraphAdd === "function")
            this.graphicObject.paragraphAdd(paraItem, bRecalculate);
    },

    getArrayWrapPolygons: function()
    {
        if(this.wrappingType === WRAPPING_TYPE_NONE ||  this.behindDoc === true
            || !(this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.getArrayWrapPolygons === "function"))
            return [];

        return this.graphicObject.getArrayWrapPolygons();
    },

    getArrayWrapIntervals: function(x0,y0, x1, y1, arr_intervals)
    {
        return this.wrappingPolygon.getArrayWrapIntervals(x0,y0, x1, y1, arr_intervals);
    },


    setAllParagraphNumbering: function(numInfo)
    {
        if(isRealObject(this.graphicObject) && typeof this.graphicObject.addInlineTable === "function")
            this.graphicObject.setAllParagraphNumbering(numInfo);
    },

    addNewParagraph: function(bRecalculate)
    {
        if(isRealObject(this.graphicObject) && typeof this.graphicObject.addNewParagraph === "function")
            this.graphicObject.addNewParagraph(bRecalculate);
    },

    addInlineTable: function(cols, rows)
    {
        if(isRealObject(this.graphicObject) && typeof this.graphicObject.addInlineTable === "function")
            this.graphicObject.addInlineTable(cols, rows);
    },

    applyTextPr: function(paraItem, bRecalculate)
    {
        if(isRealObject(this.graphicObject) && typeof this.graphicObject.applyTextPr === "function")
            this.graphicObject.applyTextPr(paraItem, bRecalculate);
    },

    allIncreaseDecFontSize: function(bIncrease)
    {
        if(isRealObject(this.graphicObject) && typeof this.graphicObject.allIncreaseDecFontSize === "function")
            this.graphicObject.allIncreaseDecFontSize(bIncrease);
    },

    allIncreaseDecIndent: function(bIncrease)
    {
        if(isRealObject(this.graphicObject) && typeof this.graphicObject.allIncreaseDecIndent === "function")
            this.graphicObject.allIncreaseDecIndent(bIncrease);
    },

    allSetParagraphAlign: function(align)
    {
        if(isRealObject(this.graphicObject) && typeof this.graphicObject.allSetParagraphAlign === "function")
            this.graphicObject.allSetParagraphAlign(align);
    },

    paragraphIncreaseDecFontSize: function(bIncrease)
    {
        if(isRealObject(this.graphicObject) && typeof this.graphicObject.paragraphIncreaseDecFontSize === "function")
            this.graphicObject.paragraphIncreaseDecFontSize(bIncrease);
    },

    paragraphIncreaseDecIndent: function(bIncrease)
    {
        if(isRealObject(this.graphicObject) && typeof this.graphicObject.paragraphIncreaseDecIndent === "function")
            this.graphicObject.paragraphIncreaseDecIndent(bIncrease);
    },

    setParagraphAlign: function(align)
    {
        if(isRealObject(this.graphicObject) && typeof this.graphicObject.setParagraphAlign === "function")
            this.graphicObject.setParagraphAlign(align);
    },

    recalculateWrapPolygon: function()
    {
        if(this.wrappingPolygon.edited)
            this.wrappingPolygon.calculateRelToAbs(this.getTransformMatrix()) ;
        else
            this.wrappingPolygon.calculate();
    },

    selectionSetStart: function(x, y, event)
    {
        if(isRealObject(this.graphicObject) && typeof this.graphicObject.selectionSetStart === "function")
            this.graphicObject.selectionSetStart(x, y, event);
    },


    selectionSetEnd: function(x, y, event)
    {
        if(isRealObject(this.graphicObject) && typeof this.graphicObject.selectionSetEnd === "function")
            this.graphicObject.selectionSetEnd(x, y, event);
    },

    selectionRemove: function()
    {
        if(isRealObject(this.graphicObject) && typeof this.graphicObject.selectionRemove === "function")
            this.graphicObject.selectionRemove();
    },

    updateSelectionState: function()
    {
        if(isRealObject(this.graphicObject) && typeof this.graphicObject.updateSelectionState === "function")
            this.graphicObject.updateSelectionState();
    },

    remove: function(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd)
    {
        if(isRealObject(this.graphicObject) && typeof this.graphicObject.remove === "function")
            this.graphicObject.remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd);
    },

    hitToWrapPolygonPoint: function(x, y)
    {
        if(this.wrappingPolygon && this.wrappingPolygon.arrPoints.length > 0)
        {
            var radius = this.drawingDocument.GetMMPerDot(TRACK_CIRCLE_RADIUS);
            var arr_point = this.wrappingPolygon.arrPoints;
            var point_count = arr_point.length;
            var dx, dy;
            var cur_point = arr_point[0];
            var previous_point;
            dx = x - cur_point.x;
            dy = y - cur_point.y;
            if(Math.sqrt(dx*dx + dy*dy) < radius)
                return {hit: true, hitType: WRAP_HIT_TYPE_POINT, pointNum: 0};

            previous_point = arr_point[arr_point.length - 1];
            var vx, vy;
            vx = cur_point.x - previous_point.x;
            vy = cur_point.y - previous_point.y;
            if(Math.abs(vx) > 0 || Math.abs(vy) > 0)
            {
                if(HitInLine(this.drawingDocument.CanvasHitContext, x, y, previous_point.x, previous_point.y, cur_point.x, cur_point.y))
                 return {hit: true, hitType: WRAP_HIT_TYPE_SECTION, pointNum1: arr_point.length - 1, pointNum2: 0};
            }

            for(var point_index = 1; point_index < point_count; ++point_index)
            {
                cur_point = arr_point[point_index];
                dx = x - cur_point.x;
                dy = y - cur_point.y;
                if(Math.sqrt(dx*dx + dy*dy) < radius)
                    return {hit: true, hitType: WRAP_HIT_TYPE_POINT, pointNum: point_index};

                previous_point = arr_point[point_index - 1];

                vx = cur_point.x - previous_point.x;
                vy = cur_point.y - previous_point.y;

                if(Math.abs(vx) > 0 || Math.abs(vy) > 0)
                {
                    if(HitInLine(this.drawingDocument.CanvasHitContext, x, y, previous_point.x, previous_point.y, cur_point.x, cur_point.y))
                        return {hit: true, hitType: WRAP_HIT_TYPE_SECTION, pointNum1: point_index-1, pointNum2: point_index};
                }
            }
        }
        return {hit: false};
    },

    canChangeWrapPolygon: function()
    {
        if(isRealObject(this.graphicObject) && typeof this.graphicObject.canChangeWrapPolygon === "function")
            return this.graphicObject.canChangeWrapPolygon();
        return false;
    }

};


