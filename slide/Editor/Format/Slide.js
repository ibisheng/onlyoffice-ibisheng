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

// Import
var g_oTableId = AscCommon.g_oTableId;
var History = AscCommon.History;




function CChangesDrawingsContentComments(Class, Type, Pos, Items, isAdd){
	AscDFH.CChangesDrawingsContent.call(this, Class, Type, Pos, Items, isAdd);
}
CChangesDrawingsContentComments.prototype = Object.create(AscDFH.CChangesDrawingsContent.prototype);
CChangesDrawingsContentComments.prototype.constructor = CChangesDrawingsContentComments;
CChangesDrawingsContentComments.prototype.addToInterface = function(){
    for(var i = 0; i < this.Items.length; ++i){
        var oComment = this.Items[i];
        editor.sync_AddComment(oComment.Get_Id(), oComment.Data);
    }
};
CChangesDrawingsContentComments.prototype.removeFromInterface = function(){
    for(var i = 0; i < this.Items.length; ++i){
        editor.sync_RemoveComment(this.Items[i].Get_Id());
    }
};
CChangesDrawingsContentComments.prototype.Undo = function(){
	AscDFH.CChangesDrawingsContent.prototype.Undo.call(this);
    if(this.IsAdd()){
        this.removeFromInterface();
    }
    else{
        this.addToInterface();
    }
};
CChangesDrawingsContentComments.prototype.Redo = function(){
	AscDFH.CChangesDrawingsContent.prototype.Redo.call(this);
    if(this.IsAdd()){
        this.addToInterface();
    }
    else{
        this.removeFromInterface();
    }
};

CChangesDrawingsContentComments.prototype.Load = function(){
	AscDFH.CChangesDrawingsContent.prototype.Load.call(this);
    if(this.IsAdd()){
        this.addToInterface();
    }
    else{
        this.removeFromInterface();
    }
};

AscDFH.CChangesDrawingsContentComments = CChangesDrawingsContentComments;


AscDFH.changesFactory[AscDFH.historyitem_SlideSetLocks             ] = AscDFH.CChangesDrawingTimingLocks;
AscDFH.changesFactory[AscDFH.historyitem_SlideSetComments          ] = AscDFH.CChangesDrawingsObject    ;
AscDFH.changesFactory[AscDFH.historyitem_SlideSetShow              ] = AscDFH.CChangesDrawingsBool      ;
AscDFH.changesFactory[AscDFH.historyitem_SlideSetShowPhAnim        ] = AscDFH.CChangesDrawingsBool      ;
AscDFH.changesFactory[AscDFH.historyitem_SlideSetShowMasterSp      ] = AscDFH.CChangesDrawingsBool      ;
AscDFH.changesFactory[AscDFH.historyitem_SlideSetLayout            ] = AscDFH.CChangesDrawingsObject    ;
AscDFH.changesFactory[AscDFH.historyitem_SlideSetNum               ] = AscDFH.CChangesDrawingsLong      ;
AscDFH.changesFactory[AscDFH.historyitem_SlideSetTiming            ] = AscDFH.CChangesDrawingsObjectNoId;
AscDFH.changesFactory[AscDFH.historyitem_SlideSetSize              ] = AscDFH.CChangesDrawingsObjectNoId;
AscDFH.changesFactory[AscDFH.historyitem_SlideSetBg                ] = AscDFH.CChangesDrawingsObjectNoId;
AscDFH.changesFactory[AscDFH.historyitem_SlideAddToSpTree          ] = AscDFH.CChangesDrawingsContentPresentation   ;
AscDFH.changesFactory[AscDFH.historyitem_SlideRemoveFromSpTree     ] = AscDFH.CChangesDrawingsContentPresentation   ;
AscDFH.changesFactory[AscDFH.historyitem_SlideSetCSldName          ] = AscDFH.CChangesDrawingsString    ;
AscDFH.changesFactory[AscDFH.historyitem_SlideSetClrMapOverride    ] = AscDFH.CChangesDrawingsObject    ;
AscDFH.changesFactory[AscDFH.historyitem_PropLockerSetId           ] = AscDFH.CChangesDrawingsString    ;
AscDFH.changesFactory[AscDFH.historyitem_SlideCommentsAddComment   ] = AscDFH.CChangesDrawingsContentComments   ;
AscDFH.changesFactory[AscDFH.historyitem_SlideCommentsRemoveComment] = AscDFH.CChangesDrawingsContentComments   ;


AscDFH.drawingsChangesMap[AscDFH.historyitem_SlideSetComments          ] = function(oClass, value){oClass.slideComments = value;};
AscDFH.drawingsChangesMap[AscDFH.historyitem_SlideSetShow              ] = function(oClass, value){oClass.show = value;};
AscDFH.drawingsChangesMap[AscDFH.historyitem_SlideSetShowPhAnim        ] = function(oClass, value){oClass.showMasterPhAnim = value;};
AscDFH.drawingsChangesMap[AscDFH.historyitem_SlideSetShowMasterSp      ] = function(oClass, value){oClass.showMasterSp = value;};
AscDFH.drawingsChangesMap[AscDFH.historyitem_SlideSetLayout            ] = function(oClass, value){oClass.Layout = value;};
AscDFH.drawingsChangesMap[AscDFH.historyitem_SlideSetNum               ] = function(oClass, value){oClass.num = value;};
AscDFH.drawingsChangesMap[AscDFH.historyitem_SlideSetTiming            ] = function(oClass, value){oClass.timing = value;};
AscDFH.drawingsChangesMap[AscDFH.historyitem_SlideSetSize              ] = function(oClass, value){oClass.Width = value.a; oClass.Height = value.b;};
AscDFH.drawingsChangesMap[AscDFH.historyitem_SlideSetBg                ] = function(oClass, value, FromLoad){
    oClass.cSld.Bg = value;
    if(FromLoad){
        var Fill;
        if(oClass.cSld.Bg && oClass.cSld.Bg.bgPr && oClass.cSld.Bg.bgPr.Fill)
        {
            Fill = oClass.cSld.Bg.bgPr.Fill;
        }
        if(typeof AscCommon.CollaborativeEditing !== "undefined")
        {
            if(Fill && Fill.fill && Fill.fill.type === Asc.c_oAscFill.FILL_TYPE_BLIP && typeof Fill.fill.RasterImageId === "string" && Fill.fill.RasterImageId.length > 0)
            {
                AscCommon.CollaborativeEditing.Add_NewImage(AscCommon.getFullImageSrc2(Fill.fill.RasterImageId));
            }
        }
    }
};
AscDFH.drawingsChangesMap[AscDFH.historyitem_SlideSetCSldName          ] = function(oClass, value){oClass.cSld.name = value;};
AscDFH.drawingsChangesMap[AscDFH.historyitem_SlideSetClrMapOverride    ] = function(oClass, value){oClass.clrMap = value;};
AscDFH.drawingsChangesMap[AscDFH.historyitem_PropLockerSetId           ] = function(oClass, value){oClass.objectId = value;};



