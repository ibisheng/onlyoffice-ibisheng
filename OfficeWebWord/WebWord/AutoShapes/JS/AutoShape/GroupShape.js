/**
 * Created by JetBrains WebStorm.
 * User: Sergey.Luzyanin
 * Date: 4/12/12
 * Time: 3:01 PM
 * To change this template use File | Settings | File Templates.
 */

var historyitem_Shape_Group1=10;
var historyitem_Shape_Group2=11;
function GroupShape(ArrShapes, DrawingDocument, Document)
{
    this.Document = Document;
    this.DrawingDocument = DrawingDocument;

    this.State = new NullShapeState();
    this.ArrGlyph = [];
    this.Selected = [];
    this.ArrTrackObj = [];

    this.stX = 0;
    this.stY = 0;

    this.obj = {};
    this.NumEditShape = 0;
    this.NumSelected=0;

    for(var i=0; i<ArrShapes.length; i++)
    {
        if(ArrShapes[i].IsGroup())
        {
            var ungroup=ArrShapes[i].UnGroup();
            for(var j=0; j<ungroup.length; j++)
            {
                this.ArrGlyph.push(ungroup[j]);
                ungroup[j].Container=this;
            }
        }
        else
        {
            this.ArrGlyph.push(ArrShapes[i]);
            ArrShapes[i].Container=this;
        }
    }

    var xmin, ymin, xmax, ymax, glyph;
    glyph=this.ArrGlyph[0];
    if(glyph.rot<Math.PI*0.25||glyph.rot>Math.PI*1.75 ||
        (glyph.rot>Math.PI*0.75&&glyph.rot<Math.PI*1.25))
    {
        xmin=glyph.pH+glyph.off.x;
        ymin=glyph.pV+glyph.off.y;
        xmax=glyph.pH+glyph.off.x+glyph.ext.cx;
        ymax=glyph.pV+glyph.off.y+glyph.ext.cy;
    }
    else
    {
        xmin=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-glyph.ext.cy*0.5;
        ymin=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-glyph.ext.cx*0.5;
        xmax=glyph.pH+glyph.off.x+glyph.ext.cx*0.5+glyph.ext.cy*0.5;
        ymax=glyph.pV+glyph.off.y+glyph.ext.cy*0.5+glyph.ext.cx*0.5;
    }

    this.FlipInfo=[];
    this.FlipInfo[0]={flipH: glyph.flipH, flipV: glyph.flipV};
    this.Selected[0]=false;
    var t_x_min, t_y_min, t_x_max, t_y_max;
    for(i=1; i<this.ArrGlyph.length; i++)
    {
        this.Selected.push(false);
        glyph=this.ArrGlyph[i];
        if(glyph.rot<Math.PI*0.25||glyph.rot>Math.PI*1.75 ||
        (glyph.rot>Math.PI*0.75&&glyph.rot<Math.PI*1.25))
        {
            t_x_min=glyph.pH+glyph.off.x;
            t_y_min=glyph.pV+glyph.off.y;
            t_x_max=glyph.pH+glyph.off.x+glyph.ext.cx;
            t_y_max=glyph.pV+glyph.off.y+glyph.ext.cy;
        }
        else
        {
            t_x_min=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-glyph.ext.cy*0.5;
            t_y_min=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-glyph.ext.cx*0.5;
            t_x_max=glyph.pH+glyph.off.x+glyph.ext.cx*0.5+glyph.ext.cy*0.5;
            t_y_max=glyph.pV+glyph.off.y+glyph.ext.cy*0.5+glyph.ext.cx*0.5;
        }

        if(t_x_min<xmin)
            xmin=t_x_min;
        if(t_y_min<ymin)
            ymin=t_y_min;

        if(t_x_max>xmax)
            xmax=t_x_max;
        if(t_y_max>ymax)
            ymax=t_y_max;
        this.FlipInfo[i]={flipH: this.ArrGlyph[i].flipH, flipV: this.ArrGlyph[i].flipV};
    }

    this.rot=0;
    this.pH=xmin;
    this.pV=ymin;
    this.flipH=false;
    this.flipV=false;
    this.off={x:0, y:0};

    var DX=xmax-xmin, DY=ymax-ymin;
    this.ext={cx: DX>min_size2 ? DX : min_size2, cy: DY>min_size2  ? DY : min_size2};

    this.ChOff = {x: 0, y:0};
    this.ChExt = {cx: xmax-xmin, cy: ymax-ymin};

    this.OffArr=[];
    this.ExtArr=[];

    for(i=0; i<this.ArrGlyph.length; i++)
    {
        this.OffArr[i] = {
            x: this.ArrGlyph[i].pH+this.ArrGlyph[i].off.x-this.pH,
            y: this.ArrGlyph[i].pV+this.ArrGlyph[i].off.y-this.pV
        };

        this.ExtArr[i] = {
            cx: this.ArrGlyph[i].ext.cx,
            cy: this.ArrGlyph[i].ext.cy
        }
    }

    this.line_width=1;
    this.line_color = ArColor.PeachPuff;
    this.fill_color = ArColor.PapayaWhip;

    this.shadow=
    {
        color: ArColor.Black,
        length:0,
        angle: Math.PI*0.25,
        alpha: 64,
        blur:0
    };

    this.alpha=255;
}


