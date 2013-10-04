/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 6/26/13
 * Time: 2:04 PM
 * To change this template use File | Settings | File Templates.
 */

function MasterSlide(presentation, theme)
{
    this.cSld = new CSld();
    this.clrMap = new ClrMap();

    this.hf = new HF();

    this.sldLayoutLst = [];

    this.txStyles = null;
    this.preserve = false;

    this.ImageBase64 = "";
    this.ThemeIndex = 0;

    // pointers
    this.Theme = null;
    this.TableStyles = null;
    this.Vml = null;

    this.Width = 254;
    this.Height = 190.5;
    this.recalcInfo = {};
    this.DrawingDocument = editor.WordControl.m_oDrawingDocument;
    this.maxId = 1000;
    this.changeProportions = function(kW, kH)
    {
        var _graphic_objects = this.cSld.spTree;
        var _object_index;
        var _objects_count = _graphic_objects.length;
        for(_object_index = 0; _object_index < _objects_count; ++_object_index)
        {
            _graphic_objects[_object_index].changeProportions(kW, kH)
        }
    };

    this.draw = function(graphics)
    {
        for(var i=0; i < this.cSld.spTree.length; ++i)
        {
            if(!this.cSld.spTree[i].isPlaceholder())
                this.cSld.spTree[i].draw(graphics);
        }
    };

    this.setSize = function(width, height)
    {
        var _k_h = height/this.Height;
        var _k_w = width/this.Width;
        this.Width = width;
        this.Height = height;

        var _graphic_objects = this.cSld.spTree;
        var _objects_count = _graphic_objects.length;
        var _object_index;
        for(_object_index = 0; _object_index < _objects_count; ++_object_index)
        {
            _graphic_objects[_object_index].updateProportions(_k_w, _k_h);
        }

        var _layouts = this.sldLayoutLst;
        var _layout_count = _layouts.length;
        var _layout_index;
        for(_layout_index = 0; _layout_index < _layout_count; ++_layout_index)
        {
            _layouts[_layout_index].setSize(width, height);
        }
    };
    this.calculateColors = function()
    {
        var _shapes = this.cSld.spTree;
        var _shapes_count = _shapes.length;
        var _shape_index;
        for(_shape_index = 0; _shape_index < _shapes_count; ++_shape_index)
        {
            if(_shapes[_shape_index].calculateColors)
            {
                _shapes[_shape_index].calculateColors();
            }
        }
    };

    this.getMatchingLayout = function(type, matchingName, cSldName, themeFlag)
    {
        /*var _layouts = this.sldLayoutLst;
         for(var _index = 0; _index < _layouts.length; ++_index)
         {
         if(_layouts[_index].calculatedType == null)
         {
         _layouts[_index].calculateType();
         }
         if(_layouts[_index].calculatedType === type)
         {
         return _layouts[_index];
         }
         }
         for(var _index = 0; _index < _layouts.length; ++_index)
         {
         if(_layouts[_index].matchedTypes == null || _layouts[_index].matchedTypes.length == 0)
         {
         _layouts[_index].calculateMatchedTypes();
         }
         if(_layouts[_index].matchedTypes[type] === true)
         {
         return _layouts[_index];
         }
         }     */
        var layoutType = type;

        var _layoutName = null, _layout_index, _layout;

        if(type === nSldLtTTitle && !(themeFlag === true))
        {
            layoutType = nSldLtTObj;
        }
        if(layoutType != null)
        {
            for(var i = 0; i < this.sldLayoutLst.length; ++i)
            {
                if(this.sldLayoutLst[i].type == layoutType)
                {
                    return this.sldLayoutLst[i];
                }
            }
        }

        if(type === nSldLtTTitle && !(themeFlag === true))
        {
            layoutType = nSldLtTTx;
            for(i = 0; i < this.sldLayoutLst.length; ++i)
            {
                if(this.sldLayoutLst[i].type == layoutType)
                {
                    return this.sldLayoutLst[i];
                }
            }
        }


        if(matchingName != "" && matchingName != null)
        {
            _layoutName = matchingName;
        }
        else
        {
            if(cSldName != "" && cSldName != null)
            {
                _layoutName = cSldName;
            }
        }
        if(_layoutName != null)
        {
            var _layout_name;
            for(_layout_index = 0; _layout_index < this.sldLayoutLst.length; ++_layout_index)
            {
                _layout = this.sldLayoutLst[_layout_index];
                _layout_name = null;

                if(_layout.matchingName != null && _layout.matchingName != "")
                {
                    _layout_name = _layout.matchingName;
                }
                else
                {
                    if(_layout.cSld.name != null && _layout.cSld.name != "")
                    {
                        _layout_name = _layout.cSld.name;
                    }
                }
                if(_layout_name == _layoutName)
                {
                    return _layout;
                }
            }
        }
        for(_layout_index = 0; _layout_index < this.sldLayoutLst.length; ++_layout_index)
        {
            _layout = this.sldLayoutLst[_layout_index];
            _layout_name = null;

            if(_layout.type != nSldLtTTitle)
            {
                return _layout;
            }

        }

        return this.sldLayoutLst[0];
    };

    this.Calculate = function()
    {
        // нужно пробежаться по всем шейпам:
        // учесть тему во всех заливках
        // учесть тему во всех текстовых настройках,

        var titleStyles = this.txStyles.titleStyle;



    };

//----------------------------------------------
    this.presentation = editor.WordControl.m_oLogicDocument;
    this.theme = theme;

    this.kind = MASTER_KIND;

    this.getMatchingShape =  function(type, idx)
    {
        var _input_reduced_type;
        if(type == null)
        {
            _input_reduced_type = phType_body;
        }
        else
        {
            if(type == phType_ctrTitle)
            {
                _input_reduced_type = phType_title;
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
        for(_shape_index = 0; _shape_index < _sp_tree.length; ++_shape_index)
        {
            _glyph = _sp_tree[_shape_index];
            if(_glyph.isPlaceholder())
            {
                ///if(_glyph instanceof CShape)
                {
                    _index = _glyph.nvSpPr.nvPr.ph.idx;
                    _type = _glyph.nvSpPr.nvPr.ph.type;
                }
               /* if(_glyph instanceof CImage2)
                {
                    _index = _glyph.nvPicPr.nvPr.ph.idx;
                    _type = _glyph.nvPicPr.nvPr.ph.type;
                }
                if(_glyph instanceof  GroupShape)
                {
                    _index = _glyph.nvGrpSpPr.nvPr.ph.idx;
                    _type = _glyph.nvGrpSpPr.nvPr.ph.type;
                }   */
                if(_type == null)
                {
                    _final_type = phType_body;
                }
                else
                {
                    if(_type == phType_ctrTitle)
                    {
                        _final_type = phType_title;
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
            }
        }
        if(_input_reduced_type == phType_sldNum || _input_reduced_type == phType_dt || _input_reduced_type == phType_ftr || _input_reduced_type == phType_hdr)
        {
            for(_shape_index = 0; _shape_index < _sp_tree.length; ++_shape_index)
            {
                _glyph = _sp_tree[_shape_index];
                if(_glyph.isPlaceholder())
                {
                    if(_glyph instanceof CShape)
                    {
                        _type = _glyph.nvSpPr.nvPr.ph.type;
                    }
                    if(_glyph instanceof CImageShape)
                    {
                        _type = _glyph.nvPicPr.nvPr.ph.type;
                    }
                    if(_glyph instanceof  CGroupShape)
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

        return null;
    };

    this.recalculate = function()
    {
        try
        {
            var _shapes = this.cSld.spTree;
            var _shape_index;
            var _shape_count = _shapes.length;
            for(_shape_index = 0; _shape_index < _shape_count; ++_shape_index)
            {
                if(!_shapes[_shape_index].isPlaceholder())
                    _shapes[_shape_index].recalculate();
            }
        }
        catch(e)
        {

        }
    };

    this.setNewSizes = function(width, height)
    {
        if(!(typeof width === "number" && width > 0 && typeof height === "number" && height > 0))
            return;
        var _k_w = width / this.Width;
        var _k_h = height / this.Height;

        var _graphic_objects = this.cSld.spTree;
        var _object_count = _graphic_objects.length;
        var _object_index;
        for(_object_index = 0; _object_index < _object_count; ++_object_index)
        {
            _graphic_objects[_object_index].updateProportions(_k_w, _k_h);
        }

    };

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

MasterSlide.prototype =
{
    addLayout: function(layout)
    {
        this.sldLayoutLst.push(layout);
    },

    setTheme: function(theme)
    {
        History.Add(this, {Type:historyitem_SetMasterTheme, oldPr: this.Theme, newPr: theme});
        this.Theme = theme;
    },

    changeSize: function(kw, kh)
    {
        this.Width *= kw;
        this.Height *= kh;
        for(var i = 0; i < this.cSld.spTree.length; ++i)
        {
            this.cSld.spTree[i].changeSize(kw, kh);
        }
        this.recalcAll();
    },

    shapeAdd: function(pos, item)
    {
        History.Add(this, {Type: historyitem_ShapeAdd, pos: pos, item: item});
        this.cSld.spTree.splice(pos, 0, item);
    },

    changeBackground: function(bg)
    {
        History.Add(this, {Type: historyitem_ChangeBg, oldBg: this.cSld.Bg ? this.cSld.Bg.createFullCopy() : null, newBg: bg});
        this.cSld.Bg = bg.createFullCopy();
        this.recalcInfo.recalculateBackground = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },

    setTxStyles: function(txStyles)
    {
        History.Add(this, {Type: historyitem_SetTxStyles, oldPr: this.txStyles, newPr: txStyles});
        this.txStyles = txStyles;
    },

    setCSldName: function(name)
    {
        History.Add(this, {Type: historyitem_SetCSldName,oldName: this.cSld.name, newName: name});
        this.cSld.name = name;
    },

    recalcAll: function()
    {
        for(var i = 0; i < this.cSld.spTree.length; ++i)
        {
            this.cSld.spTree[i].recalcAll();
        }
    },

    setClMapOverride: function(clrMap)
    {
        History.Add(this, {Type: historyitem_SetClrMapOverride, oldClrMap: this.clrMap, newClrMap: clrMap});
        this.clrMap = clrMap;
    },

    addToSldLayoutLstToPos: function(pos, obj)
    {
        History.Add(this, {Type: historyitem_AddLayout, objectId: obj.Get_Id(), pos:pos});
        this.sldLayoutLst.splice(pos, 0, obj);

    },

    getAllImages: function(images)
    {
        if(this.cSld.Bg && this.cSld.Bg.bgPr && this.cSld.Bg.bgPr.Fill && this.cSld.Bg.bgPr.Fill.fill instanceof  CBlipFill && typeof this.cSld.Bg.bgPr.Fill.fill.RasterImageId === "string" )
        {
            images[_getFullImageSrc(this.cSld.Bg.bgPr.Fill.fill.RasterImageId)] = true;
        }
        for(var i = 0; i < this.cSld.spTree.length; ++i)
        {
            if(typeof this.cSld.spTree[i].getAllImages === "function")
            {
                this.cSld.spTree[i].getAllImages(images);
            }
        }
    },

    Get_Id: function()
    {
        return this.Id;
    },


    Refresh_RecalcData: function()
    {},
    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_SetMasterTheme:
            {
                //this.Theme = data.oldPr;
                break;
            }
            case historyitem_SetTxStyles:
            {
                this.txStyles = data.oldPr;
                break;
            }

            case historyitem_AddComment:
            {
                this.comments.splice(data.pos, 1);
                editor.sync_RemoveComment( data.objectId );

                break;
            }

            case historyitem_RemoveComment:
            {
                this.comments.splice(data.index, 0, g_oTableId.Get_ById(data.id));
                editor.sync_AddComment( this.comments[data.index].Get_Id(), this.comments[data.index].Data);
                break;
            }

            case historyitem_RemoveFromSpTree:
            {
                this.cSld.spTree.splice(data.index, 0, g_oTableId.Get_ById(data.id));
                break;
            }
            case historyitem_AddToSlideSpTree:
            {
                this.cSld.spTree.splice(data.pos, 1);
                break;
            }

            case historyitem_AddLayout:
            {
                //this.sldLayoutLst.splice(data.pos, 1);
                break;
            }
            case historyitem_AddSlideLocks:
            {
                this.deleteLock    = null;
                this.backgroundLock = null;
                this.timingLock    = null;
                this.transitionLock = null;
                this.layoutLock    = null;
                break;
            }
            case historyitem_ChangeBg:
            {
                this.cSld.Bg = data.oldBg;
                this.recalcInfo.recalculateBackground = true;
                editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;

                break;
            }
            case historyitem_ChangeTiming:
            {
                this.timing = data.oldTiming.createDuplicate();
                break;
            }
            case historyitem_SetLayout:
            {
                this.Layout = data.oldLayout;
                if(this.Layout != null)
                    this.recalcAll();
                break;
            }
            case historyitem_SetSlideNum:
            {
                this.num = data.oldNum;
                break;
            }
            case historyitem_ShapeAdd:
            {
                this.cSld.spTree.splice(data.pos, 1);
                break;
            }
            case historyitem_SetCSldName:
            {
                this.cSld.name = data.oldName;
                break;
            }
            case historyitem_SetClrMapOverride:
            {
                this.clrMap = data.oldClrMap;
                break;
            }
            case historyitem_SetShow:
            {
                this.show = data.oldPr;
                break;
            }


            case historyitem_SetShowPhAnim:
            {
                this.showMasterPhAnim = data.oldPr;
                break;
            }


            case historyitem_SetShowMasterSp:
            {
                this.showMasterSp = data.oldPr;
                break;
            }



        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {

            case historyitem_SetMasterTheme:
            {
                //this.Theme = data.newPr;
                break;
            }
            case historyitem_SetTxStyles:
            {
                this.txStyles = data.newPr;
                break;
            }
            case historyitem_AddComment:
            {
                this.comments.splice(data.pos, 0, g_oTableId.Get_ById(data.objectId));
                editor.sync_AddComment( data.objectId, this.comments[data.pos].Data);

                break;
            }
            case historyitem_RemoveComment:
            {
                this.comments.splice(data.index, 1);
                editor.sync_RemoveComment(data.id);
                break;
            }
            case historyitem_RemoveFromSpTree:
            {
                this.cSld.spTree.splice(data.index, 1);
                break;
            }
            case historyitem_AddToSlideSpTree:
            {
                this.cSld.spTree.splice(data.pos, 0, g_oTableId.Get_ById(data.objectId));
                break;
            }
            case historyitem_AddLayout:
            {
                //this.sldLayoutLst.splice(data.pos, 0, g_oTableId.Get_ById(data.objectId));
                break;
            }
            case historyitem_AddSlideLocks:
            {
                this.deleteLock     = g_oTableId.Get_ById(data.deleteLock);
                this.backgroundLock = g_oTableId.Get_ById(data.backgroundLock);
                this.timingLock     = g_oTableId.Get_ById(data.timingLock);
                this.transitionLock = g_oTableId.Get_ById(data.transitionLock);
                this.layoutLock     = g_oTableId.Get_ById(data.layoutLock);
                break;
            }
            case historyitem_ChangeBg:
            {
                this.cSld.Bg = data.newBg;
                this.recalcInfo.recalculateBackground = true;
                editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;

                break;
            }
            case historyitem_ChangeTiming:
            {
                this.timing = data.newTiming.createDuplicate();
                break;
            }
            case historyitem_SetLayout:
            {
                this.Layout = data.newLayout;
                this.recalcAll();
                break;
            }
            case historyitem_SetSlideNum:
            {
                this.num = data.newNum;
                break;
            }
            case historyitem_ShapeAdd:
            {
                this.cSld.spTree.splice(data.pos, 0, data.item);
                break;
            }

            case historyitem_SetCSldName:
            {
                this.cSld.name = data.newName;
                break;
            }

            case historyitem_SetClrMapOverride:
            {
                this.clrMap = data.newClrMap;
                break;
            }
            case historyitem_SetShow:
            {
                this.show = data.newPr;
                break;
            }


            case historyitem_SetShowPhAnim:
            {
                this.showMasterPhAnim = data.newPr;
                break;
            }


            case historyitem_SetShowMasterSp:
            {
                this.showMasterSp = data.newPr;
                break;
            }
        }
    },

    Write_ToBinary2: function(w)
    {
        w.WriteLong(historyitem_type_SlideMaster);
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch(data.Type)
        {

            case historyitem_SetMasterTheme:
            {
                w.WriteString2(data.newPr.Get_Id());
                break;
            }
            case historyitem_SetTxStyles:
            {
                MASTER_STYLES = true;
                data.newPr.Write_ToBinary2(w);
                MASTER_STYLES = false;
                break;
            }
            case historyitem_AddComment:
            {
                w.WriteLong(data.pos);
                w.WriteString2(data.objectId);
                break;
            }
            case historyitem_RemoveComment:
            {
                w.WriteLong(data.index);
                break;
            }
            case historyitem_RemoveFromSpTree:
            {
                w.WriteLong(data.index);
                break;
            }
            case historyitem_AddToSlideSpTree:
            {
                w.WriteLong(data.pos);
                w.WriteString2(data.objectId);
                break;
            }
            case historyitem_AddLayout:
            {
                w.WriteLong(data.pos);
                w.WriteString2(data.objectId);
                break;
            }
            case historyitem_AddSlideLocks:
            {
                w.WriteString2(data.deleteLock);
                w.WriteString2(data.backgroundLock);
                w.WriteString2(data.timingLock);
                w.WriteString2(data.transitionLock);
                w.WriteString2(data.layoutLock);
                break;
            }

            case historyitem_ChangeBg:
            {
                data.newBg.Write_ToBinary2(w);

                break;
            }
            case historyitem_ChangeTiming:
            {
                data.newTiming.Write_ToBinary2(w);
                break;
            }
            case historyitem_SetLayout:
            {
                w.WriteBool(isRealObject(data.newLayout));
                if(isRealObject(data.newLayout))
                {
                    w.WriteString2(data.newLayout.Get_Id());
                }
                break;
            }
            case historyitem_SetSlideNum:
            {
                w.WriteBool(isRealNumber(data.newNum));
                if(isRealNumber(data.newNum))
                {
                    w.WriteLong(data.newNum);
                }
                break;
            }
            case historyitem_ShapeAdd:
            {
                w.WriteLong(data.pos);
                w.WriteString2(data.item.Get_Id());
                break;
            }

            case historyitem_SetCSldName:
            {
                w.WriteBool(typeof data.newName === "string");
                if(typeof data.newName === "string")
                {
                    w.WriteString2(data.newName);
                }
                break;
            }

            case historyitem_SetClrMapOverride:
            {
                w.WriteBool(isRealObject(data.newClrMap));
                if(isRealObject(data.newClrMap))
                {
                    data.newClrMap.Write_ToBinary2(w);
                }
                break;
            }

            case historyitem_SetShow:
            {
                w.WriteBool(data.newPr);
                break;
            }


            case historyitem_SetShowPhAnim:
            {
                w.WriteBool( data.newPr);
                break;
            }


            case historyitem_SetShowMasterSp:
            {
                w.WriteBool( data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_SetMasterTheme:
            {
                this.Theme = g_oTableId.Get_ById(r.GetString2());
                break;
            }
            case historyitem_SetTxStyles:
            {
                this.txStyles = new CTextStyles();
                this.txStyles.Read_FromBinary2(r);
                break;
            }
            case historyitem_AddComment:
            {
                var pos = r.GetLong();
                var id = r.GetString2();
                this.comments.splice(pos, 0,  g_oTableId.Get_ById(id));
                editor.sync_AddComment( id, this.comments[pos].Data);
                break;
            }
            case historyitem_RemoveComment:
            {

                var comment = this.comments.splice(r.GetLong(), 1)[0];
                editor.sync_RemoveComment(comment.Id);
                break;
            }
            case historyitem_RemoveFromSpTree:
            {
                this.cSld.spTree.splice(r.GetLong(), 1);
                break;
            }
            case historyitem_AddToSlideSpTree:
            {
                var pos = r.GetLong();
                var id = r.GetString2();
                this.cSld.spTree.splice(pos, 0,  g_oTableId.Get_ById(id));
                break;
            }
            case historyitem_AddLayout:
            {
                var pos = r.GetLong();
                var id = r.GetString2();
                this.sldLayoutLst.splice(pos, 0,  g_oTableId.Get_ById(id));
                break;
            }
            case historyitem_AddSlideLocks:
            {
                this.deleteLock     = g_oTableId.Get_ById(r.GetString2());
                this.backgroundLock = g_oTableId.Get_ById(r.GetString2());
                this.timingLock     = g_oTableId.Get_ById(r.GetString2());
                this.transitionLock = g_oTableId.Get_ById(r.GetString2());
                this.layoutLock     = g_oTableId.Get_ById(r.GetString2());
                break;
            }
            case historyitem_ChangeBg:
            {
                this.cSld.Bg = new CBg();
                this.cSld.Bg.Read_FromBinary2(r);
                this.recalcInfo.recalculateBackground = true;
                editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;

                break;
            }
            case historyitem_ChangeTiming:
            {
                this.timing = new CAscSlideTiming();
                this.timing.Read_FromBinary2(r);
                break;
            }
            case historyitem_SetLayout:
            {
                if(r.GetBool())
                {
                    this.Layout = g_oTableId.Get_ById(r.GetString2());
                }
                else
                {
                    this.Layout = null;
                }
                this.recalcAll();
                break;
            }
            case historyitem_SetSlideNum:
            {
                if(r.GetBool())
                {
                    this.num = r.GetLong();
                }
                else
                {
                    this.num = null;
                }
                break;
            }

            case historyitem_ShapeAdd:
            {
                var pos = r.GetLong();
                var item  = g_oTableId.Get_ById(r.GetString2());
                this.cSld.spTree.splice(pos, 0, item);
                break;
            }
            case historyitem_SetCSldName:
            {
                if(r.GetBool())
                {
                    this.cSld.name = r.GetString2();
                }
                else
                {
                    this.cSld.name = null;
                }
                break;
            }


            case historyitem_SetClrMapOverride:
            {
                if(r.GetBool())
                {
                    this.clrMap = new ClrMap();
                    this.clrMap.Read_FromBinary2(r);
                }
                break;
            }
            case historyitem_SetShow:
            {
                this.show = r.GetBool();
                break;
            }


            case historyitem_SetShowPhAnim:
            {
                this.showMasterPhAnim = r.GetBool();
                break;
            }


            case historyitem_SetShowMasterSp:
            {
                this.showMasterSp = r.GetBool();
                break;
            }
        }
    }
};
