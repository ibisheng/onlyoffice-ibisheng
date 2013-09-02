function CImage2(parent)
{

    this.type = graphic_objects_type_Image;
    this.parent = parent;
    this.pH = 0;
    this.pV = 0;
    this.rot = 0;
    this.off = {x:0, y:0};
    this.ext = {cx:0, cy:0};

    this.flipH = false;
    this.flipV = false;


    this.shadow=
    {
        color: {r:0, g:0, b:0},
        length:0,
        angle: Math.PI*0.25,
        alpha: 64,
        blur:0
    };

    this.alpha=255;
    this.isLine=false;
    this.TransformMatrix=new CMatrixL();
    this.TransformTextMatrix=new CMatrixL();
    this.Container=null;
    this.spPr = new CSpPr();

    this.blipFill = null;

    this.DrawingDocument = editor.WordControl.m_oDrawingDocument;

    if(this.parent.kind == SLIDE_KIND)
    {
        this.Container = this.parent.elementsManipulator;
    }
}

CImage2.prototype = {


    hitToHyperlink: function(x, y)
    {
        return false;
    },
    RecalculateContent2: function()
    {

    },

    calculateFill: function(){},
    calculateLine: function(){},
    calculateText: function(){},

    changeProportions: function(kW, kH)
    {
        var _rot = this.rot == null ? ((this.spPr.xfrm.rot == null) ? 0 : this.spPr.xfrm.rot) : this.rot ;
        if(_rot<Math.PI*0.25||_rot>Math.PI*1.75 ||
            (_rot > Math.PI*0.75 && _rot < Math.PI*1.25))
        {
            if(this.spPr.xfrm.offX !== null)
            {
                this.spPr.xfrm.offX*=kW;
                this.spPr.xfrm.offY*=kH;
                this.spPr.xfrm.extX*=kW;
                this.spPr.xfrm.extY*=kH;
            }

            this.pH *= kW;
            this.pV *= kH;
            if(this.ext !== null && typeof this.ext === "object")
            {
                this.ext.cx *= kW;
                this.ext.cy *= kH;
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
            }

            this.pH *= kW;
            this.pV *= kH;
            if(this.ext !== null && typeof this.ext === "object")
            {
                this.ext.cx *= kH;
                this.ext.cy *= kW;
            }
        }
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

    createCopy : function(parent, container, posX, posY)//копирование фигуры для последующей вставки на слайд.
    {
        var _copied_shape = new CImage2(parent);
        _copied_shape.setContainer(container);

        _copied_shape.spPr = this.spPr.createDuplicate();
        _copied_shape.spPr.xfrm.offX = posX;
        _copied_shape.spPr.xfrm.offY = posY;
        _copied_shape.spPr.xfrm.extX = this.ext.cx;
        _copied_shape.spPr.xfrm.extY = this.ext.cy;
        _copied_shape.spPr.xfrm.rot = this.rot;
        _copied_shape.spPr.xfrm.flipH = this.flipH;
        _copied_shape.spPr.xfrm.flipV = this.flipV;

        _copied_shape.nvPicPr = new UniNvPr();
        _copied_shape.nvPicPr.cNvPr.id = ++parent.maxId;

        if(this.blipFill != null)
        {
            _copied_shape.blipFill = this.blipFill.createDuplicate();
        }
        return _copied_shape;
    },

    createDuplicateForTrack : function(container)//копирование фигуры для последующей вставки на слайд.
    {
        var _copied_shape = new CImage2(this.parent);
        _copied_shape.setContainer(container);
        _copied_shape.pH = this.pH;
        _copied_shape.pV = this.pV;
        _copied_shape.off = {};
        _copied_shape.off.x = 0;
        _copied_shape.off.y = 0;
        _copied_shape.ext = {};
        _copied_shape.ext.cx = this.ext.cx;
        _copied_shape.ext.cy = this.ext.cy;
        _copied_shape.rot = this.rot;
        _copied_shape.flipH = this.flipH;
        _copied_shape.flipV = this.flipV;
        if(this.blipFill != null)
        {
            _copied_shape.blipFill = this.blipFill.createDuplicate();
        }
        return _copied_shape;
    },

    IsLine : function()
    {
        return  false;
    },

    getXfrm : function ()
    {
        if(this.parent.kind != SLIDE_KIND)
        {
            if(this.spPr.xfrm.offX != null)
            {
                return this.spPr.xfrm;
            }
            else
            {
                return null;
            }
        }
        var _xfrm = new CXfrm();
        if(this.spPr.xfrm != null && this.spPr.xfrm.offX!= null)
        {
            _xfrm.offX = this.pH;
            _xfrm.offY = this.pV;
            _xfrm.extX = this.ext.cx;
            _xfrm.extY = this.ext.cy;
            _xfrm.flipH = this.flipH;
            _xfrm.flipV = this.flipV;
            _xfrm.rot = this.rot;
            return _xfrm;
        }
        else if(this.isPlaceholder())
        {
            var _phType, _phIdx;
            _phType = this.nvPicPr.nvPr.ph.type;
            _phIdx = this.nvPicPr.nvPr.ph.idx;
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
                _xfrm.flipH = this.flipH;
                _xfrm.flipV = this.flipV;
                _xfrm.rot = this.rot;
                return _xfrm;
            }
        }
        else
        {
            return null;
        }
    },

    createFullCopy : function(parent, container)
    {
        var _copy = new CImage2(parent);
        _copy.setContainer(container);
        _copy.pH = this.pH;
        _copy.pV = this.pV;
        _copy.ext = clone(this.ext);
        _copy.off = clone(this.off);
        _copy.rot = this.rot;
        _copy.flipH = this.flipH;
        _copy.flipV = this.flipV;
        if(this.blipFill != null)
        {
            _copy.blipFill = this.blipFill.createDuplicate();
        }
        _copy.spPr = this.spPr.createDuplicate();
        _copy.nvPicPr = clone(this.nvPicPr);
        if(_copy.nvPicPr && _copy.nvPicPr.cNvPr)
        {
            _copy.nvPicPr.cNvPr.id = ++parent.maxId;
        }
        else if(_copy.nvPicPr)
        {
            _copy.nvPicPr.cNvPr = new CNvPr();
            _copy.nvPicPr.cNvPr.id = ++parent.maxId;
        }
        else
        {
            _copy.nvPicPr = new UniNvPr();
            _copy.nvPicPr.cNvPr.id = ++parent.maxId;
        }
        return _copy;
    },

    calculateXfrm: function()
    {
        var _transform = this.spPr.xfrm;
        var _historyData = {};

        if(_transform != null && _transform.offX != null)
        {
            _historyData.oldTransform = _transform.createDuplicate();

            _transform.offX = this.pH;
            _transform.offY = this.pV;
            _transform.extX = this.ext.cx;
            _transform.extY = this.ext.cy;
            _transform.rot = this.rot;
            _transform.flipH = this.flipH;
            _transform.flipV = this.flipV;

            _historyData.newTransform = _transform.createDuplicate();
            _historyData.undo_function = function(data)
            {
                this.spPr.xfrm = data.oldTransform.createDuplicate();
            };
            _historyData.redo_function = function(data)
            {
                this.spPr.xfrm = data.newTransform.createDuplicate();
            };
            History.Add(this, _historyData);
        }
        else
        {
            if(this.isPlaceholder())
            {
                var _type = this.nvSpPr.nvPr.ph.type;
                var _idx = this.nvSpPr.nvPr.ph.idx;
                var _master = null, _layout = null;
                var _layout_shape = null;
                var _master_shape = null;
                var _compiled_transform = new CXfrm();
                switch(this.parent.kind)
                {
                    case SLIDE_KIND:
                    {
                        _layout = this.parent.Layout;
                        if(_layout != null && typeof _layout === "object")
                        {
                            _layout_shape = _layout.getMatchingShape(_type, _idx);
                            _master = _layout.Master;
                            if(_master != null && typeof _master === "object")
                            {
                                _master_shape = _master.getMatchingShape(_type, _idx);
                            }
                        }
                        break;
                    }
                    case LAYOUT_KIND:
                    {
                        _master = this.parent.Master;
                        if(_master != null && typeof _master === "object")
                        {
                            _master_shape = _master.getMatchingShape(_type, _idx);
                        }
                        break;
                    }
                }
                if(_master_shape != null && _master_shape.spPr != null && _master_shape.spPr.xfrm != null)
                {
                    _compiled_transform.merge(_master_shape.spPr.xfrm);
                }
                if(_layout_shape != null && _layout_shape.spPr != null && _layout_shape.spPr.xfrm != null)
                {
                    _compiled_transform.merge(_layout_shape.spPr.xfrm);
                }

                if(_compiled_transform.offX != null)
                {
                    if(_compiled_transform.rot === null)
                    {
                        _compiled_transform.rot = 0;
                    }
                    if(_compiled_transform.flipH === null)
                    {
                        _compiled_transform.flipH = false;
                    }
                    if(_compiled_transform.flipV === null)
                    {
                        _compiled_transform.flipV = false;
                    }
                    if(this.flipH === null)
                    {
                        this.flipH =  false;
                    }
                    if(this.flipV === null)
                    {
                        this.flipV = false;
                    }
                    if(this.rot === null)
                    {
                        this.rot = 0;
                    }
                    if(_compiled_transform.offX !== this.pH
                        || _compiled_transform.offY !== this.pV
                        || _compiled_transform.extX !== this.ext.cx
                        || _compiled_transform.extY !== this.ext.cy
                        || _compiled_transform.rot !== this.rot
                        || _compiled_transform.flipH !== this.flipH
                        || _compiled_transform.flipV !== this.flipV)
                    {
                        var _new_transform = new CXfrm();
                        _new_transform.offX = this.pH;
                        _new_transform.offY = this.pV;
                        _new_transform.extX = this.ext.cx;
                        _new_transform.extY = this.ext.cy;
                        _new_transform.rot = this.rot;
                        _new_transform.flipH = this.flipH;
                        _new_transform.flipV = this.flipV;

                        this.spPr.xfrm = _new_transform;
                        _historyData = {};
                        _historyData.oldTransform = new CXfrm();
                        _historyData.newTransform = _new_transform.createDuplicate();
                        _historyData.undo_function = function(data)
                        {
                            this.spPr.xfrm = data.oldTransform.createDuplicate();
                        };
                        _historyData.redo_function = function(data)
                        {
                            this.spPr.xfrm = data.newTransform.createDuplicate();
                        };
                        History.Add(this, _historyData);
                    }
                }
            }
            else
            {
                _historyData = {};
                _historyData.oldTransform = new CXfrm();
                var _new_xfrm = new CXfrm();
                _new_xfrm.offX = this.pH;
                _new_xfrm.offY = this.pV;
                _new_xfrm.extX = this.ext.cx;
                _new_xfrm.extY = this.ext.cy;
                _new_xfrm.flipH = this.flipH;
                _new_xfrm.flipV = this.flipV;
                _new_xfrm.rot = this.rot;
                _historyData.newTransform = _new_xfrm;
                _historyData.undo_function = function(data)
                {
                    this.spPr.xfrm = data.oldTransform.createDuplicate();
                };
                _historyData.redo_function = function(data)
                {
                    this.spPr.xfrm = data.newTransform.createDuplicate();
                };
                History.Add(this, _historyData);
            }
        }
    },

    getCurDocumentContent : function()
    {
        return null;
    },

    getSearchResults : function()
    {
        return null;
    },
    setVerticalAlign : function(align)
    {
        return false;
    },

    Get_SelectionState : function()
    {},

    Set_SelectionState : function()
    {},

    prepareToChangeTheme : function(_new_layout)
    {
        var _history_obj = {};
        _history_obj.oldXfrm = this.spPr.xfrm.createDuplicate();
        if(this.spPr.xfrm.offX != null)
        {
            _history_obj.oldXfrm = this.spPr.xfrm.createDuplicate();
            var _xfrm = this.spPr.xfrm;
            _xfrm.offX = this.pH;
            _xfrm.offY = this.pV;

            _xfrm.extX = this.ext.cx;
            _xfrm.extY = this.ext.cy;

            _xfrm.rot = this.rot;
            _xfrm.flipH = this.flipH;
            _xfrm.flipV = this.flipV;
            return;
        }
        else
        {
            if(this.isPlaceholder())
            {
                var _ph_type = this.nvPicPr.nvPr.ph.type, _ph_index = this.nvPicPr.nvPr.ph.idx;
                var _new_layout_shape = _new_layout.getMatchingShape(_ph_type, _ph_index);
                var _new_master_shape = _new_layout.Master.getMatchingShape(_ph_type, _ph_index);
                var _new_compiled_xfrm = new CXfrm();
                if(_new_master_shape != null)
                {
                    _new_compiled_xfrm.merge(_new_master_shape.spPr.xfrm);
                }
                if(_new_layout_shape != null)
                {
                    _new_compiled_xfrm.merge(_new_layout_shape.spPr.xfrm);
                }
                if(_new_compiled_xfrm.offX == null)
                {
                    _xfrm = this.spPr.xfrm;
                    _xfrm.offX = this.pH;
                    _xfrm.offY = this.pV;

                    _xfrm.extX = this.ext.cx;
                    _xfrm.extY = this.ext.cy;

                    _xfrm.rot = this.rot;
                    _xfrm.flipH = this.flipH;
                    _xfrm.flipV = this.flipV;
                    _history_obj.newXfrm = _xfrm.createDuplicate();

                    _history_obj.undo_function = function(data)
                    {
                        this.spPr.xfrm = data.oldXfrm;
                    };
                    _history_obj.redo_function = function(data)
                    {
                        this.spPr.xfrm = data.newXfrm;
                    }
                    History.Add(this, _history_obj);
                    return;
                }
                else
                {
                    /* if(this.spPr.xfrm.offX != this.pH
                     || this.spPr.xfrm.offY != this.pV
                     || this.spPr.xfrm.extX != this.ext.cx
                     || this.spPr.xfrm.extY != this.ext.cy
                     || (this.spPr.xfrm.rot != null && this.rot != this.spPr.xfrm.rot)
                     || (this.spPr.xfrm.rot == null && this.rot != 0)
                     || (this.spPr.xfrm.flipH != null && this.flipH != this.spPr.xfrm.flipH)
                     || (this.spPr.xfrm.flipH == null && this.flipH === true)
                     || (this.spPr.xfrm.flipV != null && this.flipV != this.spPr.xfrm.flipV)
                     || (this.spPr.xfrm.flipV == null && this.flipV === true))
                     {
                     var _xfrm = this.spPr.xfrm;
                     _xfrm.offX = this.pH;
                     _xfrm.offY = this.pV;

                     _xfrm.extX = this.ext.cx;
                     _xfrm.extY = this.ext.cy;

                     _xfrm.rot = this.rot;
                     _xfrm.flipH = this.flipH;
                     _xfrm.flipV = this.flipV;
                     return;
                     }                 */
                    var _old_layout_shape = this.parent.Layout.getMatchingShape(_ph_type, _ph_index);
                    var _old_master_shape = this.parent.Layout.Master.getMatchingShape(_ph_type, _ph_index);
                    var _old_compiled_xfrm = new CXfrm();
                    if(_old_master_shape != null)
                    {
                        _old_compiled_xfrm.merge(_old_master_shape.spPr.xfrm);
                    }
                    if(_old_layout_shape != null)
                    {
                        _old_compiled_xfrm.merge(_old_layout_shape.spPr.xfrm);
                    }
                    if(_old_compiled_xfrm.offX != null)
                    {
                        if(this.flipH == null)
                        {
                            this.flipH = false;
                        }
                        if(this.flipV == null)
                        {
                            this.flipV = false;
                        }

                        if(this.pH != _old_compiled_xfrm.offX
                            || this.pV != _old_compiled_xfrm.offY
                            || this.ext.cx != _old_compiled_xfrm.extX
                            || this.ext.cy != _old_compiled_xfrm.extY
                            || (_old_compiled_xfrm.rot == null && this.rot != 0)
                            || (_old_compiled_xfrm.rot != null && this.rot != _old_compiled_xfrm.rot)
                            || (_old_compiled_xfrm.flipH == null && ( this.flipH != false))
                            || (_old_compiled_xfrm.flipH != null && this.flipH != _old_compiled_xfrm.flipH)
                            || (_old_compiled_xfrm.flipV == null && (this.flipV != false))
                            || (_old_compiled_xfrm.flipV != null && this.flipV != _old_compiled_xfrm.flipV))
                        {
                            var _xfrm = this.spPr.xfrm;
                            _xfrm.offX = this.pH;
                            _xfrm.offY = this.pV;

                            _xfrm.extX = this.ext.cx;
                            _xfrm.extY = this.ext.cy;

                            _xfrm.rot = this.rot;
                            _xfrm.flipH = this.flipH;
                            _xfrm.flipV = this.flipV;
                            _history_obj.newXfrm = _xfrm.createDuplicate();

                            _history_obj.undo_function = function(data)
                            {
                                this.spPr.xfrm = data.oldXfrm;
                            };
                            _history_obj.redo_function = function(data)
                            {
                                this.spPr.xfrm = data.newXfrm;
                            }
                            History.Add(this, _history_obj);
                            return;
                        }
                    }
                }
            }
            else
            {
                _xfrm = this.spPr.xfrm;
                _xfrm.offX = this.pH;
                _xfrm.offY = this.pV;

                _xfrm.extX = this.ext.cx;
                _xfrm.extY = this.ext.cy;

                _xfrm.rot = this.rot;
                _xfrm.flipH = this.flipH;
                _xfrm.flipV = this.flipV;
                return;
            }
        }
    },

    prepareToChangeTheme2: function()
    {

    },

    calculate2 : function()
    {
        var _xfrm = new CXfrm();
        if(this.isPlaceholder())
        {
            var phIdx = this.nvPicPr.nvPr.ph.idx, phType = this.nvPicPr.nvPr.ph.type;
            var _master_shape, _layout_shape;
            switch(this.parent.kind)
            {
                case SLIDE_KIND :
                {
                    var duplicate =  this.createDuplicate();
                    _master_shape = this.parent.Layout.Master.getMatchingShape(phType, phIdx);
                    _layout_shape = this.parent.Layout.getMatchingShape(phType, phIdx);

                    if(_master_shape)
                    {
                        _xfrm.merge(_master_shape.spPr.xfrm);
                    }
                    if(_layout_shape)
                    {
                        _xfrm.merge(_layout_shape.spPr.xfrm);
                    }
                    _xfrm.merge(duplicate.spPr.xfrm);

                    break;
                }
                case LAYOUT_KIND :
                {
                    duplicate =  this.createDuplicate();
                    _master_shape = this.parent.Master.getMatchingShape(phType, phIdx);
                    if(_master_shape)
                    {
                        _xfrm.merge(_master_shape.spPr.xfrm);
                    }
                    _xfrm.merge(duplicate.spPr.xfrm);
                    break;
                }
                case  MASTER_KIND:
                {
                    _xfrm.merge(this.spPr.xfrm);
                    break;
                }
            }
        }
        else
        {
            _xfrm.merge(this.spPr.xfrm);
        }


        this.ext = {};
        this.off = {x: 0, y:0};
        if(_xfrm.offX !== null)
        {
            this.pH = _xfrm.offX;
        }
        else
        {
            this.pH = 0;
        }
        if(_xfrm.offY !== null)
        {
            this.pV = _xfrm.offY;
        }
        else
        {
            this.pV = 0;
        }

        if(_xfrm.extX !== null)
        {
            this.ext.cx = _xfrm.extX;
        }
        else
        {
            this.ext.cx = 10;
        }

        if(_xfrm.extY !== null)
        {
            this.ext.cy = _xfrm.extY;
        }
        else
        {
            this.ext.cy = 10;
        }

        if(_xfrm.rot !== null)
        {
            this.rot = _xfrm.rot;
        }
        else
        {
            this.rot = 0;
        }

        if(_xfrm.flipH !== undefined)
        {
            this.flipH = _xfrm.flipH;
        }
        else
        {
            this.flipH = false;
        }
        if(_xfrm.flipV !== undefined)
        {
            this.flipV = _xfrm.flipV;
        }
        else
        {
            this.flipV = false;
        }

        this.Recalculate();
        this.updateCursorTypes();

    },
    Save_Changes : function(Data, Writer)
    {
    },

    selectionSetStart : function(X,Y, PageIndex, MouseEvent)
    {
    },

    changePresetGeom : function(sPreset)
    {
        var historyData = {};
        historyData.old_geometry = this.geometry;

        if(sPreset!=null)
        {
            historyData.new_geometry = CreateGeometry(sPreset);
            historyData.new_geometry.Init(100, 100);
        }
        else
            historyData.new_geometry = null;

        historyData.undo_function = function(data)
        {
            this.geometry = data.old_geometry;
            this.Recalculate();
            this.Container.DrawingDocument.OnRecalculatePage(this.parent.num, this.parent);
        };
        historyData.redo_function = function(data)
        {
            this.geometry = data.new_geometry;
            this.Recalculate();
            this.Container.DrawingDocument.OnRecalculatePage(this.parent.num, this.parent);
        };
        History.Add(this, historyData);

        if(sPreset!=null)
        {
            this.geometry = CreateGeometry(sPreset);
            this.geometry.Init(100, 100);

        }
        else
        {
            this.geometry = null;
        }
        this.Recalculate();

        this.Container.DrawingDocument.OnRecalculatePage(this.parent.num, this.parent);
    },

    changeSize : function(w, h)
    {

        var historyData = {};
        historyData.old_w = this.ext.cx;
        historyData.old_h = this.ext.cy;
        historyData.new_w = w;
        historyData.new_h = h;
        historyData.undo_function = function(data)
        {
            this.ext.cx = data.old_w;
            this.ext.cy = data.old_h;
            this.Recalculate();
            this.Container.DrawingDocument.OnRecalculatePage(this.parent.num, this.parent);
        };
        historyData.redo_function = function(data)
        {
            this.ext.cx = data.new_w;
            this.ext.cy = data.new_h;
            this.Recalculate();
            this.Container.DrawingDocument.OnRecalculatePage(this.parent.num, this.parent);
        };
        History.Add(this, historyData);

        this.ext.cx = w;
        this.ext.cy = h;
        this.Recalculate();
        this.Container.DrawingDocument.OnRecalculatePage(this.parent.num, this.parent);
    },

    changeFill : function(unifill)
    {

        if(unifill.fill.type != FILL_TYPE_BLIP)
            return;
        var historyData = {};
        historyData.old_fill = this.brush;
        historyData.new_fill = unifill;
        historyData.undo_function = function(data)
        {
            var theme = this.parent.Layout.Master.Theme;
            var brush = null;
            var RGBA = {R:0, G:0, B:0, A:255};
            if (theme && this.style!=null && this.style.fillRef!=null)
            {
                brush = theme.getFillStyle(this.style.fillRef.idx);
                this.style.fillRef.Color.Calculate(theme, this.parent, this.parent.Layout, this.parent.Layout.Master);
                RGBA = this.style.fillRef.Color.RGBA;

                if (this.style.fillRef.Color.color != null)
                {
                    if (brush.fill != null && brush.fill.type == FILL_TYPE_SOLID)
                    {
                        brush.fill.color = this.style.fillRef.Color.createDuplicate();
                    }
                }

            }
            else
            {
                brush = new CUniFill();
            }

            brush.merge(data.old_fill);
            this.brush = brush;
            this.brush.calculate(theme, this.parent, this.parent.Layout, this.parent.Layout.Master, RGBA);
            this.Container.DrawingDocument.OnRecalculatePage(this.parent.num, this.parent);
        };

        historyData.redo_function = function(data)
        {
            var theme = this.parent.Layout.Master.Theme;
            var brush = null;
            var RGBA = {R:0, G:0, B:0, A:255};
            if (theme && this.style!=null && this.style.fillRef!=null)
            {
                brush = theme.getFillStyle(this.style.fillRef.idx);
                this.style.fillRef.Color.Calculate(theme, this.parent, this.parent.Layout, this.parent.Layout.Master);
                RGBA = this.style.fillRef.Color.RGBA;

                if (this.style.fillRef.Color.color != null)
                {
                    if (brush.fill != null && brush.fill.type == FILL_TYPE_SOLID)
                    {
                        brush.fill.color = this.style.fillRef.Color.createDuplicate();
                    }
                }

            }
            else
            {
                brush = new CUniFill();
            }

            brush.merge(data.new_fill);
            this.brush = brush;
            this.brush.calculate(theme, this.parent, this.parent.Layout, this.parent.Layout.Master, RGBA);
            this.Container.DrawingDocument.OnRecalculatePage(this.parent.num, this.parent);
        };
        History.Add(this, historyData);
        var theme = this.parent.Layout.Master.Theme;
        var brush = null;
        var RGBA = {R:0, G:0, B:0, A:255};
        if (theme && this.style!=null && this.style.fillRef!=null)
        {
            brush = theme.getFillStyle(this.style.fillRef.idx);
            this.style.fillRef.Color.Calculate(theme, this.parent, this.parent.Layout, this.parent.Layout.Master);
            RGBA = this.style.fillRef.Color.RGBA;

            if (this.style.fillRef.Color.color != null)
            {
                if (brush.fill != null && brush.fill.type == FILL_TYPE_SOLID)
                {
                    brush.fill.color = this.style.fillRef.Color.createDuplicate();
                }
            }

        }
        else
        {
            brush = new CUniFill();
        }

        brush.merge(unifill);
        this.blipFill = brush;
        this.blipFill.calculate(theme, this.parent, this.parent.Layout, this.parent.Layout.Master, RGBA);

        this.Container.DrawingDocument.OnRecalculatePage(this.parent.num, this.parent);

    },


    changeLine : function(line)
    {

        var historyData = {};

        historyData.old_pen = this.pen;
        historyData.new_pen = line;

        historyData.undo_function = function(data)
        {
            var theme = this.parent.Layout.Master.Theme;
            var RGBA = {R:0, G:0, B:0, A:255};
            var pen = null;
            if(theme && this.style!=null && this.style.lnRef!=null)
            {
                pen = theme.getLnStyle(this.style.lnRef.idx);
                this.style.lnRef.Color.Calculate(theme, this.parent, this.parent.Layout, this.parent.Layout.Master);
                RGBA = this.style.lnRef.Color.RGBA;
            }
            else
            {
                pen = new CLn();
            }
            if(data.old_pen!=null)
            {
                pen.merge(data.old_pen)
            }

            if(pen.Fill!=null)
            {
                pen.Fill.calculate(theme, this.parent, this.parent.Layout, this.parent.Layout.Master, RGBA) ;
            }
            this.pen = pen;
            this.Container.DrawingDocument.OnRecalculatePage(this.parent.num, this.parent);
        };

        historyData.redo_function = function(data)
        {
            var theme = this.parent.Layout.Master.Theme;
            var RGBA = {R:0, G:0, B:0, A:255};
            var pen = null;
            if(theme && this.style!=null && this.style.lnRef!=null)
            {
                pen = theme.getLnStyle(this.style.lnRef.idx);
                this.style.lnRef.Color.Calculate(theme, this.parent, this.parent.Layout, this.parent.Layout.Master);
                RGBA = this.style.lnRef.Color.RGBA;
            }
            else
            {
                pen = new CLn();
            }
            if(data.new_pen!=null)
            {
                pen.merge(data.new_pen)
            }

            if(pen.Fill!=null)
            {
                pen.Fill.calculate(theme, this.parent, this.parent.Layout, this.parent.Layout.Master, RGBA) ;
            }
            this.pen = pen;
            this.Container.DrawingDocument.OnRecalculatePage(this.parent.num, this.parent);
        };

        var theme = this.parent.Layout.Master.Theme;
        var RGBA = {R:0, G:0, B:0, A:255};
        var pen = null;
        if(theme && this.style!=null && this.style.lnRef!=null)
        {
            pen = theme.getLnStyle(this.style.lnRef.idx);
            this.style.lnRef.Color.Calculate(theme, this.parent, this.parent.Layout, this.parent.Layout.Master);
            RGBA = this.style.lnRef.Color.RGBA;
        }
        else
        {
            pen = new CLn();
        }
        if(line!=null)
        {
            pen.merge(line)
        }

        if(pen.Fill!=null)
        {
            pen.Fill.calculate(theme, this.parent, this.parent.Layout, this.parent.Layout.Master, RGBA) ;
        }
        this.pen = pen;
        this.Container.DrawingDocument.OnRecalculatePage(this.parent.num, this.parent);
    },

    changeSizes : function(kW, kH)
    {
        this.ext.cx*=kW;
        this.ext.cy*=kH;
    },

    createDuplicate : function()
    {
        var duplicate = new CImage2(this.parent);
        if(this.nvPicPr!=null)
        {
            duplicate.nvPicPr = this.nvPicPr.createDuplicate();
        }
        if(this.blipFill)
        {
            duplicate.blipFill = this.blipFill.createDuplicate();
        }
        if(this.spPr)
        {
            duplicate.spPr = this.spPr.createDuplicate();
        }
        if(this.style)
        {
            duplicate.style= this.style.createDuplicate();
        }

        return duplicate;

    },

    Get_StartPage_Absolute: function()
    {
        return 0;
    },

    AddGeometry: function(geometry)
    {
        this.geometry=geometry;
    },

    Paragraph_Add: function(ParaItem, bRecalculate)
    {
        /*if(this.DocumentContent)
            this.DocumentContent.Paragraph_Add(ParaItem, bRecalculate);  */
    },

    calculate: function()
    {
        var _xfrm = new CXfrm();
        if(this.isPlaceholder())
        {
            var phIdx = this.nvPicPr.nvPr.ph.idx, phType = this.nvPicPr.nvPr.ph.type;
            var _master_shape, _layout_shape;
            switch(this.parent.kind)
            {
                case SLIDE_KIND :
                {
                    var duplicate =  this.createDuplicate();
                    _master_shape = this.parent.Layout.Master.getMatchingShape(phType, phIdx);
                    _layout_shape = this.parent.Layout.getMatchingShape(phType, phIdx);


                    if(_master_shape)
                    {
                        _xfrm.merge(_master_shape.spPr.xfrm);
                    }
                    if(_layout_shape)
                    {
                        _xfrm.merge(_layout_shape.spPr.xfrm);
                    }
                    _xfrm.merge(duplicate.spPr.xfrm);

                    break;
                }
                case LAYOUT_KIND :
                {
                    duplicate =  this.createDuplicate();
                    _master_shape = this.parent.Master.getMatchingShape(phType, phIdx);

                    if(_master_shape)
                    {
                        _xfrm.merge(_master_shape.spPr.xfrm);
                    }
                    _xfrm.merge(duplicate.spPr.xfrm);
                    break;
                }
                case  MASTER_KIND:
                {
                    _xfrm.merge(this.spPr.xfrm);
                    break;
                }
            }
        }
        else
        {
            _xfrm.merge(this.spPr.xfrm);
        }


        this.ext = {};
        this.off = {x: 0, y:0};
        if(_xfrm.offX !== null)
        {
            this.pH = _xfrm.offX;
        }
        else
        {
            this.pH = 0;
        }
        if(_xfrm.offY !== null)
        {
            this.pV = _xfrm.offY;
        }
        else
        {
            this.pV = 0;
        }

        if(_xfrm.extX !== null)
        {
            this.ext.cx = _xfrm.extX;
        }
        else
        {
            this.ext.cx = 10;
        }

        if(_xfrm.extY !== null)
        {
            this.ext.cy = _xfrm.extY;
        }
        else
        {
            this.ext.cy = 10;
        }

        if(_xfrm.rot !== null)
        {
            this.rot = _xfrm.rot;
        }
        else
        {
            this.rot = 0;
        }

        if(_xfrm.flipH !== undefined)
        {
            this.flipH = _xfrm.flipH;
        }
        else
        {
            this.flipH = false;
        }
        if(_xfrm.flipV !== undefined)
        {
            this.flipV = _xfrm.flipV;
        }
        else
        {
            this.flipV = false;
        }

        this.Recalculate();
        this.updateCursorTypes();
    },

    calculateColors: function()
    {
    },

    Get_PageContentStartPos: function()
    {
        return {
            X : this.geometry.rect.l+this.pH+this.ext.x,
            XLimit: this.geometry.r-this.geometry.l,
            Y : this.geometry.rect.t+this.pV+this.ext.y,
            YLimit : this.geometry.b-this.geometry.t,
            MaxTopBorder : 0}
    },

    init: function()
    {
         if(this.spPr!=undefined && this.spPr.xfrm !=undefined)
        {
            var xfrm = this.spPr.xfrm;
            this.pH =  xfrm.off.x;
            this.pV =  xfrm.off.y;
            this.ext = xfrm.ext;
        }
        else
        {
           
        }
        this.flipH=false;
        this.flipV=false;
        this.rot=0;
        this.isLine =false;
        this.ImageSrc = this.blipFill.blip.embed;
        this.RecalculateTransformMatrix();
    },

    AddDocumentContent: function()
    {

    },

    applyProps : function(props)
    {
        var historyObj = {};
        /*
        if(props.Paddings.Left!=null)
        {
            historyObj.old_pH = this.pH;
            this.pH = props.Paddings.Left;
            historyObj.new_pH = this.pH;
        }
        if(props.Paddings.Top!=null)
        {
            historyObj.old_pV = this.pV;
            this.pV = props.Paddings.Top;
            historyObj.new_pV = this.pV;
        }
        if(props.Paddings.Bottom!=null)
        {
            historyObj.old_extX = this.ext.cx;
            this.ext.cx = props.Paddings.Bottom - this.pV;
            historyObj.new_extX = this.ext.cx;
        }
        if(props.Paddings.Right!=null)
        {
            historyObj.old_extY = this.ext.cy;
            this.ext.cy = props.Paddings.Right - this.pH;
            historyObj.new_extY = this.ext.cy;
        }*/
        if (props.Position.X != null)
        {
            historyObj.old_pH = this.pH;
            this.pH = props.Position.X;
            historyObj.new_pH = this.pH;
        }
        if (props.Position.Y != null)
        {
            historyObj.old_pV = this.pV;
            this.pV = props.Position.Y;
            historyObj.new_pV = this.pV;
        }
        if (props.Width != null)
        {
            historyObj.old_extX = this.ext.cx;
            this.ext.cx = props.Width;
            historyObj.new_extX = this.ext.cx;
        }
        if (props.Height != null)
        {
            historyObj.old_extY = this.ext.cy;
            this.ext.cy = props.Height;
            historyObj.new_extY = this.ext.cy;
        }

        if(props.ImageUrl)
        {
            historyObj.oldImg = this.blipFill.fill.RasterImageId;
            this.blipFill.fill.RasterImageId  = props.ImageUrl;
            historyObj.newImg = this.blipFill.fill.RasterImageId;
        }

        historyObj.undo_function = function(data)
        {
            if(data.old_pH!=null)
            {
                this.pH = historyObj.old_pH;
            }
            if(data.old_pV!=null)
            {
                this.pV = historyObj.old_pV;
            }
            if(data.old_extX!=null)
            {
                this.ext.cx = historyObj.old_extX;
            }
            if(data.old_extY!=null)
            {
                this.ext.cy = historyObj.old_extY;
            }
            if(data.oldImg)
            {
                this.blipFill.fill.RasterImageId  = data.oldImg;
            }
            this.Recalculate();
        };
        historyObj.redo_function = function(data)
        {
            if(data.new_pH!=null)
            {
                this.pH = historyObj.new_pH;
            }
            if(data.new_pV!=null)
            {
                this.pV = historyObj.new_pV;
            }
            if(data.new_extX!=null)
            {
                this.ext.cx = historyObj.new_extX;
            }
            if(data.new_extY!=null)
            {
                this.ext.cy = historyObj.new_extY;
            }
            if(data.oldImg)
            {
                this.blipFill.fill.RasterImageId  = data.newImg;
            }
            this.Recalculate();
        };

        this.Recalculate();
        History.Add(this, historyObj);
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

    },

    Draw: function(graphics)
    {
        graphics.SetIntegerGrid(false);
        graphics.transform3(this.TransformMatrix);

        var src = "";
        if (this.blipFill != null && this.blipFill.fill)
            src = this.blipFill.fill.RasterImageId;

        if (undefined == src)
            src = "";

        if ("" != src)
            src = _getFullImageSrc(src);

        graphics.drawImage(src, 0, 0, this.ext.cx, this.ext.cy, this.alpha, this.blipFill.fill.srcRect);
        graphics.reset();
        graphics.SetIntegerGrid(true);
    },

    DrawInTextAdd: function(graphics)
    {

    },

    DrawInTrack: function(graphics)
    {
        graphics.SetIntegerGrid(false);
        graphics.transform3(this.TransformMatrix);

        var src = "";
        if (this.blipFill != null && this.blipFill.fill)
            src = this.blipFill.fill.RasterImageId;

        if (undefined == src)
            src = "";

        if ("" != src)
            src = _getFullImageSrc(src);

        var ret = graphics.drawImage(src, 0, 0, this.ext.cx, this.ext.cy, undefined, this.blipFill.fill.srcRect);
        graphics.reset();
        graphics.SetIntegerGrid(true);
    },

    DrawAdj: function(graphics,zoom)
    {
    },

    Move: function(pH, pV) {

        this.pH=pH;
        this.pV=pV;
        this.RecalculateTransformMatrix();
    },

    RecalculateTransformMatrix: function()
    {
        this.TransformMatrix = this.getTransform();
        if(this.txBody)
        {
            this.txBody.calculateTransformMatrix();
        }
        if(this.TransformTextMatrix != undefined)
        {
            this.Container.DrawingDocument.UpdateTargetTransform(this.TransformTextMatrix);
        }
    },

    getTransform : function()
    {
        var  hc, vc;
        hc = this.ext.cx*0.5;
        vc = this.ext.cy*0.5;

        var xc, yc;
        xc = this.pH  + hc;
        yc = this.pV  + vc;

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

        var tmp = this.Container.getTransform();
        global_MatrixTransformer.MultiplyAppend(localTransform, tmp);
        return localTransform;
    },

    Resize: function(num, kd1, kd2) {

        var xfp, yfp;//координаты неподвижной точки
        var hc, vc, sin, cos, tw, th;
        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;
        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);
        var cx, cy;
        cx=this.ext.cx;
        cy=this.ext.cy;
        if(this.isLine && cx==0)
            cx=0.1;
        if(this.isLine && cy==0)
            cy=0.1;
        if(!this.flipH&&!this.flipV)
        {
            switch(num)
            {
                case 0:
                {
                    xfp=(hc*cos-vc*sin)+hc+this.pH+this.off.x;
                    yfp=(hc*sin+vc*cos)+vc+this.pV+this.off.y;

                    tw=cx*kd1;
                    th=cy*kd2;

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

                    th=cy*kd1;

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

                    tw=cx*kd2;
                    th=cy*kd1;

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
                    tw=cx*kd1;

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

                    tw=cx*kd1;
                    th=cy*kd2;

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

                    th=cy*kd1;
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

                    tw=cx*kd2;
                    th=cy*kd1;

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

                    tw=cx*kd1;

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

                    tw=cx*kd1;
                    th=cy*kd2;

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

                    th=cy*kd1;

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

                    tw=cx*kd2;
                    th=cy*kd1;

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
                    tw=cx*kd1;

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

                    tw=cx*kd1;
                    th=cy*kd2;

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

                    th=cy*kd1;
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

                    tw=cx*kd2;
                    th=cy*kd1;

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

                    tw=cx*kd1;

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

                    tw=cx*kd1;
                    th=cy*kd2;

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

                    th=cy*kd1;

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

                    tw=cx*kd2;
                    th=cy*kd1;

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
                    tw=cx*kd1;

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

                    tw=cx*kd1;
                    th=cy*kd2;

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

                    th=cy*kd1;
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

                    tw=cx*kd2;
                    th=cy*kd1;

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

                    tw=cx*kd1;

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

                    tw=cx*kd1;
                    th=cy*kd2;

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

                    th=cy*kd1;

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

                    tw=cx*kd2;
                    th=cy*kd1;

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
                    tw=cx*kd1;

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

                    tw=cx*kd1;
                    th=cy*kd2;

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

                    th=cy*kd1;
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

                    tw=cx*kd2;
                    th=cy*kd1;

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

                    tw=cx*kd1;

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

    ResizeRelativeCenter: function(num, kd1, kd2)
    {
        var xfp, yfp;//координаты неподвижной точки
        var hc, vc, sin, cos, tw, th;
        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;
        xfp=hc+this.pH+this.off.x;
        yfp=vc+this.pV+this.off.y;

        if((!this.flipH&&!this.flipV) || (this.flipH&&this.flipV))
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

                    break;
                }
            }
        }
        else if(this.flipH&&!this.flipV||(!this.flipH&&this.flipV))
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


                    break;
                }
                case 7:
                case 3:
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
        var hc, vc, sin, cos;
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

    selectionSetEnd : function()
    {},

    isPlaceholder : function()
    {
        return this.nvPicPr != null && this.nvPicPr.nvPr != undefined && this.nvPicPr.nvPr.ph != undefined;
    },

    getPhType : function()
    {
        if(this.isPlaceholder())
        {
            return this.nvPicPr.nvPr.ph.type;
        }
        else
        {
            return null;
        }
    },

    isEmptyPlaceholder    : function()
    {
        return false;
    },

    setParent : function(parent)
    {
        this.parent = parent;
    },

    setContainer : function(container)
    {
        this.Container = container;
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
        var cx, cy;
        cx= this.ext.cx>0 ? this.ext.cx : 0.1;
        cy= this.ext.cy>0 ? this.ext.cy : 0.1;
        var p=this.GetPointRelativeShape(x, y);
        if(!this.flipH&&!this.flipV)
        {
            switch(num)
            {
                case 0:
                    return {kd1: (cx-p.x)/cx, kd2: (cy-p.y)/cy};
                case 1:
                    return {kd1: (cy-p.y)/cy, kd2: 0};
                case 2:
                    return {kd1: (cy-p.y)/cy, kd2: p.x/cx};
                case 3:
                    return {kd1: p.x/cx, kd2: 0};
                case 4:
                    return {kd1: p.x/cx, kd2: p.y/cy};
                case 5:
                    return {kd1: p.y/cy, kd2: 0};
                case 6:
                    return {kd1: p.y/cy, kd2:(cx-p.x)/cx};
                case 7:
                    return {kd1:(cx-p.x)/cx, kd2: 0};
            }
        }
        else if(this.flipH&&this.flipV)
        {
            switch(num)
            {
                case 4:
                    return {kd1: (cx-p.x)/cx, kd2: (cy-p.y)/cy};
                case 5:
                    return {kd1: (cy-p.y)/cy, kd2: 0};
                case 6:
                    return {kd1: (cy-p.y)/cy, kd2: p.x/cx};
                case 7:
                    return {kd1: p.x/cx, kd2: 0};
                case 0:
                    return {kd1: p.x/cx, kd2: p.y/cy};
                case 1:
                    return {kd1: p.y/cy, kd2: 0};
                case 2:
                    return {kd1: p.y/cy, kd2:(cx-p.x)/cx};
                case 3:
                    return {kd1:(cx-p.x)/cx, kd2: 0};
            }
        }
        else if(this.flipH&&!this.flipV)
        {
            switch(num)
            {
                case 2:
                    return {kd1: (cx-p.x)/cx, kd2: (cy-p.y)/cy};
                case 1:
                    return {kd1: (cy-p.y)/cy, kd2: 0};
                case 0:
                    return {kd1: (cy-p.y)/cy, kd2: p.x/cx};
                case 7:
                    return {kd1: p.x/cx, kd2: 0};
                case 6:
                    return {kd1: p.x/cx, kd2: p.y/cy};
                case 5:
                    return {kd1: p.y/cy, kd2: 0};
                case 4:
                    return {kd1: p.y/cy, kd2:(cx-p.x)/cx};
                case 3:
                    return {kd1:(cx-p.x)/cx, kd2: 0};
            }
        }
        else if(!this.flipH&&this.flipV)
        {
            switch(num)
            {
                case 6:
                    return {kd1: (cx-p.x)/cx, kd2: (cy-p.y)/cy};
                case 5:
                    return {kd1: (cy-p.y)/cy, kd2: 0};
                case 4:
                    return {kd1: (cy-p.y)/cy, kd2: p.x/cx};
                case 3:
                    return {kd1: p.x/cx, kd2: 0};
                case 2:
                    return {kd1: p.x/cx, kd2: p.y/cy};
                case 1:
                    return {kd1: p.y/cy, kd2: 0};
                case 0:
                    return {kd1: p.y/cy, kd2:(cx-p.x)/cx};
                case 7:
                    return {kd1:(cx-p.x)/cx, kd2: 0};
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
        return this.Parent.Get_Styles();
    },

    Is_Cell: function()
    {
        return true;
    },

    OnContentRecalculate: function(bChange, bForceRecalc )
    {
        this.DrawingDocument.OnRecalculatePage(0, this.Parent.Pages[0]);
    },

    Get_Numbering: function()
    {
        return this.Parent.Get_Numbering();
    },

    Recalculate: function()
    {
        this.RecalculateContent();
        this.RecalculateContent();
    },

    RecalculateContent: function()
    {
        this.RecalculateTransformMatrix();
    },

    Hit: function(x, y)
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

        /*if(this.flipH)
            vx=this.ext.cx-vx;
        if(this.flipV)
            vy=this.ext.cy-vy;

        if(this.fill_color!=0)
        {
            $('<canvas id=\"test_canvas\"></canvas>').insertAfter("#myCanvas");
            var context=document.getElementById('test_canvas').getContext('2d');
            var pathLst=this.geometry.pathLst, path, cmd;
            for(var i=0; i<pathLst.length; i++)
            {
                path=pathLst[i];
                context.beginPath();
                for(var j=0; j<path.ArrPathCommand.length; j++)
                {
                    cmd=path.ArrPathCommand[j];
                    switch(cmd.id)
                    {
                        case moveTo:
                        {
                            context.moveTo(cmd.X*0.01, cmd.Y*0.01);
                            break;
                        }
                        case lineTo:
                        {
                            context.lineTo(cmd.X*0.01, cmd.Y*0.01);
                            break;
                        }
                        case arcTo:
                        {
                            ArcTo(context, cmd.stX, cmd.stY, cmd.wR, cmd.hR, cmd.stAng, cmd.swAng);
                            break;
                        }
                        case bezier3:
                        {
                            context.quadraticCurveTo(cmd.X0*0.01, cmd.Y0*0.01, cmd.X1*0.01, cmd.Y1*0.01);
                            break;
                        }
                        case bezier4:
                        {
                            context.bezierCurveTo(cmd.X0*0.01, cmd.Y0*0.01, cmd.X1*0.01, cmd.Y1*0.01, cmd.X2*0.01, cmd.Y2*0.01);
                            break;
                        }
                        case close:
                        {
                            context.closePath();
                            if(context.isPointInPath(vx, vy))
                            {
                                $("#text_canvas").remove();
                                return true;
                            }
                            if(j<path.ArrPathCommand.length-1)
                            {
                                context.beginPath();
                            }
                        }
                    }
                }
            }

        }
        $("#test_canvas").remove();

        if(this.HitInPath(x, y))
        {
            return true;
        }      */

        return vx>0 && vx < this.ext.cx && vy>0 && vy<this.ext.cy;
    },

    HitInPath: function(x, y)
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

        if(this.flipH)
            vx=this.ext.cx-vx;
        if(this.flipV)
            vy=this.ext.cy-vy;

      /*  $('<canvas id=\"test_canvas\"></canvas>').insertAfter("#myCanvas");
        var context=document.getElementById('test_canvas').getContext('2d');
        var pathLst=this.geometry.pathLst, path, cmd;
        var lastX, lastY, beginX, beginY;
        for(var i=0; i<pathLst.length; i++)
        {
            path=pathLst[i];
            context.beginPath();
            for(var j=0; j<path.ArrPathCommand.length; j++)
            {
                cmd=path.ArrPathCommand[j];
                switch(cmd.id)
                {
                    case moveTo:
                    {
                        lastX=cmd.X;
                        lastY=cmd.Y;
                        beginX=cmd.X;
                        beginY=cmd.Y;
                        break;
                    }
                    case lineTo:
                    {
                        if(HitInLine(context, vx, vy, lastX*0.01, lastY*0.01, cmd.X*0.01, cmd.Y*0.01))
                            return true;
                        lastX=cmd.X;
                        lastY=cmd.Y;
                        break;
                    }
                    case arcTo:
                    {
                        if(HitToArc(context, vx, vy,  cmd.stX*0.01, cmd.stY*0.01, cmd.wR*0.01, cmd.hR*0.01, cmd.stAng, cmd.swAng))
                            return true;
                        lastX=(cmd.stX-cmd.wR*Math.cos(cmd.stAng)+cmd.wR*Math.cos(cmd.swAng));
                        lastY=(cmd.stY-cmd.hR*Math.sin(cmd.stAng)+cmd.hR*Math.sin(cmd.swAng));
                        break;
                    }
                    case bezier3:
                    {
                        if(HitInBezier3(context, vx, vy, lastX*0.01, lastY*0.01, cmd.X0*0.01, cmd.Y0*0.01, cmd.X1*0.01, cmd.Y1*0.01))
                            return true;
                        lastX=cmd.X1;
                        lastY=cmd.Y1;
                        break;
                    }
                    case bezier4:
                    {
                        if(HitInBezier4(context, vx, vy, lastX*0.01, lastY*0.01, cmd.X0*0.01, cmd.Y0*0.01, cmd.X1*0.01, cmd.Y1*0.01, cmd.X2*0.01, cmd.Y2*0.01))
                            return true;
                        lastX=cmd.X2;
                        lastY=cmd.Y2;
                        break;
                    }
                    case close:
                    {
                        if(HitInLine(context, vx, vy, lastX*0.01, lastY*0.01, beginX*0.01, beginY*0.01))
                            return true;
                    }
                }
            }
        }
        $("#text_canvas").remove();   */
        return vx > 0 && vx < this.ext.cx && vy > 0 && vy < this.ext.cy;
    },

    HitInBox: function(x, y)//проверяет поппали ли в границу box'а
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

        if(this.flipH)
            vx=this.ext.cx-vx;
        if(this.flipV)
            vy=this.ext.cy-vy;

        var context=this.Container.DrawingDocument.CanvasHitContext;
        context.beginPath();
        return (HitInLine(context, vx, vy, 0, 0, this.ext.cx, 0) ||
            HitInLine(context, vx, vy, this.ext.cx, 0, this.ext.cx, this.ext.cy)||
            HitInLine(context, vx, vy, this.ext.cx, this.ext.cy, 0, this.ext.cy)||
            HitInLine(context, vx, vy, 0, this.ext.cy, 0, 0) ||
            HitInLine(context, vx, vy, this.ext.cx*0.5, 0, this.ext.cx*0.5, -1000/this.DrawingDocument.m_oWordControl.m_nZoomValue)&& !this.isLine);
    },

    InTextRect: function(x, y)
    {
        return false;
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
        this.rot+=a;
        while(this.rot<0)
        {
            this.rot+=Math.PI*2;
        }
        while(this.rot>=Math.PI*2)
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
            //if(!(this.ext.cx<min_size&&this.ext.cy<min_size))
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
       /* if(this.ext.cx>min_size&&this.ext.cy>min_size)
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

            if(this.flipH)
                vx=this.ext.cx-vx;

            if(this.flipV)
                vy=this.ext.cy-vy;

            var dx, dy;

            for(var i=0; i<this.geometry.ahXYLst.length; i++)
            {
                dx=vx-this.geometry.ahXYLst[i].posX;
                dy=vy-this.geometry.ahXYLst[i].posY;

                if(Math.sqrt(dx*dx+dy*dy)<3)
                {
                    return {hit:true, type:xy, num:i};
                }
            }

            for( i=0; i<this.geometry.ahPolarLst.length; i++)
            {
                dx=vx-this.geometry.ahPolarLst[i].posX;
                dy=vy-this.geometry.ahPolarLst[i].posY;

                if(Math.sqrt(dx*dx+dy*dy)<3)
                {
                    return {hit:true, type:polar, num:i};
                }
            }
        }       */
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

        if(this.flipH)
            vx=this.ext.cx-vx;

        if(this.flipV)
            vy=this.ext.cy-vy;

        var minX, maxX, minY, maxY, adj=this.geometry.ahXYLst[num];

        minX=adj.minX;
        maxX=adj.maxX;

        minY=adj.minY;
        maxY=adj.maxY;


        if(adj.gdRefX!=undefined)
        {
            if(vx<Math.max(adj.maxXr, adj.minXr) &&
                vx>Math.min(adj.maxXr, adj.minXr))
            {
                var kX=(maxX-minX)/(adj.maxXr-adj.minXr);
                vx=vx-adj.minXr;
                this.geometry.gdLst[adj.gdRefX] = adj.minX+vx*kX;
            }
            else if(vx>=Math.max(adj.maxXr, adj.minXr))
            {

                kX=(maxX-minX)/(adj.maxXr-adj.minXr);
                vx=Math.max(adj.maxXr, adj.minXr)-adj.minXr;
                this.geometry.gdLst[adj.gdRefX] = adj.minX+vx*kX;

            }
            else if(vx<=Math.min(adj.maxXr, adj.minXr))
            {
                kX=(maxX-minX)/(adj.maxXr-adj.minXr);
                vx=Math.min(adj.maxXr, adj.minXr)-adj.minXr;
                this.geometry.gdLst[adj.gdRefX] = adj.minX+vx*kX;
            }
        }

        if(adj.gdRefY!=undefined)
        {
            if(vy<Math.max(adj.maxYr, adj.minYr) &&
                vy>Math.min(adj.maxYr, adj.minYr))
            {
                var kY=(maxY-minY)/(adj.maxYr - adj.minYr);
                vy=vy-adj.minYr;
                this.geometry.gdLst[adj.gdRefY]=
                    adj.minY+vy*kY;
            }
            else if(vy>=Math.max(adj.maxYr, adj.minYr))
            {
                kY=(maxY-minY)/(adj.maxYr - adj.minYr);
                vy=Math.max(adj.maxYr, adj.minYr)-adj.minYr;
                this.geometry.gdLst[adj.gdRefY]=
                    adj.minY+vy*kY;
            }
            else if(vy<=Math.min(adj.maxYr, adj.minYr))
            {
                kY=(maxY-minY)/(adj.maxYr - adj.minYr);
                vy=Math.min(adj.maxYr, adj.minYr)-adj.minYr;
                this.geometry.gdLst[adj.gdRefY]=
                    adj.minY+vy*kY;
            }
        }

        this.Recalculate();
    },

    ChangeAdjPolar: function(num, x, y)
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

        if(this.flipH)
            vx=this.ext.cx-vx;

        if(this.flipV)
            vy=this.ext.cy-vy;

        var minAng, maxAng, minR, maxR, adj=this.geometry.ahPolarLst[num];

        minAng=adj.minAng;
        maxAng=adj.maxAng;

        minR=adj.minR;
        maxR=adj.maxR;

        tx=vx-this.ext.cx*0.5;
        ty=vy-this.ext.cy*0.5;

        var R=Math.sqrt(tx*tx+ty*ty);

        if(adj.gdRefR!=undefined)
        {
            if(R<Math.max(adj.maxRr, adj.minRr) &&
                R>Math.min(adj.maxRr, adj.minRr))
            {
                R=R-Math.max(adj.maxRr, adj.minRr);
                var kR=(maxR-minR)/(adj.maxRr - adj.minRr);
                this.geometry.gdLst[adj.gdRefR]=R*kR;
            }
            else if(R>=Math.max(adj.maxRr, adj.minRr))
            {
                this.geometry.gdLst[adj.gdRefR]=0;
            }
            else if(R<=Math.min(adj.maxRr, adj.minRr))
            {
                R=Math.min(adj.maxRr, adj.minRr)-Math.max(adj.maxRr, adj.minRr);
                kR=(maxR-minR)/(adj.maxRr - adj.minRr);
                this.geometry.gdLst[adj.gdRefR]=R*kR;
            }
        }

        if(adj.gdRefAng!=undefined)
        {
            var ang=Math.atan2(ty, tx);
            while(ang<0)
                ang+=2*Math.PI;
            ang*=cToDeg;
            if(ang<Math.max(adj.maxAng, adj.minAng) &&
                ang>Math.min(adj.maxAng, adj.minAng))
            {
                this.geometry.gdLst[adj.gdRefAng]=ang;
            }
            else if(ang>=Math.max(adj.maxAng, adj.minAng))
            {
                this.geometry.gdLst[adj.gdRefAng]= Math.max(adj.maxAng, adj.minAng);
            }
            else if(ang<=Math.min(adj.maxAng, adj.minAng))
            {
                this.geometry.gdLst[adj.gdRefAng]= Math.min(adj.maxAng, adj.minAng);
            }
        }
        this.Recalculate();
    },

    CalculateAdjRange: function(num)
    {
        var adj=this.geometry.ahXYLst[num];
        if(adj.gdRefX!=undefined)
        {
            var tmp = this.geometry.gdLst[adj.gdRefX];
            this.geometry.gdLst[adj.gdRefX]=adj.minX;
            this.geometry.Recalculate(this.ext.cx, this.ext.cy);
            var minXr=adj.posX;

            this.geometry.gdLst[adj.gdRefX]=adj.maxX;
            this.geometry.Recalculate(this.ext.cx, this.ext.cy);
            var maxXr=adj.posX;

            this.geometry.gdLst[adj.gdRefX]=tmp;
            this.geometry.Recalculate(this.ext.cx, this.ext.cy);

            adj.minXr=minXr;
            adj.maxXr=maxXr;
        }

        if(adj.gdRefY!=undefined)
        {
            tmp = this.geometry.gdLst[adj.gdRefY];
            this.geometry.gdLst[adj.gdRefY]=adj.minY;
            this.geometry.Recalculate(this.ext.cx, this.ext.cy);
            var minYr=adj.posY;

            this.geometry.gdLst[adj.gdRefY]=adj.maxY;
            this.geometry.Recalculate(this.ext.cx, this.ext.cy);
            var maxYr=adj.posY;

            this.geometry.gdLst[adj.gdRefY]=tmp;
            this.geometry.Recalculate(this.ext.cx, this.ext.cy);

            adj.minYr=minYr;
            adj.maxYr=maxYr;
        }
    },

    CalculateAdjPolarRangeR: function(num)
    {
        var adj=this.geometry.ahPolarLst[num];
        if(adj.gdRefR!=undefined)
        {
            var tmp = this.geometry.gdLst[adj.gdRefR];
            this.geometry.gdLst[adj.gdRefR]=adj.minR;
            this.geometry.Recalculate(this.ext.cx, this.ext.cy);

            var dx, dy, minR, maxR;
            dx=Math.abs(adj.posX-this.ext.cx*0.5);
            dy=Math.abs(adj.posY-this.ext.cy*0.5);

            minR=Math.sqrt(dx*dx+dy*dy);

            this.geometry.gdLst[adj.gdRefR]=adj.maxR;
            this.geometry.Recalculate(this.ext.cx, this.ext.cy);

            dx=Math.abs(adj.posX-this.ext.cx*0.5);
            dy=Math.abs(adj.posY-this.ext.cy*0.5);

            maxR=Math.sqrt(dx*dx+dy*dy);

            adj.minRr=minR;
            adj.maxRr=maxR;

            this.geometry.gdLst[adj.gdRefR]=tmp;
            this.Recalculate();
        }
    },

    Select: function(graphics, zoom)
    {
        if (graphics.m_oContext === undefined)
            return;

        if(zoom == undefined)
        {

            zoom = this.parent.Layout.Master.presentation.DrawingDocument.m_oWordControl.m_nZoomValue;
        }
         if(zoom == undefined)
        {

            zoom = 100;
        }
        var d=100/zoom;

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
        return false;
    },

    Get_ParentObject_or_DocumentPos : function()
    {
        return this.Parent.Get_ParentObject_or_DocumentPos(0);
    },

    Add_InlineObjectXY: function( DrAdd_InlineObjectXYawing, X, Y, PageNum )
    {
        return this.Parent.Add_InlineObjectXY( DrAdd_InlineObjectXYawing, X, Y, PageNum );
    },

    Undo: function(data)
    {
        data.undo_function.call(this, data);
    },

    Redo: function(data)
    {
        data.redo_function.call(this, data);
    },

    updateThemeColors : function() {},

    updateThemeFonts : function() {},

    updateCursorType : function(x, y) {
        if(this.selected )
       {
           var hitHandle =  this.HitHandle(x, y);
           if(hitHandle.hit)
           {
                if(hitHandle.num != 8)
                {
                   var direction = this.NumToCardDir(hitHandle.num);
                   switch(direction)
                   {
                       case N:
                       case S:
                       {
                           this.Container.DrawingDocument.SetCursorType("s-resize");
                           break;
                       }

                       case W:
                       case E:
                       {
                           this.Container.DrawingDocument.SetCursorType("w-resize");
                           break;
                       }

                       case SE:
                       case NW: {

                           this.Container.DrawingDocument.SetCursorType("se-resize");
                           break;
                       }
                       case SW:
                       case NE:
                       {
                           this.Container.DrawingDocument.SetCursorType("sw-resize");
                           break;
                       }
                   }
               }
                return true;
           }

           else
           {
               if(this.HitInBox(x, y)) {

                   this.Container.DrawingDocument.SetCursorType("move");
                   return true;
               }
           }

       }
       else if(this.Hit(x, y))
       {
            this.Container.DrawingDocument.SetCursorType("move");
                   return true;
       }
       return false;
    },

    Document_UpdateSelectionState : function() {},

    Add_NewParagraph : function(bRecalculate) {},

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
            for(var i = 0; i<8; ++i)
            {
                this.cursorTypes[i] = curTypes[(-i+3-Math.floor(angle/(Math.PI/4))+16)%8]
            }
        }

    },



    Document_UpdateInterfaceTextState : function()
    {},

    getImageProps: function()
    {
        var _result_image_props = {};
        _result_image_props.Width = this.ext.cx;
        _result_image_props.Height = this.ext.cy;
        _result_image_props.Position = {X: this.pH, Y: this.pV};
        _result_image_props.Paddings = {Left: this.pH, Top: this.pV, Right: this.pH + this.ext.cx, Bottom: this.pV + this.ext.cy};
        if(this.blipFill && this.blipFill.fill && this.blipFill.fill.RasterImageId)
        {
            _result_image_props.ImageUrl = this.blipFill.fill.RasterImageId;
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
                }
                else
                {
                    if(typeof _xfrm.offX === "number")
                        _xfrm.extX *= kH;
                    if(typeof _xfrm.offY === "number")
                        _xfrm.extY *= kW;
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

                }
                else
                {
                    if(typeof _xfrm.offX === "number")
                        _xfrm.extX *= kH;
                    if(typeof _xfrm.offY === "number")
                        _xfrm.extY *= kW;

                }
                this.pH = _xfrm.offX;
                this.pV = _xfrm.offY;
                this.ext = {cx: _xfrm.extX, cy: _xfrm.extY };
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
    },
    paragraphAddTextPr: function()
    {}
};

