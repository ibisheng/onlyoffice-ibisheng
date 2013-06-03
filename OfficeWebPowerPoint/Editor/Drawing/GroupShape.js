var historyitem_Shape_Group1=10;
var historyitem_Shape_Group2=11;

function GroupShape(parent)
{
    this.type = graphic_objects_type_GroupShapes;
    this.selected = false;
    this.parent = parent;
    this.grpSpPr = new CSpPr();
    this.nvGrpSpPr = null;
    if(this.parent.kind == SLIDE_KIND)
    {
        this.SlideNum = this.parent.num;
        if(this.parent.Layout && this.parent.Layout.Master)
        {
            this.Document = this.parent.Layout.Master.presentation;
            this.DrawingDocument = this.Document.DrawingDocument;
        }
        this.Container = this.parent.elementsManipulator;
    }
    this.DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;


    this.ext = {};
    this.off = {};
    this.State = new NullShapeState();
    this.ArrGlyph = [];
    this.ArrTrackObj = [];
    this.preTrackArr = [];
    this.stX = 0;
    this.stY = 0;
    this.obj = {};
    this.NumEditShape = 0;
    this.NumSelected = 0;
    this.spPr = this.grpSpPr;

    this.pen = null;
    this.brush = null;
    this.shadow = null;
    this.isInit = false;
}

