function NullShapeState()
{
    this.id = 0;
    this.OnMouseDown = function(AutoShapes, e, X, Y)
    {
        AutoShapes.stX=X;
        AutoShapes.stY=Y;

        var glyphs = AutoShapes.ArrGlyph;
        var trackObjects = AutoShapes.ArrTrackObj;

        //if( e.ClickCount == 1 )
        {
            if( AutoShapes.NumSelected > 0 ) {

                if(AutoShapes.NumSelected == 1) {

                    for(var i = 0, n = glyphs.length; i < n; ++i) {

                        if(glyphs[i].selected)
                        {
                            var hit = glyphs[i].HitAdj(X, Y);
                            if( hit.hit )
                            {
                                AutoShapes.obj = glyphs[i];
                                trackObjects.length = 0;
                                var _track_shape = glyphs[i].createDuplicateForTrack(AutoShapes);
                                _track_shape.Recalculate();
                                var trackObject =
                                {
                                    obj: _track_shape,
                                    hit: hit,
                                    num: i
                                };
                                trackObjects.push(trackObject);
                                AutoShapes.preTrackArr = trackObjects;
                                AutoShapes.ArrTrackObj = [];
                                AutoShapes.NumEditShape=i;
                                AutoShapes.DrawingDocument.SetCursorType("crosshair");
                                AutoShapes.ChangeState(new PreChangeAdjState());
                                AutoShapes.updateSelectionMap();
                                AutoShapes.Document.CurPos.Type = docpostype_Content;
                                AutoShapes.Document.Document_UpdateInterfaceState();
                                return;
                            }
                            else {

                                break;
                            }
                        }
                    }

                }


                hit = {hit: false};
                for( i = glyphs.length - 1; i>-1; --i ) {

                    if( glyphs[i].selected ){

                        hit=glyphs[i].HitHandle(X, Y);
                        if(hit.hit) {

                            break;
                        }
                    }
                }
                if( i>-1 ) {

                    if( hit.num != 8 ) {

                        var cardDirection = glyphs[i].NumToCardDir(hit.num);
                        AutoShapes.NumHResize = hit.num;
                        AutoShapes.obj = glyphs[i];

                        trackObjects.length = 0;
                        for( j=0; j < glyphs.length; ++j ) {

                            if( glyphs[j].selected ) {
                                var _track_shape = glyphs[j].createDuplicateForTrack(AutoShapes);
                                _track_shape.Recalculate();
                                trackObject = {

                                    obj: _track_shape,
                                    num_h: glyphs[j].CardDirToNum(cardDirection),
                                    num: j
                                };
                                trackObjects.push(trackObject);

                                if( i == j ){

                                    AutoShapes.NumEditShape = trackObjects.length-1;
                                }
                            }
                        }

                        AutoShapes.preTrackArr = trackObjects;
                        AutoShapes.ArrTrackObj = [];
                        AutoShapes.ChangeState(new PreResizeState());
                        AutoShapes.DrawingDocument.SetCursorType("crosshair");
                        AutoShapes.updateSelectionMap();
                        AutoShapes.Document.CurPos.Type = docpostype_Content;
                        AutoShapes.Document.Document_UpdateInterfaceState();
                        return;
                    }
                    else {

                        AutoShapes.obj = glyphs[i];

                        trackObjects.length = 0;
                        for(var j = 0; j < glyphs.length; ++j) {

                            if( glyphs[j].selected ) {

                                var _track_shape = glyphs[j].createDuplicateForTrack(AutoShapes);
                                _track_shape.Recalculate();
                                trackObject = {

                                    obj: (_track_shape),
                                    num: j
                                };
                                trackObjects.push(trackObject);
                            }
                        }

                        AutoShapes.preTrackArr = trackObjects;
                        AutoShapes.ArrTrackObj = [];
                        AutoShapes.ChangeState(new PreRotateState());
                        AutoShapes.DrawingDocument.SetCursorType("crosshair");
                        AutoShapes.NumEditShape = i;
                        AutoShapes.updateSelectionMap();
                        AutoShapes.Document.CurPos.Type = docpostype_Content;
                        AutoShapes.Document.Document_UpdateInterfaceState();
                        return;
                    }
                }
            }

            for(i = glyphs.length-1; i > -1; --i) {

                var glyph = glyphs[i];
                if(glyph.Hit(X, Y)
                    ||(/*glyph.text_flag&& TODO:*/ glyph.InTextRect(X, Y))
                    ||(glyph.selected && glyph.HitInBox(X, Y))) {

                    break;
                }
            }

            AutoShapes.selectedCount();
            if(i>-1)
            {
                if((!e.CtrlKey || (AutoShapes.Document.CurPos.Type == docpostype_FlowObjects && AutoShapes.obj == glyph) || glyph.hitToHyperlink(X, Y))
                    && glyph.text_flag
                    && glyph.InTextRect(X, Y)
                    && !glyph.HitInPath(X, Y)
                    && !( glyph.selected && glyph.HitInBox(X, Y)))
                {
                    AutoShapes.obj = glyph;
                    AutoShapes.NumEditShape = i;
                    glyph.addTextFlag = true;
                    //AutoShapes.Document.Document_UpdateInterfaceState();
                    AutoShapes.ChangeState(new AddTextState());

                    if(glyph.txBody && glyph.txBody.compiledBodyPr && glyph.txBody.compiledBodyPr.anchor != undefined)
                    {
                        var _vertical_align = glyph.txBody.compiledBodyPr.anchor;
                        editor.sync_VerticalTextAlign(_vertical_align);
                    }
                    AutoShapes.Document.CurPos.Type=docpostype_FlowObjects;

                    for(var p=0; p < glyphs.length; ++p)
                    {
                        glyphs[p].selected=false;
                    }

                    glyph.selected = true;
                    AutoShapes.NumSelected = 1;
                    if(glyph.isEmptyPlaceholder())
                    {
                        AutoShapes.DrawingDocument.OnRecalculatePage(AutoShapes.SlideNum, AutoShapes.Document.Slides[ AutoShapes.SlideNum ]);
                    }
                   // AutoShapes.Document.DrawingDocument.m_oWordControl.OnUpdateOverlay(true);
                    AutoShapes.updateSelectionMap();


                    return;
                }

                var preMoveObj = null;
                if(e.CtrlKey || e.ShiftKey) {

                    if(!glyph.selected) {

                        glyph.selected = true;
                        ++AutoShapes.NumSelected;
                        AutoShapes.SelectGroup = false;
                    }
                   else {

                        AutoShapes.SelectGroup = glyph.IsGroup();
                        preMoveObj = glyph;
                    }
                }
                else {

                    if(!glyph.selected) {

                        for( j=0; j < glyphs.length; ++j) {

                            glyphs[j].selected = false;
                        }

                        glyph.selected = true;
                        AutoShapes.NumSelected = 1;
                        AutoShapes.SelectGroup = false;
                    }
                    else {

                        AutoShapes.SelectGroup = glyph.IsGroup();
                    }


                }
                trackObjects.length = 0;
                for(j=0; j < glyphs.length; ++j)
                {

                    if( glyphs[j].selected )
                    {
                        var _track_shape = glyphs[j].createDuplicateForTrack(AutoShapes);
                        _track_shape.Recalculate();
                        trackObject = {

                            obj: _track_shape,
                            stX: glyphs[j].pH,
                            stY: glyphs[j].pV,
                            num: j
                        };
                        AutoShapes.ArrTrackObj.push(trackObject);
                    }

                    if(i==j) {

                        AutoShapes.NumEditShape = trackObjects.length-1;
                    }
                }
                AutoShapes.obj = glyph;
                if(glyph.IsGroup()) {

                    AutoShapes.NumGroup=i;
                }
                AutoShapes.preTrackArr = trackObjects;
                AutoShapes.ArrTrackObj = [];
                AutoShapes.Document.CurPos.Type = docpostype_Content;
                AutoShapes.Document.Document_UpdateInterfaceState();
                AutoShapes.ChangeState(new PreMoveState(preMoveObj));
                AutoShapes.Document.DrawingDocument.m_oWordControl.OnUpdateOverlay(true);
                AutoShapes.DrawingDocument.SetCursorType("move");

                AutoShapes.updateSelectionMap();
                return;
            }
            else
            {
                for( j=0; j < glyphs.length; ++j) {

                    glyphs[j].selected = false;
                }
                AutoShapes.NumSelected=0;
                AutoShapes.Document.DrawingDocument.m_oWordControl.OnUpdateOverlay(true);
                AutoShapes.updateSelectionMap();
                AutoShapes.Document.CurPos.Type = docpostype_Content;
              //  AutoShapes.Document.Document_UpdateInterfaceState();
                AutoShapes.selectionRect = {x : X, y : X, w: 0, h: 0};
                AutoShapes.ChangeState(new TrackSelectionRect());

               /* var _empty_para_pr =
                {
                    Ind               : { Left : UnknownValue, Right : UnknownValue, FirstLine : UnknownValue },
                    Jc                : UnknownValue,
                    Spacing           : { Line : UnknownValue, LineRule : UnknownValue, Before : UnknownValue, After : UnknownValue, AfterAutoSpacing : UnknownValue, BeforeAutoSpacing : UnknownValue },
                    PageBreakBefore   : UnknownValue,
                    KeepLines         : UnknownValue,
                    ContextualSpacing : UnknownValue,
                    Shd               : UnknownValue,
                    StyleId           : -1,
                    NumPr             : null,
                    Brd               :
                    {
                        Between : null,
                        Bottom  : null,
                        Left    : null,
                        Right   : null
                    },
                    ListType:
                    {
                        Type: -1,
                        SubType: -1
                    }
                };
                var _empty_text_pr =
                {
                    Bold       : false,
                    Italic     : false,
                    Underline  : false,
                    Strikeout  : false,
                    FontSize   : "",
                    FontFamily : {Index : 0, Name : ""},
                    VertAlign  : vertalign_Baseline,
                    Color      : { r : 0, g : 0, b : 0},
                    HighLight  : highlight_None
                };
                editor.UpdateTextPr(_empty_text_pr);
                editor.UpdateParagraphProp(_empty_para_pr);
                editor.asc_fireCallback("asc_canIncreaseIndent", false);
                editor.asc_fireCallback("asc_canDecreaseIndent", false);     */
                editor.ClearPropObjCallback();
                editor.sync_BeginCatchSelectedElements();

                editor.sync_slidePropCallback(AutoShapes.Document.Slides[AutoShapes.Document.CurPage]);
                editor.sync_EndCatchSelectedElements();
                return;
            }
        }
        /*else if(e.ClickCount>=2) {

            for(i = glyphs.length-1; i > -1; --i) {

                glyph = glyphs[i];
                if( glyph.Hit(X, Y)
                    || ( glyph.InTextRect(X, Y)
                    && !glyph.HitInPath(X, Y) ) ) {

                    break;
                }
            }

            if(i>-1)
            {
                if( glyph.text_flag
                    && glyph.InTextRect(X, Y)
                    && !glyph.HitInPath(X, Y) )
                {
                    AutoShapes.obj = glyph;
                    AutoShapes.NumEditShape = i;
                    glyph.addTextFlag = true;
                    AutoShapes.Document.Document_UpdateInterfaceState();

                    AutoShapes.ChangeState(new AddTextState());

                    if(glyph.txBody && glyph.txBody.compiledBodyPr && glyph.txBody.compiledBodyPr.anchor)
                    {
                        var _vertical_align = glyph.txBody.compiledBodyPr.anchor;
                        editor.sync_VerticalTextAlign(_vertical_align);

                    }
                    if(glyph.isEmptyPlaceholder())
                    {
                        AutoShapes.DrawingDocument.OnRecalculatePage(AutoShapes.SlideNum, AutoShapes.Document.Slides[ AutoShapes.SlideNum ]);
                    }
                    AutoShapes.Document.CurPos.Type=docpostype_FlowObjects;

                    for(p=0; p<glyphs.length; ++p){

                        glyphs[p].slected = false;
                    }

                    glyphs[i].slected=true;
                    AutoShapes.NumSelected=1;
                    AutoShapes.updateSelectionMap();
                }
            }
        }   */

    };

    this.OnMouseMove = function(AutoShapes, e, X, Y)
    {
        AutoShapes.updateCursorType(X, Y, e);
        return;


        var glyphs = AutoShapes.ArrGlyph;
        if( AutoShapes.NumSelected > 0 )
        {
            if(AutoShapes.NumSelected == 1)
            {
                for(var i = 0, n = glyphs.length; i < n; ++i)
                {
                    if(glyphs[i].selected)
                    {
                        var hit = glyphs[i].HitAdj(X, Y);
                        if( hit.hit )
                        {
                            AutoShapes.obj = glyphs[i];
                            AutoShapes.DrawingDocument.SetCursorType("crosshair");
                            return;
                        }
                        else
                        {
                            break;
                        }
                    }
                }

            }


                hit = {hit: false};
                for( i = glyphs.length - 1; i>-1; --i )
                {
                    if( glyphs[i].selected )
                    {
                        hit=glyphs[i].HitHandle(X, Y);
                        if(hit.hit)
                        {
                            break;
                        }
                    }
                }
                if( i>-1 ) {

                    if( hit.num != 8 )
                    {
                        var cardDirection = glyphs[i].NumToCardDir(hit.num);
                        switch(cardDirection)
                        {
                            case N:
                            case S:
                            {
                               AutoShapes.DrawingDocument.SetCursorType("s-resize");
                               break;
                            }

                            case W:
                            case E:
                            {
                               AutoShapes.DrawingDocument.SetCursorType("w-resize");
                               break;
                            }

                            case SE:
                            case NW: {

                               AutoShapes.DrawingDocument.SetCursorType("se-resize");
                               break;
                            }
                            case SW:
                            case NE:
                            {
                               AutoShapes.DrawingDocument.SetCursorType("sw-resize");
                               break;
                            }
                        }
                        return;
                    }
                    else
                    {
                        AutoShapes.DrawingDocument.SetCursorType("crosshair");
                        return;
                    }
                }
        }

        for(i = glyphs.length-1; i > -1; --i)
        {
            var glyph = glyphs[i];
            if(glyph.Hit(X, Y)
                ||(/*glyph.text_flag&& TODO:*/ glyph.InTextRect(X, Y))
                ||(glyph.selected && glyph.HitInBox(X, Y)))
            {
                break;
            }
        }

        if(i>-1)
        {
            if( glyph.text_flag && glyph.InTextRect(X, Y)
                && !glyph.HitInPath(X, Y)
                && !( glyph.selected && glyph.HitInBox(X, Y)) )
            {
                if(glyph instanceof  CGraphicFrame && glyph.graphicObject !== null && typeof glyph.graphicObject === "object"
                    && typeof glyph.graphicObject.Update_CursorType === "function")
                {
                    glyph.graphicObject.Update_CursorType(X - glyph.pH, Y - glyph.pV, AutoShapes.SlideNum)
                }
                else
                {
                    AutoShapes.DrawingDocument.SetCursorType("text");
                }
                return;
            }

            AutoShapes.DrawingDocument.SetCursorType("move");
            return;
        }
        else
        {
            AutoShapes.DrawingDocument.SetCursorType("default");
            return;
        }
    };

    this.OnMouseUp=function(AutoShapes, e, X, Y)
    {
        return;
    };
}