function CompareImageProperties(imgProps1, imgProps2)
{
    var _result_image_properties = {};
    if(imgProps1.Width == null || imgProps2.Width == null)
    {
        _result_image_properties.Width = null;
    }
    else
    {
        _result_image_properties.Width = (imgProps1.Width === imgProps2.Width) ? imgProps1.Width : null;
    }

    if(imgProps1.Height == null || imgProps2.Height == null)
    {
        _result_image_properties.Height = null;
    }
    else
    {
        _result_image_properties.Height = (imgProps1.Height === imgProps2.Height) ? imgProps1.Height : null;
    }

    _result_image_properties.Paddings = ComparePaddings(imgProps1.Paddings, imgProps2.Paddings);
    _result_image_properties.Position = CompareImgPosition(imgProps1.Position, imgProps2.Position);

    if(!(typeof imgProps1.ImageUrl === "string") || !(typeof imgProps2.ImageUrl === "string") || imgProps1.ImageUrl !== imgProps2.ImageUrl)
    {
        _result_image_properties.ImageUrl = null;
    }
    else
    {
        _result_image_properties = imgProps1.ImageUrl;
    }
    _result_image_properties.IsLocked = imgProps1.IsLocked === true || imgProps2.IsLocked === true;
    return _result_image_properties;
}

