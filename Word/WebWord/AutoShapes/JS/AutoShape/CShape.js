var eps=7;
var left_top=0, top=1, right_top=2, right=3, right_bottom=4, bottom=5, left_bottom=6, left=7;
var adj=0, handle=1, move=2;
var xy=0, polar=1;

var N=0, NE=1, E=2, SE=3, S=4, SW=5, W=6, NW=7, ROT=8, MOVE=9;
var min_size=10;
var min_size2=3;

function CShape(DrawingDocument, Parent)
{
    this.pH=0;
    this.pV=0;
    this.rot=0;
    this.off={x:0, y:0};
    this.ext={cx:0, cy:0};

    this.flipH=false;
    this.flipV=false;

    this.line_width=1.5;
    this.line_color = new CColor1(56,93,138);
    this.fill_color = new CColor1(79,129,189);

    this.shadow=
    {
        color: ArColor.Black,
        length:0,
        angle: Math.PI*0.25,
        alpha: 64,
        blur:0
    };
    
    this.alpha=255;
    this.Parent=Parent;
    this.DrawingDocument=DrawingDocument;
    this.isLine=false;
    this.TransformMatrix=new CMatrix();
    this.TransformTextMatrix=new CMatrix();

    this.tailEnd =
    {
        len: mid,
        w: mid,
        type: ar_none
    };

    this.headEnd =
    {
        len: lg,
        w: mid,
        type: ar_none
    };

    this.Container=null;
}