function TrackSelectionRect()
{
    this.OnMouseDown = function(AutoShapes, e, X, Y)
    {
        return;
    };
    this.OnMouseMove = function(AutoShapes, e, X, Y)
    {
        AutoShapes.selectionRect = {x : AutoShapes.stX, y : AutoShapes.stY, w : X - AutoShapes.stX, h : Y - AutoShapes.stY};
        AutoShapes.Document.DrawingDocument.m_oWordControl.OnUpdateOverlay(true);
    };
    this.OnMouseUp = function(AutoShapes, e, X, Y)
    {
        var _glyph_index;
        var _glyphs_array = AutoShapes.ArrGlyph;
        var _glyph, _glyph_transform;
        var _xlt, _ylt, _xrt, _yrt, _xrb, _yrb, _xlb, _ylb;

        var _rect_l = Math.min(AutoShapes.selectionRect.x, AutoShapes.selectionRect.x + AutoShapes.selectionRect.w);
        var _rect_r = Math.max(AutoShapes.selectionRect.x, AutoShapes.selectionRect.x + AutoShapes.selectionRect.w);
        var _rect_t = Math.min(AutoShapes.selectionRect.y, AutoShapes.selectionRect.y + AutoShapes.selectionRect.h);
        var _rect_b = Math.max(AutoShapes.selectionRect.y, AutoShapes.selectionRect.y + AutoShapes.selectionRect.h);
        for(_glyph_index = 0; _glyph_index < _glyphs_array.length; ++_glyph_index)
        {
            _glyph = _glyphs_array[_glyph_index];
            _glyph_transform = _glyph.TransformMatrix;

            _xlt = _glyph_transform.TransformPointX(0, 0);
            _ylt = _glyph_transform.TransformPointY(0, 0);

            _xrt = _glyph_transform.TransformPointX( _glyph.ext.cx, 0);
            _yrt = _glyph_transform.TransformPointY( _glyph.ext.cx, 0);

            _xrb = _glyph_transform.TransformPointX( _glyph.ext.cx, _glyph.ext.cy);
            _yrb = _glyph_transform.TransformPointY( _glyph.ext.cx, _glyph.ext.cy);

            _xlb = _glyph_transform.TransformPointX(0, _glyph.ext.cy);
            _ylb = _glyph_transform.TransformPointY(0, _glyph.ext.cy);

            _glyph.selected = (_xlb >= _rect_l && _xlb <= _rect_r) && (_xrb >= _rect_l && _xrb <= _rect_r)
                && (_xlt >= _rect_l && _xlt <= _rect_r) && (_xrt >= _rect_l && _xrt <= _rect_r) &&
                (_ylb >= _rect_t && _ylb <= _rect_b) && (_yrb >= _rect_t && _yrb <= _rect_b)
                && (_ylt >= _rect_t && _ylt <= _rect_b) && (_yrt >= _rect_t && _yrt <= _rect_b);
        }
        AutoShapes.selectionRect = null;
        AutoShapes.updateSelectionMap();
        AutoShapes.selectedCount();
        AutoShapes.Document.DrawingDocument.m_oWordControl.OnUpdateOverlay(true);
        AutoShapes.ChangeState(new NullShapeState());
        AutoShapes.Document.Document_UpdateInterfaceState();

    };
}

function ShapeAddState()
{
    this.id=1;
    this.OnMouseDown = function(AutoShapes, e, X, Y)
    {
        AutoShapes.resetState();
        AutoShapes.Document.CurPos.Type = docpostype_Content;
        AutoShapes.Document.RecalculateCurPos();
        AutoShapes.Document.Document_UpdateSelectionState();
        AutoShapes.stX=X;
        AutoShapes.stY=Y;
        var shape;
        shape = new CShape(AutoShapes.Document.Slides[AutoShapes.SlideNum]);

        shape.nvSpPr = new UniNvPr();
        shape.nvSpPr.cNvPr.id = ++AutoShapes.Document.Slides[AutoShapes.SlideNum].maxId;

        shape.spPr.xfrm.offX = X;
        shape.spPr.xfrm.offY = Y;
        shape.spPr.xfrm.extX = 1;
        shape.spPr.xfrm.extY = 1;
        shape.setContainer(AutoShapes);
        shape.txBody = new CTextBody(shape);
        shape.txBody.bodyPr = new CBodyPr();
        shape.txBody.bodyPr.setDefault();
        shape.txBody.bodyPr.anchor = 1;//center
        shape.txBody.content = new CDocumentContent(shape, AutoShapes.DrawingDocument,0, 0, 0, 0, 0, 0);
        shape.txBody.content.Content[0].Set_Align( 2, false );
        if(AutoShapes.CurPreset != "textRect")
        {
            shape.style  = CreateDefaultShapeStyle();
            shape.spPr.Geometry = CreateGeometry(AutoShapes.CurPreset);
        }
        else
        {
            shape.style  = null;
            shape.spPr.Geometry = CreateGeometry("rect");
        }

        shape.geometry = shape.spPr.Geometry;
        shape.calculate2();
        AutoShapes.resetState();
        AutoShapes.ArrTrackObj.length=0;
        AutoShapes.ArrTrackObj.push({obj:shape});
        AutoShapes.ChangeState(new TrackNewShapeState());
        AutoShapes.Document.DrawingDocument.StartTrackAutoshape();
    };
    
    this.OnMouseMove = function(AutoShapes, e, X, Y)
    {
    };
    
    this.OnMouseUp = function(AutoShapes, e, X, Y)
    {
    }
}