AscDFH.drawingContentChanges[AscDFH.historyitem_SlideAddToSpTree          ] =
AscDFH.drawingContentChanges[AscDFH.historyitem_SlideRemoveFromSpTree     ] = function(oClass){return oClass.cSld.spTree;};
AscDFH.drawingContentChanges[AscDFH.historyitem_SlideCommentsAddComment   ] =
AscDFH.drawingContentChanges[AscDFH.historyitem_SlideCommentsRemoveComment] = function(oClass){return oClass.comments;};

AscDFH.drawingsConstructorsMap[AscDFH.historyitem_SlideSetSize              ] = AscFormat.CDrawingBaseCoordsWritable;
AscDFH.drawingsConstructorsMap[AscDFH.historyitem_SlideSetBg                ] = AscFormat.CBg;

function Slide(presentation, slideLayout, slideNum)
{
    this.kind = AscFormat.TYPE_KIND.SLIDE;

    this.presentation = editor && editor.WordControl && editor.WordControl.m_oLogicDocument;
    this.graphicObjects = new AscFormat.DrawingObjectsController(this);
    this.maxId = 0;
    this.cSld = new AscFormat.CSld();
    this.clrMap = null; // override ClrMap

    this.show = true;
    this.showMasterPhAnim = false;
    this.showMasterSp = null;

    this.backgroundFill = null;


    this.timing = new CAscSlideTiming();
    this.timing.setDefaultParams();

    this.recalcInfo =
    {
        recalculateBackground: true,
        recalculateSpTree: true
    };
    this.Width = 254;
    this.Height = 190.5;

    this.searchingArray = [];  // массив объектов для селекта
    this.selectionArray = [];  // массив объектов для поиска


    this.writecomments = [];
    this.maxId = 1000;

    this.m_oContentChanges = new AscCommon.CContentChanges(); // список изменений(добавление/удаление элементов)

    this.commentX = 0;
    this.commentY = 0;


    this.deleteLock     = null;
    this.backgroundLock = null;
    this.timingLock     = null;
    this.transitionLock = null;
    this.layoutLock     = null;

    this.Lock = new AscCommon.CLock();
    this.Id = AscCommon.g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);


    this.lastLayoutType = null;
    this.lastLayoutMatchingName = null;
    this.lastLayoutName = null;

    if(presentation)
    {
        this.Width = presentation.Width;
        this.Height = presentation.Height;
        this.setSlideComments(new SlideComments(this));
        this.setLocks(new PropLocker(this.Id), new PropLocker(this.Id), new PropLocker(this.Id), new PropLocker(this.Id), new PropLocker(this.Id));
    }

    if(slideLayout)
    {
        this.setLayout(slideLayout);
    }
    if(typeof slideNum === "number")
    {
        this.setSlideNum(slideNum);
    }
}

