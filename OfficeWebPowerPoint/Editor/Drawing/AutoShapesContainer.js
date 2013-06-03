function CSearchSelectionStates()
{
    this.first = {state : null, next: null};
    this.last = null;
    this.curPos = this.first;

    this.isEmpty = function()
    {
        return this.first.state == null;
    };

    this.add =  function(state)
    {
        if(this.isEmpty())
        {
            this.first.state = state;
            this.last = this.first;
        }
        else
        {
            this.last.next = {state: state, next : null};
            this.last = this.last.next;
        }
    };
    this.goToNext = function()
    {
        if( this.curPos= null && this.curPos.next != null)
        {
            this.curPos = this.curPos.next;
            return this.curPos;
        }
        else
        {
            return null;
        }
    };

    this.concatenation = function(states)
    {
        if(states instanceof CSearchSelectionStates && !states.isEmpty())
        {
            if(!this.isEmpty())
            {
                this.last.next = states.first;
                this.last = states.last;
            }
            else
            {
                this.first = states.first;
                this.last = states.last;
                this.curPos = states.first;
            }
        }
    };
}



var historyitem_Shape_Delete = 0;
function AutoShapesContainer(Document, SlideNum)
{
    this.SlideNum = SlideNum;
    this.Document = Document;
    this.DrawingDocument = Document.DrawingDocument;

    this.State = new NullShapeState();
    this.CurPreset = 'sun';
    this.Container = this;

    this.ArrGlyph = [];
    this.ArrTrackObj = [];
    this.preTrackArr = [];

    this.stX = 0;
    this.stY = 0;

    this.obj = {};
    this.NumEditShape = 0;

    this.group = {};
    this.NumGroup =null;

    this.NumSelected=0;

    this.ArrPointSpline= [];

    this.Spline=new Spline();

    this.PolyLine = null;

    this.PolyLine2 = null;

    this.selectionMap = [];
    this.TransformMatrix = new CMatrixL();

    this.tmpHistoryData = {};

    this.copyGlyphs = [];

    this.searchSelectionStates = null;
    this.maxLevel = 0;

    this.lastPastePosX = null;
    this.lastPastePosY = null;
    this.selectionRect = null;//{ x: 0, y : 0, w : 0, h: 0};
}