function StateAddArrows(bTailEnd, bHeadEnd)
{
    this.id=1;
    this.bTailEnd = bTailEnd;
    this.bHeadEnd = bHeadEnd;

    this.OnMouseDown = function(AutoShapes, e, X, Y)
    {
        AutoShapes.resetState();
        AutoShapes.Document.CurPos.Type = docpostype_Content;
        AutoShapes.Document.RecalculateCurPos();
        AutoShapes.Document.Document_UpdateSelectionState();
        AutoShapes.stX=X;
        AutoShapes.stY=Y;
        var shape;
        shape = new CShape(AutoShapes.Document.Slides[AutoShapes.SlideNum]);

        shape.nvSpPr = new UniNvPr();
        shape.nvSpPr.cNvPr.id = ++AutoShapes.Document.Slides[AutoShapes.SlideNum].maxId;
        shape.spPr.xfrm.offX = X;
        shape.spPr.xfrm.offY = Y;
        shape.spPr.xfrm.extX = 1;
        shape.spPr.xfrm.extY = 1;
        shape.txBody = new CTextBody(shape);
        shape.txBody.bodyPr = new CBodyPr();
        shape.txBody.bodyPr.setDefault();
        shape.txBody.bodyPr.anchor = 1;//center
        shape.style  = CreateDefaultShapeStyle();
        shape.txBody.content = new CDocumentContent(shape, AutoShapes.DrawingDocument,0, 0, 0, 0, 0, 0);
        shape.txBody.content.Content[0].Set_Align( 2, false );
        shape.spPr.Geometry = CreateGeometry(AutoShapes.CurPreset);
        shape.spPr.ln = new CLn();
        if(this.bTailEnd)
        {
            shape.spPr.ln.tailEnd = new EndArrow();
            shape.spPr.ln.tailEnd.type = LineEndType.Arrow;
        }
        if(this.bHeadEnd)
        {
            shape.spPr.ln.headEnd = new EndArrow();
            shape.spPr.ln.headEnd.type = LineEndType.Arrow;
        }
        shape.geometry = shape.spPr.Geometry;
        shape.calculate2();
        AutoShapes.resetState();
        AutoShapes.ArrTrackObj.length=0;
        AutoShapes.ArrTrackObj.push({obj:shape});
        AutoShapes.ChangeState(new TrackNewShapeState());
        AutoShapes.Document.DrawingDocument.StartTrackAutoshape();
    };

    this.OnMouseMove = function(AutoShapes, e, X, Y)
    {
    };

    this.OnMouseUp =function(AutoShapes, e, X, Y)
    {
    }
}

function TrackNewShapeState()
{
    this.id=2;
    this.OnMouseDown = function(AutoShapes, e, X, Y)
    {
        AutoShapes.stX=X;
        AutoShapes.stY=Y;
    };
    this.OnMouseMove = function(AutoShapes, e, X, Y)
    {
        if(e.IsLocked) {

            var dx=0, dy=0, i, j;
            for(i=0; i<AutoShapes.ArrGlyph.length; i++)
            {
                dx=JoinedH(AutoShapes.ArrTrackObj[0].obj, AutoShapes.ArrGlyph[i]);
                if(Math.abs(dx)>0)
                    break;
                if(AutoShapes.ArrGlyph[i].IsGroup())
                {
                    for(j=0; j<AutoShapes.ArrGlyph[i].ArrGlyph.length; ++j)
                    {
                        dx=JoinedH(AutoShapes.ArrTrackObj[0].obj, AutoShapes.ArrGlyph[i].ArrGlyph[j]);
                        if(Math.abs(dx)>0)
                            break;
                    }
                }
                if(Math.abs(dx)>0)
                    break;
            }
            for(i=0; i<AutoShapes.ArrGlyph.length; i++)
            {
                dy=JoinedV(AutoShapes.ArrTrackObj[0].obj, AutoShapes.ArrGlyph[i]);
                if(Math.abs(dy)>0)
                    break;
                if(AutoShapes.ArrGlyph[i].IsGroup())
                {
                    for(j=0; j<AutoShapes.ArrGlyph[i].ArrGlyph.length; ++j)
                    {
                        dy=JoinedV(AutoShapes.ArrTrackObj[0].obj, AutoShapes.ArrGlyph[i].ArrGlyph[j]);
                        if(Math.abs(dy)>0)
                            break;
                    }
                }
                if(Math.abs(dy)>0)
                    break;
            }

            if(Math.abs(X-AutoShapes.stX)<min_distance_joined)
                X=AutoShapes.stX;
            else
                X-=dx;
            if(Math.abs(Y-AutoShapes.stY)<min_distance_joined)
                Y=AutoShapes.stY;
            else
                Y-=dy;
            var pH, pV, ext={}, off={x:0, y:0};
            var DX=X-AutoShapes.stX, DY=Y-AutoShapes.stY;
            if( !AutoShapes.ArrTrackObj[0].obj.isLine )
            {
                if(e.CtrlKey)
                {
                    if(X>AutoShapes.stX)
                    {
                        if(DX>min_size2 || AutoShapes.ArrTrackObj[0].obj.IsLine())
                        {
                            ext.cx=2*DX;
                            pH=2*AutoShapes.stX-X;
                        }
                        else
                        {
                            ext.cx=2*min_size2;
                            pH=AutoShapes.stX-min_size2;
                        }
                    }
                    else
                    {
                        if(DX<-min_size2 || AutoShapes.ArrTrackObj[0].obj.IsLine())
                        {
                            ext.cx=2*Math.abs(DX);
                            pH=X;
                        }
                        else
                        {
                            ext.cx=2*min_size2;
                            pH=AutoShapes.stX-min_size2;
                        }
                    }
                    if(Y>AutoShapes.stY )
                    {
                        if(DY>min_size2 || AutoShapes.ArrTrackObj[0].obj.IsLine())
                        {
                            ext.cy=2*DY;
                            pV=2*AutoShapes.stY-Y;
                        }
                        else
                        {
                            ext.cy=2*min_size2;
                            pV=AutoShapes.stY-min_size2;
                        }
                    }
                    else
                    {
                        if(DY<-min_size2 || AutoShapes.ArrTrackObj[0].obj.IsLine())
                        {
                            ext.cy=2*Math.abs(DY);
                            pV=Y;
                        }
                        else
                        {
                            ext.cy=2*min_size2;
                            pV=AutoShapes.stY-min_size2;
                        }
                    }
                }
                else
                {
                    if(X>AutoShapes.stX)
                    {
                        if(DX>min_size2 || AutoShapes.ArrTrackObj[0].obj.IsLine())
                        {
                            ext.cx=DX;
                        }
                        else
                        {
                            ext.cx=min_size2;
                        }
                        pH=AutoShapes.stX;
                    }
                    else
                    {
                        if(DX<-min_size2 || AutoShapes.ArrTrackObj[0].obj.IsLine())
                        {
                            ext.cx=-DX;
                            pH=X;
                        }
                        else
                        {
                            ext.cx=min_size2;
                            pH=AutoShapes.stX-min_size2;
                        }
                    }

                    if(Y>AutoShapes.stY)
                    {
                        if(DY>min_size2 || AutoShapes.ArrTrackObj[0].obj.IsLine())
                        {
                            ext.cy=DY;
                        }
                        else
                        {
                            ext.cy=min_size2;
                        }
                        pV=AutoShapes.stY;
                    }
                    else
                    {
                        if(DY<-min_size2 || AutoShapes.ArrTrackObj[0].obj.IsLine())
                        {
                            ext.cy=-DY;
                            pV=Y;
                        }
                        else
                        {
                            ext.cy=min_size2;
                            pV=AutoShapes.stY-min_size2;
                        }
                    }
                }
            }
            else
            {
                DX=X-AutoShapes.stX;
                DY=Y-AutoShapes.stY;
                if(X>=AutoShapes.stX&&Y>=AutoShapes.stY)
                {
                    pH=AutoShapes.stX;
                    pV=AutoShapes.stY;
                    AutoShapes.ArrTrackObj[0].obj.flipH=false;
                    AutoShapes.ArrTrackObj[0].obj.flipV=false;
                    off = {x: 0, y:0};
                    ext = {cx: X-AutoShapes.stX, cy: Y-AutoShapes.stY};
                }
                else if(X>=AutoShapes.stX&&Y<AutoShapes.stY)
                {
                    pH=AutoShapes.stX;
                    pV=Y;
                    AutoShapes.ArrTrackObj[0].obj.flipH=false;
                    AutoShapes.ArrTrackObj[0].obj.flipV=true;
                    off = {x: 0, y:0};
                    ext = {cx: X-AutoShapes.stX, cy: AutoShapes.stY-Y};
                }
                else if(X<AutoShapes.stX&&Y>=AutoShapes.stY)
                {
                    pH=X;
                    pV=AutoShapes.stY;
                    AutoShapes.ArrTrackObj[0].obj.flipH=true;
                    AutoShapes.ArrTrackObj[0].obj.flipV=false;
                    off = {x: 0, y:0};
                    ext = {cx: AutoShapes.stX-X, cy: Y-AutoShapes.stY};
                }
                else if(X<AutoShapes.stX&&Y<AutoShapes.stY)
                {
                    pH=X;
                    pV=Y;
                    AutoShapes.ArrTrackObj[0].obj.flipH=true;
                    AutoShapes.ArrTrackObj[0].obj.flipV=true;
                    off = {x: 0, y:0};
                    ext = {cx: AutoShapes.stX-X, cy: AutoShapes.stY-Y};
                }
            }
            AutoShapes.ArrTrackObj[0].obj.pH=pH;
            AutoShapes.ArrTrackObj[0].obj.pV=pV;
            AutoShapes.ArrTrackObj[0].obj.off=off;
            AutoShapes.ArrTrackObj[0].obj.ext=ext;
            if(AutoShapes.ArrTrackObj[0].obj.IsLine())
            {
                AutoShapes.ArrTrackObj[0].obj.flipH =  AutoShapes.stX > X;
                AutoShapes.ArrTrackObj[0].obj.flipV =  AutoShapes.stY > Y;
            }
            AutoShapes.ArrTrackObj[0].obj.Recalculate();
            AutoShapes.Document.DrawingDocument.m_oWordControl.OnUpdateOverlay(false);




           // AutoShapes.DrawingDocument.OnRecalculatePage( AutoShapes.SlideNum, AutoShapes.Document.Pages[AutoShapes.SlideNum] );
        }
    };
    this.OnMouseUp =function(AutoShapes, e, X, Y) {

        var trackShape = AutoShapes.ArrTrackObj[0].obj;
        if( AutoShapes.stX == X && AutoShapes.stY == Y ) {

            trackShape.ext = { cx : 60, cy : 60 };
            trackShape.Recalculate();
        }
        History.Create_NewPoint();
        var historyData = {};
        historyData.num = AutoShapes.ArrGlyph.length;
        historyData.shape = trackShape;
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
        AutoShapes.Add(trackShape);
        trackShape.Container = AutoShapes;
        AutoShapes.ArrTrackObj.length=0;
        if(AutoShapes.CurPreset == "textRect")
        {
            AutoShapes.obj = trackShape;
            AutoShapes.NumEditShape = AutoShapes.ArrGlyph.length-1;
            trackShape.addTextFlag = true;
            trackShape.txBody.content.Selection_SetStart(0, 0, 0 , e);
            trackShape.txBody.content.Selection_SetEnd(0, 0, 0 , e);
            AutoShapes.ChangeState(new AddTextState());
            if(trackShape.txBody && trackShape.txBody.compiledBodyPr && trackShape.txBody.compiledBodyPr.anchor != undefined)
            {
                var _vertical_align = trackShape.txBody.compiledBodyPr.anchor;
                editor.sync_VerticalTextAlign(_vertical_align);
            }
            AutoShapes.Document.CurPos.Type=docpostype_FlowObjects;
            AutoShapes.Document.Document_UpdateSelectionState();
            AutoShapes.DrawingDocument.EndTrackAutoShape();
            AutoShapes.DrawingDocument.OnRecalculatePage(AutoShapes.SlideNum, AutoShapes.Document.Slides[ AutoShapes.SlideNum ]);
        }
        else
        {
            AutoShapes.ChangeState(new NullShapeState());
            AutoShapes.DrawingDocument.EndTrackAutoShape();
            AutoShapes.DrawingDocument.OnRecalculatePage(AutoShapes.SlideNum, AutoShapes.Document.Slides[ AutoShapes.SlideNum ]);
        }
        AutoShapes.obj=trackShape;
        trackShape.calculateXfrm();
        editor.sync_EndAddShape();
    };
}


