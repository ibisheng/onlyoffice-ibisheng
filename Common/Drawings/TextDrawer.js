var PATH_DIV_EPSILON = 0.1;
var UNDERLINE_DIV_EPSILON = 3;


function ParaDrawingStruct(nPageIndex, pDrawing)
{
    this.oDrawing = pDrawing;
    this.nPageIndex = nPageIndex;
}
ParaDrawingStruct.prototype.Draw = function(pGraphics)
{
    if(this.oDrawing)
    {
        this.oDrawing.Draw( 0, 0, pGraphics, this.nPageIndex, 0)
    }
};

function CDocContentStructure()
{
    this.m_nType = DRAW_COMMAND_CONTENT;
    this.m_aContent = [];
    this.m_aByLines = null;
    this.m_aDrawingsStruct = [];
 }

CDocContentStructure.prototype.Recalculate = function(oTheme, oColorMap, dWidth, dHeight, oShape)
{
    for(var i = 0; i < this.m_aContent.length; ++i)
    {
        this.m_aContent[i].Recalculate(oTheme, oColorMap, dWidth, dHeight, oShape);
    }
};
CDocContentStructure.prototype.draw = function(graphics, transform, oTheme, oColorMap)
{
    var i;
    for(i = 0; i < this.m_aDrawingsStruct.length; ++i)
    {
        this.m_aDrawingsStruct[i].Draw(graphics);
    }
    for(i = 0; i < this.m_aContent.length; ++i)
    {
        this.m_aContent[i].draw(graphics, transform, oTheme, oColorMap);
    }
};
CDocContentStructure.prototype.checkByWarpStruct = function(oWarpStruct)
{
    var i, j, t;
    switch(oWarpStruct.pathLst.length)
    {
        case 1:
        {
            break;
        }
        case 2:
        case 4:
        case 6:
        {
            var nDivCount = oWarpStruct.pathLst.length >> 1;
            var aByPaths = oWarpStruct.getArrayPolygonsByPaths(PATH_DIV_EPSILON);
            var nLastIndex = 0, aIndex = [],  aWarpedObjects = [], dTmp, oBoundsChecker, oTemp, nIndex, aWarpedObjects2 = [];
            oBoundsChecker = new CSlideBoundsChecker();
            oBoundsChecker.init(100, 100, 100, 100);
            var bCheckBounds = false, dMinX, dMaxX;
            //if(oWarpStruct.pathLst.length > 2)
            {
                bCheckBounds = true;
                for(j = 0; j < this.m_aByLines.length; ++j)
                {
                    oTemp = this.m_aByLines[j];
                    for(t = 0; t < oTemp.length; ++t)
                    {
                        oTemp[t].GetAllWarped(aWarpedObjects2);
                        oTemp[t].CheckBoundsWarped(oBoundsChecker);
                    }
                }
                dMinX = oBoundsChecker.Bounds.min_x;
                dMaxX = oBoundsChecker.Bounds.max_x;
            }



            for( i = 0; i < nDivCount; ++i)
            {
                dTmp = (this.m_aByLines.length - nLastIndex)/(nDivCount - i);
                nIndex = nLastIndex + (dTmp >> 0) + ((dTmp - (dTmp >> 0)) > 0 ? 1 : 0);
                aWarpedObjects.length = 0;
                oBoundsChecker.Bounds.ClearNoAttack();
                for(j = nLastIndex; j < nIndex; ++j)
                {
                    oTemp = this.m_aByLines[j];
                    for(t = 0; t < oTemp.length; ++t)
                    {
                        oTemp[t].GetAllWarped(aWarpedObjects);
                        oTemp[t].CheckBoundsWarped(oBoundsChecker);
                    }
                }
                if(bCheckBounds)
                {
                    if(oBoundsChecker.Bounds.min_x > dMinX)
                    {
                        oBoundsChecker.Bounds.min_x = dMinX;
                    }
                    if(oBoundsChecker.Bounds.max_x < dMaxX)
                    {
                        oBoundsChecker.Bounds.max_x = dMaxX;
                    }
                }
                ObjectsToDrawBetweenTwoPolygons(aWarpedObjects, oBoundsChecker.Bounds, new PolygonWrapper(aByPaths[i << 1]), new PolygonWrapper(aByPaths[(i << 1) + 1]));
                nLastIndex = nIndex;
            }

            var oLastObjectToDraw = null, oCurObjectToDraw;
            for(i = 0; i < aWarpedObjects2.length; ++i)
            {
                if(oLastObjectToDraw === null)
                {
                    oLastObjectToDraw = aWarpedObjects2[i];
                    continue;
                }
                oCurObjectToDraw = aWarpedObjects2[i];
                if(oLastObjectToDraw  && CompareBrushes(oLastObjectToDraw.brush, oCurObjectToDraw.brush) && ComparePens(oLastObjectToDraw.pen, oCurObjectToDraw.pen))
                {
                    oLastObjectToDraw.geometry.pathLst = oLastObjectToDraw.geometry.pathLst.concat(oCurObjectToDraw.geometry.pathLst);
                    oCurObjectToDraw.geometry.pathLst.length = 0;
                }
                else
                {
                    oLastObjectToDraw = oCurObjectToDraw;
                }
            }
            break;
        }
        case 3:
        {
            break;
        }
        default://без формы
        {

            break;
        }
    }

};

function CParagraphStructure()
{
    this.m_nType = DRAW_COMMAND_PARAGRAPH;
    this.m_aContent = [];
}

CParagraphStructure.prototype.Recalculate = function(oTheme, oColorMap, dWidth, dHeight, oShape)
{
    var i;
    for(i = 0; i < this.m_aContent.length; ++i)
    {
        this.m_aContent[i].Recalculate(oTheme, oColorMap, dWidth, dHeight, oShape);
    }
};
CParagraphStructure.prototype.draw = function(graphics, transform, oTheme, oColorMap)
{
    var i;
    for(i = 0; i < this.m_aContent.length; ++i)
    {
        this.m_aContent[i].draw(graphics, transform, oTheme, oColorMap);
    }
};


function CTableStructure()
{
    this.m_nType = DRAW_COMMAND_TABLE;
    this.m_aContent = [];
    this.m_aBorders = [];
}

CTableStructure.prototype.Recalculate = function(oTheme, oColorMap, dWidth, dHeight, oShape)
{
    var i;
    for(i = 0; i < this.m_aContent.length; ++i)
    {
        this.m_aContent[i].Recalculate(oTheme, oColorMap, dWidth, dHeight, oShape);
    }

    for(i = 0; i < this.m_aBorders.length; ++i)
    {
        this.m_aBorders[i].Recalculate(oTheme, oColorMap, dWidth, dHeight, oShape);
    }
};
CTableStructure.prototype.draw = function(graphics, transform, oTheme, oColorMap)
{
    var i;
    for(i = 0; i < this.m_aBorders.length; ++i)
    {
        this.m_aBorders[i].draw(graphics, undefined, undefined, oTheme, oColorMap);
    }

    for(i = 0; i < this.m_aContent.length; ++i)
    {
        this.m_aContent[i].draw(graphics, transform, oTheme, oColorMap);
    }
};



