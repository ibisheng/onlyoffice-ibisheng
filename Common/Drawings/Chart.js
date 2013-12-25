var DISP_BLANKS_AS_GAP = 0;
var DISP_BLANKS_AS_SPAN = 1;
var DISP_BLANKS_AS_ZERO = 2;


function CChart()
{
    this.autoTitleDeleted = null;
    this.backWall = null;
    this.dispBlanksAs = null;
    this.floor = null;
    this.legend = null;
    this.pivotFmts = [];
    this.plotArea = null;
    this.plotVisOnly = null;
    this.showDLblsOverMax = null;
    this.sideWall = null;
    this.title = null;
    this.view3D = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oIdCounter.Add(this, this.Id);
}

CChart.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return  historyitem_type_Chart;
    },

    Write_ToBinary: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary: function(r)
    {
        this.Id = r.GetString2();
    },

    setAutoTitleDeleted: function(autoTitleDeleted)
    {
        History.Add(this, {Type: historyitem_Chart_SetAutoTitleDeleted, oldAutoTitleDeleted: this.autoTitleDeleted, newAutoTitleDeleted: autoTitleDeleted});
        this.autoTitleDeleted = autoTitleDeleted;
    },
    setBackWall: function(backWall)
    {
        History.Add(this, {Type: historyitem_Chart_SetBackWall, oldBackWall: this.backWall, newBackWall: backWall});
        this.backWall = backWall;
    },
    setDispBlanksAs: function(dispBlanksAs)
    {
        History.Add(this, {Type: historyitem_Chart_SetDispBlanksAs, oldDispBlanksAs: this.dispBlanksAs, newDispBlanksAs: dispBlanksAs});
        this.dispBlanksAs = dispBlanksAs;
    },
    setFloor: function(floor)
    {
        History.Add(this, {Type: historyitem_Chart_SetFloor, oldFloor: this.floor, newFloor: floor});
        this.floor = floor;
    },
    setLegend: function(legend)
    {
        History.Add(this, {Type: historyitem_Chart_SetLegend, oldLegend: this.legend, newLegend: legend});
        this.legend = legend;
    },
    setPivotFmts: function(pivotFmt)
    {
        History.Add(this, {Type: historyitem_Chart_AddPivotFmt, pivotFmt: pivotFmt});
        this.pivotFmts.push(pivotFmt);
    },
    setPlotArea: function(plotArea)
    {
        History.Add(this, {Type: historyitem_Chart_SetPlotArea, oldPlotArea: this.plotArea, newPlotArea: plotArea});
        this.plotArea = plotArea;
    },
    setPlotVisOnly: function(plotVisOnly)
    {
        History.Add(this, {Type: historyitem_Chart_SetPlotVisOnly, oldPlotVisOnly: this.plotVisOnly, newPlotVisOnly: plotVisOnly});
        this.plotVisOnly = plotVisOnly;
    },
    setShowDLblsOverMax: function(showDLblsOverMax)
    {
        History.Add(this, {Type: historyitem_Chart_SetShowDLblsOverMax, oldShowDLblsOverMax: this.showDLblsOverMax, newShowDLblsOverMax: showDLblsOverMax});
        this.showDLblsOverMax = showDLblsOverMax;
    },
    setSideWall: function(sideWall)
    {
        History.Add(this, {Type: historyitem_Chart_SetSideWall, oldSideWall: this.sideWall, newSideWall: sideWall});
        this.sideWall = sideWall;
    },
    setTitle: function(title)
    {
        History.Add(this, {Type: historyitem_Chart_SetTitle, oldTitle: this.title, newTitle: title});
        this.title = title;
    },
    setView3D: function(view3D)
    {
        History.Add(this, {Type: historyitem_Chart_SetView3D, oldView3D: this.view3D, newView3D: view3D});
        this.view3D = view3D;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
                case historyitem_Chart_SetAutoTitleDeleted:
                {
                    this.autoTitleDeleted = data.oldAutoTitleDeleted;
                    break;
                }
                case historyitem_Chart_SetBackWall:
                {
                    this.backWall = data.oldBackWall;
                    break;
                }
                case historyitem_Chart_SetDispBlanksAs:
                {
                    this.dispBlanksAs = data.oldDispBlanksAs;
                    break;
                }
                case historyitem_Chart_SetFloor:
                {
                    this.floor = data.oldFloor;
                    break;
                }
                case historyitem_Chart_SetLegend:
                {
                    this.legend = data.oldLegend;
                    break;
                }
                case historyitem_Chart_AddPivotFmt:
                {
                    for(var i = this.pivotFmts.length; i > -1; --i)
                    {
                        if(this.pivotFmts[i] === data.pivotFmt)
                        {
                            this.pivotFmts.splice(i, 1);
                            break;
                        }
                    }
                    break;
                }
                case historyitem_Chart_SetPlotArea:
                {
                    this.plotArea = data.oldPlotArea;
                    break;
                }
                case historyitem_Chart_SetPlotVisOnly:
                {
                    this.plotVisOnly = data.oldPlotVisOnly;
                    break;
                }
                case historyitem_Chart_SetShowDLblsOverMax:
                {
                    this.showDLblsOverMax = data.oldShowDLblsOverMax;
                    break;
                }
                case historyitem_Chart_SetTitle:
                {
                    this.title = data.oldTitle;
                    break;
                }
                case historyitem_Chart_SetSideWall:
                {
                    this.sideWall = data.oldSideWall;
                    break;
                }
                case historyitem_Chart_SetView3D:
                {
                    this.view3D = data.newView3D;
                    break;
                }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_Chart_SetAutoTitleDeleted:
            {
                this.autoTitleDeleted = data.newAutoTitleDeleted;
                break;
            }
            case historyitem_Chart_SetBackWall:
            {
                this.backWall = data.newBackWall;
                break;
            }
            case historyitem_Chart_SetDispBlanksAs:
            {
                this.dispBlanksAs = data.newDispBlanksAs;
                break;
            }
            case historyitem_Chart_SetFloor:
            {
                this.floor = data.newFloor;
                break;
            }
            case historyitem_Chart_SetLegend:
            {
                this.legend = data.newLegend;
                break;
            }
            case historyitem_Chart_AddPivotFmt:
            {
                this.pivotFmts.push(data.pivotFmt);
                break;
            }
            case historyitem_Chart_SetPlotArea:
            {
                this.plotArea = data.newPlotArea;
                break;
            }
            case historyitem_Chart_SetPlotVisOnly:
            {
                this.plotVisOnly = data.newPlotVisOnly;
                break;
            }
            case historyitem_Chart_SetShowDLblsOverMax:
            {
                this.showDLblsOverMax = data.newShowDLblsOverMax;
                break;
            }
            case historyitem_Chart_SetTitle:
            {
                this.title = data.newTitle;
                break;
            }
            case historyitem_Chart_SetSideWall:
            {
                this.sideWall = data.newSideWall;
                break;
            }
            case historyitem_Chart_SetView3D:
            {
                this.view3D = data.newView3D;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_Chart_SetAutoTitleDeleted:
            {
                writeBool(w, data.newAutoTitleDeleted);
                break;
            }
            case historyitem_Chart_SetBackWall:
            {
                writeObject(data.newBackWall);
                break;
            }
            case historyitem_Chart_SetDispBlanksAs:
            {
                writeLong(w, data.newDispBlanksAs);
                break;
            }
            case historyitem_Chart_SetFloor:
            {
                writeObject(w, data.newFloor);
                break;
            }
            case historyitem_Chart_SetLegend:
            {
                writeObject(w, data.newLegend);
                break;
            }
            case historyitem_Chart_AddPivotFmt:
            {
                writeObject(w, data.pivotFmt);
                break;
            }
            case historyitem_Chart_SetPlotArea:
            {
                writeObject(w, data.newPlotArea);
                break;
            }
            case historyitem_Chart_SetPlotVisOnly:
            {
                writeBool(data.newPlotVisOnly);
                break;
            }
            case historyitem_Chart_SetShowDLblsOverMax:
            {
                writeBool(w, data.newShowDLblsOverMax);
                break;
            }
            case historyitem_Chart_SetTitle:
            {
                writeObject(w, data.newTitle);
                break;
            }
            case historyitem_Chart_SetSideWall:
            {
                writeObject(w, data.newSideWall);
                break;
            }
            case historyitem_Chart_SetView3D:
            {
                writeObject(w, data.newView3D);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_Chart_SetAutoTitleDeleted:
            {
                this.autoTitleDeleted = r.GetBool();
                break;
            }
            case historyitem_Chart_SetBackWall:
            {
                this.backWall = readObject(r);
                break;
            }
            case historyitem_Chart_SetDispBlanksAs:
            {
                this.dispBlanksAs = readLong(r);
                break;
            }
            case historyitem_Chart_SetFloor:
            {
                this.floor = readObject(r);
                break;
            }
            case historyitem_Chart_SetLegend:
            {
                this.legend = readObject(r);
                break;
            }
            case historyitem_Chart_AddPivotFmt:
            {
                var pivot_fmt = readObject(r);
                if(isRealObject(pivot_fmt))
                {
                    this.pivotFmts.push(pivot_fmt);
                }
                break;
            }
            case historyitem_Chart_SetPlotArea:
            {
                this.plotArea = readObject(r);
                break;
            }
            case historyitem_Chart_SetPlotVisOnly:
            {
                this.plotVisOnly = readBool(r);
                break;
            }
            case historyitem_Chart_SetShowDLblsOverMax:
            {
                this.showDLblsOverMax = readBool(r);
                break;
            }
            case historyitem_Chart_SetTitle:
            {
                this.title = readObject(r);
                break;
            }
            case historyitem_Chart_SetSideWall:
            {
                this.sideWall = readObject(r);
                break;
            }
            case historyitem_Chart_SetView3D:
            {
                this.view3D = readObject(r);
                break;
            }
        }
    }
};