CShape.prototype=
{
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
        if(this.DocumentContent)
            this.DocumentContent.Paragraph_Add(ParaItem, bRecalculate);
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

    Init: function(prst, pH, pV, off, ext)
    {
        this.pH=pH;
        this.pV=pV;
        
        this.flipH=false;
        this.flipV=false;
        this.off=off;
        this.ext=ext;
        this.rot=0;
        this.isLine = prst==='line';
        if(prst!=undefined)
        {
            this.prst=prst;
            this.geometry=CreateGeometry(prst, this.ext.cx, this.ext.cy);
        }
        if(this.geometry.rect!=undefined)
            this.DocumentContent=new CDocumentContent(this, this.DrawingDocument, this.pH+this.off.x+this.geometry.rect.l, this.pV+this.off.y+this.geometry.rect.t, this.pH+this.off.x+this.geometry.rect.r, this.pV+this.off.y+this.geometry.rect.b, false, false);
        this.RecalculateTransformMatrix();
    },

    AddDocumentContent: function()
    {
        if(this.geometry.rect!=undefined)
        {
            this.DocumentContent=new CDocumentContent(this, this.DrawingDocument, this.pH+this.off.x+this.geometry.rect.l, this.pV+this.off.y+this.geometry.rect.t+(this.geometry.rect.b-this.geometry.rect.t)*0.5, this.pH+this.off.x+this.geometry.rect.r, this.pV+this.off.y+this.geometry.rect.b-(this.geometry.rect.b-this.geometry.rect.t)*0.5, false, false);
            this.DocumentContent.Set_ParagraphAlign(3);
        }
    },

    Draw: function(graphics)
    {
        graphics.SetIntegerGrid(false);
        graphics.transform3(this.TransformMatrix);
        this.geometry.Draw(graphics, this.line_color, this.line_width, this.fill_color, this.alpha, this.shadow, this.DrawingDocument.m_oWordControl.m_nZoomValue);
        if(this.line_color!=0)
        {
            graphics.m_oContext.fillStyle=this.line_color.norm(this.alpha);
            switch(this.prst)
            {
                case "line":
                {
                    DrawTailEnd(this.tailEnd.type, this.tailEnd.len, this.tailEnd.w, this.ext.cx, this.ext.cy, Math.atan2(this.ext.cy, this.ext.cx), graphics);
                    DrawHeadEnd(this.headEnd.type, this.headEnd.len, this.headEnd.w, 0, 0, Math.atan2(this.ext.cy, this.ext.cx), graphics);
                    break;
                }
                case "curvedConnector2":
                case "curvedConnector4":
                case "bentConnector2":
                case "bentConnector4":
                {
                    DrawTailEnd(this.tailEnd.type, this.tailEnd.len, this.tailEnd.w, this.ext.cx, this.ext.cy, Math.PI*0.5, graphics);
                    DrawHeadEnd(this.headEnd.type, this.headEnd.len, this.headEnd.w, 0, 0, 0, graphics);
                    break;
                }
                case "curvedConnector3":
                case "curvedConnector5":
                case "bentConnector3":
                case "bentConnector5":
                {
                    DrawTailEnd(this.tailEnd.type, this.tailEnd.len, this.tailEnd.w, this.ext.cx, this.ext.cy, 0, graphics);
                    DrawHeadEnd(this.headEnd.type, this.headEnd.len, this.headEnd.w, 0, 0, 0, graphics);
                    break;
                }
                case "polyline2":
                {
                    if(this.geometry.pathLst[0].fill!=undefined&&this.geometry.pathLst[0].fill=='none')
                    {
                        if(this.geometry.pathLst[0].ArrPathCommand[2].id==1)
                        {
                            var DX, DY;
                            DX=this.geometry.pathLst[0].ArrPathCommand[2].X-this.geometry.pathLst[0].ArrPathCommand[0].X;
                            DY=this.geometry.pathLst[0].ArrPathCommand[2].Y-this.geometry.pathLst[0].ArrPathCommand[0].Y;
                            DrawHeadEnd(this.headEnd.type, this.headEnd.len, this.headEnd.w, this.geometry.pathLst[0].ArrPathCommand[0].X*0.01, this.geometry.pathLst[0].ArrPathCommand[0].Y*0.01, Math.atan2(DY, DX), graphics);
                        }
                        else if(this.geometry.pathLst[0].ArrPathCommand[2].id==4)
                        {
                            DX=this.geometry.pathLst[0].ArrPathCommand[2].X0-this.geometry.pathLst[0].ArrPathCommand[0].X;
                            DY=this.geometry.pathLst[0].ArrPathCommand[2].Y0-this.geometry.pathLst[0].ArrPathCommand[0].Y;
                            DrawHeadEnd(this.headEnd.type, this.headEnd.len, this.headEnd.w, this.geometry.pathLst[0].ArrPathCommand[0].X*0.01, this.geometry.pathLst[0].ArrPathCommand[0].Y*0.01, Math.atan2(DY, DX), graphics);
                        }
                        var n=this.geometry.pathLst[0].ArrPathCommand.length, X1, Y1, X0, Y0;
                        if(this.geometry.pathLst[0].ArrPathCommand[n-1].id==4)
                        {
                           DX=this.geometry.pathLst[0].ArrPathCommand[n-1].X2-this.geometry.pathLst[0].ArrPathCommand[n-1].X1;
                           DY=this.geometry.pathLst[0].ArrPathCommand[n-1].Y2-this.geometry.pathLst[0].ArrPathCommand[n-1].Y1;
                        }
                        else if(this.geometry.pathLst[0].ArrPathCommand[n-1].id==1)
                        {
                            X1=this.geometry.pathLst[0].ArrPathCommand[n-1].X;
                            Y1=this.geometry.pathLst[0].ArrPathCommand[n-1].Y;

                            if(this.geometry.pathLst[0].ArrPathCommand[n-3].id==1||this.geometry.pathLst[0].ArrPathCommand[n-3].id==0)
                            {
                                X0=this.geometry.pathLst[0].ArrPathCommand[n-3].X;
                                Y0=this.geometry.pathLst[0].ArrPathCommand[n-3].Y;
                            }
                            else if(this.geometry.pathLst[0].ArrPathCommand[n-3].id==4)
                            {
                                X1=this.geometry.pathLst[0].ArrPathCommand[n-3].X2;
                                Y1=this.geometry.pathLst[0].ArrPathCommand[n-3].Y2;
                            }
                            DX=X1-X0;
                            DY=Y1-Y0;
                        }
                        DrawTailEnd(this.tailEnd.type, this.tailEnd.len, this.tailEnd.w, X1*0.01, Y1*0.01, Math.atan2(DY, DX), graphics);
                    }
                    break;
                }
                case "splineBezier":
                {
                    if(this.geometry.pathLst[0].fill == 'none')
                    {
                        var DX1, DY1, DX2, DY2, N=this.geometry.pathLst[0].ArrPathCommand.length-1, x1, y1;
                        if(this.geometry.pathLst[0].ArrPathCommand.length>2)
                        {
                            DX1=this.geometry.pathLst[0].ArrPathCommand[0].X-this.geometry.pathLst[0].ArrPathCommand[1].X0;
                            DY1=this.geometry.pathLst[0].ArrPathCommand[0].Y-this.geometry.pathLst[0].ArrPathCommand[1].Y0;
                            DX2=this.geometry.pathLst[0].ArrPathCommand[N].X2-this.geometry.pathLst[0].ArrPathCommand[N].X1;
                            DY2=this.geometry.pathLst[0].ArrPathCommand[N].Y2-this.geometry.pathLst[0].ArrPathCommand[N].Y1;
                            x1=this.geometry.pathLst[0].ArrPathCommand[N].X2*0.01;
                            y1=this.geometry.pathLst[0].ArrPathCommand[N].Y2*0.01;

                        }
                        else if(this.geometry.pathLst[0].ArrPathCommand.length==2)
                        {
                            DX1=this.geometry.pathLst[0].ArrPathCommand[0].X-this.geometry.pathLst[0].ArrPathCommand[0].X;
                            DY1=this.geometry.pathLst[0].ArrPathCommand[0].Y-this.geometry.pathLst[0].ArrPathCommand[0].Y;
                            DX2=DX1;
                            DY2=DY1;
                            x1=this.geometry.pathLst[0].ArrPathCommand[1].X*0.01;
                            y1=this.geometry.pathLst[0].ArrPathCommand[1].Y*0.01;
                        }
                        DrawTailEnd(this.tailEnd.type, this.tailEnd.len, this.tailEnd.w, x1, y1, Math.atan2(DY2, DX2)+Math.PI, graphics);
                        DrawHeadEnd(this.headEnd.type, this.headEnd.len, this.headEnd.w, this.geometry.pathLst[0].ArrPathCommand[0].X*0.01, this.geometry.pathLst[0].ArrPathCommand[0].Y*0.01, Math.atan2(DY1, DX1)+Math.PI, graphics);
                    }

                    break;
                }
            }
        }


        if(this.DocumentContent)
        {
            graphics.SetIntegerGrid(false);
            graphics.transform3(this.TransformTextMatrix);
            this.DocumentContent.Draw(0, graphics);
        }

        graphics.reset();
		graphics.SetIntegerGrid(true);
    },

    DrawInTextAdd: function(graphics)
    {
        var mtx = new CMatrix();
        mtx.Translate(this.pH, this.pV, 0);
        graphics.SetIntegerGrid(false);
        graphics.transform3(mtx);
        this.geometry.Draw(graphics, this.line_color, this.line_width, this.fill_color, this.alpha, this.shadow, this.DrawingDocument.m_oWordControl.m_nZoomValue);
        if(this.line_color!=0)
        {
            graphics.m_oContext.fillStyle=this.line_color.norm(this.alpha);
            switch(this.prst)
            {
                case "line":
                {
                    DrawTailEnd(this.tailEnd.type, this.tailEnd.len, this.tailEnd.w, this.ext.cx, this.ext.cy, Math.atan2(this.ext.cy, this.ext.cx), graphics);
                    DrawHeadEnd(this.headEnd.type, this.headEnd.len, this.headEnd.w, 0, 0, Math.atan2(this.ext.cy, this.ext.cx), graphics);
                    break;
                }
                case "curvedConnector2":
                case "curvedConnector4":
                case "bentConnector2":
                case "bentConnector4":
                {
                    DrawTailEnd(this.tailEnd.type, this.tailEnd.len, this.tailEnd.w, this.ext.cx, this.ext.cy, Math.PI*0.5, graphics);
                    DrawHeadEnd(this.headEnd.type, this.headEnd.len, this.headEnd.w, 0, 0, 0, graphics);
                    break;
                }
                case "curvedConnector3":
                case "curvedConnector5":
                case "bentConnector3":
                case "bentConnector5":
                {
                    DrawTailEnd(this.tailEnd.type, this.tailEnd.len, this.tailEnd.w, this.ext.cx, this.ext.cy, 0, graphics);
                    DrawHeadEnd(this.headEnd.type, this.headEnd.len, this.headEnd.w, 0, 0, 0, graphics);
                    break;
                }
                case "polyline2":
                {
                    if(this.geometry.pathLst[0].fill!=undefined&&this.geometry.pathLst[0].fill=='none')
                    {
                        if(this.geometry.pathLst[0].ArrPathCommand[2].id==1)
                        {
                            var DX, DY;
                            DX=this.geometry.pathLst[0].ArrPathCommand[2].X-this.geometry.pathLst[0].ArrPathCommand[0].X;
                            DY=this.geometry.pathLst[0].ArrPathCommand[2].Y-this.geometry.pathLst[0].ArrPathCommand[0].Y;
                            DrawHeadEnd(this.headEnd.type, this.headEnd.len, this.headEnd.w, this.geometry.pathLst[0].ArrPathCommand[0].X*0.01, this.geometry.pathLst[0].ArrPathCommand[0].Y*0.01, Math.atan2(DY, DX), graphics);
                        }
                        else if(this.geometry.pathLst[0].ArrPathCommand[2].id==4)
                        {
                            DX=this.geometry.pathLst[0].ArrPathCommand[2].X0-this.geometry.pathLst[0].ArrPathCommand[0].X;
                            DY=this.geometry.pathLst[0].ArrPathCommand[2].Y0-this.geometry.pathLst[0].ArrPathCommand[0].Y;
                            DrawHeadEnd(this.headEnd.type, this.headEnd.len, this.headEnd.w, this.geometry.pathLst[0].ArrPathCommand[0].X*0.01, this.geometry.pathLst[0].ArrPathCommand[0].Y*0.01, Math.atan2(DY, DX), graphics);
                        }
                        var n=this.geometry.pathLst[0].ArrPathCommand.length, X1, Y1, X0, Y0;
                        if(this.geometry.pathLst[0].ArrPathCommand[n-1].id==4)
                        {
                           DX=this.geometry.pathLst[0].ArrPathCommand[n-1].X2-this.geometry.pathLst[0].ArrPathCommand[n-1].X1;
                           DY=this.geometry.pathLst[0].ArrPathCommand[n-1].Y2-this.geometry.pathLst[0].ArrPathCommand[n-1].Y1;
                        }
                        else if(this.geometry.pathLst[0].ArrPathCommand[n-1].id==1)
                        {
                            X1=this.geometry.pathLst[0].ArrPathCommand[n-1].X;
                            Y1=this.geometry.pathLst[0].ArrPathCommand[n-1].Y;

                            if(this.geometry.pathLst[0].ArrPathCommand[n-3].id==1||this.geometry.pathLst[0].ArrPathCommand[n-3].id==0)
                            {
                                X0=this.geometry.pathLst[0].ArrPathCommand[n-3].X;
                                Y0=this.geometry.pathLst[0].ArrPathCommand[n-3].Y;
                            }
                            else if(this.geometry.pathLst[0].ArrPathCommand[n-3].id==4)
                            {
                                X1=this.geometry.pathLst[0].ArrPathCommand[n-3].X2;
                                Y1=this.geometry.pathLst[0].ArrPathCommand[n-3].Y2;
                            }
                            DX=X1-X0;
                            DY=Y1-Y0;
                        }
                        DrawTailEnd(this.tailEnd.type, this.tailEnd.len, this.tailEnd.w, X1*0.01, Y1*0.01, Math.atan2(DY, DX), graphics);
                    }
                    break;
                }
                case "splineBezier":
                {
                    if(this.geometry.pathLst[0].fill == 'none')
                    {
                        var DX1, DY1, DX2, DY2, N=this.geometry.pathLst[0].ArrPathCommand.length-1, x1, y1;
                        if(this.geometry.pathLst[0].ArrPathCommand.length>2)
                        {
                            DX1=this.geometry.pathLst[0].ArrPathCommand[0].X-this.geometry.pathLst[0].ArrPathCommand[1].X0;
                            DY1=this.geometry.pathLst[0].ArrPathCommand[0].Y-this.geometry.pathLst[0].ArrPathCommand[1].Y0;
                            DX2=this.geometry.pathLst[0].ArrPathCommand[N].X2-this.geometry.pathLst[0].ArrPathCommand[N].X1;
                            DY2=this.geometry.pathLst[0].ArrPathCommand[N].Y2-this.geometry.pathLst[0].ArrPathCommand[N].Y1;
                            x1=this.geometry.pathLst[0].ArrPathCommand[N].X2*0.01;
                            y1=this.geometry.pathLst[0].ArrPathCommand[N].Y2*0.01;

                        }
                        else if(this.geometry.pathLst[0].ArrPathCommand.length==2)
                        {
                            DX1=this.geometry.pathLst[0].ArrPathCommand[0].X-this.geometry.pathLst[0].ArrPathCommand[0].X;
                            DY1=this.geometry.pathLst[0].ArrPathCommand[0].Y-this.geometry.pathLst[0].ArrPathCommand[0].Y;
                            DX2=DX1;
                            DY2=DY1;
                            x1=this.geometry.pathLst[0].ArrPathCommand[1].X*0.01;
                            y1=this.geometry.pathLst[0].ArrPathCommand[1].Y*0.01;
                        }
                        DrawTailEnd(this.tailEnd.type, this.tailEnd.len, this.tailEnd.w, x1, y1, Math.atan2(DY2, DX2)+Math.PI, graphics);
                        DrawHeadEnd(this.headEnd.type, this.headEnd.len, this.headEnd.w, this.geometry.pathLst[0].ArrPathCommand[0].X*0.01, this.geometry.pathLst[0].ArrPathCommand[0].Y*0.01, Math.atan2(DY1, DX1)+Math.PI, graphics);
                    }

                    break;
                }
            }
        }

        if(this.DocumentContent)
        {
            mtx=new CMatrix();
            mtx.Translate(0,0, 1);
            /*if(this.DocumentContent!=undefined)
            {
                var n=this.DocumentContent.Get_PagesCount();
                var DCHeight=0;
                for(var i=0; i<n; ++i)
                {
                    DCHeight+=(this.DocumentContent.Get_PageBounds(i).Bottom-this.DocumentContent.Get_PageBounds(i).Top);
                }
            }

            if(this.DocumentContent!=undefined)
            {
                if(DCHeight<(this.geometry.rect.b-this.geometry.rect.t))
                {
                    mtx.Translate(0, ((this.geometry.rect.b-this.geometry.rect.t)-DCHeight)*0.5, 1);
                }
            }*/
            graphics.SetIntegerGrid(false);
            graphics.transform3(mtx);
            this.DocumentContent.Draw(0, graphics);
        }
        graphics.reset();
		graphics.SetIntegerGrid(true);
    },

    DrawInTrack: function(graphics)
    {

        graphics.SetIntegerGrid(false);
        graphics.transform3(this.TransformMatrix);
        graphics.m_oContext.shadowOffsetX = 0;
        graphics.m_oContext.shadowOffsetY = 0;
        graphics.m_oContext.shadowBlur = 0;
        graphics.p_width(this.line_width*10000/(g_dKoef_pix_to_mm*this.DrawingDocument.m_oWordControl.m_nZoomValue));
        var pathLst=this.geometry.pathLst, path, cmd;
        for(var i=0, n=pathLst.length; i<n; i++)
        {
            pathLst[i].draw(graphics, this.line_color, this.line_width, this.fill_color, 100);
        }

        if(this.line_color!=0)
        {
            graphics.m_oContext.fillStyle=this.line_color.norm(this.alpha);
            switch(this.prst)
            {
                case "line":
                {
                    DrawTailEnd(this.tailEnd.type, this.tailEnd.len, this.tailEnd.w, this.ext.cx, this.ext.cy, Math.atan2(this.ext.cy, this.ext.cx), graphics);
                    DrawHeadEnd(this.headEnd.type, this.headEnd.len, this.headEnd.w, 0, 0, Math.atan2(this.ext.cy, this.ext.cx), graphics);
                    break;
                }
                case "curvedConnector2":
                case "curvedConnector4":
                case "bentConnector2":
                case "bentConnector4":
                {
                    DrawTailEnd(this.tailEnd.type, this.tailEnd.len, this.tailEnd.w, this.ext.cx, this.ext.cy, Math.PI*0.5, graphics);
                    DrawHeadEnd(this.headEnd.type, this.headEnd.len, this.headEnd.w, 0, 0, 0, graphics);
                    break;
                }
                case "curvedConnector3":
                case "curvedConnector5":
                case "bentConnector3":
                case "bentConnector5":
                {
                    DrawTailEnd(this.tailEnd.type, this.tailEnd.len, this.tailEnd.w, this.ext.cx, this.ext.cy, 0, graphics);
                    DrawHeadEnd(this.headEnd.type, this.headEnd.len, this.headEnd.w, 0, 0, 0, graphics);
                    break;
                }
                case "polyline2":
                {
                    if(this.geometry.pathLst[0].fill!=undefined&&this.geometry.pathLst[0].fill=='none')
                    {
                        if(this.geometry.pathLst[0].ArrPathCommand[2].id==1)
                        {
                            var DX, DY;
                            DX=this.geometry.pathLst[0].ArrPathCommand[2].X-this.geometry.pathLst[0].ArrPathCommand[0].X;
                            DY=this.geometry.pathLst[0].ArrPathCommand[2].Y-this.geometry.pathLst[0].ArrPathCommand[0].Y;
                            DrawHeadEnd(this.headEnd.type, this.headEnd.len, this.headEnd.w, this.geometry.pathLst[0].ArrPathCommand[0].X*0.01, this.geometry.pathLst[0].ArrPathCommand[0].Y*0.01, Math.atan2(DY, DX), graphics);
                        }
                        else if(this.geometry.pathLst[0].ArrPathCommand[2].id==4)
                        {
                            DX=this.geometry.pathLst[0].ArrPathCommand[2].X0-this.geometry.pathLst[0].ArrPathCommand[0].X;
                            DY=this.geometry.pathLst[0].ArrPathCommand[2].Y0-this.geometry.pathLst[0].ArrPathCommand[0].Y;
                            DrawHeadEnd(this.headEnd.type, this.headEnd.len, this.headEnd.w, this.geometry.pathLst[0].ArrPathCommand[0].X*0.01, this.geometry.pathLst[0].ArrPathCommand[0].Y*0.01, Math.atan2(DY, DX), graphics);
                        }
                        n=this.geometry.pathLst[0].ArrPathCommand.length;
                        var X1, Y1, X0, Y0;
                        if(this.geometry.pathLst[0].ArrPathCommand[n-1].id==4)
                        {
                           DX=this.geometry.pathLst[0].ArrPathCommand[n-1].X2-this.geometry.pathLst[0].ArrPathCommand[n-1].X1;
                           DY=this.geometry.pathLst[0].ArrPathCommand[n-1].Y2-this.geometry.pathLst[0].ArrPathCommand[n-1].Y1;
                        }
                        else if(this.geometry.pathLst[0].ArrPathCommand[n-1].id==1)
                        {
                            X1=this.geometry.pathLst[0].ArrPathCommand[n-1].X;
                            Y1=this.geometry.pathLst[0].ArrPathCommand[n-1].Y;

                            if(this.geometry.pathLst[0].ArrPathCommand[n-3].id==1||this.geometry.pathLst[0].ArrPathCommand[n-3].id==0)
                            {
                                X0=this.geometry.pathLst[0].ArrPathCommand[n-3].X;
                                Y0=this.geometry.pathLst[0].ArrPathCommand[n-3].Y;
                            }
                            else if(this.geometry.pathLst[0].ArrPathCommand[n-3].id==4)
                            {
                                X1=this.geometry.pathLst[0].ArrPathCommand[n-3].X2;
                                Y1=this.geometry.pathLst[0].ArrPathCommand[n-3].Y2;
                            }
                            DX=X1-X0;
                            DY=Y1-Y0;
                        }
                        DrawTailEnd(this.tailEnd.type, this.tailEnd.len, this.tailEnd.w, X1*0.01, Y1*0.01, Math.atan2(DY, DX), graphics);
                    }
                    break;
                }
                case "splineBezier":
                {
                    if(this.geometry.pathLst[0].fill == 'none')
                    {
                        var DX1, DY1, DX2, DY2, N=this.geometry.pathLst[0].ArrPathCommand.length-1, x1, y1;
                        if(this.geometry.pathLst[0].ArrPathCommand.length>2)
                        {
                            DX1=this.geometry.pathLst[0].ArrPathCommand[0].X-this.geometry.pathLst[0].ArrPathCommand[1].X0;
                            DY1=this.geometry.pathLst[0].ArrPathCommand[0].Y-this.geometry.pathLst[0].ArrPathCommand[1].Y0;
                            DX2=this.geometry.pathLst[0].ArrPathCommand[N].X2-this.geometry.pathLst[0].ArrPathCommand[N].X1;
                            DY2=this.geometry.pathLst[0].ArrPathCommand[N].Y2-this.geometry.pathLst[0].ArrPathCommand[N].Y1;
                            x1=this.geometry.pathLst[0].ArrPathCommand[N].X2*0.01;
                            y1=this.geometry.pathLst[0].ArrPathCommand[N].Y2*0.01;

                        }
                        else if(this.geometry.pathLst[0].ArrPathCommand.length==2)
                        {
                            DX1=this.geometry.pathLst[0].ArrPathCommand[0].X-this.geometry.pathLst[0].ArrPathCommand[0].X;
                            DY1=this.geometry.pathLst[0].ArrPathCommand[0].Y-this.geometry.pathLst[0].ArrPathCommand[0].Y;
                            DX2=DX1;
                            DY2=DY1;
                            x1=this.geometry.pathLst[0].ArrPathCommand[1].X*0.01;
                            y1=this.geometry.pathLst[0].ArrPathCommand[1].Y*0.01;
                        }
                        DrawTailEnd(this.tailEnd.type, this.tailEnd.len, this.tailEnd.w, x1, y1, Math.atan2(DY2, DX2)+Math.PI, graphics);
                        DrawHeadEnd(this.headEnd.type, this.headEnd.len, this.headEnd.w, this.geometry.pathLst[0].ArrPathCommand[0].X*0.01, this.geometry.pathLst[0].ArrPathCommand[0].Y*0.01, Math.atan2(DY1, DX1)+Math.PI, graphics);
                    }

                    break;
                }
            }
        }
        
        graphics.reset();
		graphics.SetIntegerGrid(true);

    },

    DrawAdj: function(graphics,zoom)
    {
        if(this.ext.cx>min_size&&this.ext.cy>min_size)
        {
            var hc=this.ext.cx*0.5, vc=this.ext.cy*0.5;

            graphics.m_bIntegerGrid=false;
            graphics.reset();

            graphics.transform3(this.TransformMatrix);

            var d=30000/zoom;
            graphics.m_oContext.fillStyle="rgb(254, 251, 132)";
            for(var i=0; i<this.geometry.ahXYLst.length; i++)
            {
                diamond(graphics, this.geometry.ahXYLst[i].posX*100, this.geometry.ahXYLst[i].posY*100, d);
            }
            for(i=0; i<this.geometry.ahPolarLst.length; i++)
            {
                diamond(graphics, this.geometry.ahPolarLst[i].posX*100, this.geometry.ahPolarLst[i].posY*100, d);
            }
            graphics.reset();
        }

    },

    Move: function(pH, pV)
    {
        this.pH=pH;
        this.pV=pV;
        this.RecalculateTransformMatrix();
    },

    RecalculateTransformMatrix: function()
    {
        var  hc, vc;
        hc=this.ext.cx*0.5;
        vc=this.ext.cy*0.5;

        var mtx = new CMatrix();
        var xc, yc;
        xc=(this.pH +this.off.x+ hc);
        yc=(this.pV + this.off.y +vc);
        mtx.Translate(-xc,-yc, 1);
        if(this.flipH)
            mtx.Scale(-1,1, 1);
        if(this.flipV)
            mtx.Scale(1, -1, 1);
        var r=rad2deg(this.rot);
        mtx.RotateAt(-r, 0, 0, 1);
        mtx.Translate(xc, yc, 1);
        mtx.Translate(this.pH, this.pV, 0);
        this.TransformMatrix=mtx;

        mtx=new CMatrix();
        mtx.Translate(-xc,-yc, 1);



        if(this.flipV && this.geometry.rect!=undefined)
        {
            var DY=this.geometry.rect.t-(this.ext.cy-this.geometry.rect.b);
            mtx.RotateAt(180, this.geometry.rect.l-this.ext.cx*0.5+(this.geometry.rect.r-this.geometry.rect.l)*0.5, this.geometry.rect.t-this.ext.cy*0.5+(this.geometry.rect.b-this.geometry.rect.t)*0.5, 1);
            mtx.Translate(0, -DY, 1);
        }
        if(this.flipH && this.geometry.rect!=undefined)
        {
            var DX=this.geometry.rect.l-(this.ext.cx-this.geometry.rect.r);
            mtx.Translate(-DX, 0, 1);
        }

        /*if(this.DocumentContent!=undefined)
        {
            var n=this.DocumentContent.Get_PagesCount();
            var DCHeight=0;
            for(var i=0; i<n; ++i)
            {
                DCHeight+=(this.DocumentContent.Get_PageBounds(i).Bottom-this.DocumentContent.Get_PageBounds(i).Top);
            }
        }

        if(this.DocumentContent!=undefined)
        {
            if(DCHeight<(this.geometry.rect.b-this.geometry.rect.t))
            {
                mtx.Translate(0, ((this.geometry.rect.b-this.geometry.rect.t)-DCHeight)*0.5, 1);
            }
        }*/

        mtx.RotateAt(-r, 0, 0, 1);
        mtx.Translate(xc, yc, 1);
        this.TransformTextMatrix=mtx;
    },

    Resize: function(num, kd1, kd2)
    {
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
        sin=Math.sin(this.rot);
        cos=Math.cos(this.rot);
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
        this.geometry.Recalculate(this.ext.cx, this.ext.cy);
        this.RecalculateDC();
        this.RecalculateDC();
    },

    RecalculateDC: function()
    {
        if(this.DocumentContent)
        {
            var n=this.DocumentContent.Get_PagesCount();
            var DCHeight=0;
            for(var i=0; i<n; ++i)
            {
                DCHeight+=(this.DocumentContent.Get_PageBounds(i).Bottom-this.DocumentContent.Get_PageBounds(i).Top);
            }

            if(DCHeight<(this.geometry.rect.b-this.geometry.rect.t))
            {
                var dh=((this.geometry.rect.b-this.geometry.rect.t)-DCHeight)*0.5;
            }
            else
               dh=0;
            this.DocumentContent.Reset(this.pH+this.off.x+this.geometry.rect.l, this.pV+this.off.y+this.geometry.rect.t+dh, this.pH+this.off.x+this.geometry.rect.r, this.pV+this.off.y+this.geometry.rect.b);
            this.DocumentContent.Recalculate();
        }
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

        if(this.flipH)
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
        }

        return false;
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

        $('<canvas id=\"test_canvas\"></canvas>').insertAfter("#myCanvas");
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
        $("#text_canvas").remove();
        return false;
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

        $('<canvas id=\"test_canvas\"></canvas>').insertAfter("#myCanvas");
        var context=document.getElementById('test_canvas').getContext('2d');
        return (HitInLine(context, vx, vy, 0, 0, this.ext.cx, 0) ||
             HitInLine(context, vx, vy, this.ext.cx, 0, this.ext.cx, this.ext.cy)||
             HitInLine(context, vx, vy, this.ext.cx, this.ext.cy, 0, this.ext.cy)||
             HitInLine(context, vx, vy, 0, this.ext.cy, 0, 0) ||
             HitInLine(context, vx, vy, this.ext.cx*0.5, 0, this.ext.cx*0.5, -1000/this.DrawingDocument.m_oWordControl.m_nZoomValue)&& !this.isLine);
    },

    InTextRect: function(x, y)
    {
        if(this.geometry.rect!=undefined)
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
            var r=this.geometry.rect;
            return vx>=r.l && vx<=r.r && vy>=r.t && vy<=r.b;
        }
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

        var d=100/this.DrawingDocument.m_oWordControl.m_nZoomValue;
        var r=d*2;
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
            if(!(this.ext.cx<min_size&&this.ext.cy<min_size))
            {
                dx=vx-hc;
                if(!this.flipV)
                {
                    dy=vy+10*100/this.DrawingDocument.m_oWordControl.m_nZoomValue;
                }
                else
                {
                    dy=vy-(this.ext.cy+10*100/this.DrawingDocument.m_oWordControl.m_nZoomValue);
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
        if(this.ext.cx>min_size&&this.ext.cy>min_size)
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
        }
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
        var d=10000/zoom;
        var hc=this.ext.cx*0.5,
            vc=this.ext.cy*0.5;

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
            graphics._l(this.ext.cx*100, 0);
            graphics._l(this.ext.cx*100, this.ext.cy*100);
            graphics._l(0, this.ext.cy*100);
            graphics._z();
            graphics.ds();

            if(!(this.ext.cx<min_size&&this.ext.cy<min_size))
            {
                graphics._s();
                graphics._m(this.ext.cx*50, 0);
                graphics._l(this.ext.cx*50, -100000/zoom);
                graphics.ds();
            }

            circle(graphics, 0,0, d);
            circle(graphics, this.ext.cx*100,0, d);
            circle(graphics, this.ext.cx*100,this.ext.cy*100, d);
            circle(graphics, 0,this.ext.cy*100, d);



            if(this.ext.cx>min_size)
            {
                square(graphics, this.ext.cx*50,0, d);
                square(graphics, this.ext.cx*50,this.ext.cy*100, d);
            }

            if(this.ext.cy>min_size)
            {
                square(graphics, this.ext.cx*100,this.ext.cy*50, d);
                square(graphics, 0,this.ext.cy*50, d);
            }

            if(!(this.ext.cx<min_size&&this.ext.cy<min_size))
            {
                graphics.m_oContext.fillStyle="rgb(62, 240, 163)";
                circle(graphics, this.ext.cx*50, -100000/zoom, d);
            }



        }
        else
        {
            circle(graphics, 0,0, d);
            circle(graphics, this.ext.cx*100,this.ext.cy*100, d);
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
            case historyitem_Shape_ChangeAdj:
            {
                this.geometry.gdLst[Data.gdRef1]=Data.val1;
                this.geometry.gdLst[Data.gdRef2]=Data.val2;
                this.Recalculate();
                break;
            }
            case historyitem_Shape_Rotate:
            {
                this.rot=Data.rot;
                this.Recalculate();
                break;
            }
            case historyitem_Shape_Rotate_InGroup:
            {
                this.rot=Data.rot;
                this.pH=Data.pH;
                this.pV=Data.pV;
                this.Recalculate();
                break;
            }
            case historyitem_Shape_Del:
            {

                this.Container.ArrGlyph.splice(Data.num, 0, this);
                this.Container.Selected.splice(Data.num, 0, Data.select);
                if(Data.select)
                    ++this.Container.NumSelected;
                this.Recalculate();
                break;
            }
            case historyitem_Shape_Group:
            {
                this.Container = this.Container.Container;
                this.Container.ArrGlyph.splice(Data.num, 0, this);
                this.Container.Selected.splice(Data.num, 0, Data.select);
                if(Data.select)
                    ++this.Container.NumSelected;
                this.Recalculate();
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
                this.line_width=Data.OldPrp.line_width;
                this.fill_color=Data.OldPrp.fill_color;
                this.line_color=Data.OldPrp.line_color;
                this.alpha=Data.OldPrp.alpha;
                this.tailEnd=Data.OldPrp.tailEnd;
                this.headEnd=Data.OldPrp.headEnd;
                this.shadow=Data.OldPrp.shadow;
                this.flipH=Data.OldPrp.flipH;
                this.flipV=Data.OldPrp.flipV;
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
            case historyitem_Shape_ChangeAdj:
            {
                this.geometry.gdLst[Data.gdRef1]=Data.new_val1;
                this.geometry.gdLst[Data.gdRef2]=Data.new_val2;
                this.Recalculate();
                break;
            }
            case historyitem_Shape_Rotate:
            {
                this.rot=Data.new_rot;
                this.Recalculate();
                break;
            }

            case historyitem_Shape_Rotate_InGroup:
            {
                this.rot=Data.new_rot;
                this.pH=Data.new_pH;
                this.pV=Data.new_pV;
                this.Recalculate();
                break;
            }

            case historyitem_Shape_Del:
            case historyitem_Shape_Group:
            {
                this.Container.ArrGlyph.splice(Data.num, 1);
                this.Container.Selected.splice(Data.num, 1);
                if(Data.select)
                    --this.Container.NumSelected;
                this.Recalculate();
                break;
            }
            

            case historyitem_Shape_Add:
            {
                this.Container.ArrGlyph.splice(Data.num, 0, this);
                this.Container.Selected.splice(Data.num, 0, Data.select);
                if(Data.select)
                    ++this.Container.NumSelected;
                this.Recalculate();
                break;
            }
            case historyitem_Shape_SetProperties:
            {
                this.pH=Data.NewPrp.pH;
                this.pV=Data.NewPrp.pV;
                this.ext=Data.NewPrp.ext;
                this.rot=Data.NewPrp.rot;
                this.line_width=Data.NewPrp.line_width;
                this.fill_color=Data.NewPrp.fill_color;
                this.line_color=Data.NewPrp.line_color;
                this.alpha=Data.NewPrp.alpha;
                this.tailEnd=Data.NewPrp.tailEnd;
                this.headEnd=Data.NewPrp.headEnd;
                this.shadow=Data.NewPrp.shadow;
                this.flipH=Data.NewPrp.flipH;
                this.flipV=Data.NewPrp.flipV;
                this.Recalculate();
            }

        }
    }
};