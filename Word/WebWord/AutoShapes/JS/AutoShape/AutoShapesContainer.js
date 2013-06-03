
var historyitem_Shape_Delete=0;
function AutoShapesContainer(Document, DrawingDocument)
{
    this.Document = Document;
    this.DrawingDocument = DrawingDocument;

    this.State = new NullShapeState();
    this.CurPreset = 'sun';
    this.Container=this;

    this.ArrGlyph = new Array();
    this.Selected = new Array();
    this.ArrTrackObj=new Array();

    this.stX = 0;
    this.stY = 0;

    this.obj = new Object();
    this.NumEditShape = 0;

    this.group={};
    this.NumGroup=null;

    this.NumSelected=0;

    this.ArrPointSpline=new Array();

    this.Spline=new Spline();

    this.PolyLine=new PolyLine();

    this.PolyLine2=new PolyLine2();
}

AutoShapesContainer.prototype=
{
    GetStateId: function()
    {
        return this.State.id;
    },

    ChangeState: function(state)
    {
        this.State=state;
    },

    OnMouseDown: function(e, X, Y, PageIndex)
    {
        this.State.OnMouseDown(this, e, X, Y, PageIndex);
    },

    OnMouseMove: function(e, X, Y, PageIndex)
    {
        this.State.OnMouseMove(this, e, X, Y, PageIndex);
    },

    OnMouseUp: function(e, X, Y, PageIndex)
    {
        this.State.OnMouseUp(this, e, X, Y, PageIndex);
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

    Add: function(obj)
    {
        this.ArrGlyph.push(obj);
        for(var i=0; i<this.Selected.length; i++)
            this.Selected[i]=false;
        this.Selected.push(true);
        this.NumSelected=1;
    },

    Del: function()
    {
        if(this.State.id!=20)
        {
            History.Create_NewPoint();
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
        }
        else
        {
            this.group.Del();
        }
    },

    Select: function(num, ctrl)
    {
        if(ctrl)
        {
            if(!this.AutoShapes.Selected[num])
                ++this.NumSelected;
            this.Selected[num]=true;
        }
        else
        {
            for(var i=0; i <this.Selected.length; i++)
                this.Selected[i]=false;
            this.Selected[num]=true;
            this.NumSelected=1;
        }
    },

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

        this.Spline.Draw(graphics);
        this.PolyLine.Draw(graphics);
        this.PolyLine2.Draw(graphics);
    },

    CtrlDown: function()
    {
        this.State.CtrlDown();
    },

    CtrlUp: function()
    {
        this.State.CtrlUp();
    },

    ShiftPress: function()
    {
        this.State.ShiftPress();
    },

    ShiftUp: function()
    {
        this.State.ShiftUp();
    },

    GroupSelected: function()
    {
        History.Create_NewPoint();
        if(this.NumSelected>1)
        {
            var group=new Array();
            var i=this.ArrGlyph.length;
            while(i--)
                if(this.Selected[i])
                {
                    History.Add(this.ArrGlyph[i], {Type: historyitem_Shape_Group,
                        num: i,
                        select: true,
                        NumSelected: this.NumSelected
                    });
                    this.Selected.splice(i, 1);
                    this.NumSelected--;
                    group.push(this.ArrGlyph.splice(i,1)[0]);
                }
            group.reverse();
            var t=new GroupShape(group, this.DrawingDocument, this.Document);
            History.Add(t, {Type: historyitem_Shape_Add, num: this.ArrGlyph.length, select:true});
            this.ArrGlyph.push(t);
            this.ArrGlyph[this.ArrGlyph.length-1].Container=this;
            this.NumSelected=1;
            this.Selected.push(true);
            this.NumGroup=this.ArrGlyph.length-1;
            this.DrawingDocument.OnRecalculatePage( 0, this.Document.Pages[0] );
        }
    },

    Undo: function(Data)
    {
        switch(Data.Type)
        {
           case historyitem_Shape_UnGroup:
           {
                var i=Data.select.length;
                while(i--)
                    if(Data.select[i])
                    {
                        this.Selected.splice(i, 1);
                        this.ArrGlyph.splice(i, 1);
                        this.NumSelected--;
                    }
                this.ArrGlyph.push(Data.group);
                this.ArrGlyph[this.ArrGlyph.length-1].Container=this;
                this.NumSelected=1;
                this.Selected.push(true);
                Data.num=this.Selected.length-1;
                this.DrawingDocument.OnRecalculatePage( 0, this.Document.Pages[0] );
                break;
           }
        }
        this.DrawingDocument.OnRecalculatePage( 0, this.Document.Pages[0] );
    },

    Redo: function(Data)
    {
        switch(Data.Type)
        {
            case historyitem_Shape_UnGroup:
           {
                var tmp=Data.group.UnGroup();
                var k=Data.num;
                this.ArrGlyph.splice(k, 1);
                this.Selected.splice(k, 1);
                for(var i=0; i<tmp.length; ++i)
                {
                    this.ArrGlyph.splice(k, 0, tmp[i]);
                    this.Selected.splice(k, 0, true);
                    ++k;
                }
                this.NumSelected=tmp.length;
                this.obj=tmp[tmp.length-1];
           }
        }
        this.DrawingDocument.OnRecalculatePage( 0, this.Document.Pages[0] );
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
    {}
};