function PreResizeState()
{
    this.OnMouseDown = function(AutoShapes, e, X, Y)
    {};
    this.OnMouseMove = function(AutoShapes, e, X, Y)
    {
        if(AutoShapes.Document.viewMode === true)
        {
            AutoShapes.ArrTrackObj = [];
            AutoShapes.preTrackArr = [];
            AutoShapes.ChangeState(new NullShapeState());
            return;
        }
        AutoShapes.ArrTrackObj = AutoShapes.preTrackArr;
        AutoShapes.preTrackArr = [];

        AutoShapes.DrawingDocument.StartTrackAutoshape();
        AutoShapes.ChangeState(new ResizeGroupObjState());
    };
    this.OnMouseUp = function(AutoShapes, e, X, Y)
    {
        AutoShapes.ArrTrackObj = [];
        AutoShapes.preTrackArr = [];
        AutoShapes.ChangeState(new NullShapeState());
    };
}

function ResizeGroupObjState()
{
    this.OnMouseDown = function (AutoShapes, e, X, Y) {

        AutoShapes.stX=X;
        AutoShapes.stY=Y;
    };
    
    this.OnMouseMove = function (AutoShapes, e, X, Y) {

        var dx=0, dy=0, i, j;
        for(i=0; i<AutoShapes.ArrGlyph.length; i++)
        {
            dx=JoinedPointH(X, AutoShapes.ArrGlyph[i]);
            if(Math.abs(dx)>0)
                break;
            if(AutoShapes.ArrGlyph[i].IsGroup())
            {
                for(j=0; j<AutoShapes.ArrGlyph[i].ArrGlyph.length; ++j)
                {
                    dx=JoinedPointH(X, AutoShapes.ArrGlyph[i].ArrGlyph[j]);
                    if(Math.abs(dx)>0)
                        break;
                }
            }
            if(Math.abs(dx)>0)
                break;
        }
        for(i=0; i<AutoShapes.ArrGlyph.length; i++)
        {
            dy=JoinedPointV(Y, AutoShapes.ArrGlyph[i]);
            if(Math.abs(dy)>0)
                break;
            if(AutoShapes.ArrGlyph[i].IsGroup())
            {
                for(j=0; j<AutoShapes.ArrGlyph[i].ArrGlyph.length; ++j)
                {
                    dy=JoinedPointV(Y, AutoShapes.ArrGlyph[i].ArrGlyph[j]);
                    if(Math.abs(dy)>0)
                        break;
                }
            }
            if(Math.abs(dy)>0)
                break;
        }

        var K=AutoShapes.obj.DefineResizeCoef(AutoShapes.NumHResize, X-dx, Y-dy);
        if(!e.CtrlKey && !e.ShiftKey)
        {
            for(i=0; i<AutoShapes.ArrTrackObj.length; ++i)
            {
                AutoShapes.ArrTrackObj[i].obj = AutoShapes.ArrGlyph[AutoShapes.ArrTrackObj[i].num].createDuplicateForTrack(AutoShapes);//clone(AutoShapes.ArrGlyph[AutoShapes.ArrTrackObj[i].num]);
                var  trackObj = AutoShapes.ArrTrackObj[i].obj;
                trackObj.Resize(AutoShapes.ArrTrackObj[i].num_h, K.kd1, K.kd2);
            }
        }
        else if(e.ShiftKey)
        {
            for(i=0; i<AutoShapes.ArrTrackObj.length; ++i)
            {
                AutoShapes.ArrTrackObj[i].obj = AutoShapes.ArrGlyph[AutoShapes.ArrTrackObj[i].num].createDuplicateForTrack(AutoShapes);//clone(AutoShapes.ArrGlyph[AutoShapes.ArrTrackObj[i].num]);
                var trackObj = AutoShapes.ArrTrackObj[i].obj;
                var kd1, kd2;
                if(AutoShapes.ArrTrackObj[i].num_h % 2 == 0)
                {
                    var _old_aspect = trackObj.getAspect(AutoShapes.ArrTrackObj[i].num_h);
                    var _new_aspect = _old_aspect*(Math.abs(K.kd1/ K.kd2));

                    if (_new_aspect >= _old_aspect)
                    {
                        kd1 = K.kd1;
                        var sign = K.kd2 >= 0 ? 1 : -1 ;
                        kd2 = Math.abs(kd1)*sign;
                    }
                    else
                    {
                        kd1 = Math.abs(K.kd2)*(K.kd1 >= 0 ? 1 : -1);
                        kd2 = K.kd2;
                    }
                }
                else
                {
                    kd1 = K.kd1;
                    kd2 = K.kd2;
                }

                trackObj.Resize(AutoShapes.ArrTrackObj[i].num_h, kd1, kd2);
            }
        }
        else if(e.CtrlKey)
        {
            for(i=0; i<AutoShapes.ArrTrackObj.length; ++i)
            {
                AutoShapes.ArrTrackObj[i].obj = AutoShapes.ArrGlyph[AutoShapes.ArrTrackObj[i].num].createDuplicateForTrack(AutoShapes);//clone(AutoShapes.ArrGlyph[AutoShapes.ArrTrackObj[i].num]);
                var  trackObj = AutoShapes.ArrTrackObj[i].obj;
                trackObj.ResizeRelativeCenter(AutoShapes.ArrTrackObj[i].num_h, K.kd1, K.kd2);
            }
        }

        AutoShapes.Document.DrawingDocument.m_oWordControl.OnUpdateOverlay(false);
    };
    
    this.OnMouseUp = function (AutoShapes, e, X, Y)
    {
        var numResizeShapeInTrackArray = 0, trackObjects = AutoShapes.ArrTrackObj;
        var i, j;
        for(i = 0; i < trackObjects.length; ++i)
        {
            if(trackObjects[i].num == AutoShapes.NumEditShape)
            {
                numResizeShapeInTrackArray = i;
                break;
            }
        }
        if(trackObjects[numResizeShapeInTrackArray].obj.ext.cx!=AutoShapes.ArrGlyph[AutoShapes.NumEditShape].ext.cx
            || trackObjects[numResizeShapeInTrackArray].obj.ext.cy!=AutoShapes.ArrGlyph[AutoShapes.NumEditShape].ext.cy
            || trackObjects[numResizeShapeInTrackArray].obj.flipH!=AutoShapes.ArrGlyph[AutoShapes.NumEditShape].flipH
            || trackObjects[numResizeShapeInTrackArray].obj.flipV!=AutoShapes.ArrGlyph[AutoShapes.NumEditShape].flipV)
        {
            History.Create_NewPoint();
            AutoShapes.addHistorySelectedState();
            for(i=0; i<AutoShapes.ArrTrackObj.length; i++)
            {
                var shape = AutoShapes.ArrGlyph[AutoShapes.ArrTrackObj[i].num];
                var trackObj = AutoShapes.ArrTrackObj[i].obj;
                shape.copyTransform(trackObj);
                shape.Recalculate();
                shape.updateCursorTypes();
                shape.calculateXfrm();
            }
        }


        AutoShapes.ArrTrackObj.length=0;
        AutoShapes.ChangeState(new NullShapeState());
        AutoShapes.Document.DrawingDocument.EndTrackAutoShape();
        AutoShapes.Document.DrawingDocument.OnRecalculatePage(AutoShapes.SlideNum,AutoShapes.Document.Slides[AutoShapes.SlideNum]);
        var shp=AutoShapes.obj;

        AutoShapes.Document.Document_UpdateUndoRedoState();
    }
}


function PreChangeAdjState()
{
    this.OnMouseDown = function(AutoShapes, e, X, Y)
    {};
    this.OnMouseMove = function(AutoShapes, e, X, Y)
    {
        if(AutoShapes.Document.viewMode === true)
        {
            AutoShapes.ArrTrackObj = [];
            AutoShapes.preTrackArr = [];
            AutoShapes.ChangeState(new NullShapeState());
            return;
        }
        AutoShapes.ArrTrackObj = AutoShapes.preTrackArr;
        AutoShapes.preTrackArr = [];

        var shape =AutoShapes.obj, hit = AutoShapes.ArrTrackObj[0].hit, trackShape = AutoShapes.ArrTrackObj[0].obj;
        var geometry = shape.geometry;
        var tmpHistory = {};
        if(hit.type == xy)
        {
            trackShape.CalculateAdjRange(hit.num);
            if(geometry.ahXYLst[hit.num].gdRefX!=undefined && geometry.gdLst[geometry.ahXYLst[hit.num].gdRefX]!= undefined)
            {
                tmpHistory.old_gdValue1 = geometry.gdLst[geometry.ahXYLst[hit.num].gdRefX];
            }
            if(geometry.ahXYLst[hit.num].gdRefY!=undefined && geometry.gdLst[geometry.ahXYLst[hit.num].gdRefY]!= undefined)
            {
                tmpHistory.old_gdValue2 = geometry.gdLst[geometry.ahXYLst[hit.num].gdRefY];
            }
        }
        else
        {
            trackShape.CalculateAdjPolarRangeR(hit.num);
            if(geometry.ahPolarLst[hit.num].gdRefR!=undefined && geometry.gdLst[geometry.ahPolarLst[hit.num].gdRefR])
            {
                tmpHistory.old_gdValue1 = geometry.gdLst[geometry.ahPolarLst[hit.num].gdRefR];
            }
            if(geometry.ahPolarLst[hit.num].gdRefAng!=undefined && geometry.gdLst[geometry.ahPolarLst[hit.num].gdRefAng] != undefined)
            {
                tmpHistory.old_gdValue2 = geometry.gdLst[geometry.ahPolarLst[hit.num].gdRefAng];
            }
        }

        AutoShapes.tmpHistoryData = tmpHistory;

        AutoShapes.DrawingDocument.StartTrackAutoshape();
        AutoShapes.ChangeState(new ChangeAdjState());
    };
    this.OnMouseUp = function(AutoShapes, e, X, Y)
    {
        AutoShapes.ArrTrackObj = [];
        AutoShapes.preTrackArr = [];
        AutoShapes.ChangeState(new NullShapeState());
    };
}