function CLineStructure(oLine)
{
    this.m_nType = DRAW_COMMAND_LINE;
    this.m_oLine = oLine;
    this.m_aContent = [];//ObjectToDraw
    this.m_aBorders = [];
    this.m_aBackgrounds = [];
    this.m_aUnderlinesStrikeouts = [];
    this.m_aParagraphBackgrounds = [];
    this.m_nDrawType = 0;// 0 - content, 1 - borders, 2 - backgrounds, 3 - underlinestrikeouts, 4 - paragraphbackrounds
}

CLineStructure.prototype.Recalculate = function(oTheme, oColorMap, dWidth, dHeight, oShape)
{
    var i;
    for(i = 0; i < this.m_aContent.length; ++i)
    {
        this.m_aContent[i].Recalculate(oTheme, oColorMap, dWidth, dHeight, oShape, this.m_oLine);
    }
    for(i = 0; i < this.m_aBorders.length; ++i)
    {
        this.m_aBorders[i].Recalculate(oTheme, oColorMap, dWidth, dHeight, oShape, this.m_oLine);
    }
    for(i = 0; i < this.m_aBackgrounds.length; ++i)
    {
        this.m_aBackgrounds[i].Recalculate(oTheme, oColorMap, dWidth, dHeight, oShape, this.m_oLine);
    }
    for(i = 0; i < this.m_aUnderlinesStrikeouts.length; ++i)
    {
        this.m_aUnderlinesStrikeouts[i].Recalculate(oTheme, oColorMap, dWidth, dHeight, oShape, this.m_oLine);
    }
    for(i = 0; i < this.m_aParagraphBackgrounds.length; ++i)
    {
        this.m_aParagraphBackgrounds[i].Recalculate(oTheme, oColorMap, dWidth, dHeight, oShape, this.m_oLine);
    }
};
CLineStructure.prototype.GetAllWarped = function(aWarpedObjects)
{
    var i;
    for(i = 0; i < this.m_aContent.length; ++i)
    {
        aWarpedObjects.push(this.m_aContent[i]);
    }
    for(i = 0; i < this.m_aBackgrounds.length; ++i)
    {
        aWarpedObjects.push(this.m_aBackgrounds[i]);
    }
    for(i = 0; i < this.m_aUnderlinesStrikeouts.length; ++i)
    {
        aWarpedObjects.push(this.m_aUnderlinesStrikeouts[i]);
    }
};
CLineStructure.prototype.CheckBoundsWarped = function(graphics)
{
    var i;
    for(i = 0; i < this.m_aContent.length; ++i)
    {
        this.m_aContent[i].draw(graphics, true);
    }
    for(i = 0; i < this.m_aBackgrounds.length; ++i)
    {
        this.m_aBackgrounds[i].draw(graphics, true);
    }
    for(i = 0; i < this.m_aUnderlinesStrikeouts.length; ++i)
    {
        this.m_aUnderlinesStrikeouts[i].draw(graphics, true);
    }
};
CLineStructure.prototype.draw = function(graphics, transform, oTheme, oColorMap)
{
    var i;
    for(i = 0; i < this.m_aParagraphBackgrounds.length; ++i)
    {
        this.m_aParagraphBackgrounds[i].draw(graphics, undefined, transform, oTheme, oColorMap);
    }
    for(i = 0; i < this.m_aBorders.length; ++i)
    {
        this.m_aBorders[i].draw(graphics);
    }
    for(i = 0; i < this.m_aBackgrounds.length; ++i)
    {
        this.m_aBackgrounds[i].draw(graphics, undefined, transform, oTheme, oColorMap);
    }
    for(i = 0; i < this.m_aContent.length; ++i)
    {
        this.m_aContent[i].draw(graphics, undefined, transform, oTheme, oColorMap);
    }
    for(i = 0; i < this.m_aUnderlinesStrikeouts.length; ++i)
    {
        this.m_aUnderlinesStrikeouts[i].draw(graphics, undefined, transform, oTheme, oColorMap);
    }
};



var DRAW_COMMAND_TABLE = 0x01;
var DRAW_COMMAND_CONTENT = 0x02;
var DRAW_COMMAND_PARAGRAPH = 0x03;
var DRAW_COMMAND_LINE = 0x04;
var DRAW_COMMAND_DRAWING = 0x05;
var DRAW_COMMAND_HIDDEN_ELEM = 0x06;
var DRAW_COMMAND_NO_CREATE_GEOM = 0x07;
var DRAW_COMMAND_TABLE_ROW = 0x08;

function GetConstDescription(nConst)
{
    switch (nConst)
    {
        case DRAW_COMMAND_TABLE:
        {
            return "DRAW_COMMAND_TABLE";
        }
        case DRAW_COMMAND_CONTENT:
        {
            return "DRAW_COMMAND_CONTENT";
        }
        case DRAW_COMMAND_PARAGRAPH:
        {
            return "DRAW_COMMAND_PARAGRAPH";
        }
        case DRAW_COMMAND_LINE:
        {
            return "DRAW_COMMAND_LINE";
        }
        case DRAW_COMMAND_DRAWING:
        {
            return "DRAW_COMMAND_DRAWING";
        }
        case DRAW_COMMAND_HIDDEN_ELEM:
        {
            return "DRAW_COMMAND_HIDDEN_ELEM";
        }
        case DRAW_COMMAND_NO_CREATE_GEOM:
        {
            return "DRAW_COMMAND_NO_CREATE_GEOM";
        }
        case DRAW_COMMAND_TABLE_ROW:
        {
            return "DRAW_COMMAND_TABLE_ROW";
        }
        default :
        {
            return "Unknown";
        }
    }
}

function CreatePenFromParams(oUnifill, nStyle, nLineCap, nLineJoin, dLineWidth, dSize)
{
    var oLine = new CLn();
    oLine.setW(dSize * 36000 >> 0);
    oLine.setFill(oUnifill);


    //TODO
    // this.Color      = { R : 255, G : 255, B : 255, A : 255 };
    // this.Style      = 0;
    // this.LineCap    = 0;
    // this.LineJoin   = 0;
//
    // this.LineWidth  = 1;

    return oLine;
}

function CTextDrawer(dWidth, dHeight, bDivByLInes, oTheme)
{
    this.m_oFont =
    {
        Name     : "",
        FontSize : -1,
        Style    : -1
    };

    this.m_oTheme = oTheme;
    this.Width = dWidth;
    this.Height = dHeight;
    this.m_oTransform = new CMatrix();
    this.pathW = 43200;
    this.pathH = 43200;

    this.xKoeff = this.pathW/this.Width;
    this.yKoeff = this.pathH/this.Height;

    this.m_aStack = [];
    this.m_oDocContentStructure = null;
    this.m_aCommands = [];
    this.m_aDrawings = [];
    // RFonts
    this.m_oTextPr      = null;
    this.m_oGrFonts     = new CGrRFonts();

    this.m_oPen     = new CPen();
    this.m_oBrush   = new CBrush();

    this.m_oLine = null;
    this.m_oFill = null;


    // чтобы выставилось в первый раз
    this.m_oPen.Color.R     = -1;
    this.m_oBrush.Color1.R  = -1;
    this.m_oBrush.Color2.R  = -1;

    // просто чтобы не создавать каждый раз
    this.m_oFontSlotFont = new CFontSetup();
    this.LastFontOriginInfo = { Name : "", Replace : null };

    this.GrState = new CGrState();
    this.GrState.Parent = this;

    this.m_bDivByLines = bDivByLInes === true;
    this.m_aByLines = null;
    this.m_nCurLineIndex = -1;
    this.m_aStackLineIndex = null;
    this.m_aStackCurRowMaxIndex = null;
    this.m_aByParagraphs = null;

    if(this.m_bDivByLines)
    {
        this.m_aByLines = [];
        this.m_aStackLineIndex = [];
        this.m_aStackCurRowMaxIndex = [];
    }
    else
    {
        this.m_aByParagraphs = [];
    }
}