Slide.prototype =
{
    getObjectType: function()
    {
        return AscDFH.historyitem_type_Slide;
    },

    getDrawingDocument: function()
    {
        return editor.WordControl.m_oLogicDocument.DrawingDocument;
    },

    Reassign_ImageUrls: function(images_rename){
        for(var i = 0; i < this.cSld.spTree.length; ++i){
            this.cSld.spTree[i].Reassign_ImageUrls(images_rename);
        }
    },

    createDuplicate: function()
    {
        var copy = new Slide(this.presentation, this.Layout, 0), i;
        if(typeof this.cSld.name === "string" && this.cSld.name.length > 0)
        {
            copy.setCSldName(this.cSld.name);
        }
        if(this.cSld.Bg)
        {
            copy.changeBackground(this.cSld.Bg.createFullCopy());
        }
        for(i = 0; i < this.cSld.spTree.length; ++i)
        {
            copy.shapeAdd(copy.cSld.spTree.length, this.cSld.spTree[i].copy());
            copy.cSld.spTree[copy.cSld.spTree.length - 1].setParent2(copy);
        }

        if(this.clrMap)
        {
            copy.setClMapOverride(this.clrMap.createDuplicate());
        }
        if(AscFormat.isRealBool(this.show))
        {
            copy.setShow(this.show);
        }
        if(AscFormat.isRealBool(this.showMasterPhAnim))
        {
            copy.setShowPhAnim(this.showMasterPhAnim);
        }
        if(AscFormat.isRealBool(this.showMasterSp))
        {
            copy.setShowMasterSp(this.showMasterSp);
        }

        copy.applyTiming(this.timing.createDuplicate());
        copy.setSlideSize(this.Width, this.Height);


        if(!this.recalcInfo.recalculateBackground && !this.recalcInfo.recalculateSpTree)
        {
            copy.cachedImage = this.getBase64Img();
        }

        return copy;
    },


    Search: function( Str, Props, Engine, Type )
    {
        var sp_tree = this.cSld.spTree;
        for(var i = 0; i < sp_tree.length; ++i)
        {
            if (sp_tree[i].Search)
                sp_tree[i].Search(Str, Props, Engine, Type);
        }
    },

    Search_GetId: function(isNext, StartPos)
    {
        var sp_tree = this.cSld.spTree, i, Id;
        if(isNext)
        {
            for(i = StartPos; i < sp_tree.length; ++i)
            {
                if(sp_tree[i].Search_GetId)
                {
                    Id = sp_tree[i].Search_GetId(isNext, false);
                    if(Id !== null)
                    {
                        return Id;
                    }
                }
            }
        }
        else
        {
            for(i = StartPos; i > -1; --i)
            {
                if(sp_tree[i].Search_GetId)
                {
                    Id = sp_tree[i].Search_GetId(isNext, false);
                    if(Id !== null)
                    {
                        return Id;
                    }
                }
            }
        }
        return null;
    },

    getMatchingShape: function(type, idx, bSingleBody)
    {
        var _input_reduced_type;
        if(type == null)
        {
            _input_reduced_type = AscFormat.phType_body;
        }
        else
        {
            if(type == AscFormat.phType_ctrTitle)
            {
                _input_reduced_type = AscFormat.phType_title;
            }
            else
            {
                _input_reduced_type = type;
            }
        }

        var _input_reduced_index;
        if(idx == null)
        {
            _input_reduced_index = 0;
        }
        else
        {
            _input_reduced_index = idx;
        }

        var _sp_tree = this.cSld.spTree;
        var _shape_index;
        var _index, _type;
        var _final_index, _final_type;
        var _glyph;
        var body_count = 0;
        var last_body;
        for(_shape_index = 0; _shape_index < _sp_tree.length; ++_shape_index)
        {
            _glyph = _sp_tree[_shape_index];
            if(_glyph.isPlaceholder())
            {
                if(_glyph instanceof AscFormat.CShape)
                {
                    _index = _glyph.nvSpPr.nvPr.ph.idx;
                    _type = _glyph.nvSpPr.nvPr.ph.type;
                }
                if(_glyph instanceof AscFormat.CImageShape)
                {
                    _index = _glyph.nvPicPr.nvPr.ph.idx;
                    _type = _glyph.nvPicPr.nvPr.ph.type;
                }
                if(_glyph instanceof  AscFormat.CGroupShape)
                {
                    _index = _glyph.nvGrpSpPr.nvPr.ph.idx;
                    _type = _glyph.nvGrpSpPr.nvPr.ph.type;
                }
                if(_type == null)
                {
                    _final_type = AscFormat.phType_body;
                }
                else
                {
                    if(_type == AscFormat.phType_ctrTitle)
                    {
                        _final_type = AscFormat.phType_title;
                    }
                    else
                    {
                        _final_type = _type;
                    }
                }

                if(_index == null)
                {
                    _final_index = 0;
                }
                else
                {
                    _final_index = _index;
                }

                if(_input_reduced_type == _final_type && _input_reduced_index == _final_index)
                {
                    return _glyph;
                }
                if(_input_reduced_type == AscFormat.phType_title && _input_reduced_type == _final_type)
                {
                    return _glyph;
                }
                if(AscFormat.phType_body === _type)
                {
                    ++body_count;
                    last_body = _glyph;
                }
            }
        }


        if(_input_reduced_type == AscFormat.phType_sldNum || _input_reduced_type == AscFormat.phType_dt || _input_reduced_type == AscFormat.phType_ftr || _input_reduced_type == AscFormat.phType_hdr)
        {
            for(_shape_index = 0; _shape_index < _sp_tree.length; ++_shape_index)
            {
                _glyph = _sp_tree[_shape_index];
                if(_glyph.isPlaceholder())
                {
                    if(_glyph instanceof AscFormat.CShape)
                    {
                        _type = _glyph.nvSpPr.nvPr.ph.type;
                    }
                    if(_glyph instanceof AscFormat.CImageShape)
                    {
                        _type = _glyph.nvPicPr.nvPr.ph.type;
                    }
                    if(_glyph instanceof  AscFormat.CGroupShape)
                    {
                        _type = _glyph.nvGrpSpPr.nvPr.ph.type;
                    }

                    if(_input_reduced_type == _type)
                    {
                        return _glyph;
                    }
                }
            }
        }

        if(body_count === 1 && type === AscFormat.phType_body && bSingleBody)
        {
            return last_body;
        }
        return null;
    },


    changeNum: function(num)
    {
        this.num = num;
    },

    recalcText: function()
    {
        this.recalcInfo.recalculateSpTree = true;
        for(var i = 0; i < this.cSld.spTree.length; ++i)
        {
            this.cSld.spTree[i].recalcText && this.cSld.spTree[i].recalcText();
        }
    },

    addComment: function(comment)
    {
        if(AscCommon.isRealObject(this.slideComments))
        {
            this.slideComments.addComment(comment);
        }
    },

    changeComment: function(id, commentData)
    {
        if(AscCommon.isRealObject(this.slideComments))
        {
            this.slideComments.changeComment(id, commentData);
        }
    },

    removeComment: function(id)
    {
        if(AscCommon.isRealObject(this.slideComments))
        {
            this.slideComments.removeComment(id);
        }
    },

    addToRecalculate: function()
    {
        History.RecalcData_Add({Type: AscDFH.historyitem_recalctype_Drawing, Object: this});
    },

    Refresh_RecalcData: function(data)
    {
        if(data)
        {
            switch(data.Type)
            {
                case AscDFH.historyitem_SlideSetBg:
                {
                    this.recalcInfo.recalculateBackground = true;
                    break;
                }
                case AscDFH.historyitem_SlideSetLayout:
                {
                    this.checkSlideTheme();
                    if(this.Layout){
                        this.lastLayoutType = this.Layout.type;
                        this.lastLayoutMatchingName = this.Layout.matchingName;
                        this.lastLayoutName = this.Layout.cSld.name;
                    }
                    break;
                }
            }
            this.addToRecalculate();
        }
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(AscDFH.historyitem_type_Slide);
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    setSlideComments: function(comments)
    {
       History.Add(new AscDFH.CChangesDrawingsObject(this, AscDFH.historyitem_SlideSetComments, this.slideComments, comments));
        this.slideComments = comments;
    },


    setShow: function(bShow)
    {
       History.Add(new AscDFH.CChangesDrawingsBool(this, AscDFH.historyitem_SlideSetShow, this.show, bShow));
        this.show = bShow;
    },

    setShowPhAnim: function(bShow)
    {
       History.Add(new AscDFH.CChangesDrawingsBool(this, AscDFH.historyitem_SlideSetShowPhAnim, this.showMasterPhAnim, bShow));
        this.showMasterPhAnim = bShow;
    },

    setShowMasterSp: function(bShow)
    {
       History.Add(new AscDFH.CChangesDrawingsBool(this, AscDFH.historyitem_SlideSetShowMasterSp, this.showMasterSp, bShow));
        this.showMasterSp = bShow;
    },

    setLayout: function(layout)
    {
       History.Add(new AscDFH.CChangesDrawingsObject(this, AscDFH.historyitem_SlideSetLayout, this.Layout, layout));
        this.Layout = layout;
        if(layout){
            this.lastLayoutType = layout.type;
            this.lastLayoutMatchingName = layout.matchingName;
            this.lastLayoutName = layout.cSld.name;
        }
    },

    setSlideNum: function(num)
    {
       History.Add(new AscDFH.CChangesDrawingsLong(this, AscDFH.historyitem_SlideSetNum, this.num, num));
        this.num = num;
    },

    applyTiming: function(timing)
    {
        var oldTiming = this.timing.createDuplicate();
        this.timing.applyProps(timing);
       History.Add(new AscDFH.CChangesDrawingsObjectNoId(this, AscDFH.historyitem_SlideSetTiming, oldTiming, this.timing.createDuplicate()));
    },

    setSlideSize: function(w, h)
    {
       History.Add(new AscDFH.CChangesDrawingsObjectNoId(this, AscDFH.historyitem_SlideSetSize, new AscFormat.CDrawingBaseCoordsWritable(this.Width, this.Height), new AscFormat.CDrawingBaseCoordsWritable(w, h)));
        this.Width = w;
        this.Height = h;
    },

    changeBackground: function(bg)
    {
       History.Add(new AscDFH.CChangesDrawingsObjectNoId(this, AscDFH.historyitem_SlideSetBg, this.cSld.Bg , bg));
        this.cSld.Bg = bg;
    },

    setLocks: function(deleteLock, backgroundLock, timingLock, transitionLock, layoutLock)
    {
        this.deleteLock = deleteLock;
        this.backgroundLock = backgroundLock;
        this.timingLock = timingLock;
        this.transitionLock = transitionLock;
        this.layoutLock = layoutLock;
       History.Add(new AscDFH.CChangesDrawingTimingLocks(this, deleteLock, backgroundLock, timingLock, transitionLock, layoutLock));
    },

    shapeAdd: function(pos, item)
    {
        this.checkDrawingUniNvPr(item);
        var _pos = AscFormat.isRealNumber(pos) ? pos : this.cSld.spTree.length;
       History.Add(new AscDFH.CChangesDrawingsContentPresentation(this, AscDFH.historyitem_SlideAddToSpTree, _pos, [item], true));
        this.cSld.spTree.splice(_pos, 0, item);
    },

    checkDrawingUniNvPr: function(drawing)
    {
        var nv_sp_pr;
        if(drawing)
        {
            switch (drawing.getObjectType())
            {
                case AscDFH.historyitem_type_ChartSpace:
                { 
                    if(!drawing.nvGraphicFramePr)
                    {
                        nv_sp_pr = new AscFormat.UniNvPr();
                        nv_sp_pr.cNvPr.setId(++this.maxId);
                        drawing.setNvSpPr(nv_sp_pr);
                    }
                    break;
                }
                case AscDFH.historyitem_type_GroupShape:
                {
                    if(!drawing.nvGrpSpPr)
                    {
                        nv_sp_pr = new AscFormat.UniNvPr();
                        nv_sp_pr.cNvPr.setId(++this.maxId);
                        drawing.setNvSpPr(nv_sp_pr);
                    }
                    for(var i = 0; i < drawing.spTree.length; ++i)
                    {
                        this.checkDrawingUniNvPr(drawing.spTree[i]);
                    }
                    break;
                }
                case AscDFH.historyitem_type_ImageShape:
                case AscDFH.historyitem_type_OleObject:
                {
                    if(!drawing.nvPicPr)
                    {
                        nv_sp_pr = new AscFormat.UniNvPr();
                        nv_sp_pr.cNvPr.setId(++this.maxId);
                        drawing.setNvSpPr(nv_sp_pr);
                    }
                    break;
                }
                case AscDFH.historyitem_type_Shape:
                {
                    if(!drawing.nvSpPr)
                    {
                        nv_sp_pr = new AscFormat.UniNvPr();
                        nv_sp_pr.cNvPr.setId(++this.maxId);
                        drawing.setNvSpPr(nv_sp_pr);
                    }
                    break;
                }
            }
        }
    },


    CheckLayout: function(){
        var bRet = true;
        if(!this.Layout || !this.Layout.CheckCorrect()){
            var oMaster =  this.presentation.slideMasters[0];
            if(!oMaster){
                bRet = false;
            }
            else{
                var oLayout = oMaster.getMatchingLayout(this.lastLayoutType, this.lastLayoutMatchingName, this.lastLayoutName, undefined);
                if(oLayout){
                    this.setLayout(oLayout);
                }
                else{
                    bRet = false;
                }
            }
        }
        return bRet;
    },

    correctContent: function(){


        for(var i = this.cSld.spTree.length - 1;  i > -1 ; --i){
            if(this.cSld.spTree[i].CheckCorrect && !this.cSld.spTree[i].CheckCorrect() || this.cSld.spTree[i].bDeleted){
                if(this.cSld.spTree[i].setBDeleted){
                    this.cSld.spTree[i].setBDeleted(true);
                }
                this.removeFromSpTreeById(this.cSld.spTree[i].Get_Id());
            }
        }
        for(var i = this.cSld.spTree.length - 1;  i > -1 ; --i){
            for(var j = i - 1; j > -1; --j){
                if(this.cSld.spTree[i] === this.cSld.spTree[j]){
                    this.removeFromSpTreeByPos(i);
                    break;
                }
            }
        }
    },


    removeFromSpTreeByPos: function(pos){
        if(pos > -1 && pos < this.cSld.spTree.length){
            History.Add(new AscDFH.CChangesDrawingsContentPresentation(this, AscDFH.historyitem_SlideRemoveFromSpTree, pos, [this.cSld.spTree[pos]], false));
            this.cSld.spTree.splice(pos, 1);
        }
    },

    removeFromSpTreeById: function(id)
    {
        var sp_tree = this.cSld.spTree;
        for(var i = 0; i < sp_tree.length; ++i)
        {
            if(sp_tree[i].Get_Id() === id)
            {
                History.Add(new AscDFH.CChangesDrawingsContentPresentation(this, AscDFH.historyitem_SlideRemoveFromSpTree, i, [sp_tree[i]], false));
                sp_tree.splice(i, 1);
                return i;
            }
        }
        return null;
    },

    addToSpTreeToPos: function(pos, obj)
    {
        this.shapeAdd(pos, obj);
    },

    setCSldName: function(name)
    {
       History.Add(new AscDFH.CChangesDrawingsString(this, AscDFH.historyitem_SlideSetCSldName, this.cSld.name, name));
        this.cSld.name = name;
    },

    setClMapOverride: function(clrMap)
    {
       History.Add(new AscDFH.CChangesDrawingsObject(this, AscDFH.historyitem_SlideSetClrMapOverride, this.clrMap, clrMap));
        this.clrMap = clrMap;
    },

    getAllFonts: function(fonts)
    {
        for(var i = 0; i < this.cSld.spTree.length; ++i)
        {
            if(typeof  this.cSld.spTree[i].getAllFonts === "function")
                this.cSld.spTree[i].getAllFonts(fonts);
        }
    },

    getParentObjects: function()
    {
        var oRet = {master: null, layout: null, slide: this};
        if(this.Layout)
        {
            oRet.layout = this.Layout;
            if(this.Layout.Master)
            {
                oRet.master = this.Layout.Master;
            }
        }
        return oRet;
    },

    copySelectedObjects: function(){
        var aSelectedObjects, i, fShift = 5.0;
        var oSelector = this.graphicObjects.selection.groupSelection ? this.graphicObjects.selection.groupSelection : this.graphicObjects;
        aSelectedObjects = [].concat(oSelector.selectedObjects);
        oSelector.resetSelection(undefined, false);
        var bGroup = this.graphicObjects.selection.groupSelection ? true : false;
        if(bGroup){
            oSelector.normalize();
        }
        for(i = 0; i < aSelectedObjects.length; ++i){
            var oCopy = aSelectedObjects[i].copy();
            oCopy.x = aSelectedObjects[i].x;
            oCopy.y = aSelectedObjects[i].y;
            oCopy.extX = aSelectedObjects[i].extX;
            oCopy.extY = aSelectedObjects[i].extY;
            AscFormat.CheckSpPrXfrm(oCopy, true);
            oCopy.spPr.xfrm.setOffX(oCopy.x + fShift);
            oCopy.spPr.xfrm.setOffY(oCopy.y + fShift);
            oCopy.setParent(this);
            if(!bGroup){
                this.addToSpTreeToPos(undefined, oCopy);
            }
            else{
                oCopy.setGroup(aSelectedObjects[i].group);
                aSelectedObjects[i].group.addToSpTree(undefined, oCopy);
            }
            oSelector.selectObject(oCopy, 0);
        }
        if(bGroup){
            oSelector.updateCoordinatesAfterInternalResize();
        }
    },

    Get_AllImageUrls: function(images)
    {
        if(this.cSld.Bg && this.cSld.Bg.bgPr && this.cSld.Bg.bgPr.Fill && this.cSld.Bg.bgPr.Fill.fill instanceof  AscFormat.CBlipFill && typeof this.cSld.Bg.bgPr.Fill.fill.RasterImageId === "string" )
        {
            images[AscCommon.getFullImageSrc2(this.cSld.Bg.bgPr.Fill.fill.RasterImageId)] = true;
        }
        for(var i = 0; i < this.cSld.spTree.length; ++i)
        {
            if(typeof this.cSld.spTree[i].getAllImages === "function")
            {
                this.cSld.spTree[i].getAllImages(images);
            }
        }
    },

    getAllRasterImages: function(images){
        if(this.cSld.Bg && this.cSld.Bg.bgPr && this.cSld.Bg.bgPr.Fill && this.cSld.Bg.bgPr.Fill.fill instanceof  AscFormat.CBlipFill && typeof this.cSld.Bg.bgPr.Fill.fill.RasterImageId === "string" )
        {
            images.push(AscCommon.getFullImageSrc2(this.cSld.Bg.bgPr.Fill.fill.RasterImageId));
        }
        for(var i = 0; i < this.cSld.spTree.length; ++i)
        {
            if(typeof this.cSld.spTree[i].getAllRasterImages === "function")
            {
                this.cSld.spTree[i].getAllRasterImages(images);
            }
        }
    },

    changeSize: function(width, height)
    {
        var kw = width/this.Width, kh = height/this.Height;
        this.setSlideSize(width, height);
        for(var i = 0; i < this.cSld.spTree.length; ++i)
        {
            this.cSld.spTree[i].changeSize(kw, kh);
        }
    },

    checkSlideSize: function()
    {
        this.recalcInfo.recalculateSpTree = true;
        for(var i = 0; i < this.cSld.spTree.length; ++i)
        {
            this.cSld.spTree[i].handleUpdateExtents();
        }
    },

    checkSlideTheme: function()
    {
        this.recalcInfo.recalculateSpTree = true;
        this.recalcInfo.recalculateBackground = true;
        for(var i = 0; i < this.cSld.spTree.length; ++i)
        {
            this.cSld.spTree[i].handleUpdateTheme();
        }
    },

    checkSlideColorScheme: function()
    {
        this.recalcInfo.recalculateSpTree = true;
        this.recalcInfo.recalculateBackground = true;
        for(var i = 0; i < this.cSld.spTree.length; ++i)
        {
            this.cSld.spTree[i].handleUpdateFill();
            this.cSld.spTree[i].handleUpdateLn();
        }
    },

    Get_Id: function()
    {
        return this.Id;
    },

    Get_ColorMap: function()
    {
        if(this.clrMap)
        {
            return this.clrMap;
        }
        else if(this.Layout && this.Layout.clrMap)
        {
            return this.Layout.clrMap;
        }
        else if(this.Layout.Master && this.Layout.Master.clrMap)
        {
            return this.Layout.Master.clrMap;
        }
        return AscFormat.G_O_DEFAULT_COLOR_MAP;
    },

    recalculate: function()
    {
        if(!this.Layout || !AscFormat.isRealNumber(this.num))
        {
            return;
        }
        this.Layout.recalculate();
        if(this.recalcInfo.recalculateBackground)
        {
            this.recalculateBackground();
            this.recalcInfo.recalculateBackground = false;
        }
        if(this.recalcInfo.recalculateSpTree)
        {
            this.recalculateSpTree();
            this.recalcInfo.recalculateSpTree = false;
        }
        this.cachedImage = null;
    },

    recalculateBackground: function()
    {
        var _back_fill = null;
        var RGBA = {R:0, G:0, B:0, A:255};

        var _layout = this.Layout;
        var _master = _layout.Master;
        var _theme = _master.Theme;
        if (this.cSld.Bg != null)
        {
            if (null != this.cSld.Bg.bgPr)
                _back_fill = this.cSld.Bg.bgPr.Fill;
            else if(this.cSld.Bg.bgRef != null)
            {
                this.cSld.Bg.bgRef.Color.Calculate(_theme, this, _layout, _master, RGBA);
                RGBA = this.cSld.Bg.bgRef.Color.RGBA;
                _back_fill = _theme.themeElements.fmtScheme.GetFillStyle(this.cSld.Bg.bgRef.idx, this.cSld.Bg.bgRef.Color);
            }
        }
        else
        {
            if (_layout != null)
            {
                if (_layout.cSld.Bg != null)
                {
                    if (null != _layout.cSld.Bg.bgPr)
                        _back_fill = _layout.cSld.Bg.bgPr.Fill;
                    else if(_layout.cSld.Bg.bgRef != null)
                    {
                        _layout.cSld.Bg.bgRef.Color.Calculate(_theme, this, _layout, _master, RGBA);
                        RGBA = _layout.cSld.Bg.bgRef.Color.RGBA;
                        _back_fill = _theme.themeElements.fmtScheme.GetFillStyle(_layout.cSld.Bg.bgRef.idx, _layout.cSld.Bg.bgRef.Color);
                    }
                }
                else if (_master != null)
                {
                    if (_master.cSld.Bg != null)
                    {
                        if (null != _master.cSld.Bg.bgPr)
                            _back_fill = _master.cSld.Bg.bgPr.Fill;
                        else if(_master.cSld.Bg.bgRef != null)
                        {
                            _master.cSld.Bg.bgRef.Color.Calculate(_theme, this, _layout, _master, RGBA);
                            RGBA = _master.cSld.Bg.bgRef.Color.RGBA;
                            _back_fill = _theme.themeElements.fmtScheme.GetFillStyle(_master.cSld.Bg.bgRef.idx, _master.cSld.Bg.bgRef.Color);
                        }
                    }
                    else
                    {
                        _back_fill = new AscFormat.CUniFill();
                        _back_fill.fill = new AscFormat.CSolidFill();
                        _back_fill.fill.color =  new AscFormat.CUniColor();
                        _back_fill.fill.color.color = new AscFormat.CRGBColor();
                        _back_fill.fill.color.color.RGBA = {R:255, G:255, B:255, A:255};
                    }
                }
            }
        }

        if (_back_fill != null)
            _back_fill.calculate(_theme, this, _layout, _master, RGBA);

        this.backgroundFill = _back_fill;
    },

    recalculateSpTree: function()
    {
        for(var i = 0; i < this.cSld.spTree.length; ++i)
            this.cSld.spTree[i].recalculate();
    },

    draw: function(graphics)
    {
        DrawBackground(graphics, this.backgroundFill, this.Width, this.Height);
        if(this.showMasterSp === true || (!(this.showMasterSp === false) && (this.Layout.showMasterSp == undefined || this.Layout.showMasterSp)))
        {
            if (graphics.IsSlideBoundsCheckerType === undefined)
                this.Layout.Master.draw(graphics);
        }

        if (graphics && graphics.IsSlideBoundsCheckerType === undefined)
            this.Layout.draw(graphics);
        for(var i=0; i < this.cSld.spTree.length; ++i)
        {
            this.cSld.spTree[i].draw(graphics);
        }
        if(this.slideComments)
        {
            var comments = this.slideComments.comments;
            for(var i=0; i < comments.length; ++i)
            {
                comments[i].draw(graphics);
            }
        }
    },

    drawSelect: function(_type)
    {
        if (_type === undefined)
        {
            this.graphicObjects.drawTextSelection(this.num);
            this.graphicObjects.drawSelect(0, this.presentation.DrawingDocument);
        }
        else if (_type == 1)
            this.graphicObjects.drawTextSelection(this.num);
        else if (_type == 2)
            this.graphicObjects.drawSelect(0, this.presentation.DrawingDocument);
    },


    addAllCommentsToInterface: function()
    {
        if(this.slideComments)
        {
            var aComments = this.slideComments.comments;
            for(var i = aComments.length - 1; i > -1; --i )
            {
                editor.sync_AddComment( aComments[i].Get_Id(), aComments[i].Data);
            }
        }
    },

    removeAllCommentsToInterface: function()
    {
        if(this.slideComments)
        {
            var aComments = this.slideComments.comments;
            for(var i = aComments.length - 1; i > -1; --i )
            {
                editor.sync_RemoveComment(aComments[i].Get_Id());
            }
        }
    },

    getDrawingObjects: function()
    {
        return this.cSld.spTree;
    },

    paragraphAdd: function(paraItem, bRecalculate)
    {
        this.graphicObjects.paragraphAdd(paraItem, bRecalculate);
    },

    OnUpdateOverlay: function()
    {
        this.presentation.DrawingDocument.m_oWordControl.OnUpdateOverlay();
    },

    sendGraphicObjectProps: function()
    {
        editor.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
    },

    checkGraphicObjectPosition: function()
    {
        return {x: 0, y: 0};
    },

    isViewerMode: function()
    {
        return editor.isViewMode;
    },

    onMouseDown: function(e, x, y)
    {
        this.graphicObjects.onMouseDown(e, x, y);
    },

    onMouseMove: function(e, x, y)
    {
        this.graphicObjects.onMouseMove(e, x, y);
    },

    onMouseUp: function(e, x, y)
    {
        this.graphicObjects.onMouseUp(e, x, y);
    },


    getColorMap: function()
    {

    },


    showDrawingObjects: function()
    {
        editor.WordControl.m_oDrawingDocument.OnRecalculatePage(this.num, this);
    },

    showComment: function(Id, x, y)
    {
        editor.sync_HideComment();
        editor.sync_ShowComment(Id, x, y );
    },


    getSlideIndex: function()
    {
        return this.num;
    },


    getWorksheet: function()
    {
        return null;
    },

    showChartSettings:  function()
    {
        editor.asc_onOpenChartFrame();
        editor.sendEvent("asc_doubleClickOnChart", this.graphicObjects.getChartObject());
        this.graphicObjects.changeCurrentState(new AscFormat.NullState(this.graphicObjects));
    },


    Clear_ContentChanges : function()
    {
        this.m_oContentChanges.Clear();
    },

    Add_ContentChanges : function(Changes)
    {
        this.m_oContentChanges.Add( Changes );
    },

    Refresh_ContentChanges : function()
    {
        this.m_oContentChanges.Refresh();
    },


    isLockedObject: function()
    {
      //  var sp_tree = this.cSld.spTree;
      //  for(var i = 0; i < sp_tree.length; ++i)
      //  {
      //      if(sp_tree[i].Lock.Type !== locktype_Mine && sp_tree[i].Lock.Type !== AscCommon.locktype_None)
      //          return true;
      //  }
        return false;
    },



    convertPixToMM: function(pix)
    {
        return editor.WordControl.m_oDrawingDocument.GetMMPerDot(pix);
    },

    getBase64Img: function()
    {
        if(typeof this.cachedImage === "string" && this.cachedImage.length > 0)
            return this.cachedImage;
        return AscCommon.ShapeToImageConverter(this, 0).ImageUrl;
    },

    checkNoTransformPlaceholder: function()
    {
        var sp_tree = this.cSld.spTree;
        for(var i = 0; i < sp_tree.length; ++i)
        {
            var sp = sp_tree[i];
            if(sp.getObjectType() === AscDFH.historyitem_type_Shape || sp.getObjectType() === AscDFH.historyitem_type_ImageShapee || sp.getObjectType() === AscDFH.historyitem_type_OleObject)
            {
                if(sp.isPlaceholder && sp.isPlaceholder())
                {
                    sp.recalcInfo.recalculateShapeHierarchy = true;
                    var hierarchy = sp.getHierarchy();
                    for(var j = 0; j < hierarchy.length; ++j)
                    {
                        if(AscCommon.isRealObject(hierarchy[j]))
                            break;
                    }
                    if(j === hierarchy.length)
                    {
                        AscFormat.CheckSpPrXfrm(sp, true);
                    }
                }
            }
        }
    },

    getSnapArrays: function()
    {
        var snapX = [];
        var snapY = [];
        for(var i = 0; i < this.cSld.spTree.length; ++i)
        {
            if(this.cSld.spTree[i].getSnapArrays)
            {
                this.cSld.spTree[i].getSnapArrays(snapX, snapY);
            }
        }
        return {snapX: snapX, snapY: snapY};
    },


    Load_Comments : function(authors)
    {
        var _comments_count = this.writecomments.length;
        var _comments_id = [];
        var _comments_data = [];
        var _comments_data_author_id = [];
        var _comments = [];

        for (var i = 0; i < _comments_count; i++)
        {
            var _wc = this.writecomments[i];

            if (0 == _wc.WriteParentAuthorId || 0 == _wc.WriteParentCommentId)
            {
                var commentData = new CCommentData();

                commentData.m_sText = _wc.WriteText;
                commentData.m_sUserId = ("" + _wc.WriteAuthorId);
                commentData.m_sUserName = "";
                commentData.m_sTime = _wc.WriteTime;

                for (var k in authors)
                {
                    if (_wc.WriteAuthorId == authors[k].Id)
                    {
                        commentData.m_sUserName = authors[k].Name;
                        break;
                    }
                }

                //if ("" != commentData.m_sUserName)
                {
                    _comments_id.push(_wc.WriteCommentId);
                    _comments_data.push(commentData);
                    _comments_data_author_id.push(_wc.WriteAuthorId);

                    _wc.ParceAdditionalData(commentData);

                    var comment = new CComment(undefined, new CCommentData());
                    comment.setPosition(_wc.x / 25.4, _wc.y / 25.4);
                    _comments.push(comment);
                }
            }
            else
            {
                var commentData = new CCommentData();

                commentData.m_sText = _wc.WriteText;
                commentData.m_sUserId = ("" + _wc.WriteAuthorId);
                commentData.m_sUserName = "";
                commentData.m_sTime = _wc.WriteTime;

                for (var k in authors)
                {
                    if (_wc.WriteAuthorId == authors[k].Id)
                    {
                        commentData.m_sUserName = authors[k].Name;
                        break;
                    }
                }

                _wc.ParceAdditionalData(commentData);

                var _parent = null;
                for (var j = 0; j < _comments_data.length; j++)
                {
                    if ((_wc.WriteParentAuthorId == _comments_data_author_id[j]) && (_wc.WriteParentCommentId == _comments_id[j]))
                    {
                        _parent = _comments_data[j];
                        break;
                    }
                }

                if (null != _parent)
                {
                    _parent.m_aReplies.push(commentData);
                }
            }
        }

        for (var i = 0; i < _comments.length; i++)
        {
            _comments[i].Set_Data(_comments_data[i]);
            this.addComment(_comments[i]);
        }

        this.writecomments = [];
    }
};

function PropLocker(objectId)
{
    this.objectId = null;
    this.Lock = new AscCommon.CLock();
    this.Id = AscCommon.g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);

    if(typeof  objectId === "string")
    {
        this.setObjectId(objectId);
    }

}