function ChangeAdjState()
{
    this.id=4;

    this.OnMouseDown = function(AutoShapes, e, X, Y)
    {
        AutoShapes.stX=X;
        AutoShapes.stY=Y;
    };

    this.OnMouseMove =  function(AutoShapes, e, X, Y)
    {
        var trackObject = AutoShapes.ArrTrackObj[0];
        if(trackObject.hit.type == xy)
        {
            trackObject.obj.ChangeAdjXY(trackObject.hit.num, X, Y);
        }
        else
        {
            trackObject.obj.ChangeAdjPolar(trackObject.hit.num, X, Y);
        }
        AutoShapes.Document.DrawingDocument.m_oWordControl.OnUpdateOverlay(false);
    };

    this.OnMouseUp =  function(AutoShapes, e, X, Y)
    {
        var shape =AutoShapes.ArrGlyph[AutoShapes.ArrTrackObj[0].num], trackShape = AutoShapes.ArrTrackObj[0].obj,
            hit=AutoShapes.ArrTrackObj[0].hit;
        var bRecalculateShape = false;//нужно ли пересчитывать фигуру и добавлять изменения в историю
        var geometry = trackShape.geometry;
        if(hit.type == xy)
        {
            if(geometry.ahXYLst[hit.num].gdRefX!=undefined)
            {
                bRecalculateShape = geometry.gdLst[geometry.ahXYLst[hit.num].gdRefX] != AutoShapes.tmpHistoryData.old_gdValue1;
            }
            if(!bRecalculateShape && geometry.ahXYLst[hit.num].gdRefY!=undefined)
            {
                bRecalculateShape = geometry.gdLst[geometry.ahXYLst[hit.num].gdRefY] != AutoShapes.tmpHistoryData.old_gdValue2;
            }
        }
        else
        {
            if(geometry.ahPolarLst[hit.num].gdRefR!=undefined)
            {
                bRecalculateShape = geometry.gdLst[geometry.ahPolarLst[hit.num].gdRefR] != AutoShapes.tmpHistoryData.old_gdValue1;
            }
            if(!bRecalculateShape && geometry.ahPolarLst[hit.num].gdRefAng!=undefined)
            {
                bRecalculateShape = geometry.gdLst[geometry.ahPolarLst[hit.num].gdRefAng] != AutoShapes.tmpHistoryData.old_gdValue2;
            }
        }

        if(bRecalculateShape)
        {
            History.Create_NewPoint();
            AutoShapes.addHistorySelectedState();
            var historyData = {};
            if(hit.type==xy)
            {
                if(geometry.ahXYLst[hit.num].gdRefX!=undefined)
                {
                    historyData.old_gdValue1 = AutoShapes.tmpHistoryData.old_gdValue1;
                    historyData.nameGuide1 = geometry.ahXYLst[hit.num].gdRefX;
                }
                if(geometry.ahXYLst[hit.num].gdRefY!=undefined)
                {
                    historyData.old_gdValue2 = AutoShapes.tmpHistoryData.old_gdValue2;
                    historyData.nameGuide2 = geometry.ahXYLst[hit.num].gdRefY;
                }

                if(geometry.ahXYLst[hit.num].gdRefX!=undefined)
                {
                    historyData.new_gdValue1 = geometry.gdLst[geometry.ahXYLst[hit.num].gdRefX];
                    shape.geometry.gdLst[geometry.ahXYLst[hit.num].gdRefX] = geometry.gdLst[geometry.ahXYLst[hit.num].gdRefX];
                }
                if(geometry.ahXYLst[hit.num].gdRefY!=undefined)
                {
                    historyData.new_gdValue2 = geometry.gdLst[geometry.ahXYLst[hit.num].gdRefY];
                    shape.geometry.gdLst[geometry.ahXYLst[hit.num].gdRefY] = geometry.gdLst[geometry.ahXYLst[hit.num].gdRefY];
                }
            }
            else
            {
                if(geometry.ahPolarLst[hit.num].gdRefR!=undefined)
                {
                    historyData.old_gdValue1 = AutoShapes.tmpHistoryData.old_gdValue1;
                    historyData.nameGuide1 = geometry.ahPolarLst[hit.num].gdRefR;
                }
                if(geometry.ahPolarLst[hit.num].gdRefAng!=undefined)
                {
                    historyData.old_gdValue2 = AutoShapes.tmpHistoryData.old_gdValue2;
                    historyData.nameGuide2 = geometry.ahPolarLst[hit.num].gdRefAng;
                }

                if(geometry.ahPolarLst[hit.num].gdRefR!=undefined)
                {
                    historyData.new_gdValue1 = geometry.gdLst[geometry.ahPolarLst[hit.num].gdRefR];
                    shape.geometry.gdLst[geometry.ahPolarLst[hit.num].gdRefR] = geometry.gdLst[geometry.ahPolarLst[hit.num].gdRefR];
                }
                if(geometry.ahPolarLst[hit.num].gdRefAng!=undefined)
                {
                    historyData.new_gdValue2 = geometry.gdLst[geometry.ahPolarLst[hit.num].gdRefAng];
                    shape.geometry.gdLst[geometry.ahPolarLst[hit.num].gdRefAng] = geometry.gdLst[geometry.ahPolarLst[hit.num].gdRefAng];
                }
            }

            historyData.undo_function = function(data)
            {
                if(historyData.old_gdValue1 != undefined)
                {
                    this.geometry.gdLst[historyData.nameGuide1] = historyData.old_gdValue1;
                }
                if(historyData.old_gdValue2 != undefined)
                {
                    this.geometry.gdLst[historyData.nameGuide2] = historyData.old_gdValue2;
                }
                this.Recalculate();
            };

            historyData.redo_function = function(data)
            {
                if(historyData.old_gdValue1 != undefined)
                {
                    this.geometry.gdLst[historyData.nameGuide1] = historyData.new_gdValue1;
                }
                if(historyData.old_gdValue2 != undefined)
                {
                    this.geometry.gdLst[historyData.nameGuide2] = historyData.new_gdValue2;
                }
                this.Recalculate();
            };
            History.Add(shape, historyData);

            AutoShapes.Document.Document_UpdateUndoRedoState();
            shape.Recalculate();
        }


        AutoShapes.ArrTrackObj.length=0;
        AutoShapes.tmpHistoryData = {};
        AutoShapes.ChangeState(new NullShapeState());
        AutoShapes.Document.DrawingDocument.EndTrackAutoShape();
        AutoShapes.Document.DrawingDocument.OnRecalculatePage(AutoShapes.SlideNum,AutoShapes.Document.Slides[AutoShapes.SlideNum]);
        
    }
}



function PreMoveState(preMoveObj)
{
    this.preMoveObj = preMoveObj;
    this.OnMouseDown = function(AutoShapes, e, X, Y)
    {};
    this.OnMouseMove = function(AutoShapes, e, X, Y)
    {
        if(AutoShapes.Document.viewMode === true)
        {
            AutoShapes.ArrTrackObj = [];
            AutoShapes.preTrackArr = [];
            AutoShapes.ChangeState(new NullShapeState());
            return;
        }
        if(AutoShapes.stX == X && AutoShapes.stY == Y)
        {
            return;
        }
        AutoShapes.ArrTrackObj = AutoShapes.preTrackArr;
        AutoShapes.preTrackArr = [];

        AutoShapes.DrawingDocument.StartTrackAutoshape();
        AutoShapes.ChangeState(new MoveState());
    };
    this.OnMouseUp = function(AutoShapes, e, X, Y)
    {

        if( AutoShapes.obj.IsGroup()
            && AutoShapes.NumSelected == 1
            && AutoShapes.SelectGroup ) {

            AutoShapes.group=AutoShapes.obj;
            AutoShapes.ArrTrackObj.length=0;

            AutoShapes.ChangeState(new GroupState());
            AutoShapes.group.OnMouseDown(e, X, Y);
            AutoShapes.group.OnMouseUp(e, X, Y);
            AutoShapes.obj=AutoShapes.group.obj;
            return;
        }
        AutoShapes.ArrTrackObj = [];
        AutoShapes.preTrackArr = [];
        AutoShapes.ChangeState(new NullShapeState());


        if(this.preMoveObj != null)
        {
            var _shapes = AutoShapes.ArrGlyph;
            var _shape_index;
            for(_shape_index = _shapes.length-1; _shape_index > -1; --_shape_index)
            {

                var glyph = _shapes[_shape_index];
                if(glyph.Hit(X, Y)
                    ||(/*glyph.text_flag&& TODO:*/ glyph.InTextRect(X, Y))
                    ||(glyph.selected && glyph.HitInBox(X, Y)))
                {
                    glyph.selected = false;
                    AutoShapes.selectedCount();
                    AutoShapes.Document.DrawingDocument.m_oWordControl.OnUpdateOverlay(true);
                    break;
                }
            }
        }

    };
}