AutoShapesContainer.prototype=
{
    Save_Changes : function(){},


    canSetVerticalAlign: function(align)
    {
        if(this.Document.CurPos.Type === docpostype_FlowObjects)
        {
           if(this.obj && this.obj.txBody)
           {
               if(this.obj.txBody.compiledBodyPr)
               {
                    return !(this.obj.txBody.compiledBodyPr.anchor === align)
               }
               else
               {
                   return true;
               }
           }
           else
           {
               return false;
           }
        }
        else
        {
            var _elements = this;
            if(_elements.State.id === 20)
            {
                while(_elements.State.id === 20)
                {
                    _elements = _elements.group;
                }
            }
            if(_elements.State.id === 0)
            {
                var _shapes = _elements.ArrGlyph;
                var _shape_index;
                var _shape;
                for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
                {
                    _shape = _shapes[_shape_index];
                    if(_shape.selected)
                    {
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
                }
            }
            return false;
        }
    },

    setVerticalAlign : function(align)
    {
        if(!this.canSetVerticalAlign(align))
        {
            return false;
        }
        History.Create_NewPoint();
        if(this.Document.CurPos.Type === docpostype_FlowObjects)
        {
            if(this.obj != null && this.obj.setVerticalAlign)
            {
                this.obj.setVerticalAlign(align);
                return true;
            }
        }

        var _elements = this;
        if(_elements.State.id === 20)
        {
            while(_elements.State.id === 20)
            {
                _elements = _elements.group;
            }
        }
        var _shapes = _elements.ArrGlyph;
        var _shape_index;
        var _shape;
        for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
        {
            _shape = _shapes[_shape_index];
            if(_shape.selected)
            {
                if(_shape.setVerticalAlign)
                {
                    _shape.setVerticalAlign(align);
                }
            }
        }

        this.Document.Document_UpdateUndoRedoState();
        return true;
    },

    getVerticalAlign: function()
    {
        if(this.Document.CurPos.Type === docpostype_FlowObjects)
        {
            if(this.obj && this.obj.txBody)
            {
                if(this.obj.txBody.compiledBodyPr && typeof (this.obj.txBody.compiledBodyPr.anchor) == "number")
                {
                    return this.obj.txBody.compiledBodyPr.anchor;
                }
            }
            return null;
        }
        var _elements = this;
        if(_elements.State.id === 20)
        {
            while(_elements.State.id === 20)
            {
                _elements = _elements.group;
            }
        }
        if(_elements.State.id === 0)
        {
            var _result_align = null;
            var _cur_align;
            var _shapes = _elements.ArrGlyph;
            var _shape_index;
            var _shape;
            for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
            {
                _shape = _shapes[_shape_index];
                if(_shape.selected)
                {
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

                    if(_shape instanceof  GroupShape)
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
            }
            return _result_align;
        }
        return null;
    },

  /*  groupShapes : function()
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
    },     */


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


                this.Document.Document_UpdateUndoRedoState();
                return true;
            }
        }
        else if(this.State.id == 20)
        {
            var ret = this.group.groupShapes();
            editor.asc_fireCallback("asc_onCanGroup", this.canGroup());
            editor.asc_fireCallback("asc_onCanUnGroup", this.canUnGroup());


            this.Document.Document_UpdateUndoRedoState();
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
                            shapeGr.calculateXfrm();
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

            this.Document.Document_UpdateUndoRedoState();
            return true;
        }
        else if(this.State.id == 20)
        {
            var ret =  this.group.unGroupShapes();
            editor.asc_fireCallback("asc_onCanGroup", this.canGroup());
            editor.asc_fireCallback("asc_onCanUnGroup", this.canUnGroup());

            this.Document.Document_UpdateUndoRedoState();
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
                return _selected_count > 1;
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
        this.obj = selectionState.obj;
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
        //this.Document.Document_UpdateSelectionState();
    },

    setShapeLeftAlign : function()
    {

    },

    Arrange : function()
    {

    },


    alignLeft : function()
    {
        var _elements = this;
        if(_elements.State.id === 20)
        {
            while(_elements.State.id === 20)
            {
                _elements = _elements.group;
            }
        }
        if(_elements.State.id === 0)
        {
            var _shapes = _elements.ArrGlyph;
            var _shape_index;
            var _shape;
            for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
            {
                if(_shapes[_shape_index].selected)
                {
                    break;
                }
            }
            if(_shape_index < _shapes.length)
            {
                History.Create_NewPoint();
                var historyObj;
                if(_elements.RecalculateAfterResize)
                {
                    historyObj = {};
                    historyObj.elements = _elements;
                    historyObj.undo_function = function(data)
                    {
                        data.elements.RecalculateAfterResize();
                    };
                    historyObj.redo_function = function(data)
                    {
                    };
                    History.Add(this, historyObj);
                }
                for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
                {
                    _shape = _shapes[_shape_index];
                    if(_shape.selected)
                    {
                        historyObj = {};
                        historyObj.old_pH = _shape.pH;
                        historyObj.undo_function = function(data)
                        {
                            this.Move(data.old_pH, this.pV);
                        };
                        historyObj.redo_function = function(data)
                        {
                            this.Move(0, this.pV);
                        };
                        History.Add(_shape, historyObj);

                        _shape.Move(0, _shape.pV);
                    }
                }
                if(_elements.RecalculateAfterResize)
                {
                    _elements.RecalculateAfterResize();
                    historyObj = {};
                    historyObj.elements = _elements;
                    historyObj.undo_function = function(data)
                    {};
                    historyObj.redo_function = function(data)
                    {
                        data.elements.RecalculateAfterResize();
                    };
                    History.Add(this, historyObj);

                    this.Document.Document_UpdateUndoRedoState();
                }
            }
        }

        this.Document.Document_UpdateUndoRedoState();
    },

    alignRight : function()
    {
        var _elements = this;
        if(_elements.State.id === 20)
        {
            while(_elements.State.id === 20)
            {
                _elements = _elements.group;
            }
        }
        if(_elements.State.id === 0)
        {
            var _shapes = _elements.ArrGlyph;
            var _shape_index;
            var _shape;
            for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
            {
                if(_shapes[_shape_index].selected)
                {
                    break;
                }
            }
            if(_shape_index < _shapes.length)
            {
                var _container_width;
                if(_elements instanceof GroupShape)
                {
                    _container_width = _elements.ext.cx;
                }
                else
                {
                    _container_width = this.Document.Width;
                }
                History.Create_NewPoint();
                var historyObj;
                if(_elements.RecalculateAfterResize)
                {
                    historyObj = {};
                    historyObj.elements = _elements;
                    historyObj.undo_function = function(data)
                    {
                        data.elements.RecalculateAfterResize();
                    };
                    historyObj.redo_function = function(data)
                    {
                    };
                    History.Add(this, historyObj);
                }
                for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
                {
                    _shape = _shapes[_shape_index];
                    if(_shape.selected)
                    {
                        var _new_pH = _container_width - _shape.ext.cx;
                        historyObj = {};
                        historyObj.old_pH = _shape.pH;
                        historyObj.new_pH = _new_pH;
                        historyObj.undo_function = function(data)
                        {
                            this.Move(data.old_pH, this.pV);
                        };
                        historyObj.redo_function = function(data)
                        {
                            this.Move(data.new_pH, this.pV);
                        };
                        History.Add(_shape, historyObj);

                        _shape.Move(_new_pH, _shape.pV);
                    }
                }
                if(_elements.RecalculateAfterResize)
                {
                    _elements.RecalculateAfterResize();
                    historyObj = {};
                    historyObj.elements = _elements;
                    historyObj.undo_function = function(data)
                    {};
                    historyObj.redo_function = function(data)
                    {
                        data.elements.RecalculateAfterResize();
                    };
                    History.Add(this, historyObj);

                    this.Document.Document_UpdateUndoRedoState();
                }
            }
        }

        this.Document.Document_UpdateUndoRedoState();
    },


    alignTop : function()
    {
        var _elements = this;
        if(_elements.State.id === 20)
        {
            while(_elements.State.id === 20)
            {
                _elements = _elements.group;
            }
        }
        if(_elements.State.id === 0)
        {
            var _shapes = _elements.ArrGlyph;
            var _shape_index;
            var _shape;
            for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
            {
                if(_shapes[_shape_index].selected)
                {
                    break;
                }
            }
            if(_shape_index < _shapes.length)
            {
                History.Create_NewPoint();
                var historyObj;
                if(_elements.RecalculateAfterResize)
                {
                    historyObj = {};
                    historyObj.elements = _elements;
                    historyObj.undo_function = function(data)
                    {
                        data.elements.RecalculateAfterResize();
                    };
                    historyObj.redo_function = function(data)
                    {
                    };
                    History.Add(this, historyObj);
                }
                for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
                {
                    _shape = _shapes[_shape_index];
                    if(_shape.selected)
                    {
                        historyObj = {};
                        historyObj.old_pV = _shape.pV;
                        historyObj.undo_function = function(data)
                        {
                            this.Move(this.pH, data.old_pV);
                        };
                        historyObj.redo_function = function(data)
                        {
                            this.Move(this.pH, 0);
                        };
                        History.Add(_shape, historyObj);

                        this.Document.Document_UpdateUndoRedoState();
                        _shape.Move(_shape.pH, 0);
                    }
                }
                if(_elements.RecalculateAfterResize)
                {
                    _elements.RecalculateAfterResize();
                    historyObj = {};
                    historyObj.elements = _elements;
                    historyObj.undo_function = function(data)
                    {};
                    historyObj.redo_function = function(data)
                    {
                        data.elements.RecalculateAfterResize();
                    };
                    History.Add(this, historyObj);

                    this.Document.Document_UpdateUndoRedoState();
                }
            }
        }

        this.Document.Document_UpdateUndoRedoState();
    },


    alignBottom : function()
    {
        var _elements = this;
        if(_elements.State.id === 20)
        {
            while(_elements.State.id === 20)
            {
                _elements = _elements.group;
            }
        }
        if(_elements.State.id === 0)
        {
            var _shapes = _elements.ArrGlyph;
            var _shape_index;
            var _shape;
            for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
            {
                if(_shapes[_shape_index].selected)
                {
                    break;
                }
            }
            if(_shape_index < _shapes.length)
            {
                var _container_height;
                if(_elements instanceof GroupShape)
                {
                    _container_height = _elements.ext.cy;
                }
                else
                {
                    _container_height = this.Document.Height;
                }
                History.Create_NewPoint();
                var historyObj;
                if(_elements.RecalculateAfterResize)
                {
                    historyObj = {};
                    historyObj.elements = _elements;
                    historyObj.undo_function = function(data)
                    {
                        data.elements.RecalculateAfterResize();
                    };
                    historyObj.redo_function = function(data)
                    {
                    };
                    History.Add(this, historyObj);
                }
                for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
                {
                    _shape = _shapes[_shape_index];
                    if(_shape.selected)
                    {
                        var _new_pV = _container_height - _shape.ext.cy;
                        historyObj = {};
                        historyObj.old_pV = _shape.pV;
                        historyObj.new_pV = _new_pV;
                        historyObj.undo_function = function(data)
                        {
                            this.Move(this.pH, data.old_pV);
                        };
                        historyObj.redo_function = function(data)
                        {
                            this.Move(this.pH, data.new_pV);
                        };
                        History.Add(_shape, historyObj);

                        this.Document.Document_UpdateUndoRedoState();
                        _shape.Move(_shape.pH, _new_pV);
                    }
                }
                if(_elements.RecalculateAfterResize)
                {
                    _elements.RecalculateAfterResize();
                    historyObj = {};
                    historyObj.elements = _elements;
                    historyObj.undo_function = function(data)
                    {};
                    historyObj.redo_function = function(data)
                    {
                        data.elements.RecalculateAfterResize();
                    };
                    History.Add(this, historyObj);

                    this.Document.Document_UpdateUndoRedoState();
                }
            }
        }
    },


    alignCenter : function()
    {
        var _elements = this;
        if(_elements.State.id === 20)
        {
            while(_elements.State.id === 20)
            {
                _elements = _elements.group;
            }
        }
        if(_elements.State.id === 0)
        {
            var _shapes = _elements.ArrGlyph;
            var _shape_index;
            var _shape;
            for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
            {
                if(_shapes[_shape_index].selected)
                {
                    break;
                }
            }
            if(_shape_index < _shapes.length)
            {
                var _container_width;
                if(_elements instanceof GroupShape)
                {
                    _container_width = _elements.ext.cx;
                }
                else
                {
                    _container_width = this.Document.Width;
                }
                History.Create_NewPoint();
                var historyObj;
                if(_elements.RecalculateAfterResize)
                {
                    historyObj = {};
                    historyObj.elements = _elements;
                    historyObj.undo_function = function(data)
                    {
                        data.elements.RecalculateAfterResize();
                    };
                    historyObj.redo_function = function(data)
                    {
                    };
                    History.Add(this, historyObj);
                }
                for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
                {
                    _shape = _shapes[_shape_index];
                    if(_shape.selected)
                    {
                        var _new_pH = (_container_width - _shape.ext.cx)/2;
                        historyObj = {};
                        historyObj.old_pH = _shape.pH;
                        historyObj.new_pH = _new_pH;
                        historyObj.undo_function = function(data)
                        {
                            this.Move(data.old_pH, this.pV);
                        };
                        historyObj.redo_function = function(data)
                        {
                            this.Move(data.new_pH, this.pV);
                        };
                        History.Add(_shape, historyObj);

                        this.Document.Document_UpdateUndoRedoState();
                        _shape.Move(_new_pH, _shape.pV);
                    }
                }
                if(_elements.RecalculateAfterResize)
                {
                    _elements.RecalculateAfterResize();
                    historyObj = {};
                    historyObj.elements = _elements;
                    historyObj.undo_function = function(data)
                    {};
                    historyObj.redo_function = function(data)
                    {
                        data.elements.RecalculateAfterResize();
                    };
                    History.Add(this, historyObj);

                    this.Document.Document_UpdateUndoRedoState();
                }
            }
        }
    },

    alignMiddle : function()
    {
        var _elements = this;
        if(_elements.State.id === 20)
        {
            while(_elements.State.id === 20)
            {
                _elements = _elements.group;
            }
        }
        if(_elements.State.id === 0)
        {
            var _shapes = _elements.ArrGlyph;
            var _shape_index;
            var _shape;
            for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
            {
                if(_shapes[_shape_index].selected)
                {
                    break;
                }
            }
            if(_shape_index < _shapes.length)
            {
                var _container_height;
                if(_elements instanceof GroupShape)
                {
                    _container_height = _elements.ext.cy;
                }
                else
                {
                    _container_height = this.Document.Height;
                }
                History.Create_NewPoint();
                var historyObj;
                if(_elements.RecalculateAfterResize)
                {
                    historyObj = {};
                    historyObj.elements = _elements;
                    historyObj.undo_function = function(data)
                    {
                        data.elements.RecalculateAfterResize();
                    };
                    historyObj.redo_function = function(data)
                    {
                    };
                    History.Add(this, historyObj);
                }
                for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
                {
                    _shape = _shapes[_shape_index];
                    if(_shape.selected)
                    {
                        var _new_pV = (_container_height - _shape.ext.cy)/2;
                        historyObj = {};
                        historyObj.old_pV = _shape.pV;
                        historyObj.new_pV = _new_pV;
                        historyObj.undo_function = function(data)
                        {
                            this.Move(this.pH, data.old_pV);
                        };
                        historyObj.redo_function = function(data)
                        {
                            this.Move(this.pH, data.new_pV);
                        };
                        History.Add(_shape, historyObj);

                        this.Document.Document_UpdateUndoRedoState();
                        _shape.Move(_shape.pH, _new_pV);
                    }
                }
                if(_elements.RecalculateAfterResize)
                {
                    _elements.RecalculateAfterResize();
                    historyObj = {};
                    historyObj.elements = _elements;
                    historyObj.undo_function = function(data)
                    {};
                    historyObj.redo_function = function(data)
                    {
                        data.elements.RecalculateAfterResize();
                    };
                    History.Add(this, historyObj);

                    this.Document.Document_UpdateUndoRedoState();
                }
            }
        }
    },

    distributeHor : function()
    {
        var _elements = this;
        if(_elements.State.id === 20)
        {
            while(_elements.State.id === 20)
            {
                _elements = _elements.group;
            }
        }
        if(_elements.State.id === 0)
        {
            var _shapes = _elements.ArrGlyph;
            var _shape_index;
            var _shape;
            //if(_shape_index < _shapes.length)
            {
                var _container_width;
                if(_elements instanceof GroupShape)
                {
                    _container_width = _elements.ext.cx;
                }
                else
                {
                    _container_width = this.Document.Width;
                }
                History.Create_NewPoint();
                var historyObj;
                if(_elements.RecalculateAfterResize)
                {
                    historyObj = {};
                    historyObj.elements = _elements;
                    historyObj.undo_function = function(data)
                    {
                        data.elements.RecalculateAfterResize();
                    };
                    historyObj.redo_function = function(data)
                    {
                    };
                    History.Add(this, historyObj);
                }
                for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
                {
                    _shape = _shapes[_shape_index];
                    _shape.selected = true;
                    //if(_shape.selected)
                    {
                        var _new_pH = (_container_width - _shape.ext.cx)/2;
                        historyObj = {};
                        historyObj.old_pH = _shape.pH;
                        historyObj.new_pH = _new_pH;
                        historyObj.undo_function = function(data)
                        {
                            this.Move(data.old_pH, this.pV);
                        };
                        historyObj.redo_function = function(data)
                        {
                            this.Move(data.new_pH, this.pV);
                        };
                        History.Add(_shape, historyObj);

                        _shape.Move(_new_pH, _shape.pV);
                    }
                }
                if(_elements.RecalculateAfterResize)
                {
                    _elements.RecalculateAfterResize();
                    historyObj = {};
                    historyObj.elements = _elements;
                    historyObj.undo_function = function(data)
                    {};
                    historyObj.redo_function = function(data)
                    {
                        data.elements.RecalculateAfterResize();
                    };
                    History.Add(this, historyObj);
                }
            }
        }

        this.Document.Document_UpdateUndoRedoState();
    },
    distributeVer : function()
    {
        var _elements = this;
        if(_elements.State.id === 20)
        {
            while(_elements.State.id === 20)
            {
                _elements = _elements.group;
            }
        }
        if(_elements.State.id === 0)
        {
            var _shapes = _elements.ArrGlyph;
            var _shape_index;
            var _shape;
           // if(_shape_index < _shapes.length)
            {
                var _container_height;
                if(_elements instanceof GroupShape)
                {
                    _container_height = _elements.ext.cy;
                }
                else
                {
                    _container_height = this.Document.Height;
                }
                History.Create_NewPoint();
                var historyObj;
                if(_elements.RecalculateAfterResize)
                {
                    historyObj = {};
                    historyObj.elements = _elements;
                    historyObj.undo_function = function(data)
                    {
                        data.elements.RecalculateAfterResize();
                    };
                    historyObj.redo_function = function(data)
                    {
                    };
                    History.Add(this, historyObj);
                }
                for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
                {
                    _shape = _shapes[_shape_index];
                    _shape.selected = true;
                    //if(_shape.selected)
                    {
                        var _new_pV = (_container_height - _shape.ext.cy)/2;
                        historyObj = {};
                        historyObj.old_pV = _shape.pV;
                        historyObj.new_pV = _new_pV;
                        historyObj.undo_function = function(data)
                        {
                            this.Move(this.pH, data.old_pV);
                        };
                        historyObj.redo_function = function(data)
                        {
                            this.Move(this.pH, data.new_pV);
                        };
                        History.Add(_shape, historyObj);

                        _shape.Move(_shape.pH, _new_pV);
                    }
                }
                if(_elements.RecalculateAfterResize)
                {
                    _elements.RecalculateAfterResize();
                    historyObj = {};
                    historyObj.elements = _elements;
                    historyObj.undo_function = function(data)
                    {};
                    historyObj.redo_function = function(data)
                    {
                        data.elements.RecalculateAfterResize();
                    };
                    History.Add(this, historyObj);
                }
            }
        }

        this.Document.Document_UpdateUndoRedoState();
    },

    bringToFront : function()
    {
        var _elements = this;
        if(_elements.State.id === 20)
        {
            while(_elements.State.id === 20)
            {
                _elements = _elements.group;
            }
        }
        if(_elements.State.id === 0)
        {
            var _shapes = _elements.ArrGlyph;
            var _shape_index;
            var _shape;
            for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
            {
                if(_shapes[_shape_index].selected)
                {
                    break;
                }
            }
            if(_shape_index < _shapes.length)
            {
                History.Create_NewPoint();
                var historyObj;
                var selectedShapes = [];
                for(var i = 0; i<_shapes.length; ++i)
                {
                    if(_shapes[i].selected)
                    {
                        _shape = _shapes.splice(i, 1)[0];
                        historyObj = {};
                        historyObj.shape = _shape;
                        historyObj.num = i;
                        historyObj.elements = _elements;
                        historyObj.undo_function = function(data)
                        {
                            data.elements.ArrGlyph.splice(data.num, 0, data.shape);
                        };
                        historyObj.redo_function = function(data)
                        {
                            data.elements.ArrGlyph.splice(data.num, 1);
                        };
                        History.Add(this, historyObj);

                        selectedShapes.push(_shape);
                        --i;
                    }
                }
                _elements.ArrGlyph = _shapes.concat(selectedShapes);
                if(_elements instanceof  AutoShapesContainer)
                {
                    _elements.Document.Slides[_elements.SlideNum].cSld.spTree = _elements.ArrGlyph;
                }
                historyObj = {};
                historyObj.selShapes = selectedShapes;
                historyObj.elements = _elements;
                historyObj.undo_function = function(data)
                {
                    data.elements.ArrGlyph.length = data.elements.ArrGlyph.length - data.selShapes.length;
                    if(data.elements instanceof  AutoShapesContainer)
                    {
                        data.elements.Document.Slides[data.elements.SlideNum].cSld.spTree = data.elements.ArrGlyph;
                    }
                };
                historyObj.redo_function = function(data)
                {
                    data.elements.ArrGlyph = data.elements.ArrGlyph.concat(selectedShapes);
                    if(data.elements instanceof  AutoShapesContainer)
                    {
                        data.elements.Document.Slides[data.elements.SlideNum].cSld.spTree = data.elements.ArrGlyph;
                    }
                };
                History.Add(this, historyObj);
            }
        }

        this.Document.Document_UpdateUndoRedoState();
    },

    bringForward : function()
    {
        var _elements = this;
        if(_elements.State.id === 20)
        {
            while(_elements.State.id === 20)
            {
                _elements = _elements.group;
            }
        }
        if(_elements.State.id === 0)
        {
            var _shapes = _elements.ArrGlyph;
            var _shape_index;
            var _shape;
            for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
            {
                if(_shapes[_shape_index].selected)
                {
                    break;
                }
            }
            if(_shape_index < _shapes.length)
            {
                History.Create_NewPoint();
                var _old_array = [];
                var _new_array = [];
                for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
                {
                    _old_array.push(_shapes[_shape_index]);
                }
                for(var i = _shapes.length-1; i > -1; --i)
                {
                    if(_shapes[i].selected && i < _shapes.length-1)
                    {
                        if(!_shapes[i+1].selected)
                        {
                            var t1 = _shapes[i+1];
                            var t2 = _shapes[i];
                            _shapes[i+1] = t2;
                            _shapes[i] = t1;
                            ++i;
                        }
                    }
                }
                for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
                {
                    _new_array.push(_shapes[_shape_index]);
                }
                _elements.ArrGlyph = _new_array;
                if(_elements instanceof AutoShapesContainer)
                {
                    _elements.Document.Slides[_elements.SlideNum].cSld.spTree = _elements.ArrGlyph;
                }
                var historyObj = {};
                historyObj.elements = _elements;
                historyObj.oldArray = _old_array;
                historyObj.newArray = _new_array;
                historyObj.undo_function = function(data)
                {
                    data.elements.ArrGlyph = data.oldArray;
                    if(data.elements instanceof AutoShapesContainer)
                    {
                        data.elements.Document.Slides[data.elements.SlideNum].cSld.spTree = data.elements.ArrGlyph;
                    }
                };
                historyObj.redo_function = function(data)
                {
                    data.elements.ArrGlyph = data.newArray;
                    if(data.elements instanceof AutoShapesContainer)
                    {
                        data.elements.Document.Slides[data.elements.SlideNum].cSld.spTree = data.elements.ArrGlyph;
                    }
                };
                History.Add(this, historyObj);
            }
        }

        this.Document.Document_UpdateUndoRedoState();
    },

    sendToBack : function()
    {
        var _elements = this;
        if(_elements.State.id === 20)
        {
            while(_elements.State.id === 20)
            {
                _elements = _elements.group;
            }
        }
        if(_elements.State.id === 0)
        {
            var _shapes = _elements.ArrGlyph;
            var _shape_index;
            var _shape;
            for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
            {
                if(_shapes[_shape_index].selected)
                {
                    break;
                }
            }
            if(_shape_index < _shapes.length)
            {
                History.Create_NewPoint();
                var historyObj;
                var selectedShapes = [];
                for(var i = 0; i<_shapes.length; ++i)
                {
                    if(_shapes[i].selected)
                    {
                        _shape = _shapes.splice(i, 1)[0];

                        historyObj = {};
                        historyObj.shape = _shape;
                        historyObj.num = i;
                        historyObj.elements = _elements;
                        historyObj.undo_function = function(data)
                        {
                            data.elements.ArrGlyph.splice(data.num, 0, data.shape);
                        };
                        historyObj.redo_function = function(data)
                        {
                            data.elements.ArrGlyph.splice(data.num, 1);
                        };
                        History.Add(this, historyObj);

                        selectedShapes.push(_shape);
                        --i;
                    }
                }
                _elements.ArrGlyph = selectedShapes.concat(_shapes);
                if(_elements instanceof AutoShapesContainer)
                {
                    _elements.Document.Slides[_elements.SlideNum].cSld.spTree = _elements.ArrGlyph;
                }
                historyObj = {};
                historyObj.selShapes = selectedShapes;
                historyObj.elements = _elements;
                historyObj.undo_function = function(data)
                {
                    for(var i = 0; i < data.selShapes.length; ++i)
                        data.elements.ArrGlyph.splice(0, 1);
                    if(data.elements instanceof AutoShapesContainer)
                    {
                        data.elements.Document.Slides[data.elements.SlideNum].cSld.spTree = data.elements.ArrGlyph;
                    }
                };
                historyObj.redo_function = function(data)
                {
                    data.elements.ArrGlyph = data.selShapes.concat(data.elements.ArrGlyph);
                    if(data.elements instanceof AutoShapesContainer)
                    {
                        data.elements.Document.Slides[data.elements.SlideNum].cSld.spTree = data.elements.ArrGlyph;
                    }
                };
                History.Add(this, historyObj);
            }
        }

        this.Document.Document_UpdateUndoRedoState();
    },


    bringBackward : function()
    {

        var _elements = this;
        if(_elements.State.id === 20)
        {
            while(_elements.State.id === 20)
            {
                _elements = _elements.group;
            }
        }
        if(_elements.State.id === 0)
        {
            var _shapes = _elements.ArrGlyph;
            var _shape_index;
            var _shape;
            for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
            {
                if(_shapes[_shape_index].selected)
                {
                    break;
                }
            }
            if(_shape_index < _shapes.length)
            {
                History.Create_NewPoint();
                var _old_array = [];
                var _new_array = [];
                for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
                {
                    _old_array.push(_shapes[_shape_index]);
                }
                for(var i = 0; i < _shapes.length; ++i)
                {
                    if(_shapes[i].selected && i > 0)
                    {
                        if(!_shapes[i-1].selected)
                        {
                            var t1 = _shapes[i-1];
                            var t2 = _shapes[i];
                            _shapes[i-1] = t2;
                            _shapes[i] = t1;
                            --i;
                        }
                    }
                }
                for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
                {
                    _new_array.push(_shapes[_shape_index]);
                }
                if(_elements instanceof AutoShapesContainer)
                {
                    _elements.Document.Slides[_elements.SlideNum].cSld.spTree = _elements.ArrGlyph;
                }
                var historyObj = {};
                historyObj.elements = _elements;
                historyObj.oldArray = _old_array;
                historyObj.newArray = _new_array;
                historyObj.undo_function = function(data)
                {
                    data.elements.ArrGlyph = data.oldArray;
                    if(data.elements instanceof AutoShapesContainer)
                    {
                        data.elements.Document.Slides[data.elements.SlideNum].cSld.spTree = data.elements.ArrGlyph;
                    }
                };
                historyObj.redo_function = function(data)
                {
                    data.elements.ArrGlyph = data.newArray;
                    if(data.elements instanceof AutoShapesContainer)
                    {
                        data.elements.Document.Slides[data.elements.SlideNum].cSld.spTree = data.elements.ArrGlyph;
                    }
                };
                History.Add(this, historyObj);
            }
        }

        this.Document.Document_UpdateUndoRedoState();
    },

    getTransform : function()
    {
        return new CMatrixL();
    },


    resetState : function()
    {
        //this.Document.CurPos
        if(this.State instanceof SplineBezierState2 || this.State instanceof SplineBezierState3 || this.State instanceof SplineBezierState4
            || this.State instanceof SplineBezierState5)
        {
            var AutoShapes = this;
            History.Create_NewPoint();
            var shape = AutoShapes.Spline.createShape(AutoShapes.Document.Slides[ AutoShapes.SlideNum ]);
            var historyData = {};
            historyData.num = AutoShapes.ArrGlyph.length;
            historyData.shape = shape;
            historyData.undo_function = function(data)
            {
                this.ArrGlyph.splice(data.num, 1);
            };
            historyData.redo_function = function(data)
            {
                this.ArrGlyph.splice(data.num, 0, data.shape);
            };
            History.Add(AutoShapes, historyData);

            AutoShapes.Document.Document_UpdateUndoRedoState();
            AutoShapes.Add(shape);
            shape.Container = AutoShapes;
            AutoShapes.ArrTrackObj.length=0;
            AutoShapes.ChangeState(new NullShapeState());
            AutoShapes.DrawingDocument.EndTrackAutoShape();
            AutoShapes.DrawingDocument.OnRecalculatePage(AutoShapes.SlideNum, AutoShapes.Document.Slides[ AutoShapes.SlideNum ]);
            AutoShapes.obj=shape;
            AutoShapes.Spline = new Spline(AutoShapes.Document.Slides[AutoShapes.SlideNum]);

            editor.sync_EndAddShape();
            return;
        }

       if(this.State instanceof AddPolyLine2State3)
       {
           AutoShapes = this;
           History.Create_NewPoint();
           var shape = AutoShapes.PolyLine.createShape(AutoShapes.Document.Slides[ AutoShapes.SlideNum ]);
           var historyData = {};
           historyData.num = AutoShapes.ArrGlyph.length;
           historyData.shape = shape;
           historyData.undo_function = function(data)
           {
               this.ArrGlyph.splice(data.num, 1);
           };
           historyData.redo_function = function(data)
           {
               this.ArrGlyph.splice(data.num, 0, data.shape);
           };
           History.Add(AutoShapes, historyData);

           AutoShapes.Document.Document_UpdateUndoRedoState();
           AutoShapes.Add(shape);
           shape.Container = AutoShapes;
           AutoShapes.ArrTrackObj.length=0;
           AutoShapes.ChangeState(new NullShapeState());
           AutoShapes.DrawingDocument.EndTrackAutoShape();
           AutoShapes.DrawingDocument.OnRecalculatePage(AutoShapes.SlideNum, AutoShapes.Document.Slides[ AutoShapes.SlideNum ]);
           AutoShapes.obj=shape;
           AutoShapes.PolyLine = null;
           editor.sync_EndAddShape();
           return;
       }

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

    GetStateId: function()
    {
        return this.State.id;
    },

    ChangeState: function(state)
    {
        this.State=state;
    },

    OnMouseDown2: function(e, X, Y, PageIndex)
    {
        this.OnMouseDown(e, X, Y, PageIndex);
    },

    OnMouseUp2: function(e, X, Y, PageIndex)
    {
        this.OnMouseUp(e, X, Y, PageIndex);
        var elements = this;
        if(elements.State.id === 20)
        {
            while(elements.State.id === 20)
            {
                elements = elements.group;
            }
        }
        if(elements.State.id === 0 || elements.State.id === 7)
        {
            for(var _shape_index = 0; _shape_index < elements.ArrGlyph.length; ++_shape_index)
            {
                if(elements.ArrGlyph[_shape_index].selected)
                {
                    var _data = new CContextMenuData();
                    _data.Type = c_oAscContextMenuTypes.Main;
                    _data.X_abs = e.X;
                    _data.Y_abs = e.Y;
                    editor.sync_ContextMenuCallback(_data);
                    return;
                }
            }
        }
    },

    OnMouseDown: function(e, X, Y, PageIndex)
    {
        this.State.OnMouseDown(this, e, X, Y, PageIndex);
        editor.asc_fireCallback("asc_onCanGroup", this.canGroup());
        editor.asc_fireCallback("asc_onCanUnGroup", this.canUnGroup());
    },

    OnMouseMove: function(e, X, Y, PageIndex)
    {
        this.MouseX = X;
        this.MouseY = Y;
        this.State.OnMouseMove(this, e, X, Y, PageIndex);
    },

    OnMouseUp: function(e, X, Y, PageIndex)
    {
        this.State.OnMouseUp(this, e, X, Y, PageIndex);
        this.Document.DrawingDocument.OnEndRecalculate(false, true);
        editor.asc_fireCallback("asc_onCanGroup", this.canGroup());
        editor.asc_fireCallback("asc_onCanUnGroup", this.canUnGroup());
    },

    SplineAdd: function(point)
    {
        this.Spline.AddPoint(point.x, point.y);
        this.Spline=new Spline(this.ArrPointSpline);
    },

    ChangeLastPointSpline: function(point)
    {
        this.Spline.ChangeLastPointSpline(point.x, point.y);
        this.Spline=new Spline(this.ArrPointSpline);
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

    startSearchText : function(str, scanForward) //
    {
        if(typeof(str) != "string")
            return null;
        if(scanForward === undefined)
        {
            scanForward = true;
        }

        var _cur_glyph_num;
        var _arr_sel_states = null;
        if(this.State.id == 0)
        {
            this.selectedCount();
            if(this.NumSelected == 0 || this.NumSelected == this.ArrGlyph.length)
            {
                if(scanForward == true)
                {
                    for(_cur_glyph_num = 0; _cur_glyph_num < this.ArrGlyph.length; ++_cur_glyph_num)
                    {
                        if((_arr_sel_states = this.ArrGlyph[_cur_glyph_num].getSearchResults(str, _cur_glyph_num))!= null)
                        {
                            return _arr_sel_states[0];
                        }
                    }
                }
                else
                {
                    for(_cur_glyph_num = this.ArrGlyph.length - 1; _cur_glyph_num > -1; --_cur_glyph_num)
                    {
                        if((_arr_sel_states = this.ArrGlyph[_cur_glyph_num].getSearchResults(str, _cur_glyph_num))!= null)
                        {
                            return _arr_sel_states[_arr_sel_states.length-1];
                        }
                    }
                }
                return null;
            }
            else
            {
                if(scanForward == true)
                {
                    for(_cur_glyph_num = 0; _cur_glyph_num < this.ArrGlyph.length; ++_cur_glyph_num)
                    {
                        if(this.ArrGlyph[_cur_glyph_num].selected && (_arr_sel_states = this.ArrGlyph[_cur_glyph_num].getSearchResults(str, _cur_glyph_num))!= null)
                        {
                            return _arr_sel_states[0];
                        }
                    }
                    for(_cur_glyph_num = 0; _cur_glyph_num < this.ArrGlyph.length; ++_cur_glyph_num)
                    {
                        if(!this.ArrGlyph[_cur_glyph_num].selected && (_arr_sel_states = this.ArrGlyph[_cur_glyph_num].getSearchResults(str, _cur_glyph_num))!= null)
                        {
                            return _arr_sel_states[0];
                        }
                    }
                }
                else
                {
                    for(_cur_glyph_num = this.ArrGlyph.length - 1; _cur_glyph_num > -1; --_cur_glyph_num)
                    {
                        if(this.ArrGlyph[_cur_glyph_num].selected && (_arr_sel_states = this.ArrGlyph[_cur_glyph_num].getSearchResults(str, _cur_glyph_num)) != null)
                        {
                            return _arr_sel_states[_arr_sel_states.length - 1];
                        }
                    }
                    for(_cur_glyph_num = this.ArrGlyph.length - 1; _cur_glyph_num > -1; --_cur_glyph_num)
                    {
                        if(!this.ArrGlyph[_cur_glyph_num].selected && (_arr_sel_states = this.ArrGlyph[_cur_glyph_num].getSearchResults(str, _cur_glyph_num)) != null)
                        {
                            return _arr_sel_states[_arr_sel_states.length - 1];
                        }
                    }
                }

                return null;
            }
        }
        else if(this.State.id == 7)
        {
            var _cur_doc_content;
            _cur_glyph_num = 0;
            if( this.obj && (_cur_doc_content = this.obj.getCurDocumentContent()) != null )
            {
                for(_cur_glyph_num = 0; _cur_glyph_num < this.ArrGlyph.length; ++_cur_glyph_num)
                {
                    if(this.ArrGlyph[_cur_glyph_num] == this.obj)
                    {
                        break;
                    }
                }
                if(_cur_glyph_num < this.ArrGlyph.length)
                {
                    if((_arr_sel_states = this.obj.getSearchResults(str, _cur_glyph_num)) != null)
                    {
                        var _cur_pos_doc, _cur_pos_par;
                        var _pos_sel_state;
                        var _tmp_sel_state;
                        var _prev_sel_state;
                        if(scanForward == true)
                        {
                            if(!_cur_doc_content.Selection.Use)
                            {
                                _cur_pos_doc = _cur_doc_content.CurPos.ContentPos;
                                _cur_pos_par = _cur_doc_content.Content[_cur_pos_doc].CurPos.ContentPos;
                            }
                            else
                            {
                                _cur_pos_doc = _cur_doc_content.Selection.EndPos;
                                _cur_pos_par = _cur_doc_content.Content[_cur_pos_doc].Selection.EndPos;
                            }

                            for(_pos_sel_state = 0; _pos_sel_state < _arr_sel_states.length; ++_pos_sel_state)
                            {
                                _tmp_sel_state = _arr_sel_states[_pos_sel_state];
                                while(true)
                                {
                                    if(_tmp_sel_state.textSelectionState == undefined && _tmp_sel_state.groupSelection != undefined)
                                    {
                                        _tmp_sel_state = _tmp_sel_state.groupSelection;
                                    }
                                    else
                                    {
                                        break;
                                    }
                                }

                                if(_tmp_sel_state.textSelectionState != undefined)
                                {
                                    if(_prev_sel_state != undefined && _tmp_sel_state.obj != _prev_sel_state.obj)
                                    {
                                        return _arr_sel_states[_pos_sel_state];
                                    }
                                    var _text_sel_state = _tmp_sel_state.textSelectionState;
                                    if(_text_sel_state[_text_sel_state.length - 1].Selection.StartPos > _cur_pos_doc)
                                    {
                                        return _arr_sel_states[_pos_sel_state];
                                    }
                                    if(_text_sel_state[_text_sel_state.length - 1].Selection.StartPos == _cur_pos_doc)
                                    {
                                        if(_text_sel_state[_text_sel_state.length -2][0][0].Selection.StartPos >= _cur_pos_par)
                                        {
                                            return _arr_sel_states[_pos_sel_state];
                                        }
                                    }
                                }
                                _prev_sel_state = _tmp_sel_state;
                            }
                            for(++_cur_glyph_num; _cur_glyph_num < this.ArrGlyph.length; ++_cur_glyph_num)
                            {
                                if((_arr_sel_states = this.ArrGlyph[_cur_glyph_num].getSearchResults(str, _cur_glyph_num))!= null)
                                {
                                    return _arr_sel_states[0];
                                }
                            }
                        }
                        else
                        {
                            if(!_cur_doc_content.Selection.Use)
                            {
                                _cur_pos_doc = _cur_doc_content.CurPos.ContentPos;
                                _cur_pos_par = _cur_doc_content.Content[_cur_pos_doc].CurPos.ContentPos;
                            }
                            else
                            {
                                _cur_pos_doc = _cur_doc_content.Selection.StartPos;
                                _cur_pos_par = _cur_doc_content.Content[_cur_pos_doc].Selection.StartPos;
                            }

                            for(_pos_sel_state = _arr_sel_states.length - 1; _pos_sel_state > -1; --_pos_sel_state)
                            {
                                _tmp_sel_state = _arr_sel_states[_pos_sel_state];
                                while(true)
                                {
                                    if(_tmp_sel_state.textSelectionState == undefined && _tmp_sel_state.groupSelection != undefined)
                                    {
                                        _tmp_sel_state = _tmp_sel_state.groupSelection;
                                    }
                                    else
                                    {
                                        break;
                                    }
                                }

                                if(_tmp_sel_state.textSelectionState != undefined)
                                {
                                    if(_prev_sel_state != undefined && _tmp_sel_state.obj != _prev_sel_state.obj)
                                    {
                                        return _arr_sel_states[_pos_sel_state];
                                    }
                                    _text_sel_state = _tmp_sel_state.textSelectionState;
                                    if(_text_sel_state[_text_sel_state.length - 1].Selection.EndPos < _cur_pos_doc)
                                    {
                                        return _arr_sel_states[_pos_sel_state];
                                    }
                                    if(_text_sel_state[_text_sel_state.length - 1].Selection.EndPos == _cur_pos_doc)
                                    {
                                        if(_text_sel_state[_text_sel_state.length -2][0][0].Selection.EndPos <= _cur_pos_par)
                                        {
                                            return _arr_sel_states[_pos_sel_state];
                                        }
                                    }
                                }
                                _prev_sel_state = _tmp_sel_state;
                            }
                            for(--_cur_glyph_num; _cur_glyph_num > -1; --_cur_glyph_num)
                            {
                                if((_arr_sel_states = this.ArrGlyph[_cur_glyph_num].getSearchResults(str, _cur_glyph_num))!= null)
                                {
                                    return _arr_sel_states[_arr_sel_states.length - 1];
                                }
                            }
                        }
                    }
                    return null;
                }
            }
        }
        else if(this.State.id == 20)
        {
            return null;//TODO: доделать;
        }
        return null;
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
                    _glyphs_buffer.push(this.ArrGlyph[_shape_index].createFullCopy(this.Document.Slides[this.SlideNum], this));
                }
            }
        }
        if(this.State.id == 20)
        {
            _glyphs_buffer = this.group.glyphsCopy();
        }

        if(_glyphs_buffer.length > 0)
        {
            this.lastPastePosX = _glyphs_buffer[0].pH + 5;
            this.lastPastePosY = _glyphs_buffer[0].pV + 5;
        }
        return _glyphs_buffer;
    },


     moveShapeLeft : function(_shift)
    {
        if(this.State.id == 0)
        {
            this.selectedCount();
            if(this.NumSelected > 0)
            {
                History.Create_NewPoint();
                var _history_obj;
                if(_shift == null)
                {
                    _shift = this.DrawingDocument.GetMMPerDot(1);
                }
                var _shape_index;
                var _glyphs = this.ArrGlyph;
                var _glyph;
                for(_shape_index = 0; _shape_index < _glyphs.length; ++_shape_index)
                {
                    if(_glyphs[_shape_index].selected)
                    {
                        _glyph = _glyphs[_shape_index];

                        _history_obj = {};
                        _history_obj.oldPH = _glyph.pH;

                        _glyph.pH -= _shift;
                        _glyph.Recalculate();

                        _history_obj.newPH = _glyph.pH;

                        _history_obj.undo_function = function(data)
                        {
                            this.pH = data.oldPH;
                            this.Recalculate();
                        };
                        _history_obj.redo_function = function(data)
                        {
                            this.pH = data.newPH;
                            this.Recalculate();
                        };
                        History.Add(_glyph, _history_obj);
                    }

                }
                this.Document.DrawingDocument.OnRecalculatePage(this.SlideNum, this.Document.Slides[this.SlideNum]);
            }
        }

        this.Document.Document_UpdateUndoRedoState();
    },

     moveShapeTop : function(_shift)
    {
        if(this.State.id == 0)
        {
            this.selectedCount();
            if(this.NumSelected > 0)
            {
                History.Create_NewPoint();
                var _history_obj;
                if(_shift == null)
                {
                    _shift = this.DrawingDocument.GetMMPerDot(1);
                }
                var _shape_index;
                var _glyphs = this.ArrGlyph;
                var _glyph;
                for(_shape_index = 0; _shape_index < _glyphs.length; ++_shape_index)
                {
                    if(_glyphs[_shape_index].selected)
                    {
                        _glyph = _glyphs[_shape_index];

                        _history_obj = {};
                        _history_obj.oldPV = _glyph.pV;

                        _glyph.pV -= _shift;
                        _glyph.Recalculate();

                        _history_obj.newPV = _glyph.pV;

                        _history_obj.undo_function = function(data)
                        {
                            this.pV = data.oldPV;
                            this.Recalculate();
                        };
                        _history_obj.redo_function = function(data)
                        {
                            this.pV = data.newPV;
                            this.Recalculate();
                        };
                        History.Add(_glyph, _history_obj);
                    }
                }
                this.Document.DrawingDocument.OnRecalculatePage(this.SlideNum, this.Document.Slides[this.SlideNum]);
            }
        }

        this.Document.Document_UpdateUndoRedoState();
    },

     moveShapeRight : function(_shift)
    {
        if(this.State.id == 0)
        {
            this.selectedCount();
            if(this.NumSelected > 0)
            {
                History.Create_NewPoint();
                var _history_obj;
                if(_shift == null)
                {
                    _shift = this.DrawingDocument.GetMMPerDot(1);
                }
                var _shape_index;
                var _glyphs = this.ArrGlyph;
                var _glyph;
                for(_shape_index = 0; _shape_index < _glyphs.length; ++_shape_index)
                {
                    if(_glyphs[_shape_index].selected)
                    {
                        _glyph = _glyphs[_shape_index];

                        _history_obj = {};
                        _history_obj.oldPH = _glyph.pH;

                        _glyph.pH += _shift;
                        _glyph.Recalculate();

                        _history_obj.newPH = _glyph.pH;

                        _history_obj.undo_function = function(data)
                        {
                            this.pH = data.oldPH;
                            this.Recalculate();
                        };
                        _history_obj.redo_function = function(data)
                        {
                            this.pH = data.newPH;
                            this.Recalculate();
                        };
                        History.Add(_glyph, _history_obj);
                    }

                }
                this.Document.DrawingDocument.OnRecalculatePage(this.SlideNum, this.Document.Slides[this.SlideNum]);
            }
        }

        this.Document.Document_UpdateUndoRedoState();
    },

     moveShapeBottom : function(_shift)
    {
        if(this.State.id == 0)
        {
            this.selectedCount();
            if(this.NumSelected > 0)
            {
                History.Create_NewPoint();
                var _history_obj;
                if(_shift == null)
                {
                    _shift = this.DrawingDocument.GetMMPerDot(1);
                }
                var _shape_index;
                var _glyphs = this.ArrGlyph;
                var _glyph;
                for(_shape_index = 0; _shape_index < _glyphs.length; ++_shape_index)
                {
                    if(_glyphs[_shape_index].selected)
                    {
                        _glyph = _glyphs[_shape_index];

                        _history_obj = {};
                        _history_obj.oldPV = _glyph.pV;

                        _glyph.pV += _shift;
                        _glyph.Recalculate();

                        _history_obj.newPV = _glyph.pV;

                        _history_obj.undo_function = function(data)
                        {
                            this.pV = data.oldPV;
                            this.Recalculate();
                        };
                        _history_obj.redo_function = function(data)
                        {
                            this.pV = data.newPV;
                            this.Recalculate();
                        };
                        History.Add(_glyph, _history_obj);
                    }
                }
                this.Document.DrawingDocument.OnRecalculatePage(this.SlideNum, this.Document.Slides[this.SlideNum]);
            }
        }

        this.Document.Document_UpdateUndoRedoState();
    },

    glyphsCut : function()
    {
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
            this.lastPastePosX = curPosX;
            this.lastPastePosY = curPosY;
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

            _history_obj = {};
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
        this.lastPastePosX += 5;
        this.lastPastePosY += 5;
        this.selectedCount();
        this.DrawingDocument.OnRecalculatePage(this.SlideNum, _cur_slide);

        this.Document.Document_UpdateUndoRedoState();
    },

    goToNextSearchResult : function()
    {

    },

    updateSelectionMap : function()
    {
        this.selectionMap = [];
        for(var i = 0; i<this.ArrGlyph.length; ++i)
        {
            this.selectionMap[i] = this.ArrGlyph[i].selected;
        }
    },

    Add: function(obj)
    {
        obj.Container = this;
        for(var i=0; i<this.ArrGlyph.length; i++) {

            this.ArrGlyph[i].selected = false;
        }

        this.ArrGlyph.push(obj);
        this.ArrGlyph[this.ArrGlyph.length-1].selected = true;
        this.NumSelected=1;
    },

    Del: function(bHistoryFlag)
    {
        var _deleted_glyphs = [];
        if(bHistoryFlag === undefined)
            bHistoryFlag = false;
        if(this.State.id!=20 && this.NumSelected > 0)
        {
            if(bHistoryFlag !== true)
                History.Create_NewPoint();
            this.addHistorySelectedStateAfterDel();
            var i=this.ArrGlyph.length;
            while(i--) {

                if(this.ArrGlyph[i].selected) {

                    if(this.ArrGlyph[i].isPlaceholder() && !this.ArrGlyph[i].isEmptyPlaceholder())
                    {
                        var slide = this.Document.Slides[this.SlideNum];
                        var layout = slide.Layout;
                        var _type = null, _idx = null;
                        if(this.ArrGlyph[i] instanceof CShape)
                        {
                            _type = this.ArrGlyph[i].nvSpPr.nvPr.ph.type;
                            _idx = this.ArrGlyph[i].nvSpPr.nvPr.ph.idx;
                        }
                        else if(this.ArrGlyph[i] instanceof CImage2)
                        {
                            _type = this.ArrGlyph[i].nvPicPr.nvPr.ph.type;
                            _idx = this.ArrGlyph[i].nvPicPr.nvPr.ph.idx;
                        }
                        else if(this.ArrGlyph[i] instanceof  CGraphicFrame)
                        {
                            _type = this.ArrGlyph[i].nvGraphicFramePr.nvPr.ph.type;
                            _idx = this.ArrGlyph[i].nvGraphicFramePr.nvPr.ph.idx;
                        }

                        var matchingShape = layout.getMatchingShape(_type, _idx);
                        if(matchingShape == null)
                        {
                            matchingShape = layout.Master.getMatchingShape(this.ArrGlyph[i].nvSpPr.nvPr.ph.type, this.ArrGlyph[i].nvSpPr.nvPr.ph.idx);
                        }

                        if(matchingShape != null)
                        {
                            var oldShape =  this.ArrGlyph.splice(i, 1)[0];
                            _deleted_glyphs.push(oldShape);
                            var duplicate = matchingShape.createDuplicate2(slide, this);
                            duplicate.txBody = matchingShape.txBody.createFullCopy(duplicate);
                            duplicate.txBody.content = new CDocumentContent(duplicate, this.DrawingDocument, 0, 0, 0, 0, false, false);
                            duplicate.calculate();
                            duplicate.setParent(slide);
                            duplicate.setContainer(this);
                            duplicate.selected = true;
                            this.ArrGlyph.splice(i, 0, duplicate);

                            var historyData = {};
                            historyData.old_shape = oldShape;
                            historyData.new_shape = duplicate;
                            historyData.num = i;
                            historyData.undo_function = function(data)
                            {
                                this.ArrGlyph.splice(data.num, 1, data.old_shape);
                            };
                            historyData.redo_function = function(data)
                            {
                                this.ArrGlyph.splice(data.num, 1, data.new_shape);
                            };
                            History.Add(this,  historyData);
                        }
                        else
                        {
                            var _del_glyph = this.ArrGlyph.splice(i,1)[0];
                            _deleted_glyphs.push(_del_glyph);
                            historyData = {};
                            historyData.shape = _del_glyph;
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
                    else
                    {
                        _del_glyph = this.ArrGlyph.splice(i, 1)[0];
                        _deleted_glyphs.push(_del_glyph);
                        historyData = {};
                        historyData.shape = _del_glyph;
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
            }
        }
        else  if(this.NumSelected > 0)
        {
            _deleted_glyphs = this.group.Del();
        }
        this.DrawingDocument.OnRecalculatePage( this.SlideNum, this.Document.Slides[this.SlideNum] );
        this.DrawingDocument.OnEndRecalculate();

        this.Document.Document_UpdateUndoRedoState();
        return _deleted_glyphs;
    },

    Select: function(num, ctrl) {

        if(ctrl) {

            if(!this.ArrGlyph[num].selected) {

                ++this.NumSelected;
                this.ArrGlyph[num].selected = true;
            }

        }
        else {

            for(var i=0; i <this.ArrGlyph.length; ++i) {

                this.ArrGlyph[i].selected = false;
            }

            this.ArrGlyph[num].selected=true;
            this.NumSelected=1;
        }
    },

    Draw: function(graphics) {

        var glyphs = this.ArrGlyph;
        for(var i= 0, n = glyphs.length; i<n; ++i) {

            glyphs[i].Draw(graphics);
        }

        /*
        var zoom = 100;
        for(i=0; i < n; ++i) {

            if(glyphs[i].selected) {

                glyphs[i].Select(graphics, zoom);
            }
        }
        */

        /*
        if( this.NumSelected == 1 ) {

            for(i = 0; i < n; ++i) {

                if(glyphs[i].selected) {

                    glyphs[i].DrawAdj(graphics, zoom);
                    break;
                }
            }

        }
        */

    },

    drawSelect : function()
    {
        if(this.State.id == 20)
        {
            this.DrawingDocument.DrawTrack(TYPE_TRACK_GROUP_PASSIVE, this.group.TransformMatrix, 0, 0, this.group.ext.cx, this.group.ext.cy, false/*isLine*/);
            this.group.drawSelect(this.group.TransformMatrix);
        }
        else if(this.State.id == 7)
        {
            var _select_type;
            if(this.obj.IsLine())
            {
                _select_type = TYPE_TRACK_SHAPE
            }
            else
            {
                _select_type = TYPE_TRACK_TEXT
            }
            this.DrawingDocument.DrawTrack(_select_type, this.obj.TransformMatrix, 0, 0, this.obj.ext.cx, this.obj.ext.cy, this.obj.geometry ? this.obj.geometry.preset == "line"  : false);
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
                    if(!shape.IsGroup())
                    {
                        this.DrawingDocument.DrawTrack(TYPE_TRACK_SHAPE , shape.TransformMatrix, 0, 0, shape.ext.cx, shape.ext.cy, shape.geometry ? shape.geometry.preset == "line"  : false);
                    }
                    else
                    {
                        this.DrawingDocument.DrawTrack(TYPE_TRACK_GROUP, shape.TransformMatrix, 0, 0, shape.ext.cx, shape.ext.cy, shape.geometry ? shape.geometry.preset == "line"  : false);
                    }
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

    getFullTransform : function()
    {
        return new CMatrixL();
    },

    DrawOnOverlay: function(graphics) {

        if(this.State.id == 20)
        {
            this.group.DrawOnOverlay(graphics);
            return;
        }
        var trackObjects = this.ArrTrackObj;
        for(var i = 0, n = trackObjects.length; i < n; ++i) {

            trackObjects[i].obj.DrawInTrack(graphics);
        }
        if(this.Spline != null)
        {
            this.Spline.Draw(graphics);
        }
        if(this.PolyLine != null)
        {
            this.PolyLine.Draw(graphics);
        }
        if(this.PolyLine2 !== null)
        {
            this.PolyLine2.Draw(graphics);
        }

        if (null != this.selectionRect)
        {
            var rect = this.selectionRect;
            this.DrawingDocument.DrawTrackSelectShapes(rect.x, rect.y, rect.w, rect.h);
        }
        //this.Spline.Draw(graphics);  TODO
        //this.PolyLine.Draw(graphics);
       // this.PolyLine2.Draw(graphics);
    },

    CtrlPress: function()
    {
        var _elements = this;
        while(_elements.State.id === 20)
        {
            _elements = _elements.group;
        }
        var _cur_state = _elements.State;
        if(_cur_state instanceof TrackNewShapeState || _cur_state instanceof ResizeGroupObjState)
        {
            _cur_state.OnMouseMove(this, global_mouseEvent, this.MouseX, this.MouseY)
        }
    },

    CtrlUp: function()
    {
        var _elements = this;
        while(_elements.State.id === 20)
        {
            _elements = _elements.group;
        }
        var _cur_state = _elements.State;
        if(_cur_state instanceof TrackNewShapeState || _cur_state instanceof ResizeGroupObjState)
        {
            _cur_state.OnMouseMove(this, global_mouseEvent, this.MouseX, this.MouseY)
        }
    },

    ShiftPress: function()
    {
        var _elements = this;
        while(_elements.State.id === 20)
        {
            _elements = _elements.group;
        }
        var _cur_state = _elements.State;
        if(_cur_state instanceof TrackNewShapeState
            || _cur_state instanceof ResizeGroupObjState
            || _cur_state instanceof MoveState)
        {
            _cur_state.OnMouseMove(this, global_mouseEvent, this.MouseX, this.MouseY)
        }
    },

    ShiftUp: function()
    {
        var _elements = this;
        while(_elements.State.id === 20)
        {
            _elements = _elements.group;
        }
        var _cur_state = _elements.State;
        if(_cur_state instanceof TrackNewShapeState
            || _cur_state instanceof ResizeGroupObjState
            || _cur_state instanceof MoveState)
        {
            _cur_state.OnMouseMove(this, global_mouseEvent, this.MouseX, this.MouseY)
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
    
    Add_InlineObjectXY : function(Obj, X, Y, PageNum)
    {
        var i, j;
        for(i=this.ArrGlyph.length-1; i>-1; --i)
        {
            var g=this.ArrGlyph[i];
            if(!g.IsGroup() && g.text_flag)
            {
                if(g.InTextRect(X, Y))
                {
                    this.obj=g;
                    this.NumEditShape=i;
                    this.ChangeState(new AddTextState());
                    this.Document.CurPos.Type=docpostype_FlowShape;

                    g.DocumentContent.Cursor_MoveAt(X, Y, 0 );
                    g.DocumentContent.Add_InlineObject(Obj);
                    return true;
                }
            }
            else if(g.IsGroup())
            {
                for(j=0; j<g.ArrGlyph.length; ++j)
                {
                    if(g.ArrGlyph[j].InTextRect(X, Y)&&g.ArrGlyph[j].text_flag)
                    {
                        this.obj=g;
                        this.group=this.obj;
                        this.ArrTrackObj.length=0;
                        this.ChangeState(new GroupState());
                        g.ChangeState(new AddTextState());

                        this.Document.CurPos.Type=docpostype_FlowShape;
                        this.obj=g.ArrGlyph[j];
                        this.NumEditShape=i;
                        g.ArrGlyph[j].DocumentContent.Cursor_MoveAt(X, Y, 0 );
                        g.ArrGlyph[j].DocumentContent.Add_InlineObject(Obj);
                        return true;
                    }
                }
            }
        }
        this.Document.CurPos.Type=docpostype_Content;
        return false;
    },

    InlineObject_Move : function(Obj, X, Y, PageNum)
    {
        var i, j;
        for(i=this.ArrGlyph.length-1; i>-1; --i)
        {
            var g=this.ArrGlyph[i];
            if(!g.IsGroup() && g.text_flag)
            {
                if(g.InTextRect(X, Y))
                {
                    this.obj=g;
                    this.NumEditShape=i;
                    this.ChangeState(new AddTextState());
                    this.Document.CurPos.Type=docpostype_FlowShape;


                    g.DocumentContent.Cursor_MoveAt(X, Y, 0 );
                    g.DocumentContent.Add_InlineObject(Obj);
                    return true;
                }
            }
            else if(g.IsGroup())
            {
                for(j=0; j<g.ArrGlyph.length; ++j)
                {
                    if(g.ArrGlyph[j].InTextRect(X, Y)&&g.ArrGlyph[j].text_flag)
                    {
                        this.obj=g;
                        this.group=this.obj;
                        this.ArrTrackObj.length=0;
                        this.ChangeState(new GroupState());
                        g.ChangeState(new AddTextState());

                        this.Document.CurPos.Type=docpostype_FlowShape;
                        this.obj=g.ArrGlyph[j];
                        this.NumEditShape=i;
                        g.ArrGlyph[j].DocumentContent.Cursor_MoveAt(X, Y, 0 );
                        g.ArrGlyph[j].DocumentContent.Add_InlineObject(Obj);
                        return true;
                    }
                }
            }
        }
        this.Document.CurPos.Type=docpostype_Content;
        return false;
    },

    Get_NearestPos: function(PageNum, X, Y)
    {
        var i, j;
        for(i=this.ArrGlyph.length-1; i>-1; --i)
        {
            var g=this.ArrGlyph[i];
            if(!g.IsGroup())
            {
                if(g.InTextRect(X, Y) && g.text_flag)
                {
                    return g.DocumentContent.Get_NearestPos(PageNum, X, Y);
                }
            }
            else 
            {
                for(j=0; j<g.ArrGlyph.length; ++j)
                {
                    if(g.ArrGlyph[j].InTextRect(X, Y)&&g.ArrGlyph[j].text_flag)
                    {
                        return g.ArrGlyph[j].DocumentContent.Get_NearestPos(PageNum, X, Y);
                    }
                }
            }
        }
        return false;
    },

    RecalculateAfterResize: function()
    {

    },

    selectAll : function()
    {
        for( var i = 0, n = this.ArrGlyph.length; i < n; ++i)
        {
            this.ArrGlyph[i].selected = true;
        }
        this.NumSelected = n;
        this.updateSelectionMap();
    },

    IsGroup : function()
    {
        return false;
    },

    updateCursorType2 : function(x, y, e)
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
                    this.DrawingDocument.SetCursorType("default");
                }
            }
        }


    },

    updateCursorType : function(x, y, e)
    {
        this.updateCursorType2(x, y, e);
    },


    updateInterfaceState : function()
    {


    }
};