PropLocker.prototype = {

    getObjectType: function()
    {
        return AscDFH.historyitem_type_PropLocker;
    },
    setObjectId: function(id)
    {
       History.Add(new AscDFH.CChangesDrawingsString(this, AscDFH.historyitem_PropLockerSetId, this.objectId, id));
        this.objectId = id;
    },
    Get_Id: function()
    {
        return this.Id;
    },
    Write_ToBinary2: function(w)
    {
        w.WriteLong(AscDFH.historyitem_type_PropLocker);
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    Refresh_RecalcData: function()
    {}

};

AscFormat.CTextBody.prototype.Get_StartPage_Absolute = function()
{
    if(this.parent)
    {
        if(this.parent.getParentObjects)
        {
            var parent_objects = this.parent.getParentObjects();
            if(parent_objects.slide)
            {
                return parent_objects.slide.num;
            }
        }
    }
    return 0;
};
AscFormat.CTextBody.prototype.Get_AbsolutePage = function(CurPage)
{
    return this.Get_StartPage_Absolute();
};
AscFormat.CTextBody.prototype.Get_AbsoluteColumn = function(CurPage)
{
    return 0;//TODO;
};
AscFormat.CTextBody.prototype.checkCurrentPlaceholder = function()
{
    var presentation = editor.WordControl.m_oLogicDocument;

    if(presentation.Slides[presentation.CurPage])
    {
        return presentation.Slides[presentation.CurPage].graphicObjects.getTargetDocContent() === this.content;
    }
    return false;
};



function SlideComments(slide)
{
    this.comments = [];
    this.m_oContentChanges = new AscCommon.CContentChanges(); // список изменений(добавление/удаление элементов)
    this.slide = slide;
    this.Id = AscCommon.g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

SlideComments.prototype =
{
    getObjectType: function()
    {
        return AscDFH.historyitem_type_SlideComments;
    },

    Get_Id: function()
    {
        return this.Id;
    },

    Clear_ContentChanges : function()
    {
        this.m_oContentChanges.Clear();
    },

    Add_ContentChanges : function(Changes)
    {
        this.m_oContentChanges.Add( Changes );
    },

    Refresh_ContentChanges : function()
    {
        this.m_oContentChanges.Refresh();
    },

    addComment: function(comment)
    {
       History.Add(new AscDFH.CChangesDrawingsContentComments(this, AscDFH.historyitem_SlideCommentsAddComment, this.comments.length, [comment], true));
        this.comments.splice(this.comments.length, 0, comment);
        comment.slideComments = this;
    },


    getSlideIndex: function()
    {
        if(this.slide)
        {
            return this.slide.num;
        }
        return null;
    },



    changeComment: function(id, commentData)
    {
        for(var i = 0; i < this.comments.length; ++i)
        {
            if(this.comments[i].Get_Id() === id)
            {
                this.comments[i].Set_Data(commentData);
                return;
            }
        }
    },

    removeComment: function(id)
    {
        for(var i = 0; i < this.comments.length; ++i)
        {
            if(this.comments[i].Get_Id() === id)
            {
                History.Add(new AscDFH.CChangesDrawingsContentComments(this, AscDFH.historyitem_SlideCommentsRemoveComment, i, [id], false));
                this.comments.splice(i, 1);
                editor.sync_RemoveComment(id);
                return;
            }
        }
    },

    removeSelectedComment: function()
    {
        var comment = this.getSelectedComment();
        if(comment)
        {
            this.removeComment(comment.Get_Id());
        }
    },

    getSelectedComment: function()
    {
        for(var i = 0; i < this.comments.length; ++i)
        {
            if(this.comments[i].selected)
            {
                return this.comments[i];
            }
        }
        return null;
    },

    recalculate: function()
    {},

    Write_ToBinary2: function(w)
    {
        w.WriteLong(AscDFH.historyitem_type_SlideComments);
        w.WriteString2(this.Id);
        AscFormat.writeObject(w, this.slide);
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
        this.slide = AscFormat.readObject(r);
    },

    Refresh_RecalcData: function()
    {
        History.RecalcData_Add({Type: AscDFH.historyitem_recalctype_Drawing, Object: this});
    }
};

//--------------------------------------------------------export----------------------------------------------------
window['AscCommonSlide'] = window['AscCommonSlide'] || {};
window['AscCommonSlide'].Slide = Slide;
window['AscCommonSlide'].PropLocker = PropLocker;
window['AscCommonSlide'].SlideComments = SlideComments;