function MoveState()
{
    this.OnMouseDown = function(AutoShapes, e, X, Y)
    {
        AutoShapes.stX=X;
        AutoShapes.stY=Y;
    };
    
    this.OnMouseMove =  function(AutoShapes, e, X, Y)
    {
        if(e.IsLocked)
        {
            if(!e.ShiftKey)
            {
                var DX, DY;
                var dx=0, dy=0, i, j;
                DX=X-AutoShapes.stX;
                DY=Y-AutoShapes.stY;
                for( i=0; i<AutoShapes.ArrTrackObj.length; i++)
                    AutoShapes.ArrTrackObj[i].obj.Move(AutoShapes.ArrTrackObj[i].stX+DX, AutoShapes.ArrTrackObj[i].stY+DY);

                if(AutoShapes.ArrTrackObj[0]!=undefined)
                {
                    for(i=0; i<AutoShapes.ArrGlyph.length; i++)
                    {
                        dx=JoinedH(AutoShapes.ArrTrackObj[0].obj, AutoShapes.ArrGlyph[i]);
                        if(dx>0)
                            break;
                        if(AutoShapes.ArrGlyph[i].IsGroup())
                        {
                            for(j=0; j<AutoShapes.ArrGlyph[i].ArrGlyph.length; ++j)
                            {
                                dx=JoinedH(AutoShapes.ArrTrackObj[0].obj, AutoShapes.ArrGlyph[i].ArrGlyph[j]);
                                if(dx>0)
                                    break;
                            }
                        }
                        if(dx>0)
                            break;
                    }
                    for(i=0; i<AutoShapes.ArrGlyph.length; i++)
                    {
                        dy=JoinedV(AutoShapes.ArrTrackObj[0].obj, AutoShapes.ArrGlyph[i]);
                        if(dy>0)
                            break;
                        if(AutoShapes.ArrGlyph[i].IsGroup())
                        {
                            for(j=0; j<AutoShapes.ArrGlyph[i].ArrGlyph.length; ++j)
                            {
                                dy=JoinedV(AutoShapes.ArrTrackObj[0].obj, AutoShapes.ArrGlyph[i].ArrGlyph[j]);
                                if(dy>0)
                                    break;
                            }
                        }
                        if(dy>0)
                            break;
                    }
                }

                for(i=0; i<AutoShapes.ArrTrackObj.length; i++)
                {
                    AutoShapes.ArrTrackObj[i].obj.Move(AutoShapes.ArrTrackObj[i].stX+DX-dx, AutoShapes.ArrTrackObj[i].stY+DY-dy);
                }
            }
            else
            {
                var _dx = 0, _dy = 0, t = AutoShapes.DrawingDocument.GetMMPerDot(3);
                if(Math.abs(X-AutoShapes.stX) > t || Math.abs(Y-AutoShapes.stY) > t)
                {
                    if(Math.abs(X-AutoShapes.stX) > Math.abs(Y-AutoShapes.stY))
                    {
                        _dx =  X-AutoShapes.stX;
                        _dy = 0;
                    }
                    else
                    {
                        _dx = 0;
                        _dy = Y-AutoShapes.stY;
                    }
                }

                for(i=0; i<AutoShapes.ArrTrackObj.length; i++)
                {
                    AutoShapes.ArrTrackObj[i].obj.Move(AutoShapes.ArrTrackObj[i].stX + _dx, AutoShapes.ArrTrackObj[i].stY + _dy);
                }
            }

            AutoShapes.Document.DrawingDocument.m_oWordControl.OnUpdateOverlay(false);
        }
    };
    
    this.OnMouseUp = function(AutoShapes, e, X, Y)
    {
        var trackObjects = AutoShapes.ArrTrackObj;
        if(trackObjects.length == 0)
        {
            AutoShapes.ChangeState(new NullShapeState());
            AutoShapes.Document.DrawingDocument.EndTrackAutoShape();
            AutoShapes.Document.DrawingDocument.OnRecalculatePage(AutoShapes.SlideNum,AutoShapes.Document.Slides[AutoShapes.SlideNum]);
            return;
        }
        var glyphs = AutoShapes.ArrGlyph;
        if(e.CtrlKey)
        {
            AutoShapes.ChangeState(new NullShapeState());
            AutoShapes.Document.glyphsBuffer = AutoShapes.glyphsCopy();
            AutoShapes.glyphsPaste(true);
            AutoShapes.Document.glyphsBuffer.length = 0;
            var _start_pos = AutoShapes.ArrGlyph.length - trackObjects.length;
            for(var  i=0, n = trackObjects.length; i < n ; ++i )
            {
                var trackObj = trackObjects[i];
                AutoShapes.ArrGlyph[_start_pos + i].pH = trackObj.obj.pH;
                AutoShapes.ArrGlyph[_start_pos + i].pV = trackObj.obj.pV;
                AutoShapes.ArrGlyph[_start_pos + i].Recalculate();
                AutoShapes.ArrGlyph[_start_pos + i].calculateXfrm();
            }
        }
        else
        {
            if(AutoShapes.obj.pH != trackObjects[AutoShapes.NumEditShape].obj.pH
                || AutoShapes.obj.pV != trackObjects[AutoShapes.NumEditShape].obj.pV)
            {
                History.Create_NewPoint();
                AutoShapes.addHistorySelectedState();
                for(var  i=0, n = trackObjects.length; i < n ; ++i )
                {
                    var trackObj = trackObjects[i];
                    var glyph = glyphs[trackObj.num];

                    var historyData = {};
                    historyData.old_pH = glyph.pH;
                    historyData.old_pV = glyph.pV;

                    historyData.new_pH = trackObj.obj.pH;
                    historyData.new_pV = trackObj.obj.pV;

                    historyData.undo_function = function(data)
                    {
                        this.pH = data.old_pH;
                        this.pV = data.old_pV;
                        this.Recalculate();
                    };
                    historyData.redo_function = function(data)
                    {
                        this.pH = data.new_pH;
                        this.pV = data.new_pV;
                        this.Recalculate();
                    };
                    History.Add(glyph, historyData);

                    glyph.pH = trackObj.obj.pH;
                    glyph.pV = trackObj.obj.pV;
                    glyph.Recalculate();
                    glyph.calculateXfrm();
                }

                AutoShapes.Document.Document_UpdateUndoRedoState();
            }
        }
        AutoShapes.ArrTrackObj.length=0;
        AutoShapes.ChangeState(new NullShapeState());

        AutoShapes.Document.DrawingDocument.EndTrackAutoShape();
        AutoShapes.Document.DrawingDocument.OnRecalculatePage(AutoShapes.SlideNum,AutoShapes.Document.Slides[AutoShapes.SlideNum]);
        
    };
    this.id=5;
}

function PreRotateState()
{
    this.OnMouseDown = function(AutoShapes, e, X, Y)
    {};
    this.OnMouseMove = function(AutoShapes, e, X, Y)
    {
        if(AutoShapes.Document.viewMode === true)
        {
            AutoShapes.ArrTrackObj = [];
            AutoShapes.preTrackArr = [];
            AutoShapes.ChangeState(new NullShapeState());
            return;
        }
        AutoShapes.ArrTrackObj = AutoShapes.preTrackArr;
        AutoShapes.preTrackArr = [];

        AutoShapes.DrawingDocument.StartTrackAutoshape();
        AutoShapes.ChangeState(new RotateState());
    };
    this.OnMouseUp = function(AutoShapes, e, X, Y)
    {
        AutoShapes.ArrTrackObj = [];
        AutoShapes.preTrackArr = [];
        AutoShapes.ChangeState(new NullShapeState());
    };
}


function RotateState()
{
    this.id=6;
    this.OnMouseDown = function(AutoShapes, e, X, Y)
    {
        AutoShapes.stX=X;
        AutoShapes.stY=Y;
    };
    
    this.OnMouseMove = function(AutoShapes, e, X, Y) {

        if(e.IsLocked)
        {
            var ang=AutoShapes.obj.GetAngle(X, Y);
            for(var i= 0, n = AutoShapes.ArrTrackObj.length; i < n; ++i) {

                var trackObject = AutoShapes.ArrTrackObj[i];
                trackObject.obj.rot = AutoShapes.ArrGlyph[trackObject.num].rot;
                trackObject.obj.Rotate(ang, e.ShiftKey);
            }
            AutoShapes.Document.DrawingDocument.m_oWordControl.OnUpdateOverlay(false);
        }
    };

    this.OnMouseUp = function(AutoShapes, e, X, Y)
    {

        var numRotateShapeInTrackArray = 0, trackObjects = AutoShapes.ArrTrackObj;
        for(var i = 0; i < trackObjects.length; ++i)
        {
            if(trackObjects[i].num == AutoShapes.NumEditShape)
            {
                numRotateShapeInTrackArray = i;
                break;
            }
        }
        if(trackObjects[numRotateShapeInTrackArray].obj.rot!=AutoShapes.ArrGlyph[AutoShapes.NumEditShape].rot)
        {
            History.Create_NewPoint();
            var glyphs = AutoShapes.ArrGlyph;
            AutoShapes.addHistorySelectedState();
            for(i=0; i<trackObjects.length; ++i)
            {
                var shape = glyphs[trackObjects[i].num];

                var historyData = {};
                historyData.old_rot = shape.rot;
                historyData.new_rot = trackObjects[i].obj.rot;
                historyData.undo_function = function(data)
                {
                    this.rot = data.old_rot;
                    this.Recalculate();
                    this.updateCursorTypes();
                };
                historyData.redo_function = function(data)
                {
                    this.rot = data.new_rot;
                    this.Recalculate();
                    this.updateCursorTypes();
                };
                History.Add(shape, historyData);

                shape.rot=trackObjects[i].obj.rot;
                shape.Recalculate();
                shape.updateCursorTypes();
                shape.calculateXfrm();
            }
        }

        AutoShapes.ArrTrackObj.length=0;
        AutoShapes.ChangeState(new NullShapeState());

        AutoShapes.Document.Document_UpdateUndoRedoState();
        AutoShapes.Document.DrawingDocument.EndTrackAutoShape();
        AutoShapes.Document.DrawingDocument.OnRecalculatePage(AutoShapes.SlideNum,AutoShapes.Document.Slides[AutoShapes.SlideNum]);
        
    }
}


function AddTextState()
{
    this.id=7;

    this.OnMouseDown = function(AutoShapes, e, X, Y) {

        AutoShapes.ChangeState(new NullShapeState());
        var oldObj = AutoShapes.obj;
        AutoShapes.State.OnMouseDown(AutoShapes, e, X, Y);
        if(AutoShapes.State.id!=7)
        {
            AutoShapes.Document.CurPos.Type = docpostype_Content;
            AutoShapes.Document.RecalculateCurPos();
            AutoShapes.Document.Document_UpdateSelectionState();
            if(oldObj && oldObj.graphicObject && typeof oldObj.graphicObject.Selection_Remove === "function")
                oldObj.graphicObject.Selection_Remove();
            oldObj.addTextFlag = false;
            if(oldObj.isEmptyPlaceholder())
            {
                AutoShapes.DrawingDocument.OnRecalculatePage(AutoShapes.SlideNum, AutoShapes.Document.Slides[ AutoShapes.SlideNum ]);
            }
        }
        /*else if(e.ClickCount == 2)
        {
            if( oldObj != AutoShapes.obj)
            {
                oldObj.addTextFlag = false;
                if(oldObj.isEmptyPlaceholder())
                {
                    AutoShapes.DrawingDocument.OnRecalculatePage(AutoShapes.SlideNum, AutoShapes.Document.Slides[ AutoShapes.SlideNum ]);
                }
            }
            //AutoShapes.obj.Select_All();
            var glyph = AutoShapes.obj;
            if(glyph.txBody && glyph.txBody.compiledBodyPr && glyph.txBody.compiledBodyPr.anchor)
            {
                var _vertical_align = glyph.txBody.compiledBodyPr.anchor;
                editor.sync_VerticalTextAlign(_vertical_align);

            }
        }   */
        else
        {
            if( oldObj != AutoShapes.obj)
            {
                if(oldObj && oldObj.graphicObject && typeof oldObj.graphicObject.Selection_Remove === "function")
                    oldObj.graphicObject.Selection_Remove();
                var glyph = AutoShapes.obj;
                if(glyph.txBody && glyph.txBody.compiledBodyPr && glyph.txBody.compiledBodyPr.anchor!=undefined)
                {
                    var _vertical_align = glyph.txBody.compiledBodyPr.anchor;
                    editor.sync_VerticalTextAlign(_vertical_align);
                }
                oldObj.addTextFlag = false;
                if(oldObj.isEmptyPlaceholder())
                {
                    AutoShapes.DrawingDocument.OnRecalculatePage(AutoShapes.SlideNum, AutoShapes.Document.Slides[ AutoShapes.SlideNum ]);
                }
            }
            //AutoShapes.Document.RecalculateCurPos();
        }
    };

    this.OnMouseMove = function(AutoShapes, e, X, Y)
    {
        if(!e.IsLocked)
        {
            var glyph = AutoShapes.obj;

            if( glyph.HitAdj(X, Y).hit )
            {
                AutoShapes.DrawingDocument.SetCursorType("crosshair");
                return;
            }

            var hit;
            hit=glyph.HitHandle(X, Y);
            if(hit.hit)
            {
                if(hit.num != 8)
                {
                    AutoShapes.DrawingDocument.SetCursorType(glyph.cursorTypes[hit.num]);
                }
                else
                {
                    AutoShapes.DrawingDocument.SetCursorType("crosshair");
                }
                return;
            }

            var glyphs = AutoShapes.ArrGlyph;
            for(var i = glyphs.length-1; i > -1; --i)
            {
                glyph = glyphs[i];
                var bHit = glyph.Hit(X, Y);
                var bInTextRect = glyph.InTextRect(X, Y);
                var bInBox = glyph.HitInBox(X, Y);
                if(bHit ||(/*glyph.text_flag&& TODO:*/ bInTextRect) ||(glyph.selected && bInBox))
                {
                    break;
                }
            }

            if(i>-1)
            {
                if( glyph.text_flag && bInTextRect && !glyph.HitInPath(X, Y) && !( glyph.selected && bInBox) )
                {
                    if(glyph instanceof  CGraphicFrame && glyph.graphicObject !== null && typeof glyph.graphicObject === "object"
                        && typeof glyph.graphicObject.Update_CursorType === "function")
                    {
                        glyph.graphicObject.Update_CursorType(X - glyph.pH, Y - glyph.pV, AutoShapes.SlideNum)
                    }
                    else
                    {
                        if(typeof glyph.Update_CursorType === "function")
                            glyph.Update_CursorType(X, Y);
                    }
                    return;
                }

                AutoShapes.DrawingDocument.SetCursorType("move");
                return;
            }
            else
            {
                AutoShapes.DrawingDocument.SetCursorType("default");
                return;
            }
        }

    };
    this.OnMouseUp = function(AutoShapes, e, X, Y)
    {
        AutoShapes.Document.Document_UpdateInterfaceState();
       //editor.WordControl.m_oLogicDocument.Document_Format_Paste();
    }
}