GroupShape.prototype=
{
    Draw: function(graphics)
    {
      if(this.State.id!=7)
            for(var i=0; i<this.ArrGlyph.length; i++)
                this.ArrGlyph[i].Draw(graphics);
       else
            for( i=0; i<this.ArrGlyph.length; i++)
            {
                if(i!=this.NumEditShape)
                    this.ArrGlyph[i].Draw(graphics);
                else
                    this.ArrGlyph[i].DrawInTextAdd(graphics);
            }

        if(this.State.id!=7)
        {
            for(i=0; i<this.ArrGlyph.length; i++)
                if(this.Selected[i])
                    this.ArrGlyph[i].Select(graphics, this.DrawingDocument.m_oWordControl.m_nZoomValue);
        }
        else
        {
            for(i=0; i<this.ArrGlyph.length; i++)
            {
                if(this.Selected[i])
                {
                    if(i!=this.NumEditShape)
                        this.ArrGlyph[i].Select(graphics, this.DrawingDocument.m_oWordControl.m_nZoomValue);
                    else
                    {
                        var trot=this.ArrGlyph[i].rot;
                        var t_flipH=this.ArrGlyph[i].flipH;
                        var t_flipV=this.ArrGlyph[i].flipV;
                        this.ArrGlyph[i].rot=0;
                        this.ArrGlyph[i].flipH=false;
                        this.ArrGlyph[i].flipV=false;
                        this.ArrGlyph[i].RecalculateTransformMatrix();
                        this.ArrGlyph[i].Select(graphics, this.DrawingDocument.m_oWordControl.m_nZoomValue);
                        this.ArrGlyph[i].rot=trot;
                        this.ArrGlyph[i].flipH=t_flipH;
                        this.ArrGlyph[i].flipV=t_flipV;
                        this.ArrGlyph[i].RecalculateTransformMatrix();
                    }
                }

            }
        }

        if(this.NumSelected==1)
        {
            i--;
            while(!this.Selected[i])
                i--;
            if(this.State.id!=7)
                this.ArrGlyph[i].DrawAdj(graphics, this.DrawingDocument.m_oWordControl.m_nZoomValue);
            else
            {
                trot=this.ArrGlyph[i].rot;
                t_flipH=this.ArrGlyph[i].flipH;
                t_flipV=this.ArrGlyph[i].flipV;
                this.ArrGlyph[i].rot=0;
                this.ArrGlyph[i].flipH=false;
                this.ArrGlyph[i].flipV=false;
                this.ArrGlyph[i].RecalculateTransformMatrix();
                this.ArrGlyph[i].DrawAdj(graphics, this.DrawingDocument.m_oWordControl.m_nZoomValue);
                this.ArrGlyph[i].rot=trot;
                this.ArrGlyph[i].flipH=t_flipH;
                this.ArrGlyph[i].flipV=t_flipV;
                this.ArrGlyph[i].RecalculateTransformMatrix();
            }
        }
        for(i=0; i<this.ArrTrackObj.length; i++)
            this.ArrTrackObj[i].obj.DrawInTrack(graphics);
    },

    ChangeState: function(state)
    {
        this.State=state;
    },
    
    RecalculateTransformMatrix: function()
    {

    },

    InTextRect: function(x, y)
    {
        return false;
    },
    
    DrawInTrack: function(graphics)
    {
        for(var i=0; i<this.ArrGlyph.length; i++)
            this.ArrGlyph[i].DrawInTrack(graphics);
    },

    DrawAdj: function(graphics,zoom)
    {},

    Move: function(pH, pV)
    {
        var dx=pH-this.pH,
        dy=pV-this.pV;

        this.pH=pH;
        this.pV=pV;
        for(var i=0, n=this.ArrGlyph.length; i<n; i++)
        {
            var g=this.ArrGlyph[i];
            g.Move(g.pH+dx, g.pV+dy);
            g.Recalculate();
        }
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
        var oldXc=this.pH+this.off.x+this.ext.cx*0.5,
            oldYc=this.pV+this.off.y+this.ext.cy*0.5;
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
                    var tpH, tpV, n;
                    tkd1=this.ext.cx/tcx;
                    tkd2=this.ext.cy/tcy;
                    var vh, vv, Xc, Yc;
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                        var da=this.ArrGlyph[i].rot-this.rot,
                            glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=! glyph.flipH;
                            }

                            if(kd2>0)
                            {
                                 glyph.ext.cy*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd2;
                                glyph.flipV=! glyph.flipV;
                            }

                        }
                        else
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }

                            if(kd2>0)
                            {
                                 glyph.ext.cx*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd2;
                                glyph.flipH=!glyph.flipH;
                            }
                        }

                        var tx, ty;
                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd1>0&&kd2>0)
                        {
                            glyph.pH=Xc+tkd1*tx*cos-tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd1*tx*sin+tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd1<0&&kd2>0)
                        {
                            glyph.pH=Xc-tkd1*tx*cos-tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd1*tx*sin+tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd1>0 && kd2<0)
                        {
                            glyph.pH=Xc+tkd1*tx*cos+tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd1*tx*sin-tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc-tkd1*tx*cos+tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd1*tx*sin-tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
                    }
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                         da=this.ArrGlyph[i].rot-this.rot;
                            glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }
                        }
                        else
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd1>0)
                        {
                            glyph.pH=Xc+tx*cos-tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tx*sin+tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc+tkd2*tx*cos+tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd2*tx*sin-tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
                    }
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                        da=this.ArrGlyph[i].rot-this.rot;
                        glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd2>0)
                            {
                                glyph.ext.cx*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd2;
                                glyph.flipH=! glyph.flipH;
                            }

                            if(kd1>0)
                            {
                                 glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }

                        }
                        else
                        {
                            if(kd2>0)
                            {
                                glyph.ext.cy*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd2;
                                glyph.flipV=! glyph.flipV;
                            }

                            if(kd1>0)
                            {
                                 glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd2>0&&kd1>0)
                        {
                            glyph.pH=Xc+tkd2*tx*cos-tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd2*tx*sin+tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd2<0&&kd1>0)
                        {
                            glyph.pH=Xc-tkd2*tx*cos-tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd2*tx*sin+tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd2>0 && kd1<0)
                        {
                            glyph.pH=Xc+tkd2*tx*cos+tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd2*tx*sin-tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc-tkd2*tx*cos+tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd2*tx*sin-tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
                    }
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                         da=this.ArrGlyph[i].rot-this.rot;
                            glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }
                        }
                        else
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=!glyph.flipV;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd1>0)
                        {
                            glyph.pH=Xc+tkd1*tx*cos-ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd1*tx*sin+ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc-tkd1*tx*cos-ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd1*tx*sin+ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();

                    }
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                         da=this.ArrGlyph[i].rot-this.rot;
                            glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=! glyph.flipH;
                            }

                            if(kd2>0)
                            {
                                 glyph.ext.cy*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd2;
                                glyph.flipV=! glyph.flipV;
                            }

                        }
                        else
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }

                            if(kd2>0)
                            {
                                 glyph.ext.cx*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd2;
                                glyph.flipH=!glyph.flipH;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd1>0&&kd2>0)
                        {
                            glyph.pH=Xc+tkd1*tx*cos-tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd1*tx*sin+tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd1<0&&kd2>0)
                        {
                            glyph.pH=Xc-tkd1*tx*cos-tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd1*tx*sin+tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd1>0 && kd2<0)
                        {
                            glyph.pH=Xc+tkd1*tx*cos+tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd1*tx*sin-tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc-tkd1*tx*cos+tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd1*tx*sin-tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
                    }

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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                         da=this.ArrGlyph[i].rot-this.rot;
                            glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }
                        }
                        else
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd1>0)
                        {
                            glyph.pH=Xc+tx*cos-tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tx*sin+tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc+tkd2*tx*cos+tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd2*tx*sin-tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
                    }
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                        da=this.ArrGlyph[i].rot-this.rot;
                        glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd2>0)
                            {
                                glyph.ext.cx*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd2;
                                glyph.flipH=! glyph.flipH;
                            }

                            if(kd1>0)
                            {
                                 glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }

                        }
                        else
                        {
                            if(kd2>0)
                            {
                                glyph.ext.cy*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd2;
                                glyph.flipV=! glyph.flipV;
                            }

                            if(kd1>0)
                            {
                                 glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd2>0&&kd1>0)
                        {
                            glyph.pH=Xc+tkd2*tx*cos-tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd2*tx*sin+tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd2<0&&kd1>0)
                        {
                            glyph.pH=Xc-tkd2*tx*cos-tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd2*tx*sin+tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd2>0 && kd1<0)
                        {
                            glyph.pH=Xc+tkd2*tx*cos+tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd2*tx*sin-tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc-tkd2*tx*cos+tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd2*tx*sin-tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
                    }

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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                         da=this.ArrGlyph[i].rot-this.rot;
                            glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }
                        }
                        else
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=!glyph.flipV;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd1>0)
                        {
                            glyph.pH=Xc+tkd1*tx*cos-ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd1*tx*sin+ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc-tkd1*tx*cos-ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd1*tx*sin+ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();

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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                         da=this.ArrGlyph[i].rot-this.rot;
                            glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=! glyph.flipH;
                            }

                            if(kd2>0)
                            {
                                 glyph.ext.cy*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd2;
                                glyph.flipV=! glyph.flipV;
                            }

                        }
                        else
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }

                            if(kd2>0)
                            {
                                 glyph.ext.cx*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd2;
                                glyph.flipH=!glyph.flipH;
                            }
                        }

                        var tx, ty;
                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd1>0&&kd2>0)
                        {
                            glyph.pH=Xc+tkd1*tx*cos-tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd1*tx*sin+tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd1<0&&kd2>0)
                        {
                            glyph.pH=Xc-tkd1*tx*cos-tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd1*tx*sin+tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd1>0 && kd2<0)
                        {
                            glyph.pH=Xc+tkd1*tx*cos+tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd1*tx*sin-tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc-tkd1*tx*cos+tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd1*tx*sin-tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
                    }
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                         da=this.ArrGlyph[i].rot-this.rot;
                            glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }
                        }
                        else
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd1>0)
                        {
                            glyph.pH=Xc+tx*cos-tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tx*sin+tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc+tkd2*tx*cos+tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd2*tx*sin-tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
                    }

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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                        da=this.ArrGlyph[i].rot-this.rot;
                        glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd2>0)
                            {
                                glyph.ext.cx*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd2;
                                glyph.flipH=! glyph.flipH;
                            }

                            if(kd1>0)
                            {
                                 glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }

                        }
                        else
                        {
                            if(kd2>0)
                            {
                                glyph.ext.cy*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd2;
                                glyph.flipV=! glyph.flipV;
                            }

                            if(kd1>0)
                            {
                                 glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd2>0&&kd1>0)
                        {
                            glyph.pH=Xc+tkd2*tx*cos-tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd2*tx*sin+tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd2<0&&kd1>0)
                        {
                            glyph.pH=Xc-tkd2*tx*cos-tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd2*tx*sin+tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd2>0 && kd1<0)
                        {
                            glyph.pH=Xc+tkd2*tx*cos+tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd2*tx*sin-tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc-tkd2*tx*cos+tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd2*tx*sin-tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
                    }
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                         da=this.ArrGlyph[i].rot-this.rot;
                            glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }
                        }
                        else
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=!glyph.flipV;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd1>0)
                        {
                            glyph.pH=Xc+tkd1*tx*cos-ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd1*tx*sin+ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc-tkd1*tx*cos-ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd1*tx*sin+ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();

                    }
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                         da=this.ArrGlyph[i].rot-this.rot;
                            glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=! glyph.flipH;
                            }

                            if(kd2>0)
                            {
                                 glyph.ext.cy*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd2;
                                glyph.flipV=! glyph.flipV;
                            }

                        }
                        else
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }

                            if(kd2>0)
                            {
                                 glyph.ext.cx*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd2;
                                glyph.flipH=!glyph.flipH;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd1>0&&kd2>0)
                        {
                            glyph.pH=Xc+tkd1*tx*cos-tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd1*tx*sin+tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd1<0&&kd2>0)
                        {
                            glyph.pH=Xc-tkd1*tx*cos-tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd1*tx*sin+tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd1>0 && kd2<0)
                        {
                            glyph.pH=Xc+tkd1*tx*cos+tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd1*tx*sin-tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc-tkd1*tx*cos+tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd1*tx*sin-tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
                    }

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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                         da=this.ArrGlyph[i].rot-this.rot;
                            glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }
                        }
                        else
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd1>0)
                        {
                            glyph.pH=Xc+tx*cos-tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tx*sin+tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc+tkd2*tx*cos+tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd2*tx*sin-tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
                    }
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                        da=this.ArrGlyph[i].rot-this.rot;
                        glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd2>0)
                            {
                                glyph.ext.cx*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd2;
                                glyph.flipH=! glyph.flipH;
                            }

                            if(kd1>0)
                            {
                                 glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }

                        }
                        else
                        {
                            if(kd2>0)
                            {
                                glyph.ext.cy*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd2;
                                glyph.flipV=! glyph.flipV;
                            }

                            if(kd1>0)
                            {
                                 glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd2>0&&kd1>0)
                        {
                            glyph.pH=Xc+tkd2*tx*cos-tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd2*tx*sin+tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd2<0&&kd1>0)
                        {
                            glyph.pH=Xc-tkd2*tx*cos-tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd2*tx*sin+tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd2>0 && kd1<0)
                        {
                            glyph.pH=Xc+tkd2*tx*cos+tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd2*tx*sin-tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc-tkd2*tx*cos+tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd2*tx*sin-tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
                    }
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                         da=this.ArrGlyph[i].rot-this.rot;
                            glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }
                        }
                        else
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=!glyph.flipV;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd1>0)
                        {
                            glyph.pH=Xc+tkd1*tx*cos-ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd1*tx*sin+ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc-tkd1*tx*cos-ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd1*tx*sin+ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                         da=this.ArrGlyph[i].rot-this.rot;
                            glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=! glyph.flipH;
                            }

                            if(kd2>0)
                            {
                                 glyph.ext.cy*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd2;
                                glyph.flipV=! glyph.flipV;
                            }

                        }
                        else
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }

                            if(kd2>0)
                            {
                                 glyph.ext.cx*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd2;
                                glyph.flipH=!glyph.flipH;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd1>0&&kd2>0)
                        {
                            glyph.pH=Xc+tkd1*tx*cos-tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd1*tx*sin+tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd1<0&&kd2>0)
                        {
                            glyph.pH=Xc-tkd1*tx*cos-tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd1*tx*sin+tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd1>0 && kd2<0)
                        {
                            glyph.pH=Xc+tkd1*tx*cos+tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd1*tx*sin-tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc-tkd1*tx*cos+tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd1*tx*sin-tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
                    }
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                         da=this.ArrGlyph[i].rot-this.rot;
                            glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }
                        }
                        else
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd1>0)
                        {
                            glyph.pH=Xc+tx*cos-tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tx*sin+tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc+tkd2*tx*cos+tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd2*tx*sin-tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
                    }
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                        da=this.ArrGlyph[i].rot-this.rot;
                        glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd2>0)
                            {
                                glyph.ext.cx*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd2;
                                glyph.flipH=! glyph.flipH;
                            }

                            if(kd1>0)
                            {
                                 glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }

                        }
                        else
                        {
                            if(kd2>0)
                            {
                                glyph.ext.cy*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd2;
                                glyph.flipV=! glyph.flipV;
                            }

                            if(kd1>0)
                            {
                                 glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd2>0&&kd1>0)
                        {
                            glyph.pH=Xc+tkd2*tx*cos-tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd2*tx*sin+tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd2<0&&kd1>0)
                        {
                            glyph.pH=Xc-tkd2*tx*cos-tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd2*tx*sin+tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd2>0 && kd1<0)
                        {
                            glyph.pH=Xc+tkd2*tx*cos+tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd2*tx*sin-tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc-tkd2*tx*cos+tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd2*tx*sin-tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
                    }
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                         da=this.ArrGlyph[i].rot-this.rot;
                            glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }
                        }
                        else
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=!glyph.flipV;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd1>0)
                        {
                            glyph.pH=Xc+tkd1*tx*cos-ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd1*tx*sin+ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc-tkd1*tx*cos-ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd1*tx*sin+ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();

                    }
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                         da=this.ArrGlyph[i].rot-this.rot;
                            glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=! glyph.flipH;
                            }

                            if(kd2>0)
                            {
                                 glyph.ext.cy*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd2;
                                glyph.flipV=! glyph.flipV;
                            }

                        }
                        else
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }

                            if(kd2>0)
                            {
                                 glyph.ext.cx*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd2;
                                glyph.flipH=!glyph.flipH;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd1>0&&kd2>0)
                        {
                            glyph.pH=Xc+tkd1*tx*cos-tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd1*tx*sin+tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd1<0&&kd2>0)
                        {
                            glyph.pH=Xc-tkd1*tx*cos-tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd1*tx*sin+tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd1>0 && kd2<0)
                        {
                            glyph.pH=Xc+tkd1*tx*cos+tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd1*tx*sin-tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc-tkd1*tx*cos+tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd1*tx*sin-tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
                    }
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                         da=this.ArrGlyph[i].rot-this.rot;
                            glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }
                        }
                        else
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd1>0)
                        {
                            glyph.pH=Xc+tx*cos-tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tx*sin+tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc+tkd2*tx*cos+tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd2*tx*sin-tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
                    }
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                        da=this.ArrGlyph[i].rot-this.rot;
                        glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd2>0)
                            {
                                glyph.ext.cx*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd2;
                                glyph.flipH=! glyph.flipH;
                            }

                            if(kd1>0)
                            {
                                 glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }

                        }
                        else
                        {
                            if(kd2>0)
                            {
                                glyph.ext.cy*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd2;
                                glyph.flipV=! glyph.flipV;
                            }

                            if(kd1>0)
                            {
                                 glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd2>0&&kd1>0)
                        {
                            glyph.pH=Xc+tkd2*tx*cos-tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd2*tx*sin+tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd2<0&&kd1>0)
                        {
                            glyph.pH=Xc-tkd2*tx*cos-tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd2*tx*sin+tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd2>0 && kd1<0)
                        {
                            glyph.pH=Xc+tkd2*tx*cos+tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd2*tx*sin-tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc-tkd2*tx*cos+tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd2*tx*sin-tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
                    }
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                         da=this.ArrGlyph[i].rot-this.rot;
                            glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }
                        }
                        else
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=!glyph.flipV;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd1>0)
                        {
                            glyph.pH=Xc+tkd1*tx*cos-ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd1*tx*sin+ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc-tkd1*tx*cos-ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd1*tx*sin+ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                         da=this.ArrGlyph[i].rot-this.rot;
                            glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=! glyph.flipH;
                            }

                            if(kd2>0)
                            {
                                 glyph.ext.cy*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd2;
                                glyph.flipV=! glyph.flipV;
                            }

                        }
                        else
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }

                            if(kd2>0)
                            {
                                 glyph.ext.cx*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd2;
                                glyph.flipH=!glyph.flipH;
                            }
                        }

                        var tx, ty;
                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd1>0&&kd2>0)
                        {
                            glyph.pH=Xc+tkd1*tx*cos-tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd1*tx*sin+tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd1<0&&kd2>0)
                        {
                            glyph.pH=Xc-tkd1*tx*cos-tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd1*tx*sin+tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd1>0 && kd2<0)
                        {
                            glyph.pH=Xc+tkd1*tx*cos+tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd1*tx*sin-tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc-tkd1*tx*cos+tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd1*tx*sin-tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
                    }
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                         da=this.ArrGlyph[i].rot-this.rot;
                            glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }
                        }
                        else
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd1>0)
                        {
                            glyph.pH=Xc+tx*cos-tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tx*sin+tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc+tkd2*tx*cos+tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd2*tx*sin-tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
                    }
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                        da=this.ArrGlyph[i].rot-this.rot;
                        glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd2>0)
                            {
                                glyph.ext.cx*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd2;
                                glyph.flipH=! glyph.flipH;
                            }

                            if(kd1>0)
                            {
                                 glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }

                        }
                        else
                        {
                            if(kd2>0)
                            {
                                glyph.ext.cy*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd2;
                                glyph.flipV=! glyph.flipV;
                            }

                            if(kd1>0)
                            {
                                 glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd2>0&&kd1>0)
                        {
                            glyph.pH=Xc+tkd2*tx*cos-tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd2*tx*sin+tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd2<0&&kd1>0)
                        {
                            glyph.pH=Xc-tkd2*tx*cos-tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd2*tx*sin+tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd2>0 && kd1<0)
                        {
                            glyph.pH=Xc+tkd2*tx*cos+tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd2*tx*sin-tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc-tkd2*tx*cos+tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd2*tx*sin-tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
                    }
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                         da=this.ArrGlyph[i].rot-this.rot;
                            glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }
                        }
                        else
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=!glyph.flipV;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd1>0)
                        {
                            glyph.pH=Xc+tkd1*tx*cos-ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd1*tx*sin+ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc-tkd1*tx*cos-ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd1*tx*sin+ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();

                    }
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                         da=this.ArrGlyph[i].rot-this.rot;
                            glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=! glyph.flipH;
                            }

                            if(kd2>0)
                            {
                                 glyph.ext.cy*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd2;
                                glyph.flipV=! glyph.flipV;
                            }

                        }
                        else
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }

                            if(kd2>0)
                            {
                                 glyph.ext.cx*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd2;
                                glyph.flipH=!glyph.flipH;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd1>0&&kd2>0)
                        {
                            glyph.pH=Xc+tkd1*tx*cos-tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd1*tx*sin+tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd1<0&&kd2>0)
                        {
                            glyph.pH=Xc-tkd1*tx*cos-tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd1*tx*sin+tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd1>0 && kd2<0)
                        {
                            glyph.pH=Xc+tkd1*tx*cos+tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd1*tx*sin-tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc-tkd1*tx*cos+tkd2*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd1*tx*sin-tkd2*ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
                    }
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                         da=this.ArrGlyph[i].rot-this.rot;
                            glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }
                        }
                        else
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd1>0)
                        {
                            glyph.pH=Xc+tx*cos-tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tx*sin+tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc+tkd2*tx*cos+tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd2*tx*sin-tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
                    }
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                        da=this.ArrGlyph[i].rot-this.rot;
                        glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd2>0)
                            {
                                glyph.ext.cx*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd2;
                                glyph.flipH=! glyph.flipH;
                            }

                            if(kd1>0)
                            {
                                 glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }

                        }
                        else
                        {
                            if(kd2>0)
                            {
                                glyph.ext.cy*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd2;
                                glyph.flipV=! glyph.flipV;
                            }

                            if(kd1>0)
                            {
                                 glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd2>0&&kd1>0)
                        {
                            glyph.pH=Xc+tkd2*tx*cos-tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd2*tx*sin+tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd2<0&&kd1>0)
                        {
                            glyph.pH=Xc-tkd2*tx*cos-tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd2*tx*sin+tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else if(kd2>0 && kd1<0)
                        {
                            glyph.pH=Xc+tkd2*tx*cos+tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd2*tx*sin-tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc-tkd2*tx*cos+tkd1*ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd2*tx*sin-tkd1*ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
                    }
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
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(i=0; i<this.ArrGlyph.length; i++)
                    {
                         da=this.ArrGlyph[i].rot-this.rot;
                            glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }
                        }
                        else
                        {
                            if(kd1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=!glyph.flipV;
                            }
                        }

                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        if(kd1>0)
                        {
                            glyph.pH=Xc+tkd1*tx*cos-ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc+tkd1*tx*sin+ty*cos-glyph.ext.cy*0.5;
                        }
                        else
                        {
                            glyph.pH=Xc-tkd1*tx*cos-ty*sin-glyph.ext.cx*0.5;
                            glyph.pV=Yc-tkd1*tx*sin+ty*cos-glyph.ext.cy*0.5;
                        }
                        glyph.Recalculate();
                    }
                    break;
                }
            }
        }

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
        var oldXc=this.pH+this.off.x+this.ext.cx*0.5,
            oldYc=this.pV+this.off.y+this.ext.cy*0.5;
        xfp=hc+this.pH+this.off.x;
        yfp=vc+this.pV+this.off.y;

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
                    var vh, vv, Xc, Yc;
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(var i=0; i<this.ArrGlyph.length; i++)
                    {
                        var da=this.ArrGlyph[i].rot-this.rot, glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(2*kd1-1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }

                            if(2*kd2-1>0)
                            {
                                 glyph.ext.cy*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd2;
                                glyph.flipV=!glyph.flipV;
                            }
                        }
                        else
                        {
                            if(2*kd1-1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }

                            if(2*kd2-1>0)
                            {
                                 glyph.ext.cx*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd2;
                                glyph.flipH=!glyph.flipH;
                            }
                        }
                        var tx, ty;
                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        glyph.pH=oldXc+(tx*(2*kd1-1)*cos-ty*(2*kd2-1)*sin)-glyph.ext.cx*0.5;
                        glyph.pV=oldYc+(tx*(2*kd1-1)*sin+ty*(2*kd2-1)*cos)-glyph.ext.cy*0.5;
                        glyph.Recalculate();
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

                    tkd1=this.ext.cx/tcx;
                    tkd2=this.ext.cy/tcy;
                    var vh, vv, Xc, Yc;
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(var i=0; i<this.ArrGlyph.length; i++)
                    {
                        var da=this.ArrGlyph[i].rot-this.rot, glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(2*kd1-1>0)
                            {
                                glyph.ext.cy*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd2;
                                glyph.flipV=!glyph.flipV;
                            }

                        }
                        else
                        {
                            if(2*kd1-1>0)
                            {
                                glyph.ext.cx*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd2;
                                glyph.flipH=! glyph.flipH;
                            }
                        }
                        var tx, ty;
                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        glyph.pH=oldXc+(tx*cos-ty*(2*kd1-1)*sin)-glyph.ext.cx*0.5;
                        glyph.pV=oldYc+(tx*sin+ty*(2*kd1-1)*cos)-glyph.ext.cy*0.5;
                        glyph.Recalculate();
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

                    tkd1=this.ext.cx/tcx;
                    tkd2=this.ext.cy/tcy;
                    var vh, vv, Xc, Yc;
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(var i=0; i<this.ArrGlyph.length; i++)
                    {
                        var da=this.ArrGlyph[i].rot-this.rot, glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(2*kd2-1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }

                            if(2*kd1-1>0)
                            {
                                 glyph.ext.cy*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd2;
                                glyph.flipV=!glyph.flipV;
                            }
                        }
                        else
                        {
                            if(2*kd2-1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }

                            if(2*kd1-1>0)
                            {
                                 glyph.ext.cx*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd2;
                                glyph.flipH=!glyph.flipH;
                            }
                        }
                        var tx, ty;
                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        glyph.pH=oldXc+(tx*(2*kd2-1)*cos-ty*(2*kd1-1)*sin)-glyph.ext.cx*0.5;
                        glyph.pV=oldYc+(tx*(2*kd2-1)*sin+ty*(2*kd1-1)*cos)-glyph.ext.cy*0.5;
                        glyph.Recalculate();
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

                    tkd1=this.ext.cx/tcx;
                    tkd2=this.ext.cy/tcy;
                    var vh, vv, Xc, Yc;
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(var i=0; i<this.ArrGlyph.length; i++)
                    {
                        var da=this.ArrGlyph[i].rot-this.rot, glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(2*kd1-1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }


                        }
                        else
                        {
                            if(2*kd1-1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }

                        }
                        var tx, ty;
                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        glyph.pH=oldXc+(tx*(2*kd1-1)*cos-ty*sin)-glyph.ext.cx*0.5;
                        glyph.pV=oldYc+(tx*(2*kd1-1)*sin+ty*cos)-glyph.ext.cy*0.5;
                        glyph.Recalculate();
                    }
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

                    tkd1=this.ext.cx/tcx;
                    tkd2=this.ext.cy/tcy;
                    var vh, vv, Xc, Yc;
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(var i=0; i<this.ArrGlyph.length; i++)
                    {
                        var da=this.ArrGlyph[i].rot-this.rot, glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(2*kd1-1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }

                            if(2*kd2-1>0)
                            {
                                 glyph.ext.cy*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd2;
                                glyph.flipV=!glyph.flipV;
                            }
                        }
                        else
                        {
                            if(2*kd1-1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }

                            if(2*kd2-1>0)
                            {
                                 glyph.ext.cx*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd2;
                                glyph.flipH=!glyph.flipH;
                            }
                        }
                        var tx, ty;
                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        glyph.pH=oldXc+(tx*(2*kd1-1)*cos-ty*(2*kd2-1)*sin)-glyph.ext.cx*0.5;
                        glyph.pV=oldYc+(tx*(2*kd1-1)*sin+ty*(2*kd2-1)*cos)-glyph.ext.cy*0.5;
                        glyph.Recalculate();
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

                    tkd1=this.ext.cx/tcx;
                    tkd2=this.ext.cy/tcy;
                    var vh, vv, Xc, Yc;
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(var i=0; i<this.ArrGlyph.length; i++)
                    {
                        var da=this.ArrGlyph[i].rot-this.rot, glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(2*kd1-1>0)
                            {
                                glyph.ext.cy*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd2;
                                glyph.flipV=!glyph.flipV;
                            }

                        }
                        else
                        {
                            if(2*kd1-1>0)
                            {
                                glyph.ext.cx*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd2;
                                glyph.flipH=! glyph.flipH;
                            }
                        }
                        var tx, ty;
                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        glyph.pH=oldXc+(tx*cos-ty*(2*kd1-1)*sin)-glyph.ext.cx*0.5;
                        glyph.pV=oldYc+(tx*sin+ty*(2*kd1-1)*cos)-glyph.ext.cy*0.5;
                        glyph.Recalculate();
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

                    tkd1=this.ext.cx/tcx;
                    tkd2=this.ext.cy/tcy;
                    var vh, vv, Xc, Yc;
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(var i=0; i<this.ArrGlyph.length; i++)
                    {
                        var da=this.ArrGlyph[i].rot-this.rot, glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(2*kd2-1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }

                            if(2*kd1-1>0)
                            {
                                 glyph.ext.cy*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd2;
                                glyph.flipV=!glyph.flipV;
                            }
                        }
                        else
                        {
                            if(2*kd2-1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }

                            if(2*kd1-1>0)
                            {
                                 glyph.ext.cx*=tkd2;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd2;
                                glyph.flipH=!glyph.flipH;
                            }
                        }
                        var tx, ty;
                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        glyph.pH=oldXc+(tx*(2*kd2-1)*cos-ty*(2*kd1-1)*sin)-glyph.ext.cx*0.5;
                        glyph.pV=oldYc+(tx*(2*kd2-1)*sin+ty*(2*kd1-1)*cos)-glyph.ext.cy*0.5;
                        glyph.Recalculate();
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

                    tkd1=this.ext.cx/tcx;
                    tkd2=this.ext.cy/tcy;
                    var vh, vv, Xc, Yc;
                    Xc=this.pH+this.off.x+this.ext.cx*0.5;
                    Yc=this.pV+this.off.y+this.ext.cy*0.5;
                    for(var i=0; i<this.ArrGlyph.length; i++)
                    {
                        var da=this.ArrGlyph[i].rot-this.rot, glyph=this.ArrGlyph[i];
                        glyph.off={x: 0, y:0};
                        vh=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-oldXc;
                        vv=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-oldYc;
                        if(da<Math.PI*0.25||da>Math.PI*1.75 ||
                        (da>Math.PI*0.75&&da<Math.PI*1.25))
                        {
                            if(2*kd1-1>0)
                            {
                                glyph.ext.cx*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cx*=tkd1;
                                glyph.flipH=!glyph.flipH;
                            }


                        }
                        else
                        {
                            if(2*kd1-1>0)
                            {
                                glyph.ext.cy*=tkd1;
                            }
                            else
                            {
                                glyph.ext.cy*=tkd1;
                                glyph.flipV=! glyph.flipV;
                            }

                        }
                        var tx, ty;
                        tx=vh*cos+vv*sin;
                        ty=-vh*sin+vv*cos;
                        glyph.pH=oldXc+(tx*(2*kd1-1)*cos-ty*sin)-glyph.ext.cx*0.5;
                        glyph.pV=oldYc+(tx*(2*kd1-1)*sin+ty*cos)-glyph.ext.cy*0.5;
                        glyph.Recalculate();
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

    GetPointRelativeShape: function(x, y, num)
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
        for(var i=0; i<this.ArrGlyph.length; ++i)
            this.ArrGlyph[i].Recalculate();
    },

    Hit: function(x, y)
    {
        for(var i=0; i<this.ArrGlyph.length; i++)
            if(this.ArrGlyph[i].Hit(x, y))
                return true;
        return false;
    },

    HitInBox: function(x, y)//проверяет поппали ли в границу box'а
    {
        var x_lt, y_lt;
        var hc, vc, sin, cos;

        var d=100/this.DrawingDocument.m_oWordControl.m_nZoomValue, d2=2*d;
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

        $('<canvas id=\"test_canvas\"></canvas>').insertAfter("#myCanvas");
        var context=document.getElementById('test_canvas').getContext('2d');
        return (HitInLine(context, vx, vy, -d2, -d2, this.ext.cx+d2, -d2) ||
             HitInLine(context, vx, vy, this.ext.cx+d2, -d2, this.ext.cx+d2, this.ext.cy+d2)||
             HitInLine(context, vx, vy, this.ext.cx+d2, this.ext.cy+d2, -d2, this.ext.cy+d2)||
             HitInLine(context, vx, vy, -d2, this.ext.cy+d2, -d2, -d2) ||
             HitInLine(context, vx, vy, this.ext.cx*0.5, -d2, this.ext.cx*0.5, -1000/this.DrawingDocument.m_oWordControl.m_nZoomValue-d2));
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
        
        a=this.rot-ta;
        var R = new CMatrix();
        var hc, vc;
        hc=this.pH+this.off.x+this.ext.cx*0.5;
        vc=this.pV+this.off.y+this.ext.cy*0.5;
        var tH, tV, vh, vv;
        var sin, cos;
        sin=Math.sin(a);
        cos=Math.cos(a);
        for(var i=0, n=this.ArrGlyph.length; i<n; i++)
        {
            vh=this.ArrGlyph[i].pH+this.ArrGlyph[i].off.x+this.ArrGlyph[i].ext.cx*0.5-hc;
            vv=this.ArrGlyph[i].pV+this.ArrGlyph[i].off.y+this.ArrGlyph[i].ext.cy*0.5-vc;
            this.ArrGlyph[i].pH=hc+vh*cos-vv*sin-this.ArrGlyph[i].ext.cx*0.5;
            this.ArrGlyph[i].pV=vc+vh*sin+vv*cos-this.ArrGlyph[i].ext.cy*0.5;
            this.ArrGlyph[i].off = {x: 0, y: 0};
            this.ArrGlyph[i].rot+=a;
            while(this.ArrGlyph[i].rot<0)
            {
                this.ArrGlyph[i].rot+=Math.PI*2;
            }
            while(this.ArrGlyph[i].rot>Math.PI*2)
            {
                this.ArrGlyph[i].rot-=2*Math.PI;
            }

            this.ArrGlyph[i].RecalculateTransformMatrix();
        }

    },

    HitHandle: function(x, y)
    {
        var x_lt, y_lt;
        var hc, vc, sin, cos;

         var d=100/this.DrawingDocument.m_oWordControl.m_nZoomValue, d2=2*d;

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

        var dx, dy;

        if(this.prst!='line')
        {
            dx=vx+d2;
            dy=vy+d2;
            if(Math.sqrt(dx*dx+dy*dy)<d2)
            {
                return {hit: true, num: this.flipV ?(this.flipH ? 4: 6) : (this.flipH ? 2: 0)};
            }

            dx=vx-this.ext.cx-d2;
            dy=vy-this.ext.cy-d2;
            if(Math.sqrt(dx*dx+dy*dy)<d2)
            {
                return {hit:true, num: this.flipV ? (this.flipH ? 0 : 2) : (this.flipH ? 6 : 4)};
            }

            dx=vx+d2;
            dy=vy-this.ext.cy-d2;
            if(Math.sqrt(dx*dx+dy*dy)<d2)
            {
                return {hit:true, num: this.flipV ? (this.flipH ? 2 : 0) : (this.flipH ? 4 : 6)};
            }

            dx=vx-this.ext.cx-d2;
            dy=vy+d2;
            if(Math.sqrt(dx*dx+dy*dy)<d2)
            {
                return {hit:true, num: this.flipV ? (this.flipH ? 6 : 4) : (this.flipH ? 0 : 2)};
            }


            if(this.ext.cx>min_size)
            {
                dx=vx-hc;
                dy=vy+d2;
                if(Math.sqrt(dx*dx+dy*dy)<d2)
                {
                    return {hit:true, num: this.flipV ? 5 : 1};
                }
            }



            if(this.ext.cy>min_size)
            {
                dx=vx-this.ext.cx-d2;
                dy=vy-vc;
                if(Math.sqrt(dx*dx+dy*dy)<d2)
                {
                    return {hit:true, num: this.flipH ? 7 : 3};
                }
            }



            if(this.ext.cx>min_size)
            {
                dx=vx-hc;
                dy=vy-this.ext.cy-d2;
                if(Math.sqrt(dx*dx+dy*dy)<d2)
                {
                    return {hit:true, num: this.flipV ? 1 : 5};
                }
            }


            if(this.ext.cy>min_size)
            {
                dx=vx+d2;
                dy=vy-vc;
                if(Math.sqrt(dx*dx+dy*dy)<d2)
                {
                    return {hit:true, num: this.flipH ? 3 : 7};
                }
            }
            if(!(this.ext.cx<min_size&&this.ext.cy<min_size))
            {
                dx=vx-hc;
                if(!this.flipV)
                {
                    dy=vy+10*d
                }
                else
                {
                    dy=vy-(this.ext.cy+10*d);
                }

                if(Math.sqrt(dx*dx+dy*dy)<d2)
                {
                    return {hit:true, num: 8};
                }
            }
        }
        else
        {
            if(Math.sqrt(vx*vx+vy*vy)<d2)
            {
                return {hit: true, num: this.flipV ?(this.flipH ? 4: 6) : (this.flipH ? 2: 0)};
            }

            dx=vx-this.ext.cx;
            dy=vy-this.ext.cy;
            if(Math.sqrt(dx*dx+dy*dy)<d2)
            {
                return {hit:true, num: this.flipV ? (this.flipH ? 0 : 2) : (this.flipH ? 6 : 4)};
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
        var d=10000/zoom, d2=2*d;
        var sin=Math.sin(this.rot),
            cos=Math.cos(this.rot),
            hc=this.ext.cx*0.5,
            vc=this.ext.cy*0.5;

        graphics.m_bIntegerGrid=false;
        graphics.reset();

        var mtx = new CMatrix();
        mtx.Translate(-(this.pH +this.off.x+ hc),-(this.pV +this.off.y+ vc), 1);
        if(this.flipH)
            mtx.Scale(-1,1, 1);
        if(this.flipV)
            mtx.Scale(1, -1, 1);
        mtx.RotateAt(-rad2deg(this.rot), 0, 0, 1);
        mtx.Translate((this.pH + hc),(this.pV + vc), 1);
        mtx.Translate(this.pH, this.pV, 0);
        graphics.transform3(mtx);

        graphics.m_oContext.fillStyle="rgb(202, 233, 236)";
        graphics.m_oContext.lineWidth=25/zoom;
        graphics.p_color(0,0,0,255);
        graphics._s();
        graphics._m(-d2, -d2);
        graphics._l(this.ext.cx*100+d2, -d2);
        graphics._l(this.ext.cx*100+d2, this.ext.cy*100+d2);
        graphics._l(-d2, this.ext.cy*100+d2);
        graphics._z();
        graphics.ds();

        graphics._s();
        graphics._m(this.ext.cx*50, -d2);
        graphics._l(this.ext.cx*50, -100000/zoom);
        graphics.ds();
        graphics.m_oContext.lineWidth=5/zoom;
        circle(graphics, -d2,-d2, d);
        circle(graphics, this.ext.cx*100+d2,-d2, d);
        circle(graphics, this.ext.cx*100+d2,this.ext.cy*100+d2, d);
        circle(graphics, -d2,this.ext.cy*100+d2, d);

        if(this.ext.cx>min_size)
        {
            square(graphics, this.ext.cx*50,-d2, d);
            square(graphics, this.ext.cx*50,this.ext.cy*100+d2, d);
        }

        if(this.ext.cy>min_size)
        {
            square(graphics, this.ext.cx*100+d2,this.ext.cy*50, d);
            square(graphics, -d2,this.ext.cy*50, d);
        }

        if(!(this.ext.cx<min_size&&this.ext.cy<min_size))
        {
            graphics.m_oContext.fillStyle="rgb(62, 240, 163)";
            circle(graphics, this.ext.cx*50, -100000/zoom, d);
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

        var xmin, ymin, xmax, ymax, glyph, t_rot, t_pH, t_pV, t_x, t_y, t_cx, t_cy, hc, vc, t_xc, t_yc, sin,cos;
            hc=this.pH+this.off.x+this.ext.cx*0.5;
            vc=this.pV+this.off.y+this.ext.cy*0.5;
            sin=Math.sin(this.rot);
            cos=Math.cos(this.rot);

        glyph=this.ArrGlyph[0];
        t_rot=glyph.rot-this.rot;
        while(t_rot<0)
        {
            t_rot+=Math.PI*2;
        }
        while(t_rot>Math.PI*2)
        {
            t_rot-=2*Math.PI;
        }
        t_x=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-hc;
        t_y=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-vc;
        t_xc=hc+(t_x*cos+t_y*sin);
        t_yc=vc+(-t_x*sin+t_y*cos);

        if(t_rot<Math.PI*0.25||t_rot>Math.PI*1.75 ||
            (t_rot>Math.PI*0.75&&t_rot<Math.PI*1.25))
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
            t_rot=glyph.rot-this.rot;
            while(t_rot<0)
            {
                t_rot+=Math.PI*2;
            }
            while(t_rot>Math.PI*2)
            {
                t_rot-=2*Math.PI;
            }
            t_x=glyph.pH+glyph.off.x+glyph.ext.cx*0.5-hc;
            t_y=glyph.pV+glyph.off.y+glyph.ext.cy*0.5-vc;
            t_xc=hc+(t_x*cos+t_y*sin);
            t_yc=vc+(-t_x*sin+t_y*cos);

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

        tx1=dx*cos-dy*sin;
        ty1=dx*sin+dy*cos;

        t_pH=t_pH+tx1;
        t_pV=t_pV+ty1;

        dx=(xmax-xmin)*0.5;
        dy=(ymax-ymin)*0.5;

        var tpH, tpV, t_ext, t_off;

        tpH=this.pH;
        tpV=this.pV;
        t_off=clone(this.off);
        t_ext=clone(this.ext);

        this.pH=t_pH+dx*cos-dy*sin-dx;
        this.pV=t_pV+dx*sin+dy*cos-dy;

        this.off = {x: 0, y:0};
        var DX=xmax-xmin, DY=ymax-ymin;
        this.ext={cx: DX>min_size2 ? DX : min_size2, cy: DY>min_size2  ? DY : min_size2};
        History.Add(this, {
            Type: historyitem_Shape_Resize,
            pH: tpH,
            pV: tpV,
            off: t_off,
            ext: t_ext,
            flipH: this.flipH,
            flipV: this.flipV,

            new_pH: this.pH,
            new_pV: this.pV,
            new_off: clone(this.off),
            new_ext: clone(this.ext)
        })
    },
    Del: function()
    {
        var i=this.ArrGlyph.length;
        while(i--)
             if(this.Selected[i])
                {
                    History.Add(this.ArrGlyph.splice(i,1)[0], {Type: historyitem_Shape_Del,
                        num: i,
                        select: true,
                        NumSelected: this.NumSelected
                    });
                    this.Selected.splice(i, 1);
                    this.NumSelected--;
                }
        this.NumSelected=0;
    },

    Undo: function(Data)
    {
        switch(Data.Type)
        {
            case historyitem_Shape_Resize:
            {
                this.pH=Data.pH;
                this.pV=Data.pV;
                this.ext=Data.ext;
                this.off=Data.off;
                this.flipH=Data.flipH;
                this.flipV=Data.flipV;
                this.Recalculate();
                break;
            }
            case historyitem_Shape_Move:
            {
                this.pH=Data.pH;
                this.pV=Data.pV;
                this.Recalculate();
                break;
            }
            case historyitem_Shape_Rotate:
            {
                this.rot=Data.rot;
                this.Recalculate();
                break;
            }

            case historyitem_Shape_Del:
            {
                this.Container.ArrGlyph.splice(Data.num, 0, this);
                this.Container.Selected.splice(Data.num, 0, Data.select);
                if(Data.select)
                    ++this.Container.NumSelected;
                break;
            }
            case historyitem_Shape_Group1:
            {
                this.Container.ArrGlyph[Data.num]=this;
                break;
            }
            case historyitem_Shape_Group2:
            {
                this.Container.ChangeState(new GroupState());
                break;
            }
            case historyitem_Shape_Add:
            {
                this.Container.ArrGlyph.splice(Data.num, 1);
                this.Container.Selected.splice(Data.num, 1);
                if(Data.select)
                    --this.Container.NumSelected;
                break;
            }
            case historyitem_Shape_SetProperties:
            {
                this.pH=Data.OldPrp.pH;
                this.pV=Data.OldPrp.pV;
                this.ext=Data.OldPrp.ext;
                this.rot=Data.OldPrp.rot;
                this.RecalculateAfterResize();
                this.Recalculate();
            }
        }
    },

    Redo: function(Data)
    {
        switch(Data.Type)
        {
            case historyitem_Shape_Resize:
            {
                this.pH=Data.new_pH;
                this.pV=Data.new_pV;
                this.ext=Data.new_ext;
                this.off=Data.new_off;
                this.flipH=Data.new_flipH;
                this.flipV=Data.new_flipV;
                this.Recalculate();
                break;
            }
             case historyitem_Shape_Move:
            {
                this.pH=Data.new_pH;
                this.pV=Data.new_pV;
                this.Recalculate();
                break;
            }
            case historyitem_Shape_Rotate:
            {
                this.rot=Data.new_rot;
                this.Recalculate();
                break;
            }

             case historyitem_Shape_Del:
            {
                this.Container.ArrGlyph.splice(Data.num, 1);
                this.Container.Selected.splice(Data.num, 1);
                if(Data.select)
                    --this.Container.NumSelected;
                break;
            }

             case historyitem_Shape_Group1:
            {
                this.Container.ArrGlyph[Data.num]=this.ArrGlyph[0];

                break;
            }

            case historyitem_Shape_Group2:
            {
                this.Container.ChangeState(new NullShapeState());
                break;
            }

             case historyitem_Shape_Add:
            {
                this.Container.ArrGlyph.splice(Data.num, 0, this);
                this.Container.Selected.splice(Data.num, 0, Data.select);
                if(Data.select)
                    ++this.Container.NumSelected;
                break;
            }
            case historyitem_Shape_SetProperties:
            {
                this.pH=Data.NewPrp.pH;
                this.pV=Data.NewPrp.pV;
                this.ext=Data.NewPrp.ext;
                this.rot=Data.NewPrp.rot;
                this.RecalculateAfterResize();
                this.Recalculate();
            }
        }
    }
};