/*
 * (c) Copyright Ascensio System SIA 2010-2018
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

var DRAWING_ARRAY_TYPE_INLINE = 0x00;
var DRAWING_ARRAY_TYPE_BEHIND = 0x01;
var DRAWING_ARRAY_TYPE_WRAPPING = 0x02;
var DRAWING_ARRAY_TYPE_BEFORE = 0x03;

function CGraphicPage(pageIndex, graphicObjects)
{
    this.pageIndex = pageIndex;
    this.graphicObjects = graphicObjects;
    this.drawingDocument = editor.WordControl.m_oDrawingDocument;

    this.arrGraphicObjects = [];

    this.selectionInfo =
    {
        selectionArray: []
    };

    //массивы для отрисовки
    this.inlineObjects = [];
    this.behindDocObjects = [];
    this.beforeTextObjects = [];
    this.flowTables = [];


    this.hdrFtrPage = null;
    this.wrapManager = null;
    if(graphicObjects)
    {
        this.hdrFtrPage =  new CGraphicPage(pageIndex, null);
        this.wrapManager = new CWrapManager(this);
    }
}

CGraphicPage.prototype =
{
    getCompatibilityMode: function () {
        return editor.WordControl.m_oLogicDocument.GetCompatibilityMode();
    },
    addFloatTable: function(table)
    {
        for(var i = 0; i < this.flowTables.length; ++i)
        {
            if(this.flowTables[i] === table)
                return;
        }
        this.flowTables.push(table);
    },

    addObject: function(object)
    {

        var drawing_array, need_sort = true;
        if(object.parent.Is_Inline()){
            drawing_array = this.inlineObjects;
            need_sort = false;
        }
        else if(object.parent.behindDoc == true && (this.getCompatibilityMode() < document_compatibility_mode_Word15 || object.parent.wrappingType === WRAPPING_TYPE_NONE)){
            drawing_array  = this.behindDocObjects;
        }
        else{
            drawing_array = this.beforeTextObjects;
        }
        if(Array.isArray(drawing_array))
        {
            for(var i = 0; i < drawing_array.length; ++i)
            {
                if(drawing_array[i] === object)
                {
                    break;
                }
            }
            if(i === drawing_array.length)
            {
                drawing_array.push(object);
                if(need_sort)
                {
                    drawing_array.sort(ComparisonByZIndexSimpleParent);
                }
            }
        }
    },


    concatPage: function(page)
    {
        this.inlineObjects = this.inlineObjects.concat(page.inlineObjects);
        this.behindDocObjects = this.behindDocObjects.concat(page.behindDocObjects);
        this.beforeTextObjects = this.beforeTextObjects.concat(page.beforeTextObjects);
        this.flowTables = this.flowTables.concat(page.flowTables);
    },

    mergePages: function(page1, page2)
    {
        if(page1)
        {
            this.concatPage(page1);
        }
        if(page2)
        {
            this.concatPage(page2);
        }
        this.behindDocObjects.sort(ComparisonByZIndexSimpleParent);
        this.beforeTextObjects.sort(ComparisonByZIndexSimpleParent);
    },

    clear: function()
    {
        this.inlineObjects = [];
        this.behindDocObjects = [];
        this.beforeTextObjects = [];
        this.flowTables = [];
    },



    CheckRange: function(X0, Y0, X1, Y1, Y0sp, Y1Ssp, LeftField, RightField, HdrFtrRanges, docContent, bMathWrap)
    {
        return this.wrapManager.checkRanges(X0, Y0, X1, Y1, Y0sp, Y1Ssp, LeftField, RightField, HdrFtrRanges, docContent, bMathWrap);
    },

    removeFloatTableById: function(id)
    {
        for(var index = 0; index < this.flowTables.length; ++index)
        {
            if(this.flowTables[index].Id === id)
            {
                this.flowTables.splice(index, 1);
                return;
            }
        }
    },

    documentStatistics: function(Statistics)
    {
        var cur_array = this.inlineObjects.concat(this.behindDocObjects).concat(this.beforeTextObjects);
        for(var i = 0; i < cur_array.length; ++i)
        {
            if(cur_array[i].documentStatistics)
                cur_array[i].documentStatistics(Statistics);
        }

    },

    getTableByXY: function(x, y, documentContent)
    {
        for(var index = this.flowTables.length -1; index > -1; --index)
        {
            if(this.flowTables[index].IsPointIn(x, y) && this.flowTables[index].Table.Parent === documentContent)
                return this.flowTables[index];
        }
        return null;
    },

    delObjectById: function(id)
    {
        var oDrawing = AscCommon.g_oTableId.Get_ById(id);
        if(oDrawing){
            var drawing_array;
            if(oDrawing.Is_Inline()){
                drawing_array = this.inlineObjects;
            }
            else if(oDrawing.behindDoc === true  && (this.getCompatibilityMode() < document_compatibility_mode_Word15 || oDrawing.wrappingType === WRAPPING_TYPE_NONE)){
                drawing_array = this.behindDocObjects;
            }
            else{
                drawing_array = this.beforeTextObjects;
            }
            for(var index = 0; index < drawing_array.length; ++index){
                if(drawing_array[index].parent === oDrawing){
                    return drawing_array.splice(index, 1);
                }
            }
        }
        return null;
    },

    resetDrawingArrays: function(docContent)
    {
        function findInArrayAndRemove(drawingArray, docContent, document)
        {
            if(docContent === document)
            {
                drawingArray.length = 0;
                return;
            }
            var b_is_top_doc = docContent.Is_TopDocument();
            for(var i = drawingArray.length-1; i > -1; --i)
            {
                if(!drawingArray[i].parent || drawingArray[i].parent.DocumentContent === docContent
                    || (b_is_top_doc && drawingArray[i].parent.DocumentContent.Is_TopDocument(true) === docContent))
                    drawingArray.splice(i, 1);
            }
        }
        function findTableInArrayAndRemove(drawingArray, docContent, document)
        {
            if(!docContent === document)
            {
                drawingArray.length = 0;
                return;
            }
            for(var i = drawingArray.length-1; i >-1; --i)
            {
                if(drawingArray[i].Table.Parent === docContent)
                    drawingArray.splice(i, 1);
            }
        }

        function findInArrayAndRemoveFromDrawingPage(drawingPage, docContent, document)
        {
            if(!drawingPage)
                return;
            if(Array.isArray(drawingPage.inlineObjects))
            {
                findInArrayAndRemove(drawingPage.inlineObjects, docContent, document);
                findInArrayAndRemove(drawingPage.behindDocObjects, docContent, document);
                findInArrayAndRemove(drawingPage.beforeTextObjects, docContent, document);
                findTableInArrayAndRemove(drawingPage.flowTables, docContent, document);
            }
        }

        if(!AscCommon.isRealObject(docContent))
            docContent = this.graphicObjects.document;

        findInArrayAndRemoveFromDrawingPage(this, docContent, editor.WordControl.m_oLogicDocument);
    },


    draw: function(graphics)
    {
        for(var _object_index = 0; _object_index < this.inlineObjects.length; ++_object_index)
            this.inlineObjects[_object_index].draw(graphics);

        for(_object_index = 0; _object_index < this.beforeTextObjects.length; ++_object_index)
            this.beforeTextObjects[_object_index].draw(graphics);
        for(_object_index = 0; _object_index < this.behindDocObjects.length; ++_object_index)
            this.behindDocObjects[_object_index].draw(graphics);
    },

    drawSelect: function()
    {
        var _graphic_objects = this.selectionInfo.selectionArray;
        var _object_index;
        var _objects_count = _graphic_objects.length;
        var _graphic_object;
        for(_object_index = 0; _object_index < _objects_count; ++_object_index)
        {
            _graphic_object = _graphic_objects[_object_index].graphicObject;
            var _transform = _graphic_object.getTransformMatrix();
            if(_transform === null)
                _transform = new AscCommon.CMatrix();

            var _extensions = _graphic_object.getExtensions();
            if(_extensions === null)
                _extensions = {extX: 0, extY: 0};


            this.drawingDocument.DrawTrack(AscFormat.TYPE_TRACK.SHAPE , _transform, 0, 0, _extensions.extX, _extensions.extY, /*shape.geometry ? shape.geometry.preset == "line"  : false*/false);
        }
    },

    selectionCheck: function(x, y)
    {

    },

    documentSearch: function(String, search_Common)
    {
        var search_array = [];
        search_array= search_array.concat(this.behindDocObjects);
        search_array= search_array.concat(this.inlineObjects);
        search_array= search_array.concat(this.beforeTextObjects);

        for(var i = 0; i < search_array.length; ++i)
        {
            if(search_array[i].documentSearch)
                search_array[i].documentSearch(String, search_Common);
        }

    },

    addGraphicObject: function(graphicObject){
        if(graphicObject.Is_Inline()){
            this.inlineObjects.push(graphicObject);
        }
        else if(graphicObject.behindDoc === true && (this.getCompatibilityMode() < document_compatibility_mode_Word15 || graphicObject.wrappingType === WRAPPING_TYPE_NONE)){
            this.behindDocObjects.push(graphicObject);
            this.behindDocObjects.sort(ComparisonByZIndexSimpleParent);
        }
        else{
            this.beforeTextObjects.push(graphicObject);
            this.beforeTextObjects.sort(ComparisonByZIndexSimpleParent);
        }
    },

    sortDrawingArrays: function()
    {
        this.behindDocObjects.sort(ComparisonByZIndexSimpleParent);
        this.beforeTextObjects.sort(ComparisonByZIndexSimpleParent);
        if(this.hdrFtrPage)
        {
            this.hdrFtrPage.sortDrawingArrays();
        }
    },

    drawBehindDoc: function(graphics)
    {
        for(var _object_index = 0; _object_index < this.behindDocObjects.length; ++_object_index)
            this.behindDocObjects[_object_index].draw(graphics);

        graphics.SetIntegerGrid(true);
    },


    drawBehindObjectsByContent: function(graphics, content)
    {
        var bIntegerGrid = graphics.m_bIntegerGrid;
        var drawing;
        for(var _object_index = 0; _object_index < this.behindDocObjects.length; ++_object_index)
        {
            drawing = this.behindDocObjects[_object_index];
            if(drawing.parent && drawing.parent.DocumentContent && drawing.parent.DocumentContent === content)
            {
                drawing.draw(graphics);
            }
        }
        graphics.SetIntegerGrid(bIntegerGrid);
    },
    drawBeforeObjectsByContent: function(graphics, content)
    {
        var bIntegerGrid = graphics.m_bIntegerGrid;
        var drawing;
        for(var _object_index = 0; _object_index < this.beforeTextObjects.length; ++_object_index)
        {
            drawing = this.beforeTextObjects[_object_index];
            if(drawing.parent && drawing.parent.DocumentContent && drawing.parent.DocumentContent === content)
            {
                drawing.draw(graphics);
            }
        }
        graphics.SetIntegerGrid(bIntegerGrid);
    },


    drawBeforeObjects: function(graphics)
    {
        for(var _object_index = 0; _object_index < this.beforeTextObjects.length; ++_object_index)
            this.beforeTextObjects[_object_index].draw(graphics);

        graphics.SetIntegerGrid(true);
    }
};