function SplineBezierState()
{
    this.OnMouseDown = function(AutoShapes, e, X, Y)
    {
        AutoShapes.resetState();
        AutoShapes.Document.CurPos.Type = docpostype_Content;
        AutoShapes.Document.RecalculateCurPos();
        AutoShapes.Document.Document_UpdateSelectionState();
        AutoShapes.Spline = new Spline(AutoShapes.Document.Slides[AutoShapes.SlideNum]);
        AutoShapes.Spline.path.push(new SplineCommandMoveTo(X, Y));
        AutoShapes.ChangeState(new SplineBezierState33(X, Y));
    };

    this.OnMouseMove = function(AutoShapes, e, X, Y)
    {
    };

    this.OnMouseUp = function(AutoShapes, e, X, Y)
    {
        AutoShapes.ChangeState(new NullShapeState());
        editor.sync_EndAddShape();
    };
}


function SplineBezierState33(startX, startY)
{
    this.startX = startX;
    this.startY = startY;

    this.OnMouseDown = function(AutoShapes, e, X, Y)
    {
    };

    this.OnMouseMove = function(AutoShapes, e, X, Y)
    {
        if(X == this.startX && Y === this.startY)
        {
            return;
        }
        AutoShapes.Spline.path.push(new SplineCommandLineTo(X, Y));
        AutoShapes.ChangeState(new SplineBezierState2());
        AutoShapes.Document.DrawingDocument.m_oWordControl.OnUpdateOverlay(false);
    };

    this.OnMouseUp = function(AutoShapes, e, X, Y)
    {
    };
}

function SplineBezierState2()
{
    this.OnMouseDown = function(AutoShapes, e, X, Y)
    {
        if(e.ClickCount == 2)
        {

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
        }
    };

    this.OnMouseMove = function(AutoShapes, e, X, Y)
    {
        AutoShapes.Spline.path[1].changePoint(X, Y);
        AutoShapes.Document.DrawingDocument.m_oWordControl.OnUpdateOverlay(false);
    };

    this.OnMouseUp = function(AutoShapes, e, X, Y)
    {
        if(e.ClickCount == 1 || e.ClickCount == 0)
        {
            AutoShapes.ChangeState(new SplineBezierState3(X, Y));
        }

    };
}

function SplineBezierState3(startX, startY)
{
    this.startX = startX;
    this.startY = startY;
    this.OnMouseDown = function(AutoShapes, e, X, Y)
    {
        if(e.ClickCount == 2)
        {

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

            AutoShapes.Add(shape);
            shape.Container = AutoShapes;
            AutoShapes.ArrTrackObj.length=0;
            AutoShapes.ChangeState(new NullShapeState());
            AutoShapes.DrawingDocument.EndTrackAutoShape();
            AutoShapes.DrawingDocument.OnRecalculatePage(AutoShapes.SlideNum, AutoShapes.Document.Slides[ AutoShapes.SlideNum ]);
            AutoShapes.obj=shape;
            AutoShapes.Spline = new Spline(AutoShapes.Document.Slides[AutoShapes.SlideNum]);

            AutoShapes.Document.Document_UpdateUndoRedoState();
            editor.sync_EndAddShape();
        }
    };

    this.OnMouseMove = function(AutoShapes, e, X, Y)
    {
        if(X== this.startX && Y == this.startY)
        {
            return;
        }
        var x0, y0, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6;
        x0 = AutoShapes.Spline.path[0].x;
        y0 = AutoShapes.Spline.path[0].y;
        x3 = AutoShapes.Spline.path[1].x;
        y3 = AutoShapes.Spline.path[1].y;
        x6 = X;
        y6 = Y;

        var vx = (x6 - x0)/6;
        var vy = (y6 - y0)/6;

        x2 = x3 - vx;
        y2 = y3 - vy;

        x4 = x3 + vx;
        y4 = y3 + vy;

        x1 = (x0 + x2)*0.5;
        y1 = (y0 + y2)*0.5;

        x5 = (x4 + x6)*0.5;
        y5 = (y4 + y6)*0.5;


        AutoShapes.Spline.path.length = 1;
        AutoShapes.Spline.path.push(new SplineCommandBezier(x1, y1, x2, y2, x3, y3));


        AutoShapes.Spline.path.push(new SplineCommandBezier(x4, y4, x5, y5, x6, y6));
        AutoShapes.Document.DrawingDocument.m_oWordControl.OnUpdateOverlay(false);
        AutoShapes.ChangeState(new SplineBezierState4());
    };

    this.OnMouseUp = function(AutoShapes, e, X, Y)
    {
        if(e.ClickCount == 2)
        {

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
        }
    };
}

function SplineBezierState4()
{
    this.OnMouseDown = function(AutoShapes, e, X, Y)
    {
        if(e.ClickCount == 2)
        {

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
        }
    };

    this.OnMouseMove = function(AutoShapes, e, X, Y)
    {
        var lastCommand = AutoShapes.Spline.path[AutoShapes.Spline.path.length-1];
        var preLastCommand = AutoShapes.Spline.path[AutoShapes.Spline.path.length-2];
        var x0, y0, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6;
        if(AutoShapes.Spline.path[AutoShapes.Spline.path.length-3].id == 0)
        {
            x0 = AutoShapes.Spline.path[AutoShapes.Spline.path.length-3].x;
            y0 = AutoShapes.Spline.path[AutoShapes.Spline.path.length-3].y;
        }
        else
        {
            x0 = AutoShapes.Spline.path[AutoShapes.Spline.path.length-3].x3;
            y0 = AutoShapes.Spline.path[AutoShapes.Spline.path.length-3].y3;
        }

        x3 = preLastCommand.x3;
        y3 = preLastCommand.y3;

        x6 = X;
        y6 = Y;

        var vx = (x6 - x0)/6;
        var vy = (y6 - y0)/6;

        x2 = x3 - vx;
        y2 = y3 - vy;

        x4 = x3 + vx;
        y4 = y3 + vy;

        x5 = (x4 + x6)*0.5;
        y5 = (y4 + y6)*0.5;

        if(AutoShapes.Spline.path[AutoShapes.Spline.path.length-3].id == 0)
        {
            preLastCommand.x1 = (x0 + x2)*0.5;
            preLastCommand.y1 = (y0 + y2)*0.5;
        }

        preLastCommand.x2 = x2;
        preLastCommand.y2 = y2;
        preLastCommand.x3 = x3;
        preLastCommand.y3 = y3;

        lastCommand.x1 = x4;
        lastCommand.y1 = y4;
        lastCommand.x2 = x5;
        lastCommand.y2 = y5;
        lastCommand.x3 = x6;
        lastCommand.y3 = y6;

        AutoShapes.Document.DrawingDocument.m_oWordControl.OnUpdateOverlay(false);
    };

    this.OnMouseUp = function(AutoShapes, e, X, Y)
    {
        if(e.ClickCount == 1 || e.ClickCount == 0)
        {
            AutoShapes.ChangeState(new SplineBezierState5(X, Y));
        }
    };
}

function SplineBezierState5(startX, startY)
{
    this.startX = startX;
    this.startY = startY;
    this.moveCount = 0;
    this.OnMouseDown = function(AutoShapes, e, X, Y)
    {
        if(e.ClickCount == 2)
        {

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
        }
    };

    this.OnMouseMove = function(AutoShapes, e, X, Y)
    {
        if(X == this.startX && Y == this.startY)
        {
            return;
        }
        var lastCommand = AutoShapes.Spline.path[AutoShapes.Spline.path.length-1];
        var x0, y0, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6;

        if(AutoShapes.Spline.path[AutoShapes.Spline.path.length-2].id == 0)
        {
            x0 = AutoShapes.Spline.path[AutoShapes.Spline.path.length-2].x;
            y0 = AutoShapes.Spline.path[AutoShapes.Spline.path.length-2].y;
        }
        else
        {
            x0 = AutoShapes.Spline.path[AutoShapes.Spline.path.length-2].x3;
            y0 = AutoShapes.Spline.path[AutoShapes.Spline.path.length-2].y3;
        }

        x3 = lastCommand.x3;
        y3 = lastCommand.y3;

        x6 = X;
        y6 = Y;

        var vx = (x6 - x0)/6;
        var vy = (y6 - y0)/6;


        x2 = x3 - vx;
        y2 = y3 - vy;

        x1 = (x2+x1)*0.5;
        y1 = (y2+y1)*0.5;

        x4 = x3 + vx;
        y4 = y3 + vy;

        x5 = (x4 + x6)*0.5;
        y5 = (y4 + y6)*0.5;

        if(AutoShapes.Spline.path[AutoShapes.Spline.path.length-2].id == 0)
        {
            lastCommand.x1 = x1;
            lastCommand.y1 = y1;
        }
        lastCommand.x2 = x2;
        lastCommand.y2 = y2;


        AutoShapes.Spline.path.push(new SplineCommandBezier(x4, y4, x5, y5, x6, y6));
        AutoShapes.Document.DrawingDocument.m_oWordControl.OnUpdateOverlay(false);
        AutoShapes.ChangeState(new SplineBezierState4());
    };

    this.OnMouseUp = function(AutoShapes, e, X, Y)
    {
        if(e.ClickCount == 2)
        {
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
        }
    };
}