function CChartWall()
{
    this.pictureOptions = null;
    this.spPr           = null;
    this.thickness      = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CChartWall.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_ChartWall;
    },


    Write_ToBinary: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary: function(r)
    {
        this.Id = r.GetString2();
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_ChartWall_SetPictureOptions:
            {
                this.pictureOptions = data.oldPr;
                break;
            }

            case historyitem_ChartWall_SetSpPr:
            {
                this.spPr = data.oldPr;
                break;
            }
            case historyitem_ChartWall_SetThickness:
            {
                this.thickness = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_ChartWall_SetPictureOptions:
            {
                this.pictureOptions = data.newPr;
                break;
            }

            case historyitem_ChartWall_SetSpPr:
            {
                this.spPr = data.newPr;
                break;
            }
            case historyitem_ChartWall_SetThickness:
            {
                this.thickness = data.newPr;
                break;
            }
        }
    },

    setPictureOptions: function(pr)
    {
        History.Add(this, {Type: historyitem_ChartWall_SetPictureOptions, oldPr: this.pictureOptions, newPr: pr});
        this.pictureOptions = pr;
    },
    setSpPr: function(pr)
    {
        History.Add(this, {Type: historyitem_ChartWall_SetSpPr, oldPr: this.spPr, newPr: pr});
        this.spPr = pr;
    },
    setThickness: function(pr)
    {
        History.Add(this, {Type: historyitem_ChartWall_SetThickness, oldPr: this.thickness, newPr: pr});
        this.thickness = pr;
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_ChartWall_SetPictureOptions:
            {
                writeObject(w, data.newPr);
                break;
            }

            case historyitem_ChartWall_SetSpPr:
            {
                writeObject(w, data.newPr);
                break;
            }
            case historyitem_ChartWall_SetThickness:
            {
                writeLong(data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch(type)
        {
            case historyitem_ChartWall_SetPictureOptions:
            {
                this.pictureOptions = readObject(r);
                break;
            }

            case historyitem_ChartWall_SetSpPr:
            {
                this.spPr = readObject(r);
                break;
            }
            case historyitem_ChartWall_SetThickness:
            {
                this.thickness = readLong(r);
                break;
            }
        }
    }
};

function CView3d()
{
    this.depthPercent = null;
    this.hPercent     = null;
    this.perspective  = null;
    this.rAngAx       = null;
    this.rotX         = null;
    this.rotY         = null;

    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}

CView3d.prototype =
{
    Get_Id: function()
    {
        return this.Id;
    },

    getObjectType: function()
    {
        return historyitem_type_View3d;
    },


    Write_ToBinary: function(w)
    {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Id);
    },

    Read_FromBinary: function(r)
    {
        this.Id = r.GetString2();
    },

    setDepthPercent: function(pr)
    {
        History.Add(this, {Type: historyitem_View3d_SetDepthPercent, oldPr: this.depthPercent, newPr: pr});
        this.depthPercent = pr;
    },
    setHPercent: function(pr)
    {
        History.Add(this, {Type: historyitem_View3d_SetHPercent, oldPr: this.hPercent, newPr: pr});
        this.hPercent = pr;
    },
    setPerspective: function(pr)
    {
        History.Add(this, {Type: historyitem_View3d_SetPerspective, oldPr: this.perspective, newPr: pr});
        this.perspective = pr;
    },
    setRAngAx: function(pr)
    {
        History.Add(this, {Type: historyitem_View3d_SetRAngAx, oldPr: this.rAngAx, newPr: pr});
        this.rAngAx = pr;
    },
    setRotX: function(pr)
    {
        History.Add(this, {Type: historyitem_View3d_SetRotX, oldPr: this.rotX, newPr: pr});
        this.rotX = pr;
    },
    setRotY: function(pr)
    {
        History.Add(this, {Type: historyitem_View3d_SetRotY, oldPr: this.rotY, newPr: pr});
        this.rotY = pr;
    },

    Undo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_View3d_SetDepthPercent:
            {
                this.depthPercent = data.oldPr;
                break;
            }
            case historyitem_View3d_SetHPercent:
            {
                this.hPercent = data.oldPr;
                break;
            }
            case historyitem_View3d_SetPerspective:
            {
                this.perspective = data.oldPr;
                break;
            }
            case historyitem_View3d_SetRAngAx:
            {
                this.rAngAx = data.oldPr;
                break;
            }
            case historyitem_View3d_SetRotX:
            {
                this.rotX = data.oldPr;
                break;
            }
            case historyitem_View3d_SetRotY:
            {
                this.rotY = data.oldPr;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch (data.Type)
        {
            case historyitem_View3d_SetDepthPercent:
            {
                this.depthPercent = data.newPr;
                break;
            }
            case historyitem_View3d_SetHPercent:
            {
                this.hPercent = data.newPr;
                break;
            }
            case historyitem_View3d_SetPerspective:
            {
                this.perspective = data.newPr;
                break;
            }
            case historyitem_View3d_SetRAngAx:
            {
                this.rAngAx = data.newPr;
                break;
            }
            case historyitem_View3d_SetRotX:
            {
                this.rotX = data.newPr;
                break;
            }
            case historyitem_View3d_SetRotY:
            {
                this.rotY = data.newPr;
                break;
            }
        }
    },

    Save_Changes: function(data, w)
    {
        w.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_View3d_SetDepthPercent:
            case historyitem_View3d_SetHPercent:
            case historyitem_View3d_SetPerspective:
            case historyitem_View3d_SetRotX:
            case historyitem_View3d_SetRotY:
            {
                writeLong(w, data.newPr);
                break;
            }
            case historyitem_View3d_SetRAngAx:
            {
                writeBool(w, data.newPr);
                break;
            }
        }
    },

    Load_Changes: function(r)
    {
        var type = r.GetLong();
        switch (type)
        {
            case historyitem_View3d_SetDepthPercent:
            {
                this.depthPercent = readObject(r);
                break;
            }
            case historyitem_View3d_SetHPercent:
            {
                this.hPercent = readObject(r);
                break;
            }
            case historyitem_View3d_SetPerspective:
            {
                this.perspective = readObject(r);
                break;
            }
            case historyitem_View3d_SetRAngAx:
            {
                this.rAngAx = readBool(r);
                break;
            }
            case historyitem_View3d_SetRotX:
            {
                this.rotX = readObject(r);
                break;
            }
            case historyitem_View3d_SetRotY:
            {
                this.rotY = readObject(r);
                break;
            }
        }
    }
};