function ComparePaddings(paddings1, paddings2)
{
    if((paddings1 === null || !(typeof paddings1 === "object")) || (paddings2 === null || !(typeof paddings2 === "object")) )
    {
        return null;
    }

    var _result_paddings = {};
    if(!(typeof paddings1.Left === "number") && !(typeof paddings2.Left === "number") || (paddings1.Left !== paddings2.Left))
    {
        _result_paddings.Left = null;
    }
    else
    {
        _result_paddings.Left = paddings1.Left;
    }

    if(!(typeof paddings1.Top === "number") && !(typeof paddings2.Top === "number") || (paddings1.Top !== paddings2.Top))
    {
        _result_paddings.Top = null;
    }
    else
    {
        _result_paddings.Top = paddings1.Top;
    }

    if(!(typeof paddings1.Right === "number") && !(typeof paddings2.Right === "number") || (paddings1.Right !== paddings2.Right))
    {
        _result_paddings.Right = null;
    }
    else
    {
        _result_paddings.Right = paddings1.Right;
    }


    if(!(typeof paddings1.Bottom === "number") && !(typeof paddings2.Bottom === "number") || (paddings1.Bottom !== paddings2.Bottom))
    {
        _result_paddings.Bottom = null;
    }
    else
    {
        _result_paddings.Bottom = paddings1.Bottom;
    }

    return _result_paddings;
}

function CompareImgPosition(pos1, pos2)
{
    if((pos1 === null || !(typeof pos1 === "object")) || (pos2 === null || !(typeof pos2 === "object")) )
    {
        return null;
    }

    var _result_position = {};
    if(!(typeof pos1.X === "number") && !(typeof pos1.X === "number") || (pos1.X !== pos1.X))
    {
        _result_position.X = null;
    }
    else
    {
        _result_position.X = pos1.X;
    }

    if(!(typeof pos1.Y === "number") && !(typeof pos1.Y === "number") || (pos1.Y !== pos1.Y))
    {
        _result_position.Y = null;
    }
    else
    {
        _result_position.Y = pos1.Y;
    }
    return _result_position;
}
