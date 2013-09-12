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

    this.presentation = presentation;
    this.Layout = slideLayout;
    this.num = slideNum;

    this.graphicObjects = new CGraphicObjects(this);

    this.maxId = 0;
    this.cSld = new CSld();
    this.clrMap = null; // override ClrMap

    this.show = true;
    this.showMasterPhAnim = false;
    this.showMasterSp = null;

    this.backgroundFill = null;

    this.recalcInfo =
    {
        recalculateBackground: true,
        recalculateSpTree: true
    };
    this.Width = 254;
    this.Height = 190.5;

    this.searchingArray = new Array();  // массив объектов для селекта
    this.selectionArray = new Array();  // массив объектов для поиска

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
        /* if(!(layout instanceof SlideLayout))
         {
         return;
         }
         var historyData;
         for(var i=0; i<this.cSld.spTree.length; ++i)
         {
         if(this.cSld.spTree[i].isPlaceholder())
         {
         historyData = {};
         historyData.shape  = this.cSld.spTree[i];
         historyData.old_SpPrXfrm = clone(this.cSld.spTree[i].spPr.xfrm);
         historyData.old_pH = this.cSld.spTree[i].pH;
         historyData.old_pV = this.cSld.spTree[i].pV;
         historyData.old_ext = clone(this.cSld.spTree[i].ext);
         historyData.old_rot = this.cSld.spTree[i].rot;
         historyData.undo_function = function(data)
         {
         data.shape.spPr.xfrm.extX = data.old_SpPrXfrm.extX;
         data.shape.spPr.xfrm.extY = data.old_SpPrXfrm.extY;
         data.shape.spPr.xfrm.offX = data.old_SpPrXfrm.offX;
         data.shape.spPr.xfrm.offY = data.old_SpPrXfrm.offY;

         data.shape.spPr.xfrm.chExtX = data.old_SpPrXfrm.chExtX;
         data.shape.spPr.xfrm.chExtY = data.old_SpPrXfrm.chExtY;
         data.shape.spPr.xfrm.chOffX = data.old_SpPrXfrm.chOffX;
         data.shape.spPr.xfrm.chOffY = data.old_SpPrXfrm.chOffY;

         data.shape.pH = data.old_pH;
         data.shape.pV = data.old_pV;

         data.shape.ext = clone(data.old_ext);
         data.shape.rot = data.old_rot;
         data.shape.Recalculate();
         };
         historyData.redo_function = function(data)
         {

         };
         History.Add(this, historyData);
         }

         }

         historyData = { old_layout : this.Layout, new_layout : layout};
         historyData.undo_function = function(data)
         {
         this.Layout = data.old_layout;
         this.calculate2();

         };
         historyData.redo_function = function(data)
         {
         this.Layout = data.new_layout;
         };
         History.Add(this, historyData);

         this.prepareToChangeTheme(layout);
         this.Layout = layout;
         this.calculateAfterChangeLayout();               */

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
                if(_slide_shape instanceof  CImage2)
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
                if(_layout_shape instanceof  CImage2)
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


    this.Save_Changes = function()
    {};

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
                if(_glyph instanceof CImage2)
                {
                    _index = _glyph.nvPicPr.nvPr.ph.idx;
                    _type = _glyph.nvPicPr.nvPr.ph.type;
                }
                if(_glyph instanceof  GroupShape)
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
                    if(_glyph instanceof CImage2)
                    {
                        _type = _glyph.nvPicPr.nvPr.ph.type;
                    }
                    if(_glyph instanceof  GroupShape)
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


    this.Lock = new CLock();
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);

    if(presentation)
    {
        this.setLocks(new PropLocker(), new PropLocker(), new PropLocker(), new PropLocker(), new PropLocker());
    }
}

Slide.prototype =
{

    changeBackground: function(bg)
    {
        this.cSld.Bg = bg.createFullCopy();
        this.recalculateBackground();
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
        if(this.showMasterSp === true || (!(this.showMasterSp === false) && (this.Layout.showMasterSp===undefined || this.Layout.showMasterSp)))
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
                spTree.splice(i, 1);
            }
        }
        this.graphicObjects.resetSelectionState();
    },




    alignLeft : function()
    {
        for(var i = 0; i < this.selectedObjects.length; ++i)
        {
            this.selectedObjects[i].setXfrm(0, this.selectedObjects[i].y, null, null, null, null, null);
        }
    },

    alignRight : function()
    {
        for(var i = 0; i < this.selectedObjects.length; ++i)
        {
            this.selectedObjects[i].setXfrm(this.Width - this.selectedObjects[i].extX, this.selectedObjects[i].y, null, null, null, null, null);
        }
    },


    alignTop : function()
    {
        for(var i = 0; i < this.selectedObjects.length; ++i)
        {
            this.selectedObjects[i].setXfrm(this.selectedObjects[i].x, 0, null, null, null, null, null);
        }
    },


    alignBottom : function()
    {
        for(var i = 0; i < this.selectedObjects.length; ++i)
        {
            this.selectedObjects[i].setXfrm(this.selectedObjects[i].x, this.Height - this.selectedObjects[i].extY, null, null, null, null, null);
        }
    },


    alignCenter : function()
    {
        for(var i = 0; i < this.selectedObjects.length; ++i)
        {
            this.selectedObjects[i].setXfrm((this.Width - this.selectedObjects[i].extX)*0.5, this.selectedObjects[i].y, null, null, null, null, null);
        }
    },

    alignMiddle : function()
    {
        for(var i = 0; i < this.selectedObjects.length; ++i)
        {
            this.selectedObjects[i].setXfrm( this.selectedObjects[i].x, (this.Height - this.selectedObjects[i].extY)*0.5, null, null, null, null, null);
        }
    },

    distributeHor : function()
    {
        for(var i = 0; i < this.selectedObjects.length; ++i)
        {
            this.selectedObjects[i].setXfrm((this.Width - this.selectedObjects[i].extX)*0.5, this.selectedObjects[i].y, null, null, null, null, null);
        }
    },
    distributeVer : function()
    {
        for(var i = 0; i < this.selectedObjects.length; ++i)
        {
            this.selectedObjects[i].setXfrm( this.selectedObjects[i].x, (this.Height - this.selectedObjects[i].extY)*0.5, null, null, null, null, null);
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
                    this.addSp(selected[i]);
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

    Undo: function(data)
    {
        switch(data.Type)
        {
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
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
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
        }
    },

    Write_ToBinary2: function(w)
    {},

    Read_FromBinary2: function(r)
    {},

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch(data.Type)
        {
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
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_RemoveFromSpTree:
            {
                this.cSld.spTree.splice(r.GetLong(), 1);
                break;
            }
            case historyitem_AddToSlideSpTree:
            {
                var pos = r.GetLong();
                var id = r.GetString2();
                this.cSld.spTree.splice(pos, 0, id);
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
        }
    }
};

function PropLocker(objectId)
{
    this.Lock = new CLock();
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);

    this.objectId = objectId;

}

PropLocker.prototype = {
    Get_Id: function()
    {
        return this.Id;
    }
}
