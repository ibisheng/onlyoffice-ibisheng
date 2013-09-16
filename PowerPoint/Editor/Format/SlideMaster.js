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

    this.txStyles = new CTextStyles();
    this.preserve = false;

    this.ImageBase64 = "";
    this.ThemeIndex = 0;

    // pointers
    this.Theme = null;
    this.TableStyles = null;
    this.Vml = null;

    this.Width = 254;
    this.Height = 190.5;

    this.DrawingDocument = presentation.DrawingDocument;

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
    this.presentation = presentation;
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
        var _shapes = this.cSld.spTree;
        var _shape_index;
        var _shape_count = _shapes.length;
        for(_shape_index = 0; _shape_index < _shape_count; ++_shape_index)
        {
            if(!_shapes[_shape_index].isPlaceholder())
                _shapes[_shape_index].recalculate();
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
    Get_Id: function()
    {
        return this.Id;
    },

    Write_ToBinary2: function(w)
    {},

    Read_FromBinary2: function(r)
    {},

    Save_Changes: function()
    {},

    Load_Changes: function()
    {}
};