CTextDrawer.prototype =
{
    // pen methods
    p_color : function(r,g,b,a)
    {
        if (this.m_oPen.Color.R != r || this.m_oPen.Color.G != g || this.m_oPen.Color.B != b)
        {
            this.m_oPen.Color.R = r;
            this.m_oPen.Color.G = g;
            this.m_oPen.Color.B = b;
        }
        if (this.m_oPen.Color.A != a)
        {
            this.m_oPen.Color.A = a;
        }

        this.Get_PathToDraw(false, true);
    },
    p_width : function(w)
    {
        var val = w / 1000;
        if (this.m_oPen.Size != val)
        {
            this.m_oPen.Size = val;
        }

        this.Get_PathToDraw(false, true);
    },
    // brush methods
    b_color1 : function(r,g,b,a)
    {
        if (this.m_oBrush.Color1.R != r || this.m_oBrush.Color1.G != g || this.m_oBrush.Color1.B != b)
        {
            this.m_oBrush.Color1.R = r;
            this.m_oBrush.Color1.G = g;
            this.m_oBrush.Color1.B = b;
        }
        if (this.m_oBrush.Color1.A != a)
        {
            this.m_oBrush.Color1.A = a;
        }

        this.Get_PathToDraw(false, true);
    },
    b_color2 : function(r,g,b,a)
    {
        if (this.m_oBrush.Color2.R != r || this.m_oBrush.Color2.G != g || this.m_oBrush.Color2.B != b)
        {
            this.m_oBrush.Color2.R = r;
            this.m_oBrush.Color2.G = g;
            this.m_oBrush.Color2.B = b;
        }
        if (this.m_oBrush.Color2.A != a)
        {
            this.m_oBrush.Color2.A = a;
        }

        this.Get_PathToDraw(false, true);
    },

    put_brushTexture : function(src, mode)
    {
        this.m_oBrush.Color1.R = -1;
        this.m_oBrush.Color1.G = -1;
        this.m_oBrush.Color1.B = -1;
        this.m_oBrush.Color1.A = -1;
        this.Get_PathToDraw(false, true);
    },

    SetShd: function(oShd)
    {
        if(oShd)
        {
            if (oShd.Value !== shd_Nil)
            {
                if(oShd.Unifill)
                {
                    this.m_oFill = oShd.Unifill;
                }
                else
                {
                    if(oShd.Color)
                    {
                        this.m_oFill = CreateUnfilFromRGB(oShd.Color.r, oShd.Color.g, oShd.Color.b);
                    }
                    else
                    {
                        this.m_oFill = null;
                    }
                }
            }
            else
            {
                this.m_oFill = null;
            }
        }
        else
        {
            this.m_oFill = null;
        }
        this.Get_PathToDraw(false, true);
    },


    SetBorder: function(oBorder)
    {
        if(oBorder && oBorder.Value !== border_None)
        {
            this.m_oLine = CreatePenFromParams(oBorder.Unifill ? oBorder.Unifill : CreateUnfilFromRGB(oBorder.Color.r, oBorder.Color.g, oBorder.Color.b), this.m_oPen.Style, this.m_oPen.LineCap, this.m_oPen.LineJoin, this.m_oPen.LineWidth, this.m_oPen.Size);
        }
        else
        {
            this.m_oLine = null;
        }
        //TODO
    },

    SetAdditionalProps: function(oProps)
    {
        oProps && this.SetTextPr(oProps, this.m_oTheme);
    },

    put_BrushTextureAlpha : function(alpha)
    {
    },

    put_BrushGradient : function(gradFill, points, transparent)
    {
    },

    StartCheckTableDraw: function()
    {
        this.Start_Command(DRAW_COMMAND_TABLE);
    },

    EndCheckTableDraw: function()
    {
        this.End_Command();
    },

    Start_Command : function(commandId, param, index, nType)
    {
        //console.log(GetConstDescription(commandId) +  " Start ");
        //console.log("--------Start------");
        //console.log("CurLineIndex " + this.m_nCurLineIndex);
        //console.log("--------Start------");
        this.m_aCommands.push(commandId);
        var oNewStructure = null;
        switch(commandId)
        {
            case DRAW_COMMAND_NO_CREATE_GEOM:
            {
                break;
            }
            case DRAW_COMMAND_CONTENT:
            {
                oNewStructure = new CDocContentStructure();
                this.m_aStackLineIndex.push(this.m_nCurLineIndex);
                break;
            }
            case DRAW_COMMAND_PARAGRAPH:
            {
                oNewStructure = new CParagraphStructure();
                if(!this.m_bDivByLines)
                {
                    this.m_aByParagraphs[this.m_aByParagraphs.length] = [];
                }
                break;
            }
            case DRAW_COMMAND_LINE:
            {
                var oPrevStruct = this.m_aStack[this.m_aStack.length - 1];
                if(oPrevStruct.m_nType === DRAW_COMMAND_PARAGRAPH && oPrevStruct.m_aContent[index])
                {
                    oPrevStruct.m_aContent[index].m_nDrawType = nType;
                    this.m_aStack.push(oPrevStruct.m_aContent[index]);
                }
                else
                {
                    oNewStructure = new CLineStructure(param);
                    oNewStructure.m_nDrawType = nType;
                    if(this.m_bDivByLines)
                    {
                        ++this.m_nCurLineIndex;
                        if(!Array.isArray(this.m_aByLines[this.m_nCurLineIndex]))
                        {
                            this.m_aByLines[this.m_nCurLineIndex] = [];
                        }
                        this.m_aByLines[this.m_nCurLineIndex].push(oNewStructure);
                        if(this.m_aStackCurRowMaxIndex[this.m_aStackCurRowMaxIndex.length - 1] < this.m_nCurLineIndex)
                        {
                            this.m_aStackCurRowMaxIndex[this.m_aStackCurRowMaxIndex.length - 1] = this.m_nCurLineIndex;
                        }
                    }
                    else
                    {
                        this.m_aByParagraphs[this.m_aByParagraphs.length - 1].push(oNewStructure);
                    }
                }
                break;
            }
            case DRAW_COMMAND_TABLE:
            {
                oNewStructure = new CTableStructure();
                break;
            }
            case DRAW_COMMAND_DRAWING:
            {
                break;
            }
            case DRAW_COMMAND_HIDDEN_ELEM:
            {
                break;
            }
            case DRAW_COMMAND_TABLE_ROW:
            {
                this.m_aStackCurRowMaxIndex[this.m_aStackCurRowMaxIndex.length] = -1;
                break;
            }
        }
        //console.log("--------End------");
        //console.log("CurLineIndex " + this.m_nCurLineIndex);
        //console.log("--------End------");
        if(oNewStructure)
        {
            if(this.m_aStack[this.m_aStack.length - 1])
            {
                this.m_aStack[this.m_aStack.length - 1].m_aContent.push(oNewStructure);
            }
            this.m_aStack.push(oNewStructure);
        }
    },

    End_Command : function()
    {
        var nCommandId = this.m_aCommands.pop();
        //console.log(GetConstDescription(nCommandId) + " End");
        switch(nCommandId)
        {
            case DRAW_COMMAND_NO_CREATE_GEOM:
            {
                break;
            }
            case DRAW_COMMAND_CONTENT:
            {
                var oDocContentStructure = this.m_aStack.pop();
                if(this.m_aStack.length === 0)
                {
                    this.m_oDocContentStructure = oDocContentStructure;
                    this.m_oDocContentStructure.m_aByLines = this.m_aByLines;
                    this.m_oDocContentStructure.m_aByParagraphs = this.m_aByParagraphs;
                    this.m_oDocContentStructure.m_aDrawingsStruct = this.m_aDrawings;
                    this.m_aByLines = [];
                    this.m_aByParagraphs = [];
                    this.m_aDrawings = [];
                }
                if(this.m_bDivByLines)
                {
                    this.m_nCurLineIndex = this.m_aStackLineIndex.pop();
                }
                break;
            }
            case DRAW_COMMAND_PARAGRAPH:
            {
                this.m_aStack.pop();
                break;
            }
            case DRAW_COMMAND_LINE:
            {
                this.m_aStack.pop();
                break;
            }
            case DRAW_COMMAND_TABLE:
            {
                this.m_aStack.pop();
                break;
            }
            case DRAW_COMMAND_DRAWING:
            {
                break;
            }
            case DRAW_COMMAND_HIDDEN_ELEM:
            {
                break;
            }
            case DRAW_COMMAND_TABLE_ROW:
            {
                this.m_nCurLineIndex = this.m_aStackCurRowMaxIndex.pop();
                break;
            }
        }
    },

    Get_PathToDraw : function(bStart, bStart2)
    {
        var oPath = null;
        var oLastCommand = this.m_aStack[this.m_aStack.length - 1];
        var oLastObjectToDraw, oBrushColor = this.m_oBrush.Color1, oPenColor = this.m_oPen.Color;
        if(oLastCommand)
        {
            switch(oLastCommand.m_nType)
            {
                case DRAW_COMMAND_LINE:
                {
                    switch(oLastCommand.m_nDrawType)
                    {
                        case 0://content
                        {
                            if(oLastCommand.m_aContent.length === 0)
                            {
                                oLastCommand.m_aContent.push(new ObjectToDraw(this.GetFillFromTextPr(this.m_oTextPr), this.GetPenFromTextPr(this.m_oTextPr), this.Width, this.Height, new Geometry(), this.m_oTransform, this));
                            }
                            oLastObjectToDraw = oLastCommand.m_aContent[oLastCommand.m_aContent.length - 1];

                            if(bStart2)
                            {
                                if(oLastObjectToDraw.geometry.pathLst.length === 0 || (oLastObjectToDraw.geometry.pathLst.length === 1 && oLastObjectToDraw.geometry.pathLst[0].ArrPathCommandInfo.length === 0))
                                {
                                    oLastObjectToDraw.resetBrushPen(this.GetFillFromTextPr(this.m_oTextPr), this.GetPenFromTextPr(this.m_oTextPr))
                                }
                                else
                                {
                                    oLastCommand.m_aContent.push(new ObjectToDraw(this.GetFillFromTextPr(this.m_oTextPr), this.GetPenFromTextPr(this.m_oTextPr), this.Width, this.Height, new Geometry(), this.m_oTransform, this));
                                    oLastObjectToDraw = oLastCommand.m_aContent[oLastCommand.m_aContent.length - 1];
                                }
                            }
                            break;
                        }
                        case 1://borders
                        {
                            if(oLastCommand.m_aBorders.length === 0)
                            {
                                oLastCommand.m_aBorders.push(new ObjectToDraw(this.m_oFill, this.m_oLine, this.Width, this.Height, new Geometry(), this.m_oTransform, this))
                            }
                            oLastObjectToDraw = oLastCommand.m_aBorders[oLastCommand.m_aBorders.length - 1];

                            if(bStart2)
                            {
                                if(oLastObjectToDraw.geometry.pathLst.length === 0 || (oLastObjectToDraw.geometry.pathLst.length === 1 && oLastObjectToDraw.geometry.pathLst[0].ArrPathCommandInfo.length === 0))
                                {
                                    oLastObjectToDraw.resetBrushPen(this.m_oFill, this.m_oLine);
                                }
                                else
                                {
                                    oLastCommand.m_aBorders.push(new ObjectToDraw(this.m_oFill, this.m_oLine, this.Width, this.Height, new Geometry(), this.m_oTransform, this));
                                    oLastObjectToDraw = oLastCommand.m_aBorders[oLastCommand.m_aBorders.length - 1];
                                }
                            }
                            break;
                        }
                        case 2://backgrounds
                        {
                            if(oLastCommand.m_aBackgrounds.length === 0)
                            {
                                oLastCommand.m_aBackgrounds.push(new ObjectToDraw(this.m_oFill, this.m_oLine, this.Width, this.Height, new Geometry(), this.m_oTransform, this))
                            }
                            oLastObjectToDraw = oLastCommand.m_aBackgrounds[oLastCommand.m_aBackgrounds.length - 1];

                            if(bStart2)
                            {
                                if(oLastObjectToDraw.geometry.pathLst.length === 0 || (oLastObjectToDraw.geometry.pathLst.length === 1 && oLastObjectToDraw.geometry.pathLst[0].ArrPathCommandInfo.length === 0))
                                {
                                    oLastObjectToDraw.resetBrushPen(this.m_oFill, this.m_oLine);
                                }
                                else
                                {
                                    oLastCommand.m_aBackgrounds.push(new ObjectToDraw(this.m_oFill, this.m_oLine, this.Width, this.Height, new Geometry(), this.m_oTransform, this));
                                    oLastObjectToDraw = oLastCommand.m_aBackgrounds[oLastCommand.m_aBackgrounds.length - 1];
                                }
                            }
                            break;
                        }
                        case 3://Underliens & Strikeouts
                        {
                            if(oLastCommand.m_aUnderlinesStrikeouts.length === 0)
                            {
                                oBrushColor = this.m_oBrush.Color1;
                                oPenColor = this.m_oPen.Color;
                                oLastCommand.m_aUnderlinesStrikeouts.push(new ObjectToDraw(this.GetFillFromTextPr(this.m_oTextPr), this.GetPenFromTextPr(this.m_oTextPr), this.Width, this.Height, new Geometry(), this.m_oTransform, this))
                            }
                            oLastObjectToDraw = oLastCommand.m_aUnderlinesStrikeouts[oLastCommand.m_aUnderlinesStrikeouts.length - 1];

                            if(bStart2)
                            {
                                if(oLastObjectToDraw.geometry.pathLst.length === 0 || (oLastObjectToDraw.geometry.pathLst.length === 1 && oLastObjectToDraw.geometry.pathLst[0].ArrPathCommandInfo.length === 0))
                                {
                                    oLastObjectToDraw.resetBrushPen(this.GetFillFromTextPr(this.m_oTextPr), this.GetPenFromTextPr(this.m_oTextPr));
                                }
                                else
                                {
                                    oLastCommand.m_aUnderlinesStrikeouts.push(new ObjectToDraw(this.GetFillFromTextPr(this.m_oTextPr), this.GetPenFromTextPr(this.m_oTextPr), this.Width, this.Height, new Geometry(), this.m_oTransform, this));
                                    oLastObjectToDraw = oLastCommand.m_aUnderlinesStrikeouts[oLastCommand.m_aUnderlinesStrikeouts.length - 1];
                                }
                            }
                            break;
                        }

                        case 4:
                        {
                            if(oLastCommand.m_aParagraphBackgrounds.length === 0)
                            {
                                oLastCommand.m_aParagraphBackgrounds.push(new ObjectToDraw(this.m_oFill, this.m_oLine, this.Width, this.Height, new Geometry(), this.m_oTransform, this))
                            }
                            oLastObjectToDraw = oLastCommand.m_aParagraphBackgrounds[oLastCommand.m_aParagraphBackgrounds.length - 1];

                            if(bStart2)
                            {
                                if(oLastObjectToDraw.geometry.pathLst.length === 0 || (oLastObjectToDraw.geometry.pathLst.length === 1 && oLastObjectToDraw.geometry.pathLst[0].ArrPathCommandInfo.length === 0))
                                {
                                    oLastObjectToDraw.resetBrushPen(this.m_oFill, this.m_oLine);
                                }
                                else
                                {
                                    oLastCommand.m_aParagraphBackgrounds.push(new ObjectToDraw(this.m_oFill, this.m_oLine, this.Width, this.Height, new Geometry(), this.m_oTransform, this));
                                    oLastObjectToDraw = oLastCommand.m_aParagraphBackgrounds[oLastCommand.m_aParagraphBackgrounds.length - 1];
                                }
                            }
                            break;
                        }
                    }
                    break;
                }
                case DRAW_COMMAND_TABLE:
                {
                    if(oLastCommand.m_aBorders.length === 0 || bStart2)
                    {
                        oBrushColor = this.m_oBrush.Color1;
                        oPenColor = this.m_oPen.Color;
                        oLastCommand.m_aBorders.push(new ObjectToDraw(this.m_oFill, this.m_oLine, this.Width, this.Height, new Geometry(), this.m_oTransform, this))
                    }
                    oLastObjectToDraw = oLastCommand.m_aBorders[oLastCommand.m_aBorders.length - 1];

                    if(bStart2)
                    {
                        if(oLastObjectToDraw.geometry.pathLst.length === 0 || (oLastObjectToDraw.geometry.pathLst.length === 1 && oLastObjectToDraw.geometry.pathLst[0].ArrPathCommandInfo.length === 0))
                        {
                            oLastObjectToDraw.resetBrushPen(this.m_oFill, this.m_oLine);
                        }
                        else
                        {
                            oLastCommand.m_aBorders.push(new ObjectToDraw(this.m_oFill, this.m_oLine, this.Width, this.Height, new Geometry(), this.m_oTransform, this));
                            oLastObjectToDraw = oLastCommand.m_aBorders[oLastCommand.m_aBorders.length - 1];
                        }
                    }
                    break;
                }
                case DRAW_COMMAND_PARAGRAPH:
                {
                    break;
                }
            }
        }
        if(oLastObjectToDraw && oLastObjectToDraw.geometry)
        {
            if(oLastObjectToDraw.geometry.pathLst.length === 0 || bStart)
            {
                oPath = new Path();
                oPath.setPathW(this.pathW);
                oPath.setPathH(this.pathH);
                oPath.setExtrusionOk(false);
                oPath.setFill("norm");
                oPath.setStroke(true);
                oLastObjectToDraw.geometry.AddPath(oPath)
            }
            else
            {
                oPath = oLastObjectToDraw.geometry.pathLst[oLastObjectToDraw.geometry.pathLst.length-1];
            }
        }
        return oPath;
    },


    transform : function(sx,shy,shx,sy,tx,ty)
    {
        if (this.m_oTransform.sx    != sx || this.m_oTransform.shx   != shx || this.m_oTransform.shy   != shy ||
            this.m_oTransform.sy    != sy || this.m_oTransform.tx    != tx || this.m_oTransform.ty    != ty)
        {
            this.m_oTransform.sx    = sx;
            this.m_oTransform.shx   = shx;
            this.m_oTransform.shy   = shy;
            this.m_oTransform.sy    = sy;
            this.m_oTransform.tx    = tx;
            this.m_oTransform.ty    = ty;
        }
    },
    // path commands
    _s : function()
    {
        this.Get_PathToDraw(true);
    },
    _e : function()
    {
    },
    _z : function()
    {
        var oPathToDraw = this.Get_PathToDraw();
        if(oPathToDraw)
        {
            oPathToDraw.close();
        }
    },
    _m : function(x,y)
    {
        var oPathToDraw = this.Get_PathToDraw();
        if(oPathToDraw)
        {
            oPathToDraw.moveTo(this.xKoeff*x, this.yKoeff*y);
        }
    },
    _l : function(x,y)
    {
        var oPathToDraw = this.Get_PathToDraw();
        if(oPathToDraw)
        {
            oPathToDraw.lnTo(this.xKoeff*x, this.yKoeff*y);
        }
    },
    _c : function(x1,y1,x2,y2,x3,y3)
    {
        var oPathToDraw = this.Get_PathToDraw();
        if(oPathToDraw)
        {
            oPathToDraw.cubicBezTo(this.xKoeff*x1, this.yKoeff*y1, this.xKoeff*x2, this.yKoeff*y2, this.xKoeff*x3, this.yKoeff*y3);
        }
    },
    _c2 : function(x1,y1,x2,y2)
    {
        var oPathToDraw = this.Get_PathToDraw();
        if(oPathToDraw)
        {
            oPathToDraw.quadBezTo(this.xKoeff*x1, this.yKoeff*y1, this.xKoeff*x2, this.yKoeff*y2);
        }
    },
    ds : function()
    {
    },
    df : function()
    {
    },

    drawpath : function(type)
    {
    },

    // canvas state
    save : function()
    {
    },
    restore : function()
    {
    },
    clip : function()
    {
    },

    SetIntegerGrid: function()
    {
    },

    // images
    drawImage : function(img,x,y,w,h)
    {
    },

    SetFont : function(font)
    {
        if (null == font)
            return;

        var style = 0;
        if (font.Italic == true)
            style += 2;
        if (font.Bold == true)
            style += 1;

        var fontinfo = g_fontApplication.GetFontInfo(font.FontFamily.Name, style, this.LastFontOriginInfo);
        style = fontinfo.GetBaseStyle(style);

        if (this.m_oFont.Name != fontinfo.Name)
        {
            this.m_oFont.Name = fontinfo.Name;
        }
        if (this.m_oFont.FontSize != font.FontSize)
        {
            this.m_oFont.FontSize = font.FontSize;
        }
        if (this.m_oFont.Style != style)
        {
            this.m_oFont.Style = style;
        }
    },
    FillText : function(x,y,text)
    {
        this.FillTextCode(x, y, text.charCodeAt(0));
    },
    FillTextCode : function(x,y,code)
    {
        var _font_info = window.g_font_infos[window.g_map_font_index[this.m_oFont.Name]];
        //var _is_face_index_no_0 = (_font_info.faceIndexR <= 0 && _font_info.faceIndexI <= 0 && _font_info.faceIndexB <= 0 && _font_info.faceIndexBI <= 0);
//
        //if (code < 0xFFFF && (_is_face_index_no_0 || window["native"] !== undefined))
        //    return;

        g_fontApplication.LoadFont(_font_info.Name, window.g_font_loader, g_oTextMeasurer.m_oManager, this.m_oFont.FontSize, Math.max(this.m_oFont.Style, 0), 72, 72);

        if (null != this.LastFontOriginInfo.Replace)
        {
            code = g_fontApplication.GetReplaceGlyph(code, this.LastFontOriginInfo.Replace);
        }

        g_oTextMeasurer.m_oManager.LoadStringPathCode(code, false, x, y, this);
    },
    tg : function(gid,x,y)
    {
        g_fontApplication.LoadFont(this.m_oFont.Name, window.g_font_loader, g_oTextMeasurer.m_oManager, this.m_oFont.FontSize, Math.max(this.m_oFont.Style, 0), 72, 72);
        g_oTextMeasurer.m_oManager.LoadStringPathCode(gid, true, x, y, this);
    },
    charspace : function(space)
    {
    },

    beginCommand : function(command)
    {
    },
    endCommand : function(command)
    {
    },

    put_PenLineJoin : function(_join)
    {
    },
    put_TextureBounds : function(x, y, w, h)
    {
    },
    put_TextureBoundsEnabled : function(bIsEnabled)
    {
    },

    SetFontSlot : function(slot, fontSizeKoef)
    {
        var _rfonts = this.m_oGrFonts;
        var _lastFont = this.m_oFontSlotFont;

        switch (slot)
        {
            case fontslot_ASCII:
            {
                _lastFont.Name   = _rfonts.Ascii.Name;
                _lastFont.Size = this.m_oTextPr.FontSize;
                _lastFont.Bold = this.m_oTextPr.Bold;
                _lastFont.Italic = this.m_oTextPr.Italic;

                break;
            }
            case fontslot_CS:
            {
                _lastFont.Name   = _rfonts.CS.Name;
                _lastFont.Size = this.m_oTextPr.FontSizeCS;
                _lastFont.Bold = this.m_oTextPr.BoldCS;
                _lastFont.Italic = this.m_oTextPr.ItalicCS;

                break;
            }
            case fontslot_EastAsia:
            {
                _lastFont.Name   = _rfonts.EastAsia.Name;
                _lastFont.Size = this.m_oTextPr.FontSize;
                _lastFont.Bold = this.m_oTextPr.Bold;
                _lastFont.Italic = this.m_oTextPr.Italic;

                break;
            }
            case fontslot_HAnsi:
            default:
            {
                _lastFont.Name   = _rfonts.HAnsi.Name;
                _lastFont.Size = this.m_oTextPr.FontSize;
                _lastFont.Bold = this.m_oTextPr.Bold;
                _lastFont.Italic = this.m_oTextPr.Italic;

                break;
            }
        }
        if (undefined !== fontSizeKoef)
            _lastFont.Size *= fontSizeKoef;

        var style = 0;
        if (_lastFont.Italic == true)
            style += 2;
        if (_lastFont.Bold == true)
            style += 1;

        var fontinfo = g_fontApplication.GetFontInfo(_lastFont.Name, style, this.LastFontOriginInfo);
        style = fontinfo.GetBaseStyle(style);

        if (this.m_oFont.Name != fontinfo.Name)
        {
            this.m_oFont.Name = fontinfo.Name;
        }
        if (this.m_oFont.FontSize != _lastFont.Size)
        {
            this.m_oFont.FontSize = _lastFont.Size;
        }
        if (this.m_oFont.Style != style)
        {
            this.m_oFont.Style = style;
        }
    },

    BeginPage : function(width,height)
    {
    },
    EndPage : function()
    {
    },

    transform3 : function(m)
    {
        this.transform(m.sx, m.shy, m.shx, m.sy, m.tx, m.ty);
    },
    reset : function()
    {
        this.transform(1, 0, 0, 1, 0, 0);
    },

    FillText2 : function(x,y,text)
    {
        this.FillText(x,y,text);
    },
    GetIntegerGrid : function()
    {
    },
    GetFont : function()
    {
        return this.m_oFont;
    },
    put_GlobalAlpha : function(enable, alpha)
    {
    },

    Start_GlobalAlpha : function()
    {
    },

    End_GlobalAlpha : function()
    {
    },

    DrawHeaderEdit : function(yPos)
    {
    },

    DrawFooterEdit : function(yPos)
    {
    },

    drawCollaborativeChanges : function(x, y, w, h)
    {
    },

    drawSearchResult : function(x, y, w, h)
    {
    },

    DrawEmptyTableLine : function(x1,y1,x2,y2)
    {
        // эта функция не для печати или сохранения вообще
    },
    DrawLockParagraph : function(lock_type, x, y1, y2)
    {
        // эта функция не для печати или сохранения вообще
    },

    DrawLockObjectRect : function(lock_type, x, y, w, h)
    {
        // эта функция не для печати или сохранения вообще
    },

    DrawSpellingLine : function(y0, x0, x1, w)
    {
    },

    checkCurveBezier: function(x0, y0, x1, y1, x2, y2, x3, y3)
    {
        var arr_point = partition_bezier4(x0, y0, x1, y1, x2, y2, x3, y3, UNDERLINE_DIV_EPSILON), i, count = arr_point.length >> 2;
        for(i = 0; i < count; ++i)
        {
            var k = 4*i;
            this._c(arr_point[k + 1].x, arr_point[k + 1].y, arr_point[k + 2].x, arr_point[k + 2].y, arr_point[k + 3].x, arr_point[k + 3].y);
        }
    },
    // smart methods for horizontal / vertical lines
    drawHorLine : function(align, y, x, r, penW, AdditionalData)
    {
      // if(!AdditionalData)
      // {
      //     this.p_width(1000 * penW);
      //     this._s();

      //     this._m(x, y);
      //     this._l(r, y);

      //     this.ds();

      //     this._e();
      // }
       // else
        {
            this._s();
            this._m(x, y);

            this.checkCurveBezier(x, y, x + ((r-x)/3), y, x + (2/3) * (r - x), y, r, y);// this._l(r, y);
            this._l(r, y + penW);
            this.checkCurveBezier(r, y + penW, x + (2/3) * (r - x), y + penW, x + ((r-x)/3), y + penW, x, y + penW);//this._l(x, y + penW);
            this._z();
            this.ds();
        }
    },

    drawHorLine2 : function(align, y, x, r, penW)
    {

        var _y = y;
        switch (align)
        {
            case 0:
            {
                _y = y + penW / 2;
                break;
            }
            case 1:
            {
                break;
            }
            case 2:
            {
                _y = y - penW / 2;
                break;
            }
        }
       // if(!AdditionalData)
       // {
       //     this.p_width(1000 * penW);
//
//
       //     this._s();
       //     this._m(x, (_y - penW));
       //     this._l(r, (_y - penW));
       //     this.ds();
//
       //     this._s();
       //     this._m(x, (_y + penW));
       //     this._l(r, (_y + penW));
       //     this.ds();
//
       //     this._e();
       // }
       // else
        {

            this._s();
            this._m(x, (_y - penW ));

            this.checkCurveBezier(x, _y - penW, x + ((r-x)/3), _y - penW, x + (2/3) * (r - x), _y - penW, r, _y - penW);//this._l(r, (_y - penW ));
            this._l(r, _y);
            this.checkCurveBezier(r, _y, x + (2/3) * (r - x), _y, x + ((r-x)/3), _y, x, _y);//this._l(x, (_y - penW + penW));
            this._z();
            this.ds();
            this.df();

            this._s();
            this._m(x, (_y + penW ));
            this.checkCurveBezier(x, _y + penW, x + ((r-x)/3), _y + penW, x + (2/3) * (r - x), _y + penW, r, _y + penW);//this._l(r, (_y + penW ));
            this._l(r, (_y + penW + penW));
            this.checkCurveBezier(r, (_y + penW + penW), x + (2/3) * (r - x), _y + penW + penW, x + ((r-x)/3), _y + penW + penW,  x, _y + penW + penW);//this._l(x, (_y + penW + penW));
            this._z();
            this.ds();

            this._e();
        }
    },

    drawVerLine : function(align, x, y, b, penW)
    {
        this.p_width(1000 * penW);
        this._s();

        var _x = x;
        switch (align)
        {
            case 0:
            {
                _x = x + penW / 2;
                break;
            }
            case 1:
            {
                break;
            }
            case 2:
            {
                _x = x - penW / 2;
            }
        }
        this._m(_x, y);
        this._l(_x, b);

        this.ds();
    },

    // мега крутые функции для таблиц
    drawHorLineExt : function(align, y, x, r, penW, leftMW, rightMW)
    {
        this.drawHorLine(align, y, x + leftMW, r + rightMW, penW);
    },

    rect : function(x,y,w,h)
    {
        var oLastCommand = this.m_aStack[this.m_aStack.length - 1];
        if(oLastCommand && (oLastCommand.m_nDrawType === 2 || oLastCommand.m_nDrawType === 4))
        {
            this._s();
            this._m(x, y);

            this.checkCurveBezier(x, y, x + (w/3), y, x + (2/3) *w, y, x+w, y);// this._l(r, y);
            this._l(x+w, y + h);
            this.checkCurveBezier(x + w, y + h, x + (2/3) * (w), y + h, x + (w/3), y + h, x, y + h);//this._l(x, y + penW);
            this._z();
            this.ds();
        }
        else
        {
            var _x = x;
            var _y = y;
            var _r = (x + w);
            var _b = (y + h);

            this._s();
            this._m(_x, _y);
            this._l(_r, _y);
            this._l(_r, _b);
            this._l(_x, _b);
            this._l(_x, _y);
        }
    },

    TableRect : function(x,y,w,h)
    {
        this.rect(x,y,w,h);
        this.df();
    },

    // функции клиппирования
    AddClipRect : function(x, y, w, h)
    {
        /*
         this.b_color1(0, 0, 0, 255);
         this.rect(x, y, w, h);
         this.df();
         return;
         */

        var __rect = new _rect();
        __rect.x = x;
        __rect.y = y;
        __rect.w = w;
        __rect.h = h;
        this.GrState.AddClipRect(__rect);
    },

    RemoveClipRect : function()
    {
        //this.ClipManager.RemoveRect();
    },

    SetClip : function(r)
    {
        //this._s();
    },

    RemoveClip : function()
    {
    },

    GetTransform : function()
    {
        return this.m_oTransform;
    },
    GetLineWidth : function()
    {
        return 0;
    },
    GetPen : function()
    {
        return 0;
    },
    GetBrush : function()
    {
        return 0;
    },

    drawFlowAnchor : function(x, y)
    {
    },

    SavePen : function()
    {
        this.GrState.SavePen();
    },
    RestorePen : function()
    {
        this.GrState.RestorePen();
    },

    SaveBrush : function()
    {
        this.GrState.SaveBrush();
    },

    RestoreBrush : function()
    {
        this.GrState.RestoreBrush();
    },

    SavePenBrush : function()
    {
        this.GrState.SavePenBrush();
    },
    RestorePenBrush : function()
    {
        this.GrState.RestorePenBrush();
    },

    SaveGrState : function()
    {
        this.GrState.SaveGrState();
    },
    RestoreGrState : function()
    {
        this.GrState.RestoreGrState();
    },

    StartClipPath : function()
    {
        this.private_removeVectors();
    },

    EndClipPath : function()
    {
        this.private_restoreVectors();
    },

    SetTextPr : function(textPr, theme)
    {
        var bNeedGetPath = false;
        if(!this.CheckCompareFillBrush(textPr, this.m_oTextPr))
        {
            bNeedGetPath = true;
        }
        this.m_oTextPr = textPr;
        if(bNeedGetPath)
        {
            this.Get_PathToDraw(false, true);
        }
        if (theme)
            this.m_oGrFonts.checkFromTheme(theme.themeElements.fontScheme, this.m_oTextPr.RFonts);
        else
            this.m_oGrFonts = this.m_oTextPr.RFonts;
    },

    CheckCompareFillBrush: function(oTextPr1, oTextPr2)
    {
        if(!oTextPr1 && oTextPr2 || oTextPr1 && !oTextPr2)
            return false;
        if(oTextPr1 && oTextPr2)
        {
            var oFill1 = this.GetFillFromTextPr(oTextPr1);
            var oFill2 = this.GetFillFromTextPr(oTextPr2);
            if(!CompareBrushes(oFill1, oFill2))
                return false;
            var oPen1 = this.GetPenFromTextPr(oTextPr1);
            var oPen2 = this.GetPenFromTextPr(oTextPr2);
            if(!CompareBrushes(oPen1, oPen2))
                return false;
        }
        return true;
    },

    GetFillFromTextPr: function(oTextPr)
    {
        if(oTextPr)
        {
            if(oTextPr.TextFill)
            {
                return oTextPr.TextFill;
            }
            if(oTextPr.Unifill)
            {
                return oTextPr.Unifill;
            }
            if(oTextPr.Color)
            {
                return CreateUnfilFromRGB(oTextPr.Color.r, oTextPr.Color.g, oTextPr.Color.b)
            }
            return null;
        }
        else
        {
            if(this.m_oBrush.Color1.R !== -1)
            {
                var Color = this.m_oBrush.Color1;
                return CreateUniFillByUniColor(CreateUniColorRGB(Color.R, Color.G, Color.B));
            }
            else
            {
                return CreateUniFillByUniColor(CreateUniColorRGB(0, 0, 0));
            }
        }
    },

    GetPenFromTextPr: function(oTextPr)
    {
        if(oTextPr)
        {
            return oTextPr.TextOutline;
        }
        return null;
    },



    GetTextPr : function()
    {
        return this.m_oTextPr;
    },

    DrawPresentationComment : function(type, x, y, w, h)
    {
    },

    private_removeVectors : function()
    {
    },

    private_restoreVectors : function()
    {
    }
};


