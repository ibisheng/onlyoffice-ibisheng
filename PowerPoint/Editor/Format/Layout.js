/**
 * Created with JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 6/26/13
 * Time: 11:48 AM
 * To change this template use File | Settings | File Templates.
 */
function SlideLayout(slideMaster)
{

    this.kind = LAYOUT_KIND;
    this.cSld = new CSld();
    this.clrMap = null; // override ClrMap

    this.hf = new HF();

    this.matchingName = "";
    this.preserve = false;
    this.showMasterPhAnim = false;
    //this.showMasterSp = false;
    this.type = null;

    this.userDrawn = true;

    this.ImageBase64 = "";

    // pointers
    /*this.Master = slideMaster;
    this.Theme = null;
    this.TableStyles = null;
    this.Vml = null;    */

    this.Width = 254;
    this.Height = 190.5;

    this.Master = null;

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
    this.Calculate = function()
    {
        // нужно пробежаться по всем шейпам:
        // учесть тему во всех заливках
        // учесть тему во всех текстовых настройках,
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

    this.draw = function(graphics)
    {
        for(var i=0; i < this.cSld.spTree.length; ++i)
        {
            if(!this.cSld.spTree[i].isPlaceholder())
                this.cSld.spTree[i].draw(graphics);
        }
    };

    //-----------------------------------------------


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
               // if(_glyph instanceof CShape)
                {
                    _index = _glyph.nvSpPr.nvPr.ph.idx;
                    _type = _glyph.nvSpPr.nvPr.ph.type;
                }
                /*if(_glyph instanceof CImage2)
                {
                    _index = _glyph.nvPicPr.nvPr.ph.idx;
                    _type = _glyph.nvPicPr.nvPr.ph.type;
                }*/
                /*if(_glyph instanceof  GroupShape)
                {
                    _index = _glyph.nvGrpSpPr.nvPr.ph.idx;
                    _type = _glyph.nvGrpSpPr.nvPr.ph.type;
                }         */

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

                if(this.type === nSldLtTTitle && (_input_reduced_type === phType_body || _input_reduced_type === phType_subTitle) && (_final_type === phType_body || _final_type === phType_subTitle) )
                {
                    return _glyph;
                }
            }
        }

        return null;
    };


    this.calculateType = function()
    {
        if(this.type !== null)
        {
            this.calculatedType = this.type;
            return;
        }
        var _ph_types_array = [];
        var _matchedLayoutTypes = [];
        for(var _ph_type_index = 0; _ph_type_index < 16; ++_ph_type_index)
        {
            _ph_types_array[_ph_type_index] = 0;
        }
        for(var _layout_type_index = 0; _layout_type_index < 36; ++_layout_type_index)
        {
            _matchedLayoutTypes[_layout_type_index] = false;
        }
        var _shapes = this.cSld.spTree;
        var _shape_index;
        var _shape;
        for(_shape_index = 0; _shape_index < _shapes.length; ++_shape_index)
        {
            _shape = _shapes[_shape_index];
            if(_shape.isPlaceholder())
            {
                var _cur_type = _shape.getPhType();
                if(!(typeof(_cur_type) == "number"))
                {
                    _cur_type = phType_body;
                }
                if(typeof _ph_types_array[_cur_type] == "number")
                {
                    ++_ph_types_array[_cur_type];
                }
            }
        }

        var _weight = Math.pow(_ph_multiplier, _weight_body)*_ph_types_array[phType_body] + Math.pow(_ph_multiplier, _weight_chart)*_ph_types_array[phType_chart] +
            Math.pow(_ph_multiplier, _weight_clipArt)*_ph_types_array[phType_clipArt] + Math.pow(_ph_multiplier, _weight_ctrTitle)*_ph_types_array[phType_ctrTitle] +
            Math.pow(_ph_multiplier, _weight_dgm)*_ph_types_array[phType_dgm] + Math.pow(_ph_multiplier, _weight_media)*_ph_types_array[phType_media] +
            Math.pow(_ph_multiplier, _weight_obj)*_ph_types_array[phType_obj] + Math.pow(_ph_multiplier, _weight_pic)*_ph_types_array[phType_pic] +
            Math.pow(_ph_multiplier, _weight_subTitle)*_ph_types_array[phType_subTitle] + Math.pow(_ph_multiplier, _weight_tbl)*_ph_types_array[phType_tbl] +
            Math.pow(_ph_multiplier, _weight_title)*_ph_types_array[phType_title];

        for(var _index = 0; _index < 18; ++_index)
        {
            if(_weight >= _arr_lt_types_weight[_index] && _weight <= _arr_lt_types_weight[_index+1])
            {
                if(Math.abs(_arr_lt_types_weight[_index]-_weight) <= Math.abs(_arr_lt_types_weight[_index + 1]-_weight))
                {
                    this.calculatedType = _global_layout_summs_array["_" + _arr_lt_types_weight[_index]];
                    return;
                }
                else
                {
                    this.calculatedType = _global_layout_summs_array["_" + _arr_lt_types_weight[_index+1]];
                    return;
                }
            }
        }
        this.calculatedType = _global_layout_summs_array["_" + _arr_lt_types_weight[18]];
    };

    this.calculateMatchedTypes = function()
    {
        this.matchedTypes = [];
        for(var i = 0; i < 36; ++i)
        {
            this.matchedTypes[i] = false;
        }
        if(this.calculatedType != null)
        {
            switch (this.calculatedType)
            {
                case nSldLtTBlank :
                {
                    this.matchedTypes[nSldLtTBlank] = true;
                    break;
                }
                case nSldLtTChart :
                {
                    this.matchedTypes[nSldLtTChart] = true;
                    break;
                }
                case nSldLtTChartAndTx:
                case nSldLtTTxAndChart:
                case nSldLtTVertTitleAndTxOverChart:
                {
                    this.matchedTypes[nSldLtTChartAndTx] = true;
                    this.matchedTypes[nSldLtTTxAndChart] = true;
                    this.matchedTypes[nSldLtTVertTitleAndTxOverChart] = true;
                    break;
                }
                case nSldLtTClipArtAndTx:
                case nSldLtTTxAndClipArt:
                case nSldLtTClipArtAndVertTx:
                {
                    this.matchedTypes[nSldLtTClipArtAndTx] = true;
                    this.matchedTypes[nSldLtTTxAndClipArt] = true;
                    break;
                }
                case nSldLtTDgm :
                {
                    this.matchedTypes[nSldLtTDgm] = true;
                    break;
                }
                case nSldLtTFourObj :
                {
                    this.matchedTypes[nSldLtTFourObj] = true;
                    break;
                }
                case nSldLtTMediaAndTx:
                case nSldLtTTxAndMedia:
                {
                    this.matchedTypes[nSldLtTMediaAndTx] = true;
                    this.matchedTypes[nSldLtTTxAndMedia] = true;
                    break;
                }
                case nSldLtTObj :
                {
                    this.matchedTypes[nSldLtTObj] = true;
                    break;
                }
                case nSldLtTObjAndTwoObj:
                case nSldLtTTwoObjAndObj:
                {
                    this.matchedTypes[nSldLtTObjAndTwoObj] = true;
                    this.matchedTypes[nSldLtTTwoObjAndObj] = true;
                    break;
                }
                case nSldLtTObjAndTx:
                case nSldLtTTxAndObj:
                case nSldLtTTxOverObj:
                case nSldLtTObjOverTx:
                case nSldLtTObjTx:
                {
                    this.matchedTypes[nSldLtTObjAndTx] = true;
                    this.matchedTypes[nSldLtTTxAndObj] = true;
                    this.matchedTypes[nSldLtTTxOverObj] = true;
                    break;
                }
                case nSldLtTObjOnly:
                {
                    this.matchedTypes[nSldLtTObjOnly] = true;
                    break;
                }

                case nSldLtTPicTx :
                {
                    this.matchedTypes[nSldLtTPicTx] = true;
                    break;
                }

                case nSldLtTSecHead:
                case nSldLtTTitle:
                {
                    this.matchedTypes[nSldLtTSecHead] = true;
                    this.matchedTypes[nSldLtTTitle] = true;
                    break;
                }
                case nSldLtTTbl:
                {
                    this.matchedTypes[nSldLtTTbl] = true;
                    break;
                }
                case nSldLtTTitleOnly:
                {
                    this.matchedTypes[nSldLtTTitleOnly] = true;
                    break;
                }
                case nSldLtTTwoColTx:
                {
                    this.matchedTypes[nSldLtTTwoColTx] = true;
                    break;
                }
                case nSldLtTTwoObj :
                {
                    this.matchedTypes[nSldLtTTwoObj] = true;
                    break;
                }

                case nSldLtTTwoObjAndTx :
                case nSldLtTTwoObjOverTx:
                case nSldLtTTxAndTwoObj:
                {
                    this.matchedTypes[nSldLtTTwoObjAndTx] = true;
                    this.matchedTypes[nSldLtTTwoObjOverTx] = true;
                    this.matchedTypes[nSldLtTTxAndTwoObj] = true;
                    break;
                }
                case nSldLtTTwoTxTwoObj :
                {
                    this.matchedTypes[nSldLtTTwoTxTwoObj] = true;
                    break;
                }
                case nSldLtTTx :
                case nSldLtTVertTx:
                case nSldLtTVertTitleAndTx:
                {
                    this.matchedTypes[nSldLtTTx] = true;
                    this.matchedTypes[nSldLtTVertTx] = true;
                    this.matchedTypes[nSldLtTVertTitleAndTx] = true;
                    break;
                }




            }
        }
        else
        {

        }
    };

    this.recalculate = function()
    {

        if(!this.calculated)
            return;
        var _shapes = this.cSld.spTree;
        var _shape_index;
        var _shape_count = _shapes.length;
        for(_shape_index = 0; _shape_index < _shape_count; ++_shape_index)
        {
            if(!_shapes[_shape_index].isPlaceholder())
                _shapes[_shape_index].Recalculate();
        }
    };
}
