/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 6/26/13
 * Time: 11:38 AM
 * To change this template use File | Settings | File Templates.
 */

function Slide(presentation, slideLayout, slideNum)
{
    this.kind = SLIDE_KIND;

    this.presentation = editor.WordControl.m_oLogicDocument;
    //this.Layout = slideLayout;
    //this.num = slideNum;

    this.graphicObjects = new CGraphicObjects(this);

    this.maxId = 0;
    this.cSld = new CSld();
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

    this.searchingArray = new Array();  // массив объектов для селекта
    this.selectionArray = new Array();  // массив объектов для поиска


    this.comments = [];
    this.writecomments = [];

    //this.show = true;
    //this.showMasterPhAnim = false;
    //this.showMasterSp = false;

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

    this.changeLayout = function(layout)
    {

        var _slide_shapes = this.cSld.spTree;
        var _slide_shape;
        var _new_layout_shapes = layout.cSld.spTree;
        var _layout_shape;
        var _shape_index;
        var _history_obj;
        _history_obj = {};
        _history_obj.oldLayout = this.Layout;
        _history_obj.undo_function = function(data)
        {
            this.Layout = data.oldLayout;
            for(var i = 0; i < this.elementsManipulator.ArrGlyph.length; ++i)
            {
                if(this.elementsManipulator.ArrGlyph[i].resetTextStyles)
                    this.elementsManipulator.ArrGlyph[i].resetTextStyles();
            }
            this.calculate2();
        };

        _history_obj.redo_function = function(data)
        {
        };
        History.Add(this, _history_obj);
        for(_shape_index = 0; _shape_index < _slide_shapes.length; ++_shape_index)
        {
            _slide_shape = _slide_shapes[_shape_index];
            if(_slide_shape.isEmptyPlaceholder())
            {
                _history_obj = {};
                _history_obj.shape = _slide_shape;
                _history_obj.shapeIndex = _shape_index;
                _history_obj.slideShapes = _slide_shapes;
                _history_obj.undo_function = function(data)
                {
                    data.slideShapes.splice(data.shapeIndex, 0, data.shape);
                };
                _history_obj.redo_function = function(data)
                {
                    data.slideShapes.splice(data.shapeIndex, 1);
                };
                History.Add(this, _history_obj);

                _slide_shapes.splice(_shape_index, 1);
                --_shape_index;
                continue;
            }

            var _slide_shape_xfrm = _slide_shape.spPr.xfrm;
            if(_slide_shape_xfrm && _slide_shape_xfrm.offX != null)
            {
                _history_obj = {};
                _history_obj.shape = _slide_shape;
                _history_obj.oldXfrmOffX = _slide_shape_xfrm.offX;
                _history_obj.oldXfrmOffY = _slide_shape_xfrm.offY;
                _history_obj.oldXfrmExtX = _slide_shape_xfrm.extX;
                _history_obj.oldXfrmExtY = _slide_shape_xfrm.extY;
                _history_obj.oldXfrmFlipH = _slide_shape_xfrm.flipH;
                _history_obj.oldXfrmFlipV = _slide_shape_xfrm.flipV;
                _history_obj.oldXfrmRot = _slide_shape_xfrm.rot;

                _history_obj.newXfrmOffX =_slide_shape.pH;
                _history_obj.newXfrmOffY =_slide_shape.pV;
                _history_obj.newXfrmExtX =_slide_shape.ext.cx;
                _history_obj.newXfrmExtY =_slide_shape.ext.cy;
                _history_obj.newXfrmFlipH =_slide_shape.flipH;
                _history_obj.newXfrmFlipV =_slide_shape.flipV;
                _history_obj.newXfrmRot = _slide_shape.flipV;


                _history_obj.undo_function = function(data)
                {
                    data.shape.spPr.xfrm.offX = data.oldXfrmOffX;
                    data.shape.spPr.xfrm.offY = data.oldXfrmOffY;
                    data.shape.spPr.xfrm.extX = data.oldXfrmExtX;
                    data.shape.spPr.xfrm.extY = data.oldXfrmExtY;
                    data.shape.spPr.xfrm.flipH = data.oldXfrmFlipH;
                    data.shape.spPr.xfrm.flipV = data.oldXfrmFlipV;
                    data.shape.spPr.xfrm.rot = data.oldXfrmRot;
                };
                _history_obj.redo_function = function(data)
                {
                    data.shape.spPr.xfrm.offX = data.newXfrmOffX;
                    data.shape.spPr.xfrm.offY = data.newXfrmOffY;
                    data.shape.spPr.xfrm.extX = data.newXfrmExtX;
                    data.shape.spPr.xfrm.extY = data.newXfrmExtY;
                    data.shape.spPr.xfrm.flipH = data.newXfrmFlipH;
                    data.shape.spPr.xfrm.flipV = data.newXfrmFlipV;
                    data.shape.spPr.xfrm.rot = data.newXfrmRot;
                };
                History.Add(this, _history_obj);


                _slide_shape.spPr.xfrm.offX =_slide_shape.pH;
                _slide_shape.spPr.xfrm.offY =_slide_shape.pV;
                _slide_shape.spPr.xfrm.extX =_slide_shape.ext.cx;
                _slide_shape.spPr.xfrm.extY =_slide_shape.ext.cy;
                _slide_shape.spPr.xfrm.flipH =_slide_shape.flipH;
                _slide_shape.spPr.xfrm.flipV =_slide_shape.flipV;
                _slide_shape.spPr.xfrm.rot =_slide_shape.rot;
            }
            else if(_slide_shape.isPlaceholder())
            {
                var _new_master = layout.Master;
                var _ph_idx = null, _ph_type = null;
                if(_slide_shape instanceof  CShape)
                {
                    _ph_idx = _slide_shape.nvSpPr.nvPr.ph.idx;
                    _ph_type = _slide_shape.nvSpPr.nvPr.ph.type;
                }
                if(_slide_shape instanceof  CImageShape)
                {
                    _ph_idx = _slide_shape.nvPicPr.nvPr.ph.idx;
                    _ph_type = _slide_shape.nvPicPr.nvPr.ph.type;
                }
                var _merged_xfrm = new CXfrm();

                var _master_shape = _new_master.getMatchingShape(_ph_type, _ph_idx);
                var _layout_shape = layout.getMatchingShape(_ph_type, _ph_idx);
                var _master_shape_xfrm = null;
                if(_master_shape != null && _master_shape.spPr )
                {
                    _merged_xfrm.merge(_master_shape.spPr.xfrm);
                }
                if(_layout_shape != null && _layout_shape.spPr )
                {
                    _merged_xfrm.merge(_layout_shape.spPr.xfrm);
                }
                if(_merged_xfrm.offX == null)
                {
                    _history_obj = {};
                    _history_obj.shape = _slide_shape;
                    _history_obj.oldXfrmOffX = _slide_shape_xfrm.offX;
                    _history_obj.oldXfrmOffY = _slide_shape_xfrm.offY;
                    _history_obj.oldXfrmExtX = _slide_shape_xfrm.extX;
                    _history_obj.oldXfrmExtY = _slide_shape_xfrm.extY;
                    _history_obj.oldXfrmFlipH = _slide_shape_xfrm.flipH;
                    _history_obj.oldXfrmFlipV = _slide_shape_xfrm.flipV;
                    _history_obj.oldXfrmRot = _slide_shape_xfrm.rot;

                    _history_obj.newXfrmOffX =_slide_shape.pH;
                    _history_obj.newXfrmOffY =_slide_shape.pV;
                    _history_obj.newXfrmExtX =_slide_shape.ext.cx;
                    _history_obj.newXfrmExtY =_slide_shape.ext.cy;
                    _history_obj.newXfrmFlipH =_slide_shape.flipH;
                    _history_obj.newXfrmFlipV =_slide_shape.flipV;
                    _history_obj.newXfrmRot = _slide_shape.flipV;


                    _history_obj.undo_function = function(data)
                    {
                        data.shape.spPr.xfrm.offX = data.oldXfrmOffX;
                        data.shape.spPr.xfrm.offY = data.oldXfrmOffY;
                        data.shape.spPr.xfrm.extX = data.oldXfrmExtX;
                        data.shape.spPr.xfrm.extY = data.oldXfrmExtY;
                        data.shape.spPr.xfrm.flipH = data.oldXfrmFlipH;
                        data.shape.spPr.xfrm.flipV = data.oldXfrmFlipV;
                        data.shape.spPr.xfrm.rot = data.oldXfrmRot;
                    };
                    _history_obj.redo_function = function(data)
                    {
                        data.shape.spPr.xfrm.offX = data.newXfrmOffX;
                        data.shape.spPr.xfrm.offY = data.newXfrmOffY;
                        data.shape.spPr.xfrm.extX = data.newXfrmExtX;
                        data.shape.spPr.xfrm.extY = data.newXfrmExtY;
                        data.shape.spPr.xfrm.flipH = data.newXfrmFlipH;
                        data.shape.spPr.xfrm.flipV = data.newXfrmFlipV;
                        data.shape.spPr.xfrm.rot = data.newXfrmRot;
                    };
                    History.Add(this, _history_obj);


                    _slide_shape.spPr.xfrm.offX =_slide_shape.pH;
                    _slide_shape.spPr.xfrm.offY =_slide_shape.pV;
                    _slide_shape.spPr.xfrm.extX =_slide_shape.ext.cx;
                    _slide_shape.spPr.xfrm.extY =_slide_shape.ext.cy;
                    _slide_shape.spPr.xfrm.flipH =_slide_shape.flipH;
                    _slide_shape.spPr.xfrm.flipV =_slide_shape.flipV;
                    _slide_shape.spPr.xfrm.rot =_slide_shape.rot;
                }
            }
        }


        for(_shape_index = 0; _shape_index < _new_layout_shapes.length; ++_shape_index)
        {
            _layout_shape = _new_layout_shapes[_shape_index];
            if(_layout_shape.isPlaceholder())
            {
                if(_layout_shape instanceof  CShape)
                {
                    _ph_idx = _layout_shape.nvSpPr.nvPr.ph.idx;
                    _ph_type = _layout_shape.nvSpPr.nvPr.ph.type;
                }
                if(_layout_shape instanceof  CImageShape)
                {
                    _ph_idx = _layout_shape.nvPicPr.nvPr.ph.idx;
                    _ph_type = _layout_shape.nvPicPr.nvPr.ph.type;
                }
                var _matching_slide_shape = this.getMatchingShape(_ph_type, _ph_idx);
                if(_matching_slide_shape == null && (_ph_type != phType_dt && _ph_type != phType_ftr && _ph_type != phType_hdr && _ph_type != phType_sldNum))
                {
                    var _index = _shape_index > _slide_shapes.length ? _slide_shapes.length : _shape_index;
                    var _added_shape = _layout_shape.createDuplicate2(this, this.elementsManipulator);
                    _added_shape.txBody = _layout_shape.txBody.createFullCopy(_added_shape);
                    _added_shape.txBody.content = new CDocumentContent(_added_shape, this.elementsManipulator.DrawingDocument, 0, 0, 0, 0, false, false);

                    var text = pHText[0][_added_shape.nvSpPr.nvPr.ph.type] != undefined ?  pHText[0][_added_shape.nvSpPr.nvPr.ph.type] : pHText[0][phType_body];
                    _added_shape.txBody.content2 = new CDocumentContent(_added_shape, this.elementsManipulator.DrawingDocument, 0, 0, 0, 0, false, false);
                    _added_shape.txBody.content2.Content.length = 0;
                    var par = new Paragraph(this.elementsManipulator.DrawingDocument, _added_shape.txBody.content2, 0, 0, 0, 0, 0);
                    var EndPos = 0;
                    _added_shape.spPr.Fill = new CUniFill();
                    _added_shape.spPr.ln = new CLn();
                    _added_shape.spPr.xfrm = new CXfrm();
                    var _h_is_on = History.Is_On();
                    if(_h_is_on)
                    {
                        History.TurnOff();
                    }
                    for(var key = 0 ; key <  text.length; ++key)
                    {
                        par.Internal_Content_Add( EndPos++, new ParaText(text[key]));
                    }

                    _added_shape.txBody.content2.Internal_Content_Add( 0, par);

                    if(_h_is_on)
                    {
                        History.TurnOn();
                    }
                    _history_obj = {};
                    _history_obj.layoutShape = _added_shape;
                    _history_obj.shapeIndex = _index;
                    _history_obj.slideShapes = _slide_shapes;
                    _history_obj.undo_function = function(data)
                    {
                        data.slideShapes.splice(data.shapeIndex, 1);
                    };
                    _history_obj.redo_function = function(data)
                    {
                        data.slideShapes.splice(data.shapeIndex, 0, data.layoutShape);
                    };
                    History.Add(this, _history_obj);

                    _slide_shapes.splice(_index, 0, _added_shape);
                }
            }
        }
        _history_obj = {};
        _history_obj.newLayout = layout;
        _history_obj.undo_function = function(data)
        {

        };

        _history_obj.redo_function = function(data)
        {
            this.Layout = data.newLayout;
            for(var i = 0; i < this.elementsManipulator.ArrGlyph.length; ++i)
            {
                if(this.elementsManipulator.ArrGlyph[i].resetTextStyles)
                    this.elementsManipulator.ArrGlyph[i].resetTextStyles();
            }
            this.calculate2();
        };
        History.Add(this, _history_obj);
        this.Layout = layout;
        for(var i = 0; i < this.elementsManipulator.ArrGlyph.length; ++i)
        {
            if(this.elementsManipulator.ArrGlyph[i].resetTextStyles)
                this.elementsManipulator.ArrGlyph[i].resetTextStyles();
        }
        this.calculate2();
    };

    this.prepareToChangeTheme =  function(_new_layout)
    {
        for(var i = 0, glyphs = this.elementsManipulator.ArrGlyph, n = glyphs.length; i < n; ++i)
        {
            if(glyphs[i].prepareToChangeTheme)
            {
                glyphs[i].prepareToChangeTheme(_new_layout);
            }
        }
    };

    this.prepareToChangeTheme2 =  function(_new_layout)
    {
        for(var i = 0, glyphs = this.elementsManipulator.ArrGlyph, n = glyphs.length; i < n; ++i)
        {
            if(glyphs[i].prepareToChangeTheme2)
            {
                glyphs[i].prepareToChangeTheme2();
            }
        }
    };

    this.createFullCopy = function(_slide_num)
    {
        var _history_is_on = History.Is_On();
        if(_history_is_on)
        {
            History.TurnOff();
        }
        var _copy = new Slide(this.presentation, this.Layout, _slide_num);
        _copy.Layout = this.Layout;
        _copy.Master = this.Master;
        _copy.Theme = this.Theme;
        _copy.cSld =  this.cSld.createFullCopy(_copy, _copy.elementsManipulator);
        _copy.elementsManipulator.ArrGlyph = _copy.cSld.spTree;

        if(_history_is_on)
        {
            History.TurnOn();
        }
        return _copy;
    };
    //---------------------
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
    };

    this.CreateFontMap = function(FontMap)
    {
        var _arr_glyph = this.elementsManipulator.ArrGlyph;
        for(var i =0; i < _arr_glyph.length; ++i)
        {
            if(_arr_glyph[i].CreateFontMap != undefined)
            {
                _arr_glyph[i].CreateFontMap(FontMap);
            }
        }
    };
    this.calculateColors = function()
    {
        var _shapes = this.cSld.spTree;
        var _shapes_count = _shapes.length;
        var _shape_index;
        for(_shape_index = 0; _shape_index < _shapes_count; ++_shape_index)
        {
            _shapes[_shape_index].calculateColors();
        }
    };



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
                if(_glyph instanceof CShape)
                {
                    _index = _glyph.nvSpPr.nvPr.ph.idx;
                    _type = _glyph.nvSpPr.nvPr.ph.type;
                }
                if(_glyph instanceof CImageShape)
                {
                    _index = _glyph.nvPicPr.nvPr.ph.idx;
                    _type = _glyph.nvPicPr.nvPr.ph.type;
                }
                if(_glyph instanceof  CGroupShape)
                {
                    _index = _glyph.nvGrpSpPr.nvPr.ph.idx;
                    _type = _glyph.nvGrpSpPr.nvPr.ph.type;
                }
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

    this.calculate = function()
    {
        this.compiledShapes.length = 0;
        var slideSpTree = this.cSld.spTree;
        for(var i=0; i < slideSpTree.length; ++i)
        {
            slideSpTree[i].calculate();
        }
        this.elementsManipulator.ArrGlyph = slideSpTree;
    };

    this.calculate2 = function()
    {
        var spTree = this.cSld.spTree;
        for(var i = 0, n = spTree.length; i < n; ++i)
        {
            if(spTree[i].calculate2)
            {
                spTree[i].calculate2();
            }
        }
    };


    this.changeNum = function(num)
    {
        this.num = num;
        /*var _arr_glyph = this.cSld.spTree;
        var _shape_index;
        for(_shape_index = 0; _shape_index < _arr_glyph.length; ++_shape_index)
        {
            if(_arr_glyph[_shape_index].isPlaceholder())
            {
                if(_arr_glyph[_shape_index] instanceof  CShape)
                {
                    if(_arr_glyph[_shape_index].nvSpPr.nvPr.ph.type == phType_sldNum && _arr_glyph[_shape_index].txBody.textFieldFlag)
                    {
                        _arr_glyph[_shape_index].txBody.recalculate(_arr_glyph[_shape_index]);
                    }
                }
            }
        } */
    };

    this.calculateAfterChangeLayout = function()
    {
        var historyData;
        var _history_is_on = History.Is_On();
        if(_history_is_on)
        {
            History.TurnOff();
        }
        for(var i = this.cSld.spTree.length-1; i > -1 ; --i)
        {
            if(this.cSld.spTree[i].isEmptyPlaceholder())
            {
                var deletedShape = this.cSld.spTree.splice(i, 1)[0];

                historyData = {};
                historyData.deletedShape = deletedShape;
                historyData.shapeIndex = i;
                historyData.undo_function = function(data)
                {
                    this.cSld.spTree.splice(data.shapeIndex, 0, data.deletedShape);
                };
                historyData.redo_function = function(data)
                {
                    this.cSld.spTree.splice(data.shapeIndex, 1);
                };
                //History.Add(this, historyData);
            }
        }
        for(i = this.Layout.cSld.spTree.length-1; i > -1 ; --i)
        {
            if(this.Layout.cSld.spTree[i].isPlaceholder())
            {
                var matchingShape;
                var _ph_type = this.Layout.cSld.spTree[i].nvSpPr.nvPr.ph.type;

                if(((matchingShape = this.getMatchingShape(this.Layout.cSld.spTree[i].nvSpPr.nvPr.ph.type, this.Layout.cSld.spTree[i].nvSpPr.nvPr.ph.idx)) == null)
                    && ((_ph_type != phType_dt && _ph_type != phType_ftr && _ph_type != phType_hdr && _ph_type != phType_sldNum)/* ||
                 (_ph_type == phType_dt && this.Layout.hf.dt === true) || (_ph_type == phType_ftr && this.Layout.hf.ftr === true)
                 || (_ph_type == phType_hdr && this.Layout.hf.hdr === true) || (_ph_type == phType_sldNum && this.Layout.hf.sldNum === true))*/))
                {
                    var duplicate = this.Layout.cSld.spTree[i].createDuplicate2(this, this.elementsManipulator);
                    if(this.Layout.cSld.spTree[i] instanceof CShape)
                    {
                        var _body_pr
                        if(this.Layout.cSld.spTree[i].txBody && this.Layout.cSld.spTree[i].txBody.bodyPr)
                        {
                            _body_pr = this.Layout.cSld.spTree[i].txBody.bodyPr.createDuplicate();

                        }
                        else
                        {
                            _body_pr = new CBodyPr();
                        }
                        duplicate.txBody = new CTextBody(duplicate);
                        duplicate.txBody.bodyPr = _body_pr;
                        duplicate.txBody.content = new CDocumentContent(duplicate, this.elementsManipulator.DrawingDocument, 0, 0, 0, 0, false, false);
                    }
                    duplicate.spPr.xfrm = new CXfrm();
                    duplicate.spPr.Fill = new CUniFill();
                    duplicate.spPr.ln = new CLn();
                    duplicate.calculate();
                    duplicate.setParent(this);
                    duplicate.setContainer(this.elementsManipulator);
                    this.cSld.spTree.splice(i, 0, duplicate);

                    historyData = {};
                    historyData.addedShape = duplicate;
                    historyData.shapeIndex = i;
                    historyData.undo_function = function(data)
                    {
                        this.cSld.spTree.splice(data.shapeIndex, 1);
                    };
                    historyData.redo_function = function(data)
                    {
                        this.cSld.spTree.splice(data.shapeIndex, 0, data.addedShape);
                    };
                    //History.Add(this, historyData);
                }
                else  if(matchingShape != null)
                {
                    _ph_type = this.Layout.cSld.spTree[i].nvSpPr.nvPr.ph.type;

                    if(this.Layout.cSld.spTree[i].spPr.xfrm.extX!=undefined)
                    {
                        historyData = {};
                        historyData.old_SpPrXfrm = clone(matchingShape.spPr.xfrm);
                        historyData.old_pH = matchingShape.pH;
                        historyData.old_pV = matchingShape.pV;
                        historyData.old_ext = clone(matchingShape.ext);
                        historyData.shape = matchingShape;
                        historyData.undo_function = function(data)
                        {
                            data.shape.spPr.xfrm.offX = data.old_SpPrXfrm.offX;
                            data.shape.spPr.xfrm.offY = data.old_SpPrXfrm.offY;
                            data.shape.spPr.xfrm.extX = data.old_SpPrXfrm.extX;
                            data.shape.spPr.xfrm.extY = data.old_SpPrXfrm.extY;
                            data.shape.spPr.xfrm.chOffX = data.old_SpPrXfrm.chOffX;
                            data.shape.spPr.xfrm.chOffY = data.old_SpPrXfrm.chOffY;
                            data.shape.spPr.xfrm.chExtX = data.old_SpPrXfrm.chExtX;
                            data.shape.spPr.xfrm.chExtY = data.old_SpPrXfrm.chExtY;
                        };

                        historyData.redo_function = function(data)
                        {
                            data.shape.spPr.xfrm = new CXfrm();
                        };
                        //History.Add(this, historyData);

                        matchingShape.spPr.xfrm = new CXfrm();
                    }
                    else
                    {
                        var masterMatchingShape = this.Layout.Master.getMatchingShape(this.Layout.cSld.spTree[i].nvSpPr.nvPr.ph.type, this.Layout.cSld.spTree[i].nvSpPr.nvPr.ph.idx);

                        if(masterMatchingShape != null && masterMatchingShape.spPr.xfrm.extX != undefined)
                        {
                            historyData = {};
                            historyData.old_SpPrXfrm = clone(matchingShape.spPr.xfrm);
                            historyData.old_pH = matchingShape.pH;
                            historyData.old_pV = matchingShape.pV;
                            historyData.old_ext = clone(matchingShape.ext);
                            historyData.shape = matchingShape;
                            historyData.undo_function = function(data)
                            {
                                data.shape.spPr.xfrm.offX = data.old_SpPrXfrm.offX;
                                data.shape.spPr.xfrm.offY = data.old_SpPrXfrm.offY;
                                data.shape.spPr.xfrm.extX = data.old_SpPrXfrm.extX;
                                data.shape.spPr.xfrm.extY = data.old_SpPrXfrm.extY;
                                data.shape.spPr.xfrm.chOffX = data.old_SpPrXfrm.chOffX;
                                data.shape.spPr.xfrm.chOffY = data.old_SpPrXfrm.chOffY;
                                data.shape.spPr.xfrm.chExtX = data.old_SpPrXfrm.chExtX;
                                data.shape.spPr.xfrm.chExtY = data.old_SpPrXfrm.chExtY;
                            };

                            historyData.redo_function = function(data)
                            {
                                data.shape.spPr.xfrm = new CXfrm();
                            };
                            //History.Add(this, historyData);

                            matchingShape.spPr.xfrm = new CXfrm();
                        }
                    }

                }
            }
        }


        historyData = {};
        historyData.undo_function = function(data)
        {};
        historyData.redo_function = function(data)
        {
            for(var i = 0; i < this.cSld.spTree.length; ++i)
            {
                this.cSld.spTree[i].calculate2();
            }
        };
        //History.Add(this, historyData);

        for(i = 0; i < this.cSld.spTree.length; ++i)
        {
            this.cSld.spTree[i].calculate2();
        }
        if(_history_is_on)
        {
            History.TurnOn();
        }
    };



    this.getBackground = function()
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
                _back_fill = _theme.themeElements.fmtScheme.GetFillStyle(this.cSld.Bg.bgRef.idx);
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
                        _back_fill = _theme.themeElements.fmtScheme.GetFillStyle(_layout.cSld.Bg.bgRef.idx);
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
                            _back_fill = _theme.themeElements.fmtScheme.GetFillStyle(_master.cSld.Bg.bgRef.idx);
                        }
                    }
                    else
                    {
                        _back_fill = new CUniFill();
                        _back_fill.fill = new CSolidFill();
                        _back_fill.fill.color.color = new CRGBColor();
                        _back_fill.fill.color.color.RGBA = {R:255, G:255, B:255, A:255};
                    }
                }
            }
        }

        if (_back_fill != null)
            _back_fill.calculate(_theme, this, _layout, _master, RGBA);

        return _back_fill;
    }

    /*this.recalculate = function()
    {
        var _shapes = this.cSld.spTree;
        var _shape_index;
        var _shape_count = _shapes.length;
        for(_shape_index = 0; _shape_index < _shape_count; ++_shape_index)
        {
            _shapes[_shape_index].Recalculate();
        }
    };   */

    /*this.draw = function(graphics)
    {
        var _back_fill = this.getBackground();
        DrawBackground(graphics, _back_fill, 0, 0, this.Width, this.Height);
        if(this.showMasterSp || (this.showMasterSp === undefined && (this.Layout.showMasterSp===undefined || this.Layout.showMasterSp)))
        {
            if (graphics.IsSlideBoundsCheckerType === undefined)
                this.Layout.Master.draw(graphics);
        }

        if (graphics && graphics.IsSlideBoundsCheckerType === undefined)
            this.Layout.draw(graphics);
        for(var i=0; i < this.elementsManipulator.ArrGlyph.length; ++i)
        {
            this.elementsManipulator.ArrGlyph[i].Draw(graphics);
        }
    }; */


   /* this.Undo = function(data)
    {
        data.undo_function.call(this, data);
    };


    this.Redo = function(data)
    {
        data.redo_function.call(this, data);
    };*/

    this.changeBg = function(bg)
    {
        var historyData = {};
        historyData.old_bg = this.cSld.Bg;
        historyData.new_bg = bg;

        historyData.undo_function = function(data)
        {
            this.cSld.Bg = data.old_bg;
            this.elementsManipulator.DrawingDocument.OnRecalculatePage(this.num, this);
        };

        historyData.undo_function = function(data)
        {
            this.cSld.Bg = data.new_bg;
            this.elementsManipulator.DrawingDocument.OnRecalculatePage(this.num, this);
        };

        this.cSld.Bg = bg;
        this.elementsManipulator.DrawingDocument.OnRecalculatePage(this.num, this);
    };

    this.OnMouseDown = function(e, X, Y)
    {
        this.elementsManipulator.OnMouseDown(e, X, Y, this.SlideNum);
    };

    this.OnMouseMove = function(e, X, Y)
    {
        this.elementsManipulator.OnMouseMove(e, X, Y, this.SlideNum);
    };
    this.OnMouseUp = function(e, X, Y)
    {
        this.elementsManipulator.OnMouseUp(e, X, Y, this.SlideNum);
    };


    this.commentX = 0;
    this.commentY = 0;

    this.Lock = new CLock();
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);

    if(presentation)
    {
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

    addComment: function(comment)
    {
        History.Add(this, {Type: historyitem_AddComment, objectId: comment.Get_Id(), pos:this.comments.length});
        this.comments.splice(this.comments.length, 0, comment);
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
                History.Add(this, {Type: historyitem_RemoveComment, index: i, id: id});
                this.comments.splice(i, 1);
                return;
            }
        }
    },

    setShow: function(bShow)
    {
        History.Add(this, {Type:historyitem_SetShow, oldPr: this.show, newPr: bShow});
        this.show = bShow;
    },

    setShowPhAnim: function(bShow)
    {

        History.Add(this, {Type: historyitem_SetShowPhAnim, oldPr: this.showMasterPhAnim, newPr: bShow});
        this.showMasterPhAnim = bShow;
    },

    setShowMasterSp: function(bShow)
    {
        History.Add(this, {Type: historyitem_SetShowMasterSp, oldPr: this.showMasterSp, newPr: bShow});
        this.showMasterSp = bShow;

    },

    setLayout: function(layout)
    {
        History.Add(this, {Type: historyitem_SetLayout, oldLayout: this.Layout, newLayout: layout});
        this.Layout = layout;
    },

    setSlideNum: function(num)
    {
        History.Add(this, {Type: historyitem_SetSlideNum, oldNum: this.num, newNum: num});
        this.num = num;
    },


    applyTiming: function(timing)
    {
        var oldTiming = this.timing.createDuplicate();
        this.timing.applyProps(timing);
        History.Add(this, {Type: historyitem_ChangeTiming, oldTiming: oldTiming, newTiming: this.timing.createDuplicate()});

    },

    getAllFonts: function(fonts)
    {
        for(var i = 0; i < this.cSld.spTree.length; ++i)
        {
            if(typeof  this.cSld.spTree[i].getAllFonts === "function")
                this.cSld.spTree[i].getAllFonts(fonts);
        }
    },

    getAllImages: function(images)
    {},

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

    changeBackground: function(bg)
    {
        History.Add(this, {Type: historyitem_ChangeBg, oldBg: this.cSld.Bg ? this.cSld.Bg.createFullCopy() : null, newBg: bg});
        this.cSld.Bg = bg.createFullCopy();
        this.recalcInfo.recalculateBackground = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    setLocks: function(deleteLock, backgroundLock, timingLock, transitionLock, layoutLock)
    {
        this.deleteLock = deleteLock;
        this.backgroundLock = backgroundLock;
        this.timingLock = timingLock;
        this.transitionLock = transitionLock;
        this.layoutLock = layoutLock;
        History.Add(this, {Type: historyitem_AddSlideLocks, deleteLock: deleteLock.Get_Id(), backgroundLock: backgroundLock.Get_Id(), timingLock: timingLock.Get_Id(),
            transitionLock: transitionLock.Get_Id(), layoutLock: layoutLock.Get_Id()})
    },

    isLockRemove: function()
    {
        //for(var i = 0)
    },
    recalcAll: function()
    {
        this.recalcInfo =
        {
            recalculateBackground: true,
            recalculateSpTree: true
        };
        for(var i = 0; i < this.cSld.spTree.length; ++i)
        {
            this.cSld.spTree[i].recalcAll();
        }

        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },

    recalcAllColors: function()
    {
        this.recalcInfo =
        {
            recalculateBackground: true,
            recalculateSpTree: true
        };
        for(var i = 0; i < this.cSld.spTree.length; ++i)
        {
            this.cSld.spTree[i].recalcAllColors();
        }
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },

    Get_Id: function()
    {
        return this.Id;
    },

    recalculate: function()
    {
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
                _back_fill = _theme.themeElements.fmtScheme.GetFillStyle(this.cSld.Bg.bgRef.idx);
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
                        _back_fill = _theme.themeElements.fmtScheme.GetFillStyle(_layout.cSld.Bg.bgRef.idx);
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
                            _back_fill = _theme.themeElements.fmtScheme.GetFillStyle(_master.cSld.Bg.bgRef.idx);
                        }
                    }
                    else
                    {
                        _back_fill = new CUniFill();
                        _back_fill.fill = new CSolidFill();
                        _back_fill.fill.color.color = new CRGBColor();
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
        for(var i=0; i < this.comments.length; ++i)
        {
            this.comments[i].draw(graphics);
        }
    },

    drawSelect: function()
    {
        this.graphicObjects.drawSelect(this.presentation.DrawingDocument);
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

    addSp: function(item)
    {
        this.cSld.spTree.push(item);
    },

    removeSelectedObjects: function()
    {
        var spTree = this.cSld.spTree;
        for(var i = spTree.length - 1; i > -1; --i)
        {
            if(spTree[i].selected)
            {
                History.Add(this, {Type: historyitem_RemoveFromSpTree, index: i, id: spTree[i].Get_Id()});
                var obj = spTree.splice(i, 1)[0];
                if(obj.isPlaceholder() && !(obj.isEmptyPlaceholder && obj.isEmptyPlaceholder()))
                {
                    var m_s = this.Layout.getMatchingShape(obj.getPlaceholderType(), obj.getPlaceholderIndex());
                    if(m_s)
                    {
                        var shape = new CShape(this);
                        m_s.copy2(shape);
                        this.addToSpTreeToPos(i, shape);
                    }
                }

            }
        }
        this.graphicObjects.resetSelectionState();
    },


    shapeAdd: function(pos, item)
    {
        History.Add(this, {Type: historyitem_ShapeAdd, pos: pos, item: item});
        this.cSld.spTree.splice(pos, 0, item);
    },

    alignLeft : function()
    {
        var selected_objects = this.graphicObjects.selectedObjects;
        for(var i = 0; i < selected_objects.length; ++i)
        {
            selected_objects[i].setXfrm(0, selected_objects[i].y, null, null, null, null, null);
        }
    },

    alignRight : function()
    {
        var selected_objects = this.graphicObjects.selectedObjects;

        for(var i = 0; i < selected_objects.length; ++i)
        {
            selected_objects[i].setXfrm(this.Width - selected_objects[i].extX, selected_objects[i].y, null, null, null, null, null);
        }
    },


    alignTop : function()
    {
        for(var i = 0; i < this.graphicObjects.selectedObjects.length; ++i)
        {
            this.graphicObjects.selectedObjects[i].setXfrm(this.graphicObjects.selectedObjects[i].x, 0, null, null, null, null, null);
        }
    },


    alignBottom : function()
    {
        for(var i = 0; i < this.graphicObjects.selectedObjects.length; ++i)
        {
            this.graphicObjects.selectedObjects[i].setXfrm(this.graphicObjects.selectedObjects[i].x, this.Height - this.graphicObjects.selectedObjects[i].extY, null, null, null, null, null);
        }
    },


    alignCenter : function()
    {
        for(var i = 0; i < this.graphicObjects.selectedObjects.length; ++i)
        {
            this.graphicObjects.selectedObjects[i].setXfrm((this.Width - this.graphicObjects.selectedObjects[i].extX)*0.5, this.graphicObjects.selectedObjects[i].y, null, null, null, null, null);
        }
    },

    alignMiddle : function()
    {
        for(var i = 0; i < this.graphicObjects.selectedObjects.length; ++i)
        {
            this.graphicObjects.selectedObjects[i].setXfrm(this.graphicObjects.selectedObjects[i].x, (this.Height - this.graphicObjects.selectedObjects[i].extY)*0.5, null, null, null, null, null);
        }
    },

    distributeHor : function()
    {
        for(var i = 0; i < this.graphicObjects.selectedObjects.length; ++i)
        {
            this.graphicObjects.selectedObjects[i].setXfrm((this.Width - this.graphicObjects.selectedObjects[i].extX)*0.5, this.graphicObjects.selectedObjects[i].y, null, null, null, null, null);
        }
    },
    distributeVer : function()
    {
        for(var i = 0; i < this.graphicObjects.selectedObjects.length; ++i)
        {
            this.graphicObjects.selectedObjects[i].setXfrm( this.graphicObjects.selectedObjects[i].x, (this.Height - this.graphicObjects.selectedObjects[i].extY)*0.5, null, null, null, null, null);
        }
    },

    bringToFront : function()
    {
        var state = this.graphicObjects.State;
        var sp_tree = this.cSld.spTree;
        switch(state.id)
        {
            case STATES_ID_NULL:
            {
                var selected = [];
                for(var i = 0; i < sp_tree.length; ++i)
                {
                    if(sp_tree[i].selected)
                    {
                        selected.push(sp_tree[i]);
                    }
                }
                this.removeSelectedObjects();
                for(i = 0; i < selected.length; ++i)
                {
                    this.addToSpTreeToPos(sp_tree.length, selected[i]);
                }
                break;
            }
            case STATES_ID_GROUP:
            {
                break;
            }
        }
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
        var state = this.graphicObjects.State;
        var sp_tree = this.cSld.spTree;
        switch(state.id)
        {
            case STATES_ID_NULL:
            {
                var  j = 0;
                for(var i = 0; i < this.cSld.spTree.length; ++i)
                {
                    if(this.cSld.spTree[i].selected)
                    {
                        var object = this.cSld.spTree[i];
                        this.removeFromSpTreeById(this.cSld.spTree[i].Get_Id());
                        this.addToSpTreeToPos(j, object);
                        ++j;
                    }
                }
                break;
            }
            case STATES_ID_GROUP:
            {
                break;
            }
        }
    },


    bringBackward : function()
    {

    },

    removeFromSpTreeById: function(id)
    {
        var sp_tree = this.cSld.spTree;
        for(var i = 0; i < sp_tree.length; ++i)
        {
            if(sp_tree[i].Get_Id() === id)
            {
                History.Add(this, {Type: historyitem_RemoveFromSpTree, index: i, id: sp_tree[i].Get_Id()});
                sp_tree.splice(i, 1);
                return;
            }
        }
    },

    addToSpTreeToPos: function(pos, obj)
    {
        History.Add(this, {Type: historyitem_AddToSlideSpTree, objectId: obj.Get_Id(), pos:pos});
        this.cSld.spTree.splice(pos, 0, obj);
        editor.WordControl.m_oLogicDocument.recalcMap[obj.Id] = obj;

    },

    isLockedObject: function()
    {
        var sp_tree = this.cSld.spTree;
        for(var i = 0; i < sp_tree.length; ++i)
        {
            if(sp_tree[i].Lock.Type !== locktype_Mine && sp_tree[i].Lock.Type !== locktype_None)
                return true;
        }
        return false;
    },

    Refresh_RecalcData: function()
    {},

    setCSldName: function(name)
    {
        History.Add(this, {Type: historyitem_SetCSldName,oldName: this.cSld.name, newName: name});
        this.cSld.name = name;
    },

    setClMapOverride: function(clrMap)
    {
        History.Add(this, {Type: historyitem_SetClrMapOverride, oldClrMap: this.clrMap, newClrMap: clrMap});
        this.clrMap = clrMap;
    },

    getBase64Img: function()
    {
        return ShapeToImageConverter(this, 0).ImageUrl;
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
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
        w.WriteLong(historyitem_type_Slide);
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
    },

    Load_Comments : function(authors)
    {
        var _comments_count = this.writecomments.length;
        var _comments_id = [];
        var _comments_data = [];
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

                if ("" != commentData.m_sUserName)
                {
                    _comments_id.push(_wc.WriteCommentId);
                    _comments_data.push(commentData);

                    var comment = new CComment(undefined, null);
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

                var _parent = null;
                for (var j = 0; j < _comments_data.length; j++)
                {
                    if ((("" + _wc.WriteParentAuthorId) == _comments_data[j].m_sUserId) && (_wc.WriteParentCommentId == _comments_id[j]))
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
    this.Lock = new CLock();
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);


    if(typeof  objectId === "string")
    {
        this.setObjectId(objectId);
    }

}

PropLocker.prototype = {

    setObjectId: function(id)
    {
        History.Add(this, {Type: historyitem_PropLockerSetId, oldId: this.objectId, newId: id});
        this.objectId = id;
    },
    Get_Id: function()
    {
        return this.Id;
    },
    Write_ToBinary2: function(w)
    {
        w.WriteLong(historyitem_type_PropLocker);
        w.WriteString2(this.Id);
    },

    Read_FromBinary2: function(r)
    {
        this.Id = r.GetString2();
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_PropLockerSetId:
            {
                this.objectId = data.oldId;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_PropLockerSetId:
            {
                this.objectId = data.newId;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch(data.Type)
        {
            case historyitem_PropLockerSetId:
            {
                w.WriteBool(typeof data.newId === "string");
                if(typeof data.newId === "string")
                {
                    w.WriteString2(data.newId);
                }
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_PropLockerSetId:
            {
                if(r.GetBool())
                {
                    this.objectId = r.GetString2();
                }
                else
                {
                    this.objectId = null;
                }
                break;
            }
        }
    },


    Refresh_RecalcData: function()
    {}

};
