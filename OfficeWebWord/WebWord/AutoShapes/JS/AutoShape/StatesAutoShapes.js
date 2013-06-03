var historyitem_Shape_Add=0,
    historyitem_Shape_Move=1,
    historyitem_Shape_Copy=2,
    historyitem_Shape_Resize=3,
    historyitem_Shape_ChangeAdj=4,
    historyitem_Shape_Rotate=5,
    historyitem_Shape_Del=6,
    historyitem_Shape_Rotate_InGroup=7,
    historyitem_Shape_Group=8,
    historyitem_Shape_UnGroup=9,
    historyitem_Shape_SetProperties=30;

function NullShapeState()
{
    this.id=0;
    this.OnMouseDown = function(AutoShapes, e, X, Y, PageIndex)
    {
        AutoShapes.stX=X;
        AutoShapes.stY=Y;
        if(e.ClickCount==1)
        {
            if(AutoShapes.NumSelected>0)
            {
                if(AutoShapes.NumSelected==1)
                {
                    var i=AutoShapes.ArrGlyph.length-1;
                    while(!AutoShapes.Selected[i])
                        --i;
                    var hit=AutoShapes.ArrGlyph[i].HitAdj(X, Y);
                    if(hit.hit)
                    {
                        AutoShapes.ArrTrackObj.length=0;
                        AutoShapes.obj=AutoShapes.ArrGlyph[i];
                        AutoShapes.ArrTrackObj.push({obj:clone(AutoShapes.ArrGlyph[i]), hit: hit, num:i});
                        if(hit.type==xy)
                            AutoShapes.ArrTrackObj[0].obj.CalculateAdjRange(hit.num);
                        else
                            AutoShapes.ArrTrackObj[0].obj.CalculateAdjPolarRangeR(hit.num);
                        AutoShapes.NumEditShape=i;
                        AutoShapes.ChangeState(new ChangeAdjState());
                        return;
                    }
                }
                hit = {hit: false};
                for(i=AutoShapes.ArrGlyph.length-1; i>-1; i--)
                {
                    if(AutoShapes.Selected[i])
                        hit=AutoShapes.ArrGlyph[i].HitHandle(X, Y);
                    if(hit.hit)
                            break;
                }
                if(i>-1)
                {
                    if(hit.num!=8)
                    {
                        var card_dir=AutoShapes.ArrGlyph[i].NumToCardDir(hit.num);
                        AutoShapes.NumHResize=hit.num;
                        AutoShapes.obj=AutoShapes.ArrGlyph[i];
                        AutoShapes.NumEditShape=i;

                        AutoShapes.ArrTrackObj.length=0;
                        for(j=0; j<AutoShapes.ArrGlyph.length; j++)
                        {
                            if(AutoShapes.Selected[j])
                            {
                                AutoShapes.ArrTrackObj.push({
                                    obj: clone(AutoShapes.ArrGlyph[j]),
                                    num_h: AutoShapes.ArrGlyph[j].CardDirToNum(card_dir),
                                    num: j
                                });
                                if(i==j)
                                    AutoShapes.NumEditShape=AutoShapes.ArrTrackObj.length-1;
                            }

                        }
                        AutoShapes.ChangeState(new ResizeGroupObjState());
                        return;
                    }
                    else
                    {
                        AutoShapes.ArrTrackObj.length=0;
                        AutoShapes.obj=AutoShapes.ArrGlyph[i];
                        for(j=0; j<AutoShapes.ArrGlyph.length;j++)
                            if(AutoShapes.Selected[j])
                                AutoShapes.ArrTrackObj.push({obj: clone(AutoShapes.ArrGlyph[j]), num:j});
                        AutoShapes.ChangeState(new RotateState());
                        AutoShapes.NumEditShape=i;
                        return;
                    }
                }
            }

            for(i=AutoShapes.ArrGlyph.length-1; i>-1; i--)
                if(AutoShapes.ArrGlyph[i].Hit(X, Y) ||(AutoShapes.ArrGlyph[i].text_flag&&AutoShapes.ArrGlyph[i].InTextRect(X, Y))
                    ||(AutoShapes.Selected[i]&&AutoShapes.ArrGlyph[i].HitInBox(X, Y)))
                    break;
            if(i>-1)
            {
                if(AutoShapes.ArrGlyph[i].text_flag&&AutoShapes.ArrGlyph[i].InTextRect(X, Y)&& !AutoShapes.ArrGlyph[i].HitInPath(X, Y))
                {
                    AutoShapes.obj=AutoShapes.ArrGlyph[i];
                    AutoShapes.NumEditShape=i;
                    AutoShapes.ChangeState(new AddTextState());
                    AutoShapes.Document.CurPos.Type=docpostype_FlowShape;

                    for(var p=0; p<AutoShapes.Selected.length; p++)
                        AutoShapes.Selected[p]=false;
                    AutoShapes.Selected[i]=true;
                    AutoShapes.NumSelected=1;
                        AutoShapes.Document.DrawingDocument.OnRecalculatePage( 0, AutoShapes.Document.Pages[0] );
                    return;
                }
                if(e.CtrlKey)
                {
                    if(!AutoShapes.Selected[i])
                    {
                        AutoShapes.NumSelected++;
                        AutoShapes.Selected[i]=true;
                        AutoShapes.SelectGroup=false;
                    }
                    else
                    {
                        AutoShapes.SelectGroup=AutoShapes.ArrGlyph[i].IsGroup();
                        AutoShapes.NumSelected--;
                        AutoShapes.Selected[i]=false;
                    }
                }
                else
                {
                    if(!AutoShapes.Selected[i])
                    {
                        for(var j=0; j<AutoShapes.Selected.length; j++)
                            AutoShapes.Selected[j]=false;

                        var shp=AutoShapes.ArrGlyph[i];
                        var shapeProp={};
                        shapeProp=
                        {
                            Position:
                            {
                                Left:shp.pH,
                                Top: shp.pV
                            },
                            Offset:
                            {
                                X: shp.off.x,
                                Y: shp.off.y
                            },
                            Rect:
                            {
                                Height:shp.ext.cx,
                                Width:shp.ext.cy
                            },
                            Rotation: shp.rot,
                            FlipH: shp.flipH,
                            FlipV: shp.flipV,
                            Shadow:
                            {
                                Color : { r : shp.shadow.color.r, g : shp.shadow.color.g, b : shp.shadow.color.b },
                                Length: shp.shadow.length,
                                Angle: shp.shadow.color.angle,
                                Alpha: shp.shadow.color.alpha
                            },
                            Alpha: shp.alpha,
                            Color : { r : shp.fill_color.r, g : shp.fill_color.g, b : shp.fill_color.b },
                            Line:
                            {
                                Color : { r : shp.line_color.r, g : shp.line_color.g, b : shp.line_color.b },
                                Width:shp.line_width
                            }
                        };
                        editor.sync_BeginCatchSelectedElements();
                        editor.sync_shapePropCallback(shapeProp);
                        editor.sync_EndCatchSelectedElements();

                        AutoShapes.Selected[i]=true;
                        AutoShapes.NumSelected=1;
                        AutoShapes.SelectGroup=false;
                    }
                    else
                        AutoShapes.SelectGroup=AutoShapes.ArrGlyph[i].IsGroup();

                    AutoShapes.ArrTrackObj.length=0;
                    for(j=0; j<AutoShapes.ArrGlyph.length; j++)
                    {
                        if(AutoShapes.Selected[j])
                            AutoShapes.ArrTrackObj.push({
                                obj:clone(AutoShapes.ArrGlyph[j]),
                                stX: AutoShapes.ArrGlyph[j].pH,
                                stY: AutoShapes.ArrGlyph[j].pV,
                                num:j
                            });
                        if(i==j)
                            AutoShapes.NumEditShape=AutoShapes.ArrTrackObj.length-1;
                    }
                }
                AutoShapes.DrawingDocument.OnRecalculatePage( 0, AutoShapes.Document.Pages[0] );
                AutoShapes.obj = AutoShapes.ArrGlyph[i];

                if(AutoShapes.obj.IsGroup())
                    AutoShapes.NumGroup=i;
                AutoShapes.ChangeState(new MoveState());
                return;
            }
            else
            {
                for(j=0; j<AutoShapes.ArrGlyph.length; j++)
                    AutoShapes.Selected[j]=false;
                AutoShapes.NumSelected=0;
                AutoShapes.DrawingDocument.OnRecalculatePage( 0, AutoShapes.Document.Pages[0] );
                return;
            }
        }
        else if(e.ClickCount==2)
        {
            for(i=AutoShapes.ArrGlyph.length-1; i>-1; i--)
                if(AutoShapes.ArrGlyph[i].Hit(X, Y)||(AutoShapes.ArrGlyph[i].InTextRect(X, Y)&& !AutoShapes.ArrGlyph[i].HitInPath(X, Y)))
                    break;
            if(i>-1)
            {
                if(AutoShapes.ArrGlyph[i].text_flag&&AutoShapes.ArrGlyph[i].InTextRect(X, Y)&& !AutoShapes.ArrGlyph[i].HitInPath(X, Y))
                {
                    AutoShapes.obj=AutoShapes.ArrGlyph[i];
                    AutoShapes.NumEditShape=i;
                    AutoShapes.ChangeState(new AddTextState());
                    AutoShapes.Document.CurPos.Type=docpostype_FlowShape;

                    for(p=0; p<AutoShapes.Selected.length; p++)
                        AutoShapes.Selected[p]=false;
                    AutoShapes.Selected[i]=true;
                    AutoShapes.NumSelected=1;
                        AutoShapes.Document.DrawingDocument.OnRecalculatePage( 0, AutoShapes.Document.Pages[0] );
                }
            }
        }
    };

    this.OnMouseMove = function(AutoShapes, e, X, Y, PageIndex)
    {
        return;
    };

    this.OnMouseUp=function(AutoShapes, e, X, Y, PageIndex)
    {
        return;
    };
}