function PolygonWrapper(oPolygon)
{
    this.oPolygon = oPolygon;
    var dCurLen = 0;
    this.aLength = [];
    this.aLength[0] = 0;
    var oPrevPoint = oPolygon[0], oCurPoint, dDX, dDY;
    for(var i = 1; i < oPolygon.length; ++i)
    {
        oCurPoint = oPolygon[i];
        dDX = oCurPoint.x - oPrevPoint.x;
        dDY = oCurPoint.y - oPrevPoint.y;
        dCurLen += Math.sqrt(dDX* dDX + dDY*dDY);
        this.aLength[i] = dCurLen;
        oPrevPoint = oCurPoint;
    }
    this.dLen = dCurLen;
    this.nPointsCount = this.aLength.length;
}

PolygonWrapper.prototype.getPointOnPolygon = function(dCT)
{
    var dFindLen = this.dLen * dCT;
    var nIndex = this.nPointsCount >> 1;
    var nStartIndex = 0, nDelta = nIndex - nStartIndex, dNextBool, nTempIndex;
    nTempIndex = nIndex + 1;
    dNextBool = (nTempIndex < this.nPointsCount) && (this.aLength[nTempIndex] <= dFindLen);
    while(nDelta > 0 && (this.aLength[nIndex] > dFindLen || dNextBool))
    {
        if(dNextBool)
        {
            nStartIndex = nIndex;
        }
        nIndex  = nStartIndex + (nDelta >> 1);
        nTempIndex = nIndex + 1;
        dNextBool = (nTempIndex < this.nPointsCount) && (this.aLength[nTempIndex] <= dFindLen);
        nDelta = nIndex - nStartIndex;
    }
    if(nTempIndex === this.nPointsCount)
    {
        --nTempIndex;
        --nIndex;
    }
    var t;
    var dDiv = this.aLength[nTempIndex] - this.aLength[nIndex];
    if(dDiv !== 0)
    {
        t = (dFindLen - this.aLength[nIndex])/dDiv;
    }
    else
    {
        t = 0;
    }
    var oPoint1 = this.oPolygon[nIndex], oPoint2 = this.oPolygon[nTempIndex];
    return {x: oPoint1.x + t*(oPoint2.x - oPoint1.x ), y: oPoint1.y + t*(oPoint2.y - oPoint1.y )};
};