GroupShape.prototype=
{

    IsLine : function()
    {
        return false;
    },

    CreateFontMap : function(FontMap)
    {
        for(var i =0; i < this.ArrGlyph.length; ++i)
        {
            if(this.ArrGlyph[i].CreateFontMap != undefined)
            {
                this.ArrGlyph[i].CreateFontMap(FontMap);
            }
        }
    },


    hitToHyperlink: function(x, y)
    {
        return false;
    },

    calculateCompiledVerticalAlign: function()
    {
        var _shapes = this.ArrGlyph;
        var _shape_index;
        var _shape;
        var _result_align = null;
        var _cur_align;
        for(_shape_index = 0; _shape_index < _shapes.length; ++ _shape_index)
        {
            var _shape = _shapes[_shape_index];
            if(_shape instanceof  CShape)
            {
                if(_shape.txBody && _shape.txBody.compiledBodyPr && typeof (_shape.txBody.compiledBodyPr.anchor) == "number")
                {
                    _cur_align = _shape.txBody.compiledBodyPr.anchor;
                    if(_result_align === null)
                    {
                        _result_align = _cur_align;
                    }
                    else
                    {
                        if(_result_align !== _cur_align)
                        {
                            return null;
                        }
                    }
                }
                else
                {
                    return null;
                }
            }
            if(_shape instanceof GroupShape)
            {
                _cur_align = _shape.calculateCompiledVerticalAlign();
                if(_cur_align === null)
                {
                    return null;
                }
                if(_result_align === null)
                {
                    _result_align = _cur_align;
                }
                else
                {
                    if(_result_align !== _cur_align)
                    {
                        return null;
                    }
                }
            }
        }
        return _result_align;
    },

    canSetVerticalAlign: function(align)
    {
        var _shapes = this.ArrGlyph;
        var _shape_index;
        var _shape;
        for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
        {
            _shape = _shapes[_shape_index];
            if(_shape instanceof CShape)
            {
                if(_shape.txBody)
                {
                    if(_shape.txBody.compiledBodyPr)
                    {
                        if(_shape.txBody.compiledBodyPr.anchor !== align)
                        {
                            return true;
                        }
                    }
                    else
                    {
                        return true;
                    }
                }
            }
            if(_shape instanceof GroupShape)
            {
                if(_shape.canSetVerticalAlign(align) === true)
                {
                    return true;
                }
            }
        }
        return false;
    },

    resizeToFormat : function(kx, ky)
    {
        if(kx > 0 && ky > 0)
        {
            if(this.spPr && this.spPr.xfrm && this.spPr.xfrm.offX != null)
            {
                this.spPr.xfrm.offX *= kx;
                this.spPr.xfrm.offY *= ky;
                this.spPr.xfrm.extX *= kx;
                this.spPr.xfrm.extY *= ky;
                this.spPr.xfrm.chExtX *= kx;
                this.spPr.xfrm.chExtY *= ky;
                this.spPr.xfrm.chOffX *= kx;
                this.spPr.xfrm.chOffY *= ky;
                for(var _shape_index = 0; _shape_index < this.ArrGlyph.length; ++_shape_index)
                {
                    this.ArrGlyph[_shape_index].resizeToFormat(kx, ky);
                }
            }
        }
    },

    getSearchResults : function(str, num)
    {
        var commonSearchResults = [];
        for(var i = 0; i< this.ArrGlyph.length; ++i)
        {
            var searchResults;
            if((searchResults = this.ArrGlyph[i].getSearchResults(str, i))!=null)
            {
                for(var j = 0; j < searchResults.length; ++j)
                {
                    var selectionMap = [];
                    for(var k = 0; k < this.Container.ArrGlyph.length; ++k)
                    {
                        selectionMap[k] = false;
                    }
                    selectionMap[num] = true;
                    searchResults[j] =
                        {
                            state : new GroupState(),
                            selectionMap : selectionMap,
                            group : this,
                            groupSelection : searchResults[j]
                        };
                    commonSearchResults.push(searchResults[j]);
                }
            }
        }
        return commonSearchResults.length > 0 ? commonSearchResults : null;
    },

    createFullCopy : function(parent, container)
    {
        var _copy = new GroupShape(parent);
        _copy.pH = this.pH;
        _copy.pV = this.pV;
        _copy.ext = clone(this.ext);
        _copy.off = clone(this.off);
        _copy.flipH = this.flipH;
        _copy.flipV = this.flipV;
        _copy.rot = this.rot;
        if (this.nvGrpSpPr != null)
        {
            _copy.nvGrpSpPr = this.nvGrpSpPr.createDuplicate();
            if(_copy.nvGrpSpPr.cNvPr)
            {
                _copy.nvGrpSpPr.cNvPr.id = ++parent.maxId;
            }
            else
            {
                _copy.nvGrpSpPr.cNvPr = new CNvPr();
                _copy.nvGrpSpPr.cNvPr.id = ++parent.maxId;
            }
        }
        else
        {
            _copy.nvGrpSpPr = new UniNvPr();
            _copy.nvGrpSpPr.cNvPr.id = ++parent.maxId;
        }

        _copy.grpSpPr = this.grpSpPr.createDuplicate();
        _copy.spPr = _copy.grpSpPr;
        var _glyph_index;
        for (_glyph_index = 0; _glyph_index < this.ArrGlyph.length; ++_glyph_index)
        {
            _copy.ArrGlyph[_glyph_index] = this.ArrGlyph[_glyph_index].createFullCopy(parent, _copy);

        }
        _copy.setContainer(container);
        return _copy;
    },

    createCopy : function (parent, container, posX, posY, _font_flag)
    {
        var _copy = new GroupShape(parent);
        _copy.grpSpPr = this.grpSpPr.createDuplicate();
        _copy.grpSpPr.xfrm.offX = posX;
        _copy.grpSpPr.xfrm.offY = posY;
        _copy.grpSpPr.xfrm.extX = this.ext.cx;
        _copy.grpSpPr.xfrm.extY = this.ext.cy;
        _copy.grpSpPr.xfrm.chExtX = this.ext.cx;
        _copy.grpSpPr.xfrm.chExtY = this.ext.cy;
        _copy.grpSpPr.xfrm.chOffX = 0;
        _copy.grpSpPr.xfrm.chOffY = 0;
        _copy.grpSpPr.xfrm.rot = this.rot;
        _copy.grpSpPr.xfrm.flipH = this.flipH;
        _copy.grpSpPr.xfrm.flipV = this.flipV;
        _copy.spPr = _copy.grpSpPr;

        _copy.nvGrpSpPr = new UniNvPr();
        _copy.nvGrpSpPr.cNvPr.id = ++parent.maxId;
        if (this.nvGrpSpPr != null)
        {
            _copy.nvGrpSpPr = this.nvGrpSpPr.createDuplicate();
        }
     //   _copy.spPr = this.spPr.createDuplicate();

        var _glyph_index;
        for (_glyph_index = 0; _glyph_index < this.ArrGlyph.length; ++_glyph_index)
        {
            _copy.ArrGlyph[_glyph_index] = this.ArrGlyph[_glyph_index].createCopy(parent, _copy, this.ArrGlyph[_glyph_index].pH, this.ArrGlyph[_glyph_index].pV, _font_flag);

        }
        _copy.setContainer(container);
        return _copy;
    },


    createDuplicateForTrack : function(container)
    {
        var _duplicate = new GroupShape(this.parent);
        _duplicate.pH = this.pH;
        _duplicate.pV = this.pV;
        _duplicate.ext = {};
        _duplicate.ext.cx = this.ext.cx;
        _duplicate.ext.cy = this.ext.cy;
        _duplicate.off = {};
        _duplicate.off.x = 0;
        _duplicate.off.y = 0;
        _duplicate.rot = this.rot;
        _duplicate.flipH = this.flipH;
        _duplicate.flipV = this.flipV;
       // _duplicate.TransformMatrix = this.TransformMatrix.CreateDublicate();
        var _shapes = this.ArrGlyph;
        var _shape_count = _shapes.length;
        var _shape_index;
        for(_shape_index = 0; _shape_index < _shape_count; ++_shape_index)
        {
            _duplicate.ArrGlyph.push(_shapes[_shape_index].createDuplicateForTrack(_duplicate));
        }
        _duplicate.setContainer(container);
        return _duplicate;
    },

    setVerticalAlign : function(align)
    {
        var _shapes = this.ArrGlyph;
        var _shape_index;
        var _shape;
        for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
        {
            _shape = _shapes[_shape_index];
            if(_shape.setVerticalAlign)
            {
                _shape.setVerticalAlign(align);
            }
        }
    },

    getSelectionState : function()
    {
        var selectionState = {};
        selectionState.state = clone(this.State);
        this.updateSelectionMap();
        selectionState.selectionMap = clone(this.selectionMap);
        switch (this.State.id)
        {
            case 7 :
            {
                selectionState.obj = this.obj;
                selectionState.textSelectionState = this.obj.Get_SelectionState();
                break;
            }
            case 20 :
            {
                selectionState.group = this.group;
                selectionState.groupSelection = this.group.getSelectionState();
                break;
            }
        }
        return selectionState;
    },

    setSelectionState : function(selectionState)
    {
        this.State = selectionState.state;
        if(selectionState.selectionMap)
        {
            for(var i = 0; i < this.ArrGlyph.length; ++i)
            {
                this.ArrGlyph[i].selected = selectionState.selectionMap[i];
            }
        }
        switch (selectionState.state.id)
        {
            case 7 :
            {
                this.ChangeState(new AddTextState());
                this.Document.CurPos.Type = docpostype_FlowObjects;
                this.obj = selectionState.obj;
                this.obj.addTextFlag = true;
                this.DrawingDocument.UpdateTargetTransform(this.obj.TransformTextMatrix);
                if(selectionState.textSelectionState)
                {
                    this.obj.Set_SelectionState(selectionState.textSelectionState, selectionState.textSelectionState.length -1);
                }
                break;
            }
            case 20 :
            {
                this.ChangeState(new GroupState());
                this.group = selectionState.group;
                this.group.setSelectionState(selectionState.groupSelection);
                this.obj = this.group.obj;
                break;
            }
            default :
            {

                this.Document.CurPos.Type = docpostype_Content;
                for(var _shape_index = 0; _shape_index < this.ArrGlyph.length; ++_shape_index)
                {
                    this.ArrGlyph[_shape_index].addTextFlag = false;
                }
                this.ChangeState(new NullShapeState());
            }
        }
//        this.Document.Document_UpdateSelectionState();
    },


    Del: function()
    {
        if(this.State.id!=20 && this.NumSelected > 0)
        {
            History.Create_NewPoint();
            this.addHistorySelectedStateAfterDel();

            this.selectedCount();
            if(this.NumSelected == this.ArrGlyph.length)
            {
                var containerArrGlyph = this.Container.ArrGlyph;
                for(var i = 0; i < containerArrGlyph.length; ++i)
                {
                    if(containerArrGlyph[i] == this)
                    {
                        containerArrGlyph.splice(i, 1);
                        this.Container.ChangeState(new NullShapeState());
                        this.DrawingDocument.OnRecalculatePage(this.SlideNum, this.Document.Slides[this.SlideNum] );
                        this.DrawingDocument.OnEndRecalculate();

                        var historyData = {};
                        historyData.num = i;
                        historyData.undo_function = function(data)
                        {
                            this.Container.ArrGlyph.splice(data.num, 0, this);
                        };
                        historyData.redo_function = function(data)
                        {
                            this.Container.ArrGlyph.splice(data.num, 1);
                        };
                        History.Add(this, historyData);
                        return [this];
                    }
                }
            }

            if(this.NumSelected == this.ArrGlyph.length - 1)
            {
                var _arr_glyph = this.Container.ArrGlyph;
                for(var i = 0; i < _arr_glyph.length; ++i)
                {
                    if(_arr_glyph[i] == this)
                    {
                        for(var j = 0; j < this.ArrGlyph.length; ++j)
                        {
                            if(!this.ArrGlyph[j].selected)
                            {
                                var _shape = this.ArrGlyph[j];

                                var historyData = {};
                                historyData.numGroupInContainer = i;
                                historyData.container_group = this.Container.group;
                                historyData.container_obj = this.Container.obj;
                                historyData.shape = _shape;
                                historyData.old_rot = _shape.rot;
                                historyData.old_pH = _shape.pH;
                                historyData.old_pV = _shape.pV;
                                historyData.old_flipH = _shape.flipH;
                                historyData.old_flipV = _shape.flipV;


                                var _absolute_shape_xc, _absolute_shape_yc;
                                var _local_shape_xc, _local_shape_yc;
                                _local_shape_xc = _shape.pH + _shape.ext.cx*0.5;
                                _local_shape_yc = _shape.pV + _shape.ext.cy*0.5;

                                var _local_transform = new CMatrixL();
                                global_MatrixTransformer.TranslateAppend(_local_transform, this.pH, this.pV);
                                global_MatrixTransformer.TranslateAppend(_local_transform,-this.ext.cx*0.5,-this.ext.cy*0.5);

                                if(this.flipH)
                                {
                                    global_MatrixTransformer.ScaleAppend(_local_transform, -1, 1);
                                }
                                if(this.flipV)
                                {
                                    global_MatrixTransformer.ScaleAppend(_local_transform, 1, -1);
                                }

                                global_MatrixTransformer.RotateRadAppend(_local_transform, -this.rot);

                                global_MatrixTransformer.TranslateAppend(_local_transform, this.ext.cx*0.5, this.ext.cy*0.5);

                                _absolute_shape_xc = _local_transform.TransformPointX(_local_shape_xc, _local_shape_yc);
                                _absolute_shape_yc = _local_transform.TransformPointY(_local_shape_xc, _local_shape_yc);

                                var _new_absolute_pH, _new_absolute_pV;
                                _new_absolute_pH = _absolute_shape_xc - _shape.ext.cx*0.5;
                                _new_absolute_pV = _absolute_shape_yc - _shape.ext.cy*0.5;

                                var _new_flipH, _new_flipV;
                                _new_flipH = this.flipH ? !_shape.flipH : _shape.flipH;
                                _new_flipV = this.flipV ? !_shape.flipV : _shape.flipV;

                                var _new_rot;
                                _new_rot = this.rot + _shape.rot;
                                while(_new_rot < 0)
                                {
                                    _new_rot += 2*Math.PI;
                                }
                                while(_new_rot >= 2*Math.PI)
                                {
                                    _new_rot -= 2*Math.PI;
                                }

                                _shape.setContainer(this.Container);
                                _shape.rot = _new_rot;
                                _shape.pH = _new_absolute_pH;
                                _shape.pV = _new_absolute_pV;
                                _shape.flipH = _new_flipH;
                                _shape.flipV = _new_flipV;
                                _shape.selected = true;
                                _shape.Recalculate();
                                this.Container.ArrGlyph.splice(i, 1, _shape);
                                this.Container.ChangeState(new NullShapeState());
                                this.DrawingDocument.OnRecalculatePage( this.SlideNum, this.Document.Slides[this.SlideNum] );
                                this.DrawingDocument.OnEndRecalculate();

                                historyData.new_rot = _new_rot;
                                historyData.new_flipH = _new_flipH;
                                historyData.new_flipV = _new_flipV;
                                historyData.new_pH = _new_absolute_pH;
                                historyData.new_pV = _new_absolute_pV;

                                historyData.undo_function = function(data)
                                {
                                    data.shape.setContainer(this);
                                    data.shape.selected = false;
                                    data.shape.rot = data.old_rot;
                                    data.shape.pH = data.old_pH;
                                    data.shape.pV = data.old_pV;
                                    data.shape.flipH = data.old_flipH;
                                    data.shape.flipV = data.old_flipV;
                                    data.shape.Recalculate();

                                    this.Container.ArrGlyph.splice(data.numGroupInContainer, 1, this);
                                    this.Container.ChangeState(new GroupState());
                                    this.Container.group = data.container_group;
                                    this.Container.obj = data.container_obj;
                                    this.DrawingDocument.OnRecalculatePage( this.SlideNum, this.Document.Slides[this.SlideNum] );
                                    this.DrawingDocument.OnEndRecalculate();
                                };
                                historyData.redo_function = function(data)
                                {
                                    data.shape.setContainer(this.Container);
                                    data.shape.rot = data.new_rot;
                                    data.shape.flipH = data.new_flipH;
                                    data.shape.flipV = data.new_flipV;
                                    data.shape.pH = data.new_pH;
                                    data.shape.pV = data.new_pV;
                                    data.shape.Recalculate();

                                    this.Container.ArrGlyph.splice(data.numGroupInContainer, 1, data.shape);
                                    this.Container.ChangeState(new NullShapeState());
                                    this.DrawingDocument.OnRecalculatePage( this.SlideNum, this.Document.Slides[this.SlideNum] );
                                    this.DrawingDocument.OnEndRecalculate();
                                };
                                History.Add(this, historyData);

                                var _deleted_shapes = [];
                                for(var _shape_index = 0; _shape_index < j; ++_shape_index)
                                {
                                    _deleted_shapes.push(this.ArrGlyph[_shape_index]);
                                }
                                for(_shape_index = j+1; _shape_index < this.ArrGlyph.length; ++_shape_index)
                                {
                                    _deleted_shapes.push(this.ArrGlyph[_shape_index]);
                                }
                                return _deleted_shapes;
                            }
                        }
                    }
                }
                return;
            }


            var _history_obj = {};
            _history_obj.oldPosX = this.pH;
            _history_obj.oldPosY = this.pV;
            _history_obj.oldExtX = this.ext.cx;
            _history_obj.oldExtY = this.ext.cy;
            _history_obj.undo_function = function(data)
            {
                this.pH = data.oldPosX;
                this.pV = data.oldPosY;
                this.ext.cx = data.oldExtX;
                this.ext.cy = data.oldExtY;
                this.RecalculateAfterResize();

                var _tmp_container = this.Container;
                while(true)
                {
                    if(_tmp_container.IsGroup())
                    {
                        _tmp_container.RecalculateAfterResize();
                        _tmp_container = _tmp_container.Container;
                    }
                    else
                    {
                        break;
                    }
                }
            };
            _history_obj.redo_function = function(data)
            {};
            History.Add(this, _history_obj);

            var i=this.ArrGlyph.length;
            _deleted_shapes = [];
            while(i--)
            {
                if(this.ArrGlyph[i].selected)
                {
                    var _deleted_glyph = this.ArrGlyph.splice(i,1)[0];
                    _deleted_shapes.push(_deleted_glyph);
                    var historyData = {};
                    historyData.shape = _deleted_glyph;
                    historyData.num = i;
                    historyData.undo_function = function(data)
                    {
                        this.ArrGlyph.splice(data.num,0, data.shape);
                    };
                    historyData.redo_function = function(data)
                    {
                        this.ArrGlyph.splice(data.num,1);
                    };
                    History.Add(this,  historyData);
                    this.NumSelected--;
                }
            }
             this.RecalculateAfterResize();
            var _tmp_container = this.Container;
            while(true)
            {
                if(_tmp_container.IsGroup())
                {
                    _tmp_container.RecalculateAfterResize();
                    _tmp_container = _tmp_container.Container;
                }
                else
                {
                    break;
                }
            }
            _history_obj = {};
            _history_obj.newPosX = this.pH;
            _history_obj.newPosY = this.pV;
            _history_obj.newExtX = this.ext.cx;
            _history_obj.newExtY = this.ext.cy;
            _history_obj.redo_function = function(data)
            {
                this.pH = data.newPosX;
                this.pV = data.newPosY;
                this.ext.cx = data.newExtX;
                this.ext.cy = data.newExtY;
                this.RecalculateAfterResize();
                var _tmp_container = this.Container;
                while(true)
                {
                    if(_tmp_container.IsGroup())
                    {
                        _tmp_container.RecalculateAfterResize();
                        _tmp_container = _tmp_container.Container;
                    }
                    else
                    {
                        break;
                    }
                }
            };
            _history_obj.undo_function = function(data)
            {};
            History.Add(this, _history_obj);
            _deleted_shapes.reverse();
            this.DrawingDocument.OnRecalculatePage( this.SlideNum, this.Document.Slides[this.SlideNum] );
            this.DrawingDocument.OnEndRecalculate();
            return _deleted_shapes;
        }
        else  if(this.NumSelected > 0)
        {
            var _deleted_shapes = this.group.Del();
            this.DrawingDocument.OnRecalculatePage( this.SlideNum, this.Document.Slides[this.SlideNum] );
            this.DrawingDocument.OnEndRecalculate();
            return _deleted_shapes;
        }
    },

    RecalculateContent2: function()
    {

    },


    glyphsCopy : function()
    {
        var _glyphs_buffer = [];
        this.selectedCount();
        if(this.NumSelected > 0 && this.State.id == 0)
        {
            for(var _shape_index = 0; _shape_index < this.ArrGlyph.length; ++_shape_index)
            {
                if(this.ArrGlyph[_shape_index].selected)
                {
                    _glyphs_buffer.push(this.ArrGlyph[_shape_index].createFullCopy(this.parent, this));
                }
            }
        }
        if(this.State.id == 20)
        {
            _glyphs_buffer = this.group.glyphsCopy();
        }

        return _glyphs_buffer;
    },

    glyphsPaste : function(_font_flag)
    {
        if(this.Document.glyphsBuffer.length == 0)
        {
            return;
        }
        History.Create_NewPoint();
        var curPosX, curPosY;
        var _glyph_buffer = this.Document.glyphsBuffer;
        var _copy_glyph;
        var _cur_slide = this.Document.Slides[this.SlideNum];
        if(this.lastPastePosX == null || this.lastPastePosY == null)
        {
            curPosX = this.Document.glyphsBuffer[0].pH;
            curPosY = this.Document.glyphsBuffer[0].pV;
        }
        else
        {
            curPosX = this.lastPastePosX;
            curPosY = this.lastPastePosY;
        }

        var _history_obj = {};
        _history_obj.old_pastePosX = this.lastPastePosX;
        _history_obj.old_pastePosY = this.lastPastePosY;
        _history_obj.undo_function = function(data)
        {
            this.lastPastePosX = data.old_pastePosX;
            this.lastPastePosY = data.old_pastePosY;
        };
        _history_obj.redo_function = function(data)
        {};
        History.Add(this, _history_obj);

        var _glyph_index;
        for(_glyph_index = 0; _glyph_index < this.ArrGlyph.length; ++_glyph_index)
        {
            this.ArrGlyph[_glyph_index].selected = false;
        }


        for(_glyph_index = 0;  _glyph_index < _glyph_buffer.length; ++_glyph_index)
        {
            _copy_glyph = _glyph_buffer[_glyph_index].createCopy(_cur_slide, this, curPosX, curPosY, _glyph_buffer[_glyph_index].parent == this.Document.Slides[this.SlideNum]);
            _copy_glyph.calculate();
            _copy_glyph.selected = true;
            _copy_glyph.updateCursorTypes();

            var _slide = this.Document.Slides[this.SlideNum];

            this.ArrGlyph.push(_copy_glyph);

            _history_obj.glyphPos = this.ArrGlyph.length - 1;
            _history_obj.glyph = _copy_glyph;
            _history_obj.undo_function = function(data)
            {
                this.ArrGlyph.splice(data.glyphPos, 1);
            };
            _history_obj.redo_function = function(data)
            {
                this.ArrGlyph.splice(data.glyphPos, 0, data.glyph);
            };
            History.Add(this, _history_obj);

            if(_glyph_index + 1 <  _glyph_buffer.length)
            {
                curPosX += _glyph_buffer[_glyph_index + 1].pH - _glyph_buffer[_glyph_index].pH;
                curPosY += _glyph_buffer[_glyph_index + 1].pV - _glyph_buffer[_glyph_index].pV;
            }

        }
        this.lastPastePosX = curPosX+5;
        this.lastPastePosY = curPosY+5;
        this.RecalculateAfterResize();
        this.selectedCount();
        this.DrawingDocument.OnRecalculatePage(this.SlideNum, _cur_slide);
    },

    getCurDocumentContent : function()
    {
        return null;
    },

    paragraphAddTextPr :function(paraItem)
    {
        var _shapes = this.ArrGlyph;
        var _shape_index;
        var _cur_shape;
        for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
        {
            _cur_shape = _shapes[_shape_index];
            if(_cur_shape instanceof  CShape)
            {
                if(_cur_shape.txBody )
                {
                    if(_cur_shape.txBody.content)
                    {
                        _cur_shape.txBody.content.Set_ApplyToAll(true);
                        _cur_shape.txBody.content.Paragraph_Add(paraItem);
                        _cur_shape.txBody.content.Set_ApplyToAll(false);
                    }
                    if(_cur_shape.txBody.content2)
                    {
                        _cur_shape.txBody.content2.Set_ApplyToAll(true);
                        _cur_shape.txBody.content2.Paragraph_Add(paraItem);
                        _cur_shape.txBody.content2.Set_ApplyToAll(false);
                    }
                    _cur_shape.txBody.recalculate();
                }
            }
            if(_cur_shape instanceof  GroupShape)
            {
                _cur_shape.paragraphAddTextPr(paraItem);
            }
        }
    },

    setParagraphNumbering: function(NumInfo)
    {
        var _shapes = this.ArrGlyph;
        var _shape_index;
        var _shape;
        for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
        {
            _shape = _shapes[_shape_index];
            if(_shape instanceof  CShape)
            {
                if(_shape.txBody )
                {
                    if(_shape.txBody.content)
                    {
                        _shape.txBody.content.Set_ApplyToAll(true);
                        _shape.txBody.content.Set_ParagraphNumbering(NumInfo);
                        _shape.txBody.content.Set_ApplyToAll(false);
                    }
                    if(_shape.txBody.content2)
                    {
                        _shape.txBody.content2.Set_ApplyToAll(true);
                        _shape.txBody.content2.Set_ParagraphNumbering(NumInfo);
                        _shape.txBody.content2.Set_ApplyToAll(false);
                    }
                }
            }
            if(_shape instanceof GroupShape)
            {
                _shape.setParagraphNumbering(NumInfo);
            }
        }
    },

    setParagraphAlign : function(align)
    {
        var _shapes = this.ArrGlyph;
        var _shape_index;
        var _shape;
        for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
        {
            _shape = _shapes[_shape_index];
            if(_shape instanceof  CShape)
            {
                if(_shape.txBody )
                {
                    if(_shape.txBody.content)
                    {
                        _shape.txBody.content.Set_ApplyToAll(true);
                        _shape.txBody.content.Set_ParagraphAlign(align);
                        _shape.txBody.content.Set_ApplyToAll(false);
                    }
                    if(_shape.txBody.content2)
                    {
                        _shape.txBody.content2.Set_ApplyToAll(true);
                        _shape.txBody.content2.Set_ParagraphAlign(align);
                        _shape.txBody.content2.Set_ApplyToAll(false);
                    }
                    _shape.txBody.recalculate();
                }
            }
            if(_shape instanceof GroupShape)
            {
                _shape.setParagraphAlign(align);
            }
        }
    },

    setParagraphSpacing : function(spacing)
    {
        var _shapes = this.ArrGlyph;
        var _shape_index;
        var _shape;
        for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
        {
            _shape = _shapes[_shape_index];
            if(_shape instanceof  CShape)
            {
                if(_shape.txBody )
                {
                    if(_shape.txBody.content)
                    {
                        _shape.txBody.content.Set_ApplyToAll(true);
                        _shape.txBody.content.Set_ParagraphSpacing(spacing);
                        _shape.txBody.content.Set_ApplyToAll(false);
                    }
                    if(_shape.txBody.content2)
                    {
                        _shape.txBody.content2.Set_ApplyToAll(true);
                        _shape.txBody.content2.Set_ParagraphSpacing(spacing);
                        _shape.txBody.content2.Set_ApplyToAll(false);
                    }
                    _shape.txBody.recalculate();
                }
            }
            if(_shape instanceof GroupShape)
            {
                _shape.setParagraphSpacing(spacing);
            }
        }
    },


    IncDecFontSize : function(bIncrease)
    {

        var _shapes = this.ArrGlyph;
        var _shape_index;
        var _shape;
        for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
        {
            _shape = _shapes[_shape_index];
            if(_shape instanceof  CShape)
            {
                if(_shape.txBody )
                {
                    if(_shape.txBody.content)
                    {
                        _shape.txBody.content.Set_ApplyToAll(true);
                        _shape.txBody.content.Paragraph_IncDecFontSize(bIncrease);
                        _shape.txBody.content.Set_ApplyToAll(false);
                    }
                    if(_shape.txBody.content2)
                    {
                        _shape.txBody.content2.Set_ApplyToAll(true);
                        _shape.txBody.content2.Paragraph_IncDecFontSize(bIncrease);
                        _shape.txBody.content2.Set_ApplyToAll(false);
                    }
                    _shape.txBody.recalculate();
                }
            }
            if(_shape instanceof GroupShape)
            {
                _shape.IncDecFontSize(bIncrease);
            }
        }
    },

    getParagraphParaPr : function()
    {
        var _result_para_pr = null;
        var _child_index;
        var _arr_shapes = this.ArrGlyph;
        var _cur_para_pr;
        var _child_shape;
        for(_child_index = 0; _child_index < _arr_shapes.length; ++_child_index)
        {
            _child_shape = _arr_shapes[_child_index];
            if((_child_shape instanceof CShape) || (_child_shape instanceof GroupShape))
            {
                if(_child_shape instanceof CShape && _child_shape.txBody && _child_shape.txBody.content)
                {
                    _child_shape.txBody.content.Set_ApplyToAll(true);
                    _cur_para_pr = _child_shape.txBody.content.Get_Paragraph_ParaPr();
                    _child_shape.txBody.content.Set_ApplyToAll(false);
                }
                if(_child_shape instanceof GroupShape)
                {
                    _cur_para_pr = _child_shape.getParagraphParaPr();
                }

                if(_result_para_pr === null || _result_para_pr === undefined)
                {
                    _result_para_pr = _cur_para_pr;
                }
                else
                {
                    _result_para_pr = _result_para_pr.Compare(_cur_para_pr);
                }
            }
        }

        if(_result_para_pr !== null)
        {
            return _result_para_pr;
        }
        else
        {
            var _empty_para_pr =  new CParaPr();

            _empty_para_pr.Ind               = { Left : UnknownValue, Right : UnknownValue, FirstLine : UnknownValue };
            _empty_para_pr.Jc                = UnknownValue;
            _empty_para_pr.Spacing           = { Line : UnknownValue, LineRule : UnknownValue, Before : UnknownValue, After : UnknownValue, AfterAutoSpacing : UnknownValue, BeforeAutoSpacing : UnknownValue };
            _empty_para_pr.PageBreakBefore   = UnknownValue;
            _empty_para_pr.KeepLines         = UnknownValue;
            _empty_para_pr.ContextualSpacing = UnknownValue;
            _empty_para_pr.Shd               = UnknownValue;
            _empty_para_pr.StyleId           = -1;
            _empty_para_pr.NumPr             = null;
            _empty_para_pr.Brd               =
            {
                Between : null,
                Bottom  : null,
                Left    : null,
                Right   : null
            };

            _empty_para_pr.ListType =
            {
                Type: -1,
                SubType: -1
            };
            return  _empty_para_pr;
        }
    },

    getParagraphTextPr : function()
    {
        var _result_para_pr = null;
        var _child_index;
        var _arr_shapes = this.ArrGlyph;
        var _cur_para_pr;
        var _child_shape;
        for(_child_index = 0; _child_index < _arr_shapes.length; ++_child_index)
        {
            _child_shape = _arr_shapes[_child_index];
            if((_child_shape instanceof CShape) || (_child_shape instanceof GroupShape))
            {
                if(_child_shape instanceof CShape && _child_shape.txBody && _child_shape.txBody.content)
                {
                    _child_shape.txBody.content.Set_ApplyToAll(true);
                    _cur_para_pr = _child_shape.txBody.content.Get_Paragraph_TextPr();
                    _child_shape.txBody.content.Set_ApplyToAll(false);
                }
                if(_child_shape instanceof GroupShape)
                {
                    _cur_para_pr = _child_shape.getParagraphTextPr();
                }

                if(_result_para_pr === null || _result_para_pr === undefined)
                {
                    _result_para_pr = _cur_para_pr;
                }
                else
                {
                    _result_para_pr = _result_para_pr.Compare( _cur_para_pr );
                }
            }
        }

        if(_result_para_pr !== null)
        {
            return _result_para_pr;
        }
        else
        {
            var _empty_text_pr = new CTextPr();

            _empty_text_pr.Bold       = false;
            _empty_text_pr.Italic     = false;
            _empty_text_pr.Underline  = false;
            _empty_text_pr.Strikeout  = false;
            _empty_text_pr.FontSize   = "";
            _empty_text_pr.FontFamily = {Index : 0, Name : ""};
            _empty_text_pr.VertAlign  = vertalign_Baseline;
            _empty_text_pr.Color      = new CDocumentColor(0, 0, 0);
            _empty_text_pr.HighLight  = highlight_None;
            return _empty_text_pr;
        }
    },

    changeSizes : function(kW, kH)
    {
        var glyphs = this.ArrGlyph;

        var hc = this.ext.cx*0.5;
        var vc = this.ext.cy*0.5;
        var oldXc = hc/kW;
        var oldYc = vc/kH;
        for(var i = 0, n = glyphs.length; i< n; ++i)
        {
            var glyph = glyphs[i];
            var rot = glyph.rot;

            var oldGlXc = glyph.pH + glyph.ext.cx*0.5;
            var oldGlYc = glyph.pV + glyph.ext.cy*0.5;
            if(rot<Math.PI*0.25||rot>Math.PI*1.75 ||
                (rot>Math.PI*0.75&&rot<Math.PI*1.25))
            {

                glyph.changeSizes(kW, kH);
                if(glyph.IsGroup())
                {
                    glyph.ext.cx*=kW;
                    glyph.ext.cy*=kH;
                }

            }
            else
            {
                glyph.changeSizes(kH, kW);
                if(glyph.IsGroup())
                {
                    glyph.ext.cy*=kW;
                    glyph.ext.cx*=kH;
                }
            }
            glyph.pH = (oldGlXc-oldXc)*kW + hc - glyph.ext.cx*0.5;
            glyph.pV = (oldGlYc-oldYc)*kH + vc - glyph.ext.cy*0.5;
            glyph.Recalculate();
        }
    },

    changeProportions: function(kW, kH)
    {
        var _rot = this.rot == null ? ((this.spPr.xfrm.rot == null) ? 0 : this.spPr.xfrm.rot) : this.rot ;
        var _objects = this.ArrGlyph;
        var _object_index;
        var _object_count = this.ArrGlyph.length;
        if(_rot<Math.PI*0.25||_rot>Math.PI*1.75 ||
            (_rot > Math.PI*0.75 && _rot < Math.PI*1.25))
        {
            if(this.spPr.xfrm.offX !== null)
            {
                this.spPr.xfrm.offX*=kW;
                this.spPr.xfrm.offY*=kH;
                this.spPr.xfrm.extX*=kW;
                this.spPr.xfrm.extY*=kH;
                this.spPr.xfrm.chOffX*=kW;
                this.spPr.xfrm.chOffY*=kH;
                this.spPr.xfrm.chExtX*=kW;
                this.spPr.xfrm.chExtY*=kH;

            }

            this.pH *= kW;
            this.pV *= kH;
            if(this.ext !== null && typeof this.ext === "object")
            {
                this.ext.cx *= kW;
                this.ext.cy *= kH;
            }
            for(_object_index = 0; _object_index < _object_count; ++_object_index)
            {
                if(typeof _objects[_object_index].changeProportions === "function")
                {
                    _objects[_object_index].changeProportions(kW, kH);
                }
            }
        }
        else
        {
            if(this.spPr.xfrm.offX !== null)
            {
                this.spPr.xfrm.offX*=kW;
                this.spPr.xfrm.offY*=kH;
                this.spPr.xfrm.extX*=kH;
                this.spPr.xfrm.extY*=kW;
                this.spPr.xfrm.chOffX*=kH;
                this.spPr.xfrm.chOffY*=kW;
                this.spPr.xfrm.chExtX*=kH;
                this.spPr.xfrm.chExtY*=kW;
            }

            this.pH *= kW;
            this.pV *= kH;
            if(this.ext !== null && typeof this.ext === "object")
            {
                this.ext.cx *= kH;
                this.ext.cy *= kW;
            }
            for(_object_index = 0; _object_index < _object_count; ++_object_index)
            {
                if(typeof _objects[_object_index].changeProportions === "function")
                {
                    _objects[_object_index].changeProportions(kH, kW);
                }
            }
        }
    },

    setParent : function(parent)
    {
        this.parent = parent;
        for(var i = 0; i <this.ArrGlyph.length; ++i)
        {
            this.ArrGlyph[i].setParent(parent);
        }
    },


    setContainer : function(container)
    {
        this.Container = container;
        for(var i = 0; i <this.ArrGlyph.length; ++i)
        {
            this.ArrGlyph[i].setContainer(this);
        }
    },

    merge : function(a)
    {},

    calculate2 : function()
    {
        /*if(this.isPlaceholder())
        {
            var phIdx = this.nvSpPr.nvPr.ph.idx, phType = this.nvSpPr.nvPr.ph.type;
            switch(this.parent.kind)
            {
                case SLIDE_KIND :
                {
                    var duplicate =  this.createDuplicate2(this.parent, this.Container);
                    this.merge(this.parent.Layout.Master.getMatchingShape(phType, phIdx));
                    this.merge(this.parent.Layout.getMatchingShape(phType, phIdx));
                    this.merge(duplicate);
                    break;
                }
                case LAYOUT_KIND :
                {
                    duplicate =  this.createDuplicate2(this.parent, this.Container);
                    this.merge(this.parent.Master.getMatchingShape(phType, phIdx));
                    this.merge(duplicate);
                    break;
                }
            }
        }

        if(this.spPr.Geometry!=null)
        {
            this.geometry = this.spPr.Geometry;
        }

        if(this.spPr.xfrm.offX!=null)
        {
            this.pH = this.spPr.xfrm.offX;
        }
        else
        {
            this.pH = 0;
        }

        if(this.spPr.xfrm.offY!=null)
        {
            this.pV = this.spPr.xfrm.offY;
        }
        else
        {
            this.pV = 0;
        }

        this.ext = {};
        this.off = {x: 0, y:0};
        if(this.spPr.xfrm.extX!=null)
        {
            this.ext.cx = this.spPr.xfrm.extX;
        }
        else
        {
            this.ext.cx = 0;
        }
        if(this.spPr.xfrm.extY!=null)
        {
            this.ext.cy = this.spPr.xfrm.extY;
        }
        else
        {
            this.ext.cy = 0;
        }

        if(this.spPr.xfrm.flipH!=null)
        {
            this.flipH = this.spPr.xfrm.flipH;
        }
        else
        {
            this.flipH = false;
        }

        if(this.spPr.xfrm.flipV!=null)
        {
            this.flipV = this.spPr.xfrm.flipV;
        }
        else
        {
            this.flipV = false;
        }

        if(this.spPr.xfrm.rot!=null)
        {
            this.rot = this.spPr.xfrm.rot;
        }
        else
        {
            this.rot = 0;
        }    */
        var _shapes = this.ArrGlyph;
        var _shape_index;
        var _shape;
        for(_shape_index = 0; _shape_index < _shapes.length; ++ _shape_index)
        {
            _shape = _shapes[_shape_index];
            if(_shape instanceof GroupShape)
            {
                _shape.calculate2();
            }
            if(_shape instanceof CShape)
            {
                _shape.calculateFill();
                _shape.calculateLine();
                _shape.calculateText();
                _shape.Recalculate();
            }
            if(_shape instanceof CImage2)
            {
                _shape.calculateFill();
                _shape.calculateLine();
                _shape.calculateText();
                _shape.Recalculate();
            }
        }
    },

    resetState : function()
    {
        switch(this.State.id)
        {
            case 20:
            {
                this.group.resetState();
                this.group.selected = false;
                this.ChangeState(new NullShapeState());
                this.DrawingDocument.m_oWordControl.OnUpdateOverlay(false);
                break;
            }
            case 7 :
            {
                this.Document.CurPos.Type = docpostype_Content;
                this.Document.RecalculateCurPos();
                this.Document.Document_UpdateSelectionState();
                this.obj.selected = false;
                this.obj.addTextFlag = false;
                this.DrawingDocument.m_oWordControl.OnUpdateOverlay(false);
                this.ChangeState(new NullShapeState());
                break;
            }
            default :
            {
                for(var i = 0; i < this.ArrGlyph.length; ++i)
                {
                    this.ArrGlyph[i].selected = false;
                }
                this.Document.DrawingDocument.m_oWordControl.OnUpdateOverlay(false);
                this.ChangeState(new NullShapeState());
                break;
            }

        }
    },

    prepareToChangeTheme : function(layout)
    {
        this.spPr.xfrm.offX = this.pH;
        this.spPr.xfrm.offY = this.pV;

        this.spPr.xfrm.extX = this.ext.cx;
        this.spPr.xfrm.extY = this.ext.cy;
        for(var i = 0; i < this.ArrGlyph.length; ++i)
        {
            this.ArrGlyph[i].prepareToChangeTheme(layout);
        }
    },

    prepareToChangeTheme2 : function()
    {
        for(var i = 0; i < this.ArrGlyph.length; ++i)
        {
            this.ArrGlyph[i].prepareToChangeTheme2();
        }
    },

    copyTransform : function(group)
    {

        var historyData = {};
        historyData.old_ext = clonePrototype(this.ext);
        historyData.old_off = clonePrototype(this.off);
        historyData.old_pH = this.pH;
        historyData.old_pV = this.pV;
        historyData.old_flipH = this.flipH;
        historyData.old_flipV = this.flipV;

        historyData.new_ext = clonePrototype(group.ext);
        historyData.new_off = clonePrototype(group.off);
        historyData.new_pH = group.pH;
        historyData.new_pV = group.pV;
        historyData.new_flipH = group.flipH;
        historyData.new_flipV = group.flipV;

        historyData.undo_function = function(data)
        {
            this.ext = clonePrototype(data.old_ext);
            this.off = clonePrototype(data.old_off);
            this.pH = data.old_pH;
            this.pV = data.old_pV;
            this.flipH = data.old_flipH;
            this.flipV = data.old_flipV;
            this.Recalculate();

            this.updateCursorTypes();
        };

        historyData.redo_function = function(data)
        {
            this.ext = clonePrototype(data.new_ext);
            this.off = clonePrototype(data.new_off);
            this.pH = data.new_pH;
            this.pV = data.new_pV;
            this.flipH = data.new_flipH;
            this.flipV = data.new_flipV;
            this.Recalculate();

            this.updateCursorTypes();
        };

        History.Add(this, historyData);
        this.pH = group.pH;
        this.pV = group.pV;
        this.ext = clonePrototype(group.ext);
        this.off = clonePrototype(group.off);
        this.flipH = group.flipH;
        this.flipV = group.flipV;

        for(var i = 0; i < this.ArrGlyph.length; ++i)
        {
            if(this.ArrGlyph[i].IsGroup())
            {
                this.ArrGlyph[i].copyTransform(group.ArrGlyph[i]);
            }
            else
            {
                historyData = {};
                historyData.old_ext = clonePrototype(this.ArrGlyph[i].ext);
                historyData.old_off = clonePrototype(this.ArrGlyph[i].off);
                historyData.old_pH = this.ArrGlyph[i].pH;
                historyData.old_pV = this.ArrGlyph[i].pV;

                historyData.new_ext = clonePrototype(group.ArrGlyph[i].ext);
                historyData.new_off = clonePrototype(group.ArrGlyph[i].off);
                historyData.new_pH = group.ArrGlyph[i].pH;
                historyData.new_pV = group.ArrGlyph[i].pV;

                historyData.undo_function = function(data)
                {
                    this.ext = clonePrototype(data.old_ext);
                    this.off = clonePrototype(data.old_off);
                    this.pH = data.old_pH;
                    this.pV = data.old_pV;
                    this.Recalculate();

                    this.updateCursorTypes();
                };

                historyData.redo_function = function(data)
                {
                    this.ext = clonePrototype(data.new_ext);
                    this.off = clonePrototype(data.new_off);
                    this.pH = data.new_pH;
                    this.pV = data.new_pV;
                    this.Recalculate();

                    this.updateCursorTypes();
                };
                History.Add(this.ArrGlyph[i], historyData);

                this.ArrGlyph[i].pH = group.ArrGlyph[i].pH;
                this.ArrGlyph[i].pV = group.ArrGlyph[i].pV;
                this.ArrGlyph[i].ext = clonePrototype(group.ArrGlyph[i].ext);
                this.ArrGlyph[i].off = clonePrototype(group.ArrGlyph[i].off);
            }
        }
    },

    Save_Changes : function(Data, Writer)
    {

    },

    createDuplicate : function(parent, container)
    {
        var duplicate = new GroupShape(parent);
        duplicate.Container = container;
        duplicate.grpSpPr = this.grpSpPr.createDuplicate();
        if(this.nvGrpSpPr!=null)
        {
            duplicate.nvGrpSpPr = this.nvGrpSpPr.createDuplicate();
        }
        for(var i=0; i<this.ArrGlyph.length; ++i)
        {
            duplicate.ArrGlyph[i] = this.ArrGlyph[i].createDuplicate(parent, duplicate);
        }
        return duplicate;
    },

    init: function()
    {

    },

    calculate: function()
    {
        if(this.parent.kind == SLIDE_KIND)
        {
            this.SlideNum = this.parent.num;
            if(this.parent.Layout && this.parent.Layout.Master)
            {
                this.Document = this.parent.Layout.Master.presentation;
                this.DrawingDocument = this.Document.DrawingDocument;
            }
        }

        var _xfrm = new CXfrm();
        if(this.isPlaceholder())
        {
            var _ph_index = this.nvGrpSpPr.nvPr.ph.idx;
            var _ph_type = this.nvGrpSpPr.nvPr.ph.type;
            var _master_shape = null, _layout_shape = null;
            switch (this.parent.kind)
            {
                case SLIDE_KIND:
                {
                    if(this.parent.Layout != null)
                    {
                        _layout_shape = this.parent.Layout.getMatchingShape(_ph_type, _ph_index);
                        if(this.parent.Layout.Master != null)
                        {
                            _master_shape = this.parent.Layout.Master.getMatchingShape(_ph_type, _ph_index);
                        }
                    }
                    if(_master_shape != null && _master_shape.spPr && _master_shape.spPr.xfrm)
                    {
                        _xfrm.merge(_master_shape.spPr.xfrm)
                    }
                    if(_layout_shape != null && _layout_shape.spPr && _layout_shape.spPr.xfrm)
                    {
                        _xfrm.merge(_layout_shape.spPr.xfrm)
                    }
                    break;
                }
                case LAYOUT_KIND:
                {
                    if(this.parent.Master != null)
                    {
                        _master_shape = this.parent.Master.getMatchingShape(_ph_type, _ph_index);
                    }
                    if(_master_shape != null && _master_shape.spPr && _master_shape.spPr.xfrm)
                    {
                        _xfrm.merge(_master_shape.spPr.xfrm)
                    }
                    break;
                }
                case MASTER_KIND:
                {
                    break;
                }
            }
        }

        _xfrm.merge(this.spPr.xfrm);
        var scaleX, scaleY;
        var xfrm= null;

        this.brush = new CUniFill();
        this.pen = new CLn();
        if(this.Container instanceof  GroupShape)
        {
            this.brush.merge(this.Container.brush);
            this.pen.merge(this.Container.pen);
        }
        this.brush.merge(this.grpSpPr.Fill);
        this.pen.merge(this.grpSpPr.ln);

        if(_xfrm.offX == null)
        {
            _xfrm.offX = 0;
            _xfrm.offY = 0;
            _xfrm.chOffX = 0;
            _xfrm.chOffY = 0;
            _xfrm.extX = 10;
            _xfrm.extY = 10;
            _xfrm.chExtX = 10;
            _xfrm.chExtY = 10;
        }
        //xfrm = this.grpSpPr.xfrm;
        this.off = {x:0, y:0};
        this.pH = _xfrm.offX;
        this.pV = _xfrm.offY;
        this.ext = {};
        this.ext.cx = _xfrm.extX;
        this.ext.cy = _xfrm.extY;
        this.flipH = _xfrm.flipH;
        this.flipV = _xfrm.flipV;
        if(_xfrm.rot != null)
        {
            this.rot = _xfrm.rot;
        }
        else
        {
            this.rot = 0;
        }
        if(_xfrm != null)
        {
            if(_xfrm.chExtX != 0)
                scaleX = _xfrm.extX/_xfrm.chExtX;
            else
                scaleX = 1;

            if(_xfrm.chExtY != 0)
                scaleY = _xfrm.extY/_xfrm.chExtY;
            else
                scaleY = 1;

            for(var i = 0; i < this.ArrGlyph.length; ++i)
            {
                var shape = this.ArrGlyph[i];
                if(shape.IsGroup())
                {
                    var pr = shape.grpSpPr;
                }
                else
                {
                    pr = shape.spPr;
                }

                if(pr.xfrm)
                {
                   /*var t_rot = pr.xfrm.rot == null ? 0 :  pr.xfrm.rot;
                    var sin = Math.sin(t_rot);
                    var cos = Math.cos(t_rot);
                    var mX, mY;
                    mX = cos*scaleX - sin*scaleY;
                    mY = sin*scaleX + cos*scaleY;    */
                   /* if(t_rot<Math.PI/4||t_rot>Math.PI*7/4 ||
                        (t_rot>Math.PI*3/4 && t_rot<Math.PI*5/4))
                    {
                        pr.xfrm.extX *= scaleX;
                        pr.xfrm.extY *= scaleY;
                        pr.xfrm.offX = scaleX * (pr.xfrm.offX - xfrm.chOffX );
                        pr.xfrm.offY = scaleY * (pr.xfrm.offY - xfrm.chOffY );
                    }
                    else
                    {
                        pr.xfrm.extX *= scaleY;
                        pr.xfrm.extY *= scaleX;
                        pr.xfrm.offX = scaleX * (pr.xfrm.offX - xfrm.chOffX );
                        pr.xfrm.offY = scaleY * (pr.xfrm.offY - xfrm.chOffY );
                    }   */

                    var _old_xfrm = pr.xfrm.createDuplicate();
                    pr.xfrm.extX *= scaleX;
                    pr.xfrm.extY *= scaleY;
                    pr.xfrm.offX = scaleX * (pr.xfrm.offX - _xfrm.chOffX );
                    pr.xfrm.offY = scaleY * (pr.xfrm.offY - _xfrm.chOffY );
                }

                shape.calculate();
                if(pr.xfrm)
                {
                    pr.xfrm = _old_xfrm;
                }
            }
        }
        this.RecalculateTransformMatrix();
        this.updateCursorTypes();
    },


    changePresetGeometry : function(sPreset)
    {

    },


    calculateXfrm: function()
    {
        var _old_xfrm;
        var _history_data = {};
        if(this.spPr.xfrm != null)
        {
            _old_xfrm = this.spPr.xfrm.createDuplicate();
        }
        else
        {
            _old_xfrm = new CXfrm();
        }


       // this.spPr.xfrm = new CXfrm();
    //    this.spPr.xfrm
        for(var _shape_index = 0; _shape_index < this.ArrGlyph.length; ++_shape_index)
        {
            this.ArrGlyph[_shape_index].calculateXfrm();
        }
    },

    getTransform : function()
    {
        /*var  hc, vc;
        hc = this.ext.cx*0.5;
        vc = this.ext.cy*0.5;

        var xc, yc;
        xc = this.pH + this.off.x + hc;
        yc = this.pV + this.off.y + vc;

        var localTransform = new CMatrix();

        localTransform.Translate(-xc,-yc, 1);
        if(this.flipH)
        {
            localTransform.Scale(-1,1, 1);
        }
        if(this.flipV)
        {
            localTransform.Scale(1, -1, 1);
        }
        var r=rad2deg(this.rot);
        localTransform.RotateAt(-r, 0, 0, 1);
        localTransform.Translate(xc, yc, 1);
        localTransform.Translate(this.pH, this.pV, 0); */

        var localTransform = this.getLocalTransform();
        global_MatrixTransformer.MultiplyAppend(localTransform, this.Container.getTransform());
        return localTransform;
    },

    getLocalTransform: function()
    {
        var  hc, vc;
        hc = this.ext.cx*0.5;
        vc = this.ext.cy*0.5;

        var xc, yc;
        xc = this.pH + this.off.x + hc;
        yc = this.pV + this.off.y + vc;

        var localTransform = new CMatrixL();
        global_MatrixTransformer.TranslateAppend(localTransform, this.pH, this.pV);
        global_MatrixTransformer.TranslateAppend(localTransform, -xc, -yc);

        if(this.flipH)
        {
            global_MatrixTransformer.ScaleAppend(localTransform, -1, 1);
        }
        if(this.flipV)
        {
            global_MatrixTransformer.ScaleAppend(localTransform, 1, -1);
        }

        global_MatrixTransformer.RotateRadAppend(localTransform, -this.rot);

        global_MatrixTransformer.TranslateAppend(localTransform, xc, yc);
        return localTransform;
    },

    DrawOnOverlay: function(graphics)
    {
        if(this.State.id == 20)
        {
            this.group.DrawOnOverlay(graphics);

        }
        else
        {
            //this.Draw();
            var trackObjects = this.ArrTrackObj;
            for(var i= 0, n = trackObjects.length; i < n; ++i)
            {
                trackObjects[i].obj.DrawInTrack(graphics);
            }
        }
    },


    getAspect : function(num)
    {
        var cx = this.ext.cx != 0 ? this.ext.cx : 0.1;
        var cy = this.ext.cy != 0 ? this.ext.cy : 0.1;
        if(!this.flipH&&!this.flipV || this.flipH&&this.flipV)
        {
            switch(num)
            {
                case 0:
                case 4:
                {
                    return cx/cy;
                }

                case 2:
                case 6:
                {
                    return cy/cx;
                }
            }
        }
        else
        {
            switch(num)
            {
                case 2:
                case 6:
                {
                    return cx/cy;
                }

                case 0:
                case 4:
                {
                    return cy/cx;
                }

            }
        }
    },

    calculateColors : function(theme)
    {
        for(var i=0; i<this.ArrGlyph.length; ++i)
        {
            this.ArrGlyph[i].calculateColors();
        }
    },

    isPlaceholder : function()
    {
        return this.nvGrpSpPr != null && this.nvGrpSpPr.nvPr != undefined && this.nvGrpSpPr.nvPr.ph != undefined;
    },

    isPlaceholder : function()
    {
        return this.nvGrpSpPr != null && this.nvGrpSpPr.nvPr != undefined && this.nvGrpSpPr.nvPr.ph != undefined;
    },

    getPhType : function()
    {
        if(this.isPlaceholder())
        {
            return this.nvGrpSpPr.nvPr.ph.type;
        }
        else
        {
            return null;
        }
    },

    getXfrm : function ()
    {
        if(this.parent.kind != SLIDE_KIND)
        {
            return this.spPr.xfrm;
        }
        var _xfrm = new CXfrm();
        if(this.spPr.xfrm != null && this.spPr.xfrm.offX!=null)
        {
            _xfrm.offX = this.pH;
            _xfrm.offY = this.pV;
            _xfrm.extX = this.ext.cx;
            _xfrm.extY = this.ext.cy;
            _xfrm.chOffX = 0;
            _xfrm.chOffY = 0;
            _xfrm.chExtX = this.ext.cx;
            _xfrm.chExtY = this.ext.cy;
            _xfrm.flipH = this.flipH;
            _xfrm.flipV = this.flipV;
            _xfrm.rot = this.rot;
            return _xfrm;
        }/*
        else if(this.isPlaceholder())
        {
            var _phType, _phIdx;
            _phType = this.nvSpPr.nvPr.ph.type;
            _phIdx = this.nvSpPr.nvPr.ph.idx;
            var  _master_shape = this.parent.Layout.Master.getMatchingShape(_phType, _phIdx);
            var _layout_shape = this.parent.Layout.getMatchingShape(_phType, _phIdx);
            if(_master_shape && _master_shape.spPr && _master_shape.spPr.xfrm)
            {
                _xfrm.merge(_master_shape.spPr.xfrm)
            }
            if(_layout_shape && _layout_shape.spPr && _layout_shape.spPr.xfrm)
            {
                _xfrm.merge(_layout_shape.spPr.xfrm)
            }
            if(this.ext.cx == _xfrm.extX && this.ext.cy == _xfrm.extY && this.pH == _xfrm.offX && this.pV == _xfrm.offY
                && (this.rot == 0 ? (_xfrm.rot == 0 || _xfrm.rot == undefined) : _xfrm.rot == this.rot)
                && (this.flipH == 0 ? (_xfrm.flipH == 0 || _xfrm.flipH == undefined) : _xfrm.flipH == this.flipH)
                && (this.flipV == 0 ? (_xfrm.flipV == 0 || _xfrm.flipV == undefined) : _xfrm.flipH == this.flipV))
            {
                return _xfrm;
            }
            else
            {
                _xfrm.offX = this.pH;
                _xfrm.offY = this.pV;
                _xfrm.extX = this.ext.cx;
                _xfrm.extY = this.ext.cy;
                _xfrm.chOffX = 0;
                _xfrm.chOffY = 0;
                _xfrm.chExtX = this.ext.cx;
                _xfrm.chExtY = this.ext.cy;
                _xfrm.flipH = this.flipH;
                _xfrm.flipV = this.flipV;
                _xfrm.rot = this.rot;
                return _xfrm;
            }
        }*/
        else
        {
            _xfrm.offX = this.pH;
            _xfrm.offY = this.pV;
            _xfrm.extX = this.ext.cx;
            _xfrm.extY = this.ext.cy;
            _xfrm.chOffX = 0;
            _xfrm.chOffY = 0;
            _xfrm.chExtX = this.ext.cx;
            _xfrm.chExtY = this.ext.cy;
            _xfrm.flipH = this.flipH;
            _xfrm.flipV = this.flipV;
            _xfrm.rot = this.rot;
            return _xfrm;
        }
        return null;
    },

    OnMouseDown : function(e, X, Y)
    {
        var relativePoint = this.GetPointRelativeShape(X, Y);
        if(this.flipH)
        {
            relativePoint.x = this.ext.cx-relativePoint.x;
        }
        if(this.flipV)
        {
            relativePoint.y = this.ext.cy-relativePoint.y;
        }
        this.State.OnMouseDown(this, e, relativePoint.x, relativePoint.y);
    },
    OnMouseMove : function(e, X, Y)
    {
        var relativePoint = this.GetPointRelativeShape(X, Y);
        if(this.flipH)
        {
            relativePoint.x = this.ext.cx-relativePoint.x;
        }
        if(this.flipV)
        {
            relativePoint.y = this.ext.cy-relativePoint.y;
        }
        this.State.OnMouseMove(this, e, relativePoint.x, relativePoint.y);
    },
    OnMouseUp : function(e, X, Y)
    {
        var relativePoint = this.GetPointRelativeShape(X, Y);
        if(this.flipH)
        {
            relativePoint.x = this.ext.cx-relativePoint.x;
        }
        if(this.flipV)
        {
            relativePoint.y = this.ext.cy-relativePoint.y;
        }
        this.State.OnMouseUp(this, e, relativePoint.x, relativePoint.y);
    },


    selectInGroup: function(transformMatrix, grphics)
    {
        if(this.State.id == 20)
        {
            global_MatrixTransformer.MultiplyPrepend(transformMatrix, glyphs[i].TransformMatrix);
            this.group.selectInGroup(transformMatrix)
        }
        else
        {

        }
    },


    isEmptyPlaceholder    : function()
    {
        return false;
    },

    drawSelect : function(transformParent)
    {
        if(this.State.id == 20)
        {
            var transformMatrix = this.group.TransformMatrix.CreateDublicate();
            global_MatrixTransformer.MultiplyAppend(transformMatrix, transformParent);
            this.DrawingDocument.DrawTrack(TYPE_TRACK_GROUP_PASSIVE, this.group.TransformMatrix, 0, 0, this.group.ext.cx, this.group.ext.cy, false);
            this.group.drawSelect(transformMatrix);
        }
        if(this.State.id == 7)
        {
            var transformMatrix = this.obj.TransformMatrix.CreateDublicate();
            global_MatrixTransformer.MultiplyAppend(transformMatrix, transformParent);
            this.DrawingDocument.DrawTrack(this.obj.IsLine() ? TYPE_TRACK_SHAPE : TYPE_TRACK_TEXT, this.obj.TransformMatrix, 0, 0, this.obj.ext.cx, this.obj.ext.cy, this.obj.geometry ? this.obj.geometry.preset == "line"  : false);
            var geometry = this.obj.geometry;
            if(geometry!=null )
            {
                var n;
                if((n = geometry.ahXYLst.length) > 0)
                {
                    for(i = 0; i < n; ++i)
                    {
                        this.DrawingDocument.DrawAdjustment(this.obj.TransformMatrix, geometry.ahXYLst[i].posX, geometry.ahXYLst[i].posY)
                    }
                }
                if((n = geometry.ahPolarLst.length) > 0)
                {
                    for(i = 0; i < n; ++i)
                    {
                        this.DrawingDocument.DrawAdjustment(this.obj.TransformMatrix, geometry.ahPolarLst[i].posX, geometry.ahPolarLst[i].posY)
                    }
                }
            }
        }
        else
        {
            for(var i = 0; i <this.ArrGlyph.length; ++i)
            {
                var shape = this.ArrGlyph[i];
                if(shape.selected)
                {
                    var transformMatrix = shape.TransformMatrix.CreateDublicate();
                    global_MatrixTransformer.MultiplyAppend(transformMatrix, transformParent);
                    this.DrawingDocument.DrawTrack(TYPE_TRACK_SHAPE, shape.TransformMatrix, 0, 0, shape.ext.cx, shape.ext.cy, shape.geometry ? shape.geometry.preset == "line"  : false);
                }
            }

            if(this.NumSelected == 1)
            {
                for(i = 0; i <this.ArrGlyph.length; ++i)
                {
                    if(this.ArrGlyph[i].selected)
                    {
                        break;
                    }
                }
                if(i<this.ArrGlyph.length)
                {
                    shape = this.ArrGlyph[i];
                    geometry = shape.geometry;
                    if(geometry!=null )
                    {
                        if((n = geometry.ahXYLst.length) > 0)
                        {
                            for(i = 0; i < n; ++i)
                            {
                                this.DrawingDocument.DrawAdjustment(shape.TransformMatrix, geometry.ahXYLst[i].posX, geometry.ahXYLst[i].posY)
                            }
                        }
                        if((n = geometry.ahPolarLst.length) > 0)
                        {
                            for(i = 0; i < n; ++i)
                            {
                                this.DrawingDocument.DrawAdjustment(shape.TransformMatrix, geometry.ahPolarLst[i].posX, geometry.ahPolarLst[i].posY)
                            }
                        }
                    }
                }
            }
        }
    },

    Draw: function(graphics)
    {
        var glyphs = this.ArrGlyph;
        for(var i= 0, n = glyphs.length; i<n; ++i)
        {
            glyphs[i].Draw(graphics);
        }
    },


    getFullTransform : function()
    {
        if(this.Container.IsGroup())
        {
            var tmp = this.Container.getFullTransform();
            global_MatrixTransformer.MultiplyAppend(tmp, this.TransformMatrix);
            return tmp;
        }
        else
        {
            return global_MatrixTransformer.CreateDublicateM(this.TransformMatrix);
        }
    },

    updateCursorTypes : function()
    {
        this.cursorTypes = [];
        var transform = this.TransformMatrix;
        var vc = this.ext.cy*0.5;
        var hc = this.ext.cx*0.5;
        var xc = transform.TransformPointX(hc, vc);
        var yc = transform.TransformPointY(hc, vc);
        var xt = transform.TransformPointX(hc, 0);
        var yt = transform.TransformPointY(hc, 0);
        var vx = xt-xc;
        var vy = yc-yt;
        var angle = Math.atan2(vy, vx)+Math.PI/8;
        if(angle < 0)
        {
            angle+=2*Math.PI;
        }
        if(angle > 2*Math.PI)
        {
            angle-=2*Math.PI;
        }

        var xlt = transform.TransformPointX(0, 0);
        var ylt = transform.TransformPointY(0, 0);
        var vx_lt = xlt-xc;
        var vy_lt = yc-ylt;
        var curTypes = [];
        curTypes[0] = "n-resize";
        curTypes[1] = "ne-resize";
        curTypes[2] = "e-resize";
        curTypes[3] = "se-resize";
        curTypes[4] = "s-resize";
        curTypes[5] = "sw-resize";
        curTypes[6] = "w-resize";
        curTypes[7] = "nw-resize";
        if(vx_lt*vy-vx*vy_lt < 0) // нумерация якорьков по часовой стрелке
        {
            for(var i = 0; i<8; ++i)
            {
                this.cursorTypes[i] = curTypes[(i+1-Math.floor(angle/(Math.PI/4))+16)%8]
            }
        }
        else
        {
            for(i = 0; i<8; ++i)
            {
                this.cursorTypes[i] = curTypes[(-i+3-Math.floor(angle/(Math.PI/4))+16)%8]
            }
        }
        for(i = 0; i < this.ArrGlyph.length; ++i)
        {
            this.ArrGlyph[i].updateCursorTypes();
        }
    },

    calculateUniFills : function()
    {
        for(var i = 0; i< this.ArrGlyph.length; ++i)
        {
            this.ArrGlyph[i].calculateUniFills();
        }
    },

    selectionSetStart : function()
    {},

    selectionSetEnd : function()
    {},
    updateCursorType : function(x, y, e)
    {
        var glyphs = this.ArrGlyph;
        if(this.State.id == 0)
        {
            if(this.NumSelected > 0)
            {
                if(this.NumSelected == 1)
                {
                    for(var i = 0, n = glyphs.length; i<n; ++i)
                    {
                        if(glyphs[i].selected)
                        {
                            if(glyphs[i].HitAdj(x, y).hit)
                            {
                                this.DrawingDocument.SetCursorType("crosshair");
                                return;
                            }
                            var hit ={};
                            if((hit = glyphs[i].HitHandle(x, y)).hit)
                            {
                                if(hit.num != 8)
                                {
                                    this.DrawingDocument.SetCursorType(glyphs[i].cursorTypes[hit.num]);
                                }
                                else
                                {
                                    this.DrawingDocument.SetCursorType("crosshair");
                                }
                                return;
                            }
                        }

                    }
                }

                for(i = glyphs.length-1; i > -1; --i)
                {
                    if(glyphs[i].selected)
                    {
                        hit ={};
                        if((hit = glyphs[i].HitHandle(x, y)).hit)
                        {
                            if(hit.num != 8)
                            {
                                this.DrawingDocument.SetCursorType(glyphs[i].cursorTypes[hit.num]);
                            }
                            else
                            {
                                this.DrawingDocument.SetCursorType("crosshair");
                            }
                            return;
                        }
                    }
                }
            }



            for(i = glyphs.length-1; i > -1; --i)
            {
                var glyph = glyphs[i];
                if(glyph.Hit(x, y)
                    ||(/*glyph.text_flag&& TODO:*/ glyph.InTextRect(x, y))
                    ||(glyph.selected && glyph.HitInBox(x, y)))
                {
                    break;
                }
            }

            if(i>-1)
            {
                if( glyph.text_flag && glyph.InTextRect(x, y)
                    && !glyph.HitInPath(x, y)
                    && !( glyph.selected && glyph.HitInBox(x, y)) )
                {
                    if(glyph instanceof  CGraphicFrame && glyph.graphicObject !== null && typeof glyph.graphicObject === "object"
                        && typeof glyph.graphicObject.Update_CursorType === "function")
                    {
                        glyph.graphicObject.Update_CursorType(x - glyph.pH, y - glyph.pV, this.SlideNum)
                    }
                    else
                    {
                        if(typeof glyph.Update_CursorType === "function")
                            glyph.Update_CursorType(x, y);
                    }
                    return;
                }
                this.DrawingDocument.SetCursorType("move");
                return;
            }
            else
            {
                var testShape = new CShape(this.parent);
                testShape.ext = this.ext;
                testShape.pH = 0;
                testShape.pV = 0;
                testShape.rot = 0;
                testShape.flipH = this.flipH;
                testShape.flipV = this.flipV;
                if(!testShape.HitInBox(x, y) && !testShape.HitHandle(x, y).hit)
                    this.DrawingDocument.SetCursorType("default");
            }
        }
        if(this.State.id == 7)
        {
            if(!e.IsLocked)
            {
                glyph = this.obj;

                if( glyph.HitAdj(x, y).hit )
                {
                    this.DrawingDocument.SetCursorType("crosshair");
                    return;
                }

                hit=glyph.HitHandle(x, y);
                if(hit.hit)
                {
                    if(hit.num != 8)
                    {
                        this.DrawingDocument.SetCursorType(glyphs[i].cursorTypes[hit.num]);
                    }
                    else
                    {
                        this.DrawingDocument.SetCursorType("crosshair");
                    }
                    return;
                }

                for(i = glyphs.length-1; i > -1; --i)
                {
                    glyph = glyphs[i];
                    var bHit = glyph.Hit(x, y);
                    var bInTextRect = glyph.InTextRect(x, y);
                    var bInBox = glyph.HitInBox(x, y);
                    if(bHit ||(/*glyph.text_flag&& TODO:*/ bInTextRect) ||(glyph.selected && bInBox))
                    {
                        break;
                    }
                }

                if(i>-1)
                {
                    if( glyph.text_flag && bInTextRect && !glyph.HitInPath(x, y) && !( glyph.selected && bInBox) )
                    {
                        if(glyph instanceof  CGraphicFrame && glyph.graphicObject !== null && typeof glyph.graphicObject === "object"
                            && typeof glyph.graphicObject.Update_CursorType === "function")
                        {
                            glyph.graphicObject.Update_CursorType(x - glyph.pH, y - glyph.pV, this.SlideNum)
                        }
                        else
                        {
                            if(typeof glyph.Update_CursorType === "function")
                                glyph.Update_CursorType(x, y);
                            // this.DrawingDocument.SetCursorType("text");
                        }
                        return;
                    }

                    this.DrawingDocument.SetCursorType("move");
                    return;
                }
                else
                {
                  /*  var testShape = new CShape(this.parent);
                    testShape.ext = this.ext;
                    testShape.pH = 0;
                    testShape.pV = 0;
                    testShape.rot = 0;
                    testShape.flipH = this.flipH;
                    testShape.flipV = this.flipV;
                    if(!testShape.HitInBox(x, y) && !testShape.HitHandle(x, y).hit)
                        this.DrawingDocument.SetCursorType("default");   */
                }
            }
        }
    },

    ChangeState: function(state)
    {
        this.State = state;
    },

    RecalculateTransformMatrix: function()
    {
        this.TransformMatrix = this.getTransform();
        for(var i = 0; i<this.ArrGlyph.length; ++i)
        {
            this.ArrGlyph[i].RecalculateTransformMatrix();
        }
    },

    InTextRect: function(x, y)
    {
        return false;
    },
    
    DrawInTrack: function(graphics)
    {
        this.RecalculateTransformMatrix();
        this.Draw(graphics);
    },

    DrawAdj: function(graphics,zoom)
    {

    },

    Move: function(pH, pV)
    {
        var dx=pH-this.pH,
        dy=pV-this.pV;

        this.pH=pH;
        this.pV=pV;
        this.RecalculateTransformMatrix();
    },

    Resize: function(num, kd1, kd2)
    {
        var xfp, yfp;//координаты неподвижной точки
        var hc, vc, sin, cos, tw, th;
        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;
        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);
        var abs_kd1, abs_kd2;
        abs_kd1=Math.abs(kd1);
        abs_kd2=Math.abs(kd2);
        var tkd1, tkd2, tcx, tcy, ph, pv;
        tcx=this.ext.cx;
        tcy=this.ext.cy;
        ph=this.pH;
        pv=this.pV;
        var oldXc=this.ext.cx*0.5,
            oldYc=this.ext.cy*0.5;
        if(!this.flipH&&!this.flipV)
        {
            switch(num)
            {
                case 0:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;
                    tw=this.ext.cx*kd1;
                    th=this.ext.cy*kd2;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    tkd1=this.ext.cx/tcx;
                    tkd2=this.ext.cy/tcy;
                    var vh, vv, Xc, Yc;
                    Xc=/*this.pH+this.off.x+*/this.ext.cx*0.5;
                    Yc=/*this.pV+this.off.y+*/this.ext.cy*0.5;
                    this.changeSizes(tkd1, tkd2, oldXc, oldYc, Xc, Yc);
                   /* for(i=0; i<this.ArrGlyph.length; i++)
                    {
                        var da=this.ArrGlyph[i].rot,
                            glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            glyph.ext.cx*=tkd1;
                            glyph.ext.cy*=tkd2;

                        }
                        else
                        {
                            glyph.ext.cy*=tkd1;
                            glyph.ext.cx*=tkd2;
                        }

                        glyph.pH=(glyph.pH-oldXc)*tkd1 + hc;
                        glyph.pV=(glyph.pV-oldYc)*tkd2 + vc;

                        glyph.Recalculate();
                        glyph.RecalculateTransformMatrix();
                    }      */
                    break;
                }
                case 1:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    th=this.ext.cy*kd1;

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }

                    tkd1=this.ext.cy/tcy;
                    tkd2=1;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd2, tkd1, oldXc, oldYc, Xc, Yc);
                    break;
                }
                
                case 2:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*kd2;
                    th=this.ext.cy*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }

                    tkd2=this.ext.cx/tcx;
                    tkd1=this.ext.cy/tcy;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd2, tkd1, oldXc, oldYc, Xc, Yc);
                    break;
                }
                case 3:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;
                    tw=this.ext.cx*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }

                    tkd1=this.ext.cx/tcx;
                    tkd2=1;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd1, tkd2, oldXc, oldYc, Xc, Yc);
                    break;
                }

                case 4:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*kd1;
                    th=this.ext.cy*kd2;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }

                    tkd1=this.ext.cx/tcx;
                    tkd2=this.ext.cy/tcy;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd1, tkd2, oldXc, oldYc, Xc, Yc);

                    break;
                }
                case 5:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    th=this.ext.cy*kd1;
                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }

                    tkd1=this.ext.cy/tcy;
                    tkd2=1;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd2, tkd1, oldXc, oldYc, Xc, Yc);
                    break;
                }

                case 6:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*kd2;
                    th=this.ext.cy*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }

                    tkd2=this.ext.cx/tcx;
                    tkd1=this.ext.cy/tcy;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd2, tkd1, oldXc, oldYc, Xc, Yc);

                    break;
                }
                case 7:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }

                    tkd1=this.ext.cx/tcx;
                    tkd2=1;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd1, tkd2, oldXc, oldYc, Xc, Yc);
                    break;
                }
            }
        }
        else if(this.flipH&&this.flipV)
        {
            switch(num)
            {
                case 4:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    tw=this.ext.cx*kd1;
                    th=this.ext.cy*kd2;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }

                    tkd1=this.ext.cx/tcx;
                    tkd2=this.ext.cy/tcy;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd1, tkd2, oldXc, oldYc, Xc, Yc);

                    break;
                }
                case 5:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    th=this.ext.cy*kd1;

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                   if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }

                    tkd1=this.ext.cy/tcy;
                    tkd2=1;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd2, tkd1, oldXc, oldYc, Xc, Yc);
                    break;
                }

                case 6:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*kd2;
                    th=this.ext.cy*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }


                    tkd2=this.ext.cx/tcx;
                    tkd1=this.ext.cy/tcy;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd2, tkd1, oldXc, oldYc, Xc, Yc);
                    break;
                }
                case 7:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;
                    tw=this.ext.cx*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }


                    tkd1=this.ext.cx/tcx;
                    tkd2=1;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd1, tkd2, oldXc, oldYc, Xc, Yc);
                    break;
                }

                case 0:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*kd1;
                    th=this.ext.cy*kd2;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }



                    tkd1=this.ext.cx/tcx;
                    tkd2=this.ext.cy/tcy;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd1, tkd2, oldXc, oldYc, Xc, Yc);

                    break;
                }
                case 1:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    th=this.ext.cy*kd1;
                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }

                    tkd1=this.ext.cy/tcy;
                    tkd2=1;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd2, tkd1, oldXc, oldYc, Xc, Yc);
                    break;
                }

                case 2:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*kd2;
                    th=this.ext.cy*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }

                   tkd2=this.ext.cx/tcx;
                    tkd1=this.ext.cy/tcy;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd1, tkd2, oldXc, oldYc, Xc, Yc);
                    break;
                }
                case 3:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    tkd1=this.ext.cx/tcx;
                    tkd2=1;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd1, tkd2, oldXc, oldYc, Xc, Yc);
                    break;
                }
            }
        }
        else if(this.flipH&&!this.flipV)
        {
             switch(num)
            {
                case 2:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    tw=this.ext.cx*kd1;
                    th=this.ext.cy*kd2;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }


                    tkd1=this.ext.cx/tcx;
                    tkd2=this.ext.cy/tcy;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd1, tkd2, oldXc, oldYc, Xc, Yc);
                    break;
                }
                case 1:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    th=this.ext.cy*kd1;

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    tkd1=this.ext.cy/tcy;
                    tkd2=1;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd2, tkd1, oldXc, oldYc, Xc, Yc);
                    break;
                }

                case 0:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*kd2;
                    th=this.ext.cy*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }

                    tkd2=this.ext.cx/tcx;
                    tkd1=this.ext.cy/tcy;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd2, tkd1, oldXc, oldYc, Xc, Yc);
                    break;
                }
                case 7:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;
                    tw=this.ext.cx*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                   if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    tkd1=this.ext.cx/tcx;
                    tkd2=1;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd1, tkd2, oldXc, oldYc, Xc, Yc);
                    break;
                }

                case 6:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*kd1;
                    th=this.ext.cy*kd2;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    tkd1=this.ext.cx/tcx;
                    tkd2=this.ext.cy/tcy;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd1, tkd2, oldXc, oldYc, Xc, Yc);
                    break;
                }
                case 5:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    th=this.ext.cy*kd1;
                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                     if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    tkd1=this.ext.cy/tcy;
                    tkd2=1;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd2, tkd1, oldXc, oldYc, Xc, Yc);
                    break;
                }

                case 4:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*kd2;
                    th=this.ext.cy*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                       tkd2=this.ext.cx/tcx;
                    tkd1=this.ext.cy/tcy;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd2, tkd1, oldXc, oldYc, Xc, Yc);
                    break;
                }
                case 3:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    tkd1=this.ext.cx/tcx;
                    tkd2=1;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd1, tkd2, oldXc, oldYc, Xc, Yc);
                    break;
                }
            }
        }
        else if(!this.flipH&&this.flipV)
        {
            switch(num)
            {
                case 6:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    tw=this.ext.cx*kd1;
                    th=this.ext.cy*kd2;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    tkd1=this.ext.cx/tcx;
                    tkd2=this.ext.cy/tcy;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd1, tkd2, oldXc, oldYc, Xc, Yc);
                    break;
                }
                case 5:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    th=this.ext.cy*kd1;

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    tkd1=this.ext.cy/tcy;
                    tkd2=1;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd2, tkd1, oldXc, oldYc, Xc, Yc);
                    break;
                }

                case 4:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*kd2;
                    th=this.ext.cy*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    tkd2=this.ext.cx/tcx;
                    tkd1=this.ext.cy/tcy;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd2, tkd1, oldXc, oldYc, Xc, Yc);
                    break;
                }
                case 3:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;
                    tw=this.ext.cx*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                     if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    tkd1=this.ext.cx/tcx;
                    tkd2=1;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd1, tkd2, oldXc, oldYc, Xc, Yc);
                    break;
                }

                case 2:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*kd1;
                    th=this.ext.cy*kd2;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    tkd1=this.ext.cx/tcx;
                    tkd2=this.ext.cy/tcy;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd1, tkd2, oldXc, oldYc, Xc, Yc);
                    break;
                }
                case 1:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    th=this.ext.cy*kd1;
                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                     if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    tkd1=this.ext.cy/tcy;
                    tkd2=1;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd2, tkd1, oldXc, oldYc, Xc, Yc);
                    break;
                }

                case 0:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*kd2;
                    th=this.ext.cy*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                       tkd2=this.ext.cx/tcx;
                    tkd1=this.ext.cy/tcy;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd2, tkd1, oldXc, oldYc, Xc, Yc);
                    break;
                }
                case 7:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*kd1;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                   tkd1=this.ext.cx/tcx;
                    tkd2=1;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd1, tkd2, oldXc, oldYc, Xc, Yc);
                    break;
                }
            }
        }
        this.Recalculate();
    },

    UnGroup: function()
    {
        return this.ArrGlyph;
    },

    ResizeRelativeCenter: function(num, kd1, kd2)
    {
        var xfp, yfp;//координаты неподвижной точки
        var hc, vc, sin, cos, tw, th;
        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;
        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);

        var tkd1, tkd2, tcx, tcy, ph, pv;
        tcx=this.ext.cx;
        tcy=this.ext.cy;
        ph=this.pH;
        pv=this.pV;
        var oldXc=this.ext.cx*0.5,
            oldYc=this.ext.cy*0.5;
        xfp=hc+this.pH+this.off.x;
        yfp=vc+this.pV+this.off.y;
        var Xc, Yc;

        if(!this.flipH&&!this.flipV ||(this.flipH&&this.flipV))
        {
            switch(num)
            {
                case 0:
                case 4:
                {
                    tw=this.ext.cx*(2*kd1-1);
                    th=this.ext.cy*(2*kd2-1);

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    tkd1=this.ext.cx/tcx;
                    tkd2=this.ext.cy/tcy;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd1, tkd2, oldXc, oldYc, Xc, Yc);

                    break;
                }
                case 1:
                case 5:
                {
                    th=this.ext.cy*(2*kd1-1);
                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    tkd1=this.ext.cx/tcx;
                    tkd2=this.ext.cy/tcy;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd1, tkd2, oldXc, oldYc, Xc, Yc);
                    break;
                }

                case 2:
                case 6:
                {
                    tw=this.ext.cx*(2*kd2-1);
                    th=this.ext.cy*(2*kd1-1);
                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    tkd1=this.ext.cx/tcx;
                    tkd2=this.ext.cy/tcy;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd1, tkd2, oldXc, oldYc, Xc, Yc);
                    break;
                }
                case 3:
                case 7:
                {
                    tw=this.ext.cx*(2*kd1-1);
                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    tkd1=this.ext.cx/tcx;
                    tkd2=this.ext.cy/tcy;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd1, tkd2, oldXc, oldYc, Xc, Yc);
                    break;
                }
            }
        }
        else
        {
            switch(num)
            {
                case 2:
                case 6:
                {
                    tw=this.ext.cx*(2*kd1-1);
                    th=this.ext.cy*(2*kd2-1);

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd1, tkd2, oldXc, oldYc, Xc, Yc);

                    break;
                }
                case 1:
                case 5:
                {
                    th=this.ext.cy*(2*kd1-1);
                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    tkd1=this.ext.cx/tcx;
                    tkd2=this.ext.cy/tcy;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd1, tkd2, oldXc, oldYc, Xc, Yc);
                    break;
                }

                case 0:
                case 4:
                {
                    tw=this.ext.cx*(2*kd2-1);
                    th=this.ext.cy*(2*kd1-1);
                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    tkd1=this.ext.cx/tcx;
                    tkd2=this.ext.cy/tcy;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd1, tkd2, oldXc, oldYc, Xc, Yc);
                    break;
                }
                case 3:
                case 7:
                {
                    tw=this.ext.cx*(2*kd1-1);
                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    tkd1=this.ext.cx/tcx;
                    tkd2=this.ext.cy/tcy;
                    Xc=this.ext.cx*0.5;
                    Yc=this.ext.cy*0.5;
                    this.changeSizes(tkd1, tkd2, oldXc, oldYc, Xc, Yc);
                    break;
                }
            }
        }
        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;
        this.pH=xfp-hc;
        this.pV=yfp-vc;
        this.Recalculate();
    },

    GetDetPoints: function()
    {
        var hc, vc, sin, cos, tw, th;
        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;
        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);
        if(!this.flipH&&!this.flipV)
            return {
                x0: (-hc*cos+vc*sin)+this.pH+this.off.x+hc,
                y0: (-hc*sin-vc*cos)+this.pV+this.off.y+vc,

                x1: vc*sin +this.pH+this.off.x+hc,
                y1: -vc*cos+this.pV+this.off.y+vc,

                x3: hc*cos+this.pH+this.off.x+hc,
                y3: hc*sin+this.pV+this.off.y+vc,

                x4: (hc*cos-vc*sin)+this.pH+this.off.x+hc,
                y4: (hc*sin+vc*cos)+this.pV+this.off.y+vc
            };
        if(this.flipH&&this.flipV)
            return {
                x0: (hc*cos-vc*sin)+this.pH+this.off.x+hc,
                y0: (hc*sin+vc*cos)+this.pV+this.off.y+vc,

                x1: -vc*sin +this.pH+this.off.x+hc,
                y1: vc*cos+this.pV+this.off.y+vc,

                x3: -hc*cos+this.pH+this.off.x+hc,
                y3: -hc*sin+this.pV+this.off.y+vc,

                x4: (-hc*cos+vc*sin)+this.pH+this.off.x+hc,
                y4: (-hc*sin-vc*cos)+this.pV+this.off.y+vc
            };
    },

    ResizeProport: function(num, k)
    {
         var xfp, yfp;//координаты неподвижной точки
        var hc, vc, sin, cos, tw, th;
        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;
        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);
        if(!this.flipH&&!this.flipV)
        {
            switch(num)
            {
                case 0:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    break;
                }
                case 1:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    th=this.ext.cy*k;

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    break;
                }

                case 2:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    break;
                }
                case 3:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;
                    tw=this.ext.cx*k;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    break;
                }

                case 4:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    break;
                }
                case 5:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    th=this.ext.cy*k;
                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    break;
                }

                case 6:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    break;
                }

                case 7:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    break;
                }
            }
        }
        else if(this.flipH&&this.flipV)
        {
            switch(num)
            {
                case 4:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    break;
                }
                case 5:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    th=this.ext.cy*k;

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }


                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                   if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    break;
                }

                case 6:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    break;
                }
                case 7:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;
                    tw=this.ext.cx*k;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    break;
                }

                case 0:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    break;
                }
                case 1:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    th=this.ext.cy*k;
                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    break;
                }

                case 2:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    break;
                }

                case 3:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    break;
                }
            }
        }
        else if(this.flipH&&!this.flipV)
        {
             switch(num)
            {
                case 2:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    break;
                }
                case 1:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    th=this.ext.cy*k;

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    break;
                }

                case 0:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    break;
                }
                case 7:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;
                    tw=this.ext.cx*k;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                   if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    break;
                }

                case 6:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    break;
                }
                case 5:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    th=this.ext.cy*k;
                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                     if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    break;
                }

                case 4:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    break;
                }

                case 3:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    break;
                }
            }
        }
        else if(!this.flipH&&this.flipV)
        {
            switch(num)
            {
                case 6:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    break;
                }
                case 5:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    th=this.ext.cy*k;

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    break;
                }

                case 4:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    break;
                }
                case 3:
                {
                    xfp=(-hc*cos-vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin+vc*cos)+this.pV+vc+this.off.y;
                    tw=this.ext.cx*k;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                     if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    break;
                }

                case 2:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    break;
                }
                case 1:
                {
                    xfp=(-hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(-hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    th=this.ext.cy*k;
                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                     if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    break;
                }

                case 0:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;
                    th=this.ext.cy*k;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    if(th>0)
                        if(th>min_size2||this.isLine)
                            this.ext.cy=th;
                        else
                            this.ext.cy=min_size2;
                    else
                    {
                        this.flipV=!this.flipV;
                        if(th<-min_size2||this.isLine)
                            this.ext.cy=-th;
                        else
                            this.ext.cy=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    break;
                }

                case 7:
                {
                    xfp=(hc*cos+vc*sin)+this.pH+hc+this.off.x;
                    yfp=(hc*sin-vc*cos)+this.pV+vc+this.off.y;

                    tw=this.ext.cx*k;

                    if(tw>0)
                        if(tw>min_size2||this.isLine)
                            this.ext.cx=tw;
                        else
                            this.ext.cx=min_size2;
                    else
                    {
                        this.flipH=!this.flipH;
                        if(tw<-min_size2||this.isLine)
                            this.ext.cx=-tw;
                        else
                            this.ext.cx=min_size2;
                    }

                    hc=this.ext.cx*0.5;
                    vc=this.ext.cy*0.5;
                    if(!this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(-hc*cos-vc*sin)-hc;
                        this.pV=yfp+(-hc*sin+vc*cos)-vc;
                    }
                    else if(this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(hc*cos+vc*sin)-hc;
                        this.pV=yfp+(hc*sin-vc*cos)-vc;
                    }
                    else if(this.flipH&&this.flipV)
                    {
                        this.pH=xfp+(hc*cos-vc*sin)-hc;
                        this.pV=yfp+(hc*sin+vc*cos)-vc;
                    }
                    else if(!this.flipH&&!this.flipV)
                    {
                        this.pH=xfp+(-hc*cos+vc*sin)-hc;
                        this.pV=yfp+(-hc*sin-vc*cos)-vc;
                    }
                    break;
                }
            }
        }
        this.Recalculate();
    },

    DefineResizeCoef: function(num, x, y)
    {
        var p=this.GetPointRelativeShape(x, y);
        if(!this.flipH&&!this.flipV)
        {
            switch(num)
            {
                case 0:
                    return {kd1: (this.ext.cx-p.x)/this.ext.cx, kd2: (this.ext.cy-p.y)/this.ext.cy};
                case 1:
                    return {kd1: (this.ext.cy-p.y)/this.ext.cy, kd2: 0};
                case 2:
                    return {kd1: (this.ext.cy-p.y)/this.ext.cy, kd2: p.x/this.ext.cx};
                case 3:
                    return {kd1: p.x/this.ext.cx, kd2: 0};
                case 4:
                    return {kd1: p.x/this.ext.cx, kd2: p.y/this.ext.cy};
                case 5:
                    return {kd1: p.y/this.ext.cy, kd2: 0};
                case 6:
                    return {kd1: p.y/this.ext.cy, kd2:(this.ext.cx-p.x)/this.ext.cx};
                case 7:
                    return {kd1:(this.ext.cx-p.x)/this.ext.cx, kd2: 0};
            }
        }
        else if(this.flipH&&this.flipV)
        {
            switch(num)
            {
                case 4:
                    return {kd1: (this.ext.cx-p.x)/this.ext.cx, kd2: (this.ext.cy-p.y)/this.ext.cy};
                case 5:
                    return {kd1: (this.ext.cy-p.y)/this.ext.cy, kd2: 0};
                case 6:
                    return {kd1: (this.ext.cy-p.y)/this.ext.cy, kd2: p.x/this.ext.cx};
                case 7:
                    return {kd1: p.x/this.ext.cx, kd2: 0};
                case 0:
                    return {kd1: p.x/this.ext.cx, kd2: p.y/this.ext.cy};
                case 1:
                    return {kd1: p.y/this.ext.cy, kd2: 0};
                case 2:
                    return {kd1: p.y/this.ext.cy, kd2:(this.ext.cx-p.x)/this.ext.cx};
                case 3:
                    return {kd1:(this.ext.cx-p.x)/this.ext.cx, kd2: 0};
            }
        }
        else if(this.flipH&&!this.flipV)
        {
            switch(num)
            {
                case 2:
                    return {kd1: (this.ext.cx-p.x)/this.ext.cx, kd2: (this.ext.cy-p.y)/this.ext.cy};
                case 1:
                    return {kd1: (this.ext.cy-p.y)/this.ext.cy, kd2: 0};
                case 0:
                    return {kd1: (this.ext.cy-p.y)/this.ext.cy, kd2: p.x/this.ext.cx};
                case 7:
                    return {kd1: p.x/this.ext.cx, kd2: 0};
                case 6:
                    return {kd1: p.x/this.ext.cx, kd2: p.y/this.ext.cy};
                case 5:
                    return {kd1: p.y/this.ext.cy, kd2: 0};
                case 4:
                    return {kd1: p.y/this.ext.cy, kd2:(this.ext.cx-p.x)/this.ext.cx};
                case 3:
                    return {kd1:(this.ext.cx-p.x)/this.ext.cx, kd2: 0};
            }
        }
        else if(!this.flipH&&this.flipV)
        {
            switch(num)
            {
                case 6:
                    return {kd1: (this.ext.cx-p.x)/this.ext.cx, kd2: (this.ext.cy-p.y)/this.ext.cy};
                case 5:
                    return {kd1: (this.ext.cy-p.y)/this.ext.cy, kd2: 0};
                case 4:
                    return {kd1: (this.ext.cy-p.y)/this.ext.cy, kd2: p.x/this.ext.cx};
                case 3:
                    return {kd1: p.x/this.ext.cx, kd2: 0};
                case 2:
                    return {kd1: p.x/this.ext.cx, kd2: p.y/this.ext.cy};
                case 1:
                    return {kd1: p.y/this.ext.cy, kd2: 0};
                case 0:
                    return {kd1: p.y/this.ext.cy, kd2:(this.ext.cx-p.x)/this.ext.cx};
                case 7:
                    return {kd1:(this.ext.cx-p.x)/this.ext.cx, kd2: 0};
            }
        }
    },

    GetPointRelativeShape: function(x, y)
    {
        var x_lt, y_lt;
        var hc, vc, sin, cos;

        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;

        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);

        x_lt=-hc*cos+vc*sin+this.pH+this.off.x+hc;
        y_lt=-hc*sin-vc*cos+this.pV+this.off.y+vc;

        var tx=x-x_lt, ty=y-y_lt;
        var vx, vy;

        vx=tx*cos+ty*sin;
        vy=-tx*sin+ty*cos;
        return {x: vx, y:vy}
    },

    Get_Styles: function()
    {
      return this.Document.Get_Styles();
    },

    Is_Cell: function()
    {
        return true;
    },

    OnContentRecalculate: function(bChange, bForceRecalc )
    {
        this.Document.DrawingDocument.OnRecalculatePage( 0, this.Document.Pages[0]);
    },

    Get_Numbering: function()
    {
        return this.Document.Get_Numbering();
    },

    Recalculate: function()
    {
        this.RecalculateTransformMatrix();
        for(var i=0; i<this.ArrGlyph.length; ++i)
            this.ArrGlyph[i].Recalculate();

    },

    Hit: function(x, y)
    {
        var relativePoint = this.GetPointRelativeShape(x, y);
        if(this.flipH)
        {
            relativePoint.x = this.ext.cx-relativePoint.x;
        }
        if(this.flipV)
        {
            relativePoint.y = this.ext.cy-relativePoint.y;
        }
        for(var i=0; i<this.ArrGlyph.length; i++)
            if(this.ArrGlyph[i].Hit(relativePoint.x, relativePoint.y))
                return true;
        return false;
    },

    HitInBox: function(x, y)//проверяет поппали ли в границу box'а
    {
        var x_lt, y_lt;
        var hc, vc, sin, cos;

        var d=100/this.parent.Layout.Master.presentation.DrawingDocument.m_oWordControl.m_nZoomValue, d2=2*d;
        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;
            d2 = 0;
        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);

        x_lt=-hc*cos+vc*sin+this.pH+this.off.x+hc;
        y_lt=-hc*sin-vc*cos+this.pV+this.off.y+vc;

        var tx=x-x_lt, ty=y-y_lt;

        var vx, vy;

        vx=tx*cos+ty*sin;
        vy=-tx*sin+ty*cos;

        if(this.flipH)
            vx=this.ext.cx-vx;
        if(this.flipV)
            vy=this.ext.cy-vy;

        var context=this.Container.DrawingDocument.CanvasHitContext;
        context.beginPath();
        return (HitInLine(context, vx, vy, -d2, -d2, this.ext.cx+d2, -d2) ||
             HitInLine(context, vx, vy, this.ext.cx+d2, -d2, this.ext.cx+d2, this.ext.cy+d2)||
             HitInLine(context, vx, vy, this.ext.cx+d2, this.ext.cy+d2, -d2, this.ext.cy+d2)||
             HitInLine(context, vx, vy, -d2, this.ext.cy+d2, -d2, -d2) ||
             HitInLine(context, vx, vy, this.ext.cx*0.5, -d2, this.ext.cx*0.5, -1000/this.parent.Layout.Master.presentation.DrawingDocument.m_oWordControl.m_nZoomValue-d2));
    },

    GetAngle: function(x, y)
    {
        var x_lt, y_lt;
        var hc, vc, sin, cos;

        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;

        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);

        x_lt=-hc*cos+vc*sin+this.pH+this.off.x+hc;
        y_lt=-hc*sin-vc*cos+this.pV+this.off.y+vc;


        var tx=x-x_lt, ty=y-y_lt;

        var vx, vy;

        vx=tx*cos+ty*sin;
        vy=-tx*sin+ty*cos;

        var ang=Math.PI*0.5+Math.atan2(vy-vc, vx-hc);
        if(!this.flipV)
            return ang;
        else
            return ang+Math.PI;
    },

    Rotate: function(a, ShiftFlag)
    {
        var ta=this.rot;
        this.rot+=a;
        while(this.rot<0)
        {
            this.rot+=Math.PI*2;
        }
        while(this.rot>Math.PI*2)
        {
            this.rot-=2*Math.PI;
        }

        if(this.rot<0.07||this.rot>2*Math.PI-0.07)
        {
            this.rot=0;
        }
        if(Math.abs(this.rot-Math.PI*0.5)<0.07)
        {
            this.rot=Math.PI*0.5;
        }

        if(Math.abs(this.rot-Math.PI)<0.07)
        {
            this.rot=Math.PI;
        }

         if(Math.abs(this.rot-1.5*Math.PI)<0.07)
        {
            this.rot=1.5*Math.PI;
        }


        if(ShiftFlag)
        {
            this.rot=(Math.PI/12)*Math.floor(12*this.rot/(Math.PI));
        }
        this.RecalculateTransformMatrix();
    /*    console.log(this.TransformMatrix.sx);
        console.log(this.ArrGlyph[0].Container.TransformMatrix.sx);
        console.log(this.ArrGlyph[0].TransformMatrix.sx);           */
    },

   HitHandle: function(x, y)
    {
        var x_lt, y_lt;
        var vx, vy;
        var hc, vc, sin, cos;
        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;

        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);

        x_lt=-hc*cos+vc*sin+this.pH+this.off.x+hc;
        y_lt=-hc*sin-vc*cos+this.pV+this.off.y+vc;

        var r=this.Container.DrawingDocument.GetMMPerDot(TRACK_CIRCLE_RADIUS);
        if(this.Container.State.id != 7)
        {

            var tx=x-x_lt, ty=y-y_lt;
            vx=tx*cos+ty*sin;
            vy=-tx*sin+ty*cos;
        }
        else
        {
            vx=x-x_lt;
            vy=y-y_lt;
        }



        var dx, dy;
        if(this.prst!='line')
        {
            if(Math.sqrt(vx*vx+vy*vy)<r)
            {
                return {hit: true, num: this.flipV ?(this.flipH ? 4: 6) : (this.flipH ? 2: 0)};
            }

            dx=vx-this.ext.cx;
            dy=vy-this.ext.cy;
            if(Math.sqrt(dx*dx+dy*dy)<r)
            {
                return {hit:true, num: this.flipV ? (this.flipH ? 0 : 2) : (this.flipH ? 6 : 4)};
            }

            dx=vx;
            dy=vy-this.ext.cy;
            if(Math.sqrt(dx*dx+dy*dy)<r)
            {
                return {hit:true, num: this.flipV ? (this.flipH ? 2 : 0) : (this.flipH ? 4 : 6)};
            }

            dx=vx-this.ext.cx;
            dy=vy;
            if(Math.sqrt(dx*dx+dy*dy)<r)
            {
                return {hit:true, num: this.flipV ? (this.flipH ? 6 : 4) : (this.flipH ? 0 : 2)};
            }


            if(this.ext.cx>min_size)
            {
                dx=vx-hc;
                dy=vy;
                if(Math.sqrt(dx*dx+dy*dy)<r)
                {
                    return {hit:true, num: this.flipV ? 5 : 1};
                }
            }



            if(this.ext.cy>min_size)
            {
                dx=vx-this.ext.cx;
                dy=vy-vc;
                if(Math.sqrt(dx*dx+dy*dy)<r)
                {
                    return {hit:true, num: this.flipH ? 7 : 3};
                }
            }



            if(this.ext.cx>min_size)
            {
                dx=vx-hc;
                dy=vy-this.ext.cy;
                if(Math.sqrt(dx*dx+dy*dy)<r)
                {
                    return {hit:true, num: this.flipV ? 1 : 5};
                }
            }


            if(this.ext.cy>min_size)
            {
                dx=vx;
                dy=vy-vc;
                if(Math.sqrt(dx*dx+dy*dy)<r)
                {
                    return {hit:true, num: this.flipH ? 3 : 7};
                }
            }
          //  if(!(this.ext.cx<min_size&&this.ext.cy<min_size))
            {
                dx=vx-hc;
                if(!this.flipV)
                {
                    dy=vy+this.Container.DrawingDocument.GetMMPerDot(TRACK_DISTANCE_ROTATE);
                }
                else
                {
                    dy=vy-(this.ext.cy+this.Container.DrawingDocument.GetMMPerDot(TRACK_DISTANCE_ROTATE));
                }

                if(Math.sqrt(dx*dx+dy*dy)<r)
                {
                    return {hit:true, num: 8};
                }
            }
        }
        else
        {
            if(this.flipH) vx=this.ext.cx-vx;
            if(this.flipV) vy=this.ext.cy-vy;

            if(Math.sqrt(vx*vx+vy*vy)<r)
            {
                return {hit: true, num: 0};
            }

            dx=vx-this.ext.cx;
            dy=vy-this.ext.cy;
            if(Math.sqrt(dx*dx+dy*dy)<r)
            {
                return {hit:true, num: 4};
            }

        }

        return {hit:false};
    },

    HitAdj: function(x, y)
    {
        return {hit: false};
    },

    GetSizes: function()
    {
        var y1, y3, y5, y7, hc, vc, sin, cos;
        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;
        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);
        y1=-cos*vc;
        y3=sin*hc;
        y5=cos*vc;
        y7=-sin*hc;
        switch(Math.min(y1, y3, y5, y7))
        {
            case y1:
            case y5:
                return {W: this.ext.cx, H: this.ext.cy};
            case y3:
            case y7:
                return {W: this.ext.cy, H: this.ext.cx};
            default:
                return {W: this.ext.cx, H: this.ext.cy};
        }
    },

    CardDirToNum: function(CardDir)
    {
        var y1, y3, y5, y7, hc, vc, sin, cos, numN;

        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;

        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);

        y1=-cos*vc;
        y3=sin*hc;
        y5=cos*vc;
        y7=-sin*hc;

        switch(Math.min(y1, y3, y5, y7))
        {
            case y1:
            {
                if(!this.flipV)
                    numN=1;
                else
                    numN=5;
                break;
            }
            case y3:
            {
                if(!this.flipH)
                    numN=3;
                else
                    numN=7;
                break;
            }
            case y5:
            {
               if(!this.flipV)
                    numN=5;
                else
                    numN=1;
                break;
            }
            case y7:
            {
                 if(!this.flipH)
                    numN=7;
                else
                    numN=3;
                break;
            }
            default:
            {
                numN=1;
            }
        }

         if((!(this.flipH||this.flipV))||(this.flipH&&this.flipV))
            return (CardDir+numN)%8;
         else{
            var t=numN-CardDir;
            if(t<0)
                return t+8;
            else
                return t;
        }
    },

    NumToCardDir: function(Num)
    {
        var y1, y3, y5, y7, hc, vc, sin, cos, numN;

        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;

        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);

        y1=-cos*vc;
        y3=sin*hc;
        y5=cos*vc;
        y7=-sin*hc;

        switch(Math.min(y1, y3, y5, y7))
        {
            case y1:
            {
                if(!this.flipV)
                    numN=1;
                else
                    numN=5;
                break;
            }
            case y3:
            {
                if(!this.flipH)
                    numN=3;
                else
                    numN=7;
                break;
            }
            case y5:
            {
               if(!this.flipV)
                    numN=5;
                else
                    numN=1;
                break;
            }
            case y7:
            {
                 if(!this.flipH)
                    numN=7;
                else
                    numN=3;
                break;
            }
            default:
            {
                numN=1;
            }
        }

        var tmpArr=[];
        if(!(this.flipH||this.flipV)||this.flipH&&this.flipV){
            tmpArr[numN]=N;
            tmpArr[(numN+1)%8]=NE;
            tmpArr[(numN+2)%8]=E;
            tmpArr[(numN+3)%8]=SE;
            tmpArr[(numN+4)%8]=S;
            tmpArr[(numN+5)%8]=SW;
            tmpArr[(numN+6)%8]=W;
            tmpArr[(numN+7)%8]=NW;
            return tmpArr[Num];
        }
        else{
            var t;
            tmpArr[numN]=N;
            t=numN-1;
            if(t<0) t+=8;
            tmpArr[t]=NE;
            t=numN-2;
            if(t<0) t+=8;
            tmpArr[t]=E;
            t=numN-3;
            if(t<0) t+=8;
            tmpArr[t]=SE;
            t=numN-4;
            if(t<0) t+=8;
            tmpArr[t]=S;
            t=numN-5;
            if(t<0) t+=8;
            tmpArr[t]=SW;
            t=numN-6;
            if(t<0) t+=8;
            tmpArr[t]=W;
            t=numN-7;
            if(t<0) t+=8;
            tmpArr[t]=NW;
            return tmpArr[Num];
        }
    },

    GetCoordPointNum: function(num)
    {
        var hc, vc, sin, cos;

        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);

        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;

        var x, y;
        switch(num)
        {
            case 0:
            {
                return {
                    x:-hc*cos+vc*sin+this.pH+this.off.x+hc,
                    y:-hc*sin-vc*cos+this.pV+this.off.y+vc
                }
            }
            case 1:
            {
                return{
                    x: vc*sin+this.pH+this.off.x+hc,
                    y: -vc*cos+this.pV+this.off.y+vc
                }
            }
            case 2:
            {
                return{
                    x:hc*cos+vc*sin+this.pH+this.off.x+hc,
                    y:hc*sin-vc*cos+this.pV+this.off.y+vc
                }
            }
            case 3:
            {
                return{
                    x:hc*cos+this.pH+this.off.x+hc,
                    y:hc*sin+this.pV+this.off.y+vc
                }
            }
            case 4:
            {
                return{
                    x:hc*cos-vc*sin+this.pH+this.off.x+hc,
                    y:hc*sin+vc*cos+this.pV+this.off.y+vc
                }
            }
            case 5:
            {
                return{
                    x:vc*sin+this.pH+this.off.x+hc,
                    y:-vc*cos+this.pV+this.off.y+vc
                }
            }
            case 6:
            {
                return{
                    x:-hc*cos-vc*sin+this.pH+this.off.x+hc,
                    y:-hc*sin+vc*cos+this.pV+this.off.y+vc
                }
            }
            case 7:
            {
                return{
                    x:-hc*cos+this.pH+this.off.x+hc,
                    y:-hc*sin+this.pV+this.off.y+vc
                }
            }

        }
    },

    GetCoordPointDir: function(dir)
    {
        return this.GetCoordPointNum(this.CardDirToNum(dir));
    },

    ChangeAdjXY: function(num, x, y)
    {
    },

    ChangeAdjPolar: function(num, x, y)
    {
    },

    CalculateAdjRange: function(num)
    {
    },

    CalculateAdjPolarRangeR: function(num)
    {
    },

    Select: function(graphics, zoom)
    {
        if (graphics.m_oContext === undefined)
            return;
        
        if(zoom == undefined)
            zoom = 100;
        var d=10000/zoom;



        graphics.SetIntegerGrid(false);
        graphics.reset();
        graphics.transform3(this.TransformMatrix);
        graphics.m_oContext.fillStyle="rgb(202, 233, 236)";
        graphics.m_oContext.lineWidth=25/zoom;
        graphics.p_color(0,0,0,255);
        if(this.prst!='line')
        {
            graphics.m_oContext.lineWidth=5/zoom;
            graphics._s();
            graphics._m(0, 0);
            graphics._l(this.ext.cx, 0);
            graphics._l(this.ext.cx, this.ext.cy);
            graphics._l(0, this.ext.cy);
            graphics._z();
            graphics.ds();

            if(!(this.ext.cx<min_size&&this.ext.cy<min_size))
            {
                graphics._s();
                graphics._m(this.ext.cx/2, 0);
                graphics._l(this.ext.cx/2, -1000/zoom);
                graphics.ds();
            }

            circle(graphics, 0,0, d);
            circle(graphics, this.ext.cx,0, d);
            circle(graphics, this.ext.cx,this.ext.cy, d);
            circle(graphics, 0,this.ext.cy, d);



            if(this.ext.cx>min_size)
            {
                square(graphics, this.ext.cx/2,0, d);
                square(graphics, this.ext.cx/2,this.ext.cy, d);
            }

            if(this.ext.cy>min_size)
            {
                square(graphics, this.ext.cx,this.ext.cy/2, d);
                square(graphics, 0,this.ext.cy/2, d);
            }

            if(!(this.ext.cx<min_size&&this.ext.cy<min_size))
            {
                graphics.m_oContext.fillStyle="rgb(62, 240, 163)";
                circle(graphics, this.ext.cx/2, -1000/zoom, d);
            }
        }
        else
        {
            circle(graphics, 0,0, d);
            circle(graphics, this.ext.cx,this.ext.cy, d);
        }
        graphics.reset();
    },

    GetWH: function()
    {
        var numN=this.CardDirToNum(N);
        if(numN==1||numN==5)
        {
            return { W: this.ext.cx , H: this.ext.cy, ws: 'cx', hs:'cy'};
        }
        else
        {
            return { H: this.ext.cx , W: this.ext.cy, ws: 'cy', hs:'cx'};
        }
    },

    IsGroup: function()
    {
        return true;
    },

    RecalculateAfterResize: function()
    {
        var c_x_max, c_x_min, c_y_max, c_y_min;
        c_x_max = this.pH+this.off.x+this.ext.cx;
        c_x_min = this.pH+this.off.x;

        c_y_max = this.pV+this.off.y+this.ext.cy;
        c_y_min = this.pV+this.off.y;

        var h_old_pH = this.pH;
        var h_old_pV = this.pV;
        var xmin, ymin, xmax, ymax, glyph, t_rot, t_pH, t_pV, t_x, t_y, t_cx, t_cy, hc, vc, t_xc, t_yc, sin,cos;
        hc=this.pH+this.off.x+this.ext.cx*0.5;
        vc=this.pV+this.off.y+this.ext.cy*0.5;
        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);

        glyph=this.ArrGlyph[0];
        t_rot=glyph.rot;
        while(t_rot<0)
        {
            t_rot+=Math.PI*2;
        }
        while(t_rot>Math.PI*2)
        {
            t_rot-=2*Math.PI;
        }
        t_xc=glyph.pH+glyph.off.x+glyph.ext.cx*0.5;
        t_yc=glyph.pV+glyph.off.y+glyph.ext.cy*0.5;

        if(t_rot<Math.PI/4||t_rot>Math.PI*7/4 ||
            (t_rot>Math.PI*3/4 && t_rot<Math.PI*5/4))
        {
            xmin=t_xc-glyph.ext.cx*0.5;
            ymin=t_yc-glyph.ext.cy*0.5;
            xmax=t_xc+glyph.ext.cx*0.5;
            ymax=t_yc+glyph.ext.cy*0.5;
        }
        else
        {
            xmin=t_xc-glyph.ext.cy*0.5;
            ymin=t_yc-glyph.ext.cx*0.5;
            xmax=t_xc+glyph.ext.cy*0.5;
            ymax=t_yc+glyph.ext.cx*0.5;
        }


        var t_x_min, t_y_min, t_x_max, t_y_max;
        for(var i=1; i<this.ArrGlyph.length; i++)
        {
            glyph=this.ArrGlyph[i];
            t_rot=glyph.rot;
            while(t_rot<0)
            {
                t_rot+=Math.PI*2;
            }
            while(t_rot>Math.PI*2)
            {
                t_rot-=2*Math.PI;
            }
                t_xc=glyph.pH+glyph.off.x+glyph.ext.cx*0.5;
            t_yc=glyph.pV+glyph.off.y+glyph.ext.cy*0.5;

            if(t_rot<Math.PI*0.25||t_rot>Math.PI*1.75 ||
                (t_rot>Math.PI*0.75&&t_rot<Math.PI*1.25))
            {
                t_x_min=t_xc-glyph.ext.cx*0.5;
                t_y_min=t_yc-glyph.ext.cy*0.5;
                t_x_max=t_xc+glyph.ext.cx*0.5;
                t_y_max=t_yc+glyph.ext.cy*0.5;
            }
            else
            {
                t_x_min=t_xc-glyph.ext.cy*0.5;
                t_y_min=t_yc-glyph.ext.cx*0.5;
                t_x_max=t_xc+glyph.ext.cy*0.5;
                t_y_max=t_yc+glyph.ext.cx*0.5;
            }

            if(t_x_min<xmin)
                xmin=t_x_min;
            if(t_y_min<ymin)
                ymin=t_y_min;

            if(t_x_max>xmax)
                xmax=t_x_max;
            if(t_y_max>ymax)
                ymax=t_y_max;
        }

        t_x=this.ext.cx*0.5;
        t_y=this.ext.cy*0.5;

        t_pH=hc-(t_x*cos-t_y*sin);
        t_pV=vc-(t_x*sin+t_y*cos);

        var dx, dy, tx1, ty1;
        dx=xmin-this.pH;
        dy=ymin-this.pV;





        var glyph = this.ArrGlyph[0];
        var x_max, x_min, y_max, y_min;
        var xc, yc;
        xc = glyph.pH+glyph.off.x+glyph.ext.cx*0.5;
        yc = glyph.pV+glyph.off.y+glyph.ext.cy*0.5;
        if(glyph.rot<Math.PI*0.25||glyph.rot>Math.PI*1.75 ||
            (glyph.rot>Math.PI*0.75&&glyph.rot<Math.PI*1.25))
        {
            x_min=xc-glyph.ext.cx*0.5;
            y_min=yc-glyph.ext.cy*0.5;
            x_max=xc+glyph.ext.cx*0.5;
            y_max=yc+glyph.ext.cy*0.5;
        }
        else
        {
            x_min=xc-glyph.ext.cy*0.5;
            y_min=yc-glyph.ext.cx*0.5;
            x_max=xc+glyph.ext.cy*0.5;
            y_max=yc+glyph.ext.cx*0.5;
        }

        for(i = 1; i < this.ArrGlyph.length;++i)
        {
            glyph = this.ArrGlyph[i];
            xc = glyph.pH+glyph.off.x+glyph.ext.cx*0.5;
            yc = glyph.pV+glyph.off.y+glyph.ext.cy*0.5;

            if(glyph.rot<Math.PI*0.25||glyph.rot>Math.PI*1.75 ||
                (glyph.rot>Math.PI*0.75&&glyph.rot<Math.PI*1.25))
            {
                if(xc-glyph.ext.cx*0.5<x_min)
                {
                    x_min=xc-glyph.ext.cx*0.5;
                }
                if(yc-glyph.ext.cy*0.5<y_min)
                {
                    y_min=yc-glyph.ext.cy*0.5;
                }

                if(xc+glyph.ext.cx*0.5>x_max)
                {
                    x_max=xc+glyph.ext.cx*0.5;
                }

                if(yc+glyph.ext.cy*0.5>y_max)
                {
                    y_max=yc+glyph.ext.cy*0.5;
                }
            }
            else
            {
                if(xc-glyph.ext.cy*0.5<x_min)
                    x_min=xc-glyph.ext.cy*0.5;
                if(yc-glyph.ext.cx*0.5<y_min)
                    y_min=yc-glyph.ext.cx*0.5;
                if(xc+glyph.ext.cy*0.5>x_max)
                    x_max=xc+glyph.ext.cy*0.5;
                if(yc+glyph.ext.cx*0.5>y_max)
                    y_max=yc+glyph.ext.cx*0.5;
            }
        }



        var _t;
        var _x_min_clear = x_min;
        var _y_min_clear = y_min;
        if(this.flipH)
        {
            _t = x_max;
            x_max = this.ext.cx - x_min;
            x_min = this.ext.cx - _t;
        }


        if(this.flipV)
        {
            _t = y_max;
            y_max = this.ext.cy - y_min;
            y_min = this.ext.cy - _t;
        }

        /*dx=x_min;
        dy=y_min;

        tx1=dx*cos-dy*sin;
        ty1=dx*sin+dy*cos;  */

        tx1=x_min*cos-y_min*sin;
        ty1=x_min*sin+y_min*cos;

        t_pH=t_pH+tx1;
        t_pV=t_pV+ty1;

        dx=(x_max-x_min)*0.5;
        dy=(y_max-y_min)*0.5;


        this.pH=t_pH+dx*cos-dy*sin-dx;
        this.pV=t_pV+dx*sin+dy*cos-dy;

        this.off = {x: 0, y:0};
        var DX = x_max-x_min, DY = y_max-y_min;
        this.ext = {cx: DX>min_size2 ? DX : min_size2, cy: DY>min_size2  ? DY : min_size2};

        for(var i = 0; i<this.ArrGlyph.length; ++i)
        {
            this.ArrGlyph[i].pH-=_x_min_clear;
            this.ArrGlyph[i].pV-=_y_min_clear;
            this.ArrGlyph[i].RecalculateTransformMatrix();
        }
        var historyData = {};
        historyData.offX = _x_min_clear;
        historyData.offY = _y_min_clear;
        historyData.old_pH = h_old_pH;
        historyData.old_pV = h_old_pV;
        historyData.new_pH = this.pH;
        historyData.new_pV = this.pV;
        historyData.undo_function = function(data)
        {
            for(var i = 0; i<this.ArrGlyph.length; ++i)
            {
                this.ArrGlyph[i].pH += data.offX;
                this.ArrGlyph[i].pV += data.offY;
                this.ArrGlyph[i].RecalculateTransformMatrix();
            }
            this.pH = data.old_pH;
            this.pV = data.old_pV;
        };
        historyData.redo_function = function(data)
        {
            for(var i = 0; i<this.ArrGlyph.length; ++i)
            {
                this.ArrGlyph[i].pH -= data.offX;
                this.ArrGlyph[i].pV -= data.offY;
                this.ArrGlyph[i].RecalculateTransformMatrix();
            }
            this.pH = data.new_pH;
            this.pV = data.new_pV;
        };
        History.Add(this, historyData);
        this.RecalculateTransformMatrix();
        this.calculateXfrm();
    },


   /* RecalculateAfterResize : function()
    {
        var _shape, _shape_rot,_x_min, _y_min, _x_max, _y_max, _xc, _yc,
            _hc, _vc, _x_min_cur, _y_min_cur, _x_max_cur, _y_max_cur;
        var _shape_index;
        var _shapes = this.ArrGlyph;
        _shape = _shapes[0];
        _shape_rot = _shape.rot;
        while(_shape_rot < 0)
        {
            _shape_rot += 2*Math.PI;
        }
        while(_shape_rot >= 2*Math.PI)
        {
            _shape_rot -= 2*Math.PI;
        }

        var _pi_cd_4 = Math.PI/4;
        var _pi_7_cd_4 = Math.PI*7/4;
        var _pi_3_cd_4 = Math.PI*3/4;
        var _pi_5_cd_4 = Math.PI*5/4;
        if(_shape_rot < _pi_cd_4 || _shape_rot > _pi_7_cd_4 || (_shape_rot > _pi_3_cd_4 && _shape_rot < _pi_5_cd_4))
        {
            _x_min = _shape.pH;
            _y_min = _shape.pV;
            _x_max = _shape.pH + _shape.ext.cx;
            _y_max = _shape.pV + _shape.ext.cy;
        }
        else
        {
            _hc = _shape.ext.cx*0.5;
            _vc = _shape.ext.cy*0.5;
            _xc = _shape.pH + _hc;
            _yc = _shape.pV + _vc;

            _x_min = _xc - _vc;
            _y_min = _yc - _hc;
            _x_max = _xc + _vc;
            _y_max = _yc + _hc;
        }

        for(_shape_index = 1; _shape_index < _shapes.length; ++_shape_index)
        {
            _shape = _shapes[_shape_index];
            _shape_rot = _shape.rot;
            while(_shape_rot < 0)
            {
                _shape_rot += 2*Math.PI;
            }
            while(_shape_rot >= 2*Math.PI)
            {
                _shape_rot -= 2*Math.PI;
            }

            if(_shape_rot < _pi_cd_4 || _shape_rot > _pi_7_cd_4 || (_shape_rot > _pi_3_cd_4 && _shape_rot < _pi_5_cd_4))
            {
                _x_min_cur = _shape.pH;
                _y_min_cur = _shape.pV;
                _x_max_cur = _shape.pH + _shape.ext.cx;
                _y_max_cur = _shape.pV + _shape.ext.cy;
            }
            else
            {
                _hc = _shape.ext.cx*0.5;
                _vc = _shape.ext.cy*0.5;
                _xc = _shape.pH + _hc;
                _yc = _shape.pV + _vc;

                _x_min_cur = _xc - _vc;
                _y_min_cur = _yc - _hc;
                _x_max_cur = _xc + _vc;
                _y_max_cur = _yc + _hc;
            }

            if(_x_max_cur > _x_max)
            {
                _x_max = _x_max_cur;
            }
            if(_y_max_cur > _y_max)
            {
                _y_max = _y_max_cur;
            }

            if(_x_min_cur < _x_min)
            {
                _x_min = _x_min_cur;
            }
            if(_y_min_cur < _y_min)
            {
                _y_min = _y_min_cur;
            }
        }

        var _x_lt, _y_lt, _x_rt, _y_rt, _x_rb, _y_rb, _x_lb, _y_lb;
    },   */


    resetTextStyles : function()
    {
        for(var i = 0; i < this.ArrGlyph.length ; ++i)
        {
            if(this.ArrGlyph[i].resetTextStyles)
            {
                this.ArrGlyph[i].resetTextStyles();
            }
        }
    },

    /*groupShapes : function()
    {
        if(!this.canGroup())
        {
            return false;
        }
        if(this.State.id == 0)
        {
            //посчитаем количество фигур которых можно сгруппировать
            var i, n;
            var countShapes = 0;
            for(i = 0, n = this.ArrGlyph.length; i < n; ++i)
            {
                if(this.ArrGlyph[i].selected && (!this.ArrGlyph[i].spLocks || !this.ArrGlyph[i].spLocks.noGrp))
                {
                    ++countShapes;
                }
            }
            if(countShapes > 1)
            {
                var groupedShapesArr = [], numPaste;
                History.Create_NewPoint();
                for(i = n-1; i > -1; --i)
                {
                    if(this.ArrGlyph[i].selected && (!this.ArrGlyph[i].spLocks || !this.ArrGlyph[i].spLocks.noGrp))
                    {
                        numPaste = i;
                        break;
                    }
                }
                for(i = n-1; i > -1; --i)
                {
                    if(this.ArrGlyph[i].selected && (!this.ArrGlyph[i].spLocks || !this.ArrGlyph[i].spLocks.noGrp))
                    {
                        var historyData = {};
                        historyData.num = i;
                        historyData.oldGroup = this;
                        historyData.shape = this.ArrGlyph[i];
                        historyData.undo_function = function(data)
                        {
                            data.oldGroup.ArrGlyph.splice(data.num, 0, data.shape);
                            data.shape.setContainer(data.oldGroup);
                        };
                        historyData.redo_function = function(data)
                        {
                            data.oldGroup.ArrGlyph.splice(data.num, 1);
                        };
                        History.Add(this, historyData);
                        groupedShapesArr.push(this.ArrGlyph.splice(i, 1)[0]);
                    }
                }
                groupedShapesArr.reverse();
                var group = CreateGroupShapes(groupedShapesArr);
                group.nvGrpSpPr = new UniNvPr();
                group.nvGrpSpPr.cNvPr.id = ++this.Document.Slides[this.SlideNum].maxId;
                group.setContainer(this);
                historyData = {};
                historyData.group = group;
                historyData.num = numPaste - countShapes + 1;
                historyData.undo_function = function(data)
                {
                    this.ArrGlyph.splice(data.num, 1);
                };
                historyData.redo_function = function(data)
                {
                    this.ArrGlyph.splice(data.num, 0, data.group);
                    data.group.setContainer(this);
                };
                History.Add(this, historyData);
                for(i = 0; i < this.ArrGlyph.length; ++i)
                {
                    this.ArrGlyph[i].selected = false;
                }
                group.selected = true;

                this.ArrGlyph.splice(this.ArrGlyph.length-numPaste, 0, group);
                editor.asc_fireCallback("asc_onCanGroup", this.canGroup());
                editor.asc_fireCallback("asc_onCanUnGroup", this.canUnGroup());
                return true;
            }
        }
        else if(this.State.id == 20)
        {
            var ret = this.group.groupShapes();
            editor.asc_fireCallback("asc_onCanGroup", this.canGroup());
            editor.asc_fireCallback("asc_onCanUnGroup", this.canUnGroup());
            return ret;
        }
        return false;
    },  */


   /* groupShapes : function()
    {
        if(!this.canGroup())
        {
            return false;
        }
        if(this.State.id === 0)
        {
            var _arr_glyphs = this.ArrGlyph;
            var _count_shapes = 0;
            var _shape_index;
            var _cur_shape;
            var _last_index;
            var _grouped_array = [];
            for(_shape_index = 0; _shape_index < _arr_glyphs.length; ++_shape_index)
            {
                _cur_shape = _arr_glyphs[_shape_index];
                if(_cur_shape.selected && (!_cur_shape.spLocks || !_cur_shape.spLocks.noGrp))
                {
                    ++_count_shapes;
                    _grouped_array.push(_cur_shape);
                    _last_index = _shape_index;
                }
            }
            if(_count_shapes > 1)
            {
                History.Create_NewPoint();
                var _history_obj;
                for(_shape_index = _arr_glyphs.length - 1; _shape_index > -1; --_shape_index)
                {
                    _cur_shape = _arr_glyphs[_shape_index];
                    if(_cur_shape.selected && (!_cur_shape.spLocks || !_cur_shape.spLocks.noGrp))
                    {
                        _arr_glyphs.splice(_shape_index, 1);
                    }
                    _history_obj = {};
                    _history_obj.shape = _cur_shape;
                    _history_obj.shapeIndex = _shape_index;
                    _history_obj.undo_function = function(data)
                    {
                        this.ArrGlyph.splice(data.shapeIndex, 0, data.shape);
                        data.shape.setContainer(this);
                    };
                    _history_obj.redo_function = function(data)
                    {
                        this.ArrGlyph.splice(data.shapeIndex, 1);
                    };
                    History.Add(this, _history_obj);
                }
                var group = CreateGroupShapes(_grouped_array);
                group.nvGrpSpPr = new UniNvPr();
                group.nvGrpSpPr.cNvPr.id = ++this.Document.Slides[this.SlideNum].maxId;
                group.setContainer(this);

                _history_obj = {};
                _history_obj.group = group;
                _history_obj.undo_function = function(data)
                {
                };
                _history_obj.redo_function = function(data)
                {
                    data.group.setContainer(this);
                };
                History.Add(this, _history_obj);



                var _paste_index = _last_index - _count_shapes + 1;
                this.ArrGlyph.splice(_paste_index, 0, group);


                _history_obj = {};
                _history_obj.group = group;
                _history_obj.index = _paste_index;
                _history_obj.undo_function = function(data)
                {
                    this.ArrGlyph.splice(data.index, 1);
                };
                _history_obj.redo_function = function(data)
                {
                    this.ArrGlyph.splice(data.index, 0, data.group);
                };
                History.Add(this, _history_obj);
                for(_shape_index = 0; _shape_index < this.ArrGlyph.length; ++_shape_index)
                {
                    this.ArrGlyph[_shape_index].selected = false;
                }
                this.ArrGlyph[_paste_index].selected = true;
                editor.asc_fireCallback("asc_onCanGroup", this.canGroup());
                editor.asc_fireCallback("asc_onCanUnGroup", this.canUnGroup());
                return true;
            }
        }
        else if(this.State.id === 20)
        {
            var ret = this.group.groupShapes();
            editor.asc_fireCallback("asc_onCanGroup", this.canGroup());
            editor.asc_fireCallback("asc_onCanUnGroup", this.canUnGroup());
            return ret;
        }
        return false;
    },

    unGroupShapes : function()
    {
        if(!this.canUnGroup())
        {
            return false;
        }
        if(this.State.id == 0)
        {
            var i, n;
            History.Create_NewPoint();
            for(i = 0; i < this.ArrGlyph.length; ++i)
            {
                if(this.ArrGlyph[i].selected)
                {
                    if(this.ArrGlyph[i].IsGroup())
                    {
                        var group = this.ArrGlyph.splice(i, 1)[0];
                        var historyObj = {};
                        historyObj.group = group;
                        historyObj.num = i;
                        historyObj.undo_function = function(data)
                        {
                            this.ArrGlyph.splice(data.num, 0, data.group);
                            group.Recalculate();
                        };
                        historyObj.redo_function = function(data)
                        {
                            this.ArrGlyph.splice(data.num, 1);
                        };
                        History.Add(this, historyObj);
                        for(var j = 0; j < group.ArrGlyph.length; ++j)
                        {
                            var shapeGr = group.ArrGlyph[j];
                            historyObj = {};
                            historyObj.old_Container = group;
                            historyObj.new_Container = this;
                            shapeGr.setContainer(this);

                            var xc = shapeGr.pH + shapeGr.ext.cx*0.5;
                            var yc = shapeGr.pV + shapeGr.ext.cy*0.5;
                            var xcT = group.TransformMatrix.TransformPointX(xc, yc);
                            var ycT = group.TransformMatrix.TransformPointY(xc, yc);

                            historyObj.old_pH = shapeGr.pH;
                            historyObj.old_pV = shapeGr.pV;
                            historyObj.old_flipH = shapeGr.flipH;
                            historyObj.old_flipV = shapeGr.flipV;
                            shapeGr.pH = xcT - shapeGr.ext.cx*0.5;
                            shapeGr.pV = ycT - shapeGr.ext.cy*0.5;
                            shapeGr.flipH = group.flipH ? !shapeGr.flipH : shapeGr.flipH;
                            shapeGr.flipV = group.flipV ? !shapeGr.flipV : shapeGr.flipV;
                            historyObj.new_pH = shapeGr.pH;
                            historyObj.new_pV = shapeGr.pV;
                            historyObj.new_flipH = shapeGr.flipH;
                            historyObj.new_flipV = shapeGr.flipV;
                            historyObj.old_rot = shapeGr.rot;
                            var tmpRot = shapeGr.rot + group.rot;
                            while(tmpRot >= Math.PI*2 )
                            {
                                tmpRot-=2*Math.PI;
                            }
                            while(tmpRot < 0)
                            {
                                tmpRot+=2*Math.PI;
                            }
                            shapeGr.rot = tmpRot;
                            shapeGr.selected = true;
                            historyObj.new_rot = shapeGr.rot;
                            historyObj.new_num = i+j;
                            this.ArrGlyph.splice(i+j, 0, shapeGr);
                            historyObj.undo_function = function(data)
                            {
                                this.setContainer(data.old_Container);
                                this.pH = data.old_pH;
                                this.pV = data.old_pV;
                                this.flipH = data.old_flipH;
                                this.flipV = data.old_flipV;
                                this.rot = data.old_rot;
                                data.new_Container.ArrGlyph.splice(data.new_num, 1);
                                this.selected = false;
                            };
                            historyObj.redo_function = function(data)
                            {
                                this.setContainer(data.new_Container);
                                this.pH = data.new_pH;
                                this.pV = data.new_pV;
                                this.flipH = data.new_flipH;
                                this.flipV = data.new_flipV;
                                this.rot = data.new_rot;
                                data.new_Container.ArrGlyph.splice(data.new_num, 0, this);
                                this.selected = true;
                                this.Recalculate();
                            };
                            History.Add(shapeGr, historyObj);
                            shapeGr.Recalculate();
                        }
                        i+=group.ArrGlyph.length-1;
                    }
                }
            }
            return true;
        }
        else if(this.State.id == 20)
        {
            this.group.unGroupShapes();
        }
        return false;
    }, */


    groupShapes : function()
    {
        if(!this.canGroup())
        {
            return false;
        }
        if(this.State.id == 0)
        {
            //посчитаем количество фигур которых можно сгруппировать
            var i, n;
            var countShapes = 0;
            for(i = 0, n = this.ArrGlyph.length; i < n; ++i)
            {
                if(this.ArrGlyph[i].selected && (!this.ArrGlyph[i].spLocks || !this.ArrGlyph[i].spLocks.noGrp))
                {
                    ++countShapes;
                }
            }
            if(countShapes > 1)
            {
                var groupedShapesArr = [], numPaste;
                History.Create_NewPoint();
                for(i = n-1; i > -1; --i)
                {
                    if(this.ArrGlyph[i].selected && (!this.ArrGlyph[i].spLocks || !this.ArrGlyph[i].spLocks.noGrp))
                    {
                        numPaste = i;
                        break;
                    }
                }
                for(i = n-1; i > -1; --i)
                {
                    if(this.ArrGlyph[i].selected && (!this.ArrGlyph[i].spLocks || !this.ArrGlyph[i].spLocks.noGrp))
                    {
                        var historyData = {};
                        historyData.num = i;
                        historyData.oldGroup = this;
                        historyData.shape = this.ArrGlyph[i];
                        historyData.undo_function = function(data)
                        {
                            data.oldGroup.ArrGlyph.splice(data.num, 0, data.shape);
                        };
                        historyData.redo_function = function(data)
                        {
                            data.oldGroup.ArrGlyph.splice(data.num, 1);
                        };
                        History.Add(this, historyData);
                        groupedShapesArr.push(this.ArrGlyph.splice(i, 1)[0]);
                    }
                }
                groupedShapesArr.reverse();
                var group = CreateGroupShapes(groupedShapesArr);
                group.nvGrpSpPr = new UniNvPr();
                group.nvGrpSpPr.cNvPr.id = ++this.Document.Slides[this.SlideNum].maxId;
                group.setContainer(this);
                historyData = {};
                historyData.group = group;
                historyData.num = numPaste - countShapes + 1;
                historyData.undo_function = function(data)
                {
                    this.ArrGlyph.splice(data.num, 1);
                };
                historyData.redo_function = function(data)
                {
                    this.ArrGlyph.splice(data.num, 0, data.group);
                    data.group.setContainer(this);
                };
                History.Add(this, historyData);
                for(i = 0; i < this.ArrGlyph.length; ++i)
                {
                    this.ArrGlyph[i].selected = false;
                }
                group.selected = true;

                this.ArrGlyph.splice(numPaste - countShapes + 1, 0, group);
                editor.asc_fireCallback("asc_onCanGroup", this.canGroup());
                editor.asc_fireCallback("asc_onCanUnGroup", this.canUnGroup());
                return true;
            }
        }
        else if(this.State.id == 20)
        {
            var ret = this.group.groupShapes();
            editor.asc_fireCallback("asc_onCanGroup", this.canGroup());
            editor.asc_fireCallback("asc_onCanUnGroup", this.canUnGroup());
            return ret;
        }
        return false;
    },

    unGroupShapes : function()
    {
        if(!this.canUnGroup())
        {
            return false;
        }
        if(this.State.id == 0)
        {
            var i, n;
            History.Create_NewPoint();
            for(i = 0; i < this.ArrGlyph.length; ++i)
            {
                if(this.ArrGlyph[i].selected)
                {
                    if(this.ArrGlyph[i].IsGroup())
                    {
                        var group = this.ArrGlyph.splice(i, 1)[0];
                        var historyObj = {};
                        historyObj.group = group;
                        historyObj.num = i;
                        historyObj.undo_function = function(data)
                        {
                            this.ArrGlyph.splice(data.num, 0, data.group);
                            group.Recalculate();
                        };
                        historyObj.redo_function = function(data)
                        {
                            this.ArrGlyph.splice(data.num, 1);
                        };
                        History.Add(this, historyObj);
                        for(var j = 0; j < group.ArrGlyph.length; ++j)
                        {
                            var shapeGr = group.ArrGlyph[j];
                            historyObj = {};
                            historyObj.old_Container = group;
                            historyObj.new_Container = this;
                            shapeGr.setContainer(this);

                            var xc = shapeGr.pH + shapeGr.ext.cx*0.5;
                            var yc = shapeGr.pV + shapeGr.ext.cy*0.5;
                            var groupLocalTransform = group.getLocalTransform();
                            var xcT = groupLocalTransform.TransformPointX(xc, yc);
                            var ycT = groupLocalTransform.TransformPointY(xc, yc);

                            historyObj.old_pH = shapeGr.pH;
                            historyObj.old_pV = shapeGr.pV;
                            historyObj.old_flipH = shapeGr.flipH;
                            historyObj.old_flipV = shapeGr.flipV;
                            shapeGr.pH = xcT - shapeGr.ext.cx*0.5;
                            shapeGr.pV = ycT - shapeGr.ext.cy*0.5;
                            shapeGr.flipH = group.flipH ? !shapeGr.flipH : shapeGr.flipH;
                            shapeGr.flipV = group.flipV ? !shapeGr.flipV : shapeGr.flipV;
                            historyObj.new_pH = shapeGr.pH;
                            historyObj.new_pV = shapeGr.pV;
                            historyObj.new_flipH = shapeGr.flipH;
                            historyObj.new_flipV = shapeGr.flipV;
                            historyObj.old_rot = shapeGr.rot;
                            var tmpRot = shapeGr.rot + group.rot;
                            while(tmpRot >= Math.PI*2 )
                            {
                                tmpRot-=2*Math.PI;
                            }
                            while(tmpRot < 0)
                            {
                                tmpRot+=2*Math.PI;
                            }
                            shapeGr.rot = tmpRot;
                            shapeGr.selected = true;
                            historyObj.new_rot = shapeGr.rot;
                            historyObj.new_num = i+j;
                            this.ArrGlyph.splice(i+j, 0, shapeGr);
                            historyObj.undo_function = function(data)
                            {
                                this.setContainer(data.old_Container);
                                this.pH = data.old_pH;
                                this.pV = data.old_pV;
                                this.flipH = data.old_flipH;
                                this.flipV = data.old_flipV;
                                this.rot = data.old_rot;
                                data.new_Container.ArrGlyph.splice(data.new_num, 1);
                                this.selected = false;
                            };
                            historyObj.redo_function = function(data)
                            {
                                this.setContainer(data.new_Container);
                                this.pH = data.new_pH;
                                this.pV = data.new_pV;
                                this.flipH = data.new_flipH;
                                this.flipV = data.new_flipV;
                                this.rot = data.new_rot;
                                data.new_Container.ArrGlyph.splice(data.new_num, 0, this);
                                this.selected = true;
                                this.Recalculate();
                            };
                            History.Add(shapeGr, historyObj);
                            shapeGr.Recalculate();
                        }
                        i+=group.ArrGlyph.length-1;
                    }
                }
            }

            editor.asc_fireCallback("asc_onCanGroup", this.canGroup());
            editor.asc_fireCallback("asc_onCanUnGroup", this.canUnGroup());
            return true;
        }
        else if(this.State.id == 20)
        {
            var ret =  this.group.unGroupShapes();
            editor.asc_fireCallback("asc_onCanGroup", this.canGroup());
            editor.asc_fireCallback("asc_onCanUnGroup", this.canUnGroup());
            return ret;
        }
        return false;
    },
    canGroup : function()
    {
        switch(this.State.id)
        {
            case 0 :
            {
                var _shape_index;
                var _shapes = this.ArrGlyph;
                var _shape_num = _shapes.length;
                var _selected_count = 0;
                for(_shape_index = 0; _shape_index < _shape_num; ++_shape_index)
                {
                    if(_shapes[_shape_index].selected)
                    {
                        ++_selected_count;
                        if(_shapes[_shape_index].isPlaceholder() || _shapes[_shape_index].spLocks != undefined && _shapes[_shape_index].spLocks.noGrp === true)
                        {
                            return false;
                        }
                    }
                }
                return _selected_count > 1 && _selected_count != this.ArrGlyph.length;
            }
            case 20 :
            {
                return this.group.canGroup();
            }
            default :
            {
                return false;
            }
        }
    },

    canUnGroup : function()
    {
        switch(this.State.id)
        {
            case 0 :
            {
                var _shape_index;
                var _shapes = this.ArrGlyph;
                var _shape_num = _shapes.length;
                var _selected_count = 0;
                for(_shape_index = 0; _shape_index < _shape_num; ++_shape_index)
                {
                    if(_shapes[_shape_index].selected)
                    {
                        ++_selected_count;
                        if(!_shapes[_shape_index].IsGroup())
                        {
                            return false;
                        }
                    }
                }
                return _selected_count > 0;
            }
            case 20 :
            {
                return this.group.canUnGroup();
            }
            default :
            {
                return false;
            }
        }
    },

    getPresetGeom: function()
    {
        var _ret = null;
        var _shapes = this.ArrGlyph;
        var _shape_index;
        for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
        {
            if(_shapes[_shape_index] instanceof CShape || _shapes[_shape_index] instanceof GroupShape)
            {
                _ret = _shapes[_shape_index].getPresetGeom();
                if(_ret == null)
                {
                    return null;
                }
                break;
            }
        }
        if(_shape_index < _shapes.length)
        {
            ++_shape_index;
            var _cur_preset;
            for(;_shape_index < _shapes.length; ++_shape_index)
            {
                if(_shapes[_shape_index] instanceof CShape || _shapes[_shape_index] instanceof GroupShape)
                {
                    _cur_preset = _shapes[_shape_index].getPresetGeom();
                    if(_cur_preset == null || _cur_preset != _ret)
                    {
                        return null;
                    }
                }
            }
        }
        return _ret;
    },

    getFill: function()
    {
        var _ret = null;
        var _shapes = this.ArrGlyph;
        var _shape_index;
        for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
        {
            if(_shapes[_shape_index] instanceof CShape || _shapes[_shape_index] instanceof GroupShape)
            {
                _ret = _shapes[_shape_index].getFill();
                if(_ret == null)
                {
                    return null;
                }
                break;
            }
        }
        if(_shape_index < _shapes.length)
        {
            ++_shape_index;
            var _cur_fill;
            for(;_shape_index < _shapes.length; ++_shape_index)
            {
                if(_shapes[_shape_index] instanceof CShape || _shapes[_shape_index] instanceof GroupShape)
                {
                    _cur_fill = _shapes[_shape_index].getFill();
                    _ret = CompareUniFill(_ret, _cur_fill);
                }
            }
        }
        return _ret;
    },

    getStroke: function()
    {
        var _ret = null;
        var _shapes = this.ArrGlyph;
        var _shape_index;
        for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
        {
            if(_shapes[_shape_index] instanceof CShape || _shapes[_shape_index] instanceof GroupShape)
            {
                _ret = _shapes[_shape_index].getStroke();
                if(_ret == null)
                {
                    return null;
                }
                break;
            }
        }
        if(_shape_index < _shapes.length)
        {
            ++_shape_index;
            var _cur_line;
            for(;_shape_index < _shapes.length; ++_shape_index)
            {
                if(_shapes[_shape_index] instanceof CShape || _shapes[_shape_index] instanceof GroupShape)
                {
                    _cur_line = _shapes[_shape_index].getStroke();
                    if(_cur_line == null)
                    {
                        return null;
                    }
                    else
                    {
                        _ret = _ret.compare(_cur_line);
                    }
                }
            }
        }
        return _ret;
    },

    canChangeArrows: function()
    {
        var _ret = false;
        var _shapes = this.ArrGlyph;
        var _shape_index;
        for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
        {
            if(_shapes[_shape_index].canChangeArrows)
            {
                _ret = _shapes[_shape_index].canChangeArrows();
                if(_ret == false)
                {
                    return false;
                }
                break;
            }
        }
        if(_shape_index < _shapes.length)
        {
            ++_shape_index;
            var _cur_line;
            for(;_shape_index < _shapes.length; ++_shape_index)
            {
                if(_shapes[_shape_index].canChangeArrows)
                {
                    if(_shapes[_shape_index].canChangeArrows() == false)
                    {
                        return false;
                    }
                }
            }
        }
        return _ret;
    },



    changePresetGeom: function(preset)
    {
        for(var _shape_index = 0; _shape_index < this.ArrGlyph.length; ++_shape_index)
        {
            if(this.ArrGlyph[_shape_index].changePresetGeom)
            {
                this.ArrGlyph[_shape_index].changePresetGeom(preset);
            }
        }
    },

    changeFill: function(fill)
    {
        for(var _shape_index = 0; _shape_index < this.ArrGlyph.length; ++_shape_index)
        {
            if(this.ArrGlyph[_shape_index].changeFill)
            {
                this.ArrGlyph[_shape_index].changeFill(fill);
            }
        }
    },


    changeLine: function(line)
    {
        for(var _shape_index = 0; _shape_index < this.ArrGlyph.length; ++_shape_index)
        {
            if(this.ArrGlyph[_shape_index].changeLine)
            {
                this.ArrGlyph[_shape_index].changeLine(line);
            }
        }
    },

    Undo: function(data)
    {
        data.undo_function.call(this, data);
    },

    Redo: function(data)
    {
        data.redo_function.call(this, data);
    },


    addHistorySelectedState : function()
    {
        var autoShapesHistoryData = {};
        autoShapesHistoryData.selectionMap = clonePrototype(this.selectionMap);
        autoShapesHistoryData.undo_function = function(data)
        {
            for(var i = 0; i<data.selectionMap.length; ++ i)
            {
                this.ArrGlyph[i].selected = data.selectionMap[i];
            }
            this.selectedCount();
            this.Document.DrawingDocument.EndTrackAutoShape();
            this.Document.DrawingDocument.OnRecalculatePage(this.SlideNum,this.Document.Slides[this.SlideNum]);
        };
        autoShapesHistoryData.redo_function = autoShapesHistoryData.undo_function;
        History.Add(this, autoShapesHistoryData);
    },


    addHistorySelectedStateAfterDel : function()
    {
        var autoShapesHistoryData = {};
        autoShapesHistoryData.selectionMap = clonePrototype(this.selectionMap);
        autoShapesHistoryData.undo_function = function(data)
        {
            for(var i = 0; i<data.selectionMap.length; ++ i)
            {
                this.ArrGlyph[i].selected = data.selectionMap[i];
            }
            this.selectedCount();
            this.Document.DrawingDocument.EndTrackAutoShape();
            this.Document.DrawingDocument.OnRecalculatePage(this.SlideNum,this.Document.Slides[this.SlideNum]);
        };
        autoShapesHistoryData.redo_function = function(data)
        {
            this.NumSelected = 0;
            this.Document.DrawingDocument.EndTrackAutoShape();
            this.Document.DrawingDocument.OnRecalculatePage(this.SlideNum,this.Document.Slides[this.SlideNum]);
        };
        History.Add(this, autoShapesHistoryData);
    },

    selectedCount : function()
    {
        this.NumSelected = 0;
        for(var i = 0; i < this.ArrGlyph.length; ++i )
        {
            if(this.ArrGlyph[i].selected)
            {
                ++this.NumSelected;
            }
        }
    },

    updateSelectionMap : function()
    {
        this.selectionMap = [];
        for(var i = 0; i<this.ArrGlyph.length; ++i)
        {
            this.selectionMap[i] = this.ArrGlyph[i].selected;
        }
    },

    Document_UpdateInterfaceTextState : function()
    {},

    Document_UpdateSelectionState : function()
    {},

    getImageProps: function()
    {
        var _objects = this.ArrGlyph;
        var _cur_object;
        var _object_index;
        var _object_count = _objects.length;
        var _cur_image_props;
        var _result_image_props = null;
        for(_object_index = 0; _object_index < _object_count; ++_object_index)
        {
            _cur_object = _objects[_object_index];
            if(_cur_object instanceof CImage2 || _cur_object instanceof GroupShape)
            {
                _cur_image_props = _cur_object.getImageProps();
                if(_cur_image_props !== null)
                {
                    if(_result_image_props === null)
                    {
                        _result_image_props = _cur_image_props;
                    }
                    else
                    {
                        _result_image_props = CompareImageProperties(_result_image_props, _cur_image_props);
                    }
                }
            }
        }
        return _result_image_props;
    },

    updateProportions: function(kW, kH)
    {
        var _xfrm;
        var _rot;
        if(this.parent.kind === LAYOUT_KIND || this.parent.kind === MASTER_KIND)
        {
            if(this.isPlaceholder())
            {
                _xfrm = this.spPr.xfrm;
                _rot = _xfrm.rot === null ? 0 : _xfrm.rot;
                if(typeof _xfrm.offX === "number")
                    _xfrm.offX *= kW;
                if(typeof _xfrm.offY === "number")
                    _xfrm.offY *= kH;
                if(_rot < Math.PI*0.25||_rot > Math.PI*1.75 ||
                    (_rot > Math.PI*0.75 && _rot < Math.PI*1.25))
                {
                    if(typeof _xfrm.offX === "number")
                        _xfrm.extX *= kW;
                    if(typeof _xfrm.offY === "number")
                        _xfrm.extY *= kH;
                    if(typeof _xfrm.chOffX === "number")
                        _xfrm.chOffX *= kW;
                    if(typeof _xfrm.chOffY === "number")
                        _xfrm.chOffY *= kH;
                }
                else
                {
                    if(typeof _xfrm.offX === "number")
                        _xfrm.extX *= kH;
                    if(typeof _xfrm.offY === "number")
                        _xfrm.extY *= kW;

                    if(typeof _xfrm.chOffX === "number")
                        _xfrm.chOffX *= kH;
                    if(typeof _xfrm.chOffY === "number")
                        _xfrm.chOffY *= kW;
                }
            }
            else
            {
                _xfrm = this.spPr.xfrm;
                _rot = _xfrm.rot === null ? 0 : _xfrm.rot;
                if(typeof _xfrm.offX === "number")
                    _xfrm.offX *= kW;
                if(typeof _xfrm.offY === "number")
                    _xfrm.offY *= kH;

                if(_rot < Math.PI*0.25||_rot > Math.PI*1.75 ||
                    (_rot > Math.PI*0.75 && _rot < Math.PI*1.25))
                {
                    if(typeof _xfrm.offX === "number")
                        _xfrm.extX *= kW;
                    if(typeof _xfrm.offY === "number")
                        _xfrm.extY *= kH;

                    if(typeof _xfrm.chOffX === "number")
                        _xfrm.chOffX *= kW;
                    if(typeof _xfrm.chOffY === "number")
                        _xfrm.chOffY *= kH;

                    if(this.ext !== null && typeof this.ext === "object")
                    {
                        if(typeof this.ext.cx === "number")
                            this.ext.cx *= kW;

                        if(typeof this.ext.cy === "number")
                            this.ext.cy *= kH;
                    }
                }
                else
                {
                    if(typeof _xfrm.offX === "number")
                        _xfrm.extX *= kH;
                    if(typeof _xfrm.offY === "number")
                        _xfrm.extY *= kW;

                    if(typeof _xfrm.chOffX === "number")
                        _xfrm.chOffX *= kH;
                    if(typeof _xfrm.chOffY === "number")
                        _xfrm.chOffY *= kW;

                    if(this.ext !== null && typeof this.ext === "object")
                    {
                        if(typeof this.ext.cx === "number")
                            this.ext.cx *= kH;

                        if(typeof this.ext.cy === "number")
                            this.ext.cy *= kW;
                    }
                }
                this.pH *= kW;
                this.pV *= kH;


                if(this.parent.calculated === true)
                {
                    this.RecalculateTransformMatrix();
                }
            }
        }

        else if(this.parent.kind === SLIDE_KIND)
        {
            _xfrm = this.spPr.xfrm;
            _rot = _xfrm.rot === null ? 0 : _xfrm.rot;
            if(typeof _xfrm.offX === "number")
                _xfrm.offX *= kW;
            if(typeof _xfrm.offY === "number")
                _xfrm.offY *= kH;

            this.pH *= kW;
            this.pV *= kH;
            if(_rot < Math.PI*0.25||_rot > Math.PI*1.75 ||
                (_rot > Math.PI*0.75 && _rot < Math.PI*1.25))
            {
                if(typeof _xfrm.offX === "number")
                    _xfrm.extX *= kW;
                if(typeof _xfrm.offY === "number")
                    _xfrm.extY *= kH;

                this.ext.cx *= kW;
                this.ext.cy *= kH;
            }
            else
            {
                if(typeof _xfrm.offX === "number")
                    _xfrm.extX *= kH;
                if(typeof _xfrm.offY === "number")
                    _xfrm.extY *= kW;

                this.ext.cx *= kH;
                this.ext.cy *= kW;
            }
            this.RecalculateTransformMatrix();
        }

        var _shapes = this.ArrGlyph;
        var _shape_index;
        var _shape_count = _shapes.length;
        for(_shape_index = 0; _shape_index < _shape_count; ++_shape_index)
        {
            _shapes[_shape_index].updateProportions(kW, kH);
        }

    }
};