function ShapeAddState()
{
    this.id=1;
    this.OnMouseDown = function(AutoShapes, e, X, Y, PageIndex)
    {
        AutoShapes.stX=X;
        AutoShapes.stY=Y;

        var shape;
        shape=new CShape(AutoShapes.DrawingDocument, AutoShapes.Document);
        shape.Init(AutoShapes.CurPreset, X, Y, {x:0, y:0}, {cx:1, cy: 1});

        AutoShapes.ArrTrackObj.length=0;
        AutoShapes.ArrTrackObj.push({obj:shape});
        AutoShapes.ChangeState(new TrackNewShapeState());
    };
    
    this.OnMouseMove = function(AutoShapes, e, X, Y, PageIndex)
    {
    };
    
    this.OnMouseUp =function(AutoShapes, e, X, Y, PageIndex)
    {
    }
}

function TrackNewShapeState()
{
    this.id=2;
    this.OnMouseDown = function(AutoShapes, e, X, Y, PageIndex)
    {
        AutoShapes.stX=X;
        AutoShapes.stY=Y;
    };
    this.OnMouseMove = function(AutoShapes, e, X, Y, PageIndex)
    {
        if(e.IsLocked)
        {
            var dx=0, dy=0, i, j;
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
            if(!AutoShapes.ArrTrackObj[0].obj.isLine)
            {
                if(e.CtrlKey)
                {
                    if(X>AutoShapes.stX)
                    {
                        if(DX>min_size2)
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
                        if(DX<-min_size2)
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
                    if(Y>AutoShapes.stY)
                    {
                        if(DY>min_size2)
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
                        if(DY<-min_size2)
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
                        if(DX>min_size2)
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
                        if(DX<-min_size2)
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
                        if(DY>min_size2)
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
                        if(DY<-min_size2)
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
            AutoShapes.ArrTrackObj[0].obj.Recalculate();
            AutoShapes.DrawingDocument.OnRecalculatePage( 0, AutoShapes.Document.Pages[0] );
        }
    };
    this.OnMouseUp =function(AutoShapes, e, X, Y, PageIndex)
    {
        if(AutoShapes.stX==X && AutoShapes.stY==Y)
        {
            AutoShapes.ArrTrackObj[0].obj.ext={cx:60, cy:60};
            AutoShapes.ArrTrackObj[0].obj.Recalculate();
        }
        var shape=AutoShapes.ArrTrackObj[0].obj;
        History.Create_NewPoint();
        History.Add(shape, {Type: historyitem_Shape_Add, num: AutoShapes.ArrGlyph.length, select:true});
        AutoShapes.Add(shape);
        shape.Container=AutoShapes;
        AutoShapes.ArrTrackObj.length=0;
        AutoShapes.ChangeState(new NullShapeState());


        AutoShapes.obj=shape;
        var shp=shape;
        var shapeProp={};
        shapeProp=
        {
            Position:
            {
                Left:shp.pH,
                Top: shp.pV
            },
            Offset:
            {
                X: shp.off.x,
                Y: shp.off.y
            },
            Rect:
            {
                Height:shp.ext.cx,
                Width:shp.ext.cy
            },
            Rotation: shp.rot,
            FlipH: shp.flipH,
            FlipV: shp.flipV,
            Shadow:
            {
                Color : { r : shp.shadow.color.r, g : shp.shadow.color.g, b : shp.shadow.color.b },
                Length: shp.shadow.length,
                Angle: shp.shadow.color.angle,
                Alpha: shp.shadow.color.alpha
            },
            Alpha: shp.alpha,
            Color : { r : shp.fill_color.r, g : shp.fill_color.g, b : shp.fill_color.b },
            Line:
            {
                Color : { r : shp.line_color.r, g : shp.line_color.g, b : shp.line_color.b },
                Width:shp.line_width
            }
        };
        editor.sync_BeginCatchSelectedElements();
        editor.sync_shapePropCallback(shapeProp);
        editor.sync_EndCatchSelectedElements();
    };
}


function ResizeGroupObjState()
{
    this.OnMouseDown = function (AutoShapes, e, X, Y, PageIndex)
    {
        AutoShapes.stX=X;
        AutoShapes.stY=Y;
    };
    
    this.OnMouseMove = function (AutoShapes, e, X, Y, PageIndex)
    {
        var dx=0, dy=0, i, j;
        for(i=0; i<AutoShapes.ArrGlyph.length; i++)
        {
            dx=JoinedPointH(X, AutoShapes.ArrGlyph[i]);
            if(dx>0)
                break;
            if(AutoShapes.ArrGlyph[i].IsGroup())
            {
                for(j=0; j<AutoShapes.ArrGlyph[i].ArrGlyph.length; ++j)
                {
                    dx=JoinedPointH(X, AutoShapes.ArrGlyph[i].ArrGlyph[j]);
                    if(dx>0)
                        break;
                }
            }
            if(dx>0)
                break;
        }
        for(i=0; i<AutoShapes.ArrGlyph.length; i++)
        {
            dy=JoinedPointV(Y, AutoShapes.ArrGlyph[i]);
            if(dy>0)
                break;
            if(AutoShapes.ArrGlyph[i].IsGroup())
            {
                for(j=0; j<AutoShapes.ArrGlyph[i].ArrGlyph.length; ++j)
                {
                    dy=JoinedPointV(Y, AutoShapes.ArrGlyph[i].ArrGlyph[j]);
                    if(dy>0)
                        break;
                }
            }
            if(dy>0)
                break;
        }

        var K=AutoShapes.obj.DefineResizeCoef(AutoShapes.NumHResize, X-dx, Y-dy);
        for(i=0; i<AutoShapes.ArrTrackObj.length; ++i)
        {
            AutoShapes.ArrTrackObj[i].obj=clone(AutoShapes.ArrGlyph[AutoShapes.ArrTrackObj[i].num]);
            if(!e.CtrlKey)
                AutoShapes.ArrTrackObj[i].obj.Resize(AutoShapes.ArrTrackObj[i].num_h, K.kd1, K.kd2);
            else
                AutoShapes.ArrTrackObj[i].obj.ResizeRelativeCenter(AutoShapes.ArrTrackObj[i].num_h, K.kd1, K.kd2);
        }
        AutoShapes.DrawingDocument.OnRecalculatePage( 0, AutoShapes.Document.Pages[0] )
    };
    
    this.OnMouseUp = function (AutoShapes, e, X, Y, PageIndex)
    {
        var i, j;
        History.Create_NewPoint();
        var t;
        for(i=0; i<AutoShapes.ArrTrackObj.length; i++)
        {
            t=AutoShapes.ArrGlyph[AutoShapes.ArrTrackObj[i].num];
            History.Add(t, {Type: historyitem_Shape_Resize,
                pH: t.pH,
                pV: t.pV,
                off: clone(t.off),
                ext: clone(t.ext),
                flipH: t.flipH,
                flipV: t.flipV,
                new_pH: AutoShapes.ArrTrackObj[i].obj.pH,
                new_pV: AutoShapes.ArrTrackObj[i].obj.pV,
                new_off: clone(AutoShapes.ArrTrackObj[i].obj.off),
                new_ext: clone(AutoShapes.ArrTrackObj[i].obj.ext),
                new_flipH: AutoShapes.ArrTrackObj[i].obj.flipH,
                new_flipV: AutoShapes.ArrTrackObj[i].obj.flipV
            });
            t.pH=AutoShapes.ArrTrackObj[i].obj.pH;
            t.pV=AutoShapes.ArrTrackObj[i].obj.pV;
            t.off=AutoShapes.ArrTrackObj[i].obj.off;
            t.ext=AutoShapes.ArrTrackObj[i].obj.ext;
            t.flipH=AutoShapes.ArrTrackObj[i].obj.flipH;
            t.flipV=AutoShapes.ArrTrackObj[i].obj.flipV;
            if(t.IsGroup())
            {
                for(j=0; j<t.ArrGlyph.length; ++j)
                {
                    History.Add(t.ArrGlyph[j],{Type: historyitem_Shape_Resize,
                        pH: t.ArrGlyph[j].pH,
                        pV: t.ArrGlyph[j].pV,
                        off: clone(t.ArrGlyph[j].off),
                        ext: clone(t.ArrGlyph[j].ext),
                        flipH: t.ArrGlyph[j].flipH,
                        flipV: t.ArrGlyph[j].flipV,
                        new_pH: AutoShapes.ArrTrackObj[i].obj.ArrGlyph[j].pH,
                        new_pV: AutoShapes.ArrTrackObj[i].obj.ArrGlyph[j].pV,
                        new_off: clone(AutoShapes.ArrTrackObj[i].obj.ArrGlyph[j].off),
                        new_ext: clone(AutoShapes.ArrTrackObj[i].obj.ArrGlyph[j].ext),
                        new_flipH: AutoShapes.ArrTrackObj[i].obj.ArrGlyph[j].flipH,
                        new_flipV: AutoShapes.ArrTrackObj[i].obj.ArrGlyph[j].flipV
                    });
                    t.ArrGlyph[j].pH=AutoShapes.ArrTrackObj[i].obj.ArrGlyph[j].pH;
                    t.ArrGlyph[j].pV=AutoShapes.ArrTrackObj[i].obj.ArrGlyph[j].pV;
                    t.ArrGlyph[j].off=AutoShapes.ArrTrackObj[i].obj.ArrGlyph[j].off;
                    t.ArrGlyph[j].ext=AutoShapes.ArrTrackObj[i].obj.ArrGlyph[j].ext;
                    t.ArrGlyph[j].flipH=AutoShapes.ArrTrackObj[i].obj.ArrGlyph[j].flipH;
                    t.ArrGlyph[j].flipV=AutoShapes.ArrTrackObj[i].obj.ArrGlyph[j].flipV;
                }
            }
            t.Recalculate();
        }
        AutoShapes.ArrTrackObj.length=0;
        AutoShapes.ChangeState(new NullShapeState());

        var shp=AutoShapes.obj;
        var shapeProp={};
        shapeProp=
        {
            Position:
            {
                Left:shp.pH,
                Top: shp.pV
            },
            Offset:
            {
                X: shp.off.x,
                Y: shp.off.y
            },
            Rect:
            {
                Height:shp.ext.cx,
                Width:shp.ext.cy
            },
            Rotation: shp.rot,
            FlipH: shp.flipH,
            FlipV: shp.flipV,
            Shadow:
            {
                Color : { r : shp.shadow.color.r, g : shp.shadow.color.g, b : shp.shadow.color.b },
                Length: shp.shadow.length,
                Angle: shp.shadow.color.angle,
                Alpha: shp.shadow.color.alpha
            },
            Alpha: shp.alpha,
            Color : { r : shp.fill_color.r, g : shp.fill_color.g, b : shp.fill_color.b },
            Line:
            {
                Color : { r : shp.line_color.r, g : shp.line_color.g, b : shp.line_color.b },
                Width:shp.line_width
            }
        };
        editor.sync_BeginCatchSelectedElements();
        editor.sync_shapePropCallback(shapeProp);
        editor.sync_EndCatchSelectedElements();
    }
}


function ChangeAdjState()
{
    this.id=4;

    this.OnMouseDown = function(AutoShapes, e, X, Y, PageIndex)
    {
        AutoShapes.stX=X;
        AutoShapes.stY=Y;
    };

    this.OnMouseMove =  function(AutoShapes, e, X, Y, PageIndex)
    {
        AutoShapes.ArrTrackObj[0].obj=clone(AutoShapes.obj);
        if(AutoShapes.ArrTrackObj[0].hit.type==xy)
        {
            AutoShapes.ArrTrackObj[0].obj.CalculateAdjRange(AutoShapes.ArrTrackObj[0].hit.num);
            AutoShapes.ArrTrackObj[0].obj.ChangeAdjXY(AutoShapes.ArrTrackObj[0].hit.num, X, Y);
        }
        else
        {
            AutoShapes.ArrTrackObj[0].obj.CalculateAdjPolarRangeR(AutoShapes.ArrTrackObj[0].hit.num);
            AutoShapes.ArrTrackObj[0].obj.ChangeAdjPolar(AutoShapes.ArrTrackObj[0].hit.num, X, Y);
        }
        AutoShapes.DrawingDocument.OnRecalculatePage( 0, AutoShapes.Document.Pages[0] );
    };

    this.OnMouseUp =  function(AutoShapes, e, X, Y, PageIndex)
    {
        var t=AutoShapes.ArrGlyph[AutoShapes.ArrTrackObj[0].num], hit=AutoShapes.ArrTrackObj[0].hit, t2=AutoShapes.ArrTrackObj[0].obj;
        History.Create_NewPoint();
        History.Add(t, {Type: historyitem_Shape_ChangeAdj,
            gdRef1: hit.type==xy ? t.geometry.ahXYLst[hit.num].gdRefX : t.geometry.ahPolarLst[hit.num].gdRefR,
            val1: hit.type==xy ? t.geometry.gdLst[t.geometry.ahXYLst[hit.num].gdRefX] :  t.geometry.gdLst[t.geometry.ahPolarLst[hit.num].gdRefR],
            gdRef2: hit.type==xy ? t.geometry.ahXYLst[hit.num].gdRefY : t.geometry.ahPolarLst[hit.num].gdRefAng,
            val2:  hit.type==xy ? t.geometry.gdLst[t.geometry.ahXYLst[hit.num].gdRefY] :  t.geometry.gdLst[t.geometry.ahPolarLst[hit.num].gdRefAng],

            new_val1: hit.type==xy ? t2.geometry.gdLst[t.geometry.ahXYLst[hit.num].gdRefX] :  t2.geometry.gdLst[t.geometry.ahPolarLst[hit.num].gdRefR],
            new_val2:  hit.type==xy ? t2.geometry.gdLst[t.geometry.ahXYLst[hit.num].gdRefY] :  t2.geometry.gdLst[t.geometry.ahPolarLst[hit.num].gdRefAng]
        });
        if(hit.type==xy)
        {
            t.CalculateAdjRange(hit.num);
            t.ChangeAdjXY(AutoShapes.ArrTrackObj[0].hit.num, X, Y);
        }
        else
        {
            t.CalculateAdjPolarRangeR(hit.num);
            t.ChangeAdjPolar(hit.num, X, Y);
        }
        AutoShapes.ArrTrackObj.length=0;
        AutoShapes.ChangeState(new NullShapeState());
    }
}


function MoveState()
{
    this.OnMouseDown = function(AutoShapes, e, X, Y, PageIndex)
    {
        AutoShapes.stX=X;
        AutoShapes.stY=Y;
    };
    
    this.OnMouseMove =  function(AutoShapes, e, X, Y, PageIndex)
    {
        if(e.IsLocked)
        {
            var DX, DY;
            var dx=0, dy=0, i, j;
            DX=X-AutoShapes.stX;
            DY=Y-AutoShapes.stY;
            for( i=0; i<AutoShapes.ArrTrackObj.length; i++)
                AutoShapes.ArrTrackObj[i].obj.Move(AutoShapes.ArrTrackObj[i].stX+DX, AutoShapes.ArrTrackObj[i].stY+DY);

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
            
            for(i=0; i<AutoShapes.ArrTrackObj.length; i++)
            {
                AutoShapes.ArrTrackObj[i].obj.Move(AutoShapes.ArrTrackObj[i].stX+DX-dx, AutoShapes.ArrTrackObj[i].stY+DY-dy);
            }
            AutoShapes.DrawingDocument.OnRecalculatePage( 0, AutoShapes.Document.Pages[0] );
        }
    };
    
    this.OnMouseUp = function(AutoShapes, e, X, Y, PageIndex)
    {
        if(X==AutoShapes.stX&&Y==AutoShapes.stY && AutoShapes.obj.IsGroup() && AutoShapes.NumSelected==1 &&AutoShapes.SelectGroup)
        {
            AutoShapes.group=AutoShapes.obj;
            AutoShapes.ArrTrackObj.length=0;

            AutoShapes.ChangeState(new GroupState());

            AutoShapes.group.State.OnMouseDown(AutoShapes.group, e, X, Y, PageIndex);
            AutoShapes.group.State.OnMouseUp(AutoShapes.group, e, X, Y, PageIndex);
            AutoShapes.obj=AutoShapes.group.obj;
            return;
        }
        History.Create_NewPoint();
        if(e.CtrlKey)
        {
            var obj={};
            obj.Type= historyitem_Shape_Copy;
            obj.lenArr= AutoShapes.ArrGlyph.length;
            var shapes=[];
            for(var i=0; i<AutoShapes.ArrTrackObj.length; i++)
            {
                if(!AutoShapes.ArrTrackObj[i].obj.IsGroup())
                {
                    AutoShapes.ArrTrackObj[i].obj.DocumentContent=cloneDC(AutoShapes.ArrGlyph[AutoShapes.ArrTrackObj[i].num].DocumentContent);
                    AutoShapes.ArrTrackObj[i].obj.Recalculate();
                }
                else
                {
                    for(var j=0; j<AutoShapes.ArrTrackObj[i].obj.ArrGlyph.length;++j )
                    {
                        AutoShapes.ArrTrackObj[i].obj.ArrGlyph[j].DocumentContent=cloneDC(AutoShapes.ArrGlyph[AutoShapes.ArrTrackObj[i].num].ArrGlyph[j].DocumentContent);
                        AutoShapes.ArrTrackObj[i].obj.ArrGlyph[j].Recalculate();
                    }
                }
                History.Add(AutoShapes.ArrTrackObj[i].obj, {Type: historyitem_Shape_Add, num: AutoShapes.ArrGlyph.length, select:true});
                AutoShapes.ArrGlyph.push(AutoShapes.ArrTrackObj[i].obj);
                AutoShapes.Selected.push(true);
            }
            obj.shapes=shapes;
            History.Add(AutoShapes, obj);
            AutoShapes.NumSelected+=AutoShapes.ArrTrackObj.length;
        }
        else
        {
            for(i=0; i<AutoShapes.ArrTrackObj.length; i++)
            {
                var t=AutoShapes.ArrGlyph[AutoShapes.ArrTrackObj[i].num];
                History.Add(t, {Type: historyitem_Shape_Move,
                    pH: t.pH,
                    pV: t.pV,
                    new_pH: AutoShapes.ArrTrackObj[i].obj.pH,
                    new_pV: AutoShapes.ArrTrackObj[i].obj.pV
                });

                t.pH=AutoShapes.ArrTrackObj[i].obj.pH;
                t.pV=AutoShapes.ArrTrackObj[i].obj.pV;
                
                if(t.IsGroup())
                {
                    for(j=0; j<t.ArrGlyph.length; ++j)
                    {
                        History.Add(t.ArrGlyph[j], {Type: historyitem_Shape_Move,
                            pH: t.ArrGlyph[j].pH,
                            pV: t.ArrGlyph[j].pV,
                            new_pH: AutoShapes.ArrTrackObj[i].obj.ArrGlyph[j].pH,
                            new_pV: AutoShapes.ArrTrackObj[i].obj.ArrGlyph[j].pV
                        });
                        t.ArrGlyph[j].pH=AutoShapes.ArrTrackObj[i].obj.ArrGlyph[j].pH;
                        t.ArrGlyph[j].pV=AutoShapes.ArrTrackObj[i].obj.ArrGlyph[j].pV;
                    }
                }
                t.Recalculate();
            }
        }
        AutoShapes.ArrTrackObj.length=0;
        AutoShapes.ChangeState(new NullShapeState());

        var shp=AutoShapes.obj;
        var shapeProp={};
        shapeProp=
        {
            Position:
            {
                Left:shp.pH,
                Top: shp.pV
            },
            Offset:
            {
                X: shp.off.x,
                Y: shp.off.y
            },
            Rect:
            {
                Height:shp.ext.cx,
                Width:shp.ext.cy
            },
            Rotation: shp.rot,
            FlipH: shp.flipH,
            FlipV: shp.flipV,
            Shadow:
            {
                Color : { r : shp.shadow.color.r, g : shp.shadow.color.g, b : shp.shadow.color.b },
                Length: shp.shadow.length,
                Angle: shp.shadow.color.angle,
                Alpha: shp.shadow.color.alpha
            },
            Alpha: shp.alpha,
            Color : { r : shp.fill_color.r, g : shp.fill_color.g, b : shp.fill_color.b },
            Line:
            {
                Color : { r : shp.line_color.r, g : shp.line_color.g, b : shp.line_color.b },
                Width:shp.line_width
            }
        };
        editor.sync_BeginCatchSelectedElements();
        editor.sync_shapePropCallback(shapeProp);
        editor.sync_EndCatchSelectedElements();
    };
    this.id=5;
}


function RotateState()
{
    this.id=6;
    this.OnMouseDown = function(AutoShapes, e, X, Y, PageIndex)
    {
        AutoShapes.stX=X;
        AutoShapes.stY=Y;
        return;
    };
    
    this.OnMouseMove = function(AutoShapes, e, X, Y, PageIndex)
    {
        if(e.IsLocked)
        {
            var ang=AutoShapes.obj.GetAngle(X, Y);
            for(var i=0; i<AutoShapes.ArrTrackObj.length; i++)
            {
                AutoShapes.ArrTrackObj[i].obj=clone(AutoShapes.ArrGlyph[AutoShapes.ArrTrackObj[i].num]);
                AutoShapes.ArrTrackObj[i].obj.Rotate(ang, e.ShiftKey);
            }
            AutoShapes.DrawingDocument.OnRecalculatePage( 0, AutoShapes.Document.Pages[0] );
        }
    };

    this.OnMouseUp = function(AutoShapes, e, X, Y, PageIndex)
    {
        History.Create_NewPoint();
        for(var i=0; i<AutoShapes.ArrTrackObj.length; i++)
        {
            var t=AutoShapes.ArrGlyph[AutoShapes.ArrTrackObj[i].num];
            History.Add(t, {Type: historyitem_Shape_Rotate, rot: t.rot, new_rot: AutoShapes.ArrTrackObj[i].obj.rot});
            t.rot=AutoShapes.ArrTrackObj[i].obj.rot;
            if(t.IsGroup())
            {
                for(var j=0; j<t.ArrGlyph.length; ++j)
                {
                    History.Add(t.ArrGlyph[j], {Type: historyitem_Shape_Rotate_InGroup,
                        rot: t.ArrGlyph[j].rot,
                        new_rot: AutoShapes.ArrTrackObj[i].obj.ArrGlyph[j].rot,

                        pH: t.ArrGlyph[j].pH,
                        pV: t.ArrGlyph[j].pV,

                        new_pH: AutoShapes.ArrTrackObj[i].obj.ArrGlyph[j].pH,
                        new_pV: AutoShapes.ArrTrackObj[i].obj.ArrGlyph[j].pV
                    });
                    t.ArrGlyph[j].rot=AutoShapes.ArrTrackObj[i].obj.ArrGlyph[j].rot;
                    t.ArrGlyph[j].pH=AutoShapes.ArrTrackObj[i].obj.ArrGlyph[j].pH;
                    t.ArrGlyph[j].pV=AutoShapes.ArrTrackObj[i].obj.ArrGlyph[j].pV;
                }
            }
            t.Recalculate();
        }
        AutoShapes.ArrTrackObj.length=0;
        AutoShapes.ChangeState(new NullShapeState());

         var shp=AutoShapes.obj;
        var shapeProp={};
        shapeProp=
        {
            Position:
            {
                Left:shp.pH,
                Top: shp.pV
            },
            Offset:
            {
                X: shp.off.x,
                Y: shp.off.y
            },
            Rect:
            {
                Height:shp.ext.cx,
                Width:shp.ext.cy
            },
            Rotation: shp.rot,
            FlipH: shp.flipH,
            FlipV: shp.flipV,
            Shadow:
            {
                Color : { r : shp.shadow.color.r, g : shp.shadow.color.g, b : shp.shadow.color.b },
                Length: shp.shadow.length,
                Angle: shp.shadow.color.angle,
                Alpha: shp.shadow.color.alpha
            },
            Alpha: shp.alpha,
            Color : { r : shp.fill_color.r, g : shp.fill_color.g, b : shp.fill_color.b },
            Line:
            {
                Color : { r : shp.line_color.r, g : shp.line_color.g, b : shp.line_color.b },
                Width:shp.line_width
            }
        };
        editor.sync_BeginCatchSelectedElements();
        editor.sync_shapePropCallback(shapeProp);
        editor.sync_EndCatchSelectedElements();
    }
}


function AddTextState()
{
    this.id=7;
    this.OnMouseDown = function(AutoShapes, e, X, Y, PageIndex)
    {
        var t=AutoShapes.NumEditShape;
        var t_rot, t_flipH, t_flipV;
        t_rot=AutoShapes.ArrGlyph[t].rot;
        t_flipH=AutoShapes.ArrGlyph[t].flipH;
        t_flipV=AutoShapes.ArrGlyph[t].flipV;
        
        AutoShapes.ArrGlyph[t].rot=0;
        AutoShapes.ArrGlyph[t].flipH=false;
        AutoShapes.ArrGlyph[t].flipV=false;
        AutoShapes.ChangeState(new NullShapeState());
        AutoShapes.State.OnMouseDown(AutoShapes, e, X, Y, PageIndex);
        AutoShapes.ArrGlyph[t].rot=t_rot;
        AutoShapes.ArrGlyph[t].flipH=t_flipH;
        AutoShapes.ArrGlyph[t].flipV=t_flipV;

        if(AutoShapes.State.id==5)
        {
            for( var i=0; i<AutoShapes.ArrTrackObj.length; i++)
            {
                if(AutoShapes.ArrTrackObj[i].num==t)
                {

                    AutoShapes.ArrTrackObj[i].obj.rot=t_rot;
                    AutoShapes.ArrTrackObj[i].obj.flipH=t_flipH;
                    AutoShapes.ArrTrackObj[i].obj.flipV=t_flipV;
                    break;
                }
            }
        }


        if(AutoShapes.State.id!=7)
        {
            AutoShapes.Document.CurPos.Type = docpostype_Content;
            AutoShapes.Document.RecalculateCurPos();
            AutoShapes.Document.Document_UpdateSelectionState();
        }
        else if(e.ClickCount==2)
        {
            AutoShapes.obj.DocumentContent.Select_All();
        }
    };

    this.OnMouseMove = function(AutoShapes, e, X, Y, PageIndex)
    {
    };
    this.OnMouseUp = function(AutoShapes, e, X, Y, PageIndex)
    {
    }
}


/*function SplineBezierState()
{
    this.OnMouseDown = function(AutoShapes, e, X, Y, PageIndex)
    {
        if(AutoShapes.Spline==null)
            AutoShapes.Spline=new Spline();
        AutoShapes.SplineAdd({x: X, y:Y});
    };

    this.OnMouseMove = function(AutoShapes, e, X, Y, PageIndex)
    {
        AutoShapes.SplineAdd({x: X, y:Y});
        AutoShapes.DrawingDocument.OnRecalculatePage( 0, AutoShapes.Document.Pages[0] );
        AutoShapes.ChangeState(new SplineBezierState2());
    };

    this.OnMouseUp = function(AutoShapes, e, X, Y, PageIndex)
    {};
}


function SplineBezierState2()
{
    this.OnMouseDown = function(AutoShapes, e, X, Y, PageIndex)
    {
    };

    this.OnMouseMove = function(AutoShapes, e, X, Y, PageIndex)
    {
        AutoShapes.ChangeLastPointSpline({x: X, y:Y});
        AutoShapes.DrawingDocument.OnRecalculatePage( 0, AutoShapes.Document.Pages[0] );
    };

    this.OnMouseUp = function(AutoShapes, e, X, Y, PageIndex)
    {
        if(e.ClickCount==1)
        {
            AutoShapes.ChangeLastPointSpline({x: X, y:Y});
            AutoShapes.ChangeState(new SplineBezierState());
        }
        else if(e.ClickCount==2)
        {
            AutoShapes.ChangeLastPointSpline({x: X, y:Y});
            AutoShapes.ChangeState(new SplineBezierState());
        }

    };
}*/


//Состояния прия работе с полилиниями
function PolyLineAddState()
{
    this.OnMouseDown = function(AutoShapes, e, X, Y, PageIndex)
    {
        AutoShapes.PolyLine.AddPoint(X, Y);
    };
    this.OnMouseMove = function(AutoShapes, e, X, Y, PageIndex)
    {
        if(e.IsLocked)
        {
            if(AutoShapes.PolyLine.DistanceToLastPoint(X, Y)>1)
                AutoShapes.PolyLine.AddPoint(X, Y);
            AutoShapes.DrawingDocument.OnRecalculatePage( 0, AutoShapes.Document.Pages[0] );
        }

    };
    this.OnMouseUp = function(AutoShapes, e, X, Y, PageIndex)
    {
        AutoShapes.ArrGlyph.push(AutoShapes.PolyLine.CreateShape(AutoShapes.DrawingDocument, AutoShapes.Document));
        AutoShapes.Selected.push(true);
        AutoShapes.NumSelected++;
        AutoShapes.DrawingDocument.OnRecalculatePage( 0, AutoShapes.Document.Pages[0] );
        AutoShapes.PolyLine.Clear();
        AutoShapes.ChangeState(new NullShapeState());
    };
}


function PolyLineAddState2()
{
    this.OnMouseDown = function(AutoShapes, e, X, Y, PageIndex)
    {
        
    };
    this.OnMouseMove = function(AutoShapes, e, X, Y, PageIndex)
    {
        if(AutoShapes.PolyLine.DistanceToLastPoint(X, Y)>0.5)
        {
            AutoShapes.PolyLine.AddPoint(X, Y);
            AutoShapes.DrawingDocument.OnRecalculatePage( 0, AutoShapes.Document.Pages[0] );
        }
    };
    this.OnMouseUp = function(AutoShapes, e, X, Y, PageIndex)
    {
        AutoShapes.PolyLine.AddSeparator();
        AutoShapes.ChangeState(new PolyLineAddState3());
    };
}


function PolyLineAddState3()
{
    this.OnMouseDown = function(AutoShapes, e, X, Y, PageIndex)
    {
        AutoShapes.PolyLine.AddPoint(X, Y);
        AutoShapes.ChangeState(new PolyLineAddState2());
    };
    this.OnMouseMove = function(AutoShapes, e, X, Y, PageIndex)
    {
        AutoShapes.PolyLine.ChangeLastPoint(X, Y);
        AutoShapes.DrawingDocument.OnRecalculatePage( 0, AutoShapes.Document.Pages[0] );
    };
    this.OnMouseUp = function(AutoShapes, e, X, Y, PageIndex)
    {

    };
}


//Состояния для работы со сплайнами безье.
function SplineAddState()
{
    this.OnMouseDown = function(AutoShapes, e, X, Y, PageIndex)
    {
        AutoShapes.Spline.AddPoint(X, Y);
        AutoShapes.ChangeState(new SplineAddState2());
    };
    this.OnMouseMove = function(AutoShapes, e, X, Y, PageIndex)
    {
    };
    this.OnMouseUp = function(AutoShapes, e, X, Y, PageIndex)
    {

    };
}

function SplineAddState2()
{
    this.OnMouseDown = function(AutoShapes, e, X, Y, PageIndex)
    {
    };
    this.OnMouseMove = function(AutoShapes, e, X, Y, PageIndex)
    {
        AutoShapes.Spline.AddPoint(X, Y);
        AutoShapes.ChangeState(new SplineAddState3(X, Y));
    };
    this.OnMouseUp = function(AutoShapes, e, X, Y, PageIndex)
    {

    };
}

function SplineAddState3(X, Y)
{
    this.X=X;
    this.Y=Y;
    this.OnMouseDown = function(AutoShapes, e, X, Y, PageIndex)
    {

    };
    this.OnMouseMove = function(AutoShapes, e, X, Y, PageIndex)
    {
        AutoShapes.Spline.ChangeLastPoint(X, Y);
        AutoShapes.DrawingDocument.OnRecalculatePage( 0, AutoShapes.Document.Pages[0] );
    };
    this.OnMouseUp = function(AutoShapes, e, X, Y, PageIndex)
    {
        if(e.ClickCount==2)
        {
            AutoShapes.Add(AutoShapes.Spline.CreateShape(AutoShapes.DrawingDocument, AutoShapes.Document));
            AutoShapes.ArrGlyph[AutoShapes.ArrGlyph.length-1].Container=AutoShapes;
            AutoShapes.DrawingDocument.OnRecalculatePage( 0, AutoShapes.Document.Pages[0] );
            AutoShapes.Spline.Clear();
            AutoShapes.ChangeState(new NullShapeState());
            AutoShapes.obj=AutoShapes.ArrGlyph[AutoShapes.ArrGlyph.length-1];
        }
        else
            AutoShapes.ChangeState(new SplineAddState2());
    };
}

//-----------------------------------------------------------------------------
function AddPolyLine2State()
{
    this.OnMouseDown = function(AutoShapes, e, X, Y, PageIndex)
    {
        AutoShapes.PolyLine2.AddPoint(X, Y);
        AutoShapes.DrawingDocument.OnRecalculatePage(0, AutoShapes.Document.Pages[0]);
        AutoShapes.ChangeState(new AddPolyLine2State2());
    };
    this.OnMouseMove = function(AutoShapes, e, X, Y, PageIndex)
    {

    };
    this.OnMouseUp = function(AutoShapes, e, X, Y, PageIndex)
    {
    };
}


function AddPolyLine2State2()
{
    this.OnMouseDown = function(AutoShapes, e, X, Y, PageIndex)
    {
    };
    this.OnMouseMove = function(AutoShapes, e, X, Y, PageIndex)
    {
        if(AutoShapes.PolyLine2.DistanceToLastPoint(X, Y)>0.5)
            AutoShapes.PolyLine2.AddPoint(X, Y);
        AutoShapes.DrawingDocument.OnRecalculatePage(0, AutoShapes.Document.Pages[0]);
    };
    this.OnMouseUp = function(AutoShapes, e, X, Y, PageIndex)
    {
        AutoShapes.PolyLine2.AddSeparator();
        AutoShapes.PolyLine2.AddPoint(X, Y);
        AutoShapes.DrawingDocument.OnRecalculatePage(0, AutoShapes.Document.Pages[0]);
        AutoShapes.ChangeState(new AddPolyLine2State3());
    };
}


function AddPolyLine2State3()
{
    this.OnMouseDown = function(AutoShapes, e, X, Y, PageIndex)
    {
        if(e.ClickCount==1)
        {
            AutoShapes.PolyLine2.AddSeparator();
            AutoShapes.DrawingDocument.OnRecalculatePage(0, AutoShapes.Document.Pages[0]);
            AutoShapes.ChangeState(new AddPolyLine2State2());
        }
        else if(e.ClickCount==2)
        {
            AutoShapes.ArrGlyph.push(AutoShapes.PolyLine2.CreateShape(AutoShapes.DrawingDocument, AutoShapes.Document));
            for(var i=0; i<AutoShapes.Selected.length; i++)
                AutoShapes.Selected[i]=false;
            AutoShapes.Selected.push(true);
            AutoShapes.NumSelected=1;
            AutoShapes.DrawingDocument.OnRecalculatePage( 0, AutoShapes.Document.Pages[0] );
            AutoShapes.PolyLine2.Clear();
            AutoShapes.ArrGlyph[AutoShapes.ArrGlyph.length-1].Container=AutoShapes;
            AutoShapes.ArrGlyph[AutoShapes.ArrGlyph.length-1].prst='polyline2';
            AutoShapes.ChangeState(new NullShapeState());
        }
    };
    this.OnMouseMove = function(AutoShapes, e, X, Y, PageIndex)
    {
        if(!e.IsLocked)
        {
            AutoShapes.PolyLine2.ChangeLastPoint(X, Y);
            AutoShapes.DrawingDocument.OnRecalculatePage(0, AutoShapes.Document.Pages[0]);
        }
    };
    this.OnMouseUp = function(AutoShapes, e, X, Y, PageIndex)
    {

    };
}
//состояния для работы сфигурами внутри групппы----------------------------------------------------------------------------------------------

function GroupState()
{
    this.id=20;
    this.OnMouseDown =function(AutoShapes, e, X, Y, PageIndex)
    {
        AutoShapes.group.State.OnMouseDown(AutoShapes.group, e, X, Y, PageIndex);
        AutoShapes.obj=AutoShapes.group.obj;
        if(AutoShapes.group.State.id==0)
        {
            AutoShapes.ChangeState(new NullShapeState());
            AutoShapes.State.OnMouseDown(AutoShapes, e, X, Y, PageIndex);
        }
    };
    this.OnMouseMove = function(AutoShapes, e, X, Y, PageIndex)
    {
        AutoShapes.group.State.OnMouseMove(AutoShapes.group, e, X, Y, PageIndex);
    };
    this.OnMouseUp = function(AutoShapes, e, X, Y, PageIndex)
    {
        AutoShapes.group.State.OnMouseUp(AutoShapes.group, e, X, Y, PageIndex);
        AutoShapes.group.RecalculateAfterResize();
        AutoShapes.obj=AutoShapes.group.obj;
        if(AutoShapes.group.NumSelected==0)
            AutoShapes.ChangeState(new NullShapeState());
    };
}