function CheckPointByPaths(dX, dY, dWidth, dHeight, dMinX, dMinY, oPolygonWrapper1, oPolygonWrapper2)
{
    var cX, cY, point, topX, topY, bottomX, bottomY;
    cX = (dX - dMinX)/dWidth;
    cY = (dY - dMinY)/dHeight;
    if(cX > 1)
    {
        cX = 1;
    }
    if(cX < 0)
    {
        cX = 0;
    }
    point = oPolygonWrapper1.getPointOnPolygon(cX);
    topX = point.x;
    topY = point.y;
    point = oPolygonWrapper2.getPointOnPolygon(cX);
    bottomX = point.x;
    bottomY = point.y;
    return {x: topX + cY*(bottomX - topX), y: topY + cY*(bottomY - topY)};
}
function ObjectsToDrawBetweenTwoPolygons(aObjectsToDraw, oBoundsController, oPolygonWrapper1, oPolygonWrapper2)
{
    var i, j, t, dMinX = oBoundsController.min_x, dMinY = oBoundsController.min_y, aPathLst, dWidth = oBoundsController.max_x - oBoundsController.min_x, dHeight = oBoundsController.max_y - oBoundsController.min_y;
    var oCommand, oPoint, oPath;
    for(i = 0; i < aObjectsToDraw.length; ++i)
    {

        aPathLst = aObjectsToDraw[i].geometry.pathLst;
        for(t = 0; t < aPathLst.length; ++t)
        {
            oPath = aPathLst[t];
            for(j = 0; j < oPath.ArrPathCommand.length; ++j)
            {
                oCommand = oPath.ArrPathCommand[j];
                switch(oCommand.id)
                {
                    case moveTo:
                    case lineTo:
                    {
                        oPoint = CheckPointByPaths(oCommand.X, oCommand.Y, dWidth, dHeight, dMinX, dMinY, oPolygonWrapper1, oPolygonWrapper2);
                        oCommand.X = oPoint.x;
                        oCommand.Y = oPoint.y;
                        break;
                    }

                    case bezier3:
                    {
                        oPoint = CheckPointByPaths(oCommand.X0, oCommand.Y0, dWidth, dHeight, dMinX, dMinY, oPolygonWrapper1, oPolygonWrapper2);
                        oCommand.X0 = oPoint.x;
                        oCommand.Y0 = oPoint.y;
                        oPoint = CheckPointByPaths(oCommand.X1, oCommand.Y1, dWidth, dHeight, dMinX, dMinY, oPolygonWrapper1, oPolygonWrapper2);
                        oCommand.X1 = oPoint.x;
                        oCommand.Y1 = oPoint.y;
                        break;
                    }
                    case bezier4:
                    {
                        oPoint = CheckPointByPaths(oCommand.X0, oCommand.Y0, dWidth, dHeight, dMinX, dMinY, oPolygonWrapper1, oPolygonWrapper2);
                        oCommand.X0 = oPoint.x;
                        oCommand.Y0 = oPoint.y;
                        oPoint = CheckPointByPaths(oCommand.X1, oCommand.Y1, dWidth, dHeight, dMinX, dMinY, oPolygonWrapper1, oPolygonWrapper2);
                        oCommand.X1 = oPoint.x;
                        oCommand.Y1 = oPoint.y;
                        oPoint = CheckPointByPaths(oCommand.X2, oCommand.Y2, dWidth, dHeight, dMinX, dMinY, oPolygonWrapper1, oPolygonWrapper2);
                        oCommand.X2 = oPoint.x;
                        oCommand.Y2 = oPoint.y;
                        break;
                    }
                    case arcTo:
                    {
                        break;
                    }
                    case close:
                    {
                        break;
                    }
                }
            }

        }
    }
}

function CompareBrushes(oFill1, oFill2)
{
    if(oFill1 && !oFill2 || !oFill1 && oFill2 || (oFill1 && oFill2 && !oFill1.IsIdentical(oFill2)))
        return false;
    return true;
}
function ComparePens(oPen1, oPen2)
{
    if(oPen1 && !oPen2 || !oPen1 && oPen2 || (oPen1 && oPen2 && !oPen1.IsIdentical(oPen2)))
        return false;
    return true;
}