//Состояния прия работе с полилиниями
function PolyLineAddState()
{
    this.OnMouseDown = function(AutoShapes, e, X, Y)
    {
        AutoShapes.PolyLine = new PolyLine(AutoShapes.Document.Slides[AutoShapes.SlideNum]);
        AutoShapes.PolyLine.arrPoint.push({x : X, y: Y});

        var _min_distance = AutoShapes.DrawingDocument.GetMMPerDot(1);
        AutoShapes.ChangeState(new PolyLineAddState2(_min_distance, X, Y));
        AutoShapes.DrawingDocument.StartTrackAutoshape();
    };
    this.OnMouseMove = function(AutoShapes, e, X, Y)
    {

    };
    this.OnMouseUp = function(AutoShapes, e, X, Y)
    {
        AutoShapes.ChangeState(new NullShapeState());
        AutoShapes.DrawingDocument.EndTrackAutoShape();
        AutoShapes.PolyLine = null;
        editor.sync_EndAddShape();
    };
}


function PolyLineAddState2(minDistance, X, Y)
{
    this.minDistance = minDistance;
    this.OnMouseDown = function(AutoShapes, e, X, Y)
    {
    };
    this.OnMouseMove = function(AutoShapes, e, X, Y)
    {
        var _last_point = AutoShapes.PolyLine.arrPoint[AutoShapes.PolyLine.arrPoint.length - 1];
        var dx = X - _last_point.x;
        var dy = Y - _last_point.y;

        if(Math.sqrt(dx*dx + dy*dy) >= this.minDistance)
        {
            AutoShapes.PolyLine.arrPoint.push({x : X, y : Y});
            AutoShapes.DrawingDocument.m_oWordControl.OnUpdateOverlay(false);
        }
    };
    this.OnMouseUp = function(AutoShapes, e, X, Y)
    {
        if(AutoShapes.PolyLine.arrPoint.length > 1)
        {
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
        }
        else
        {
            AutoShapes.ChangeState(new NullShapeState());
            AutoShapes.DrawingDocument.EndTrackAutoShape();
            AutoShapes.DrawingDocument.OnRecalculatePage(AutoShapes.SlideNum, AutoShapes.Document.Slides[ AutoShapes.SlideNum ]);
            AutoShapes.PolyLine = null;
            editor.asc_fireCallback("asc_onEndAddShape");
        }

    };
}



function AddPolyLine2State()
{
    this.OnMouseDown = function(AutoShapes, e, X, Y)
    {
        AutoShapes.PolyLine = new PolyLine(AutoShapes.Document.Slides[AutoShapes.SlideNum]);
        AutoShapes.PolyLine.arrPoint.push({x : X, y: Y});
        AutoShapes.DrawingDocument.StartTrackAutoshape();
        AutoShapes.ChangeState(new AddPolyLine2State2(X, Y));
    };

    this.OnMouseMove = function(AutoShapes, e, X, Y)
    {};

    this.OnMouseUp = function(AutoShapes, e, X, Y)
    {
    };
}


function AddPolyLine2State2(X, Y)
{
    this.X = X;
    this.Y = Y;
    this.OnMouseDown = function(AutoShapes, e, X, Y)
    {
        if(e.ClickCount > 1)
        {
            AutoShapes.ChangeState(new NullShapeState());
            AutoShapes.DrawingDocument.EndTrackAutoShape();
            AutoShapes.PolyLine = null;
            editor.sync_EndAddShape();
        }

    };

    this.OnMouseMove = function(AutoShapes, e, X, Y)
    {
        if(this.X !== X || this.Y !== Y)
        {
            AutoShapes.PolyLine.arrPoint.push({x : X, y: Y});
            AutoShapes.ChangeState(new AddPolyLine2State3(AutoShapes));
        }
    };

    this.OnMouseUp = function(AutoShapes, e, X, Y)
    {
    };
}

function AddPolyLine2State3(AutoShapes)
{
    this.minSize = AutoShapes.DrawingDocument.GetMMPerDot(1);
    this.OnMouseDown = function(AutoShapes, e, X, Y)
    {
        AutoShapes.PolyLine.arrPoint.push({x: X, y: Y});
        if(e.ClickCount > 1)
        {
            if(AutoShapes.PolyLine.arrPoint.length > 1)
            {
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
            }
            AutoShapes.PolyLine = null;
            editor.sync_EndAddShape();
        }
    };

    this.OnMouseMove = function(AutoShapes, e, X, Y)
    {
        if(!e.IsLocked)
        {
            AutoShapes.PolyLine.arrPoint[AutoShapes.PolyLine.arrPoint.length - 1] = {x: X, y: Y};
        }
        else
        {
            var _last_point = AutoShapes.PolyLine.arrPoint[AutoShapes.PolyLine.arrPoint.length - 1];
            var dx = X - _last_point.x;
            var dy = Y - _last_point.y;

            if(Math.sqrt(dx*dx + dy*dy) >= this.minSize)
            {
                AutoShapes.PolyLine.arrPoint.push({x: X, y: Y});
            }
        }
        AutoShapes.Document.DrawingDocument.m_oWordControl.OnUpdateOverlay(false);
    };

    this.OnMouseUp = function(AutoShapes, e, X, Y)
    {};
}


function AddPolyLine2State4()
{
    this.OnMouseDown = function(AutoShapes, e, X, Y)
    {
        if(e.ClickCount > 1)
        {
            AutoShapes.ChangeState(new NullShapeState());
            AutoShapes.DrawingDocument.EndTrackAutoShape();
            AutoShapes.PolyLine = null;
            editor.sync_EndAddShape();
        }
    };

    this.OnMouseMove = function(AutoShapes, e, X, Y)
    {};

    this.OnMouseUp = function(AutoShapes, e, X, Y)
    {
        AutoShapes.PolyLine.arrPoint.push({x : X, y: Y});
        AutoShapes.ChangeState(new AddPolyLine2State3());
    };
}
//состояния для работы сфигурами внутри групппы----------------------------------------------------------------------------------------------

function GroupState()
{
    this.id = 20;
    this.OnMouseDown =function(AutoShapes, e, X, Y)
    {
        AutoShapes.group.OnMouseDown( e, X, Y);
        AutoShapes.obj = AutoShapes.group.obj;
        if( AutoShapes.group.State.id == 0 )
        {
            AutoShapes.ChangeState(new NullShapeState());
            AutoShapes.State.OnMouseDown(AutoShapes, e, X, Y);
        }
    };
    this.OnMouseMove = function(AutoShapes, e, X, Y)
    {
        if(!e.IsLocked && (e.bStop === undefined || !e.bStop))
        {
            var glyph = AutoShapes.group;

            var hit;
            hit=glyph.HitHandle(X, Y);
            var bStop  = false;
            if(hit.hit)
            {
                if(hit.num != 8)
                {
                    AutoShapes.DrawingDocument.SetCursorType(glyph.cursorTypes[hit.num]);
                }
                else
                {
                    AutoShapes.DrawingDocument.SetCursorType("crosshair");
                }
                bStop = true;
            }

            var glyphs = AutoShapes.ArrGlyph;
            for(var i = glyphs.length-1; i > -1; --i)
            {
                glyph = glyphs[i];
                var bHit = glyph.Hit(X, Y);
                var bInTextRect = glyph.InTextRect(X, Y);
                var bInBox = glyph.HitInBox(X, Y);
                if(bHit ||(/*glyph.text_flag&& TODO:*/ bInTextRect) ||(glyph.selected && bInBox))
                {
                    break;
                }
            }

            if(i>-1)
            {
                if( glyph.text_flag && bInTextRect && !glyph.HitInPath(X, Y) && !( glyph.selected && bInBox) )
                {
                    if(glyph instanceof  CGraphicFrame && glyph.graphicObject !== null && typeof glyph.graphicObject === "object"
                        && typeof glyph.graphicObject.Update_CursorType === "function")
                    {
                        glyph.graphicObject.Update_CursorType(X - glyph.pH, Y - glyph.pV, AutoShapes.SlideNum)
                    }
                    else
                    {
                        AutoShapes.DrawingDocument.SetCursorType("text");
                    }
                }

                AutoShapes.DrawingDocument.SetCursorType("move");
                bStop = true;
            }

            if(!bStop)
            {
                if( glyph.HitInBox(X, Y))
                {

                    AutoShapes.DrawingDocument.SetCursorType("move");
                }
                else
                {
                       AutoShapes.DrawingDocument.SetCursorType("default");
                }
            }
            e.bStop = bStop;
        }
        AutoShapes.group.OnMouseMove( e, X, Y);
    };
    this.OnMouseUp = function(AutoShapes, e, X, Y)
    {
        AutoShapes.group.OnMouseUp(e, X, Y);
        var historyData = {};
        historyData.old_pH = AutoShapes.group.pH;
        historyData.old_pV = AutoShapes.group.pV;
        historyData.old_ext = clonePrototype(AutoShapes.group.ext);
        historyData.old_off = clonePrototype(AutoShapes.group.off);
        AutoShapes.group.RecalculateAfterResize();
        historyData.new_pH = AutoShapes.group.pH;
        historyData.new_pV = AutoShapes.group.pV;
        historyData.new_ext = clonePrototype(AutoShapes.group.ext);
        historyData.new_off = clonePrototype(AutoShapes.group.off);

        historyData.undo_function = function(data)
        {
            this.pH = data.old_pH;
            this.pV = data.old_pV;
            this.ext = clonePrototype(data.old_ext);
            this.off = clonePrototype(data.old_off);
            this.RecalculateTransformMatrix();
        };

        historyData.redo_function = function(data)
        {
            this.pH = data.new_pH;
            this.pV = data.new_pV;
            this.ext = clonePrototype(data.new_ext);
            this.off = clonePrototype(data.new_off);
            this.RecalculateTransformMatrix();
        };

        History.Add(AutoShapes.group, historyData);
        AutoShapes.obj = AutoShapes.group.obj;
        if(AutoShapes.group.NumSelected==0)
        {
            AutoShapes.ChangeState(new NullShapeState());
        }
    };
}


function NullStateGroup()
{
    this.OnMouseDown = function(AutoShapes, e, X, Y)
    {};

    this.OnMouseMove = function(AutoShapes, e, X, Y)
    {};
    this.OnMouseUp = function(AutoShapes, e, X, Y)
    {};
}