function CreateGroupShapes(arrShapes)
{
    var xMax, yMax, xMin, yMin, l, t, r, b;
    var shape, rot;
    var i, n;
    for(i = 0, n = arrShapes.length; i < n; ++i)
    {
        shape = arrShapes[i];
        while(shape.rot >= 2*Math.PI)
        {
            shape.rot-=2*Math.PI;
        }
        while(shape.rot < 0)
        {
            shape.rot+=2*Math.PI;
        }
        shape.selected = false;
    }

    shape = arrShapes[0];
    rot = shape.rot;
    if( (rot >= 0 && rot < Math.PI*0.25) || (rot > 3*Math.PI*0.25 && rot < 5*Math.PI*0.25) || (rot < 7*Math.PI*0.25 && rot < 2*Math.PI) )
    {
        xMin = shape.pH;
        yMin = shape.pV;
        xMax = shape.pH + shape.ext.cx;
        yMax = shape.pV + shape.ext.cy;
    }
    else
    {
        var hc = shape.ext.cx*0.5, vc = shape.ext.cy*0.5;
        var xc = shape.pH + hc, yc = shape.pV + vc;
        xMin = xc - vc;
        yMin = yc - hc;
        xMax = xc + vc;
        yMax = yc + hc;
    }
    for(i = 1, n = arrShapes.length; i < n; ++i)
    {
        shape = arrShapes[i];
        rot = shape.rot;
        if( (rot >= 0 && rot < Math.PI*0.25) || (rot > 3*Math.PI*0.25 && rot < 5*Math.PI*0.25) || (rot < 7*Math.PI*0.25 && rot < 2*Math.PI) )
        {
            l = shape.pH;
            t = shape.pV;
            r = shape.pH + shape.ext.cx;
            b = shape.pV + shape.ext.cy;
        }
        else
        {
            hc = shape.ext.cx*0.5;
            vc = shape.ext.cy*0.5;
            xc = shape.pH + hc;
            yc = shape.pV + vc;

            l = xc - vc;
            t = yc - hc;
            r = xc + vc;
            b = yc + hc;
        }

        if(l < xMin)
        {
            xMin = l;
        }
        if(t < yMin)
        {
            yMin = t;
        }

        if(r > xMax)
        {
            xMax  = r;
        }
        if(b > yMax)
        {
            yMax = b;
        }
    }
    var group = new GroupShape(shape.parent);
    group.spPr.xfrm.offX = xMin;
    group.spPr.xfrm.offY = yMin;
    group.spPr.xfrm.extX = xMax - xMin;
    group.spPr.xfrm.extY = yMax - yMin;
    group.spPr.xfrm.chOffX = xMin;
    group.spPr.xfrm.chOffY = yMin;
    group.spPr.xfrm.chExtX = xMax - xMin;
    group.spPr.xfrm.chExtY = yMax - yMin;
    group.spPr.xfrm.rot = 0;
    group.rot = 0;
    group.ext = {};
    group.off = {x: 0, y : 0};
    group.ext.cx = group.spPr.xfrm.extX;
    group.ext.cy = group.spPr.xfrm.extY;
    group.pH = xMin;
    group.pV = yMin;
    group.cursorTypes = [];

    group.ArrGlyph = arrShapes;
    group.Container = arrShapes[0].Container;
    for(i = 0; i < n; ++i)
    {
        shape = arrShapes[i];
        var historyData = {};
        historyData.old_Container = shape.Container;
        historyData.new_Container =  group;
        shape.setContainer(group);
        historyData.old_pH = shape.pH;
        historyData.new_pH = shape.pH = shape.pH - xMin;
        historyData.old_pV = shape.pV;
        historyData.new_pV = shape.pV = shape.pV - yMin;
        historyData.undo_function = function(data)
        {
            this.pH = data.old_pH;
            this.pV = data.old_pV;
            this.setContainer(data.old_Container);
        };
        historyData.redo_function = function(data)
        {
            this.pH = data.new_pH;
            this.pV = data.new_pV;
            this.setContainer(data.new_Container);
        };
        History.Add(shape, historyData);
    }
    group.Recalculate();
    group.updateCursorTypes();
    return group;
}